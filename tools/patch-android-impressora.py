#!/usr/bin/env python3
"""Instala o plugin das impressoras térmicas (LfPrinter) no projeto Android gerado pelo `npx cap add android`.
- copia android-extra/LfPrinterPlugin.java para o pacote com.lafouch.app
- registra o plugin na MainActivity
- acrescenta as permissões de Bluetooth e rede no AndroidManifest
Uso: python3 tools/patch-android-impressora.py android"""
import os, re, shutil, sys

andr = sys.argv[1] if len(sys.argv) > 1 else 'android'
pkg = os.path.join(andr, 'app/src/main/java/com/lafouch/app')
os.makedirs(pkg, exist_ok=True)
shutil.copy('android-extra/LfPrinterPlugin.java', os.path.join(pkg, 'LfPrinterPlugin.java'))
shutil.copy('android-extra/LfSharePlugin.java', os.path.join(pkg, 'LfSharePlugin.java'))  # v427: compartilhar direto no app
for f in ('LfNotifPlugin.java', 'LfNotifService.java', 'LfBarsPlugin.java'):  # v450: PIX automático pelo Nubank · v464: barras do Android no tema
    shutil.copy('android-extra/' + f, os.path.join(pkg, f))

# MainActivity: registerPlugin antes do super.onCreate
ma = os.path.join(pkg, 'MainActivity.java')
s = open(ma).read()
if 'LfPrinterPlugin' not in s:
    if 'onCreate' in s:
        s = re.sub(r'(public void onCreate\([^)]*\)\s*\{)', r'\1\n        registerPlugin(LfPrinterPlugin.class);', s, count=1)
    else:
        s = re.sub(r'(public class MainActivity extends BridgeActivity\s*\{)',
                   r'\1\n    @Override\n    public void onCreate(android.os.Bundle savedInstanceState) {\n        registerPlugin(LfPrinterPlugin.class);\n        super.onCreate(savedInstanceState);\n    }\n', s, count=1)
    open(ma, 'w').write(s)
assert 'registerPlugin(LfPrinterPlugin.class)' in s, 'MainActivity sem o plugin'
if 'LfSharePlugin' not in s:
    s = s.replace('registerPlugin(LfPrinterPlugin.class);', 'registerPlugin(LfPrinterPlugin.class);\n        registerPlugin(LfSharePlugin.class);', 1)
    open(ma, 'w').write(s)
assert 'registerPlugin(LfSharePlugin.class)' in s, 'MainActivity sem o LfShare'
if 'LfNotifPlugin' not in s:
    s = s.replace('registerPlugin(LfSharePlugin.class);', 'registerPlugin(LfSharePlugin.class);\n        registerPlugin(LfNotifPlugin.class);', 1)
    open(ma, 'w').write(s)
assert 'registerPlugin(LfNotifPlugin.class)' in s, 'MainActivity sem o LfNotif'
if 'LfBarsPlugin' not in s:
    s = s.replace('registerPlugin(LfNotifPlugin.class);', 'registerPlugin(LfNotifPlugin.class);\n        registerPlugin(LfBarsPlugin.class);', 1)
    open(ma, 'w').write(s)
assert 'registerPlugin(LfBarsPlugin.class)' in s, 'MainActivity sem o LfBars'

# Permissões
mf = os.path.join(andr, 'app/src/main/AndroidManifest.xml')
m = open(mf).read()
perms = [
    '<uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />',
    '<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30" />',
    '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" android:maxSdkVersion="30" />',
    '<uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" />',
    '<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />',
    '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />',
    '<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />',
    '<uses-feature android:name="android.hardware.bluetooth" android:required="false" />',
]
add = [p for p in perms if re.search(r'android:name="([^"]+)"', p).group(1) not in m]
if add:
    m = m.replace('<application', '\n    '.join(add) + '\n    <application', 1)
    open(mf, 'w').write(m)
# v427: o app pode ver se WhatsApp Business, WhatsApp e Instagram estão instalados (Android 11+)
if '<queries>' not in m:
    q = '<queries>\n        <package android:name="com.whatsapp.w4b" />\n        <package android:name="com.whatsapp" />\n        <package android:name="com.instagram.android" />\n    </queries>\n    '
    m = m.replace('<application', q + '<application', 1)
    open(mf, 'w').write(m)
# v450: serviço que lê só as notificações do Nubank (o dono liga o acesso no Android)
m = open(mf).read()
if 'LfNotifService' not in m:
    sv = ('<service android:name=".LfNotifService" android:exported="true" '
          'android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE">\n'
          '            <intent-filter><action android:name="android.service.notification.NotificationListenerService" /></intent-filter>\n'
          '        </service>\n    ')
    m = m.replace('</application>', '    ' + sv + '</application>', 1)
    open(mf, 'w').write(m)
print('LfPrinter, LfShare, LfNotif e LfBars instalados;', len(add), 'permissões novas')
