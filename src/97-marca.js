  // ===== Marca (Marketing) — 86 + regra 'cada ajuste mora na tela do assunto' (dono 22/11 01:28 e 23/11) =====
  // A linha Marca fica no topo do Marketing, mostra "nome · idiomas" e abre a janela de baixo (tarefa, sem seta).
  // Os dados continuam em S.mkt.kit (mkKit) — é dali que posts, cartões e vídeos leem. Regra 15: um "Salvar", sem "Fechar";
  // sair com mudança pergunta "Sair sem salvar?".
  var MARCA_CAMPOS = [['nome', 'Nome'], ['slogan', 'Frase'], ['end', 'Endereço'], ['wa', 'WhatsApp'], ['site', 'Site'], ['tom', 'Tom de voz'], ['tags', 'Hashtags']],
    MARCA_IDI = [['ambos', 'Português e Español', 'PT e ES'], ['pt', 'Português', 'PT'], ['es', 'Español', 'ES']];
  function marcaResumo() {
    var K = mkKit(),
      i = MARCA_IDI.filter(function (x) { return x[0] === K.idioma; })[0] || MARCA_IDI[0];
    return (K.nome || 'Sem nome') + ' · ' + i[2];
  }
  ACT.mkMarca = function () {
    var K = mkKit(), api,
      le = function () {
        var o = {};
        [].forEach.call(api.corpo.querySelectorAll('[data-kit]'), function (e) { o[e.getAttribute('data-kit')] = e.value; });
        return o;
      },
      mudou = function () {
        var o = le();
        return Object.keys(o).some(function (k) { return o[k] !== (K[k] || ''); });
      };
    api = lfJanela({
      titulo: 'Marca',
      mudou: mudou,
      monta: function (box) {
        box.innerHTML = '<div class="mkKit">' + MARCA_CAMPOS.map(function (k) {
          return '<label><span>' + k[1] + '</span><input class="in" data-kit="' + k[0] + '" value="' + esc(K[k[0]] || '') + '"></label>';
        }).join('') +
          '<label><span>Idiomas</span><select class="in selAl" data-kit="idioma">' + MARCA_IDI.map(function (x) { return '<option value="' + x[0] + '"' + ((K.idioma || 'ambos') === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('') + '</select></label>' +
          '<div class="mkCores">' + EB_EST.map(function (s) { return '<i style="background:' + s.bg + ';border-color:' + s.ac + '"></i>'; }).join('') + '</div>' +
          '<button type="button" class="go" data-marca="salva">Salvar</button></div>';
        box.onclick = function (e) {
          if (!e.target.closest('[data-marca=salva]')) return;
          var o = le();
          Object.keys(o).forEach(function (k) { K[k] = o[k]; });
          saveSoon();
          api.fecha(true);
          S._ajForce = true;
          render();
        };
      }
    });
  };
  // a linha do Marketing (redesenhada a cada desenho: o resumo muda depois do Salvar)
  function mkMarcaHtml() {
    return '<button type="button" class="nvL mkMarca" data-act="mkMarca"><span class="nvTx"><b>Marca</b><small>' + esc(marcaResumo()) + '</small></span></button>';
  }
