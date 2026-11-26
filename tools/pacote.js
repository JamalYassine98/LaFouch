// Pacote da atualização ao vivo (26/11, work/esboco/atualiza/COMO-FAZER-ATUALIZA-AO-VIVO.md).
// Um lugar só: a cada publicação a pasta www INTEIRA vira www-<v>.zip, e o version.json publicado ganha
//   zip  = endereço do pacote no GitHub Pages
//   soma = sha256 do pacote (o celular e o PC conferem: pacote cortado não instala)
// O MESMO pacote serve o celular (CapacitorUpdater) e o PC (desktop/pc-atualiza.js).
// Uso (nos workflows, antes de subir o www para o Pages):  node tools/pacote.js
//      tirar o pacote de novo (ex.: antes de montar o APK):  node tools/pacote.js --limpa
// O version.json de DENTRO do pacote fica sem zip/soma (o pacote não pode conter a própria soma).
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { execFileSync } = require('child_process'), os = require('os');
const WWW = process.env.LF_WWW || path.join(__dirname, '..', 'www');
const URL_APP = 'https://jamalyassine98.github.io/LaFouch/';
const VJ = path.join(WWW, 'version.json');

function limpa() {
  for (const f of fs.readdirSync(WWW)) if (/^www-\d+\.zip$/.test(f)) fs.rmSync(path.join(WWW, f));
  const v = JSON.parse(fs.readFileSync(VJ, 'utf8'));
  if (v.zip || v.soma) { delete v.zip; delete v.soma; fs.writeFileSync(VJ, JSON.stringify(v) + '\n'); }
  return v;
}
function soma(f) { return crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'); }

function monta() {
  const v = limpa();
  const n = +v.v;
  if (!n) throw new Error('version.json sem número');
  const nome = 'www-' + n + '.zip', tmp = path.join(os.tmpdir(), 'lf-' + process.pid + '-' + nome);
  fs.rmSync(tmp, { force: true });
  execFileSync('zip', ['-r', '-X', '-q', tmp, '.'], { cwd: WWW }); // index.html na raiz do pacote
  fs.renameSync(tmp, path.join(WWW, nome));
  const out = Object.assign({}, v, { zip: URL_APP + nome, soma: soma(path.join(WWW, nome)) });
  fs.writeFileSync(VJ, JSON.stringify(out) + '\n');
  return { nome, tam: fs.statSync(path.join(WWW, nome)).size, soma: out.soma };
}

if (require.main === module) {
  if (process.argv.includes('--limpa')) { limpa(); console.log('pacote tirado'); }
  else { const r = monta(); console.log('pacote ' + r.nome + ' · ' + (r.tam / 1048576).toFixed(1) + ' MB · sha256 ' + r.soma); }
}
module.exports = { monta, limpa, soma };
