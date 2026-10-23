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
    return { meta: S.metaUsd || 0, lucro: tot, por: por, restam: dias - d.getDate() + 1, dias: dias };
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
  // Nome curto do produto para listas.
  function dxNome(m) {
    var f = faixaOf(m.ref),
      tp = tipoOf(m.tipo);
    return (
      esc(pn(m.ref)) +
      ' <span class="hint" style="display:inline;margin:0">' +
      esc(tp ? tp.label : '') +
      (f ? ' · ' + esc(f.nome) : '') +
      '</span>'
    );
  }
  // Blocos novos do Dashboard (HTML).
  function dashExtra() {
    var html = '',
      mi = metaInfo(),
      u0 = function (n) {
        return 'US$ ' + Math.round(n);
      };
    // meta
    html += '<section class="card col"><h2 style="margin:0;font-size:16px">Meta do mês</h2>';
    if (mi.meta > 0) {
      var p = Math.min(100, (mi.lucro / mi.meta) * 100);
      html +=
        '<div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:26px;color:var(--ok)">' +
        u0(mi.lucro) +
        '</b><span class="hint" style="margin:0">meta ' +
        u0(mi.meta) +
        '</span></div><div class="bar"><i style="width:' +
        p +
        '%;background:var(--ok)"></i></div><div class="hint" style="margin:0">' +
        (mi.lucro >= mi.meta
          ? 'Meta cumprida.'
          : 'Faltam ' + u0(mi.meta - mi.lucro) + ' · ' + mi.restam + ' dia(s) restantes.') +
        '</div>';
    } else
      html +=
        '<div class="hint" style="margin:0">Lucro livre no mês: <b>' +
        u0(mi.lucro) +
        '</b>. Defina a meta em <a href="#ajustes" data-act="view" data-id="ajustes" style="color:var(--accent-fg)">Ajustes</a>.</div>';
    html += '<div class="split">';
    S.faixas.forEach(function (f) {
      html += dxRow(
        '<span class="sp" style="background:' + faixaCor(f) + '"></span>' + esc(f.nome),
        'lucro livre no mês',
        u0(mi.por[f.id] || 0)
      );
    });
    if (mi.por['']) html += dxRow('Sem faixa', 'lucro livre no mês', u0(mi.por['']));
    html += '</div></section>';
    // sugestões de margem
    var sg = sugestoes().filter(function (r) {
      return r.acao !== 'ignorada';
    });
    if (sg.length) {
      html +=
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Sugestão de margem</h2><div class="hint" style="margin:2px 0 0">Cada faixa é avaliada separada, pelo giro, estoque e contas. Você decide.</div></div><div class="split">';
      sg.forEach(function (r) {
        var ap =
          r.acao === 'subir' || r.acao === 'descer'
            ? '<div style="display:flex;gap:8px;margin-top:6px"><button class="chip on" data-act="sugap" data-id="' +
              r.faixa.id +
              '">Aplicar ' +
              r.para +
              '%</button><button class="chip" data-act="sugig" data-id="' +
              r.faixa.id +
              '">Ignorar</button></div>'
            : '';
        html +=
          '<div class="sl" style="flex-wrap:wrap"><span>' +
          esc(r.faixa.nome) +
          ' · margem ' +
          r.de +
          '%<small>' +
          esc(r.motivo) +
          '</small></span><b>' +
          (r.acao === 'subir' ? 'subir' : r.acao === 'descer' ? 'descer' : r.acao === 'sem-base' ? '—' : 'manter') +
          '</b>' +
          ap +
          '</div>';
      });
      html += '</div></section>';
    }
    // repor primeiro + lista de compras
    var rp = reposicao().slice(0, 8);
    html +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Repor primeiro</h2><div class="hint" style="margin:2px 0 0">Ordenado pelo lucro que o produto dá. Dias de estoque pelo ritmo de venda, corrigido pela estação.</div></div>';
    if (!rp.length) html += '<div class="note n-ok">Nada acabando nos próximos 21 dias.</div>';
    else {
      html += '<div class="split">';
      var totC = 0;
      rp.forEach(function (m) {
        totC += m.comprar * m.cu;
        html += dxRow(
          dxNome(m),
          'restam ~' + Math.round(m.dias) + ' dias · ' + m.stock + ' un. · comprar ~' + m.comprar,
          u0(m.profit30)
        );
      });
      html +=
        '</div><div class="note n-info">Lista de compras (cobre ~45 dias): custo estimado <b>' +
        usd(totC) +
        '</b>.</div>';
    }
    html += '</section>';
    // parados
    var pa = parados().slice(0, 8);
    if (pa.length) {
      html +=
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Estoque parado</h2><div class="hint" style="margin:2px 0 0">Sem venda há 60 dias ou mais (fora da baixa estação). Preço de saída = reposição + contas, sem prejuízo e sem meta de lucro.</div></div><div class="split">';
      pa.forEach(function (m) {
        html += dxRow(
          dxNome(m),
          Math.round(m.diasParado) + ' dias sem vender · ' + m.stock + ' un. · ' + usd(m.costUsd) + ' parados',
          gs(m.pp.saida),
          '<button class="chip" data-act="saida" data-id="' + esc(m.key) + '">Vender com saída</button>'
        );
      });
      html += '</div></section>';
    }
    // câmbio x piso
    var ab = abaixoDoPiso().slice(0, 8);
    if (ab.length) {
      html +=
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Preço abaixo do piso hoje</h2><div class="hint" style="margin:2px 0 0">Com o câmbio e as contas de hoje, o preço de tabela destes produtos não cobre o piso da faixa.</div></div><div class="split">';
      ab.forEach(function (m) {
        html += dxRow(dxNome(m), 'tabela ' + gs(m.pp.lista) + ' · piso ' + gs(m.pp.piso), gs(m.pp.lista - m.pp.piso));
      });
      html += '</div></section>';
    }
    // perdas
    var pr = perdasPropositais();
    if (pr.n) {
      html +=
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Vendas abaixo do piso (30 dias)</h2><div class="hint" style="margin:2px 0 0">' +
        pr.n +
        ' venda(s). O resultado de tudo junto é o que importa: lucro livre total do período <b>' +
        gs(pr.total) +
        '</b>.</div></div><div class="split">';
      Object.keys(pr.por).forEach(function (k) {
        html += dxRow(esc(k), 'lucro livre dessas vendas', sgn(pr.por[k]));
      });
      html += '</div></section>';
    }
    // curva abc
    var ab2 = curvaAbc();
    if (ab2.lista.length || ab2.sem.length) {
      var nA = ab2.lista.filter(function (m) {
          return m.abc === 'A';
        }),
        nB = ab2.lista.filter(function (m) {
          return m.abc === 'B';
        }).length,
        nC = ab2.lista.filter(function (m) {
          return m.abc === 'C';
        }).length;
      html +=
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Curva ABC (90 dias)</h2><div class="hint" style="margin:2px 0 0">A: produtos que dão 80% do lucro · B: próximos 15% · C: o resto.</div></div><div class="split">' +
        dxRow('A', 'dão 80% do lucro', nA.length + ' produto(s)') +
        dxRow('B', 'próximos 15%', nB + ' produto(s)') +
        dxRow('C', 'últimos 5%', nC + ' produto(s)') +
        dxRow('Sem venda', 'têm estoque e não venderam em 90 dias', ab2.sem.length + ' produto(s)') +
        '</div>';
      if (nA.length) {
        html += '<div class="hint" style="margin:0">Campeões: ';
        html += nA
          .slice(0, 5)
          .map(function (m) {
            return esc(pn(m.ref)) + ' (' + u0(m.profit90) + ')';
          })
          .join(', ');
        html += '.</div>';
      }
      html += '</section>';
    }
    return html;
  }
