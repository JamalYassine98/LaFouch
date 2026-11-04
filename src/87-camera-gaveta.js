  // ===== Gaveta "Buscar com a câmera" (v407): Ler haste · Foto da armação (parecidas). Um só risco; fecha deslizando ou tocando fora. =====
  function camGaveta(inp) {
    var ov = lfaAbre(
      'lfa-camg',
      '<div class="cg-puxa" aria-hidden="true"></div><div class="cg-tt">Buscar com a câmera</div>' +
        '<button type="button" class="cg-card" data-k="haste" style="--i:0"><span class="cg-ic">' + ICO.haste + '</span><span><b>Ler haste</b><small>Lê o código gravado na haste e abre a peça</small></span></button>' +
        '<button type="button" class="cg-card" data-k="foto" style="--i:1"><span class="cg-ic">' + ICO.moldura + '</span><span><b>Foto da armação</b><small>Compara a foto e mostra as mais parecidas</small></span></button>'
    );
    ov.classList.add('lfa-camg');
    var sh = ov.querySelector('.lfa-sh'),
      pu = ov.querySelector('.cg-puxa'),
      fecha = function () {
        lfaFecha('lfa-camg');
      },
      y0 = 0,
      dy = 0,
      on = false;
    ov.addEventListener('click', function (e) {
      if (e.target === ov) fecha();
    });
    pu.addEventListener('touchstart', function (e) {
      y0 = e.touches[0].clientY;
      dy = 0;
      on = true;
    }, { passive: true });
    pu.addEventListener('touchmove', function (e) {
      if (!on) return;
      dy = e.touches[0].clientY - y0;
      if (dy > 0) {
        sh.style.transition = 'none';
        sh.style.transform = 'translateY(' + Math.round(dy * 0.8) + 'px)';
      }
    }, { passive: true });
    pu.addEventListener('touchend', function () {
      on = false;
      sh.style.transition = 'transform .22s';
      sh.style.transform = '';
      if (dy > 80) fecha();
    });
    [].slice.call(ov.querySelectorAll('.cg-card')).forEach(function (c) {
      c.onclick = function () {
        fecha();
        if (c.getAttribute('data-k') === 'haste') hasteOpen(inp);
        else
          camOpen(
            function (f) {
              camParecidas(f, inp);
            },
            'Foto da armação',
            { gallery: true, tip: 'Ponha a armação inteira dentro do retângulo, sobre fundo liso.' }
          );
      };
    });
  }
  // Foto da armação: procura as mais parecidas no estoque e mostra com a porcentagem.
  function camParecidas(f, inp) {
    loadMsg(true, 'Comparando com o estoque', 40000);
    fmArquivo(f, function (cv) {
      fmRank(cv, 0.5).then(function (rk) {
        loadMsg(false);
        var ov = lfaAbre(
          'lfa-camp',
          '<div class="cg-puxa" aria-hidden="true"></div><div class="cg-tt">Mais parecidas</div>' +
            (rk.length
              ? rk
                  .map(function (r, i) {
                    var it = S.items.filter(function (x) {
                      return x.ref === r.ref && !x.bulk;
                    })[0];
                    return '<button type="button" class="cg-card cg-par' + (i === 0 ? ' top' : '') + '" data-ref="' + esc(r.ref) + '" style="--i:' + i + '"><span class="cg-ft">' + (r.foto ? '<img alt="" src="' + r.foto + '">' : '') + '</span><span style="min-width:0;flex:1"><b>' + esc(pubNome(r.ref)) + '</b><small>' + esc(r.ref) + '</small></span><span class="cg-pct" data-p="' + Math.round(r.score * 100) + '">0%</span></button>';
                  })
                  .join('')
              : '<div class="hint" style="text-align:center;padding:14px 0">Nada parecido no estoque. Tente outra foto, com a armação inteira e fundo liso.</div>')
        );
        ov.classList.add('lfa-camg');
        var sh = ov.querySelector('.lfa-sh'),
          pu = ov.querySelector('.cg-puxa'),
          fecha = function () {
            lfaFecha('lfa-camp');
          },
          y0 = 0,
          dy = 0;
        ov.addEventListener('click', function (e) {
          if (e.target === ov) fecha();
        });
        pu.addEventListener('touchstart', function (e) {
          y0 = e.touches[0].clientY;
          dy = 0;
        }, { passive: true });
        pu.addEventListener('touchmove', function (e) {
          dy = e.touches[0].clientY - y0;
          if (dy > 0) {
            sh.style.transition = 'none';
            sh.style.transform = 'translateY(' + Math.round(dy * 0.8) + 'px)';
          }
        }, { passive: true });
        pu.addEventListener('touchend', function () {
          sh.style.transition = 'transform .22s';
          sh.style.transform = '';
          if (dy > 80) fecha();
        });
        [].slice.call(ov.querySelectorAll('.cg-par')).forEach(function (c) {
          c.onclick = function () {
            inp.value = c.getAttribute('data-ref');
            inp.dispatchEvent(new Event('input', { bubbles: true }));
            fecha();
          };
        });
        // as porcentagens contam de 0 até o valor (280 ms) e a primeira ganha brilho
        [].slice.call(ov.querySelectorAll('.cg-pct')).forEach(function (el, i) {
          var alvo = +el.getAttribute('data-p'),
            t0 = Date.now() + 160 + i * 90,
            dur = REDUCED ? 0 : 450,
            passo = function () {
              var k = dur ? Math.max(0, Math.min(1, (Date.now() - t0) / dur)) : 1;
              el.textContent = Math.round(alvo * (1 - Math.pow(1 - k, 3))) + '%';
              if (k < 1) requestAnimationFrame(passo);
            };
          passo();
        });
      });
    });
  }
