// Avisos do site para o app da loja (celular).
// Dispara quando o site cria um documento em "pedidos": pedido novo, comprovante, cancelamento.
// Cada aparelho cadastrado (coleção "dispositivos") tem as suas opções: n/c/x/p (tipos de aviso),
// som, e silêncio por horário (q, qi, qf) — definidas em Ajustes > Avisos de pedidos no app.
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onRequest } = require('firebase-functions/v2/https');
const Reserva = require('./reserva');
const admin = require('firebase-admin');

admin.initializeApp();

// A região da função precisa ser a MESMA do banco Firestore (Firebase > Firestore > Dados > Local).
const REGIAO = 'southamerica-east1';
const FUSO = 'America/Asuncion';

function gs(n) {
  return 'Gs. ' + String(Math.round(+n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function texto(f) {
  const cod = String(f.cod || '').slice(0, 8);
  if (f.tipo === 'cancel' && f.ref === 'teste') return { tipo: 'teste', titulo: '🔔 Aviso de teste', corpo: 'Assim chegam os avisos neste aparelho · ' + new Intl.DateTimeFormat('pt-BR', { timeZone: FUSO, hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()) };
  if (f.tipo === 'comp') return { tipo: 'comp', titulo: '🧾 Comprovante recebido', corpo: 'Pedido ' + cod + ': confira o pagamento.' };
  if (f.tipo === 'cancel') return { tipo: 'cancel', titulo: 'Pedido cancelado', corpo: 'O cliente cancelou o pedido ' + cod + ' pelo site.' };
  const nome = String(f.nome || 'Cliente').slice(0, 40);
  return { tipo: 'novo', titulo: '🛒 Novo pedido ' + cod, corpo: nome + ' · ' + gs(f.total) + (f.teste ? ' · TESTE' : '') };
}

function min(h) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(h || '');
  return m ? +m[1] * 60 + +m[2] : 0;
}

function agoraMin() {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: FUSO, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const h = +p.find((x) => x.type === 'hour').value % 24;
  return h * 60 + +p.find((x) => x.type === 'minute').value;
}

function quieto(d) {
  if (!d.q) return false;
  const m = agoraMin(), i = min(d.qi || '18:00'), f = min(d.qf || '07:00');
  return i <= f ? m >= i && m < f : m >= i || m < f;
}

// Esse aparelho quer esse tipo de aviso agora?
function quer(d, tipo) {
  if (tipo === 'teste') return true;
  const campo = { novo: 'n', comp: 'c', cancel: 'x', pago: 'p' }[tipo];
  if (d[campo] === false) return false;
  return !quieto(d);
}

exports.avisarPedido = onDocumentCreated({ document: 'pedidos/{id}', region: REGIAO }, async (ev) => {
  const snap = ev.data;
  if (!snap) return;
  const f = snap.data() || {};
  const t = texto(f);
  const db = admin.firestore();
  const lista = await db.collection('dispositivos').get();
  const alvo = lista.docs.filter((d) => quer(d.data() || {}, t.tipo));
  if (!alvo.length) return;
  // um envio por aparelho, porque o som (canal) muda de aparelho para aparelho
  const resp = await Promise.all(alvo.map(async (d) => {
    const dd = d.data() || {};
    // som escolhido para este tipo de aviso (aparelhos antigos só têm "som", que vale para todos)
    const campoSom = { novo: 'sn', comp: 'sc', cancel: 'sx', pago: 'sp', teste: 'sn' }[t.tipo];
    const som = dd[campoSom] || dd.som || 'sino';
    try {
      await admin.messaging().send({
        token: d.id,
        notification: { title: t.titulo, body: t.corpo },
        data: { tipo: t.tipo, id: String(ev.params.id) },
        // tag única por aviso: o Android não junta nem esconde avisos parecidos (o 2º teste sumia da bandeja)
        android: { priority: 'high', notification: { channelId: 'pedidos_' + som, tag: String(ev.params.id), defaultVibrateTimings: true } }
      });
      return null;
    } catch (e) {
      const c = e && e.code;
      return c === 'messaging/registration-token-not-registered' || c === 'messaging/invalid-registration-token' ? d.id : null;
    }
  }));
  // tira da lista os aparelhos que não existem mais (app desinstalado)
  await Promise.all(resp.filter(Boolean).map((tk) => db.collection('dispositivos').doc(tk).delete()));
});

// ---------- Reserva de estoque (site e app) ----------
// Só funciona se config/site tiver reserva = true (interruptor do dono). Desligada, responde {ok:true, off:true}
// e o site segue vendendo como antes.
// o projeto de teste (lafouch-teste) tem outro usuário dono
const DONO_UID = process.env.GCLOUD_PROJECT === 'lafouch-teste' ? 'uvYpqxPJZjTsSE9SACouW0nZH4d2' : 'jJzNDoMHtuRNOAF1GhJfNYDMlE63';
const DONO_EMAIL = 'jamalaliyassine@gmail.com';
const PUBLICAS = ['reservar', 'comp', 'cancelar'];
const DO_DONO = ['pagar', 'liberar', 'recusar'];

async function ehDono(req) {
  const m = /^Bearer (.+)$/.exec(req.get('Authorization') || '');
  if (!m) return false;
  try {
    const t = await admin.auth().verifyIdToken(m[1]);
    return t.uid === DONO_UID && t.email === DONO_EMAIL;
  } catch (e) {
    return false;
  }
}

exports.reserva = onRequest(
  { region: REGIAO, cors: ['https://lafouch.com', 'https://www.lafouch.com', 'http://localhost:8765', 'http://localhost:8766'], maxInstances: 20 },
  async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, motivo: 'metodo' });
    const b = req.body && typeof req.body === 'object' ? req.body : {};
    const acao = String(b.acao || '');
    const db = admin.firestore();
    const agora = Date.now(); // a hora é sempre a do servidor
    try {
      if (DO_DONO.indexOf(acao) >= 0) {
        if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
      } else if (PUBLICAS.indexOf(acao) < 0) {
        return res.status(400).json({ ok: false, motivo: 'acao' });
      } else if (!(await Reserva.ligada(db))) {
        return res.json({ ok: true, off: true });
      }
      const refs = (Array.isArray(b.itens) ? b.itens : []).map((i) => i && i.ref).filter(Boolean);
      let r;
      if (acao === 'reservar') r = await Reserva.reservar(db, agora, b.pedido, b.itens, { pag: b.pag === 'alias' ? 'alias' : 'pix' });
      else if (acao === 'comp') r = await Reserva.comprovante(db, agora, b.pedido, b.itens);
      else if (acao === 'cancelar') r = await Reserva.liberar(db, agora, b.pedido, refs);
      else if (acao === 'pagar') r = await Reserva.pagar(db, agora, b.pedido, b.itens);
      else if (acao === 'liberar') r = await Reserva.liberar(db, agora, b.pedido, refs);
      else r = await Reserva.recusar(db, agora, b.pedido, refs);
      return res.json(Object.assign({ ok: true, agora }, r));
    } catch (e) {
      if (e instanceof Reserva.Falha) return res.json({ ok: false, motivo: e.motivo, falta: e.extra.falta || [], agora });
      console.error('reserva', acao, e);
      return res.status(500).json({ ok: false, motivo: 'erro' });
    }
  }
);

