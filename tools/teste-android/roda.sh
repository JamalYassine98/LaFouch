#!/bin/bash
# S385: instala e abre o app no Android emulado e tira os prints de UM tema ($1 = claro|escuro).
# Tudo com tempo máximo: o emulador do GitHub às vezes trava, e o que já saiu tem de ser guardado.
T=$1; APK=android/app/build/outputs/apk/debug/app-debug.apk; mkdir -p prints
A(){ timeout 90 adb "$@"; }
sleep 60; A wait-for-device; for i in $(seq 1 40); do [ "$(A shell getprop sys.boot_completed | tr -d '\r')" = 1 ] && break; sleep 5; done; sleep 20
for i in $(seq 1 12); do sleep 10; A shell pm list packages >/dev/null 2>&1 && A install -r $APK && break; done
A shell pm grant com.lafouch.app android.permission.POST_NOTIFICATIONS
if [ "$T" = escuro ]; then A shell cmd uimode night yes; else A shell cmd uimode night no; fi
for i in $(seq 1 12); do A shell am start -W -n com.lafouch.app/.MainActivity && break; sleep 10; done; sleep 15
PARTE=$2 timeout 1800 python3 tools/teste-android/fotos.py prints $T
A logcat -d -t 20000 > prints/$T-logcat.txt
exit 0
