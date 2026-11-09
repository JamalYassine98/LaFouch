  // ===== v474 (aprovado 08/11, esboço S16): Editar produto › Cores e fotos de pré-graduado (leitura) agrupado por COR =====
  // Cada cor é um bloco que abre/fecha (foto, "N graus · N peças", selos uma vez, custo único da cor).
  // Cada grau é um botão "+0.75 ▾" que abre a folha com 3 abas: Trocar grau · Mudar de cor · Tirar.
  // "+ Adicionar graus em <cor>": vários graus de uma vez, mesma quantidade para todos ou um a um.
  // Quantidade e custo continuam como rascunho (S.qDraft/S.cDraft) e valem ao tocar em "Salvar alterações";
  // trocar, mudar de cor, tirar e adicionar são ações confirmadas na folha e valem na hora (vão para o histórico).
  var GC_G = [];
  for (var gci = 1; gci <= 16; gci++) GC_G.push('+' + (gci * 0.25).toFixed(2));
  function gcRef() {
    return S.qEdRef || '';
  }
  function gcLinhas(ref) {
    return S.items.filter(function (i) {
      return i.ref === ref && i.tipo === 'pre' && !i.bulk;
    });
  }
  function gcQ(i) {
    var k = S.items.indexOf(i);
    return S.qDraft[k] != null ? S.qDraft[k] : i.qty;
  }
  // guarda os rascunhos pelo objeto (os índices mudam quando linhas entram/saem) e devolve depois
  function gcMexe(fn) {
    var q = new Map(),
      c = new Map();
    S.items.forEach(function (it, k) {
      if (S.qDraft[k] != null) q.set(it, S.qDraft[k]);
      if (S.cDraft[k] != null) c.set(it, S.cDraft[k]);
    });
    fn();
    S.qDraft = {};
    S.cDraft = {};
    S.items.forEach(function (it, k) {
      if (q.has(it)) S.qDraft[k] = q.get(it);
      if (c.has(it)) S.cDraft[k] = c.get(it);
    });
    saveSoon();
    render();
  }
  function gcIgual(a, b) {
    return a.ref === b.ref && a.tipo === b.tipo && a.cor === b.cor && a.grau === b.grau && (Number(a.custo) || 0) === (Number(b.custo) || 0) && (a.lote || '') === (b.lote || '');
  }
  function gcNova(base, cor, grau, q) {
    var n = {};
    Object.keys(base).forEach(function (k) {
      if (k !== 'qty' && k !== 'lote') n[k] = base[k];
    });
    n.cor = cor;
    n.grau = grau;
    n.qty = q;
    return n;
  }
  // põe q peças de "it" em (cor, grau): junta numa linha igual se existir
  function gcMove(it, cor, grau, q) {
    var dest = { ref: it.ref, tipo: it.tipo, cor: cor, grau: grau, custo: it.custo, lote: it.lote },
      alvo = S.items.filter(function (x) {
        return x !== it && gcIgual(x, dest);
      })[0];
    if (q >= it.qty) {
      if (alvo) {
        alvo.qty += it.qty;
        S.items.splice(S.items.indexOf(it), 1);
      } else {
        it.cor = cor;
        it.grau = grau;
      }
    } else {
      it.qty -= q;
      if (alvo) alvo.qty += q;
      else {
        var n = gcNova(it, cor, grau, q);
        if (it.lote) n.lote = it.lote;
        S.items.splice(S.items.indexOf(it) + 1, 0, n);
      }
    }
  }
  function gcGradeHtml(tem, sel, off) {
    return (
      '<div class="gcGrade">' +
      GC_G.map(function (g) {
        var t = tem[g];
        return '<button type="button" class="tab gcG' + (sel.indexOf(g) >= 0 ? ' on' : '') + (g === off ? ' off' : '') + '" data-g="' + g + '"' + (g === off ? ' disabled' : '') + '><b>' + g + '</b><small>' + (t ? t + ' pç' : '&nbsp;') + '</small></button>';
      }).join('') +
      '</div>'
    );
  }
  function gcTem(ref, cor) {
    var t = {};
    gcLinhas(ref).forEach(function (i) {
      if (i.cor === cor) t[i.grau] = (t[i.grau] || 0) + i.qty;
    });
    return t;
  }
  function gcStep(v, cls) {
    return '<span class="vstep cfStep ' + (cls || '') + '"><span class="vs-b" role="button" tabindex="0" data-d="-1" aria-label="Menos">−</span><span class="vs-n">' + v + '</span><span class="vs-b" role="button" tabindex="0" data-d="1" aria-label="Mais">+</span></span>';
  }
  function gcLigaStep(el, get, set, min) {
    [].forEach.call(el.querySelectorAll('.vs-b'), function (b) {
      b.onclick = function () {
        var n = Math.max(min || 0, Math.min(999, get() + +b.dataset.d));
        set(n);
        b.parentNode.querySelector('.vs-n').textContent = n;
      };
    });
  }
  // ---- folha do grau: Trocar grau · Mudar de cor · Tirar ----
  function gcFolhaGrau(it, aba) {
    var ref = it.ref,
      cor = it.cor,
      g0 = it.grau,
      q0 = it.qty;
    lfJanela({
      titulo: g0 + ' · ' + cor + ' (' + q0 + ' peça' + (q0 === 1 ? '' : 's') + ')',
      cls: 'gcJn',
      monta: function (c, api) {
        var st = { aba: aba || 0, g: '', cor: '', q: q0 };
        var outras = [];
        gcLinhas(ref).forEach(function (i) {
          if (i.cor !== cor && outras.indexOf(i.cor) < 0) outras.push(i.cor);
        });
        var pinta = function () {
          var tem = gcTem(ref, cor),
            h = '<div class="trk gcTrk"><span class="trkTh"></span>' + ['Trocar grau', 'Mudar de cor', 'Tirar'].map(function (t, k) {
              return '<button type="button" class="trkB' + (k === st.aba ? ' on' : '') + '" data-m="' + k + '">' + t + '</button>';
            }).join('') + '</div>';
          var ok = '';
          if (st.aba === 0) {
            h += '<div class="hint">Escolha o grau certo.</div>' + gcGradeHtml(tem, st.g ? [st.g] : [], g0);
            if (st.g && tem[st.g]) h += '<div class="note gcNota">' + st.g + ' já tem ' + tem[st.g] + ' peça' + (tem[st.g] === 1 ? '' : 's') + ' nesta cor. As ' + q0 + ' de ' + g0 + ' se juntam: <b>' + st.g + ' fica com ' + (tem[st.g] + q0) + '</b>.</div>';
            ok = st.g ? 'Trocar para ' + st.g : '';
          } else if (st.aba === 1) {
            if (!outras.length) h += '<div class="note">Este modelo só tem a cor ' + esc(cor) + '. Para outra cor, use "Cor nova" e tire a foto.</div>';
            else {
              h += '<div class="hint">Para qual cor vão estas peças?</div>' + outras.map(function (oc) {
                var t2 = gcTem(ref, oc)[g0] || 0,
                  ft = S.fotos[ref + '|' + oc];
                return '<button type="button" class="tab gcCor' + (st.cor === oc ? ' on' : '') + '" data-c="' + esc(oc) + '">' + (ft ? '<img alt="" src="' + ft + '">' : '<i></i>') + '<span><b>' + esc(oc) + '</b><small>' + (t2 ? g0 + ' já tem ' + t2 + ' → fica com ' + (t2 + st.q) : g0 + ' entra nesta cor') + '</small></span>' + (st.cor === oc ? '<em>✓</em>' : '') + '</button>';
              }).join('');
              if (q0 > 1) h += '<div class="gcLinha"><span class="hint">Quantas mudar?</span>' + gcStep(st.q, 'gcQm') + '</div>';
            }
            ok = st.cor ? 'Mudar ' + st.q + ' para ' + st.cor : '';
          } else {
            var cu = (Number(effCusto(it)) || 0) * q0;
            h += '<div class="note n-bad"><b>Tirar as ' + q0 + ' peça' + (q0 === 1 ? '' : 's') + ' de ' + g0 + '?</b><br>' + (cu > 0 ? usd(cu) + ' em custo. ' : '') + 'Fica registrado no histórico.</div>';
            ok = 'Sim, tirar';
          }
          h += '<div class="gcPe"><button type="button" class="tab" data-x>Cancelar</button><button type="button" class="go" data-ok' + (ok ? '' : ' disabled') + '>' + (ok || (st.aba === 0 ? 'Escolha o grau' : 'Escolha a cor')) + '</button></div>';
          c.innerHTML = h;
          var tk = c.querySelector('.gcTrk');
          requestAnimationFrame(function () { try { trkMarca(tk, String(st.aba)); } catch (_) {} });
          [].forEach.call(c.querySelectorAll('.gcTrk [data-m]'), function (b) { b.onclick = function () { st.aba = +b.dataset.m; pinta(); }; });
          [].forEach.call(c.querySelectorAll('.gcG[data-g]'), function (b) { b.onclick = function () { st.g = b.dataset.g; pinta(); }; });
          [].forEach.call(c.querySelectorAll('[data-c]'), function (b) { b.onclick = function () { st.cor = b.dataset.c; pinta(); }; });
          var qm = c.querySelector('.gcQm');
          if (qm) gcLigaStep(qm, function () { return st.q; }, function (n) { st.q = Math.min(q0, n); pinta(); }, 1);
          c.querySelector('[data-x]').onclick = api.fecha;
          c.querySelector('[data-ok]').onclick = function () {
            if (!S.items.indexOf || S.items.indexOf(it) < 0) return api.fecha();
            if (st.aba === 0 && st.g) gcMexe(function () { gcMove(it, cor, st.g, it.qty); S.msg = g0 + ' virou ' + st.g + ' em ' + cor + '.'; });
            else if (st.aba === 1 && st.cor) gcMexe(function () { gcMove(it, st.cor, g0, st.q); S.msg = st.q + ' peça(s) de ' + g0 + ' foram para ' + st.cor + '.'; });
            else if (st.aba === 2)
              gcMexe(function () {
                var xr = exclusaoEstoque([it], 'grau tirado');
                S.items.splice(S.items.indexOf(it), 1);
                limpaRefExcluido(ref);
                S.msg = g0 + ' tirado de ' + cor + '.' + (xr.n ? ' Saíram ' + xr.n + ' peça(s), ' + usd(xr.usd) + ' em custo, registradas no histórico.' : '');
              });
            else return;
            api.fecha();
          };
        };
        pinta();
      }
    });
  }
  // ---- folha Adicionar graus (vários de uma vez) ----
  function gcFolhaAdd(ref, cor) {
    lfJanela({
      titulo: 'Adicionar graus · ' + cor,
      cls: 'gcJn',
      monta: function (c, api) {
        var st = { sel: [], q: {}, igual: 1 },
          base = gcLinhas(ref).filter(function (i) { return i.cor === cor; })[0] || gcLinhas(ref)[0];
        var pinta = function () {
          var tem = gcTem(ref, cor),
            tot = st.sel.reduce(function (a, g) { return a + (st.q[g] || 0); }, 0),
            h = '<div class="hint">Toque em quantos graus quiser. Os que têm número já existem nesta cor.</div>' + gcGradeHtml(tem, st.sel, '');
          if (st.sel.length) {
            h += '<div class="gcLinha"><span class="hint">Mesma quantidade para todos</span>' + gcStep(st.igual, 'gcIg') + '</div>';
            h += st.sel.map(function (g) { return '<div class="gcLinha"><b>' + g + '</b>' + gcStep(st.q[g], 'gcQ" data-g="' + g) + '</div>'; }).join('');
          }
          h += '<div class="gcPe"><button type="button" class="tab" data-x>Cancelar</button><button type="button" class="go" data-ok' + (tot ? '' : ' disabled') + '>' + (tot ? 'Adicionar ' + tot + ' peça' + (tot === 1 ? '' : 's') : 'Escolha os graus') + '</button></div>';
          c.innerHTML = h;
          [].forEach.call(c.querySelectorAll('.gcG[data-g]'), function (b) {
            b.onclick = function () {
              var g = b.dataset.g, k = st.sel.indexOf(g);
              if (k >= 0) st.sel.splice(k, 1);
              else { st.sel.push(g); st.sel.sort(function (a, b) { return parseFloat(a) - parseFloat(b); }); st.q[g] = st.igual; }
              pinta();
            };
          });
          var ig = c.querySelector('.gcIg');
          if (ig) gcLigaStep(ig, function () { return st.igual; }, function (n) { st.igual = n; st.sel.forEach(function (g) { st.q[g] = n; }); pinta(); }, 1);
          [].forEach.call(c.querySelectorAll('.gcQ'), function (e) {
            var g = e.getAttribute('data-g');
            gcLigaStep(e, function () { return st.q[g]; }, function (n) { st.q[g] = n; pinta(); }, 1);
          });
          c.querySelector('[data-x]').onclick = api.fecha;
          c.querySelector('[data-ok]').onclick = function () {
            if (!tot || !base) return;
            gcMexe(function () {
              st.sel.forEach(function (g) {
                var q = st.q[g] || 0;
                if (!q) return;
                var cu = S.items.filter(function (i) { return i.ref === ref && i.cor === cor && i.tipo === 'pre' && !i.bulk; })[0],
                  ex = S.items.filter(function (i) { return i.ref === ref && i.cor === cor && i.grau === g && i.tipo === 'pre' && !i.bulk && !i.lote; })[0];
                if (ex) { ajusteEstoque(ex, q, 'graus adicionados'); ex.qty += q; }
                else {
                  var n = gcNova(cu || base, cor, g, q);
                  if (cu && cu.custo != null) n.custo = cu.custo;
                  S.items.push(n);
                  ajusteEstoque(n, q, 'graus adicionados');
                }
              });
              S.msg = tot + ' peça(s) adicionadas em ' + cor + '.';
            });
            api.fecha();
          };
        };
        pinta();
      }
    });
  }
  // ---- monta os blocos por cor no lugar das linhas soltas ----
  function gcMonta() {
    var cl = document.getElementById('edCores');
    if (!cl || cl._gc || S.edStep !== 2) return;
    var ref = gcRef(),
      L = gcLinhas(ref);
    if (!L.length || L.length !== S.items.filter(function (i) { return i.ref === ref && !i.bulk; }).length) return; // só pré-graduado puro
    cl._gc = 1;
    var rowsDom = [].slice.call(cl.querySelectorAll(':scope > .cfRow:not(.nova)')),
      cores = [];
    L.forEach(function (i) { if (cores.indexOf(i.cor) < 0) cores.push(i.cor); });
    if (!S.gcAb || cores.indexOf(S.gcAb) < 0) S.gcAb = cores[0];
    var frag = document.createElement('div');
    frag.className = 'gcLista';
    cores.forEach(function (cor, ci) {
      var its = L.filter(function (i) { return i.cor === cor; }).sort(function (a, b) { return parseFloat(a.grau) - parseFloat(b.grau); }),
        r0 = rowsDom.filter(function (r) { var b = r.querySelector('.cfFt'); return b && b.getAttribute('aria-label') === 'Foto da cor ' + cor; })[0],
        nq = its.reduce(function (a, i) { return a + gcQ(i); }, 0),
        ng = {};
      its.forEach(function (i) { ng[i.grau] = 1; });
      var ab = S.gcAb === cor,
        bl = mk('div', 'gcCorB' + (ab ? ' ab' : ''));
      if (ci) bl.appendChild(mk('div', 'gcSep'));
      var hd = mk('div', 'gcHd');
      var ft = r0 && r0.querySelector('.cfFt');
      if (ft) hd.appendChild(ft);
      var tx = mk('button', 'gcTit');
      tx.type = 'button';
      tx.innerHTML = '<b>' + esc(cor) + '</b><small>' + Object.keys(ng).length + ' grau' + (Object.keys(ng).length === 1 ? '' : 's') + ' · ' + nq + ' peça' + (nq === 1 ? '' : 's') + '</small><i aria-hidden="true">' + (ab ? '⌃' : '⌄') + '</i>';
      tx.onclick = function () { S.gcAb = ab ? '' : cor; render(); };
      hd.appendChild(tx);
      bl.appendChild(hd);
      if (ab) {
        var sl = r0 && r0.querySelector('.cfSelos');
        if (sl) bl.appendChild(sl);
        // custo único da cor (vale para todos os graus)
        var k0 = S.items.indexOf(its[0]),
          cv = S.cDraft[k0] != null ? S.cDraft[k0] : its[0].custo != null ? String(its[0].custo).replace('.', ',') : '',
          cu = mk('div', 'gcCusto');
        cu.innerHTML = '<span class="hint">Custo de cada peça <small>(todos os graus)</small></span><span class="cfCu">US$ <input class="cfCuI" inputmode="decimal" placeholder="custo" aria-label="Custo por peça em US$ desta cor" value="' + esc(cv) + '"></span>';
        cu.querySelector('input').onchange = function (e) {
          var v = e.target.value;
          its.forEach(function (i) { S.cDraft[S.items.indexOf(i)] = v; });
          render();
        };
        bl.appendChild(cu);
        its.forEach(function (i) {
          var k = S.items.indexOf(i),
            ln = mk('div', 'gcLn' + (S.qDraft[k] != null ? ' mud' : ''));
          ln.innerHTML = '<button type="button" class="tab gcChip">' + esc(i.grau) + ' <span aria-hidden="true">▾</span></button>' + gcStep(gcQ(i));
          ln.querySelector('.gcChip').onclick = function () { gcFolhaGrau(i, 0); };
          gcLigaStep(ln, function () { return gcQ(i); }, function (n) {
            var kk = S.items.indexOf(i);
            if (n === i.qty) delete S.qDraft[kk]; else S.qDraft[kk] = n;
            ln.classList.toggle('mud', S.qDraft[kk] != null);
          }, 0);
          bl.appendChild(ln);
        });
        var ad = btn('mini gcAdd', '+ Adicionar graus em ' + cor, function () { gcFolhaAdd(ref, cor); });
        bl.appendChild(ad);
        var xc = btn('mini gcXcor', 'Excluir cor', function () {
          S.edAbre = S.items.indexOf(its[0]);
          S.cdMode = true;
          S.cdCor = cor;
          render();
        });
        bl.appendChild(xc);
      }
      frag.appendChild(bl);
    });
    rowsDom.forEach(function (r) { r.style.display = 'none'; });
    cl.insertBefore(frag, cl.firstChild);
  }
  var _renderGc = render;
  render = function () {
    var x = _renderGc.apply(this, arguments);
    try { gcMonta(); } catch (e) {}
    return x;
  };
