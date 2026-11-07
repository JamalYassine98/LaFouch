'use strict';
const assert = require('assert');
const C = require('./codigo');
const mem = {};
const db = { get: async (u) => mem[u] || null, set: async (u, o) => { mem[u] = o; }, del: async (u) => { delete mem[u]; } };
let ult = null;
const envia = async (m) => { ult = m; };
(async () => {
  const u = { uid: 'u1', email: 'a@b.com', nome: 'Ana Souza', verificado: false };
  let t = 1e6;
  await C.enviar(db, envia, u, t, 'pt');
  const cod = /(\d{6})/.exec(ult.subject)[1];
  assert.ok(/Olá, Ana/.test(ult.html) && ult.to === 'a@b.com');
  await assert.rejects(C.enviar(db, envia, u, t + 10000), (e) => e.motivo === 'espere' && e.extra.s === 35);
  await assert.rejects(C.conferir(db, u, '000000' === cod ? '111111' : '000000', t + 1000), (e) => e.motivo === 'errado' && e.extra.resta === 4);
  const r = await C.conferir(db, u, cod, t + 2000);
  assert.ok(r.confirmado && !mem.u1);
  // vencido
  await C.enviar(db, envia, u, t + 60000);
  const c2 = /(\d{6})/.exec(ult.subject)[1];
  await assert.rejects(C.conferir(db, u, c2, t + 60000 + C.VALE + 1), (e) => e.motivo === 'vencido');
  // 5 tentativas
  await C.enviar(db, envia, u, t + 9e6, 'es');
  assert.ok(/es tu código/.test(ult.subject));
  const c3 = /(\d{6})/.exec(ult.subject)[1], ruim = c3 === '123456' ? '654321' : '123456';
  for (let i = 0; i < 5; i++) await assert.rejects(C.conferir(db, u, ruim, t + 9e6 + 1), (e) => e.motivo === 'errado');
  await assert.rejects(C.conferir(db, u, c3, t + 9e6 + 2), (e) => e.motivo === 'tentativas');
  await assert.rejects(C.enviar(db, null, u, t), (e) => e.motivo === 'sem-config');
  assert.ok((await C.enviar(db, envia, Object.assign({}, u, { verificado: true }), t)).ja);
  console.log('código: 9 testes ok');
})().catch((e) => { console.error('FALHA', e); process.exit(1); });
