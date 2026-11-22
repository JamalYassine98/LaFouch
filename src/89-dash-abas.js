  // ===== Dashboard em abas (Resumo, Dinheiro, Giro, Preços), com "Atenção agora" e blocos que abrem ao toque. =====
  S.dTab = 'hoje';
  S.dfold = {};
  var DTABS = [
    ['hoje', 'Resumo'],
    ['din', 'Reservas'],
    ['giro', 'Giro'],
    ['prec', 'Preços']
  ];
  // Linha de dobra (135d): título + resumo + ⌄ e, aberta, o detalhe logo abaixo. Não é cartão: é uma linha, com a linha fina do CSS (section.fxF).
  // A mesma para todas as telas (Giro, Reservas, Dashboard, Despesas, Ajustes › Preços, Ofertas do site).
  function dFold(id, titulo, resumo, cor, corpo) {
    if (!corpo) return '';
    var ab = !!S.dfold[id];
    return (
      '<section class="fxF' + (ab ? ' on' : '') + '" data-fx="' + id + '"><button type="button" data-act="dfold" data-id="' +
      id +
      '" aria-expanded="' +
      ab +
      '" class="fxH"><span style="min-width:0"><b>' +
      titulo +
      '</b><span class="hint" style="display:block;margin:2px 0 0;color:' +
      (cor || 'var(--sub)') +
      '">' +
      resumo +
      '</span></span><i class="fxC" aria-hidden="true">⌄</i></button>' +
      (ab ? '<div class="fxB"><div class="fxI">' + corpo + '</div></div>' : '') +
      '</section>'
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
        b: 'Ver conta',
        act: 'view',
        id: 'desp'
      });
    });
    var fal = window.__fechoAlerta && window.__fechoAlerta();
    if (fal) it.push(fal);
    var cc = ccDias();
    if (cc >= 7 && !fal)
      it.push({
        t: 'Conferir o caixa',
        s: cc === Infinity ? 'ainda não conferiu' : 'faz ' + cc + ' dias',
        c: 'var(--warn)',
        urg: true,
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
        b: 'Ver câmbio',
        act: 'view',
        id: 'fx'
      });
    // 52d (22/11): os preços para corrigir moram aqui (saíram da barra do Inventário); vermelho quando algum já não cobre custo e contas
    var pc = typeof invPrecosAcorrigir === 'function' ? invPrecosAcorrigir().length : 0,
      pp = precoPerigoso().length;
    if (pc || pp)
      it.push({
        t: cntPl(Math.max(pc, pp), 'preço para corrigir', 'preços para corrigir'),
        s: pp ? pp + (pp === 1 ? ' não cobre' : ' não cobrem') + ' o custo e as contas' : 'abaixo do que a peça precisa ou sem o preço do site',
        c: pp ? 'var(--bad)' : 'var(--warn)',
        b: 'Ver preços',
        act: 'pcAbre',
        id: 'prec'
      });
    var rp = reposicao().length;
    if (rp)
      it.push({
        t: 'Repor mercadoria',
        s: rp + ' produto(s) vão acabar logo',
        c: 'var(--warn)',
        b: 'Ver reposição',
        act: 'dtab',
        id: 'giro'
      });
    var pa = parados().length;
    if (pa)
      it.push({
        t: 'Estoque parado',
        s: pa + ' produto(s) sem vender há 60 dias ou mais',
        c: 'var(--warn)',
        b: 'Ver peças',
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
    // avisos das outras famílias: a temática que vem aí e tudo o que o Guardião achou
    try {
      atencaoTema(it);
    } catch (e) {}
    try {
      atencaoGuardiao(it);
    } catch (e) {}
    return it;
  }
  // Conteúdo da aba escolhida. "o" traz os blocos já montados pelo renderDash.
  function dashCompose(o) {
    if (S.dTab === 'onl') return onlResumoHtml(); // aba Site: o resumo vem da família Site
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
      h += o.per + o.kp + (o.repor || '') + (o.colch || '') + o.sep + (o.vend || '') + metaCardHtml();
      return h;
    }
    if (t === 'din') return dinheiroHtml(o, kpi);
    if (t === 'giro') {
      var ce = capitalEstoque(),
        x2 = dashExtra(),
        rp = reposicao(),
        pa = parados(),
        ct = S.contagens.filter(function (c) {
          return Date.now() - c.ts <= 30 * DAY;
        });
      h +=
        '<section class="kpis lux418 lxLk"><div class="cxLb">Estoque</div>' +
        kpi('No estoque', 'US$ ' + ce.total.toFixed(0), 'a custo, sem estojos') +
        kpi('Parado 60+ dias', 'US$ ' + ce.parado.toFixed(0), Math.round(ce.pct * 100) + '% do investido', 'color:' + (ce.pct > 0.3 ? 'var(--warn)' : 'inherit')) +
        '</section>';
      // v428: lista de compras melhorada + vitrine da semana
      h += '<div class="fxG">'; // dobras seguidas = um grupo de linhas, sem espaço entre elas
      h += dFold('rep', 'Lista de compras', rp.length ? rp.length + ' produto(s) vão acabar logo' : 'nada acabando nos próximos 21 dias', rp.length ? 'var(--warn)' : 'var(--ok)', lcHtml());
      h += dFold('vit', 'Vitrine da semana', !(S.vit.lug > 0) ? 'diga quantos lugares tem a vitrine' : S.vit.atual.length ? 'trocada em ' + new Date(S.vit.ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : 'sugestão pronta', 'var(--sub)', vitHtml());
      h += dFold('par', 'Estoque parado', pa.length + ' produto(s) · sugestão de preço de saída', 'var(--warn)', x2.parados);
      h += dFold('ret', 'Retorno do estoque', 'cada US$ 1 investido rendeu US$ ' + ce.retorno.toFixed(2).replace('.', ',') + ' em 30 dias', 'var(--sub)', capitalHtml());
      h += dFold('abc', 'Curva ABC', 'quais produtos dão 80% do lucro (90 dias)', 'var(--sub)', x2.abc);
      h += dFold('pdc', 'Perdas e sobras (30 dias)', ct.length + ' contagem(ns) no período', 'var(--sub)', x2.perdasC);
      h += '</div>';
      return h;
    }
    // 149p (aprovado 19/11 16:30): Preços mostra e decide; o interruptor do preço automático e "Contas, taxas e meta" moram em Ajustes › Preços.
    // Aqui fica só o que o preço automático já mudou ("Esta semana", com desfazer) e os preços travados.
    h += precosTelaHtml();
    h += '<div class="cntAuto">' + precosAutoHtml() + '</div>';
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

  // Aba Dinheiro: o que sobra para você, como foi o mês e os próximos 30 dias.
  function dinheiroHtml(o) {
    var r = reservas(),
      now = new Date(),
      rm = resultadoMes(now.getFullYear(), now.getMonth()),
      fl = fluxoCaixa(S.fluxoD || 30),
      dono = r.guard + r.melh,
      aberto = !!S.dfold.paraonde,
      part = function (v) {
        return r.wal > 0 ? Math.max(0, (v / r.wal) * 100) : 0;
      },
      falta = ['pyg', 'usd', 'brl'].filter(function (m) {
        return fl.pm[m].need > fl.pm[m].tem + 1e-9;
      }),
      h = '';
    var lv = livre3(),
      linhas = ['pyg', 'brl']
        .filter(function (m) {
          return lv.livre[m] > 0.004;
        })
        .map(function (m) {
          return '<div class="sl"><span>' + (m === 'pyg' ? 'Guaranis' : 'Reais') + '</span><b>' + fmtM0(lv.livre[m], m) + '</b></div>';
        })
        .join('');
    dono = Math.max(0, lv.wal - lv.livreEq);
    h +=
      // S418 (esboço 116c): "LIVRE PARA VOCÊ" com a moeda no canto, o número em letra de título, aviso em frase, linhas e barra fina
      '<section class="cxSaldo lv418"><div class="lv418H"><div class="cxLb">Livre para você</div>' +
      (function () {
        var m = S.totM === 'usd' || S.totM === 'brl' ? S.totM : 'pyg';
        return '<div class="lv418M" role="group" aria-label="Moeda do total convertido">' + [['pyg', 'G$'], ['brl', 'R$'], ['usd', 'US$']].map(function (o) {
          return '<button type="button" class="' + (o[0] === m ? 'on' : '') + '" aria-pressed="' + (o[0] === m) + '" data-act="totm" data-id="' + o[0] + '">' + o[1] + '</button>';
        }).join('') + '</div>';
      })() + '</div>' +
      '<div class="lv418N" style="color:' + (lv.falta > 0 ? 'var(--bad)' : 'var(--ok)') + '">' + totFmt(lv.livreEq) + '</div>' +
      (lv.falta > 0
        ? '<div class="lv418F">Faltam ' + totFmt(lv.falta) + ' para cobrir as reservas.' + (lv.extraUsd > 0.004 ? ' O dólar extra da loja (' + usd0(lv.extraUsd) + ') pode ajudar.' : '') + '</div>'
        : '<div class="lv418S">já descontadas reposição, contas, colchão e melhorias</div>') +
      (linhas || '<div class="sl"><span>Guaranis</span><b>G$ 0</b></div>').replace(/class="sl"/g, 'class="cxL"') +
      '<div class="bar lv418B">' +
      [[r.repGs, '#6cc3e0'], [r.con, '#a2447c'], [r.colch, '#e9c27a'], [r.melh, 'var(--info)'], [lv.livreEq, '#5fd39a']]
        .map(function (p) {
          return '<i style="width:' + part(p[0]) + '%;background:' + p[1] + '"></i>';
        })
        .join('') +
      '</div><div class="lv418X">De ' + totFmt(r.wal) + ' na carteira, ' + totFmt(dono) + ' já têm dono: reposição, contas, colchão e melhorias.<br>' + cambioHojeTxt() + '</div>' +
      '</section><div class="fxG">' +
      // S374 (esboço 99b2): "Ver para onde vai" é um bloco que abre no lugar, junto de "Próximos 30 dias"
      dFold('paraonde', 'Ver para onde vai', 'o que já tem dono: reposição, contas, colchão', '',
        '<div class="split">' +
          [['Reposição de mercadoria', r.repGs, '#6cc3e0'], ['Contas do mês', r.con, '#a2447c'], ['Colchão de segurança', r.colch, '#e9c27a']]
            .map(function (p) {
              return '<div class="sl"><span><span class="sp" style="background:' + p[2] + '"></span>' + p[0] + '</span><b>' + totFmt(p[1]) + '</b></div>';
            })
            .join('') +
          lkLinha('Objetivos da loja', 'view', 'caixa', 'guardado no Caixa') +
          '</div>');
    // S363 (esboços 45a/45d): o resultado do mês saiu de Reservas e mora no Dashboard › Detalhes › "Resultado do mês"
    S._resMes = function () {
      var h = '';
      h +=
        '<section class="card col"><b style="font-size:16px">Seu mês</b>' +
        '<div class="sl"><span>Resultado da loja<small>vendas menos reposição e contas</small></span><b>' + rFmt(rm, 'resultado') + '</b></div>' +
        '<div class="sl"><span>Retirado por você<small>de ' + rFmt(rm, 'lucroLivre') + ' de lucro livre</small></span><b>' + rFmt(rm, 'retTotal') + '</b></div>' +
        '<div class="sl" style="border-top:1px solid var(--line);padding-top:10px"><span>Sobra do mês</span><b style="color:' + (rVal(rm, 'sobra') >= 0 ? 'var(--ok)' : 'var(--bad)') + '">' + rFmt(rm, 'sobra') + '</b></div>' +
        '<div><button type="button" class="chip" data-act="view" data-id="caixa" style="min-height:34px">Registrar retirada (Caixa)</button></div></section>';
      h += '<div class="fxG">' + dFold('res', 'Detalhes do mês', 'receitas, despesas e resultado', rm.sobra >= 0 ? 'var(--ok)' : 'var(--bad)', resultadoHtml());
      // S200: lucro real do mês (IVA da venda sai, IVA da compra vira custo, frete e descontos)
      if (typeof lucroRealHtml === 'function') { var lrT = lrMes(new Date().getFullYear(), new Date().getMonth()); h += dFold('lr', 'Lucro real do mês', lrT.qty ? gs(lrT.lucro) + ' de ' + gs(lrT.vendido) + ' vendidos' : 'sem vendas ainda', lrT.lucro >= 0 ? 'var(--ok)' : 'var(--bad)', lucroRealHtml()); }
      h += '</div>';
      return h;
    };
    h += dFold(
      'flx',
      'Próximos ' + (S.fluxoD || 30) + ' dias',
      'Saldo ' + totFmt(fl.saldo) + (falta.length ? ' · contas em ' + falta.map(function (m) { return m.toUpperCase(); }).join(', ') + ' pedem troca' : ''),
      fl.saldo < 0 || falta.length ? 'var(--warn)' : 'var(--ok)',
      fluxoHtml() + (o.two || '')
    ) + '</div>';
    return h;
  }
