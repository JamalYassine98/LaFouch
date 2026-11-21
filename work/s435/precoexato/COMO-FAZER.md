# Esboço 39: pagamento parte 3, preço exato (pedido da NUVEM, ideia do dono 20/11 12:30) · S435 ESBOCO · 21/11 · celular

Imagens:
- esboco_39a_site_pix.jpg: site › Pague com PIX
- esboco_39b_site_banco.jpg: site › Transferência Banco Familiar
- esboco_39c_app_pix_sem_par_escuro.jpg: app › Pendências + janela "Ligar a um pedido"

Base: site main a8df026 (simulador, servido localmente) · app v587 + todos os aprovados (work/kit/base_app.py).

## O que muda
1. **Site, PIX e Banco Familiar:** o valor a pagar é **o preço do carrinho**, e não o preço menos o "final único" (1–98 centavos no PIX, 1–98 guaranis no
   Banco Familiar). Exemplo: R$ 178,90 no lugar de R$ 178,53, e Gs. 250.000 no lugar de Gs. 249.963.
   O código PIX e o "Copiar" levam o mesmo valor exato. Nenhum texto muda: "Valor", "Valor exato" e os 3 passos ficam como estão.
2. **App, Pendências:** cada PIX ou transferência que a nuvem não conseguiu ligar sozinha (`pixSemPar`) vira uma linha do Guardião:
   - "PIX de R$ 178,90 sem pedido" · "não bate com nenhum pedido aberto · 02:14" → **Ligar ›**
   - "PIX de R$ 120,00 sem pedido" · "bate com 2 pedidos do mesmo valor · 01:40" → **Ligar ›**
   - "PIX de R$ 95,00 · pedido H3P9" · "pagou, mas a peça já foi vendida · 22:05" → **Ver pedido ›**
   Para a transferência: "Transferência de Gs. 250.000 …".
   **Hoje o `S.pixSemPar` é lido da nuvem a cada 20 s (97z-pix-email.js:69) e ninguém mostra:** o aviso nunca chegou ao dono.
3. **Janela de baixo "Ligar a um pedido"** (tarefa: escolher). Em cima, a origem: "PIX de R$ 178,90 · 02:14 · Nubank".
   Depois, PEDIDOS A PAGAR · MESMO VALOR primeiro, OUTROS PEDIDOS A PAGAR depois, em linhas de 64 px com escolha redonda
   (nome do cliente, "reserva até HH:MM" e o valor). Embaixo, um botão rosa "Ligar ao pedido K7Q2".
   Ligar = o mesmo caminho da confirmação automática (Reserva.pagar), sem venda dupla, e a linha some de Pendências.

## Como fazer (jeito natural, regra 12)
- **Nuvem (functions/pix.js, NUVEM):** o pedido guarda **um valor só**, o que a nuvem conferiu (`pixEspera/<pedido>.valor`, já existe).
  O pagamento é achado pelo **valor exato** entre os pedidos com reserva aberta. Havendo mais de um, desempata pelo nome do pagador e pela hora (já existe).
  O que sobrar vai para `pixSemPar` com `motivo`: `'sem-pedido'` (0 candidatos), `'empate'` (≥2) ou `'sem-peca'` (já existe).
  **Sai o final único:** `uq` e `pagar = total − uq` (site), a busca "pagar < valor ≤ total" e o `arred` (pix.js). Não há transição:
  dono 20/11 15:28, tudo é teste.
  *Risco a medir antes (NUVEM):* dois pedidos de mesmo valor ao mesmo tempo, sem nome que desempate, vão para "empate". Antes, o final único resolvia.
  Com isso, o caso passa a ser decidido pelo dono na janela. Contar nos últimos 30 dias de teste quantos empates teriam acontecido.
- **Site (js/lf-site.js, SITE):**
  - `enviarPedido` deixa de sortear `uqGera()`. O pedido manda `total` (e `brl` = o preço em reais do carrinho, como `valorBRL()`).
  - `pkPagar` mostra `e.valor`, que vem da resposta da nuvem (`conferePedido`). Ele não recalcula.
  - Apagar no mesmo passo: `uqGera`, `uq`, `pagar` e o comentário S197. No i18n, as chaves "com os centavos" que não se usam mais.
- **App (APP):**
  - O Guardião ganha um item por documento de `S.pixSemPar` na função de itens das Pendências (`atencaoItens`, 89-dash-abas.js).
    O texto sai do `motivo`, numa tabela só (motivo → frase). Não é uma frase solta em cada lugar.
  - "Ligar ›" abre `lfJanela`. A lista sai dos pedidos do site a pagar (os mesmos que o app já confere).
  - Ligar chama a nuvem (`reserva {acao:'ligar', pix:<id>, pedido:<id>}`, que é para a NUVEM criar). O app nunca grava o "pago" direto.
  - "Ver pedido ›" abre o pedido.
- **Trava no porteiro:**
  - Site: nenhum pedido novo com `uq`; o valor da tela é igual ao total do carrinho.
  - Nuvem: valor exato, 1 candidato → confirma; 2 → `empate`; 0 → `sem-pedido`.
  - App: cada `pixSemPar` vira uma linha; depois de ligar, a linha some e a reserva fica paga uma vez só.

## Ordem sugerida (uma por vez)
NUVEM (busca exata + motivos + ação ligar) → SITE (sem final único) → APP (linhas + janela).
