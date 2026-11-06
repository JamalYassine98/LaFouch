  // ===== Adicionar A+1 (v417): "Dar entrada de novo" com as 3 últimas peças que entraram. =====
  // Toque numa delas abre a folhinha "Quantas chegaram?" (− N +) e "Dar entrada · N peças".
  // O custo e o resto vêm do cadastro que já existe; respeita o limite do lote (gCap) como a entrada rápida.
  // Pré-graduado precisa dos graus: abre a entrada rápida de sempre.
  var _en = null; // { it, n }
  function enUltimas() {
    var vistos = {},
      out = [],
      L = S.elog || [];
    for (var i = L.length - 1; i >= 0 && out.length < 3; i--) {
      var e = L[i];
      if (!(e.qty > 0) || e.ajuste) continue;
      var k = e.ref + '|' + (e.tipo === 'pre' ? '' : e.cor);
      if (vistos[k]) continue;
      var it = S.items.filter(function (x) {
        return x.ref === e.ref && !x.bulk && (e.tipo === 'pre' ? x.tipo === 'pre' : x.cor === e.cor && x.tipo === e.tipo);
      })[0];
      if (!it) continue;
      vistos[k] = 1;
      out.push(it);
    }
    return out;
  }
  // v442: UMA faixa de fotos com 2 abas — "Aguardando cadastro" (fotos do Estúdio sem cadastro) e "Dar entrada de novo".
  // O app lembra a última aba aberta (S.adAba).
  S.adAba = 'novo';
  function renderDeNovo() {
    var b = $('addDeNovo');
    if (!b) return;
    var menu = S.addMode === 'menu',
      us = menu ? enUltimas() : [],
      pd = menu ? S.estPend || [] : [];
    b.hidden = !us.length && !pd.length;
    if (b.hidden) {
      b.innerHTML = '';
      return;
    }
    var aba = S.adAba === 'pend' && pd.length ? 'pend' : us.length ? 'novo' : 'pend';
    if (!pd.length) aba = 'novo';
    var pill =
      pd.length && us.length
        ? '<div class="adSeg" role="tablist"><button type="button" role="tab" class="' + (aba === 'pend' ? 'on' : '') + '" data-act="adAba" data-id="pend">Aguardando cadastro · ' + pd.length + '</button><button type="button" role="tab" class="' + (aba === 'novo' ? 'on' : '') + '" data-act="adAba" data-id="novo">Dar entrada de novo</button></div>'
        : '<div class="lbl">' + (aba === 'pend' ? 'Aguardando cadastro · ' + pd.length : 'Dar entrada de novo') + '</div>';
    var corpo =
      aba === 'pend'
        ? '<div class="adNv adPd">' +
          pd.slice(0, 12).map(function (x) {
            return '<button type="button" class="adNvI" data-act="adPend" data-id="' + esc(x.id) + '"><span class="adNvF"><img alt="" src="' + x.t + '"></span><b>' + new Date(x.ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + '</b><small>' + (x.t34 ? 'frente e 3/4' : 'frente') + '</small></button>';
          }).join('') +
          '</div>'
        : '<div class="adNv">' +
          us.map(function (it, i) {
            var f = photoOf(it.ref, it.cor) || photoOf(it.ref);
            return '<button type="button" class="adNvI" data-act="enAbre" data-id="' + i + '"><span class="adNvF">' + (f ? '<img alt="" src="' + f + '">' : '') + '</span><b>' + esc(it.ref) + '</b><small>' + esc(it.tipo === 'pre' ? 'Pré-graduado' : it.cor && it.cor !== 'Sem cor' ? it.cor : 'Padrão') + '</small></button>';
          }).join('') +
          '</div>';
    b.innerHTML = pill + corpo;
  }
  ACT.adAba = function (id) {
    S.adAba = id === 'pend' ? 'pend' : 'novo';
    saveSoon();
    renderDeNovo();
  };
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
        lfToast('Não consegui abrir essa foto');
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
  ACT.enAbre = function (i) {
    var it = enUltimas()[+i];
    if (!it) return;
    if (it.tipo === 'pre') {
      quickOpen(it.ref);
      return;
    }
    _en = { it: it, n: 1 };
    enDesenha();
  };
  function enHtml() {
    var it = _en.it,
      f = photoOf(it.ref, it.cor) || photoOf(it.ref);
    return (
      '<div class="cg-puxa" aria-hidden="true"></div>' +
      '<div class="enF-top"><div class="enF-img">' + (f ? '<img alt="" src="' + f + '">' : '') + '</div><div style="min-width:0"><b class="folha-nm">' + esc(pn(it.ref)) + '</b><div class="hint" style="margin:2px 0">' + esc(it.ref) + (it.cor && it.cor !== 'Sem cor' ? ' · ' + esc(it.cor) : '') + ' · ' + it.qty + ' no estoque</div></div></div>' +
      '<div class="enF-q"><div class="lbl" style="margin:0">Quantas chegaram?</div><span class="vstep"><span class="vs-b" role="button" tabindex="0" data-act="enQ" data-id="-1" aria-label="Menos">−</span><span class="vs-n" id="enN">' + _en.n + '</span><span class="vs-b" role="button" tabindex="0" data-act="enQ" data-id="1" aria-label="Mais">+</span></span></div>' +
      '<button type="button" class="btn go" data-act="enGo" id="enGo" style="width:100%;margin-top:10px">' + enTxt() + '</button>'
    );
  }
  function enTxt() {
    return 'Dar entrada · ' + _en.n + (_en.n === 1 ? ' peça' : ' peças');
  }
  function enDesenha() {
    var ov = lfaAbre('lfa-entr', enHtml());
    ov.classList.add('lfa-camg');
  }
  ACT.enQ = function (d) {
    if (!_en) return;
    var antes = _en.n;
    _en.n = Math.max(1, Math.min(999, _en.n + (+d || 0)));
    if (_en.n === antes) return;
    var n = $('enN'),
      bt = $('enGo');
    if (n) {
      n.textContent = _en.n;
      if (!REDUCED && n.animate) n.animate([{ transform: 'translateY(' + (_en.n > antes ? 14 : -14) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 280, easing: 'cubic-bezier(.4,0,.2,1)' });
    }
    if (bt) bt.textContent = enTxt();
  };
  ACT.enGo = function () {
    if (!_en) return;
    var it = _en.it,
      n = _en.n,
      g = it.lote && S.grp.filter(function (x) {
        return x.id === it.lote;
      })[0],
      err = g ? gCap(g, n) : '';
    if (err) {
      popErr(err);
      return;
    }
    it.qty += n;
    entradaEstoque(it.tipo, it.ref, it.cor, it.grau || '', n);
    _en = null;
    lfaFecha('lfa-entr');
    vibrar(20);
    lfEntrada(n, it.ref + ' ' + it.cor);
    render();
  };
  // ---------- v442: selos por cor no Inventário (Editar produto › Cores e fotos) ----------
  var CF_LC = null;
  function cfSelos(ref, it) {
    var k = ref + '|' + it.cor,
      nt = (S.fotoNota || {})[k],
      tem = !!(S.fotos && S.fotos[k]),
      h = '';
    if (tem && nt && nt.n >= 80) h += '<span class="selo ok">foto ' + nt.n + ' ✓</span>';
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
