// Testes do telefone completo (fone.js) — 24/11/2026: compara o número INTEIRO, com o país.
'use strict';
const { fone } = require('./fone');
const T = require('./token');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
ok(fone('+595 981 555 111') === '595981555111' && fone('0981 555-111') === '595981555111' && fone('981555111') === '595981555111' && fone('00595981555111') === '595981555111', 'Paraguai: com ou sem +595, com ou sem o 0 = o mesmo número');
ok(fone('+55 (45) 99981-5551') === '5545999815551' && fone('45999815551') === '5545999815551', 'Brasil: com ou sem +55 = o mesmo número');
ok(fone('+55 45 3025-1234') === '554530251234', 'Brasil fixo');
ok(fone('+54 9 11 2345 6789') === '5491123456789', 'Argentina');
ok(fone('+595 981 555 111') !== fone('+55 11 98155 5111'), 'FURO FECHADO: Paraguai e Brasil com os mesmos 9 últimos dígitos NÃO são o mesmo telefone');
ok(fone('') === '' && fone('123') === '' && fone('0999999999') === '' && fone('abc') === '', 'vazio, curto ou repetido = nenhum telefone');
ok(T.mesmoTel('+595 981 555 111', '0981555111') && !T.mesmoTel('+595 981 555 111', '+55 11 98155 5111') && !T.mesmoTel('+595981555111', '+595 991 555 111'), 'token de entrega: confere o número inteiro (antes: só os 6 últimos)');
ok(!T.mesmoTel('', '') && !T.mesmoTel('+595981555111', ''), 'token de entrega: sem telefone não confere');
const fs = require('fs'), src = fs.readdirSync(__dirname).filter((f) => /\.js$/.test(f) && !/^teste-/.test(f) && f !== 'fone.js').map((f) => fs.readFileSync(__dirname + '/' + f, 'utf8')).join('\n');
ok(!/slice\(-9\)/.test(src) && !/slice\(-6\)/.test(src), 'TRAVA: nenhuma parte da nuvem compara telefone pelos últimos dígitos');
console.log(falhas ? falhas + ' FALHA(S)' : 'fone: tudo ok');
process.exit(falhas ? 1 : 0);
