#!/bin/bash
# Teste do SITE contra a nuvem de verdade (itens 9 e 20 da Fila). Não muda peça, pedido nem conta:
# confere que cada função aceita a chamada do site COM o selo (pré-voo do navegador) e as respostas de entrada errada.
B=https://southamerica-east1-lafouch-2f6bd.cloudfunctions.net
O=https://lafouch.com
F=0
for f in cupom mensagem conta volta analise novidades avaliacao atacado codigo reserva pedido; do
  for m in POST GET; do
    [ $m = GET ] && [ $f != avaliacao ] && continue
    H=$(curl -s -o /dev/null -D - -X OPTIONS "$B/$f" -H "Origin: $O" -H "Access-Control-Request-Method: $m" -H "Access-Control-Request-Headers: content-type,x-firebase-appcheck,authorization" | tr -d '\r' | tr 'A-Z' 'a-z')
    S=$(echo "$H" | head -1 | cut -d' ' -f2)
    AO=$(echo "$H" | grep '^access-control-allow-origin:' | cut -d' ' -f2)
    AH=$(echo "$H" | grep '^access-control-allow-headers:' | cut -d' ' -f2-)
    if [[ "$S" =~ ^2 ]] && [[ "$AO" == "$O" || "$AO" == "*" ]] && [[ "$AH" == *x-firebase-appcheck* ]]; then echo "ok    pre-voo $f ($m): $S origem=$AO"; else echo "FALHA pre-voo $f ($m): status=$S origem=$AO cabecalhos=$AH"; F=1; fi
  done
done
p(){ curl -s -X POST "$B/$1" -H "Origin: $O" -H 'Content-Type: application/json' -H 'X-Firebase-AppCheck: selo-de-teste-invalido' -d "$2"; }
t(){ if [[ "$2" == *"$3"* ]]; then echo "ok    $1 -> $2"; else echo "FALHA $1 -> $2 (esperado conter $3)"; F=1; fi; }
t 'conta livre nao existe mais (a nuvem tirou na parte 3)' "$(p conta '{"acao":"livre","user":"teste.porteiro.zz"}')" '"motivo":"acao"'
t 'conta entrar (nome que nao existe, senha errada)' "$(p conta '{"acao":"entrar","user":"teste.porteiro.zz","senha":"errada-de-proposito"}')" '"motivo":"login"'
t 'conta entrar sem senha'                       "$(p conta '{"acao":"entrar","user":"teste.porteiro.zz"}')" '"motivo":"dados"'
t 'reserva token (pedido invalido)'              "$(p reserva '{"acao":"token","pedido":"x","tel":"000"}')" '"motivo":"pedido"'
R=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$B/pedido" -H "Origin: $O" -H 'Content-Type: application/json' -d '{}'); t 'pedido vazio é recusado (formato)' "$R" 400
R=$(curl -s -o /dev/null -w '%{http_code}' "$B/avaliacao?ref=AC1050" -H "Origin: $O" -H 'X-Firebase-AppCheck: selo-de-teste-invalido'); t 'avaliacao (ler) com selo invalido ainda responde' "$R" 200
[ $F = 0 ] && echo 'RESULTADO: tudo certo' || echo 'RESULTADO: FALHOU'
exit $F
