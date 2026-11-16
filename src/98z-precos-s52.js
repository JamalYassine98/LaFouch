  // ===== S370 (16/11/2026) — esboço 52 (Preços no padrão de luxo, aprovado 16/11 01:15) =====
  // "Para decidir esta semana": uma linha por ASSUNTO — "Subir N preços · ver um por um" (as linhas de cada peça ficam
  // guardadas e abrem no "ver um por um") e UMA linha por tabela de atacado ("Tabela X: N peças com margem baixa ·
  // a menor está em N% · ajustar tabela"). Números sem caixa, linhas finas, ações como texto e um só botão principal.
  var _cnt52 = contadorHtml;
  contadorHtml = function () {
    var html = _cnt52.apply(this, arguments);
    try {
      var w = document.createElement('div');
      w.innerHTML = html;
      var C = w.querySelector('.cnt'), D = w.querySelector('.cntD');
      if (!C) return html;
      C.classList.add('lx');
      if (D) {
        var g = {}, pa = {}, ordem = [];
        [].forEach.call(D.querySelectorAll('.cntL'), function (l) {
          var bb = l.querySelector('b'), sm = l.querySelector('small'),
            b = bb ? bb.textContent.trim() : '', s = sm ? sm.textContent.trim() : '',
            m = /^Atacado (\S+) com margem (-?\d+)%/.exec(b);
          if (m) {
            var tab = s.split(' · ')[0];
            if (!g[tab]) { g[tab] = { n: 0, min: 999, l: l }; ordem.push(['g', tab]); } else l.classList.add('c52Oc');
            g[tab].n++;
            g[tab].min = Math.min(g[tab].min, +m[2]);
            return;
          }
          var k = /^(Subir|Oferta|Volta ao preço) /.exec(b);
          if (k) {
            var t = k[1];
            if (!pa[t]) { pa[t] = { n: 0, l: l, mot: s.split(' · ')[0], itens: [] }; ordem.push(['p', t]); }
            pa[t].n++;
            pa[t].itens.push(l);
          }
        });
        Object.keys(g).forEach(function (t) {
          var x = g[t], v = x.l.querySelector('.cntV');
          x.l.querySelector('b').textContent = 'Tabela ' + t + ': ' + x.n + (x.n === 1 ? ' peça' : ' peças') + ' com margem baixa';
          x.l.querySelector('small').textContent = 'abaixo de 10% · a menor está em ' + x.min + '%';
          if (v) v.textContent = 'ajustar tabela';
        });
        var npa = 0;
        Object.keys(pa).forEach(function (t, gi) {
          var x = pa[t];
          npa += x.n;
          if (x.n < 2) return;
          // a linha do assunto entra antes da primeira peça; as linhas de cada peça ficam guardadas (abrem no "ver um por um")
          var cab = document.createElement('div');
          cab.className = 'cntL c52G';
          cab.innerHTML = '<span class="cntI"></span><div><b>' + esc({ Subir: 'Subir ' + x.n + ' preços', Oferta: 'Pôr ' + x.n + ' peças em oferta', 'Volta ao preço': x.n + ' peças voltam ao preço' }[t]) + '</b><small>' + esc(x.mot) + '</small></div>' +
            '<button type="button" class="lxT" data-act="c52Ver" data-id="' + gi + '">ver um por um</button>';
          x.l.parentNode.insertBefore(cab, x.l);
          x.itens.forEach(function (l) { l.classList.add('c52Oc', 'c52P' + gi); });
        });
        // "Ver um por um" de baixo vira o da linha; o botão principal diz quantos preços aceita
        var um = D.querySelector('.cntB [data-act="cntUmPorUm"]');
        if (um) um.remove();
        var ac = D.querySelector('.cntB .go');
        if (ac && npa) ac.textContent = npa === 1 ? 'Aceitar o preço' : 'Aceitar os ' + npa + ' preços';
        var n = [].filter.call(D.querySelectorAll('.cntL'), function (l) { return !l.classList.contains('c52Oc'); }).length,
          lb = D.querySelector('.lbl');
        if (lb) lb.textContent = lb.textContent.replace(/· \d+/, '· ' + n);
      }
      [].forEach.call(C.querySelectorAll('.cntB button'), function (b) { if (!b.classList.contains('go')) b.className = 'lxT m'; });
      return w.innerHTML;
    } catch (e) {
      return html;
    }
  };
  ACT.c52Ver = function (gi) {
    [].forEach.call(document.querySelectorAll('.cnt .c52P' + gi), function (l) {
      l.classList.remove('c52Oc');
      var u = l.querySelector('.cntUm');
      if (u) u.hidden = false;
    });
    var b = document.querySelector('.cnt [data-act="c52Ver"][data-id="' + gi + '"]');
    if (b) b.closest('.cntL').remove();
  };
