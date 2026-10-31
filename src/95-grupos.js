  // ===== Grupos de abas: o menu de baixo mostra grupos (Vender, Estoque, Dinheiro…) e cada grupo tem suas telas em abas no topo. =====
  var GRP_TELAS = {
    vendas: 'Catálogo', ped: 'Pedidos', clientes: 'Clientes', estoque: 'Inventário', fx: 'Câmbio', caixa: 'Caixa',
    desp: 'Despesas', hist: 'Histórico', dash: 'Dashboard', onl: 'Loja online', ajustes: 'Ajustes'
  };
  var GRP_ORDEM = ['vendas', 'ped', 'clientes', 'estoque', 'fx', 'caixa', 'desp', 'hist', 'dash', 'onl', 'ajustes'];
  var GRP_MAX = 4;
  var GRP_ICOS = ['vendas', 'estoque', 'caixa', 'ajustes', 'hist', 'hoje', 'din', 'giro', 'prec', 'cat', 'fx', 'desp', 'ped', 'cli', 'lotes', 'cont'];
  function grpPadrao() {
    return [
      { id: 'vender', nome: 'Vender', ico: 'vendas', telas: ['vendas', 'ped', 'clientes'] },
      { id: 'estoque', nome: 'Estoque', ico: 'estoque', telas: ['estoque', 'fx'] },
      { id: 'dinheiro', nome: 'Dinheiro', ico: 'caixa', telas: ['caixa', 'desp', 'hist', 'dash'] },
      { id: 'ajustes', nome: 'Ajustes', ico: 'ajustes', telas: ['ajustes', 'onl'] }
    ];
  }
  // Deixa uma lista de grupos válida: cada tela em um grupo só, nenhuma tela perdida, no máximo GRP_MAX grupos.
  function grpLimpa(l) {
    var vistos = {},
      r = [];
    (Array.isArray(l) ? l : []).forEach(function (g) {
      if (!g || r.length >= GRP_MAX + 2) return;
      var telas = (Array.isArray(g.telas) ? g.telas : []).filter(function (t) {
        if (!GRP_TELAS[t] || vistos[t]) return false;
        vistos[t] = 1;
        return true;
      });
      r.push({
        id: String(g.id || 'g' + (r.length + 1)).slice(0, 24),
        nome: String(g.nome || 'Grupo').slice(0, 20),
        ico: ICO_D[g.ico] ? g.ico : 'cat',
        telas: telas
      });
    });
    if (!r.length) r = grpPadrao();
    // telas que ficaram sem grupo vão para o grupo que tem Ajustes (ou o primeiro)
    var faltam = GRP_ORDEM.filter(function (t) {
        return !vistos[t];
      }),
      dest =
        r.filter(function (g) {
          return g.telas.indexOf('ajustes') >= 0;
        })[0] || r[0];
    faltam.forEach(function (t) {
      dest.telas.push(t);
    });
    return r.slice(0, GRP_MAX + 2);
  }
  function grpLista() {
    S.grupos = grpLimpa(S.grupos || grpPadrao());
    return S.grupos;
  }
  // Grupos que aparecem no menu (os vazios ficam de fora; no máximo GRP_MAX).
  function grpVisiveis() {
    return grpLista()
      .filter(function (g) {
        return g.telas.length;
      })
      .slice(0, GRP_MAX);
  }
  function grpDeView(v) {
    if (v === 'dia') v = 'hist';
    if (v === 'org') v = 'ajustes';
    return (
      grpVisiveis().filter(function (g) {
        return g.telas.indexOf(v) >= 0;
      })[0] || null
    );
  }
  // Abre um grupo na última tela que se usou nele (ou na primeira).
  function grpAbre(g) {
    var u = (S.grpUlt || {})[g.id],
      t = u && g.telas.indexOf(u) >= 0 ? u : g.telas[0];
    if (t === 'vendas') S.catOpen = false;
    setView(t);
  }
  // Pedidos novos para o aviso no menu e na aba.
  function grpAviso(g) {
    return g.telas.indexOf('ped') >= 0 ? pedNovos() : 0;
  }
  // Abas do grupo no topo da tela.
  function grpAbasRender() {
    var el = $('grpTabs');
    if (!el) return;
    var g = S.view === 'org' ? null : grpDeView(S.view);
    if (!g || g.telas.length < 2 || S.view === 'inicio' || S.view === 'notif') {
      el.hidden = true;
      el.textContent = '';
      return;
    }
    var at = S.view === 'dia' ? 'hist' : S.view,
      h = '';
    g.telas.forEach(function (t) {
      var n = t === 'ped' ? pedNovos() : 0;
      h +=
        '<button type="button" class="' + (t === at ? 'on' : '') + '" data-act="grpTela" data-id="' + t + '" aria-pressed="' + (t === at) + '">' +
        GRP_TELAS[t] + (n ? ' <b>' + n + '</b>' : '') + '</button>';
    });
    if (el.getAttribute('data-k') !== g.id + '|' + g.telas.join(',')) el.setAttribute('data-k', g.id + '|' + g.telas.join(','));
    el.hidden = false;
    el.innerHTML = h;
  }
  ACT.grpTela = function (id) {
    if (!GRP_TELAS[id]) return;
    if (id === 'vendas') S.catOpen = false;
    setView(id);
  };

  // ---------- tela "Organizar abas" (rascunho: só vale ao salvar) ----------
  function orgClone(l) {
    return JSON.parse(JSON.stringify(l));
  }
  function orgG(id) {
    return (S._orgD || []).filter(function (g) {
      return g.id === id;
    })[0];
  }
  // Move uma tela para outro grupo (no fim, ou antes de outra tela). Ajustes não sai do seu grupo.
  function orgMove(tela, gid, antes) {
    var dest = orgG(gid);
    if (!dest || !GRP_TELAS[tela] || tela === 'ajustes') return false;
    S._orgD.forEach(function (g) {
      g.telas = g.telas.filter(function (t) {
        return t !== tela;
      });
    });
    var i = antes ? dest.telas.indexOf(antes) : -1;
    if (i >= 0) dest.telas.splice(i, 0, tela);
    else dest.telas.push(tela);
    return true;
  }
  function orgHtml() {
    var D = S._orgD || [],
      ed = S._orgEd,
      h =
        '<div class="top"><div><h1>Organizar abas</h1><div class="crumb">Segure e arraste uma tela para outro grupo</div></div></div>' +
        '<div class="sel"><button type="button" class="chip" data-act="orgVolta">‹ Ajustes</button></div>';
    D.forEach(function (g) {
      var tem = g.telas.indexOf('ajustes') >= 0;
      h +=
        '<section class="orgG" data-g="' + esc(g.id) + '"><div class="orgH"><span class="orgI">' + ico(g.ico, 20) + '</span><b>' + esc(g.nome) + '</b>' +
        '<span class="orgN">' + g.telas.length + (g.telas.length === 1 ? ' tela' : ' telas') + '</span>' +
        '<button type="button" class="orgE" data-act="orgEd" data-id="' + esc(g.id) + '" aria-label="Editar o grupo ' + esc(g.nome) + '">✎</button></div>';
      if (ed === g.id) {
        h +=
          '<div class="orgEd"><input class="in" id="orgNome" maxlength="20" value="' + esc(g.nome) + '" aria-label="Nome do grupo" autocomplete="off"><div class="orgIc">';
        GRP_ICOS.forEach(function (k) {
          if (ICO_D[k]) h += '<button type="button" class="' + (g.ico === k ? 'on' : '') + '" data-act="orgIco" data-id="' + k + '" aria-label="Ícone ' + k + '">' + ico(k, 20) + '</button>';
        });
        h +=
          '</div><div class="pdBtns"><button type="button" class="pdB2 txt" data-act="orgApaga" data-id="' + esc(g.id) + '"' + (g.telas.length || tem ? ' disabled' : '') + ' style="flex:1;width:auto">Apagar grupo</button>' +
          '<button type="button" class="pdB1" data-act="orgEd" data-id="' + esc(g.id) + '">Pronto</button></div>' +
          (tem ? '<div class="hint" style="margin:6px 0 0">Este grupo tem Ajustes e não pode ser apagado.</div>' : g.telas.length ? '<div class="hint" style="margin:6px 0 0">Só dá para apagar grupo vazio.</div>' : '') +
          '</div>';
      }
      h += '<div class="orgC">';
      g.telas.forEach(function (t) {
        h += '<span class="orgT' + (t === 'ajustes' ? ' fix' : '') + '" data-t="' + t + '">' + (t === 'ajustes' ? '🔒 ' : '') + GRP_TELAS[t] + '</span>';
      });
      if (!g.telas.length) h += '<span class="hint" style="margin:0">Vazio. Arraste uma tela para cá.</span>';
      h += '</div></section>';
    });
    h +=
      '<button type="button" class="orgAdd" data-act="orgNovo"' + (D.length >= GRP_MAX ? ' disabled' : '') + '>' +
      (D.length >= GRP_MAX ? 'Máximo de ' + GRP_MAX + ' grupos (mais o Início)' : '＋ Criar novo grupo') + '</button>' +
      '<div class="pdBtns"><button type="button" class="pdB2 txt" data-act="orgPadrao" style="flex:1;width:auto">Voltar ao padrão</button><button type="button" class="pdB1" data-act="orgSalva">Salvar</button></div>' +
      '<div class="orgReg"><b>Regras:</b> cada tela fica em um grupo só. Até ' + GRP_MAX + ' grupos no menu de baixo, mais o Início. Dá para renomear, trocar o ícone e apagar grupos vazios. A tela Ajustes não sai do grupo dela.</div>';
    return h;
  }
  function renderOrg() {
    var el = $('v-org');
    if (!el || S.view !== 'org') return;
    var ae = document.activeElement;
    if (!S._orgForce && ae && ae.id === 'orgNome') return;
    S._orgForce = false;
    if (!S._orgD) S._orgD = orgClone(grpLista());
    el.innerHTML = orgHtml();
  }
  function orgRe() {
    S._orgForce = true;
    render();
  }
  ACT.orgAbre = function () {
    S._orgD = orgClone(grpLista());
    S._orgEd = null;
    setView('org');
  };
  ACT.orgVolta = function () {
    S._orgD = null;
    S._orgEd = null;
    setView('ajustes');
  };
  ACT.orgSalva = function () {
    S.grupos = grpLimpa(S._orgD);
    S._orgD = null;
    S._orgEd = null;
    S.grpUlt = {};
    setView('ajustes');
    say('Abas salvas.');
  };
  ACT.orgPadrao = function () {
    S._orgD = grpPadrao();
    S._orgEd = null;
    orgRe();
  };
  ACT.orgEd = function (id) {
    S._orgEd = S._orgEd === id ? null : id;
    orgRe();
    if (S._orgEd)
      setTimeout(function () {
        var i = $('orgNome');
        if (i) i.focus();
      }, 60);
  };
  ACT.orgIco = function (k) {
    var g = orgG(S._orgEd);
    if (g && ICO_D[k]) g.ico = k;
    orgRe();
  };
  ACT.orgNovo = function () {
    if (S._orgD.length >= GRP_MAX) return;
    var n = 1;
    while (orgG('g' + n)) n++;
    S._orgD.push({ id: 'g' + n, nome: 'Novo grupo', ico: 'cat', telas: [] });
    S._orgEd = 'g' + n;
    orgRe();
    setTimeout(function () {
      var i = $('orgNome');
      if (i) {
        i.focus();
        i.select();
      }
    }, 60);
  };
  ACT.orgApaga = function (id) {
    var g = orgG(id);
    if (!g || g.telas.length || g.telas.indexOf('ajustes') >= 0) return;
    S._orgD = S._orgD.filter(function (x) {
      return x.id !== id;
    });
    S._orgEd = null;
    orgRe();
  };
  document.addEventListener('input', function (e) {
    if (!e.target || e.target.id !== 'orgNome') return;
    var g = orgG(S._orgEd);
    if (g) g.nome = e.target.value.slice(0, 20) || 'Grupo';
  });
  // Arrastar uma tela para outro grupo (dedo ou mouse).
  (function () {
    var dg = null;
    function alvo(x, y) {
      if (!dg) return null;
      dg.fl.style.display = 'none';
      var e = document.elementFromPoint(x, y);
      dg.fl.style.display = '';
      return e && e.closest ? e.closest('#v-org .orgG') : null;
    }
    function fim(ok, x, y) {
      if (!dg) return;
      var d = dg;
      dg = null;
      document.removeEventListener('pointermove', mv, true);
      document.removeEventListener('pointerup', up, true);
      document.removeEventListener('pointercancel', cc, true);
      d.fl.remove();
      [].forEach.call(document.querySelectorAll('#v-org .orgG.drop'), function (g) {
        g.classList.remove('drop');
      });
      if (d.src) d.src.classList.remove('orgFant');
      if (!ok) return;
      d.fl.style.display = 'none';
      var e = document.elementFromPoint(x, y),
        g = e && e.closest ? e.closest('#v-org .orgG') : null,
        antes = e && e.closest ? e.closest('#v-org .orgT') : null;
      if (g && orgMove(d.t, g.getAttribute('data-g'), antes && antes.getAttribute('data-t') !== d.t ? antes.getAttribute('data-t') : '')) {
        vibrar(12);
        orgRe();
      }
    }
    function mv(e) {
      if (!dg || e.pointerId !== dg.id) return;
      if (!dg.on && Math.abs(e.clientX - dg.x0) + Math.abs(e.clientY - dg.y0) > 7) {
        dg.on = true;
        var r = dg.src.getBoundingClientRect(),
          f = dg.src.cloneNode(true);
        f.className = 'orgT orgVoa';
        f.style.width = r.width + 'px';
        document.body.appendChild(f);
        dg.fl = f;
        dg.dx = e.clientX - r.left;
        dg.dy = e.clientY - r.top;
        dg.src.classList.add('orgFant');
        vibrar(10);
      }
      if (!dg.on) return;
      e.preventDefault();
      dg.fl.style.left = e.clientX - dg.dx + 'px';
      dg.fl.style.top = e.clientY - dg.dy + 'px';
      var g = alvo(e.clientX, e.clientY);
      [].forEach.call(document.querySelectorAll('#v-org .orgG'), function (x) {
        x.classList.toggle('drop', x === g);
      });
    }
    function up(e) {
      if (!dg || e.pointerId !== dg.id) return;
      fim(dg.on, e.clientX, e.clientY);
    }
    function cc() {
      fim(false);
    }
    document.addEventListener('pointerdown', function (e) {
      var t = e.target.closest && e.target.closest('#v-org .orgT:not(.fix)');
      if (!t || dg || (e.pointerType === 'mouse' && e.button !== 0)) return;
      dg = { id: e.pointerId, src: t, t: t.getAttribute('data-t'), x0: e.clientX, y0: e.clientY, on: false };
      document.addEventListener('pointermove', mv, true);
      document.addEventListener('pointerup', up, true);
      document.addEventListener('pointercancel', cc, true);
    });
  })();
