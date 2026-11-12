// S197 (aprovado 12/11/2026): PIX automático por e-mail, sem API e sem notificação no celular.
// O Nubank manda "Você recebeu uma transferência" (remetente todomundo@nubank.com.br) para o e-mail pessoal do dono;
// um filtro do Gmail encaminha para lafouch.eyewear@gmail.com; o robô (Google Apps Script, work/pix/robo-pix.gs) lê,
// confere remetente + DKIM do nubank.com.br e chama a função "pix" com a chave secreta PIX_ROBO.
// Esta regra (pura: o banco vem por "db") acha o pedido pelo VALOR:
//  - pedido do site: valor exato com o final único (centavos), feito nas últimas 48 h, ainda não pago → pago sozinho;
//  - venda da loja no app (Venda · PIX): valor redondo, espera registrada pelo app (pixEspera) nas últimas 2 h → confirmada;
//  - nada ou mais de um candidato → vai para "pixSemPar" (o guardião do app avisa; nunca confirma no chute).
class Falha extends Error { constructor(m, s) { super(m); this.motivo = m; this.status = s || 400; } }
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
async function recebe(db, b, agora) {
  const c = centavos(b.valor);
  if (!Number.isFinite(c)) throw new Falha('valor');
  const mid = String(b.mid || '').slice(0, 120);
  if (!mid) throw new Falha('mid');
  if (b.dkim !== true || !/(^|\.)nubank\.com\.br$/i.test(String(b.dom || ''))) throw new Falha('origem', 403);
  if (await db.jaVisto(mid)) return { ok: true, repetido: true };
  await db.visto(mid, agora);
  const site = (await db.pedidosPix(agora - SITE_H * H)).filter((p) => !p.pago && Math.round((+p.brl || 0) * 100) === c);
  if (site.length === 1) {
    await db.confirmaPedido(site[0].id, { valor: c / 100, mid, ts: agora });
    return { ok: true, tipo: 'site', id: site[0].id };
  }
  const loja = site.length ? [] : (await db.esperas(agora - LOJA_H * H)).filter((e) => !e.ok && Math.round((+e.brl || 0) * 100) === c);
  if (loja.length === 1) {
    await db.confirmaEspera(loja[0].id, { valor: c / 100, mid, ts: agora });
    return { ok: true, tipo: 'loja', id: loja[0].id };
  }
  await db.semPar({ valor: c / 100, mid, ts: agora, candidatos: site.length + loja.length });
  return { ok: true, tipo: 'sem-par', candidatos: site.length + loja.length };
}
module.exports = { Falha, centavos, valorDoTexto, recebe, SITE_H, LOJA_H };
