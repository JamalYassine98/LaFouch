// Testa o endpoint "reserva" (index.js) com o Firebase substituído por peças de mentira.
'use strict';
const assert = require('assert');
const Module = require('module');
const R = require('./reserva');
// ---- Firestore de mentira (o mesmo do outro teste, resumido)
const dados = new Map();
const docFalso = (p) => ({ path: p, async get() { const d = dados.get(p); return { exists: !!d, data: () => d && JSON.parse(JSON.stringify(d)) }; },
  async set(v, op) { dados.set(p, JSON.parse(JSON.stringify(op && op.merge ? Object.assign({}, dados.get(p) || {}, v) : v))); }, async delete() { dados.delete(p); }, async create(v) { if (dados.has(p)) throw Object.assign(new Error('already exists'), { code: 6 }); dados.set(p, v); } });
const fakeDb = {
  // 20/11 (pagamento): doc(caminho) com get/set/delete, consulta simples (where >=) e add — o que a função pix usa
  doc: (p) => docFalso(p),
  collection: (c) => {
    const filtros = [], q = {
      doc: (id) => docFalso(c + '/' + id), add: async (o) => { const id = 'x' + Math.random().toString(36).slice(2, 8); dados.set(c + '/' + id, o); return { id }; },
      where: (k, op, v) => { filtros.push((d) => (op === '>=' ? d[k] >= v : op === '==' ? d[k] === v : true)); return q; }, limit: () => q, orderBy: () => q,
      get: async () => { const docs = [...dados.keys()].filter((k) => k.startsWith(c + '/') && !k.slice(c.length + 1).includes('/')).map((k) => ({ id: k.slice(c.length + 1), data: () => JSON.parse(JSON.stringify(dados.get(k))) })).filter((d) => filtros.every((f) => f(d.data()))); return { docs, empty: !docs.length, size: docs.length }; },
      listDocuments: async () => [...dados.keys()].filter((k) => k.startsWith(c + '/')).map((k) => ({ id: k.slice(c.length + 1) })),
    };
    return q;
  },
  async runTransaction(fn) { const grava = new Map(); const tx = { get: async (r) => { const d = dados.get(r.path); return { exists: !!d, data: () => d && JSON.parse(JSON.stringify(d)) }; }, set: (r, v) => grava.set(r.path, v), delete: (r) => grava.set(r.path, null) }; const out = await fn(tx); for (const [p, v] of grava) { if (v === null) dados.delete(p); else dados.set(p, JSON.parse(JSON.stringify(v))); } return out; },
};
let tokenOk = null;
const stubs = {
  'firebase-admin': { initializeApp() {}, firestore: () => fakeDb, messaging: () => ({}), auth: () => ({ verifyIdToken: async (t) => { if (t === 'cli') return { uid: 'C1', email: 'cliente@exemplo.com', email_verified: true }; if (t === 'falsa') return { uid: 'C2', email: 'cliente@exemplo.com', email_verified: false }; if (t === 'dono') return { uid: 'jJzNDoMHtuRNOAF1GhJfNYDMlE63', email: 'jamalaliyassine@gmail.com' }; if (t === 'outro') return { uid: 'x', email: 'a@b.c' }; throw new Error('token'); } }) },
  // 19/11 (P1): o index.js ganhou outros gatilhos; qualquer um que não seja onRequest vira uma função vazia
  'firebase-functions/v2/firestore': new Proxy({}, { get: () => () => () => {} }),
  'firebase-functions/v2/scheduler': new Proxy({}, { get: () => () => () => {} }),
  'firebase-functions/v2/https': { onRequest: (opts, fn) => fn },
  'firebase-functions/params': { defineSecret: () => ({ value: () => 'robo-teste' }) },
};
const orig = Module._load;
Module._load = function (req, ...a) { return stubs[req] || orig.call(this, req, ...a); };
const { reserva, pix } = require('./index.js');
Module._load = orig;

