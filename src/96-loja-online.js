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
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
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
  function vitProduto(ref) {
    var v = vitInfo(ref),
      a = attrOf(ref),
      pp = S.pprice && S.pprice[ref],
      solar = v.tipo === 'solar',
      cs = vitCores(ref);
    return {
      ref: ref,
      nome: v.nome,
      tipo: solar ? 'solar' : v.tipo === 'pre' ? 'grau' : 'armacao',
      n: v.preco || 0,
      de: pp && pp.ant > v.preco ? pp.ant : 0,
      est: v.est,
      aviso: siteAviso(ref),
      tag: solar ? 'SOLAR' : v.tipo === 'pre' ? 'GRAU' : 'ARMAÇÃO',
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
      lib: true
    };
  }
  function vitFila(ref, op) {
    if (!S.vitPend) S.vitPend = {};
    S.vitPend[ref] = op;
    saveSoon();
  }
  var VIT_CAMPOS = ['nome', 'tipo', 'n', 'de', 'est', 'aviso', 'tag', 'mat', 'gen', 'cor', 'cores', 'cn', 'qs', 'raio', 'med', 'rosto', 'uv', 'cad', 'lib', 'fv'];
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
    if (!S.nuvem || !S.nuvem.rt || navigator.onLine === false) return Promise.resolve();
    if (!vitConfere.sig) vitConfere.sig = {};
    Object.keys(S.site || {}).forEach(function (ref) {
      if (!itemDoRef(ref)) {
        delete S.site[ref];
        vitFila(ref, 'del');
        return;
      }
      if (S.vitPend && S.vitPend[ref]) return;
      if (!(vitProduto(ref).n > 0)) return;
      var sg = JSON.stringify(vitSig(ref));
      if (vitConfere.sig[ref] !== sg) vitFila(ref, 'upd');
    });
    return vitSync();
  }
  setTimeout(vitConfere, 25000);
  setInterval(vitConfere, 60000);
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
    var pend = S.vitPend || {},
      refs = Object.keys(pend);
    if (!refs.length || !S.nuvem || !S.nuvem.rt || navigator.onLine === false || vitSync.busy || Date.now() - (vitSync.fail || 0) < 60000) return Promise.resolve();
    vitSync.busy = true;
    if (!S.vitFoto) S.vitFoto = {};
    return refs
      .reduce(function (p, ref) {
        return p.then(function () {
          var op = pend[ref];
          if (op === 'del' || !S.site || !S.site[ref]) {
            var dels = [nvApi('DELETE', 'produtos/' + ref).catch(function () {})];
            for (var k = 0; k < 8; k++) dels.push(nvApi('DELETE', 'fotos/' + ref + (k ? '~' + k : '')).catch(function () {}));
            return Promise.all(dels).then(function () {
              delete S.vitFoto[ref];
            });
          }
          var u = vitProduto(ref);
          if (!(u.n > 0)) return Promise.resolve();
          var fs = vitFotos(ref),
            body = vitDocBody(ref, u),
            sg = JSON.stringify(vitSig(ref)),
            hs = fs.map(fotoHash).join('.');
          var envia = S.vitFoto[ref] === hs ? Promise.resolve() : fs.reduce(function (q, d, i) {
            return q.then(function () {
              return nvApi('PATCH', 'fotos/' + ref + (i ? '~' + i : ''), vBody({ d: d }));
            });
          }, Promise.resolve());
          return envia
            .then(function () {
              S.vitFoto[ref] = hs;
              return nvApi(
                'PATCH',
                'produtos/' + ref + '?' + VIT_CAMPOS.map(function (m) { return 'updateMask.fieldPaths=' + m; }).join('&') + '&updateMask.fieldPaths=ref',
                vBody(Object.assign({ ref: ref }, body))
              );
            })
            .then(function () {
              if (!vitConfere.sig) vitConfere.sig = {};
              vitConfere.sig[ref] = sg;
            });
        }).then(function () {
          delete S.vitPend[ref];
          saveSoon();
        }, function () {});
      }, Promise.resolve())
      .then(function () {
        vitSync.busy = false;
        if (Object.keys(S.vitPend || {}).length) vitSync.fail = Date.now();
        if (S.view === 'onl') render();
      });
  }
  // Aba Site: o painel completo ocupa a tela; o botão de tela cheia fica dentro do painel, ao lado de "Cliente"
  window.addEventListener('message', function (e) {
    var f = $('lojaFrame');
    if (!f || e.source !== f.contentWindow || !e.data) return;
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
    if (online && !$('lojaFrame').getAttribute('src')) $('lojaFrame').src = LOJA_URL;
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
