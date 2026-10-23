  // ===== Dados de exemplo: fotos desenhadas e cerca de 14 meses de histórico (para testar o app). =====
  // Números pseudo-aleatórios repetíveis (mesmo exemplo todas as vezes).
  function exRand(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // Foto de exemplo de um óculos (SVG em fundo branco): formato, cor da armação e tipo (solar escurece a lente).
  function exFoto(fmt, cor, tipo) {
    var c = hexOf(cor),
      solar = tipo === 'solar',
      id = 'g' + Math.abs((fmt + cor + tipo).split('').reduce(function (a, ch) { return (a * 31 + ch.charCodeAt(0)) | 0; }, 7)),
      lens = function (cx) {
        var w = 112,
          h = 84,
          x = cx - w / 2,
          y = 150 - h / 2;
        switch (fmt) {
          case 'Redondo':
            return '<circle cx="' + cx + '" cy="150" r="46"/>';
          case 'Quadrado':
            return '<rect x="' + (cx - 54) + '" y="' + (150 - 48) + '" width="108" height="96" rx="10"/>';
          case 'Hexagonal':
            return '<polygon points="' + [cx - 56, 150, cx - 28, 150 - 44, cx + 28, 150 - 44, cx + 56, 150, cx + 28, 150 + 44, cx - 28, 150 + 44].join(' ') + '"/>';
          case 'Gatinho': {
            var s = cx < 200 ? 1 : -1,
              X = function (dx) {
                return cx - s * dx;
              };
            return '<path d="M' + X(60) + ' 98 Q' + X(20) + ' 104 ' + X(-50) + ' 118 Q' + X(-62) + ' 134 ' + X(-52) + ' 154 Q' + X(-40) + ' 190 ' + cx + ' 190 Q' + X(46) + ' 188 ' + X(60) + ' 150 Z"/>';
          }
          case 'Aviador':
            return '<path d="M' + (cx - 58) + ' 112 Q' + cx + ' 98 ' + (cx + 58) + ' 112 Q' + (cx + 56) + ' 190 ' + (cx + 8) + ' 194 Q' + (cx - 56) + ' 190 ' + (cx - 58) + ' 112 Z"/>';
          default:
            return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="20"/>';
        }
      };
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="400" height="300" fill="#fff"/>' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + (solar ? '#2b2f36' : '#dff1fb') + '" stop-opacity="' + (solar ? '.92' : '.55') + '"/><stop offset="1" stop-color="' + (solar ? '#5b6370' : '#b9dcef') + '" stop-opacity="' + (solar ? '.88' : '.35') + '"/></linearGradient></defs>' +
      '<ellipse cx="200" cy="262" rx="150" ry="9" fill="#000" opacity=".07"/>' +
      '<g fill="url(#' + id + ')" stroke="' + c + '" stroke-width="8" stroke-linejoin="round">' + lens(125) + lens(275) + '</g>' +
      '<path d="M178 140 Q200 120 222 140" fill="none" stroke="' + c + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M66 138 L28 128 M334 138 L372 128" stroke="' + c + '" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M96 132 Q112 118 138 124" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  // Uma foto por produto e cor do estoque.
  function exFotos(items) {
    var f = {};
    items.forEach(function (i) {
      var k = i.ref + '|' + i.cor;
      if (!f[k]) f[k] = exFoto(i.fmt || 'Retangular', i.cor, i.tipo);
    });
    return f;
  }
  var EX_BASE = null;
  // Gera cerca de 14 meses de vendas, câmbio, contas, compras e movimentos do dono.
  function exGerar() {
    if (!EX_BASE) EX_BASE = JSON.parse(JSON.stringify({ items: S.items, grp: S.grp }));
    var R = exRand(20260101),
      DIAS = 430,
      hoje = new Date();
    function dia(d, h) {
      return new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - d, h || 12, Math.floor(R() * 50)).getTime();
    }
    function pick(a) {
      return a[Math.floor(R() * a.length)];
    }
    S.items = JSON.parse(JSON.stringify(EX_BASE.items));
    S.grp = JSON.parse(JSON.stringify(EX_BASE.grp));
    S.fotos = exFotos(S.items);
    S.pfaixa = { SP57765: 'f1', SP58110: 'f2', SP60627: 'f2', SP59002: 'f3', BR44118: 'f1', BR44120: 'f2', BR44133: 'f3', SL2201: 'f2', SL2210: 'f3' };
    S.attr = {
      SP57765: { material: 'Acetato', publico: 'Unissex', colecao: 'Leitura' },
      SP58110: { marca: 'Kazwini', material: 'Acetato', publico: 'Masculino', colecao: 'Leitura' },
      SP60627: { material: 'Plástico', publico: 'Feminino', colecao: 'Leitura' },
      SP59002: { material: 'Acetato', publico: 'Unissex', colecao: 'Leitura' },
      BR44118: { marca: 'Gucci', material: 'Metal', publico: 'Feminino', colecao: 'Clássicos' },
      BR44120: { marca: 'Ray-Ban', material: 'Metal', publico: 'Masculino', colecao: 'Clássicos' },
      BR44133: { marca: 'Armani', material: 'Acetato', publico: 'Feminino', colecao: 'Clássicos' },
      SL2201: { marca: 'Ray-Ban', material: 'Metal', publico: 'Masculino', colecao: 'Solares' },
      SL2210: { marca: 'Kazwini', material: 'TR90', publico: 'Feminino', colecao: 'Solares' }
    };
    S.pnome = {};
    S.pnAuto = {};
    S.descAuto = {};
    S.desc = {};
    S.num = {};
    S.numNext = 0;
    S.appStart = dia(DIAS, 8);
    // câmbio: 30 dias já existentes + o resto, em sequência suave
    var rec = S.fxHist.slice(),
      ant = [],
      n0 = rec.length,
      ruido = 0,
      ruidoB = 0;
    for (var d = DIAS; d > n0 - 1; d--) {
      var k = DIAS - d;
      ruido = ruido * 0.9 + (R() - 0.5) * 18;
      ruidoB = ruidoB * 0.9 + (R() - 0.5) * 0.02;
      ant.push({
        ts: dia(d, 10),
        pyg: Math.round(6040 + (k / (DIAS - n0)) * 230 + 90 * Math.sin(k / 37) + ruido),
        brl: Math.round((5.12 + (k / (DIAS - n0)) * 0.26 + 0.1 * Math.sin(k / 53) + ruidoB) * 1000) / 1000
      });
    }
    if (ant.length) {
      var off = rec[0].pyg - ant[ant.length - 1].pyg,
        offB = rec[0].brl - ant[ant.length - 1].brl;
      ant.forEach(function (p, i) {
        var w = (i + 1) / ant.length;
        p.pyg = Math.round(p.pyg + off * w * w);
        p.brl = Math.round((p.brl + offB * w * w) * 1000) / 1000;
      });
    }
    S.fxHist = ant.concat(rec);
    function fxDe(ts) {
      var v = S.fxHist[0];
      S.fxHist.forEach(function (p) {
        if (p.ts <= ts) v = p;
      });
      return v;
    }
    // vendas
    S.sales = [];
    S.saleSeq = 0;
    var porTipo = { pre: S.items.filter(function (i) { return i.tipo === 'pre'; }), sem: S.items.filter(function (i) { return i.tipo === 'sem'; }), solar: S.items.filter(function (i) { return i.tipo === 'solar'; }) },
      mesM = [1.2, 1.1, 1.0, 0.95, 1.25, 0.95, 0.8, 0.9, 1.0, 1.05, 1.15, 1.6],
      sem = [0.25, 1.0, 1.0, 1.0, 1.05, 1.25, 1.5],
      formasP = [['din', 0.52], ['pix', 0.2], ['deb', 0.16], ['cre', 0.12]];
    for (var dd = DIAS; dd >= 0; dd--) {
      var dt = new Date(dia(dd, 12)),
        tend = 0.8 + 0.3 * ((DIAS - dd) / DIAS),
        lam = 4.4 * mesM[dt.getMonth()] * sem[dt.getDay()] * tend,
        nv = 0,
        L = Math.exp(-lam),
        p = 1;
      do {
        nv++;
        p *= R();
      } while (p > L && nv < 12);
      nv--;
      for (var j = 0; j < nv; j++) {
        var ts = dia(dd, 9 + Math.floor(R() * 10)),
          wSolar = (SAZON_PADRAO.solar[dt.getMonth()] || 1) * 0.35,
          x = R() * (0.45 + 0.2 + wSolar),
          tipo = x < 0.45 ? 'pre' : x < 0.65 ? 'sem' : 'solar',
          it = pick(porTipo[tipo]),
          qty = R() < 0.84 ? 1 : R() < 0.75 ? 2 : 3,
          fxp = fxDe(ts),
          cPeca = Math.round(11500 * (0.82 + 0.18 * ((DIAS - dd) / DIAS))),
          s = mkSale(ts, it.tipo, it.ref, it.cor, it.grau, it.vr, qty, fxp.pyg, 0.12, cPeca, R() < 0.015),
          t = tipoOf(it.tipo),
          preco = t.price * qty;
        if (R() < 0.3) preco = Math.round((preco * (1 - (0.03 + R() * 0.1))) / 500) * 500;
        var c = calcSale(t, qty, fxp.pyg, 0.12, cPeca, S.melhPeca, preco);
        for (var kk in c) s[kk] = c[kk];
        var fm = formasP.reduce(function (a, f) { return a.v != null ? a : (a.r -= f[1]) <= 0 ? { v: f[0] } : a; }, { r: R() }).v || 'din',
          fo = S.formas.filter(function (f) { return f.id === fm; })[0] || S.formas[0],
          tx = Math.round((preco * fo.taxa) / 100),
          mo = R() < 0.12 ? 'brl' : R() < 0.07 ? 'usd' : 'pyg',
          rt = mo === 'pyg' ? 1 : Math.round((mo === 'usd' ? fxp.pyg : fxp.pyg / fxp.brl) * 0.975),
          rv = mo === 'pyg' ? preco : Math.round((preco / rt) * 100) / 100;
        if (mo !== 'pyg') fo = S.formas[0];
        if (mo !== 'pyg') tx = 0;
        s.livre -= tx;
        s.forma = fo.id;
        s.taxa = tx;
        s.taxaM = mo === 'pyg' ? tx : 0;
        s.faixa = S.pfaixa[it.ref] || '';
        s.lista = preco;
        s.abaixo = false;
        s.perde = false;
        s.moeda = mo;
        s.recebido = rv;
        s.rate = rt;
        s.pags = [{ moeda: mo, v: rv, rate: rt, fee: mo === 'pyg' ? tx : 0 }];
        s.troco = [];
        s.lote = it.lote || '';
        S.sales.push(s);
      }
    }
    S.sales.sort(function (a, b) { return b.ts - a.ts; });
    // contas pagas mês a mês
    var dias = { 1: 5, 2: 15, 3: 10, 4: 20, 5: 5, 6: 12, 7: 1 };
    S.cpay = [];
    S.dlog = [];
    S.exp.forEach(function (e) {
      e.dia = dias[e.id] || 10;
      e.paid = {};
      for (var m = 13; m >= 0; m--) {
        var base = new Date(hoje.getFullYear(), hoje.getMonth() - m, Math.min(e.dia, 28), 11),
          ym = base.getFullYear() + '-' + ('0' + (base.getMonth() + 1)).slice(-2);
        if (m === 0 && (e.dia > hoje.getDate() || e.tipo === 'variavel')) continue;
        var v = e.valor * (1 - 0.006 * m) * (e.tipo === 'variavel' ? 0.88 + R() * 0.24 : 1);
        v = Math.round(v / 1000) * 1000;
        var ts = base.getTime();
        e.paid[ym] = ts;
        S.cpay.push({ ts: ts, id: e.id, ym: ym, nome: e.nome, valor: v, cat: e.cat, moeda: 'pyg', orig: v });
        S.dlog.push({ ts: ts, kind: 'pago', nome: e.nome, desc: e.nome + ' (' + CATS[e.cat] + ')', valor: v, moeda: 'pyg', orig: v });
      }
    });
    S.exp.forEach(function (e) {
      e.hist.forEach(function (x) {
        S.dlog.push({ ts: x.ts, kind: 'alt', nome: e.nome, cat: e.cat, de: x.de, para: x.para });
      });
    });
    // retiradas do dono, imprevistos, melhorias
    S.retiradas = [];
    for (var m2 = 13; m2 >= 0; m2--) {
      var tr = dia(m2 * 30 + 3, 17),
        vr = Math.round((250000 + R() * 450000) / 10000) * 10000;
      S.retiradas.unshift({ ts: tr, moeda: 'pyg', orig: vr, valor: vr, nota: pick(['Retirada do mês', 'Compras de casa', 'Mercado', 'Escola']) });
      S.dlog.push({ ts: tr, kind: 'ret', desc: S.retiradas[0].nota, valor: vr, moeda: 'pyg', orig: vr });
    }
    S.imprev = [];
    [[390, 'Troca de lâmpadas', 90000], [310, 'Conserto do ar-condicionado', 380000], [220, 'Fechadura nova', 120000], [140, 'Vazamento no banheiro', 210000], [60, 'Impressora', 150000], [6, 'Conserto da vitrine', 60000]].forEach(function (a) {
      var x = { ts: dia(a[0], 15), desc: a[1], valor: a[2] };
      S.imprev.push(x);
      S.dlog.push(dlogImp(x));
    });
    S.melhUso = [];
    [[330, 'Vitrine iluminada', 80000], [190, 'Placa da loja', 120000], [8, 'Tinta da fachada', 15000]].forEach(function (a) {
      var x = { ts: dia(a[0], 16), desc: a[1], valor: a[2] };
      S.melhUso.push(x);
      S.dlog.push(dlogMelh(x));
    });
    // compras de lotes e entradas de estoque
    S.compras = [];
    S.lotes = [];
    S.elog = [];
    var lotes = [[410, 0.44, 400], [345, 0.45, 300], [280, 0.46, 400], [215, 0.47, 300], [150, 0.48, 400], [90, 0.49, 300], [60, 0.46, 400], [19, 0.5, 400]];
    lotes.forEach(function (l, i) {
      var tsl = dia(l[0], 10),
        usdv = Math.round(l[1] * l[2] * 100) / 100,
        c = { ts: tsl, desc: 'Lote #' + (3000 + i * 37) + ' pré-graduados', usd: usdv };
      S.compras.push(c);
      S.dlog.push(dlogLote(c));
      S.lotes.push({ id: '#' + (3000 + i * 37), ts: tsl, usd: l[1], txt: 'Pré-graduados' });
      var ref = pick(['SP57765', 'SP58110', 'SP60627', 'SP59002']),
        itx = S.items.filter(function (z) { return z.ref === ref; })[0];
      S.elog.push({ ts: tsl, tipo: 'pre', ref: ref, cor: itx.cor, grau: itx.grau, qty: 20 + Math.floor(R() * 15) });
    });
    S.elog.push({ ts: dia(2, 15), tipo: 'pre', ref: 'SP58110', cor: 'Preto', grau: '+1.25', qty: 6 }, { ts: dia(5, 14), tipo: 'sem', ref: 'BR44133', cor: 'Vinho', grau: '', qty: 4 });
    // trocas de moeda
    S.cambios = [];
    for (var q = 0; q < 12; q++) {
      var tq = dia(10 + q * 34, 13),
        fq = fxDe(tq),
        dado = Math.round((600000 + R() * 900000) / 50000) * 50000,
        para = R() < 0.7 ? 'usd' : 'brl',
        recq = para === 'usd' ? Math.round((dado / (fq.pyg * 1.01)) * 100) / 100 : Math.round((dado / ((fq.pyg / fq.brl) * 1.01)) * 100) / 100;
      S.cambios.push({ ts: tq, de: 'pyg', para: para, dado: dado, rec: recq, difGs: -Math.round(dado * 0.01) });
    }
    // contagens e descartes
    S.contagens = [];
    S.descartes = [];
    S.conf = {};
    [[200, 'SP57765', 'Preto', -2], [95, 'SP60627', 'Bege translúcido', -1], [40, 'BR44118', 'Preto', 1]].forEach(function (a) {
      var tsc = dia(a[0], 18),
        usdv = a[3] * 0.48;
      S.contagens.push({ ts: tsc, difs: 1, valorUsd: usdv, vendaGs: a[3] * 45000, itens: [{ ref: a[1], cor: a[2], dif: a[3], usd: usdv }] });
      S.elog.push({ ts: tsc, tipo: a[1].slice(0, 2) === 'BR' ? 'sem' : 'pre', ref: a[1], cor: a[2], grau: '', qty: a[3], contagem: true });
    });
    [[300, 'SP58110', 'Preto', 3, 'veio quebrada'], [125, 'SP57765', 'Preto', 2, 'lente riscada'], [30, 'SP59002', 'Tartaruga', 1, 'haste quebrada']].forEach(function (a) {
      var tsd = dia(a[0], 16),
        usdv = Math.round(a[3] * 0.48 * 100) / 100,
        val = Math.round(usdv * fxDe(tsd).pyg);
      S.descartes.push({ ts: tsd, ref: a[1], cor: a[2], qty: a[3], usd: usdv, valor: val, motivo: a[4] });
      S.dlog.push({ ts: tsd, kind: 'descarte', desc: a[3] + '× ' + a[1] + ' · ' + a[2] + ' (' + a[4] + ')', valor: val, usd: usdv });
      S.elog.push({ ts: tsd, tipo: 'pre', ref: a[1], cor: a[2], grau: '', qty: -a[3], descarte: true });
    });
    S.conf = { 'pre|SP57765': dia(20, 18), 'solar|SL2201': dia(45, 18) };
    S.day = dayKey(Date.now());
    S.hDias = 30;
    S.hq = '';
    return S.sales.length;
  }
  // Valores do exemplo de 14 meses ao abrir o app novo.
  exGerar();
