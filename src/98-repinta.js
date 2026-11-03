  // Volta do segundo plano: alguns celulares deixam a tela vazia até encostar nela (o app já está pronto, só não foi desenhado).
  // Força um novo desenho ao voltar, e de novo um instante depois.
  (function () {
    function repinta() {
      var e = document.getElementById('mainnav');
      if (!e) return;
      e.style.display = 'none'; // força o navegador a recalcular e redesenhar, tudo no mesmo instante (sem piscar)
      void e.offsetHeight;
      e.style.display = '';
    }
    function volta() {
      if (document.hidden) return;
      repinta();
      setTimeout(repinta, 250);
      setTimeout(repinta, 900);
    }
    document.addEventListener('visibilitychange', volta);
    window.addEventListener('pageshow', volta);
    window.addEventListener('focus', volta);
    window.__repinta = repinta;
  })();
