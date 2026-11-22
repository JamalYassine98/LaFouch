  // ===== Família INVENTÁRIO (a lista) — "implementar" do dono 22/11/2026 12:51 (esboços 52d, 52b, 52e e 58h) =====
  // Retrato do aprovado: work/s435/titan/inventario_aprovado.jpg · como fazer: work/s435/implementar/COMO-FAZER-INVENTARIO-52.md
  // Topo: título, o resumo "16 referências · US$ 420 a custo" embaixo e o + na linha do título; sem os números grandes.
  // Os números grandes (#kpisE) moram no index.html do aparelho (o APK só recebe app.js e style.css): saem daqui, uma vez.
  (function () {
    var k = $('kpisE');
    if (k) k.remove();
  })();
  // referências com peça em estoque e quanto elas custaram (custo × quantidade, em dólar)
  function invResumo() {
    var refs = {}, custo = 0;
    S.items.forEach(function (i) {
      if (!(i.qty > 0)) return;
      refs[i.ref] = 1;
      custo += (+i.custo || 0) * i.qty;
    });
    var n = Object.keys(refs).length;
    return n + (n === 1 ? ' referência' : ' referências') + ' · ' + usd0(custo) + ' a custo';
  }
  // ---------- 65b/65c (esboços 52d e 52b): depois das páginas, "Parados e sobrando ›" e "Contar o estoque ›" ----------
  // Parado = peça (sem estojos) com estoque e sem venda há 60+ dias. Uma definição só: esta lista, o "Parado 60+ dias"
  // do capital do estoque (src/57-financas.js) e a tela Parados e sobrando usam a mesma.
  function invParados() {
    var now = Date.now();
    return prodStats()
      .filter(function (m) {
        if (!(m.stock > 0) || isSimple(m.tipo)) return false;
        m.diasParado = (now - (m.last || S.appStart || now)) / DAY;
        return m.diasParado >= 60;
      })
      .sort(function (a, b) {
        return b.costUsd - a.costUsd;
      });
  }
  // linha "lugar" (regra 16: abre outra tela): título, frase, valor e ›
  function invLugar(act, tit, sub, val) {
    return '<button type="button" class="nvL" data-act="' + act + '"><span class="nvTx"><b>' + esc(tit) + '</b><small>' + esc(sub) + '</small></span>' +
      (val ? '<em>' + esc(val) + '</em>' : '') + '<i aria-hidden="true">›</i></button>';
  }
  // o fim da lista do Inventário (embaixo da legenda)
  function invFim(sec, mostra) {
    var f = $('invFim');
    if (!mostra) {
      if (f) f.remove();
      return;
    }
    if (!f) {
      f = mk('section', 'nvLista');
      f.id = 'invFim';
      f.setAttribute('aria-label', 'Estoque');
    }
    if (f.parentNode !== sec || f !== sec.lastElementChild) sec.appendChild(f);
    var ce = capitalEstoque(),
      v = contVelhos(),
      h =
        invLugar('invParSob', 'Parados e sobrando', ce.parado > 0 ? Math.round(ce.pct * 100) + '% do investido sem vender há 60+ dias' : 'Nada sem vender há 60+ dias', usd0(ce.parado)) +
        invLugar('contTroca', 'Contar o estoque', v ? v + ' dos mais valiosos sem conferir há 10+ dias' : 'Os mais valiosos estão conferidos');
    if (f._h !== h) {
      f.innerHTML = h;
      f._h = h;
    }
  }
  // ---------- a tela Parados e sobrando (52b, 3º quadro): "‹ INVENTÁRIO" volta pela pilha da navegação; sem título de tipo (como no aprovado) ----------
  if (!$('v-parsob')) {
    var _vp = document.createElement('div');
    _vp.id = 'v-parsob';
    _vp.className = 'view';
    _vp.hidden = true;
    var _ve = $('v-estoque');
    if (_ve && _ve.parentNode) _ve.parentNode.insertBefore(_vp, _ve.nextSibling);
  }
  if (!VIEWS.some(function (v) { return v[0] === 'parsob'; })) VIEWS.push(['parsob', 'Parados e sobrando']);
  ACT.invParSob = function () {
    setView('parsob');
  };
  function invParLinha(m) {
    return '<div class="sl lcL">' + lcThumb(m.ref) + '<span>' + lcNomeL(m) + '<small>' + m.stock + ' un. · ' + Math.round(m.diasParado) + ' dias sem venda</small></span>' +
      '<span class="lcV">' + usd0(m.costUsd) + lcOfBtn(m) + '</span></div>';
  }
  function renderParSob() {
    var el = $('v-parsob');
    if (!el || S.view !== 'parsob') return;
    var P = invParados(),
      L = lcLista(),
      vp = P.reduce(function (a, m) { return a + m.costUsd; }, 0),
      pg = paginas('parsob', P.length, pgSig(P.map(function (m) { return m.key; }))),
      pgS = paginas('parsob-sobra', L.sobra.length, pgSig(L.sobra.map(function (x) { return x.m.key + '|' + (x.grau || ''); }))),
      h = '<div class="top"><div><h1>Parados e sobrando</h1><div class="crumb">O que está sem vender ou acima do ideal</div></div></div>' +
        '<section class="lcLs psCard">' +
        '<div class="lcSec"><span>Parado 60+ dias · ' + P.length + '</span><b>' + usd0(vp) + '</b></div>' +
        (P.length ? '<div class="psPar split">' + P.slice(pg.de, pg.ate).map(invParLinha).join('') + '</div>' : '<p class="psVz">Nada sem vender há 60+ dias.</p>') +
        '<div class="lcSec"><span>Sobrando · ' + L.sobra.length + '</span>' + (L.sobra.length ? '<b>' + usd0(L.parado) + '</b>' : '') + '</div>' +
        (L.sobra.length ? '<div class="psSob split">' + L.sobra.slice(pgS.de, pgS.ate).map(lcSobraLinha).join('') + '</div>' : '<p class="psVz">Nada acima do ideal agora.</p>') +
        '</section>';
    if (el._h !== h) {
      el.innerHTML = h;
      el._h = h;
    }
    var lp = el.querySelector('.psPar');
    if (lp) paginador(pg, lp);
    var ls = el.querySelector('.psSob');
    if (ls) paginador(pgS, ls);
  }
  aposRender(renderParSob);