// ---------- Mídia do site (giro 360° e Destaque) direto no GitHub, sem chave no app ----------
// Segredos (o dono cadastra uma vez no computador, NUNCA no chat):
//   firebase functions:secrets:set GH_APP_ID    (número do App do GitHub)
//   firebase functions:secrets:set GH_APP_KEY   (conteúdo do arquivo .pem do App)
const { defineSecret } = require('firebase-functions/params');
const Midia = require('./midia');
const GH_APP_ID = defineSecret('GH_APP_ID');
const GH_APP_KEY = defineSecret('GH_APP_KEY');

exports.midia = onRequest(
  { region: REGIAO, cors: true, maxInstances: 5, memory: '512MiB', timeoutSeconds: 120, secrets: [GH_APP_ID, GH_APP_KEY] },
  async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, motivo: 'metodo' });
    if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
    const b = req.body && typeof req.body === 'object' ? req.body : {};
    try {
      const r = await Midia.executa(b, { appId: GH_APP_ID.value(), chave: GH_APP_KEY.value() }, fetch);
      return res.json(r);
    } catch (e) {
      if (e instanceof Midia.Falha) return res.status(e.status).json({ ok: false, motivo: e.motivo });
      console.error('midia', e);
      return res.status(500).json({ ok: false, motivo: 'erro' });
    }
  }
);

