  // ===== Aba Câmbio: cotação, gráfico e atualização. =====
  // Gráfico de linha em SVG.
  function lineSvg(vals, labs, fmt) {
    var W = 640,
      H = 230,
      pl = 64,
      pr = 16,
      pt = 14,
      pb = 30,
      mn = Math.min.apply(null, vals),
      mx = Math.max.apply(null, vals),
      pad = (mx - mn) * 0.15 || 1;
    mn -= pad;
    mx += pad;
    var X = function (i) {
        return pl + (i * (W - pl - pr)) / (vals.length - 1);
      },
      Y = function (v) {
        return pt + ((mx - v) * (H - pt - pb)) / (mx - mn);
      };
    var g = '',
      i;
    for (i = 0; i < 4; i++) {
      var v = mn + ((mx - mn) * i) / 3,
        y = Y(v);
      g +=
        '<line x1="' +
        pl +
        '" x2="' +
        (W - pr) +
        '" y1="' +
        y +
        '" y2="' +
        y +
        '" style="stroke:var(--line)" stroke-width="1"/><text x="' +
        (pl - 8) +
        '" y="' +
        (y + 4) +
        '" text-anchor="end" font-size="11" style="fill:var(--mute)">' +
        fmt(v) +
        '</text>';
    }
    var pts = vals
      .map(function (v, i) {
        return X(i).toFixed(1) + ',' + Y(v).toFixed(1);
      })
      .join(' ');
    var xl = [0, Math.floor((vals.length - 1) / 2), vals.length - 1]
      .map(function (i) {
        return (
          '<text x="' +
          X(i) +
          '" y="' +
          (H - 8) +
          '" text-anchor="' +
          (i === 0 ? 'start' : i === vals.length - 1 ? 'end' : 'middle') +
          '" font-size="11" style="fill:var(--mute)">' +
          labs[i] +
          '</text>'
        );
      })
      .join('');
    var li = vals.length - 1;
    return (
      '<svg viewBox="0 0 ' +
      W +
      ' ' +
      H +
      '" style="width:100%;height:auto;display:block" role="img" aria-label="Gráfico do dólar nos últimos dias">' +
      g +
      '<polyline points="' +
      pts +
      '" fill="none" style="stroke:var(--accent-fg)" stroke-width="2.5" stroke-linejoin="round"/><circle cx="' +
      X(li) +
      '" cy="' +
      Y(vals[li]) +
      '" r="5" style="fill:var(--accent-fg)"/>' +
      xl +
      '</svg>'
    );
  }
  // Aba Câmbio.
  // Cartão da cotação da loja (só informa; a margem é fixa).
  function fxLojaHtml() {
    var u = Math.round(fxLoja('usd')),
      b = Math.round(fxLoja('brl')),
      f = S.fx;
    return (
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Cotação da loja</h2><div class="hint" style="margin:2px 0 0">É a cotação do mercado com a margem da loja (' + pc(FX_MARGEM) + ' a favor da loja). O app usa esta ao receber dólar ou real, a menos que você digite outro câmbio no carrinho. Custos e contas continuam pela cotação do mercado.</div></div>' +
      '<div class="kpis"><div class="kpi" style="background:var(--panel2)"><div class="lbl">US$ 1 vale</div><b>' + gsRaw(u) + '</b><div class="hint">mercado ' + gsRaw(f.pyg) + '</div></div>' +
      '<div class="kpi" style="background:var(--panel2)"><div class="lbl">R$ 1 vale</div><b>' + gsRaw(b) + '</b><div class="hint">mercado ' + gsRaw(Math.round(f.pyg / f.brl)) + '</div></div>' +
      '<div class="kpi" style="background:var(--panel2)"><div class="lbl">US$ 1 vale</div><b>R$ ' + (u / b).toFixed(2).replace('.', ',') + '</b><div class="hint">mercado R$ ' + f.brl.toFixed(2).replace('.', ',') + '</div></div></div></section>'
    );
  }
  function renderFx() {
    var el = $('v-fx'),
      f = S.fx,
      c = colchao(),
      h = S.fxHist,
      vals = h.map(function (p) {
        return p.pyg;
      }),
      first = vals[0],
      last = vals[vals.length - 1];
    var html =
      '<div class="top"><div><h1>Câmbio</h1><div class="crumb">Cotação do dólar e do real em guaranis</div></div><div class="tabs"><button class="mini" data-act="fxnow">Atualizar agora</button></div></div>';
    html +=
      '<section class="kpis"><div class="kpi"><div class="lbl">US$ 1 custa</div><b>' +
      gsRaw(f.pyg) +
      '</b><div class="hint">' +
      f.src +
      '</div></div>' +
      '<div class="kpi"><div class="lbl">R$ 1 custa</div><b>' +
      gsRaw(Math.round(f.pyg / f.brl)) +
      '</b><div class="hint">calculado do dólar</div></div>' +
      '<div class="kpi"><div class="lbl">US$ 1 custa</div><b>' +
      'R$ ' + f.brl.toFixed(2).replace('.', ',') +
      '</b><div class="hint">cotação do real</div></div>' +
      '<div class="kpi"><div class="lbl">Próxima busca em</div><b id="cd">--:--</b><div class="hint">automática a cada 3 minutos</div></div></section>';
    html +=
      '<div class="note ' +
      (f.live ? 'n-ok' : 'n-warn') +
      '" role="status">' +
      esc(f.status) +
      (f.ts ? ' Última atualização às ' + fh(f.ts) + '.' : '') +
      '</div>';
    html += fxLojaHtml();
    html +=
      '<section class="card col"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px"><div><h2 style="margin:0;font-size:16px">Dólar nos últimos ' +
      h.length +
      ' dias</h2><div class="hint" style="margin:2px 0 0">Guaranis por dólar. Mínimo ' +
      dots(Math.min.apply(null, vals)) +
      ' · Máximo ' +
      dots(Math.max.apply(null, vals)) +
      ' · Variação no período ' +
      (last >= first ? '+' : '−') +
      pc(Math.abs(last / first - 1)) +
      '</div></div>' +
      '<div class="nav"><button class="chip" data-act="fxup">Simular dólar +3%</button><button class="chip" data-act="fxdn">Simular dólar −3%</button></div></div>' +
      lineSvg(
        vals,
        h.map(function (p) {
          return fd(p.ts);
        }),
        function (v) {
          return dots(v);
        }
      ) +
      '<div class="hint" style="margin:0">Os botões de simulação existem só na demonstração, para você ver o colchão e a trava reagirem.</div></section>';
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Como o colchão de segurança é calculado</h2><div class="hint" style="margin:2px 0 0">Não é um percentual fixo. O app olha a pior alta recente do dólar e do custo da mercadoria.</div></div>' +
      '<div class="split"><div class="sl"><span>Maior alta do dólar em ' +
      c.janela +
      ' dias<small>menor cotação seguida de uma mais alta</small></span><b>' +
      pc(c.fx) +
      '</b></div>' +
      '<div class="sl"><span>Maior alta do custo entre lotes<small>custo em dólar de um lote para o seguinte</small></span><b>' +
      pc(c.cost) +
      '</b></div>' +
      '<div class="sl"><span>As duas altas juntas<small>(1 + dólar) × (1 + custo) − 1</small></span><b>' +
      pc(c.raw) +
      '</b></div>' +
      '<div class="sl"><span><b>Colchão aplicado</b><small>limitado entre 5% e 25%</small></span><b style="color:var(--warn)">' +
      pc(c.pct) +
      '</b></div></div>' +
      '<div class="note n-info">Em cada venda, o colchão é ' +
      pc(c.pct) +
      ' do custo de reposição daquela peça. Se o dólar ou o custo subirem mais, o percentual sobe sozinho.</div></section>';
    html +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Custo por lote</h2><div style="overflow-x:auto"><table class="tb"><thead><tr><th>Lote</th><th>Data</th><th>Grupo</th><th>Custo por peça</th><th>Variação</th></tr></thead><tbody>' +
      lotesHist()
        .map(function (l, i, A) {
          var p = i ? A[i - 1].usd : 0;
          return (
            '<tr><td>' +
            l.id +
            '</td><td>' +
            fd(l.ts) +
            '</td><td>' +
            l.txt +
            '</td><td>' +
            usd(l.usd) +
            '</td><td>' +
            (p ? (l.usd >= p ? '+' : '−') + pc(Math.abs(l.usd / p - 1)) : 'primeiro') +
            '</td></tr>'
          );
        })
        .join('') +
      '</tbody></table></div></section>';
    el.innerHTML = html;
    tickFx();
  }
  // Atualiza o contador do câmbio.
  function tickFx() {
    var cd = $('cd');
    if (cd) {
      var s = Math.max(0, Math.round((S.fxNext - Date.now()) / 1000));
      cd.textContent =
        String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    }
  }
  // Grava a cotação (histórico do dia) e redesenha.
  function setFx(pyg, brl, src, live, status) {
    var last = S.fxHist[S.fxHist.length - 1],
      pt = { ts: Date.now(), pyg: Math.round(pyg), brl: brl };
    if (new Date(last.ts).toDateString() === new Date().toDateString())
      S.fxHist[S.fxHist.length - 1] = pt;
    else S.fxHist.push(pt);
    S.fx = { pyg: Math.round(pyg), brl: brl, ts: Date.now(), live: live, src: src, status: status };
    S.fxNext = Date.now() + 180000;
    renderFx();
    renderDash();
    renderHist();
    renderDay();
  }
  // Busca a cotação online.
  function fetchFx() {
    S.fxNext = Date.now() + 180000;
    var fail = function () {
      S.fx.live = false;
      S.fx.status =
        'Esta demonstração não consegue consultar a cotação na internet. Usando valor de exemplo. No app instalado, ele busca sozinho a cada 3 minutos.';
      S.fx.src = 'Valor de exemplo';
      renderFx();
    };
    try {
      fetch('https://open.er-api.com/v6/latest/USD')
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          if (j && j.rates && j.rates.PYG && j.rates.BRL)
            setFx(
              j.rates.PYG,
              j.rates.BRL,
              'open.er-api.com, ao vivo',
              true,
              'Cotação ao vivo buscada automaticamente.'
            );
          else fail();
        })
        .catch(fail);
    } catch (e) {
      fail();
    }
  }
  setInterval(function () {
    tickFx();
    if (Date.now() >= S.fxNext) fetchFx();
  }, 1000);
