# Cupom (a) — plano da NUVEM em partes · 24/11/2026

Origem: IMPLEMENTAR do dono 23/11 13:55 (recado ESBOCO 23/11 10:24; esboços work/s435/oferta96/ 97a e 98 v6).
Regra 3: uma parte por vez, testes da nuvem antes; publicar só com o OK (1b). Nenhuma parte muda tela sozinha.

## a1 — Próxima compra nasce só pela regra (só nuvem, site)
- `proxima` (site) só cria o cartão se o pedido CONFERIDO pelo servidor (ficha pixEspera/<pedido>) tiver valor ≥ G$ 150.000
  ou alguma peça da linha Luxo (campo `linha` em produtos/ — ver a2).
- Um ativo por conta: se o telefone/e-mail já tem Próxima compra viva e não usada, não nasce outra (responde o que já existe).
- Começa 7 dias depois da confirmação do pagamento e vale 30 (`ini` = pago + 7 d; `fim` = ini + 30 d). Hoje: vale 120 dias desde já.
- % = 10 sempre (dono 24/11 11:10: o piso do Titan cobre custo + margem + 10% + taxa do pagamento). Nunca abaixo do mínimo: o piso
  na hora do uso (conferePedido / Presente.confere).
- Provas novas no teste-cupom.js (150 mil −1, Luxo, segundo cartão, 7+30 dias, pct inválido).

## a2 — Caixa (nuvem + APP)
- `emitir` deixa de aceitar `px` (ninguém dá à mão). O app, depois da venda, chama `proxima` com origem loja
  (`loja:<idVenda>`, itens, total) e a nuvem aplica a mesma regra da a1.
- APP publica `linha` (Econômica/Intermediária/Luxo) em produtos/ — a nuvem só lê.

## a3 — Um desconto por venda, nada em OFERTA, só cliente cadastrado
- Site: conferePedido recusa cupom em pedido com peça em OFERTA e mais de um desconto (cupom + 3ª peça).
- Caixa: `usar`/`caixa` recebe os itens e recusa peça em OFERTA; exige telefone do cliente cadastrado.
- OFERTA vale na loja e no site: o preço de oferta mora em produtos/ (um lugar só), o app lê o mesmo campo.

## a4 — Datas festivas
- config/site.evento: `{ id, ini, fim, semMin: true, evPct }` gravado pelo app (Temática › data).
- Durante a data, `proxima` ignora o mínimo de G$ 150.000 (semMin).
- Cupom do evento na conta de todos: `meus` mostra o cupom da data a toda cliente logada (sem código público);
  1 uso por conta (telefone/e-mail), conferido no `usar`.

## a5 — Valor em milhares exatos
- Desconto = pct × total, ARREDONDADO PARA BAIXO ao milhar (decisão pendente do dono, abaixo).

## Perguntas ao dono (antes da a1)
1. ~~5% e arredondamento~~ — resolvido: 10% sempre (dono 24/11 11:10).
2. Compra na loja (balcão) de G$ 150.000 ou mais também ganha a Próxima compra? (proposta: sim, mesma regra)
