  // ===== Mais vistas e não vendidas (v445, aprovado 05/11/2026) =====
  // Quantas vezes cada peça foi aberta no site nos últimos 30 dias. A conta é da ANÁLISE do site (função "analise", com o login do dono):
  // o app só pede o resumo (S3, 20/11/2026 — a coleção vistas/, aberta, deixou de ser lida). O Marketing mostra as peças que
  // interessam mas não fecham — para destacar no Status ou pôr em oferta.
  S.vistas = {}; // ref -> aberturas em 30 dias
  S.vistasTs = 0;
  function vistasBusca() {
    if (!S.nuvem || !S.nuvem.rt || navigator.onLine === false) return Promise.resolve(0);
    return analiseResumo(30).then(
      function (j) {
        if (!j || !j.porPeca) return 0;
        S.vistas = j.porPeca;
        S.vistasTs = Date.now();
        saveSoon();
        return Object.keys(S.vistas).length;
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
