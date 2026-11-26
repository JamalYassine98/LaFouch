#!/usr/bin/env node
/**
 * Monta www/app.js a partir dos módulos em src/ (ordem alfabética = ordem de execução).
 * Todos os módulos ficam dentro de UMA função, compartilhando o mesmo escopo (estado `S`, helpers).
 * As bibliotecas de terceiros (lib/*.js) entram no app.js como TEXTO (var APP_LIBS em src/01-build.js; quem lê é o appLib):
 * a atualização automática dos aparelhos só leva app.js e style.css, então tudo o que o app precisa tem de ir dentro deles.
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
const LIB = path.join(__dirname, 'lib');
const libs = {};
for (const f of fs.existsSync(LIB) ? fs.readdirSync(LIB).filter((x) => x.endsWith('.js')).sort() : []) libs[f.replace(/\.js$/, '')] = fs.readFileSync(path.join(LIB, f), 'utf8');
const LIBS = JSON.stringify(libs).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029'); // texto de programa: os dois separadores de linha vão escritos por extenso
const NOTAS_F = path.join(__dirname, 'docs', 'novidades.json');
let NOV = {};
try { NOV = JSON.parse(fs.readFileSync(NOTAS_F, 'utf8')); } catch (e) {}
if (Array.isArray(NOV)) NOV = { notas: NOV };
const NOME = String(NOV.nome || BUILD);
// 13/11/2026 (bug do dono: 'a versão trava na 5.9.0'): o nome e as novidades vêm de docs/novidades.json e são manuais. Se o número do sw.js subiu e o arquivo não, avisa bem alto.
if (NOV.build !== BUILD) console.warn('\n*** ATENÇÃO: docs/novidades.json é da versão ' + (NOV.build || '?') + ' e o sw.js está na ' + BUILD + '. Atualize "nome", "build" e "notas" — senão o app continua mostrando ' + NOME + ' ***\n');
const NOTAS = NOV.notas || [];
const saida = '(function () {\n' + corpo.replace('__APP_BUILD__', BUILD).replace('__APP_NOME__', NOME).replace('__APP_LIBS__', () => LIBS) + '})();\n';
const NAT = +((corpo.match(/var APP_NAT = (\d+)/) || [0, 1])[1]);
const VER = JSON.stringify(Object.assign({ v: BUILD, nat: NAT, nome: NOME }, NOTAS.length ? { notas: NOTAS } : {})) + '\n';

if (process.argv.includes('--check')) {
  const atual = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  const verAtual = fs.existsSync(path.join(__dirname, 'www', 'version.json')) ? fs.readFileSync(path.join(__dirname, 'www', 'version.json'), 'utf8') : '';
  if (atual !== saida || verAtual !== VER) {
    console.error('www/app.js desatualizado: rode "node build.js"');
    process.exit(1);
  }
  console.log('www/app.js em dia (' + modulos.length + ' módulos)');
} else {
  fs.writeFileSync(OUT, saida);
  fs.writeFileSync(path.join(__dirname, 'www', 'version.json'), VER);
  console.log('www/app.js gerado: ' + modulos.length + ' módulos, ' + saida.split('\n').length + ' linhas');
}
// S181 (13/11/2026): modo loja — cópia do site dentro do app (www/loja/), para o tablet funcionar sem internet.
// Só o necessário (página, scripts, fotos pequenas); caminhos "/js/", "/media/", "/p/" passam a apontar para /loja/.
if (!process.argv.includes('--check')) {
  const SITE = path.join(__dirname, '..', 'catalogo'), LJ = path.join(__dirname, 'www', 'loja');
  if (fs.existsSync(path.join(SITE, 'index.html'))) {
    // S376 (16/11/2026, aprovado: Mochi com voz no modo loja): as vozes NÃO entram na cópia — são 378 arquivos e o atualizador dos APKs já instalados recusa lista com mais de 400
    // (a cópia tem 103). No modo loja a voz é buscada no site (lafouch.com) e fica guardada no aparelho pelo próprio site; sem internet na 1ª vez, a Mochi fala só pelo balão.
    const muda = (t) => t.replace(/(["'(])\/(js|media|p|lfx)\//g, '$1/loja/$2/').replace(/\/loja\/media\/voz\//g, 'https://lafouch.com/media/voz/').replace("connect-src 'self' ", "connect-src 'self' https://lafouch.com ");
    const copia = (de, para, txt) => { fs.mkdirSync(path.dirname(para), { recursive: true }); if (txt) fs.writeFileSync(para, muda(fs.readFileSync(de, 'utf8'))); else fs.copyFileSync(de, para); };
    const pasta = (rel, txt) => { const d = path.join(SITE, rel); if (!fs.existsSync(d)) return; for (const f of fs.readdirSync(d)) { const a = path.join(d, f); if (fs.statSync(a).isFile()) copia(a, path.join(LJ, rel, f), txt); } };
    fs.rmSync(LJ, { recursive: true, force: true });
    copia(path.join(SITE, 'index.html'), path.join(LJ, 'loja.html'), true);
    pasta('js', true); pasta('p'); pasta(path.join('media', 'i'));
    ['favicon-48.png', 'icon-192.png'].forEach((f) => { if (fs.existsSync(path.join(SITE, f))) copia(path.join(SITE, f), path.join(LJ, f)); });
    // S332: lista da cópia (versão do site + cada arquivo com tamanho e resumo) para a atualização automática do modo loja
    const lista = []; const anda = (d, rel) => { for (const f of fs.readdirSync(d).sort()) { const a = path.join(d, f), r = rel ? rel + '/' + f : f; if (fs.statSync(a).isDirectory()) anda(a, r); else if (r !== 'manifest.json') { const b = fs.readFileSync(a); lista.push([r, b.length, require('crypto').createHash('md5').update(b).digest('hex').slice(0, 10)]); } } };
    anda(LJ, '');
    let sv = 0; try { sv = +JSON.parse(fs.readFileSync(path.join(SITE, 'version.json'), 'utf8')).v || 0; } catch (e) {}
    fs.writeFileSync(path.join(LJ, 'manifest.json'), JSON.stringify({ v: sv, files: lista }));
    console.log('www/loja/ (modo loja) copiado do site · versão ' + sv + ' · ' + lista.length + ' arquivos');
  }
}
