  // ===== S362 (16/11/2026) · DASHBOARD FINAL — esboço 48, aprovado em 15/11 18:48 (work/s356/48-…) + moedas (15/11 18:56 e 19:01) =====
  // Uma tela "Dashboard ⌄". O período se escolhe no seletor do topo (o que já existia): em "Hoje" aparecem os blocos do dia;
  // nos outros períodos, 3 números (Vendido, Lucro livre, Meta do mês), "O que fazer agora" e os detalhes em linhas que abrem.
  // Sem trilho Dia | Mês e sem calendário: dia que não é hoje se vê no Histórico. A tabela "Quanto separar" é o único lugar das
  // 3 moedas; as linhas "Trocar … por US$ …" ficam nela e levam ao Câmbio › Registrar troca já preenchido.
  // Feito como os outros módulos de família (97y): a tela é desenhada como antes e arrumada em seguida — os números são os mesmos.
  DTABS[0][1] = 'Dashboard';
  S._d48 = {}; // linhas de detalhe abertas (só na sessão)
  S.dMoeda = 'pyg'; // moeda dos 3 números (tocar no número troca: G$ → R$ → US$)
  function d48Hoje() {
    return S.view === 'dia' && S.day === dayKey(Date.now());
  }
  function d48Txt(e) {
    return ((e && (e.innerText || e.textContent)) || '').replace(/\s+/g, ' ').trim();
  }
  // valor em G$ → texto na moeda escolhida para os 3 números
  function d48Val(g) {
    if (S.dMoeda === 'brl') return 'R$ ' + ((g / S.fx.pyg) * S.fx.brl).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (S.dMoeda === 'usd') return usd(g / S.fx.pyg);
    return gs(Math.round(g));
  }
  ACT.d48Moeda = function () {
    S.dMoeda = S.dMoeda === 'pyg' ? 'brl' : S.dMoeda === 'brl' ? 'usd' : 'pyg';
    render();
  };
  ACT.d48Res = function () { S.dTab = 'din'; setView('dash'); };
  ACT.d48Abre = function (k) {
    S._d48[k] = !S._d48[k];
    render();
  };
  // "Trocar R$ … por US$ …" → Câmbio › Registrar troca, já com a moeda e o valor
  ACT.d48Troca = function (id) {
    var p = String(id || '').split('|');
    S.trPre = { m: p[0], v: +p[1] || 0, ts: Date.now() };
    setView('fx');
    setTimeout(function () {
      try {
        var v = $('v-fx'), b = v && [].filter.call(v.querySelectorAll('button,[data-act]'), function (e) { return /Registrar troca/.test(e.textContent || ''); })[0];
        if (b) b.click();
        setTimeout(function () {
          var cx = document.querySelector('.fjJn') || v;
          if (!cx || !p[1]) return;
          // o campo certo pela etiqueta: "Entreguei R$" (reposição) ou "Você troca (G$)" (outra troca)
          // S418 (126b): os campos pelo id (a etiqueta mudou para linhas "Entreguei" / "Você troca")
          var inp = p[0] === 'brl' ? cx.querySelector('input[data-in=trv]') : cx.querySelector('#trV');
          if (!inp) return;
          inp.value = p[0] === 'brl' ? (+p[1]).toFixed(2).replace('.', ',') : String(Math.round(+p[1]));
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          try { inp.scrollIntoView({ block: 'center' }); } catch (e) {}
        }, 380);
      } catch (e) {}
    }, 320);
  };
  // ---------- período ≠ Hoje (tela v-dash, parte "Dashboard") ----------
  function d48Mes() {
    var v = $('v-dash'), B = $('dtabBody');
    if (!v || !B || S.view !== 'dash' || S.dTab !== 'hoje' || B.querySelector('.esLs')) return;
    var ks = B.querySelector('section.kpis');
    if (!ks) return;
    var k = [].slice.call(ks.children).filter(function (e) { return e.classList.contains('kpi'); });
    if (k.length < 4) return;
    var ps = vendasPeriodo(), tot = sumBy(ps, 'price'), spL = separacaoMoedas(ps).livre, soG = MOE3.every(function (m) { return m === MOE3[0] || !(spL[m] > 0); }), liv = soG ? spL[MOE3[0]] || 0 : eq3(spL), vend = k[0], sep = k[1], luc = k[2], dol = k[3];
    // Vendido: o total numa moeda só; embaixo, as peças e o que entrou em cada moeda
    var hint = d48Txt(vend.querySelector('.hint')).replace(/^≈ G\$ [0-9.]+ · /, ''), entrou = recebidoDe(ps);
    vend.innerHTML = '<div class="lbl">Vendido</div><b data-act="d48Moeda" role="button" tabindex="0" aria-label="Vendido: trocar a moeda">' + d48Val(tot) + '</b><div class="hint">' + esc(hint) + '</div>' +
      (entrou ? '<div class="hint">Entrou: ' + esc(entrou) + '</div>' : '');
    luc.innerHTML = '<div class="lbl">Lucro livre</div><b data-act="d48Moeda" role="button" tabindex="0" aria-label="Lucro livre: trocar a moeda" style="color:var(--ok)">' + d48Val(S.dMoeda === 'pyg' ? Math.round(liv / 100) * 100 : liv) + '</b><div class="hint">' + (tot ? pc(liv / tot) : '0%') + ' do vendido</div>';
    var mt = B.querySelector('.mtCard'), mk = null;
    if (mt) {
      var big = mt.querySelector('.paBig'), bar = mt.querySelector('.mtBar'), meta = d48Txt(mt.querySelector('.paMt span:last-child'));
      mk = document.createElement('div');
      mk.className = 'kpi';
      var mg = parseInt(d48Txt(big).replace(/\D/g, ''), 10) || 0;
      mk.innerHTML = '<div class="lbl">Meta do mês</div><b data-act="d48Moeda" role="button" tabindex="0" aria-label="Meta do mês: trocar a moeda">' + (/^G\$/.test(d48Txt(big)) ? d48Val(mg) : esc(d48Txt(big))) + '</b>';
      if (bar) mk.appendChild(bar.cloneNode(true));
      mk.insertAdjacentHTML('beforeend', '<div class="hint">' + esc(meta) + '</div>');
    }
    ks.classList.add('es3');
    // S418 (esboço 124a): números em linhas finas, com o período em versalete em cima
    ks.classList.add('lux418', 'lxLk');
    var pn = d48Txt(v.querySelector('.dHdP')).replace('⌄', '').trim();
    ks.insertAdjacentHTML('afterbegin', '<div class="cxLb">' + esc(pn === 'Datas' ? 'No período' : pn) + '</div>');
    sep.remove();
    dol.remove();
    if (mk) ks.appendChild(mk);
    // os cartões viram linhas que abrem; saem os que só repetiam a tabela "Quanto separar"
    var cards = [].slice.call(B.children).filter(function (c) { return c.tagName === 'SECTION' && c.classList.contains('card') && !c.classList.contains('mtCard'); });
    var nota = B.querySelector('.note.n-ok,.note.n-bad,.note.n-warn'), n2 = nota ? nota.cloneNode(true) : null, trocas = [];
    var ls = document.createElement('section');
    ls.className = 'esLs';
    // "Resultado do mês" (veio de Reservas): resultado da loja, retirado, sobra, detalhes e lucro real
    try {
      var tb0 = S.dTab, rmH = '';
      if (typeof S._resMes !== 'function') return;
      rmH = S._resMes();
      if (rmH) {
        var abR = !!S._d48.res, bR = document.createElement('button'), cR = document.createElement('div');
        bR.type = 'button'; bR.className = 'esLn' + (abR ? ' on' : '');
        bR.setAttribute('data-act', 'd48Abre'); bR.setAttribute('data-id', 'res'); bR.setAttribute('aria-expanded', abR ? 'true' : 'false');
        bR.innerHTML = '<span class="g"><b>Resultado do mês</b><small>Lucro real, o que mais e o que menos rendeu</small></span><i aria-hidden="true">' + (abR ? '⌃' : '›') + '</i>';
        cR.className = 'esCorpo esRes'; cR.innerHTML = rmH;
        if (!abR) cR.hidden = true;
        ls.appendChild(bR); ls.appendChild(cR);
      }
    } catch (e) {}
    cards.forEach(function (c, i) {
      var h = c.querySelector('h2'), t = d48Txt(h);
      if (!h) return;
      if (/^Para repor o estoque/.test(t)) {
        // as linhas "Trocar … por US$ …" passam para a tabela (linha Reposição), com toque
        [].forEach.call(c.querySelectorAll('*'), function (e) {
          var x = d48Txt(e);
          if (!e.children.length && /^Trocar (R\$|G\$)/.test(x)) trocas.push(x);
        });
        if (!trocas.length) (d48Txt(c).match(/Trocar (?:R\$|G\$) ?[0-9.,]+ por US\$ ?[0-9.,]+/g) || []).forEach(function (x) { trocas.push(x); });
        c.remove();
        return;
      }
      var hi = c.querySelector('.hint'), sub = hi ? d48Txt(hi).split(/[.;:]/)[0].split(' ').slice(0, 9).join(' ') : '', id = 'c' + i, ab = !!S._d48[id];
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'esLn' + (ab ? ' on' : '');
      b.setAttribute('data-act', 'd48Abre'); b.setAttribute('data-id', id); b.setAttribute('aria-expanded', ab ? 'true' : 'false');
      b.innerHTML = '<span class="g"><b>' + esc(t) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span><i aria-hidden="true">' + (ab ? '⌃' : '›') + '</i>';
      ls.appendChild(b);
      c.classList.add('esCorpo');
      if (!ab) c.hidden = true;
      if (/^Quanto separar/.test(t)) c.setAttribute('data-sep', '1');
      ls.appendChild(c);
    });
    if (mt) mt.remove();
    // toque nas trocas, dentro da tabela "Quanto separar"
    var tb = ls.querySelector('[data-sep]');
    if (tb && trocas.length) {
      var dv = document.createElement('div');
      dv.className = 'esTr';
      dv.innerHTML = '<div class="hint" style="margin:0">Para repor em dólar:</div>' + trocas.map(function (x) {
        var m = /^Trocar (R\$|G\$) ?([0-9.,]+)/.exec(x), moeda = m && m[1] === 'R$' ? 'brl' : 'pyg', val = m ? (moeda === 'brl' ? parseFloat(m[2].replace(/\./g, '').replace(',', '.')) : parseInt(m[2].replace(/\D/g, ''), 10)) : 0;
        return '<button type="button" class="esLn esTroca" data-act="d48Troca" data-id="' + moeda + '|' + val + '"><span class="g"><b>' + esc(x) + '</b><small>Registrar a troca no Câmbio</small></span><i aria-hidden="true">›</i></button>';
      }).join('');
      tb.appendChild(dv);
    }
    var t2 = document.createElement('div');
    t2.className = 'esTit'; t2.textContent = 'DETALHES';
    if (n2) {
      var t1 = document.createElement('div');
      t1.className = 'esTit'; t1.textContent = 'O QUE FAZER AGORA';
      ks.after(t1); t1.after(n2); n2.after(t2);
      if (nota && nota.parentNode && nota !== n2) nota.remove();
    } else ks.after(t2);
    t2.after(ls);
  }
  var _rd48 = renderDash;
  renderDash = function () {
    if (S.view === 'dash' && S.dTab === 'hoje' && S.per === 'hoje') S.per = 'mes'; // "Hoje" mora na tela do dia
    if (S.view === 'dash' && S.dTab === 'hoje') { try { S.dTab = 'din'; _rd48.apply(this, arguments); } catch (e) {} S.dTab = 'hoje'; } // refaz a conta do "Resultado do mês" (S._resMes) com os dados de agora
    var r = _rd48.apply(this, arguments);
    try { d48Mes(); } catch (e) {}
    return r;
  };
  // ---------- período Hoje (tela v-dia, só quando o dia é hoje) ----------
  function d48Dia() {
    var v = $('v-dia');
    if (!v || !d48Hoje() || v.querySelector('.dHd')) return;
    var top = v.querySelector('.top'), data = '';
    var hd = document.createElement('div');
    hd.className = 'dHd';
    hd.innerHTML = '<button type="button" class="dHdT" data-act="dVer" aria-haspopup="dialog">Dashboard <i aria-hidden="true">⌄</i></button><button type="button" class="dHdP" data-act="dPer" aria-haspopup="dialog">Hoje <i aria-hidden="true">⌄</i></button>';
    if (top) top.replaceWith(hd); else v.insertBefore(hd, v.firstChild);
    // sai o calendário (‹ data ›); a data por extenso vira a linha debaixo do título
    var dt = [].filter.call(v.querySelectorAll('button'), function (e) { return /^\d\d\/\d\d\/\d{4}/.test(d48Txt(e)); })[0];
    if (dt) { var cx = dt.closest('section,.card') || dt.parentElement.parentElement; if (cx && cx !== v) cx.remove(); }
    var h = [].filter.call(v.querySelectorAll('h1,h2,h3,div'), function (e) { return !e.children.length && / de [a-zç]+ de \d{4}$/i.test((e.textContent || '').trim()); })[0];
    if (h) { data = h.textContent.trim().replace(/ de \d{4}$/, ''); h.remove(); }
    var su = document.createElement('div');
    su.className = 'dHdS'; su.textContent = data;
    hd.after(su);
    var c3 = v.querySelector('.famC3');
    if (c3) c3.remove();
    // S366 (dono, 15/11 23:20): o que é do Câmbio sai do Dashboard — as trocas do dia estão em Câmbio › Últimas trocas
    var cdia = [].filter.call(v.querySelectorAll('section,.card,.famRec'), function (e) { return /^Câmbio (do dia|feito neste dia)/.test((e.textContent || '').trim()); });
    cdia.forEach(function (e) { e.remove(); });
    // S363 (esboço 45b): o "Fechamento do caixa" saiu do Histórico e fica aqui, no dia de hoje
    // S374 (esboço 70, dono 16/11 16:54): sai o "Fechar o dia agora" manual com o cartão — o dia fecha sozinho depois das 17h
    if (false && typeof fechoHtml === 'function' && !v.querySelector('.d48Fecho')) {
      var fd = document.createElement('div');
      fd.className = 'd48Fecho'; fd.innerHTML = fechoHtml();
      var c2a = v.querySelector('.famC2');
      if (fd.firstChild) { if (c2a) v.insertBefore(fd, c2a); else v.appendChild(fd); }
    }
    var c2 = v.querySelector('.famC2');
    if (c2) {
      [].slice.call(c2.children).forEach(function (x) { if (!/Ver todos os dias/.test(d48Txt(x))) x.remove(); });
      var b = c2.querySelector('button,[data-act]');
      if (b) b.textContent = 'Dias anteriores no Histórico ›';
    }
  }
  var _rdy48 = renderDay;
  renderDay = function () {
    var r = _rdy48.apply(this, arguments);
    try { d48Dia(); } catch (e) {}
    return r;
  };
  // ---------- as duas folhas (Ver e Período) valem nas duas telas ----------
  ACT.dVer = function () {
    var onde = d48Hoje() ? 'hoje' : S.view === 'hist' ? 'hist' : S.dTab;
    lfaAbre('dFolha', '<div class="dFt"><span>VER</span></div>' + DTABS.map(function (t) {
      return dOpHtml('dVerEsc', t[0], t[1], DT_FRASE[t[0]], onde === t[0], true);
    }).join('') + dOpHtml('dVerEsc', 'hist', 'Histórico', 'Os dias anteriores, um a um', onde === 'hist', true));
  };
  ACT.dVerEsc = function (id) {
    lfaFecha('dFolha');
    if (id === 'hist') return setView('hist');
    if (id === 'hoje' && (S.per === 'hoje' || d48Hoje())) { S.per = 'hoje'; S.day = dayKey(Date.now()); return setView('dia'); }
    if (S.view === 'dash' && S.dTab === id) return;
    S.dTab = id;
    if (S.view !== 'dash') return setView('dash');
    renderDash();
    animEnter($('dtabBody'));
  };
  ACT.dPer = function () {
    var per = d48Hoje() ? 'hoje' : S.per;
    lfaAbre('dFolha', '<div class="dFt"><span>PERÍODO</span></div>' + PER_OP.map(function (o) {
      return dOpHtml('dPerEsc', o[0], o[1], perDatas(o[0]), per === o[0], false);
    }).join('') + dOpHtml('dPerEsc', 'custom', 'Escolher datas', per === 'custom' ? perDatas('custom') : 'de um dia até outro', per === 'custom', true));
  };
  ACT.dPerEsc = function (id) {
    lfaFecha('dFolha');
    S.per = id;
    if (id === 'hoje') { S.day = dayKey(Date.now()); return setView('dia'); }
    S.dTab = 'hoje';
    if (S.view !== 'dash') return setView('dash');
    renderDash();
  };
  // quem abre o Dashboard com o período em "Hoje" cai nos blocos do dia; "Ver todos os números" deixou de existir
  ACT.famNum = function () { S.dTab = 'hoje'; if (S.per === 'hoje') S.per = 'mes'; setView('dash'); };
