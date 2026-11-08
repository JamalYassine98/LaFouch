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
    return 'Cotação que te cobraram: ' + (de === 'pyg' ? gsRaw(Math.round(c)) : 'R$ ' + nf(c, 'brl')) + ' por US$ 1 · casa ' + (de === 'pyg' ? gsRaw(Math.round(mercado)) : 'R$ ' + nf(mercado, 'brl')) + ' (' + (de === 'pyg' ? (dif >= 0 ? '+' : '−') : dif <= 0 ? '−' : '+') + pc(Math.abs(dif)) + ')';
  }
  function trocarAgoraHtml() {
    var p = trocarPlano(),
      dv = dolarFavoravel();
    if (!p.passos.length && !(p.needRep > 0.004) && !(S.cambios[0] && S.cambios[0].tipo)) return '';
    var h = '';
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
    } else {
      h += '<div class="hint" style="margin:0">Nada para trocar agora com o dinheiro em caixa.</div>';
    }
    var ult = S.cambios[0];
    if (ult && ult.tipo)
      h += '<div class="sl"><span>Última troca<small>' + fmtM(ult.dado, ult.de) + ' → ' + usd(ult.rec) + ' · ' + fd(ult.ts) + ' ' + fh(ult.ts) + '</small></span><button class="btn-sc p" data-act="fxdesfaz">Desfazer</button></div>';
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
      return '<div class="sl"><span>' + fmtM(x.dado, x.de) + ' → ' + fmtM(x.rec, x.para || 'usd') + '<small>' + fd(x.ts) + ' às ' + fh(x.ts) + ' · ' + (x.difGs >= 0 ? '+' : '−') + gs(Math.abs(x.difGs)) + ' em relação ao câmbio do dia</small></span><button class="btn-sc p" data-act="trdesfaz" data-id="' + i + '">Desfazer</button></div>';
    }).join('');
  }
  // Medidor da cotação do par escolhido (muda com as moedas de Trocar moedas).
  function parGaugeHtml() {
    var c = cotacaoPar(S.tr.de, S.tr.para);
    if (!c) return ''; // medidor único: acompanha as moedas escolhidas em "Outra troca"
    var f = function (v) {
        return c.un === 'pyg' ? gsRaw(Math.round(v)) : 'R$ ' + nf(v, 'brl');
      },
      pos = Math.round(c.pos * 100);
    return (
      '<div class="card col" style="padding:10px;margin:0"><div class="lbl" style="margin:0">' + c.nome + ' hoje</div><b style="font-size:24px">' + f(c.hoje) + '</b>' +
      '<div style="position:relative;height:10px;border-radius:6px;background:linear-gradient(90deg,var(--ok),#e9c27a,var(--bad))"><i style="position:absolute;left:' + pos + '%;top:-4px;width:6px;height:18px;border-radius:3px;background:#fff;transform:translateX(-50%)"></i></div>' +
      '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--mute)"><span>mínimo ' + f(c.min) + '</span><span>média ' + f(c.media) + '</span><span>máximo ' + f(c.max) + '</span></div>' +
      '<div class="note ' + (c.barato ? 'n-ok' : c.caro ? 'n-warn' : 'n-info') + '">' +
      (c.barato ? 'Perto do mínimo dos últimos ' + S.janela + ' dias: bom momento para trocar.' : c.caro ? 'Perto do máximo dos últimos ' + S.janela + ' dias: troque só o necessário.' : 'Cotação no meio do intervalo dos últimos ' + S.janela + ' dias.') +
      '</div></div>'
    );
  }
  function trocarMoedasHtml() {
    var t = S.tr,
      html = '';
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Trocar moedas</h2><div class="hint" style="margin:2px 0 0">Registre a troca ou a venda de dólar que você fez. Os saldos mudam nas duas moedas.</div></div>' +
      (trocarAgoraHtml() ? '<div class="lbl" style="margin:4px 0 0">Sugestão de hoje</div>' + trocarAgoraHtml() + '<div class="lbl" style="margin:8px 0 0">Outra troca</div>' : '') +
      '<div class="sel" style="flex-wrap:wrap">' +
      trSel('trDe', t.de) +
      '<button class="btn-sc" data-act="trflip" aria-label="Inverter as moedas">⇄ Inverter</button>' +
      trSel('trPara', t.para) +
      '</div>' +
      parGaugeHtml() +
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
  // v426: aba Câmbio simples (esboço aprovado 04/11, versão A) — montada em 97-cambio-aba.js
  function renderFx() {
    if (S.view !== 'fx' && !S._rtudo) return;
    var el = $('v-fx');
    el.innerHTML = fxAbaHtml();
    if (S.fxJan === 'troca') updateTr();
    var tp = el.querySelector('.fjPer');
    if (tp) trkPoe(tp, String(S.fxPer));
    fjGestos();
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
      pt = { ts: Date.now(), pyg: Math.round(pyg), brl: brl, r: live ? 1 : 0 };
    if (new Date(last.ts).toDateString() === new Date().toDateString())
      S.fxHist[S.fxHist.length - 1] = pt;
    else S.fxHist.push(pt);
    S.fx = { pyg: Math.round(pyg), brl: brl, ts: Date.now(), live: live, src: src, status: status };
    S.fxNext = Date.now() + 180000;
    S.fxc = { pyg: Math.round(pyg), brl: brl, ts: Date.now() }; // cotação compartilhada entre aparelhos (sincroniza)
    renderFx();
    renderDash();
    renderHist();
    renderDay();
  }
  // Busca a cotação online.
  // Outro aparelho já buscou a cotação há pouco: usa a mesma (câmbio único entre aparelhos).
  function fxAdota() {
    // v465: com cotação da casa, a casa sempre ganha (a compartilhada só vale para quem nunca leu a casa)
    if (lmOk()) return fxDaCasa();
    var c = S.fxc;
    if (!S.syncOn || !c || !(c.pyg > 0) || !(c.ts > (S.fx.ts || 0))) return false;
    var last = S.fxHist[S.fxHist.length - 1],
      pt = { ts: c.ts, pyg: c.pyg, brl: c.brl, r: 1 };
    if (last && new Date(last.ts).toDateString() === new Date(c.ts).toDateString()) S.fxHist[S.fxHist.length - 1] = pt;
    else S.fxHist.push(pt);
    S.fx = { pyg: c.pyg, brl: c.brl, ts: c.ts, live: true, src: 'Cotação compartilhada entre aparelhos', status: 'Mesma cotação de todos os aparelhos.' };
    S.fxNext = Math.max(S.fxNext || 0, c.ts + 180000);
    renderFx();
    return true;
  }
  window.__fxAdota = fxAdota;
  // Histórico verdadeiro: baixa o fechamento diário real (USD→PYG e USD→BRL) dos últimos 365 dias e troca os pontos antigos
  function fxHistReal() {
    if (S.fxReal && Date.now() - S.fxReal < 20 * 3600000) return;
    var tem = {}, dias = [], hoje = new Date();
    (S.fxHist || []).forEach(function (x) { if (x.r) tem[new Date(x.ts).toDateString()] = 1; });
    for (var i = 1; i <= 365; i++) {
      var d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - i, 12);
      if (!tem[d.toDateString()]) dias.push(d);
    }
    if (!dias.length) { S.fxReal = Date.now(); return; }
    var ok = 0, falhou = 0, fila = dias.slice(), novos = [];
    function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
    function um(d) {
      var u = '@fawazahmed0/currency-api@' + iso(d) + '/v1/currencies/usd.json';
      return fetch('https://cdn.jsdelivr.net/npm/' + u)
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .catch(function () { return fetch('https://' + iso(d) + '.currency-api.pages.dev/v1/currencies/usd.json').then(function (r) { if (!r.ok) throw 0; return r.json(); }); })
        .then(function (j) {
          var py = j && j.usd && j.usd.pyg, br = j && j.usd && j.usd.brl;
          if (py > 1000 && br > 1) { novos.push({ ts: d.getTime(), pyg: Math.round(py), brl: Math.round(br * 1000) / 1000, r: 1 }); ok++; } else falhou++;
        })
        .catch(function () { falhou++; });
    }
    function lote() {
      if (!fila.length) return Promise.resolve();
      return Promise.all(fila.splice(0, 8).map(um)).then(lote);
    }
    lote().then(function () {
      if (ok < 5) return; // sem internet/fonte: mantém o que há e tenta de novo depois
      var pegos = {};
      novos.forEach(function (x) { pegos[new Date(x.ts).toDateString()] = 1; });
      var hojeK = hoje.toDateString();
      // fica: pontos de hoje e os já verdadeiros; sai: ponto antigo sem marca nos dias que o histórico verdadeiro cobriu
      S.fxHist = S.fxHist.filter(function (x) {
        var k = new Date(x.ts).toDateString();
        return k === hojeK || x.r || !pegos[k];
      }).concat(novos);
      S.fxHist.sort(function (a, b) { return a.ts - b.ts; });
      S.fxReal = Date.now();
      try { saveSoon(); } catch (e) {}
      renderFx(); renderDash(); renderHist(); renderDay();
    });
  }
  window.__fxHistReal = fxHistReal;
  // v426: a cotação da La Moneda (Jebai) vale em tudo; a média de mercado (open.er-api) só entra enquanto
  // nenhum aparelho conseguiu ler a casa (app novo, ainda sem nenhuma cotação dela).
  function fxDaCasa() {
    if (!lmOk()) return false;
    var c = S.lm;
    var src = 'La Moneda · ' + (c.suc || 'Jebai');
    if (S.fx && S.fx.pyg === c.usd.v && S.fx.brl === c.arb.v && S.fx.src === src) return true;
    setFx(c.usd.v, c.arb.v, src, true, 'Cotação da La Moneda (' + (c.suc && c.suc !== 'Jebai' ? c.suc + ', a Sucursal Jebai não apareceu' : 'Sucursal Jebai') + ').');
    S.fxHist[S.fxHist.length - 1].c = 1; // ponto da casa (o histórico de mercado não substitui)
    S.fxNext = Date.now() + 60000;
    return true;
  }
  function fetchFx() {
    if (fxDaCasa()) {
      S.fxNext = Date.now() + 60000;
      return;
    }
    if (fxAdota() && Date.now() - S.fx.ts < 150000) return;
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
  setTimeout(fxHistReal, 4000);
