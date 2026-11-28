// Testes dos cupons. S400 (17/11/2026): presente só na entrega, 10% só na 1ª compra, convite 2 semanas depois, um presente por vez (30 dias),
// VIP com validade e nº de compras, cartões de luxo sem gênero. S409: escada nova (10% · 15% · presente especial, cartões separados,
// recomeça), sem boas-vindas, VIP 20% com status e aniversário, nenhum cartão com código à vista, presente especial só no site.
const C = require('./cupom');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
function dbFake(compras) {
  const m = {}, mes = {}, tent = {}, av = [], cli = {}, cnt = {};
  return {
    m, mes, av, cliM: cli,
    get: async (k) => m[k] || null, salva: async (k, o) => { m[k] = o; }, muda: async (k, c) => { Object.assign(m[k], c); },
    getMes: async (k) => mes[k] || null, somaMes: async (k, v) => { mes[k] = mes[k] || { desc: 0 }; mes[k].desc += v; },
    getTent: async (k) => tent[k] || null, salvaTent: async (k, o) => { tent[k] = o; },
    aviso: async (o) => { av.push(o); }, avisos: async () => av.slice(-30),
    jaComprou: async (tel, em) => (compras || []).some((x) => (tel && x === tel) || (em && x === em)),
    bvDe: async (em, tel) => Object.values(m).some((c) => c.tipo === 'bv' && ((em && c.email === em) || (tel && c.tel === tel))),
    porPid: async (pid, tipo) => Object.values(m).find((c) => c.pid === pid && c.tipo === tipo) || null,
    comUsoDe: async (pid) => Object.values(m).filter((c) => (c.usos || []).some((u) => u.pid === pid)),
    todos: async () => Object.values(m), doEmail: async (em) => Object.values(m).filter((c) => c.email === em),
    doTel: async (tel) => Object.values(m).filter((c) => c.tel === tel),
    fila: async () => Object.values(m).filter((c) => c.st === 'fila'),
    convites: async (ag) => Object.values(m).filter((c) => c.st === 'pend' && c.tipo === 'am' && c.conv && c.conv <= ag),
    cli: async (tel) => cli[tel] || null, cliMuda: async (tel, o) => { cli[tel] = Object.assign(cli[tel] || {}, o); },
    indMais: async (tel) => { cli[tel] = cli[tel] || {}; cli[tel].ind = (cli[tel].ind || 0) + 1; return cli[tel].ind; },
    vips: async () => Object.keys(cli).filter((t) => cli[t].vip).map((t) => Object.assign({ tel: t }, cli[t])),
    contaPaga: async (tel, pid) => { cnt[tel] = cnt[tel] || []; if (cnt[tel].includes(pid)) return null; cnt[tel].push(pid); return cnt[tel].length; },
  };
}
(async () => {
  const T0 = Date.UTC(2026, 10, 12, 12), D = 864e5, env = [], envia = async (x) => { env.push(x); };
  const ult = () => env[env.length - 1];
  const db = dbFake(['981999888']);
  // S409: não existe mais cupom de boas-vindas
  let r = await C.boasVindas(db, envia, { email: 'Ana@Gmail.com', tel: '+595 981 123 456', lang: 'es' }, T0);
  ok(!r.ok && r.motivo === 'fim' && env.length === 0 && !Object.values(db.m).length, 'boas-vindas: acabou (nenhum cupom, nenhum e-mail)');
  r = await C.boasVindas(db, envia, { email: 'x@y.com', antigo: true }, T0); ok(!r.ok, 'boas-vindas: nenhum jeito de pedir o cupom antigo');
  // usar no site (cartão avulso do dono, 1 uso)
  const av0 = (await C.emitir(db, { tipo: 'px', pct: 10, tel: '0981123456' }, T0)).cod;
  r = await C.ver(db, { cod: av0.toLowerCase(), tel: '0981123456' }, 'ip1', T0); ok(r.ok && r.cupom.pct === 10, 'confere o código (minúscula também vale)');
  let e = ''; try { await C.usar(db, { cod: av0, tel: '0981123456', total: 200000, desc: 50000, pid: 'P1' }, 'ip1', T0); } catch (x) { e = x.motivo; } ok(e === 'desc', 'desconto maior que o % é recusado');
  r = await C.usar(db, { cod: av0, tel: '0981123456', email: 'ana@gmail.com', total: 245000, desc: 24000, pid: 'P1' }, 'ip1', T0);
  ok(r.ok && db.m[av0].usos[0].st === 'res', 'usa: fica reservado até o pagamento');
  r = await C.ver(db, { cod: av0, tel: '0981123456' }, 'ip1', T0 + 1000); ok(!r.ok && r.motivo === 'usado', 'código de 1 uso não vale de novo');
  await C.libera(db, { pid: 'P1' }, T0 + 2000); r = await C.ver(db, { cod: av0, tel: '0981123456' }, 'ip1', T0 + 3000); ok(r.ok, 'pedido cancelado: o código volta a valer');

  // ---- 1ª compra: nada no pagamento; cartão de 10% só na ENTREGA ----
  await C.usar(db, { cod: av0, tel: '0981123456', email: 'ana@gmail.com', total: 245000, desc: 24000, pid: 'P2' }, 'ip1', T0 + 4000);
  const px0 = await C.proxima(db, { pid: 'P2', tel: '0981123456', email: 'ana@gmail.com', lang: 'pt', nome: 'Maria González' }, T0 + 4000);
  ok(px0.ok && px0.cupom.estado === 'pendente', 'o pedido nasce com o cartão pendente');
  const n0 = env.length;
  r = await C.confirma(db, envia, { pid: 'P2' }, T0 + 5000);
  const px = px0.cupom.cod, amA = Object.values(db.m).find((c) => c.tipo === 'am' && c.pid === 'P2');
  ok(r.ok && db.m[av0].usos[0].st === 'ok' && db.m[px].st === 'pend' && db.m[px].n === 1 && env.length === n0 && amA.st === 'pend', 'pagamento confirmado: uso ok, NENHUM cartão e nenhum e-mail ainda');
  r = await C.entregue(db, envia, { pid: 'P2' }, T0 + D);
  ok(r.ok && r.cartoes[0] === px && db.m[px].st === 'ativo' && env.length === n0 + 1 && /Sua compra chegou/.test(ult().subject), 'ENTREGUE: o cartão de 10% passa a valer e sai o e-mail 61a');
  ok(/MARIA GONZÁLEZ/.test(ult().html) && /cartao-branco\.png/.test(ult().html) && !/cartao-ouro\.png/.test(ult().html) && ult().html.indexOf('>' + px + '<') < 0 && !/Leve 2/.test(ult().html), '61a/73f: cartão vinho com o logo BRANCO, sem o código à vista, sem "Leve 2"');
  r = await C.entregue(db, envia, { pid: 'P2' }, T0 + D + 5); ok(r.fora && env.length === n0 + 1, 'marcar entregue de novo não manda outro e-mail');
  r = await C.diario(db, envia, T0 + 15 * D + 1); ok(r.convites === 1 && /Um presente para quem você gosta/.test(ult().subject), '61b: convite sai 2 semanas depois');
  const am = amA.cod;
  r = await C.ver(db, { cod: am, tel: '0981123456' }, 'ip3', T0 + 16 * D); ok(!r.ok && r.motivo === 'proprio', 'indicação: quem indica não usa o próprio presente');

  // ---- ESCADA (S409): 1ª indicação = cartão NOVO de 10% (o de 10% da compra não cresce) ----
  const indica = async (i, t) => { const tel = '09830000' + String(i).padStart(2, '0'); await C.usar(db, { cod: am, tel, email: 'i' + i + '@x.com', total: 150000, desc: 15000, pid: 'I' + i }, 'ipI' + i, t); return C.confirma(db, envia, { pid: 'I' + i }, t + 10); };
  const meusPx = () => Object.values(db.m).filter((c) => c.tel === '981123456' && (c.tipo === 'px' || c.tipo === 'pe'));
  r = await indica(1, T0 + 17 * D);
  let L = meusPx(), c1 = L.find((c) => c.de === 'ind:1');
  ok(db.m[px].pct === 10 && c1 && c1.pct === 10 && c1.st === 'fila', '1ª indicação: cartão de 10% SEPARADO, guardado (um presente por vez); o cartão que ela tinha NÃO cresce');
  ok(!env.some((m) => /cresceu/.test(m.subject)), 'nunca mais sai "Seu cartão cresceu"');
  let mm = await C.meus(db, 'ana@gmail.com', T0 + 17 * D); ok(mm.escada.deg === 2 && mm.escada.feitas === 0 && mm.escada.tot === 3 && mm.guardados === 1, 'Minha conta: degrau 2, 0 de 3, 1 presente guardado');
  // usa o cartão da compra → depois de 30 dias do último e-mail o da indicação sai, com o e-mail 68e
  await C.usar(db, { cod: px, tel: '0981123456', email: 'ana@gmail.com', total: 100000, desc: 10000, pid: 'U1' }, 'ip1', T0 + 18 * D); await C.confirma(db, envia, { pid: 'U1' }, T0 + 18 * D + 5);
  r = await C.diario(db, envia, T0 + 40 * D);
  ok(r.soltos === 1 && db.m[c1.cod].st === 'ativo' && /Sua indicação comprou/.test(ult().subject) && /10%/.test(ult().html) && /próximo presente, que é surpresa/.test(ult().html) && /valign="middle"/.test(ult().html), '68e: o cartão da 1ª indicação sai com a escada (próximos em surpresa, números centrados)');
  ok(/>\?</.test(ult().html) && !/>15%</.test(ult().html), '68e: o 15% e o presente aparecem como "?"');
  await indica(2, T0 + 41 * D); await indica(3, T0 + 42 * D);
  ok(!meusPx().some((c) => c.pct === 15), '2ª e 3ª indicações: só contam');
  await indica(4, T0 + 43 * D);
  const c4 = meusPx().find((c) => c.de === 'ind:4');
  ok(c4 && c4.pct === 15 && c4.st === 'fila' && db.m[c1.cod].pct === 10, 'mais 3 (4ª no total): cartão NOVO de 15%, separado; o de 10% continua 10%');
  for (let i = 5; i <= 9; i++) await indica(i, T0 + 40 * D + i * D);
  const c9 = meusPx().find((c) => c.tipo === 'pe');
  ok(c9 && c9.de === 'ind:9' && c9.fim - c9.ts === 120 * D && db.av.some((a) => a.t === 'escada'), 'mais 5 (9ª): "Na compra de um, leve outro de presente" (120 dias) + aviso ao dono: escada completa');
  mm = await C.meus(db, 'ana@gmail.com', T0 + 50 * D); ok(mm.escada.deg === 1 && mm.escada.feitas === 0 && mm.indicacoes === 9, 'a escada RECOMEÇA do 10%');
  await indica(10, T0 + 51 * D); ok(meusPx().filter((c) => c.de === 'ind:1').length === 2, '10ª indicação: de novo um cartão de 10%');
  const me = C.mailEspecial(Object.assign({}, c9, { email: 'ana@gmail.com' }), false, 9);
  ok(/Na compra de um,<br>leve outro de presente/.test(me.html) && /só no site/.test(me.html) && /✦✦✦✦✦/.test(me.html) && me.html.indexOf('>' + c9.cod + '<') < 0, '63a: e-mail do presente especial, só no site, sem código');
  const m15 = C.mailIndicou(Object.assign({}, c4, { email: 'a@x.com' }), false, 4); ok(/3 indicações · um cartão de 15%/.test(m15.subject) && /cartão separado/.test(m15.html), '68f: e-mail do 15% diz que é separado');
  // presente especial: só no site, nunca no caixa; o desconto precisa deixar uma peça paga
  db.m[c9.cod].st = 'ativo';
  r = await C.usar(db, { cod: c9.cod, tel: '0981123456', total: 200000, desc: 95000, pid: 'G0' }, 'ipG', T0 + 60 * D, true); ok(!r.ok && r.motivo === 'site', 'presente especial não vale no caixa da loja');
  e = ''; try { await C.usar(db, { cod: c9.cod, tel: '0981123456', total: 95000, desc: 95000, pid: 'G1' }, 'ipG', T0 + 60 * D); } catch (x) { e = x.motivo; } ok(e === 'desc', 'BURLA: presente especial sem peça paga (desconto = carrinho inteiro) é recusado');
  r = await C.usar(db, { cod: c9.cod, tel: '0981123456', total: 195000, desc: 95000, pid: 'G2' }, 'ipG', T0 + 60 * D); ok(r.ok, 'presente especial com uma peça paga: reservado');
  r = await C.ver(db, { cod: c9.cod, tel: '0981123456' }, 'ipG', T0 + 60 * D + 9); ok(!r.ok && r.motivo === 'usado', 'BURLA: o mesmo presente em outro pedido aberto: não vale');

  // ---- evento: sem código à vista, botão na temática ----
  r = await C.emitir(db, { tipo: 'ev', cod: 'navidad10', pct: 10, max: 2, ini: T0, fim: T0 + 30 * D, tema: 'natal' }, T0); ok(r.ok && r.cod === 'NAVIDAD10', 'cupom do evento com código escolhido (interno)');
  const be = C.blocoEvento(db.m.NAVIDAD10, false);
  ok(!/NAVIDAD10/.test(be.replace(/href="[^"]*"/g, '')) && /de desconto · Natal/.test(be) && /background:#1f5c3a;color:#ffffff/.test(be) && !/toda a loja|Leve 2/.test(be), '61h/62: cartão do evento SEM o código à vista, botão verde do Natal');
  r = await C.ver(db, { cod: 'NAVIDAD10', tel: '0984' }, 'ip4', T0); ok(r.ok && r.cupom.restam === 2, 'site mostra "restam 2 de 2"');
  await C.usar(db, { cod: 'NAVIDAD10', tel: '0984000001', total: 100000, desc: 10000, pid: 'E1' }, 'ip4', T0);
  r = await C.ver(db, { cod: 'NAVIDAD10', tel: '0984000001' }, 'ip4', T0); ok(!r.ok && r.motivo === 'ja', 'evento: 1 vez por pessoa');
  await C.usar(db, { cod: 'NAVIDAD10', tel: '0984000002', total: 100000, desc: 10000, pid: 'E2' }, 'ip4', T0);
  r = await C.ver(db, { cod: 'NAVIDAD10', tel: '0984000003' }, 'ip4', T0); ok(!r.ok && r.motivo === 'esgotado', 'evento acaba no limite total');
  for (let i = 0; i < 30; i++) await C.ver(db, { cod: 'LF-ZZY' + i }, 'ipY', T0);
  r = await C.ver(db, { cod: am, tel: '0985000222' }, 'ipY', T0 + 1); ok(!r.ok && r.motivo === 'nao', 'robô (30+ erros na hora) recebe só "não encontrado"');

  // ---- VIP (S409): 20%, status para sempre, e-mail 68b na primeira vez, aniversário ----
  r = await C.emitir(db, { tipo: 'vip', tel: '0986', nome: 'Carlos Benítez', email: 'vip@x.com', fim: T0 + 180 * D, nasc: '5/3' }, T0, envia);
  let v = db.m[r.cod];
  ok(r.ok && v.pct === 20 && v.max === 1 && db.cliM['0986'].vip === T0 && db.cliM['0986'].nasc === '05/03' && /Você agora é Cliente VIP/.test(ult().subject) && /Reserva de 3 horas/.test(ult().html) && !/24 horas/.test(ult().html), '68b: VIP padrão 20%, status, e-mail "Você agora é Cliente VIP" com a reserva de 3 horas');
  r = await C.emitir(db, { tipo: 'vip', tel: '0986', nome: 'Carlos', email: 'vip@x.com', max: 3 }, T0 + D, envia);
  ok(db.cliM['0986'].vip === T0 && /Um cartão VIP para você/.test(ult().subject) && /em 3 compras/.test(ult().html), 'segundo cartão VIP: o status continua desde a 1ª vez; e-mail simples');
  const na = env.length;
  r = await C.diario(db, envia, Date.UTC(2027, 2, 5, 15)); ok(r.aniversarios === 1 && /Feliz aniversário/.test(ult().subject) && /FELIZ ANIVERSÁRIO/.test(ult().html) && /34px 34px/.test(ult().html), '67b: no aniversário o VIP recebe 10% por 30 dias (cartão preto com confete)');
  const ca = Object.values(db.m).find((c) => c.tipo === 'ani'); ok(ca && ca.pct === 10 && ca.fim - ca.ts === 30 * D && ca.st === 'ativo', 'cartão de aniversário: 10%, 30 dias, fora da fila');
  r = await C.diario(db, envia, Date.UTC(2027, 2, 5, 20)); ok(r.aniversarios === 0, 'aniversário: uma vez por ano');
  db.cliM['555'] = { nasc: '05/03', nome: 'Sem VIP', email: 'n@x.com' }; r = await C.diario(db, envia, Date.UTC(2028, 2, 5, 15)); ok(!Object.values(db.m).some((c) => c.tipo === 'ani' && c.tel === '555'), 'quem não é VIP não recebe presente de aniversário');
  mm = await C.meus(db, 'vip@x.com', T0 + 2 * D); ok(mm.vip === T0, 'Minha conta recebe o status VIP');
  r = await C.emitir(db, { tipo: 'px', pct: 20, tel: '0986222', nome: 'Maria González', email: 'agrado@x.com' }, T0, envia);
  ok(r.enviou && /Um presente da La Fouch/.test(ult().subject) && ult().html.indexOf('>' + r.cod + '<') < 0, '61g: cartão avulso do dono vai por e-mail, sem o código à vista');
  ok(/Tu compra llegó/.test(C.mailPresente(Object.assign({}, db.m[px], { tipo: 'px', de: '' }), true).subject) && /alguien especial/.test(C.mailConvite(db.m[am], true).html) && /sorpresa/.test(C.mailIndicou(c1, true, 1).html), 'e-mails em espanhol');

  // pedido cancelado antes de pagar
  const pb = await C.proxima(db, { pid: 'B9', tel: '0982333555', email: 'cris@x.com' }, T0); await C.libera(db, { pid: 'B9' }, T0 + 50);
  ok(db.m[pb.cupom.cod].st === 'canc' && db.m[pb.amiga.cod].st === 'canc', 'cancelar o pedido cancela os cartões pendentes');
  r = await C.entregue(db, envia, { pid: 'B9' }, T0 + 60); ok(r.fora, 'entregue sem pagamento confirmado não dá presente');

  // dois pedidos no mesmo segundo com um cupom de 1 uso → só um leva (transação)
  let fila = Promise.resolve();
  db.trans = (k, fn) => { const p = fila.then(async () => { const c = JSON.parse(JSON.stringify(db.m[k] || null)); let w = null; const r2 = await fn(c, (o) => { w = o; }); if (w) Object.assign(db.m[k], w); return r2; }); fila = p.catch(() => {}); return p; };
  const u1 = await C.emitir(db, { tipo: 'px', tel: '0983444555', email: '' }, T0), cu = u1.cupom.cod;
  const [ra, rb] = await Promise.all([C.usar(db, { cod: cu, tel: '0983444555', total: 200000, desc: 20000, pid: 'Q1' }, 'ipQ', T0 + 1), C.usar(db, { cod: cu, tel: '0983444555', total: 200000, desc: 20000, pid: 'Q2' }, 'ipQ', T0 + 1)]);
  ok([ra, rb].filter((x) => x.ok).length === 1 && db.m[cu].usos.length === 1, 'BURLA (duas abas): cupom de 1 uso vale só para um pedido');
  const tv = {}; db.trava = async (k) => { if (tv[k]) return false; tv[k] = 1; return true; }; db.criaSe = async (k, o) => { if (db.m[k]) return false; db.m[k] = JSON.parse(JSON.stringify(o)); return true; }; db.espera = 5;
  const [p1, p2] = await Promise.all([C.proxima(db, { pid: 'Z1', tel: '0986111222', email: 'z@x.com' }, T0), C.proxima(db, { pid: 'Z1', tel: '0986111222', email: 'z@x.com' }, T0)]);
  ok(p1.ok && p2.ok && p1.cupom.cod === p2.cupom.cod && Object.values(db.m).filter((c) => c.pid === 'Z1').length === 2, 'pedido: 2 chamadas juntas = 1 par de cartões');
  await Promise.all([C.confirma(db, envia, { pid: 'Z1' }, T0 + 9600), C.confirma(db, envia, { pid: 'Z1' }, T0 + 9600)]);
  const nz = env.length;
  const [e1, e2] = await Promise.all([C.entregue(db, envia, { pid: 'Z1' }, T0 + D), C.entregue(db, envia, { pid: 'Z1' }, T0 + D)]);
  ok([e1, e2].filter((x) => !x.fora).length === 1 && env.length === nz + 1, 'marcar entregue em 2 aparelhos juntos = 1 presente e 1 e-mail');
  console.log(falhas ? falhas + ' FALHA(S)' : 'cupom: tudo ok');
  process.exit(falhas ? 1 : 0);
})();
