// Avisos do site para o app da loja (celular e computador).
// Dispara quando o site cria um documento em "pedidos": pedido novo, comprovante ou cancelamento.
// Os aparelhos cadastrados ficam em "dispositivos" (o app grava o token ao abrir).
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

admin.initializeApp();

// A região da função precisa ser a MESMA do banco Firestore (Firebase > Firestore > Dados > Local).
const REGIAO = 'us-central1';

function gs(n) {
  return 'Gs. ' + String(Math.round(+n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function texto(f) {
  const cod = String(f.cod || '').slice(0, 8);
  if (f.tipo === 'comp') return { tipo: 'comp', titulo: '🧾 Comprovante recebido', corpo: 'Pedido ' + cod + ': confira o pagamento.' };
  if (f.tipo === 'cancel') return { tipo: 'cancel', titulo: 'Pedido cancelado', corpo: 'O cliente cancelou o pedido ' + cod + ' pelo site.' };
  const nome = String(f.nome || 'Cliente').slice(0, 40);
  return { tipo: 'novo', titulo: '🛒 Novo pedido ' + cod, corpo: nome + ' · ' + gs(f.total) + (f.teste ? ' · TESTE' : '') };
}

exports.avisarPedido = onDocumentCreated({ document: 'pedidos/{id}', region: REGIAO }, async (ev) => {
  const snap = ev.data;
  if (!snap) return;
  const f = snap.data() || {};
  const t = texto(f);
  const db = admin.firestore();
  const lista = await db.collection('dispositivos').get();
  const tokens = lista.docs.map((d) => d.id);
  if (!tokens.length) return;
  const r = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title: t.titulo, body: t.corpo },
    data: { tipo: t.tipo, id: String(ev.params.id) },
    android: { priority: 'high', notification: { channelId: 'pedidos', sound: 'default' } }
  });
  // tira da lista os aparelhos que não existem mais (app desinstalado)
  const apagar = [];
  r.responses.forEach((x, i) => {
    const c = x.error && x.error.code;
    if (c === 'messaging/registration-token-not-registered' || c === 'messaging/invalid-registration-token') apagar.push(tokens[i]);
  });
  await Promise.all(apagar.map((tk) => db.collection('dispositivos').doc(tk).delete()));
});
