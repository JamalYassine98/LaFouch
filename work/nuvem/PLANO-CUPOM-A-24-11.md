# Cupom (a) — plano da NUVEM · 24/11/2026 (refeito 11:14)

Dono 24/11 11:14: **o site tem as regras dele, já decididas, e NÃO muda.** O que muda são os cupons que o dono dá na
LOJA FÍSICA (caixa do app). Origem: IMPLEMENTAR 23/11 13:55; regras 23/11 09:36–10:19; esboços 78, 98 v6, 97a.
Uma parte por vez; testes da nuvem antes; publicar só com o OK (1b). O site (proxima/confirma/entregue/solta) fica como está.

## Regras da Próxima compra da LOJA (cupom que hoje sai à mão pelo 'emitir px' do caixa)
- Ganha, não se dá: só nasce quando a venda da loja fecha a regra — total pago ≥ G$ 150.000 ou peça da linha Luxo
  (em data festiva com "sem mínimo", toda venda paga). Ninguém cria à mão.
- Só com cliente cadastrado (telefone).
- Um por vez por conta: se o telefone já tem Próxima compra viva e não usada, não nasce outro.
- Começa 7 dias depois da venda e vale 30. Sempre 10% (dono 24/11 11:10: o piso do Titan cobre cupom + taxa).
- Valores sem arredondar: degraus da escada em múltiplos de G$ 10.000 (dono 23/11 10:19).

## Partes
1. NUVEM: ação nova `loja` no lugar do `emitir px` (só o dono): recebe venda (id, total, itens com linha, telefone) e aplica
   as regras acima; `emitir` deixa de aceitar `px`. Provas no teste-cupom.js. Site intocado (prova de que proxima/entregue não mudam).
2. APP: depois da venda, chamar `loja` (a APP já sabe a linha da peça e o total); some o "criar cartão" à mão.
3. Caixa — um desconto por venda, nada em OFERTA, só cadastrado (98 v6): conferir no `usar` do caixa com os itens.
4. Datas festivas na loja: config/site.evento {ini, fim, semMin} lido pela ação `loja`.
