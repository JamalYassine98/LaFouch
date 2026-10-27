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
          (!S.vGrau || S.vTipo !== 'pre' || i.grau === S.vGrau) &&
          (!S.vFaixa || (faixaOf(i.ref) || {}).id === S.vFaixa) &&
          (!qm || qm(i))
        );
      });
    $('vFiltPanel').hidden = !S.vFilt;
    $('vBtnFilt').setAttribute('aria-pressed', !!S.vFilt);
    $('vBtnFilt').classList.toggle('on', !!S.vFilt || !!S.vFaixa || S.vTipo !== 'all' || !!S.vMais);
    // abas de tipo (sempre à vista) e fileira de graus nos pré-graduados
    var vtb = $('vTabs');
    vtb.textContent = '';
    vtb.appendChild(
      btn('chip' + (S.vTipo === 'all' && !S.vMais ? ' on' : ''), 'Todos', function () {
        S.vTipo = 'all';
        S.vMais = false;
        S.vGrau = '';
        S.vRef = '';
        S.vSel = null;
        render();
      }, S.vTipo === 'all' && !S.vMais)
    );
    vtb.appendChild(
      btn('chip' + (S.vMais ? ' on' : ''), 'Mais vendidos', function () {
        S.vMais = !S.vMais;
        S.vRef = '';
        S.vSel = null;
        render();
      }, !!S.vMais)
    );
    var ordTab = ['sem', 'solar', 'pre'];
    TIPOS.slice()
      .sort(function (a, b) {
        var ia = ordTab.indexOf(a.id),
          ib = ordTab.indexOf(b.id);
        return (ia < 0 ? 9 : ia) - (ib < 0 ? 9 : ib);
      })
      .forEach(function (x) {
      vtb.appendChild(
        btn(
          'chip' + (S.vTipo === x.id ? ' on' : ''),
          x.label,
          function () {
            S.vMais = false;
            S.vTipo = S.vTipo === x.id ? 'all' : x.id;
            S.vGrau = '';
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
    var vgb = $('vGradesB'),
      vg = $('vGrades');
    vg.textContent = '';
    vgb.hidden = S.vTipo !== 'pre';
    if (S.vTipo === 'pre') {
      var gmap = {};
      S.items.forEach(function (i) {
        if (i.tipo !== 'pre' || !i.grau) return;
        var o = gmap[i.grau] || (gmap[i.grau] = { refs: {}, n: 0 });
        if (i.qty > 0 && !o.refs[i.ref]) {
          o.refs[i.ref] = 1;
          o.n++;
        }
      });
      Object.keys(gmap)
        .sort(function (a, b) {
          return parseFloat(a) - parseFloat(b);
        })
        .forEach(function (g0) {
          var o = gmap[g0],
            on = S.vGrau === g0,
            cb = btn(
              'chip' + (on ? ' on' : '') + (o.n ? '' : ' off'),
              '',
              function () {
                if (!o.n) return;
                S.vGrau = on ? '' : g0;
                S.vRef = '';
                S.vSel = null;
                S.qty = 1;
                render();
              },
              on
            );
          cb.appendChild(document.createTextNode(g0));
          cb.appendChild(mk('small', '', o.n ? String(o.n) : 'esgotado'));
          vg.appendChild(cb);
        });
    }
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
    if (S.vMais) {
      var vend = {};
      S.sales.forEach(function (x) {
        if (!x.estorno && x.ref) vend[x.ref] = (vend[x.ref] || 0) + (x.qty || 1);
      });
      order.sort(function (a, b) {
        return (vend[b.split('|')[1]] || 0) - (vend[a.split('|')[1]] || 0);
      });
    }
    if (!groups[S.vRef]) {
      S.vRef = '';
      S.vSel = null;
    }
    var rows = $('vRows');
    rows.textContent = '';
    rows.classList.toggle('vlist', modoDe('v') === 'l');
    modoBtn($('vModo'), 'v');
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
      card.dataset.ref = f.ref;
      card.appendChild(photoBox(photoOf(f.ref), 'pbox'));
      card.appendChild(mk('b', '', pn(f.ref)));
      card.appendChild(mk('i', 'vplus', '+'));
      var pr0 = tFor(f).price;
      if (pr0) {
        var pp = mk('b', '', gs(pr0));
        pp.style.color = 'var(--ok)';
        card.appendChild(pp);
      }
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
    $('vSaleCard').hidden = true; // quantidade e botão Vender ficam na barra fixa do produto
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
      max = sel ? gQty(sel) : 0;
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
        if (!S.cart.length) {
          S.vBrinde = null;
          S.vMotivo = '';
        }
      }
      var pt = S._t.price,
        lista = pt * S.qty;
      var fxs = faixaOf(sel.ref);
      $('unit').textContent = pt
        ? 'Preço unit. ' + gs(pt) + (fxs ? ' (faixa ' + fxs.nome + ')' : ' (exemplo)')
        : 'Preço livre: digite abaixo o valor recebido';
      $('tot').textContent = pt ? gs(lista) : '';
      renderBrindeMotivo(sel);
    }
    $('vmsg').textContent = S.msg || '';
    carrinhoRender();
  }
  // Brinde e motivo do desconto da venda.
  function renderBrindeMotivo(sel) {
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
  }
  // Aviso de piso: mostra o lucro ou a perda e pede confirmação se estiver abaixo.
  function renderPiso() {
    var el = $('pisoSt'),
      v = cartPrevia();
    el.textContent = '';
    el.className = '';
    $('sgo').textContent = 'Finalizar venda';
    if (!v || !(v.eff > 0)) return;
    var bt = v.br ? ' (já contando o brinde)' : '';
    if (v.perde) {
      el.className = 'note n-bad';
      el.textContent =
        'Abaixo da trava: você perde ' + gs(v.travaTot - v.liq) + ' nesta venda' + bt + (v.tx ? ' (já descontada a taxa de ' + gs(v.tx) + ')' : '') + '.';
    } else if (v.abaixo) {
      el.className = 'note n-warn';
      el.textContent =
        'Abaixo do piso: piso ' +
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
    }
  }
  $('vq').oninput = function (e) {
    S.vq = e.target.value;
    S.vGrau = S.vq.trim() ? '' : S.vGrau;
    S.vRef = '';
    S.vSel = null;
    S.qty = 1;
    render();
  };
  /* ===== ler o código impresso na haste (OCR no aparelho) ===== */
