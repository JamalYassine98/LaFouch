// Testes do App Check nas portas públicas (selo.js) — 20/11/2026.
'use strict';
const assert = require('assert');
const S = require('./selo');
let total = 0; const falhas = [];
async function teste(nome, fn) { total++; try { await fn(); console.log('  ok  ', nome); } catch (e) { falhas.push(nome); console.log(' FALHA', nome, '\n       ', e.message); } }
const req = (h) => ({ get: (k) => (k === 'X-Firebase-AppCheck' ? h : '') });
const verifica = async (t) => { if (t !== 'bom') throw new Error('ruim'); return {}; };
const T0 = Date.UTC(2026, 10, 20, 12, 0, 0);

(async () => {
  await teste('selo válido conta como "com" e passa', async () => {
    const c = []; const r = await S.confere(req('bom'), 'cupom', T0, verifica, async (d, k) => c.push([d, k]));
    assert.deepStrictEqual([r.estado, r.passa], ['com', true]); assert.deepStrictEqual(c, [['2026-11-20', 'cupom_com']]);
  });
  await teste('sem selo e selo falso são contados (no modo anotar, ainda passam)', async () => {
    const c = [];
    const a = await S.confere(req(''), 'reserva', T0, verifica, async (d, k) => c.push(k));
    const b = await S.confere(req('falso'), 'reserva', T0, verifica, async (d, k) => c.push(k));
    assert.deepStrictEqual([a.estado, b.estado, c], ['sem', 'ruim', ['reserva_sem', 'reserva_ruim']]);
    assert.strictEqual(a.passa && b.passa, S.MODO !== 'exigir');
  });
  await teste('o contador fora do ar não derruba a porta', async () => {
    const r = await S.confere(req('bom'), 'conta', T0, verifica, async () => { throw new Error('x'); });
    assert.ok(r.passa);
  });
  await teste('o dia é o do Paraguai (00:30 em Assunção ainda é o dia certo)', async () => {
    assert.strictEqual(S.dia(Date.UTC(2026, 10, 21, 3, 30)), '2026-11-21'); assert.strictEqual(S.dia(Date.UTC(2026, 10, 21, 2, 30)), '2026-11-20');
  });
  await teste('TRAVA: toda porta pública confere o selo (reserva, conta, cupom, mensagem, analise, novidades, volta, avaliacao, atacado, codigo)', async () => {
    const src = require('fs').readFileSync(__dirname + '/index.js', 'utf8');
    const falta = ['reserva', 'conta', 'cupom', 'mensagem', 'analise', 'novidades', 'volta', 'avaliacao', 'atacado', 'codigo']
      .filter((p) => !new RegExp("seloOk\\(req, res, '" + p + "'\\)").test(src));
    assert.deepStrictEqual(falta, []);
  });
  console.log(total - falhas.length + '/' + total + ' testes do selo passaram' + (falhas.length ? '  |  FALHARAM: ' + falhas.join(' ; ') : ''));
  process.exit(falhas.length ? 1 : 0);
})();