// ---------- Código de confirmação do e-mail (conta do site) ----------
// Segredo (o dono cadastra uma vez, NUNCA no chat): firebase functions:secrets:set RESEND_KEY
// Sem a chave a função responde "sem-config" e o site usa o link de confirmação do próprio Firebase.
const Codigo = require('./codigo');
const RESEND_KEY = defineSecret('RESEND_KEY');
const codDb = {
  get: async (uid) => { const d = await admin.firestore().doc('codigos/' + uid).get(); return d.exists ? d.data() : null; },
  set: (uid, o) => admin.firestore().doc('codigos/' + uid).set(o),
  del: (uid) => admin.firestore().doc('codigos/' + uid).delete(),
};
exports.codigo = onRequest(
  { region: REGIAO, cors: ['https://lafouch.com', 'https://www.lafouch.com', 'http://localhost:8765', 'http://localhost:8772'], maxInstances: 10, secrets: [RESEND_KEY] },
  async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, motivo: 'metodo' });
    const m = /^Bearer (.+)$/.exec(req.get('Authorization') || '');
    let tk;
    try { tk = await admin.auth().verifyIdToken(m ? m[1] : ''); } catch (e) { return res.status(401).json({ ok: false, motivo: 'login' }); }
    const b = req.body && typeof req.body === 'object' ? req.body : {};
    const user = await admin.auth().getUser(tk.uid);
    const u = { uid: tk.uid, email: user.email, nome: user.displayName || b.nome || '', verificado: !!user.emailVerified };
    let chave = '';
    try { chave = RESEND_KEY.value() || ''; } catch (e) {}
    const envia = chave ? async (msg) => {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST', headers: { Authorization: 'Bearer ' + chave, 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ from: 'La Fouch <nao-responda@lafouch.com>' }, msg)),
      });
      if (!r.ok) { console.error('resend', r.status, await r.text().catch(() => '')); throw new Codigo.Falha('envio', 502); }
    } : null;
    try {
      let r;
      if (b.acao === 'enviar') r = await Codigo.enviar(codDb, envia, u, Date.now(), b.lang);
      else if (b.acao === 'conferir') {
        r = await Codigo.conferir(codDb, u, b.codigo, Date.now());
        if (r.confirmado) await admin.auth().updateUser(u.uid, { emailVerified: true });
      } else return res.status(400).json({ ok: false, motivo: 'acao' });
      return res.json(r);
    } catch (e) {
      if (e instanceof Codigo.Falha) return res.status(e.status).json(Object.assign({ ok: false, motivo: e.motivo }, e.extra));
      console.error('codigo', e);
      return res.status(500).json({ ok: false, motivo: 'erro' });
    }
  }
);

