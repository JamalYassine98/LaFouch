// E-mails do pedido para o cliente (S393, 16/11/2026 — esboços 58g e 58h aprovados pelo dono):
//   "Recebemos seu pedido" quando o site cria o pedido · "Pagamento confirmado" (com o TOKEN) quando a reserva fica paga.
// Regra pura (testes em teste-pedidomail.js). db: { get(id), salva(id,o), muda(id,campos), apaga(id), pegaPago(id) } na coleção pedidoMail,
// uma cópia mínima do pedido só para o servidor (o app apaga o pedido depois de importar; o e-mail do "pago" precisa dela).
// A cópia some quando o pedido é cancelado ou sozinha em 30 dias (limpeza.js). Depois do "pago" ela fica esses 30 dias para o comprovante
// (função comprovante: página que abre em qualquer aparelho, com o id do pedido + o token).
const E = require('./email');
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const lim = (s, n) => String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);
const gs = (n) => 'Gs. ' + String(Math.round(+n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const brl = (n) => 'R$ ' + (Math.round((+n || 0) * 100) / 100).toLocaleString('pt-BR', { minimumFractionDigits: (+n || 0) % 1 ? 2 : 0, maximumFractionDigits: 2 });

// do documento do pedido para a cópia guardada; null = este pedido não recebe e-mail (comprovante/cancelamento, teste, sem e-mail)
function copia(f, agora) {
  if (!f || f.tipo || f.teste) return null;
  const email = lim(f.email, 200).toLowerCase();
  if (!EMAIL_OK.test(email)) return null;
  const tr = /Transportadora:\s*([^·]+)/.exec(String(f.obsC || ''));
  return {
    email, nome: lim(f.nome, 80), cod: lim(f.cod, 8).toUpperCase(), lang: f.lang === 'es' ? 'es' : 'pt', pag: f.pag === 'alias' ? 'alias' : 'pix',
    brl: +f.brl || 0, pagar: +f.pagar || 0, total: +f.total || 0, ent: f.ent === 'delivery' ? 'delivery' : 'loja', tr: tr ? lim(tr[1], 40) : '',
    cidade: lim(f.cidade, 60), frete: (/frete (Gs\. [\d.]+)/.exec(String(f.obsC || '')) || [])[1] || (/frete na entrega/.test(String(f.obsC || '')) ? '?' : ''),
    // pv = o preço da linha do jeito que o cliente viu na tela (o site manda desde 16/11; pedido antigo fica só com a quantidade)
    itens: (Array.isArray(f.itens) ? f.itens : []).slice(0, 30).map((i) => ({ nome: lim(i && i.nome, 80), cor: lim(i && i.cor, 30), grau: lim(i && i.grau, 10), q: Math.max(1, Math.min(99, +(i && i.q) || 1)), pv: /^(R\$|Gs\.) [\d.,]{1,14}$/.test(String((i && i.pv) || '')) ? String(i.pv) : '' })),
    ts: +f.ts || agora, rec: false, pago: false,
  };
}
const valor = (o) => o.pag === 'pix' ? brl(o.brl) : gs(o.pagar || o.total);
const data = (o, es) => new Date(o.ts).toLocaleDateString(es ? 'es-PY' : 'pt-BR', { timeZone: 'America/Asuncion' });
const pn = (o) => E.esc(String(o.nome || '').trim().split(/\s+/)[0]);
const pecas = (o) => o.itens.reduce((n, i) => n + i.q, 0);
const entrega = (o, es) => o.ent === 'delivery' ? [(es ? 'Envío' : 'Entrega') + (o.tr || o.cidade ? ' · ' + E.esc(o.tr || o.cidade) : ''), o.frete === '?' ? (es ? 'Al recibir' : 'Na entrega') : o.frete ? E.esc(o.frete) : (es ? 'Gratis' : 'Grátis')] : [es ? 'Retiro en la tienda' : 'Retirada na loja', es ? 'Gratis' : 'Grátis'];
const itemLinha = (i, es) => E.linha(E.esc(i.nome) + (i.cor ? ' · ' + E.esc(i.cor) : '') + (i.grau ? ' · ' + E.esc(i.grau) : '') + (i.pv ? ' · ' + i.q + (es ? ' u.' : ' un.') : ''), i.pv ? E.esc(i.pv) : i.q + (es ? ' u.' : ' un.'));
const CONTA = 'https://lafouch.com/conta';

function recebido(o, reserva, zap) {
  const es = o.lang === 'es', n = pn(o);
  const L = o.itens.map((i) => itemLinha(i, es));
  const en = entrega(o, es);
  L.push(E.linha(en[0], en[1]), E.linha('Total', valor(o), true));
  return {
    to: o.email,
    subject: (es ? 'Recibimos tu pedido ' : 'Recebemos seu pedido ') + o.cod,
    html: E.molde(es ? 'Recibimos tu ' + E.I('pedido') : 'Recebemos seu ' + E.I('pedido'),
      E.P((es ? '¡Hola' : 'Olá') + (n ? ', ' + n : '') + (es ? '! ' : '. ') + (reserva ? (es ? 'Guardamos tus piezas por 30 minutos mientras pagás.' : 'Guardamos suas peças por 30 minutos enquanto você paga.') : (es ? 'Ya podés hacer el pago.' : 'Agora é só fazer o pagamento.'))) +
      '<div style="text-align:center;font:13px ' + E.SA + ';color:' + E.S + ';letter-spacing:.06em;margin:0 0 6px">' + (es ? 'PEDIDO ' : 'PEDIDO ') + E.esc(o.cod) + ' · ' + data(o, es) + '</div>' + E.tabela(L) +
      '<p style="text-align:center;font:14px ' + E.SA + ';color:' + E.S + ';margin:18px 0 0">' + (es ? 'Pago: ' : 'Pagamento: ') + '<b style="color:' + E.T + '">' + (o.pag === 'pix' ? 'PIX' : (es ? 'Transferencia' : 'Transferência')) + ' · ' + (es ? 'esperando' : 'aguardando') + '</b></p>' +
      E.B(es ? 'Ver mi pedido y pagar' : 'Ver meu pedido e pagar', CONTA) + (zap ? E.LK(es ? 'Hablar con la tienda por WhatsApp' : 'Falar com a loja no WhatsApp', zap) : '')),
    text: (es ? 'Recibimos tu pedido ' : 'Recebemos seu pedido ') + o.cod + ' · Total ' + valor(o) + ' · ' + CONTA,
  };
}
const token = (o, tok) => String(tok || '').replace(/[^A-Za-z0-9-]/g, '').slice(0, 24) || ('LF-' + o.cod);
function pago(o, tok, comp) {
  const es = o.lang === 'es', n = pn(o), t = token(o, tok), en = entrega(o, es), q = pecas(o);
  return {
    to: o.email,
    subject: (es ? 'Pago confirmado · tu token ' : 'Pagamento confirmado · seu token ') + t,
    html: E.molde(es ? 'Pago ' + E.I('confirmado') : 'Pagamento ' + E.I('confirmado'),
      E.P((es ? 'Gracias por tu preferencia' : 'Agradecemos a preferência') + (n ? ', ' + n : '') + '. ' + (es ? 'Tu pedido está asegurado.' : 'Seu pedido está garantido.')) +
      E.ROT(es ? 'TU TOKEN' : 'SEU TOKEN') + E.codigo(t, 0.12, 32) + E.PQ(es ? 'Mostrá este token al retirar o recibir el pedido.' : 'Mostre este token ao retirar ou receber o pedido.') +
      '<div style="height:22px"></div>' + E.tabela([E.linha('Pedido ' + E.esc(o.cod) + ' · ' + data(o, es), q + (q === 1 ? (es ? ' pieza' : ' peça') : (es ? ' piezas' : ' peças'))), E.linha(en[0], en[1]),
        E.linha(o.pag === 'pix' ? (es ? 'Pagado por PIX' : 'Pago por PIX') : (es ? 'Pagado por transferencia' : 'Pago por transferência'), valor(o), true)]) +
      E.B(es ? 'Ver mi pedido' : 'Ver meu pedido', CONTA) + (comp ? E.LK(es ? 'Descargar comprobante' : 'Baixar comprovante', comp) : '')),
    text: (es ? 'Pago confirmado. Tu token: ' : 'Pagamento confirmado. Seu token: ') + t + ' · Pedido ' + o.cod + ' · ' + valor(o),
  };
}

// pedido novo: guarda a cópia e manda o "recebemos" (uma vez)
async function aoCriar(db, envia, id, f, reserva, zap, agora) {
  const o = copia(f, agora);
  if (!o) return { ok: true, fora: true };
  if (await db.get(id)) return { ok: true, ja: true };
  await db.salva(id, o);
  if (!envia) return { ok: true, semChave: true };
  await envia(recebido(o, reserva, zap));
  await db.muda(id, { rec: true });
  return { ok: true, enviou: true };
}
// reserva ficou paga: manda o "pago" com o token (uma vez) e apaga a cópia
async function aoPagar(db, envia, id, tok, baseComp, agora) {
  if (!envia) return { ok: true, semChave: true };
  const o = await db.pegaPago(id); // de uma vez só: lê e marca "pago" (dois avisos juntos não mandam dois e-mails); null = sem cópia ou já mandado
  if (!o) return { ok: true, fora: true };
  const t = token(o, tok);
  try { await envia(pago(o, t, baseComp ? baseComp + '?p=' + encodeURIComponent(id) + '&t=' + encodeURIComponent(t) : '')); } catch (e) { await db.muda(id, { pago: false }); throw e; }
  await db.muda(id, { tok: t, pagoTs: agora || Date.now() }); // fica 30 dias para o comprovante
  return { ok: true, enviou: true };
}
// comprovante: página que abre em qualquer aparelho; só com o id do pedido E o token certos, e só de pedido pago
async function comprovante(db, id, tok) {
  const o = /^[A-Za-z0-9_-]{2,40}$/.test(String(id || '')) ? await db.get(id) : null;
  const t = String(tok || '');
  if (!o || !o.pago || !o.tok || t.length !== o.tok.length || !require('crypto').timingSafeEqual(Buffer.from(t), Buffer.from(o.tok))) return null;
  const es = o.lang === 'es', en = entrega(o, es);
  const L = [E.linha(es ? 'Cliente' : 'Cliente', E.esc(o.nome)), E.linha('Pedido', E.esc(o.cod) + ' · ' + data(o, es))].concat(o.itens.map((i) => itemLinha(i, es)));
  L.push(E.linha(en[0], en[1]), E.linha(o.pag === 'pix' ? (es ? 'Pagado por PIX' : 'Pago por PIX') : (es ? 'Pagado por transferencia' : 'Pago por transferência'), valor(o), true));
  return E.molde(es ? 'Comprobante de ' + E.I('pago') : 'Comprovante de ' + E.I('pagamento'),
    E.P((es ? 'Pago confirmado el ' : 'Pagamento confirmado em ') + new Date(o.pagoTs || o.ts).toLocaleDateString(es ? 'es-PY' : 'pt-BR', { timeZone: 'America/Asuncion' }) + '.') +
    E.tabela(L) + E.ROT('<span style="display:block;margin-top:22px">' + (es ? 'TU TOKEN' : 'SEU TOKEN') + '</span>') + E.codigo(o.tok, 0.12, 32) +
    E.PQ(es ? 'Para guardarlo: menú del navegador › Imprimir › Guardar como PDF.' : 'Para guardar: menu do navegador › Imprimir › Salvar como PDF.'));
}
// 63b (S409): pedido cancelado — e-mail SÓ para pedido que já estava PAGO (reserva vencida ou cancelada antes de pagar não manda nada:
// o cliente vê "Reserva cancelada" em Minha conta; evita spam e o limite de 100 e-mails/dia)
function cancelado(o) {
  const es = o.lang === 'es', n = pn(o);
  const L = o.itens.map((i) => itemLinha(i, es));
  L.push(E.linha('Total', valor(o), true));
  return {
    to: o.email,
    subject: (es ? 'Tu pedido ' : 'Seu pedido ') + o.cod + (es ? ' fue cancelado' : ' foi cancelado'),
    html: E.molde(es ? 'Pedido ' + E.I('cancelado') : 'Pedido ' + E.I('cancelado'),
      E.P((es ? 'Hola' : 'Olá') + (n ? ', ' + n : '') + '. ' + (es ? 'Tu pedido fue cancelado.' : 'O seu pedido foi cancelado.')) +
      '<div style="text-align:center;font:13px ' + E.SA + ';color:' + E.S + ';letter-spacing:.06em;margin:0 0 6px">PEDIDO ' + E.esc(o.cod) + ' · ' + data(o, es) + '</div>' + E.tabela(L) +
      E.PQ(es ? 'Como ya habías pagado, hablá con la tienda: lo resolvemos enseguida.' : 'Como você já tinha pago, fale com a loja: resolvemos na hora.') +
      E.B(es ? 'Hablar con la tienda por WhatsApp' : 'Falar com a loja no WhatsApp', 'https://wa.me/595983642241') + E.LK(es ? 'Ver el catálogo' : 'Ver o catálogo', 'https://lafouch.com')),
    text: (es ? 'Tu pedido ' : 'Seu pedido ') + o.cod + (es ? ' fue cancelado.' : ' foi cancelado.'),
  };
}
// pedido cancelado: manda o 63b só se já estava pago; a cópia não serve mais
async function aoCancelar(db, id, envia) {
  const o = await db.get(id);
  if (!o) return { ok: true, fora: true };
  let enviou = false;
  if (o.pago && envia && !o.canc) { try { await db.muda(id, { canc: true }); await envia(cancelado(o)); enviou = true; } catch (e) {} }
  await db.apaga(id);
  return { ok: true, enviou };
}
module.exports = { copia, recebido, pago, cancelado, aoCriar, aoPagar, aoCancelar, comprovante, valor };
