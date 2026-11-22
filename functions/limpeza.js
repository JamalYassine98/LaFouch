// Retenção (bloco 5 item 8, aprovado 11/11/2026): pedidos e mensagens com mais de 12 meses perdem o telefone e o e-mail.
// Também some o e-mail dos "Avisarme cuando vuelva" antigos e os avisos de login antigos. Roda sozinho 1 vez por dia.
// Regra pura: db.velhos(colecao, antesDe) -> [{id, ...}] · db.muda(colecao, id, campos) · db.apaga(colecao, id)
const ANO = 365 * 864e5;
const CAMPOS = { pedidos: ['tel', 'email'], mensagens: ['tel', 'email'] };
async function limpa(db, agora) {
  const antes = agora - ANO, r = { pedidos: 0, mensagens: 0, voltas: 0, logins: 0 };
  for (const col of Object.keys(CAMPOS)) {
    for (const d of await db.velhos(col, antes)) {
      if (d.limpo) continue;
      const c = { limpo: true };
      let tem = false;
      for (const k of CAMPOS[col]) if (d[k]) { c[k] = ''; tem = true; }
      if (tem) { await db.muda(col, d.id, c); r[col]++; }
    }
  }
  for (const d of await db.velhos('voltas', antes)) { await db.apaga('voltas', d.id); r.voltas++; }
  for (const d of await db.velhos('logins', antes)) { await db.apaga('logins', d.id); r.logins++; }
  // S393: cópias de pedido para o e-mail do "pago" que nunca foram pagas (30 dias)
  r.pedidoMail = 0;
  for (const d of await db.velhos('pedidoMail', agora - 30 * 864e5)) { await db.apaga('pedidoMail', d.id); r.pedidoMail++; }
  // S400: marcas de pedido entregue (só servem para disparar o presente uma vez)
  r.entregas = 0;
  for (const d of await db.velhos('entregas', agora - 30 * 864e5)) { await db.apaga('entregas', d.id); r.entregas++; }
  // S3 (20/11): contadores de limite da hora passada e marcas de pedido recebido de mais de 60 dias
  r.limite = 0; r.pedidoIds = 0;
  for (const d of await db.velhos('limite', agora - 864e5)) { await db.apaga('limite', d.id); r.limite++; }
  for (const d of await db.velhos('pedidoIds', agora - 60 * 864e5)) { await db.apaga('pedidoIds', d.id); r.pedidoIds++; }
  // 22/11: reservas por rede da última hora (suspeita) e suspeitas com mais de 7 dias
  r.redeRes = 0; r.suspeitas = 0;
  for (const d of await db.velhos('redeRes', agora - 864e5)) { await db.apaga('redeRes', d.id); r.redeRes++; }
  for (const d of await db.velhos('suspeitas', agora - 7 * 864e5)) { await db.apaga('suspeitas', d.id); r.suspeitas++; }
  // S5 (20/11): inscrição nas novidades que ninguém confirmou em 7 dias (o link venceu) — some
  r.inscricoes = 0;
  for (const d of await db.velhos('inscricoes', agora - 7 * 864e5)) { if (d.conf !== true) { await db.apaga('inscricoes', d.id); r.inscricoes++; } }
  return r;
}
module.exports = { limpa, ANO, CAMPOS };
