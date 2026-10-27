  // ===== Estoque: abas (Produtos · Compras · Reposição), mapa de graus e a aba Reposição. =====
  var POUCO = 5; // até 5 peças de um grau é pouco
  // Os 16 graus que a loja trabalha: +0.25 a +4.00.
  function graus16() {
    var a = [];
    for (var n = 1; n <= 16; n++) a.push('+' + (n * 0.25).toFixed(2));
    return a;
  }
  // Peças por grau dos pré-graduados (sem as peças ainda sem detalhe).
  function grauTotais() {
    var m = {};
    graus16().forEach(function (g) {
      m[g] = 0;
    });
    S.items.forEach(function (i) {
      if (i.tipo !== 'pre' || i.bulk || !i.grau) return;
      m[i.grau] = (m[i.grau] || 0) + i.qty;
    });
    return m;
  }
  // Situação do grau: r = acabou, y = pouco, g = bem abastecido.
  function grauNivel(q) {
    return q <= 0 ? 'r' : q <= POUCO ? 'y' : 'g';
  }
  // Tamanho do pacote: o que mais aparece nos seus lotes (20 ou 24); sem histórico, 24.
  function packPre() {
    var c = { 20: 0, 24: 0 };
    S.grp.forEach(function (g) {
      if (g.tipo === 'pre' && (g.qty === 20 || g.qty === 24)) c[g.qty]++;
    });
    return c[20] > c[24] ? 20 : 24;
  }
  // Custo estimado de uma peça pré-graduada (US$): média do último lote desse tipo.
  function custoPreUsd() {
    var ls = S.grp
      .filter(function (g) {
        return g.tipo === 'pre' && g.qty > 0;
      })
      .sort(function (a, b) {
        return (b.ts || 0) - (a.ts || 0);
      });
    if (ls.length) return gTot(ls[0]) / ls[0].qty;
    var t = tipoOf('pre');
    return (t && (t.repUSD || t.pago)) || 0;
  }
  // Sugestão de pacotes por grau: esgotado ou até 3 peças = 1 pacote; 4 a 5, você decide.
  function repSug(q) {
    return q <= 3 ? 1 : 0;
  }
  function repQtd(g, q) {
    return S.repQ && S.repQ[g] != null ? S.repQ[g] : repSug(q);
  }
  // Texto da lista de compra.
  function repTexto() {
    var tot = grauTotais(),
      pk = packPre(),
      ls = [],
      n = 0;
    graus16().forEach(function (g) {
      var p = repQtd(g, tot[g]);
      if (p > 0) {
        ls.push(g + ' · ' + p + (p === 1 ? ' pacote' : ' pacotes') + ' de ' + pk);
        n += p * pk;
      }
    });
    var mix = parseInt(S.repMix, 10) || 0;
    if (mix > 0) {
      ls.push('Mix surtido · ' + mix + ' peças');
      n += mix;
    }
    var d = new Date();
    return {
      n: n,
      linhas: ls,
      txt:
        'Lista de compra · pré-graduados · ' +
        ('0' + d.getDate()).slice(-2) +
        '/' +
        ('0' + (d.getMonth() + 1)).slice(-2) +
        '\n' +
        ls.join('\n') +
        '\nTotal: ' +
        n +
        ' peças'
    };
  }
  // Mapa de graus: 16 quadradinhos com as peças de cada grau.
  function renderMapaGraus() {
    var h = $('mapaB');
    if (!h) return;
    var ts = tSel(),
      on = ts.length === 1 && ts[0] === 'pre' && !S.lotesView && !S.repoView && !S.cont && !S.det;
    h.hidden = !on;
    h.textContent = '';
    if (!on) return;
    var tot = grauTotais(),
      total = 0,
      ac = [],
      bx = [];
    h.appendChild(mk('div', 'lbl', 'Mapa de graus · peças no estoque'));
    var gd = mk('div', 'gmap');
    graus16().forEach(function (g) {
      var q = tot[g],
        lv = grauNivel(q);
      total += q;
      if (lv === 'r') ac.push(g);
      else if (lv === 'y') bx.push(g + ' (' + q + ')');
      var c = btn(
        'gcell ' + lv + (S.q === g ? ' on' : ''),
        '',
        function () {
          S.q = S.q === g ? '' : g;
          S.open = '';
          S.det = false;
          render();
        },
        S.q === g
      );
      c.appendChild(mk('small', '', g));
      c.appendChild(mk('b', '', String(q)));
      c.setAttribute('aria-label', g + ': ' + q + ' peças');
      gd.appendChild(c);
    });
    h.appendChild(gd);
    var msg = [];
    if (ac.length) msg.push(ac.join(', ') + (ac.length > 1 ? ' acabaram' : ' acabou'));
    if (bx.length) msg.push(bx.join(', ') + ' com pouco');
    var nt = mk(
      'div',
      msg.length ? 'note n-warn' : 'note n-ok',
      msg.length ? 'Atenção: ' + msg.join(' · ') : 'Todos os graus estão bem abastecidos.'
    );
    nt.id = 'mapaNota';
    h.appendChild(nt);
    var sm = mk('div', 'hint', 'Total: ' + total + ' peças. Toque num grau para ver os modelos dele.');
    sm.style.margin = '4px 0 0';
    h.appendChild(sm);
  }
  // Aba Reposição: o que comprar por grau, em pacotes.
  function renderReposicao() {
    var h = $('repoView');
    if (!h) return;
    h.hidden = !S.repoView;
    h.textContent = '';
    if (!S.repoView) return;
    var tot = grauTotais(),
      pk = packPre(),
      cu = custoPreUsd(),
      L = repTexto(),
      reserva = 0;
    try {
      reserva = reservas().rUSD;
    } catch (e) {}
    var top = mk('div', 'repsum');
    var a = mk('div', '');
    a.appendChild(mk('small', '', 'Reservado para repor'));
    a.appendChild(mk('b', '', usd(reserva)));
    var b = mk('div', '');
    b.style.textAlign = 'right';
    b.appendChild(mk('small', '', 'Lista de compra'));
    b.appendChild(mk('b', '', usd(L.n * cu)));
    b.firstChild.id = 'repLbl';
    b.lastChild.id = 'repTot';
    top.appendChild(a);
    top.appendChild(b);
    h.appendChild(top);
    var hp = mk(
      'div',
      'hint',
      'Pré-graduados por grau, em pacotes de ' +
        pk +
        ' peças · custo estimado ' +
        usd(cu) +
        ' por peça (média do último lote).'
    );
    h.appendChild(hp);
    var gs0 = graus16(),
      esg = gs0.filter(function (g) {
        return tot[g] <= 0;
      }),
      bai = gs0.filter(function (g) {
        return tot[g] > 0 && tot[g] <= POUCO;
      });
    var linha = function (g) {
      var q = tot[g],
        p = repQtd(g, q),
        r = mk('div', 'repit');
      r.dataset.g = g;
      var gd = mk('div', 'gd');
      gd.appendChild(mk('b', '', g));
      gd.appendChild(mk('small', q <= 0 ? 'rd' : 'yl', q <= 0 ? 'esgotado' : 'baixo'));
      var md = mk('div', 'md');
      md.appendChild(mk('b', '', q + (q === 1 ? ' peça' : ' peças')));
      md.appendChild(
        mk(
          'div',
          '',
          p > 0
            ? p + (p === 1 ? ' pacote' : ' pacotes') + ' de ' + pk + ' · ' + usd(p * pk * cu)
            : 'não repor agora'
        )
      );
      var st = mk('div', 'st2');
      var mn = btn('step', '−', function () {
        S.repQ = S.repQ || {};
        S.repQ[g] = Math.max(0, p - 1);
        render();
      });
      mn.setAttribute('aria-label', 'Menos um pacote de ' + g);
      var pl = btn('step', '+', function () {
        S.repQ = S.repQ || {};
        S.repQ[g] = p + 1;
        render();
      });
      pl.setAttribute('aria-label', 'Mais um pacote de ' + g);
      st.appendChild(mn);
      st.appendChild(mk('i', '', String(p)));
      st.appendChild(pl);
      r.appendChild(gd);
      r.appendChild(md);
      r.appendChild(st);
      return r;
    };
    if (esg.length) {
      h.appendChild(mk('div', 'lbl', 'Esgotado'));
      esg.forEach(function (g) {
        h.appendChild(linha(g));
      });
    }
    if (bai.length) {
      h.appendChild(mk('div', 'lbl', 'Baixo (1 a ' + POUCO + ' peças)'));
      bai.forEach(function (g) {
        h.appendChild(linha(g));
      });
    }
    if (!esg.length && !bai.length)
      h.appendChild(mk('div', 'note n-ok', 'Todos os graus estão com mais de ' + POUCO + ' peças.'));
    // mix surtido: você diz o total de peças
    var mx = mk('div', 'repmix');
    mx.appendChild(mk('div', 'lbl', 'Mix surtido (qualquer grau de +0.25 a +4.00)'));
    var mi = mk('input', 'in');
    mi.inputMode = 'numeric';
    mi.placeholder = 'Total de peças do mix (opcional)';
    mi.setAttribute('aria-label', 'Total de peças do mix surtido');
    mi.value = S.repMix || '';
    mi.onchange = function () {
      S.repMix = String(parseInt(mi.value, 10) || '');
      render();
    };
    mx.appendChild(mi);
    h.appendChild(mx);
    // outros tipos com pouco estoque
    var out = {};
    S.items.forEach(function (i) {
      if (i.tipo === 'pre' || i.bulk || !tipoOf(i.tipo)) return;
      var k = i.tipo + '|' + i.ref;
      out[k] = out[k] || { ref: i.ref, tipo: i.tipo, q: 0 };
      out[k].q += i.qty;
    });
    var pouco = Object.keys(out)
      .map(function (k) {
        return out[k];
      })
      .filter(function (o) {
        return o.q <= POUCO;
      })
      .sort(function (x, y) {
        return x.q - y.q;
      });
    if (pouco.length) {
      h.appendChild(mk('div', 'lbl', 'Armações e solares com pouco estoque'));
      pouco.slice(0, 12).forEach(function (o) {
        var r = mk('div', 'repit');
        var ph = photoOf(o.ref),
          th = mk('div', 'rthumb');
        if (ph) {
          var im = document.createElement('img');
          im.src = ph;
          im.alt = '';
          th.appendChild(im);
        }
        r.appendChild(th);
        var md = mk('div', 'md');
        md.appendChild(mk('b', '', pn(o.ref)));
        md.appendChild(mk('div', '', (tipoOf(o.tipo).label || '') + ' · ' + o.q + (o.q === 1 ? ' peça' : ' peças')));
        r.appendChild(md);
        h.appendChild(r);
      });
    }
    // rodapé: total e lista
    var ft = mk('div', 'repft');
    var tt = mk('div', 'repftt');
    tt.appendChild(mk('span', '', L.n + ' peças'));
    tt.appendChild(mk('b', '', usd(L.n * cu)));
    ft.appendChild(tt);
    if (!S.repLista) {
      var go = btn('go', 'Gerar lista de compra', function () {
        S.repLista = true;
        render();
      });
      go.id = 'repGerar';
      go.disabled = !L.n;
      ft.appendChild(go);
    } else {
      var lc = mk('pre', 'replist', L.n ? L.txt : 'Nada para comprar.');
      ft.appendChild(lc);
      var bw = btn('go', 'Enviar pelo WhatsApp', function () {
        window.open('https://wa.me/?text=' + encodeURIComponent(L.txt), '_blank');
      });
      bw.disabled = !L.n;
      ft.appendChild(bw);
      var bc = btn('mini', 'Copiar a lista', function () {
        try {
          navigator.clipboard.writeText(L.txt);
          say('Lista copiada.');
        } catch (e) {}
      });
      ft.appendChild(bc);
      ft.appendChild(
        btn('mini', 'Voltar e ajustar', function () {
          S.repLista = false;
          render();
        })
      );
    }
    h.appendChild(ft);
  }
  // Barra de abas do Inventário.
  function renderEstoqueAbas() {
    var tb = $('eTabs');
    if (!tb) return;
    if (S.lotesView) S.repoView = false;
    var pend = S.grp.filter(function (g) {
      return grpFalta(g) > 0;
    }).length;
    tb.textContent = '';
    var mkTab = function (id, txt, on, fn, badge) {
      var b = btn('chip' + (on ? ' on' : ''), '', fn, on);
      b.id = id;
      b.appendChild(document.createTextNode(txt));
      if (badge) b.appendChild(mk('em', 'bdg', String(badge)));
      tb.appendChild(b);
    };
    mkTab('eTabP', 'Produtos', !S.lotesView && !S.repoView, function () {
      if (S.lotesView) $('kLot').onclick();
      S.repoView = false;
      S.repLista = false;
      render();
    });
    mkTab(
      'eTabL',
      'Compras',
      !!S.lotesView,
      function () {
        S.repoView = false;
        S.cont = false;
        if (!S.lotesView) $('kLot').onclick();
        else render();
      },
      pend
    );
    mkTab('eTabR', 'Reposição', !!S.repoView, function () {
      if (S.lotesView) $('kLot').onclick();
      S.repoView = true;
      S.repLista = false;
      S.cont = false;
      S.det = false;
      S.open = '';
      render();
    });
    var rv = !!S.repoView;
    $('kpisE').hidden = rv || !!S.lotesView;
    if (rv) {
      $('listCard').hidden = true;
      $('detail').hidden = true;
      $('contCard').hidden = true;
    }
    renderMapaGraus();
    renderReposicao();
  }