function chamaPix(body) {
  return new Promise((ok) => {
    const req = { method: 'POST', body, get: (h) => (h === 'x-robo' ? 'robo-teste' : '') };
    const res = { code: 200, status(c) { this.code = c; return this; }, json(o) { ok({ code: this.code, ...o }); } };
    pix(req, res);
  });
}
function chama(body, auth, metodo) {
  return new Promise((ok) => {
    const req = { method: metodo || 'POST', body, get: (h) => (h === 'Authorization' ? auth : '') };
    const res = { code: 200, status(c) { this.code = c; return this; }, json(o) { ok({ code: this.code, ...o }); } };
    reserva(req, res);
  });
}
let total = 0; const falhas = [];
async function teste(n, f) { total++; try { await f(); console.log('  ok   ' + n); } catch (e) { falhas.push(n); console.log(' FALHA ' + n + '\n        ' + e.message); } }
const it = [{ ref: 'SL1', cor: 'Rosa', q: 1 }];
(async () => {
  dados.set('produtos/SL1', { cn: ['Rosa'], qs: [1], lib: true });
  await teste('interruptor desligado: o site segue sem reserva ({off:true})', async () => {
    dados.set('config/site', { ativo: true });
    const r = await chama({ acao: 'reservar', pedido: 'PAAA1', itens: it }); assert.deepStrictEqual([r.ok, r.off], [true, true]); assert.ok(!dados.get('estoque/SL1'));
  });
  await teste('interruptor ligado: reserva, e o segundo cliente vê "esgotado" com a lista do que faltou', async () => {
    dados.set('config/site', { ativo: true, reserva: true });
    const a = await chama({ acao: 'reservar', pedido: 'PAAA1', itens: it }); assert.ok(a.ok && a.exp > Date.now() - 1000 && !a.off);
    const b = await chama({ acao: 'reservar', pedido: 'PBBB1', itens: it }); assert.ok(!b.ok && b.motivo === 'esgotado' && b.falta[0].ref === 'SL1');
  });
  await teste('ações do dono exigem o token do dono (sem token, token de outra pessoa e token inválido são recusados)', async () => {
    for (const aut of ['', 'Bearer outro', 'Bearer lixo']) { const r = await chama({ acao: 'pagar', pedido: 'PAAA1', itens: it }, aut); assert.strictEqual(r.code, 403); }
    const r = await chama({ acao: 'pagar', pedido: 'PAAA1', itens: it }, 'Bearer dono'); assert.ok(r.ok);
    assert.strictEqual(dados.get('estoque/SL1').res[R.H('PAAA1') + '~rosa'].pago, true);
  });
  // ---- P1 (19/11/2026): pela porta de verdade, como um estranho faria
  await teste('P1: estranho chama o cancelar público numa reserva PAGA: a peça continua segura', async () => {
    const r1 = await chama({ acao: 'cancelar', pedido: 'PAAA1', itens: it }); assert.ok(r1.ok && r1.presas === 1);
    const r2 = await chama({ acao: 'cancelar', pedido: 'PAAA1', refs: ['SL1'] }); assert.ok(r2.ok && r2.presas === 1);
    assert.strictEqual(dados.get('estoque/SL1').res[R.H('PAAA1') + '~rosa'].pago, true);
    assert.ok(!JSON.stringify(dados.get('estoque/SL1')).includes('PAAA1'));
  });
  await teste('um visitante não consegue chamar "pagar" fingindo ser cliente', async () => {
    const r = await chama({ acao: 'pagar', pedido: 'PZZZ1', itens: it }); assert.strictEqual(r.code, 403);
  });
  await teste('cliente cancela pelo site: a peça volta', async () => {
    dados.set('estoque/SL1', { res: {} });
    await chama({ acao: 'reservar', pedido: 'PCCC1', itens: it }); await chama({ acao: 'cancelar', pedido: 'PCCC1', itens: it });
    const r = await chama({ acao: 'reservar', pedido: 'PDDD1', itens: it }); assert.ok(r.ok);
  });
  await teste('ação desconhecida e método errado são recusados', async () => {
    assert.strictEqual((await chama({ acao: 'apagar' })).code, 400); assert.strictEqual((await chama({}, '', 'GET')).code, 405);
  });
  await teste('dono libera o pedido ao entregar/cancelar', async () => {
    const r = await chama({ acao: 'liberar', pedido: 'PDDD1', itens: it }, 'Bearer dono'); assert.ok(r.ok); assert.strictEqual(dados.get('estoque/SL1'), undefined);
  });
  await teste('P1b: estranho não consegue pedir a lista de órfãs nem soltar por código', async () => {
    for (const aut of ['', 'Bearer outro']) {
      assert.strictEqual((await chama({ acao: 'orfas', conhecidos: [] }, aut)).code, 403);
      assert.strictEqual((await chama({ acao: 'liberarH', h: R.H('PAAA1'), refs: ['SL1'] }, aut)).code, 403);
    }
  });
  await teste('P1b: pedido pago apagado do app → o dono acha a órfã e solta pelo código', async () => {
    dados.set('estoque/SL1', { res: {} });
    await chama({ acao: 'reservar', pedido: 'PGGG1', itens: it }); await chama({ acao: 'pagar', pedido: 'PGGG1', itens: it }, 'Bearer dono');
    await chama({ acao: 'reservar', pedido: 'PHHH1', itens: [{ ref: 'SL1', cor: 'Preto', q: 1 }] });
    const o = await chama({ acao: 'orfas', conhecidos: [] }, 'Bearer dono');
    assert.ok(o.ok && o.orfas.length === 1 && o.orfas[0].h === R.H('PGGG1')); // a não paga (PHHH1) não entra
    const o2 = await chama({ acao: 'orfas', conhecidos: [R.H('PGGG1')] }, 'Bearer dono'); assert.strictEqual(o2.orfas.length, 0); // conhecida: não mexe
    assert.ok((await chama({ acao: 'liberarH', h: R.H('PGGG1'), refs: ['SL1'] }, 'Bearer dono')).ok);
    assert.ok(!dados.get('estoque/SL1') || !Object.values(dados.get('estoque/SL1').res).some((x) => x.h === R.H('PGGG1')));
    await chama({ acao: 'cancelar', pedido: 'PHHH1', refs: ['SL1'] });
  });
  await teste('P1: cancelar da cliente e liberar do app com a lista em "refs" (como o site e o app mandam) soltam a peça', async () => {
    dados.set('estoque/SL1', { res: {} });
    await chama({ acao: 'reservar', pedido: 'PEEE1', itens: it });
    const c = await chama({ acao: 'cancelar', pedido: 'PEEE1', refs: ['SL1'] }); assert.ok(c.ok && !c.presas);
    assert.strictEqual(dados.get('estoque/SL1'), undefined);
    await chama({ acao: 'reservar', pedido: 'PFFF1', itens: it }); await chama({ acao: 'pagar', pedido: 'PFFF1', itens: it }, 'Bearer dono');
    const l = await chama({ acao: 'liberar', pedido: 'PFFF1', refs: ['SL1'] }, 'Bearer dono'); assert.ok(l.ok);
    assert.strictEqual(dados.get('estoque/SL1'), undefined);
  });
  // ---- 20/11/2026 (varredura do pagamento): o robô do banco pela porta de verdade
  const NU = { dkim: true, dom: 'nubank.com.br' }, ficha = (id, valor, extra) => dados.set('pixEspera/' + id, Object.assign({ tipo: 'site', conf: true, ts: Date.now() - 60e3, moeda: 'brl', valor, teto: valor + 37, nome: 'Cliente', itens: it }, extra || {}));
  await teste('pagamento certo: o pedido fica pago E a peça fica segura como paga (mesma regra do "pagar" do app)', async () => {
    dados.set('config/site', { ativo: true, reserva: true }); dados.set('estoque/SL1', { res: {} });
    await chama({ acao: 'reservar', pedido: 'PIXA1', itens: it }); ficha('PIXA1', 6963);
    const r = await chamaPix(Object.assign({ valor: '69,63', mid: 'e1' }, NU));
    assert.ok(r.ok && r.tipo === 'site' && r.id === 'PIXA1', JSON.stringify(r));
    assert.strictEqual(dados.get('reservas/PIXA1').pago, true); assert.strictEqual(dados.get('estoque/SL1').res[R.H('PIXA1') + '~rosa'].pago, true);
  });
  await teste('pagou depois que a reserva venceu e a peça foi para outra pessoa: NÃO fica pago; o dono recebe o aviso com o pedido', async () => {
    dados.set('estoque/SL1', { res: {} });
    await chama({ acao: 'reservar', pedido: 'PIXB1', itens: it });
    const e = dados.get('estoque/SL1'); e.res[R.H('PIXB1') + '~rosa'].exp = Date.now() - 1000; dados.set('estoque/SL1', e); // a reserva venceu
    await chama({ acao: 'reservar', pedido: 'PIXC1', itens: it }); // e outra cliente levou a única peça
    ficha('PIXB1', 5050);
    const r = await chamaPix(Object.assign({ valor: '50,50', mid: 'e2' }, NU));
    assert.ok(r.ok && r.tipo === 'sem-peca' && r.id === 'PIXB1', JSON.stringify(r));
    assert.ok(!dados.get('reservas/PIXB1') || dados.get('reservas/PIXB1').pago !== true);
    assert.ok([...dados.entries()].some(([k, v]) => k.startsWith('pixSemPar/') && v.motivo === 'sem-peca' && v.id === 'PIXB1'));
  });
  await teste('ficha que o servidor não conferiu (pedido de antes ou suspeito) nunca é confirmada sozinha', async () => {
    ficha('PIXD1', 4321, { conf: false });
    const r = await chamaPix(Object.assign({ valor: '43,21', mid: 'e3' }, NU));
    assert.ok(r.tipo === 'sem-par' && !dados.get('reservas/PIXD1'), JSON.stringify(r));
  });
  await teste('sem a chave do robô: recusado', async () => {
    const r = await new Promise((ok) => pix({ method: 'POST', body: { valor: '1,00', mid: 'z' }, get: () => '' }, { code: 200, status(c) { this.code = c; return this; }, json(o) { ok({ code: this.code, ...o }); } }));
    assert.strictEqual(r.code, 403);
  });
  // ---- S6 (20/11/2026): Cliente VIP é a pessoa logada, nunca um telefone digitado
  await teste('S6: estranho digita o telefone de uma VIP → NÃO vê VIP nem ganha a reserva de 3 h; a VIP logada ganha', async () => {
    const crypto = require('crypto');
    dados.set('config/site', { ativo: true, reserva: true }); dados.set('estoque/SL1', { res: {} });
    dados.set('compradores/t595981000111', { vip: 1 });
    dados.set('compradores/e' + crypto.createHash('sha256').update('cliente@exemplo.com').digest('hex').slice(0, 32), { tel: '595981000111' });
    const a = await chama({ acao: 'reservar', pedido: 'PVIP1', itens: it, tel: '0981000111' });
    assert.ok(a.ok && !a.vip, JSON.stringify(a));
    await chama({ acao: 'cancelar', pedido: 'PVIP1', itens: it });
    const f = await chama({ acao: 'reservar', pedido: 'PVIP2', itens: it }, 'Bearer falsa');
    assert.ok(f.ok && !f.vip, 'e-mail não confirmado não vale');
    await chama({ acao: 'cancelar', pedido: 'PVIP2', itens: it });
    const b = await chama({ acao: 'reservar', pedido: 'PVIP3', itens: it }, 'Bearer cli');
    assert.ok(b.ok && b.vip === true && b.exp - Date.now() > 2 * 3600e3, JSON.stringify(b));
  });
  // ---- 39 · preço exato (21/11): pagamento sem par → o dono liga ao pedido (mesmo caminho da confirmação automática)
  await teste('39: PIX que não bate → "sem par" com motivo; o dono liga ao pedido; o estranho não consegue', async () => {
    dados.set('config/site', { ativo: true, reserva: true }); dados.set('estoque/SL1', { res: {} });
    await chama({ acao: 'reservar', pedido: 'LIGA1', itens: it });
    dados.set('pedidoIds/LIGA1', { ts: Date.now() });
    const p = await chamaPix(Object.assign({ valor: '12,34', mid: 'g1' }, { dkim: true, dom: 'nubank.com.br' }));
    assert.ok(p.tipo === 'sem-par' && p.motivo === 'sem-pedido', JSON.stringify(p));
    const sp = [...dados.entries()].find(([k, v]) => k.startsWith('pixSemPar/') && v.mid === 'g1');
    const pixId = sp[0].split('/')[1];
    for (const aut of ['', 'Bearer outro']) assert.strictEqual((await chama({ acao: 'ligar', pix: pixId, pedido: 'LIGA1' }, aut)).code, 403);
    const r = await chama({ acao: 'ligar', pix: pixId, pedido: 'LIGA1' }, 'Bearer dono');
    assert.ok(r.ok && r.pedido === 'LIGA1', JSON.stringify(r));
    assert.strictEqual(dados.get('reservas/LIGA1').pago, true);
    assert.strictEqual(dados.get(sp[0]).ligado, 'LIGA1');
    const r2 = await chama({ acao: 'ligar', pix: pixId, pedido: 'LIGA1' }, 'Bearer dono');
    assert.ok(r2.ok && r2.ja, 'ligar de novo = igual a 1');
    const r3 = await chama({ acao: 'ligar', pix: pixId, pedido: 'NAOEXISTE' }, 'Bearer dono');
    assert.ok(r3.ok && r3.ja, 'o PIX já ligado não vai para outro pedido');
  });
  console.log(total - falhas.length + '/' + total + ' testes do endpoint passaram' + (falhas.length ? '  |  FALHARAM: ' + falhas.join(' ; ') : ''));
  process.exit(falhas.length ? 1 : 0);
})();
