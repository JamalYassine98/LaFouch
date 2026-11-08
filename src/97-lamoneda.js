  // ===== Cotação da La Moneda · Sucursal Jebai (v425, aprovado 04/11/2026) =====
  // A casa de câmbio fica em frente à loja: a cotação da loja segue a dela, nas três contas:
  //  - dólar → guarani: o que a casa cobra pelo dólar (venda) — é o que a loja paga para repor;
  //  - real → dólar: a arbitragem da casa (venda); se a página não trouxer, venda do dólar ÷ compra do real;
  //  - real → guarani: o que a casa paga pelo real (compra) — só informativo (troco).
  // Proteção: só quando o dólar dispara (mais de 1% em 3 dias), no máximo +1% acima da casa.
  // O site da casa bloqueia servidores (erro 522), então quem busca é o CELULAR (CapacitorHttp nativo), a cada 1 min;
  // o resultado (S.lm) viaja pela sincronização para os outros aparelhos. Sem dado de hoje, vale a cotação antiga.
  S.lm = null; // {ts, usd:{c,v}, brl:{c,v}, arb:{c,v,calc}, hist:[[ts, usdC, usdV, brlC, brlV]]}
  var LM_URL = 'https://www.lamoneda.com.py/cotizaciones';
  function lmNum(s) {
    s = String(s || '').trim();
    if (/^\d{1,3}(\.\d{3})+$/.test(s)) return +s.replace(/\./g, '');
    if (/^\d+,\d+$/.test(s)) return +s.replace(',', '.');
    if (/^\d{1,3}(,\d{3})+$/.test(s)) return +s.replace(/,/g, '');
    var n = parseFloat(s);
    return isFinite(n) ? n : null;
  }
  // Lê a página (texto) e devolve os valores da Sucursal Jebai.
  // 07/11: lê a Sucursal Jebai; se ela não aparecer na página, usa a Casa Matriz (mesmo site, preços quase iguais).
  function lmLer(html) {
    var c = lmLerSuc(html, 'sucursal jebai');
    if (c) {
      c.suc = 'Jebai';
      return c;
    }
    c = lmLerSuc(html, 'casa matriz');
    if (c) c.suc = 'Casa Matriz';
    return c;
  }
  function lmLerSuc(html, NOME) {
    var t = String(html || '')
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' | ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&aacute;/g, 'á')
      .replace(/&oacute;/g, 'ó')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ');
    var lo = t.toLowerCase(),
      i = lo.indexOf(NOME);
    if (i < 0) return null;
    // 07/11: o nome aparece várias vezes (seletor, título de cada tabela); usa o primeiro trecho que tem a cotação
    var segJ = '',
      trecho = function (i) {
        var fim = t.length;
        ['casa matriz', 'sucursal jebai', 'sucursal centro', 'caja auxiliar'].forEach(function (m) {
          if (m === NOME) return;
          var j = lo.indexOf(m, i + 10);
          if (j > 0 && j < fim) fim = j;
        });
        return t.slice(i, fim);
      };
    for (var ii = i; ii >= 0; ii = lo.indexOf(NOME, ii + 10)) {
      var sg = trecho(ii);
      if (/d[óo]lar[^0-9]{0,80}?\d/i.test(sg) && /\breal\b[^0-9]{0,80}?\d/i.test(sg)) {
        segJ = sg;
        break;
      }
    }
    if (!segJ) segJ = trecho(i);
    var par = function (rx, ok, tudo) {
      var m,
        seg = tudo ? t : segJ,
        r = new RegExp(rx.source + '[^0-9]{0,80}?([\\d.,]+)[^0-9]{1,40}?([\\d.,]+)', 'gi');
      while ((m = r.exec(seg))) {
        var a = lmNum(m[m.length - 2]),
          b = lmNum(m[m.length - 1]);
        if (a && b && ok(a) && ok(b)) return { c: Math.min(a, b), v: Math.max(a, b) };
      }
      return null;
    };
    var usd = par(/(d[óo]lar(?!\s*\/)|\busd\b(?!\s*\/))/, function (x) {
        return x > 3000 && x < 20000;
      }),
      brl = par(/(\breal\b(?!\s*\/)|\bbrl\b(?!\s*\/))/, function (x) {
        return x > 400 && x < 4000;
      }),
      arb = par(/(usd\s*\/\s*brl|d[óo]lar\s*\/\s*real)/, function (x) {
        return x > 2 && x < 15;
      });
    if (!usd || !brl) {
      var bl = lmBlocos(t, NOME);
      if (bl) return bl;
      return null;
    }
    // a arbitragem pode aparecer só na Casa Matriz
    if (!arb && NOME !== 'casa matriz')
      arb = par(/(usd\s*\/\s*brl|d[óo]lar\s*\/\s*real)/, function (x) {
        return x > 2 && x < 15;
      }, true);
    if (!arb) arb = { c: Math.round((usd.c / brl.v) * 1000) / 1000, v: Math.round((usd.v / brl.c) * 1000) / 1000, calc: true };
    return { usd: usd, brl: brl, arb: arb };
  }
  // 07/11: página nova da casa — os nomes das sucursais aparecem só no seletor (Casa Matriz, Sucursal Jebai, …) e depois vêm
  // as tabelas na MESMA ordem, sem o nome. Pega a posição da Jebai no seletor e lê a tabela de mesma posição.
  function lmBlocos(t, NOME) {
    var linhas = function (rx, ok) {
      var out = [],
        m,
        r = new RegExp(rx.source + '[^0-9]{0,80}?([\\d.,]+)[^0-9]{1,40}?([\\d.,]+)', 'gi');
      while ((m = r.exec(t))) {
        var a = lmNum(m[m.length - 2]),
          b = lmNum(m[m.length - 1]);
        if (a && b && ok(a) && ok(b)) out.push({ i: m.index, c: Math.min(a, b), v: Math.max(a, b) });
      }
      return out;
    };
    var U = linhas(/(\bd[óo]lar\b(?!\s*\/)(?!\s*inusual)|\busd\b(?!\s*\/))/, function (x) {
        return x > 3000 && x < 20000;
      }),
      R = linhas(/(\breal\b(?!\s*\/)|\bbrl\b(?!\s*\/))/, function (x) {
        return x > 400 && x < 4000;
      }),
      A = linhas(/(usd\s*\/\s*brl|d[óo]lar\s*\/\s*real)/, function (x) {
        return x > 2 && x < 15;
      });
    if (U.length < 2 || !R.length) return null;
    var antes = t.slice(Math.max(0, U[0].i - 6000), U[0].i),
      nomes = [],
      m,
      rn = /(casa matriz|sucursal\s+[a-záéíóúç]+|caja auxiliar\s+[a-z0-9áéíóú]+)/gi;
    while ((m = rn.exec(antes))) {
      var n = m[1].toLowerCase().replace(/\s+/g, ' ');
      if (nomes.indexOf(n) < 0) nomes.push(n);
    }
    var k = nomes.indexOf(NOME || 'sucursal jebai');
    S._lmDiag = 'sucursais ' + nomes.length + ', tabelas de dólar ' + U.length + ', real ' + R.length;
    if (k < 0 || U.length < nomes.length) return null;
    if (U.length > nomes.length) U = U.slice(U.length - nomes.length); // linhas a mais antes (ex.: conversor) ficam de fora
    var fimK = k + 1 < U.length ? U[k + 1].i : t.length,
      dentro = function (L) {
        return L.filter(function (x) {
          return x.i > U[k].i && x.i < fimK;
        })[0];
      },
      brl = dentro(R),
      arb = dentro(A);
    if (!brl) return null;
    var usd = { c: U[k].c, v: U[k].v };
    brl = { c: brl.c, v: brl.v };
    arb = arb ? { c: arb.c, v: arb.v } : { c: Math.round((usd.c / brl.v) * 1000) / 1000, v: Math.round((usd.v / brl.c) * 1000) / 1000, calc: true };
    return { usd: usd, brl: brl, arb: arb };
  }
  // Grava só quando a cotação MUDA (não enche a sincronização); histórico de 1 ponto por hora.
  function lmGrava(c) {
    var agora = Date.now(),
      a = S.lm,
      h = (a && a.hist) || [],
      mudou = !a || !a.usd || a.usd.c !== c.usd.c || a.usd.v !== c.usd.v || a.brl.c !== c.brl.c || a.brl.v !== c.brl.v || a.arb.v !== c.arb.v || (a.suc || 'Jebai') !== (c.suc || 'Jebai'),
      hora = !h.length || agora - h[h.length - 1][0] >= 55 * 60000;
    S._lmVisto = agora; // última leitura certa (só neste aparelho)
    if (!mudou && !hora) return false;
    if (hora) h.push([agora, c.usd.c, c.usd.v, c.brl.c, c.brl.v, c.arb.v, c.arb.c]);
    h = h.filter(function (x) {
      return agora - x[0] <= 400 * DAY;
    });
    S.lm = { ts: agora, usd: c.usd, brl: c.brl, arb: c.arb, hist: h, erro: '', suc: c.suc || 'Jebai' };
    saveSoon();
    try {
      fxDaCasa();
    } catch (e) {}
    return true;
  }
  function lmHttp() {
    var C = window.Capacitor;
    return C && C.isNativePlatform && C.isNativePlatform() && C.Plugins && C.Plugins.CapacitorHttp ? C.Plugins.CapacitorHttp : null;
  }
  // Busca no celular (o navegador não deixa ler outro site), a cada 1 minuto; 3 falhas seguidas → espera 5 min.
  var LM_FALHAS = 0,
    LM_PAUSA = 0;
  function lmBusca() {
    var H = lmHttp();
    if (!H) {
      S._lmErr = 'este aparelho não busca a casa (só o app instalado no celular busca)';
      return Promise.resolve(false);
    }
    if (Date.now() < LM_PAUSA) return Promise.resolve(false);
    return H.get({ url: LM_URL, headers: { 'Accept-Language': 'es-PY,es;q=0.9', Accept: 'text/html' } })
      .then(function (r) {
        var c = lmLer(r && r.data);
        // 07/11: diagnóstico — guarda o que a página devolveu quando não dá para ler (ex.: bloqueio do Cloudflare)
        if (!c) {
          var tx = String((r && r.data) || '').replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          throw new Error((S._lmDiag ? '[' + S._lmDiag + '] ' : '') + 'a página respondeu ' + ((r && r.status) || '?') + (/cloudflare|just a moment|attention required|checking your browser/i.test(tx) ? ' (bloqueio do Cloudflare)' : '') + ' e não achei a Sucursal Jebai: “' + tx.slice(0, 80) + '…”');
        }
        LM_FALHAS = 0;
        S._lmErr = '';
        return lmGrava(c);
      })
      .catch(function (e) {
        if (++LM_FALHAS >= 3) {
          LM_FALHAS = 0;
          LM_PAUSA = Date.now() + 5 * 60000;
        }
        S._lmErr = String((e && e.message) || e);
        if (S.lm) S.lm.erro = S._lmErr;
        return false;
      });
  }
  // Vale a última cotação da casa que ficou salva (nunca a média de mercado).
  function lmOk() {
    return !!(S.lm && S.lm.usd && S.lm.usd.v > 0 && S.lm.arb && S.lm.arb.v > 0);
  }
  // Cotação da LOJA: casa (venda) + 1%, arredondada para cima de 50 em 50 (6.150 → 6.211,5 → 6.250).
  function lmUsdLoja() {
    return Math.ceil((S.lm.usd.v * 1.01) / 50 - 1e-9) * 50;
  }
  function lmBrlPorUsd() {
    return Math.ceil(S.lm.arb.v * 100 - 1e-9) / 100;
  }
  if (!/#test/.test(location.hash)) {
    setTimeout(function () {
      lmBusca().then(function (ok) {
        if (ok) render();
      });
    }, 3000);
    setInterval(function () {
      lmBusca().then(function (ok) {
        if (ok) render();
      });
    }, 60000);
  }
  // 07/11: aviso no sino quando a cotação da casa fica mais de 3 h sem atualizar no horário da loja (seg–sáb, 7h30–15h), 1 vez por dia.
  function lmVisto() {
    var h = (S.lm && S.lm.hist) || [];
    return Math.max(S._lmVisto || 0, (S.lm && S.lm.ts) || 0, h.length ? h[h.length - 1][0] : 0);
  }
  function lmAvisaParada() {
    if (!lmOk()) return;
    var d = new Date(),
      min = d.getHours() * 60 + d.getMinutes();
    if (d.getDay() === 0 || min < 7 * 60 + 30 || min > 15 * 60) return;
    var parada = Date.now() - lmVisto();
    if (parada < 3 * 3600000) return;
    var dia = d.toDateString();
    if (!S.fxAvisos) S.fxAvisos = {};
    if (S.fxAvisos.lm === dia) return;
    S.fxAvisos.lm = dia;
    (S.notifs = S.notifs || []).unshift({ ts: Date.now(), lida: false, t: 'Cotação da casa sem atualizar', s: 'Há ' + Math.floor(parada / 3600000) + ' h sem ler a La Moneda. Os preços seguem a última cotação (' + gsRaw(S.lm.usd.v) + '). Confira a placa da casa.' });
    saveSoon();
    render();
  }
  if (!/#test/.test(location.hash)) setInterval(lmAvisaParada, 15 * 60000);
  // 07/11: lê a casa na hora ao voltar para o app (estava em segundo plano) e ao abrir a aba Câmbio; no máximo 1 vez a cada 15 s.
  var LM_ULT = 0;
  function lmAgora() {
    if (Date.now() - LM_ULT < 15000) return;
    LM_ULT = Date.now();
    lmBusca().then(function (ok) {
      if (ok) render();
    });
  }
  if (!/#test/.test(location.hash)) {
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) lmAgora();
    });
    try {
      var CA = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
      if (CA && CA.addListener)
        CA.addListener('appStateChange', function (st) {
          if (st && st.isActive) lmAgora();
        });
    } catch (e) {}
  }
