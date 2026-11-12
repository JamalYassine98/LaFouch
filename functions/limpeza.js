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
  return r;
}
module.exports = { limpa, ANO, CAMPOS };
