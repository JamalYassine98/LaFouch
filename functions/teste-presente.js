// S409 testes do presente especial e da conferência do pedido — inclusive as TENTATIVAS DE BURLAR (ordem do dono, 17/11/2026)
const assert = require('assert');
const X = require('./presente');
let n = 0;
const t = (nome, fn) => { fn(); n++; console.log('  ok ', nome); };
// preços de exemplo (Gs.): KIT3C 100.000 · SL2210 95.000 · SL2250 em OFERTA 80.000 (de 100.000) · AC1055 75.000 · CARA 150.000
const prods = {
  KIT3C: { ref: 'KIT3C', n: 100000, cmx: 10 }, SL2210: { ref: 'SL2210', n: 95000, cmx: 10 }, SL2250: { ref: 'SL2250', n: 80000, de: 100000, cmx: 0 },
  AC1055: { ref: 'AC1055', n: 75000, cmx: 15 }, CARA: { ref: 'CARA', n: 150000, cmx: 15 }, ESG: { ref: 'ESG', n: 50000, aviso: 'Esgotado' }, SEMPISO: { ref: 'SEMPISO', n: 40000 },
};
const pisos = { KIT3C: 40000, SL2210: 40000, SL2250: 35000, AC1055: 30000, CARA: 60000, ESG: 10000 };
const pe = { tipo: 'pe', pct: 0 }, c10 = { tipo: 'px', pct: 10 };
const ped = (itens, total, extra) => Object.assign({ itens, total }, extra || {});

