// Teste da atualização do Windows (desktop/pc-atualiza.js) com um "GitHub" de mentira: pacote do app ao vivo (26/11) e instalador. Rodar: node desktop/teste-pc.js
const http = require('http'), fs = require('fs'), os = require('os'), path = require('path');
const { criar } = require('./pc-atualiza');
const crypto = require('crypto'), { execFileSync } = require('child_process');
const RAIZ = path.join(__dirname, '..', 'www');
const EMB = +JSON.parse(fs.readFileSync(path.join(RAIZ, 'version.json'), 'utf8')).v;
const exe = Buffer.alloc(6 * 1024 * 1024, 7);
// pacotes de mentira (www-<v>.zip): um app mínimo com index.html, app.js e loja/
const OBRA = fs.mkdtempSync(path.join(os.tmpdir(), 'lfpc-zip-'));
function pacote(n, semApp) {
  const d = path.join(OBRA, 'w' + n); fs.mkdirSync(path.join(d, 'loja'), { recursive: true });
  fs.writeFileSync(path.join(d, 'index.html'), '<!doctype html><title>v' + n + '</title>');
  if (!semApp) fs.writeFileSync(path.join(d, 'app.js'), 'var APP_BUILD = ' + n + ';');
  fs.writeFileSync(path.join(d, 'loja', 'loja.html'), 'loja ' + n);
  const z = path.join(OBRA, 'www-' + n + '.zip'); fs.rmSync(z, { force: true });
  execFileSync('zip', ['-r', '-X', '-q', z, '.'], { cwd: d });
  return { n, z, soma: crypto.createHash('sha256').update(fs.readFileSync(z)).digest('hex') };
}
const F = { ver: null, zipUrl: '', soma: '', exeN: EMB + 1, exeTam: exe.length, exeUrl: '', pedidos: [] };
const srv = http.createServer((req, res) => {
  const u = req.url.split('?')[0]; F.pedidos.push(u);
  if (u === '/app/version.json') res.end(JSON.stringify(F.ver ? { v: F.ver.n, nat: 2, zip: F.zipUrl || F.base + '/app/www-' + F.ver.n + '.zip', soma: F.soma || F.ver.soma } : { v: EMB }));
  else if (/^\/app\/www-\d+\.zip$/.test(u) && fs.existsSync(path.join(OBRA, u.slice(5)))) res.end(fs.readFileSync(path.join(OBRA, u.slice(5))));
  else if (u === '/api') res.end(JSON.stringify({ assets: [{ name: 'chave.enc', size: 2688, browser_download_url: F.base + '/dl/chave.enc' }, { name: 'LaFouch-524.apk', size: 18000000, browser_download_url: F.base + '/dl/LaFouch-524.apk' }, { name: 'LaFouch-Setup-' + F.exeN + '.exe', size: F.exeTam, browser_download_url: F.exeUrl || F.base + '/dl/LaFouch-Setup-' + F.exeN + '.exe' }] }));
  else if (/^\/dl\/LaFouch-Setup-\d+\.exe$/.test(u)) res.end(exe);
  else { res.writeHead(404); res.end(); }
});
let ok = 0, falhas = [];
const confere = (nome, c) => { if (c) ok++; else falhas.push(nome); console.log((c ? '  ok  ' : ' FALHA ') + nome); };
srv.listen(0, '127.0.0.1', async () => {
  F.base = 'http://127.0.0.1:' + srv.address().port;
  const dados = fs.mkdtempSync(path.join(os.tmpdir(), 'lfpc-')), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lfpc-tmp-'));
  let recargas = 0;
  const novo = () => criar({ raiz: RAIZ, dados: dados, tmp: tmp, urlApp: F.base + '/app/', urlApi: F.base + '/api', prefixo: F.base + '/dl/', prazo: 300, recarrega: () => { recargas++; } });
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const pastas = () => fs.existsSync(path.join(dados, 'app')) ? fs.readdirSync(path.join(dados, 'app')).filter((d) => /^\d+$/.test(d)).sort() : [];
  let PC = novo();
  try {
    confere('lê o número do instalador (version.json); sem pacote, o app vem do instalador; caminho para fora é recusado', PC.estado().emb === EMB && PC.estado().pc === true && PC.arquivo('/index.html') === path.join(RAIZ, 'index.html') && PC.arquivo('/../segredo') === '' && PC.arquivo('/loja/../../x') === '');
    confere('versão igual à do instalador = nada a baixar', (await PC.baixaApp()).emDia === true && pastas().length === 0);
    const A = pacote(EMB + 1); F.ver = A;
    const ra = await PC.baixaApp();
    confere('A: baixa o pacote inteiro, confere a soma e fica pronta (ainda serve o instalador até trocar)', ra.pronta === A.n && pastas().join() === String(A.n) && PC.arquivo('/app.js') === path.join(RAIZ, 'app.js'));
    confere('A: "Atualizar agora" passa a servir o app INTEIRO do pacote (raiz e /loja/)', PC.usa() === true && fs.readFileSync(PC.arquivo('/app.js'), 'utf8') === 'var APP_BUILD = ' + A.n + ';' && fs.readFileSync(PC.arquivo('/loja/loja.html'), 'utf8') === 'loja ' + A.n);
    PC.pronto(); await espera(400);
    confere('A: com o "pronto" vira a boa; reabrir o programa continua em A; sem recarregar', recargas === 0 && novo().estado().app === A.n && novo().arquivo('/index.html').indexOf(dados) === 0);
    const B = pacote(EMB + 2); F.ver = B; F.soma = 'f'.repeat(64);
    const rb1 = await PC.baixaApp();
    confere('B com soma errada: não instala e A continua', !rb1.pronta && /soma/.test(rb1.erro) && pastas().join() === String(A.n) && fs.readFileSync(PC.arquivo('/app.js'), 'utf8').indexOf(String(A.n)) > 0);
    F.soma = ''; F.zipUrl = 'http://outro-lugar.example/www-' + B.n + '.zip';
    const rb2 = await PC.baixaApp();
    confere('B de endereço fora do site do app: recusado', !rb2.pronta && /endereço/.test(rb2.erro));
    F.zipUrl = '';
    const rb3 = await PC.baixaApp(); PC.usa();
    const serviuB = fs.readFileSync(PC.arquivo('/app.js'), 'utf8').indexOf(String(B.n)) > 0;
    await espera(450);
    confere('B sem "pronto" em 10 s (aqui 0,3 s): volta para A (não para o instalador) e recarrega a janela', rb3.pronta === B.n && serviuB && recargas === 1 && fs.readFileSync(PC.arquivo('/app.js'), 'utf8') === 'var APP_BUILD = ' + A.n + ';' && pastas().join() === String(A.n));
    confere('B que não abriu não é baixada de novo', (await PC.baixaApp()).emDia === true && pastas().join() === String(A.n));
    const C = pacote(EMB + 3); F.ver = C; await PC.baixaApp(); PC.usa(); PC.pronto();
    const D = pacote(EMB + 4); F.ver = D; await PC.baixaApp(); PC.usa(); PC.pronto();
    confere('no máximo duas pastas: a atual e a anterior boa', pastas().join() === [C.n, D.n].join() && PC.estado().app === D.n);
    const X = pacote(EMB + 5, true); F.ver = X;
    confere('pacote sem o app dentro: não fica pronto', !(await PC.baixaApp()).pronta && pastas().join() === [C.n, D.n].join());
    F.ver = null;
    const i1 = await PC.buscaInstalador();
    confere('instalador: acha o mais novo, baixa inteiro e fica pronto', i1 === 'pronto' && PC.estado().n === EMB + 1 && PC.estado().est === 'pronto' && fs.statSync(PC.instalador()).size === exe.length && path.basename(PC.instalador()) === 'LaFouch-Setup-' + (EMB + 1) + '.exe');
    const antes = F.pedidos.length; const i2 = await PC.buscaInstalador();
    confere('instalador: já baixado não baixa de novo', i2 === 'pronto' && F.pedidos.slice(antes).filter((p) => p.indexOf('/dl/') === 0).length === 0);
    F.exeN = EMB; PC = novo();
    confere('instalador: o mesmo número do instalado = nada a fazer', await PC.buscaInstalador() === 'em dia' && PC.estado().est === '' && PC.instalador() === '');
    F.exeN = EMB + 2; F.exeUrl = 'http://outro-lugar.example/LaFouch-Setup-' + F.exeN + '.exe'; PC = novo();
    confere('instalador: endereço fora do repositório da loja é ignorado', await PC.buscaInstalador() === 'em dia' && PC.instalador() === '');
    F.exeUrl = ''; F.exeTam = exe.length + 9; PC = novo();
    const i5 = await PC.buscaInstalador();
    confere('instalador: arquivo cortado não fica pronto', i5 === 'erro' && PC.estado().est === 'erro' && PC.instalador() === '' && /tentar de novo/.test(PC.estado().msg));
    F.exeTam = exe.length; await PC.buscaInstalador();
    const falso = (m, h) => ({ method: m, headers: h || {} }); const resp = () => { const r = { c: 0, b: '', writeHead(c) { r.c = c; }, end(b) { r.b = b; } }; return r; };
    let abriu = '', a1 = resp(), a2 = resp(), a3 = resp(), a4 = resp(), a5 = resp();
    PC.atende(falso('GET'), a1, '/__pc/estado', false, () => {}); PC.atende(falso('GET'), a2, '/__pc/estado', true, () => {});
    PC.atende(falso('POST'), a3, '/__pc/instalar', true, (f) => { abriu = f; }); PC.atende(falso('POST', { 'x-lafouch': '1' }), a4, '/__pc/instalar', true, (f) => { abriu = f; });
    const a6 = resp(), a7 = resp(); PC.atende(falso('POST', { 'x-lafouch': '1' }), a6, '/__pronto', false, () => {}); PC.atende(falso('POST', { 'x-lafouch': '1' }), a7, '/__pronto', true, () => {});
    confere('o "pronto" só vale da própria janela', a6.c === 403 && a7.c === 200 && JSON.parse(a7.b).pc === true);
    confere('pedidos da tela: outra origem é recusada, sem o cabeçalho não instala, com ele abre o instalador certo', a1.c === 403 && a2.c === 200 && JSON.parse(a2.b).est === 'pronto' && a3.c === 405 && a4.c === 200 && abriu === PC.instalador() && PC.atende(falso('GET'), a5, '/index.html', true, () => {}) === false);
  } catch (e) { falhas.push('erro: ' + e.stack); }
  srv.close(); for (const d of [dados, tmp, OBRA]) fs.rmSync(d, { recursive: true, force: true });
  console.log(falhas.length ? '\nFALHARAM: ' + falhas.join(' | ') : '\ntudo ok (' + ok + ')');
  process.exit(falhas.length ? 1 : 0);
});
