  // ===== Preços (4b · aprovados 135h, 149l, 149pl, 149fe, 149pg, 149sc, 149dup; dono 21/11/2026 "implementar tudo") =====
  // UMA função desenha a tela de Preços, de cima para baixo: os 4 números (só mostram), "Para decidir esta semana"
  // (preços para corrigir que abrem ali, tema, uma linha por assunto do preço automático, uma linha por tabela de atacado)
  // e FERRAMENTAS (Calculadora, E se…?, Preço automático → Ajustes › Preços). Os dados já chegam agrupados de cntDecisoes().
  // Antes eram três camadas: contadorHtml + src/98z-precos-s52.js (relia o HTML com regex) + o embrulho do 98z-s374.js.
  var CNT_VER = {}; // assunto do preço automático aberto no "ver um por um" (oferta | fim)
  function cntPl(n, um, muitos) { return n + ' ' + (n === 1 ? um : muitos); }
  function cntKpi(rot, v, sub, cor) { return '<div class="cntK"><small>' + rot + '</small><b' + (cor ? ' style="color:' + cor + '"' : '') + '>' + v + '</b>' + (sub ? '<i>' + sub + '</i>' : '') + '</div>'; }
  function cntLinha(tit, sub, fim, cls) { return '<div class="cntL' + (cls ? ' ' + cls : '') + '"><div><b>' + esc(tit) + '</b><small>' + esc(sub || '') + '</small></div>' + (fim || '') + '</div>'; }
  // "N preços para corrigir ⌄": abre a lista ali mesmo (a mesma pcCorpo do Inventário)
  function cntCorrigirHtml() {
    var L = typeof invPrecosAcorrigir === 'function' ? invPrecosAcorrigir() : [];
    if (!L.length) return '';
    var nS = L.filter(function (x) { return x.pb && x.pb.sug > 0; }).length, semC = L.filter(function (x) { return x.pb && x.pb.k === 'c'; }).length, ab = !!S.x66ab;
    return '<div class="cntL x66L' + (ab ? ' on66' : '') + '" role="button" tabindex="0" data-act="x66" aria-expanded="' + ab + '"><div><b>' + cntPl(L.length, 'preço para corrigir', 'preços para corrigir') + '</b><small>' +
      [nS ? nS + ' com sugestão do contador' : '', L.length - nS ? (L.length - nS) + (semC === L.length - nS ? ' sem custo' : ' sem sugestão') : ''].filter(Boolean).join(' · ') + '</small></div><i class="ch66" aria-hidden="true">⌄</i></div>' +
      (ab ? '<div class="x66"><div class="x66i"><div class="pcNaTela">' + pcCorpo(true) + '</div></div></div>' : '');
  }
  var CNT_PA = { oferta: ['Pôr ', 'peça em oferta', 'peças em oferta', 'Oferta '], fim: ['', 'peça volta ao preço', 'peças voltam ao preço', 'Volta ao preço '] };
  function cntDecisaoHtml(x) {
    if (x.t === 'tema') return cntLinha(x.tit, x.sub, lkSolto(x.v, 'temaVer'));
    if (x.t === 'tab') return cntLinha('Tabela ' + x.tab.nome + ': ' + cntPl(x.n, 'peça', 'peças') + ' com margem baixa', 'abaixo de 10% · a menor está em ' + x.min + '%', lkSolto('Ajustar tabela', 'tabsheet', x.tab.id));
    var P = CNT_PA[x.kind], ab = !!CNT_VER[x.kind];
    return cntLinha(P[0] + cntPl(x.n, P[1], P[2]), x.itens[0].mot.split(' · ')[0], '<button type="button" class="lxT" data-act="cntVer" data-id="' + x.kind + '" aria-expanded="' + ab + '">ver um por um</button>') +
      (ab ? x.itens.map(function (m) {
        var id = esc(m.ref + '|' + m.kind);
        return '<div class="cntL cntPc"><div><b>' + esc(P[3] + m.ref) + '</b><small>' + esc(m.mot) + '</small></div><em>' + gs(m.para) + '</em>' +
          '<span class="cntUm"><button type="button" class="mini" data-act="cntAceita" data-id="' + id + '">Aceitar</button><button type="button" class="mini ghost" data-act="cntIgnora" data-id="' + id + '">Agora não</button></span></div>';
      }).join('') : '');
  }
  var CNT_FERR = [['calc', 'Calculadora de preço', 'quanto cobrar pelo custo e pelo lote', 'cntCalc'], ['ese', 'E se…?', 'dólar, contas, desconto ou meta: o que muda', 'cntEse'], ['pauto', 'Preço automático', '', 'cntAuto']];
  function cntFerramentasHtml() {
    var on = !!(S.pAuto && S.pAuto.on), rv = S.pAuto && S.pAuto.ult ? fd(S.pAuto.ult) + ' ' + fh(S.pAuto.ult) : 'agora';
    return '<div class="lbl cntFeT">FERRAMENTAS</div><section class="nvLista cntFe" aria-label="Ferramentas de preço">' + CNT_FERR.map(function (x) {
      return '<button type="button" class="nvL" data-act="' + x[3] + '"><span class="nvIc">' + ico(x[0], 22) + '</span><span class="nvTx"><b>' + x[1] + '</b><small>' + esc(x[2] || (on ? 'ligado' : 'desligado') + ' · revisado ' + rv + ' · em Ajustes') + '</small></span><i aria-hidden="true">›</i></button>';
    }).join('') + '</section>';
  }
  function precosTelaHtml() {
    var s = cntSaude(), D = cntDecisoes(), d = new Date(), dsc = cntDescontosTxt(s.mes), fech = '', pc = cntCorrigirHtml(),
      nAc = D.reduce(function (a, x) { return a + (x.t === 'pa' ? x.n : 0); }, 0), n = D.length + (pc ? 1 : 0);
    if (d.getDate() <= 5) { var pm = new Date(d.getFullYear(), d.getMonth() - 1, 1); fech = cntFechHtml(pm.getFullYear(), pm.getMonth()); }
    return '<div class="cnt lx">' + fech +
      '<div class="cntG">' + cntKpi('Margem média real', Math.round(s.mg) + '%', s.dmg == null ? '' : '<span style="color:' + (s.dmg >= 0 ? 'var(--ok)' : 'var(--bad)') + '">' + (s.dmg >= 0 ? '▲ ' : '▼ ') + Math.abs(Math.round(s.dmg)) + ' pts</span>') +
      cntKpi('Lucro por peça', gs(s.porPeca)) + cntKpi('Contas do mês cobertas', s.cob + '%', s.falta ? 'faltam ' + cntPl(s.falta, 'peça', 'peças') : '') + cntKpi('Preços para corrigir', String(s.abx), '', s.abx ? 'var(--bad)' : 'var(--ok)') + '</div>' +
      '<section class="card col cntD"><div class="lbl">PARA DECIDIR ESTA SEMANA · ' + n + '</div>' +
      (n ? pc + D.map(cntDecisaoHtml).join('') + (nAc ? '<div class="cntB"><button type="button" class="go" data-act="cntTudo">' + (nAc === 1 ? 'Aceitar o preço' : 'Aceitar os ' + nAc + ' preços') + '</button></div>' : '')
        : '<div class="hint" style="margin:6px 0 0;text-align:center">Nada para decidir agora. ✓</div>') + '</section>' +
      (dsc ? '<section class="card cntQ">' + esc(dsc) + '</section>' : '') + cntFerramentasHtml() + '</div>';
  }
  function cntItem(id) {
    var p = String(id).split('|'), g = cntDecisoes().filter(function (x) { return x.t === 'pa' && x.kind === p[1]; })[0];
    return g ? g.itens.filter(function (m) { return m.ref === p[0]; })[0] : null;
  }
  ACT.cntVer = function (k) { CNT_VER[k] = !CNT_VER[k]; lfRedesenha(); };
  ACT.cntAceita = function (id) { var m = cntItem(id); if (!m) return; paAplica(m); saveSoon(); lfToast('✓ ' + CNT_PA[m.kind][3] + m.ref + ' → ' + gs(m.para), 'ok'); render(); };
  ACT.cntIgnora = function (id) { var m = cntItem(id); if (!m) return; S.pAuto.ign = S.pAuto.ign || {}; S.pAuto.ign[m.ref + '|oferta'] = Date.now(); saveSoon(); render(); };
  // "Aceitar os N preços" aceita exatamente o que a tela mostra (ofertas e voltas); os que sobem moram nos "preços para corrigir"
  ACT.cntTudo = function () {
    var n = 0;
    cntDecisoes().forEach(function (x) { if (x.t === 'pa') x.itens.forEach(function (m) { paAplica(m); n++; }); });
    if (S.pAuto) S.pAuto.ult = Date.now();
    saveSoon(); lfToast('✓ ' + cntPl(n, 'preço ajustado', 'preços ajustados') + ' · dá para desfazer em Esta semana', 'ok'); render();
  };
  // Preço automático › : Ajustes com a linha Preços aberta, rolada até ela
  ACT.cntAuto = function () {
    S.ajAberta = 'pa';
    setView('ajustes');
    setTimeout(function () { var l = document.querySelector('#ajGrp .ajS[data-k="pa"]'); if (l) try { l.scrollIntoView({ block: 'start', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) {} }, 300);
  };
  ACT.x66 = function () {
    var x = document.querySelector('#v-dash .x66'), l = document.querySelector('#v-dash .x66L');
    if (S.x66ab && x) {
      if (l) l.classList.remove('on66');
      return lfFoldAnim(x, x.firstElementChild, l && l.querySelector('.ch66'), false, function () { S.x66ab = false; lfRedesenha(); });
    }
    S.x66ab = true;
    if (S.view !== 'dash' || S.dTab !== 'prec') { S.dTab = 'prec'; return setView('dash'); }
    lfRedesenha();
    var x2 = document.querySelector('#v-dash .x66'), l2 = document.querySelector('#v-dash .x66L');
    if (x2) lfFoldAnim(x2, x2.firstElementChild, l2 && l2.querySelector('.ch66'), true);
  };
