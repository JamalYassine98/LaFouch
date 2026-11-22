  // ===== S188 (aprovado 12/11/2026): CONTADOR VIRTUAL — tudo de preço num lugar só =====
  // Números › Preços vira o Contador: 1 saúde dos preços, 2 decisões da semana (Aceitar tudo / um por um),
  // 3 calculadora de preço por custo/lote, 4 "E se…?" com perguntas prontas (só contas do app, sem internet nem IA),
  // 5 no começo do mês, o fechamento do mês anterior. (149p: o interruptor e "Contas, taxas e meta" foram para Ajustes › Preços.)
  // Na ficha (aba Preço): "De onde vem o preço" com a barra repor/contas/colchão/taxa/lucro e até onde dá para descer.
  // Regras de preço continuam as mesmas (nunca abaixo do piso, no máximo 10% por semana, cadeado vence sempre).
  S.cntFech = S.cntFech || {}; // 'AAAA-MM' → visto
  function cntFx() { return (S.fx && S.fx.pyg) || 0; }
  function cntVendas(dias, ate) {
    var fim = ate || Date.now(), ini = fim - dias * DAY;
    return (S.sales || []).filter(function (s) { return !s.estorno && s.ts >= ini && s.ts < fim && !isSimple(s.tipo); });
  }
  function cntTaxaPct() { var t = lrSoma(cntVendas(90)); return t.vendido > 0 ? t.taxa / t.vendido : 0; }
  function cntSaude() {
    var a = lrSoma(cntVendas(30)), b = lrSoma(cntVendas(30, Date.now() - 30 * DAY)), d = new Date(), m = lrMes(d.getFullYear(), d.getMonth()),
      tm = typeof totalMensal === 'function' ? totalMensal() : 0, porPeca = a.qty ? Math.round(a.lucro / a.qty) : 0,
      mg = a.vendido ? (a.lucro / a.vendido) * 100 : 0, mgB = b.vendido ? (b.lucro / b.vendido) * 100 : null,
      cob = tm > 0 ? Math.max(0, Math.round((m.lucro / tm) * 100)) : 0,
      falta = tm > m.lucro && porPeca > 0 ? Math.ceil((tm - m.lucro) / porPeca) : 0,
      abx = typeof invPrecosAcorrigir === 'function' ? invPrecosAcorrigir().length : typeof abaixoDoPiso === 'function' ? abaixoDoPiso().length : 0; /* S364: a mesma contagem da lista "Preços para corrigir" */
    return { mg: mg, dmg: mgB == null ? null : mg - mgB, porPeca: porPeca, cob: cob, falta: falta, abx: abx, tm: tm, mes: m };
  }
  // decisões já agrupadas (4b): tema que está chegando, UMA entrada por assunto do preço automático (oferta, fim — as peças vão em itens)
  // e UMA por tabela de atacado com margem baixa. Os preços que sobem não entram: já estão nos "preços para corrigir".
  function cntDecisoes() {
    var L = [], pa = {};
    try {
      var t = typeof temaAtual === 'function' ? temaAtual() : null;
      if (t && t.dias <= 20 && !(S.temaOf && S.temaOf.tema === t.tema) && !(S.temaNao && S.temaNao[temaAno(t)])) {
        var sem = typeof temaSugestao === 'function' && !temaSugestao(t).n;
        L.push({ t: 'tema', tit: t.nome + ' em ' + nDias(t.dias), sub: sem ? 'nenhuma peça entra no desconto pela regra' : 'sugestão do tema pronta', v: sem ? 'Por quê' : 'Ver' });
      }
    } catch (e) {}
    try { paPlano().forEach(function (m) { if (m.kind !== 'oferta' && m.kind !== 'fim') return; (pa[m.kind] = pa[m.kind] || { t: 'pa', kind: m.kind, n: 0, itens: [] }).itens.push(m); pa[m.kind].n++; }); } catch (e) {}
    ['oferta', 'fim'].forEach(function (k) { if (pa[k]) L.push(pa[k]); });
    try {
      tabLista().filter(function (T) { return !T.pub; }).forEach(function (T) {
        var vis = {}, g = { t: 'tab', tab: T, n: 0, min: 999 };
        (S.items || []).forEach(function (it) {
          if (!(it.qty > 0) || it.bulk || isSimple(it.tipo) || vis[it.ref]) return;
          vis[it.ref] = 1;
          var p = precoTab(it, T.id), pp = pisoPeca(it);
          if (!(p > 0) || !(pp.trava > 0)) return;
          var mg = (p - pp.trava) / p;
          if (mg < 0.1) { g.n++; g.min = Math.min(g.min, Math.round(mg * 100)); }
        });
        if (g.n) L.push(g);
      });
    } catch (e) {}
    return L;
  }
  function cntDescontosTxt(m) {
    var d = new Date(), ini = new Date(d.getFullYear(), d.getMonth(), 1).getTime(),
      vs = (S.sales || []).filter(function (s) { return !s.estorno && s.ts >= ini && ((s.cup && s.cup.desc > 0) || +s.l2d > 0 || (S.pprice[s.ref] && S.pprice[s.ref].ant > S.pprice[s.ref].novo)); });
    if (!vs.length) return '';
    var t = lrSoma(vs);
    return '"Este mês os descontos (cupons, ofertas) custaram ' + gs(t.desc) + ' e trouxeram ' + vs.length + (vs.length === 1 ? ' venda' : ' vendas') + '. ' + (t.lucro > 0 ? 'Valeu a pena: lucro líquido +' + gs(t.lucro) + '."' : 'Não compensou: deram ' + gs(t.lucro) + ' de lucro."');
  }
  function cntFechHtml(ano, mes) {
    var t = lrMes(ano, mes), nm = new Date(ano, mes, 1).toLocaleDateString('pt-BR', { month: 'long' }), por = {};
    if (!t.qty) return '';
    (S.sales || []).forEach(function (s) { var d = new Date(s.ts); if (s.estorno || d.getFullYear() !== ano || d.getMonth() !== mes) return; (por[s.tipo || 'outro'] = por[s.tipo || 'outro'] || []).push(s); });
    return '<section class="card col cntF"><div class="lbl">FECHAMENTO DE ' + nm.toUpperCase() + '</div>' +
      lrLinha('Lucro real', gs(t.lucro), t.lucro >= 0 ? 'var(--ok)' : 'var(--bad)') + lrLinha('Vendido', gs(t.vendido) + ' · ' + t.qty + ' peças') + lrLinha('Descontos custaram', gs(t.desc)) +
      Object.keys(por).map(function (k) { var x = lrSoma(por[k]); return lrLinha('Margem · ' + esc((tipoOf(k) || {}).label || k), (x.vendido ? Math.round((x.lucro / x.vendido) * 100) : 0) + '%'); }).join('') +
      '<div class="hint" style="margin:6px 0 0">' + (t.lucro < (typeof totalMensal === 'function' ? totalMensal() : 0) ? 'O lucro não cobriu as contas do mês: olhe as decisões e o "E se…?" antes de mexer.' : 'O mês cobriu as contas. Siga as decisões da semana.') + '</div></section>';
  }
  // ---------- 2 · de onde vem o preço (ficha) ----------
  function cntPrecoHtml(ref) {
    var it = itemDoRef(ref);
    if (!it || isSimple(it.tipo) || !(effCusto(it) > 0)) return '';
    var p = tFor(it).price, pp = pisoPeca(it), fx = cntFx(), tx = Math.round(p * cntTaxaPct()), lu = p - pp.rep - pp.contas - pp.colch - tx, f = faixaOf(ref);
    if (!(p > 0)) return '';
    // S365: a barra mostra a conta única de lucro (IVA da venda, custo da peça, lucro); repor/contas/colchão ficam nas linhas do piso e da trava
    var cuG = lucroCustoGs(ref), ivG = Math.round(p - p / 1.1); lu = lucroUnico(ref, p);
    var seg = [['IVA da venda', ivG, '#c4567f'], ['Custo da peça', cuG, '#7a2a59'], ['Lucro', Math.max(0, lu), '#1f8a4c']];
    var tab = tabLista().filter(function (T) { return !T.pub; })[0], ata = tab ? precoTab(it, tab.id) : 0, desce = lucroDesceAte(ref, p);
    return '<details class="cntP"><summary class="dbS">De onde vem o preço<b class="dbV">' + gs(p) + '</b>' + dobraSeta() + '</summary>' +
      '<div class="cntBar">' + seg.map(function (x) { return x[1] > 0 ? '<i style="flex:' + x[1] + ';background:' + x[2] + '"></i>' : ''; }).join('') + '</div>' +
      '<div class="cntLeg">' + seg.map(function (x) { return '<span><i style="background:' + x[2] + '"></i>' + x[0] + ' ' + gs(x[1]) + '</span>'; }).join('') + '</div>' +
      lrLinha('Piso (não perde) <small>repor + contas + colchão</small>', gs(pp.piso)) + lrLinha('Trava (perde se vender abaixo)', gs(pp.trava)) +
      (f ? lrLinha('Faixa de margem <small>' + esc(f.nome) + ' · ' + f.margem + '%</small>', gs(pp.piso)) : '') +
      (typeof sitePreco === 'function' ? lrLinha('Site', gs(sitePreco(p))) : '') + (ata > 0 && fx ? lrLinha('Atacado <small>' + esc(tab.nome) + '</small>', 'US$ ' + (ata / fx).toFixed(2).replace('.', ',')) : '') +
      '<div class="cntQ" style="margin-top:8px">💬 "Pode dar até ' + desce + '% de desconto sem perder dinheiro.' + (lucroUnico(ref, p * 0.8) > 0 ? ' Com 20% ainda sobra ' + gs(lucroUnico(ref, p * 0.8)) + ' de lucro."' : '"') + '</div></details>';
  }
  function fichaPreco(det, ref, opt) {
    if (opt.venda || !ref || !det || det.querySelector('.cntP')) return;
    var h = cntPrecoHtml(ref);
    if (h) { var w = document.createElement('div'); w.innerHTML = h; det.appendChild(w.firstChild); }
  }
  // ---------- 3 · calculadora ----------
  ACT.cntCalc = function () {
    lfJanela({ titulo: 'Calculadora de preço', monta: function (box) {
      var tipos = tipoAll().filter(function (t) { return !t.simple && !isSimple(t.id) && t.id !== 'pre'; });
      box.innerHTML = '<div class="col" style="gap:10px;padding:0 16px 16px"><div class="lbl">CUSTO</div>' +
        '<div class="cntRow"><span>US$</span><input class="in" id="ccU" inputmode="decimal" placeholder="6,20"><span>lote de</span><input class="in" id="ccQ" inputmode="numeric" value="1" style="max-width:80px"></div>' +
        '<select class="in" id="ccT">' + tipos.map(function (t) { return '<option value="' + esc(t.id) + '">' + esc(t.label || t.full || t.id) + '</option>'; }).join('') + '</select>' +
        '<select class="in" id="ccF">' + S.faixas.map(function (f) { return '<option value="' + f.id + '">Faixa ' + esc(f.nome) + ' · ' + f.margem + '%</option>'; }).join('') + '</select><div id="ccR"></div></div>';
      var conta = function () {
        var u = parseFloat(String($('ccU').value).replace(',', '.')) || 0, q = Math.max(1, +$('ccQ').value || 1), tp = $('ccT').value, f = S.faixas.filter(function (x) { return x.id === $('ccF').value; })[0] || S.faixas[0], fx = cntFx();
        if (!(u > 0) || !fx) { $('ccR').innerHTML = '<div class="hint">Digite o custo em dólar.</div>'; return; }
        var rep = Math.round(u * fx), ct = contasPeca(null, u), col = Math.round(rep * colchao().pct), m = Math.min(0.9, f.margem / 100), piso = up500((rep + ct + col) / (1 - m));
        var par = (S.items || []).filter(function (it) { return it.tipo === tp && it.qty > 0 && effCusto(it) > 0 && Math.abs(effCusto(it) - u) <= u * 0.25; }), vis = {}, pr = [];
        par.forEach(function (it) { if (vis[it.ref]) return; vis[it.ref] = 1; pr.push([it.ref, tFor(it).price]); });
        var med = pr.length ? pr.map(function (x) { return x[1]; }).sort(function (a, b) { return a - b; })[pr.length >> 1] : 0,
          bal = Math.max(piso, Math.ceil(Math.max(piso * 1.6, med) / 5000) * 5000), tab = tabLista().filter(function (T) { return !T.pub; })[0],
          ata = tab ? Math.max((rep + ct + col), u * fx * (1 + tab.m) + (tab.frete || 0) * fx) / fx : 0,
          giro = cntVendas(90).filter(function (s) { return s.tipo === tp; }).reduce(function (a, s) { return a + (+s.qty || 1); }, 0) / 3,
          meses = giro > 0 ? q / giro : 0, lucro = Math.round((bal / 1.1 - rep * (1 + lrIvaCompra()) - ct) * q), coer = !pr.length || (bal >= med * 0.8 && bal <= med * 1.25);
        ML_CALC = { bal: bal, site: typeof sitePreco === 'function' ? sitePreco(bal) : bal, ata: ata, piso: piso };
        $('ccR').innerHTML = '<section class="card col" style="gap:0"><div class="lbl">O CONTADOR SUGERE</div>' + lrLinha('Balcão', gs(bal)) + lrLinha('Site', gs(ML_CALC.site)) + (ata ? lrLinha('Atacado', 'US$ ' + ata.toFixed(2).replace('.', ',')) : '') + lrLinha('Piso', gs(piso)) +
          lrLinha('Parecidos no estoque <small>' + pr.slice(0, 3).map(function (x) { return esc(x[0]) + ' ' + gs(x[1]); }).join(' · ') + '</small>', pr.length ? (coer ? 'coerente' : 'diferente') : '—', coer ? 'var(--ok)' : 'var(--warn)') + '</section>' +
          '<div class="cntQ">💬 "' + (q > 1 ? 'Com ' + q + ' peças' + (giro > 0 ? ' e o giro de ' + Math.round(giro) + ' por mês, o lote vende em ~' + Math.max(1, Math.round(meses)) + (Math.round(meses) > 1 ? ' meses' : ' mês') : '') + '. O lucro previsto do lote é ' + gs(lucro) + '.' : 'Lucro previsto por peça: ' + gs(lucro) + '.') + '"</div>' +
          '<div class="cntB"><button type="button" class="go" data-act="cntCalcUsa">Usar estes preços</button></div>';
      };
      ['ccU', 'ccQ', 'ccT', 'ccF'].forEach(function (id) { $(id).oninput = conta; $(id).onchange = conta; });
      conta();
    } });
  };
  var ML_CALC = null;
  ACT.cntCalcUsa = function () {
    if (!ML_CALC) return;
    S.cntCalc = { ts: Date.now(), bal: ML_CALC.bal, site: ML_CALC.site, ata: ML_CALC.ata };
    saveSoon();
    var t = 'Balcão ' + gs(ML_CALC.bal) + ' · Site ' + gs(ML_CALC.site) + (ML_CALC.ata ? ' · Atacado US$ ' + ML_CALC.ata.toFixed(2).replace('.', ',') : '');
    try { navigator.clipboard.writeText(t); } catch (e) {}
    lfToast('✓ Preços anotados (copiados): ' + t, 'ok');
  };
  // ---------- 4 · E se…? ----------
  var ESE = [['dolar', 'Dólar muda'], ['contas', 'Contas subirem 10%'], ['desc', 'Desconto numa categoria'], ['cupom', 'Cupom 15%'], ['parado', 'Vender tudo parado'], ['meta', 'Meta do mês']];
  function eseConta(k, v) {
    var fx = cntFx(), vs = cntVendas(30), t = lrSoma(vs), porPeca = t.qty ? t.lucro / t.qty : 0, refs = paRefs().filter(function (r) { return paEstoque(r) > 0; });
    if (k === 'dolar') {
      var nfx = +v || fx, k2 = fx ? nfx / fx : 1, abx = 0, sobe = 0;
      refs.forEach(function (r) { var it = itemDoRef(r); if (!it) return; var pp = pisoPeca(it), np = up500(((pp.rep + pp.colch) * k2 + pp.contas) / (1 - pp.margem)); if (tFor(it).price < np) abx++; });
      vs.forEach(function (s) { sobe += (+s.rep || 0) * (k2 - 1); });
      return 'Com o dólar a ' + gs(nfx) + ': o custo de repor sobe ' + Math.round((k2 - 1) * 100) + '%. ' + abx + (abx === 1 ? ' peça fica' : ' peças ficam') + ' abaixo do piso. O lucro do mês ' + (sobe > 0 ? 'cai ' + gs(Math.round(sobe)) : 'sobe ' + gs(Math.round(-sobe))) + ' se você não mexer. Sugestão: subir só as que vendem bem e segurar as paradas.';
    }
    if (k === 'contas') { var tm = typeof totalMensal === 'function' ? totalMensal() : 0, mais = Math.round(tm * ((+v || 10) / 100)); return 'Contas +' + (+v || 10) + '%: mais ' + gs(mais) + ' por mês. Precisa vender ' + (porPeca > 0 ? Math.ceil(mais / porPeca) : '?') + ' peças a mais por mês para empatar, ou subir os preços em média ' + gs(t.qty ? Math.round(mais / t.qty) : 0) + ' por peça.'; }
    if (k === 'desc' || k === 'cupom') {
      var pct = (+v || (k === 'cupom' ? 15 : 10)) / 100, tp = k === 'desc' ? ($('eseT') || {}).value : '', L = cntVendas(90).filter(function (s) { return !tp || s.tipo === tp; }), x = lrSoma(L);
      if (!x.qty) return 'Sem vendas suficientes nos últimos 90 dias para calcular.';
      var antes = x.lucro / x.qty, preco = x.vendido / x.qty, depois = antes - (preco * pct) / 1.1, emp = depois > 0 ? Math.round((antes / depois - 1) * 100) : null;
      return 'Lucro por peça' + (tp ? ' de ' + esc((tipoOf(tp) || {}).label || tp) : '') + ': ' + gs(Math.round(antes)) + ' → ' + gs(Math.round(depois)) + '. ' + (emp == null ? 'Com esse desconto você perde dinheiro em cada venda.' : 'Precisa vender +' + emp + '% para empatar.') + (pct > 0.1 && depois > 0 ? ' Com 10% precisaria de +' + Math.round((antes / (antes - (preco * 0.1) / 1.1) - 1) * 100) + '%.' : '');
    }
    if (k === 'parado') {
      var n = 0, cx = 0, lu = 0;
      refs.forEach(function (r) { if (paParado(r) < 60) return; var it = itemDoRef(r); if (!it) return; var pp = pisoPeca(it), q = paEstoque(r); n += q; cx += pp.piso * q; lu += (pp.piso - pp.rep - pp.contas) * q; });
      return n ? 'Vendendo as ' + n + ' peças paradas há 60+ dias pelo piso: entram ' + gs(cx) + ' no caixa e o lucro fica em ' + gs(lu) + '. Os degraus automáticos já fazem isso aos poucos.' : 'Nenhuma peça parada há 60 dias ou mais. ✓';
    }
    if (k === 'meta') { var d = new Date(), m = lrMes(d.getFullYear(), d.getMonth()), meta = (+v || S.metaUsd || 0) * fx; if (!(meta > 0)) return 'Defina a meta em dólar (campo acima ou em Ajustes › Preços › Contas, taxas e meta).'; var f = meta - m.lucro; return f <= 0 ? 'Meta do mês batida: lucro de ' + gs(m.lucro) + ' (meta ' + gs(Math.round(meta)) + '). ✓' : 'Faltam ' + gs(Math.round(f)) + ' de lucro para a meta. São cerca de ' + (porPeca > 0 ? Math.ceil(f / porPeca) : '?') + ' peças no ritmo de hoje.'; }
    return '';
  }
  ACT.cntEse = function () {
    lfJanela({ titulo: 'E se…?', monta: function (box) {
      var tipos = tipoAll().filter(function (t) { return !t.simple && !isSimple(t.id) && t.id !== 'pre'; });
      box.innerHTML = '<div class="col" style="gap:10px;padding:0 16px 16px"><div class="lbl">PERGUNTAS PRONTAS</div><div class="ataRw">' + ESE.map(function (q, i) { return '<button type="button" class="mini' + (i ? ' ghost' : '') + '" data-ese="' + q[0] + '">' + q[1] + '</button>'; }).join('') + '</div>' +
        '<div class="cntRow" id="eseIn"></div><div class="cntQ" id="eseR" aria-live="polite"></div><div class="hint" style="text-align:center">Só conta: nada muda até você aceitar uma decisão.</div></div>';
      var k = 'dolar';
      var campo = function () {
        var fx = cntFx();
        $('eseIn').innerHTML = k === 'dolar' ? '<span>Dólar a</span><input class="in" id="eseV" inputmode="numeric" value="' + Math.round(fx * 1.04 / 10) * 10 + '">' : k === 'contas' ? '<span>Contas +</span><input class="in" id="eseV" inputmode="numeric" value="10"><span>%</span>' : k === 'desc' ? '<select class="in" id="eseT">' + tipos.map(function (t) { return '<option value="' + esc(t.id) + '">' + esc(t.label || t.full || t.id) + '</option>'; }).join('') + '</select><input class="in" id="eseV" inputmode="numeric" value="15" style="max-width:70px"><span>%</span>' : k === 'cupom' ? '<span>Cupom de</span><input class="in" id="eseV" inputmode="numeric" value="15"><span>%</span>' : k === 'meta' ? '<span>Meta US$</span><input class="in" id="eseV" inputmode="numeric" value="' + (S.metaUsd || '') + '">' : '';
        var vv = $('eseV'), tt = $('eseT'), go = function () { $('eseR').textContent = eseConta(k, vv ? vv.value : ''); };
        if (vv) vv.oninput = go; if (tt) tt.onchange = go; go();
      };
      box.querySelectorAll('[data-ese]').forEach(function (b) { b.onclick = function () { k = b.getAttribute('data-ese'); box.querySelectorAll('[data-ese]').forEach(function (x) { x.classList.toggle('ghost', x !== b); }); campo(); }; });
      campo();
    } });
  };
  // ---------- 5 · fechamento do mês (guardião) ----------
  ACT.cntFech = function () { var d = new Date(), pm = new Date(d.getFullYear(), d.getMonth() - 1, 1), k = pm.getFullYear() + '-' + (pm.getMonth() + 1); S.cntFech[k] = 1; saveSoon(); lfJanela({ titulo: 'Fechamento do mês', monta: function (box) { box.innerHTML = '<div class="col" style="padding:0 16px 16px">' + (cntFechHtml(pm.getFullYear(), pm.getMonth()) || '<div class="hint">Sem vendas no mês passado.</div>') + '</div>'; } }); };
  function cntFechPend() { var d = new Date(); if (d.getDate() > 5) return 0; var pm = new Date(d.getFullYear(), d.getMonth() - 1, 1); return S.cntFech[pm.getFullYear() + '-' + (pm.getMonth() + 1)] ? 0 : 1; }
