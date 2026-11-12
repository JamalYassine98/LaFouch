  // ===== Ofertas do site + Super evento + Encalhadas (v426, aprovado 04/11/2026) =====
  // Dólar caiu muito (loja 5% ou mais abaixo da trava do site por 3 dias): ofertas SÓ NO SITE, em no máximo 1 a cada 5 modelos,
  // começando pelos mais parados (os que vendem bem nunca entram). Desconto = queda do dólar (+ a oferta de parado que a
  // peça já tem na loja) e, a cada semana sem vender, +3%. A lista muda toda semana; acaba quando o dólar volta (menos de 3%).
  // No site o desconto nunca passa de 50% do preço cheio e nunca fica abaixo do piso (preço de piso não aparece no site).
  // Super evento: só quando o dono organiza (Dashboard › Preços) — todas as peças do site, por X dias.
  // Encalhada: parada 120+ dias — na loja o preço vai ao piso (preço automático) e entra na lista "Vender na loja".
  S.siteOf = null; // {since, ativo, sem, q, refs:{ref:{ini, extra}}}
  S.superEv = null; // {pct, ate, ini}
  S.saidaSite = null; // S173-4: {ref: {tipo, n, ini, ate, max}} — preço de saída também no site
  S.encAv = {}; // encalhadas já avisadas no sino
  var SITE_TETO = 0.5;
  function siteQueda() {
    var L = S.siteFx;
    if (!L || !(L.usd > 0)) return 0;
    var base = L.base > 0 ? L.base : L.usd / 1.02,
      v;
    try {
      v = fxUsdLoja();
    } catch (e) {
      return 0;
    }
    return v > 0 ? Math.max(0, 1 - v / base) : 0;
  }
  function semanaKey() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d.getTime();
  }
  function siteOfCandidatos() {
    return Object.keys(S.site || {})
      .filter(function (ref) {
        var it = itemDoRef(ref);
        if (!it || it.tipo === 'pre' || isSimple(it.tipo) || it.bulk) return false;
        if (S.pTrava && S.pTrava[ref]) return false;
        if (!(paEstoque(ref) > 0) || !(effCusto(it) > 0)) return false;
        return paVendidas(ref, 30) < 3; // quem vende bem não entra
      })
      .map(function (ref) {
        return { ref: ref, d: paParado(ref), cob: paEstoque(ref) / (paVendidas(ref, 90) + 1) };
      })
      .sort(function (a, b) {
        return b.d - a.d || b.cob - a.cob;
      });
  }
  function siteOfRevisa() {
    var q = siteQueda(),
      agora = Date.now(),
      o = S.siteOf || (S.siteOf = { since: 0, ativo: false, sem: 0, refs: {} }),
      antes = JSON.stringify(o);
    if (q >= 0.05) {
      if (!o.since) o.since = agora;
      o.ativo = agora - o.since >= 3 * DAY;
    } else if (q < 0.03) {
      o.since = 0;
      o.ativo = false;
      o.refs = {};
      o.sem = 0;
    }
    o.q = Math.floor(q * 100) / 100;
    if (o.ativo && o.sem !== semanaKey()) {
      var cand = siteOfCandidatos(),
        ok = {},
        lim = Math.max(1, Math.floor(Object.keys(S.site || {}).length / 5));
      cand.forEach(function (c) {
        ok[c.ref] = 1;
      });
      Object.keys(o.refs).forEach(function (ref) {
        var r = o.refs[ref];
        // vendeu (voltou a girar) ou não é mais candidata: sai; senão, mais 3% por mais uma semana sem vender
        if (!ok[ref] || paUltVenda(ref) > r.ini) delete o.refs[ref];
        else r.extra = Math.round(((r.extra || 0) + 0.03) * 100) / 100;
      });
      cand.forEach(function (c) {
        if (Object.keys(o.refs).length >= lim || o.refs[c.ref]) return;
        o.refs[c.ref] = { ini: agora, extra: 0 };
      });
      o.sem = semanaKey();
    }
    if (JSON.stringify(o) !== antes) saveSoon();
  }
  // Super evento REMOVIDO (dono, 11/11/2026: as temáticas do site já cobrem). Fica sempre desligado.
  function superAtivo() {
    return false;
  }
  // Desconto extra do site (fração) para um produto.
  function siteOfPct(ref) {
    if (superAtivo()) return S.superEv.pct;
    var o = S.siteOf;
    if (!o || !o.ativo || !o.refs || !o.refs[ref]) return 0;
    return (o.q || 0) + (o.refs[ref].extra || 0);
  }
  function siteOfLista() {
    var o = S.siteOf;
    if (!o || !o.ativo) return [];
    return Object.keys(o.refs || {}).map(function (ref) {
      var r = o.refs[ref],
        d = paParado(ref);
      return { ref: ref, pct: Math.min(SITE_TETO, siteOfPct(ref)), mot: 'dólar caiu ' + Math.round((o.q || 0) * 100) + '%' + (d >= 60 ? ' · parada ' + d + ' dias' : '') + (r.extra ? ' · +' + Math.round(r.extra * 100) + '% sem vender' : '') };
    });
  }
  // Preço do site com as ofertas: {n, de}. cheio/atual em guaranis da loja.
  // S173-4 (aprovado 11/11/2026): "Vender com saída" em Loja + site — o preço de saída vai ao site
  // por 7 ou 15 dias ou até vender; termina sozinho no prazo ou quando vende 3 (nunca abaixo do piso).
  function saidaVendidas(ref, ini) {
    return S.sales.reduce(function (a, s) {
      return a + (s.ref === ref && s.ts >= ini && !s.estorno ? s.qty || 1 : 0);
    }, 0);
  }
  function saidaSiteAtiva(ref) {
    var o = S.saidaSite && S.saidaSite[ref];
    if (!o) return null;
    if ((o.ate && o.ate <= Date.now()) || saidaVendidas(ref, o.ini) >= (o.max || 3)) return null;
    return o;
  }
  // Leve 2 no site (aprovado 11/11/2026): 30% na 2ª peça (a mais barata), só pré-graduado e solar.
  // O site só recebe "pode" (l2:true) quando 70% do preço do site não fura o piso; o piso nunca vai para o site.
  var SITE_L2 = 0.3;
  function siteL2(ref, tipo, n) {
    if ((tipo !== 'pre' && tipo !== 'solar') || !(n > 0)) return false;
    var ps = pisoDoRef(ref, tipo),
      piso = ps && ps.pp && ps.pp.piso > 0 ? sitePreco(Math.ceil(ps.pp.piso / 1000) * 1000) : 0;
    return Math.floor((n * (1 - SITE_L2)) / SITE_ARRED) * SITE_ARRED >= piso;
  }
  function sitePrecoOferta(ref, atual, cheio, tipo) {
    var base = sitePreco(cheio > atual ? cheio : atual),
      n = sitePreco(atual),
      ex = siteOfPct(ref);
    if (!(base > 0)) return { n: n, de: 0 };
    if (ex > 0) n = Math.min(n, Math.ceil((n * (1 - ex)) / SITE_ARRED - 1e-9) * SITE_ARRED);
    var sd = saidaSiteAtiva(ref);
    if (sd && sd.n > 0) n = Math.min(n, sitePreco(sd.n));
    var teto = Math.ceil((base * (1 - SITE_TETO)) / SITE_ARRED - 1e-9) * SITE_ARRED;
    if (n < teto) n = teto; // nunca mais que 50% (piso não aparece no site)
    var ps = pisoDoRef(ref, tipo),
      piso = ps && ps.pp && ps.pp.piso > 0 ? sitePreco(Math.ceil(ps.pp.piso / 1000) * 1000) : 0;
    if (piso && n < piso) n = piso; // nunca com prejuízo
    if (n > base) n = base;
    return { n: n, de: n < base ? base : 0 };
  }
  // ---- Encalhadas: paradas há 120 dias ou mais ----
  function encalhadas() {
    return paRefs()
      .filter(function (ref) {
        var it = itemDoRef(ref);
        return it && paEstoque(ref) > 0 && effCusto(it) > 0 && paParado(ref) >= 120;
      })
      .map(function (ref) {
        return { ref: ref, d: paParado(ref), q: paEstoque(ref), p: tFor(itemDoRef(ref)).price };
      })
      .sort(function (a, b) {
        return b.d - a.d;
      });
  }
  function encDias(ref) {
    var it = itemDoRef(ref);
    if (!it || it.tipo === 'pre' || isSimple(it.tipo) || it.bulk || !(effCusto(it) > 0)) return 0;
    var d = paParado(ref);
    return d >= 120 ? d : 0;
  }
  function venderNaLojaHtml() {
    var l = encalhadas();
    if (!l.length) return '';
    return dFold(
      'enc',
      'Vender na loja',
      l.length + ' peça(s) encalhada(s) · paradas há 120 dias ou mais',
      'var(--warn)',
      '<div class="split" style="padding:0 14px 14px"><div class="hint" style="margin:0 0 6px">Na loja o preço já está no piso. No site, o desconto vai até 50%.</div>' +
        l.map(function (x) {
          return '<div class="sl"><span>' + esc(pn(x.ref)) + '<small>parada ' + x.d + ' dias · ' + x.q + ' em estoque</small></span><b>' + gs(x.p) + '</b></div>';
        }).join('') +
        '</div>'
    );
  }
  function encAvisa() {
    if (!S.encAv) S.encAv = {};
    var novas = encalhadas().filter(function (x) {
      return !S.encAv[x.ref];
    });
    if (!novas.length) return;
    novas.forEach(function (x) {
      S.encAv[x.ref] = Date.now();
    });
    (S.notifs = S.notifs || []).unshift({ ts: Date.now(), lida: false, t: 'Vender na loja: ' + novas.length + (novas.length === 1 ? ' peça encalhada' : ' peças encalhadas'), s: novas.slice(0, 3).map(function (x) {
        return pn(x.ref) + ' (' + x.d + ' dias)';
      }).join(' · ') });
    saveSoon();
  }
  if (!/#test/.test(location.hash)) {
    setTimeout(encAvisa, 12000);
    setInterval(encAvisa, 6 * 3600000);
  }
