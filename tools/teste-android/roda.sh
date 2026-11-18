#!/bin/bash
# S385: instala e abre o app no Android emulado, com novas tentativas (o Android demora a ficar pronto).
# o Android emulado às vezes reinicia o sistema logo depois de ligar: espera ficar estável
sleep 60; adb wait-for-device; until [ "$(adb shell getprop sys.boot_completed | tr -d '\r')" = 1 ]; do sleep 5; done; sleep 20
APK=android/app/build/outputs/apk/debug/app-debug.apk
for i in $(seq 1 12); do sleep 10; adb shell pm list packages >/dev/null 2>&1 && adb install -r $APK && break; done
adb shell pm grant com.lafouch.app android.permission.POST_NOTIFICATIONS
mkdir -p prints
abre(){ for i in $(seq 1 12); do adb shell am start -W -n com.lafouch.app/.MainActivity && return 0; sleep 10; done; return 1; }
adb shell cmd uimode night no; abre; sleep 15
python3 tools/teste-android/fotos.py prints claro
adb logcat -d > prints/claro-logcat.txt
adb shell cmd uimode night yes; sleep 3; adb shell am force-stop com.lafouch.app; abre; sleep 15
python3 tools/teste-android/fotos.py prints escuro
adb logcat -d > prints/escuro-logcat.txt
exit 0
