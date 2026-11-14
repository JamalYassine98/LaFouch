  // ===== v465: animações novas aprovadas em 08/11/2026 (vídeos a–m) =====
  // b fotos com brilho cinza até carregar · c câmbio rolando + bolinha pulsa · d telas vazias desenhando o ícone ·
  // e tirar peça do pedido deslizando · f puxar para atualizar no Câmbio · g linha das abas deslizando ·
  // h foto do produto expande do cartão · i segurar = espiar · j tema em círculo · k aviso de pedido novo do topo ·
  // l busca em cascata · m meta batida com confete. (a: folhas = lfaAbre/lfaGestos, já com mola e arrastar.)
  (function () {
    // ---------- b. fotos carregando ----------
    function fotoPronta(im) {
      if (!im || im._lfOk) return;
      var ok = function () {
        im._lfOk = 1;
        im.classList.add('lfOk');
        var bx = im.closest('.pbox,.lfImg');
        if (bx) bx.classList.add('lfOk');
      };
      if (im.complete && im.naturalWidth) ok();
      else im.addEventListener('load', ok, { once: true });
      im.addEventListener('error', ok, { once: true });
    }
    function fotosVarre(root) {
      [].forEach.call((root || document).querySelectorAll('.pbox img:not(.lfOk)'), fotoPronta);
    }
    try {
      new MutationObserver(function (ms) {
        for (var i = 0; i < ms.length; i++) if (ms[i].addedNodes.length) return requestAnimationFrame(function () { fotosVarre(); });
      }).observe(document.body, { childList: true, subtree: true });
    } catch (e) {}

    // ---------- c. câmbio rolando (contador) + bolinha pulsa ----------
    var fxAnt = {};
    function rolaNumero(el, de, para) {
      if (REDUCED || !el || de === para || de.length !== para.length) return;
      el.textContent = '';
      for (var i = 0; i < para.length; i++) {
        var a = de[i],
          b = para[i],
          sp = document.createElement('span');
        sp.className = 'odo';
        if (a === b || !/\d/.test(a) || !/\d/.test(b)) {
          sp.textContent = b;
          el.appendChild(sp);
          continue;
        }
        var seq = [],
          k = +a,
          sobe = +b > +a;
        while (k !== +b) {
          seq.push(k);
          k = sobe ? k + 1 : k - 1;
        }
        seq.push(+b);
        sp.innerHTML = '<span class="odoR">' + seq.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</span>';
        el.appendChild(sp);
        var r = sp.firstChild;
        r.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-' + (seq.length - 1) * 1.15 + 'em)' }], { duration: 650 + i * 90, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
      }
      var st = document.querySelector('#v-fx .fxSt i');
      if (st && st.animate) st.animate([{ boxShadow: '0 0 0 0 rgba(95,211,154,.7)' }, { boxShadow: '0 0 0 10px rgba(95,211,154,0)' }], { duration: 900 });
    }
    function fxDepois() {
      var l = document.querySelectorAll('#v-fx .fxTop .fxLin');
      [].forEach.call(l, function (b) {
        var k = b.getAttribute('data-id'),
          el = b.querySelector('b'),
          t = el ? el.textContent : '';
        if (fxAnt[k] && fxAnt[k] !== t && S.view === 'fx') rolaNumero(el, fxAnt[k], t);
        fxAnt[k] = t;
      });
    }

    // ---------- d. telas vazias: ícone desenha em linha ----------
    window.lfVazioHtml = function (ico, titulo, texto) {
      return '<div class="lfVazio"><svg viewBox="0 0 24 24" width="84" height="84" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ico.replace(/<(path|circle|rect)\b/g, '<$1 pathLength="1"') + '</svg><b>' + titulo + '</b><span>' + texto + '</span></div>';
    };

    // ---------- e. tirar peça do pedido ----------
    var cartRm0 = ACT.cartrm;
    ACT.cartrm = function (id) {
      var bt = document.querySelector('[data-act="cartrm"][data-id="' + id + '"]'),
        ln = bt && bt.closest('.sl');
      if (REDUCED || !ln || !ln.animate) return cartRm0(id);
      if (ln._sai) return;
      ln._sai = 1;
      var h = ln.offsetHeight;
      ln.style.overflow = 'hidden';
      ln.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(-110%)', opacity: 0 }], { duration: 280, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }).onfinish = function () {
        ln.animate([{ height: h + 'px' }, { height: '0px', paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '0px' }], { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }).onfinish = function () {
          cartRm0(id);
        };
      };
    };

    // ---------- f. puxar para atualizar no Câmbio ----------
    var pu = null;
    document.addEventListener('touchstart', function (e) {
      if (S.view !== 'fx' || (window.scrollY || 0) > 2 || e.touches.length !== 1) return;
      if (e.target.closest && e.target.closest('input,select,textarea,.lfa-ov,#mainnav')) return;
      pu = { y0: e.touches[0].clientY, x0: e.touches[0].clientX, dy: 0, on: false };
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      if (!pu) return;
      var dy = e.touches[0].clientY - pu.y0,
        dx = Math.abs(e.touches[0].clientX - pu.x0);
      if (!pu.on) {
        if (dy > 10 && dy > dx) pu.on = true;
        else if (dy < -4 || dx > 12) return (pu = null);
        else return;
      }
      pu.dy = Math.max(0, dy);
      var v = $('v-fx'),
        sp = puxaEl(),
        d = Math.min(110, pu.dy * 0.5);
      v.style.transform = 'translateY(' + d + 'px)';
      sp.style.opacity = Math.min(1, d / 60);
      sp.style.transform = 'translateX(-50%) rotate(' + d * 4 + 'deg)';
      if (e.cancelable) e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchend', function () {
      if (!pu) return;
      var p = pu,
        v = $('v-fx'),
        sp = puxaEl();
      pu = null;
      if (!p.on) return;
      var volta = function () {
        v.style.transition = 'transform .35s cubic-bezier(.2,.8,.2,1)';
        v.style.transform = '';
        sp.classList.remove('gira');
        sp.style.opacity = 0;
        setTimeout(function () {
          v.style.transition = '';
        }, 360);
      };
      if (p.dy * 0.5 < 60) return volta();
      v.style.transition = 'transform .25s';
      v.style.transform = 'translateY(56px)';
      sp.classList.add('gira');
      vibrar(10);
      var fim = function () {
        volta();
        S.fxStD = false;
        if (typeof lfToast === 'function') lfToast(lmOk() ? 'Cotação da casa atualizada agora' : 'Sem resposta da casa agora');
      };
      try {
        var r = typeof lmBusca === 'function' ? lmBusca().then(function (ok) { if (ok) render(); }) : null;
        if (r && r.then) r.then(fim, fim);
        else setTimeout(fim, 1200);
      } catch (e) {
        setTimeout(fim, 600);
      }
    });
    function puxaEl() {
      var e = $('lfPuxa');
      if (!e) {
        e = document.createElement('div');
        e.id = 'lfPuxa';
        e.setAttribute('aria-hidden', 'true');
        e.innerHTML = '<svg viewBox="0 0 40 40" width="34" height="34"><circle cx="20" cy="20" r="15" fill="none" stroke="var(--line)" stroke-width="3"/><path d="M20 5 A15 15 0 0 1 35 20" fill="none" stroke="var(--pri)" stroke-width="3" stroke-linecap="round"/></svg>';
        document.body.appendChild(e);
      }
      return e;
    }

    // ---------- g. abas de texto: a linha desliza ----------
    var abaAnt = {};
    function linhaAbas(id, sel) {
      var c = $(id);
      if (!c || REDUCED) return;
      var on = c.querySelector(sel);
      if (!on) return;
      var ln = c.querySelector('.lfLinha');
      if (!ln) {
        ln = document.createElement('i');
        ln.className = 'lfLinha';
        ln.setAttribute('aria-hidden', 'true');
      }
      c.appendChild(ln);
      c.classList.add('lfLinhaOn');
      var x = on.offsetLeft,
        w = on.offsetWidth,
        a = abaAnt[id];
      ln.style.left = x + 'px';
      ln.style.width = w + 'px';
      if (a && (a.x !== x || a.w !== w) && ln.animate) ln.animate([{ left: a.x + 'px', width: a.w + 'px' }, { left: x + 'px', width: w + 'px' }], { duration: 380, easing: 'cubic-bezier(.2,.9,.3,1)' });
      abaAnt[id] = { x: x, w: w };
    }

    // ---------- h. (v474, aprovado em vídeo 08/11) foto do cartão vira a foto do produto — IGUAL no Catálogo e no Inventário ----------
    // Abrir: cartão afunda (CSS) → o fundo da tela do produto cresce a partir do cartão enquanto a foto voa até o lugar dela
    // (380 ms, sem esticar: caixa branca + contain) → o conteúdo aparece quando a foto chega (180 ms, sobe 14 px).
    // Voltar: o conteúdo some (110 ms) → o fundo encolhe até o cartão e a foto volta para ele (340 ms).
    // Abaixo da barra de navegação (z 40). Fica de fora com "menos movimento", modo cliente e seleção.
    var FE = 'cubic-bezier(.2,.9,.3,1)', abrindo = null, fechando = null, voltaOk = false;
    // o produto abre sempre no topo da tela, com a barra inteira (Catálogo e Inventário)
    window.prodTopo = function (det) {
      if (!det || det.hidden) return;
      // 'instant': o CSS tem scroll-behavior:smooth; rolando suave a foto mediria fora do lugar
      window.scrollTo({ top: Math.max(0, det.getBoundingClientRect().top + window.scrollY - 12), left: 0, behavior: 'instant' });
    };
    var ultCard = null;
    function fRet(r) { return { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' }; }
    function fDet(view) {
      if (view === 'vendas') return S.view === 'vendas' && S.vRef ? $('vDetail') : null;
      var d = $('detail');
      return S.view === 'estoque' && d && !d.hidden ? d : null;
    }
    function fCamada(cls, r, z, extra) {
      var e = document.createElement('div');
      e.className = cls;
      e.style.cssText = 'position:fixed;pointer-events:none;z-index:' + z + ';left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;' + (extra || '');
      document.body.appendChild(e);
      return e;
    }
    function fFoto(r, src) {
      var e = fCamada('lfVoa', r, 37, 'background:#fff;border-radius:8px;overflow:hidden');
      e.innerHTML = '<img alt="" src="' + src + '" style="width:100%;height:100%;object-fit:contain;display:block">';
      return e;
    }
    function fSemMov() {
      return REDUCED || S.modoCli || S.selMode || (S.selP && S.selP.length) || (S.vSel && S.vSel.length && S.vSelMode) || S.ebSel;
    }
    document.addEventListener('click', function (e) {
      var c = e.target.closest && e.target.closest('#v-vendas .pcard[data-ref],#v-estoque .pcard[data-ref]');
      if (!c || fSemMov()) return;
      var pb = c.querySelector('.pbox'), im = pb && pb.querySelector('img');
      if (!im || !im.complete) return;
      var view = c.closest('#v-vendas') ? 'vendas' : 'estoque', vw = $('v-' + view), r = vw.getBoundingClientRect(), snap = vw.cloneNode(true);
      snap.removeAttribute('id');
      [].forEach.call(snap.querySelectorAll('[id]'), function (x) { x.removeAttribute('id'); });
      snap.style.cssText = 'position:fixed;left:0;right:0;top:0;bottom:0;margin:0;z-index:34;pointer-events:none;background:var(--bg);overflow:hidden';
      var sIn = document.createElement('div');
      sIn.style.cssText = 'position:absolute;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px';
      while (snap.firstChild) sIn.appendChild(snap.firstChild);
      snap.appendChild(sIn);
      abrindo = { view: view, ref: c.getAttribute('data-ref'), card: c.getBoundingClientRect(), box: pb.getBoundingClientRect(), src: im.src, snap: snap, rad: getComputedStyle(c).borderRadius };
      if (view === 'estoque') S._semAnimFicha = true;
    }, true);
    function abreDepois() {
      if (!abrindo) return;
      var a = abrindo, det = fDet(a.view);
      abrindo = null;
      if (!det) return;
      ultCard = { view: a.view, ref: a.ref };
      // o que o cliente vê na hora: a lista parada (cópia) + o fundo e a foto saindo do cartão; o produto fica escondido até a foto chegar
      document.body.appendChild(a.snap);
      var bg = fCamada('lfFundo', a.card, 35, 'background:var(--bg);border-radius:' + a.rad), fl = fFoto(a.box, a.src);
      det.style.position = 'relative';
      det.style.zIndex = '36';
      // escondido por uma animação nossa (ganha das animações antigas de entrada da tela)
      var an = det.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 180, delay: 330, easing: 'ease-out', fill: 'both' });
      an.pause();
      var limpa = function () {
        try { an.cancel(); } catch (_) {}
        det.style.position = '';
        det.style.zIndex = '';
        fl.remove();
        bg.remove();
        a.snap.remove();
      };
      // mede no próximo quadro: a tela já está com o produto no topo
      requestAnimationFrame(function () {
        try {
          window.prodTopo(det);
          var alvo = det.querySelector('.pbox'), ai = alvo && alvo.querySelector('img');
          if (!alvo || !ai) { limpa(); return; }
          var r1 = alvo.getBoundingClientRect(), W = window.innerWidth, H = window.innerHeight;
          ai.style.visibility = 'hidden';
          bg.animate([fRet(a.card), { left: '0px', top: '0px', width: W + 'px', height: H + 'px', borderRadius: '0px' }], { duration: 380, easing: FE, fill: 'forwards' });
          an.play();
          var fim = function () {
            ai.style.visibility = '';
            limpa();
          };
          fl.animate([fRet(a.box), fRet(r1)], { duration: 380, easing: FE, fill: 'forwards' }).onfinish = function () {
            if (an.playState === 'finished') fim();
            else an.onfinish = fim;
          };
        } catch (e) {
          limpa();
        }
      });
    }
    // voltar pelo botão da tela do produto: o conteúdo some primeiro, depois a tela volta para o cartão
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('#vDetail .tab.ibtn[aria-label="Voltar"],#detail .tab.ibtn[aria-label="Voltar"]');
      if (!b || voltaOk) return;
      if (fSemMov()) return;
      var det = b.closest('#vDetail,#detail'), pb = det.querySelector('.pbox'), im = pb && pb.querySelector('img');
      if (!im) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      var vv = det.id === 'vDetail' ? 'vendas' : 'estoque';
      fechando = { view: vv, ref: ultCard && ultCard.view === vv ? ultCard.ref : S.view === 'vendas' ? S.vRef : S.open || S.ref, box: pb.getBoundingClientRect(), src: im.src };
      var an = det.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 110, easing: 'ease-in', fill: 'forwards' });
      an.onfinish = function () {
        voltaOk = true;
        try { b.click(); } finally { voltaOk = false; }
        try { an.cancel(); } catch (_) {}
      };
    }, true);
    function fechaDepois() {
      if (!fechando || fDet(fechando.view)) return;
      var f = fechando, W = window.innerWidth, H = window.innerHeight;
      fechando = null;
      // o fundo cobre a tela já; as medidas saem no próximo quadro (o voltar ainda rola a lista depois de desenhar)
      var bg = fCamada('lfFundo', { left: 0, top: 0, width: W, height: H }, 35, 'background:var(--bg)'), fl = fFoto(f.box, f.src);
      var limpa = function () { fl.remove(); bg.remove(); };
      requestAnimationFrame(function () {
        try {
          var vw = $('v-' + f.view), c = vw && vw.querySelector('.pcard[data-ref="' + f.ref + '"]');
          var pb = c && c.querySelector('.pbox'), ci = pb && pb.querySelector('img');
          if (!pb) {
            bg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' }).onfinish = limpa;
            fl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
            return;
          }
          var cr = c.getBoundingClientRect();
          if (cr.top < 70 || cr.bottom > H - 90) {
            window.scrollBy({ top: cr.top - (H - cr.height) / 2, left: 0, behavior: 'instant' });
            cr = c.getBoundingClientRect();
          }
          var r0 = pb.getBoundingClientRect();
          if (ci) ci.style.visibility = 'hidden';
          bg.animate([{ left: '0px', top: '0px', width: W + 'px', height: H + 'px', borderRadius: '0px' }, { left: cr.left + 'px', top: cr.top + 'px', width: cr.width + 'px', height: cr.height + 'px', borderRadius: getComputedStyle(c).borderRadius }], { duration: 340, easing: FE, fill: 'forwards' });
          fl.animate([fRet(f.box), fRet(r0)], { duration: 340, easing: FE, fill: 'forwards' }).onfinish = function () {
            if (ci) ci.style.visibility = '';
            limpa();
          };
        } catch (e) {
          limpa();
        }
      });
    }
    function expandeDepois() {
      try {
        abreDepois();
        fechaDepois();
      } catch (e) {
        [].forEach.call(document.querySelectorAll('.lfVoa,.lfFundo'), function (x) { x.remove(); });
      }
    }

    // ---------- i. segurar o cartão = espiar ----------
    window.lfEspiaOn = true;
    var es = null;
    document.addEventListener('pointerdown', function (e) {
      var c = e.target.closest && e.target.closest('#v-vendas .pcard,#v-estoque .pcard,.estOv .estIt[data-ref]');
      if (!c || S.modoCli || document.body.classList.contains('arrastaBarra') || (e.pointerType === 'mouse' && e.button !== 0)) return;
      if ((S.selP && S.selP.length) || (S.vSel && S.vSel.length) || S.ebSel) return;
      es = { c: c, x: e.clientX, y: e.clientY, t: setTimeout(function () { espiar(c); }, 480) };
      c.classList.add('lfAperta');
    }, true);
    var esSolta = function (e) {
      if (!es) return;
      clearTimeout(es.t);
      es.c.classList.remove('lfAperta');
      if (e && e.type === 'pointermove' && Math.abs(e.clientX - es.x) + Math.abs(e.clientY - es.y) < 10) return;
      es = null;
    };
    document.addEventListener('pointermove', function (e) {
      if (es && Math.abs(e.clientX - es.x) + Math.abs(e.clientY - es.y) >= 10) esSolta(e);
    }, true);
    document.addEventListener('pointerup', esSolta, true);
    document.addEventListener('pointercancel', esSolta, true);
    var espiouEm = 0;
    document.addEventListener('click', function (e) {
      // só o "clique" do próprio soltar depois de espiar é ignorado (o próximo toque já vale)
      if (espiouEm && Date.now() - espiouEm < 900 && e.target.closest && e.target.closest('.pcard,.estOv .estIt')) {
        espiouEm = 0;
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
    document.addEventListener('contextmenu', function (e) {
      if (e.target.closest && e.target.closest('#v-vendas .pcard,#v-estoque .pcard,.estOv .estIt[data-ref]')) e.preventDefault();
    });
    function espiar(c) {
      es = null;
      c.classList.remove('lfAperta');
      var ref = c.getAttribute('data-ref') || c.getAttribute('data-id') || '',
        cor = c.getAttribute('data-cor') || '',
        im = c.querySelector('img'),
        src = im ? im.src : '',
        its = S.items.filter(function (i) { return i.ref === ref; }),
        nome = typeof pubNome === 'function' && ref ? pubNome(ref) : (c.querySelector('b') || {}).textContent || ref,
        cores = {},
        estudio = c.classList.contains('estIt');
      its.forEach(function (i) {
        if (i.qty > 0) cores[i.cor || 'Sem cor'] = (cores[i.cor || 'Sem cor'] || 0) + i.qty;
      });
      var sub = estudio ? (c.querySelector('small') || {}).textContent || '' : Object.keys(cores).map(function (k) { return k + ' · ' + cores[k] + ' un.'; }).join(' · ');
      espiouEm = Date.now();
      vibrar(12);
      var ac = estudio
        ? [['espEst', 'Fotografar agora'], ['espCat', 'Abrir no catálogo']]
        : c.closest('#v-vendas')
          ? [['espVende', 'Vender'], ['espSel', 'Selecionar para enviar'], ['espShare', 'Compartilhar'], ['espEdit', 'Editar']]
          : c.closest('#v-estoque')
            ? [['espVende', 'Vender'], ['espSelP', 'Selecionar'], ['espShare', 'Compartilhar'], ['espEdit', 'Editar']]
            : [['espVende', 'Vender'], ['espShare', 'Compartilhar'], ['espEdit', 'Editar']];
      var o = document.createElement('div');
      o.className = 'lfEspia';
      o.innerHTML = '<div class="lfEspCx" role="dialog" aria-modal="true" aria-label="Prévia de ' + esc(nome) + '">' + (src ? '<img src="' + src + '" alt="">' : '') + '<div class="lfEspTx"><b>' + esc(nome) + '</b><small>' + esc(sub) + '</small></div>' +
        ac.map(function (a) { return '<button type="button" data-esp="' + a[0] + '">' + a[1] + '</button>'; }).join('') + '</div>';
      document.body.appendChild(o);
      var fecha = function () {
        o.classList.add('sai');
        setTimeout(function () { o.remove(); }, 220);
      };
      o.addEventListener('click', function (e) {
        var b = e.target.closest('[data-esp]');
        if (!b && e.target.closest('.lfEspCx')) return;
        fecha();
        if (!b) return;
        var k = b.getAttribute('data-esp');
        setTimeout(function () {
          if (k === 'espVende' || k === 'espCat') {
            [].forEach.call(document.querySelectorAll('.estOv'), function (x) { x.remove(); });
            S.vRef = ref;
            setView('vendas');
          } else if (k === 'espEdit') {
            S.ref = ref;
            setView('estoque');
            var pc = document.querySelector('#v-estoque .pcard[data-ref="' + ref + '"]');
            if (pc) pc.click();
            S.qEdit = true;
            render();
          } else if (k === 'espShare') {
            if (typeof ebAbre === 'function') ebAbre([ref]);
          } else if (k === 'espSelP') {
            S.selMode = true;
            S.pdMode = false;
            S.det = false;
            S.open = '';
            S.selP = [ref];
            render();
          } else if (k === 'espSel') {
            if (typeof window.ebSeleciona === 'function') window.ebSeleciona(ref);
          } else if (k === 'espEst') c.click();
        }, 230);
      });
    }

    // j. troca de tema em círculo: já existia (97-tema.js, temaSet com startViewTransition)
    // ---------- k. aviso de pedido novo desce do topo ----------
    window.lfAvisoTopo = function (titulo, sub, acao) {
      var t = document.createElement('div');
      t.className = 'lfTopo';
      t.setAttribute('role', 'status');
      t.innerHTML = '<span class="ic">' + (typeof lfaSvg === 'function' ? lfaSvg('cart') : '') + '</span><span class="tx"><b>' + esc(titulo) + '</b><small>' + esc(sub || '') + '</small></span>' + (acao ? '<button type="button">Ver</button>' : '');
      document.body.appendChild(t);
      var fecha = function () {
        t.classList.add('sai');
        setTimeout(function () { t.remove(); }, 320);
      };
      t.addEventListener('click', function () {
        fecha();
        if (acao) acao();
      });
      setTimeout(fecha, 4500);
      vibrar(15);
    };

    // ---------- l. busca em cascata ----------
    var buscaAnt = null;
    function buscaCascata() {
      var q = S.view === 'vendas' ? S.vq || '' : S.view === 'estoque' ? S.q || '' : null;
      if (q == null) return;
      if (buscaAnt === null) buscaAnt = q;
      if (q === buscaAnt) return;
      buscaAnt = q;
      if (REDUCED) return;
      var l = [].slice.call(document.querySelectorAll('#v-' + S.view + ' .pcard')).slice(0, 12);
      l.forEach(function (c, i) {
        c.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 280, delay: i * 45, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      });
    }

    // ---------- m. meta do mês batida: confete leve nas cores da loja ----------
    function metaConfere() {
      if (S.view !== 'dash' || S.dTab !== 'hoje' || typeof metaInfo !== 'function') return;
      var m;
      try {
        m = metaInfo();
      } catch (e) {
        return;
      }
      if (!m || !(m.meta > 0) || !(m.lucro >= m.meta)) return;
      var ym = new Date().getFullYear() + '-' + new Date().getMonth();
      if (!S.metaFesta) S.metaFesta = {};
      if (S.metaFesta[ym]) return;
      S.metaFesta[ym] = 1;
      saveSoon();
      confete();
      var c = document.querySelector('.mtCard');
      if (c) c.classList.add('mtBateu');
    }
    function confete() {
      if (REDUCED) return;
      var cv = document.createElement('canvas'),
        W = innerWidth,
        H = innerHeight;
      cv.width = W;
      cv.height = H;
      cv.className = 'lfConf';
      document.body.appendChild(cv);
      var x = cv.getContext('2d'),
        cs = ['#f3c0dc', '#a44a7e', '#5fd39a', '#e9c27a'],
        ps = [];
      for (var i = 0; i < 80; i++) ps.push({ x: W / 2, y: H * 0.35, vx: (Math.random() - 0.5) * 10, vy: -Math.random() * 10 - 3, c: cs[i % 4], r: Math.random() * 3 + 2 });
      var t0 = performance.now();
      (function fr() {
        var k = (performance.now() - t0) / 1700;
        x.clearRect(0, 0, W, H);
        ps.forEach(function (p) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35;
          x.globalAlpha = Math.max(0, 1 - k);
          x.fillStyle = p.c;
          x.fillRect(p.x, p.y, p.r, p.r * 1.6);
        });
        if (k < 1) requestAnimationFrame(fr);
        else cv.remove();
      })();
      vibrar(25);
    }
    window.lfConfete = confete;

    // ---------- ganchos depois de desenhar ----------
    function depois() {
      try {
        fotosVarre();
        if (S.view === 'fx') fxDepois();
        linhaAbas('eTabs', '.chip.on');
        expandeDepois();
        buscaCascata();
        metaConfere();
      } catch (e) {}
    }
    var r0 = render;
    render = function () {
      var x = r0.apply(this, arguments);
      depois();
      return x;
    };
    var rf0 = renderFx;
    renderFx = function () {
      var x = rf0.apply(this, arguments);
      try {
        if (S.view === 'fx') fxDepois();
      } catch (e) {}
      return x;
    };
    var rv0 = renderVendas;
    renderVendas = function () {
      var x = rv0.apply(this, arguments);
      try {
        fotosVarre();
        expandeDepois();
        buscaCascata();
      } catch (e) {}
      return x;
    };
  })();
