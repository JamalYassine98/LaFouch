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
      '<div class="tgrid g4" role="group" aria-label="Partes do Dashboard">' +
      DTABS.map(function (t) {
        return tileHtml('data-act="dtab" data-id="' + t[0] + '"', t[0], t[1], null, 'sm', S.dTab === t[0]);
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
      '<section class="card col atcard' + (S.atMin ? ' min' : '') + '" id="atCard" style="border-left:4px solid var(--warn)"><button type="button" class="atcab" data-act="atmin" aria-expanded="' + !S.atMin + '" aria-label="' + (S.atMin ? 'Mostrar' : 'Minimizar') + ' atenção agora"><b style="font-size:15px">Atenção agora</b><span style="display:flex;align-items:center;gap:10px"><span class="cell">' +
      l.length +
      '</span><svg class="atseta" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></span></button><div class="atbody"><div class="atin"><div class="split">';
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
    return h + '</div></div></section>';
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
      var pmk = ymNow(),
        pays = (S.cpay || []).filter(function (x) {
          return x.ym === pmk;
        });
      h += dFold('dono', 'Quanto já tem dono', 'guardado ' + gs(Math.round(r.guard + r.melh)) + ' de ' + gs(Math.round(r.wal)), 'var(--sub)', donoHtml());
      h += dFold('pagas', 'Contas pagas neste mês', pays.length + ' conta(s) paga(s)', 'var(--sub)', contasPagasHtml());
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

  // ---------- período das vendas (Hoje, Semana, Mês, 30 dias, Outro)
  function dataLocal(txt, fimDoDia) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(txt || '');
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3] + (fimDoDia ? 1 : 0)).getTime();
  }
  // Início e fim do período escolhido (a semana começa na segunda).
  function periodoAtual() {
    var d = new Date(),
      ano = d.getFullYear(),
      mes = d.getMonth(),
      dia = d.getDate(),
      fim = Date.now() + 1,
      ini,
      txt,
      p = S.per;
    if (p === 'hoje') {
      ini = new Date(ano, mes, dia).getTime();
      txt = 'hoje';
    } else if (p === 'semana') {
      ini = new Date(ano, mes, dia - ((d.getDay() + 6) % 7)).getTime();
      txt = 'de segunda (' + fd(ini) + ') até hoje';
    } else if (p === '30') {
      ini = Date.now() - 30 * DAY;
      txt = 'últimos 30 dias';
    } else if (p === 'custom' && dataLocal(S.perDe) != null && dataLocal(S.perAte) != null) {
      ini = dataLocal(S.perDe);
      fim = dataLocal(S.perAte, true);
      txt = 'de ' + fd(ini) + ' a ' + fd(fim - DAY);
    } else {
      ini = new Date(ano, mes, 1).getTime();
      txt = p === 'custom' ? 'escolha as duas datas (mostrando o mês)' : 'do dia 1 até hoje';
    }
    return { ini: ini, fim: fim, txt: txt };
  }
  function vendasPeriodo() {
    var r = periodoAtual();
    return S.sales.filter(function (s) {
      return !s.estorno && s.ts >= r.ini && s.ts < r.fim;
    });
  }
  function periodoHtml() {
    var r = periodoAtual(),
      op = [
        ['hoje', 'Hoje'],
        ['semana', 'Semana'],
        ['mes', 'Mês'],
        ['30', '30 dias'],
        ['custom', 'Outro']
      ],
      h =
        '<div class="col" style="gap:8px"><div class="hint" style="margin:0">Vendas de: ' +
        r.txt +
        '</div><div class="tgrid g5" role="group" aria-label="Período das vendas">' +
        op
          .map(function (o) {
            return tileHtml('data-act="per" data-id="' + o[0] + '"', 'p_' + o[0], o[1], null, 'sm', S.per === o[0]);
          })
          .join('') +
        '</div>';
    if (S.per === 'custom')
      h +=
        '<div class="sel" style="flex-wrap:wrap"><input class="in" type="date" data-pdat="de" value="' +
        esc(S.perDe) +
        '" aria-label="Data inicial" style="flex:1 1 140px;width:auto"><input class="in" type="date" data-pdat="ate" value="' +
        esc(S.perAte) +
        '" aria-label="Data final" style="flex:1 1 140px;width:auto"></div>';
    return h + '</div>';
  }
