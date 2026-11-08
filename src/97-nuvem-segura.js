  // ===== v468 (aprovado 08/11): NUVEM SEGURA =====
  // 1) Excluído não volta: cada modelo apagado ganha uma marca com data (S.excl). Restaurar cópia, conectar ou outro aparelho
  //    nunca trazem de volta um modelo marcado (só volta se for cadastrado de novo depois da exclusão).
  // 2) Ao conectar, o app compara a nuvem com o aparelho e o dono escolhe (nada é trocado sem escolha).
  // 3) Cópia automática até 1 h depois de qualquer mudança.
  // 4) Roubo: Ajustes › Aparelhos (desconectar um) e "Sair de todos os aparelhos" (troca a senha da nuvem).
  //    Aparelho desconectado APAGA OS PRÓPRIOS DADOS ao abrir com internet. NUNCA apaga nada na nuvem nem no site.

  // ---------- 1) marcas de excluídos ----------
  function exclMarca(ref) {
    if (!ref) return;
    if (!S.excl) S.excl = {};
    S.excl[ref] = Date.now();
  }
  // true = o modelo está excluído (a marca vale enquanto não houver cadastro novo depois dela)
  function exclMorto(ref) {
    var t = S.excl && S.excl[ref];
    if (!t) return false;
    var c = S.cad && S.cad[ref];
    return !(c > t);
  }
  // tira do aparelho tudo de modelos excluídos (o site também sai: vitFila del)
  function exclLimpa() {
    if (!S.excl) return 0;
    var n0 = S.items.length;
    S.items = S.items.filter(function (i) {
      return !exclMorto(i.ref);
    });
    Object.keys(S.excl).forEach(function (r) {
      if (!exclMorto(r)) {
        delete S.excl[r];
        return;
      }
      if (S.site && S.site[r]) {
        delete S.site[r];
        if (typeof vitFila === 'function') vitFila(r, 'del');
      }
      if (S.pprice) delete S.pprice[r];
      if (S.pcanal) delete S.pcanal[r];
      Object.keys(S.fotos || {}).forEach(function (k) {
        if (k.slice(0, k.indexOf('|')) === r) delete S.fotos[k];
      });
    });
    return n0 - S.items.length;
  }
  function exclJunta(a, b) {
    var o = {};
    [a || {}, b || {}].forEach(function (m) {
      Object.keys(m).forEach(function (k) {
        if (!(o[k] >= m[k])) o[k] = m[k];
      });
    });
    return o;
  }
  // apagar o último item de um modelo marca a exclusão
  var _limpaRefExcl0 = limpaRefExcluido;
  limpaRefExcluido = function (ref) {
    var resta = S.items.some(function (i) {
      return i.ref === ref;
    });
    if (!resta) exclMarca(ref);
    return _limpaRefExcl0.apply(this, arguments);
  };
  // restaurar uma cópia: as marcas daqui e as da cópia valem juntas; o que está marcado não volta
  var _restaurar0 = restaurarDados;
  restaurarDados = function (txt) {
    var antes = S.excl;
    var er = _restaurar0.apply(this, arguments);
    if (!er) {
      S.excl = exclJunta(antes, S.excl);
      if (exclLimpa()) {
        try {
          render();
        } catch (e) {}
      }
      saveSoon();
    }
    return er;
  };
  // sincronização entre aparelhos: movimento que recriaria um modelo excluído é ignorado
  var _syncAplica0 = syncAplica;
  syncAplica = function (St, snap, ops, feitos) {
    var ok = (ops || []).filter(function (o) {
      if (!o || o.k !== 'q') return true;
      var ref = String(o.c || '').split('|')[1];
      var existe = (St.items || []).some(function (i) {
        return i.ref === ref;
      });
      return existe || !exclMorto(ref);
    });
    return _syncAplica0.call(this, St, snap, ok, feitos);
  };
  // modelo cadastrado de novo aqui (existe no aparelho) perde a marca
  function exclConfere() {
    if (!S.excl) return;
    Object.keys(S.excl).forEach(function (r) {
      if (S.items.some(function (i) { return i.ref === r; })) delete S.excl[r];
    });
  }

  // ---------- 2) ao conectar: comparar e escolher ----------
  function nvContagem() {
    var m = {};
    (S.items || []).forEach(function (i) {
      if (i.ref) m[i.ref] = 1;
    });
    return { mod: Object.keys(m).length, ven: (S.sales || []).length };
  }
  function nvPl(n, w) {
    return n + ' ' + w + (n === 1 ? '' : 's');
  }
  function nvQuando(ts) {
    if (!ts) return '';
    var d = new Date(ts);
    return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  function nvAoConectar() {
    return nvListar()
      .then(function () {
        var L = S.nvLista || [];
        if (!L.length) return nvBackup2();
        var c = L[0],
          aqui = nvContagem(),
          vazio = !aqui.mod && nvNovo();
        S.nvCmp = c.id;
        var h =
          '<h3 class="ttT">' + (vazio ? 'Trazer seus dados da nuvem' : 'Nuvem e este aparelho') + '</h3>' +
          '<p class="ttP">' + (vazio ? 'Este aparelho está vazio. A cópia mais recente da nuvem traz inventário, vendas, clientes, caixa e fotos.' : 'Escolha quais dados ficam. Nada é trocado sem a sua escolha.') + '</p>' +
          '<div class="nvCmp"><div><small>Na nuvem</small><b>' + esc(nvQuando(c.tsr || c.ts) || c.id.split('-').reverse().join('/')) + '</b><span>' + (c.mod ? nvPl(c.mod, 'modelo') + ' · ' + nvPl(c.ven, 'venda') : c.kb + ' KB') + '</span></div>' +
          '<div><small>Neste aparelho</small><b>Agora</b><span>' + aqui.mod + ' modelos · ' + aqui.ven + ' vendas</span></div></div>' +
          '<button type="button" class="go ttOk" data-act="nvCmpTraz">Trazer meus dados da nuvem</button>' +
          '<button type="button" class="ttCan" data-act="nvCmpFica">' + (vazio ? 'Começar com o app vazio' : 'Manter os dados deste aparelho') + '</button>';
        lfaAbre('nvCmpF', h);
      })
      .then(nvCotacao)
      .catch(function () {});
  }
  ACT.nvCmpTraz = function () {
    var id = S.nvCmp;
    lfaFecha('nvCmpF');
    if (id) nvRestaurar2(id);
  };
  ACT.nvCmpFica = function () {
    lfaFecha('nvCmpF');
    // aparelho vazio nunca sobrescreve a nuvem (nvBackup já protege)
    nvBackup().catch(function () {});
  };

  // ---------- 3) cópia até 1 h depois de qualquer mudança ----------
  function nvHash(t) {
    var h = 7;
    for (var i = 0; i < t.length; i += 7) h = (h * 31 + t.charCodeAt(i)) >>> 0;
    return h.toString(36) + t.length.toString(36);
  }
  function nvAuto2() {
    if (!S.nuvem || !S.nuvem.rt || navigator.onLine === false || nvAuto2.busy) return;
    var passou = Date.now() - (S.nuvem.ts || 0);
    if (passou < 3600000) return;
    var hs = '';
    try {
      hs = nvHash(backupDados(true) + Object.keys(S.fotos || {}).length);
    } catch (e) {}
    if (hs && hs === S.nvHash && passou < 20 * 3600000) return;
    nvAuto2.busy = true;
    nvBackup()
      .then(function () {
        if (hs) S.nvHash = hs;
        saveSoon();
      })
      .catch(function () {})
      .then(function () {
        nvAuto2.busy = false;
      });
  }
  setTimeout(nvAuto2, 30000);
  setInterval(nvAuto2, 5 * 60000);

  // ---------- 4) aparelhos e roubo ----------
  function apNomeAuto() {
    var u = navigator.userAgent || '';
    var t = /iPhone|iPad/.test(u) ? 'iPhone' : /Android/.test(u) ? 'Celular Android' : /Windows/.test(u) ? 'PC Windows' : /Mac/.test(u) ? 'Mac' : 'Aparelho';
    return t;
  }
  function apId() {
    if (!S.aparelho) S.aparelho = 'AP' + Math.random().toString(36).slice(2, 6).toUpperCase();
    return S.aparelho;
  }
  // registra este aparelho (sem mexer em "rev" nem na aprovação da sincronização)
  function apReg(forca) {
    if (!S.nuvem || !S.nuvem.rt || navigator.onLine === false) return Promise.resolve();
    if (!forca && Date.now() - (apReg.t || 0) < 300000) return Promise.resolve();
    apReg.t = Date.now();
    var ap = apId();
    return nvApi(
      'PATCH',
      'backups/zap-' + ap + '?updateMask.fieldPaths=nome&updateMask.fieldPaths=ts&updateMask.fieldPaths=ap',
      JSON.stringify({ fields: { nome: nvStr(S.aparNome || apNomeAuto()), ts: { integerValue: String(Date.now()) }, ap: nvStr(ap) } })
    ).catch(function () {
      apReg.t = 0;
    });
  }
  // o dono desconectou ESTE aparelho? → apaga os dados daqui
  function apConfere() {
    if (!S.nuvem || !S.nuvem.rt || !S.aparelho || navigator.onLine === false || window.__lfApagando) return Promise.resolve();
    if (Date.now() - (apConfere.t || 0) < 45000) return Promise.resolve();
    apConfere.t = Date.now();
    return nvApi('GET', 'backups/zap-' + S.aparelho)
      .then(function (d) {
        if (d && d.fields && d.fields.rev && d.fields.rev.booleanValue) apApagaTudo('desc');
      })
      .catch(function (e) {
        void e;
      })
      .then(function () {
        return apReg();
      });
  }
  setTimeout(apConfere, 6000);
  setInterval(apConfere, 60000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) apConfere();
  });
  // acesso da nuvem revogado (senha trocada em "Sair de todos os aparelhos") → este aparelho também apaga os dados
  var _nvToken0 = nvToken;
  nvToken = function () {
    return _nvToken0.apply(this, arguments).catch(function (e) {
      var m = String((e && e.message) || '');
      if (/TOKEN_EXPIRED|INVALID_REFRESH_TOKEN|USER_DISABLED|USER_NOT_FOUND/.test(m) && S.nuvem && S.nuvem.rt) apApagaTudo('senha');
      throw e;
    });
  };
  // apaga SÓ este aparelho: memória local, fotos e listas grandes. Nuvem e site ficam intactos.
  function apApagaTudo(motivo) {
    if (window.__lfApagando) return;
    window.__lfApagando = true;
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    try {
      localStorage.setItem('lf_desc', JSON.stringify({ m: motivo || 'desc', ts: Date.now() }));
    } catch (e) {}
    var feito = false,
      fim = function () {
        if (feito) return;
        feito = true;
        try {
          location.reload();
        } catch (e) {}
      };
    try {
      var rq = indexedDB.deleteDatabase('lafouch-fotos');
      rq.onsuccess = rq.onerror = rq.onblocked = function () {
        setTimeout(fim, 150);
      };
    } catch (e) {}
    setTimeout(fim, 1800);
  }
  // nada é gravado enquanto apaga (evita o app regravar os dados por cima)
  var _salvarAgora0 = salvarAgora;
  salvarAgora = function () {
    if (window.__lfApagando) return;
    return _salvarAgora0.apply(this, arguments);
  };
  var _saveFotos0 = saveFotos;
  saveFotos = function () {
    if (window.__lfApagando) return;
    return _saveFotos0.apply(this, arguments);
  };
  function apDescInfo() {
    try {
      return JSON.parse(localStorage.getItem('lf_desc') || 'null');
    } catch (e) {
      return null;
    }
  }
  ICO_D.nuvem = '<path d="M7 18.5h10.2a4.3 4.3 0 0 0 .5-8.6A6.2 6.2 0 0 0 5.9 9.6 4.5 4.5 0 0 0 7 18.5z"/>';
  // cartão no Início do app vazio: aparelho novo, roubado/desconectado ou recém-instalado
  function nvBemVindoHtml() {
    if ((S.items || []).some(function (i) { return !i.bulk; }) || (S.nuvem && S.nuvem.rt)) return '';
    var d = apDescInfo();
    return (
      '<section class="card inFotos inNuvem" data-act="nvIr" role="button" tabindex="0"><span class="inFotIc" aria-hidden="true">' + ico('nuvem', 20) + '</span><span class="inFotTx"><b>' +
      (d ? 'Este aparelho foi desconectado' : 'Seus dados estão na nuvem?') +
      '</b><small>' +
      (d ? 'Os dados daqui foram apagados. Inventário, vendas e clientes continuam guardados na nuvem.' : 'Entre com o e-mail do catálogo e traga inventário, vendas, clientes e fotos.') +
      '</small></span><button type="button" class="inFotB" data-act="nvIr">Entrar</button></section>'
    );
  }
  ACT.nvIr = function () {
    setView('ajustes');
    setTimeout(function () {
      var e = $('nvEm');
      if (e) {
        try {
          e.scrollIntoView({ block: 'center', behavior: 'smooth' });
        } catch (x) {}
        e.focus();
      }
    }, 350);
  };
  // lista de aparelhos e "Sair de todos"
  function apCardHtml() {
    if (!S.nuvem || !S.nuvem.rt) return '';
    if (!S._syncAps && !apCardHtml.busy) {
      apCardHtml.busy = true;
      apReg(true)
        .then(function () {
          return syncListaAp();
        })
        .catch(function () {})
        .then(function () {
          apCardHtml.busy = false;
          if (!S._syncAps) S._syncAps = [];
        });
    }
    var eu = S.aparelho,
      L = (S._syncAps || []).filter(function (x) {
        return x.ap;
      });
    var h = '<section class="card col"><div><h2 style="margin:0;font-size:16px">Aparelhos</h2><div class="hint" style="margin:2px 0 0">Perdeu o celular ou foi roubado? Desconecte aqui. O aparelho desconectado apaga os dados dele ao abrir com internet; a nuvem e o site não perdem nada.</div></div>';
    if (S.apMsg) h += '<div class="note n-ok" role="status">' + esc(S.apMsg) + '</div>';
    L.forEach(function (x) {
      var esse = x.ap === eu;
      h +=
        '<div class="apLn"><span><b>' + esc(x.nome || x.ap) + (esse ? ' <small class="apEu">este aparelho</small>' : '') + '</b><small>' +
        (x.rev ? 'desconectado · apaga os dados ao abrir' : 'visto ' + (x.ts ? nvQuando(x.ts) : '—')) +
        '</small></span>' +
        (esse || x.rev ? '' : '<button type="button" class="chip" data-act="syncdesc" data-id="' + esc(x.ap) + '">' + (S._syncDesc === x.ap ? 'Confirmar' : 'Desconectar') + '</button>') +
        '</div>';
    });
    if (!L.length) h += '<div class="hint" style="margin:0">Procurando aparelhos…</div>';
    if (S.apSairT) {
      h +=
        '<div class="lbl">Sair de todos os aparelhos</div><div class="hint" style="margin:0">Troca a senha da nuvem: todo aparelho perde o acesso na hora (inclusive o roubado). Depois, entre de novo só nos seus aparelhos com a senha nova.</div>' +
        '<input class="in" id="apPw1" type="password" autocomplete="new-password" placeholder="Senha nova (6 ou mais letras/números)"><input class="in" id="apPw2" type="password" autocomplete="new-password" placeholder="Repita a senha nova">' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="mini" data-act="apSairTodos">Trocar a senha e sair de todos</button><button type="button" class="chip" data-act="apSairCancela">Cancelar</button></div>';
    } else h += '<button type="button" class="chip apSair" data-act="apSairAbre">Sair de todos os aparelhos</button>';
    return h + '</section>';
  }
  ACT.apSairAbre = function () {
    S.apSairT = true;
    S.apMsg = '';
    S._ajForce = true;
    render();
  };
  ACT.apSairCancela = function () {
    S.apSairT = false;
    S._ajForce = true;
    render();
  };
  ACT.apSairTodos = function () {
    var a = ($('apPw1') || {}).value || '',
      b = ($('apPw2') || {}).value || '';
    var msg = function (t) {
      S.apMsg = t;
      S._ajForce = true;
      render();
    };
    if (a.length < 6) return msg('A senha nova precisa ter 6 ou mais letras/números.');
    if (a !== b) return msg('As duas senhas não são iguais.');
    msg('Trocando a senha…');
    nvToken()
      .then(function (t) {
        return fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=' + nvCfg().k, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: t, password: a, returnSecureToken: true })
        }).then(nvJson);
      })
      .then(function (j) {
        // este aparelho continua conectado com a sessão nova
        if (j.refreshToken) S.nuvem.rt = j.refreshToken;
        if (j.idToken) nvTok = { t: j.idToken, exp: Date.now() + 50 * 60000 };
        saveSoon();
        // os outros aparelhos ficam marcados: se voltarem a falar com a nuvem, apagam os dados deles
        var outros = (S._syncAps || []).filter(function (x) {
          return x.ap && x.ap !== S.aparelho && !x.rev;
        });
        return Promise.all(
          outros.map(function (x) {
            return nvApi('PATCH', 'backups/zap-' + x.ap + '?updateMask.fieldPaths=rev', JSON.stringify({ fields: { rev: { booleanValue: true } } })).catch(function () {});
          })
        );
      })
      .then(function () {
        S.apSairT = false;
        msg('Pronto: todos os outros aparelhos perderam o acesso. Use a senha nova para entrar nos seus aparelhos.');
        return syncListaAp().catch(function () {});
      })
      .catch(function (e) {
        var m = String((e && e.message) || '');
        msg(/CREDENTIAL_TOO_OLD|REQUIRES_RECENT_LOGIN|TOKEN_EXPIRED/.test(m) ? 'Por segurança, desconecte e entre de novo na nuvem com a senha atual; depois troque a senha.' : 'Não consegui trocar a senha (' + (m || 'sem internet?') + ').');
      });
  };
  if (/#test/.test(location.hash)) window.__nvSeg = { exclMarca: exclMarca, exclMorto: exclMorto, exclLimpa: exclLimpa, exclConfere: exclConfere, apApagaTudo: apApagaTudo, apConfere: apConfere, apReg: apReg, nvAoConectar: nvAoConectar, nvAuto2: nvAuto2, bemVindo: nvBemVindoHtml, apCard: apCardHtml };
