// Avisos do site para o app da loja (celular).
// Dispara quando o site cria um documento em "pedidos": pedido novo, comprovante, cancelamento.
// Cada aparelho cadastrado (coleção "dispositivos") tem as suas opções: n/c/x/p (tipos de aviso),
// som, e silêncio por horário (q, qi, qf) — definidas em Ajustes > Avisos de pedidos no app.
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onRequest } = require('firebase-functions/v2/https');
const Reserva = require('./reserva');
const Token = require('./token');
const Conta = require('./conta');
const Cupom = require('./cupom');
const Email = require('./email');
const admin = require('firebase-admin');

admin.initializeApp();
const crypto = require('crypto');
const { Falha } = require('./falha');
const fsx = () => admin.firestore();

// A região da função precisa ser a MESMA do banco Firestore (Firebase > Firestore > Dados > Local).
const REGIAO = 'southamerica-east1';
const FUSO = 'America/Asuncion';

// ---------- Peças comuns das portas (20/11/2026, regra 12: cada uma num lugar só; antes estavam copiadas porta a porta) ----------
// endereços que podem chamar as portas do site: o site e as cópias de teste no computador
const CORS_SITE = ['https://lafouch.com', 'https://www.lafouch.com', 'http://localhost:8765', 'http://localhost:8766', 'http://localhost:8772'];
const urlFn = (nome) => 'https://' + REGIAO + '-' + process.env.GCLOUD_PROJECT + '.cloudfunctions.net/' + nome;
const hash = (t, n) => crypto.createHash('sha256').update(String(t)).digest('hex').slice(0, n);
const telDe = Cupom.telN; // os 9 últimos números do telefone (a regra mora no cupom.js)
// corpo do pedido: JSON já lido, ou texto (o sendBeacon do site manda texto) → objeto; qualquer outra coisa → {}
function corpo(req) {
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  return b && typeof b === 'object' ? b : {};
}
// login de quem chama (Authorization: Bearer <token do Firebase>) → o token conferido, ou null
async function tokenDe(req) {
  const m = /^Bearer (.+)$/.exec(req.get('Authorization') || '');
  if (!m) return null;
  try { return await admin.auth().verifyIdToken(m[1]); } catch (e) { return null; }
}
// erro esperado (Falha) → o código e o motivo dele; outro erro → 500, igual em todas as portas
function falhou(res, nome, e) {
  if (e instanceof Falha) return res.status(e.status).json(Object.assign({ ok: false, motivo: e.motivo }, e.extra));
  console.error(nome, e);
  return res.status(500).json({ ok: false, motivo: 'erro' });
}
// porta POST: recusa outro método, lê o corpo e trata o erro sempre do mesmo jeito
const post = (nome, opcoes, fn) => onRequest(Object.assign({ region: REGIAO }, opcoes), async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, motivo: 'metodo' });
  try { return await fn(req, res, corpo(req)); } catch (e) { return falhou(res, nome, e); }
});
// Cliente VIP (status para sempre, compradores/t<tel>.vip)
async function ehVip(tel) {
  if (tel.length < 6) return false;
  const d = await fsx().doc('compradores/t' + tel).get();
  return !!(d.exists && +d.data().vip > 0);
}
// S6 (20/11/2026): Cliente VIP é a PESSOA logada (e-mail conferido pelo login), nunca um telefone digitado no site.
// O telefone dela vem do par e-mail ↔ telefone de um pagamento confirmado (compradores/e<resumo do e-mail>.tel).
async function vipDe(req) {
  const t = await tokenDe(req);
  if (!t || !t.email || t.email_verified !== true) return { vip: false, tel: '' };
  const e = await fsx().doc(compradorEm(String(t.email).toLowerCase())).get();
  const tel = telDe((e.exists && e.data().tel) || '');
  return { vip: await ehVip(tel), tel };
}
// todas as peças do catálogo e os pisos (o piso fica só no servidor) — para o presente especial
async function catalogoPisos() {
  const [ps, pz] = await Promise.all([fsx().collection('produtos').get(), fsx().collection('pisos').get()]);
  const prods = {}, pisos = {};
  ps.docs.forEach((d) => { prods[d.id] = Object.assign({ ref: d.id }, d.data()); });
  pz.docs.forEach((d) => { pisos[d.id] = +d.data().p || 0; });
  return { prods, pisos };
}
// aviso no celular: um envio por aparelho cadastrado (o som/canal muda de aparelho para aparelho);
// aparelho que não existe mais (app desinstalado) sai da lista. filtra(id, dados) escolhe; msg(dados) monta o aviso.
const somDe = (dd, campo) => dd[campo] || dd.som || 'sino'; // aparelhos antigos só têm "som", que vale para todos
async function avisaAparelhos(filtra, msg) {
  const lista = await fsx().collection('dispositivos').get(), mortos = [];
  await Promise.all(lista.docs.filter((d) => filtra(d.id, d.data() || {})).map(async (d) => {
    try { await admin.messaging().send(Object.assign({ token: d.id }, msg(d.data() || {}))); } catch (e) {
      const c = e && e.code;
      if (c === 'messaging/registration-token-not-registered' || c === 'messaging/invalid-registration-token') mortos.push(d.id);
    }
  }));
  await Promise.all(mortos.map((tk) => fsx().collection('dispositivos').doc(tk).delete()));
}
// cria o documento só se ainda não existe (atômico): true = criou, false = já existia
const criaUmaVez = (ref, o) => ref.create(o).then(() => true, (e) => { if (e && (e.code === 6 || /already exists/i.test(e.message || ''))) return false; throw e; });

// S1/S2 (19/11): leitura/gravação simples para as regras puras de token.js e conta.js
const tokDb = {
  get: async (p) => { const d = await fsx().doc(p).get(); return d.exists ? d.data() : null; },
  set: (p, dados) => fsx().doc(p).set(dados, { merge: true }),
};
// Limites por rede (22/11, rede.js): a mesma rede = IPv4 inteiro, IPv6 pelo bloco /64. redeDe = a chave; ipkDe = o resumo guardado.
const Rede = require('./rede');
const redeDe = (req) => Rede.chave(req.ip || req.get('x-forwarded-for') || '') || '?';
const ipkDe = (req) => hash(redeDe(req), 24);
// App Check (20/11): toda porta pública chama seloOk no começo. O modo (anotar/exigir) fica num lugar só: selo.js.
// Contagem por dia em seloDia/<AAAA-MM-DD> (só o dono lê) para ver quem chega sem selo antes de exigir.
const Selo = require('./selo');
async function seloOk(req, res, porta) {
  const r = await Selo.confere(req, porta, Date.now(), (t) => admin.appCheck().verifyToken(t),
    (d, campo) => fsx().doc('seloDia/' + d).set({ [campo]: admin.firestore.FieldValue.increment(1) }, { merge: true }), CORS_SITE);
  if (!r.passa) res.status(401).json({ ok: false, motivo: 'selo' });
  return r.passa;
}

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
  const campoSom = { novo: 'sn', comp: 'sc', cancel: 'sx', pago: 'sp', teste: 'sn' }[t.tipo]; // som escolhido para este tipo de aviso
  await avisaAparelhos((id, dd) => quer(dd, t.tipo), (dd) => ({
    notification: { title: t.titulo, body: t.corpo },
    data: { tipo: t.tipo, id: String(ev.params.id) },
    // tag única por aviso: o Android não junta nem esconde avisos parecidos (o 2º teste sumia da bandeja)
    android: { priority: 'high', notification: { channelId: 'pedidos_' + somDe(dd, campoSom), tag: String(ev.params.id), defaultVibrateTimings: true } },
  }));
});

// S181 (13/11): modo loja — o cliente toca "Chamar um vendedor" no tablet; o app grava lojaChama/{id} e o celular do vendedor apita
exports.avisarChama = onDocumentCreated({ document: 'lojaChama/{id}', region: REGIAO }, async (ev) => {
  const f = (ev.data && ev.data.data()) || {};
  const n = Math.max(0, Math.min(99, +f.n || 0));
  await avisaAparelhos((id, dd) => id !== f.de && !quieto(dd), (dd) => ({
    notification: { title: '🛎️ Cliente chamando na loja', body: n ? n + (n === 1 ? ' peça no Meu pedido · já estão no carrinho do app' : ' peças no Meu pedido · já estão no carrinho do app') : 'Um cliente pediu ajuda no tablet' },
    data: { tipo: 'chama', id: String(ev.params.id) },
    android: { priority: 'high', notification: { channelId: 'pedidos_' + somDe(dd, 'sn'), tag: 'chama-' + ev.params.id, defaultVibrateTimings: true } },
  }));
});

