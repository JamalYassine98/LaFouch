  // ===== Cliente na venda + tela "Venda confirmada" com o comprovante de venda (sempre em G$, IVA 10% incluso). =====
  // O app NÃO emite nota fiscal: imprime o comprovante (sem valor fiscal) para qualquer cliente.
  // Paraguaio com RUC: o comprovante leva Nombre/RUC (dados que a máquina fiscal usa). Estrangeiro: nome e CI/CPF, nunca RUC.
  // Futuro (decisão do dono, 04/11/2026): com a API da fatura eletrônica do ministério (SIFEN), o comprovante do paraguaio sai com o QR.
  S.vCli = 0; // cliente escolhido na venda (0 = ninguém: Sin nombre / RUC X)
  S._vCliQ = '';
  S._vCliNovo = false;
  S.notaCidade = 'CDE';
  var notaTimer = 0,
    notaAtual = null;
  var temRuc = function (c) {
    return !!(c && String(c.ruc || '').trim()) && !cliEstr(c);
  };
  var cliDocTxt = function (c) {
    return c && String(c.ruc || '').trim() ? cliDocLbl(c) + ' ' + c.ruc : '';
  };
  var cliPorId = function (id) {
    return S.clientes.filter(function (c) {
      return c.id === id;
    })[0];
  };
  // ---- campo "Cliente (opcional)" na tela de pagamento ----
  function vcSugHtml() {
    var q = cliNorm(S._vCliQ),
      qd = cliDig(S._vCliQ);
    if (!q) return '';
    var r = S.clientes
      .filter(function (c) {
        return cliNorm(c.nome).indexOf(q) >= 0 || (qd.length >= 2 && (cliDig(c.tel).indexOf(qd) >= 0 || cliDig(c.ruc).indexOf(qd) >= 0));
      })
      .slice(0, 5);
    return (
      '<div class="col" style="gap:8px;margin-top:8px">' +
      r
        .map(function (c) {
          return '<button type="button" class="sl" data-act="vcliesc" data-id="' + c.id + '" style="text-align:left;border:1px solid var(--line);border-radius:12px;padding:10px 12px;background:transparent;color:inherit;font:inherit;cursor:pointer"><b>' + esc(c.nome || c.tel) + '</b><small style="display:block">' +
            esc([c.tel, cliDocTxt(c)].filter(Boolean).join(' · ')) + '</small></button>';
        })
        .join('') +
      '<button type="button" data-act="vclinovo" style="border:2px dashed var(--line);border-radius:12px;padding:10px 12px;color:var(--accent-fg);font:inherit;font-weight:700;background:transparent;cursor:pointer">＋ Cadastrar novo cliente</button></div>'
    );
  }
  function pagCliRender() {
    var el = $('cliPick');
    if (!el) return;
    var sig = [S.vCli, S._vCliNovo ? 1 : 0].join('|');
    if (el._sig === sig) return;
    el._sig = sig;
    var c = S.vCli ? cliPorId(S.vCli) : null;
    if (S.vCli && !c) S.vCli = 0;
    if (c) {
      el.innerHTML =
        '<div style="display:flex;align-items:center;gap:10px;border:1px solid var(--accent);border-radius:12px;padding:10px 12px"><span style="flex:1"><b>' + esc(c.nome || c.tel) + '</b><small style="display:block">' +
        esc([c.tel, cliDocTxt(c)].filter(Boolean).join(' · ')) +
        '</small></span><button type="button" class="chip" data-act="vclitrocar" style="min-height:36px">Trocar</button></div>';
    } else if (S._vCliNovo) {
      el.innerHTML =
        '<input class="in" id="vcNome" placeholder="Nome" autocomplete="off" value="' + esc(S._vCliQ) + '">' +
        '<input class="in" id="vcTel" type="tel" inputmode="tel" placeholder="Telefone / WhatsApp">' +
        cliDocHtml('vc', null) +
        '<div class="hint" id="vcH" style="margin:0"></div>' +
        '<div style="display:flex;gap:8px"><button type="button" class="go" data-act="vclisave" style="flex:1">Salvar cliente</button><button type="button" class="chip" data-act="vclicanc" style="min-height:48px">Cancelar</button></div>';
    } else {
      el.innerHTML = '<input class="in" id="vCliQ" placeholder="Nome, telefone ou documento" autocomplete="off" aria-label="Cliente" value="' + esc(S._vCliQ) + '"><div id="vCliSug">' + vcSugHtml() + '</div>';
    }
  }
  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'vCliQ') {
      S._vCliQ = e.target.value;
      var l = $('vCliSug');
      if (l) l.innerHTML = vcSugHtml();
    }
  });
  function vcReset() {
    S.vCli = 0;
    S._vCliQ = '';
    S._vCliNovo = false;
    var el = $('cliPick');
    if (el) el._sig = null;
  }
  ACT.vcliesc = function (id) {
    S.vCli = +id;
    S._vCliQ = '';
    S._vCliNovo = false;
    render();
  };
  ACT.vclitrocar = function () {
    S.vCli = 0;
    S._vCliQ = '';
    render();
  };
  ACT.vclinovo = function () {
    S._vCliNovo = true;
    render();
  };
  ACT.vclicanc = function () {
    S._vCliNovo = false;
    render();
  };
  ACT.vclisave = function () {
    var nome = $('vcNome').value.trim(),
      tel = $('vcTel').value.trim(),
      ruc = $('vcRuc').value.trim();
    if (!nome && !cliDig(tel)) {
      $('vcH').textContent = 'Escreva o nome ou o telefone.';
      return;
    }
    var dup = cliAchar(nome, tel, ruc, 0);
    if (dup) {
      $('vcH').textContent = 'Já existe um cliente com esse telefone ou documento: ' + (dup.nome || dup.tel) + '.';
      return;
    }
    var c = { id: S.cliNext++, nome: cap1(nome), tel: tel, ruc: ruc, nac: cliNacLida('vc', null), obs: '', ts: Date.now() };
    S.clientes.push(c);
    S.vCli = c.id;
    S._vCliQ = '';
    S._vCliNovo = false;
    render();
  };

  // ---- dados da nota ----
  function notaMontar(cart, cli) {
    var g = {},
      ord = [];
    cart.forEach(function (l) {
      var desc = l.it.tipo === 'solar' ? 'Lente de sol' : 'Armazón',
        tot = Math.round(cartLinhaPreco(l)),
        un = l.qty > 0 ? Math.round(tot / l.qty) : tot,
        k = desc + '|' + un;
      if (!g[k]) {
        g[k] = { desc: desc, qty: 0, un: un, tot: 0 };
        ord.push(g[k]);
      }
      g[k].qty += l.qty;
      g[k].tot += tot;
    });
    var total = ord.reduce(function (a, x) {
      return a + x.tot;
    }, 0);
    // Dados da nota (só saem com "Emitir nota fiscal" ligado). Paraguaio sem RUC ou sem cliente: Sin nombre / RUC X.
    // Estrangeiro nunca tem nota (podeNota = false): a chave nem aparece.
    var fis = cli && temRuc(cli);
    return {
      ts: Date.now(),
      podeNota: !cliEstr(cli),
      nombre: fis ? cli.nome || 'Sin nombre' : 'Sin nombre',
      ruc: fis ? String(cli.ruc).trim() : 'X',
      ciudad: 'CDE',
      pago: 'Contado',
      lineas: ord,
      total: total,
      iva: Math.round(total / 11)
    };
  }
  var notaNum = function (v) {
    return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  // Papel (sempre em ESPANHOL, regra do dono). fis = com os dados da nota (Nombre, RUC, IVA).
  // Esboço aprovado v5 (04/11/2026): LA FOUCH no topo; Ciudad e Pago sempre; nome/RUC/IVA só com a nota.
  function notaHtml(n, estilo, fis) {
    var hr = '<hr style="border:0;border-top:1px dashed #111">',
      r = function (a, b, s) {
        return '<div style="display:flex;justify-content:space-between;gap:10px;' + (s || '') + '"><span>' + a + '</span><span>' + b + '</span></div>';
      };
    return (
      '<div class="notapapel" style="' + (estilo || '') + '"><div style="text-align:center;font-weight:700;font-size:1.15em;letter-spacing:2px;margin-bottom:6px">LA FOUCH</div>' +
      '<div style="text-align:center;font-weight:700;border:1px dashed #111;padding:3px;margin-bottom:6px">' + 'COMPROBANTE DE VENTA' + '</div>' +
      '<div>Fecha: ' + fd(n.ts) + ' ' + fh(n.ts) + '</div>' +
      (fis ? '<div>Nombre: ' + esc(n.nombre) + '</div><div>RUC: ' + esc(n.ruc) + '</div>' : '') +
      '<div>Ciudad: ' + esc(n.ciudad) + '</div><div>Pago: ' + n.pago + '</div>' + hr +
      n.lineas
        .map(function (x) {
          return r(x.qty + ' ' + x.desc, notaNum(x.tot));
        })
        .join('') +
      hr + r('TOTAL G$', notaNum(n.total), 'font-weight:800') + (fis ? r('IVA 10% G$', notaNum(n.iva)) : '') + '</div>'
    );
  }
  // Chave "Emitir nota fiscal": lembra o último modo neste aparelho.
  var notaFis = (function () {
    try {
      return localStorage.getItem('lf_notaFis') === '1';
    } catch (e) {
      return false;
    }
  })();
  var notaFisOn = function (n) {
    return !!(n && n.podeNota && notaFis);
  };
  var NOTA_PAP = 'background:#fff;color:#111;padding:14px;font-family:ui-monospace,Menlo,monospace;font-size:12.5px;line-height:1.5;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.4)';
  function notaSwHtml() {
    return (
      '<div class="nfSw vst"><span><b>Emitir nota fiscal</b><small id="nfSwH">' + (notaFis ? 'Ligado: comprovante com dados da nota' : 'Desligado: só o comprovante') + '</small></span>' +
      '<button type="button" class="nfTg' + (notaFis ? ' on' : '') + '" data-act="notaFis" role="switch" aria-checked="' + notaFis + '" aria-label="Emitir nota fiscal"><i></i></button></div>'
    );
  }
  ACT.notaFis = function () {
    if (!notaAtual || !notaAtual.podeNota || vcfBusy) return;
    notaFis = !notaFis;
    try {
      localStorage.setItem('lf_notaFis', notaFis ? '1' : '0');
    } catch (e) {}
    var t = document.querySelector('#notaOv .nfTg'),
      h = $('nfSwH'),
      p = $('notaPap');
    if (t) {
      t.classList.toggle('on', notaFis);
      t.setAttribute('aria-checked', String(notaFis));
    }
    if (h) h.textContent = notaFis ? 'Ligado: comprovante com dados da nota' : 'Desligado: só o comprovante';
    if (p) {
      var h0 = p.offsetHeight;
      p.innerHTML = notaHtml(notaAtual, NOTA_PAP, notaFis);
      var h1 = p.offsetHeight;
      if (!REDUCED && p.animate && h0 !== h1) p.animate([{ height: h0 + 'px', overflow: 'hidden' }, { height: h1 + 'px', overflow: 'hidden' }], { duration: 350, easing: 'cubic-bezier(.4,0,.2,1)' });
    }
  };
  // ---- tela "Venda confirmada" (círculo gira, ✓ se desenha, itens entram um a um) ----
  var vcfTok = 0,
    vcfBusy = false,
    notaFecT = 0;
  function notaAbrir(nota, cli) {
    var ov = $('notaOv');
    if (!ov) return;
    clearTimeout(notaTimer);
    clearTimeout(notaFecT);
    vcfBusy = false;
    var tok = ++vcfTok;
    notaAtual = nota;
    var sub = cli ? esc(cli.nome || cli.tel) + (cliEstr(cli) ? ' · estrangeiro' : temRuc(cli) ? ' · RUC ' + esc(cli.ruc) : '') : 'Sem cliente escolhido';
    ov.classList.remove('vout');
    ov.innerHTML =
      '<div class="vcf' + (REDUCED ? ' fast' : '') + '"><button type="button" class="vx" data-act="notaX" aria-label="Fechar">×</button>' +
      '<div class="vcc' + (REDUCED ? ' done' : '') + '"><div class="vspn"></div><div class="vck"><svg viewBox="0 0 56 56" aria-hidden="true"><path d="M13 29l10 10 20-22"/></svg></div></div>' +
      '<h2 class="vst">Venda confirmada</h2><div class="hint vst vsub">' + sub + '</div>' +
      '<div class="vtot vst" id="vtot">' + gs(nota.total) + '</div>' +
      '<div class="vst" id="notaPap">' + notaHtml(nota, NOTA_PAP, notaFisOn(nota)) + '</div>' +
      (nota.podeNota ? notaSwHtml() : '') +
      '<button type="button" class="go vst vimp" data-act="notaImp"><svg viewBox="0 0 24 24" aria-hidden="true" class="nfIc"><path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z"/></svg>Imprimir comprovante</button>' +
      '</div>';
    ov.hidden = false;
    document.body.classList.add('noscroll');
    var f = ov.querySelector('.vcf'),
      fim = function () {};
    if (REDUCED) {
      f.querySelectorAll('.vst').forEach(function (e) {
        e.classList.add('on');
      });
      return fim();
    }
    var T = function (ms, fn) {
        setTimeout(function () {
          if (tok === vcfTok) fn();
        }, ms);
      };
    T(800, function () {
      f.querySelector('.vcc').classList.add('done');
      vibrar(25);
    });
    var ordem = Array.prototype.slice.call(f.querySelectorAll('.vst'));
    ordem.push(f.querySelector('.vx'));
    ordem.forEach(function (e, i) {
      T(1300 + i * 220, function () {
        e.classList.add('on');
        if (e.id === 'vtot') {
          var el = e,
            t0 = performance.now();
          (function c(t) {
            if (tok !== vcfTok) return;
            var k = Math.min(1, (t - t0) / 1000);
            el.textContent = gs(Math.round(nota.total * (1 - Math.pow(1 - k, 3))));
            if (k < 1) requestAnimationFrame(c);
          })(t0);
        }
      });
    });
    T(1300 + ordem.length * 220 + 200, fim);
  }
  function notaFechar() {
    clearTimeout(notaTimer);
    clearTimeout(notaFecT);
    vcfTok++;
    vcfBusy = false;
    var ov = $('notaOv'),
      cf = $('notaCf');
    if (cf) cf.hidden = true;
    document.body.classList.remove('noscroll');
    notaAtual = null;
    if (ov && !ov.hidden) {
      if (REDUCED) ov.hidden = true;
      else {
        ov.classList.add('vout');
        notaFecT = setTimeout(function () {
          ov.hidden = true;
          ov.classList.remove('vout');
        }, 320);
      }
      lfToast('✓ Venda registrada');
    }
  }
  function notaConfirma(titulo, sub, ok, acao) {
    var cf = $('notaCf');
    cf.innerHTML =
      '<div class="card col" role="dialog" aria-modal="true" style="gap:12px;width:100%;max-width:360px"><h2 style="margin:0;font-size:19px">' + titulo + '</h2><div class="hint" style="margin:0">' + sub + '</div>' +
      '<button type="button" class="go" data-act="' + acao + '">' + ok + '</button><button type="button" class="chip" data-act="notaVolta" style="min-height:48px;justify-content:center">Voltar</button></div>';
    cf.hidden = false;
  }
  ACT.notaX = function () {
    if (!notaAtual) return notaFechar();
    notaConfirma('Fechar sem imprimir o comprovante?', 'A venda já está registrada. Se o cliente quiser o comprovante, volte e imprima agora.', 'Fechar sem imprimir', 'notaSair');
  };
  // Pergunta antes de imprimir, para um toque sem querer não gastar papel.
  ACT.notaImp = function () {
    if (!notaAtual || vcfBusy) return;
    notaConfirma('Imprimir o comprovante?', 'O comprovante será enviado para a impressora agora.', 'Imprimir', 'notaImpOk');
  };
  ACT.notaImpOk = function () {
    $('notaCf').hidden = true;
    var n = notaAtual,
      pb = $('notaPrint'),
      ov = $('notaOv'),
      b = ov && ov.querySelector('[data-act=notaImp]');
    if (!n || vcfBusy) return;
    vcfBusy = true;
    if (b) {
      b.disabled = true;
      b.innerHTML = '<span class="vsp2"></span>Enviando para a impressora…';
    }
    setTimeout(
      function () {
        if (!notaAtual) return;
        if (pb) {
          pb.innerHTML = notaHtml(n, 'font-family:ui-monospace,Menlo,monospace;font-size:12px;width:72mm;color:#000', notaFisOn(n));
          try {
            window.print();
          } catch (e) {}
        }
        if (b) {
          b.classList.add('vok');
          b.textContent = '✓ Enviado';
        }
        setTimeout(notaFechar, REDUCED ? 0 : 800);
      },
      REDUCED ? 0 : 450
    );
  };
  ACT.notaVolta = function () {
    $('notaCf').hidden = true;
  };
  ACT.notaSair = function () {
    notaFechar();
  };
