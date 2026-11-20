// S2 (19/11/2026, aprovado e "implementar" do dono): a lista usuarios/<nome> deixa de mostrar o e-mail ao público.
// O site pergunta à função: "este nome está livre?" e "entrar com nome + senha" (a função acha o e-mail e faz o login por dentro).
// Regra pura (sem Firebase): db = { get(path), set(path, dados) (merge) }; entra(email, senha) -> { idToken, refreshToken, expiresIn, localId, email } ou erro.
'use strict';

const { Falha } = require('./falha');
const ERROS_MAX = 5; // senha errada 5 vezes no mesmo nome → espera
const TRAVA_MS = 15 * 60 * 1000;
const nomeOk = (u) => typeof u === 'string' && u.length >= 3 && u.length <= 30 && !/[\/]/.test(u);
const chave = (u) => 'contaTent/' + encodeURIComponent(u).slice(0, 120);

async function livre(db, user) {
  if (!nomeOk(user)) throw new Falha('nome', 400);
  const u = await db.get('usuarios/' + user);
  return { ok: true, livre: !u };
}

async function entrar(db, entra, agora, user, senha) {
  if (!nomeOk(user) || typeof senha !== 'string' || !senha || senha.length > 200) throw new Falha('dados', 400);
  const t = (await db.get(chave(user))) || {};
  if (+t.trava > agora) throw new Falha('espera', 200);
  const u = await db.get('usuarios/' + user);
  const erro = async (motivo) => {
    const erros = (+t.erros || 0) + 1;
    await db.set(chave(user), erros >= ERROS_MAX ? { erros: 0, trava: agora + TRAVA_MS } : { erros });
    throw new Falha(motivo, 200);
  };
  if (!u || !u.email) return erro('login'); // o mesmo motivo de senha errada: não revela se o nome existe
  let s;
  try {
    s = await entra(u.email, senha);
  } catch (e) {
    return erro('login');
  }
  if (t.erros) await db.set(chave(user), { erros: 0 });
  return { ok: true, idToken: s.idToken, refreshToken: s.refreshToken, expiresIn: s.expiresIn, localId: s.localId, email: s.email };
}

module.exports = { Falha, livre, entrar, ERROS_MAX, TRAVA_MS };
