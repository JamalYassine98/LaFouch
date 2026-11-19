  // ===== S370 (16/11/2026) — esboço 41 (grupo com a flecha no lugar das abas) e esboço 44 (juntar atalhos do Início) =====
  // 41: numa tela de grupo, o título da tela ganha "⌄"; tocar abre a folha VER com as telas do grupo e "Gerenciar grupo".
  // 44: no Início, segurar um atalho (0,4 s) e levá-lo sobre outro; um anel se fecha em volta do alvo (0,3 s); soltando
  //     com o anel fechado, o atalho viaja em arco, os dois se fundem no ícone do par e o aviso "Grupo criado · Desfazer" fica 5 s.
  //     Soltar antes do anel fechar continua trocando os dois de lugar (como antes). Desfazer o grupo: cada atalho volta ao seu lugar.
  var GRP_FRASE = {
    vendas: 'Escolha a peça e venda', estoque: 'Cadastro, estoque e preço de cada peça', caixa: 'O dinheiro da loja', fx: 'Cotação do dia e trocas de moeda',
    desp: 'Contas do mês e quanto cada venda separa', hist: 'Todas as vendas, dia por dia', hoje: 'Os números do período', din: 'Livre e separado',
    giro: 'O que vende e o que está parado', prec: 'Margem e preço por tipo', cat: 'Catálogo pelo WhatsApp', ajustes: 'Aparelho, loja, site e segurança',
    ped: 'Pedidos que chegaram pelo site', onl: 'Catálogo e site', cli: 'Quem compra na loja e no atacado', cont: 'Conferir o estoque', lotes: 'Compras e fornecedores',
    novo: 'Cadastrar produto', notif: 'O que precisa de você agora', mkt: 'Posts, vídeos e plano', est: 'Fotos das peças', msg: 'Contato e atacado',
    anl: 'Visitas do site', tem: 'Calendário do site', ata: 'Orçamentos'
  };
  function grpVerHtml(g) {
    var h = '<div class="dFt"><span>VER</span></div>';
    g.itens.forEach(function (t) {
      var on = navOn(t);
      h += dOpHtml('grpVerEsc', t, BARRA_NOME[t] || t, GRP_FRASE[t] || '', on, true);
    });
    return h + dOpHtml('grpGerirV', g.id, 'Gerenciar grupo', 'Nome e telas de "' + esc(g.nome) + '"', false, true);
  }
  ACT.grpVer = function () {
    var g = grpGet(S._gAt);
    if (!g) return;
    lfaAbre('dFolha', grpVerHtml(g));
  };
  ACT.grpVerEsc = function (id) {
    if (window.__barraSegurou && window.__barraSegurou()) return; // S371: soltou um arraste
    lfaFecha('dFolha');
    if (navOn(id)) return;
    inicioGo(id);
  };
  ACT.grpGerirV = function (gid) {
    lfaFecha('dFolha');
    grpGerirAbre(gid);
  };
  // no Dashboard o título já tem a flecha: as outras telas do grupo entram na mesma folha
  var _dVer41 = ACT.dVer;
  ACT.dVer = function () {
    _dVer41.apply(this, arguments);
    var g = grpGet(S._gAt),
      o = $('dFolha'),
      sh = o && o.querySelector('.lfa-sh');
    if (!g || !sh) return;
    var DASH = ['hoje', 'din', 'giro', 'prec', 'hist'],
      fora = g.itens.filter(function (t) { return DASH.indexOf(t) < 0; }),
      h = fora.map(function (t) { return dOpHtml('grpVerEsc', t, BARRA_NOME[t] || t, GRP_FRASE[t] || '', false, true); }).join('');
    sh.insertAdjacentHTML('beforeend', h + dOpHtml('grpGerirV', g.id, 'Gerenciar grupo', 'Nome e telas de "' + esc(g.nome) + '"', false, true));
  };
  // ---------- o título da tela com a flecha ----------
  var grpObs = null;
  function grpTituloLimpa(manter) {
    [].forEach.call(document.querySelectorAll('[data-grpv]'), function (h) {
      if (h === manter) return;
      var c = h.querySelector('.grpChv');
      if (c) c.remove();
      ['data-act', 'role', 'tabindex', 'data-grpv', 'aria-haspopup'].forEach(function (a) { h.removeAttribute(a); });
      h.classList.remove('grpH');
      var t = h.closest('.top');
      if (t) t.classList.remove('grpTop');
    });
  }
  // S435 (19/11/2026): o título com ⌄ e a folha VER saíram — a navegação B (src/99c-navegacao-s435.js) define grpTitulo.
  function grpTitulo() {}
  function grpObsLiga() {
    if (!window.MutationObserver) return;
    var w = document.querySelector('.wrap');
    if (!w) return;
    if (!grpObs)
      grpObs = new MutationObserver(function () {
        if (grpTitulo._q) return;
        grpTitulo._q = true;
        requestAnimationFrame(function () {
          grpTitulo._q = false;
          try { grpTitulo(); } catch (e) {}
        });
      });
    grpObs.observe(w, { childList: true, subtree: true });
  }
  var _render41 = render;
  render = function () {
    var r = _render41.apply(this, arguments);
    try { grpTitulo(); } catch (e) {}
    return r;
  };
  // teclado: Enter/Espaço no título abre a folha
  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if ((e.key === 'Enter' || e.key === ' ') && t && t.getAttribute && t.getAttribute('data-grpv')) {
      e.preventDefault();
      ACT.grpVer();
    }
  });
  // ---------- esboço 44: juntar dois atalhos do Início ----------
  function grpIniCria(arrastado, alvo) {
    var antes = { t: iniLista().slice(), g: JSON.parse(JSON.stringify(S.grupos || [])) },
      L = iniLista().slice(),
      gid;
    if (grpGet(alvo)) {
      if (!grpAdd(alvo, arrastado)) return null;
      gid = alvo;
    } else {
      gid = 'g:' + Date.now().toString(36);
      S.grupos.push({ id: gid, nome: grpNomeAuto([alvo, arrastado]), itens: [alvo, arrastado] });
      L[L.indexOf(alvo)] = gid;
      S.inicioT = L.filter(function (x) { return x !== arrastado; });
    }
    return { gid: gid, antes: antes };
  }
  // ghost = o atalho que está sendo arrastado; alvoEl = o atalho de baixo
  function grpIniJunta(arrastado, alvo, ghost, alvoEl, pronto) {
    var r = alvoEl ? alvoEl.getBoundingClientRect() : null,
      novo = !grpGet(alvo),
      res = grpIniCria(arrastado, alvo);
    if (!res) return pronto(false);
    var fim = function () {
      if (ghost) ghost.remove();
      pronto(true);
      render();
      var t = document.querySelector('#v-inicio .tl[data-id="' + res.gid + '"]');
      if (t && t.animate && !REDUCED) {
        var ti = t.querySelector('.ti');
        t.animate([{ transform: 'scale(.86)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
        if (ti) ti.animate([{ opacity: 0, transform: 'scale(.6) rotate(-10deg)' }, { opacity: 1, transform: 'scale(1) rotate(0)' }], { duration: 380, easing: 'ease-out' });
      }
      try { vibrar(20); } catch (e) {}
      lfDesfazer(novo ? 'Grupo criado' : BARRA_NOME[arrastado] + ' entrou no grupo', function () {
        S.inicioT = res.antes.t;
        S.grupos = res.antes.g;
        render();
      }, 5000);
    };
    if (REDUCED || !ghost || !r || !ghost.animate) return fim();
    // o ícone viaja em arco até o outro e some dentro dele (os dois se fundem)
    var g0 = ghost.getBoundingClientRect(),
      dx = r.left + r.width / 2 - (g0.left + g0.width / 2),
      dy = r.top + r.height / 2 - (g0.top + g0.height / 2);
    ghost.style.transition = 'none';
    var an = ghost.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: 'translate(' + dx * 0.55 + 'px,' + (dy * 0.55 - 46) + 'px) scale(.72)', opacity: 1, offset: 0.55 },
        { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.35)', opacity: 0 }
      ],
      { duration: 420, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }
    );
    if (alvoEl && alvoEl.animate) alvoEl.animate([{ transform: 'scale(1)' }, { transform: 'scale(1)', offset: 0.7 }, { transform: 'scale(.9)' }], { duration: 420 });
    an.onfinish = fim;
  }
  // 44b: o grupo se abre e cada atalho volta ao seu lugar (0,6 s)
  function grpIniAbre(itens, r0) {
    if (REDUCED || !r0 || !itens) return;
    itens.forEach(function (id, k) {
      var t = document.querySelector('#v-inicio .tl[data-id="' + id + '"]');
      if (!t || !t.animate) return;
      var r = t.getBoundingClientRect(),
        dx = r0.left + r0.width / 2 - (r.left + r.width / 2),
        dy = r0.top + r0.height / 2 - (r.top + r.height / 2);
      t.animate(
        [
          { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.5)', opacity: 0 },
          { transform: 'translate(' + dx * 0.4 + 'px,' + dy * 0.4 + 'px) scale(.9)', opacity: 1, offset: 0.45 },
          { transform: 'translate(0,0) scale(1)', opacity: 1 }
        ],
        { duration: 600, delay: k * 60, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }
      );
    });
  }
