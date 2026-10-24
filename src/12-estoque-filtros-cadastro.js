  // ===== Estoque: painéis de filtro, lista de códigos e abertura/fechamento do cadastro. =====
  $('mV').onclick = function () {
    S.mode = 'venda';
    S.qty = 1;
    S.msg = '';
    render();
  };
  $('mE').onclick = function () {
    S.mode = 'entrada';
    S.qty = 1;
    S.msg = '';
    render();
  };
  // Campo numérico de quantidade (mín. 1).
  function qIn(id, get, set, cap) {
    var e = $(id);
    e.onchange = function () {
      var n = parseInt(String(e.value).replace(/\D/g, ''), 10);
      if (!(n >= 1)) n = 1;
      n = Math.min(n, cap());
      set(n);
      render();
    };
    e.onkeydown = function (ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        e.blur();
      }
    };
    e.onfocus = function () {
      try {
        e.select();
      } catch (x) {}
    };
  }
  qIn(
    'qv',
    null,
    function (n) {
      S.qty = n;
      S.msg = '';
    },
    function () {
      return S._cap || 99999;
    }
  );
  qIn(
    'sqv',
    null,
    function (n) {
      S.qty = n;
      S.msg = '';
    },
    function () {
      return S._vcap || 1;
    }
  );
  qIn(
    'phQ',
    null,
    function (n) {
      if (P) P.qty = n;
    },
    function () {
      return 99999;
    }
  );
  $('mn').onclick = function () {
    S.qty = Math.max(1, S.qty - 1);
    S.msg = '';
    render();
  };
  $('pl').onclick = function () {
    S.qty = Math.max(1, Math.min(S._cap, S.qty + 1));
    S.msg = '';
    render();
  };
  $('q').oninput = function (e) {
    S.q = e.target.value;
    S.open = '';
    S.det = false;
    S.selItem = null;
    render();
  };
  ['eRef', 'eGrau', 'eCor'].forEach(function (id) {
    $(id).oninput = render;
  });
  /* sugestões de códigos que já existem + preencher sozinho quando o código digitado já está no estoque */
  $('eRef').setAttribute('autocomplete', 'off');
  $('phRef').setAttribute('autocomplete', 'off');
  var RLSIG = '';
  // Atualiza a lista de códigos (autocompletar).
  function refreshRefList() {
    var seen = {},
      arr = [];
    S.items.forEach(function (i) {
      if (i.ref && !seen[i.ref]) {
        seen[i.ref] = 1;
        arr.push(i);
      }
    });
    var sig =
      arr.length +
      '|' +
      arr
        .map(function (i) {
          return i.ref + ((S.pnome && S.pnome[i.ref]) || '');
        })
        .join(',');
    RLSIG = sig;
  }
  // Primeira peça do estoque com o código informado.
  function refItem(v) {
    v = normRef(v, false);
    return v
      ? S.items.filter(function (i) {
          return i.ref && i.ref.toUpperCase() === v;
        })[0]
      : null;
  }
  $('eRef').addEventListener('input', function () {
    var it = refItem(this.value),
      v = it ? it.ref.toUpperCase() : '';
    if (!it) {
      S.eRefFill = '';
      return;
    }
    if (v === S.eRefFill) return;
    S.eRefFill = v;
    fillAdd(
      Object.assign(refInfo(it.ref), {
        ref: it.ref,
        tipo: it.tipo,
        med: it.med,
        fmt: it.fmt,
        vr: it.vr,
        noscroll: 1
      })
    );
  });
  $('phRef').addEventListener('input', function () {
    var it = refItem(this.value);
    if (it) {
      var ri = refInfo(it.ref);
      if (it.med && !$('phMed').value.trim()) $('phMed').value = it.med;
      if (ri.nome && !$('phNome').value.trim()) $('phNome').value = ri.nome;
      if (ri.custo && !$('phCusto').value.trim()) $('phCusto').value = ri.custo;
      render();
    }
  });
  $('eMed').oninput = function () {};
  $('btnAddFmt').onclick = function () {
    var raw = $('newFmt').value.trim();
    if (!raw) return;
    var n = raw[0].toUpperCase() + raw.slice(1);
    if (
      S.formats.some(function (f) {
        return f.toLowerCase() === n.toLowerCase();
      })
    ) {
      S.msg = 'Esse formato já existe.';
      render();
      return;
    }
    S.formats.push(n);
    S.eFmt = n;
    $('newFmt').value = '';
    S.addFmt = false;
    S.msg = 'Formato "' + n + '" criado. Use-o numa entrada.';
    render();
  };
  $('go').onclick = function () {
    var t = T(),
      isPre = S.tipo === 'pre',
      qty = S.qty;
    var cor = $('eCor').value.trim() || 'Sem cor',
      ref = S._ref;
    if (!ref) {
      say('Informe a referência da peça.');
      render();
      return;
    }
    if (S._other && !S._known) {
      say(
        ref +
          ' já existe em ' +
          TIPOS.filter(function (x) {
            return x.id === S._other.tipo;
          })[0].full +
          '. Mude para essa aba para dar entrada, assim não vira produto novo.'
      );
      render();
      return;
    }
    if (!cor) {
      say('Informe a cor real da peça.');
      render();
      return;
    }
    if (isPre && !S._gn) {
      say('Informe um grau válido.');
      render();
      return;
    }
    var gr = pickG(S.tipo, S.gSel);
    if (gr.err) {
      say(gr.err);
      render();
      return;
    }
    var gcap = gCap(gr.g, qty);
    if (gcap) {
      popErr(gcap);
      return;
    }
    var gid = gr.g ? gr.g.id : '';
    var ccv = $('eCusto').value.trim(),
      cu = ccv === '' ? null : parseFloat(ccv.replace(',', '.')),
      noCost = cu == null && !gr.g;
    if (!gr.g && !(cu > 0)) {
      popErr(
        'Informe o custo por peça em US$, ou escolha o lote de origem. Sem lote, o custo é obrigatório.'
      );
      return;
    }
    if (ccv !== '' && !(cu >= 0)) {
      say('Custo inválido. Use um número em US$ (ex.: 0,50) ou deixe vazio.');
      render();
      return;
    }
    var corN = cor[0].toUpperCase() + cor.slice(1),
      pk = Object.keys(S.palette).filter(function (k) {
        return k.toLowerCase() === corN.toLowerCase();
      })[0];
    if (pk) corN = pk;
    if (
      !Object.keys(S.palette).some(function (k) {
        return k.toLowerCase() === corN.toLowerCase();
      })
    )
      S.palette[corN] = '#8b9bb0';
    var ex = S.items.filter(function (x) {
      return (
        x.tipo === S.tipo &&
        x.ref.toUpperCase() === ref &&
        (isPre
          ? x.grau === S._gn && (x.vr || '') === (S.eVarP || '')
          : x.vr === (t.simple ? '' : S.eVar)) &&
        x.cor.toLowerCase() === corN.toLowerCase() &&
        (x.lote || '') === gid &&
        (cu == null || x.custo == null || x.custo === cu)
      );
    })[0];
    if (gr.g && cu != null) {
      var ce = gCostErr(
        gr.g,
        ex && ex.custo == null ? cu * (ex.qty + qty) : cu * qty,
        null,
        cu,
        qty
      );
      if (ce) {
        popErr(ce);
        return;
      }
    }
    if (!t.simple) setPN(ref, $('eNome').value);
    $('eNome').value = '';
    var dd = $('eDescP').value.trim();
    if (dd && (!S.desc[ref] || !S._known)) S.desc[ref] = dd;
    $('eDescP').value = '';
    if (ex) {
      ex.qty += qty;
      if (ex.custo == null && cu != null) ex.custo = cu;
    } else
      S.items.push({
        custo: cu == null ? undefined : cu,
        lote: gid || undefined,
        tipo: S.tipo,
        grau: isPre ? S._gn : '',
        ref: ref,
        med:
          isPre || t.simple ? '' : S._known && S._known.med ? S._known.med : $('eMed').value.trim(),
        vr: t.simple ? '' : isPre ? S.eVarP || '' : S.eVar,
        fmt: S._fmtUsed || '',
        cor: corN,
        qty: qty
      });
    $('eCusto').value = '';
    if (S.eFaixa) S.pfaixa[ref] = S.eFaixa;
    S.eFaixa = '';
    entradaEstoque(S.tipo, ref, corN, isPre ? S._gn : '', qty);
    say(
      'Entrada registrada: +' +
        qty +
        ' × ' +
        ref +
        ' ' +
        corN +
        (isPre ? ' (' + S._gn + ')' : t.simple ? '' : ' (' + S.eVar + ')') +
        (noCost ? ' Atenção: este produto ainda está sem preço de custo detalhado.' : '')
    );
    S.qty = 1;
    render();
  };
  var FSNAP = null,
    FKEYS = [
      'todos',
      'tipo',
      'multi',
      'sortO',
      'fmtF',
      'corF',
      'q',
      'open',
      'det',
      'lotesView',
      'repo',
      'faixaF',
      'colF'
    ];
  // Fecha os filtros (cancelar restaura o estado).
  function filtClose(cancel) {
    if (cancel && FSNAP) {
      FKEYS.forEach(function (k) {
        S[k] = FSNAP[k];
      });
      S.selSet = FSNAP.selSet.slice();
      $('q').value = S.q || '';
    }
    FSNAP = null;
    S.filtOpen = false;
    render();
  }
  $('btnFilt').onclick = function () {
    if (S.filtOpen) {
      filtClose(true);
      return;
    }
    FSNAP = { selSet: (S.selSet || []).slice() };
    FKEYS.forEach(function (k) {
      FSNAP[k] = S[k];
    });
    S.filtOpen = true;
    render();
  };
  $('filtApply').onclick = function () {
    filtClose(false);
  };
  $('filtCancel').onclick = function () {
    filtClose(true);
  };
  $('filtPanel').addEventListener('click', function (e) {
    if (e.target === $('filtPanel')) filtClose(true);
  });
  var LSNAP = null;
  $('kLot').onclick = function () {
    if (S.lotesView) {
      S.lotesView = false;
      if (LSNAP) {
        S.todos = LSNAP.todos;
        S.tipo = LSNAP.tipo;
        S.selSet = LSNAP.selSet;
        S.fmtF = LSNAP.fmtF;
        S.corF = LSNAP.corF;
        S.q = LSNAP.q;
        LSNAP = null;
      } else S.todos = false;
      S.msg = '';
      render();
      return;
    }
    LSNAP = {
      todos: S.todos,
      tipo: S.tipo,
      selSet: (S.selSet || []).slice(),
      fmtF: S.fmtF,
      corF: S.corF,
      q: S.q
    };
    S.lotesView = true;
    S.repo = false;
    S.todos = false;
    S.lotSel = '';
    S.lotPick = {};
    S.det = false;
    S.open = '';
    S.msg = '';
    S.pdMode = false;
    render();
  };
  // o cartão "Pede reposição" leva à aba Reposição (um só lugar para ver e comprar o que está acabando)
  $('kRepo').onclick = function () {
    S.repo = false;
    var t = $('eTabR');
    if (t) t.click();
  };
  try {
    $('eMedB').parentNode.appendChild($('eGrauB'));
  } catch (e) {}
  $('btnAdd').onclick = function () {
    ASNAP = { selSet: (S.selSet || []).slice() };
    AKEYS.forEach(function (k) {
      ASNAP[k] = S[k];
    });
    $('eNome').value = '';
    S.gSel = '';
    S.addOpen = true;
    S.addMode = 'prod';
    S.photoFor = null;
    try {
      $('fbCk').checked = S.fundoBranco !== false;
    } catch (e) {}
    S.msg = '';
    render();
  };
  $('lotModal').addEventListener('mousedown', function (e) {
    if (e.target === $('lotModal')) {
      S.gEdit = '';
      S.gDist = '';
      render();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !$('lotModal').hidden) {
      S.gEdit = '';
      S.gDist = '';
      render();
    } else if (e.key === 'Escape' && !$('descModal').hidden) {
      S.descOpen = false;
      render();
    }
  });
  $('descModal').addEventListener('mousedown', function (e) {
    if (e.target === $('descModal')) {
      S.descOpen = false;
      render();
    }
  });
  var ASNAP = null,
    AKEYS = ['tipo', 'todos', 'fmtF', 'corF', 'q', 'open', 'det', 'selItem', 'lotesView'];
  // Fecha o cadastro (cancelar restaura o estado).
  function closeAdd() {
    if (ASNAP) {
      AKEYS.forEach(function (k) {
        S[k] = ASNAP[k];
      });
      S.selSet = ASNAP.selSet.slice();
      try {
        $('q').value = S.q || '';
      } catch (e) {}
      ASNAP = null;
    }
    S.fromLot = '';
    S.addOpen = false;
    P = null;
    B = null;
    Q = [];
    S.photoFor = null;
    render();
  }
  $('addClose').onclick = closeAdd;
  $('addModal').addEventListener('mousedown', function (e) {
    if (e.target === $('addModal')) closeAdd();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !$('addModal').hidden) closeAdd();
  });
  $('btnTrashP').onclick = function () {
    if (S.pdMode) {
      S.pdMode = false;
      S.pdRef = '';
      render();
      return;
    }
    var ok =
      S.open &&
      S.det &&
      S.items.some(function (i) {
        return i.tipo === S.tipo && i.ref === S.open && !i.bulk;
      });
    if (!ok) {
      S.msg = 'Toque em um produto e depois na lixeira para excluí-lo.';
      render();
      return;
    }
    S.pdMode = true;
    S.pdRef = S.open;
    S.msg = '';
    render();
  };
  $('btnMulti').onclick = function () {
    S.multi = !S.multi;
    if (!S.multi) {
      if (S.todos && S.selSet && S.selSet.length > 1) {
        S.todos = false;
        S.tipo = S.selSet[0];
        S.selSet = [];
        S.open = '';
        S.det = false;
      }
      var fs = fSel();
      if (fs.length > 1) S.fmtF = fs[0];
    }
    render();
  };
  $('btnTrash').onclick = function () {
    if (S.delMode) {
      S.delMode = false;
      S.delTipo = '';
      render();
      return;
    }
    if (
      S.todos ||
      S.lotesView ||
      !TIPOS.some(function (x) {
        return x.id === S.tipo;
      })
    ) {
      S.msg = 'Toque em um tipo e depois na lixeira para excluí-lo.';
      render();
      return;
    }
    S.delMode = true;
    S.delTipo = S.tipo;
    S.msg = '';
    render();
  };
  $('btnAddTipo').onclick = function () {
    var h = $('tipoH'),
      nm = $('tNome').value.trim().replace(/\s+/g, ' '),
      cu = parseFloat(String($('tCusto').value).replace(',', '.'));
    if (isNaN(cu) && !String($('tCusto').value).trim()) cu = 0;
    h.hidden = false;
    if (!nm) {
      h.textContent = 'Digite o nome do tipo.';
      return;
    }
    if (
      TIPOS.some(function (x) {
        return x.label.toLowerCase() === nm.toLowerCase();
      })
    ) {
      h.textContent = 'Já existe um tipo com esse nome.';
      return;
    }
    if (!(cu >= 0)) {
      h.textContent = 'Informe o custo de reposição em US$ (pode ser 0).';
      return;
    }
    var id = 'x' + Date.now().toString(36);
    nm = nm[0].toUpperCase() + nm.slice(1);
    S.tiposX.push({
      id: id,
      label: nm,
      full: nm,
      price: 0,
      repUSD: cu,
      pago: cu,
      x: true,
      simple: true
    });
    syncTipos();
    S.todos = false;
    S.lotesView = false;
    S.tipo = id;
    S.fmtF = 'all';
    S.corF = 'all';
    S.q = '';
    S.open = '';
    S.det = false;
    S.selItem = null;
    S.mode = 'venda';
    S.addTipo = false;
    $('tNome').value = '';
    $('tCusto').value = '';
    h.hidden = true;
    S.msg =
      'Tipo "' +
      nm +
      '" criado. O preço você define em cada venda. Use "Dar entrada" para cadastrar os itens.';
    render();
  };
  $('btnManCor').onclick = function () {
    S.manCor = !S.manCor;
    render();
  };
  $('palAdd').onclick = function () {
    var n = cap1($('palName').value);
    if (!n) {
      $('palH').textContent = 'Digite o nome da cor.';
      return;
    }
    if (
      Object.keys(S.palette).some(function (k) {
        return k.toLowerCase() === n.toLowerCase();
      })
    ) {
      $('palH').textContent = 'Essa cor já existe.';
      return;
    }
    S.palette[n] = $('palHex').value;
    $('palName').value = '';
    $('palH').textContent = 'Cor "' + n + '" adicionada.';
    render();
  };
