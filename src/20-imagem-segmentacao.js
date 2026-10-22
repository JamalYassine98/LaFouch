  function mkCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    return c;
  }
  function fitCanvas(img, maxSide) {
    var w = img.naturalWidth || img.width,
      h = img.naturalHeight || img.height,
      sc = Math.min(1, maxSide / Math.max(w, h)),
      c = mkCanvas(w * sc, h * sc),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(img, 0, 0, c.width, c.height);
    return c;
  }
  var EDGE_T = window.__EDGE || 26;
  // ---- recorte por modelo (qualquer fundo): IS-Net 512 (pesos int8) + U2Net-p, via onnxruntime-web
  var SEG = {
    ready: null,
    failed: false,
    tta: false,
    base: 'seg/',
    ort: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.3/dist/',
    parts: ['isnet_a.bin', 'isnet_b.bin', 'isnet_c.bin', 'isnet_d.bin'],
    small: 'u2netp.onnx',
    on: null
  };
  function segStatus(t) {
    if (SEG.on)
      try {
        SEG.on(t);
      } catch (e) {}
  }
  function segLoad() {
    if (window.__segFn) return Promise.resolve({});
    if (SEG.ready) return SEG.ready;
    SEG.ready = new Promise(function (ok, no) {
      var go = function () {
        try {
          window.ort.env.wasm.wasmPaths = SEG.ort;
          window.ort.env.wasm.numThreads = 1;
          window.ort.env.wasm.proxy = false;
        } catch (e) {}
        var get = function (u) {
          return fetch(u).then(function (r) {
            if (!r.ok) throw new Error('http ' + r.status + ' ' + u);
            if (/\.txt$/.test(u))
              return r.text().then(function (t) {
                var bin = atob(t),
                  n = bin.length,
                  a = new Uint8Array(n),
                  i;
                for (i = 0; i < n; i++) a[i] = bin.charCodeAt(i);
                return a.buffer;
              });
            return r.arrayBuffer();
          });
        };
        segStatus('Baixando o modelo de recorte (só na primeira vez)…');
        Promise.all(
          SEG.parts
            .map(function (p) {
              return get(SEG.base + p);
            })
            .concat([get(SEG.base + SEG.small)])
        )
          .then(function (b) {
            var n = 0,
              i;
            for (i = 0; i < SEG.parts.length; i++) n += b[i].byteLength;
            var big = new Uint8Array(n),
              o = 0;
            for (i = 0; i < SEG.parts.length; i++) {
              big.set(new Uint8Array(b[i]), o);
              o += b[i].byteLength;
            }
            var opt = { executionProviders: ['wasm'], graphOptimizationLevel: 'all' };
            segStatus('Preparando o modelo…');
            var E = function (w) {
              return function (e) {
                throw new Error(
                  w + ': ' + ((e && e.message) || (typeof e === 'number' ? 'memória/erro ' + e : e))
                );
              };
            };
            return window.ort.InferenceSession.create(new Uint8Array(b[SEG.parts.length]), opt)
              .catch(E('modelo leve'))
              .then(function (ss) {
                return window.ort.InferenceSession.create(big, opt).then(
                  function (sb) {
                    return { big: sb, small: ss };
                  },
                  function (e) {
                    window.__bigErr = String((e && e.message) || e);
                    return { big: null, small: ss };
                  }
                );
              })
              .then(ok);
          })
          .catch(no);
      };
      if (window.ort) {
        go();
        return;
      }
      var ld = function (base, fail) {
        var s = document.createElement('script');
        s.src = base + 'ort.min.js';
        s.onload = function () {
          SEG.ort = base;
          go();
        };
        s.onerror = fail;
        document.head.appendChild(s);
      };
      ld('ort/', function () {
        ld('https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.3/dist/', function () {
          ld('https://unpkg.com/onnxruntime-web@1.17.3/dist/', function () {
            ld('https://cdnjs.cloudflare.com/ajax/libs/onnxruntime-web/1.17.3/', function () {
              no(new Error('motor ort não carregou'));
            });
          });
        });
      });
    }).catch(function (e) {
      SEG.ready = null;
      SEG.failed = true;
      throw e;
    });
    return SEG.ready;
  }
  function segTensor(cv, res, imnet) {
    var c = mkCanvas(res, res),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(cv, 0, 0, res, res);
    var d = g.getImageData(0, 0, res, res).data,
      n = res * res,
      t = new Float32Array(3 * n),
      i,
      m = [0.485, 0.456, 0.406],
      s = [0.229, 0.224, 0.225];
    for (i = 0; i < n; i++)
      for (var k = 0; k < 3; k++) {
        var v = d[i * 4 + k] / 255;
        t[k * n + i] = imnet ? (v - m[k]) / s[k] : v - 0.5;
      }
    return t;
  }
  function segRun(M, kind, res, cv) {
    var data = segTensor(cv, res, kind === 'small');
    var p = window.__segFn
      ? Promise.resolve(window.__segFn(kind, data, res))
      : (kind === 'big' && !M.big
          ? Promise.reject(new Error('sem modelo grande'))
          : M[kind === 'small' ? 'small' : 'big'].run(
              (function () {
                var o = {};
                o[kind === 'small' ? M.small.inputNames[0] : M.big.inputNames[0]] =
                  new window.ort.Tensor('float32', data, [1, 3, res, res]);
                return o;
              })()
            )
        ).then(
          function (o) {
            return o[kind === 'small' ? M.small.outputNames[0] : M.big.outputNames[0]].data;
          },
          function (e) {
            throw new Error(
              'rodar ' +
                kind +
                ': ' +
                ((e && e.message) || (typeof e === 'number' ? 'erro ' + e : e))
            );
          }
        );
    return p.then(function (o) {
      var n = res * res,
        a = new Float32Array(n),
        i,
        mn = 1e9,
        mx = -1e9;
      var sig = false;
      for (i = 0; i < n; i++) {
        if (o[i] < 0 || o[i] > 1) {
          sig = true;
          break;
        }
      }
      for (i = 0; i < n; i++) {
        var v = sig ? 1 / (1 + Math.exp(-o[i])) : o[i];
        a[i] = v;
        if (v < mn) mn = v;
        if (v > mx) mx = v;
      }
      var r = mx - mn + 1e-9;
      for (i = 0; i < n; i++) a[i] = (a[i] - mn) / r;
      return a;
    });
  }
  // caixa móvel (média) separável
  function segBox(src, w, h, r, dst, tmp) {
    var x,
      y,
      acc,
      k,
      inv = 1 / (2 * r + 1);
    tmp = tmp || new Float32Array(w * h);
    for (y = 0; y < h; y++) {
      var o = y * w;
      acc = 0;
      for (k = -r; k <= r; k++) acc += src[o + Math.min(w - 1, Math.max(0, k))];
      for (x = 0; x < w; x++) {
        tmp[o + x] = acc * inv;
        acc += src[o + Math.min(w - 1, x + r + 1)] - src[o + Math.max(0, x - r)];
      }
    }
    for (x = 0; x < w; x++) {
      acc = 0;
      for (k = -r; k <= r; k++) acc += tmp[Math.min(h - 1, Math.max(0, k)) * w + x];
      for (y = 0; y < h; y++) {
        dst[y * w + x] = acc * inv;
        acc += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
      }
    }
    return dst;
  }
  function segGuided(I, p, w, h, r, eps) {
    var n = w * h,
      i,
      mI = new Float32Array(n),
      mp = new Float32Array(n),
      t = new Float32Array(n),
      t2 = new Float32Array(n),
      a = new Float32Array(n),
      b = new Float32Array(n),
      tmp = new Float32Array(n);
    segBox(I, w, h, r, mI, tmp);
    segBox(p, w, h, r, mp, tmp);
    for (i = 0; i < n; i++) t[i] = I[i] * p[i];
    segBox(t, w, h, r, t2, tmp); // E[Ip]
    for (i = 0; i < n; i++) t[i] = I[i] * I[i];
    segBox(t, w, h, r, a, tmp); // E[II]
    for (i = 0; i < n; i++) {
      var cov = t2[i] - mI[i] * mp[i],
        vr = a[i] - mI[i] * mI[i];
      var aa = cov / (vr + eps);
      b[i] = mp[i] - aa * mI[i];
      t[i] = aa;
    }
    segBox(t, w, h, r, a, tmp);
    segBox(b, w, h, r, t2, tmp);
    var o = new Float32Array(n);
    for (i = 0; i < n; i++) {
      var v = a[i] * I[i] + t2[i];
      o[i] = v < 0 ? 0 : v > 1 ? 1 : v;
    }
    return o;
  }
  // maior componente (4-conexa) de uma máscara booleana; devolve Uint8Array e área
  function segLargest(m, w, h, minFrac) {
    var n = w * h,
      lab = new Int32Array(n),
      q = new Int32Array(n),
      areas = [0],
      L = 0,
      i,
      qh,
      qt;
    for (i = 0; i < n; i++) {
      if (!m[i] || lab[i]) continue;
      L++;
      lab[i] = L;
      qh = 0;
      qt = 0;
      q[qt++] = i;
      var c = 0;
      while (qh < qt) {
        var p = q[qh++],
          x = p % w,
          y = (p / w) | 0;
        c++;
        if (x > 0 && m[p - 1] && !lab[p - 1]) {
          lab[p - 1] = L;
          q[qt++] = p - 1;
        }
        if (x < w - 1 && m[p + 1] && !lab[p + 1]) {
          lab[p + 1] = L;
          q[qt++] = p + 1;
        }
        if (y > 0 && m[p - w] && !lab[p - w]) {
          lab[p - w] = L;
          q[qt++] = p - w;
        }
        if (y < h - 1 && m[p + w] && !lab[p + w]) {
          lab[p + w] = L;
          q[qt++] = p + w;
        }
      }
      areas.push(c);
    }
    var best = 1,
      j;
    for (j = 2; j <= L; j++) if (areas[j] > areas[best]) best = j;
    var out = new Uint8Array(n),
      keep = [],
      thr = (minFrac || 0) * areas[best];
    for (j = 1; j <= L; j++) keep[j] = j === best || areas[j] >= thr;
    for (i = 0; i < n; i++) if (lab[i] && keep[lab[i]]) out[i] = 1;
    return out;
  }
  function segFill(m, w, h) {
    // fecha buracos: o que não é alcançado a partir da borda pelo "fora"
    var n = w * h,
      out = new Uint8Array(n),
      q = new Int32Array(n),
      qh = 0,
      qt = 0,
      i;
    for (i = 0; i < n; i++) out[i] = 1;
    var push = function (p) {
      if (!m[p] && out[p]) {
        out[p] = 0;
        q[qt++] = p;
      }
    };
    for (i = 0; i < w; i++) {
      push(i);
      push((h - 1) * w + i);
    }
    for (i = 0; i < h; i++) {
      push(i * w);
      push(i * w + w - 1);
    }
    while (qh < qt) {
      var p = q[qh++],
        x = p % w,
        y = (p / w) | 0;
      if (x > 0) push(p - 1);
      if (x < w - 1) push(p + 1);
      if (y > 0) push(p - w);
      if (y < h - 1) push(p + w);
    }
    return out;
  }
  function segPct(arr, idx, pcts) {
    var v = new Float32Array(idx.length),
      i;
    for (i = 0; i < idx.length; i++) v[i] = arr[idx[i]];
    v.sort();
    return pcts.map(function (p) {
      return v[Math.min(v.length - 1, Math.floor((p / 100) * v.length))];
    });
  }
  function segDilate(m, w, h, r) {
    var n = w * h,
      f = new Float32Array(n),
      o = new Float32Array(n),
      i;
    for (i = 0; i < n; i++) f[i] = m[i] ? 1 : 0;
    segBox(f, w, h, r, o);
    var u = new Uint8Array(n);
    for (i = 0; i < n; i++) u[i] = o[i] > 1e-4 ? 1 : 0;
    return u;
  }
  // recorte quadrado com bordas replicadas (bx0,by0 podem cair fora da imagem)
  function segCrop(full, bx0, by0, bs, cs) {
    var c = mkCanvas(cs, cs),
      g = c.getContext('2d'),
      k = cs / bs,
      W = full.width,
      H = full.height;
    g.imageSmoothingQuality = 'high';
    var x0 = Math.max(0, bx0),
      y0 = Math.max(0, by0),
      x1 = Math.min(W, bx0 + bs),
      y1 = Math.min(H, by0 + bs);
    if (x1 <= x0 || y1 <= y0) {
      g.fillStyle = '#808080';
      g.fillRect(0, 0, cs, cs);
      return c;
    }
    var dx0 = (x0 - bx0) * k,
      dy0 = (y0 - by0) * k,
      dx1 = (x1 - bx0) * k,
      dy1 = (y1 - by0) * k;
    // faixas de 1px esticadas (replicação de borda)
    if (dx0 > 0) g.drawImage(full, x0, y0, 1, y1 - y0, 0, dy0, dx0 + 1, dy1 - dy0);
    if (dx1 < cs) g.drawImage(full, x1 - 1, y0, 1, y1 - y0, dx1 - 1, dy0, cs - dx1 + 1, dy1 - dy0);
    if (dy0 > 0) g.drawImage(full, x0, y0, x1 - x0, 1, dx0, 0, dx1 - dx0, dy0 + 1);
    if (dy1 < cs) g.drawImage(full, x0, y1 - 1, x1 - x0, 1, dx0, dy1 - 1, dx1 - dx0, cs - dy1 + 1);
    if (dx0 > 0 && dy0 > 0) g.drawImage(full, x0, y0, 1, 1, 0, 0, dx0 + 1, dy0 + 1);
    if (dx1 < cs && dy0 > 0) g.drawImage(full, x1 - 1, y0, 1, 1, dx1 - 1, 0, cs - dx1 + 1, dy0 + 1);
    if (dx0 > 0 && dy1 < cs) g.drawImage(full, x0, y1 - 1, 1, 1, 0, dy1 - 1, dx0 + 1, cs - dy1 + 1);
    if (dx1 < cs && dy1 < cs)
      g.drawImage(full, x1 - 1, y1 - 1, 1, 1, dx1 - 1, dy1 - 1, cs - dx1 + 1, cs - dy1 + 1);
    g.drawImage(full, x0, y0, x1 - x0, y1 - y0, dx0, dy0, dx1 - dx0, dy1 - dy0);
    return c;
  }
  // o fundo é liso e claro? (então o recorte clássico já resolve)
  function bgIsPlain(full) {
    var sw = 160,
      sh = Math.max(8, Math.round((160 * full.height) / full.width)),
      c = mkCanvas(sw, sh),
      g = c.getContext('2d');
    g.drawImage(full, 0, 0, sw, sh);
    var d = g.getImageData(0, 0, sw, sh).data,
      ring = Math.max(3, Math.round(Math.min(sw, sh) * 0.04)),
      L = [],
      x,
      y,
      i;
    for (y = 0; y < sh; y++)
      for (x = 0; x < sw; x++) {
        if (x < ring || y < ring || x >= sw - ring || y >= sh - ring) {
          i = (y * sw + x) * 4;
          L.push(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
        }
      }
    var gr = 0,
      gn = 0,
      Y = function (p) {
        return 0.299 * d[p * 4] + 0.587 * d[p * 4 + 1] + 0.114 * d[p * 4 + 2];
      };
    for (y = 1; y < sh - 1; y++)
      for (x = 1; x < sw - 1; x++) {
        if (x < ring || y < ring || x >= sw - ring || y >= sh - ring) {
          i = y * sw + x;
          gr += Math.abs(Y(i + 1) - Y(i - 1)) + Math.abs(Y(i + sw) - Y(i - sw));
          gn++;
        }
      }
    gr = gn ? gr / gn : 0;
    L.sort(function (a, b) {
      return a - b;
    });
    var med = L[L.length >> 1],
      lo = L[Math.floor(L.length * 0.1)],
      hi = L[Math.floor(L.length * 0.9)];
    window.__bgStat = { med: med, span: hi - lo, grad: gr };
    return med >= 160 && gr < 18;
  }
  window.__bgIsPlain = bgIsPlain;
  window.__fitCanvas = fitCanvas;
  function segBBox(a, res) {
    var n = res * res,
      b = new Uint8Array(n),
      i;
    for (i = 0; i < n; i++) b[i] = a[i] > 0.5 ? 1 : 0;
    var m = segLargest(b, res, res, 0),
      x0 = 1e9,
      y0 = 1e9,
      x1 = -1,
      y1 = -1;
    for (i = 0; i < n; i++)
      if (m[i]) {
        var x = i % res,
          y = (i / res) | 0;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    if (x1 < 0) return null;
    return { x0: x0 / res, y0: y0 / res, x1: (x1 + 1) / res, y1: (y1 + 1) / res };
  }
  function segPlausible(bb, W, H) {
    if (!bb) return false;
    var w = (bb.x1 - bb.x0) * W,
      h = (bb.y1 - bb.y0) * H,
      ar = w / Math.max(1, h);
    return (bb.x1 - bb.x0) * (bb.y1 - bb.y0) > 0.04 && ar >= 1.5 && ar <= 4.6;
  }
  function up512(a) {
    var o = new Float32Array(512 * 512),
      y,
      x,
      k = 319 / 511;
    for (y = 0; y < 512; y++) {
      var fy = y * k,
        y0 = fy | 0,
        y1 = Math.min(319, y0 + 1),
        wy = fy - y0;
      for (x = 0; x < 512; x++) {
        var fx = x * k,
          x0 = fx | 0,
          x1 = Math.min(319, x0 + 1),
          wx = fx - x0;
        o[y * 512 + x] =
          (a[y0 * 320 + x0] * (1 - wx) + a[y0 * 320 + x1] * wx) * (1 - wy) +
          (a[y1 * 320 + x0] * (1 - wx) + a[y1 * 320 + x1] * wx) * wy;
      }
    }
    return o;
  }
  /* o modelo pegou a prateleira junto (caixa alta/larga demais): procura só a armação, que é a parte com muito detalhe dentro da máscara */
  function devBBox(full, a1) {
    var res = 320,
      n = res * res,
      c = mkCanvas(res, res),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(full, 0, 0, res, res);
    var d = g.getImageData(0, 0, res, res).data,
      i,
      x,
      y,
      R = [],
      G = [],
      B = [];
    for (y = Math.round(res * 0.25); y < Math.round(res * 0.75); y += 2)
      for (x = Math.round(res * 0.1); x < Math.round(res * 0.9); x += 2) {
        i = (y * res + x) * 4;
        R.push(d[i]);
        G.push(d[i + 1]);
        B.push(d[i + 2]);
      }
    var md = function (v) {
        v.sort(function (p, q) {
          return p - q;
        });
        return v[v.length >> 1];
      },
      mr = md(R),
      mg = md(G),
      mb = md(B);
    var f = new Float32Array(n),
      o = new Float32Array(n),
      tmp = new Float32Array(n),
      cnt = 0;
    for (i = 0; i < n; i++) {
      f[i] =
        Math.abs(d[i * 4] - mr) + Math.abs(d[i * 4 + 1] - mg) + Math.abs(d[i * 4 + 2] - mb) > 60
          ? 1
          : 0;
      cnt += f[i];
    }
    if (cnt < 60) return null;
    segBox(f, res, res, 3, o, tmp);
    var e = new Uint8Array(n);
    for (i = 0; i < n; i++) e[i] = o[i] > 0.999 ? 1 : 0;
    /* a peça (o que o cliente enquadrou) é a mancha que mais cobre o centro da foto */
    var lab = new Int32Array(n),
      q = new Int32Array(n),
      L = 0,
      cx0 = res / 2 - 45,
      cx1 = res / 2 + 45,
      cy0 = res / 2 - 30,
      cy1 = res / 2 + 30,
      best = null;
    for (i = 0; i < n; i++) {
      if (!e[i] || lab[i]) continue;
      L++;
      var qh = 0,
        qt = 0,
        x0 = 1e9,
        y0 = 1e9,
        x1 = -1,
        y1 = -1,
        ov = 0;
      q[qt++] = i;
      lab[i] = L;
      while (qh < qt) {
        var p = q[qh++],
          px = p % res,
          py = (p / res) | 0;
        if (px < x0) x0 = px;
        if (px > x1) x1 = px;
        if (py < y0) y0 = py;
        if (py > y1) y1 = py;
        if (px >= cx0 && px < cx1 && py >= cy0 && py < cy1) ov++;
        if (px > 0 && e[p - 1] && !lab[p - 1]) {
          lab[p - 1] = L;
          q[qt++] = p - 1;
        }
        if (px < res - 1 && e[p + 1] && !lab[p + 1]) {
          lab[p + 1] = L;
          q[qt++] = p + 1;
        }
        if (py > 0 && e[p - res] && !lab[p - res]) {
          lab[p - res] = L;
          q[qt++] = p - res;
        }
        if (py < res - 1 && e[p + res] && !lab[p + res]) {
          lab[p + res] = L;
          q[qt++] = p + res;
        }
      }
      if (ov > 0 && (!best || ov > best.ov)) best = { ov: ov, x0: x0, y0: y0, x1: x1, y1: y1 };
    }
    if (!best) return null;
    var bw = best.x1 - best.x0 + 1,
      bh = best.y1 - best.y0 + 1,
      mx = bw * 0.04 + 3,
      my = bh * 0.08 + 3;
    return {
      x0: Math.max(0, best.x0 - mx) / res,
      y0: Math.max(0, best.y0 - my) / res,
      x1: Math.min(res, best.x1 + 1 + mx) / res,
      y1: Math.min(res, best.y1 + 1 + my) / res,
      col: [mr, mg, mb]
    };
  }
  /* quando a prateleira entrou na máscara: mantém só o que difere da cor da prateleira (a armação), sem a linha fina da emenda e com as lentes preenchidas */
  function applySil(cr, a, col) {
    var r = 512,
      n = r * r,
      c = mkCanvas(r, r),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(cr, 0, 0, r, r);
    var d = g.getImageData(0, 0, r, r).data,
      f = new Float32Array(n),
      i,
      cnt = 0;
    for (i = 0; i < n; i++) {
      f[i] =
        Math.abs(d[i * 4] - col[0]) +
          Math.abs(d[i * 4 + 1] - col[1]) +
          Math.abs(d[i * 4 + 2] - col[2]) >
        45
          ? 1
          : 0;
    }
    var o = new Float32Array(n),
      t = new Float32Array(n);
    segBox(f, r, r, 2, o, t);
    var e = new Uint8Array(n);
    for (i = 0; i < n; i++) e[i] = o[i] > 0.999 ? 1 : 0;
    var dl = segDilate(e, r, r, 7),
      out = new Uint8Array(n),
      q = new Int32Array(n),
      qh = 0,
      qt = 0,
      x,
      y;
    /* buracos (lentes): o que não é alcançável a partir da borda fica dentro */
    var seen = new Uint8Array(n);
    function push(p) {
      if (!dl[p] && !seen[p]) {
        seen[p] = 1;
        q[qt++] = p;
      }
    }
    for (x = 0; x < r; x++) {
      push(x);
      push((r - 1) * r + x);
    }
    for (y = 0; y < r; y++) {
      push(y * r);
      push(y * r + r - 1);
    }
    while (qh < qt) {
      var p = q[qh++],
        px = p % r,
        py = (p / r) | 0;
      if (px > 0) push(p - 1);
      if (px < r - 1) push(p + 1);
      if (py > 0) push(p - r);
      if (py < r - 1) push(p + r);
    }
    for (i = 0; i < n; i++) {
      out[i] = seen[i] ? 0 : 1;
      cnt += out[i];
    }
    if (cnt < n * 0.01 || cnt > n * 0.6) return a;
    var sm = new Float32Array(n),
      res = new Float32Array(n);
    for (i = 0; i < n; i++) sm[i] = out[i];
    segBox(sm, r, r, 1, res, t);
    var o2 = new Float32Array(n);
    for (i = 0; i < n; i++) o2[i] = a[i] * Math.min(1, res[i] * 1.5);
    return o2;
  }
  function shelfCol(full) {
    var res = 200,
      c = mkCanvas(res, res),
      g = c.getContext('2d');
    g.drawImage(full, 0, 0, res, res);
    var d = g.getImageData(0, 0, res, res).data,
      R = [],
      G = [],
      B = [],
      x,
      y,
      i;
    for (y = Math.round(res * 0.2); y < Math.round(res * 0.8); y += 2)
      for (x = Math.round(res * 0.05); x < Math.round(res * 0.95); x += 2) {
        i = (y * res + x) * 4;
        R.push(d[i]);
        G.push(d[i + 1]);
        B.push(d[i + 2]);
      }
    var md = function (v) {
      v.sort(function (p, q) {
        return p - q;
      });
      return v[v.length >> 1];
    };
    return [md(R), md(G), md(B)];
  }
  /* quanto da peça recortada ainda parece a prateleira (fração dos pixels não brancos): serve para recusar o recorte quando o fundo ficou junto */
  function shelfShare(cv, full) {
    var col = shelfCol(full),
      r = 400,
      n = r * r,
      c = mkCanvas(r, r),
      g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(cv, 0, 0, r, r);
    var d = g.getImageData(0, 0, r, r).data,
      lk = new Uint8Array(n),
      nw = 0,
      i,
      x,
      y;
    for (i = 0; i < n; i++) {
      var R = d[i * 4],
        G = d[i * 4 + 1],
        B = d[i * 4 + 2];
      if (R >= 245 && G >= 245 && B >= 245) continue;
      nw++;
      if (Math.abs(R - col[0]) + Math.abs(G - col[1]) + Math.abs(B - col[2]) < 45) lk[i] = 1;
    }
    if (!nw) return 0;
    var cnt = 0;
    for (y = 1; y < r - 1; y++)
      for (x = 1; x < r - 1; x++) {
        i = y * r + x;
        if (
          lk[i] &&
          lk[i - 1] &&
          lk[i + 1] &&
          lk[i - r] &&
          lk[i + r] &&
          lk[i - r - 1] &&
          lk[i - r + 1] &&
          lk[i + r - 1] &&
          lk[i + r + 1]
        )
          cnt++;
      }
    return cnt / nw;
  }
  var bp0 = true;
  function modelWhiten(full) {
    return segLoad().then(function (M) {
      var W = full.width,
        H = full.height;
      segStatus('Achando a armação…');
      return segRun(M, 'small', 320, full)
        .then(function (a1) {
          var bb = segBBox(a1, 320);
          var bp = segPlausible(bb, W, H);
          bp0 = bp;
          window.__bbInfo = { bb: bb, bp: bp };
          try {
            var db = devBBox(full, a1);
            window.__devBB = db;
            if (
              db &&
              segPlausible(db, W, H) &&
              (window.__forceDev ||
                !bb ||
                (bb.x1 - bb.x0) * (bb.y1 - bb.y0) >
                  (db.x1 - db.x0) * (db.y1 - db.y0) * (bp ? 3 : 1.6))
            ) {
              db.dev = 1;
              return db;
            }
          } catch (eD) {
            window.__devErr = String(eD);
          }
          if (bp) return bb;
          if (!M.big) return bb;
          return segRun(M, 'big', 512, full).then(function (a0) {
            var b2 = segBBox(a0, 512);
            return segPlausible(b2, W, H) ? b2 : bb || b2;
          });
        })
        .then(function (bb) {
          if (!bb) throw new Error('vazio');
          var fx0 = bb.x0 * W,
            fx1 = bb.x1 * W,
            fy0 = bb.y0 * H,
            fy1 = bb.y1 * H,
            cx = (fx0 + fx1) / 2,
            cy = (fy0 + fy1) / 2,
            bs = Math.round(Math.max(fx1 - fx0, fy1 - fy0) * 1.2),
            bx0 = Math.round(cx - bs / 2),
            by0 = Math.round(cy - bs / 2);
          var S = 2000,
            cr = segCrop(full, bx0, by0, bs, S);
          segStatus('Recortando a armação…');
          return (M.big ? segRun(M, 'big', 512, cr) : segRun(M, 'small', 320, cr).then(up512))
            .then(function (a2) {
              if (!SEG.tta) return a2;
              var f = mkCanvas(S, S),
                fg = f.getContext('2d');
              fg.translate(S, 0);
              fg.scale(-1, 1);
              fg.drawImage(cr, 0, 0);
              return segRun(M, 'big', 512, f).then(function (b2) {
                var n = 512 * 512,
                  o = new Float32Array(n),
                  yy,
                  xx;
                for (yy = 0; yy < 512; yy++)
                  for (xx = 0; xx < 512; xx++)
                    o[yy * 512 + xx] = (a2[yy * 512 + xx] + b2[yy * 512 + 511 - xx]) / 2;
                return o;
              });
            })
            .then(function (a2) {
              try {
                var cv0 = 0,
                  nn0 = a2.length,
                  i0;
                for (i0 = 0; i0 < nn0; i0++) if (a2[i0] > 0.5) cv0++;
                window.__cover = cv0 / nn0;
                if (cv0 / nn0 > 0.8 && !window.__noRefuse) {
                  var RE2 = new Error('REFUSA');
                  RE2.refusa = 1;
                  throw RE2;
                }
              } catch (eR) {
                if (eR && eR.refusa) throw eR;
              }
              if (bb.dev && bb.col) {
                try {
                  a2 = applySil(cr, a2, bb.col);
                } catch (eS) {}
              }
              var res = compose(cr, a2, S);
              if (!window.__noRefuse) {
                var sh = 0;
                try {
                  sh = shelfShare(res.canvas, full);
                } catch (eSh) {
                  window.__shErr = String(eSh);
                }
                window.__share = sh;
                if (sh > 0.3 || (!bp0 && sh > 0.04)) {
                  var RE3 = new Error('REFUSA');
                  RE3.refusa = 1;
                  throw RE3;
                }
              }
              res.bbox = [
                Math.max(0, fx0 / W),
                Math.max(0, fy0 / H),
                Math.min(1, fx1 / W),
                Math.min(1, fy1 / H)
              ];
              return res;
            });
        });
    });
  }
  /* tira a emenda da estante (linha fina, reta e quase vertical) que o modelo confunde com a peça; a armação (grossa) fica */
  function segSeam(A, w) {
    var n = w * w,
      i,
      r = Math.max(4, Math.round(w * 0.012)),
      bm = new Float32Array(n),
      tmp = new Float32Array(n),
      e = new Float32Array(n),
      d = new Float32Array(n),
      er = new Float32Array(n);
    for (i = 0; i < n; i++) bm[i] = A[i] > 0.5 ? 1 : 0;
    segBox(bm, w, w, r, e, tmp);
    for (i = 0; i < n; i++) er[i] = e[i] > 0.999 ? 1 : 0;
    segBox(er, w, w, r, d, tmp);
    var thin = new Uint8Array(n),
      seen = new Uint8Array(n),
      rm = new Uint8Array(n),
      any = false;
    for (i = 0; i < n; i++) thin[i] = bm[i] && d[i] < 0.001 ? 1 : 0;
    for (i = 0; i < n; i++) {
      if (!thin[i] || seen[i]) continue;
      var cm = [i],
        x0 = w,
        x1 = 0,
        y0 = w,
        y1 = 0;
      seen[i] = 1;
      for (var k = 0; k < cm.length; k++) {
        var c = cm[k],
          cx = c % w,
          cy = (c / w) | 0;
        if (cx < x0) x0 = cx;
        if (cx > x1) x1 = cx;
        if (cy < y0) y0 = cy;
        if (cy > y1) y1 = cy;
        for (var yy = -1; yy <= 1; yy++)
          for (var xx = -1; xx <= 1; xx++) {
            var X = cx + xx,
              Y = cy + yy;
            if (X < 0 || Y < 0 || X >= w || Y >= w) continue;
            var q = Y * w + X;
            if (thin[q] && !seen[q]) {
              seen[q] = 1;
              cm.push(q);
            }
          }
      }
      var bw = x1 - x0 + 1,
        bh = y1 - y0 + 1;
      if (bh >= w * 0.07 && bh >= bw * 2.5 && bw <= w * 0.07) {
        any = true;
        for (k = 0; k < cm.length; k++) rm[cm[k]] = 1;
      }
    }
    if (!any) return A;
    var rd = segDilate(rm, w, w, 3),
      o = new Float32Array(A);
    for (i = 0; i < n; i++) if (rd[i]) o[i] = 0;
    return o;
  }
