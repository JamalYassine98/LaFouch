  // ===== Análises: meta do mês, reposição, estoque parado, curva ABC, sugestão de margem e câmbio x piso. =====
  // Lucro livre de uma venda em US$ (ao câmbio da venda).
  function lucroUsd(s) {
    return s.livre / (s.fx || S.fx.pyg);
  }
  // Estatísticas por produto (tipo + código): estoque, vendas e lucro.
  function prodStats() {
    var now = Date.now(),
      map = {},
      order = [];
    S.items.forEach(function (i) {
      var t = tipoOf(i.tipo);
      if (!t) return;
      var k = i.tipo + '|' + i.ref;
      if (!map[k]) {
        map[k] = {
          key: k,
          tipo: i.tipo,
          ref: i.ref,
          it: i,
          stock: 0,
          costUsd: 0,
          cu: 0,
          sold30: 0,
          sold90: 0,
          adj30: 0,
          profit30: 0,
          profit90: 0,
          last: 0
        };
        order.push(k);
      }
      var m = map[k],
        c = effCusto(i);
      if (i.qty > 0 && (m.it.qty <= 0 || !m.stock)) m.it = i;
      m.stock += i.qty;
      m.costUsd += i.qty * (c != null ? c : t.repUSD || 0);
    });
    S.sales.forEach(function (s) {
      var m = map[s.tipo + '|' + s.ref];
      if (!m || s.estorno) return;
      var age = (now - s.ts) / DAY;
      if (age <= 90) {
        m.sold90 += s.qty;
        m.profit90 += lucroUsd(s);
      }
      if (age <= 30) {
        m.sold30 += s.qty;
        m.profit30 += lucroUsd(s);
        m.adj30 += s.qty / sazonFator(s.tipo, new Date(s.ts).getMonth());
      }
      if (s.ts > m.last) m.last = s.ts;
    });
    return order.map(function (k) {
      var m = map[k];
      m.cu = m.stock > 0 ? m.costUsd / m.stock : brindeUsd(m.it);
      return m;
    });
  }
  // Meta do mês: lucro até agora, por faixa, e dias restantes.
  function metaInfo() {
    var d = new Date(),
      ini = new Date(d.getFullYear(), d.getMonth(), 1).getTime(),
      dias = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(),
      tot = 0,
      por = {};
    S.sales.forEach(function (s) {
      if (s.estorno || s.ts < ini) return;
      var u = lucroUsd(s),
        k = s.faixa || '';
      tot += u;
      por[k] = (por[k] || 0) + u;
    });
    return { meta: metaMes(), lucro: tot, por: por, restam: dias - d.getDate() + 1, dias: dias };
  }
  // Ritmo de venda esperado para os próximos 30 dias (já corrigido pela estação).
  function esperado30(m) {
    var f = sazonFator(m.tipo, new Date(Date.now() + 15 * DAY).getMonth());
    return m.adj30 * f;
  }
  // Produtos que mais dão lucro e estão acabando, com a quantidade sugerida para comprar.
  function reposicao() {
    return prodStats()
      .filter(function (m) {
        return m.sold30 > 0 && m.stock >= 0;
      })
      .map(function (m) {
        var e = esperado30(m),
          dias = e > 0 ? m.stock / (e / 30) : Infinity;
        m.dias = dias;
        m.comprar = Math.max(0, Math.ceil(e * 1.5 - m.stock));
        return m;
      })
      .filter(function (m) {
        return m.dias <= 21;
      })
      .sort(function (a, b) {
        return b.profit30 - a.profit30;
      });
  }
  // Estoque parado: sem venda há muito tempo (fora da baixa estação) com preço de saída sem prejuízo.
  function parados() {
    var now = Date.now(),
      mes = new Date().getMonth();
    return prodStats()
      .filter(function (m) {
        if (m.stock <= 0 || isSimple(m.tipo)) return false;
        var dias = (now - (m.last || S.appStart || now)) / DAY;
        m.diasParado = dias;
        return dias >= 60 && sazonFator(m.tipo, mes) >= 0.8;
      })
      .map(function (m) {
        m.pp = pisoPeca(m.it);
        return m;
      })
      .filter(function (m) {
        return m.pp.lista > 0 && m.pp.saida < m.pp.lista;
      })
      .sort(function (a, b) {
        return b.costUsd - a.costUsd;
      });
  }
  // Curva ABC pelo lucro dos últimos 90 dias.
  function curvaAbc() {
    var st = prodStats(),
      com = st
        .filter(function (m) {
          return m.profit90 > 0;
        })
        .sort(function (a, b) {
          return b.profit90 - a.profit90;
        }),
      tot = com.reduce(function (a, m) {
        return a + m.profit90;
      }, 0),
      acc = 0;
    com.forEach(function (m) {
      acc += m.profit90;
      m.abc = acc - m.profit90 < tot * 0.8 ? 'A' : acc - m.profit90 < tot * 0.95 ? 'B' : 'C';
    });
    var sem = st.filter(function (m) {
      return m.stock > 0 && m.sold90 === 0;
    });
    return { lista: com, total: tot, sem: sem };
  }
  // Produtos cujo preço de tabela ficou abaixo do piso com o câmbio de hoje.
  function abaixoDoPiso() {
    return prodStats()
      .map(function (m) {
        m.pp = pisoPeca(m.it);
        return m;
      })
      .filter(function (m) {
        return m.stock > 0 && !isSimple(m.tipo) && m.pp.lista > 0 && m.pp.lista < m.pp.piso;
      });
  }
  // Vendas abaixo da trava ou do piso nos últimos 30 dias, por motivo.
  function perdasPropositais() {
    var por = {},
      perda = 0,
      n = 0;
    periodSales(30).forEach(function (s) {
      if (!s.abaixo) return;
      n++;
      if (s.livre < 0) perda += s.livre;
      var k = s.motivo || 'Sem motivo';
      por[k] = (por[k] || 0) + s.livre;
    });
    return { n: n, perda: perda, por: por, total: sumBy(periodSales(30), 'livre') };
  }
  // Sugestão de margem por faixa: olha o giro, o estoque e as contas.
  function sugestoes() {
    var now = Date.now(),
      ym = new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
      oldest = S.sales.reduce(function (a, s) {
        return Math.min(a, s.ts);
      }, S.appStart || now),
      hist = (now - Math.min(oldest, S.appStart || now)) / DAY,
      st = prodStats(),
      meta = metaInfo(),
      contasOk = reservas().livre >= 0;
    return S.faixas.map(function (f) {
      var r = { faixa: f, de: f.margem, para: f.margem, acao: 'manter', motivo: '' };
      if (S.sugIgn[f.id] === ym) {
        r.acao = 'ignorada';
        return r;
      }
      var cur = 0,
        prev = 0,
        stock = 0,
        exp = 0;
      S.sales.forEach(function (s) {
        if (s.estorno || s.faixa !== f.id) return;
        var age = (now - s.ts) / DAY,
          adj = s.qty / sazonFator(s.tipo, new Date(s.ts).getMonth());
        if (age <= 30) cur += adj;
        else if (age <= 90) prev += adj / 2;
      });
      st.forEach(function (m) {
        if ((faixaOf(m.ref) || {}).id !== f.id) return;
        stock += m.stock;
        exp += esperado30(m);
      });
      var dias = exp > 0 ? stock / (exp / 30) : Infinity;
      if (hist < 60 || prev <= 0) {
        r.acao = 'sem-base';
        r.motivo = 'Ainda sem histórico suficiente (precisa de 2 meses de vendas desta faixa).';
        return r;
      }
      var ratio = cur / prev,
        pct = Math.round(ratio * 100);
      if (ratio >= 1.3 && dias <= 25) {
        r.acao = 'subir';
        r.para = Math.min(80, f.margem + 3);
        r.motivo =
          'Vendeu ' + pct + '% do ritmo normal e o estoque dura ~' + Math.round(dias) + ' dias. Há espaço para subir a margem.';
      } else if (ratio <= 0.7 && dias >= 60) {
        r.acao = 'descer';
        r.para = Math.max(10, f.margem - 3);
        r.motivo =
          'Vendeu só ' + pct + '% do ritmo normal e o estoque dura ~' + Math.min(999, Math.round(dias)) + ' dias. Baixar a margem dá mais giro.';
      } else {
        r.motivo =
          'Vendas em ' +
          pct +
          '% do ritmo normal' +
          (contasOk ? ', contas cobertas' : ', mas o caixa está abaixo do separado') +
          (meta.meta > 0
            ? meta.lucro >= meta.meta
              ? ' e meta cumprida.'
              : ', meta em ' + Math.round((meta.lucro / meta.meta) * 100) + '%.'
            : '.');
      }
      if (r.para === r.de) r.acao = 'manter';
      return r;
    });
  }
  // Linha simples de lista: título, apoio e valor à direita.
  // Curva ABC (90 dias) em linhas: A · B · C, sem venda e os campeões (52e: Dashboard › Detalhes › "Curva ABC ⌄")
  function abcCorpo(ab2) {
    ab2 = ab2 || curvaAbc();
    var n = function (l) { return l.length + (l.length === 1 ? ' produto' : ' produtos'); },
      nA = ab2.lista.filter(function (m) { return m.abc === 'A'; }),
      nB = ab2.lista.filter(function (m) { return m.abc === 'B'; }),
      nC = ab2.lista.filter(function (m) { return m.abc === 'C'; }),
      h = '<div class="split">' +
        dxRow('A · dão 80% do lucro', '', n(nA)) +
        dxRow('B · próximos 15%', '', n(nB)) +
        dxRow('C · últimos 5%', '', n(nC)) +
        dxRow('Sem venda em 90 dias', 'têm estoque', '<span' + (ab2.sem.length ? ' style="color:var(--warn)"' : '') + '>' + n(ab2.sem) + '</span>') +
        '</div>';
    if (nA.length)
      h += '<div class="hint abcCamp">Campeões: ' + nA.slice(0, 5).map(function (m) { return esc(pn(m.ref)) + ' (' + usd0(m.profit90) + ')'; }).join(', ') + '.</div>';
    return h;
  }
  function dxRow(titulo, apoio, dir, extra) {
    return (
      '<div class="sl"><span>' +
      titulo +
      '<small>' +
      apoio +
      '</small></span><b>' +
      (dir || '') +
      '</b>' +
      (extra || '') +
      '</div>'
    );
  }
  // Perdas e sobras das contagens de estoque (30 dias): mora na tela Contar o estoque (ESBOCO 22/11; antes no Giro)
  function perdasContagemHtml() {
    var html = '';
    var ct = S.contagens.filter(function (x) {
      return Date.now() - x.ts <= 30 * DAY;
    });
    if (ct.length) {
      var perd = 0,
        sob = 0,
        porP = {};
      ct.forEach(function (x) {
        (x.itens || []).forEach(function (it) {
          if (it.usd < 0) {
            perd += it.usd;
            porP[it.ref] = (porP[it.ref] || 0) + it.usd;
          } else sob += it.usd;
        });
      });
      html +=
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Perdas e sobras de estoque (30 dias)</h2></div><div class="split">' +
        dxRow('Faltaram', ct.length + ' contagem(ns)', usd0(Math.abs(perd))) +
        dxRow('Sobraram', 'peças a mais que o app', usd0(sob));
      Object.keys(porP)
        .sort(function (a, b) {
          return porP[a] - porP[b];
        })
        .slice(0, 5)
        .forEach(function (r) {
          html += dxRow(esc(pn(r)), 'mais perdido', usd0(Math.abs(porP[r])));
        });
      html += '</div></section>';
    }
    return html;
  }
