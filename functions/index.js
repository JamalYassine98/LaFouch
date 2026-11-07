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
