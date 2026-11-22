  // ===== Galeria da peça (esboço 41, aprovado 21/11/2026 07:51) =====
  // Lugar próprio, aberto pela linha do Estúdio ("Galeria ›"): "‹ ESTÚDIO", o nome da peça, a cor e três blocos — FRENTE · 3/4 · GIRO · 360°.
  // Cada bloco mostra o que a peça tem (estTem, o mesmo lugar que a fila e as marcas da lista leem) e o link do que dá para fazer:
  // "Refazer ›" / "Tirar agora ›" (estSessao, o caminho da fila) e "Gravar agora ›" (estGiro). No fim, "Ver a ficha da peça ›".
  // O giro gira com o dedo com a MESMA conta do site (catalogo js/lf-site.js, ggPinta): 220° por largura da imagem (no mínimo 200 px),
  // quadro = ângulo/360 × n, vídeo no meio do quadro ((q + 0,5)/30 s) e, ao soltar, segue girando e perde força (×0,994 por ms).
  var GAL_FPS = 30, GAL_GRAUS = 220, GAL_ATRITO = 0.994;
  function galQuadro(ang, n) { return ((Math.round(ang / 360 * n) % n) + n) % n; }
  function galGrausPorPx(larg) { return GAL_GRAUS / Math.max(200, larg); }
  // monta o tocador dentro de `caixa` com o vídeo `blob` de n quadros; avisa(ângulo 0–359) a cada quadro mostrado. Devolve { para() }.
  function galTocador(caixa, blob, n, avisa) {
    var v = document.createElement('video'), url = URL.createObjectURL(blob),
      g = { ang: 0, vel: 0, n: n, mostr: -1, quer: 0, busc: false, arr: false, ok: false, v: v };
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.preload = 'auto'; v.disablePictureInPicture = true;
    caixa._gal = g;
    var pinta = function () {
      if (!g.ok || g.busc) return;
      var q = galQuadro(g.ang, g.n);
      if (q === g.mostr) return;
      g.busc = true; g.quer = q;
      try { v.currentTime = (q + 0.5) / GAL_FPS; } catch (e) { g.busc = false; }
    };
    v.addEventListener('seeked', function () { g.busc = false; g.mostr = g.quer; if (avisa) avisa(Math.round(g.mostr * 360 / g.n) % 360); pinta(); });
    v.addEventListener('loadeddata', function () {
      if (g.ok) return;
      if (!(g.n > 1)) g.n = Math.max(2, Math.round((v.duration || 0) * GAL_FPS)); // giro ainda não tratado: os quadros são os do próprio vídeo
      g.ok = true; g.dur = v.duration || 0; caixa.classList.add('pronto');
      try { v.currentTime = 0.5 / GAL_FPS; } catch (e) {}
      if (avisa) avisa(0);
    });
    caixa.addEventListener('pointerdown', function (e) {
      if (!g.ok || (e.pointerType === 'mouse' && e.button !== 0)) return;
      g.pid = e.pointerId; g.px = e.clientX; g.pt = performance.now(); g.vel = 0; g.arr = true;
      try { caixa.setPointerCapture(e.pointerId); } catch (x) {}
    });
    caixa.addEventListener('pointermove', function (e) {
      if (!g.arr || e.pointerId !== g.pid) return;
      var a = performance.now(), dt = Math.max(1, a - g.pt), gr = galGrausPorPx(caixa.clientWidth), dx = e.clientX - g.px;
      g.ang -= dx * gr; g.vel = -dx * gr / dt; g.px = e.clientX; g.pt = a;
      pinta();
      e.preventDefault();
    });
    var solta = function (e) {
      if (!g.arr || (e && e.pointerId !== g.pid)) return;
      g.arr = false;
      var u = performance.now();
      (function f() {
        if (g.arr || !caixa.isConnected) return;
        var a = performance.now(), dt = a - u; u = a;
        g.ang += g.vel * dt; g.vel *= Math.pow(GAL_ATRITO, dt);
        pinta();
        if (Math.abs(g.vel) > 0.01 && !REDUCED) requestAnimationFrame(f);
      })();
    };
    caixa.addEventListener('pointerup', solta);
    caixa.addEventListener('pointercancel', solta);
    caixa.insertBefore(v, caixa.firstChild);
    v.src = url; v.load();
    return { para: function () { try { v.pause(); v.removeAttribute('src'); v.load(); URL.revokeObjectURL(url); } catch (e) {} } };
  }
  function galQuando(ts) {
    var d = new Date(ts), h = new Date();
    return d.toDateString() === h.toDateString() ? 'hoje' : 'em ' + fd(ts);
  }
  // k = "ref|cor"; volta() redesenha quem abriu (a lista do Estúdio)
  function estGaleria(k, volta) {
    var ref = String(k).split('|')[0], cor = String(k).split('|').slice(1).join('|'),
      ov = document.createElement('div'), toc = null;
    ov.className = 'estOv estGal';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-label', 'Galeria · ' + pn(ref));
    document.body.appendChild(ov);
    var bloco = function (tit, link, corpo) {
        return '<section class="galB"><div class="galT"><span>' + tit + '</span>' + (link ? '<button type="button" class="' + lkCls(false).trim() + '" data-g="' + link[1] + '">' + link[0] + ' ›</button>' : '') + '</div>' + corpo + '</section>';
      },
      foto = function (u, alt) { return '<div class="galF"><img src="' + esc(u) + '" alt="' + esc(alt) + '"></div>'; },
      falta = function (t, s) { return '<div class="galV"><b>' + t + '</b><small>' + s + '</small></div>'; },
      fecha = function () { if (toc) toc.para(); toc = null; ov.remove(); },
      reabre = function () { if (volta) volta(); estGaleria(k, volta); },
      pinta = function () {
        var t = estTem(k), F = S.fotos || {}, gi = (S.giros && S.giros[ref]) || null;
        ov.innerHTML =
          '<div class="galHd"><button type="button" class="galVs" data-g="volta">‹ Estúdio</button></div>' +
          '<div class="estBody"><h1 class="galNm">' + esc(pn(ref)) + '</h1><p class="estSub">' + esc(cor ? cor + ' · ' : '') + 'as fotos que vão para o site</p>' +
          bloco('Frente', F[k] ? ['Refazer', 'frente'] : ['Tirar agora', 'frente'], F[k] ? foto(F[k], 'Frente') : falta('Falta a foto da frente', 'a peça de frente, no fundo branco')) +
          bloco('3/4', t.tres4 ? ['Refazer', '34'] : F[k] ? ['Tirar agora', '34'] : null, t.tres4 ? foto(F[k + '|34'], '3/4') : falta('Falta a foto de 3/4', 'a peça virada de lado, como no site')) +
          bloco('Giro · 360°', t.giro ? ['Refazer', 'giro'] : ['Gravar agora', 'giro'], t.giro
            ? '<div class="galG" id="galG"><div class="galGi" aria-hidden="true"><i></i></div></div><div class="galGl"><span id="galGa">' + (gi ? 'Arraste para girar' : 'O giro está no site (foi gravado em outro aparelho)') + '</span><small id="galGq">' + (gi ? 'gravado ' + galQuando(gi.ts) : '') + '</small></div>'
            : falta('Falta o giro', 'a peça dando uma volta no prato')) +
          '<div class="galFim"><button type="button" class="' + lkCls(true).trim() + '" data-g="ficha">Ver a ficha da peça ›</button></div></div>';
        var cx = ov.querySelector('#galG');
        if (cx && gi)
          estGiroLe(ref).then(function (b) {
            if (!b || !cx.isConnected) { if (cx.isConnected) ov.querySelector('#galGa').textContent = 'O vídeo do giro não está neste aparelho'; return; }
            toc = galTocador(cx, b, gi.n || 0, function (graus) {
              ov.querySelector('#galGa').textContent = graus + '° de 360°';
              cx.querySelector('.galGi i').style.width = (graus / 360 * 100).toFixed(1) + '%';
              var g = cx._gal, s = Math.round(g.dur || 0);
              if (s) ov.querySelector('#galGq').textContent = 'gravado ' + galQuando(gi.ts) + ' · ' + Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
            });
          });
      };
    pinta();
    ov.onclick = function (e) {
      var b = e.target.closest('[data-g]');
      if (!b) return;
      var a = b.getAttribute('data-g');
      if (a === 'volta') { fecha(); if (volta) volta(); return; }
      if (a === 'ficha') { // a ficha mora no Inventário: fecha a Galeria e o Estúdio
        fecha();
        [].forEach.call(document.querySelectorAll('.estOv'), function (x) { x.remove(); });
        if (typeof fnAbreEstoque === 'function') fnAbreEstoque(ref);
        return;
      }
      fecha();
      EST_SES = null;
      if (a === 'giro') return estGiro({ k: k, fim: reabre });
      estSessao([{ k: k, ref: ref, cor: cor, st: a === '34' ? '34' : 'sem' }], 0, reabre); // o mesmo caminho da fila, só com esta peça e este passo
    };
    return ov;
  }
