// Mensagens do site para a loja (11/11/2026): "Entre em contato" e pedidos de orçamento de "Atacado".
// Regra de negócio pura: o banco e o e-mail vêm por objetos (para dar para testar sem Firebase).
//   db.salva(id, o) / db.lista(n) / db.muda(id, campos) / db.contaRecentes(chave, desde) -> número
//   envia({ to, subject, text, reply_to }) -> Promise
const crypto = require('crypto');

class Falha extends Error {
  constructor(motivo, status) { super(motivo); this.motivo = motivo; this.status = status || 400; }
}
const EMAIL_OK = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;
const DESTINO = 'lafouch.eyewear@gmail.com';
const PROCURA = ['Solar', 'Leitura', 'Armações'];
const ESTADOS = ['novo', 'respondido', 'fechado'];
function limpa(t, n) { return String(t == null ? '' : t).replace(/[\u0000-\u0008\u000b-\u001f<>]/g, ' ').replace(/[ \t]+/g, ' ').trim().slice(0, n); }
function linha(t, n) { return limpa(t, n).replace(/\s+/g, ' '); }

function valida(b) {
  const tipo = b.tipo === 'atacado' ? 'atacado' : b.tipo === 'contato' ? 'contato' : '';
  if (!tipo) throw new Falha('tipo');
  if (b.site) throw new Falha('robo'); // campo escondido preenchido = robô
  const o = { tipo, nome: linha(b.nome, 80), email: linha(b.email, 120).toLowerCase(), tel: linha(b.tel, 40), lang: b.lang === 'es' ? 'es' : 'pt' };
  if (tipo === 'contato') {
    o.msg = limpa(b.msg, 2000);
    if (o.nome.length < 3 || o.nome.indexOf(' ') < 0) throw new Falha('nome');
    if (!EMAIL_OK.test(o.email)) throw new Falha('email');
    if (o.tel.replace(/\D/g, '').length < 7) throw new Falha('tel');
    if (o.msg.length < 5) throw new Falha('msg');
  } else {
    o.cod = /^A-\d{4}$/.test(String(b.cod || '')) ? b.cod : '';
    o.pais = linha(b.pais, 40);
    o.qtd = linha(b.qtd, 40);
    o.procura = (Array.isArray(b.procura) ? b.procura : []).filter((x) => PROCURA.indexOf(x) >= 0).slice(0, 3);
    o.vistos = (Array.isArray(b.vistos) ? b.vistos : []).map((x) => linha(x, 30)).filter(Boolean).slice(0, 20);
    o.favs = (Array.isArray(b.favs) ? b.favs : []).map((x) => linha(x, 30)).filter(Boolean).slice(0, 20);
  }
  return o;
}

function textoEmail(o) {
  return 'Mensagem pelo site (Entre em contato)\n\n' +
    'Nome: ' + o.nome + '\nE-mail: ' + o.email + '\nTelefone: ' + o.tel + '\nIdioma: ' + (o.lang === 'es' ? 'Español' : 'Português') +
    '\n\n' + o.msg + '\n\nResponda este e-mail para falar direto com o cliente.';
}

async function enviar(db, envia, b, ip, agora) {
  const o = valida(b);
  const chave = crypto.createHash('sha256').update(String(ip || '?')).digest('hex').slice(0, 16);
  if ((await db.contaRecentes(chave, agora - 3600e3)) >= 5) throw new Falha('muitas', 429);
  const id = (agora.toString(36) + crypto.randomBytes(3).toString('hex'));
  Object.assign(o, { ts: agora, est: 'novo', ipk: chave });
  await db.salva(id, o);
  let email = 'nao';
  if (o.tipo === 'contato' && envia) {
    await envia({ to: DESTINO, subject: 'Contato pelo site · ' + o.nome, text: textoEmail(o), reply_to: o.email });
    email = 'ok';
  }
  return { ok: true, id, email };
}

async function lista(db, n) { return { ok: true, itens: await db.lista(Math.min(Math.max(+n || 200, 1), 500)) }; }
async function estado(db, id, est) {
  if (!/^[a-z0-9]{6,24}$/.test(String(id || ''))) throw new Falha('id');
  if (ESTADOS.indexOf(est) < 0) throw new Falha('estado');
  await db.muda(id, { est });
  return { ok: true };
}
module.exports = { Falha, valida, enviar, lista, estado, textoEmail, DESTINO };
