// Cupons e cartões virtuais (S174 v1+v2+v3, aprovados 11/11/2026). Um sistema só: o site e o caixa do app usam os mesmos códigos.
// Tipos: bv Boas-vindas 5% (ao se inscrever, 30 dias, 1 por e-mail e por telefone, só quem nunca comprou, compra mínima)
//        px Próxima compra 10% (vem com a compra paga) · am Indique uma amiga 10% (a amiga usa; você ganha outro px depois de pago + 7 dias, até 5 por mês)
//        vip 15% (pessoal, vale sempre; emitido à mão) · fiel Cliente fiel 10% (S194: a cada 3 compras pagas, 1 uso, sozinho) · ev cupom do evento
// Proteções sempre ligadas: 1 código por compra (o site/caixa aplicam só 1), vale o maior desconto (site/caixa), nunca abaixo do piso (site/caixa),
// código pessoal preso ao 1º telefone (outro telefone = recusa + aviso ao dono com 4+ telefones no dia; S194: sem trava de 24 h),
// anti-robô invisível: 30+ códigos errados por hora no mesmo endereço passam a receber 'não encontrado' (sem espera visível).
// S194: SEM teto do mês.
// S400 (17/11/2026 — esboços 61a–61i e 62, regras aprovadas pelo dono em 16–17/11):
//   · nenhum cartão aparece na tela de pagamento; o presente sai por e-mail quando o dono marca o pedido ENTREGUE (entregue());
//   · "10% na próxima compra" só na PRIMEIRA compra; Cliente fiel continua (a cada 3 compras);
//   · convite para indicar: e-mail separado 2 semanas depois da entrega, só na primeira compra (diario());
//   · um presente por vez: o próximo só chega quando o atual foi usado ou venceu e nunca a menos de 30 dias do e-mail anterior (st 'fila', solta());
//   · quem indica não ganha outro cartão: o cartão que já tem CRESCE (1 pessoa = 15% · 3 = 20%, teto · 5 = presente especial, aviso ao dono);
//     sem cartão valendo, recebe um cartão novo (10% na 1ª indicação, como no esboço 61d; 20% na 3ª);
//   · VIP: validade e número de compras escolhidos pelo dono (padrão 1 compra); os cartões que o dono gera vão por e-mail quando há e-mail.
// Regra pura: o banco vem por "db" (ver index.js). Datas em ms.
const crypto = require('crypto');
const E = require('./email');
class Falha extends Error { constructor(m, s) { super(m); this.motivo = m; this.status = s || 400; } }
const DIA = 864e5;
const LETRAS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem O/0 e I/1
const PADRAO = { bv: { pct: 5, dias: 30, min: 100000 }, px: { pct: 10, dias: 120, min: 0 }, am: { pct: 10, dias: 365, min: 0 }, vip: { pct: 15, dias: 120, min: 0 }, fiel: { pct: 10, dias: 120, min: 0, cada: 3 } };
const TETO_MES = 500000, AMIGA_MES = 5, TEL_DIF = 4, ERRADOS_HORA = 30;
const CONVITE_DIAS = 14, ENTRE_PRESENTES = 30, META = { 1: 15, 3: 20 }, META_ESPECIAL = 5, SEM_CARTAO = { 1: 10, 3: 20 };
const EMAIL_OK = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;
const limpa = (t, n) => String(t == null ? '' : t).replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const telN = (t) => String(t || '').replace(/\D/g, '').slice(-9); // compara pelos 9 últimos dígitos (com ou sem +595/0)
const emN = (e) => limpa(e, 200).toLowerCase();
const codN = (c) => limpa(c, 24).toUpperCase().replace(/\s/g, '');
function novoCod(rnd) {
  const b = rnd || crypto.randomBytes(4);
  let s = '';
  for (let i = 0; i < 4; i++) s += LETRAS[b[i] % LETRAS.length];
  return 'LF-' + s;
}
const mesDe = (t) => { const d = new Date(t); return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0'); };
function vivo(c, agora) {
  if (!c) return 'nao';
  if (c.st === 'canc') return 'cancelado';
  if (c.st === 'pend' || c.st === 'fila') return 'pendente';
  if (c.travaAte && agora < c.travaAte) return 'trava';
  if (c.ini && agora < c.ini) return 'cedo';
  if (c.fim && agora > c.fim) return 'vencido';
  const ok = (c.usos || []).filter((u) => u.st === 'ok' || (u.st === 'res' && agora - u.ts < 3 * DIA));
  if (c.max && ok.length >= c.max) return c.tipo === 'ev' ? 'esgotado' : 'usado';
  return '';
}
function restam(c, agora) {
  if (!c.max) return null;
  return Math.max(0, c.max - (c.usos || []).filter((u) => u.st === 'ok' || (u.st === 'res' && agora - u.ts < 3 * DIA)).length);
}
function publico(c, agora) {
  return { cod: c.cod, tipo: c.tipo, pct: c.pct, fim: c.fim || 0, min: c.min || 0, restam: c.tipo === 'ev' ? restam(c, agora) : null, estado: vivo(c, agora) || 'ok' };
}
async function teto(db, agora) {
  const m = (await db.getMes(mesDe(agora))) || {};
  return { usado: m.desc || 0, teto: 0, pausa: false }; // S194: teto do mês removido
}
async function aviso(db, agora, t, d, cod) { try { await db.aviso({ ts: agora, t, d, cod: cod || '' }); } catch (e) {} }
// 13/11: toda mudança que depende do que está gravado passa por aqui — relê o cupom e grava de uma vez (transação),
// para dois pedidos/aparelhos no mesmo segundo nunca apagarem o que o outro gravou. fn(cupom) → { muda, r } ou null (não grava).
async function mudaT(db, cod, fn) {
  if (db.trans) return db.trans(cod, (c, grava) => { const x = c ? fn(c) : null; if (x && x.muda) grava(x.muda); return x ? x.r : undefined; });
  const c = await db.get(cod), x = c ? fn(c) : null;
  if (x && x.muda) await db.muda(cod, x.muda);
  return x ? x.r : undefined;
}
async function cria(db, o, agora) {
  for (let i = 0; i < 6; i++) {
    const cod = o.cod || novoCod();
    const c = Object.assign({ cod, ts: agora, ini: agora, usos: [], st: 'ativo', max: 1 }, o, { cod });
    if (db.criaSe) { if (await db.criaSe(cod, c)) return c; if (o.cod) throw new Falha('existe'); continue; } // cria só se o código não existe (atômico)
    if (await db.get(cod)) { if (o.cod) throw new Falha('existe'); continue; }
    await db.salva(cod, c);
    return c;
  }
  throw new Falha('erro', 500);
}
// erro de código (força bruta): 10 por hora por endereço
async function errou(db, ipk, agora) {
  const t = (await db.getTent(ipk)) || { n: 0, ts: agora };
  const n = agora - t.ts > 3600000 ? 1 : t.n + 1;
  await db.salvaTent(ipk, { n, ts: n === 1 ? agora : t.ts });
}
async function bloqueado(db, ipk, agora) {
  const t = await db.getTent(ipk);
  return !!t && agora - t.ts <= 3600000 && t.n >= ERRADOS_HORA;
}
// confere tudo antes de usar (sem gravar o uso)
async function confere(db, b, ipk, agora) {
  const bloq = await bloqueado(db, ipk, agora);
  const cod = codN(b.cod), c = !bloq && cod.length >= 4 ? await db.get(cod) : null;
  if (!c) { await errou(db, ipk, agora); return { ok: false, motivo: 'nao' }; }
  const v = vivo(c, agora);
  if (v) return { ok: false, motivo: v, c: publico(c, agora) };
  const tel = telN(b.tel), em = emN(b.email);
  if (c.tipo === 'ev' || c.tipo === 'am' || c.tipo === 'bv') {
    const ja = (c.usos || []).some((u) => (u.st === 'ok' || (u.st === 'res' && agora - u.ts < 3 * DIA)) && ((tel && u.tel === tel) || (em && u.email === em)));
    if (ja) return { ok: false, motivo: 'ja', c: publico(c, agora) };
  }
  if (c.tel && tel && c.tel !== tel && c.tipo !== 'ev' && c.tipo !== 'am') {
    // código pessoal usado por outro telefone: conta e trava com 4+ telefones diferentes no dia
    const dia = await mudaT(db, cod, (f) => { const d = (f.outros || []).filter((x) => agora - x.ts < DIA); if (!d.some((x) => x.tel === tel)) d.push({ tel, ts: agora }); return { muda: { outros: d }, r: d }; }) || [];
    const muitos = dia.length >= TEL_DIF;
    if (muitos && dia.length === TEL_DIF) await aviso(db, agora, 'trava', dia.length + ' telefones diferentes tentaram este código pessoal hoje', cod);
    return { ok: false, motivo: 'outro' };
  }
  if (c.tipo === 'am' && c.por && ((tel && c.por.tel === tel) || (em && c.por.email === em))) return { ok: false, motivo: 'proprio' };
  if ((c.tipo === 'bv' || c.tipo === 'am') && (await db.jaComprou(tel, em))) return { ok: false, motivo: 'cliente' };
  return { ok: true, c: publico(c, agora), raw: c };
}
// site: "¿Tenés un código?" (ver) — só confere
async function ver(db, b, ipk, agora) {
  const r = await confere(db, b, ipk, agora);
  return { ok: r.ok, motivo: r.motivo || '', cupom: r.c || null };
}
// site ou caixa: grava o uso (site = reservado até o app confirmar o pagamento; caixa = já confirmado)
async function usar(db, b, ipk, agora, caixa) {
  const r = await confere(db, b, ipk, agora);
  if (!r.ok) return { ok: false, motivo: r.motivo, cupom: r.c || null };
  const c = r.raw, total = Math.max(0, Math.round(+b.total || 0)), desc = Math.max(0, Math.round(+b.desc || 0));
  if (c.min && total < c.min) return { ok: false, motivo: 'min', cupom: r.c };
  if (desc > Math.round((total * c.pct) / 100) + 1000) throw new Falha('desc');
  const pid = limpa(b.pid, 40);
  if (!pid) throw new Falha('pid');
  const tel = telN(b.tel), em = emN(b.email);
  const monta = (cc) => {
    const usos = (cc.usos || []).filter((u) => u.pid !== pid).concat([{ pid, tel, email: em, ts: agora, st: caixa ? 'ok' : 'res', desc, total, canal: caixa ? 'loja' : 'site' }]);
    const m = { usos, pids: usos.map((u) => u.pid) };
    if (!cc.tel && tel && cc.tipo !== 'ev' && cc.tipo !== 'am') m.tel = tel; // preso ao 1º telefone
    return m;
  };
  let muda;
  if (db.trans) {
    // relê o cupom dentro da transação: se outro pedido acabou de usar o último uso, este recebe "usado"/"esgotado"
    const fim = await db.trans(c.cod, (fresco, grava) => {
      if (!fresco) return { e: 'nao' };
      const so = Object.assign({}, fresco, { usos: (fresco.usos || []).filter((u) => u.pid !== pid) }), v = vivo(so, agora);
      if (v) return { e: v, c: fresco };
      const m = monta(fresco);
      grava(m);
      return { m, c: fresco };
    });
    if (fim.e) return { ok: false, motivo: fim.e, cupom: fim.c ? publico(fim.c, agora) : null };
    muda = fim.m;
  } else {
    muda = monta(c);
    await db.muda(c.cod, muda);
  }
  await db.somaMes(mesDe(agora), desc);
  const t = await teto(db, agora);
  if (t.pausa && t.usado - desc < TETO_MES) await aviso(db, agora, 'pausa', 'teto do mês atingido · novos códigos pausados até o mês que vem');
  const nc = Object.assign({}, c, muda);
  if (c.tipo === 'ev' && vivo(nc, agora) === 'esgotado') await aviso(db, agora, 'esgotado', c.max + ' de ' + c.max + ' usos', c.cod);
  return { ok: true, cupom: publico(nc, agora) };
}
// boas-vindas ao se inscrever (site)
async function boasVindas(db, envia, b, agora) {
  const em = emN(b.email), tel = telN(b.tel);
  if (!EMAIL_OK.test(em)) throw new Falha('email');
  if (await db.bvDe(em, tel)) return { ok: false, motivo: 'ja' };
  if (await db.jaComprou(tel, em)) return { ok: false, motivo: 'cliente' };
  if ((await teto(db, agora)).pausa) return { ok: false, motivo: 'pausa' };
  if (db.trava && !(await db.trava('bv:' + em))) return { ok: false, motivo: 'ja' }; // 2 inscrições no mesmo segundo
  const P = PADRAO.bv, c = await cria(db, { tipo: 'bv', pct: P.pct, fim: agora + P.dias * DIA, min: P.min, email: em, tel: tel || '' }, agora);
  if (envia) try { await envia(mail(c, b.lang === 'es')); } catch (e) {}
  return { ok: true, cupom: publico(c, agora) };
}
// site: o pedido saiu → cria o cartão "Próxima compra" PENDENTE (vale quando o app confirmar o pagamento)
async function proxima(db, b, agora) {
  const pid = limpa(b.pid, 40), em = emN(b.email), tel = telN(b.tel);
  if (!pid || !tel) throw new Falha('pid');
  const ja = await db.porPid(pid, 'px');
  // S201 (13/11): o cartão "Indique uma amiga" nasce junto, PENDENTE, para o site mostrar o código na tela de pagamento confirmado
  const amJa = ja ? await db.porPid(pid, 'am') : null;
  if (ja) return { ok: true, cupom: publico(ja, agora), amiga: amJa ? publico(amJa, agora) : null };
  if ((await teto(db, agora)).pausa) return { ok: false, motivo: 'pausa' };
  if (db.trava && !(await db.trava('px:' + pid))) {
    // outra chamada do mesmo pedido está criando os cartões agora: espera um pouco e devolve os dela
    for (let i = 0; i < 6; i++) { await new Promise((r) => setTimeout(r, db.espera != null ? db.espera : 400)); const x = await db.porPid(pid, 'px'); if (x) { const y = await db.porPid(pid, 'am'); return { ok: true, cupom: publico(x, agora), amiga: y ? publico(y, agora) : null }; } }
    return { ok: false, motivo: 'tente' };
  }
  const P = PADRAO.px, c = await cria(db, { tipo: 'px', pct: P.pct, fim: agora + P.dias * DIA, min: P.min, email: em, tel, pid, st: 'pend', lang: b.lang === 'es' ? 'es' : 'pt', nome: limpa(b.nome, 60) }, agora);
  const am = await cria(db, { tipo: 'am', pct: PADRAO.am.pct, fim: agora + PADRAO.am.dias * DIA, max: 0, por: { tel, email: em }, email: em, tel: '', pid, st: 'pend', de: 'pedido:' + pid }, agora);
  return { ok: true, cupom: publico(c, agora), amiga: publico(am, agora) };
}
// app (dono): pagamento do pedido confirmado → os usos viram "ok"; quem indicou é premiado; o pedido fica marcado como pago (pg) e com o
// número da compra (n). NENHUM cartão sai aqui: o presente só sai na ENTREGA (entregue()).
async function confirma(db, envia, b, agora) {
  const pid = limpa(b.pid, 40);
  if (!pid) throw new Falha('pid');
  const out = { usados: 0, cartoes: [] };
  for (const c0 of await db.comUsoDe(pid)) {
    const r = await mudaT(db, c0.cod, (c) => {
      const novo = (c.usos || []).some((u) => u.pid === pid && u.st !== 'ok'), usos = (c.usos || []).map((u) => (u.pid === pid ? Object.assign({}, u, { st: 'ok' }) : u));
      return { muda: { usos }, r: { ganha: novo && c.tipo === 'am' && !!c.por, por: c.por, cod: c.cod } };
    });
    out.usados++;
    if (r && r.ganha) { const p = await premia(db, envia, r.por, agora); if (p) out.cartoes.push(p); }
  }
  const px = await db.porPid(pid, 'px');
  if (px && db.comprou) try { await db.comprou(px.tel, px.email); } catch (e) {}
  if (px && px.st === 'pend') {
    let n = null;
    if (px.tel && db.contaPaga) try { n = await db.contaPaga(px.tel, pid); } catch (e) {}
    await mudaT(db, px.cod, (f) => (f.st === 'pend' ? { muda: Object.assign({ pg: f.pg || agora }, n ? { n } : {}) } : null));
    if (px.tel && px.nome && db.cliMuda) try { await db.cliMuda(px.tel, { nome: px.nome }); } catch (e) {}
  }
  return Object.assign({ ok: true }, out);
}
const pessoais = (L) => (L || []).filter((c) => c.tipo === 'px' || c.tipo === 'fiel');
const nomeDe = (c) => limpa(c && c.nome, 60);
// um presente por vez: solta o mais antigo da fila se a pessoa não tem cartão valendo e o último e-mail de presente foi há 30+ dias
async function solta(db, envia, tel, agora) {
  if (!tel || !db.doTel) return null;
  const L = pessoais(await db.doTel(tel));
  if (L.some((c) => c.st === 'ativo' && !vivo(c, agora))) return null;
  const cli = (db.cli && (await db.cli(tel))) || {};
  if (cli.gm && agora - cli.gm < ENTRE_PRESENTES * DIA) return null;
  const f = L.filter((c) => c.st === 'fila').sort((a, b) => a.ts - b.ts)[0];
  if (!f) return null;
  const dias = (PADRAO[f.tipo] || PADRAO.px).dias, muda = { st: 'ativo', ini: agora, fim: agora + dias * DIA };
  if (!(await mudaT(db, f.cod, (c) => (c.st === 'fila' ? { muda, r: true } : null)))) return null;
  if (db.cliMuda) await db.cliMuda(tel, { gm: agora });
  const c = Object.assign({}, f, muda);
  if (envia && c.email) try { await envia(mailPresente(c, c.lang === 'es', cli.ind || 0)); } catch (e) {}
  return c.cod;
}
// app (dono): pedido marcado ENTREGUE → sai o presente (1ª compra: 10% · a cada 3: Cliente fiel) e fica marcado o convite para daqui a 2 semanas
async function entregue(db, envia, b, agora) {
  const pid = limpa(b.pid, 40);
  if (!pid) throw new Falha('pid');
  const px = await db.porPid(pid, 'px');
  if (!px || px.st !== 'pend' || !px.pg) return { ok: true, fora: true };
  const primeira = px.n === 1, fiel = !!px.n && px.n % PADRAO.fiel.cada === 0;
  if (!(await mudaT(db, px.cod, (f) => (f.st === 'pend' && f.pg ? { muda: { st: primeira ? 'fila' : 'canc', ent: agora }, r: true } : null)))) return { ok: true, fora: true };
  const out = { ok: true, cartoes: [] };
  const am = await db.porPid(pid, 'am');
  if (am && am.st === 'pend') await mudaT(db, am.cod, (f) => (f.st === 'pend' ? { muda: primeira ? { conv: agora + CONVITE_DIAS * DIA, lang: px.lang || 'pt', nome: nomeDe(px) } : { st: 'canc' } } : null));
  if (fiel) await cria(db, { tipo: 'fiel', pct: PADRAO.fiel.pct, fim: agora + PADRAO.fiel.dias * DIA, max: 1, email: px.email || '', tel: px.tel, de: 'fiel:' + px.n, st: 'fila', lang: px.lang || 'pt', nome: nomeDe(px) }, agora);
  if (primeira || fiel) { const c = await solta(db, envia, px.tel, agora); if (c) out.cartoes.push(c); }
  return out;
}
// quem indicou: o cartão que a pessoa já tem cresce; sem cartão valendo, recebe um novo. Devolve o código do cartão mexido (ou '').
async function premia(db, envia, por, agora) {
  const tel = telN(por && por.tel);
  if (!tel || !db.indMais) return '';
  const n = await db.indMais(tel);
  if (n === META_ESPECIAL) await aviso(db, agora, 'meta5', '5 indicações que compraram · presente especial a combinar com o cliente (final ' + tel.slice(-4) + ')');
  if (!META[n]) return '';
  const L = pessoais(db.doTel ? await db.doTel(tel) : []), cli = (db.cli && (await db.cli(tel))) || {};
  const lang = (L.find((c) => c.lang) || {}).lang || 'pt', nome = cli.nome || nomeDe(L.find((c) => c.nome)), email = emN(por.email) || (L.find((c) => c.email) || {}).email || '';
  const viva = L.filter((c) => c.st === 'ativo' && !vivo(c, agora)).sort((a, b) => b.pct - a.pct)[0];
  if (viva) {
    const muda = { pct: Math.max(viva.pct, META[n]), fim: agora + PADRAO.px.dias * DIA, ind: n };
    await mudaT(db, viva.cod, () => ({ muda }));
    if (envia && email) try { await envia(mailCresceu(Object.assign({}, viva, muda, { nome: viva.nome || nome, email }), lang === 'es', n)); } catch (e) {}
    return viva.cod;
  }
  const fila = L.filter((c) => c.st === 'fila').sort((a, b) => a.ts - b.ts)[0];
  if (fila) { await mudaT(db, fila.cod, (c) => ({ muda: { pct: Math.max(c.pct, META[n]), ind: n } })); return fila.cod; }
  const c = await cria(db, { tipo: 'px', pct: SEM_CARTAO[n], fim: agora + PADRAO.px.dias * DIA, email, tel, de: 'ind:' + n, lang, nome }, agora);
  if (db.cliMuda) await db.cliMuda(tel, { gm: agora });
  if (envia && email) try { await envia(mailIndicou(c, lang === 'es', n)); } catch (e) {}
  return c.cod;
}
// todo dia (junto com a limpeza): solta os presentes guardados que já podem sair e manda os convites para indicar que venceram as 2 semanas
async function diario(db, envia, agora) {
  const out = { soltos: 0, convites: 0 };
  const tels = Array.from(new Set(((db.fila ? await db.fila() : []) || []).map((c) => c.tel).filter(Boolean)));
  for (const t of tels) if (await solta(db, envia, t, agora)) out.soltos++;
  for (const am of ((db.convites ? await db.convites(agora) : []) || [])) {
    if (!(am.conv && am.conv <= agora && am.st === 'pend')) continue;
    const muda = { st: 'ativo', ini: agora, fim: agora + PADRAO.am.dias * DIA };
    if (!(await mudaT(db, am.cod, (f) => (f.st === 'pend' ? { muda, r: true } : null)))) continue;
    out.convites++;
    if (envia && am.email) try { await envia(mailConvite(Object.assign({}, am, muda), am.lang === 'es')); } catch (e) {}
  }
  return out;
}
// app (dono): pedido cancelado → solta o código reservado e cancela o cartão pendente
async function libera(db, b, agora) {
  const pid = limpa(b.pid, 40);
  let n = 0;
  for (const c of await db.comUsoDe(pid)) {
    const u = await mudaT(db, c.cod, (f) => { const uu = (f.usos || []).find((x) => x.pid === pid && x.st === 'res'); if (!uu) return null; const us = (f.usos || []).filter((x) => !(x.pid === pid && x.st === 'res')); return { muda: { usos: us, pids: us.map((x) => x.pid) }, r: uu }; });
    if (u) await db.somaMes(mesDe(u.ts), -(u.desc || 0));
    n++;
  }
  const px = await db.porPid(pid, 'px');
  if (px && px.st === 'pend') await mudaT(db, px.cod, (f) => (f.st === 'pend' ? { muda: { st: 'canc' } } : null));
  const am = await db.porPid(pid, 'am');
  if (am && am.st === 'pend') await mudaT(db, am.cod, (f) => (f.st === 'pend' ? { muda: { st: 'canc' } } : null));
  return { ok: true, n };
}
// app (dono): criar VIP / Próxima compra na loja / cupom do evento; cancelar; listar
async function emitir(db, b, agora, envia) {
  const tipo = ['vip', 'px', 'am', 'ev'].indexOf(b.tipo) >= 0 ? b.tipo : '';
  if (!tipo) throw new Falha('tipo');
  const pct = Math.round(+b.pct || (PADRAO[tipo] || {}).pct || 0);
  if (!(pct >= 1 && pct <= 30)) throw new Falha('pct');
  const o = { tipo, pct, email: emN(b.email), tel: telN(b.tel), nome: limpa(b.nome, 60), min: Math.max(0, Math.round(+b.min || 0)) };
  if (tipo === 'ev') {
    const cod = limpa(b.cod, 16).toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cod.length < 4) throw new Falha('cod');
    Object.assign(o, { cod, ini: +b.ini || agora, fim: +b.fim || agora + 30 * DIA, max: Math.max(1, Math.min(1000, Math.round(+b.max || 50))), tel: '', email: '', tema: limpa(b.tema, 20) });
  } else if (tipo === 'vip') Object.assign(o, { fim: +b.fim > agora ? +b.fim : agora + PADRAO.vip.dias * DIA, max: Math.max(1, Math.min(50, Math.round(+b.max || 1))) }); // validade e nº de compras: o dono escolhe; padrão 1 compra
  else if (tipo === 'am') Object.assign(o, { fim: agora + PADRAO.am.dias * DIA, max: 0, por: { tel: o.tel, email: o.email }, tel: '' });
  else Object.assign(o, { fim: agora + PADRAO.px.dias * DIA, max: 1 });
  if (tipo !== 'ev') o.lang = b.lang === 'es' ? 'es' : 'pt';
  const c = await cria(db, o, agora);
  // S400: o cartão que o dono gera vai por e-mail quando ele informa o e-mail do cliente (esboços 61f e 61g)
  let enviou = false;
  if (envia && c.email && (tipo === 'vip' || tipo === 'px')) try { await envia(tipo === 'vip' ? mailVip(c, c.lang === 'es') : mailLoja(c, c.lang === 'es')); enviou = true; } catch (e) {}
  return { ok: true, cupom: publico(c, agora), cod: c.cod, enviou };
}
async function cancelar(db, b) {
  const c = await db.get(codN(b.cod));
  if (!c) throw new Falha('nao');
  await db.muda(c.cod, { st: 'canc' });
  return { ok: true };
}
async function destrava(db, b) {
  const c = await db.get(limpa(b.cod, 24).toUpperCase());
  if (!c) throw new Falha('nao');
  await db.muda(c.cod, { travaAte: 0, outros: [] });
  return { ok: true };
}
async function lista(db, agora) {
  const L = await db.todos();
  const T = {};
  for (const c of L) {
    const t = (T[c.tipo] = T[c.tipo] || { gerados: 0, usados: 0, vendido: 0, desconto: 0 });
    t.gerados++;
    for (const u of c.usos || []) if (u.st === 'ok') { t.usados++; t.vendido += u.total || 0; t.desconto += u.desc || 0; }
  }
  return { ok: true, tipos: T, teto: await teto(db, agora), cupons: L.slice(0, 300).map((c) => Object.assign(publico(c, agora), { tel: c.tel || '', email: c.email || '', nome: c.nome || '', usos: (c.usos || []).length, ts: c.ts, ini: c.ini || 0, max: c.max || 0, tema: c.tema || '' })), avisos: await db.avisos(30) };
}
// cliente com conta: Mi cuenta › Mis tarjetas
async function meus(db, email, agora) {
  const em = emN(email);
  if (!em) throw new Falha('login', 401);
  const L = (await db.doEmail(em)).filter((c) => c.st !== 'canc'), tel = (L.find((c) => c.tel) || {}).tel || '';
  const cli = (tel && db.cli && (await db.cli(tel))) || {};
  // S400: presentes guardados (fila) e convites que ainda não saíram não aparecem; a tela mostra só "você tem N presente(s) guardado(s)"
  return { ok: true, guardados: L.filter((c) => c.st === 'fila').length, indicacoes: cli.ind || 0, nome: cli.nome || nomeDe(L.find((c) => c.nome)),
    cupons: L.filter((c) => c.st !== 'fila' && c.st !== 'pend').map((c) => Object.assign(publico(c, agora), { max: c.max || 0, nome: nomeDe(c), tema: c.tema || '', usado: (c.usos || []).some((u) => u.st === 'ok' && u.email === em) }, c.tipo === 'am' ? { amigas: (c.usos || []).filter((u) => u.st === 'ok').length, ganhos: (c.premios || []).length, porMes: AMIGA_MES } : {})) };
}
// ---------- e-mails dos cartões (S400, esboços 61a–61h): cartão de luxo, sem código à vista (o botão aplica sozinho), textos que servem para qualquer pessoa ----------
const dt = (x, es) => new Date(x).toLocaleDateString(es ? 'es-PY' : 'pt-BR', { timeZone: 'America/Asuncion' });
const link = (c) => 'https://lafouch.com/?t=' + encodeURIComponent(c.cod);
const prim = (c) => E.esc(String((c && c.nome) || '').trim().split(/\s+/)[0]);
const NOME = (c) => E.esc(String((c && c.nome) || '').toUpperCase());
const vale = (c, es) => (c.fim ? (es ? 'VÁLIDO HASTA ' : 'VALE ATÉ ') + dt(c.fim, es) : '');
const regraAuto = (es) => E.PQ(es ? 'El descuento entra solo en tu carrito. No se suma a OFERTA ni a “Llevá 2”.' : 'O desconto entra sozinho no seu carrinho. Não soma com OFERTA nem com “Leve 2”.');
const usarB = (c, es) => E.B(es ? 'Usar ahora' : 'Usar agora', link(c));
const prox = (es) => (es ? 'en tu próxima compra' : 'na próxima compra');
const cartaoP = (c, es, rot) => E.luxo({ rot: rot || (es ? 'TARJETA REGALO' : 'CARTÃO PRESENTE'), pct: c.pct + '%', tit: prox(es), nome: NOME(c), val: vale(c, es) });
function metasTxt(n, es) {
  const falta = n < 3 ? 3 - n : n < META_ESPECIAL ? META_ESPECIAL - n : 0;
  const a = es ? (n === 1 ? '1 persona que indicaste ya compró.' : n + ' personas que indicaste ya compraron.') : (n === 1 ? '1 pessoa indicada já comprou.' : n + ' pessoas indicadas já compraram.');
  return E.metas(n, a + (falta ? (es ? (falta === 1 ? ' Falta 1 para tu próximo regalo.' : ' Faltan ' + falta + ' para tu próximo regalo.') : (falta === 1 ? ' Falta 1 para o seu próximo presente.' : ' Faltam ' + falta + ' para o seu próximo presente.')) : ''));
}
// 61a entrega da 1ª compra · 61e Cliente fiel · 61d (cartão da indicação que ficou guardado)
function mailPresente(c, es, ind) {
  if (c.tipo === 'fiel') return mailFiel(c, es);
  if (/^ind:/.test(c.de || '')) return mailIndicou(c, es, ind || +String(c.de).slice(4) || 1);
  const n = prim(c);
  return { to: c.email, subject: es ? 'Tu compra llegó · un regalo para la próxima' : 'Sua compra chegou · um presente para a próxima',
    html: E.molde(es ? 'Tu compra ' + E.I('llegó') : 'Sua compra ' + E.I('chegou'), E.P((es ? 'Gracias por tu preferencia' : 'Agradecemos a preferência') + (n ? ', ' + n : '') + '. ' + (es ? 'Para tu próxima compra, un regalo:' : 'Para a sua próxima compra, um presente:')) + cartaoP(c, es) + usarB(c, es) + regraAuto(es)) };
}
function mailFiel(c, es) {
  const n = prim(c), k = +String(c.de || '').slice(5) || 3, ord = es ? (k === 3 ? 'tercera' : k + 'ª') : (k === 3 ? 'terceira' : k + 'ª');
  return { to: c.email, subject: es ? 'Tu regalo de cliente fiel' : 'Seu presente de cliente fiel',
    html: E.molde(es ? 'Qué bueno tenerte de ' + E.I('vuelta') : 'Que bom ter você de ' + E.I('volta'), E.P((es ? 'Esta fue tu ' + ord + ' compra' : 'Esta foi a sua ' + ord + ' compra') + (n ? ', ' + n : '') + '. ' + (es ? 'Tu regalo de cliente fiel:' : 'Seu presente de cliente fiel:')) + cartaoP(c, es, 'CLIENTE FIEL') + usarB(c, es) + regraAuto(es)) };
}
// 61b convite para indicar (2 semanas depois da entrega da 1ª compra)
function mailConvite(am, es) {
  const l = link(am), n = prim(am);
  const zap = 'https://wa.me/?text=' + encodeURIComponent((es ? 'Un regalo para vos: 10% en tu primera compra en La Fouch. ' : 'Um presente para você: 10% na primeira compra na La Fouch. ') + l);
  return { to: am.email, subject: es ? 'Un regalo para quien querés' : 'Um presente para quem você gosta',
    html: E.molde(es ? '¿Te gustaron tus ' + E.I('lentes') + '?' : 'Gostou dos seus ' + E.I('óculos') + '?', E.P(es ? 'Regalale a alguien especial: esa persona gana 10% en su primera compra. Cuando compre, vos también ganás un regalo.' : 'Presenteie alguém especial: a pessoa ganha 10% na primeira compra. Quando ela comprar, você também ganha um presente.') +
      E.luxo({ tema: 'marfim', rot: es ? 'PARA REGALAR' : 'PARA PRESENTEAR', pct: am.pct + '%', tit: es ? 'en la primera compra' : 'na primeira compra', nome: n ? (es ? 'UN REGALO DE ' : 'UM PRESENTE DE ') + n.toUpperCase() : '', val: vale(am, es) }) + E.B(es ? 'Enviar el regalo' : 'Enviar o presente', zap)) };
}
// 61c a pessoa indicada comprou e o cliente JÁ TINHA um cartão: é o mesmo cartão, que cresceu
function mailCresceu(c, es, ind) {
  return { to: c.email, subject: es ? 'Tu indicación compró · tu tarjeta creció' : 'Sua indicação comprou · seu cartão cresceu',
    html: E.molde(es ? 'Tu tarjeta ' + E.I('creció') : 'Seu cartão ' + E.I('cresceu'), E.P(es ? 'La persona que indicaste compró en La Fouch. En agradecimiento, la tarjeta que ya tenías pasó a valer más:' : 'A pessoa que você indicou comprou na La Fouch. Em agradecimento, o cartão que você já tinha passou a valer mais:') + cartaoP(c, es, c.tipo === 'fiel' ? 'CLIENTE FIEL' : '') +
      E.PQ(es ? 'Es la misma tarjeta, con el valor nuevo: reemplaza a la anterior y la validez fue renovada.' : 'É o mesmo cartão, com o valor novo: ele substitui o anterior e a validade foi renovada.') + usarB(c, es) + E.FIO() + metasTxt(ind, es)) };
}
// 61d a pessoa indicada comprou e o cliente NÃO tinha cartão valendo: cartão novo
function mailIndicou(c, es, ind) {
  const n = prim(c);
  return { to: c.email, subject: es ? 'Tu indicación compró · un regalo para vos' : 'Sua indicação comprou · um presente para você',
    html: E.molde(es ? 'Tu indicación ' + E.I('compró') : 'Sua indicação ' + E.I('comprou'), E.P((es ? 'Gracias por indicar La Fouch' : 'Agradecemos por indicar a La Fouch') + (n ? ', ' + n : '') + '. ' + (es ? 'Tu regalo:' : 'Seu presente:')) + cartaoP(c, es) + usarB(c, es) + E.FIO() + metasTxt(ind, es)) };
}
// 61f cartão VIP gerado pelo dono (validade e nº de compras escolhidos por ele; padrão 1 compra)
function mailVip(c, es) {
  const n = prim(c), m = c.max || 1, tit = m === 1 ? (es ? 'en tu próxima compra' : 'na sua próxima compra') : (es ? 'en ' + m + ' compras' : 'em ' + m + ' compras');
  return { to: c.email, subject: es ? 'Una tarjeta VIP para vos' : 'Um cartão VIP para você',
    html: E.molde(es ? 'Sos ' + E.I('VIP') : 'Você é ' + E.I('VIP'), E.P((n ? n + ', ' : '') + (es ? (n ? 'La Fouch' : 'La Fouch') + ' preparó una tarjeta solo tuya, válida hasta ' : (n ? 'a La Fouch' : 'A La Fouch') + ' preparou um cartão só seu, válido até ') + dt(c.fim, es) + ':') +
      E.luxo({ tema: 'preto', rot: es ? 'TARJETA VIP' : 'CARTÃO VIP', pct: c.pct + '%', tit, nome: NOME(c), val: vale(c, es) }) + usarB(c, es) + E.PQ(es ? 'Tarjeta personal, ligada a tu teléfono. No se suma a OFERTA ni a “Llevá 2”.' : 'Cartão pessoal, ligado ao seu telefone. Não soma com OFERTA nem com “Leve 2”.')) };
}
// 61g cartão avulso gerado pelo dono (qualquer %)
function mailLoja(c, es) {
  const n = prim(c);
  return { to: c.email, subject: es ? 'Un regalo de La Fouch' : 'Um presente da La Fouch',
    html: E.molde(es ? 'Un regalo para ' + E.I('vos') : 'Um presente para ' + E.I('você'), E.P((n ? n + ', ' : '') + (es ? (n ? 'esta' : 'Esta') + ' tarjeta es una atención de La Fouch para tu próxima compra:' : (n ? 'este' : 'Este') + ' cartão é um agrado da La Fouch para a sua próxima compra:')) + cartaoP(c, es) + usarB(c, es) + regraAuto(es)) };
}
// 61h/62 cupom do evento dentro do e-mail de novidades do evento: o ÚNICO cartão com o código à vista; cores da temática do site
function blocoEvento(c, es) {
  const ev = E.EV[c.tema] ? c.tema : '', nomeEv = ev ? (es ? E.EV[ev].es : E.EV[ev].n) : '';
  return E.luxo({ ev, tema: 'marfim', rot: es ? 'CUPÓN DEL EVENTO' : 'CUPOM DO EVENTO', pct: c.pct + '%', tit: (es ? 'de descuento' : 'de desconto') + (nomeEv ? ' · ' + nomeEv : ''), cod: E.esc(c.cod), nome: es ? 'PARA TODOS' : 'PARA TODOS', val: c.fim ? (es ? 'HASTA ' : 'ATÉ ') + dt(c.fim, es) : '' }) +
    usarB(c, es) + E.PQ(es ? 'Un código por compra. No vale para piezas en OFERTA ni para el “Llevá 2”.' : 'Um código por compra. Não vale para peças em OFERTA nem para o “Leve 2”.');
}
// boas-vindas (58b): continua mostrando o código, como aprovado; texto que serve para qualquer pessoa
function mail(c, es, am) {
  const n = c.pct + '%', l = 'https://lafouch.com/?t=' + encodeURIComponent(c.cod);
  const dt = (x) => new Date(x).toLocaleDateString(es ? 'es-PY' : 'pt-BR', { timeZone: 'America/Asuncion' });
  const val = (x, loja) => x.fim ? (es ? 'Válido hasta ' : 'Vale até ') + dt(x.fim) + (loja ? ' · ' + (es ? 'en lafouch.com y en la tienda' : 'em lafouch.com e na loja') : '') : '';
  const bv = c.tipo === 'bv', fiel = c.tipo === 'fiel';
  // S393 (esboços 58b/58c): assuntos mais curtos; o molde é o de todos os e-mails
  const tit = fiel ? (es ? 'Tu regalo de cliente fiel: ' + n + ' en tu próxima compra' : 'Seu presente de cliente fiel: ' + n + ' na próxima compra') : bv ? (es ? 'Te damos la bienvenida a La Fouch: ' + n + ' en tu primera compra' : 'Boas-vindas à La Fouch: ' + n + ' na primeira compra') : (es ? 'Tu tarjeta: ' + n + ' en tu próxima compra' : 'Seu cartão: ' + n + ' na próxima compra');
  const h1 = fiel ? (es ? 'Qué bueno tenerte de ' + E.I('vuelta') : 'Que bom ter você de ' + E.I('volta')) : bv ? (es ? 'Te damos la bienvenida a ' + E.I('La Fouch') : 'Boas-vindas à ' + E.I('La Fouch')) : (es ? 'Tu ' + E.I('tarjeta') : 'Seu ' + E.I('cartão'));
  const intro = fiel ? (es ? 'Sos cliente fiel. Tu regalo para la próxima compra:' : 'Você é cliente fiel. Seu presente para a próxima compra:') : bv ? (es ? 'Tu regalo para la primera compra:' : 'Seu presente para a primeira compra:') : (es ? 'Tu regalo para la próxima compra:' : 'Seu presente para a próxima compra:');
  const rot = es ? 'TARJETA REGALO' : 'CARTÃO PRESENTE';
  const regra = E.PQ(es ? 'Un código por compra. No se suma a OFERTA ni a “Llevá 2”: se aplica el descuento mayor.' : 'Um código por compra. Não soma com OFERTA nem com “Leve 2”: vale o maior desconto.');
  const amiga = '';
  return {
    to: c.email,
    subject: tit,
    html: E.molde(h1, E.P(intro) + E.cartao(rot, n + (bv ? (es ? ' en tu primera compra' : ' na primeira compra') : (es ? ' en tu próxima compra' : ' na próxima compra')), c.cod, val(c, true), true) + E.B(es ? 'Usar ahora' : 'Usar agora', l) + amiga + regra),
  };
}
module.exports = { Falha, PADRAO, TETO_MES, AMIGA_MES, CONVITE_DIAS, ENTRE_PRESENTES, META, novoCod, codN, telN, vivo, ver, usar, boasVindas, proxima, confirma, entregue, solta, premia, diario, libera, emitir, cancelar, destrava, lista, meus, mail, mailPresente, mailFiel, mailConvite, mailCresceu, mailIndicou, mailVip, mailLoja, blocoEvento };
