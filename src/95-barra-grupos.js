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
  // O dono mexeu neste grupo à mão (pôs, tirou, desfez, renomeou, criou): a tabela das famílias não o toca mais (famAplica)
  function famMexeu(gid) { S.famMex = S.famMex || {}; S.famMex[gid] = 1; }
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
  // S370 (esboço 44, aprovado 15/11/2026): grupos também entre os atalhos do Início (o id do grupo fica em S.inicioT)
  function grpIni() {
    return (Array.isArray(S.inicioT) ? S.inicioT : []).filter(function (id) { return !!grpGet(id); });
  }
  function grpNoIni(gid) {
    return grpIni().indexOf(gid) >= 0 && barraLista().indexOf(gid) < 0;
  }
  // telas que estão dentro de algum grupo do Início
  function grpIniItens() {
    var o = [];
    grpIni().forEach(function (id) { o = o.concat(grpGet(id).itens); });
    return o;
  }
  // o grupo da tela aberta (barra primeiro, depois Início)
  function grpAtivo() {
    if (S.view === 'inicio' || S.view === 'notif') return null;
    var g = null;
    barraLista().concat(grpIni()).forEach(function (id) {
      var x = grpGet(id);
      if (x && !g && navOn(id)) g = x;
    });
    return g;
  }
  function grpAviso(g) {
    return g.itens.indexOf('ped') >= 0 ? pedNovos() : 0;
  }
  function grpNomePadrao(a, b) {
    return grpNomeSugerido(a, b) || BARRA_NOME[a] + ' e ' + BARRA_NOME[b];
  }
  // Nome sugerido para qualquer tamanho de grupo: família (3 ou mais telas da mesma família) ou o nome do par principal.
  var GRP_FAM = [['Dinheiro', ['caixa', 'desp', 'fx', 'din']], ['Dashboard', ['hoje', 'hist', 'giro', 'prec']], ['Site', ['ped', 'onl', 'msg', 'anl', 'tem']], ['Clientes e atacado', ['cli', 'ata']], ['Estoque', ['estoque', 'cont', 'lotes', 'novo', 'est']]];
  function grpNomeAuto(itens) {
    if (itens.length >= 3) {
      var f = GRP_FAM.filter(function (x) { return itens.every(function (i) { return x[1].indexOf(i) >= 0; }); })[0];
      if (f) return f[0];
    }
    return itens.length >= 2 ? grpNomePadrao(itens[0], itens[1]) : '';
  }
  // Abre o grupo na última tela usada dele (ou na primeira). Marketing (família) lembra qual grupo está aberto.
  function grpAbre(g) {
    if (g && g.id === 'g:mkt' && g.fam) S._gAt = g.id;
    return inicioGo(g.ult && g.itens.indexOf(g.ult) >= 0 ? g.ult : g.itens[0]);
  }
  // Abas do grupo no topo da tela.
  // S370 (esboço 41, aprovado 15/11/2026): as abas do topo saem; o título da tela ganha a flecha (⌄) e abre a folha VER
  // com as telas do grupo e "Gerenciar grupo" (a mesma mecânica do Dashboard). O desenho do título é feito em grpTitulo().
  function grpAbasRender() {
    var el = $('grpTabs');
    if (!el) return;
    var g = grpAtivo();
    S._gAt = g ? g.id : null;
    if (g) g.itens.forEach(function (t) { if (navOn(t)) g.ult = t; });
    el.hidden = true;
    el.textContent = '';
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
    if (Array.isArray(S.inicioT)) S.inicioT = S.inicioT.filter(function (x) { return x !== id; });
    var eraAuto = g.nome === grpNomeAuto(g.itens);
    famMexeu(gid);
    g.itens.push(id);
    if (eraAuto) g.nome = grpNomeAuto(g.itens); // o nome sugerido acompanha o grupo; nome escrito pelo dono não é trocado
    return true;
  }
  function grpTira(gid, id) {
    var g = grpGet(gid);
    if (!g) return;
    famMexeu(gid);
    if (grpNoIni(gid)) {
      var L = iniLista().slice(),
        k = L.indexOf(gid);
      g.itens = g.itens.filter(function (x) { return x !== id; });
      if (g.itens.length < 2) {
        S.grupos = S.grupos.filter(function (x) { return x !== g; });
        L.splice.apply(L, [k, 1].concat(g.itens, [id]));
      } else L.splice(k + 1, 0, id);
      S.inicioT = L;
      return;
    }
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
    famMexeu(gid);
    if (grpNoIni(gid)) {
      var L = iniLista().slice();
      L.splice.apply(L, [L.indexOf(gid), 1].concat(g.itens));
      S.grupos = S.grupos.filter(function (x) { return x !== g; });
      S.inicioT = L;
      return;
    }
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
    var par = ids.length >= 2 ? grpIcoPar(ids[0], ids[1], 30) : '';
    if (par) return '<span class="gbig"><i>' + par + '</i></span>';
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
        '<div class="hint" style="margin:0">' + BARRA_NOME[a] + ' e ' + BARRA_NOME[b] + ' passam a ficar juntos num só botão da barra. Para trocar de tela, toque no título (⌄).</div>' +
        '<input class="in" id="grpNome" maxlength="18" value="' + esc(grpNomePadrao(a, b)) + '" aria-label="Nome do grupo">' +
        '<button type="button" class="go" data-act="grpCria">Criar grupo</button>' +
        '<button type="button" class="chip grpCentro" data-act="grpFecha">Cancelar</button>'
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
        // S360 (esboço 36, aprovado 15/11/2026): sem o bloco "Adicionar botão"; para pôr uma tela no grupo, arrasta-se o atalho do Início até ele.
        '<button type="button" class="go" data-act="grpSalva">Salvar</button>' +
        '<button type="button" class="chip grpCentro" data-act="grpDesfazer">Desfazer o grupo</button>'
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
    if (S._gn && typeof encCancela === 'function') encCancela();
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
    famMexeu(g.id);
    B[i] = g.id;
    B.splice(B.indexOf(n.b), 1);
    S.barra = B;
    S._gn = null; // fechar a janela sem desmanchar as peças (elas viram o ícone do grupo logo abaixo)
    ACT.grpFecha();
    render();
    var b = $('mainnav').querySelector('.mn[data-id="' + g.id + '"]');
    // v443: as peças encaixadas encolhem juntas e viram o ícone do grupo
    if (typeof encCria === 'function' && encCria(g.id)) return;
    if (b && b.animate && !REDUCED) b.animate([{ transform: 'scale(.6)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'ease-out' });
  };
  ACT.grpSalva = function () {
    var g = grpGet(S._gg);
    if (g) { var nm0 = g.nome; g.nome = grpNomeLe(g, g.nome); if (g.nome !== nm0) famMexeu(g.id); }
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
    if (grpNoIni(S._gg)) {
      var gt = document.querySelector('#v-inicio .tl[data-id="' + S._gg + '"]'),
        it = (grpGet(S._gg) || {}).itens || [],
        r0 = gt ? gt.getBoundingClientRect() : null;
      grpDesfaz(S._gg);
      ACT.grpFecha();
      if (S.view !== 'inicio') setView('inicio');
      render();
      grpIniAbre(it, r0);
      return;
    }
    var gb = $('mainnav').querySelector('.mn[data-id="' + S._gg + '"]'),
      gg = grpGet(S._gg),
      desf = gg && gb ? { itens: gg.itens.slice(), r: gb.getBoundingClientRect() } : null;
    grpDesfaz(S._gg);
    ACT.grpFecha();
    render();
    // v443: o grupo vira as peças, desencaixa e cada uma volta ao seu lugar
    if (desf && typeof encDesfaz === 'function') encDesfaz(desf.itens, desf.r);
  };
  // S374 (esboço 61, dono 16/11 11:15): segurar (ou botão direito) num grupo da barra NÃO abre mais o gerenciar;
  // mudar ou desfazer o grupo fica na flecha do título › "Gerenciar grupo".
  document.addEventListener('contextmenu', function (e) {
    var b = e.target.closest && e.target.closest('#mainnav .mn');
    var id = b && b.getAttribute('data-id');
    if (id && grpGet(id)) e.preventDefault();
  });
