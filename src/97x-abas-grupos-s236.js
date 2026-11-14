  // ===== S236 (14/11/2026, esboço S228 aprovado; barra de baixo continua personalizável por decisão do dono) =====
  // Telas que respondem à mesma pergunta ganham a mesma fileira de abas no topo e trocam entre si:
  //   Dinheiro = Caixa · Contas a pagar · Câmbio      Vendas = Hoje · Histórico · Números      Site = Pedidos · Loja
  // Nenhuma tela some e a barra de baixo não muda; é só um caminho mais curto entre telas irmãs.
  var GA_GRUPOS = [
    { nome: 'Dinheiro', ids: ['caixa', 'desp', 'fx'], rot: ['Caixa', 'Contas a pagar', 'Câmbio'] },
    { nome: 'Vendas', ids: ['dia', 'hist', 'dash'], rot: ['Hoje', 'Histórico', 'Números'] },
    { nome: 'Site', ids: ['ped', 'onl'], rot: ['Pedidos', 'Loja'] }
  ];
  function gaAbas() {
    GA_GRUPOS.forEach(function (g) {
      g.ids.forEach(function (id, i) {
        var v = $('v-' + id);
        if (!v) return;
        var seg = v.querySelector('.gaSeg');
        if (S.view !== id || S.modoCli) {
          if (seg) seg.hidden = true;
          return;
        }
        if (!seg) {
          seg = document.createElement('div');
          seg.className = 'pcSeg gaSeg';
          seg.setAttribute('role', 'group');
          seg.setAttribute('aria-label', g.nome);
          g.ids.forEach(function (alvo, k) {
            var b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('data-ga', alvo);
            b.textContent = g.rot[k];
            b.addEventListener('click', function () {
              if (S.view === alvo) return;
              window.__slide = g.ids.indexOf(alvo) > g.ids.indexOf(S.view) ? 1 : -1;
              setView(alvo);
            });
            seg.appendChild(b);
          });
        }
        var top = v.querySelector(':scope > .top');
        if (top) { if (seg.previousElementSibling !== top) v.insertBefore(seg, top.nextSibling); }
        else if (v.firstElementChild !== seg) v.insertBefore(seg, v.firstChild);
        seg.hidden = false;
        [].forEach.call(seg.children, function (b) {
          var on = b.getAttribute('data-ga') === id;
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      });
    });
  }
  var _renderGa = render;
  render = function () {
    var r = _renderGa.apply(this, arguments);
    try { gaAbas(); } catch (e) {}
    return r;
  };
