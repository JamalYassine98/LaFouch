  // ===== S265 (aprovado 14/11/2026): FAMÍLIAS — telas irmãs juntas numa tela só, que rola =====
  // Dinheiro  = Caixa + "Contas do mês" (topo das Despesas) + "Câmbio" (cotações e reposição).
  // Dashboard = o dia + "Dias anteriores" (3 dias do Histórico) + "Números do mês" (3 cartões do Resumo).
  // Os blocos das outras telas são os VERDADEIROS: a tela irmã é desenhada escondida (S._rtudo) e o bloco é copiado.
  // Cada parte tem "Ver tudo", que abre a tela inteira de sempre. Celular: uma coluna; tablet: duas; computador: três.
  S._fam = {};
  function famRot(t) { var d = document.createElement('div'); d.className = 'lbl famS'; d.textContent = t; return d; }
  function famBtn(t, act, id) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'gBtn famV'; b.textContent = t; b.setAttribute('data-act', act);
    if (id != null) b.setAttribute('data-id', id);
    return b;
  }
  function famDesenha(fn) { var a = S._rtudo; S._rtudo = true; try { fn(); } catch (e) {} S._rtudo = a; }
  function famCopia(el) {
    var c = el.cloneNode(true);
    c.removeAttribute('id');
    [].forEach.call(c.querySelectorAll('[id]'), function (x) { x.removeAttribute('id'); });
    return c;
  }
  function famAcha(v, rx) { return [].filter.call(v.children, function (c) { return rx.test((c.textContent || '').trim()); })[0]; }
  // mostra só o começo de uma lista longa; o resto abre no lugar
  function famCorta(pai, max, chave, rotulo) {
    if (S._fam[chave]) return;
    var h = 0, n = 0, oc = 0;
    [].forEach.call(pai.children, function (c) {
      var r = c.getBoundingClientRect().height;
      if (!r) return;
      if (h + r > max && n > 1) { c.classList.add('famOc'); oc++; } else { h += r; n++; }
    });
    if (oc) pai.appendChild(famBtn(rotulo, 'famAbre', chave));
  }
  function famColunas(v, c2, c3) {
    var c1 = document.createElement('div');
    c1.className = 'famC famC1';
    [c1, c2, c3].forEach(function (c) { c.setAttribute('data-coluna', '1'); }); // colunas de página (o designer não trata como fileira de cartões)
    [].slice.call(v.children).forEach(function (c) { if (!c.classList.contains('top')) c1.appendChild(c); });
    v.appendChild(c1); v.appendChild(c2); v.appendChild(c3);
    v.classList.add('fam');
  }
  function famZera() { if (S._famV !== S.view) { S._fam = {}; S._famV = S.view; } }
  ACT.famAbre = function (k) { S._fam[k] = 1; render(); };
  ACT.famNum = function () { S.dTab = 'hoje'; setView('dash'); };

  function famDinheiro() {
    var v = $('v-caixa');
    if (!v || S.view !== 'caixa') return;
    famZera();
    var h1 = v.querySelector('.top h1'), cr = v.querySelector('.top .crumb');
    if (h1) h1.textContent = 'Dinheiro';
    if (cr) cr.textContent = 'Caixa, contas do mês e câmbio.';
    if (v.querySelector('.famS')) return;
    var mv = famAcha(v, /^Movimentos/);
    if (mv) famCorta(mv, 300, 'mov', 'Ver todos os movimentos ›');
    var c2 = document.createElement('div'), c3 = document.createElement('div');
    c2.className = 'famC famC2'; c3.className = 'famC famC3';
    famDesenha(renderDesp);
    var d = $('v-desp');
    c2.appendChild(famRot('Contas do mês'));
    if (d) {
      var k = d.querySelector('.kpis'), cp = famAcha(d, /^Contas para pagar/);
      if (k) c2.appendChild(famCopia(k));
      if (cp) c2.appendChild(famCopia(cp));
    }
    c2.appendChild(famBtn('Ver todas as despesas ›', 'view', 'desp'));
    famDesenha(renderFx);
    var f = $('v-fx');
    c3.appendChild(famRot('Câmbio'));
    if (f) ['.fxTop', '.fxRepo'].forEach(function (q) { var e = f.querySelector(q); if (e) c3.appendChild(famCopia(e)); });
    c3.appendChild(famBtn('Ver câmbio e trocas ›', 'view', 'fx'));
    famColunas(v, c2, c3);
  }
  var _rcFam = renderCaixa;
  renderCaixa = function () {
    var r = _rcFam.apply(this, arguments);
    try { famDinheiro(); } catch (e) {}
    return r;
  };

  function famDashboard() {
    var v = $('v-dia');
    if (!v || S.view !== 'dia') return;
    famZera();
    if (v.querySelector('.famS')) return;
    var top = document.createElement('div');
    top.className = 'top';
    top.innerHTML = '<div><h1>Dashboard</h1><div class="crumb">O dia, os dias anteriores e os números do mês.</div></div>';
    v.insertBefore(top, v.firstChild);
    var vd = famAcha(v, /^Vendas do dia/);
    if (vd) famCorta(vd, 470, 'vd', 'Ver todas as vendas do dia ›');
    // "Câmbio do dia" e "Despesas do dia" continuam aqui, recolhidos numa linha (abrem no toque)
    [/^Câmbio do dia/, /^Despesas do dia/].forEach(function (rx, i) {
      var c = famAcha(v, rx);
      if (c && !S._fam['r' + i] && c.children.length > 1) {
        c.classList.add('famRec');
        c.setAttribute('data-act', 'famAbre'); c.setAttribute('data-id', 'r' + i); c.setAttribute('role', 'button'); c.setAttribute('tabindex', '0');
      }
    });
    var c2 = document.createElement('div'), c3 = document.createElement('div');
    c2.className = 'famC famC2'; c3.className = 'famC famC3';
    c2.appendChild(famRot('Dias anteriores'));
    famDesenha(renderHist);
    var hr = $('hRes'), rx = /^\d\d\/\d\d[\s\S]*venda\(s\)/;
    if (hr) {
      var ds = [].filter.call(hr.querySelectorAll('*'), function (e) {
        return rx.test((e.textContent || '').trim()) && ![].some.call(e.children, function (c) { return rx.test((c.textContent || '').trim()); });
      });
      ds.filter(function (e) { return !/hoje/.test((e.textContent || '').slice(0, 14)); }).slice(0, 3).forEach(function (e) { c2.appendChild(famCopia(e)); });
    }
    c2.appendChild(famBtn('Ver todos os dias ›', 'view', 'hist'));
    c3.appendChild(famRot('Números do mês'));
    var aba = S.dTab;
    S.dTab = 'hoje';
    famDesenha(renderDash);
    S.dTab = aba;
    var db = $('dtabBody');
    if (db) {
      // só os 3 primeiros números (Vendido, Separar, Lucro livre); o resto fica em "Ver todos os números"
      var grupo = db.querySelector('.kpis') || db.firstElementChild;
      if (grupo) {
        var g = famCopia(grupo);
        [].slice.call(g.children).slice(3).forEach(function (e) { e.remove(); });
        c3.appendChild(g);
      }
    }
    c3.appendChild(famBtn('Ver todos os números ›', 'famNum'));
    famColunas(v, c2, c3);
  }
  var _rdFam = renderDay;
  renderDay = function () {
    var r = _rdFam.apply(this, arguments);
    try { famDashboard(); } catch (e) {}
    return r;
  };
  // o atalho "Dashboard" abre a tela da família (o dia de hoje); os números do mês ficam a um toque
  var _igFam = inicioGo;
  inicioGo = function (id) {
    if (id === 'hoje') { S.day = dayKey(Date.now()); setView('dia'); return; }
    return _igFam.apply(this, arguments);
  };
  var _noFam = navOn;
  navOn = function (id) {
    if (id === 'hoje' && S.view === 'dia') return true;
    return _noFam.apply(this, arguments);
  };
