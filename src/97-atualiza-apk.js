  // ===== S334 (15/11/2026, pedido do dono): a atualização do app cuida do APK também =====
  // Quando o dono manda gerar um APK, o build-apk.yml (com a chave FIXA) publica o arquivo LaFouch-<build>.apk na "release" apk do GitHub.
  // Aqui (só no APK que tem o plugin LfInstall): o app vê se esse APK é mais novo que o instalado (número EMB do index.html que veio
  // no APK), baixa para o cache (no Wi-Fi sozinho; nos dados móveis só quando o dono toca) e o cartão "Atualização do app" mostra
  // "Aplicativo novo pronto · Toque para instalar". Tocar abre o instalador do Android, que sempre pede a confirmação.
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
      try { lfaToast('<b>Aplicativo novo pronto</b><br>Ajustes › Atualização para instalar.', 4500); } catch (e) {}
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
  // manual = o dono tocou em "Buscar atualização"
  function apkBusca(manual) {
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
  // linha do APK dentro do cartão "Atualização do app" (vazio quando não há APK novo)
  function apkLinha() {
    if (!APK.est || !APK.n) return '';
    var mb = (APK.tam / 1048576).toFixed(0) + ' MB',
      tit = { tem: 'Aplicativo novo disponível', baixa: 'Baixando o aplicativo…', pronto: 'Aplicativo novo pronto', erro: 'Aplicativo novo disponível' }[APK.est],
      sub = { tem: 'Toque para baixar · ' + mb, baixa: mb + ' · pode continuar usando', pronto: 'Toque para instalar · o Android pede para confirmar', erro: 'Toque para baixar · ' + mb }[APK.est],
      ico = APK.est === 'baixa' ? '<span class="lfa-spin">↻</span>' : '⬇';
    return '<button type="button" class="bsolid new" data-act="apkgo"' + (APK.est === 'baixa' ? ' disabled' : '') + '><span class="bi">' + ico + '</span><span class="bt2"><b>' + tit + '</b><span>' + sub + '</span></span></button>' +
      (APK.msg ? '<div class="note n-info" role="status">' + esc(APK.msg) + '</div>' : '');
  }
  if (!/#test/.test(location.hash)) {
    setTimeout(function () { apkBusca(false); }, 60000);
    setInterval(function () { if (!document.hidden && Date.now() - APK.t > 4 * 3600 * 1000) apkBusca(false); }, 600000);
  } else window.__apk = { busca: apkBusca, estado: APK, linha: apkLinha };
