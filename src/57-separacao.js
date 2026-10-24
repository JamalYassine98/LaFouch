  // ===== Separação do que foi vendido, moeda por moeda (guarani, real e dólar). =====
  // Regras: cada conta é separada na moeda dela; o dólar recebido vai inteiro para a mercadoria
  // (depois o real que sobrou e, só no fim, o guarani); colchão e melhorias saem de cada moeda
  // na proporção do que sobrou. O que restar é o lucro livre. Câmbio de mercado de hoje.
  var MOE3 = ['pyg', 'brl', 'usd'];
  S.colchUsd = 0; // US$ do colchão que já foram trocados para dólar
  S.colchUsos = []; // usos do colchão em dólar: { ts, usd, nota }
  S.fxBaratoUlt = 0;
  S.repQuitUsd = 0; // US$ de reposição já trocados em dólar (vendas mais antigas primeiro)
  S.trIn = {}; // valores digitados no "Trocar agora"

  function vazio3() {
    return { pyg: 0, brl: 0, usd: 0 };
  }
  // Guaranis por 1 unidade de cada moeda (câmbio de mercado).
  function taxas3() {
    return { pyg: 1, brl: S.fx.pyg / S.fx.brl, usd: S.fx.pyg };
  }
  // Soma do que entrou, por moeda, descontado o troco devolvido.
  function recebidoPorMoeda(list) {
    var t = vazio3();
    list.forEach(function (s) {
      (s.pags && s.pags.length ? s.pags : [{ moeda: s.moeda || 'pyg', v: s.recebido != null ? s.recebido : s.price }]).forEach(function (l) {
        t[l.moeda] += l.v;
      });
      (s.troco || []).forEach(function (l) {
        t[l.moeda] -= l.v;
      });
    });
    MOE3.forEach(function (m) {
      t[m] = Math.max(0, t[m]);
    });
    return t;
  }
  // Valor de uma moeda em guaranis.
  function eq3(o) {
    var r = taxas3();
    return MOE3.reduce(function (a, m) {
      return a + (o[m] || 0) * r[m];
    }, 0);
  }
  // Plano de separação das vendas "ps": linhas por moeda, o que trocar para dólar e o que falta.
  function separacaoMoedas(ps) {
    var r = taxas3(),
      vend = recebidoPorMoeda(ps),
      avail = { pyg: vend.pyg, brl: vend.brl, usd: vend.usd },
      repU = sumBy(ps, 'repUSD'),
      conG = sumBy(ps, 'contas'),
      colG = sumBy(ps, 'colch'),
      melG = sumBy(ps, 'melh'),
      tm = totalMensal(),
      con = vazio3(),
      rep = vazio3(),
      colch = vazio3(),
      melh = vazio3(),
      trocar = [],
      need = vazio3();
    // 1. contas, cada uma na sua moeda
    MOE3.forEach(function (m) {
      var parte =
        tm > 0
          ? S.exp.reduce(function (a, e) {
              return a + (expMoeda(e) === m ? e.valor : 0);
            }, 0) / tm
          : m === 'pyg'
          ? 1
          : 0;
      need[m] = (conG * parte) / r[m];
    });
    ['usd', 'brl', 'pyg'].forEach(function (m) {
      var uso = Math.min(need[m], avail[m]);
      con[m] += uso;
      avail[m] -= uso;
      var falta = need[m] - uso;
      if (falta > 1e-9 && m !== 'pyg') {
        // falta da moeda da conta: sai do guarani que sobrou (troca)
        var g = Math.min(avail.pyg, falta * r[m]);
        con.pyg += g;
        avail.pyg -= g;
        if (g > 0) trocar.push({ de: 'pyg', v: g, para: m, rec: g / r[m], motivo: 'conta' });
      }
    });
    // 2. reposição: dólar recebido, depois real, depois guarani
    var rem = repU,
      u = Math.min(rem, avail.usd);
    rep.usd = u;
    avail.usd -= u;
    rem -= u;
    if (rem > 1e-9) {
      var b = Math.min(avail.brl, rem * S.fx.brl);
      if (b > 0) {
        rep.brl = b;
        avail.brl -= b;
        rem -= b / S.fx.brl;
        trocar.push({ de: 'brl', v: b, para: 'usd', rec: b / S.fx.brl, motivo: 'reposicao' });
      }
    }
    if (rem > 1e-9) {
      var g2 = Math.min(avail.pyg, rem * S.fx.pyg);
      if (g2 > 0) {
        rep.pyg = g2;
        avail.pyg -= g2;
        rem -= g2 / S.fx.pyg;
        trocar.push({ de: 'pyg', v: g2, para: 'usd', rec: g2 / S.fx.pyg, motivo: 'reposicao' });
      }
    }
    var faltaUsd = Math.max(0, rem);
    // 3. colchão e melhorias: de cada moeda, na proporção do que sobrou
    var sobraEq = eq3(avail),
      colEq = Math.min(colG, sobraEq),
      melEq = Math.min(melG, Math.max(0, sobraEq - colEq));
    if (sobraEq > 0)
      MOE3.forEach(function (m) {
        var f = (avail[m] * r[m]) / sobraEq;
        colch[m] = (colEq * f) / r[m];
        melh[m] = (melEq * f) / r[m];
        avail[m] = Math.max(0, avail[m] - colch[m] - melh[m]);
      });
    // 4. o que restou é o lucro livre
    var sep = vazio3();
    MOE3.forEach(function (m) {
      sep[m] = rep[m] + con[m] + colch[m] + melh[m];
    });
    return { vend: vend, rep: rep, con: con, colch: colch, melh: melh, sep: sep, livre: avail, trocar: trocar, faltaUsd: faltaUsd, repU: repU };
  }
  // ---------- total convertido (botão G$ / R$ / US$)
  // Valor em guaranis mostrado na moeda escolhida para os totais, sem centavos.
  function totFmt(g) {
    var m = S.totM === 'usd' || S.totM === 'brl' ? S.totM : 'pyg';
    return m === 'pyg' ? gsRaw(Math.round(g)) : fmtM0(g / ratePyg(m), m);
  }
  // Botões para escolher a moeda do total convertido.
  function totBtn() {
    var m = S.totM === 'usd' || S.totM === 'brl' ? S.totM : 'pyg';
    return (
      '<div class="sel" style="gap:8px;margin:0" role="group" aria-label="Moeda do total convertido">' +
      [['pyg', 'G$'], ['brl', 'R$'], ['usd', 'US$']]
        .map(function (o) {
          return '<button type="button" class="chip' + (o[0] === m ? ' on' : '') + '" aria-pressed="' + (o[0] === m) + '" data-act="totm" data-id="' + o[0] + '" style="min-height:40px;min-width:56px;justify-content:center">' + o[1] + '</button>';
        })
        .join('') +
      '</div>'
    );
  }
  // Soma do campo k das vendas, na moeda do total, com o câmbio do dia de cada venda.
  function totVendas(list, k) {
    var m = S.totM === 'usd' || S.totM === 'brl' ? S.totM : 'pyg';
    return m === 'pyg' ? gsRaw(Math.round(sumBy(list, k))) : fmtM0(somaEq(list, k, null, null, true)[m], m);
  }
  // Frase do câmbio de hoje (para o rodapé dos totais convertidos).
  function cambioHojeTxt() {
    return 'Câmbio de hoje: R$ 1 = ' + gsRaw(Math.round(ratePyg('brl'))) + ' · US$ 1 = R$ ' + nf(S.fx.brl, 'brl') + ' = ' + gsRaw(Math.round(S.fx.pyg));
  }
  // O que está livre para você, moeda por moeda, já descontadas reposição, contas, colchão e melhorias.
  // O dólar nunca fica livre: fica com a loja. O que faltar para cobrir as reservas vira "falta".
  function livre3() {
    var r = reservas(),
      rt = taxas3(),
      av = { pyg: Math.max(0, S.cash.pyg), brl: Math.max(0, S.cash.brl), usd: Math.max(0, S.cash.usd) },
      falta = 0,
      lv = vazio3(),
      tm = totalMensal(),
      repU = Math.min(av.usd, r.rUSD),
      needRep;
    av.usd -= repU;
    needRep = r.rUSD - repU;
    var needRep0 = needRep;
    var colUsd = Math.min(av.usd, S.colchUsd || 0);
    av.usd -= colUsd;
    var extraUsd = av.usd; // dólar a mais: fica com a loja
    // reposição que falta em dólar: sai do real e depois do guarani
    var b = Math.min(av.brl, needRep * S.fx.brl);
    av.brl -= b;
    needRep -= b / S.fx.brl;
    var g = Math.min(av.pyg, Math.max(0, needRep) * S.fx.pyg);
    av.pyg -= g;
    needRep -= g / S.fx.pyg;
    if (needRep > 1e-9) falta += needRep * S.fx.pyg;
    // contas: cada uma na moeda dela; o que faltar sai do guarani
    ['usd', 'brl', 'pyg'].forEach(function (m) {
      var parte =
          tm > 0
            ? S.exp.reduce(function (a, e) {
                return a + (expMoeda(e) === m ? e.valor : 0);
              }, 0) / tm
            : m === 'pyg'
              ? 1
              : 0,
        precisa = (r.con * parte) / rt[m],
        pool = m === 'usd' ? extraUsd : av[m],
        uso = Math.min(precisa, pool);
      if (m === 'usd') extraUsd -= uso;
      else av[m] -= uso;
      var f = precisa - uso;
      if (f > 1e-9) {
        var gg = Math.min(av.pyg, f * rt[m]);
        av.pyg -= gg;
        if (f * rt[m] - gg > 0.5) falta += f * rt[m] - gg;
      }
    });
    // colchão (a parte ainda em guarani) e melhorias: de cada moeda, na proporção do que sobrou
    // se o dólar subiu desde as vendas, o colchão cobre a diferença do que ainda falta trocar
    var colPend0 = Math.max(0, r.colch - (S.colchUsd || 0) * S.fx.pyg),
      qa = S.repQuitUsd || 0,
      subiu = needRep0 * S.fx.pyg - baseRepGs(qa, qa + needRep0),
      colUso = Math.max(0, Math.min(subiu, colPend0)),
      colPend = colPend0 - colUso,
      sobra = av.pyg * rt.pyg + av.brl * rt.brl,
      colEq = Math.min(colPend, sobra),
      melEq = Math.min(Math.max(0, r.melh), Math.max(0, sobra - colEq));
    falta += Math.max(0, colPend - colEq) + Math.max(0, Math.max(0, r.melh) - melEq);
    ['pyg', 'brl'].forEach(function (m) {
      var f = sobra > 0 ? (av[m] * rt[m]) / sobra : 0;
      lv[m] = Math.max(0, av[m] - (colEq * f) / rt[m] - (melEq * f) / rt[m]);
    });
    var livreEq = lv.pyg + lv.brl * rt.brl;
    return { livre: lv, livreEq: livreEq, falta: Math.round(falta), extraUsd: extraUsd, colUso: colUso, wal: r.wal, r: r };
  }

  // Moedas que aparecem nos três cartões: as que entraram no período (guarani sempre).
  function moedasVistas(sp) {
    return MOE3.filter(function (m) {
      return m === 'pyg' || sp.vend[m] > 0.004;
    });
  }
  // Valor para as linhas dos cartões (guarani inteiro; real e dólar com centavos).
  function v3(v, m) {
    return fmtM(m === 'pyg' ? Math.round(v / 100) * 100 : Math.round(v * 100) / 100, m);
  }
  // Um cartão de valores com uma moeda por linha, na mesma ordem em todos os cartões.
  function kpi3(rotulo, o, ms, cor, dica) {
    var tam = ms.length > 2 ? 18 : ms.length > 1 ? 22 : 26;
    return (
      '<div class="kpi"><div class="lbl">' + rotulo + '</div><b style="' + (cor ? 'color:' + cor + ';' : '') + 'font-size:' + tam + 'px;line-height:1.5;display:block;font-variant-numeric:tabular-nums">' +
      ms.map(function (m) {
        return v3(o[m] || 0, m);
      }).join('<br>') +
      '</b><div class="hint">' + dica + '</div></div>'
    );
  }
  // Tabela "Quanto separar do que você vendeu": linhas por destino, colunas por moeda.
  function sepTabelaHtml(sp, ms) {
    var grade = 'display:grid;grid-template-columns:1.4fr repeat(' + ms.length + ',1fr);gap:6px;align-items:baseline;font-size:13.5px',
      ln = function (nome, sub, o, cor, forte, topo) {
        return (
          '<div style="' + grade + (topo ? ';border-top:1px solid var(--line);padding-top:10px' : '') + '"><span><span class="sp" style="background:' + cor + '"></span>' + nome + '<small style="display:block;color:var(--mute);font-size:11.5px">' + sub + '</small></span>' +
          ms.map(function (m) {
            var z = !(o[m] > 0.004);
            return '<span style="text-align:right;' + (forte ? 'font-weight:700;' : '') + (z ? 'opacity:.35' : '') + '">' + (z ? '—' : v3(o[m], m)) + '</span>';
          }).join('') +
          '</div>'
        );
      };
    return (
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Quanto separar do que você vendeu</h2><div class="hint" style="margin:2px 0 0">Cada conta na sua moeda; o dólar vai para a mercadoria e o colchão sai de cada moeda na proporção do que sobrou. Câmbio de hoje.</div></div>' +
      '<div style="' + grade + ';font-size:11px;letter-spacing:.06em;color:var(--mute);text-transform:uppercase"><span></span>' +
      ms.map(function (m) {
        return '<span style="text-align:right">' + { pyg: 'G$', brl: 'R$', usd: 'US$' }[m] + '</span>';
      }).join('') +
      '</div>' +
      ln('Vendido', 'entrou no período', sp.vend, '#9aa', true, false) +
      ln('Reposição', 'dólar primeiro, depois real, resto em guarani', sp.rep, '#00c8ff', false, true) +
      ln('Contas', 'cada uma na sua moeda', sp.con, '#a2447c', false, false) +
      ln('Colchão', 'proporcional ao que sobrou', sp.colch, '#ffc766', false, false) +
      ln('Melhorias', 'opcional', sp.melh, 'var(--info)', false, false) +
      ln('Lucro livre', 'o que sobrou', sp.livre, '#00ff88', true, true) +
      '</section>'
    );
  }
  // Cartão "Para repor o estoque": quanto trocar de cada moeda por dólar.
  function reporHtml(sp) {
    if (!(sp.repU > 0.004)) return '';
    var r = taxas3(),
      linhas = '';
    if (sp.rep.usd > 0.004)
      linhas += '<div class="sl"><span>Dólar recebido<small>já está em dólar e fica para a mercadoria</small></span><b>' + usd(sp.rep.usd) + '</b></div>';
    sp.trocar
      .filter(function (t) {
        return t.motivo === 'reposicao';
      })
      .forEach(function (t) {
        linhas +=
          '<div class="sl"><span>Trocar <b>' + v3(t.v, t.de) + '</b> por <b>' + usd(t.rec) + '</b><small>cotação de mercado ' +
          (t.de === 'brl' ? 'R$ ' + nf(S.fx.brl, 'brl') + ' por US$ 1' : gsRaw(S.fx.pyg) + ' por US$ 1') + '</small></span><b>' + v3(t.v, t.de) + '</b></div>';
      });
    var sobra = {};
    MOE3.forEach(function (m) {
      sobra[m] = Math.max(0, sp.vend[m] - sp.rep[m]);
    });
    var txt = MOE3.filter(function (m) {
      return sobra[m] > 0.004;
    })
      .map(function (m) {
        return '<b>' + v3(sobra[m], m) + '</b>';
      })
      .join(' e ');
    return (
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Para repor o estoque</h2><div class="hint" style="margin:2px 0 0">Reposição: <b>' + usd(sp.repU) + '</b>. Do que você recebeu, nesta ordem:</div></div><div class="split">' +
      linhas + '</div>' +
      (sp.faltaUsd > 0.004
        ? '<div class="note n-warn">Faltam <b>' + usd(sp.faltaUsd) + '</b> para repor tudo só com o que entrou neste período.</div>'
        : '<div class="note n-ok">Reposição coberta.' + (txt ? ' Depois de repor, sobram ' + txt + ' para as contas, o colchão e o seu lucro.' : '') + '</div>') +
      '</section>'
    );
  }
  // Saldo do colchão: o que já está em dólar, o que ainda não foi trocado e o que foi usado.
  function colchaoSaldoHtml() {
    var r = reservas(),
      emUsd = S.colchUsd || 0,
      falta = Math.max(0, r.colch - emUsd * S.fx.pyg),
      usos = (S.colchUsos || []).slice(0, 3);
    if (!(r.colch > 0) && !emUsd) return '';
    return (
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Colchão de segurança</h2><div class="hint" style="margin:2px 0 0">Reserva contra a alta do dólar. Em dólar ele não perde valor.</div></div>' +
      '<div class="sl"><span>Já em dólar<small>protegido</small></span><b style="color:var(--ok)">' + usd(emUsd) + '</b></div>' +
      '<div class="sl"><span>Ainda não trocado<small>espera o dólar ficar barato (em guaranis)</small></span><b>' + gs(Math.round(falta)) + '</b></div>' +
      (livre3().colUso > 0.5
        ? '<div class="sl"><span>Cobrindo a alta do dólar agora<small>diferença do que ainda falta trocar</small></span><b style="color:var(--warn)">− ' + usd(livre3().colUso / S.fx.pyg) + '</b></div>'
        : '') +
      usos.map(function (x) {
        return '<div class="sl"><span>Usado para cobrir a alta<small>' + fd(x.ts) + (x.nota ? ' · ' + esc(x.nota) : '') + '</small></span><b style="color:var(--warn)">− ' + usd(x.usd) + '</b></div>';
      }).join('') +
      '<div class="hint" style="margin:0">Cada venda nova separa um colchão novo. Quando o dólar estiver barato, o app avisa para trocar.</div></section>'
    );
  }
  // Custo, no câmbio de cada venda, dos dólares de reposição de a até b (as vendas mais antigas primeiro).
  function baseRepGs(a, b) {
    if (!(b > a)) return 0;
    var lista = [],
      pos = 0,
      tot = 0;
    if (S.ini.rep > 0) lista.push({ u: S.ini.rep, fx: S.fx.pyg });
    S.sales
      .filter(function (s) {
        return !s.estorno && s.repUSD > 0;
      })
      .sort(function (x, y) {
        return x.ts - y.ts;
      })
      .forEach(function (s) {
        lista.push({ u: s.repUSD, fx: s.fx > 0 ? s.fx : S.fx.pyg });
      });
    lista.forEach(function (x) {
      var ini = Math.max(a, pos),
        fim = Math.min(b, pos + x.u);
      if (fim > ini) tot += (fim - ini) * x.fx;
      pos += x.u;
    });
    if (b > pos) tot += (b - Math.max(a, pos)) * S.fx.pyg;
    return tot;
  }
  // Valor redondo para sugerir na troca: real na dezena, guarani em 50 mil, sempre para cima.
  function arredTroca(v, de) {
    var passo = de === 'pyg' ? 50000 : 10;
    return Math.ceil(v / passo - 1e-9) * passo;
  }
  // O que dá para trocar agora com o dinheiro em caixa: reposição (necessário) e colchão (aproveitar).
  // Os valores vêm arredondados (R$ 250, G$ 500.000) e dá para editar na tela.
  function trocarPlano() {
    var r = reservas(),
      fx = S.fx.pyg,
      reservado = r.con + r.melh,
      livrePyg = Math.max(0, S.cash.pyg - reservado),
      brl = Math.max(0, S.cash.brl),
      needRep = Math.max(0, r.rUSD - Math.max(0, S.cash.usd)),
      passos = [],
      rem = needRep,
      b = Math.min(brl, rem * S.fx.brl),
      mk = function (tipo, de, v, disp) {
        var sug = Math.min(arredTroca(v, de), de === 'pyg' ? Math.floor(disp / 1000) * 1000 : Math.floor(disp)),
          rec = Math.floor((sug * ratePyg(de)) / fx);
        if (sug > 0 && rec >= 1) passos.push({ tipo: tipo, de: de, v: v, sug: sug, rec: rec });
        return sug;
      };
    if (b > 0.004) {
      mk('repor', 'brl', b, brl);
      rem -= b / S.fx.brl;
    }
    var g = Math.min(livrePyg, Math.max(0, rem) * fx);
    if (g > 50) {
      var sg = mk('repor', 'pyg', g, livrePyg);
      livrePyg -= Math.max(sg, 0);
    }
    var colPend = Math.max(0, r.colch - (S.colchUsd || 0) * fx),
      gc = Math.min(livrePyg, colPend);
    if (gc > 50) mk('colchao', 'pyg', gc, livrePyg);
    return { passos: passos, needRep: needRep, colPend: colPend };
  }
  // Registra a(s) troca(s) feita(s): entregue e recebido de cada linha. Ajusta caixa, reposição e colchão.
  function trocarRegistrar(linhas) {
    var tot = 0,
      fx = ratePyg('usd');
    linhas.forEach(function (x) {
      var v = x.de === 'pyg' ? Math.round(x.v) : Math.round(x.v * 100) / 100,
        rec = Math.round(x.rec * 100) / 100;
      if (!(v > 0) || !(rec > 0) || (S.cash[x.de] || 0) < v - 0.005) return;
      var dadoGs = v * ratePyg(x.de),
        e = { ts: Date.now(), de: x.de, para: 'usd', dado: v, rec: rec, difGs: Math.round(rec * fx - dadoGs), tipo: x.tipo };
      S.cash[x.de] -= v;
      S.cash.usd += rec;
      if (x.tipo === 'colchao') S.colchUsd = (S.colchUsd || 0) + rec;
      else {
        var devido = Math.max(0, reservas().rUSD - (S.repQuitUsd || 0)),
          aplic = Math.min(rec, devido),
          custoGs = dadoGs * (aplic / rec),
          base = baseRepGs(S.repQuitUsd || 0, (S.repQuitUsd || 0) + aplic),
          perda = Math.round(custoGs - base);
        e.quit = aplic;
        e.perdaGs = perda;
        S.repQuitUsd = (S.repQuitUsd || 0) + aplic;
        if (perda > 0) {
          var uso = Math.min(perda, Math.max(0, reservas().colch));
          if (uso > 0) {
            e.usoTs = e.ts;
            S.colchUsos.unshift({ ts: e.ts, usd: uso / fx, gs: Math.round(uso), nota: 'Dólar mais caro que o separado na venda' });
          }
        }
      }
      S.cambios.unshift(e);
      tot += rec;
    });
    S.cxMsg = tot > 0 ? 'Troca registrada: ' + usd(tot) + ' comprados.' : 'Nada para trocar agora.';
    return tot;
  }
  // Desfaz a última troca registrada pelo "Trocar agora".
  function trocarDesfazer() {
    var e = S.cambios[0];
    if (!e || !e.tipo) return false;
    S.cash[e.de] += e.dado;
    S.cash.usd -= e.rec;
    if (e.tipo === 'colchao') S.colchUsd = Math.max(0, (S.colchUsd || 0) - e.rec);
    if (e.quit) S.repQuitUsd = Math.max(0, (S.repQuitUsd || 0) - e.quit);
    if (e.usoTs) S.colchUsos = S.colchUsos.filter(function (u) {
      return u.ts !== e.usoTs;
    });
    S.cambios.shift();
    S.cxMsg = 'Troca desfeita.';
    return true;
  }
