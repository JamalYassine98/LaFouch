// S337 (15/11/2026, pedido do dono): no Windows o app também se atualiza por inteiro, com o MESMO botão do celular.
// Este arquivo não depende do Electron (dá para testar com `node desktop/teste-pc.js`). O main.js liga as peças.
//  1) APP AO VIVO (26/11, work/esboco/atualiza/COMO-FAZER-ATUALIZA-AO-VIVO.md): baixa o MESMO pacote do celular (www-<v>.zip,
//     conferido pela soma sha256 do version.json) para a pasta de dados do Windows (app/<v>/) e o servidor local passa a servir
//     o app INTEIRO (raiz e /loja/) da última versão boa. "Boa" = a tela disse "pronto" (POST /__pronto, appPronto() no fim do
//     primeiro desenho); sem o "pronto" em 10 s, volta para a anterior boa e recarrega. No máximo duas pastas (atual + anterior).
//     O endereço do pacote nunca vem da tela: o servidor lê o version.json do GitHub Pages e só aceita pacote de lá.
//  2) INSTALADOR: procura LaFouch-Setup-<build>.exe na release "apk" do GitHub; se for mais novo que o instalado (número do
//     version.json do instalador), baixa para a pasta temporária e fica "pronto". A tela só manda "instalar": o endereço nunca vem
//     da tela — é sempre o arquivo do repositório da loja, conferido pelo tamanho.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Readable } = require('stream');
const { pipeline } = require('stream/promises');
const ZIP = require('./zip');

