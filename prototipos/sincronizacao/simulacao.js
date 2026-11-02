// PROTÓTIPO ISOLADO (não faz parte do app nem do build).
// Prova, num "Firestore de mentira" com transações otimistas (como o real), que o desenho de
// reserva de estoque e de mesclagem entre aparelhos funciona. Rodar: node simulacao.js
'use strict';
const assert = require('assert');

// ---------- Firestore de mentira: versões + transação com repetição (igual ao real) ----------
class Banco {
  constructor() { this.docs = new Map(); this.agora = 1000000; this.atrasoMax = 5; }
  async espera() { await new Promise(r => setTimeout(r, Math.random() * this.atrasoMax)); }
  async transacao(fn, tentativas = 25) {
    for (let t = 0; t < tentativas; t++) {
      const lidos = new Map(), escritas = new Map();
      const tx = {
        get: async (id) => { await this.espera(); const d = this.docs.get(id); lidos.set(id, d ? d.v : 0); return d ? JSON.parse(JSON.stringify(d.data)) : null; },
        set: (id, data) => escritas.set(id, data),
      };
      let res;
      try { res = await fn(tx); } catch (e) { if (e.fatal) throw e; throw e; }
      await this.espera();
      // confirmação atômica: só vale se ninguém mexeu nos docs lidos
      let ok = true;
      for (const [id, v] of lidos) { const d = this.docs.get(id); if ((d ? d.v : 0) !== v) ok = false; }
      if (ok) { for (const [id, data] of escritas) { const d = this.docs.get(id); this.docs.set(id, { v: (d ? d.v : 0) + 1, data: JSON.parse(JSON.stringify(data)) }); } return res; }
    }
    throw new Error('muitas tentativas');
  }
  ler(id) { const d = this.docs.get(id); return d ? JSON.parse(JSON.stringify(d.data)) : null; }
  semear(id, data) { this.docs.set(id, { v: 1, data }); }
}

const PRAZO_MS = 10 * 60 * 1000; // 10 minutos (decisão do dono)
class Erro extends Error { constructor(m, cod) { super(m); this.cod = cod; this.fatal = true; } }

// ---------- "Cloud Function" do site: reservar / pagar / cancelar ----------
// estoque/<ref|cor> = { total, res: { <pedido>: { q, exp, pago } } }
// total = peças físicas da vitrine; disponível = total - soma das reservas ainda válidas (ou pagas)
function validas(res, agora) { return Object.entries(res || {}).filter(([, r]) => r.pago || r.exp > agora); }
function disponivel(e, agora) { return e.total - validas(e.res, agora).reduce((a, [, r]) => a + r.q, 0); }

async function reservar(db, pedido, itens) {
  const agora = db.agora; // no real: horário do SERVIDOR, nunca do celular do cliente
  return db.transacao(async (tx) => {
    const lidos = [];
    for (const it of itens) lidos.push([it, await tx.get('estoque/' + it.chave)]);
    for (const [it, e] of lidos) {
      if (!e) throw new Erro('produto inexistente', 'inexistente');
      const jaTem = e.res && e.res[pedido] ? e.res[pedido].q : 0; // idempotência: repetir o mesmo pedido não duplica
      if (disponivel(e, agora) + jaTem < it.q) throw new Erro('sem estoque: ' + it.chave, 'esgotado');
    }
    for (const [it, e] of lidos) { // tudo ou nada: só grava se TODOS os itens couberem
      e.res = e.res || {};
      for (const [k, r] of Object.entries(e.res)) if (!r.pago && r.exp <= agora) delete e.res[k]; // limpeza preguiçosa
      e.res[pedido] = { q: it.q, exp: agora + PRAZO_MS, pago: false };
      tx.set('estoque/' + it.chave, e);
    }
    return true;
  });
}
async function marcarPago(db, pedido, itens) { // dono confirma o pagamento: reserva deixa de expirar
  return db.transacao(async (tx) => {
    for (const it of itens) {
      const e = await tx.get('estoque/' + it.chave);
      if (!e || !e.res || !e.res[pedido]) throw new Erro('reserva expirou ou não existe', 'expirou');
      if (!e.res[pedido].pago && e.res[pedido].exp <= db.agora) throw new Erro('reserva expirou', 'expirou');
      e.res[pedido].pago = true; tx.set('estoque/' + it.chave, e);
    }
    return true;
  });
}
async function cancelar(db, pedido, itens) {
  return db.transacao(async (tx) => {
    for (const it of itens) { const e = await tx.get('estoque/' + it.chave); if (e && e.res && e.res[pedido]) { delete e.res[pedido]; tx.set('estoque/' + it.chave, e); } }
    return true;
  });
}
// venda no balcão (app): só vende o que não está reservado/pago online; baixa o total
async function vendaBalcao(db, chave, q) {
  return db.transacao(async (tx) => {
    const e = await tx.get('estoque/' + chave);
    if (disponivel(e, db.agora) < q) throw new Erro('peça reservada no site', 'reservada');
    e.total -= q; tx.set('estoque/' + chave, e); return true;
  });
}
// entrega de pedido pago: tira a reserva e baixa o total (a peça saiu da loja)
async function entregar(db, pedido, itens) {
  return db.transacao(async (tx) => {
    for (const it of itens) { const e = await tx.get('estoque/' + it.chave); e.total -= e.res[pedido].q; delete e.res[pedido]; tx.set('estoque/' + it.chave, e); }
    return true;
  });
}

