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