// ---------- Reserva de estoque (site e app) ----------
// Só funciona se config/site tiver reserva = true (interruptor do dono). Desligada, responde {ok:true, off:true}
// e o site segue vendendo como antes.
// o projeto de teste (lafouch-teste) tem outro usuário dono
const DONO_UID = process.env.GCLOUD_PROJECT === 'lafouch-teste' ? 'uvYpqxPJZjTsSE9SACouW0nZH4d2' : 'jJzNDoMHtuRNOAF1GhJfNYDMlE63';
const DONO_EMAIL = 'jamalaliyassine@gmail.com';
const PUBLICAS = ['reservar', 'comp', 'cancelar'];
// 22/11 (aprovado 15:20): reserva que parece abuso fica marcada em suspeitas/<pedido> para o TITAN avisar o dono (suspeita.js)
const Suspeita = require('./suspeita');
const susDb = {
  anota: (redeId, pid, refs, agora) => fsx().runTransaction(async (tx) => {
    const ref = fsx().doc('redeRes/' + redeId), d = await tx.get(ref), p = Object.assign({}, (d.exists && d.data().p) || {});
    for (const k of Object.keys(p)) if (agora - (+p[k].ts || 0) > Suspeita.HORA) delete p[k];
    p[pid] = p[pid] || { ts: agora, refs: refs.slice(0, 30) };
    tx.set(ref, { ts: agora, p });
    return Object.keys(p).map((k) => ({ pid: k, refs: p[k].refs || [] }));
  }),
  aberta: async (x) => {
    const r = await fsx().doc('reservas/' + x.pid).get(), o = (r.exists && r.data()) || {};
    if (o.pago === true || o.cancelado) return false;
    return Reserva.aberta(fsx(), Date.now(), x.pid, x.refs);
  },
  grava: (pid, o) => fsx().doc('suspeitas/' + pid).set(o, { merge: true }),
};
const DO_DONO = ['pagar', 'liberar', 'recusar', 'orfas', 'liberarH', 'ligar']; // P1b: orfas e liberarH só o dono · 39: ligar (PIX sem par → pedido)

async function ehDono(req) {
  const t = await tokenDe(req);
  return !!t && t.uid === DONO_UID && t.email === DONO_EMAIL;
}

// a reserva responde os erros esperados com 200 + motivo (o site lê o motivo e a lista do que faltou), por isso tem o seu próprio tratamento
exports.reserva = onRequest(
  { region: REGIAO, cors: CORS_SITE, maxInstances: 20 },
  async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, motivo: 'metodo' });
    const b = corpo(req);
    const acao = String(b.acao || '');
    const db = fsx();
    const agora = Date.now(); // a hora é sempre a do servidor
    try {
      if (DO_DONO.indexOf(acao) < 0 && !(await seloOk(req, res, 'reserva'))) return;
      // S1 (19/11): a cliente pede o token de entrega mostrando o telefone do pedido (o token não fica mais na página pública)
      if (acao === 'token') {
        const r = await Token.pedir(tokDb, agora, String(b.pedido || ''), String(b.tel || ''));
        return res.json(Object.assign({ agora }, r));
      }
      if (DO_DONO.indexOf(acao) >= 0) {
        if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
      } else if (PUBLICAS.indexOf(acao) < 0) {
        return res.status(400).json({ ok: false, motivo: 'acao' });
      } else if (!(await Reserva.ligada(db))) {
        return res.json({ ok: true, off: true });
      }
      // P1 (19/11): a lista pode vir em "itens" ([{ref}]) ou em "refs" (["REF"]) — o site e o app mandam "refs" ao cancelar/liberar
      const refs = (Array.isArray(b.itens) && b.itens.length ? b.itens.map((i) => i && i.ref) : Array.isArray(b.refs) ? b.refs : []).filter(Boolean).map(String);
      let r;
      if (acao === 'reservar') {
        // 22/11: no máximo LIMITE.reserva reservas novas por rede por hora. Passou: o site segue o pedido sem segurar a peça.
        if ((await pedDb.conta('reserva_r' + ipkDe(req), agora)) > Rede.LIMITE.reserva) throw new Falha('espera', 429);
        // S409 (70c): Cliente VIP tem 3 horas para pagar, UMA reserva longa por vez (as outras ficam com os 30 minutos de sempre)
        let ate = 0;
        try {
          const pid = String(b.pedido || '');
          if (/^[A-Za-z0-9_-]{4,40}$/.test(pid)) {
            const { vip, tel } = await vipDe(req); // S6: a VIP logada, não o telefone digitado
            if (vip) {
              ate = await db.runTransaction(async (tx) => {
                const ref = db.doc('vipRes/t' + tel), v = await tx.get(ref), o = v.exists ? v.data() : {};
                if (o.pid && o.pid !== pid && +o.exp > agora) return 0; // já tem outra reserva longa aberta
                const exp = o.pid === pid && +o.exp > agora ? +o.exp : agora + 3 * 3600000;
                tx.set(ref, { pid, exp });
                return exp;
              });
            }
          }
        } catch (e) { console.error('reserva vip', e && e.message); ate = 0; }
        r = await Reserva.reservar(db, agora, b.pedido, b.itens, Object.assign({ pag: b.pag === 'alias' ? 'alias' : 'pix' }, ate ? { ate } : {}));
        if (ate) r.vip = true;
        if (r && r.ok) await Suspeita.confere(susDb, String(b.pedido || ''), b.itens, ipkDe(req), agora, r.exp).catch((e) => console.error('suspeita', e && e.message));
      }
      else if (acao === 'comp') r = await Reserva.comprovante(db, agora, b.pedido, b.itens);
      // P1: a cliente só solta o que não foi pago nem tem comprovante (pago/comprovante: só o dono pelo app)
      else if (acao === 'cancelar') r = await Reserva.cancelar(db, agora, b.pedido, refs);
      else if (acao === 'pagar') r = await Reserva.pagar(db, agora, b.pedido, b.itens);
      // P1b (19/11): reservas pagas que o app não conhece (pedido apagado) e soltar pelo código h
      else if (acao === 'orfas') {
        const todos = (await db.collection('estoque').listDocuments()).map((d) => d.id);
        r = await Reserva.orfas(db, todos, Array.isArray(b.conhecidos) ? b.conhecidos.slice(0, 5000) : []);
      } else if (acao === 'liberarH') r = await Reserva.liberarH(db, agora, String(b.h || ''), refs);
      else if (acao === 'ligar') r = await ligaPix(String(b.pix || ''), String(b.pedido || ''));
      else if (acao === 'liberar') {
        r = await Reserva.liberar(db, agora, b.pedido, refs);
        // S400 (17/11/2026): o app chama "liberar" quando o dono marca o pedido ENTREGUE (e também ao cancelar/apagar, mas aí a reserva
        // já está marcada como cancelada). Pedido pago e não cancelado = entrega → nasce entregas/{pedido}, que dispara o presente por e-mail.
        try {
          const pid = String(b.pedido || '');
          if (/^[A-Za-z0-9_-]{4,40}$/.test(pid)) {
            const rs = await db.doc('reservas/' + pid).get(), o = rs.exists ? rs.data() : {};
            if (o.pago === true && !o.cancelado) {
              await db.doc('entregas/' + pid).create({ ts: agora }).catch(() => {});
              // o site lê reservas/{pedido}: com "entregue" ele mostra "Entregue" e "Avaliar a compra ›" em Minha conta › Pedidos (esboço 59g)
              if (!o.entregue) await db.doc('reservas/' + pid).set({ entregue: true, entTs: agora }, { merge: true });
            }
          }
        } catch (e) { console.error('reserva entrega', e && e.message); }
      } else r = await Reserva.recusar(db, agora, b.pedido, refs);
      return res.json(Object.assign({ ok: true, agora }, r));
    } catch (e) {
      if (e instanceof Falha) return res.json({ ok: false, motivo: e.motivo, falta: e.extra.falta || [], agora });
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

exports.midia = post('midia', { cors: true, maxInstances: 5, memory: '512MiB', timeoutSeconds: 120, secrets: [GH_APP_ID, GH_APP_KEY] }, async (req, res, b) => {
  if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
  return res.json(await Midia.executa(b, { appId: GH_APP_ID.value(), chave: GH_APP_KEY.value() }, fetch));
});

// ---------- Código de confirmação do e-mail (conta do site) ----------
// Segredo (o dono cadastra uma vez, NUNCA no chat): firebase functions:secrets:set RESEND_KEY
// Sem a chave a função responde "sem-config" e o site usa o link de confirmação do próprio Firebase.
const Codigo = require('./codigo');
const RESEND_KEY = defineSecret('RESEND_KEY');
// E-mail num lugar só (20/11, regra 12: antes havia 8 cópias deste envio). Devolve a função que manda, ou null sem a chave.
// op.semChave = 'erro' → em vez de null, devolve uma função que falha (quem precisa avisar que não mandou)
// op.responder = true → as respostas da cliente vão para o e-mail da loja · op.falha() → o erro que a porta devolve quando o Resend recusa
const EMAIL_DE = 'La Fouch <nao-responda@lafouch.com>', EMAIL_RESPONDER = 'lafouch.eyewear@gmail.com';
function emailResend(op) {
  const o = op || {};
  let chave = '';
  try { chave = RESEND_KEY.value() || ''; } catch (e) {}
  if (!chave) return o.semChave === 'erro' ? async () => { throw new Error('sem RESEND_KEY'); } : null;
  return async (m) => {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + chave, 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ from: EMAIL_DE }, o.responder ? { reply_to: EMAIL_RESPONDER } : {}, m)) });
    if (!r.ok) {
      console.error('resend', r.status, String(await r.text().catch(() => '')).slice(0, 300));
      throw o.falha ? o.falha() : new Error('resend ' + r.status);
    }
  };
}
const codDb = {
  get: async (uid) => { const d = await fsx().doc('codigos/' + uid).get(); return d.exists ? d.data() : null; },
  set: (uid, o) => fsx().doc('codigos/' + uid).set(o),
  del: (uid) => fsx().doc('codigos/' + uid).delete(),
};
exports.codigo = post('codigo', { cors: CORS_SITE, maxInstances: 10, secrets: [RESEND_KEY] }, async (req, res, b) => {
  const tk = await tokenDe(req);
  if (!tk) return res.status(401).json({ ok: false, motivo: 'login' });
  const user = await admin.auth().getUser(tk.uid);
  const u = { uid: tk.uid, email: user.email, nome: user.displayName || b.nome || '', verificado: !!user.emailVerified };
  if (!(await seloOk(req, res, 'codigo'))) return;
  if (b.acao === 'enviar') return res.json(await Codigo.enviar(codDb, emailResend({ falha: () => new Falha('envio', 502) }), u, Date.now(), b.lang));
  if (b.acao !== 'conferir') return res.status(400).json({ ok: false, motivo: 'acao' });
  const r = await Codigo.conferir(codDb, u, b.codigo, Date.now());
  if (r.confirmado) await admin.auth().updateUser(u.uid, { emailVerified: true });
  return res.json(r);
});

