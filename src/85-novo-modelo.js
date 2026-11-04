  // ===== Novo modelo e Cores e fotos: cadastro à mão e depois de ler a haste (projeto aprovado em 27/10). =====
  // Os campos antigos (código, custo, lote, nome, descrição) continuam sendo o motor: esta tela só os reorganiza.
  S.nStep = 1; // 1 = Novo modelo, 2 = Cores e fotos
  S.nPop = ''; // campo com as opções abertas
  S.nCorOpen = false;
  S.nNovoFmt = false;
  var NVC = { cor: '', q: 1, vr: '', grau: '', fotoT: '', fotoH: '', fotoCor: '' };
  var NV_MAT = ['Metal', 'Acetato', 'TR90', 'Plástico', 'Titânio', 'Nylon'];
  var NV_PUB = ['Unissex', 'Feminino', 'Masculino', 'Infantil'];
  function nvAtr(ref) {
    try {
      return (ref && attrOf(ref)) || {};
    } catch (e) {
      return {};
    }
  }
  function medParse(v) {
    var m = String(v || '').match(/(\d{2})\D*?(\d{1,2})\D+(\d{3})/);
    return m ? [m[1], m[2], m[3]] : null;
  }
  // Marca o campo que falta: balança, contorno vermelho e rola até ele.
  function guiaMarca(id) {
    var e = $(id);
    if (!e) return;
    try {
      e.scrollIntoView({ block: 'center', behavior: REDUCED ? 'auto' : 'smooth' });
    } catch (x) {}
    e.classList.add('nvbad');
    if (!REDUCED) {
      var w = e.parentNode || e;
      w.classList.remove('lfshake');
      void w.offsetWidth;
      w.classList.add('lfshake');
    }
    setTimeout(function () {
      e.classList.remove('nvbad');
    }, 2600);
  }
  // Campo que abre opções ao tocar.
  function nvFld(key, rotulo) {
    var w = mk('div', ''),
      b = mk('button', 'in nvf ph');
    w.appendChild(mk('div', 'lbl', rotulo));
    b.type = 'button';
    b.id = 'nv_' + key;
    b.onclick = function () {
      S.nPop = S.nPop === key ? '' : key;
      render();
    };
    var p = mk('div', 'nav');
    p.id = 'nvp_' + key;
    p.style.marginTop = '8px';
    p.hidden = true;
    w.appendChild(b);
    w.appendChild(p);
    w.id = 'nvw_' + key;
    return w;
  }
  // Limpa as medidas digitadas ao abrir um cadastro novo.
  function nvLimpaMed() {
    ['nvL', 'nvP', 'nvH'].forEach(function (k) {
      if ($(k)) $(k).value = '';
    });
  }
  function nvNum(id, rotulo) {
    var w = mk('div', ''),
      i = mk('input', 'in');
    w.appendChild(mk('div', 'lbl', rotulo));
    i.id = id;
    i.inputMode = 'numeric';
    i.autocomplete = 'off';
    i.maxLength = 3;
    i.placeholder = '—';
    i.setAttribute('aria-label', rotulo);
    i.oninput = function () {
      i.value = i.value.replace(/\D/g, '');
      var l = $('nvL').value,
        p = $('nvP').value,
        h = $('nvH').value;
      $('eMed').value = l && p && h ? l + '□' + p + '-' + h : '';
      render();
    };
    w.appendChild(i);
    return w;
  }
  function nvMontar() {
    if ($('nvBox')) return;
    var rest = $('addProdRest'),
      box = mk('div', 'col');
    box.id = 'nvBox';
    box.style.gap = '14px';
    rest.insertBefore(box, rest.firstChild);
    var sub = mk('div', 'hint');
    sub.id = 'nvSub';
    sub.style.margin = '-8px 0 0';
    box.appendChild(sub);
    // ---- tela 1
    var s1 = mk('div', 'col');
    s1.id = 'nvS1';
    s1.style.gap = '14px';
    box.appendChild(s1);
    var ess = mk('div', 'card col');
    ess.style.gap = '12px';
    ess.id = 'nvEss';
    s1.appendChild(ess);
    // Cadastro B (v417): código da haste com leitor · Tipo em trilho · "Como é" em chips · custo · Mais detalhes
    var fFmt = nvChip('fmt', 'Formato'),
      fMat = nvChip('mat', 'Material'),
      fPub = nvChip('pub', 'Gênero');
    var cw = mk('div', '');
    cw.id = 'nvCod';
    var rw = $('eRef').parentNode;
    cw.appendChild(rw);
    ess.appendChild(cw);
    rw.classList.add('nvCodW');
    var ler = mk('button', 'nvLer');
    ler.type = 'button';
    ler.id = 'nvLer';
    ler.innerHTML = ICO.haste;
    ler.setAttribute('aria-label', 'Ler a haste');
    ler.onclick = function () {
      hasteOpen($('eRef'));
    };
    $('eRef').insertAdjacentElement('afterend', ler);
    // aviso do código + botão "Dar entrada rápida" na mesma linha (botão à direita do texto)
    var rr = mk('div', 'eRefRow');
    rr.id = 'eRefRow';
    rr.appendChild($('eRefH'));
    ess.appendChild(rr);
    var tw = mk('div', '');
    tw.appendChild(mk('div', 'lbl', 'Tipo'));
    var tt = mk('div', 'trk');
    tt.id = 'nvTipoTrk';
    tt.innerHTML = '<span class="trkTh"></span>' + NV_TIPOS.map(function (x) {
      return '<button type="button" class="trkB" data-m="' + x[0] + '">' + x[1] + '</button>';
    }).join('');
    tt.onclick = function (e) {
      var b = e.target.closest('.trkB');
      if (!b) return;
      nvTipoPor(b.dataset.m);
    };
    tw.appendChild(tt);
    ess.appendChild(tw);
    var cm = mk('div', '');
    cm.id = 'nvComo';
    cm.appendChild(mk('div', 'lbl', 'Como é'));
    var r2 = mk('div', 'nvChips');
    r2.id = 'nvR2';
    r2.appendChild(fFmt);
    r2.appendChild(fMat);
    r2.appendChild(fPub);
    cm.appendChild(r2);
    ess.appendChild(cm);
    // compatibilidade: o antigo "Novo formato" fica guardado (o "Criar novo" agora está na gaveta)
    var nf = mk('div', 'col');
    nf.id = 'nvNovoFmt';
    nf.hidden = true;
    ess.appendChild(nf);
    var r3 = mk('div', 'nvg3');
    r3.id = 'nvMed';
    r3.appendChild(nvNum('nvL', 'Lente (mm)'));
    r3.appendChild(nvNum('nvP', 'Ponte (mm)'));
    r3.appendChild(nvNum('nvH', 'Haste (mm)'));
    var r4 = mk('div', '');
    r4.id = 'nvR4';
    var cu = mk('div', '');
    cu.id = 'nvCusto';
    cu.appendChild($('eCustoB'));
    r4.appendChild(cu);
    ess.appendChild(r4);
    var lt = mk('div', '');
    lt.id = 'nvLote';
    lt.appendChild($('eLoteB'));
    var dw = mk('div', 'fmAviso');
    dw.id = 'nvDeRef';
    dw.hidden = true;
    s1.appendChild(dw);
    var au = mk('div', 'nvauto');
    au.id = 'nvAuto';
    au.hidden = true;
    s1.appendChild(au);
    var mais = document.createElement('details');
    mais.id = 'nvMais';
    mais.innerHTML = '<summary class="lbl" style="cursor:pointer;margin:0">Mais detalhes (opcional)</summary><div class="col" id="nvMaisBox" style="gap:12px;margin-top:10px"></div>';
    s1.appendChild(mais);
    var mb = $('nvMaisBox');
    mb.appendChild($('eFaixaB'));
    mb.appendChild(r3);
    mb.appendChild($('eNomeB'));
    mb.appendChild($('eBox').querySelector('.descp'));
    mb.appendChild(lt);
    // Tipo "Outro" = compra de brindes (despesa, sem estoque)
    var bo = mk('div', 'col');
    bo.id = 'nvBrinde';
    bo.hidden = true;
    s1.appendChild(bo);
    var nx = btn('go', 'Continuar · cores e fotos', function () {
      nvContinuar();
    });
    nx.id = 'nvNext';
    s1.appendChild(nx);
    // ---- tela 2
    var s2 = mk('div', 'col');
    s2.id = 'nvS2';
    s2.style.gap = '14px';
    box.appendChild(s2);
    // ---- foto de uma cor
    var fi = document.createElement('input');
    fi.type = 'file';
    fi.accept = 'image/*';
    fi.hidden = true;
    fi.id = 'nvFile';
    fi.onchange = function () {
      nvFoto(fi.files && fi.files[0]);
      fi.value = '';
    };
    box.appendChild(fi);
  }
  // Passos da tela 1: [rótulo, id do campo, feito].
  function nvPassos() {
    var t = tipoOf(S.tipo) || {},
      simple = !!t.simple,
      at = nvAtr(S._ref),
      cu = parseFloat(String($('eCusto').value || '').replace(',', '.')),
      pg = pickG(S.tipo, S.gSel),
      p = [];
    if (simple) p.push(['Nome', 'eRef', !!S._ref]);
    if (!simple) {
      p.push(['Formato', 'nv_fmt', !!S._fmtUsed]);
      p.push(['Material', 'nv_mat', !!(S.eMat || at.material)]);
      p.push(['Gênero', 'nv_pub', !!(S.ePub || at.publico)]);
    }
    p.push(['Custo', 'eCusto', cu > 0 || !!pg.g]);
    return p;
  }
  function nvContinuar() {
    var f = nvPassos().filter(function (x) {
      return !x[2];
    })[0];
    if (f) {
      popErr('Falta ' + f[0].toLowerCase() + '.');
      guiaMarca(f[1]);
      return;
    }
    var t = tipoOf(S.tipo) || {};
    if (!S._ref && !t.simple) {
      $('eRef').value = refAuto(S.tipo);
      S.nAutoRef = $('eRef').value;
      render();
    }
    if (t.simple) {
      S.nStep = 2;
    } else S.nStep = 2;
    S.nPop = '';
    render();
    try {
      $('addModal').scrollTop = 0;
    } catch (e) {}
  }
  // Lista suspensa no estilo "Label Select": caixa de busca com lupa e seta, itens embaixo.
  function nvOpcoes(key, lista, atual, set, extra) {
    var p = $('nvp_' + key);
    if (!p) return;
    p.hidden = S.nPop !== key;
    p.textContent = '';
    p.className = 'lsel';
    if (p.hidden) return;
    var cx = mk('div', 'lsBox'),
      lupa = mk('span', 'lsIc', '🔍'),
      q = document.createElement('input'),
      seta = mk('span', 'lsSeta', '▲'),
      ul = mk('div', 'lsList');
    q.className = 'lsIn';
    q.placeholder = 'Buscar ' + ({ tipo: 'tipo', fmt: 'formato', mat: 'material', pub: 'gênero' }[key] || '');
    q.autocomplete = 'off';
    q.setAttribute('aria-label', 'Buscar');
    cx.appendChild(lupa);
    cx.appendChild(q);
    cx.appendChild(seta);
    seta.onclick = function () {
      S.nPop = '';
      render();
    };
    p.appendChild(cx);
    p.appendChild(ul);
    function pinta() {
      var t = q.value.trim().toLowerCase();
      ul.textContent = '';
      lista.forEach(function (v) {
        if (t && String(v).toLowerCase().indexOf(t) < 0) return;
        var c = mk('button', 'lsOpt' + (atual === v ? ' on' : ''), v);
        c.type = 'button';
        c.setAttribute('role', 'option');
        c.setAttribute('aria-selected', atual === v ? 'true' : 'false');
        c.onclick = function () {
          set(v);
          S.nPop = '';
          render();
        };
        ul.appendChild(c);
      });
      if (!ul.firstChild) ul.appendChild(mk('div', 'lsVazio', 'Nada com esse nome'));
      if (extra) ul.appendChild(extra);
    }
    q.oninput = pinta;
    pinta();
  }
  function nvCampo(key, valor) {
    var b = $('nv_' + key);
    if (!b) return;
    b.className = 'in nvf ' + (valor ? 'ok' : 'ph');
    b.textContent = '';
    var s = mk('span', '', valor || 'Escolher');
    b.appendChild(s);
    if (valor) {
      var c = mk('span', 'nvck', '✓');
      b.appendChild(c);
    }
  }
  // Nome, rosto e faixa que o app preenche sozinho.
  function nvAutoCard() {
    var au = $('nvAuto'),
      t = tipoOf(S.tipo) || {},
      at = nvAtr(S._ref),
      fm = S._fmtUsed || '',
      mt = S.eMat || at.material || '',
      cu = parseFloat(String($('eCusto').value || '').replace(',', '.')),
      pg = pickG(S.tipo, S.gSel),
      c = pg.g ? gUnit(pg.g) : cu;
    au.hidden = !!t.simple || !fm;
    if (au.hidden) return;
    var base = S.tipo === 'solar' ? 'Solar' : S.tipo === 'pre' ? 'Pré-graduado' : 'Armação',
      nome = (base + ' ' + fm.toLowerCase() + ' ' + mt.toLowerCase()).replace(/\s+/g, ' ').trim(),
      rosto = (ROSTO_DE[fm] || []).join(', ').replace('coracao', 'coração'),
      fx = null;
    if (S.eFaixa)
      fx = S.faixas.filter(function (x) {
        return x.id === S.eFaixa;
      })[0];
    else if (S._ref && faixaOf(S._ref)) fx = faixaOf(S._ref);
    else if (S.faixaAuto && S.faixaAuto.on && S.faixas.length && c > 0) {
      var lim = S.faixaAuto.lim || [],
        k = 0;
      while (k < lim.length && k < S.faixas.length - 1 && c > lim[k]) k++;
      fx = S.faixas[k];
    }
    var pr = fx && fx.precos && fx.precos[S.tipo] > 0 ? fx.precos[S.tipo] : t.price > 0 ? t.price : 0;
    au.innerHTML =
      '<h3>O app preenche sozinho</h3><div class="r"><span>Nome no site</span><b>' +
      esc(nome) +
      '</b></div>' +
      (rosto ? '<div class="r"><span>Rosto que combina</span><b>' + esc(rosto) + '</b></div>' : '') +
      '<div class="r"><span>Faixa e preço</span><b>' +
      esc(fx ? fx.nome : c > 0 ? 'Sem faixa' : 'Falta o custo') +
      (pr > 0 ? ' · ' + gs(pr) : '') +
      '</b></div>';
  }
  // Cores já cadastradas do modelo, com quantidade e foto.
  function nvCores(ref) {
    var seen = {},
      out = [];
    S.items.forEach(function (i) {
      if (i.ref !== ref || i.bulk) return;
      var o = seen[i.cor];
      if (!o) {
        o = seen[i.cor] = { cor: i.cor, qty: 0 };
        out.push(o);
      }
      o.qty += i.qty;
    });
    return out;
  }
  // Abre a câmera do app (não a galeria) para a foto da cor.
  var NV_ICAM =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.6"/></svg>';
  function nvCamera(titulo) {
    camOpen(
      function (f) {
        nvFoto(f);
      },
      titulo,
      { gallery: true, tip: 'Ponha UMA peça inteira dentro do retângulo. Toque na tela para focar.' }
    );
  }
  function nvFoto(f) {
    if (!f || !S._ref || !NVC.fotoCor) return;
    loadMsg(true, 'Carregando foto');
    var ref = S._ref,
      cor = NVC.fotoCor,
      url = URL.createObjectURL(f),
      img = new Image();
    img.onload = function () {
      try {
        var cv = fitCanvas(img, 1800);
        if (cor === '__nova__') {
          // v417: a foto cria a linha da cor nova na lista (cor sugerida e quantidade 1)
          NVR.push({ id: ++NVR_SEQ, vr: nvProxClasse(), cor: '', q: 1, grau: '', fotoT: thumbOf(cv), fotoH: cv.toDataURL('image/jpeg', 0.92), nova: 1 });
          NVR_ABRE = 0;
        } else if (String(cor).indexOf('__row__') === 0) {
          var rw0 = nvRow(+String(cor).slice(7));
          if (rw0) {
            rw0.fotoT = thumbOf(cv);
            rw0.fotoH = cv.toDataURL('image/jpeg', 0.92);
          }
        } else {
          setFoto(ref + '|' + cor, thumbOf(cv), cv.toDataURL('image/jpeg', 0.92));
          if (S.site && S.site[ref] && typeof vitFila === 'function') vitFila(ref, 'upd');
          saveSoon();
        }
      } catch (e) {
        S.msg = 'Não consegui processar essa foto. Tente outra.';
      }
      URL.revokeObjectURL(url);
      var corV = NVC.fotoCor;
      NVC.fotoCor = '';
      render();
      loadMsg(false);
      try {
        if (OBT) {
          var alvo =
            $('nvPrev') ||
            document.querySelector('[aria-label="Foto da cor ' + String(corV).replace(/"/g, '') + '"] img');
          if (alvo) obturadorVoa(OBT, null, alvo);
          OBT = null;
        }
      } catch (eV) {}
    };
    img.onerror = function () {
      loadMsg(false);
      S.msg = 'Não consegui abrir essa imagem. Tente outra foto.';
      NVC.fotoCor = '';
      render();
    };
    img.src = url;
  }
  // Adiciona uma cor: usa o mesmo motor de "Registrar entrada".
  function nvConcluir(ref) {
    NVR = [];
    NVR_ABRE = 0;
    S.nStep = 1;
    S.nPop = '';
    S.nCorOpen = false;
    closeAdd();
    lfToast('✓ ' + pubNome(ref) + ' cadastrado.');
  }
  function nvAddCor(fin) {
    var ref = S._ref,
      t = tipoOf(S.tipo) || {},
      pre = S.tipo === 'pre';
    if (!NVC.cor) {
      popErr('Escolha a cor.');
      guiaMarca('nvCorIn');
      return;
    }
    if (!NVC.fotoT) {
      popErr('Tire a foto da cor ' + NVC.cor + '.');
      guiaMarca('nvFotoCor');
      return;
    }
    if (pre && !normGrau($('nvGrau').value || '')) {
      popErr('Informe o grau da peça (ex.: +1.75 ou 175).');
      guiaMarca('nvGrau');
      return;
    }
    var custo = $('eCusto').value;
    $('eCor').value = NVC.cor;
    if (pre) {
      $('eGrau').value = $('nvGrau').value;
      if (NVC.vr) S.eVarP = NVC.vr;
    } else if (NVC.vr) S.eVar = NVC.vr;
    S.qty = Math.max(1, NVC.q);
    render();
    var antes = S.items.reduce(function (n, i) {
      return n + (i.ref === ref ? i.qty : 0);
    }, 0);
    S.msg = '';
    $('go').onclick();
    var depois = S.items.reduce(function (n, i) {
      return n + (i.ref === ref ? i.qty : 0);
    }, 0);
    $('eCusto').value = custo;
    if (depois <= antes) {
      var m = S.msg || 'Não consegui registrar a cor. Confira os dados.';
      popErr(m);
      render();
      return;
    }
    var qOk = NVC.q;
    setFoto(ref + '|' + NVC.cor, NVC.fotoT, NVC.fotoH);
    if (S.site && S.site[ref] && typeof vitFila === 'function') vitFila(ref, 'upd');
    saveSoon();
    NVC.fotoT = '';
    NVC.fotoH = '';
    S.nCorOpen = false;
    NVC.cor = '';
    NVC.q = 1;
    NVC.grau = '';
    S.msg = '';
    render();
    lfEntrada(qOk, pubNome(ref));
    if (fin === true) nvConcluir(ref);
  }
  function nvTela2() {
    var s2 = $('nvS2'),
      ref = S._ref,
      t = tipoOf(S.tipo) || {},
      pre = S.tipo === 'pre';
    s2.textContent = '';
    if (t.simple) {
      var cq = mk('div', 'card col');
      cq.style.gap = '10px';
      cq.appendChild(mk('div', 'lbl', 'Quantas peças?'));
      var sq = mk('div', 'nvstp'),
        qm = btn('step', '−', function () {
          S.qty = Math.max(1, S.qty - 1);
          render();
        }),
        qp = btn('step', '+', function () {
          S.qty = Math.min(999, S.qty + 1);
          render();
        });
      qm.setAttribute('aria-label', 'Diminuir quantidade');
      qp.setAttribute('aria-label', 'Aumentar quantidade');
      sq.appendChild(qm);
      sq.appendChild(mk('b', '', String(S.qty)));
      sq.appendChild(qp);
      cq.appendChild(sq);
      s2.appendChild(cq);
      var rg = btn('go', 'Registrar entrada', function () {
        var antes = S.items.reduce(function (n, i) {
          return n + (i.ref === ref ? i.qty : 0);
        }, 0);
        S.msg = '';
        $('go').onclick();
        var dep = S.items.reduce(function (n, i) {
          return n + (i.ref === ref ? i.qty : 0);
        }, 0);
        if (dep <= antes) {
          popErr(S.msg || 'Não consegui registrar. Confira os dados.');
          render();
          return;
        }
        var q0 = dep - antes;
        S.nStep = 1;
        closeAdd();
        lfEntrada(q0, pubNome(ref));
      });
      s2.appendChild(rg);
      return;
    }
    var cs = nvCores(ref),
      sc = siteCheck(ref);
    // v417: Cores e fotos em LISTA. Cada cor é uma linha (foto, classe · cor, custo, quantidade);
    // "Cor nova" abre a câmera e a foto vira uma linha nova com a cor sugerida.
    var c1 = mk('div', 'card col cfList');
    c1.id = 'nvCoresL';
    var cuTxt = String($('eCusto').value || '').trim();
    cs.forEach(function (c) {
      var ft = S.fotos[ref + '|' + c.cor],
        it0 = S.items.filter(function (i) {
          return i.ref === ref && i.cor === c.cor && !i.bulk;
        })[0] || {},
        k = 'c:' + c.cor,
        ab = NVR_ABRE === k,
        r = mk('div', 'cfRow' + (ab ? ' ab' : ''));
      r.innerHTML =
        '<button type="button" class="cfFt" aria-label="Foto da cor ' + esc(c.cor) + '">' + (ft ? '<img alt="" src="' + ft + '">' : NV_ICAM) + '</button>' +
        '<button type="button" class="cfTx" data-k="' + esc(k) + '"><b>' + esc((it0.vr ? it0.vr + ' · ' : '') + c.cor) + '</b><small>' + (it0.custo != null ? 'US$ ' + String(it0.custo).replace('.', ',') + ' · ' : '') + (ft ? 'foto ok' : 'falta foto') + '</small></button>' +
        '<span class="cfQ">' + c.qty + ' un.</span>' +
        (ab ? '<div class="cfMais"><button type="button" class="mini" data-f="1">Trocar foto</button></div>' : '');
      r.querySelector('.cfFt').onclick = function () {
        NVC.fotoCor = c.cor;
        nvCamera('Foto da cor ' + c.cor);
      };
      r.querySelector('.cfTx').onclick = function () {
        NVR_ABRE = ab ? 0 : k;
        render();
      };
      if (ab)
        r.querySelector('[data-f]').onclick = function () {
          NVC.fotoCor = c.cor;
          nvCamera('Foto da cor ' + c.cor);
        };
      c1.appendChild(r);
    });
    NVR.forEach(function (w) {
      var ab = NVR_ABRE === w.id,
        r = mk('div', 'cfRow nova' + (ab ? ' ab' : '') + (w.id === NVR_SEQ && w.nova ? ' entra' : ''));
      w.nova = 0;
      r.dataset.id = w.id;
      r.innerHTML =
        '<button type="button" class="cfFt" aria-label="Trocar a foto">' + (w.fotoT ? '<img alt="" src="' + w.fotoT + '">' : NV_ICAM) + '</button>' +
        '<div class="cfTx"><button type="button" class="nvChip cfCor' + (w.cor ? ' ok' : '') + '" aria-label="Escolher a cor"><span>' + esc((w.vr ? w.vr + ' · ' : '') + (w.cor || 'Cor')) + '</span><i aria-hidden="true">▾</i></button>' +
        (pre ? '<input class="in cfGrau" inputmode="decimal" placeholder="Grau (ex.: +1,75)" value="' + esc(w.grau || '') + '" aria-label="Grau da peça">' : '') +
        '<small class="cfMaisB">' + (cuTxt ? 'US$ ' + esc(cuTxt) + ' · ' : '') + 'mais opções</small></div>' +
        '<span class="vstep cfStep"><span class="vs-b" role="button" tabindex="0" data-d="-1" aria-label="Menos">−</span><span class="vs-n">' + w.q + '</span><span class="vs-b" role="button" tabindex="0" data-d="1" aria-label="Mais">+</span></span>' +
        (ab ? '<div class="cfMais"><button type="button" class="mini" data-f="1">Trocar foto</button><button type="button" class="mini cfDel" data-x="1">Excluir cor</button></div>' : '');
      r.querySelector('.cfFt').onclick = function () {
        NVC.fotoCor = '__row__' + w.id;
        nvCamera('Foto da cor');
      };
      r.querySelector('.cfCor').onclick = function () {
        nvCorSheet(w);
      };
      r.querySelector('.cfMaisB').onclick = function () {
        NVR_ABRE = ab ? 0 : w.id;
        render();
      };
      var gi = r.querySelector('.cfGrau');
      if (gi)
        gi.oninput = function () {
          w.grau = gi.value;
        };
      [].forEach.call(r.querySelectorAll('.cfStep .vs-b'), function (b) {
        b.onclick = function () {
          var antes = w.q;
          w.q = Math.max(1, Math.min(999, w.q + +b.dataset.d));
          if (w.q === antes) return;
          var n = r.querySelector('.vs-n');
          n.textContent = w.q;
          if (!REDUCED && n.animate) n.animate([{ transform: 'translateY(' + (w.q > antes ? 14 : -14) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 280, easing: 'cubic-bezier(.4,0,.2,1)' });
          nvTotalConta();
        };
      });
      if (ab) {
        r.querySelector('[data-f]').onclick = function () {
          NVC.fotoCor = '__row__' + w.id;
          nvCamera('Foto da cor');
        };
        r.querySelector('[data-x]').onclick = function () {
          NVR = NVR.filter(function (x) {
            return x !== w;
          });
          NVR_ABRE = 0;
          render();
        };
      }
      c1.appendChild(r);
    });
    var cn = mk('button', 'cfNova');
    cn.type = 'button';
    cn.id = 'nvAddCor';
    cn.innerHTML = NV_ICAM + '<span>Cor nova <small>(tire a foto)</small></span>';
    cn.onclick = function () {
      NVC.fotoCor = '__nova__';
      nvCamera('Foto da cor nova');
    };
    c1.appendChild(cn);
    var tot = mk('div', 'cfTot');
    tot.innerHTML = '<span>Total chegando</span><b id="nvTot">' + nvTotal() + ' peças</b>';
    tot.hidden = !NVR.length;
    c1.appendChild(tot);
    s2.appendChild(c1);
    // liberar para o site
    var c2 = mk('div', 'card col');
    c2.style.gap = '10px';
    var lh = mk('div', '');
    lh.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:10px';
    lh.appendChild(mk('b', '', 'Liberar para o site'));
    var on = siteOn(ref),
      tg = mk('button', 'nvtg' + (on ? ' on' : ''));
    tg.type = 'button';
    tg.id = 'nvTg';
    tg.setAttribute('role', 'switch');
    tg.setAttribute('aria-checked', on ? 'true' : 'false');
    tg.setAttribute('aria-label', 'Liberar para o site');
    tg.appendChild(document.createElement('i'));
    tg.onclick = function () {
      var ck = siteCheck(ref);
      if (on) {
        siteSet(ref, false);
        render();
        return;
      }
      if (!ck.ok) {
        S.nTgFalha = true;
        render();
        var t2 = $('nvTg');
        if (t2 && !REDUCED) {
          t2.classList.remove('lfshake');
          void t2.offsetWidth;
          t2.classList.add('lfshake');
        }
        return;
      }
      siteSet(ref, true);
      S.nTgFalha = false;
      render();
      lfToast('✓ Salvo. Aparece no site em até 1 minuto.');
    };
    lh.appendChild(tg);
    c2.appendChild(lh);
    var falta = sc.falta.map(function (c) {
        return c.cor;
      }),
      msg;
    if (!on && !sc.cores.length) msg = 'Adicione uma cor com foto para liberar.';
    else if (falta.length)
      msg = 'Falta a foto da cor ' + falta.join(', ') + '. Adicione a foto ou remova a cor para liberar.';
    else if (sc.sem) msg = 'Sem peças em estoque: não dá para publicar o que você não tem.';
    var h = mk('div', msg && (falta.length || S.nTgFalha) ? 'nvwarn' : 'hint', msg || (on ? 'No ar. O site acompanha preço e estoque sozinho.' : 'Pronto para liberar.'));
    if (!(msg && (falta.length || S.nTgFalha))) h.style.margin = '0';
    c2.appendChild(h);
    s2.appendChild(c2);
    // aviso automático no cartão
    var rec = S.cad && S.cad[ref] && Date.now() - S.cad[ref] < 7 * 86400000;
    if (cs.length) {
      var c3 = mk('div', 'nvauto');
      c3.innerHTML =
        '<h3>Aviso no cartão do site (automático)</h3><div style="color:var(--info)">' +
        (rec ? 'Chegou esta semana' : 'Sem aviso agora') +
        '</div>';
      s2.appendChild(c3);
    }
    var fim = btn('go', cs.length || NVR.length ? 'Concluir' : 'Adicione uma cor para concluir', function () {
      if (NVR.length) return nvSalvaLinhas();
      if (!cs.length) return;
      nvConcluir(ref);
    });
    fim.id = 'nvFim';
    fim.disabled = !cs.length && !NVR.length;
    s2.appendChild(fim);
  }
  function renderGuia() {
    var rest = $('addProdRest'),
      box = $('eBox');
    if (!box || S.addMode !== 'prod') {
      NVR = [];
      NVR_ABRE = 0;
      if (rest) rest.removeAttribute('data-nv');
      if (/^(Novo modelo|Cores e fotos)$/.test($('addTitle').textContent)) $('addTitle').textContent = 'Adicionar';
      S.nStep = 1;
      S.nCorOpen = false;
      return;
    }
    nvMontar();
    rest.setAttribute('data-nv', '1');
    var t = tipoOf(S.tipo) || {},
      pre = S.tipo === 'pre',
      simple = !!t.simple,
      at = nvAtr(S._ref),
      st = S.nStep === 2 && S._ref ? 2 : 1;
    if (S.nStep === 2 && !S._ref) S.nStep = 1;
    $('nvS1').hidden = st !== 1;
    $('nvS2').hidden = st !== 2;
    $('addTitle').textContent = st === 2 ? 'Cores e fotos' : 'Novo modelo';
    $('nvSub').textContent =
      st === 2
        ? 'Toda cor liberada precisa de foto. ' + (S._ref || '')
        : S.nDeRef
          ? 'Copiado de ' + S.nDeRef + ' · confira'
          : S.nLido
          ? 'Lido da haste · confira e complete'
          : 'À mão · o app guia e confere';
    $('addBack').hidden = st !== 2;
    if ($('nvDeRef')) {
      var dr = !!(S.nDeRef && !$('eRef').value.trim());
      $('nvDeRef').hidden = !dr;
      $('nvDeRef').textContent = 'Digite o código deste modelo. O restante veio do ' + (S.nDeRef || '') + ': corrija o que for diferente.';
      $('eRef').classList.toggle('nvbad', dr);
    }
    // o botão Voltar do topo leva à tela anterior
    if (!$('addBack').dataset.nv) {
      $('addBack').dataset.nv = '1';
      var ob = $('addBack').onclick;
      $('addBack').onclick = function (e) {
        if (S.addMode === 'prod' && S.nStep === 2) {
          S.nStep = 1;
          S.nCorOpen = false;
          render();
          return;
        }
        if (ob) return ob.call(this, e);
      };
    }
    if (st === 2) {
      nvTela2();
      return;
    }
    // ---- tela 1 (Cadastro B)
    var outro = !!S.nOutro;
    trkPoe($('nvTipoTrk'), outro ? 'outro' : S.tipo);
    $('nvBrinde').hidden = !outro;
    [$('nvCod'), $('eRefRow'), $('nvComo'), $('nvR4'), $('nvMais'), $('nvNext')].forEach(function (e) {
      if (e) e.hidden = outro;
    });
    if (outro) {
      $('addTitle').textContent = 'Compra de brindes';
      $('nvSub').textContent = 'Entra como despesa · sem controle de estoque';
      brCompraForm($('nvBrinde'));
      return;
    }
    var known = !!S._known;
    $('nvComo').hidden = simple;
    nvChipPoe('fmt', S._fmtUsed || '');
    var mat = S.eMat || at.material || '';
    nvChipPoe('mat', mat);
    var pub = S.ePub || at.publico || '';
    nvChipPoe('pub', pub);
    // medidas (lente, ponte, haste) ficam em "Mais detalhes"
    $('nvMed').hidden = pre || simple;
    var mp = medParse($('eMed').value) || (S._known && medParse(S._known.med)) || null;
    [['nvL', 0], ['nvP', 1], ['nvH', 2]].forEach(function (x) {
      var e = $(x[0]);
      if (mp && document.activeElement !== e) e.value = mp[x[1]];
      e.classList.toggle('ok', !!e.value);
      e.readOnly = !!(S._known && S._known.med);
    });
    $('nvCod').querySelector('.lbl').textContent = simple ? 'Nome ou código do item' : 'Código da haste';
    $('nvLer').hidden = simple;
    var cod = $('eRef');
    cod.placeholder = simple ? 'Ex.: Estojo rígido' : 'Ex.: SL2250 (ou deixe vazio)';
    cod.classList.toggle('ok', !!S._ref);
    $('eGrauB').hidden = true;
    $('eVarB').hidden = true;
    var falta = nvPassos().filter(function (x) {
      return !x[2];
    });
    var nx = $('nvNext');
    nx.style.opacity = falta.length ? '.45' : '1';
    nx.textContent = simple ? 'Continuar' : 'Continuar · cores e fotos';
    if (known) nx.dataset.k = '1';
  }
  // ----- Cadastro B: trilho do Tipo e chips do "Como é"
  var NV_TIPOS = [
    ['pre', 'Pré-grad.'],
    ['sem', 'Armação'],
    ['solar', 'Solar'],
    ['outro', 'Outro']
  ];
  // Marca o trilho e esconde o indicador quando nada está escolhido.
  function trkPoe(trk, k) {
    if (!trk) return;
    var tem = !!trk.querySelector('.trkB[data-m="' + k + '"]');
    trk.classList.toggle('vazio', !tem);
    trkMarca(trk, tem ? k : '');
  }
  function nvTipoPor(id) {
    if (id === 'outro') {
      S.nOutro = true;
      S.nPop = '';
      render();
      return;
    }
    S.nOutro = false;
    var t = tipoOf(id),
      b =
        t &&
        [].slice.call($('mTipos').children).filter(function (x) {
          return x.textContent === t.label;
        })[0];
    if (b) b.click();
    else render();
  }
  function nvChip(key, rotulo) {
    var b = mk('button', 'nvChip');
    b.type = 'button';
    b.id = 'nv_' + key;
    b.dataset.rot = rotulo;
    b.onclick = function () {
      nvComoAbre(key);
    };
    return b;
  }
  function nvChipPoe(key, v) {
    var b = $('nv_' + key);
    if (!b) return;
    b.classList.toggle('ok', !!v);
    b.innerHTML = '<span>' + esc(v || b.dataset.rot) + '</span><i aria-hidden="true">▾</i>';
    b.setAttribute('aria-label', b.dataset.rot + (v ? ': ' + v : ''));
  }
  // Gaveta do "Como é": busca, lista e "Criar novo".
  var NV_COMO = { fmt: 'Formato', mat: 'Material', pub: 'Gênero' };
  function nvComoLista(key) {
    if (key === 'fmt') return S.formats.slice();
    if (key === 'mat') return NV_MAT.concat((S.matX || []).filter(function (x) { return NV_MAT.indexOf(x) < 0; }));
    return NV_PUB.slice();
  }
  function nvComoAtual(key) {
    var at = nvAtr(S._ref);
    return key === 'fmt' ? S._fmtUsed || '' : key === 'mat' ? S.eMat || at.material || '' : S.ePub || at.publico || '';
  }
  function nvComoSet(key, v) {
    if (key === 'fmt') {
      if (!S.formats.some(function (f) { return f.toLowerCase() === v.toLowerCase(); })) S.formats.push(v);
      S.eFmt = v;
    } else if (key === 'mat') S.eMat = v;
    else S.ePub = v;
  }
  function comoSheet(id, titulo, lista, atual, onPick) {
    var ov = lfaAbre(
      id,
      '<div class="cg-puxa" aria-hidden="true"></div><div class="cg-tt">' + esc(titulo) + '</div>' +
        '<div class="lsBox"><span class="lsIc">🔍</span><input class="lsIn" id="' + id + 'Q" placeholder="Buscar ' + esc(titulo.toLowerCase()) + '" autocomplete="off" aria-label="Buscar"></div>' +
        '<div class="lsList comoL"></div>'
    );
    ov.classList.add('lfa-camg');
    var q = ov.querySelector('.lsIn'),
      ul = ov.querySelector('.comoL'),
      fecha = function () {
        lfaFecha(id);
      };
    ov.addEventListener('click', function (e) {
      if (e.target === ov) fecha();
    });
    var pinta = function () {
      var t = q.value.trim(),
        tl = t.toLowerCase(),
        h = '';
      lista.forEach(function (v) {
        if (tl && String(v).toLowerCase().indexOf(tl) < 0) return;
        h += '<button type="button" class="lsOpt' + (atual === v ? ' on' : '') + '" data-v="' + esc(v) + '">' + esc(v) + '</button>';
      });
      var igual = lista.some(function (v) { return String(v).toLowerCase() === tl; });
      h += '<button type="button" class="lsOpt comoNovo" data-novo="1">+ Criar novo' + (t && !igual ? ': ' + esc(t) : '') + '</button>';
      ul.innerHTML = h;
    };
    ul.onclick = function (e) {
      var b = e.target.closest('.lsOpt');
      if (!b) return;
      var v = b.dataset.novo ? q.value.trim() : b.dataset.v;
      if (!v) {
        q.focus();
        return;
      }
      v = v[0].toUpperCase() + v.slice(1);
      fecha();
      onPick(v);
    };
    q.oninput = pinta;
    pinta();
    return ov;
  }
  function nvComoAbre(key) {
    comoSheet('lfa-como', NV_COMO[key], nvComoLista(key), nvComoAtual(key), function (v) {
      if (key === 'mat' && NV_MAT.indexOf(v) < 0) {
        S.matX = S.matX || [];
        if (S.matX.indexOf(v) < 0) S.matX.push(v);
      }
      nvComoSet(key, v);
      render();
    });
  }

  // ----- Cores e fotos em lista (v417): linhas das cores novas ainda não gravadas
  var NVR = [],
    NVR_SEQ = 0,
    NVR_ABRE = 0;
  function nvRow(id) {
    return NVR.filter(function (w) {
      return w.id === id;
    })[0];
  }
  // Próxima classe livre (C1, C2…) do modelo, contando as linhas novas.
  function nvProxClasse() {
    var m = 0;
    S.items.forEach(function (i) {
      if (i.ref !== S._ref) return;
      var n = parseInt(String(i.vr || '').replace(/\D/g, ''), 10);
      if (n > m) m = n;
    });
    NVR.forEach(function (w) {
      var n = parseInt(String(w.vr || '').replace(/\D/g, ''), 10);
      if (n > m) m = n;
    });
    return 'C' + (m + 1);
  }
  function nvTotal() {
    return NVR.reduce(function (a, w) {
      return a + w.q;
    }, 0);
  }
  // O total conta até o valor novo (como os preços).
  function nvTotalConta() {
    var el = $('nvTot');
    if (!el) return;
    var de = parseInt(el.textContent, 10) || 0,
      ate = nvTotal(),
      t0 = Date.now(),
      dur = REDUCED ? 0 : 300,
      passo = function () {
        var k = dur ? Math.min(1, (Date.now() - t0) / dur) : 1;
        el.textContent = Math.round(de + (ate - de) * k) + ' peças';
        if (k < 1) requestAnimationFrame(passo);
      };
    passo();
  }
  // Gaveta da cor: classe (C1, C2…) em cima e as cores numa lista com busca (nunca todas soltas na tela).
  function nvCorSheet(w) {
    var cores = Object.keys(S.palette).filter(function (k) {
        return k !== 'Sem detalhe' && k !== 'Sem cor';
      }),
      ov = comoSheet('lfa-cor', 'Cor', cores, w.cor, function (v) {
        if (!S.palette[v] && typeof ensureCor === 'function') ensureCor(v);
        w.cor = v;
        render();
      });
    var cl = mk('div', 'cfCls');
    cl.innerHTML =
      '<div class="lbl" style="margin:0">Classe</div><div class="nav">' +
      varChips(w.vr || 'C1')
        .map(function (v) {
          return '<button type="button" class="chip' + (w.vr === v ? ' on' : '') + '" data-v="' + v + '">' + v + '</button>';
        })
        .join('') +
      '</div>';
    cl.onclick = function (e) {
      var b = e.target.closest('[data-v]');
      if (!b) return;
      w.vr = b.dataset.v;
      [].forEach.call(cl.querySelectorAll('.chip'), function (c) {
        c.classList.toggle('on', c === b);
      });
      render();
    };
    var tt = ov.querySelector('.cg-tt');
    tt.insertAdjacentElement('afterend', cl);
  }
  // Grava uma linha nova com o mesmo motor de "Registrar entrada"; devolve as peças gravadas.
  function nvGravaLinha(w) {
    var ref = S._ref,
      pre = S.tipo === 'pre',
      custo = $('eCusto').value;
    $('eCor').value = w.cor;
    if (pre) {
      $('eGrau').value = w.grau;
      if (w.vr) S.eVarP = w.vr;
    } else if (w.vr) S.eVar = w.vr;
    S.qty = Math.max(1, w.q);
    render();
    var conta = function () {
        return S.items.reduce(function (n, i) {
          return n + (i.ref === ref ? i.qty : 0);
        }, 0);
      },
      antes = conta();
    S.msg = '';
    $('go').onclick();
    var depois = conta();
    $('eCusto').value = custo;
    if (depois <= antes) {
      popErr(S.msg || 'Não consegui registrar a cor ' + w.cor + '. Confira os dados.');
      render();
      return 0;
    }
    if (w.fotoT) setFoto(ref + '|' + w.cor, w.fotoT, w.fotoH);
    if (S.site && S.site[ref] && typeof vitFila === 'function') vitFila(ref, 'upd');
    return depois - antes;
  }
  function nvSalvaLinhas() {
    var pre = S.tipo === 'pre',
      sem = NVR.filter(function (w) {
        return !w.cor;
      })[0];
    if (sem) {
      popErr('Escolha a cor da linha ' + (sem.vr || '') + '.');
      nvCorSheet(sem);
      return;
    }
    var semG = pre && NVR.filter(function (w) {
      return !normGrau(w.grau || '');
    })[0];
    if (semG) {
      popErr('Informe o grau da peça (ex.: +1.75 ou 175).');
      var gi = document.querySelector('.cfRow[data-id="' + semG.id + '"] .cfGrau');
      if (gi) guiaMarca2(gi);
      return;
    }
    var ref = S._ref,
      tot = 0;
    while (NVR.length) {
      var w = NVR[0],
        n = nvGravaLinha(w);
      if (!n) return;
      tot += n;
      NVR.shift();
    }
    saveSoon();
    lfEntrada(tot, pubNome(ref));
    nvConcluir(ref);
  }
  function guiaMarca2(e) {
    e.classList.add('nvbad');
    try {
      e.scrollIntoView({ block: 'center' });
    } catch (x) {}
    setTimeout(function () {
      e.classList.remove('nvbad');
    }, 2600);
  }
