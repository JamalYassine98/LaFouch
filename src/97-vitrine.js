  // ===== Vitrine da semana (v428, aprovado 04/11/2026) =====
  // A vitrine física da loja: o app sugere o que ENTRA, o que SAI e o que FICA. O dono informa quantos lugares
  // tem (perguntado no próprio cartão), pode FIXAR peças (📌 nunca saem) e toca "Troquei a vitrine".
  // Aprende comparando a venda de cada peça quando estava exposta e quando não estava. Aviso no sino na segunda.
  S.vit = { lug: 0, fix: {}, atual: [], ts: 0, hist: [], avSeg: '' };
  function vitPecas() {
    var vis = {},
      out = [];
    S.items.forEach(function (i) {
      if (vis[i.ref] || i.bulk || isSimple(i.tipo) || i.tipo === 'pre') return;
      vis[i.ref] = 1;
      var st = S.items.reduce(function (a, x) {
        return a + (x.ref === i.ref && x.qty > 0 ? x.qty : 0);
      }, 0);
      if (st > 0) out.push({ ref: i.ref, tipo: i.tipo, stock: st });
    });
    return out;
  }
  // Vendas por dia exposta × não exposta (pelo histórico das trocas de vitrine).
  function vitAprende(ref) {
    var H = (S.vit.hist || []).slice().sort(function (a, b) {
      return a.ts - b.ts;
    });
    if (!H.length) return null;
    var exp = { d: 0, v: 0 },
      nao = { d: 0, v: 0 },
      ini = H[0].ts,
      now = Date.now();
    for (var k = 0; k < H.length; k++) {
      var a = H[k].ts,
        b = k + 1 < H.length ? H[k + 1].ts : now,
        on = H[k].refs.indexOf(ref) >= 0,
        alvo = on ? exp : nao;
      alvo.d += (b - a) / DAY;
      S.sales.forEach(function (s) {
        if (!s.estorno && s.ref === ref && s.ts >= a && s.ts < b) alvo.v += s.qty;
      });
    }
    S.sales.forEach(function (s) {
      if (!s.estorno && s.ref === ref && s.ts < ini && now - s.ts <= 90 * DAY) nao.v += s.qty;
    });
    nao.d += Math.max(0, Math.min(90, (ini - (now - 90 * DAY)) / DAY));
    if (exp.d < 7 || nao.d < 7) return null;
    return { exp: exp.v / exp.d, nao: nao.v / nao.d };
  }
  function vitNota(p) {
    var now = Date.now(),
      dPar = paParado(p.ref),
      ent = (now - paPrimEntrada(p.ref)) / DAY,
      of = S.pprice && S.pprice[p.ref] && S.pprice[p.ref].ant > S.pprice[p.ref].novo,
      fE = sazonFator(p.tipo, new Date(now + 10 * DAY).getMonth()),
      n = 0,
      mot = [];
    if (ent <= 30) {
      n += 3;
      mot.push('novidade');
    }
    if (of) {
      n += 2;
      mot.push('oferta');
    }
    if (dPar >= 45) {
      n += Math.min(3, dPar / 30);
      mot.push(Math.round(dPar) + ' dias parada');
    }
    if (fE >= 1.15) {
      n += 1.5;
      mot.push('época');
    }
    if (p.stock >= 3) n += 0.5;
    var ap = vitAprende(p.ref);
    if (ap && ap.exp > ap.nao * 1.2) {
      n += 1.5;
      mot.push('vende mais exposta');
    } else if (ap && ap.exp < ap.nao * 0.8) n -= 1;
    return { n: n, mot: mot };
  }
  function vitSugestao() {
    var L = S.vit.lug || 0,
      ps = vitPecas(),
      ex = {},
      fix = Object.keys(S.vit.fix || {}).filter(function (r) {
        return ps.some(function (p) {
          return p.ref === r;
        });
      });
    ps.forEach(function (p) {
      ex[p.ref] = p;
      p.nt = vitNota(p);
    });
    var resto = ps
      .filter(function (p) {
        return fix.indexOf(p.ref) < 0;
      })
      .sort(function (a, b) {
        return b.nt.n - a.nt.n;
      });
    var sug = fix.slice(0, L);
    resto.forEach(function (p) {
      if (sug.length < L) sug.push(p.ref);
    });
    var atual = (S.vit.atual || []).filter(function (r) {
      return ex[r];
    });
    return {
      sug: sug,
      ex: ex,
      entram: sug.filter(function (r) {
        return atual.indexOf(r) < 0;
      }),
      saem: atual.filter(function (r) {
        return sug.indexOf(r) < 0;
      }),
      ficam: sug.filter(function (r) {
        return atual.indexOf(r) >= 0;
      }),
      semEst: (S.vit.atual || []).filter(function (r) {
        return !ex[r];
      })
    };
  }
  function vitChip(r, V, extra) {
    var p = V.ex[r],
      f = S.vit.fix && S.vit.fix[r];
    return (
      '<div class="sl vtL"><span class="vtI">' + (photoOf(r) ? '<img src="' + esc(photoOf(r)) + '" alt="">' : '') + '</span><span style="flex:1;min-width:0">' + esc(pn(r)) + '<small>' + esc(extra || (p && p.nt.mot.join(' · ')) || '') + '</small></span>' +
      '<button type="button" class="mini vtFx' + (f ? ' on' : '') + '" data-act="vitFixa" data-id="' + esc(r) + '" aria-label="' + (f ? 'Desafixar' : 'Fixar') + '">📌</button></div>'
    );
  }
  function vitHtml() {
    var h = '<section class="card col vtCard" id="vtCard"><div>';
    if (!(S.vit.lug > 0))
      return (
        h +
        '<div class="hint" style="margin:0">Para sugerir o que entra e o que sai, preciso saber o tamanho da vitrine.</div></div>' +
        '<label class="hint" style="margin:0" for="vtLug">Quantos lugares (peças) cabem na vitrine?</label><div style="display:flex;gap:8px"><input class="in" id="vtLug" type="number" inputmode="numeric" min="1" max="200" placeholder="ex.: 12" style="flex:1"><button type="button" class="go" data-act="vitLug">Salvar</button></div></section>'
      );
    var V = vitSugestao(),
      quando = S.vit.ts ? 'trocada em ' + new Date(S.vit.ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : 'ainda não registrada';
    h += '<div class="hint" style="margin:0">' + S.vit.lug + ' lugares · ' + quando + ' · <button type="button" class="lnk" data-act="vitLugMuda">mudar lugares</button></div></div>';
    if (!S.vit.atual.length) {
      h += '<div class="lcSec" style="color:var(--accent-fg)">Sugestão · ' + V.sug.length + '</div><div class="split">' + V.sug.map(function (r) { return vitChip(r, V); }).join('') + '</div>';
    } else {
      if (!V.entram.length && !V.saem.length) h += '<div class="note n-ok">A vitrine está boa. Nada para trocar.</div>';
      if (V.entram.length) h += '<div class="lcSec" style="color:var(--ok)">Entram · ' + V.entram.length + '</div><div class="split">' + V.entram.map(function (r) { return vitChip(r, V); }).join('') + '</div>';
      if (V.saem.length || V.semEst.length)
        h += '<div class="lcSec" style="color:var(--warn)">Saem · ' + (V.saem.length + V.semEst.length) + '</div><div class="split">' + V.saem.map(function (r) { return vitChip(r, V, 'abre lugar para outra'); }).concat(V.semEst.map(function (r) { return '<div class="sl vtL"><span style="flex:1">' + esc(pn(r)) + '<small>sem estoque</small></span></div>'; })).join('') + '</div>';
      if (V.ficam.length) h += '<details class="vtFi"><summary class="lcSec" style="color:var(--sub)">Ficam · ' + V.ficam.length + '</summary><div class="split">' + V.ficam.map(function (r) { return vitChip(r, V); }).join('') + '</div></details>';
    }
    var apr = V.sug
      .map(function (r) {
        var a = vitAprende(r);
        return a && a.nao > 0 ? { r: r, x: a.exp / a.nao } : null;
      })
      .filter(Boolean)
      .sort(function (a, b) {
        return b.x - a.x;
      })[0];
    if (apr && apr.x >= 1.2) h += '<div class="hint" style="margin:0">Aprendi: ' + esc(pn(apr.r)) + ' vende ' + String(Math.round(apr.x * 10) / 10).replace('.', ',') + '× mais quando está na vitrine.</div>';
    if (!S.vit.atual.length || V.entram.length || V.saem.length || V.semEst.length) h += '<button type="button" class="go" data-act="vitTroquei">Troquei a vitrine</button>';
    return h + '</section>';
  }
  ACT.vitLug = function () {
    var n = parseInt(($('vtLug') || {}).value, 10);
    if (!(n > 0)) return lfToast('Digite quantos lugares');
    S.vit.lug = Math.min(200, n);
    saveSoon();
    render();
  };
  ACT.vitLugMuda = function () {
    S.vit.lug = 0;
    render();
  };
  ACT.vitFixa = function (r) {
    if (!S.vit.fix) S.vit.fix = {};
    if (S.vit.fix[r]) delete S.vit.fix[r];
    else S.vit.fix[r] = Date.now();
    saveSoon();
    render();
  };
  ACT.vitTroquei = function () {
    var V = vitSugestao();
    S.vit.atual = V.sug.slice();
    S.vit.ts = Date.now();
    (S.vit.hist = S.vit.hist || []).push({ ts: S.vit.ts, refs: V.sug.slice() });
    if (S.vit.hist.length > 60) S.vit.hist = S.vit.hist.slice(-60);
    saveSoon();
    lfToast('Vitrine registrada');
    render();
  };
  // Aviso na segunda-feira (uma vez), só se houver troca a fazer.
  function vitAvisa() {
    if (!(S.vit.lug > 0)) return;
    var d = new Date(),
      dia = d.toISOString().slice(0, 10);
    if (d.getDay() !== 1 || S.vit.avSeg === dia) return;
    var V = vitSugestao();
    if (S.vit.atual.length && !V.entram.length && !V.saem.length) return;
    S.vit.avSeg = dia;
    (S.notifs = S.notifs || []).unshift({
      ts: Date.now(),
      lida: false,
      t: 'Vitrine da semana',
      s: S.vit.atual.length ? V.entram.length + ' entram · ' + V.saem.length + ' saem' : 'sugestão pronta para montar',
      acts: [{ act: 'vitVer', id: '', b: 'Ver' }]
    });
    saveSoon();
  }
  ACT.vitVer = function () {
    S.dTab = 'giro';
    S.dfold = S.dfold || {};
    S.dfold.vit = true;
    setView('dash');
  };
  if (!/#test/.test(location.hash)) {
    setTimeout(vitAvisa, 20000);
    setInterval(vitAvisa, 60 * 60000);
  }
