  // ===== Campos de valor: guaranis por padrão; metas e tolerâncias em dólar. =====
  // Símbolo da moeda dos campos de valor.
  function mpSim() {
    return 'G$';
  }
  // Teclado dos campos de guarani.
  function mpMode() {
    return 'numeric';
  }
  // Valor em guaranis -> texto do campo.
  function gsParaCampo(v) {
    return dots(v);
  }
  // Texto digitado em guaranis -> guaranis.
  function campoParaGs(txt) {
    return Math.round(toNum(txt));
  }
  // Valor em dólares -> texto do campo (meta, tolerância).
  function usdParaCampo(u) {
    return u ? String(u).replace('.', ',') : '';
  }
  // Texto digitado -> dólares.
  function campoParaUsd(txt) {
    return Math.max(0, parseDec(txt, 'usd'));
  }
  // Desconto em guaranis dentro de uma lista de preços (modo % ou valor).
  function descontoGs(lista) {
    var pct = S.descMode === 'pct',
      g = pct ? Math.round((lista * Math.min(100, parseDec(S.descTxt, 'usd'))) / 100) : campoParaGs(S.descTxt);
    return Math.max(0, Math.min(lista, g));
  }
  // <option>s de moeda, guarani já escolhido.
  function opcoesMoeda() {
    return [['pyg', 'G$'], ['usd', 'US$'], ['brl', 'R$']]
      .map(function (o) {
        return '<option value="' + o[0] + '"' + (o[0] === 'pyg' ? ' selected' : '') + '>' + o[1] + '</option>';
      })
      .join('');
  }
  // Preços de produto: digitados em dólar; os guaranis saem da cotação da loja (de 500 em 500).
  function gsDeUsd(u) {
    var r = fxUsdLoja();
    // v425: preço final arredonda PARA CIMA de 1.000 em 1.000 (loja e site)
    return u > 0 && r > 0 ? Math.ceil((u * r) / 1000 - 1e-9) * 1000 : 0;
  }
  // Valor em guaranis -> texto do campo em dólar (até 2 casas, sem zeros sobrando).
  function usdTxtDeGs(g) {
    var r = fxUsdLoja();
    if (!(g > 0) || !(r > 0)) return '';
    return String(Math.round((g / r) * 100) / 100).replace('.', ',');
  }
