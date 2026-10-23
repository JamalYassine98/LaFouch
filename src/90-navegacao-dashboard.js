  // ===== Navegação entre abas e Dashboard. =====
  // Troca de aba.
  function setView(v) {
    S.view = v;
    S.msg = '';
    try {
      history.replaceState(null, '', '#' + v);
    } catch (e) {}
    render();
    window.scrollTo(0, 0);
    animEnter($('v-' + v));
  }
  // Navegação principal.
  function renderNav() {
    var n = $('mainnav'),
      sl = n.scrollLeft;
    n.textContent = '';
    var sn = $('sino'),
      nn = notifContagem();
    if (sn) sn.innerHTML = ico('notif', 24) + (nn ? '<i>' + nn + '</i>' : '');
    NAVB.forEach(function (v) {
      var b = btn('mn' + (S.view === v[0] ? ' on' : ''), '', function () {
        setView(v[0]);
      });
      b.innerHTML = '<span class="mi">' + ico(v[0], 22) + '</span><span>' + v[1] + '</span>';
      b.setAttribute('aria-label', v[1]);
      if (S.view === v[0]) b.setAttribute('aria-current', 'page');
      n.appendChild(b);
    });
    if (S.dayTab) {
      var w = mk('span', 'mn' + (S.view === 'dia' ? ' on' : ''));
      w.style.cssText = 'display:inline-flex;align-items:center;gap:4px;padding-right:4px';
      var b2 = btn('', 'Dia ' + fmtDay(S.dayTab).slice(0, 5), function () {
        setView('dia');
      });
      b2.style.cssText =
        'background:none;border:none;color:inherit;font:inherit;font-weight:600;min-height:44px;padding:0 8px 0 4px';
      if (S.view === 'dia') b2.setAttribute('aria-current', 'page');
      var x = btn('xb', '×', function () {
        ACT.closedia();
      });
      x.setAttribute('aria-label', 'Fechar a aba do dia');
      w.appendChild(b2);
      w.appendChild(x);
      n.appendChild(w);
    }
    VIEWS.forEach(function (v) {
      $('v-' + v[0]).hidden = S.view !== v[0];
    });
    $('v-dia').hidden = S.view !== 'dia';
    var on = n.querySelector('.mn.on');
    n.scrollLeft = sl;
    if (on) {
      var lo = on.offsetLeft,
        hi = lo + on.offsetWidth;
      if (lo < sl || hi > sl + n.clientWidth)
        n.scrollLeft = Math.max(0, lo - (n.clientWidth - on.offsetWidth) / 2);
    }
  }

  // ---------- dashboard
  function sumBy(a, k) {
    return a.reduce(function (x, s) {
      return x + s[k];
    }, 0);
  }
  // Vendas de um período.
  function periodSales(days) {
    var from = days === 0 ? new Date().setHours(0, 0, 0, 0) : Date.now() - days * DAY;
    return S.sales.filter(function (s) {
      return !s.estorno && s.ts >= from;
    });
  }
  // Aba Dashboard.
  function renderDash() {
    var el = $('v-dash'),
      ps = vendasPeriodo(),
      c = colchao();
    var tot = sumBy(ps, 'price'),
      pcs = sumBy(ps, 'qty'),
      rep = sumBy(ps, 'rep'),
      repU = sumBy(ps, 'repUSD'),
      con = sumBy(ps, 'contas'),
      col = sumBy(ps, 'colch'),
      mel = sumBy(ps, 'melh'),
      liv = sumBy(ps, 'livre');
    var sep = rep + con + col + mel;
    var need = repU * S.fx.pyg,
      gap = need - rep;
    var m30 = periodSales(30),
      con30 = sumBy(m30, 'contas'),
      tm = totalMensal(),
      cp = Math.min(100, (con30 / tm) * 100);
    var perHtml = periodoHtml();
    var html =
      '<div class="top"><div><h1>Dashboard</h1><div class="crumb">Quanto vendeu e quanto separar para manter a loja em ordem</div></div></div>' +
      dTabsHtml();
    var kpHtml =
      '<section class="kpis" aria-label="Resumo">' +
      '<div class="kpi"><div class="lbl">Vendido</div><b>' +
      gs(tot) +
      '</b><div class="hint">' +
      pcs +
      ' peça(s) em ' +
      ps.length +
      ' venda(s)</div></div>' +
      '<div class="kpi"><div class="lbl">Separar das vendas</div><b style="color:var(--warn)">' +
      gs(sep) +
      '</b><div class="hint">' +
      (tot ? pc(sep / tot) : '0%') +
      ' do vendido</div></div>' +
      '<div class="kpi"><div class="lbl">Lucro livre</div><b style="color:var(--ok)">' +
      gs(liv) +
      '</b><div class="hint">' +
      (tot ? pc(liv / tot) : '0%') +
      ' do vendido</div></div>' +
      '<div class="kpi"><div class="lbl">Dólar e real hoje</div><b>' +
      gsRaw(S.fx.pyg) +
      '</b><div class="hint" style="margin-top:2px">por US$ 1</div><b style="font-size:20px;display:block;margin-top:8px">' +
      gsRaw(Math.round(S.fx.pyg / S.fx.brl)) +
      '</b><div class="hint">por R$ 1 · <a href="#fx" data-act="view" data-id="fx" style="color:var(--accent-fg)">ver câmbio</a></div></div></section>';
    var head = html;
    html = '';
    var parts = [
      ['Reposição da mercadoria', usd0(repU) + ' guardados em dólar', rep, '#00c8ff'],
      ['Contas da loja e de casa', 'Obrigatório', con, '#a2447c'],
      [
        'Colchão de segurança',
        'Reserva contra alta do dólar e do custo (' + pc(c.pct) + ')',
        col,
        '#ffc766'
      ],
      ['Caixa de melhorias', 'Opcional, nunca trava venda', mel, 'var(--info)'],
      ['Lucro livre', 'Seu dinheiro', liv, '#00ff88']
    ];
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Quanto separar do que você vendeu</h2><div class="hint" style="margin:2px 0 0">Soma de todas as vendas do período, na ordem em que o dinheiro deve ser separado.</div></div>';
    html +=
      '<div class="bar">' +
      parts
        .map(function (p) {
          return (
            '<i style="width:' +
            (tot ? Math.max(0, (p[2] / tot) * 100) : 0) +
            '%;background:' +
            p[3] +
            '"></i>'
          );
        })
        .join('') +
      '</div><div class="split">' +
      parts
        .map(function (p, i) {
          return (
            '<div class="sl"><span><span class="sp" style="background:' +
            p[3] +
            '"></span>' +
            (i + 1) +
            '. ' +
            p[0] +
            '<small>' +
            p[1] +
            '</small></span><b>' +
            gs(p[2]) +
            '</b></div>'
          );
        })
        .join('') +
      '</div></section>';
    var secSep = html;
    html = '';
    html += '<div class="two">';
    html +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Reposição em dólar</h2><div style="font-size:14px">Guardado para repor: <b>' +
      usd0(repU) +
      '</b></div>' +
      '<div class="hint" style="margin:0">Separado nas vendas: ' +
      gs(rep) +
      ' · Custo de repor hoje: ' +
      gs(need) +
      '</div>' +
      '<div class="note ' +
      (gap > 0 ? 'n-warn' : 'n-ok') +
      '">' +
      (gap > 0
        ? 'O dólar subiu desde essas vendas. Faltam ' +
          gs(gap) +
          ' para repor. ' +
          (col >= gap
            ? 'O colchão acumulado (' + gs(col) + ') cobre.'
            : 'O colchão (' + gs(col) + ') não cobre tudo.')
        : 'Sobram ' + gs(-gap) + ' em relação ao custo de repor hoje.') +
      '</div></section>';
    html +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Contas dos últimos 30 dias</h2><div style="font-size:14px"><b>' +
      gs(con30) +
      '</b> separados de <b>' +
      gs(tm) +
      '</b> por mês</div>' +
      '<div class="bar"><i style="width:' +
      cp +
      '%;background:var(--accent)"></i></div><div class="hint" style="margin:0">' +
      Math.round(cp) +
      '% coberto. Vendidas ' +
      sumBy(m30, 'qty') +
      ' de ' +
      volumeEfetivo() +
      ' peças esperadas no mês. Cada peça separa ' +
      gs(contasPeca()) +
      ' para as contas. <a href="#desp" data-act="view" data-id="desp" style="color:var(--accent-fg)">Editar despesas</a></div></section>';
    html += '</div>';
    var secTwo = html;
    html = '';
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Saúde da margem</h2><div class="hint" style="margin:2px 0 0">Preço atual contra a trava: reposição de hoje mais a parte das contas de cada peça.</div></div><div style="overflow-x:auto"><table class="tb"><thead><tr><th>Tipo</th><th>Preço</th><th>Reposição hoje</th><th>Contas/peça</th><th>Trava</th><th>Folga</th><th>Situação</th></tr></thead><tbody>';
    var worst = null;
    TIPOS.forEach(function (t) {
      var rp = Math.round(t.repUSD * S.fx.pyg),
        cpz = contasPeca(),
        trava = rp + cpz;
      if (!t.price) {
        html +=
          '<tr><td>' +
          t.label +
          '</td><td>livre</td><td>' +
          gs(rp) +
          '</td><td>' +
          gs(cpz) +
          '</td><td>' +
          gs(trava) +
          '</td><td>definido na venda</td><td>—</td></tr>';
        return;
      }
      var fo = t.price - trava,
        fp = fo / t.price,
        st =
          fp >= 0.15
            ? ['Seguro', 'n-ok']
            : fp > 0
              ? ['Apertado', 'n-warn']
              : ['Subir preço', 'n-bad'];
      if (!worst && fp < 0.15) worst = { t: t, trava: trava, fp: fp };
      html +=
        '<tr><td>' +
        t.label +
        '</td><td>' +
        gs(t.price) +
        '</td><td>' +
        gs(rp) +
        '</td><td>' +
        gs(cpz) +
        '</td><td>' +
        gs(trava) +
        '</td><td>' +
        gs(fo) +
        ' · ' +
        pc(fp) +
        '</td><td><span class="note ' +
        st[1] +
        '" style="padding:3px 10px;display:inline-block;font-size:12px">' +
        st[0] +
        '</span></td></tr>';
    });
    html += '</tbody></table></div>';
    if (worst) {
      var minimo = Math.ceil(worst.trava / (1 - 0.15) / 1000) * 1000;
      html +=
        '<div class="note n-warn">Antes de subir o preço de ' +
        worst.t.label +
        ': revise as despesas, negocie o próximo lote e venda só acima da trava (' +
        gs(worst.trava) +
        '). Se mesmo assim a folga não voltar a 15%, o mínimo sugerido é ' +
        gs(minimo) +
        '.</div>';
    } else
      html +=
        '<div class="note n-ok">Todos os preços têm folga acima de 15% da trava. Nada a mexer. Subir preço é sempre a última sugestão do app.</div>';
    html += '</section>';
    el.innerHTML =
      head +
      '<div id="dtabBody">' +
      dashCompose({ per: perHtml, kp: kpHtml, sep: secSep, two: secTwo, margem: html }) +
      '</div>';
  }

  // ---------- câmbio
