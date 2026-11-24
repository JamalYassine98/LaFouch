  // ===== S374 · catálogo de peças (aprovado 17/11/2026; "implementar tudo" 14:40) =====
  // 99  ABRIR NO LUGAR: as contas (.ecF) juntas num cartão (.g99), em linhas; as dobras (section.fxF) já nascem como linha (135d);
  //     "⌄" gira ao abrir (Ajustes também; "Site" continua "›" porque leva a outra tela). Reservas: "Ver para onde vai" é um bloco.
  // 100/101 IR PARA OUTRA TELA: linha de lista com "›" parado; link solto rosa 15 px — sozinho = centralizado; ao lado de outro
  //     botão = no lugar. "Marcar como paga" é ação → botão secundário.
  // 102 "Lista de compras ›" no fim da aba Fornecedores. 98 Marketing como tela (#v-mkt).
  function pad99(raiz) {
    if (!raiz) return;
    var vistos = [];
    [].forEach.call(raiz.querySelectorAll('.card.ecF'), function (s) {
      if (vistos.indexOf(s) >= 0 || (s.parentElement && s.parentElement.classList.contains('g99'))) return;
      var run = [s], n = s.nextElementSibling;
      while (n && n.matches('.card.ecF')) { run.push(n); n = n.nextElementSibling; }
      var g = document.createElement('div');
      g.className = 'g99';
      s.parentNode.insertBefore(g, s);
      run.forEach(function (x) { vistos.push(x); g.appendChild(x); });
    });
  }
  // Esboços 37 / 149l / 37c: o link solto NASCE declarado (rosa, 15 px, termina em ›) — ninguém adivinha pelo texto depois do desenho.
  // sozinho = link centralizado numa linha só dele; sem isso, fica na linha do texto.
  //   lkSolto(texto, act, id, sozinho)  o botão inteiro, para quem não precisa de classe própria
  //   lkCls(sozinho)                    só as classes, para quem já nasce com classe própria (ex.: 'lcT' + lkCls(true))
  //   lkLinha(texto, act, id, sub)      a linha-link centralizada dentro de um aviso ou de um bloco ("Ver o que falta repor ›")
  function lkCls(sozinho) { return ' lk100 ' + (sozinho ? 'c101' : 'inl'); }
  function lkSolto(texto, act, id, sozinho) {
    return '<button type="button" class="' + lkCls(sozinho).trim() + '" data-act="' + act + '"' + (id != null && id !== '' ? ' data-id="' + esc(id) + '"' : '') + '>' + esc(texto) + ' ›</button>';
  }
  function lkLinha(texto, act, id, sub) {
    return '<button type="button" class="esLn slVai r100" data-act="' + act + '" data-id="' + esc(id == null ? '' : id) + '"><span class="g"><b style="font-weight:500">' + esc(texto) + ' ›</b>' +
      (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span><i aria-hidden="true">›</i></button>';
  }
  // L4 (regra 14): texto nunca quebra nem sai — se não cabe, a letra do GRUPO diminui, um degrau por vez (até 3). Uma função para todos:
  // el recebe data-cabe="0|1|2|3" (os degraus de cada grupo ficam no CSS dele) e naoCabe() diz se ainda sobra texto para fora.
  function lfCabe(el, naoCabe) {
    for (var n = 0; n <= 3; n++) {
      el.setAttribute('data-cabe', String(n));
      if (!naoCabe()) return;
    }
  }
  // as linhas "lugar" (.nvLista: índice do grupo, Dashboard, fim do Inventário) e as vagas de Compras (.cpLs)
  // 46 e 89b: as linhas de interruptor das janelas de liga e desliga (.lgJn) e a linha "Investido em <mês>" (.lt89)
  var LISTAS_CABE = [['.nvLista', '.nvTx>b,.nvTx>small'], ['.cpLs', '.cpTx>b,.cpTx>small'], ['.lgJn .ljCorpo', '.paSw b,.paSw small'], ['.lt89', '.lt89>span,.lt89>b'], ['.ofFicha', '.ofL b,.ofL small,.ofL em'], ['.ofJn .ljCorpo', '.ofJn .cxL>span,.ofJn .cxL>b']]; // listas de linhas: a lista inteira é um grupo
  function nvListaCabe(v) {
    LISTAS_CABE.forEach(function (lc) { [].forEach.call(v.querySelectorAll(lc[0]), function (l) {
      var tx = l.querySelectorAll(lc[1]);
      if (!tx.length || !l.offsetWidth) return;
      lfCabe(l, function () {
        for (var i = 0; i < tx.length; i++) if (tx[i].scrollWidth > tx[i].clientWidth + 1) return true;
        return false;
      });
    }); });
  }
  // L4 nas ESCOLHAS DE LADOS (achado do dono 22/11 06:26, "Intermediário" maior que o botão): a lista das escolhas mora AQUI.
  // Se uma opção não cabe no lado dela, a letra da escolha inteira desce (3 degraus: 14 · 13 · 12 px, no CSS .ladosC).
  var LADOS = '.trk,.pdSeg'; // 80: toda barra de escolha é o trilho (.trk); .pdSeg são as abas de Pedidos
  function ladosCabe(raiz) {
    [].forEach.call(raiz.querySelectorAll(LADOS), function (l) {
      if (!l.offsetWidth) return;
      l.classList.add('ladosC');
      var op = [].filter.call(l.children, function (c) { return c.tagName === 'BUTTON' && c.offsetWidth; });
      if (op.length < 2) return;
      lfCabe(l, function () {
        for (var i = 0; i < op.length; i++) if (op[i].scrollWidth > op[i].clientWidth + 1) return true;
        return false;
      });
    });
  }
  window.__ladosCabe = ladosCabe;
  function padTela() {
    var v = document.querySelector('.view:not([hidden])');
    if (!v) return;
    try { pad99(v); } catch (e) {}
    try { nvListaCabe(v); } catch (e) {}
    try { ladosCabe(document); } catch (e) {}
    try { [].forEach.call(document.querySelectorAll('.ljJn'), nvListaCabe); } catch (e) {} // janelas de baixo abertas (fora das telas)
  }
  aposRender(padTela);

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
      el.innerHTML = '<div class="top"><div><h1>Marketing</h1></div></div><section class="nvLista" id="mkMarcaL"></section><div class="mk98" id="mkCorpo"></div>';
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
    var ml = $('mkMarcaL');
    if (ml) ml.innerHTML = mkMarcaHtml();
  }
  aposRender(renderMkt);