t('lista de presentes: só até o valor da peça paga e dentro do piso', () => {
  const r = X.podeSer(prods, pisos, ['KIT3C'], false);
  assert.ok(r.ok); assert.deepStrictEqual(r.refs.sort(), ['AC1055', 'KIT3C', 'SL2210', 'SL2250'].sort());
});
t('peça em OFERTA pode ser presente, mas não libera o presente', () => {
  assert.ok(X.podeSer(prods, pisos, ['KIT3C'], false).refs.indexOf('SL2250') >= 0);
  assert.strictEqual(X.podeSer(prods, pisos, ['SL2250'], false).ok, false);
});
t('VIP: presente até 20% a mais que a peça paga', () => {
  const r = X.podeSer(prods, pisos, ['SL2210'], true); // 95.000 → até 114.000
  assert.ok(r.refs.indexOf('KIT3C') >= 0); assert.ok(r.refs.indexOf('CARA') < 0);
  assert.ok(X.podeSer(prods, pisos, ['SL2210'], false).refs.indexOf('KIT3C') < 0);
});
t('sem piso cadastrado: a peça não pode ser presente nem liberar', () => {
  assert.ok(X.podeSer(prods, pisos, ['KIT3C'], false).refs.indexOf('SEMPISO') < 0);
  assert.strictEqual(X.podeSer(prods, pisos, ['SEMPISO'], false).ok, false);
});
t('piso: a folga da peça paga precisa cobrir o piso do presente', () => {
  const p2 = Object.assign({}, pisos, { KIT3C: 80000 }); // folga 20.000: nenhum presente cabe
  assert.deepStrictEqual(X.podeSer(prods, p2, ['KIT3C'], false).refs, []);
});
t('esgotada nunca é presente', () => { assert.ok(X.podeSer(prods, pisos, ['CARA'], false).refs.indexOf('ESG') < 0); });
t('pedido certo com presente passa', () => {
  const r = X.confere(ped([{ ref: 'KIT3C', q: 1 }, { ref: 'SL2210', q: 1, pres: true }], 100000), prods, pisos, pe, false);
  assert.ok(r.ok, r.motivos.join());
});
t('BURLA: presente mais caro que a peça paga é recusado', () => {
  const r = X.confere(ped([{ ref: 'AC1055', q: 1 }, { ref: 'KIT3C', q: 1, pres: true }], 75000), prods, pisos, pe, false);
  assert.strictEqual(r.ok, false);
});
t('BURLA: escolhe o presente e troca para cartão de desconto (peça de graça + desconto)', () => {
  const r = X.confere(ped([{ ref: 'KIT3C', q: 1 }, { ref: 'SL2210', q: 1, pres: true }], 90000), prods, pisos, c10, false);
  assert.strictEqual(r.ok, false);
});
t('BURLA: cartão de desconto e a peça "de graça" no valor (sem marcar presente)', () => {
  const r = X.confere(ped([{ ref: 'KIT3C', q: 1 }, { ref: 'SL2210', q: 1 }], 90000), prods, pisos, c10, false);
  assert.strictEqual(r.ok, false); // mínimo = 195.000 − 19.000 = 176.000
});
t('BURLA: duas peças de presente', () => {
  const r = X.confere(ped([{ ref: 'CARA', q: 1 }, { ref: 'SL2210', q: 1, pres: true }, { ref: 'AC1055', q: 1, pres: true }], 150000), prods, pisos, pe, false);
  assert.strictEqual(r.ok, false);
});
t('BURLA: presente com quantidade 2', () => {
  const r = X.confere(ped([{ ref: 'CARA', q: 1 }, { ref: 'SL2210', q: 2, pres: true }], 150000), prods, pisos, pe, false);
  assert.strictEqual(r.ok, false);
});
t('BURLA: só a peça de presente, sem peça paga', () => {
  const r = X.confere(ped([{ ref: 'SL2210', q: 1, pres: true }], 0), prods, pisos, pe, false);
  assert.strictEqual(r.ok, false);
});
t('BURLA: presente com a peça paga em OFERTA', () => {
  const r = X.confere(ped([{ ref: 'SL2250', q: 1 }, { ref: 'AC1055', q: 1, pres: true }], 80000), prods, pisos, pe, false);
  assert.strictEqual(r.ok, false);
});
t('BURLA: valor do pedido mexido no navegador (mais barato)', () => {
  const r = X.confere(ped([{ ref: 'KIT3C', q: 1 }], 50000), prods, pisos, null, false);
  assert.strictEqual(r.ok, false);
});
t('BURLA: desconto do cartão aplicado em peça de OFERTA', () => {
  const r = X.confere(ped([{ ref: 'SL2250', q: 1 }], 72000), prods, pisos, c10, false);
  assert.strictEqual(r.ok, false);
});
t('BURLA: cartão de 15% em peça que só aguenta 10%', () => {
  const r = X.confere(ped([{ ref: 'KIT3C', q: 1 }], 85000), prods, pisos, { tipo: 'px', pct: 15 }, false);
  assert.strictEqual(r.ok, false);
});
t('BURLA: marcar presente sem ter o presente especial', () => {
  const r = X.confere(ped([{ ref: 'KIT3C', q: 1 }, { ref: 'SL2210', q: 1, pres: true }], 100000), prods, pisos, null, false);
  assert.strictEqual(r.ok, false);
});
t('pedido normal com cartão 10% passa (OFERTA fica fora do desconto)', () => {
  const r = X.confere(ped([{ ref: 'KIT3C', q: 1 }, { ref: 'SL2250', q: 1 }], 170000), prods, pisos, c10, false);
  assert.ok(r.ok, r.motivos.join());
});
t('frete entra no mínimo', () => {
  const r = X.confere(ped([{ ref: 'KIT3C', q: 1 }], 100000, { obsC: 'Transportadora: Bolt · frete Gs. 20.000' }), prods, pisos, null, false);
  assert.strictEqual(r.ok, false);
});
t('pagar a mais nunca é problema', () => { assert.ok(X.confere(ped([{ ref: 'KIT3C', q: 1 }], 120000), prods, pisos, null, false).ok); });
// 20/11/2026 (varredura do pagamento): o valor que o robô do banco procura é conferido pelo servidor — TENTATIVAS DE BURLAR
const KIT = [{ ref: 'KIT3C', q: 1 }], COT = 1400; // 100.000 Gs ≈ R$ 71,43 → o site cobra R$ 70 (arredonda para 5)
t('Banco Familiar: o valor a pagar é o total do carrinho (preço exato, sem final único)', () => {
  const r = X.confere(ped(KIT, 100000, { pag: 'alias' }), prods, pisos, null, false, COT);
  assert.ok(r.ok, r.motivos.join()); assert.deepStrictEqual(r.pagar, { moeda: 'gs', valor: 100000 });
});
t('BURLA: total abaixo do catálogo → suspeito e sem valor a pagar (o robô não confirma)', () => {
  const r = X.confere(ped(KIT, 1000, { pag: 'alias' }), prods, pisos, null, false, COT);
  assert.strictEqual(r.ok, false);
});
t('PIX: valor em centavos do preço em reais do carrinho', () => {
  const r = X.confere(ped(KIT, 100000, { pag: 'pix', brl: 70 }), prods, pisos, null, false, COT);
  assert.ok(r.ok, r.motivos.join()); assert.deepStrictEqual(r.pagar, { moeda: 'brl', valor: 7000 });
});
t('BURLA: total certo mas PIX trocado para R$ 1,00 → suspeito', () => {
  const r = X.confere(ped(KIT, 100000, { pag: 'pix', brl: 1 }), prods, pisos, null, false, COT);
  assert.strictEqual(r.ok, false); assert.ok(!r.pagar);
});
t('BURLA: PIX 20% abaixo do preço → suspeito; cotação de ontem (3%) passa', () => {
  assert.strictEqual(X.confere(ped(KIT, 100000, { pag: 'pix', brl: 57 }), prods, pisos, null, false, COT).ok, false);
  assert.ok(X.confere(ped(KIT, 100000, { pag: 'pix', brl: 70 }), prods, pisos, null, false, COT * 1.03).ok);
});
console.log('presente: ' + n + ' testes ok');
