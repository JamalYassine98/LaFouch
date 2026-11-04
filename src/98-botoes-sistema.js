  // ===== Sistema de botões (v407): ícones, aviso com Desfazer e confirmação no próprio botão. =====
  // Aviso com "Desfazer" (4,5 s). fn roda se a pessoa tocar em Desfazer.
  function lfDesfazer(msg, fn) {
    var e = $('lfDesf');
    if (!e) {
      e = document.createElement('div');
      e.id = 'lfDesf';
      e.setAttribute('role', 'status');
      e.innerHTML = '<span></span><button type="button">Desfazer</button>';
      document.body.appendChild(e);
      e.lastChild.onclick = function () {
        var f = lfDesfazer.fn;
        lfDesfazer.fn = null;
        e.classList.remove('on');
        if (f) f();
      };
    }
    e.firstChild.textContent = msg;
    lfDesfazer.fn = fn;
    e.classList.remove('on');
    void e.offsetWidth;
    e.classList.add('on');
    clearTimeout(lfDesfazer.t);
    lfDesfazer.t = setTimeout(function () {
      e.classList.remove('on');
      lfDesfazer.fn = null;
    }, 4500);
  }
  (function () {
    var w = $('vWa');
    if (w) w.innerHTML = ICO.wa;
  })();
