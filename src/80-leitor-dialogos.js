  // ===== Leitor de código: diálogos e fluxo de cadastro por foto. =====
  var HADD = false,
    HMED = '',
    HVR = '',
    HERR = '';
  // Dica para abrir por https e liberar a câmera.
  function httpsHint() {
    return /^https?:$/.test(location.protocol)
      ? ''
      : ' Dica: você abriu o app pelo gerenciador de arquivos. Abra por um endereço https (ou instale o app), senão a câmera própria e o leitor de texto não funcionam.';
  }
  /* ===== Câmera em 2 passos: 1) lê o código da haste  2) foto da armação inteira ===== */
  var PRESET = null;

  /* ===== Leitor: aponta para o código da haste e mostra o produto ou sugere cadastrar ===== */
  function leitorDlg(build) {
    loadMsg(false);
    var o = $('leitorDlg');
    if (o) o.remove();
    var ov = document.createElement('div');
    ov.id = 'leitorDlg';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.style.cssText =
      'position:fixed;inset:0;z-index:320;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:16px';
    var bx = document.createElement('div');
    bx.style.cssText =
      'background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px;width:min(94vw,440px);max-height:92vh;overflow:auto;display:flex;flex-direction:column;gap:10px';
    build(bx, function () {
      ov.remove();
    });
    ov.appendChild(bx);
    document.body.appendChild(ov);
  }
  var LM = null;
  // Aviso animado de carregamento.
  function loadMsg(on, txt, cap) {
    /* aviso animado padrão (mesmo do leitor) */
    try {
      if (LM && LM.parentNode) LM.parentNode.removeChild(LM);
      LM = null;
      clearTimeout(loadMsg._t);
      clearTimeout(armReturn._t);
      if (!on) return;
      var d = document.createElement('div');
      d.id = 'loadFoto';
      d.style.cssText =
        'position:fixed;inset:0;z-index:99999;display:flex;justify-content:center;align-items:flex-start;padding-top:calc(env(safe-area-inset-top,0px) + 70px);background:rgba(0,0,0,.38);pointer-events:auto;touch-action:none';
      d.setAttribute('aria-busy', 'true');
      var pl = document.createElement('div');
      pl.className = 'busyPill';
      pl.appendChild(busyEl(txt || 'Carregando foto'));
      d.appendChild(pl);
      document.body.appendChild(d);
      LM = d;
      loadMsg._t = setTimeout(function () {
        if (LM === d) loadMsg(false);
      }, cap || 20000);
    } catch (e) {}
  }
  // Nome e custo já conhecidos de um código.
  function refInfo(ref) {
    /* nome e custo já conhecidos de um código do estoque */
    var k = hKey(ref),
      its = S.items.filter(function (i) {
        return i.ref && hKey(i.ref) === k;
      }),
      r = {},
      i,
      c;
    if (S.pnome && S.pnome[its.length ? its[0].ref : ref])
      r.nome = S.pnome[its.length ? its[0].ref : ref];
    for (i = 0; i < its.length; i++) {
      c = Number(effCusto(its[i]));
      if (c > 0) {
        r.custo = String(Math.round(c * 10000) / 10000);
        break;
      }
    }
    return r;
  }
  // Leva os dados lidos para o cadastro.
  function fillAdd(o) {
    /* leva os dados lidos/conhecidos para o formulário de cadastro */
    if (o.tipo && o.tipo !== S.tipo) {
      S.tipo = o.tipo;
      S.fmtF = 'all';
      S.corF = 'all';
      S.q = '';
      S.open = '';
      S.det = false;
      S.selItem = null;
      S.qty = 1;
      S.eRefV = '';
    }
    /* o formulário de cadastro precisa estar à vista (a leitura pode vir do menu Adicionar ou da Entrada da compra) */
    S.addOpen = true;
    S.addMode = 'prod';
    if (typeof nvLimpaMed === 'function') nvLimpaMed();
    S.nStep = 1;
    S.nPop = '';
    S.nCorOpen = false;
    /* cor/classe/foto de um cadastro anterior não podem sobrar no novo (a classe lida da haste manda) */
    if (typeof NVC === 'object') {
      NVC.vr = '';
      NVC.cor = '';
      NVC.q = 1;
      NVC.grau = '';
      NVC.fotoT = '';
      NVC.fotoH = '';
      NVC.fotoCor = '';
    }
    S.nLido = !!o.lido;
    S.nDeRef = '';
    S.eMat = '';
    S.ePub = '';
    $('eRef').value = o.ref || '';
    if (o.med) $('eMed').value = o.med;
    if (o.fmt) S.eFmt = o.fmt;
    if (o.cor) $('eCor').value = o.cor;
    if (o.vr && /^C(?:1[0-2]|[1-9])$/.test(o.vr)) {
      ensureVar(o.vr);
      if (S.tipo === 'pre') S.eVarP = o.vr;
      else S.eVar = o.vr;
    }
    S.msg = o.msg || '';
    render();
    try {
      if (o.nome && $('eNome')) $('eNome').value = o.nome;
      if (o.custo && $('eCusto')) $('eCusto').value = o.custo;
      if (!REDUCED && !o.noscroll)
        ['eRef', 'eMed', 'eCor', 'eNome', 'eCusto'].forEach(function (id, ix) {
          var e = $(id);
          if (e && e.value)
            setTimeout(function () {
              e.classList.remove('lfglow');
              void e.offsetWidth;
              e.classList.add('lfglow');
            }, 140 * ix);
        });
    } catch (e) {}
    if (!o.noscroll)
      try {
        $('eRef').scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (e) {}
  }
  // Mostra o resultado da leitura.
  function leitorResult(x) {
    loadMsg(false);
    if (!x || !x.ref) {
      leitorDlg(function (bx, close) {
        bx.appendChild(mk('b', '', 'Código não detectado'));
        var dbg = (window.__lastTexts || [])
          .join(' ')
          .replace(/[^A-Za-z0-9□\-\. ]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 110);
        bx.appendChild(
          mk(
            'div',
            'hint',
            'Não consegui ler o código' +
              (x && (x.med || x.vr)
                ? ' (só vi ' + [x.med, x.vr].filter(Boolean).join(' · ') + ')'
                : '') +
              '. Aproxime a haste, deixe o texto na faixa, com boa luz e sem reflexo, e toque na tela para focar.' +
              (HERR ? ' (leitor: ' + HERR + ')' : '') +
              httpsHint()
          )
        );
        if (dbg) {
          var dd = mk('div', 'hint', 'O leitor viu: ' + dbg);
          dd.style.opacity = '.7';
          bx.appendChild(dd);
          if (window.__lastPrep && window.__lastPrep.length) {
            var vb = btn('chip', 'Ver a imagem que o leitor analisou', function () {
              vb.remove();
              window.__lastPrep.slice(0, 3).forEach(function (cv) {
                try {
                  var im = document.createElement('img');
                  im.src = cv.toDataURL('image/jpeg', 0.6);
                  im.style.cssText =
                    'width:100%;border:1px solid var(--line);border-radius:8px;margin-top:6px';
                  bx.insertBefore(im, bx.children[bx.children.length - 2]);
                } catch (e) {}
              });
            });
            vb.style.cssText += ';width:100%;justify-content:center';
            bx.appendChild(vb);
          }
        }
        var a = btn('mini', 'Tentar de novo', function () {
          close();
          var wi =
            NATIVE &&
            $('btnLeitor') &&
            $('btnLeitor').parentNode &&
            $('btnLeitor').parentNode.querySelector('input[type=file]');
          if (wi) {
            wi.click();
            return;
          }
          leitorOpen();
        });
        a.style.width = '100%';
        var c2 = btn('chip', 'Cancelar', close);
        c2.style.cssText += ';width:100%;justify-content:center';
        bx.appendChild(a);
        bx.appendChild(c2);
      });
      return;
    }
    var key = hKey(x.ref),
      its = S.items.filter(function (i) {
        return i.ref && hKey(i.ref) === key;
      }),
      near = false;
    if (!its.length && key.length >= 5) {
      var cand = {};
      S.items.forEach(function (i) {
        if (i.ref) {
          var k2 = hKey(i.ref);
          if (
            k2.length !== key.length &&
            Math.abs(k2.length - key.length) <= 1 &&
            lev(k2, key) <= 1
          )
            cand[i.ref] = 1;
        }
      });
      var cs = Object.keys(cand);
      if (cs.length === 1) {
        its = S.items.filter(function (i) {
          return i.ref === cs[0];
        });
        near = true;
      }
    }
    if (its.length) {
      var f0 = its[0],
        tot = its.reduce(function (a, i) {
          return a + i.qty;
        }, 0),
        tp = tipoOf(f0.tipo);
      leitorDlg(function (bx, close) {
        bx.appendChild(mk('b', '', near ? 'Parece este produto' : 'Produto já cadastrado'));
        if (near) {
          var nt = mk(
            'div',
            'hint',
            'Li “' + x.ref + '”, mas o mais parecido do estoque é este. Confirme olhando a peça.'
          );
          nt.style.color = 'var(--warn)';
          bx.appendChild(nt);
        }
        var cd = document.createElement('div');
        cd.style.cssText = 'display:flex;gap:12px;align-items:flex-start';
        var pb = photoBox(photoOf(f0.ref), 'pbox');
        pb.style.cssText += ';width:110px;flex:0 0 110px';
        cd.appendChild(pb);
        var tx = document.createElement('div');
        tx.style.cssText = 'display:flex;flex-direction:column;gap:4px;min-width:0';
        tx.appendChild(mk('b', '', pn(f0.ref)));
        if (S.pnome && S.pnome[f0.ref]) tx.appendChild(mk('span', 's', 'Código ' + f0.ref));
        tx.appendChild(
          mk(
            'span',
            's',
            (tp ? tp.label : '') +
              (f0.fmt && !f0.bulk ? ' · ' + f0.fmt : '') +
              (f0.med ? ' · ' + f0.med : '')
          )
        );
        tx.appendChild(mk('span', 'cell', tot + ' em estoque'));
        cd.appendChild(tx);
        bx.appendChild(cd);
        var vs = document.createElement('div');
        vs.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap';
        its.forEach(function (i) {
          vs.appendChild(
            mk(
              'span',
              'chip',
              (i.cor || 'Sem cor') + (i.vr ? ' · ' + i.vr : '') + ' · ' + i.qty + ' un.'
            )
          );
        });
        bx.appendChild(vs);
        var ad = btn('mini', 'Adicionar', function () {
          close();
          if (!isSimple(f0.tipo) && quickOpen(f0.ref)) return;
          fillAdd(
            Object.assign(refInfo(f0.ref), {
              tipo: f0.tipo,
              ref: f0.ref,
              med: f0.med,
              fmt: f0.fmt,
              cor: f0.cor,
              vr: f0.vr,
              msg: 'Produto já cadastrado: escolha a cor e a quantidade e toque em Adicionar.'
            })
          );
        });
        ad.style.width = '100%';
        var ca = btn('chip', 'Cancelar', close);
        ca.style.cssText += ';width:100%;justify-content:center';
        bx.appendChild(ad);
        bx.appendChild(ca);
      });
      return;
    }
    leitorDlg(function (bx, close) {
      bx.appendChild(mk('b', '', 'Código novo'));
      bx.appendChild(
        mk(
          'div',
          'hint',
          'Esse código não está no estoque. Quer cadastrar? Confira o que li e corrija se precisar.'
        )
      );
      var simL = simRefs(x.ref);
      simL.slice(0, 2).forEach(function (z) {
        var wn = mk(
          'div',
          'hint',
          'Código parecido com ' +
            z.ref +
            ' (“' +
            z.nome +
            '”). Se for outro modelo do mesmo grupo, cadastre com o mesmo nome de produto.'
        );
        wn.style.color = 'var(--warn)';
        bx.appendChild(wn);
      });
      function fld(l, v) {
        bx.appendChild(mk('div', 'lbl', l));
        var i = document.createElement('input');
        i.className = 'in';
        i.value = v || '';
        i.autocomplete = 'off';
        bx.appendChild(i);
        return i;
      }
      var fr = fld('Código', x.ref),
        fm = fld('Medidas', x.med),
        vr = x.vr || '';
      bx.appendChild(mk('div', 'lbl', 'Cor (C1 a C6)'));
      var cr = document.createElement('div');
      cr.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap';
      function drawC() {
        cr.textContent = '';
        varChips(vr).forEach(function (c) {
          cr.appendChild(
            btn(
              'chip' + (vr === c ? ' on' : ''),
              c,
              function () {
                vr = vr === c ? '' : c;
                drawC();
              },
              vr === c
            )
          );
        });
      }
      drawC();
      bx.appendChild(cr);
      var ad = btn('mini', 'Cadastrar produto', function () {
        close();
        fillAdd({
          ref: fr.value.trim().toUpperCase().replace(/\s+/g, ''),
          med: fm.value.trim(),
          vr: vr,
          lido: 1,
          msg: 'Código lido: confira os dados, escolha a quantidade e toque em Adicionar.'
        });
      });
      ad.style.width = '100%';
      simL.slice(0, 2).forEach(function (z) {
        var sb = btn('chip', 'Cadastrar com o nome “' + z.nome + '”', function () {
          close();
          fillAdd({
            ref: fr.value.trim().toUpperCase().replace(/\s+/g, ''),
            med: fm.value.trim(),
            vr: vr,
            lido: 1,
            nome: z.nome,
            msg: 'Mesmo nome de produto que ' + z.ref + ': confira os dados e toque em Adicionar.'
          });
        });
        sb.style.cssText += ';width:100%;justify-content:center;min-height:44px';
        bx.appendChild(sb);
      });
      var ca = btn('chip', 'Cancelar', close);
      ca.style.cssText += ';width:100%;justify-content:center';
      bx.appendChild(ad);
      bx.appendChild(ca);
    });
  }
  /* texto com pontinhos animados: "Analisando código." → ".." → "..." (para sozinho quando o elemento sai da tela) */
  function dotsText(prefix) {
    var w = document.createElement('span'),
      t = document.createElement('span'),
      d = document.createElement('span'),
      n = 0;
    t.textContent = prefix;
    d.textContent = '.';
    d.style.cssText = 'display:inline-block;min-width:1.2em;text-align:left';
    w.appendChild(t);
    w.appendChild(d);
    var iv = setInterval(function () {
      if (!w.isConnected && n > 1) {
        clearInterval(iv);
        return;
      }
      n++;
      d.textContent = ['.', '..', '...'][n % 3];
    }, 420);
    w._stop = function () {
      clearInterval(iv);
    };
    return w;
  }
  /* aviso de carregamento padrão do app: círculo girando + texto com pontinhos */
  function busyEl(prefix) {
    var w = document.createElement('span');
    w.className = 'busy';
    var dt = dotsText(String(prefix).replace(/[….]+\s*$/, ''));
    w.appendChild(dt);
    w._stop = dt._stop;
    w.setAttribute('role', 'status');
    return w;
  }
  // Lê o código de uma foto.
  function leitorFromPhoto(f) {
    loadMsg(true, 'Analisando código', 75000);
    (window.createImageBitmap
      ? createImageBitmap(f, { imageOrientation: 'from-image' })
      : Promise.reject()
    )
      .then(function (bm) {
        var c = mkCanvas(bm.width, bm.height);
        c.getContext('2d').drawImage(bm, 0, 0);
        return preRead(c, '11');
      })
      .catch(function () {
        return null;
      })
      .then(leitorResult);
  }
  // Abre a câmera do leitor de código.
  function leitorOpen() {
    camOpen(function () {}, 'Leitor de código', {
      strip: true,
      gallery: true,
      live: leitorResult,
      liveFallback: leitorFromPhoto,
      tip: 'Aponte para o código da haste e deixe o texto dentro da faixa. A leitura é automática, sem tirar foto.'
    });
  }
  // Abre o leitor como o botão "Ler haste" do cadastro (câmera própria ou nativa).
  function leitorGo() {
    var wi =
      NATIVE &&
      $('btnLeitor') &&
      $('btnLeitor').parentNode &&
      $('btnLeitor').parentNode.querySelector('input[type=file]');
    if (wi) wi.click();
    else leitorOpen();
  }
  $('btnLeitor').onclick = leitorOpen;
  try {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) armNative();
  } catch (e) {}
  // Aplica a leitura prévia ao cartão da foto.
  function applyPre(x, tok) {
    if (!P || P.tok !== tok || !x) return;
    var got = [];
    if (x.ref && !$('phRef').value.trim()) {
      $('phRef').value = x.ref;
      got.push(x.ref);
    }
    if (x.med && !$('phMed').value.trim()) {
      $('phMed').value = x.med;
      got.push(x.med);
    }
    if (/^C(?:1[0-2]|[1-9])$/.test(x.vr || '') && !P.photoOnly) {
      ensureVar(x.vr);
      P.vr = x.vr;
      got.push(x.vr);
    }
    if (got.length)
      setRead(
        'Li na foto: ' +
          got.join(' · ') +
          '.' +
          (x.ref
            ? ''
            : ' Não consegui o código: toque em "Foto de perto só do código" ou digite.') +
          ' Confira antes de confirmar.',
        x.ref ? 'n-ok' : 'n-warn'
      );
    render();
  }
  // Segundo passo: foto da peça após ler o código.
  function step2(pre) {
    PRESET = pre && (pre.ref || pre.med || pre.vr) ? pre : null;
    camOpen(
      function (f) {
        S.photoFor = null;
        $('file').onchange({ target: { files: [f] } });
      },
      '2/2 · Foto da armação inteira',
      {
        gallery: true,
        tip: 'Ponha a armação inteira sobre uma folha branca, dentro do retângulo. Toque na tela para focar.'
      }
    );
  }
  // Diálogo para confirmar o código lido.
  function codeDialog(res, note) {
    var ov = document.createElement('div');
    ov.id = 'codeDlg';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.style.cssText =
      'position:fixed;inset:0;z-index:320;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:16px';
    var bx = document.createElement('div');
    bx.style.cssText =
      'background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px;width:min(94vw,440px);max-height:92vh;overflow:auto;display:flex;flex-direction:column;gap:10px';
    bx.appendChild(mk('b', '', '1/2 · Código lido'));
    var n = mk('div', 'hint', note);
    n.style.color = res && res.ref ? 'var(--ok)' : 'var(--warn)';
    bx.appendChild(n);
    function fld(l, v, ph) {
      bx.appendChild(mk('div', 'lbl', l));
      var i = document.createElement('input');
      i.className = 'in';
      i.value = v || '';
      i.placeholder = ph;
      i.autocomplete = 'off';
      bx.appendChild(i);
      return i;
    }
    var fr = fld('Código (o que fica na haste)', res && res.ref, 'Ex.: PY-566'),
      fm = fld('Medidas', res && res.med, 'Ex.: 55□19-142'),
      vr = (res && res.vr) || '';
    bx.appendChild(mk('div', 'lbl', 'Classificação de cor (opcional)'));
    var cr = document.createElement('div');
    cr.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap';
    function drawC() {
      cr.textContent = '';
      varChips(vr).forEach(function (c) {
        cr.appendChild(
          btn(
            'chip' + (vr === c ? ' on' : ''),
            c,
            function () {
              vr = vr === c ? '' : c;
              drawC();
            },
            vr === c
          )
        );
      });
    }
    drawC();
    bx.appendChild(cr);
    var go = btn('mini', 'Continuar: foto da armação inteira', function () {
      ov.remove();
      step2({
        ref: fr.value.trim().toUpperCase().replace(/\s+/g, ''),
        med: fm.value.trim(),
        vr: vr
      });
    });
    go.style.width = '100%';
    var re = btn('chip', 'Refazer a leitura', function () {
      ov.remove();
      smartAdd();
    });
    re.style.cssText += ';width:100%;justify-content:center';
    bx.appendChild(go);
    bx.appendChild(re);
    ov.appendChild(bx);
    document.body.appendChild(ov);
  }
  // Adicionar peça: foto → leitura → cadastro.
  function smartAdd() {
    camOpen(
      function (f) {
        var st = document.createElement('div');
        st.id = 'codeDlg';
        st.style.cssText =
          'position:fixed;inset:0;z-index:320;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px';
        st.textContent = 'Lendo o código…';
        document.body.appendChild(st);
        (window.createImageBitmap ? createImageBitmap(f) : Promise.reject())
          .then(function (bm) {
            var c = mkCanvas(bm.width, bm.height);
            c.getContext('2d').drawImage(bm, 0, 0);
            return preRead(c);
          })
          .catch(function () {
            return null;
          })
          .then(function (res) {
            st.remove();
            codeDialog(
              res,
              res && res.ref
                ? 'Confira e corrija se precisar.'
                : 'Não consegui ler o código' +
                    (HERR ? ' (o leitor não iniciou: ' + HERR + ')' : '') +
                    '. Digite abaixo, ou toque em Continuar para seguir só com a foto. O leitor precisa de internet na primeira vez.' +
                    httpsHint()
            );
          });
      },
      '1/2 · Código da haste',
      {
        strip: true,
        gallery: true,
        tip: 'Aproxime a haste e alinhe o texto dentro da faixa. Toque na tela para focar.',
        skip: function () {
          step2(null);
        },
        skipTxt: 'Pular leitura'
      }
    );
  }

  /* leitura tolerante: junta o texto sem espaços/quebras e procura CÓDIGO + medidas (o quadradinho pode virar 0, 4 ou sumir) */
