
  // ---------- despesas
  function ymNow() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
  }
  function expCard(e) {
    var last = e.hist[e.hist.length - 1],
      paid = !!(e.paid && e.paid[ymNow()]);
    var h =
      '<div class="card col" style="background:var(--panel2);padding:14px"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:baseline"><div><b>' +
      esc(e.nome) +
      '</b> <span class="cell">' +
      (e.tipo === 'fixa' ? 'fixa' : 'variável') +
      '</span></div><div style="display:flex;align-items:center;gap:10px"><button type="button" data-act="exppay" data-id="' +
      e.id +
      '" aria-pressed="' +
      paid +
      '" title="' +
      (paid ? 'Toque para desfazer' : 'Marcar como paga neste mês') +
      '" style="min-height:34px;padding:0 14px;border-radius:999px;font-size:13px;background:' +
      (paid ? 'rgba(34,197,94,.2)' : 'transparent') +
      ';border:1px solid ' +
      (paid ? '#22c55e' : 'var(--line)') +
      ';color:' +
      (paid ? '#86efac' : 'var(--sub)') +
      '">' +
      (paid ? '✓ Pago' : 'Pagar') +
      '</button></div></div>';
    h +=
      '<div class="sel" style="flex-wrap:wrap"><input class="in" id="ev-' +
      e.id +
      '" inputmode="numeric" data-in="exp" data-id="' +
      e.id +
      '" value="' +
      dots(e.valor) +
      '" aria-label="Novo valor de ' +
      esc(e.nome) +
      '" style="flex:1 1 160px;width:auto"><button class="mini" data-act="expsave" data-id="' +
      e.id +
      '">Salvar novo valor</button>' +
      '<button class="chip" data-act="exprm" data-id="' +
      e.id +
      '">' +
      (S.confRm === e.id ? 'Confirmar remoção' : 'Remover') +
      '</button></div>';
    h +=
      '<div class="hint" id="pv-' +
      e.id +
      '" style="margin:0">' +
      (e.tipo === 'variavel'
        ? 'Valor muda todo mês. Atualize quando a conta chegar.'
        : 'Altere e veja o efeito antes de salvar.') +
      '</div>';
    if (e.hist.length)
      h +=
        '<div class="hint" style="margin:0">Histórico: ' +
        e.hist
          .slice(-3)
          .reverse()
          .map(function (x) {
            return (
              fd(x.ts) +
              ' ' +
              gs(x.de) +
              ' → ' +
              gs(x.para) +
              ' (' +
              (x.para >= x.de ? '+' : '−') +
              pc(Math.abs(x.para / x.de - 1)) +
              ')'
            );
          })
          .join(' · ') +
        '</div>';
    return h + '</div>';
  }
  function renderDesp() {
    var el = $('v-desp'),
      tm = totalMensal(),
      imp = S.exp
        .filter(function (e) {
          return e.cat === 'imprev';
        })
        .reduce(function (a, e) {
          return a + e.valor;
        }, 0),
      gasto = S.imprev.reduce(function (a, x) {
        return a + x.valor;
      }, 0);
    var html =
      '<div class="top"><div><h1>Despesas</h1><div class="crumb">Contas que o dinheiro das vendas precisa cobrir todo mês</div></div></div>';
    html +=
      '<section class="kpis"><div class="kpi"><div class="lbl">Total obrigatório por mês</div><b id="tmTot">' +
      gs(tm) +
      '</b></div>' +
      '<div class="kpi"><div class="lbl">Cada peça vendida separa</div><b id="tmPeca" style="color:var(--warn)">' +
      gs(contasPeca()) +
      '</b><div class="hint">para pagar as contas</div></div>' +
      '<div class="kpi"><div class="lbl">Vendas esperadas por mês</div><input class="in" id="volIn" inputmode="numeric" data-in="volume" value="' +
      S.volume +
      '" aria-label="Peças vendidas por mês" style="margin-top:6px"><div class="hint">peças. Use a média dos últimos meses.</div></div></section>';
    var cats = ['loja', 'casa', 'pessoal', 'profissional', 'imprev'];
    html +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Por grupo</h2><div class="bar">' +
      cats
        .map(function (c, i) {
          var v = S.exp
            .filter(function (e) {
              return e.cat === c;
            })
            .reduce(function (a, e) {
              return a + e.valor;
            }, 0);
          return (
            '<i style="width:' +
            (tm ? (v / tm) * 100 : 0) +
            '%;background:' +
            ['#00c8ff', '#a2447c', '#ffc766', 'var(--info)', '#00ff88'][i] +
            '"></i>'
          );
        })
        .join('') +
      '</div><div class="nav">' +
      cats
        .map(function (c, i) {
          var v = S.exp
            .filter(function (e) {
              return e.cat === c;
            })
            .reduce(function (a, e) {
              return a + e.valor;
            }, 0);
          if (!v) return '';
          return (
            '<span class="cell"><span class="sp" style="background:' +
            ['#00c8ff', '#a2447c', '#ffc766', 'var(--info)', '#00ff88'][i] +
            '"></span>' +
            CATS[c] +
            ' · ' +
            gs(v) +
            '</span>'
          );
        })
        .join('') +
      '</div></section>';
    cats.forEach(function (c) {
      var list = S.exp.filter(function (e) {
        return e.cat === c;
      });
      if (!list.length) return;
      html +=
        '<section class="col"><div class="lbl" style="margin:6px 0 0">' +
        CATS[c] +
        '</div>' +
        list.map(expCard).join('') +
        '</section>';
    });
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Imprevistos do mês</h2><div class="hint" style="margin:2px 0 0">A provisão de ' +
      gs(imp) +
      ' por mês é consumida pelos gastos inesperados que você registrar.</div></div>' +
      '<div class="bar"><i style="width:' +
      Math.min(100, imp ? (gasto / imp) * 100 : 0) +
      '%;background:' +
      (gasto > imp ? 'var(--bad)' : 'var(--warn)') +
      '"></i></div><div class="hint" style="margin:0">Gasto ' +
      gs(gasto) +
      ' de ' +
      gs(imp) +
      (gasto > imp
        ? '. Passou da provisão. Considere aumentá-la.'
        : '. Resta ' + gs(imp - gasto) + '.') +
      '</div>' +
      S.imprev
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
      '<div class="sel" style="flex-wrap:wrap"><input class="in" id="impD" placeholder="O que aconteceu" style="flex:2 1 180px;width:auto" aria-label="Descrição do imprevisto"><input class="in" id="impV" inputmode="numeric" placeholder="Valor em G$" style="flex:1 1 120px;width:auto" aria-label="Valor do imprevisto"><button class="mini" data-act="impadd">Registrar imprevisto</button></div></section>';
    html +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Nova despesa</h2><div class="sel" style="flex-wrap:wrap"><input class="in" id="nName" placeholder="Nome (ex.: Água)" style="flex:2 1 160px;width:auto" aria-label="Nome da despesa"><select class="in" id="nCat" aria-label="Grupo" style="flex:1 1 130px;width:auto">' +
      cats
        .map(function (c) {
          return '<option value="' + c + '">' + CATS[c] + '</option>';
        })
        .join('') +
      '</select><select class="in" id="nTipo" aria-label="Tipo" style="flex:1 1 110px;width:auto"><option value="fixa">Fixa</option><option value="variavel">Variável</option></select><input class="in" id="nVal" inputmode="numeric" placeholder="Valor em G$" style="flex:1 1 120px;width:auto" aria-label="Valor"><button class="mini" data-act="expadd">Adicionar</button></div><div class="hint" id="nH" role="status"></div></section>';
    html +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Caixa de melhorias</h2><div class="hint" style="margin:0">Opcional. Não entra nas contas obrigatórias e nunca trava uma venda.</div><div class="sel"><input class="in" id="melhIn" inputmode="numeric" data-in="melh" value="' +
      dots(S.melhPeca) +
      '" aria-label="Guaranis por peça para melhorias" style="max-width:180px"><span class="hint" style="margin:0">G$ por peça vendida</span></div></section>';
    el.innerHTML = html;
  }

  // ---------- histórico
