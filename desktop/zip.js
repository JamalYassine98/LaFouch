// Abre o pacote da atualização ao vivo (www-<v>.zip) no PC, sem biblioteca de fora: lê o índice do zip e
// descompacta cada arquivo (guardado ou "deflate", os dois tipos que o zip comum usa). Caminho para fora da pasta é recusado.
const fs = require('fs'), path = require('path'), zlib = require('zlib');

function abre(arqZip, destino) {
  const b = fs.readFileSync(arqZip);
  let fim = -1;
  for (let i = b.length - 22; i >= Math.max(0, b.length - 65557); i--) if (b.readUInt32LE(i) === 0x06054b50) { fim = i; break; }
  if (fim < 0) throw new Error('zip sem índice');
  const qtd = b.readUInt16LE(fim + 10);
  let p = b.readUInt32LE(fim + 16);
  const base = path.resolve(destino);
  let n = 0;
  for (let k = 0; k < qtd; k++) {
    if (b.readUInt32LE(p) !== 0x02014b50) throw new Error('zip com índice estragado');
    const met = b.readUInt16LE(p + 10), tamC = b.readUInt32LE(p + 20), tam = b.readUInt32LE(p + 24);
    const ln = b.readUInt16LE(p + 28), le = b.readUInt16LE(p + 30), lc = b.readUInt16LE(p + 32), loc = b.readUInt32LE(p + 42);
    const nome = b.toString('utf8', p + 46, p + 46 + ln);
    p += 46 + ln + le + lc;
    const f = path.resolve(base, nome);
    if (path.isAbsolute(nome) || nome.indexOf('..') >= 0 || (f !== base && !f.startsWith(base + path.sep))) throw new Error('caminho');
    if (/\/$/.test(nome)) { fs.mkdirSync(f, { recursive: true }); continue; }
    if (b.readUInt32LE(loc) !== 0x04034b50) throw new Error('zip com arquivo estragado');
    const ini = loc + 30 + b.readUInt16LE(loc + 26) + b.readUInt16LE(loc + 28);
    const cru = b.subarray(ini, ini + tamC);
    const dado = met === 0 ? cru : met === 8 ? zlib.inflateRawSync(cru) : null;
    if (!dado || dado.length !== tam) throw new Error('arquivo incompleto no zip');
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, dado);
    n++;
  }
  return n;
}
module.exports = { abre };