// ---------- Avaliações das peças e novidades do site (v451) ----------
// avaliacao: GET ?ref=X (público: lista e média) · POST {acao:'posso'|'avaliar'} com login do cliente
//            · POST {acao:'recentes'|'ocultar'|'mostrar'} só o dono (painel do site).
// novidades: POST {acao:'inscrever', email} público · POST {acao:'lista'} só o dono.
const Loja = require('./loja');
const CORS_SITE = ['https://lafouch.com', 'https://www.lafouch.com', 'http://localhost:8765', 'http://localhost:8772'];
const lojaDb = {
  pedidosDoEmail: async (email) => {
    const q = await admin.firestore().collection('pedidos').where('email', '==', email).limit(50).get();
    return q.docs.map((d) => Object.assign({ id: d.id }, d.data()));
  },
  reservaPaga: async (id) => { const d = await admin.firestore().doc('reservas/' + id).get(); return d.exists && d.data().pago === true; },
  getAval: async (id) => { const d = await admin.firestore().doc('avaliacoes/' + id).get(); return d.exists ? d.data() : null; },
  setAval: (id, o) => admin.firestore().doc('avaliacoes/' + id).set(o),
  listaAval: async (ref) => (await admin.firestore().collection('avaliacoes').where('ref', '==', ref).limit(200).get()).docs.map((d) => d.data()),
  setInscricao: (id, o) => admin.firestore().doc('inscricoes/' + id).set(o, { merge: true }),
};
async function clienteDe(req) {
  const m = /^Bearer (.+)$/.exec(req.get('Authorization') || '');
  if (!m) return null;
  try {
    const t = await admin.auth().verifyIdToken(m[1]);
    const u = await admin.auth().getUser(t.uid);
    return { uid: t.uid, email: (u.email || '').toLowerCase(), nome: u.displayName || '', verificado: !!u.emailVerified || (u.providerData || []).some((p) => p.providerId === 'google.com') };
  } catch (e) {
    return null;
  }
}
exports.avaliacao = onRequest({ region: REGIAO, cors: CORS_SITE, maxInstances: 10 }, async (req, res) => {
  try {
    if (req.method === 'GET') {
      res.set('Cache-Control', 'public, max-age=120');
      return res.json(await Loja.lista(lojaDb, String(req.query.ref || '')));
    }
    if (req.method !== 'POST') return res.status(405).json({ ok: false, motivo: 'metodo' });
    const b = req.body && typeof req.body === 'object' ? req.body : {};
    if (b.acao === 'recentes' || b.acao === 'ocultar' || b.acao === 'mostrar') {
      if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
      if (b.acao === 'recentes') {
        const q = await admin.firestore().collection('avaliacoes').orderBy('ts', 'desc').limit(100).get();
        return res.json({ ok: true, itens: q.docs.map((d) => Object.assign({ id: d.id }, d.data())) });
      }
      await admin.firestore().doc('avaliacoes/' + String(b.id || '').replace(/[^A-Za-z0-9._-]/g, '')).update({ ok: b.acao === 'mostrar' });
      return res.json({ ok: true });
    }
    const u = await clienteDe(req);
    if (!u) return res.status(401).json({ ok: false, motivo: 'login' });
    if (b.acao === 'posso') return res.json(await Loja.posso(lojaDb, u, b.ref));
    if (b.acao === 'avaliar') return res.json(await Loja.avaliar(lojaDb, u, b, Date.now()));
    return res.status(400).json({ ok: false, motivo: 'acao' });
  } catch (e) {
    if (e instanceof Loja.Falha) return res.status(e.status).json({ ok: false, motivo: e.motivo });
    console.error('avaliacao', e);
    return res.status(500).json({ ok: false, motivo: 'erro' });
  }
});
exports.novidades = onRequest({ region: REGIAO, cors: CORS_SITE, maxInstances: 5 }, async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, motivo: 'metodo' });
  const b = req.body && typeof req.body === 'object' ? req.body : {};
  try {
    if (b.acao === 'lista') {
      if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
      const q = await admin.firestore().collection('inscricoes').orderBy('ts', 'desc').limit(1000).get();
      return res.json({ ok: true, itens: q.docs.map((d) => d.data()) });
    }
    if (b.acao === 'inscrever') return res.json(await Loja.inscrever(lojaDb, b, Date.now()));
    return res.status(400).json({ ok: false, motivo: 'acao' });
  } catch (e) {
    if (e instanceof Loja.Falha) return res.status(e.status).json({ ok: false, motivo: e.motivo });
    console.error('novidades', e);
    return res.status(500).json({ ok: false, motivo: 'erro' });
  }
});

// ---------- Mensagens do site (11/11/2026): "Entre em contato" (e-mail para lafouch.eyewear@gmail.com) e cópia dos pedidos de Atacado ----------
// POST {acao:'enviar', tipo:'contato'|'atacado', ...} público · POST {acao:'lista'} e {acao:'estado', id, est} só o dono (painel › Mensagens).
const Mensagem = require('./mensagem');
const msgDb = {
  salva: (id, o) => admin.firestore().doc('mensagens/' + id).set(o),
  lista: async (n) => (await admin.firestore().collection('mensagens').orderBy('ts', 'desc').limit(n).get()).docs.map((d) => Object.assign({ id: d.id }, d.data())),
  muda: (id, c) => admin.firestore().doc('mensagens/' + id).update(c),
  // só igualdade (não precisa de índice composto no Firestore); o filtro de hora é feito aqui
  contaRecentes: async (k, desde) => (await admin.firestore().collection('mensagens').where('ipk', '==', k).get()).docs.filter((d) => (d.get('ts') || 0) >= desde).length,
};
exports.mensagem = onRequest({ region: REGIAO, cors: CORS_SITE, maxInstances: 5, secrets: [RESEND_KEY] }, async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, motivo: 'metodo' });
  const b = req.body && typeof req.body === 'object' ? req.body : {};
  try {
    if (b.acao === 'lista' || b.acao === 'estado') {
      if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
      return res.json(b.acao === 'lista' ? await Mensagem.lista(msgDb, b.n) : await Mensagem.estado(msgDb, b.id, b.est));
    }
    if (b.acao !== 'enviar') return res.status(400).json({ ok: false, motivo: 'acao' });
    let chave = '';
    try { chave = RESEND_KEY.value() || ''; } catch (e) {}
    const envia = chave ? async (m) => {
      const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + chave, 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ from: 'La Fouch <nao-responda@lafouch.com>' }, m)) });
      if (!r.ok) { console.error('resend', r.status, await r.text().catch(() => '')); throw new Mensagem.Falha('envio', 502); }
    } : null;
    return res.json(await Mensagem.enviar(msgDb, envia, b, req.ip || req.get('x-forwarded-for') || '', Date.now()));
  } catch (e) {
    if (e instanceof Mensagem.Falha) return res.status(e.status).json({ ok: false, motivo: e.motivo });
    console.error('mensagem', e);
    return res.status(500).json({ ok: false, motivo: 'erro' });
  }
});

