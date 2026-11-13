const A = require('./atacado');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
function dbFake() {
  const m = {}, ped = {}, P = { a1: { nome: 'Atacado 1K', min: 100, itens: { GR3350: { usd: 4.9, nome: 'Lentes', cores: [['Transparente', 48]] }, SL2210: { usd: 6.8 } } } };
  return { m, ped, get: async (k) => m[k] || null, muda: async (k, o) => { Object.assign(m[k], o); }, precos: async (t) => P[t], pedido: async (k, o) => { ped[k] = o; } };
}
(async () => {
  const T = Date.UTC(2026, 10, 12, 18), D = 864e5, av = [], aviso = async (o) => av.push(o), mail = [], envia = async (x) => mail.push(x);
  const db = dbFake();
  db.m.C1 = { nome: 'Óptica Silva', email: 'compras@silva.com', tipo: 'assoc', tab: 'a1', dispMax: 3, trocaOk: true, aparelhos: [] };
  db.m.V1 = { nome: 'Óptica Sol', email: 'sol@x.com', tipo: 'visita', tab: 'a1', dispMax: 3, fim: T + 3 * D, refs: ['SL2210'], aparelhos: [] };
  let r = await A.entrar(db, envia, { c: 'C1', email: 'outro@x.com' }, T); ok(!r.ok && r.motivo === 'email', 'e-mail diferente do da conta não recebe código');
  r = await A.entrar(db, envia, { c: 'C1', email: 'Compras@Silva.com' }, T, 481200); ok(r.ok && mail.length === 1 && /481200/.test(mail[0].subject), 'manda o código de 6 números para o e-mail da conta');
  r = await A.confirma(db, aviso, { c: 'C1', cod: '000000', dev: 'd1' }, T + 1000); ok(r.motivo === 'codigo', 'código errado não entra');
  r = await A.confirma(db, aviso, { c: 'C1', cod: '481200', dev: 'd1', devNome: 'Samsung A54' }, T + 2000, 'tokA'); ok(r.ok && r.tok === 'tokA' && r.conta.aparelhos.length === 1, 'código certo: entra e o aparelho fica guardado');
  r = await A.catalogo(db, { c: 'C1', dev: 'd1', tok: 'tokA' }, T + 3000); ok(r.ok && r.itens.length === 2 && r.minimo === 100 && r.tabela === 'Atacado 1K', 'catálogo com os preços da tabela dele');
  r = await A.catalogo(db, { c: 'C1', dev: 'd1', tok: 'roubado' }, T + 3000); ok(!r.ok && r.motivo === 'sessao', 'link repassado sem o token do aparelho não abre');
  for (const d of ['d2', 'd3']) { await A.entrar(db, envia, { c: 'C1', email: 'compras@silva.com' }, T + 60000 * (d === 'd2' ? 1 : 2), 111111); await A.confirma(db, aviso, { c: 'C1', cod: '111111', dev: d }, T + 60000 * (d === 'd2' ? 1 : 2) + 10, 'tok' + d); }
  await A.entrar(db, envia, { c: 'C1', email: 'compras@silva.com' }, T + 300000, 222222);
  r = await A.confirma(db, aviso, { c: 'C1', cod: '222222', dev: 'd4' }, T + 300010); ok(!r.ok && r.motivo === 'cheio' && r.aparelhos.length === 3, '4º aparelho: limite de 3, mostra os aparelhos');
  ok(av.some((a) => a.t === 'aparelho'), 'dono é avisado de aparelho novo');
  r = await A.remove(db, aviso, { c: 'C1', dev: 'd1', tok: 'tokA', alvo: 'd2' }, T + 400000); ok(r.ok && r.conta.aparelhos.length === 2, 'associada remove aparelho em Meus aparelhos');
  await A.remove(db, aviso, { c: 'C1', dev: 'd1', tok: 'tokA', alvo: 'd3' }, T + 500000);
  db.m.C1.aparelhos.push({ id: 'd9', tokH: 'x' });
  await A.remove(db, aviso, { c: 'C1', dev: 'd1', tok: 'tokA', alvo: 'd9' }, T + 600000);
  ok(av.some((a) => a.t === 'trocas'), 'mais de 2 trocas em 30 dias: aviso forte ao dono');
  db.m.C1.trocaOk = false;
  r = await A.remove(db, aviso, { c: 'C1', dev: 'd1', tok: 'tokA', alvo: 'd1' }, T + 700000); ok(!r.ok && r.motivo === 'bloqueado', 'Bloquear trocas: o cliente não troca mais');
  db.m.C1.pausada = true; r = await A.catalogo(db, { c: 'C1', dev: 'd1', tok: 'tokA' }, T); ok(r.motivo === 'pausada', 'pausada: o catálogo some');
  db.m.C1.pausada = false; r = await A.catalogo(db, { c: 'C1', dev: 'd1', tok: 'tokA' }, T); ok(r.ok, '…e volta com 1 toque, nada apagado');
  r = await A.pedido(db, { c: 'C1', dev: 'd1', tok: 'tokA', itens: [{ ref: 'GR3350', cor: 'Transparente', q: 10 }] }, T); ok(r.motivo === 'minimo' && r.falta === 51, 'pedido abaixo do mínimo: diz quanto falta');
  r = await A.pedido(db, { c: 'C1', dev: 'd1', tok: 'tokA', itens: [{ ref: 'GR3350', q: 20 }, { ref: 'SL2210', q: 2 }] }, T); ok(r.ok && r.pecas === 22 && Object.keys(db.ped).length === 1, 'pedido chega no app');
  await A.entrar(db, envia, { c: 'V1', email: 'sol@x.com' }, T, 333333); await A.confirma(db, aviso, { c: 'V1', cod: '333333', dev: 'v1' }, T + 5, 'tokV');
  r = await A.catalogo(db, { c: 'V1', dev: 'v1', tok: 'tokV' }, T + 10); ok(r.ok && r.itens.length === 1 && r.itens[0].ref === 'SL2210', 'visitante vê só as peças marcadas');
  r = await A.remove(db, aviso, { c: 'V1', dev: 'v1', tok: 'tokV', alvo: 'v1' }, T + 20); ok(r.motivo === 'bloqueado', 'visitante não remove aparelho');
  r = await A.catalogo(db, { c: 'V1', dev: 'v1', tok: 'tokV' }, T + 3 * D + 1); ok(r.motivo === 'vencida', 'convite vence em 3 dias');
  console.log(falhas ? falhas + ' FALHAS' : 'tudo ok'); process.exit(falhas ? 1 : 0);
})();
