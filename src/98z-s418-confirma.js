  // ===== S418 (18/11/2026, esboços 110c e 111 aprovados 17/11): regras de confirmação pela consequência =====
  // B = mexe com cliente/site/nuvem/dinheiro ou não tem volta → UMA janela de confirmação (lfConfirma).
  // A = volta fácil e só mexe neste aparelho → faz na hora + "Desfazer".
  // Somem: "tocar de novo", a caixa cinza do navegador e a pergunta dupla.
  // o.k = chave da ação: chamar a mesma ação de novo com a janela aberta confirma (compatível com quem chamava 2×).
  var cfAtual = null;
  function lfConfirma(o) {
    if (o.k && cfAtual && cfAtual.k === o.k) {
      var f = cfAtual;
      cfAtual = null;
      f.api.fecha();
      o.fn();
      return;
    }
    var j = lfJanela({
      titulo: o.t,
      cls: 'lfCf',
      aoFechar: function () {
        if (cfAtual && cfAtual.api === j) cfAtual = null;
      },
      monta: function (c, api) {
        c.innerHTML =
          '<div class="cf418">' +
          (o.q ? '<div class="cf418Q"><span>' + esc(o.q) + (o.d ? '<small>' + esc(o.d) + '</small>' : '') + '</span>' + (o.v ? '<b>' + esc(o.v) + '</b>' : '') + '</div>' : '') +
          '<p class="cf418F">' + (o.nv ? '<b>Não tem volta.</b> ' : '') + esc(o.f || '') + '</p>' +
          '<button type="button" class="cf418B">' + esc(o.b) + '</button>' +
          '<button type="button" class="cf418V">Voltar</button></div>';
        c.querySelector('.cf418B').onclick = function () {
          cfAtual = null;
          api.fecha();
          o.fn();
        };
        c.querySelector('.cf418V').onclick = api.fecha;
      }
    });
    cfAtual = { k: o.k, api: j };
    return j;
  }
  window.__lfConfirma = lfConfirma;
  (function () {
    var A0 = {};
    ['pedcanc', 'pedrecus', 'estorno', 'syncdesl', 'pinoff', 'nvSair', 'bkimp', 'ataCanc', 'ataLoteCanc', 'syncdesc', 'peddel', 'cartclear', 'notifLimpa', 'inicioReset', 'impdel'].forEach(function (k) {
      A0[k] = ACT[k];
    });
    var semConfirm = function (fn) {
      var c0 = window.confirm;
      window.confirm = function () {
        return true;
      };
      try {
        fn();
      } finally {
        window.confirm = c0;
      }
    };
    // ---------- grupo B
    ACT.pedcanc = function (id) {
      var p = pedAch(id);
      if (!p) return;
      var pago = p.pg === 'pago',
        tot = pedTotal(p);
      lfConfirma({
        k: 'pedcanc'+id,
        t: pago ? 'Cancelar o pedido?' : 'Cancelar a reserva?',
        q: p.cli || 'Sem nome',
        d: 'Pedido ' + p.num + (p.pag === 'pix' ? ' · PIX' : p.pag === 'alias' ? ' · Banco Familiar' : ''),
        v: tot ? gs(tot) : '',
        f: pago
          ? 'A peça volta a ficar livre no site e ela vê o pedido cancelado. Combine com ela a devolução do dinheiro.'
          : 'A peça volta a ficar livre no site e ela vê "Cancelado pela loja".',
        b: pago ? 'Cancelar pedido' : 'Cancelar reserva',
        fn: function () {
          A0.pedcanc(id);
        }
      });
    };
    ACT.pedrecus = function (id) {
      var p = pedAch(id);
      if (!p) return;
      var tot = pedTotal(p);
      lfConfirma({
        k: 'pedrecus'+id,
        t: 'Recusar o comprovante?',
        q: p.cli || 'Sem nome',
        d: 'Pedido ' + p.num + (p.pag === 'pix' ? ' · PIX' : ''),
        v: tot ? gs(tot) : '',
        f: 'Ela recebe o aviso no site para mandar outro comprovante. A reserva continua valendo.',
        b: 'Recusar comprovante',
        fn: function () {
          A0.pedrecus(id);
        }
      });
    };
    ACT.estorno = function (id) {
      var s = S.sales.filter(function (x) {
        return x.id === id;
      })[0];
      if (!s || s.estorno) return;
      lfConfirma({
        k: 'estorno'+id,
        t: 'Estornar a venda?',
        q: descOf(s),
        d: s.id + ' · ' + fd(s.ts) + ' às ' + fh(s.ts),
        v: exatoDe(s),
        f: 'A peça volta para o estoque e o valor sai do caixa e dos resultados.',
        nv: 1,
        b: 'Estornar venda',
        fn: function () {
          S.confEst = id;
          A0.estorno(id);
        }
      });
    };
    ACT.syncdesl = function () {
      lfConfirma({
        k: 'syncdesl',
        t: 'Desligar a sincronização?',
        q: 'Este aparelho',
        d: 'para de receber e mandar mudanças',
        f: 'Os outros aparelhos deixam de ver o que for feito aqui. O que já está neste celular continua.',
        b: 'Desligar neste aparelho',
        fn: function () {
          S._syncDel = 1;
          A0.syncdesl();
        }
      });
    };
    ACT.pinoff = function () {
      lfConfirma({
        k: 'pinoff',
        t: 'Tirar o bloqueio do app?',
        f: 'Qualquer pessoa com este celular na mão abre o app sem PIN, com vendas, caixa e clientes.',
        b: 'Tirar o bloqueio',
        fn: function () {
          S.pinOffConf = true;
          A0.pinoff();
        }
      });
    };
    ACT.nvSair = function () {
      var n = S.nuvem || {};
      lfConfirma({
        k: 'nvSair',
        t: 'Desconectar da nuvem?',
        q: n.email || '',
        d: n.ts ? 'última cópia: ' + fd(n.ts) + ' ' + fh(n.ts) : '',
        f: 'A cópia automática para e a cotação da loja deixa de ir para o site. As cópias que já estão na nuvem continuam lá.',
        b: 'Desconectar',
        fn: function () {
          A0.nvSair();
        }
      });
    };
    ACT.bkimp = function () {
      lfConfirma({
        k: 'bkimp',
        t: 'Importar um backup?',
        f: 'Os dados deste aparelho (peças, vendas, caixa, clientes) são trocados pelos do arquivo.',
        nv: 1,
        b: 'Escolher o arquivo',
        fn: function () {
          S.bkImpConf = false;
          bkFile.click();
        }
      });
    };
    ACT.ataCanc = function (id) {
      var c = (S.ataContas || {})[id];
      if (!c) return;
      lfConfirma({
        k: 'ataCanc'+id,
        t: 'Cancelar a conta atacadista?',
        q: c.nome || '',
        d: c.email || '',
        f: 'O acesso ao catálogo de atacado é apagado. Para voltar, só com um convite novo.',
        nv: 1,
        b: 'Cancelar conta',
        fn: function () {
          semConfirm(function () {
            A0.ataCanc(id);
          });
        }
      });
    };
    ACT.ataLoteCanc = function (id) {
      var L = (S.ataLotes || {})[id];
      if (!L) return;
      lfConfirma({
        k: 'ataLote'+id,
        t: 'Encerrar o lote?',
        q: L.nome || 'Lote',
        f: 'O link passa a mostrar "Lote finalizado". As peças separadas voltam para o estoque.',
        b: 'Encerrar lote',
        fn: function () {
          semConfirm(function () {
            A0.ataLoteCanc(id);
          });
        }
      });
    };
    ACT.syncdesc = function (ap) {
      if (!/^AP[A-Z0-9]{2,8}$/.test(ap || '')) return;
      lfConfirma({
        k: 'syncdesc'+ap,
        t: 'Desconectar o aparelho?',
        q: ap,
        f: 'Esse aparelho para de receber as mudanças da loja e perde o acesso à nuvem.',
        b: 'Desconectar',
        fn: function () {
          S._syncDesc = ap;
          A0.syncdesc(ap);
        }
      });
    };
    // ---------- grupo A (faz na hora + Desfazer)
    var copia = function (v) {
      return JSON.parse(JSON.stringify(v == null ? null : v));
    };
    ACT.peddel = function (id) {
      var p = pedAch(id);
      if (!p) return;
      var ix = S.pedidos.indexOf(p),
        vol = copia(p);
      S._pedDel = String(id);
      A0.peddel(id);
      lfDesfazer('Pedido ' + p.num + ' removido', function () {
        S.pedidos.splice(Math.min(ix, S.pedidos.length), 0, vol);
        saveSoon();
        render();
      });
    };
    ACT.cartclear = function () {
      var vol = (S.cart || []).slice();
      A0.cartclear();
      if (vol.length)
        lfDesfazer('Carrinho esvaziado', function () {
          S.cart = vol;
          render();
        });
    };
    ACT.notifLimpa = function () {
      var vol = (S.notifs || []).slice();
      A0.notifLimpa();
      if (vol.length)
        lfDesfazer('Histórico limpo', function () {
          S.notifs = vol;
          saveSoon();
          render();
        });
    };
    ACT.inicioReset = function () {
      var vol = { f: S.inicioFant, t: copia(S.inicioT), b: copia(S.barra), g: copia(S.grupos) };
      A0.inicioReset();
      lfDesfazer('Início voltou ao padrão', function () {
        S.inicioFant = vol.f;
        S.inicioT = vol.t;
        S.barra = vol.b;
        S.grupos = vol.g || [];
        saveSoon();
        render();
      });
    };
    ACT.impdel = function (id) {
      var x = S.imprev[+id];
      if (!x) return;
      var vi = copia(S.imprev),
        vd = copia(S.dlog);
      S._impDel = id;
      A0.impdel(id);
      lfDesfazer('Imprevisto removido', function () {
        S.imprev = vi;
        S.dlog = vd;
        saveSoon();
        render();
      });
    };
  })();
  // S418 (125c): moeda da retirada por toque (no lugar da lista do navegador)
  ACT.rtMoe = function (m) {
    if (!/^(pyg|usd|brl)$/.test(m)) return;
    S.rtMoe = m;
    var i = $('rtM');
    if (i) i.value = m;
    document.querySelectorAll('[data-act=rtMoe]').forEach(function (b) {
      var on = b.getAttribute('data-id') === m;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    });
  };
