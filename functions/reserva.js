// Reserva de estoque do site (regra de negócio pura: não depende do Firebase, para dar para testar).
// Documento estoque/<ref> = { res: { "<código do pedido>~<cor>": { h, cor, q, exp, pago, comp } } } (h = código embaralhado; o número do pedido não fica público)
// Disponível de uma cor = qs[cor] (peças físicas publicadas pelo app em produtos/<ref>) − reservas válidas.
// Reserva válida = paga, ou ainda dentro do prazo (exp). Quem decide a hora é SEMPRE o servidor.
'use strict';

const PRAZO_MS = 30 * 60 * 1000; // PIX: 30 minutos para pagar (14/11/2026, dono: "permitir a reserva para 30 minutos"; antes 15)
const PRAZO_ITAU_MS = 30 * 60 * 1000; // Itaú (transferência): 30 minutos (07/11/2026)
const COMP_MS = 12 * 3600 * 1000; // comprovante enviado: segura a peça até o dono conferir
const MAX_ITENS = 30;
const MAX_Q = 20;

const { Falha } = require('./falha');

const norm = (s) => String(s || '').trim().toLowerCase();
// P1 (19/11/2026, aprovado): a lista pública estoque/<ref> NÃO leva mais o número do pedido — só um código embaralhado (h).
// O site só usa cor, q, exp e pago. (O formato antigo, com o número, foi convertido e saiu na parte 3 de 20/11.)
const H = (pid) => require('crypto').createHash('sha256').update('lf-res|' + String(pid || '')).digest('hex').slice(0, 20);
const chave = (pid, cor) => H(pid) + '~' + norm(cor);
const mesmo = (r, pid) => !!r && r.h === H(pid);
const valida = (r, agora) => !!r && (r.pago === true || +r.exp > agora);
// cópia da lista de reservas de um documento estoque/<ref> (para mexer sem alterar o lido)
const copia = (estq) => ({ res: Object.assign({}, (estq && estq.res) || {}) });
function acha(estq, pid, cor) {
  const res = (estq && estq.res) || {};
  const k = Object.keys(res).find((x) => mesmo(res[x], pid) && norm(res[x].cor) === norm(cor));
  return k ? res[k] : null;
}

// índice da cor em produtos/<ref>; produto de uma cor só aceita cor vazia
function idxCor(prod, cor) {
  const cn = Array.isArray(prod.cn) ? prod.cn : [];
  if (!cn.length) return norm(cor) === '' ? 0 : -1;
  if (norm(cor) === '') return cn.length === 1 ? 0 : -1;
  return cn.findIndex((c) => norm(c) === norm(cor));
}

function fisico(prod, idx) {
  if (Array.isArray(prod.qs) && prod.qs.length) return +prod.qs[idx] || 0;
  return idx === 0 ? +prod.est || 0 : 0;
}

function reservadoDe(estq, cor, agora, ignoraPid) {
  const res = (estq && estq.res) || {};
  return Object.keys(res).reduce((a, k) => {
    const r = res[k];
    if (!valida(r, agora) || norm(r.cor) !== norm(cor)) return a;
    if (ignoraPid && mesmo(r, ignoraPid)) return a;
    return a + (+r.q || 0);
  }, 0);
}

function limpa(estq, agora) {
  const res = copia(estq).res;
  Object.keys(res).forEach((k) => {
    if (!valida(res[k], agora)) delete res[k];
  });
  return { res };
}

// grava o documento; se não sobrou nenhuma reserva, apaga (a lista pública de reservas fica pequena)
function guarda(tx, db, ref, estq) {
  const alvo = db.collection('estoque').doc(ref);
  if (Object.keys((estq && estq.res) || {}).length) tx.set(alvo, estq);
  else tx.delete(alvo);
}

function confere(pid, itens) {
  if (!/^[A-Za-z0-9_-]{4,40}$/.test(String(pid || ''))) throw new Falha('pedido');
  if (!Array.isArray(itens) || !itens.length || itens.length > MAX_ITENS) throw new Falha('itens');
  return itens.map((i) => {
    const ref = String((i && i.ref) || '');
    const q = Math.round(+(i && i.q));
    if (!/^[A-Za-z0-9_.-]{1,40}$/.test(ref) || !(q >= 1 && q <= MAX_Q)) throw new Falha('itens');
    return { ref, cor: String((i && i.cor) || ''), q };
  });
}

// junta linhas iguais (mesmo ref+cor) para somar certo
function agrupa(itens) {
  const m = {};
  itens.forEach((i) => {
    const k = i.ref + '|' + norm(i.cor);
    if (m[k]) m[k].q += i.q;
    else m[k] = { ref: i.ref, cor: i.cor, q: i.q };
  });
  return Object.keys(m).map((k) => m[k]);
}

async function ligada(db) {
  const s = await db.collection('config').doc('site').get();
  const d = (s.exists && s.data()) || {};
  return d.reserva === true;
}

