// Testa o endpoint "reserva" (index.js) com o Firebase substituído por peças de mentira.
'use strict';
const assert = require('assert');
const Module = require('module');
const R = require('./reserva');
// ---- Firestore de mentira (o mesmo do outro teste, resumido)
const dados = new Map();
const fakeDb = {
  collection: (c) => ({ doc: (id) => ({ path: c + '/' + id, async get() { const d = dados.get(c + '/' + id); return { exists: !!d, data: () => d && JSON.parse(JSON.stringify(d)) }; } }),
    listDocuments: async () => [...dados.keys()].filter((k) => k.startsWith(c + '/')).map((k) => ({ id: k.slice(c.length + 1) })) }),
  async runTransaction(fn) { const grava = new Map(); const tx = { get: async (r) => { const d = dados.get(r.path); return { exists: !!d, data: () => d && JSON.parse(JSON.stringify(d)) }; }, set: (r, v) => grava.set(r.path, v), delete: (r) => grava.set(r.path, null) }; const out = await fn(tx); for (const [p, v] of grava) { if (v === null) dados.delete(p); else dados.set(p, JSON.parse(JSON.stringify(v))); } return out; },
};
let tokenOk = null;
const stubs = {
  'firebase-admin': { initializeApp() {}, firestore: () => fakeDb, messaging: () => ({}), auth: () => ({ verifyIdToken: async (t) => { if (t === 'dono') return { uid: 'jJzNDoMHtuRNOAF1GhJfNYDMlE63', email: 'jamalaliyassine@gmail.com' }; if (t === 'outro') return { uid: 'x', email: 'a@b.c' }; throw new Error('token'); } }) },
  // 19/11 (P1): o index.js ganhou outros gatilhos; qualquer um que não seja onRequest vira uma função vazia
  'firebase-functions/v2/firestore': new Proxy({}, { get: () => () => () => {} }),
  'firebase-functions/v2/scheduler': new Proxy({}, { get: () => () => () => {} }),
  'firebase-functions/v2/https': { onRequest: (opts, fn) => fn },
};
const orig = Module._load;
Module._load = function (req, ...a) { return stubs[req] || orig.call(this, req, ...a); };
const { reserva } = require('./index.js');
Module._load = orig;

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
  console.log(total - falhas.length + '/' + total + ' testes do endpoint passaram' + (falhas.length ? '  |  FALHARAM: ' + falhas.join(' ; ') : ''));
  process.exit(falhas.length ? 1 : 0);
})();
