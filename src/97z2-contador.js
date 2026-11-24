  // ===== S188 (aprovado 12/11/2026): CONTADOR VIRTUAL — tudo de preço num lugar só =====
  // Números › Preços vira o Contador: 1 saúde dos preços, 2 decisões da semana (Aceitar tudo / um por um),
  // 3 calculadora de preço por custo/lote, 4 "E se…?" com perguntas prontas (só contas do app, sem internet nem IA),
  // 5 no começo do mês, o fechamento do mês anterior. (46b: o interruptor liga no ⏻ do título de Preços; "Contas, taxas e meta" em Preços › Regras.)
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
        L.push({ t: 'tema', tit: t.nome + ' em ' + nDias(t.dias), sub: sem ? 'nenhuma peça entra pela regra' : 'sugestão do tema pronta', v: sem ? 'Por quê' : 'Ver' });
      }
    } catch (e) {}
    try { paPlano().forEach(function (m) { if (m.kind !== 'oferta' && m.kind !== 'fim') return; (pa[m.kind] = pa[m.kind] || { t: 'pa', kind: m.kind, n: 0, itens: [] }).itens.push(m); pa[m.kind].n++; }); } catch (e) {}
    ['oferta', 'fim'].forEach(function (k) { if (pa[k]) L.push(pa[k]); });
    // 65b: as tabelas de atacado saíram daqui — as margens do Titan já dão lucro (Preços › Atacado mostra a conta)
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
      '<div class="cntQ" style="margin-top:8px">"Pode dar até ' + desce + '% de desconto sem perder dinheiro.' + (lucroUnico(ref, p * 0.8) > 0 ? ' Com 20% ainda sobra ' + gs(lucroUnico(ref, p * 0.8)) + ' de lucro."' : '"') + '</div></details>';
  }
  function fichaPreco(det, ref, opt) {
    if (opt.venda || !ref || !det || det.querySelector('.cntP')) return;
    var h = cntPrecoHtml(ref);
    if (h) { var w = document.createElement('div'); w.innerHTML = h; det.appendChild(w.firstChild); }
  }
  // ---------- 3 · Calculadora de preço (66): campos em linhas finas e o MESMO motor do Titan ----------
  // Custo · Tipo › · Peças → Loja e site (como você costuma cobrar: o preço ÷ custo das suas peças do tipo), Mínimo da loja,
  // Atacado (as tabelas do 65b, ataConta), Lucro por peça e do lote. Saíram a faixa de margem fixa (Econômico/Intermediário/Luxo),
  // a fórmula antiga do atacado, "Parecidos no estoque", a frase do contador e "Usar estes preços" (S.cntCalc).
  function calcJeito(tp, fx) {
    var r = [], vis = {};
    (S.items || []).forEach(function (it) {
      if (it.tipo !== tp || vis[it.ref] || !(effCusto(it) > 0) || !(tFor(it).price > 0)) return;
      vis[it.ref] = 1;
      r.push(tFor(it).price / (effCusto(it) * fx));
    });
    r.sort(function (a, b) { return a - b; });
    return r.length ? r[r.length >> 1] : 0;
  }
  function calcConta(u, tp, q) {
    var fx = cntFx(), rep = Math.round(u * fx), ct = contasPeca(null, u), col = Math.round(rep * colchao().pct), min = up500(1.1 * (rep * (1 + lrIvaCompra()) + ct + col)), j = calcJeito(tp, fx), // mínimo = não perde: IVA, reposição, contas e colchão
      loja = Math.max(min, Math.ceil((j > 0 ? u * fx * j : min * 1.6) / 5000) * 5000), site = typeof sitePreco === 'function' ? sitePreco(loja) : loja,
      T = tabLista().filter(function (x) { return !x.pub; }), ata = T.map(function (x) { return { T: x, p: ataConta(x, u).p }; }).sort(function (a, b) { return a.p - b.p; }),
      lu = Math.round(loja / 1.1 - rep * (1 + lrIvaCompra()) - ct);
    return { loja: loja, site: site, min: min, ata: ata, lu: lu, q: q, jeito: j > 0 };
  }
  ACT.cntCalc = function () {
    var tipos = tipoAll().filter(function (t) { return !t.simple && !isSimple(t.id) && t.id !== 'pre'; }), E = { u: 5, tp: (tipos[0] || {}).id, q: 1, ab: false };
    var nome = function (id) { var t = tipos.filter(function (x) { return x.id === id; })[0]; return t ? t.label || t.full || t.id : ''; };
    lfJanela({ titulo: 'Calculadora de preço', cls: 'calcJn', monta: function (box) {
      box.innerHTML = '<p class="ofNm">antes de comprar · o ' + esc(LF_TITAN) + ' calcula</p>' +
        '<label class="cxL"><span>Custo da peça</span><span class="ofPct"><i aria-hidden="true">US$</i><input id="ccU" class="ofCp" inputmode="decimal" value="5,00" aria-label="Custo da peça em dólar"></span></label>' +
        '<button type="button" class="cxL calcTp" id="ccT"><span>Tipo</span><b></b></button>' +
        '<label class="cxL"><span>Peças</span><input id="ccQ" class="ofCp" inputmode="numeric" value="1" aria-label="Quantas peças"></label>' +
        '<div class="lbl tiLb">O ' + esc(LF_TITAN).toUpperCase() + ' CALCULA</div><div id="ccR" aria-live="polite"></div>';
      var conta = function () {
        E.u = parseFloat(String($('ccU').value).replace(',', '.')) || 0;
        E.q = Math.max(1, parseInt($('ccQ').value, 10) || 1);
        box.querySelector('#ccT b').textContent = nome(E.tp) + ' ›';
        if (!(E.u > 0) || !cntFx()) { $('ccR').innerHTML = '<p class="hint">Digite o custo em dólar.</p>'; return; }
        var k = calcConta(E.u, E.tp, E.q), a = k.ata, us = function (v) { return 'US$ ' + v.toFixed(2).replace('.', ','); };
        $('ccR').innerHTML = (k.site === k.loja ? '<div class="cxL"><span>Loja e site<small>' + (k.jeito ? 'como você costuma cobrar' : 'sem peças desse tipo para copiar o seu jeito') + '</small></span><b>' + gs(k.loja) + '</b></div>'
            : '<div class="cxL"><span>Loja<small>' + (k.jeito ? 'como você costuma cobrar' : 'sem peças desse tipo para copiar o seu jeito') + '</small></span><b>' + gs(k.loja) + '</b></div><div class="cxL"><span>Site</span><b>' + gs(k.site) + '</b></div>') +
          '<div class="cxL"><span>Mínimo da loja</span><b class="mu">' + gs(k.min) + '</b></div>' +
          (a.length ? '<button type="button" class="cxL calcAt" aria-expanded="' + E.ab + '"><span>Atacado<small>as ' + a.length + ' tabelas ' + (E.ab ? '⌃' : '⌄') + '</small></span><b>' + us(a[0].p) + ' a ' + us(a[a.length - 1].p) + '</b></button>' +
            (E.ab ? a.map(function (x) { return '<div class="cxL calcAtL"><span>' + esc(x.T.nome) + '</span><b class="mu">' + us(x.p) + '</b></div>'; }).join('') : '') : '') +
          '<div class="cxL"><span>Lucro por peça</span><b class="ok">' + gs(k.lu) + '</b></div>' +
          (k.q > 1 ? '<div class="cxL"><span>Lucro das ' + k.q + '</span><b class="ok">' + gs(k.lu * k.q) + '</b></div>' : '');
        var at = $('ccR').querySelector('.calcAt');
        if (at) at.onclick = function () { E.ab = !E.ab; conta(); };
      };
      ['ccU', 'ccQ'].forEach(function (id) { $(id).oninput = conta; $(id).onfocus = function () { try { $(id).select(); } catch (e) {} }; });
      box.querySelector('#ccT').onclick = function () {
        escolhaJanela('Tipo', tipos.map(function (t) { return t.label || t.full || t.id; }), nome(E.tp), function (v) {
          var t = tipos.filter(function (x) { return (x.label || x.full || x.id) === v; })[0];
          if (t) E.tp = t.id;
          conta();
        }, null, true);
      };
      conta();
    } });
  };
  // ---------- 4 · E se…? (66): perguntas em linhas ⌄, cada uma com o campo e a resposta ali mesmo; só conta, nada muda ----------
  // Saíram "Desconto numa categoria" e a de vender as paradas pelo piso (os degraus fixos saem com a mola); entrou "Fornecedor sobe".
  var ESE = [['dolar', 'Dólar da casa', 'o que acontece com os preços'], ['forn', 'Fornecedor sobe', 'e o colchão aguenta?'], ['cupom', 'Cupom', 'quanto lucro fica por peça'],
    ['contas', 'Contas sobem', 'quanto a mais precisa vender'], ['meta', 'Meta do mês', 'quanto falta e em quantos dias']];
  function eseConta(k, v) {
    var fx = cntFx(), vs = cntVendas(30), t = lrSoma(vs), porPeca = t.qty ? t.lucro / t.qty : 0, refs = paRefs().filter(function (r) { return paEstoque(r) > 0; });
    if (k === 'dolar') {
      var nfx = +v || fx, k2 = fx ? nfx / fx : 1, abx = 0, sobe = 0;
      refs.forEach(function (r) { var it = itemDoRef(r); if (!it) return; var pp = pisoPeca(it), np = up500(((pp.rep + pp.colch) * k2 + pp.contas) / (1 - pp.margem)); if (tFor(it).price < np) abx++; });
      vs.forEach(function (s) { sobe += (+s.rep || 0) * (k2 - 1); });
      return 'Com a venda da casa a ' + gs(nfx) + ', o custo de repor ' + (k2 >= 1 ? 'sobe ' : 'cai ') + Math.abs(Math.round((k2 - 1) * 100)) + '%. ' + cntPl(abx, 'preço fica', 'preços ficam') + ' abaixo da sua margem. O lucro do mês ' + (sobe > 0 ? 'cai ' + gs(Math.round(sobe)) : 'sobe ' + gs(Math.round(-sobe))) + ' se nada mudar. O atacado não muda: ele é em dólar.';
    }
    if (k === 'forn') {
      var p = (+v || 10) / 100, c = colchao().pct, ca = (S.ataCalc && S.ataCalc.c) || 0.03;
      return 'Fornecedor ' + Math.round(p * 100) + '% mais caro: ' + (p <= c ? 'o colchão do varejo (' + Math.round(c * 100) + '%) cobre a reposição.' : 'passa do colchão do varejo (' + Math.round(c * 100) + '%): as peças dessa compra precisam de preço novo.') + ' No atacado o colchão é ' + Math.round(ca * 100) + '%' + (p <= ca ? ' e cobre.' : ': o ' + LF_TITAN + ' recalcula as margens na próxima revisão.') + ' As peças que você já tem ficam com o preço de hoje.';
    }
    if (k === 'cupom') {
      var pct = (+v || 15) / 100, L = cntVendas(90), x = lrSoma(L);
      if (!x.qty) return 'Sem vendas suficientes nos últimos 90 dias para calcular.';
      var antes = x.lucro / x.qty, preco = x.vendido / x.qty, depois = antes - (preco * pct) / 1.1, emp = depois > 0 ? Math.round((antes / depois - 1) * 100) : null;
      return 'Lucro por peça: ' + gs(Math.round(antes)) + ' → ' + gs(Math.round(depois)) + '. ' + (emp == null ? 'Com esse cupom você perde dinheiro em cada venda.' : 'Precisa vender ' + emp + '% a mais para empatar.');
    }
    if (k === 'contas') { var tm = typeof totalMensal === 'function' ? totalMensal() : 0, mais = Math.round(tm * ((+v || 10) / 100)); return 'Contas +' + (+v || 10) + '%: mais ' + gs(mais) + ' por mês. Precisa vender ' + (porPeca > 0 ? cntPl(Math.ceil(mais / porPeca), 'peça', 'peças') : '?') + ' a mais por mês para empatar.'; }
    if (k === 'meta') {
      var d = new Date(), m = lrMes(d.getFullYear(), d.getMonth()), meta = (+v || S.metaUsd || 0) * fx, dias = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() - d.getDate();
      if (!(meta > 0)) return 'Escreva a meta em dólar.';
      var f = meta - m.lucro;
      return f <= 0 ? 'Meta do mês batida: lucro de ' + gs(m.lucro) + ' (meta ' + gs(Math.round(meta)) + ').' : 'Faltam ' + gs(Math.round(f)) + ' de lucro em ' + nDias(dias) + ': cerca de ' + (porPeca > 0 ? cntPl(Math.ceil(f / porPeca), 'peça', 'peças') : '? peças') + ' no ritmo de hoje.';
    }
    return '';
  }
  function eseCampo(k) {
    var fx = cntFx();
    return k === 'dolar' ? ['Venda da casa a', 'G$', Math.round(fx * 1.04 / 10) * 10] : k === 'forn' ? ['Fornecedor sobe', '%', 10] : k === 'cupom' ? ['Cupom de', '%', 15] : k === 'contas' ? ['Contas sobem', '%', 10] : ['Meta do mês', 'US$', S.metaUsd || ''];
  }
  ACT.cntEse = function () {
    var ab = 'dolar';
    lfJanela({ titulo: 'E se…?', cls: 'eseJn', monta: function (box) {
      var pinta = function () {
        box.innerHTML = '<p class="ofNm">só conta: nada muda até você aceitar</p>' + ESE.map(function (q) {
          var on = ab === q[0], c = eseCampo(q[0]);
          return '<section class="fxF' + (on ? ' on' : '') + '"><button type="button" class="fxH" data-k="' + q[0] + '" aria-expanded="' + on + '"><span style="min-width:0"><b>' + q[1] + '</b><span class="hint" style="display:block;margin:2px 0 0">' + q[2] + '</span></span><i class="fxC" aria-hidden="true">⌄</i></button>' +
            (on ? '<div class="fxB"><div class="fxI"><label class="cxL"><span>' + c[0] + '</span><span class="ofPct">' + (c[1] !== '%' ? '<i aria-hidden="true">' + c[1] + '</i>' : '') + '<input class="ofCp" id="eseV" inputmode="numeric" value="' + c[2] + '" aria-label="' + c[0] + '">' + (c[1] === '%' ? '<i aria-hidden="true">%</i>' : '') + '</span></label><p class="eseR" id="eseR" aria-live="polite"></p></div></div>' : '') + '</section>';
        }).join('');
        box.querySelectorAll('.fxH').forEach(function (b) { b.onclick = function () { var k = b.getAttribute('data-k'); ab = ab === k ? '' : k; pinta(); }; });
        var vv = $('eseV'), go = function () { $('eseR').textContent = eseConta(ab, vv.value.replace(/\D/g, '')); };
        if (vv) { vv.oninput = go; go(); }
      };
      pinta();
    } });
  };
  // ---------- 5 · fechamento do mês (guardião) ----------
  ACT.cntFech = function () { var d = new Date(), pm = new Date(d.getFullYear(), d.getMonth() - 1, 1), k = pm.getFullYear() + '-' + (pm.getMonth() + 1); S.cntFech[k] = 1; saveSoon(); lfJanela({ titulo: 'Fechamento do mês', monta: function (box) { box.innerHTML = '<div class="col" style="padding:0 16px 16px">' + (cntFechHtml(pm.getFullYear(), pm.getMonth()) || '<div class="hint">Sem vendas no mês passado.</div>') + '</div>'; } }); };
  function cntFechPend() { var d = new Date(); if (d.getDate() > 5) return 0; var pm = new Date(d.getFullYear(), d.getMonth() - 1, 1); return S.cntFech[pm.getFullYear() + '-' + (pm.getMonth() + 1)] ? 0 : 1; }