// ---------- mesclagem entre aparelhos (offline): movimentos somam, nunca sobrescrevem ----------
function mesclarMovimentos(...listas) { // idempotente: o mesmo id de movimento nunca conta duas vezes
  const vistos = new Map();
  for (const l of listas) for (const m of l) if (!vistos.has(m.id)) vistos.set(m.id, m);
  return [...vistos.values()].sort((a, b) => a.ts - b.ts || (a.id < b.id ? -1 : 1));
}
function estoqueDe(base, movs) { return base + movs.reduce((a, m) => a + m.delta, 0); }
function novoGeradorId(aparelho) { let n = 0; return () => aparelho + '-' + String(++n).padStart(5, '0'); }

// ---------- testes ----------
let total = 0; const falhas = [];
async function teste(nome, fn) {
  total++;
  try { await fn(); console.log('  ok   ' + nome); } catch (e) { falhas.push(nome); console.log(' FALHA ' + nome + '\n        ' + e.message); }
}
const item = (chave, q = 1) => ({ chave, q });
const novoBanco = (estoque) => { const db = new Banco(); for (const [k, v] of Object.entries(estoque)) db.semear('estoque/' + k, { total: v, res: {} }); return db; };

(async () => {
  console.log('Reserva de estoque (site)');
  await teste('10 clientes ao mesmo tempo, 5 peças: exatamente 5 conseguem e 5 veem "esgotou"', async () => {
    for (let rodada = 0; rodada < 20; rodada++) {
      const db = novoBanco({ 'SL1|Preto': 5 });
      const r = await Promise.allSettled(Array.from({ length: 10 }, (_, i) => reservar(db, 'P' + i, [item('SL1|Preto')])));
      const ok = r.filter(x => x.status === 'fulfilled').length, esg = r.filter(x => x.status === 'rejected' && x.reason.cod === 'esgotado').length;
      assert.strictEqual(ok, 5, 'rodada ' + rodada + ': ok=' + ok); assert.strictEqual(esg, 5);
      assert.strictEqual(disponivel(db.ler('estoque/SL1|Preto'), db.agora), 0);
    }
  });
  await teste('pedido com vários itens é tudo ou nada (um item sem estoque não prende os outros)', async () => {
    const db = novoBanco({ A: 3, B: 0 });
    await assert.rejects(reservar(db, 'P1', [item('A'), item('B')]), e => e.cod === 'esgotado');
    assert.strictEqual(disponivel(db.ler('estoque/A'), db.agora), 3);
  });
  await teste('pedido de 3 peças quando restam 2 é recusado inteiro', async () => {
    const db = novoBanco({ A: 2 });
    await assert.rejects(reservar(db, 'P1', [item('A', 3)]), e => e.cod === 'esgotado');
  });
  await teste('repetir o mesmo pedido (internet ruim, clicou 2x) não reserva em dobro', async () => {
    const db = novoBanco({ A: 2 });
    await Promise.all([reservar(db, 'P1', [item('A')]), reservar(db, 'P1', [item('A')]), reservar(db, 'P1', [item('A')])]);
    assert.strictEqual(disponivel(db.ler('estoque/A'), db.agora), 1);
  });
  await teste('10 minutos sem pagar: a peça volta para o site; quem estava esperando consegue', async () => {
    const db = novoBanco({ A: 1 });
    await reservar(db, 'P1', [item('A')]);
    await assert.rejects(reservar(db, 'P2', [item('A')]), e => e.cod === 'esgotado');
    db.agora += PRAZO_MS - 1; await assert.rejects(reservar(db, 'P2', [item('A')]), e => e.cod === 'esgotado'); // ainda dentro do prazo
    db.agora += 2; await reservar(db, 'P2', [item('A')]); // passou dos 10 min
    assert.strictEqual(disponivel(db.ler('estoque/A'), db.agora), 0);
  });
  await teste('pedido PAGO não expira, mesmo depois de horas', async () => {
    const db = novoBanco({ A: 1 });
    await reservar(db, 'P1', [item('A')]); await marcarPago(db, 'P1', [item('A')]);
    db.agora += 5 * 3600 * 1000;
    await assert.rejects(reservar(db, 'P2', [item('A')]), e => e.cod === 'esgotado');
  });
  await teste('pagar depois dos 10 minutos (e peça já dada a outro) é recusado com aviso claro', async () => {
    const db = novoBanco({ A: 1 });
    await reservar(db, 'P1', [item('A')]); db.agora += PRAZO_MS + 1; await reservar(db, 'P2', [item('A')]);
    await assert.rejects(marcarPago(db, 'P1', [item('A')]), e => e.cod === 'expirou');
  });
  await teste('cliente cancela: a peça volta na hora', async () => {
    const db = novoBanco({ A: 1 });
    await reservar(db, 'P1', [item('A')]); await cancelar(db, 'P1', [item('A')]);
    await reservar(db, 'P2', [item('A')]);
  });
  await teste('entrega do pedido pago baixa o estoque uma vez só (e não sobra reserva)', async () => {
    const db = novoBanco({ A: 3 });
    await reservar(db, 'P1', [item('A')]); await marcarPago(db, 'P1', [item('A')]); await entregar(db, 'P1', [item('A')]);
    const e = db.ler('estoque/A'); assert.strictEqual(e.total, 2); assert.strictEqual(disponivel(e, db.agora), 2);
  });

  console.log('Loja física x site');
  await teste('balcão não vende a peça que está reservada/paga no site', async () => {
    const db = novoBanco({ A: 1 });
    await reservar(db, 'P1', [item('A')]);
    await assert.rejects(vendaBalcao(db, 'A', 1), e => e.cod === 'reservada');
  });
  await teste('balcão e site disputando a última peça: só um ganha, nunca os dois', async () => {
    for (let i = 0; i < 30; i++) {
      const db = novoBanco({ A: 1 });
      const r = await Promise.allSettled([reservar(db, 'P1', [item('A')]), vendaBalcao(db, 'A', 1)]);
      assert.strictEqual(r.filter(x => x.status === 'fulfilled').length, 1);
    }
  });
  await teste('20 compradores no site + 20 vendas no balcão para 10 peças: nunca passa de 10', async () => {
    const db = novoBanco({ A: 10 });
    const ops = []; for (let i = 0; i < 20; i++) { ops.push(reservar(db, 'P' + i, [item('A')])); ops.push(vendaBalcao(db, 'A', 1)); }
    const r = await Promise.allSettled(ops);
    const ok = r.filter(x => x.status === 'fulfilled').length; assert.strictEqual(ok, 10);
    const e = db.ler('estoque/A'); assert.ok(e.total >= 0 && disponivel(e, db.agora) >= 0);
  });

  console.log('Dois aparelhos, mesclagem');
  await teste('ids de venda nunca colidem entre aparelhos (celular, PC, tablet)', async () => {
    const g = ['CEL', 'PC1', 'TAB'].map(novoGeradorId); const ids = new Set();
    for (let i = 0; i < 1000; i++) g.forEach(f => ids.add(f()));
    assert.strictEqual(ids.size, 3000);
  });
  await teste('mesma venda recebida duas vezes (repetição de rede) conta uma só', async () => {
    const m = [{ id: 'CEL-00001', ts: 1, delta: -1 }];
    assert.strictEqual(estoqueDe(5, mesclarMovimentos(m, m, m)), 4);
  });
  await teste('dois aparelhos vendem offline, cada um uma peça: estoque soma -2 (e não -1 por sobrescrita)', async () => {
    const cel = [{ id: 'CEL-00001', ts: 10, delta: -1 }], pc = [{ id: 'PC1-00001', ts: 11, delta: -1 }];
    assert.strictEqual(estoqueDe(5, mesclarMovimentos(cel, pc)), 3);
    assert.strictEqual(estoqueDe(5, mesclarMovimentos(pc, cel)), 3); // a ordem não importa
  });
  await teste('vendem offline a MESMA última peça: estoque fica -1 e o conflito é detectado (não some)', async () => {
    const m = mesclarMovimentos([{ id: 'CEL-00001', ts: 10, delta: -1 }], [{ id: 'PC1-00001', ts: 11, delta: -1 }]);
    const e = estoqueDe(1, m); assert.strictEqual(e, -1); // o app deve mostrar "conflito de estoque: confira a peça"
  });
  await teste('mesclar em qualquer ordem e com repetições dá sempre o mesmo resultado', async () => {
    const mk = (ap, n) => Array.from({ length: n }, (_, i) => ({ id: ap + '-' + i, ts: i * 3 + ap.length, delta: i % 2 ? -1 : 2 }));
    const a = mk('CEL', 40), b = mk('PC1', 40), c = mk('TAB', 40);
    const x = JSON.stringify(mesclarMovimentos(a, b, c)), y = JSON.stringify(mesclarMovimentos(c, a, b, a, c)), z = JSON.stringify(mesclarMovimentos(b, c, a));
    assert.ok(x === y && y === z);
  });

  console.log(total - falhas.length + '/' + total + ' testes passaram' + (falhas.length ? '  |  FALHARAM: ' + falhas.join(', ') : ''));
  process.exit(falhas.length ? 1 : 0);
})();
