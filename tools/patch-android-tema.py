#!/usr/bin/env python3
"""Deixa a janela inicial do Android (antes do app aparecer) na cor do app, sem o cinza.
Uso: python3 tools/patch-android-tema.py android/app/src/main/res"""
import re, sys, os
res = sys.argv[1]
os.makedirs(res + '/values', exist_ok=True)
os.makedirs(res + '/values-night', exist_ok=True)
open(res + '/values/lf_colors.xml', 'w').write('<?xml version="1.0" encoding="utf-8"?>\n<resources><color name="lf_bg">#f4f1f4</color></resources>\n')
open(res + '/values-night/lf_colors.xml', 'w').write('<?xml version="1.0" encoding="utf-8"?>\n<resources><color name="lf_bg">#0f1216</color></resources>\n')
p = res + '/values/styles.xml'
s = open(p).read()
ITENS = '\n        <item name="android:windowBackground">@color/lf_bg</item>\n        <item name="android:background">@color/lf_bg</item>'
def conserta(m):
    nome, attrs, corpo = m.group(1), m.group(2), m.group(3)
    if nome not in ('AppTheme', 'AppTheme.NoActionBar', 'AppTheme.NoActionBarLaunch'):
        return m.group(0)
    corpo = re.sub(r'\s*<item name="android:(windowBackground|background)">[^<]*</item>', '', corpo)
    extra = ITENS
    if nome == 'AppTheme.NoActionBarLaunch':
        extra += '\n        <item name="windowSplashScreenBackground">@color/lf_bg</item>'
    return '<style name="%s"%s>%s%s\n    </style>' % (nome, attrs, corpo.rstrip(), extra)
s2 = re.sub(r'<style name="([^"]+)"([^>]*)>(.*?)</style>', conserta, s, flags=re.S)
open(p, 'w').write(s2)
print(s2)
