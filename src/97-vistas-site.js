  // ===== Mais vistas e não vendidas (v445, aprovado 05/11/2026) =====
  // O site manda, ao fim de cada visita, quantas vezes cada peça foi aberta (vistas/<visita>). O app soma os últimos
  // 30 dias e o Marketing mostra as peças que interessam mas não fecham — para destacar no Status ou pôr em oferta.
  S.vistas = {}; // ref -> aberturas em 30 dias
  S.vistasTs = 0;
  function vistasBusca() {
    if (!S.nuvem || !S.nuvem.rt || navigator.onLine === false || typeof nvApi !== 'function') return Promise.resolve(0);
    var lim = Date.now() - 30 * DAY,
      soma = {},
      pag = function (tok, n) {
        return nvApi('GET', 'vistas?pageSize=300' + (tok ? '&pageToken=' + encodeURIComponent(tok) : '')).then(function (j) {
          (j.documents || []).forEach(function (d) {
            var f = d.fields || {},
              ts = +((f.ts || {}).integerValue || 0),
              r = ((f.r || {}).mapValue || {}).fields || {};
            if (ts < lim) return;
            Object.keys(r).forEach(function (k) {
              soma[k] = (soma[k] || 0) + Math.min(50, +(r[k].integerValue || 0));
            });
          });
          if (j.nextPageToken && n < 6) return pag(j.nextPageToken, n + 1);
        });
      };
    return pag('', 0).then(
      function () {
        S.vistas = soma;
        S.vistasTs = Date.now();
        saveSoon();
        return Object.keys(soma).length;
      },
      function () {
        return 0;
      }
    );
  }
  // peças com muita gente olhando e pouca venda (30 dias)
  function vistasNaoVendidas() {
    var lim = Date.now() - 30 * DAY,
      ven = {};
    (S.sales || []).forEach(function (s) {
      if (!s.estorno && s.ts >= lim) ven[s.ref] = (ven[s.ref] || 0) + s.qty;
    });
    return Object.keys(S.vistas || {})
      .filter(function (r) {
        var v = S.vistas[r];
        return v >= 5 && itemDoRef(r) && (ven[r] || 0) <= v * 0.05;
      })
      .map(function (r) {
        return { ref: r, v: S.vistas[r], q: ven[r] || 0 };
      })
      .sort(function (a, b) {
        return b.v - a.v;
      })
      .slice(0, 5);
  }
  if (!/#test/.test(location.hash)) {
    setTimeout(vistasBusca, 40000);
    setInterval(vistasBusca, 30 * 60000);
  }
