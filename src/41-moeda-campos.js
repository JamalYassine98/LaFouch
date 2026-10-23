  // ===== Campos de valor seguem a moeda principal (Ajustes). Os dados continuam guardados em G$ (ou US$ onde já era). =====
  // Moeda principal escolhida.
  function mp() {
    return S.moedaP === 'usd' || S.moedaP === 'brl' ? S.moedaP : 'pyg';
  }
  // Símbolo da moeda principal.
  function mpSim() {
    return { pyg: 'G$', usd: 'US$', brl: 'R$' }[mp()];
  }
  // Teclado: números inteiros em guarani, decimais nas outras.
  function mpMode() {
    return mp() === 'pyg' ? 'numeric' : 'decimal';
  }
  // Valor em guaranis -> texto do campo na moeda principal.
  function gsParaCampo(v) {
    var m = mp();
    return m === 'pyg' ? dots(v) : inVal(v / ratePyg(m), m);
  }
  // Texto digitado na moeda principal -> guaranis.
  function campoParaGs(txt) {
    var m = mp();
    return m === 'pyg' ? Math.round(toNum(txt)) : Math.round(parseDec(txt, m) * ratePyg(m));
  }
  // Valor em dólares -> texto do campo (meta, tolerância).
  function usdParaCampo(u) {
    var m = mp();
    if (m === 'usd') return u ? String(u).replace('.', ',') : '';
    return u ? gsParaCampo(u * S.fx.pyg) : '';
  }
  // Texto digitado -> dólares.
  function campoParaUsd(txt) {
    var m = mp();
    if (m === 'usd') return Math.max(0, parseDec(txt, 'usd'));
    return Math.max(0, campoParaGs(txt) / S.fx.pyg);
  }
  // Desconto em guaranis dentro de uma lista de preços (modo % ou valor na moeda principal).
  function descontoGs(lista) {
    var pct = S.descMode === 'pct',
      g = pct ? Math.round((lista * Math.min(100, parseDec(S.descTxt, 'usd'))) / 100) : campoParaGs(S.descTxt);
    return Math.max(0, Math.min(lista, g));
  }
  // <option>s de moeda com a principal já escolhida.
  function opcoesMoeda() {
    return [['pyg', 'G$'], ['usd', 'US$'], ['brl', 'R$']]
      .map(function (o) {
        return '<option value="' + o[0] + '"' + (o[0] === mp() ? ' selected' : '') + '>' + o[1] + '</option>';
      })
      .join('');
  }
