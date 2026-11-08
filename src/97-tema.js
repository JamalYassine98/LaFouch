  // ===== Tema (Auto / Claro / Escuro): só deste aparelho; troca com a revelação em círculo (a mesma do antigo Tema do site) =====
  function temaVal() {
    var v = 'auto';
    try {
      v = localStorage.getItem('lf_tema') || 'auto';
    } catch (e) {}
    return v === 'claro' || v === 'escuro' ? v : 'auto';
  }
  function temaEscuro(v) {
    return v === 'escuro' || (v === 'auto' && !(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches));
  }
  function temaMeta(v) {
    // barra do navegador/sistema acompanha o tema escolhido
    var ms = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < ms.length; i++) ms[i].parentNode.removeChild(ms[i]);
    var m = document.createElement('meta');
    m.name = 'theme-color';
    m.content = temaEscuro(v) ? '#0f1216' : '#f4f1f4';
    document.head.appendChild(m);
    // v464: no app instalado, as barras do Android (em cima e embaixo) também seguem o tema (plugin LfBars, APK novo)
    try {
      var P = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LfBars;
      if (P && P.set) P.set({ cor: m.content, escuro: temaEscuro(v) }).catch(function () {});
    } catch (e) {}
  }
  function temaMarca() {
    var v = temaVal();
    var bs = document.querySelectorAll('.tmseg [data-tm]');
    for (var i = 0; i < bs.length; i++) {
      var on = bs[i].getAttribute('data-tm') === v;
      bs[i].classList.toggle('on', on);
      bs[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }
  function temaSet(v, btn) {
    var rr = document.documentElement;
    var antes = temaEscuro(temaVal()),
      depois = temaEscuro(v);
    var ap = function () {
      if (v === 'auto') rr.removeAttribute('data-tema');
      else rr.setAttribute('data-tema', v);
      try {
        if (v === 'auto') localStorage.removeItem('lf_tema');
        else localStorage.setItem('lf_tema', v);
      } catch (e) {}
      temaMeta(v);
      temaMarca();
    };
    if (antes === depois || REDUCED) {
      ap();
      return;
    }
    if (document.startViewTransition) {
      var bt = btn.getBoundingClientRect(),
        cx = bt.left + bt.width / 2,
        cy = bt.top + bt.height / 2,
        R = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)),
        vt = document.startViewTransition(ap);
      vt.ready
        .then(function () {
          rr.animate(
            { clipPath: ['circle(0px at ' + cx + 'px ' + cy + 'px)', 'circle(' + R + 'px at ' + cx + 'px ' + cy + 'px)'] },
            { duration: 700, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
          );
        })
        .catch(function () {});
    } else {
      rr.classList.add('tt');
      ap();
      setTimeout(function () {
        rr.classList.remove('tt');
      }, 700);
    }
  }
  function temaCard() {
    var v = temaVal();
    function b(k, conteudo, rot) {
      return (
        '<button type="button" data-tm="' + k + '" class="' + (v === k ? 'on' : '') + '" aria-pressed="' + (v === k ? 'true' : 'false') + '"' +
        (rot ? ' aria-label="' + rot + '" title="' + rot + '"' : '') + '>' + conteudo + '</button>'
      );
    }
    var sol =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/></svg>';
    var lua =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
    return (
      '<section class="card col" id="temaCard"><div><h2 style="margin:0;font-size:16px">Tema</h2><div class="hint" style="margin:2px 0 0">Automático segue o aparelho. Vale só neste aparelho.</div></div>' +
      '<div class="tmseg" role="group" aria-label="Tema">' + b('auto', 'Auto', '') + b('claro', sol, 'Claro') + b('escuro', lua, 'Escuro') + '</div></section>'
    );
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.tmseg [data-tm]');
    if (!b) return;
    e.preventDefault();
    temaSet(b.getAttribute('data-tm'), b);
  });
  try {
    temaMeta(temaVal());
    if (window.matchMedia)
      matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
        if (temaVal() === 'auto') temaMeta('auto');
      });
  } catch (e) {}
