  // ===== Estúdio (v432, aprovado 05/11/2026 12:36: "Pode implementar") =====
  // Botão Estúdio no Início: TODAS as fotos da loja saem daqui (cadastro, Inventário, Catálogo, Site e Marketing).
  // Tela do Estúdio: montagem de hoje, perfil salvo + Medir fundo, Nova peça / Sessão e a fila (sem foto, nota
  // baixa, falta a 3/4). Câmera (modo Pro): lente 1x/2x, ISO, velocidade, branco (K), foco manual e exposição
  // quando o aparelho deixa; "Fundo travado 255"; histograma, nível, moldura, avisos ao vivo, 2s e focus peaking.
  // Resultado: só o FUNDO vira 255 — a armação fica com os pixels da foto (NÃO mexe na armação); 3:2 sem esticar;
  // nota da foto; frente → 3/4 → vídeo 360 (opcional). Sem IA. Sem recortar nem apagar nada da peça.
  S.estMont = { cart: true, caixa: true, frontal: false, tripe: true };
  S.estPerfil = null; // {zoom, iso, et, k, foco, comp, nome}
  S.fotoNota = {}; // 'ref|cor' -> {n, mot:[...], ts}
  var EST_W = 1500,
    EST_H = 1000; // 3:2
  var EST_ICO = '<path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.6"/>';
  // ---------- fila ----------
  function estChaves() {
    var vis = {},
      out = [];
    S.items.forEach(function (i) {
      if (i.bulk || isSimple(i.tipo) || !(i.qty > 0)) return;
      var k = i.ref + '|' + i.cor;
      if (vis[k]) return;
      vis[k] = 1;
      out.push({ k: k, ref: i.ref, cor: i.cor });
    });
    return out;
  }
  function estFila() {
    var f = [];
    estChaves().forEach(function (x) {
      var tem = !!(S.fotos && S.fotos[x.k]),
        nt = S.fotoNota[x.k];
      if (!tem) f.push({ k: x.k, ref: x.ref, cor: x.cor, st: 'sem', o: 0, sub: 'frente e 3/4' });
      else if (nt && nt.n < 75) f.push({ k: x.k, ref: x.ref, cor: x.cor, st: 'nota', o: 1, sub: (nt.mot || []).slice(0, 2).join(' · ') || 'refazer', n: nt.n });
      else if (!(S.fotos && S.fotos[x.k + '|34'])) f.push({ k: x.k, ref: x.ref, cor: x.cor, st: '34', o: 2, sub: 'sem a de 3/4' });
    });
    // v465: primeiro as sem foto e as que mais vendem; as cores do mesmo modelo ficam juntas (fotos iguais entre si)
    var vend = {};
    (S.sales || []).forEach(function (s) {
      if (s.ref) vend[s.ref] = (vend[s.ref] || 0) + (s.qty || 1);
    });
    var ordRef = {};
    f.forEach(function (x) {
      var k = x.o * 1e6 - (vend[x.ref] || 0);
      if (ordRef[x.ref] == null || k < ordRef[x.ref]) ordRef[x.ref] = k;
    });
    return f.sort(function (a, b) {
      return ordRef[a.ref] - ordRef[b.ref] || (a.ref < b.ref ? -1 : a.ref > b.ref ? 1 : a.o - b.o);
    });
  }
  function estNoPadrao() {
    var t = 0,
      ok = 0;
    estChaves().forEach(function (x) {
      t++;
      var nt = S.fotoNota[x.k];
      if (S.fotos && S.fotos[x.k] && nt && nt.n >= 75) ok++;
    });
    return { ok: ok, t: t };
  }
  // ---------- tratamento: LUZ DE ESTÚDIO (v439) ----------
  // Luz do fundo = superfície suave (polinômio + correção por faixas) medida só no que é fundo. A foto inteira é dividida
  // por essa luz (como um flat-field de estúdio) e os níveis sobem com transição suave até 255. A peça (máscara) só serve
  // para achar o enquadramento e dar a nota.
  function estFundoModelo(d, W, H) {
    var sw = 64,
      sh = Math.max(8, Math.round((H * sw) / W)),
      c = mkCanvas(sw, sh),
      g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(d.cv, 0, 0, sw, sh);
    var p = g.getImageData(0, 0, sw, sh).data,
      n = sw * sh,
      X = [],
      lum = new Float32Array(n),
      i;
    for (i = 0; i < n; i++) lum[i] = (p[i * 4] + p[i * 4 + 1] + p[i * 4 + 2]) / 3;
    var termos = function (x, y) {
      return [1, x, y, x * x, x * y, y * y, x * x * x, x * x * y, x * y * y, y * y * y];
    };
    for (i = 0; i < n; i++) X.push(termos(((i % sw) / sw) * 2 - 1, (((i / sw) | 0) / sh) * 2 - 1));
    var ord = Array.prototype.slice.call(lum).sort(function (a, b) {
        return a - b;
      }),
      ok = [],
      cf;
    for (i = 0; i < n; i++) ok.push(lum[i] > ord[Math.floor(n * 0.3)]);
    var ajusta = function (v) {
      // mínimos quadrados (10 termos) só nos pontos de fundo
      var A = [],
        b = [],
        r,
        c2,
        k;
      for (r = 0; r < 10; r++) {
        A.push(new Float64Array(10));
        b.push(0);
      }
      for (i = 0; i < n; i++) {
        if (!ok[i]) continue;
        var t = X[i];
        for (r = 0; r < 10; r++) {
          b[r] += t[r] * v[i];
          for (c2 = 0; c2 < 10; c2++) A[r][c2] += t[r] * t[c2];
        }
      }
      for (r = 0; r < 10; r++) A[r][r] += 1e-6;
      // eliminação de Gauss
      for (k = 0; k < 10; k++) {
        var piv = k;
        for (r = k + 1; r < 10; r++) if (Math.abs(A[r][k]) > Math.abs(A[piv][k])) piv = r;
        var tA = A[k];
        A[k] = A[piv];
        A[piv] = tA;
        var tb = b[k];
        b[k] = b[piv];
        b[piv] = tb;
        for (r = k + 1; r < 10; r++) {
          var f = A[r][k] / A[k][k];
          for (c2 = k; c2 < 10; c2++) A[r][c2] -= f * A[k][c2];
          b[r] -= f * b[k];
        }
      }
      var s = new Float64Array(10);
      for (k = 9; k >= 0; k--) {
        var acc = b[k];
        for (c2 = k + 1; c2 < 10; c2++) acc -= A[k][c2] * s[c2];
        s[k] = acc / A[k][k];
      }
      return s;
    };
    for (var it = 0; it < 4; it++) {
      cf = ajusta(lum);
      for (i = 0; i < n; i++) {
        var fit = 0;
        for (var q = 0; q < 10; q++) fit += cf[q] * X[i][q];
        ok[i] = lum[i] > fit * 0.94;
      }
    }
    var ch = [0, 1, 2].map(function (cc) {
      var v = new Float32Array(n);
      for (i = 0; i < n; i++) v[i] = p[i * 4 + cc];
      return ajusta(v);
    });
    return { cf: ch, sw: sw, sh: sh, termos: termos };
  }
  function estProcessa(src) {
    var w0 = src.naturalWidth || src.videoWidth || src.width,
      h0 = src.naturalHeight || src.videoHeight || src.height,
      k = Math.min(1, 2400 / Math.max(w0, h0)),
      W = Math.round(w0 * k),
      H = Math.round(h0 * k),
      cv = mkCanvas(W, H),
      g = cv.getContext('2d', { willReadFrequently: true });
    g.drawImage(src, 0, 0, W, H);
    var im = g.getImageData(0, 0, W, H),
      a = im.data,
      N = W * H,
      M = estFundoModelo({ cv: cv }, W, H),
      bg = new Float32Array(N * 3),
      x,
      y,
      i;
    // luz do fundo por pixel (calcula numa grade e interpola)
    var gw = 48,
      gh = Math.max(8, Math.round((H * gw) / W)),
      grade = new Float32Array(gw * gh * 3);
    for (y = 0; y < gh; y++)
      for (x = 0; x < gw; x++) {
        var t = M.termos((x / (gw - 1)) * 2 - 1, (y / (gh - 1)) * 2 - 1);
        for (var c3 = 0; c3 < 3; c3++) {
          var v = 0;
          for (var q = 0; q < 10; q++) v += M.cf[c3][q] * t[q];
          grade[(y * gw + x) * 3 + c3] = v;
        }
      }
    for (y = 0; y < H; y++) {
      var gy = (y / (H - 1)) * (gh - 1),
        y0 = Math.floor(gy),
        y1 = Math.min(gh - 1, y0 + 1),
        fy = gy - y0;
      for (x = 0; x < W; x++) {
        var gx = (x / (W - 1)) * (gw - 1),
          x0 = Math.floor(gx),
          x1 = Math.min(gw - 1, x0 + 1),
          fx = gx - x0,
          o = (y * W + x) * 3;
        for (var c4 = 0; c4 < 3; c4++)
          bg[o + c4] =
            (grade[(y0 * gw + x0) * 3 + c4] * (1 - fx) + grade[(y0 * gw + x1) * 3 + c4] * fx) * (1 - fy) +
            (grade[(y1 * gw + x0) * 3 + c4] * (1 - fx) + grade[(y1 * gw + x1) * 3 + c4] * fx) * fy;
      }
    }
    // distância ao fundo (levemente suavizada para o granulado não virar "peça")
    var dist = new Float32Array(N),
      calcDist = function () {
        for (i = 0; i < N; i++) {
          var p4 = i * 4,
            p3 = i * 3;
          dist[i] = Math.max(Math.abs(a[p4] - bg[p3]), Math.abs(a[p4 + 1] - bg[p3 + 1]), Math.abs(a[p4 + 2] - bg[p3 + 2]));
        }
        return estBlur(dist, W, H, 2);
      };
    var ds = calcDist();
    // faixas do fundo que atravessam a foto (horizonte, borda do prato): corrige a luz do fundo linha a linha,
    // em 12 faixas verticais, usando só o que está longe da peça. A peça não entra na conta.
    (function () {
      // mediana por linha em cada faixa; fica de fora só o que é MUITO diferente do fundo (armação sólida, lente escura)
      var NB = 12,
        lb = Math.ceil(W / NB),
        R = new Float32Array(H * NB * 3),
        tem = new Uint8Array(H * NB),
        v0 = [],
        v1 = [],
        v2 = [],
        med = function (v) {
          v.sort(function (p, q) {
            return p - q;
          });
          return v[v.length >> 1];
        };
      for (y = 0; y < H; y++)
        for (var bnd = 0; bnd < NB; bnd++) {
          v0.length = v1.length = v2.length = 0;
          var tot = 0;
          for (x = bnd * lb; x < Math.min(W, (bnd + 1) * lb); x += 2) {
            tot++;
            var j = y * W + x;
            if (ds[j] > 45) continue;
            var o3 = j * 3,
              o4 = j * 4;
            v0.push(a[o4] / Math.max(1, bg[o3]));
            v1.push(a[o4 + 1] / Math.max(1, bg[o3 + 1]));
            v2.push(a[o4 + 2] / Math.max(1, bg[o3 + 2]));
          }
          if (v0.length > tot * 0.4) {
            var q3 = (y * NB + bnd) * 3;
            R[q3] = med(v0);
            R[q3 + 1] = med(v1);
            R[q3 + 2] = med(v2);
            tem[y * NB + bnd] = 1;
          }
        }
      // suaviza na vertical (3 linhas) para não criar degraus
      var R2 = new Float32Array(R);
      for (y = 1; y < H - 1; y++)
        for (var b2 = 0; b2 < NB; b2++)
          if (tem[y * NB + b2] && tem[(y - 1) * NB + b2] && tem[(y + 1) * NB + b2])
            for (var c6 = 0; c6 < 3; c6++) R2[(y * NB + b2) * 3 + c6] = (R[((y - 1) * NB + b2) * 3 + c6] + R[(y * NB + b2) * 3 + c6] + R[((y + 1) * NB + b2) * 3 + c6]) / 3;
      R = R2;
      // faixas sem fundo visível (atrás da peça): copia da faixa vizinha mais próxima na mesma linha
      for (y = 0; y < H; y++)
        for (var bb = 0; bb < NB; bb++) {
          if (tem[y * NB + bb]) continue;
          var melhor = -1;
          for (var dd = 1; dd < NB && melhor < 0; dd++) {
            if (bb - dd >= 0 && tem[y * NB + bb - dd]) melhor = bb - dd;
            else if (bb + dd < NB && tem[y * NB + bb + dd]) melhor = bb + dd;
          }
          var t3 = (y * NB + bb) * 3;
          if (melhor >= 0) {
            R[t3] = R[(y * NB + melhor) * 3];
            R[t3 + 1] = R[(y * NB + melhor) * 3 + 1];
            R[t3 + 2] = R[(y * NB + melhor) * 3 + 2];
          } else R[t3] = R[t3 + 1] = R[t3 + 2] = 1;
        }
      for (y = 0; y < H; y++)
        for (x = 0; x < W; x++) {
          var fb = x / lb - 0.5,
            b0 = Math.max(0, Math.min(NB - 1, Math.floor(fb))),
            b1 = Math.min(NB - 1, b0 + 1),
            fx2 = Math.max(0, Math.min(1, fb - b0)),
            o = (y * W + x) * 3;
          for (var c5 = 0; c5 < 3; c5++) bg[o + c5] *= R[(y * NB + b0) * 3 + c5] * (1 - fx2) + R[(y * NB + b1) * 3 + c5] * fx2;
        }
    })();
    ds = calcDist();
    // ruído do fundo: percentil 95 da borda
    var bord = [];
    for (x = 0; x < W; x += 3) {
      bord.push(ds[x], ds[(H - 1) * W + x]);
    }
    for (y = 0; y < H; y += 3) bord.push(ds[y * W], ds[y * W + W - 1]);
    bord.sort(function (p, q) {
      return p - q;
    });
    var ruido = bord[Math.floor(bord.length * 0.95)] || 2,
      lim = ruido + 3;
    // máscara da peça + tira pontinhos soltos (componentes pequenos) — sem mexer na peça
    var m = new Uint8Array(N);
    for (i = 0; i < N; i++) m[i] = ds[i] > lim ? 1 : 0;
    m = estFecha(m, W, H, 6);
    var lab = estComponentes(m, W, H),
      maior = 0;
    lab.tam.forEach(function (t) {
      if (t > maior) maior = t;
    });
    // caixa das partes grandes (a peça); o que é pequeno DENTRO dela fica (etiqueta, letras, parafusos);
    // só some o pontinho solto FORA da peça (poeira no fundo)
    var gx0 = W,
      gy0 = H,
      gx1 = -1,
      gy1 = -1,
      grande = Math.max(400, maior * 0.02);
    for (i = 0; i < N; i++) {
      if (!m[i] || lab.tam[lab.l[i]] < grande) continue;
      x = i % W;
      y = (i / W) | 0;
      if (x < gx0) gx0 = x;
      if (x > gx1) gx1 = x;
      if (y < gy0) gy0 = y;
      if (y > gy1) gy1 = y;
    }
    var mgx = (gx1 - gx0) * 0.03,
      mgy = (gy1 - gy0) * 0.05;
    var bx0 = W,
      by0 = H,
      bx1 = -1,
      by1 = -1;
    for (i = 0; i < N; i++) {
      if (!m[i]) continue;
      x = i % W;
      y = (i / W) | 0;
      if (lab.tam[lab.l[i]] < grande && !(x >= gx0 - mgx && x <= gx1 + mgx && y >= gy0 - mgy && y <= gy1 + mgy)) {
        m[i] = 0;
        continue;
      }
      if (x < bx0) bx0 = x;
      if (x > bx1) bx1 = x;
      if (y < by0) by0 = y;
      if (y > by1) by1 = y;
    }
    // fundo médio (para a nota)
    var fundo = 0,
      nf = 0;
    for (i = 0; i < N; i += 7)
      if (!m[i]) {
        fundo += (a[i * 4] + a[i * 4 + 1] + a[i * 4 + 2]) / 3;
        nf++;
      }
    fundo = nf ? fundo / nf : 255;
    // v439 LUZ DE ESTÚDIO (aprovada 05/11): nada é recortado. A foto inteira recebe a mesma correção de luz — divide pela luz
    // do fundo medida (corrige a luz desigual da caixa e deixa o branco neutro) e sobe os níveis com transição suave até 255.
    // A armação clareia na mesma medida do fundo, como faria mais luz de verdade: cores e transparência continuam as originais.
    var ALVO = 265,
      SH = 225,
      KS = 30,
      topo = SH + KS * (1 - Math.exp(-(ALVO - SH) / KS)),
      ganho = 255 / topo,
      LUT = new Uint8ClampedArray(1601);
    for (i = 0; i <= 1600; i++) {
      var xv = i / 2,
        yv = xv < SH ? xv : SH + KS * (1 - Math.exp(-(xv - SH) / KS));
      LUT[i] = Math.min(255, Math.round(yv * ganho));
    }
    for (i = 0; i < N; i++) {
      var q4 = i * 4,
        p3b = i * 3;
      for (var cc = 0; cc < 3; cc++) {
        var xx = (a[q4 + cc] / Math.max(8, bg[p3b + cc])) * ALVO;
        a[q4 + cc] = LUT[Math.min(1600, Math.round(xx * 2))];
      }
    }
    g.putImageData(im, 0, 0);
    var mot = [],
      n = 100;
    if (bx1 < 0) return { cv: null, n: 0, mot: ['Não achei a peça'], fundo: fundo };
    // enquadramento 3:2 SEM ESTICAR: peça no centro ocupando ~88% da largura (ou 80% da altura)
    var pw = bx1 - bx0 + 1,
      ph = by1 - by0 + 1,
      cw = Math.max(pw / 0.88, ((ph / 0.8) * 3) / 2),
      chh = (cw * 2) / 3,
      cx = (bx0 + bx1) / 2,
      cy = (by0 + by1) / 2,
      out = mkCanvas(EST_W, EST_H),
      og = out.getContext('2d'),
      esc = EST_W / cw;
    og.fillStyle = '#fff';
    og.fillRect(0, 0, EST_W, EST_H);
    og.imageSmoothingQuality = 'high';
    og.drawImage(cv, (EST_W / 2 - cx * esc), (EST_H / 2 - cy * esc), W * esc, H * esc);
    // nota
    if (fundo < 170) {
      n -= 25;
      mot.push('foto escura (pouca luz)');
    } else if (fundo < 215) {
      n -= 10;
      mot.push('fundo cinza (mais luz)');
    }
    var nit = 99;
    try {
      nit = sharpOf(cv);
    } catch (e) {}
    if (nit < 25) {
      n -= 25;
      mot.push('pouco nítida');
    }
    if (bx0 <= 2 || bx1 >= W - 3 || by0 <= 2 || by1 >= H - 3) {
      n -= 20;
      mot.push('encostando na borda');
    } else if (pw / W < 0.45) {
      n -= 10;
      mot.push('peça pequena (aproxime)');
    }
    if (pw / W > 0.96) {
      n -= 10;
      mot.push('peça apertada (afaste um palmo)');
    }
    return { cv: out, n: Math.max(0, n), mot: mot, fundo: Math.round(fundo), bbox: [bx0, by0, bx1, by1, W, H] };
  }
  function estBlur(src, W, H, r) {
    // desfoque em caixa (2 passadas) — rápido
    var tmp = new Float32Array(W * H),
      out = new Float32Array(W * H),
      x,
      y,
      s,
      d = 2 * r + 1;
    for (y = 0; y < H; y++) {
      s = 0;
      for (x = -r; x <= r; x++) s += src[y * W + Math.min(W - 1, Math.max(0, x))];
      for (x = 0; x < W; x++) {
        tmp[y * W + x] = s / d;
        s += src[y * W + Math.min(W - 1, x + r + 1)] - src[y * W + Math.max(0, x - r)];
      }
    }
    for (x = 0; x < W; x++) {
      s = 0;
      for (y = -r; y <= r; y++) s += tmp[Math.min(H - 1, Math.max(0, y)) * W + x];
      for (y = 0; y < H; y++) {
        out[y * W + x] = s / d;
        s += tmp[Math.min(H - 1, y + r + 1) * W + x] - tmp[Math.max(0, y - r) * W + x];
      }
    }
    return out;
  }
  function estFecha(m, W, H, r) {
    // fechamento (dilata e erode) para juntar partes finas da armação — não cria peça nova
    var f = Float32Array.from(m),
      d = estBlur(f, W, H, r),
      dil = new Uint8Array(W * H),
      i;
    for (i = 0; i < W * H; i++) dil[i] = d[i] > 0.001 ? 1 : 0;
    var e = estBlur(Float32Array.from(dil), W, H, r),
      out = new Uint8Array(W * H);
    for (i = 0; i < W * H; i++) out[i] = e[i] > 0.999 ? 1 : 0;
    for (i = 0; i < W * H; i++) if (m[i]) out[i] = 1;
    return out;
  }
  function estComponentes(m, W, H) {
    var l = new Int32Array(W * H),
      tam = [0],
      st = [],
      id = 0;
    for (var i = 0; i < W * H; i++) {
      if (!m[i] || l[i]) continue;
      id++;
      var n = 0;
      l[i] = id;
      st.push(i);
      while (st.length) {
        var q = st.pop(),
          x = q % W,
          y = (q / W) | 0;
        n++;
        if (x > 0 && m[q - 1] && !l[q - 1]) {
          l[q - 1] = id;
          st.push(q - 1);
        }
        if (x < W - 1 && m[q + 1] && !l[q + 1]) {
          l[q + 1] = id;
          st.push(q + 1);
        }
        if (y > 0 && m[q - W] && !l[q - W]) {
          l[q - W] = id;
          st.push(q - W);
        }
        if (y < H - 1 && m[q + W] && !l[q + W]) {
          l[q + W] = id;
          st.push(q + W);
        }
      }
      tam.push(n);
    }
    return { l: l, tam: tam };
  }
  // ---------- tela do Estúdio ----------
  function estAbre() {
    var ov = document.createElement('div');
    ov.className = 'estOv';
    ov.setAttribute('role', 'dialog');
    document.body.appendChild(ov);
    var pinta = function () {
      var F = estFila(),
        P = estNoPadrao(),
        M = S.estMont || {},
        pf = S.estPerfil;
      // v465 (aprovado 08/11): Estúdio automático — 1 botão, a fila e o resto no "?"
      var mostra = S.estTodas ? F.length : Math.min(F.length, 6);
      ov.innerHTML =
        '<div class="estHd"><h1>Estúdio</h1><div class="estHdR"><button type="button" class="estIc" data-e="ajuda" aria-label="Ajuda e ajustes do Estúdio">?</button><button type="button" class="estX" data-e="fecha" aria-label="Fechar">×</button></div></div>' +
        '<div class="estBody">' +
        '<p class="estSub">Você só tira as fotos. O app ajusta a luz, o fundo branco e o enquadramento sozinho.</p>' +
        '<button type="button" class="go estGo" data-e="sessao"' + (F.length ? '' : ' disabled') + '>' + (F.length ? 'Começar · ' + F.length + (F.length === 1 ? ' peça na fila' : ' peças na fila') : 'Nada na fila') + '</button>' +
        '<button type="button" class="estLink" data-e="nova">Peça nova, ainda sem cadastro ›</button>' +
        (F.length
          ? '<div class="estLbl estLbl2"><span>Na fila</span>' + (F.length > 6 ? '<button type="button" class="estLink" data-e="todas">' + (S.estTodas ? 'Mostrar menos' : 'Ver todas ›') + '</button>' : '') + '</div>' +
            F.slice(0, mostra).map(function (x, j) {
              var ft = S.fotos && S.fotos[x.k];
              return '<div class="estRw"><button type="button" class="estIt" data-i="' + j + '" data-ref="' + esc(x.ref) + '" data-cor="' + esc(x.cor) + '"><span class="estTh' + (ft ? '' : ' v') + '">' + (ft ? '<img src="' + esc(ft) + '" alt="">' : '') + '</span><span class="estTx"><b>' + esc(pn(x.ref)) + '</b><small>' + esc(x.cor) + ' · ' + (x.st === 'sem' ? 'sem foto' : x.st === 'nota' ? 'refazer: ' + esc(x.sub) : 'falta a foto de 3/4') + '</small></span></button><button type="button" class="estFi" data-e="ficha" data-ref="' + esc(x.ref) + '" aria-label="Ver a ficha de ' + esc(pn(x.ref)) + '">Ficha</button></div>';
            }).join('') +
            (!S.estTodas && F.length > 6 ? '<button type="button" class="estMais" data-e="todas">+ ' + (F.length - 6) + (F.length - 6 === 1 ? ' peça' : ' peças') + '</button>' : '')
          : '<div class="estOk">Todas as peças com foto no padrão ✓</div>') +
        ((S.estPend || []).length
          ? '<div class="estLbl estLbl2"><span>Fotos aguardando cadastro · ' + S.estPend.length + '</span></div>' +
            S.estPend.map(function (x) {
              return '<div class="estIt estPd"><span class="estTh"><img src="' + esc(x.t) + '" alt=""></span><span class="estTx"><b>' + (x.cod ? esc(x.cod) + ' · sem cadastro' : 'Peça sem cadastro') + '</b><small>' + new Date(x.ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + (x.t34 ? ' · frente e 3/4' : ' · frente') + ' · nota ' + x.n + '</small></span><button type="button" class="mini" data-pd="' + x.id + '" data-a="ligar">Ligar</button><button type="button" class="mini estApg" data-pd="' + x.id + '" data-a="apagar" aria-label="Apagar">×</button></div>';
            }).join('')
          : '') +
        (fpChaves().length ? '<div class="estPadr">' + fpAjHtml() + '</div>' : '') +
        '<div class="estRod">Fotos no padrão: ' + P.ok + ' de ' + P.t + '</div>' +
        '</div>';
    };
    pinta();
    ov.onclick = function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var F = estFila();
      if (b.dataset.e === 'fecha') {
        ov.remove();
        render();
        return;
      }
      if (b.dataset.e === 'ficha') { // S267: da fila direto para a ficha da peça no Inventário
        ov.remove();
        if (typeof fnAbreEstoque === 'function') fnAbreEstoque(b.dataset.ref);
        return;
      }
      if (b.dataset.mont) {
        S.estMont[b.dataset.mont] = !S.estMont[b.dataset.mont];
        saveSoon();
        return pinta();
      }
      if (b.dataset.e === 'medir') return estCam({ medir: true, titulo: 'Medir fundo', fim: pinta });
      if (b.dataset.e === 'lib') return estLibera();
      if (b.dataset.e === 'tut') return estTutorial();
      if (b.dataset.e === 'nova') return estNova(pinta);
      if (b.dataset.e === 'giro') return estGiro({ fim: pinta });
      if (b.dataset.pd) {
        var pd = (S.estPend || []).filter(function (x) { return x.id === b.dataset.pd; })[0];
        if (!pd) return;
        if (b.dataset.a === 'apagar') {
          S.estPend = S.estPend.filter(function (x) { return x !== pd; });
          idbDo('hq', 'readwrite', function (o) { o.delete('pend|' + pd.id); return o.delete('pend|' + pd.id + '|34'); }).catch(function () {});
          saveSoon();
          return pinta();
        }
        return estDestino({ pend: pd }, pinta);
      }
      if (b.dataset.e === 'todas') {
        S.estTodas = !S.estTodas;
        return pinta();
      }
      if (b.dataset.e === 'ajuda') return estAjuda(pinta);
      if (b.dataset.e === 'sessao') {
        EST_SES = { t0: Date.now(), n: 0, fotos: 0, refazer: [], total: F.length };
        return estSessao(F.slice(), 0, pinta);
      }
      if (b.dataset.i != null) {
        var x = F[+b.dataset.i];
        EST_SES = null;
        estSessao([x], 0, pinta);
      }
    };
    return ov;
  }
  // S267: fotografar UMA peça a partir da ficha do Inventário (as cores dela que ainda estão na fila); ao terminar volta para a ficha.
  function estFotografaRef(ref) {
    var F = estFila().filter(function (x) { return x.ref === ref; });
    if (!F.length) return lfToast('As fotos desta peça já estão completas');
    EST_SES = null;
    estSessao(F, 0, function () {});
  }
  // Sessão: uma peça atrás da outra (frente → 3/4), salvando na cor certa.
  var EST_SES = null; // v465: contagem da sessão para o resumo do fim
  function estSessao(lista, i, depois) {
    if (i >= lista.length) {
      if (EST_SES && lista.length > 1) estResumo(EST_SES, depois);
      else lfToast('Fotos guardadas');
      EST_SES = null;
      if (depois) depois();
      render();
      return;
    }
    var x = lista[i],
      passo = x.st === '34' ? '34' : 'frente',
      mesmas = lista.filter(function (y) {
        return y.ref === x.ref;
      }),
      ic = mesmas.indexOf(x),
      ref0 = mesmas.filter(function (y) {
        return y !== x && S.fotos && S.fotos[y.k];
      })[0];
    estCam({
      k: x.k,
      ref: x.ref,
      cor: x.cor,
      passo: passo,
      vivo: true,
      sessao: true,
      corRef: ref0 ? { cor: ref0.cor, foto: S.fotos[ref0.k] } : null,
      corTxt: mesmas.length > 1 ? 'cor ' + (ic + 1) + ' de ' + mesmas.length : '',
      titulo: (lista.length > 1 ? i + 1 + ' de ' + lista.length + ' · ' : '') + pn(x.ref) + ' · ' + x.cor,
      salva: true,
      prox: function () {
        estSessao(lista, i + 1, depois);
      },
      fim: depois
    });
  }
  // Grava a foto (frente ou 3/4) na cor e marca a nota.
  function estGrava(k, passo, R) {
    var kk = passo === '34' ? k + '|34' : k;
    vibrar(15);
    if (EST_SES) {
      EST_SES.fotos++;
      var rf = k.split('|')[0];
      if (!EST_SES.refs) EST_SES.refs = [];
      if (EST_SES.refs.indexOf(rf) < 0) EST_SES.refs.push(rf);
    }
    // v465: fica a melhor foto — se a nova for pior que a que já existe, a antiga continua (a nova fica guardada 30 dias)
    var ant = passo !== '34' && S.fotoNota[k];
    if (ant && S.fotos && S.fotos[k] && ant.n > R.n + 5) {
      if (!S.fotoReserva) S.fotoReserva = {};
      S.fotoReserva[kk] = { ts: Date.now(), n: R.n };
      lfToast('A foto anterior era melhor (nota ' + ant.n + ') e continua');
      return;
    }
    setFoto(kk, thumbOf(R.cv), R.cv.toDataURL('image/jpeg', 0.92));
    if (passo !== '34') S.fotoNota[k] = { n: R.n, mot: R.mot, ts: Date.now() };
    var ref = k.split('|')[0];
    if (S.site && S.site[ref] && typeof vitFila === 'function') vitFila(ref, 'upd');
    saveSoon();
  }
  // ---------- câmera do Estúdio ----------
  var EST_ST = null; // stream atual
  function estFechaCam() {
    if (EST_ST)
      try {
        EST_ST.getTracks().forEach(function (t) {
          t.stop();
        });
      } catch (e) {}
    EST_ST = null;
    var o = $('estCam');
    if (o) o.remove();
  }
  function estCam(ctx) {
    estFechaCam();
    var semCam = !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    if (semCam && ctx.medir) return lfToast('Medir fundo precisa da câmera');
    if (semCam)
      return camFallback(function (f) {
        estDepoisFoto(f, ctx);
      }, true, '');
    var ov = document.createElement('div');
    ov.id = 'estCam';
    ov.className = 'estCam';
    ov.innerHTML =
      '<div class="ecTop"><button type="button" class="ecPill" data-c="x" aria-label="Fechar">×</button><button type="button" class="ecPill" id="ecFundo" data-c="medir">Medir fundo</button><button type="button" class="ecPill" id="ecT2" data-c="t2">2s</button><button type="button" class="ecPill" id="ecPk" data-c="pk">Peaking</button></div>' +
      '<div class="ecVf"><video id="ecV" autoplay playsinline muted></video><canvas id="ecPkC"></canvas>' +
      '<div class="ecLvl" id="ecLvl"><span>0,0°</span></div><canvas class="ecHist" id="ecHist" width="92" height="40"></canvas>' +
      '<div class="ecMsg" id="ecMsg" hidden></div>' +
      '<div class="ecTag">' + (ctx.medir ? 'Aponte só para a cartolina e toque em Medir fundo' : (ctx.passo === '34' ? '3/4 · 2 de 2' : 'Frente · 1 de 2') + (ctx.titulo ? ' · ' + esc(ctx.titulo) : '') + (ctx.corTxt ? ' · ' + esc(ctx.corTxt) : '')) + '</div>' +
      (ctx.corRef && !ctx.medir ? '<div class="ecRef"><img src="' + esc(ctx.corRef.foto) + '" alt=""><span>Mesma posição da ' + esc(ctx.corRef.cor) + '</span></div>' : '') +
      (ctx.sessao && !ctx.medir ? '<div class="ecAuto" id="ecAuto">' + (ctx.passo === '34' ? 'Gire a peça um pouco (3/4) e deixe parada' : 'Peça de frente, centralizada e parada') + '</div>' : '') +
      '<div class="ecGd"><i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i></div>' +
      '<div class="ecChips" id="ecChips"><span data-k="fundo"><i></i>Fundo branco</span><span data-k="foco"><i></i>Foco</span><span data-k="reto"><i></i>Reto</span><span data-k="dist"><i></i>Distância</span></div></div>' +
      '<div class="ecPro" id="ecPro"></div><div class="ecDial" id="ecDial"><input type="range" id="ecR" min="0" max="100" value="50" aria-label="Ajuste"><div class="ecDv" id="ecDv"></div></div>' +
      '<div class="ecBot"><div class="ecLens" id="ecLens"><button type="button" data-z="1" class="on">1x</button><button type="button" data-z="2">2x</button></div><button type="button" class="ecSh" id="ecSh" aria-label="Fotografar"><i></i></button><button type="button" class="ecGal" data-c="gal">Galeria</button></div>';
    document.body.appendChild(ov);
    var vid = $('ecV'),
      track = null,
      cap = {},
      st = { zoom: 1, sel: 'et', t2: !!(S.estPerfil && S.estPerfil.t2), pk: false },
      P = S.estPerfil || {};
    var CTL = [
      { k: 'iso', t: 'ISO', c: 'iso', fmt: function (v) { return Math.round(v); } },
      { k: 'et', t: 'VELOC.', c: 'exposureTime', fmt: function (v) { var s = v / 10000; return s >= 1 ? s.toFixed(1).replace('.', ',') + 's' : '1/' + Math.round(1 / s); } },
      { k: 'k', t: 'BRANCO', c: 'colorTemperature', fmt: function (v) { return Math.round(v / 100) * 100 + 'K'; } },
      { k: 'foco', t: 'FOCO', c: 'focusDistance', fmt: function (v) { return v ? (Math.round(v * 100) / 100).toString().replace('.', ',') + 'm' : 'AF'; } },
      { k: 'comp', t: 'EXP.', c: 'exposureCompensation', fmt: function (v) { return (v > 0 ? '+' : '') + (Math.round(v * 10) / 10).toString().replace('.', ','); } }
    ];
    var val = {};
    // v437: na prévia a velocidade nunca passa de 1/30 s (exposição longa = câmera manda 1 imagem a cada tanto e parece travada)
    var ET_PREV = 10000 / 30;
    var etMax = function () {
      return cap.exposureTime ? Math.max(cap.exposureTime.min, Math.min(cap.exposureTime.max, ET_PREV)) : ET_PREV;
    };
    // régua da VELOC. em passos de foto (1/1000, 1/500, 1/250…), não em linha reta
    var velLista = function () {
      var r = cap.exposureTime;
      if (!r) return [];
      var mx = etMax(),
        l = [8000, 4000, 2000, 1000, 500, 250, 125, 60, 30]
          .map(function (d) {
            return 10000 / d;
          })
          .filter(function (v) {
            return v >= r.min && v <= mx + 0.01;
          });
      if (!l.length || l[0] > r.min * 1.05) l.unshift(r.min);
      return l;
    };
    var velIdx = function (v) {
      var l = velLista(),
        bi = 0;
      l.forEach(function (x, i) {
        if (Math.abs(Math.log(x / v)) < Math.abs(Math.log(l[bi] / v))) bi = i;
      });
      return bi;
    };
    var aplica = function (k2, v) {
      if (!track) return Promise.resolve();
      var c = {};
      if (k2 === 'auto') {
        // volta tudo ao automático do celular
        c.exposureMode = 'continuous';
        if (cap.whiteBalanceMode) c.whiteBalanceMode = 'continuous';
        if (cap.focusMode) c.focusMode = 'continuous';
        if (cap.exposureCompensation) c.exposureCompensation = 0;
      } else if (k2 === 'iso' || k2 === 'et') {
        c.exposureMode = 'manual';
        if (val.et != null) val.et = Math.min(val.et, etMax());
        if (cap.iso && val.iso != null) c.iso = val.iso;
        if (cap.exposureTime && val.et != null) c.exposureTime = val.et;
      } else if (k2 === 'k') {
        c.whiteBalanceMode = 'manual';
        c.colorTemperature = v;
      } else if (k2 === 'foco') {
        c.focusMode = 'manual';
        c.focusDistance = v;
      } else if (k2 === 'comp') {
        // compensação só funciona com o brilho no automático
        if (val.et == null && val.iso == null) c.exposureMode = 'continuous';
        c.exposureCompensation = v;
      }
      else if (k2 === 'zoom') c.zoom = v;
      return Promise.race([
        track.applyConstraints({ advanced: [c] }).then(
          function () {
            return true;
          },
          function () {
            return false;
          }
        ),
        new Promise(function (ok) {
          setTimeout(function () {
            ok(false);
          }, 1500);
        })
      ]);
    };
    var proHtml = function () {
      $('ecPro').innerHTML = CTL.map(function (c) {
        var tem = !!cap[c.c];
        return '<button type="button" class="' + (st.sel === c.k ? 'sel' : '') + (tem ? '' : ' na') + '" data-p="' + c.k + '"' + (tem ? '' : ' disabled') + '>' + c.t + '<b>' + (tem && val[c.k] != null ? c.fmt(val[c.k]) : tem ? 'auto' : '—') + '</b></button>';
      }).join('');
      var C = CTL.filter(function (c) { return c.k === st.sel; })[0],
        r = cap[C && C.c],
        R = $('ecR');
      $('ecDial').style.visibility = r ? '' : 'hidden';
      if (r && st.sel === 'et') {
        var L = velLista(),
          cur = val.et != null ? val.et : L[L.length - 1];
        R.min = 0;
        R.max = Math.max(1, L.length - 1);
        R.step = 1;
        R.value = velIdx(cur);
        $('ecDv').textContent = C.fmt(cur);
      } else if (r) {
        R.min = r.min;
        R.max = r.max;
        R.step = r.step || (r.max - r.min) / 100;
        R.value = val[st.sel] != null ? val[st.sel] : (r.min + r.max) / 2;
        $('ecDv').textContent = C.fmt(+R.value);
      }
    };
    $('ecR').oninput = function () {
      var v = +this.value;
      if (st.sel === 'et') {
        var L = velLista();
        v = L[Math.max(0, Math.min(L.length - 1, Math.round(v)))];
      }
      val[st.sel] = v;
      var C = CTL.filter(function (c) { return c.k === st.sel; })[0];
      $('ecDv').textContent = C.fmt(v);
      st.pend = [st.sel, v];
      if (!st.reg)
        st.reg = setTimeout(function vai() {
          var pp = st.pend;
          st.pend = null;
          if (!pp) return (st.reg = null);
          aplica(pp[0], pp[1]).then(function () {
            st.reg = setTimeout(vai, 150);
          });
        }, 0);
      clearTimeout(st.tp);
      st.tp = setTimeout(proHtml, 300);
    };
    var lente = function (z) {
      st.zoom = z;
      [].forEach.call($('ecLens').children, function (b) {
        b.classList.toggle('on', +b.dataset.z === z);
      });
      if (cap.zoom) aplica('zoom', Math.min(cap.zoom.max, Math.max(cap.zoom.min, z)));
      vid.style.transform = !cap.zoom && z > 1 ? 'scale(' + z + ')' : '';
    };
    // abre a câmera em resolução alta
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30, max: 30 } } })
      .then(function (s) {
        if (!ov.isConnected) return s.getTracks().forEach(function (t) { t.stop(); });
        EST_ST = s;
        ctx.vivo = true;
        vid.srcObject = s;
        track = s.getVideoTracks()[0];
        try {
          cap = (track.getCapabilities && track.getCapabilities()) || {};
        } catch (e) {
          cap = {};
        }
        // perfil salvo
        // perfil antigo (antes da v437) podia ter velocidade longa travada (imagem branca): descarta e volta ao automático
        if (P && P.salvo && P.v !== 2) {
          S.estPerfil = P = null;
          saveSoon();
        }
        if (P && P.salvo) {
          ['iso', 'et', 'k', 'foco', 'comp'].forEach(function (k2) {
            if (P[k2] != null) val[k2] = P[k2];
          });
          if (val.et != null || val.iso != null) aplica('et', val.et);
          if (val.k != null) aplica('k', val.k);
          if (val.foco != null) aplica('foco', val.foco);
          if (val.comp != null) aplica('comp', val.comp);
          st.travado = true;
          $('ecFundo').classList.add('on');
        }
        if (!cap[CTL[1].c]) st.sel = CTL.filter(function (c) { return cap[c.c]; }).map(function (c) { return c.k; })[0] || 'et';
        lente(P && P.zoom ? P.zoom : 1);
        proHtml();
        st.t0 = Date.now();
      })
      .catch(function () {
        estFechaCam();
        if (ctx.medir) {
          lfToast('Não consegui abrir a câmera');
          if (ctx.fim) ctx.fim();
          return;
        }
        camFallback(function (f) {
          estDepoisFoto(f, ctx);
        }, true, '');
      });
    if (ctx.medir) {
      // só medir: no lugar do disparo, "Pronto"
      var shB = $('ecSh');
      shB.outerHTML = '<button type="button" class="go ecPronto" data-c="x">Pronto</button>';
      var gl = ov.querySelector('.ecGal');
      if (gl) gl.style.visibility = 'hidden';
    }
    $('ecT2').classList.toggle('on', st.t2);
    // nível (reto)
    var gama = null,
      ori = function (e) {
        if (e && e.gamma != null) gama = e.beta > 45 ? e.gamma : null;
      };
    window.addEventListener('deviceorientation', ori);
    // análise ao vivo: histograma, fundo, foco, distância, peaking
    var an = document.createElement('canvas'),
      LOOP = setInterval(function () {
        if (!ov.isConnected) {
          clearInterval(LOOP);
          window.removeEventListener('deviceorientation', ori);
          return;
        }
        var vw = vid.videoWidth,
          vh = vid.videoHeight;
        if (!vw || st.medindo || document.hidden) return;
        var Wd = 96,
          Hd = Math.round((Wd * vh) / vw);
        an.width = Wd;
        an.height = Hd;
        var x2 = an.getContext('2d', { willReadFrequently: true });
        x2.drawImage(vid, 0, 0, Wd, Hd);
        var d = x2.getImageData(0, 0, Wd, Hd).data,
          hist = new Uint32Array(64),
          bf = 0,
          nb = 0,
          minX = Wd,
          maxX = -1,
          i,
          x,
          y;
        for (i = 0; i < Wd * Hd; i++) {
          var l = (d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11) | 0;
          hist[l >> 2]++;
          x = i % Wd;
          y = (i / Wd) | 0;
          if (x < 6 || x > Wd - 7 || y < 6 || y > Hd - 7) {
            bf += l;
            nb++;
          }
        }
        bf /= nb || 1;
        for (y = 4; y < Hd - 4; y++)
          for (x = 4; x < Wd - 4; x++) {
            var q = (y * Wd + x) * 4;
            if (bf - (d[q] * 0.3 + d[q + 1] * 0.59 + d[q + 2] * 0.11) > 40) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
            }
          }
        // histograma
        var hc = $('ecHist'),
          hx = hc.getContext('2d'),
          mx = 1;
        for (i = 0; i < 64; i++) if (hist[i] > mx) mx = hist[i];
        hx.clearRect(0, 0, 92, 40);
        hx.fillStyle = 'rgba(255,255,255,.75)';
        for (i = 0; i < 64; i++) {
          var hh = Math.sqrt(hist[i] / mx) * 36;
          hx.fillRect((i * 92) / 64, 40 - hh, 92 / 64 + 0.4, hh);
        }
        hx.fillStyle = '#2fe08f';
        hx.fillRect(Math.min(91, (bf / 255) * 92), 0, 1.5, 40);
        // foco (nitidez no centro)
        var nit = 0;
        try {
          nit = sharpOf(an);
        } catch (e) {}
        var ok = {
          fundo: bf >= 235,
          foco: nit > 18,
          reto: gama == null ? true : Math.abs(gama) < 1.5,
          dist: maxX > 0 && (maxX - minX) / Wd > 0.55 && (maxX - minX) / Wd < 0.93 && minX > 3 && maxX < Wd - 4
        };
        [].forEach.call($('ecChips').children, function (sp) {
          sp.classList.toggle('ok', !!ok[sp.dataset.k]);
        });
        var lv = $('ecLvl');
        lv.style.display = gama == null ? 'none' : '';
        if (gama != null) {
          lv.style.transform = 'translateX(-50%) rotate(' + -gama + 'deg)';
          lv.classList.toggle('ok', Math.abs(gama) < 1.5);
          lv.firstChild.textContent = (Math.round(gama * 10) / 10).toString().replace('.', ',') + '°';
        }
        st.bf = bf;
        // v465: dispara sozinho quando a peça fica parada e certinha (~1 s); o botão e o volume continuam valendo
        if (ctx.sessao && !ctx.medir && !st.medindo) {
          var mov = 0;
          if (st.ant && st.ant.length === d.length) {
            for (i = 0; i < d.length; i += 16) mov += Math.abs(d[i] - st.ant[i]);
            mov /= d.length / 16;
          } else mov = 99;
          st.ant = new Uint8ClampedArray(d);
          var tudo = ok.fundo && ok.foco && ok.reto && ok.dist && mov < 3.5,
            sh0 = $('ecSh'),
            au = $('ecAuto');
          st.parado = tudo ? (st.parado || 0) + 1 : 0;
          if (sh0) sh0.style.setProperty('--p', Math.min(1, st.parado / 3));
          if (sh0) sh0.classList.toggle('auto', st.parado > 0);
          if (au) au.textContent = tudo ? 'Parado… tirando sozinho' : !ok.dist ? 'Aproxime ou afaste até a peça caber na moldura' : !ok.foco ? 'Esperando o foco' : !ok.fundo ? 'Fundo escuro: aproxime a luz' : mov >= 3.5 ? 'Deixe a peça parada' : 'Peça de frente, centralizada e parada';
          if (au) au.classList.toggle('ok', tudo);
          if (st.parado >= 3 && !st.autoFoi && typeof dispara === 'function') {
            st.autoFoi = true;
            vibrar(10);
            dispara();
          }
        }
        // peça estourada: muito branco puro no meio da imagem com o fundo travado
        var nc = 0,
          ncl = 0;
        for (y = (Hd * 0.2) | 0; y < Hd * 0.8; y++)
          for (x = (Wd * 0.2) | 0; x < Wd * 0.8; x++) {
            var q2 = (y * Wd + x) * 4;
            nc++;
            if (d[q2] >= 252 && d[q2 + 1] >= 252 && d[q2 + 2] >= 252) ncl++;
          }
        var est = ncl / (nc || 1),
          m3 = $('ecMsg');
        if (st.travado && !st.menu && m3) {
          if (est > 0.03 && m3.dataset.t !== 'est') msgHtml('<button type="button" class="ecMsgB" data-c="corrige">Peça estourada · toque para corrigir</button>', 'warn', 'est');
          else if (est < 0.01 && m3.dataset.t === 'est') msg('');
        }
      }, 500);
    // peaking: só quando ligado, leve (imagem pequena) e fora do desenho da tela
    var PK = setInterval(function () {
      if (!ov.isConnected) return clearInterval(PK);
      if (st.pk && !st.medindo && !document.hidden) (window.requestIdleCallback || setTimeout)(function () { estPeaking(vid, $('ecPkC')); });
    }, 400);
    // brilho do fundo AGORA (borda do quadro), para o Medir fundo não depender do ciclo
    var fundoAgora = function () {
      var c = document.createElement('canvas');
      c.width = 64;
      c.height = 36;
      var g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(vid, 0, 0, 64, 36);
      var d = g.getImageData(0, 0, 64, 36).data,
        s2 = 0,
        n = 0,
        r = 0,
        bb = 0,
        cen = [],
        clip = 0;
      for (var y = 0; y < 36; y++)
        for (var x = 0; x < 64; x++) {
          var i = (y * 64 + x) * 4,
            lu = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11;
          if (d[i] >= 252 && d[i + 1] >= 252 && d[i + 2] >= 252) clip++;
          if (!(x < 5 || x > 58 || y < 4 || y > 31)) {
            cen.push(lu);
            continue;
          }
          s2 += lu;
          r += d[i];
          bb += d[i + 2];
          n++;
        }
      // v437: o centro também conta (a borda costuma ser mais escura); 75% mais claro do centro = cartolina, mesmo com a peça
      cen.sort(function (a, b) {
        return a - b;
      });
      var pc = cen.length ? cen[(cen.length * 0.75) | 0] : 0;
      return { l: Math.max(s2 / n, pc), borda: s2 / n, centro: pc, clip: clip / (64 * 36), rb: (r - bb) / n };
    };
    // mensagens no topo da câmera (texto simples ou com botões)
    var msg = function (t, tipo) {
      var m = $('ecMsg');
      if (!m) return;
      m.hidden = !t;
      m.className = 'ecMsg' + (tipo ? ' ' + tipo : '');
      m.textContent = t || '';
      m.dataset.t = '';
    };
    var msgHtml = function (h, tipo, t) {
      var m = $('ecMsg');
      if (!m) return;
      m.hidden = false;
      m.className = 'ecMsg' + (tipo ? ' ' + tipo : '');
      m.innerHTML = h;
      m.dataset.t = t || '';
    };
    // câmera pronta = vídeo rodando há ~1 s com imagem (antes disso a medida sai errada)
    var pronta = function () {
      return !!track && vid.readyState >= 2 && vid.videoWidth > 0 && !vid.paused && Date.now() - (st.t0 || Date.now()) > 1000;
    };
    var BOTAO = setInterval(function () {
      if (!ov.isConnected) return clearInterval(BOTAO);
      var b = $('ecFundo');
      if (!b || st.medindo) return;
      var ok = pronta();
      // v465: sem perfil medido, a primeira foto da sessão mede o fundo sozinha
      if (ok && ctx.sessao && !S.estPerfil && !st.autoMed && typeof medir === 'function') {
        st.autoMed = true;
        msg('Ajustando a luz e o fundo…', 'ok');
        medir();
      }
      b.disabled = !ok;
      if (!ok) b.textContent = 'Abrindo câmera…';
      else if (b.textContent === 'Abrindo câmera…') b.textContent = S.estPerfil && S.estPerfil.salvo && st.travado ? 'Fundo travado 255' : 'Medir fundo';
    }, 250);
    // Medir fundo (v437): mira a cartolina em ~225 (a foto final sai 255 pelo tratamento, sem mexer na armação),
    // mede borda + centro, não deixa estourar, usa o brilho AUTOMÁTICO + compensação (EXP.);
    // manual só se o celular não tiver compensação. Nunca trava: cada ajuste tem 1,5 s de limite e o todo 9 s.
    var medir = function () {
      var b = $('ecFundo');
      if (st.medindo) return;
      if (!pronta()) return msg('Espere a câmera abrir', 'warn');
      var temEv = !!cap.exposureCompensation,
        temExp = !temEv && !!cap.exposureTime;
      if (!temExp && !temEv) {
        msg('Seu celular não deixa o app mudar o brilho. Use mais luz ou o ☀️ da câmera do celular.', 'bad');
        return;
      }
      st.medindo = true;
      st.menu = false;
      b.disabled = true;
      var m0 = fundoAgora(),
        antes = m0.l,
        passos = 0,
        MAXP = 5,
        alvo = 225,
        mudou = false,
        cfg = {},
        acabou = false,
        forte = false;
      try {
        cfg = track.getSettings() || {};
      } catch (e) {}
      var limite = setTimeout(function () {
        fim(true);
      }, 9000);
      var espera = function (ms) {
        return new Promise(function (ok) {
          setTimeout(ok, ms);
        });
      };
      var bom = function (m) {
        return Math.abs(alvo - m.l) <= 8 && m.clip < 0.01;
      };
      var tenta = function () {
        if (acabou || !ov.isConnected) return;
        passos++;
        var m = fundoAgora(),
          bf = m.l;
        st.bf = bf;
        b.textContent = 'Medindo… ' + Math.min(passos, MAXP) + '/' + MAXP;
        msg('Fundo ' + Math.round(antes) + ' → ' + Math.round(bf) + ' …');
        if (bom(m) || passos > MAXP) return fim(false);
        // estourado (branco puro) = não dá para saber o quanto: escurece 1 ponto de cada vez
        var fator = m.clip >= 0.01 && bf >= alvo - 8 ? 0.5 : Math.max(0.25, Math.min(4, alvo / Math.max(bf, 8)));
        var depois = function (ms) {
          return espera(ms).then(function () {
            if (Math.abs(fundoAgora().l - bf) >= 2) mudou = true;
            tenta();
          });
        };
        if (temEv) {
          var c0 = val.comp != null ? val.comp : cfg.exposureCompensation || 0,
            stp = cap.exposureCompensation.step || 1 / 3;
          val.comp = Math.max(cap.exposureCompensation.min, Math.min(cap.exposureCompensation.max, Math.round((c0 + Math.log(fator) / Math.LN2) / stp) * stp));
          // o automático do celular leva um tempo para assentar
          aplica('comp', val.comp).then(function () {
            return depois(700);
          });
        } else {
          var et0 = val.et != null ? val.et : Math.min(cfg.exposureTime || 10000 / 60, etMax());
          if (cap.iso && val.iso == null) val.iso = cap.iso.min;
          var et1 = Math.max(cap.exposureTime.min, Math.min(etMax(), et0 * fator));
          // precisa escurecer e já está na velocidade mínima: luz forte demais para o manual
          if (fator < 1 && et0 <= cap.exposureTime.min * 1.01) {
            forte = true;
            return fim(false);
          }
          val.et = et1;
          aplica('et', val.et).then(function () {
            return depois(400);
          });
        }
      };
      var fim = function (demorou) {
        if (acabou) return;
        acabou = true;
        clearTimeout(limite);
        st.medindo = false;
        b.disabled = false;
        if (forte) {
          // volta ao automático e avisa
          val.iso = val.et = val.comp = null;
          aplica('auto');
          S.estPerfil = null;
          saveSoon();
          st.travado = false;
          b.textContent = 'Medir fundo';
          b.classList.remove('on');
          proHtml();
          msg('Luz forte demais para o manual · usando automático', 'warn');
          return;
        }
        var md = fundoAgora(),
          dep = md.l;
        st.bf = dep;
        var noMax = (temExp && val.et >= etMax() * 0.98) || (temEv && val.comp >= cap.exposureCompensation.max - 0.01);
        if (!mudou && Math.abs(dep - antes) < 3 && Math.abs(alvo - antes) > 8) {
          b.textContent = 'Medir fundo';
          msg(noMax ? 'A câmera já está no máximo de brilho e o fundo continua ' + Math.round(dep) + '. Falta luz no fundo.' : 'O celular não aceitou o ajuste de brilho. Use mais luz ou o ☀️ da câmera do celular.', 'bad');
          return;
        }
        // branco neutro (um passo, proporcional)
        if (cap.colorTemperature) {
          var rb = md.rb,
            kAtual = val.k != null ? val.k : cfg.colorTemperature || 5500;
          if (Math.abs(rb) > 3) {
            val.k = Math.max(cap.colorTemperature.min, Math.min(cap.colorTemperature.max, Math.round(kAtual * (1 - Math.max(-0.15, Math.min(0.15, rb / 255))))));
            aplica('k', val.k);
          } else val.k = kAtual;
        }
        S.estPerfil = { v: 2, salvo: true, nome: 'Caixa de luz', zoom: st.zoom, iso: val.iso, et: val.et, k: val.k, foco: val.foco, comp: val.comp, t2: st.t2, ts: Date.now() };
        saveSoon();
        st.travado = true;
        b.textContent = 'Fundo travado 255';
        b.classList.add('on');
        proHtml();
        var ok2 = dep >= 205 && md.clip < 0.01,
          claro = md.clip >= 0.01;
        msg(
          'Fundo ' + Math.round(antes) + ' → ' + Math.round(dep) + (ok2 ? ' ✓ pronto · a foto final sai 255' : claro ? ' · ainda estourado: diminua a luz' : ' · no máximo possível: falta luz no fundo') + (demorou ? ' (o celular demorou a responder)' : ''),
          ok2 ? 'ok' : 'warn'
        );
      };
      // começa do automático (descarta velocidade travada de antes)
      if (temEv) {
        val.iso = val.et = null;
        if (val.comp == null) val.comp = cfg.exposureCompensation || 0;
        aplica('comp', val.comp).then(function () {
          return espera(500);
        }).then(tenta);
      } else tenta();
    };
    // menu do "Fundo travado": medir de novo ou voltar ao automático
    var menuFundo = function () {
      st.menu = true;
      msgHtml('<button type="button" class="ecMsgB" data-c="remedir">Medir de novo</button><button type="button" class="ecMsgB" data-c="auto">Voltar ao automático</button>', '', 'menu');
    };
    var voltaAuto = function () {
      st.menu = false;
      val.iso = val.et = val.comp = val.k = val.foco = null;
      aplica('auto');
      S.estPerfil = null;
      saveSoon();
      st.travado = false;
      var b = $('ecFundo');
      b.textContent = 'Medir fundo';
      b.classList.remove('on');
      proHtml();
      msg('Câmera no automático', 'ok');
    };
    // peça estourada: escurece um passo e guarda no perfil
    var corrige = function () {
      if (val.et != null && cap.exposureTime) {
        val.et = Math.max(cap.exposureTime.min, val.et * 0.7);
        aplica('et', val.et);
      } else if (cap.exposureCompensation) {
        var stp = cap.exposureCompensation.step || 1 / 3;
        val.comp = Math.max(cap.exposureCompensation.min, Math.round(((val.comp || 0) - 0.5) / stp) * stp);
        aplica('comp', val.comp);
      }
      if (S.estPerfil) {
        S.estPerfil.et = val.et;
        S.estPerfil.comp = val.comp;
        saveSoon();
      }
      proHtml();
      msg('Escureci um pouco', 'ok');
    };
    var dispara = function () {
      var sh = $('ecSh');
      if (sh.disabled) return;
      sh.disabled = true;
      var go = function () {
        var pega =
          window.ImageCapture && track
            ? (function () {
                var ic = new ImageCapture(track);
                return (ic.getPhotoCapabilities ? ic.getPhotoCapabilities() : Promise.reject())
                  .then(function (pc) {
                    return ic.takePhoto(pc && pc.imageWidth ? { imageWidth: pc.imageWidth.max, imageHeight: pc.imageHeight.max } : undefined);
                  })
                  .catch(function () {
                    return ic.takePhoto();
                  })
                  .catch(function () {
                    return null;
                  });
              })()
            : Promise.resolve(null);
        pega.then(function (bl) {
          if (bl) return bl;
          // sem ImageCapture: quadro do vídeo na resolução máxima do vídeo
          var c = document.createElement('canvas');
          c.width = vid.videoWidth;
          c.height = vid.videoHeight;
          var g = c.getContext('2d');
          if (st.zoom > 1 && !cap.zoom) {
            var z = st.zoom,
              sw = c.width / z,
              sh2 = c.height / z;
            g.drawImage(vid, (c.width - sw) / 2, (c.height - sh2) / 2, sw, sh2, 0, 0, c.width, c.height);
          } else g.drawImage(vid, 0, 0);
          return new Promise(function (ok) {
            c.toBlob(ok, 'image/jpeg', 0.95);
          });
        }).then(function (bl) {
          estFechaCam();
          if (!bl) return lfToast('Não consegui fotografar');
          estDepoisFoto(new File([bl], 'estudio.jpg', { type: 'image/jpeg' }), ctx);
        });
      };
      if (st.t2) {
        var n = 2,
          tg = ov.querySelector('.ecTag'),
          t0 = tg.textContent;
        tg.textContent = '2';
        var iv = setInterval(function () {
          n--;
          if (n <= 0) {
            clearInterval(iv);
            tg.textContent = t0;
            go();
          } else tg.textContent = String(n);
        }, 1000);
      } else go();
    };
    ov.onclick = function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.id === 'ecSh') return dispara();
      if (b.dataset.z) return lente(+b.dataset.z);
      if (b.dataset.p) {
        st.sel = b.dataset.p;
        return proHtml();
      }
      var c = b.dataset.c;
      if (c === 'x') {
        estFechaCam();
        if (ctx.fim) ctx.fim();
        return;
      }
      if (c === 'medir') {
        if (st.medindo) return;
        if (st.travado) return st.menu ? ((st.menu = false), msg('')) : menuFundo();
        return medir();
      }
      if (c === 'remedir') {
        st.menu = false;
        msg('');
        return medir();
      }
      if (c === 'auto') return voltaAuto();
      if (c === 'corrige') return corrige();
      if (c === 't2') {
        st.t2 = !st.t2;
        b.classList.toggle('on', st.t2);
        if (S.estPerfil) {
          S.estPerfil.t2 = st.t2;
          saveSoon();
        }
        return;
      }
      if (c === 'pk') {
        st.pk = !st.pk;
        b.classList.toggle('on', st.pk);
        var pc = $('ecPkC');
        if (!st.pk) pc.getContext('2d').clearRect(0, 0, pc.width, pc.height);
        return;
      }
      if (c === 'gal') {
        var inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = 'image/*';
        inp.onchange = function () {
          var f = inp.files && inp.files[0];
          if (!f) return;
          estFechaCam();
          estDepoisFoto(f, ctx);
        };
        inp.click();
      }
    };
    // botão de volume do celular dispara (quando o aparelho entrega a tecla ao app)
    var tecla = function (e) {
      if (!ov.isConnected) return document.removeEventListener('keydown', tecla);
      if (e.key === 'AudioVolumeUp' || e.key === 'AudioVolumeDown' || e.keyCode === 24 || e.keyCode === 25) {
        e.preventDefault();
        dispara();
      }
    };
    document.addEventListener('keydown', tecla);
  }
  // focus peaking: contorna em verde o que está nítido
  function estPeaking(vid, pc) {
    var r = vid.getBoundingClientRect(),
      W = 180,
      H = Math.round((W * vid.videoHeight) / vid.videoWidth);
    pc.width = W;
    pc.height = H;
    var g = pc.getContext('2d', { willReadFrequently: true });
    g.drawImage(vid, 0, 0, W, H);
    var im = g.getImageData(0, 0, W, H),
      d = im.data,
      o = g.createImageData(W, H),
      od = o.data;
    for (var y = 1; y < H - 1; y++)
      for (var x = 1; x < W - 1; x++) {
        var i = (y * W + x) * 4,
          l = d[i + 1],
          gx = d[i + 5] - d[i - 3],
          gy = d[i + W * 4 + 1] - d[i - W * 4 + 1];
        if (gx * gx + gy * gy > 1600) {
          od[i] = 47;
          od[i + 1] = 224;
          od[i + 2] = 143;
          od[i + 3] = 230;
        }
      }
    g.clearRect(0, 0, W, H);
    g.putImageData(o, 0, 0);
  }
  // ---------- resultado ----------
  function estDepoisFoto(f, ctx) {
    loadMsg(true, 'Preparando a foto');
    fpArqImg(f)
      .then(function (im) {
        setTimeout(function () {
          var R;
          try {
            R = estProcessa(im);
          } catch (e) {
            R = { cv: null, n: 0, mot: ['erro ao tratar'] };
          }
          loadMsg(false);
          estResultado(R, f, ctx);
        }, 30);
      })
      .catch(function () {
        loadMsg(false);
        lfToast('Não consegui abrir a foto');
      });
  }
  function estResultado(R, f, ctx) {
    // v465: na sessão, foto aprovada (nota 75+) segue sozinha, sem tela no meio; foto ruim mostra o porquê e pede de novo
    if (ctx.sessao && R.cv && R.n >= 75 && !ctx.nova && !ctx.corOk) {
      // v465 (Estúdio extra 3): confere a cor — só quando a cor já tem foto; na dúvida fica quieto; nunca trava
      return estCorConfere(R.cv, ctx).then(function (outra) {
        if (!outra) return estResultado(R, f, Object.assign({}, ctx, { corOk: true }));
        lfaAbre('estCorF', '<div class="estCorT">Parece a ' + esc(outra) + ', não a ' + esc(ctx.cor) + '</div><div class="estCorB"><button type="button" class="go" data-act="estCor" data-id="outra">Salvar na ' + esc(outra) + '</button><button type="button" class="mini" data-act="estCor" data-id="manter">Manter na ' + esc(ctx.cor) + '</button></div>');
        ACT.estCor = function (q) {
          lfaFecha('estCorF');
          if (q === 'outra') {
            var k2 = ctx.ref + '|' + outra;
            estResultado(R, f, Object.assign({}, ctx, { k: k2, cor: outra, corOk: true }));
          } else estResultado(R, f, Object.assign({}, ctx, { corOk: true }));
        };
      });
    }
    if (ctx.sessao && R.cv && R.n >= 75 && !ctx.nova) {
      var passoA = ctx.passo || 'frente';
      if (passoA === 'frente') {
        if (ctx.k) estGrava(ctx.k, 'frente', R);
        estBarra('✓ Frente salva · agora a 3/4');
        return setTimeout(function () {
          estCam(Object.assign({}, ctx, { passo: '34', salva: true, done: null }));
        }, 450);
      }
      if (ctx.k) estGrava(ctx.k, '34', R);
      if (EST_SES) EST_SES.n++;
      estBarra('Fotos salvas ✓', [
        ['Gravar vídeo 360', function () {
          estVideo360(ctx, null);
        }],
        ['Refazer', function () {
          estCam(Object.assign({}, ctx, { passo: 'frente' }));
        }]
      ], function () {
        render();
        if (ctx.prox) ctx.prox();
        else if (ctx.fim) ctx.fim();
      });
      return;
    }
    if (ctx.sessao && EST_SES && R.n < 75) EST_SES.refazer.push((R.mot || [])[0] || 'nota baixa');
    var ov = document.createElement('div');
    ov.className = 'estOv estRes';
    ov.id = 'estRes';
    document.body.appendChild(ov);
    var passo = ctx.passo || 'frente',
      ok = !!R.cv && R.n >= 60,
      cor = R.n >= 75 ? 'var(--ok)' : R.n >= 60 ? 'var(--warn)' : 'var(--bad)',
      tem34 = !!ctx.k || !!ctx.nova;
    ov.innerHTML =
      '<div class="estHd"><h1 style="font-size:22px">' + esc(ctx.titulo || 'Foto da peça') + '</h1><button type="button" class="estX" data-r="x" aria-label="Fechar">×</button></div>' +
      '<div class="estBody">' +
      (tem34 ? '<div class="estSeq"><span class="' + (passo === 'frente' ? 'at' : 'ok') + '">' + (passo === 'frente' ? 'Frente' : '✓ Frente') + '</span><span class="' + (passo === '34' ? 'at' : '') + '">3/4</span><span>Vídeo 360 (opcional)</span></div>' : '') +
      '<div class="estImg">' + (R.cv ? '<img id="estImg" alt="">' : '<div class="hint" style="padding:30px;text-align:center">Não achei a peça na foto</div>') + '</div>' +
      '<section class="estCard"><div class="estNota"><div class="estRing" style="--p:' + R.n + ';--c:' + cor + '"><b>' + R.n + '</b></div><div><b>' + (R.n >= 75 ? 'Foto aprovada' : R.n >= 60 ? 'Dá para usar' : 'Melhor tirar de novo') + '</b><small>' + (R.mot.length ? esc(R.mot.join(' · ')) : 'Fundo 255 · armação sem alteração · 3:2 sem esticar · nítida') + '</small></div></div></section>' +
      '<section class="estCard"><div class="estLbl">Vai para</div><div class="estDest">' + ['Cadastro da cor', 'Inventário', 'Catálogo', 'Site', 'Marketing', 'Nota no Estúdio'].map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div></section>' +
      '<div class="estBtns">' + (R.cv ? '<button type="button" class="go" data-r="usar">' + (passo === 'frente' && tem34 ? 'Usar e fazer a 3/4 ›' : passo === '34' ? 'Usar' + (ctx.prox ? ' e ir para a próxima ›' : '') : 'Usar esta foto') + '</button>' : '') +
      (passo === '34' ? '<button type="button" class="mini" data-r="video">Gravar vídeo 360 (opcional)</button>' : '') +
      '<button type="button" class="mini" data-r="de-novo">Tirar de novo</button></div></div>';
    if (R.cv) $('estImg').src = R.cv.toDataURL('image/jpeg', 0.9);
    ov.onclick = function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var r = b.dataset.r;
      if (r === 'x') {
        ov.remove();
        if (ctx.fim) ctx.fim();
        render();
        return;
      }
      if (r === 'de-novo') {
        ov.remove();
        return estCam(ctx);
      }
      if (r === 'video') {
        ov.remove();
        return estVideo360(ctx, R);
      }
      if (r === 'usar') {
        ov.remove();
        if (ctx.nova) {
          // Nova peça: guarda e segue (frente → 3/4 → "De qual peça é?")
          ctx.fotos = ctx.fotos || {};
          ctx.fotos[passo] = R;
          if (passo === 'frente' && ctx.vivo)
            return setTimeout(function () {
              estCam(Object.assign({}, ctx, { passo: '34' }));
            }, 350);
          return estDestino(ctx, ctx.fim);
        }
        if (passo === 'frente') {
          if (ctx.salva && ctx.k) estGrava(ctx.k, 'frente', R);
          if (ctx.done) {
            if (ctx.k) S.fotoNota[ctx.k] = { n: R.n, mot: R.mot, ts: Date.now() };
            fpCvArq(R.cv).then(function (nf) {
              ctx.done(nf, { padrao: true, nota: R.n });
            });
          }
          if (ctx.k && ctx.vivo)
            return setTimeout(function () {
              estCam(Object.assign({}, ctx, { passo: '34', salva: true, done: null }));
            }, 350);
          render();
          return;
        }
        if (passo === '34' && ctx.k) {
          estGrava(ctx.k, '34', R);
          lfToast('Fotos guardadas');
        }
        render();
        if (ctx.prox) ctx.prox();
        else if (ctx.fim) ctx.fim();
      }
    };
  }
  // vídeo 360 no prato (opcional): grava 12 s pela câmera e oferece enviar/usar no Marketing
  function estVideo360(ctx, R) {
    if (R && R.cv && ctx.k) estGrava(ctx.k, '34', R);
    if (ctx.nova) {
      ctx.fotos = ctx.fotos || {};
      if (R && R.cv) ctx.fotos['34'] = R;
      ctx.prox = function () {
        estDestino(ctx, ctx.fim);
      };
    }
    if (!(navigator.mediaDevices && window.MediaRecorder)) {
      lfToast('Este aparelho não grava vídeo pelo app');
      if (ctx.prox) ctx.prox();
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } } }).then(function (s) {
      var ov = document.createElement('div');
      ov.className = 'estCam';
      ov.innerHTML = '<div class="ecVf" style="top:0;bottom:0"><video autoplay playsinline muted></video><div class="ecTag">Ligue o prato · gravando 12 s</div></div>';
      document.body.appendChild(ov);
      var v = ov.querySelector('video');
      v.srcObject = s;
      var tipos = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm'],
        mt = tipos.filter(function (t) { return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t); })[0] || '',
        rec = new MediaRecorder(s, mt ? { mimeType: mt, videoBitsPerSecond: 8000000 } : undefined),
        ch = [];
      rec.ondataavailable = function (e) {
        if (e.data && e.data.size) ch.push(e.data);
      };
      rec.onstop = function () {
        s.getTracks().forEach(function (t) { t.stop(); });
        ov.remove();
        var bl = new Blob(ch, { type: mt || 'video/webm' }),
          f = new File([bl], 'lafouch-360.' + (/mp4/.test(bl.type) ? 'mp4' : 'webm'), { type: bl.type });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [f] })) navigator.share({ files: [f] }).catch(function () {});
        else {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(bl);
          a.download = f.name;
          a.click();
        }
        if (ctx.prox) ctx.prox();
        else render();
      };
      rec.start(500);
      var n = 12,
        tg = ov.querySelector('.ecTag'),
        iv = setInterval(function () {
          n--;
          tg.textContent = 'Gravando · ' + n + ' s';
          if (n <= 0) {
            clearInterval(iv);
            rec.stop();
          }
        }, 1000);
    }).catch(function () {
      lfToast('Não consegui abrir a câmera');
      if (ctx.prox) ctx.prox();
    });
  }
  // ---------- Nova peça: câmera direto; no fim "De qual peça é?" ----------
  S.estPend = []; // fotos aguardando cadastro: {id, ts, t (miniatura), t34, n}
  function estNova(depois) {
    estCam({ nova: true, passo: 'frente', titulo: 'Antes de cadastrar', fim: depois });
  }
  function estDestino(ctx, depois) {
    var ov = document.createElement('div');
    ov.className = 'estOv';
    ov.id = 'estDest';
    document.body.appendChild(ov);
    var F = ctx.fotos || {},
      fr = F.frente,
      pd = ctx.pend,
      th = fr ? thumbOf(fr.cv) : pd ? pd.t : '';
    ov.innerHTML =
      '<div class="estHd"><h1 style="font-size:22px">De qual peça é?</h1><button type="button" class="estX" data-d="x" aria-label="Fechar">×</button></div><div class="estBody">' +
      '<div class="estImg" style="max-width:320px;margin:0 auto"><img src="' + esc(th) + '" alt=""></div>' +
      (pd ? '' : '<button type="button" class="mini estNc" data-d="pend">Ainda não cadastrada · Aguardando cadastro</button>') +
      '<section class="estCard" id="estParec" hidden></section>' +
      '<input class="in" id="estBusca" placeholder="Código ou nome do modelo" autocomplete="off">' +
      '<section class="estCard" id="estLista"></section>' +
      '</div>';
    var lista = function (q) {
      q = String(q || '').toLowerCase().trim();
      var vis = {},
        l = [];
      S.items.forEach(function (i) {
        if (i.bulk || isSimple(i.tipo)) return;
        var k = i.ref + '|' + i.cor;
        if (vis[k]) return;
        vis[k] = 1;
        var nm = (pn(i.ref) + ' ' + i.ref + ' ' + i.cor).toLowerCase();
        if (!q || nm.indexOf(q) >= 0) l.push({ k: k, ref: i.ref, cor: i.cor });
      });
      $('estLista').innerHTML = l.length
        ? l.slice(0, 30).map(function (x) {
            var ft = S.fotos && S.fotos[x.k];
            return '<button type="button" class="estIt" data-k="' + esc(x.k) + '"><span class="estTh' + (ft ? '' : ' v') + '">' + (ft ? '<img src="' + esc(ft) + '" alt="">' : 'sem foto') + '</span><span class="estTx"><b>' + esc(pn(x.ref)) + ' · ' + esc(x.cor) + '</b><small>' + esc(x.ref) + (ft ? ' · a foto atual será trocada' : '') + '</small></span><span>›</span></button>';
          }).join('')
        : '<div class="hint" style="margin:0">Nenhum modelo com esse código ou nome.</div>';
    };
    lista('');
    $('estBusca').oninput = function () {
      lista(this.value);
    };
    // v442: mesmo identificador do Adicionar — "Mais parecidas" pela foto (só acima de 80%)
    if (fr && fr.cv && typeof fmRank === 'function')
      fmRank(fr.cv)
        .then(function (rk) {
          var el = $('estParec');
          if (!el || !rk || !rk.length) return;
          el.hidden = false;
          el.innerHTML =
            '<div class="estLbl">Mais parecidas</div>' +
            rk.slice(0, 3).map(function (r) {
              var k = r.ref + '|' + r.cor;
              return '<button type="button" class="estIt" data-k="' + esc(k) + '"><span class="estTh"><img src="' + esc(r.foto) + '" alt=""></span><span class="estTx"><b>' + esc(pn(r.ref)) + ' · ' + esc(r.cor) + '</b><small>' + esc(r.ref) + ' · a foto atual será trocada</small></span><b class="estPct">' + Math.round(r.score * 100) + '%</b></button>';
            }).join('');
        })
        .catch(function () {});
    // v465 (Estúdio extra 8): lê o código da haste na foto e já procura o modelo; se não existe, guarda o código junto
    var codLido = '';
    if (fr && fr.cv && !pd && typeof readTess === 'function')
      readTess(fr.cv)
        .then(function (r) {
          var cod = r && r.referencia ? String(r.referencia).toUpperCase() : '';
          if (!cod || !ov.isConnected) return;
          codLido = cod;
          var existe = S.items.some(function (i) {
              return i.ref === cod;
            }),
            bx = document.createElement('div');
          bx.className = 'estCod';
          bx.innerHTML = '<small>Li na haste</small><b>' + esc(cod) + (r.medidas ? ' · ' + esc(r.medidas) : '') + '</b><span>' + (existe ? 'Já cadastrada: escolha a cor abaixo' : 'Ainda não cadastrada · guarde as fotos e o código vai junto') + '</span>';
          var bs = $('estBusca');
          if (bs) {
            bs.parentNode.insertBefore(bx, bs);
            if (existe) {
              bs.value = cod;
              lista(cod);
            }
          }
          var nc = ov.querySelector('.estNc');
          if (nc && !existe) {
            nc.textContent = 'Guardar com o código ' + cod + ' · cadastrar depois';
            nc.classList.add('go');
          }
        })
        .catch(function () {});
    var termina = function (msg) {
      ov.remove();
      saveSoon();
      render();
      if (msg) lfToast(msg);
      if (!pd && ctx.vivo !== undefined) return estNova(depois); // próxima peça, até tocar em ×
      if (depois) depois();
    };
    ov.onclick = function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.d === 'x') {
        ov.remove();
        if (depois) depois();
        return;
      }
      if (b.dataset.d === 'pend') {
        var id = 'p' + Date.now().toString(36);
        S.estPend = (S.estPend || []).concat([{ id: id, ts: Date.now(), t: thumbOf(fr.cv), t34: F['34'] ? thumbOf(F['34'].cv) : '', n: fr.n, giro: !!ctx.giro, cod: codLido || '' }]);
        idbDo('hq', 'readwrite', function (o) {
          if (ctx.giro) o.put(ctx.giro, 'pend|' + id + '|giro');
          if (F['34']) o.put(F['34'].cv.toDataURL('image/jpeg', 0.92), 'pend|' + id + '|34');
          return o.put(fr.cv.toDataURL('image/jpeg', 0.92), 'pend|' + id);
        }).catch(function () {});
        return termina('Fotos guardadas no Estúdio');
      }
      if (b.dataset.k) {
        var k = b.dataset.k;
        if (fr) {
          estGrava(k, 'frente', fr);
          if (F['34']) estGrava(k, '34', F['34']);
          if (ctx.giro && typeof estGiroGuarda === 'function') estGiroGuarda(k, ctx.giro);
          return termina('Fotos de ' + pn(k.split('|')[0]) + ' guardadas');
        }
        // ligar fotos que estavam aguardando cadastro
        var hq = function (key) {
          return idbDo('hq', 'readonly', function (o) {
            return o.get(key);
          }).catch(function () {
            return null;
          });
        };
        Promise.all([hq('pend|' + pd.id), hq('pend|' + pd.id + '|34')]).then(function (r) {
          setFoto(k, pd.t, r[0] || pd.t);
          S.fotoNota[k] = { n: pd.n, mot: [], ts: Date.now() };
          if (pd.t34) setFoto(k + '|34', pd.t34, r[1] || pd.t34);
          var ref = k.split('|')[0];
          if (S.site && S.site[ref] && typeof vitFila === 'function') vitFila(ref, 'upd');
          S.estPend = S.estPend.filter(function (x) {
            return x !== pd;
          });
          idbDo('hq', 'readwrite', function (o) {
            o.delete('pend|' + pd.id);
            return o.delete('pend|' + pd.id + '|34');
          }).catch(function () {});
          termina('Fotos ligadas a ' + pn(ref));
        });
      }
    };
  }
  function estLibera() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) return lfToast('Este aparelho não deixa o app usar a câmera');
    loadMsg(true, 'Conferindo a câmera');
    var lim = function (r, f) {
      return r ? (f ? f(r.min) + ' a ' + f(r.max) : r.min + ' a ' + r.max) : '';
    };
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' } } })
      .then(function (s) {
        var t = s.getVideoTracks()[0],
          c = {};
        try {
          c = (t.getCapabilities && t.getCapabilities()) || {};
        } catch (e) {}
        var foto = window.ImageCapture ? new ImageCapture(t).getPhotoCapabilities().catch(function () { return null; }) : Promise.resolve(null);
        return Promise.all([foto, navigator.mediaDevices.enumerateDevices().catch(function () { return []; })]).then(function (r) {
          s.getTracks().forEach(function (x) {
            x.stop();
          });
          loadMsg(false);
          var pc = r[0],
            cams = (r[1] || []).filter(function (d) {
              return d.kind === 'videoinput';
            }).length,
            L = [
              ['Brilho por tempo de exposição (velocidade)', !!c.exposureTime, lim(c.exposureTime, function (v) { return v >= 10000 ? v / 10000 + 's' : '1/' + Math.round(10000 / v); })],
              ['Brilho por exposição (+EV)', !!c.exposureCompensation, lim(c.exposureCompensation)],
              ['ISO', !!c.iso, lim(c.iso)],
              ['Branco (temperatura K)', !!c.colorTemperature, lim(c.colorTemperature)],
              ['Foco manual', !!c.focusDistance, ''],
              ['Zoom da câmera (lente 2x)', !!(c.zoom && c.zoom.max >= 2), c.zoom ? 'até ' + c.zoom.max + 'x' : ''],
              ['Foto na resolução máxima', !!(pc && pc.imageWidth), pc && pc.imageWidth ? pc.imageWidth.max + '×' + pc.imageHeight.max : ''],
              ['Câmeras que o app enxerga', cams > 1, String(cams)]
            ],
            medirOk = !!(c.exposureTime || c.exposureCompensation);
          lfJanela({
            titulo: 'O que meu celular libera',
            monta: function (cc) {
              cc.innerHTML =
                '<div class="estLibL">' + L.map(function (x) {
                  return '<div><span class="' + (x[1] ? 'ok' : 'no') + '">' + (x[1] ? '✓' : '✗') + '</span><b>' + x[0] + '</b><small>' + esc(x[2] || (x[1] ? 'liberado' : 'bloqueado pelo celular')) + '</small></div>';
                }).join('') + '</div>' +
                '<div class="note ' + (medirOk ? 'n-ok' : 'n-warn') + '" style="margin-top:10px">' + (medirOk ? 'O Medir fundo funciona neste celular.' : 'Este celular não deixa o app controlar o brilho: o Medir fundo não consegue ajustar. Dá para resolver com um componente nativo (APK novo).') + '</div>';
            }
          });
        });
      })
      .catch(function () {
        loadMsg(false);
        lfToast('Não consegui abrir a câmera');
      });
  }
  // ---------- Como fotografar: guia (o que cada botão faz) + vídeo sem som ----------
  var EST_GUIA = {
    est: [
      ['Tela do Estúdio', [
        ['● Tripé', '', 'Montagem de hoje', 'Toque para marcar o que já está montado. É só um lembrete.'],
        ['Perfil', '', 'Perfil', 'Os ajustes da câmera que você mediu (brilho, branco, lente). Abre pronto da próxima vez.'],
        ['Medir fundo', '', 'Medir fundo', 'Abre a câmera para deixar a cartolina branca e travar o brilho. Faça 1× por sessão.'],
        ['libera ›', '', 'O que meu celular libera', 'Mostra quais controles da câmera o seu celular deixa usar.'],
        ['Antes de cadastrar', 'go', 'Fotografar antes de cadastrar', 'Dia de fotos: frente → 3/4 → "De qual peça é?". Já existe → a foto vai para a peça; nova → fica em Adicionar › Aguardando cadastro.'],
        ['Sessão ›', '', 'Sessão', 'Fotografa a fila inteira, uma peça atrás da outra.'],
        ['nota 62', '', 'Fila de fotos', 'Peças sem foto, com nota baixa ou faltando a 3/4. Toque para fotografar.'],
        ['Ligar', '', 'Fotos aguardando cadastro', 'Fotos de peças sem cadastro. Ligar = escolher o modelo; × = apagar.']
      ]]
    ],
    cam: [
      ['Topo', [
        ['Fundo travado', 'on', 'Medir fundo', 'Mede a cartolina e trava o brilho. Rosa = travado. Mostra o antes → depois.'],
        ['2s', '', '2s', 'Espera 2 segundos depois do toque: a foto não treme.'],
        ['Peaking', '', 'Peaking', 'Contorna de verde o que está em foco.'],
        ['×', '', 'Fechar', 'Sai da câmera sem fotografar.']
      ]],
      ['Na imagem', [
        ['', 'dot', 'Avisos', 'Fundo branco · Foco · Reto · Distância. Fotografe com os 4 verdes.'],
        ['▁▃█', '', 'Histograma', 'O pico encostado na direita = fundo branco.'],
        ['0,0°', '', 'Nível', 'Linha verde = celular reto.'],
        ['⌜ ⌝', '', 'Moldura', 'A peça inteira dentro, com folga dos lados.']
      ]],
      ['Embaixo', [
        ['ISO', '', 'ISO', 'Sensibilidade. Quanto mais baixo, menos granulado. No Estúdio, deixe baixo.'],
        ['VELOC.', '', 'Velocidade', 'Tempo que a câmera capta luz. Mais lenta (1/30, 1/15) = mais clara; precisa de tripé e 2s.'],
        ['BRANCO', '', 'Branco (K)', 'Cor da luz. Deixa o fundo sem puxar para azul ou amarelo.'],
        ['FOCO', '', 'Foco', 'Auto ou manual. No manual, use o Peaking para conferir.'],
        ['EXP.', '', 'Exposição (+EV)', 'Clareia ou escurece a foto inteira.'],
        ['régua', '', 'Régua', 'Toque num ajuste e arraste. "auto" = o celular decide; "—" = bloqueado pelo celular.'],
        ['1x 2x', '', 'Lente', '2x deforma menos a armação. Use quando a peça couber.'],
        ['◯', '', 'Disparo', 'Tira a foto na resolução máxima do celular.'],
        ['Galeria', '', 'Galeria', 'Usa uma foto que já está no celular.']
      ]]
    ],
    dep: [
      ['Depois da foto', [
        ['92', '', 'Nota', '75 ou mais = foto aprovada. Abaixo, aparece o motivo (pouca luz, encostando, pequena…).'],
        ['Usar', 'go', 'Usar', 'Guarda a foto e segue para a 3/4 (ou a próxima peça).'],
        ['de novo', '', 'Tirar de novo', 'Volta para a câmera.'],
        ['360', '', 'Vídeo 360 (opcional)', 'Grava 12 s da peça girando no prato, para o Marketing.'],
        ['De qual?', '', 'De qual peça é?', 'Escolha o modelo e a cor, ou "Ainda não cadastrada" para guardar no Estúdio.'],
        ['255', '', 'O que o app faz na foto', 'Só o fundo vira branco 255. A armação não é alterada. Formato 3:2, sem esticar.']
      ]]
    ]
  };
  var EST_PASSOS = [[4, '1 · Monte o estúdio'], [13, '2 · Meça o fundo'], [25, '3 · Posicione a peça'], [36, '4 · Fotografe'], [43, '5 · Confira a nota'], [51, '6 · Faça a 3/4'], [58, '7 · Escolha a peça'], [66, 'Dicas']];
  function estTutorial() {
    lfJanela({
      titulo: 'Como fotografar',
      cls: 'estGuiaJn',
      monta: function (c) {
        var aba = 'est';
        var lista = function (grupos) {
          return grupos.map(function (g) {
            return '<div class="egG">' + g[0] + '</div>' + g[1].map(function (x) {
              return '<div class="egIt"><span class="egIc ' + x[1] + '">' + (x[1] === 'dot' ? '<i></i>' : esc(x[0])) + '</span><div><b>' + esc(x[2]) + '</b><small>' + esc(x[3]) + '</small></div></div>';
            }).join('');
          }).join('');
        };
        var pinta = function () {
          var h = '<div class="hint" style="margin:0 0 10px">O que cada botão faz · vídeo no fim</div><div class="egTabs">' +
            [['est', 'Estúdio'], ['cam', 'Câmera'], ['dep', 'Depois'], ['vid', '▶ Vídeo']].map(function (t) {
              return '<button type="button" data-t="' + t[0] + '" class="' + (aba === t[0] ? 'on' : '') + '">' + t[1] + '</button>';
            }).join('') + '</div>';
          if (aba !== 'vid') h += lista(EST_GUIA[aba]);
          else
            h += '<video class="egVid" id="egVid" src="estudio-tutorial.mp4" muted playsinline controls preload="metadata"></video><div class="egG">No vídeo · toque para pular</div>' +
              EST_PASSOS.map(function (p) {
                return '<button type="button" class="egIt egPs" data-s="' + p[0] + '"><span class="egIc">' + Math.floor(p[0] / 60) + ':' + ('0' + (p[0] % 60)).slice(-2) + '</span><div><b>' + p[1] + '</b></div></button>';
              }).join('');
          c.innerHTML = h;
          var v = $('egVid');
          if (v) {
            v.muted = true;
            v.onerror = function () {
              // APK antigo: o vídeo ainda não veio com o app → busca no site
              if (!v._alt) {
                v._alt = 1;
                v.src = UPD_URL + 'estudio-tutorial.mp4';
              }
            };
            v.play().catch(function () {});
          }
        };
        pinta();
        c.onclick = function (e) {
          var b = e.target.closest('button');
          if (!b) return;
          if (b.dataset.t) {
            aba = b.dataset.t;
            return pinta();
          }
          if (b.dataset.s) {
            var v = $('egVid');
            if (v) {
              v.currentTime = +b.dataset.s;
              v.play().catch(function () {});
            }
          }
        };
      }
    });
  }
  ACT.estAbre = function () {
    estAbre();
  };
  // Botão Estúdio no Início
  ICO_D.est = EST_ICO;
  if (INI_PADRAO.indexOf('est') < 0) INI_PADRAO.splice(3, 0, 'est');
  if (INI_TODOS.indexOf('est') < 0) INI_TODOS.push('est');
  // v465: barra que aparece embaixo por um instante (com ações opcionais) e segue sozinha
  function estBarra(txt, acoes, depois) {
    var b = document.createElement('div'),
      feito = false;
    b.className = 'estBarra';
    b.innerHTML = '<b>' + esc(txt) + '</b>' + (acoes || []).map(function (a, i) {
      return '<button type="button" data-b="' + i + '">' + esc(a[0]) + '</button>';
    }).join('');
    document.body.appendChild(b);
    var segue = function (fn) {
      if (feito) return;
      feito = true;
      b.classList.add('sai');
      setTimeout(function () {
        b.remove();
      }, 260);
      if (fn) fn();
      else if (depois) depois();
    };
    b.onclick = function (e) {
      var x = e.target.closest('[data-b]');
      if (x) segue(acoes[+x.dataset.b][1]);
    };
    setTimeout(function () {
      segue();
    }, acoes && acoes.length ? 2600 : 900);
  }
  // v465: resumo no fim da sessão
  function estResumo(r, depois) {
    var min = Math.max(1, Math.round((Date.now() - r.t0) / 60000)),
      h =
        '<div class="estResT">Sessão concluída</div><div class="estResS">' + r.n + (r.n === 1 ? ' peça' : ' peças') + ' · ' + r.fotos + (r.fotos === 1 ? ' foto' : ' fotos') + ' · ' + min + ' min</div>' +
        '<div class="estResL"><span>Já no catálogo e no site<small>as fotos novas entraram sozinhas</small></span><b class="ok">✓</b></div>' +
        (r.refazer.length ? '<div class="estResL"><span>' + r.refazer.length + ' para refazer<small>' + esc(r.refazer.slice(0, 3).join(' · ')) + '</small></span><b>›</b></div>' : '') +
        // v465 (Estúdio extra 7): posts prontos com as peças desta sessão (Marketing monta com nome e preço)
        ((r.refs || []).length && typeof mkCria === 'function'
          ? '<div class="estResP">Posts prontos com ' + (r.refs.length === 1 ? 'a peça nova' : 'as ' + Math.min(r.refs.length, 4) + ' peças novas') + '</div><div class="estResB"><button type="button" class="go" data-act="estPost" data-id="status">Status do WhatsApp</button><button type="button" class="mini" data-act="estPost" data-id="post">Instagram</button></div>'
          : '') +
        '<button type="button" class="estResX" data-act="estResFecha">Fechar</button>';
    lfaAbre('estResF', h);
    ACT.estResFecha = function () {
      lfaFecha('estResF');
      if (depois) depois();
    };
    ACT.estPost = function (fmt) {
      lfaFecha('estResF');
      [].forEach.call(document.querySelectorAll('.estOv'), function (x) {
        x.remove();
      });
      setTimeout(function () {
        mkCria(fmt === 'post' ? 'post' : 'status', (r.refs || []).slice(0, 4));
      }, 260);
    };
  }
  // v465: o "?" do Estúdio — tudo o que antes ficava na tela (montagem, medir fundo, o que o celular libera, giro, guia)
  function estAjuda(pinta) {
    var M = S.estMont || {},
      pf = S.estPerfil,
      h =
        '<div class="estAjT"><span>ESTÚDIO</span></div>' +
        '<button type="button" class="estAjL" data-act="estAj" data-id="tut"><span>Como fotografar<small>vídeo curto e o que cada coisa faz</small></span><i>›</i></button>' +
        '<div class="estAjG">Montagem<small>o app avisa sozinho se algo estiver errado</small></div><div class="estChk">' +
        [['cart', 'Cartolina em curva'], ['caixa', 'Luz da caixa'], ['frontal', 'Luz frontal'], ['tripe', 'Tripé']].map(function (x) {
          return '<button type="button" class="' + (M[x[0]] ? 'on' : '') + '" data-act="estAj" data-id="m:' + x[0] + '"><i></i>' + x[1] + '</button>';
        }).join('') + '</div>' +
        '<button type="button" class="estAjL" data-act="estAj" data-id="medir"><span>Medir o fundo de novo<small>' + (pf ? 'medido · ' + esc(pf.nome || 'Caixa de luz') : 'o app mede sozinho na primeira foto') + '</small></span><i>›</i></button>' +
        '<button type="button" class="estAjL" data-act="estAj" data-id="giro"><span>Vídeo 360 (giro)<small>frente + 3/4 + vídeo no prato</small></span><i>›</i></button>' +
        '<button type="button" class="estAjL" data-act="estAj" data-id="lib"><span>O que meu celular libera<small>controles da câmera deste aparelho</small></span><i>›</i></button>';
    lfaAbre('estAjF', h);
    ACT.estAj = function (id) {
      if (id.indexOf('m:') === 0) {
        var k = id.slice(2);
        S.estMont[k] = !S.estMont[k];
        saveSoon();
        return estAjuda(pinta);
      }
      lfaFecha('estAjF');
      setTimeout(function () {
        if (id === 'tut') estTutorial();
        else if (id === 'medir') estCam({ medir: true, titulo: 'Medir fundo', fim: pinta });
        else if (id === 'giro') estGiro({ fim: pinta });
        else if (id === 'lib') estLibera();
      }, 240);
    };
  }
  // v465: cor média da peça (o que não é fundo branco) para conferir a cor
  function estCorMedia(src) {
    var c = document.createElement('canvas'),
      W = 64,
      H = Math.max(1, Math.round((64 * (src.height || 1)) / (src.width || 1)));
    c.width = W;
    c.height = H;
    var g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(src, 0, 0, W, H);
    var d = g.getImageData(0, 0, W, H).data,
      r = 0,
      gg = 0,
      b = 0,
      n = 0;
    for (var i = 0; i < d.length; i += 4) {
      var l = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11;
      if (l < 225) {
        r += d[i];
        gg += d[i + 1];
        b += d[i + 2];
        n++;
      }
    }
    return n > 20 ? [r / n, gg / n, b / n] : null;
  }
  function estImgDe(url) {
    return new Promise(function (ok) {
      var im = new Image();
      im.onload = function () {
        ok(im);
      };
      im.onerror = function () {
        ok(null);
      };
      im.src = url;
    });
  }
  // Devolve o nome de outra cor do mesmo modelo que parece MUITO mais com a foto, ou null.
  function estCorConfere(cv, ctx) {
    if (!ctx.k || !ctx.ref || !(S.fotos && S.fotos[ctx.k])) return Promise.resolve(null);
    var outras = estChaves().filter(function (x) {
      return x.ref === ctx.ref && x.k !== ctx.k && S.fotos && S.fotos[x.k];
    });
    if (!outras.length) return Promise.resolve(null);
    var nova = estCorMedia(cv);
    if (!nova) return Promise.resolve(null);
    var dist = function (a, b) {
      return a && b ? Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)) : 1e9;
    };
    return Promise.all([estImgDe(S.fotos[ctx.k])].concat(outras.map(function (x) {
      return estImgDe(S.fotos[x.k]);
    }))).then(function (ims) {
      var dEla = dist(nova, ims[0] ? estCorMedia(ims[0]) : null),
        melhor = null,
        dm = 1e9;
      outras.forEach(function (x, i) {
        var d = dist(nova, ims[i + 1] ? estCorMedia(ims[i + 1]) : null);
        if (d < dm) {
          dm = d;
          melhor = x.cor;
        }
      });
      // margem grande: a outra cor tem de estar MUITO mais perto (metade da distância) e a própria bem longe
      return melhor && dEla > 40 && dm < dEla * 0.5 ? melhor : null;
    }).catch(function () {
      return null;
    });
  }
