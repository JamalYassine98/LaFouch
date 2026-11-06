// Envio de mídia para o site (repositório catalogo no GitHub) sem chave nenhuma no app ou no painel.
// A chave fica guardada no Firebase (segredos GH_APP_ID e GH_APP_KEY de um "App do GitHub", que não expira).
// Só o dono (login do Firebase) pode usar. Só aceita arquivos dentro de media/ com nomes simples.
'use strict';
const crypto = require('crypto');

const REPO = { o: 'JamalYassine98', r: 'catalogo', b: 'main' };
const MAX_B64 = 28 * 1024 * 1024; // ~21 MB de arquivo (a função aceita até 32 MB por pedido)
const CAMINHO = /^media\/(giro\/[A-Za-z0-9_.-]{1,60}\.(mp4|webm)|[A-Za-z0-9_.-]{1,80}\.(mp4|webm|mov|jpg|jpeg|png|webp))$/;
const PASTA = /^media(\/giro)?$/;

class Falha extends Error {
  constructor(motivo, status) {
    super(motivo);
    this.motivo = motivo;
    this.status = status || 400;
  }
}

const b64url = (b) => Buffer.from(b).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

// JWT do App (RS256, vale 9 min) → token da instalação (vale 1 h). Guardado em memória enquanto vale.
let cache = null;
async function token(appId, chave, fetchFn) {
  if (cache && cache.exp - Date.now() > 5 * 60000) return cache.t;
  const agora = Math.floor(Date.now() / 1000);
  const corpo = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })) + '.' + b64url(JSON.stringify({ iat: agora - 60, exp: agora + 540, iss: String(appId).trim() }));
  const pem = String(chave).replace(/\\n/g, '\n').trim();
  const jwt = corpo + '.' + b64url(crypto.createSign('RSA-SHA256').update(corpo).sign(pem));
  const h = { Authorization: 'Bearer ' + jwt, Accept: 'application/vnd.github+json', 'User-Agent': 'lafouch-midia' };
  const ri = await fetchFn('https://api.github.com/repos/' + REPO.o + '/' + REPO.r + '/installation', { headers: h });
  if (!ri.ok) throw new Falha('app-sem-acesso', 502);
  const inst = await ri.json();
  const rt = await fetchFn('https://api.github.com/app/installations/' + inst.id + '/access_tokens', { method: 'POST', headers: h });
  if (!rt.ok) throw new Falha('app-token', 502);
  const j = await rt.json();
  cache = { t: j.token, exp: Date.parse(j.expires_at) || Date.now() + 50 * 60000 };
  return cache.t;
}

async function gh(tk, fetchFn, metodo, caminho, corpo) {
  const r = await fetchFn('https://api.github.com/repos/' + REPO.o + '/' + REPO.r + caminho, {
    method: metodo,
    headers: { Authorization: 'Bearer ' + tk, Accept: 'application/vnd.github+json', 'User-Agent': 'lafouch-midia', 'Content-Type': 'application/json' },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Falha('github-' + r.status, 502);
  return r.status === 204 ? {} : r.json();
}

// acao: 'list' {dir} | 'put' {path, b64, msg} | 'del' {path}
async function executa(b, cred, fetchFn) {
  if (!cred.appId || !cred.chave) throw new Falha('sem-config', 503);
  const acao = String(b.acao || '');
  const tk = await token(cred.appId, cred.chave, fetchFn);
  if (acao === 'list') {
    const dir = String(b.dir || 'media');
    if (!PASTA.test(dir)) throw new Falha('pasta');
    const l = await gh(tk, fetchFn, 'GET', '/contents/' + dir + '?ref=' + REPO.b);
    return { ok: true, lista: (l || []).filter((f) => f.type === 'file').map((f) => ({ name: f.name, path: f.path, size: f.size, sha: f.sha })) };
  }
  const path = String(b.path || '');
  if (!CAMINHO.test(path) || path.indexOf('..') >= 0) throw new Falha('caminho');
  const atual = await gh(tk, fetchFn, 'GET', '/contents/' + path + '?ref=' + REPO.b);
  if (acao === 'put') {
    const b64 = String(b.b64 || '');
    if (!b64 || b64.length > MAX_B64 || !/^[A-Za-z0-9+/=]+$/.test(b64)) throw new Falha('arquivo');
    const msg = String(b.msg || 'Mídia: ' + path).slice(0, 120);
    await gh(tk, fetchFn, 'PUT', '/contents/' + path, { message: msg, content: b64, branch: REPO.b, sha: atual && atual.sha ? atual.sha : undefined });
    return { ok: true, path, url: 'https://lafouch.com/' + path };
  }
  if (acao === 'del') {
    if (!atual) return { ok: true, path };
    await gh(tk, fetchFn, 'DELETE', '/contents/' + path, { message: 'Remove ' + path, sha: atual.sha, branch: REPO.b });
    return { ok: true, path };
  }
  throw new Falha('acao');
}

module.exports = { executa, Falha, CAMINHO, _zera: () => { cache = null; } };
