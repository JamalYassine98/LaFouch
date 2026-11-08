  // ===== v469 (aprovado 08/11, opção C): mapa de graus numa folha, aberto por um botão redondo discreto =====
  // O mapa saiu da lista de produtos. Botão de barras ao lado do leitor/filtro (só com Pré-graduados filtrado)
  // e atalho "Graus de leitura" na aba Reposição. Grade sóbria 4×4: "—" = acabou, ponto âmbar = pouco.
  var GR_IC = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 20V12M10 20V6M15 20v-9M20 20V9"/></svg>';
  function grauResumo() {
    var tot = grauTotais(),
      r = { tot: tot, n: 0, falta: [], pouco: [], bem: 0 };
    graus16().forEach(function (g) {
      var q = tot[g],
        lv = grauNivel(q);
      r.n += q;
      if (lv === 'r') r.falta.push(g);
      else if (lv === 'y') r.pouco.push(g);
      else r.bem++;
    });
    return r;
  }
  // botão ao lado da busca (criado por JS: a atualização automática não troca o index.html do APK)
  function grauBotao(on) {
    var q = $('q'),
      row = q && q.parentElement && q.parentElement.parentElement,
      b = $('btnGraus');
    if (row && !b) {
      b = document.createElement('button');
      b.type = 'button';
      b.id = 'btnGraus';
      b.className = 'gbtn';
      b.setAttribute('aria-label', 'Graus de leitura');
      b.innerHTML = GR_IC;
      b.setAttribute('data-act', 'grauAbre');
      row.appendChild(b);
    }
    if (b) b.hidden = !on;
    if (typeof lfaSlot === 'function' && lfaSlot('grFolha')) grauFolha();
  }
  function grauFolha() {
    var r = grauResumo(),
      h =
        '<h3 class="grT">Graus de leitura</h3><p class="grP">' + r.n + (r.n === 1 ? ' peça' : ' peças') + ' · toque num grau para ver os modelos</p><div class="grGd">' +
        graus16()
          .map(function (g) {
            var q = r.tot[g],
              lv = grauNivel(q);
            return '<button type="button" class="gcell ' + lv + (S.q === g ? ' on' : '') + '" data-act="grauToca" data-id="' + g + '" aria-label="' + g + ': ' + q + ' peças"><b>' + (q > 0 ? q : '—') + '</b><small>' + g + '</small></button>';
          })
          .join('') +
        '</div><div class="grLeg"><span><i class="lt"></i>tem</span><span><i class="ly"></i>pouco</span><span><i class="lr"></i>acabou</span></div>' +
        (r.falta.length
          ? '<button type="button" class="go grRep" data-act="grauRepor">Repor ' + (r.falta.length === 1 ? 'o grau em falta' : 'os ' + r.falta.length + ' graus em falta') + '</button>'
          : '<div class="grOk">Todos os graus estão abastecidos.</div>');
    lfaAbre('grFolha', h);
  }
  ACT.grauAbre = function () {
    grauFolha();
  };
  ACT.grauToca = function (g) {
    S.q = S.q === g ? '' : g;
    S.open = '';
    S.det = false;
    lfaFecha('grFolha');
    render();
  };
  ACT.grauRepor = function () {
    lfaFecha('grFolha');
    var t = $('eTabR');
    if (t) t.click();
  };
  // atalho discreto no topo da aba Reposição
  function grauAtalhoRepo() {
    var h = $('repoView');
    if (!h || h.hidden || $('grRepo')) return;
    var r = grauResumo(),
      d = document.createElement('div');
    d.id = 'grRepo';
    d.className = 'grRepo';
    d.setAttribute('data-act', 'grauAbre');
    d.setAttribute('role', 'button');
    d.tabIndex = 0;
    d.innerHTML = '<span class="grIc">' + GR_IC + '</span><span class="grTx"><b>Graus de leitura</b><small>' + (r.falta.length ? r.falta.length + ' em falta' : 'nenhum em falta') + (r.pouco.length ? ' · ' + r.pouco.length + ' com pouco' : '') + '</small></span><span class="grVer">Ver ›</span>';
    h.insertBefore(d, h.firstChild);
  }
