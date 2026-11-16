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
    { id: 'g:pecas', nome: 'Peças', ico: 'estoque', frase: 'Inventário e estúdio', itens: ['estoque', 'est'] }, // S374 (esboço 63): Fornecedores, Reposição e Contagem moram dentro do Inventário
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

  // bug do dono (16/11 10:05): soltar um arraste na folha do Dashboard não pode abrir a tela
  var _dVerEsc374 = ACT.dVerEsc;
  ACT.dVerEsc = function () {
    if (window.__barraSegurou && window.__barraSegurou()) return;
    return _dVerEsc374.apply(this, arguments);
  };

  // ===== S374 · esboço 59 (aprovado 16/11 10:04, "implementa" 10:40): Início com 6 botões =====
  // Resultados (dia, mês, histórico) · Giro e preços (giro, preços, reservas) · Site (site, pedidos, mensagens, analisador)
  // · Marketing (marketing, temática) · Clientes · Atacado. A barra não muda. Entra UMA vez (S.fam6).
  var FAM6 = [
    { id: 'g:res', nome: 'Resultados', ico: 'hoje', frase: 'Dia, mês e histórico', itens: ['hoje', 'hist'] },
    { id: 'g:gp', nome: 'Giro e preços', ico: 'giro', frase: 'Giro, preços e reservas', itens: ['giro', 'prec', 'din'] },
    { id: 'g:site', nome: 'Site', ico: 'onl', frase: 'Pedidos, mensagens e analisador', itens: ['site', 'ped', 'msg', 'anl'] },
    { id: 'g:mkt', nome: 'Marketing', ico: 'mkt', frase: 'Posts, vídeos e temática', itens: ['mkt', 'tem'] }
  ];
  GRP_FRASE.ata = 'Lojistas, lotes e tabela';
  function fam6Aplica() {
    if (S.fam6) return;
    S.fam6 = true;
    var ids = ['g:site', 'g:cli', 'g:res', 'g:gp', 'g:mkt'], tudo = [];
    FAM6.forEach(function (f) { tudo = tudo.concat(f.itens); });
    S.grupos = (S.grupos || []).filter(function (g) {
      return ids.indexOf(g.id) < 0 && !g.itens.some(function (x) { return tudo.indexOf(x) >= 0; });
    }).concat(FAM6.map(function (f) { return { id: f.id, nome: f.nome, ico: f.ico, frase: f.frase, fam: 1, itens: f.itens.slice() }; }));
    // o que estava na barra e agora mora numa família do Início sai da barra (a barra das famílias não muda)
    if (Array.isArray(S.barra)) S.barra = S.barra.filter(function (x) { return tudo.indexOf(x) < 0 && ids.indexOf(x) < 0; });
    S.inicioT = ['g:res', 'g:gp', 'g:site', 'g:mkt', 'cli', 'ata'];
  }
  var _iniLista59 = iniLista;
  iniLista = function () {
    var l = _iniLista59.apply(this, arguments);
    if (S.fam6 || !S.fam7) return l;
    fam6Aplica();
    return _iniLista59.apply(this, arguments);
  };
  // Marketing e Temática abrem em janela: o botão da família abre a lista para escolher
  var _grpAbre59 = grpAbre;
  grpAbre = function (g) {
    if (g && g.id === 'g:mkt' && g.fam) {
      S._gAt = g.id;
      return ACT.grpVer();
    }
    return _grpAbre59.apply(this, arguments);
  };
  // no Dashboard, a flecha de uma família (Resultados, Giro e preços) mostra as telas da família
  var _dVer59 = ACT.dVer;
  ACT.dVer = function () {
    var g = grpGet(S._gAt);
    if (g && g.fam) return lfaAbre('dFolha', grpVerHtml(g));
    return _dVer59.apply(this, arguments);
  };

  // ===== S374 · esboços 64–66 (aprovados 16/11 13:22, "implementar"): Preços de luxo + abrir como na Apple =====
  var EZ74 = 'cubic-bezier(.45,0,.2,1)';
  // abre/fecha um bloco (a altura cresce suave, o conteúdo já aparece e sobe 6 px, a seta gira). Menos movimento: direto.
  function lfFoldAnim(caixa, interno, seta, abre, fim) {
    if (REDUCED || !caixa || !caixa.animate) { if (fim) fim(); return; }
    var h = (interno || caixa).scrollHeight, d = abre ? 420 : 280;
    caixa.style.overflow = 'hidden';
    var a = caixa.animate([{ height: (abre ? 0 : h) + 'px' }, { height: (abre ? h : 0) + 'px' }], { duration: d, easing: EZ74 });
    if (interno) interno.animate([{ opacity: abre ? 0.35 : 1, transform: 'translateY(' + (abre ? -6 : 0) + 'px)' }, { opacity: abre ? 1 : 0, transform: 'translateY(' + (abre ? 0 : -4) + 'px)' }], { duration: abre ? d : 240, easing: EZ74, fill: 'both' });
    if (seta) seta.animate([{ transform: 'rotate(' + (abre ? 0 : 180) + 'deg)' }, { transform: 'rotate(' + (abre ? 180 : 0) + 'deg)' }], { duration: d, easing: EZ74 });
    a.onfinish = function () { caixa.style.overflow = ''; if (fim) fim(); };
  }
  function lfRedesenha() {
    if (S.view === 'dash') renderDash();
    else render();
  }
  ACT.dfold = function (id) {
    S.dfold = S.dfold || {};
    var sec = document.querySelector('section.fxF[data-fx="' + id + '"]');
    if (S.dfold[id]) {
      // fechar: anima primeiro e depois redesenha fechado
      var b0 = sec && sec.querySelector('.fxB');
      if (!b0) { S.dfold[id] = false; return lfRedesenha(); }
      if (sec._fechando) return;
      sec._fechando = 1;
      sec.classList.remove('on');
      lfFoldAnim(b0, b0.firstElementChild, sec.querySelector('.fxC'), false, function () { S.dfold[id] = false; lfRedesenha(); });
      return;
    }
    S.dfold[id] = true;
    lfRedesenha();
    var s2 = document.querySelector('section.fxF[data-fx="' + id + '"]'), b = s2 && s2.querySelector('.fxB');
    if (b) lfFoldAnim(b, b.firstElementChild, s2.querySelector('.fxC'), true);
  };
  // Despesas (58a): a conta cresce no lugar
  var _despAb74 = ACT.despAb;
  ACT.despAb = function (id) {
    var c = $('ec-' + id), h0 = c ? c.offsetHeight : 0, ab = !(S.despAb && S.despAb[id]);
    if (!ab && c && !REDUCED && c.animate) {
      var ro = c.querySelector('.ecRow'), h1 = ro ? ro.offsetHeight + 12 : 60;
      c.style.overflow = 'hidden';
      var ch = c.querySelector('.ecCh');
      if (ch) ch.animate([{ transform: 'rotate(180deg)' }, { transform: 'rotate(0)' }], { duration: 280, easing: EZ74 });
      c.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 280, easing: EZ74 }).onfinish = function () { _despAb74(id); };
      return;
    }
    _despAb74(id);
    var c2 = $('ec-' + id);
    if (ab && c2 && !REDUCED && c2.animate) {
      var h2 = c2.offsetHeight;
      c2.style.overflow = 'hidden';
      c2.animate([{ height: h0 + 'px' }, { height: h2 + 'px' }], { duration: 420, easing: EZ74 }).onfinish = function () { c2.style.overflow = ''; };
      var ch2 = c2.querySelector('.ecCh');
      if (ch2) ch2.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(180deg)' }], { duration: 420, easing: EZ74 });
    }
  };
  // Contador (66): os preços a corrigir numa linha só, que abre a lista ali mesmo; pré-graduados como linha (64)
  var _cnt74 = contadorHtml;
  contadorHtml = function () {
    var html = _cnt74.apply(this, arguments);
    try {
      var w = document.createElement('div');
      w.innerHTML = html;
      var D = w.querySelector('.cntD');
      if (!D) return html;
      // "Subir N preços" (e cada peça dele) já está dentro dos preços a corrigir
      [].forEach.call(D.querySelectorAll('.c52G'), function (g) {
        var b = g.querySelector('b'), bt = g.querySelector('[data-act="c52Ver"]');
        if (b && /^Subir /.test(b.textContent) && bt) {
          [].forEach.call(D.querySelectorAll('.c52P' + bt.getAttribute('data-id')), function (l) { l.remove(); });
          g.remove();
        }
      });
      [].forEach.call(D.querySelectorAll('.cntL'), function (l) {
        var b = l.querySelector('b');
        if (b && /^Subir /.test(b.textContent) && !l.classList.contains('c52G')) l.remove();
      });
      // o botão "Aceitar os N preços" só fica se ainda houver ofertas/voltas para aceitar
      var resto = [].filter.call(D.querySelectorAll('.cntL [data-act="cntAceita"]'), function () { return true; }).length,
        ac = D.querySelector('[data-act="cntTudo"]');
      if (ac) {
        if (!resto) (ac.closest('.cntB') || ac).remove();
        else ac.textContent = resto === 1 ? 'Aceitar o preço' : 'Aceitar os ' + resto + ' preços';
      }
      var L = typeof invPrecosAcorrigir === 'function' ? invPrecosAcorrigir() : [],
        nS = L.filter(function (x) { return x.pb && x.pb.sug > 0; }).length,
        lb = D.querySelector('.lbl'), ab = !!S.x66ab, ext = '';
      if (L.length) {
        var semC = L.filter(function (x) { return x.pb && x.pb.k === 'c'; }).length;
        ext += '<div class="cntL x66L' + (ab ? ' on66' : '') + '" role="button" tabindex="0" data-act="x66" aria-expanded="' + ab + '"><span class="cntI" aria-hidden="true">!</span><div><b>' + L.length + (L.length === 1 ? ' preço para corrigir' : ' preços para corrigir') + '</b><small>' +
          [nS ? nS + ' com sugestão do contador' : '', L.length - nS ? (L.length - nS) + (semC === L.length - nS ? ' sem custo' : ' sem sugestão') : ''].filter(Boolean).join(' · ') + '</small></div><i class="ch66" aria-hidden="true">⌄</i></div>';
        if (ab && typeof pcCorpo === 'function') ext += '<div class="x66"><div class="x66i"><div class="pcNaTela">' + pcCorpo(true) + '</div></div></div>';
      }
      var pp = typeof pgrPrecos === 'function' ? pgrPrecos() : null;
      var tpl = '<div class="cntL"><span class="cntI" aria-hidden="true"></span><div><b>Pré-graduados · preço por linha</b><small>Econômica ' + (pp ? gs(pp.e) : '') + ' · Luxo ' + (pp ? gs(pp.l) : '') + ' · o contador confere a margem</small></div><button type="button" class="cntV r" data-act="pgrAjusta">ajustar</button></div>';
      if (lb) lb.insertAdjacentHTML('afterend', ext);
      var fim = D.querySelector('.cntB');
      if (pp) { if (fim) fim.insertAdjacentHTML('beforebegin', tpl); else D.insertAdjacentHTML('beforeend', tpl); }
      var n = [].filter.call(D.querySelectorAll('.cntL'), function (l) { return !l.classList.contains('c52Oc') && !l.closest('.x66'); }).length;
      if (lb) lb.textContent = lb.textContent.replace(/· \d+/, '· ' + n);
      // o número "Preços para corrigir" do Contador abre a mesma lista
      [].forEach.call(w.querySelectorAll('.cntK[data-act="pcAbre"]'), function (k) { k.setAttribute('data-act', 'x66'); });
      return w.innerHTML;
    } catch (e) {
      return html;
    }
  };
  ACT.x66 = function () {
    var x = document.querySelector('#v-dash .x66'), l = document.querySelector('#v-dash .x66L');
    if (S.x66ab && x) {
      if (l) l.classList.remove('on66');
      return lfFoldAnim(x, x.firstElementChild, l && l.querySelector('.ch66'), false, function () { S.x66ab = false; lfRedesenha(); });
    }
    S.x66ab = true;
    if (S.view !== 'dash' || S.dTab !== 'prec') { S.dTab = 'prec'; return setView('dash'); }
    lfRedesenha();
    var x2 = document.querySelector('#v-dash .x66'), l2 = document.querySelector('#v-dash .x66L');
    if (x2) lfFoldAnim(x2, x2.firstElementChild, l2 && l2.querySelector('.ch66'), true);
  };
  ACT.pgrAjusta = function () {
    var pp = pgrPrecos();
    if (!pp) return;
    lfaAbre('dFolha', '<div class="dFt"><span>PRÉ-GRADUADOS</span></div><div class="col" style="gap:12px;padding:4px 4px 8px"><div class="hint" style="margin:0">O app escolhe a linha de cada peça sozinho; o contador confere a margem.</div>' +
      '<label class="paIn"><span>Linha econômica (G$)</span><input class="in" inputmode="numeric" data-aj="prePe" value="' + (pp.e ? pp.e.toLocaleString('pt-BR') : '') + '"></label>' +
      '<label class="paIn"><span>Linha luxo (G$)</span><input class="in" inputmode="numeric" data-aj="prePl" value="' + (pp.l ? pp.l.toLocaleString('pt-BR') : '') + '"></label></div>');
  };
  // 66: as contas são divididas sempre pelo custo (uma vez, para quem tinha "Igual por peça")
  if (!S.rat66) { S.rat66 = true; S.rateio = 'custo'; }
  var _iniLista74 = iniLista;
  iniLista = function () {
    if (!S.rat66) { S.rat66 = true; S.rateio = 'custo'; }
    // 63: a família Peças fica só com Inventário e Estúdio (uma vez)
    if (!S.fam63) {
      S.fam63 = true;
      var gp = grpGet('g:pecas');
      if (gp) { gp.itens = gp.itens.filter(function (x) { return ['lotes', 'repo', 'cont'].indexOf(x) < 0; }); gp.frase = 'Inventário e estúdio'; }
    }
    return _iniLista74.apply(this, arguments);
  };
