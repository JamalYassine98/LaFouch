// "Avisarme cuando vuelva" (S173-3A, aprovado 11/11/2026).
// A pessoa deixa o e-mail na página da peça esgotada; quando a peça volta ao estoque (aviso deixa de ser
// "Esgotado" no app), vai 1 e-mail só para cada pedido. O e-mail também entra na lista de inscritos (novidades).
// Regra pura: o banco vem por um objeto "db" (para testar sem Firebase).
//   db.salva(id, o) · db.get(id) · db.pendentes(ref) -> [{id, ...}] · db.muda(id, c) · db.contaEmail(email) -> n pendentes
//   db.inscreve(email, lang)
const crypto = require('crypto');

class Falha extends Error {
  constructor(motivo, status) {
    super(motivo);
    this.motivo = motivo;
    this.status = status || 400;
  }
}
const REF_OK = /^[A-Za-z0-9._-]{1,30}$/;
const EMAIL_OK = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;
const MAX_POR_EMAIL = 10; // pedidos pendentes por e-mail (evita abuso)
const hash = (t) => crypto.createHash('sha256').update(t).digest('hex').slice(0, 32);
const limpa = (t, n) => String(t == null ? '' : t).replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);

async function pedir(db, b, agora) {
  const ref = String(b.ref || '');
  if (!REF_OK.test(ref)) throw new Falha('ref');
  const email = limpa(b.email, 200).toLowerCase();
  if (!EMAIL_OK.test(email)) throw new Falha('email');
  if (b.site) throw new Falha('robo');
  const lang = b.lang === 'es' ? 'es' : 'pt';
  const id = hash(email) + '_' + ref;
  const ja = await db.get(id);
  if (ja && !ja.env) return { ok: true, ja: true };
  if ((await db.contaEmail(email)) >= MAX_POR_EMAIL) throw new Falha('muitas', 429);
  await db.salva(id, { ref, email, lang, ts: agora, env: false });
  try { await db.inscreve(email, lang); } catch (e) {}
  return { ok: true };
}

function mensagem(o, nome) {
  const es = o.lang === 'es';
  const link = 'https://lafouch.com/?ref=' + encodeURIComponent(o.ref);
  const n = limpa(nome || o.ref, 80);
  return {
    to: o.email,
    subject: (es ? 'Volvió: ' : 'Voltou: ') + n + ' · La Fouch',
    html:
      '<div style="font-family:Arial,sans-serif;font-size:15px;color:#222">' +
      '<p>' + (es ? '¡Buenas noticias! <b>' + n + '</b> está otra vez en stock.' : 'Boa notícia! <b>' + n + '</b> voltou ao estoque.') + '</p>' +
      '<p><a href="' + link + '" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#a44a7e;color:#fff;text-decoration:none;font-weight:bold">' + (es ? 'Ver la pieza' : 'Ver a peça') + '</a></p>' +
      '<p style="color:#888;font-size:12px">' + (es ? 'Te avisamos una sola vez, como pediste.' : 'Avisamos uma vez só, como você pediu.') + '</p></div>',
  };
}

// A peça voltou: manda 1 e-mail por pedido pendente e marca como enviado (nunca manda duas vezes).
async function dispara(db, envia, ref, nome, agora) {
  const l = await db.pendentes(ref);
  let n = 0;
  for (const o of l) {
    if (o.env) continue;
    try {
      await envia(mensagem(o, nome));
      await db.muda(o.id, { env: true, envTs: agora });
      n++;
    } catch (e) {}
  }
  return n;
}

// O app tirou o "Esgotado"? (antes esgotado, agora não, e não está oculta)
function voltou(antes, depois) {
  return !!antes && !!depois && antes.aviso === 'Esgotado' && depois.aviso !== 'Esgotado' && !depois.oculto;
}

module.exports = { Falha, pedir, dispara, voltou, mensagem, MAX_POR_EMAIL };
