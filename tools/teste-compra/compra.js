// Teste de COMPRA de ponta a ponta na nuvem de verdade (21/11/2026, NUVEM; dono: "Faça 1 e 2").
// Faz o caminho de uma cliente como o site faz — reservar → mandar o pedido pela porta "pedido" → a nuvem conferir e criar a ficha →
// o "robô do banco" avisar o PIX com o valor exato → pago, peça segura, token de entrega → a cliente pedir o token com o telefone —
// e confere cada etapa. No fim APAGA tudo o que criou (pedido, ficha, reserva, token, marca do e-mail) e solta a peça.
// Roda no GitHub (workflow teste-compra), com a conta de publicação (sem chave guardada) e a chave do robô lida do Secret Manager.
// Aviso: o celular do dono recebe o aviso "Novo pedido … Teste automático" (é o caminho de verdade).
'use strict';
const crypto = require('crypto');
const Reserva = require('../../functions/reserva');

const B = 'https://southamerica-east1-lafouch-2f6bd.cloudfunctions.net';
const O = 'https://lafouch.com';
const ROBO = process.env.PIX_ROBO || '';
// a conta de publicação entra pelo GitHub (Workload Identity): o cliente do Firestore do Google lê esse tipo de credencial sozinho
const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore({ projectId: 'lafouch-2f6bd' });

