// S191 v2 (aprovado 12/11/2026): Conta Atacadista/Mayorista.
// O dono cria no app (Clientes): conta ASSOCIADA (cliente da loja, não vence, 3 aparelhos por padrão, editável;
// o cliente pode trocar de aparelho se "Cliente pode trocar aparelho" estiver ligado — o dono é avisado; +2 trocas em
// 30 dias = aviso "Bloquear trocas") ou CONVITE de visitante (vence em 3 dias, 3 aparelhos, o cliente NÃO remove aparelho).
// Pausar = some o catálogo, nada é apagado. Cancelar = apaga o acesso.
// O cliente entra pelo link lafouch.com/atacado?c=ID, confirma o e-mail com código de 6 números e vê os preços da
// tabela dele (que NÃO aparecem no site público) com marca d'água; o pedido chega no app.
// Regra pura: o banco vem por "db", o e-mail por "envia". Datas em ms.
'use strict';
const crypto = require('crypto');
class Falha extends Error { constructor(m, s) { super(m); this.motivo = m; this.status = s || 400; } }
const DIA = 864e5, VALE_COD = 10 * 60000, TENT = 5, TROCAS_AVISO = 2;
const limpa = (t, n) => String(t == null ? '' : t).replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const emN = (e) => limpa(e, 200).toLowerCase();
const h = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');
const devN = (d) => limpa(d, 60).replace(/[^A-Za-z0-9_-]/g, '');
function estado(c, agora) {
  if (!c || c.cancelada) return 'cancelada';
  if (c.pausada) return 'pausada';
  if (c.tipo === 'visita' && c.fim && agora > c.fim) return 'vencida';
  return '';
}
// 1) e-mail → código de 6 números (só se o e-mail é o da conta)
async function entrar(db, envia, b, agora, rnd) {
  const id = limpa(b.c, 40), em = emN(b.email), c = id ? await db.get(id) : null;
  const e = estado(c, agora);
  if (e) return { ok: false, motivo: e };
  if (!em || emN(c.email) !== em) return { ok: false, motivo: 'email' };
  if (c.codTs && agora - c.codTs < 45000) return { ok: false, motivo: 'espera' };
  const cod = String((rnd != null ? rnd : crypto.randomInt(0, 1e6))).padStart(6, '0');
  await db.muda(id, { codH: h(id + ':' + cod), codTs: agora, codT: 0 });
  if (envia) await envia({ to: c.email, subject: 'La Fouch · tu código ' + cod, html: '<p>Tu código para entrar al catálogo mayorista de La Fouch: <b style="font-size:22px;letter-spacing:3px">' + cod + '</b></p><p>Vale 10 minutos.</p>' });
  return { ok: true };
}
// 2) código + aparelho → token (aparelho novo entra se houver lugar; associada com troca ligada também troca o mais antigo? NÃO: o cliente remove em "Meus aparelhos")
async function confirma(db, aviso, b, agora, rndTok) {
  const id = limpa(b.c, 40), c = id ? await db.get(id) : null, e = estado(c, agora);
  if (e) return { ok: false, motivo: e };
  if (!c.codH || agora - c.codTs > VALE_COD) return { ok: false, motivo: 'vencido' };
  if ((c.codT || 0) >= TENT) return { ok: false, motivo: 'tentativas' };
  if (h(id + ':' + limpa(b.cod, 6)) !== c.codH) { await db.muda(id, { codT: (c.codT || 0) + 1 }); return { ok: false, motivo: 'codigo' }; }
  const dev = devN(b.dev);
  if (!dev) throw new Falha('dev');
  const ap = (c.aparelhos || []).slice();
  let a = ap.find((x) => x.id === dev);
  if (!a) {
    if (ap.length >= (c.dispMax || 3)) { await db.muda(id, { codH: '' }); return { ok: false, motivo: 'cheio', aparelhos: ap.map(pub) }; }
    a = { id: dev, nome: limpa(b.devNome, 40) || 'Aparelho', ts: agora, ult: agora };
    ap.push(a);
    if (ap.length > 1 && aviso) await aviso({ ts: agora, conta: id, nome: c.nome || '', t: 'aparelho', d: 'novo aparelho: ' + a.nome });
  }
  const tok = rndTok || crypto.randomBytes(18).toString('hex');
  a.tokH = h(tok);
  a.ult = agora;
  await db.muda(id, { aparelhos: ap, codH: '' });
  return { ok: true, tok, conta: resumo(c, ap, dev) };
}
const pub = (a) => ({ id: a.id, nome: a.nome, ts: a.ts, ult: a.ult });
function resumo(c, ap, dev) {
  return { nome: c.nome || '', tipo: c.tipo, fim: c.fim || 0, dispMax: c.dispMax || 3, podeRemover: c.tipo !== 'visita' && c.trocaOk !== false, aparelhos: (ap || c.aparelhos || []).map(pub), este: dev || '' };
}
async function sessao(db, b, agora) {
  const id = limpa(b.c, 40), c = id ? await db.get(id) : null, e = estado(c, agora);
  if (e) return { e };
  const dev = devN(b.dev), a = (c.aparelhos || []).find((x) => x.id === dev);
  if (!a || !b.tok || a.tokH !== h(b.tok)) return { e: 'sessao' };
  return { c, id, dev, a };
}
// 3) catálogo com os preços da tabela (visitante: só as peças marcadas)
async function catalogo(db, b, agora) {
  const s = await sessao(db, b, agora);
  if (s.e) return { ok: false, motivo: s.e };
  const P = (await db.precos(s.c.tab || 'a1')) || { itens: {} }, so = s.c.tipo === 'visita' && Array.isArray(s.c.refs) && s.c.refs.length ? s.c.refs : null;
  const itens = Object.keys(P.itens || {}).filter((r) => !so || so.indexOf(r) >= 0).map((r) => Object.assign({ ref: r }, P.itens[r]));
  const ap = (s.c.aparelhos || []).map((x) => (x.id === s.dev ? Object.assign({}, x, { ult: agora }) : x));
  await db.muda(s.id, { aparelhos: ap });
  return { ok: true, conta: resumo(s.c, ap, s.dev), tabela: P.nome || '', minimo: P.min || 0, ts: P.ts || 0, itens };
}
// 4) o cliente remove um aparelho (só associada com troca ligada); o dono é avisado; +2 trocas em 30 dias = aviso forte
async function remove(db, aviso, b, agora) {
  const s = await sessao(db, b, agora);
  if (s.e) return { ok: false, motivo: s.e };
  if (s.c.tipo === 'visita' || s.c.trocaOk === false) return { ok: false, motivo: 'bloqueado' };
  const alvo = devN(b.alvo), ap = (s.c.aparelhos || []).filter((x) => x.id !== alvo);
  if (ap.length === (s.c.aparelhos || []).length) return { ok: false, motivo: 'nao' };
  const trocas = (s.c.trocas || []).filter((t) => agora - t < 30 * DIA).concat([agora]);
  await db.muda(s.id, { aparelhos: ap, trocas });
  if (aviso) await aviso({ ts: agora, conta: s.id, nome: s.c.nome || '', t: trocas.length > TROCAS_AVISO ? 'trocas' : 'troca', d: 'trocou de aparelho (' + trocas.length + ' em 30 dias)' });
  return { ok: true, conta: resumo(s.c, ap, s.dev) };
}
// 5) pedido do lojista → chega no app (Pedidos › Atacado)
async function pedido(db, b, agora) {
  const s = await sessao(db, b, agora);
  if (s.e) return { ok: false, motivo: s.e };
  const P = (await db.precos(s.c.tab || 'a1')) || { itens: {} };
  let tot = 0, pcs = 0;
  const L = (Array.isArray(b.itens) ? b.itens : []).slice(0, 200).map((x) => {
    const r = limpa(x.ref, 30), it = (P.itens || {})[r], q = Math.max(0, Math.min(999, Math.round(+x.q || 0)));
    if (!it || !q) return null;
    tot += q * (+it.usd || 0); pcs += q;
    return { ref: r, cor: limpa(x.cor, 40), grau: limpa(x.grau, 10), q, usd: +it.usd || 0 };
  }).filter(Boolean);
  if (!L.length) return { ok: false, motivo: 'vazio' };
  if (P.min && tot + 1e-9 < P.min) return { ok: false, motivo: 'minimo', falta: Math.round((P.min - tot) * 100) / 100 };
  const pid = 'A' + agora.toString(36);
  await db.pedido(pid, { ts: agora, conta: s.id, nome: s.c.nome || '', tel: s.c.tel || '', email: s.c.email || '', tab: s.c.tab || '', itens: L, usd: Math.round(tot * 100) / 100, pecas: pcs, obs: limpa(b.obs, 300), st: 'novo' });
  return { ok: true, pid, usd: Math.round(tot * 100) / 100, pecas: pcs };
}
module.exports = { Falha, estado, entrar, confirma, catalogo, remove, pedido, TROCAS_AVISO };
