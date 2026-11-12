const L = require('./limpeza');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
(async () => {
  const B = { pedidos: { a: { ts: 1, tel: '+595 9', email: 'x@y.com', nome: 'Ana' }, b: { ts: 9e12, tel: '1', email: 'z@z.com' } }, mensagens: { m: { ts: 5, email: 'q@q.com' } }, voltas: { v: { ts: 2 } }, logins: { l: { ts: 3 } } };
  const db = { velhos: async (c, t) => Object.keys(B[c] || {}).filter((k) => B[c][k].ts < t).map((k) => Object.assign({ id: k }, B[c][k])), muda: async (c, id, o) => Object.assign(B[c][id], o), apaga: async (c, id) => { delete B[c][id]; } };
  const r = await L.limpa(db, 9e12 + 1);
  ok(B.pedidos.a.tel === '' && B.pedidos.a.email === '' && B.pedidos.a.nome === 'Ana' && B.pedidos.b.tel === '1', 'pedido de +12 meses perde telefone e e-mail; o recente fica');
  ok(B.mensagens.m.email === '' && !B.voltas.v && !B.logins.l && r.pedidos === 1, 'mensagens, avisos de volta e logins antigos');
  const r2 = await L.limpa(db, 9e12 + 2); ok(r2.pedidos === 0, 'não refaz o que já limpou');
  process.exit(falhas ? 1 : 0);
})();
