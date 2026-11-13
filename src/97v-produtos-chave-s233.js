  // ===== S233 (14/11/2026, esboço S228 aprovado): Produtos — chave "Vender / Cuidar do estoque" no topo do Catálogo e do Inventário =====
  // Primeiro passo da fusão Catálogo + Inventário: a mesma chave nas duas telas troca de uma para a outra (desliza para o lado).
  // Não aparece no modo cliente (iPad da loja) nem na tela do WhatsApp do catálogo.
  function pcChave() {
    [['vendas', 'Vender'], ['estoque', 'Cuidar do estoque']].forEach(function (p) {
      var v = $('v-' + p[0]);
      if (!v) return;
      var seg = v.querySelector('.pcSeg');
      if (S.view !== p[0] || S.modoCli || (p[0] === 'vendas' && S.catOpen)) {
        if (seg) seg.hidden = true;
        return;
      }
      var top = v.querySelector('.top');
      if (!top) return;
      if (!seg) {
        seg = document.createElement('div');
        seg.className = 'pcSeg';
        seg.setAttribute('role', 'group');
        seg.setAttribute('aria-label', 'Produtos: vender ou cuidar do estoque');
        [['vendas', 'Vender'], ['estoque', 'Cuidar do estoque']].forEach(function (t) {
          var b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('data-pc', t[0]);
          b.textContent = t[1];
          b.addEventListener('click', function () {
            if (S.view === t[0]) return;
            window.__slide = t[0] === 'estoque' ? 1 : -1;
            S.catOpen = false;
            setView(t[0]);
          });
          seg.appendChild(b);
        });
      }
      if (seg.previousElementSibling !== top) top.parentNode.insertBefore(seg, top.nextSibling);
      seg.hidden = false;
      [].forEach.call(seg.children, function (b) {
        var on = b.getAttribute('data-pc') === p[0];
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
  }
  var _renderPc = render;
  render = function () {
    var r = _renderPc.apply(this, arguments);
    try { pcChave(); } catch (e) {}
    return r;
  };
