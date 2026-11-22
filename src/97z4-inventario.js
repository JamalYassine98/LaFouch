  // ===== Família INVENTÁRIO (a lista) — "implementar" do dono 22/11/2026 12:51 (esboços 52d, 52b, 52e e 58h) =====
  // Retrato do aprovado: work/s435/titan/inventario_aprovado.jpg · como fazer: work/s435/implementar/COMO-FAZER-INVENTARIO-52.md
  // Topo: título, o resumo "16 referências · US$ 420 a custo" embaixo e o + na linha do título; sem os números grandes.
  // Os números grandes (#kpisE) moram no index.html do aparelho (o APK só recebe app.js e style.css): saem daqui, uma vez.
  (function () {
    var k = $('kpisE');
    if (k) k.remove();
  })();
  // referências com peça em estoque e quanto elas custaram (custo × quantidade, em dólar)
  function invResumo() {
    var refs = {}, custo = 0;
    S.items.forEach(function (i) {
      if (!(i.qty > 0)) return;
      refs[i.ref] = 1;
      custo += (+i.custo || 0) * i.qty;
    });
    var n = Object.keys(refs).length;
    return n + (n === 1 ? ' referência' : ' referências') + ' · ' + usd0(custo) + ' a custo';
  }
