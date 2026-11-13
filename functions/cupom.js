// Cupons e cartões virtuais (S174 v1+v2+v3, aprovados 11/11/2026). Um sistema só: o site e o caixa do app usam os mesmos códigos.
// Tipos: bv Boas-vindas 5% (ao se inscrever, 30 dias, 1 por e-mail e por telefone, só quem nunca comprou, compra mínima)
//        px Próxima compra 10% (vem com a compra paga) · am Indique uma amiga 10% (a amiga usa; você ganha outro px depois de pago + 7 dias, até 5 por mês)
//        vip 15% (pessoal, vale sempre; emitido à mão) · fiel Cliente fiel 10% (S194: a cada 3 compras pagas, 1 uso, sozinho) · ev cupom do evento
// Proteções sempre ligadas: 1 código por compra (o site/caixa aplicam só 1), vale o maior desconto (site/caixa), nunca abaixo do piso (site/caixa),
// código pessoal preso ao 1º telefone (outro telefone = recusa + aviso ao dono com 4+ telefones no dia; S194: sem trava de 24 h),
// anti-robô invisível: 30+ códigos errados por hora no mesmo endereço passam a receber 'não encontrado' (sem espera visível).
// S194: SEM teto do mês.
// Regra pura: o banco vem por "db" (ver index.js). Datas em ms.
const crypto = require('crypto');
class Falha extends Error { constructor(m, s) { super(m); this.motivo = m; this.status = s || 400; } }
const DIA = 864e5;
const LETRAS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem O/0 e I/1
const PADRAO = { bv: { pct: 5, dias: 30, min: 100000 }, px: { pct: 10, dias: 120, min: 0 }, am: { pct: 10, dias: 365, min: 0 }, vip: { pct: 15, dias: 0, min: 0 }, fiel: { pct: 10, dias: 120, min: 0, cada: 3 } };
const TETO_MES = 500000, AMIGA_MES = 5, TEL_DIF = 4, ERRADOS_HORA = 30;
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
  if (c.st === 'pend') return 'pendente';
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
async function cria(db, o, agora) {
  for (let i = 0; i < 6; i++) {
    const cod = o.cod || novoCod();
    if (await db.get(cod)) { if (o.cod) throw new Falha('existe'); continue; }
    const c = Object.assign({ cod, ts: agora, ini: agora, usos: [], st: 'ativo', max: 1 }, o, { cod });
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
    const dia = (c.outros || []).filter((x) => agora - x.ts < DIA);
    if (!dia.some((x) => x.tel === tel)) dia.push({ tel, ts: agora });
    const muitos = dia.length >= TEL_DIF;
    await db.muda(cod, { outros: dia });
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
  const usos = (c.usos || []).filter((u) => u.pid !== pid).concat([{ pid, tel, email: em, ts: agora, st: caixa ? 'ok' : 'res', desc, total, canal: caixa ? 'loja' : 'site' }]);
  const muda = { usos, pids: usos.map((u) => u.pid) };
  if (!c.tel && tel && c.tipo !== 'ev' && c.tipo !== 'am') muda.tel = tel; // preso ao 1º telefone
  await db.muda(c.cod, muda);
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
  const P = PADRAO.px, c = await cria(db, { tipo: 'px', pct: P.pct, fim: agora + P.dias * DIA, min: P.min, email: em, tel, pid, st: 'pend', lang: b.lang === 'es' ? 'es' : 'pt' }, agora);
  const am = await cria(db, { tipo: 'am', pct: PADRAO.am.pct, fim: agora + PADRAO.am.dias * DIA, max: 0, por: { tel, email: em }, email: em, tel: '', pid, st: 'pend', de: 'pedido:' + pid }, agora);
  return { ok: true, cupom: publico(c, agora), amiga: publico(am, agora) };
}
// app (dono): pagamento do pedido confirmado → usos viram "ok", o cartão Próxima compra e o da Amiga ficam valendo e vão por e-mail;
// quem indicou ganha outro Próxima compra que começa a valer 7 dias depois (até 5 por mês)
async function confirma(db, envia, b, agora) {
  const pid = limpa(b.pid, 40);
  if (!pid) throw new Falha('pid');
  const out = { usados: 0, cartoes: [] };
  for (const c of await db.comUsoDe(pid)) {
    const usos = (c.usos || []).map((u) => (u.pid === pid ? Object.assign({}, u, { st: 'ok' }) : u));
    await db.muda(c.cod, { usos });
    out.usados++;
    if (c.tipo === 'am' && c.por) {
      const mes = mesDe(agora), n = (c.premios || []).filter((x) => mesDe(x) === mes).length;
      if (n < AMIGA_MES) {
        const P = PADRAO.px, pr = await cria(db, { tipo: 'px', pct: P.pct, ini: agora + 7 * DIA, fim: agora + 7 * DIA + P.dias * DIA, email: c.por.email || '', tel: c.por.tel || '', de: 'amiga:' + c.cod }, agora);
        await db.muda(c.cod, { premios: (c.premios || []).concat([agora]) });
        out.cartoes.push(pr.cod);
      }
    }
  }
  const px = await db.porPid(pid, 'px');
  if (px && db.comprou) try { await db.comprou(px.tel, px.email); } catch (e) {}
  // S194 Cliente fiel: a cada 3 compras pagas (contadas uma vez por pedido) ganha 10% para 1 compra
  if (px && px.tel && db.contaPaga) {
    let n = null;
    try { n = await db.contaPaga(px.tel, pid); } catch (e) {}
    if (n && n % PADRAO.fiel.cada === 0) {
      const P = PADRAO.fiel, fi = await cria(db, { tipo: 'fiel', pct: P.pct, fim: agora + P.dias * DIA, max: 1, email: px.email || '', tel: px.tel, de: 'fiel:' + n }, agora);
      out.cartoes.push(fi.cod);
      if (envia && px.email) try { await envia(mail(fi, px.lang === 'es')); } catch (e) {}
    }
  }
  if (px && px.st === 'pend') {
    await db.muda(px.cod, { st: 'ativo', ini: agora, fim: agora + PADRAO.px.dias * DIA });
    let am = await db.porPid(pid, 'am');
    if (am && am.st === 'pend') { await db.muda(am.cod, { st: 'ativo', ini: agora, fim: agora + PADRAO.am.dias * DIA }); am = Object.assign({}, am, { st: 'ativo' }); }
    else if (!am) am = await cria(db, { tipo: 'am', pct: PADRAO.am.pct, fim: agora + PADRAO.am.dias * DIA, max: 0, por: { tel: px.tel, email: px.email }, email: px.email, tel: '', pid, de: 'pedido:' + pid }, agora);
    out.cartoes.push(px.cod, am.cod);
    if (envia && px.email) try { await envia(mail(Object.assign({}, px, { st: 'ativo' }), px.lang === 'es', am)); } catch (e) {}
  }
  return Object.assign({ ok: true }, out);
}
// app (dono): pedido cancelado → solta o código reservado e cancela o cartão pendente
async function libera(db, b, agora) {
  const pid = limpa(b.pid, 40);
  let n = 0;
  for (const c of await db.comUsoDe(pid)) {
    const u = (c.usos || []).find((x) => x.pid === pid && x.st === 'res');
    const us = (c.usos || []).filter((x) => !(x.pid === pid && x.st === 'res'));
    await db.muda(c.cod, { usos: us, pids: us.map((x) => x.pid) });
    if (u) await db.somaMes(mesDe(u.ts), -(u.desc || 0));
    n++;
  }
  const px = await db.porPid(pid, 'px');
  if (px && px.st === 'pend') await db.muda(px.cod, { st: 'canc' });
  const am = await db.porPid(pid, 'am');
  if (am && am.st === 'pend') await db.muda(am.cod, { st: 'canc' });
  return { ok: true, n };
}
// app (dono): criar VIP / Próxima compra na loja / cupom do evento; cancelar; listar
async function emitir(db, b, agora) {
  const tipo = ['vip', 'px', 'am', 'ev'].indexOf(b.tipo) >= 0 ? b.tipo : '';
  if (!tipo) throw new Falha('tipo');
  const pct = Math.round(+b.pct || (PADRAO[tipo] || {}).pct || 0);
  if (!(pct >= 1 && pct <= 30)) throw new Falha('pct');
  const o = { tipo, pct, email: emN(b.email), tel: telN(b.tel), nome: limpa(b.nome, 60), min: Math.max(0, Math.round(+b.min || 0)) };
  if (tipo === 'ev') {
    const cod = limpa(b.cod, 16).toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cod.length < 4) throw new Falha('cod');
    Object.assign(o, { cod, ini: +b.ini || agora, fim: +b.fim || agora + 30 * DIA, max: Math.max(1, Math.min(1000, Math.round(+b.max || 50))), tel: '', email: '', tema: limpa(b.tema, 20) });
  } else if (tipo === 'vip') Object.assign(o, { fim: 0, max: 0 });
  else if (tipo === 'am') Object.assign(o, { fim: agora + PADRAO.am.dias * DIA, max: 0, por: { tel: o.tel, email: o.email }, tel: '' });
  else Object.assign(o, { fim: agora + PADRAO.px.dias * DIA, max: 1 });
  const c = await cria(db, o, agora);
  return { ok: true, cupom: publico(c, agora), cod: c.cod };
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
  return { ok: true, cupons: (await db.doEmail(em)).filter((c) => c.st !== 'canc').map((c) => Object.assign(publico(c, agora), { usado: (c.usos || []).some((u) => u.st === 'ok' && u.email === em) }, c.tipo === 'am' ? { amigas: (c.usos || []).filter((u) => u.st === 'ok').length, ganhos: (c.premios || []).length, porMes: AMIGA_MES } : {})) };
}
function mail(c, es, am) {
  const n = c.pct + '%', l = 'https://lafouch.com/?t=' + encodeURIComponent(c.cod), f = c.fim ? new Date(c.fim).toLocaleDateString(es ? 'es-PY' : 'pt-BR', { timeZone: 'America/Asuncion' }) : '';
  const tit = c.tipo === 'fiel' ? (es ? '¡Gracias por ser cliente fiel! Tu regalo: ' + n + ' en tu próxima compra' : 'Obrigado por ser cliente fiel! Seu presente: ' + n + ' na próxima compra') : c.tipo === 'bv' ? (es ? '¡Bienvenida a La Fouch! Tu regalo: ' + n + ' en tu primera compra' : 'Bem-vinda à La Fouch! Seu presente: ' + n + ' na primeira compra') : (es ? 'Tu tarjeta: ' + n + ' en tu próxima compra' : 'Seu cartão: ' + n + ' na próxima compra');
  const card = (x, t) => '<div style="border-radius:16px;background:#2b1a2a;color:#fff;padding:18px 20px;margin:12px 0;max-width:360px"><div style="font:600 12px Arial;letter-spacing:.2em;opacity:.8">LA FOUCH</div><div style="font:700 20px Georgia,serif;margin:8px 0">' + t + '</div><div style="font:700 26px monospace;letter-spacing:.1em">' + x.cod + '</div>' + (x.fim ? '<div style="font:12px Arial;opacity:.8;margin-top:6px">' + (es ? 'Válido hasta ' : 'Vale até ') + new Date(x.fim).toLocaleDateString(es ? 'es-PY' : 'pt-BR', { timeZone: 'America/Asuncion' }) + ' · ' + (es ? 'en lafouch.com y en la tienda' : 'em lafouch.com e na loja') + '</div>' : '') + '</div>';
  return {
    to: c.email,
    subject: tit,
    html: '<div style="font-family:Arial,sans-serif;font-size:15px;color:#222"><p><b>' + tit + '</b></p>' + card(c, n + (c.tipo === 'bv' ? (es ? ' en tu primera compra' : ' na primeira compra') : (es ? ' en tu próxima compra' : ' na próxima compra'))) +
      (am ? '<p>' + (es ? 'Y una para compartir: tu amiga gana 10% en su primera compra y vos ganás otra tarjeta de 10%.' : 'E um para compartilhar: sua amiga ganha 10% na primeira compra e você ganha outro cartão de 10%.') + '</p>' + card(am, es ? '10% para tu amiga' : '10% para sua amiga') : '') +
      '<p><a href="' + l + '" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#a44a7e;color:#fff;text-decoration:none;font-weight:bold">' + (es ? 'Usar ahora' : 'Usar agora') + '</a></p><p style="color:#888;font-size:12px">' + (es ? 'Un código por compra. No se suma a OFERTA ni a "Llevá 2": se aplica el descuento mayor.' : 'Um código por compra. Não soma com OFERTA nem com "Leve 2": vale o maior desconto.') + (f ? '' : '') + '</p></div>',
  };
}
module.exports = { Falha, PADRAO, TETO_MES, AMIGA_MES, novoCod, codN, telN, vivo, ver, usar, boasVindas, proxima, confirma, libera, emitir, cancelar, destrava, lista, meus, mail };
