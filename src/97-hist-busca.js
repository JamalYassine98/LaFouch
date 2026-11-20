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
      vmin = campoParaGs(f.vmin),
      vmax = campoParaGs(f.vmax);
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
    h += '</div><div class="lbl">Valor em ' + mpSim() + '</div><div class="sel"><input class="in" inputmode="' + mpMode() + '" data-in="hvmin" placeholder="De" value="' + esc(f.vmin) + '" aria-label="Valor mínimo" style="flex:1"><input class="in" inputmode="numeric" data-in="hvmax" placeholder="Até" value="' + esc(f.vmax) + '" aria-label="Valor máximo" style="flex:1"></div>';
    return h + '<button type="button" class="chip" data-act="hlimpar">Limpar tudo</button></section>';
  }
  var MES_NOME = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  // Cartão de um dia.
  // S374 (esboço 71, aprovado 16/11 17:01): plural certo no lugar de "(s)"
  function hPl(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }
  // S374 (esboço 71): o dia em 2 linhas — data · dia da semana, valor, › / "8 vendas · 1 despesa · lucro livre"; sem pílulas e sem o dólar
  function hDiaCard(k, today) {
    var st = dayStats(k),
      d = new Date(dayEnd(k)),
      wd = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      mt = [hPl(st.n, 'venda', 'vendas') + (st.est ? ' (' + hPl(st.est, 'estornada', 'estornadas') + ')' : '')];
    if (st.extra) mt.push('<span class="w">gastos ' + gs(st.extra) + '</span>');
    else if (st.nd) mt.push('<span class="w">' + hPl(st.nd, 'despesa', 'despesas') + '</span>');
    if (st.outros) mt.push(hPl(st.outros, 'outro', 'outros'));
    mt.push('lucro livre ' + gs(st.liv));
    return (
      '<button class="pcard hDia" data-act="opendia" data-id="' + k + '" aria-label="Abrir o dia ' + fmtDay(k) + '">' +
      '<span class="d71"><span class="dt">' + fmtDay(k).slice(0, 5) + (k === today ? ' · hoje' : '') + '<small>' + wd + '</small></span>' +
      '<span class="vl">' + gs(st.vend) + '</span><span class="ch" aria-hidden="true">›</span><span class="mt">' + mt.map(function (x) { return '<span class="p104">' + x + '</span>'; }).join(' · ') + '</span></span></button>' // S374 (104c): a frase só quebra entre as partes
    );
  }
  // Lista (dias com resumo por mês, ou resultados da busca).
  function hListaHtml() {
    var today = dayKey(Date.now());
    if (hFiltrando()) {
      var r = hFiltrar(hItens()),
        n = Math.min(r.length, S.hLim);
      var h = '<div class="cxLb" style="margin:14px 0 2px">' + r.length + (r.length === 1 ? ' resultado' : ' resultados') + '</div><div class="col hb418">'; // S418 (123b)
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
    // S374 (esboço 58b): esta semana e a passada abertas; as anteriores viram uma linha por semana (total · vendas · dias) que abre
    var seg = function (k) { var d = new Date(k + 'T12:00:00'); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return dayKey(d.getTime()); },
      lim = (function () { var d = new Date(seg(today) + 'T12:00:00'); d.setDate(d.getDate() - 7); return dayKey(d.getTime()); })(),
      sem = {}, semFeita = {}, semAb = '';
    S.hSem = S.hSem || {};
    vis.forEach(function (k) {
      if (k >= lim) return;
      var g = seg(k) + '|' + k.slice(0, 7), st = dayStats(k);
      sem[g] = sem[g] || { v: 0, n: 0, d: 0 };
      sem[g].v += st.vend; sem[g].n += st.n; sem[g].d++;
    });
    vis.forEach(function (k) {
      var ym = k.slice(0, 7);
      if (ym !== mes) {
        if (semAb) { html += '</div>'; semAb = ''; }
        if (mes) html += '</div>';
        mes = ym;
        var tv = 0, tn = 0, tl = 0;
        keys.forEach(function (j) {
          if (j.slice(0, 7) !== ym) return;
          var s = dayStats(j);
          tv += s.vend; tn += s.n; tl += s.liv;
        });
        html +=
          '<div class="lbl" style="margin:14px 0 6px">' + cap1(MES_NOME[+ym.slice(5) - 1]) + ' de ' + ym.slice(0, 4) +
          '</div><div class="m71"><span>' + hPl(tn, 'venda', 'vendas') + ' · lucro livre ' + gs(tl) + '</span><b>' + gs(tv) + '</b>' +
          '</div><div class="list" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">';
      }
      if (k < lim) {
        var g = seg(k) + '|' + ym;
        if (!semFeita[g]) {
          semFeita[g] = 1;
          if (semAb) { html += '</div>'; semAb = ''; }
          // S374 (esboço 71): semana partida entre 2 meses mostra só as datas deste mês
          var d0 = new Date(seg(k) + 'T12:00:00'), d1 = new Date(d0.getTime() + 6 * DAY), dd = function (d) { return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2); }, ab = !!S.hSem[g];
          var m0 = new Date(+ym.slice(0, 4), +ym.slice(5) - 1, 1, 12), m1 = new Date(+ym.slice(0, 4), +ym.slice(5), 0, 12);
          if (d0 < m0) d0 = m0;
          if (d1 > m1) d1 = m1;
          html += '<button type="button" class="card hSem" data-act="hSem" data-id="' + g + '" aria-expanded="' + ab + '"><span class="ecNm"><b>Semana ' + (dd(d0) === dd(d1) ? dd(d0) : dd(d0) + ' a ' + dd(d1)) + '</b><small>' + gs(sem[g].v) + ' · ' + hPl(sem[g].n, 'venda', 'vendas') + ' · ' + hPl(sem[g].d, 'dia', 'dias') + '</small></span><span class="ecCh" aria-hidden="true">⌄</span></button>';
          if (ab) { html += '<div class="hSemB" data-sem="' + g + '">'; semAb = g; }
        }
        if (!S.hSem[g]) return;
      } else if (semAb) { html += '</div>'; semAb = ''; }
      html += hDiaCard(k, today);
    });
    if (semAb) html += '</div>';
    if (mes) html += '</div>';
    var mais = keys.length - vis.length;
    if (mais > 0)
      html += '<div class="mais71"><button type="button" class="lcT" data-act="hmais">Carregar mais 30 dias ›</button><small>' + hPl(mais, 'dia', 'dias') + ' com movimento</small></div>';
    return html;
  }
  // S374: a semana abre e fecha como na Apple (mesma animação dos blocos)
  ACT.hSem = function (g) {
    S.hSem = S.hSem || {};
    var q = function () { return document.querySelector('#hRes .hSemB[data-sem="' + g + '"]'); },
      bt = function () { return document.querySelector('#hRes .hSem[data-id="' + g + '"]'); },
      an = typeof window.__lfFold === 'function' ? window.__lfFold : null;
    if (S.hSem[g]) {
      var c = q(), b0 = bt();
      if (an && c) {
        if (b0) b0.setAttribute('aria-expanded', 'false');
        return an(c, c, b0 && b0.querySelector('.ecCh'), false, function () { S.hSem[g] = false; histLista(); });
      }
      S.hSem[g] = false;
      return histLista();
    }
    S.hSem[g] = true;
    histLista();
    var c2 = q(), b2 = bt();
    if (an && c2) an(c2, c2, b2 && b2.querySelector('.ecCh'), true);
  };
  // Redesenha só a lista (mantém o campo de busca com o foco).
  function histLista() {
    var b = $('hRes');
    if (b) b.innerHTML = hListaHtml();
    padTela();
  }
  // Aba Histórico.
  function histRender() {
    var el = $('v-hist');
    if (!el) return;
    var ativo = hFiltrando();
    el.innerHTML =
      '<div class="top"><div><h1>Histórico</h1><div class="crumb">Todas as vendas, dia por dia.</div></div></div>' +
      // S374 (esboço 71): busca sem a caixa em volta; 📅 e "Filtros" viram ícones de linha (44 px), como no Inventário
      '<section class="col hBusca" style="gap:10px"><div class="sel"><input class="in" id="hq" type="search" data-in="hq" placeholder="Buscar produto ou conta" value="' + esc(S.hq) + '" aria-label="Buscar no histórico" style="flex:1">' +
      '<button type="button" class="ic71" data-act="hcal" aria-label="Ir para uma data" title="Ir para uma data"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg></button>' +
      '<button type="button" class="ic71' + (S.hFopen || ativo ? ' on' : '') + '" data-act="hfopen" aria-label="Filtros" aria-expanded="' + !!S.hFopen + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg></button></div>' +
      '<input type="date" class="in" id="hDate" data-in="hdate" max="' + dayKey(Date.now()) + '" aria-label="Ir para o dia" hidden></section>' +
      (window.__revBannerHtml ? window.__revBannerHtml() : '') +
      (S.hFopen ? '<div id="hFil">' + hFiltrosHtml() + '</div>' : '') +
      // S363 (esboço 45b): o Histórico só lista os dias; o "Fechamento do caixa" mora no Dashboard › Hoje
      '<div id="hRes">' + hListaHtml() + '</div>' +
      arqHtml() +
      (window.__revJanelaHtml ? window.__revJanelaHtml() : '');
  }
  document.addEventListener('input', function (ev) {
    var t = ev.target,
      k = t.getAttribute && t.getAttribute('data-in');
    if (k === 'hq' || k === 'hvmin' || k === 'hvmax') {
      if (k === 'hq') S.hq = t.value;
      else S.hF[k === 'hvmin' ? 'vmin' : 'vmax'] = t.value.replace(/[^\d.,]/g, '');
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
    if (S.hFopen) {
      var b = document.querySelector('#v-hist [data-act="hlimpar"]'),
        s = b && b.closest('section');
      if (s) animEnter(s);
    }
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
