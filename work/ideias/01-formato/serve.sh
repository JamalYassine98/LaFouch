#!/bin/bash
# remonta as cópias (copias.py) e serve Hoje em 8701 e Proposta em 8702
cd "$(dirname "$0")" && python3 copias.py && pkill -f "http.server 870" ; for p in 8701:ih 8702:ip; do (cd /tmp/${p#*:} && setsid nohup python3 -m http.server ${p%:*} >/dev/null 2>&1 </dev/null &); done; sleep 1
