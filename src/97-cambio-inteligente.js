  // ===== Câmbio inteligente (v425, aprovado 04/11/2026) =====
  // Previsão do dólar para 7 dias (cai / estável / sobe) com motivos e certeza, a partir do histórico
  // da La Moneda Jebai (S.lm.hist, quando o celular já buscou) ou da cotação de mercado (S.fxHist).
  // Compra em dólar marcada (US$ + data) → plano de troca aos poucos, acelera se o dólar dispara.
  // Ninguém acerta sempre: trocar aos poucos protege dos dois lados.
  S.trocaPlan = []; // [{id, usd, data, ts, trocas:[{ts, usd, rate}]}]
  var CXI = { usd: '', data: '' };
  // Série diária (último valor de cada dia) do dólar em guaranis.
  function cxSerie() {
    var dia = {},
      put = function (ts, v) {
        if (!(v > 0)) return;
        var d = new Date(ts),
          k = d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
        if (!dia[k] || dia[k].ts <= ts) dia[k] = { ts: ts, v: v };
      };
    var lmH = (S.lm && S.lm.hist) || [];
    if (lmH.length >= 5) lmH.forEach(function (x) {
      put(x[0], x[2]);
    });
    else (S.fxHist || []).forEach(function (p) {
      put(p.ts, p.pyg);
    });
    return Object.keys(dia)
      .sort()
      .map(function (k) {
        return dia[k];
      })
      .filter(function (p) {
        return Date.now() - p.ts <= 120 * DAY;
      });
  }
  // Reta pelos pontos (x em dias): inclinação, r².
  function cxReta(ps) {
    var n = ps.length;
    if (n < 3) return { b: 0, r2: 0 };
    var x0 = ps[0].ts,
      sx = 0,
      sy = 0,
      sxx = 0,
      sxy = 0,
      syy = 0;
    ps.forEach(function (p) {
      var x = (p.ts - x0) / DAY,
        y = p.v;
      sx += x;
      sy += y;
      sxx += x * x;
      sxy += x * y;
      syy += y * y;
    });
    var den = n * sxx - sx * sx,
      b = den ? (n * sxy - sx * sy) / den : 0,
      vy = n * syy - sy * sy,
      r2 = den && vy > 0 ? Math.pow(n * sxy - sx * sy, 2) / (den * vy) : 0;
    return { b: b, r2: r2 };
  }
  function cxPrevisao() {
    var s = cxSerie();
    if (s.length < 7) return { ok: false, dias: s.length };
    var ult = s[s.length - 1].v,
      u14 = s.filter(function (p) {
        return Date.now() - p.ts <= 14 * DAY;
      }),
      reta = cxReta(u14.length >= 5 ? u14 : s.slice(-14)),
      tend = (reta.b * 7) / ult, // % em 7 dias pela reta de 2 semanas
      u3 = s.slice(-3),
      med14 = u14.reduce(function (a, p) {
        return a + p.v;
      }, 0) / Math.max(1, u14.length),
      mom = med14 > 0 ? u3[u3.length - 1].v / med14 - 1 : 0, // onde está × média de 2 semanas
      motivos = [],
      score = tend * 0.7 + mom * 0.3;
    // época do ano: mesmo período do ano passado (quando já existe histórico)
    var ano = (S.fxHist || []).filter(function (p) {
        var dd = (Date.now() - 365 * DAY - p.ts) / DAY;
        return dd >= -7 && dd <= 0;
      }),
      saz = 0;
    if (ano.length >= 2) {
      saz = ano[ano.length - 1].pyg / ano[0].pyg - 1;
      score += saz * 0.3;
      if (Math.abs(saz) > 0.003) motivos.push((saz > 0 ? 'No ano passado subiu nesta época' : 'No ano passado caiu nesta época'));
    }
    // o real: real fraco (mais reais por dólar) = menos dólar entrando na fronteira
    var bh = (S.fxHist || []).filter(function (p) {
        return p.brl > 0 && Date.now() - p.ts <= 14 * DAY;
      }),
      rv = bh.length >= 2 ? bh[bh.length - 1].brl / bh[0].brl - 1 : 0;
    if (Math.abs(rv) > 0.01) {
      score += rv * 0.15;
      motivos.unshift(rv > 0 ? 'Real enfraquecendo' : 'Real firme');
    }
    if (Math.abs(tend) > 0.002) motivos.unshift(tend > 0 ? 'Subindo há 2 semanas' : 'Caindo há 2 semanas');
    else motivos.unshift('Parado há 2 semanas');
    if (mom > 0.005) motivos.push('Acima da média de 2 semanas');
    else if (mom < -0.005) motivos.push('Abaixo da média de 2 semanas');
    var dir = score > 0.004 ? 'sobe' : score < -0.004 ? 'cai' : 'estavel',
      cert = s.length >= 30 && reta.r2 >= 0.6 ? 'alta' : s.length >= 14 && reta.r2 >= 0.3 ? 'média' : 'baixa';
    // disparando: subiu mais de 1% em 3 dias
    var d3 = s.filter(function (p) {
        return Date.now() - p.ts <= 3 * DAY;
      }),
      min3 = d3.length
        ? Math.min.apply(
            null,
            d3.map(function (p) {
              return p.v;
            })
          )
        : ult,
      disp = ult / min3 - 1 > 0.01,
      min30 = Math.min.apply(
        null,
        s
          .filter(function (p) {
            return Date.now() - p.ts <= 30 * DAY;
          })
          .map(function (p) {
            return p.v;
          })
      ),
      barato = ult <= min30 * 1.002 && dir !== 'cai';
    return { ok: true, dir: dir, pct: score, cert: cert, motivos: motivos.slice(0, 3), ult: ult, disp: disp, barato: barato, fonte: (S.lm && S.lm.hist && S.lm.hist.length >= 5) ? 'La Moneda Jebai' : 'mercado' };
  }
  // Cotação para trocar agora (venda da casa ou mercado).
  function cxRate() {
    return lmOk() ? S.lm.usd.v : ratePyg('usd');
  }
  // Plano de troca de uma compra: partes com data, já descontado o que foi trocado.
  function cxPassos(c, pv) {
    var tro = (c.trocas || []).reduce(function (a, t) {
        return a + t.usd;
      }, 0),
      falta = Math.max(0, c.usd - tro),
      hoje = new Date(),
      d0 = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime(),
      dias = Math.max(0, Math.round((c.data - d0) / DAY)),
      fr = pv && pv.ok && (pv.dir === 'sobe' || pv.disp) ? [0.5, 0.3, 0.2] : pv && pv.ok && pv.dir === 'cai' ? [0.25, 0.35, 0.4] : [0.34, 0.33, 0.33];
    if (falta <= 0) return { falta: 0, tro: tro, passos: [] };
    if (dias <= 1) return { falta: falta, tro: tro, passos: [{ ate: d0, usd: falta }] };
    var mid = d0 + Math.round(dias / 2) * DAY,
      fim = c.data - DAY,
      a = Math.ceil((falta * fr[0]) / 50) * 50,
      b = Math.ceil((falta * fr[1]) / 50) * 50,
      passos = [{ ate: d0, usd: Math.min(falta, a) }];
    if (falta - a > 0) passos.push({ ate: mid, usd: Math.min(falta - a, b) });
    if (falta - a - b > 0) passos.push({ ate: Math.max(fim, mid), usd: falta - a - b });
    return { falta: falta, tro: tro, passos: passos };
  }
  function cxDiaTxt(ts) {
    var d0 = new Date();
    d0.setHours(0, 0, 0, 0);
    var n = Math.round((ts - d0.getTime()) / DAY);
    if (n <= 0) return 'Hoje';
    if (n === 1) return 'Amanhã';
    var d = new Date(ts);
    return 'Até ' + d.getDate() + '/' + (d.getMonth() + 1);
  }
  function cxIntelHtml() {
    var pv = cxPrevisao(),
      h = '<section class="card col cxCard"><div class="paMt"><h2 style="margin:0;font-size:16px">Dólar nos próximos 7 dias</h2>' + (pv.ok ? '<span class="hint" style="margin:0">certeza ' + pv.cert + '</span>' : '') + '</div>';
    if (!pv.ok) {
      h += '<div class="hint" style="margin:0">Aprendendo: precisa de 7 dias de cotação (' + pv.dias + ' até agora).</div>';
    } else {
      var t = { sobe: ['Deve subir', 'var(--warn)', '↗'], cai: ['Deve cair', 'var(--ok)', '↘'], estavel: ['Estável', 'var(--fg)', '→'] }[pv.dir];
      h +=
        '<div class="cxPrev"><span class="cxSeta" style="color:' + t[1] + '">' + t[2] + '</span><div><b style="color:' + t[1] + '">' + t[0] + '</b>' +
        (pv.dir !== 'estavel' ? ' <span class="hint" style="display:inline;margin:0">~' + (Math.abs(pv.pct) * 100).toFixed(1).replace('.', ',') + '%</span>' : '') +
        '<div class="hint" style="margin:0">hoje ' + gsRaw(Math.round(pv.ult)) + ' · ' + pv.fonte + '</div></div></div>' +
        '<div class="cxChips">' + pv.motivos.map(function (m) {
          return '<span class="chip">' + esc(m) + '</span>';
        }).join('') + '</div>' +
        (pv.disp ? '<div class="hint" style="margin:0;color:var(--warn)">Disparando: subiu mais de 1% em 3 dias.</div>' : pv.barato ? '<div class="hint" style="margin:0;color:var(--ok)">Dólar no mais barato do mês: bom momento para trocar.</div>' : '') +
        '<div class="hint" style="margin:0">Ninguém acerta sempre: trocar aos poucos protege dos dois lados.</div>';
    }
    h += '</section>';
    // compras marcadas
    var cs = (S.trocaPlan || []).filter(function (c) {
      return cxPassos(c, pv).falta > 0 || Date.now() - c.data < 2 * DAY;
    });
    h += '<section class="card col"><h2 style="margin:0;font-size:16px">Plano de troca</h2>';
    if (!cs.length) h += '<div class="hint" style="margin:0">Vai comprar mercadoria em dólar? Marque o valor e a data: o app diz quanto trocar e quando.</div>';
    cs.forEach(function (c) {
      var p = cxPassos(c, pv),
        r = cxRate(),
        d = new Date(c.data);
      h += '<div class="cxCompra"><div class="paMt"><b>US$ ' + nf(c.usd, 'usd') + ' até ' + d.getDate() + '/' + (d.getMonth() + 1) + '</b><button type="button" class="obX" data-act="cxDel" data-id="' + c.id + '" aria-label="Remover compra">×</button></div>';
      if (!p.falta) h += '<div class="hint" style="margin:0;color:var(--ok)">Tudo trocado.</div>';
      p.passos.forEach(function (s, i) {
        h +=
          '<div class="cxPasso"><span>' + cxDiaTxt(s.ate) + '<small>≈ ' + gs(Math.ceil((s.usd * r) / 1000) * 1000) + '</small></span><b>US$ ' + nf(s.usd, 'usd') + '</b>' +
          (i === 0 ? '<button type="button" class="cSugB" data-act="cxTroquei" data-id="' + c.id + '">Troquei</button>' : '<i></i>') + '</div>';
      });
      if (p.falta > 0) {
        var sob = Math.max(0.01, pv.ok && pv.pct > 0 ? pv.pct : 0.01);
        h += '<div class="hint" style="margin:0">Se o dólar subir ' + (sob * 100).toFixed(1).replace('.', ',') + '% e trocar tudo no dia: <b>+' + gs(Math.ceil((p.falta * r * sob) / 1000) * 1000) + '</b></div>';
      }
      if (p.tro > 0) h += '<div class="hint" style="margin:0">Já trocado: US$ ' + nf(p.tro, 'usd') + '</div>';
      h += '</div>';
    });
    var dmin = new Date(Date.now() + DAY),
      vmin = dmin.getFullYear() + '-' + ('0' + (dmin.getMonth() + 1)).slice(-2) + '-' + ('0' + dmin.getDate()).slice(-2);
    h +=
      '<div class="nvg2"><div><div class="lbl">Compra em dólar</div><input class="in" id="cxUsd" inputmode="decimal" placeholder="US$" autocomplete="off" value="' + esc(CXI.usd) + '"></div>' +
      '<div><div class="lbl">Paga em</div><input class="in" id="cxData" type="date" min="' + vmin + '" value="' + esc(CXI.data) + '"></div></div>' +
      '<button type="button" class="obNovo" data-act="cxMarca">Marcar compra</button></section>';
    return h;
  }
  ACT.cxMarca = function () {
    CXI.usd = $('cxUsd').value;
    CXI.data = $('cxData').value;
    var u = parseFloat(String(CXI.usd).replace(/\./g, '').replace(',', '.')) || 0,
      p = String(CXI.data).split('-');
    if (!(u > 0)) {
      popErr('Informe o valor em dólar.');
      guiaMarca('cxUsd');
      return;
    }
    if (p.length !== 3) {
      popErr('Informe a data do pagamento.');
      guiaMarca('cxData');
      return;
    }
    S.trocaPlan.push({ id: 'c' + Date.now().toString(36), usd: u, data: new Date(+p[0], +p[1] - 1, +p[2]).getTime(), ts: Date.now(), trocas: [] });
    CXI = { usd: '', data: '' };
    vibrar(20);
    lfToast('✓ Compra marcada');
    saveSoon();
    render();
  };
  ACT.cxTroquei = function (id) {
    var c = S.trocaPlan.filter(function (x) {
      return x.id === id;
    })[0];
    if (!c) return;
    var p = cxPassos(c, cxPrevisao());
    if (!p.passos.length) return;
    var t = { ts: Date.now(), usd: p.passos[0].usd, rate: cxRate() };
    c.trocas = (c.trocas || []).concat([t]);
    saveSoon();
    render();
    lfDesfazer('Troca marcada · US$ ' + nf(t.usd, 'usd'), function () {
      c.trocas = c.trocas.filter(function (x) {
        return x !== t;
      });
      saveSoon();
      render();
    }, 5000);
  };
  ACT.cxDel = function (id) {
    var i = S.trocaPlan.findIndex(function (x) {
      return x.id === id;
    });
    if (i < 0) return;
    var c = S.trocaPlan.splice(i, 1)[0];
    saveSoon();
    render();
    lfDesfazer('Compra removida', function () {
      S.trocaPlan.splice(i, 0, c);
      saveSoon();
      render();
    }, 5000);
  };
  // Avisos do sino: só quando vale agir (uma vez por dia cada).
  function cxAvisos() {
    var pv = cxPrevisao(),
      out = [];
    if (!pv.ok) return out;
    var pend = (S.trocaPlan || []).some(function (c) {
      return cxPassos(c, pv).falta > 0;
    });
    if (pv.disp) out.push({ k: 'cxDisp', t: 'Dólar disparando', d: 'Subiu mais de 1% em 3 dias' + (pend ? ': adiante as trocas do plano.' : '.') });
    else if (pv.barato && pend) out.push({ k: 'cxBarato', t: 'Dólar barato', d: 'No menor valor do mês: bom momento para trocar o plano.' });
    return out;
  }
  S.cxAv = {};
  function cxAvisa() {
    var d = new Date().toDateString(),
      novo = false;
    if (!S.cxAv) S.cxAv = {};
    cxAvisos().forEach(function (a) {
      if (S.cxAv[a.k] === d) return;
      S.cxAv[a.k] = d;
      (S.notifs = S.notifs || []).unshift({ ts: Date.now(), lida: false, t: a.t, s: a.d });
      novo = true;
    });
    if (novo) {
      saveSoon();
      render();
    }
  }
  if (!/#test/.test(location.hash)) {
    setTimeout(cxAvisa, 8000);
    setInterval(cxAvisa, 30 * 60000);
  }
