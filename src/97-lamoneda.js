  // ===== Cotação da La Moneda · Sucursal Jebai (v425, aprovado 04/11/2026) =====
  // A casa de câmbio fica em frente à loja: a cotação da loja segue a dela, nas três contas:
  //  - dólar → guarani: o que a casa cobra pelo dólar (venda) — é o que a loja paga para repor;
  //  - real → dólar: a arbitragem da casa (venda); se a página não trouxer, venda do dólar ÷ compra do real;
  //  - real → guarani: o que a casa paga pelo real (compra) — só informativo (troco).
  // Proteção: só quando o dólar dispara (mais de 1% em 3 dias), no máximo +1% acima da casa.
  // O site da casa bloqueia servidores (erro 522), então quem busca é o CELULAR (CapacitorHttp nativo), a cada 30 min;
  // o resultado (S.lm) viaja pela sincronização para os outros aparelhos. Sem dado de hoje, vale a cotação antiga.
  S.lm = null; // {ts, usd:{c,v}, brl:{c,v}, arb:{c,v,calc}, hist:[[ts, usdC, usdV, brlC, brlV]]}
  var LM_URL = 'https://www.lamoneda.com.py/cotizaciones';
  function lmNum(s) {
    s = String(s || '').trim();
    if (/^\d{1,3}(\.\d{3})+$/.test(s)) return +s.replace(/\./g, '');
    if (/^\d+,\d+$/.test(s)) return +s.replace(',', '.');
    if (/^\d{1,3}(,\d{3})+$/.test(s)) return +s.replace(/,/g, '');
    var n = parseFloat(s);
    return isFinite(n) ? n : null;
  }
  // Lê a página (texto) e devolve os valores da Sucursal Jebai.
  function lmLer(html) {
    var t = String(html || '')
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' | ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&aacute;/g, 'á')
      .replace(/&oacute;/g, 'ó')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ');
    var lo = t.toLowerCase(),
      i = lo.indexOf('sucursal jebai');
    if (i < 0) return null;
    var fim = t.length;
    ['sucursal centro', 'caja auxiliar', 'casa matriz'].forEach(function (m) {
      var j = lo.indexOf(m, i + 10);
      if (j > 0 && j < fim) fim = j;
    });
    var segJ = t.slice(i, fim);
    var par = function (rx, ok, tudo) {
      var m,
        seg = tudo ? t : segJ,
        r = new RegExp(rx.source + '[^0-9]{0,80}?([\\d.,]+)[^0-9]{1,40}?([\\d.,]+)', 'gi');
      while ((m = r.exec(seg))) {
        var a = lmNum(m[m.length - 2]),
          b = lmNum(m[m.length - 1]);
        if (a && b && ok(a) && ok(b)) return { c: Math.min(a, b), v: Math.max(a, b) };
      }
      return null;
    };
    var usd = par(/(d[óo]lar(?!\s*\/)|\busd\b(?!\s*\/))/, function (x) {
        return x > 3000 && x < 20000;
      }),
      brl = par(/(\breal\b(?!\s*\/)|\bbrl\b(?!\s*\/))/, function (x) {
        return x > 400 && x < 4000;
      }),
      arb = par(/(usd\s*\/\s*brl|d[óo]lar\s*\/\s*real)/, function (x) {
        return x > 2 && x < 15;
      });
    if (!usd || !brl) return null;
    // a arbitragem pode aparecer só na Casa Matriz
    if (!arb)
      arb = par(/(usd\s*\/\s*brl|d[óo]lar\s*\/\s*real)/, function (x) {
        return x > 2 && x < 15;
      }, true);
    if (!arb) arb = { c: Math.round((usd.c / brl.v) * 1000) / 1000, v: Math.round((usd.v / brl.c) * 1000) / 1000, calc: true };
    return { usd: usd, brl: brl, arb: arb };
  }
  function lmGrava(c) {
    var agora = Date.now(),
      h = (S.lm && S.lm.hist) || [];
    if (!h.length || agora - h[h.length - 1][0] >= 55 * 60000) h.push([agora, c.usd.c, c.usd.v, c.brl.c, c.brl.v]);
    h = h.filter(function (x) {
      return agora - x[0] <= 200 * DAY;
    });
    S.lm = { ts: agora, usd: c.usd, brl: c.brl, arb: c.arb, hist: h, erro: '' };
    saveSoon();
  }
  function lmHttp() {
    var C = window.Capacitor;
    return C && C.isNativePlatform && C.isNativePlatform() && C.Plugins && C.Plugins.CapacitorHttp ? C.Plugins.CapacitorHttp : null;
  }
  // Busca no celular (o navegador não deixa ler outro site). Devolve uma Promise.
  function lmBusca(forca) {
    var H = lmHttp();
    if (!H) return Promise.resolve(false);
    if (!forca && S.lm && Date.now() - S.lm.ts < 25 * 60000) return Promise.resolve(false);
    return H.get({ url: LM_URL, headers: { 'Accept-Language': 'es-PY,es;q=0.9', Accept: 'text/html' } })
      .then(function (r) {
        var c = lmLer(r && r.data);
        if (!c) throw new Error('não li a sucursal Jebai');
        lmGrava(c);
        return true;
      })
      .catch(function (e) {
        if (S.lm) S.lm.erro = String((e && e.message) || e);
        return false;
      });
  }
  // Dado da casa vale até 24 horas (depois volta para a cotação antiga).
  function lmOk() {
    return !!(S.lm && S.lm.usd && S.lm.usd.v > 0 && Date.now() - S.lm.ts < 24 * 3600000);
  }
  // Proteção: o dólar da casa subiu mais de 1% em 3 dias -> até +1% acima da casa.
  function lmProtecao() {
    if (!lmOk()) return 0;
    var h = S.lm.hist || [],
      lim = Date.now() - 3 * DAY,
      min = S.lm.usd.v;
    h.forEach(function (x) {
      if (x[0] >= lim && x[2] > 0 && x[2] < min) min = x[2];
    });
    var sub = S.lm.usd.v / min - 1;
    return Math.max(0, Math.min(0.01, sub - 0.01));
  }
  // G$ por US$ da loja quando há dado da casa (de 10 em 10, para cima).
  function lmUsdLoja() {
    return Math.ceil((S.lm.usd.v * (1 + lmProtecao())) / 10 - 1e-9) * 10;
  }
  function lmBrlPorUsd() {
    return Math.ceil(S.lm.arb.v * 100 - 1e-9) / 100;
  }
  // a cada 30 min com o app aberto (e logo ao abrir)
  if (!/#test/.test(location.hash)) {
    setTimeout(function () {
      lmBusca(false).then(function (ok) {
        if (ok) render();
      });
    }, 3000);
    setInterval(function () {
      lmBusca(false).then(function (ok) {
        if (ok) render();
      });
    }, 30 * 60000);
  }
  // Cartão no Câmbio: as três contas da casa × loja.
  function lmCardHtml() {
    if (!S.lm || !S.lm.usd) {
      return (
        '<section class="card col"><b>La Moneda · Jebai</b><div class="hint" style="margin:0">' +
        (lmHttp() ? 'Buscando a cotação da casa…' : 'A cotação da casa é buscada pelo app do celular (o navegador não deixa ler o site dela). Enquanto isso vale a cotação de mercado.') +
        '</div></section>'
      );
    }
    var ok = lmOk(),
      d = new Date(S.lm.ts),
      hora = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2),
      dia = d.toDateString() === new Date().toDateString() ? 'hoje ' + hora : d.getDate() + '/' + (d.getMonth() + 1) + ' ' + hora,
      pr = lmProtecao(),
      exUsd = 10,
      g = gsDeUsd(exUsd),
      rs = Math.ceil(exUsd * fxBrlPorUsd() - 1e-9);
    return (
      '<section class="card col lmCard"><div class="lmHd"><b>La Moneda · Jebai</b><span class="hint" style="margin:0">' + dia + (ok ? '' : ' · antiga') + '</span></div>' +
      '<div class="lmG"><span class="lmT">conta</span><span class="lmT">casa</span><span class="lmT">loja</span>' +
      '<span>Dólar → guarani</span><span class="lmC">' + gsRaw(S.lm.usd.v) + '</span><b>' + gsRaw(fxUsdLoja()) + '</b>' +
      '<span>Real → dólar</span><span class="lmC">' + String(S.lm.arb.v.toFixed(2)).replace('.', ',') + '</span><b>' + String(fxBrlPorUsd().toFixed(2)).replace('.', ',') + '</b>' +
      '<span>Real → guarani (troco)</span><span class="lmC">' + gsRaw(S.lm.brl.c) + '</span><b>' + gsRaw(S.lm.brl.c) + '</b></div>' +
      (pr > 0 ? '<div class="hint" style="margin:0;color:var(--warn)">Dólar disparando: proteção de +' + (pr * 100).toFixed(1).replace('.', ',') + '% por uns dias</div>' : '') +
      '<div class="hint" style="margin:0">Preço final arredonda para cima: US$ ' + exUsd + ' = <b>' + gs(g) + '</b> · <b>R$ ' + rs + '</b> (loja e site)</div></section>'
    );
  }
