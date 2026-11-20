#!/bin/bash
# Conferência da nuvem NO AR (20/11/2026): cada porta pública responde como o teste-portas.js espera,
# sem login e sem gravar nada (só método errado, ação inválida e o CORS do site). Roda no fim do "Publicar a nuvem"
# e sozinho pelo workflow "Conferir a nuvem". Sai com erro se alguma porta responder diferente.
B=https://southamerica-east1-lafouch-2f6bd.cloudfunctions.net
falhas=0
confere() { # nome  esperado  obtido
  if [ "$2" = "$3" ]; then echo "  ok     $1 ($3)"; else echo "  FALHA  $1: esperado $2, veio $3"; falhas=$((falhas+1)); fi
}
for f in reserva midia codigo novidades mensagem analise volta login conta cupom pix seg atacado pedido; do
  confere "$f GET" 405 "$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 "$B/$f")"
done
confere "avaliacao GET sem peça" 400 "$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 "$B/avaliacao")"
confere "comprovante GET sem código" 404 "$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 "$B/comprovante")"
post() { curl -s -o /dev/null -w '%{http_code}' --max-time 30 -X POST -H "Content-Type: $2" -d "$3" "$B/$1"; }
confere "reserva ação inválida" 400 "$(post reserva application/json '{"acao":"xyz"}')"
confere "reserva ação inválida em texto" 400 "$(post reserva text/plain '{"acao":"xyz"}')"
confere "reserva pagar sem login" 403 "$(post reserva application/json '{"acao":"pagar"}')"
confere "cupom ação do dono sem login" 403 "$(post cupom application/json '{"acao":"lista"}')"
confere "conta ação inválida" 400 "$(post conta application/json '{"acao":"xyz"}')"
confere "codigo sem login" 401 "$(post codigo application/json '{"acao":"enviar"}')"
confere "mensagem lista sem login" 403 "$(post mensagem application/json '{"acao":"lista"}')"
confere "pedido com formato errado" 400 "$(post pedido application/json '{"id":"x","doc":{}}')"
confere "pix sem a chave do robô" 403 "$(post pix application/json '{}')"
# S3 parte 3 (20/11): ninguém cria direto em pedidos/ nem em vistas/ pelo banco (só pelas funções) — chave pública do site, não é segredo
FS='https://firestore.googleapis.com/v1/projects/lafouch-2f6bd/databases/(default)/documents'; K='AIzaSyAW-54tS1A_VL2EC9OJWFsw1EtboptpEvc'
confere "banco: criar pedido direto é recusado" 403 "$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 -X POST -H 'Content-Type: application/json' -d '{"fields":{"nome":{"stringValue":"sonda"}}}' "$FS/pedidos?documentId=sonda$(date +%s)&key=$K")"
confere "banco: gravar vista direto é recusado" 403 "$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 -X PATCH -H 'Content-Type: application/json' -d '{"fields":{"ts":{"integerValue":"1"},"r":{"mapValue":{}}}}' "$FS/vistas/vsonda$(date +%s)?key=$K")"
cors() { curl -s -D - -o /dev/null --max-time 30 -X OPTIONS -H "Origin: $2" -H 'Access-Control-Request-Method: POST' "$B/$1" | tr -d '\r' | awk -F': ' 'tolower($1)=="access-control-allow-origin"{print $2}'; }
for f in reserva conta mensagem atacado; do
  confere "$f aceita o site" "https://lafouch.com" "$(cors $f https://lafouch.com)"
  confere "$f recusa site estranho" "" "$(cors $f https://estranho.exemplo)"
done
echo "sonda: $falhas falha(s)"
exit $((falhas > 0))
