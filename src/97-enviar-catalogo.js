  // ===== Enviar catálogo no WhatsApp: escolhe o formato, edita a mensagem (com validade) e compartilha =====
  S.envFmt = 'folha'; // 'folha' (uma imagem com todas as peças) | 'fotos' (uma imagem por peça) | 'texto'
  function envValidade() {
    var d = new Date(Date.now() + 7 * 864e5);
    return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2);
  }
  function envPecas() {
    var refs = S._vVis || [],
      vistos = {},
      out = [];
    S.items.forEach(function (i) {
      if (!(i.qty > 0) || vistos[i.ref] || (refs.length && refs.indexOf(i.ref) < 0)) return;
      var p = precoTab(i);
      if (!(p > 0)) return;
      vistos[i.ref] = 1;
      out.push({ ref: i.ref, nome: pn(i.ref), preco: p, foto: photoOf(i.ref) });
    });
    return out;
  }
  function envMsg() {
    var T = tabDe(S.tabAtiva);
    return 'Olá! Segue o catálogo La Fouch — ' + (T.pub ? 'preços de balcão' : 'tabela ' + T.nome) + '.\nPreços válidos até ' + envValidade() + '.\n\nPara pedir, é só responder aqui. La Fouch · Ciudad del Este';
  }
  function envImg(src) {
    return new Promise(function (ok) {
      if (!src) return ok(null);
      var im = new Image();
      im.onload = function () {
        ok(im);
      };
      im.onerror = function () {
        ok(null);
      };
      im.src = src;
    });
  }
  function envBlob(cv) {
    return new Promise(function (ok) {
      cv.toBlob(ok, 'image/jpeg', 0.9);
    });
  }
  function envCartao(ctx, p, im, x, y, w, h) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#e4dce2';
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    var fh = h - 76;
    if (im) {
      var r = Math.min((w - 16) / im.width, (fh - 8) / im.height),
        iw = im.width * r,
        ih = im.height * r;
      ctx.drawImage(im, x + (w - iw) / 2, y + 8 + (fh - 8 - ih) / 2, iw, ih);
    }
    ctx.fillStyle = '#2a1f27';
    ctx.font = '600 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.nome.slice(0, 22), x + w / 2, y + h - 40);
    ctx.fillStyle = '#7a2f63';
    ctx.font = '700 26px sans-serif';
    ctx.fillText(gs(p.preco), x + w / 2, y + h - 10);
  }
  // Uma imagem com todas as peças marcadas (3 por linha).
  function envFolha(pecas, imgs) {
    var cols = 3,
      cw = 360,
      ch = 420,
      gap = 16,
      topo = 110,
      linhas = Math.ceil(pecas.length / cols),
      cv = document.createElement('canvas');
    cv.width = cols * cw + (cols + 1) * gap;
    cv.height = topo + linhas * (ch + gap) + 60;
    var ctx = cv.getContext('2d');
    ctx.fillStyle = '#f4f1f4';
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = '#4d2a43';
    ctx.font = '700 44px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('La Fouch', gap + 8, 62);
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#6b5a66';
    var T = tabDe(S.tabAtiva);
    ctx.fillText((T.pub ? 'Preços de balcão' : 'Tabela ' + T.nome) + ' · válido até ' + envValidade(), gap + 8, 96);
    pecas.forEach(function (p, k) {
      envCartao(ctx, p, imgs[k], gap + (k % cols) * (cw + gap), topo + Math.floor(k / cols) * (ch + gap), cw, ch);
    });
    return cv;
  }
  function envFoto(p, im) {
    var cv = document.createElement('canvas');
    cv.width = 800;
    cv.height = 900;
    envCartao(cv.getContext('2d'), p, im, 0, 0, 800, 900);
    return cv;
  }
  function envSheet() {
    var pecas = envPecas();
    lfaAbre(
      'lfa-env',
      '<h3 style="margin:0 0 8px">Enviar catálogo no WhatsApp</h3><div class="hint" style="margin:0 0 8px">' + pecas.length + ' peça(s) com preço · ' + esc(tabDe(S.tabAtiva).nome) + '</div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">' +
        [['folha', 'Folha (1 imagem)'], ['fotos', 'Fotos separadas'], ['texto', 'Só texto']].map(function (f) {
          return '<button type="button" class="chip' + (S.envFmt === f[0] ? ' on' : '') + '" data-act="envfmt" data-id="' + f[0] + '">' + f[1] + '</button>';
        }).join('') +
        '</div><textarea class="in" id="envMsg" rows="6" style="width:100%">' + esc(envMsg()) + '</textarea>' +
        '<div style="display:flex;gap:8px;margin-top:10px"><button type="button" class="btn ghost" data-act="envfecha" style="flex:1">Cancelar</button><button type="button" class="btn" data-act="envvai" style="flex:1">Enviar</button></div>' +
        '<div class="hint" id="envSt" style="margin-top:6px">O WhatsApp abre para você escolher o contato.</div>'
    );
  }
  ACT.tabenviar = envSheet;
  ACT.envfecha = function () {
    lfaFecha('lfa-env');
  };
  ACT.envfmt = function (id) {
    var m = document.getElementById('envMsg'),
      tx = m ? m.value : '';
    S.envFmt = id;
    envSheet();
    if (tx) document.getElementById('envMsg').value = tx;
  };
  ACT.envvai = function () {
    var tx = (document.getElementById('envMsg') || {}).value || envMsg(),
      st = document.getElementById('envSt'),
      pecas = envPecas();
    function texto() {
      window.open('https://wa.me/?text=' + encodeURIComponent(tx), '_blank');
      lfaFecha('lfa-env');
    }
    if (S.envFmt === 'texto' || !pecas.length) return texto();
    if (st) st.textContent = 'Montando as imagens…';
    Promise.all(pecas.map(function (p) { return envImg(p.foto); })).then(function (imgs) {
      var cvs = S.envFmt === 'folha' ? [envFolha(pecas, imgs)] : pecas.map(function (p, k) { return envFoto(p, imgs[k]); });
      return Promise.all(cvs.map(envBlob)).then(function (bl) {
        var arqs = bl.map(function (b, k) {
          return new File([b], S.envFmt === 'folha' ? 'catalogo-lafouch.jpg' : 'lafouch-' + pecas[k].ref + '.jpg', { type: 'image/jpeg' });
        });
        if (navigator.canShare && navigator.canShare({ files: arqs })) {
          return navigator.share({ files: arqs, text: tx }).then(function () {
            lfaFecha('lfa-env');
          }, function (e) {
            if (e && e.name === 'AbortError') return;
            texto();
          });
        }
        // sem compartilhamento nativo: baixa a imagem e abre o WhatsApp com o texto
        arqs.forEach(function (f) {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(f);
          a.download = f.name;
          a.click();
        });
        texto();
      });
    });
  };
  window.__envFolha = function () {
    var p = envPecas();
    return Promise.all(p.map(function (x) { return envImg(x.foto); })).then(function (im) {
      var cv = envFolha(p, im);
      return { w: cv.width, h: cv.height, n: p.length };
    });
  };
