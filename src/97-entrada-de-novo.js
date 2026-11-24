  // ===== Adicionar: "Aguardando cadastro" (fotos do Estúdio ainda sem peça; v442) =====
  // "Dar entrada de novo" saiu (44, dono 21/11 10:15: "polui a tela"); dar entrada numa peça que já existe é pela ficha (+) ou "Chegou mercadoria".
  function renderDeNovo() {
    var b = $('addDeNovo');
    if (!b) return;
    var pd = S.addMode === 'menu' ? S.estPend || [] : [];
    b.hidden = !pd.length;
    b.innerHTML = pd.length
      ? '<div class="lbl">Aguardando cadastro · ' + pd.length + '</div><div class="adNv adPd">' +
        pd.slice(0, 12).map(function (x) {
          return '<button type="button" class="adNvI" data-act="adPend" data-id="' + esc(x.id) + '"><span class="adNvF"><img alt="" src="' + x.t + '"></span><b>' + new Date(x.ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + '</b></button>';
        }).join('') + '</div>'
      : '';
  }
  // Toque numa foto aguardando: o mesmo identificador do cartão "Foto" (leitura + Mais parecidas + Novo modelo já com a foto).
  ACT.adPend = function (id) {
    var pd = (S.estPend || []).filter(function (x) {
      return x.id === id;
    })[0];
    if (!pd) return;
    idbDo('hq', 'readonly', function (o) {
      return o.get('pend|' + id);
    })
      .catch(function () {
        return null;
      })
      .then(function (u) {
        return fetch(u || pd.t).then(function (r) {
          return r.blob();
        });
      })
      .then(function (bl) {
        S._pendLig = { id: id, ts: Date.now() };
        fmAnalisa(bl);
      })
      .catch(function () {
        lfToast('Não consegui abrir essa foto', 'erro');
      });
  };
  // Quando a foto aguardando vira a foto de uma peça: leva a 3/4 junto e tira da lista.
  function pendDepoisDeSalvar(k) {
    var L = S._pendLig;
    if (!L || Date.now() - L.ts > 30 * 60000 || /\|34$/.test(k)) return;
    S._pendLig = null;
    var pd = (S.estPend || []).filter(function (x) {
      return x.id === L.id;
    })[0];
    if (!pd) return;
    var ap = function () {
      if (pd.giro)
        idbDo('hq', 'readonly', function (o) {
          return o.get('pend|' + pd.id + '|giro');
        }).then(function (v) {
          if (v && typeof estGiroGuarda === 'function') estGiroGuarda(k, v);
          idbDo('hq', 'readwrite', function (o) {
            return o.delete('pend|' + pd.id + '|giro');
          }).catch(function () {});
        }).catch(function () {});
      S.estPend = S.estPend.filter(function (x) {
        return x !== pd;
      });
      idbDo('hq', 'readwrite', function (o) {
        o.delete('pend|' + pd.id);
        return o.delete('pend|' + pd.id + '|34');
      }).catch(function () {});
      saveSoon();
    };
    if (!pd.t34) return ap();
    idbDo('hq', 'readonly', function (o) {
      return o.get('pend|' + pd.id + '|34');
    })
      .catch(function () {
        return null;
      })
      .then(function (u) {
        setFoto(k + '|34', pd.t34, u || pd.t34);
        ap();
      });
  }
  // ---------- v442: selos por cor no Inventário (Editar produto › Cores e fotos) ----------
  var CF_LC = null;
  function cfSelos(ref, it) {
    var k = ref + '|' + it.cor,
      nt = (S.fotoNota || {})[k],
      tem = !!(S.fotos && S.fotos[k]),
      h = '';
    if (tem && nt && nt.n >= 80) h += '<span class="selo ok">foto ' + nt.n + '</span>';
    else if (tem || nt) h += '<button type="button" class="selo warn" data-refaz="1">refazer' + (nt && nt.mot && nt.mot.length ? ' · ' + esc(nt.mot[0]) : nt ? ' · nota ' + nt.n : '') + ' ›</button>';
    // sobra (do ideal da lista de compras; a conta é feita 1× a cada poucos segundos)
    if (!CF_LC || Date.now() - CF_LC.t > 4000) {
      try {
        CF_LC = { t: Date.now(), L: lcLista() };
      } catch (e) {
        CF_LC = { t: Date.now(), L: null };
      }
    }
    var b = CF_LC.L && CF_LC.L.porIdeal[lcChave(it.tipo, ref, it.tipo === 'pre' ? it.grau : '')];
    if (b && b.sobra) h += '<span class="selo warn">sobra ' + b.sobra + '</span>';
    // onde a peça está
    var site = !!(S.site && S.site[ref]);
    h += '<span class="selo ' + (site ? 'ok' : '') + '">' + (site ? '● site' : '○ fora do site') + '</span><span class="selo ok">● catálogo</span>';
    var mk2 = S.mkt && S.mkt.kit && S.mkt.kit[ref];
    if (mk2) h += '<span class="selo warn">● marketing</span>';
    return h;
  }
