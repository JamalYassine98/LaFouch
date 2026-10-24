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
