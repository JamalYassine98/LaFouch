// Teste da atualização do Windows (desktop/pc-atualiza.js) com um "GitHub" de mentira. Rodar: node desktop/teste-pc.js
const http = require('http'), fs = require('fs'), os = require('os'), path = require('path');
const { criar } = require('./pc-atualiza');
const RAIZ = path.join(__dirname, '..', 'www');
const mfEmb = JSON.parse(fs.readFileSync(path.join(RAIZ, 'loja', 'manifest.json'), 'utf8'));
const EMB = +fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8').match(/var EMB=(\d+)/)[1];
const novoHtml = Buffer.concat([fs.readFileSync(path.join(RAIZ, 'loja', 'loja.html')), Buffer.from('<!--novo-->')]);
const exe = Buffer.alloc(6 * 1024 * 1024, 7);
const F = { v: mfEmb.v + 1, tamHtml: novoHtml.length, exeN: EMB + 1, exeTam: exe.length, exeUrl: '', pedidos: [] };
const srv = http.createServer((req, res) => {
  const u = req.url.split('?')[0]; F.pedidos.push(u);
  if (u === '/app/loja/manifest.json') { res.end(JSON.stringify({ v: F.v, files: mfEmb.files.map((f) => f[0] === 'loja.html' ? ['loja.html', F.tamHtml, 'hashnovo01'] : f) })); }
  else if (u === '/app/loja/loja.html') res.end(novoHtml);
  else if (u.indexOf('/app/loja/') === 0) res.end(fs.readFileSync(path.join(RAIZ, u.slice(5))));
  else if (u === '/api') res.end(JSON.stringify({ assets: [{ name: 'chave.enc', size: 2688, browser_download_url: F.base + '/dl/chave.enc' }, { name: 'LaFouch-524.apk', size: 18000000, browser_download_url: F.base + '/dl/LaFouch-524.apk' }, { name: 'LaFouch-Setup-' + F.exeN + '.exe', size: F.exeTam, browser_download_url: F.exeUrl || F.base + '/dl/LaFouch-Setup-' + F.exeN + '.exe' }] }));
  else if (/^\/dl\/LaFouch-Setup-\d+\.exe$/.test(u)) res.end(exe);
  else { res.writeHead(404); res.end(); }
});
let ok = 0, falhas = [];
const confere = (nome, c) => { if (c) ok++; else falhas.push(nome); console.log((c ? '  ok  ' : ' FALHA ') + nome); };
srv.listen(0, '127.0.0.1', async () => {
  F.base = 'http://127.0.0.1:' + srv.address().port;
  const dados = fs.mkdtempSync(path.join(os.tmpdir(), 'lfpc-')), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lfpc-tmp-'));
  const novo = () => criar({ raiz: RAIZ, dados: dados, tmp: tmp, urlApp: F.base + '/app/', urlApi: F.base + '/api', prefixo: F.base + '/dl/' });
  let PC = novo();
  try {
    confere('lê o número do instalador e do modo loja que vieram no instalador', PC.estado().emb === EMB && PC.E.lojaEmb === mfEmb.v && PC.estado().pc === true);
    confere('sem cópia baixada, /loja/ vem do instalador; caminho para fora é recusado', PC.arquivo('/loja/loja.html') === path.join(RAIZ, 'loja', 'loja.html') && PC.arquivo('/../segredo') === '' && PC.arquivo('/loja/../../x') === '');
    const r1 = await PC.buscaLoja(), bx = F.pedidos.filter((p) => p.indexOf('/app/loja/') === 0 && p !== '/app/loja/manifest.json');
    confere('modo loja: baixa só o arquivo que mudou e copia o resto do instalador', r1 === 'baixada ' + F.v && bx.length === 1 && bx[0] === '/app/loja/loja.html');
    const fl = PC.arquivo('/loja/loja.html');
    confere('modo loja: passa a servir a cópia nova (página nova, script e foto)', fl.indexOf(dados) === 0 && fs.readFileSync(fl).equals(novoHtml) && PC.arquivo('/loja/js/lf-site.js').indexOf(dados) === 0 && fs.statSync(PC.arquivo('/loja/' + mfEmb.files.find((f) => /\.jpg$/.test(f[0]))[0])).size > 0 && PC.arquivo('/app.js') === path.join(RAIZ, 'app.js'));
    confere('modo loja: segunda busca não baixa nada; depois de reabrir o programa continua na cópia nova', await PC.buscaLoja() === 'em dia' && novo().arquivo('/loja/loja.html').indexOf(dados) === 0 && novo().estado().loja === F.v);
    F.v += 1; F.tamHtml += 5;
    const r3 = await PC.buscaLoja();
    confere('modo loja: arquivo cortado não troca a cópia', /arquivo incompleto/.test(r3) && fs.readFileSync(PC.arquivo('/loja/loja.html')).equals(novoHtml) && PC.estado().loja === F.v - 1);
    F.v -= 1; F.tamHtml -= 5; PC.lojaRuim();
    confere('modo loja: cópia que não abriu é descartada e não é baixada de novo', PC.arquivo('/loja/loja.html') === path.join(RAIZ, 'loja', 'loja.html') && await PC.buscaLoja() === 'em dia' && PC.estado().loja === 0);
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
    confere('pedidos da tela: outra origem é recusada, sem o cabeçalho não instala, com ele abre o instalador certo', a1.c === 403 && a2.c === 200 && JSON.parse(a2.b).est === 'pronto' && a3.c === 405 && a4.c === 200 && abriu === PC.instalador() && PC.atende(falso('GET'), a5, '/index.html', true, () => {}) === false);
  } catch (e) { falhas.push('erro: ' + e.stack); }
  srv.close(); fs.rmSync(dados, { recursive: true, force: true }); fs.rmSync(tmp, { recursive: true, force: true });
  console.log(falhas.length ? '\nFALHARAM: ' + falhas.join(' | ') : '\ntudo ok (' + ok + ')');
  process.exit(falhas.length ? 1 : 0);
});
