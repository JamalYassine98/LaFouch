// Código de 6 números para confirmar o e-mail da conta do site (aprovado 07/11/2026).
// O código é gerado aqui, guardado só como hash em "codigos/<uid>" (o site não lê essa coleção),
// vale 10 min, aceita 5 tentativas e só pode ser reenviado depois de 45 s.
// O e-mail sai pelo Resend (segredo RESEND_KEY) como "La Fouch <nao-responda@lafouch.com>".
'use strict';
const crypto = require('crypto');

const VALE = 10 * 60000, ESPERA = 45000, TENT = 5;
class Falha extends Error {
  constructor(motivo, status, extra) {
    super(motivo);
    this.motivo = motivo;
    this.status = status || 400;
    this.extra = extra || {};
  }
}
const hash = (uid, c) => crypto.createHash('sha256').update(uid + ':' + c).digest('hex');
const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function emailHtml(nome, cod, es) {
  const ola = es ? '¡Hola' : 'Olá', t1 = es ? 'Usa este código para confirmar tu e-mail:' : 'Use este código para confirmar seu e-mail:';
  const t2 = es ? 'Vale por 10 minutos. Si no fuiste tú, ignora este e-mail.' : 'Vale por 10 minutos. Se não foi você, ignore este e-mail.';
  const pn = String(nome || '').trim().split(/\s+/)[0];
  return '<!doctype html><html><body style="margin:0;background:#f3eef1;font-family:Arial,Helvetica,sans-serif;padding:24px 0">' +
    '<div style="max-width:420px;margin:0 auto;background:#fff;border-radius:18px;padding:28px 24px;text-align:center">' +
    '<img src="https://lafouch.com/icon-192.png" width="64" height="64" alt="La Fouch" style="border-radius:14px">' +
    '<div style="font:600 22px Georgia,serif;color:#8d3a69;margin:10px 0 2px">La Fouch</div><div style="font-size:11px;letter-spacing:.18em;color:#a07090">TUDO EM ÓCULOS</div>' +
    '<p style="font-size:16px;color:#222;margin:22px 0 6px">' + ola + (pn ? ', ' + esc(pn) : '') + (es ? '!' : '!') + '</p><p style="font-size:14px;color:#555;margin:0 0 14px">' + t1 + '</p>' +
    '<div style="font:700 34px/1 \'Courier New\',monospace;letter-spacing:10px;color:#241a21;background:#f8f1f5;border-radius:14px;padding:16px 0">' + cod + '</div>' +
    '<p style="font-size:13px;color:#777;margin:14px 0 0">' + t2 + '</p></div>' +
    '<p style="max-width:420px;margin:12px auto 0;font-size:11px;color:#999;text-align:center">La Fouch · Ciudad del Este, Paraguay · lafouch.com</p></body></html>';
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