// -------- cliente (site): reservar / comprovante / cancelar --------
async function reservar(db, agora, pid, itensBrutos, opcoes) {
  const itens = agrupa(confere(pid, itensBrutos));
  const prazo = (opcoes && opcoes.ate) || agora + (opcoes && opcoes.pag === 'alias' ? PRAZO_ITAU_MS : PRAZO_MS);
  return db.runTransaction(async (tx) => {
    const lidos = [];
    for (const it of itens) {
      const pr = await tx.get(db.collection('produtos').doc(it.ref));
      const es = await tx.get(db.collection('estoque').doc(it.ref));
      lidos.push({ it, prod: pr.exists ? pr.data() : null, estq: es.exists ? es.data() : { res: {} } });
    }
    const falta = [];
    lidos.forEach(({ it, prod, estq }) => {
      if (!prod || prod.oculto === true || prod.lib === false) return falta.push({ ref: it.ref, cor: it.cor, motivo: 'indisponivel', disp: 0 });
      const idx = idxCor(prod, it.cor);
      if (idx < 0) return falta.push({ ref: it.ref, cor: it.cor, motivo: 'cor', disp: 0 });
      const disp = fisico(prod, idx) - reservadoDe(estq, it.cor, agora, pid);
      if (disp < it.q) falta.push({ ref: it.ref, cor: it.cor, motivo: 'esgotado', disp: Math.max(0, disp) });
    });
    if (falta.length) throw new Falha('esgotado', 409, { falta });
    lidos.forEach(({ it, estq }) => {
      const e = limpa(estq, agora);
      const k = chave(pid, it.cor);
      const atual = e.res[k];
      e.res[k] = { h: H(pid), cor: it.cor, q: it.q, exp: atual && atual.pago ? 0 : prazo, pago: !!(atual && atual.pago), comp: !!(atual && atual.comp) };
      guarda(tx, db, it.ref, e);
    });
    return { ok: true, exp: prazo };
  });
}

// cliente enviou o comprovante: a peça fica segura até o dono conferir (se ainda dá)
async function comprovante(db, agora, pid, itensBrutos) {
  const r = await reservar(db, agora, pid, itensBrutos, { ate: agora + COMP_MS });
  return r;
}

// soltar as reservas de um pedido. soQuemPode = só as que a cliente pode soltar sozinha (não paga e sem comprovante).
async function soltar(db, agora, pid, refs, soCliente) {
  const lista = Array.from(new Set((refs || []).map(String))).filter((r) => /^[A-Za-z0-9_.-]{1,40}$/.test(r));
  if (!/^[A-Za-z0-9_-]{4,40}$/.test(String(pid || '')) || !lista.length || lista.length > MAX_ITENS) throw new Falha('itens');
  return db.runTransaction(async (tx) => {
    const lidos = [];
    for (const ref of lista) {
      const es = await tx.get(db.collection('estoque').doc(ref));
      if (es.exists) lidos.push({ ref, e: es.data() });
    }
    let presas = 0;
    lidos.forEach(({ ref, e }) => {
      const res = copia(e).res;
      let mexeu = false;
      Object.keys(res).forEach((k) => {
        if (!mesmo(res[k], pid)) return;
        if (soCliente && (res[k].pago === true || res[k].comp === true)) { presas++; return; }
        delete res[k];
        mexeu = true;
      });
      if (mexeu) guarda(tx, db, ref, limpa({ res }, agora));
    });
    return presas ? { ok: true, presas } : { ok: true };
  });
}
// dono (app): solta tudo do pedido (cancelado, apagado ou entregue)
async function liberar(db, agora, pid, refs) {
  return soltar(db, agora, pid, refs, false);
}
// cliente (site, ação pública): só solta o que ainda não foi pago nem tem comprovante — o resto só o dono solta
async function cancelar(db, agora, pid, refs) {
  return soltar(db, agora, pid, refs, true);
}
// P1b (19/11/2026): reservas PAGAS de pedidos que o app não conhece mais (pedido apagado). Só o dono pede.
// conhecidos = códigos h dos pedidos que o app ainda tem; devolve [{ ref, h, cor, q }] das pagas que não são de nenhum deles.
async function orfas(db, refs, conhecidos) {
  const sabe = new Set((conhecidos || []).map(String)), out = [];
  for (const ref of refs || []) {
    const es = await db.collection('estoque').doc(ref).get();
    if (!es.exists) continue;
    const res = copia(es.data()).res;
    Object.keys(res).forEach((k) => {
      const r = res[k];
      if (r && r.pago === true && r.h && !sabe.has(r.h)) out.push({ ref, h: r.h, cor: r.cor || '', q: +r.q || 0 });
    });
  }
  return { ok: true, orfas: out };
}
// P1b: o dono solta pelo código h (o app não tem mais o número do pedido)
async function liberarH(db, agora, h, refs) {
  const lista = Array.from(new Set((refs || []).map(String))).filter((r) => /^[A-Za-z0-9_.-]{1,40}$/.test(r));
  if (!/^[0-9a-f]{20}$/.test(String(h || '')) || !lista.length || lista.length > MAX_ITENS) throw new Falha('itens');
  return db.runTransaction(async (tx) => {
    const lidos = [];
    for (const ref of lista) {
      const es = await tx.get(db.collection('estoque').doc(ref));
      if (es.exists) lidos.push({ ref, e: es.data() });
    }
    lidos.forEach(({ ref, e }) => {
      const res = copia(e).res;
      let mexeu = false;
      Object.keys(res).forEach((k) => {
        if (res[k] && res[k].h === h) { delete res[k]; mexeu = true; }
      });
      if (mexeu) guarda(tx, db, ref, limpa({ res }, agora));
    });
    return { ok: true };
  });
}
// 39 · preço exato (21/11): a reserva deste pedido ainda segura TODAS as peças (paga ou dentro do prazo)? — desempata pagamentos de mesmo valor
async function aberta(db, agora, pid, refs) {
  const lista = Array.from(new Set((refs || []).map(String)));
  if (!lista.length) return false;
  for (const ref of lista) {
    const es = await db.collection('estoque').doc(ref).get();
    const res = es.exists ? copia(es.data()).res : {};
    if (!Object.keys(res).some((k) => mesmo(res[k], pid) && valida(res[k], agora))) return false;
  }
  return true;
}
// limpeza diária: apaga as reservas vencidas de documentos parados que ninguém mexeu
async function arruma(db, agora, refs) {
  let mexidos = 0;
  for (const ref of refs || []) {
    await db.runTransaction(async (tx) => {
      const es = await tx.get(db.collection('estoque').doc(ref));
      if (!es.exists) return;
      const e = es.data(), novo = limpa(e, agora);
      if (JSON.stringify(novo) === JSON.stringify(e)) return;
      guarda(tx, db, ref, novo);
      mexidos++;
    });
  }
  return { mexidos };
}