// ---------- Analisador (11/11/2026): contagens anônimas por visita; o painel lê os totais ----------
const Analise = require('./analise');
const anDb = {
  salva: (id, o) => admin.firestore().doc('analise/' + id).set(o),
  desde: async (ts) => (await admin.firestore().collection('analise').where('ts', '>=', ts).limit(20000).get()).docs.map((d) => d.data()),
};
exports.analise = onRequest({ region: REGIAO, cors: CORS_SITE, maxInstances: 10 }, async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, motivo: 'metodo' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b && typeof b === 'object' ? b : {};
  try {
    if (b.acao === 'resumo') {
      if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
      return res.json(await Analise.resumo(anDb, b.dias, Date.now()));
    }
    return res.json(await Analise.registra(anDb, b, Date.now()));
  } catch (e) {
    if (e instanceof Analise.Falha) return res.status(e.status).json({ ok: false, motivo: e.motivo });
    console.error('analise', e);
    return res.status(500).json({ ok: false, motivo: 'erro' });
  }
});

// ---------- "Avisarme cuando vuelva" (11/11/2026, S173-3A): e-mail na peça esgotada; 1 e-mail quando o app tira o "Esgotado" ----------
const { onDocumentUpdated } = require('firebase-functions/v2/firestore');
const Volta = require('./volta');
const voltaDb = {
  salva: (id, o) => admin.firestore().doc('voltas/' + id).set(o),
  get: async (id) => { const d = await admin.firestore().doc('voltas/' + id).get(); return d.exists ? d.data() : null; },
  // só igualdade (sem índice composto); o filtro "não enviado" é feito aqui
  pendentes: async (ref) => (await admin.firestore().collection('voltas').where('ref', '==', ref).get()).docs.map((d) => Object.assign({ id: d.id }, d.data())).filter((o) => !o.env),
  muda: (id, c) => admin.firestore().doc('voltas/' + id).update(c),
  contaEmail: async (e) => (await admin.firestore().collection('voltas').where('email', '==', e).get()).docs.filter((d) => !d.get('env')).length,
  inscreve: (email, lang) => Loja.inscrever(lojaDb, { email, lang }, Date.now()),
};
exports.volta = onRequest({ region: REGIAO, cors: CORS_SITE, maxInstances: 5 }, async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, motivo: 'metodo' });
  const b = req.body && typeof req.body === 'object' ? req.body : {};
  try {
    if (b.acao !== 'pedir') return res.status(400).json({ ok: false, motivo: 'acao' });
    return res.json(await Volta.pedir(voltaDb, b, Date.now()));
  } catch (e) {
    if (e instanceof Volta.Falha) return res.status(e.status).json({ ok: false, motivo: e.motivo });
    console.error('volta', e);
    return res.status(500).json({ ok: false, motivo: 'erro' });
  }
});
exports.voltaAvisa = onDocumentUpdated({ document: 'produtos/{ref}', region: REGIAO, secrets: [RESEND_KEY] }, async (ev) => {
  const antes = ev.data.before.data(), depois = ev.data.after.data();
  if (!Volta.voltou(antes, depois)) return;
  let chave = '';
  try { chave = RESEND_KEY.value() || ''; } catch (e) {}
  if (!chave) return console.error('voltaAvisa: sem RESEND_KEY');
  const envia = async (m) => {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + chave, 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ from: 'La Fouch <nao-responda@lafouch.com>' }, m)) });
    if (!r.ok) throw new Error('resend ' + r.status);
  };
  const n = await Volta.dispara(voltaDb, envia, ev.params.ref, depois.nome, Date.now());
  console.log('voltaAvisa', ev.params.ref, n);
});

