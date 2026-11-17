// S409 (17/11/2026) — presente especial e conferência do pedido no SERVIDOR (ordem do dono: "cupons são coisa delicada; o servidor confere tudo").
// Regra pura (testes em teste-presente.js). Preços: o "n" (preço do site, em Gs.), "de" (preço cheio quando está em OFERTA), "cmx" (maior % de
// cupom que a peça aguenta) vêm de produtos/{ref}. O piso vem de pisos/{ref}.p (só o servidor e o app leem; nunca vai para o site).
// Regras aprovadas pelo dono:
//   · o presente só vale com uma peça PAGA no carrinho, fora de OFERTA (peça em OFERTA não libera o presente);
//   · a peça de presente pode ser qualquer uma, inclusive em OFERTA (vale o preço de oferta), de valor ATÉ o da peça paga mais cara
//     (Cliente VIP: até 20% a mais), e o valor pago tem de cobrir o piso das duas (nunca prejuízo); sem piso cadastrado = não pode ser presente;
//   · no máximo 1 peça de presente, quantidade 1; um cartão por pedido; trocar de cartão tira a peça de presente (o site faz; aqui só se confere).
const ofe = (p) => !!(p && +p.de > +p.n);
const esg = (p) => !p || p.aviso === 'Esgotado' || p.oculto === true || p.lib === false;
const VIP_A_MAIS = 0.2;

// peças que podem ser presente para um carrinho com estas peças pagas (refs). pisos[ref] = piso em Gs. (mesma unidade do "n")
function podeSer(prods, pisos, pagas, vip) {
  const P = (pagas || []).map((r) => prods[r]).filter((p) => p && !esg(p) && !ofe(p) && +p.n > 0);
  if (!P.length) return { ok: false, motivo: 'sem-paga', refs: [] };
  const maior = P.reduce((a, p) => (+p.n > +a.n ? p : a), P[0]);
  const pz = pisos[maior.ref];
  if (!(pz > 0)) return { ok: false, motivo: 'sem-piso', refs: [] };
  const lim = Math.floor(+maior.n * (vip ? 1 + VIP_A_MAIS : 1)), folga = +maior.n - pz; // o que a peça paga deixa acima do piso dela
  const refs = Object.keys(prods).filter((r) => {
    const g = prods[r];
    if (!g || esg(g) || !(+g.n > 0) || !(pisos[r] > 0)) return false;
    return +g.n <= lim && pisos[r] <= folga; // a folga da paga cobre o piso do presente → pago ≥ piso(paga) + piso(presente)
  });
  return { ok: true, lim, refs };
}

// confere o pedido do site: devolve { ok, minimo, total, motivos[] }. ok=false = valor abaixo do mínimo possível ou presente fora da regra.
// cup = o cartão usado (do servidor: { tipo, pct }) ou null; vip = o cliente é Cliente VIP
function confere(f, prods, pisos, cup, vip) {
  const mot = [], it = Array.isArray(f && f.itens) ? f.itens : [];
  let bruto = 0;
  for (const i of it) {
    const p = prods[i && i.ref];
    if (!p) { mot.push('peça desconhecida ' + (i && i.ref)); continue; }
    bruto += +p.n * Math.max(1, +i.q || 1);
  }
  const frete = +((/frete Gs\. ([\d.]+)/.exec(String((f && f.obsC) || '')) || [])[1] || '0').replace(/\./g, '');
  let desc = 0;
  const pres = it.filter((i) => i && i.pres);
  if (pres.length) {
    if (!cup || cup.tipo !== 'pe') mot.push('peça de presente sem o presente especial');
    if (pres.length > 1 || (+pres[0].q || 1) !== 1) mot.push('mais de uma peça de presente');
    const pagas = it.filter((i) => i && !i.pres).map((i) => i.ref), g = pres[0] && pres[0].ref;
    const pode = podeSer(prods, pisos, pagas, vip);
    if (!pode.ok) mot.push('presente sem peça paga que libere (' + pode.motivo + ')');
    else if (pode.refs.indexOf(g) < 0) mot.push('presente acima do permitido (' + g + ')');
    if (prods[g]) desc = +prods[g].n;
  } else if (cup && cup.tipo === 'pe') mot.push('presente especial sem peça de presente');
  else if (cup && +cup.pct > 0) {
    for (const i of it) {
      const p = prods[i && i.ref];
      if (!p || esg(p) || ofe(p) || (+p.cmx || 0) < +cup.pct) continue; // OFERTA e peça que não aguenta o % ficam fora
      desc += Math.floor((+p.n * +cup.pct) / 100 / 1000) * 1000 * Math.max(1, +i.q || 1);
    }
  }
  const minimo = bruto - desc + frete, total = +(f && f.total) || 0;
  if (total < minimo - 1000) mot.push('valor abaixo do mínimo: ' + total + ' < ' + minimo);
  return { ok: !mot.length, minimo, total, desc, bruto, motivos: mot };
}
module.exports = { podeSer, confere, ofe, VIP_A_MAIS };
