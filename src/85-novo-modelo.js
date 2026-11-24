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
    var ess = mk('div', 'col');
    ess.style.gap = '16px';
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
    var r2 = mk('div', 'escLs');
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
    // 44: "Mais detalhes" é a linha de dobra do app (⌄, abre no lugar), não o <details> do navegador
    var mais = mk('section', 'fxF');
    mais.id = 'nvMais';
    mais.innerHTML = '<button type="button" class="fxH" aria-expanded="false"><span><b>Mais detalhes (opcional)</b></span><i class="fxC" aria-hidden="true">⌄</i></button><div class="col fxB" id="nvMaisBox" style="gap:16px" hidden></div>';
    mais.firstChild.onclick = function () {
      var ab = !mais.classList.contains('on');
      mais.classList.toggle('on', ab);
      mais.firstChild.setAttribute('aria-expanded', String(ab));
      $('nvMaisBox').hidden = !ab;
    };
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
    var nx = btn('go', 'Continuar · cores', function () {
      nvContinuar();
    });
    nx.id = 'nvNext';
    var fx1 = mk('div', 'nvFixo'); // 44: o botão de seguir fica fixo embaixo da janela
    fx1.appendChild(nx);
    s1.appendChild(fx1);
    // ---- tela 2
    var s2 = mk('div', 'col');
    s2.id = 'nvS2';
    s2.style.gap = '14px';
    box.appendChild(s2);
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
  // ícone de câmera (outras telas usam)
  var NV_ICAM =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.6"/></svg>';
  // Adiciona uma cor: usa o mesmo motor de "Registrar entrada".
  function nvConcluir(ref) {
    NVR = [];
    NVR_ABRE = 0;
    S.nStep = 1;
    S.nPop = '';
    S.nCorOpen = false;
    closeAdd();
    lfToast('' + pubNome(ref) + ' cadastrado.', 'ok');
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
    var cs = nvCores(ref);
    // 88 (aprovado 23/11): passo 2 "Cores" — cada cor entra SEM foto (a foto vem pelo Estúdio); linha por cor com a classe · cor,
    // "fotografar no Estúdio" e −/+; "+ Nova cor ›" abre a janela de escolher a cor; "No site" em linha; "Concluir" fixo embaixo.
    s2.appendChild(mk('div', 'lbl', 'Cores desta peça · ' + (cs.length + NVR.length)));
    var c1 = mk('div', 'col cfList');
    c1.id = 'nvCoresL';
    var foto = function (src) { return '<span class="cfFt">' + (src ? '<img alt="" src="' + src + '">' : '<small>sem foto</small>') + '</span>'; };
    cs.forEach(function (c) {
      var ft = S.fotos[ref + '|' + c.cor],
        it0 = S.items.filter(function (i) { return i.ref === ref && i.cor === c.cor && !i.bulk; })[0] || {},
        r = mk('div', 'cfRow');
      r.innerHTML = foto(ft) + '<span class="cfTx"><b>' + esc((it0.vr ? it0.vr + ' · ' : '') + c.cor) + '</b><small>' + (ft ? 'com foto' : 'fotografar no Estúdio') + '</small></span><span class="cfQ">' + c.qty + ' un.</span>';
      c1.appendChild(r);
    });
    NVR.forEach(function (w) {
      var ab = NVR_ABRE === w.id,
        r = mk('div', 'cfRow nova' + (ab ? ' ab' : '') + (w.id === NVR_SEQ && w.nova ? ' entra' : ''));
      w.nova = 0;
      r.dataset.id = w.id;
      r.innerHTML = foto(w.fotoT) +
        '<span class="cfTx"><button type="button" class="cfCor" aria-label="Escolher a cor"><b>' + esc((w.vr ? w.vr + ' · ' : '') + (w.cor || 'escolher a cor')) + '</b></button>' +
        (pre ? '<input class="in cfGrau" inputmode="decimal" placeholder="Grau (ex.: +1,75)" value="' + esc(w.grau || '') + '" aria-label="Grau da peça">' : '') +
        '<button type="button" class="cfMaisB"><small>fotografar no Estúdio · mais opções</small></button></span>' +
        '<span class="vstep cfStep"><span class="vs-b" role="button" tabindex="0" data-d="-1" aria-label="Menos">−</span><span class="vs-n">' + w.q + '</span><span class="vs-b" role="button" tabindex="0" data-d="1" aria-label="Mais">+</span></span>' +
        (ab ? '<div class="cfMais"><button type="button" class="mini cfDel" data-x="1">Excluir cor</button></div>' : '');
      r.querySelector('.cfCor').onclick = function () { nvCorSheet(w); };
      r.querySelector('.cfMaisB').onclick = function () { NVR_ABRE = ab ? 0 : w.id; render(); };
      var gi = r.querySelector('.cfGrau');
      if (gi) gi.oninput = function () { w.grau = gi.value; };
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
      if (ab)
        r.querySelector('[data-x]').onclick = function () {
          NVR = NVR.filter(function (x) { return x !== w; });
          NVR_ABRE = 0;
          render();
        };
      c1.appendChild(r);
    });
    var cn = mk('button', 'cfNova');
    cn.type = 'button';
    cn.id = 'nvAddCor';
    cn.innerHTML = '<span class="pl78" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span><span>Nova cor ›</span>';
    cn.onclick = function () {
      var w = { id: ++NVR_SEQ, vr: nvProxClasse(), cor: '', q: 1, grau: '', nova: 1 };
      NVR.push(w);
      NVR_ABRE = 0;
      render();
      nvCorSheet(w);
    };
    c1.appendChild(cn);
    var tot = mk('div', 'cfTot');
    tot.innerHTML = '<span>Total chegando</span><b id="nvTot">' + nvTotal() + ' peças</b>';
    tot.hidden = !NVR.length;
    c1.appendChild(tot);
    s2.appendChild(c1);
    // "No site": ligado = a peça vai para o site e cada cor entra quando tiver foto (a entrada automática de sempre, 97-site-auto);
    // desligado = fora do site e o app não recoloca (siteFora)
    var on = siteOn(ref) || !(S.siteFora && S.siteFora[ref]),
      ns = mk('button', 'paSw nvSite');
    ns.type = 'button';
    ns.id = 'nvTg';
    ns.setAttribute('role', 'switch');
    ns.setAttribute('aria-checked', on ? 'true' : 'false');
    ns.innerHTML = '<span><b>No site</b><small>só as cores com foto</small></span><span class="sw"><input type="checkbox" tabindex="-1" aria-hidden="true"' + (on ? ' checked' : '') + '><i></i></span>';
    ns.onclick = function () {
      S.siteFora = S.siteFora || {};
      if (on) {
        if (siteOn(ref)) siteSet(ref, false);
        S.siteFora[ref] = Date.now();
      } else {
        delete S.siteFora[ref];
        if (siteCheck(ref).ok) siteSet(ref, true);
      }
      saveSoon();
      render();
    };
    s2.appendChild(ns);
    var fim = btn('go', 'Concluir', function () {
      if (NVR.length) return nvSalvaLinhas();
      if (!cs.length) return nvCorSheetNova();
      nvConcluir(ref);
    });
    fim.id = 'nvFim';
    var fx2 = mk('div', 'nvFixo');
    fx2.appendChild(fim);
    s2.appendChild(fx2);
  }
  // Concluir sem nenhuma cor: abre a primeira cor (a peça precisa de ao menos uma)
  function nvCorSheetNova() {
    $('nvAddCor').click();
  }
  function renderGuia() {
    var rest = $('addProdRest'),
      box = $('eBox');
    if (!box || S.addMode !== 'prod') {
      NVR = [];
      NVR_ABRE = 0;
      if (rest) rest.removeAttribute('data-nv');
      if (/^(Nova peça|Cores)$/.test($('addTitle').textContent)) $('addTitle').textContent = 'Adicionar';
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
    $('addTitle').textContent = st === 2 ? 'Cores' : 'Nova peça';
    $('nvSub').textContent =
      st === 2
        ? 'Passo 2 de 2 · ' + (S._ref || '') + ' · ' + ((tipoOf(S.tipo) || {}).label || '')
        : S.nDeRef
          ? 'Copiado de ' + S.nDeRef + ' · confira'
          : S.nLido
          ? 'Lido da haste · confira e complete'
          : 'Passo 1 de 2 · o modelo';
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
    nx.textContent = simple ? 'Continuar' : 'Continuar · cores';
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
  // 44: a linha de escolher — "Formato · escolher ›" (o valor escolhido aparece à direita, em cinza). A mesma no cadastro e no Editar produto.
  function escLinha(id, rotulo, v, onTap) {
    var b = mk('button', 'escL');
    b.type = 'button';
    b.id = id;
    b.dataset.rot = rotulo;
    b.onclick = onTap;
    escLinhaPoe(b, v);
    return b;
  }
  function escLinhaPoe(b, v) {
    if (!b) return;
    b.classList.toggle('ok', !!v);
    b.innerHTML = '<span>' + esc(b.dataset.rot) + '</span><em>' + esc(v || 'escolher') + '</em><i aria-hidden="true">›</i>';
    b.setAttribute('aria-label', b.dataset.rot + (v ? ': ' + v : ': escolher'));
  }
  function nvChip(key, rotulo) {
    return escLinha('nv_' + key, rotulo, '', function () { nvComoAbre(key); });
  }
  function nvChipPoe(key, v) {
    escLinhaPoe($('nv_' + key), v);
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
  // 44 (aprovado 21/11): ESCOLHER é uma tarefa — a janela de baixo com a lista em linhas de bolinha (a primeira marcada quando
  // ainda não há escolha), "+ Outro…" para escrever um valor novo e um "Salvar". Uma função para Formato, Material, Gênero e Cor
  // (cadastro e Editar produto). topo = nó opcional que entra acima da lista (ex.: a Classe da cor).
  function escolhaJanela(titulo, lista, atual, onPick, topo, semOutro) { // semOutro: só as opções da lista (ex.: a tabela do lojista)
    var sel = atual || lista[0] || '', outra = false, txt = '';
    return lfJanela({
      titulo: titulo,
      cls: 'escJn',
      mudou: function () { return outra ? !!txt.trim() : sel !== (atual || lista[0] || ''); },
      monta: function (c, api) {
        var pinta = function () {
          c.innerHTML = '<div class="escTopo"></div>' + lista.map(function (v) {
            return '<button type="button" class="pxL" role="radio" aria-checked="' + (!outra && sel === v) + '" data-v="' + esc(v) + '"><i class="pxR" aria-hidden="true"></i><span class="pxT"><b>' + esc(v) + '</b></span></button>';
          }).join('') +
            (semOutro ? '' : '<button type="button" class="pxL" role="radio" aria-checked="' + outra + '" data-outra="1"><i class="pxR" aria-hidden="true"></i><span class="pxT"><b>Outro…</b></span></button>') +
            (outra ? '<input class="in escOutra" maxlength="30" placeholder="Escreva" aria-label="' + esc(titulo) + '" value="' + esc(txt) + '">' : '') +
            '<button type="button" class="go escSalva">Salvar</button>';
          if (topo) c.querySelector('.escTopo').appendChild(topo);
          c.querySelectorAll('.pxL').forEach(function (b) {
            b.onclick = function () {
              outra = !!b.dataset.outra;
              if (!outra) sel = b.dataset.v;
              pinta();
              var oi = c.querySelector('.escOutra');
              if (oi) oi.focus();
            };
          });
          var oi = c.querySelector('.escOutra');
          if (oi) oi.oninput = function () { txt = oi.value; };
          c.querySelector('.escSalva').onclick = function () {
            var v = outra ? txt.trim() : sel;
            if (!v) { var o2 = c.querySelector('.escOutra'); if (o2) o2.focus(); return; }
            v = v[0].toUpperCase() + v.slice(1);
            api.fecha(true);
            onPick(v);
          };
        };
        pinta();
      }
    });
  }
  function nvComoAbre(key) {
    escolhaJanela(NV_COMO[key], nvComoLista(key), nvComoAtual(key), function (v) {
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
      cl = mk('div', 'cfCls');
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
    };
    escolhaJanela('Cor', cores, w.cor, function (v) {
      if (!S.palette[v] && typeof ensureCor === 'function') ensureCor(v);
      w.cor = v;
      render();
    }, cl);
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
