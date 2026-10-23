  /* ===== Início: botões em "azulejo" (ícone em cima do nome) e barra de navegação de baixo ===== */
  var ICO_D = {
    vendas: '<path d="M6 6h15l-2 9H8zM6 6L5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
    estoque: '<path d="M3 8l9-5 9 5v9l-9 5-9-5zM3 8l9 5 9-5M12 13v9"/>',
    caixa: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 15h2"/>',
    fx: '<path d="M7 7h12l-3-3M17 17H5l3 3"/>',
    desp: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>',
    hist: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2"/>',
    hoje: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
    din: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9a2.5 2 0 0 0-5 .5c0 2.5 5 1.5 5 4a2.5 2 0 0 1-5 .5M12 6v2M12 16v2"/>',
    giro: '<path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"/>',
    prec: '<path d="M3 12l9-9h8v8l-9 9z"/><circle cx="16" cy="8" r="1.2"/>',
    cat: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
    ajustes: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2L10 21h4l.6-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"/>',
    inicio: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
    p_hoje: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
    p_semana: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    p_mes: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h2M12 14h2M16 14h2M8 18h2M12 18h2"/>',
    p_30: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    p_custom: '<path d="M12 5v14M5 12h14"/>',
    hero: '<path d="M3 17l5-5 4 4 8-9"/><path d="M15 7h5v5"/>'
  };
  function ico(k, px) {
    px = px || 22;
    return (
      '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICO_D[k] || '') +
      '</svg>'
    );
  }
  // Botão "azulejo": ícone em cima, nome embaixo, faixa opcional com um dado rápido.
  function tileHtml(attrs, k, nome, faixa, cls, on) {
    return (
      '<button type="button" class="tl' + (cls ? ' ' + cls : '') + (on ? ' on' : '') + '" ' + attrs + ' aria-pressed="' + !!on + '">' +
      '<span class="ti">' + ico(k, cls === 'sm' ? 20 : 24) + '</span><span class="tn">' + nome + '</span>' +
      (faixa ? '<span class="tp' + (faixa[1] ? ' ' + faixa[1] : '') + '">' + faixa[0] + '</span>' : '') +
      '</button>'
    );
  }
  function vendidoHoje() {
    var d0 = new Date();
    d0.setHours(0, 0, 0, 0);
    var t0 = d0.getTime(),
      n = 0,
      v = 0;
    S.sales.forEach(function (s) {
      if (!s.estorno && s.ts >= t0) {
        n++;
        v += s.price || 0;
      }
    });
    return { n: n, v: v };
  }
  ICO_D.novo = '<path d="M12 5v14M5 12h14"/><rect x="3" y="3" width="18" height="18" rx="4"/>';
  ICO_D.cont = '<path d="M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h9"/>';
  ICO_D.lotes = '<path d="M3 7l9-4 9 4-9 4zM3 12l9 4 9-4M3 17l9 4 9-4"/>';
  var INI_PADRAO = ['vendas', 'estoque', 'caixa', 'fx', 'desp', 'hist', 'hoje', 'din', 'giro', 'prec', 'cat', 'ajustes'];
  var INI_TODOS = INI_PADRAO.concat(['novo', 'cont', 'lotes']);
  function iniLista() {
    var l = Array.isArray(S.inicioT) ? S.inicioT : INI_PADRAO;
    return l.filter(function (id, i) {
      return INI_TODOS.indexOf(id) >= 0 && l.indexOf(id) === i;
    });
  }
  function iniDados() {
    var pecas = S.items.reduce(function (a, i) {
        return a + (i.qty > 0 ? i.qty : 0);
      }, 0),
      rep = 0,
      ct = S.cart ? S.cart.length : 0;
    try {
      rep = reposicao().length;
    } catch (e) {}
    return {
      vendas: ['Vendas', ct ? [ct + ' no carrinho', 'g'] : ['Carrinho vazio', '']],
      estoque: ['Inventário', [pecas + ' peças', rep ? 'w' : '']],
      caixa: ['Caixa', [gs(walletGs()), 'g']],
      fx: ['Câmbio', [gsRaw(Math.round(ratePyg('usd'))), '']],
      desp: ['Despesas', [gs(totalMensal()) + '/mês', 'w']],
      hist: ['Histórico', [S.sales.length + ' vendas', '']],
      hoje: ['Resumo', ['Painel', '']],
      din: ['Dinheiro', ['Reservas', 'g']],
      giro: ['Giro', [rep + ' a repor', rep ? 'w' : '']],
      prec: ['Preços', [(S.faixas || []).length + ' faixas', '']],
      cat: ['Catálogo', ['WhatsApp', '']],
      ajustes: ['Ajustes', ['Moeda ' + (MN[S.moedaP || 'pyg'] || 'G$'), '']],
      novo: ['Novo produto', ['Cadastrar', '']],
      cont: ['Contagem', ['Conferir estoque', '']],
      lotes: ['Lotes', ['Compras', '']]
    };
  }
  function renderInicio() {
    var el = $('v-inicio');
    if (!el || S.view !== 'inicio') return;
    var h = vendidoHoje(),
      D = iniDados(),
      L = iniLista(),
      ed = !!S.inicioEd;
    var grid = L.map(function (id, i) {
      var t = D[id];
      if (!ed) return tileHtml('data-act="inicio" data-id="' + id + '"', id, t[0], t[1], '', false);
      return (
        '<div class="twrap">' +
        tileHtml('disabled', id, t[0], t[1], '', false) +
        '<div class="tedit"><button type="button" data-act="inicioMv" data-id="' + id + '|-1" aria-label="Mover ' + t[0] + ' para trás"' + (i === 0 ? ' disabled' : '') + '>◀</button>' +
        '<button type="button" class="x" data-act="inicioRm" data-id="' + id + '" aria-label="Remover ' + t[0] + '">✕</button>' +
        '<button type="button" data-act="inicioMv" data-id="' + id + '|1" aria-label="Mover ' + t[0] + ' para frente"' + (i === L.length - 1 ? ' disabled' : '') + '>▶</button></div></div>'
      );
    }).join('');
    var livres = INI_TODOS.filter(function (id) {
      return L.indexOf(id) < 0;
    });
    var extra = '';
    if (ed && livres.length)
      extra =
        '<div class="lbl">Adicionar botão</div><div class="tgrid g4">' +
        livres
          .map(function (id) {
            return tileHtml('data-act="inicioAdd" data-id="' + id + '"', id, D[id][0], null, 'sm', false);
          })
          .join('') +
        '</div>';
    el.innerHTML =
      '<div class="hero" data-act="inicio" data-id="hoje" role="button" tabindex="0"><span class="hi">' + ico('hero', 26) + '</span><span><small>Vendido hoje · ' + h.n + ' venda(s)</small><b>' + gs(h.v) + '</b></span><span class="hg">›</span></div>' +
      '<div class="tgrid' + (ed ? ' editando' : '') + '">' + grid + '</div>' + extra +
      '<div class="sel" style="justify-content:center;gap:10px;flex-wrap:wrap">' +
      (ed
        ? '<button type="button" class="mini" data-act="inicioEd">Concluir</button><button type="button" class="chip" data-act="inicioReset">Restaurar padrão</button>'
        : '<button type="button" class="chip" data-act="inicioEd">✎ Personalizar botões</button>') +
      '</div>';
  }
  /* toque num azulejo da tela Início */
  function inicioGo(id) {
    if (id === 'hoje' || id === 'din' || id === 'giro' || id === 'prec') {
      S.dTab = id;
      setView('dash');
    } else if (id === 'cat') {
      setView('vendas');
    } else if (id === 'novo') {
      setView('estoque');
      $('btnAdd').click();
    } else if (id === 'cont') {
      setView('estoque');
      $('kCont').click();
    } else if (id === 'lotes') {
      S.lotesView = true;
      setView('estoque');
    } else setView(id);
  }
  /* barra de baixo: ícone em cima do nome */
  var NAVB = [
    ['inicio', 'Início'],
    ['vendas', 'Vendas'],
    ['estoque', 'Estoque'],
    ['caixa', 'Caixa'],
    ['ajustes', 'Ajustes']
  ];
  function iniSalvar(l) {
    S.inicioT = l;
    render();
  }
