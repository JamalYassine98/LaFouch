  // ===== Imagem: canvas e cor da peça. =====
  // Cria um canvas com o tamanho dado.
  function mkCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    return c;
  }
  // Reduz a imagem ao lado máximo informado.
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
