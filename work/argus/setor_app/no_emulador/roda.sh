#!/bin/bash
# ARGUS · setor App · roda NO GITHUB, dentro do Android emulado: tela do tamanho do celular do dono (Xiaomi 13T: 1221×2712, 3 pontos
# por pixel = 407×904), tema $1 (claro|escuro) e as 3 letras do app (font_scale 1,0 · 1,15 · 1,3 — a letra de verdade do Android).
T=$1; APK=android/app/build/outputs/apk/debug/app-debug.apk; OUT=argus_android; mkdir -p $OUT
A(){ timeout 90 adb "$@"; }
sleep 45; A wait-for-device; for i in $(seq 1 40); do [ "$(A shell getprop sys.boot_completed | tr -d '\r')" = 1 ] && break; sleep 5; done; sleep 15
A shell wm size 1221x2712; A shell wm density 480
A shell setprop persist.sys.timezone America/Asuncion; A shell cmd alarm set-timezone America/Asuncion 2>/dev/null   # o fuso da loja, como no celular do dono
for i in $(seq 1 12); do sleep 8; A shell pm list packages >/dev/null 2>&1 && A install -r $APK && break; done
A shell pm grant com.lafouch.app android.permission.POST_NOTIFICATIONS
if [ "$T" = escuro ]; then A shell cmd uimode night yes; else A shell cmd uimode night no; fi
for L in 1.0 1.15 1.3; do
  A shell settings put system font_scale $L
  A shell am force-stop com.lafouch.app; sleep 2
  for i in $(seq 1 12); do A shell am start -W -n com.lafouch.app/.MainActivity && break; sleep 8; done; sleep 12
  ARGUS_PLANTAS=$ARGUS_PLANTAS timeout 1500 python3 work/argus/setor_app/no_emulador/coleta.py $OUT $T $L || echo "coleta $T $L falhou"
done
A shell wm size reset; A shell wm density reset
A logcat -d -t 8000 > $OUT/$T-logcat.txt
exit 0
