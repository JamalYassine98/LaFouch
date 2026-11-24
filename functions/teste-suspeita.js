// Testes da reserva suspeita (suspeita.js) — 22/11/2026.
'use strict';
const assert = require('assert');
const S = require('./suspeita');
let total = 0; const falhas = [];
async function teste(nome, fn) { total++; try { await fn(); console.log('  ok  ', nome); } catch (e) { falhas.push(nome); console.log(' FALHA', nome, '\n       ', e.message); } }
const T0 = Date.UTC(2026, 10, 22, 18);
// banco de mentira: por rede guarda {pid: {ts, refs}}; "pagos" = pedidos já pagos
function banco(pagos) {
  const rede = {}, gravados = {};
  return {
    gravados,
    anota: async (r, pid, refs, agora) => { const m = rede[r] = rede[r] || {}; for (const k of Object.keys(m)) if (agora - m[k].ts > S.HORA) delete m[k]; m[pid] = m[pid] || { ts: agora, refs }; return Object.keys(m).map((k) => ({ pid: k, refs: m[k].refs })); },
    aberta: async (x) => !(pagos || []).includes(x.pid),
    grava: async (pid, o) => { gravados[pid] = o; },
  };
}
const it = (q, ref, cor) => ({ ref: ref || 'KIT3C', cor: cor || 'preto', q });

(async () => {
  await teste('compra normal (1–4 iguais, primeira da rede): nada é marcado', async () => {
    const db = banco();
    assert.strictEqual(await S.confere(db, 'p1', [it(4)], 'redeA', T0, T0 + 1800e3), null);
    assert.deepStrictEqual(db.gravados, {});
  });
  await teste('5 iguais (mesmo em linhas separadas da mesma peça e cor) → suspeita "iguais"', async () => {
    const db = banco(); const o = await S.confere(db, 'p2', [it(3), it(2, 'KIT3C', ' Preto ')], 'redeA', T0, T0 + 1800e3);
    assert.deepStrictEqual([o.motivos, o.iguais, o.exp], [['iguais'], 5, T0 + 1800e3]); assert.ok(db.gravados.p2);
  });
  await teste('5 peças DIFERENTES não contam como iguais', async () => {
    assert.strictEqual(await S.confere(banco(), 'p3', [it(1, 'A'), it(1, 'B'), it(1, 'C'), it(1, 'D'), it(1, 'E')], 'redeA', T0, 0), null);
  });
  await teste('3 reservas abertas da mesma rede na mesma hora → a 3ª é marcada "rede"', async () => {
    const db = banco();
    assert.strictEqual(await S.confere(db, 'a1', [it(1)], 'redeB', T0, 0), null);
    assert.strictEqual(await S.confere(db, 'a2', [it(1)], 'redeB', T0 + 60e3, 0), null);
    const o = await S.confere(db, 'a3', [it(1)], 'redeB', T0 + 120e3, 0);
    assert.deepStrictEqual([o.motivos, o.abertas.sort()], [['rede'], ['a1', 'a2', 'a3']]);
  });
  await teste('reservas já pagas e as de mais de 1 hora não contam; outra rede não se mistura', async () => {
    const db = banco(['a1']);
    await S.confere(db, 'a1', [it(1)], 'redeC', T0, 0);
    await S.confere(db, 'a2', [it(1)], 'redeC', T0, 0);
    assert.strictEqual(await S.confere(db, 'a3', [it(1)], 'redeC', T0 + 60e3, 0), null); // a1 está paga
    assert.strictEqual(await S.confere(db, 'b1', [it(1)], 'redeD', T0 + 60e3, 0), null);
    const db2 = banco();
    await S.confere(db2, 'v1', [it(1)], 'redeE', T0, 0); await S.confere(db2, 'v2', [it(1)], 'redeE', T0, 0);
    assert.strictEqual(await S.confere(db2, 'v3', [it(1)], 'redeE', T0 + S.HORA + 1, 0), null); // as duas primeiras passaram de 1 h
  });
  await teste('o mesmo pedido renovando a reserva não vira "várias reservas"', async () => {
    const db = banco();
    for (let i = 0; i < 5; i++) assert.strictEqual(await S.confere(db, 'r1', [it(1)], 'redeF', T0 + i * 60e3, 0), null);
  });
  await teste('gatilhos aprovados (22/11 15:20): 5 iguais, 3 reservas abertas da rede', async () => {
    assert.deepStrictEqual(S.GATILHO, { iguais: 5, rede: 3 });
  });
  await teste('aviso no celular (parte 2): diz o motivo e manda conferir em Pedidos', async () => {
    assert.deepStrictEqual(S.aviso({ motivos: ['iguais'], iguais: 6, abertas: ['p'] }), { titulo: '⚠️ Reserva suspeita no site', corpo: '6 unidades da mesma peça sem pagar. Confira em Pedidos.' });
    assert.strictEqual(S.aviso({ motivos: ['iguais', 'rede'], iguais: 5, abertas: ['a', 'b', 'c'] }).corpo, '5 unidades da mesma peça sem pagar · 3 reservas abertas da mesma rede na última hora. Confira em Pedidos.');
    assert.strictEqual(S.aviso({}).corpo, 'Reserva fora do comum. Confira em Pedidos.');
  });
  await teste('TRAVA: o aviso nasce só quando o documento nasce (onDocumentCreated em suspeitas/), pelo aviso urgente único', async () => {
    const src = require('fs').readFileSync(__dirname + '/index.js', 'utf8');
    assert.ok(/onDocumentCreated\(\{ document: 'suspeitas\/\{id\}'/.test(src));
    assert.ok(/avisaUrgente\(a\.titulo, a\.corpo, 'suspeita', ev\.params\.id\)/.test(src));
    assert.strictEqual((src.match(/avisaAparelhos\(\(\) => true/g) || []).length, 1); // um só aviso que ignora o silêncio
  });
  await teste('TRAVA: a reserva chama a suspeita depois de reservar, sem derrubar a reserva', async () => {
    const fs = require('fs'), src = fs.readdirSync(__dirname).filter((f) => /^ind.*\.js$/.test(f)).map((f) => fs.readFileSync(__dirname + '/' + f, 'utf8')).join('');
    assert.ok(/Suspeita\.confere\(susDb, String\(b\.pedido \|\| ''\), b\.itens, ipkDe\(req\), agora, r\.exp\)\.catch\(/.test(src));
  });
  console.log(total - falhas.length + '/' + total + ' testes da suspeita passaram' + (falhas.length ? '  |  FALHARAM: ' + falhas.join(' ; ') : ''));
  process.exit(falhas.length ? 1 : 0);
})();