// ---------- Avaliações das peças e novidades do site (v451) ----------
// avaliacao: GET ?ref=X (público: lista e média) · POST {acao:'posso'|'avaliar'} com login do cliente
//            · POST {acao:'recentes'|'ocultar'|'mostrar'} só o dono (painel do site).
// novidades: POST {acao:'inscrever', email} público (manda o "Confirme", S5) · GET ?confirmar= (link do e-mail) · POST {acao:'lista'|'tema'} só o dono.
const Loja = require('./loja');
const Inscricao = require('./inscricao');
const { EMAIL_OK } = require('./texto');
const insDb = {
  get: async (id) => { const d = await fsx().doc('inscricoes/' + id).get(); return d.exists ? d.data() : null; },
  set: (id, o) => fsx().doc('inscricoes/' + id).set(o, { merge: true }),
  // só igualdade (sem índice composto); o filtro de hora é feito aqui
  recentes: async (k, desde) => (await fsx().collection('inscricoes').where('ipk', '==', k).get()).docs.filter((d) => (+d.get('envTs') || 0) >= desde).length,
};
const lojaDb = {
  pedidosDoEmail: async (email) => {
    const q = await fsx().collection('pedidos').where('email', '==', email).limit(50).get();
    return q.docs.map((d) => Object.assign({ id: d.id }, d.data()));
  },
  reservaPaga: async (id) => { const d = await fsx().doc('reservas/' + id).get(); return d.exists && d.data().pago === true; },
  getAval: async (id) => { const d = await fsx().doc('avaliacoes/' + id).get(); return d.exists ? d.data() : null; },
  setAval: (id, o) => fsx().doc('avaliacoes/' + id).set(o),
  listaAval: async (ref) => (await fsx().collection('avaliacoes').where('ref', '==', ref).limit(200).get()).docs.map((d) => d.data()),
};
async function clienteDe(req) {
  const t = await tokenDe(req);
  if (!t) return null;
  try {
    const u = await admin.auth().getUser(t.uid);
    return { uid: t.uid, email: (u.email || '').toLowerCase(), nome: u.displayName || '', verificado: !!u.emailVerified || (u.providerData || []).some((p) => p.providerId === 'google.com') };
  } catch (e) {
    return null;
  }
}
// avaliação também lê com GET (lista pública), por isso não usa post()
exports.avaliacao = onRequest({ region: REGIAO, cors: CORS_SITE, maxInstances: 10 }, async (req, res) => {
  try {
    if (req.method === 'GET') {
      res.set('Cache-Control', 'public, max-age=120');
      return res.json(await Loja.lista(lojaDb, String(req.query.ref || '')));
    }
    if (req.method !== 'POST') return res.status(405).json({ ok: false, motivo: 'metodo' });
    const b = corpo(req);
    if (b.acao === 'recentes' || b.acao === 'ocultar' || b.acao === 'mostrar') {
      if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
      if (b.acao === 'recentes') {
        const q = await fsx().collection('avaliacoes').orderBy('ts', 'desc').limit(100).get();
        return res.json({ ok: true, itens: q.docs.map((d) => Object.assign({ id: d.id }, d.data())) });
      }
      await fsx().doc('avaliacoes/' + String(b.id || '').replace(/[^A-Za-z0-9._-]/g, '')).update({ ok: b.acao === 'mostrar', rev: false });
      return res.json({ ok: true });
    }
    if (!(await seloOk(req, res, 'avaliacao'))) return;
    const u = await clienteDe(req);
    if (!u) return res.status(401).json({ ok: false, motivo: 'login' });
    if (b.acao === 'posso') return res.json(await Loja.posso(lojaDb, u, b.ref));
    if (b.acao === 'avaliar') return res.json(await Loja.avaliar(lojaDb, u, b, Date.now()));
    return res.status(400).json({ ok: false, motivo: 'acao' });
  } catch (e) { return falhou(res, 'avaliacao', e); }
});
exports.novidades = onRequest({ region: REGIAO, cors: true, maxInstances: 5, secrets: [RESEND_KEY] }, async (req, res) => {
  // S393: link "Não quero mais receber" do e-mail de novidades (GET ?sair=<id da inscrição>) — marca sair=true e mostra uma página simples
  if (req.method === 'GET' && req.query.sair) {
    const id = String(req.query.sair).replace(/[^a-f0-9]/g, '').slice(0, 40), es = req.query.l === 'es';
    try { if (id.length === 40) { const r = fsx().doc('inscricoes/' + id); if ((await r.get()).exists) await r.set({ sair: true, sairTs: Date.now() }, { merge: true }); } } catch (e) { console.error('novidades sair', e); }
    res.set('Content-Type', 'text/html; charset=utf-8');
    return res.send(Email.molde(es ? 'Listo, ' + Email.I('saliste') : 'Pronto, você ' + Email.I('saiu'), Email.P(es ? 'No vas a recibir más las novedades de La Fouch por e-mail.' : 'Você não vai mais receber as novidades da La Fouch por e-mail.') + Email.B(es ? 'Ir a lafouch.com' : 'Ir para lafouch.com', 'https://lafouch.com')));
  }
  // S5 (20/11): link "Confirmar" do e-mail de inscrição (GET ?confirmar=<id>&t=<código>) — só depois dele a pessoa entra na lista
  if (req.method === 'GET' && req.query.confirmar) {
    const es = req.query.l === 'es';
    let certo = false;
    try { certo = (await Inscricao.confirmar(insDb, String(req.query.confirmar), String(req.query.t || ''), Date.now())).ok; } catch (e) { if (!(e instanceof Falha)) console.error('novidades confirmar', e); }
    res.set('Content-Type', 'text/html; charset=utf-8'); res.set('Cache-Control', 'private, no-store'); res.set('X-Robots-Tag', 'noindex');
    return res.status(certo ? 200 : 404).send(certo
      ? Email.molde(es ? 'Listo, ' + Email.I('confirmado') : 'Pronto, ' + Email.I('confirmado'), Email.P(es ? 'Vas a recibir las novedades de La Fouch por e-mail.' : 'Você vai receber as novidades da La Fouch por e-mail.') + Email.B(es ? 'Ir a lafouch.com' : 'Ir para lafouch.com', 'https://lafouch.com'))
      : Email.molde(es ? 'Enlace ' + Email.I('vencido') : 'Link ' + Email.I('vencido'), Email.P(es ? 'Este enlace ya no vale. Inscribite de nuevo en lafouch.com.' : 'Este link não vale mais. Inscreva-se de novo em lafouch.com.') + Email.B(es ? 'Ir a lafouch.com' : 'Ir para lafouch.com', 'https://lafouch.com')));
  }
  if (req.method !== 'POST') return res.status(405).json({ ok: false, motivo: 'metodo' });
  const b = corpo(req);
  try {
    if (b.acao === 'lista') {
      if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
      // a lista = só quem confirmou (S5); o código de confirmação nunca sai daqui
      const q = await fsx().collection('inscricoes').orderBy('ts', 'desc').limit(1000).get();
      return res.json({ ok: true, itens: q.docs.map((d) => d.data()).filter(Inscricao.vale).map((o) => { const { tok, ipk, envTs, ...resto } = o; return resto; }) });
    }
    if (b.acao === 'inscrever') {
      if (!(await seloOk(req, res, 'novidades'))) return;
      return res.json(await Inscricao.inscrever(insDb, emailResend(), { email: b.email, lang: b.lang }, Date.now(), ipkDe(req), urlFn('novidades')));
    }
    // S183: no começo do tema o app (dono) manda 1 e-mail aos inscritos (1 vez por tema e ano)
    if (b.acao === 'tema') {
      if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
      const k = String(b.chave || '').replace(/[^a-z0-9-]/gi, '').slice(0, 30);
      if (!k) return res.status(400).json({ ok: false, motivo: 'chave' });
      const g = fsx().doc('temaEnvios/' + k);
      if ((await g.get()).exists) return res.json({ ok: true, ja: true });
      const envia = emailResend({ responder: true });
      if (!envia) return res.status(500).json({ ok: false, motivo: 'sem-chave' });
      const esc2 = (t) => Email.esc(t || '').slice(0, 600);
      const q = await fsx().collection('inscricoes').limit(1000).get();
      // S400 (esboços 61h e 62): se o app mandar o código do cupom do evento (b.cupom), o e-mail leva o cartão do evento nas cores da temática
      let cupEv = null;
      try { const cd = String(b.cupom || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24); if (cd.length >= 4) { const c = await cupDb.get(cd); if (c && c.tipo === 'ev' && c.st !== 'canc') cupEv = c; } } catch (e) {}
      let n = 0;
      for (const d of q.docs) {
        const o = d.data(), em = String(o.email || '').toLowerCase();
        if (!Inscricao.vale(o) || !EMAIL_OK.test(em)) continue; // S5: só quem confirmou o e-mail e não saiu
        const es = o.lang === 'es';
        // S393 (esboço 58e): molde dos e-mails + link para sair (o id da inscrição é o próprio id do documento)
        const sair = urlFn('novidades') + '?sair=' + d.id + (es ? '&l=es' : '');
        const html = Email.molde(esc2(es ? b.tituloEs || b.titulo : b.titulo), Email.P(esc2(es ? b.textoEs || b.texto : b.texto)) + (cupEv ? Cupom.blocoEvento(cupEv, es) : Email.B(es ? 'Ver en lafouch.com' : 'Ver em lafouch.com', 'https://lafouch.com')),
          (es ? 'Recibís este e-mail porque te inscribiste en las novedades.' : 'Você recebe este e-mail porque se inscreveu nas novidades.') + ' <a href="' + sair + '" style="color:#8a7d84">' + (es ? 'No quiero recibir más' : 'Não quero mais receber') + '</a>');
        try {
          await envia({ to: em, subject: String(es ? b.tituloEs || b.titulo : b.titulo).slice(0, 120), html });
          n++;
        } catch (e) {}
        await new Promise((ok) => setTimeout(ok, 120));
      }
      await g.set({ ts: Date.now(), n });
      return res.json({ ok: true, n });
    }
    return res.status(400).json({ ok: false, motivo: 'acao' });
  } catch (e) { return falhou(res, 'novidades', e); }
});

