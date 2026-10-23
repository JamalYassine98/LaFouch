  // ===== Fila de fotos e cartão da foto (cadastro de nova peça). =====
  $('phCodeBtn').onclick = function () {
    if (!P) return;
    var tok = P.tok;
    function put(x) {
      if (!P || P.tok !== tok) return;
      if (!x || !x.ref) {
        setRead(
          'Não detectei o código. Aproxime a haste, deixe o texto na faixa e tente de novo, ou digite a referência.' +
            (HERR ? ' (leitor: ' + HERR + ')' : '') +
            httpsHint(),
          'n-warn'
        );
        render();
        return;
      }
      $('phRef').value = x.ref;
      var got = [x.ref];
      if (x.med) {
        $('phMed').value = x.med;
        got.push(x.med);
      }
      {
        var ri = refInfo(x.ref);
        if (ri.nome && !$('phNome').value.trim()) {
          $('phNome').value = ri.nome;
          got.push('nome');
        }
        if (ri.custo && !$('phCusto').value.trim()) {
          $('phCusto').value = ri.custo;
          got.push('custo');
        }
      }
      if (/^C(?:1[0-2]|[1-9])$/.test(x.vr || '') && !P.photoOnly) {
        ensureVar(x.vr);
        P.vr = x.vr;
        got.push(x.vr);
      }
      setRead('Leitor: ' + got.join(' · ') + '. Confira antes de confirmar.', 'n-ok');
      render();
    }
    camOpen(function () {}, 'Leitor de código', {
      strip: true,
      gallery: true,
      live: put,
      liveFallback: function (f) {
        setRead('Lendo o código…', 'n-info');
        (window.createImageBitmap ? createImageBitmap(f) : Promise.reject())
          .then(function (bm) {
            var c = mkCanvas(bm.width, bm.height);
            c.getContext('2d').drawImage(bm, 0, 0);
            return preRead(c);
          })
          .catch(function () {
            return null;
          })
          .then(put);
      },
      tip: 'Aponte para o código da haste e deixe o texto dentro da faixa. A leitura é automática, sem tirar foto.'
    });
  };
  $('phCodeFile').onchange = function (e) {
    var f = e.target.files && e.target.files[0];
    if (!f || !P) return;
    var url = URL.createObjectURL(f),
      im = new Image(),
      tok = P.tok;
    im.onload = function () {
      try {
        $('phRef').value = '';
        var full = fitCanvas(im, 2200);
        readPhoto(full, tok, null, null, true);
      } catch (x) {
        setRead('Não consegui abrir esta foto.', 'n-warn');
      }
      URL.revokeObjectURL(url);
    };
    im.onerror = function () {
      setRead('Não consegui abrir esta foto.', 'n-warn');
    };
    im.src = url;
  };
  var Q = [];
  // Avança para a próxima foto da fila.
  function nextQ() {
    if (Q.length) {
      var nf = Q.shift();
      S.msg = Q.length
        ? 'Próxima foto da galeria. Depois dela faltam ' + Q.length + '.'
        : 'Última foto da galeria.';
      setTimeout(function () {
        $('file').onchange({ target: { files: [nf] } }, true);
      }, 50);
    }
  }
  $('file').onchange = function (e, keep) {
    var fl = e.target.files,
      f = fl && fl[0];
    if (!f) return;
    loadMsg(true);
    if (!keep) Q = Array.prototype.slice.call(fl, 1);
    var url = URL.createObjectURL(f),
      img = new Image();
    img.onload = function () {
      if (!img.__y) {
        img.__y = 1;
        setTimeout(img.onload, 40);
        return;
      }
      var GAL0 = !!window.__GAL;
      window.__GAL = false;
      var full;
      try {
        full = fitCanvas(img, 2600);
      } catch (e0) {
        full = fitCanvas(img, 1600);
      }
      var prePromise = null,
        rest = function () {
          var done = function (res) {
            loadMsg(false);
            S.msg = '';
            try {
              var sk = skin(res.canvas, [128, 128, 128]),
                hx =
                  '#' +
                  sk
                    .map(function (v) {
                      return ('0' + Math.round(v).toString(16)).slice(-2);
                    })
                    .join('');
              var tok = Date.now();
              P = {
                img: res.canvas.toDataURL('image/jpeg', 0.93),
                thumb: thumbOf(res.canvas),
                hex: hx,
                qty: 1,
                fmt: '',
                vr: 'C1',
                guess: nearest(sk[0], sk[1], sk[2]),
                photoOnly: !!S.photoFor,
                tok: tok,
                tipo: null,
                full: full,
                pieces: res.pieces || []
              };
              var rawMsg = '';
              if (!S.photoFor && !GAL0) {
                var cov = coverOf(res.canvas),
                  sh = sharpOf(full),
                  bb = res.bbox,
                  ar = bb ? (bb[2] - bb[0]) * (bb[3] - bb[1]) : null;
                if (
                  sh < 20 ||
                  cov < 0.015 ||
                  cov > 0.85 ||
                  (ar != null && (ar < 0.03 || ar > 0.92))
                ) {
                  var oc = fitCanvas(img, 1800);
                  P.img = oc.toDataURL('image/jpeg', 0.93);
                  P.thumb = thumbOf(oc);
                  P.raw = 1;
                  rawMsg =
                    sh < 20
                      ? 'A foto ficou desfocada, então mantive a original, sem ajuste de fundo. Refaça com mais luz e foco para ter a foto de catálogo.'
                      : 'Não reconheci uma armação inteira e nítida, então mantive a foto original, sem ajuste de fundo.';
                }
              }
              var pf0 = S.photoFor;
              S.photoFor = null;
              var fv = function (id) {
                  var e = $(id);
                  return e && e.value ? e.value.trim() : '';
                },
                fr0 = pf0 ? '' : fv('eRef');
              $('phRef').value = pf0 ? pf0.ref : fr0;
              $('phCor').value = pf0 ? pf0.cor : fr0 && fv('eCor') ? fv('eCor') : P.guess;
              $('phGrau').value = fr0 ? fv('eGrau') : '';
              $('phMed').value = fr0 ? fv('eMed') : '';
              $('phNotas').value = '';
              $('phNome').value = fr0 ? fv('eNome') : '';
              if ($('phCusto')) $('phCusto').value = fr0 ? fv('eCusto') : '';
              setRead('');
              if (fr0) {
                P.tipo = S.tipo;
                var ev = S.tipo === 'pre' ? S.eVarP : S.eVar;
                if (/^C(?:1[0-2]|[1-9])$/.test(ev || '')) P.vr = ev;
                if (S.eFmt) P.fmt = S.eFmt;
                setRead(
                  'Mantive os dados do leitor (' + fr0 + '). Confira antes de confirmar.',
                  'n-ok'
                );
              }
              S.photoOpen = true;
              render();
              $('photoCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
              if (!pf0 && !P.photoOnly && PRE0) {
                setRead('Lendo o código, as medidas e a cor C da foto…', 'n-info');
                prePromise.then(function (x) {
                  if (!P || P.tok !== tok) return;
                  if (x && (x.ref || x.med || x.vr)) applyPre(x, tok);
                  else if (!(OCRDEAD && Date.now() - OCRDEAD < 90000))
                    readPhoto(full, tok, img, res.bbox);
                  else
                    setRead(
                      'Não consegui ler o código nesta foto. Digite a referência.' + httpsHint(),
                      'n-warn'
                    );
                });
              }
              if (rawMsg) {
                S.msg = rawMsg;
                render();
              }
            } catch (err) {
              S.msg = 'Não consegui processar essa foto. Tente outra.';
              render();
            }
            URL.revokeObjectURL(url);
          };
          /* foto da galeria: entra como está. Fundo já branco: só enquadra, sem recorte nem IA */
          if (GAL0) {
            S.msg = '';
            try {
              done({ canvas: fitCanvas(img, 1800), bbox: null, pieces: [] });
            } catch (e5) {
              S.msg = 'Não consegui processar essa foto. Tente outra.';
              render();
            }
            return;
          }
          var wh0 = false;
          try {
            wh0 = whiteBg(full);
          } catch (e4) {}
          if (wh0 && !window.__NOSEG) {
            S.msg = '';
            try {
              done(lightWhite(full));
              return;
            } catch (e6) {}
          }
          var classic = function () {
            var r;
            try {
              r = whiten(full);
            } catch (e1) {
              full = fitCanvas(img, 1600);
              r = whiten(full);
            }
            return r;
          };
          var plain = true;
          try {
            plain = bgIsPlain(full);
          } catch (e2) {}
          /* fundo "liso" mas que não é folha branca (estante, balcão): o recorte simples perde aros transparentes, então o modelo tem prioridade */
          var shelfy = false;
          if (plain && !window.__NOSEG) {
            try {
              shelfy = shelfLike(full);
            } catch (e3) {}
          }
          if (window.__NOSEG) {
            S.msg = 'Ajustando a foto de catálogo…';
            render();
            setTimeout(function () {
              try {
                done(classic());
              } catch (err) {
                S.msg = 'Não consegui processar essa foto. Tente outra.';
                render();
              }
            }, 40);
            return;
          }
          SEG.on = function (t) {
            S.msg = t;
            render();
          };
          S.msg = 'Recortando a armação…';
          render();
          modelWhiten(full).then(
            function (r) {
              SEG.on = null;
              S.msg = '';
              done(r);
              S.msg = shelfy
                ? 'Confira o recorte (lentes, bordas, pedaços do fundo) antes de confirmar.'
                : 'Atenção: o fundo desta foto não é liso e claro. Confira o recorte (lentes, bordas, pedaços do fundo). Para foto de catálogo, use uma folha branca ou cinza clara por baixo, principalmente em armação transparente.';
              render();
            },
            function (er) {
              SEG.on = null;
              window.__SEGERR = String((er && er.message) || er);
              try {
                var fb;
                try {
                  fb = flatWhite(full);
                } catch (e7) {
                  fb = classic();
                }
                done(fb);
                S.msg =
                  er && er.refusa
                    ? 'Não dá para gerar um fundo branco perfeito nesta foto: a armação é parecida com o fundo. Mantive a foto original, sem cortar nada. Para fundo branco, fotografe a peça sobre uma folha branca.'
                    : 'Não consegui recortar o fundo. Mantive a foto inteira, sem cortar a armação.' +
                      (er && er.refusa
                        ? ''
                        : /fetch|backend|wasm/i.test(String(window.__SEGERR))
                          ? ' A demo aberta dentro do Claude bloqueia o download do motor de recorte; no site hospedado ou no APK ele funciona.'
                          : ' Detalhe: ' + String(window.__SEGERR || '?').slice(0, 90) + '.');
                render();
                try {
                  setRead(S.msg, 'n-warn');
                } catch (e8) {}
              } catch (err) {
                S.msg = 'Não consegui processar essa foto. Tente outra.';
                render();
              }
            }
          );
        };
      var PRE0 = PRESET;
      PRESET = null;
      prePromise = Promise.resolve(PRE0);
      rest();
    };
    img.onerror = function () {
      loadMsg(false);
      S.msg = 'Não consegui abrir essa imagem. Tente outra foto.';
      render();
    };
    img.src = url;
  };
  $('fileG').onchange = $('file').onchange;
  ['phRef', 'phCor', 'phGrau', 'phMed', 'phNotas'].forEach(function (id) {
    $(id).oninput = function () {
      if (id === 'phCor' && P) P.corSet = 1;
      render();
    };
  });
  $('phCancel').onclick = function () {
    P = null;
    render();
    nextQ();
  };
  $('phMn').onclick = function () {
    if (P) {
      P.qty = Math.max(1, P.qty - 1);
      render();
    }
  };
  $('phPl').onclick = function () {
    if (P) {
      P.qty = Math.min(99, P.qty + 1);
      render();
    }
  };
  // Dados digitados no cartão da foto.
  function phInfo() {
    var sm0 = isSimple((P && P.tipo) || S.tipo),
      ref = normRef($('phRef').value, sm0),
      cor = cap1($('phCor').value) || 'Sem cor',
      known = ref
        ? S.items.filter(function (i) {
            return i.ref.toUpperCase() === ref;
          })[0]
        : null;
    var tipo = known ? known.tipo : (P && P.tipo) || S.tipo,
      same = known
        ? S.items.some(function (i) {
            return i.ref.toUpperCase() === ref && i.cor.toLowerCase() === cor.toLowerCase();
          })
        : false;
    return {
      ref: ref,
      cor: cor,
      known: known,
      tipo: tipo,
      same: same,
      isPre: tipo === 'pre',
      simple: isSimple(tipo)
    };
  }
  // Cartão da foto: prévia, leitura e cadastro.
  function renderPhoto() {
    var card = $('photoCard');
    if (!P) {
      card.hidden = true;
      return;
    }
    card.hidden = false;
    try {
      var pi0 = phInfo();
      updSim('phRef', 'phNome', 'phRefH', 'phSim', !pi0.ref || !!pi0.known || pi0.simple);
    } catch (eP) {}
    var sp = $('phSplit'),
      np = P.pieces ? P.pieces.length : 0;
    sp.hidden = P.photoOnly || np < 2;
    if (!sp.hidden)
      sp.textContent = 'Esta foto tem ' + np + ' peças separadas. Separar em ' + np + ' fotos';
    var f = phInfo(),
      m = $('phMatch');
    $('phImg').src = P.img;
    {
      var pgc = pickG(f.tipo, P.g).g;
      if (pgc) P.qty = Math.max(1, Math.min(P.qty, Math.max(grpFalta(pgc), 1)));
    }
    $('phQ').value = P.qty;
    if (!f.ref) {
      m.className = 'note n-info';
      m.textContent = 'Digite a referência para o app comparar com o estoque.';
    } else if (f.known && f.same) {
      m.className = 'note n-ok';
      m.textContent =
        'Mesmo produto e mesma cor já cadastrados (' +
        f.ref +
        ' ' +
        f.cor +
        '). A foto entra no catálogo dele e a quantidade soma no estoque.';
    } else if (f.known) {
      m.className = 'note n-warn';
      m.textContent =
        'Produto já existe (' +
        f.ref +
        (f.simple ? '' : ', formato ' + f.known.fmt) +
        '). Esta é uma cor nova: "' +
        (f.cor || '?') +
        '" será adicionada a ele, com a foto.';
    } else {
      m.className = 'note n-info';
      m.textContent =
        'Produto novo. Será criado em ' +
        TIPOS.filter(function (t) {
          return t.id === f.tipo;
        })[0].full +
        ' com os dados abaixo e a foto.';
    }
    $('phDot').style.background = hexOf(f.cor) === '#8b9bb0' && f.cor ? P.hex : hexOf(f.cor);
    $('phCorH').textContent =
      'Cor mais próxima lida da foto: ' +
      P.guess +
      '. É uma leitura aproximada, corrija se precisar.';
    var cc = $('phCorChips');
    cc.textContent = '';
    Object.keys(S.palette)
      .filter(quickCor)
      .forEach(function (n) {
        var b = btn(
          'chip' + (n.toLowerCase() === f.cor.toLowerCase() ? ' on' : ''),
          ' ' + n,
          function () {
            $('phCor').value = f.cor.toLowerCase() === n.toLowerCase() ? '' : n;
            render();
          }
        );
        b.insertBefore(dot(S.palette[n]), b.firstChild);
        cc.appendChild(b);
      });
    cc.appendChild(
      btn('chip add', '+ Nova cor', function () {
        S.nc = S.nc === 'p' ? '' : 'p';
        S.nf = '';
        $('phCorNew').textContent = '';
        render();
      })
    );
    newBox(
      $('phCorNew'),
      'p',
      true,
      'Nome da cor (ex.: Azul marinho)',
      corDone(function (n) {
        $('phCor').value = n;
      })
    );
    $('phTipoB').hidden = !!f.known || !!P.photoOnly;
    var pt = $('phTipos');
    pt.textContent = '';
    TIPOS.forEach(function (t) {
      pt.appendChild(
        btn(
          'chip' + (t.id === f.tipo ? ' on' : ''),
          t.label,
          function () {
            P.tipo = t.id;
            render();
          },
          t.id === f.tipo
        )
      );
    });
    $('phNotB').hidden = !!f.known || !!P.photoOnly;
    $('phFmtB').hidden = !!f.known;
    var fu = P.fmt && S.formats.indexOf(P.fmt) >= 0 ? P.fmt : '';
    var pf = $('phFmts');
    pf.textContent = '';
    fmtCat(fu).forEach(function (x) {
      pf.appendChild(
        btn(
          'chip' + (x === fu ? ' on' : ''),
          x,
          function () {
            P.fmt = P.fmt === x ? '' : x;
            render();
          },
          x === fu
        )
      );
    });
    pf.appendChild(
      btn('chip add', '+ Novo formato', function () {
        S.nf = S.nf === 'p' ? '' : 'p';
        S.nc = '';
        $('phFmtNew').textContent = '';
        render();
      })
    );
    newBox(
      $('phFmtNew'),
      'p',
      false,
      'Nome do formato (ex.: Oval)',
      fmtDone(function (n) {
        P.fmt = n;
      })
    );
    $('phGrauB').hidden = !f.isPre;
    $('phVarB').hidden = f.isPre || f.simple;
    var gn = normGrau($('phGrau').value);
    $('phGrauH').textContent = $('phGrau').value
      ? gn
        ? 'Grau lido: ' + gn
        : 'Grau inválido. Use algo como +1.75, 175 ou 3.50.'
      : 'Digite como está gravado. O "+175" vira +1.75.';
    $('phGrauH').style.color = $('phGrau').value
      ? gn
        ? 'var(--ok)'
        : 'var(--bad)'
      : 'var(--mute)';
    var pv = $('phVars');
    pv.textContent = '';
    addVarChips(pv, P.vr, function (v) {
      P.vr = v;
      render();
    });
    var po = !!P.photoOnly;
    $('phQB').hidden = po;
    if (po) {
      $('phGrauB').hidden = true;
      $('phVarB').hidden = true;
      $('phFmtB').hidden = true;
      m.className = 'note n-info';
      m.textContent =
        'A foto será salva no catálogo de ' +
        (f.ref || '?') +
        ' ' +
        (f.cor || '') +
        '. O estoque não muda.';
    }
    loteChips('phLote', f.tipo, P.g, function (v) {
      P.g = v;
    });
    var pg1 = pickG(f.tipo, P.g);
    $('phCustoH').textContent = pg1.g
      ? 'Sem preencher, vale a média do lote: ' + usd(gUnit(pg1.g)) + ' por peça.'
      : 'Obrigatório: este produto não está em nenhum lote.';
    $('phCustoB').hidden = !!po;
    if (po) $('phLoteB').hidden = true;
    $('phOk').textContent = po ? 'Salvar foto' : 'Confirmar e adicionar';
    $('phErr').hidden = true;
  }
  $('phOk').onclick = function () {
    if (!P) return;
    var f = phInfo(),
      gn = normGrau($('phGrau').value),
      err = $('phErr');
    function bad(t) {
      err.hidden = false;
      err.textContent = t;
    }
    if (!f.ref) return bad('Informe a referência da peça.');
    if (P.photoOnly) {
      if (!f.cor) return bad('Informe a cor da foto.');
      setFoto(f.ref + '|' + f.cor, P.thumb || P.img, P.img);
      S.msg = 'Foto salva em ' + f.ref + ' ' + f.cor + '.';
      S.open = f.ref;
      S.det = true;
      S.detCor = f.cor;
      S.detVr = null;
      P = null;
      render();
      return;
    }
    if (!f.cor) return bad('Informe a cor real da peça.');
    if (f.isPre && !gn) return bad('Informe um grau válido.');
    var gr = pickG(f.tipo, P.g);
    if (gr.err) return bad(gr.err);
    var gcap = gCap(gr.g, P.qty);
    if (gcap) {
      popErr(gcap);
      return;
    }
    var gid = gr.g ? gr.g.id : '';
    var ccv = $('phCusto').value.trim(),
      cu = ccv === '' ? null : parseFloat(ccv.replace(',', '.')),
      noCost = cu == null && !gr.g;
    if (!gr.g && !(cu > 0)) {
      popErr(
        'Informe o custo por peça em US$, ou escolha o lote de origem. Sem lote, o custo é obrigatório.'
      );
      return;
    }
    if (ccv !== '' && !(cu >= 0))
      return bad('Custo inválido. Use um número em US$ (ex.: 0,50) ou deixe vazio.');
    var newCor = !Object.keys(S.palette).some(function (k) {
      return k.toLowerCase() === f.cor.toLowerCase();
    });
    if (newCor) S.palette[f.cor] = f.cor === 'Sem cor' ? '#9aa4b2' : P.hex;
    var fmt = f.known ? f.known.fmt : P.fmt && S.formats.indexOf(P.fmt) >= 0 ? P.fmt : '';
    var ex = S.items.filter(function (x) {
      return (
        x.tipo === f.tipo &&
        x.ref.toUpperCase() === f.ref &&
        x.cor.toLowerCase() === f.cor.toLowerCase() &&
        (f.isPre ? x.grau === gn : x.vr === (f.simple ? '' : P.vr)) &&
        (x.lote || '') === gid &&
        (cu == null || x.custo == null || x.custo === cu)
      );
    })[0];
    var med = f.simple ? '' : f.known && f.known.med ? f.known.med : $('phMed').value.trim();
    if (gr.g && cu != null) {
      var ce2 = gCostErr(
        gr.g,
        ex && ex.custo == null ? cu * (ex.qty + P.qty) : cu * P.qty,
        null,
        cu,
        P.qty
      );
      if (ce2) {
        popErr(ce2);
        return;
      }
    }
    if (!f.simple) setPN(f.ref, $('phNome').value);
    $('phNome').value = '';
    $('phCusto').value = '';
    if (ex) {
      ex.qty += P.qty;
      if (ex.custo == null && cu != null) ex.custo = cu;
    } else
      S.items.push({
        custo: cu == null ? undefined : cu,
        lote: gid || undefined,
        tipo: f.tipo,
        grau: f.isPre ? gn : '',
        ref: f.ref,
        med: f.isPre ? '' : med,
        vr: f.isPre || f.simple ? '' : P.vr,
        fmt: fmt,
        cor: f.cor,
        qty: P.qty
      });
    var nt = $('phNotas').value.trim();
    if (nt && !f.known) {
      S.desc[f.ref] = (autoDesc(f.ref) + ' ' + nt).trim();
    }
    entradaEstoque(f.tipo, f.ref, f.cor, f.isPre ? gn : '', P.qty);
    setFoto(f.ref + '|' + f.cor, P.thumb || P.img, P.img);
    var what = f.known
      ? f.same
        ? 'foto e estoque atualizados'
        : 'cor nova adicionada ao produto'
      : 'produto novo criado';
    S.msg =
      'Pronto: ' +
      f.ref +
      ' ' +
      f.cor +
      ' (' +
      what +
      (newCor ? ', cor nova na paleta' : '') +
      ').' +
      (noCost ? ' Atenção: este produto ainda está sem preço de custo detalhado.' : '');
    if (S.fromLot) {
      S.todos = false;
      S.lotesView = true;
      S.lotSel = S.fromLot;
      S.lotPick = {};
      P = null;
      S.addOpen = false;
      S.fromLot = '';
      render();
      nextQ();
      return;
    }
    ASNAP = null;
    S.todos = false;
    S.lotesView = false;
    S.tipo = f.tipo;
    S.fmtF = 'all';
    S.corF = 'all';
    S.q = '';
    S.open = f.ref;
    S.det = true;
    S.selItem = null;
    S.detCor = f.cor;
    S.detVr = null;
    S.mode = 'venda';
    S.qty = 1;
    P = null;
    S.addOpen = false;
    render();
    nextQ();
    $('rows').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  // ================= Negócio: câmbio, despesas, vendas =================
