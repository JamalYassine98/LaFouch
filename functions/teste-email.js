// Trava (regra 12e): o envio de e-mail mora num lugar só (emailResend).
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/index.js', 'utf8');
let ok = 0, falhas = 0;
function t(nome, cond) { if (cond) { ok++; console.log('  ok  ' + nome); } else { falhas++; console.log('  FALHA  ' + nome); } }
const conta = (s) => src.split(s).length - 1;
const corpo = (src.split('function emailResend(')[1] || '').split('\n}\n')[0];
t('existe uma função emailResend só', conta('function emailResend(') === 1);
t('só um fetch para a Resend, dentro da função', conta('api.resend.com/emails') === 1 && corpo.includes('api.resend.com/emails'));
t('só uma leitura da chave, dentro da função', conta('RESEND_KEY.value()') === 1 && corpo.includes('RESEND_KEY.value()'));
t('remetente definido num lugar só', conta('nao-responda@') === 1);
console.log(falhas ? `email: ${falhas} falha(s)` : `email: ${ok} testes ok`);
process.exit(falhas ? 1 : 0);
