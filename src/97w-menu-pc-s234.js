  // ===== S234 (14/11/2026, esboço S226 aprovado): no computador o menu ao lado mostra também os destinos que não estão na barra =====
  // Só aparece com mouse e 1100 px ou mais (CSS). No toque a barra de baixo fica como está (os atalhos continuam no Início).
  var RX_DEST = [
    ['ped', 'Pedidos', 'M6 7h12l-1 13H7L6 7zm3 0a3 3 0 0 1 6 0'],
    ['clientes', 'Clientes', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0'],
    ['hist', 'Histórico', 'M12 7v5l3 2M21 12a9 9 0 1 1-3-6.7'],
    ['dia', 'Dashboard', 'M4 20V10m6 10V4m6 16v-7m4 7H2'], // S265: abre a família Dashboard (o dia + dias anteriores + números do mês)
    ['desp', 'Despesas', 'M6 3h12v18l-3-2-3 2-3-2-3 2V3zm3 5h6m-6 4h6'],
    ['fx', 'Câmbio', 'M4 8h14l-3-3m5 11H6l3 3']
  ];
  function rxMonta() {
    var n = $('mainnav');
    if (!n) return;
    var box = $('railX');
    if (!box) {
      box = document.createElement('div');
      box.id = 'railX';
      RX_DEST.forEach(function (r) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'rx';
        b.setAttribute('data-rx', r[0]);
        b.innerHTML = '<span class="mi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + r[2] + '"/></svg></span><span>' + r[1] + '</span>';
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          if (S.view !== r[0]) setView(r[0]);
        });
        box.appendChild(b);
      });
      n.appendChild(box);
    }
    [].forEach.call(box.children, function (b) {
      var on = S.view === b.getAttribute('data-rx');
      b.classList.toggle('on', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
  }
  var _renderRx = render;
  render = function () {
    var r = _renderRx.apply(this, arguments);
    try { rxMonta(); } catch (e) {}
    return r;
  };
