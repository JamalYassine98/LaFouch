  // ===== S184 (aprovado 12/11/2026): navegar rápido entre as telas =====
  // 1 Ficha única: a mesma peça com 5 abas no topo (Vender · Estoque · Histórico · Site · Preço), igual em qualquer lugar;
  //   volta para a aba usada por último. 5 Caminho no topo (Catálogo › GR3350) e o voltar certo (S187).
  // 8 Deslizar na ficha passa para a próxima peça da lista de onde veio. 2 Códigos de peça viram link nas listas.
  // 3 Números do Resumo abrem o que está por trás. 4 Aba Online nos Números. 6 Recentes embaixo da busca do Início.
  // 7 Botão de ação na ficha (Vender esta).
  S.fnTab = S.fnTab || '';
  S.recentes = S.recentes || [];
  function fnItem(ref) { return (S.items || []).filter(function (x) { return x.ref === ref; })[0]; }
  function fnRecente(k, id, nome) {
    if (!id) return;
    S.recentes = [{ k: k, id: String(id), n: nome || String(id), ts: Date.now() }].concat((S.recentes || []).filter(function (r) { return !(r.k === k && r.id === String(id)); })).slice(0, 5);
    saveSoon();
  }
  function fnAbreEstoque(ref) {
    var it = fnItem(ref);
    if (!it) return;
    S.fnTab = 'est';
    setView('estoque');
    S.todos = false; S.tipo = it.tipo; S.fmtF = 'all'; S.corF = 'all'; S.q = ''; S.open = ref; S.det = true;
    render();
  }
  function fnAbreVenda(ref) {
    var it = fnItem(ref);
    if (!it) return;
    S.fnTab = 'ven';
    setView('vendas');
    S.vRef = it.tipo + '|' + ref;
    render();
  }
  ACT.abreRef = function (ref) { if (S.fnTab === 'ven') fnAbreVenda(ref); else fnAbreEstoque(ref); };
  ACT.fnTab = function (t) {
    var det = document.querySelector('.fnBar[data-ref]'), ref = det && det.getAttribute('data-ref');
    if (!ref) return;
    if (t === 'ven') { fnAbreVenda(ref); return; }
    if (t === 'est') { fnAbreEstoque(ref); return; }
    S.fnTab = t;
    saveSoon();
    fnPinta(det.parentNode, ref, det.getAttribute('data-modo'));
  };
  function fnHist(ref) {
    var vs = (S.sales || []).filter(function (s) { return s.ref === ref && !s.estorno; }).sort(function (a, b) { return b.ts - a.ts; }),
      d30 = vs.filter(function (s) { return s.ts > Date.now() - 30 * DAY; }), site = d30.filter(function (s) { return s.canal === 'site' || s.pedId; }).length;
    return '<section class="card col fnPn"><div class="lbl">VENDAS</div><div class="sl"><span>30 dias</span><b>' + d30.reduce(function (a, s) { return a + (s.qty || 1); }, 0) + ' vendidas' + (site ? ' · ' + site + ' no site' : '') + '</b></div>' +
      (vs.length ? vs.slice(0, 12).map(function (s) {
        return '<div class="sl"><span>' + fd(s.ts) + ' · ' + esc([s.grau, s.cor].filter(Boolean).join(' · ')) + '<small>' + (s.qty || 1) + ' un.' + (s.cliNome ? ' · ' + esc(s.cliNome) : '') + '</small></span><b>' + gs(s.price) + '</b></div>';
      }).join('') : '<div class="hint">Ainda não vendeu.</div>') + '</section>';
  }
  function fnSite(ref) {
    var pub = !!(S.site && S.site[ref]), v = (S.vistas || {})[ref] || 0;
    return '<section class="card col fnPn"><div class="lbl">NO SITE</div><div class="sl"><span>Publicada</span><b style="color:' + (pub ? 'var(--ok)' : 'var(--mu)') + '">' + (pub ? 'sim' : 'não') + '</b></div>' +
      '<div class="sl"><span>Vistas (30 dias)</span><b>' + v + '</b></div>' +
      (pub ? '<div class="sl"><span>Link</span><b>lafouch.com/p/' + esc(ref) + '</b></div>' : '') +
      '<button type="button" class="gBtn" data-act="onlAba" data-id="vistas" style="align-self:flex-start;margin-top:8px">Ver no painel online ›</button></section>';
  }
  function fnPreco(ref) {
    var it = fnItem(ref);
    if (!it) return '';
    var p = precoTab(it), pp = typeof pisoPeca === 'function' ? pisoPeca(it) : null;
    return '<section class="card col fnPn"><div class="lbl">PREÇO</div><div class="sl"><span>Preço de balcão</span><b>' + gs(p) + '</b></div>' +
      (pp ? '<div class="sl"><span>Piso</span><b>' + gs(pp.piso) + '</b></div>' : '') +
      (pp && pp.piso && p > pp.piso ? '<div class="sl"><span>Saída sugerida</span><b>' + gs(Math.round(((p + pp.piso) / 2) / 1000) * 1000) + '</b></div>' : '') + '</section>';
  }
  function fnPinta(det, ref, modo) {
    var t = S.fnTab;
    var alt = t === 'his' || t === 'sit' || t === 'pre';
    det.classList.toggle('fnAlt', alt);
    var pn = det.querySelector('.fnPane');
    if (!pn) { pn = document.createElement('div'); pn.className = 'fnPane'; var bar = det.querySelector('.fnBar'); bar.parentNode.insertBefore(pn, bar.nextSibling); }
    pn.innerHTML = alt ? (t === 'his' ? fnHist(ref) : t === 'sit' ? fnSite(ref) : fnPreco(ref)) : '';
    var cur = alt ? t : modo === 'venda' ? 'ven' : 'est';
    [].forEach.call(det.querySelectorAll('.fnTabs button'), function (b) { b.classList.toggle('on', b.getAttribute('data-id') === cur); });
  }
  function fnBarHtml(ref, modo) {
    var de = modo === 'venda' ? 'Catálogo' : 'Inventário';
    return '<div class="fnBar" data-ref="' + esc(ref) + '" data-modo="' + modo + '"><div class="fnCam"><span>' + de + '</span><i>›</i><b>' + esc(ref) + '</b>' +
      (S.fnLista && S.fnLista.length > 1 && S.fnLista.indexOf(ref) >= 0 ? '<small>' + (S.fnLista.indexOf(ref) + 1) + ' de ' + S.fnLista.length + '</small>' : '') + '</div>' +
      '<div class="fnTabs" role="tablist">' + [['ven', 'Vender'], ['est', 'Estoque'], ['his', 'Histórico'], ['sit', 'Site'], ['pre', 'Preço']].map(function (x) { return '<button type="button" data-act="fnTab" data-id="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div></div>';
  }
  ACT.fnVolta = function () { try { history.back(); } catch (e) {} };
  // lista de onde a peça veio (para deslizar): as peças visíveis na tela, na ordem
  function fnCapturaLista() {
    var v = $('v-' + S.view), L = [];
    if (!v) return;
    [].forEach.call(v.querySelectorAll('[data-ref]'), function (e) { var r = e.getAttribute('data-ref'); if (r && fnItem(r) && L.indexOf(r) < 0) L.push(r); });
    if (L.length > 1) S.fnLista = L;
  }
  var _rdNav = renderDetail;
  renderDetail = function (ref, opt) {
    var r = _rdNav.apply(this, arguments);
    try {
      opt = opt || {};
      var det = opt.host || $('detail');
      if (ref && det && fnItem(ref) && !det.querySelector('.fnBar')) {
        var modo = opt.venda ? 'venda' : 'est', w = document.createElement('div');
        if (!S.fnLista || S.fnLista.indexOf(ref) < 0) fnCapturaLista();
        w.innerHTML = fnBarHtml(ref, modo);
        det.insertBefore(w.firstChild, det.firstChild);
        var fb = det.querySelector(':scope > .fiBtn'), cam = det.querySelector('.fnCam');
        if (fb && cam) cam.appendChild(fb); // S190: o botão da Ficha fica na linha do caminho
        if (S.fnTab !== 'his' && S.fnTab !== 'sit' && S.fnTab !== 'pre') S.fnTab = modo === 'venda' ? 'ven' : 'est';
        fnPinta(det, ref, modo);
        fnRecente('ref', ref, pn(ref));
        // 7 botão de ação: na ficha do estoque, "Vender esta"
        if (modo === 'est' && !det.querySelector('.fnFab')) {
          var f = document.createElement('button');
          f.type = 'button'; f.className = 'fnFab'; f.textContent = 'Vender esta'; f.setAttribute('data-act', 'fnTab'); f.setAttribute('data-id', 'ven');
          det.appendChild(f);
        }
        fnSwipe(det, ref);
      }
    } catch (e) {}
    return r;
  };
  // 8 deslizar para a próxima/anterior da lista
  function fnSwipe(det, ref) {
    if (det._fnSw) return;
    det._fnSw = 1;
    var x0 = 0, y0 = 0, on = false;
    det.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') return; x0 = e.clientX; y0 = e.clientY; on = true; }, { passive: true });
    det.addEventListener('pointerup', function (e) {
      if (!on) return;
      on = false;
      var dx = e.clientX - x0, dy = e.clientY - y0, bar = det.querySelector('.fnBar'), cur = bar && bar.getAttribute('data-ref');
      if (Math.abs(dx) < 90 || Math.abs(dy) > Math.abs(dx) * 0.6 || !cur || !S.fnLista) return;
      if (e.target.closest && e.target.closest('.vcores,.ebTr,input,textarea,.fnTabs,[data-act=folhaq]')) return;
      var i = S.fnLista.indexOf(cur), n = i + (dx < 0 ? 1 : -1);
      if (i < 0 || n < 0 || n >= S.fnLista.length) return;
      if (bar.getAttribute('data-modo') === 'venda') fnAbreVenda(S.fnLista[n]); else fnAbreEstoque(S.fnLista[n]);
    }, { passive: true });
  }
  // 2 códigos de peça viram link (Histórico, Pedidos, Avisos, Clientes, Caixa)
  var FN_LINK_V = { hist: 1, ped: 1, notif: 1, clientes: 1, caixa: 1, dia: 1 };
  function fnLinkifica() {
    if (!FN_LINK_V[S.view]) return;
    var v = $('v-' + S.view);
    if (!v) return;
    var refs = {};
    (S.items || []).forEach(function (x) { if (x.ref && x.ref.length >= 4) refs[x.ref] = 1; });
    var tw = document.createTreeWalker(v, NodeFilter.SHOW_TEXT, null), L = [], n;
    while ((n = tw.nextNode())) {
      if (!n.nodeValue || n.nodeValue.length < 4) continue;
      var pa = n.parentNode;
      if (!pa || pa.closest('a,button,input,textarea,select,.fnLk,[data-act]')) continue;
      if (/\b[A-Z]{1,4}\d{3,6}\b/.test(n.nodeValue)) L.push(n);
    }
    L.forEach(function (t) {
      var parts = t.nodeValue.split(/\b([A-Z]{1,4}\d{3,6})\b/);
      if (parts.length < 3) return;
      var fr = document.createDocumentFragment(), ok = false;
      parts.forEach(function (p, i) {
        if (i % 2 === 1 && refs[p]) { var a = document.createElement('a'); a.href = '#'; a.className = 'fnLk'; a.setAttribute('data-act', 'abreRef'); a.setAttribute('data-id', p); a.textContent = p; fr.appendChild(a); ok = true; }
        else fr.appendChild(document.createTextNode(p));
      });
      if (ok) t.parentNode.replaceChild(fr, t);
    });
  }
  var _renderNav = render;
  render = function () {
    var r = _renderNav.apply(this, arguments);
    try { fnLinkifica(); } catch (e) {}
    return r;
  };
  // 6 recentes embaixo da busca do Início
  function recentesHtml() {
    var L = (S.recentes || []).filter(function (r) { return r.k !== 'ref' || fnItem(r.id); });
    if (!L.length) return '';
    return '<div class="fnRec noconta"><small>RECENTES</small><div>' + L.map(function (r) {
      return '<button type="button" class="fnChip" data-act="' + (r.k === 'ref' ? 'abreRef' : r.k === 'cli' ? 'cliab' : 'view') + '" data-id="' + esc(r.k === 'ped' ? 'ped' : r.id) + '">' + (r.k === 'ref' ? '👓 ' : r.k === 'cli' ? '👤 ' : '🧾 ') + esc(r.k === 'ref' ? r.id : r.n) + '</button>';
    }).join('') + '</div></div>';
  }
  // 3 números do Resumo que abrem o que está por trás + 4 aba Online
  DTABS.push(['onl', 'Online']);
  var _dcNav = dashCompose;
  dashCompose = function (o) {
    if (typeof DT_FRASE === 'object' && DT_FRASE && !DT_FRASE.onl) DT_FRASE.onl = 'Como o site está indo';
    if (S.dTab === 'onl') return onlResumoHtml();
    return _dcNav.apply(this, arguments);
  };
  function onlResumoHtml() {
    var V = S.vistas || {}, top = Object.keys(V).sort(function (a, b) { return V[b] - V[a]; }).slice(0, 5),
      vend = {}, ag = Date.now() - 30 * DAY;
    (S.sales || []).forEach(function (s) { if (!s.estorno && s.ts > ag) vend[s.ref] = (vend[s.ref] || 0) + (s.qty || 1); });
    var peds = (S.pedidos || []).filter(function (p) { return !p.teste && p.ts > Date.now() - 7 * DAY; });
    return '<section class="card col"><div class="sl"><span>Pedidos do site · 7 dias</span><b>' + peds.length + '</b></div>' +
      '<div class="sl"><span>Peças vistas · 30 dias</span><b>' + Object.keys(V).reduce(function (a, k) { return a + V[k]; }, 0) + '</b></div></section>' +
      '<section class="card col"><div class="lbl">MAIS VISTAS</div>' + (top.length ? top.map(function (r) {
        return '<div class="sl"><span><a href="#" class="fnLk" data-act="abreRef" data-id="' + esc(r) + '">' + esc(r) + '</a>' + (vend[r] ? '' : ' <small>sem venda</small>') + '</span><b>' + V[r] + ' vistas</b></div>';
      }).join('') : '<div class="hint">Ainda sem vistas (precisa da nuvem ligada).</div>') + '</section>' +
      '<button type="button" class="gBtn" data-act="onlAba" data-id="" style="align-self:center">Painel completo ›</button>';
  }
  ACT.onlAba = function (id) { if (typeof onlPainel === 'function') onlPainel(id || 'resumo'); };
  var _cliabNav = ACT.cliab;
  ACT.cliab = function (id) {
    var c = (S.clientes || []).filter(function (x) { return String(x.id) === String(id); })[0];
    if (c) fnRecente('cli', c.id, String(c.nome || c.tel || 'Cliente').split(' ').slice(0, 2).join(' '));
    return _cliabNav.apply(this, arguments);
  };
  // 3 número do painel abre o que está por trás (toque no cartão do número)
  var FN_KPI = [[/vendid|vendas|faturad/i, function () { setView('hist'); }], [/parad|giro/i, function () { S.dTab = 'giro'; render(); }], [/estoque|invent/i, function () { setView('estoque'); }],
    [/carrinho|site|online|visit/i, function () { S.dTab = 'onl'; render(); }], [/caixa|carteira|dinheiro|reserva/i, function () { S.dTab = 'din'; render(); }], [/conta|despes/i, function () { setView('desp'); }]];
  document.addEventListener('click', function (e) {
    var k = e.target.closest && e.target.closest('#v-dash .kpi');
    if (!k || e.target.closest('button,a,[data-act]')) return;
    var l = (k.querySelector('.lbl') || k).textContent || '';
    for (var i = 0; i < FN_KPI.length; i++) if (FN_KPI[i][0].test(l)) { FN_KPI[i][1](); window.scrollTo(0, 0); return; }
  });
