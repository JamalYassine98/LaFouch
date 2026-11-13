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

  // S206 (13/11): lotes, separação de 30 min, preço do lote, uma confirmação
  {
    const dbL = dbFake(); const SEP = {}, LO = {};
    dbL.lote = async (k) => LO[k] || null;
    dbL.sepAtivas = async () => Object.values(SEP);
    dbL.sepGrava = async (k, o) => { SEP[k] = o; };
    dbL.trans = async (f) => f({ sepAtivas: dbL.sepAtivas, sepGrava: dbL.sepGrava });
    dbL.existe = async (k) => !!dbL.ped[k];
    const tk = (id) => require('crypto').createHash('sha256').update(id).digest('hex');
    dbL.m.LA = { nome: 'Loja A', email: 'a@x', tipo: 'assoc', tab: 'a1', aparelhos: [{ id: 'da', tokH: tk('ta') }] };
    dbL.m.LB = { nome: 'Loja B', email: 'b@x', tipo: 'assoc', tab: 'a1', aparelhos: [{ id: 'db', tokH: tk('tb') }] };
    LO.L7 = { nome: 'Acetato · novembro', ate: T + 7 * D, contas: ['LA', 'LB'], itens: { GR3350: { usd: 4.5, q: { Transparente: 12 } } } };
    LO.LF = { nome: 'Todas', ate: T + 7 * D, contas: [], filtro: { tipo: '' } };
    const A1 = { c: 'LA', dev: 'da', tok: 'ta' }, B1 = { c: 'LB', dev: 'db', tok: 'tb' };
    let x = await A.catalogo(dbL, Object.assign({ l: 'L7' }, A1), T); ok(x.ok && x.lote && x.itens.length === 1 && x.itens[0].usd === 4.5 && x.lote.q.GR3350.Transparente === 12, 'lote abre só com as peças dele, preço garantido e quantidades marcadas');
    x = await A.catalogo(dbL, Object.assign({ l: 'LF' }, B1), T); ok(x.ok && x.itens.length === 2, 'lote por filtro pega as peças sozinho (mesma peça pode estar em vários lotes)');
    x = await A.separa(dbL, Object.assign({ ref: 'GR3350', cor: 'Transparente', q: 40 }, A1), T); ok(x.ok && x.q === 40, 'Loja A separa 40');
    x = await A.separa(dbL, Object.assign({ ref: 'GR3350', cor: 'Transparente', q: 20 }, B1), T + 1000); ok(x.ok && x.q === 8 && x.falta === 12, 'Loja B só consegue as 8 que sobram (nunca passa do estoque)');
    x = await A.catalogo(dbL, Object.assign({ l: 'L7' }, B1), T + 2000); ok(x.itens[0].cores[0][1] === 8, 'estoque ao vivo: B vê só o que não está separado pela A');
    x = await A.catalogo(dbL, Object.assign({ l: 'L7' }, B1), T + 31 * 60000); ok(x.itens[0].cores[0][1] === 48, 'A não confirmou em 30 min: as peças voltam');
    x = await A.separa(dbL, Object.assign({ ref: 'GR3350', cor: 'Transparente', q: 20 }, A1), T + 2000); ok(x.fim === T + 30 * 60000, '30 min contam da 1ª peça e não renovam');
    x = await A.pedido(dbL, Object.assign({ l: 'L7', itens: [{ ref: 'GR3350', cor: 'Transparente', q: 30 }] }, A1), T + 3000); ok(x.ok && Math.abs(x.usd - 135) < 1e-6, 'pedido usa o preço do lote');
    const pid = x.pid; SEP.LA = { conta: 'LA', ini: T, itens: {} };
    x = await A.pedido(dbL, Object.assign({ l: 'L7', itens: [{ ref: 'GR3350', cor: 'Transparente', q: 30 }] }, A1), T + 4000); ok(!x.ok && x.motivo === 'ja-confirmado' && x.pid === pid, 'confirmar duas vezes não duplica o pedido');
    LO.L7.cancelado = true; x = await A.catalogo(dbL, Object.assign({ l: 'L7' }, A1), T); ok(!x.ok && x.motivo === 'lote-fim', 'lote cancelado: "Lote finalizado"');
    LO.L7.cancelado = false; x = await A.catalogo(dbL, Object.assign({ l: 'L7' }, A1), T + 8 * D); ok(!x.ok && x.motivo === 'lote-fim', 'lote vencido: "Lote finalizado"');
    LO.L8 = { ate: T + D, contas: ['LB'], itens: {} }; x = await A.catalogo(dbL, Object.assign({ l: 'L8' }, A1), T); ok(!x.ok, 'link de lote de outra loja não abre');
    const av2 = []; x = await A.avisame(dbL, async (o) => av2.push(o), Object.assign({ ref: 'GR3350', cor: 'Transparente', l: 'L7' }, A1), T); ok(x.ok && av2[0].t === 'volta', '"Avisame si vuelve" avisa o dono');
  }
  console.log(falhas ? falhas + ' FALHAS' : 'tudo ok'); process.exit(falhas ? 1 : 0);
})();
