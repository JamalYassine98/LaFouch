  // ===== S364 (16/11/2026) · UMA FOLHA SÓ — regra aprovada em 15/11 16:04 e corrigida em 15/11 16:54 =====
  // Toda folha do app fecha do mesmo jeito: a FAIXA DE CIMA inteira arrasta para baixo (dedo e mouse), tocar fora fecha e Esc fecha.
  // Cada tipo de folha continua com o seu código; este módulo só completa o que faltava em cada um:
  //   .ljJn (janela): arrastava só pela alça/título → agora a faixa de cima inteira, e Esc;
  //   .cxAcao (Caixa): no dedo só pela alça de 5 px; com mouse não → faixa inteira, dedo e mouse, e Esc;
  //   .fjJn (Câmbio): com mouse não fechava → mouse e Esc;
  //   #filtBox (Filtros): não fechava arrastando nem tocando fora → os dois, e Esc (vale o que foi escolhido);
  //   folhas lfa (Ver, Período, preços…): mouse e Esc.
  var FU_FAIXA = 64, // altura da faixa de cima que arrasta
    FU_FECHA = 90, // quanto precisa descer para fechar
    FU_TIPOS = [
      { s: '.ljJn', proprio: '.ljPuxa,.ljHd', f: function (e) { var b = e.previousElementSibling; if (b && b.classList.contains('ljBk')) b.click(); } },
      { s: '.lfa-ov:not(.lfa-full):not(.sai) > .lfa-sh', toque: 1, f: function (e) { lfaFecha(e.parentNode.id); } },
      { s: '.cxAcao.on', proprioDedo: '.cxPuxa', f: function () { ACT.cxfecha(); } },
      { s: '#v-fx .fjJn', toque: 1, f: function () { ACT.fjFecha(); } },
      { s: '#filtBox', f: function () { filtClose(false); } }
    ],
    FU_FIXAS = { atvOv: 1, apEspera: 1, 'lfa-folha': 1 };
  function fuVisivel(e) {
    if (!e || e.hidden) return false;
    var r = e.getBoundingClientRect(), c = getComputedStyle(e);
    return c.display !== 'none' && c.visibility !== 'hidden' && r.height > 60 && r.top < innerHeight - 40;
  }
  // a folha (e o tipo dela) em que o ponto está; sem ponto, a folha de cima
  function fuAcha(alvo) {
    for (var i = 0; i < FU_TIPOS.length; i++) {
      var t = FU_TIPOS[i], e = null;
      if (alvo) { e = alvo.closest ? alvo.closest(t.s) : null; }
      else { var l = document.querySelectorAll(t.s); for (var k = l.length - 1; k >= 0; k--) if (fuVisivel(l[k])) { e = l[k]; break; } }
      if (e && fuVisivel(e) && !(e.parentNode && FU_FIXAS[e.parentNode.id])) return { e: e, t: t };
    }
    return null;
  }
  function fuComeca(alvo, y, dedo) {
    if (!alvo || !alvo.closest || alvo.closest('button,a,input,select,textarea,label,[data-act],[role="button"],[role="switch"]')) return null;
    var a = fuAcha(alvo);
    if (!a || y - a.e.getBoundingClientRect().top > FU_FAIXA || a.e.scrollTop > 0) return null;
    if (a.t.proprio && alvo.closest(a.t.proprio)) return null; // esse pedaço a própria folha já arrasta
    if (dedo && a.t.proprioDedo && alvo.closest(a.t.proprioDedo)) return null;
    if (dedo && a.t.toque) return null; // no dedo essa folha já fecha arrastando
    return { e: a.e, t: a.t, y0: y, dy: 0, ant: a.e.style.transition };
  }
  function fuMove(st, y) {
    st.dy = Math.max(0, y - st.y0);
    if (st.dy > 4) {
      st.mexeu = true;
      st.e.style.transition = 'none';
      st.e.style.transform = 'translateY(' + Math.round(st.dy) + 'px)';
    }
  }
  function fuSolta(st) {
    var e = st.e;
    if (st.dy > FU_FECHA) {
      try { st.t.f(e); } catch (x) {}
      setTimeout(function () { e.style.transition = st.ant || ''; e.style.transform = ''; }, 420);
    } else if (st.mexeu) {
      e.style.transition = 'transform .28s cubic-bezier(.16,1,.3,1)';
      e.style.transform = '';
      setTimeout(function () { e.style.transition = st.ant || ''; }, 300);
    }
    if (st.mexeu) {
      // o arrasto não vira toque no que estiver embaixo
      var para = function (ev) { ev.stopPropagation(); ev.preventDefault(); };
      document.addEventListener('click', para, true);
      setTimeout(function () { document.removeEventListener('click', para, true); }, 60);
    }
  }
  (function () {
    var m = null, d = null;
    // mouse
    document.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      m = fuComeca(e.target, e.clientY, false);
    }, true);
    document.addEventListener('pointermove', function (e) { if (m && e.pointerType === 'mouse') fuMove(m, e.clientY); }, true);
    document.addEventListener('pointerup', function (e) { if (m && e.pointerType === 'mouse') { var s = m; m = null; fuSolta(s); } }, true);
    // dedo
    document.addEventListener('touchstart', function (e) { d = e.touches.length === 1 ? fuComeca(e.target, e.touches[0].clientY, true) : null; }, { passive: true, capture: true });
    document.addEventListener('touchmove', function (e) { if (d) fuMove(d, e.touches[0].clientY); }, { passive: true, capture: true });
    document.addEventListener('touchend', function () { if (d) { var s = d; d = null; fuSolta(s); } }, true);
    document.addEventListener('touchcancel', function () { if (d) { d.dy = 0; var s = d; d = null; fuSolta(s); } }, true);
    // Esc fecha a folha de cima
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      var a = fuAcha(null);
      if (!a) return;
      e.preventDefault();
      try { a.t.f(a.e); } catch (x) {}
    });
    // Filtros: tocar fora fecha (vale o que foi escolhido)
    document.addEventListener('click', function (e) {
      var f = document.getElementById('filtBox');
      if (!f || !S.filtOpen || !fuVisivel(f) || !e.target.closest) return;
      if (e.target.closest('#filtBox,#btnFilt,[aria-label*="Filtros"],.lfa-ov,.ljJn,.ljBk,.modal')) return;
      filtClose(false);
    }, true);
  })();
  window.__fuAcha = function () { var a = fuAcha(null); return a ? a.t.s : ''; };
  // S364 (esboço 34) · desfazer a exclusão de um produto: volta tudo o que saiu (peças, fotos, descrição, preço, site) e tira o registro do histórico
  ACT.prodDesfaz = function () {
    var v = window.__prodVolta;
    window.__prodVolta = null;
    var t = document.querySelector('[data-prod-toast]');
    if (t) t.remove();
    if (!v) return;
    S.items = v.itens;
    Object.keys(v.fotos).forEach(function (k) {
      S.fotos[k] = v.fotos[k];
      S.fotosRest = S.fotosRest || {};
      S.fotosRest[k] = 1;
    });
    if (v.desc != null) S.desc[v.ref] = v.desc;
    if (v.pprice) { S.pprice = S.pprice || {}; S.pprice[v.ref] = v.pprice; }
    if (v.pcanal) { S.pcanal = S.pcanal || {}; S.pcanal[v.ref] = v.pcanal; }
    S.elog.length = Math.min(S.elog.length, v.elog);
    if (v.site) { S.site = S.site || {}; S.site[v.ref] = 1; if (typeof vitFila === 'function') vitFila(v.ref, 'upd'); }
    saveSoon();
    render();
    lfToast('Produto de volta');
  };