// ---------- Aviso de login (12/11/2026, bloco 5 item 5): e-mail para lafouch.eyewear@gmail.com a cada entrada com senha ----------
const Login = require('./login');
const loginDb = {
  get: async (id) => { const d = await admin.firestore().doc('logins/' + id).get(); return d.exists ? d.data() : null; },
  salva: (id, o) => admin.firestore().doc('logins/' + id).set(o),
  conta: async (desde) => (await admin.firestore().collection('logins').where('ts', '>=', desde).get()).docs.filter((d) => d.id.startsWith('_l')).length,
};
exports.login = onRequest({ region: REGIAO, cors: true, maxInstances: 3, secrets: [RESEND_KEY] }, async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, motivo: 'metodo' });
  const b = req.body && typeof req.body === 'object' ? req.body : {};
  try {
    if (b.acao !== 'aviso') return res.status(400).json({ ok: false, motivo: 'acao' });
    if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
    let chave = '';
    try { chave = RESEND_KEY.value() || ''; } catch (e) {}
    const envia = async (m) => {
      if (!chave) throw new Error('sem RESEND_KEY');
      const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + chave, 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ from: 'La Fouch <nao-responda@lafouch.com>' }, m)) });
      if (!r.ok) throw new Error('resend ' + r.status);
    };
    return res.json(await Login.avisa(loginDb, envia, b, req.get('user-agent') || '', req.ip || req.get('x-forwarded-for') || '', Date.now()));
  } catch (e) {
    if (e instanceof Login.Falha) return res.status(e.status).json({ ok: false, motivo: e.motivo });
    console.error('login', e);
    return res.status(500).json({ ok: false, motivo: 'erro' });
  }
});

// ---------- Retenção de 12 meses (12/11/2026, bloco 5 item 8): roda sozinha todo dia às 4h do Paraguai ----------
const { onSchedule } = require('firebase-functions/v2/scheduler');
const Limpeza = require('./limpeza');
const limpaDb = {
  // só igualdade/um filtro (sem índice composto); máximo 500 por dia
  velhos: async (col, antes) => (await admin.firestore().collection(col).where('ts', '<', antes).limit(500).get()).docs.map((d) => Object.assign({ id: d.id }, d.data())),
  muda: (col, id, c) => admin.firestore().doc(col + '/' + id).update(c),
  apaga: (col, id) => admin.firestore().doc(col + '/' + id).delete(),
};
exports.limpeza = onSchedule({ schedule: '0 4 * * *', timeZone: FUSO, region: REGIAO }, async () => {
  const r = await Limpeza.limpa(limpaDb, Date.now());
  console.log('limpeza', JSON.stringify(r));
});

