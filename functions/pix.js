// S197 (aprovado 12/11/2026): PIX automático por e-mail, sem API e sem notificação no celular.
// O Nubank manda "Você recebeu uma transferência" (remetente todomundo@nubank.com.br) para o e-mail pessoal do dono;
// um filtro do Gmail encaminha para lafouch.eyewear@gmail.com; o robô (Google Apps Script, work/pix/robo-pix.gs) lê,
// confere remetente + DKIM do nubank.com.br e chama a função "pix" com a chave secreta PIX_ROBO.
// Esta regra (pura: o banco vem por "db") acha o pedido pelo VALOR (veja recebe/acha abaixo); nada ou mais de um candidato
// → vai para "pixSemPar" (o guardião do app avisa; nunca confirma no chute).
const { Falha } = require('./falha');
const H = 36e5;
const SITE_H = 48, LOJA_H = 2;
const cent = (v) => Math.round(Number(String(v).replace(/[^\d.,-]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')) * 100);
// "R$ 1.234,56" | "1234,56" | "1234.56" → centavos (inteiro) ou NaN
function centavos(t) {
  const s = String(t == null ? '' : t).trim();
  if (!/\d/.test(s)) return NaN;
  const c = cent(s);
  return Number.isFinite(c) && c > 0 && c < 1e9 ? c : NaN;
}
// e-mail do Nubank: tira o valor do assunto/corpo ("...transferência de R$ 123,45...")
function valorDoTexto(t) {
  const m = /R\$\s*([\d.]+,\d{2})/.exec(String(t || ''));
  return m ? centavos(m[1]) : NaN;
}
// Itaú Paraguay (13/11/2026): e-mail "Aviso de transferencia recibida" de info@itau.com.py, "Moneda y Monto: Gs. 1.000"
function gsDoTexto(t) {
  const m = /Monto:?\s*(?:Gs\.?|PYG)\s*([\d.]+)/i.exec(String(t || ''));
  return m ? +m[1].replace(/\./g, '') : NaN;
}
const gsInt = (v) => { const g = Math.round(+String(v).replace(/\./g, '')); return g > 0 && g < 1e10 ? g : NaN; };
// Os bancos (uma regra só para todos, 20/11/2026): de onde vem o e-mail e em que moeda vem o valor.
// Banco Familiar / Eko (14/11/2026, no lugar do Itaú): "Moneda y Monto: PYG 200.000"; as esperas da loja gravadas como 'itau' valem para os dois.
const BANCOS = {
  nubank: { dom: /(^|\.)nubank\.com\.br$/i, moeda: 'brl', valor: centavos },
  itau: { dom: /(^|\.)itau\.com\.py$/i, moeda: 'gs', valor: gsInt },
  familiar: { dom: /(^|\.)familiar\.com\.py$/i, moeda: 'gs', valor: gsInt },
};
// nomes iguais = 2 ou mais palavras (3+ letras, sem acento, sem "de/da/dos") em comum entre o cliente do pedido e o pagador do banco
function palavras(n) { return String(n || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2 && !/^(dos|das|del|los|las)$/.test(w)); }
function mesmoNome(a, b) { const x = palavras(a), y = palavras(b); return x.filter((w, i) => x.indexOf(w) === i && y.indexOf(w) >= 0).length >= 2; }

// Acha o pedido de um pagamento (39 · preço exato, aprovado 21/11 07:51). db.fichas = os pedidos do site CONFERIDOS PELO SERVIDOR
// (o valor a pagar é o preço do carrinho, conferido por ele e guardado num lugar que o app não apaga):
// { id, moeda, valor (centavos ou Gs.), nome, ts, aberta (a reserva ainda segura as peças), pago }.
//  · só o VALOR EXATO acha o pedido (a mais ou a menos nunca confirma sozinho: o dono liga na mão, ação 'ligar');
//  · vários do mesmo valor: vale o único com a reserva aberta; depois o nome e a hora DESEMPATAM (14/11, dono): pedido criado depois
//    do pagamento não é dele; vale o único com 2+ nomes iguais aos do pagador; senão o único feito nos 40 min antes;
//  · o que sobra vai para "sem par" com o MOTIVO: 'sem-pedido' (nenhum), 'empate' (mais de um), 'sem-peca' (a peça já foi vendida);
//  · venda da loja (app): espera registrada nas últimas 2 h com o valor redondo.
async function recebe(db, b, agora) {
  const bc = BANCOS[b.banco] ? b.banco : 'nubank', B = BANCOS[bc];
  const v = B.valor(b.valor);
  if (!Number.isFinite(v)) throw new Falha('valor');
  const mid = String(b.mid || '').slice(0, 120);
  if (!mid) throw new Falha('mid');
  if (b.dkim !== true || !B.dom.test(String(b.dom || ''))) throw new Falha('origem', 403);
  if (await db.jaVisto(mid)) return { ok: true, repetido: true };
  await db.visto(mid, agora);
  // tudo ou nada: se der erro no meio, o e-mail deixa de contar como visto e o robô tenta de novo (antes o pagamento sumia sem aviso)
  try { return await acha(db, bc, B.moeda, v, mid, b, agora); } catch (e) { await db.desvisto(mid).catch(() => {}); throw e; }
}
async function acha(db, bc, moeda, v, mid, b, agora) {
  const hr = +b.hora > agora - 72 * H && +b.hora < agora + 10 * 60e3 ? +b.hora : 0;
  const de = String(b.nome || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const antes = (p) => !hr || !(+p.ts > 0) || +p.ts <= hr + 2 * 60e3;
  const valor = moeda === 'brl' ? v / 100 : v; // como o app mostra: reais com centavos ou guaranis
  const base = Object.assign({ valor, moeda, banco: bc, mid, ts: agora }, de ? { de } : {});
  const semPar = async (motivo, extra) => { await db.semPar(Object.assign({}, base, { motivo }, extra)); return Object.assign({ ok: true, tipo: 'sem-par', motivo }, extra); };
  const escolhe = (l) => {
    if (l.length < 2) return l[0] || null;
    const ab = l.filter((p) => p.aberta);
    if (ab.length === 1) return Object.assign({ por: 'reserva' }, ab[0]);
    const L = ab.length ? ab : l, n = L.filter((p) => mesmoNome(p.nome, de));
    if (n.length === 1) return Object.assign({ por: 'nome' }, n[0]);
    const t = hr ? (n.length ? n : L).filter((p) => +p.ts > hr - 40 * 60e3) : [];
    return t.length === 1 ? Object.assign({ por: 'hora' }, t[0]) : null;
  };
  const exatos = (await db.fichas(agora - SITE_H * H)).filter((p) => p.moeda === moeda && !p.pago && antes(p) && p.valor === v);
  const e1 = escolhe(exatos);
  if (e1) {
    const o = Object.assign({}, base, e1.por ? { por: e1.por } : {});
    try { await db.confirmaPedido(e1.id, o); } catch (e) {
      if (!(e instanceof Falha) || e.motivo !== 'sem-peca') throw e;
      return Object.assign(await semPar('sem-peca', { id: e1.id, candidatos: 1 }), { tipo: 'sem-peca' });
    }
    return Object.assign({ ok: true, tipo: 'site', id: e1.id }, e1.por ? { por: e1.por } : {});
  }
  if (exatos.length > 1) return semPar('empate', { candidatos: exatos.length, ids: exatos.map((p) => p.id).slice(0, 10) });
  const daLoja = (e) => (moeda === 'gs' ? Math.round(+e.gs || 0) : e.gs ? NaN : Math.round((+e.brl || 0) * 100));
  const loja = (await db.esperas(agora - LOJA_H * H)).filter((e) => !e.ok && daLoja(e) === v);
  if (loja.length === 1) { await db.confirmaEspera(loja[0].id, { valor, banco: bc, mid, ts: agora }); return { ok: true, tipo: 'loja', id: loja[0].id }; }
  return semPar(loja.length > 1 ? 'empate' : 'sem-pedido', { candidatos: loja.length });
}
module.exports = { Falha, centavos, valorDoTexto, gsDoTexto, mesmoNome, recebe, SITE_H, LOJA_H };
