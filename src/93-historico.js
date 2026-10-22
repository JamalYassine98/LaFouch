  function dayStats(k) {
    var inDay = function (x) {
        return dayKey(x.ts) === k;
      },
      sales = S.sales.filter(inDay),
      ok = sales.filter(function (x) {
        return !x.estorno;
      }),
      dl = S.dlog.filter(inDay),
      fx = fxOfDay(k);
    var extra = dl
      .filter(function (x) {
        return x.kind === 'imp' || x.kind === 'melh';
      })
      .reduce(function (a, x) {
        return a + x.valor;
      }, 0);
    return {
      n: ok.length,
      est: sales.length - ok.length,
      vend: sumBy(ok, 'price'),
      liv: sumBy(ok, 'livre'),
      extra: extra,
      nd: dl.length,
      outros: S.cambios.filter(inDay).length + S.elog.filter(inDay).length,
      fx: fx
    };
  }
  function renderHist() {
    var el = $('v-hist'),
      act = activeDays(),
      today = dayKey(Date.now());
    act[today] = act[today] || { v: 0, d: 0, o: 0 };
    var keys = Object.keys(act).sort().reverse();
    var html =
      '<div class="top"><div><h1>Histórico</h1><div class="crumb">Um cartão por dia. Toque num dia para abrir tudo o que aconteceu nele.</div></div><div class="tabs"><button class="mini" data-act="copyhist">Copiar backup (JSON)</button></div></div><div class="hint" id="hcopied" role="status" style="margin:0"></div><div class="list" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">';
    keys.forEach(function (k) {
      var st = dayStats(k),
        d = new Date(dayEnd(k)),
        wd = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
      html +=
        '<button class="pcard" data-act="opendia" data-id="' +
        k +
        '" aria-label="Abrir o dia ' +
        fmtDay(k) +
        '" style="gap:10px;padding:14px">' +
        '<span style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><b style="font-size:18px">' +
        fmtDay(k).slice(0, 5) +
        (k === today ? ' · hoje' : '') +
        '</b><span class="hint" style="margin:0;text-transform:capitalize">' +
        wd +
        '</span></span>' +
        '<span style="font-size:22px;font-weight:800;font-variant-numeric:tabular-nums">' +
        gs(st.vend) +
        '</span>' +
        '<span class="pills"><span class="cell">' +
        st.n +
        ' venda(s)' +
        (st.est ? ' · ' + st.est + ' estornada(s)' : '') +
        '</span>' +
        (st.extra || st.nd
          ? '<span class="cell low">' +
            (st.extra ? 'gastos ' + gs(st.extra) : st.nd + ' despesa(s)') +
            '</span>'
          : '') +
        (st.outros ? '<span class="cell">' + st.outros + ' outro(s)</span>' : '') +
        '</span>' +
        '<span class="hint" style="margin:0">' +
        (st.fx ? 'Dólar G$ ' + dots(st.fx.p.pyg) : 'Sem cotação') +
        ' · lucro livre ' +
        gs(st.liv) +
        '</span></button>';
    });
    html += '</div>';
    el.innerHTML = html;
  }
  // ---------- por dia
  function dayKey(ts) {
    var d = new Date(ts);
    return (
      d.getFullYear() +
      '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + d.getDate()).slice(-2)
    );
  }
  function dayEnd(k) {
    var p = k.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2], 23, 59, 59, 999).getTime();
  }
  function fmtDay(k) {
    var p = k.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }
  function monthlyAt(end) {
    var out = [];
    S.exp.forEach(function (e) {
      if (
        S.dlog.some(function (x) {
          return x.kind === 'novo' && x.nome === e.nome && x.ts > end;
        })
      )
        return;
      var v = e.valor;
      e.hist
        .slice()
        .reverse()
        .forEach(function (x) {
          if (x.ts > end) v = x.de;
        });
      out.push({ nome: e.nome, cat: e.cat, valor: v });
    });
    S.dlog
      .filter(function (x) {
        return x.kind === 'rem' && x.ts > end;
      })
      .forEach(function (x) {
        out.push({ nome: x.nome, cat: x.cat, valor: x.valor });
      });
    return out;
  }
  function fxOfDay(k) {
    var end = dayEnd(k),
      ix = -1;
    S.fxHist.forEach(function (p, i) {
      if (p.ts <= end) ix = i;
    });
    if (ix < 0) return null;
    return {
      p: S.fxHist[ix],
      prev: ix > 0 ? S.fxHist[ix - 1] : null,
      exact: dayKey(S.fxHist[ix].ts) === k
    };
  }
  function elogCard(x) {
    return (
      '<div class="card" style="padding:14px"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center"><div><span class="cell">Entrada de estoque</span><div style="margin-top:6px">+' +
      x.qty +
      ' × ' +
      esc(x.ref) +
      ' · ' +
      esc(x.cor) +
      (x.grau ? ' · ' + esc(x.grau) : '') +
      '</div><div class="hint" style="margin:2px 0 0">' +
      fd(x.ts) +
      ' às ' +
      fh(x.ts) +
      '</div></div><b>+' +
      x.qty +
      ' un.</b></div></div>'
    );
  }
  function activeDays() {
    var m = {};
    function add(ts, k) {
      var d = dayKey(ts);
      m[d] = m[d] || { v: 0, d: 0, o: 0 };
      m[d][k]++;
    }
    S.sales.forEach(function (s) {
      add(s.ts, 'v');
    });
    S.dlog.forEach(function (x) {
      add(x.ts, 'd');
    });
    S.cambios.forEach(function (x) {
      add(x.ts, 'o');
    });
    S.elog.forEach(function (x) {
      add(x.ts, 'o');
    });
    return m;
  }
  function renderDay() {
    var box = $('v-dia');
    if (!box) return;
    var k = S.day,
      inDay = function (x) {
        return dayKey(x.ts) === k;
      };
    var sales = S.sales.filter(inDay),
      ok = sales.filter(function (s) {
        return !s.estorno;
      }),
      dl = S.dlog.filter(inDay),
      tr = S.cambios.filter(inDay),
      el = S.elog.filter(inDay),
      fx = fxOfDay(k);
    var mAt = monthlyAt(dayEnd(k)),
      tm = mAt.reduce(function (a, e) {
        return a + e.valor;
      }, 0),
      rateio = Math.round(tm / 30),
      contasSep = sumBy(ok, 'contas'),
      cob = rateio ? contasSep / rateio : 0;
    var vend = sumBy(ok, 'price'),
      pcs = sumBy(ok, 'qty'),
      liv = sumBy(ok, 'livre');
    var extraG = dl
        .filter(function (x) {
          return x.kind === 'imp' || x.kind === 'melh';
        })
        .reduce(function (a, x) {
          return a + x.valor;
        }, 0),
      loteU = dl
        .filter(function (x) {
          return x.kind === 'lote';
        })
        .reduce(function (a, x) {
          return a + x.usd;
        }, 0);
    var today = dayKey(Date.now());
    var h =
      '<div class="top"><button class="chip" data-act="hback">‹ Voltar ao histórico</button><button class="chip" data-act="closedia">Fechar esta aba ×</button></div>' +
      '<section class="card col"><div class="sel" style="flex-wrap:wrap"><button class="chip" data-act="dayprev" aria-label="Dia anterior">‹ Anterior</button><input type="date" class="in" id="dayIn" data-in="day" value="' +
      k +
      '" max="' +
      today +
      '" aria-label="Escolher o dia" style="width:auto;flex:1 1 150px"><button class="chip" data-act="daynext" aria-label="Próximo dia"' +
      (k >= today ? ' disabled' : '') +
      '>Próximo ›</button><button class="chip" data-act="daytoday">Hoje</button></div></section>';
    h +=
      '<div><h2 style="margin:0;font-size:20px">' +
      (function (t) {
        return t.charAt(0).toUpperCase() + t.slice(1);
      })(
        new Date(dayEnd(k)).toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      ) +
      '</h2></div>';
    h +=
      '<section class="kpis"><div class="kpi"><div class="lbl">Vendido</div><b>' +
      gs(vend) +
      '</b><div class="hint">' +
      pcs +
      ' peça(s) em ' +
      ok.length +
      ' venda(s)</div></div>' +
      '<div class="kpi"><div class="lbl">Lucro livre</div><b style="color:var(--ok)">' +
      gs(liv) +
      '</b><div class="hint">depois de separar tudo</div></div>' +
      '<div class="kpi"><div class="lbl">Contas do dia</div><b style="color:var(--warn)">' +
      gs(rateio) +
      '</b><div class="hint">1/30 de ' +
      gs(tm) +
      ' por mês</div></div>' +
      '<div class="kpi"><div class="lbl">Gastos extras</div><b>' +
      gs(extraG) +
      '</b><div class="hint">' +
      (loteU ? '+ ' + usd(loteU) + ' em lote' : 'imprevistos e melhorias') +
      '</div></div></section>';
    h +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Câmbio do dia</h2>' +
      (fx
        ? '<div class="kpis"><div class="kpi" style="background:var(--panel2)"><div class="lbl">G$ por US$ 1</div><b>' +
          dots(fx.p.pyg) +
          '</b>' +
          (fx.prev
            ? '<div class="hint">' +
              (fx.p.pyg >= fx.prev.pyg ? '+' : '−') +
              pc(Math.abs(fx.p.pyg / fx.prev.pyg - 1)) +
              ' sobre o dia anterior</div>'
            : '') +
          '</div><div class="kpi" style="background:var(--panel2)"><div class="lbl">R$ por US$ 1</div><b>' +
          fx.p.brl.toFixed(2).replace('.', ',') +
          '</b></div><div class="kpi" style="background:var(--panel2)"><div class="lbl">G$ por R$ 1</div><b>' +
          dots(Math.round(fx.p.pyg / fx.p.brl)) +
          '</b></div></div>' +
          (fx.exact
            ? ''
            : '<div class="hint" style="margin:0">Sem cotação guardada neste dia. Mostrando a última anterior (' +
              fd(fx.p.ts) +
              ').</div>')
        : '<div class="hint" style="margin:0">Sem cotação guardada até esta data.</div>') +
      '</section>';
    h +=
      '<section class="col"><div class="lbl" style="margin:6px 0 0">Vendas do dia</div>' +
      (sales.length
        ? sales.map(saleCard).join('')
        : '<div class="note n-info">Nenhuma venda neste dia.</div>') +
      '</section>';
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Despesas do dia</h2><div class="hint" style="margin:2px 0 0">As contas do mês entram divididas por 30. Os gastos extras entram no dia em que foram feitos.</div></div><div style="overflow-x:auto"><table class="tb"><thead><tr><th>Conta</th><th>Grupo</th><th>Por mês</th><th>Parte do dia</th></tr></thead><tbody>' +
      mAt
        .map(function (e) {
          return (
            '<tr><td>' +
            esc(e.nome) +
            '</td><td>' +
            CATS[e.cat] +
            '</td><td>' +
            gs(e.valor) +
            '</td><td>' +
            gs(Math.round(e.valor / 30)) +
            '</td></tr>'
          );
        })
        .join('') +
      '<tr><td><b>Total</b></td><td></td><td><b>' +
      gs(tm) +
      '</b></td><td><b>' +
      gs(rateio) +
      '</b></td></tr></tbody></table></div>' +
      '<div class="note ' +
      (ok.length ? (cob >= 1 ? 'n-ok' : 'n-warn') : 'n-info') +
      '">' +
      (ok.length
        ? 'As vendas do dia separaram ' +
          gs(contasSep) +
          ' para as contas, ' +
          Math.round(cob * 100) +
          '% da parte do dia (' +
          gs(rateio) +
          ').'
        : 'Sem vendas neste dia, nada foi separado para as contas.') +
      '</div>' +
      (dl.length
        ? '<div class="lbl">Gastos e mudanças registrados</div>' + dl.map(dlogCard).join('')
        : '<div class="hint" style="margin:0">Nenhum gasto extra ou mudança de despesa registrado neste dia.</div>') +
      '</section>';
    if (tr.length)
      h +=
        '<section class="card col"><h2 style="margin:0;font-size:16px">Trocas de moeda</h2>' +
        tr
          .map(function (x) {
            return (
              '<div class="sl"><span>' +
              fmtM(x.dado, x.de) +
              ' → ' +
              fmtM(x.rec, x.para) +
              '<small>' +
              fh(x.ts) +
              ' · ' +
              (x.difGs >= 0 ? '+' : '−') +
              gs(Math.abs(x.difGs)) +
              ' em relação ao câmbio do dia</small></span></div>'
            );
          })
          .join('') +
        '</section>';
    if (el.length)
      h +=
        '<section class="col"><div class="lbl" style="margin:6px 0 0">Entradas de estoque</div>' +
        el.map(elogCard).join('') +
        '</section>';
    h +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Fechamento do dia</h2><div class="split">' +
      [
        ['Vendido', gs(vend)],
        ['Reposição separada', gs(sumBy(ok, 'rep')) + ' (' + usd(sumBy(ok, 'repUSD')) + ')'],
        ['Contas separadas', gs(contasSep)],
        ['Colchão separado', gs(sumBy(ok, 'colch'))],
        ['Caixa de melhorias', gs(sumBy(ok, 'melh'))],
        ['Lucro livre', gs(liv)],
        ['Gastos extras (imprevistos e melhorias)', '−' + gs(extraG)],
        ['Lucro livre depois dos gastos extras', gs(liv - extraG)]
      ]
        .map(function (r, i) {
          return (
            '<div class="sl"' +
            (i === 7
              ? ' style="border-top:1px solid var(--line);padding-top:8px;font-weight:700"'
              : '') +
            '><span>' +
            r[0] +
            '</span><b>' +
            r[1] +
            '</b></div>'
          );
        })
        .join('') +
      '</div></section>';
    box.innerHTML = h;
  }
  function dlogInfo(x) {
    var L = {
        alt: 'Valor alterado',
        novo: 'Nova despesa',
        rem: 'Despesa removida',
        imp: 'Imprevisto',
        melh: 'Caixa de melhorias',
        lote: 'Compra de lote',
        pago: 'Conta paga'
      }[x.kind],
      t,
      a;
    if (x.kind === 'alt') {
      var d = x.para - x.de;
      t =
        x.nome +
        ' (' +
        CATS[x.cat] +
        '): ' +
        gs(x.de) +
        ' → ' +
        gs(x.para) +
        ' (' +
        (d >= 0 ? '+' : '−') +
        pc(Math.abs(x.para / x.de - 1)) +
        ')';
      a = sgn(d) + ' por mês';
    } else if (x.kind === 'novo') {
      t =
        x.nome + ' (' + CATS[x.cat] + ', ' + (x.tipo === 'fixa' ? 'fixa' : 'variável') + ') criada';
      a = gs(x.valor) + ' por mês';
    } else if (x.kind === 'rem') {
      t = x.nome + ' (' + CATS[x.cat] + ') removida. Valor era ' + gs(x.valor) + ' por mês';
      a = '−' + gs(x.valor) + ' por mês';
    } else if (x.kind === 'lote') {
      t = x.desc + ' pago em dólar';
      a = usd(x.usd);
    } else {
      t = x.desc;
      a = gs(x.valor);
    }
    return { label: L, text: t, amount: a, search: (L + ' ' + t).toLowerCase() };
  }
  function dlogCard(x) {
    var i = dlogInfo(x);
    return (
      '<div class="card" style="padding:14px"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center"><div style="min-width:0"><span class="cell">' +
      i.label +
      '</span><div style="margin-top:6px">' +
      esc(i.text) +
      '</div><div class="hint" style="margin:2px 0 0">' +
      fd(x.ts) +
      ' às ' +
      fh(x.ts) +
      '</div></div><b>' +
      esc(i.amount) +
      '</b></div></div>'
    );
  }
  function saleCard(s) {
    var open = S.hOpen === s.id,
      dx = S.fx.pyg / s.fx - 1,
      h = '';
    h +=
      '<div class="card col" style="padding:14px;' +
      (s.estorno ? 'opacity:.7' : '') +
      '"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center"><div><span class="cell">Venda</span><div style="margin-top:6px"><b style="' +
      (s.estorno ? 'text-decoration:line-through' : '') +
      '">' +
      esc(descOf(s)) +
      '</b></div><div class="hint" style="margin:2px 0 0">' +
      s.id +
      ' · ' +
      fd(s.ts) +
      ' às ' +
      fh(s.ts) +
      ' · ' +
      tipoOf(s.tipo).label +
      (s.estorno ? ' · <span style="color:var(--bad)">Estornada</span>' : '') +
      '</div></div><b>' +
      gs(s.price) +
      '</b></div>';
    h +=
      '<div class="nav"><button class="chip" data-act="hopen" data-id="' +
      s.id +
      '" aria-expanded="' +
      open +
      '">' +
      (open ? 'Ocultar detalhes' : 'Ver detalhes') +
      '</button>' +
      (s.estorno
        ? ''
        : '<button class="chip" data-act="estorno" data-id="' +
          s.id +
          '">' +
          (S.confEst === s.id ? 'Confirmar estorno' : 'Estornar') +
          '</button>') +
      '</div>';
    if (open)
      h +=
        '<div class="split" style="border-top:1px solid var(--line);padding-top:10px">' +
        [
          [
            'Recebido',
            fmtM(s.recebido, s.moeda) + (s.moeda !== 'pyg' ? ' (cotação ' + gs(s.rate) + ')' : '')
          ],
          [
            'Câmbio no dia',
            gs(s.fx) +
              ' por US$ (hoje ' +
              gs(S.fx.pyg) +
              ', ' +
              (dx >= 0 ? '+' : '−') +
              pc(Math.abs(dx)) +
              ')'
          ],
          ['Custo pago', usd(s.pago)],
          ['Custo de reposição', usd(s.repUSD)],
          ['Reposição separada', gs(s.rep)],
          ['Contas separadas', gs(s.contas) + ' (' + gs(s.cPeca) + ' por peça)'],
          ['Colchão (' + pc(s.pct) + ')', gs(s.colch)],
          ['Caixa de melhorias', gs(s.melh)],
          ['Lucro livre', gs(s.livre)],
          ['Preço mínimo seguro na hora', gs(s.trava) + ' por peça']
        ]
          .map(function (r) {
            return (
              '<div class="sl"><span>' +
              r[0] +
              '</span><b style="text-align:right">' +
              r[1] +
              '</b></div>'
            );
          })
          .join('') +
        '</div>';
    return h + '</div>';
  }

  // ---------- eventos
