  // ===== Estúdio: um giro, três fotos (v442, aprovado 05/11/2026) =====
  // Filma uma volta da peça no prato; o app guarda quadros a cada 0,25 s e depois você só confirma, numa régua,
  // o quadro da FRENTE (o app já sugere o mais simétrico) e o da 3/4. Saem frente + 3/4 (com a luz de estúdio) + o vídeo do giro.
  function estGiroSug(sigs) {
    // frente sugerida: o quadro mais simétrico (esquerda × direita) no miolo da imagem
    var best = 0,
      bv = -1;
    sigs.forEach(function (s, i) {
      if (s > bv) {
        bv = s;
        best = i;
      }
    });
    return best;
  }
  function estGiroSim(cv) {
    var w = 96,
      h = 54,
      c = mkCanvas(w, h),
      g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(cv, 0, 0, w, h);
    var d = g.getImageData(0, 0, w, h).data,
      s = 0,
      n = 0;
    for (var y = Math.round(h * 0.25); y < h * 0.75; y++)
      for (var x = 0; x < w / 2; x++) {
        var a = (y * w + x) * 4,
          b = (y * w + (w - 1 - x)) * 4;
        s += Math.abs(d[a] - d[b]) + Math.abs(d[a + 1] - d[b + 1]) + Math.abs(d[a + 2] - d[b + 2]);
        n++;
      }
    return -s / (n || 1);
  }
  // 149cam-F (19/11/2026): o giro não tem mais câmera própria — é o modo Vídeo da câmera do Estúdio (estCam, 98z-camera-u149f.js).
  // estGiro abre essa câmera já em Vídeo; quem grava é giroGrava, com o stream e o vídeo da própria câmera.
  function estGiro(ctx) {
    ctx = ctx || {};
    if (!(navigator.mediaDevices && window.MediaRecorder)) return lfToast('Este aparelho não grava vídeo pelo app');
    estCam({ k: ctx.k || null, passo: 'frente', titulo: '', modo: 'video', fim: ctx.fim });
  }
  // Grava a volta com o stream da câmera aberta. Para sozinho quando a volta fecha (gtFechou) ou em 60 s (dono 19/11 20:01).
  // ui.tick(seg, volta) a cada meio segundo; ui.fecha() fecha a câmera antes de tratar. Devolve { para }.
  var GIRO_MAX = 60;
  function giroGrava(s, v, ctx, ui) {
    var tipos = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm'],
      mt = tipos.filter(function (t) { return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t); })[0] || '',
      rec = new MediaRecorder(s, mt ? { mimeType: mt, videoBitsPerSecond: 5000000 } : undefined),
      ch = [],
      Q = [],
      cap = mkCanvas(16, 16);
    rec.ondataavailable = function (e) {
      if (e.data && e.data.size) ch.push(e.data);
    };
    // uma foto por segundo para a escolha da frente e da 3/4, e uma assinatura a cada meio segundo para saber quando a volta fechou
    var ass = [], asC = mkCanvas(48, 27), asX = asC.getContext('2d', { willReadFrequently: true }), t0g = Date.now(), tique = 0, volta = null, parou = false;
    var para = function () {
      if (parou) return;
      parou = true;
      clearInterval(pega);
      if (rec.state === 'recording') rec.stop();
    };
    var pega = setInterval(function () {
      if (!v.isConnected) return para();
      if (!v.videoWidth) return;
      var seg = (Date.now() - t0g) / 1000;
      ass.push(gtAssina(v, asX));
      if (!volta && ass.length >= 24 && ass.length % 2 === 0) volta = gtFechou(ass, 0.5);
      if (ui && ui.tick) ui.tick(seg, volta);
      if (volta || seg >= GIRO_MAX) return para();
      if (tique++ % 2) return;
      cap.width = v.videoWidth;
      cap.height = v.videoHeight;
      cap.getContext('2d').drawImage(v, 0, 0);
      var sim = estGiroSim(cap),
        i = Q.length;
      Q.push({ sim: sim, b: null, t: thumbOf(cap) });
      cap.toBlob(function (bl) {
        if (Q[i]) Q[i].b = bl;
      }, 'image/jpeg', 0.9);
    }, 500);
    rec.onstop = function () {
      clearInterval(pega);
      var fechou = !v.isConnected; // fechou a câmera (×) no meio da gravação: descarta, não trata
      if (ui && ui.fecha) ui.fecha();
      if (fechou) return;
      var video = new Blob(ch, { type: mt || 'video/webm' });
      if (!volta) lfToast('Não deu a volta inteira: no site vai o vídeo simples. Grave de novo deixando o prato dar uma volta.');
      setTimeout(function () {
        // S361: com a volta inteira, o app trata o giro e tira a frente e a 3/4 sozinho; sem a volta (ou se algo falhar), a escolha à mão de antes
        if (volta && typeof giroTrata === 'function' && window.VideoEncoder) estGiroAuto(ctx, Q, video, volta);
        else estGiroEscolhe(ctx, Q, video);
      }, 300);
    };
    rec.start(500);
    return { para: para };
  }
  // S361 · "um giro = tudo": trata o giro na hora (andamento na tela) e tira a frente e a 3/4 do próprio giro.
  var EG_FASE = { volta: ['Conferindo a volta', 0, 0.06], fundo: ['Aprendendo o fundo', 0.06, 0.04], mede: ['Achando a frente', 0.1, 0.42], grava: ['Fundo branco em cada grau', 0.52, 0.48] };
  function estGiroAuto(ctx, Q, video, volta) {
    var ov = document.createElement('div'), parou = false;
    ov.className = 'egTrat';
    ov.innerHTML = '<div class="egTc"><div class="egAnel egAnelT" aria-hidden="true"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" class="egA0"/><circle cx="22" cy="22" r="19" class="egA1" id="egTa"/></svg><b id="egTp">0%</b></div>' +
      '<h3>Tratando o giro</h3><p id="egTf">Conferindo a volta</p><p class="egTs">Deixe o app aberto. Em seguida saem a frente, a 3/4 e o giro do site.</p>' +
      '<button class="lkTx" id="egTm" type="button">Escolher as fotos eu mesmo</button></div>';
    document.body.appendChild(ov);
    var manual = function () {
      if (parou) return;
      parou = true;
      ov.remove();
      estGiroEscolhe(ctx, Q, video);
    };
    ov.querySelector('#egTm').onclick = manual;
    giroTrata(video, {
      per: volta.per, fotos: [0, 45], // a frente e a 3/4 saem do giro JÁ tratado (fundo infinito, sombra natural)
      para: function () { return parou; },
      aviso: function (f, p) {
        var e = EG_FASE[f]; if (!e || parou) return;
        var t = e[1] + e[2] * p;
        ov.querySelector('#egTa').style.strokeDashoffset = String(119.4 * (1 - t));
        ov.querySelector('#egTp').textContent = Math.round(t * 100) + '%';
        ov.querySelector('#egTf').textContent = e[0];
      }
    }).then(function (r) {
      var abre = function (u) {
        return new Promise(function (ok) {
          if (!u) return ok(null);
          var im = new Image();
          im.onload = function () { ok(im); };
          im.onerror = function () { ok(null); };
          im.src = u;
        });
      };
      return Promise.all([abre(r.fotos[0]), abre(r.fotos[45])]).then(function (ims) { return [r, ims]; });
    }).then(function (rr) {
      if (parou) return;
      var r = rr[0], R1 = rr[1][0] ? estProcessa(rr[1][0]) : {}, R2 = rr[1][1] ? estProcessa(rr[1][1]) : {};
      if (!R1.cv) return manual(); // não achou a peça na frente: escolha à mão
      parou = true;
      ov.remove();
      if (ctx.k) {
        estGrava(ctx.k, 'frente', R1);
        if (R2.cv) estGrava(ctx.k, '34', R2);
        estGiroGuarda(ctx.k, r.blob);
        lfToast('Giro pronto: frente, 3/4 e giro salvos');
        render();
        if (ctx.fim) ctx.fim();
        return;
      }
      var c2 = { nova: true, fotos: { frente: R1 }, fim: ctx.fim, giro: r.blob };
      if (R2.cv) c2.fotos['34'] = R2;
      estDestino(c2, ctx.fim);
    }, function () {
      manual();
    });
  }
  // Escolha dos quadros: régua com a sugestão da frente; depois a 3/4.
  function estGiroEscolhe(ctx, Q, video) {
    Q = Q.filter(function (q) {
      return q.b;
    });
    if (Q.length < 4) return lfToast('O giro ficou curto demais');
    var ix = estGiroSug(Q.map(function (q) { return q.sim; })),
      passo = 'frente',
      esc = {},
      ov = document.createElement('div');
    ov.className = 'estOv';
    ov.id = 'estGiro';
    document.body.appendChild(ov);
    var pinta = function () {
      ov.innerHTML =
        '<div class="estHd"><h1 style="font-size:22px">' + (passo === 'frente' ? 'Qual é a frente?' : 'E a 3/4?') + '</h1><button type="button" class="estX" data-g="x" aria-label="Fechar">×</button></div><div class="estBody">' +
        '<div class="estImg"><img id="egImg" src="' + Q[ix].t + '" alt=""></div>' +
        '<input type="range" id="egR" min="0" max="' + (Q.length - 1) + '" value="' + ix + '" aria-label="Quadro do giro" style="width:100%">' +
        '<div class="hint" style="margin:0">' + (passo === 'frente' ? 'Já deixei no quadro mais de frente. Arraste se precisar.' : 'Arraste até a peça ficar meio de lado (3/4).') + '</div>' +
        '<button type="button" class="go" data-g="ok">Usar como ' + (passo === 'frente' ? 'frente' : '3/4') + '</button></div>';
      ov.querySelector('#egR').oninput = function () {
        ix = +this.value;
        ov.querySelector('#egImg').src = Q[ix].t;
      };
    };
    pinta();
    ov.onclick = function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.g === 'x') return ov.remove();
      if (b.dataset.g !== 'ok') return;
      esc[passo] = Q[ix].b;
      if (passo === 'frente') {
        passo = '34';
        ix = Math.min(Q.length - 1, ix + Math.max(2, Math.round(Q.length / 8)));
        return pinta();
      }
      ov.remove();
      loadMsg(true, 'Aplicando a luz de estúdio');
      var abre = function (bl) {
        return new Promise(function (ok, no) {
          var u = URL.createObjectURL(bl),
            im = new Image();
          im.onload = function () {
            ok(im);
            URL.revokeObjectURL(u);
          };
          im.onerror = no;
          im.src = u;
        });
      };
      Promise.all([abre(esc.frente), abre(esc['34'])]).then(function (ims) {
        var R1 = estProcessa(ims[0]),
          R2 = estProcessa(ims[1]);
        loadMsg(false);
        if (!R1.cv) return lfToast('Não achei a peça no quadro da frente');
        if (ctx.k) {
          estGrava(ctx.k, 'frente', R1);
          if (R2.cv) estGrava(ctx.k, '34', R2);
          estGiroGuarda(ctx.k, video);
          lfToast('Frente, 3/4 e giro salvos');
          render();
          if (ctx.fim) ctx.fim();
          return;
        }
        // antes de cadastrar: "De qual peça é?" (a frente e a 3/4 vão juntas; o giro também)
        var c2 = { nova: true, fotos: { frente: R1 }, fim: ctx.fim, giro: video };
        if (R2.cv) c2.fotos['34'] = R2;
        estDestino(c2, ctx.fim);
      }, function () {
        loadMsg(false);
        lfToast('Não consegui abrir os quadros do giro');
      });
    };
  }
  // O vídeo do giro fica no aparelho (IndexedDB) para o Marketing (Status) e o site.
  function estGiroGuarda(k, video) {
    if (!video) return Promise.resolve();
    S.giros = S.giros || {};
    var gnT = /gn=(\d+)/.exec(video.type || ''); // giro já tratado traz gn no tipo
    S.giros[k.split('|')[0]] = { k: k, ts: Date.now(), tipo: video.type }; // sem n = ainda não tratado
    if (gnT) S.giros[k.split('|')[0]].n = +gnT[1];
    saveSoon();
    return idbDo('hq', 'readwrite', function (o) {
      return o.put(video, 'giro|' + k.split('|')[0]);
    }).then(function () {
      giroSiteFila(k.split('|')[0]); // vai sozinho para o site
    }).catch(function () {});
  }
  function estGiroLe(ref) {
    return idbDo('hq', 'readonly', function (o) {
      return o.get('giro|' + ref);
    }).catch(function () {
      return null;
    });
  }
