  // ===== Peças de teste (item 16, 20/11/2026) =====
  // As 19 peças de hoje são de TESTE (feitas por IA) e NENHUMA é removida. Para a regra "peça incompleta não vai ao site"
  // (siteCheck, 64-identidade.js) não tirar nenhuma do ar, o que faltava na ficha delas é preenchido UMA vez com dados de teste
  // que batem com a foto (formato pelo desenho, medidas normais do tipo). Só preenche o que está vazio. Todas ficam marcadas
  // (S.pTeste) e a ficha mostra "Peça de teste"; a marca sai quando a peça é excluída (limpaRefExcluido).
  S.pTeste = {}; // ref -> 1
  S.pTeste16 = 0; // 1 = já preencheu neste aparelho (ou veio pronto de outro)
  // código, formato, medidas (aro-ponte-haste), público, material, polarizado (só solar)
  var PTESTE_19 = [
    ['AC1050', 'Quadrado', '50-20-145', 'Unissex', 'Acetato', ''],
    ['AC1055', 'Redondo', '48-21-145', 'Feminino', 'Acetato', ''],
    ['BR44140', 'Gatinho', '54-17-140', 'Feminino', 'Metal', ''],
    ['BR44145', 'Redondo', '47-22-145', 'Unissex', 'Metal', ''],
    ['GR3340', 'Quadrado', '52-19-145', 'Unissex', 'Acetato', ''],
    ['GR3345', 'Retangular', '54-17-140', 'Masculino', 'Acetato', ''],
    ['GR3350', 'Quadrado', '50-21-145', 'Unissex', 'Acetato', ''],
    ['PY-566', 'Gatinho', '50-19-142', 'Feminino', 'Acetato', ''],
    ['SL2250', 'Quadrado', '54-18-140', 'Masculino', 'Metal', 'Não polarizado'],
    ['SL2255', 'Retangular', '59-17-130', 'Masculino', 'Plástico', 'Polarizado'],
    ['SL2260', 'Redondo', '49-22-145', 'Unissex', 'Acetato', 'Não polarizado'],
    ['SL2265', 'Gatinho', '52-19-145', 'Feminino', 'Acetato', 'Não polarizado'],
    ['SL2270', 'Hexagonal', '51-20-145', 'Feminino', 'Metal', 'Não polarizado'],
    ['SL2275', 'Quadrado', '54-19-145', 'Masculino', 'Acetato', 'Não polarizado'],
    ['SL2280', 'Retangular', '57-17-140', 'Masculino', 'Acetato', 'Não polarizado'],
    ['SL2285', 'Redondo', '46-21-140', 'Unissex', 'Metal', 'Não polarizado'],
    ['SL2290', 'Quadrado', '52-20-145', 'Unissex', 'Acetato', 'Não polarizado'],
    ['SL2300', 'Gatinho', '53-19-145', 'Feminino', 'Acetato', 'Não polarizado'],
    ['SL2305', 'Aviador', '52-21-145', 'Masculino', 'Metal', 'Não polarizado']
  ];
  // 1) marca as 19 uma vez (S.pTeste16); 2) peça marcada nunca fica incompleta: o que estiver vazio volta a ser preenchido
  //    (protege contra um aparelho ainda na versão antiga devolver a ficha vazia pela sincronização). Devolve quantas peças mudou.
  function pTesteMigra() {
    var n = 0;
    if (!S.pTeste) S.pTeste = {};
    PTESTE_19.forEach(function (d) {
      var ref = d[0],
        its = (S.items || []).filter(function (i) { return i.ref === ref && !i.bulk; });
      if (!its.length) return;
      var nova = !S.pTeste16 && !S.pTeste[ref];
      if (nova) S.pTeste[ref] = 1;
      if (!S.pTeste[ref]) return;
      var a = attrOf(ref),
        p = {};
      if (!a.formato) p.formato = d[1];
      if (!a.publico) p.publico = d[3];
      if (!a.material) p.material = d[4];
      if (!a.marca) p.marca = 'LaFouch';
      if (!a.colecao) p.colecao = 'Teste';
      if (its[0].tipo === 'solar' && !a.polarizado) p.polarizado = d[5] || 'Não polarizado';
      var semMed = its.filter(function (i) { return !parseMed(i.med).length; });
      if (Object.keys(p).length) setAttr(ref, p);
      semMed.forEach(function (i) { i.med = d[2]; });
      if (nova || Object.keys(p).length || semMed.length) n++;
    });
    if (n) {
      S.pTeste16 = 1;
      saveSoon();
      if (S.view === 'estoque' || S.view === 'vendas') render();
    }
    return n;
  }
