  // ===== Família COMPRAS — "implementar" do dono 22/11/2026 12:51 (esboços 48a, 51 e 51b; lógica: work/s435/compras/PARTE-A-LOGICA-DA-COMPRA.md) =====
  // Compras serve SÓ para repor mercadoria. A lista pede VAGAS (tipo · gênero · material, ou o grau do pré-graduado), nunca modelos.
  // Parte 1 (telas): Peças ganha "Compras"; a tela Compras lista as vagas e termina em "Fornecedores ›" (a tela de compras e lotes,
  // que saiu das abas do Inventário). O estado de cada vaga (pedida · fechada · ninguém tinha) mora em S.cpV[chave].
  if (!$('v-comp')) {
    var _vcp = document.createElement('div');
    _vcp.id = 'v-comp';
    _vcp.className = 'view';
    _vcp.hidden = true;
    var _vei = $('v-estoque');
    if (_vei && _vei.parentNode) _vei.parentNode.insertBefore(_vcp, _vei.nextSibling);
  }
  if (!VIEWS.some(function (v) { return v[0] === 'comp'; })) VIEWS.push(['comp', 'Compras']);
  S.cpV = S.cpV || {};
  // a vaga de uma peça: tipo · gênero · material (pré-graduado: o grau)
  function cpChave(m, grau) {
    if (grau) return m.tipo + '|g|' + grau;
    var a = attrOf(m.ref);
    return m.tipo + '|' + (a.publico || '') + '|' + (a.material || '');
  }
  function cpAte(v) {
    var x = Math.ceil(v * 2) / 2;
    return 'US$ ' + (x % 1 ? x.toFixed(2).replace('.', ',') : String(x));
  }
  // as vagas abertas de hoje, das vendas (a lista de compras de antes, juntada por vaga)
  function cpVagas() {
    if (!S.cpV) S.cpV = {};
    var L = lcLista(), por = {}, ord = [];
    L.todos.forEach(function (x) {
      if (!(x.q > 0)) return;
      var k = cpChave(x.m, x.grau), v = por[k];
      if (!v) {
        var a = x.grau ? {} : attrOf(x.m.ref), t = tipoOf(x.m.tipo) || {};
        v = por[k] = { k: k, tipo: x.m.tipo, grau: x.grau || '', tit: [t.label || x.m.tipo].concat(x.grau ? [x.grau.replace('.', ',')] : [a.publico, a.material].filter(Boolean)).join(' · '),
          falta: 0, cu: 0, refs: [], esp: 0 };
        ord.push(k);
      }
      v.falta += x.q;
      v.cu = Math.max(v.cu, x.cu || 0);
      v.esp += x.esp || 0;
      if (v.refs.indexOf(x.m.ref) < 0) v.refs.push(x.m.ref);
    });
    var pk = typeof packPre === 'function' ? packPre() : 24, mudou = false;
    // pré-graduado: os 16 graus ficam sempre abastecidos (regra do mapa de graus, repSug): grau em falta vira vaga mesmo sem venda
    if (tipoOf('pre') && typeof graus16 === 'function') {
      var tot = grauTotais(), tp = tipoOf('pre');
      graus16().forEach(function (gr) {
        var pq = repQtd(gr, tot[gr]);
        if (!(pq > 0)) return;
        var k = 'pre|g|' + gr, v = por[k];
        if (!v) {
          v = por[k] = { k: k, tipo: 'pre', grau: gr, tit: tp.label + ' · ' + gr.replace('.', ','), falta: 0, cu: custoPreUsd(), refs: [], esp: 0 };
          ord.push(k);
        }
        v.falta = Math.max(v.falta, pq * pk); // pacote fechado: compra o pacote inteiro
      });
    }
    // o que não é mais vaga (e não tem compra fechada a caminho) esquece o estado
    Object.keys(S.cpV).forEach(function (k) {
      if (!por[k] && !(S.cpV[k].fech && cpPend(k) > 0)) { delete S.cpV[k]; mudou = true; }
    });
    var V = ord.map(function (k) {
      var v = por[k], st = S.cpV[k] || {}, pend = st.fech ? cpPend(k) : 0;
      if (st.fech && !pend) { delete st.fech; mudou = true; } // chegou tudo o que foi fechado
      v.st = st;
      v.resto = Math.max(0, v.falta - pend);
      v.sub = 'faltam ' + v.falta + ' · ' + (v.grau ? Math.ceil(v.falta / pk) + (Math.ceil(v.falta / pk) === 1 ? ' pacote' : ' pacotes') : 'até ' + cpAte(v.cu));
      v.fechada = !!st.fech && !v.resto;
      return v;
    }).filter(function (v) {
      return !(v.st.nin === 'sem' && !v.esp);
    });
    if (mudou) saveSoon();
    return V;
  }
  // peças fechadas que ainda não chegaram: a compra fechada menos o que entrou nesta vaga depois dela
  function cpPend(k) {
    var f = (S.cpV[k] || {}).fech;
    if (!f) return 0;
    var ch = 0;
    (S.elog || []).forEach(function (e) {
      if (e.qty > 0 && !e.ajuste && !e.estorno && e.ts >= f.ts && cpChave({ tipo: e.tipo, ref: e.ref }, e.tipo === 'pre' ? e.grau : '') === k) ch += e.qty;
    });
    return Math.max(0, f.q - ch);
  }
  // a linha de estado da vaga (uma só)
  function cpEstado(v) {
    var s = v.st;
    if (s.fech) return v.resto ? ['', 'fechado ' + s.fech.q + ' com ' + s.fech.dist + ' · faltam ' + v.resto + (s.ped ? ' pedidas' : '')] : ['ok', 'fechado com ' + s.fech.dist + ' · esperando chegar'];
    if (s.nin === 'avisar') return ['', 'esperando aparecer · o Semp avisa no sino'];
    if (s.nin === 'equiv') return ['', 'procurar equivalente · entra no próximo Pedir'];
    if (s.ped) return ['', 'pedida em ' + new Date(s.ped).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' · esperando resposta'];
    return null;
  }
  function cpThumb(v) {
    return lcThumb(v.refs[0]);
  }
  function cpSemFechar(V) {
    return V.filter(function (v) { return !v.fechada && v.st.nin !== 'avisar'; });
  }
  function renderCompras() {
    var el = $('v-comp');
    if (!el || S.view !== 'comp') return;
    var V = cpVagas(), sf = cpSemFechar(V), nf = (S.grp || []).length,
      pend = (S.grp || []).filter(function (g) { return typeof grpFalta === 'function' && grpFalta(g) > 0; }).length,
      h = '<div class="top"><div><h1>Compras</h1><div class="crumb">O que comprar e de quem</div></div></div>' +
        '<div class="lbl cpT">Para comprar · ' + V.length + (V.length === 1 ? ' vaga' : ' vagas') + '</div>';
    if (V.length)
      h += '<section class="cpLs">' + V.map(function (v) {
        var e = cpEstado(v);
        return '<button type="button" class="cpL" data-act="cpVaga" data-id="' + esc(v.k) + '">' + cpThumb(v) + '<span class="cpTx"><b>' + esc(v.tit) + '</b><small>' + esc(v.sub) + '</small>' +
          (e ? '<small class="cpE' + (e[0] ? ' ' + e[0] : '') + '">' + esc(e[1]) + '</small>' : '') + '</span><i aria-hidden="true">›</i></button>';
      }).join('') + '</section>' +
        (sf.length ? '<button type="button" class="cpPedir" data-act="cpPedir">Pedir · ' + sf.length + (sf.length === 1 ? ' vaga sem fechar' : ' vagas sem fechar') + '</button>' : '');
    else h += lfVazioHtml('<path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6"/><circle cx="9.5" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/>', 'Nada para comprar agora', 'Quando as vendas abrirem uma vaga no estoque, ela aparece aqui.');
    h += '<section class="nvLista cpFim" aria-label="Fornecedores">' +
      invLugar('cpForn', 'Fornecedores', nf ? nf + (nf === 1 ? ' compra' : ' compras') + (pend ? ' · ' + pend + ' para conferir' : '') : 'compras e lotes', '') + '</section>';
    if (el._h !== h) {
      el.innerHTML = h;
      el._h = h;
    }
  }
  aposRender(renderCompras);
  // "Fornecedores ›": a tela de compras e lotes (antes a aba do Inventário)
  ACT.cpForn = function () {
    S.cont = false;
    S.det = false;
    S.open = '';
    inicioGo('lotes');
  };

  // ---------- as janelas da vaga (esboço 51, quadros 2 a 4, e 51b) ----------
  function cpVagaDe(k) {
    return cpVagas().filter(function (v) { return v.k === k; })[0] || null;
  }
  function cpGuarda(k, patch) {
    S.cpV[k] = Object.assign({}, S.cpV[k] || {}, patch);
    Object.keys(S.cpV[k]).forEach(function (x) { if (S.cpV[k][x] == null) delete S.cpV[k][x]; });
    saveSoon();
    render();
  }
  // linha que abre outra janela (tarefa) dentro de uma janela
  function cpLnVai(id, tit, sub) {
    return '<button type="button" class="pxL cpVai" data-cp="' + id + '"><span class="pxT"><b>' + esc(tit) + '</b><small>' + esc(sub) + '</small></span><i aria-hidden="true">›</i></button>';
  }
  // tocar numa vaga: o que dá para fazer com ela
  ACT.cpVaga = function (k) {
    var v = cpVagaDe(k);
    if (!v) return;
    var e = cpEstado(v), api = lfJanela({
      titulo: v.tit,
      cls: 'pxJn cpJn',
      monta: function (box) {
        box.innerHTML = '<p class="cnSub">' + esc(v.sub) + (v.refs.length && !v.grau ? ' · acabou ' + esc(v.refs.slice(0, 3).join(', ')) : '') + '</p>' +
          (e ? '<p class="cpE' + (e[0] ? ' ' + e[0] : '') + '">' + esc(e[1]) + '</p>' : '') +
          cpLnVai('fech', 'Fechei com…', 'a compra combinada: com quem, modelo, peças e preço') +
          cpLnVai('nin', 'Ninguém tinha', 'procurar equivalente ou avisar quando aparecer');
        box.onclick = function (ev) {
          var b = ev.target.closest('[data-cp]');
          if (!b) return;
          api.fecha(true);
          if (b.dataset.cp === 'fech') cpFechei(k);
          else cpNinguem(k);
        };
      }
    });
  };
  // distribuidoras que você já usou (das compras), a mais recente primeiro
  function cpDists() {
    var o = [];
    (S.grp || []).slice().sort(function (a, b) { return (+b.ts || 0) - (+a.ts || 0); }).forEach(function (g) {
      var f = String(g.forn || '').trim();
      if (f && o.indexOf(f) < 0) o.push(f);
    });
    return o;
  }
  // Titan: a margem com esse custo, no preço de hoje da peça (o mesmo piso e a mesma trava do resto do app: pisoPeca)
  function cpTitan(v, cu) {
    if (!(cu > 0)) return null;
    var ref = v.refs[0], it = S.items.filter(function (i) { return i.ref === ref && i.tipo === v.tipo; })[0] || { tipo: v.tipo, ref: ref },
      x = Object.assign({}, it, { custo: cu, qty: 0, lote: '', bulk: false }), pp = pisoPeca(x), p = tFor(x).price;
    if (!(p > 0) || !(pp.trava > 0)) return null;
    if (p < pp.trava) return ['bad', 'Titan: a ' + gs(p) + ' dá prejuízo com esse custo · não feche'];
    if (p < pp.piso) return ['warn', 'Titan: a ' + gs(p) + ' a margem fica baixa · o piso seria ' + gs(pp.piso)];
    return ['ok', 'Titan: margem boa a ' + gs(p) + ' · pode fechar'];
  }
  // escolher numa lista (distribuidora, modelo): uma linha por opção + "Outra…" escrita, e Salvar
  function cpEscolhe(tit, ops, atual, outraTxt, fim) {
    var E = { v: atual || '', outra: !!atual && ops.indexOf(atual) < 0 }, api;
    var pinta = function (box) {
      box.innerHTML = ops.map(function (o) {
        return '<button type="button" class="pxL" role="radio" aria-checked="' + (!E.outra && E.v === o) + '" data-o="' + esc(o) + '"><span class="pxT"><b>' + esc(o) + '</b></span><span class="pxR"></span></button>';
      }).join('') +
        '<button type="button" class="pxL" role="radio" aria-checked="' + E.outra + '" data-outra="1"><span class="pxT"><b>' + esc(outraTxt) + '</b></span><span class="pxR"></span></button>' +
        (E.outra ? '<input class="in cnOutra" id="cpOutra" maxlength="40" aria-label="' + esc(outraTxt) + '" value="' + esc(E.v) + '">' : '') +
        '<button type="button" class="go pxOk" data-ok="1">Salvar</button>';
    };
    api = lfJanela({
      titulo: tit,
      cls: 'pxJn',
      mudou: function () { var o = api.corpo.querySelector('#cpOutra'); return (o ? o.value.trim() : E.v) !== (atual || ''); },
      monta: function (box) {
        pinta(box);
        box.onclick = function (ev) {
          var b = ev.target.closest('button');
          if (!b) return;
          var o = box.querySelector('#cpOutra');
          if (o) E.v = o.value.trim();
          if (b.dataset.o != null) { E.v = b.dataset.o; E.outra = false; return pinta(box); }
          if (b.dataset.outra) { E.outra = true; E.v = ''; pinta(box); var n = box.querySelector('#cpOutra'); if (n) n.focus(); return; }
          if (b.dataset.ok) {
            if (!E.v) return lfToast('Escolha uma opção.', 'atencao');
            api.fecha(true);
            fim(E.v);
          }
        };
      }
    });
  }
  // "Fechei com…": distribuidora · modelo · peças · custo por peça · a linha do Titan · Salvar
  function cpFechei(k) {
    var v = cpVagaDe(k);
    if (!v) return;
    var f0 = v.st.fech || {}, ds = cpDists(),
      E = { dist: f0.dist || ds[0] || '', mod: f0.mod || (v.grau ? 'grau ' + v.grau : v.refs[0] + ' · o mesmo'), q: f0.q || v.falta, cu: f0.cu != null ? String(f0.cu).replace('.', ',') : v.cu ? String(v.cu).replace('.', ',') : '' },
      E0 = JSON.stringify(E), api;
    var le = function (box) { var c = box.querySelector('#cpCu'); if (c) E.cu = c.value; };
    var pinta = function (box) {
      var cu = parseFloat(String(E.cu).replace(',', '.')), ti = cpTitan(v, cu);
      box.innerHTML = '<p class="cnSub">' + esc(v.tit) + ' · faltam ' + v.falta + '</p>' +
        '<button type="button" class="cnLn cpLnB" data-cp="dist"><span>Distribuidora</span><b>' + esc(E.dist || 'escolher') + ' <i aria-hidden="true">›</i></b></button>' +
        (v.grau ? '' : '<button type="button" class="cnLn cpLnB" data-cp="mod"><span>Modelo</span><b>' + esc(E.mod) + ' <i aria-hidden="true">›</i></b></button>') +
        '<div class="cnLn"><span>Peças</span><span class="cnQt"><button type="button" data-d="-1" aria-label="Menos">−</button><b id="cpQ">' + E.q + '</b><button type="button" data-d="1" aria-label="Mais">+</button></span></div>' +
        '<label class="cnLn"><span>Custo por peça</span><span class="cnCu">US$ <input class="cnIn" id="cpCu" inputmode="decimal" placeholder="0,00" aria-label="Custo por peça em US$" value="' + esc(E.cu) + '"></span></label>' +
        (ti ? '<p class="cpTi ' + ti[0] + '">' + esc(ti[1]) + '</p>' : '<p class="cnNota">Diga o custo para o Titan conferir a margem.</p>') +
        '<button type="button" class="go pxOk" data-cp="salva">Salvar</button>';
    };
    api = lfJanela({
      titulo: 'Fechei com…',
      cls: 'pxJn cpJn',
      mudou: function () { le(api.corpo); return JSON.stringify(E) !== E0; },
      monta: function (box) {
        pinta(box);
        box.addEventListener('change', function (ev) { if (ev.target.id === 'cpCu') { le(box); pinta(box); } });
        box.onclick = function (ev) {
          var b = ev.target.closest('button');
          if (!b) return;
          le(box);
          if (b.dataset.d) { E.q = Math.max(1, Math.min(999, E.q + +b.dataset.d)); box.querySelector('#cpQ').textContent = E.q; return; }
          if (b.dataset.cp === 'dist') return cpEscolhe('Distribuidora', ds, E.dist, 'Outra distribuidora…', function (x) { E.dist = x; pinta(box); });
          if (b.dataset.cp === 'mod') return cpEscolhe('Modelo', v.refs.map(function (r) { return r + ' · o mesmo'; }), E.mod, 'Outro modelo…', function (x) { E.mod = x; pinta(box); });
          if (b.dataset.cp === 'salva') {
            var cu = parseFloat(String(E.cu).replace(',', '.'));
            if (!E.dist) return lfToast('Diga com qual distribuidora fechou.', 'atencao');
            api.fecha(true);
            cpGuarda(k, { fech: { dist: E.dist, mod: E.mod, q: E.q, cu: isFinite(cu) ? cu : null, ts: Date.now() }, nin: null });
            lfToast('✓ Fechado com ' + E.dist + ' · ' + E.q + (E.q === 1 ? ' peça' : ' peças'), 'ok');
          }
        };
      }
    });
  }
  // "Ninguém tinha" (51b): procurar equivalente · avisar quando aparecer · deixar sem (só sem ninguém esperando)
  function cpNinguem(k) {
    var v = cpVagaDe(k);
    if (!v) return;
    var ref = v.refs[0] || '', esp = v.esp, E = { o: v.st.nin || 'equiv', ab: false }, o0 = E.o, api,
      nomes = (S.espera || []).filter(function (e) { return v.refs.indexOf(e.ref) >= 0 && !e.av; }).map(function (e) { return e.nome || e.tel || 'Cliente'; });
    var op = function (id, tit, sub) {
      return '<button type="button" class="pxL" role="radio" aria-checked="' + (E.o === id) + '" data-o="' + id + '"><span class="pxT"><b>' + esc(tit) + '</b><small>' + esc(sub) + '</small></span><span class="pxR"></span></button>';
    };
    var pinta = function (box) {
      box.innerHTML = '<p class="cnSub">' + esc(v.tit) + ' · faltam ' + v.falta + '</p>' +
        (esp ? '<button type="button" class="cnLn cpLnB" data-ab="1" aria-expanded="' + E.ab + '"><span>' + esp + (esp === 1 ? ' cliente espera esta peça' : ' clientes esperam esta peça') + '</span><b>me avise <i aria-hidden="true">' + (E.ab ? '⌃' : '⌄') + '</i></b></button>' +
          (E.ab ? '<p class="cnNota">' + esc(nomes.join(', ')) + '</p>' : '') : '') +
        op('equiv', 'Procurar equivalente', (ref ? 'pela foto da ' + ref + ': ' : '') + 'mesmo formato, material e faixa de preço. Entra no próximo Pedir.' + (esp ? ' Quando chegar, aviso ' + (esp === 1 ? 'o cliente.' : 'os ' + esp + ' clientes.') : '')) +
        op('avisar', 'Avisar quando aparecer', (ref ? 'espera a própria ' + ref + '. ' : '') + 'O Semp confere as distribuidoras e avisa no sino.') +
        (esp ? '<p class="cnNota">"Deixar sem" só aparece quando ninguém está esperando.</p>' : op('sem', 'Deixar sem', 'sai da lista até alguém pedir "me avise"')) +
        '<button type="button" class="go pxOk" data-ok="1">Salvar</button>';
    };
    api = lfJanela({
      titulo: 'Ninguém tinha',
      cls: 'pxJn cpJn',
      mudou: function () { return E.o !== o0 || !v.st.nin; },
      monta: function (box) {
        pinta(box);
        box.onclick = function (ev) {
          var b = ev.target.closest('button');
          if (!b) return;
          if (b.dataset.ab) { E.ab = !E.ab; return pinta(box); }
          if (b.dataset.o) { E.o = b.dataset.o; return pinta(box); }
          if (b.dataset.ok) {
            api.fecha(true);
            cpGuarda(k, { nin: E.o, fech: null });
          }
        };
      }
    });
  }
  // ---------- Pedir: uma mensagem só, em espanhol, com todas as vagas sem fechar (quadro 3) ----------
  var CP_ES_TIPO = { pre: 'lentes de lectura', sem: 'armazones', solar: 'lentes de sol' },
    CP_ES_PUB = { Feminino: 'de mujer', Masculino: 'de hombre', Infantil: 'infantiles', Unissex: 'unisex' },
    CP_ES_MAT = { Metal: 'metal', Acetato: 'acetato', 'Plástico': 'plástico', TR90: 'TR90', 'Titânio': 'titanio', Nylon: 'nylon' };
  function cpLinhaEs(v) {
    if (v.grau) return '· ' + v.resto + ' ' + (CP_ES_TIPO[v.tipo] || (tipoOf(v.tipo) || {}).label || v.tipo) + ' ' + v.grau.replace('.', ',');
    var p = v.k.split('|'), d = [CP_ES_PUB[p[1]] || '', CP_ES_MAT[p[2]] || p[2] || ''].filter(Boolean);
    return '· ' + v.resto + ' ' + (CP_ES_TIPO[v.tipo] || (tipoOf(v.tipo) || {}).label || v.tipo) + (d.length ? ' ' + d.join(', ') : '') +
      (v.st.nin === 'equiv' && v.refs[0] ? ' (parecido a ' + v.refs[0] + ')' : '') + (v.cu > 0 ? ', hasta ' + cpAte(v.cu) : '');
  }
  function cpMensagem(V) {
    return 'Hola, ¿qué tienen de esto?\n' + V.map(cpLinhaEs).join('\n') + '\nGracias. La Fouch';
  }
  ACT.cpPedir = function () {
    var V = cpSemFechar(cpVagas());
    if (!V.length) return;
    var api = lfJanela({
      titulo: 'Pedir',
      cls: 'pxJn cpJn',
      monta: function (box) {
        box.innerHTML = '<p class="cnSub">' + V.length + (V.length === 1 ? ' vaga sem fechar' : ' vagas sem fechar') + ' · em espanhol</p>' +
          '<div class="cpMsg">' + esc(cpMensagem(V)).replace(/\n/g, '<br>') + '</div>' +
          '<p class="cnNota">Você escolhe para quem mandar no próprio WhatsApp: uma distribuidora ou várias. As vagas ficam "pedida · esperando resposta".</p>' +
          '<button type="button" class="go pxOk" data-ok="1">Mandar</button>';
        box.onclick = function (ev) {
          if (!ev.target.closest('[data-ok]')) return;
          var t = Date.now();
          V.forEach(function (v) { S.cpV[v.k] = Object.assign({}, S.cpV[v.k] || {}, { ped: t }); });
          saveSoon();
          api.fecha(true);
          lcManda(cpMensagem(V));
          render();
        };
      }
    });
  };
