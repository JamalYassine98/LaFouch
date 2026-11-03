  // Volta do segundo plano: alguns celulares deixam a tela vazia até encostar nela (o app já está pronto, só não foi desenhado).
  // Força um novo desenho ao voltar, e de novo um instante depois.
  (function () {
    function repinta() {
      var d = document.documentElement;
      if (!d) return;
      d.style.opacity = '0.999'; // muda a camada de desenho sem mexer no layout
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          d.style.opacity = '';
        });
      });
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
