  // ===== Carrinho: várias peças numa venda só; o piso vale para o total, não para cada peça. =====
  S.cart = [];
  S.cartOpen = false;
  var cartSeq = 0;

  // Preço combinado de uma linha (padrão: tabela × quantidade).
  function cartLinhaPreco(l) {
    return l.preco != null ? l.preco : tFor(l.it).price * l.qty;
  }
  function cartSub() {
    return S.cart.reduce(function (a, l) {
      return a + cartLinhaPreco(l);
    }, 0);
  }
  function cartPecas() {
    return S.cart.reduce(function (a, l) {
      return a + l.qty;
    }, 0);
  }
  function cartDesc(l) {
    return l.qty + '× ' + l.it.ref + ' ' + (l.it.tipo === 'pre' ? l.it.grau : l.it.vr || '') + ' · ' + l.it.cor;
  }
  // Tira linhas sem estoque e ajusta quantidades que passaram do disponível.
  function cartLimpa() {
    S.cart = S.cart.filter(function (l) {
      if (l.it.qty <= 0) return false;
      l.qty = Math.min(l.qty, l.it.qty);
      return true;
    });
    if (!S.cart.length) S.cartOpen = false;
  }
  // Prévia do carrinho: piso, trava e lucro livre sobre o total.
  function cartPrevia() {
    var pt = pagTotais(),
      eff = pt.liq,
      br = S.vBrinde && S.vBrinde.qty > 0 ? S.vBrinde : null,
      bu = br ? brindeUsd(br) : 0,
      bg = Math.round(bu * S.fx.pyg),
      fm = formaSel(),
      tx = taxaGs(pt.rec, fm),
      sub = cartSub(),
      livre = 0,
      piso = 0,
      trava = 0,
      cp = contasPeca(),
      pct = colchao().pct;
    S.cart.forEach(function (l, i) {
      var w = sub > 0 ? cartLinhaPreco(l) / sub : 1 / S.cart.length,
        pp = pisoPeca(l.it);
      livre += calcSale(tFor(l.it), l.qty, S.fx.pyg, pct, cp, S.melhPeca, Math.round(eff * w), i === 0 ? bu : 0).livre;
      piso += pp.piso * l.qty;
      trava += pp.trava * l.qty;
    });
    livre -= tx;
    var liq = eff - tx;
    return {
      eff: eff,
      liq: liq,
      tx: tx,
      fm: fm,
      c: { livre: livre },
      br: br,
      bu: bu,
      pp: null,
      travaTot: trava + bg,
      pisoTot: piso + bg,
      perde: liq < trava + bg,
      abaixo: liq < piso + bg,
      key: ['cart', cartPecas(), eff, S.moeda, fm.id, br ? br.ref + br.cor : ''].join('|')
    };
  }
  // Painel do carrinho + faixa "Carrinho" na lista; liga a tela de pagamento ao total.
  function carrinhoRender() {
    var bar = $('cartBar'),
      card = $('cartCard');
    if (!bar) {
      var ref = $('vListCard');
      bar = mk('section', 'card');
      bar.id = 'cartBar';
      bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between';
      card = mk('section', 'card col');
      card.id = 'cartCard';
      card.setAttribute('aria-label', 'Carrinho');
      ref.parentNode.insertBefore(card, ref);
      ref.parentNode.insertBefore(bar, card);
    }
    cartLimpa();
    var emVendas = S.view === 'vendas';
    bar.hidden = !(emVendas && S.cart.length && !S.cartOpen);
    card.hidden = !(emVendas && S.cartOpen);
    if (!bar.hidden)
      bar.innerHTML =
        '<div><b>Carrinho: ' + cartPecas() + ' peça(s)</b><div class="hint" style="margin:2px 0 0">' + gs(cartSub()) + ' pela tabela dos preços combinados</div></div>' +
        '<button type="button" class="mini" data-act="cartopen">Abrir carrinho</button>';
    $('sCartAdd').hidden = S.cartOpen || !S._vsel;
    // venda de uma peça só escolhe e adiciona; pagamento e finalização ficam no carrinho
    $('payB').hidden = !S.cartOpen;
    $('sgo').hidden = !S.cartOpen;
    $('qtyB').hidden = !!S.cartOpen;
    if (!S.cartOpen || !emVendas) return;
    // modo carrinho: usa a tela de pagamento da venda com o total do carrinho
    $('vListCard').hidden = true;
    $('vDetail').hidden = true;
    $('vSaleCard').hidden = false;
    $('catV').hidden = true;
    $('spc').textContent = 'Carrinho com ' + S.cart.length + ' produto(s)';
    $('sst').textContent = '';
    $('sst').className = '';
    $('sumB').hidden = false;
    if (!card.contains(document.activeElement) || !document.activeElement.matches('input')) cartPainel(card);
    carrinhoSync();
  }
  function cartPainel(card) {
    var h =
      '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><h2 style="margin:0;font-size:18px">Carrinho</h2><button type="button" class="chip" data-act="cartclose">+ Continuar escolhendo</button></div>' +
      '<div class="hint" style="margin:0">O piso é conferido sobre o total. Você pode mudar o preço de uma peça (desconto maior numa, menos em outra) e o app confere se o total ainda cobre tudo.</div><div class="split">';
    S.cart.forEach(function (l, i) {
      var pp = pisoPeca(l.it),
        tab = tFor(l.it).price * l.qty,
        v = cartLinhaPreco(l);
      h +=
        '<div class="sl" style="flex-wrap:wrap;gap:8px"><span style="flex:1 1 180px">' + esc(cartDesc(l)) +
        '<small>Tabela ' + gs(tab) + ' · piso ' + gs(pp.piso * l.qty) + '</small></span>' +
        '<span style="display:flex;gap:6px;align-items:center"><button type="button" class="step" style="min-height:36px;width:36px" data-act="cartmn" data-id="' + i + '" aria-label="Menos uma peça">−</button>' +
        '<button type="button" class="step" style="min-height:36px;width:36px" data-act="cartpl" data-id="' + i + '" aria-label="Mais uma peça">+</button></span>' +
        '<input class="in" inputmode="' + mpMode() + '" data-in="cartpreco" data-id="' + i + '" value="' + gsParaCampo(v) + '" aria-label="Preço combinado de ' + esc(cartDesc(l)) + ' em ' + mpSim() + '" style="flex:0 1 130px;width:130px">' +
        '<button type="button" class="chip" data-act="cartrm" data-id="' + i + '" aria-label="Tirar do carrinho">×</button></div>';
    });
    h += '</div><div class="sum"><span class="hint" style="margin:0">Soma dos preços combinados</span><b id="cartSub">' + gs(cartSub()) + '</b></div>' +
      '<div><button type="button" class="chip" data-act="cartclear">Esvaziar carrinho</button></div>';
    card.innerHTML = h;
  }
  // Recalcula total, desconto, pagamento e aviso de piso (sem refazer o painel).
  function carrinhoSync() {
    var sub = cartSub();
    S.qty = 1;
    S._vsel = null;
    S._selKey = 'cart';
    S._t = { price: sub, id: 'cart:' + sub + ':' + S.cart.length };
    S.descGs = descontoGs(sub);
    var cs = $('cartSub');
    if (cs) cs.textContent = gs(sub);
    $('unit').textContent = 'Carrinho · ' + cartPecas() + ' peça(s)';
    $('tot').textContent = gs(sub - S.descGs);
    renderDescBrinde(null);
    renderMoeda();
    renderPiso();
    $('sgo').disabled = !S.cart.length;
  }
  // Reparte um valor em frações (soma exata; a última linha leva o resto).
  function cartParte(v, fr, dec) {
    var f = dec ? 100 : 1,
      out = [],
      acc = 0;
    fr.forEach(function (x, i) {
      var p = i === fr.length - 1 ? Math.round(v * f) / f - acc : Math.round(v * x * f) / f;
      p = Math.round(p * f) / f;
      acc += p;
      out.push(p);
    });
    return out;
  }
  function cartFinalizar() {
    cartLimpa();
    if (!S.cart.length) return;
    if (!(pagTotais().rec > 0)) {
      say('Informe o valor recebido.');
      render();
      return;
    }
    var pv = cartPrevia();
    if (pv.abaixo && S.pisoConf !== pv.key) {
      S.pisoConf = pv.key;
      renderPiso();
      return;
    }
    var sub = cartSub(),
      fr = S.cart.map(function (l) {
        return sub > 0 ? cartLinhaPreco(l) / sub : 1 / S.cart.length;
      }),
      pg = pagPayload(),
      m = S.moeda,
      dec = function (mm) {
        return mm !== 'pyg';
      },
      recs = cartParte(S._recv, fr, dec(m)),
      exs = (pg.extra || []).map(function (x) {
        return cartParte(x.v, fr, dec(x.moeda));
      }),
      trs = (pg.troco || []).map(function (x) {
        return cartParte(x.v, fr, dec(x.moeda));
      }),
      br = pv.br,
      cartId = 'C-' + Date.now() + '-' + ++cartSeq,
      vendas = [];
    if (br) br.qty -= 1;
    S.cart.forEach(function (l, i) {
      var it = l.it;
      it.qty -= l.qty;
      var sg =
        it.lote &&
        S.grp.filter(function (x) {
          return x.id === it.lote;
        })[0];
      if (sg) {
        sg.sold = (sg.sold || 0) + l.qty;
        if (it.custo != null && !it.bulk) {
          sg.ownQ = (sg.ownQ || 0) + l.qty;
          sg.ownC = (sg.ownC || 0) + l.qty * it.custo;
        }
      }
      var s = addSale(it, l.qty, {
        moeda: m,
        forma: S.forma,
        recebido: recs[i],
        pag: {
          rate: pg.rate,
          extra: (pg.extra || []).map(function (x, j) {
            return { moeda: x.moeda, v: exs[j][i], rate: x.rate };
          }).filter(function (x) {
            return x.v > 0;
          }),
          troco: (pg.troco || []).map(function (x, j) {
            return { moeda: x.moeda, v: trs[j][i], rate: x.rate };
          }).filter(function (x) {
            return x.v > 0;
          })
        },
        brinde:
          i === 0 && br
            ? { tipo: br.tipo, ref: br.ref, cor: br.cor, grau: br.grau || '', vr: br.vr || '', lote: br.lote || '', usd: pv.bu }
            : null,
        motivo: pv.abaixo ? S.vMotivo || '' : ''
      });
      s.carrinho = cartId;
      s.abaixo = pv.abaixo;
      s.perde = pv.perde;
      vendas.push(s);
    });
    // resumo único para a tela "para onde foi o dinheiro"
    var agg = { id: vendas.map(function (s) { return s.id; }).join(', '), moeda: m, recebido: S._recv, pct: vendas[0].pct, qty: 0 };
    ['price', 'rep', 'repUSD', 'contas', 'colch', 'melh', 'taxa', 'livre', 'trava'].forEach(function (k) {
      agg[k] = vendas.reduce(function (a, s) {
        return a + (s[k] || 0);
      }, 0);
    });
    vendas.forEach(function (s) {
      agg.qty += s.qty;
    });
    agg.ref = 'Carrinho';
    agg.cor = '';
    agg.tipo = 'x';
    agg.vr = '';
    var n = S.cart.length;
    S.cart = [];
    S.cartOpen = false;
    S.pisoConf = '';
    S.forma = 'din';
    pagReset();
    S.descTxt = '';
    S.vBrinde = null;
    S.vMotivo = '';
    S.rec = null;
    say('Venda registrada: carrinho com ' + n + ' produto(s)');
    render();
    showSplit(agg);
    $('splitH').textContent = 'Carrinho com ' + n + ' produto(s), ' + agg.qty + ' peça(s), por ' + gs(agg.price) + ' (vendas ' + agg.id + ')';
    $('splitNote').textContent =
      'Preço mínimo seguro (trava) do carrinho: ' + gs(agg.trava) + '. Vendido por ' + gs(agg.price) + ', ' + (agg.livre >= 0 ? 'então o preço está seguro.' : 'abaixo do seguro. Veja a aba Dashboard.') + ' Cada peça foi gravada no Histórico.';
  }
  // Botão "Adicionar ao carrinho".
  $('sCartAdd').onclick = function () {
    var sel = S._vsel;
    if (!sel || sel.qty <= 0) return;
    var q = Math.min(S.qty, sel.qty),
      lista = tFor(sel).price * q,
      ex = S.cart.filter(function (l) {
        return l.it === sel;
      })[0];
    if (ex) {
      ex.qty = Math.min(sel.qty, ex.qty + q);
      if (ex.preco != null) ex.preco += lista - (S.descGs || 0);
    } else
      S.cart.push({ it: sel, qty: q, preco: S.descGs > 0 ? Math.max(0, lista - S.descGs) : null });
    S.vRef = '';
    S.vSel = null;
    S.qty = 1;
    S.descTxt = '';
    S.vBrinde = null;
    S.vMotivo = '';
    S.rec = null;
    S.msg = 'Adicionado ao carrinho.';
    render();
    window.scrollTo(0, 0);
  };
  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (!t.getAttribute || t.getAttribute('data-in') !== 'cartpreco') return;
    var l = S.cart[+t.getAttribute('data-id')];
    if (!l) return;
    l.preco = campoParaGs(t.value);
    S.rec = null;
    carrinhoSync();
  });
  ACT.cartopen = function () {
    S.cartOpen = true;
    S.rec = null;
    render();
    window.scrollTo(0, 0);
  };
  ACT.cartclose = function () {
    S.cartOpen = false;
    render();
  };
  ACT.cartclear = function () {
    S.cart = [];
    S.cartOpen = false;
    render();
  };
  ACT.cartrm = function (id) {
    S.cart.splice(+id, 1);
    S.rec = null;
    render();
  };
  ACT.cartmn = function (id) {
    var l = S.cart[+id];
    if (!l) return;
    if (l.qty > 1) {
      if (l.preco != null) l.preco = Math.round((l.preco * (l.qty - 1)) / l.qty);
      l.qty--;
    }
    S.rec = null;
    render();
  };
  ACT.cartpl = function (id) {
    var l = S.cart[+id];
    if (!l || l.qty >= l.it.qty) return;
    if (l.preco != null) l.preco = Math.round((l.preco * (l.qty + 1)) / l.qty);
    l.qty++;
    S.rec = null;
    render();
  };
