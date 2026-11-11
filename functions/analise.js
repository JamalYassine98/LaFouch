// Analisador do painel (11/11/2026): contagens ANÔNIMAS por visita (sem nome, e-mail, telefone ou endereço).
// Cada visita manda um resumo ao sair do site; o painel lê só os totais.
//   db.salva(id, o) / db.desde(ts) -> [o]
class Falha extends Error { constructor(m, s) { super(m); this.motivo = m; this.status = s || 400; } }
const REF_OK = /^[A-Za-z0-9._-]{1,30}$/;
const ID_OK = /^v[a-z0-9]{8,24}$/;
const TEMAS = ['', 'natal', 'halloween', 'bf', 'anonovo', 'maes', 'pais'];
function conta(m, max) {
  const o = {}; let n = 0;
  if (!m || typeof m !== 'object') return o;
  for (const k of Object.keys(m)) { if (n >= 60) break; if (!REF_OK.test(k)) continue; const v = Math.min(max || 50, Math.max(0, Math.round(+m[k] || 0))); if (v) { o[k] = v; n++; } }
  return o;
}
function termo(t) { return String(t == null ? '' : t).toLowerCase().replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40); }
function limpa(b, agora) {
  if (!ID_OK.test(String(b.id || ''))) throw new Falha('id');
  const bus = (Array.isArray(b.b) ? b.b : []).slice(0, 12).map((x) => ({ t: termo(x && x.t), n: Math.min(99, Math.max(0, Math.round(+(x && x.n) || 0))) })).filter((x) => x.t.length >= 2);
  return {
    ts: agora,
    v: conta(b.v), c: conta(b.c, 20), f: conta(b.f, 5), b: bus,
    mo: b.mo ? 1 : 0, ro: b.ro ? 1 : 0, at: b.at ? 1 : 0, pe: b.pe ? 1 : 0, ck: b.ck ? 1 : 0,
    lang: b.lang === 'es' ? 'es' : 'pt', dev: b.dev === 'pc' ? 'pc' : 'cel', ev: TEMAS.indexOf(b.ev) >= 0 ? b.ev : '',
  };
}
async function registra(db, b, agora) { const o = limpa(b, agora); await db.salva(b.id, o); return { ok: true }; }
function top(m, n) { return Object.keys(m).map((k) => [k, m[k]]).sort((a, b) => b[1] - a[1]).slice(0, n || 50); }
function resume(L) {
  const R = { visitas: L.length, cel: 0, pc: 0, es: 0, pt: 0, vistas: 0, carrinho: 0, favoritos: 0, pedidos: 0, checkout: 0, mochi: 0, rosto: 0, atacado: 0,
    peca: {}, cart: {}, fav: {}, busca: {}, semRes: {}, ev: {}, dias: {} };
  for (const o of L) {
    R[o.dev === 'pc' ? 'pc' : 'cel']++; R[o.lang === 'es' ? 'es' : 'pt']++;
    for (const k in o.v || {}) { R.peca[k] = (R.peca[k] || 0) + o.v[k]; R.vistas += o.v[k]; }
    for (const k in o.c || {}) { R.cart[k] = (R.cart[k] || 0) + o.c[k]; R.carrinho += o.c[k]; }
    for (const k in o.f || {}) { R.fav[k] = (R.fav[k] || 0) + 1; R.favoritos++; }
    for (const x of o.b || []) { R.busca[x.t] = (R.busca[x.t] || 0) + 1; if (!x.n) R.semRes[x.t] = (R.semRes[x.t] || 0) + 1; }
    R.mochi += o.mo || 0; R.rosto += o.ro || 0; R.atacado += o.at || 0; R.pedidos += o.pe || 0; R.checkout += o.ck || 0;
    if (o.ev) R.ev[o.ev] = (R.ev[o.ev] || 0) + 1;
    const d = new Date(o.ts).toISOString().slice(0, 10); R.dias[d] = (R.dias[d] || 0) + 1;
  }
  const vistoSemCart = {}; for (const k in R.peca) if (!R.cart[k]) vistoSemCart[k] = R.peca[k];
  return { ok: true, visitas: R.visitas, cel: R.cel, pc: R.pc, pt: R.pt, es: R.es, vistas: R.vistas, carrinho: R.carrinho, favoritos: R.favoritos, checkout: R.checkout, pedidos: R.pedidos,
    mochi: R.mochi, rosto: R.rosto, atacado: R.atacado, eventos: R.ev, dias: R.dias,
    pecas: top(R.peca), carts: top(R.cart), favs: top(R.fav), buscas: top(R.busca), semResultado: top(R.semRes), vistasSemCarrinho: top(vistoSemCart) };
}
async function resumo(db, dias, agora) { const d = [7, 30, 90].indexOf(+dias) >= 0 ? +dias : 7; return Object.assign(resume(await db.desde(agora - d * 864e5)), { dias_periodo: d }); }
module.exports = { Falha, limpa, registra, resume, resumo };
