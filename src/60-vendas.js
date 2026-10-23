  // ===== Aba Vendas. =====
  // Aba Vendas.
  function renderVendas() {
    renderCatV();
    if (S.cartOpen) {
      S.vRef = '';
      S.vSel = null;
    }
    if (S.view !== 'vendas') return;
    var qm = mkMatch(S.vq),
      all = S.items.filter(function (i) {
        return (
          i.qty > 0 &&
          TIPOS.some(function (x) {
            return x.id === i.tipo;
          }) &&
          (S.vTipo === 'all' || i.tipo === S.vTipo) &&
          (!S.vFaixa || (faixaOf(i.ref) || {}).id === S.vFaixa) &&
          (!qm || qm(i))
        );
      });
    $('vFiltPanel').hidden = !S.vFilt;
    $('vBtnFilt').setAttribute('aria-pressed', !!S.vFilt);
    $('vBtnFilt').classList.toggle('on', !!S.vFilt || S.vTipo !== 'all' || !!S.vFaixa);
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
    var vf = $('vFaixas');
    vf.textContent = '';
    $('vFaixaB').hidden = !S.faixas.length;
    [{ id: '', nome: 'Todas' }].concat(S.faixas).forEach(function (x) {
      vf.appendChild(
        btn(
          'chip' + ((S.vFaixa || '') === x.id ? ' on' : ''),
          x.nome,
          function () {
            S.vFaixa = x.id;
            S.vRef = '';
            S.vSel = null;
            S.qty = 1;
            render();
          },
          (S.vFaixa || '') === x.id
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
          S.detRow = null;
          S.detCor = '';
          render();
          window.scrollTo(0, 0);
        },
        k === S.vRef
      );
      card.appendChild(photoBox(photoOf(f.ref), 'pbox'));
      card.appendChild(mk('b', '', pn(f.ref)));
      var fxa = faixaOf(f.ref);
      if (fxa) {
        var ft = faixaTag(fxa);
        ft.style.alignSelf = 'flex-start';
        card.appendChild(ft);
      }
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
    // produto aberto: a mesma tela do catálogo, em modo venda; a lista some
    $('vListCard').hidden = !!S.vRef;
    $('vSaleCard').hidden = !S.vRef;
    $('catV').hidden = !!S.vRef;
    if (S.vRef && groups[S.vRef]) {
      var dsel = renderDetail(groups[S.vRef][0].ref, {
        venda: true,
        host: $('vDetail'),
        tipo: groups[S.vRef][0].tipo
      });
      if (dsel) S.vSel = dsel;
    } else renderDetail('', { venda: true, host: $('vDetail') });
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
    $('vLinesB').hidden = true;
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
      if (S._descKey !== S._selKey) {
        S._descKey = S._selKey;
        S.descTxt = '';
        S.vBrinde = null;
        S.vMotivo = '';
      }
      var pt = S._t.price,
        lista = pt * S.qty;
      S.descGs = descontoGs(lista);
      var fxs = faixaOf(sel.ref);
      $('unit').textContent = pt
        ? 'Preço unit. ' + gs(pt) + (fxs ? ' (faixa ' + fxs.nome + ')' : ' (exemplo)')
        : 'Preço livre: digite abaixo o valor recebido';
      $('tot').textContent = pt ? gs(lista - S.descGs) : '';
      renderDescBrinde(sel);
      renderMoeda();
      renderPiso();
    }
    $('sgo').disabled = !sel || max <= 0;
    $('vmsg').textContent = S.msg || '';
    carrinhoRender();
  }
  // Desconto, brinde e motivo da venda.
  function renderDescBrinde(sel) {
    var dm = $('descModes');
    dm.textContent = '';
    [
      ['pyg', mpSim()],
      ['pct', '%']
    ].forEach(function (o) {
      dm.appendChild(
        btn(
          'chip' + ((S.descMode || 'pyg') === o[0] ? ' on' : ''),
          o[1],
          function () {
            S.descMode = o[0];
            S.descTxt = '';
            S.rec = null;
            render();
          },
          (S.descMode || 'pyg') === o[0]
        )
      );
    });
    if ($('descIn').value !== (S.descTxt || '')) $('descIn').value = S.descTxt || '';
    $('descH').textContent = S.descGs
      ? 'Desconto de ' + gs(S.descGs) + ' sobre o preço de tabela.'
      : '';
    var bl = brindesDisp().filter(function (x) {
      return x !== sel;
    });
    $('brB').hidden = !bl.length;
    var bc = $('brChips');
    bc.textContent = '';
    if (S.vBrinde && bl.indexOf(S.vBrinde) < 0) S.vBrinde = null;
    bc.appendChild(
      btn(
        'chip' + (!S.vBrinde ? ' on' : ''),
        'Sem brinde',
        function () {
          S.vBrinde = null;
          S.rec = null;
          render();
        },
        !S.vBrinde
      )
    );
    bl.forEach(function (x) {
      bc.appendChild(
        btn(
          'chip' + (S.vBrinde === x ? ' on' : ''),
          tipoOf(x.tipo).label + ' ' + x.ref + ' · ' + x.cor + ' · ' + usd(brindeUsd(x)),
          function () {
            S.vBrinde = x;
            S.rec = null;
            render();
          },
          S.vBrinde === x
        )
      );
    });
    var mc = $('motChips');
    mc.textContent = '';
    ['Isca ou combo', 'Liquidação', 'Cliente fiel', 'Outro'].forEach(function (m) {
      mc.appendChild(
        btn(
          'chip' + (S.vMotivo === m ? ' on' : ''),
          m,
          function () {
            S.vMotivo = S.vMotivo === m ? '' : m;
            render();
          },
          S.vMotivo === m
        )
      );
    });
  }
  // Prévia da venda: custo, trava, piso e lucro com o valor digitado.
  function vendaPrevia() {
    if (S.cartOpen) return cartPrevia();
    var sel = S._vsel,
      t = S._t;
    if (!sel || !t) return null;
    var q = Math.max(1, S.qty),
      pt = pagTotais(),
      eff = pt.liq,
      br = S.vBrinde && S.vBrinde.qty > 0 ? S.vBrinde : null,
      bu = br ? brindeUsd(br) : 0,
      bg = Math.round(bu * S.fx.pyg),
      pp = pisoPeca(sel),
      c = calcSale(t, q, S.fx.pyg, colchao().pct, contasPeca(), S.melhPeca, eff, bu),
      travaTot = pp.trava * q + bg,
      pisoTot = pp.piso * q + bg,
      fm = formaSel(),
      tx = taxaGs(pt.rec, fm),
      liq = eff - tx;
    c.livre -= tx;
    return {
      eff: eff,
      liq: liq,
      tx: tx,
      fm: fm,
      c: c,
      br: br,
      bu: bu,
      pp: pp,
      travaTot: travaTot,
      pisoTot: pisoTot,
      perde: liq < travaTot,
      abaixo: liq < pisoTot,
      key: [S._selKey, q, eff, S.moeda, fm.id, br ? br.ref + br.cor : ''].join('|')
    };
  }
  // Aviso de piso: mostra o lucro ou a perda e pede confirmação se estiver abaixo.
  function renderPiso() {
    var el = $('pisoSt'),
      v = (S._vp = vendaPrevia());
    el.textContent = '';
    el.className = '';
    $('motB').hidden = !(v && v.abaixo);
    $('sgo').textContent = 'Finalizar venda';
    if (!v || !(v.eff > 0)) return;
    var fx = S.cartOpen ? null : faixaOf(S._vsel.ref),
      bt = v.br ? ' (já contando o brinde)' : '';
    if (v.perde) {
      el.className = 'note n-bad';
      el.textContent =
        'Abaixo da trava: você perde ' + gs(v.travaTot - v.liq) + ' nesta venda' + bt + (v.tx ? ' (já descontada a taxa de ' + gs(v.tx) + ')' : '') + '.';
    } else if (v.abaixo) {
      el.className = 'note n-warn';
      el.textContent =
        'Abaixo do piso' +
        (fx ? ' da faixa ' + fx.nome + ' (margem mínima ' + fx.margem + '%)' : '') +
        ': piso ' +
        gs(v.pisoTot) +
        '. Lucro livre estimado ' +
        gs(v.c.livre) +
        bt +
        '.';
    } else {
      el.className = 'note n-ok';
      el.textContent =
        'Acima do piso. Lucro livre estimado: ' +
        gs(v.c.livre) +
        bt +
        (v.tx ? '. Taxa da ' + v.fm.nome.toLowerCase() + ': ' + gs(v.tx) + ' (já descontada)' : '') +
        '.';
    }
    if (v.abaixo) {
      var ok = S.pisoConf === v.key;
      $('sgo').textContent = ok ? 'Vender mesmo assim' : 'Finalizar venda (abaixo do piso)';
      if (ok) el.textContent += ' Toque de novo para confirmar.';
    }
  }
  $('descIn').oninput = function (e) {
    S.descTxt = e.target.value;
    S.rec = null;
    render();
  };
  $('vq').oninput = function (e) {
    S.vq = e.target.value;
    S.vRef = '';
    S.vSel = null;
    S.qty = 1;
    render();
  };
  /* ===== ler o código impresso na haste (OCR no aparelho) ===== */
