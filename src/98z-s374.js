  // ===== S374 (16/11/2026): esboços 50a–c, 57a/b, 58a/b =====
  // 58a: abrir/fechar uma conta em Despesas
  ACT.despAb = function (id) {
    S.despAb = S.despAb || {};
    S.despAb[id] = !S.despAb[id];
    render();
    if (S.despAb[id]) animEnter && animEnter($('ec-' + id));
  };

  // ===== S374 · esboços 49a/49b (aprovados 16/11 08:40): as 7 famílias =====
  // Barra: Início · Vender · Peças · Dinheiro · Ajustes. Início: Dashboard · Site · Clientes. Avisos = sino (Pendências).
  // Cada família é um grupo comum (dá para tirar/pôr telas e desfazer em "Gerenciar grupo"); entra UMA vez (S.fam7).
  var FAM7 = [
    { id: 'g:pecas', nome: 'Peças', ico: 'estoque', frase: 'Inventário, fornecedores, reposição, contagem e estúdio', itens: ['estoque', 'lotes', 'repo', 'cont', 'est'] },
    { id: 'g:din', nome: 'Dinheiro', ico: 'caixa', frase: 'Caixa, despesas e câmbio', itens: ['caixa', 'desp', 'fx'] },
    { id: 'g:site', nome: 'Site', ico: 'onl', frase: 'Pedidos, mensagens, analisador e temática', itens: ['ped', 'msg', 'anl', 'tem', 'mkt'] },
    { id: 'g:cli', nome: 'Clientes', ico: 'cli', frase: 'Clientes e atacado', itens: ['cli', 'ata'] }
  ];
  BARRA_NOME.vendas = 'Vender';
  if (!ICO_D.repo) ICO_D.repo = ICO_D.giro || ICO_D.lotes;
  BARRA_NOME.repo = 'Reposição';
  GRP_FRASE.lotes = 'Compras e lotes';
  GRP_FRASE.repo = 'O que comprar, com a lista do Giro';
  GRP_FRASE.caixa = 'O dinheiro da loja, por moeda';
  GRP_FRASE.desp = 'Contas do mês e imprevistos';
  GRP_FRASE.fx = 'Cotações e trocas';
  GRP_FRASE.ped = 'O que chegou pelo site';
  GRP_FRASE.anl = 'Visitas e avisos do site';
  GRP_FRASE.ata = 'Lojistas, lotes e tabela';
  function fam7Aplica() {
    if (S.fam7) return;
    S.fam7 = true;
    var tudo = [];
    FAM7.forEach(function (f) { tudo = tudo.concat(f.itens); });
    S.grupos = (S.grupos || []).filter(function (g) {
      return !FAM7.some(function (f) { return f.id === g.id; }) && !g.itens.some(function (x) { return tudo.indexOf(x) >= 0; });
    }).concat(FAM7.map(function (f) { return { id: f.id, nome: f.nome, ico: f.ico, frase: f.frase, fam: 1, itens: f.itens.slice() }; }));
    S.barra = ['vendas', 'g:pecas', 'g:din', 'ajustes'];
    S.inicioT = ['hoje', 'g:site', 'g:cli'];
  }
  var _iniLista374 = iniLista;
  iniLista = function () {
    var l = _iniLista374.apply(this, arguments);
    if (S.fam7) return l;
    fam7Aplica();
    _iniLista374.apply(this, arguments); // as entradas únicas antigas rodam aqui e podem devolver atalhos soltos
    var den = [];
    (S.grupos || []).forEach(function (g) { den = den.concat(g.itens); });
    S.inicioT = S.inicioT.filter(function (x) { return den.indexOf(x) < 0; });
    return _iniLista374.apply(this, arguments);
  };
  // Reposição: a aba do Inventário vira tela da família Peças
  var _inicioGo374 = inicioGo;
  inicioGo = function (id) {
    if (id === 'repo') {
      S.lotesView = false;
      S.cont = false;
      S.repoView = true;
      return setView('estoque');
    }
    if (id === 'estoque' && S.view !== 'estoque') S.repoView = false;
    return _inicioGo374.apply(this, arguments);
  };
  var _navOn374 = navOn;
  navOn = function (id) {
    if (id === 'repo') return S.view === 'estoque' && !!S.repoView && !S.lotesView;
    if (id === 'estoque' && S.view === 'estoque' && S.repoView && grpPlana().indexOf('repo') >= 0) return false;
    return _navOn374.apply(this, arguments);
  };

  // ===== S374 · Site como tela do app (esboço S242, aprovado 14/11 00:08) =====
  // A família Site abre uma tela própria: Pedidos, Mensagens, Avisos do site e Vitrine em cartões; o resto em linhas
  // que abrem a parte certa do painel dentro do app. Com o painel aberto, a barra marca Site (não Vender).
  if (!$('v-site')) {
    var _vs = document.createElement('div');
    _vs.id = 'v-site';
    _vs.className = 'view';
    _vs.hidden = true;
    var _vp = $('v-ped');
    if (_vp && _vp.parentNode) _vp.parentNode.insertBefore(_vs, _vp);
    else document.querySelector('.wrap') && document.querySelector('.wrap').appendChild(_vs);
  }
  if (!VIEWS.some(function (v) { return v[0] === 'site'; })) VIEWS.push(['site', 'Site']);
  BARRA_NOME.site = 'Site';
  GRP_FRASE.site = 'Pedidos, mensagens, avisos e vitrine';
  if (!ICO_D.site) ICO_D.site = ICO_D.onl;
  FAM7[2].itens.unshift('site');
  function siteNum(n, tit, sub, act, id) {
    return '<button type="button" class="stN" data-act="' + act + '" data-id="' + id + '"><small>' + tit + '</small><b>' + (n == null ? '—' : n) + '</b><span>' + esc(sub) + '</span></button>';
  }
  function siteLin(tit, val, act, id) {
    return '<button type="button" class="ataL stL" data-act="' + act + '" data-id="' + id + '"><span><b>' + esc(tit) + '</b></span>' + (val ? '<small class="stV">' + esc(val) + '</small>' : '') + '<i aria-hidden="true">›</i></button>';
  }
  function renderSite() {
    var el = $('v-site');
    if (!el || S.view !== 'site') return;
    var r = S.pnlRes || null,
      peds = (S.pedidos || []).filter(function (p) { return p.st !== 'ent' && p.st !== 'canc'; }),
      novos = pedNovos(),
      pub = Object.keys(S.site || {}).filter(function (k) { return S.site[k]; }).length,
      tem = pnlFaixa('tem')[0];
    el.innerHTML = '<div class="top"><div><h1>Site</h1><div class="crumb">A loja online por dentro do app.</div></div></div>' +
      '<div class="stG">' +
      siteNum(peds.length, 'Pedidos', novos ? novos + (novos === 1 ? ' novo para separar' : ' novos para separar') : 'nenhum novo', 'stAbre', 'ped') +
      siteNum(r ? r.msg : null, 'Mensagens', r ? (r.ata ? r.ata + ' de atacado' : 'nenhuma de atacado') : 'abra para atualizar', 'stAbre', 'msg') +
      siteNum(r ? r.av : null, 'Avisos do site', 'Analisador', 'stAbre', 'anl') +
      siteNum(pub, 'Vitrine', pub === 1 ? 'peça publicada' : 'peças publicadas', 'stAbre', 'prod') +
      '</div><div class="card stLs">' +
      siteLin('Destaque da semana', '', 'stAbre', 'vit') +
      siteLin('Temática', tem, 'stAbre', 'tem') +
      siteLin('Marketing', 'posts, vídeos e plano', 'stAbre', 'mkt') +
      siteLin('Ajustes do site', 'frete, PIX, idioma', 'stAbre', 'cfg') +
      siteLin('Abrir a loja como o cliente vê', '', 'stLoja', '') +
      '</div>';
  }
  var _render374 = render;
  render = function () {
    var r = _render374.apply(this, arguments);
    try { renderSite(); } catch (e) {}
    return r;
  };
  ACT.stAbre = function (id) {
    if (id === 'ped') return setView('ped');
    if (id === 'mkt') return mkAbre();
    onlPainel(id);
  };
  ACT.stLoja = function () {
    try { window.open('https://lafouch.com/', '_blank', 'noopener'); } catch (e) {}
  };
  // a família Site já existente ganha a tela Site na frente (uma vez)
  var _iniLista374b = iniLista;
  iniLista = function () {
    var l = _iniLista374b.apply(this, arguments);
    if (!S.fam7b) {
      S.fam7b = true;
      var g = grpGet('g:site');
      if (g && g.itens.indexOf('site') < 0) g.itens.unshift('site');
    }
    return l;
  };
  var _inicioGo374b = inicioGo;
  inicioGo = function (id) {
    if (id === 'site') return setView('site');
    return _inicioGo374b.apply(this, arguments);
  };
  var _navOn374b = navOn;
  navOn = function (id) {
    if (id === 'site') return S.view === 'site';
    if (id === 'g:site' && S.view === 'onl' && grpGet('g:site')) return true; // painel aberto = família Site
    if (id === 'vendas' && S.view === 'onl' && grpGet('g:site')) return false;
    return _navOn374b.apply(this, arguments);
  };
