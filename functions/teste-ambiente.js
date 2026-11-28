// Prova (28/11/2026, Fase 3): loja real × projeto de teste num lugar só (ambiente.js); no TESTE nada sai para fora.
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
const em = (proj) => JSON.parse(execFileSync(process.execPath, ['-e', "const A=require('./ambiente');console.log(JSON.stringify({t:A.TESTE,f:A.SAIDA_FORA,u:A.DONO_UID,k:A.CHAVE_PUBLICA}))"], { cwd: __dirname, env: Object.assign({}, process.env, { GCLOUD_PROJECT: proj }), encoding: 'utf8' }));
const real = em('lafouch-2f6bd'), teste = em('lafouch-teste'), local = em('');
ok(real.f === true && real.t === false && real.u === 'jJzNDoMHtuRNOAF1GhJfNYDMlE63' && /^AIzaSyAW-/.test(real.k), 'loja real: fala com o mundo, dono e chave da loja');
ok(teste.f === false && teste.t === true && teste.u === 'uvYpqxPJZjTsSE9SACouW0nZH4d2' && /^AIzaSyDifv/.test(teste.k), 'projeto de teste: nada sai para fora, dono e chave do teste');
ok(local.f === false, 'projeto desconhecido (emulador, teste local): nada sai para fora');
(async () => {
  const A = require('./ambiente'); const gravados = [];
  const db = { collection: (n) => ({ add: async (o) => { gravados.push([n, o]); } }) };
  await A.registraSaida(db, 'email', { para: 'x@y.com', assunto: 'Oi' });
  ok(gravados.length === 1 && gravados[0][0] === 'saidas' && gravados[0][1].tipo === 'email' && gravados[0][1].resumo.assunto === 'Oi' && !('html' in gravados[0][1].resumo), 'no teste o envio vira registro em saidas/ (só o resumo, sem o conteúdo)');
  const src = fs.readFileSync(__dirname + '/index.js', 'utf8');
  ok(!/GCLOUD_PROJECT === 'lafouch-teste'/.test(src) && !/'jJzNDoMHtuRNOAF1GhJfNYDMlE63'|'uvYpqxPJZjTsSE9SACouW0nZH4d2'|'AIzaSyAW-54tS1A_VL2EC9OJWFsw1EtboptpEvc'/.test(src), 'TRAVA: dono, chave e projeto só no ambiente.js (nenhuma cópia no index.js)');
  const iEmail = src.indexOf('function emailResend'), iFetch = src.indexOf("fetch('https://api.resend.com/emails'");
  ok(iEmail > 0 && src.indexOf('if (!Ambiente.SAIDA_FORA)', iEmail) > iEmail && src.indexOf('if (!Ambiente.SAIDA_FORA)', iEmail) < iFetch, 'TRAVA: o e-mail confere o ambiente antes de chamar o Resend');
  const iMidia = src.indexOf('Midia.executa(');
  ok(src.lastIndexOf('if (!Ambiente.SAIDA_FORA)', iMidia) > src.lastIndexOf("exports.midia", iMidia), 'TRAVA: a mídia confere o ambiente antes de ir ao GitHub');
  const fora = (src.match(/fetch\('https:\/\/[^']+'/g) || []).map((x) => x.slice(7));
  ok(fora.every((u) => /api\.resend\.com|identitytoolkit\.googleapis\.com/.test(u)), 'TRAVA: nenhum endereço de fora novo sem passar pelo ambiente (hoje: Resend e o login do próprio projeto)');
  console.log(falhas ? falhas + ' FALHA(S)' : 'ambiente: tudo ok');
  process.exit(falhas ? 1 : 0);
})();