// -------- dono (app): pagamento confirmado / comprovante recusado --------
async function pagar(db, agora, pid, itensBrutos) {
  const itens = agrupa(confere(pid, itensBrutos));
  return db.runTransaction(async (tx) => {
    const lidos = [];
    for (const it of itens) {
      const pr = await tx.get(db.collection('produtos').doc(it.ref));
      const es = await tx.get(db.collection('estoque').doc(it.ref));
      lidos.push({ it, prod: pr.exists ? pr.data() : null, estq: es.exists ? es.data() : { res: {} } });
    }
    const falta = [];
    lidos.forEach(({ it, prod, estq }) => {
      const r = acha(estq, pid, it.cor);
      if (r && (r.pago || valida(r, agora))) return; // já está segura
      if (!prod) return falta.push({ ref: it.ref, cor: it.cor, motivo: 'indisponivel', disp: 0 });
      const idx = idxCor(prod, it.cor);
      const disp = idx < 0 ? 0 : fisico(prod, idx) - reservadoDe(estq, it.cor, agora, pid);
      if (disp < it.q) falta.push({ ref: it.ref, cor: it.cor, motivo: 'expirou', disp: Math.max(0, disp) });
    });
    if (falta.length) throw new Falha('expirou', 409, { falta });
    lidos.forEach(({ it, estq }) => {
      const e = limpa(estq, agora);
      e.res[chave(pid, it.cor)] = { h: H(pid), cor: it.cor, q: it.q, exp: 0, pago: true, comp: true };
      guarda(tx, db, it.ref, e);
    });
    return { ok: true };
  });
}

// comprovante recusado: volta a valer só pelo prazo normal (a cliente manda outro)
async function recusar(db, agora, pid, refs) {
  const lista = Array.from(new Set((refs || []).map(String))).filter((r) => /^[A-Za-z0-9_.-]{1,40}$/.test(r));
  if (!lista.length) throw new Falha('itens');
  return db.runTransaction(async (tx) => {
    const lidos = [];
    for (const ref of lista) {
      const es = await tx.get(db.collection('estoque').doc(ref));
      if (es.exists) lidos.push({ ref, e: es.data() }); // o Firestore exige ler tudo antes de gravar
    }
    lidos.forEach(({ ref, e }) => {
      let mexeu = false;
      Object.keys(e.res || {}).forEach((k) => {
        const r = e.res[k];
        if (mesmo(r, pid)) {
          r.pago = false;
          r.comp = false;
          r.exp = agora + PRAZO_MS;
          mexeu = true;
        }
      });
      if (mexeu) guarda(tx, db, ref, limpa(e, agora));
    });
    return { ok: true };
  });
}

module.exports = { aberta, PRAZO_MS, COMP_MS, Falha, H, ligada, reservar, comprovante, liberar, cancelar, arruma, orfas, liberarH, pagar, recusar, disponivel: (prod, estq, cor, agora) => {
  const idx = idxCor(prod, cor);
  return idx < 0 ? 0 : fisico(prod, idx) - reservadoDe(estq, cor, agora);
} };
