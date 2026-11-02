// Avisos do site para o app da loja (celular).
// Dispara quando o site cria um documento em "pedidos": pedido novo, comprovante, cancelamento.
// Cada aparelho cadastrado (coleção "dispositivos") tem as suas opções: n/c/x/p (tipos de aviso),
// som, e silêncio por horário (q, qi, qf) — definidas em Ajustes > Avisos de pedidos no app.
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
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
  if (f.tipo === 'cancel' && f.ref === 'teste') return { tipo: 'teste', titulo: '🔔 Aviso de teste', corpo: 'Assim chegam os avisos neste aparelho.' };
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
    const som = (d.data() || {}).som || 'sino';
    try {
      await admin.messaging().send({
        token: d.id,
        notification: { title: t.titulo, body: t.corpo },
        data: { tipo: t.tipo, id: String(ev.params.id) },
        android: { priority: 'high', notification: { channelId: 'pedidos_' + som } }
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
