  // ===== Pedidos: pedidos do catálogo online para a loja (por enquanto lançados à mão; o catálogo online ligará aqui). =====
  ICO_D.ped = '<path d="M6 3h12l2 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7zM4 7h16M9 11a3 3 0 0 0 6 0"/>';
  S.pedidos = [];
  S.pedNext = 1;
  S.pedF = 'novo';
  S.pedForm = null;
  var PED_ST = [
    ['novo', 'Novo', 'Começar a separar'],
    ['sep', 'Separando', 'Marcar pronto'],
    ['pronto', 'Pronto', 'Marcar entregue'],
    ['ent', 'Entregue', ''],
    ['canc', 'Cancelado', '']
  ];
  function pedNome(st) {
    for (var i = 0; i < PED_ST.length; i++) if (PED_ST[i][0] === st) return PED_ST[i][1];
    return st;
  }
  function pedNovos() {
    return S.pedidos.filter(function (p) {
      return p.st === 'novo';
    }).length;
  }
  function pedAbertos() {
    return S.pedidos.filter(function (p) {
      return p.st === 'novo' || p.st === 'sep' || p.st === 'pronto';
    }).length;
  }
  // Valor estimado pela tabela de preços (só das linhas que são modelos do estoque).
  function pedTotal(p) {
    var t = 0;
    p.itens.forEach(function (l) {
      var it = l.ref
        ? S.items.filter(function (i) {
            return i.ref === l.ref;
          })[0]
        : null;
      try {
        if (it) t += tFor(it).price * l.q;
      } catch (e) {}
    });
    return t;
  }
  function pedZap(p) {
    var d = String(p.tel || '').replace(/\D/g, '');
    if (!d) return '';
    if (d.charAt(0) === '0') d = '595' + d.slice(1);
    var tx = 'Olá' + (p.cli ? ', ' + p.cli : '') + '! Sobre o seu pedido nº ' + p.num + ' na La Fouch: ';
    return 'https://wa.me/' + d + '?text=' + encodeURIComponent(tx);
  }
  function pedLer() {
    var f = S.pedForm;
    if (!f || !$('pCli')) return;
    f.cli = $('pCli').value;
    f.tel = $('pTel').value;
    f.obs = $('pObs').value;
    f.ref = $('pRef').value;
    f.q = Math.max(1, Math.round(toNum($('pQtd').value)) || 1);
  }
  function pedLinhaDe(txt, q) {
    var t = String(txt || '').trim(),
      ref = '';
    S.items.some(function (i) {
      if (i.ref.toLowerCase() === t.toLowerCase() || pubNome(i.ref).toLowerCase() === t.toLowerCase()) {
        ref = i.ref;
        return true;
      }
    });
    return { t: ref ? pubNome(ref) : t, ref: ref, q: q };
  }
  function renderPedidos() {
    var el = $('v-ped');
    if (!el || S.view !== 'ped') return;
    var n = { novo: 0, sep: 0, pronto: 0, ent: 0, canc: 0 };
    S.pedidos.forEach(function (p) {
      n[p.st]++;
    });
    var fl = [
        ['novo', 'Novos', n.novo, n.novo ? 'w' : ''],
        ['sep', 'Separando', n.sep, ''],
        ['pronto', 'Prontos', n.pronto, ''],
        ['ent', 'Entregues', n.ent, ''],
        ['canc', 'Cancelados', n.canc, '']
      ],
      h = '<div class="top"><div><h1>Pedidos</h1><div class="crumb">Pedidos do catálogo online para a loja</div></div></div>';
    h += '<div class="tgrid g5" role="group" aria-label="Situação dos pedidos">';
    fl.forEach(function (f) {
      h += tileHtml('data-act="pedf" data-id="' + f[0] + '"', 'ped', f[1], [String(f[2]), f[3]], 'sm', S.pedF === f[0]);
    });
    h += '</div>';
    var f = S.pedForm;
    if (f) {
      h +=
        '<section class="card"><b>Novo pedido</b><div class="col" style="gap:8px;margin-top:8px">' +
        '<input class="in" id="pCli" placeholder="Nome do cliente" value="' + esc(f.cli || '') + '" autocomplete="off">' +
        '<input class="in" id="pTel" type="tel" inputmode="tel" placeholder="Telefone / WhatsApp" value="' + esc(f.tel || '') + '">' +
        '<div class="lbl" style="margin:4px 0 0">Itens</div>';
      f.itens.forEach(function (l, i) {
        h += '<div class="sl" style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span>' + l.q + '× ' + esc(l.t) + '</span><button type="button" class="chip" data-act="pedlrm" data-id="' + i + '">Tirar</button></div>';
      });
      var refs = {};
      S.items.forEach(function (i) {
        refs[i.ref] = 1;
      });
      h +=
        '<div style="display:flex;gap:8px"><input class="in" id="pRef" placeholder="Modelo ou produto" style="flex:1 1 auto;min-width:0" value="' + esc(f.ref || '') + '" autocomplete="off">' +
        '<input class="in" id="pQtd" type="number" min="1" inputmode="numeric" style="width:70px" value="' + (f.q || 1) + '"></div>' +
        '<button type="button" class="chip" data-act="pedladd">+ Adicionar item</button>' +
        '<input class="in" id="pObs" placeholder="Observação (opcional)" value="' + esc(f.obs || '') + '">' +
        '<div class="hint" id="pH" style="margin:0"></div>' +
        '<div style="display:flex;gap:8px"><button type="button" class="go" data-act="pedsave">Salvar pedido</button><button type="button" class="chip" data-act="pedcancel">Cancelar</button></div>' +
        '</div></section>';
    } else {
      h += '<div class="sel"><button type="button" class="go" data-act="pednovo">+ Novo pedido</button></div>';
    }
    var lista = S.pedidos
      .filter(function (p) {
        return p.st === S.pedF;
      })
      .sort(function (a, b) {
        return b.ts - a.ts;
      });
    if (!lista.length)
      h += '<div class="hint">' + (S.pedidos.length ? 'Nenhum pedido nesta situação.' : 'Nenhum pedido ainda. Quando o catálogo online estiver ligado, os pedidos dele aparecem aqui sozinhos; por enquanto você pode lançar um com “Novo pedido”.') + '</div>';
    lista.forEach(function (p) {
      var tot = pedTotal(p),
        z = pedZap(p),
        pr = PED_ST.filter(function (s) {
          return s[0] === p.st;
        })[0];
      h +=
        '<section class="card"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:15px">Pedido ' + p.num + (p.cli ? ' · ' + esc(p.cli) : '') + '</b><span class="hint" style="margin:0">' + fd(p.ts) + ' ' + fh(p.ts) + '</span></div>' +
        '<div style="margin-top:6px">' +
        p.itens
          .map(function (l) {
            return '<div class="sl">' + l.q + '× ' + esc(l.t) + '</div>';
          })
          .join('') +
        '</div>' +
        (p.obs ? '<div class="hint" style="margin:6px 0 0">' + esc(p.obs) + '</div>' : '') +
        (tot ? '<div class="hint" style="margin:6px 0 0">Valor pela tabela: <b>' + gs(tot) + '</b></div>' : '') +
        '<div class="sel" style="flex-wrap:wrap;margin-top:8px">' +
        (pr && pr[2] ? '<button type="button" class="mini" data-act="pedav" data-id="' + p.id + '">' + pr[2] + '</button>' : '') +
        (z ? '<a class="chip" href="' + z + '" target="_blank" rel="noopener">WhatsApp</a>' : '') +
        (p.st !== 'canc' && p.st !== 'ent' ? '<button type="button" class="chip" data-act="pedcanc" data-id="' + p.id + '">Cancelar pedido</button>' : '') +
        (p.st === 'canc' || p.st === 'ent' ? '<button type="button" class="chip" data-act="peddel" data-id="' + p.id + '">' + (S._pedDel === String(p.id) ? 'Remover?' : 'Remover') + '</button>' : '') +
        '</div></section>';
    });
    el.innerHTML = h;
    if ($('pRef')) sugestao($('pRef'), sugBusca, 'n');
  }
  ACT.pedf = function (id) {
    S.pedF = id;
    render();
  };
  ACT.pedver = function () {
    S.pedF = 'novo';
    setView('ped');
  };
  ACT.pednovo = function () {
    S.pedForm = { cli: '', tel: '', obs: '', ref: '', q: 1, itens: [] };
    render();
  };
  ACT.pedcancel = function () {
    S.pedForm = null;
    render();
  };
  ACT.pedladd = function () {
    pedLer();
    var f = S.pedForm;
    if (!f || !String(f.ref).trim()) {
      $('pH').textContent = 'Escreva o modelo ou produto.';
      return;
    }
    f.itens.push(pedLinhaDe(f.ref, f.q));
    f.ref = '';
    f.q = 1;
    render();
  };
  ACT.pedlrm = function (id) {
    pedLer();
    S.pedForm.itens.splice(+id, 1);
    render();
  };
  ACT.pedsave = function () {
    pedLer();
    var f = S.pedForm;
    if (f && String(f.ref).trim()) {
      f.itens.push(pedLinhaDe(f.ref, f.q));
      f.ref = '';
    }
    if (!f || !f.itens.length) {
      $('pH').textContent = 'Coloque pelo menos um item.';
      return;
    }
    S.pedidos.push({ id: S.pedNext, num: S.pedNext, ts: Date.now(), cli: cap1(f.cli.trim()), tel: f.tel.trim(), obs: f.obs.trim(), itens: f.itens, st: 'novo', orig: 'manual' });
    S.pedNext++;
    S.pedForm = null;
    S.pedF = 'novo';
    render();
    window.scrollTo(0, 0);
  };
  function pedAch(id) {
    return S.pedidos.filter(function (p) {
      return String(p.id) === String(id);
    })[0];
  }
  ACT.pedav = function (id) {
    var p = pedAch(id);
    if (!p) return;
    p.st = p.st === 'novo' ? 'sep' : p.st === 'sep' ? 'pronto' : 'ent';
    S.pedF = p.st;
    render();
  };
  ACT.pedcanc = function (id) {
    var p = pedAch(id);
    if (!p) return;
    p.st = 'canc';
    S.pedF = 'canc';
    render();
  };
  ACT.peddel = function (id) {
    if (S._pedDel !== String(id)) {
      S._pedDel = String(id);
      render();
      setTimeout(function () {
        if (S._pedDel === String(id)) {
          S._pedDel = null;
          render();
        }
      }, 3500);
      return;
    }
    S._pedDel = null;
    S.pedidos = S.pedidos.filter(function (p) {
      return String(p.id) !== String(id);
    });
    render();
  };
