  // ===== Ações e eventos da parte financeira (contas, fluxo, retirada, conferência, taxas). =====
  // Dia de vencimento de uma despesa.
  document.addEventListener('change', function (ev) {
    var t = ev.target,
      id = t.getAttribute && t.getAttribute('data-exd');
    if (!id) return;
    var e = S.exp.filter(function (x) {
      return String(x.id) === id;
    })[0];
    if (!e) return;
    var d = Math.round(toNum(t.value)) || 0;
    if (d < 0 || d > 31) d = 0;
    if (d) e.dia = d;
    else delete e.dia;
    renderDesp();
    renderDash();
    saveSoon();
  });

  // Campos de contagem do caixa guardam o que foi digitado (a tela pode ser redesenhada).
  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (t.id && /^cc[PUB]$/.test(t.id)) {
      S.ccV = S.ccV || {};
      S.ccV[t.id] = t.value;
    }
  });
  // Ajustes novos: taxas, lembrete, bloqueio e biometria.
  document.addEventListener('change', function (ev) {
    var t = ev.target,
      k = t.getAttribute && t.getAttribute('data-aj');
    if (!k) return;
    var id = t.getAttribute('data-id');
    if (k === 'ptaxa') {
      var f = formaPorId(id);
      f.taxa = Math.max(0, Math.min(30, numIn(t.value)));
      if (f !== S.formas.filter(function (x) { return x.id === id; })[0]) return;
    } else if (k === 'cclemb') S.ccLemb = t.checked;
    else if (k === 'lockmin') S.lockMin = Math.max(0, parseInt(t.value, 10) || 0);
    else if (k === 'locksens') S.lockSens = t.checked;
    else if (k === 'biotog') {
      if (t.checked)
        bioPedir(
          function () {
            S.bioOn = true;
            S.ajMsg = 'Digital ou rosto ativado.';
            S._ajForce = true;
            render();
          },
          function () {
            S.bioOn = false;
            S.ajMsg = 'Não consegui confirmar a digital ou o rosto. Tente de novo.';
            S._ajForce = true;
            render();
          }
        );
      else S.bioOn = false;
    } else return;
    S._ajForce = true;
    render();
  });

  ACT.fluxod = function (id) {
    S.fluxoD = Number(id) || 30;
    renderDash();
  };
  ACT.resexp = function () {
    var d = new Date();
    salvarArquivo(
      'lafouch-resultado-' + d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '.csv',
      resultadoCsv(),
      'text/csv',
      function () {},
      function () {
        popErr('Não consegui gerar o arquivo neste aparelho.');
      }
    );
  };

  // ---------- retirada do dono
  ACT.rtgo = function () {
    var m = $('rtM').value,
      v = parseDec($('rtV').value, m),
      nota = $('rtN').value.trim();
    if (!(v > 0)) {
      S.rtMsg = 'Informe o valor da retirada.';
      return renderCaixa();
    }
    if ((S.cash[m] || 0) < v - 1e-9) {
      S.rtMsg = 'Saldo em ' + m.toUpperCase() + ' insuficiente (' + fmtM(Math.max(0, S.cash[m] || 0), m) + ').';
      return renderCaixa();
    }
    exigirAuth(function () {
      var ts = Date.now(),
        g = Math.round(v * ratePyg(m));
      S.cash[m] -= v;
      S.retiradas.unshift({ ts: ts, moeda: m, orig: v, valor: g, nota: nota });
      S.dlog.push({ ts: ts, kind: 'ret', desc: nota || 'Retirada do dono', valor: g, moeda: m, orig: v });
      S.rtMsg = 'Retirada registrada: ' + fmtM(v, m) + '.';
      saveSoon();
      renderCaixa();
      renderDash();
    });
  };
  ACT.rtdes = function (id) {
    var r = S.retiradas.filter(function (x) {
      return String(x.ts) === id;
    })[0];
    if (!r) return;
    S.cash[r.moeda] += r.orig;
    S.retiradas = S.retiradas.filter(function (x) {
      return x !== r;
    });
    S.dlog = S.dlog.filter(function (x) {
      return !(x.kind === 'ret' && x.ts === r.ts);
    });
    S.rtMsg = 'Retirada desfeita. ' + fmtM(r.orig, r.moeda) + ' voltaram ao caixa.';
    saveSoon();
    renderCaixa();
    renderDash();
  };

  // ---------- conferência do caixa
  ACT.ccabrir = function () {
    S.ccOpen = true;
    S.ccRes = null;
    S.ccV = {};
    renderCaixa();
  };
  ACT.ccfechar = function () {
    S.ccOpen = false;
    S.ccRes = null;
    renderCaixa();
  };
  ACT.ccgo = function () {
    var cont = {
        pyg: parseDec($('ccP').value, 'pyg'),
        usd: parseDec($('ccU').value, 'usd'),
        brl: parseDec($('ccB').value, 'brl')
      },
      difs = {},
      totUsd = 0;
    ['pyg', 'usd', 'brl'].forEach(function (m) {
      difs[m] = Math.round((cont[m] - (S.cash[m] || 0)) * 100) / 100;
      totUsd += (Math.abs(difs[m]) * ratePyg(m)) / S.fx.pyg;
    });
    var ok = totUsd <= (S.tolUsd || 0),
      partes = ['pyg', 'usd', 'brl']
        .filter(function (m) {
          return Math.abs(difs[m]) >= 0.005;
        })
        .map(function (m) {
          return (difs[m] > 0 ? '+' : '−') + fmtM(Math.abs(difs[m]), m);
        }),
      txt = ok
        ? 'O caixa confere' + (partes.length ? ' (diferença dentro da tolerância: ' + partes.join(', ') + ')' : '') + '.'
        : 'Diferença encontrada: ' + partes.join(', ') + ' (contado menos o que o app calcula).';
    var ts = Date.now();
    S.confCx.push({ ts: ts, difs: difs, ok: ok, ajustou: false });
    S.dlog.push({ ts: ts, kind: 'confcx', desc: txt, valor: Math.round(totUsd * S.fx.pyg) });
    S.ccRes = { ok: ok, txt: txt, cont: cont };
    saveSoon();
    renderCaixa();
    renderDash();
  };
  ACT.ccadj = function () {
    var r = S.ccRes;
    if (!r || r.ok) return;
    exigirAuth(function () {
      S.cash = { pyg: r.cont.pyg, usd: r.cont.usd, brl: r.cont.brl };
      var u = S.confCx[S.confCx.length - 1];
      if (u) u.ajustou = true;
      S.dlog.push({ ts: Date.now(), kind: 'confcx', desc: 'Saldo do app ajustado para o valor contado.', valor: 0 });
      S.ccRes = null;
      S.ccOpen = false;
      S.cxMsg = 'Saldos ajustados para o que você contou.';
      saveSoon();
      renderCaixa();
      renderDash();
    });
  };

  // ---------- preço perigoso: aplica o piso como preço da faixa para aquele tipo
  ACT.precoap = function (key) {
    var l = precoPerigoso(),
      m = l.filter(function (x) {
        return x.key === key;
      })[0];
    if (!m) return;
    var f = faixaOf(m.ref);
    if (!f) return;
    var novo = l
      .filter(function (x) {
        var xf = faixaOf(x.ref);
        return x.tipo === m.tipo && xf && xf.id === f.id;
      })
      .reduce(function (a, x) {
        return Math.max(a, x.pp.piso);
      }, 0);
    f.precos = f.precos || {};
    f.precos[m.tipo] = novo;
    saveSoon();
    render();
  };

  // ---------- PIN e cópias
  ACT.pinset = function () {
    var a = $('pin1').value,
      b = $('pin2').value;
    if (!/^\d{4,8}$/.test(a)) {
      S.ajMsg = 'O PIN deve ter de 4 a 8 números.';
    } else if (a !== b) {
      S.ajMsg = 'Os dois PINs não são iguais.';
    } else {
      var sal = novoSal();
      hashPin(a, sal).then(function (h) {
        S.pinSalt = sal;
        S.pinHash = h;
        S.pinNovo = false;
        S.ajMsg = 'PIN ativado. Ele será pedido ao abrir o app.';
        S._ajForce = true;
        saveSoon();
        render();
      });
      return;
    }
    S._ajForce = true;
    render();
  };
  ACT.pintroca = function () {
    exigirAuth(function () {
      S.pinNovo = true;
      S._ajForce = true;
      render();
    });
  };
  ACT.pinoff = function () {
    if (!S.pinOffConf) {
      S.pinOffConf = true;
      S._ajForce = true;
      render();
      return;
    }
    exigirAuth(function () {
      S.pinOffConf = false;
      S.pinHash = '';
      S.pinSalt = '';
      S.bioOn = false;
      S.ajMsg = 'PIN desativado.';
      S._ajForce = true;
      saveSoon();
      render();
    });
  };
  ACT.abagora = function () {
    autoBackup(true).then(function () {
      S.ajMsg = 'Cópia feita.';
      S._ajForce = true;
      render();
    });
  };
  ACT.abrest = function (dia) {
    if (S.abConf !== dia) {
      S.abConf = dia;
      S._ajForce = true;
      render();
      return;
    }
    exigirAuth(function () {
      abRestaurar(dia).then(function (txt) {
        var e = txt ? restaurarDados(txt) : 'Cópia não encontrada.';
        S.abConf = '';
        S.ajMsg = e || 'Cópia de ' + dia.split('-').reverse().join('/') + ' restaurada.';
        S._ajForce = true;
        saveSoon();
        render();
      });
    });
  };

  // ---------- Dados de exemplo (14 meses)
  ACT.exemplo = function () {
    if (!S.exConf) {
      S.exConf = true;
      S._ajForce = true;
      render();
      return;
    }
    exigirAuth(function () {
      S.exConf = false;
      exGerar();
      S._ajForce = true;
      saveFotos();
      saveSoon();
      render();
    });
  };
  // ---------- Moeda principal
  ACT.moedap = function (id) {
    S.moedaP = id === 'usd' || id === 'brl' ? id : 'pyg';
    S.descTxt = '';
    S.rec = null;
    S.hF.vmin = S.hF.vmax = '';
    S._ajForce = true;
    saveSoon();
    render();
  };
  // ---------- Dashboard em abas
  ACT.dtab = function (id) {
    S.dTab = id;
    renderDash();
    animEnter($('dtabBody'));
  };
  ACT.dfold = function (id) {
    S.dfold[id] = !S.dfold[id];
    renderDash();
    if (S.dfold[id]) {
      var b = document.querySelector('[data-act="dfold"][data-id="' + id + '"]'),
        sec = b && b.closest('section');
      animEnter(sec && sec.nextElementSibling);
    }
  };
  ACT.attodos = function () {
    S.atTodos = !S.atTodos;
    renderDash();
  };

  // Datas do período "Outro".
  document.addEventListener('change', function (ev) {
    var t = ev.target,
      k = t.getAttribute && t.getAttribute('data-pdat');
    if (!k) return;
    if (k === 'de') S.perDe = t.value;
    else S.perAte = t.value;
    renderDash();
  });
