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
  // 65b · margens do atacado calculadas pelo Titan (nunca digitadas): margem = (1 + colchão do atacado) ÷ (10/11 − lucro alvo) − 1.
  // O atacado não paga as contas do mês (ficam com o varejo): só precisa dar lucro bom. Colchão do atacado = só a alta do fornecedor (começa em 3%).
  var TAB_ALVO = { opt: 0.25, ven: 0.2, a1: 0.15, a2: 0.13, a5: 0.11, a10: 0.1, fg: 0.25 };
  S.ataCalc = { c: 0.03, ts: 0 }; // colchão do atacado e quando o Titan calculou
  function ataAlvo(T) { return TAB_ALVO[T.id] != null ? TAB_ALVO[T.id] : 0.15; }
  function ataMargem(T) { var c = S.ataCalc && S.ataCalc.c >= 0 ? S.ataCalc.c : 0.03; return (1 + c) / (10 / 11 - ataAlvo(T)) - 1; }
  // a conta de uma peça de custo u (US$) numa tabela: preço, IVA, custo + colchão, frete, lucro (a mesma da janela e da lista)
  function ataConta(T, u) {
    var c = S.ataCalc && S.ataCalc.c >= 0 ? S.ataCalc.c : 0.03, fr = +T.frete || 0, p = u * (1 + ataMargem(T)) + fr, iva = p / 11;
    return { p: p, iva: iva, cc: u * (1 + c), fr: fr, lu: p - iva - u * (1 + c) - fr, c: c };
  }
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
      v = t.repUSD * fx * (1 + ataMargem(T)) + (T.frete || 0) * fx; // 65b: a margem do Titan já dá lucro (sem o "chão" do varejo)
    return { p: Math.min(up500(v), base), lim: false };
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
  // alvo (149dup): id da tabela que pediu a folha — ela vem destacada e a folha rola até ela
  // A folha de escolher a tabela (o caixa, 60-vendas): margens do Titan; editar saiu (65b — margem calculada, Preços › Atacado mostra a conta)
  function tabSheet(alvo) {
    var h = '<div style="padding:4px 2px"><h2 style="margin:0 0 4px;font-size:18px">Tabela de preço</h2><div class="hint" style="margin:0 0 8px">Margens calculadas pelo ' + LF_TITAN + ', sempre com lucro. Nunca acima do preço Público.</div>';
    tabLista().forEach(function (T) {
      h += '<button type="button" class="chip' + (T.id === (S.tabAtiva || 'pub') ? ' on' : '') + (T.id === alvo ? ' tabAlvo' : '') + '" data-act="tabpick" data-id="' + T.id + '" style="display:flex;width:100%;justify-content:space-between;margin-bottom:6px;min-height:46px"><span style="text-align:left">' + esc(T.nome) + '<small style="display:block;font-weight:400">' + esc(tabTxt(T)) + '</small></span><span>' + (T.pub ? '' : '+' + Math.round(ataMargem(T) * 100) + '%') + '</span></button>';
    });
    lfaAbre('tabSh', h + '</div>');
    if (alvo) setTimeout(function () { var e = document.querySelector('.tabAlvo'); if (e) try { e.scrollIntoView({ block: 'center' }); } catch (x) {} }, 60);
  }
  ACT.tabfecha = function () { lfaFecha('tabSh'); };
  ACT.tabpick = function (id) {
    S.tabAtiva = id;
    if (S.cart.length) tabAplicaCarrinho(id);
    saveSoon();
    lfaFecha('tabSh');
    render();
  };
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
