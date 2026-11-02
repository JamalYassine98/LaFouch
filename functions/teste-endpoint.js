// Testa o endpoint "reserva" (index.js) com o Firebase substituído por peças de mentira.
'use strict';
const assert = require('assert');
const Module = require('module');
const R = require('./reserva');
// ---- Firestore de mentira (o mesmo do outro teste, resumido)
const dados = new Map();
const fakeDb = {
  collection: (c) => ({ doc: (id) => ({ path: c + '/' + id, async get() { const d = dados.get(c + '/' + id); return { exists: !!d, data: () => d && JSON.parse(JSON.stringify(d)) }; } }) }),
  async runTransaction(fn) { const grava = new Map(); const tx = { get: async (r) => { const d = dados.get(r.path); return { exists: !!d, data: () => d && JSON.parse(JSON.stringify(d)) }; }, set: (r, v) => grava.set(r.path, v) }; const out = await fn(tx); for (const [p, v] of grava) dados.set(p, JSON.parse(JSON.stringify(v))); return out; },
};
let tokenOk = null;
const stubs = {
  'firebase-admin': { initializeApp() {}, firestore: () => fakeDb, messaging: () => ({}), auth: () => ({ verifyIdToken: async (t) => { if (t === 'dono') return { uid: 'jJzNDoMHtuRNOAF1GhJfNYDMlE63', email: 'jamalaliyassine@gmail.com' }; if (t === 'outro') return { uid: 'x', email: 'a@b.c' }; throw new Error('token'); } }) },
  'firebase-functions/v2/firestore': { onDocumentCreated: () => () => {} },
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
    assert.strictEqual(dados.get('estoque/SL1').res['PAAA1~rosa'].pago, true);
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
    const r = await chama({ acao: 'liberar', pedido: 'PDDD1', itens: it }, 'Bearer dono'); assert.ok(r.ok); assert.deepStrictEqual(dados.get('estoque/SL1').res, {});
  });
  console.log(total - falhas.length + '/' + total + ' testes do endpoint passaram' + (falhas.length ? '  |  FALHARAM: ' + falhas.join(' ; ') : ''));
  process.exit(falhas.length ? 1 : 0);
})();
