  // ===== S370 (16/11/2026) — esboços 31 e 33 (aprovados 15/11/2026) =====
  // 31: tablet e computador (≥ 800 px): no Inventário com uma peça aberta, a lista fica à esquerda e a ficha à direita;
  //     tocar em outra peça troca a ficha sem sair do lugar. A ficha (#detail) é levada para dentro de .main pelo app.js.
  // 33: teclado no computador — "/" vai para a busca, Enter na busca abre a 1ª peça, "V" vende a peça aberta,
  //     Esc fecha a janela ou a ficha, "?" mostra/esconde a lista de atalhos. Leitor de código (que "digita" rápido
  //     e termina com Enter) abre a peça no Catálogo, pronta para vender, em qualquer tela.
  function invDuo() {
    var m = document.querySelector('#v-estoque > .main'),
      d = $('detail'),
      lc = $('listCard');
    if (!m || !d || !lc) return;
    var on = S.view === 'estoque' && window.innerWidth >= 800 && !!S.det && !d.hidden && !S.lotesView && !S.cont && !S.repoView && !S.selMode && !S.pdMode;
    if (on) {
      if (d.parentNode !== m) m.appendChild(d);
      m.classList.add('invDuo');
      lc.hidden = false;
      [].forEach.call(lc.querySelectorAll('#rows .pcard.invAb'), function (c) { c.classList.remove('invAb'); });
      var c0 = lc.querySelector('#rows .pcard[data-ref="' + String(S.open || '').replace(/"/g, '\\"') + '"]');
      if (c0) c0.classList.add('invAb');
    } else {
      if (d.parentNode === m) m.parentNode.insertBefore(d, m.nextSibling);
      m.classList.remove('invDuo');
    }
  }
  var _render31 = render;
  render = function () {
    var r = _render31.apply(this, arguments);
    try { invDuo(); } catch (e) {}
    return r;
  };
  window.addEventListener('resize', function () { try { invDuo(); } catch (e) {} });

  // ---------- esboço 33: teclado e leitor de código ----------
  function kbEditavel(t) {
    return !!(t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)));
  }
  function kbBusca() {
    var id = S.view === 'vendas' ? 'vq' : S.view === 'estoque' ? 'q' : S.view === 'inicio' ? 'buQ' : '';
    return id ? $(id) : null;
  }
  function kbPrimeira() {
    var sel = S.view === 'vendas' ? '#vRows .pcard[data-ref]' : S.view === 'estoque' ? '#rows .pcard[data-ref]' : '';
    var c = sel ? [].filter.call(document.querySelectorAll(sel), function (x) { return x.offsetParent !== null && !/Lote|modelos/.test(x.innerText || ''); })[0] : null;
    if (c) c.click();
    return !!c;
  }
  function kbVender() {
    var v = $('v-' + S.view);
    if (!v) return false;
    var b = [].filter.call(v.querySelectorAll('button,a,[data-act]'), function (e) { return e.offsetParent !== null && /^Vender/.test((e.innerText || '').trim()); })[0];
    if (b) b.click();
    return !!b;
  }
  function kbAjuda() {
    var o = $('kbAj');
    if (o) return lfaFecha('kbAj');
    var L = [['/', 'Buscar peça, código ou cor'], ['Enter', 'Abrir a primeira peça da busca'], ['V', 'Vender a peça aberta'], ['Esc', 'Fechar a janela ou voltar'], ['?', 'Mostrar ou esconder esta lista']];
    lfaAbre('kbAj', '<div class="kbAjT">Atalhos</div>' + L.map(function (x) { return '<div class="kbAjL"><kbd>' + x[0] + '</kbd><span>' + x[1] + '</span></div>'; }).join('') + '<p class="kbAjN">Leitor de código: leia a etiqueta em qualquer tela; a peça abre sozinha, pronta para vender.</p>');
  }
  // leitor de código: teclas chegando muito rápido (até 45 ms entre elas) e terminando com Enter
  var KB = { s: '', t: 0, lento: 0, alvo: null };
  function kbLeitor(e) {
    var ag = Date.now();
    if (e.key === 'Enter') {
      var cod = KB.s, rapido = !KB.lento && cod.length >= 3, alvo = KB.alvo;
      KB.s = '';
      KB.lento = 0;
      if (!rapido) return false;
      var up = cod.trim().toUpperCase(),
        it = (S.items || []).filter(function (x) { return x.ref && String(x.ref).toUpperCase() === up && x.qty > 0; })[0] || (S.items || []).filter(function (x) { return x.ref && String(x.ref).toUpperCase() === up; })[0];
      if (!it) {
        if (!alvo) lfToast('Código ' + cod + ' não encontrado.');
        return false;
      }
      e.preventDefault();
      if (alvo && kbEditavel(alvo)) {
        // o leitor escreveu dentro de um campo de busca: o código sai de lá
        try { alvo.value = String(alvo.value || '').replace(cod, '').trim(); alvo.dispatchEvent(new Event('input', { bubbles: true })); } catch (x) {}
      }
      fnAbreVenda(it.ref);
      try { vibrar(15); } catch (x) {}
      return true;
    }
    if (e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (KB.s && ag - KB.t > 45) { KB.s = ''; KB.lento = 0; }
      if (!KB.s) KB.alvo = e.target;
      KB.s += e.key;
      KB.t = ag;
    }
    return false;
  }
  document.addEventListener('keydown', function (e) {
    if (S.modoCli || e.defaultPrevented) return;
    var t = e.target,
      ed = kbEditavel(t);
    if (kbLeitor(e)) return;
    // Enter na busca abre a 1ª peça
    if (e.key === 'Enter' && ed && t === kbBusca() && S.view !== 'inicio') {
      if (kbPrimeira()) { e.preventDefault(); t.blur(); }
      return;
    }
    if (ed || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === '/') {
      var b = kbBusca();
      if (b) { e.preventDefault(); b.focus(); try { b.select(); } catch (x) {} }
    } else if (e.key === '?') {
      e.preventDefault();
      kbAjuda();
    } else if (e.key === 'v' || e.key === 'V') {
      if (kbVender()) e.preventDefault();
    } else if (e.key === 'Escape') {
      // nenhuma janela aberta (a folha única fecha as janelas antes): fecha a ficha aberta
      if (S.view === 'estoque' && S.det) { S.det = false; S.open = ''; render(); }
      else if (S.view === 'vendas' && S.vRef) { S.vRef = ''; render(); }
    }
  });
  // no computador, a busca mostra a tecla "/"
  function kbMarca() {
    if (window.innerWidth < 1024 || !window.matchMedia || !matchMedia('(pointer:fine)').matches) return;
    ['vq', 'q', 'buQ'].forEach(function (id) {
      var i = $(id);
      if (!i || !i.parentNode || i.parentNode.querySelector('.kbSl')) return;
      var k = document.createElement('kbd');
      k.className = 'kbSl';
      k.textContent = '/';
      k.setAttribute('aria-hidden', 'true');
      if (getComputedStyle(i.parentNode).position === 'static') i.parentNode.style.position = 'relative';
      i.parentNode.appendChild(k);
    });
  }
  var _render33 = render;
  render = function () {
    var r = _render33.apply(this, arguments);
    try { kbMarca(); } catch (e) {}
    return r;
  };
