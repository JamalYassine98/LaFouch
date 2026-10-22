  function renderVendas() {
    renderCatV();
    if (S.view !== 'vendas') return;
    var qm = mkMatch(S.vq),
      all = S.items.filter(function (i) {
        return (
          i.qty > 0 &&
          TIPOS.some(function (x) {
            return x.id === i.tipo;
          }) &&
          (S.vTipo === 'all' || i.tipo === S.vTipo) &&
          (!qm || qm(i))
        );
      });
    var vt = $('vTipos');
    vt.textContent = '';
    [{ id: 'all', label: 'Todos' }].concat(TIPOS).forEach(function (x) {
      vt.appendChild(
        btn(
          'chip' + (S.vTipo === x.id ? ' on' : ''),
          x.label,
          function () {
            S.vTipo = x.id;
            S.vRef = '';
            S.vSel = null;
            S.qty = 1;
            S.msg = '';
            render();
          },
          S.vTipo === x.id
        )
      );
    });
    var groups = {},
      order = [];
    all.forEach(function (i) {
      var k = i.tipo + '|' + i.ref;
      if (!groups[k]) {
        groups[k] = [];
        order.push(k);
      }
      groups[k].push(i);
    });
    order.sort();
    if (!groups[S.vRef]) {
      S.vRef = '';
      S.vSel = null;
    }
    var rows = $('vRows');
    rows.textContent = '';
    order.forEach(function (k) {
      var g = groups[k],
        f = g[0],
        tp = tipoOf(f.tipo),
        tot = sum(g);
      var card = btn(
        'pcard' + (k === S.vRef ? ' on' : ''),
        '',
        function () {
          if (S.vRef === k) {
            S.vRef = '';
            S.vSel = null;
            S.qty = 1;
            S.msg = '';
            render();
            return;
          }
          S.vRef = k;
          S.vSel = null;
          S.qty = 1;
          S.msg = '';
          render();
          $('vLinesB').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },
        k === S.vRef
      );
      card.appendChild(photoBox(photoOf(f.ref), 'pbox'));
      card.appendChild(mk('b', '', pn(f.ref)));
      if (S.pnome && S.pnome[f.ref]) card.appendChild(mk('span', 's', 'Código ' + f.ref));
      card.appendChild(
        mk(
          'span',
          's',
          tp.label +
            (f.tipo === 'pre'
              ? ''
              : (f.fmt && !f.bulk ? ' · ' + f.fmt : '') +
                (!tp.simple && f.med ? ' · ' + f.med : ''))
        )
      );
      var stt = mk('span', 'cell ' + (tot <= 2 ? 'low' : ''), tot + ' em estoque');
      stt.style.alignSelf = 'flex-start';
      card.appendChild(stt);
      rows.appendChild(card);
    });
    if (!order.length)
      rows.appendChild(
        mk(
          'div',
          'note n-warn',
          S.vq.trim() || S.vTipo !== 'all'
            ? 'Nenhuma peça em estoque com essa busca.'
            : 'Não há peças em estoque. Dê entrada na aba Estoque.'
        )
      );
    var lines = (groups[S.vRef] || []).slice();
    if (lines.length && lines[0].tipo === 'pre')
      lines.sort(function (a, b) {
        return parseFloat(a.grau) - parseFloat(b.grau);
      });
    var sel = lines.indexOf(S.vSel) >= 0 ? S.vSel : lines[0] || null;
    S.vSel = sel;
    var lineLabel = function (i) {
      return i.tipo === 'pre'
        ? i.grau + ' · ' + i.cor
        : isSimple(i.tipo)
          ? i.cor
          : i.vr + ' ' + i.cor;
    };
    $('vLinesB').hidden = !lines.length;
    if (lines.length) $('vProdL').textContent = 'Escolha a variante de ' + lines[0].ref;
    var vl = $('sLines');
    vl.textContent = '';
    lines.forEach(function (i) {
      var b = btn(
        'seg' + (i === sel ? ' on' : ''),
        '',
        function () {
          S.vSel = i;
          S.qty = 1;
          S.msg = '';
          render();
        },
        i === sel
      );
      var l = mk('span', '');
      l.style.cssText = 'display:inline-flex;align-items:center;gap:6px';
      var fk = S.fotos[i.ref + '|' + i.cor];
      if (fk) {
        var im = mk('img');
        im.src = fk;
        im.alt = 'Foto ' + i.ref;
        l.appendChild(im);
      }
      l.appendChild(dot(hexOf(i.cor)));
      l.appendChild(document.createTextNode(lineLabel(i)));
      b.appendChild(l);
      b.appendChild(
        mk(
          'span',
          'n',
          (i.tipo === 'pre' || !i.fmt || i.bulk ? '' : i.fmt + ' · ') + i.qty + ' disp.'
        )
      );
      vl.appendChild(b);
    });
    var t = sel ? tipoOf(sel.tipo) : null,
      max = sel ? sel.qty : 0;
    S._vcap = Math.max(max, 1);
    S.qty = Math.max(1, Math.min(S.qty, S._vcap));
    S._vsel = sel;
    $('spc').textContent = sel
      ? t.full + ' › ' + sel.ref + ' › ' + lineLabel(sel)
      : 'Escolha uma peça na lista.';
    $('sqv').value = S.qty;
    var st = $('sst');
    st.textContent = '';
    st.className = '';
    function note(c, tx) {
      st.className = 'note ' + c;
      st.textContent = tx;
    }
    if (!sel) note('n-warn', 'Escolha uma peça para vender.');
    else if (max === 0) note('n-bad', 'Sem estoque dessa peça. Venda travada.');
    else if (S.qty >= max) note('n-warn', 'Limite: só há ' + max + ' dessa peça.');
    else note('n-ok', 'Disponível: pode vender até ' + max + ' un.');
    $('sumB').hidden = !sel;
    if (sel) {
      S._t = tFor(sel);
      S._selKey = [sel.tipo, sel.ref, sel.cor, sel.grau, sel.vr].join('/');
      $('unit').textContent = t.price
        ? 'Preço unit. G$ ' + dots(t.price) + ' (exemplo)'
        : 'Preço livre: digite abaixo o valor recebido';
      $('tot').textContent = t.price ? 'G$ ' + dots(t.price * S.qty) : '';
      renderMoeda();
    }
    $('sgo').disabled = !sel || max <= 0;
    $('vmsg').textContent = S.msg || '';
  }
  $('vq').oninput = function (e) {
    S.vq = e.target.value;
    S.vRef = '';
    S.vSel = null;
    S.qty = 1;
    render();
  };
  /* ===== ler o código impresso na haste (OCR no aparelho) ===== */
