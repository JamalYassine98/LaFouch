  // ===== Tratamento do giro DENTRO do app (S361, 16/11/2026 — sistema de 360° aprovado em 14/11; o resultado de referência é o giro da BR44118) =====
  // É o trata_giro2.py (work/s294) refeito para o navegador, sem servidor e sem custo:
  //   1) acha sozinho quanto tempo dura UMA volta do prato (compara o vídeo com ele mesmo);
  //   2) luz: divide cada imagem pelo fundo parado tirado do próprio giro (não recorta a peça);
  //   3) peça fora do centro do prato: mede o "passeio" (uma volta por volta) e tira, de lado e de altura;
  //   4) sobras longe da peça viram branco; perto da peça nada é mexido (a sombra natural fica);
  //   5) ponto de branco em 238; a imagem final sai do vídeo no tamanho em que foi gravado (as medidas são feitas na metade);
  //   6) começa pela frente (o giro começa com a peça de frente), recorta 3:2 igual em todas as imagens e grava um vídeo em que
  //      TODA imagem é inteira (o site pula direto para qualquer grau) — 360 imagens, 30 por segundo, 960×640.
  // Uso: giroTrata(blob, { aviso: function (fase, parte) {} }).then(function (r) { r.blob, r.n, r.capa, r.info })
  var GT_W = 960, // largura de trabalho (o vídeo do celular vem em 1920; metade guarda a nitidez que o site mostra)
    GT_N = 360,
    GT_SAI = [960, 640];
  function gtVideo(blob) {
    return new Promise(function (ok, no) {
      var v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.preload = 'auto';
      v.src = URL.createObjectURL(blob);
      v.onloadedmetadata = function () {
        // vídeos gravados pelo navegador podem vir sem duração: pular para o fim obriga o navegador a medir
        if (isFinite(v.duration) && v.duration > 0) return ok(v);
        v.onseeked = function () { v.onseeked = null; v.currentTime = 0; ok(v); };
        v.currentTime = 1e7;
      };
      v.onerror = function () { no(new Error('vídeo')); };
    });
  }
  function gtVai(v, t) {
    return new Promise(function (ok) {
      var feito = false, fim = function () { if (!feito) { feito = true; v.removeEventListener('seeked', fim); ok(); } };
      if (Math.abs(v.currentTime - t) < 1e-4 && v.readyState >= 2) return ok();
      v.addEventListener('seeked', fim);
      v.currentTime = t;
      setTimeout(fim, 4000);
    });
  }
  // soma corrida: média numa janela de raio r, nas duas direções (aproxima o desfoque)
  function gtCaixa(a, W, H, r) {
    var b = new Float32Array(a.length), x, y, s, i, n = 2 * r + 1;
    for (y = 0; y < H; y++) {
      s = 0;
      for (x = -r; x <= r; x++) s += a[y * W + Math.min(W - 1, Math.max(0, x))];
      for (x = 0; x < W; x++) {
        b[y * W + x] = s / n;
        s += a[y * W + Math.min(W - 1, x + r + 1)] - a[y * W + Math.max(0, x - r)];
      }
    }
    for (x = 0; x < W; x++) {
      s = 0;
      for (y = -r; y <= r; y++) s += b[Math.min(H - 1, Math.max(0, y)) * W + x];
      for (y = 0; y < H; y++) {
        a[y * W + x] = s / n;
        s += b[Math.min(H - 1, y + r + 1) * W + x] - b[Math.max(0, y - r) * W + x];
      }
    }
    return a;
  }
  // menor (sinal -1) ou maior (sinal 1) valor numa janela quadrada de raio r
  function gtExtremo(a, W, H, r, maior, Tipo) {
    var b = new Tipo(a.length), c = new Tipo(a.length), x, y, k, m, v;
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      m = a[y * W + x];
      for (k = Math.max(0, x - r); k <= Math.min(W - 1, x + r); k++) { v = a[y * W + k]; if (maior ? v > m : v < m) m = v; }
      b[y * W + x] = m;
    }
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      m = b[y * W + x];
      for (k = Math.max(0, y - r); k <= Math.min(H - 1, y + r); k++) { v = b[k * W + x]; if (maior ? v > m : v < m) m = v; }
      c[y * W + x] = m;
    }
    return c;
  }
  // pedaços ligados de uma máscara: devolve os rótulos e a área de cada um
  function gtPedacos(m, W, H) {
    var lab = new Int32Array(W * H), area = [0], pilha = new Int32Array(W * H), n = 0, i, p, t, x, y, q;
    for (i = 0; i < W * H; i++) {
      if (!m[i] || lab[i]) continue;
      n++; area[n] = 0; t = 0; pilha[t++] = i; lab[i] = n;
      while (t) {
        p = pilha[--t]; area[n]++; x = p % W; y = (p - x) / W;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          var xx = x + dx, yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
          q = yy * W + xx;
          if (m[q] && !lab[q]) { lab[q] = n; pilha[t++] = q; }
        }
      }
    }
    return { lab: lab, area: area, n: n };
  }
  // assinatura pequena de uma imagem (48×27 tons de cinza); a duração de UMA volta sai de uma fila delas, uma a cada `passo` segundos.
  // Item 33 (20/11/2026, celular do dono): a conta antiga casava a gravação INTEIRA com ela mesma, desde o primeiro segundo — e o começo
  // é a peça parada (a câmera manda ligar o prato depois de tocar em gravar). Com o prato ligado aos 9 s, a volta de 41 s nunca "fechava".
  // Agora o que se compara é o FIM da fila: os últimos 3 s com o que a câmera viu T antes; o T que melhor casa é a volta.
  //  · só vale como "uma volta antes" o trecho em que o prato já girava (a imagem mudava de meio em meio segundo, como muda agora);
  //    o trecho parado do começo fica de fora — senão a peça chegando perto da posição inicial "casava" com ele e a volta saía errada;
  //  · antes de comparar, cada assinatura vai para o mesmo brilho médio (gtIguala): a luz que a câmera escolhe a cada imagem não entra na conta.
  // casa = diferença nesse T; meio = diferença típica desses 3 s para 2 a 6 s antes (a peça em outro ângulo).
  var GT_SW = 48, GT_SH = 27, GT_JAN = 3, GT_TMIN = 8; // janela do fim e menor volta aceita, em segundos
  function gtAssina(fonte, x2) {
    x2.drawImage(fonte, 0, 0, GT_SW, GT_SH);
    var d = x2.getImageData(0, 0, GT_SW, GT_SH).data, g = new Float32Array(GT_SW * GT_SH);
    for (var k = 0; k < g.length; k++) g[k] = (d[k * 4] + d[k * 4 + 1] + d[k * 4 + 2]) / 3;
    return g;
  }
  function gtIguala(ass) {
    var ms = ass.map(function (g) { var s = 0; for (var k = 0; k < g.length; k++) s += g[k]; return s / g.length; }), M = 0;
    ms.forEach(function (m) { M += m; });
    M /= ms.length || 1;
    return ass.map(function (g, i) { var f = M / (ms[i] || 1), o = new Float32Array(g.length); for (var k = 0; k < g.length; k++) o[k] = g[k] * f; return o; });
  }
  function gtDif(A, B) {
    var dd = 0;
    for (var k = 0; k < A.length; k++) dd += Math.abs(A[k] - B[k]);
    return dd / A.length;
  }
  function gtVolta(ass, passo) {
    var n = ass.length, W = Math.round(GT_JAN / passo), melhor = 0, mv = 1e9, val = [], mov = new Float32Array(n), agora = 0, T, k, s, e;
    ass = gtIguala(ass);
    for (k = 1; k < n; k++) mov[k] = gtDif(ass[k], ass[k - 1]); // quanto a imagem muda de meio em meio segundo
    for (k = Math.max(1, n - W); k < n; k++) agora += mov[k] / W;
    for (T = Math.round(GT_TMIN / passo); T <= n - W - 1; T++) {
      s = 0; e = 0;
      for (k = n - W; k < n; k++) { s += gtDif(ass[k], ass[k - T]); e += mov[k - T]; }
      if (e / W < agora * 0.5) continue; // nesse trecho a peça estava parada
      val[T] = s / W;
      if (val[T] < mv) { mv = val[T]; melhor = T; }
    }
    if (!melhor) return { per: 0, casa: 1e9, meio: 0, borda: true };
    var y0 = val[melhor - 1], y2 = val[melhor + 1], borda = y0 === undefined || y2 === undefined, f = 0, den, m = 0, mc = 0; // borda: sem vizinho dos dois lados não dá para dizer que é o melhor
    if (!borda) { den = y0 - 2 * mv + y2; if (den > 1e-9) f = 0.5 * (y0 - y2) / den; } // afina entre os vizinhos (parábola)
    for (var q = Math.round(2 / passo); q <= Math.round(6 / passo); q++) for (k = n - W; k < n; k++) if (k - q >= 0) { m += gtDif(ass[k], ass[k - q]); mc++; }
    return { per: (melhor + f) * passo, casa: mv, meio: mc ? m / mc : 0, borda: borda };
  }
  // a volta fechou? (ao vivo, a câmera do Estúdio fecha sozinha: folga 0.5; no vídeo já gravado dá para ser menos exigente: 0.6)
  // "sem borda" já garante que a gravação tem a volta mais 3,5 s.
  function gtFechou(ass, passo, folga) {
    var v = gtVolta(ass, passo);
    return v.per > 0 && !v.borda && v.meio > 0.8 && v.casa < v.meio * (folga || 0.5) ? v : null;
  }
  // A primeira volta inteira de uma fila já gravada: anda pela fila como a câmera andaria ao vivo e, quando a volta fecha, fica com o ponto
  // dos 3 s seguintes em que ela casa melhor (ali os dois trechos comparados já estão com o prato girando). n = quantas assinaturas até ali.
  function gtPrimeira(ass, passo, folga) {
    var mais = Math.round(GT_JAN / passo), ate = ass.length, n, v, m = null;
    for (n = Math.round((GT_TMIN + GT_JAN) / passo) + 2; n <= ate; n++) {
      v = gtFechou(ass.slice(0, n), passo, folga);
      if (!v) continue;
      if (!m) ate = Math.min(ate, n + mais);
      if (!m || v.casa < m.casa) { m = v; m.n = n; }
    }
    return m;
  }
  // O tratamento de UMA imagem do giro, num lugar só — serve ao giro inteiro (giroTrata) e às fotos escolhidas à mão (giroFotos).
  // W×H = tamanho de trabalho (as medidas são feitas nele; a imagem final sai do tamanho em que foi gravada).
  //  · amostra(d) / aprende(am): o fundo parado, tirado de várias imagens da própria gravação (em cada ponto, o tom claro que se repete);
  //  · trata(d): imagem ÷ fundo; peca(t): onde a peça está; nitidez(t, pm); recorte(...): a janela 3:2 em volta da peça;
  //  · imagem(fonte, fW, fH, pc, X0, Y0, w, h): a imagem tratada desse recorte, numa tela 960×640 (a mesma tela a cada chamada).
  function gtTratador(W, H) {
    var P = W * H, w2 = W >> 1, h2 = H >> 1, fundo, fmin, fmax, suja,
      sai = document.createElement('canvas'), sx, fcv = document.createElement('canvas'), fxc = fcv.getContext('2d', { willReadFrequently: true }), rc = document.createElement('canvas'), rx = rc.getContext('2d');
    sai.width = GT_SAI[0]; sai.height = GT_SAI[1]; sx = sai.getContext('2d');
    function amostra(d) {
      var a = new Uint8Array(P * 3);
      for (var k = 0; k < P; k++) { a[k * 3] = d[k * 4]; a[k * 3 + 1] = d[k * 4 + 1]; a[k * 3 + 2] = d[k * 4 + 2]; }
      return a;
    }
    function aprende(am) {
      var K = am.length;
      var meio = new Float32Array(P * 3), parado = new Uint8Array(P), ord = new Uint8Array(K), j, k, q, x;
      fundo = new Float32Array(P * 3);
      var iF = Math.round((K - 1) * 0.92), iM = K >> 1, iA = Math.round(K * 0.75), iB = Math.round(K * 0.2);
      for (k = 0; k < P; k++) {
        var esp = 0;
        for (var c = 0; c < 3; c++) {
          q = k * 3 + c;
          for (j = 0; j < K; j++) { x = am[j][q]; var z = j - 1; while (z >= 0 && ord[z] > x) { ord[z + 1] = ord[z]; z--; } ord[z + 1] = x; }
          fundo[q] = ord[iF]; meio[q] = ord[iM];
          if (ord[iA] - ord[iB] > esp) esp = ord[iA] - ord[iB];
        }
        parado[k] = esp < 14 ? 1 : 0;
      }
      am.length = 0; // solta as amostras (cada uma tem o tamanho da imagem)
      // zonas "sujas" do fundo parado (costura da tenda, fita): onde o fundo foge do tom da parede em volta
      var liso = [0, 1, 2].map(function (c) { var a = new Float32Array(P); for (var k = 0; k < P; k++) a[k] = fundo[k * 3 + c]; gtCaixa(a, W, H, 9); gtCaixa(a, W, H, 9); return a; });
      var sj = new Uint8Array(P);
      for (k = 0; k < P; k++) {
        var mx = 0;
        for (c = 0; c < 3; c++) { var d2 = Math.abs(meio[k * 3 + c] / (liso[c][k] + 1) - 1); if (d2 > mx) mx = d2; }
        sj[k] = mx > 0.08 && parado[k] ? 1 : 0;
      }
      suja = gtExtremo(sj, W, H, 1, true, Uint8Array);
      for (k = 0; k < P; k++) if (suja[k]) { fundo[k * 3] = meio[k * 3]; fundo[k * 3 + 1] = meio[k * 3 + 1]; fundo[k * 3 + 2] = meio[k * 3 + 2]; }
      fmin = new Float32Array(P * 3); fmax = new Float32Array(P * 3);
      for (c = 0; c < 3; c++) {
        var a = new Float32Array(P);
        for (k = 0; k < P; k++) a[k] = fundo[k * 3 + c] + 1;
        var mn = gtExtremo(a, W, H, 2, false, Float32Array), mxx = gtExtremo(a, W, H, 2, true, Float32Array);
        for (k = 0; k < P; k++) { fundo[k * 3 + c] = a[k]; fmin[k * 3 + c] = mn[k]; fmax[k * 3 + c] = mxx[k]; }
      }
    }
    // luz: imagem ÷ fundo (com folga), resultado em 0–255 por canal
    function trata(d) {
      var t = new Uint8ClampedArray(P * 3), k, c, q, f, b, r;
      for (k = 0; k < P; k++) {
        var igual = suja[k] ? 1 : 0;
        for (c = 0; c < 3; c++) {
          q = k * 3 + c; f = d[k * 4 + c];
          b = f < fmin[q] ? fmin[q] : f > fmax[q] ? fmax[q] : f;
          r = f / b / 0.985;
          t[q] = r >= 1 ? 255 : r * 255;
          if (igual && Math.abs(f - fundo[q]) - Math.max(0.16 * fundo[q], 16) >= 0) igual = 0;
        }
        if (igual) { t[k * 3] = t[k * 3 + 1] = t[k * 3 + 2] = 255; }
      }
      return t;
    }
    // a peça inteira (meia resolução): tudo o que não é branco e está ligado ao miolo mais escuro.
    // Item 39 (20/11/2026, celular do dono: a frente de uma armação clara saiu com uma lente apagada): numa peça clara, um lado pode não
    // ter "miolo escuro" e a ponte some no branco — esse lado ficava solto e era apagado como se fosse risco do fundo. Com `caixa` (por
    // onde a peça passou na gravação inteira, em pontos de trabalho) o que não é branco e está DENTRO dela também é peça (ponto a ponto).
    function peca(t, caixa) {
      var mn = new Uint8Array(w2 * h2), x, y, k, i;
      for (y = 0; y < h2; y++) for (x = 0; x < w2; x++) {
        var m = 255;
        for (var yy = 0; yy < 2; yy++) for (var xx = 0; xx < 2; xx++) {
          k = ((y * 2 + yy) * W + x * 2 + xx) * 3;
          var u = Math.min(t[k], t[k + 1], t[k + 2]); if (u < m) m = u;
        }
        mn[y * w2 + x] = m;
      }
      var nu, lims = [125, 170, 200], soma = 0;
      for (var L = 0; L < 3; L++) {
        nu = new Uint8Array(w2 * h2);
        for (i = 0; i < w2 * h2; i++) nu[i] = mn[i] < lims[L] ? 1 : 0;
        nu = gtExtremo(gtExtremo(nu, w2, h2, 1, false, Uint8Array), w2, h2, 1, true, Uint8Array); // abre: some o ponto solto
        soma = 0;
        for (y = 0; y < h2; y++) for (x = 0; x < w2; x++) { i = y * w2 + x; if (x < w2 * 0.06 || x >= w2 * 0.94 || y < h2 * 0.15) nu[i] = 0; soma += nu[i]; }
        if (soma > 100) break;
      }
      var pc = gtPedacos(nu, w2, h2), maior = 0;
      for (i = 1; i <= pc.n; i++) if (pc.area[i] > maior) maior = pc.area[i];
      var corte = Math.max(38, maior * 0.02);
      for (i = 0; i < w2 * h2; i++) nu[i] = nu[i] && pc.area[pc.lab[i]] > corte ? 1 : 0;
      var tudo = new Uint8Array(w2 * h2);
      for (i = 0; i < w2 * h2; i++) tudo[i] = mn[i] < 232 ? 1 : 0;
      var liga = gtExtremo(nu, w2, h2, 9, true, Uint8Array), p2 = gtPedacos(tudo, w2, h2), toca = new Uint8Array(p2.n + 1);
      for (i = 0; i < w2 * h2; i++) if (liga[i] && p2.lab[i]) toca[p2.lab[i]] = 1;
      // dentro da caixa vale ponto a ponto: de um pedaço grande que só encosta nela (sombra do prato, costura da tenda) entra só o que está dentro
      var cx0 = caixa ? caixa.x0 >> 1 : 1, cx1 = caixa ? caixa.x1 >> 1 : 0, cy0 = caixa ? caixa.y0 >> 1 : 1, cy1 = caixa ? caixa.y1 >> 1 : 0;
      var m2 = new Uint8Array(w2 * h2), x0 = w2, x1 = -1, y0 = h2, y1 = -1;
      for (y = 0; y < h2; y++) for (x = 0; x < w2; x++) {
        i = y * w2 + x;
        if ((p2.lab[i] && (toca[p2.lab[i]] || (x >= cx0 && x <= cx1 && y >= cy0 && y <= cy1 && p2.area[p2.lab[i]] > corte))) || nu[i]) { m2[i] = 1; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      }
      return { m: m2, x0: x0 * 2, x1: x1 * 2 + 1, y0: y0 * 2, y1: y1 * 2 + 1, achou: x1 >= 0 && (x1 - x0) * (y1 - y0) > 12 };
    }
    // nitidez do contorno (variação do "relevo" em volta da peça)
    function nitidez(t, pm) {
      var s = 0, s2 = 0, n = 0, x, y, k;
      for (y = 2; y < H - 2; y += 2) for (x = 2; x < W - 2; x += 2) {
        if (!pm[(y >> 1) * w2 + (x >> 1)]) continue;
        k = (y * W + x) * 3;
        var g = 4 * t[k + 1] - t[k + 1 - 3] - t[k + 1 + 3] - t[k + 1 - W * 3] - t[k + 1 + W * 3];
        s += g; s2 += g * g; n++;
      }
      return n ? s2 / n - (s / n) * (s / n) : 1;
    }
    function recorte(bx0, bx1, by0, by1) {
      var ccx = (bx0 + bx1) / 2, ccy = (by0 + by1) / 2, w = (bx1 - bx0) * 1.12, h = Math.max((by1 - by0) * 1.45, w / 1.5);
      w = Math.min(Math.max(w, h * 1.5), W, H * 1.5); h = w / 1.5;
      return { x: Math.max(0, Math.min(W - w, ccx - w / 2)), y: Math.max(0, Math.min(H - h, ccy - h * 0.55)), w: w, h: h };
    }
    function imagem(fonte, fW, fH, pc, X0, Y0, w, h) {
      var ES = fW / W, k, c;
      if (fcv.width !== fW || fcv.height !== fH) { fcv.width = fW; fcv.height = fH; }
      // perto da peça (e ~30 px em volta) fica como a câmera viu; longe vira branco, com passagem suave
      var perto = new Float32Array(w2 * h2), dl = gtExtremo(pc.m, w2, h2, 15, true, Uint8Array);
      for (k = 0; k < w2 * h2; k++) perto[k] = dl[k];
      gtCaixa(perto, w2, h2, 5); gtCaixa(perto, w2, h2, 5);
      // a imagem que sai vem do vídeo no tamanho em que foi gravado (as medidas é que são feitas na metade): só o recorte é tratado
      var fx0 = Math.floor(X0 * ES), fy0 = Math.floor(Y0 * ES), fw = Math.round(w * ES), fh = Math.round(h * ES);
      fxc.drawImage(fonte, 0, 0);
      var ax0 = Math.max(0, fx0), ay0 = Math.max(0, fy0), ax1 = Math.min(fW, fx0 + fw), ay1 = Math.min(fH, fy0 + fh), aw = ax1 - ax0, ah = ay1 - ay0;
      var fd = fxc.getImageData(ax0, ay0, aw, ah), dd = fd.data, x, y, X, Y, q, f, bb, r, pr, ig, v3 = [0, 0, 0];
      for (Y = 0; Y < ah; Y++) {
        y = Math.min(H - 1, ((ay0 + Y) / ES) | 0);
        for (X = 0; X < aw; X++) {
          x = Math.min(W - 1, ((ax0 + X) / ES) | 0); k = y * W + x; pr = perto[(y >> 1) * w2 + (x >> 1)];
          var o4 = (Y * aw + X) * 4;
          if (pr <= 0.002) { dd[o4] = dd[o4 + 1] = dd[o4 + 2] = 255; continue; }
          ig = suja[k] ? 1 : 0;
          for (c = 0; c < 3; c++) {
            q = k * 3 + c; f = dd[o4 + c];
            bb = f < fmin[q] ? fmin[q] : f > fmax[q] ? fmax[q] : f;
            r = f / bb / 0.985; v3[c] = r >= 1 ? 255 : r * 255;
            if (ig && Math.abs(f - fundo[q]) - Math.max(0.16 * fundo[q], 16) >= 0) ig = 0;
          }
          for (c = 0; c < 3; c++) {
            var val = ((ig ? 255 : v3[c]) * pr + 255 * (1 - pr)) * (255 / 238);
            dd[o4 + c] = val > 255 ? 255 : val;
          }
        }
      }
      if (rc.width !== aw || rc.height !== ah) { rc.width = aw; rc.height = ah; }
      rx.putImageData(fd, 0, 0);
      sx.fillStyle = '#fff'; sx.fillRect(0, 0, GT_SAI[0], GT_SAI[1]);
      sx.imageSmoothingQuality = 'high';
      var kx = GT_SAI[0] / fw, ky = GT_SAI[1] / fh;
      sx.drawImage(rc, (ax0 - fx0) * kx, (ay0 - fy0) * ky, aw * kx, ah * ky);
      return sai;
    }
        // a caixa que junta várias medidas da peça (cada uma { x0, x1, y0, y1, achou })
    function junta(l) {
      var c = { x0: W, x1: -1, y0: H, y1: -1 };
      l.forEach(function (p) { if (!p.achou) return; if (p.x0 < c.x0) c.x0 = p.x0; if (p.x1 > c.x1) c.x1 = p.x1; if (p.y0 < c.y0) c.y0 = p.y0; if (p.y1 > c.y1) c.y1 = p.y1; });
      return c.x1 < 0 ? null : c;
    }
    return { amostra: amostra, aprende: aprende, trata: trata, peca: peca, nitidez: nitidez, recorte: recorte, imagem: imagem, junta: junta };
  }
  // As fotos escolhidas à mão (a frente e a 3/4 da tela "Qual é a frente?") com o MESMO tratamento do giro (item 34, 20/11/2026):
  // o fundo parado é aprendido das imagens da própria gravação (até 24, espalhadas por ela), cada imagem escolhida é dividida por ele e
  // recortada em volta da peça. Antes essas imagens iam para o tratamento da FOTO (estProcessa), feito para a peça sobre a cartolina
  // branca: no cenário do giro (tenda e prato) ele não acha a peça. Q = imagens da gravação ({ b: arquivo }); ixs = as escolhidas.
  // Devolve uma tela 960×640 por imagem escolhida (null = não há peça nela, ou a peça não saiu do lugar na gravação).
  function giroFotos(Q, ixs) {
    var K = Math.min(24, Q.length), am = [], sai = [], ims = [], caixa = null, tr, W, H, cx;
    function abre(bl) {
      return new Promise(function (ok, no) {
        var u = URL.createObjectURL(bl), im = new Image();
        im.onload = function () { URL.revokeObjectURL(u); ok(im); };
        im.onerror = function () { URL.revokeObjectURL(u); no(new Error('imagem')); };
        im.src = u;
      });
    }
    function pontos(im) {
      if (!tr) {
        W = GT_W; H = Math.round((GT_W * im.naturalHeight / im.naturalWidth) / 2) * 2; tr = gtTratador(W, H);
        var cv = document.createElement('canvas'); cv.width = W; cv.height = H; cx = cv.getContext('2d', { willReadFrequently: true });
      }
      cx.drawImage(im, 0, 0, W, H);
      return cx.getImageData(0, 0, W, H).data;
    }
    function fundo(i) {
      if (i >= K) return Promise.resolve();
      return abre(Q[Math.round(i * (Q.length - 1) / Math.max(1, K - 1))].b).then(function (im) {
        var d = pontos(im);
        am.push(tr.amostra(d));
        ims.push(im);
        return fundo(i + 1);
      });
    }
    function foto(n) {
      if (n >= ixs.length) return Promise.resolve(sai);
      return abre(Q[ixs[n]].b).then(function (im) {
        var pc = tr.peca(tr.trata(pontos(im)), caixa), r, c = null;
        if (pc.achou) {
          r = tr.recorte(pc.x0, pc.x1, pc.y0, pc.y1);
          c = document.createElement('canvas'); c.width = GT_SAI[0]; c.height = GT_SAI[1];
          c.getContext('2d').drawImage(tr.imagem(im, im.naturalWidth, im.naturalHeight, pc, r.x, r.y, r.w, r.h), 0, 0);
        }
        sai.push(c);
        return foto(n + 1);
      });
    }
    return fundo(0).then(function () {
      tr.aprende(am);
      caixa = tr.junta(ims.map(function (im) { return tr.peca(tr.trata(pontos(im))); })); // por onde a peça passou na gravação
      ims = null;
      return foto(0);
    });
  }
  function giroTrata(blob, o) {
    o = o || {};
    var aviso = o.aviso || function () {}, vt_, v, W, H, cv, cx, t0, per, dur, w2, h2, tr;
    function pega(t) {
      if (o.para && o.para()) return Promise.reject(new Error('cancelado'));
      return gtVai(v, Math.min(dur - 0.05, Math.max(0, t))).then(function () {
        cx.drawImage(v, 0, 0, W, H);
        return cx.getImageData(0, 0, W, H).data;
      });
    }
    // 1) a volta: assinaturas pequenas ao longo do vídeo (uma a cada meio segundo) e a primeira volta inteira que elas mostram;
    //    fim = o segundo do vídeo em que essa volta termina
    function acha_volta() {
      var c2 = document.createElement('canvas'); c2.width = GT_SW; c2.height = GT_SH;
      var x2 = c2.getContext('2d', { willReadFrequently: true }), passo = 0.5, ass = [], n = Math.floor((dur - 0.2) / passo), i = 0;
      function um() {
        if (i >= n) return Promise.resolve();
        return gtVai(v, i * passo).then(function () {
          var g = gtAssina(v, x2);
          ass.push(g); i++; aviso('volta', i / n);
          return um();
        });
      }
      return um().then(function () {
        var vt = gtPrimeira(ass, passo, 0.6);
        if (vt) vt.fim = (vt.n - 1) * passo;
        return vt;
      });
    }
    function monta_fundo() {
      var K = 24, am = [], i = 0;
      function um() {
        if (i >= K) return Promise.resolve();
        return pega(t0 + i * per / K).then(function (d) {
          am.push(tr.amostra(d)); i++; aviso('fundo', i / K);
          return um();
        });
      }
      return um().then(function () { tr.aprende(am); });
    }
    return gtVideo(blob).then(function (vid) {
      v = vid; dur = v.duration;
      W = GT_W; H = Math.round((GT_W * v.videoHeight / v.videoWidth) / 2) * 2; w2 = W >> 1; h2 = H >> 1; tr = gtTratador(W, H);
      cv = document.createElement('canvas'); cv.width = W; cv.height = H; cx = cv.getContext('2d', { willReadFrequently: true });
      // quem gravou já sabe a volta (a câmera parou quando ela fechou): ela termina no fim do vídeo
      return o.per ? { per: o.per, casa: 0, meio: 1, fim: dur - 0.2 } : acha_volta();
    }).then(function (vt) {
      if (!vt || !(vt.per > 6)) throw new Error('giro-curto'); // não deu uma volta inteira
      // a volta tratada é a que TERMINA onde ela fechou — nunca o começo da gravação, que é a peça parada esperando o prato ligar
      vt_ = vt; per = vt.per; t0 = o.t0 != null ? o.t0 : Math.max(0, vt.fim - per);
      if (t0 + per > dur + 0.3) throw new Error('giro-curto');
      return monta_fundo().then(function () {
        // 1ª passada: onde a peça está em cada grau, e a nitidez
        var med = [], n = 0;
        function um() {
          if (n >= GT_N) return Promise.resolve();
          return pega(t0 + n * per / GT_N).then(function (d) {
            var t = tr.trata(d), pc = tr.peca(t);
            if (!pc.achou) med.push(med.length ? med[med.length - 1].slice() : [W / 2, H / 2, 10, 10, 1, 1e9, 0.5]);
            else {
              // simetria (a frente e as costas são as vistas mais simétricas) e onde ficam os pontos mais baixos da peça:
              // perto do meio = aros = FRENTE; nas pontas = hastes vindo para a câmera = costas
              var bw = pc.x1 - pc.x0, bh = pc.y1 - pc.y0, sim = 0, ns = 0, xx, yy, ka, kb;
              for (yy = pc.y0; yy <= pc.y1; yy += 2) for (xx = 0; xx < bw / 2; xx += 2) {
                ka = (yy * W + pc.x0 + xx) * 3 + 1; kb = (yy * W + pc.x1 - xx) * 3 + 1;
                sim += Math.abs(t[ka] - t[kb]); ns++;
              }
              var lado = 0, nl = 0, ylim = (pc.y1 - bh * 0.12) / 2, xm = (pc.x0 + pc.x1) / 4;
              for (yy = Math.ceil(ylim); yy < h2; yy++) for (xx = 0; xx < w2; xx++) if (pc.m[yy * w2 + xx]) { lado += Math.abs(xx - xm); nl++; }
              med.push([(pc.x0 + pc.x1) / 2, (pc.y0 + pc.y1) / 2, bw, bh, tr.nitidez(t, gtExtremo(pc.m, w2, h2, 2, true, Uint8Array)), ns ? sim / ns / Math.max(bw, 1) : 1e9, nl ? lado / nl / Math.max(bw / 2, 1) : 0.5]);
            }
            n++; aviso('mede', n / GT_N);
            return um();
          });
        }
        return um().then(function () { return med; });
      });
    }).then(function (med) {
      // passeio = a parte que dá UMA volta por volta
      function harm(ix) {
        var a = 0, b = 0;
        for (var n = 0; n < GT_N; n++) { var th = n * 2 * Math.PI / GT_N; a += med[n][ix] * Math.cos(th); b += med[n][ix] * Math.sin(th); }
        a *= 2 / GT_N; b *= 2 / GT_N;
        var out = new Float32Array(GT_N);
        for (n = 0; n < GT_N; n++) { th = n * 2 * Math.PI / GT_N; out[n] = a * Math.cos(th) + b * Math.sin(th); }
        return { d: out, amp: Math.sqrt(a * a + b * b) };
      }
      var hx = harm(0), hy = harm(1), bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9, nits = [], n;
      // por onde a peça passou na volta inteira (sem tirar o passeio): na 2ª passada, o que não é branco ali dentro é peça
      var caixa = tr.junta(med.map(function (m) { return { x0: m[0] - m[2] / 2, x1: m[0] + m[2] / 2, y0: m[1] - m[3] / 2, y1: m[1] + m[3] / 2, achou: m[5] < 1e9 }; }));
      for (n = 0; n < GT_N; n++) {
        bx0 = Math.min(bx0, med[n][0] - med[n][2] / 2 - hx.d[n]); bx1 = Math.max(bx1, med[n][0] + med[n][2] / 2 - hx.d[n]);
        by0 = Math.min(by0, med[n][1] - med[n][3] / 2 - hy.d[n]); by1 = Math.max(by1, med[n][1] + med[n][3] / 2 - hy.d[n]);
        nits.push(med[n][4]);
      }
      // frente: a vista mais simétrica; entre ela e a oposta, a que tem os pontos mais baixos perto do meio
      var frente = 0;
      if (o.frente == null) {
        var cand = 0, n2;
        for (n = 1; n < GT_N; n++) if (med[n][5] < med[cand][5]) cand = n;
        var outro = (cand + GT_N / 2) % GT_N, jan = function (i) { var q = 0; for (var d = -4; d <= 4; d++) q += med[(i + d + GT_N) % GT_N][6]; return q / 9; };
        frente = jan(cand) <= jan(outro) ? cand : outro;
      } else frente = o.frente;
      var alvo = nits.slice().sort(function (a, b) { return a - b; })[Math.round(GT_N * 0.7)];
      var rec = tr.recorte(bx0, bx1, by0, by1), X0 = rec.x, Y0 = rec.y, w = rec.w, h = rec.h;
      // 2ª passada: aplica e grava
      var sai, fotosQ = o.fotos || [], fotos = {}, capa = null, enc, mux, alvoV, tipo, erroEnc = null;
      function codec() {
        // H.264 (mp4) toca em todo celular, inclusive iPhone; se o aparelho não souber gravar H.264, vai VP8 (webm)
        var av = { codec: 'avc1.42001f', width: GT_SAI[0], height: GT_SAI[1], bitrate: 4e6, framerate: 30, avc: { format: 'avc' } };
        var vp = { codec: 'vp8', width: GT_SAI[0], height: GT_SAI[1], bitrate: 6e6, framerate: 30 };
        if (!window.VideoEncoder) return Promise.reject(new Error('sem-gravador'));
        return VideoEncoder.isConfigSupported(av).then(function (r) { return r.supported ? ['mp4', av] : null; }, function () { return null; }).then(function (r) {
          if (r) return r;
          return VideoEncoder.isConfigSupported(vp).then(function (q) { if (!q.supported) throw new Error('sem-gravador'); return ['webm', vp]; });
        });
      }
      return codec().then(function (cc) {
        tipo = cc[0];
        var Lib = tipo === 'mp4' ? appLib('mp4-muxer', 'Mp4Muxer') : appLib('webm-muxer', 'WebMMuxer'); // vêm dentro do app.js (src/01-build.js)
        alvoV = new Lib.ArrayBufferTarget();
        mux = tipo === 'mp4' ? new Lib.Muxer({ target: alvoV, video: { codec: 'avc', width: GT_SAI[0], height: GT_SAI[1] }, fastStart: 'in-memory' })
          : new Lib.Muxer({ target: alvoV, video: { codec: 'V_VP8', width: GT_SAI[0], height: GT_SAI[1], frameRate: 30 } });
        enc = new VideoEncoder({ output: function (ch, meta) { mux.addVideoChunk(ch, meta); }, error: function (e) { erroEnc = e; } });
        enc.configure(cc[1]);
      }).then(function () {
        var j = 0;
        function um() {
          if (j >= GT_N || erroEnc) return Promise.resolve();
          var n = (frente + j) % GT_N;
          return pega(t0 + n * per / GT_N).then(function (d) {
            var t = tr.trata(d), pc = tr.peca(t, caixa);
            sai = tr.imagem(v, v.videoWidth, v.videoHeight, pc, X0 + hx.d[n], Y0 + hy.d[n], w, h);
            if (fotosQ.indexOf(j) >= 0) fotos[j] = sai.toDataURL('image/jpeg', 0.95);
            if (!j) capa = sai.toDataURL('image/jpeg', 0.86);
            var fr = new VideoFrame(sai, { timestamp: Math.round(j * 1e6 / 30), duration: Math.round(1e6 / 30) });
            enc.encode(fr, { keyFrame: true }); fr.close();
            j++; aviso('grava', j / GT_N);
            // não deixa a fila do gravador crescer sem limite
            return enc.encodeQueueSize > 8 ? new Promise(function (r) { setTimeout(r, 30); }).then(um) : um();
          });
        }
        return um().then(function () {
          if (erroEnc) throw erroEnc;
          return enc.flush();
        }).then(function () {
          mux.finalize();
          // imagens inteiras do vídeo bruto nos graus pedidos (ex.: frente e 3/4 para as fotos da peça), no tamanho em que a câmera gravou
          var qs = {}, lista = (o.quadros || []).slice();
          function umQ() {
            if (!lista.length) return Promise.resolve();
            var g = lista.shift(), tq = t0 + ((frente + g) % GT_N) * per / GT_N;
            return gtVai(v, Math.min(dur - 0.05, tq)).then(function () {
              var c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0);
              qs[g] = c;
              return umQ();
            });
          }
          return umQ().then(function () { return qs; });
        }).then(function (qs) {
          try { URL.revokeObjectURL(v.src); } catch (e) {}
          return {
            quadros: qs, fotos: fotos,
            blob: new Blob([alvoV.buffer], { type: (tipo === 'mp4' ? 'video/mp4' : 'video/webm') + ';gn=' + GT_N }), n: GT_N, /* gn no tipo: o giro tratado se reconhece mesmo depois de guardado no aparelho */ capa: capa, tipo: tipo,
            info: { frente: frente, casa: vt_.casa, meio: vt_.meio, volta: per, inicio: t0, passeioX: hx.amp, passeioY: hy.amp, recorte: [Math.round(X0), Math.round(Y0), Math.round(w), Math.round(h)], largura: W, altura: H }
          };
        });
      });
    });
  }
  window.giroTrata = giroTrata;
  window.__gtVolta = gtVolta;
  window.__gtFechou = gtFechou;
  window.__gtPrimeira = gtPrimeira;
