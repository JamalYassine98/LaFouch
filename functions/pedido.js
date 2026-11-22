// S3 parte 1 (aprovado 20/11/2026; esboço privado S6S3; nenhuma tela muda — regra 6b): o site entrega pedido, comprovante,
// cancelamento e "avise-me" pela nuvem, em vez de gravar direto no banco. A nuvem confere o formato (as mesmas regras que o
// firestore.rules tinha), põe limite por rede e por telefone, e só aceita comprovante/cancelamento de um pedido que ela recebeu
// e que ainda não foi pago. O app continua lendo pedidos/ do mesmo jeito.
// Regra pura: db = { existe(id), pedidoSeu(ref) -> {pago, cancelado}|null, conta(chave, agora) -> n na hora, cria(id, doc) -> true|false (já existia) }
'use strict';
const { Falha } = require('./falha');

const { HORA, LIMITE } = require('./rede'); // os números moram em rede.js (22/11: pedido 30 por rede, 5 por telefone)
const ID_OK = /^[A-Za-z0-9_-]{4,40}$/;
const CHAVES = {
  pedido: ['ts', 'nome', 'tel', 'lang', 'moeda', 'total', 'rosto', 'itens', 'pais', 'cod', 'ate', 'nac', 'doc', 'nasc', 'email', 'cidade', 'end', 'ent', 'endE', 'refE', 'depE', 'pag', 'uq', 'brl', 'pagar', 'teste', 'obsC', 'cup', 'cupd'],
  comp: ['tipo', 'ref', 'img', 'ts', 'cod'],
  cancel: ['tipo', 'ref', 'ts', 'cod'],
  avise: ['tipo', 'ref', 'nome', 'tel', 'pais', 'ts'],
};
const TEXTO = { nome: 80, tel: 30, email: 200, doc: 30, obsC: 200, endE: 300, refE: 200, depE: 80, cidade: 80, cod: 12, lang: 4, moeda: 4, rosto: 40, pais: 4, nac: 4, nasc: 12, end: 300, ent: 10, pag: 10, cup: 24 };
const so = (t) => String(t || '').replace(/\D/g, '');

// confere o documento: devolve o tipo, ou lança Falha('formato')
function confere(doc, id) {
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) throw new Falha('formato');
  const tipo = doc.tipo === undefined ? 'pedido' : doc.tipo;
  if (!CHAVES[tipo] || Object.keys(doc).some((k) => CHAVES[tipo].indexOf(k) < 0)) throw new Falha('formato');
  for (const k of Object.keys(TEXTO)) if (k in doc && (typeof doc[k] !== 'string' || doc[k].length >= TEXTO[k])) throw new Falha('formato');
  const refOk = (r) => typeof r === 'string' && r.length > 0 && r.length < 40;
  if (tipo === 'pedido') {
    if (!ID_OK.test(id) || typeof doc.nome !== 'string' || !doc.nome) throw new Falha('formato');
    if (!Array.isArray(doc.itens) || !doc.itens.length || doc.itens.length > 30 || JSON.stringify(doc.itens).length > 30000 || doc.itens.some((i) => !i || typeof i !== 'object' || !refOk(i.ref))) throw new Falha('formato');
    if ('total' in doc && !(typeof doc.total === 'number' && doc.total >= 0 && doc.total < 1e9)) throw new Falha('formato');
  } else if (!refOk(doc.ref)) throw new Falha('formato');
  if (tipo === 'comp' && (id !== doc.ref + 'c' || typeof doc.img !== 'string' || doc.img.length >= 900000)) throw new Falha('formato');
  if (tipo === 'cancel' && id !== doc.ref + 'x') throw new Falha('formato');
  if (tipo === 'avise' && (id !== 'av' + doc.ref + '-' + so(doc.tel) || typeof doc.nome !== 'string' || typeof doc.tel !== 'string')) throw new Falha('formato');
  return tipo;
}

async function entrega(db, b, agora, ipk) {
  const id = String(b.id || ''), doc = b.doc;
  if (!ID_OK.test(id)) throw new Falha('formato');
  const tipo = confere(doc, id);
  if (await db.existe(id)) return { ok: true, ja: true }; // tentou de novo depois de dar certo: igual a 1
  if (tipo === 'comp' || tipo === 'cancel') {
    const p = await db.pedidoSeu(doc.ref);
    if (!p) throw new Falha('pedido', 404); // comprovante/cancelamento de pedido que a nuvem nunca recebeu
    if (p.cancelado) throw new Falha('cancelado', 409);
    if (tipo === 'comp' && p.pago) throw new Falha('pago', 409);
  }
  // ipk vazio = rede da loja (o app do dono marcou): sem limite por rede
  if (ipk && (await db.conta(tipo + '_r' + ipk, agora)) > LIMITE[tipo]) throw new Falha('espera', 429);
  const tel = so(doc.tel).slice(-9);
  if (tipo === 'pedido' && tel.length >= 6 && (await db.conta('pedido_t' + tel, agora)) > LIMITE.tel) throw new Falha('espera', 429);
  await db.cria(id, Object.assign({}, doc, tipo === 'pedido' ? {} : { tipo }), tipo);
  return { ok: true };
}

module.exports = { confere, entrega, LIMITE, HORA, CHAVES };
