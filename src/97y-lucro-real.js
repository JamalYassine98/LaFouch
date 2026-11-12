  // ===== S200 (aprovado 12/11/2026): LUCRO REAL por peça e do mês =====
  // Regra do dono: IVA da venda (10% dentro do preço) sai da receita (preço ÷ 1,10); IVA pago na compra vira CUSTO
  // (sem crédito fiscal); frete da compra já está rateado no custo da peça (lote); frete da entrega pago pela loja,
  // taxa do pagamento e descontos (cupom / Leve 2) saem do lucro. Nada aqui muda as vendas: só mostra a conta.
  var LR_IVA = 0.1;
  function lrIvaCompra() { return S.ivaCompraPct != null ? +S.ivaCompraPct / 100 : LR_IVA; }
  // uma venda → a conta inteira (Gs.)
  function lrVenda(s) {
    var preco = +s.price || 0,
      desc = (s.cup && s.cup.desc > 0 ? s.cup.desc : 0) + (+s.l2d || 0),
      ivaV = Math.round(preco - preco / (1 + LR_IVA)),
      custo = Math.round(+s.rep || 0),
      ivaC = Math.round(custo * lrIvaCompra()),
      taxa = Math.round(+s.taxa || 0),
      freteV = Math.round(+s.freteLoja || 0),
      lucro = preco - ivaV - custo - ivaC - taxa - freteV;
    return { preco: preco + desc, desc: desc, ivaV: ivaV, custo: custo, ivaC: ivaC, taxa: taxa, freteV: freteV, lucro: lucro, qty: +s.qty || 1 };
  }
  function lrSoma(L) {
    var t = { preco: 0, desc: 0, ivaV: 0, custo: 0, ivaC: 0, taxa: 0, freteV: 0, lucro: 0, qty: 0, vendido: 0 };
    L.forEach(function (s) {
      var r = lrVenda(s);
      Object.keys(t).forEach(function (k) { if (k !== 'vendido') t[k] += r[k] || 0; });
      t.vendido += +s.price || 0;
    });
    return t;
  }
  function lrMes(ano, mes) {
    var ini = new Date(ano, mes, 1).getTime(), fim = new Date(ano, mes + 1, 1).getTime(),
      vs = (S.sales || []).filter(function (s) { return !s.estorno && s.ts >= ini && s.ts < fim; }),
      t = lrSoma(vs), por = {};
    vs.forEach(function (s) { (por[s.ref] = por[s.ref] || []).push(s); });
    t.pecas = Object.keys(por).map(function (ref) { var x = lrSoma(por[ref]); return { ref: ref, un: x.qty ? Math.round(x.lucro / x.qty) : 0, n: x.qty }; })
      .sort(function (a, b) { return b.un - a.un; });
    return t;
  }
  function lrLinha(rot, v, cor) {
    return '<div class="sl"><span>' + rot + '</span><b' + (cor ? ' style="color:' + cor + '"' : '') + '>' + v + '</b></div>';
  }
  // Finanças › Dinheiro: "Lucro real do mês"
  function lucroRealHtml() {
    var d = new Date(), t = lrMes(d.getFullYear(), d.getMonth());
    if (!t.qty) return '<div class="hint">Ainda não há vendas neste mês.</div>';
    var pct = t.vendido ? Math.round((t.lucro / t.vendido) * 100) : 0,
      top = t.pecas.slice(0, 2), low = t.pecas.length > 2 ? t.pecas.slice(-1) : [];
    var nm = function (ref) { var n = String(pn(ref) || ''); return esc(ref) + (n ? ' · ' + esc(n.length > 22 ? n.slice(0, 21) + '…' : n) : ''); };
    return (
      '<section class="card col" style="gap:2px"><div style="font:700 26px var(--serif,Georgia);color:' + (t.lucro >= 0 ? 'var(--ok)' : 'var(--bad)') + '">' + gs(t.lucro) + '</div>' +
      '<div class="hint" style="margin:0 0 8px">de ' + gs(t.vendido) + ' vendidos · ' + pct + '%</div>' +
      lrLinha('IVA das vendas', '− ' + gs(t.ivaV)) +
      lrLinha('Custo + IVA da compra', '− ' + gs(t.custo + t.ivaC)) +
      lrLinha('Taxas do pagamento', '− ' + gs(t.taxa)) +
      lrLinha('Frete das entregas', (t.freteV ? '− ' : '') + gs(t.freteV)) +
      lrLinha('Descontos (cupom, Leve 2)', '− ' + gs(t.desc)) +
      '<div class="hint" style="margin:6px 0 0">O frete das compras já está dentro do custo de cada peça.</div>' +
      (top.length ? '<b style="display:block;margin:12px 0 4px;font-size:13px;letter-spacing:.08em;color:var(--mu)">MAIS LUCRO REAL</b>' + top.map(function (x) { return lrLinha('<a href="#" style="color:inherit" data-act="lrpeca" data-id="' + esc(x.ref) + '">' + nm(x.ref) + '</a>', gs(x.un) + ' / un'); }).join('') : '') +
      (low.length ? '<b style="display:block;margin:12px 0 4px;font-size:13px;letter-spacing:.08em;color:var(--mu)">MENOS LUCRO REAL</b>' + low.map(function (x) { return lrLinha('<a href="#" style="color:inherit" data-act="lrpeca" data-id="' + esc(x.ref) + '">' + nm(x.ref) + '</a>', gs(x.un) + ' / un', x.un < 20000 ? 'var(--warn)' : ''); }).join('') : '') + '</section>'
    );
  }
  ACT.lrpeca = function (ref) {
    var it = (S.items || []).filter(function (x) { return x.ref === ref; })[0];
    if (!it) return;
    setView('estoque');
    S.todos = false; S.tipo = it.tipo; S.fmtF = 'all'; S.corF = 'all'; S.q = ''; S.open = ref; S.det = true;
    render();
  };
  // ficha da peça: "Lucro real" com a última venda (ou o preço de hoje) + simulações
  function lucroPecaHtml(ref) {
    var vs = (S.sales || []).filter(function (s) { return s.ref === ref && !s.estorno; }).sort(function (a, b) { return b.ts - a.ts; }),
      base = vs[0] ? Object.assign({}, vs[0], { qty: 1, price: Math.round((vs[0].price + ((vs[0].cup && vs[0].cup.desc) || 0)) / (vs[0].qty || 1)), rep: Math.round((vs[0].rep || 0) / (vs[0].qty || 1)), taxa: 0, cup: null, l2d: 0, freteLoja: 0 }) : null;
    if (!base) {
      var it = (S.items || []).filter(function (x) { return x.ref === ref; })[0], p = it && typeof precoTab === 'function' ? precoTab(it) : 0;
      if (!it || !p) return '';
      var fx = (S.fx && S.fx.pyg) || 0, cu = it.usd != null ? it.usd : it.custo != null ? it.custo : 0;
      base = { price: p, rep: Math.round(cu * fx), qty: 1, taxa: 0 };
    }
    var r = lrVenda(base), pct = r.preco ? Math.round((r.lucro / r.preco) * 100) : 0;
    var sim = function (o) { return lrVenda(Object.assign({}, base, o)).lucro; };
    var c10 = Math.floor((base.price * 0.1) / 1000) * 1000, l2 = base.price - Math.ceil((base.price * 0.7) / 1000) * 1000;
    return (
      '<details class="card col lrcard"><summary style="cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px"><b>Lucro real</b><b style="color:' + (r.lucro >= 0 ? 'var(--ok)' : 'var(--bad)') + '">' + gs(r.lucro) + '</b></summary>' +
      '<b style="display:block;margin:10px 0 4px;font-size:12px;letter-spacing:.1em;color:var(--mu)">CADA VENDA DESTA PEÇA</b>' +
      lrLinha('Preço de venda', gs(r.preco)) + lrLinha('− IVA da venda (10%)', '− ' + gs(r.ivaV)) + lrLinha('− Custo (+ frete da compra)', '− ' + gs(r.custo)) +
      lrLinha('− IVA da compra', '− ' + gs(r.ivaC)) + lrLinha('− Taxa do pagamento', '− ' + gs(r.taxa)) +
      '<div class="sl" style="border-top:1px solid var(--line);padding-top:8px"><span><b>Lucro real</b></span><b style="color:' + (r.lucro >= 0 ? 'var(--ok)' : 'var(--bad)') + ';font-size:18px">' + gs(r.lucro) + '</b></div>' +
      '<div class="hint">' + pct + '% do preço</div>' +
      '<b style="display:block;margin:12px 0 4px;font-size:12px;letter-spacing:.1em;color:var(--mu)">SE VENDER COM…</b>' +
      lrLinha('Cupom 10%', gs(sim({ price: base.price - c10 }))) + lrLinha('Leve 2 (2ª peça −30%)', gs(sim({ price: base.price - l2 }))) + (function () { var f = S.fretes && S.fretes.pya && +S.fretes.pya.p; return f ? lrLinha('Delivery pago pela loja', gs(sim({ freteLoja: f }))) : ''; })() +
      '</details>'
    );
  }
  var _rdLR = renderDetail;
  renderDetail = function (ref, opt) {
    var r = _rdLR.apply(this, arguments);
    try {
      opt = opt || {};
      var det = opt.host || $('detail');
      if (!opt.venda && ref && det && !det.querySelector('.lrcard')) {
        var h = lucroPecaHtml(ref);
        if (h) { var w = document.createElement('div'); w.innerHTML = h; det.appendChild(w.firstChild); }
      }
    } catch (e) {}
    return r;
  };
