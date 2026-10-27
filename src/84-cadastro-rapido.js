  // ===== Cadastro rápido: entrada de modelo que já existe, modelos parecidos por foto e vários graus de uma vez. =====
  var QK = { row: null, n: 1, graus: {}, custo: '', shown: false };
  // Peças do modelo (sem as "sem detalhe" dos lotes).
  function quickItens(ref) {
    return S.items.filter(function (i) {
      return i.ref === ref && !i.bulk;
    });
  }
  // Linhas escolhíveis: pré-graduado agrupa por cor + classe (os graus vão num painel à parte).
  function quickLinhas(ref) {
    var its = quickItens(ref),
      pre = its[0] && its[0].tipo === 'pre',
      seen = {},
      out = [];
    its.forEach(function (i) {
      var k = pre ? i.cor + '|' + (i.vr || '') : String(S.items.indexOf(i));
      if (seen[k]) {
        seen[k].qty += i.qty;
        return;
      }
      seen[k] = { k: k, it: i, cor: i.cor, vr: i.vr || '', qty: i.qty };
      out.push(seen[k]);
    });
    return out;
  }
  // Abre a entrada rápida de um modelo que já está no estoque.
  function quickOpen(ref) {
    var ls = quickLinhas(ref);
    if (!ls.length) return false;
    S.addOpen = true;
    S.addMode = 'quick';
    S.qRef = ref;
    var best = ls.filter(function (l) {
      return l.qty > 0;
    })[0];
    QK = { row: (best || ls[0]).k, n: 1, graus: {}, custo: '', shown: false };
    S.msg = '';
    render();
    return true;
  }
  var gTxt = function (g) {
    return String(g).replace('.', ',');
  };
  function quickCustoSug(ref) {
    var c = (refInfo(ref) || {}).custo;
    return c ? String(c).replace('.', ',') : '';
  }
  // Soma de peças marcadas (pré-graduado) ou o valor do contador.
  function quickTotal(pre) {
    return pre
      ? Object.keys(QK.graus).reduce(function (a, g) {
          return a + QK.graus[g];
        }, 0)
      : QK.n;
  }
  function quickStep(mn, mx, cur, set) {
    var w = mk('div', 'st2'),
      m = btn('step', '−', function () {
        set(Math.max(mn, cur - 1));
      }),
      p = btn('step', '+', function () {
        set(Math.min(mx, cur + 1));
      }),
      v = mk('b', '', String(cur));
    m.setAttribute('aria-label', 'Diminuir');
    p.setAttribute('aria-label', 'Aumentar');
    m.style.cssText = p.style.cssText = 'min-width:40px;min-height:40px;width:40px;height:40px;font-size:20px';
    v.style.cssText = 'min-width:34px;text-align:center;font-size:20px';
    w.style.cssText = 'display:flex;align-items:center;gap:10px';
    w.appendChild(m);
    w.appendChild(v);
    w.appendChild(p);
    return w;
  }
  function renderQuick() {
    var host = $('addQuickB');
    if (!host) return;
    if (S.addMode !== 'quick') {
      host.textContent = '';
      return;
    }
    var ref = S.qRef,
      ls = quickLinhas(ref);
    if (!ls.length) {
      S.addMode = 'menu';
      host.textContent = '';
      return;
    }
    var sel = ls.filter(function (l) {
        return l.k === QK.row;
      })[0] || ls[0],
      f0 = sel.it,
      pre = f0.tipo === 'pre',
      tp = tipoOf(f0.tipo),
      tot = ls.reduce(function (a, l) {
        return a + l.qty;
      }, 0);
    host.textContent = '';
    host.style.gap = '12px';
    // selo "modelo reconhecido"
    var ban = mk('div', 'card lfban' + (QK.shown ? '' : ' nova'));
    ban.style.cssText = 'margin:0;border-color:var(--ok);padding:12px 14px';
    ban.innerHTML =
      '<div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><b style="display:flex;gap:8px;align-items:center"><svg class="lfck" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M7 12.5l3.5 3.5L17 9"/></svg>' +
      'Modelo encontrado</b><span class="pill o" id="qkTot">' +
      tot +
      (tot === 1 ? ' peça' : ' peças') +
      ' no estoque</span></div><div class="hint" style="margin:6px 0 0">' +
      esc(ref) +
      ' · ' +
      esc(pubNome ? pubNome(ref) : ref) +
      (tp ? ' · ' + esc(tp.label) : '') +
      '</div>';
    host.appendChild(ban);
    QK.shown = true;
    // que cor chegou
    var c1 = mk('div', 'card');
    c1.style.margin = '0';
    c1.appendChild(mk('div', 'lbl', pre ? 'Que cor e classe chegou?' : 'Que cor chegou?'));
    ls.forEach(function (l) {
      var on = l.k === sel.k,
        r = btn('pl pick' + (on ? ' picked' : ''), '', function () {
          QK.row = l.k;
          render();
        });
      r.style.cssText = 'display:flex;align-items:center;gap:10px;width:100%;text-align:left;margin-top:6px';
      var ft = S.fotos[ref + '|' + l.cor];
      if (ft) {
        var im = document.createElement('img');
        im.src = ft;
        im.alt = '';
        im.style.cssText = 'width:44px;height:44px;border-radius:10px;object-fit:cover;background:#fff;flex:none';
        r.appendChild(im);
      } else r.appendChild(dot(hexOf(l.cor)));
      var tx = mk('span', '');
      tx.style.cssText = 'flex:1;min-width:0';
      tx.appendChild(mk('b', '', l.cor + (l.vr ? ' · ' + l.vr : '')));
      var q = mk('small', '', l.qty + (pre ? ' peças no total' : ' peças'));
      q.style.cssText = 'display:block;color:var(--mute)';
      q.className = 'qkq';
      q.dataset.k = l.k;
      tx.appendChild(q);
      r.appendChild(tx);
      r.appendChild(mk('span', 'pill ' + (on ? 'a' : ''), on ? 'escolhida' : '+ entrada'));
      c1.appendChild(r);
    });
    host.appendChild(c1);
    // custo herdado
    var cs = quickCustoSug(ref),
      ce = Number(effCusto(f0)) > 0 ? usd(Number(effCusto(f0))) : '';
    // quantidade: peça comum = um contador; pré-graduado = graus
    if (!pre) {
      var g = f0.lote && S.grp.filter(function (x) { return x.id === f0.lote; })[0],
        cap = g ? Math.max(grpFalta(g), 0) : 999;
      QK.n = Math.max(1, Math.min(QK.n, Math.max(cap, 1)));
      var c2 = mk('div', 'card');
      c2.style.margin = '0';
      c2.appendChild(mk('div', 'lbl', 'Quantas peças?'));
      var stw = quickStep(1, Math.max(cap, 1), QK.n, function (v) {
        QK.n = v;
        render();
      });
      stw.style.justifyContent = 'center';
      c2.appendChild(stw);
      if (g) c2.appendChild(mk('div', 'hint', 'Esta linha vem do lote ' + gLabel(g) + ': faltam detalhar ' + cap + ' peça(s).'));
      host.appendChild(c2);
    } else {
      var c2 = mk('div', 'card');
      c2.style.margin = '0';
      c2.appendChild(mk('div', 'lbl', 'Graus que chegaram'));
      var gr = mk('div', '');
      gr.style.cssText = 'display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px';
      graus16().forEach(function (g) {
        var on = QK.graus[g] > 0;
        var b = btn('chip' + (on ? ' on' : ''), gTxt(g), function () {
          if (QK.graus[g]) delete QK.graus[g];
          else {
            QK.graus[g] = 1;
            QK.novo = g;
          }
          render();
        });
        b.style.cssText += ';justify-content:center;padding:9px 0';
        gr.appendChild(b);
      });
      c2.appendChild(gr);
      c2.appendChild(mk('div', 'hint', 'O grau está na tampa da caixa ou no adesivo da lente.'));
      host.appendChild(c2);
      Object.keys(QK.graus)
        .sort()
        .forEach(function (g) {
          var jaTem = quickItens(ref)
              .filter(function (i) {
                return i.grau === g && i.cor === sel.cor && (i.vr || '') === sel.vr;
              })
              .reduce(function (a, i) {
                return a + i.qty;
              }, 0),
            rw = mk('div', 'card' + (QK.novo === g ? ' enter' : ''));
          rw.style.cssText = 'margin:0;display:flex;justify-content:space-between;align-items:center;gap:10px';
          var lb = mk('span', '');
          lb.appendChild(mk('b', '', gTxt(g)));
          var sm = mk('small', '', jaTem ? 'tem ' + jaTem + ' agora' : 'grau novo nesta cor');
          sm.style.cssText = 'display:block;color:var(--mute)';
          lb.appendChild(sm);
          rw.appendChild(lb);
          rw.appendChild(
            quickStep(1, 999, QK.graus[g], function (v) {
              QK.graus[g] = v;
              render();
            })
          );
          host.appendChild(rw);
        });
      QK.novo = '';
      var cc = mk('div', 'card');
      cc.style.margin = '0';
      cc.appendChild(mk('div', 'lbl', 'Custo por peça (US$)'));
      var ci = mk('input', 'in');
      ci.inputMode = 'decimal';
      ci.id = 'qkCusto';
      ci.placeholder = 'Ex.: 0,50';
      ci.value = QK.custo !== '' ? QK.custo : cs;
      ci.onchange = function () {
        QK.custo = ci.value;
      };
      cc.appendChild(ci);
      cc.appendChild(mk('div', 'hint', cs ? 'Veio do cadastro do modelo. Troque só se este lote custou diferente.' : 'Este modelo ainda não tem custo: informe para dar entrada.'));
      host.appendChild(cc);
    }
    if (!pre && ce) host.appendChild(mk('div', 'hint', 'O custo vem do cadastro do modelo.'));
    var n = quickTotal(pre),
      go = btn('go', n ? 'Dar entrada' + (n > 1 ? ' · ' + n + ' peças' : '') : 'Escolha os graus', function () {
        quickGo();
      });
    go.id = 'qkGo';
    go.disabled = !n;
    go.style.margin = '0';
    host.appendChild(go);
    var nv = btn('mini', pre ? 'Outra cor ou classe deste modelo' : 'Cor nova deste modelo', function () {
      var i0 = f0;
      fillAdd(Object.assign(refInfo(i0.ref), { tipo: i0.tipo, ref: i0.ref, med: i0.med, fmt: i0.fmt, noQuick: 1 }));
      /* modelo que já existe: vai direto para Cores e fotos */
      S.nStep = 2;
      S.nCorOpen = true;
      S.nLido = false;
      NVC.cor = '';
      NVC.q = 1;
      NVC.vr = '';
      NVC.fotoT = '';
      NVC.fotoH = '';
      render();
    });
    nv.style.cssText += ';align-self:flex-start';
    host.appendChild(nv);
  }
  // Grava a entrada rápida: soma na linha existente (custo herdado) ou cria a linha do grau novo.
  function quickGo() {
    var ref = S.qRef,
      ls = quickLinhas(ref),
      sel = ls.filter(function (l) {
        return l.k === QK.row;
      })[0] || ls[0];
    if (!sel) return false;
    var f0 = sel.it,
      pre = f0.tipo === 'pre',
      feito = 0,
      nome = ref + ' ' + sel.cor;
    if (!pre) {
      var g = f0.lote && S.grp.filter(function (x) { return x.id === f0.lote; })[0],
        err = g ? gCap(g, QK.n) : '';
      if (err) {
        popErr(err);
        return false;
      }
      f0.qty += QK.n;
      entradaEstoque(f0.tipo, ref, f0.cor, f0.grau || '', QK.n);
      feito = QK.n;
      var q = document.querySelector('.qkq[data-k="' + QK.row + '"]');
      if (q) {
        pulsa(q);
        contaSubindo(q, f0.qty, function (v) { return v + ' peças'; }, 600);
      }
    } else {
      var cu = parseFloat(String(QK.custo !== '' ? QK.custo : quickCustoSug(ref)).replace(',', '.'));
      if (!(cu > 0)) {
        popErr('Informe o custo por peça em US$ para dar entrada.');
        return false;
      }
      Object.keys(QK.graus).forEach(function (g) {
        var n = QK.graus[g];
        if (!(n > 0)) return;
        var ex = S.items.filter(function (x) {
          return x.tipo === 'pre' && x.ref === ref && x.grau === g && x.cor === sel.cor && (x.vr || '') === sel.vr && !x.lote && !x.bulk;
        })[0];
        if (ex) ex.qty += n;
        else
          S.items.push({
            custo: cu,
            tipo: 'pre',
            grau: g,
            ref: ref,
            med: '',
            vr: sel.vr,
            fmt: f0.fmt || '',
            cor: sel.cor,
            qty: n
          });
        entradaEstoque('pre', ref, sel.cor, g, n);
        feito += n;
      });
      QK.graus = {};
      QK.custo = '';
    }
    QK.n = 1;
    vibrar(20);
    lfEntrada(feito, nome);
    render();
    return feito;
  }
  // Aviso curto de entrada: seguidos se somam ("+4 · 10 no total"), nunca bloqueia o toque.
  var LFE = { t: 0, sum: 0 };
  function lfEntrada(n, nome) {
    var agora = Date.now();
    LFE.sum = agora - LFE.t < 4000 ? LFE.sum + n : n;
    LFE.t = agora;
    lfToast('✓ +' + n + ' · ' + nome + (LFE.sum > n ? ' · ' + LFE.sum + ' no total' : ''));
  }

  // ----- Modelos parecidos por foto (pré-graduado quase nunca tem código na haste)
  var SIGC = {};
  // Assinatura da foto: forma (9×8), cor da armação e quanto da imagem ela ocupa.
  function imgSig(url) {
    if (!url) return Promise.resolve(null);
    var key = url.length + ':' + url.slice(-48);
    if (SIGC[key]) return SIGC[key];
    SIGC[key] = new Promise(function (res) {
      var im = new Image();
      im.onload = function () {
        try {
          var c = document.createElement('canvas');
          c.width = 9;
          c.height = 8;
          var g = c.getContext('2d');
          g.fillStyle = '#fff';
          g.fillRect(0, 0, 9, 8);
          g.drawImage(im, 0, 0, 9, 8);
          var d = g.getImageData(0, 0, 9, 8).data,
            lum = function (x, y) {
              var o = (y * 9 + x) * 4;
              return d[o] * 0.3 + d[o + 1] * 0.59 + d[o + 2] * 0.11;
            },
            bits = [],
            x,
            y,
            n = 0,
            r = 0,
            gg = 0,
            b = 0;
          for (y = 0; y < 8; y++) for (x = 0; x < 8; x++) bits.push(lum(x, y) > lum(x + 1, y) ? 1 : 0);
          for (y = 0; y < 8; y++)
            for (x = 0; x < 9; x++) {
              var o = (y * 9 + x) * 4;
              if (lum(x, y) < 215) {
                n++;
                r += d[o];
                gg += d[o + 1];
                b += d[o + 2];
              }
            }
          res({ bits: bits, rgb: n ? [r / n, gg / n, b / n] : [255, 255, 255], frac: n / 72 });
        } catch (e) {
          res(null);
        }
      };
      im.onerror = function () {
        res(null);
      };
      im.src = url;
    });
    return SIGC[key];
  }
  function sigScore(a, b) {
    if (!a || !b) return 0;
    var h = 0;
    for (var i = 0; i < 64; i++) if (a.bits[i] !== b.bits[i]) h++;
    var cd = Math.sqrt(
      Math.pow(a.rgb[0] - b.rgb[0], 2) + Math.pow(a.rgb[1] - b.rgb[1], 2) + Math.pow(a.rgb[2] - b.rgb[2], 2)
    );
    return 0.5 * (1 - h / 64) + 0.35 * (1 - Math.min(1, cd / 255)) + 0.15 * (1 - Math.min(1, Math.abs(a.frac - b.frac) * 2));
  }
  // Os 3 modelos do estoque que mais se parecem com a foto (só tipos com código de haste).
  function simRank(url, tipo) {
    var cand = {};
    Object.keys(S.fotos || {}).forEach(function (k) {
      var p = k.indexOf('|'),
        ref = k.slice(0, p),
        cor = k.slice(p + 1),
        it = S.items.filter(function (i) {
          return i.ref === ref && i.cor === cor;
        })[0] || S.items.filter(function (i) {
          return i.ref === ref;
        })[0];
      if (!it || it.bulk || isSimple(it.tipo) || (tipo && it.tipo !== tipo)) return;
      (cand[ref] = cand[ref] || []).push({ ref: ref, cor: cor, tipo: it.tipo, foto: S.fotos[k] });
    });
    return imgSig(url).then(function (sg) {
      if (!sg) return [];
      var all = [];
      Object.keys(cand).forEach(function (r) {
        all.push(
          Promise.all(
            cand[r].map(function (c) {
              return imgSig(c.foto).then(function (s) {
                return Object.assign({ score: sigScore(sg, s) }, c);
              });
            })
          ).then(function (l) {
            return l.sort(function (x, y) {
              return y.score - x.score;
            })[0];
          })
        );
      });
      return Promise.all(all).then(function (l) {
        return l
          .filter(Boolean)
          .sort(function (x, y) {
            return y.score - x.score;
          })
          .slice(0, 3);
      });
    });
  }
  // Faixa "Já tenho este?" no cartão da foto: toque no igual e o app preenche o resto.
  function renderSimilar() {
    var box = $('phSimilar');
    if (!box) return;
    if (!P || P.photoOnly) {
      box.hidden = true;
      return;
    }
    var rv = normRef($('phRef').value, false),
      kn = rv
        ? S.items.filter(function (i) {
            return i.ref.toUpperCase() === rv && i.tipo === 'pre';
          })[0]
        : null;
    if (kn) {
      box.hidden = false;
      box.textContent = '';
      var mb = btn('chip on', 'Dar entrada de vários graus de ' + kn.ref, function () {
        simParaRapida(kn.ref);
      });
      mb.style.cssText += ';width:100%;justify-content:center';
      box.appendChild(mb);
      box.appendChild(mk('div', 'hint', 'Escolhe a cor e marca todos os graus que chegaram, cada um com sua quantidade.'));
      return;
    }
    if (rv) {
      box.hidden = true;
      return;
    }
    if (P.simTok !== P.tok) {
      P.simTok = P.tok;
      P.simList = null;
      var tok = P.tok;
      simRank(P.thumb || P.img, P.tipo || null).then(function (l) {
        if (P && P.tok === tok) {
          P.simList = l;
          renderSimilar();
        }
      });
    }
    var l = P.simList;
    if (!l || !l.length) {
      box.hidden = true;
      return;
    }
    box.hidden = false;
    box.textContent = '';
    box.appendChild(mk('div', 'lbl', 'Já tenho este?'));
    var gd = mk('div', '');
    gd.style.cssText = 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px';
    l.forEach(function (c, ix) {
      var pc = Math.round(Math.max(0, Math.min(1, (c.score - 0.35) / 0.6)) * 100),
        b = btn('card', '', function () {
          $('phRef').value = c.ref;
          $('phRef').dispatchEvent(new Event('input'));
          var it0 = S.items.filter(function (i) {
            return i.ref === c.ref && i.cor === c.cor;
          })[0];
          if (it0 && it0.vr) P.vr = it0.vr;
          P.corSet = false;
          if (it0 && !$('phCor').value.trim()) $('phCor').value = it0.cor;
          render();
        });
      b.style.cssText = 'margin:0;padding:8px;text-align:center;min-height:0;display:block';
      if (!P.simAnim) {
        b.classList.add('enter');
        b.style.animationDelay = ix * 90 + 'ms';
      }
      b.innerHTML =
        '<div style="background:#fff;border-radius:10px;overflow:hidden;height:64px"><img alt="" src="' +
        c.foto +
        '" style="width:100%;height:100%;object-fit:cover;transform:scale(1.4)"></div><b style="font-size:12px;display:block;margin-top:5px">' +
        esc(c.ref) +
        '</b><span class="pill ' +
        (pc >= 70 ? 'o' : 'w') +
        '" style="margin-top:3px">' +
        pc +
        '% parecido</span>';
      gd.appendChild(b);
    });
    box.appendChild(gd);
    var h = mk('div', 'hint', 'Toque no igual para somar a ele. Se não for nenhum, siga e crie um modelo novo (o código é automático).');
    box.appendChild(h);
    P.simAnim = true;
  }
  // Da foto para a entrada rápida (vários graus de uma vez) do modelo escolhido.
  function simParaRapida(ref) {
    if (!P) return;
    var it0 = S.items.filter(function (i) {
      return i.ref === ref;
    })[0];
    if (!it0) return;
    var cor = $('phCor').value.trim() || it0.cor;
    if (!S.fotos[ref + '|' + cor]) setFoto(ref + '|' + cor, P.thumb || P.img, P.img);
    P = null;
    quickOpen(ref);
  }
  // Rascunho: o que foi digitado e não foi salvo volta como atalho no menu.
  function rascunhoGuardar() {
    try {
      var r = $('eRef').value.trim();
      if (!r) return;
      S.rascunho = { tipo: S.tipo, ref: r, med: $('eMed').value.trim(), fmt: S.eFmt || '', cor: $('eCor').value.trim(), custo: $('eCusto').value.trim(), nome: $('eNome').value.trim(), ts: Date.now() };
    } catch (e) {}
  }
  // Copia de outro modelo: formato, material (descrição), medidas, classe e custo.
  function cloneDe(ref) {
    var it = S.items.filter(function (i) {
      return i.ref === ref;
    })[0];
    if (!it) return;
    if (it.tipo !== S.tipo) S.tipo = it.tipo;
    if (it.med) $('eMed').value = it.med;
    if (it.fmt) S.eFmt = it.fmt;
    var c = effCusto(it);
    if (c > 0) $('eCusto').value = String(Math.round(c * 10000) / 10000);
    if (it.vr && /^C\d+$/.test(it.vr)) {
      ensureVar(it.vr);
      if (S.tipo === 'pre') S.eVarP = it.vr;
      else S.eVar = it.vr;
    }
    S.msg = 'Copiei de ' + ref + ': confira, troque o código e o que mudou.';
    render();
  }
  // "Parecido com…": atalhos para copiar de modelos recentes do mesmo tipo (some quando já há código digitado).
  function renderClone() {
    var b = $('eCloneB');
    if (!b) return;
    var t = tipoOf(S.tipo),
      vazio = !$('eRef').value.trim() && !(t && t.simple) && S.addMode === 'prod';
    if (!vazio) {
      b.hidden = true;
      return;
    }
    var vistos = {},
      refs = [];
    S.items
      .slice()
      .reverse()
      .forEach(function (i) {
        if (i.tipo !== S.tipo || i.bulk || vistos[i.ref] || refs.length >= 6) return;
        vistos[i.ref] = 1;
        refs.push(i.ref);
      });
    if (!refs.length) {
      b.hidden = true;
      return;
    }
    b.hidden = false;
    b.textContent = '';
    b.appendChild(mk('div', 'lbl', 'Parecido com outro modelo? Toque para copiar formato, medidas e custo'));
    var w = mk('div', 'nav');
    refs.forEach(function (r) {
      var c = btn('chip', r, function () {
        cloneDe(r);
      });
      w.appendChild(c);
    });
    b.appendChild(w);
  }
  // Atalho do rascunho no menu Adicionar.
  function renderRascunho() {
    var b = $('addRasc');
    if (!b) return;
    var r = S.rascunho;
    if (!r || !r.ref || S.addMode !== 'menu') {
      b.hidden = true;
      return;
    }
    b.hidden = false;
    b.textContent = '';
    var c = btn('chip on', 'Continuar rascunho: ' + r.ref, function () {
      S.rascunho = null;
      fillAdd({ tipo: r.tipo, ref: r.ref, med: r.med, fmt: r.fmt, cor: r.cor, custo: r.custo, nome: r.nome, noscroll: 1 });
    });
    c.style.cssText += ';width:100%;justify-content:center';
    b.appendChild(c);
    var x = btn('mini rascX', 'Descartar rascunho', function () {
      S.rascunho = null;
      render();
    });
    b.appendChild(x);
  }
