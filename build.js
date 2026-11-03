#!/usr/bin/env node
/**
 * Monta www/app.js a partir dos módulos em src/ (ordem alfabética = ordem de execução).
 * Todos os módulos ficam dentro de UMA função, compartilhando o mesmo escopo (estado `S`, helpers).
 * Uso:  node build.js          -> gera www/app.js
 *       node build.js --check  -> falha se www/app.js estiver desatualizado
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const OUT = path.join(__dirname, 'www', 'app.js');

const modulos = fs.readdirSync(SRC).filter((f) => f.endsWith('.js')).sort();
const corpo = modulos.map((f) => fs.readFileSync(path.join(SRC, f), 'utf8')).join('');
const sw = fs.readFileSync(path.join(__dirname, 'www', 'sw.js'), 'utf8');
const BUILD = +(sw.match(/lafouch-v(\d+)/) || [0, 0])[1];
const NOTAS_F = path.join(__dirname, 'docs', 'novidades.json');
let NOV = {};
try { NOV = JSON.parse(fs.readFileSync(NOTAS_F, 'utf8')); } catch (e) {}
if (Array.isArray(NOV)) NOV = { notas: NOV };
const NOME = String(NOV.nome || BUILD);
const NOTAS = NOV.notas || [];
const saida = '(function () {\n' + corpo.replace('__APP_BUILD__', BUILD).replace('__APP_NOME__', NOME) + '})();\n';
const IDX = path.join(__dirname, 'www', 'index.html');
const idx = fs.readFileSync(IDX, 'utf8');
const idxNovo = idx.replace(/\/\*LOADER\*\/\(function\(\)\{var EMB=\d+/, '/*LOADER*/(function(){var EMB=' + BUILD);
const NAT = +((corpo.match(/var APP_NAT = (\d+)/) || [0, 1])[1]);
const VER = JSON.stringify(Object.assign({ v: BUILD, nat: NAT, nome: NOME }, NOTAS.length ? { notas: NOTAS } : {})) + '\n';

if (process.argv.includes('--check')) {
  const atual = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  const verAtual = fs.existsSync(path.join(__dirname, 'www', 'version.json')) ? fs.readFileSync(path.join(__dirname, 'www', 'version.json'), 'utf8') : '';
  if (atual !== saida || idx !== idxNovo || verAtual !== VER) {
    console.error('www/app.js desatualizado: rode "node build.js"');
    process.exit(1);
  }
  console.log('www/app.js em dia (' + modulos.length + ' módulos)');
} else {
  fs.writeFileSync(OUT, saida);
  if (idx !== idxNovo) fs.writeFileSync(IDX, idxNovo);
  fs.writeFileSync(path.join(__dirname, 'www', 'version.json'), VER);
  console.log('www/app.js gerado: ' + modulos.length + ' módulos, ' + saida.split('\n').length + ' linhas');
}
