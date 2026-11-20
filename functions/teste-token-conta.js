// Testes de S1 (token de entrega fora da página pública) e S2 (conta sem mostrar e-mail) — 19/11/2026.
'use strict';
const assert = require('assert');
const T = require('./token');
const C = require('./conta');

function fake(seed) {
  const m = new Map(Object.entries(seed || {}).map(([k, v]) => [k, JSON.parse(JSON.stringify(v))]));
  return {
    m,
    get: async (p) => (m.has(p) ? JSON.parse(JSON.stringify(m.get(p))) : null),
    set: async (p, d) => { m.set(p, Object.assign({}, m.get(p) || {}, d)); },
  };
}
let total = 0; const falhas = [];
async function teste(nome, fn) { total++; try { await fn(); console.log('  ok  ', nome); } catch (e) { falhas.push(nome); console.log(' FALHA', nome, '\n       ', e.message); } }
const T0 = 1795000000000;

(async () => {
  // ---------- S1
  await teste('S1: telefone certo recebe o token (do lugar fechado)', async () => {
    const db = fake({ 'pedidos/PAAA1': { tel: '+595 981 222 333' }, 'reservasTok/PAAA1': { tok: 'abc123' } });
    assert.deepStrictEqual(await T.pedir(db, T0, 'PAAA1', '0981222333'), { ok: true, tok: 'abc123' });
  });
  await teste('S1 parte 3: a página pública nunca é usada para o token (só o lugar fechado)', async () => {
    const db = fake({ 'pedidos/PAAA1': { tel: '0981222333' }, 'reservas/PAAA1': { pago: true, tok: 'velho1' } });
    assert.strictEqual((await T.pedir(db, T0, 'PAAA1', '+595981222333')).tok, null);
  });
  await teste('S1: telefone errado é recusado e não mostra o token', async () => {
    const db = fake({ 'pedidos/PAAA1': { tel: '0981222333' }, 'reservasTok/PAAA1': { tok: 'abc123' } });
    const e = await T.pedir(db, T0, 'PAAA1', '0981999999').catch((x) => x);
    assert.ok(e instanceof T.Falha && e.motivo === 'telefone');
  });
  await teste('S1: sem telefone, curto demais ou pedido que não existe: recusado', async () => {
    const db = fake({ 'pedidos/PAAA1': { tel: '0981222333' }, 'reservasTok/PAAA1': { tok: 'abc123' } });
    for (const [pid, tel] of [['PAAA1', ''], ['PAAA1', '333'], ['PZZZ9', '0981222333'], ['../x', '0981222333']]) {
      const e = await T.pedir(db, T0, pid, tel).catch((x) => x);
      assert.ok(e instanceof T.Falha, pid + ' ' + tel);
    }
  });
  await teste('S1: 5 telefones errados → espera de 1 hora, mesmo com o telefone certo', async () => {
    const db = fake({ 'pedidos/PAAA1': { tel: '0981222333' }, 'reservasTok/PAAA1': { tok: 'abc123' } });
    for (let i = 0; i < T.ERROS_MAX; i++) await T.pedir(db, T0, 'PAAA1', '0981000' + i + '00').catch(() => {});
    const e = await T.pedir(db, T0 + 1000, 'PAAA1', '0981222333').catch((x) => x);
    assert.ok(e instanceof T.Falha && e.motivo === 'espera');
    assert.strictEqual((await T.pedir(db, T0 + T.TRAVA_MS + 1, 'PAAA1', '0981222333')).tok, 'abc123');
  });
  await teste('S1: pedido sem token ainda (não pago) devolve vazio, sem erro', async () => {
    const db = fake({ 'pedidos/PAAA1': { tel: '0981222333' } });
    assert.deepStrictEqual(await T.pedir(db, T0, 'PAAA1', '0981222333'), { ok: true, tok: null });
  });
  // ---------- S2
  const entra = async (email, senha) => { if (email === 'teste@exemplo.com' && senha === 'certa') return { idToken: 'I', refreshToken: 'R', expiresIn: '3600', localId: 'U1', email }; throw new Error('x'); };
  await teste('S2: entrar com nome + senha certa faz o login', async () => {
    const db = fake({ 'usuarios/teste1': { uid: 'U1', email: 'teste@exemplo.com' } });
    const r = await C.entrar(db, entra, T0, 'teste1', 'certa');
    assert.ok(r.ok && r.idToken === 'I' && r.refreshToken === 'R');
  });
  await teste('S2: senha errada e nome que não existe dão a MESMA resposta (não revela o e-mail nem se existe)', async () => {
    const db = fake({ 'usuarios/teste1': { uid: 'U1', email: 'teste@exemplo.com' } });
    const a = await C.entrar(db, entra, T0, 'teste1', 'errada').catch((x) => x);
    const b = await C.entrar(db, entra, T0, 'naoexiste', 'errada').catch((x) => x);
    assert.ok(a instanceof C.Falha && b instanceof C.Falha && a.motivo === 'login' && b.motivo === 'login');
    assert.ok(!String(a.message + b.message).includes('@'));
  });
  await teste('S2: 5 senhas erradas → espera de 15 min, mesmo com a senha certa', async () => {
    const db = fake({ 'usuarios/teste1': { uid: 'U1', email: 'teste@exemplo.com' } });
    for (let i = 0; i < C.ERROS_MAX; i++) await C.entrar(db, entra, T0, 'teste1', 'x' + i).catch(() => {});
    const e = await C.entrar(db, entra, T0 + 1000, 'teste1', 'certa').catch((x) => x);
    assert.ok(e instanceof C.Falha && e.motivo === 'espera');
    assert.ok((await C.entrar(db, entra, T0 + C.TRAVA_MS + 1, 'teste1', 'certa')).ok);
  });
  await teste('S2: nome com barra, curto ou longo demais, e senha vazia: recusados', async () => {
    const db = fake({});
    for (const [u, s] of [['a/b', 'x'], ['ab', 'x'], ['x'.repeat(31), 'x'], ['teste1', '']]) {
      const e = await C.entrar(db, entra, T0, u, s).catch((x) => x);
      assert.ok(e instanceof C.Falha, u);
    }
  });
  // ---------- trava (regra 12e): o erro não volta
  await teste('TRAVA: nenhuma gravação em reservas/ leva token ou dados do pagamento', async () => {
    const fs = require('fs'), src = fs.readFileSync(__dirname + '/index.js', 'utf8');
    const ruins = src.split('\n').filter((l) => /reservas\/'\s*\+/.test(l) && /\.set\(/.test(l) && /\b(tok|pixAuto)\b/.test(l));
    assert.deepStrictEqual(ruins, []);
  });
  await teste('TRAVA: a lista usuarios/ (nome → e-mail) continua fechada nas regras', async () => {
    const fs = require('fs'), r = fs.readFileSync(__dirname + '/../firestore.rules', 'utf8');
    assert.ok(!/match\s+\/usuarios\//.test(r));
  });
  console.log(total - falhas.length + '/' + total + ' testes de token e conta passaram' + (falhas.length ? '  |  FALHARAM: ' + falhas.join(' ; ') : ''));
  process.exit(falhas.length ? 1 : 0);
})();
