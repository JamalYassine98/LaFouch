  // ===== Aba Site: a vitrine do lafouch.com. O dono escolhe o que vai; esgotado nunca entra e sai sozinho depois de N dias. =====
  var LOJA_URL = 'https://lafouch.com/admin.html';
  var MODO_ICO = {
    lista: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    grade: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'
  };
  function modoDe(aba) {
    return (S.vModo && S.vModo[aba]) || 'g';
  }
  // Botão da lupa: mostra o modo PARA ONDE vai trocar (em grade mostra "lista" e vice-versa).
  function modoBtn(btnEl, aba) {
    var m = modoDe(aba);
    btnEl.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (m === 'g' ? MODO_ICO.lista : MODO_ICO.grade) + '</svg>';
    btnEl.setAttribute('aria-label', m === 'g' ? 'Mostrar em lista' : 'Mostrar em catálogo');
    btnEl.onclick = function () {
      if (!S.vModo) S.vModo = {};
      S.vModo[aba] = m === 'g' ? 'l' : 'g';
      saveSoon();
      render();
    };
  }
  /* a vitrine é o que o dono liberou no Inventário (S.site); S.vitrine é só a lista derivada */
  function vitRefs() {
    return (S.vitrine = Object.keys(S.site || {}));
  }
  function vitDias() {
    return S.vitDias > 0 ? S.vitDias : 14;
  }
  function vitInfo(ref) {
    var it = itemDoRef(ref),
      est = estoqueDoRef(ref);
    return { it: it, est: est, tipo: it ? it.tipo : '', nome: pubNome(ref), preco: it ? precoAtual(ref, it.tipo) : 0, foto: photoOf(ref) };
  }
  // Esgotado nunca é publicado; o que já está no ar e esgota fica "Esgotado" por N dias e sai sozinho.
  function vitManutencao() {
    var l = vitRefs(),
      ch = false;
    if (!S.esgDesde) S.esgDesde = {};
    l.slice().forEach(function (ref) {
      var est = estoqueDoRef(ref);
      if (est > 0) {
        if (S.esgDesde[ref]) {
          delete S.esgDesde[ref];
          ch = true;
        }
        return;
      }
      if (!S.esgDesde[ref]) {
        S.esgDesde[ref] = Date.now();
        ch = true;
      } else if (Date.now() - S.esgDesde[ref] > vitDias() * 864e5) {
        delete S.esgDesde[ref];
        siteSet(ref, false);
        ch = true;
      }
    });
    if (ch) saveSoon();
  }
  // ---- publicar no site (Firestore, pelo login da Nuvem)
  function vTf(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'string') return { stringValue: v };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return !isFinite(v) ? { integerValue: '0' } : Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(vTf) } };
    var f = {};
    Object.keys(v).forEach(function (k) {
      f[k] = vTf(v[k]);
    });
    return { mapValue: { fields: f } };
  }
  function vBody(o) {
    var f = {};
    Object.keys(o).forEach(function (k) {
      f[k] = vTf(o[k]);
    });
    return JSON.stringify({ fields: f });
  }
  // aviso automático do cartão (nunca escolhido à mão): esgotado > últimas unidades > chegou esta semana
  function siteAviso(ref) {
    var e = estoqueDoRef(ref);
    if (e <= 0) return 'Esgotado';
    if (e === 1) return 'Última unidade';
    if (e <= 3) return 'Últimas ' + e + ' unidades';
    var c = (S.cad && S.cad[ref]) || 0;
    return c && Date.now() - c < 7 * 864e5 ? 'Chegou esta semana' : '';
  }
  var RAIO_DE = { Redondo: 40, Quadrado: 8, Retangular: 6, Gatinho: 22, Aviador: 30, Oval: 26, Hexagonal: 20 };
  // "53□18-140" → [53, 18, 140]; sem medidas válidas devolve []
  function parseMed(t) {
    var m = String(t || '').match(/(\d{2})\D{1,3}(\d{1,2})\D{1,3}(\d{3})/);
    return m ? [+m[1], +m[2], +m[3]] : [];
  }
  function fotoHash(u) {
    var h = u ? u.length : 0;
    for (var i = 0; i < (u || '').length; i += 97) h = (h * 31 + u.charCodeAt(i)) >>> 0;
    return h;
  }
  // cores que vão para o site: só as que têm foto; as com estoque primeiro (a primeira é a foto do cartão)
  function vitCores(ref) {
    return siteCores(ref)
      .filter(function (c) {
        return c.foto;
      })
      .sort(function (x, y) {
        return (y.qty > 0) - (x.qty > 0);
      })
      .slice(0, 8);
  }
  // Graus à venda de um óculos pré-graduado: do menor ao maior, com a quantidade total de cada grau.
  function vitGraus(ref) {
    var m = {};
    S.items.forEach(function (i) {
      if (i.ref !== ref || i.tipo !== 'pre' || !i.grau) return;
      m[i.grau] = (m[i.grau] || 0) + Math.max(0, i.qty || 0);
    });
    return Object.keys(m)
      .sort(function (a, b) {
        return parseFloat(String(a).replace(',', '.')) - parseFloat(String(b).replace(',', '.'));
      })
      .map(function (g) {
        return { g: g, q: m[g] };
      });
  }
  function vitGrausCor(ref, cs) {
    var G = vitGraus(ref).map(function (g) { return g.g; });
    if (!G.length) return [];
    return cs.map(function (c) {
      return G.map(function (g) {
        return S.items.reduce(function (n, i) {
          return n + (i.ref === ref && i.tipo === 'pre' && i.cor === c.cor && i.grau === g ? Math.max(0, i.qty || 0) : 0);
        }, 0);
      }).map(function (q, k) {
        // v476 (S24, aprovado 09/11): "-" = esse grau não existe nessa cor (o site esconde); 0 = existe mas esgotou (o site risca)
        var tem = S.items.some(function (i) {
          return i.ref === ref && i.tipo === 'pre' && i.cor === c.cor && i.grau === G[k];
        });
        return tem ? q : '-';
      }).join(',');
    });
  }
  // v476 (S27h, aprovado 09/11): o código é o nome; o site monta a descrição com formato (fm), material e marca de verdade (mr).
  // Título da página: tipo + marca + formato ("Óculos de leitura quadrado", "Armação Kazwini gatinho"). Sem cor, nada inventado.
  // Sem formato e sem marca marcados: continua o nome de antes.
  var VIT_FM = { Redondo: ['redondo', 'redonda'], Quadrado: ['quadrado', 'quadrada'], Retangular: ['retangular', 'retangular'], Gatinho: ['gatinho', 'gatinho'], Aviador: ['aviador', 'aviador'], Oval: ['oval', 'oval'], Hexagonal: ['hexagonal', 'hexagonal'] };
  function vitTitulo(ref, tipo, a, velho) {
    var fm = String(a.formato || '').trim(),
      mr = String(a.marca || '').trim();
    if (!fm && !mr) return velho;
    var arm = tipo !== 'pre' && tipo !== 'solar',
      base = tipo === 'pre' ? 'Óculos de leitura' : tipo === 'solar' ? 'Óculos de sol' : 'Armação',
      F = VIT_FM[fm],
      adj = F ? F[arm ? 1 : 0] : fm.toLowerCase();
    return base + (mr ? ' ' + mr : '') + (adj ? ' ' + adj : '');
  }
  function vitProduto(ref) {
    var v = vitInfo(ref),
      a = attrOf(ref),
      pp = S.pprice && S.pprice[ref],
      solar = v.tipo === 'solar',
      cs = vitCores(ref);
    return {
      ref: ref,
      nome: vitTitulo(ref, v.tipo, a, v.nome),
      fm: a.formato || '',
      mr: a.marca || '',
      tipo: solar ? 'solar' : v.tipo === 'pre' ? 'grau' : 'armacao',
      n: sitePrecoOferta(ref, v.preco || 0, pp && pp.ant > v.preco ? pp.ant : 0, v.tipo).n,
      de: sitePrecoOferta(ref, v.preco || 0, pp && pp.ant > v.preco ? pp.ant : 0, v.tipo).de,
      est: v.est,
      aviso: siteAviso(ref),
      tag: solar ? 'SOLAR' : v.tipo === 'pre' ? 'LEITURA' : 'ARMAÇÃO',
      mat: a.material || '',
      gen: a.publico === 'Masculino' ? 'm' : a.publico === 'Feminino' ? 'f' : 'u',
      cor: cs.length ? hexOf(cs[0].cor) : '#2a2d33',
      cores: cs.map(function (c) {
        return hexOf(c.cor);
      }),
      cn: cs.map(function (c) {
        return c.cor;
      }),
      qs: cs.map(function (c) {
        return c.qty;
      }),
      raio: RAIO_DE[a.formato] != null ? RAIO_DE[a.formato] : 14,
      med: parseMed(v.it && v.it.med),
      rosto: ROSTO_DE[a.formato] || ['oval'],
      uv: solar,
      cad: (S.cad && S.cad[ref]) || 0,
      lib: true,
      desc: S.desc && S.desc[ref] != null ? String(S.desc[ref]).trim().slice(0, 600) : '',
      gr: vitGraus(ref).map(function (g) { return g.g; }),
      gq: vitGraus(ref).map(function (g) { return g.q; }),
      // v475 (aprovado 09/11): graus de CADA cor, na ordem de 'cores' e de 'gr' (texto "q,q,q" por cor; o site risca o grau que não tem na cor)
      gc: vitGrausCor(ref, cs),
      gv: giroGv(ref)
    };
  }
  function vitFila(ref, op) {
    if (!S.vitPend) S.vitPend = {};
    S.vitPend[ref] = op;
    saveSoon();
  }
  var VIT_CAMPOS = ['nome', 'tipo', 'n', 'de', 'est', 'aviso', 'tag', 'mat', 'gen', 'cor', 'cores', 'cn', 'qs', 'raio', 'med', 'rosto', 'uv', 'cad', 'lib', 'desc', 'gr', 'gq', 'gc', 'gv', 'fv', 'fm', 'mr'];
  function vitFotos(ref) {
    return vitCores(ref).map(function (c) {
      return S.fotos[ref + '|' + c.cor];
    });
  }
  function vitSig(ref) {
    var o = vitProduto(ref);
    o.fv = vitFotos(ref).map(fotoHash).join('.');
    return o;
  }
  // A cada minuto: o app compara o que está liberado com o que já foi enviado e enfileira só o que mudou.
  function vitConfere() {
    try {
      siteFxConfere();
    } catch (e) {}
    if (!S.nuvem || !S.nuvem.rt || navigator.onLine === false) return Promise.resolve();
    if (!vitConfere.sig) vitConfere.sig = {};
    Object.keys(S.site || {}).forEach(function (ref) {
      // 08/11: um produto com problema não impede a conferência dos outros
      try {
        if (!itemDoRef(ref)) {
          delete S.site[ref];
          vitFila(ref, 'del');
          return;
        }
        if (S.vitPend && S.vitPend[ref]) return;
        if (!(vitProduto(ref).n > 0)) return;
        var sg = JSON.stringify(vitSig(ref));
        if (vitConfere.sig[ref] !== sg) vitFila(ref, 'upd');
      } catch (e) {
        vitErro(ref, e);
      }
    });
    return vitSync();
  }
  setTimeout(vitConfere, 4000);
  setInterval(vitConfere, 60000);
  // 08/11: envio na hora — qualquer mudança salva (venda, edição, troca de tipo) confere o site em ~1 s
  function vitAgora() {
    clearTimeout(vitAgora.t);
    vitAgora.t = setTimeout(function () {
      try {
        vitConfere();
      } catch (e) {}
    }, 900);
  }
  window.addEventListener('online', vitAgora);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) vitAgora();
  });
  // erro do envio: fica só interno (sem tela), com espera crescente por produto
  function vitErro(ref, e) {
    if (!S.vitErr) S.vitErr = {};
    var o = S.vitErr[ref] || { n: 0 };
    o.n++;
    o.ts = Date.now();
    o.st = (e && e.status) || 0;
    o.m = String((e && e.message) || e || '').slice(0, 200);
    S.vitErr[ref] = o;
  }
  function vitEspera(ref) {
    var o = S.vitErr && S.vitErr[ref];
    if (!o) return 0;
    return Math.max(0, o.ts + Math.min(60000, 3000 * Math.pow(2, Math.min(5, o.n - 1))) - Date.now());
  }
  // chamada à nuvem que nunca fica pendurada: desiste em 15 s; token recusado → renova e tenta 1 vez
  function vitApi(method, path, body, tentou) {
    var ac = typeof AbortController === 'function' ? new AbortController() : null,
      tm;
    var corre = nvToken().then(function (t) {
      return fetch(nvDb() + path, { method: method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t }, body: body, signal: ac ? ac.signal : undefined }).then(nvJson);
    });
    var limite = new Promise(function (_, rej) {
      tm = setTimeout(function () {
        try {
          if (ac) ac.abort();
        } catch (x) {}
        var e = new Error('tempo');
        e.status = 408;
        rej(e);
      }, 15000);
    });
    return Promise.race([corre, limite]).then(
      function (j) {
        clearTimeout(tm);
        return j;
      },
      function (e) {
        clearTimeout(tm);
        if (!tentou && e && (e.status === 401 || e.status === 403)) {
          try {
            nvTok = { t: '', exp: 0 };
          } catch (x) {}
          return vitApi(method, path, body, true);
        }
        throw e;
      }
    );
  }
  function vitDocBody(ref, o) {
    var f = {};
    VIT_CAMPOS.forEach(function (k) {
      f[k] = o[k];
    });
    // versão das fotos (número inteiro, o site só compara se mudou)
    f.fv = vitFotos(ref).reduce(function (h, u) {
      return (h * 31 + fotoHash(u)) >>> 0;
    }, 7);
    return f;
  }
  function vitSync() {
    var pend = S.vitPend || {};
    if (!S.nuvem || !S.nuvem.rt || navigator.onLine === false) return Promise.resolve();
    // trava de segurança: um envio nunca segura a fila por mais de 1 minuto
    if (vitSync.busy && Date.now() - vitSync.busy < 60000) return Promise.resolve();
    var refs = Object.keys(pend).filter(function (r) {
      return vitEspera(r) <= 0;
    });
    if (!refs.length) return Promise.resolve();
    var meu = (vitSync.busy = Date.now()),
      mudou = 0;
    if (!S.vitFoto) S.vitFoto = {};
    // cada produto é independente: o erro de um não atrasa nem impede os outros
    return Promise.all(
      refs.map(function (ref) {
        return vitUm(ref, pend[ref]).then(
          function () {
            if (S.vitPend && S.vitPend[ref] === pend[ref]) delete S.vitPend[ref];
            if (S.vitErr) delete S.vitErr[ref];
            mudou++;
          },
          function (e) {
            vitErro(ref, e);
          }
        );
      })
    ).then(function () {
      if (vitSync.busy === meu) vitSync.busy = 0;
      if (mudou) {
        // avisa o site aberto (um só campo, leitura barata) que os produtos mudaram
        vitApi('PATCH', 'config/site?updateMask.fieldPaths=pv', vBody({ pv: Date.now() })).catch(function () {});
        saveSoon();
      }
      if (S.view === 'onl') render();
      var falta = Object.keys(S.vitPend || {});
      if (falta.length) {
        var w = Math.min.apply(null, falta.map(vitEspera));
        clearTimeout(vitSync.t);
        vitSync.t = setTimeout(vitSync, Math.max(1500, w + 200));
      }
    });
  }
  function vitUm(ref, op) {
    if (op === 'del' || !S.site || !S.site[ref]) {
      var dels = [vitApi('DELETE', 'produtos/' + ref).catch(function () {})];
      for (var k = 0; k < 8; k++) dels.push(vitApi('DELETE', 'fotos/' + ref + (k ? '~' + k : '')).catch(function () {}));
      return Promise.all(dels).then(function () {
        delete S.vitFoto[ref];
      });
    }
    var u = vitProduto(ref);
    if (!(u.n > 0)) return Promise.resolve();
    var fs = vitFotos(ref),
      body = vitDocBody(ref, u),
      sg = JSON.stringify(vitSig(ref)),
      hs = fs.map(fotoHash).join('.'),
      fotoOk = S.vitFoto[ref] === hs,
      campos = VIT_CAMPOS.filter(function (m) {
        return fotoOk || m !== 'fv';
      }),
      mask = function (l) {
        return l.map(function (m) { return 'updateMask.fieldPaths=' + m; }).join('&');
      };
    var dados = {};
    campos.forEach(function (m) {
      dados[m] = body[m];
    });
    dados.ref = ref;
    // 1º os dados (estoque, preço, tipo): chegam ao site mesmo se a foto demorar ou falhar
    return vitApi('PATCH', 'produtos/' + ref + '?' + mask(campos) + '&updateMask.fieldPaths=ref', vBody(dados)).then(function () {
      if (fotoOk) {
        if (!vitConfere.sig) vitConfere.sig = {};
        vitConfere.sig[ref] = sg;
        return;
      }
      // 2º as fotos, e só depois a versão delas (o site só troca a foto quando todas chegaram)
      return fs
        .reduce(function (q, d, i) {
          return q.then(function () {
            return vitApi('PATCH', 'fotos/' + ref + (i ? '~' + i : ''), vBody({ d: d }));
          });
        }, Promise.resolve())
        .then(function () {
          return vitApi('PATCH', 'produtos/' + ref + '?updateMask.fieldPaths=fv', vBody({ fv: body.fv }));
        })
        .then(function () {
          S.vitFoto[ref] = hs;
          if (!vitConfere.sig) vitConfere.sig = {};
          vitConfere.sig[ref] = sg;
        });
    });
  }
  // Aba Site: o painel completo ocupa a tela; o botão de tela cheia fica dentro do painel, ao lado de "Cliente"
  window.addEventListener('message', function (e) {
    var f = $('lojaFrame');
    if (!f || e.source !== f.contentWindow || !e.data) return;
    // login único: o painel pede a sessão da nuvem ao app (com biometria/PIN do app quando ligados) ou entrega a que o dono acabou de digitar
    if (e.data.lfSess) {
      var origemOk = e.origin === LOJA_URL.replace(/^(https?:\/\/[^/]+).*$/, '$1') || (window.__sessOrigens || []).indexOf(e.origin) >= 0;
      if (!origemOk) return;
      var reS = function (v) {
        try {
          f.contentWindow.postMessage({ lfSessR: v, id: e.data.id }, e.origin);
        } catch (x) {}
        if (window.__sessOrigens) window.__sessUlt = v;
      };
      if (e.data.lfSess === 'get') {
        if (!(S.nuvem && S.nuvem.rt)) return reS('none');
        var trava = !!(pinAtivo() || (S.bioOn && bioPlugin()));
        var entrega = function (conf) {
          reS({ rt: S.nuvem.rt });
          if (conf) lfaToast('<span class="lfa-ic">' + lfaSvg('check') + '</span><div><b>Acesso renovado</b><div class="hint" style="margin:0">Nuvem e painel conectados</div></div>', 2800, 'b');
        };
        if (!trava) entrega(false);
        else
          mostrarLock(
            'confirm',
            function () {
              entrega(true);
            },
            function () {
              reS('cancel');
            }
          );
      } else if (e.data.lfSess === 'put') {
        var rt = String(e.data.rt || '');
        if (rt.length > 20 && rt.length < 3000 && !(S.nuvem && S.nuvem.rt)) {
          S.nuvem.rt = rt;
          S.nuvem.email = String(e.data.email || '').slice(0, 120);
          nvTok = { t: '', exp: 0 };
          saveSoon();
          lfaToast('<span class="lfa-ic">' + lfaSvg('check') + '</span><div><b>Nuvem conectada</b><div class="hint" style="margin:0">Mesma conta do painel</div></div>', 3000, 'b');
          nvToken()
            .then(nvBackup)
            .then(nvCotacao)
            .catch(function () {})
            .then(function () {
              if (S.view === 'ajustes') {
                S._ajForce = true;
                render();
              }
            });
        }
      }
      return;
    }
    // o painel pede a biometria do app para abrir (a do navegador não funciona dentro do app)
    if (e.data.lfBio) {
      var re = function (r) {
        try {
          f.contentWindow.postMessage({ lfBioR: r, id: e.data.id }, e.origin && e.origin !== 'null' ? e.origin : '*');
        } catch (x) {}
      };
      // vale só com a biometria ligada em Ajustes › Segurança (que exige o PIN); a confirmação é a mesma do app: biometria ou PIN
      var exige = !!(S.bioOn && bioPlugin() && pinAtivo());
      if (e.data.lfBio === 'check') re(exige ? 'yes' : 'no');
      else if (e.data.lfBio === 'ask') {
        if (!exige) re('ok');
        else
          mostrarLock(
            'confirm',
            function () {
              re('ok');
            },
            function () {
              re('no');
            }
          );
      }
      return;
    }
    // o painel pede para abrir um modelo no Inventário (ex.: modelo sem foto)
    if (e.data.lfAbrir) {
      var rf = String(e.data.lfAbrir),
        ri = S.items.filter(function (i) {
          return i.ref === rf && !i.bulk;
        });
      if (!ri.length) {
        lfToast('Este produto não está no Inventário do app.');
        return;
      }
      S.siteFull = false;
      S.todos = false;
      S.lotesView = false;
      S.tipo = ri[0].tipo;
      S.fmtF = 'all';
      S.corF = 'all';
      S.q = '';
      S.open = rf;
      S.det = true;
      S.selItem = null;
      S.detCor = '';
      S.detVr = null;
      S.qty = 1;
      setView('estoque');
      return;
    }
    if (typeof e.data.lfFull !== 'boolean') return;
    S.siteFull = e.data.lfFull;
    render();
  });
  function renderLojaOnline() {
    var el = $('v-onl');
    if (!el || S.view !== 'onl') return;
    vitManutencao();
    if (!el.getAttribute('data-sk')) {
      el.setAttribute('data-sk', '1');
      el.textContent = '';
      var host = mk('div', 'catbar3');
      host.id = 'uniS';
      el.appendChild(host);
      var sb = mk('div', 'sbox');
      sb.id = 'siteBox';
      var fr = mk('iframe');
      fr.id = 'lojaFrame';
      fr.title = 'Painel da loja online';
      fr.allow = 'clipboard-write';
      sb.appendChild(fr);
      var off = mk('section', 'card');
      off.id = 'siteOff';
      off.style.cssText = 'text-align:center;padding:22px';
      off.innerHTML = '<b style="font-size:17px">Sem internet</b><p style="color:var(--mu);margin:8px 0 14px">O painel do site só abre com internet, porque os dados ficam na nuvem.</p>';
      off.appendChild(btn('mini', 'Tentar de novo', function () {
        $('lojaFrame').src = LOJA_URL;
        render();
      }));
      sb.appendChild(off);
      el.appendChild(sb);
    }
    var l = vitRefs(),
      no = l.filter(function (r) {
        return estoqueDoRef(r) > 0;
      }).length;
    var online = navigator.onLine !== false;
    $('siteOff').hidden = online;
    $('lojaFrame').hidden = !online;
    if (online && !$('lojaFrame').getAttribute('src')) $('lojaFrame').src = onlUrl();
    $('siteBox').classList.toggle('full', !!S.siteFull);
    uniAbasFill();
    vitSync();
  }
  window.addEventListener('online', function () {
    if (S.view === 'onl') render();
  });
  ACT.lojaRecarregar = function () {
    render();
  };
  // ===== v-b9 (11/11/2026, S133): atalhos do Início para as abas do painel (Mensagens, Analisador, Temática, Atacado) =====
  // O painel conta as mensagens novas, os avisos do Analisador e o próximo evento e manda para o app (lfResumo); o app guarda o último resumo.
  function onlAbaDe(id) {
    return id === 'ata' ? { aba: 'msg', mf: 'atacado' } : id === 'msg' ? { aba: 'msg', mf: 'all' } : { aba: id, mf: '' };
  }
  function onlUrl() {
    var a = S.onlAba ? onlAbaDe(S.onlAba) : null;
    return LOJA_URL + (a ? '?aba=' + a.aba + (a.mf ? '&mf=' + a.mf : '') : '');
  }
  function onlPainel(id) {
    window.__onlAba = id;
    S.onlPend = onlAbaDe(id);
    setView('onl');
    var f = $('lojaFrame');
    if (f && f._pronto) {
      try {
        f.contentWindow.postMessage({ lfGo: S.onlPend.aba, mf: S.onlPend.mf }, '*');
      } catch (e) {}
      S.onlPend = null;
    }
  }
  function pnlFaixa(id) {
    var r = S.pnlRes || {};
    if (id === 'msg') return r.msg ? [r.msg + (r.msg === 1 ? ' nova' : ' novas'), 'w'] : ['Contato e atacado', ''];
    if (id === 'ata') return r.ata ? [r.ata + (r.ata === 1 ? ' orçamento novo' : ' orçamentos novos'), 'w'] : ['Orçamentos', ''];
    if (id === 'anl') return r.av ? [r.av + (r.av === 1 ? ' aviso' : ' avisos'), 'w'] : ['Visitas do site', ''];
    var p = r.prox,
      ag = Date.now();
    if (p && p.fim >= ag) {
      if (p.ini <= ag) return [p.nm + ' no ar', 'g'];
      var d = Math.max(1, Math.ceil((p.ini - ag) / DAY));
      return [p.nm + ' em ' + d + (d === 1 ? ' dia' : ' dias'), ''];
    }
    return ['Calendário do site', ''];
  }
  window.addEventListener('message', function (e) {
    var f = $('lojaFrame');
    if (!f || e.source !== f.contentWindow || !e.data) return;
    if (e.data.lfPronto) {
      f._pronto = true;
      if (S.onlPend) {
        try {
          f.contentWindow.postMessage({ lfGo: S.onlPend.aba, mf: S.onlPend.mf }, '*');
        } catch (x) {}
        S.onlPend = null;
      }
      return;
    }
    if (e.data.lfResumo && typeof e.data.lfResumo === 'object') {
      var r = e.data.lfResumo,
        n = function (x) {
          return Math.max(0, Math.min(999, Math.round(+x || 0)));
        };
      S.pnlRes = {
        msg: n(r.msg),
        ata: n(r.ata),
        av: n(r.av),
        prox: r.prox && r.prox.nm ? { nm: String(r.prox.nm).slice(0, 40), ini: +r.prox.ini || 0, fim: +r.prox.fim || 0 } : null,
        ts: Date.now()
      };
      saveSoon();
      if (S.view === 'inicio') render();
    }
  });
