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
    var colch = Math.max(0, S.ini.colch + sumBy(valid, 'colch') - sumBy(S.colchUsos || [], 'gs')),
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
      sumBy(valid, 'melh') +
      objExtra() -
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
      pt = pagTotais(),
      eff = pt.liq,
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
        ? ' (' + (numRate(S.rate1) > 0 ? 'câmbio combinado' : fxOrigem(m)) + ': ' + fxTxtUsd(m, rateDe(m, numRate(S.rate1))) + ')'
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
    if (typeof renderPiso === 'function' && S.cartOpen) renderPiso();
  }
  // Calculadora de venda por moeda.
  function renderMoeda() {
    var t = S._t || T(),
      q = (S._qty = S.qty),
      m = S.moeda;
    if (S._pagKey !== S._selKey) {
      S._pagKey = S._selKey;
      pagReset();
    }
    var listGs = t.price * q;
    S._dueGs = listGs;
    var r1 = rateDe(m, numRate(S.rate1)),
      a = m === 'pyg' ? Math.round(listGs) : Math.round((listGs / r1) * 100) / 100;
    var bb = S.vBrinde ? S.vBrinde.ref + S.vBrinde.cor : '',
      sig = [t.id, S._selKey, q, m, Math.round(S.fx.pyg), bb, S.rate1 || '', S.pagMisto ? 1 : 0].join('|');
    if (S.rec != null && S.recSig !== sig) S.rec = null;
    S._sig = sig;
    var v = S.rec != null ? S.rec : S.pagMisto ? 0 : a;
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
            S.rate1 = '';
            S.rec = null;
            render();
          },
          m === x[0]
        )
      );
    });
    renderForma();
    $('recIn').value = S.pagMisto && S.rec == null ? '' : inVal(v, m);
    pmRender();
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
  // Contas pagas no mês: usado no Dashboard.
  function contasPagasHtml() {
    var html = '';
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
      '<section class="col" style="padding:0 16px 14px"><div><div class="hint" style="margin:2px 0 0">Cada vez que você toca em Pagar na aba Despesas, o valor sai dos guaranis em caixa e da reserva de contas.</div></div>' +
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
    return html;
  }
  // Aba Caixa.
  function renderCaixa() {
    if (S.view !== 'caixa' && !S._rtudo) return;
    var el = $('v-caixa'),
      r = reservas(),
      c = S.cash;
    var html =
      '<div class="top" style="flex-wrap:nowrap;align-items:flex-start"><div style="min-width:0;flex:1"><h1>Caixa</h1><div class="crumb">Quanto dinheiro existe, quanto já tem dono e quanto é seu</div></div><div style="position:relative;flex:none"><button type="button" class="ic' + (S.cxMenu ? ' on' : '') + '" id="cxIc" data-act="cxmenu" aria-label="Ações do caixa" aria-expanded="' + !!S.cxMenu + '">' + ICO.caixa + '</button>' +
      (S.cxMenu
        ? '<div class="cxMenu" role="menu"><button type="button" role="menuitem" data-act="cxabre" data-id="ret">' + ICO.sobe + 'Retirar</button><button type="button" role="menuitem" data-act="cxabre" data-id="mel">' + ICO.ferr + 'Novo objetivo</button><button type="button" role="menuitem" data-act="cxabre" data-id="cc">' + ICO.chk + 'Conferir</button></div>'
        : '') +
      '</div></div>';
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
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Dinheiro no caixa agora</h2><div class="hint" style="margin:2px 0 0">O que você tem em mãos, em cada moeda.</div></div><div class="kpis">' +
      ['pyg', 'usd', 'brl']
        .map(function (m) {
          return (
            '<div class="kpi" style="background:var(--panel2)"><div class="lbl">' +
            { pyg: 'Guaranis', usd: 'Dólares', brl: 'Reais' }[m] +
            '</div><b style="font-size:24px">' +
            fmtM(c[m], m) +
            '</b><div class="hint">' +
            (m === 'pyg' ? 'moeda base' : '≈ ' + gsRaw(Math.round(c[m] * ratePyg(m)))) +
            '</div></div>'
          );
        })
        .join('') +
      '</div><div class="hint" style="margin:0">Total aproximado: <b>' +
      gs(Math.round(r.wal)) +
      '</b> ao câmbio de hoje. O que está livre e o que já tem dono ficam no <a href="#dash" data-act="view" data-id="dash" style="color:var(--accent-fg)">Dashboard</a>, aba Dinheiro.</div></section>';
    html += objCardHtml(); // v425: Objetivos da loja (antiga caixa de melhorias)
    if (r.livre < 0)
      html +=
        '<div class="note n-bad">O dinheiro em caixa está abaixo do que deveria estar separado. Evite retiradas até repor.</div>';
    // Caixa limpo: saldo e movimentos à vista; Retirar, Melhorias e Conferir abrem em gaveta pelo ícone do topo
    var acao = S.cxAcao || '';
    if (S.cxMsg !== S._cxMsgVis) {
      S._cxMsgVis = S.cxMsg;
      if (acao && S.cxMsg && !/^(Não|Saldo|Informe)/.test(S.cxMsg)) acao = S.cxAcao = '';
    }
    var sh = function (k, inner) {
      return '<div class="cxAcao' + (acao === k ? ' on' : '') + '" data-k="' + k + '"><div class="cxPuxa" aria-hidden="true"></div>' + inner + '</div>';
    };
    html += '<div class="cxBack' + (acao ? ' on' : '') + '" data-act="cxfecha"></div>';
    html += sh('ret', retiradaHtml());
    html += sh('cc', ccHtml());
    html += sh('mel', objFormHtml());
    // movimentos: retiradas e usos da caixa de melhorias, do mais novo para o mais antigo
    var mov = S.retiradas.slice(0, 8).map(function (x) {
      return { ts: x.ts, nome: x.nota || 'Retirada', val: fmtM(x.orig, x.moeda), des: x.ts };
    });
    S.melhUso.slice(-5).forEach(function (x) {
      mov.push({ ts: x.ts, nome: x.desc + ' (objetivo)', val: gs(x.valor), des: '' });
    });
    mov.sort(function (a, b) {
      return b.ts - a.ts;
    });
    html +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Movimentos</h2>' +
      (mov.length
        ? mov
            .slice(0, 10)
            .map(function (x) {
              return '<div class="sl"><span>' + esc(x.nome) + '<small>' + fd(x.ts) + ' às ' + fh(x.ts) + (x.des ? ' · <a href="#" data-act="rtdes" data-id="' + x.des + '" style="color:var(--accent-fg)">desfazer</a>' : '') + '</small></span><b>' + x.val + '</b></div>';
            })
            .join('')
        : '<div class="hint" style="margin:0">Nenhum movimento ainda.</div>') +
      '</section>';
    el.innerHTML = html;
    objGestos();
    ['obNome', 'obCusto', 'obAte'].forEach(function (id) {
      var e = $(id);
      if (e)
        e.oninput = e.onchange = function () {
          OBJ[{ obNome: 'nome', obCusto: 'custo', obAte: 'ate' }[id]] = e.value;
        };
    });
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
      p = $('trPrev'),
      fo = null;
    if (t.de === 'usd' && v > 0 && v <= (S.cash.usd || 0) + 0.005 && t.para !== 'usd') fo = fonteDolar(v);
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
    if (p && fo)
      p.textContent +=
        ' Sai de: ' +
        usd(fo.extra) +
        ' que sobram' +
        (fo.col > 0 ? ', ' + usd(fo.col) + ' do colchão' : '') +
        (fo.rep > 0 ? ', ' + usd(fo.rep) + ' da reposição (ela fica aberta)' : '') +
        '.' +
        (S.trConf ? ' Toque em Registrar de novo para confirmar.' : '');
    if (p && !fo && t.de !== 'usd' && t.para !== 'usd' && v > 0 && Math.abs(dif) >= 1)
      p.textContent += ' A diferença é só do câmbio da casa de câmbio e não mexe nas reservas.';
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