let falhas = 0;
const ok = (c, t, extra) => { console.log((c ? '  ok     ' : '  FALHA  ') + t + (extra ? '  ' + extra : '')); if (!c) falhas++; return c; };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const post = async (f, body, h) => {
  const r = await fetch(B + '/' + f, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json', Origin: O }, h || {}), body: JSON.stringify(body) });
  let j = {}; try { j = await r.json(); } catch (e) {}
  return Object.assign({ http: r.status }, j);
};
async function ate(fn, ms) { const fim = Date.now() + ms; for (;;) { const v = await fn(); if (v || Date.now() > fim) return v; await espera(1500); } }

(async () => {
  const pid = 'tc' + Date.now().toString(36) + crypto.randomBytes(2).toString('hex');
  const mid = 'teste-compra-' + pid, tel = '0981' + String(Date.now()).slice(-6);
  let item = null;
  try {
    if (!ok(ROBO.length > 10, 'chave do robô lida do Secret Manager')) throw new Error('sem chave');
    // 1. uma peça do site com estoque e preço
    const cfg = (await db.doc('config/site').get()).data() || {};
    const cot = +((cfg.cotacao || {}).brl) || 1400;
    const ps = await db.collection('produtos').get();
    const p = ps.docs.map((d) => Object.assign({ ref: d.id }, d.data())).find((x) => +x.n > 0 && x.lib !== false && x.oculto !== true && x.aviso !== 'Esgotado' && Array.isArray(x.qs) && x.qs.some((q) => +q > 0) && !(+x.de > +x.n));
    if (!ok(!!p, 'achou uma peça com estoque no catálogo', p ? p.ref : '')) throw new Error('sem peça');
    const ci = p.qs.findIndex((q) => +q > 0), cor = (p.cn && p.cn[ci]) || '';
    item = { ref: p.ref, cor, q: 1 };
    const brl = Math.max(5, Math.round(+p.n / cot / 5) * 5); // o mesmo arredondamento do site (valorBRL)
    // 2. reservar
    const r1 = await post('reserva', { acao: 'reservar', pedido: pid, itens: [item], pag: 'pix' });
    ok(r1.ok === true && (r1.off || r1.exp > Date.now()), 'reservar a peça', JSON.stringify({ off: r1.off, motivo: r1.motivo }));
    // 3. mandar o pedido pela porta "pedido" (como o site, preço exato)
    const doc = { ts: Date.now(), nome: 'Teste automático (robô)', tel, pais: 'py', cod: pid.slice(-4).toUpperCase(), lang: 'pt', moeda: 'BRL', total: Math.round(+p.n), itens: [{ ref: p.ref, nome: p.nome || p.ref, q: 1, cor, preco: Math.round(+p.n) }], pag: 'pix', brl, ent: 'loja' };
    const r2 = await post('pedido', { id: pid, doc });
    ok(r2.ok === true, 'pedido entregue pela porta "pedido"', JSON.stringify(r2));
    // 4. a nuvem confere e cria a ficha com o valor exato
    const fi = await ate(async () => { const d = await db.doc('pixEspera/' + pid).get(); return d.exists ? d.data() : null; }, 45000);
    ok(!!fi && fi.conf === true && fi.moeda === 'brl' && fi.valor === brl * 100, 'a nuvem conferiu o pedido e guardou o valor exato', fi ? 'R$ ' + fi.valor / 100 : 'sem ficha');
    const sus = (await db.doc('reservas/' + pid).get()).data();
    ok(!(sus && sus.suspeito), 'o pedido não foi marcado suspeito', sus && sus.suspeito ? sus.suspeito : '');
    // 5. o "robô do banco" avisa o PIX com o valor exato
    const r3 = await post('pix', { banco: 'nubank', valor: brl.toFixed(2).replace('.', ','), mid, dkim: true, dom: 'nubank.com.br', nome: 'TESTE AUTOMATICO ROBO', hora: Date.now() }, { 'x-robo': ROBO });
    ok(r3.ok === true && r3.tipo === 'site' && r3.id === pid, 'o PIX achou o pedido pelo valor exato', JSON.stringify(r3));
    // 6. pago, peça segura e token
    const rs = (await db.doc('reservas/' + pid).get()).data() || {};
    ok(rs.pago === true && !('tok' in rs), 'pedido pago na página pública, sem o token nela');
    const tk = (await db.doc('reservasTok/' + pid).get()).data() || {};
    ok(!!tk.tok && tk.pixAuto && tk.pixAuto.mid === mid, 'token e dados do pagamento no lugar fechado');
    const es = (await db.doc('estoque/' + p.ref).get()).data() || { res: {} };
    ok(Object.values(es.res || {}).some((x) => x.h === Reserva.H(pid) && x.pago === true), 'a peça ficou segura como paga');
    // 7. a cliente pede o token com o telefone do pedido (e o telefone errado é recusado)
    const r4 = await post('reserva', { acao: 'token', pedido: pid, tel: '0999000000' });
    ok(r4.ok === false && r4.motivo === 'telefone', 'telefone errado não recebe o token');
    const r5 = await post('reserva', { acao: 'token', pedido: pid, tel });
    ok(r5.ok === true && r5.tok === tk.tok, 'telefone certo recebe o token');
    // 8. o mesmo aviso do banco de novo não paga duas vezes
    const r6 = await post('pix', { banco: 'nubank', valor: brl.toFixed(2).replace('.', ','), mid, dkim: true, dom: 'nubank.com.br' }, { 'x-robo': ROBO });
    ok(r6.ok === true && r6.repetido === true, 'o mesmo aviso do banco de novo = igual a 1');
  } catch (e) {
    ok(false, 'o teste parou no meio', String(e && e.message));
  } finally {
    // 9. limpar tudo o que o teste criou
    try {
      if (item) await Reserva.liberar(db, Date.now(), pid, [item.ref]).catch(() => {});
      const vis = 'pixVistos/' + crypto.createHash('sha256').update(mid).digest('hex').slice(0, 40);
      for (const c of ['pedidos/' + pid, 'pedidoIds/' + pid, 'pixEspera/' + pid, 'reservas/' + pid, 'reservasTok/' + pid, 'pedidoMail/' + pid, 'entregas/' + pid, vis]) await db.doc(c).delete().catch(() => {});
      const sp = await db.collection('pixSemPar').where('mid', '==', mid).get();
      for (const d of sp.docs) await d.ref.delete();
      const rest = await Promise.all(['pedidos/', 'pixEspera/', 'reservas/', 'reservasTok/'].map(async (c) => (await db.doc(c + pid).get()).exists));
      ok(!rest.some(Boolean), 'limpeza: nada do teste ficou no banco');
    } catch (e) { ok(false, 'limpeza', String(e && e.message)); }
    console.log(falhas ? 'compra: ' + falhas + ' falha(s)' : 'compra: tudo certo');
    process.exit(falhas ? 1 : 0);
  }
})();
