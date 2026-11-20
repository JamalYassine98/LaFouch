// Todas as portas públicas da nuvem (onRequest), com o Firebase de mentira (20/11/2026, limpeza regra 12).
// Trava: cada porta responde igual a método errado, corpo vazio, ação inválida, corpo em texto e ação do dono sem login,
// e as portas do site usam UMA lista de endereços (CORS_SITE). Com SNAP=arquivo, grava as respostas para comparar antes × depois.
'use strict';
const Module = require('module');
const fs = require('fs');

const vazio = { exists: false, data: () => ({}), get: () => undefined };
// aparelhos cadastrados (para o teste dos avisos); apagados = os que a nuvem tirou da lista; enviados = os avisos mandados
const aparelhos = [], apagados = [], enviados = [];
const consulta = (c) => {
  const q = { where: () => q, orderBy: () => q, limit: () => q,
    get: async () => { const docs = c === 'dispositivos' ? aparelhos.map(([id, d]) => ({ id, data: () => d })) : []; return { docs, empty: !docs.length, size: docs.length }; } };
  return q;
};
const doc = (p) => ({ path: p, get: async () => vazio, set: async () => {}, update: async () => {}, delete: async () => { apagados.push(p); }, create: async () => {} });
const fakeDb = {
  doc, collection: (c) => Object.assign(consulta(c), { doc: (id) => doc(c + '/' + id), add: async () => ({}), listDocuments: async () => [] }),
  runTransaction: async (fn) => fn({ get: async () => vazio, set() {}, update() {}, delete() {} }),
};
const firestore = Object.assign(() => fakeDb, { FieldValue: { increment: (n) => n } });
const portas = {};
const stubs = {
  'firebase-admin': {
    initializeApp() {}, firestore,
    messaging: () => ({ send: async (m) => { if (m.token === 'morto') throw Object.assign(new Error('x'), { code: 'messaging/registration-token-not-registered' }); enviados.push(m); } }),
    appCheck: () => ({ verifyToken: async () => { throw new Error('x'); } }),
    auth: () => ({ verifyIdToken: async () => { throw new Error('token'); }, getUser: async () => ({}) }),
  },
  'firebase-functions/v2/firestore': { onDocumentCreated: (o, fn) => fn, onDocumentUpdated: (o, fn) => fn, onDocumentWritten: (o, fn) => fn },
  'firebase-functions/v2/scheduler': new Proxy({}, { get: () => () => () => {} }),
  'firebase-functions/params': { defineSecret: () => ({ value: () => '' }) },
  'firebase-functions/v2/https': { onRequest: (opts, fn) => Object.assign(fn, { opcoes: opts }) },
};
const orig = Module._load;
Module._load = function (req, ...a) { return stubs[req] || orig.call(this, req, ...a); };
const idx = require('./index.js');
Module._load = orig;
for (const k of Object.keys(idx)) if (typeof idx[k] === 'function' && idx[k].opcoes) portas[k] = idx[k];

function chama(fn, metodo, body, auth) {
  return new Promise((ok) => {
    const fim = (o) => { clearTimeout(t); ok(o); };
    const t = setTimeout(() => ok({ code: 'sem-resposta' }), 3000);
    const req = { method: metodo, body, query: {}, ip: '1.2.3.4', headers: {}, get: (h) => (/^authorization$/i.test(h) ? auth || '' : '') };
    const res = { code: 200, status(c) { this.code = c; return this; }, set() { return this; },
      json(o) { fim({ code: this.code, json: o }); }, send(s) { fim({ code: this.code, html: String(s || '').length > 0 }); } };
    Promise.resolve(fn(req, res)).catch((e) => fim({ code: 'erro', msg: String(e && e.message) }));
  });
}
const casos = [
  ['GET', 'GET', undefined, ''],
  ['vazio', 'POST', {}, ''],
  ['acao-invalida', 'POST', { acao: 'xyz' }, ''],
  ['texto', 'POST', '{"acao":"xyz"}', ''],
  ['dono-sem-login', 'POST', { acao: 'lista' }, ''],
  ['login-falso', 'POST', { acao: 'lista' }, 'Bearer lixo'],
];

let ok = 0; const falhas = [];
function t(n, c) { if (c) { ok++; console.log('  ok  ' + n); } else { falhas.push(n); console.log('  FALHA  ' + n); } }

