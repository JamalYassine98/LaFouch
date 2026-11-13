# Roteiro de publicação do servidor (13/11/2026)

Tempo: uns 10 minutos, no Cloud Shell (console.cloud.google.com → ícone `>_` no topo).
Nenhuma senha ou chave vai no chat nem no projeto. As chaves são digitadas só no Cloud Shell, quando ele pedir.

## 1. Baixar a versão nova
```
cd ~/LaFouch 2>/dev/null && git pull || (git clone https://github.com/JamalYassine98/LaFouch.git ~/LaFouch && cd ~/LaFouch)
cd functions && npm install && cd ..
```

## 2. Regras (já conferidas em 13/11 com as do console)
O arquivo `firestore.rules` do projeto já tem TUDO o que o console tinha (inclusive `vistas`) + o novo:
coleções do atacado (contas, preços, pedidos, avisos, lotes, separação), temaEnvios, PIX (espera, sem par, vistos),
cupom no pedido (`cup`, `cupd`) e limite de tamanho nos textos do pedido (o site já corta antes de enviar).
Nada que funciona hoje deixa de funcionar.

## 3. Chave do robô do Pix (só uma vez)
```
firebase functions:secrets:set PIX_ROBO
```
Quando ele pedir o valor, cole uma senha longa inventada na hora (ex.: 30 letras e números). Guarde-a só no Apps Script do robô.
(RESEND_KEY, GH_APP_ID e GH_APP_KEY já foram cadastradas antes. Se o deploy reclamar de alguma, rode o mesmo comando com o nome dela.)

## 4. Publicar
```
firebase deploy --only functions,firestore:rules
```
Se perguntar "apagar funções que não existem mais?", responda **N**.

## 5. Conferir (2 min)
- lafouch.com/atacado?c=SUA_CONTA_TESTE → tocar "+" numa peça → aparece "Tus piezas quedan separadas 29:5x".
- App › Clientes › 📦 Lotes atacado → criar um lote de teste → WhatsApp abre com o link `…&l=…`.
- Uma opinião com link ou telefone → chega para você aprovar no painel (Opiniões).

## O que este deploy liga
atacado (lote, separação de 30 min, avise-me), avaliacao (opiniões suspeitas vão para você), cupom, pix, seg, novidades, e as regras `atacadoLotes`/`atacadoSep`.
