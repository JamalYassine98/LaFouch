  // ===== S435 (19/11/2026) — NAVEGAÇÃO B REFINADA (esboços 146B e 147-1…8, aprovados e mandados implementar 19/11 09:08) =====
  // Regra única: FRENTE = pilha (índice do grupo › tela; "‹ GRUPO" em versalete volta; arrastar da borda volta);
  // BAIXO = janela de baixo (criar/editar/escolher, inclusive o período "Este mês ›"); "⌄" só abre no lugar.
  // Título sem ⌄, encolhe no alto ao rolar. Cada aba lembra onde parou. O voltar do Android segue a pilha.
  // PC e tablet (≥ 760 px): o índice vira a coluna da esquerda, com os grupos em versalete.
  // Tudo da navegação mora AQUI (uma definição só); o título com ⌄ (S370, esboço 41) foi substituído por este módulo.
  (function () {
    if (!$('v-grp')) {
      var vg = document.createElement('div');
      vg.id = 'v-grp';
      vg.className = 'view';
      vg.hidden = true;
      var vi = $('v-inicio');
      if (vi && vi.parentNode) vi.parentNode.insertBefore(vg, vi.nextSibling);
    }
    if (!VIEWS.some(function (v) { return v[0] === 'grp'; })) VIEWS.push(['grp', 'Grupo']);
    var NV_GF = { Dinheiro: 'O dinheiro da loja', Resultados: 'Como a loja está indo', 'Giro e preços': 'O que vende, o preço e as reservas', 'Peças': 'Cadastro, fotos e estoque', Site: 'Pedidos, mensagens e vitrine', Marketing: 'Posts, vídeos e plano' };
    S.nvG = S.nvG || null;
    S.nvP = []; // pilha da aba atual (chaves: 'grp:<id>' ou a tela)
    S.nvAbas = {}; // última pilha de cada aba da barra
    function nvRail() { return !!(window.matchMedia && matchMedia('(min-width:760px)').matches); }
    function nvChave() {
      var v = S.view;
      if (v === 'dash') return S.dTab || 'hoje';
      if (v === 'clientes') return 'cli';
      if (v === 'grp') return 'grp:' + S.nvG;
      if (v === 'estoque' && S.lotesView) return 'lotes';
      if (v === 'onl' && S.onlAba && BARRA_NOME[S.onlAba]) return S.onlAba;
      return v;
    }
    function nvNome(k) {
      if (!k) return '';
      if (k.indexOf('grp:') === 0) { var g = grpGet(k.slice(4)); return g ? g.nome : ''; }
      if (BARRA_NOME[k]) return BARRA_NOME[k];
      var x = VIEWS.filter(function (v) { return v[0] === k; })[0];
      return x ? x[1] : k;
    }
    function nvGrupos() { return barraLista().concat(grpIni()).map(grpGet).filter(Boolean); }
    function nvGrupoDe(k) { return nvGrupos().filter(function (g) { return g.itens.indexOf(k) >= 0; })[0] || null; }
    // a aba da barra em que estamos
    function nvAbaAtual() {
      if (S.view === 'inicio') return 'inicio';
      var P = S.nvP, raiz = P[0] || '';
      var L = barraLista();
      if (raiz.indexOf('grp:') === 0 && L.indexOf(raiz.slice(4)) >= 0) return raiz.slice(4);
      for (var i = 0; i < L.length; i++) if (navOn(L[i])) return L[i];
      return '';
    }
    function nvAbre(k) {
      if (!k) return;
      if (k.indexOf('grp:') === 0) { var g = grpGet(k.slice(4)); if (g) nvIndiceVai(g); return; }
      inicioGo(k);
    }
    function nvIndiceVai(g) {
      S.nvG = g.id;
      if (S.view === 'grp') render();
      else setView('grp');
    }
    // abre o índice de um grupo (modo: 'volta' anima voltando)
    function nvIndice(g, volta) {
      S.nvP = ['grp:' + g.id];
      S._nvModo = 1;
      if (volta) window.__navVolta = true;
      try { nvIndiceVai(g); } finally { window.__navVolta = false; }
    }
    // volta uma tela na pilha (versalete, título pequeno, arrastar, voltar do Android)
    function nvVolta() {
      var P = S.nvP;
      if (P.length < 2) {
        S.nvP = [];
        window.__navVolta = true;
        try { setView('inicio'); } finally { window.__navVolta = false; }
        return;
      }
      var pai = P[P.length - 2];
      S.nvP = P.slice(0, -1);
      S._nvModo = 1;
      window.__navVolta = true;
      try { nvAbre(pai); } finally { window.__navVolta = false; }
    }
    function nvTopo() {
      try { window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
    }
    window.__nvVolta = nvVolta;
    ACT.nvVolta = function () { nvVolta(); };
    ACT.nvIr = function (t) {
      var g = grpGet(S.nvG);
      if (g) g.ult = t;
      S.nvP = ['grp:' + S.nvG];
      S._nvModo = 1;
      inicioGo(t);
    };
    ACT.nvGer = function () { if (grpGet(S.nvG)) grpGerirAbre(S.nvG); };
    // ---------- a pilha acompanha cada redesenho ----------
    function nvPilha() {
      var k = nvChave(), P = S.nvP, m = S._nvModo;
      S._nvModo = 0;
      if (k === 'inicio' || k === 'notif') { S.nvP = []; return; }
      if (P[P.length - 1] === k) return;
      var i = P.indexOf(k);
      if (i >= 0) { P.length = i + 1; return; }
      if (!m && !P.length) { var g = nvGrupoDe(k); if (g) P.push('grp:' + g.id); } // atalho do Início: já com "‹ GRUPO" (147-3)
      P.push(k);
    }
    function nvGuarda() {
      var a = nvAbaAtual();
      if (a && a !== 'inicio' && S.nvP.length) S.nvAbas[a] = S.nvP.slice();
    }
    // ---------- índice do grupo ----------
    function nvGrpHtml(g) {
      var fr = g.frase || NV_GF[g.nome] || g.itens.map(nvNome).join(' · ');
      return '<div class="top"><div><h1>' + esc(g.nome) + '</h1><div class="crumb">' + esc(fr) + '</div></div></div>' +
        '<section class="nvLista" aria-label="Telas do grupo">' +
        g.itens.map(function (t) {
          return '<button type="button" class="nvL" data-act="nvIr" data-id="' + t + '"><span class="nvIc">' + ico(t, 22) + '</span><span class="nvTx"><b>' + esc(nvNome(t)) + '</b>' + (GRP_FRASE[t] ? '<small>' + esc(GRP_FRASE[t]) + '</small>' : '') + '</span><i aria-hidden="true">›</i></button>';
        }).join('') +
        '</section><button type="button" class="nvGer" data-act="nvGer">Gerenciar grupo ›</button>';
    }
    function nvGrpRender() {
      var el = $('v-grp');
      if (!el || S.view !== 'grp') return;
      var g = grpGet(S.nvG);
      if (!g) { S.nvP = []; return setView('inicio'); }
      var h = nvGrpHtml(g);
      if (el._h !== h) { el.innerHTML = h; el._h = h; }
    }
    // ---------- o que muda na tela (sem ⌄ no título, "‹ GRUPO", período ›) ----------
    function nvDesenha() {
      var v = $('v-' + S.view);
      if (!v) return;
      // "⌄" que abre janela vira "›" (o ⌄ fica só para abrir no lugar)
      [].forEach.call(v.querySelectorAll('[aria-haspopup="dialog"] i'), function (i) {
        if (i.textContent.trim() === '⌄') i.textContent = '›';
      });
      // "‹ GRUPO" em versalete acima do título
      var P = S.nvP, quer = !nvRail() && S.view !== 'grp' && P.length >= 2 ? nvNome(P[P.length - 2]) : '';
      var vs = v.querySelector(':scope > .nvVs');
      if (!quer) { if (vs) vs.remove(); return; }
      if (!vs) {
        vs = document.createElement('button');
        vs.type = 'button';
        vs.className = 'nvVs';
        vs.setAttribute('data-act', 'nvVolta');
        v.insertBefore(vs, v.firstChild);
      } else if (vs !== v.firstElementChild) v.insertBefore(vs, v.firstChild);
      var tx = '‹ ' + quer;
      if (vs.getAttribute('data-t') !== tx) {
        vs.setAttribute('data-t', tx);
        vs.setAttribute('aria-label', 'Voltar para ' + quer);
        vs.innerHTML = '<i aria-hidden="true">‹</i>' + esc(quer);
      }
    }
    // o título das telas de grupo (substitui o de S370: sem ⌄ e sem folha VER)
    grpTitulo = function () {
      if (grpObs) grpObs.disconnect();
      try {
        grpTituloLimpa(null);
        // telas de grupo continuam sem a frase de baixo do título (como antes, .grpTop)
        var tv = S._gAt && S.view !== 'grp' ? document.querySelector('#v-' + S.view + ' > .top') : null;
        if (tv) tv.classList.add('grpTop');
        var g = grpGet(S._gAt), gt = $('grpTabs'), v = g ? $('v-' + S.view) : null,
          semTit = v && !v.querySelector('.top h1') && !v.querySelector('.dHdT');
        if (gt) {
          if (g && semTit) {
            var nm = nvNome(nvChave());
            if (gt.hidden || gt.getAttribute('data-nm') !== nm) {
              gt.className = 'gtabs gtF';
              gt.setAttribute('data-nm', nm);
              gt.innerHTML = '<div class="dHd"><h1 class="dHdT">' + esc(nm) + '</h1></div>';
              gt.hidden = false;
            }
          } else if (!gt.hidden) { gt.hidden = true; gt.textContent = ''; gt.removeAttribute('data-nm'); }
        }
        nvDesenha();
        nvLado();
        // a aba acesa é a da pilha (o índice e as telas abertas a partir dele ficam na aba do grupo)
        var raiz = S.nvP[0] || '', nav0 = $('mainnav');
        if (nav0 && raiz.indexOf('grp:') === 0) {
          var mb = nav0.querySelector('.mn[data-id="' + raiz.slice(4) + '"]');
          if (mb && !mb.classList.contains('on')) {
            [].forEach.call(nav0.querySelectorAll('.mn.on'), function (x) { x.classList.remove('on'); x.removeAttribute('aria-current'); });
            mb.classList.add('on');
            mb.setAttribute('aria-current', 'page');
          }
        }
      } finally {
        grpObsLiga();
      }
    };
    // ---------- barra de baixo: tocar de novo, lembrar onde parou (147-1 e 147-2) ----------
    function nvAba(id, b) {
      var at = nvAbaAtual(), g = grpGet(id);
      if (id === 'inicio') {
        if (S.view === 'inicio') return nvTopo();
        nvGuarda();
        S.nvP = [];
        return setView('inicio');
      }
      if (at === id) {
        if (g) { if (S.view === 'grp' && S.nvG === g.id) return nvTopo(); return nvIndice(g, true); }
        return nvTopo();
      }
      nvGuarda();
      var bs = [].slice.call($('mainnav').querySelectorAll('.mn')),
        ia = bs.indexOf($('mainnav').querySelector('.mn.on')),
        ib = bs.indexOf(b);
      window.__slide = ia >= 0 && ib >= 0 && ia !== ib ? (ib > ia ? 1 : -1) : 0;
      var salvo = S.nvAbas[id];
      if (salvo && salvo.length) {
        S.nvP = salvo.slice();
        S._nvModo = 1;
        return nvAbre(salvo[salvo.length - 1]);
      }
      if (g) return nvIndice(g);
      S.nvP = [];
      S._nvModo = 1;
      inicioGo(id);
    }
    var nav = $('mainnav');
    if (nav)
      nav.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('.mn');
        if (!b || nvRail()) return;
        var id = b.getAttribute('data-id');
        if (!id) return;
        e.stopPropagation();
        if (window.__barraSegurou && window.__barraSegurou()) return;
        nvAba(id, b);
      }, true);
    // ---------- PC e tablet: coluna da esquerda com os grupos (147-8) ----------
    var NV_MAIS = [['ped', 'Pedidos'], ['cli', 'Clientes']];
    function nvLado() {
      var rail = nvRail();
      document.body.classList.toggle('nvRail', rail);
      var n = $('mainnav');
      if (!n) return;
      var box = $('nvSide');
      if (!rail) { if (box) box.remove(); return; }
      var lin = function (id, nome, on) {
        return '<button type="button" class="nvSl' + (on ? ' on' : '') + '" data-nvs="' + id + '"' + (on ? ' aria-current="page"' : '') + '><span class="mi">' + ico(id === 'cli' ? 'cli' : id, 20) + '</span><span>' + esc(nome) + '</span></button>';
      };
      var h = lin('inicio', 'Início', S.view === 'inicio'), usados = {};
      barraLista().forEach(function (id) {
        var g = grpGet(id);
        if (g) {
          h += '<div class="nvSv">' + esc(g.nome) + '</div>';
          g.itens.forEach(function (t) { usados[t] = 1; h += lin(t, nvNome(t), navOn(t)); });
        } else if (id !== 'ajustes') { usados[id] = 1; h += lin(id, nvNome(id), navOn(id)); }
      });
      var mais = NV_MAIS.filter(function (x) { return !usados[x[0]]; });
      if (mais.length) h += '<div class="nvSv">Loja</div>' + mais.map(function (x) { return lin(x[0], x[1], navOn(x[0])); }).join('');
      h += '<div class="nvSfim">' + lin('ajustes', 'Ajustes', S.view === 'ajustes') + '</div>';
      if (!box) {
        box = document.createElement('div');
        box.id = 'nvSide';
        box.addEventListener('click', function (e) {
          var b = e.target.closest && e.target.closest('[data-nvs]');
          if (!b) return;
          e.stopPropagation();
          var id = b.getAttribute('data-nvs');
          S.nvP = [];
          S._nvModo = 1;
          if (id === 'inicio') setView('inicio');
          else inicioGo(id);
        });
        n.appendChild(box);
      }
      if (box._h !== h) { box.innerHTML = h; box._h = h; }
    }
    window.addEventListener('resize', function () { try { grpTitulo(); nvBarAtual(); } catch (e) {} });
    // ---------- título pequeno no alto ao rolar (146) ----------
    var bar = document.createElement('div');
    bar.id = 'nvBar';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<button type="button" class="nvBk" data-act="nvVolta" aria-label="Voltar" tabindex="-1">‹</button><b></b>';
    document.body.appendChild(bar);
    function nvBarAtual() {
      var v = S.view === 'inicio' || S.view === 'vendas' || nvRail() ? null : $('v-' + S.view),
        gt = $('grpTabs'),
        h = v ? v.querySelector('.top h1, .dHdT') || (gt && !gt.hidden ? gt.querySelector('.dHdT') : null) : null;
      var on = !!h && h.getBoundingClientRect().bottom < 2;
      if (bar.classList.contains('on') !== on) bar.classList.toggle('on', on);
      if (on) {
        var t = h.textContent.replace(/[⌄›]/g, '').trim();
        if (bar.lastChild.textContent !== t) bar.lastChild.textContent = t;
        bar.firstChild.hidden = S.nvP.length < 2;
      }
    }
    window.addEventListener('scroll', nvBarAtual, { passive: true });
    // ---------- arrastar da borda esquerda volta (146) ----------
    var sw = null;
    function swLimpa(s) {
      s.v.style.transition = s.v.style.transform = s.v.style.boxShadow = s.v.style.position = s.v.style.zIndex = s.v.style.background = '';
      if (s.bg && s.bg.parentNode) s.bg.remove();
    }
    document.addEventListener('touchstart', function (e) {
      sw = null;
      if (nvRail() || e.touches.length !== 1 || S.nvP.length < 2) return;
      var t = e.touches[0];
      if (t.clientX > 22 || (window.__fuAcha && window.__fuAcha())) return;
      var v = $('v-' + S.view);
      if (v) sw = { x0: t.clientX, y0: t.clientY, v: v, dx: 0, ok: false };
    }, { passive: true, capture: true });
    document.addEventListener('touchmove', function (e) {
      if (!sw) return;
      var t = e.touches[0], dx = t.clientX - sw.x0, dy = t.clientY - sw.y0;
      if (!sw.ok) {
        if (Math.abs(dy) > 12 && Math.abs(dy) > dx) { sw = null; return; }
        if (dx < 10) return;
        sw.ok = true;
        var v = sw.v, pai = S.nvP[S.nvP.length - 2] || '';
        v.style.transition = 'none';
        v.style.position = 'relative';
        v.style.zIndex = '2';
        v.style.background = 'var(--bg)';
        v.style.boxShadow = '-10px 0 28px rgba(0,0,0,.28)';
        var bg = document.createElement('div');
        bg.className = 'nvSwBg';
        if (pai.indexOf('grp:') === 0 && grpGet(pai.slice(4))) bg.innerHTML = nvGrpHtml(grpGet(pai.slice(4)));
        bg.style.top = v.offsetTop + 'px';
        v.parentNode.insertBefore(bg, v);
        sw.bg = bg;
      }
      sw.dx = Math.max(0, dx);
      sw.v.style.transform = 'translateX(' + sw.dx + 'px)';
      if (sw.bg) sw.bg.style.transform = 'translateX(' + (-30 + 30 * Math.min(1, sw.dx / innerWidth)) + '%)';
    }, { passive: true, capture: true });
    function swFim() {
      var s = sw;
      sw = null;
      if (!s || !s.ok) return;
      var vai = s.dx > innerWidth * 0.33;
      s.v.style.transition = 'transform .25s cubic-bezier(.16,1,.3,1)';
      s.v.style.transform = vai ? 'translateX(' + innerWidth + 'px)' : 'translateX(0)';
      if (s.bg) { s.bg.style.transition = 'transform .25s cubic-bezier(.16,1,.3,1)'; s.bg.style.transform = vai ? 'translateX(0)' : 'translateX(-30%)'; }
      setTimeout(function () {
        swLimpa(s);
        if (vai) {
          var r0 = REDUCED;
          REDUCED = true; // a tela já chegou arrastando: sem animação de novo
          try { nvVolta(); } finally { REDUCED = r0; }
        }
      }, 260);
    }
    document.addEventListener('touchend', swFim, true);
    document.addEventListener('touchcancel', function () { if (sw) sw.dx = 0; swFim(); }, true);
    // ---------- voltar do Android / navegador (147-2b): janela → tela → índice → Início → "Sair do app?" ----------
    // No app (Android) o botão voltar chega aqui e segue a pilha; no navegador o voltar continua pelo endereço (navVolta).
    function nvSair() {
      lfConfirma({
        k: 'nvSair435',
        t: 'Sair do app?',
        f: 'O que você fez fica salvo neste aparelho.',
        b: 'Sair',
        fn: function () {
          var CA = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
          if (CA && CA.exitApp) CA.exitApp();
        }
      });
    }
    function nvVoltarAndroid() {
      if (window.__fuAcha && window.__fuAcha()) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return; }
      if (history.state && history.state.lfp) { try { history.back(); } catch (e) {} return; } // peça aberta: o passo dela fecha
      if (S.view === 'inicio') return nvSair();
      nvVolta();
    }
    window.__nvVoltarAndroid = nvVoltarAndroid;
    try {
      var CA0 = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
      if (CA0 && CA0.addListener) CA0.addListener('backButton', function () { nvVoltarAndroid(); });
    } catch (e) {}
    // ---------- liga tudo no redesenho ----------
    aposRender(function () {
      try {
        nvPilha();
        nvGuarda();
        nvGrpRender();
        grpTitulo();
        nvBarAtual();
      } catch (e) {}
    });
    // 147-6: o link do Caixa diz o nome da tela que abre
    // Início: o grupo do Início abre a tela direto (como antes, aprovado S374/98), já com "‹ GRUPO" (147-3).
    window.__nv435 = { pilha: function () { return S.nvP.slice(); }, abas: function () { return JSON.parse(JSON.stringify(S.nvAbas)); }, rail: nvRail };
  })();
