  // ===== v471 (aprovado 08/11): Inventário limpo =====
  // Sinal C no preço (✓ rosa = certo · ! âmbar = pede atenção), busca igual ao Catálogo, filtros no estilo do Catálogo
  // com "Situação", e a lista "Preços para corrigir" (como a lista de compra da Reposição).

  // ---------- preço: problema e sugestão ----------
  function invSemCusto(ref) {
    return S.items.some(function (i) {
      return i.ref === ref && i.qty > 0 && !i.bulk && effCusto(i) == null;
    });
  }
  // null = preço em ordem; senão { k: 'r' abaixo do custo | 'w' perto do mínimo | 'c' sem custo | 'p' sem preço, sug, txt }
  function invPrecoProb(ref, tipo, ps) {
    var it = itemDoRef(ref, tipo);
    if (!it || it.bulk) return null;
    if (ps === undefined) ps = pisoDoRef(ref, tipo || it.tipo);
    var atual = precoAtual(ref, tipo || it.tipo),
      piso = ps && ps.pp && ps.pp.piso > 0 ? ps.pp.piso : 0;
    if (invSemCusto(ref)) return { k: 'c', sug: 0, txt: 'sem preço de custo' };
    if (!(atual > 0)) return { k: 'p', sug: piso, txt: 'sem preço' };
    if (ps && ps.st === 'r') return { k: 'r', sug: piso, txt: 'abaixo do custo', custo: ps.pp.trava, atual: atual };
    if (ps && ps.st === 'w') return { k: 'w', sug: piso, txt: 'perto do mínimo', atual: atual };
    return null;
  }
  // sinal fino ao lado do preço (opção C)
  function invSinal(ref, tipo, ps) {
    var pb = invPrecoProb(ref, tipo, ps);
    if (pb) return '<i class="pSin ex" title="' + esc(pb.txt) + '" aria-label="Preço: ' + esc(pb.txt) + '">!</i>';
    return ps && ps.st === 'o' ? '<i class="pSin ok" title="Preço certo" aria-label="Preço certo">✓</i>' : '';
  }
  // todas as peças com preço a corrigir (uma por código)
  function invPrecosAcorrigir() {
    var vis = {},
      L = [];
    S.items.forEach(function (i) {
      if (vis[i.ref] || i.bulk || !(i.qty > 0)) return;
      vis[i.ref] = 1;
      var pb = invPrecoProb(i.ref, i.tipo);
      if (pb) L.push({ ref: i.ref, tipo: i.tipo, pb: pb });
    });
    var ord = { r: 0, p: 1, w: 2, c: 3 };
    return L.sort(function (a, b) {
      return ord[a.pb.k] - ord[b.pb.k];
    });
  }

  // ---------- Situação (filtro) ----------
  var INV_SIT = [
    ['preco', 'Preço a corrigir'],
    ['pouco', 'Pouco estoque'],
    ['esg', 'Esgotado'],
    ['enc', 'Encalhada']
  ];
  function invSitOk(ref, sit) {
    sit = sit || S.sitF;
    if (!sit) return true;
    var n = estoqueDoRef(ref);
    if (sit === 'preco') return !!invPrecoProb(ref);
    if (sit === 'pouco') return n > 0 && n <= 2;
    if (sit === 'esg') return n === 0;
    if (sit === 'enc') return typeof encDias === 'function' && encDias(ref) > 0;
    return true;
  }
  try {
    if (FKEYS.indexOf('sitF') < 0) FKEYS.push('sitF');
  } catch (e) {}

  // peças que a lista mostra agora (tipo, faixa, busca e situação)
  function invPecas() {
    var k = document.querySelector('#kCont b'),
      n = k ? +String(k.textContent).replace(/\D/g, '') || 0 : 0;
    if (!S.sitF) return n;
    var ts = tSel();
    return S.items.reduce(function (a, i) {
      var noTipo = S.lotesView ? false : ts.length ? ts.indexOf(i.tipo) >= 0 : true;
      return a + (noTipo && !i.bulk && invSitOk(i.ref) ? i.qty || 0 : 0);
    }, 0);
  }
  // ---------- busca igual ao Catálogo (montada uma vez; o index.html do APK não muda) ----------
  var ICO_AJ = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>';
  function invBuscaMonta() {
    var q = $('q'),
      bf = $('btnFilt');
    if (!q || !bf || $('invBs')) return;
    var row = q.parentElement && q.parentElement.parentElement,
      box = row && row.parentElement;
    if (!row || !box) return;
    var cam = row.querySelector('.ic:not(#btnFilt)');
    var bs = document.createElement('div');
    bs.className = 'bs';
    bs.id = 'invBs';
    bs.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
    q.className = '';
    q.style.cssText = '';
    q.placeholder = 'Buscar peça, código, cor…';
    bs.appendChild(q);
    if (cam) {
      cam.className = 'ic cam';
      cam.style.cssText = '';
      bs.appendChild(cam);
    }
    var sub = document.createElement('div');
    sub.className = 'vsub';
    sub.id = 'invSub';
    var info = document.createElement('div');
    info.id = 'invInfo';
    info.className = 'vpcs';
    sub.appendChild(info);
    var dir = document.createElement('div');
    dir.className = 'vdir';
    sub.appendChild(dir);
    bf.className = 'ic0';
    bf.style.cssText = '';
    bf.innerHTML = ICO_AJ;
    dir.appendChild(bf);
    var gb = $('btnGraus');
    if (gb) dir.appendChild(gb);
    row.textContent = '';
    row.style.cssText = 'display:flex;flex-direction:column;gap:10px;max-width:560px;width:100%';
    row.appendChild(bs);
    row.appendChild(sub);
    // sem as duas linhas e o vão em volta da busca
    box.style.cssText = 'margin:14px 0 4px;padding:0;border:0;gap:10px';
  }
  // resumo "86 peças · Todos" e arrumações que dependem do desenho da lista
  function invPos() {
    invBuscaMonta();
    var gb = $('btnGraus'),
      dir = $('invSub') && $('invSub').querySelector('.vdir');
    if (gb && dir && gb.parentElement !== dir) dir.appendChild(gb);
    var info = $('invInfo');
    if (info) {
      var n = String(invPecas());
      var lab = S.lotesView
        ? 'Lotes'
        : !S.todos
          ? tipoOf(S.tipo).label
          : S.selSet && S.selSet.length
            ? S.selSet.map(function (id) { return tipoOf(id).label; }).join(' + ')
            : 'Todos';
      var extra = [];
      if (S.faixaF) {
        var fx = (S.faixas || []).filter(function (f) { return f.id === S.faixaF; })[0];
        if (fx) extra.push(fx.nome);
      }
      if (S.sitF) {
        var st = INV_SIT.filter(function (s) { return s[0] === S.sitF; })[0];
        if (st) extra.push(st[1]);
      }
      info.textContent = (n ? n + (n === '1' ? ' peça' : ' peças') + ' · ' : '') + [lab].concat(extra).join(' · ');
    }
    invFiltrosEnfeita();
    invAviso();
  }

  // ---------- folha de filtros no estilo do Catálogo ----------
  function invFiltrosEnfeita() {
    var fb = $('filtBox');
    if (!fb) return;
    if (!$('fbHd')) {
      var hd = document.createElement('div');
      hd.id = 'fbHd';
      hd.innerHTML = '<span class="fbGr" aria-hidden="true"></span><div class="fbHdL"><h3>Filtros do inventário</h3><button type="button" id="fLimpar" data-act="invLimpa">Limpar</button></div>';
      fb.insertBefore(hd, fb.firstChild);
    }
    // tipos: "Nome · 12" → nome à esquerda, número à direita; "Todos os produtos" vira "Todos"
    [].forEach.call(document.querySelectorAll('#tipos > .tab'), function (b) {
      if (b.querySelector('em')) return;
      var m = (b.textContent || '').match(/^(.*) · (\d+)$/);
      if (m) b.innerHTML = '<span>' + esc(m[1] === 'Todos os produtos' ? 'Todos' : m[1]) + '</span><em>' + m[2] + '</em>';
    });
    // Situação
    var tp = $('tipos'),
      sec = tp && tp.closest('section');
    if (sec && !$('fSitB')) {
      var d = document.createElement('div');
      d.id = 'fSitB';
      d.innerHTML = '<div class="lbl">Situação</div><div id="fSit"></div>';
      sec.parentNode.insertBefore(d, sec.nextSibling);
    }
    var fs = $('fSit');
    if (fs && S.filtOpen) {
      fs.innerHTML = INV_SIT.map(function (s) {
        var n = 0,
          vis = {};
        S.items.forEach(function (i) {
          if (vis[i.ref] || i.bulk) return;
          vis[i.ref] = 1;
          if (invSitOk(i.ref, s[0])) n++;
        });
        var on = S.sitF === s[0];
        return '<button type="button" class="tab' + (on ? ' on' : '') + '" data-act="invSit" data-id="' + s[0] + '" aria-pressed="' + on + '">' + (s[0] === 'preco' ? '<b class="pSin ex">!</b> ' : '') + '<span>' + s[1] + '</span><em>' + n + '</em></button>';
      }).join('');
    }
    var ap = $('filtApply');
    if (ap && S.filtOpen) {
      var np = invPecas();
      ap.textContent = 'Ver ' + np + (np === 1 ? ' peça' : ' peças');
    }
  }
  // abrir a folha: vários tipos de uma vez (o botão "Selecionar vários" sai)
  (function () {
    var bf = $('btnFilt');
    if (!bf) return;
    var or = bf.onclick;
    bf.onclick = function () {
      or.apply(this, arguments);
      if (S.filtOpen && !S.multi) {
        S.multi = true;
        render();
      }
    };
  })();
  ACT.invSit = function (k) {
    S.sitF = S.sitF === k ? '' : k;
    S.open = '';
    S.det = false;
    render();
  };
  ACT.invLimpa = function () {
    S.todos = true;
    S.selSet = [];
    S.sortO = '';
    S.faixaF = '';
    S.fmtF = 'all';
    S.corF = 'all';
    S.sitF = '';
    S.q = '';
    if ($('q')) $('q').value = '';
    S.open = '';
    S.det = false;
    render();
  };

  // ---------- Preços para corrigir ----------
  function invAviso() {
    var rows = $('rows');
    if (!rows) return;
    var av = $('invFix'),
      mostra = S.view === 'estoque' && !S.lotesView && !S.repoView && !S.cont && !S.det && !S.selMode && !S.pdMode && S.sitF !== 'preco';
    var L = mostra ? invPrecosAcorrigir() : [];
    if (!L.length) {
      if (av) av.remove();
      return;
    }
    if (!av) {
      av = document.createElement('div');
      av.id = 'invFix';
      av.className = 'invFix';
      av.setAttribute('role', 'button');
      av.tabIndex = 0;
      av.setAttribute('data-act', 'pcAbre');
    }
    if (av.nextSibling !== rows) rows.parentNode.insertBefore(av, rows);
    var c = { r: 0, w: 0, c: 0, p: 0 };
    L.forEach(function (x) {
      c[x.pb.k]++;
    });
    var det = [];
    if (c.w) det.push(c.w + ' perto do mínimo');
    if (c.r) det.push(c.r + ' abaixo do custo');
    if (c.p) det.push(c.p + ' sem preço');
    if (c.c) det.push(c.c + ' sem custo');
    av.innerHTML = '<span class="ifIc" aria-hidden="true">!</span><span class="ifTx"><b>' + L.length + (L.length === 1 ? ' preço para corrigir' : ' preços para corrigir') + '</b><small>' + det.join(' · ') + '</small></span><span class="ifVer">Corrigir ›</span>';
  }
  function pcFolha() {
    var L = invPrecosAcorrigir(),
      comSug = L.filter(function (x) { return x.pb.sug > 0; });
    var h = '<h3 class="pcT">Preços para corrigir</h3>';
    if (!L.length) h += '<p class="pcVazio">Tudo certo: nenhum preço para corrigir.</p>';
    h += L.map(function (x) {
      var pb = x.pb,
        ph = photoOf(x.ref),
        linha2 =
          pb.k === 'r'
            ? 'custo ' + gs(pb.custo) + ' · mínimo pelas suas regras ' + gs(pb.sug)
            : pb.k === 'w'
              ? 'mínimo pelas suas regras ' + gs(pb.sug)
              : pb.k === 'p'
                ? pb.sug > 0 ? 'mínimo pelas suas regras ' + gs(pb.sug) : 'defina o preço do produto'
                : 'informe o custo para o app calcular';
      return (
        '<div class="pcLi">' + (ph ? '<img src="' + ph + '" alt="">' : '<span class="pcSf"></span>') +
        '<span class="pcTx"><b>' + esc(pn(x.ref)) + '</b><small class="' + (pb.k === 'r' ? 'r' : '') + '">' + esc(pb.txt) + (pb.atual ? ' · ' + gs(pb.atual) : '') + '</small><span>' + linha2 + '</span></span>' +
        (pb.sug > 0
          ? '<button type="button" class="pcUsa" data-act="pcUsa" data-id="' + esc(x.ref) + '">Usar ' + gsRaw(pb.sug) + '</button>'
          : '<button type="button" class="pcUsa" data-act="pcInforma" data-id="' + esc(x.ref) + '">Informar</button>') +
        '</div>'
      );
    }).join('');
    if (L.length)
      h += '<div class="pcTot"><span>' + L.length + (L.length === 1 ? ' peça' : ' peças') + ' · ' + comSug.length + ' com sugestão</span></div>';
    h += '<div class="pcFt">' + (comSug.length ? '<button type="button" class="go" data-act="pcUsaTodos">Usar os sugeridos (' + comSug.length + ')</button>' : '') + '<button type="button" class="pcFe" data-act="pcFecha">Fechar</button></div>';
    lfaAbre('pcFolha', h);
  }
  function pcPoe(ref, g) {
    var r = fxUsdLoja();
    if (!(g > 0) || !(r > 0)) return false;
    var o = S.pprice[ref] || {};
    // preço corrigido vira o preço normal (sai a oferta antiga, se houver)
    delete o.ant;
    delete o.au;
    delete o.ga;
    delete o.prev;
    delete o.ate;
    ppPutUsd(o, 'novo', Math.ceil((g / r) * 100 - 1e-9) / 100);
    S.pprice[ref] = o;
    return true;
  }
  ACT.pcAbre = function () {
    pcFolha();
  };
  ACT.pcFecha = function () {
    lfaFecha('pcFolha');
  };
  ACT.pcUsa = function (ref) {
    var x = invPrecosAcorrigir().filter(function (y) { return y.ref === ref; })[0];
    if (x && pcPoe(ref, x.pb.sug)) {
      vibrar(10);
      saveSoon();
      render();
      if (invPrecosAcorrigir().length) pcFolha();
      else lfaFecha('pcFolha');
    }
  };
  ACT.pcUsaTodos = function () {
    var n = 0;
    invPrecosAcorrigir().forEach(function (x) {
      if (x.pb.sug > 0 && pcPoe(x.ref, x.pb.sug)) n++;
    });
    if (n) {
      vibrar(12);
      saveSoon();
      render();
    }
    if (invPrecosAcorrigir().length) pcFolha();
    else lfaFecha('pcFolha');
  };
  // sem custo: abre a peça para informar o custo
  ACT.pcInforma = function (ref) {
    lfaFecha('pcFolha');
    var it = itemDoRef(ref);
    if (!it) return;
    S.tipoAuto = S.todos ? { selSet: (S.selSet || []).slice(), q: S.q } : S.tipoAuto;
    S.todos = false;
    S.tipo = it.tipo;
    S.open = ref;
    S.det = true;
    S.selItem = null;
    S.qEdit = true;
    render();
  };
