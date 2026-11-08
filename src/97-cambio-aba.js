  // ===== Aba Câmbio simples (v426, esboço aprovado 04/11/2026 — versão A) =====
  // Topo: Dólar G$ · Real G$ · Dólar em reais R$ (La Moneda Jebai), cada um com a variação de 7 dias; tocar abre a janela com o gráfico.
  // Cartão Reposição: selo (Bom momento / Normal / Pode esperar / Troque hoje), "Faltam US$ X", barra, "US$ a de US$ b"
  // e a linha discreta "Registrar troca ›". Tocar no cartão abre a janela "Por que…" (gráfico + motivos).
  // Linhas: Últimas trocas · Preços no site · Como o app te protege — cada uma abre a sua janela.
  // A previsão do dólar só alimenta o selo (não tem cartão próprio); o plano de troca saiu.
  S.fxJan = ''; // janela aberta: repo, usd, brl, arb, trocas, site, prot, troca
  S.fxPer = 90;
  S.fxAvisos = {};
  var FX_NOME = { usd: 'Dólar', brl: 'Real', arb: 'Dólar em reais' };
  // v452 (07/11, opção 2): botão "Venda ⇅ / Compra ⇅" ao lado do título alterna as três cotações do topo entre a compra e a venda da casa.
  S.fxModo = 'v';
  try {
    if (localStorage.getItem('lf_fxmodo') === 'c') S.fxModo = 'c';
  } catch (e) {}
  function fxTopVal(k) {
    if (!lmOk()) return fxHoje(k);
    var o = k === 'usd' ? S.lm.usd : k === 'brl' ? S.lm.brl : S.lm.arb;
    return (S.fxModo === 'c' ? o.c : o.v) || fxHoje(k);
  }
  var FX_SETAS = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3"/></svg>';
  // diagnóstico: copia o texto que o app recebeu da La Moneda (para mandar ao suporte)
  ACT.fxCopia = function () {
    var t = S._lmTxt || '';
    try {
      navigator.clipboard.writeText(t).then(
        function () {
          alertaCopia(true);
        },
        function () {
          alertaCopia(false);
        }
      );
    } catch (e) {
      alertaCopia(false);
    }
  };
  function alertaCopia(ok) {
    S.fxCopiado = ok ? 'Copiado. Cole na conversa com o suporte.' : 'Não deu para copiar.';
    renderFx();
    setTimeout(function () {
      S.fxCopiado = '';
      renderFx();
    }, 4000);
  }
  ACT.fxSt = function () {
    S.fxStD = !S.fxStD;
    renderFx();
  };
  ACT.fxModo = function () {
    S.fxModo = S.fxModo === 'c' ? 'v' : 'c';
    try {
      localStorage.setItem('lf_fxmodo', S.fxModo);
    } catch (e) {}
    renderFx();
  };
  // Série diária (último valor de cada dia). Casa (La Moneda) desde que existe; antes disso, o histórico de mercado
  // ajustado ao nível da casa, só para o desenho do gráfico não começar vazio.
  function fxSerie(k, m) {
    var dia = {},
      chave = function (ts) {
        var d = new Date(ts);
        return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
      },
      put = function (ts, v, casa) {
        if (!(v > 0)) return;
        var c = chave(ts);
        if (dia[c] && dia[c].casa && !casa) return;
        if (!dia[c] || casa || dia[c].ts <= ts) dia[c] = { ts: ts, v: v, casa: !!casa };
      },
      lmH = (S.lm && S.lm.hist) || [],
      ini = lmH.length ? lmH[0][0] : Infinity;
    lmH.forEach(function (x) {
      var v = m
        ? k === 'usd'
          ? x[m === 'c' ? 1 : 2]
          : k === 'brl'
          ? x[m === 'c' ? 3 : 4]
          : (m === 'c' ? x[6] : 0) || x[5] || (x[3] > 0 ? x[2] / x[3] : 0)
        : k === 'usd'
        ? x[2]
        : k === 'brl'
        ? x[3]
        : x[5] || (x[3] > 0 ? x[2] / x[3] : 0);
      put(x[0], v, true);
    });
    if (lmOk()) put(S.lm.ts, fxHoje(k, m), true);
    var mk = [];
    (S.fxHist || []).forEach(function (p) {
      if (p.c || p.ts >= ini) return;
      var v = k === 'usd' ? p.pyg : k === 'brl' ? (p.brl > 0 ? p.pyg / p.brl : 0) : p.brl;
      if (v > 0) mk.push({ ts: p.ts, v: v });
    });
    if (mk.length && isFinite(ini)) {
      var c0 = Object.keys(dia).sort()[0],
        f = dia[c0] ? dia[c0].v / mk[mk.length - 1].v : 1;
      mk.forEach(function (p) {
        put(p.ts, p.v * f, false);
      });
    } else
      mk.forEach(function (p) {
        put(p.ts, p.v, false);
      });
    return Object.keys(dia)
      .sort()
      .map(function (c) {
        return dia[c];
      })
      .filter(function (p) {
        return Date.now() - p.ts <= 400 * DAY;
      });
  }
  function fxHoje(k, m) {
    if (lmOk() && m) {
      var o = k === 'usd' ? S.lm.usd : k === 'brl' ? S.lm.brl : S.lm.arb;
      return (m === 'c' ? o.c : o.v) || fxHoje(k);
    }
    if (lmOk()) return k === 'usd' ? S.lm.usd.v : k === 'brl' ? S.lm.brl.c : S.lm.arb.v;
    var f = S.fx || {};
    return k === 'usd' ? f.pyg : k === 'brl' ? (f.brl > 0 ? f.pyg / f.brl : 0) : f.brl;
  }
  // Variação em 7 dias (fração).
  function fxVar7(k, m) {
    var s = fxSerie(k, m),
      h = fxHoje(k, m),
      lim = Date.now() - 7 * DAY,
      ant = 0;
    s.forEach(function (p) {
      if (p.ts <= lim) ant = p.v;
    });
    if (!ant && s.length) ant = s[0].v;
    return ant > 0 && h > 0 ? h / ant - 1 : 0;
  }
  function fxReta(ps) {
    var n = ps.length;
    if (n < 3) return { b: 0, r2: 0 };
    var x0 = ps[0].ts,
      sx = 0,
      sy = 0,
      sxx = 0,
      sxy = 0,
      syy = 0;
    ps.forEach(function (p) {
      var x = (p.ts - x0) / DAY;
      sx += x;
      sy += p.v;
      sxx += x * x;
      sxy += x * p.v;
      syy += p.v * p.v;
    });
    var den = n * sxx - sx * sx,
      vy = n * syy - sy * sy;
    return { b: den ? (n * sxy - sx * sy) / den : 0, r2: den && vy > 0 ? Math.pow(n * sxy - sx * sy, 2) / (den * vy) : 0 };
  }
  // Previsão de 7 dias do dólar (reta de 2 semanas 70% + posição × média 30% + real).
  function fxPrevisao(k, m) {
    k = k || 'usd';
    var s = fxSerie(k, m);
    if (s.length < 7) return { ok: false, n: s.length };
    var ult = fxHoje(k, m) || s[s.length - 1].v,
      u14 = s.filter(function (p) {
        return Date.now() - p.ts <= 14 * DAY;
      });
    if (u14.length < 5) u14 = s.slice(-14);
    var reta = fxReta(u14),
      tend = (reta.b * 7) / ult,
      med = u14.reduce(function (a, p) {
        return a + p.v;
      }, 0) / u14.length,
      mom = med > 0 ? ult / med - 1 : 0,
      score = tend * 0.7 + mom * 0.3,
      rv = 0;
    var dir = score > 0.004 ? 'sobe' : score < -0.004 ? 'cai' : 'estavel',
      cert = s.length >= 30 && reta.r2 >= 0.6 ? 'alta' : s.length >= 14 && reta.r2 >= 0.3 ? 'média' : 'baixa';
    return { ok: true, dir: dir, pct: score + rv, cert: cert, ult: ult };
  }
  // Reposição em dólar: total separado, quanto já há em dólar e quanto falta.
  function fxRepo() {
    var r = reservas(),
      tot = Math.max(0, r.rUSD || 0),
      tem = Math.max(0, Math.min(tot, (S.cash && S.cash.usd) || 0));
    return { tot: tot, tem: tem, falta: Math.max(0, tot - tem) };
  }
  // O selo e os motivos.
  function fxVeredito() {
    var s = fxSerie('usd'),
      hoje = fxHoje('usd'),
      rp = fxRepo(),
      pv = fxPrevisao(),
      u90 = s.filter(function (p) {
        return Date.now() - p.ts <= 90 * DAY;
      }),
      out = { k: 'normal', mot: [], hoje: hoje, rp: rp, pv: pv };
    if (u90.length < 7 || !(hoje > 0)) {
      out.mot.push({ ok: true, t: 'Aprendendo: precisa de 7 dias de cotação (' + u90.length + ' até agora).' });
      return out;
    }
    var maisCaros = u90.filter(function (p) {
        return p.v > hoje + 0.5;
      }).length,
      pctB = maisCaros / u90.length,
      d3 = s.filter(function (p) {
        return Date.now() - p.ts <= 3 * DAY;
      }),
      min3 = Math.min.apply(
        null,
        d3.map(function (p) {
          return p.v;
        }).concat([hoje])
      ),
      disp = hoje / min3 - 1 > 0.01,
      v7 = fxVar7('usd'),
      u30 = s.filter(function (p) {
        return Date.now() - p.ts <= 30 * DAY;
      }),
      med30 = u30.reduce(function (a, p) {
        return a + p.v;
      }, 0) / Math.max(1, u30.length);
    if (disp) out.k = 'ja';
    else if (pctB >= 0.75 && pv.dir !== 'cai') out.k = 'bom';
    else if (pv.ok && pv.dir === 'cai' && pv.cert !== 'baixa') out.k = 'esp';
    out.pctB = pctB;
    var bom = out.k === 'bom' || out.k === 'ja';
    out.mot.push({ ok: pctB >= 0.5, t: pctB >= 0.5 ? 'Mais barato que <b>' + Math.round(pctB * 100) + '%</b> dos últimos 90 dias' : 'Mais caro que <b>' + Math.round((1 - pctB) * 100) + '%</b> dos últimos 90 dias' });
    if (disp) out.mot.push({ ok: false, t: 'Subiu <b>' + pcx(hoje / min3 - 1) + '</b> em 3 dias: está disparando' });
    else if (Math.abs(v7) < 0.002) out.mot.push({ ok: true, t: 'Parado nesta semana' });
    else out.mot.push({ ok: v7 < 0, t: (v7 < 0 ? 'Caiu ' : 'Subiu ') + '<b>' + pcx(Math.abs(v7)) + '</b> nesta semana' });
    if (pv.ok) out.mot.push({ ok: pv.dir !== 'sobe' || bom, t: 'Próximos 7 dias: <b>' + (pv.dir === 'sobe' ? 'deve subir' : pv.dir === 'cai' ? 'deve cair' : 'estável') + '</b> <span class="hint" style="display:inline;margin:0">(certeza ' + pv.cert + ')</span>' });
    if (rp.falta > 0.5 && med30 > 0) {
      var dif = Math.round(((med30 - hoje) * rp.falta) / 100) * 100;
      out.mot.push({ ok: dif >= 0, t: 'Trocando os ' + usd0(rp.falta) + ' hoje: <b>' + gs(Math.abs(dif)) + (dif >= 0 ? ' a menos' : ' a mais') + '</b> que na média do mês' });
    }
    return out;
  }
  function pcx(f) {
    return (Math.round(f * 1000) / 10).toFixed(1).replace('.', ',') + '%';
  }
  var FX_SELO = {
    bom: ['Bom momento', 'o', 'Por que é um bom momento'],
    normal: ['Normal', 'n', 'Por que está normal'],
    esp: ['Pode esperar', 'w', 'Por que dá para esperar'],
    ja: ['Troque hoje', 'b', 'Por que trocar hoje']
  };
  function fxValTxt(k, v) {
    return k === 'arb' ? 'R$ ' + nf(v, 'brl') : gsRaw(Math.round(v));
  }
  function fxVarHtml(k) {
    var v = fxVar7(k, lmOk() ? S.fxModo : '');
    if (Math.abs(v) < 0.002) return '<span class="fxVar">— estável</span>';
    var desce = v < 0,
      cls = k === 'brl' ? '' : desce ? ' ok' : ' up';
    return '<span class="fxVar' + cls + '">' + (desce ? '▼ ' : '▲ ') + pcx(Math.abs(v)) + ' <small>7 dias</small></span>';
  }
  // ---- Tela ----
  function fxAbaHtml() {
    // v452 (07/11): indicador "Cotação da casa online/offline" (bolinha verde/vermelha); tocar mostra o detalhe.
    var casa = lmOk(),
      ag = Date.now(),
      on = casa && ((S._lmVisto && ag - S._lmVisto < 5 * 60000) || ag - S.lm.ts < 12 * 3600000),
      det = casa ? 'La Moneda · Jebai · atualizado às ' + fh(S.lm.ts) + (on ? '' : ' de ' + fd(S.lm.ts)) + (S.lm.erro && !on ? ' · ' + S.lm.erro : '') : 'Ainda sem cotação da La Moneda. Por enquanto os valores são a média do mercado.' + (S._lmErr ? ' Motivo: ' + S._lmErr : ' (o app instalado no celular tenta a cada 1 minuto)'),
      hd = '<button type="button" class="fxSt ' + (on ? 'ok' : 'no') + '" data-act="fxSt" aria-label="Cotação da casa ' + (on ? 'online' : 'offline') + '">Cotação da casa<i></i></button>' + (S.fxStD ? '<div class="hint fxStD" style="margin:4px 0 0">' + esc(det) + (S._lmTxt && !on ? ' <button type="button" class="btn-sc" data-act="fxCopia" style="margin-top:8px">Copiar o texto da página</button>' + (S.fxCopiado ? '<div>' + esc(S.fxCopiado) + '</div>' : '') : '') + '</div>' : ''),
      h = '<div class="top fxTopo"><div><h1>Câmbio</h1><div class="crumb">' + hd + '</div></div>' + (casa ? '<button type="button" class="fxModo" data-act="fxModo" aria-label="Mostrando a ' + (S.fxModo === 'c' ? 'compra' : 'venda') + ' da casa. Tocar para ver a ' + (S.fxModo === 'c' ? 'venda' : 'compra') + '">' + (S.fxModo === 'c' ? 'Compra' : 'Venda') + FX_SETAS + '</button>' : '') + '</div>';
    h += '<section class="card fxTop">';
    ['usd', 'brl', 'arb'].forEach(function (k) {
      h += '<button type="button" class="fxLin" data-act="fjAbre" data-id="' + k + '"><span><span class="lbl">' + FX_NOME[k] + '</span><b>' + fxValTxt(k, fxTopVal(k)) + '</b></span>' + fxVarHtml(k) + '</button>';
    });
    h += '</section>';
    var vd = fxVeredito(),
      rp = vd.rp,
      se = FX_SELO[vd.k];
    h +=
      '<section class="card fxRepo"><button type="button" class="fxRepoT" data-act="fjAbre" data-id="repo"><span class="fxRH"><span class="lbl">Reposição</span><span class="fxSelo ' + se[1] + '">' + se[0] + ' ›</span></span>' +
      '<b class="fxFal">' + (rp.falta > 0.5 ? 'Faltam ' + usd0(rp.falta) : 'Reposição completa') + '</b>' +
      '<span class="fxBar"><i style="width:' + (rp.tot > 0 ? Math.round((rp.tem / rp.tot) * 100) : 100) + '%"></i></span>' +
      '<span class="hint" style="margin:0">' + usd0(rp.tem) + ' de ' + usd0(rp.tot) + '</span></button>' +
      '<button type="button" class="fxLk" data-act="fjAbre" data-id="troca">Registrar troca <span>›</span></button></section>';
    var n = (S.cambios || []).length,
      L = S.siteFx;
    h +=
      '<section class="card fxRows">' +
      '<button type="button" class="fxRow" data-act="fjAbre" data-id="trocas"><span>Últimas trocas</span><span class="hint">' + n + ' ›</span></button>' +
      '<button type="button" class="fxRow" data-act="fjAbre" data-id="site"><span>Preços no site<small>cotação da loja travada' + (L && L.ts ? ' desde ' + fd(L.ts) : '') + '</small></span><span class="hint">' + (L && L.usd ? gsRaw(L.usd) : '') + ' ›</span></button>' +
      '<button type="button" class="fxRow" data-act="fjAbre" data-id="prot"><span>Como o app te protege<small>colchão ' + pc(colchao().pct) + '</small></span><span class="hint">›</span></button>' +
      '</section>';
    if (S.fxJan) h += fjHtml(S.fxJan, vd);
    return h;
  }
  // ---- Janelas ----
  function fjHtml(id, vd) {
    var tit = '',
      sub = '',
      corpo = '';
    if (id === 'repo') {
      tit = FX_SELO[vd.k][2];
      sub = 'Dólar na La Moneda Jebai (venda)';
      corpo = fjPerHtml() + fjGraf('usd', true) + '<div class="fjMot">' + vd.mot.map(function (m) {
          return '<div class="' + (m.ok ? 'ok' : 'no') + '"><i>' + (m.ok ? '✓' : '!') + '</i><span>' + m.t + '</span></div>';
        }).join('') + '</div><div class="hint" style="margin:8px 0 0">Ninguém acerta sempre. O app olha o histórico da casa, a semana e a tendência.</div>';
    } else if (id === 'usd' || id === 'brl' || id === 'arb') {
      // v459: a janela segue o botão Venda/Compra; previsão de 7 dias em todas as moedas
      var md = lmOk() ? S.fxModo : '',
        lado = md === 'c' ? 'compra' : 'venda';
      tit = FX_NOME[id] + ' · ' + fxValTxt(id, md ? fxHoje(id, md) : fxHoje(id));
      sub = !md ? (id === 'usd' ? 'Guaranis por dólar' : id === 'brl' ? 'Guaranis por real' : 'Reais por dólar') + ' (média do mercado)' : id === 'usd' ? 'Guaranis por dólar (' + lado + ' da casa)' : id === 'brl' ? 'Guaranis por real (' + lado + ' da casa)' : 'Reais por dólar (arbitragem, ' + lado + ' da casa)';
      corpo = fjPerHtml() + fjGraf(id, true, md) + fjPrevTxt(id, md);
    } else if (id === 'trocas') {
      tit = 'Últimas trocas';
      corpo = (S.cambios || []).length ? trHistHtml().replace('<div class="lbl" style="margin-top:6px">Trocas feitas</div>', '') : '<div class="hint" style="margin:0">Nenhuma troca registrada.</div>';
    } else if (id === 'site') {
      tit = 'Preços no site';
      corpo = siteFxHtml();
    } else if (id === 'prot') {
      tit = 'Como o app te protege';
      corpo = fjProtHtml();
    } else if (id === 'troca') {
      tit = 'Registrar troca';
      corpo = trGavetaHtml();
    }
    return (
      '<div class="fjBk' + (S._fjAnim ? ' in' : '') + '" data-act="fjFecha"></div><div class="fjJn' + (S._fjAnim ? ' in' : '') + '" role="dialog" aria-label="' + esc(tit.replace(/<[^>]+>/g, '')) + '">' +
      '<div class="fjPuxa" aria-hidden="true"></div><div class="fjHd"><div><b>' + tit + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div><button type="button" class="fjX" data-act="fjFecha" aria-label="Fechar">×</button></div>' +
      '<div class="fjCorpo">' + corpo + '</div></div>'
    );
  }
  function fjPerHtml() {
    return '<div class="trk fjPer"><span class="trkTh"></span>' + [[30, '30 dias'], [90, '90 dias'], [365, '1 ano']].map(function (o) {
        return '<button type="button" class="trkB" data-m="' + o[0] + '" data-act="fjPer" data-id="' + o[0] + '">' + o[1] + '</button>';
      }).join('') + '</div>';
  }
  // Gráfico: linha da casa, média, faixa barata (os 25% mais baratos do período), hoje e previsão pontilhada (só dólar).
  function fjGraf(k, prev, m) {
    var per = S.fxPer || 90,
      s = fxSerie(k, m).filter(function (p) {
        return Date.now() - p.ts <= per * DAY;
      }),
      hoje = fxHoje(k, m);
    if (hoje > 0 && (!s.length || Date.now() - s[s.length - 1].ts > 3600000)) s.push({ ts: Date.now(), v: hoje });
    if (s.length < 2) return '<div class="hint" style="margin:12px 0">Ainda sem histórico suficiente para o gráfico.</div>';
    var vals = s.map(function (p) {
        return p.v;
      }),
      pv = prev ? fxPrevisao(k, m) : { ok: false },
      fim = pv.ok ? hoje * (1 + pv.pct) : null,
      mn = Math.min.apply(null, vals.concat(fim ? [fim] : [])),
      mx = Math.max.apply(null, vals.concat(fim ? [fim] : [])),
      pad = (mx - mn) * 0.12 || mx * 0.01,
      W = 320,
      H = 150,
      xr = pv.ok ? 250 : 310,
      t0 = s[0].ts,
      t1 = s[s.length - 1].ts,
      X = function (ts) {
        return 4 + ((ts - t0) / Math.max(1, t1 - t0)) * (xr - 4);
      },
      Y = function (v) {
        return 12 + ((mx + pad - v) / (mx - mn + 2 * pad)) * (H - 36);
      },
      ord = vals.slice().sort(function (a, b) {
        return a - b;
      }),
      q25 = ord[Math.floor(ord.length * 0.25)],
      med = vals.reduce(function (a, b) {
        return a + b;
      }, 0) / vals.length,
      pts = s.map(function (p) {
        return X(p.ts).toFixed(1) + ',' + Y(p.v).toFixed(1);
      }).join(' '),
      f = function (v) {
        return k === 'arb' ? nf(v, 'brl') : dots(Math.round(v));
      },
      lab = function (ts) {
        var d = new Date(ts);
        return per > 60 ? MESES[d.getMonth()] : d.getDate() + '/' + (d.getMonth() + 1);
      },
      g = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="fjG" role="img" aria-label="Gráfico de ' + FX_NOME[k] + '">';
    g += '<rect x="0" y="' + Y(q25).toFixed(1) + '" width="' + xr + '" height="' + Math.max(0, H - 24 - Y(q25)).toFixed(1) + '" class="fjFx"/>';
    g += '<text x="6" y="' + (H - 28) + '" font-size="10" class="fjFxT">faixa barata</text>';
    g += '<line x1="0" x2="' + xr + '" y1="' + Y(med).toFixed(1) + '" y2="' + Y(med).toFixed(1) + '" class="fjMd"/><text x="' + (xr - 4) + '" y="' + (Y(med) - 5).toFixed(1) + '" font-size="10" text-anchor="end" class="fjTx">média ' + f(med) + '</text>';
    g += '<polyline points="' + pts + '" class="fjLn"/>';
    if (pv.ok) {
      g += '<rect x="' + xr + '" y="8" width="' + (W - xr) + '" height="' + (H - 32) + '" class="fjPv"/><text x="' + ((xr + W) / 2) + '" y="20" font-size="10" text-anchor="middle" class="fjTx">7 dias</text>';
      g += '<line x1="' + xr + '" y1="' + Y(hoje).toFixed(1) + '" x2="' + (W - 6) + '" y2="' + Y(fim).toFixed(1) + '" class="fjLn fjPd"/>';
    }
    var hx = X(t1),
      hy = Y(hoje);
    g += '<circle cx="' + hx.toFixed(1) + '" cy="' + hy.toFixed(1) + '" r="5" class="fjPt"/><text x="' + (hx - 8).toFixed(1) + '" y="' + (Math.abs(Y(med) - hy) < 16 || hy < 26 ? hy + 18 : hy - 9).toFixed(1) + '" font-size="11" font-weight="700" text-anchor="end" class="fjTxB">hoje ' + f(hoje) + '</text>';
    g += '<text x="2" y="' + (H - 6) + '" font-size="10" class="fjTx">' + lab(t0) + '</text><text x="' + (xr / 2) + '" y="' + (H - 6) + '" font-size="10" text-anchor="middle" class="fjTx">' + lab((t0 + t1) / 2) + '</text><text x="' + xr + '" y="' + (H - 6) + '" font-size="10" text-anchor="middle" class="fjTx">' + lab(t1) + '</text>';
    return g + '</svg>';
  }
  // v459: frase da previsão de 7 dias (cor pelo interesse da loja: dólar barato é bom; real caro é bom)
  function fjPrevTxt(k, m) {
    var pv = fxPrevisao(k, m);
    if (!pv.ok) return '<div class="hint" style="margin:8px 0 0">Previsão: ainda sem histórico suficiente.</div>';
    var fim = pv.ult * (1 + pv.pct),
      f = function (v) {
        return k === 'arb' ? 'R$ ' + nf(v, 'brl') : gsRaw(Math.round(v));
      },
      bom = pv.dir === 'estavel' || (k === 'brl' ? pv.dir === 'sobe' : pv.dir === 'cai');
    return (
      '<div class="fjMot"><div class="' + (bom ? 'ok' : 'no') + '"><i>' + (pv.dir === 'sobe' ? '▲' : pv.dir === 'cai' ? '▼' : '—') + '</i><span>Próximos 7 dias: <b>' + (pv.dir === 'sobe' ? 'deve subir' : pv.dir === 'cai' ? 'deve cair' : 'estável') + '</b>' + (pv.dir === 'estavel' ? '' : ' (por volta de ' + f(fim) + ')') + ' <span class="hint" style="display:inline;margin:0">· certeza ' + pv.cert + '</span></span></div></div>' +
      '<div class="hint" style="margin:6px 0 0">Ninguém acerta sempre. É uma estimativa pelo histórico da casa.</div>'
    );
  }
  function fjProtHtml() {
    var c = colchao(),
      casa = lmOk() ? S.lm.usd.v : fxHoje('usd'),
      loja = fxUsdLoja(),
      L = S.siteFx,
      lt = lotesHist().slice(-6),
      mxl = Math.max.apply(
        null,
        lt.map(function (l) {
          return l.usd;
        }).concat([0.01])
      ),
      ul = lt.length > 1 ? lt[lt.length - 1].usd / lt[lt.length - 2].usd - 1 : 0;
    return (
      '<div class="fjB"><span class="lbl">Cotação da loja</span><div>Casa <b>' + dots(Math.round(casa)) + '</b> → loja <b>' + dots(loja) + '</b> <span class="hint" style="display:inline;margin:0">(+1%, de 50 em 50)</span></div><div class="hint" style="margin:0">Seus preços usam a cotação da loja: se a casa subir até 1%, você não perde.</div></div>' +
      '<div class="fjB"><span class="lbl fjBl">Colchão de cada venda <b>' + pc(c.pct) + '</b></span><span class="fxBar"><i style="width:' + Math.round(((c.pct - 0.05) / 0.2) * 100) + '%;background:var(--accent)"></i></span><div class="hint fjMm" style="margin:0"><span>mín 5%</span><span>máx 25%</span></div>' +
      '<div class="hint" style="margin:0">Pior alta do dólar em ' + c.janela + ' dias (+' + pc(c.fx) + ') e alta do custo entre lotes (+' + pc(c.cost) + '). Separado em cada venda para repor mais caro se precisar.</div></div>' +
      (lt.length
        ? '<div class="fjB"><span class="lbl">Custo por lote</span><div class="fjLotes">' + lt.map(function (l, i) {
            return '<i title="' + esc(l.txt || '') + '" style="height:' + Math.max(12, Math.round((l.usd / mxl) * 100)) + '%' + (i === lt.length - 1 ? ';background:var(--accent)' : '') + '"></i>';
          }).join('') + '</div><div class="hint" style="margin:0">' + (lt.length > 1 ? 'Último lote saiu ' + pc(Math.abs(ul)) + (ul >= 0 ? ' mais caro' : ' mais barato') + ' em dólar que o anterior.' : 'Um lote registrado até agora.') + '</div></div>'
        : '') +
      '<div class="fjB"><span class="lbl">Preços do site</span><div class="hint" style="margin:0">Cotação da loja + 2% de folga' + (L && L.usd ? ' (' + gsRaw(L.usd) + ')' : '') + ', travada: só muda quando a loja passar dela. Se o dólar cair muito, o app faz ofertas no site.</div></div>'
    );
  }
  // "Registrar troca": sugestão de hoje (já preenchida) + outra troca.
  function trGavetaHtml() {
    var t = S.tr,
      ag = trocarAgoraHtml();
    return (
      (ag ? '<div class="lbl" style="margin:0 0 6px">Sugestão de hoje</div>' + ag + '<div class="lbl" style="margin:14px 0 6px">Outra troca</div>' : '') +
      '<div class="sel" style="flex-wrap:wrap">' + trSel('trDe', t.de) + '<button class="btn-sc" data-act="trflip" aria-label="Inverter as moedas">⇄ Inverter</button>' + trSel('trPara', t.para) + '</div>' +
      '<div class="sel" style="flex-wrap:wrap"><div style="flex:1 1 140px"><div class="lbl">Você troca (' + MN[t.de] + ')</div><input class="in" id="trV" inputmode="decimal" data-in="trV" value="' + esc(t.v) + '" aria-label="Valor a trocar"></div>' +
      '<div style="flex:1 1 140px"><div class="lbl">Você recebe (' + MN[t.para] + ')</div><input class="in" id="trRec" inputmode="decimal" data-in="trRec" value="' + esc(t.rec) + '" aria-label="Valor recebido na troca"></div></div>' +
      '<div class="hint" id="trPrev" role="status" style="margin:0"></div><button class="go" data-act="trocar">Registrar troca</button>'
    );
  }
  ACT.fjAbre = function (id) {
    S.fxJan = id;
    S._fjAnim = true;
    renderFx();
    S._fjAnim = false;
  };
  ACT.fjFecha = function () {
    var j = document.querySelector('#v-fx .fjJn'),
      b = document.querySelector('#v-fx .fjBk');
    S.fxJan = '';
    if (j && !REDUCED) {
      j.classList.add('sai');
      if (b) b.classList.add('sai');
      setTimeout(renderFx, 220);
    } else renderFx();
  };
  ACT.fjPer = function (d) {
    S.fxPer = +d || 90;
    renderFx();
  };
  // Arrastar a janela para baixo fecha.
  function fjGestos() {
    var j = document.querySelector('#v-fx .fjJn');
    if (!j) return;
    var y0 = null,
      dy = 0;
    j.addEventListener('touchstart', function (e) {
      if (j.scrollTop > 0) return;
      y0 = e.touches[0].clientY;
      dy = 0;
    }, { passive: true });
    j.addEventListener('touchmove', function (e) {
      if (y0 == null) return;
      dy = Math.max(0, e.touches[0].clientY - y0);
      j.style.transform = dy ? 'translateY(' + dy + 'px)' : '';
    }, { passive: true });
    j.addEventListener('touchend', function () {
      if (y0 == null) return;
      y0 = null;
      if (dy > 90) ACT.fjFecha();
      else j.style.transform = '';
    });
  }
  // Sino: só quando vale agir (Bom momento ou Troque hoje, faltando reposição), 1 vez por dia.
  function fxAvisa() {
    var v = fxVeredito();
    if (!(v.rp.falta > 0.5) || (v.k !== 'bom' && v.k !== 'ja')) return;
    var d = new Date().toDateString();
    if (!S.fxAvisos) S.fxAvisos = {};
    if (S.fxAvisos[v.k] === d) return;
    S.fxAvisos[v.k] = d;
    (S.notifs = S.notifs || []).unshift({ ts: Date.now(), lida: false, t: v.k === 'ja' ? 'Dólar disparando' : 'Bom momento para trocar dólar', s: (v.k === 'ja' ? 'Troque hoje: ' : 'Faltam ') + usd0(v.rp.falta) + ' para a reposição.' });
    saveSoon();
    render();
  }
  if (!/#test/.test(location.hash)) {
    setTimeout(fxAvisa, 10000);
    setInterval(fxAvisa, 15 * 60000);
  }
