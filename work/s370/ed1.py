import re
p='src/95-barra-grupos.js'; s=open(p).read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt, (a[:60], s.count(a))
    s=s.replace(a,b)
# helpers: groups of the Início
rep("""  function grpAviso(g) {""","""  // S370 (esboço 44, aprovado 15/11/2026): grupos também entre os atalhos do Início (o id do grupo fica em S.inicioT)
  function grpIni() {
    return (Array.isArray(S.inicioT) ? S.inicioT : []).filter(function (id) { return !!grpGet(id); });
  }
  function grpNoIni(gid) {
    return grpIni().indexOf(gid) >= 0 && barraLista().indexOf(gid) < 0;
  }
  // telas que estão dentro de algum grupo do Início
  function grpIniItens() {
    var o = [];
    grpIni().forEach(function (id) { o = o.concat(grpGet(id).itens); });
    return o;
  }
  // o grupo da tela aberta (barra primeiro, depois Início)
  function grpAtivo() {
    if (S.view === 'inicio' || S.view === 'notif') return null;
    var g = null;
    barraLista().concat(grpIni()).forEach(function (id) {
      var x = grpGet(id);
      if (x && !g && navOn(id)) g = x;
    });
    return g;
  }
  function grpAviso(g) {""")
# render: tabs replaced by the arrow (esboço 41)
a=s.index("  function grpAbasRender() {"); b=s.index("  // Coloca o botão no lugar do grupo")
s=s[:a]+"""  // S370 (esboço 41, aprovado 15/11/2026): as abas do topo saem; o título da tela ganha a flecha (⌄) e abre a folha VER
  // com as telas do grupo e "Gerenciar grupo" (a mesma mecânica do Dashboard). O desenho do título é feito em grpTitulo().
  function grpAbasRender() {
    var el = $('grpTabs');
    if (!el) return;
    var g = grpAtivo();
    S._gAt = g ? g.id : null;
    if (g) g.itens.forEach(function (t) { if (navOn(t)) g.ult = t; });
    el.hidden = true;
    el.textContent = '';
  }
"""+s[b:]
# grpAdd: remove from Início list too
rep("""    S.barra = barraLista().filter(function (x) {
      return x !== id;
    });
    var eraAuto""","""    S.barra = barraLista().filter(function (x) {
      return x !== id;
    });
    if (Array.isArray(S.inicioT)) S.inicioT = S.inicioT.filter(function (x) { return x !== id; });
    var eraAuto""")
# grpTira / grpDesfaz for Início groups
rep("""  function grpTira(gid, id) {
    var g = grpGet(gid);
    if (!g) return;""","""  function grpTira(gid, id) {
    var g = grpGet(gid);
    if (!g) return;
    if (grpNoIni(gid)) {
      var L = iniLista().slice(),
        k = L.indexOf(gid);
      g.itens = g.itens.filter(function (x) { return x !== id; });
      if (g.itens.length < 2) {
        S.grupos = S.grupos.filter(function (x) { return x !== g; });
        L.splice.apply(L, [k, 1].concat(g.itens, [id]));
      } else L.splice(k + 1, 0, id);
      S.inicioT = L;
      return;
    }""")
rep("""  function grpDesfaz(gid) {
    var g = grpGet(gid);
    if (!g) return;""","""  function grpDesfaz(gid) {
    var g = grpGet(gid);
    if (!g) return;
    if (grpNoIni(gid)) {
      var L = iniLista().slice();
      L.splice.apply(L, [L.indexOf(gid), 1].concat(g.itens));
      S.grupos = S.grupos.filter(function (x) { return x !== g; });
      S.inicioT = L;
      return;
    }""")
# grpDesfazer: Início animation
rep("""  ACT.grpDesfazer = function () {
    var gb""","""  ACT.grpDesfazer = function () {
    if (grpNoIni(S._gg)) {
      var gt = document.querySelector('#v-inicio .tl[data-id="' + S._gg + '"]'),
        it = (grpGet(S._gg) || {}).itens || [],
        r0 = gt ? gt.getBoundingClientRect() : null;
      grpDesfaz(S._gg);
      ACT.grpFecha();
      if (S.view !== 'inicio') setView('inicio');
      render();
      grpIniAbre(it, r0);
      return;
    }
    var gb""")
open(p,'w').write(s)
