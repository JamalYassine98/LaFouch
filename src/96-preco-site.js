  // ===== Preço estável no site: a cotação usada nos preços do site fica travada (no mínimo 30 dias) =====
  S.siteFx = null; // { usd, rpu, brl, ts }: dólar da loja, real por dólar e dia em que foram travados
  var SITE_DIAS = 30,
    SITE_VAR = 0.02,
    SITE_ALTA = 0.03,
    SITE_ARRED = 1000; // v425: o site arredonda igual à loja (de 1.000 em 1.000, para cima)
  // Trava de novo só quando vale a pena: a cada 30 dias se o dólar andou 2% ou mais; antes disso, só se o dólar subir mais de 3% (protege a margem).
  function siteFxConfere(forca) {
    var v;
    try {
      v = { usd: fxUsdLoja(), rpu: fxBrlPorUsd() };
    } catch (e) {
      return false;
    }
    if (!(v.usd > 0) || !(v.rpu > 0)) return false;
    var L = S.siteFx,
      agora = Date.now(),
      muda = !L || !(L.usd > 0) || !!forca;
    if (!muda) {
      var idade = (agora - L.ts) / 864e5,
        dif = v.usd / L.usd - 1;
      muda = idade >= SITE_DIAS ? Math.abs(dif) >= SITE_VAR : dif > SITE_ALTA;
    }
    if (muda) {
      S.siteFx = { usd: v.usd, rpu: v.rpu, brl: Math.round(v.usd / v.rpu / 100) * 100, ts: agora };
      saveSoon();
    }
    return muda;
  }
  // Preço em guaranis da loja (cotação do dia) → preço do site (cotação travada), arredondado de 5.000 em 5.000.
  function sitePreco(gs) {
    if (!(gs > 0) || !S.siteFx || !(S.siteFx.usd > 0)) return gs;
    var vivo;
    try {
      vivo = fxUsdLoja();
    } catch (e) {
      return gs;
    }
    if (!(vivo > 0)) return gs;
    return Math.max(SITE_ARRED, Math.ceil(((gs / vivo) * S.siteFx.usd) / SITE_ARRED - 1e-9) * SITE_ARRED);
  }
  function siteFxDiasTxt() {
    var L = S.siteFx;
    if (!L) return '';
    var d = new Date(L.ts),
      prox = new Date(L.ts + SITE_DIAS * 864e5),
      f = function (x) {
        return ('0' + x.getDate()).slice(-2) + '/' + ('0' + (x.getMonth() + 1)).slice(-2);
      };
    return 'travada em ' + f(d) + ' · próxima revisão a partir de ' + f(prox);
  }
  function siteFxHtml() {
    siteFxConfere();
    var L = S.siteFx,
      vivo = fxUsdLoja(),
      dif = L && L.usd > 0 ? vivo / L.usd - 1 : 0;
    return (
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Cotação do site</h2><div class="hint" style="margin:2px 0 0">Para o site não mudar de preço toda hora, ele usa uma cotação travada por no mínimo ' + SITE_DIAS + ' dias. Ela só muda antes disso se o dólar subir mais de ' + pc(SITE_ALTA) + ', e depois de ' + SITE_DIAS + ' dias se tiver variado ' + pc(SITE_VAR) + ' ou mais. Os preços do site são arredondados de ' + SITE_ARRED.toLocaleString('pt-BR') + ' em ' + SITE_ARRED.toLocaleString('pt-BR') + ' guaranis. O balcão continua com a cotação do dia.</div></div>' +
      '<div class="kpis"><div class="kpi" style="background:var(--panel2)"><div class="lbl">US$ 1 no site</div><b>' + gsRaw(L ? L.usd : vivo) + '</b><div class="hint">' + (L ? esc(siteFxDiasTxt()) : '') + '</div></div>' +
      '<div class="kpi" style="background:var(--panel2)"><div class="lbl">Cotação de hoje</div><b>' + gsRaw(vivo) + '</b><div class="hint">' + (dif >= 0 ? '+' : '−') + pc(Math.abs(dif)) + ' em relação ao site</div></div></div>' +
      '<div><button type="button" class="mini ghost" data-act="sitefxagora">Atualizar preços do site agora</button></div></section>'
    );
  }
  ACT.sitefxagora = function () {
    siteFxConfere(true);
    try {
      vitConfere();
      nvCotacao();
    } catch (e) {}
    if (window.lfToast) lfToast('Preços do site atualizados');
    render();
  };
