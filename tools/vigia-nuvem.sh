#!/bin/bash
# Vigia diário da nuvem (21/11/2026, NUVEM; dono: "Faça 1 e 2"). Só lê, não muda nada:
# (1) a sonda das portas no ar, (2) os erros das funções nas últimas 24 h, (3) o selo do App Check de ontem.
# Escreve o resumo em /tmp/vigia.txt (o workflow manda como recado para a NUVEM no status).
R=/tmp/vigia.txt; : > $R
if bash tools/sonda-nuvem.sh > /tmp/sonda.txt 2>&1; then echo "portas: ok ($(grep -c '  ok ' /tmp/sonda.txt) conferências)" >> $R
else echo "portas: FALHA — $(grep 'FALHA' /tmp/sonda.txt | head -5 | sed 's/^ *//' | tr '\n' ';')" >> $R; fi
# erros das funções (as funções v2 rodam no Cloud Run): agrupa pela primeira linha da mensagem
if gcloud logging read 'severity>=ERROR AND resource.type="cloud_run_revision"' --freshness=1d --limit=200 --project=lafouch-2f6bd \
     --format='value(resource.labels.service_name,textPayload)' > /tmp/erros.txt 2>/tmp/erros.err; then
  N=$(grep -c . /tmp/erros.txt)
  if [ "$N" = 0 ]; then echo "erros das funções (24 h): nenhum" >> $R
  else echo "erros das funções (24 h): $N — $(cut -c1-90 /tmp/erros.txt | sort | uniq -c | sort -rn | head -6 | sed 's/^ *//' | tr '\n' ';')" >> $R; fi
else echo "erros das funções: sem permissão para ler o registro ($(head -c 120 /tmp/erros.err))" >> $R; fi
# selo do App Check de ontem (dia do Paraguai)
D=$(TZ=America/Asuncion date -d yesterday +%F); T=$(gcloud auth print-access-token)
curl -s -H "Authorization: Bearer $T" "https://firestore.googleapis.com/v1/projects/lafouch-2f6bd/databases/(default)/documents/seloDia/$D" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); f=d.get('fields',{}); print('selo de $D: ' + (', '.join(k+'='+v.get('integerValue','0') for k,v in sorted(f.items())) or 'sem contagem'))" >> $R
cat $R
