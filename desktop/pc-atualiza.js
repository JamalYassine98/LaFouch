// S337 (15/11/2026, pedido do dono): no Windows o app também se atualiza por inteiro, com o MESMO botão do celular.
// Este arquivo não depende do Electron (dá para testar com `node desktop/teste-pc.js`). O main.js liga as peças.
//  1) MODO LOJA: baixa a cópia nova do site (mesmo manifest.json do Android) para a pasta de dados do Windows e o servidor local
//     passa a servir /loja/ dela quando for mais nova que a do instalador. Arquivo igual ao do instalador é copiado, não baixado.
//  2) INSTALADOR: procura LaFouch-Setup-<build>.exe na release "apk" do GitHub; se for mais novo que o instalado (número EMB do
//     index.html), baixa para a pasta temporária e fica "pronto". A tela só manda "instalar": o endereço nunca vem da tela —
//     é sempre o arquivo do repositório da loja, conferido pelo tamanho.
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { pipeline } = require('stream/promises');

function criar(o) {
  const RAIZ = o.raiz, DADOS = o.dados, TMP = o.tmp;
  const URL_APP = o.urlApp || 'https://jamalyassine98.github.io/LaFouch/';
  const URL_API = o.urlApi || 'https://api.github.com/repos/JamalYassine98/LaFouch/releases/tags/apk';
  const PREFIXO = o.prefixo || 'https://github.com/JamalYassine98/LaFouch/releases/download/';
  const LJ = path.join(DADOS, 'lojaupd');
  const E = { emb: 0, n: 0, tam: 0, est: '', msg: '', loja: 0, lojaEmb: 0, ocupado: false, lojaOcupada: false };
  const leJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
  const busca = async (u) => { const r = await fetch(u, { cache: 'no-store', headers: { 'User-Agent': 'LaFouch-PC', Accept: 'application/vnd.github+json' } }); if (!r.ok) throw new Error('http ' + r.status); return r; };
  const baixa = async (u, destino, tam) => {
    const r = await busca(u);
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    await pipeline(Readable.fromWeb(r.body), fs.createWriteStream(destino + '.parte'));
    if (fs.statSync(destino + '.parte').size !== tam) { fs.rmSync(destino + '.parte', { force: true }); throw new Error('arquivo incompleto'); }
    fs.renameSync(destino + '.parte', destino);
  };
  try { E.emb = +((fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8').match(/var EMB=(\d+)/) || [])[1]) || 0; } catch (e) {}
  E.lojaEmb = +((leJson(path.join(RAIZ, 'loja', 'manifest.json')) || {}).v) || 0;
  const marca = () => leJson(path.join(LJ, 'atual.json')) || {};
  const lojaAtiva = () => { const m = marca(); return m.ok && +m.v > E.lojaEmb && fs.existsSync(path.join(LJ, String(m.v), 'loja.html')) ? path.join(LJ, String(m.v)) : ''; };
  E.loja = lojaAtiva() ? +marca().v : 0;

  // pasta de onde o servidor local deve servir um caminho (cópia baixada do modo loja ou o que veio no instalador)
  function arquivo(p) {
    if (p.indexOf('/loja/') === 0) {
      const d = lojaAtiva();
      if (d) { const f = path.normalize(path.join(d, p.slice(6))); if (f.startsWith(d) && fs.existsSync(f)) return f; }
    }
    const f = path.normalize(path.join(RAIZ, p));
    return f.startsWith(RAIZ) ? f : '';
  }

  async function buscaLoja() {
    if (E.lojaOcupada) return 'ocupado';
    E.lojaOcupada = true;
    try {
      const mf = await (await busca(URL_APP + 'loja/manifest.json?t=' + Date.now())).json();
      const v = +mf.v || 0, lista = Array.isArray(mf.files) ? mf.files : [], at = marca();
      if (!v || !lista.length || lista.length > 400) throw new Error('manifesto');
      if (v <= E.lojaEmb || (at.ok && v <= +at.v) || v === +at.ruim) return 'em dia';
      const dir = path.join(LJ, String(v)), emb = {}, velho = {};
      ((leJson(path.join(RAIZ, 'loja', 'manifest.json')) || {}).files || []).forEach((f) => { emb[f[0]] = f[2]; });
      const dv = lojaAtiva();
      if (dv) Object.assign(velho, at.files || {});
      fs.rmSync(dir, { recursive: true, force: true });
      const mapa = {};
      for (const f of lista) {
        const p = String(f[0]), n = +f[1] || 0, h = String(f[2]);
        if (!/^[\w.\-\/]+$/.test(p) || p.indexOf('..') >= 0) throw new Error('caminho');
        const destino = path.join(dir, p);
        fs.mkdirSync(path.dirname(destino), { recursive: true });
        mapa[p] = h;
        if (emb[p] === h && fs.existsSync(path.join(RAIZ, 'loja', p))) fs.copyFileSync(path.join(RAIZ, 'loja', p), destino);
        else if (dv && velho[p] === h && fs.existsSync(path.join(dv, p))) fs.copyFileSync(path.join(dv, p), destino);
        // a cópia do instalador pode não bater byte a byte (ex.: fim de linha trocado na montagem): nesse caso baixa
        if (!fs.existsSync(destino) || fs.statSync(destino).size !== n) await baixa(URL_APP + 'loja/' + p + '?v=' + v, destino, n);
        if (fs.statSync(destino).size !== n) throw new Error('arquivo incompleto');
      }
      fs.writeFileSync(path.join(LJ, 'atual.json'), JSON.stringify({ v: v, ok: 1, files: mapa }));
      E.loja = v;
      for (const d of fs.readdirSync(LJ)) if (d !== String(v) && d !== 'atual.json') fs.rmSync(path.join(LJ, d), { recursive: true, force: true });
      return 'baixada ' + v;
    } catch (e) { return 'erro: ' + ((e && e.message) || e); } finally { E.lojaOcupada = false; }
  }
  // a tela avisou que a cópia baixada não abriu: descarta e volta para a do instalador
  function lojaRuim() {
    const m = marca();
    try { fs.mkdirSync(LJ, { recursive: true }); fs.writeFileSync(path.join(LJ, 'atual.json'), JSON.stringify({ ruim: +m.v || 0 })); } catch (e) {}
    E.loja = 0;
  }

  const nomeExe = () => 'LaFouch-Setup-' + E.n + '.exe';
  const caminhoExe = () => path.join(TMP, nomeExe());
  async function buscaInstalador() {
    if (E.ocupado) return E.est || 'ocupado';
    E.ocupado = true;
    try {
      const rel = await (await busca(URL_API)).json();
      const a = ((rel && rel.assets) || []).map((x) => { const m = /^LaFouch-Setup-(\d+)\.exe$/.exec(String(x.name || '')); return m ? { n: +m[1], url: String(x.browser_download_url || ''), tam: +x.size || 0 } : null; })
        .filter(Boolean).sort((x, y) => y.n - x.n)[0];
      if (!a || a.n <= E.emb || a.tam < 5000000 || a.url.indexOf(PREFIXO) !== 0) { E.est = ''; E.n = 0; E.msg = ''; return 'em dia'; }
      E.n = a.n; E.tam = a.tam; E.msg = '';
      if (fs.existsSync(caminhoExe()) && fs.statSync(caminhoExe()).size === a.tam) { E.est = 'pronto'; return 'pronto'; }
      E.est = 'baixa';
      try { await baixa(a.url, caminhoExe(), a.tam); E.est = 'pronto'; }
      catch (e) { E.est = 'erro'; E.msg = 'Não consegui baixar a atualização (' + ((e && e.message) || 'erro') + '). Toque para tentar de novo.'; }
      return E.est;
    } catch (e) { return 'erro'; } finally { E.ocupado = false; }
  }
  // devolve o caminho do instalador pronto (ou '' se não há); quem abre é o main.js
  function instalador() { return E.est === 'pronto' && E.n && fs.existsSync(caminhoExe()) && fs.statSync(caminhoExe()).size === E.tam ? caminhoExe() : ''; }
  function estado() { return { pc: true, emb: E.emb, n: E.n, tam: E.tam, est: E.est, msg: E.msg, loja: E.loja }; }

  // pedidos da tela: /__pc/estado (GET) e /__pc/buscar, /__pc/instalar, /__pc/loja-ruim (POST). Só aceita a própria janela do app.
  function atende(req, res, p, origemOk, aoInstalar) {
    if (p.indexOf('/__pc/') !== 0) return false;
    const manda = (c, obj) => { res.writeHead(c, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
    if (!origemOk) { manda(403, { erro: 'origem' }); return true; }
    if (p === '/__pc/estado' && req.method === 'GET') manda(200, estado());
    else if (req.method !== 'POST' || req.headers['x-lafouch'] !== '1') manda(405, { erro: 'método' });
    else if (p === '/__pc/buscar') { buscaInstalador(); buscaLoja(); manda(200, estado()); }
    else if (p === '/__pc/loja-ruim') { lojaRuim(); manda(200, estado()); }
    else if (p === '/__pc/instalar') { const f = instalador(); if (f) { manda(200, { ok: true }); aoInstalar(f); } else manda(409, { erro: 'sem instalador' }); }
    else manda(404, { erro: 'não existe' });
    return true;
  }
  return { arquivo, buscaLoja, lojaRuim, buscaInstalador, instalador, estado, atende, E };
}
module.exports = { criar };
