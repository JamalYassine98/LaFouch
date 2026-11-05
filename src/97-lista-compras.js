  // ===== Lista de compras melhorada (v428, aprovado 04/11/2026) =====
  // Sem cor (o dono não controla cor na compra). Pré-graduados por GRAU. Três seções: Acabando, Época chegando
  // e Não recompre. Quantidade com − / +. Total comparado com o dinheiro da reposição. Compartilhar com o
  // fornecedor. "Marcar como pedido" guarda o pedido e confere sozinho quando a mercadoria entra.
  S.lcQtd = {}; // chave -> quantidade escolhida pelo dono
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
      x.q = S.lcQtd[x.k] != null ? S.lcQtd[x.k] : x.sug;
    });
    out.total = out.todos.reduce(function (a, x) {
      return a + x.q * x.cu;
    }, 0);
    out.porIdeal = porIdeal;
    out.novo = lcComprarNovo();
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
  // "O que comprar de NOVO": formato/material que vende bem acima da média e tem poucos modelos.
  function lcComprarNovo() {
    var lim = Date.now() - 90 * DAY,
      ven = {},
      mods = {},
      tv = 0,
      tm = 0,
      visto = {};
    S.items.forEach(function (i) {
      if (i.bulk || isSimple(i.tipo) || visto[i.ref] || !(i.qty > 0)) return;
      visto[i.ref] = 1;
      tm++;
      var a = attrOf(i.ref) || {};
      ['formato', 'material'].forEach(function (c) {
        if (a[c]) mods[c + '|' + a[c]] = (mods[c + '|' + a[c]] || 0) + 1;
      });
    });
    (S.sales || []).forEach(function (s) {
      if (s.estorno || s.ts < lim || isSimple(s.tipo)) return;
      tv += s.qty;
      var a = attrOf(s.ref) || {};
      ['formato', 'material'].forEach(function (c) {
        if (a[c]) ven[c + '|' + a[c]] = (ven[c + '|' + a[c]] || 0) + s.qty;
      });
    });
    if (!tv || !tm) return [];
    var media = tv / tm,
      o = [];
    Object.keys(ven).forEach(function (k) {
      var nm = mods[k] || 0,
        v = ven[k];
      if (v < 5 || nm > 3) return;
      var r = v / Math.max(1, nm) / media;
      if (r < 1.8) return;
      var p = k.split('|');
      o.push({ k: k, c: p[0], v: p[1], r: r, nm: nm, q: v });
    });
    return o.sort(function (a, b) {
      return b.r - a.r;
    }).slice(0, 2);
  }
  function lcNoPedido(k) {
    var P = S.lcPed;
    if (!P) return false;
    return P.itens.some(function (p) {
      return p.k === k && lcEntrou(p) < p.q;
    });
  }
  function lcNome(x) {
    return pn(x.m.ref) + (x.grau ? ' · grau ' + x.grau : '');
  }
  function lcThumb(ref) {
    var f = photoOf(ref);
    return '<span class="lcTh">' + (f ? '<img src="' + esc(f) + '" alt="">' : '<i>sem foto</i>') + '</span>';
  }
  function lcLinha(x) {
    return (
      '<div class="sl lcL">' + lcThumb(x.m.ref) + '<span>' + dxNome(x.m) + (x.grau ? ' <b class="lcG">' + esc(x.grau) + '</b>' : '') + '<small' + (x.esp ? ' class="lcEsp"' : '') + '>' + esc(x.mot) + '</small></span>' +
      '<span class="lcQ"><button type="button" class="mini" data-act="lcMenos" data-id="' + esc(x.k) + '" aria-label="Menos">−</button><b>' + x.q + '</b><button type="button" class="mini" data-act="lcMais" data-id="' + esc(x.k) + '" aria-label="Mais">+</button></span></div>'
    );
  }
  function lcSobraLinha(b) {
    var d = isFinite(b.dias) ? Math.round(b.dias) : 0,
      vira = d > 90;
    return (
      '<div class="sl lcL">' + lcThumb(b.m.ref) + '<span>' + dxNome(b.m) + (b.grau ? ' <b class="lcG">' + esc(b.grau) + '</b>' : '') +
      (b.of ? ' <span class="lcPill">oferta</span>' : '') + (b.aMais ? ' <span class="lcPill">veio +' + b.aMais + ' a mais</span>' : '') +
      '<small>Ideal ' + b.ideal + ' · Tem ' + b.stock + ' · <b class="lcSo">Sobra ' + b.sobra + '</b>' + (d ? ' · acaba em ~' + d + ' dias' : '') + '</small>' +
      (b.of ? '<small class="lcOfV">A oferta valeu? Economizou ' + usd(b.of.econ) + ' · ' + (vira ? 'ainda não: o extra está parado mais tempo do que a economia compensa' : 'sim, se vender no ritmo atual') + '</small>' : '') +
      (vira ? '<small class="lcVira">Vai virar parada · colocar em oferta?</small>' : '') +
      '</span><span class="lcV' + (vira ? ' bad' : '') + '">' + usd0(b.valor) + (vira ? '<button type="button" class="mini" data-act="lcOferta" data-id="' + esc(b.m.tipo + '|' + b.m.ref) + '">Oferta ›</button>' : '') + '</span></div>'
    );
  }
  function lcHtml() {
    var L = lcLista(),
      rp = fxRepo(),
      h = '<section class="card col lcCard" id="lcCard"><div class="hint" style="margin:0">Sem cor. Pré-graduados por grau. Cobre ~45 dias, corrigido pela estação. Ajuste com − e +.</div>';
    if (L.sobra.length)
      h += '<div class="lcSobTop"><span><b>Sobrando</b><small>em mercadoria acima do ideal · ' + L.pecasSobra + (L.pecasSobra === 1 ? ' peça' : ' peças') + '</small></span><b>' + usd0(L.parado) + '</b></div>';
    h += lcPedHtml();
    if (L.novo.length)
      h += '<div class="lcNovo">' + L.novo.map(function (n) {
        return '<div><b>Comprar de novo:</b> ' + esc(n.v) + ' (' + (n.c === 'formato' ? 'formato' : 'material') + ') vende ' + (Math.round(n.r * 10) / 10).toString().replace('.', ',') + '× a média e você só tem ' + n.nm + (n.nm === 1 ? ' modelo' : ' modelos') + '.</div>';
      }).join('') + '</div>';
    if (!L.todos.length && !L.nao.length && !L.sobra.length) return h + '<div class="note n-ok">Nada para comprar agora.</div></section>';
    var sec = function (t, l, cor) {
      if (!l.length) return '';
      return '<div class="lcSec" style="color:' + cor + '">' + t + ' · ' + l.length + '</div><div class="split">' + l.map(lcLinha).join('') + '</div>';
    };
    h += sec('Acabando', L.acab, 'var(--warn)');
    h += sec('Época chegando', L.epoca, 'var(--accent-fg)');
    if (L.sobra.length) h += '<div class="lcSec" style="color:var(--warn)">Sobrando · ' + L.sobra.length + '</div><div class="split">' + L.sobra.map(lcSobraLinha).join('') + '</div>';
    if (L.nao.length)
      h += '<div class="lcSec" style="color:var(--sub)">Não recompre · ' + L.nao.length + '</div><div class="split">' + L.nao.map(function (x) {
        return '<div class="sl"><span>' + dxNome(x.m) + '<small>' + esc(x.mot) + '</small></span></div>';
      }).join('') + '</div>';
    if (L.todos.length) {
      var pct = rp.tot > 0 ? Math.min(100, Math.round((L.total / rp.tot) * 100)) : 0,
        sobra = rp.tot - L.total;
      h +=
        '<div class="lcTot"><div style="display:flex;justify-content:space-between;align-items:baseline"><span>Total <b>' + usd0(L.total) + '</b></span><span class="hint" style="margin:0">reposição ' + usd0(rp.tot) + '</span></div>' +
        '<div class="lcBar"><i style="width:' + pct + '%;background:' + (sobra < 0 ? 'var(--warn)' : 'var(--ok)') + '"></i></div>' +
        '<div class="hint" style="margin:0">' + (rp.tot <= 0 ? 'Sem dinheiro de reposição guardado ainda.' : sobra >= 0 ? 'Cabe no dinheiro da reposição (sobram ' + usd0(sobra) + ').' : 'Passa ' + usd0(-sobra) + ' do dinheiro da reposição.') + '</div></div>' +
        '<button type="button" class="go" data-act="lcPedir">Marcar como pedido</button><button type="button" class="mini" data-act="lcEnvia" style="width:100%">Mandar ao fornecedor</button>';
    }
    return h + '</section>';
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
  function lcPedHtml() {
    var P = S.lcPed;
    if (!P || !P.itens.length) return '';
    var ok = 0,
      ls = P.itens.map(function (p) {
        var ch = Math.min(p.q, Math.max(0, lcEntrou(p)));
        if (ch >= p.q) ok++;
        return '<div class="sl"><span>' + esc(pn(p.ref)) + (p.grau ? ' <b class="lcG">' + esc(p.grau) + '</b>' : '') + '</span><b style="color:' + (ch >= p.q ? 'var(--ok)' : 'var(--sub)') + '">' + (ch >= p.q ? '✓ chegou' : ch + ' de ' + p.q) + '</b></div>';
      });
    return (
      '<details class="lcPed"' + (ok < P.itens.length ? ' open' : '') + '><summary><b>Pedido de ' + new Date(P.ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + '</b> · ' + ok + ' de ' + P.itens.length + ' chegaram</summary><div class="split">' + ls.join('') + '</div>' +
      '<button type="button" class="mini" data-act="lcPedFim" style="margin-top:8px">' + (ok >= P.itens.length ? 'Concluir pedido' : 'Apagar pedido') + '</button></details>'
    );
  }
  function lcMuda(k, d) {
    var L = lcLista(),
      x = L.todos.filter(function (y) {
        return y.k === k;
      })[0];
    if (!x) return;
    S.lcQtd[k] = Math.max(0, x.q + d);
    saveSoon();
    render();
  }
  ACT.lcMais = function (k) {
    lcMuda(k, 1);
  };
  ACT.lcMenos = function (k) {
    lcMuda(k, -1);
  };
  function lcPedirJa(L) {
    var its = L.todos.filter(function (x) {
        return x.q > 0;
      }).map(function (x) {
        var p = { k: x.k, ref: x.m.ref, tipo: x.m.tipo, grau: x.grau, q: x.q };
        p.s0 = lcStockDe(p);
        return p;
      });
    if (!its.length) return;
    S.lcPed = { ts: Date.now(), itens: its };
    S.lcQtd = {};
    saveSoon();
    lfToast('Pedido guardado · confiro quando a mercadoria entrar');
    render();
  }
  // Peças que ficariam acima do ideal depois que o pedido chegar.
  function lcExcessoPedido(L) {
    return L.todos.filter(function (x) {
      return x.q > 0 && x.ideal > 0 && x.stock + x.q > x.ideal + Math.max(1, Math.round(x.ideal * 0.25));
    }).map(function (x) {
      return { x: x, mais: x.stock + x.q - x.ideal };
    });
  }
  ACT.lcPedir = function () {
    var L = lcLista(),
      ex = lcExcessoPedido(L);
    if (!ex.length) return lcPedirJa(L);
    var pecas = ex.reduce(function (a, e) {
        return a + e.mais;
      }, 0),
      val = ex.reduce(function (a, e) {
        return a + e.mais * e.x.cu;
      }, 0);
    lfJanela({
      titulo: 'Este pedido deixa peças sobrando',
      cls: 'lcAvJn',
      monta: function (c, api) {
        c.innerHTML =
          '<div class="hint" style="margin:0 0 6px">Depois de chegar, ficariam acima do ideal:</div>' +
          ex.map(function (e) {
            return '<div class="sl lcL">' + lcThumb(e.x.m.ref) + '<span>' + esc(lcNome(e.x)) + '<small>Ideal ' + e.x.ideal + ' · ficaria com ' + (e.x.stock + e.x.q) + '</small></span><b class="lcSo">+' + e.mais + '</b></div>';
          }).join('') +
          '<div class="sl"><span><b>Total sobrando</b></span><b class="lcSo">' + pecas + (pecas === 1 ? ' peça' : ' peças') + ' · ' + usd0(val) + '</b></div>' +
          '<button type="button" class="go" id="lcAj">Ajustar para o ideal</button><button type="button" class="mini" id="lcSeg" style="width:100%">Continuar mesmo assim</button>';
        c.querySelector('#lcAj').onclick = function () {
          ex.forEach(function (e) {
            S.lcQtd[e.x.k] = Math.max(0, e.x.ideal - e.x.stock);
          });
          saveSoon();
          api.fecha();
          render();
        };
        c.querySelector('#lcSeg').onclick = function () {
          api.fecha();
          lcPedirJa(lcLista());
        };
      }
    });
  };
  ACT.lcOferta = function (id) {
    var p = String(id).split('|');
    S.tipo = p[0];
    S.open = p.slice(1).join('|');
    S.det = true;
    S.lotesView = false;
    setView('estoque');
  };
  ACT.lcPedFim = function () {
    S.lcPed = null;
    saveSoon();
    render();
  };
  function lcTexto(forn) {
    var L = lcLista(),
      porRef = {},
      ord = [];
    L.todos.forEach(function (x) {
      if (!(x.q > 0)) return;
      if (forn != null && lcForn(x.m.ref) !== forn) return;
      var r = x.m.ref;
      if (!porRef[r]) {
        porRef[r] = [];
        ord.push(r);
      }
      porRef[r].push(x);
    });
    return (
      'Pedido La Fouch · ' + new Date().toLocaleDateString('pt-BR') + '\n\n' +
      ord.map(function (r) {
        var l = porRef[r];
        return l[0].grau ? r + '\n' + l.map(function (x) { return '  grau ' + x.grau + ': ' + x.q; }).join('\n') : r + ': ' + l[0].q;
      }).join('\n') +
      '\n\nCores variadas.'
    );
  }
  // Fornecedores do pedido de agora (cada um recebe só as peças dele).
  function lcForns() {
    var o = {},
      ord = [];
    lcLista().todos.forEach(function (x) {
      if (!(x.q > 0)) return;
      var f = lcForn(x.m.ref);
      if (!o[f]) {
        o[f] = 0;
        ord.push(f);
      }
      o[f] += x.q;
    });
    return ord.map(function (f) {
      return { f: f, q: o[f] };
    });
  }
  function lcManda(t) {
    var P = shPlug(),
      u = SH_APPS.filter(function (a) {
        return a.id === shUlt();
      })[0];
    if (P) return P.send({ pkg: (u && u.pkg) || '', text: t, files: [] }).catch(function () {});
    if (navigator.share) return navigator.share({ text: t }).catch(function () {});
    window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank');
  }
  ACT.lcEnvia = function () {
    var fs = lcForns();
    if (fs.length <= 1) return lcManda(lcTexto());
    lfJanela({
      titulo: 'Mandar ao fornecedor',
      monta: function (c, api) {
        c.innerHTML =
          '<div class="hint" style="margin:0 0 6px">Cada fornecedor recebe só as peças dele.</div>' +
          fs.map(function (f, i) {
            return '<button type="button" class="mini lcFb" data-i="' + i + '" style="width:100%;margin:4px 0">' + esc(f.f || 'Sem fornecedor') + ' · ' + f.q + (f.q === 1 ? ' peça' : ' peças') + ' ›</button>';
          }).join('');
        [].forEach.call(c.querySelectorAll('.lcFb'), function (b) {
          b.onclick = function () {
            var f = fs[+b.dataset.i];
            lcManda(lcTexto(f.f));
            b.classList.add('on');
            b.textContent = '✓ ' + b.textContent;
          };
        });
      }
    });
  };
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
          st = ch >= p.q ? (ch > p.q ? '<b class="lcSo">sobra ' + (ch - p.q) + '</b>' : '<b style="color:var(--ok)">✓</b>') : '<b style="color:var(--bad,#ff8f8f)">faltou ' + (p.q - ch) + '</b>';
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
