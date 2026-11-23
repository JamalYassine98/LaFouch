  // ===== Nova cor (esboço 42, aprovado 21/11/2026 07:51) =====
  // "+ Nova cor ›" abre a janela de baixo: QUAL COR (as cores que a loja já usa, das mais usadas para as menos, ou "Outra…" para escrever),
  // Código (o próximo C# da peça, sugerido), Quantidade e Custo (o das outras cores, dá para mudar); pré-graduado pede também o Grau.
  // A foto fica para depois: a cor entra sem foto e aparece na fila do Estúdio (estFila). UMA função cria a cor: corNova().
  var COR_FORA = { '': 1, 'Sem cor': 1, 'Sem detalhe': 1 };
  // as cores já cadastradas na loja, por uso (linhas de produto que usam a cor), sem as de `fora`
  function coresDaLoja(fora) {
    var n = {};
    S.items.forEach(function (i) {
      var c = i.cor || '';
      if (i.bulk || COR_FORA[c] || (fora && fora.indexOf(c) >= 0)) return;
      n[c] = (n[c] || 0) + 1;
    });
    return Object.keys(n).sort(function (a, b) { return n[b] - n[a] || (a < b ? -1 : 1); });
  }
  function corProximaClasse(ref) {
    var mx = 0;
    S.items.forEach(function (x) {
      if (x.ref !== ref) return;
      var n = parseInt(String(x.vr || '').replace(/\D/g, ''), 10);
      if (n > mx) mx = n;
    });
    return 'C' + (mx + 1);
  }
  // Cria a cor na peça `ref`: o = { cor, vr, q, custo, grau }. Mesma cor (e mesmo grau) já existente e fora de lote só soma a quantidade.
  // Devolve { ok, erro }.
  function corNova(ref, o) {
    var rows = S.items.filter(function (i) { return i.ref === ref && !i.bulk; }), base = rows[0];
    if (!base) return { ok: false, erro: 'Peça não encontrada.' };
    var cor = String(o.cor || '').trim(), q = Math.max(1, Math.min(999, Math.floor(+o.q) || 1)),
      gr = base.tipo === 'pre' ? normGrau(o.grau || '') : '', custo = o.custo != null && isFinite(+o.custo) && +o.custo >= 0 ? +o.custo : base.custo;
    if (!cor || COR_FORA[cor]) return { ok: false, erro: 'Escolha a cor.' };
    if (base.tipo === 'pre' && !gr) return { ok: false, erro: 'Informe o grau da cor nova (ex.: +1.75 ou 175).' };
    var ex = rows.filter(function (i) { return i.cor === cor && (i.grau || '') === gr && !i.lote; })[0];
    if (ex) ex.qty += q;
    else S.items.push({ custo: custo, tipo: base.tipo, grau: gr, ref: ref, med: base.med || '', vr: o.vr || corProximaClasse(ref), fmt: base.fmt || '', cor: cor, qty: q });
    if (!S.palette[cor]) S.palette[cor] = '#9aa0a6'; // cor escrita à mão: entra na paleta com um cinza até alguém escolher o tom
    entradaEstoque(base.tipo, ref, cor, gr, q);
    if (S.site && S.site[ref] && typeof vitFila === 'function') vitFila(ref, 'upd');
    saveSoon();
    return { ok: true, somou: !!ex };
  }
  function corNovaJanela(ref, depois) {
    var rows = S.items.filter(function (i) { return i.ref === ref && !i.bulk; }), base = rows[0];
    if (!base) return;
    var pre = base.tipo === 'pre', tem = pre ? [] : rows.map(function (i) { return i.cor; }),
      E = { cor: '', outra: false, q: 1, custo: base.custo != null ? String(base.custo).replace('.', ',') : '', grau: '' }, vr = corProximaClasse(ref), custo0 = E.custo, api;
    var pinta = function (box) {
      box.innerHTML =
        '<p class="cnSub">' + esc(pn(ref)) + ' · ' + esc(ref) + '</p>' +
        '<div class="cnLb">Qual cor</div><div class="cnCores">' +
        coresDaLoja(tem).slice(0, 8).map(function (c) {
          return '<button type="button" class="cnCor' + (!E.outra && E.cor === c ? ' on' : '') + '" data-cor="' + esc(c) + '"><i style="background:' + esc(S.palette[c] || '#9aa0a6') + '"></i>' + esc(c) + '</button>';
        }).join('') +
        '<button type="button" class="cnCor' + (E.outra ? ' on' : '') + '" data-outra="1"><i class="v"></i>Outra…</button></div>' +
        (E.outra ? '<input class="in cnOutra" id="cnOutra" maxlength="24" placeholder="Nome da cor" aria-label="Nome da cor" value="' + esc(E.cor) + '">' : '') +
        '<div class="cnLn"><span>Código</span><b>' + esc(vr) + '</b></div>' +
        (pre ? '<label class="cnLn"><span>Grau</span><input class="cnIn" id="cnGrau" inputmode="decimal" placeholder="+1,75" aria-label="Grau" value="' + esc(E.grau) + '"></label>' : '') +
        '<div class="cnLn"><span>Quantidade</span><span class="cnQt"><button type="button" data-d="-1" aria-label="Menos">−</button><b id="cnQ">' + E.q + '</b><button type="button" data-d="1" aria-label="Mais">+</button></span></div>' +
        '<label class="cnLn"><span>Custo</span><span class="cnCu">US$ <input class="cnIn" id="cnCusto" inputmode="decimal" placeholder="0,00" aria-label="Custo por peça em US$" value="' + esc(E.custo) + '"></span></label>' +
        '<p class="cnNota">A foto fica para depois: a cor entra na fila do Estúdio.</p>' +
        '<button type="button" class="go" data-cn="salva">Salvar</button>';
    };
    var le = function (box) {
      var o = box.querySelector('#cnOutra'), g = box.querySelector('#cnGrau'), c = box.querySelector('#cnCusto');
      if (o) E.cor = o.value.trim();
      if (g) E.grau = g.value;
      if (c) E.custo = c.value;
    };
    api = lfJanela({
      titulo: 'Nova cor',
      cls: 'cnJn',
      mudou: function () { le(api.corpo); return !!(E.cor || E.q !== 1 || E.grau || E.custo !== custo0); },
      monta: function (box) {
        pinta(box);
        box.onclick = function (e) {
          var b = e.target.closest('button');
          if (!b) return;
          le(box);
          if (b.dataset.cor != null) { E.cor = b.dataset.cor; E.outra = false; return pinta(box); }
          if (b.dataset.outra) { E.outra = true; E.cor = ''; pinta(box); var o = box.querySelector('#cnOutra'); if (o) o.focus(); return; }
          if (b.dataset.d) { E.q = Math.max(1, Math.min(999, E.q + +b.dataset.d)); box.querySelector('#cnQ').textContent = E.q; return; }
          if (b.dataset.cn === 'salva') {
            var cu = parseFloat(String(E.custo).replace(',', '.')),
              r = corNova(ref, { cor: E.cor, vr: vr, q: E.q, custo: isFinite(cu) ? cu : null, grau: E.grau });
            if (!r.ok) return lfToast(r.erro, 'atencao');
            api.fecha(true);
            lfToast(r.somou ? '' + E.cor + ': +' + E.q + ' no estoque' : 'Cor ' + E.cor + ' criada · a foto entra pela fila do Estúdio', 'ok');
            if (depois) depois();
          }
        };
      }
    });
  }
