  // ===== Contagem de estoque (aba Estoque): por produto, do mais valioso ao menos, com resumo em dinheiro. =====
  // Custo em US$ de uma peça (própria, do lote ou do tipo).
  function custoUn(i) {
    var c = effCusto(i);
    return c != null ? c : (tipoOf(i.tipo) || {}).repUSD || 0;
  }
  // Produtos da contagem: peças do filtro atual agrupadas por produto, mais valiosos primeiro.
  function contagemGrupos() {
    var map = {},
      ord = [];
    (S._flAll || []).forEach(function (i) {
      if (i.bulk || !tipoOf(i.tipo)) return;
      var k = i.tipo + '|' + i.ref;
      if (!map[k]) {
        map[k] = { key: k, ref: i.ref, tipo: i.tipo, itens: [], usd: 0 };
        ord.push(k);
      }
      map[k].itens.push(i);
      map[k].usd += i.qty * custoUn(i);
    });
    return ord
      .map(function (k) {
        return map[k];
      })
      .sort(function (a, b) {
        return b.usd - a.usd;
      });
  }
  // Valor contado de uma peça (o digitado, ou o do app se não mexeu).
  function contado(i) {
    var v = S.contVals[S.items.indexOf(i)];
    return v == null ? i.qty : v;
  }
  // Diferenças da contagem em andamento, com valor em custo (US$) e em preço de venda (G$).
  function contagemDifs() {
    var out = [];
    contagemGrupos().forEach(function (g) {
      g.itens.forEach(function (i) {
        var d = contado(i) - i.qty;
        if (!d) return;
        out.push({
          item: i,
          key: g.key,
          dif: d,
          usd: d * custoUn(i),
          gs: d * (tFor(i).price || 0)
        });
      });
    });
    return out;
  }
  // Dias desde a última conferência do produto (null = nunca).
  function diasConf(key) {
    var t = S.conf && S.conf[key];
    return t ? Math.floor((Date.now() - t) / DAY) : null;
  }
  // Tela de contagem (substitui a lista enquanto está aberta).
  function renderContagem() {
    var c = $('contCard');
    c.hidden = !S.cont;
    $('kCont').setAttribute('aria-pressed', !!S.cont);
    $('kCont').style.outline = S.cont ? '2px solid var(--accent)' : '';
    if (!S.cont) return;
    $('listCard').hidden = true;
    $('detail').hidden = true;
    c.textContent = '';
    var gr = contagemGrupos(),
      difs = contagemDifs(),
      tocados = {};
    difs.forEach(function (d) {
      tocados[d.key] = 1;
    });
    Object.keys(S.contOk).forEach(function (k) {
      tocados[k] = 1;
    });
    var nConf = gr.filter(function (g) {
        return tocados[g.key];
      }).length,
      corte = Math.max(1, Math.ceil(gr.length * 0.2)),
      velhos = gr.slice(0, corte).filter(function (g) {
        var d = diasConf(g.key);
        return d == null || d > 10;
      }).length;
    var hd = mk('div', '');
    hd.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px';
    var h2 = mk('h2', '', 'Contagem de estoque');
    h2.style.cssText = 'margin:0;font-size:16px';
    hd.appendChild(h2);
    hd.appendChild(
      btn('tab', 'Fechar', function () {
        S.cont = false;
        S.contSum = false;
        render();
      })
    );
    c.appendChild(hd);
    var hi = mk(
      'div',
      'hint',
      'Conta só o que está no filtro atual (tipo, faixa, busca). Os mais valiosos vêm primeiro. O que você não tocar não muda. ' +
        nConf +
        ' de ' +
        gr.length +
        ' produtos conferidos.' +
        (velhos ? ' ' + velhos + ' dos mais valiosos estão sem conferir há mais de 10 dias.' : '')
    );
    hi.style.margin = '0';
    c.appendChild(hi);
    if (S.contSum) return resumoContagem(c, difs);
    if (!gr.length) c.appendChild(mk('div', 'note n-warn', 'Nenhuma peça com esses filtros.'));
    gr.forEach(function (g) {
      var box = mk('div', 'card col');
      box.style.cssText = 'background:var(--panel2);gap:8px;padding:12px';
      var top = mk('div', '');
      top.style.cssText = 'display:flex;justify-content:space-between;gap:8px;align-items:center';
      var nm = mk('b', '', pn(g.ref));
      top.appendChild(nm);
      var f = faixaOf(g.ref);
      if (f) top.appendChild(faixaTag(f));
      top.appendChild(mk('span', 'hint', usd(g.usd) + ' em custo'));
      top.lastChild.style.cssText = 'margin:0 0 0 auto';
      box.appendChild(top);
      var dc = diasConf(g.key);
      var sub = mk(
        'div',
        'hint',
        dc == null ? 'Nunca conferido' : dc === 0 ? 'Conferido hoje' : 'Conferido há ' + dc + ' dia(s)'
      );
      sub.style.margin = '0';
      box.appendChild(sub);
      g.itens.forEach(function (i) {
        var row = mk('div', 'pl');
        row.style.gridTemplateColumns = 'minmax(0,1fr) auto';
        var v = contado(i),
          lb = mk('span', '', rowLabel(i) + ' · no app: ' + i.qty + ' · ' + usd(custoUn(i)));
        row.appendChild(lb);
        var ctl = mk('div', 'sel');
        var set = function (n) {
          S.contVals[S.items.indexOf(i)] = Math.max(0, n);
          render();
        };
        ctl.appendChild(
          btn('step', '−', function () {
            set(contado(i) - 1);
          })
        );
        var inp = mk('input', 'in');
        inp.inputMode = 'numeric';
        inp.value = v;
        inp.style.cssText =
          'width:64px;min-height:44px;text-align:center;font-weight:800;' +
          (v !== i.qty ? 'border-color:var(--warn)' : '');
        inp.setAttribute('aria-label', 'Contado: ' + rowLabel(i));
        inp.onchange = function () {
          set(toNum(inp.value));
        };
        ctl.appendChild(inp);
        ctl.appendChild(
          btn('step', '+', function () {
            set(contado(i) + 1);
          })
        );
        row.appendChild(ctl);
        box.appendChild(row);
      });
      var okb = btn(
        'chip' + (S.contOk[g.key] ? ' on' : ''),
        S.contOk[g.key] ? 'Conferido ✓' : 'Está tudo certo',
        function () {
          if (S.contOk[g.key]) delete S.contOk[g.key];
          else S.contOk[g.key] = 1;
          render();
        },
        !!S.contOk[g.key]
      );
      okb.style.alignSelf = 'flex-start';
      box.appendChild(okb);
      c.appendChild(box);
    });
    var rv = btn('go', difs.length ? 'Revisar ' + difs.length + ' diferença(s)' : 'Concluir conferência', function () {
      S.contSum = true;
      render();
      window.scrollTo(0, 0);
    });
    rv.disabled = !nConf;
    c.appendChild(rv);
  }
  // Resumo antes de aplicar: o que mudou, em custo e em preço de venda.
  function resumoContagem(c, difs) {
    var tu = 0,
      tg = 0,
      aceitas = 0;
    var box = mk('div', 'split');
    difs.forEach(function (d) {
      var ac = Math.abs(d.usd) <= (S.tolUsd || 0);
      if (ac) aceitas++;
      tu += d.usd;
      tg += d.gs;
      var r = mk('div', 'sl');
      var l = mk('span', '', pn(d.item.ref) + ' · ' + rowLabel(d.item));
      l.appendChild(
        mk(
          'small',
          '',
          'app ' + d.item.qty + ' → contado ' + contado(d.item) + (ac ? ' · dentro da tolerância' : '')
        )
      );
      r.appendChild(l);
      r.appendChild(mk('b', '', (d.dif > 0 ? '+' : '') + d.dif + ' · ' + usd(d.usd)));
      box.appendChild(r);
    });
    if (!difs.length) c.appendChild(mk('div', 'note n-ok', 'Tudo confere com o estoque do app.'));
    else {
      c.appendChild(box);
      c.appendChild(
        mk(
          'div',
          'note ' + (tu < 0 ? 'n-bad' : 'n-info'),
          'Total: ' +
            (tu < 0 ? 'faltam ' : 'sobram ') +
            usd(Math.abs(tu)) +
            ' em custo e ' +
            gs(Math.abs(tg)) +
            ' a preço de venda.' +
            (aceitas ? ' ' + aceitas + ' diferença(s) dentro da tolerância.' : '')
        )
      );
    }
    var bar = mk('div', '');
    bar.style.cssText = 'display:flex;gap:8px';
    var ap = btn('go', 'Aplicar e corrigir o estoque', function () {
      aplicarContagem(difs, tu, tg);
    });
    ap.style.flex = '1';
    bar.appendChild(ap);
    bar.appendChild(
      btn('tab', 'Voltar', function () {
        S.contSum = false;
        render();
      })
    );
    c.appendChild(bar);
  }
  // Aplica as diferenças: corrige o estoque, grava a conferência e o registro de perdas e sobras.
  function aplicarContagem(difs, tu, tg) {
    var ts = Date.now(),
      conf = {};
    difs.forEach(function (d) {
      conf[d.key] = 1;
    });
    Object.keys(S.contOk).forEach(function (k) {
      conf[k] = 1;
    });
    difs.forEach(function (d) {
      var i = d.item;
      S.elog.push({
        ts: ts,
        tipo: i.tipo,
        ref: i.ref,
        cor: i.cor,
        grau: i.grau || '',
        qty: d.dif,
        contagem: true
      });
      i.qty = contado(i);
    });
    Object.keys(conf).forEach(function (k) {
      S.conf[k] = ts;
    });
    S.contagens.push({
      ts: ts,
      difs: difs.length,
      valorUsd: tu,
      vendaGs: tg,
      itens: difs.map(function (d) {
        return { ref: d.item.ref, cor: d.item.cor, dif: d.dif, usd: d.usd };
      })
    });
    S.cont = false;
    S.contSum = false;
    S.contVals = {};
    S.contOk = {};
    S.msg = difs.length
      ? 'Contagem aplicada: ' + difs.length + ' diferença(s), ' + usd(Math.abs(tu)) + (tu < 0 ? ' a menos.' : ' a mais.')
      : 'Conferência registrada: o estoque confere.';
    render();
  }
  S.cont = false;
  S.contSum = false;
  S.contVals = {};
  S.contOk = {};
  // Tocar no cartão "Em estoque" abre/fecha a contagem.
  $('kCont').onclick = function () {
    S.cont = !S.cont;
    S.contSum = false;
    S.contVals = {};
    S.contOk = {};
    if (S.cont) {
      S.lotesView = false;
      S.repo = false;
      S.open = '';
      S.det = false;
      S.selItem = null;
    }
    render();
    window.scrollTo(0, 0);
  };
