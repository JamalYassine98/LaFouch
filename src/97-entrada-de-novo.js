  // ===== Adicionar A+1 (v417): "Dar entrada de novo" com as 3 últimas peças que entraram. =====
  // Toque numa delas abre a folhinha "Quantas chegaram?" (− N +) e "Dar entrada · N peças".
  // O custo e o resto vêm do cadastro que já existe; respeita o limite do lote (gCap) como a entrada rápida.
  // Pré-graduado precisa dos graus: abre a entrada rápida de sempre.
  var _en = null; // { it, n }
  function enUltimas() {
    var vistos = {},
      out = [],
      L = S.elog || [];
    for (var i = L.length - 1; i >= 0 && out.length < 3; i--) {
      var e = L[i];
      if (!(e.qty > 0) || e.ajuste) continue;
      var k = e.ref + '|' + (e.tipo === 'pre' ? '' : e.cor);
      if (vistos[k]) continue;
      var it = S.items.filter(function (x) {
        return x.ref === e.ref && !x.bulk && (e.tipo === 'pre' ? x.tipo === 'pre' : x.cor === e.cor && x.tipo === e.tipo);
      })[0];
      if (!it) continue;
      vistos[k] = 1;
      out.push(it);
    }
    return out;
  }
  function renderDeNovo() {
    var b = $('addDeNovo');
    if (!b) return;
    var us = S.addMode === 'menu' ? enUltimas() : [];
    b.hidden = !us.length;
    if (!us.length) {
      b.innerHTML = '';
      return;
    }
    b.innerHTML =
      '<div class="lbl">Dar entrada de novo</div><div class="adNv">' +
      us
        .map(function (it, i) {
          var f = photoOf(it.ref, it.cor) || photoOf(it.ref);
          return '<button type="button" class="adNvI" data-act="enAbre" data-id="' + i + '"><span class="adNvF">' + (f ? '<img alt="" src="' + f + '">' : '') + '</span><b>' + esc(it.ref) + '</b><small>' + esc(it.tipo === 'pre' ? 'Pré-graduado' : it.cor && it.cor !== 'Sem cor' ? it.cor : 'Padrão') + '</small></button>';
        })
        .join('') +
      '</div>';
  }
  ACT.enAbre = function (i) {
    var it = enUltimas()[+i];
    if (!it) return;
    if (it.tipo === 'pre') {
      quickOpen(it.ref);
      return;
    }
    _en = { it: it, n: 1 };
    enDesenha();
  };
  function enHtml() {
    var it = _en.it,
      f = photoOf(it.ref, it.cor) || photoOf(it.ref);
    return (
      '<div class="cg-puxa" aria-hidden="true"></div>' +
      '<div class="enF-top"><div class="enF-img">' + (f ? '<img alt="" src="' + f + '">' : '') + '</div><div style="min-width:0"><b class="folha-nm">' + esc(pn(it.ref)) + '</b><div class="hint" style="margin:2px 0">' + esc(it.ref) + (it.cor && it.cor !== 'Sem cor' ? ' · ' + esc(it.cor) : '') + ' · ' + it.qty + ' no estoque</div></div></div>' +
      '<div class="enF-q"><div class="lbl" style="margin:0">Quantas chegaram?</div><span class="vstep"><span class="vs-b" role="button" tabindex="0" data-act="enQ" data-id="-1" aria-label="Menos">−</span><span class="vs-n" id="enN">' + _en.n + '</span><span class="vs-b" role="button" tabindex="0" data-act="enQ" data-id="1" aria-label="Mais">+</span></span></div>' +
      '<button type="button" class="btn go" data-act="enGo" id="enGo" style="width:100%;margin-top:10px">' + enTxt() + '</button>'
    );
  }
  function enTxt() {
    return 'Dar entrada · ' + _en.n + (_en.n === 1 ? ' peça' : ' peças');
  }
  function enDesenha() {
    var ov = lfaAbre('lfa-entr', enHtml());
    ov.classList.add('lfa-camg');
  }
  ACT.enQ = function (d) {
    if (!_en) return;
    var antes = _en.n;
    _en.n = Math.max(1, Math.min(999, _en.n + (+d || 0)));
    if (_en.n === antes) return;
    var n = $('enN'),
      bt = $('enGo');
    if (n) {
      n.textContent = _en.n;
      if (!REDUCED && n.animate) n.animate([{ transform: 'translateY(' + (_en.n > antes ? 14 : -14) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 280, easing: 'cubic-bezier(.4,0,.2,1)' });
    }
    if (bt) bt.textContent = enTxt();
  };
  ACT.enGo = function () {
    if (!_en) return;
    var it = _en.it,
      n = _en.n,
      g = it.lote && S.grp.filter(function (x) {
        return x.id === it.lote;
      })[0],
      err = g ? gCap(g, n) : '';
    if (err) {
      popErr(err);
      return;
    }
    it.qty += n;
    entradaEstoque(it.tipo, it.ref, it.cor, it.grau || '', n);
    _en = null;
    lfaFecha('lfa-entr');
    vibrar(20);
    lfEntrada(n, it.ref + ' ' + it.cor);
    render();
  };
