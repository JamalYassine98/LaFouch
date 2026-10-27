  // ===== Cliente na venda + tela "Venda registrada" com os dados da nota fiscal (sempre em G$, IVA 10% incluso). =====
  // O app NÃO emite nota fiscal: mostra e imprime os dados para conferir/digitar na maquininha.
  S.vCli = 0; // cliente escolhido na venda (0 = ninguém: Sin nombre / RUC X)
  S._vCliQ = '';
  S._vCliNovo = false;
  S.notaCidade = 'CDE';
  var notaTimer = 0,
    notaAtual = null;
  var temRuc = function (c) {
    return !!(c && String(c.ruc || '').trim());
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
            esc([c.tel, temRuc(c) ? 'RUC ' + c.ruc : 'sem RUC'].filter(Boolean).join(' · ')) + '</small></button>';
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
        esc([c.tel, temRuc(c) ? 'RUC ' + c.ruc : 'sem RUC'].filter(Boolean).join(' · ')) +
        '</small></span><button type="button" class="chip" data-act="vclitrocar" style="min-height:36px">Trocar</button></div>';
    } else if (S._vCliNovo) {
      el.innerHTML =
        '<input class="in" id="vcNome" placeholder="Nome" autocomplete="off" value="' + esc(S._vCliQ) + '">' +
        '<input class="in" id="vcTel" type="tel" inputmode="tel" placeholder="Telefone / WhatsApp">' +
        '<input class="in" id="vcRuc" placeholder="RUC ou CI (vazio = estrangeiro, sem nota)" autocomplete="off">' +
        '<div class="hint" id="vcH" style="margin:0"></div>' +
        '<div style="display:flex;gap:8px"><button type="button" class="go" data-act="vclisave" style="flex:1">Salvar cliente</button><button type="button" class="chip" data-act="vclicanc" style="min-height:48px">Cancelar</button></div>';
    } else {
      el.innerHTML = '<input class="in" id="vCliQ" placeholder="Nome, telefone ou RUC" autocomplete="off" aria-label="Cliente" value="' + esc(S._vCliQ) + '"><div id="vCliSug">' + vcSugHtml() + '</div>';
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
      $('vcH').textContent = 'Já existe um cliente com esse telefone ou RUC: ' + (dup.nome || dup.tel) + '.';
      return;
    }
    var c = { id: S.cliNext++, nome: cap1(nome), tel: tel, ruc: ruc, obs: '', ts: Date.now() };
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
    return {
      ts: Date.now(),
      nombre: cli && temRuc(cli) ? cli.nome || 'Sin nombre' : 'Sin nombre',
      ruc: cli && temRuc(cli) ? String(cli.ruc).trim() : 'X',
      ciudad: S.notaCidade || 'CDE',
      pago: 'Contado',
      lineas: ord,
      total: total,
      iva: Math.round(total / 11)
    };
  }
  var notaNum = function (v) {
    return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  function notaHtml(n, estilo) {
    var hr = '<hr style="border:0;border-top:1px dashed #111">',
      r = function (a, b, s) {
        return '<div style="display:flex;justify-content:space-between;gap:10px;' + (s || '') + '"><span>' + a + '</span><span>' + b + '</span></div>';
      };
    return (
      '<div class="notapapel" style="' + (estilo || '') + '"><div style="text-align:center;font-weight:700;border:1px dashed #111;padding:3px;margin-bottom:6px">DADOS PARA NOTA FISCAL (sem valor fiscal)</div>' +
      '<div>Fecha: ' + fd(n.ts) + '</div><div>Nombre: ' + esc(n.nombre) + '</div><div>RUC: ' + esc(n.ruc) + '</div><div>Ciudad: ' + esc(n.ciudad) + '</div><div>Pago: ' + n.pago + '</div>' + hr +
      n.lineas
        .map(function (x) {
          return r(x.qty + ' ' + x.desc, '') + r('Unidad G$', notaNum(x.un));
        })
        .join('') +
      hr + r('TOTAL G$', notaNum(n.total), 'font-weight:800;font-size:14px') + r('IVA 10% G$', notaNum(n.iva)) + '</div>'
    );
  }
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
    var semRuc = !!(cli && !temRuc(cli));
    notaAtual = semRuc ? null : nota;
    var sub = cli ? esc(cli.nome || cli.tel) + (temRuc(cli) ? ' · RUC ' + esc(cli.ruc) : ' · sem RUC') : 'Sem cliente escolhido';
    ov.classList.remove('vout');
    ov.innerHTML =
      '<div class="vcf' + (REDUCED ? ' fast' : '') + '"><button type="button" class="vx" data-act="notaX" aria-label="Fechar">×</button>' +
      '<div class="vcc' + (REDUCED ? ' done' : '') + '"><div class="vspn"></div><div class="vck"><svg viewBox="0 0 56 56" aria-hidden="true"><path d="M13 29l10 10 20-22"/></svg></div></div>' +
      '<h2 class="vst">Venda confirmada</h2><div class="hint vst vsub">' + sub + '</div>' +
      '<div class="vtot vst" id="vtot">' + gs(nota.total) + '</div>' +
      (semRuc
        ? '<div class="note n-warn vst vw" role="status"><b>Cliente sem RUC</b><div>Sem dados para a nota fiscal: não há o que imprimir. Esta tela fecha sozinha.</div><div class="vpb"><i></i></div></div>'
        : '<div class="vst">' + notaHtml(nota, 'background:#fff;color:#111;padding:14px;font-family:ui-monospace,Menlo,monospace;font-size:12.5px;line-height:1.5;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.4)') + '</div>' +
          '<button type="button" class="go vst vimp" data-act="notaImp">Imprimir nota</button>') +
      '</div>';
    ov.hidden = false;
    document.body.classList.add('noscroll');
    var f = ov.querySelector('.vcf'),
      fim = function () {
        if (semRuc) {
          f.classList.add('cont');
          notaTimer = setTimeout(notaFechar, 3000);
        }
      };
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
    notaConfirma('Fechar sem imprimir a nota?', 'A venda já está registrada. Se o cliente quiser nota, volte e imprima agora.', 'Fechar sem imprimir', 'notaSair');
  };
  ACT.notaImp = function () {
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
          pb.innerHTML = notaHtml(n, 'font-family:ui-monospace,Menlo,monospace;font-size:12px;width:72mm;color:#000');
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
