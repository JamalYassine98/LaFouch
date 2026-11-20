// S197 (aprovado 12/11/2026): PIX automático por e-mail, sem API e sem notificação no celular.
// O Nubank manda "Você recebeu uma transferência" (remetente todomundo@nubank.com.br) para o e-mail pessoal do dono;
// um filtro do Gmail encaminha para lafouch.eyewear@gmail.com; o robô (Google Apps Script, work/pix/robo-pix.gs) lê,
// confere remetente + DKIM do nubank.com.br e chama a função "pix" com a chave secreta PIX_ROBO.
// Esta regra (pura: o banco vem por "db") acha o pedido pelo VALOR:
//  - pedido do site: valor exato com o final único (centavos), feito nas últimas 48 h, ainda não pago → pago sozinho;
//  - venda da loja no app (Venda · PIX): valor redondo, espera registrada pelo app (pixEspera) nas últimas 2 h → confirmada;
//  - nada ou mais de um candidato → vai para "pixSemPar" (o guardião do app avisa; nunca confirma no chute).
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
// Banco Familiar / Eko (14/11/2026, no lugar do Itaú): e-mail "Transferencia de otros bancos" de operbancaweb@familiar.com.py,
// "Moneda y Monto: PYG 200.000". Mesma regra do Itaú; as esperas da loja gravadas como 'itau' pelo app antigo também valem.
const DOM_PY = { itau: /(^|\.)itau\.com\.py$/i, familiar: /(^|\.)familiar\.com\.py$/i };
// nomes iguais = 2 ou mais palavras (3+ letras, sem acento, sem "de/da/dos") em comum entre o cliente do pedido e o pagador do banco
function palavras(n) { return String(n || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2 && !/^(dos|das|del|los|las)$/.test(w)); }
function mesmoNome(a, b) { const x = palavras(a), y = palavras(b); return x.filter((w, i) => x.indexOf(w) === i && y.indexOf(w) >= 0).length >= 2; }
async function recebeItau(db, b, agora) {
  const g = Math.round(+String(b.valor).replace(/\./g, ''));
  if (!(g > 0 && g < 1e10)) throw new Falha('valor');
  const mid = String(b.mid || '').slice(0, 120);
  if (!mid) throw new Falha('mid');
  const bc = b.banco === 'familiar' ? 'familiar' : 'itau';
  if (b.dkim !== true || !DOM_PY[bc].test(String(b.dom || ''))) throw new Falha('origem', 403);
  if (await db.jaVisto(mid)) return { ok: true, repetido: true };
  await db.visto(mid, agora);
  // 14/11/2026 (dono: "por que não considera a hora + nome + valor?"): o robô manda também QUEM pagou (nome) e QUANDO (hora).
  // Valor continua sendo a prova; hora e nome só DESEMPATAM — nunca são exigidos, porque outra pessoa pode pagar pelo cliente.
  //  · hora: pedido criado DEPOIS do pagamento não pode ser o dono dele (folga de 2 min de relógio);
  //  · nome: entre vários candidatos, vale o único cujo cliente tem 2+ nomes iguais aos do pagador;
  //  · senão, o único feito nos 40 min antes do pagamento; senão "sem par", com o nome do pagador como pista.
  const hr = +b.hora > agora - 72 * H && +b.hora < agora + 10 * 60e3 ? +b.hora : 0;
  const de = String(b.nome || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const antes = (p) => !hr || !(+p.ts > 0) || +p.ts <= hr + 2 * 60e3;
  const pista = de ? { de } : {};
  const escolhe = (l) => {
    if (l.length < 2) return l[0] || null;
    const n = l.filter((p) => mesmoNome(p.nome, de));
    if (n.length === 1) return Object.assign({ por: 'nome' }, n[0]);
    const base = n.length ? n : l;
    const t = hr ? base.filter((p) => +p.ts > hr - 40 * 60e3) : [];
    return t.length === 1 ? Object.assign({ por: 'hora' }, t[0]) : null;
  };
  const todos = (await db.pedidosItau(agora - SITE_H * H)).filter((p) => !p.pago && antes(p));
  const site = todos.filter((p) => Math.round(+p.pagar || 0) === g);
  const s1 = escolhe(site);
  if (s1) { await db.confirmaPedido(s1.id, Object.assign({ valor: g, banco: bc, mid, ts: agora }, pista, s1.por ? { por: s1.por } : {})); return Object.assign({ ok: true, tipo: 'site', id: s1.id }, s1.por ? { por: s1.por } : {}); }
  // 14/11/2026 (dono: "e se o cliente enviar 114 mil em vez de 113.926?"): quem arredonda PARA CIMA, até o total cheio do pedido, pagou a mais e é confirmado
  // — desde que dê para saber QUAL pedido (um só na faixa pagar < valor <= total, ou desempate por nome/hora). Valor a menos nunca confirma sozinho.
  if (!site.length) {
    const arr = todos.filter((p) => +p.pagar > 0 && +p.total > 0 && g > Math.round(+p.pagar) && g <= Math.round(+p.total));
    const a1 = escolhe(arr);
    if (a1) { await db.confirmaPedido(a1.id, Object.assign({ valor: g, banco: bc, mid, ts: agora, arred: Math.round(g - a1.pagar) }, pista, a1.por ? { por: a1.por } : {})); return Object.assign({ ok: true, tipo: 'site', id: a1.id, arredondado: true }, a1.por ? { por: a1.por } : {}); }
    if (arr.length > 1) { await db.semPar(Object.assign({ valor: g, banco: bc, mid, ts: agora, candidatos: arr.length, arred: true }, pista)); return { ok: true, tipo: 'sem-par', candidatos: arr.length }; }
  }
  const loja = site.length ? [] : (await db.esperas(agora - LOJA_H * H)).filter((e) => !e.ok && (e.banco === 'itau' || e.banco === 'familiar') && Math.round(+e.gs || 0) === g);
  if (loja.length === 1) { await db.confirmaEspera(loja[0].id, { valor: g, banco: bc, mid, ts: agora }); return { ok: true, tipo: 'loja', id: loja[0].id }; }
  await db.semPar(Object.assign({ valor: g, banco: bc, mid, ts: agora, candidatos: site.length + loja.length }, pista));
  return { ok: true, tipo: 'sem-par', candidatos: site.length + loja.length };
}
async function recebe(db, b, agora) {
  if (b.banco === 'itau' || b.banco === 'familiar') return recebeItau(db, b, agora);
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
module.exports = { Falha, centavos, valorDoTexto, gsDoTexto, mesmoNome, recebe, SITE_H, LOJA_H };
