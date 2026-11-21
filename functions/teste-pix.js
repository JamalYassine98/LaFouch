const X = require('./pix');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
function dbFake(peds, esp) {
  const vis = {}, sp = [], conf = [], cesp = [];
  return {
    sp, conf, cesp,
    jaVisto: async (m) => !!vis[m], visto: async (m) => { vis[m] = 1; }, desvisto: async (m) => { delete vis[m]; },
    itau: [],
    // fichas do servidor (39 · preço exato): PIX em centavos, Banco Familiar/Itaú em Gs.
    fichas: async function (desde) {
      return peds.map((p) => Object.assign({}, p, { moeda: 'brl', valor: Math.round(p.brl * 100) }))
        .concat(this.itau.map((p) => Object.assign({}, p, { moeda: 'gs', valor: p.pagar }))).filter((p) => p.ts >= desde);
    },
    esperas: async (desde) => (esp || []).filter((e) => e.ts >= desde),
    confirmaPedido: async function (id, o) { if (this.semPeca === id) throw new X.Falha('sem-peca', 409); conf.push([id, o]); const p = peds.concat(this.itau).find((x) => x.id === id); if (p) p.pago = true; },
    confirmaEspera: async (id, o) => { cesp.push([id, o]); },
    semPar: async (o) => { sp.push(o); },
  };
}
(async () => {
  const T = Date.UTC(2026, 10, 12, 18), H = 36e5;
  ok(X.centavos('R$ 1.234,56') === 123456 && X.centavos('99,97') === 9997 && X.centavos('99.97') === 9997, 'lê valores em reais');
  ok(X.valorDoTexto('Você recebeu uma transferência de R$ 89,93 de MARIA') === 8993, 'tira o valor do texto do e-mail');
  const peds = [{ id: 'a1', brl: 89.93, ts: T - H }, { id: 'a2', brl: 89.97, ts: T - H }, { id: 'velho', brl: 50.01, ts: T - 72 * H }];
  const db = dbFake(peds, [{ id: 'v1', brl: 120, ts: T - 0.5 * H }]);
  let e = ''; try { await X.recebe(db, { valor: '89,93', mid: 'm0', dkim: false, dom: 'nubank.com.br' }, T); } catch (x) { e = x.motivo; }
  ok(e === 'origem', 'sem DKIM do nubank.com.br: recusa');
  let r = await X.recebe(db, { valor: '89,93', mid: 'm1', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.tipo === 'site' && r.id === 'a1' && db.conf.length === 1, 'pedido do site: confirma pelo valor com centavos únicos');
  r = await X.recebe(db, { valor: '89,93', mid: 'm1', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.repetido && db.conf.length === 1, 'o mesmo e-mail duas vezes não confirma de novo');
  r = await X.recebe(db, { valor: '89,93', mid: 'm2', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.tipo === 'sem-par' && db.sp.length === 1, 'pedido já pago não é confirmado outra vez (vai para sem par)');
  r = await X.recebe(db, { valor: '50,01', mid: 'm3', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.tipo === 'sem-par', 'pedido de mais de 48 h não é confirmado');
  r = await X.recebe(db, { valor: '120,00', mid: 'm4', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.tipo === 'loja' && db.cesp[0][0] === 'v1', 'venda da loja (Venda · PIX) confirmada pelo valor redondo');
  const db2 = dbFake([{ id: 'b1', brl: 70, ts: T - H }, { id: 'b2', brl: 70, ts: T - H }]);
  r = await X.recebe(db2, { valor: '70,00', mid: 'n1', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.tipo === 'sem-par' && r.candidatos === 2 && !db2.conf.length, 'dois pedidos com o mesmo valor: não chuta, avisa');
  ok(X.gsDoTexto('Moneda y Monto: Gs. 1.000') === 1000 && X.gsDoTexto('Moneda y Monto:\n Gs. 139.958') === 139958, 'Itaú: lê o valor em guaranis');
  const db3 = dbFake([]); db3.itau = [{ id: 'i1', pagar: 139958, ts: T - H }, { id: 'i2', pagar: 139940, ts: T - H }];
  e = ''; try { await X.recebe(db3, { banco: 'itau', valor: '139.958', mid: 'k0', dkim: true, dom: 'nubank.com.br' }, T); } catch (x) { e = x.motivo; } ok(e === 'origem', 'Itaú: só aceita e-mail assinado por itau.com.py');
  r = await X.recebe(db3, { banco: 'itau', valor: '139.958', mid: 'k1', dkim: true, dom: 'itau.com.py' }, T); ok(r.tipo === 'site' && r.id === 'i1', 'Itaú: pedido do site confirmado pelo valor com o final único');
  const db4 = dbFake([], [{ id: 'v9', banco: 'itau', gs: 250000, ts: T - 0.2 * H }]); db4.itau = [];
  r = await X.recebe(db4, { banco: 'itau', valor: '250.000', mid: 'k2', dkim: true, dom: 'itau.com.py' }, T); ok(r.tipo === 'loja', 'Itaú: venda da loja confirmada');
  ok(X.gsDoTexto('Moneda y Monto: PYG 200.000') === 200000, 'Banco Familiar: lê o valor em guaranis (PYG)');
  const db5 = dbFake([]); db5.itau = [{ id: 'f1', pagar: 183983, ts: T - H }];
  e = ''; try { await X.recebe(db5, { banco: 'familiar', valor: '183.983', mid: 'q0', dkim: true, dom: 'itau.com.py' }, T); } catch (x) { e = x.motivo; } ok(e === 'origem', 'Banco Familiar: só aceita e-mail de familiar.com.py');
  e = ''; try { await X.recebe(db5, { banco: 'familiar', valor: '183.983', mid: 'q0', dkim: false, dom: 'familiar.com.py' }, T); } catch (x) { e = x.motivo; } ok(e === 'origem', 'Banco Familiar: sem autenticação do e-mail não confirma');
  r = await X.recebe(db5, { banco: 'familiar', valor: '183.983', mid: 'q1', dkim: true, dom: 'familiar.com.py' }, T); ok(r.tipo === 'site' && r.id === 'f1' && db5.conf[0][1].banco === 'familiar', 'Banco Familiar: pedido do site confirmado pelo valor com o final único');
  const db6 = dbFake([], [{ id: 'v7', banco: 'itau', gs: 90000, ts: T - 0.2 * H }]); db6.itau = [];
  r = await X.recebe(db6, { banco: 'familiar', valor: '90.000', mid: 'q2', dkim: true, dom: 'familiar.com.py' }, T); ok(r.tipo === 'loja', 'Banco Familiar: venda da loja confirmada (espera gravada pelo app)');
  // arredondado para cima (14/11): 113.926 a pagar, total cheio 114.000
  const db7 = dbFake([]); db7.itau = [{ id: 'r1', pagar: 114000, ts: T - H }, { id: 'r2', pagar: 251000, ts: T - H }];
  r = await X.recebe(db7, { banco: 'familiar', valor: '114.000', mid: 's1', dkim: true, dom: 'familiar.com.py' }, T); ok(r.tipo === 'site' && r.id === 'r1' && !db7.sp.length, '39 preço exato: o valor exato do total acha o pedido');
  const db8 = dbFake([]); db8.itau = [{ id: 'r1', pagar: 114000, ts: T - H }];
  r = await X.recebe(db8, { banco: 'familiar', valor: '113.900', mid: 's2', dkim: true, dom: 'familiar.com.py' }, T); ok(r.tipo === 'sem-par' && !db8.conf.length, 'mandou a menos: não confirma');
  r = await X.recebe(db8, { banco: 'familiar', valor: '115.000', mid: 's3', dkim: true, dom: 'familiar.com.py' }, T); ok(r.tipo === 'sem-par' && !db8.conf.length, 'mandou acima do total do pedido: não confirma no chute');
  const db9 = dbFake([]); db9.itau = [{ id: 'r1', pagar: 114000, ts: T - H }, { id: 'r3', pagar: 114000, ts: T - H }];
  r = await X.recebe(db9, { banco: 'familiar', valor: '114.000', mid: 's4', dkim: true, dom: 'familiar.com.py' }, T); ok(r.tipo === 'sem-par' && r.motivo === 'empate' && r.candidatos === 2 && !db9.conf.length && db9.sp[0].ids.length === 2, 'dois pedidos do mesmo valor, sem desempate: não chuta, avisa com o motivo "empate" e os pedidos');
  r = await X.recebe(db7, { banco: 'familiar', valor: '113.900', mid: 's5', dkim: true, dom: 'familiar.com.py' }, T); ok(r.tipo === 'sem-par' && r.motivo === 'sem-pedido', 'valor que não bate com nenhum pedido: "sem-pedido" (o dono liga na mão)');
  // hora + nome + valor (14/11): só desempatam
  ok(X.mesmoNome('María José Benítez', 'BENITEZ GONZALEZ MARIA JOSE') && !X.mesmoNome('Maria Lopez', 'MARIA BENITEZ') && !X.mesmoNome('', 'X Y'), 'nome: 2+ palavras iguais, sem acento; só o primeiro nome não basta');
  const F = { banco: 'familiar', dkim: true, dom: 'familiar.com.py' };
  const dbA = dbFake([]); dbA.itau = [{ id: 'n1', nome: 'Carlos Duarte', pagar: 114000, ts: T - 20 * H }, { id: 'n2', nome: 'María Benítez', pagar: 114000, ts: T - 19 * H }];
  r = await X.recebe(dbA, Object.assign({ valor: '114.000', mid: 'h1', nome: 'BENITEZ ROJAS MARIA', hora: T - 60e3 }, F), T); ok(r.id === 'n2' && r.por === 'nome' && dbA.conf[0][1].de === 'BENITEZ ROJAS MARIA', 'dois pedidos no mesmo total cheio: o nome do pagador escolhe');
  const dbB = dbFake([]); dbB.itau = [{ id: 'n1', nome: 'Carlos Duarte', pagar: 114000, ts: T - 20 * H }, { id: 'n2', nome: 'María Benítez', pagar: 114000, ts: T - 10 * 60e3 }];
  r = await X.recebe(dbB, Object.assign({ valor: '114.000', mid: 'h2', nome: 'OUTRA PESSOA QUALQUER', hora: T - 60e3 }, F), T); ok(r.id === 'n2' && r.por === 'hora', 'outra pessoa pagou: vale o único pedido feito pouco antes do pagamento');
  const dbC = dbFake([]); dbC.itau = [{ id: 'n1', nome: 'Carlos Duarte', pagar: 114000, ts: T - 20 * H }, { id: 'n2', nome: 'María Benítez', pagar: 114000, ts: T - 19 * H }];
  r = await X.recebe(dbC, Object.assign({ valor: '114.000', mid: 'h3', nome: 'OUTRA PESSOA QUALQUER', hora: T - 60e3 }, F), T); ok(r.tipo === 'sem-par' && !dbC.conf.length && dbC.sp[0].de === 'OUTRA PESSOA QUALQUER', 'nem nome nem hora decidem: não chuta e guarda o nome do pagador como pista');
  const dbD = dbFake([]); dbD.itau = [{ id: 'n1', nome: 'Carlos Duarte', pagar: 114000, ts: T - 5 * 60e3 }];
  r = await X.recebe(dbD, Object.assign({ valor: '114.000', mid: 'h4', nome: 'CARLOS DUARTE', hora: T - 30 * 60e3 }, F), T); ok(r.tipo === 'sem-par' && !dbD.conf.length, 'pedido feito DEPOIS do pagamento não é confirmado por ele');
  r = await X.recebe(dbD, Object.assign({ valor: '114.000', mid: 'h5', nome: 'TIA DO CARLOS', hora: T - 60e3 }, F), T); ok(r.tipo === 'site' && r.id === 'n1' && !r.por, 'um só pedido no valor: confirma mesmo com outro nome (nome nunca é exigido)');
  const dbE = dbFake([]); dbE.itau = [{ id: 'n1', nome: 'Carlos Duarte', pagar: 114000, ts: T - H }];
  r = await X.recebe(dbE, Object.assign({ valor: '114.000', mid: 'h6', hora: 'lixo' }, F), T); ok(r.id === 'n1', 'robô antigo (sem nome nem hora) continua funcionando');
  // 20/11/2026 (varredura do pagamento): uma regra só para os bancos; sem pagamento perdido; sem venda dupla
  const dbF = dbFake([{ id: 'p1', brl: 99.53, ts: T - H }, { id: 'p1b', brl: 99.53, ts: T - H, aberta: true }]);
  r = await X.recebe(dbF, { valor: '99,53', mid: 'u1', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.tipo === 'site' && r.id === 'p1b' && r.por === 'reserva', '39: dois do mesmo valor → vale o único com a reserva ainda aberta'); r = await X.recebe(dbF, { valor: '100,00', mid: 'u1b', dkim: true, dom: 'nubank.com.br' }, T); ok(r.tipo === 'sem-par' && r.motivo === 'sem-pedido', '39: pagou a mais → não confirma sozinho (sem-pedido; o dono liga)');
  const dbG = dbFake([{ id: 'p2', brl: 50.5, ts: T - H }]); dbG.semPeca = 'p2';
  r = await X.recebe(dbG, { valor: '50,50', mid: 'u2', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.tipo === 'sem-peca' && !dbG.conf.length && dbG.sp[0].motivo === 'sem-peca' && dbG.sp[0].id === 'p2', 'pagou depois que a peça foi vendida a outra pessoa: não marca pago, avisa o dono com o pedido');
  const dbH = dbFake([{ id: 'p3', brl: 10.1, ts: T - H }]); let vez = 0;
  dbH.confirmaPedido = async () => { if (!vez++) throw new Error('rede'); };
  e = ''; try { await X.recebe(dbH, { valor: '10,10', mid: 'u3', dkim: true, dom: 'nubank.com.br' }, T); } catch (x) { e = x.message; }
  r = await X.recebe(dbH, { valor: '10,10', mid: 'u3', dkim: true, dom: 'nubank.com.br' }, T);
  ok(e === 'rede' && r.tipo === 'site' && !r.repetido, 'erro no meio: o e-mail não fica como visto e a nova tentativa confirma (antes o pagamento sumia)');
  const dbI = dbFake([{ id: 'p4', brl: 70, ts: T - H }]); dbI.itau = [{ id: 'g1', pagar: 7000, total: 7000, ts: T - H }];
  r = await X.recebe(dbI, { valor: '70,00', mid: 'u4', dkim: true, dom: 'nubank.com.br' }, T);
  ok(r.id === 'p4', 'PIX em reais nunca casa com pedido em guaranis (cada banco só olha a sua moeda)');
  console.log(falhas ? falhas + ' FALHAS' : 'tudo ok');
  process.exit(falhas ? 1 : 0);
})();
