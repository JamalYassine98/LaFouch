  // ===== Nuvem: backup diário no Firebase (mesmo login do catálogo) e cotação da loja publicada no site. =====
  var NV = { p: 'lafouch-2f6bd', k: 'AIzaSyAW-54tS1A_VL2EC9OJWFsw1EtboptpEvc' };
  var NV_DB = 'https://firestore.googleapis.com/v1/projects/' + NV.p + '/databases/(default)/documents/';
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
    return fetch('https://securetoken.googleapis.com/v1/token?key=' + NV.k, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(S.nuvem.rt)
    })
      .then(nvJson)
      .then(function (j) {
        nvTok = { t: j.id_token, exp: Date.now() + 50 * 60000 };
        if (j.refresh_token) S.nuvem.rt = j.refresh_token;
        return nvTok.t;
      });
  }
  function nvApi(method, path, body) {
    return nvToken().then(function (t) {
      return fetch(NV_DB + path, {
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
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + NV.k, {
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
        nvMsg('Conectado. Procurando cópias na nuvem…');
        return nvBackup().then(nvCotacao);
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
                ts: { integerValue: String(Date.now()) },
                partes: { integerValue: String(n) },
                gz: { booleanValue: p.gz },
                kb: { integerValue: String(Math.round(txt.length / 1024)) }
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
  ACT.nvAgora = function () {
    nvMsg('Enviando a cópia…');
    nvBackup().catch(nvErro);
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
          l.push({ id: id, ts: +(d.fields.ts || {}).integerValue || 0, kb: +(d.fields.kb || {}).integerValue || 0 });
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
    if (S.nvConf !== dia) {
      S.nvConf = dia;
      nvMsg('Toque de novo em "Confirmar" para trocar os dados do app pela cópia de ' + dia + '.');
      return;
    }
    S.nvConf = '';
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
      })
      .catch(nvErro);
  };
  // ---------- cotação da loja no site (config/site, só o campo "cotacao")
  function nvCotacao() {
    if (!S.nuvem.rt) return Promise.resolve();
    var usd, brl;
    try {
      usd = fxLoja('usd');
      brl = fxLoja('brl');
    } catch (e) {
      return Promise.resolve();
    }
    if (!(usd > 0) || !(brl > 0)) return Promise.resolve();
    var chave = usd + '|' + brl;
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
      l = prodStats()
        .filter(function (m) {
          return no[m.ref] && m.stock > 0;
        })
        .map(function (m) {
          var d = Math.min(365, (agora - (m.last || S.appStart || agora)) / DAY);
          m.dd = Math.round(d);
          m.sc = m.stock * (1 + d / 30);
          return m;
        })
        .sort(function (a, b) {
          return b.sc - a.sc;
        })
        .slice(0, 6),
      refs = l.map(function (m) {
        return m.ref;
      }),
      mot = {};
    l.forEach(function (m) {
      mot[m.ref] = m.stock + (m.stock === 1 ? ' peça' : ' peças') + ' no estoque · ' + (m.last ? m.dd + ' dias sem vender' : 'ainda sem vendas');
    });
    var chave = JSON.stringify([refs, mot]);
    if (S.nuvem.dst === chave) return Promise.resolve();
    var mf = {};
    Object.keys(mot).forEach(function (r) {
      mf[r] = { stringValue: mot[r] };
    });
    return nvApi(
      'PATCH',
      'config/site?updateMask.fieldPaths=dauto&updateMask.fieldPaths=dmot',
      JSON.stringify({ fields: { dauto: { stringValue: refs.join(',') }, dmot: { mapValue: { fields: mf } } } })
    ).then(function () {
      S.nuvem.dst = chave;
      saveSoon();
    });
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
      '<section class="card col"><div><h2 style="margin:0;font-size:16px">Nuvem</h2><div class="hint" style="margin:2px 0 0">Cópia de segurança automática (1 por dia, as últimas ' +
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
      '</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="mini" data-act="nvAgora">Fazer cópia agora</button><button class="chip" data-act="nvSair">Desconectar</button></div>';
    if (S.nvLista && S.nvLista.length) {
      h += '<div class="lbl">Cópias na nuvem</div>';
      S.nvLista.forEach(function (c) {
        h +=
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span>' +
          esc(c.id.split('-').reverse().join('/')) +
          ' <span class="hint" style="margin:0">· ' +
          c.kb +
          ' KB</span></span><button class="chip" data-act="nvRestaurar" data-id="' +
          esc(c.id) +
          '">' +
          (S.nvConf === c.id ? 'Confirmar' : 'Restaurar') +
          '</button></div>';
      });
    }
    h += '</section>';
    return h;
  }
