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
  function hashPin(pin, salt) {
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
  function novoSal() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  // ---------- biometria (plugin do Capacitor, só no app instalado)
  function bioPlugin() {
    var P = window.Capacitor && window.Capacitor.Plugins;
    return (P && P.BiometricAuth) || null;
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
      .catch(falha);
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
    if (bo)
      bioPedir(liberar, function () {
        lockMsg('Não reconheceu. Use o PIN.');
      });
    else
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
    hashPin($('lockPin').value, S.pinSalt).then(function (h) {
      if (h === S.pinHash) return liberar();
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
    bioPedir(liberar, function () {
      lockMsg('Não reconheceu. Use o PIN.');
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
    autoBackup();
  });

  // ---------- cópias automáticas (uma por dia, guardadas no próprio app)
  var AB_DB = 'lafouch_bk',
    AB_MAX = 7;
  function abAbrir() {
    return new Promise(function (ok, no) {
      try {
        var r = indexedDB.open(AB_DB, 1);
        r.onupgradeneeded = function () {
          r.result.createObjectStore('c', { keyPath: 'dia' });
        };
        r.onsuccess = function () {
          ok(r.result);
        };
        r.onerror = function () {
          no(r.error);
        };
      } catch (e) {
        no(e);
      }
    });
  }
  function abTodas() {
    return abAbrir().then(function (db) {
      return new Promise(function (ok, no) {
        var q = db.transaction('c').objectStore('c').getAll();
        q.onsuccess = function () {
          ok(
            (q.result || []).sort(function (a, b) {
              return a.dia < b.dia ? 1 : -1;
            })
          );
        };
        q.onerror = function () {
          no(q.error);
        };
      });
    });
  }
  // Faz a cópia do dia (sem fotos, para ser leve) e apaga as mais antigas.
  function autoBackup(forcar) {
    var dia = dayKey(Date.now());
    if (!forcar && S._abDia === dia) return Promise.resolve();
    S._abDia = dia;
    var txt = backupDados(true);
    return abAbrir()
      .then(function (db) {
        return new Promise(function (ok, no) {
          var tx = db.transaction('c', 'readwrite'),
            st = tx.objectStore('c');
          st.put({ dia: dia, ts: Date.now(), kb: Math.round(txt.length / 1024), txt: txt });
          var q = st.getAllKeys();
          q.onsuccess = function () {
            q.result
              .sort()
              .reverse()
              .slice(AB_MAX)
              .forEach(function (k) {
                st.delete(k);
              });
          };
          tx.oncomplete = ok;
          tx.onerror = function () {
            no(tx.error);
          };
        });
      })
      .then(function () {
        S._abList = undefined;
        if (S.view === 'ajustes') render();
      })
      .catch(function () {
        S._abDia = '';
      });
  }
  function abCarregar() {
    if (S._abList !== undefined || S._abLoading) return;
    S._abLoading = true;
    abTodas()
      .then(function (l) {
        S._abList = l.map(function (x) {
          return { dia: x.dia, ts: x.ts, kb: x.kb };
        });
        S._abLoading = false;
        S._ajForce = true;
        renderAjustes();
      })
      .catch(function () {
        S._abList = [];
        S._abLoading = false;
      });
  }
  function abRestaurar(dia) {
    return abAbrir().then(function (db) {
      return new Promise(function (ok, no) {
        var q = db.transaction('c').objectStore('c').get(dia);
        q.onsuccess = function () {
          ok(q.result && q.result.txt);
        };
        q.onerror = function () {
          no(q.error);
        };
      });
    });
  }
  // Lembrete: quando foi o último backup guardado fora do app.
  function backupLembrete() {
    if (!S.sales.length) return '';
    var dias = S.backupTs ? Math.floor((Date.now() - S.backupTs) / DAY) : Infinity;
    if (dias < 7) return '';
    return (
      '<div class="note n-warn">' +
      (dias === Infinity ? 'Você ainda não guardou um backup fora do celular.' : 'Faz ' + dias + ' dias do último backup guardado fora do celular.') +
      ' <a href="#ajustes" data-act="view" data-id="ajustes" style="color:var(--accent-fg)">Fazer agora</a></div>'
    );
  }

  // ---------- partes da aba Ajustes: pagamento, segurança e cópias
  function ajustesFinHtml() {
    var h = '';
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Moeda principal</h2><div class="hint" style="margin:2px 0 0">Os totais, lucros e contas aparecem nesta moeda, convertidos pelo câmbio do dia. Os campos onde você digita valores também passam a usar esta moeda. As cotações continuam sempre em guaranis.</div></div><div class="nav" id="moedaPB">' +
      [['pyg', 'Guarani (G$)'], ['usd', 'Dólar (US$)'], ['brl', 'Real (R$)']]
        .map(function (m) {
          var on = (S.moedaP || 'pyg') === m[0];
          return '<button type="button" class="chip' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-act="moedap" data-id="' + m[0] + '">' + m[1] + '</button>';
        })
        .join('') +
      '</div></section>';
    // dados de exemplo
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Dados de exemplo</h2><div class="hint" style="margin:2px 0 0">Para testar: troca TUDO o que está no app por um exemplo de cerca de 14 meses (vendas, câmbio, contas pagas, compras) e fotos desenhadas.</div></div><button type="button" class="chip" data-act="exemplo">' +
      (S.exConf ? 'Toque de novo para confirmar: apaga os dados atuais' : 'Carregar exemplo de 14 meses') +
      '</button></section>';
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
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Segurança</h2><div class="hint" style="margin:2px 0 0">PIN para abrir o app' +
      (bioPlugin() ? ' e, se você quiser, digital ou rosto' : ' (digital e rosto funcionam no app instalado no celular)') +
      '.</div></div>';
    if (!pinAtivo() || S.pinNovo) {
      h +=
        '<div class="sel" style="flex-wrap:wrap"><input class="in" id="pin1" type="password" inputmode="numeric" maxlength="8" placeholder="Novo PIN (4 a 8 números)" autocomplete="off" style="flex:1 1 150px;width:auto" aria-label="Novo PIN"><input class="in" id="pin2" type="password" inputmode="numeric" maxlength="8" placeholder="Repita o PIN" autocomplete="off" style="flex:1 1 150px;width:auto" aria-label="Repita o PIN"><button class="mini" data-act="pinset">' +
        (pinAtivo() ? 'Trocar PIN' : 'Ativar PIN') +
        '</button></div><div class="hint" style="margin:0">Anote o PIN. Se esquecer, só reinstalando o app (e os dados voltam apenas pelo backup).</div>';
    } else {
      if (S._bioOk === undefined) bioChecar();
      h +=
        '<div class="note n-ok">PIN ativo.</div><div class="sel" style="flex-wrap:wrap"><div><div class="lbl">Pedir o PIN</div><select class="in" data-aj="lockmin" aria-label="Quando pedir o PIN" style="width:auto">' +
        [
          [0, 'Sempre que voltar ao app'],
          [1, 'Após 1 minuto fora'],
          [5, 'Após 5 minutos fora'],
          [15, 'Após 15 minutos fora']
        ]
          .map(function (o) {
            return '<option value="' + o[0] + '"' + (S.lockMin === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
          })
          .join('') +
        '</select></div></div>' +
        '<label style="display:flex;gap:10px;align-items:center"><input type="checkbox" data-aj="locksens"' +
        (S.lockSens !== false ? ' checked' : '') +
        '> Pedir também para restaurar backup, apagar tudo e registrar retirada</label>';
      if (bioPlugin())
        h +=
          '<label style="display:flex;gap:10px;align-items:center"><input type="checkbox" data-aj="biotog"' +
          (S.bioOn ? ' checked' : '') +
          (S._bioOk === false ? ' disabled' : '') +
          '> Usar digital ou rosto' +
          (S._bioOk === false ? ' (cadastre uma digital no celular primeiro)' : '') +
          '</label>';
      h +=
        '<div class="sel" style="flex-wrap:wrap"><button class="chip" data-act="pintroca">Trocar PIN</button><button class="chip" data-act="pinoff">' +
        (S.pinOffConf ? 'Confirmar: desativar PIN' : 'Desativar PIN') +
        '</button></div>';
    }
    h += '</section>';
    // cópias automáticas
    abCarregar();
    h +=
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Cópias automáticas</h2><div class="hint" style="margin:2px 0 0">O app guarda uma cópia por dia dentro do próprio celular (últimas ' +
      AB_MAX +
      '), sem fotos. Protege contra erro, não contra perder o celular: para isso use o backup acima e guarde o arquivo fora.</div></div>';
    (S._abList || []).forEach(function (x) {
      h +=
        '<div class="sl"><span>' +
        esc(x.dia.split('-').reverse().join('/')) +
        '<small>' +
        fh(x.ts) +
        ' · ' +
        x.kb +
        ' KB</small></span><button class="chip" data-act="abrest" data-id="' +
        x.dia +
        '">' +
        (S.abConf === x.dia ? 'Confirmar: voltar para esta cópia' : 'Restaurar') +
        '</button></div>';
    });
    if (S._abList && !S._abList.length) h += '<div class="hint" style="margin:0">Nenhuma cópia ainda.</div>';
    h += '<div><button class="mini" data-act="abagora">Fazer cópia agora</button></div></section>';
    return h;
  }
