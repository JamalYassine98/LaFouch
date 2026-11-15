  // ===== S332 (15/11/2026, "opção A" aprovada pelo dono): a cópia do site do MODO LOJA também se atualiza sozinha, sem APK =====
  // O build grava www/loja/manifest.json (versão do site + lista de arquivos com tamanho e resumo). No aparelho (só no APK, que tem
  // o plugin Filesystem), o app compara com a cópia que veio no APK e com a última baixada; se o site mudou, baixa a cópia nova para
  // a pasta de dados do app (lojaupd/<versão>/), reescrevendo os caminhos "/loja/..." para essa pasta, e o modo loja passa a abrir
  // de lá. Continua funcionando sem internet. Arquivo binário que não mudou é copiado da cópia anterior (não gasta dados).
  // Segurança: nada é trocado antes de TUDO chegar inteiro; se a cópia baixada não der sinal de vida em 9 s, é marcada como ruim
  // e o modo loja volta para a cópia do APK. No navegador e no Windows (sem Filesystem) nada muda.
  var LJU = { busy: false, emb: 0, t: 0, msg: '' };
  function ljuFs() {
    var C = window.Capacitor;
    return C && C.isNativePlatform && C.isNativePlatform() && C.convertFileSrc && C.Plugins && C.Plugins.Filesystem ? C.Plugins.Filesystem : null;
  }
  function ljuMarca() { try { return JSON.parse(localStorage.getItem('lf_lju') || 'null') || {}; } catch (e) { return {}; } }
  function ljuGrava(m) { try { localStorage.setItem('lf_lju', JSON.stringify(m)); } catch (e) {} }
  // endereço da cópia baixada (vazio = usar a que veio no APK)
  function ljuSrc() {
    var m = ljuMarca();
    return m.ok && m.pre && +m.v > LJU.emb && ljuFs() ? m.pre + '/loja.html?loja=1&nosync' : '';
  }
  function ljuRuim() {
    var m = ljuMarca();
    ljuGrava({ ruim: +m.v || 0 });
  }
  function ljuB64(blob) {
    return new Promise(function (ok, no) {
      var r = new FileReader();
      r.onload = function () { ok(String(r.result).split(',')[1] || ''); };
      r.onerror = function () { no(new Error('leitura')); };
      r.readAsDataURL(blob);
    });
  }
  // apaga cópias antigas (nunca com o modo loja aberto: ele pode estar lendo fotos de lá)
  function ljuLimpa() {
    var FS = ljuFs(), m = ljuMarca();
    if (!FS || document.getElementById('mlWrap')) return Promise.resolve();
    return FS.readdir({ path: 'lojaupd', directory: 'DATA' }).then(function (r) {
      var ns = ((r && r.files) || []).map(function (f) { return String((f && f.name) || f); });
      return Promise.all(ns.filter(function (n) { return !(m.ok && n === String(m.v)); }).map(function (n) {
        return FS.rmdir({ path: 'lojaupd/' + n, directory: 'DATA', recursive: true }).catch(function () {});
      }));
    }).catch(function () {});
  }
  function ljuBusca() {
    var FS = ljuFs();
    if (LJU.busy || !FS || !navigator.onLine) return Promise.resolve('sem');
    LJU.busy = true;
    LJU.t = Date.now();
    var fim = function (r) { LJU.busy = false; LJU.msg = r; return r; };
    return ljuLimpa().then(function () { return fetch(UPD_URL + 'loja/manifest.json?t=' + Date.now(), { cache: 'no-store' }); })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (mf) {
        var at = ljuMarca(), v = +mf.v || 0, fs = Array.isArray(mf.files) ? mf.files : [];
        if (!v || !fs.length || fs.length > 400) throw new Error('manifesto');
        if (v <= LJU.emb || (at.ok && v <= +at.v) || v === +at.ruim) return 'em dia';
        var dir = 'lojaupd/' + v, pre = '', mapa = {}, antigo = at.ok && at.dir && at.files ? at : null, i = 0;
        var baixa = function (p, n, txt) {
          return fetch(UPD_URL + 'loja/' + p + '?v=' + v, { cache: 'no-store' }).then(function (r) {
            if (!r.ok) throw new Error('arquivo não veio');
            return txt ? r.text() : r.blob();
          }).then(function (d) {
            if (txt) {
              // nunca guarda arquivo cortado
              if (d.length < n * 0.5 || (p === 'loja.html' && d.indexOf('</html>') < 0)) throw new Error('arquivo incompleto');
              d = d.replace(/(["'(])\/loja\/(js|media|p|lfx)\//g, function (_, a, b) { return a + pre + '/' + b + '/'; });
              return FS.writeFile({ path: dir + '/' + p, data: d, directory: 'DATA', encoding: 'utf8', recursive: true });
            }
            if (d.size !== n) throw new Error('arquivo incompleto');
            return ljuB64(d).then(function (b) { return FS.writeFile({ path: dir + '/' + p, data: b, directory: 'DATA', recursive: true }); });
          });
        };
        var um = function () {
          if (i >= fs.length) return Promise.resolve();
          var f = fs[i++], p = String(f[0]), n = +f[1] || 0, h = String(f[2]), txt = /^(loja\.html|js\/[\w.\-]+\.js)$/.test(p);
          if (!/^[\w.\-\/]+$/.test(p) || p.indexOf('..') >= 0) throw new Error('caminho');
          mapa[p] = h;
          var passo = !txt && antigo && antigo.files[p] === h
            ? FS.copy({ from: antigo.dir + '/' + p, to: dir + '/' + p, directory: 'DATA', toDirectory: 'DATA' }).catch(function () { return baixa(p, n, txt); })
            : baixa(p, n, txt);
          return passo.then(um);
        };
        var pastas = {};
        fs.forEach(function (f) { var p = String(f[0]), k = p.lastIndexOf('/'); pastas[k > 0 ? p.slice(0, k) : ''] = 1; });
        return Promise.all(Object.keys(pastas).map(function (d) {
          return FS.mkdir({ path: dir + (d ? '/' + d : ''), directory: 'DATA', recursive: true }).catch(function () {});
        })).then(function () { return FS.getUri({ path: dir, directory: 'DATA' }); }).then(function (u) {
          pre = new URL(window.Capacitor.convertFileSrc(u.uri), location.href).pathname.replace(/\/$/, '');
          if (!/^\/[\w.\-\/]+$/.test(pre)) throw new Error('pasta');
          return um();
        }).then(function () {
          ljuGrava({ v: v, dir: dir, pre: pre, ok: 1, files: mapa, ts: Date.now() });
          return ljuLimpa().then(function () { return 'baixada ' + v; });
        }, function (e) {
          return FS.rmdir({ path: dir, directory: 'DATA', recursive: true }).catch(function () {}).then(function () { throw e; });
        });
      })
      .then(fim, function (e) { return fim('erro: ' + ((e && e.message) || e)); });
  }
  if (!/#test/.test(location.hash)) {
    setTimeout(function () { mlConfere().then(ljuBusca); }, 40000);
    setInterval(function () { if (!document.hidden && Date.now() - LJU.t > 4 * 3600 * 1000) ljuBusca(); }, 600000);
  } else window.__lju = { busca: ljuBusca, src: ljuSrc, marca: ljuMarca, estado: LJU, ruim: ljuRuim };
