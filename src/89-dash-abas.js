  // ===== Dashboard em abas (Resumo, Dinheiro, Giro, Preços), com "Atenção agora" e blocos que abrem ao toque. =====
  S.dTab = 'hoje';
  S.dfold = {};
  var DTABS = [
    ['hoje', 'Resumo'],
    ['din', 'Reservas'],
    ['giro', 'Giro'],
    ['prec', 'Preços']
  ];
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
    var pp = precoPerigoso().length;
    if (pp)
      it.push({
        t: 'Preço ficou perigoso',
        s: pp + ' produto(s) com preço que não cobre custo e contas',
        c: 'var(--bad)',
        b: 'Ver preços',
        act: 'dtab',
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
    return it;
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
        '<section class="kpis">' +
        kpi('No estoque', 'US$ ' + ce.total.toFixed(0), 'a custo, sem estojos') +
        kpi('Parado 60+ dias', 'US$ ' + ce.parado.toFixed(0), Math.round(ce.pct * 100) + '% do investido', 'color:' + (ce.pct > 0.3 ? 'var(--warn)' : 'inherit')) +
        '</section>';
      // v428: lista de compras melhorada + vitrine da semana
      h += dFold('rep', 'Lista de compras', rp.length ? rp.length + ' produto(s) vão acabar logo' : 'nada acabando nos próximos 21 dias', rp.length ? 'var(--warn)' : 'var(--ok)', lcHtml());
      h += dFold('vit', 'Vitrine da semana', !(S.vit.lug > 0) ? 'diga quantos lugares tem a vitrine' : S.vit.atual.length ? 'trocada em ' + new Date(S.vit.ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : 'sugestão pronta', 'var(--sub)', vitHtml());
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
    // v422: aba Preços = preço automático (um interruptor, meta, esta semana, travados) + contas/taxas/meta recolhidas
    // S188 (13/11): o Contador vem primeiro; as regras de sempre ficam recolhidas em "Regras do contador"
    h += contadorHtml();
    h += '<div class="lbl" style="margin:16px 4px 6px">REGRAS DO CONTADOR</div>';
    h += dFold('pau', 'Preço automático', S.pAuto && S.pAuto.on ? 'ligado · revisa toda segunda' : 'desligado', 'var(--sub)', precosAutoHtml());
    if (!(S.pAuto && S.pAuto.on)) h += dFold('abp', 'Preço abaixo do piso', ab ? ab + ' produto(s) com o câmbio de hoje' : 'nenhum', ab ? 'var(--warn)' : 'var(--ok)', x3.abaixo);
    h += dFold('cfg', 'Contas, taxas e meta', 'o que entra no custo de cada peça', 'var(--sub)', precosCfgHtml() + pagamentoHtml());
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
      '<section class="card col"><div class="lbl" style="margin:0">Livre para você</div><div class="hint" style="margin:0">já descontadas reposição, contas, colchão e melhorias</div>' +
      '<div class="split">' + (linhas || '<div class="sl"><span>Guaranis</span><b>G$ 0</b></div>') + '</div>' +
      (lv.falta > 0
        ? '<div class="note n-bad">Faltam <b>' + totFmt(lv.falta) + '</b> para cobrir as reservas.' + (lv.extraUsd > 0.004 ? ' O dólar extra da loja (' + usd0(lv.extraUsd) + ') pode ajudar.' : '') + '</div>'
        : '') +
      '<div class="hint" style="margin:6px 0 0">Total convertido no câmbio de hoje</div><b style="font-size:34px;color:' + (lv.falta > 0 ? 'var(--bad)' : 'var(--ok)') + '">' + totFmt(lv.livreEq) + '</b>' +
      totBtn() +
      '<div class="hint" style="margin:0">' + cambioHojeTxt() + '</div>' +
      '<div class="bar">' +
      [[r.repGs, '#6cc3e0'], [r.con, '#a2447c'], [r.colch, '#e9c27a'], [r.melh, 'var(--info)'], [lv.livreEq, '#5fd39a']]
        .map(function (p) {
          return '<i style="width:' + part(p[0]) + '%;background:' + p[1] + '"></i>';
        })
        .join('') +
      '</div><div class="hint" style="margin:0">De ' + totFmt(r.wal) + ' na carteira, ' + totFmt(dono) + ' já têm dono: reposição, contas, colchão e melhorias.</div>' +
      (aberto
        ? '<div class="split">' +
          [['Reposição de mercadoria', r.repGs, '#6cc3e0'], ['Contas do mês', r.con, '#a2447c'], ['Colchão de segurança', r.colch, '#e9c27a'], ['Objetivos da loja', r.melh, 'var(--info)']]
            .map(function (p) {
              return '<div class="sl"><span><span class="sp" style="background:' + p[2] + '"></span>' + p[0] + '</span><b>' + totFmt(p[1]) + '</b></div>';
            })
            .join('') +
          '</div>'
        : '') +
      '<div style="display:flex;justify-content:flex-end"><button type="button" class="chip" data-act="dfold" data-id="paraonde" aria-expanded="' + aberto + '" style="min-height:34px">' + (aberto ? 'Esconder ⌃' : 'Ver para onde vai ⌄') + '</button></div></section>';
    h +=
      '<section class="card col"><b style="font-size:16px">Seu mês</b>' +
      '<div class="sl"><span>Resultado da loja<small>vendas menos reposição e contas</small></span><b>' + rFmt(rm, 'resultado') + '</b></div>' +
      '<div class="sl"><span>Retirado por você<small>de ' + rFmt(rm, 'lucroLivre') + ' de lucro livre</small></span><b>' + rFmt(rm, 'retTotal') + '</b></div>' +
      '<div class="sl" style="border-top:1px solid var(--line);padding-top:10px"><span>Sobra do mês</span><b style="color:' + (rVal(rm, 'sobra') >= 0 ? 'var(--ok)' : 'var(--bad)') + '">' + rFmt(rm, 'sobra') + '</b></div>' +
      '<div><button type="button" class="chip" data-act="view" data-id="caixa" style="min-height:34px">Registrar retirada (Caixa)</button></div></section>';
    h += dFold('res', 'Detalhes do mês', 'receitas, despesas e resultado', rm.sobra >= 0 ? 'var(--ok)' : 'var(--bad)', resultadoHtml());
    // S200: lucro real do mês (IVA da venda sai, IVA da compra vira custo, frete e descontos)
    if (typeof lucroRealHtml === 'function') { var lrT = lrMes(new Date().getFullYear(), new Date().getMonth()); h += dFold('lr', 'Lucro real do mês', lrT.qty ? gs(lrT.lucro) + ' de ' + gs(lrT.vendido) + ' vendidos' : 'sem vendas ainda', lrT.lucro >= 0 ? 'var(--ok)' : 'var(--bad)', lucroRealHtml()); }
    h += dFold(
      'flx',
      'Próximos ' + (S.fluxoD || 30) + ' dias',
      'Saldo ' + totFmt(fl.saldo) + (falta.length ? ' · contas em ' + falta.map(function (m) { return m.toUpperCase(); }).join(', ') + ' pedem troca' : ''),
      fl.saldo < 0 || falta.length ? 'var(--warn)' : 'var(--ok)',
      fluxoHtml() + (o.two || '')
    );
    return h;
  }
