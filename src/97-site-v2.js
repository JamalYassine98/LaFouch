  // ===== Site novo (v451, aprovado 07/11/2026): dados extras que o site usa =====
  // ofAte: quando a oferta da peça acaba (data de fim da oferta ou fim do Super evento) — o site mostra a contagem regressiva.
  // mv: posição entre as mais vendidas dos últimos 30 dias (1 a 8; 0 = fora). Só a posição vai ao site, nunca quantidades.
  VIT_CAMPOS.push('ofAte', 'mv');
  var MV_CACHE = { ts: 0, r: {} };
  function siteMaisVendidas() {
    if (Date.now() - MV_CACHE.ts < 10 * 60000) return MV_CACHE.r;
    var lim = Date.now() - 30 * DAY,
      no = S.site || {},
      cont = {};
    (S.sales || []).forEach(function (s) {
      if (s.estorno || !s.ref || !no[s.ref] || s.ts < lim) return;
      cont[s.ref] = (cont[s.ref] || 0) + (+s.qty || 0);
    });
    var r = {};
    Object.keys(cont)
      .filter(function (ref) {
        return cont[ref] >= 2;
      })
      .sort(function (a, b) {
        return cont[b] - cont[a] || (a < b ? -1 : 1);
      })
      .slice(0, 8)
      .forEach(function (ref, i) {
        r[ref] = i + 1;
      });
    MV_CACHE = { ts: Date.now(), r: r };
    return r;
  }
  function siteOfAte(ref, o) {
    if (!(o.de > o.n)) return 0;
    if (superAtivo()) return S.superEv.ate;
    var pp = S.pprice && S.pprice[ref];
    return pp && pp.ant > 0 && pp.ate > Date.now() ? pp.ate : 0;
  }
  var _vitProdutoV1 = vitProduto;
  vitProduto = function (ref) {
    var o = _vitProdutoV1(ref);
    o.ofAte = siteOfAte(ref, o);
    o.mv = siteMaisVendidas()[ref] || 0;
    return o;
  };
