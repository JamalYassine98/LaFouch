// Prova (28/11/2026, Fase 3 parte 3): o leitor do projeto de teste só LÊ, só o lafouch-teste, e nada vai para o repositório.
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs'); const path = require('path');
const R = path.join(__dirname, '..');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
let auto = ''; try { auto = execFileSync('python3', ['tools/le-teste.py', '--autoteste'], { cwd: R, encoding: 'utf8' }); } catch (e) { auto = String(e.stdout || e); }
ok(/autoteste ok/.test(auto), 'leitor: valores do Firestore, filtro por hora e resumo com foto e envios');
const le = fs.readFileSync(path.join(R, 'tools/le-teste.py'), 'utf8');
ok(!/lafouch-2f6bd/.test(le) && /PROJETO = 'lafouch-teste'/.test(le), 'TRAVA: o leitor só conhece o projeto de teste');
ok(!/'(PATCH|DELETE|PUT)'|method=/.test(le) && (le.match(/https:\/\/[a-z.]+/g) || []).every((u) => /firestore\.googleapis\.com|storage\.googleapis\.com/.test(u)), 'TRAVA: o leitor só faz consultas (sem gravar nem apagar) e só no Firestore/Storage');
const wf = fs.readFileSync(path.join(R, '.github/workflows/ler-teste.yml'), 'utf8');
ok(/workflow_dispatch/.test(wf) && !/schedule:/.test(wf), 'workflow só roda quando chamado (sem rodada agendada, sem gasto)');
ok(/contents: read/.test(wf) && !/contents: write/.test(wf) && /@lafouch-teste\.iam\.gserviceaccount\.com/.test(wf) && !/lafouch-2f6bd/.test(wf), 'TRAVA: workflow não grava no repositório e só aceita conta do projeto de teste');
const cfg = JSON.parse(fs.readFileSync(path.join(R, 'tools/teste-projeto.json'), 'utf8'));
ok(cfg.projeto === 'lafouch-teste' && (cfg.conta_le === '' || /^github-le@lafouch-teste\.iam\.gserviceaccount\.com$/.test(cfg.conta_le)), 'configuração aponta só para a conta de leitura do teste');
ok(!/private_key|BEGIN [A-Z ]*KEY/.test(JSON.stringify(cfg) + wf + le), 'TRAVA: nenhuma chave guardada (acesso sem chave)');
ok(/^work\/relatorios\/$/m.test(fs.readFileSync(path.join(R, '.gitignore'), 'utf8')), 'leituras ficam fora do repositório (.gitignore)');
console.log(falhas ? falhas + ' FALHA(S)' : 'le-teste: tudo ok');
process.exit(falhas ? 1 : 0);
