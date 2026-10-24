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
      f = S.fx,
      mg = fxMargemInfo('pyg'),
      mb = fxMargemInfo('brl');
    function linhaMg(nome, x) {
      return nome + ': ' + pc(x.m) + (x.m > FX_MARGEM + 1e-9 ? ' (' + pc(x.acima) + ' acima da menor cotação de ' + FX_JANELA + ' dias)' : ' (base)');
    }
    return (
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Cotação da loja</h2><div class="hint" style="margin:2px 0 0">Seus preços são em dólar, e a cotação da loja vale uma margem a mais que o mercado. A margem é de ' + pc(FX_MARGEM) + ' e acompanha a moeda nas últimas ' + FX_JANELA + ' dias: se ela valoriza, a margem sobe (até ' + pc(FX_TETO) + '); se ela cai, a margem desce aos poucos até voltar a ' + pc(FX_MARGEM) + '. O dólar e o real por dólar têm cada um a sua margem. O app usa esta cotação ao receber dólar ou real, a menos que você digite outro câmbio na tela de pagamento. Custos e contas continuam pela cotação do mercado.</div></div>' +
      '<div class="note ' + (Math.max(mg.m, mb.m) > FX_MARGEM + 1e-9 ? 'n-warn' : 'n-ok') + '" role="status">' + linhaMg('Margem do dólar', mg) + '<br>' + linhaMg('Margem do real por dólar', mb) + '</div>' +
      '<div class="kpis"><div class="kpi" style="background:var(--panel2)"><div class="lbl">US$ 1 vale</div><b>' + gsRaw(u) + '</b><div class="hint">mercado ' + gsRaw(f.pyg) + '</div></div>' +
      '<div class="kpi" style="background:var(--panel2)"><div class="lbl">R$ 1 vale</div><b>' + gsRaw(b) + '</b><div class="hint">mercado ' + gsRaw(Math.round(f.pyg / f.brl)) + '</div></div>' +
      '<div class="kpi" style="background:var(--panel2)"><div class="lbl">US$ 1 vale</div><b>R$ ' + fxBrlPorUsd().toFixed(2).replace('.', ',') + '</b><div class="hint">mercado R$ ' + f.brl.toFixed(2).replace('.', ',') + '</div></div></div></section>'
    );
  }
  // Dois gráficos (dólar em guaranis e real por dólar) com o mesmo período, escolhido nos botões.
  var FX_PERS = [
    [14, '2 semanas'],
    [30, 'Mês'],
    [90, '3 meses'],
    [365, 'Ano']
  ];
  function fxGrafico(k, titulo, sub, fmt) {
    var per = S.fxPer ? S.fxPer : 30,
      lim = per ? Date.now() - per * 86400000 : 0,
      h = S.fxHist.filter(function (p) {
        return p[k] > 0 && p.ts >= lim;
      });
    if (h.length < 2) h = S.fxHist.filter(function (p) { return p[k] > 0; }).slice(-2);
    var vals = h.map(function (p) {
        return p[k];
      }),
      first = vals[0],
      last = vals[vals.length - 1];
    if (vals.length < 2) return '';
    return (
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">' +
      titulo +
      '</h2><div class="hint" style="margin:2px 0 0">' +
      sub +
      '. Mínimo ' +
      fmt(Math.min.apply(null, vals)) +
      ' · Máximo ' +
      fmt(Math.max.apply(null, vals)) +
      ' · Variação no período ' +
      (last >= first ? '+' : '−') +
      pc(Math.abs(last / first - 1)) +
      '</div></div>' +
      lineSvg(
        vals,
        h.map(function (p) {
          return fd(p.ts);
        }),
        fmt
      ) +
      '</section>'
    );
  }
  function fxGraficos() {
    var per = S.fxPer ? S.fxPer : 30,
      h =
        '<section class="card col"><div class="lbl">Período dos gráficos</div><div class="nav" role="group" aria-label="Período dos gráficos">' +
        FX_PERS.map(function (o) {
          return '<button class="chip' + (per === o[0] ? ' on' : '') + '" data-act="fxper" data-id="' + o[0] + '" aria-pressed="' + (per === o[0]) + '">' + o[1] + '</button>';
        }).join('') +
        '</div></section>';
    h += fxGrafico('pyg', 'Dólar em guaranis', 'Guaranis por dólar', function (v) {
      return dots(Math.round(v));
    });
    h += fxGrafico('brl', 'Dólar em reais', 'Reais por dólar', function (v) {
      return v.toFixed(2).replace('.', ',');
    });
    return h;
  }

  // Cartão "Trocar agora": o dólar de hoje no intervalo dos últimos dias e o que dá para trocar.
  // "cotação: R$ 5,43 por US$ 1 (mercado R$ 5,42)" a partir do que foi entregue e recebido.
  function trocaCotacaoTxt(de, v, rec) {
    var a = parseDec(v, de),
      u = parseDec(rec, 'usd');
    if (!(a > 0) || !(u > 0)) return 'Informe o que entregou e o que recebeu.';
    var c = a / u,
      mercado = de === 'pyg' ? S.fx.pyg : S.fx.brl,
      dif = c / mercado - 1;
    return 'Cotação que te cobraram: ' + (de === 'pyg' ? gsRaw(Math.round(c)) : 'R$ ' + nf(c, 'brl')) + ' por US$ 1 · mercado ' + (de === 'pyg' ? gsRaw(Math.round(mercado)) : 'R$ ' + nf(mercado, 'brl')) + ' (' + (de === 'pyg' ? (dif >= 0 ? '+' : '−') : dif <= 0 ? '−' : '+') + pc(Math.abs(dif)) + ')';
  }
  function trocarAgoraHtml() {
    var p = trocarPlano(),
      dv = dolarFavoravel();
    if (!p.passos.length && !(p.needRep > 0.004) && !dv && !(S.cambios[0] && S.cambios[0].tipo)) return '';
    var h = '';
    if (dv) {
      var pos = Math.round(Math.max(0, Math.min(1, dv.pos)) * 100);
      h +=
        '<div class="lbl" style="margin:0">Dólar hoje</div><b style="font-size:28px">' + gsRaw(dv.hoje) + '</b>' +
        '<div style="position:relative;height:10px;border-radius:6px;background:linear-gradient(90deg,var(--ok),#ffc766,var(--bad))"><i style="position:absolute;left:' + pos + '%;top:-4px;width:6px;height:18px;border-radius:3px;background:#fff;transform:translateX(-50%)"></i></div>' +
        '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--mute)"><span>mínimo ' + dots(dv.min) + '</span><span>média ' + dots(dv.media) + '</span><span>máximo ' + dots(dv.max) + '</span></div>' +
        '<div class="note ' + (dv.barato ? 'n-ok' : dv.caro ? 'n-warn' : 'n-info') + '">' +
        (dv.barato ? 'Perto do mínimo dos últimos ' + S.janela + ' dias: bom momento para trocar.' : dv.caro ? 'Perto do máximo dos últimos ' + S.janela + ' dias: troque só o necessário.' : 'Cotação no meio do intervalo dos últimos ' + S.janela + ' dias.') +
        '</div>';
    }
    if (p.passos.length) {
      h += '<div class="hint" style="margin:0">Valores sugeridos. Troque o que fizer sentido e digite o que entregou e o que recebeu: o app calcula a cotação.</div>';
      p.passos.forEach(function (x, i) {
        var tin = (S.trIn || {})[i] || {},
          v = tin.v != null ? tin.v : String(x.sug),
          rec = tin.rec != null ? tin.rec : String(x.rec),
          sim = x.de === 'pyg' ? 'G$' : 'R$';
        h +=
          '<div class="card col" style="padding:10px;margin:0"><div class="lbl" style="margin:0">' + (x.tipo === 'repor' ? 'Reposição (necessário)' : 'Colchão (' + (dv && dv.barato ? 'aproveitar o momento' : 'quando o dólar estiver barato') + ')') + '</div>' +
          '<div class="sel" style="flex-wrap:wrap;align-items:center"><span class="hint" style="margin:0">Entreguei ' + sim + '</span><input class="in" id="trv' + i + '" inputmode="' + (x.de === 'pyg' ? 'numeric' : 'decimal') + '" data-in="trv" data-id="' + i + '" value="' + esc(v) + '" style="flex:1 1 90px;width:auto" aria-label="Valor entregue em ' + sim + '">' +
          '<span class="hint" style="margin:0">Recebi US$</span><input class="in" id="trr' + i + '" inputmode="decimal" data-in="trr" data-id="' + i + '" value="' + esc(rec) + '" style="flex:1 1 80px;width:auto" aria-label="Dólares recebidos"></div>' +
          '<div class="hint" id="trh' + i + '" style="margin:0">' + trocaCotacaoTxt(x.de, v, rec) + '</div></div>';
      });
      h += '<button class="go" data-act="fxtrocar">Registrar troca</button>';
    } else {
      h += '<div class="hint" style="margin:0">Nada para trocar agora com o dinheiro em caixa.</div>';
    }
    var ult = S.cambios[0];
    if (ult && ult.tipo)
      h += '<div class="sl"><span>Última troca<small>' + fmtM(ult.dado, ult.de) + ' → ' + usd(ult.rec) + ' · ' + fd(ult.ts) + ' ' + fh(ult.ts) + '</small></span><button class="chip" data-act="fxdesfaz" style="min-height:36px">Desfazer</button></div>';
    var lv = livre3();
    if (lv.extraUsd > 0.004)
      h += '<div class="note n-ok">Reposição adiantada: ' + usd(lv.extraUsd) + ' em dólar a mais, guardados para as próximas vendas.</div>';
    if (S.cxMsg) h += '<div class="hint" role="status" style="margin:0">' + esc(S.cxMsg) + '</div>';
    return h;
  }
  // Trocar moedas: formulário livre, atalhos do plano e histórico com Desfazer.
  function trHistHtml() {
    if (!S.cambios.length) return '';
    return '<div class="lbl" style="margin-top:6px">Trocas feitas</div>' + S.cambios.slice(0, 8).map(function (x, i) {
      return '<div class="sl"><span>' + fmtM(x.dado, x.de) + ' → ' + fmtM(x.rec, x.para || 'usd') + '<small>' + fd(x.ts) + ' às ' + fh(x.ts) + ' · ' + (x.difGs >= 0 ? '+' : '−') + gs(Math.abs(x.difGs)) + ' em relação ao câmbio do dia</small></span><button class="chip" data-act="trdesfaz" data-id="' + i + '" style="min-height:36px">Desfazer</button></div>';
    }).join('');
  }
  function trocarMoedasHtml() {
    var t = S.tr,
      html = '';
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Trocar moedas</h2><div class="hint" style="margin:2px 0 0">Registre a troca ou a venda de dólar que você fez. Os saldos mudam nas duas moedas.</div></div>' +
      (trocarAgoraHtml() ? '<div class="lbl" style="margin:4px 0 0">Sugestão de hoje</div>' + trocarAgoraHtml() + '<div class="lbl" style="margin:8px 0 0">Outra troca</div>' : '') +
      '<div class="sel" style="flex-wrap:wrap">' +
      trSel('trDe', t.de) +
      '<button class="chip" data-act="trflip" aria-label="Inverter as moedas">⇄ Inverter</button>' +
      trSel('trPara', t.para) +
      '</div>' +
      '<div class="sel" style="flex-wrap:wrap"><div style="flex:1 1 160px"><div class="lbl">Você troca (' +
      MN[t.de] +
      ')</div><input class="in" id="trV" inputmode="decimal" data-in="trV" value="' +
      esc(t.v) +
      '" aria-label="Valor a trocar"></div>' +
      '<div style="flex:1 1 160px"><div class="lbl">Você recebe (' +
      MN[t.para] +
      ')</div><input class="in" id="trRec" inputmode="decimal" data-in="trRec" value="' +
      esc(t.rec) +
      '" aria-label="Valor recebido na troca"></div></div>' +
      '<div class="hint" id="trPrev" role="status" style="margin:0"></div><button class="go" data-act="trocar">Registrar troca</button>' +
      trHistHtml() +
      '</section>';
    html += '';
    return html;
  }
  // Quanto falta para completar a reposição em dólar (depois de vender dólar da reposição).
  function faltamHtml() {
    var r = reservas(),
      falta = Math.max(0, r.rUSD - Math.max(0, S.cash.usd));
    if (!(r.rUSD > 0.004) || falta < 0.004) return '';
    var pct = Math.round(Math.min(1, Math.max(0, S.cash.usd) / r.rUSD) * 100);
    return (
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Faltam ' + usd(falta) + ' para a reposição</h2></div>' +
      '<div style="height:10px;border-radius:6px;background:var(--line);overflow:hidden"><i style="display:block;height:100%;width:' + pct + '%;background:var(--ok)"></i></div>' +
      '<div class="hint" style="margin:0">' + usd(Math.max(0, S.cash.usd)) + ' em dólar de ' + usd(r.rUSD) + ' reservados (' + pct + '%). Falta valor ao dólar de hoje: ' + gs(Math.round(falta * S.fx.pyg)) + '.</div>' +
      '<div class="note n-warn">Evite retiradas até completar a reposição.</div></section>'
    );
  }
  function renderFx() {
    if (S.view !== 'fx' && !S._rtudo) return;
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
    html += faltamHtml() + trocarMoedasHtml();
    html += fxLojaHtml();
    html += fxGraficos();
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
    updateTr();
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
