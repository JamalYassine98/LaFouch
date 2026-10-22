  function flatParse(t) {
    var F = String(t)
        .toUpperCase()
        .replace(/[□▢▯]/g, '0')
        .replace(/[^A-Z0-9]/g, ''),
      m,
      re = /([A-Z]{2,3})([0-9OQDILZSGB]{3,5}?)(\d{2})[A-Z0]?(\d{2})(1[2-6]\d)(?:C(1[0-2]|[1-9]))?/g,
      best = null;
    var G = F.replace(/O/g, '0');
    while ((m = re.exec(G))) {
      var ln = +m[3],
        br = +m[4],
        tp = +m[5];
      if (ln >= 38 && ln <= 66 && br >= 12 && br <= 26 && /^\d+$/.test(m[2])) {
        best = {
          ref: m[1] + '-' + m[2],
          med: m[3] + '□' + m[4] + '-' + m[5],
          vr: m[6] ? 'C' + m[6] : ''
        };
        break;
      }
      re.lastIndex = m.index + 1;
    }
    if (!best) {
      re = /(\d{2})0?(\d{2})(1[2-6]\d)(?:C(1[0-2]|[1-9]))?/g;
      while ((m = re.exec(G))) {
        var l2 = +m[1],
          b2 = +m[2],
          t2 = +m[3];
        if (l2 >= 38 && l2 <= 66 && b2 >= 12 && b2 <= 26) {
          best = { ref: '', med: m[1] + '□' + m[2] + '-' + m[3], vr: m[4] ? 'C' + m[4] : '' };
          break;
        }
        re.lastIndex = m.index + 1;
      }
    }
    return best;
  }
  function parseHaste(texts) {
    var o = { ref: '', med: '', vr: '' };
    for (var a = 0; a < texts.length && !o.med; a++) {
      var ls = String(texts[a]).toUpperCase().split(/\n+/);
      for (var b = 0; b < ls.length; b++) {
        var L = ls[b].replace(/[□▢▯\[\]|]/g, '0').replace(/[‐‑–—]/g, '-'),
          m = L.match(
            /(?:([A-Z]{1,4}\s?-?\s?[0-9OQDILZSGB]{2,6}[A-Z]?)[.,:;]?\s+)?(\d{2})\s?(?:[0OQD][1IL]?)?\s?(\d{2})\s?[-.]?\s?(1[2-6]\d)(?!\d)(?:\s*(C\s?(?:1[0-2]|[1-9S]))(?!\d))?/
          );
        if (!m) continue;
        var ln = +m[2],
          br = +m[3],
          tp = +m[4];
        if (!(ln >= 38 && ln <= 66 && br >= 12 && br <= 26 && tp >= 120 && tp <= 160)) continue;
        o.med = m[2] + '□' + m[3] + '-' + m[4];
        if (m[1]) {
          var rf = m[1].replace(/\s+/g, ''),
            q = rf.match(/^([A-Z]{1,4})(-?)([0-9OQDILZSGB]{2,6})([A-Z]?)$/);
          if (q) {
            var dg = /^\d+$/.test(q[3]) ? q[3] : fixDigits(q[3]);
            if (/^\d+$/.test(dg)) o.ref = q[1] + q[2] + dg + q[4];
          }
        }
        if (!o.ref) {
          var pre = L.slice(0, m.index + (m[1] ? 0 : 0)),
            q2 = pre.match(/([A-Z]{1,4}-?[0-9OQDILZSGB]{2,6}[A-Z]?)[.,:;\s]*$/);
          if (q2) {
            var q3 = q2[1].match(/^([A-Z]{1,4})(-?)([0-9OQDILZSGB]{2,6})([A-Z]?)$/);
            if (q3) {
              var d3 = /^\d+$/.test(q3[3]) ? q3[3] : fixDigits(q3[3]);
              if (/^\d+$/.test(d3)) o.ref = q3[1] + q3[2] + d3 + q3[4];
            }
          }
        }
        if (m[5]) o.vr = 'C' + m[5].replace(/^C\s?/, '').replace('S', '5');
        else {
          var cm = L.match(/(?:^|[^A-Z])C\s?(1[0-2]|[1-9])(?!\d)/);
          if (cm) o.vr = 'C' + cm[1];
        }
        break;
      }
    }
    if (!o.med || !o.ref) {
      for (var fi = 0; fi < texts.length; fi++) {
        var fp = flatParse(texts[fi]);
        if (fp && (!o.med || fp.med === o.med)) {
          if (!o.med) o.med = fp.med;
          if (!o.ref && fp.ref) o.ref = fp.ref;
          if (!o.vr && fp.vr) o.vr = fp.vr;
          if (o.ref) break;
        }
      }
    }
    if (o.med && !o.ref) {
      texts.forEach(function (T) {
        String(T)
          .toUpperCase()
          .split(/[\s]+/)
          .forEach(function (w) {
            if (o.ref) return;
            var q = w.match(/^([A-Z]{1,4})(-?)([0-9OQDILZSGB]{2,6})([A-Z]?)$/);
            if (q && !/^C\d{1,2}$/.test(q[1] + q[3])) {
              var dg = /^\d+$/.test(q[3]) ? q[3] : fixDigits(q[3]);
              if (/^\d+$/.test(dg) && q[1] !== 'LA') o.ref = q[1] + q[2] + dg + q[4];
            }
          });
      });
    }
    if (o.ref) {
      var m3 = o.ref.match(/^([A-Z]{3,4})(-?\d.*)$/);
      if (m3) {
        var kn = { PY: 1, SP: 1, BR: 1, SL: 1, CX: 1 };
        try {
          (S.items || []).forEach(function (i) {
            var q = String(i.ref || '').match(/^[A-Z]{2}/);
            if (q) kn[q[0]] = 1;
          });
        } catch (e) {}
        var l2 = m3[1].slice(-2);
        if (kn[l2]) o.ref = l2 + m3[2];
      }
    }
    if (o.ref && /^[A-Z]-?\d/.test(o.ref)) {
      for (var f2 = 0; f2 < texts.length; f2++) {
        var p2 = flatParse(texts[f2]);
        if (
          p2 &&
          p2.ref &&
          p2.ref.replace(/^[A-Z]+-?/, '') === o.ref.replace(/^[A-Z]+-?/, '') &&
          p2.ref.replace(/-?\d.*$/, '').length >= 2
        ) {
          o.ref = p2.ref;
          break;
        }
      }
    }
    if (!o.vr) {
      for (var c = 0; c < texts.length && !o.vr; c++) {
        var cm2 = String(texts[c])
          .toUpperCase()
          .match(/(?:^|[^A-Z])C\s?(1[0-2]|[1-9])(?!\d)/);
        if (cm2) o.vr = 'C' + cm2[1];
      }
    }
    return o;
  }
  function knownPre(p) {
    if (/^(PY|SP|BR|SL|CX)$/.test(p)) return true;
    try {
      return S.items.some(function (i) {
        return String(i.ref || '').indexOf(p) === 0 && /^[A-Z]{2}$/.test(p);
      });
    } catch (e) {
      return false;
    }
  }
  function parseVote(texts) {
    var tl = { ref: {}, med: {}, vr: {} },
      fr = 0;
    texts.forEach(function (t) {
      var o = parseHaste([t]);
      if (!(o.ref || o.med || o.vr)) return;
      fr++;
      ['ref', 'med', 'vr'].forEach(function (k) {
        if (o[k]) tl[k][o[k]] = (tl[k][o[k]] || 0) + 1;
      });
    });
    function top(m) {
      var b = '',
        n = 0;
      for (var k in m)
        if (m[k] > n) {
          b = k;
          n = m[k];
        }
      return [b, n];
    }
    /* agrupa por número do código: o OCR às vezes perde uma letra do prefixo (PY-568 → V-568); vale o prefixo de 2 letras */
    var grp = {},
      k;
    for (k in tl.ref) {
      var dg = k.replace(/^[A-Z]+-?/, ''),
        G = grp[dg] || (grp[dg] = { n: 0, best: '', sc: -1 });
      G.n += tl.ref[k];
      var pl = k.replace(/-?\d.*$/, '').length,
        kp = k.replace(/-?\d.*$/, ''),
        sc = (pl === 2 ? 100 : pl === 3 ? 50 : pl) + tl.ref[k] + (knownPre(kp) ? 200 : 0);
      if (sc > G.sc) {
        G.sc = sc;
        G.best = k;
      }
    }
    var ga = '',
      gn = 0;
    for (k in grp)
      if (grp[k].n > gn) {
        gn = grp[k].n;
        ga = grp[k].best;
      }
    var a = gn ? [ga, gn] : top(tl.ref),
      b = top(tl.med),
      c = top(tl.vr);
    return { ref: a[0], nRef: a[1], med: b[0], nMed: b[1], vr: c[0], nVr: c[1], frames: fr };
  }
  /* ===== leitor: inclinação do texto ===== */
  /* ângulo (graus, eixo y para baixo) da direção das linhas de texto/escuro: perfil de projeção sobre os pontos escuros */
  function skewOf(src) {
    var sc = Math.min(1, 380 / Math.max(src.width, src.height)),
      w = Math.max(16, Math.round(src.width * sc)),
      h = Math.max(16, Math.round(src.height * sc)),
      c = mkCanvas(w, h),
      g = c.getContext('2d');
    g.drawImage(src, 0, 0, w, h);
    var d = g.getImageData(0, 0, w, h).data,
      b = mkCanvas(w, h),
      bg = b.getContext('2d');
    bg.filter = 'blur(' + Math.max(3, Math.round(Math.min(w, h) / 28)) + 'px)';
    bg.drawImage(c, 0, 0);
    var m = bg.getImageData(0, 0, w, h).data,
      xs = [],
      ys = [],
      i,
      x,
      y;
    for (y = 1; y < h - 1; y += 1)
      for (x = 1; x < w - 1; x += 1) {
        i = (y * w + x) * 4;
        var L = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11,
          M = m[i] * 0.3 + m[i + 1] * 0.59 + m[i + 2] * 0.11;
        if (M - L > 22) {
          xs.push(x);
          ys.push(y);
        }
      }
    var n = xs.length;
    if (n < 80) return 0;
    var st = Math.max(1, Math.floor(n / 12000)),
      best = 0,
      bs = -1,
      s0 = 0,
      a,
      k,
      diag = Math.ceil(Math.sqrt(w * w + h * h)) + 4,
      hist = new Float32Array(diag * 2 + 8);
    for (a = -40; a <= 40; a += 2) {
      var co = Math.cos((a * Math.PI) / 180),
        si = Math.sin((a * Math.PI) / 180);
      hist.fill(0);
      for (k = 0; k < n; k += st) {
        var yy = Math.round(ys[k] * co - xs[k] * si) + diag;
        hist[yy]++;
      }
      var sc2 = 0;
      for (k = 0; k < hist.length; k++) sc2 += hist[k] * hist[k];
      if (a === 0) s0 = sc2;
      if (sc2 > bs) {
        bs = sc2;
        best = a;
      }
    }
    return bs > s0 * 1.12 ? best : 0;
  }
  window.__prepVar = function (c, k) {
    return prepVar(c, k);
  };
  window.__getWorker = function () {
    return getWorker();
  };
  window.__rotateCanvas = function (c, d) {
    return rotateCanvas(c, d);
  };
  function rotateCanvas(src, deg) {
    if (!deg) return src;
    var r = (deg * Math.PI) / 180,
      co = Math.abs(Math.cos(r)),
      si = Math.abs(Math.sin(r)),
      W = src.width,
      H = src.height,
      nw = Math.round(W * co + H * si),
      nh = Math.round(W * si + H * co),
      c = mkCanvas(nw, nh),
      g = c.getContext('2d'),
      px = mkCanvas(1, 1),
      pg = px.getContext('2d');
    pg.drawImage(src, 0, 0, 1, 1);
    var q = pg.getImageData(0, 0, 1, 1).data;
    g.fillStyle = 'rgb(' + q[0] + ',' + q[1] + ',' + q[2] + ')';
    g.fillRect(0, 0, nw, nh);
    g.translate(nw / 2, nh / 2);
    g.rotate(r);
    g.drawImage(src, -W / 2, -H / 2);
    window.__skewOf = skewOf;
    return c;
  }
