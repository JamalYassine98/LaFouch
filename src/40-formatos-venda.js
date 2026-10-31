  // ===== Formatadores, constantes e cálculo/registro de vendas. =====
  var DAY = 86400000,
    now0 = Date.now();
  // Timestamp de d dias e h horas atrás.
  function tAgo(d, h) {
    return now0 - d * DAY - (h || 0) * 3600000;
  }
  // Mostra um valor guardado em guaranis.
  var gs = function (n) {
    return 'G$ ' + dots(n);
  };
  // Sempre em guaranis (para cotações e valores que são, por natureza, G$).
  function gsRaw(n) {
    return 'G$ ' + dots(n);
  }
  // Formata número conforme a moeda.
  function nf(v, m) {
    return m === 'pyg'
      ? dots(v)
      : v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  // Formata valor com símbolo da moeda.
  function fmtM(v, m) {
    return (m === 'pyg' ? 'G$ ' : m === 'usd' ? 'US$ ' : 'R$ ') + nf(v, m);
  }
  var usd = function (n) {
    return fmtM(n, 'usd');
  };
  // Dólar sem centavos (painéis e resumos: a loja não trabalha com centavos).
  var usd0 = function (n) {
    return 'US$ ' + dots(Math.round(n));
  };
  var fmtM0 = function (v, m) {
    return m === 'pyg' ? gsRaw(v) : (m === 'usd' ? 'US$ ' : 'R$ ') + dots(Math.round(v));
  };
  var pc = function (n) {
    return (n * 100).toFixed(1).replace('.', ',') + '%';
  };
  var fd = function (ts) {
    return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };
  var fh = function (ts) {
    return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  var esc = function (x) {
    return String(x).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  var toNum = function (v) {
    return Number(String(v).replace(/\D/g, '')) || 0;
  };
  var sgn = function (n) {
    return (n > 0 ? '+' : n < 0 ? '−' : '') + gs(Math.abs(n));
  };
  var CATS = {
    loja: 'Loja',
    casa: 'Casa',
    pessoal: 'Salário',
    profissional: 'Contador',
    imprev: 'Imprevistos'
  };
  var VIEWS = [
    ['inicio', 'Início'],
    ['dash', 'Dashboard'],
    ['estoque', 'Inventário'],
    ['vendas', 'Catálogo'],
    ['caixa', 'Caixa'],
    ['desp', 'Despesas'],
    ['fx', 'Câmbio'],
    ['hist', 'Histórico'],
    ['ped', 'Pedidos online'],
    ['onl', 'Loja online'],
    ['clientes', 'Clientes'],
    ['notif', 'Notificações'],
    ['ajustes', 'Ajustes'],
    ['org', 'Organizar abas']
  ];

  S.view = 'inicio';
  S.hmode = 'lista';
  S.day = '';
  S.dayTab = '';
  S.elog = [];
  S.per = 'mes';
  S.perDe = '';
  S.perAte = '';
  S.volume = 350;
  S.melhPeca = 1000;
  S.janela = 90;
  S.hf = 'all';
  S.hq = '';
  S.hOpen = '';
  S.confEst = '';
  S.confRm = '';
  S.lotes = [
    { id: '#3140', ts: tAgo(60), usd: 0.46, txt: 'Pré-graduados' },
    { id: '#3251', ts: tAgo(19), usd: 0.5, txt: 'Pré-graduados' }
  ];
  S.exp = [
    {
      id: 1,
      nome: 'Aluguel da loja',
      cat: 'loja',
      tipo: 'fixa',
      valor: 900000,
      hist: [{ ts: tAgo(150), de: 850000, para: 900000 }]
    },
    {
      id: 2,
      nome: 'Luz',
      cat: 'loja',
      tipo: 'variavel',
      valor: 180000,
      hist: [{ ts: tAgo(40), de: 165000, para: 180000 }]
    },
    { id: 3, nome: 'Internet', cat: 'loja', tipo: 'fixa', valor: 120000, hist: [] },
    {
      id: 4,
      nome: 'Contador',
      cat: 'profissional',
      tipo: 'fixa',
      valor: 300000,
      hist: [{ ts: tAgo(70), de: 250000, para: 300000 }]
    },
    { id: 5, nome: 'Salário (retirada)', cat: 'pessoal', tipo: 'fixa', valor: 1500000, hist: [] },
    {
      id: 6,
      nome: 'Contas de casa',
      cat: 'casa',
      tipo: 'variavel',
      valor: 1000000,
      hist: [{ ts: tAgo(30), de: 1100000, para: 1000000 }]
    },
    { id: 7, nome: 'Provisão de imprevistos', cat: 'imprev', tipo: 'fixa', valor: 200000, hist: [] }
  ];
  S.nextExp = 8;
  S.imprev = [{ ts: tAgo(6), desc: 'Conserto da vitrine', valor: 60000 }];
  S.fxHist = [];
  for (var fi = 29; fi >= 0; fi--) {
    var fk = 29 - fi;
    S.fxHist.push({
      ts: tAgo(fi),
      pyg: Math.round(6280 + fk * 7 + 60 * Math.sin(fk / 3.1)),
      brl: Math.round((5.4 + 0.03 * Math.sin(fk / 4)) * 1000) / 1000
    });
  }
  S.fx = {
    pyg: S.fxHist[29].pyg,
    brl: S.fxHist[29].brl,
    ts: now0,
    live: false,
    src: 'Valor de exemplo',
    status: 'Ainda não buscou a cotação.'
  };
  S.fxNext = Date.now() + 5000;

  // Soma das despesas mensais.
  function totalMensal() {
    syncExpFx();
    return S.exp.reduce(function (a, e) {
      return a + e.valor;
    }, 0);
  }
  // Despesa mensal rateada por peça.
  // Sem argumento é a média por peça. Com uma peça (ou o custo em US$) e o rateio "custo", peça mais cara carrega mais contas.
  function contasPeca(it, repUsd) {
    var flat = Math.round((totalMensal() + reservaCambioContas()) / Math.max(1, volumeEfetivo()));
    if (S.rateio !== 'custo') return flat;
    var rep = repUsd != null ? repUsd : it ? tFor(it).repUSD : null;
    if (!(rep > 0)) return flat;
    var k = rateioK();
    return k > 0 ? Math.round(rep * S.fx.pyg * k) : flat;
  }
  // Fração do custo de reposição que cada peça carrega: contas do mês ÷ (peças esperadas de cada tipo × custo médio do tipo).
  function rateioK() {
    var v = volTipos(),
      fx = S.fx.pyg,
      soma = 0;
    Object.keys(v).forEach(function (t) {
      var q = 0,
        n = 0;
      S.items.forEach(function (i) {
        var c = i.tipo === t ? effCusto(i) : null;
        if (c != null && c > 0) {
          q += c;
          n++;
        }
      });
      var tp = tipoOf(t),
        medUsd = n ? q / n : tp ? tp.repUSD || 0 : 0;
      soma += v[t] * medUsd * fx;
    });
    return soma > 0 ? (totalMensal() + reservaCambioContas()) / soma : 0;
  }
  // Tipo pelo id.
  function tipoOf(id) {
    return tipoAll().filter(function (x) {
      return x.id === id;
    })[0];
  }
  // Colchão cambial calculado pelo histórico do câmbio.
  function colchao() {
    var from = Date.now() - S.janela * DAY,
      h = S.fxHist.filter(function (p) {
        return p.ts >= from;
      }),
      fx = 0,
      i,
      j;
    for (i = 0; i < h.length; i++)
      for (j = i + 1; j < h.length; j++) fx = Math.max(fx, h[j].pyg / h[i].pyg - 1);
    var l = lotesHist().filter(function (x) {
        return x.ts >= from;
      }),
      cost = 0;
    for (i = 0; i < l.length; i++)
      for (j = i + 1; j < l.length; j++) cost = Math.max(cost, l[j].usd / l[i].usd - 1);
    var raw = (1 + fx) * (1 + cost) - 1;
    return {
      pct: Math.min(0.25, Math.max(0.05, raw)),
      fx: fx,
      cost: cost,
      raw: raw,
      janela: S.janela
    };
  }
  // Calcula a divisão da venda: reposição, contas e lucro.
  function calcSale(t, qty, fx, pct, cPeca, melhPeca, priceOv, extraUSD) {
    var price = priceOv != null ? priceOv : t.price * qty,
      repP = Math.round(t.repUSD * fx),
      ex = extraUSD > 0 ? Math.round(extraUSD * fx) : 0,
      rep = repP * qty + ex,
      contas = cPeca * qty,
      colch = Math.round(t.repUSD * fx * pct) * qty;
    var melh = Math.min(melhPeca * qty, Math.max(0, price - rep - contas - colch)),
      livre = price - rep - contas - colch - melh;
    return {
      price: price,
      rep: rep,
      repUSD: t.repUSD * qty + (extraUSD > 0 ? extraUSD : 0),
      contas: contas,
      colch: colch,
      melh: melh,
      livre: livre,
      trava: repP + cPeca
    };
  }
  // Descrição curta de uma venda.
  function descOf(x) {
    return x.qty + '× ' + x.ref + ' ' + (x.tipo === 'pre' ? x.grau : x.vr) + ' · ' + x.cor;
  }
  S.sales = [];
  S.saleSeq = 0;
  // Cria uma venda (usada nos dados de exemplo).
  function mkSale(ts, tipo, ref, cor, grau, vr, qty, fx, pct, cPeca, est) {
    var t = tipoOf(tipo),
      c = calcSale(t, qty, fx, pct, cPeca, 1000);
    var s = {
      id: 'V-' + ('000' + ++S.saleSeq).slice(-4),
      ts: ts,
      tipo: tipo,
      ref: ref,
      cor: cor,
      grau: grau,
      vr: vr,
      qty: qty,
      fx: fx,
      pct: pct,
      pago: t.pago * qty,
      cPeca: cPeca,
      estorno: !!est
    };
    for (var k in c) s[k] = c[k];
    s.moeda = 'pyg';
    s.recebido = s.price;
    s.rate = 1;
    return s;
  }
  [
    [0, 2, 'pre', 'SP57765', 'Preto', '+1.00', '', 2],
    [0, 5, 'sem', 'BR44118', 'Bege translúcido', '', 'C2', 1],
    [1, 3, 'pre', 'SP60627', 'Bege translúcido', '+1.50', '', 1],
    [2, 4, 'solar', 'SL2201', 'Preto', '', 'C1', 1],
    [3, 2, 'pre', 'SP58110', 'Preto', '+1.25', '', 3],
    [4, 6, 'sem', 'BR44120', 'Preto', '', 'C1', 1, true],
    [5, 3, 'pre', 'SP57765', 'Preto', '+1.75', '', 2],
    [6, 1, 'solar', 'SL2210', 'Tartaruga', '', 'C3', 1],
    [9, 2, 'pre', 'SP59002', 'Tartaruga', '+2.50', '', 1]
  ].forEach(function (a) {
    S.sales.unshift(
      mkSale(
        tAgo(a[0], a[1]),
        a[2],
        a[3],
        a[4],
        a[5],
        a[6],
        a[7],
        S.fxHist[29 - a[0]].pyg,
        0.12,
        11500,
        a[8]
      )
    );
  });
  S.sales.reverse();
  S.sales.sort(function (a, b) {
    return b.ts - a.ts;
  });
  // Registra a venda e movimenta estoque e caixa.
  function addSale(it, qty, pay) {
    var c = colchao(),
      cp = contasPeca(it),
      pg = pay.pag || {},
      rate = pg.rate > 0 ? pg.rate : ratePyg(pay.moeda),
      linhas = [{ moeda: pay.moeda, v: pay.recebido, rate: rate }].concat(pg.extra || []),
      trocos = pg.troco || [],
      recGs = linhas.reduce(function (a, l) {
        return a + Math.round(l.v * l.rate);
      }, 0),
      trGs = trocos.reduce(function (a, l) {
        return a + Math.round(l.v * l.rate);
      }, 0),
      eff = recGs - trGs,
      s = mkSale(
        Date.now(),
        it.tipo,
        it.ref,
        it.cor,
        it.grau,
        it.vr,
        qty,
        S.fx.pyg,
        c.pct,
        cp,
        false
      );
    var tf = tFor(it),
      pp = pisoPeca(it),
      bu = pay.brinde ? pay.brinde.usd : 0,
      bg = Math.round(bu * S.fx.pyg),
      m = calcSale(tf, qty, S.fx.pyg, c.pct, cp, S.melhPeca, eff, bu);
    for (var k in m) s[k] = m[k];
    var fm = formaPorId(pay.forma),
      tx = taxaGs(recGs, fm),
      txM = taxaMoeda(pay.recebido, pay.moeda, fm);
    s.livre -= tx;
    s.forma = fm.id;
    s.taxa = tx;
    s.taxaM = txM;
    s.faixa = (faixaOf(it.ref) || {}).id || '';
    s.lista = tf.price * qty;
    s.abaixo = eff - tx < pp.piso * qty + bg;
    s.perde = eff - tx < pp.trava * qty + bg;
    if (pay.brinde) s.brinde = pay.brinde;
    if (pay.motivo) s.motivo = pay.motivo;
    s.fxb = S.fx.brl;
    s.moeda = pay.moeda;
    s.recebido = pay.recebido;
    s.rate = Math.round(rate);
    s.pags = linhas.map(function (l) {
      var fee = taxaMoeda(l.v, l.moeda, fm);
      S.cash[l.moeda] += l.v - fee;
      return { moeda: l.moeda, v: l.v, rate: l.rate, fee: fee };
    });
    s.troco = trocos.map(function (l) {
      S.cash[l.moeda] -= l.v;
      return { moeda: l.moeda, v: l.v, rate: l.rate };
    });
    s.lote = it.lote || '';
    if (it.custo != null) s.custoPeca = it.custo;
    if (it.med) s.medPeca = it.med;
    if (it.fmt) s.fmtPeca = it.fmt;
    S.sales.unshift(s);
    return s;
  }
  // Mostra como o valor da venda se divide.
  function showSplit(sale) {
    var parts = [
      [
        'Reposição da mercadoria',
        usd(sale.repUSD) + ' ao câmbio de hoje (US$ 1 = ' + gsRaw(S.fx.pyg) + '). Obrigatório.',
        sale.rep,
        '#00c8ff'
      ],
      [
        'Contas da loja e de casa',
        'Parte do mês coberta por esta venda. Obrigatório.',
        sale.contas,
        '#a2447c'
      ],
      [
        'Colchão de segurança',
        pc(sale.pct) + ' da reposição, pela alta recente do dólar e do custo.',
        sale.colch,
        '#ffc766'
      ],
      ['Caixa de melhorias', 'Meta flexível. Não trava a venda.', sale.melh, 'var(--info)'],
      ['Taxa da maquininha', 'Sai do seu lucro. Já descontada do que entra no caixa.', sale.taxa || 0, '#ff9d7a'],
      ['Lucro livre', 'O que sobra para você.', sale.livre, '#00ff88']
    ];
    SPLIT_OK = true;
    vibrar(25);
    $('splitH').textContent =
      'Venda ' +
      sale.id +
      ': ' +
      descOf(sale) +
      ' por ' +
      gs(sale.price) +
      (sale.moeda !== 'pyg' ? ' (recebido ' + fmtM(sale.recebido, sale.moeda) + ')' : '');
    var bar = $('splitBar');
    bar.textContent = '';
    var rowsEl = $('splitRows');
    rowsEl.textContent = '';
    parts.forEach(function (p) {
      if (p[0] === 'Taxa da maquininha' && !p[2]) return;
      var i = mk('i');
      i.style.width = Math.max(0, (p[2] / sale.price) * 100) + '%';
      i.style.background = p[3];
      bar.appendChild(i);
      var r = mk('div', 'sl');
      var l = mk('span', '');
      var sp = mk('span', 'sp');
      sp.style.background = p[3];
      l.appendChild(sp);
      l.appendChild(document.createTextNode(p[0]));
      l.appendChild(mk('small', '', p[1]));
      r.appendChild(l);
      var vb = mk('b', '', gs(p[2]));
      r.appendChild(vb);
      if (p[0] === 'Lucro livre') contaSubindo(vb, p[2], gs, 800);
      rowsEl.appendChild(r);
    });
    var n = $('splitNote');
    n.className = 'note ' + (sale.livre >= 0 ? 'n-info' : 'n-bad');
    n.textContent =
      'Preço mínimo seguro (trava): ' +
      gs(sale.trava) +
      ' por peça. Você vendeu a ' +
      gs(sale.price / sale.qty) +
      ', ' +
      (sale.livre >= 0
        ? 'então o preço está seguro. Subir preço é a última sugestão do app.'
        : 'abaixo do seguro. Veja a aba Dashboard.') +
      ' Esta venda foi gravada no Histórico.';
  }
  // A divisão da venda fica numa janela, aberta pelo botão $ da tela Vender.
  var SPLIT_OK = false;
  function splitFecha() {
    $('splitCard').hidden = true;
    var bk = $('splitBk');
    if (bk) bk.hidden = true;
  }
  function splitAbre() {
    if (!SPLIT_OK) {
      $('splitH').textContent = 'Ainda não há venda feita nesta sessão. Depois de vender, toque no $ para ver a divisão.';
      $('splitBar').textContent = '';
      $('splitRows').textContent = '';
      $('splitNote').textContent = '';
    }
    var bk = $('splitBk');
    if (!bk) {
      bk = document.createElement('div');
      bk.id = 'splitBk';
      bk.className = 'splitBk';
      bk.onclick = splitFecha;
      document.body.appendChild(bk);
    }
    bk.hidden = false;
    $('splitCard').hidden = false;
    vibrar(15);
  }
  $('splitX').onclick = splitFecha;
