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
  function lcLista() {
    var mesQ = new Date(Date.now() + 15 * DAY).getMonth(),
      mesP = new Date(Date.now() + 45 * DAY).getMonth(),
      out = { acab: [], epoca: [], nao: [] },
      vistos = {};
    prodStats().forEach(function (m) {
      if (isSimple(m.tipo) || (m.it && m.it.bulk)) return;
      var fQ = sazonFator(m.tipo, mesQ),
        fP = sazonFator(m.tipo, mesP),
        linhas = m.tipo === 'pre' ? lcGraus(m) : [{ grau: '', stock: m.stock, adj30: m.adj30 }];
      linhas.forEach(function (l) {
        var e = l.adj30 * fQ,
          dias = e > 0 ? l.stock / (e / 30) : Infinity,
          k = lcChave(m.tipo, m.ref, l.grau),
          base = { k: k, m: m, grau: l.grau, stock: l.stock, cu: m.cu || 0 };
        if (lcNoPedido(k)) return;
        if (e > 0 && dias <= 21) {
          base.sug = Math.max(1, Math.ceil(e * 1.5 - l.stock));
          base.mot = 'restam ~' + Math.round(dias) + ' dias · ' + l.stock + ' un.';
          out.acab.push(base);
        } else if (l.adj30 > 0 && fP >= fQ * 1.25 && l.stock < l.adj30 * fP * 1.5) {
          base.sug = Math.max(1, Math.ceil(l.adj30 * fP * 1.5 - l.stock));
          base.mot = 'a época vende ' + Math.round((fP / fQ - 1) * 100) + '% mais · ' + l.stock + ' un.';
          out.epoca.push(base);
        }
      });
    });
    parados().forEach(function (m) {
      if (vistos[m.key]) return;
      vistos[m.key] = 1;
      out.nao.push({ k: m.key, m: m, mot: Math.round(m.diasParado) + ' dias sem vender · ' + m.stock + ' un.' });
    });
    var ordem = function (a, b) {
      return b.m.profit30 - a.m.profit30;
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
    return out;
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
  function lcLinha(x) {
    return (
      '<div class="sl lcL"><span>' + dxNome(x.m) + (x.grau ? ' <b class="lcG">' + esc(x.grau) + '</b>' : '') + '<small>' + esc(x.mot) + '</small></span>' +
      '<span class="lcQ"><button type="button" class="mini" data-act="lcMenos" data-id="' + esc(x.k) + '" aria-label="Menos">−</button><b>' + x.q + '</b><button type="button" class="mini" data-act="lcMais" data-id="' + esc(x.k) + '" aria-label="Mais">+</button></span></div>'
    );
  }
  function lcHtml() {
    var L = lcLista(),
      rp = fxRepo(),
      h = '<section class="card col lcCard" id="lcCard"><div class="hint" style="margin:0">Sem cor. Pré-graduados por grau. Cobre ~45 dias, corrigido pela estação. Ajuste com − e +.</div>';
    h += lcPedHtml();
    if (!L.todos.length && !L.nao.length) return h + '<div class="note n-ok">Nada para comprar agora.</div></section>';
    var sec = function (t, l, cor) {
      if (!l.length) return '';
      return '<div class="lcSec" style="color:' + cor + '">' + t + ' · ' + l.length + '</div><div class="split">' + l.map(lcLinha).join('') + '</div>';
    };
    h += sec('Acabando', L.acab, 'var(--warn)');
    h += sec('Época chegando', L.epoca, 'var(--accent-fg)');
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
  ACT.lcPedir = function () {
    var L = lcLista(),
      its = L.todos.filter(function (x) {
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
  };
  ACT.lcPedFim = function () {
    S.lcPed = null;
    saveSoon();
    render();
  };
  function lcTexto() {
    var L = lcLista(),
      porRef = {},
      ord = [];
    L.todos.forEach(function (x) {
      if (!(x.q > 0)) return;
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
  ACT.lcEnvia = function () {
    var t = lcTexto(),
      P = shPlug(),
      u = SH_APPS.filter(function (a) {
        return a.id === shUlt();
      })[0];
    if (P) return P.send({ pkg: (u && u.pkg) || '', text: t, files: [] }).catch(function () {});
    if (navigator.share) return navigator.share({ text: t }).catch(function () {});
    window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank');
  };
