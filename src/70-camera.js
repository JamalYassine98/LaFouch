  // ===== Câmera do app (visor, galeria, lanterna, prévia) e plano B nativo. =====
  var CAMO = null,
    CAMS = null;
  // Fecha a câmera e libera o vídeo.
  function camClose() {
    if (CAMS) {
      try {
        CAMS.getTracks().forEach(function (t) {
          t.stop();
        });
      } catch (e) {}
      CAMS = null;
    }
    if (CAMO) {
      CAMO.remove();
      CAMO = null;
    }
  }
  // Arquivo de foto → imagem com orientação correta.
  function normFile(f) {
    return (
      window.createImageBitmap
        ? createImageBitmap(f, { imageOrientation: 'from-image' })
        : Promise.reject()
    )
      .then(function (bm) {
        var k = Math.min(1, 2600 / Math.max(bm.width, bm.height)),
          c = mkCanvas(Math.round(bm.width * k), Math.round(bm.height * k));
        c.getContext('2d').drawImage(bm, 0, 0, c.width, c.height);
        try {
          bm.close();
        } catch (e) {}
        return new Promise(function (ok) {
          c.toBlob(
            function (b) {
              ok(b ? new File([b], 'foto.jpg', { type: 'image/jpeg' }) : f);
            },
            'image/jpeg',
            0.9
          );
        });
      })
      .catch(function () {
        return f;
      });
  }
  // Nitidez (foco) de um quadro.
  function sharpOf(cv) {
    try {
      var w = 320,
        h = Math.max(1, Math.round((cv.height * w) / cv.width)),
        c = mkCanvas(w, h),
        g = c.getContext('2d');
      g.drawImage(cv, 0, 0, w, h);
      var d = g.getImageData(0, 0, w, h).data,
        gr = new Float32Array(w * h),
        i,
        x,
        y;
      for (i = 0; i < w * h; i++)
        gr[i] = d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114;
      var sm = 0,
        sq = 0,
        n = 0;
      for (y = 1; y < h - 1; y++)
        for (x = 1; x < w - 1; x++) {
          var l =
            4 * gr[y * w + x] -
            gr[y * w + x - 1] -
            gr[y * w + x + 1] -
            gr[(y - 1) * w + x] -
            gr[(y + 1) * w + x];
          sm += l;
          sq += l * l;
          n++;
        }
      return sq / n - (sm / n) * (sm / n);
    } catch (e) {
      return 999;
    }
  }
  var ARM = 0;
  // Detecta o retorno da câmera nativa.
  function armReturn(lbl) {
    ARM = Date.now();
    var f = function () {
        window.removeEventListener('focus', f);
        document.removeEventListener('visibilitychange', v);
        if (Date.now() - ARM < 600000) {
          loadMsg(true, lbl || 'Carregando foto');
          clearTimeout(armReturn._t);
          armReturn._t = setTimeout(function () {
            loadMsg(false);
          }, 45000);
        }
      },
      v = function () {
        if (!document.hidden) f();
      };
    window.addEventListener('focus', f);
    document.addEventListener('visibilitychange', v);
  }
  // Abre a câmera/galeria nativa do aparelho.
  function nativeInput(onFile, gal, lbl) {
    var i = document.createElement('input');
    i.type = 'file';
    i.accept = 'image/*';
    if (!gal) i.setAttribute('capture', 'environment');
    i.setAttribute('aria-hidden', 'true');
    i.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:0';
    i.addEventListener('click', function () {
      armReturn(lbl);
    });
    i.addEventListener('cancel', function () {
      loadMsg(false);
    });
    i.onchange = function () {
      var f = i.files && i.files[0];
      if (!f) {
        loadMsg(false);
        return;
      }
      clearTimeout(armReturn._t);
      loadMsg(true, lbl || 'Carregando foto');
      setTimeout(function () {
        normFile(f).then(onFile);
      }, 30);
      i.value = '';
    };
    return i;
  }
  // Plano B quando a câmera do app não abre.
  function camFallback(done, gal, lbl) {
    armNative();
    var ov = document.createElement('div');
    ov.style.cssText =
      'position:fixed;inset:0;z-index:330;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;padding:16px';
    var bx = document.createElement('div');
    bx.style.cssText =
      'background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px;width:min(94vw,420px);display:flex;flex-direction:column;gap:10px';
    var w = document.createElement('div');
    w.style.cssText = 'position:relative;display:flex';
    var ok = btn('mini', 'Abrir a câmera', function () {});
    ok.style.cssText += ';width:100%;margin:0';
    w.appendChild(ok);
    w.appendChild(
      nativeInput(
        function (f) {
          ov.remove();
          done(f);
        },
        false,
        lbl
      )
    );
    var ca = btn('chip', 'Cancelar', function () {
      ov.remove();
    });
    ca.style.cssText += ';width:100%;justify-content:center';
    bx.appendChild(w);
    if (HCAM) {
      var rh = mk(
        'div',
        'hint',
        'A câmera do app não abriu (' + HCAM + '). Use a do celular ou a galeria.'
      );
      bx.insertBefore(rh, w);
    }
    if (gal) {
      var w2 = document.createElement('div');
      w2.style.cssText = 'position:relative;display:flex';
      var g2 = btn('chip', 'Escolher da galeria', function () {});
      g2.style.cssText += ';width:100%;justify-content:center;min-height:46px';
      w2.appendChild(g2);
      w2.appendChild(
        nativeInput(
          function (f) {
            ov.remove();
            done(f, { gallery: true });
          },
          true,
          lbl
        )
      );
      bx.appendChild(w2);
    }
    bx.appendChild(ca);
    ov.appendChild(bx);
    document.body.appendChild(ov);
  }
  var NATIVE = false,
    HCAM = '';
  // Liga a captura nativa no botão do leitor.
  function armNative() {
    if (NATIVE) return;
    NATIVE = true;
    [
      [
        'btnLeitor',
        function (f) {
          leitorFromPhoto(f);
        }
      ]
    ].forEach(function (d) {
      var b = $(d[0]);
      if (!b || !b.parentNode) return;
      var w = document.createElement('div');
      w.style.cssText =
        'position:relative;display:flex;flex:' +
        (b.style.flex || '1 1 auto') +
        ';' +
        (b.style.width && b.style.flex ? 'width:' + b.style.width + ';' : 'width:100%;');
      b.parentNode.insertBefore(w, b);
      w.appendChild(b);
      b.style.flex = '1 1 auto';
      b.style.width = '100%';
      b.onclick = function () {};
      w.appendChild(nativeInput(d[1], false, d[0] === 'btnLeitor' ? 'Analisando código' : ''));
    });
  }
  // Abre a câmera do app (com plano B se falhar).
  // Endireita o papel: puxa o quadrilátero (cantos TL, TR, BR, BL em 0..1) para um retângulo.
  function warpDoc(c, P) {
    var w = c.width,
      h = c.height,
      cxm = P.reduce(function (a, p) { return a + p[0]; }, 0) / 4,
      cym = P.reduce(function (a, p) { return a + p[1]; }, 0) / 4,
      pt = P.map(function (p) {
        return [(cxm + (p[0] - cxm) * 0.985) * w, (cym + (p[1] - cym) * 0.985) * h];
      }),
      dd = function (a, b) {
        return Math.hypot(a[0] - b[0], a[1] - b[1]);
      },
      W = Math.round((dd(pt[0], pt[1]) + dd(pt[3], pt[2])) / 2),
      H = Math.round((dd(pt[0], pt[3]) + dd(pt[1], pt[2])) / 2);
    if (W < 120 || H < 120) return null;
    var k = Math.min(1, 2000 / Math.max(W, H));
    W = Math.round(W * k);
    H = Math.round(H * k);
    var src = c.getContext('2d').getImageData(0, 0, w, h).data,
      out = mkCanvas(W, H),
      ctx = out.getContext('2d'),
      im = ctx.createImageData(W, H),
      o = im.data,
      i,
      j,
      ch;
    for (j = 0; j < H; j++) {
      var v = j / (H - 1);
      for (i = 0; i < W; i++) {
        var u = i / (W - 1),
          x = (1 - v) * ((1 - u) * pt[0][0] + u * pt[1][0]) + v * ((1 - u) * pt[3][0] + u * pt[2][0]),
          y = (1 - v) * ((1 - u) * pt[0][1] + u * pt[1][1]) + v * ((1 - u) * pt[3][1] + u * pt[2][1]),
          x0 = Math.max(0, Math.min(w - 2, Math.floor(x))),
          y0 = Math.max(0, Math.min(h - 2, Math.floor(y))),
          fx = Math.max(0, Math.min(1, x - x0)),
          fy = Math.max(0, Math.min(1, y - y0)),
          a = (y0 * w + x0) * 4,
          b = a + 4,
          c2 = a + w * 4,
          d2 = c2 + 4,
          oi = (j * W + i) * 4;
        for (ch = 0; ch < 4; ch++)
          o[oi + ch] = (src[a + ch] * (1 - fx) + src[b + ch] * fx) * (1 - fy) + (src[c2 + ch] * (1 - fx) + src[d2 + ch] * fx) * fy;
      }
    }
    ctx.putImageData(im, 0, 0);
    return out;
  }
  function camOpen() {
    try {
      camOpen0.apply(null, arguments);
    } catch (e) {
      camClose();
      popErr('Erro ao abrir a câmera: ' + ((e && e.message) || e));
    }
  }
  var LIVEX = null,
    OBT = null;
  // Câmera do app: visor, disparo, galeria, lanterna e prévia.
  function camOpen0(done, title, opts) {
    opts = opts || {};
    LIVEX = null;
    var DZ = 1; /* zoom digital (quando o aparelho não oferece zoom na câmera) */
    camClose();
    if (opts.live || opts.liveFallback) {
      try {
        getWorker().catch(function () {});
      } catch (e) {}
    } /* aquece o leitor enquanto a câmera abre */
    var blocked = false;
    try {
      var fp = document.permissionsPolicy || document.featurePolicy;
      if (fp && fp.allowsFeature && !fp.allowsFeature('camera')) blocked = true;
    } catch (e) {}
    if (blocked || !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      camFallback(opts.liveFallback || done, opts.gallery, opts.live ? 'Analisando código' : '');
      return;
    }
    var ov = document.createElement('div');
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', title || 'Câmera');
    ov.style.cssText =
      'position:fixed;inset:0;z-index:300;background:#000;display:flex;flex-direction:column;color:#fff';
    var top = document.createElement('div');
    top.style.cssText =
      'display:flex;justify-content:space-between;align-items:center;padding:max(10px,env(safe-area-inset-top,0px)) 14px 10px';
    top.appendChild(mk('b', '', title || 'Câmera'));
    var xb = btn('chip', '✕', function () {
      camClose();
    });
    xb.setAttribute('aria-label', 'Fechar');
    xb.style.cssText = 'min-height:40px;width:44px;padding:0;justify-content:center';
    var tr = document.createElement('div');
    tr.style.cssText = 'display:flex;gap:8px;align-items:center';
    if (opts.skip) {
      var sk = btn('chip', opts.skipTxt || 'Pular', function () {
        camClose();
        opts.skip();
      });
      sk.style.minHeight = '40px';
      tr.appendChild(sk);
    }
    tr.appendChild(xb);
    top.appendChild(tr);
    var stg = document.createElement('div');
    stg.style.cssText =
      'position:relative;flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden';
    var vid = document.createElement('video');
    vid.setAttribute('playsinline', '');
    vid.muted = true;
    vid.autoplay = true;
    vid.style.cssText = 'width:100%;height:100%;object-fit:contain;background:#000';
    var gd = document.createElement('div');
    gd.style.cssText =
      'position:absolute;left:50%;top:50%;width:' +
      (opts.strip ? '90%' : '84%') +
      ';height:' +
      (opts.strip ? '20%' : '50%') +
      ';max-width:' +
      (opts.strip ? '720px' : '560px') +
      ';transform:translate(-50%,-50%);border:2px solid rgba(255,255,255,.85);border-radius:14px;pointer-events:none';
    var ring = document.createElement('div');
    ring.style.cssText =
      'position:absolute;width:64px;height:64px;border:2px solid #ffd54a;border-radius:50%;opacity:0;transform:translate(-50%,-50%);pointer-events:none;transition:opacity .25s';
    var tip = mk(
      'div',
      '',
      '' + (opts.tip || 'Enquadre a peça dentro do retângulo. Toque na tela para focar.') + ''
    );
    tip.style.cssText =
      'position:absolute;left:0;right:0;bottom:8px;text-align:center;font-size:13px;color:#fff;text-shadow:0 1px 3px #000;padding:0 16px;pointer-events:none';
    stg.appendChild(vid);
    stg.appendChild(gd);
    stg.appendChild(ring);
    stg.appendChild(tip);
    var LV = opts.live && !REDUCED ? leitorVisor(gd, stg) : null;
    /* leitor de documento: acha o contorno do papel (região clara) e o acompanha, como câmera de scanner */
    var DOC = null;
    if (opts.doc) {
      var NS = 'http://www.w3.org/2000/svg',
        svg = document.createElementNS(NS, 'svg'),
        pgn = document.createElementNS(NS, 'polygon'),
        cvA = document.createElement('canvas'),
        lastOk = 0;
      svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
      pgn.setAttribute('fill', 'rgba(47,224,143,.12)');
      pgn.setAttribute('stroke', '#2fe08f');
      pgn.setAttribute('stroke-width', '3');
      pgn.setAttribute('stroke-linejoin', 'round');
      pgn.style.display = 'none';
      svg.appendChild(pgn);
      stg.appendChild(svg);
      var docAnalisa = function () {
        if (!ov.isConnected) return clearInterval(docT);
        var vw = vid.videoWidth,
          vh = vid.videoHeight;
        if (!vw || !vh || vid.paused || pv.style.display === 'block') return;
        var W = 96,
          H = Math.max(24, Math.round((W * vh) / vw)),
          N = W * H;
        cvA.width = W;
        cvA.height = H;
        var cx2 = cvA.getContext('2d', { willReadFrequently: true });
        cx2.drawImage(vid, 0, 0, W, H);
        var d = cx2.getImageData(0, 0, W, H).data,
          L = new Uint8Array(N),
          hist = new Array(256).fill(0),
          i;
        for (i = 0; i < N; i++) {
          L[i] = (d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11) | 0;
          hist[L[i]]++;
        }
        var sum = 0,
          sB = 0,
          wB = 0,
          mx = 0,
          th = 128;
        for (i = 0; i < 256; i++) sum += i * hist[i];
        for (i = 0; i < 256; i++) {
          wB += hist[i];
          if (!wB) continue;
          var wF = N - wB;
          if (!wF) break;
          sB += i * hist[i];
          var mB = sB / wB,
            mF = (sum - sB) / wF,
            bt = wB * wF * (mB - mF) * (mB - mF);
          if (bt > mx) {
            mx = bt;
            th = i;
          }
        }
        var lab = new Int32Array(N),
          best = null,
          id = 0,
          st = [];
        for (i = 0; i < N; i++) {
          if (lab[i] || L[i] <= th) continue;
          id++;
          st.length = 0;
          st.push(i);
          lab[i] = id;
          var ar = 0,
            tl = [1e9, 0, 0],
            tr = [-1e9, 0, 0],
            br = [-1e9, 0, 0],
            bl = [1e9, 0, 0],
            edge = 0;
          while (st.length) {
            var q = st.pop(),
              x = q % W,
              y = (q / W) | 0;
            ar++;
            if (x === 0 || y === 0 || x === W - 1 || y === H - 1) edge++;
            if (x + y < tl[0]) tl = [x + y, x, y];
            if (x - y > tr[0]) tr = [x - y, x, y];
            if (x + y > br[0]) br = [x + y, x, y];
            if (x - y < bl[0]) bl = [x - y, x, y];
            if (x > 0 && !lab[q - 1] && L[q - 1] > th) (lab[q - 1] = id), st.push(q - 1);
            if (x < W - 1 && !lab[q + 1] && L[q + 1] > th) (lab[q + 1] = id), st.push(q + 1);
            if (y > 0 && !lab[q - W] && L[q - W] > th) (lab[q - W] = id), st.push(q - W);
            if (y < H - 1 && !lab[q + W] && L[q + W] > th) (lab[q + W] = id), st.push(q + W);
          }
          if (ar > N * 0.12 && ar < N * 0.96 && edge < (W + H) * 1.2 && (!best || ar > best.ar)) best = { ar: ar, p: [tl, tr, br, bl] };
        }
        var now = Date.now();
        if (best) {
          var np = best.p.map(function (p) {
            return [p[1] / (W - 1), p[2] / (H - 1)];
          });
          if (DOC && DOC.p) np = np.map(function (p, j) { return [DOC.p[j][0] * 0.5 + p[0] * 0.5, DOC.p[j][1] * 0.5 + p[1] * 0.5]; });
          DOC = { p: np, ok: true };
          lastOk = now;
        } else if (now - lastOk > 1200) DOC = null;
        gd.style.display = DOC ? 'none' : '';
        if (!DOC) return void (pgn.style.display = 'none');
        var sr = stg.getBoundingClientRect(),
          kk = Math.min(sr.width / vw, sr.height / vh),
          ox = (sr.width - vw * kk) / 2,
          oy = (sr.height - vh * kk) / 2;
        pgn.setAttribute(
          'points',
          DOC.p
            .map(function (p) {
              return (ox + p[0] * vw * kk).toFixed(1) + ',' + (oy + p[1] * vh * kk).toFixed(1);
            })
            .join(' ')
        );
        pgn.style.display = '';
      };
      var docT = setInterval(docAnalisa, 260);
      tip.textContent = 'Enquadre a nota inteira: o contorno verde acompanha o papel. Toque na tela para focar.';
    }
    var bar = document.createElement('div');
    bar.style.cssText =
      'display:flex;align-items:center;justify-content:center;gap:18px;padding:14px 14px max(18px,env(safe-area-inset-bottom,0px));flex-wrap:wrap';
    var pv = document.createElement('img');
    pv.style.cssText =
      'display:none;position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000';
    stg.appendChild(pv);
    CAMO = ov;
    ov.appendChild(top);
    ov.appendChild(stg);
    ov.appendChild(bar);
    document.body.appendChild(ov);
    var IGAL =
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.7"/><path d="M4 18l5.2-5.2a1.5 1.5 0 0 1 2.1 0L14 15.5l2-2a1.5 1.5 0 0 1 2.1 0L21 16.4"/></svg>';
    var ITOR = function (on) {
      return (
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><g transform="translate(2.2 4.6) scale(.8)"><path d="M6 2h12v5l-2 2v12.5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 21.5V9L6 7z"/><path d="M12 11v4"/>' +
        (on ? '' : '<path d="M3.5 3.5l17 17"/>') +
        '</g>' +
        (on ? '<path d="M12 .9v2.6M6.2 2.2l1.6 2M17.8 2.2l-1.6 2"/>' : '') +
        '</svg>'
      );
    };
    var CIRC =
      'width:52px;height:52px;border-radius:50%;border:none;background:rgba(255,255,255,.18);color:#fff;display:inline-flex;align-items:center;justify-content:center;padding:0;cursor:pointer';
    function mkGal(icon) {
      var gl = btn('chip', icon ? '' : 'Galeria', function () {
        var gi = document.createElement('input');
        gi.type = 'file';
        gi.accept = 'image/*';
        gi.style.display = 'none';
        document.body.appendChild(gi);
        gi.onchange = function () {
          var f = gi.files && gi.files[0];
          gi.remove();
          if (f)
            normFile(f).then(function (nf) {
              camClose();
              (opts.liveFallback || done)(nf, { gallery: true });
            });
        };
        gi.click();
      });
      gl.style.minHeight = '44px';
      if (icon) {
        gl.innerHTML = IGAL;
        gl.style.cssText = CIRC;
        gl.setAttribute('aria-label', 'Galeria');
      }
      return gl;
    }
    var TOR0 = false;
    function buildBar(trk, caps) {
      bar.textContent = '';
      bar.style.cssText =
        'display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;padding:12px 22px max(18px,env(safe-area-inset-bottom,0px))';
      if (caps && caps.zoom) {
        var zr = document.createElement('input');
        zr.type = 'range';
        zr.min = caps.zoom.min;
        zr.max = Math.min(caps.zoom.max, caps.zoom.min * 5 || caps.zoom.max);
        zr.step = caps.zoom.step || 0.1;
        zr.value = caps.zoom.min;
        zr.style.cssText = 'grid-column:1/-1;width:100%;margin:0 0 6px';
        zr.setAttribute('aria-label', 'Zoom');
        zr.oninput = function () {
          try {
            trk.applyConstraints({ advanced: [{ zoom: +zr.value }] });
          } catch (e) {}
        };
        bar.appendChild(zr);
      } else {
        var zd = document.createElement('input');
        zd.type = 'range';
        zd.min = 1;
        zd.max = 4;
        zd.step = 0.1;
        zd.value = DZ;
        zd.style.cssText = 'grid-column:1/-1;width:100%;margin:0 0 6px';
        zd.setAttribute('aria-label', 'Zoom');
        zd.oninput = function () {
          DZ = +zd.value;
          vid.style.transform = 'scale(' + DZ + ')';
        };
        bar.appendChild(zd);
      }
      var lc0 = document.createElement('div');
      lc0.style.cssText = 'display:flex;justify-content:flex-start';
      if (opts.gallery) lc0.appendChild(mkGal(true));
      bar.appendChild(lc0);
      var sh = document.createElement('button');
      sh.type = 'button';
      sh.setAttribute('aria-label', 'Tirar foto');
      sh.style.cssText =
        'width:68px;height:68px;border-radius:50%;border:4px solid #fff;background:#fff;box-shadow:inset 0 0 0 4px #000;cursor:pointer;flex:0 0 auto';
      bar.appendChild(sh);
      var rc0 = document.createElement('div');
      rc0.style.cssText = 'display:flex;justify-content:flex-end';
      if (caps && caps.torch) {
        var tOn = TOR0,
          tb = document.createElement('button');
        tb.type = 'button';
        tb.style.cssText = CIRC;
        var tsync = function () {
          tb.innerHTML = ITOR(tOn);
          tb.style.background = tOn ? '#ffd54a' : 'rgba(255,255,255,.18)';
          tb.style.color = tOn ? '#000' : '#fff';
          tb.setAttribute('aria-label', tOn ? 'Lanterna ligada' : 'Lanterna desligada');
          tb.setAttribute('aria-pressed', tOn ? 'true' : 'false');
        };
        tsync();
        tb.onclick = function () {
          tOn = !tOn;
          TOR0 = tOn;
          try {
            trk.applyConstraints({ advanced: [{ torch: tOn }] });
          } catch (e) {}
          tsync();
        };
        rc0.appendChild(tb);
      }
      bar.appendChild(rc0);
      var HR = null,
        HRtry = false;
      sh.onclick = function (ev) {
        if (ev && HRtry) return; /* um toque só: ignora toques enquanto a foto está sendo feita */
        if (!HRtry) flashCamera(stg);
        if (opts.live) {
          var lc = grabStrip();
          if (!lc) return;
          if (LIVEX) LIVEX();
          lc.toBlob(
            function (bl) {
              if (!bl) return;
              camClose();
              opts.liveFallback(new File([bl], 'foto.jpg', { type: 'image/jpeg' }));
            },
            'image/jpeg',
            0.95
          );
          return;
        }
        if (!HR && !HRtry && !opts.strip && DZ === 1 && window.ImageCapture && trk && !window.__noIC) {
          HRtry = true;
          sh.style.opacity = '.5';
          tip.textContent = 'Tirando a foto…';
          var done0 = false,
            fin = function (x) {
              if (done0) return;
              done0 = true;
              clearTimeout(tm);
              if (!x) window.__noIC = true;
              HR = x || null;
              sh.style.opacity = '';
              sh.onclick();
              HR = null;
              HRtry = false;
            },
            tm = setTimeout(function () {
              fin(null);
            }, 1800);
          try {
            new ImageCapture(trk)
              .takePhoto()
              .then(function (bl) {
                return createImageBitmap(bl, { imageOrientation: 'from-image' });
              })
              .then(
                function (bm) {
                  var k0 = Math.min(1, 2600 / Math.max(bm.width, bm.height)),
                    cc = mkCanvas(Math.round(bm.width * k0), Math.round(bm.height * k0));
                  cc.getContext('2d').drawImage(bm, 0, 0, cc.width, cc.height);
                  try {
                    bm.close();
                  } catch (e) {}
                  fin(cc);
                },
                function () {
                  fin(null);
                }
              );
          } catch (e) {
            fin(null);
          }
          return;
        }
        var src = HR || vid,
          w = HR ? HR.width : vid.videoWidth,
          h = HR ? HR.height : vid.videoHeight;
        if (!w || !h) return;
        var c = mkCanvas(w, h);
        c.getContext('2d').drawImage(src, 0, 0, w, h);
        if (DZ > 1 && !opts.strip) {
          var zw = w / DZ,
            zh = h / DZ,
            cz = mkCanvas(zw, zh);
          cz.getContext('2d').drawImage(c, (w - zw) / 2, (h - zh) / 2, zw, zh, 0, 0, zw, zh);
          c = cz;
        }
        var docOn = !!(opts.doc && DOC && DOC.ok);
        if (docOn) {
          var wc = warpDoc(c, DOC.p);
          if (wc) c = wc;
        } else if (opts.strip || (!opts.live && !opts.nocrop)) {
          var sr = stg.getBoundingClientRect(),
            gr = gd.getBoundingClientRect(),
            SW = sr.width,
            SH = sr.height,
            k = Math.min(SW / w, SH / h),
            ox = (SW - w * k) / 2,
            oy = (SH - h * k) / 2,
            cx = Math.max(0, (SW / 2 + (gr.left - sr.left - SW / 2) / DZ - ox) / k),
            cy = Math.max(0, (SH / 2 + (gr.top - sr.top - SH / 2) / DZ - oy) / k),
            cw = Math.min(w - cx, gr.width / DZ / k),
            ch = Math.min(h - cy, gr.height / DZ / k);
          if (cw > 50 && ch > 20) {
            var c2 = mkCanvas(cw, ch);
            c2.getContext('2d').drawImage(c, cx, cy, cw, ch, 0, 0, cw, ch);
            c = c2;
          }
        }
        var sp = sharpOf(c);
        c.toBlob(
          function (bl) {
            if (!bl) return;
            var url = URL.createObjectURL(bl);
            pv.src = url;
            pv.style.display = 'block';
            gd.style.display = 'none';
            tip.style.display = 'none';
            vid.pause();
            bar.textContent = '';
            bar.style.cssText =
              'display:flex;align-items:center;justify-content:center;gap:18px;padding:14px 14px max(18px,env(safe-area-inset-bottom,0px));flex-wrap:wrap';
            var wm = mk(
              'div',
              '',
              sp < 25
                ? 'A foto parece desfocada. Refaça com mais luz e a peça mais firme.'
                : 'Confira se a peça está inteira e nítida.'
            );
            wm.style.cssText =
              'width:100%;text-align:center;font-size:14px;color:' + (sp < 25 ? '#ffc766' : '#fff');
            bar.appendChild(wm);
            bar.style.cssText =
              'display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px 10px;padding:12px 22px max(18px,env(safe-area-inset-bottom,0px))';
            wm.style.gridColumn = '1/-1';
            var IREF =
              '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4.5v4.8h4.8"/></svg>';
            var sp0 = document.createElement('div');
            bar.appendChild(sp0);
            var us = btn('mini', '', function () {
              var f = new File([bl], 'foto.jpg', { type: 'image/jpeg' });
              try {
                var ir = pv.getBoundingClientRect(),
                  nw = pv.naturalWidth || ir.width,
                  nh = pv.naturalHeight || ir.height,
                  kk = Math.min(ir.width / nw, ir.height / nh);
                OBT = {
                  src: url,
                  t: Date.now(),
                  rect: { l: ir.left + (ir.width - nw * kk) / 2, t: ir.top + (ir.height - nh * kk) / 2, w: nw * kk, h: nh * kk }
                };
              } catch (eo) {}
              camClose();
              done(f);
            });
            us.innerHTML =
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg><span>Confirmar</span>';
            us.style.cssText =
              'height:56px;min-height:56px;padding:0 30px;border-radius:999px;border:none;background:var(--accent);color:#fff;font-weight:700;font-size:17px;display:inline-flex;align-items:center;gap:8px;cursor:pointer';
            us.setAttribute('aria-label', 'Confirmar foto');
            bar.appendChild(us);
            var re = document.createElement('button');
            re.type = 'button';
            re.setAttribute('aria-label', 'Refazer a foto');
            re.innerHTML = IREF;
            re.style.cssText = CIRC + ';justify-self:end';
            re.onclick = function () {
              URL.revokeObjectURL(url);
              pv.style.display = 'none';
              gd.style.display = '';
              tip.style.display = '';
              vid.play();
              buildBar(trk, caps);
            };
            bar.appendChild(re);
          },
          'image/jpeg',
          0.95
        );
      };
    }
    var TIP0 = tip.textContent;
    tip.textContent = 'Abrindo a câmera…';
    var gum = setTimeout(function () {
      if (CAMO && !CAMS) {
        camClose();
        camFallback(opts.liveFallback || done, opts.gallery, opts.live ? 'Analisando código' : '');
      }
    }, 25000);
    var gtry = 0,
      gumC = function () {
        return navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              frameRate: { ideal: 30 }
            }
          })
          .catch(function (e) {
            if (CAMO && gtry++ < 2) {
              return new Promise(function (r) {
                setTimeout(r, 700 * gtry);
              }).then(function () {
                if (!CAMO) throw e;
                return gumC();
              });
            }
            throw e;
          });
      };
    gumC().then(
      function (st) {
        clearTimeout(gum);
        if (!CAMO) {
          st.getTracks().forEach(function (t) {
            t.stop();
          });
          return;
        }
        CAMS = st;
        tip.textContent = TIP0;
        vid.srcObject = st;
        var trk = st.getVideoTracks()[0],
          caps = {};
        try {
          caps = trk.getCapabilities ? trk.getCapabilities() : {};
        } catch (e) {}
        try {
          if (caps.focusMode && caps.focusMode.indexOf('continuous') >= 0)
            trk.applyConstraints({ advanced: [{ focusMode: 'continuous' }] });
        } catch (e) {}
        stg.addEventListener('click', function (ev) {
          var rc = stg.getBoundingClientRect(),
            x = ev.clientX - rc.left,
            y = ev.clientY - rc.top;
          ring.style.left = x + 'px';
          ring.style.top = y + 'px';
          ring.style.opacity = '1';
          setTimeout(function () {
            ring.style.opacity = '0';
          }, 700);
          try {
            if (caps.focusMode && caps.focusMode.indexOf('single-shot') >= 0) {
              var vr = vid.getBoundingClientRect();
              trk
                .applyConstraints({
                  advanced: [
                    {
                      focusMode: 'single-shot',
                      pointsOfInterest: [
                        {
                          x: Math.max(0, Math.min(1, (ev.clientX - vr.left) / vr.width)),
                          y: Math.max(0, Math.min(1, (ev.clientY - vr.top) / vr.height))
                        }
                      ]
                    }
                  ]
                })
                .then(
                  function () {
                    setTimeout(function () {
                      try {
                        if (caps.focusMode.indexOf('continuous') >= 0)
                          trk.applyConstraints({ advanced: [{ focusMode: 'continuous' }] });
                      } catch (e) {}
                    }, 1500);
                  },
                  function () {}
                );
            }
          } catch (e) {}
        });
        buildBar(trk, caps);
        if (opts.live) startLive();
      },
      function (e) {
        clearTimeout(gum);
        camClose();
        HCAM = (e && (e.name || e.message)) || '';
        camFallback(opts.liveFallback || done, opts.gallery, opts.live ? 'Analisando código' : '');
      }
    );
    function grabStrip() {
      var w = vid.videoWidth,
        h = vid.videoHeight;
      if (!w || !h) return null;
      var sr = stg.getBoundingClientRect(),
        gr = gd.getBoundingClientRect(),
        SW = sr.width,
        SH = sr.height,
        k = Math.min(SW / w, SH / h),
        ox = (SW - w * k) / 2,
        oy = (SH - h * k) / 2,
        cx = Math.max(0, (SW / 2 + (gr.left - sr.left - SW / 2) / DZ - ox) / k),
        cy = Math.max(0, (SH / 2 + (gr.top - sr.top - SH / 2) / DZ - oy) / k),
        cw = Math.min(w - cx, gr.width / DZ / k),
        ch = Math.min(h - cy, gr.height / DZ / k);
      if (cw < 50 || ch < 20) return null;
      var c = mkCanvas(cw, ch);
      c.getContext('2d').drawImage(vid, cx, cy, cw, ch, 0, 0, cw, ch);
      return c;
    }
    function startLive() {
      var texts = [],
        fr = 0,
        t0 = Date.now(),
        stopped = false,
        LW = null;
      LIVEX = function () {
        stopped = true;
        try {
          dw._stop();
        } catch (e) {}
      };
      var dw = busyEl('Analisando código'),
        dx = document.createElement('span');
      tip.textContent = '';
      tip.appendChild(dw);
      tip.appendChild(dx);
      var fin = function (v) {
        if (stopped) return;
        stopped = true;
        try {
          dw._stop();
        } catch (e) {}
        try {
          if (LW) LW.setParameters({ tessedit_pageseg_mode: '11' });
        } catch (e) {}
        if (!CAMO) return;
        if (LV && v && v.ref) {
          LV.achou(v, function () {
            if (!CAMO) return;
            camClose();
            opts.live(v);
          });
          return;
        }
        camClose();
        opts.live(v);
      };
      getWorker()
        .then(function (w) {
          LW = w;
          return w.setParameters({ tessedit_pageseg_mode: '6' });
        })
        .then(
          function () {
            (function tick() {
              if (stopped || !CAMO) return;
              var sc = grabStrip();
              if (!sc) {
                setTimeout(tick, 200);
                return;
              }
              (function () {
                var est = 0;
                try {
                  est = skewOf(sc);
                } catch (e) {}
                var ang = fr % 2 === 0 ? est : [0, -9, 9][(fr >> 1) % 3];
                return LW.recognize(prepVar(ang ? rotateCanvas(sc, -ang) : sc, fr % 4));
              })().then(
                function (r) {
                  fr++;
                  texts.push(r.data.text || '');
                  var v = parseVote(texts);
                  dx.textContent = (v.ref ? ' · ' + v.ref : '') + (v.med ? ' · ' + v.med : '');
                  if (v.ref && v.nRef >= 2 && (v.nMed >= 2 || fr >= 8)) {
                    fin({ ref: v.ref, med: v.med, vr: v.vr });
                    return;
                  }
                  if (Date.now() - t0 > 30000) {
                    fin(
                      v.ref
                        ? { ref: v.ref, med: v.med, vr: v.vr }
                        : v.med || v.vr
                          ? { ref: '', med: v.med, vr: v.vr }
                          : null
                    );
                    return;
                  }
                  setTimeout(tick, 220);
                },
                function () {
                  setTimeout(tick, 400);
                }
              );
            })();
          },
          function (e) {
            HERR = (e && (e.code || e.message)) || String(e);
            fin(null);
          }
        );
    }
  }