// ---------- Cupons e cartões virtuais (12/11/2026, S174 v1+v2+v3) ----------
const Cupom = require('./cupom');
const crypto = require('crypto');
const fsx = () => admin.firestore();
const cupDb = {
  get: async (k) => { if (!/^[A-Z0-9-]{4,24}$/.test(k)) return null; const d = await fsx().doc('cupons/' + k).get(); return d.exists ? d.data() : null; },
  salva: (k, o) => fsx().doc('cupons/' + k).set(o),
  muda: (k, c) => fsx().doc('cupons/' + k).update(c),
  getMes: async (k) => { const d = await fsx().doc('cupomMes/' + k).get(); return d.exists ? d.data() : null; },
  somaMes: (k, v) => fsx().doc('cupomMes/' + k).set({ desc: admin.firestore.FieldValue.increment(v) }, { merge: true }),
  getTent: async (k) => { const d = await fsx().doc('cupomTent/' + k).get(); return d.exists ? d.data() : null; },
  salvaTent: (k, o) => fsx().doc('cupomTent/' + k).set(o),
  aviso: (o) => fsx().collection('cupomAvisos').add(o),
  avisos: async (n) => (await fsx().collection('cupomAvisos').orderBy('ts', 'desc').limit(n).get()).docs.map((d) => Object.assign({ id: d.id }, d.data())),
  // "já comprou": pedido do site com esse e-mail, ou comprador marcado quando o app confirmou um pagamento
  jaComprou: async (tel, em) => {
    if (tel && (await fsx().doc('compradores/t' + tel).get()).exists) return true;
    if (em && (await fsx().doc('compradores/e' + crypto.createHash('sha256').update(em).digest('hex').slice(0, 32)).get()).exists) return true;
    if (em && !(await fsx().collection('pedidos').where('email', '==', em).limit(1).get()).empty) return true;
    return false;
  },
  comprou: async (tel, em) => {
    if (tel) await fsx().doc('compradores/t' + tel).set({ ts: Date.now() });
    if (em) await fsx().doc('compradores/e' + crypto.createHash('sha256').update(em).digest('hex').slice(0, 32)).set({ ts: Date.now() });
  },
  bvDe: async (em, tel) => {
    if (em && !(await fsx().collection('cupons').where('tipo', '==', 'bv').where('email', '==', em).limit(1).get()).empty) return true;
    if (tel && !(await fsx().collection('cupons').where('tipo', '==', 'bv').where('tel', '==', tel).limit(1).get()).empty) return true;
    return false;
  },
  porPid: async (pid, tipo) => { const q = await fsx().collection('cupons').where('pid', '==', pid).where('tipo', '==', tipo).limit(1).get(); return q.empty ? null : q.docs[0].data(); },
  comUsoDe: async (pid) => (await fsx().collection('cupons').where('pids', 'array-contains', pid).get()).docs.map((d) => d.data()),
  todos: async () => (await fsx().collection('cupons').orderBy('ts', 'desc').limit(500).get()).docs.map((d) => d.data()),
  doEmail: async (em) => (await fsx().collection('cupons').where('email', '==', em).get()).docs.map((d) => d.data()),
};
exports.cupom = onRequest({ region: REGIAO, cors: true, maxInstances: 10, secrets: [RESEND_KEY] }, async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, motivo: 'metodo' });
  const b = req.body && typeof req.body === 'object' ? req.body : {};
  const ipk = crypto.createHash('sha256').update(String(req.ip || req.get('x-forwarded-for') || '')).digest('hex').slice(0, 24);
  let chave = '';
  try { chave = RESEND_KEY.value() || ''; } catch (e) {}
  const envia = chave ? async (m) => {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + chave, 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ from: 'La Fouch <nao-responda@lafouch.com>' }, m)) });
    if (!r.ok) throw new Error('resend ' + r.status);
  } : null;
  const agora = Date.now();
  try {
    // público (site)
    if (b.acao === 'ver') return res.json(await Cupom.ver(cupDb, b, ipk, agora));
    if (b.acao === 'usar') return res.json(await Cupom.usar(cupDb, b, ipk, agora, false));
    if (b.acao === 'bv') return res.json(await Cupom.boasVindas(cupDb, envia, b, agora));
    if (b.acao === 'proxima') return res.json(await Cupom.proxima(cupDb, b, agora));
    if (b.acao === 'meus') {
      const m = /^Bearer (.+)$/.exec(req.get('Authorization') || '');
      if (!m) return res.status(401).json({ ok: false, motivo: 'login' });
      let t = null;
      try { t = await admin.auth().verifyIdToken(m[1]); } catch (e) { return res.status(401).json({ ok: false, motivo: 'login' }); }
      return res.json(await Cupom.meus(cupDb, t.email, agora));
    }
    // só o dono (app)
    if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
    if (b.acao === 'caixa') return res.json(await Cupom.usar(cupDb, b, ipk, agora, true));
    if (b.acao === 'confirma') return res.json(await Cupom.confirma(cupDb, envia, b, agora));
    if (b.acao === 'libera') return res.json(await Cupom.libera(cupDb, b, agora));
    if (b.acao === 'emitir') return res.json(await Cupom.emitir(cupDb, b, agora));
    if (b.acao === 'cancelar') return res.json(await Cupom.cancelar(cupDb, b));
    if (b.acao === 'destrava') return res.json(await Cupom.destrava(cupDb, b));
    if (b.acao === 'lista') return res.json(await Cupom.lista(cupDb, agora));
    return res.status(400).json({ ok: false, motivo: 'acao' });
  } catch (e) {
    if (e instanceof Cupom.Falha) return res.status(e.status).json({ ok: false, motivo: e.motivo });
    console.error('cupom', e);
    return res.status(500).json({ ok: false, motivo: 'erro' });
  }
});
