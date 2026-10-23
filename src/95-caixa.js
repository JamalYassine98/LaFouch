  // ===== Aba Caixa: carteira, conversão de moedas e reservas. =====
  // Cotação de uma moeda em guaranis.
  function ratePyg(m) {
    return m === 'pyg' ? 1 : m === 'usd' ? S.fx.pyg : S.fx.pyg / S.fx.brl;
  }
  // Converte entre moedas.
  function conv(v, a, b) {
    return (v * ratePyg(a)) / ratePyg(b);
  }
  // Total da carteira em guaranis.
  function walletGs() {
    return S.cash.pyg + S.cash.usd * ratePyg('usd') + S.cash.brl * ratePyg('brl');
  }
  // Lê um número digitado.
  function parseDec(v, m) {
    var s = String(v).replace(/[^\d,.]/g, '');
    if (m === 'pyg') return Number(s.replace(/\D/g, '')) || 0;
    if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
    var n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }
  // Formata um valor para campo.
  function inVal(v, m) {
    return m === 'pyg' ? dots(v) : (Math.round(v * 100) / 100).toFixed(2).replace('.', ',');
  }
  // Valores reservados (reposição, contas, lucro).
  function reservas() {
    var valid = S.sales.filter(function (s) {
      return !s.estorno;
    });
    var rUSD = Math.max(
      0,
      S.ini.rep +
        sumBy(valid, 'repUSD') -
        S.compras.reduce(function (a, x) {
          return a + x.usd;
        }, 0)
    );
    var colch = S.ini.colch + sumBy(valid, 'colch'),
      con = Math.max(
        0,
        sumBy(periodSales(30), 'contas') -
          (S.cpay || [])
            .filter(function (x) {
              return x.ts > Date.now() - 30 * 864e5;
            })
            .reduce(function (a, x) {
              return a + x.valor;
            }, 0)
      );
    var melh =
      S.ini.melh +
      sumBy(valid, 'melh') -
      S.melhUso.reduce(function (a, x) {
        return a + x.valor;
      }, 0);
    var repGs = rUSD * S.fx.pyg,
      guard = repGs + colch + con,
      wal = walletGs();
    return {
      rUSD: rUSD,
      repGs: repGs,
      colch: colch,
      con: con,
      melh: melh,
      guard: guard,
      wal: wal,
      livre: wal - guard - melh
    };
  }
  // Atualiza o recebimento ao digitar.
  function updateRec() {
    var m = S.moeda,
      t = S._t,
      q = S._qty,
      v = S._recv,
      eff = v * ratePyg(m),
      el = $('recH');
    if (!el) return;
    var trava = Math.round(t.repUSD * S.fx.pyg) + contasPeca(),
      per = q ? eff / q : 0,
      list = t.price * q,
      diff = eff - list;
    el.textContent =
      'Equivale a ' +
      gs(eff) +
      (m !== 'pyg'
        ? ' (cotação de hoje: ' + MN[m] + ' 1 = ' + gs(Math.round(ratePyg(m))) + ')'
        : '') +
      (t.price && Math.abs(diff) >= 1
        ? '. ' +
          (diff > 0 ? 'Acima' : 'Abaixo') +
          ' do preço de tabela em ' +
          gs(Math.abs(Math.round(diff))) +
          '.'
        : '.') +
      (per < trava ? ' Atenção: abaixo da trava de segurança (' + gs(trava) + ' por peça).' : '');
    el.style.color = per < trava ? 'var(--warn)' : 'var(--mute)';
  }
  // Calculadora de venda por moeda.
  function renderMoeda() {
    var t = S._t || T(),
      q = (S._qty = S.qty),
      m = S.moeda,
      listGs = t.price * q,
      a = conv(listGs, 'pyg', m);
    a = m === 'pyg' ? Math.round(a) : Math.round(a * 100) / 100;
    var sig = [t.id, S._selKey, q, m, Math.round(S.fx.pyg)].join('|');
    if (S.rec != null && S.recSig !== sig) S.rec = null;
    S._sig = sig;
    var v = S.rec != null ? S.rec : a;
    S._recv = v;
    var mo = $('moedas');
    mo.textContent = '';
    [
      ['pyg', 'G$ Guarani'],
      ['brl', 'R$ Real'],
      ['usd', 'US$ Dólar']
    ].forEach(function (x) {
      mo.appendChild(
        btn(
          'chip' + (m === x[0] ? ' on' : ''),
          x[1],
          function () {
            S.moeda = x[0];
            S.rec = null;
            render();
          },
          m === x[0]
        )
      );
    });
    $('recIn').value = inVal(v, m);
    updateRec();
  }

  // ---------- caixa
  function trSel(id, val) {
    return (
      '<select class="in" id="' +
      id +
      '" data-in="' +
      id +
      '" aria-label="' +
      (id === 'trDe' ? 'Trocar de' : 'Receber em') +
      '" style="flex:1 1 130px;width:auto">' +
      ['pyg', 'usd', 'brl']
        .map(function (m) {
          return (
            '<option value="' +
            m +
            '"' +
            (m === val ? ' selected' : '') +
            '>' +
            { pyg: 'G$ Guarani', usd: 'US$ Dólar', brl: 'R$ Real' }[m] +
            '</option>'
          );
        })
        .join('') +
      '</select>'
    );
  }
  // Aba Caixa.
  function renderCaixa() {
    var el = $('v-caixa'),
      r = reservas(),
      c = S.cash;
    var html =
      '<div class="top"><div><h1>Caixa</h1><div class="crumb">Quanto dinheiro existe, quanto já tem dono e quanto é seu</div></div></div>';
    if (S.cxMsg)
      html +=
        '<div class="note ' +
        (S.cxMsg.indexOf('Não') === 0 ||
        S.cxMsg.indexOf('Saldo') === 0 ||
        S.cxMsg.indexOf('Informe') === 0
          ? 'n-bad'
          : 'n-ok') +
        '" role="status">' +
        esc(S.cxMsg) +
        '</div>';
    html +=
      '<section class="kpis"><div class="kpi"><div class="lbl">Dinheiro total (aproximado)</div><b>' +
      gs(r.wal) +
      '</b><div class="hint">somando as três moedas ao câmbio de hoje</div></div>' +
      '<div class="kpi"><div class="lbl">Tem que ficar guardado</div><b style="color:var(--warn)">' +
      gs(r.guard + r.melh) +
      '</b><div class="hint">mercadoria, colchão, contas e melhorias</div></div>' +
      '<div class="kpi"><div class="lbl">Livre para você</div><b style="color:' +
      (r.livre >= 0 ? 'var(--ok)' : 'var(--bad)') +
      '">' +
      gs(r.livre) +
      '</b><div class="hint">o que sobra depois de separar tudo</div></div></section>';
    if (r.livre < 0)
      html +=
        '<div class="note n-bad">O dinheiro em caixa está abaixo do que deveria estar separado. Evite retiradas até repor.</div>';
    html +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Saldo por moeda</h2><div class="kpis">' +
      ['pyg', 'usd', 'brl']
        .map(function (m) {
          return (
            '<div class="kpi" style="background:var(--panel2)"><div class="lbl">' +
            { pyg: 'Guaranis', usd: 'Dólares', brl: 'Reais' }[m] +
            '</div><b>' +
            fmtM(c[m], m) +
            '</b><div class="hint">' +
            (m === 'pyg' ? 'moeda base' : '≈ ' + gs(c[m] * ratePyg(m))) +
            '</div></div>'
          );
        })
        .join('') +
      '</div></section>';
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">O que já tem dono</h2><div class="hint" style="margin:2px 0 0">Valores acumulados pelas vendas, mais o saldo inicial que você informou.</div></div><div class="split">' +
      '<div class="sl"><span>Mercadoria (reposição)<small>' +
      usd(r.rUSD) +
      ' guardados. Custo de repor hoje: ' +
      gs(r.repGs) +
      '</small></span><b>' +
      gs(r.repGs) +
      '</b></div>' +
      '<div class="sl"><span>Colchão de segurança<small>reserva contra alta do dólar e do custo</small></span><b>' +
      gs(r.colch) +
      '</b></div>' +
      '<div class="sl"><span>Contas do mês<small>separado nos últimos 30 dias, de ' +
      gs(totalMensal()) +
      ' por mês</small></span><b>' +
      gs(r.con) +
      '</b></div>' +
      '<div class="sl"><span><b>Total guardado</b></span><b style="color:var(--warn)">' +
      gs(r.guard) +
      '</b></div>' +
      '<div class="sl" style="border-top:1px solid var(--line);padding-top:10px"><span>Caixa de melhorias da loja<small>opcional, não trava venda</small></span><b style="color:var(--info)">' +
      gs(r.melh) +
      '</b></div></div></section>';
    var pmk = ymNow(),
      pays = (S.cpay || [])
        .filter(function (x) {
          return x.ym === pmk;
        })
        .sort(function (a, b) {
          return b.ts - a.ts;
        }),
      ptot = pays.reduce(function (a, x) {
        return a + x.valor;
      }, 0);
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Contas pagas neste mês</h2><div class="hint" style="margin:2px 0 0">Cada vez que você toca em Pagar na aba Despesas, o valor sai dos guaranis em caixa e da reserva de contas.</div></div>' +
      (pays.length
        ? pays
            .map(function (x) {
              return (
                '<div class="sl"><span>' +
                esc(x.nome) +
                '<small>' +
                fd(x.ts) +
                ' às ' +
                fh(x.ts) +
                '</small></span><b>' +
                gs(x.valor) +
                '</b></div>'
              );
            })
            .join('') +
          '<div class="sl" style="border-top:1px solid var(--line);padding-top:10px"><span><b>Total pago</b></span><b>' +
          gs(ptot) +
          '</b></div>'
        : '<div class="hint" style="margin:0">Nenhuma conta paga neste mês ainda.</div>') +
      '</section>';
    var t = S.tr;
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Trocar moeda</h2><div class="hint" style="margin:2px 0 0">Registre a troca que você fez. Os saldos mudam nas duas moedas.</div></div>' +
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
      (S.cambios.length
        ? '<div class="lbl" style="margin-top:6px">Últimas trocas</div>' +
          S.cambios
            .slice(0, 5)
            .map(function (x) {
              return (
                '<div class="sl"><span>' +
                fmtM(x.dado, x.de) +
                ' → ' +
                fmtM(x.rec, x.para) +
                '<small>' +
                fd(x.ts) +
                ' às ' +
                fh(x.ts) +
                ' · ' +
                (x.difGs >= 0 ? '+' : '−') +
                gs(Math.abs(x.difGs)) +
                ' em relação ao câmbio do dia</small></span></div>'
              );
            })
            .join('')
        : '') +
      '</section>';
    html +=
      '<div class="two">' +
      '<section class="card col"><h2 style="margin:0;font-size:16px">Usar a caixa de melhorias</h2><div class="hint" style="margin:0">Tira do saldo de melhorias e dos guaranis em caixa.</div>' +
      '<div class="sel" style="flex-wrap:wrap"><input class="in" id="muD" placeholder="No que usou" style="flex:2 1 150px;width:auto" aria-label="Descrição do uso"><input class="in" id="muV" inputmode="numeric" placeholder="G$" style="flex:1 1 110px;width:auto" aria-label="Valor usado em guaranis"><button class="mini" data-act="melhuso">Registrar</button></div>' +
      S.melhUso
        .slice(-3)
        .reverse()
        .map(function (x) {
          return (
            '<div class="sl"><span>' +
            esc(x.desc) +
            '<small>' +
            fd(x.ts) +
            '</small></span><b>' +
            gs(x.valor) +
            '</b></div>'
          );
        })
        .join('') +
      '</section></div>';
    html +=
      '<details class="card"' +
      (S.confReset ? ' open' : '') +
      '><summary style="cursor:pointer;font-weight:600">Corrigir saldos (contagem real do caixa)</summary><div class="col" style="margin-top:12px"><div class="kpis">' +
      [
        ['ajP', 'Guaranis', inVal(c.pyg, 'pyg')],
        ['ajU', 'Dólares', inVal(c.usd, 'usd')],
        ['ajB', 'Reais', inVal(c.brl, 'brl')]
      ]
        .map(function (x) {
          return (
            '<div><div class="lbl">' +
            x[1] +
            '</div><input class="in" id="' +
            x[0] +
            '" inputmode="decimal" value="' +
            x[2] +
            '" aria-label="Saldo em ' +
            x[1] +
            '"></div>'
          );
        })
        .join('') +
      '</div>' +
      '<div class="lbl">Saldo inicial das reservas (antes de usar o app)</div><div class="kpis">' +
      [
        ['ajR', 'Mercadoria (US$)', inVal(S.ini.rep, 'usd')],
        ['ajC', 'Colchão (G$)', inVal(S.ini.colch, 'pyg')],
        ['ajM', 'Melhorias (G$)', inVal(S.ini.melh, 'pyg')]
      ]
        .map(function (x) {
          return (
            '<div><div class="lbl">' +
            x[1] +
            '</div><input class="in" id="' +
            x[0] +
            '" inputmode="decimal" value="' +
            x[2] +
            '" aria-label="' +
            x[1] +
            '"></div>'
          );
        })
        .join('') +
      '</div>' +
      '<button class="mini" data-act="ajustar" style="align-self:flex-start">Salvar saldos</button><div class="lbl" style="margin-top:8px">Começar do zero</div><div class="hint" style="margin:0">Apaga as peças, vendas, despesas e saldos de exemplo deste aparelho.</div><button class="chip" data-act="resetall" style="align-self:flex-start;color:var(--bad)">' +
      (S.confReset ? 'Confirmar: apagar tudo' : 'Apagar dados de exemplo') +
      '</button></div></details>';
    el.innerHTML = html;
    updateTr();
  }
  // Atualiza a transferência entre moedas.
  function updateTr() {
    var t = S.tr,
      v = parseDec(t.v, t.de),
      mkt = conv(v, t.de, t.para);
    if (!t.edited) {
      t.rec = v ? inVal(mkt, t.para) : '';
      var r = $('trRec');
      if (r) r.value = t.rec;
    }
    var rec = parseDec(t.rec, t.para),
      dif = rec * ratePyg(t.para) - v * ratePyg(t.de),
      p = $('trPrev');
    if (p)
      p.textContent = v
        ? 'Pelo câmbio de hoje: ' +
          fmtM(mkt, t.para) +
          '.' +
          (t.edited
            ? ' Você recebe ' +
              fmtM(rec, t.para) +
              ' (' +
              (dif >= 0 ? '+' : '−') +
              gs(Math.abs(Math.round(dif))) +
              ' em relação ao câmbio de hoje).'
            : '')
        : 'Digite o valor a trocar.';
  }

  S.dlog = [];
  S.elog = [
    { ts: tAgo(2, 3), tipo: 'pre', ref: 'SP58110', cor: 'Preto', grau: '+1.25', qty: 6 },
    { ts: tAgo(5, 2), tipo: 'sem', ref: 'BR44133', cor: 'Vinho', grau: '', qty: 4 },
    { ts: tAgo(0, 6), tipo: 'pre', ref: 'SP57765', cor: 'Preto', grau: '+0.75', qty: 4 }
  ];
  S.day = dayKey(Date.now());
  S.exp.forEach(function (e) {
    e.hist.forEach(function (x) {
      S.dlog.push({ ts: x.ts, kind: 'alt', nome: e.nome, cat: e.cat, de: x.de, para: x.para });
    });
  });
  S.imprev.forEach(function (x) {
    S.dlog.push(dlogImp(x));
  });
  S.melhUso.forEach(function (x) {
    S.dlog.push(dlogMelh(x));
  });
  S.compras.forEach(function (x) {
    S.dlog.push(dlogLote(x));
  });
