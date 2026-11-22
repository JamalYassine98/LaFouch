// Testes dos limites por rede (rede.js) — 22/11/2026.
'use strict';
const assert = require('assert');
const R = require('./rede');
let total = 0; const falhas = [];
async function teste(nome, fn) { total++; try { await fn(); console.log('  ok  ', nome); } catch (e) { falhas.push(nome); console.log(' FALHA', nome, '\n       ', e.message); } }

(async () => {
  await teste('IPv4: o endereço inteiro (também escrito como IPv6 e no x-forwarded-for)', async () => {
    assert.deepStrictEqual([R.chave('181.120.5.9'), R.chave('::ffff:181.120.5.9'), R.chave('181.120.5.9, 10.0.0.1'), R.chave('')], ['181.120.5.9', '181.120.5.9', '181.120.5.9', '']);
  });
  await teste('IPv6: a mesma casa/celular (mesmo bloco /64) é UMA rede, mesmo trocando o fim do endereço', async () => {
    const a = R.chave('2800:a4:1234:5678:1111:2222:3333:4444'), b = R.chave('2800:a4:1234:5678::9'), c = R.chave('2800:A4:1234:5678:abcd::1');
    assert.ok(a === b && b === c, a + ' ' + b + ' ' + c);
    assert.notStrictEqual(R.chave('2800:a4:1234:5679::9'), a);
    assert.strictEqual(R.chave('2800:a4::1'), '2800:a4:0:0::/64');
  });
  await teste('números aprovados (22/11 15:01): reserva 30, pedido 30 por rede, 5 por telefone', async () => {
    assert.deepStrictEqual([R.LIMITE.reserva, R.LIMITE.pedido, R.LIMITE.tel], [30, 30, 5]);
  });
  await teste('TRAVA: as portas usam a rede de rede.js (nenhuma volta a contar o endereço inteiro)', async () => {
    const fs = require('fs'), src = fs.readdirSync(__dirname).filter((f) => /^ind.*\.js$/.test(f)).map((f) => fs.readFileSync(__dirname + '/' + f, 'utf8')).join('');
    assert.ok(!/hash\(req\.ip/.test(src), 'ainda há hash(req.ip …)');
    for (const p of ['Pedido.entrega(pedDb, b, Date.now(), ipkDe(req))', "pedDb.conta('reserva_r' + ipkDe(req), agora)", 'Mensagem.enviar(msgDb, envia, b, redeDe(req)', 'const ipk = ipkDe(req)', "ipkDe(req), urlFn('novidades')"]) assert.ok(src.includes(p), 'falta: ' + p);
    assert.ok(!/lojaRede|marcaLoja/.test(src), 'sobrou a rede da loja (retirada 22/11 15:10)');
  });
  console.log(total - falhas.length + '/' + total + ' testes da rede passaram' + (falhas.length ? '  |  FALHARAM: ' + falhas.join(' ; ') : ''));
  process.exit(falhas.length ? 1 : 0);
})();
