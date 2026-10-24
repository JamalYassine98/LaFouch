  // ===== Carrinho: várias peças numa venda só; o piso vale para o total, não para cada peça. =====
  S.cart = [];
  S.cartOpen = false;
  S.cartStep = 'pag'; // 'ped' = tela do pedido; 'pag' = tela de pagamento
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
      card.setAttribute('aria-label', 'Pedido');
      ref.parentNode.insertBefore(card, ref);
      ref.parentNode.insertBefore(bar, card);
    }
    cartLimpa();
    var emVendas = S.view === 'vendas';
    var ped = !!S.cartOpen && S.cartStep === 'ped',
      pag = !!S.cartOpen && !ped;
    bar.hidden = !(emVendas && S.cart.length && !S.cartOpen);
    card.hidden = !(emVendas && ped);
    $('pagHead').hidden = !(emVendas && pag);
    if (!bar.hidden)
      bar.innerHTML =
        '<div style="display:flex;gap:4px;flex:0 0 auto">' + cartFoto(S.cart[0], 40) + '</div><div style="flex:1 1 140px"><b>Pedido: ' + cartPecas() + ' peça(s)</b><div class="hint" style="margin:2px 0 0">' + gs(cartSub()) + ' pelos preços combinados</div></div>' +
        '<button type="button" class="mini" data-act="cartopen">Pedidos</button>';
    $('sCartAdd').hidden = S.cartOpen || !S._vsel;
    // a peça é escolhida e adicionada ao pedido; pagamento e finalização ficam na tela de pagamento
    // (o desconto não tem campo: é o que falta do valor recebido, confirmado ao finalizar)
    $('payB').hidden = !S.cartOpen;
    $('sgo').hidden = !S.cartOpen;
    $('qtyB').hidden = !!S.cartOpen;
    if (!S.cartOpen || !emVendas) return;
    // modo carrinho: usa a tela de pagamento da venda com o total do carrinho
    $('vListCard').hidden = true;
    $('vDetail').hidden = true;
    $('vSaleCard').hidden = !pag;
    $('catV').hidden = true;
    $('spc').textContent = '';
    $('sst').textContent = '';
    $('sst').className = '';
    $('sumB').hidden = false;
    if (!card.contains(document.activeElement) || !document.activeElement.matches('input')) cartPainel(card);
    carrinhoSync();
  }
  // Miniatura da peça (foto do catálogo), ou um quadrado vazio se ainda não tem foto.
  function cartFoto(l, px) {
    var src = S.fotos[l.it.ref + '|' + l.it.cor],
      st = 'width:' + px + 'px;height:' + px + 'px;flex:0 0 ' + px + 'px;border-radius:10px;background:#fff;object-fit:contain;border:1px solid var(--line)';
    return src
      ? '<img src="' + src + '" alt="" style="' + st + '">'
      : '<span aria-hidden="true" style="' + st + ';display:inline-flex;align-items:center;justify-content:center;background:var(--panel2);color:var(--mute)"><svg width="' + Math.round(px * 0.6) + '" height="' + Math.round(px * 0.6) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="14" r="3.5"/><circle cx="17.5" cy="14" r="3.5"/><path d="M10 14c.7-.8 3.3-.8 4 0M3 14l1-5M21 14l-1-5"/></svg></span>';
  }
  function cartPainel(card) {
    var h =
      '<div style="display:flex;align-items:center;gap:10px"><button type="button" class="chip" data-act="cartclose" aria-label="Voltar" style="min-height:42px;width:42px;padding:0;justify-content:center;font-size:20px;flex:0 0 auto">←</button><h2 style="margin:0;font-size:20px">Pedido · ' + cartPecas() + ' peça(s)</h2></div>' +
      '<div class="hint" style="margin:0">O piso é conferido sobre o total. Você pode mudar o preço de uma peça (desconto maior numa, menos em outra) e o app confere se o total ainda cobre tudo.</div><div class="split">';
    S.cart.forEach(function (l, i) {
      var pp = pisoPeca(l.it),
        tab = tFor(l.it).price * l.qty,
        v = cartLinhaPreco(l);
      h +=
        '<div class="sl" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">' + cartFoto(l, 56) + '<span style="flex:1 1 140px">' + esc(cartDesc(l)) +
        '<small>Tabela ' + gs(tab) + ' · piso ' + gs(pp.piso * l.qty) + '</small></span>' +
        '<span style="display:flex;gap:6px;align-items:center"><button type="button" class="step" style="min-height:36px;width:36px" data-act="cartmn" data-id="' + i + '" aria-label="Menos uma peça">−</button>' +
        '<button type="button" class="step" style="min-height:36px;width:36px" data-act="cartpl" data-id="' + i + '" aria-label="Mais uma peça">+</button></span>' +
        '<input class="in" inputmode="' + mpMode() + '" data-in="cartpreco" data-id="' + i + '" value="' + gsParaCampo(v) + '" aria-label="Preço combinado de ' + esc(cartDesc(l)) + ' em ' + mpSim() + '" style="flex:0 1 130px;width:130px">' +
        '<button type="button" class="chip" style="flex:0 0 40px;width:40px;padding:0;justify-content:center" data-act="cartrm" data-id="' + i + '" aria-label="Tirar do pedido">×</button></div>';
    });
    h += '</div><button type="button" id="cartSlot" data-act="cartclose" style="min-height:56px;border:2px dashed var(--line);border-radius:12px;background:transparent;color:var(--accent-fg);font:inherit;font-weight:700;width:100%">＋ Adicionar produto</button>' +
      '<div class="sum"><span class="lbl" style="margin:0">Total</span><b id="cartSub" style="font-size:26px">' + gs(cartSub()) + '</b></div>' +
      '<button type="button" class="go" id="cartConf" data-act="cartconf">Confirmar pedido</button>' +
      '<div><button type="button" class="chip" data-act="cartclear">Esvaziar pedido</button></div>';
    card.innerHTML = h;
  }
  // Recalcula total, desconto, pagamento e aviso de piso (sem refazer o painel).
  function carrinhoSync() {
    var sub = cartSub();
    S.qty = 1;
    S._vsel = null;
    S._selKey = 'cart';
    S._t = { price: sub, id: 'cart:' + sub + ':' + S.cart.length };
    S.descTxt = '';
    var cs = $('cartSub');
    if (cs) cs.textContent = gs(sub);
    $('unit').textContent = 'Pedido · ' + cartPecas() + ' peça(s)';
    $('tot').textContent = gs(sub);
    renderBrindeMotivo(null);
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
    var due = cartSub(),
      liqRec = pagTotais().liq,
      falta = due - liqRec,
      dkey = ['d', due, liqRec].join('|');
    if (falta >= DESC_MIN && S._descOk !== dkey) {
      descAbrir(falta, due, liqRec, dkey);
      return;
    }
    var desc = falta >= DESC_MIN;
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
        motivo: pv.abaixo || desc ? S.vMotivo || '' : ''
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
    agg.ref = 'Pedido';
    agg.cor = '';
    agg.tipo = 'x';
    agg.vr = '';
    var n = S.cart.length;
    S.cart = [];
    S.cartOpen = false;
    S.cartStep = 'pag';
    S._descOk = '';
    S.pisoConf = '';
    S.forma = 'din';
    pagReset();
    S.descTxt = '';
    S.vBrinde = null;
    S.vMotivo = '';
    S.rec = null;
    say('Venda registrada: pedido com ' + n + ' produto(s)');
    render();
    showSplit(agg);
    $('splitH').textContent = 'Pedido com ' + n + ' produto(s), ' + agg.qty + ' peça(s), por ' + gs(agg.price) + ' (vendas ' + agg.id + ')';
    $('splitNote').textContent =
      'Preço mínimo seguro (trava) do pedido: ' + gs(agg.trava) + '. Vendido por ' + gs(agg.price) + ', ' + (agg.livre >= 0 ? 'então o preço está seguro.' : 'abaixo do seguro. Veja a aba Dashboard.') + ' Cada peça foi gravada no Histórico.';
  }
  // Botão "Adicionar pedido".
  $('sCartAdd').onclick = function () {
    var sel = S._vsel;
    if (!sel || sel.qty <= 0) return;
    var q = Math.min(S.qty, sel.qty),
      ex = S.cart.filter(function (l) {
        return l.it === sel;
      })[0];
    if (ex) {
      var nq = Math.min(sel.qty, ex.qty + q);
      if (ex.preco != null) ex.preco = Math.round((ex.preco * nq) / ex.qty);
      ex.qty = nq;
    } else {
      var dd = descontoGs(tFor(sel).price * q); // desconto trazido da análise "Liquidação"
      S.cart.push({ it: sel, qty: q, preco: dd > 0 ? Math.max(0, tFor(sel).price * q - dd) : null });
    }
    S.descTxt = '';
    S.vRef = '';
    S.vSel = null;
    S.qty = 1;
    S.rec = null;
    S.msg = 'Adicionado ao pedido.';
    render();
    window.scrollTo(0, 0);
    setTimeout(function () {
      pulsa($('cartBar'));
    }, 60);
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
    S.cartStep = 'ped';
    S.rec = null;
    render();
    window.scrollTo(0, 0);
  };
  ACT.cartclose = function () {
    S.cartOpen = false;
    S.cartStep = 'pag';
    render();
    window.scrollTo(0, 0);
  };
  ACT.cartconf = function () {
    cartLimpa();
    if (!S.cart.length) return render();
    S.cartStep = 'pag';
    S.rec = null;
    S._descOk = '';
    render();
    window.scrollTo(0, 0);
  };
  ACT.cartvolta = function () {
    S.cartStep = 'ped';
    render();
    window.scrollTo(0, 0);
  };
  // Confirmação do desconto: o que falta do valor recebido vira desconto, com o motivo.
  var DESC_MIN = 100;
  function descAbrir(falta, due, rec, key) {
    var box = $('dscBox');
    box.innerHTML =
      '<div><h2 style="margin:0;font-size:18px">Registrar ' + gs(falta) + ' como desconto?</h2><div class="hint" style="margin:6px 0 0">Total ' + gs(due) + ' · recebido ' + gs(rec) + '</div></div>' +
      '<div><div class="lbl">Motivo</div><div class="nav" id="dscMot"></div></div>' +
      '<button type="button" class="go" id="dscOk">Registrar e finalizar</button>' +
      '<button type="button" class="chip" id="dscNo" style="justify-content:center;min-height:44px">Voltar e corrigir</button>';
    var mc = $('dscMot');
    ['Isca ou combo', 'Liquidação', 'Cliente fiel', 'Outro'].forEach(function (m) {
      mc.appendChild(
        btn('chip' + (S.vMotivo === m ? ' on' : ''), m, function () {
          S.vMotivo = S.vMotivo === m ? '' : m;
          Array.prototype.forEach.call(mc.children, function (c) {
            c.classList.toggle('on', c.textContent === S.vMotivo);
            c.setAttribute('aria-pressed', c.textContent === S.vMotivo);
          });
        }, S.vMotivo === m)
      );
    });
    $('dscNo').onclick = function () {
      $('dscModal').hidden = true;
    };
    $('dscOk').onclick = function () {
      $('dscModal').hidden = true;
      S._descOk = key;
      cartFinalizar();
    };
    $('dscModal').hidden = false;
  }
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
