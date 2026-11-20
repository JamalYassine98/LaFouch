// S5 + S7 (aprovados pelo dono 20/11/2026; esboço privado S5S7): "Receber novidades" só para quem CONFIRMOU o e-mail.
// Quem se inscreve (no site, ou pelo "Avise-me quando voltar") recebe 1 e-mail "Confirme para receber" com um link;
// só depois de tocar nele entra na lista e recebe o e-mail do tema. Inscrever o e-mail de outra pessoa = ela só recebe o "Confirme".
// Regra pura: db = { get(id), set(id, o) (merge), recentes(ipk, desde) -> n } · envia({ to, subject, html }) · url = endereço da função novidades.
'use strict';
const crypto = require('crypto');
const { Falha } = require('./falha');
const { EMAIL_OK, linha } = require('./texto');
const E = require('./email');

const HORA = 36e5, MAX_HORA = 5; // no máximo 5 inscrições por rede por hora
const REENVIO = 10 * 60e3; // o "Confirme" não sai de novo para o mesmo e-mail antes de 10 min
const VALE = 7 * 864e5; // o link vale 7 dias; inscrição não confirmada some na limpeza diária depois disso
const sha = (t) => crypto.createHash('sha256').update(String(t)).digest('hex');
const idDe = (email) => sha(email).slice(0, 40); // o mesmo id de antes (o link "Não quero mais receber" continua valendo)
const vale = (o) => !!o && o.conf === true && !o.sair; // recebe o e-mail do tema

function emailConfirma(link, es) {
  return E.molde(es ? 'Confirmá tu ' + E.I('e-mail') : 'Confirme seu ' + E.I('e-mail'),
    E.P(es ? 'Tocá el botón para recibir las novedades de La Fouch. Si no fuiste vos, ignorá este e-mail: no vas a recibir nada más.'
      : 'Toque no botão para receber as novidades da La Fouch. Se não foi você, ignore este e-mail: você não vai receber mais nada.') +
    E.B(es ? 'Confirmar' : 'Confirmar', link));
}

async function inscrever(db, envia, b, agora, ipk, url) {
  const email = linha(b.email, 200).toLowerCase();
  if (!EMAIL_OK.test(email)) throw new Falha('email');
  if (ipk && (await db.recentes(ipk, agora - HORA)) >= MAX_HORA) throw new Falha('espera', 429);
  const id = idDe(email), o = (await db.get(id)) || {}, es = b.lang === 'es';
  if (vale(o)) return { ok: true, conf: true };
  if (o.envTs && agora - o.envTs < REENVIO) return { ok: true, confirmar: true };
  if (!envia) throw new Falha('envio', 503);
  const tok = crypto.randomBytes(16).toString('hex');
  await db.set(id, { email, lang: es ? 'es' : 'pt', ts: agora, orig: b.orig === 'volta' ? 'volta' : 'site', conf: false, sair: false, tok: sha(tok), envTs: agora, ipk: ipk || '' });
  await envia({ to: email, subject: es ? 'Confirmá tu e-mail · La Fouch' : 'Confirme seu e-mail · La Fouch', html: emailConfirma(url + '?confirmar=' + id + '&t=' + tok + (es ? '&l=es' : ''), es) });
  return { ok: true, confirmar: true };
}

async function confirmar(db, id, t, agora) {
  if (!/^[a-f0-9]{40}$/.test(String(id || '')) || !/^[a-f0-9]{32}$/.test(String(t || ''))) throw new Falha('link');
  const o = await db.get(id);
  if (!o) throw new Falha('link');
  if (o.conf === true) return { ok: true, ja: true }; // confirmar 2 vezes = igual a 1
  const a = Buffer.from(String(o.tok || '')), c = Buffer.from(sha(t));
  if (!o.tok || agora - (+o.envTs || 0) > VALE || a.length !== c.length || !crypto.timingSafeEqual(a, c)) throw new Falha('link');
  await db.set(id, { conf: true, confTs: agora, tok: '' });
  return { ok: true };
}

module.exports = { inscrever, confirmar, vale, emailConfirma, idDe, MAX_HORA, REENVIO, VALE };
