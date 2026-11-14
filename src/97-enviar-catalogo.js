  // ===== Ajudantes de imagem usados pelo Compartilhar novo, pelo Enviar bonito e pelo Marketing (o envio antigo do catálogo saiu em 14/11/2026) =====
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
