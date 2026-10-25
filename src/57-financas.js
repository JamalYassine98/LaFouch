  // ===== Finanças: resultado do mês, fluxo de caixa, retirada do dono, conferência de caixa, capital parado, dólar e preço perigoso. =====
  S.retiradas = []; // retiradas do dono: {ts, moeda, orig, valor, nota}
  S.confCx = []; // conferências do caixa: {ts, difs:{pyg,usd,brl}, ajustou}
  S.ccLemb = true; // lembrete semanal de conferir o caixa
  S.fluxoD = 30;
  var MESES_L = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var GRUPO_LOJA = { loja: 1, profissional: 1 },
    GRUPO_PESSOAL = { pessoal: 1, casa: 1 };

  // Guarda ou compartilha um arquivo de texto: no app usa o compartilhar do celular; no navegador baixa.
  function salvarArquivo(nome, txt, mime, feito, falha) {
    function plano() {
      try {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([txt], { type: mime }));
        a.download = nome;
        document.body.appendChild(a);
        a.click();
        a.remove();
        feito();
      } catch (e) {
        falha();
      }
    }
    var P = window.Capacitor && window.Capacitor.Plugins;
    if (P && P.Filesystem && P.Share) {
      P.Filesystem.writeFile({ path: nome, data: txt, directory: 'CACHE', encoding: 'utf8' })
        .then(function (r) {
          return P.Share.share({ title: nome, url: r.uri, dialogTitle: 'Guardar o arquivo' });
        })
        .then(feito)
        .catch(plano);
    } else plano();
  }

  // ---------- resultado do mês
  function limitesMes(ano, mes) {
    return [new Date(ano, mes, 1).getTime(), new Date(ano, mes + 1, 1).getTime()];
  }
  function noMes(ts, lim) {
    return ts >= lim[0] && ts < lim[1];
  }
  function somaCampo(lista, k, lim, filtro) {
    return lista.reduce(function (a, x) {
      return a + (noMes(x.ts, lim) && (!filtro || filtro(x)) ? x[k] || 0 : 0);
    }, 0);
  }
  // Câmbio de um dia: guarani e real por US$ 1. A venda usa o que gravou; o resto, o histórico do câmbio.
  function cambioEm(ts, v) {
    var p = null;
    (S.fxHist || []).forEach(function (x) {
      if (x.ts <= ts) p = x;
    });
    if (!p) p = (S.fxHist || [])[0] || S.fx;
    var py = v && v.fx > 0 ? v.fx : p.pyg,
      br = v && v.fxb > 0 ? v.fxb : p.brl;
    return { pyg: py > 0 ? py : S.fx.pyg, brl: br > 0 ? br : S.fx.brl };
  }
  // Valor em guaranis do dia "ts" -> equivalentes em US$ e R$ do mesmo dia (conta em dólar ou real usa o valor original).
  function eqDe(g, ts, v, ent) {
    var r = cambioEm(ts, v),
      u = g / r.pyg,
      b;
    if (ent && ent.orig > 0 && g === ent.valor && ent.moeda === 'usd') u = ent.orig;
    b = u * r.brl;
    if (ent && ent.orig > 0 && g === ent.valor && ent.moeda === 'brl') {
      b = ent.orig;
      u = b / r.brl;
    }
    return { usd: u, brl: b };
  }
  // Soma, no câmbio de cada dia, o campo k dos itens do mês (venda: v=true).
  function somaEq(lista, k, lim, filtro, v) {
    var o = { usd: 0, brl: 0 };
    lista.forEach(function (x) {
      if (lim && !noMes(x.ts, lim)) return;
      if (filtro && !filtro(x)) return;
      var e = eqDe(x[k] || 0, x.ts, v ? x : null, v ? null : x);
      o.usd += e.usd;
      o.brl += e.brl;
    });
    return o;
  }
  // Valor de uma linha do resultado na moeda escolhida para os totais (guarani, real ou dólar).
  function rVal(r, k) {
    var m = S.totM === 'usd' || S.totM === 'brl' ? S.totM : 'pyg';
    return m === 'pyg' ? r[k] : r.eq[m][k];
  }
  function rFmt(r, k) {
    var m = S.totM === 'usd' || S.totM === 'brl' ? S.totM : 'pyg';
    return m === 'pyg' ? gsRaw(Math.round(r[k])) : fmtM0(r.eq[m][k], m);
  }
  // Resultado de um mês (mes de 0 a 11): vendas, custos, resultado da loja, retiradas e sobra.
  function resultadoMes(ano, mes) {
    var lim = limitesMes(ano, mes),
      vs = S.sales.filter(function (s) {
        return !s.estorno && noMes(s.ts, lim);
      }),
      r = { ano: ano, mes: mes };
    r.n = vs.length;
    r.pecas = sumBy(vs, 'qty');
    r.vendas = sumBy(vs, 'price');
    r.cmv = sumBy(vs, 'rep');
    r.taxas = vs.reduce(function (a, s) {
      return a + (s.taxa || 0);
    }, 0);
    r.lucroLivre = sumBy(vs, 'livre');
    var pg = S.cpay || [];
    r.contasLoja = somaCampo(pg, 'valor', lim, function (x) {
      return GRUPO_LOJA[x.cat];
    });
    r.contasPessoais = somaCampo(pg, 'valor', lim, function (x) {
      return GRUPO_PESSOAL[x.cat];
    });
    r.imprev = somaCampo(S.imprev, 'valor', lim);
    r.melh = somaCampo(S.melhUso, 'valor', lim);
    var perd = 0;
    (S.contagens || []).forEach(function (c) {
      if (!noMes(c.ts, lim)) return;
      (c.itens || []).forEach(function (it) {
        if (it.usd < 0) perd += -it.usd * S.fx.pyg;
      });
    });
    perd += somaCampo(S.descartes, 'valor', lim);
    r.perdas = Math.round(perd);
    r.cambio = Math.round(somaCampo(S.cambios, 'perdaGs', lim));
    r.retAvulsas = somaCampo(S.retiradas, 'valor', lim);
    r.retTotal = r.retAvulsas + r.contasPessoais;
    r.resultado = r.vendas - r.cmv - r.taxas - r.contasLoja - r.imprev - r.melh - r.perdas - r.cambio;
    r.sobra = r.resultado - r.retTotal;
    r.tem = r.n > 0 || r.contasLoja > 0 || r.retTotal > 0 || r.imprev > 0;
    // os mesmos números no dólar e no real do dia de cada venda e de cada conta (valores fixos)
    var eq = { usd: {}, brl: {} },
      parts = {
        vendas: somaEq(vs, 'price', null, null, true),
        cmv: somaEq(vs, 'rep', null, null, true),
        taxas: somaEq(vs, 'taxa', null, null, true),
        lucroLivre: somaEq(vs, 'livre', null, null, true),
        contasLoja: somaEq(pg, 'valor', lim, function (x) {
          return GRUPO_LOJA[x.cat];
        }),
        contasPessoais: somaEq(pg, 'valor', lim, function (x) {
          return GRUPO_PESSOAL[x.cat];
        }),
        imprev: somaEq(S.imprev, 'valor', lim),
        melh: somaEq(S.melhUso, 'valor', lim),
        retAvulsas: somaEq(S.retiradas, 'valor', lim),
        cambio: somaEq(S.cambios, 'perdaGs', lim)
      },
      pd = somaEq(S.descartes, 'valor', lim);
    ['usd', 'brl'].forEach(function (m) {
      var pu = 0;
      (S.contagens || []).forEach(function (c) {
        if (!noMes(c.ts, lim)) return;
        (c.itens || []).forEach(function (it) {
          if (it.usd < 0) pu += m === 'usd' ? -it.usd : -it.usd * cambioEm(c.ts).brl;
        });
      });
      Object.keys(parts).forEach(function (k) {
        eq[m][k] = parts[k][m];
      });
      eq[m].perdas = pu + pd[m];
      eq[m].retTotal = eq[m].retAvulsas + eq[m].contasPessoais;
      eq[m].resultado = eq[m].vendas - eq[m].cmv - eq[m].taxas - eq[m].contasLoja - eq[m].imprev - eq[m].melh - eq[m].perdas - eq[m].cambio;
      eq[m].sobra = eq[m].resultado - eq[m].retTotal;
    });
    r.eq = eq;
    return r;
  }
  var LINHAS_RES = [
    ['Vendas', 'vendas'],
    ['Custo de repor a mercadoria vendida', 'cmv'],
    ['Taxas de maquininha', 'taxas'],
    ['Contas da loja pagas', 'contasLoja'],
    ['Imprevistos', 'imprev'],
    ['Caixa de melhorias usada', 'melh'],
    ['Perdas de estoque (contagem e descarte)', 'perdas'],
    ['Câmbio nas trocas (dólar mais caro que o separado)', 'cambio'],
    ['Resultado da loja', 'resultado', true],
    ['Retiradas do dono (inclui contas de casa e pessoais)', 'retTotal'],
    ['Sobra do mês', 'sobra', true]
  ];
  // Variação em texto: "+12%" ou "−5%".
  function varTxt(a, b) {
    if (!b) return '';
    var v = (a - b) / Math.abs(b);
    return ' (' + (v >= 0 ? '+' : '−') + Math.round(Math.abs(v) * 100) + '%)';
  }
  // Meses de comparação: atual, anterior e mesmo mês do ano passado.
  function resultadoComparado(ano, mes) {
    var pa = mes === 0 ? ano - 1 : ano,
      pm = mes === 0 ? 11 : mes - 1;
    return {
      a: resultadoMes(ano, mes),
      p: resultadoMes(pa, pm),
      y: resultadoMes(ano - 1, mes)
    };
  }
  function resultadoHtml() {
    var d = new Date(),
      c = resultadoComparado(d.getFullYear(), d.getMonth()),
      h =
        '<section class="card col"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><div><h2 style="margin:0;font-size:16px">Resultado de ' +
        MESES_L[d.getMonth()] +
        '</h2><div class="hint" style="margin:2px 0 0">Compara com ' +
        MESES_L[c.p.mes] +
        ' e com ' +
        MESES_L[c.y.mes] +
        ' de ' +
        c.y.ano +
        '.</div></div><button class="mini" data-act="resexp">Exportar</button></div><div class="split">';
    LINHAS_RES.forEach(function (l) {
      var k = l[1],
        ap =
          'mês passado ' +
          (c.p.tem ? rFmt(c.p, k) + varTxt(rVal(c.a, k), rVal(c.p, k)) : 'sem dados') +
          ' · ' +
          MESES_L[c.y.mes].slice(0, 3) +
          '/' +
          String(c.y.ano).slice(2) +
          ' ' +
          (c.y.tem ? rFmt(c.y, k) + varTxt(rVal(c.a, k), rVal(c.y, k)) : 'sem dados');
      h += l[2]
        ? '<div class="sl" style="border-top:1px solid var(--line);padding-top:10px"><span><b>' +
          l[0] +
          '</b><small>' +
          ap +
          '</small></span><b style="color:' +
          (rVal(c.a, k) >= 0 ? 'var(--ok)' : 'var(--bad)') +
          '">' +
          rFmt(c.a, k) +
          '</b></div>'
        : dxRow(l[0], ap, rFmt(c.a, k));
    });
    return h + '</div></section>';
  }
  // Texto CSV do resultado do mês e das vendas do mês.
  function resultadoCsv() {
    var d = new Date(),
      c = resultadoComparado(d.getFullYear(), d.getMonth()),
      q = function (v) {
        return '"' + String(v).replace(/"/g, '""') + '"';
      },
      out = [
        ['Linha', 'Este mês', 'Mês passado', 'Mesmo mês ano passado'].map(q).join(';')
      ];
    LINHAS_RES.forEach(function (l) {
      out.push([q(l[0]), c.a[l[1]], c.p[l[1]], c.y[l[1]]].join(';'));
    });
    out.push('');
    out.push(['Venda', 'Data', 'Produto', 'Peças', 'Preço G$', 'Pagamento', 'Taxa G$', 'Lucro livre G$'].map(q).join(';'));
    var lim = limitesMes(d.getFullYear(), d.getMonth());
    S.sales
      .filter(function (s) {
        return !s.estorno && noMes(s.ts, lim);
      })
      .forEach(function (s) {
        out.push(
          [
            q(s.id),
            q(new Date(s.ts).toLocaleDateString('pt-BR')),
            q(descOf(s)),
            s.qty,
            s.price,
            q(s.forma || 'din'),
            s.taxa || 0,
            s.livre
          ].join(';')
        );
      });
    return '﻿' + out.join('\r\n');
  }

  // ---------- fluxo de caixa projetado
  // Contas ainda não pagas que vencem nos próximos "dias" (cada uma na sua moeda).
  function contasNoPeriodo(dias) {
    var ini = hoje0(),
      fim = ini + dias * DAY,
      d = new Date(),
      out = [];
    S.exp.forEach(function (e) {
      if (e.cat === 'imprev') return;
      for (var i = 0; i < 5; i++) {
        var ano = d.getFullYear(),
          mes = d.getMonth() + i,
          ym = new Date(ano, mes, 1),
          k = ym.getFullYear() + '-' + ('0' + (ym.getMonth() + 1)).slice(-2),
          ts = vencEm({ dia: e.dia >= 1 ? e.dia : 31 }, ym.getFullYear(), ym.getMonth());
        if (e.paid && e.paid[k]) continue;
        if (i === 0 && ts < ini) ts = ini;
        if (ts <= fim && ts >= ini)
          out.push({ nome: e.nome, ts: ts, moeda: expMoeda(e), orig: expOrig(e), gs: e.valor, semDia: !(e.dia >= 1) });
      }
    });
    return out.sort(function (a, b) {
      return a.ts - b.ts;
    });
  }
  // Projeção do caixa para 30, 60 ou 90 dias, mantendo o ritmo de vendas dos últimos 30 dias.
  function fluxoCaixa(dias) {
    var now = Date.now(),
      first = S.sales.reduce(function (a, s) {
        return Math.min(a, s.ts);
      }, now),
      base = Math.max(7, Math.min(30, (now - Math.min(first, S.appStart || now)) / DAY)),
      v30 = S.sales.filter(function (s) {
        return !s.estorno && now - s.ts <= 30 * DAY;
      }),
      porDia = sumBy(v30, 'price') / base,
      entra = Math.round(porDia * dias),
      fracRep = sumBy(v30, 'price') > 0 ? sumBy(v30, 'rep') / sumBy(v30, 'price') : 0,
      repGs = Math.round(entra * fracRep),
      contas = contasNoPeriodo(dias),
      contasGs = contas.reduce(function (a, x) {
        return a + x.gs;
      }, 0),
      wal = Math.round(walletGs()),
      pm = { pyg: { need: 0 }, usd: { need: 0 }, brl: { need: 0 } };
    contas.forEach(function (x) {
      pm[x.moeda].need += x.orig;
    });
    ['pyg', 'usd', 'brl'].forEach(function (m) {
      pm[m].tem = S.cash[m] || 0;
    });
    return {
      dias: dias,
      porDia: Math.round(porDia),
      entra: entra,
      repGs: repGs,
      contas: contas,
      contasGs: contasGs,
      wal: wal,
      saldo: wal + entra - repGs - contasGs,
      semVender: wal - contasGs,
      pm: pm,
      base: Math.round(base)
    };
  }
  function fluxoHtml() {
    var dd = S.fluxoD || 30,
      f = fluxoCaixa(dd),
      h =
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Fluxo de caixa projetado</h2><div class="hint" style="margin:2px 0 0">Se o ritmo de vendas dos últimos ' +
        f.base +
        ' dias continuar (' +
        gs(f.porDia) +
        ' por dia).</div></div><div class="tabs" role="group" aria-label="Horizonte">' +
        [30, 60, 90]
          .map(function (n) {
            return (
              '<button class="tab' +
              (dd === n ? ' on' : '') +
              '" data-act="fluxod" data-id="' +
              n +
              '" aria-pressed="' +
              (dd === n) +
              '">' +
              n +
              ' dias</button>'
            );
          })
          .join('') +
        '</div><div class="split">';
    h += dxRow('Dinheiro hoje', 'carteira toda somada', gs(f.wal));
    h += dxRow('Entra das vendas', 'estimativa', '+' + gs(f.entra));
    h += dxRow('Sai para repor mercadoria', 'parte das vendas que volta ao estoque', '−' + gs(f.repGs));
    h += dxRow(
      'Sai em contas',
      f.contas.length + ' pagamento(s) até o dia ' + fd(hoje0() + dd * DAY),
      '−' + gs(f.contasGs)
    );
    h +=
      '<div class="sl" style="border-top:1px solid var(--line);padding-top:10px"><span><b>Saldo projetado em ' +
      dd +
      ' dias</b><small>sem vender nada: ' +
      gs(f.semVender) +
      '</small></span><b style="color:' +
      (f.saldo >= 0 ? 'var(--ok)' : 'var(--bad)') +
      '">' +
      gs(f.saldo) +
      '</b></div></div>';
    var falta = ['pyg', 'usd', 'brl'].filter(function (m) {
      return f.pm[m].need > f.pm[m].tem + 1e-9;
    });
    if (falta.length)
      h +=
        '<div class="note n-warn">' +
        falta
          .map(function (m) {
            return (
              'Contas em ' +
              m.toUpperCase() +
              ': precisa de ' +
              fmtM0(f.pm[m].need, m) +
              ' e tem ' +
              fmtM0(f.pm[m].tem, m) +
              '. Troque moeda na aba Caixa antes de vencer.'
            );
          })
          .join(' ') +
        '</div>';
    if (f.contas.length) {
      h += '<div class="split">';
      f.contas.slice(0, 6).forEach(function (x) {
        h += dxRow(
          esc(x.nome),
          (x.semDia ? 'sem dia definido (fim do mês)' : 'dia ' + fd(x.ts)),
          fmtM0(x.orig, x.moeda)
        );
      });
      h += '</div>';
    }
    return h + '</section>';
  }

  // ---------- retirada do dono e conferência do caixa
  function lucroLivreMes() {
    var d = new Date();
    return resultadoMes(d.getFullYear(), d.getMonth());
  }
  function retiradaHtml() {
    var r = lucroLivreMes(),
      h =
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Retirada do dono</h2><div class="hint" style="margin:2px 0 0">Dinheiro que você tira da loja para você. Sai do caixa na moeda escolhida.</div></div>';
    var pct = r.lucroLivre > 0 ? r.retTotal / r.lucroLivre : r.retTotal > 0 ? 9 : 0;
    h +=
      '<div class="note ' +
      (pct > 1 ? 'n-bad' : pct > 0.8 ? 'n-warn' : 'n-ok') +
      '">Neste mês: lucro livre <b>' +
      gs(r.lucroLivre) +
      '</b> · retiradas <b>' +
      gs(r.retTotal) +
      '</b> (inclui contas pessoais e de casa pagas)' +
      (pct > 1
        ? '. Você retirou mais do que a loja lucrou: o excedente saiu do dinheiro da reposição e das contas.'
        : '.') +
      '</div>';
    h +=
      '<div class="sel" style="flex-wrap:wrap"><select class="in" id="rtM" aria-label="Moeda da retirada" style="flex:1 1 90px;width:auto">' + opcoesMoeda() + '</select><input class="in" id="rtV" inputmode="decimal" placeholder="Valor" style="flex:1 1 110px;width:auto" aria-label="Valor da retirada"><input class="in" id="rtN" placeholder="Para quê (opcional)" style="flex:2 1 150px;width:auto" aria-label="Motivo da retirada"><button class="mini" data-act="rtgo">Retirar</button></div><div class="hint" id="rtH" role="status" style="margin:0">' +
      esc(S.rtMsg || '') +
      '</div>';
    S.retiradas.slice(0, 5).forEach(function (x) {
      h +=
        '<div class="sl"><span>' +
        esc(x.nota || 'Retirada') +
        '<small>' +
        fd(x.ts) +
        ' às ' +
        fh(x.ts) +
        ' · <a href="#" data-act="rtdes" data-id="' +
        x.ts +
        '" style="color:var(--accent-fg)">desfazer</a></small></span><b>' +
        fmtM(x.orig, x.moeda) +
        '</b></div>';
    });
    return h + '</section>';
  }
  // Dias desde a última conferência do caixa (Infinity se nunca).
  function ccDias() {
    var u = S.confCx.length ? S.confCx[S.confCx.length - 1].ts : 0;
    return u ? Math.floor((Date.now() - u) / DAY) : Infinity;
  }
  function ccHtml() {
    var dias = ccDias(),
      h =
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Conferir o caixa</h2><div class="hint" style="margin:2px 0 0">Conte o dinheiro que você tem e compare com o que o app calcula.' +
        (dias === Infinity ? ' Ainda não conferiu.' : ' Última conferência há ' + dias + ' dia(s).') +
        '</div></div>';
    if (!S.ccOpen) {
      return h + '<button class="mini" data-act="ccabrir">Conferir caixa</button></section>';
    }
    h += '<div class="sel" style="flex-wrap:wrap">';
    [
      ['ccP', 'Guaranis', 'pyg'],
      ['ccU', 'Dólares', 'usd'],
      ['ccB', 'Reais', 'brl']
    ].forEach(function (x) {
      h +=
        '<div style="flex:1 1 120px"><div class="lbl">' +
        x[1] +
        ' (app: ' +
        fmtM(S.cash[x[2]], x[2]) +
        ')</div><input class="in" id="' +
        x[0] +
        '" inputmode="decimal" value="' +
        (S.ccV && S.ccV[x[0]] != null ? S.ccV[x[0]] : inVal(S.cash[x[2]], x[2])) +
        '" aria-label="' +
        x[1] +
        ' contados"></div>';
    });
    h += '</div>';
    h +=
      '<details style="margin:4px 0"><summary style="cursor:pointer;font-size:14px;color:var(--mute)">Reservas iniciais (só na primeira vez)</summary><div class="sel" style="flex-wrap:wrap;margin-top:8px">' +
      [
        ['ajR', 'Mercadoria (US$)', inVal(S.ini.rep, 'usd')],
        ['ajC', 'Colchão (' + mpSim() + ')', gsParaCampo(S.ini.colch)],
        ['ajM', 'Melhorias (' + mpSim() + ')', gsParaCampo(S.ini.melh)]
      ]
        .map(function (x) {
          return '<div style="flex:1 1 120px"><div class="lbl">' + x[1] + '</div><input class="in" id="' + x[0] + '" inputmode="decimal" value="' + x[2] + '" aria-label="' + x[1] + '"></div>';
        })
        .join('') +
      '</div></details>';
    if (S.ccRes)
      h +=
        '<div class="note ' +
        (S.ccRes.ok ? 'n-ok' : 'n-warn') +
        '" role="status">' +
        esc(S.ccRes.txt) +
        '</div>';
    h += '<div class="sel" style="flex-wrap:wrap"><button class="mini" data-act="ccgo">Conferir</button>';
    if (S.ccRes && !S.ccRes.ok)
      h += '<button class="chip" data-act="ccadj">Ajustar o saldo do app para o que contei</button>';
    return h + '<button class="chip" data-act="ccfechar">Fechar</button></div></section>';
  }

  // ---------- capital parado e retorno do estoque
  function capitalEstoque() {
    var st = prodStats().filter(function (m) {
        return m.stock > 0 && !isSimple(m.tipo);
      }),
      now = Date.now(),
      total = 0,
      parado = 0;
    st.forEach(function (m) {
      total += m.costUsd;
      if ((now - (m.last || S.appStart || now)) / DAY >= 60) parado += m.costUsd;
    });
    var lucro30 = S.sales
      .filter(function (s) {
        return !s.estorno && now - s.ts <= 30 * DAY;
      })
      .reduce(function (a, s) {
        return a + lucroUsd(s);
      }, 0);
    return {
      total: total,
      parado: parado,
      pct: total > 0 ? parado / total : 0,
      lucro30: lucro30,
      retorno: total > 0 ? lucro30 / total : 0
    };
  }
  function capitalHtml() {
    var c = capitalEstoque();
    if (!(c.total > 0)) return '';
    var u = function (n) {
      return 'US$ ' + n.toFixed(2).replace('.', ',');
    };
    return (
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Dinheiro no estoque</h2><div class="hint" style="margin:2px 0 0">Quanto do que você investiu está parado e quanto o estoque rende.</div></div><div class="split">' +
      dxRow('Investido em estoque', 'a custo, sem estojos e brindes', u(c.total)) +
      dxRow(
        'Parado há 60 dias ou mais',
        Math.round(c.pct * 100) + '% do investido',
        '<span style="color:' + (c.pct > 0.3 ? 'var(--warn)' : 'inherit') + '">' + u(c.parado) + '</span>'
      ) +
      dxRow(
        'Retorno do estoque (30 dias)',
        'cada US$ 1 investido rendeu ' + u(c.retorno) + ' de lucro livre',
        pc(c.retorno)
      ) +
      '</div></section>'
    );
  }

  // ---------- dólar favorável para comprar
  function dolarFavoravel() {
    var from = Date.now() - S.janela * DAY,
      h = S.fxHist.filter(function (p) {
        return p.ts >= from;
      });
    if (h.length < 5) return null;
    var vals = h.map(function (p) {
        return p.pyg;
      }),
      min = Math.min.apply(null, vals),
      max = Math.max.apply(null, vals),
      med =
        vals.reduce(function (a, b) {
          return a + b;
        }, 0) / vals.length,
      hj = S.fx.pyg,
      pos = max > min ? (hj - min) / (max - min) : 0.5;
    return {
      hoje: hj,
      min: min,
      max: max,
      media: Math.round(med),
      pos: pos,
      barato: pos <= 0.2 || hj <= med * 0.98,
      caro: pos >= 0.85 && hj >= med * 1.03,
      repUsd: reservas().rUSD
    };
  }

  // ---------- preço que ficou perigoso
  // Produtos cujo preço de tabela não cobre mais o custo, as contas e o colchão com o câmbio de hoje.
  function precoPerigoso() {
    return abaixoDoPiso().filter(function (m) {
      return m.pp.lista < m.pp.trava + m.pp.colch;
    });
  }
  function perigosoHtml() {
    var l = precoPerigoso().slice(0, 6);
    if (!l.length) return '';
    var h =
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Preço ficou perigoso</h2><div class="hint" style="margin:2px 0 0">O preço de tabela já não cobre custo, contas e o colchão com o câmbio de hoje. Sugestão: subir para o piso da faixa.</div></div><div class="split">';
    l.forEach(function (m) {
      var f = faixaOf(m.ref),
        novo = m.pp.piso;
      h += dxRow(
        dxNome(m),
        'tabela ' + gs(m.pp.lista) + ' → sugerido ' + gs(novo) + (f ? '' : ' · defina uma faixa para ajustar por aqui'),
        f
          ? '<button class="mini" data-act="precoap" data-id="' +
              esc(m.key) +
              '">Aplicar</button>'
          : ''
      );
    });
    return h + '</div><div class="hint" style="margin:0">Aplicar leva cada produto da mesma faixa e tipo ao seu próprio piso (o preço antigo fica riscado).</div></section>';
  }

