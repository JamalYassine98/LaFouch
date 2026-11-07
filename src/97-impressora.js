  // ===== Impressora térmica (qualquer marca, padrão ESC/POS) por Wi-Fi e Bluetooth. =====
  // Esboço aprovado pelo dono em 04/11/2026 ("ajustes_impressora_esboco"): cartão em Ajustes com
  // Sem impressora / Procurando / Conectada, conexão Automático | Só Wi-Fi | Só Bluetooth, Imprimir teste e Esquecer.
  // A parte nativa é o plugin LfPrinter (android-extra/LfPrinterPlugin.java), só no APK novo.
  // Sem plugin ou se a impressora não responder, o comprovante usa a impressão do sistema (como antes).
  // A impressora é deste aparelho: fica no localStorage (lf_impr), não sincroniza.
  var IMP_K = 'lf_impr';
  var imp = (function () {
    try {
      var o = JSON.parse(localStorage.getItem(IMP_K) || 'null');
      return o && (o.ip || (o.bt && o.bt.address)) ? o : null;
    } catch (e) {
      return null;
    }
  })();
  var impScan = null; // {busy, itens:[{tipo:'wifi'|'bt', nome, ip|address}], aviso}
  function impSalvar() {
    try {
      if (imp) localStorage.setItem(IMP_K, JSON.stringify(imp));
      else localStorage.removeItem(IMP_K);
    } catch (e) {}
  }
  var impPl = null;
  function impPlugin() {
    if (impPl) return impPl;
    var C = window.Capacitor;
    if (!C) return null;
    if (C.Plugins && C.Plugins.LfPrinter) return C.Plugins.LfPrinter;
    try {
      if (C.isPluginAvailable && C.isPluginAvailable('LfPrinter') && C.registerPlugin) impPl = C.registerPlugin('LfPrinter');
    } catch (e) {}
    return impPl;
  }
  var impTemWifi = function () {
    return !!(imp && imp.ip);
  };
  var impTemBt = function () {
    return !!(imp && imp.bt && imp.bt.address);
  };
  // A impressora térmica está pronta para receber o comprovante direto (plugin + impressora escolhida).
  function impPronta() {
    return !!(impPlugin() && (impTemWifi() || impTemBt()));
  }
  var IMP_MODO_H = {
    auto: 'Usa o Wi-Fi; se cair, troca sozinho para o Bluetooth.',
    wifi: 'Imprime só pela rede da loja (celular e PC).',
    bt: 'Imprime direto do celular, sem roteador.'
  };
  var IMP_ICO =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z"/></svg>';
  var IMP_WIFI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 8.8a15 15 0 0 1 20 0M5 12.6a10 10 0 0 1 14 0M8.5 16.3a5 5 0 0 1 7 0M12 20h.01"/></svg>';
  var IMP_BT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10-5 5V2l5 5L7 17"/></svg>';
  var IMP_LUPA = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  var IMP_REC = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V3l2 1.5L9 3l2 1.5L13 3l2 1.5L17 3l2 1.5V21l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5zM9 8h6M9 12h6M9 16h4"/></svg>';
  function impCard() {
    var cab = function (t, s) {
      return '<div class="impRw"><div class="impIc">' + IMP_ICO + '</div><div><b>' + esc(t) + '</b><small>' + s + '</small></div></div>';
    };
    var h = '<section class="card col impCard" id="impCard">';
    if (impScan) {
      h += cab('Impressora', impScan.busy ? 'Procurando no Wi-Fi e no Bluetooth…' : impScan.itens.length ? 'Escolha a sua impressora' : 'Nenhuma impressora encontrada');
      impScan.itens.forEach(function (x, i) {
        h +=
          '<div class="impFd"><span>' + esc(x.nome || 'Impressora térmica') + '<small>' + (x.tipo === 'wifi' ? IMP_WIFI + ' Wi-Fi · ' + esc(x.ip) : IMP_BT + ' Bluetooth') + '</small></span>' +
          '<button type="button" class="impU" data-act="impUsar" data-id="' + i + '">Usar</button></div>';
      });
      if (impScan.busy) h += '<div class="impFd"><span>Procurando mais…</span><span class="impSp" aria-hidden="true"></span></div>';
      if (impScan.aviso) h += '<div class="hint" style="margin:0">' + esc(impScan.aviso) + '</div>';
      if (!impScan.busy && !impScan.itens.length) {
        h += '<div class="hint" style="margin:0">Confira se ela está ligada, no mesmo Wi-Fi do celular ou com o Bluetooth ligado.</div>';
        h += '<button type="button" class="impBp" data-act="impProcurar">' + IMP_LUPA + 'Procurar de novo</button>';
      }
    } else if (imp) {
      var w = impTemWifi(),
        b = impTemBt();
      h += cab(imp.nome || 'Impressora térmica', '<span class="impDot on"></span>Conectada · ' + (w && b ? 'Wi-Fi + Bluetooth' : w ? 'Wi-Fi' : 'Bluetooth'));
      if (w && b) {
        var m = imp.modo || 'auto',
          sb = function (k, t) {
            return '<button type="button" class="cb3' + (m === k ? ' on' : '') + '" data-act="impModo" data-id="' + k + '">' + t + '</button>';
          };
        h += '<div class="impLb">Conexão</div><div class="catbar3 impSeg" role="group" aria-label="Conexão">' + sb('auto', 'Automático') + sb('wifi', 'Só Wi-Fi') + sb('bt', 'Só Bluetooth') + '</div>';
        h += '<div class="hint" id="impModoH" style="margin:0">' + IMP_MODO_H[m] + '</div>';
      }
      h += '<button type="button" class="impBs" data-act="impTeste">' + IMP_REC + 'Imprimir teste</button>';
      h += '<button type="button" class="impBs impDel" data-act="impEsquecer">Esquecer impressora</button>';
    } else {
      h += cab('Impressora', '<span class="impDot"></span>Nenhuma conectada');
      h += '<button type="button" class="impBp" data-act="impProcurar">' + IMP_LUPA + 'Procurar impressora</button>';
    }
    return h + '</section>';
  }
  function impRedesenha() {
    var c = $('impCard');
    if (!c) return;
    var t = document.createElement('div');
    t.innerHTML = impCard();
    c.replaceWith(t.firstChild);
  }
  // Nome parecido = mesma impressora vista pelo Wi-Fi e pelo Bluetooth (ex.: "TM-m30III" e "TM-m30III_A1B2").
  function impMesma(a, b) {
    var n = function (x) {
      return String(x || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    };
    a = n(a);
    b = n(b);
    if (a.length < 4 || b.length < 4) return false;
    return a.indexOf(b.slice(0, 6)) >= 0 || b.indexOf(a.slice(0, 6)) >= 0;
  }
  var IMP_BT_NOME = /print|pos|epson|tm-|xp-|xprinter|ftx|3nstar|rpt|mtp|therm|star|bixolon|citizen|sunmi|zjiang|goojprt|hoin|munbyn|bematech|elgin|daruma|\b(58|80)\b|p58|p80/i;
  ACT.impProcurar = function () {
    var P = impPlugin();
    if (!P) {
      lfaToast('<b>Procurar impressora</b><br>Funciona no app do celular com a versão nova. Por enquanto o comprovante usa a impressão do sistema.');
      return;
    }
    impScan = { busy: true, itens: [], aviso: '' };
    impRedesenha();
    var fim = 0,
      pronto = function () {
        if (++fim === 2 && impScan) {
          impScan.busy = false;
          impRedesenha();
        }
      };
    P.scanWifi({ timeoutMs: 350 })
      .then(function (r) {
        if (!impScan) return;
        (r.itens || []).forEach(function (x) {
          impScan.itens.push({ tipo: 'wifi', nome: x.nome || 'Impressora térmica', ip: x.ip });
        });
        impRedesenha();
      })
      .catch(function () {})
      .then(pronto);
    P.scanBluetooth({ timeoutMs: 8000 })
      .then(function (r) {
        if (!impScan) return;
        (r.itens || [])
          .filter(function (x) {
            return x.impressora || IMP_BT_NOME.test(x.nome || '');
          })
          .forEach(function (x) {
            impScan.itens.push({ tipo: 'bt', nome: x.nome || 'Impressora Bluetooth', address: x.address });
          });
        impRedesenha();
      })
      .catch(function (e) {
        if (impScan) impScan.aviso = String((e && e.message) || 'Bluetooth indisponível') + '. A busca no Wi-Fi continua.';
      })
      .then(pronto);
  };
  ACT.impUsar = function (i) {
    var x = impScan && impScan.itens[+i];
    if (!x) return;
    imp = { nome: x.nome, modo: 'auto' };
    if (x.tipo === 'wifi') imp.ip = x.ip;
    else imp.bt = { address: x.address, nome: x.nome };
    // a mesma impressora no outro caminho entra junto (Automático usa os dois)
    impScan.itens.forEach(function (o) {
      if (o.tipo === x.tipo || !impMesma(o.nome, x.nome)) return;
      if (o.tipo === 'wifi' && !imp.ip) imp.ip = o.ip;
      if (o.tipo === 'bt' && !imp.bt) imp.bt = { address: o.address, nome: o.nome };
    });
    imp.larg = /58/.test(x.nome || '') ? 58 : 80; // o app decide sozinho a largura do papel
    impScan = null;
    impSalvar();
    impRedesenha();
    lfaToast('<b>Impressora conectada</b><br>' + esc(imp.nome));
  };
  ACT.impModo = function (k) {
    if (!imp || !IMP_MODO_H[k]) return;
    imp.modo = k;
    impSalvar();
    document.querySelectorAll('#impCard .impSeg .cb3').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-id') === k);
    });
    var h = $('impModoH');
    if (h) h.textContent = IMP_MODO_H[k];
  };
  ACT.impEsquecer = function () {
    imp = null;
    impSalvar();
    impRedesenha();
  };
  ACT.impTeste = function () {
    var b = document.querySelector('#impCard [data-act=impTeste]');
    if (b) b.disabled = true;
    impEnviar(impBytes(impTesteLinhas()))
      .then(function () {
        lfaToast('<b>Teste enviado</b><br>Confira o papel na impressora.');
      })
      .catch(function (e) {
        lfaToast('<b>A impressora não respondeu</b><br>' + esc((e && e.message) || 'Confira se ela está ligada.'));
      })
      .then(function () {
        if (b) b.disabled = false;
      });
  };
  // Envia os bytes pelo caminho escolhido. Automático: Wi-Fi e, se falhar, Bluetooth.
  function impEnviar(bytes) {
    var P = impPlugin();
    if (!P || !imp) return Promise.reject(new Error('Nenhuma impressora conectada'));
    var data = impB64(bytes),
      modo = imp.modo || 'auto',
      wifi = function () {
        return P.printWifi({ ip: imp.ip, port: 9100, data: data });
      },
      bt = function () {
        return P.printBluetooth({ address: imp.bt.address, data: data });
      };
    if (impTemWifi() && impTemBt()) {
      if (modo === 'wifi') return wifi();
      if (modo === 'bt') return bt();
      return wifi().catch(bt);
    }
    return impTemWifi() ? wifi() : bt();
  }
  function impB64(u8) {
    var s = '';
    for (var i = 0; i < u8.length; i += 4096) s += String.fromCharCode.apply(null, u8.subarray(i, i + 4096));
    return btoa(s);
  }
  // ---- ESC/POS: linhas → bytes (página de código PC850, para os acentos do espanhol) ----
  var IMP_850 = { 'á': 0xa0, 'é': 0x82, 'í': 0xa1, 'ó': 0xa2, 'ú': 0xa3, 'ñ': 0xa4, 'Ñ': 0xa5, 'Á': 0xb5, 'É': 0x90, 'Í': 0xd6, 'Ó': 0xe0, 'Ú': 0xe9, 'ü': 0x81, 'Ü': 0x9a, '¡': 0xad, '¿': 0xa8, 'ç': 0x87, 'Ç': 0x80, 'ã': 0xc6, 'õ': 0xe4, 'â': 0x83, 'ê': 0x88, 'ô': 0x93, 'à': 0x85, '°': 0xf8, 'º': 0xa7, 'ª': 0xa6 };
  function impTxt(t) {
    var o = [];
    String(t).split('').forEach(function (c) {
      var k = c.charCodeAt(0);
      o.push(k < 128 ? k : IMP_850[c] || 0x3f);
    });
    return o;
  }
  // linhas: [{t:'texto' | a/b (esquerda/direita), centro, negrito, grande, traco}]
  function impBytes(linhas) {
    var col = imp && imp.larg === 58 ? 32 : 48,
      o = [0x1b, 0x40, 0x1b, 0x74, 2]; // inicia + PC850
    linhas.forEach(function (l) {
      o.push(0x1b, 0x61, l.centro ? 1 : 0, 0x1b, 0x45, l.negrito ? 1 : 0, 0x1d, 0x21, l.grande ? 0x11 : 0);
      if (l.qr) {
        // QR nativo (GS ( k): modelo 2, módulo 6, correção M
        var d = impTxt(l.qr),
          n = d.length + 3;
        o.push(0x1b, 0x61, 1, 0x1d, 0x28, 0x6b, 4, 0, 0x31, 0x41, 0x32, 0, 0x1d, 0x28, 0x6b, 3, 0, 0x31, 0x43, 6, 0x1d, 0x28, 0x6b, 3, 0, 0x31, 0x45, 0x31);
        o.push(0x1d, 0x28, 0x6b, n & 255, n >> 8, 0x31, 0x50, 0x30);
        o.push.apply(o, d);
        o.push(0x1d, 0x28, 0x6b, 3, 0, 0x31, 0x51, 0x30, 0x0a);
        return;
      }
      var t;
      if (l.traco) t = new Array(col + 1).join('-');
      else if (l.b !== undefined) {
        var a = String(l.a),
          b = String(l.b),
          esp = Math.max(1, col - a.length - b.length);
        t = a.length + b.length + 1 > col ? a + '\n' + new Array(Math.max(1, col - b.length) + 1).join(' ') + b : a + new Array(esp + 1).join(' ') + b;
      } else t = String(l.t || '');
      o.push.apply(o, impTxt(t));
      o.push(0x0a);
    });
    o.push(0x1b, 0x61, 0, 0x1b, 0x45, 0, 0x1d, 0x21, 0, 0x0a, 0x0a, 0x0a, 0x0a, 0x1d, 0x56, 66, 0); // avança e corta
    return new Uint8Array(o);
  }
  // Comprovante aprovado (v5, tudo em espanhol): o mesmo conteúdo de notaHtml.
  function impTicketLinhas(n, fis) {
    var L = [{ t: 'LA FOUCH', centro: 1, negrito: 1, grande: 1 }, { t: 'COMPROBANTE DE VENTA', centro: 1, negrito: 1 }, { traco: 1 }, { t: 'Fecha: ' + fd(n.ts) + ' ' + fh(n.ts) }];
    if (fis) L.push({ t: 'Nombre: ' + n.nombre }, { t: 'RUC: ' + n.ruc });
    L.push({ t: 'Ciudad: ' + n.ciudad }, { t: 'Pago: ' + n.pago }, { traco: 1 });
    n.lineas.forEach(function (x) {
      L.push({ a: x.qty + ' ' + x.desc, b: notaNum(x.tot) });
    });
    L.push({ traco: 1 }, { a: 'TOTAL G$', b: notaNum(n.total), negrito: 1 });
    if (fis) L.push({ a: 'IVA 10% G$', b: notaNum(n.iva) });
    return L;
  }
  function impTesteLinhas() {
    return [{ t: 'LA FOUCH', centro: 1, negrito: 1, grande: 1 }, { t: 'IMPRESIÓN DE PRUEBA', centro: 1, negrito: 1 }, { traco: 1 }, { t: 'Fecha: ' + fd(Date.now()) + ' ' + fh(Date.now()) }, { t: 'Ciudad: CDE' }, { traco: 1 }, { t: 'Impresora lista.', centro: 1 }];
  }
