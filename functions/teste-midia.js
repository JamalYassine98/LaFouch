// Teste do envio de mídia com um GitHub de mentira (confere o JWT do App, o caminho permitido e o sha na troca).
'use strict';
const assert = require('assert');
const crypto = require('crypto');
const M = require('./midia');
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const pem = privateKey.export({ type: 'pkcs1', format: 'pem' });
const arquivos = {};
let chamadas = [];
async function fakeFetch(url, o) {
  o = o || {};
  chamadas.push((o.method || 'GET') + ' ' + url);
  const auth = (o.headers || {}).Authorization || '';
  const json = (st, d) => ({ ok: st < 300, status: st, json: async () => d });
  if (/\/installation$/.test(url) || /access_tokens$/.test(url)) {
    const jwt = auth.replace('Bearer ', '').split('.');
    const ok = crypto.createVerify('RSA-SHA256').update(jwt[0] + '.' + jwt[1]).verify(publicKey, Buffer.from(jwt[2].replace(/-/g, '+').replace(/_/g, '/'), 'base64'));
    const pl = JSON.parse(Buffer.from(jwt[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
    if (!ok || pl.iss !== '123') return json(401, {});
    if (/\/installation$/.test(url)) return json(200, { id: 77 });
    return json(201, { token: 'TOK', expires_at: new Date(Date.now() + 3600e3).toISOString() });
  }
  assert.strictEqual(auth, 'Bearer TOK');
  const m = /\/contents\/([^?]+)/.exec(url), p = m && m[1];
  const metodo = o.method || 'GET';
  if (metodo === 'GET') {
    if (p === 'media' || p === 'media/giro') return json(200, Object.keys(arquivos).filter((k) => k.startsWith(p + '/') && k.slice(p.length + 1).indexOf('/') < 0).map((k) => ({ type: 'file', name: k.split('/').pop(), path: k, size: 3, sha: arquivos[k].sha })));
    return arquivos[p] ? json(200, { sha: arquivos[p].sha }) : json(404, {});
  }
  const b = JSON.parse(o.body);
  if (metodo === 'PUT') {
    if (arquivos[p] && b.sha !== arquivos[p].sha) return json(409, {});
    arquivos[p] = { sha: 's' + Math.random(), c: b.content };
    return json(201, {});
  }
  if (metodo === 'DELETE') { delete arquivos[p]; return json(200, {}); }
}
(async () => {
  const cred = { appId: '123', chave: pem };
  let r = await M.executa({ acao: 'put', path: 'media/giro/AC1050.mp4', b64: 'AAAA' }, cred, fakeFetch);
  assert.ok(r.ok && arquivos['media/giro/AC1050.mp4']);
  r = await M.executa({ acao: 'put', path: 'media/giro/AC1050.mp4', b64: 'BBBB' }, cred, fakeFetch); // troca: precisa do sha
  assert.strictEqual(arquivos['media/giro/AC1050.mp4'].c, 'BBBB');
  r = await M.executa({ acao: 'list', dir: 'media/giro' }, cred, fakeFetch);
  assert.deepStrictEqual(r.lista.map((f) => f.name), ['AC1050.mp4']);
  for (const ruim of ['index.html', 'media/../index.html', 'media/a/b.mp4', 'media/x.html', '.github/workflows/x.yml']) {
    await assert.rejects(M.executa({ acao: 'put', path: ruim, b64: 'AAAA' }, cred, fakeFetch), (e) => e.motivo === 'caminho', ruim);
  }
  await assert.rejects(M.executa({ acao: 'put', path: 'media/a.mp4', b64: 'não é base64!' }, cred, fakeFetch), (e) => e.motivo === 'arquivo');
  await assert.rejects(M.executa({ acao: 'list', dir: '.github' }, cred, fakeFetch), (e) => e.motivo === 'pasta');
  r = await M.executa({ acao: 'del', path: 'media/giro/AC1050.mp4' }, cred, fakeFetch);
  assert.ok(r.ok && !arquivos['media/giro/AC1050.mp4']);
  M._zera();
  await assert.rejects(M.executa({ acao: 'list' }, { appId: '999', chave: pem }, fakeFetch), (e) => e.motivo === 'app-sem-acesso');
  await assert.rejects(M.executa({ acao: 'list' }, { appId: '', chave: '' }, fakeFetch), (e) => e.motivo === 'sem-config');
  console.log('mídia: 8 testes ok');
})().catch((e) => { console.error('FALHA', e); process.exit(1); });
