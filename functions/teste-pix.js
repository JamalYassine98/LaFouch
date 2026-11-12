const X = require('./pix');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
function dbFake(peds, esp) {
  const vis = {}, sp = [], conf = [], cesp = [];
  return {
    sp, conf, cesp,
    jaVisto: async (m) => !!vis[m], visto: async (m) => { vis[m] = 1; },
    pedidosPix: async (desde) => peds.filter((p) => p.ts >= desde),
    esperas: async (desde) => (esp || []).filter((e) => e.ts >= desde),
    confirmaPedido: async (id, o) => { conf.push([id, o]); const p = peds.find((x) => x.id === id); p.pago = true; },
    confirmaEspera: async (id, o) => { cesp.push([id, o]); },
    semPar: async (o) => { sp.push(o); },
  };
}
(async () => {
  const T = Date.UTC(2026, 10, 12, 18), H = 36e5;
  ok(X.centavos('R$ 1.234,56') === 123456 && X.centavos('99,97') === 9997 && X.centavos('99.97') === 9997, 'lê valores em reais');
  ok(X.valorDoTexto('Você recebeu uma transferência de R$ 89,93 de MARIA') === 8993, 'tira o valor do texto do e-mail');
  const peds = [{ id: 'a1', brl: 89.93, ts: T - H }, { id: 'a2', brl: 89.97, ts: T - H }, { id: 'velho', brl: 50.01, ts: T - 72 * H }];
  const db = dbFake(peds, [{ id: 'v1', brl: 120, ts: T - 0.5 * H }]);
  let e = ''; try { await X.recebe(db, { valor: '89,93', mid: 'm0', dkim: false, dom: 'nubank.com.br' }, T); } catch (x) { e = x.motivo; }
  ok(e === 'origem', 'sem DKIM do nubank.com.br: recusa');
  let r = await X.recebe(db, { valor: '89,93', mid: 'm1', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.tipo === 'site' && r.id === 'a1' && db.conf.length === 1, 'pedido do site: confirma pelo valor com centavos únicos');
  r = await X.recebe(db, { valor: '89,93', mid: 'm1', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.repetido && db.conf.length === 1, 'o mesmo e-mail duas vezes não confirma de novo');
  r = await X.recebe(db, { valor: '89,93', mid: 'm2', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.tipo === 'sem-par' && db.sp.length === 1, 'pedido já pago não é confirmado outra vez (vai para sem par)');
  r = await X.recebe(db, { valor: '50,01', mid: 'm3', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.tipo === 'sem-par', 'pedido de mais de 48 h não é confirmado');
  r = await X.recebe(db, { valor: '120,00', mid: 'm4', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.tipo === 'loja' && db.cesp[0][0] === 'v1', 'venda da loja (Venda · PIX) confirmada pelo valor redondo');
  const db2 = dbFake([{ id: 'b1', brl: 70, ts: T - H }, { id: 'b2', brl: 70, ts: T - H }]);
  r = await X.recebe(db2, { valor: '70,00', mid: 'n1', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.tipo === 'sem-par' && r.candidatos === 2 && !db2.conf.length, 'dois pedidos com o mesmo valor: não chuta, avisa');
  console.log(falhas ? falhas + ' FALHAS' : 'tudo ok');
  process.exit(falhas ? 1 : 0);
})();
