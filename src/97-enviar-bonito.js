  // ===== Enviar bonito (v427, aprovado 04–05/11/2026) =====
  // 1) No catálogo, SEGURAR uma peça entra no modo seleção (✓); tocar nas outras marca/desmarca;
  //    a barra "N selecionadas · Enviar bonito ›" sobe. 2) Para quem (clientes recentes; a moeda vem do país) ou "Sem nome".
  // 3) Cartões: deslizar entre as peças, tocar no preço troca a moeda, tocar nas cores mostra/esconde, 3 estilos.
  // 4) Mensagem editável + enviar no app lembrado. Fica registrado na ficha do cliente.
  S.ebSel = null; // refs selecionadas (null = fora do modo seleção)
  var EB_EST = [
    { bg: '#f7f1ec', fg: '#2b2420', ac: '#8a2f66', mu: '#7a6f68' },
    { bg: '#2a1622', fg: '#f4e8ef', ac: '#e8b6d2', mu: '#c9a9bb' },
    { bg: '#111111', fg: '#ffffff', ac: '#e8b6d2', mu: '#b0b0b0' }
  ];
  function ebMoedaCli(c) {
    if (!c) return 'pyg';
    return cliEstr(c) ? 'brl' : 'pyg';
  }
  function ebEs(c) {
    return !!c && c.nac === 'py';
  }
  // ---- seleção no catálogo ----
  (function () {
    var rows = $('vRows');
    if (!rows) return;
    var t = null,
      alvo = null,
      x0 = 0,
      y0 = 0,
      segurou = false;
    rows.addEventListener('pointerdown', function (e) {
      var c = e.target.closest('.pcard[data-ref]');
      if (!c || S.view !== 'vendas' || ebNao(c.dataset.ref)) return;
      alvo = c;
      x0 = e.clientX;
      y0 = e.clientY;
      segurou = false;
      clearTimeout(t);
      if (S.ebSel) return;
      // v465: segurar agora abre o "espiar" (98-anim-novas.js), que tem "Selecionar para enviar" — o mesmo começo de seleção
      if (window.lfEspiaOn) return;
      t = setTimeout(function () {
        if (!alvo) return;
        segurou = true;
        S.ebSel = [alvo.dataset.ref];
        vibrar(18);
        ebDecora();
      }, 450);
    });
    rows.addEventListener('pointermove', function (e) {
      if (alvo && (Math.abs(e.clientX - x0) > 10 || Math.abs(e.clientY - y0) > 10)) {
        clearTimeout(t);
        alvo = null;
      }
    });
    var fim = function () {
      clearTimeout(t);
      alvo = null;
    };
    rows.addEventListener('pointerup', fim);
    rows.addEventListener('pointercancel', fim);
    rows.addEventListener('contextmenu', function (e) {
      if (S.ebSel) e.preventDefault();
    });
    // no modo seleção, o toque marca/desmarca (não abre a vitrine)
    rows.addEventListener(
      'click',
      function (e) {
        if (!S.ebSel) return;
        var c = e.target.closest('.pcard[data-ref]');
        e.stopPropagation();
        e.preventDefault();
        if (segurou) {
          segurou = false;
          return;
        }
        if (!c || ebNao(c.dataset.ref)) return;
        var r = c.dataset.ref,
          i = S.ebSel.indexOf(r);
        if (i >= 0) S.ebSel.splice(i, 1);
        else S.ebSel.push(r);
        if (!S.ebSel.length) S.ebSel = null;
        ebDecora();
      },
      true
    );
  })();
  function ebNao(ref) {
    var it = itemDoRef(ref);
    return !it || it.bulk;
  }
  function ebDecora() {
    var sel = S.ebSel || [];
    [].forEach.call(document.querySelectorAll('#vRows .pcard[data-ref]'), function (c) {
      var on = sel.indexOf(c.dataset.ref) >= 0;
      c.classList.toggle('ebOn', on);
      var k = c.querySelector('.ebCk');
      if (on && !k) {
        k = document.createElement('span');
        k.className = 'ebCk';
        k.textContent = '✓';
        c.appendChild(k);
      }
    });
    var b = $('ebBar');
    if (!b) {
      b = document.createElement('div');
      b.id = 'ebBar';
      b.className = 'ebBar';
      b.innerHTML = '<button type="button" class="ebX" aria-label="Sair da seleção">×</button><span class="ebN"><span class="cjOdo" id="ebNn"><span>1</span></span> <span id="ebNt">selecionada</span></span><button type="button" class="ebGo">Enviar bonito ›</button>';
      document.body.appendChild(b);
      b.querySelector('.ebX').onclick = function () {
        S.ebSel = null;
        ebDecora();
      };
      b.querySelector('.ebGo').onclick = function () {
        var refs = (S.ebSel || []).slice();
        if (!refs.length) return;
        S.ebSel = null;
        ebDecora();
        ebAbre(refs);
      };
    }
    var on = !!sel.length && S.view === 'vendas';
    b.classList.toggle('in', on);
    if (on) {
      lfOdo($('ebNn'), sel.length);
      $('ebNt').textContent = sel.length === 1 ? 'selecionada' : 'selecionadas';
    }
  }
  // ---- tela Enviar bonito ----
  function ebDados(ref) {
    var it = itemDoRef(ref),
      a = attrOf(ref) || {},
      cores = siteCores(ref).filter(function (c) {
        return c.qty > 0;
      });
    return {
      ref: ref,
      nome: pn(ref),
      desc: [a.formato, a.material && a.material.toLowerCase(), a.publico && a.publico !== 'Unissex' ? a.publico.toLowerCase() : ''].filter(function (w) { return w && String(pn(ref)).toLowerCase().indexOf(String(w).toLowerCase()) < 0; }).join(' · '),
      preco: it ? precoTab(it) : 0,
      foto: photoOf(ref),
      cores: cores.map(function (c) {
        return { cor: c.cor, hex: hexOf(c.cor), on: true };
      }),
      link: S.site && S.site[ref] ? 'lafouch.com/p/' + ref + '.html' : 'lafouch.com'
    };
  }
  function ebPreco(p, m) {
    if (m === 'pyg') return gs(p);
    var v = p / ratePyg(m);
    return (m === 'brl' ? 'R$ ' + Math.ceil(v) : 'US$ ' + Math.ceil(v));
  }
  function ebMsg(cli, n) {
    var nm = cli && cli.nome ? String(cli.nome).split(' ')[0] : '';
    if (ebEs(cli)) return '¡Hola' + (nm ? ' ' + nm : '') + '! Te separé ' + (n === 1 ? 'esta pieza' : 'estas ' + n + ' piezas') + ' 😊 Cualquier duda, escribime.';
    return 'Oi' + (nm ? ' ' + nm : '') + '! Separei ' + (n === 1 ? 'esta peça' : 'estas ' + n + ' peças') + ' para você 😊 Qualquer dúvida, é só chamar.';
  }
  function ebAbre(refs) {
    var E = { cli: null, moeda: 'pyg', est: 0, i: 0, pecas: refs.map(ebDados), refs: refs },
      app = SH_APPS.filter(function (a) {
        return a.id === (shUlt() || 'wab');
      })[0] || SH_APPS[0];
    window.__ebE = E;
    var J = lfJanela({
      titulo: 'Compartilhar',
      cls: 'ebJn',
      extra: '<span class="hint" style="margin:0" id="ebPg"></span>',
      monta: function (c, J) {
        c.innerHTML =
          '<button type="button" class="ebPara" id="ebPara"></button><div class="ebCli" id="ebCli" hidden></div>' +
          '<div class="ebTr" id="ebTr"></div>' +
          '<div class="ebEst" id="ebEst">' + EB_EST.map(function (s, k) { return '<button type="button" data-k="' + k + '" style="background:' + s.bg + '" aria-label="Estilo ' + (k + 1) + '"></button>'; }).join('') + '</div>' +
          '<div class="hint ebDica">deslize entre as peças · toque no preço para trocar a moeda · toque nas cores para mostrar ou esconder</div>' +
          '<textarea class="in ebTx" id="ebTx" rows="3"></textarea>' +
          '<button type="button" class="go ebEnv" id="ebEnv">Enviar no ' + esc(app.nome) + '</button>' +
          '<button type="button" class="ebOutro" id="ebOutro">outro app</button>';
        var paraTxt = function () {
            $('ebPara').innerHTML = '<span class="ebAv">' + (E.cli ? esc(String(E.cli.nome || '?').slice(0, 2).toUpperCase()) : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-5 8-5s6.5 1 8 5"/></svg>') + '</span><span style="flex:1;text-align:left">Para <b>' + (E.cli ? esc(E.cli.nome) : 'quem?') + '</b>' + (E.cli ? ' <span class="hint" style="display:inline;margin:0">· ' + (cliEstr(E.cli) ? 'estrangeiro' : 'paraguaio') + '</span>' : ' <span class="hint" style="display:inline;margin:0">(opcional)</span>') + '</span><span class="hint" style="margin:0">' + { pyg: 'G$', brl: 'R$', usd: 'US$' }[E.moeda] + ' ›</span>';
          },
          cartao = function (p, k) {
            var s = EB_EST[E.est];
            return '<div class="ebC" style="background:' + s.bg + ';color:' + s.fg + '"><div class="ebHd"><span class="ebLo">LA FOUCH</span><span class="ebPr" style="color:' + s.mu + '">' + (E.cli ? (ebEs(E.cli) ? 'separado para vos, ' : 'separado para você, ') + esc(String(E.cli.nome).split(' ')[0]) : '') + '</span></div>' +
              '<div class="ebIm">' + (p.foto ? '<img src="' + esc(p.foto) + '" alt="">' : '') + '</div>' +
              '<div class="ebFt"><b class="ebNm">' + esc(p.nome) + (p.desc ? ' · ' + esc(p.desc) : '') + '</b><button type="button" class="ebPc" data-k="' + k + '"><span>' + ebPreco(p.preco, E.moeda) + '</span></button>' + (E.moeda !== 'pyg' ? ' <span style="color:' + s.mu + '">· ' + gs(p.preco) + '</span>' : '') +
              '<div class="ebDots">' + p.cores.map(function (cc, j) { return '<button type="button" class="ebDot' + (cc.on ? '' : ' off') + '" data-k="' + k + '" data-j="' + j + '" style="background:' + cc.hex + '" aria-label="' + esc(cc.cor) + '"></button>'; }).join('') + '</div>' +
              '<div class="ebLk" style="color:' + s.ac + '">' + esc(p.link) + '</div></div></div>';
          },
          pinta = function () {
            $('ebTr').innerHTML = E.pecas.map(cartao).join('');
            $('ebTr').scrollLeft = E.i * $('ebTr').clientWidth;
            [].forEach.call($('ebEst').children, function (b, k) {
              b.classList.toggle('on', k === E.est);
            });
            $('ebPg').textContent = E.pecas.length > 1 ? E.i + 1 + ' de ' + E.pecas.length : '';
            paraTxt();
          };
        $('ebTx').value = ebMsg(null, refs.length);
        pinta();
        $('ebTr').addEventListener('scroll', function () {
          var w = $('ebTr').clientWidth || 1,
            i = Math.round($('ebTr').scrollLeft / w);
          if (i !== E.i) {
            E.i = i;
            $('ebPg').textContent = E.pecas.length > 1 ? i + 1 + ' de ' + E.pecas.length : '';
          }
        });
        $('ebTr').addEventListener('click', function (e) {
          var pc = e.target.closest('.ebPc'),
            dt = e.target.closest('.ebDot');
          if (pc) {
            var ord = ['pyg', 'brl', 'usd'];
            E.moeda = ord[(ord.indexOf(E.moeda) + 1) % 3];
            var sp = pc.firstChild;
            if (!REDUCED) {
              sp.style.transform = 'rotateX(90deg)';
              setTimeout(pinta, 150);
            } else pinta();
            return;
          }
          if (dt) {
            var cc = E.pecas[+dt.dataset.k].cores[+dt.dataset.j];
            cc.on = !cc.on;
            dt.classList.toggle('off', !cc.on);
          }
        });
        $('ebEst').onclick = function (e) {
          var b = e.target.closest('button');
          if (!b) return;
          E.est = +b.dataset.k;
          pinta();
        };
        $('ebPara').onclick = function () {
          var box = $('ebCli');
          if (!box.hidden) {
            box.hidden = true;
            return;
          }
          var cl = (S.clientes || []).slice().sort(function (a, b) {
            return (b.ts || 0) - (a.ts || 0);
          }).slice(0, 8);
          box.innerHTML = '<input class="in" id="ebBusca" placeholder="Nome ou telefone" autocomplete="off"><div id="ebLista"></div>';
          var lista = function (q) {
            q = String(q || '').toLowerCase();
            var l = (S.clientes || []).filter(function (c) {
              return !q || String(c.nome || '').toLowerCase().indexOf(q) >= 0 || String(c.tel || '').indexOf(q) >= 0;
            });
            if (!q) l = cl;
            $('ebLista').innerHTML = l.slice(0, 8).map(function (c) {
              return '<button type="button" class="ebLi" data-id="' + c.id + '"><span class="ebAv">' + esc(String(c.nome || '?').slice(0, 2).toUpperCase()) + '</span><span style="flex:1;text-align:left">' + esc(c.nome || '') + '<small>' + (cliEstr(c) ? 'estrangeiro' : 'paraguaio') + '</small></span><span class="hint" style="margin:0">' + { pyg: 'G$', brl: 'R$', usd: 'US$' }[ebMoedaCli(c)] + '</span></button>';
            }).join('') + '<button type="button" class="ebLi" data-id=""><span class="ebAv">–</span><span style="flex:1;text-align:left">Sem nome<small>escolho a moeda tocando no preço</small></span></button>';
          };
          lista('');
          box.hidden = false;
          $('ebBusca').oninput = function () {
            lista(this.value);
          };
          $('ebLista').onclick = function (e) {
            var b = e.target.closest('.ebLi');
            if (!b) return;
            var id = b.dataset.id;
            E.cli = id ? (S.clientes || []).filter(function (c) { return String(c.id) === id; })[0] || null : null;
            E.moeda = ebMoedaCli(E.cli);
            $('ebTx').value = ebMsg(E.cli, E.pecas.length);
            box.hidden = true;
            pinta();
          };
        };
        var envia = function (ap) {
          var lst = E.pecas;
          Promise.all(lst.map(function (p) {
            return envImg(p.foto);
          })).then(function (ims) {
            var cvs = lst.map(function (p, k) {
              return ebCanvas(p, ims[k], E);
            });
            var txt = $('ebTx').value + '\n\n' + lst.map(function (p) { return p.nome + ' · ' + ebPreco(p.preco, E.moeda) + '\nhttps://' + p.link; }).join('\n');
            var P = shPlug();
            if (ap.pkg) shGuardaUlt(ap.id);
            if (E.cli) {
              E.cli.env = (E.cli.env || []).concat([{ ts: Date.now(), refs: lst.map(function (p) { return p.ref; }) }]);
              saveSoon();
            }
            J.fecha();
            if (P) return P.send({ pkg: ap.pkg || '', text: txt, files: cvs.map(shB64) });
            return Promise.all(cvs.map(envBlob)).then(function (bl) {
              var arqs = bl.map(function (b, k) {
                return new File([b], 'lafouch-' + lst[k].ref + '.jpg', { type: 'image/jpeg' });
              });
              if (navigator.share && navigator.canShare && navigator.canShare({ files: arqs })) return navigator.share({ files: arqs, text: txt }).catch(function () {});
              window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
            });
          }).then(function () {
            if (E.cli) lfToast('✓ Enviado para ' + String(E.cli.nome).split(' ')[0]);
          });
        };
        $('ebEnv').onclick = function () {
          envia(app);
        };
        $('ebOutro').onclick = function () {
          envia({ id: 'mais', nome: 'Mais' });
        };
        if (typeof s185Liga === 'function') s185Liga(E, J, app);
      }
    });
  }
  // Imagem do cartão (1080 × 1350) para enviar.
  function ebCanvas(p, im, E) {
    var s = EB_EST[E.est],
      W = 1080,
      H = 1350,
      cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    var x = cv.getContext('2d');
    x.fillStyle = s.bg;
    x.fillRect(0, 0, W, H);
    x.fillStyle = s.fg;
    x.font = '400 46px Georgia, serif';
    x.textAlign = 'left';
    x.fillText('L A   F O U C H', 70, 110);
    if (E.cli) {
      x.textAlign = 'right';
      x.fillStyle = s.mu;
      x.font = '400 34px sans-serif';
      x.fillText((ebEs(E.cli) ? 'separado para vos, ' : 'separado para você, ') + String(E.cli.nome).split(' ')[0], W - 70, 110);
    }
    // foto num quadro branco arredondado
    var fx = 70,
      fy = 170,
      fw = W - 140,
      fh = 700;
    x.fillStyle = '#ffffff';
    if (x.roundRect) {
      x.beginPath();
      x.roundRect(fx, fy, fw, fh, 36);
      x.fill();
    } else x.fillRect(fx, fy, fw, fh);
    if (im) {
      var r = Math.min((fw - 80) / im.width, (fh - 80) / im.height),
        iw = im.width * r,
        ih = im.height * r;
      x.drawImage(im, fx + (fw - iw) / 2, fy + (fh - ih) / 2, iw, ih);
    }
    x.textAlign = 'left';
    x.fillStyle = s.fg;
    x.font = '400 54px Georgia, serif';
    x.fillText((p.nome + (p.desc ? ' · ' + p.desc : '')).slice(0, 34), 70, 960);
    x.font = '700 64px sans-serif';
    x.fillStyle = s.ac;
    var pr = ebPreco(p.preco, E.moeda);
    x.fillText(pr, 70, 1050);
    if (E.moeda !== 'pyg') {
      var w0 = x.measureText(pr).width;
      x.font = '400 40px sans-serif';
      x.fillStyle = s.mu;
      x.fillText('· ' + gs(p.preco), 70 + w0 + 20, 1050);
    }
    var cx = 90;
    p.cores.filter(function (c) {
      return c.on;
    }).forEach(function (c) {
      x.beginPath();
      x.arc(cx, 1125, 22, 0, Math.PI * 2);
      x.fillStyle = c.hex;
      x.fill();
      x.lineWidth = 3;
      x.strokeStyle = s.mu;
      x.stroke();
      cx += 66;
    });
    x.font = '500 38px sans-serif';
    x.fillStyle = s.ac;
    x.fillText(p.link, 70, 1230);
    x.font = '400 30px sans-serif';
    x.fillStyle = s.mu;
    x.fillText('Galeria Jebai Center · Ciudad del Este', 70, 1290);
    return cv;
  }
  // v465: começa a seleção a partir do "espiar"
  window.ebSeleciona = function (ref) {
    if (!ref || ebNao(ref)) return;
    S.ebSel = [ref];
    vibrar(18);
    ebDecora();
  };