// ---------- S3 parte 1 (20/11/2026): o site entrega pedido, comprovante, cancelamento e "avise-me" pela nuvem (pedido.js) ----------
// POST {id, doc} — o mesmo documento que o site gravava direto em pedidos/<id>; a nuvem confere, limita e grava.
const Pedido = require('./pedido');
const pedDb = {
  existe: async (id) => (await fsx().doc('pedidos/' + id).get()).exists,
  // pedido que a nuvem recebeu (a marca fica mesmo depois de o app importar e apagar pedidos/<id>)
  pedidoSeu: async (ref) => {
    if (!/^[A-Za-z0-9_-]{4,40}$/.test(ref) || !(await fsx().doc('pedidoIds/' + ref).get()).exists) return null;
    const r = await fsx().doc('reservas/' + ref).get(), o = (r.exists && r.data()) || {};
    return { pago: o.pago === true, cancelado: !!o.cancelado };
  },
  // quantos nesta hora para esta chave (rede ou telefone); a chave fica só como resumo
  conta: (chave, agora) => fsx().runTransaction(async (tx) => {
    const ref = fsx().doc('limite/' + hash(chave, 40)), d = await tx.get(ref), o = d.exists ? d.data() : {};
    const novo = agora - (+o.ts || 0) > Pedido.HORA ? { ts: agora, n: 1 } : { ts: +o.ts, n: (+o.n || 0) + 1 };
    tx.set(ref, novo);
    return novo.n;
  }),
  cria: async (id, doc, tipo) => {
    if (tipo === 'pedido') await fsx().doc('pedidoIds/' + id).set({ ts: Date.now() });
    await criaUmaVez(fsx().doc('pedidos/' + id), doc); // dois envios ao mesmo tempo: o segundo não derruba o primeiro
  },
};
exports.pedido = post('pedido', { cors: CORS_SITE, maxInstances: 10 }, async (req, res, b) => {
  if (!(await seloOk(req, res, 'pedido'))) return;
  return res.json(await Pedido.entrega(pedDb, b, Date.now(), ipkDe(req)));
});

// ---------- Mensagens do site (11/11/2026): "Entre em contato" (e-mail para lafouch.eyewear@gmail.com) e cópia dos pedidos de Atacado ----------
// POST {acao:'enviar', tipo:'contato'|'atacado', ...} público · POST {acao:'lista'} e {acao:'estado', id, est} só o dono (painel › Mensagens).
const Mensagem = require('./mensagem');
const msgDb = {
  salva: (id, o) => fsx().doc('mensagens/' + id).set(o),
  lista: async (n) => (await fsx().collection('mensagens').orderBy('ts', 'desc').limit(n).get()).docs.map((d) => Object.assign({ id: d.id }, d.data())),
  muda: (id, c) => fsx().doc('mensagens/' + id).update(c),
  // só igualdade (não precisa de índice composto no Firestore); o filtro de hora é feito aqui
  contaRecentes: async (k, desde) => (await fsx().collection('mensagens').where('ipk', '==', k).get()).docs.filter((d) => (d.get('ts') || 0) >= desde).length,
};
exports.mensagem = post('mensagem', { cors: CORS_SITE, maxInstances: 5, secrets: [RESEND_KEY] }, async (req, res, b) => {
  if (b.acao === 'lista' || b.acao === 'estado') {
    if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
    return res.json(b.acao === 'lista' ? await Mensagem.lista(msgDb, b.n) : await Mensagem.estado(msgDb, b.id, b.est));
  }
  if (b.acao !== 'enviar') return res.status(400).json({ ok: false, motivo: 'acao' });
  if (!(await seloOk(req, res, 'mensagem'))) return;
  const envia = emailResend({ falha: () => new Falha('envio', 502) });
  return res.json(await Mensagem.enviar(msgDb, envia, b, redeDe(req), Date.now()));
});

// ---------- Analisador (11/11/2026): contagens anônimas por visita; o painel lê os totais ----------
const Analise = require('./analise');
const anDb = {
  salva: (id, o) => fsx().doc('analise/' + id).set(o),
  desde: async (ts) => (await fsx().collection('analise').where('ts', '>=', ts).limit(20000).get()).docs.map((d) => d.data()),
};
exports.analise = post('analise', { cors: CORS_SITE, maxInstances: 10 }, async (req, res, b) => {
  if (b.acao === 'resumo') {
    if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
    return res.json(await Analise.resumo(anDb, b.dias, Date.now()));
  }
  if (!(await seloOk(req, res, 'analise'))) return;
  return res.json(await Analise.registra(anDb, b, Date.now()));
});

