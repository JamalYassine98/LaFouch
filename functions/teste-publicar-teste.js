// Prova (28/11/2026, Fase 3 parte 4): publicar no projeto de teste não muda nada da loja real e não guarda chave.
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs'); const path = require('path');
const R = path.join(__dirname, '..');
let falhas = 0; const ok = (c, t) => { console.log((c ? '  ok  ' : ' FALHA ') + t); if (!c) falhas++; };
const wf = fs.readFileSync(path.join(R, '.github/workflows/publicar-nuvem.yml'), 'utf8');
const sh = fs.readFileSync(path.join(R, 'tools/configura-publicar-nuvem.sh'), 'utf8');
const cfg = JSON.parse(fs.readFileSync(path.join(R, 'tools/teste-projeto.json'), 'utf8'));
ok(/default: loja/.test(wf) && /P=projects\/462328668572\/locations\/global\/workloadIdentityPools\/github\/providers\/lafouch/.test(wf) && /C=github-publica@lafouch-2f6bd\.iam\.gserviceaccount\.com/.test(wf), 'loja real continua o padrão, com a mesma ponte e a mesma conta');
ok(/if: github\.ref == 'refs\/heads\/main'/.test(wf) && wf.indexOf('teste-*.js') < wf.indexOf('google-github-actions/auth'), 'só no main e só depois de todas as provas da nuvem');
ok(/if: inputs\.onde != 'teste' && inputs\.ramo != 'main'\n\s+run: [^\n]*exit 1/.test(wf) && wf.indexOf('Loja real só publica o main') < wf.indexOf('actions/checkout'), 'TRAVA: outro ramo só no teste; a loja real só publica o main');
ok(!/--force/.test(wf.replace(/#.*$/gm, '')), 'TRAVA: sem --force (nunca apaga função sozinho)');
ok(/tools\/regras-teste\.py --conferir/.test(wf) && /config=firebase\.teste\.json/.test(wf) && /functions\|regras\|tudo\) ;;/.test(wf), 'teste: confere as regras geradas, usa firebase.teste.json e só publica funções/regras');
ok(/name: Conferir a nuvem[^\n]*\n\s+if: inputs\.onde != 'teste'/.test(wf) && /o_que == 'limpeza' && inputs\.onde != 'teste'/.test(wf), 'sonda e limpeza só na loja real');
ok(/--project "\$PROJ"/.test(wf) && !/--project lafouch-2f6bd --non-interactive/.test(wf), 'o projeto da publicação vem de um lugar só (passo "Qual projeto")');
ok(cfg.projeto === 'lafouch-teste' && (cfg.conta_publica === '' || cfg.conta_publica === 'github-publica@lafouch-teste.iam.gserviceaccount.com') && (cfg.provedor === '' || /^projects\/\d+\/locations\/global\/workloadIdentityPools\/github\/providers\/lafouch$/.test(cfg.provedor)), 'tools/teste-projeto.json só aponta para o projeto de teste');
let sintaxe = true; try { execFileSync('bash', ['-n', path.join(R, 'tools/configura-publicar-nuvem.sh')]); } catch (e) { sintaxe = false; }
ok(sintaxe && /ONDE=\$\{1:-loja\}/.test(sh) && /teste\) P=lafouch-teste/.test(sh), 'script único (loja|teste), loja é o padrão');
const leRoles = (sh.match(/papel "github-le@[^"]+" (\S+)/g) || []).map((x) => x.split(' ').pop());
ok(leRoles.length === 2 && leRoles.every((r) => /^roles\/(datastore\.viewer|storage\.objectViewer)$/.test(r)), 'TRAVA: github-le só lê (Firestore e Storage)');
const iSeg = sh.indexOf('gcloud secrets create'), iTeste = sh.indexOf('if [ "$ONDE" = teste ]; then');
ok(iSeg > iTeste && iTeste > 0 && /'teste-sem-envio'/.test(sh), 'segredos de mentira só no projeto de teste');
ok(!/delete|remove-iam/.test(sh.replace(/^#.*$/gm, '')), 'TRAVA: o script nunca apaga nada');
ok(!/private_key|BEGIN [A-Z ]*KEY|keys create/.test(sh + wf + JSON.stringify(cfg)), 'TRAVA: nenhuma chave criada nem guardada');
console.log(falhas ? falhas + ' FALHA(S)' : 'publicar-teste: tudo ok');
process.exit(falhas ? 1 : 0);
