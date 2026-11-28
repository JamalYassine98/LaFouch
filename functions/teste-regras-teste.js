// Prova (28/11/2026, Fase 3): as regras do projeto de TESTE são as MESMAS da loja + só a área de relatórios.
// Falha se alguém editar firestore.teste.rules / storage.teste.rules à mão ou mudar o firestore.rules sem remontar.
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const RAIZ = path.join(__dirname, '..');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
let saiu = '';
try { saiu = execFileSync('python3', [path.join(RAIZ, 'tools/regras-teste.py'), '--conferir'], { encoding: 'utf8' }); } catch (e) { saiu = String(e.stdout || '') + String(e.stderr || ''); }
ok(/iguais às reais \+ relatórios/.test(saiu), 'regras do teste = firestore.rules da loja (dono do teste) + só os relatórios (remontar: python3 tools/regras-teste.py)');
const real = fs.readFileSync(path.join(RAIZ, 'firestore.rules'), 'utf8'), teste = fs.readFileSync(path.join(RAIZ, 'firestore.teste.rules'), 'utf8');
ok(!/relatorios/.test(real), 'a área de relatórios NUNCA entra nas regras da loja real');
ok(!/jJzNDoMHtuRNOAF1GhJfNYDMlE63/.test(teste) && /uvYpqxPJZjTsSE9SACouW0nZH4d2/.test(teste), 'o teste só conhece o dono do projeto de teste');
const bloco = teste.slice(teste.indexOf('match /relatorios/'));
ok(/allow create:/.test(bloco) && !/allow (read|get|list|update|delete|write)/.test(bloco.slice(0, bloco.indexOf('\n    }'))), 'relatórios: só criar — ninguém lê, muda ou apaga pelo celular');
const st = fs.readFileSync(path.join(RAIZ, 'storage.teste.rules'), 'utf8');
ok(/allow create:/.test(st) && !/allow (read|get|list|update|delete|write)/.test(st) && /400 \* 1024/.test(st) && /image\/jpeg/.test(st), 'foto do relatório: só criar, até 400 KB, só JPEG');
const cfg = JSON.parse(fs.readFileSync(path.join(RAIZ, 'firebase.teste.json'), 'utf8')), cfgReal = JSON.parse(fs.readFileSync(path.join(RAIZ, 'firebase.json'), 'utf8'));
ok(cfg.firestore.rules === 'firestore.teste.rules' && cfg.storage.rules === 'storage.teste.rules' && !cfg.hosting && cfgReal.firestore.rules === 'firestore.rules' && !cfgReal.storage, 'publicar no teste usa firebase.teste.json; a loja real continua com firebase.json');
console.log(falhas ? falhas + ' FALHA(S)' : 'regras-teste: tudo ok');
process.exit(falhas ? 1 : 0);
