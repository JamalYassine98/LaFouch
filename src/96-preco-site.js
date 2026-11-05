  // ===== Preço estável no site: a cotação usada nos preços do site fica travada (no mínimo 30 dias) =====
  // v426 (aprovado 04/11): cotação do SITE = cotação da loja + 2% de folga, arredondada para cima de 100 em 100.
  // Fica travada enquanto a loja estiver abaixo dela (sem prazo). Se a loja passar (a folga acabou), trava de novo na hora.
  // Se o dólar cair muito, o site não baixa: o app faz ofertas no site (97-ofertas-site.js).
  S.siteFx = null; // { usd (site), base (loja na trava), rpu, brl, ts }
  var SITE_FOLGA = 0.02,
    SITE_ARRED = 1000; // preços do site arredondam de 1.000 em 1.000, para cima
  function siteFxConfere(forca) {
    var v;
    try {
      v = { usd: fxUsdLoja(), rpu: fxBrlPorUsd() };
    } catch (e) {
      return false;
    }
    if (!(v.usd > 0) || !(v.rpu > 0)) return false;
    var L = S.siteFx,
      subiu = !!(L && L.usd > 0 && v.usd > L.usd),
      muda = !L || !(L.usd > 0) || !!forca || subiu;
    if (muda) {
      var su = Math.ceil((v.usd * (1 + SITE_FOLGA)) / 100 - 1e-9) * 100;
      S.siteFx = { usd: su, base: v.usd, rpu: v.rpu, brl: Math.round(su / v.rpu / 100) * 100, ts: Date.now() };
      if (subiu && !forca) (S.notifs = S.notifs || []).unshift({ ts: Date.now(), lida: false, t: 'Preços do site atualizados', s: 'O dólar passou a folga do site: nova cotação do site ' + gsRaw(su) + '.' });
      saveSoon();
    }
    try {
      siteOfRevisa();
    } catch (e) {}
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
  // Conteúdo da janela "Preços no site" (aba Câmbio).
  function siteFxHtml() {
    siteFxConfere();
    var L = S.siteFx,
      vivo = fxUsdLoja(),
      folga = L && L.usd > 0 ? L.usd / vivo - 1 : 0,
      of = siteOfLista(),
      q = siteQueda();
    return (
      '<div class="fjB"><span class="lbl">US$ 1 no site</span><b class="fjBig">' + gsRaw(L ? L.usd : vivo) + '</b><div class="hint" style="margin:0">' + (L ? 'travada em ' + fd(L.ts) + ' · ' : '') + 'loja hoje ' + gsRaw(vivo) + (folga > 0 ? ' · folga de ' + pc(folga) : '') + '</div></div>' +
      '<div class="fjB"><div class="hint" style="margin:0">Só muda quando a cotação da loja passar a do site. Se o dólar cair muito (5% por 3 dias), o app faz ofertas em poucas peças, começando pelas mais paradas, no máximo 50% de desconto.</div></div>' +
      '<div class="fjB"><span class="lbl">Ofertas do site</span>' +
      (S.superEv && S.superEv.ate > Date.now()
        ? '<div>Super evento: <b>−' + Math.round(S.superEv.pct * 100) + '%</b> em tudo até ' + fd(S.superEv.ate) + '</div>'
        : of.length
          ? '<div class="hint" style="margin:0 0 6px">Dólar ' + (q > 0 ? pc(q) + ' abaixo da trava' : '') + ' · ' + of.length + ' peça(s) nesta semana</div>' + of.map(function (o) {
              return '<div class="sl"><span>' + esc(pn(o.ref)) + '<small>' + esc(o.mot) + '</small></span><b>−' + Math.round(o.pct * 100) + '%</b></div>';
            }).join('')
          : '<div class="hint" style="margin:0">Nenhuma oferta do dólar agora' + (q > 0.001 ? ' (dólar ' + pc(q) + ' abaixo da trava)' : '') + '.</div>') +
      '</div>' +
      '<div><button type="button" class="mini ghost" data-act="sitefxagora">Atualizar preços do site agora</button></div>'
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
