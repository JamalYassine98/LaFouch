p='src/95-barra-grupos.js'; s=open(p).read()
a="As telas aparecem como abas no topo."
assert s.count(a)==1; s=s.replace(a,"Para trocar de tela, toque no título (⌄).")
open(p,'w').write(s)
p='src/89-inicio.js'; s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:70],s.count(a)); s=s.replace(a,b)
rep("""      return INI_TODOS.indexOf(id) >= 0 && l.indexOf(id) === i;""","""      return (INI_TODOS.indexOf(id) >= 0 || !!grpGet(id)) && l.indexOf(id) === i;""")
rep("""      B = grpPlana(),
      L = iniLista().filter(function (id) {
        return B.indexOf(id) < 0;
      }),""","""      B = grpPlana().concat(grpIniItens()),
      L = iniLista().filter(function (id) {
        return B.indexOf(id) < 0;
      }),""")
rep("""    var grid = L.map(function (id, i) {
      var t = D[id];""","""    var grid = L.map(function (id, i) {
      var t = D[id];
      if (grpGet(id)) return grpTileHtml(grpGet(id), ed);""")
rep("""  /* toque num azulejo da tela Início */
  function inicioGo(id) {
    if (""","""  // S370 (esboço 44): azulejo de um grupo do Início — o ícone próprio do par, o nome do grupo e as telas embaixo
  function grpTileHtml(g, ed) {
    var par = g.itens.length >= 2 ? grpIcoPar(g.itens[0], g.itens[1], 24) : '',
      ic = par || g.itens.slice(0, 2).map(function (x) { return ico(x, 16); }).join(''),
      fx = g.itens.map(function (x) { return BARRA_NOME[x] || x; }).join(' · '),
      av = grpAviso(g);
    var h = '<button type="button" class="tl tlG" ' + (ed ? 'disabled' : 'data-act="inicio" data-id="' + g.id + '"') + ' aria-label="Grupo ' + esc(g.nome) + ': ' + esc(fx) + '">' +
      '<span class="ti' + (par ? '' : ' tiG') + '">' + ic + '</span><span class="tn">' + esc(g.nome) + '</span><span class="tp' + (av ? ' w' : '') + '">' + (av ? av + ' novos' : esc(fx)) + '</span></button>';
    if (!ed) return h;
    return '<div class="twrap" data-k="' + g.id + '">' + h + '<div class="tedit"><button type="button" class="x" data-act="grpGerir" data-id="' + g.id + '" aria-label="Gerenciar grupo ' + esc(g.nome) + '">⋯</button></div></div>';
  }
  /* toque num azulejo da tela Início */
  function inicioGo(id) {
    if (grpGet(id)) return grpAbre(grpGet(id));
    if (""")
open(p,'w').write(s)