// ---------- "Avisarme cuando vuelva" (11/11/2026, S173-3A): e-mail na peça esgotada; 1 e-mail quando o app tira o "Esgotado" ----------
const { onDocumentUpdated } = require('firebase-functions/v2/firestore');
const Volta = require('./volta');
const voltaDb = {
  salva: (id, o) => fsx().doc('voltas/' + id).set(o),
  get: async (id) => { const d = await fsx().doc('voltas/' + id).get(); return d.exists ? d.data() : null; },
  // só igualdade (sem índice composto); o filtro "não enviado" é feito aqui
  pendentes: async (ref) => (await fsx().collection('voltas').where('ref', '==', ref).get()).docs.map((d) => Object.assign({ id: d.id }, d.data())).filter((o) => !o.env),
  muda: (id, c) => fsx().doc('voltas/' + id).update(c),
  contaEmail: async (e) => (await fsx().collection('voltas').where('email', '==', e).get()).docs.filter((d) => !d.get('env')).length,
  // S7 (20/11): o "Avise-me" não inscreve mais direto — vai o mesmo "Confirme" do S5 (só entra na lista quem tocar no link)
  inscreve: (email, lang) => Inscricao.inscrever(insDb, emailResend(), { email, lang, orig: 'volta' }, Date.now(), '', urlFn('novidades')),
};
exports.volta = post('volta', { cors: CORS_SITE, maxInstances: 5, secrets: [RESEND_KEY] }, async (req, res, b) => {
  if (b.acao !== 'pedir') return res.status(400).json({ ok: false, motivo: 'acao' });
  if (!(await seloOk(req, res, 'volta'))) return;
  return res.json(await Volta.pedir(voltaDb, b, Date.now()));
});
exports.voltaAvisa = onDocumentUpdated({ document: 'produtos/{ref}', region: REGIAO, secrets: [RESEND_KEY] }, async (ev) => {
  const antes = ev.data.before.data(), depois = ev.data.after.data();
  if (!Volta.voltou(antes, depois)) return;
  const envia = emailResend();
  if (!envia) return console.error('voltaAvisa: sem RESEND_KEY');
  const n = await Volta.dispara(voltaDb, envia, ev.params.ref, depois.nome, Date.now());
  console.log('voltaAvisa', ev.params.ref, n);
});

// ---------- Aviso de login (12/11/2026, bloco 5 item 5): e-mail para lafouch.eyewear@gmail.com a cada entrada com senha ----------
const Login = require('./login');
const loginDb = {
  get: async (id) => { const d = await fsx().doc('logins/' + id).get(); return d.exists ? d.data() : null; },
  salva: (id, o) => fsx().doc('logins/' + id).set(o),
  conta: async (desde) => (await fsx().collection('logins').where('ts', '>=', desde).get()).docs.filter((d) => d.id.startsWith('_l')).length,
};
exports.login = post('login', { cors: true, maxInstances: 3, secrets: [RESEND_KEY] }, async (req, res, b) => {
  if (b.acao !== 'aviso') return res.status(400).json({ ok: false, motivo: 'acao' });
  if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
  return res.json(await Login.avisa(loginDb, emailResend({ semChave: 'erro' }), b, req.get('user-agent') || '', req.ip || req.get('x-forwarded-for') || '', Date.now()));
});

// ---------- S2 (19/11/2026): conta da cliente sem mostrar o e-mail ao público ----------
// "entrar": nome de usuário antigo + senha → a função acha o e-mail e faz o login por dentro.
// A chave abaixo é a chave PÚBLICA do Firebase (a mesma que está no site); não é segredo.
const FB_CHAVE_PUBLICA = 'AIzaSyAW-54tS1A_VL2EC9OJWFsw1EtboptpEvc';
async function entraFirebase(email, senha) {
  const r = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + FB_CHAVE_PUBLICA, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: senha, returnSecureToken: true }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.idToken) throw new Error('login');
  return j;
}
exports.conta = post('conta', { cors: CORS_SITE, maxInstances: 5 }, async (req, res, b) => {
  if (!(await seloOk(req, res, 'conta'))) return;
  if (b.acao === 'entrar') return res.json(await Conta.entrar(tokDb, entraFirebase, Date.now(), String(b.user || ''), b.senha));
  return res.status(400).json({ ok: false, motivo: 'acao' });
});

// ---------- Retenção de 12 meses (12/11/2026, bloco 5 item 8): roda sozinha todo dia às 4h do Paraguai ----------
const { onSchedule } = require('firebase-functions/v2/scheduler');
const Limpeza = require('./limpeza');
const limpaDb = {
  // só igualdade/um filtro (sem índice composto); máximo 500 por dia
  velhos: async (col, antes) => (await fsx().collection(col).where('ts', '<', antes).limit(500).get()).docs.map((d) => Object.assign({ id: d.id }, d.data())),
  muda: (col, id, c) => fsx().doc(col + '/' + id).update(c),
  apaga: (col, id) => fsx().doc(col + '/' + id).delete(),
};
exports.limpeza = onSchedule({ schedule: '0 4 * * *', timeZone: FUSO, region: REGIAO }, async () => {
  const r = await Limpeza.limpa(limpaDb, Date.now());
  console.log('limpeza', JSON.stringify(r));
  // P1 (19/11): reservas paradas — tira o número do pedido do formato antigo e apaga as vencidas
  try {
    const refs = (await fsx().collection('estoque').listDocuments()).map((d) => d.id);
    console.log('limpeza estoque', JSON.stringify(await Reserva.arruma(fsx(), Date.now(), refs)));
  } catch (e) { console.error('limpeza estoque', e && e.message); }
  // S1 (20/11, parte 3): regra fixa — a página pública do pedido (reservas/) nunca guarda token nem dados do pagamento.
  // O que estiver lá (pedidos de antes da troca) vai para o lugar fechado (reservasTok/) e sai da página pública.
  try {
    const fx = fsx(), del = admin.firestore.FieldValue.delete();
    const q = await fx.collection('reservas').where('tok', '>', '').limit(500).get();
    for (const d of q.docs) {
      const o = d.data(), priv = await fx.doc('reservasTok/' + d.id).get();
      const guarda = {};
      if (!(priv.exists && priv.data().tok)) guarda.tok = o.tok;
      if (o.pixAuto && !(priv.exists && priv.data().pixAuto)) guarda.pixAuto = o.pixAuto;
      if (Object.keys(guarda).length) await fx.doc('reservasTok/' + d.id).set(guarda, { merge: true });
      await d.ref.update({ tok: del, pixAuto: del });
    }
    console.log('limpeza token', q.size);
  } catch (e) { console.error('limpeza token', e && e.message); }
});
// S400 (17/11/2026): todo dia às 10h do Paraguai — solta os presentes guardados que já podem sair (um por vez, 30 dias entre e-mails)
// e manda os convites para indicar que completaram 2 semanas da entrega. A regra está em cupom.js (diario).
exports.presentes = onSchedule({ schedule: '0 10 * * *', timeZone: FUSO, region: REGIAO, secrets: [RESEND_KEY] }, async () => {
  const r = await Cupom.diario(cupDb, pmEnvia(), Date.now());
  console.log('presentes', JSON.stringify(r));
});

