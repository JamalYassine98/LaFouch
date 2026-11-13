// Avaliações das peças (só de quem comprou) e inscrição em novidades do site (v451).
// Regra de negócio pura: o acesso ao banco vem por um objeto "db" (para dar para testar sem Firebase).
//   db.pedidosDoEmail(email) -> [{ id, itens:[{ref}], ent }]
//   db.reservaPaga(id) -> true/false            (reservas/<id>.pago, gravado pelo app quando confirma o pagamento)
//   db.getAval(id) / db.setAval(id, o) / db.listaAval(ref) / db.recentesAval(n)
//   db.setInscricao(id, o) / db.listaInscricoes()
const crypto = require('crypto');

class Falha extends Error {
  constructor(motivo, status, extra) {
    super(motivo);
    this.motivo = motivo;
    this.status = status || 400;
    this.extra = extra || {};
  }
}

const REF_OK = /^[A-Za-z0-9._-]{1,30}$/;
const EMAIL_OK = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;

function limpa(t, n) {
  return String(t == null ? '' : t).replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
}
// "Ana Paula Souza" -> "Ana S."  (nunca o nome completo no site)
function nomeCurto(nome) {
  const p = limpa(nome, 60).split(' ').filter(Boolean);
  if (!p.length) return 'Cliente';
  const a = p[0].charAt(0).toUpperCase() + p[0].slice(1).toLowerCase();
  return p.length > 1 ? a + ' ' + p[p.length - 1].charAt(0).toUpperCase() + '.' : a;
}
function avalId(ref, uid) {
  return ref + '__' + uid;
}

// Comprou esta peça? Precisa de um pedido com o mesmo e-mail (confirmado), com a peça, e com o pagamento confirmado pela loja.
async function compra(db, email, ref) {
  if (!email) return null;
  const peds = await db.pedidosDoEmail(String(email).toLowerCase());
  for (const p of peds) {
    if (!(p.itens || []).some((i) => i && i.ref === ref)) continue;
    if (await db.reservaPaga(p.id)) return p;
  }
  return null;
}

async function posso(db, u, ref) {
  if (!REF_OK.test(String(ref || ''))) throw new Falha('ref');
  if (!u || !u.verificado) return { ok: true, pode: false, motivo: 'email' };
  const p = await compra(db, u.email, ref);
  if (!p) return { ok: true, pode: false, motivo: 'sem-compra' };
  const ja = await db.getAval(avalId(ref, u.uid));
  return { ok: true, pode: true, ja: ja ? { nota: ja.nota, txt: ja.txt } : null };
}

// 13/11 (aprovado): opinião com link, telefone, e-mail, palavrão ou propaganda de outra loja não publica sozinha — vai para o dono revisar
const PALAVROES = /\b(put[ao]s?|mierda|carajo|pelotud[oa]|boludo|idiota|estafa(dor)?|ladr[oó]n(es)?|porra|merda|caralho|vagabund[oa]|lixo|golpe|golpista|fdp|hdp)\b/i;
function suspeita(t) {
  const x = String(t || '');
  if (/https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|py|br|ar|shop|store)\b|wa\.me|t\.me|bit\.ly/i.test(x)) return 'link';
  if (/(\d[\s.\-()]?){7,}/.test(x)) return 'telefone';
  if (/[\w.+-]+@[\w-]+\./.test(x) || /(^|\s)@[a-z0-9_.]{3,}/i.test(x)) return 'contato';
  if (PALAVROES.test(x)) return 'palavrao';
  if (/\b(otra|outra)s?\s+(tienda|loja|[oó]ptica|ótica)\b|\b(compren|comprem|compr[aá]\s+en|comprar\s+na)\b|\b(instagram|facebook|tiktok|whatsapp)\b/i.test(x)) return 'outra-loja';
  return '';
}
async function avaliar(db, u, b, agora) {
  const ref = String(b.ref || '');
  if (!REF_OK.test(ref)) throw new Falha('ref');
  const nota = Math.round(+b.nota);
  if (!(nota >= 1 && nota <= 5)) throw new Falha('nota');
  const txt = limpa(b.txt, 500);
  if (!u || !u.verificado) throw new Falha('email', 403);
  const p = await compra(db, u.email, ref);
  if (!p) throw new Falha('sem-compra', 403);
  const id = avalId(ref, u.uid);
  const antes = await db.getAval(id);
  const o = {
    ref,
    uid: u.uid,
    nome: nomeCurto(u.nome || String(u.email).split('@')[0]),
    cidade: limpa(b.cidade, 40),
    nota,
    txt,
    via: p.ent === 'delivery' ? 'delivery' : 'retiro',
    ts: antes && antes.ts ? antes.ts : agora,
    ed: antes ? agora : 0,
    ok: antes && antes.ok === false ? false : true, // oculta pelo dono continua oculta
  };
  const sus = suspeita(txt);
  if (sus) { o.ok = false; o.rev = true; o.sus = sus; } else if (antes && antes.rev) { o.rev = false; o.ok = true; }
  await db.setAval(id, o);
  return { ok: true, id, rev: !!o.rev };
}

// Lista pública de uma peça: só as visíveis, mais novas primeiro, com a média.
async function lista(db, ref) {
  if (!REF_OK.test(String(ref || ''))) throw new Falha('ref');
  const l = (await db.listaAval(ref)).filter((a) => a && a.ok !== false).sort((a, b) => b.ts - a.ts);
  const n = l.length,
    soma = l.reduce((s, a) => s + (+a.nota || 0), 0);
  const dist = [5, 4, 3, 2, 1].map((k) => l.filter((a) => a.nota === k).length);
  return {
    ok: true,
    n,
    media: n ? Math.round((soma / n) * 10) / 10 : 0,
    dist,
    itens: l.slice(0, 50).map((a) => ({ nome: a.nome, cidade: a.cidade || '', nota: a.nota, txt: a.txt || '', via: a.via || '', ts: a.ts })),
  };
}

async function inscrever(db, b, agora) {
  const email = limpa(b.email, 200).toLowerCase();
  if (!EMAIL_OK.test(email)) throw new Falha('email');
  const id = crypto.createHash('sha256').update(email).digest('hex').slice(0, 40);
  await db.setInscricao(id, { email, lang: b.lang === 'es' ? 'es' : 'pt', ts: agora, orig: 'site' });
  return { ok: true };
}

module.exports = { suspeita, Falha, nomeCurto, compra, posso, avaliar, lista, inscrever, avalId };
