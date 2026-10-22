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
const saida = '(function () {\n' + corpo + '})();\n';

if (process.argv.includes('--check')) {
  const atual = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (atual !== saida) {
    console.error('www/app.js desatualizado: rode "node build.js"');
    process.exit(1);
  }
  console.log('www/app.js em dia (' + modulos.length + ' módulos)');
} else {
  fs.writeFileSync(OUT, saida);
  console.log('www/app.js gerado: ' + modulos.length + ' módulos, ' + saida.split('\n').length + ' linhas');
}
