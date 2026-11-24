  // ===== Marcação do menu Adicionar feita pelo app (v418) =====
  // A atualização automática troca só app.js e style.css; o index.html continua o do APK.
  // Por isso o menu é montado aqui: assim o celular recebe o desenho novo sem precisar de APK.
  (function () {
    var a = document.getElementById('addPhotoB'),
      b = document.getElementById('addMenuB');
    // 44 + 45 (aprovados 21/11): o Adicionar fica só com o que não passa pelo Estúdio; saem "Ler haste", "Foto" e "Dar entrada de novo"
    if (a) a.innerHTML = '<div id="addRasc" hidden style="margin-bottom:10px"></div><div id="addDeNovo" hidden></div>';
    // regra 15: a janela do cadastro fecha arrastando, tocando fora ou com Esc (o rascunho fica guardado); sem o botão "Fechar"
    var fx = document.getElementById('addClose');
    if (fx) fx.remove();
    if (b) {
      b.className = 'adLista';
      b.innerHTML = "      <button class=\"adRow\" id=\"addToLote\" type=\"button\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M2 6h12v10H2zM14 9h4l3 3.5V16h-7z\"/><circle cx=\"6.5\" cy=\"17.5\" r=\"1.8\"/><circle cx=\"17.5\" cy=\"17.5\" r=\"1.8\"/></svg><span>Chegou mercadoria</span><svg class=\"adSeta\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9 6l6 6-6 6\"/></svg></button>\n      <button class=\"adRow\" id=\"addToMan\" type=\"button\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 20h4L19 9l-4-4L4 16z\"/><path d=\"M13.5 6.5l4 4\"/></svg><span>Preencher à mão</span><svg class=\"adSeta\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9 6l6 6-6 6\"/></svg></button>";
    }
  })();
