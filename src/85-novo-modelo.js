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
    // as opções de cada campo abrem numa linha inteira, logo abaixo da linha de campos
    var fTipo = nvFld('tipo', 'Tipo'),
      fFmt = nvFld('fmt', 'Formato'),
      fMat = nvFld('mat', 'Material'),
      fPub = nvFld('pub', 'Gênero'),
      opLinha = function (w) {
        var o = w.querySelector('.nav');
        o.style.marginTop = '0';
        return o;
      };
    var r1 = mk('div', 'nvg2');
    r1.appendChild(fTipo);
    var cw = mk('div', '');
    cw.id = 'nvCod';
    cw.appendChild($('eRef').parentNode);
    r1.appendChild(cw);
    ess.appendChild(r1);
    ess.appendChild(opLinha(fTipo));
    var r2 = mk('div', 'nvg2');
    r2.id = 'nvR2';
    r2.appendChild(fFmt);
    r2.appendChild(fMat);
    ess.appendChild(r2);
    ess.appendChild(opLinha(fFmt));
    ess.appendChild(opLinha(fMat));
    var nf = mk('div', 'col');
    nf.id = 'nvNovoFmt';
    nf.hidden = true;
    nf.style.gap = '8px';
    var nfi = mk('input', 'in');
    nfi.id = 'nvNF';
    nfi.placeholder = 'Nome do formato (ex.: Oval)';
    nfi.autocomplete = 'off';
    nf.appendChild(nfi);
    var nfb = btn('mini', 'Criar formato', function () {
      var raw = nfi.value.trim();
      if (!raw) return;
      var n = raw[0].toUpperCase() + raw.slice(1);
      if (
        !S.formats.some(function (f) {
          return f.toLowerCase() === n.toLowerCase();
        })
      )
        S.formats.push(n);
      S.eFmt = n;
      nfi.value = '';
      S.nNovoFmt = false;
      S.nPop = '';
      render();
    });
    nf.appendChild(nfb);
    ess.appendChild(nf);
    var r3 = mk('div', 'nvg3');
    r3.id = 'nvMed';
    r3.appendChild(nvNum('nvL', 'Lente (mm)'));
    r3.appendChild(nvNum('nvP', 'Ponte (mm)'));
    r3.appendChild(nvNum('nvH', 'Haste (mm)'));
    ess.appendChild(r3);
    var r4 = mk('div', 'nvg2');
    r4.id = 'nvR4';
    r4.appendChild(fPub);
    var cu = mk('div', '');
    cu.id = 'nvCusto';
    cu.appendChild($('eCustoB'));
    r4.appendChild(cu);
    ess.appendChild(r4);
    ess.appendChild(opLinha(fPub));
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
    mb.appendChild($('eNomeB'));
    mb.appendChild($('eBox').querySelector('.descp'));
    mb.appendChild($('eFaixaB'));
    mb.appendChild(lt);
    var nx = btn('go', 'Continuar para cores e fotos', function () {
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
  function nvFoto(f) {
    if (!f || !S._ref || !NVC.fotoCor) return;
    var ref = S._ref,
      cor = NVC.fotoCor,
      url = URL.createObjectURL(f),
      img = new Image();
    img.onload = function () {
      try {
        var cv = fitCanvas(img, 1800);
        if (cor === '__nova__') {
          NVC.fotoT = thumbOf(cv);
          NVC.fotoH = cv.toDataURL('image/jpeg', 0.92);
        } else {
          setFoto(ref + '|' + cor, thumbOf(cv), cv.toDataURL('image/jpeg', 0.92));
          if (S.site && S.site[ref] && typeof vitFila === 'function') vitFila(ref, 'upd');
          saveSoon();
        }
      } catch (e) {
        S.msg = 'Não consegui processar essa foto. Tente outra.';
      }
      URL.revokeObjectURL(url);
      NVC.fotoCor = '';
      render();
    };
    img.onerror = function () {
      S.msg = 'Não consegui abrir essa imagem. Tente outra foto.';
      NVC.fotoCor = '';
      render();
    };
    img.src = url;
  }
  // Adiciona uma cor: usa o mesmo motor de "Registrar entrada".
  function nvAddCor() {
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
    // cores do modelo
    var c1 = mk('div', 'card col');
    c1.style.gap = '8px';
    c1.appendChild(mk('div', 'lbl', 'Cores do modelo'));
    if (!cs.length) {
      var vz = mk('div', 'hint', 'Nenhuma cor ainda. Adicione a primeira para registrar a entrada.');
      vz.style.margin = '0';
      c1.appendChild(vz);
    }
    cs.forEach(function (c) {
      var ft = S.fotos[ref + '|' + c.cor],
        r = btn('nvcor', '', function () {
          NVC.fotoCor = c.cor;
          $('nvFile').click();
        });
      r.setAttribute('aria-label', 'Foto da cor ' + c.cor);
      var th = mk('div', 'nvthm');
      if (ft) {
        var im = document.createElement('img');
        im.src = ft;
        im.alt = '';
        th.appendChild(im);
      } else th.textContent = '📷';
      r.appendChild(th);
      var tx = mk('div', '');
      tx.style.cssText = 'flex:1;min-width:0';
      tx.appendChild(mk('b', '', c.cor));
      tx.appendChild(mk('small', '', c.qty + (c.qty === 1 ? ' peça · ' : ' peças · ') + (ft ? 'foto ok' : 'sem foto')));
      r.appendChild(tx);
      r.appendChild(mk('span', 'nvpl' + (ft ? '' : ' w'), ft ? 'pronta' : 'falta foto'));
      c1.appendChild(r);
    });
    if (S.nCorOpen) {
      var nc = mk('div', 'card col');
      nc.style.cssText = 'gap:10px;background:var(--panel2);margin:0';
      nc.appendChild(mk('div', 'lbl', 'Nova cor'));
      var ch = mk('div', 'nav');
      Object.keys(S.palette).forEach(function (k) {
        if (k === 'Sem detalhe' || k === 'Sem cor') return;
        ch.appendChild(
          btn(
            'chip' + (NVC.cor === k ? ' on' : ''),
            k,
            function () {
              NVC.cor = k;
              render();
            },
            NVC.cor === k
          )
        );
      });
      nc.appendChild(ch);
      var oi = mk('input', 'in');
      oi.id = 'nvCorIn';
      oi.placeholder = 'Ou digite outra cor (ex.: Bege translúcido)';
      oi.autocomplete = 'off';
      oi.value = Object.keys(S.palette).indexOf(NVC.cor) >= 0 ? '' : NVC.cor;
      oi.oninput = function () {
        NVC.cor = oi.value.trim();
        var bk = $('nvCorOk');
        if (bk) bk.disabled = !(NVC.cor && NVC.fotoT);
      };
      nc.appendChild(oi);
      if (pre) {
        nc.appendChild(mk('div', 'lbl', 'Grau (como está na peça)'));
        var gi = mk('input', 'in');
        gi.id = 'nvGrau';
        gi.placeholder = 'Ex.: +175';
        gi.autocomplete = 'off';
        gi.value = NVC.grau;
        gi.oninput = function () {
          NVC.grau = gi.value;
        };
        nc.appendChild(gi);
      }
      if (!t.simple) {
        nc.appendChild(mk('div', 'lbl', 'Classe de cor' + (pre ? ' (opcional)' : '')));
        var cl = mk('div', 'nav');
        for (var k = 1; k <= 6; k++)
          (function (v) {
            var on = (NVC.vr || (pre ? S.eVarP : S.eVar)) === v;
            cl.appendChild(
              btn(
                'chip' + (on ? ' on' : ''),
                v,
                function () {
                  NVC.vr = v;
                  render();
                },
                on
              )
            );
          })('C' + k);
        nc.appendChild(cl);
      }
      nc.appendChild(mk('div', 'lbl', 'Quantas peças?'));
      var sp = mk('div', 'nvstp');
      var mn = btn('step', '−', function () {
          NVC.q = Math.max(1, NVC.q - 1);
          render();
        }),
        pl = btn('step', '+', function () {
          NVC.q = Math.min(999, NVC.q + 1);
          render();
        });
      mn.setAttribute('aria-label', 'Diminuir quantidade');
      pl.setAttribute('aria-label', 'Aumentar quantidade');
      sp.appendChild(mn);
      sp.appendChild(mk('b', '', String(NVC.q)));
      sp.appendChild(pl);
      nc.appendChild(sp);
      nc.appendChild(mk('div', 'lbl', 'Foto da cor'));
      var fb = btn('go', NVC.fotoT ? '✓ Foto tirada · trocar' : '📷 Tirar a foto', function () {
        NVC.fotoCor = '__nova__';
        $('nvFile').click();
      });
      fb.id = 'nvFotoCor';
      fb.style.cssText = 'min-height:46px;font-size:15px' + (NVC.fotoT ? ';background:var(--panel);border:1px solid var(--ok);color:var(--ok)' : '');
      nc.appendChild(fb);
      if (NVC.fotoT) {
        var pv = document.createElement('img');
        pv.src = NVC.fotoT;
        pv.alt = 'Foto da cor';
        pv.style.cssText = 'width:100%;max-height:150px;object-fit:contain;background:#fff;border-radius:12px';
        nc.appendChild(pv);
      } else nc.appendChild(mk('div', 'nvwarn', 'A cor só entra na lista com a foto.'));
      var ok = btn('go', 'Adicionar cor', nvAddCor);
      ok.id = 'nvCorOk';
      ok.disabled = !NVC.fotoT || !NVC.cor;
      nc.appendChild(ok);
      c1.appendChild(nc);
    } else {
      var ad = btn('tab', '+ Adicionar cor', function () {
        S.nCorOpen = true;
        var uc = cs.length ? '' : ($('eCor').value || '').trim();
        NVC.cor = uc;
        NVC.q = 1;
        NVC.vr = '';
        NVC.fotoT = '';
        NVC.fotoH = '';
        render();
      });
      ad.style.cssText = 'width:100%;border-style:dashed';
      ad.id = 'nvAddCor';
      c1.appendChild(ad);
    }
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
    var fim = btn('go', cs.length ? 'Concluir' : 'Adicione uma cor para concluir', function () {
      if (!cs.length) return;
      S.nStep = 1;
      S.nPop = '';
      S.nCorOpen = false;
      closeAdd();
      lfToast('✓ ' + pubNome(ref) + ' cadastrado.');
    });
    fim.id = 'nvFim';
    fim.disabled = !cs.length;
    s2.appendChild(fim);
  }
  function renderGuia() {
    var rest = $('addProdRest'),
      box = $('eBox');
    if (!box || S.addMode !== 'prod') {
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
    // ---- tela 1
    // tipo
    nvCampo('tipo', (tipoOf(S.tipo) || {}).label || '');
    nvOpcoes(
      'tipo',
      TIPOS.map(function (x) {
        return x.label;
      }),
      (tipoOf(S.tipo) || {}).label,
      function (v) {
        var b = [].slice.call($('mTipos').children).filter(function (x) {
          return x.textContent === v;
        })[0];
        if (b) b.click();
      }
    );
    // formato
    $('nvR2').hidden = simple;
    var fmtUsed = S._fmtUsed || '',
      known = !!S._known;
    nvCampo('fmt', fmtUsed);
    var fl = S.formats.slice();
    var novo = btn('chip add', '+ Novo formato', function () {
      S.nNovoFmt = !S.nNovoFmt;
      render();
    });
    nvOpcoes('fmt', fl, fmtUsed, function (v) {
      if (!known) S.eFmt = v;
      else S.eFmt = v;
    }, novo);
    $('nvNovoFmt').hidden = !(S.nNovoFmt && S.nPop === 'fmt');
    // material
    var mat = S.eMat || at.material || '';
    nvCampo('mat', mat);
    nvOpcoes('mat', NV_MAT, mat, function (v) {
      S.eMat = v;
    });
    // medidas (lente, ponte, haste)
    $('nvMed').hidden = pre || simple;
    var mp = medParse($('eMed').value) || (S._known && medParse(S._known.med)) || null;
    [['nvL', 0], ['nvP', 1], ['nvH', 2]].forEach(function (x) {
      var e = $(x[0]);
      if (mp && document.activeElement !== e) e.value = mp[x[1]];
      e.classList.toggle('ok', !!e.value);
      e.readOnly = !!(S._known && S._known.med);
    });
    // gênero
    $('nvR4').firstChild.hidden = simple;
    var pub = S.ePub || at.publico || '';
    nvCampo('pub', pub);
    nvOpcoes('pub', NV_PUB, pub, function (v) {
      S.ePub = v;
    });
    $('nvR4').style.gridTemplateColumns = simple ? '1fr' : '1fr 1fr';
    $('nvCod').querySelector('.lbl').textContent = simple ? 'Nome ou código do item' : 'Código da haste';
    var cod = $('eRef');
    cod.placeholder = simple ? 'Ex.: Estojo rígido' : 'Ex.: SL2250 (ou deixe vazio)';
    cod.classList.toggle('ok', !!S._ref);
    $('eGrauB').hidden = true;
    $('eVarB').hidden = true;
    nvAutoCard();
    var falta = nvPassos().filter(function (x) {
      return !x[2];
    });
    var nx = $('nvNext');
    nx.style.opacity = falta.length ? '.45' : '1';
    nx.textContent = simple ? 'Continuar' : 'Continuar para cores e fotos';
  }
