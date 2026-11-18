  // ===== S374 · esboços 93–97 (aprovados 17/11/2026 10:36, "implementar tudo") =====
  // 94: o painel do site vira tela do app (sem topo/barra/título próprios; cores do app; ?app=2 liga o modo integrado no painel).
  // 95: Site = Site · Pedidos · Mensagens · Vitrine · Modelos; Marketing = Marketing · Temática · Cartões · Analisador;
  //     Ajustes do app ganha a linha "Site" (abre os ajustes do painel). 96/97: tela Site com o estado do site + "Prévia do site ›".
  BARRA_NOME.vit = 'Vitrine';
  BARRA_NOME.prod = 'Modelos';
  BARRA_NOME.pre = 'Prévia do site';
  BARRA_NOME.cfg = 'Ajustes do site';
  GRP_FRASE.site = 'Resumo da loja online';
  GRP_FRASE.vit = 'Destaque da semana e ordem do catálogo';
  GRP_FRASE.prod = 'O que aparece no site';
  GRP_FRASE.anl = 'Visitas do site e o que trouxe cliente';
  if (!ICO_D.vit) ICO_D.vit = ICO_D.onl;
  if (!ICO_D.prod) ICO_D.prod = ICO_D.estoque || ICO_D.onl;
  var PNL95 = ['vit', 'prod', 'pre', 'cfg'];
  var _inicioGo95 = inicioGo;
  inicioGo = function (id) {
    if (PNL95.indexOf(id) >= 0) return onlPainel(id);
    return _inicioGo95.apply(this, arguments);
  };
  var _navOn95 = navOn;
  navOn = function (id) {
    var noPnl = S.view === 'onl';
    if (PNL95.indexOf(id) >= 0) return noPnl && S.onlAba === id;
    if (noPnl && (S.onlAba === 'anl' || S.onlAba === 'tem')) {
      if (id === 'g:site') return false;
      if (id === 'g:mkt') return true;
    }
    if (noPnl && S.onlAba === 'cfg' && (id === 'g:site' || id === 'g:mkt')) return false;
    return _navOn95.apply(this, arguments);
  };
  // famílias (uma vez): Analisador sai do Site e entra no Marketing; Vitrine e Modelos entram no Site
  var _iniLista95 = iniLista;
  iniLista = function () {
    var l = _iniLista95.apply(this, arguments);
    if (!S.fam95 && S.fam6) {
      S.fam95 = true;
      var g = grpGet('g:site'), m = grpGet('g:mkt');
      if (g) {
        var ext = g.itens.filter(function (x) { return ['site', 'ped', 'msg', 'anl', 'tem', 'mkt', 'vit', 'prod'].indexOf(x) < 0; });
        g.itens = ['site', 'ped', 'msg', 'vit', 'prod'].concat(ext);
        g.frase = 'Pedidos, mensagens, vitrine e modelos';
      }
      if (m) {
        if (m.itens.indexOf('anl') < 0) m.itens.push('anl');
        m.frase = 'Posts, vídeos, temática, cartões e visitas';
      }
      saveSoon();
      l = _iniLista95.apply(this, arguments);
    }
    return l;
  };
  // painel integrado: sempre dentro da tela (nunca "tela cheia"), com ?app=2, altura até a barra de baixo
  var _onlUrl95 = onlUrl;
  onlUrl = function () {
    var u = _onlUrl95.apply(this, arguments);
    return u + (u.indexOf('?') < 0 ? '?' : '&') + 'app=2';
  };
  function sbAjusta() {
    var s = $('siteBox');
    if (!s || S.view !== 'onl') return;
    var t = s.getBoundingClientRect().top + (window.scrollY || 0),
      nb = $('mainnav'),
      hb = nb && getComputedStyle(nb).display !== 'none' ? nb.getBoundingClientRect().height : 0; // 112e: barra fixa não tem offsetParent
    s.style.height = Math.max(360, window.innerHeight - t - hb) + 'px';
  }
  window.addEventListener('resize', function () { try { sbAjusta(); } catch (e) {} });
  function escuro95(c) {
    var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(c || '');
    return m ? parseInt(m[1], 16) * 0.3 + parseInt(m[2], 16) * 0.59 + parseInt(m[3], 16) * 0.11 < 128 : false;
  }
  function pnlTema() {
    var f = $('lojaFrame');
    if (!f || !f.contentWindow) return;
    var r = getComputedStyle(document.documentElement), g = function (v) { return r.getPropertyValue(v).trim(); };
    try {
      f.contentWindow.postMessage({ lfTema: { bg: g('--bg'), s1: g('--panel'), s2: g('--panel2'), ln: g('--line'), tx: g('--fg'), mu: g('--mute'), ac: g('--accent-fg'), ok: g('--ok'), wn: g('--warn'), esc: escuro95(g('--bg')) }, lfSiteQ: 1 }, '*');
    } catch (e) {}
  }
  var _rlo95 = renderLojaOnline;
  renderLojaOnline = function () {
    S.siteFull = false;
    var r = _rlo95.apply(this, arguments),
      el = $('v-onl');
    if (el && S.view === 'onl') {
      var tp = el.querySelector('.top.onl95'), tit = S.onlAba === 'cfg' ? 'Ajustes do site' : S.onlAba === 'pre' ? 'Prévia do site' : '';
      if (S.onlAba === 'cfg') S._gAt = '';
      if (tit) {
        if (!tp) {
          tp = mk('div', 'top onl95');
          el.insertBefore(tp, $('siteBox'));
        }
        if (tp.getAttribute('data-t') !== tit) {
          tp.setAttribute('data-t', tit);
          tp.innerHTML = '<div><h1>' + esc(tit) + '</h1></div>';
        }
      } else if (tp) tp.remove();
      requestAnimationFrame(sbAjusta);
      pnlTema();
    }
    return r;
  };
  window.addEventListener('message', function (e) {
    var f = $('lojaFrame');
    if (!f || e.source !== f.contentWindow || !e.data) return;
    if (e.data.lfPronto) { pnlTema(); return; }
    var x = e.data.lfSite;
    if (x && typeof x === 'object') {
      var n = function (v) { return Math.max(0, Math.min(9999, Math.round(+v || 0))); };
      S.siteRes = { on: x.on !== false, mod: n(x.mod), oc: n(x.oc), dm: String(x.dm || '').slice(0, 20), dnm: String(x.dnm || '').slice(0, 30), dt: String(x.dt || '').slice(0, 80), ts: Date.now() };
      saveSoon();
      if (S.view === 'site' || S.view === 'ajustes') render();
    }
  });
  ACT.stPrev = function () { onlPainel('pre'); };
  ACT.stEstado = function () { ACT.ajSite(); };
  ACT.ajSite = function () { S._gAt = ''; onlPainel('cfg'); };
  window.__siteEstado = function () {
    var x = S.siteRes;
    return x ? (x.on ? 'No ar' : 'Desligado') : '';
  };
  // tela Site (esboços 96/97): estado + prévia no mesmo cartão; 4 números (Pedidos, Mensagens, Modelos, Vitrine)
  function stNum95(n, tit, sub, act, id) {
    return '<button type="button" class="stN" data-act="' + act + '" data-id="' + id + '"><small>' + tit + '</small><b>' + (n == null ? '—' : n) + '</b><span>' + esc(sub) + '</span></button>';
  }
  window.__renderSite95 = function (el) {
    var r = S.pnlRes || null, x = S.siteRes || null,
      peds = (S.pedidos || []).filter(function (p) { return p.st !== 'ent' && p.st !== 'canc'; }),
      novos = pedNovos(),
      off = x && !x.on;
    el.innerHTML = '<div class="top"><div><h1>Site</h1></div></div>' +
      '<div class="cx97"><button type="button" class="st96' + (x ? (off ? ' off' : '') : ' nd') + '" data-act="stEstado"><i class="d" aria-hidden="true"></i><span><b>' +
      (x ? (off ? 'Site desligado' : 'Site no ar') : 'Estado do site') + '</b><small>' + (x ? (off ? 'Ninguém vê o catálogo agora' : 'Os clientes veem o catálogo agora') : 'toque para conferir') + '</small></span><em aria-hidden="true">›</em></button>' +
      '<button type="button" class="pv97" data-act="stPrev"><span><b>Prévia do site</b></span><small>preços e descontos</small><em aria-hidden="true">›</em></button></div>' +
      '<div class="stG">' +
      stNum95(peds.length, 'Pedidos', novos ? novos + (novos === 1 ? ' novo para separar' : ' novos para separar') : 'nenhum novo', 'stAbre', 'ped') +
      stNum95(r ? r.msg : null, 'Mensagens', r ? (r.ata ? r.ata + ' de atacado' : 'nenhuma de atacado') : 'abra para atualizar', 'stAbre', 'msg') +
      stNum95(x ? x.mod : null, 'Modelos', x ? 'no ar' + (x.oc ? ' · ' + x.oc + (x.oc === 1 ? ' oculto' : ' ocultos') : '') : 'abra para atualizar', 'stAbre', 'prod') +
      stNum95(x ? (x.dm === 'nada' ? null : '✓') : null, 'Vitrine', x ? (x.dm === 'nada' ? 'sem destaque' : (x.dnm || 'destaque').toLowerCase()) : 'abra para atualizar', 'stAbre', 'vit') +
      '</div>';
  };
