  // ===== S334 (15/11/2026, pedido do dono): a atualização do app cuida do APK também =====
  // Quando o dono manda gerar um APK, o build-apk.yml (com a chave FIXA) publica o arquivo LaFouch-<build>.apk na "release" apk do GitHub.
  // Aqui (só no APK que tem o plugin LfInstall): o app vê se esse APK é mais novo que o instalado (número EMB do index.html que veio
  // no APK), baixa para o cache (no Wi-Fi sozinho; nos dados móveis só quando o dono toca) e o botão do cartão "Atualização do app" vira
  // "Atualização pronta · Toque para instalar" (S335: um botão só, como uma atualização qualquer). Tocar abre o instalador do Android, que sempre pede a confirmação.
  var APK_API = 'https://api.github.com/repos/JamalYassine98/LaFouch/releases/tags/apk';
  var APK = { emb: 0, n: 0, url: '', tam: 0, est: '', msg: '', t: 0, busy: false, avisou: 0 }; // est: '' · tem · baixa · pronto · erro
  function apkNat() {
    var C = window.Capacitor, P = C && C.isNativePlatform && C.isNativePlatform() && C.Plugins;
    return P && P.LfInstall && P.Filesystem && P.Filesystem.downloadFile ? P : null;
  }
  function apkCel() {
    var c = navigator.connection || {};
    return c.type === 'cellular' || c.saveData === true;
  }
  function apkNome() { return 'LaFouch-' + APK.n + '.apk'; }
  function apkPronto() {
    APK.est = 'pronto';
    APK.msg = '';
    if (APK.avisou !== APK.n) {
      APK.avisou = APK.n;
      try { lfToast('Atualização pronta · instale em Ajustes › Atualização', 'ok'); } catch (e) {}
    }
  }
  function apkBaixa() {
    var P = apkNat();
    if (!P || APK.est === 'baixa' || !APK.n) return Promise.resolve(APK.est);
    APK.est = 'baixa';
    APK.msg = '';
    updRender();
    var caminho = 'apk/' + apkNome();
    return P.Filesystem.rmdir({ path: 'apk', directory: 'CACHE', recursive: true }).catch(function () {})
      .then(function () { return P.Filesystem.downloadFile({ url: APK.url, path: caminho, directory: 'CACHE', recursive: true }); })
      .then(function () { return P.Filesystem.stat({ path: caminho, directory: 'CACHE' }); })
      .then(function (s) {
        // nunca oferece arquivo cortado
        if (!s || +s.size !== APK.tam) throw new Error('arquivo incompleto');
        apkPronto();
      })
      .catch(function (e) { APK.est = 'erro'; APK.msg = 'Não consegui baixar o aplicativo (' + ((e && e.message) || 'erro') + '). Toque para tentar de novo.'; })
      .then(function () { updRender(); return APK.est; });
  }
  // ----- S337: WINDOWS. O programa do PC (desktop/main.js + pc-atualiza.js) procura e baixa o instalador novo sozinho; a tela só
  // lê o estado (/__pc/estado) e usa o MESMO botão e os mesmos textos do celular. "Instalar" abre o instalador do Windows.
  var PCX = { on: false, loja: 0 };
  function pcPede(caminho, post) {
    return fetch('/__pc/' + caminho, post ? { method: 'POST', headers: { 'X-LaFouch': '1' }, cache: 'no-store' } : { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); });
  }
  function pcAplica(e) {
    if (!e || e.pc !== true) return;
    var antes = APK.est;
    PCX.on = true;
    PCX.loja = +e.loja || 0;
    APK.emb = +e.emb || 0; APK.n = +e.n || 0; APK.tam = +e.tam || 0;
    APK.est = APK.n ? String(e.est || '') : '';
    APK.msg = String(e.msg || '');
    if (APK.est === 'pronto' && antes !== 'pronto') apkPronto();
    updRender();
  }
  // lê o estado; enquanto está baixando (ou logo depois de pedir a busca) olha de novo a cada 3 s
  function pcOlha(k) {
    return pcPede('estado').then(function (e) {
      pcAplica(e);
      if (PCX.on && (APK.est === 'baixa' || k > 0)) setTimeout(function () { pcOlha((k || 0) - 1); }, 3000);
      return APK.est;
    }).catch(function () { return ''; });
  }
  // manual = o dono tocou em "Buscar atualização"
  function apkBusca(manual) {
    if (PCX.on) {
      APK.t = Date.now();
      return pcPede('buscar', true).then(function (e) { pcAplica(e); setTimeout(function () { pcOlha(5); }, 2500); return APK.est || 'em dia'; }).catch(function () { return 'erro'; });
    }
    var P = apkNat();
    if (!P || APK.busy || APK.est === 'baixa' || !navigator.onLine) return Promise.resolve('sem');
    APK.busy = true;
    APK.t = Date.now();
    return fetch('index.html', { cache: 'no-store' }).then(function (r) { return r.text(); })
      .then(function (t) {
        APK.emb = +((t.match(/var EMB=(\d+)/) || [])[1]) || 0;
        if (!APK.emb) throw new Error('sem número');
        return fetch(APK_API, { cache: 'no-store', headers: { Accept: 'application/vnd.github+json' } });
      })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (rel) {
        var a = ((rel && rel.assets) || []).map(function (x) { var m = /^LaFouch-(\d+)\.apk$/.exec(String(x.name || '')); return m && x.state !== 'starter' ? { n: +m[1], url: String(x.browser_download_url || ''), tam: +x.size || 0 } : null; })
          .filter(Boolean).sort(function (x, y) { return y.n - x.n; })[0];
        if (!a || a.n <= APK.emb || a.tam < 1000000 || a.url.indexOf('https://github.com/JamalYassine98/LaFouch/releases/download/') !== 0) {
          APK.est = ''; APK.n = 0;
          return P.Filesystem.rmdir({ path: 'apk', directory: 'CACHE', recursive: true }).catch(function () {}).then(function () { return 'em dia'; });
        }
        APK.n = a.n; APK.url = a.url; APK.tam = a.tam;
        return P.Filesystem.stat({ path: 'apk/' + apkNome(), directory: 'CACHE' }).then(function (s) { return +s.size === a.tam; }, function () { return false; }).then(function (ja) {
          if (ja) { apkPronto(); return 'pronto'; }
          if (apkCel() && !manual) { APK.est = 'tem'; return 'tem'; }
          APK.busy = false;
          return apkBaixa();
        });
      })
      .catch(function () { return 'erro'; })
      .then(function (r) { APK.busy = false; updRender(); return r; });
  }
  ACT.apkgo = function () {
    if (PCX.on) {
      if (APK.est === 'pronto') pcPede('instalar', true).catch(function () { APK.est = 'erro'; APK.msg = 'O instalador não abriu. Toque para baixar de novo.'; updRender(); });
      else if (APK.est === 'erro' || APK.est === 'tem') apkBusca(true);
      return;
    }
    var P = apkNat();
    if (!P) return;
    if (APK.est === 'pronto') {
      P.LfInstall.instalar({ nome: apkNome() }).catch(function (e) {
        APK.est = 'erro';
        APK.msg = 'O instalador não abriu (' + ((e && e.message) || 'erro') + '). Toque para baixar de novo.';
        updRender();
      });
    } else if (APK.est === 'tem' || APK.est === 'erro') apkBaixa();
  };
  // S335: o APK usa o MESMO botão do cartão "Atualização do app" (updCard); aqui fica só o aviso de erro, quando há
  function apkLinha() {
    return APK.n && APK.est && APK.msg ? '<div class="note n-info" role="status">' + esc(APK.msg) + '</div>' : '';
  }
  if (!/#test/.test(location.hash)) {
    setTimeout(function () { apkBusca(false); }, 60000);
    setInterval(function () { if (!document.hidden && Date.now() - APK.t > 4 * 3600 * 1000) apkBusca(false); }, 600000);
    // Windows: a janela do programa abre em 127.0.0.1; o programa procura sozinho, a tela só acompanha
    if (location.hostname === '127.0.0.1') { setTimeout(function () { pcOlha(0); }, 6000); setInterval(function () { if (PCX.on) pcOlha(0); }, 600000); }
  } else window.__apk = { busca: apkBusca, estado: APK, linha: apkLinha, pc: pcOlha, pcx: PCX };
