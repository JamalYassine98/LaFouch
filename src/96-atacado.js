  // ===== Atacado na lista de vendas: − N + com teclado numérico, segurar acelera, barra até a próxima tabela =====
  function atacModo() {
    return !tabDe(S.tabAtiva).pub;
  }
  function atacQtd(it) {
    return S.cart.reduce(function (a, l) {
      return a + (l.it === it ? l.qty : 0);
    }, 0);
  }
  function atacSet(it, n) {
    n = Math.max(0, Math.min(Math.floor(n) || 0, gLivre(it)));
    var ex = S.cart.filter(function (l) {
      return l.it === it;
    })[0];
    if (!ex && n > 0) S.cart.push({ it: it, qty: n, tab: S.tabAtiva, preco: null });
    else if (ex && n <= 0) S.cart.splice(S.cart.indexOf(ex), 1);
    else if (ex) {
      if (ex.preco != null) ex.preco = Math.round((ex.preco * n) / ex.qty);
      ex.qty = n;
    }
    S.rec = null;
    saveSoon();
    render();
  }
  function atacTeclado(it) {
    var o = lfaAbre(
      'lfa-qty',
      '<h3 style="margin:0 0 8px">Quantidade — ' + esc(pn(it.ref)) + '</h3><input class="in" id="atacN" type="tel" inputmode="numeric" pattern="[0-9]*" value="' + atacQtd(it) + '" style="font-size:28px;text-align:center;min-height:56px;width:100%"><div class="hint">Disponível: ' + gLivre(it) + ' un.</div><div style="display:flex;gap:8px;margin-top:10px"><button type="button" class="btn ghost" id="atacX" style="flex:1">Cancelar</button><button type="button" class="btn" id="atacOk" style="flex:1">Ok</button></div>'
    );
    var inp = o.querySelector('#atacN');
    inp.focus();
    inp.select();
    o.querySelector('#atacX').onclick = function () {
      lfaFecha('lfa-qty');
    };
    o.querySelector('#atacOk').onclick = function () {
      lfaFecha('lfa-qty');
      atacSet(it, parseInt(inp.value, 10) || 0);
    };
    inp.onkeydown = function (e) {
      if (e.key === 'Enter') o.querySelector('#atacOk').click();
    };
  }
  // Controle − N + de uma peça (uma só variante em estoque).
  function atacStep(it) {
    var w = mk('span', 'vstep'),
      n = atacQtd(it);
    function parte(txt, cls, label) {
      var e = mk('span', cls, txt);
      e.setAttribute('role', 'button');
      e.tabIndex = 0;
      e.setAttribute('aria-label', label);
      e.addEventListener('click', function (ev) {
        ev.stopPropagation();
      });
      return e;
    }
    function segura(e, delta) {
      var tm, iv, passo = 0, feito = false;
      function dar() {
        var d = passo > 12 ? 10 : passo > 5 ? 5 : 1;
        atacSet(it, atacQtd(it) + delta * d);
        passo++;
        feito = true;
      }
      function para() {
        clearTimeout(tm);
        clearInterval(iv);
      }
      e.addEventListener('pointerdown', function (ev) {
        ev.stopPropagation();
        passo = 0;
        feito = false;
        tm = setTimeout(function () {
          iv = setInterval(dar, 140);
        }, 380);
      });
      e.addEventListener('pointerup', function (ev) {
        ev.stopPropagation();
        var longo = passo > 0;
        para();
        if (!longo) dar();
      });
      e.addEventListener('pointerleave', para);
      e.addEventListener('pointercancel', para);
      e.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          ev.stopPropagation();
          atacSet(it, atacQtd(it) + delta);
        }
      });
    }
    var m = parte('−', 'vs-b vs-m', 'Diminuir'),
      c = parte(String(n), 'vs-n', 'Quantidade, toque para digitar'),
      p = parte('+', 'vs-b vs-p', 'Aumentar');
    if (!n) m.classList.add('off');
    segura(m, -1);
    segura(p, 1);
    c.addEventListener('click', function (ev) {
      ev.stopPropagation();
      atacTeclado(it);
    });
    w.appendChild(m);
    w.appendChild(c);
    w.appendChild(p);
    return w;
  }
  // Barra de progresso até a próxima tabela de atacado.
  function atacProg() {
    if (!atacModo() || !S.cart.length) return null;
    var cur = S.cart[0].tab || S.tabAtiva,
      usd = cartUsdTab(cur),
      prox = null;
    tabLista().forEach(function (T) {
      if (T.pub || !(T.min > 0) || T.min <= usd) return;
      if (!prox || T.min < prox.min) prox = T;
    });
    if (!prox) return null;
    var d = mk('div', 'vprog');
    d.innerHTML = '<div class="vprog-t">Faltam <b>US$ ' + Math.ceil(prox.min - usd).toLocaleString('pt-BR') + '</b> para a tabela <b>' + esc(prox.nome) + '</b></div><div class="vprog-b"><i style="width:' + Math.max(4, Math.min(100, Math.round((usd / prox.min) * 100))) + '%"></i></div>';
    return d;
  }
