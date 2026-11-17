// Testes dos cupons. S400 (17/11/2026): regras novas — presente só na entrega, 10% só na 1ª compra, convite 2 semanas depois,
// um presente por vez (30 dias), indicação faz o cartão crescer, VIP com validade e nº de compras, cartões de luxo sem gênero.
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
    contaPaga: async (tel, pid) => { cnt[tel] = cnt[tel] || []; if (cnt[tel].includes(pid)) return null; cnt[tel].push(pid); return cnt[tel].length; },
  };
}
(async () => {
  const T0 = Date.UTC(2026, 10, 12, 12), D = 864e5, env = [], envia = async (x) => { env.push(x); };
  const ult = () => env[env.length - 1];
  const db = dbFake(['981999888']);
  // boas-vindas
  let r = await C.boasVindas(db, envia, { email: 'Ana@Gmail.com', tel: '+595 981 123 456', lang: 'es' }, T0);
  const bv = r.cupom.cod;
  ok(r.ok && /^LF-[A-HJ-NP-Z2-9]{4}$/.test(bv) && r.cupom.pct === 5 && env[0].to === 'ana@gmail.com' && /bienvenida a La Fouch/.test(env[0].subject) && !/Bienvenida a La Fouch/.test(env[0].html), 'boas-vindas 5% na tela e no e-mail, texto que serve para qualquer pessoa');
  r = await C.boasVindas(db, envia, { email: 'pt@x.com', tel: '0981 555 111' }, T0); ok(/Boas-vindas à La Fouch/.test(ult().subject) && !/Bem-vinda/.test(ult().html), 'boas-vindas em português sem "Bem-vinda"');
  r = await C.boasVindas(db, envia, { email: 'ana@gmail.com' }, T0); ok(!r.ok && r.motivo === 'ja', 'boas-vindas: 1 por e-mail');
  r = await C.boasVindas(db, envia, { email: 'outra@x.com', tel: '0981 123 456' }, T0); ok(!r.ok && r.motivo === 'ja', 'boas-vindas: 1 por telefone');
  r = await C.boasVindas(db, envia, { email: 'cli@x.com', tel: '0981 999 888' }, T0); ok(!r.ok && r.motivo === 'cliente', 'boas-vindas: só para quem nunca comprou');
  // usar no site
  r = await C.ver(db, { cod: bv.toLowerCase(), tel: '0981123456' }, 'ip1', T0); ok(r.ok && r.cupom.pct === 5, 'confere o código (minúscula também vale)');
  r = await C.usar(db, { cod: bv, tel: '0981123456', total: 90000, desc: 4500, pid: 'P1' }, 'ip1', T0); ok(!r.ok && r.motivo === 'min', 'compra mínima Gs 100 mil');
  let e = ''; try { await C.usar(db, { cod: bv, tel: '0981123456', total: 200000, desc: 50000, pid: 'P1' }, 'ip1', T0); } catch (x) { e = x.motivo; } ok(e === 'desc', 'desconto maior que o % é recusado');
  r = await C.usar(db, { cod: bv, tel: '0981123456', email: 'ana@gmail.com', total: 245000, desc: 12000, pid: 'P1' }, 'ip1', T0);
  ok(r.ok && db.m[bv].usos[0].st === 'res' && db.mes['2026-11'].desc === 12000, 'usa: fica reservado até o pagamento');
  r = await C.ver(db, { cod: bv, tel: '0981123456' }, 'ip1', T0 + 1000); ok(!r.ok && r.motivo === 'usado', 'código de 1 uso não vale de novo');
  await C.libera(db, { pid: 'P1' }, T0 + 2000); r = await C.ver(db, { cod: bv, tel: '0981123456' }, 'ip1', T0 + 3000); ok(r.ok && db.mes['2026-11'].desc === 0, 'pedido cancelado: o código volta a valer');

  // ---- 1ª compra: nada no pagamento; cartão de 10% só na ENTREGA ----
  await C.usar(db, { cod: bv, tel: '0981123456', email: 'ana@gmail.com', total: 245000, desc: 12000, pid: 'P2' }, 'ip1', T0 + 4000);
  const px0 = await C.proxima(db, { pid: 'P2', tel: '0981123456', email: 'ana@gmail.com', lang: 'pt', nome: 'Maria González' }, T0 + 4000);
  ok(px0.ok && px0.cupom.estado === 'pendente', 'o pedido nasce com o cartão pendente');
  const n0 = env.length;
  r = await C.confirma(db, envia, { pid: 'P2' }, T0 + 5000);
  const px = px0.cupom.cod, amA = Object.values(db.m).find((c) => c.tipo === 'am' && c.pid === 'P2');
  ok(r.ok && db.m[bv].usos[0].st === 'ok' && db.m[px].st === 'pend' && db.m[px].pg === T0 + 5000 && db.m[px].n === 1 && env.length === n0 && amA.st === 'pend', 'pagamento confirmado: uso ok, NENHUM cartão e nenhum e-mail ainda');
  r = await C.ver(db, { cod: px, tel: '0981123456' }, 'ip2', T0 + 5500); ok(!r.ok && r.motivo === 'pendente', 'antes da entrega o cartão não vale');
  r = await C.entregue(db, envia, { pid: 'P2' }, T0 + D);
  ok(r.ok && r.cartoes[0] === px && db.m[px].st === 'ativo' && db.m[px].fim === T0 + D + 120 * D && env.length === n0 + 1 && /Sua compra chegou/.test(ult().subject), 'ENTREGUE: o cartão de 10% passa a valer e sai o e-mail 61a');
  ok(/Agradecemos a preferência, Maria\./.test(ult().html) && /MARIA GONZÁLEZ/.test(ult().html) && /cartao-ouro\.png/.test(ult().html) && ult().html.indexOf('>' + px + '<') < 0 && !/Obrigada|amiga|Bem-vinda/.test(ult().html), '61a: cartão de luxo com o nome, SEM o código à vista, sem texto no feminino');
  r = await C.entregue(db, envia, { pid: 'P2' }, T0 + D + 5); ok(r.fora && env.length === n0 + 1, 'marcar entregue de novo não manda outro e-mail');
  ok(db.m[amA.cod].st === 'pend' && db.m[amA.cod].conv === T0 + D + 14 * D, 'o convite para indicar fica marcado para 2 semanas depois');
  for (const t of ['0982000001', '0982000002', '0982000003']) r = await C.ver(db, { cod: px, tel: t }, 'ip2', T0 + D + 6000);
  ok(!r.ok && r.motivo === 'outro', 'código pessoal preso ao telefone de quem ganhou');
  r = await C.ver(db, { cod: px, tel: '0981123456' }, 'ip2', T0 + D + 6000); ok(r.ok, 'quem ganhou usa');
  // convite: só sai no dia certo
  r = await C.diario(db, envia, T0 + 10 * D); ok(r.convites === 0 && db.m[amA.cod].st === 'pend', 'convite: antes das 2 semanas não sai');
  r = await C.diario(db, envia, T0 + 15 * D + 1);
  ok(r.convites === 1 && db.m[amA.cod].st === 'ativo' && /Um presente para quem você gosta/.test(ult().subject) && /alguém especial/.test(ult().html) && /UM PRESENTE DE MARIA/.test(ult().html) && /cartao-vinho\.png/.test(ult().html) && !/amiga/.test(ult().html), '61b: convite sai 2 semanas depois, cartão marfim, texto sem gênero');
  r = await C.diario(db, envia, T0 + 16 * D); ok(r.convites === 0, 'convite: uma vez só');
  const am = amA.cod;
  r = await C.ver(db, { cod: am, tel: '0981123456' }, 'ip3', T0 + 16 * D); ok(!r.ok && r.motivo === 'proprio', 'indicação: quem indica não usa o próprio presente');

  // ---- indicação: o cartão CRESCE (1 = 15%) ----
  r = await C.usar(db, { cod: am, tel: '0983111222', email: 'bia@x.com', total: 150000, desc: 15000, pid: 'P3' }, 'ip3', T0 + 16 * D); ok(r.ok, 'a pessoa indicada usa 10% na primeira compra');
  await C.proxima(db, { pid: 'P3', tel: '0983111222', email: 'bia@x.com', nome: 'Bia Souza' }, T0 + 16 * D);
  const antes = Object.values(db.m).length;
  r = await C.confirma(db, envia, { pid: 'P3' }, T0 + 17 * D);
  ok(db.m[px].pct === 15 && db.m[px].fim === T0 + 17 * D + 120 * D && Object.values(db.m).length === antes && /seu cartão cresceu/.test(ult().subject) && /15%/.test(ult().html) && !/10%/.test(ult().html) && /É o mesmo cartão/.test(ult().html) && /1 pessoa indicada já comprou\. Faltam 2/.test(ult().html), '61c: quem indicou NÃO ganha outro cartão — o mesmo cresce para 15%, validade renovada, sem mostrar o valor antigo');
  const nn = env.length; await C.confirma(db, envia, { pid: 'P3' }, T0 + 17 * D + 5); ok(db.cliM['981123456'].ind === 1 && env.length === nn, 'confirmar o mesmo pedido de novo não premia duas vezes');
  // 2ª pessoa indicada: só conta · 3ª: 20% (teto) · 5ª: aviso ao dono
  const indica = async (i, tel, t) => { await C.usar(db, { cod: am, tel, email: 'i' + i + '@x.com', total: 150000, desc: 15000, pid: 'I' + i }, 'ipI' + i, t); await C.confirma(db, envia, { pid: 'I' + i }, t + 10); };
  await indica(2, '0983000002', T0 + 18 * D); ok(db.m[px].pct === 15 && db.cliM['981123456'].ind === 2, '2ª indicação: só conta para a meta');
  await indica(3, '0983000003', T0 + 19 * D); ok(db.m[px].pct === 20 && /3 pessoas indicadas já compraram\. Faltam 2/.test(ult().html), '3ª indicação: o cartão vai a 20% (teto)');
  await indica(4, '0983000004', T0 + 20 * D); await indica(5, '0983000005', T0 + 21 * D);
  ok(db.m[px].pct === 20 && db.av.some((a) => a.t === 'meta5'), '5ª indicação: aviso ao dono para o presente especial; o cartão não passa de 20%');
  // sem cartão valendo: cartão novo (10% na 1ª indicação, como no esboço 61d)
  await C.proxima(db, { pid: 'S1', tel: '0984555666', email: 'carlos@x.com', nome: 'Carlos Benítez' }, T0); await C.confirma(db, envia, { pid: 'S1' }, T0 + 10); await C.entregue(db, envia, { pid: 'S1' }, T0 + 20);
  const pxC = Object.values(db.m).find((c) => c.tipo === 'px' && c.pid === 'S1'), amC = Object.values(db.m).find((c) => c.tipo === 'am' && c.pid === 'S1');
  await C.usar(db, { cod: pxC.cod, tel: '0984555666', email: 'carlos@x.com', total: 200000, desc: 20000, pid: 'S2' }, 'ipS', T0 + 2 * D); await C.proxima(db, { pid: 'S2', tel: '0984555666', email: 'carlos@x.com', nome: 'Carlos Benítez' }, T0 + 2 * D); await C.confirma(db, envia, { pid: 'S2' }, T0 + 2 * D + 5);
  await C.diario(db, envia, T0 + 15 * D);
  await C.usar(db, { cod: amC.cod, tel: '0984777888', email: 'dani@x.com', total: 150000, desc: 15000, pid: 'S3' }, 'ipS3', T0 + 40 * D); r = await C.confirma(db, envia, { pid: 'S3' }, T0 + 40 * D + 5);
  const novo = db.m[r.cartoes[0]];
  ok(novo && novo.tipo === 'px' && novo.pct === 10 && novo.st === 'ativo' && novo.tel === '984555666' && /um presente para você/.test(ult().subject) && /Agradecemos por indicar a La Fouch, Carlos\./.test(ult().html) && /CARLOS BENÍTEZ/.test(ult().html), '61d: quem indicou e não tinha cartão valendo recebe um cartão novo');

  // ---- só a 1ª compra dá o cartão de 10% · Cliente fiel a cada 3 · um presente por vez ----
  await C.entregue(db, envia, { pid: 'S2' }, T0 + 3 * D);
  ok(Object.values(db.m).find((c) => c.tipo === 'px' && c.pid === 'S2').st === 'canc' && Object.values(db.m).find((c) => c.tipo === 'am' && c.pid === 'S2').st === 'canc', '2ª compra: não dá cartão de 10% nem convite');
  const ne = env.length;
  await C.proxima(db, { pid: 'S4', tel: '0984555666', email: 'carlos@x.com', nome: 'Carlos Benítez' }, T0 + 41 * D); await C.confirma(db, envia, { pid: 'S4' }, T0 + 41 * D + 5); r = await C.entregue(db, envia, { pid: 'S4' }, T0 + 42 * D);
  let fi = Object.values(db.m).filter((c) => c.tipo === 'fiel' && c.tel === '984555666');
  ok(fi.length === 1 && fi[0].st === 'fila' && env.length === ne && r.cartoes.length === 0, '3ª compra: Cliente fiel fica GUARDADO porque há um cartão valendo (um presente por vez)');
  r = await C.ver(db, { cod: fi[0].cod, tel: '0984555666' }, 'ipS', T0 + 42 * D); ok(!r.ok && r.motivo === 'pendente', 'presente guardado ainda não vale');
  let mc = await C.meus(db, 'carlos@x.com', T0 + 42 * D); ok(mc.guardados === 1 && !mc.cupons.some((c) => c.cod === fi[0].cod) && mc.cupons.some((c) => c.cod === novo.cod) && mc.nome === 'Carlos Benítez', 'Minha conta: mostra o cartão valendo e "1 presente guardado" (sem listar o guardado)');
  await C.usar(db, { cod: novo.cod, tel: '0984555666', email: 'carlos@x.com', total: 200000, desc: 20000, pid: 'S5' }, 'ipS', T0 + 50 * D); await C.confirma(db, envia, { pid: 'S5' }, T0 + 50 * D + 5);
  r = await C.diario(db, envia, T0 + 51 * D); ok(r.soltos === 0 && db.m[fi[0].cod].st === 'fila', 'cartão usado, mas o último e-mail de presente foi há menos de 30 dias: continua guardado');
  r = await C.diario(db, envia, T0 + 71 * D);
  ok(r.soltos === 1 && db.m[fi[0].cod].st === 'ativo' && db.m[fi[0].cod].fim === T0 + 71 * D + 120 * D && /cliente fiel/.test(ult().subject) && /Esta foi a sua terceira compra, Carlos\./.test(ult().html) && /CLIENTE FIEL/.test(ult().html) && /Que bom ter você de/.test(ult().html), '61e: 30 dias depois o Cliente fiel sai, com a validade contando da saída');

  // ---- evento ----
  r = await C.emitir(db, { tipo: 'ev', cod: 'navidad10', pct: 10, max: 2, ini: T0, fim: T0 + 30 * D, tema: 'natal' }, T0); ok(r.ok && r.cod === 'NAVIDAD10', 'cupom do evento com código escolhido');
  const be = C.blocoEvento(db.m.NAVIDAD10, false);
  ok(/NAVIDAD10/.test(be) && /de desconto · Natal/.test(be) && /#1f5c3a/.test(be) && /cartao-ev-natal\.png/.test(be) && !/toda a loja/.test(be) && /Não vale para peças em OFERTA nem para o “Leve 2”/.test(be), '61h/62: cartão do evento com as cores da temática, código à vista, sem "em toda a loja"');
  r = await C.ver(db, { cod: 'NAVIDAD10', tel: '0984' }, 'ip4', T0); ok(r.ok && r.cupom.restam === 2, 'site mostra "restam 2 de 2"');
  await C.usar(db, { cod: 'NAVIDAD10', tel: '0984000001', total: 100000, desc: 10000, pid: 'E1' }, 'ip4', T0);
  r = await C.ver(db, { cod: 'NAVIDAD10', tel: '0984000001' }, 'ip4', T0); ok(!r.ok && r.motivo === 'ja', 'evento: 1 vez por pessoa');
  await C.usar(db, { cod: 'NAVIDAD10', tel: '0984000002', total: 100000, desc: 10000, pid: 'E2' }, 'ip4', T0);
  r = await C.ver(db, { cod: 'NAVIDAD10', tel: '0984000003' }, 'ip4', T0); ok(!r.ok && r.motivo === 'esgotado' && db.av.some((a) => a.t === 'esgotado'), 'evento acaba no limite total e avisa');
  // força bruta
  for (let i = 0; i < 10; i++) await C.ver(db, { cod: 'LF-ZZZ' + i }, 'ipX', T0);
  r = await C.ver(db, { cod: am, tel: '0985000111' }, 'ipX', T0 + 16 * D); ok(r.motivo !== 'espera' && r.motivo !== 'nao', '10 erros de digitação não fazem esperar');
  for (let i = 0; i < 30; i++) await C.ver(db, { cod: 'LF-ZZY' + i }, 'ipY', T0);
  r = await C.ver(db, { cod: am, tel: '0985000222' }, 'ipY', T0 + 1); ok(!r.ok && r.motivo === 'nao', 'robô (30+ erros na hora) recebe só "não encontrado"');

  // ---- cartões que o dono gera ----
  r = await C.emitir(db, { tipo: 'vip', tel: '0986', nome: 'Carlos Benítez', email: 'vip@x.com', fim: T0 + 180 * D }, T0, envia);
  let v = db.m[r.cod];
  ok(r.ok && v.pct === 15 && v.fim === T0 + 180 * D && v.max === 1 && r.enviou && /Um cartão VIP para você/.test(ult().subject) && /na sua próxima compra/.test(ult().html) && /CARTÃO VIP/.test(ult().html) && !/sempre que quiser|todas as compras|SEM VALIDADE/i.test(ult().html), '61f: VIP com a validade escolhida pelo dono, 1 compra por padrão, por e-mail');
  r = await C.emitir(db, { tipo: 'vip', tel: '0986111', nome: 'Rita', email: 'vip2@x.com', max: 3 }, T0, envia); v = db.m[r.cod];
  ok(v.max === 3 && v.fim === T0 + 120 * D && /em 3 compras/.test(ult().html), 'VIP para 3 compras: "em 3 compras"; sem validade informada vale 120 dias');
  r = await C.emitir(db, { tipo: 'px', pct: 20, tel: '0986222', nome: 'Maria González', email: 'agrado@x.com' }, T0, envia);
  ok(r.enviou && /Um presente da La Fouch/.test(ult().subject) && /20%/.test(ult().html) && /Maria, este cartão é um agrado/.test(ult().html) && ult().html.indexOf('>' + r.cod + '<') < 0, '61g: cartão avulso do dono vai por e-mail, sem o código à vista');
  r = await C.emitir(db, { tipo: 'px', pct: 20, tel: '0986333' }, T0, envia); ok(r.ok && !r.enviou, 'cartão sem e-mail: só o código, como antes');
  const l = await C.lista(db, T0); ok(l.tipos.bv.usados === 1 && !l.teto.pausa, 'lista com resultado por tipo');
  const mt = await C.meus(db, 'ANA@gmail.com', T0 + 30 * D); ok(mt.cupons.some((c) => c.cod === px && c.pct === 20) && mt.cupons.some((c) => c.cod === bv && c.usado) && mt.indicacoes === 5, 'Minha conta: cartões do cliente, o que já usou e as indicações');
  // espanhol
  ok(/Tu compra llegó/.test(C.mailPresente(Object.assign({}, db.m[px], { tipo: 'px', de: '' }), true).subject) && /alguien especial/.test(C.mailConvite(db.m[am], true).html) && /Tu tarjeta/.test(C.mailCresceu(db.m[px], true, 1).html), 'e-mails em espanhol');

  // pedido cancelado antes de pagar
  const pb = await C.proxima(db, { pid: 'B9', tel: '0982333555', email: 'cris@x.com' }, T0); await C.libera(db, { pid: 'B9' }, T0 + 50);
  ok(db.m[pb.cupom.cod].st === 'canc' && db.m[pb.amiga.cod].st === 'canc', 'cancelar o pedido cancela os cartões pendentes');
  r = await C.entregue(db, envia, { pid: 'B9' }, T0 + 60); ok(r.fora, 'entregue sem pagamento confirmado não dá presente');

  // dois pedidos no mesmo segundo com um cupom de 1 uso → só um leva (transação; o falso serializa como o Firestore)
  let fila = Promise.resolve();
  db.trans = (k, fn) => { const p = fila.then(async () => { const c = JSON.parse(JSON.stringify(db.m[k] || null)); let w = null; const r2 = await fn(c, (o) => { w = o; }); if (w) Object.assign(db.m[k], w); return r2; }); fila = p.catch(() => {}); return p; };
  const u1 = await C.emitir(db, { tipo: 'px', tel: '0983444555', email: '' }, T0), cu = u1.cupom.cod;
  const [ra, rb] = await Promise.all([C.usar(db, { cod: cu, tel: '0983444555', total: 200000, desc: 20000, pid: 'Q1' }, 'ipQ', T0 + 1), C.usar(db, { cod: cu, tel: '0983444555', total: 200000, desc: 20000, pid: 'Q2' }, 'ipQ', T0 + 1)]);
  ok([ra, rb].filter((x) => x.ok).length === 1 && [ra, rb].some((x) => !x.ok && x.motivo === 'usado') && db.m[cu].usos.length === 1, 'mesmo segundo: cupom de 1 uso vale só para um pedido');
  const tv = {}; db.trava = async (k) => { if (tv[k]) return false; tv[k] = 1; return true; }; db.criaSe = async (k, o) => { if (db.m[k]) return false; db.m[k] = JSON.parse(JSON.stringify(o)); return true; }; db.espera = 5;
  const [b1, b2] = await Promise.all([C.boasVindas(db, envia, { email: 'gemea@x.com', tel: '0985111222' }, T0), C.boasVindas(db, envia, { email: 'gemea@x.com', tel: '0985111222' }, T0)]);
  ok([b1, b2].filter((x) => x.ok).length === 1, 'boas-vindas: 2 toques juntos = 1 cupom só');
  const [p1, p2] = await Promise.all([C.proxima(db, { pid: 'Z1', tel: '0986111222', email: 'z@x.com' }, T0), C.proxima(db, { pid: 'Z1', tel: '0986111222', email: 'z@x.com' }, T0)]);
  ok(p1.ok && p2.ok && p1.cupom.cod === p2.cupom.cod && Object.values(db.m).filter((c) => c.pid === 'Z1').length === 2, 'pedido: 2 chamadas juntas = 1 par de cartões');
  await Promise.all([C.confirma(db, envia, { pid: 'Z1' }, T0 + 9600), C.confirma(db, envia, { pid: 'Z1' }, T0 + 9600)]);
  const nz = env.length;
  const [e1, e2] = await Promise.all([C.entregue(db, envia, { pid: 'Z1' }, T0 + D), C.entregue(db, envia, { pid: 'Z1' }, T0 + D)]);
  ok([e1, e2].filter((x) => !x.fora).length === 1 && env.length === nz + 1, 'marcar entregue em 2 aparelhos juntos = 1 presente e 1 e-mail');
  process.exit(falhas ? 1 : 0);
})();
