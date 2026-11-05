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
    return f.sort(function (a, b) {
      return a.o - b.o;
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
  // ---------- tratamento: só o fundo vira 255 ----------
  // Luz do fundo = superfície suave (polinômio) medida só no que é fundo. A peça é o que difere do fundo além do
  // ruído medido; ela fica com os pixels ORIGINAIS. O fundo vira 255 com 1px de suavização na borda.
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
    // 1px de suavização na borda (anti-serrilhado) e composição: peça original, fundo 255
    var al = estBlur(Float32Array.from(m), W, H, 1);
    for (i = 0; i < N; i++) {
      var aa = al[i],
        q4 = i * 4;
      a[q4] = a[q4] * aa + 255 * (1 - aa);
      a[q4 + 1] = a[q4 + 1] * aa + 255 * (1 - aa);
      a[q4 + 2] = a[q4 + 2] * aa + 255 * (1 - aa);
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
      ov.innerHTML =
        '<div class="estHd"><h1>Estúdio</h1><button type="button" class="estX" data-e="fecha" aria-label="Fechar">×</button></div>' +
        '<div class="estBody">' +
        '<section class="estCard"><div class="estLbl">Montagem de hoje</div><div class="estChk">' +
        [['cart', 'Cartolina em curva'], ['caixa', 'Luz da caixa'], ['frontal', 'Luz frontal'], ['tripe', 'Tripé']].map(function (x) {
          return '<button type="button" class="' + (M[x[0]] ? 'on' : '') + '" data-mont="' + x[0] + '"><i></i>' + x[1] + '</button>';
        }).join('') +
        '</div><div class="estRow"><div class="mini estPf">' + (pf ? 'Perfil: ' + esc(pf.nome || 'Caixa de luz') + (pf.zoom > 1.5 ? ' · 2x' : ' · 1x') : 'Sem perfil: meça o fundo') + '</div><button type="button" class="mini" data-e="medir">Medir fundo</button></div></section>' +
        '<div class="estRow estAc"><button type="button" class="go" data-e="nova">Nova peça</button><button type="button" class="mini estSes" data-e="sessao"' + (F.length ? '' : ' disabled') + '>Sessão: ' + F.length + (F.length === 1 ? ' peça' : ' peças') + ' ›</button></div>' +
        '<section class="estCard"><div class="estLbl">Fila de fotos · ' + F.length + '</div>' +
        (F.length
          ? F.slice(0, 40).map(function (x, j) {
              var ft = S.fotos && S.fotos[x.k];
              return '<button type="button" class="estIt" data-i="' + j + '"><span class="estTh' + (ft ? '' : ' v') + '">' + (ft ? '<img src="' + esc(ft) + '" alt="">' : 'sem foto') + '</span><span class="estTx"><b>' + esc(pn(x.ref)) + ' · ' + esc(x.cor) + '</b><small>' + esc(x.sub) + '</small></span><span class="estTag t' + x.o + '">' + (x.st === 'sem' ? 'sem foto' : x.st === 'nota' ? 'nota ' + x.n : 'falta 3/4') + '</span></button>';
            }).join('') + (F.length > 40 ? '<div class="hint" style="margin:6px 0 0">e mais ' + (F.length - 40) + '…</div>' : '')
          : '<div class="note n-ok">Todas as peças com foto no padrão.</div>') +
        '</section>' +
        '<section class="estCard"><div class="estLbl">Catálogo</div><div class="estRow" style="justify-content:space-between"><span>Fotos no padrão</span><b style="color:var(--ok)">' + P.ok + ' de ' + P.t + '</b></div></section>' +
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
      if (b.dataset.mont) {
        S.estMont[b.dataset.mont] = !S.estMont[b.dataset.mont];
        saveSoon();
        return pinta();
      }
      if (b.dataset.e === 'medir') return estCam({ medir: true, depois: pinta });
      if (b.dataset.e === 'nova') {
        ov.remove();
        setView('novo');
        return;
      }
      if (b.dataset.e === 'sessao') return estSessao(F.slice(), 0, pinta);
      if (b.dataset.i != null) {
        var x = F[+b.dataset.i];
        estSessao([x], 0, pinta);
      }
    };
    return ov;
  }
  // Sessão: uma peça atrás da outra (frente → 3/4), salvando na cor certa.
  function estSessao(lista, i, depois) {
    if (i >= lista.length) {
      lfToast('Sessão concluída');
      if (depois) depois();
      render();
      return;
    }
    var x = lista[i],
      passo = x.st === '34' ? '34' : 'frente';
    estCam({
      k: x.k,
      ref: x.ref,
      cor: x.cor,
      passo: passo,
      titulo: pn(x.ref) + ' · ' + x.cor,
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
      '<div class="ecTag">' + (ctx.medir ? 'Medir fundo: só a cartolina na tela' : (ctx.passo === '34' ? '3/4 · 2 de 2' : 'Frente · 1 de 2') + (ctx.titulo ? ' · ' + esc(ctx.titulo) : '')) + '</div>' +
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
    var aplica = function (k2, v) {
      if (!track) return Promise.resolve();
      var c = {};
      if (k2 === 'iso' || k2 === 'et') {
        c.exposureMode = 'manual';
        if (cap.iso && val.iso != null) c.iso = val.iso;
        if (cap.exposureTime && val.et != null) c.exposureTime = val.et;
      } else if (k2 === 'k') {
        c.whiteBalanceMode = 'manual';
        c.colorTemperature = v;
      } else if (k2 === 'foco') {
        c.focusMode = 'manual';
        c.focusDistance = v;
      } else if (k2 === 'comp') c.exposureCompensation = v;
      else if (k2 === 'zoom') c.zoom = v;
      return track.applyConstraints({ advanced: [c] }).catch(function () {});
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
      if (r) {
        R.min = r.min;
        R.max = r.max;
        R.step = r.step || (r.max - r.min) / 100;
        R.value = val[st.sel] != null ? val[st.sel] : (r.min + r.max) / 2;
        $('ecDv').textContent = C.fmt(+R.value);
      }
    };
    $('ecR').oninput = function () {
      var v = +this.value;
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
        if (P && P.salvo) {
          ['iso', 'et', 'k', 'foco', 'comp'].forEach(function (k2) {
            if (P[k2] != null) val[k2] = P[k2];
          });
          if (val.et != null || val.iso != null) aplica('et', val.et);
          if (val.k != null) aplica('k', val.k);
          if (val.foco != null) aplica('foco', val.foco);
          if (val.comp != null) aplica('comp', val.comp);
          $('ecFundo').textContent = 'Fundo travado 255';
          $('ecFundo').classList.add('on');
        }
        if (!cap[CTL[1].c]) st.sel = CTL.filter(function (c) { return cap[c.c]; }).map(function (c) { return c.k; })[0] || 'et';
        lente(P && P.zoom ? P.zoom : 1);
        proHtml();
        if (ctx.medir) setTimeout(medir, 600);
      })
      .catch(function () {
        estFechaCam();
        camFallback(function (f) {
          estDepoisFoto(f, ctx);
        }, true, '');
      });
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
        bb = 0;
      for (var y = 0; y < 36; y++)
        for (var x = 0; x < 64; x++) {
          if (!(x < 5 || x > 58 || y < 4 || y > 31)) continue;
          var i = (y * 64 + x) * 4;
          s2 += d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11;
          r += d[i];
          bb += d[i + 2];
          n++;
        }
      return { l: s2 / n, rb: (r - bb) / n };
    };
    // Medir fundo: ajusta exposição/ISO/branco até o fundo ficar branco e trava (salva no perfil)
    var medir = function () {
      var b = $('ecFundo');
      if (st.medindo || !track) return;
      st.medindo = true;
      b.textContent = 'Medindo…';
      var passos = 0,
        alvo = 247,
        espera = function (ms) {
          return new Promise(function (ok) {
            setTimeout(ok, ms);
          });
        };
      var cfg = {};
      try {
        cfg = track.getSettings() || {};
      } catch (e) {}
      if (cap.iso) val.iso = cap.iso.min;
      var tenta = function () {
        if (!ov.isConnected) return;
        passos++;
        var m = fundoAgora(),
          bf = m.l;
        st.bf = bf;
        b.textContent = 'Medindo… ' + passos + '/3';
        if ((Math.abs(alvo - bf) <= 5 && bf < 253) || passos > 3) return fim();
        // brilho ~ proporcional à exposição: vai direto no valor certo (estourado = volta 30%)
        var fator = bf >= 253 ? 0.7 : Math.max(0.25, Math.min(4, alvo / Math.max(bf, 8)));
        if (cap.exposureTime) {
          var et0 = val.et != null ? val.et : cfg.exposureTime || (cap.exposureTime.min + cap.exposureTime.max) / 50;
          val.et = Math.max(cap.exposureTime.min, Math.min(cap.exposureTime.max, et0 * fator));
          aplica('et', val.et).then(function () {
            return espera(260);
          }).then(tenta);
        } else if (cap.exposureCompensation) {
          var c0 = val.comp != null ? val.comp : cfg.exposureCompensation || 0,
            stp = cap.exposureCompensation.step || 1 / 3,
            c1 = c0 + Math.log(fator) / Math.LN2;
          val.comp = Math.max(cap.exposureCompensation.min, Math.min(cap.exposureCompensation.max, Math.round(c1 / stp) * stp));
          aplica('comp', val.comp).then(function () {
            return espera(320);
          }).then(tenta);
        } else fim();
      };
      var fim = function () {
        st.medindo = false;
        // branco: deixa o fundo neutro (sem puxar para azul ou amarelo) — um ajuste só, proporcional
        if (cap.colorTemperature) {
          var rb = fundoAgora().rb,
            kAtual = val.k != null ? val.k : cfg.colorTemperature || 5500;
          if (Math.abs(rb) > 3) {
            val.k = Math.max(cap.colorTemperature.min, Math.min(cap.colorTemperature.max, Math.round(kAtual * (1 - Math.max(-0.15, Math.min(0.15, rb / 255))))));
            aplica('k', val.k);
          } else val.k = kAtual;
        }
        S.estPerfil = { salvo: true, nome: 'Caixa de luz', zoom: st.zoom, iso: val.iso, et: val.et, k: val.k, foco: val.foco, comp: val.comp, t2: st.t2, ts: Date.now() };
        saveSoon();
        b.textContent = 'Fundo travado 255';
        b.classList.add('on');
        proHtml();
        lfToast(st.bf >= 235 ? 'Fundo medido e travado' : 'Travei o máximo de luz possível. Falta luz no fundo.');
        if (ctx.medir) {
          estFechaCam();
          if (ctx.depois) ctx.depois();
        }
      };
      tenta();
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
      if (c === 'medir') return medir();
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
    var ov = document.createElement('div');
    ov.className = 'estOv estRes';
    ov.id = 'estRes';
    document.body.appendChild(ov);
    var passo = ctx.passo || 'frente',
      ok = !!R.cv && R.n >= 60,
      cor = R.n >= 75 ? 'var(--ok)' : R.n >= 60 ? 'var(--warn)' : 'var(--bad)',
      tem34 = !!ctx.k;
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
  ACT.estAbre = function () {
    estAbre();
  };
  // Botão Estúdio no Início
  ICO_D.est = EST_ICO;
  if (INI_PADRAO.indexOf('est') < 0) INI_PADRAO.splice(3, 0, 'est');
  if (INI_TODOS.indexOf('est') < 0) INI_TODOS.push('est');