// ---------- Cupons e cartões virtuais (12/11/2026, S174 v1+v2+v3) ----------
const compradorEm = (em) => 'compradores/e' + hash(em, 32); // comprador pelo e-mail (só o resumo do e-mail fica no banco)
const cupDb = {
  get: async (k) => { if (!/^[A-Z0-9-]{4,24}$/.test(k)) return null; const d = await fsx().doc('cupons/' + k).get(); return d.exists ? d.data() : null; },
  salva: (k, o) => fsx().doc('cupons/' + k).set(o),
  muda: (k, c) => fsx().doc('cupons/' + k).update(c),
  // 13/11: cria o cupom só se o código ainda não existe (atômico) e travas de "uma vez só" (boas-vindas por e-mail, cartões por pedido)
  criaSe: (k, o) => criaUmaVez(fsx().doc('cupons/' + k), o),
  trava: (k) => criaUmaVez(fsx().doc('cupomTrava/' + hash(k, 40)), { ts: Date.now() }),
  // 13/11: uso do cupom um de cada vez (dois pedidos no mesmo segundo não apagam o uso um do outro)
  trans: (k, fn) => fsx().runTransaction(async (tx) => {
    const r = fsx().doc('cupons/' + k), d = await tx.get(r);
    return fn(d.exists ? d.data() : null, (o) => tx.update(r, o));
  }),
  getMes: async (k) => { const d = await fsx().doc('cupomMes/' + k).get(); return d.exists ? d.data() : null; },
  somaMes: (k, v) => fsx().doc('cupomMes/' + k).set({ desc: admin.firestore.FieldValue.increment(v) }, { merge: true }),
  getTent: async (k) => { const d = await fsx().doc('cupomTent/' + k).get(); return d.exists ? d.data() : null; },
  salvaTent: (k, o) => fsx().doc('cupomTent/' + k).set(o),
  aviso: (o) => fsx().collection('cupomAvisos').add(o),
  avisos: async (n) => (await fsx().collection('cupomAvisos').orderBy('ts', 'desc').limit(n).get()).docs.map((d) => Object.assign({ id: d.id }, d.data())),
  // "já comprou": pedido do site com esse e-mail, ou comprador marcado quando o app confirmou um pagamento
  jaComprou: async (tel, em) => {
    if (tel && (await fsx().doc('compradores/t' + tel).get()).exists) return true;
    if (em && (await fsx().doc(compradorEm(em)).get()).exists) return true;
    if (em && !(await fsx().collection('pedidos').where('email', '==', em).limit(1).get()).empty) return true;
    return false;
  },
  comprou: async (tel, em) => {
    if (tel) await fsx().doc('compradores/t' + tel).set({ ts: Date.now() });
    // S6 (20/11): o par e-mail ↔ telefone vem de um pagamento confirmado pelo dono — é o que diz quem é a Cliente VIP logada
    if (em) await fsx().doc(compradorEm(em)).set(Object.assign({ ts: Date.now() }, tel ? { tel } : {}), { merge: true });
  },
  // S194 Cliente fiel: conta compras pagas por telefone (cada pedido só uma vez); devolve o total ou null se o pedido já contou
  contaPaga: async (tel, pid) => fsx().runTransaction(async (tx) => {
    const r = fsx().doc('compradores/t' + tel), d = await tx.get(r), o = d.exists ? d.data() : {}, pp = o.pagos || [];
    if (pp.indexOf(pid) >= 0) return null;
    const n = (o.n || 0) + 1;
    tx.set(r, { ts: Date.now(), n, pagos: pp.concat([pid]).slice(-60) }, { merge: true });
    return n;
  }),
  bvDe: async (em, tel) => {
    if (em && !(await fsx().collection('cupons').where('tipo', '==', 'bv').where('email', '==', em).limit(1).get()).empty) return true;
    if (tel && !(await fsx().collection('cupons').where('tipo', '==', 'bv').where('tel', '==', tel).limit(1).get()).empty) return true;
    return false;
  },
  porPid: async (pid, tipo) => { const q = await fsx().collection('cupons').where('pid', '==', pid).where('tipo', '==', tipo).limit(1).get(); return q.empty ? null : q.docs[0].data(); },
  comUsoDe: async (pid) => (await fsx().collection('cupons').where('pids', 'array-contains', pid).get()).docs.map((d) => d.data()),
  todos: async () => (await fsx().collection('cupons').orderBy('ts', 'desc').limit(500).get()).docs.map((d) => d.data()),
  doEmail: async (em) => (await fsx().collection('cupons').where('email', '==', em).get()).docs.map((d) => d.data()),
  // S400: um presente por vez, convite 2 semanas depois, indicações (tudo com um filtro só, sem índice composto)
  doTel: async (tel) => (await fsx().collection('cupons').where('tel', '==', tel).get()).docs.map((d) => d.data()),
  fila: async () => (await fsx().collection('cupons').where('st', '==', 'fila').limit(500).get()).docs.map((d) => d.data()),
  convites: async (agora) => (await fsx().collection('cupons').where('st', '==', 'pend').limit(1000).get()).docs.map((d) => d.data()).filter((c) => c.tipo === 'am' && c.conv && c.conv <= agora),
  cli: async (tel) => { const d = await fsx().doc('compradores/t' + tel).get(); return d.exists ? d.data() : null; },
  cliMuda: (tel, o) => fsx().doc('compradores/t' + tel).set(o, { merge: true }),
  indMais: (tel) => fsx().runTransaction(async (tx) => {
    const r = fsx().doc('compradores/t' + tel), d = await tx.get(r), n = ((d.exists && d.data().ind) || 0) + 1;
    tx.set(r, { ind: n }, { merge: true });
    return n;
  }),
  // S409: Clientes VIP (status para sempre) — para o cartão de aniversário do diário
  vips: async () => (await fsx().collection('compradores').where('vip', '>', 0).limit(2000).get()).docs.map((d) => Object.assign({ tel: d.id.replace(/^t/, '') }, d.data())),
};
// ---------- S409 (17/11/2026): o servidor confere TODO pedido do site (preços do catálogo, cartão, presente especial, piso) ----------
// Fora da regra = pedido marcado "suspeito" na reserva (o robô do PIX/transferência NÃO confirma sozinho), aviso no app e no celular do dono.
const Presente = require('./presente');
exports.conferePedido = onDocumentCreated({ document: 'pedidos/{id}', region: REGIAO }, async (ev) => {
  const f = (ev.data && ev.data.data()) || {};
  if (f.tipo || f.teste) return;
  try {
    const db = fsx(), refs = Array.from(new Set((Array.isArray(f.itens) ? f.itens : []).map((i) => String((i && i.ref) || '')).filter((r) => /^[A-Za-z0-9_.-]{1,40}$/.test(r))));
    let prods = {}, pisos = {};
    // presente especial: precisa de todas as peças do catálogo com os pisos (a lista de candidatos); sem presente, só as peças do pedido
    if ((f.itens || []).some((i) => i && i.pres)) ({ prods, pisos } = await catalogoPisos());
    else for (const r of refs) { const d = await db.doc('produtos/' + r).get(); if (d.exists) prods[r] = Object.assign({ ref: r }, d.data()); }
    let cup = null;
    const cod = String(f.cup || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24);
    if (cod) { const c = await db.doc('cupons/' + cod).get(); if (c.exists) cup = { tipo: c.data().tipo, pct: +c.data().pct || 0 }; else cup = { tipo: '?', pct: 0 }; }
    const vip = await ehVip(telDe(f.tel));
    const cfg = await db.doc('config/site').get(), cot = +(((cfg.exists && cfg.data()) || {}).cotacao || {}).brl || 0;
    const r = Presente.confere(f, prods, pisos, cup, vip, cot);
    if (r.ok) {
      // 20/11/2026 (varredura do pagamento): a FICHA do pedido para o robô do banco — o valor a pagar conferido aqui, num lugar que o app não apaga
      // (pixEspera/<pedido>, tipo 'site'). Só nasce para pedido dentro da regra: pedido suspeito ou com erro nunca é confirmado sozinho.
      if (r.pagar) await db.doc('pixEspera/' + ev.params.id).set(Object.assign({ tipo: 'site', conf: true, ts: +f.ts || Date.now(), cod: String(f.cod || '').slice(0, 8),
        nome: String(f.nome || '').slice(0, 80), itens: (f.itens || []).filter((i) => i && i.ref).slice(0, 30).map((i) => ({ ref: String(i.ref), cor: String(i.cor || ''), q: Math.max(1, Math.round(+i.q || 1)) })) }, r.pagar));
      return;
    }
    console.error('conferePedido SUSPEITO', ev.params.id, JSON.stringify(r));
    await db.doc('reservas/' + ev.params.id).set({ suspeito: r.motivos.slice(0, 5).join(' · ').slice(0, 300), minimo: r.minimo }, { merge: true });
    await db.collection('cupomAvisos').add({ ts: Date.now(), t: 'pedido', d: 'Pedido ' + String(f.cod || ev.params.id).slice(0, 8) + ' fora da regra: ' + r.motivos[0], cod: cod || '' });
    // aviso de pedido suspeito vai para todos os aparelhos, mesmo no horário de silêncio
    await avisaAparelhos(() => true, (dd) => ({ notification: { title: '⚠️ Pedido ' + String(f.cod || '') + ' com valor fora da regra', body: 'Confira antes de aceitar o pagamento: ' + r.motivos[0] },
      data: { tipo: 'suspeito', id: String(ev.params.id) }, android: { priority: 'high', notification: { channelId: 'pedidos_' + somDe(dd, 'sn'), tag: 'susp-' + ev.params.id } } }));
  } catch (e) { console.error('conferePedido', ev.params.id, e && e.message); }
});
exports.cupom = post('cupom', { cors: true, maxInstances: 10, secrets: [RESEND_KEY] }, async (req, res, b) => {
  const ipk = ipkDe(req);
  const envia = emailResend();
  const agora = Date.now();
  // público (site)
  if (['ver', 'usar', 'bv', 'proxima', 'presentes', 'meus'].indexOf(b.acao) >= 0 && !(await seloOk(req, res, 'cupom'))) return;
  if (b.acao === 'ver') return res.json(await Cupom.ver(cupDb, b, ipk, agora));
  if (b.acao === 'usar') return res.json(await Cupom.usar(cupDb, b, ipk, agora, false));
  if (b.acao === 'bv') return res.json(await Cupom.boasVindas(cupDb, envia, b, agora));
  if (b.acao === 'proxima') return res.json(await Cupom.proxima(cupDb, b, agora));
  // S409: quais peças podem ser o presente especial para as peças pagas do carrinho (o piso fica só no servidor; o site recebe só as refs)
  if (b.acao === 'presentes') {
    const pagas = (Array.isArray(b.pagas) ? b.pagas : []).map(String).filter((r) => /^[A-Za-z0-9_.-]{1,40}$/.test(r)).slice(0, 20);
    const [{ prods, pisos }, { vip }] = await Promise.all([catalogoPisos(), vipDe(req)]); // S6: VIP só para a própria cliente logada
    return res.json(Object.assign({ ok: true, vip }, Presente.podeSer(prods, pisos, pagas, vip)));
  }
  if (b.acao === 'meus') {
    const t = await tokenDe(req);
    if (!t) return res.status(401).json({ ok: false, motivo: 'login' });
    return res.json(await Cupom.meus(cupDb, t.email, agora));
  }
  // só o dono (app)
  if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
  if (b.acao === 'caixa') return res.json(await Cupom.usar(cupDb, b, ipk, agora, true));
  if (b.acao === 'confirma') return res.json(await Cupom.confirma(cupDb, envia, b, agora));
  if (b.acao === 'libera') return res.json(await Cupom.libera(cupDb, b, agora));
  if (b.acao === 'emitir') return res.json(await Cupom.emitir(cupDb, b, agora, envia));
  if (b.acao === 'entregue') { await Cupom.confirma(cupDb, envia, b, agora); return res.json(await Cupom.entregue(cupDb, envia, b, agora)); }
  if (b.acao === 'cancelar') return res.json(await Cupom.cancelar(cupDb, b));
  if (b.acao === 'destrava') return res.json(await Cupom.destrava(cupDb, b));
  if (b.acao === 'lista') return res.json(await Cupom.lista(cupDb, agora));
  return res.status(400).json({ ok: false, motivo: 'acao' });
});

