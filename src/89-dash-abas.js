  // ===== Dashboard em abas (Resumo, Dinheiro, Giro, Preços), com "Atenção agora" e blocos que abrem ao toque. =====
  S.dTab = 'hoje';
  S.dfold = {};
  var DTABS = [
    ['hoje', 'Resumo'],
    ['din', 'Dinheiro'],
    ['giro', 'Giro'],
    ['prec', 'Preços']
  ];
  function dTabsHtml() {
    return (
      '<div class="tabs" role="group" aria-label="Partes do Dashboard" style="display:flex;gap:6px;margin:10px 0 4px;overflow-x:auto">' +
      DTABS.map(function (t) {
        return (
          '<button class="tab' +
          (S.dTab === t[0] ? ' on' : '') +
          '" data-act="dtab" data-id="' +
          t[0] +
          '" aria-pressed="' +
          (S.dTab === t[0]) +
          '" style="white-space:nowrap">' +
          t[1] +
          '</button>'
        );
      }).join('') +
      '</div>'
    );
  }
  // Bloco que abre ao toque: cabeçalho com resumo de uma linha e, aberto, o detalhe logo abaixo.
  function dFold(id, titulo, resumo, cor, corpo) {
    if (!corpo) return '';
    var ab = !!S.dfold[id];
    return (
      '<section class="card" style="padding:0"><button type="button" data-act="dfold" data-id="' +
      id +
      '" aria-expanded="' +
      ab +
      '" style="display:flex;justify-content:space-between;align-items:center;gap:8px;width:100%;text-align:left;background:none;border:0;padding:14px;color:inherit;min-height:48px"><span style="min-width:0"><b style="font-size:15px">' +
      titulo +
      '</b><span class="hint" style="display:block;margin:2px 0 0;color:' +
      (cor || 'var(--sub)') +
      '">' +
      resumo +
      '</span></span><span aria-hidden="true" style="font-size:20px;color:var(--mute)">' +
      (ab ? '⌃' : '⌄') +
      '</span></button></section>' +
      (ab ? corpo : '')
    );
  }
  // Itens do card "Atenção agora", por prioridade.
  function atencaoItens() {
    var it = [],
      u = function (n) {
        return 'US$ ' + Math.round(n);
      };
    avisosVenc(7).forEach(function (a) {
      it.push({
        t: a.e.nome,
        s: prazoTxt(a.dias) + (a.ok ? '' : ' · ' + a.dica),
        c: a.dias < 0 ? 'var(--bad)' : 'var(--warn)',
        b: 'Ver',
        act: 'view',
        id: 'desp'
      });
    });
    var cc = ccDias();
    if (S.ccLemb !== false && cc >= 7)
      it.push({
        t: 'Conferir o caixa',
        s: cc === Infinity ? 'ainda não conferiu' : 'faz ' + cc + ' dias',
        c: 'var(--warn)',
        b: 'Conferir',
        act: 'view',
        id: 'caixa'
      });
    var dv = dolarFavoravel();
    if (dv && (dv.barato || dv.caro))
      it.push({
        t: dv.barato ? 'Dólar barato hoje' : 'Dólar caro hoje',
        s: Math.round(Math.abs(dv.hoje / dv.media - 1) * 100) + '% ' + (dv.barato ? 'abaixo' : 'acima') + ' da média de ' + S.janela + ' dias',
        c: dv.barato ? 'var(--ok)' : 'var(--warn)',
        b: 'Ver',
        act: 'view',
        id: 'fx'
      });
    var pp = precoPerigoso().length;
    if (pp)
      it.push({
        t: 'Preço ficou perigoso',
        s: pp + ' produto(s) com preço que não cobre custo e contas',
        c: 'var(--bad)',
        b: 'Ver',
        act: 'dtab',
        id: 'prec'
      });
    var rp = reposicao().length;
    if (rp)
      it.push({
        t: 'Repor mercadoria',
        s: rp + ' produto(s) vão acabar logo',
        c: 'var(--warn)',
        b: 'Ver',
        act: 'dtab',
        id: 'giro'
      });
    var pa = parados().length;
    if (pa)
      it.push({
        t: 'Estoque parado',
        s: pa + ' produto(s) sem vender há 60 dias ou mais',
        c: 'var(--warn)',
        b: 'Ver',
        act: 'dtab',
        id: 'giro'
      });
    var dias = S.backupTs ? Math.floor((Date.now() - S.backupTs) / DAY) : Infinity;
    if (S.sales.length && dias >= 7)
      it.push({
        t: 'Backup',
        s: dias === Infinity ? 'ainda não guardou fora do celular' : 'faz ' + dias + ' dias do último',
        c: 'var(--warn)',
        b: 'Fazer',
        act: 'view',
        id: 'ajustes'
      });
    return it;
  }
  function atencaoHtml() {
    var l = atencaoItens(),
      mostrar = S.atTodos ? l : l.slice(0, 3);
    if (!l.length)
      return '<section class="card col" style="border-left:4px solid var(--ok)"><b style="font-size:15px">Atenção agora</b><div class="hint" style="margin:0">Tudo em ordem.</div></section>';
    var h =
      '<section class="card col" style="border-left:4px solid var(--warn)"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:15px">Atenção agora</b><span class="cell">' +
      l.length +
      '</span></div><div class="split">';
    mostrar.forEach(function (x) {
      h += dxRow(
        esc(x.t),
        '<span style="color:' + x.c + '">' + esc(x.s) + '</span>',
        '<button class="mini" data-act="' + x.act + '" data-id="' + x.id + '">' + x.b + '</button>'
      );
    });
    h += '</div>';
    if (l.length > 3)
      h +=
        '<button class="chip" data-act="attodos">' +
        (S.atTodos ? 'Mostrar só os principais' : 'Ver mais ' + (l.length - 3) + ' aviso(s)') +
        '</button>';
    return h + '</section>';
  }
  // Conteúdo da aba escolhida. "o" traz os blocos já montados pelo renderDash.
  function dashCompose(o) {
    var t = S.dTab,
      h = '',
      u = function (n) {
        return 'US$ ' + Math.round(n);
      },
      kpi = function (l, v, ap, st) {
        return (
          '<div class="kpi"><div class="lbl">' + l + '</div><b style="' + (st || '') + '">' + v + '</b><div class="hint">' + ap + '</div></div>'
        );
      };
    if (t === 'hoje') {
      var x = dashExtra();
      h += atencaoHtml() + o.per + o.kp + x.meta;
      h += dFold('sep', 'Quanto separar do que vendeu', 'reposição, contas, colchão e lucro livre do período', 'var(--sub)', o.sep);
      return h;
    }
    if (t === 'din') {
      var r = reservas(),
        rm = resultadoMes(new Date().getFullYear(), new Date().getMonth()),
        fl = fluxoCaixa(S.fluxoD || 30),
        falta = ['pyg', 'usd', 'brl'].filter(function (m) {
          return fl.pm[m].need > fl.pm[m].tem + 1e-9;
        });
      h +=
        '<section class="kpis">' +
        kpi('Dinheiro hoje', gs(Math.round(r.wal)), 'carteira toda') +
        kpi('Livre para você', gs(Math.round(r.livre)), 'depois de reposição, contas e melhorias', 'color:' + (r.livre >= 0 ? 'var(--ok)' : 'var(--bad)')) +
        '</section>';
      h += dFold(
        'res',
        'Resultado do mês',
        'Resultado da loja ' + gs(rm.resultado) + ' · sobra ' + gs(rm.sobra),
        rm.sobra >= 0 ? 'var(--ok)' : 'var(--bad)',
        resultadoHtml()
      );
      h += dFold(
        'flx',
        'Fluxo de caixa projetado',
        'Saldo em ' + (S.fluxoD || 30) + ' dias ' + gs(fl.saldo) + (falta.length ? ' · contas em ' + falta.map(function (m) { return m.toUpperCase(); }).join(', ') + ' pedem troca' : ''),
        fl.saldo < 0 || falta.length ? 'var(--warn)' : 'var(--ok)',
        fluxoHtml()
      );
      var rt = resultadoMes(new Date().getFullYear(), new Date().getMonth());
      h +=
        '<section class="card" style="padding:14px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span><b style="font-size:15px">Retirada do dono</b><span class="hint" style="display:block;margin:2px 0 0">Neste mês: ' +
        gs(rt.retTotal) +
        ' retirados de ' +
        gs(rt.lucroLivre) +
        ' de lucro livre</span></span><button class="mini" data-act="view" data-id="caixa">Abrir</button></div></section>';
      h += dFold('two', 'Reposição e contas (30 dias)', 'quanto falta para repor e quanto das contas já foi separado', 'var(--sub)', o.two);
      return h;
    }
    if (t === 'giro') {
      var ce = capitalEstoque(),
        x2 = dashExtra(),
        rp = reposicao(),
        pa = parados(),
        ct = S.contagens.filter(function (c) {
          return Date.now() - c.ts <= 30 * DAY;
        });
      h +=
        '<section class="kpis">' +
        kpi('No estoque', 'US$ ' + ce.total.toFixed(0), 'a custo, sem estojos') +
        kpi('Parado 60+ dias', 'US$ ' + ce.parado.toFixed(0), Math.round(ce.pct * 100) + '% do investido', 'color:' + (ce.pct > 0.3 ? 'var(--warn)' : 'inherit')) +
        '</section>';
      h += dFold('rep', 'Repor primeiro', rp.length ? rp.length + ' produto(s) vão acabar logo · lista de compras' : 'nada acabando nos próximos 21 dias', rp.length ? 'var(--warn)' : 'var(--ok)', x2.repor);
      h += dFold('par', 'Estoque parado', pa.length + ' produto(s) · sugestão de preço de saída', 'var(--warn)', x2.parados);
      h += dFold('ret', 'Retorno do estoque', 'cada US$ 1 investido rendeu US$ ' + ce.retorno.toFixed(2).replace('.', ',') + ' em 30 dias', 'var(--sub)', capitalHtml());
      h += dFold('abc', 'Curva ABC', 'quais produtos dão 80% do lucro (90 dias)', 'var(--sub)', x2.abc);
      h += dFold('pdc', 'Perdas e sobras (30 dias)', ct.length + ' contagem(ns) no período', 'var(--sub)', x2.perdasC);
      return h;
    }
    var x3 = dashExtra(),
      sg = sugestoes().filter(function (r) {
        return r.acao === 'subir' || r.acao === 'descer';
      }),
      ab = abaixoDoPiso().length,
      pg = precoPerigoso().length,
      pr = perdasPropositais();
    h += dFold('sug', 'Sugestão de margem', sg.length ? sg.length + ' faixa(s) com sugestão' : 'sem mudanças sugeridas', sg.length ? 'var(--warn)' : 'var(--ok)', x3.sug);
    h += dFold('pgo', 'Preço ficou perigoso', pg ? pg + ' produto(s)' : 'nenhum', pg ? 'var(--bad)' : 'var(--ok)', perigosoHtml());
    h += dFold('abp', 'Preço abaixo do piso', ab ? ab + ' produto(s) com o câmbio de hoje' : 'nenhum', ab ? 'var(--warn)' : 'var(--ok)', x3.abaixo);
    h += dFold('pdv', 'Vendas abaixo do piso (30 dias)', pr.n + ' venda(s)', 'var(--sub)', x3.perdasV);
    h += dFold('mar', 'Saúde da margem por tipo', 'preço atual contra a trava de segurança', 'var(--sub)', o.margem);
    return h;
  }
