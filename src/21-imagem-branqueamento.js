  // ===== Imagem: fundo branco sem cortar a armação. =====
  // Monta a imagem final: peça sobre fundo branco.
  function compose(cr, a512, S) {
    var w = 1000,
      n = w * w,
      i,
      x,
      y;
    // máscara do modelo -> w×w (bicúbico via canvas)
    var ac = mkCanvas(512, 512),
      ag = ac.getContext('2d'),
      aid = ag.createImageData(512, 512);
    for (i = 0; i < 512 * 512; i++) {
      var v = Math.round(a512[i] * 255);
      aid.data[i * 4] = v;
      aid.data[i * 4 + 1] = v;
      aid.data[i * 4 + 2] = v;
      aid.data[i * 4 + 3] = 255;
    }
    ag.putImageData(aid, 0, 0);
    var c1 = mkCanvas(w, w),
      g1 = c1.getContext('2d');
    g1.imageSmoothingQuality = 'high';
    g1.drawImage(ac, 0, 0, w, w);
    var ad = g1.getImageData(0, 0, w, w).data,
      A = new Float32Array(n);
    for (i = 0; i < n; i++) A[i] = ad[i * 4] / 255;
    if (!window.__NOSEAM)
      try {
        A = segSeam(A, w);
      } catch (e) {}
    // imagem do recorte em w×w
    var ic = mkCanvas(w, w),
      ig = ic.getContext('2d');
    ig.imageSmoothingQuality = 'high';
    ig.drawImage(cr, 0, 0, w, w);
    var id = ig.getImageData(0, 0, w, w).data,
      g = new Float32Array(n),
      cm = new Float32Array(n),
      R = new Float32Array(n);
    for (i = 0; i < n; i++) {
      var r = id[i * 4],
        gg = id[i * 4 + 1],
        b = id[i * 4 + 2];
      g[i] = (0.299 * r + 0.587 * gg + 0.114 * b) / 255;
      R[i] = (Math.max(r, gg, b) - Math.min(r, gg, b)) / 255;
    }
    var tmp = new Float32Array(n),
      Yb = new Float32Array(n);
    segBox(g, w, w, 2, Yb, tmp);
    segBox(R, w, w, 2, cm, tmp);
    // casco = maior comp. de A>.5, buracos fechados
    var hb = new Uint8Array(n);
    for (i = 0; i < n; i++) hb[i] = A[i] > 0.5 ? 1 : 0;
    var hull = segFill(segLargest(hb, w, w, 0.25), w, w);
    // descasca fundo ESCURO ligado ao exterior (sombra/couro), só se o anel ao redor é escuro
    var d3 = segDilate(hull, w, w, Math.round(w * 0.015)),
      d12 = segDilate(hull, w, w, Math.round(w * 0.06)),
      ringIdx = [];
    for (i = 0; i < n; i++) if (d12[i] && !d3[i]) ringIdx.push(i);
    if (ringIdx.length > 500 && window.__PEELON) {
      var py = segPct(Yb, ringIdx, [40]),
        pc = segPct(cm, ringIdx, [95]);
      if (py[0] < 0.35) {
        var Yt = Math.min(py[0] * 1.2, 0.33),
          Cth = pc[0] * 1.25 + 0.02,
          cand = new Uint8Array(n);
        for (i = 0; i < n; i++) cand[i] = hull[i] && Yb[i] < Yt && cm[i] < Cth ? 1 : 0;
        // proteção: se a própria armação é escura (faixa da borda quase toda "escura"), não descasca nada
        var hin = new Uint8Array(n),
          hb2 = segDilate(
            hull.map(function (v) {
              return v ? 0 : 1;
            }),
            w,
            w,
            Math.round(w * 0.035)
          ),
          bandN = 0,
          bandC = 0;
        for (i = 0; i < n; i++)
          if (hull[i] && hb2[i]) {
            bandN++;
            if (cand[i]) bandC++;
          }
        window.__PEEL = [bandC, bandN, py[0]];
        if (bandN > 200 && bandC / bandN < 0.5) {
          var dist = new Int16Array(n),
            q = new Int32Array(n),
            qh = 0,
            qt = 0,
            lim = Math.round(w * 0.06),
            peel = new Uint8Array(n);
          for (i = 0; i < n; i++) dist[i] = -1;
          for (i = 0; i < n; i++)
            if (hull[i]) {
              x = i % w;
              y = (i / w) | 0;
              if (
                (x > 0 && !hull[i - 1]) ||
                (x < w - 1 && !hull[i + 1]) ||
                (y > 0 && !hull[i - w]) ||
                (y < w - 1 && !hull[i + w]) ||
                x === 0 ||
                y === 0 ||
                x === w - 1 ||
                y === w - 1
              ) {
                if (cand[i]) {
                  dist[i] = 0;
                  q[qt++] = i;
                  peel[i] = 1;
                }
              }
            }
          while (qh < qt) {
            var p = q[qh++],
              dd = dist[p];
            if (dd >= lim) continue;
            x = p % w;
            y = (p / w) | 0;
            var nb = [
              x > 0 ? p - 1 : -1,
              x < w - 1 ? p + 1 : -1,
              y > 0 ? p - w : -1,
              y < w - 1 ? p + w : -1
            ];
            for (var k = 0; k < 4; k++) {
              var s = nb[k];
              if (s >= 0 && cand[s] && dist[s] < 0) {
                dist[s] = dd + 1;
                peel[s] = 1;
                q[qt++] = s;
              }
            }
          }
          var pd = segDilate(peel, w, w, 2);
          for (i = 0; i < n; i++) if (pd[i] && hull[i]) A[i] = 0;
        }
      }
    }
    // borda: curva + filtro guiado pela foto
    var A0 = new Float32Array(n);
    for (i = 0; i < n; i++) {
      var t = (A[i] - 0.52) / 0.16 + 0.5;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      A0[i] = t * t * (3 - 2 * t);
    }
    var Ag = segGuided(g, A0, w, w, 3, 2e-5);
    for (i = 0; i < n; i++) {
      var u = (Ag[i] - 0.35) / 0.3;
      u = u < 0 ? 0 : u > 1 ? 1 : u;
      Ag[i] = u * u * (3 - 2 * u);
    }
    // tira ilhas pequenas (restos de fundo), mantém peças grandes
    var bm = new Uint8Array(n);
    for (i = 0; i < n; i++) bm[i] = Ag[i] > 0.5 ? 1 : 0;
    var kp = segLargest(bm, w, w, 0.12),
      kd = segDilate(kp, w, w, 6);
    for (i = 0; i < n; i++) if (!kd[i]) Ag[i] = 0;
    // descontamina a cor da borda: puxa a cor de dentro para fora
    var cr_ = new Float32Array(n),
      cg_ = new Float32Array(n),
      cb_ = new Float32Array(n),
      wt = new Float32Array(n);
    for (i = 0; i < n; i++) {
      var c0 = Ag[i] > 0.97 ? 1 : 0;
      wt[i] = c0;
      cr_[i] = (id[i * 4] / 255) * c0;
      cg_[i] = (id[i * 4 + 1] / 255) * c0;
      cb_[i] = (id[i * 4 + 2] / 255) * c0;
    }
    var rs = [2, 3, 6, 12],
      er = new Float32Array(n),
      eg = new Float32Array(n),
      eb = new Float32Array(n),
      ew = new Float32Array(n),
      ri;
    for (ri = 0; ri < rs.length; ri++) {
      segBox(cr_, w, w, rs[ri], er, tmp);
      segBox(cg_, w, w, rs[ri], eg, tmp);
      segBox(cb_, w, w, rs[ri], eb, tmp);
      segBox(wt, w, w, rs[ri], ew, tmp);
      for (i = 0; i < n; i++)
        if (wt[i] < 0.5 && ew[i] > 0.02) {
          cr_[i] = er[i] / ew[i];
          cg_[i] = eg[i] / ew[i];
          cb_[i] = eb[i] / ew[i];
          wt[i] = 1;
        }
    }
    // composição final em S×S (miolo = pixels originais)
    var fc = mkCanvas(w, w),
      fg = fc.getContext('2d'),
      fd = fg.createImageData(w, w),
      ac2 = mkCanvas(w, w),
      ag2 = ac2.getContext('2d'),
      ad2 = ag2.createImageData(w, w);
    for (i = 0; i < n; i++) {
      var inner = Ag[i] > 0.97;
      fd.data[i * 4] = inner ? id[i * 4] : Math.round(cr_[i] * 255);
      fd.data[i * 4 + 1] = inner ? id[i * 4 + 1] : Math.round(cg_[i] * 255);
      fd.data[i * 4 + 2] = inner ? id[i * 4 + 2] : Math.round(cb_[i] * 255);
      fd.data[i * 4 + 3] = 255;
      var av = Math.round(Ag[i] * 255);
      ad2.data[i * 4] = av;
      ad2.data[i * 4 + 1] = av;
      ad2.data[i * 4 + 2] = av;
      ad2.data[i * 4 + 3] = 255;
    }
    fg.putImageData(fd, 0, 0);
    ag2.putImageData(ad2, 0, 0);
    var out = mkCanvas(S, S),
      og = out.getContext('2d');
    og.imageSmoothingQuality = 'high';
    var fcU = mkCanvas(S, S),
      acU = mkCanvas(S, S);
    [
      [fc, fcU],
      [ac2, acU]
    ].forEach(function (pr) {
      var gg = pr[1].getContext('2d');
      gg.imageSmoothingQuality = 'high';
      gg.drawImage(pr[0], 0, 0, S, S);
    });
    var crd = cr.getContext('2d').getImageData(0, 0, S, S).data,
      fU = fcU.getContext('2d').getImageData(0, 0, S, S).data,
      aU = acU.getContext('2d').getImageData(0, 0, S, S).data,
      od = og.createImageData(S, S),
      N2 = S * S;
    for (i = 0; i < N2; i++) {
      var al = aU[i * 4] / 255,
        o4 = i * 4;
      if (al >= 0.985) {
        od.data[o4] = crd[o4];
        od.data[o4 + 1] = crd[o4 + 1];
        od.data[o4 + 2] = crd[o4 + 2];
      } else if (al <= 0.004) {
        od.data[o4] = 255;
        od.data[o4 + 1] = 255;
        od.data[o4 + 2] = 255;
      } else {
        od.data[o4] = fU[o4] * al + 255 * (1 - al);
        od.data[o4 + 1] = fU[o4 + 1] * al + 255 * (1 - al);
        od.data[o4 + 2] = fU[o4 + 2] * al + 255 * (1 - al);
      }
      od.data[o4 + 3] = 255;
    }
    og.putImageData(od, 0, 0);
    return { canvas: out, pieces: [], model: true };
  }

  /* a borda da foto é uma folha lisa (false) ou outra coisa, como estante e balcão (true)? Conta rápida em miniatura, sem rodar o recorte */
  /* o fundo da foto já é branco liso? (borda toda quase branca e uniforme) */
  function whiteBg(full) {
    var sc = Math.min(1, 120 / Math.max(full.width, full.height)),
      w = Math.max(8, Math.round(full.width * sc)),
      h = Math.max(8, Math.round(full.height * sc)),
      c = mkCanvas(w, h),
      g = c.getContext('2d');
    g.drawImage(full, 0, 0, w, h);
    var d = g.getImageData(0, 0, w, h).data,
      ring = Math.max(2, Math.round(Math.min(w, h) * 0.03)),
      n = 0,
      ok = 0,
      x,
      y,
      i;
    for (y = 0; y < h; y++)
      for (x = 0; x < w; x++)
        if (x < ring || y < ring || x >= w - ring || y >= h - ring) {
          i = (y * w + x) * 4;
          n++;
          var mn = Math.min(d[i], d[i + 1], d[i + 2]),
            mx = Math.max(d[i], d[i + 1], d[i + 2]);
          if (mn >= 236 && mx - mn <= 14) ok++;
        }
    return n > 0 && ok / n >= 0.94;
  }
  /* fundo branco: só corta ao redor da peça e centra num quadrado branco, sem tirar fundo */
  function lightWhite(full) {
    var sc = Math.min(1, 300 / Math.max(full.width, full.height)),
      w = Math.max(8, Math.round(full.width * sc)),
      h = Math.max(8, Math.round(full.height * sc)),
      c = mkCanvas(w, h),
      g = c.getContext('2d');
    g.drawImage(full, 0, 0, w, h);
    var d = g.getImageData(0, 0, w, h).data,
      rows = new Int32Array(h),
      cols = new Int32Array(w),
      x,
      y,
      i;
    for (y = 0; y < h; y++)
      for (x = 0; x < w; x++) {
        i = (y * w + x) * 4;
        if (
          Math.min(d[i], d[i + 1], d[i + 2]) < 226 ||
          Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]) > 28
        ) {
          rows[y]++;
          cols[x]++;
        }
      }
    var y0 = 0,
      y1 = h - 1,
      x0 = 0,
      x1 = w - 1;
    while (y0 < h && rows[y0] < 2) y0++;
    while (y1 > 0 && rows[y1] < 2) y1--;
    while (x0 < w && cols[x0] < 2) x0++;
    while (x1 > 0 && cols[x1] < 2) x1--;
    if (y1 <= y0 || x1 <= x0) throw new Error('vazio');
    var bw = (x1 - x0 + 1) / w,
      bh = (y1 - y0 + 1) / h;
    if (bw * bh < 0.02) throw new Error('pequeno');
    var mg = 0.04,
      cx0 = Math.max(0, (x0 / w - mg * bw) * full.width),
      cy0 = Math.max(0, (y0 / h - mg * bh) * full.height),
      cx1 = Math.min(full.width, ((x1 + 1) / w + mg * bw) * full.width),
      cy1 = Math.min(full.height, ((y1 + 1) / h + mg * bh) * full.height),
      cw = cx1 - cx0,
      ch = cy1 - cy0,
      S2 = 2000,
      k = Math.min((S2 * 0.9) / cw, (S2 * 0.9) / ch, 1.6),
      dw = cw * k,
      dh = ch * k,
      out = mkCanvas(S2, S2),
      og = out.getContext('2d');
    og.fillStyle = '#fff';
    og.fillRect(0, 0, S2, S2);
    og.imageSmoothingQuality = 'high';
    og.drawImage(full, cx0, cy0, cw, ch, (S2 - dw) / 2, (S2 - dh) / 2, dw, dh);
    return { canvas: out, pieces: [], bbox: [x0 / w, y0 / h, (x1 + 1) / w, (y1 + 1) / h] };
  }
  // Detecta fundo de superfície/prateleira.
  function shelfLike(full) {
    var sc = Math.min(1, 120 / Math.max(full.width, full.height)),
      w = Math.max(8, Math.round(full.width * sc)),
      h = Math.max(8, Math.round(full.height * sc)),
      c = mkCanvas(w, h),
      g = c.getContext('2d');
    g.drawImage(full, 0, 0, w, h);
    var d = g.getImageData(0, 0, w, h).data,
      ring = Math.max(2, Math.round(Math.min(w, h) * 0.03)),
      R = [],
      G = [],
      B = [],
      P = [],
      x,
      y,
      i;
    for (y = 0; y < h; y++)
      for (x = 0; x < w; x++)
        if (x < ring || y < ring || x >= w - ring || y >= h - ring) {
          i = (y * w + x) * 4;
          R.push(d[i]);
          G.push(d[i + 1]);
          B.push(d[i + 2]);
          P.push(i);
        }
    var md = function (a) {
        a = a.slice().sort(function (p, q) {
          return p - q;
        });
        return a[a.length >> 1];
      },
      r0 = md(R),
      g0 = md(G),
      b0 = md(B),
      n = 0;
    P.forEach(function (i) {
      var a = d[i] - r0,
        b = d[i + 1] - g0,
        e = d[i + 2] - b0;
      if (Math.sqrt(a * a + b * b + e * e) + 2 * Math.max(0, Math.abs(a - e) - 16) < 38) n++;
    });
    return n / P.length < 0.8;
  }
  /* Plano B que NUNCA corta a armação: só corrige a iluminação do fundo (vira branco) e centraliza. Não recorta nada. */
  function flatWhite(full) {
    var W = full.width,
      H = full.height,
      k = Math.min(1, 2000 / Math.max(W, H)),
      w = Math.round(W * k),
      h = Math.round(H * k),
      c = mkCanvas(w, h),
      g = c.getContext('2d');
    g.drawImage(full, 0, 0, w, h);
    var lw = Math.max(40, Math.round((220 * w) / Math.max(w, h))),
      lh = Math.max(40, Math.round((220 * h) / Math.max(w, h))),
      sm = mkCanvas(lw, lh),
      sg = sm.getContext('2d');
    sg.drawImage(c, 0, 0, lw, lh);
    var d = sg.getImageData(0, 0, lw, lh).data,
      n = lw * lh,
      R = Math.round(Math.min(lw, lh) * 0.16),
      ch,
      i,
      x,
      y,
      j,
      mx = new Float32Array(n),
      t = new Float32Array(n),
      bg = new Uint8ClampedArray(n * 4);
    for (ch = 0; ch < 3; ch++) {
      for (y = 0; y < lh; y++)
        for (x = 0; x < lw; x++) {
          var m = 0,
            a = Math.max(0, x - R),
            b = Math.min(lw - 1, x + R);
          for (j = a; j <= b; j++) {
            var v = d[(y * lw + j) * 4 + ch];
            if (v > m) m = v;
          }
          t[y * lw + x] = m;
        }
      for (x = 0; x < lw; x++)
        for (y = 0; y < lh; y++) {
          var m2 = 0,
            a2 = Math.max(0, y - R),
            b2 = Math.min(lh - 1, y + R);
          for (j = a2; j <= b2; j++) {
            var v2 = t[j * lw + x];
            if (v2 > m2) m2 = v2;
          }
          mx[y * lw + x] = m2;
        }
      for (i = 0; i < n; i++) bg[i * 4 + ch] = mx[i];
    }
    for (i = 0; i < n; i++) bg[i * 4 + 3] = 255;
    var bc = mkCanvas(lw, lh);
    bc.getContext('2d').putImageData(new ImageData(bg, lw, lh), 0, 0);
    var bb = mkCanvas(w, h),
      bgx = bb.getContext('2d');
    bgx.filter = 'blur(' + Math.max(2, Math.round(w / 25)) + 'px)';
    bgx.drawImage(bc, 0, 0, w, h);
    var sd = g.getImageData(0, 0, w, h),
      bd = bgx.getImageData(0, 0, w, h).data,
      p = sd.data,
      N = w * h;
    for (i = 0; i < N; i++) {
      var o = i * 4,
        r = p[o],
        gg = p[o + 1],
        bl = p[o + 2],
        g1 = Math.min(1.9, Math.max(1, 250 / Math.max(60, bd[o]))),
        g2 = Math.min(1.9, Math.max(1, 250 / Math.max(60, bd[o + 1]))),
        g3 = Math.min(1.9, Math.max(1, 250 / Math.max(60, bd[o + 2])));
      r = Math.min(255, r * g1);
      gg = Math.min(255, gg * g2);
      bl = Math.min(255, bl * g3);
      if (r > 238 && gg > 238 && bl > 238) {
        r = gg = bl = 255;
      }
      p[o] = r;
      p[o + 1] = gg;
      p[o + 2] = bl;
    }
    g.putImageData(sd, 0, 0);
    return lightWhite(c);
  }
  // Fluxo principal do fundo branco: escolhe o método e recusa quando não é seguro.
  function whiten(full) {
    var W = full.width,
      H = full.height,
      sc = Math.min(1, 440 / Math.max(W, H)),
      sw = Math.max(8, Math.round(W * sc)),
      sh = Math.max(8, Math.round(H * sc));
    var sm = mkCanvas(sw, sh),
      sg = sm.getContext('2d');
    sg.imageSmoothingQuality = 'high';
    sg.drawImage(full, 0, 0, sw, sh);
    var d = sg.getImageData(0, 0, sw, sh).data,
      N = sw * sh,
      i,
      x,
      y;
    // cor do fundo: mediana da moldura
    var ring = Math.max(3, Math.round(Math.min(sw, sh) * 0.03)),
      R = [],
      G = [],
      B = [];
    for (y = 0; y < sh; y++)
      for (x = 0; x < sw; x++) {
        if (x < ring || y < ring || x >= sw - ring || y >= sh - ring) {
          i = (y * sw + x) * 4;
          R.push(d[i]);
          G.push(d[i + 1]);
          B.push(d[i + 2]);
        }
      }
    var med = function (a) {
        a.sort(function (p, q) {
          return p - q;
        });
        return a[a.length >> 1];
      },
      br = med(R),
      bg = med(G),
      bb = med(B);
    var dist = function (p) {
      var a = d[p * 4] - br,
        b = d[p * 4 + 1] - bg,
        c = d[p * 4 + 2] - bb;
      return Math.sqrt(a * a + b * b + c * c) + 2 * Math.max(0, Math.abs(a - c) - 16);
    };
    var T = 38,
      isBg = new Uint8Array(N),
      q = new Int32Array(N),
      qh = 0,
      qt = 0;
    var shadow = function (p) {
      var r = d[p * 4],
        g = d[p * 4 + 1],
        b = d[p * 4 + 2],
        kr = r / Math.max(1, br),
        kg = g / Math.max(1, bg),
        kb = b / Math.max(1, bb),
        k = (kr + kg + kb) / 3;
      return k > 0.6 && Math.max(Math.abs(kr - k), Math.abs(kg - k), Math.abs(kb - k)) < 0.035;
    };
    var step = function (p, n) {
      return Math.max(
        Math.abs(d[p * 4] - d[n * 4]),
        Math.abs(d[p * 4 + 1] - d[n * 4 + 1]),
        Math.abs(d[p * 4 + 2] - d[n * 4 + 2])
      );
    };
    var seed = function (p) {
      if (!isBg[p] && dist(p) < T) {
        isBg[p] = 1;
        q[qt++] = p;
      }
    };
    var grow = function (p, n) {
      if (!isBg[n] && (dist(n) < T || (shadow(n) && step(p, n) < 9))) {
        isBg[n] = 1;
        q[qt++] = n;
      }
    };
    // modo estante: quando a borda da foto não é o fundo (vitrine, chão, reflexos), o fundo é a cor dominante da estante
    var hull = null;
    (function () {
      var nb = 0,
        tot = 0;
      for (y = 0; y < sh; y++)
        for (x = 0; x < sw; x++) {
          if (x < ring || y < ring || x >= sw - ring || y >= sh - ring) {
            tot++;
            if (dist(y * sw + x) < T) nb++;
          }
        }
      window.__bf = nb / tot;
      if (nb / tot >= 0.8) return;
      var h = {},
        bk = -1,
        bc = 0,
        x0 = Math.round(sw * 0.08),
        x1 = Math.round(sw * 0.92),
        y0 = Math.round(sh * 0.08),
        y1 = Math.round(sh * 0.92),
        p,
        k;
      for (y = y0; y < y1; y++)
        for (x = x0; x < x1; x++) {
          p = y * sw + x;
          k = (d[p * 4] >> 4) * 256 + (d[p * 4 + 1] >> 4) * 16 + (d[p * 4 + 2] >> 4);
          h[k] = (h[k] || 0) + 1;
          if (h[k] > bc) {
            bc = h[k];
            bk = k;
          }
        }
      var sr = 0,
        sg2 = 0,
        sb = 0,
        sn = 0;
      for (y = y0; y < y1; y++)
        for (x = x0; x < x1; x++) {
          p = y * sw + x;
          k = (d[p * 4] >> 4) * 256 + (d[p * 4 + 1] >> 4) * 16 + (d[p * 4 + 2] >> 4);
          if (k === bk) {
            sr += d[p * 4];
            sg2 += d[p * 4 + 1];
            sb += d[p * 4 + 2];
            sn++;
          }
        }
      if (!sn || (sr + sg2 + sb) / sn / 3 < 135) return;
      var ob = [br, bg, bb];
      br = Math.round(sr / sn);
      bg = Math.round(sg2 / sn);
      bb = Math.round(sb / sn);
      var st = new Uint8Array(N),
        lab = new Uint8Array(N),
        comps2 = [],
        maxC = 0,
        j;
      for (j = 0; j < N; j++) st[j] = dist(j) < T ? 1 : 0;
      for (j = 0; j < N; j++) {
        if (!st[j] || lab[j]) continue;
        var cm = [j];
        lab[j] = 1;
        for (var q = 0; q < cm.length; q++) {
          var c = cm[q],
            cx = c % sw,
            cy = (c / sw) | 0;
          if (cx > 0 && st[c - 1] && !lab[c - 1]) {
            lab[c - 1] = 1;
            cm.push(c - 1);
          }
          if (cx < sw - 1 && st[c + 1] && !lab[c + 1]) {
            lab[c + 1] = 1;
            cm.push(c + 1);
          }
          if (cy > 0 && st[c - sw] && !lab[c - sw]) {
            lab[c - sw] = 1;
            cm.push(c - sw);
          }
          if (cy < sh - 1 && st[c + sw] && !lab[c + sw]) {
            lab[c + sw] = 1;
            cm.push(c + sw);
          }
        }
        comps2.push(cm);
        if (cm.length > maxC) maxC = cm.length;
      }
      if (maxC < N * 0.12) {
        br = ob[0];
        bg = ob[1];
        bb = ob[2];
        return;
      }
      var mn = new Int32Array(sh).fill(sw),
        mx2 = new Int32Array(sh).fill(-1);
      comps2.forEach(function (cm) {
        if (cm.length < maxC * 0.1) return;
        cm.forEach(function (c) {
          var cy = (c / sw) | 0,
            cx = c % sw;
          if (cx < mn[cy]) mn[cy] = cx;
          if (cx > mx2[cy]) mx2[cy] = cx;
        });
      });
      (function () {
        var ws = [];
        for (var r0 = 0; r0 < sh; r0++) if (mx2[r0] >= mn[r0]) ws.push(mx2[r0] - mn[r0]);
        ws.sort(function (p, q) {
          return p - q;
        });
        var mw = ws.length ? ws[ws.length >> 1] : 0,
          okr = function (r0) {
            return mx2[r0] >= mn[r0] && mx2[r0] - mn[r0] >= mw * 0.6;
          };
        var gm = Math.round(sh * 0.1),
          last = -1;
        for (var yy = 0; yy < sh; yy++) {
          if (okr(yy)) last = yy;
          else if (last >= 0 && yy - last <= gm) {
            mn[yy] = mn[last];
            mx2[yy] = mx2[last];
          }
        }
        last = -1;
        for (var y3 = sh - 1; y3 >= 0; y3--) {
          if (okr(y3)) last = y3;
          else if (last >= 0 && last - y3 <= gm && !okr(y3)) {
            mn[y3] = mn[last];
            mx2[y3] = mx2[last];
          }
        }
      })();
      hull = new Uint8Array(N);
      var ep = Math.max(3, Math.round(sw * 0.014));
      for (y = 0; y < sh; y++) for (x = mn[y] + ep; x <= mx2[y] - ep; x++) hull[y * sw + x] = 1;
    })();
    {
      if (hull) T = window.__T || 26;
      if (hull) {
        for (i = 0; i < N; i++) {
          if (!hull[i]) {
            isBg[i] = 1;
            q[qt++] = i;
          } else seed(i);
        }
      } else {
        for (x = 0; x < sw; x++) {
          seed(x);
          seed((sh - 1) * sw + x);
        }
        for (y = 0; y < sh; y++) {
          seed(y * sw);
          seed(y * sw + sw - 1);
        }
      }
      while (qh < qt) {
        var p = q[qh++],
          px = p % sw,
          py = (p / sw) | 0;
        if (px > 0) grow(p, p - 1);
        if (px < sw - 1) grow(p, p + 1);
        if (py > 0) grow(p, p - sw);
        if (py < sh - 1) grow(p, p + sw);
      }
    }
    // áreas internas parecidas com o fundo (lentes transparentes)
    for (i = 0; i < N; i++) if (!isBg[i] && dist(i) < 32) isBg[i] = 1;
    // mantém só os pedaços grandes do produto (some texto, etiquetas e pontinhos)
    var fg = new Uint8Array(N),
      seen = new Uint8Array(N),
      comps = [],
      bx0 = sw,
      by0 = sh,
      bx1 = 0,
      by1 = 0;
    for (i = 0; i < N; i++) fg[i] = isBg[i] ? 0 : 1;
    // remove linhas escuras finas e longas e retas (emendas da mesa) que cruzam a foto
    var seamM = new Uint8Array(N),
      seamHit = false;
    [4, 6].forEach(function (R) {
      var dk = new Uint8Array(N);
      if (R === 6 && seamHit) {
        for (var y2 = 0; y2 < sh; y2++) {
          var x2 = 0;
          while (x2 < sw) {
            var i2 = y2 * sw + x2,
              r2 = d[i2 * 4],
              g2 = d[i2 * 4 + 1],
              b2 = d[i2 * 4 + 2];
            if (
              fg[i2] &&
              Math.max(r2, g2, b2) < 100 &&
              Math.max(r2, g2, b2) - Math.min(r2, g2, b2) < 22
            ) {
              var e2 = x2;
              while (e2 < sw) {
                var q2 = y2 * sw + e2,
                  rr = d[q2 * 4],
                  gg = d[q2 * 4 + 1],
                  bb = d[q2 * 4 + 2];
                if (
                  !(
                    fg[q2] &&
                    Math.max(rr, gg, bb) < 100 &&
                    Math.max(rr, gg, bb) - Math.min(rr, gg, bb) < 22
                  )
                )
                  break;
                e2++;
              }
              if (e2 - x2 < 14)
                for (var z = x2 - 2; z < e2 + 2; z++)
                  if (z >= 0 && z < sw) {
                    fg[y2 * sw + z] = 0;
                  }
              x2 = e2;
            } else x2++;
          }
        }
      }
      for (var j = 0; j < N; j++) {
        var r = d[j * 4],
          g = d[j * 4 + 1],
          b = d[j * 4 + 2],
          mx = Math.max(r, g, b);
        if (fg[j] && mx < 150 && mx - Math.min(r, g, b) < 34) dk[j] = 1;
      }
      function mm(src, isMax) {
        var t = new Uint8Array(N),
          o = new Uint8Array(N),
          x,
          y,
          k,
          v;
        for (y = 0; y < sh; y++)
          for (x = 0; x < sw; x++) {
            v = isMax ? 0 : 1;
            for (k = -R; k <= R; k++) {
              var X = x + k;
              if (X < 0 || X >= sw) {
                if (!isMax) v = 0;
                continue;
              }
              var q = src[y * sw + X];
              if (isMax) {
                if (q) {
                  v = 1;
                  break;
                }
              } else if (!q) {
                v = 0;
                break;
              }
            }
            t[y * sw + x] = v;
          }
        for (y = 0; y < sh; y++)
          for (x = 0; x < sw; x++) {
            v = isMax ? 0 : 1;
            for (k = -R; k <= R; k++) {
              var Y = y + k;
              if (Y < 0 || Y >= sh) {
                if (!isMax) v = 0;
                continue;
              }
              var q2 = t[Y * sw + x];
              if (isMax) {
                if (q2) {
                  v = 1;
                  break;
                }
              } else if (!q2) {
                v = 0;
                break;
              }
            }
            o[y * sw + x] = v;
          }
        return o;
      }
      var op = mm(mm(dk, false), true),
        thin = new Uint8Array(N),
        sn = new Uint8Array(N),
        L = [];
      for (var j = 0; j < N; j++) thin[j] = dk[j] && !op[j] ? 1 : 0;
      for (var j = 0; j < N; j++) {
        if (!thin[j] || sn[j]) continue;
        var cm = [j],
          x0 = sw,
          x1 = 0,
          y0 = sh,
          y1 = 0;
        sn[j] = 1;
        for (var k = 0; k < cm.length; k++) {
          var c = cm[k],
            cx = c % sw,
            cy = (c / sw) | 0;
          if (cx < x0) x0 = cx;
          if (cx > x1) x1 = cx;
          if (cy < y0) y0 = cy;
          if (cy > y1) y1 = cy;
          for (var yy = -1; yy <= 1; yy++)
            for (var xx = -1; xx <= 1; xx++) {
              var X = cx + xx,
                Y = cy + yy;
              if (X < 0 || Y < 0 || X >= sw || Y >= sh) continue;
              var n = Y * sw + X;
              if (thin[n] && !sn[n]) {
                sn[n] = 1;
                cm.push(n);
              }
            }
        }
        var w = x1 - x0 + 1,
          h = y1 - y0 + 1,
          len = Math.max(w, h);
        if (h > 0.1 * Math.max(sw, sh) && h > w * 4) {
          L.push(cm);
          seamHit = true;
        }
      }
      L.forEach(function (cm) {
        cm.forEach(function (c) {
          var cx = c % sw,
            cy = (c / sw) | 0;
          for (var yy = -2; yy <= 2; yy++)
            for (var xx = -2; xx <= 2; xx++) {
              var X = cx + xx,
                Y = cy + yy;
              if (X < 0 || Y < 0 || X >= sw || Y >= sh) continue;
              var n = Y * sw + X,
                r = d[n * 4],
                g = d[n * 4 + 1],
                b = d[n * 4 + 2];
              if (Math.max(r, g, b) - Math.min(r, g, b) < 34) {
                fg[n] = 0;
                seamM[n] = 1;
              }
            }
        });
      });
    });
    for (i = 0; i < N; i++) {
      if (!fg[i] || seen[i]) continue;
      var comp = [i];
      seen[i] = 1;
      for (var k = 0; k < comp.length; k++) {
        var c = comp[k],
          cx = c % sw,
          cy = (c / sw) | 0,
          nb = [];
        if (cx > 0) nb.push(c - 1);
        if (cx < sw - 1) nb.push(c + 1);
        if (cy > 0) nb.push(c - sw);
        if (cy < sh - 1) nb.push(c + sw);
        for (var m = 0; m < nb.length; m++) {
          if (fg[nb[m]] && !seen[nb[m]]) {
            seen[nb[m]] = 1;
            comp.push(nb[m]);
          }
        }
      }
      comps.push(comp);
    }
    var maxA = 0;
    comps.forEach(function (c) {
      if (c.length > maxA) maxA = c.length;
    });
    if (hull) {
      var bigC = null;
      comps.forEach(function (c) {
        if (c.length === maxA) bigC = c;
      });
      var cbb = function (c) {
          var a = sw,
            b = sh,
            e = 0,
            f = 0;
          for (var t = 0; t < c.length; t++) {
            var X = c[t] % sw,
              Y = (c[t] / sw) | 0;
            if (X < a) a = X;
            if (X > e) e = X;
            if (Y < b) b = Y;
            if (Y > f) f = Y;
          }
          return [a, b, e, f];
        },
        bg0 = cbb(bigC);
      comps = comps.filter(function (c) {
        if (c === bigC || c.length < maxA * 0.15) return true;
        var touch = false;
        for (var t = 0; t < c.length && !touch; t++) {
          var X = c[t] % sw,
            Y = (c[t] / sw) | 0;
          [
            [3, 0],
            [-3, 0],
            [0, 3],
            [0, -3]
          ].forEach(function (o) {
            var X2 = X + o[0],
              Y2 = Y + o[1];
            if (X2 < 0 || Y2 < 0 || X2 >= sw || Y2 >= sh || !hull[Y2 * sw + X2]) touch = true;
          });
        }
        var b2 = cbb(c),
          far =
            (b2[0] > bg0[2] + sw * 0.18 ||
              b2[2] < bg0[0] - sw * 0.18 ||
              b2[1] > bg0[3] + sh * 0.18 ||
              b2[3] < bg0[1] - sh * 0.18) &&
            c.length < maxA * 0.4;
        if (touch || far) {
          for (var t = 0; t < c.length; t++) fg[c[t]] = 0;
          return false;
        }
        return true;
      });
    }
    comps.forEach(function (c) {
      if (c.length < maxA * 0.15) {
        for (var t = 0; t < c.length; t++) fg[c[t]] = 0;
      }
    });
    for (i = 0; i < N; i++)
      if (fg[i]) {
        x = i % sw;
        y = (i / sw) | 0;
        if (x < bx0) bx0 = x;
        if (x > bx1) bx1 = x;
        if (y < by0) by0 = y;
        if (y > by1) by1 = y;
      }
    if (bx1 <= bx0 || by1 <= by0) {
      bx0 = 0;
      by0 = 0;
      bx1 = sw - 1;
      by1 = sh - 1;
      for (i = 0; i < N; i++) fg[i] = 1;
    }
    var bxs = [];
    comps.forEach(function (c) {
      if (c.length < maxA * 0.15) return;
      var a = sw,
        b = sh,
        e = 0,
        f = 0;
      for (var t = 0; t < c.length; t++) {
        var X = c[t] % sw,
          Y = (c[t] / sw) | 0;
        if (X < a) a = X;
        if (X > e) e = X;
        if (Y < b) b = Y;
        if (Y > f) f = Y;
      }
      bxs.push([a, b, e, f]);
    });
    (function () {
      var gap = Math.max(sw, sh) * 0.04,
        mg = true;
      while (mg) {
        mg = false;
        for (var u = 0; u < bxs.length && !mg; u++)
          for (var v = u + 1; v < bxs.length && !mg; v++) {
            var A = bxs[u],
              C = bxs[v];
            if (
              A[0] - gap <= C[2] &&
              C[0] - gap <= A[2] &&
              A[1] - gap <= C[3] &&
              C[1] - gap <= A[3]
            ) {
              bxs[u] = [
                Math.min(A[0], C[0]),
                Math.min(A[1], C[1]),
                Math.max(A[2], C[2]),
                Math.max(A[3], C[3])
              ];
              bxs.splice(v, 1);
              mg = true;
            }
          }
      }
    })();
    var pieces = bxs
      .filter(function (b) {
        return (b[2] - b[0]) * (b[3] - b[1]) > sw * sh * 0.01;
      })
      .map(function (b) {
        return [b[0] / sw, b[1] / sh, (b[2] + 1) / sw, (b[3] + 1) / sh];
      })
      .sort(function (p, q) {
        return (p[1] + p[3]) / 2 - (q[1] + q[3]) / 2 || p[0] - q[0];
      });
    /* modo estante: a borda clara/translúcida da armação some no fundo claro; reforça pelas linhas de contraste ligadas ao que já foi achado */
    if (hull) {
      var Lm = new Float32Array(N),
        Gm = new Float32Array(N),
        E = new Uint8Array(N),
        qx,
        qy;
      for (i = 0; i < N; i++)
        Lm[i] = d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114;
      for (qy = 1; qy < sh - 1; qy++)
        for (qx = 1; qx < sw - 1; qx++) {
          var ii = qy * sw + qx,
            gx =
              Lm[ii - sw + 1] +
              2 * Lm[ii + 1] +
              Lm[ii + sw + 1] -
              (Lm[ii - sw - 1] + 2 * Lm[ii - 1] + Lm[ii + sw - 1]),
            gy =
              Lm[ii + sw - 1] +
              2 * Lm[ii + sw] +
              Lm[ii + sw + 1] -
              (Lm[ii - sw - 1] + 2 * Lm[ii - sw] + Lm[ii - sw + 1]);
          if (hull[ii] && Math.sqrt(gx * gx + gy * gy) > EDGE_T) E[ii] = 1;
        }
      for (var it = 0; it < 6; it++) {
        var add2 = [];
        for (qy = 1; qy < sh - 1; qy++)
          for (qx = 1; qx < sw - 1; qx++) {
            var jj = qy * sw + qx;
            if (
              E[jj] &&
              !fg[jj] &&
              (fg[jj - 1] ||
                fg[jj + 1] ||
                fg[jj - sw] ||
                fg[jj + sw] ||
                fg[jj - sw - 1] ||
                fg[jj + sw + 1] ||
                fg[jj - sw + 1] ||
                fg[jj + sw - 1])
            )
              add2.push(jj);
          }
        if (!add2.length) break;
        add2.forEach(function (j3) {
          fg[j3] = 1;
        });
      }
    }
    // expande 2px para não comer a borda e suaviza
    var fg2 = new Uint8Array(N);
    for (y = 0; y < sh; y++)
      for (x = 0; x < sw; x++) {
        var on = 0;
        for (var yy = -2; yy <= 2 && !on; yy++)
          for (var xx = -2; xx <= 2; xx++) {
            var X = x + xx,
              Y = y + yy;
            if (X >= 0 && Y >= 0 && X < sw && Y < sh && fg[Y * sw + X]) {
              on = 1;
              break;
            }
          }
        fg2[y * sw + x] = on;
      }
    /* modo estante: só mantém o que está dentro do contorno da armação (com buracos das lentes preenchidos); o resto vira branco puro */
    var insD = null;
    if (hull) {
      var rc = Math.max(3, Math.round(sw * 0.011)),
        fgC = new Uint8Array(N),
        tc = new Uint8Array(N);
      for (y = 0; y < sh; y++) {
        var l1 = -9999;
        for (x = 0; x < sw; x++) {
          if (fg2[y * sw + x]) l1 = x;
          if (x - l1 <= rc) tc[y * sw + x] = 1;
        }
        l1 = 9999;
        for (x = sw - 1; x >= 0; x--) {
          if (fg2[y * sw + x]) l1 = x;
          if (l1 - x <= rc) tc[y * sw + x] = 1;
        }
      }
      for (x = 0; x < sw; x++) {
        var l2 = -9999;
        for (y = 0; y < sh; y++) {
          if (tc[y * sw + x]) l2 = y;
          if (y - l2 <= rc) fgC[y * sw + x] = 1;
        }
        l2 = 9999;
        for (y = sh - 1; y >= 0; y--) {
          if (tc[y * sw + x]) l2 = y;
          if (l2 - y <= rc) fgC[y * sw + x] = 1;
        }
      }
      var rn = Math.max(5, Math.round(sw * 0.04)),
        nearM = new Uint8Array(N);
      tc = new Uint8Array(N);
      for (y = 0; y < sh; y++) {
        var l3 = -9999;
        for (x = 0; x < sw; x++) {
          if (fg2[y * sw + x]) l3 = x;
          if (x - l3 <= rn) tc[y * sw + x] = 1;
        }
        l3 = 9999;
        for (x = sw - 1; x >= 0; x--) {
          if (fg2[y * sw + x]) l3 = x;
          if (l3 - x <= rn) tc[y * sw + x] = 1;
        }
      }
      for (x = 0; x < sw; x++) {
        var l4 = -9999;
        for (y = 0; y < sh; y++) {
          if (tc[y * sw + x]) l4 = y;
          if (y - l4 <= rn) nearM[y * sw + x] = 1;
        }
        l4 = 9999;
        for (y = sh - 1; y >= 0; y--) {
          if (tc[y * sw + x]) l4 = y;
          if (l4 - y <= rn) nearM[y * sw + x] = 1;
        }
      }
      var ob = new Uint8Array(N),
        qq = new Int32Array(N),
        qh = 0,
        qt2 = 0,
        k2;
      for (x = 0; x < sw; x++) {
        k2 = x;
        if (!fgC[k2] && !ob[k2]) {
          ob[k2] = 1;
          qq[qt2++] = k2;
        }
        k2 = (sh - 1) * sw + x;
        if (!fgC[k2] && !ob[k2]) {
          ob[k2] = 1;
          qq[qt2++] = k2;
        }
      }
      for (y = 0; y < sh; y++) {
        k2 = y * sw;
        if (!fgC[k2] && !ob[k2]) {
          ob[k2] = 1;
          qq[qt2++] = k2;
        }
        k2 = y * sw + sw - 1;
        if (!fgC[k2] && !ob[k2]) {
          ob[k2] = 1;
          qq[qt2++] = k2;
        }
      }
      while (qh < qt2) {
        var c0 = qq[qh++],
          cx0 = c0 % sw,
          cy0 = (c0 / sw) | 0;
        [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1]
        ].forEach(function (o) {
          var X = cx0 + o[0],
            Y = cy0 + o[1];
          if (X < 0 || Y < 0 || X >= sw || Y >= sh) return;
          var n2 = Y * sw + X;
          if (!fgC[n2] && !ob[n2]) {
            ob[n2] = 1;
            qq[qt2++] = n2;
          }
        });
      }
      var obD = new Uint8Array(N),
        tcc = new Uint8Array(N),
        rcD = rc + 1;
      for (y = 0; y < sh; y++) {
        var l9 = -9999;
        for (x = 0; x < sw; x++) {
          if (ob[y * sw + x]) l9 = x;
          if (x - l9 <= rcD) tcc[y * sw + x] = 1;
        }
        l9 = 9999;
        for (x = sw - 1; x >= 0; x--) {
          if (ob[y * sw + x]) l9 = x;
          if (l9 - x <= rcD) tcc[y * sw + x] = 1;
        }
      }
      for (x = 0; x < sw; x++) {
        var l8 = -9999;
        for (y = 0; y < sh; y++) {
          if (tcc[y * sw + x]) l8 = y;
          if (y - l8 <= rcD) obD[y * sw + x] = 1;
        }
        l8 = 9999;
        for (y = sh - 1; y >= 0; y--) {
          if (tcc[y * sw + x]) l8 = y;
          if (l8 - y <= rcD) obD[y * sw + x] = 1;
        }
      }
      var rr = Math.max(2, Math.round(sw * (window.__RR || 0.006))),
        t1 = new Uint8Array(N);
      insD = new Uint8Array(N);
      for (y = 0; y < sh; y++) {
        var last = -9999;
        for (x = 0; x < sw; x++) {
          if (!ob[y * sw + x]) last = x;
          if (x - last <= rr) t1[y * sw + x] = 1;
        }
        last = 9999;
        for (x = sw - 1; x >= 0; x--) {
          if (!ob[y * sw + x]) last = x;
          if (last - x <= rr) t1[y * sw + x] = 1;
        }
      }
      for (x = 0; x < sw; x++) {
        var lastY = -9999;
        for (y = 0; y < sh; y++) {
          if (t1[y * sw + x]) lastY = y;
          if (y - lastY <= rr) insD[y * sw + x] = 1;
        }
        lastY = 9999;
        for (y = sh - 1; y >= 0; y--) {
          if (t1[y * sw + x]) lastY = y;
          if (lastY - y <= rr) insD[y * sw + x] = 1;
        }
      }
    }
    var hullIn = null;
    if (hull) {
      hullIn = new Uint8Array(N);
      var he = Math.max(4, Math.round(sw * 0.03)),
        hc0 = new Int32Array(sw).fill(-1),
        hc1 = new Int32Array(sw).fill(-1),
        yy5,
        xx5;
      for (yy5 = 0; yy5 < sh; yy5++)
        for (xx5 = 0; xx5 < sw; xx5++)
          if (hull[yy5 * sw + xx5]) {
            if (hc0[xx5] < 0) hc0[xx5] = yy5;
            hc1[xx5] = yy5;
          }
      for (yy5 = 0; yy5 < sh; yy5++) {
        var r0 = -1,
          r1 = -1;
        for (xx5 = 0; xx5 < sw; xx5++)
          if (hull[yy5 * sw + xx5]) {
            if (r0 < 0) r0 = xx5;
            r1 = xx5;
          }
        for (xx5 = 0; xx5 < sw; xx5++)
          if (
            hull[yy5 * sw + xx5] &&
            xx5 - r0 >= he &&
            r1 - xx5 >= he &&
            yy5 - hc0[xx5] >= he &&
            hc1[xx5] - yy5 >= he
          )
            hullIn[yy5 * sw + xx5] = 1;
      }
    }
    window.__SL = null;
    if (hull) {
      (function () {
        var n = 0,
          sx = 0,
          sy = 0,
          sxx = 0,
          sxy = 0;
        for (i = 0; i < N; i++)
          if (seamM[i]) {
            x = i % sw;
            y = (i / sw) | 0;
            n++;
            sx += x;
            sy += y;
            sxy += x * y;
            sxx += y * y;
          }
        if (n < 40) return;
        var den = n * sxx - sy * sy;
        if (Math.abs(den) < 1) return;
        var A = (n * sxy - sx * sy) / den,
          B2 = (sx - A * sy) / n;
        var ws = [];
        for (y = 0; y < sh; y++) {
          var cnt = 0;
          for (x = 0; x < sw; x++) if (seamM[y * sw + x]) cnt++;
          if (cnt >= 4) ws.push(cnt);
        }
        ws.sort(function (p2, q2) {
          return p2 - q2;
        });
        var hw = Math.max(4, Math.min(9, Math.ceil((ws.length ? ws[ws.length >> 1] : 10) / 2) + 2)),
          bgL = (br + bg + bb) / 3;
        window.__SL = [A, B2, hw];
        /* o poste da estante é neutro (cinza/preto) e mais escuro que o fundo; a armação tem cor, então fica de fora */
        for (y = 0; y < sh; y++) {
          var cx = Math.round(A * y + B2);
          for (x = cx - hw; x <= cx + hw; x++) {
            if (x < 0 || x >= sw) continue;
            var j2 = y * sw + x,
              r = d[j2 * 4],
              g = d[j2 * 4 + 1],
              b = d[j2 * 4 + 2],
              mx = Math.max(r, g, b),
              mn = Math.min(r, g, b),
              Lw = (r + g + b) / 3;
            if (hull[j2] && mx - mn < (window.__NC || 9) && Lw < bgL * (window.__ND || 0.86))
              seamM[j2] = 1;
          }
        }
        var cp = seamM.slice();
        for (y = 0; y < sh; y++)
          for (x = 0; x < sw; x++)
            if (cp[y * sw + x])
              for (var hx2 = -(window.__HD || 2); hx2 <= (window.__HD || 2); hx2++) {
                var xx3 = x + hx2;
                if (
                  xx3 >= 0 &&
                  xx3 < sw &&
                  hull[y * sw + xx3] &&
                  Math.abs(xx3 - Math.round(A * y + B2)) <= hw + 3
                )
                  seamM[y * sw + xx3] = 1;
              }
      })();
    }
    /* acima da ponte (nariz) o poste escuro da estante (neutro) não é armação: tira da máscara até aparecer a cor da armação */
    if (hull && insD) {
      var yTop = -1,
        yEnd = -1,
        mxs = 0;
      for (y = 0; y < sh && yTop < 0; y++)
        for (x = 0; x < sw; x++)
          if (seamM[y * sw + x] && (fg2[y * sw + x] || fg[y * sw + x])) {
            yTop = y;
            break;
          }
      if (yTop > 0) {
        for (y = yTop; y < sh && yEnd < 0; y++) {
          var cn = 0,
            sr = 0;
          for (x = 0; x < sw; x++)
            if (seamM[y * sw + x]) {
              var q9 = (y * sw + x) * 4;
              sr += d[q9] - d[q9 + 2];
              cn++;
            }
          if (cn >= 3 && sr / cn >= (window.__WB || 6)) yEnd = y;
        }
        window.__YB = [yTop, yEnd, sh];
        if (yEnd > yTop && yEnd - yTop < sh * 0.12) {
          for (y = 0; y < yEnd; y++) {
            if (y < 0) continue;
            for (x = 0; x < sw; x++) {
              var nb = 0;
              for (var dx5 = -2; dx5 <= 2; dx5++) {
                var X5 = x + dx5;
                if (X5 >= 0 && X5 < sw && seamM[y * sw + X5]) {
                  nb = 1;
                  break;
                }
              }
              if (nb) {
                var j8 = y * sw + x;
                fg[j8] = 0;
                fg2[j8] = 0;
                insD[j8] = 0;
              }
            }
          }
        }
      }
    }
    if (hull && window.__SL && typeof yEnd === 'number' && yEnd > 0) {
      var SL = window.__SL;
      for (y = yEnd; y < Math.min(sh, yEnd + Math.round(sh * (window.__BH || 0))); y++) {
        var cxb = Math.round(SL[0] * y + SL[1]);
        for (x = cxb - SL[2]; x <= cxb + SL[2]; x++) {
          if (x >= 0 && x < sw && hull[y * sw + x] && fg2[y * sw + x]) seamM[y * sw + x] = 1;
        }
      }
    }
    var kc = mkCanvas(sw, sh),
      kg = kc.getContext('2d'),
      kd = kg.createImageData(sw, sh);
    for (i = 0; i < N; i++) {
      kd.data[i * 4] = fg[i] ? 255 : 0;
      kd.data[i * 4 + 1] = !fg2[i] && insD && insD[i] && hullIn[i] && !obD[i] ? 255 : 0;
      kd.data[i * 4 + 3] = 255;
    }
    kg.putImageData(kd, 0, 0);
    var shm = mkCanvas(sw, sh),
      shg = shm.getContext('2d'),
      shd = shg.createImageData(sw, sh);
    for (i = 0; i < N; i++) {
      shd.data[i * 4 + 3] = fg2[i] ? 255 : insD && insD[i] && hullIn[i] && !obD[i] ? 40 : 0;
    }
    shg.putImageData(shd, 0, 0);
    var mk2 = mkCanvas(sw, sh),
      mg = mk2.getContext('2d'),
      md = mg.createImageData(sw, sh);
    for (i = 0; i < N; i++) {
      md.data[i * 4] = 255;
      md.data[i * 4 + 1] = 255;
      md.data[i * 4 + 2] = 255;
      var sa = 0;
      x = i % sw;
      y = (i / sw) | 0;
      if (window.__NEWM) {
        if (insD && insD[i] && hullIn[i] && !obD[i]) sa = 255;
      } else if (
        hull &&
        hull[i] &&
        x >= bx0 - sw * 0.05 &&
        x <= bx1 + sw * 0.05 &&
        y >= by0 - sh * 0.05 &&
        y <= by1 + sh * 0.05
      )
        sa = 255;
      md.data[i * 4 + 3] = Math.max(fg2[i] ? 255 : 0, sa);
    }
    mg.putImageData(md, 0, 0);
    // máscara no tamanho original, com borda suave
    var big = mkCanvas(W, H),
      bgc = big.getContext('2d');
    bgc.imageSmoothingQuality = 'high';
    bgc.filter = 'blur(' + Math.max(1, Math.round(1.2 / sc)) + 'px)';
    bgc.drawImage(mk2, 0, 0, W, H);
    bgc.filter = 'none';
    var devA = null,
      ma = bgc.getImageData(0, 0, W, H).data,
      fd = full.getContext('2d').getImageData(0, 0, W, H),
      o = fd.data;
    if (hull) {
      // modo estante: em vez de recortar, apaga a emenda e "achata" o fundo para branco (a armação fica inteira)

      if (window.__DBG)
        window.__m = {
          sw: sw,
          sh: sh,
          hull: hull && Array.from(hull),
          fg: Array.from(fg),
          fg2: Array.from(fg2),
          ins: insD && Array.from(insD),
          seam: Array.from(seamM),
          near: insD && Array.from(nearM)
        };
      var sc3 = mkCanvas(sw, sh),
        sg3 = sc3.getContext('2d'),
        sd = sg3.createImageData(sw, sh),
        m3 = 0;
      for (i = 0; i < N; i++) {
        var ok = hull[i] && dist(i) < 24 && !seamM[i] ? 1 : 0;
        sd.data[i * 4] = d[i * 4];
        sd.data[i * 4 + 1] = d[i * 4 + 1];
        sd.data[i * 4 + 2] = d[i * 4 + 2];
        sd.data[i * 4 + 3] = ok ? 255 : 0;
        m3 += ok;
      }
      sg3.putImageData(sd, 0, 0);
      var mp1 = mkCanvas(sw, sh),
        mp2 = mkCanvas(sw, sh);
      mp1.getContext('2d').filter = 'blur(10px)';
      mp1.getContext('2d').drawImage(sc3, 0, 0);
      mp2.getContext('2d').filter = 'blur(36px)';
      mp2.getContext('2d').drawImage(sc3, 0, 0);
      var d1 = mp1.getContext('2d').getImageData(0, 0, sw, sh).data,
        d2 = mp2.getContext('2d').getImageData(0, 0, sw, sh).data,
        mm2 = mkCanvas(sw, sh),
        mmg = mm2.getContext('2d'),
        mmd = mmg.createImageData(sw, sh);
      for (i = 0; i < N; i++) {
        var q = i * 4,
          u = d1[q + 3] >= 40 ? d1 : d2[q + 3] >= 10 ? d2 : null;
        mmd.data[q] = u ? u[q] : br;
        mmd.data[q + 1] = u ? u[q + 1] : bg;
        mmd.data[q + 2] = u ? u[q + 2] : bb;
        mmd.data[q + 3] = 255;
      }
      mmg.putImageData(mmd, 0, 0);
      var mbig = mkCanvas(W, H),
        mbg = mbig.getContext('2d');
      mbg.imageSmoothingQuality = 'high';
      mbg.drawImage(mm2, 0, 0, W, H);
      var mp = mbg.getImageData(0, 0, W, H).data;
      // emenda: preenche a faixa linha por linha com os vizinhos
      var sm3 = mkCanvas(sw, sh),
        smg = sm3.getContext('2d'),
        smd = smg.createImageData(sw, sh);
      for (i = 0; i < N; i++) {
        var on3 = 0;
        x = i % sw;
        y = (i / sw) | 0;
        if (seamM[i]) on3 = 1;
        smd.data[i * 4 + 3] = on3 ? 255 : 0;
      }
      smg.putImageData(smd, 0, 0);
      var sb = mkCanvas(W, H),
        sbg = sb.getContext('2d');
      sbg.imageSmoothingQuality = 'high';
      sbg.filter = 'blur(' + Math.max(1, Math.round(0.8 / sc)) + 'px)';
      sbg.drawImage(sm3, 0, 0, W, H);
      var sa3 = sbg.getImageData(0, 0, W, H).data;
      /* emenda da estante: preenche a faixa com uma superfície suave calculada a partir dos vizinhos (esquerda, direita, cima e baixo) */
      (function () {
        var f = 4,
          mx0 = W,
          mx1 = -1,
          my0 = H,
          my1 = -1,
          xx,
          yy;
        for (yy = 0; yy < H; yy++)
          for (xx = 0; xx < W; xx++)
            if (sa3[(yy * W + xx) * 4 + 3] > 70) {
              if (xx < mx0) mx0 = xx;
              if (xx > mx1) mx1 = xx;
              if (yy < my0) my0 = yy;
              if (yy > my1) my1 = yy;
            }
        if (mx1 < 0) return;
        var padp = Math.round((14 * W) / 1600) + 8;
        mx0 = Math.max(0, mx0 - padp);
        mx1 = Math.min(W - 1, mx1 + padp);
        my0 = Math.max(0, my0 - 2);
        my1 = Math.min(H - 1, my1 + 2);
        var gw = Math.ceil((mx1 - mx0 + 1) / f),
          gh = Math.ceil((my1 - my0 + 1) / f),
          G = new Float32Array(gw * gh * 3),
          K = new Uint8Array(gw * gh),
          cnt = new Uint16Array(gw * gh),
          gx,
          gy,
          c5;
        for (yy = my0; yy <= my1; yy++) {
          gy = ((yy - my0) / f) | 0;
          for (xx = mx0; xx <= mx1; xx++) {
            gx = ((xx - mx0) / f) | 0;
            var gi = gy * gw + gx;
            if (sa3[(yy * W + xx) * 4 + 3] > 40) {
              K[gi] = 1;
              continue;
            }
          }
        }
        /* células "conhecidas" = sem nenhum pixel da emenda; guarda a média de cor */
        for (yy = my0; yy <= my1; yy++) {
          gy = ((yy - my0) / f) | 0;
          for (xx = mx0; xx <= mx1; xx++) {
            gx = ((xx - mx0) / f) | 0;
            var gj = gy * gw + gx;
            if (!K[gj]) {
              var q5 = (yy * W + xx) * 4;
              G[gj * 3] += o[q5];
              G[gj * 3 + 1] += o[q5 + 1];
              G[gj * 3 + 2] += o[q5 + 2];
              cnt[gj]++;
            }
          }
        }
        for (gy = 0; gy < gh; gy++)
          for (gx = 0; gx < gw; gx++) {
            var gk = gy * gw + gx;
            if (!K[gk] && cnt[gk]) {
              G[gk * 3] /= cnt[gk];
              G[gk * 3 + 1] /= cnt[gk];
              G[gk * 3 + 2] /= cnt[gk];
            } else if (!K[gk]) K[gk] = 1;
          }
        /* inicializa as células desconhecidas por interpolação horizontal na linha */
        for (gy = 0; gy < gh; gy++) {
          var l5 = -1;
          for (gx = 0; gx <= gw; gx++) {
            if (gx === gw || !K[gy * gw + gx]) {
              if (gx < gw && l5 === -2) continue;
            }
          }
          gx = 0;
          while (gx < gw) {
            if (K[gy * gw + gx]) {
              var ge = gx;
              while (ge < gw && K[gy * gw + ge]) ge++;
              var L5 = gx > 0 ? gx - 1 : -1,
                R5 = ge < gw ? ge : -1;
              for (var zz = gx; zz < ge; zz++) {
                var tt2 = L5 < 0 ? 1 : R5 < 0 ? 0 : (zz - L5) / (R5 - L5);
                for (c5 = 0; c5 < 3; c5++) {
                  var lv =
                      L5 >= 0
                        ? G[(gy * gw + L5) * 3 + c5]
                        : R5 >= 0
                          ? G[(gy * gw + R5) * 3 + c5]
                          : 240,
                    rv = R5 >= 0 ? G[(gy * gw + R5) * 3 + c5] : lv;
                  G[(gy * gw + zz) * 3 + c5] = lv * (1 - tt2) + rv * tt2;
                }
              }
              gx = ge;
            } else gx++;
          }
        }
        var unk = [];
        for (gy = 0; gy < gh; gy++)
          for (gx = 0; gx < gw; gx++) if (K[gy * gw + gx]) unk.push(gy * gw + gx);
        for (var itr = 0; itr < 500; itr++) {
          for (var ui = 0; ui < unk.length; ui++) {
            var ug = unk[ui],
              uy = (ug / gw) | 0,
              ux = ug % gw,
              up = uy > 0 ? ug - gw : ug,
              dn = uy < gh - 1 ? ug + gw : ug,
              lf = ux > 0 ? ug - 1 : ug,
              rt = ux < gw - 1 ? ug + 1 : ug;
            for (c5 = 0; c5 < 3; c5++)
              G[ug * 3 + c5] =
                (G[up * 3 + c5] + G[dn * 3 + c5] + G[lf * 3 + c5] + G[rt * 3 + c5]) / 4;
          }
        }
        var D = mx1 - mx0 + 6,
          sgn = 1;
        function lumAt(x3, y3) {
          var q6 = (y3 * W + x3) * 4;
          return o[q6] * 0.299 + o[q6 + 1] * 0.587 + o[q6 + 2] * 0.114;
        }
        /* devolve o "grão" (alta frequência) de um ponto vizinho fora da emenda, para a faixa não ficar lisa demais */
        function texHP(x2, y2) {
          for (var t = 0; t < 2; t++) {
            var sx2 = x2 + (t ? -D : D);
            if (sx2 < 8 || sx2 >= W - 8 || y2 < 8 || y2 >= H - 8) continue;
            if (sa3[(y2 * W + sx2) * 4 + 3] > 40) continue;
            var c0 = lumAt(sx2, y2),
              m4 =
                (lumAt(sx2 - 5, y2) +
                  lumAt(sx2 + 5, y2) +
                  lumAt(sx2, y2 - 5) +
                  lumAt(sx2, y2 + 5)) /
                4,
              hp = c0 - m4;
            if (Math.abs(hp) < 9) return hp;
          }
          return 0;
        }
        for (yy = my0; yy <= my1; yy++)
          for (xx = mx0; xx <= mx1; xx++) {
            var al = sa3[(yy * W + xx) * 4 + 3];
            if (al <= 40) continue;
            var fx = (xx - mx0) / f - 0.5,
              fy = (yy - my0) / f - 0.5,
              x0 = Math.max(0, Math.min(gw - 1, Math.floor(fx))),
              y0 = Math.max(0, Math.min(gh - 1, Math.floor(fy))),
              x1 = Math.min(gw - 1, x0 + 1),
              y1 = Math.min(gh - 1, y0 + 1),
              ax = Math.max(0, Math.min(1, fx - x0)),
              ay = Math.max(0, Math.min(1, fy - y0)),
              qq = (yy * W + xx) * 4,
              w2 = Math.min(1, (al - 40) / 60),
              nz = texHP(xx, yy);
            for (c5 = 0; c5 < 3; c5++) {
              var v00 = G[(y0 * gw + x0) * 3 + c5],
                v10 = G[(y0 * gw + x1) * 3 + c5],
                v01 = G[(y1 * gw + x0) * 3 + c5],
                v11 = G[(y1 * gw + x1) * 3 + c5],
                vv = (v00 * (1 - ax) + v10 * ax) * (1 - ay) + (v01 * (1 - ax) + v11 * ax) * ay + nz;
              o[qq + c5] = o[qq + c5] * (1 - w2) + vv * w2;
            }
          }
      })();
      /* ponte do nariz: o poste da estante atravessa a armação; troca a faixa por uma mistura suave entre os dois lados (só nas linhas com armação dos dois lados) */
      (function () {
        var SL = window.__SL;
        window.__IP = [SL, typeof yEnd, yEnd, 0];
        window.__MS = 0;
        window.__YT = null;
        if (!SL || typeof yEnd !== 'number' || yEnd <= 0) return;
        var kx = W / sw,
          ky = H / sh;
        function av(yf, xf) {
          var r = 0,
            g = 0,
            b = 0,
            n = 0;
          for (var dx = -2; dx <= 2; dx++) {
            var X = xf + dx;
            if (X < 0 || X >= W) continue;
            var q = (yf * W + X) * 4;
            r += o[q];
            g += o[q + 1];
            b += o[q + 2];
            n++;
          }
          return [r / n, g / n, b / n];
        }
        for (var ys = yEnd; ys < sh; ys++) {
          var cxs = Math.round(SL[0] * ys + SL[1]),
            xl = cxs - SL[2] - 3,
            xr = cxs + SL[2] + 3;
          var okr = false;
          if (xl >= 0 && xr < sw && fg[ys * sw + xl] && fg[ys * sw + xr]) {
            var Ll =
                (d[(ys * sw + xl) * 4] + d[(ys * sw + xl) * 4 + 1] + d[(ys * sw + xl) * 4 + 2]) / 3,
              Lr =
                (d[(ys * sw + xr) * 4] + d[(ys * sw + xr) * 4 + 1] + d[(ys * sw + xr) * 4 + 2]) / 3,
              fc = 0,
              tot = 0;
            for (var xs2 = cxs - SL[2]; xs2 <= cxs + SL[2]; xs2++) {
              if (xs2 < 0 || xs2 >= sw) continue;
              tot++;
              if (fg[ys * sw + xs2]) fc++;
            }
            okr =
              Ll < ((br + bg + bb) / 3) * 0.7 &&
              Lr < ((br + bg + bb) / 3) * 0.7 &&
              tot > 0 &&
              fc / tot >= 0.3;
          }
          if (!okr) {
            window.__MS = (window.__MS || 0) + 1;
            if (window.__MS > 4 && window.__IP[3] > 6) break;
            if (ys > yEnd + Math.round(sh * 0.2)) break;
            continue;
          }
          window.__MS = 0;
          if (window.__IP[3] === 0) window.__YT = ys;
          window.__IP[3]++;
          var y0f = Math.round(ys * ky),
            y1f = Math.min(H, Math.round((ys + 1) * ky)),
            xlf = Math.round(xl * kx),
            xrf = Math.round(xr * kx);
          for (var yf = y0f; yf < y1f; yf++) {
            var Lc = av(yf, xlf),
              Rc = av(yf, xrf);
            for (var xf = xlf; xf <= xrf; xf++) {
              var t = (xf - xlf) / (xrf - xlf),
                q = (yf * W + xf) * 4,
                chr = Math.max(o[q], o[q + 1], o[q + 2]) - Math.min(o[q], o[q + 1], o[q + 2]),
                wI = Math.max(0, Math.min(1, 1 - (chr - (window.__CK || 16)) / 20));
              o[q] = o[q] * (1 - wI) + (Lc[0] * (1 - t) + Rc[0] * t) * wI;
              o[q + 1] = o[q + 1] * (1 - wI) + (Lc[1] * (1 - t) + Rc[1] * t) * wI;
              o[q + 2] = o[q + 2] * (1 - wI) + (Lc[2] * (1 - t) + Rc[2] * t) * wI;
            }
          }
        }
      })();
      var o0 = new Uint8ClampedArray(o);
      devA = new Uint8Array(W * H);
      for (i = 0; i < W * H; i++) {
        var q4 = i * 4,
          dvm = 0;
        for (var cc = 0; cc < 3; cc++) {
          var dd = (Math.abs(o[q4 + cc] - mp[q4 + cc]) * 255) / Math.max(40, mp[q4 + cc]);
          if (dd > dvm) dvm = dd;
        }
        devA[i] = dvm > 255 ? 255 : dvm;
        for (cc = 0; cc < 3; cc++) {
          var v = (o[q4 + cc] * 255) / Math.max(40, mp[q4 + cc]);
          var t3 = Math.max(0, Math.min(1, (v - 232) / 18));
          v = v * (1 - t3) + 255 * t3;
          o[q4 + cc] = Math.max(0, Math.min(255, Math.round(v)));
        }
      }
    }
    /* armação com a cor original: o que é "fundo" é cinza (mesma cor do fundo, só mais escuro); a armação tem tom marrom ou é bem mais escura */
    var fm = null;
    if (hull && typeof o0 !== 'undefined' && o0 && typeof mp !== 'undefined' && !window.__NOFM) {
      try {
        var kW = W / 1449;
        function matteOf(cdT, cdW, dkT, dkW, blr, thr) {
          var aA = mkCanvas(W, H),
            aG = aA.getContext('2d'),
            aD = aG.createImageData(W, H),
            ad = aD.data;
          for (var q = 0; q < W * H; q++) {
            var q4 = q * 4,
              Br = Math.max(40, mp[q4]),
              Bg2 = Math.max(40, mp[q4 + 1]),
              Bb = Math.max(40, mp[q4 + 2]),
              kr = o0[q4] / Br,
              kg2 = o0[q4 + 1] / Bg2,
              kb2 = o0[q4 + 2] / Bb,
              k = (kr + kg2 + kb2) / 3;
            if (k < 0.02) {
              ad[q4 + 3] = 255;
              continue;
            }
            var cd = Math.max(Math.abs(kr / k - 1), Math.abs(kg2 / k - 1), Math.abs(kb2 / k - 1)),
              a1 = Math.max(0, Math.min(1, (cd - cdT) / cdW)),
              a2 = Math.max(0, Math.min(1, (dkT - k) / dkW));
            ad[q4 + 3] = Math.round(255 * Math.max(a1, a2));
          }
          aG.putImageData(aD, 0, 0);
          var aB = mkCanvas(W, H),
            aBg = aB.getContext('2d');
          aBg.filter = 'blur(' + Math.max(2, Math.round(blr * kW)) + 'px)';
          aBg.drawImage(aA, 0, 0);
          var bd = aBg.getImageData(0, 0, W, H).data,
            out = new Uint8Array(W * H);
          for (q = 0; q < W * H; q++) {
            var tt = (bd[q * 4 + 3] / 255 - thr) / 0.3;
            out[q] = Math.round((tt < 0 ? 0 : tt > 1 ? 1 : tt) * 255);
          }
          return out;
        }
        var mS = matteOf(
            window.__CD0 || 0.05,
            window.__CDW || 0.05,
            window.__DK || 0.6,
            window.__DKW || 0.12,
            4,
            0.3
          ),
          mL = matteOf(
            window.__CL0 || 0.03,
            window.__CLW || 0.04,
            window.__DK || 0.6,
            window.__DKW || 0.12,
            4,
            0.3
          );
        var gc = mkCanvas(W, H),
          gg = gc.getContext('2d'),
          gd = gg.createImageData(W, H);
        for (var q = 0; q < W * H; q++) gd.data[q * 4 + 3] = mS[q];
        gg.putImageData(gd, 0, 0);
        var gb = mkCanvas(W, H),
          gbg = gb.getContext('2d');
        gbg.filter = 'blur(' + Math.max(3, Math.round((window.__GR2 || 22) * kW)) + 'px)';
        gbg.drawImage(gc, 0, 0);
        var gv = gbg.getImageData(0, 0, W, H).data;
        var nzc = mkCanvas(sw, sh),
          nzg = nzc.getContext('2d'),
          nzd = nzg.createImageData(sw, sh);
        for (i = 0; i < N; i++) nzd.data[i * 4 + 3] = nearM[i] ? 255 : 0;
        nzg.putImageData(nzd, 0, 0);
        var nzb = mkCanvas(W, H),
          nzbg = nzb.getContext('2d');
        nzbg.filter = 'blur(' + Math.max(2, Math.round(3 * kW)) + 'px)';
        nzbg.drawImage(nzc, 0, 0, W, H);
        var nzv = nzbg.getImageData(0, 0, W, H).data;
        fm = new Uint8Array(W * H);
        for (q = 0; q < W * H; q++) {
          var gate = (gv[q * 4 + 3] / 255 - 0.06) / 0.1;
          gate = gate < 0 ? 0 : gate > 1 ? 1 : gate;
          var m = Math.max(mS[q], mL[q] * gate);
          var bl = o0[q * 4 + 2] - o0[q * 4];
          var bw = bl <= 2 ? 1 : bl >= 10 ? 0 : 1 - (bl - 2) / 8;
          fm[q] = Math.round(m * bw * (nzv[q * 4 + 3] / 255));
        }
      } catch (e) {
        fm = null;
        window.__FME = String(e);
      }
    }
    var zb = null;
    if (hull && window.__SL && typeof yEnd === 'number' && yEnd > 0) {
      var yZ = window.__YT || yEnd;
      var zc = mkCanvas(sw, sh),
        zg = zc.getContext('2d'),
        zd = zg.createImageData(sw, sh),
        SL2 = window.__SL;
      for (y = 0; y < yZ; y++) {
        var cz = Math.round(SL2[0] * y + SL2[1]);
        for (x = Math.max(0, cz - SL2[2]); x <= Math.min(sw - 1, cz + SL2[2]); x++) {
          var j6 = y * sw + x;
          if (fg[j6] && d[j6 * 4] - d[j6 * 4 + 2] >= 14) continue;
          zd.data[j6 * 4 + 3] = 255;
        }
      }
      zg.putImageData(zd, 0, 0);
      var zb2 = mkCanvas(W, H),
        zbg = zb2.getContext('2d');
      zbg.filter = 'blur(' + Math.max(1, Math.round(1.5 / sc)) + 'px)';
      zbg.drawImage(zc, 0, 0, W, H);
      zb = zbg.getImageData(0, 0, W, H).data;
    }
    /* fundo: troca a textura granulada da estante por uma versão suave (só nas áreas fora da armação e das lentes) */
    var smB = null,
      owB = null,
      prB = null,
      bgLm0 = (br + bg + bb) / 3;
    if (hull && insD && !window.__NOSM) {
      try {
        var oc = mkCanvas(sw, sh),
          ocg = oc.getContext('2d'),
          ocd = ocg.createImageData(sw, sh);
        for (i = 0; i < N; i++) ocd.data[i * 4 + 3] = !insD[i] && !fg2[i] ? 255 : 0;
        ocg.putImageData(ocd, 0, 0);
        var ow = mkCanvas(W, H),
          owg = ow.getContext('2d');
        owg.filter = 'blur(' + Math.max(2, Math.round((window.__OB || 3) / sc)) + 'px)';
        owg.drawImage(oc, 0, 0, W, H);
        owg.filter = 'none';
        owB = owg.getImageData(0, 0, W, H).data;
        var t1c = mkCanvas(W, H),
          t1g = t1c.getContext('2d'),
          t1d = t1g.createImageData(W, H),
          t1a = t1d.data;
        for (var q3 = 0; q3 < W * H; q3++) {
          t1a[q3 * 4] = o[q3 * 4];
          t1a[q3 * 4 + 1] = o[q3 * 4 + 1];
          t1a[q3 * 4 + 2] = o[q3 * 4 + 2];
          t1a[q3 * 4 + 3] = owB[q3 * 4 + 3] > 200 ? 255 : 0;
        }
        t1g.putImageData(t1d, 0, 0);
        var t2c = mkCanvas(W, H),
          t2g = t2c.getContext('2d');
        t2g.filter = 'blur(' + Math.max(2, Math.round((window.__SMB || 10) / sc)) + 'px)';
        t2g.drawImage(t1c, 0, 0);
        smB = t2g.getImageData(0, 0, W, H).data;
        window.__SMOK = 1;
        var pq = mkCanvas(sw, sh),
          pqg = pq.getContext('2d'),
          pqd = pqg.createImageData(sw, sh);
        for (i = 0; i < N; i++)
          pqd.data[i * 4 + 3] =
            fg[i] && (d[i * 4] + d[i * 4 + 1] + d[i * 4 + 2]) / 3 < bgLm0 * 0.8 ? 255 : 0;
        pqg.putImageData(pqd, 0, 0);
        var pc = mkCanvas(W, H),
          pcg = pc.getContext('2d');
        pcg.filter = 'blur(' + Math.max(3, Math.round((window.__PX || 13) / sc)) + 'px)';
        pcg.drawImage(pq, 0, 0, W, H);
        prB = pcg.getImageData(0, 0, W, H).data;
      } catch (e) {
        window.__SMOK = String(e);
        smB = null;
      }
    }
    var kbig = mkCanvas(W, H),
      kbg = kbig.getContext('2d');
    kbg.imageSmoothingQuality = 'high';
    kbg.drawImage(kc, 0, 0, W, H);
    var kb = kbg.getImageData(0, 0, W, H).data;
    for (i = 0; i < W * H; i++) {
      var a = ma[i * 4 + 3];
      if (zb && zb[i * 4 + 3] > 100) a = 0;
      if (a < 8) {
        o[i * 4] = o[i * 4 + 1] = o[i * 4 + 2] = 255;
        o[i * 4 + 3] = 0;
        continue;
      }
      /* borda: só fica opaca onde a cor realmente difere do fundo (some o "brilho branco" em volta e deixa a sombra aparecer) */
      if (smB && owB[i * 4 + 3] > 0 && smB[i * 4 + 3] > 60) {
        var wo = owB[i * 4 + 3] / 255;
        if (window.__SMDBG === 2) {
          o[i * 4] = smB[i * 4];
          o[i * 4 + 1] = smB[i * 4 + 1];
          o[i * 4 + 2] = smB[i * 4 + 2];
          o[i * 4 + 3] = 255;
          continue;
        }
        if (window.__SMDBG) {
          o[i * 4] = 255;
          o[i * 4 + 1] = 0;
          o[i * 4 + 2] = 0;
          o[i * 4 + 3] = 255;
          continue;
        }
        o[i * 4] = o[i * 4] * (1 - wo) + smB[i * 4] * wo;
        o[i * 4 + 1] = o[i * 4 + 1] * (1 - wo) + smB[i * 4 + 1] * wo;
        o[i * 4 + 2] = o[i * 4 + 2] * (1 - wo) + smB[i * 4 + 2] * wo;
        var Lw2 = (o[i * 4] + o[i * 4 + 1] + o[i * 4 + 2]) / 3,
          tw = Math.max(0, Math.min(1, (Lw2 - (window.__PW || 236)) / 14)) * wo;
        if (tw > 0) {
          o[i * 4] = o[i * 4] * (1 - tw) + 255 * tw;
          o[i * 4 + 1] = o[i * 4 + 1] * (1 - tw) + 255 * tw;
          o[i * 4 + 2] = o[i * 4 + 2] * (1 - tw) + 255 * tw;
        }
        if (prB) {
          var pr = Math.max(0, Math.min(1, (prB[i * 4 + 3] / 255 - 0.03) / 0.25)),
            kf = 1 - wo * (1 - pr);
          o[i * 4] = 255 - (255 - o[i * 4]) * kf;
          o[i * 4 + 1] = 255 - (255 - o[i * 4 + 1]) * kf;
          o[i * 4 + 2] = 255 - (255 - o[i * 4 + 2]) * kf;
        }
      }
      if (window.__FMDBG && fm) {
        var fv = fm[i];
        o[i * 4] = fv;
        o[i * 4 + 1] = fv;
        o[i * 4 + 2] = fv;
        o[i * 4 + 3] = 255;
        continue;
      }
      if (fm && fm[i] > 0) {
        var fa = fm[i] / 255;
        o[i * 4] = o[i * 4] * (1 - fa) + o0[i * 4] * fa;
        o[i * 4 + 1] = o[i * 4 + 1] * (1 - fa) + o0[i * 4 + 1] * fa;
        o[i * 4 + 2] = o[i * 4 + 2] * (1 - fa) + o0[i * 4 + 2] * fa;
      }
      var dvv = devA
          ? devA[i]
          : Math.max(
              Math.abs(o[i * 4] - br),
              Math.abs(o[i * 4 + 1] - bg),
              Math.abs(o[i * 4 + 2] - bb)
            ),
        fr = 255,
        A = Math.max(kb[i * 4], kb[i * 4 + 1], Math.min(a, fr));
      if (A < 8) {
        o[i * 4] = o[i * 4 + 1] = o[i * 4 + 2] = 255;
        o[i * 4 + 3] = 0;
      } else o[i * 4 + 3] = A;
    }
    var out = mkCanvas(W, H);
    out.getContext('2d').putImageData(fd, 0, 0);
    // recorta no produto e centraliza num quadrado branco
    var pad = 0.1,
      cx0 = Math.max(0, (bx0 / sw - pad) * W),
      cy0 = Math.max(0, (by0 / sh - pad) * H),
      cx1 = Math.min(W, ((bx1 + 1) / sw + pad) * W),
      cy1 = Math.min(H, ((by1 + 1) / sh + pad) * H),
      cw = cx1 - cx0,
      ch = cy1 - cy0,
      S2 = 2000,
      sc2 = Math.min((S2 * 0.88) / cw, (S2 * 0.88) / ch, 2),
      dw = cw * sc2,
      dh = ch * sc2;
    var sq = mkCanvas(S2, S2),
      qg = sq.getContext('2d');
    qg.fillStyle = '#fff';
    qg.fillRect(0, 0, S2, S2);
    qg.imageSmoothingQuality = 'high';
    /* sombra suave desenhada por baixo da armação (substitui a sombra suja da foto original) */
    (function () {
      if (!window.__SYN) return;
      try {
        [
          [0.022, 0.016, 0.3],
          [0.006, 0.004, 0.22]
        ].forEach(function (L) {
          var tc = mkCanvas(S2, S2),
            tg = tc.getContext('2d');
          tg.filter = 'blur(' + Math.max(1, Math.round(dw * L[0])) + 'px)';
          tg.drawImage(
            shm,
            (cx0 * sw) / W,
            (cy0 * sh) / H,
            (cw * sw) / W,
            (ch * sh) / H,
            (S2 - dw) / 2,
            (S2 - dh) / 2 + dw * L[1],
            dw,
            dh
          );
          tg.filter = 'none';
          tg.globalCompositeOperation = 'source-in';
          tg.fillStyle = '#2b2b2b';
          tg.fillRect(0, 0, S2, S2);
          qg.globalAlpha = L[2];
          qg.drawImage(tc, 0, 0);
          qg.globalAlpha = 1;
        });
      } catch (e) {
        qg.globalAlpha = 1;
      }
    })();
    qg.drawImage(out, cx0, cy0, cw, ch, (S2 - dw) / 2, (S2 - dh) / 2, dw, dh);
    (function () {
      try {
        var A = qg.getImageData(0, 0, S2, S2),
          a = A.data;
        function blurred(px) {
          var bl = mkCanvas(S2, S2),
            g2 = bl.getContext('2d');
          g2.filter = 'blur(' + px + 'px)';
          g2.drawImage(sq, 0, 0);
          return g2.getImageData(0, 0, S2, S2).data;
        }
        var B1 = blurred(1.2),
          B2 = blurred(7);
        /* nitidez fina (detalhes e texto) + clareza leve (contraste local); o fundo branco não muda */
        /* estante: reflexos e sombras claras e planas ficam com grão da superfície; suaviza só onde é claro e sem detalhe (borda, texto e armação ficam intactos) */
        if (hull && !window.__NOGR) {
          var B3 = blurred(window.__GR || 5),
            GLv = window.__GL || 200,
            GEv = window.__GE || 22,
            GAv = window.__GA === undefined ? 0.95 : window.__GA;
          for (var u2 = 0; u2 < a.length; u2 += 4) {
            var L0 = (a[u2] + a[u2 + 1] + a[u2 + 2]) / 3,
              LB = (B3[u2] + B3[u2 + 1] + B3[u2 + 2]) / 3,
              wl = Math.max(0, Math.min(1, (L0 - GLv) / 25)),
              dv = Math.abs(L0 - LB),
              we = Math.max(0, Math.min(1, 1 - (dv - GEv) / 16)),
              wm = wl * we * GAv;
            if (wm > 0) {
              a[u2] = a[u2] * (1 - wm) + B3[u2] * wm;
              a[u2 + 1] = a[u2 + 1] * (1 - wm) + B3[u2 + 1] * wm;
              a[u2 + 2] = a[u2 + 2] * (1 - wm) + B3[u2 + 2] * wm;
            }
          }
        }
        for (var u = 0; u < a.length; u += 4) {
          for (var c3 = 0; c3 < 3; c3++) {
            var o = a[u + c3],
              v = o + 0.75 * (o - B1[u + c3]) + 0.22 * (o - B2[u + c3]);
            a[u + c3] = v < 0 ? 0 : v > 255 ? 255 : v;
          }
        }
        qg.putImageData(A, 0, 0);
      } catch (e) {}
    })();
    return {
      canvas: sq,
      pieces: pieces,
      bbox: [bx0 / sw, by0 / sh, (bx1 + 1) / sw, (by1 + 1) / sh],
      bg: [br, bg, bb],
      hex:
        '#' +
        [br, bg, bb]
          .map(function (v) {
            return ('0' + v.toString(16)).slice(-2);
          })
          .join('')
    };
  }

  // Canvas → JPEG.
  function toBlob(c, q) {
    return new Promise(function (res) {
      c.toBlob(res, 'image/jpeg', q || 0.9);
    });
  }
  // Cor típica da peça (ignora o fundo claro).
  function skin(c, fallback) {
    var g = c.getContext('2d'),
      d = g.getImageData(0, 0, c.width, c.height).data,
      R = [],
      G = [],
      B = [];
    for (var i = 0; i < d.length; i += 16) {
      if (d[i] > 238 && d[i + 1] > 238 && d[i + 2] > 238) continue;
      R.push(d[i]);
      G.push(d[i + 1]);
      B.push(d[i + 2]);
    }
    if (R.length < 30) return fallback;
    var m = function (a) {
      a.sort(function (x, y) {
        return x - y;
      });
      return a[a.length >> 1];
    };
    return [m(R), m(G), m(B)];
  }
  // leitura do código da etiqueta/haste
