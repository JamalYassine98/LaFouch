  // ===== Grupos no acesso rápido: juntar 2 botões da barra de baixo cria um grupo (as telas viram abas no topo). =====
  S.grupos = [];
  function grpGet(id) {
    if (typeof id !== 'string' || id.indexOf('g:') !== 0) return null;
    return (
      (S.grupos || []).filter(function (g) {
        return g.id === id;
      })[0] || null
    );
  }
  // Todas as telas que estão na barra (grupos abertos em suas telas).
  function grpPlana() {
    var o = [];
    barraLista().forEach(function (id) {
      var g = grpGet(id);
      if (g) o = o.concat(g.itens);
      else o.push(id);
    });
    return o;
  }
  function grpAviso(g) {
    return g.itens.indexOf('ped') >= 0 ? pedNovos() : 0;
  }
  function grpNomePadrao(a, b) {
    return BARRA_NOME[a] + ' e ' + BARRA_NOME[b];
  }
  function grpAbre(g) {
    var t = g.ult && g.itens.indexOf(g.ult) >= 0 ? g.ult : g.itens[0];
    inicioGo(t);
  }
  // Abas do grupo no topo da tela.
  function grpAbasRender() {
    var el = $('grpTabs');
    if (!el) return;
    var g = null;
    if (S.view !== 'inicio' && S.view !== 'notif')
      barraLista().forEach(function (id) {
        var x = grpGet(id);
        if (x && !g && navOn(id)) g = x;
      });
    if (!g) {
      el.hidden = true;
      el.textContent = '';
      return;
    }
    var h = '';
    g.itens.forEach(function (t) {
      var on = navOn(t),
        n = t === 'ped' ? pedNovos() : 0;
      if (on) g.ult = t;
      h += '<button type="button" class="' + (on ? 'on' : '') + '" data-act="grpTela" data-id="' + t + '" aria-pressed="' + on + '">' + BARRA_NOME[t] + (n ? ' <b>' + n + '</b>' : '') + '</button>';
    });
    h += '<button type="button" class="gmais" data-act="grpGerir" data-id="' + g.id + '" aria-label="Gerenciar grupo ' + esc(g.nome) + '">⋯</button>';
    el.hidden = false;
    el.innerHTML = h;
  }
  // Coloca o botão no lugar do grupo na barra (ou no Início se a barra estiver cheia).
  function grpSolta(B, pos, ids) {
    ids.forEach(function (id, n) {
      if (B.length < BARRA_MAX) B.splice(pos + n, 0, id);
      else barraDevolve(id);
    });
  }
  function grpAdd(gid, id) {
    var g = grpGet(gid);
    if (!g || grpGet(id) || g.itens.indexOf(id) >= 0) return false;
    S.barra = barraLista().filter(function (x) {
      return x !== id;
    });
    g.itens.push(id);
    return true;
  }
  function grpTira(gid, id) {
    var g = grpGet(gid);
    if (!g) return;
    var B = barraLista().slice(),
      i = B.indexOf(gid);
    g.itens = g.itens.filter(function (x) {
      return x !== id;
    });
    if (g.itens.length < 2) {
      var resto = g.itens.slice();
      B.splice(i, 1);
      S.grupos = S.grupos.filter(function (x) {
        return x !== g;
      });
      grpSolta(B, i, resto.concat([id]));
    } else grpSolta(B, i + 1, [id]);
    S.barra = B;
  }
  function grpDesfaz(gid) {
    var g = grpGet(gid);
    if (!g) return;
    var B = barraLista().slice(),
      i = B.indexOf(gid);
    B.splice(i, 1);
    S.grupos = S.grupos.filter(function (x) {
      return x !== g;
    });
    grpSolta(B, i, g.itens);
    S.barra = B;
  }
  // ---------- janelas (novo grupo / gerenciar)
  function grpJanela(html) {
    var m = $('grpM');
    if (!html) {
      if (m) m.remove();
      return;
    }
    if (!m) {
      m = document.createElement('div');
      m.id = 'grpM';
      m.className = 'modal';
      m.setAttribute('role', 'dialog');
      m.setAttribute('aria-modal', 'true');
      document.body.appendChild(m);
    }
    m.innerHTML = '<div class="modal-box" style="max-width:420px;margin-top:10vh">' + html + '</div>';
  }
  function grpIcones(ids) {
    return '<span class="gbig">' + ids.slice(0, 3).map(function (x) { return '<i>' + ico(x, 22) + '</i>'; }).join('') + '</span>';
  }
  function grpNovoAbre(a, b) {
    var Bl = barraLista();
    if (Bl.indexOf(a) > Bl.indexOf(b)) {
      var tmp = a;
      a = b;
      b = tmp;
    }
    S._gn = { a: a, b: b };
    grpJanela(
      '<div style="display:flex;align-items:center;gap:12px">' + grpIcones([a, b]) + '<b style="font-size:19px">Novo grupo</b></div>' +
        '<div class="hint" style="margin:0">' + BARRA_NOME[a] + ' e ' + BARRA_NOME[b] + ' passam a ficar juntos num só botão da barra. As telas aparecem como abas no topo.</div>' +
        '<input class="in" id="grpNome" maxlength="18" value="' + esc(grpNomePadrao(a, b)) + '" aria-label="Nome do grupo">' +
        '<button type="button" class="go" data-act="grpCria">Criar grupo</button>' +
        '<button type="button" class="chip" data-act="grpFecha">Cancelar</button>'
    );
  }
  function grpGerirAbre(gid) {
    var g = grpGet(gid);
    if (!g) return;
    S._gg = gid;
    var livres = iniLista().filter(function (x) {
      return BARRA_NOME[x] && grpPlana().indexOf(x) < 0;
    });
    grpJanela(
      '<div style="display:flex;align-items:center;gap:12px">' + grpIcones(g.itens) + '<b style="font-size:19px">Grupo</b></div>' +
        '<input class="in" id="grpNome" maxlength="18" value="' + esc(g.nome) + '" aria-label="Nome do grupo">' +
        '<div class="lbl" style="margin:0">Telas do grupo</div>' +
        g.itens.map(function (x) {
          return '<div class="grow"><span>' + BARRA_NOME[x] + '</span><button type="button" class="chip" data-act="grpTirar" data-id="' + x + '">Tirar</button></div>';
        }).join('') +
        (livres.length
          ? '<div class="lbl" style="margin:0">Adicionar botão <span style="font-weight:400">(ou arraste do Início até o grupo)</span></div><div class="gadd">' +
            livres.map(function (x) {
              return '<button type="button" class="chip" data-act="grpPoe" data-id="' + x + '">+ ' + BARRA_NOME[x] + '</button>';
            }).join('') + '</div>'
          : '') +
        '<button type="button" class="go" data-act="grpSalva">Salvar</button>' +
        '<button type="button" class="chip" data-act="grpDesfazer">Desfazer o grupo</button>'
    );
  }
  function grpNomeLe(g, padrao) {
    var i = $('grpNome'),
      v = i ? i.value.replace(/\s+/g, ' ').trim().slice(0, 18) : '';
    return v || padrao;
  }
  ACT.grpTela = function (id) {
    inicioGo(id);
  };
  ACT.grpGerir = function (id) {
    grpGerirAbre(id);
  };
  ACT.grpFecha = function () {
    S._gn = S._gg = null;
    grpJanela('');
  };
  ACT.grpCria = function () {
    var n = S._gn;
    if (!n) return;
    var B = barraLista().slice(),
      i = B.indexOf(n.a);
    if (i < 0 || B.indexOf(n.b) < 0) return ACT.grpFecha();
    var g = { id: 'g:' + Date.now().toString(36), nome: grpNomeLe(null, grpNomePadrao(n.a, n.b)), itens: [n.a, n.b] };
    S.grupos.push(g);
    B[i] = g.id;
    B.splice(B.indexOf(n.b), 1);
    S.barra = B;
    ACT.grpFecha();
    render();
    var b = $('mainnav').querySelector('.mn[data-id="' + g.id + '"]');
    if (b && b.animate && !REDUCED) b.animate([{ transform: 'scale(.6)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'ease-out' });
  };
  ACT.grpSalva = function () {
    var g = grpGet(S._gg);
    if (g) g.nome = grpNomeLe(g, g.nome);
    ACT.grpFecha();
    render();
  };
  ACT.grpTirar = function (id) {
    var gid = S._gg,
      g = grpGet(gid);
    if (!g) return;
    var nome = g.nome;
    grpTira(gid, id);
    render();
    if (grpGet(gid)) grpGerirAbre(gid);
    else ACT.grpFecha();
  };
  ACT.grpPoe = function (id) {
    var gid = S._gg;
    if (grpAdd(gid, id)) {
      render();
      grpGerirAbre(gid);
    }
  };
  ACT.grpDesfazer = function () {
    grpDesfaz(S._gg);
    ACT.grpFecha();
    render();
  };
  // Botão direito (mouse) num grupo da barra abre o gerenciar.
  document.addEventListener('contextmenu', function (e) {
    var b = e.target.closest && e.target.closest('#mainnav .mn');
    var id = b && b.getAttribute('data-id');
    if (id && grpGet(id)) {
      e.preventDefault();
      grpGerirAbre(id);
    }
  });