(async () => {
  const snap = {};
  for (const nome of Object.keys(portas).sort()) {
    const o = portas[nome].opcoes;
    snap[nome] = { cors: o.cors, max: o.maxInstances, segredos: (o.secrets || []).length, respostas: {} };
    for (const [c, m, b, a] of casos) snap[nome].respostas[c] = await chama(portas[nome], m, b, a);
  }
  if (process.env.SNAP) fs.writeFileSync(process.env.SNAP, JSON.stringify(snap, null, 1));
  const nomes = Object.keys(snap);
  t('achou as 15 portas', nomes.length === 15);
  t('nenhuma porta fica sem responder ou quebra', nomes.every((n) => Object.values(snap[n].respostas).every((r) => typeof r.code === 'number')));
  const soGET = ['avaliacao', 'comprovante']; // leem com GET (lista pública de avaliações; página do comprovante)
  t('método errado: 405 em todas', nomes.filter((n) => soGET.indexOf(n) < 0).every((n) => snap[n].respostas.GET.code === 405) && snap.comprovante.respostas.vazio.code === 405);
  t('ação do dono sem login ou com login falso nunca passa (403/401/400/405)', nomes.every((n) => [400, 401, 403, 405].includes(snap[n].respostas['dono-sem-login'].code) && [400, 401, 403, 405].includes(snap[n].respostas['login-falso'].code)));
  // regra 12c: cada peça comum num lugar só (antes estavam copiadas porta a porta)
  const src = fs.readFileSync(__dirname + '/index.js', 'utf8');
  const conta = (s, x) => s.split(x).length - 1;
  t('o corpo do pedido é lido num lugar só (corpo)', conta(src, 'req.body') === 1);
  t('o login de quem chama é lido num lugar só (tokenDe)', conta(src, 'Bearer (') === 1 && conta(src, 'verifyIdToken') === 1);
  t('o resumo (sha256) e o endereço das funções num lugar só', conta(src, 'createHash') === 1 && conta(src, 'cloudfunctions.net') === 1);
  t('o envio de avisos ao celular num lugar só (avisaAparelhos)', conta(src, 'messaging().send') === 1);
  t('o erro esperado (Falha) existe só em falha.js', fs.readdirSync(__dirname).filter((f) => /\.js$/.test(f) && !/^teste-/.test(f)).every((f) => conta(fs.readFileSync(__dirname + '/' + f, 'utf8'), 'class Falha') === (f === 'falha.js' ? 1 : 0)));
  t('nenhuma porta trata o erro da sua cópia de Falha (só o falhou de todas)', !/instanceof \w+\.Falha/.test(src));
  t('corpo em texto é lido igual ao corpo em JSON', nomes.every((n) => JSON.stringify(snap[n].respostas.texto) === JSON.stringify(snap[n].respostas['acao-invalida'])));
  const listas = nomes.map((n) => snap[n].cors).filter(Array.isArray);
  const site = listas.filter((l) => l.length > 1);
  t('portas do site usam UMA lista de endereços', site.length > 0 && site.every((l) => l === site[0]));
  // avisos no celular: cada aparelho com o seu som; aparelho de app desinstalado sai da lista; quem não quer o tipo não recebe
  aparelhos.push(['a1', { sn: 'moeda' }], ['a2', { som: 'harpa' }], ['morto', {}], ['a3', { n: false }]);
  await idx.avisarPedido({ data: { data: () => ({ cod: 'ABC123', nome: 'Teste', total: 1000 }) }, params: { id: 'PTESTE1' } });
  t('aviso de pedido novo: um por aparelho, cada um com o seu som', enviados.length === 2 && enviados[0].android.notification.channelId === 'pedidos_moeda' && enviados[1].android.notification.channelId === 'pedidos_harpa');
  t('aparelho que não existe mais sai da lista', apagados.indexOf('dispositivos/morto') >= 0);
  enviados.length = 0; apagados.length = 0;
  await idx.avisarChama({ data: { data: () => ({ n: 2, de: 'a1' }) }, params: { id: 'C1' } });
  t('chamar vendedor: não avisa o próprio aparelho que chamou', enviados.length === 3 - 1 && enviados.every((m) => m.token !== 'a1'));
  console.log(falhas.length ? `portas: ${falhas.length} falha(s)` : `portas: ${ok} testes ok`);
  process.exit(falhas.length ? 1 : 0);
})();
