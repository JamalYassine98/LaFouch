  // ===== Pagamento automático e ficha de separação (v450, aprovado 07/11/2026) =====
  // 1) PIX automático: o app lê a notificação "Pix recebido" do Nubank (plugin LfNotif, só no APK) e confirma o pedido
  //    cujo valor (com os centavos únicos) bate. Mais de um pedido com o mesmo valor: não confirma sozinho, avisa.
  // 2) Leitura do comprovante (Banco Familiar e PIX): o leitor de texto do app acha o valor e a data e mostra "✓ valor confere".
  // 3) Ficha de separação: quando um pedido fica pago, o aparelho com a impressora (e a opção ligada) imprime uma vez.
  S.pixAuto = false; // ler as notificações do Nubank (só neste aparelho)
  S.pixLog = []; // últimas notificações lidas [{ts, txt, v, ped}]
  var NU_PKG = /^com\.nu\.production$/;
  function notifPl() {
    var C = window.Capacitor;
    if (!C) return null;
    if (C.Plugins && C.Plugins.LfNotif) return C.Plugins.LfNotif;
    try {
      if (C.isPluginAvailable && C.isPluginAvailable('LfNotif') && C.registerPlugin) return C.registerPlugin('LfNotif');
    } catch (e) {}
    return null;
  }
  // "R$ 1.234,56" → 123456 (centavos)
  function pixCentavos(txt) {
    var m = /R\$\s*([\d.]+,\d{2})/.exec(String(txt || ''));
    return m ? Math.round(parseFloat(m[1].replace(/\./g, '').replace(',', '.')) * 100) : 0;
  }
  function pedPixCent(p) {
    return Math.round((parseFloat(String(p.brl || '0').replace(',', '.')) || 0) * 100);
  }
  // Notificação do banco → pedido. Devolve o que fez (para o registro e os testes).
  function pixRecebido(n) {
    n = n || {};
    var txt = String((n.title || '') + ' ' + (n.text || '')).trim();
    if (!NU_PKG.test(n.pkg || '') || !/receb/i.test(txt)) return 'ignorada';
    var v = pixCentavos(txt);
    if (!v) return 'sem-valor';
    var cands = (S.pedidos || []).filter(function (p) {
      return p.orig === 'site' && p.pag === 'pix' && (p.pg === 'pagar' || p.pg === 'comp') && p.st !== 'canc' && pedPixCent(p) === v;
    });
    var reg = { ts: n.ts || Date.now(), txt: txt.slice(0, 90), v: v, ped: '' };
    S.pixLog = [reg].concat(S.pixLog || []).slice(0, 20);
    if (cands.length === 1) {
      var p = cands[0];
      reg.ped = p.cod || String(p.id);
      p.pgAuto = { ts: reg.ts, txt: 'Pix recebido R$ ' + (v / 100).toFixed(2).replace('.', ',') };
      var sel = S.pedSel,
        y = window.scrollY;
      ACT.pedpago(p.id); // confirmado sem o dono tocar: não muda a tela em que ele está
      S.pedSel = sel;
      window.scrollTo(0, y);
      lfToast('PIX recebido: pedido ' + (p.cod || '') + ' confirmado sozinho');
      saveSoon();
      return 'confirmado';
    }
    if (cands.length > 1) {
      reg.ped = 'vários';
      cands.forEach(function (p) {
        p.pixAmb = reg.ts;
      });
      lfToast('PIX de R$ ' + (v / 100).toFixed(2).replace('.', ',') + ' recebido: mais de um pedido com esse valor, confirme você');
      saveSoon();
      return 'ambiguo';
    }
    saveSoon();
    return 'sem-pedido';
  }
  var NOTIF_OUVE = false;
  function notifLiga() {
    var P = notifPl();
    if (!P || !S.pixAuto) return;
    if (!NOTIF_OUVE) {
      NOTIF_OUVE = true;
      try {
        P.addListener('notificacao', function (n) {
          pixRecebido(n);
          if (S.view === 'ped' || S.view === 'ajustes') render();
        });
      } catch (e) {}
    }
    // as que chegaram com o app fechado
    P.pendentes()
      .then(function (r) {
        (r && r.itens ? r.itens : []).forEach(pixRecebido);
      })
      .catch(function () {});
  }
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) notifLiga();
  });
  setTimeout(notifLiga, 4000);
  var NOTIF_OK = null;
  function notifStatus() {
    var P = notifPl();
    if (!P) return;
    P.status()
      .then(function (r) {
        var a = !!(r && r.acesso);
        if (a !== NOTIF_OK) {
          NOTIF_OK = a;
          if (S.view === 'ajustes') render();
        }
      })
      .catch(function () {});
  }
  function pautoSw(act, tit, sub, on, dis) {
    return '<button type="button" class="paSw" data-act="' + act + '" role="switch" aria-checked="' + on + '"' + (dis ? ' disabled style="opacity:.5"' : '') + '><span><b>' + tit + '</b><small>' + sub + '</small></span><span class="sw"><input type="checkbox" tabindex="-1" aria-hidden="true"' + (on ? ' checked' : '') + '><i></i></span></button>';
  }
  function pautoCard() {
    var P = notifPl(),
      u = (S.pixLog || [])[0];
    if (P && NOTIF_OK === null) notifStatus();
    return (
      '<section class="card col paCard">' +
      pautoSw('pautoTog', 'PIX pelo Nubank', P ? 'confirma sozinho quando chega a notificação "Pix recebido"' : 'só no app do Android (precisa do APK novo)', !!S.pixAuto, !P) +
      (P && S.pixAuto ? '<div class="sl"><span>Acesso às notificações</span><b style="color:var(--' + (NOTIF_OK ? 'ok)">✓ permitido' : 'warn)">precisa permitir') + '</b></div>' + (NOTIF_OK ? '' : '<button type="button" class="btn go" data-act="pautoAcesso" style="width:100%">Permitir acesso</button>') : '') +
      '<div class="sl"><span>Última notificação lida</span><b>' + (u ? fd(u.ts) + ' ' + fh(u.ts) : 'nenhuma') + '</b></div>' +
      (u ? '<div class="hint" style="margin:0">' + esc(u.txt) + (u.ped ? ' → pedido ' + esc(u.ped) : ' → nenhum pedido com esse valor') + '</div>' : '') +
      '<div class="hint" style="margin:0">Transferência (Banco Familiar): por enquanto com comprovante (o app lê o valor).</div>' +
      '</section><section class="card col paCard">' +
      pautoSw('fichaTog', 'Imprimir pedidos pagos sozinho', imp ? 'ficha de separação nesta impressora, uma vez por pedido' : 'conecte uma impressora neste aparelho', fichaAutoOn(), !imp) +
      '</section>'
    );
  }
  ACT.pautoTog = function () {
    S.pixAuto = !S.pixAuto;
    saveSoon();
    if (S.pixAuto) {
      var P = notifPl();
      if (P)
        P.status().then(function (r) {
          if (!r || !r.acesso) P.pedirAcesso().catch(function () {});
        });
      notifLiga();
    }
    render();
  };
  ACT.pautoAcesso = function () {
    var P = notifPl();
    if (P) P.pedirAcesso().catch(function () {});
    NOTIF_OK = null;
  };
  if (typeof AJ_PADRAO !== 'undefined' && AJ_PADRAO.indexOf('pauto') < 0) {
    AJ_PADRAO.push('pauto');
    AJ_ICO.pauto = AJ_SVG('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>');
  }

  // ---- Leitura do comprovante ----
  var COMP_LENDO = {};
  // Acha o valor no texto do comprovante e compara com o valor esperado do pedido.
  function compLeTexto(p, txt) {
    var t = String(txt || ''),
      ok = false,
      ach = 0,
      data = (/(\d{2})[\/.-](\d{2})[\/.-](\d{2,4})/.exec(t) || [''])[0],
      hora = (/\b(\d{1,2}):(\d{2})\b/.exec(t) || [''])[0];
    if (p.pag === 'pix') {
      var esp = pedPixCent(p),
        re = /R?\$?\s*(\d{1,3}(?:\.\d{3})*,\d{2})/g,
        m;
      while ((m = re.exec(t))) {
        var c = Math.round(parseFloat(m[1].replace(/\./g, '').replace(',', '.')) * 100);
        if (c === esp) ok = true;
        if (!ach || Math.abs(c - esp) < Math.abs(ach - esp)) ach = c;
      }
      return { ok: ok, v: ach ? 'R$ ' + (ach / 100).toFixed(2).replace('.', ',') : '', esp: 'R$ ' + (esp / 100).toFixed(2).replace('.', ','), d: (data + ' ' + hora).trim() };
    }
    var espG = p.pagar || pedTotal(p),
      reG = /(\d{1,3}(?:[.\s]\d{3})+|\d{4,9})/g,
      mg;
    while ((mg = reG.exec(t))) {
      var n = +mg[1].replace(/[.\s]/g, '');
      if (n < 1000 || n > 100000000) continue;
      if (n === espG) ok = true;
      if (Math.abs(n - espG) / espG < 0.6 && (!ach || Math.abs(n - espG) < Math.abs(ach - espG))) ach = n;
    }
    return { ok: ok, v: ach ? gs(ach) : '', esp: gs(espG), d: (data + ' ' + hora).trim() };
  }
  function compLeHtml(p) {
    var r = p.compLe;
    if (!r) return COMP_LENDO[p.id] ? '<div class="pdMt" style="margin-top:4px">Lendo o comprovante…</div>' : '';
    if (r.ok) return '<div class="pdMt" style="margin-top:4px;color:var(--ok,#5fd38d)"><b>✓ Valor confere: ' + esc(r.esp) + '</b>' + (r.d ? ' · ' + esc(r.d) : '') + '</div>';
    if (r.v) return '<div class="pdMt" style="margin-top:4px;color:var(--bad,#e88)"><b>⚠ Valor diferente: ' + esc(r.v) + '</b> (esperado ' + esc(r.esp) + ') · confira antes de confirmar</div>';
    return '<div class="pdMt" style="margin-top:4px">Não consegui ler o valor (esperado ' + esc(r.esp) + '). Confira na imagem.</div>';
  }
  function compLeAgenda(p) {
    if (p.compLe || COMP_LENDO[p.id] || !p.comp || typeof getWorker !== 'function' || /(^|[#&])test\b/.test(location.hash)) return;
    COMP_LENDO[p.id] = 1;
    var im = new Image();
    im.onload = function () {
      var k = Math.min(1, 1600 / Math.max(im.width, im.height)),
        c = mkCanvas(Math.round(im.width * k), Math.round(im.height * k));
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      getWorker()
        .then(function (w) {
          return w.setParameters({ tessedit_pageseg_mode: '3' }).then(function () {
            return w.recognize(c);
          });
        })
        .then(function (r) {
          p.compLe = compLeTexto(p, r && r.data ? r.data.text : '');
          saveSoon();
        })
        .catch(function () {
          p.compLe = { ok: false, v: '', esp: p.pag === 'pix' ? 'R$ ' + String(p.brl || '').replace('.', ',') : gs(p.pagar || pedTotal(p)), d: '' };
        })
        .then(function () {
          delete COMP_LENDO[p.id];
          if (S.view === 'ped') render();
        });
    };
    im.onerror = function () {
      delete COMP_LENDO[p.id];
    };
    im.src = p.comp;
  }

  // ---- Ficha de separação ----
  function fichaAutoOn() {
    try {
      return localStorage.getItem('lf_fichaAuto') === '1';
    } catch (e) {
      return false;
    }
  }
  ACT.fichaTog = function () {
    try {
      localStorage.setItem('lf_fichaAuto', fichaAutoOn() ? '' : '1');
    } catch (e) {}
    render();
  };
  function fichaLinhas(p) {
    var L = [{ t: 'LA FOUCH', centro: 1, negrito: 1 }, { t: 'SEPARAR PEDIDO DO SITE', centro: 1 }, { t: '#' + (p.cod || p.id), centro: 1, negrito: 1, grande: 1 }];
    L.push({ t: 'PAGO · ' + (p.pag === 'pix' ? 'PIX R$ ' + String(p.brl || '').replace('.', ',') : 'B. FAMILIAR ' + gs(p.pagar || pedTotal(p))), centro: 1, negrito: 1 });
    L.push({ t: fd(p.ts) + ' ' + fh(p.ts) }, { t: 'Cliente: ' + (p.cli || '') }, { t: 'Tel: ' + (p.tel || '') }, { traco: 1 });
    (p.itens || []).forEach(function (l) {
      L.push({ t: l.q + 'x ' + (l.ref || '') + ' ' + (l.t || ''), negrito: 1 });
      if (l.cor) L.push({ t: '   cor: ' + l.cor });
    });
    L.push({ traco: 1 });
    if (p.ent === 'delivery') {
      L.push({ t: 'DELIVERY', negrito: 1 }, { t: p.endE || '' });
      if (p.refE) L.push({ t: 'Ref.: ' + p.refE });
    } else L.push({ t: 'RETIRAR NA LOJA', negrito: 1 });
    L.push({ traco: 1 });
    if (p.tok) L.push({ qr: p.tok }, { t: 'Codigo de retirada: ' + p.tok, centro: 1, negrito: 1 });
    return L;
  }
  function fichaImprime(p) {
    if (!imp) return Promise.reject(new Error('Nenhuma impressora'));
    return impEnviar(impBytes(fichaLinhas(p))).then(function () {
      p.impresso = Date.now();
      saveSoon();
    });
  }
  ACT.pedficha = function (id) {
    var p = pedAch(id);
    if (!p) return;
    if (!imp || !impPlugin()) {
      lfToast('Conecte a impressora em Ajustes › Impressora');
      return;
    }
    fichaImprime(p).then(
      function () {
        lfToast('Ficha impressa');
        render();
      },
      function () {
        lfToast('A impressora não respondeu');
      }
    );
  };
  // Pedido pago e ainda não impresso → imprime sozinho (só no aparelho com a impressora e a opção ligada).
  var FICHA_BUSY = false;
  function fichaCheck() {
    if (FICHA_BUSY || !fichaAutoOn() || !imp || !impPlugin()) return;
    var p = (S.pedidos || []).filter(function (x) {
      return x.orig === 'site' && x.pg === 'pago' && !x.impresso && x.st !== 'canc' && x.st !== 'ent';
    })[0];
    if (!p) return;
    FICHA_BUSY = true;
    fichaImprime(p)
      .catch(function () {})
      .then(function () {
        FICHA_BUSY = false;
      });
  }
  setInterval(fichaCheck, 15000);
