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
  function vitRefs() {
    return Array.isArray(S.vitrine) ? S.vitrine : (S.vitrine = []);
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
        S.vitrine = vitRefs().filter(function (r) {
          return r !== ref;
        });
        delete S.esgDesde[ref];
        vitFila(ref, 'del');
        ch = true;
      }
    });
    if (ch) saveSoon();
  }
  function vitDiasEsg(ref) {
    return Math.floor((Date.now() - (S.esgDesde && S.esgDesde[ref] ? S.esgDesde[ref] : Date.now())) / 864e5);
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
  function vitProduto(ref) {
    var v = vitInfo(ref),
      a = attrOf(ref),
      pp = S.pprice && S.pprice[ref],
      ord = vitRefs().indexOf(ref) + 1,
      solar = v.tipo === 'solar';
    return {
      ref: ref,
      nome: v.nome,
      tipo: solar ? 'solar' : v.tipo === 'pre' ? 'grau' : 'armacao',
      n: v.preco || 0,
      de: pp && pp.ant > v.preco ? pp.ant : 0,
      aviso: v.est === 1 ? 'Última unidade' : '',
      tag: solar ? 'SOLAR' : 'ARMAÇÃO',
      mat: a.material || 'Acetato',
      cor: '#2a2d33',
      cores: ['#2a2d33'],
      raio: 14,
      med: [52, 19, 145],
      rosto: ['oval'],
      rank: 0,
      oculto: false,
      fv: Math.floor(Date.now() / 1000),
      ord: ord,
      uv: solar
    };
  }
  function vitFila(ref, op) {
    if (!S.vitPend) S.vitPend = {};
    S.vitPend[ref] = op;
    saveSoon();
  }
  function vitSync() {
    var pend = S.vitPend || {},
      refs = Object.keys(pend);
    if (!refs.length || !S.nuvem || !S.nuvem.rt || navigator.onLine === false || vitSync.busy || Date.now() - (vitSync.fail || 0) < 60000) return Promise.resolve();
    vitSync.busy = true;
    return refs
      .reduce(function (p, ref) {
        return p.then(function () {
          var op = pend[ref];
          if (op === 'del')
            return nvApi('DELETE', 'produtos/' + ref).then(function () {
              return nvApi('DELETE', 'fotos/' + ref).catch(function () {});
            });
          var o = vitProduto(ref),
            f = vitInfo(ref).foto;
          return (f ? nvApi('PATCH', 'fotos/' + ref, vBody({ d: f })) : Promise.resolve()).then(function () {
            return nvApi('PATCH', 'produtos/' + ref, vBody(o));
          });
        }).then(function () {
          delete S.vitPend[ref];
          saveSoon();
        }, function () {});
      }, Promise.resolve())
      .then(function () {
        vitSync.busy = false;
        if (Object.keys(S.vitPend || {}).length) vitSync.fail = Date.now();
        S.vitMsg = Object.keys(S.vitPend || {}).length ? 'Alguns itens ainda não subiram. Tento de novo quando houver internet.' : 'Vitrine publicada no site.';
        if (S.view === 'onl') render();
        if (vitOv && vitOv.redesenha) vitOv.redesenha();
      });
  }
  // ---- escolher o que vai (seletor)
  function vitSeletor() {
    var sel = {},
      q = '',
      ft = 'all',
      ov = mk('div', 'modal'),
      bx = mk('div', 'modal-box');
    bx.style.cssText = 'max-width:560px;max-height:88vh;overflow:auto';
    ov.appendChild(bx);
    var refs = [];
    S.items.forEach(function (i) {
      if (TIPOS.some(function (x) { return x.id === i.tipo; }) && refs.indexOf(i.ref) < 0) refs.push(i.ref);
    });
    function desenha() {
      bx.textContent = '';
      bx.appendChild(mk('b', '', 'Adicionar à vitrine'));
      var qi = mk('input', 'in');
      qi.placeholder = 'Buscar produto';
      qi.value = q;
      qi.oninput = function () {
        q = qi.value;
        grade();
      };
      bx.appendChild(qi);
      var cs = mk('div', 'nav');
      [['all', 'Todos'], ['solar', 'Solares'], ['sem', 'Armações'], ['pre', 'Pré-graduados']].forEach(function (c) {
        cs.appendChild(btn('chip' + (ft === c[0] ? ' on' : ''), c[1], function () {
          ft = c[0];
          desenha();
        }, ft === c[0]));
      });
      bx.appendChild(cs);
      var g = mk('div', 'gal cvg');
      g.id = 'vitGrade';
      bx.appendChild(g);
      var ln = mk('div', '');
      ln.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;position:sticky;bottom:0;background:var(--panel);padding-top:8px';
      ln.appendChild(btn('chip', 'Cancelar', function () {
        ov.remove();
      }));
      var n = Object.keys(sel).length;
      var go = btn('mini', n ? 'Publicar ' + n + ' na vitrine' : 'Escolha produtos', function () {
        Object.keys(sel).forEach(function (r) {
          if (vitRefs().indexOf(r) < 0) vitRefs().push(r);
          vitFila(r, 'put');
        });
        ov.remove();
        S.vitMsg = '';
        saveSoon();
        render();
        if (vitOv && vitOv.redesenha) vitOv.redesenha();
        vitSync();
      });
      go.disabled = !n;
      go.id = 'vitGo';
      ln.appendChild(go);
      bx.appendChild(ln);
      grade();
    }
    function grade() {
      var g = $('vitGrade');
      g.textContent = '';
      var qm = mkMatch(q);
      refs.forEach(function (ref) {
        var v = vitInfo(ref);
        if (ft !== 'all' && v.tipo !== ft) return;
        if (qm && !qm(v.it) && pubNome(ref).toLowerCase().indexOf(q.toLowerCase()) < 0) return;
        var no = vitRefs().indexOf(ref) >= 0,
          esg = v.est <= 0,
          on = !!sel[ref];
        var t = mk('div', 'gi');
        t.style.cssText = 'position:relative;cursor:' + (esg || no ? 'default' : 'pointer') + ';opacity:' + (esg || no ? 0.4 : 1) + ';outline:2px solid ' + (on ? 'var(--accent)' : 'transparent') + ';border-radius:10px';
        if (v.foto) {
          var im = mk('img');
          im.src = v.foto;
          im.alt = v.nome;
          t.appendChild(im);
        }
        t.appendChild(mk('div', 'hint', v.nome + (esg ? ' · Esgotado · não publica' : no ? ' · já no ar' : '')));
        if (on) t.appendChild(mk('i', 'ck', '✓'));
        if (!esg && !no)
          t.onclick = function () {
            if (sel[ref]) delete sel[ref];
            else sel[ref] = 1;
            desenha();
          };
        g.appendChild(t);
      });
    }
    desenha();
    document.body.appendChild(ov);
  }
  // Painel da vitrine (o que está no ar, + Adicionar, tirar, prazo do esgotado): abre por cima da aba Site
  var vitOv = null;
  function vitPainel() {
    if (vitOv) vitOv.remove();
    var ov = mk('div', 'modal'),
      bx = mk('div', 'modal-box');
    vitOv = ov;
    bx.style.cssText = 'max-width:560px;max-height:90vh;overflow:auto';
    ov.appendChild(bx);
    function fecha() {
      ov.remove();
      vitOv = null;
      render();
    }
    function desenha() {
      vitManutencao();
      var l = vitRefs(),
        esg = l.filter(function (r) {
          return estoqueDoRef(r) <= 0;
        }).length,
        m = modoDe('s');
      bx.textContent = '';
      var hd = mk('div', '');
      hd.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:10px';
      var tt = mk('div', '');
      tt.appendChild(mk('b', '', 'Vitrine do site'));
      tt.appendChild(mk('div', 'hint', l.length - esg + ' no ar' + (esg ? ' · ' + esg + ' esgotado' + (esg > 1 ? 's' : '') : '')));
      hd.appendChild(tt);
      hd.appendChild(btn('chip', 'Fechar', fecha));
      bx.appendChild(hd);
      var row = mk('div', '');
      row.style.cssText = 'display:flex;gap:8px;align-items:center;margin-top:10px';
      var qi = mk('input', 'in');
      qi.placeholder = 'Buscar na vitrine';
      qi.value = S.vitQ || '';
      qi.style.flex = '1';
      qi.oninput = function () {
        S.vitQ = qi.value;
        lista();
      };
      var mb = mk('button', 'chip modebtn');
      mb.type = 'button';
      modoBtn(mb, 's');
      mb.onclick = function () {
        if (!S.vModo) S.vModo = {};
        S.vModo.s = m === 'g' ? 'l' : 'g';
        saveSoon();
        desenha();
      };
      row.appendChild(qi);
      row.appendChild(mb);
      bx.appendChild(row);
      var add = mk('button', 'go', '+ Adicionar à vitrine');
      add.type = 'button';
      add.style.marginTop = '10px';
      add.onclick = vitSeletor;
      bx.appendChild(add);
      var box = mk('div', m === 'g' ? 'gal vitg' : 'vitl');
      box.style.marginTop = '10px';
      bx.appendChild(box);
      bx.appendChild(mk('div', 'hint', S.vitMsg || ''));
      var cfg = mk('div', 'zl');
      cfg.appendChild(mk('span', '', 'Sai da vitrine se ficar esgotado por ' + vitDias() + ' dias'));
      var pm = mk('div', '');
      pm.style.cssText = 'display:flex;gap:6px';
      [['−', -1], ['+', 1]].forEach(function (c) {
        pm.appendChild(btn('chip', c[0], function () {
          S.vitDias = Math.max(1, Math.min(60, vitDias() + c[1]));
          saveSoon();
          desenha();
        }));
      });
      cfg.appendChild(pm);
      bx.appendChild(cfg);
      if (!S.nuvem || !S.nuvem.rt) bx.appendChild(mk('div', 'note n-warn', 'Para a vitrine aparecer no site, conecte a Nuvem em Ajustes › Backup.'));
      function lista() {
        box.textContent = '';
        var qq = (S.vitQ || '').toLowerCase(),
          n = 0;
        l.forEach(function (ref) {
          var v = vitInfo(ref);
          if (qq && (v.nome + ' ' + ref).toLowerCase().indexOf(qq) < 0) return;
          n++;
          var it = mk('div', m === 'g' ? 'gi vitc' : 'vitr');
          if (v.est <= 0) it.style.opacity = '.6';
          if (v.foto) {
            var im = mk('img');
            im.src = v.foto;
            im.alt = v.nome;
            it.appendChild(im);
          }
          var tx = mk('div', 'vitt');
          tx.appendChild(mk('b', '', v.nome));
          if (v.preco) tx.appendChild(mk('div', '', gs(v.preco)));
          if (v.est === 1) tx.appendChild(mk('span', 'mktag mkwarn', 'Última unidade'));
          if (v.est <= 0) tx.appendChild(mk('span', 'mktag mkred', 'Esgotado há ' + vitDiasEsg(ref) + ' dias · sai da vitrine em ' + Math.max(0, vitDias() - vitDiasEsg(ref)) + ' dias'));
          it.appendChild(tx);
          var x = btn('vitx', '×', function () {
            S.vitrine = vitRefs().filter(function (r) {
              return r !== ref;
            });
            vitFila(ref, 'del');
            S.vitMsg = '';
            saveSoon();
            desenha();
            vitSync();
          });
          x.setAttribute('aria-label', 'Tirar ' + v.nome + ' da vitrine');
          it.appendChild(x);
          box.appendChild(it);
        });
        if (!n) box.appendChild(mk('div', 'note n-info', l.length ? 'Nada com essa busca.' : 'A vitrine está vazia. Toque em "+ Adicionar à vitrine".'));
      }
      lista();
    }
    vitOv.redesenha = desenha;
    desenha();
    document.body.appendChild(ov);
  }
  // Aba Site: o painel completo ocupa a tela; botões Vitrine e Tela cheia
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
      var tb = mk('div', '');
      tb.style.cssText = 'display:flex;gap:8px;margin:0 0 8px';
      var bv = mk('button', 'chip');
      bv.type = 'button';
      bv.id = 'siteVit';
      bv.style.flex = '1';
      bv.onclick = vitPainel;
      var bf = mk('button', 'chip');
      bf.type = 'button';
      bf.id = 'siteFull';
      bf.setAttribute('aria-label', 'Tela cheia');
      bf.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg> Tela cheia';
      bf.onclick = function () {
        S.siteFull = true;
        render();
      };
      tb.appendChild(bv);
      tb.appendChild(bf);
      el.appendChild(tb);
      var sb = mk('div', 'sbox');
      sb.id = 'siteBox';
      var fb = mk('div', 'sfbar');
      fb.appendChild(mk('b', '', 'Painel do site'));
      fb.appendChild(btn('chip', '✕ Fechar', function () {
        S.siteFull = false;
        render();
      }));
      sb.appendChild(fb);
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
    $('siteVit').textContent = 'Vitrine (' + no + ' no ar)';
    var online = navigator.onLine !== false;
    $('siteOff').hidden = online;
    $('lojaFrame').hidden = !online;
    if (online && !$('lojaFrame').getAttribute('src')) $('lojaFrame').src = LOJA_URL;
    $('siteBox').classList.toggle('full', !!S.siteFull);
    $('siteFull').hidden = !!S.siteFull;
    uniAbasFill();
    vitSync();
  }
  window.addEventListener('online', function () {
    if (S.view === 'onl') render();
  });
  ACT.lojaRecarregar = function () {
    render();
  };
