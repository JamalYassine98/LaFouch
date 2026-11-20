✅ v566 (19/11) — grava em reservasTok E ainda em reservas/ (o site antigo lê de lá); tirar o de reservas/ junto com o item 11 · APP · pedido 19/11 15:29
**S1/S2 parte 2 — APP** (depois do item 8 publicado): `pedReserva(p, {pago:true, tok})` (src/95-pedidos.js ~649) grava o `tok` em `reservasTok/<sid>` (o `pago` continua em `reservas/`). Ler o token: o app já tem `p.tok`
