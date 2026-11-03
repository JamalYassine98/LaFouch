  // ===== Tabelas de preço (atacado e tipos de cliente): preço = custo + margem, nunca abaixo do piso, nunca acima do Público =====
  S.tabelas = [
    { id: 'opt', nome: 'Óptica', m: 0.7, min: 0, frete: 0, on: true },
    { id: 'ven', nome: 'Vendedor', m: 0.55, min: 0, frete: 0, on: true },
    { id: 'a1', nome: 'Atacado 1K', m: 0.4, min: 1000, frete: 0, on: true },
    { id: 'a2', nome: 'Atacado 2K', m: 0.32, min: 2000, frete: 0, on: true },
    { id: 'a5', nome: 'Atacado 5K', m: 0.25, min: 5000, frete: 0, on: true },
    { id: 'a10', nome: 'Atacado 10K', m: 0.18, min: 10000, frete: 0, on: true },
    { id: 'fg', nome: 'Óptica com frete grátis', m: 0.7, min: 0, frete: 0.6, on: true }
  ];
  S.tabAtiva = 'pub';
  function tabLista() {
    return [{ id: 'pub', nome: 'Público', m: 0, min: 0, frete: 0, on: true, pub: true }].concat(
      (S.tabelas || []).filter(function (t) {
        return t.on !== false;
      })
    );
  }
  function tabDe(id) {
    return (
      tabLista().filter(function (t) {
        return t.id === id;
      })[0] || tabLista()[0]
    );
  }
  // Preço de uma peça numa tabela. Sem custo conhecido, vale o preço Público.
  function precoTabInfo(it, id) {
    var base = tFor(it).price,
      T = tabDe(id || S.tabAtiva || 'pub');
    if (!T || T.pub || !(base > 0)) return { p: base, lim: false };
    var t = tFor(it);
    if (!(t.repUSD > 0)) return { p: base, lim: false };
    var fx = S.fx.pyg,
      pp = pisoPeca(it),
      v = t.repUSD * fx * (1 + T.m) + (T.frete || 0) * fx,
      chao = pp.trava + pp.colch,
      lim = false;
    if (v < chao) {
      v = chao;
      lim = true;
    }
    return { p: Math.min(up500(v), base), lim: lim };
  }
  function precoTab(it, id) {
    return precoTabInfo(it, id).p;
  }
  function tabTxt(T) {
    if (!T || T.pub) return 'Preço de balcão e do site';
    return (T.min > 0 ? 'Compras a partir de US$ ' + T.min.toLocaleString('pt-BR') : 'Sem mínimo') + (T.frete > 0 ? ' · frete grátis embutido' : '');
  }
  // Valor do carrinho numa tabela, em dólar.
  function cartUsdTab(id) {
    var fx = S.fx.pyg || 1;
    return (
      S.cart.reduce(function (a, l) {
        return a + precoTab(l.it, id) * l.qty;
      }, 0) / fx
    );
  }
  // Tabela melhor (preço menor) que o pedido já alcança.
  function tabSugestao() {
    if (!S.cart.length) return null;
    var cur = S.cart[0].tab || S.tabAtiva || 'pub',
      atual = S.cart.reduce(function (a, l) {
        return a + (l.preco != null ? l.preco : precoTab(l.it, cur) * l.qty);
      }, 0),
      melhor = null;
    tabLista().forEach(function (T) {
      if (T.pub || T.id === cur || !(T.min > 0)) return;
      var tot = S.cart.reduce(function (a, l) {
        return a + precoTab(l.it, T.id) * l.qty;
      }, 0);
      if (tot < atual && tot / S.fx.pyg >= T.min && (!melhor || tot < melhor.tot)) melhor = { T: T, tot: tot, eco: atual - tot };
    });
    return melhor;
  }
  function tabAplicaCarrinho(id) {
    S.tabAtiva = id;
    S.cart.forEach(function (l) {
      l.tab = id;
      l.preco = null;
    });
  }
  function tabSheet(edita) {
    var h = '<div style="padding:4px 2px"><h2 style="margin:0 0 4px;font-size:18px">Tabela de preço</h2><div class="hint" style="margin:0 0 8px">Cada tabela é custo da peça + margem. Nunca fica abaixo do piso da loja nem acima do preço Público.</div>';
    if (!edita) {
      tabLista().forEach(function (T) {
        h += '<button type="button" class="chip' + (T.id === (S.tabAtiva || 'pub') ? ' on' : '') + '" data-act="tabpick" data-id="' + T.id + '" style="display:flex;width:100%;justify-content:space-between;margin-bottom:6px;min-height:46px"><span style="text-align:left">' + esc(T.nome) + '<small style="display:block;font-weight:400">' + esc(tabTxt(T)) + '</small></span><span>' + (T.pub ? '' : '+' + Math.round(T.m * 100) + '%') + '</span></button>';
      });
      h += '<div style="display:flex;gap:8px;margin-top:8px"><button type="button" class="mini ghost" data-act="tabedit">Editar tabelas</button><button type="button" class="mini ghost" data-act="tabfecha">Fechar</button></div></div>';
    } else {
      S.tabelas.forEach(function (T, i) {
        h += '<div class="sl" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:8px"><b style="flex:1 1 100%">' + esc(T.nome) + '</b>' +
          '<label style="flex:1 1 90px;font-size:12px">Margem %<input class="in" inputmode="decimal" data-in="tabm" data-id="' + i + '" value="' + Math.round(T.m * 100) + '"></label>' +
          '<label style="flex:1 1 90px;font-size:12px">Mínimo US$<input class="in" inputmode="decimal" data-in="tabmin" data-id="' + i + '" value="' + (T.min || 0) + '"></label>' +
          '<label style="flex:1 1 90px;font-size:12px">Frete US$/peça<input class="in" inputmode="decimal" data-in="tabfr" data-id="' + i + '" value="' + (T.frete || 0) + '"></label>' +
          '<button type="button" class="chip' + (T.on !== false ? ' on' : '') + '" data-act="tabon" data-id="' + i + '">' + (T.on !== false ? 'Ativa' : 'Oculta') + '</button></div>';
      });
      h += '<div style="display:flex;gap:8px;margin-top:8px"><button type="button" class="go" data-act="tabok">Salvar</button></div></div>';
    }
    lfaAbre('tabSh', h);
  }
  ACT.tabsheet = function () { tabSheet(false); };
  ACT.tabfecha = function () { lfaFecha('tabSh'); };
  ACT.tabedit = function () { tabSheet(true); };
  ACT.tabok = function () { saveSoon(); tabSheet(false); render(); };
  ACT.tabon = function (i) {
    var T = S.tabelas[+i];
    if (!T) return;
    T.on = T.on === false;
    if (T.on === false && S.tabAtiva === T.id) S.tabAtiva = 'pub';
    tabSheet(true);
  };
  ACT.tabpick = function (id) {
    S.tabAtiva = id;
    if (S.cart.length) tabAplicaCarrinho(id);
    saveSoon();
    lfaFecha('tabSh');
    render();
  };
  document.addEventListener('input', function (ev) {
    var t = ev.target,
      k = t && t.getAttribute && t.getAttribute('data-in');
    if (k !== 'tabm' && k !== 'tabmin' && k !== 'tabfr') return;
    var T = S.tabelas[+t.getAttribute('data-id')],
      v = parseFloat(String(t.value).replace(',', '.'));
    if (!T || !(v >= 0)) return;
    if (k === 'tabm') T.m = Math.min(5, v / 100);
    else if (k === 'tabmin') T.min = v;
    else T.frete = v;
  });
  // Mensagem de WhatsApp com a tabela escolhida e as peças marcadas.
  function tabMensagem(refs) {
    var T = tabDe(S.tabAtiva),
      seen = {},
      linhas = [];
    S.items.forEach(function (i) {
      if (!(i.qty > 0) || seen[i.ref] || (refs.length && refs.indexOf(i.ref) < 0)) return;
      seen[i.ref] = 1;
      var p = precoTab(i, T.id);
      if (p > 0) linhas.push('• ' + pn(i.ref) + ' (' + i.ref + ') — ' + gs(p));
    });
    return 'Olá! Segue o catálogo La Fouch — ' + (T.pub ? 'preços de balcão' : 'tabela ' + T.nome) + ':\n\n' + linhas.join('\n') + '\n\nPara pedir, é só responder aqui. La Fouch · Ciudad del Este';
  }
  ACT.tabenviar = function () {
    var refs = S._vVis || [];
    window.open('https://wa.me/?text=' + encodeURIComponent(tabMensagem(refs)), '_blank');
  };
  window.__precoTab = precoTab;
  // Linha de tabela no pedido: tabela atual, cliente, sugestão de tabela melhor.
  function tabCartHtml() {
    var T = tabDe(S.cart[0] && S.cart[0].tab || S.tabAtiva),
      sg = tabSugestao(),
      cl = (S.clientes || []).filter(function (c) { return c.nome; }),
      h = '<div class="hint" style="margin:0;display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button type="button" class="chip on" data-act="tabsheet">Tabela: ' + esc(T.nome) + ' ▾</button>';
    if (cl.length)
      h += '<select class="in" data-in="tabcli" style="flex:1 1 140px;min-height:40px" aria-label="Cliente"><option value="">Cliente…</option>' + cl.map(function (c) { return '<option value="' + c.id + '"' + (String(S.cartCli) === String(c.id) ? ' selected' : '') + '>' + esc(c.nome) + (c.tab ? ' · ' + esc(tabDe(c.tab).nome) : '') + '</option>'; }).join('') + '</select>';
    if (T.frete > 0) h += '<small style="flex:1 1 100%">Frete grátis: o frete já está embutido no preço.</small>';
    if (sg) h += '<small style="flex:1 1 100%">Este pedido já alcança a tabela <b>' + esc(sg.T.nome) + '</b> e sai Gs. ' + sg.eco.toLocaleString('pt-BR') + ' mais barato. <button type="button" class="chip" data-act="tabpick" data-id="' + sg.T.id + '">Trocar</button></small>';
    return h + '</div>';
  }
  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (!t.getAttribute || t.getAttribute('data-in') !== 'tabcli') return;
    var c = (S.clientes || []).filter(function (x) { return String(x.id) === t.value; })[0];
    S.cartCli = c ? c.id : '';
    if (c && c.tab && tabDe(c.tab).id === c.tab) {
      tabAplicaCarrinho(c.tab);
      saveSoon();
    }
    render();
  });
