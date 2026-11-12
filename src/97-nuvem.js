  // ===== Nuvem: backup diário no Firebase (mesmo login do catálogo) e cotação da loja publicada no site. =====
  var NV = { p: 'lafouch-2f6bd', k: 'AIzaSyAW-54tS1A_VL2EC9OJWFsw1EtboptpEvc' };
  // Projeto de teste (lafouch-teste): só quando a URL tem #projteste. Nunca mistura com a loja real.
  var NV_T = { p: 'lafouch-teste', k: 'AIzaSyDifvgzljzelUrabP903Z0F1m9m6snC_kU' };
  var NV_TESTE = /projteste/.test(location.hash); // lido uma vez na abertura (a navegação interna troca o #)
  function nvCfg() {
    return NV_TESTE ? NV_T : NV;
  }
  function nvDb() {
    return 'https://firestore.googleapis.com/v1/projects/' + nvCfg().p + '/databases/(default)/documents/';
  }
  var NV_PARTE = 600000; // caracteres por documento (o limite do Firestore é 1 MiB)
  var NV_GUARDA = 7; // quantos dias de cópia ficam guardados
  S.nuvem = { email: '', rt: '', ts: 0, cot: '', dst: '' }; // rt = chave de acesso (a senha nunca é guardada)
  S.nvMsg = '';
  S.nvLista = null;
  var nvTok = { t: '', exp: 0 };
  function nvMsg(t) {
    S.nvMsg = t;
    S.ajMsg = '';
    S._ajForce = true;
    if (S.view === 'ajustes') render();
  }
  function nvJson(r) {
    return r.json().then(function (j) {
      if (!r.ok) {
        var e = new Error((j && j.error && j.error.message) || 'http ' + r.status);
        e.status = r.status;
        throw e;
      }
      return j;
    });
  }
  // Token de acesso (renova com a chave guardada quando passa de 50 min).
  function nvToken() {
    if (nvTok.t && Date.now() < nvTok.exp) return Promise.resolve(nvTok.t);
    if (!S.nuvem.rt) return Promise.reject(new Error('sem-login'));
    return fetch('https://securetoken.googleapis.com/v1/token?key=' + nvCfg().k, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(S.nuvem.rt)
    })
      .then(nvJson)
      .then(function (j) {
        nvTok = { t: j.id_token, exp: Date.now() + 50 * 60000 };
        if (j.refresh_token) S.nuvem.rt = j.refresh_token;
        return nvTok.t;
      })
      .catch(function (e) {
        // sessão recusada pelo Firebase (senha trocada, conta desativada): avisa uma vez por hora; só a senha resolve
        if (e && e.status === 400 && /INVALID_REFRESH|TOKEN_EXPIRED|USER_|INVALID_GRANT/i.test(e.message || '') && Date.now() - (window.__nvVencT || 0) > 3600000) {
          window.__nvVencT = Date.now();
          lfaToast('<span class="lfa-ic">' + lfaSvg('warn') + '</span><div><b>A sessão da nuvem venceu</b><div class="hint" style="margin:0">Entre de novo em Ajustes → Nuvem (a senha é necessária só desta vez).</div></div>', 7000);
        }
        throw e;
      });
  }
  function nvApi(method, path, body) {
    return nvToken().then(function (t) {
      return fetch(nvDb() + path, {
        method: method,
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t },
        body: body
      }).then(nvJson);
    });
  }
  function nvStr(s) {
    return { stringValue: s };
  }
  // ---------- compactar (gzip → base64) quando o aparelho sabe; senão vai o texto puro
  function nvB64(bytes) {
    var s = '',
      i;
    for (i = 0; i < bytes.length; i += 8192) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
    return btoa(s);
  }
  function nvPack(txt) {
    if (typeof CompressionStream !== 'function' || typeof Response !== 'function') return Promise.resolve({ gz: false, s: txt });
    var cs = new CompressionStream('gzip'),
      w = cs.writable.getWriter();
    w.write(new TextEncoder().encode(txt));
    w.close();
    return new Response(cs.readable).arrayBuffer().then(function (b) {
      return { gz: true, s: nvB64(new Uint8Array(b)) };
    });
  }
  function nvUnpack(gz, s) {
    if (!gz) return Promise.resolve(s);
    var bin = atob(s),
      u = new Uint8Array(bin.length),
      i;
    for (i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    var ds = new DecompressionStream('gzip'),
      w = ds.writable.getWriter();
    w.write(u);
    w.close();
    return new Response(ds.readable).text();
  }
  function nvDia(ts) {
    var d = new Date(ts || Date.now());
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  // ---------- entrar / sair
  ACT.nvEntrar = function () {
    var em = ($('nvEm') || {}).value || '',
      pw = ($('nvPw') || {}).value || '';
    em = em.trim();
    if (!em || !pw) return nvMsg('Digite o e-mail e a senha do catálogo.');
    nvMsg('Entrando…');
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + nvCfg().k, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: em, password: pw, returnSecureToken: true })
    })
      .then(nvJson)
      .then(function (j) {
        S.nuvem.email = em;
        S.nuvem.rt = j.refreshToken;
        nvTok = { t: j.idToken, exp: Date.now() + 50 * 60000 };
        saveSoon();
        // bloco 5 item 5 (12/11/2026): entrada com senha manda e-mail de aviso para lafouch.eyewear@gmail.com
        try {
          if (!S.devAviso) S.devAviso = (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).replace(/[^a-z0-9]/g, '');
          fetch('https://southamerica-east1-' + nvCfg().p + '.cloudfunctions.net/login', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + j.idToken }, body: JSON.stringify({ acao: 'aviso', dev: S.devAviso, onde: 'app' }) }).catch(function () {});
        } catch (e) {}
        var lf = $('lojaFrame');
        if (lf && lf.getAttribute('src')) lf.src = LOJA_URL; // o painel abre já conectado, com esta mesma sessão
        lfaToast('<span class="lfa-ic">' + lfaSvg('check') + '</span><div><b>Nuvem conectada</b><div class="hint" style="margin:0">O painel do site entra sozinho, com a mesma conta</div></div>', 3200, 'b');
        nvMsg('Conectado. Procurando cópias na nuvem…');
        try {
          apReg(true);
        } catch (e) {}
        return nvAoConectar();
      })
      .catch(function () {
        nvMsg('E-mail ou senha incorretos (ou sem internet).');
      });
  };
  ACT.nvSair = function () {
    S.nuvem = { email: '', rt: '', ts: 0, cot: '', dst: '' };
    nvTok = { t: '', exp: 0 };
    S.nvLista = null;
    saveSoon();
    nvMsg('Desconectado da nuvem.');
  };
  // ---------- backup
  // App "zerado": sem vendas, gastos, clientes, câmbios nem compras (primeiro uso ou reinstalação).
  function nvNovo() {
    return ['sales', 'exp', 'clientes', 'cambios', 'compras'].every(function (k) {
      var v = S[k];
      return !v || (Array.isArray(v) ? !v.length : !Object.keys(v).length);
    });
  }
  // Antes de copiar, olha o que já existe na nuvem. Um app zerado nunca sobrescreve uma cópia que já está lá.
  function nvBackup() {
    return nvListar().then(function () {
      if (nvNovo() && S.nvLista && S.nvLista.length) {
        nvMsg('Já existem ' + S.nvLista.length + ' cópia(s) na nuvem. Toque em "Restaurar" na que quiser. Este app está zerado, então não enviei uma nova por cima.');
        return;
      }
      return nvBackup2();
    });
  }
  function nvBackup2() {
    var txt = backupDados();
    var dia = nvDia();
    return nvPack(txt).then(function (p) {
      var n = Math.max(1, Math.ceil(p.s.length / NV_PARTE)),
        i,
        job = Promise.resolve();
      function parte(k) {
        return nvApi(
          'PATCH',
          'backups/' + dia + '_p' + k,
          JSON.stringify({ fields: { d: nvStr(p.s.slice(k * NV_PARTE, (k + 1) * NV_PARTE)) } })
        );
      }
      for (i = 0; i < n; i++)
        (function (k) {
          job = job.then(function () {
            return parte(k);
          });
        })(i);
      return job
        .then(function () {
          return nvApi(
            'PATCH',
            'backups/' + dia,
            JSON.stringify({
              fields: {
                ts: { integerValue: String(S.siteFx ? S.siteFx.ts : Date.now()) },
                partes: { integerValue: String(n) },
                gz: { booleanValue: p.gz },
                kb: { integerValue: String(Math.round(txt.length / 1024)) },
                tsr: { integerValue: String(Date.now()) },
                mod: { integerValue: String(nvContagem().mod) },
                ven: { integerValue: String(nvContagem().ven) }
              }
            })
          );
        })
        .then(nvLimpa)
        .then(function () {
          S.nuvem.ts = Date.now();
          S.backupTs = Date.now();
          saveSoon();
          nvMsg('Cópia na nuvem feita (' + Math.round(txt.length / 1024) + ' KB).');
          return nvListar();
        });
    });
  }
  // Botão da nuvem com estado: parado, pedindo confirmação, trabalhando ou feito.
  function nvBtn(cls, act, extra, chave, txt, ocupado, feito) {
    var ic = '',
      st = '',
      lb = txt;
    if (S.nvOcup === chave) {
      st = ' busy';
      ic = '<span class="nvSp"></span>';
      lb = ocupado;
    } else if (S.nvFeito === chave) {
      st = ' ok';
      ic =
        '<svg class="nvCk" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      lb = feito;
    } else if (S.nvConf && chave === 'rest' + S.nvConf) st = ' ask';
    return (
      '<button class="' + cls + ' nvBtn' + st + '" data-act="' + act + '"' + extra + '>' + ic + '<span>' + lb + '</span></button>'
    );
  }
  // Fim de uma ação da nuvem: mostra o "feito" por um instante no botão.
  function nvFim(k) {
    S.nvOcup = '';
    S.nvFeito = k;
    S._ajForce = true;
    if (S.view === 'ajustes') render();
    setTimeout(function () {
      if (S.nvFeito !== k) return;
      S.nvFeito = '';
      S._ajForce = true;
      if (S.view === 'ajustes') render();
    }, 1700);
  }
  ACT.nvAgora = function () {
    if (S.nvOcup) return;
    S.nvOcup = 'agora';
    nvMsg('Enviando a cópia…');
    nvBackup().then(
      function () {
        nvFim('agora');
      },
      function (e) {
        S.nvOcup = '';
        nvErro(e);
      }
    );
  };
  function nvErro(e) {
    if (e && (e.status === 403 || e.status === 401))
      nvMsg('A nuvem recusou: falta liberar a pasta "backups" nas regras do Firebase (veja o aviso abaixo).');
    else if (e && e.message === 'sem-login') nvMsg('Entre com o e-mail e a senha do catálogo.');
    else nvMsg('Não foi possível falar com a nuvem agora. Tente de novo com internet.');
  }
  // Lista as cópias (um registro por dia).
  function nvListar() {
    return nvApi('GET', 'backups?pageSize=300').then(function (j) {
      var l = [];
      (j.documents || []).forEach(function (d) {
        var id = d.name.split('/').pop();
        if (/^\d{4}-\d{2}-\d{2}$/.test(id) && d.fields)
          l.push({ id: id, ts: +(d.fields.ts || {}).integerValue || 0, kb: +(d.fields.kb || {}).integerValue || 0, tsr: +(d.fields.tsr || {}).integerValue || 0, mod: +(d.fields.mod || {}).integerValue || 0, ven: +(d.fields.ven || {}).integerValue || 0 });
      });
      l.sort(function (a, b) {
        return b.id < a.id ? -1 : 1;
      });
      S.nvLista = l;
      if (S.view === 'ajustes') {
        S._ajForce = true;
        render();
      }
      return (j.documents || []).map(function (d) {
        return d.name.split('/').pop();
      });
    });
  }
  // Apaga as cópias mais antigas que NV_GUARDA dias.
  function nvLimpa() {
    return nvListar().then(function (ids) {
      var dias = ids
          .filter(function (i) {
            return /^\d{4}-\d{2}-\d{2}$/.test(i);
          })
          .sort()
          .reverse(),
        manter = dias.slice(0, NV_GUARDA),
        job = Promise.resolve();
      ids.forEach(function (i) {
        var d = i.slice(0, 10);
        if (/^\d{4}-\d{2}-\d{2}/.test(i) && manter.indexOf(d) < 0)
          job = job.then(function () {
            return nvApi('DELETE', 'backups/' + i).catch(function () {});
          });
      });
      return job;
    });
  }
  ACT.nvRestaurar = function (dia) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dia || '')) return;
    if (S.nvOcup) return;
    if (S.nvConf !== dia) {
      S.nvConf = dia;
      nvMsg('Toque de novo em "Confirmar" para trocar os dados do app pela cópia de ' + dia + '.');
      return;
    }
    S.nvConf = '';
    window.__restConfirma('Você vai trazer a cópia da nuvem de ' + dia + '.', function () {
      nvRestaurar2(dia);
    });
  };
  function nvRestaurar2(dia) {
    S.nvOcup = 'rest' + dia;
    nvMsg('Baixando a cópia…');
    nvApi('GET', 'backups/' + dia)
      .then(function (m) {
        var n = +m.fields.partes.integerValue,
          gz = !!m.fields.gz.booleanValue,
          k,
          job = Promise.resolve(''),
          out = [];
        function pega(k2) {
          return nvApi('GET', 'backups/' + dia + '_p' + k2).then(function (d) {
            out[k2] = d.fields.d.stringValue;
          });
        }
        for (k = 0; k < n; k++)
          (function (kk) {
            job = job.then(function () {
              return pega(kk);
            });
          })(k);
        return job.then(function () {
          return nvUnpack(gz, out.join(''));
        });
      })
      .then(function (txt) {
        var er = restaurarDados(txt);
        nvMsg(er || 'Cópia de ' + dia + ' restaurada.');
        nvFim('rest' + dia);
      })
      .catch(function (e) {
        S.nvOcup = '';
        nvErro(e);
      });
  };
  // ---------- cotação da loja no site (config/site, só o campo "cotacao")
  function nvCotacao() {
    if (!S.nuvem.rt) return Promise.resolve();
    var usd, brl, rpu;
    try {
      siteFxConfere();
      usd = S.siteFx ? S.siteFx.usd : fxLoja('usd');
      brl = S.siteFx ? S.siteFx.brl : fxLoja('brl');
      rpu = S.siteFx ? S.siteFx.rpu : fxBrlPorUsd();
    } catch (e) {
      return Promise.resolve();
    }
    if (!(usd > 0) || !(brl > 0)) return Promise.resolve();
    var chave = usd + '|' + brl + '|' + rpu + '|' + (S.siteFx ? S.siteFx.ts : 0);
    if (S.nuvem.cot === chave) return Promise.resolve();
    return nvApi(
      'PATCH',
      'config/site?updateMask.fieldPaths=cotacao',
      JSON.stringify({
        fields: {
          cotacao: {
            mapValue: {
              fields: {
                usd: { integerValue: String(usd) },
                brl: { integerValue: String(brl) },
                rpu: { doubleValue: rpu },
                ts: { integerValue: String(Date.now()) }
              }
            }
          }
        }
      })
    ).then(function () {
      S.nuvem.cot = chave;
      saveSoon();
    });
  }
  // ---------- destaque automático por estoque (config/site, só os campos "dauto" e "dmot")
  // Ordem de quem mais precisa girar: peças em estoque x tempo sem vender. O site escolhe o primeiro com foto.
  function nvDestaque() {
    if (!S.nuvem.rt || !Array.isArray(S.vitrine) || !S.vitrine.length) return Promise.resolve();
    var no = {};
    S.vitrine.forEach(function (r) {
      no[r] = 1;
    });
    var agora = Date.now(),
      fr = S.dstFraco || {},
      l = prodStats()
        .filter(function (m) {
          return no[m.ref] && m.stock > 0 && !(fr[m.ref] > agora - 14 * DAY);
        })
        .map(function (m) {
          var d = Math.min(365, (agora - (m.last || S.appStart || agora)) / DAY);
          m.dd = Math.round(d);
          m.sc = m.stock * (1 + d / 30);
          return m;
        })
        .sort(function (a, b) {
          return b.sc - a.sc;
        }),
      // S172-B: a lista maior de paradas (até 30) vai junto para a ordem "Vender parados"/"Equilibrada" do catálogo
      cpar = l.slice(0, 30).map(function (m) {
        return m.ref;
      }),
      cvis = (S.dstVis && S.dstVis.refs) || [],
      refs = (l = l.slice(0, 6)).map(function (m) {
        return m.ref;
      }),
      mot = {};
    l.forEach(function (m) {
      mot[m.ref] = m.stock + (m.stock === 1 ? ' peça' : ' peças') + ' no estoque · ' + (m.last ? m.dd + ' dias sem vender' : 'ainda sem vendas');
    });
    // S172-A (12/11/2026): a 1ª peça de "Girar" ficou 3 dias no destaque com poucos toques (menos de 5% das vistas,
    // com 30 vistas ou mais) → sai por 14 dias e entra a próxima peça parada. Os números vêm do Analisador (3 dias).
    var h = S.dstGir || {};
    if (refs[0] && h.ref !== refs[0]) {
      S.dstGir = { ref: refs[0], ini: agora };
      saveSoon();
    } else if (refs[0] && agora - (h.ini || agora) >= 3 * DAY && !(h.conf > agora - 6 * 3600000)) {
      h.conf = agora;
      dstConfereToques(refs[0]);
    }
    if (!S.dstVis || agora - S.dstVis.ts > 12 * 3600000) dstMaisVistos();
    var chave = JSON.stringify([refs, mot, cpar, cvis]);
    if (S.nuvem.dst === chave) return Promise.resolve();
    var mf = {};
    Object.keys(mot).forEach(function (r) {
      mf[r] = { stringValue: mot[r] };
    });
    return nvApi(
      'PATCH',
      'config/site?updateMask.fieldPaths=dauto&updateMask.fieldPaths=dmot&updateMask.fieldPaths=cpar&updateMask.fieldPaths=cvis',
      JSON.stringify({ fields: { dauto: { stringValue: refs.join(',') }, dmot: { mapValue: { fields: mf } }, cpar: { stringValue: cpar.join(',') }, cvis: { stringValue: cvis.join(',') } } })
    ).then(function () {
      S.nuvem.dst = chave;
      saveSoon();
    });
  }
  // S172-B: os mais vistos da semana (Analisador, 7 dias), no máximo a cada 12 h; só os códigos vão ao site
  function dstMaisVistos() {
    S.dstVis = { ts: Date.now(), refs: (S.dstVis && S.dstVis.refs) || [] };
    return nvToken()
      .then(function (t) {
        return fetch('https://southamerica-east1-' + nvCfg().p + '.cloudfunctions.net/analise', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t }, body: JSON.stringify({ acao: 'resumo', dias: 7 }) });
      })
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        if (!j || !j.ok) return;
        S.dstVis = { ts: Date.now(), refs: (j.pecas || []).slice(0, 20).map(function (x) { return x[0]; }), an: j };
        saveSoon();
      })
      .catch(function () {});
  }
  function dstConfereToques(ref) {
    return nvToken()
      .then(function (t) {
        return fetch('https://southamerica-east1-' + nvCfg().p + '.cloudfunctions.net/analise', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t }, body: JSON.stringify({ acao: 'resumo', dias: 3 }) });
      })
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        if (!j || !j.ok) return;
        var v = (j.destaqueVistas || {})[ref] || 0,
          tq = (j.destaqueToques || {})[ref] || 0;
        if (dstFraca(v, tq)) {
          S.dstFraco = S.dstFraco || {};
          S.dstFraco[ref] = Date.now();
          S.dstGir = null;
          saveSoon();
          nvDestaque();
        }
      })
      .catch(function () {});
  }
  function dstFraca(v, t) {
    return v >= 30 && t / v < 0.05;
  }
  // ---------- automático: cópia a cada ~20 h e cotação quando muda
  function nvAuto() {
    if (!S.nuvem || !S.nuvem.rt || navigator.onLine === false) return;
    var p = S.nvLista ? Promise.resolve() : nvListar();
    if (!S.nuvem.ts || Date.now() - S.nuvem.ts > 20 * 3600000) p = p.then(nvBackup);
    p.then(nvCotacao)
      .then(nvDestaque)
      .catch(function () {});
  }
  setTimeout(nvAuto, 20000);
  setInterval(nvAuto, 15 * 60000);
  // ---------- cartão em Ajustes
  function nvCard() {
    var h =
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Nuvem</h2><div class="hint" style="margin:2px 0 0">Cópia de segurança automática (até 1 h depois de qualquer mudança; guarda a última de cada dia, as últimas ' +
      NV_GUARDA +
      ') e cotação da loja no site. Usa o mesmo e-mail e senha do catálogo.</div></div>';
    if (S.nvMsg) h += '<div class="note n-ok" role="status">' + esc(S.nvMsg) + '</div>';
    if (!S.nuvem.rt) {
      h +=
        '<input class="in" id="nvEm" type="email" autocomplete="username" placeholder="E-mail do catálogo" value="' +
        esc(S.nuvem.email || '') +
        '"><input class="in" id="nvPw" type="password" autocomplete="current-password" placeholder="Senha"><button class="mini" data-act="nvEntrar">Conectar à nuvem</button></section>';
      return h;
    }
    if (S.nvLista === null && !nvCard.busy) {
      nvCard.busy = true;
      setTimeout(function () {
        nvListar()
          .catch(function () {})
          .then(function () {
            nvCard.busy = false;
            if (S.nvLista === null) S.nvLista = [];
          });
      }, 0);
    }
    h +=
      '<div class="hint" style="margin:0">Conectado como <b>' +
      esc(S.nuvem.email) +
      '</b>' +
      (S.nuvem.ts ? ' · última cópia: ' + new Date(S.nuvem.ts).toLocaleString('pt-BR') : '') +
      '</div><div style="display:flex;gap:8px;flex-wrap:wrap">' + nvBtn('mini', 'nvAgora', '', 'agora', 'Fazer cópia agora', 'Enviando…', 'Cópia feita') + '<button class="chip" data-act="nvSair">Desconectar</button></div>';
    if (S.nvLista && S.nvLista.length) {
      h += '<div class="lbl">Cópias na nuvem</div>';
      S.nvLista.forEach(function (c) {
        h +=
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span>' +
          esc(c.id.split('-').reverse().join('/')) +
          ' <span class="hint" style="margin:0">· ' +
          c.kb +
          ' KB</span></span>' +
          nvBtn(
            'chip',
            'nvRestaurar',
            ' data-id="' + esc(c.id) + '"',
            'rest' + c.id,
            S.nvConf === c.id ? 'Confirmar' : 'Restaurar',
            'Restaurando…',
            'Restaurada'
          ) +
          '</div>';
      });
    }
    h += '</section>';
    return h;
  }
