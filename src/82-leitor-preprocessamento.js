  // ===== Leitor de haste: pré-processamento da imagem para o OCR. =====
  // Variante pré-processada da imagem para o OCR.
  function prepVar(src, k, mw, mxs) {
    var W = src.width,
      H = src.height,
      sc = Math.max(0.4, Math.min(mxs || 2, (mw || 1300) / Math.max(W, H * 0.75))),
      c = mkCanvas(W * sc, H * sc),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(src, 0, 0, c.width, c.height);
    var d = g.getImageData(0, 0, c.width, c.height),
      a = d.data,
      n = c.width * c.height,
      hist = new Uint32Array(256),
      i,
      v;
    for (i = 0; i < n; i++) {
      v = (a[i * 4] * 0.299 + a[i * 4 + 1] * 0.587 + a[i * 4 + 2] * 0.114) | 0;
      a[i * 4] = v;
      hist[v]++;
    }
    var lo = 0,
      hi = 255,
      acc = 0,
      cut = n * 0.01;
    for (i = 0; i < 256; i++) {
      acc += hist[i];
      if (acc > cut) {
        lo = i;
        break;
      }
    }
    acc = 0;
    for (i = 255; i >= 0; i--) {
      acc += hist[i];
      if (acc > cut) {
        hi = i;
        break;
      }
    }
    var kk = 255 / Math.max(20, hi - lo),
      gr = new Uint8Array(n);
    for (i = 0; i < n; i++) gr[i] = Math.max(0, Math.min(255, ((a[i * 4] - lo) * kk) | 0));
    var out = new Uint8Array(n),
      w = c.width,
      h = c.height;
    if (k === 4 || k === 5) {
      var ij = new Float64Array((w + 1) * (h + 1)),
        x2,
        y2,
        r2 = Math.max(9, Math.round(Math.min(w, h) * 0.03));
      for (y2 = 0; y2 < h; y2++) {
        var rs2 = 0;
        for (x2 = 0; x2 < w; x2++) {
          rs2 += gr[y2 * w + x2];
          ij[(y2 + 1) * (w + 1) + x2 + 1] = ij[y2 * (w + 1) + x2 + 1] + rs2;
        }
      }
      for (y2 = 0; y2 < h; y2++) {
        var ya = Math.max(0, y2 - r2),
          yb = Math.min(h, y2 + r2 + 1);
        for (x2 = 0; x2 < w; x2++) {
          var xa = Math.max(0, x2 - r2),
            xb = Math.min(w, x2 + r2 + 1),
            sm2 =
              ij[yb * (w + 1) + xb] -
              ij[ya * (w + 1) + xb] -
              ij[yb * (w + 1) + xa] +
              ij[ya * (w + 1) + xa],
            mn2 = sm2 / ((yb - ya) * (xb - xa)),
            df = gr[y2 * w + x2] - mn2;
          out[y2 * w + x2] = (k === 4 ? df > 9 : df < -9) ? 0 : 255;
        }
      }
    } else if (k === 1) {
      var ii = new Float64Array((w + 1) * (h + 1)),
        x,
        y,
        rr = Math.max(8, Math.round(h * 0.25));
      for (y = 0; y < h; y++) {
        var rs = 0;
        for (x = 0; x < w; x++) {
          rs += gr[y * w + x];
          ii[(y + 1) * (w + 1) + x + 1] = ii[y * (w + 1) + x + 1] + rs;
        }
      }
      for (y = 0; y < h; y++) {
        var y0 = Math.max(0, y - rr),
          y1 = Math.min(h, y + rr + 1);
        for (x = 0; x < w; x++) {
          var x0 = Math.max(0, x - rr),
            x1 = Math.min(w, x + rr + 1),
            sm =
              ii[y1 * (w + 1) + x1] -
              ii[y0 * (w + 1) + x1] -
              ii[y1 * (w + 1) + x0] +
              ii[y0 * (w + 1) + x0],
            mn = sm / ((y1 - y0) * (x1 - x0));
          out[y * w + x] = gr[y * w + x] > mn + 24 ? 0 : 255;
        }
      }
    } else if (k === 6) {
      for (i = 0; i < n; i++) out[i] = gr[i];
    } else if (k === 0) {
      for (i = 0; i < n; i++) out[i] = gr[i] > 128 ? 255 : 0;
    } else if (k === 3) {
      for (i = 0; i < n; i++) out[i] = gr[i] > 128 ? 0 : 255;
    } else {
      for (i = 0; i < n; i++) out[i] = 255 - gr[i];
    }
    for (i = 0; i < n; i++) {
      a[i * 4] = a[i * 4 + 1] = a[i * 4 + 2] = out[i];
      a[i * 4 + 3] = 255;
    }
    g.putImageData(d, 0, 0);
    return c;
  }
  /* 2ª etapa do leitor: acha o código na imagem e relê só a linha dele, ampliada (melhora muito as medidas) */
  function tsvWords(t) {
    var o = [];
    String(t || '')
      .split('\n')
      .forEach(function (l) {
        var c = l.split('\t');
        if (c[0] === '5' && c.length >= 12)
          o.push({ x: +c[6], y: +c[7], w: +c[8], h: +c[9], cf: +c[10], t: c.slice(11).join('\t') });
      });
    return o;
  }
  // Refina a leitura de uma linha.
  function refineLine(w, an, tight) {
    var sc = an.src.width / an.pv.width,
      wd = an.wd,
      h = wd.h * sc,
      x0 = Math.max(0, wd.x * sc - h * (tight ? 0.4 : 2)),
      x1 = Math.min(
        an.src.width,
        (wd.x + wd.w) * sc +
          (tight ? Math.max(h * 14, wd.w * sc * 3.2) : Math.max(h * 20, wd.w * sc * 4.5))
      ),
      y0 = Math.max(0, wd.y * sc - h * (tight ? 0.7 : 1.5)),
      y1 = Math.min(an.src.height, (wd.y + wd.h) * sc + h * (tight ? 0.7 : 1.5)),
      cw = Math.max(8, Math.round(x1 - x0)),
      ch = Math.max(8, Math.round(y1 - y0)),
      k = Math.min(4, Math.max(1, 75 / h)),
      c = mkCanvas(cw, ch),
      vs = tight
        ? [
            [4, 0],
            [5, 0],
            [0, 0],
            [1, 0]
          ]
        : [
            [6, 0],
            [2, 0],
            [6, -7],
            [6, 7],
            [6, -12],
            [6, 12]
          ],
      res = [],
      j = 0;
    c.getContext('2d').drawImage(an.src, x0, y0, cw, ch, 0, 0, cw, ch);
    window.__refCrop = c;
    return w.setParameters({ tessedit_pageseg_mode: '7' }).then(function () {
      function nx() {
        if (j >= vs.length) return res;
        var vj = vs[j++],
          pv = prepVar(vj[1] ? rotateCanvas(c, vj[1]) : c, vj[0], cw * k, 4);
        if (!window.__lastPrep) window.__lastPrep = [];
        if (window.__lastPrep.length < 5) window.__lastPrep.push(pv);
        return w.recognize(pv).then(function (r) {
          res.push(r.data.text || '');
          return nx();
        });
      }
      return nx();
    });
  }
  /* 3ª etapa: haste inclinada/sem contraste — tira linhas compridas, acha o ângulo do texto e relê as faixas mais "escritas" */
  function inkOf(c) {
    var d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data,
      n = c.width * c.height,
      o = new Uint8Array(n),
      i;
    for (i = 0; i < n; i++) o[i] = d[i * 4] < 128 ? 1 : 0;
    return o;
  }
  // Remove linhas longas da tinta.
  function dropRuns(o, w, h, L) {
    var y, x, s;
    for (y = 0; y < h; y++) {
      x = 0;
      while (x < w) {
        if (o[y * w + x]) {
          s = x;
          while (x < w && o[y * w + x]) x++;
          if (x - s > L) {
            for (var q = s; q < x; q++) o[y * w + q] = 0;
          }
        } else x++;
      }
    }
  }
  // Abertura morfológica da tinta.
  function openInk(o, w, h, r) {
    function pass(a, v) {
      var t = new Uint8Array(w * h),
        u = new Uint8Array(w * h),
        x,
        y,
        k;
      for (y = 0; y < h; y++)
        for (x = 0; x < w; x++) {
          var m = v;
          for (k = -r; k <= r; k++) {
            var xx = x + k;
            if (xx < 0 || xx >= w) {
              if (v) m = 0;
              continue;
            }
            if (v) {
              if (!a[y * w + xx]) {
                m = 0;
                break;
              }
            } else if (a[y * w + xx]) {
              m = 1;
              break;
            }
          }
          t[y * w + x] = m;
        }
      for (y = 0; y < h; y++)
        for (x = 0; x < w; x++) {
          var m2 = v;
          for (k = -r; k <= r; k++) {
            var yy = y + k;
            if (yy < 0 || yy >= h) {
              if (v) m2 = 0;
              continue;
            }
            if (v) {
              if (!t[yy * w + x]) {
                m2 = 0;
                break;
              }
            } else if (t[yy * w + x]) {
              m2 = 1;
              break;
            }
          }
          u[y * w + x] = m2;
        }
      return u;
    }
    return pass(pass(o, 1), 0);
  }
  // Abertura morfológica com reconstrução.
  function openRec(o, w, h, r, it) {
    var c = openInk(o, w, h, r),
      k,
      x,
      y;
    for (k = 0; k < it; k++) {
      var n = new Uint8Array(w * h);
      for (y = 1; y < h - 1; y++)
        for (x = 1; x < w - 1; x++) {
          var i = y * w + x;
          if (o[i] && (c[i] || c[i - 1] || c[i + 1] || c[i - w] || c[i + w])) n[i] = 1;
        }
      c = n;
    }
    return c;
  }
  // Componentes de caracteres da tinta.
  function charInk(o, w, h, hmin, hmax) {
    var lab = new Int32Array(w * h),
      st = new Int32Array(w * h),
      cs = [],
      i,
      n = 0,
      keep = new Uint8Array(w * h);
    for (i = 0; i < w * h; i++) {
      if (!o[i] || lab[i]) continue;
      n++;
      var sp = 0,
        x0 = 1e9,
        x1 = -1,
        y0 = 1e9,
        y1 = -1,
        cnt = 0,
        mem = [];
      st[sp++] = i;
      lab[i] = n;
      while (sp) {
        var p = st[--sp],
          px = p % w,
          py = (p / w) | 0;
        mem.push(p);
        cnt++;
        if (px < x0) x0 = px;
        if (px > x1) x1 = px;
        if (py < y0) y0 = py;
        if (py > y1) y1 = py;
        if (px > 0 && o[p - 1] && !lab[p - 1]) {
          lab[p - 1] = n;
          st[sp++] = p - 1;
        }
        if (px < w - 1 && o[p + 1] && !lab[p + 1]) {
          lab[p + 1] = n;
          st[sp++] = p + 1;
        }
        if (py > 0 && o[p - w] && !lab[p - w]) {
          lab[p - w] = n;
          st[sp++] = p - w;
        }
        if (py < h - 1 && o[p + w] && !lab[p + w]) {
          lab[p + w] = n;
          st[sp++] = p + w;
        }
      }
      var bw = x1 - x0 + 1,
        bh = y1 - y0 + 1;
      if (bh >= hmin && bh <= hmax && bw <= hmax * 1.3 && cnt / (bw * bh) > 0.18) {
        cs.push({ cy: (y0 + y1) / 2, cx: (x0 + x1) / 2, h: bh });
        for (var q = 0; q < mem.length; q++) keep[mem[q]] = 1;
      }
    }
    return { keep: keep, cs: cs };
  }
  // Histograma de linhas.
  function rowHist(cs, h) {
    var r = new Float64Array(h);
    cs.forEach(function (c) {
      var y = Math.round(c.cy);
      if (y >= 0 && y < h) r[y]++;
    });
    var o = new Float64Array(h),
      y,
      k,
      rad = 6;
    for (y = 0; y < h; y++) {
      var t = 0;
      for (k = -rad; k <= rad; k++) if (y + k >= 0 && y + k < h) t += r[y + k];
      o[y] = t;
    }
    return o;
  }
  // Endireita a faixa de texto.
  function deskewBand(src) {
    var bin = prepVar(src, 4, 1300),
      sm = mkCanvas(Math.round(bin.width / 2), Math.round(bin.height / 2)),
      g = sm.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(bin, 0, 0, sm.width, sm.height);
    g.fillStyle = '#fff';
    g.fillRect(0, 0, 3, 3);
    var best = null,
      th;
    function sc(deg) {
      var r = rotateCanvas(sm, deg),
        o = inkOf(r),
        w = r.width,
        h = r.height;
      o = openInk(o, w, h, 1);
      dropRuns(o, w, h, Math.round(w * 0.05));
      var ci = charInk(o, w, h, 7, 34),
        rh = rowHist(ci.cs, h),
        t = 0,
        y;
      for (y = 0; y < h; y++) t += rh[y] * rh[y];
      return t;
    }
    window.__sc = [];
    for (th = -18; th <= 18; th += 3) {
      var v = sc(th);
      window.__sc.push([th, Math.round(v)]);
      if (!best || v > best.v) best = { v: v, d: th };
    }
    var c0 = best.d;
    for (th = c0 - 2; th <= c0 + 2; th++) {
      if (th === c0) continue;
      var v2 = sc(th);
      if (v2 > best.v) best = { v: v2, d: th };
    }
    return { bin: bin, deg: best.d };
  }
  // Recortes das faixas de texto.
  function bandCrops(src) {
    var o = deskewBand(src),
      r = rotateCanvas(o.bin, o.deg),
      w = r.width,
      h = r.height,
      ink = inkOf(r);
    ink = openRec(ink, w, h, 2, 3);
    dropRuns(ink, w, h, Math.round(w * 0.05));
    var ci = charInk(ink, w, h, 14, 68),
      rh = rowHist(ci.cs, h),
      bh = Math.round(h * 0.06),
      y,
      crops = [],
      used = [];
    ink = ci.keep;
    for (var n = 0; n < 2; n++) {
      var by = -1,
        bv = 0;
      for (y = 0; y < h; y++) {
        if (
          used.some(function (u) {
            return Math.abs(u - y) < bh * 2;
          })
        )
          continue;
        if (rh[y] > bv) {
          bv = rh[y];
          by = y;
        }
      }
      if (by < 0 || bv < 4) break;
      used.push(by);
      var y0 = Math.max(0, by - bh),
        y1 = Math.min(h, by + bh),
        c = mkCanvas(w, y1 - y0),
        cg = c.getContext('2d'),
        dd = cg.createImageData(w, y1 - y0),
        i;
      for (i = 0; i < w * (y1 - y0); i++) {
        var vv = ink[y0 * w + i] ? 0 : 255;
        dd.data[i * 4] = dd.data[i * 4 + 1] = dd.data[i * 4 + 2] = vv;
        dd.data[i * 4 + 3] = 255;
      }
      cg.putImageData(dd, 0, 0);
      crops.push(c);
    }
    window.__bandDeg = o.deg;
    return crops;
  }
  window.__bandCropsFn = function (c) {
    return bandCrops(c);
  };
  // Pré-leitura da haste em várias variantes.
  function preRead(full, psm) {
    var old = HADD;
    HADD = true;
    psm = psm || '11';
    var texts = [],
      i = 0,
      est = 0,
      t0 = Date.now(),
      cs = null,
      cp = null,
      anchor = null;
    window.__lastPrep = [];
    try {
      est = skewOf(full);
    } catch (e) {}
    /* tentativas: no ângulo estimado, depois sem girar, depois varrendo ângulos */
    var plan = [
      [0, est],
      [1, est]
    ];
    if (est) {
      plan.push([0, 0], [1, 0]);
    }
    try {
      var bd = -deskewBand(full).deg;
      window.__bd = bd;
      if (Math.abs(bd - est) > 3 && Math.abs(bd) > 2) {
        plan.splice(2, 0, [4, bd], [0, bd], [1, bd], [5, bd]);
      }
    } catch (eb) {}
    plan.push([2, est], [3, est], [4, est], [5, est]);
    [9, -9, 18, -18, 27, -27].forEach(function (d) {
      plan.push([i % 2 ? 1 : 0, est + d]);
    });
    var job = getWorker()
      .then(function (w) {
        function step() {
          if (i >= plan.length || Date.now() - t0 > 24000) return;
          var pl = plan[i++];
          return w
            .setParameters({ tessedit_pageseg_mode: psm })
            .then(function () {
              var src = pl[1] ? rotateCanvas(full, -pl[1]) : full;
              var pv = prepVar(src, pl[0]);
              cs = src;
              cp = pv;
              if (!window.__lastPrep) window.__lastPrep = [];
              if (window.__lastPrep.length < 4) window.__lastPrep.push(pv);
              return w.recognize(pv, { tsv: true });
            })
            .then(function (r) {
              texts.push(r.data.text || '');
              try {
                (window.__words = window.__words || []).push(
                  tsvWords(r.data.tsv)
                    .filter(function (q) {
                      return q.t.length > 3;
                    })
                    .map(function (q) {
                      return q.t + '|' + Math.round(q.cf) + '|' + q.h;
                    })
                );
                tsvWords(r.data.tsv).forEach(function (wd) {
                  if (
                    /^[A-Z]{1,3}-?[0-9OQDILZSGB]{3,}/i.test(wd.t.toUpperCase()) &&
                    wd.h >= 8 &&
                    wd.h <= cp.height * 0.15 &&
                    (wd.cf > 25 || /^[A-Z]{2}-?\d{3}/.test(wd.t.toUpperCase()))
                  ) {
                    var sco =
                      wd.cf +
                      Math.min(30, wd.t.length * 3) +
                      (/^[A-Z]{2}-?\d{3}/.test(wd.t.toUpperCase()) ? 40 : 0);
                    if (!anchor || sco > anchor.sco) anchor = { sco: sco, src: cs, pv: cp, wd: wd };
                  }
                });
              } catch (e9) {}
              var v = parseVote(texts);
              if (v.nRef >= 2 && v.nMed >= 2) return;
              if (
                v.ref &&
                v.ref.length >= 5 &&
                v.med &&
                /^C(?:1[0-2]|[1-9])$/.test(v.vr || '') &&
                texts.length >= 1
              )
                return;
              return step();
            });
        }
        return step()
          .then(function () {
            var v0 = parseVote(texts);
            window.__anchor = anchor
              ? { t: anchor.wd.t, cf: anchor.wd.cf, h: anchor.wd.h, w: anchor.wd.w }
              : null;
            var p2 = Promise.resolve();
            if (
              anchor &&
              !(v0.nMed >= 2 && v0.ref && /^[A-Z]{2,3}-?\d{3,5}$/.test(v0.ref)) &&
              Date.now() - t0 < 24000
            )
              p2 = refineLine(w, anchor, true).then(
                function (rs) {
                  rs.forEach(function (t) {
                    texts.push(t);
                  });
                  var vq = parseVote(texts);
                  if (vq.ref && vq.med && /^[A-Z]{2,3}-?\d{3,5}$/.test(vq.ref)) return;
                  return refineLine(w, anchor, false).then(function (r2) {
                    r2.forEach(function (t) {
                      texts.push(t);
                    });
                  });
                },
                function (e) {
                  window.__refErr = String((e && e.message) || e);
                }
              );
            return p2;
          })
          .then(function () {
            try {
              w.setParameters({ tessedit_pageseg_mode: '11' });
            } catch (e) {}
            var v = parseVote(texts);
            window.__lastTexts = texts;
            var okRef = function (r) {
              var k = hKey(r);
              return (
                S.items.some(function (i) {
                  return i.ref && hKey(i.ref) === k;
                }) ||
                (knownPre(String(r).replace(/-?\d.*$/, '')) && /\d{3}/.test(r))
              );
            };
            if (v.ref && ((v.med && /^[A-Z]{2,3}-?\d{3,5}$/.test(v.ref)) || okRef(v.ref)))
              return { ref: v.ref, med: v.med, vr: v.vr };
            if (v.ref) v = { ref: '', med: v.med, vr: v.vr };
            var m = hFind(texts);
            if (
              m.length &&
              (m[0][1] >= 9 || m.length === 1) &&
              (((v.med || HMED) && /^[A-Z]{2,3}-?\d{3,5}$/.test(m[0][0])) || okRef(m[0][0]))
            )
              return { ref: m[0][0], med: v.med || HMED, vr: v.vr || HVR };
            return v.med || v.vr ? { ref: '', med: v.med, vr: v.vr } : null;
          });
      })
      .catch(function (e) {
        HERR = (e && (e.code || e.message)) || String(e);
        return null;
      });
    return Promise.race([
      job,
      new Promise(function (ok) {
        setTimeout(function () {
          ok(null);
        }, 32000);
      })
    ]).then(
      function (x) {
        HADD = old;
        return x;
      },
      function () {
        HADD = old;
        return null;
      }
    );
  }
  function coverOf(cv) {
    try {
      var w = 64,
        h = Math.max(1, Math.round((cv.height * w) / cv.width)),
        c = mkCanvas(w, h),
        g = c.getContext('2d');
      g.drawImage(cv, 0, 0, w, h);
      var d = g.getImageData(0, 0, w, h).data,
        n = 0,
        i;
      for (i = 0; i < w * h; i++) {
        if (d[i * 4] < 235 || d[i * 4 + 1] < 235 || d[i * 4 + 2] < 235) n++;
      }
      return n / (w * h);
    } catch (e) {
      return 0.3;
    }
  }
