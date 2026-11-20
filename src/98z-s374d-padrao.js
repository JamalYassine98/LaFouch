  // ===== S374 · catálogo de peças (aprovado 17/11/2026; "implementar tudo" 14:40) =====
  // 99  ABRIR NO LUGAR: blocos que abrem (section.fxF, contas .ecF, dias/semanas do Histórico) juntos num cartão (.g99), em linhas;
  //     "⌄" gira ao abrir (Ajustes também; "Site" continua "›" porque leva a outra tela). Reservas: "Ver para onde vai" é um bloco.
  // 100/101 IR PARA OUTRA TELA: linha de lista com "›" parado; link solto rosa 15 px — sozinho = centralizado; ao lado de outro
  //     botão = no lugar. "Marcar como paga" é ação → botão secundário.
  // 102 "Lista de compras ›" no fim da aba Fornecedores. 98 Marketing como tela (#v-mkt).
  function pad99(raiz) {
    if (!raiz) return;
    var vistos = [];
    [].forEach.call(raiz.querySelectorAll('section.card.fxF, .card.ecF'), function (s) {
      if (vistos.indexOf(s) >= 0 || (s.parentElement && s.parentElement.classList.contains('g99'))) return;
      var run = [s], n = s.nextElementSibling;
      while (n && n.matches('section.card.fxF, .card.ecF')) { run.push(n); n = n.nextElementSibling; }
      var g = document.createElement('div');
      g.className = 'g99';
      s.parentNode.insertBefore(g, s);
      run.forEach(function (x) { vistos.push(x); g.appendChild(x); });
    });
    // Histórico: dias e semanas de cada mês viram linhas de um cartão
    [].forEach.call(raiz.querySelectorAll('.list'), function (l) {
      var g = null;
      [].slice.call(l.children).forEach(function (x) {
        if (x.matches('.pcard.hDia, .card.hSem, .hSemB')) {
          if (x.parentElement.classList.contains('g99')) return;
          if (!g) { g = document.createElement('div'); g.className = 'g99 h101'; l.insertBefore(g, x); }
          g.appendChild(x);
        } else if (!x.classList.contains('g99')) g = null;
      });
    });
  }
  var FORA100 = '.fxRow,.ajR,.stL,.st96,.pv97,.dOp,.fxH,.pcard,.estFi,.ifNum,.kpi,.kpiLk,.stN,.mn,.lfaSh,.mkPb,.mkSt,.dHdT,.ataL,.rw77,.lcSecS,.lk77,.lfa-sh,.ljJn,#lcIrInv';
  function pad100(raiz) {
    if (!raiz) return;
    [].forEach.call(raiz.querySelectorAll('.slVai:not(.mpg73)'), function (e) {
      if (e._p100) return;
      e._p100 = 1;
      e.classList.add('r100');
      var b = e.querySelector('b');
      if (b && !/›/.test(b.textContent)) b.textContent = b.textContent.trim() + ' ›';
    });
    [].forEach.call(raiz.querySelectorAll('button,a'), function (e) {
      if (e._p100) return;
      var t = (e.textContent || '').trim();
      if (!/›\s*$/.test(t) || t.length < 4) return;
      if (e.closest(FORA100) || e.matches(FORA100)) return;
      var s = getComputedStyle(e), pilula = e.matches('.gBtn,.chip,.lcT,.btn-sc');
      if (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && !pilula) return;
      if (parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none' && !pilula) return;
      e._p100 = 1;
      var irm = [].filter.call(e.parentElement.children, function (x) { return x !== e && x.matches('button,a') && (x.textContent || '').trim(); });
      e.classList.add('lk100');
      e.classList.add(irm.length && !e.matches('.gBtn') ? 'inl' : 'c101');
    });
  }
  function padTela() {
    var v = document.querySelector('.view:not([hidden])');
    if (!v) return;
    try { pad99(v); pad100(v); } catch (e) {}
  }
  aposRender(padTela);

  // 102: "Lista de compras ›" sai de Produtos e fica no fim da aba Fornecedores, centralizada
  var _rEA102 = renderEstoqueAbas;
  renderEstoqueAbas = function () {
    var r = _rEA102.apply(this, arguments), ln = $('lcIrInv'), v = $('v-estoque');
    if (!ln || !v) return r;
    if (S.view === 'estoque' && S.lotesView) {
      var n = 0;
      try { var L = lcLista(); n = L.acab.length + L.epoca.length; } catch (e) {}
      ln.innerHTML = '<button type="button" class="lcT" data-act="lcIrGiro">Lista de compras' + (n ? ' · ' + n + ' acabando' : '') + ' ›</button>';
      ln.hidden = false;
      ln.classList.add('c102');
      if (v.lastElementChild !== ln) v.appendChild(ln);
    } else ln.hidden = true;
    return r;
  };

  // 98: Marketing é tela do app (#v-mkt); a família abre a tela como as outras
  if (!$('v-mkt')) {
    var _vm = document.createElement('div');
    _vm.id = 'v-mkt';
    _vm.className = 'view';
    _vm.hidden = true;
    var _vc = $('v-cup') || $('v-site');
    if (_vc && _vc.parentNode) _vc.parentNode.insertBefore(_vm, _vc);
  }
  if (!VIEWS.some(function (v) { return v[0] === 'mkt'; })) VIEWS.push(['mkt', 'Marketing']);
  function mkGrupa(c) {
    var ds = [].slice.call(c.querySelectorAll(':scope > details.mkDt'));
    if (!ds.length || c.querySelector(':scope > .mkDtG')) return;
    var g = document.createElement('div');
    g.className = 'mkDtG';
    c.insertBefore(g, ds[0]);
    ds.forEach(function (d) {
      g.appendChild(d);
      var fb = document.createElement('div'), fi = document.createElement('div');
      fb.className = 'mkFb';
      fi.className = 'mkFi';
      [].slice.call(d.childNodes).forEach(function (n) { if (!(n.nodeType === 1 && n.tagName === 'SUMMARY')) fi.appendChild(n); });
      fb.appendChild(fi);
      d.appendChild(fb);
    });
  }
  function renderMkt() {
    var el = $('v-mkt');
    if (!el || S.view !== 'mkt') return;
    if (!el.getAttribute('data-ok')) {
      el.setAttribute('data-ok', '1');
      el.innerHTML = '<div class="top"><div><h1>Marketing</h1></div></div><div class="mk98" id="mkCorpo"></div>';
      var c = $('mkCorpo');
      mkKit();
      mkMonta(c, { fecha: function () {} });
      mkGrupa(c);
      if (window.MutationObserver) new MutationObserver(function () { mkGrupa(c); }).observe(c, { childList: true });
      // os 3 blocos abrem no lugar com a mesma animação dos outros blocos do app
      c.addEventListener('click', function (e) {
        var sm = e.target.closest('summary.mkSec');
        if (!sm || !c.contains(sm)) return;
        var d = sm.parentElement, fb = d.querySelector('.mkFb');
        if (!fb) return;
        e.preventDefault();
        if (d._anim) return;
        if (!d.open) {
          d.open = true;
          d._anim = 1;
          lfFoldAnim(fb, fb.firstElementChild, null, true, function () { d._anim = 0; });
        } else {
          d._anim = 1;
          d.classList.add('fecha');
          lfFoldAnim(fb, fb.firstElementChild, null, false, function () { d.open = false; d.classList.remove('fecha'); d._anim = 0; });
        }
      });
    }
  }
  aposRender(renderMkt);
