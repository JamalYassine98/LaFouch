  // ===== Cadastro por foto: lê código/grau/quantidade e compara a aparência com o estoque. =====
  var FM = { sigc: {}, lim: 0.8 };
  // Assinatura de uma foto: onde está a peça (máscara 16×8), cor média e proporção.
  function fmSigDe(src) {
    return new Promise(function (res) {
      var im = typeof src === 'string' ? new Image() : src;
      function go(el) {
        try {
          var W = 96,
            sc = Math.min(1, W / Math.max(el.width || el.naturalWidth, el.height || el.naturalHeight)),
            w = Math.max(8, Math.round((el.width || el.naturalWidth) * sc)),
            h = Math.max(8, Math.round((el.height || el.naturalHeight) * sc)),
            c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          var g = c.getContext('2d');
          g.fillStyle = '#fff';
          g.fillRect(0, 0, w, h);
          g.drawImage(el, 0, 0, w, h);
          var d = g.getImageData(0, 0, w, h).data,
            bg = [0, 0, 0],
            n = 0,
            x,
            y,
            o;
          // fundo = média das bordas
          for (x = 0; x < w; x++)
            [0, h - 1].forEach(function (yy) {
              o = (yy * w + x) * 4;
              bg[0] += d[o];
              bg[1] += d[o + 1];
              bg[2] += d[o + 2];
              n++;
            });
          for (y = 1; y < h - 1; y++)
            [0, w - 1].forEach(function (xx) {
              o = (y * w + xx) * 4;
              bg[0] += d[o];
              bg[1] += d[o + 1];
              bg[2] += d[o + 2];
              n++;
            });
          bg = [bg[0] / n, bg[1] / n, bg[2] / n];
          var m = new Uint8Array(w * h),
            x0 = w,
            x1 = -1,
            y0 = h,
            y1 = -1,
            cnt = 0;
          for (y = 0; y < h; y++)
            for (x = 0; x < w; x++) {
              o = (y * w + x) * 4;
              var dd = Math.abs(d[o] - bg[0]) + Math.abs(d[o + 1] - bg[1]) + Math.abs(d[o + 2] - bg[2]);
              if (dd > 60) {
                m[y * w + x] = 1;
                cnt++;
                if (x < x0) x0 = x;
                if (x > x1) x1 = x;
                if (y < y0) y0 = y;
                if (y > y1) y1 = y;
              }
            }
          if (cnt < 12 || x1 <= x0 || y1 <= y0) return res(null);
          var bw = x1 - x0 + 1,
            bh = y1 - y0 + 1,
            GX = 16,
            GY = 8,
            grid = new Array(GX * GY).fill(0),
            tot = new Array(GX * GY).fill(0),
            r = 0,
            gg = 0,
            b = 0,
            nn = 0;
          for (y = y0; y <= y1; y++)
            for (x = x0; x <= x1; x++) {
              var cx = Math.min(GX - 1, Math.floor(((x - x0) / bw) * GX)),
                cy = Math.min(GY - 1, Math.floor(((y - y0) / bh) * GY)),
                k = cy * GX + cx;
              tot[k]++;
              if (m[y * w + x]) {
                grid[k]++;
                o = (y * w + x) * 4;
                r += d[o];
                gg += d[o + 1];
                b += d[o + 2];
                nn++;
              }
            }
          for (var i = 0; i < grid.length; i++) grid[i] = tot[i] ? grid[i] / tot[i] : 0;
          // suaviza (média 3×3): pequenas inclinações e deslocamentos não derrubam a semelhança
          var gs = new Array(grid.length).fill(0);
          for (var yy2 = 0; yy2 < GY; yy2++)
            for (var xx2 = 0; xx2 < GX; xx2++) {
              var sm = 0,
                cn = 0;
              for (var dy = -1; dy <= 1; dy++)
                for (var dx = -1; dx <= 1; dx++) {
                  var ax = xx2 + dx,
                    ay = yy2 + dy;
                  if (ax < 0 || ay < 0 || ax >= GX || ay >= GY) continue;
                  sm += grid[ay * GX + ax];
                  cn++;
                }
              gs[yy2 * GX + xx2] = sm / cn;
            }
          grid = gs;
          res({ grid: grid, rgb: [r / nn, gg / nn, b / nn], asp: bw / bh, fill: cnt / (bw * bh) });
        } catch (e) {
          res(null);
        }
      }
      if (typeof src !== 'string') return go(im);
      im.onload = function () {
        go(im);
      };
      im.onerror = function () {
        res(null);
      };
      im.src = src;
    });
  }
  // 0 a 1: quanto duas assinaturas se parecem (forma 60%, cor 25%, proporção 15%).
  function fmScore(a, b) {
    if (!a || !b) return 0;
    var inter = 0,
      uni = 0,
      i;
    for (i = 0; i < a.grid.length; i++) {
      var p = a.grid[i],
        q = b.grid[i];
      inter += Math.min(p, q);
      uni += Math.max(p, q);
    }
    var forma = uni ? inter / uni : 0,
      sa = a.rgb[0] + a.rgb[1] + a.rgb[2] + 1,
      sb = b.rgb[0] + b.rgb[1] + b.rgb[2] + 1,
      cr = Math.sqrt(
        Math.pow(a.rgb[0] / sa - b.rgb[0] / sb, 2) +
          Math.pow(a.rgb[1] / sa - b.rgb[1] / sb, 2) +
          Math.pow(a.rgb[2] / sa - b.rgb[2] / sb, 2)
      ),
      cor = 0.65 * (1 - Math.min(1, cr * 4)) + 0.35 * (1 - Math.min(1, Math.abs(sa - sb) / 765)),
      pr = 1 - Math.min(1, Math.abs(Math.log(a.asp / b.asp)) * 2);
    return 0.6 * forma + 0.25 * cor + 0.15 * pr;
  }
  // Modelos do estoque que se parecem com a foto (um por modelo, só os que passam do limite).
  function fmRank(src, lim) {
    var cand = {};
    Object.keys(S.fotos || {}).forEach(function (k) {
      var p = k.indexOf('|'),
        ref = k.slice(0, p),
        cor = k.slice(p + 1),
        it = S.items.filter(function (i) {
          return i.ref === ref && !i.bulk;
        })[0];
      if (!it || isSimple(it.tipo) || !S.fotos[k]) return;
      (cand[ref] = cand[ref] || []).push({ ref: ref, cor: cor, tipo: it.tipo, foto: S.fotos[k] });
    });
    return fmSigDe(src).then(function (sg) {
      if (!sg) return [];
      var all = [];
      Object.keys(cand).forEach(function (r) {
        all.push(
          Promise.all(
            cand[r].map(function (c) {
              return fmSigDe(c.foto).then(function (s) {
                return Object.assign({ score: fmScore(sg, s) }, c);
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
          .filter(function (x) {
            return x && x.score >= (lim == null ? FM.lim : lim);
          })
          .sort(function (x, y) {
            return y.score - x.score;
          })
          .slice(0, 3);
      });
    });
  }

  // ===== Telas da foto (propostas 4, 5 e 6) =====
  function fmGrauTxt(g) {
    return String(g).replace('.', ',');
  }
  // Lê grau e quantidade do texto de uma etiqueta ("+1.75", "24 pc").
  function fmLeEtiqueta(txt) {
    var o = {},
      g = String(txt || '').match(/[+\-]\s?\d[.,]\d{2}/),
      q = String(txt || '').match(/(\d{1,3})\s*(?:pcs?|pç|pecas|peças)\b/i);
    if (g) o.grau = g[0].replace(/\s/g, '').replace(',', '.');
    if (q) o.qty = parseInt(q[1], 10);
    return o;
  }
  function fmSheet(titulo, sub, build) {
    leitorDlg(function (bx, close) {
      bx.className = 'fmSheet';
      var h = mk('div', 'fmHd'),
        t = mk('div', 'fmTt', titulo),
        b = mk('button', 'fmX', 'Fechar');
      b.onclick = close;
      h.appendChild(t);
      h.appendChild(b);
      bx.appendChild(h);
      if (sub) bx.appendChild(mk('div', 'fmSub', sub));
      build(bx, close);
    });
  }
  function fmFotoEl(src, cls) {
    var d = mk('div', cls || 'fmFoto');
    if (src) d.style.backgroundImage = 'url(' + src + ')';
    return d;
  }
  // Dados do modelo para copiar para um Novo modelo.
  function fmCopia(ref) {
    var it = S.items.filter(function (i) {
        return i.ref === ref && !i.bulk;
      })[0],
      at = nvAtr(ref);
    return it ? { tipo: it.tipo, fmt: it.fmt || '', med: it.med || '', mat: at.material || '', pub: at.publico || '' } : {};
  }
  function fmNovo(cv, copia, deRef, cor) {
    var o = { lido: 1, tipo: copia && copia.tipo };
    if (copia) {
      o.fmt = copia.fmt;
      o.med = copia.med;
    }
    fillAdd(o);
    if (copia) {
      S.eMat = copia.mat || '';
      S.ePub = copia.pub || '';
    }
    NVC.fotoT = cv ? thumbOf(cv) : '';
    NVC.fotoH = cv ? cv.toDataURL('image/jpeg', 0.92) : '';
    if (cor) NVC.cor = cor;
    S.nDeRef = deRef || '';
    S.nFotoPeca = !!cv;
    render();
    if (deRef)
      setTimeout(function () {
        guiaMarca('eRef');
      }, 200);
  }
  // Tela 5a: "Isso se parece com…"
  function fmParecido(cv, ranks) {
    var thumb = thumbOf(cv),
      pick = ranks[0].ref;
    fmSheet('Isso se parece com…', 'Só o que passa de 80%', function (bx, close) {
      var ca = mk('div', 'fmCard');
      ca.appendChild(fmFotoEl(thumb, 'fmTh'));
      var tx = mk('div', 'fmTx');
      tx.appendChild(mk('b', '', 'Sua foto'));
      tx.appendChild(mk('span', '', ((tipoOf(S.tipo) || {}).label || '')));
      ca.appendChild(tx);
      bx.appendChild(ca);
      bx.appendChild(mk('div', 'fmSec', 'Do seu estoque'));
      var cards = [];
      ranks.forEach(function (r) {
        var c = mk('div', 'fmCard sel' + (r.ref === pick ? ' on' : '')),
          pcs = S.items.filter(function (i) {
            return i.ref === r.ref && !i.bulk;
          }).reduce(function (a, i) {
            return a + (i.qty || 0);
          }, 0),
          t2 = mk('div', 'fmTx');
        c.appendChild(fmFotoEl(r.foto, 'fmTh'));
        t2.appendChild(mk('b', '', pubNome(r.ref)));
        t2.appendChild(mk('span', '', r.ref + ' · ' + pcs + ' peças'));
        c.appendChild(t2);
        c.appendChild(mk('div', 'fmPct', Math.round(r.score * 100) + '%'));
        c.onclick = function () {
          pick = r.ref;
          cards.forEach(function (x) {
            x[0].classList.toggle('on', x[1] === pick);
          });
        };
        cards.push([c, r.ref]);
        bx.appendChild(c);
      });
      var b1 = mk('button', 'fmBtn pri', 'É este · dar entrada'),
        b2 = mk('button', 'fmBtn', 'É parecido, mas outro código · copiar dados'),
        b3 = mk('button', 'fmBtn mut', 'Nenhum destes · Novo modelo');
      b1.onclick = function () {
        close();
        fmEntrada(pick, cv);
      };
      b2.onclick = function () {
        close();
        fmNovo(cv, fmCopia(pick), pick);
      };
      b3.onclick = function () {
        close();
        fmNovo(cv, null, '');
      };
      [b1, b2, b3].forEach(function (b) {
        bx.appendChild(b);
      });
      bx.appendChild(mk('div', 'fmDica', 'Três saídas claras. Toque no card para marcar qual é.'));
    });
  }
  // Tela 5c: "Não achei parecido"
  function fmNaoAchei(cv) {
    var thumb = thumbOf(cv),
      cor = '';
    try {
      var sk = skin(cv, [128, 128, 128]);
      cor = nearest(sk[0], sk[1], sk[2]);
    } catch (e) {}
    fmSheet('Não achei parecido', 'Nenhum modelo passou de 80%', function (bx, close) {
      var im = fmFotoEl(thumb, 'fmBig');
      bx.appendChild(im);
      var bq = mk('div', 'fmBox');
      bq.appendChild(mk('div', 'fmBt', 'O app já preencheu da foto'));
      [['Tipo', ((tipoOf(S.tipo) || {}).label || '')], ['Cor', cor]].forEach(function (x) {
        if (!x[1]) return;
        var l = mk('div', 'fmLn');
        l.appendChild(mk('span', '', x[0]));
        l.appendChild(mk('b', '', x[1]));
        bq.appendChild(l);
      });
      bx.appendChild(bq);
      bx.appendChild(mk('div', 'fmDica', '✓ Usar esta foto como foto da cor. Sem código na foto: o app cria o número interno.'));
      var b = mk('button', 'fmBtn pri', 'Continuar para Novo modelo');
      b.onclick = function () {
        close();
        fmNovo(cv, null, '', cor);
      };
      bx.appendChild(b);
      bx.appendChild(mk('div', 'fmDica w', 'Foto de UMA peça vira a foto da cor. Foto de pacote/etiqueta é descartada.'));
    });
  }
  // Entrada de um modelo que já existe (pré: peças que entram; demais: entrada rápida).
  function fmEntrada(ref, cv, info) {
    var it = S.items.filter(function (i) {
      return i.ref === ref && !i.bulk;
    })[0];
    if (!it) return false;
    if (it.tipo !== 'pre') return quickOpen(ref);
    fmPecas(ref, cv, info || {});
    return true;
  }
  // Tela 4: Peças que entram / Pacote lido (pré-graduado: grau, cor e quantidade independentes).
  function fmPecas(ref, cv, info) {
    var its = S.items.filter(function (i) {
        return i.ref === ref && i.tipo === 'pre' && !i.bulk;
      }),
      cores = [];
    its.forEach(function (i) {
      if (cores.indexOf(i.cor) < 0) cores.push(i.cor);
    });
    var mem = (S.memo && S.memo[ref]) || {},
      cor = info.cor || (cores.indexOf(mem.cor) >= 0 ? mem.cor : cores[0] || ''),
      linhas = [],
      graus = [],
      g;
    for (g = 0.75; g <= 4.0001; g += 0.25) graus.push((Math.round(g * 100) / 100).toFixed(2));
    if (info.grau) linhas.push({ grau: info.grau, cor: cor, qty: info.qty || 1 });
    var custo = (refInfo(ref) || {}).custo || '';
    var lido = !!(info.grau || info.qty);
    fmSheet(
      lido ? 'Pacote lido' : 'Peças que entram',
      lido ? 'Confira o que o app leu' : ref + ' · cada linha é grau + cor + quantidade',
      function (bx, close) {
        var corpo = mk('div', 'fmCorpo');
        bx.appendChild(corpo);
        function foto(c) {
          return S.fotos[ref + '|' + c];
        }
        function falta() {
          var f = [];
          linhas.forEach(function (l) {
            if (!foto(l.cor) && f.indexOf(l.cor) < 0) f.push(l.cor);
          });
          return f;
        }
        function total() {
          return linhas.reduce(function (a, l) {
            return a + l.qty;
          }, 0);
        }
        function pinta() {
          corpo.innerHTML = '';
          if (cv && lido) corpo.appendChild(fmFotoEl(thumbOf(cv), 'fmBig'));
          if (lido) {
            var ib = mk('div', 'fmBox');
            [['Código', ref + '  confira'], ['Grau', info.grau ? '+' + fmGrauTxt(info.grau).replace(/^[+]/, '') : 'não li · toque abaixo'], ['Quantidade', info.qty ? info.qty + ' peças' : 'não li · ajuste abaixo']].forEach(function (x) {
              var l = mk('div', 'fmLn');
              l.appendChild(mk('span', '', x[0]));
              l.appendChild(mk('b', '', x[1]));
              ib.appendChild(l);
            });
            corpo.appendChild(ib);
          }
          linhas.forEach(function (l, ix) {
            var c = mk('div', 'fmCard'),
              tx = mk('div', 'fmTx');
            c.appendChild(foto(l.cor) ? fmFotoEl(foto(l.cor), 'fmTh') : (function () { var d = mk('div', 'fmTh fmSem'); d.innerHTML = NV_ICAM; return d; })());
            tx.appendChild(mk('b', '', fmGrauTxt(l.grau) + ' · ' + l.cor));
            tx.appendChild(mk('span', foto(l.cor) ? '' : 'w', foto(l.cor) ? 'foto ok' : 'falta a foto'));
            c.appendChild(tx);
            var st = mk('div', 'fmSt'),
              mn = mk('button', '', '−'),
              q = mk('b', '', String(l.qty)),
              pl = mk('button', '', '+');
            mn.onclick = function () {
              if (l.qty > 1) l.qty--;
              else linhas.splice(ix, 1);
              pinta();
            };
            pl.onclick = function () {
              l.qty++;
              pinta();
            };
            [mn, q, pl].forEach(function (x) {
              st.appendChild(x);
            });
            c.appendChild(st);
            corpo.appendChild(c);
          });
          var bx2 = mk('div', 'fmBox');
          bx2.appendChild(mk('div', 'fmLbl', 'Cor'));
          var ch = mk('div', 'fmChips');
          cores.forEach(function (c) {
            var b = mk('button', 'fmChip' + (c === cor ? ' on' : ''), c + (mem.cor === c ? ' · como da última vez' : ''));
            b.onclick = function () {
              cor = c;
              pinta();
            };
            ch.appendChild(b);
          });
          var nc = mk('button', 'fmChip', '+ Nova cor');
          nc.onclick = function () {
            fmNovaCor(function (nome) {
              if (cores.indexOf(nome) < 0) cores.push(nome);
              cor = nome;
              pinta();
            });
          };
          ch.appendChild(nc);
          bx2.appendChild(ch);
          bx2.appendChild(mk('div', 'fmLbl', 'Toque vários graus de uma vez'));
          var gr = mk('div', 'fmGraus');
          graus.forEach(function (gv) {
            var on = linhas.some(function (l) {
              return l.grau === gv && l.cor === cor;
            });
            var b = mk('button', 'fmG' + (on ? ' on' : ''), '+' + fmGrauTxt(gv).replace('.', ','));
            b.onclick = function () {
              var ix = -1;
              linhas.forEach(function (l, k) {
                if (l.grau === gv && l.cor === cor) ix = k;
              });
              if (ix >= 0) linhas.splice(ix, 1);
              else linhas.push({ grau: gv, cor: cor, qty: 1 });
              pinta();
            };
            gr.appendChild(b);
          });
          bx2.appendChild(gr);
          corpo.appendChild(bx2);
          var fl = falta();
          if (fl.length) {
            var fb = mk('button', 'fmBtn pri');
            fb.innerHTML = NV_ICAM + ' <span>Foto da cor ' + fl[0] + '</span>';
            fb.style.cssText += ';display:flex;align-items:center;justify-content:center;gap:8px';
            fb.onclick = function () {
              var c0 = fl[0];
              camOpen(
                function (f) {
                  fmArquivo(f, function (cv2) {
                    setFoto(ref + '|' + c0, thumbOf(cv2), cv2.toDataURL('image/jpeg', 0.92));
                    pinta();
                  });
                },
                'Foto da cor ' + c0,
                { gallery: true, tip: 'Foto de UMA peça da cor ' + c0 + '.' }
              );
            };
            corpo.appendChild(fb);
            corpo.appendChild(mk('div', 'fmAviso', 'Falta a foto da cor ' + fl.join(', ') + '.'));
          }
          var ok = mk('button', 'fmBtn pri' + (fl.length || !total() ? ' off' : ''), 'Dar entrada · ' + total() + ' peças');
          ok.onclick = function () {
            if (fl.length || !total()) return;
            var cu = parseFloat(String(custo).replace(',', '.'));
            if (!(cu > 0)) {
              popErr('Informe o custo por peça em US$ no cadastro do modelo.');
              return;
            }
            var base = its[0];
            linhas.forEach(function (l) {
              var vr = (its.filter(function (x) {
                return x.cor === l.cor;
              })[0] || {}).vr || '';
              var ex = S.items.filter(function (x) {
                return x.tipo === 'pre' && x.ref === ref && x.grau === l.grau && x.cor === l.cor && !x.lote && !x.bulk;
              })[0];
              if (ex) ex.qty += l.qty;
              else
                S.items.push({
                  custo: cu,
                  tipo: 'pre',
                  grau: l.grau,
                  ref: ref,
                  med: '',
                  vr: vr,
                  fmt: base.fmt || '',
                  cor: l.cor,
                  qty: l.qty
                });
              entradaEstoque('pre', ref, l.cor, l.grau, l.qty);
            });
            if (!S.memo) S.memo = {};
            S.memo[ref] = { cor: linhas[linhas.length - 1].cor, graus: linhas.map(function (l) { return l.grau; }) };
            lfEntrada(total(), ref);
            close();
            render();
          };
          corpo.appendChild(ok);
          corpo.appendChild(mk('div', 'fmDica w', 'A foto do pacote é só leitura e é descartada. Cor e grau vêm da memória do modelo.'));
        }
        pinta();
      }
    );
  }
  function fmNovaCor(cb) {
    fmSheet('Nova cor', 'Digite o nome da cor', function (bx, close) {
      var i = document.createElement('input');
      i.className = 'fmIn';
      i.placeholder = 'Ex.: Tartaruga';
      bx.appendChild(i);
      var b = mk('button', 'fmBtn pri', 'Usar esta cor');
      b.onclick = function () {
        var v = i.value.trim();
        if (!v) return;
        close();
        cb(v);
      };
      bx.appendChild(b);
    });
  }
  function fmArquivo(f, cb) {
    var url = URL.createObjectURL(f),
      im = new Image();
    im.onload = function () {
      try {
        cb(fitCanvas(im, 1800));
      } catch (e) {
        popErr('Não consegui abrir essa foto.');
      }
      URL.revokeObjectURL(url);
    };
    im.onerror = function () {
      popErr('Não consegui abrir essa foto.');
    };
    im.src = url;
  }
  // Ponto de entrada: foto da peça, da etiqueta, da caixa ou do pacote.
  function fmAnalisa(f) {
    loadMsg(true, 'Analisando foto', 75000);
    fmArquivo(f, function (cv) {
      var leu = Promise.race([
          readTess(cv),
          new Promise(function (r) {
            setTimeout(function () {
              r(null);
            }, 14000);
          })
        ]).catch(function () {
          return null;
        }),
        rk = fmRank(cv);
      Promise.all([leu, rk]).then(function (r) {
        loadMsg(false);
        var ler = r[0] || {},
          ranks = r[1] || [],
          ref = ler.referencia ? String(ler.referencia).toUpperCase().replace(/\s/g, '') : '',
          et = fmLeEtiqueta(ler._txt),
          existe = ref && S.items.some(function (i) {
            return i.ref === ref && !i.bulk;
          });
        if (ref && existe) {
          if (!fmEntrada(ref, cv, et)) leitorResult(ler);
          return;
        }
        if (ref) {
          fillAdd({ ref: ref, med: ler.medidas || '', lido: 1 });
          return;
        }
        if (et.grau && ranks.length) {
          fmEntrada(ranks[0].ref, cv, et);
          return;
        }
        if (ranks.length) fmParecido(cv, ranks);
        else fmNaoAchei(cv);
      });
    });
  }
  $('btnFoto').onclick = function () {
    S.photoFor = null;
    camOpen(
      function (f) {
        S.photoFor = null;
        fmAnalisa(f);
      },
      'Foto da etiqueta, da caixa ou do pacote',
      {
        gallery: true,
        tip: 'Ponha a peça, a etiqueta ou o pacote dentro do retângulo. Toque na tela para focar.'
      }
    );
  };
