  // Aba Câmbio.
  // Dois gráficos (dólar em guaranis e real por dólar) com o mesmo período, escolhido nos botões.
  var FX_PERS = [
    [14, '2 semanas'],
    [30, 'Mês'],
    [90, '3 meses'],
    [365, 'Ano']
  ];

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
