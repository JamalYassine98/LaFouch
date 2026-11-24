  // ===== Lista de compras: os DADOS (v428) — a tela é Peças › Compras (src/97z5-compras.js, 66, 22/11/2026) =====
  // lcLista: o que acaba (pelo ritmo de venda, com a estação), a época chegando e o que sobra. Sem cor; pré-graduados por GRAU.
  // A lista do Giro (− / +, "Marcar como pedido", "Mandar ao fornecedor", "como calcula") saiu: Compras pede por vaga.
  // S.lcPed (pedido antigo) continua só para conferir o que ainda chegar dele (Chegou mercadoria · lcPedResumoHtml).
  S.lcPed = null; // {ts, itens:[{k, ref, tipo, grau, q, s0}]}
  function lcChave(tipo, ref, grau) {
    return tipo + '|' + ref + (grau ? '|' + grau : '');
  }
  // Estoque e vendas (30 dias, corrigidas pela estação) por grau de um modelo de pré-graduado.
  function lcGraus(m) {
    var g = {},
      now = Date.now();
    S.items.forEach(function (i) {
      if (i.ref !== m.ref || i.tipo !== m.tipo || i.bulk) return;
      var k = i.grau || '';
      (g[k] = g[k] || { grau: k, stock: 0, adj30: 0 }).stock += i.qty > 0 ? i.qty : 0;
    });
    S.sales.forEach(function (s) {
      if (s.estorno || s.ref !== m.ref || s.tipo !== m.tipo || now - s.ts > 30 * DAY) return;
      var k = s.grau || '';
      (g[k] = g[k] || { grau: k, stock: 0, adj30: 0 }).adj30 += s.qty / sazonFator(s.tipo, new Date(s.ts).getMonth());
    });
    return Object.keys(g).map(function (k) {
      return g[k];
    });
  }
  // ---------- v440: ideal × tem × sobra, avise-me, fornecedor, oferta, comprar de novo ----------
  var LC_COBRE = 1.5; // ideal = ~45 dias de venda (1,5 mês), corrigido pela estação
  // Vendas dos últimos 90 dias por chave (tipo|ref|grau), corrigidas pela estação (para o ideal de quem vende devagar).
  function lcVendas90() {
    var lim = Date.now() - 90 * DAY,
      o = {};
    (S.sales || []).forEach(function (s) {
      if (s.estorno || s.ts < lim) return;
      var q = s.qty / sazonFator(s.tipo, new Date(s.ts).getMonth()),
        k1 = s.tipo + '|' + s.ref;
      o[k1] = (o[k1] || 0) + q;
      if (s.grau) o[k1 + '|' + s.grau] = (o[k1 + '|' + s.grau] || 0) + q;
    });
    return o;
  }
  // Clientes esperando a peça voltar (Avise-me do site).
  function lcEspera(ref) {
    return (S.espera || []).filter(function (e) {
      return e.ref === ref && !e.av;
    }).length;
  }
  // Fornecedor do modelo: o da compra mais recente que trouxe a peça.
  function lcForn(ref) {
    var best = null;
    S.items.forEach(function (i) {
      if (i.ref !== ref || !i.lote) return;
      var g = S.grp.filter(function (x) {
        return x.id === i.lote;
      })[0];
      if (g && g.forn && (!best || (+g.ts || 0) > (+best.ts || 0))) best = g;
    });
    return best ? String(best.forn).trim() : '';
  }
  // Compra mais barata que a anterior = oferta (economia em US$ nas peças da compra nova).
  function lcOferta(ref) {
    var porLote = {};
    S.items.forEach(function (i) {
      if (i.ref !== ref || i.bulk || !i.lote) return;
      var c = baseCusto(i);
      if (!(c > 0)) return;
      var g = S.grp.filter(function (x) {
        return x.id === i.lote;
      })[0];
      var L = (porLote[i.lote] = porLote[i.lote] || { ts: g ? +g.ts || 0 : 0, c: c, q: 0 });
      L.q += i.qty > 0 ? i.qty : 0;
    });
    var ls = Object.keys(porLote).map(function (k) {
      return porLote[k];
    }).sort(function (a, b) {
      return b.ts - a.ts;
    });
    if (ls.length < 2) return null;
    var novo = ls[0],
      ant = ls[1];
    if (!(novo.c < ant.c * 0.95)) return null;
    return { de: ant.c, por: novo.c, econ: Math.round((ant.c - novo.c) * Math.max(1, novo.q) * 100) / 100, desde: novo.ts };
  }
  function lcLista() {
    var mesQ = new Date(Date.now() + 15 * DAY).getMonth(),
      mesP = new Date(Date.now() + 45 * DAY).getMonth(),
      out = { acab: [], epoca: [], nao: [], sobra: [], novo: [] },
      vistos = {},
      v90 = lcVendas90(),
      porIdeal = {};
    prodStats().forEach(function (m) {
      if (isSimple(m.tipo) || (m.it && m.it.bulk)) return;
      var fQ = sazonFator(m.tipo, mesQ),
        fP = sazonFator(m.tipo, mesP),
        linhas = m.tipo === 'pre' ? lcGraus(m) : [{ grau: '', stock: m.stock, adj30: m.adj30 }];
      linhas.forEach(function (l) {
        var k = lcChave(m.tipo, m.ref, l.grau),
          r90 = (v90[m.tipo + '|' + m.ref + (l.grau ? '|' + l.grau : '')] || 0) / 3,
          mes = l.adj30 > 0 ? l.adj30 : r90, // venda por mês (30 dias; quem vende devagar usa 90 dias)
          e = mes * fQ,
          ideal = e > 0 ? Math.max(1, Math.ceil(e * LC_COBRE)) : 0,
          dias = e > 0 ? l.stock / (e / 30) : Infinity,
          esp = l.grau ? 0 : lcEspera(m.ref),
          base = { k: k, m: m, grau: l.grau, stock: l.stock, cu: m.cu || 0, ideal: ideal, esp: esp, dias: dias };
        porIdeal[k] = base;
        if (lcNoPedido(k)) return;
        if (esp > 0 && l.stock <= 0) {
          base.sug = Math.max(esp, ideal - l.stock, 1);
          base.mot = esp + (esp === 1 ? ' cliente esperando' : ' clientes esperando') + ' · Ideal ' + ideal + ' · Tem ' + l.stock;
          out.acab.push(base);
        } else if (e > 0 && dias <= 21) {
          base.sug = Math.max(1, Math.ceil(e * LC_COBRE - l.stock));
          base.mot = 'Ideal ' + ideal + ' · Tem ' + l.stock + ' · restam ~' + Math.round(dias) + ' dias' + (esp ? ' · ' + esp + ' esperando' : '');
          out.acab.push(base);
        } else if (l.adj30 > 0 && fP >= fQ * 1.25 && l.stock < l.adj30 * fP * LC_COBRE) {
          base.sug = Math.max(1, Math.ceil(l.adj30 * fP * LC_COBRE - l.stock));
          base.mot = 'a época vende ' + Math.round((fP / fQ - 1) * 100) + '% mais · Ideal ' + Math.ceil(l.adj30 * fP * LC_COBRE) + ' · Tem ' + l.stock;
          out.epoca.push(base);
        }
      });
    });
    // modelo novo sem venda ainda: o ideal vem dos parecidos
    Object.keys(porIdeal).forEach(function (k) {
      var b = porIdeal[k];
      if (b.ideal > 0 || b.grau || !(b.stock > 0)) return;
      var pr = (typeof parecidas === 'function' ? parecidas(b.m.ref, b.m.tipo, 6) : []) || [],
        id = pr
          .map(function (p) {
            var it = p.it || p,
              x = porIdeal[lcChave(it.tipo || b.m.tipo, it.ref, '')];
            return x ? x.ideal : 0;
          })
          .filter(function (v) {
            return v > 0;
          });
      var ent = (S.elog || []).filter(function (e) {
        return e.ref === b.m.ref && e.qty > 0;
      });
      var recente = ent.length && Date.now() - Math.max.apply(null, ent.map(function (e) { return e.ts; })) < 60 * DAY;
      if (recente && id.length) {
        b.ideal = Math.max(1, Math.round(id.reduce(function (a, v) { return a + v; }, 0) / id.length));
        b.novoM = true;
      }
    });
    // SOBRANDO: estoque acima do ideal (marcado sozinho)
    var tipoSobra = {};
    Object.keys(porIdeal).forEach(function (k) {
      var b = porIdeal[k];
      if (!(b.ideal > 0)) return;
      var so = b.stock - b.ideal;
      if (so < 2 || so <= b.ideal * 0.25) return;
      b.sobra = so;
      b.valor = so * b.cu;
      b.of = b.grau ? null : lcOferta(b.m.ref);
      b.aMais = lcAMais(k);
      out.sobra.push(b);
      tipoSobra[b.m.tipo] = (tipoSobra[b.m.tipo] || 0) + b.valor;
    });
    out.sobra.sort(function (a, b) {
      return b.valor - a.valor;
    });
    out.parado = out.sobra.reduce(function (a, b) {
      return a + b.valor;
    }, 0);
    out.pecasSobra = out.sobra.reduce(function (a, b) {
      return a + b.sobra;
    }, 0);
    // o tipo que já sobra muito recebe sugestão menor
    out.acab.concat(out.epoca).forEach(function (x) {
      var ts = tipoSobra[x.m.tipo] || 0;
      if (ts >= 100 && x.sug > 1 && !x.esp) {
        x.sug = Math.max(1, Math.ceil(x.sug / 2));
        x.mot += ' · ' + ((tipoOf(x.m.tipo) || {}).label || 'esse tipo') + ' já tem ' + usd0(ts) + ' sobrando · sugeri menos';
      }
    });
    parados().forEach(function (m) {
      if (vistos[m.key]) return;
      vistos[m.key] = 1;
      out.nao.push({ k: m.key, m: m, mot: Math.round(m.diasParado) + ' dias sem vender · ' + m.stock + ' un.' });
    });
    var ordem = function (a, b) {
      return (b.esp || 0) - (a.esp || 0) || b.m.profit30 - a.m.profit30;
    };
    out.acab.sort(ordem);
    out.epoca.sort(ordem);
    out.nao = out.nao.slice(0, 8);
    out.todos = out.acab.concat(out.epoca);
    out.todos.forEach(function (x) {
      x.q = x.sug;
    });
    out.total = out.todos.reduce(function (a, x) {
      return a + x.q * x.cu;
    }, 0);
    out.porIdeal = porIdeal;
    return out;
  }
  // O que veio a mais no pedido (entrou mais do que o pedido).
  function lcAMais(k) {
    var P = S.lcPed;
    if (!P) return 0;
    var p = P.itens.filter(function (x) {
      return x.k === k;
    })[0];
    if (!p) return 0;
    return Math.max(0, lcEntrou(p) - p.q);
  }
  function lcNoPedido(k) {
    var P = S.lcPed;
    if (!P) return false;
    return P.itens.some(function (p) {
      return p.k === k && lcEntrou(p) < p.q;
    });
  }
  function lcThumb(ref) {
    var f = photoOf(ref);
    return '<span class="lcTh' + (f ? '' : ' lcTh0') + '">' + (f ? '<img src="' + esc(f) + '" alt="">' : SEM_FOTO_SVG) + '</span>';
  }
  function lcNomeL(m, grau) {
    return '<span class="lcN"><span>' + esc(pn(m.ref)) + '</span>' + (grau ? ' <b class="lcG">' + esc(grau) + '</b>' : '') + '</span>';
  }
  function lcSobraLinha(b) {
    var d = isFinite(b.dias) ? Math.round(b.dias) : 0,
      vira = d > 90;
    return (
      '<div class="sl lcL">' + lcThumb(b.m.ref) + '<span>' + lcNomeL(b.m, b.grau) +
      (b.of ? ' <span class="lcPill">oferta</span>' : '') + (b.aMais ? ' <span class="lcPill">veio +' + b.aMais + ' a mais</span>' : '') +
      '<small>Tem ' + b.stock + ' · <b class="lcSo">Sobra ' + b.sobra + '</b>' + (d ? ' · acaba em ~' + d + ' dias' : '') + '</small>' +
      (b.of ? '<small class="lcOfV">A oferta valeu? Economizou ' + usd(b.of.econ) + ' · ' + (vira ? 'ainda não: o extra está parado mais tempo do que a economia compensa' : 'sim, se vender no ritmo atual') + '</small>' : '') +
      (vira ? '<small class="lcVira">vai virar parada</small>' : '') +
      '</span><span class="lcV' + (vira ? ' bad' : '') + '">' + usd0(b.valor) + (vira ? lcOfBtn(b.m) : '') + '</span></div>'
    );
  }
  // "Oferta ›" de uma peça (Sobrando aqui e Parados e sobrando no Inventário): abre a janela Oferta do produto
  function lcOfBtn(m) {
    return '<button type="button" class="lcOf' + lkCls(true) + '" data-act="lcOferta" data-id="' + esc(m.tipo + '|' + m.ref) + '">Oferta ›</button>';
  }
  // Pedido feito: confere sozinho pelo estoque que entrou.
  function lcStockDe(p) {
    return S.items.reduce(function (a, i) {
      return a + (i.ref === p.ref && i.tipo === p.tipo && (!p.grau || i.grau === p.grau) && i.qty > 0 ? i.qty : 0);
    }, 0);
  }
  function lcEntrou(p) {
    var t = 0;
    (S.elog || []).forEach(function (e) {
      if (e.ref === p.ref && e.qty > 0 && e.ts >= S.lcPed.ts && (!p.grau || !e.grau || e.grau === p.grau)) t += e.qty;
    });
    return Math.max(t, lcStockDe(p) - p.s0);
  }
  ACT.lcOferta = function (id) {
    var p = String(id).split('|'), ref = p.slice(1).join('|');
    prodAbre(p[0], ref);
    ofertaJanela(ref); // 64: a mesma janela Oferta da ficha
  };
  function lcManda(t) {
    var P = shPlug(),
      u = SH_APPS.filter(function (a) {
        return a.id === shUlt();
      })[0];
    if (P) return P.send({ pkg: (u && u.pkg) || '', text: t, files: [] }).catch(function () {});
    if (navigator.share) return navigator.share({ text: t }).catch(function () {});
    window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank');
  }
  // Entrada da compra (Chegou mercadoria): o que chegou do pedido da lista, o que faltou, o que sobra e as ofertas.
  function lcPedResumoHtml(ids) {
    var P = S.lcPed;
    if (!P || !P.itens.length) return '';
    var refsLote = {},
      L = lcLista();
    S.items.forEach(function (i) {
      if (i.lote && ids.indexOf(i.lote) >= 0) refsLote[i.tipo + '|' + i.ref] = 1;
    });
    var noPed = {},
      linhas = P.itens.map(function (p) {
        noPed[p.tipo + '|' + p.ref] = 1;
        var ch = Math.max(0, lcEntrou(p)),
          st = ch >= p.q ? (ch > p.q ? '<b class="lcSo">sobra ' + (ch - p.q) + '</b>' : '<b style="color:var(--ok)">' + ICO.chk + '</b>') : '<b style="color:var(--bad,#ff8f8f)">faltou ' + (p.q - ch) + '</b>';
        return '<div class="sl lcL">' + lcThumb(p.ref) + '<span>' + esc(pn(p.ref)) + (p.grau ? ' <b class="lcG">' + esc(p.grau) + '</b>' : '') + '<small>pedido ' + p.q + ' · chegou ' + ch + '</small></span>' + st + '</div>';
      });
    Object.keys(refsLote).forEach(function (k) {
      if (noPed[k]) return;
      var b = L.porIdeal[k];
      var ref = k.split('|').slice(1).join('|');
      if (!b) return;
      var so = b.ideal > 0 ? b.stock - b.ideal : 0;
      linhas.push('<div class="sl lcL">' + lcThumb(ref) + '<span>' + esc(pn(ref)) + '<small>não pedido · Ideal ' + b.ideal + ' → tem ' + b.stock + '</small></span>' + (so > 0 ? '<b class="lcSo">sobra ' + so + '</b>' : '<b>—</b>') + '</div>');
      var of = lcOferta(ref);
      if (of) linhas.push('<div class="sl"><span style="font-size:12.5px">' + esc(pn(ref)) + ' veio mais barato (' + usd(of.de) + ' → ' + usd(of.por) + ')</span><b style="color:var(--ok)">oferta · −' + usd(of.econ) + '</b></div>');
    });
    return '<div class="fmBox lcPedBox"><div class="lbl">Do pedido da lista (' + new Date(P.ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ')</div>' + linhas.join('') + '</div>';
  }
