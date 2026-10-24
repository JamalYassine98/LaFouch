  // ===== Aba Histórico: dias, vendas e registros. =====
  // Totais de um dia.
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
  // Aba Histórico (montada em 97-hist-busca.js).
  function renderHist() {
    if (S.view !== 'hist' && !S._rtudo) return;
    histRender();
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
  // Fim de um dia.
  function dayEnd(k) {
    var p = k.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2], 23, 59, 59, 999).getTime();
  }
  // Formata um dia.
  function fmtDay(k) {
    var p = k.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }
  // Despesa mensal vigente em uma data.
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
  // Câmbio de um dia.
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
  // Cartão de um registro de peça no histórico.
  function elogCard(x) {
    return (
      '<div class="card" style="padding:14px"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center"><div><span class="cell">' +
      (x.descarte ? 'Descarte' : x.contagem ? 'Ajuste de contagem' : 'Entrada de estoque') +
      '</span><div style="margin-top:6px">' +
      (x.qty > 0 ? '+' : '') +
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
      '</div></div><b>' +
      (x.qty > 0 ? '+' : '') +
      x.qty +
      ' un.</b></div></div>'
    );
  }
  // Dias com movimento.
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
  // Detalhe de um dia.
  function renderDay() {
    var box = $('v-dia');
    if (!box || (S.view !== 'dia' && !S._rtudo)) return;
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
      '<div class="top" style="justify-content:flex-end"><button class="chip" data-act="daytoday">Hoje</button></div>' +
      '<section class="card col"><div class="dayrow"><button class="chip" data-act="dayprev" aria-label="Dia anterior">‹ Anterior</button><span class="dtxt">' +
      fmtDay(k) +
      '</span><button class="chip" data-act="daynext" aria-label="Próximo dia"' +
      (k >= today ? ' disabled' : '') +
      '>Próximo ›</button><button class="chip calb" data-act="daycal" aria-label="Escolher a data no calendário"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg></button><input type="date" class="in" id="dayIn" data-in="day" value="' +
      k +
      '" max="' +
      today +
      '" aria-label="Escolher o dia" tabindex="-1"></div></section>';
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
      ' venda(s)</div>' +
      (ok.length ? '<div class="hint" style="margin:2px 0 0">Entrou: ' + esc(recebidoDe(ok)) + '</div>' : '') +
      '</div>' +
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
        ? '<div class="kpis"><div class="kpi" style="background:var(--panel2)"><div class="lbl">US$ 1 custa</div><b>' +
          gsRaw(fx.p.pyg) +
          '</b>' +
          (fx.prev
            ? '<div class="hint">' +
              (fx.p.pyg >= fx.prev.pyg ? '+' : '−') +
              pc(Math.abs(fx.p.pyg / fx.prev.pyg - 1)) +
              ' sobre o dia anterior</div>'
            : '') +
          '</div><div class="kpi" style="background:var(--panel2)"><div class="lbl">US$ 1 custa</div><b>R$ ' +
          fx.p.brl.toFixed(2).replace('.', ',') +
          '</b></div><div class="kpi" style="background:var(--panel2)"><div class="lbl">R$ 1 custa</div><b>' +
          gsRaw(Math.round(fx.p.pyg / fx.p.brl)) +
          '</b></div></div>' +
          (fx.exact
            ? ''
            : '<div class="hint" style="margin:0">Sem cotação guardada neste dia. Mostrando a última anterior (' +
              fd(fx.p.ts) +
              ').</div>')
        : '<div class="hint" style="margin:0">Sem cotação guardada até esta data.</div>') +
      '</section>';
    if (tr.length)
      h +=
        '<section class="card col"><h2 style="margin:0;font-size:16px">Câmbio feito neste dia</h2>' +
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
  // Rótulo e texto de um registro de despesa.
  function dlogInfo(x) {
    var L = {
        alt: 'Valor alterado',
        novo: 'Nova despesa',
        rem: 'Despesa removida',
        imp: 'Imprevisto',
        melh: 'Caixa de melhorias',
        lote: 'Compra de lote',
        pago: 'Conta paga',
        ret: 'Retirada do dono',
        descarte: 'Descarte (prejuízo)',
        confcx: 'Conferência do caixa'
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
      a = x.moeda && x.moeda !== 'pyg' && x.orig != null ? fmtM(x.orig, x.moeda) : gs(x.valor);
    }
    return { label: L, text: t, amount: a, search: (L + ' ' + t).toLowerCase() };
  }
  // Cartão de um registro de despesa.
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
  // Cartão de uma venda no histórico.
  // Valor exato da venda, na moeda em que foi recebido (o resto do app converte para a moeda principal).
  function exatoDe(s) {
    var liq = {},
      bruto = [];
    (s.pags && s.pags.length ? s.pags : [{ moeda: s.moeda || 'pyg', v: s.recebido != null ? s.recebido : s.price }]).forEach(function (l) {
      liq[l.moeda] = (liq[l.moeda] || 0) + l.v;
      bruto.push(fmtM(l.v, l.moeda));
    });
    (s.troco || []).forEach(function (l) {
      liq[l.moeda] = (liq[l.moeda] || 0) - l.v;
    });
    var ms = Object.keys(liq),
      neg = ms.some(function (m) {
        return liq[m] < -0.005;
      });
    if (neg) return bruto.join(' + ');
    return ms
      .filter(function (m) {
        return Math.abs(liq[m]) > 0.005;
      })
      .map(function (m) {
        return fmtM(Math.round(liq[m] * 100) / 100, m);
      })
      .join(' + ');
  }
  // Soma do que entrou no dia, moeda por moeda.
  function recebidoDe(list) {
    var t = {};
    list.forEach(function (s) {
      (s.pags && s.pags.length ? s.pags : [{ moeda: s.moeda || 'pyg', v: s.recebido != null ? s.recebido : s.price }]).forEach(function (l) {
        t[l.moeda] = (t[l.moeda] || 0) + l.v;
      });
      (s.troco || []).forEach(function (l) {
        t[l.moeda] = (t[l.moeda] || 0) - l.v;
      });
    });
    return ['pyg', 'usd', 'brl']
      .filter(function (m) {
        return t[m] && Math.abs(t[m]) > 0.005;
      })
      .map(function (m) {
        return fmtM(Math.round(t[m] * 100) / 100, m);
      })
      .join(' + ');
  }
  // Nome da venda para listas: quantidade, nome do produto (tipo e número, se não tiver nome), grau ou variação e cor.
  function vendaNome(s) {
    return s.qty + '× ' + pn(s.ref) + ' ' + (s.tipo === 'pre' ? s.grau : s.vr || '') + (s.cor && s.cor !== 'Sem cor' ? ' · ' + s.cor : '');
  }
  function saleCard(s) {
    var open = S.hOpen === s.id,
      dx = S.fx.pyg / s.fx - 1,
      h = '';
    h +=
      '<div class="card col" style="padding:14px;' +
      (s.estorno ? 'opacity:.7' : '') +
      '"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center"><div><span class="cell">' + (s.carrinho ? 'Venda (pedido)' : 'Venda') + '</span><div style="margin-top:6px"><b style="' +
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
      '</div></div><div style="text-align:right"><b>' +
      esc(exatoDe(s)) +
      '</b>' +
      (gs(s.price) !== exatoDe(s) ? '<div class="hint" style="margin:2px 0 0">≈ ' + gs(s.price) + '</div>' : '') +
      '</div></div>';
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
            s.pags && s.pags.length
              ? s.pags
                  .map(function (l) {
                    return fmtM(l.v, l.moeda) + (l.moeda !== 'pyg' ? ' (câmbio ' + gsRaw(Math.round(l.rate)) + ')' : '');
                  })
                  .join(' + ')
              : fmtM(s.recebido, s.moeda) + (s.moeda !== 'pyg' ? ' (cotação ' + gsRaw(s.rate) + ')' : '')
          ],
          [
            'Troco devolvido',
            s.troco && s.troco.length
              ? s.troco
                  .map(function (l) {
                    return fmtM(l.v, l.moeda);
                  })
                  .join(' + ')
              : 'sem troco'
          ],
          ['Forma de pagamento', formaPorId(s.forma).nome + (s.taxa ? ' (taxa ' + gs(s.taxa) + ')' : '')],
          [
            'Câmbio no dia',
            gsRaw(s.fx) +
              ' por US$ (hoje ' +
              gsRaw(S.fx.pyg) +
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
