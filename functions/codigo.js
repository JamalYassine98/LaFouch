// Código de 6 números para confirmar o e-mail da conta do site (aprovado 07/11/2026).
// O código é gerado aqui, guardado só como hash em "codigos/<uid>" (o site não lê essa coleção),
// vale 10 min, aceita 5 tentativas e só pode ser reenviado depois de 45 s.
// O e-mail sai pelo Resend (segredo RESEND_KEY) como "La Fouch <nao-responda@lafouch.com>".
'use strict';
const crypto = require('crypto');
const E = require('./email');

const VALE = 10 * 60000, ESPERA = 45000, TENT = 5;
const { Falha } = require('./falha');
const hash = (uid, c) => crypto.createHash('sha256').update(uid + ':' + c).digest('hex');
const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function emailHtml(nome, cod, es) {
  const pn = String(nome || '').trim().split(/\s+/)[0];
  return E.molde(es ? 'Confirmá tu ' + E.I('e-mail') : 'Confirme seu ' + E.I('e-mail'),
    E.P((es ? '¡Hola' : 'Olá') + (pn ? ', ' + esc(pn) : '') + (es ? '! Usá este código para terminar tu cuenta:' : '. Use este código para concluir sua conta:')) +
    E.codigo(cod) + E.PQ(es ? 'Vale por 10 minutos. Si no fuiste vos, ignorá este e-mail.' : 'Vale por 10 minutos. Se não foi você, ignore este e-mail.'));
}

// db: { get(uid) -> {h, exp, t, n}|null, set(uid, obj), del(uid) }  ·  envia({to, subject, html, text}) -> Promise
async function enviar(db, envia, u, agora, lang) {
  if (u.verificado) return { ok: true, ja: true };
  if (!envia) throw new Falha('sem-config', 503);
  const a = await db.get(u.uid);
  if (a && a.t && agora - a.t < ESPERA) throw new Falha('espere', 429, { s: Math.ceil((ESPERA - (agora - a.t)) / 1000) });
  const cod = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  await db.set(u.uid, { h: hash(u.uid, cod), exp: agora + VALE, t: agora, n: 0 });
  const es = lang === 'es';
  await envia({
    to: u.email,
    subject: cod + (es ? ' es tu código de La Fouch' : ' é o seu código da La Fouch'),
    html: emailHtml(u.nome, cod, es),
    text: (es ? 'Tu código de La Fouch: ' : 'Seu código da La Fouch: ') + cod + (es ? ' (vale por 10 minutos)' : ' (vale por 10 minutos)'),
  });
  return { ok: true };
}

async function conferir(db, u, codigo, agora) {
  if (u.verificado) return { ok: true, ja: true };
  const c = String(codigo || '').replace(/\D/g, '');
  if (c.length !== 6) throw new Falha('codigo');
  const a = await db.get(u.uid);
  if (!a) throw new Falha('sem-codigo');
  if (agora > a.exp) { await db.del(u.uid); throw new Falha('vencido'); }
  if (a.n >= TENT) { await db.del(u.uid); throw new Falha('tentativas'); }
  if (a.h !== hash(u.uid, c)) {
    await db.set(u.uid, Object.assign({}, a, { n: a.n + 1 }));
    throw new Falha('errado', 400, { resta: TENT - a.n - 1 });
  }
  await db.del(u.uid);
  return { ok: true, confirmado: true };
}

module.exports = { enviar, conferir, Falha, emailHtml, VALE, ESPERA, TENT };
