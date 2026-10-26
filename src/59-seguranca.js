  // ===== Segurança (PIN e biometria ao abrir) e cópias automáticas dos dados. =====
  S.pinHash = '';
  S.pinSalt = '';
  S.bioOn = false;
  S.lockMin = 5; // minutos fora do app antes de pedir de novo
  S.lockSens = true; // pedir também em ações sensíveis (restaurar, apagar tudo, retirada)
  var LOCK = { locked: false, modo: 'open', cb: null, tent: 0, bloq: 0, saiuEm: 0 };

  function pinAtivo() {
    return !!S.pinHash;
  }
  // Resumo do PIN com sal (SHA-256 quando o aparelho permite, senão um resumo simples).
  function hashPinAntigo(pin, salt) {
    var txt = 'lafouch|' + salt + '|' + pin;
    function simples() {
      var h = 5381,
        i;
      for (i = 0; i < txt.length; i++) h = ((h << 5) + h + txt.charCodeAt(i)) | 0;
      return 's' + (h >>> 0).toString(16);
    }
    try {
      if (window.crypto && window.crypto.subtle && window.TextEncoder)
        return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt)).then(function (b) {
          return Array.prototype.map
            .call(new Uint8Array(b), function (x) {
              return ('0' + x.toString(16)).slice(-2);
            })
            .join('');
        });
    } catch (e) {}
    return Promise.resolve(simples());
  }
  // PIN novo: PBKDF2-SHA-256 com 150 mil voltas e sal aleatório (cada tentativa fica cara). Prefixo "p2".
  function hexDe(b) {
    return Array.prototype.map
      .call(new Uint8Array(b), function (x) {
        return ('0' + x.toString(16)).slice(-2);
      })
      .join('');
  }
  function hashPin(pin, salt) {
    try {
      if (window.crypto && window.crypto.subtle && window.TextEncoder) {
        var enc = new TextEncoder();
        return window.crypto.subtle
          .importKey('raw', enc.encode(String(pin)), 'PBKDF2', false, ['deriveBits'])
          .then(function (k) {
            return window.crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode('lafouch|' + salt), iterations: 150000 }, k, 256);
          })
          .then(function (b) {
            return 'p2' + hexDe(b);
          });
      }
    } catch (e) {}
    return hashPinAntigo(pin, salt);
  }
  // Confere o PIN digitado; quem ainda tem o resumo antigo é atualizado para o novo sem perceber.
  function confereHash(pin) {
    if (String(S.pinHash).slice(0, 2) === 'p2') return hashPin(pin, S.pinSalt).then(function (h) { return h === S.pinHash; });
    return hashPinAntigo(pin, S.pinSalt).then(function (h) {
      if (h !== S.pinHash) return false;
      var sal = novoSal();
      return hashPin(pin, sal).then(function (n) {
        S.pinSalt = sal;
        S.pinHash = n;
        try { saveSoon(); } catch (e) {}
        return true;
      });
    });
  }
  function novoSal() {
    try {
      var a = new Uint8Array(16);
      window.crypto.getRandomValues(a);
      return hexDe(a);
    } catch (e) {
      return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    }
  }

  // ---------- biometria (plugin do Capacitor, só no app instalado)
  function bioPlugin() {
    if (bioPlugin._p !== undefined && bioPlugin._p) return bioPlugin._p;
    var C = window.Capacitor,
      P = (C && C.Plugins) || {},
      nomes = ['BiometricAuth', 'BiometricAuthNative'],
      pl = null;
    // o plugin nativo se chama "BiometricAuthNative"; sem o pacote do plugin no site, ligamos pelo nome
    for (var k = 0; k < nomes.length && !pl; k++) {
      var o = P[nomes[k]];
      try {
        if (!o && C && C.registerPlugin && C.isPluginAvailable && C.isPluginAvailable(nomes[k])) o = C.registerPlugin(nomes[k]);
      } catch (e) {}
      if (o) pl = o;
    }
    if (!pl && C && C.PluginHeaders) {
      // qualquer plugin nativo que tenha checkBiometry e internalAuthenticate é o da biometria, qualquer que seja o nome
      try {
        C.PluginHeaders.forEach(function (h) {
          var ms = (h.methods || []).map(function (m) {
            return m.name;
          });
          if (!pl && ms.indexOf('checkBiometry') >= 0 && (ms.indexOf('internalAuthenticate') >= 0 || ms.indexOf('authenticate') >= 0)) {
            pl = P[h.name] || (C.registerPlugin && C.registerPlugin(h.name));
          }
        });
      } catch (e) {}
    }
    if (!pl) return null;
    // o plugin nativo usa "internalAuthenticate" no lugar de "authenticate"
    var r = {
      checkBiometry: function () {
        return pl.checkBiometry();
      },
      authenticate: function (opt) {
        return pl.authenticate ? pl.authenticate(opt) : pl.internalAuthenticate(opt);
      }
    };
    bioPlugin._p = r;
    return r;
  }
  // Nomes dos plugins nativos que o app enxerga (para diagnóstico quando a biometria não aparece).
  function bioNomes() {
    try {
      var h = (window.Capacitor && window.Capacitor.PluginHeaders) || [];
      return h
        .map(function (x) {
          return x.name;
        })
        .join(', ');
    } catch (e) {
      return '';
    }
  }
  function bioErro(e) {
    var m = e && (e.message || e.code);
    return m ? ' (' + String(m).slice(0, 80) + ')' : '';
  }
  // Pergunta ao aparelho se há digital ou rosto cadastrados (resultado guardado em S._bioOk).
  function bioChecar() {
    var b = bioPlugin();
    if (!b || !b.checkBiometry) {
      S._bioOk = false;
      return;
    }
    b.checkBiometry()
      .then(function (r) {
        S._bioOk = !!(r && r.isAvailable);
        S._bioWhy = r && !r.isAvailable ? r.reason || r.code || '' : '';
        renderAjustes();
      })
      .catch(function () {
        S._bioOk = false;
      });
  }
  function bioPedir(ok, falha) {
    var b = bioPlugin();
    if (!b) return falha();
    b.authenticate({
      reason: 'Abrir o La Fouch',
      cancelTitle: 'Usar o PIN',
      allowDeviceCredential: false,
      androidTitle: 'La Fouch',
      androidSubtitle: 'Confirme que é você'
    })
      .then(ok)
      .catch(function (e) {
        falha(e);
      });
  }

  // Cartão único de backup: arquivo manual + cópias automáticas do celular.
  function backupHtml() {
    var dias = S.backupTs ? Math.floor((Date.now() - S.backupTs) / DAY) : -1,
      h =
        '<section class="card col"><div><h2 style="margin:0;font-size:16px">Backup</h2><div class="hint" style="margin:2px 0 0">Os dados ficam só neste celular. Guarde uma cópia de vez em quando (e antes de trocar de aparelho).</div></div><div class="hint" style="margin:0">' +
        (dias < 0 ? 'Nenhum backup feito ainda.' : 'Último backup: ' + (dias === 0 ? 'hoje' : 'há ' + dias + ' dia(s)') + '.') +
        '</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="chip on" data-act="bkexp">Exportar backup</button><button class="chip" data-act="bkimp">Importar backup</button></div>' +
        (S.bkText ? '<textarea class="in" readonly rows="5" style="width:100%;font-size:12px">' + esc(S.bkText) + '</textarea>' : '');
    h += '</section>';
    return h;
  }

  // ---------- tela de bloqueio
  function lockMsg(t) {
    $('lockM').textContent = t || '';
  }
  function liberar() {
    LOCK.locked = false;
    LOCK.tent = 0;
    var ls = $('lockScr');
    if (REDUCED) ls.hidden = true;
    else {
      ls.classList.add('sai');
      setTimeout(function () {
        ls.hidden = true;
        ls.classList.remove('sai');
      }, 220);
    }
    $('lockPin').value = '';
    lockMsg('');
    var cb = LOCK.cb;
    LOCK.cb = null;
    if (cb) cb();
  }
  function mostrarLock(modo, cb) {
    LOCK.locked = true;
    LOCK.modo = modo;
    LOCK.cb = cb || null;
    $('lockScr').hidden = false;
    $('lockT').textContent = modo === 'open' ? 'La Fouch' : 'Confirme que é você';
    $('lockPin').value = '';
    lockMsg(modo === 'open' ? 'Digite o PIN para abrir.' : 'Digite o PIN para continuar.');
    $('lockCancel').hidden = modo === 'open';
    var bo = !!(S.bioOn && bioPlugin());
    $('lockBio').hidden = !bo;
    if (bo) {
      lockMsg('Confirme com a biometria ou use o PIN.');
      // um instante para a tela do app voltar ao primeiro plano antes de abrir o leitor
      setTimeout(function () {
        if (!LOCK.locked) return;
        bioPedir(liberar, function (e) {
          lockMsg('Não reconheceu. Use o PIN.' + bioErro(e));
        });
      }, 350);
    } else
      setTimeout(function () {
        try {
          $('lockPin').focus();
        } catch (e) {}
      }, 50);
  }
  function tentarPin() {
    if (Date.now() < LOCK.bloq) {
      lockMsg('Muitas tentativas. Espere ' + Math.ceil((LOCK.bloq - Date.now()) / 1000) + ' segundos.');
      return;
    }
    confereHash($('lockPin').value).then(function (ok) {
      if (ok) return liberar();
      LOCK.tent++;
      $('lockPin').value = '';
      if (LOCK.tent >= 5) {
        LOCK.tent = 0;
        LOCK.bloq = Date.now() + 30000;
        lockMsg('Muitas tentativas. Espere 30 segundos.');
      } else lockMsg('PIN incorreto. Restam ' + (5 - LOCK.tent) + ' tentativa(s).');
    });
  }
  $('lockGo').onclick = tentarPin;
  $('lockPin').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') tentarPin();
  });
  $('lockBio').onclick = function () {
    bioPedir(liberar, function (e) {
      lockMsg('Não reconheceu. Use o PIN.' + bioErro(e));
    });
  };
  $('lockCancel').onclick = function () {
    LOCK.locked = false;
    LOCK.cb = null;
    $('lockScr').hidden = true;
  };
  // Ao abrir o app: pede o PIN se estiver ativo.
  function iniciarLock() {
    if (pinAtivo()) mostrarLock('open');
  }
  // Pede o PIN antes de uma ação sensível (se o PIN estiver ativo e a opção ligada).
  function exigirAuth(fn) {
    if (!pinAtivo() || S.lockSens === false) return fn();
    mostrarLock('confirm', fn);
  }
  document.addEventListener('visibilitychange', function () {
    if (!pinAtivo()) return;
    if (document.hidden) {
      if (!LOCK.locked) LOCK.saiuEm = Date.now();
      return;
    }
    var fora = LOCK.saiuEm ? Date.now() - LOCK.saiuEm : 0;
    if (!LOCK.locked && LOCK.saiuEm && fora >= Math.max(15000, (S.lockMin || 0) * 60000)) mostrarLock('open');
  });

  // ---------- partes da aba Ajustes: pagamento e segurança
  function ajustesFinHtml() {
    var h = '';
    // formas de pagamento
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Formas de pagamento e taxas</h2><div class="hint" style="margin:2px 0 0">A taxa (%) sai do seu lucro quando a venda é paga por essa forma. Dinheiro e Pix ficam em 0%. Confira as taxas da sua maquininha.</div></div>';
    S.formas.forEach(function (f) {
      h +=
        '<div style="display:flex;gap:8px;align-items:center"><span style="flex:1 1 150px">' +
        esc(f.nome) +
        '</span><input class="in" inputmode="decimal" data-aj="ptaxa" data-id="' +
        f.id +
        '" value="' +
        String(f.taxa).replace('.', ',') +
        '" aria-label="Taxa de ' +
        esc(f.nome) +
        ' em porcentagem" style="max-width:100px"><span class="hint" style="margin:0">%</span></div>';
    });
    h += '</section>';
    // lembretes
    h +=
      '<section class="card col"><h2 style="margin:0;font-size:16px">Lembretes</h2><label style="display:flex;gap:10px;align-items:center"><input type="checkbox" data-aj="cclemb"' +
      (S.ccLemb !== false ? ' checked' : '') +
      '> Lembrar toda semana de conferir o caixa</label></section>';
    // segurança
    if (S._bioOk === undefined) bioChecar();
    var bioDisp = !!bioPlugin() && S._bioOk !== false,
      bioMotivo = !bioPlugin()
        ? 'Neste app não encontrei o componente de biometria. Instale o APK novo.' + (bioNomes() ? ' (componentes vistos: ' + esc(bioNomes()) + ')' : ' (este app está rodando fora do aplicativo instalado)')
        : S._bioOk === false
        ? 'Cadastre uma digital ou rosto nas configurações do celular primeiro' + (S._bioWhy ? ' (' + esc(S._bioWhy) + ')' : '') + '.'
        : '';
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Segurança</h2><div class="hint" style="margin:2px 0 0">Abrir o app com digital ou rosto. O PIN de emergência abre o app se a biometria falhar.</div></div>' +
      '<label class="swrow"><span>Usar biometria</span><span class="sw"><input type="checkbox" role="switch" data-aj="biotog"' +
      (S.bioOn ? ' checked' : '') +
      (bioDisp ? '' : ' disabled') +
      ' aria-label="Usar biometria"><i></i></span></label>' +
      (bioMotivo ? '<div class="hint" style="margin:0">' + bioMotivo + '</div>' : '');
    if (pinAtivo()) {
      h +=
        '<div class="lnks"><button class="lnk" data-act="pintroca">Mudar PIN</button>' +
        (S.bioOn ? '' : '<button class="lnk" data-act="pinoff">' + (S.pinOffConf ? 'Confirmar: tirar o bloqueio do app' : 'Tirar o bloqueio do app') + '</button>') +
        '</div>';
    }
    h += '</section>';
    // senha do painel do site (a conta de lafouch.com/admin)
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Senha do painel do site</h2><div class="hint" style="margin:2px 0 0">É a senha de entrada do painel (lafouch.com/admin) e da nuvem. Precisa de internet.</div></div>' +
      '<input class="in" id="spEm" type="email" autocomplete="username" placeholder="E-mail do painel" value="' + esc((S.nuvem && S.nuvem.email) || '') + '">' +
      '<input class="in" id="spA" type="password" autocomplete="current-password" placeholder="Senha atual">' +
      '<input class="in" id="spN" type="password" autocomplete="new-password" placeholder="Nova senha (mínimo 6 caracteres)">' +
      '<input class="in" id="spR" type="password" autocomplete="new-password" placeholder="Repetir nova senha">' +
      '<button class="mini" data-act="spSenha">Alterar senha</button><div class="hint" id="spMsg" style="margin:0" role="status"></div></section>';
    return h;
  }
