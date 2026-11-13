  // ===== S183 (aprovado 12/11/2026): temas com CONSELHEIRO DE DESCONTO =====
  // 20 dias antes de cada tema (Natal, Black Friday, Mães, Pais, Ano Novo, Halloween) o app avisa no Início e no sino.
  // "Ver sugestão" abre a simulação: grupos do tema com %, quantas peças ficam limitadas pelo piso, lucro médio antes → depois,
  // quanto vender a mais para empatar, orçamento do tema em DÓLAR (vira guaranis e reais pela cotação); o cupom do evento não soma.
  // Regras sempre: nunca abaixo do piso, novidades (até 30 dias) e as 3 mais vendidas (ordem pura de vendas) sem desconto,
  // +5% nas paradas há 60+ dias, +5% na última semana para peça do tema que não vendeu. Termina sozinho, tem Desfazer e
  // guarda o resultado no fim (usado para sugerir no ano seguinte).
  S.temaOf = S.temaOf || null; // {tema, ini, fim, refs:{ref:pct}, ts, orc}
  S.temaRes = S.temaRes || {}; // 'natal-2026' → {vendas, pecas, lucro, ...}
  S.temaNao = S.temaNao || {}; // tema-ano → 'agora não'
  var TEMA_REG = {
    natal: { g: function (it) { return it.tipo === 'pre' || it.tipo === 'grau'; }, rot: 'Leitura', p: 0.10, pp: 0.15 },
    bf: { g: function (it, ref) { return paParado(ref) >= 30; }, rot: 'Paradas', p: 0.20, pp: 0.30, max: 0.5 },
    maes: { g: function (it, ref) { return ((typeof attrOf === 'function' && attrOf(ref)) || {}).publico === 'Feminino'; }, rot: 'Femininas', p: 0.10, pp: 0.15 },
    pais: { g: function (it, ref) { return ((typeof attrOf === 'function' && attrOf(ref)) || {}).publico === 'Masculino'; }, rot: 'Masculinas', p: 0.10, pp: 0.15 },
    anonovo: { g: function (it) { return it.tipo === 'solar'; }, rot: 'Solares', p: 0.10, pp: 0.10 },
    halloween: { g: function () { return false; }, rot: '—', p: 0, pp: 0 }
  };
  function temaAtual() {
    var t = typeof cupTemaProx === 'function' ? cupTemaProx() : null;
    return t && TEMA_REG[t.tema] ? t : null;
  }
  function temaTop3() {
    var ag = Date.now() - 90 * DAY, n = {};
    (S.sales || []).forEach(function (s) { if (!s.estorno && s.ts > ag) n[s.ref] = (n[s.ref] || 0) + (s.qty || 1); });
    return Object.keys(n).sort(function (a, b) { return n[b] - n[a]; }).slice(0, 3);
  }
  // sugestão: {grupos:[{rot,pct,n}], refs:{ref:pct}, lim, lucroAntes, lucroDepois, empata}
  function temaSugestao(t) {
    var R = TEMA_REG[t.tema], top = temaTop3(), refs = {}, lim = 0, la = 0, ld = 0, nA = 0, fx = (S.fx && S.fx.pyg) || 0, G = {};
    (typeof paRefs === 'function' ? paRefs() : []).forEach(function (ref) {
      var it = itemDoRef(ref);
      if (!it || paEstoque(ref) <= 0 || !R.g(it, ref)) return;
      if (top.indexOf(ref) >= 0) return; // as 3 mais vendidas ficam sem desconto
      if (S.cad && S.cad[ref] && Date.now() - S.cad[ref] < 30 * DAY) return; // novidades sem desconto
      var d = paParado(ref), pct = d >= 60 ? R.pp : R.p;
      if (d >= 60 && pct === R.p) pct += 0.05;
      if (R.max) pct = Math.min(pct, R.max);
      if (!(pct > 0)) return;
      var p = tFor(it).price, ps = typeof pisoDoRef === 'function' ? pisoDoRef(ref, it.tipo) : null, piso = ps && ps.pp ? ps.pp.piso : 0, n = Math.round(p * (1 - pct) / 1000) * 1000;
      if (piso && n < piso) { lim++; n = Math.ceil(piso / 1000) * 1000; pct = Math.max(0, 1 - n / p); }
      if (!(pct > 0.009)) return;
      refs[ref] = Math.round(pct * 100) / 100;
      var cu = (effCusto(it) || 0) * fx;
      la += p - cu; ld += n - cu; nA++;
      var k = R.rot + (d >= 60 ? ' paradas 60+ dias' : '');
      G[k] = G[k] || { rot: k, pct: Math.round(pct * 100), n: 0 };
      G[k].n++;
    });
    var mA = nA ? la / nA : 0, mD = nA ? ld / nA : 0;
    return { grupos: Object.keys(G).map(function (k) { return G[k]; }), refs: refs, lim: lim, n: nA, lucroAntes: Math.round(mA), lucroDepois: Math.round(mD), empata: mD > 0 ? Math.max(0, Math.round((mA / mD - 1) * 100)) : 0 };
  }
  // vale no preço do site enquanto o tema dura (+5% na última semana para quem não vendeu)
  var _sopTema = siteOfPct;
  siteOfPct = function (ref) {
    var b = _sopTema.apply(this, arguments), o = S.temaOf, ag = Date.now();
    if (!o || !o.refs || !o.refs[ref] || ag < o.ini || ag > o.fim) return b;
    var p = o.refs[ref];
    if (o.fim - ag < 7 * DAY && !(S.sales || []).some(function (s) { return s.ref === ref && !s.estorno && s.ts >= o.ini; })) p += 0.05;
    return Math.max(b, p);
  };
  function temaAno(t) { return t.tema + '-' + new Date(t.ini).getFullYear(); }
  // resultado do tema que acabou (para o ano seguinte)
  function temaFecha() {
    var o = S.temaOf;
    if (!o || Date.now() <= o.fim) return;
    var vs = (S.sales || []).filter(function (s) { return !s.estorno && s.ts >= o.ini && s.ts <= o.fim; }), com = vs.filter(function (s) { return o.refs[s.ref]; });
    S.temaRes[o.tema + '-' + new Date(o.ini).getFullYear()] = { pecas: com.reduce(function (a, s) { return a + (s.qty || 1); }, 0), vendas: com.reduce(function (a, s) { return a + (s.price || 0); }, 0), lucro: com.reduce(function (a, s) { return a + (s.livre || 0); }, 0), refs: Object.keys(o.refs).length };
    S.temaOf = null;
    saveSoon();
    lfToast('Tema encerrado · resultado guardado');
  }
  function temaCardHtml() {
    temaFecha();
    var t = temaAtual();
    if (!t || t.tema === 'halloween') return '';
    var on = S.temaOf && S.temaOf.tema === t.tema && S.temaOf.fim >= Date.now();
    if (on) return '<section class="card temaC noconta"><span>' + t.ic + '</span><div><b>' + esc(t.nome) + ' · desconto aplicado</b><small>' + Object.keys(S.temaOf.refs).length + ' peças · termina sozinho em ' + fd(S.temaOf.fim) + '</small></div><button type="button" class="gMudo" data-act="temaDesfaz">Desfazer</button></section>';
    if (t.dias > 20 || S.temaNao[temaAno(t)]) return '';
    // só avisa quando há o que sugerir (conta guardada por 1 min)
    if (!temaCardHtml._c || Date.now() - temaCardHtml._c.ts > 60000 || temaCardHtml._c.t !== t.tema) temaCardHtml._c = { ts: Date.now(), t: t.tema, n: temaSugestao(t).n };
    if (!temaCardHtml._c.n) return '';
    return '<section class="card temaC noconta"><span>' + t.ic + '</span><div><b>' + esc(t.nome) + (t.dias ? ' começa em ' + t.dias + ' dias' : ' começou') + '</b><small>Tenho uma sugestão de desconto para as peças do tema.</small></div><span class="temaB"><button type="button" class="gBtn" data-act="temaVer">Ver sugestão</button><button type="button" class="gMudo" data-act="temaNao">Agora não</button></span></section>';
  }
  ACT.temaNao = function () { var t = temaAtual(); if (t) { S.temaNao[temaAno(t)] = 1; saveSoon(); render(); } };
  ACT.temaDesfaz = function () { var o = S.temaOf; S.temaOf = null; saveSoon(); if (o && typeof vitFila === 'function') Object.keys(o.refs).forEach(function (r) { if (S.site && S.site[r]) vitFila(r, 'upd'); }); lfToast('Desconto do tema desfeito'); render(); };
  ACT.temaVer = function () {
    var t = temaAtual();
    if (!t) return;
    var sg = temaSugestao(t), ant = S.temaRes[t.tema + '-' + (new Date(t.ini).getFullYear() - 1)];
    lfJanela({
      titulo: t.ic + ' ' + t.nome,
      monta: function (c) {
        c.innerHTML = '<div class="col" style="gap:12px;padding:0 16px 16px"><div class="hint" style="margin:0">' + fd(t.ini) + ' a ' + fd(t.fim) + ' · termina sozinho</div>' +
          '<section class="card col"><div class="lbl">SUGESTÃO</div>' + (sg.grupos.length ? sg.grupos.map(function (g) { return '<div class="sl"><span>' + esc(g.rot) + '<small>' + g.n + ' peças</small></span><b>−' + g.pct + '%</b></div>'; }).join('') : '<div class="hint">Nenhuma peça do tema precisa de desconto agora.</div>') +
          (sg.lim ? '<div class="hint" style="margin:6px 0 0">' + sg.lim + ' peça(s) ficam no piso (desconto menor).</div>' : '') + '<div class="hint" style="margin:6px 0 0">Novidades e as 3 mais vendidas ficam sem desconto. O cupom do evento não soma.</div></section>' +
          (sg.n ? '<section class="card col"><div class="lbl">SIMULAÇÃO</div><div class="sl"><span>Lucro médio por peça</span><b>' + gs(sg.lucroAntes) + ' → ' + gs(sg.lucroDepois) + '</b></div><div class="sl"><span>Para empatar</span><b>vender ' + sg.empata + '% a mais</b></div>' +
            '<div class="sl"><span>Orçamento do tema</span><span style="display:flex;gap:6px;align-items:center">US$ <input class="in" id="temaOrc" inputmode="decimal" style="width:90px" value="' + (S.temaOrc || '') + '"></span></div><div class="hint" id="temaOrcH" style="margin:0"></div>' +
            (ant ? '<div class="hint" style="margin:6px 0 0">Ano passado: ' + ant.pecas + ' peças, ' + gs(ant.vendas) + ' em vendas.</div>' : '') + '</section>' : '') +
          (sg.n ? '<div class="fiPe"><button type="button" class="fiH" data-act="temaNao">Agora não</button><button type="button" class="fiG" id="temaOk">Aplicar</button></div>' : '') + '</div>';
        var orc = $('temaOrc'), oh = $('temaOrcH'), mo = function () { var v = parseFloat(String(orc.value).replace(',', '.')) || 0, fx = (S.fx && S.fx.pyg) || 0; oh.textContent = v && fx ? '≈ ' + gs(Math.round(v * fx)) + (S.fx.brl ? ' · R$ ' + Math.round((v * fx) / (fx / S.fx.brl)) : '') : ''; };
        if (orc) { orc.oninput = mo; mo(); }
        var ok = $('temaOk');
        if (ok) ok.onclick = function () {
          S.temaOrc = orc ? orc.value : '';
          S.temaOf = { tema: t.tema, ini: Math.max(t.ini, Date.now() - DAY), fim: t.fim, refs: sg.refs, ts: Date.now(), orc: S.temaOrc };
          saveSoon();
          if (typeof vitFila === 'function') Object.keys(sg.refs).forEach(function (r) { if (S.site && S.site[r]) vitFila(r, 'upd'); });
          lfToast('✓ Desconto do tema aplicado · entra no site no dia ' + fd(S.temaOf.ini));
          S.temaMail = { chave: temaAno(t), ini: S.temaOf.ini, nome: t.nome };
          temaMailTenta();
          render();
        };
      }
    });
  };
  // avisa no sino também
  var _atTema = atencaoItens;
  atencaoItens = function () {
    var it = _atTema.apply(this, arguments);
    try { var t = temaAtual(); if (t && t.tema !== 'halloween' && t.dias <= 20 && !S.temaNao[temaAno(t)] && !(S.temaOf && S.temaOf.tema === t.tema)) it.push({ t: t.nome + (t.dias ? ' em ' + t.dias + ' dias' : ''), s: 'sugestão de desconto pronta', c: 'var(--ac)', b: 'Ver', act: 'temaVer', id: '' }); } catch (e) {}
    return it;
  };
  // e-mail aos inscritos no começo do tema (1 vez; a função "novidades" guarda que já foi)
  var TEMA_TXT = { natal: ['Natal na La Fouch 🎄', 'Presentes com desconto e retirada no mesmo dia em Ciudad del Este.', 'Navidad en La Fouch 🎄', 'Regalos con descuento y retiro el mismo día en Ciudad del Este.'],
    bf: ['Black Friday La Fouch ⚡', 'Ofertas em toda a loja enquanto durar o estoque.', 'Black Friday La Fouch ⚡', 'Ofertas en toda la tienda mientras dure el stock.'],
    maes: ['Dia das Mães 🌷', 'Um presente com carinho, com desconto.', 'Día de la Madre 🌷', 'Un regalo con cariño, con descuento.'],
    pais: ['Dia dos Pais 👔', 'Óculos para o seu pai, com desconto.', 'Día del Padre 👔', 'Lentes para tu papá, con descuento.'],
    anonovo: ['Ano Novo com estilo 🥂', 'Solares com desconto para o verão.', 'Año Nuevo con estilo 🥂', 'Lentes de sol con descuento para el verano.'] };
  function temaMailTenta() {
    var m = S.temaMail;
    if (!m || m.feito || Date.now() < m.ini || typeof nvToken !== 'function' || navigator.onLine === false) return;
    var tm = String(m.chave).split('-')[0], tx = TEMA_TXT[tm];
    if (!tx) { m.feito = 1; saveSoon(); return; }
    nvToken().then(function (tk) {
      return fetch('https://southamerica-east1-' + nvCfg().p + '.cloudfunctions.net/novidades', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tk }, body: JSON.stringify({ acao: 'tema', chave: m.chave, titulo: tx[0], texto: tx[1], tituloEs: tx[2], textoEs: tx[3] }) }).then(function (r) { return r.json(); });
    }).then(function (j) { if (j && j.ok) { m.feito = 1; saveSoon(); if (j.n) lfToast('✉️ E-mail do tema enviado a ' + j.n + ' inscritos'); } }, function () {});
  }
  setTimeout(temaMailTenta, 15000);