// ---------- S197 PIX automático por e-mail (12/11/2026): o robô do Gmail chama esta função com a chave PIX_ROBO ----------
const Pix = require('./pix');
const PIX_ROBO = defineSecret('PIX_ROBO');
const pixDb = {
  jaVisto: async (m) => (await fsx().doc('pixVistos/' + hash(m, 40)).get()).exists,
  visto: (m, ts) => fsx().doc('pixVistos/' + hash(m, 40)).set({ ts }),
  desvisto: (m) => fsx().doc('pixVistos/' + hash(m, 40)).delete(),
  // fichas dos pedidos do site conferidas pelo servidor (nascem no conferePedido); o pago/cancelado/suspeito vem da reserva.
  // Só um filtro (sem índice composto).
  fichas: async (desde) => {
    const L = (await fsx().collection('pixEspera').where('ts', '>=', desde).limit(300).get()).docs
      .map((d) => Object.assign({ id: d.id }, d.data())).filter((p) => p.tipo === 'site' && p.conf === true);
    const agora = Date.now();
    for (const p of L) {
      const r = await fsx().doc('reservas/' + p.id).get(), o = r.exists ? r.data() : {};
      p.pago = !!(o.pago || o.cancelado || p.ok || o.suspeito); // S409: pedido suspeito não é confirmado pelo robô (o dono confere)
      p.aberta = !p.pago && (await Reserva.aberta(fsx(), agora, p.id, (p.itens || []).map((i) => i.ref))); // 39: desempate pela reserva
    }
    return L;
  },
  esperas: async (desde) => (await fsx().collection('pixEspera').where('ts', '>=', desde).limit(200).get()).docs.map((d) => Object.assign({ id: d.id }, d.data())).filter((e) => e.tipo !== 'site'),
  // confirmar = segurar a peça como paga (a mesma regra do "pagar" do app); a peça já foi para outra pessoa → 'sem-peca', nunca "pago" sem a peça
  confirmaPedido: async (id, o) => {
    if (await Reserva.ligada(fsx())) {
      const fi = await fsx().doc('pixEspera/' + id).get(), itens = ((fi.exists && fi.data()) || {}).itens || [];
      if (itens.length) try { await Reserva.pagar(fsx(), Date.now(), id, itens); } catch (e) {
        if (e instanceof Falha && e.motivo === 'expirou') throw new Falha('sem-peca', 409, { falta: e.extra.falta });
        throw e;
      }
    }
    const tok = crypto.randomBytes(6).toString('hex');
    // S1 (20/11, parte 3): token e dados do pagamento só no lugar fechado; a página pública do pedido diz só "pago".
    // A ordem importa: o e-mail "pagamento confirmado" nasce quando reservas/ fica paga e lê o token de reservasTok/.
    await fsx().doc('reservasTok/' + id).set({ tok, pixAuto: o }, { merge: true });
    await fsx().doc('reservas/' + id).set({ pago: true }, { merge: true });
    await fsx().doc('pixEspera/' + id).set({ ok: o }, { merge: true });
  },
  confirmaEspera: (id, o) => fsx().doc('pixEspera/' + id).update({ ok: o }),
  semPar: (o) => fsx().collection('pixSemPar').add(o),
};
// 39 · preço exato (21/11): o dono liga na mão um PIX/transferência "sem par" a um pedido do site — o MESMO caminho da confirmação
// automática (confirmaPedido: segura a peça com Reserva.pagar, token, reserva paga); a linha do "sem par" fica marcada como ligada.
async function ligaPix(pixId, pid) {
  if (!/^[A-Za-z0-9_-]{4,40}$/.test(pixId) || !/^[A-Za-z0-9_-]{4,40}$/.test(pid)) throw new Falha('dados');
  const ref = fsx().doc('pixSemPar/' + pixId), d = await ref.get();
  if (!d.exists) throw new Falha('pix', 404);
  const sp = d.data();
  if (sp.ligado) return { ja: true, pedido: sp.ligado };
  if (!(await fsx().doc('pedidoIds/' + pid).get()).exists) throw new Falha('pedido', 404); // só pedido que a nuvem recebeu
  const rs = await fsx().doc('reservas/' + pid).get(), o = rs.exists ? rs.data() : {};
  if (o.pago || o.cancelado) throw new Falha(o.pago ? 'pago' : 'cancelado', 409);
  await pixDb.confirmaPedido(pid, Object.assign({ valor: sp.valor, banco: sp.banco || '', mid: sp.mid || '', ts: Date.now(), por: 'dono' }, sp.de ? { de: sp.de } : {}));
  await ref.set({ ligado: pid, ligTs: Date.now() }, { merge: true });
  return { pedido: pid };
}
exports.pix = post('pix', { cors: false, maxInstances: 2, secrets: [PIX_ROBO] }, async (req, res, b) => {
  let chave = '';
  try { chave = PIX_ROBO.value() || ''; } catch (e) {}
  const vem = String(req.get('x-robo') || '');
  if (!chave || vem.length !== chave.length || !crypto.timingSafeEqual(Buffer.from(vem), Buffer.from(chave))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
  return res.json(await Pix.recebe(pixDb, b, Date.now()));
});

// ---------- S198 segurança do painel (12/11/2026): passkey, Google Authenticator, aparelhos, sair de todos ----------
const Seg = require('./seg');
const segDb = {
  get: async (k) => { const d = await fsx().doc('seg/' + k).get(); return d.exists ? d.data() : null; },
  salva: (k, o) => fsx().doc('seg/' + k).set(o),
  muda: (k, o) => fsx().doc('seg/' + k).set(o, { merge: true }),
  salvaDesafio: (c, ts) => fsx().doc('segDesafio/' + hash(c, 40)).set({ ts }),
  usaDesafio: async (c, desde) => {
    const r = fsx().doc('segDesafio/' + hash(c, 40));
    return fsx().runTransaction(async (tx) => { const d = await tx.get(r); if (!d.exists) return false; tx.delete(r); return d.data().ts >= desde; });
  },
};
// a segurança do painel só aceita o próprio site (sem as cópias de teste): por isso a lista é só lafouch.com
exports.seg = post('seg', { cors: ['https://lafouch.com'], maxInstances: 3 }, async (req, res, b) => {
  const agora = Date.now();
  const wa = require('@simplewebauthn/server');
  // sem login: entrar com a chave de acesso (passkey)
  if (b.acao === 'pkEntOpc') return res.json(await Seg.pkEntOpc(segDb, wa, agora));
  if (b.acao === 'pkEnt') {
    const r = await Seg.pkEntOk(segDb, wa, b.resp || {}, agora);
    if (!r.ok) return res.status(403).json(r);
    return res.json({ ok: true, nome: r.nome, token: await admin.auth().createCustomToken(DONO_UID, { pk: true }) });
  }
  if (!(await ehDono(req))) return res.status(403).json({ ok: false, motivo: 'sem-permissao' });
  if (b.acao === 'totpVe') return res.json(await Seg.totpVe(segDb, b.cod, agora));
  if (b.acao === 'totpCria') return res.json(await Seg.totpCria(segDb, agora));
  if (b.acao === 'totpLiga') return res.json(await Seg.totpLiga(segDb, b.cod, agora));
  if (b.acao === 'estado') {
    const t = (await segDb.get('totp')) || {}, p = ((await segDb.get('passkeys')) || {}).L || [];
    const ap = (await fsx().collection('logins').orderBy('ts', 'desc').limit(40).get()).docs.filter((d) => !d.id.startsWith('_l')).map((d) => Object.assign({ id: d.id }, d.data()));
    return res.json({ ok: true, totp: !!t.seg, passkeys: p.map((x) => ({ id: x.id, nome: x.nome, ts: x.ts, uso: x.uso || 0 })), aparelhos: ap.slice(0, 20) });
  }
  if (b.acao === 'pkRegOpc') return res.json(await Seg.pkRegOpc(segDb, wa, agora));
  if (b.acao === 'pkReg') return res.json(await Seg.pkRegOk(segDb, wa, b.resp || {}, b.nome, agora));
  if (b.acao === 'pkTira') { const L = (((await segDb.get('passkeys')) || {}).L || []).filter((x) => x.id !== b.id); await segDb.salva('passkeys', { L }); return res.json({ ok: true }); }
  if (b.acao === 'sairTodos') { await admin.auth().revokeRefreshTokens(DONO_UID); return res.json({ ok: true }); }
  return res.status(400).json({ ok: false, motivo: 'acao' });
});

// ---------- S191 Conta Atacadista/Mayorista (12/11/2026): o site chama com o link do cliente; o app (dono) cria as contas ----------
const Atacado = require('./atacado');
const ataDb = {
  get: async (k) => { if (!/^[A-Za-z0-9_-]{4,40}$/.test(k)) return null; const d = await fsx().doc('atacadoContas/' + k).get(); return d.exists ? d.data() : null; },
  muda: (k, o) => fsx().doc('atacadoContas/' + k).set(o, { merge: true }),
  precos: async (t) => { const d = await fsx().doc('atacadoPrecos/' + String(t).replace(/[^a-z0-9]/gi, '')).get(); return d.exists ? d.data() : null; },
  pedido: (k, o) => fsx().doc('atacadoPedidos/' + k).set(o),
  existe: async (k) => (await fsx().doc('atacadoPedidos/' + k).get()).exists,
  // S206: lotes (o dono cria no app) e separação de 30 min enquanto a loja monta o pedido
  lote: async (k) => { if (!/^[A-Za-z0-9_-]{2,40}$/.test(k)) return null; const d = await fsx().doc('atacadoLotes/' + k).get(); return d.exists ? d.data() : null; },
  sepAtivas: async (agora) => (await fsx().collection('atacadoSep').where('ini', '>', agora - Atacado.SEP).get()).docs.map((d) => d.data()),
  sepGrava: (k, o) => fsx().doc('atacadoSep/' + k).set(o),
  trans: (f) => fsx().runTransaction(async (tx) => f({
    sepAtivas: async (agora) => (await tx.get(fsx().collection('atacadoSep').where('ini', '>', agora - Atacado.SEP))).docs.map((d) => d.data()),
    sepGrava: async (k, o) => { tx.set(fsx().doc('atacadoSep/' + k), o); },
  })),
};
const ataAviso = (o) => fsx().collection('atacadoAvisos').add(o);
exports.atacado = post('atacado', { cors: CORS_SITE, maxInstances: 5, secrets: [RESEND_KEY] }, async (req, res, b) => {
  const ag = Date.now();
  if (!(await seloOk(req, res, 'atacado'))) return;
  if (b.acao === 'entrar') return res.json(await Atacado.entrar(ataDb, emailResend({ semChave: 'erro' }), b, ag));
  if (b.acao === 'confirma') return res.json(await Atacado.confirma(ataDb, ataAviso, b, ag));
  if (b.acao === 'catalogo') return res.json(await Atacado.catalogo(ataDb, b, ag));
  if (b.acao === 'remove') return res.json(await Atacado.remove(ataDb, ataAviso, b, ag));
  if (b.acao === 'pedido') return res.json(await Atacado.pedido(ataDb, b, ag));
  if (b.acao === 'separa') return res.json(await Atacado.separa(ataDb, b, ag));
  if (b.acao === 'avisame') return res.json(await Atacado.avisame(ataDb, ataAviso, b, ag));
  return res.status(400).json({ ok: false, motivo: 'acao' });
});

// ---------- S393 E-mails do pedido para o cliente (16/11/2026, esboços 58g e 58h) ----------
// pedidoMail: pedido novo com e-mail → "Recebemos seu pedido" · pedido cancelado → apaga a cópia
// pagoMail:   reserva ficou paga (PIX automático ou o dono confirmando no app) → "Pagamento confirmado" com o token, uma vez só
const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const PedidoMail = require('./pedidomail');
const ZAP_LOJA = 'https://wa.me/595983642241';
const pmDb = {
  get: async (id) => { const d = await fsx().doc('pedidoMail/' + id).get(); return d.exists ? d.data() : null; },
  salva: (id, o) => fsx().doc('pedidoMail/' + id).set(o),
  muda: (id, c) => fsx().doc('pedidoMail/' + id).update(c),
  apaga: (id) => fsx().doc('pedidoMail/' + id).delete(),
  pegaPago: (id) => fsx().runTransaction(async (tx) => {
    const r = fsx().doc('pedidoMail/' + id), d = await tx.get(r);
    if (!d.exists || d.data().pago) return null;
    tx.update(r, { pago: true });
    return d.data();
  }),
};
const pmEnvia = () => emailResend({ responder: true }); // e-mails do pedido: a resposta da cliente vai para a loja
exports.pedidoMail = onDocumentCreated({ document: 'pedidos/{id}', region: REGIAO, secrets: [RESEND_KEY] }, async (ev) => {
  const f = (ev.data && ev.data.data()) || {};
  try {
    if (f.tipo === 'cancel') { if (f.ref && f.ref !== 'teste') await PedidoMail.aoCancelar(pmDb, String(f.ref).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40), null); return; } // o cliente cancelou: sem e-mail
    if (f.tipo) return;
    let reserva = false;
    try { reserva = await Reserva.ligada(fsx()); } catch (e) {}
    console.log('pedidoMail', ev.params.id, JSON.stringify(await PedidoMail.aoCriar(pmDb, pmEnvia(), ev.params.id, f, reserva, ZAP_LOJA, Date.now())));
  } catch (e) { console.error('pedidoMail', ev.params.id, e && e.message); }
});
exports.pagoMail = onDocumentWritten({ document: 'reservas/{id}', region: REGIAO, secrets: [RESEND_KEY] }, async (ev) => {
  const antes = ev.data.before.exists ? ev.data.before.data() : {}, depois = ev.data.after.exists ? ev.data.after.data() : null;
  // S409 (63b): o dono cancelou um pedido JÁ PAGO no app → e-mail "Pedido cancelado" (pedido não pago não manda nada)
  if (depois && depois.cancelado && !antes.cancelado) {
    try { console.log('cancelMail', ev.params.id, JSON.stringify(await PedidoMail.aoCancelar(pmDb, ev.params.id, depois.pago === true || antes.pago === true ? pmEnvia() : null))); }
    catch (e) { console.error('cancelMail', ev.params.id, e && e.message); }
    return;
  }
  if (!depois || depois.pago !== true || antes.pago === true || depois.cancelado) return;
  // S1 (20/11, parte 3): o token vem do lugar fechado (reservasTok/), gravado ANTES de reservas/ ficar paga
  let tok = '';
  try { const t = await fsx().doc('reservasTok/' + ev.params.id).get(); tok = (t.exists && t.data().tok) || ''; } catch (e) {}
  try { console.log('pagoMail', ev.params.id, JSON.stringify(await PedidoMail.aoPagar(pmDb, pmEnvia(), ev.params.id, tok, URL_COMP, Date.now()))); }
  catch (e) { console.error('pagoMail', ev.params.id, e && e.message); }
});
// S400 (17/11/2026): pedido ENTREGUE (entregas/{id} nasce no "liberar" de um pedido pago) → presente do cliente por e-mail.
// confirma() antes, porque o pagamento automático (PIX pelo robô) pode não ter passado pelo "confirmar" do app; as duas são de uma vez só.
exports.entregaMail = onDocumentCreated({ document: 'entregas/{id}', region: REGIAO, secrets: [RESEND_KEY] }, async (ev) => {
  try {
    const b = { pid: ev.params.id }, agora = Date.now();
    await Cupom.confirma(cupDb, pmEnvia(), b, agora);
    console.log('entregaMail', ev.params.id, JSON.stringify(await Cupom.entregue(cupDb, pmEnvia(), b, agora)));
  } catch (e) { console.error('entregaMail', ev.params.id, e && e.message); }
});
// comprovante: página do "Baixar comprovante" do e-mail — abre em qualquer aparelho, só com o id do pedido + o token certos
const URL_COMP = urlFn('comprovante');
exports.comprovante = onRequest({ region: REGIAO, cors: false, maxInstances: 3 }, async (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8'); res.set('Cache-Control', 'private, no-store'); res.set('X-Robots-Tag', 'noindex');
  if (req.method !== 'GET') return res.status(405).send('');
  try {
    const h = await PedidoMail.comprovante(pmDb, String(req.query.p || ''), String(req.query.t || ''));
    if (h) return res.send(h);
  } catch (e) { console.error('comprovante', e && e.message); }
  return res.status(404).send(Email.molde('Comprovante ' + Email.I('não encontrado'), Email.P('Este link não vale mais ou está incompleto. Abra o e-mail de pagamento confirmado e toque de novo em “Baixar comprovante”.') + Email.B('Ir para lafouch.com', 'https://lafouch.com')));
});
