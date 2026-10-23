  // ===== Histórico: resumo por mês, busca, filtros, calendário e carregamento aos poucos. =====
  S.hq = '';
  S.hF = { tipo: '', forma: '', faixa: '', moeda: '', vmin: '', vmax: '' };
  S.hFopen = false;
  S.hDias = 30;
  S.hLim = 30;
  var HTIPOS = [
    ['venda', 'Venda'],
    ['estorno', 'Estorno'],
    ['pago', 'Conta paga'],
    ['ret', 'Retirada'],
    ['imp', 'Imprevisto'],
    ['melh', 'Melhorias'],
    ['lote', 'Compra de lote'],
    ['descarte', 'Descarte'],
    ['confcx', 'Conferência'],
    ['outro', 'Câmbio / estoque']
  ];
  // Há busca ou filtro ligado?
  function hFiltrando() {
    var f = S.hF;
    return !!(S.hq.trim() || f.tipo || f.forma || f.faixa || f.moeda || f.vmin || f.vmax);
  }
  // Todos os movimentos como itens pesquisáveis.
  function hItens() {
    var out = [];
    S.sales.forEach(function (s) {
      var ms = (s.pags && s.pags.length ? s.pags.map(function (p) { return p.moeda; }) : [s.moeda || 'pyg']);
      out.push({
        ts: s.ts,
        tipo: s.estorno ? 'estorno' : 'venda',
        txt: (descOf(s) + ' ' + s.id + ' ' + (s.ref || '')).toLowerCase(),
        forma: s.forma || '',
        faixa: s.faixa || '',
        moedas: ms,
        valor: s.price || 0,
        html: saleCard(s)
      });
    });
    S.dlog.forEach(function (x) {
      var i = dlogInfo(x);
      out.push({
        ts: x.ts,
        tipo: x.kind === 'descarte' ? 'descarte' : x.kind,
        txt: i.search,
        forma: '',
        faixa: '',
        moedas: x.moeda ? [x.moeda] : [],
        valor: x.valor || 0,
        html: dlogCard(x)
      });
    });
    S.elog.forEach(function (x) {
      out.push({
        ts: x.ts,
        tipo: 'outro',
        txt: ('entrada de estoque ' + x.ref + ' ' + (x.cor || '')).toLowerCase(),
        forma: '',
        faixa: '',
        moedas: [],
        valor: 0,
        html: elogCard(x)
      });
    });
    S.cambios.forEach(function (x) {
      out.push({
        ts: x.ts,
        tipo: 'outro',
        txt: 'troca de moeda câmbio',
        forma: '',
        faixa: '',
        moedas: [x.de, x.para],
        valor: 0,
        html:
          '<div class="card" style="padding:14px"><span class="cell">Troca de moeda</span><div style="margin-top:6px">' +
          fmtM(x.dado, x.de) + ' → ' + fmtM(x.rec, x.para) +
          '</div><div class="hint" style="margin:2px 0 0">' + fd(x.ts) + ' às ' + fh(x.ts) + '</div></div>'
      });
    });
    return out.sort(function (a, b) { return b.ts - a.ts; });
  }
  // Aplica busca e filtros.
  function hFiltrar(itens) {
    var f = S.hF,
      q = S.hq.trim().toLowerCase(),
      vmin = toNum(f.vmin),
      vmax = toNum(f.vmax);
    return itens.filter(function (it) {
      if (q && it.txt.indexOf(q) < 0) return false;
      if (f.tipo && it.tipo !== f.tipo) return false;
      if (f.forma && it.forma !== f.forma) return false;
      if (f.faixa && it.faixa !== f.faixa) return false;
      if (f.moeda && it.moedas.indexOf(f.moeda) < 0) return false;
      if (vmin && it.valor < vmin) return false;
      if (vmax && it.valor > vmax) return false;
      return true;
    });
  }
  function hChip(grp, val, nome) {
    var on = S.hF[grp] === val;
    return '<button type="button" class="chip' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-act="hfil" data-id="' + grp + '|' + val + '">' + esc(nome) + '</button>';
  }
  // Painel de filtros.
  function hFiltrosHtml() {
    var f = S.hF;
    var h = '<section class="card col" style="gap:10px"><div class="lbl">Tipo de movimento</div><div class="nav">';
    HTIPOS.forEach(function (t) { h += hChip('tipo', t[0], t[1]); });
    h += '</div><div class="lbl">Forma de pagamento</div><div class="nav">';
    S.formas.forEach(function (x) { h += hChip('forma', x.id, x.nome); });
    h += '</div><div class="lbl">Faixa</div><div class="nav">';
    (S.faixas || []).forEach(function (x) { h += hChip('faixa', x.id, x.nome || x.id); });
    h += '</div><div class="lbl">Moeda</div><div class="nav">' + hChip('moeda', 'pyg', 'G$') + hChip('moeda', 'usd', 'US$') + hChip('moeda', 'brl', 'R$');
    h += '</div><div class="lbl">Valor em G$</div><div class="sel"><input class="in" inputmode="numeric" data-in="hvmin" placeholder="De" value="' + esc(f.vmin) + '" aria-label="Valor mínimo" style="flex:1"><input class="in" inputmode="numeric" data-in="hvmax" placeholder="Até" value="' + esc(f.vmax) + '" aria-label="Valor máximo" style="flex:1"></div>';
    return h + '<button type="button" class="chip" data-act="hlimpar">Limpar tudo</button></section>';
  }
  var MES_NOME = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  // Cartão de um dia.
  function hDiaCard(k, today) {
    var st = dayStats(k),
      d = new Date(dayEnd(k)),
      wd = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    return (
      '<button class="pcard" data-act="opendia" data-id="' + k + '" aria-label="Abrir o dia ' + fmtDay(k) + '" style="gap:10px;padding:14px">' +
      '<span style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><b style="font-size:18px">' + fmtDay(k).slice(0, 5) + (k === today ? ' · hoje' : '') +
      '</b><span class="hint" style="margin:0;text-transform:capitalize">' + wd + '</span></span>' +
      '<span style="font-size:22px;font-weight:800;font-variant-numeric:tabular-nums">' + gs(st.vend) + '</span>' +
      '<span class="pills"><span class="cell">' + st.n + ' venda(s)' + (st.est ? ' · ' + st.est + ' estornada(s)' : '') + '</span>' +
      (st.extra || st.nd ? '<span class="cell low">' + (st.extra ? 'gastos ' + gs(st.extra) : st.nd + ' despesa(s)') + '</span>' : '') +
      (st.outros ? '<span class="cell">' + st.outros + ' outro(s)</span>' : '') + '</span>' +
      '<span class="hint" style="margin:0">' + (st.fx ? 'Dólar G$ ' + dots(st.fx.p.pyg) : 'Sem cotação') + ' · lucro livre ' + gs(st.liv) + '</span></button>'
    );
  }
  // Lista (dias com resumo por mês, ou resultados da busca).
  function hListaHtml() {
    var today = dayKey(Date.now());
    if (hFiltrando()) {
      var r = hFiltrar(hItens()),
        n = Math.min(r.length, S.hLim);
      var h = '<div class="hint" style="margin:0">' + r.length + ' resultado(s)</div><div class="col">';
      for (var i = 0; i < n; i++) h += '<div>' + r[i].html + '</div>';
      h += '</div>';
      if (r.length > n) h += '<button type="button" class="mini" data-act="hmais">Mostrar mais (' + (r.length - n) + ')</button>';
      if (!r.length) h = '<div class="note">Nada encontrado com esses filtros.</div>';
      return h;
    }
    var act = activeDays();
    act[today] = act[today] || { v: 0, d: 0, o: 0 };
    var keys = Object.keys(act).sort().reverse(),
      corte = dayKey(Date.now() - S.hDias * DAY),
      vis = keys.filter(function (k) { return k >= corte; }),
      html = '',
      mes = '';
    vis.forEach(function (k) {
      var ym = k.slice(0, 7);
      if (ym !== mes) {
        if (mes) html += '</div>';
        mes = ym;
        var tv = 0, tn = 0, tl = 0;
        keys.forEach(function (j) {
          if (j.slice(0, 7) !== ym) return;
          var s = dayStats(j);
          tv += s.vend; tn += s.n; tl += s.liv;
        });
        html +=
          '<div class="lbl" style="margin:14px 0 6px;text-transform:capitalize">' + MES_NOME[+ym.slice(5) - 1] + ' de ' + ym.slice(0, 4) +
          '</div><div class="hint" style="margin:0 0 8px">Mês todo: ' + gs(tv) + ' em ' + tn + ' venda(s) · lucro livre ' + gs(tl) +
          '</div><div class="list" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">';
      }
      html += hDiaCard(k, today);
    });
    if (mes) html += '</div>';
    var mais = keys.length - vis.length;
    if (mais > 0)
      html += '<button type="button" class="mini" data-act="hmais" style="margin-top:12px">Carregar mais 30 dias (' + mais + ' dia(s) com movimento)</button>';
    return html;
  }
  // Redesenha só a lista (mantém o campo de busca com o foco).
  function histLista() {
    var b = $('hRes');
    if (b) b.innerHTML = hListaHtml();
  }
  // Aba Histórico.
  function histRender() {
    var el = $('v-hist');
    if (!el) return;
    var ativo = hFiltrando();
    el.innerHTML =
      '<div class="top"><div><h1>Histórico</h1><div class="crumb">Busque, filtre ou toque num dia para abrir tudo o que aconteceu nele.</div></div></div>' +
      '<section class="card col" style="gap:10px"><div class="sel"><input class="in" id="hq" type="search" data-in="hq" placeholder="Buscar produto, código, conta..." value="' + esc(S.hq) + '" aria-label="Buscar no histórico" style="flex:1">' +
      '<button type="button" class="chip" data-act="hcal" aria-label="Ir para uma data" title="Ir para uma data" style="min-width:44px">📅</button>' +
      '<button type="button" class="chip' + (S.hFopen || ativo ? ' on' : '') + '" data-act="hfopen" aria-expanded="' + !!S.hFopen + '">Filtros</button></div>' +
      '<input type="date" class="in" id="hDate" data-in="hdate" max="' + dayKey(Date.now()) + '" aria-label="Ir para o dia" hidden></section>' +
      (S.hFopen ? '<div id="hFil">' + hFiltrosHtml() + '</div>' : '') +
      '<div id="hRes">' + hListaHtml() + '</div>';
  }
  document.addEventListener('input', function (ev) {
    var t = ev.target,
      k = t.getAttribute && t.getAttribute('data-in');
    if (k === 'hq' || k === 'hvmin' || k === 'hvmax') {
      if (k === 'hq') S.hq = t.value;
      else S.hF[k === 'hvmin' ? 'vmin' : 'vmax'] = t.value.replace(/\D/g, '');
      S.hLim = 30;
      histLista();
    }
  });
  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t.getAttribute && t.getAttribute('data-in') === 'hdate' && t.value) ACT.opendia(t.value);
  });
  ACT.hfopen = function () {
    S.hFopen = !S.hFopen;
    histRender();
  };
  ACT.hfil = function (id) {
    var p = id.split('|');
    S.hF[p[0]] = S.hF[p[0]] === p[1] ? '' : p[1];
    S.hLim = 30;
    histRender();
  };
  ACT.hlimpar = function () {
    S.hq = '';
    S.hF = { tipo: '', forma: '', faixa: '', moeda: '', vmin: '', vmax: '' };
    S.hLim = 30;
    histRender();
  };
  ACT.hmais = function () {
    if (hFiltrando()) S.hLim += 30;
    else S.hDias += 30;
    histLista();
  };
  ACT.hcal = function () {
    var d = $('hDate');
    if (!d) return;
    d.hidden = false;
    if (d.showPicker) {
      try {
        d.showPicker();
        return;
      } catch (e) {}
    }
    d.focus();
  };