function criar(o) {
  const RAIZ = o.raiz, DADOS = o.dados, TMP = o.tmp;
  const URL_APP = o.urlApp || 'https://jamalyassine98.github.io/LaFouch/';
  const URL_API = o.urlApi || 'https://api.github.com/repos/JamalYassine98/LaFouch/releases/tags/apk';
  const PREFIXO = o.prefixo || 'https://github.com/JamalYassine98/LaFouch/releases/download/';
  const AP = path.join(DADOS, 'app'), PRAZO = o.prazo || 10000, recarrega = o.recarrega || (() => {});
  const E = { emb: 0, n: 0, tam: 0, est: '', msg: '', ocupado: false, appOcupado: false };
  const leJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
  const busca = async (u) => { const r = await fetch(u, { cache: 'no-store', headers: { 'User-Agent': 'LaFouch-PC', Accept: 'application/vnd.github+json' } }); if (!r.ok) throw new Error('http ' + r.status); return r; };
  const baixa = async (u, destino, tam) => {
    const r = await busca(u);
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    await pipeline(Readable.fromWeb(r.body), fs.createWriteStream(destino + '.parte'));
    if (tam && fs.statSync(destino + '.parte').size !== tam) { fs.rmSync(destino + '.parte', { force: true }); throw new Error('arquivo incompleto'); }
    fs.renameSync(destino + '.parte', destino);
  };
  E.emb = +((leJson(path.join(RAIZ, 'version.json')) || {}).v) || 0; // a versão que veio no instalador

  // estado das versões baixadas: atual (a boa em uso), boas (atual + anterior), tenta (trocou e espera o "pronto"), pronta, ruim
  const EST = path.join(AP, 'estado.json');
  const est = () => Object.assign({ atual: 0, boas: [], tenta: 0, pronta: 0, ruim: 0 }, leJson(EST) || {});
  const grava = (e) => { fs.mkdirSync(AP, { recursive: true }); fs.writeFileSync(EST, JSON.stringify(e)); };
  const pasta = (v) => path.join(AP, String(v));
  const inteira = (v) => !!v && fs.existsSync(path.join(pasta(v), 'index.html')) && fs.existsSync(path.join(pasta(v), 'app.js'));
  // de qual pasta o servidor serve agora: a que está sendo testada, senão a boa mais nova, senão a do instalador
  function ativa() {
    const e = est();
    if (inteira(e.tenta)) return pasta(e.tenta);
    if (+e.atual > E.emb && inteira(e.atual)) return pasta(e.atual);
    return RAIZ;
  }
  function arquivo(p) {
    const base = ativa(), f = path.normalize(path.join(base, p));
    return f === base || f.startsWith(base + path.sep) ? f : '';
  }
  // baixa o pacote da versão nova (o mesmo do celular) e deixa pronto para trocar
  async function baixaApp() {
    if (E.appOcupado) return { pronta: 0, erro: 'ocupado' };
    E.appOcupado = true;
    try {
      const v = await (await busca(URL_APP + 'version.json?t=' + Date.now())).json();
      const n = +v.v || 0, e = est();
      if (!n || n <= Math.max(E.emb, +e.atual || 0) || n === +e.ruim) return { pronta: 0, emDia: true };
      if (inteira(n)) { e.pronta = n; grava(e); return { pronta: n }; }
      if (String(v.zip || '').indexOf(URL_APP) !== 0 || !/^[0-9a-f]{64}$/.test(String(v.soma || ''))) throw new Error('pacote sem endereço ou soma');
      const z = path.join(TMP, 'www-' + n + '.zip');
      await baixa(v.zip, z, 0);
      const s = crypto.createHash('sha256').update(fs.readFileSync(z)).digest('hex');
      if (s !== v.soma) { fs.rmSync(z, { force: true }); throw new Error('soma não bate'); } // pacote cortado ou trocado não instala
      const dp = pasta(n) + '.parte';
      fs.rmSync(dp, { recursive: true, force: true });
      ZIP.abre(z, dp);
      fs.rmSync(z, { force: true });
      if (!fs.existsSync(path.join(dp, 'index.html')) || !fs.existsSync(path.join(dp, 'app.js'))) { fs.rmSync(dp, { recursive: true, force: true }); throw new Error('pacote sem o app'); }
      fs.rmSync(pasta(n), { recursive: true, force: true });
      fs.renameSync(dp, pasta(n));
      const e2 = est(); e2.pronta = n; grava(e2);
      return { pronta: n };
    } catch (err) { return { pronta: 0, erro: (err && err.message) || String(err) }; } finally { E.appOcupado = false; }
  }
  // "Atualizar agora": passa a servir a pronta e espera o "pronto" da tela; sem ele no prazo, volta para a boa
  let relogio = null;
  function vigia() {
    clearTimeout(relogio);
    relogio = setTimeout(() => {
      const e = est();
      if (!e.tenta) return;
      e.ruim = e.tenta; e.tenta = 0; grava(e);
      fs.rmSync(pasta(e.ruim), { recursive: true, force: true });
      recarrega();
    }, PRAZO);
  }
  function usa() {
    const e = est();
    if (!inteira(e.pronta)) return false;
    e.tenta = e.pronta; e.pronta = 0; grava(e);
    vigia();
    return true;
  }
  function pronto() {
    clearTimeout(relogio);
    const e = est();
    if (!e.tenta) return est();
    e.atual = e.tenta; e.boas = [e.tenta].concat((e.boas || []).filter((x) => x !== e.tenta)).slice(0, 2); e.tenta = 0; grava(e);
    // limpeza: no máximo duas pastas (a atual e a anterior boa) — a do instalador fica sempre como a primeira de todas
    for (const d of fs.readdirSync(AP)) if (/^\d+(\.parte)?$/.test(d) && e.boas.indexOf(+d) < 0) fs.rmSync(path.join(AP, d), { recursive: true, force: true });
    return est();
  }
  // o programa abriu com uma troca sem "pronto" (fechou no meio): o prazo vale de novo
  if (est().tenta) vigia();

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
  function estado() { const e = est(); return { pc: true, emb: E.emb, n: E.n, tam: E.tam, est: E.est, msg: E.msg, app: +e.atual || 0, pronta: +e.pronta || 0, tenta: +e.tenta || 0 }; }

  // pedidos da tela: /__pc/estado (GET) e /__pc/buscar, /__pc/baixa, /__pc/usa, /__pronto, /__pc/instalar (POST). Só aceita a própria janela.
  function atende(req, res, p, origemOk, aoInstalar) {
    if (p.indexOf('/__pc/') !== 0 && p !== '/__pronto') return false;
    const manda = (c, obj) => { res.writeHead(c, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
    if (!origemOk) { manda(403, { erro: 'origem' }); return true; }
    if (p === '/__pc/estado' && req.method === 'GET') manda(200, estado());
    else if (req.method !== 'POST' || req.headers['x-lafouch'] !== '1') manda(405, { erro: 'método' });
    else if (p === '/__pc/buscar') { buscaInstalador(); manda(200, estado()); }
    else if (p === '/__pc/baixa') baixaApp().then((r) => manda(r.erro && !r.pronta ? 409 : 200, Object.assign(estado(), r)));
    else if (p === '/__pc/usa') { if (usa()) manda(200, estado()); else manda(409, { erro: 'sem pacote pronto' }); }
    else if (p === '/__pronto') { pronto(); manda(200, estado()); }
    else if (p === '/__pc/instalar') { const f = instalador(); if (f) { manda(200, { ok: true }); aoInstalar(f); } else manda(409, { erro: 'sem instalador' }); }
    else manda(404, { erro: 'não existe' });
    return true;
  }
  return { arquivo, ativa, baixaApp, usa, pronto, buscaInstalador, instalador, estado, atende, E };
}
module.exports = { criar };
