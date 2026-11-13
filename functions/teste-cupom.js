const C = require('./cupom');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
function dbFake(compras) {
  const m = {}, mes = {}, tent = {}, av = [];
  return {
    m, mes, av,
    get: async (k) => m[k] || null, salva: async (k, o) => { m[k] = o; }, muda: async (k, c) => { Object.assign(m[k], c); },
    getMes: async (k) => mes[k] || null, somaMes: async (k, v) => { mes[k] = mes[k] || { desc: 0 }; mes[k].desc += v; },
    getTent: async (k) => tent[k] || null, salvaTent: async (k, o) => { tent[k] = o; },
    aviso: async (o) => { av.push(o); }, avisos: async () => av.slice(-30),
    jaComprou: async (tel, em) => (compras || []).some((x) => (tel && x === tel) || (em && x === em)),
    bvDe: async (em, tel) => Object.values(m).some((c) => c.tipo === 'bv' && ((em && c.email === em) || (tel && c.tel === tel))),
    porPid: async (pid, tipo) => Object.values(m).find((c) => c.pid === pid && c.tipo === tipo) || null,
    comUsoDe: async (pid) => Object.values(m).filter((c) => (c.usos || []).some((u) => u.pid === pid)),
    todos: async () => Object.values(m), doEmail: async (em) => Object.values(m).filter((c) => c.email === em),
  };
}
(async () => {
  const T0 = Date.UTC(2026, 10, 12, 12), D = 864e5, env = [], envia = async (x) => { env.push(x); };
  const db = dbFake(['981999888']);
  // boas-vindas
  let r = await C.boasVindas(db, envia, { email: 'Ana@Gmail.com', tel: '+595 981 123 456', lang: 'es' }, T0);
  const bv = r.cupom.cod;
  ok(r.ok && /^LF-[A-HJ-NP-Z2-9]{4}$/.test(bv) && r.cupom.pct === 5 && env[0].to === 'ana@gmail.com' && /Bienvenida/.test(env[0].subject), 'boas-vindas 5% na tela e no e-mail (código sem O/0 I/1)');
  r = await C.boasVindas(db, envia, { email: 'ana@gmail.com' }, T0); ok(!r.ok && r.motivo === 'ja', 'boas-vindas: 1 por e-mail');
  r = await C.boasVindas(db, envia, { email: 'outra@x.com', tel: '0981 123 456' }, T0); ok(!r.ok && r.motivo === 'ja', 'boas-vindas: 1 por telefone');
  r = await C.boasVindas(db, envia, { email: 'cli@x.com', tel: '0981 999 888' }, T0); ok(!r.ok && r.motivo === 'cliente', 'boas-vindas: só para quem nunca comprou');
  // usar no site
  r = await C.ver(db, { cod: bv.toLowerCase(), tel: '0981123456' }, 'ip1', T0); ok(r.ok && r.cupom.pct === 5, 'confere o código (minúscula também vale)');
  r = await C.usar(db, { cod: bv, tel: '0981123456', total: 90000, desc: 4500, pid: 'P1' }, 'ip1', T0); ok(!r.ok && r.motivo === 'min', 'compra mínima Gs 100 mil');
  let e = ''; try { await C.usar(db, { cod: bv, tel: '0981123456', total: 200000, desc: 50000, pid: 'P1' }, 'ip1', T0) } catch (x) { e = x.motivo } ok(e === 'desc', 'desconto maior que o % é recusado');
  r = await C.usar(db, { cod: bv, tel: '0981123456', email: 'ana@gmail.com', total: 245000, desc: 12000, pid: 'P1' }, 'ip1', T0);
  ok(r.ok && db.m[bv].usos[0].st === 'res' && db.mes['2026-11'].desc === 12000, 'usa: fica reservado até o pagamento e soma no teto do mês');
  r = await C.ver(db, { cod: bv, tel: '0981123456' }, 'ip1', T0 + 1000); ok(!r.ok && r.motivo === 'usado', 'código de 1 uso não vale de novo');
  await C.libera(db, { pid: 'P1' }, T0 + 2000); r = await C.ver(db, { cod: bv, tel: '0981123456' }, 'ip1', T0 + 3000); ok(r.ok && db.mes['2026-11'].desc === 0, 'pedido cancelado: o código volta a valer');
  // código pessoal preso ao telefone e trava
  await C.usar(db, { cod: bv, tel: '0981123456', email: 'ana@gmail.com', total: 245000, desc: 12000, pid: 'P2' }, 'ip1', T0 + 4000);
  const px0 = await C.proxima(db, { pid: 'P2', tel: '0981123456', email: 'ana@gmail.com', lang: 'es' }, T0 + 4000);
  ok(px0.ok && px0.cupom.estado === 'pendente', 'cartão Próxima compra nasce pendente');
  r = await C.confirma(db, envia, { pid: 'P2' }, T0 + 5000);
  const px = px0.cupom.cod, am = r.cartoes[1];
  ok(r.ok && db.m[bv].usos[0].st === 'ok' && db.m[px].st === 'ativo' && db.m[am].tipo === 'am' && /próxima compra/.test(env[env.length - 1].subject), 'pagamento confirmado: uso ok, Próxima compra vale e vem o da Amiga por e-mail');
  for (const t of ['0982000001', '0982000002', '0982000003']) r = await C.ver(db, { cod: px, tel: t }, 'ip2', T0 + 6000);
  ok(!r.ok && r.motivo === 'outro', 'código pessoal preso ao telefone da dona');
  r = await C.ver(db, { cod: px, tel: '0981123456' }, 'ip2', T0 + 6000); ok(r.ok, 'a dona ainda usa (antes da trava)');
  await C.ver(db, { cod: px, tel: '0982000004' }, 'ip2', T0 + 7000);
  r = await C.ver(db, { cod: px, tel: '0981123456' }, 'ip2', T0 + 8000); ok(r.ok && db.av.some((a) => a.t === 'trava'), 'S194: 4 telefones diferentes no dia NÃO travam a dona; só avisa o dono');
  r = await C.ver(db, { cod: px, tel: '0981123456' }, 'ip2', T0 + 8000 + D); ok(r.ok, 'a dona continua usando no dia seguinte');
  // amiga
  r = await C.ver(db, { cod: am, tel: '0981123456' }, 'ip3', T0 + 9000); ok(!r.ok && r.motivo === 'proprio', 'amiga: a própria dona não usa');
  r = await C.usar(db, { cod: am, tel: '0983111222', email: 'bia@x.com', total: 150000, desc: 15000, pid: 'P3' }, 'ip3', T0 + 9000); ok(r.ok, 'amiga nova usa 10%');
  r = await C.confirma(db, envia, { pid: 'P3' }, T0 + 10000);
  const pr = db.m[r.cartoes[0]];
  ok(pr && pr.tipo === 'px' && pr.tel === '981123456' && pr.ini === T0 + 10000 + 7 * D, 'quem indicou ganha outro cartão que vale depois de pago + 7 dias');
  r = await C.ver(db, { cod: pr.cod, tel: '0981123456' }, 'ip3', T0 + 11000); ok(!r.ok && r.motivo === 'cedo', 'prêmio da amiga ainda não vale antes dos 7 dias');
  // evento
  r = await C.emitir(db, { tipo: 'ev', cod: 'navidad10', pct: 10, max: 2, ini: T0, fim: T0 + 30 * D, tema: 'natal' }, T0); ok(r.ok && r.cod === 'NAVIDAD10', 'cupom do evento com código escolhido');
  r = await C.ver(db, { cod: 'NAVIDAD10', tel: '0984' }, 'ip4', T0); ok(r.ok && r.cupom.restam === 2, 'site mostra "quedan 2 de 2"');
  await C.usar(db, { cod: 'NAVIDAD10', tel: '0984000001', total: 100000, desc: 10000, pid: 'E1' }, 'ip4', T0);
  r = await C.ver(db, { cod: 'NAVIDAD10', tel: '0984000001' }, 'ip4', T0); ok(!r.ok && r.motivo === 'ja', 'evento: 1 vez por pessoa (aviso gentil)');
  await C.usar(db, { cod: 'NAVIDAD10', tel: '0984000002', total: 100000, desc: 10000, pid: 'E2' }, 'ip4', T0);
  r = await C.ver(db, { cod: 'NAVIDAD10', tel: '0984000003' }, 'ip4', T0); ok(!r.ok && r.motivo === 'esgotado' && db.av.some((a) => a.t === 'esgotado'), 'evento acaba no limite total e avisa');
  // teto do mês
  db.mes['2026-11'].desc = C.TETO_MES;
  r = await C.boasVindas(db, envia, { email: 'nova@x.com' }, T0); ok(r.ok, 'S194: sem teto do mês (códigos novos continuam saindo)');
  r = await C.ver(db, { cod: am, tel: '0985000000' }, 'ip5', T0 + 12000); ok(r.ok, '…os já entregues continuam valendo');
  // força bruta
  for (let i = 0; i < 10; i++) await C.ver(db, { cod: 'LF-ZZZ' + i }, 'ipX', T0);
  r = await C.ver(db, { cod: am, tel: '0985000111' }, 'ipX', T0 + 1); ok(r.motivo !== 'espera' && r.motivo !== 'nao', 'S194: 10 erros de digitação não fazem esperar');
  for (let i = 0; i < 30; i++) await C.ver(db, { cod: 'LF-ZZY' + i }, 'ipY', T0);
  r = await C.ver(db, { cod: am, tel: '0985000222' }, 'ipY', T0 + 1); ok(!r.ok && r.motivo === 'nao', 'robô (30+ erros na hora) recebe só "não encontrado", sem espera visível');
  // VIP, lista, Mis tarjetas
  r = await C.emitir(db, { tipo: 'vip', tel: '0986', nome: 'Carla', email: 'carla@x.com' }, T0); ok(r.ok && r.cupom.pct === 15 && r.cupom.fim === 0, 'VIP 15% sem vencimento');
  const l = await C.lista(db, T0); ok(l.tipos.bv.usados === 1 && l.tipos.ev.usados === 0 && !l.teto.pausa, 'lista com resultado por tipo (sem teto)');
  // S194 Cliente fiel: a cada 3 compras pagas, 10% para 1 compra
  const cnt = {}; db.contaPaga = async (tel, pid) => { cnt[tel] = cnt[tel] || []; if (cnt[tel].includes(pid)) return null; cnt[tel].push(pid); return cnt[tel].length; };
  for (const pid of ['F1', 'F2', 'F3']) { await C.proxima(db, { pid, tel: '0987111222', email: 'fiel@x.com' }, T0); await C.confirma(db, envia, { pid }, T0 + 1000); }
  let fi = Object.values(db.m).filter((c) => c.tipo === 'fiel');
  ok(fi.length === 1 && fi[0].pct === 10 && fi[0].max === 1 && fi[0].tel === '987111222', 'Cliente fiel: 3ª compra paga gera 10% de 1 uso');
  await C.confirma(db, envia, { pid: 'F3' }, T0 + 2000);
  fi = Object.values(db.m).filter((c) => c.tipo === 'fiel'); ok(fi.length === 1, 'Cliente fiel: confirmar o mesmo pedido de novo não conta 2 vezes');
  const mt = await C.meus(db, 'ANA@gmail.com', T0 + 20000); ok(mt.cupons.some((c) => c.cod === px) && mt.cupons.some((c) => c.cod === bv && c.usado), 'Mis tarjetas: cartões da cliente e o que já usou');
  // S201: cartão da amiga nasce pendente com o pedido; vale ao confirmar; cai se cancelar; Mis tarjetas mostra o contador
  const pa = await C.proxima(db, { pid: 'A9', tel: '0982333444', email: 'bea@x.com' }, T0);
  ok(pa.amiga && pa.amiga.estado === 'pendente' && pa.amiga.tipo === 'am', 'S201: amiga pendente junto com o pedido');
  const pa2 = await C.proxima(db, { pid: 'A9', tel: '0982333444', email: 'bea@x.com' }, T0 + 5); ok(pa2.amiga && pa2.amiga.cod === pa.amiga.cod, 'S201: pedir de novo devolve o mesmo código');
  await C.confirma(db, envia, { pid: 'A9' }, T0 + 100); ok(db.m[pa.amiga.cod].st === 'ativo' && Object.values(db.m).filter((c) => c.tipo === 'am' && c.pid === 'A9').length === 1, 'S201: confirmar ativa a mesma amiga (sem criar outra)');
  const pb = await C.proxima(db, { pid: 'B9', tel: '0982333555', email: 'cris@x.com' }, T0); await C.libera(db, { pid: 'B9' }, T0 + 50); ok(db.m[pb.amiga.cod].st === 'canc', 'S201: cancelar o pedido cancela a amiga pendente');
  const mb = await C.meus(db, 'bea@x.com', T0 + 200), ca = mb.cupons.find((c) => c.tipo === 'am'); ok(ca && ca.amigas === 0 && ca.ganhos === 0 && ca.porMes === 5, 'S201: Mis tarjetas com amigas/ganhos/limite');
  process.exit(falhas ? 1 : 0);
})();
