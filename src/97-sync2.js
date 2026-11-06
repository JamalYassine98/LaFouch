  // ===== Sincronização, parte 2: aprovação de aparelho novo, registro de atividade (30 dias) e fotos com lixeira (7 dias). =====
  // Telas e animações aprovadas pelo dono em 02/11/2026 (esboços "Animações La Fouch").
  var LFA_IC = {
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
    undo: '<path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/>',
    warn: '<path d="M12 3l10 18H2zM12 10v5M12 18v.5"/>',
    check: '<path d="M4 12l5 5L20 6"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    hourglass: '<path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/>',
    cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.5 12h11L21 7H6"/>',
    box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8"/>',
    cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    glass: '<circle cx="6.5" cy="14" r="4"/><circle cx="17.5" cy="14" r="4"/><path d="M10.5 14h3M2.5 14L4 7M21.5 14L20 7"/>'
  };
  function lfaSvg(n, extra) {
    return '<svg class="lfa-svg" viewBox="0 0 24 24"' + (extra || '') + '>' + (LFA_IC[n] || '') + '</svg>';
  }
  // Aviso que sobe/desce sozinho. pos 'b' = embaixo. Devolve o elemento.
  function lfaToast(html, ms, pos) {
    var b = document.createElement('div');
    b.className = 'lfa-toast' + (pos === 'b' ? ' b' : '');
    b.setAttribute('role', 'status');
    b.innerHTML = html;
    document.body.appendChild(b);
    setTimeout(function () {
      b.classList.add('sai');
      setTimeout(function () {
        if (b.parentNode) b.remove();
      }, 350);
    }, ms || 3500);
    return b;
  }
  // Janela (folha) por cima de tudo, independente do desenho das abas.
  function lfaAbre(id, html, cheia) {
    var o = document.getElementById(id),
      ja = !!(o && !o.classList.contains('sai') && !cheia),
      rolou = 0;
    if (!o) {
      o = document.createElement('div');
      o.id = id;
      document.body.appendChild(o);
    } else if (ja) {
      var sh0 = o.querySelector('.lfa-sh');
      rolou = sh0 ? sh0.scrollTop : 0;
    }
    // já aberta: só troca o conteúdo, sem reiniciar a animação de entrada (nada de "cascata")
    o.className = 'lfa-ov' + (cheia ? ' lfa-full' : '') + (ja ? ' ja' : '');
    o.style.background = '';
    o.innerHTML = '<div class="lfa-sh" role="dialog" aria-modal="true">' + html + '</div>';
    var sh = o.querySelector('.lfa-sh');
    if (rolou) sh.scrollTop = rolou;
    if (!cheia && id !== 'lfa-folha') lfaGestos(o, id);
    return o;
  }
  // Gesto padrão das folhas: arrastar para baixo fecha, tocar no fundo fecha, o fundo nunca rola a página.
  var LFA_FIXAS = { atvOv: 1, apEspera: 1, 'lfa-folha': 1 };
  function lfaGestos(o, id) {
    var sh = o.querySelector('.lfa-sh');
    if (!sh) return;
    var rol = sh.scrollHeight > sh.clientHeight + 2;
    sh.style.touchAction = rol ? 'pan-y' : 'none';
    if (o._gs) return;
    o._gs = 1;
    var y0 = 0, x0 = 0, t0 = 0, dy = 0, on = false, eixo = '';
    o.addEventListener('click', function (e) {
      if (e.target === o && !LFA_FIXAS[id]) lfaFecha(id);
    });
    o.addEventListener('touchmove', function (e) {
      if (e.target === o && e.cancelable) e.preventDefault();
    }, { passive: false });
    o.addEventListener('touchstart', function (e) {
      var s = o.querySelector('.lfa-sh');
      if (!s || e.touches.length !== 1 || (e.target.closest && e.target.closest('input,textarea,select,[contenteditable]'))) return;
      on = !LFA_FIXAS[id] || id === 'atvOv' ? true : false;
      if (!on) return;
      y0 = e.touches[0].clientY; x0 = e.touches[0].clientX; t0 = Date.now(); dy = 0; eixo = '';
      s.style.transition = 'none';
    }, { passive: true });
    o.addEventListener('touchmove', function (e) {
      var s = o.querySelector('.lfa-sh');
      if (!on || !s || LFA_FIXAS[id]) return;
      var y = e.touches[0].clientY - y0, x = e.touches[0].clientX - x0;
      if (!eixo && (Math.abs(x) > 8 || Math.abs(y) > 8)) eixo = Math.abs(y) >= Math.abs(x) && y > 0 && s.scrollTop <= 0 ? 'y' : 'n';
      if (eixo !== 'y') return;
      if (e.cancelable) e.preventDefault();
      s.style.animation = 'none';
      dy = y;
      s.style.transform = 'translate3d(0,' + Math.round(y) + 'px,0)';
      o.style.background = 'rgba(0,0,0,' + (0.62 * (1 - Math.min(1, y / 420))).toFixed(3) + ')';
    }, { passive: false });
    function solta() {
      var s = o.querySelector('.lfa-sh');
      if (!on || !s) return;
      on = false;
      if (eixo !== 'y') { s.style.transition = ''; return; }
      var v = dy / Math.max(1, Date.now() - t0);
      if (dy > 110 || v > 0.6) {
        s.style.transition = 'transform .24s cubic-bezier(.4,0,.2,1)';
        s.style.transform = 'translate3d(0,105%,0)';
        o.style.transition = 'background .24s';
        o.style.background = 'rgba(0,0,0,0)';
        setTimeout(function () { o.remove(); }, REDUCED ? 0 : 230);
      } else {
        s.style.transition = 'transform .3s cubic-bezier(.2,1.25,.35,1)';
        s.style.transform = '';
        o.style.background = '';
      }
    }
    o.addEventListener('touchend', solta);
    o.addEventListener('touchcancel', solta);
  }
  function lfaFecha(id) {
    var o = document.getElementById(id);
    if (!o) return;
    o.classList.add('sai');
    setTimeout(function () {
      if (o.parentNode && o.classList.contains('sai')) o.remove();
    }, 380);
  }
  function lfaSlot(id) {
    var o = document.getElementById(id);
    return o && !o.classList.contains('sai') ? o : null;
  }

  // ================= 1) Aprovação de aparelho novo =================
  // O aparelho novo pede para entrar (st = 'pend' + código de 3 números); um aparelho já aprovado aprova ou recusa.
  // Aviso honesto: todos os aparelhos usam a mesma conta da nuvem; isto é uma trava de uso (o dono confere quem entra), não uma tranca de segurança da conta.
  function apCodigo() {
    return String(100 + Math.floor(Math.random() * 900));
  }
  function apPendentes() {
    return (S._syncAps || []).filter(function (x) {
      return x.st === 'pend' && !x.rev && x.ap !== S.aparelho && Date.now() - x.ts < 86400000;
    });
  }
  var apPollT = 0,
    apEsperaT = 0;
  function apPedeEntrada(depois) {
    if (!S.nuvem || !S.nuvem.rt) return syncMsg('Entre na nuvem primeiro (mais abaixo, em Backup → Nuvem).', 'bad');
    if (!S.aparelho) S.aparelho = 'AP' + Math.random().toString(36).slice(2, 6).toUpperCase();
    S.syncPend = { cod: apCodigo(), ts: Date.now() };
    saveSoon();
    return nvApi(
      'PATCH',
      'backups/zap-' + S.aparelho + '?updateMask.fieldPaths=nome&updateMask.fieldPaths=ts&updateMask.fieldPaths=ap&updateMask.fieldPaths=st&updateMask.fieldPaths=cod&updateMask.fieldPaths=rev',
      JSON.stringify({ fields: { nome: nvStr(S.aparNome || ''), ts: { integerValue: String(Date.now()) }, ap: nvStr(S.aparelho), st: nvStr('pend'), cod: nvStr(S.syncPend.cod), rev: { booleanValue: false } } })
    )
      .then(function () {
        apEsperaMostra();
        apEsperaIni(depois);
      })
      .catch(function (e) {
        S.syncPend = null;
        saveSoon();
        syncMsg('Não consegui pedir para entrar (' + ((e && e.message) || 'erro') + '). Tente de novo.', 'bad');
      });
  }
  function apEsperaHtml(estado, cod) {
    var ok = estado === 'ok';
    return (
      '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:14px;text-align:center;padding:20px">' +
      '<div class="lfa-lg' + (ok ? ' ok' : '') + '"><div class="rg"></div><div class="rg b"></div><div class="c">' +
      (ok ? '<svg viewBox="0 0 24 24" class="lfa-dr"><path d="M4 12l5 5L20 6"/></svg>' : '<svg viewBox="0 0 24 24" class="lfa-sp">' + LFA_IC.hourglass + '</svg>') +
      '</div></div>' +
      '<b style="font:700 22px var(--display)' + (ok ? ';color:var(--ok)' : '') + '">' + (ok ? 'Aprovado!' : 'Aguardando aprovação') + '</b>' +
      '<span class="hint" style="margin:0">' + (ok ? 'Baixando os dados da loja…' : 'O dono precisa aprovar este aparelho. Até lá, nada é enviado nem recebido.') + '</span>' +
      (ok
        ? '<div class="card"><div class="lfa-cnt"><i class="lfa-fill" style="width:100%"></i></div><span class="hint" style="margin:6px 0 0">Sincronizando estoque, vendas e clientes…</span></div>'
        : '<div class="card col" style="align-items:center"><span class="hint" style="margin:0">Mostre este código ao dono</span><div class="lfa-big">' + String(cod || '').split('').join(' ') + '</div></div>' +
          '<button type="button" class="btn" data-act="apcancela" style="width:100%;background:transparent;color:var(--accent-fg);border:1.5px solid var(--accent)">Cancelar pedido</button>') +
      '</div>'
    );
  }
  function apEsperaMostra(estado) {
    lfaAbre('apEspera', apEsperaHtml(estado, S.syncPend && S.syncPend.cod), true);
  }
  function apEsperaIni(depois) {
    clearInterval(apEsperaT);
    var vez = function () {
      if (!S.syncPend) return clearInterval(apEsperaT);
      nvApi('GET', 'backups/zap-' + S.aparelho)
        .then(function (d) {
          var f = (d && d.fields) || {},
            st = (f.st || {}).stringValue,
            rev = !!(f.rev || {}).booleanValue;
          if (rev || st === 'no') {
            clearInterval(apEsperaT);
            S.syncPend = null;
            saveSoon();
            lfaFecha('apEspera');
            syncMsg('O dono não aprovou este aparelho. Nada foi trocado aqui.', 'bad');
          } else if (st === 'ok') {
            clearInterval(apEsperaT);
            S.syncPend = null;
            saveSoon();
            apEsperaMostra('ok');
            setTimeout(function () {
              (depois || syncEntra2)().then(function () {
                lfaFecha('apEspera');
              });
            }, 1300);
          }
        })
        .catch(function () {});
    };
    apEsperaT = setInterval(vez, 4000);
    vez();
  }
  ACT.apcancela = function () {
    clearInterval(apEsperaT);
    var ap = S.aparelho;
    S.syncPend = null;
    saveSoon();
    lfaFecha('apEspera');
    nvApi('PATCH', 'backups/zap-' + ap + '?updateMask.fieldPaths=st&updateMask.fieldPaths=rev', JSON.stringify({ fields: { st: nvStr('no'), rev: { booleanValue: true } } })).catch(function () {});
  };
  // volta a esperar se o app foi fechado no meio do pedido
  setTimeout(function () {
    if (S.syncPend && !S.syncOn && S.nuvem && S.nuvem.rt) {
      apEsperaMostra();
      apEsperaIni();
    }
  }, 3000);
  ACT.apaprova = function (ap) {
    if (!/^AP[A-Z0-9]{2,8}$/.test(ap || '')) return;
    nvApi('PATCH', 'backups/zap-' + ap + '?updateMask.fieldPaths=st&updateMask.fieldPaths=cod', JSON.stringify({ fields: { st: nvStr('ok'), cod: nvStr('') } }))
      .then(function () {
        S._apFlash = ap;
        return syncListaAp();
      })
      .then(function () {
        lfaToast('<span class="lfa-ic">' + lfaSvg('check') + '</span><div><b>Aparelho aprovado</b><div class="hint" style="margin:0">Já está sincronizando.</div></div>', 3000);
      })
      .catch(function () {
        syncMsg('Não consegui aprovar agora (sem internet?). Tente de novo.', 'bad');
      });
  };
  ACT.aprecusa = function (ap) {
    if (!/^AP[A-Z0-9]{2,8}$/.test(ap || '')) return;
    nvApi('PATCH', 'backups/zap-' + ap + '?updateMask.fieldPaths=st&updateMask.fieldPaths=rev', JSON.stringify({ fields: { st: nvStr('no'), rev: { booleanValue: true } } }))
      .then(syncListaAp)
      .catch(function () {
        syncMsg('Não consegui recusar agora (sem internet?). Tente de novo.', 'bad');
      });
  };
  // Procura pedidos novos (a cada cerca de 40 s) e avisa com um toque na tela.
  function apPoll() {
    if (!S.syncOn || document.hidden || Date.now() - apPollT < 40000) return;
    apPollT = Date.now();
    syncListaAp()
      .then(function () {
        S._apAvisados = S._apAvisados || {};
        apPendentes().forEach(function (x) {
          if (S._apAvisados[x.ap]) return;
          S._apAvisados[x.ap] = 1;
          var t = lfaToast('<span class="lfa-ic">' + lfaSvg('phone') + '</span><div style="flex:1"><b>' + esc(x.nome || x.ap) + ' quer entrar</b><div class="hint" style="margin:0">Toque para conferir o código.</div></div>', 9000);
          t.addEventListener('click', function () {
            t.remove();
            S.view = 'ajustes';
            render();
            setTimeout(function () {
              var c = document.getElementById('syncCard');
              if (c && c.scrollIntoView) c.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
          });
        });
      })
      .catch(function () {});
  }
  // Cartão de pedidos pendentes (dentro de Ajustes → Sincronização).
  function apPendHtml() {
    var h = '',
      p = apPendentes();
    if (!p.length) return h;
    S._apVisto = S._apVisto || {};
    h += '<div class="note n-warn" role="status"><b>' + p.length + (p.length === 1 ? ' aparelho quer entrar' : ' aparelhos querem entrar') + '</b><div>Confira se o código é o mesmo que aparece no aparelho novo.</div></div>';
    p.forEach(function (x) {
      var novo = !S._apVisto[x.ap];
      S._apVisto[x.ap] = 1;
      h +=
        '<div class="card col' + (novo ? ' lfa-exp' : '') + '" style="background:var(--panel2)"><div style="display:flex;gap:10px;align-items:center"><span class="lfa-ic">' + lfaSvg('phone') + '</span><div><b>' + esc(x.nome || x.ap) + '</b><div class="hint" style="margin:0">pediu ' + fh(x.ts) + '</div></div></div>' +
        '<div class="lfa-big">' + String(x.cod || '').split('').join(' ') + '</div>' +
        '<div style="display:flex;gap:8px"><button type="button" class="btn lfa-pr" data-act="apaprova" data-id="' + esc(x.ap) + '" style="flex:1">Aprovar</button><button type="button" class="btn lfa-pr" data-act="aprecusa" data-id="' + esc(x.ap) + '" style="flex:1;background:transparent;color:var(--accent-fg);border:1.5px solid var(--accent)">Recusar</button></div></div>';
    });
    return h;
  }

  // ================= 2) Atividade por aparelho (últimos 30 dias) =================
  var ATV_DIAS = 30,
    ATV_MAX = 2000;
  var ATV_CFG = { pprice: 'preços das peças', faixas: 'faixas de preço', pfaixa: 'faixa dos produtos', metaUsd: 'meta do mês', metaDia: 'meta do dia', diasLoja: 'dias de loja', colchUsd: 'colchão do caixa', tolUsd: 'tolerância do caixa', volume: 'volume', formas: 'formas de pagamento', notaCidade: 'cidade da nota', cat2: 'categorias', tiposX: 'tipos', tiposDel: 'tipos', tiposOrd: 'ordem dos tipos', pnome: 'nomes dos produtos', desc: 'descrições', attr: 'atributos', faixaAuto: 'faixas automáticas', ini: 'início', site: 'dados do site', fxc: 'câmbio da loja' };
  var ATV_LISTA = { exp: ['c', 'Despesa'], retiradas: ['c', 'Retirada'], cambios: ['c', 'Câmbio de moeda'], cpay: ['c', 'Pagamento'], imprev: ['c', 'Imprevisto'], compras: ['e', 'Compra de mercadoria'], descartes: ['e', 'Descartou peça'], melhUso: ['e', 'Usou material'], fechos: ['c', 'Fechou o dia'] };
  function atvNum(v) {
    return typeof v === 'number' && isFinite(v) ? gs(v) : '';
  }
  // Converte um movimento em uma linha legível. Devolve null para o que não deve aparecer.
  function atvDe(o, vendidos) {
    if (!o || !o.i) return null;
    var r = { i: o.i, ts: o.ts || Date.now(), ap: o.a, t: 'x', v: '', b: '', s: '' };
    if (o.k === 'add' && o.l === 'sales') {
      var e = o.e || {};
      r.t = 'v';
      r.ts = e.ts || r.ts;
      r.v = e.estorno ? 'Estornou ' : 'Vendeu ';
      r.b = descOf(e);
      r.s = atvNum(e.price);
    } else if (o.k === 'add' && ATV_LISTA[o.l]) {
      var m = ATV_LISTA[o.l],
        x = o.e || {};
      r.t = m[0];
      r.v = m[1] + ' ';
      r.b = String(x.nome || x.n || x.desc || x.d || x.ref || (o.l === 'fechos' ? x.id : '') || '').slice(0, 40);
      r.s = atvNum(x.valor != null ? x.valor : x.val != null ? x.val : x.v) || String(x.nota || '').slice(0, 40);
    } else if (o.k === 'q') {
      var ref = String(o.c || '').split('|')[1] || '';
      if (o.d < 0 && vendidos && vendidos[o.a + '|' + ref]) return null; // a baixa de uma venda já aparece na venda
      r.t = 'e';
      r.v = o.d > 0 ? 'Entrada de ' : 'Saída de ';
      r.b = Math.abs(o.d) + ' · ' + ref;
    } else if (o.k === 'cfg') {
      r.t = o.n === 'pprice' || o.n === 'faixas' || o.n === 'pfaixa' ? 'p' : 'x';
      if (o.n === 'pprice') return null; // preços entram pela comparação (atvPrecos), com o valor antigo e o novo
      r.v = 'Mudou ';
      r.b = ATV_CFG[o.n] || o.n;
    } else if ((o.k === 'put' || o.k === 'del') && o.l) {
      var y = o.e || {};
      r.v = o.k === 'del' ? 'Apagou ' : 'Salvou ';
      r.b = o.l === 'clientes' ? 'cliente ' + String(y.nome || y.name || o.id || '') : o.l === 'pedidos' ? 'pedido do site ' + String(y.ref || y.num || o.id || '') : 'lista de espera';
    } else if (o.k === 'rem' && o.l) {
      r.t = o.l === 'sales' ? 'v' : ATV_LISTA[o.l] ? ATV_LISTA[o.l][0] : 'x';
      r.v = 'Apagou ';
      r.b = o.l === 'sales' ? 'a venda ' + o.h : 'um registro (' + o.l + ')';
    } else return null;
    return r;
  }
  function atvAdd(ops) {
    if (!ops || !ops.length) return;
    S.atv = S.atv || [];
    var vendidos = {},
      tem = {};
    S.atv.forEach(function (x) {
      tem[x.i] = 1;
    });
    ops.forEach(function (o) {
      if (o && o.k === 'add' && o.l === 'sales' && o.e) vendidos[o.a + '|' + o.e.ref] = 1;
    });
    ops.forEach(function (o) {
      var r = o && !tem[o.i] ? atvDe(o, vendidos) : null;
      if (r) {
        S.atv.push(r);
        tem[r.i] = 1;
      }
    });
    var corte = Date.now() - ATV_DIAS * 86400000;
    S.atv = S.atv
      .filter(function (x) {
        return x.ts >= corte;
      })
      .sort(function (a, b) {
        return b.ts - a.ts;
      })
      .slice(0, ATV_MAX);
  }
  // Preço de peça mudou (com o valor antigo e o novo). ap = quem mudou.
  function atvPrecos(ap, ts) {
    var novo = S.pprice || {},
      ant = S.atvPp;
    S.atvPp = JSON.parse(JSON.stringify(novo));
    if (!ant || !ap) return;
    S.atv = S.atv || [];
    Object.keys(novo).forEach(function (ref) {
      var a = (ant[ref] || {}).nu,
        b = (novo[ref] || {}).nu;
      if (b != null && a !== b) S.atv.unshift({ i: 'pp-' + ref + '-' + ts, ts: ts, ap: ap, t: 'p', v: 'Preço ', b: ref, s: (a != null ? 'US$ ' + a + ' → ' : 'novo: ') + 'US$ ' + b });
    });
  }
  function atvCiclo(remotos, meus) {
    atvAdd(remotos);
    atvAdd(meus);
    var rp = (remotos || []).filter(function (o) {
        return o && o.k === 'cfg' && o.n === 'pprice';
      }),
      mp = (meus || []).filter(function (o) {
        return o && o.k === 'cfg' && o.n === 'pprice';
      });
    if (rp.length || mp.length) atvPrecos((rp[rp.length - 1] || mp[mp.length - 1]).a, Date.now());
    else if (!S.atvPp) S.atvPp = JSON.parse(JSON.stringify(S.pprice || {}));
  }
  var ATV_FILTROS = [['', 'Tudo'], ['v', 'Vendas'], ['e', 'Estoque'], ['c', 'Caixa'], ['p', 'Preços']];
  var ATV_ICO = { v: 'cart', e: 'box', c: 'cash', p: 'tag', x: 'gear' };
  function atvDia(ts) {
    var k = dayKey(ts),
      h = dayKey(Date.now()),
      o = dayKey(Date.now() - 86400000);
    return k === h ? 'HOJE' : k === o ? 'ONTEM' : fd(ts);
  }
  function atvListaHtml(ap, filtro, peca) {
    var L = (S.atv || []).filter(function (x) {
      if (ap && x.ap !== ap) return false;
      if (peca && String(x.b).indexOf(peca) < 0) return false;
      return !filtro || x.t === filtro;
    });
    if (!L.length) return '<div class="hint" style="margin:10px 0">Nada registrado ainda' + (filtro ? ' neste filtro' : '') + '. O registro guarda os últimos 30 dias, a partir de quando a sincronização foi ligada.</div>';
    var h = '',
      dia = '',
      n = 0;
    L.slice(0, 120).forEach(function (x) {
      var d = atvDia(x.ts);
      if (d !== dia) {
        dia = d;
        h += '<div class="hint" style="margin:8px 0 0;font-weight:700;letter-spacing:1px">' + esc(d) + '</div>';
      }
      h +=
        '<div class="lfa-lin lfa-in" style="--d:' + Math.min(n++, 12) * 0.04 + 's"><span class="hint" style="margin:0;width:38px;flex:none">' + fh(x.ts) + '</span><span class="lfa-ic">' + lfaSvg(ATV_ICO[x.t] || 'gear') + '</span><div style="min-width:0;flex:1">' +
        (ap ? '' : '<span style="color:var(--accent-fg);font-weight:700">' + esc(apNome(x.ap)) + '</span> ') +
        esc(x.v) + '<b>' + esc(x.b) + '</b>' + (x.s ? '<div class="hint" style="margin:0">' + esc(x.s) + '</div>' : '') + '</div></div>';
    });
    return h;
  }
  function atvAbre(ap) {
    S._atvAp = ap || '';
    S._atvF = S._atvF || '';
    atvDesenha();
  }
  function atvDesenha() {
    var ap = S._atvAp,
      f = S._atvF || '';
    var h = '<div style="display:flex;align-items:center;gap:10px"><b style="font:700 19px var(--display);flex:1">' + (ap ? esc(apNome(ap)) : 'Atividade') + '</b><button type="button" class="pdLink" data-act="atvfecha">Fechar</button></div>';
    h += '<div class="lfa-chips">' +
      ATV_FILTROS.map(function (c) {
        return '<button type="button" class="chip' + (f === c[0] ? ' on' : '') + '" data-act="atvfiltro" data-id="' + c[0] + '" style="transition:background .25s,border-color .25s">' + c[1] + '</button>';
      }).join('') + '</div>';
    h += '<div class="card" style="padding:4px 12px;min-height:120px">' + atvListaHtml(ap, f) + '</div>';
    var o = lfaSlot('atvOv');
    if (o) {
      var sh = o.firstChild;
      sh.style.animation = 'none';
      sh.innerHTML = h;
    } else lfaAbre('atvOv', h);
  }
  ACT.atvfiltro = function (f) {
    S._atvF = f || '';
    atvDesenha();
  };
  ACT.atvfecha = function () {
    lfaFecha('atvOv');
  };
  // histórico dentro da ficha da peça
  function atvPecaHtml(ref) {
    if (!S.syncOn) return '';
    var L = (S.atv || []).filter(function (x) {
      return String(x.b).split(' · ').pop() === ref || (x.t === 'p' && x.b === ref);
    });
    if (!L.length) return '';
    var h = '<section class="card col"><h2 style="margin:0;font-size:16px">Histórico da peça</h2>';
    L.slice(0, 8).forEach(function (x) {
      h += '<div class="lfa-lin"><span class="hint" style="margin:0;width:44px;flex:none">' + esc(atvDia(x.ts) === 'HOJE' ? fh(x.ts) : fd(x.ts)) + '</span><span class="lfa-ic">' + lfaSvg(ATV_ICO[x.t] || 'gear') + '</span><div><span style="color:var(--accent-fg);font-weight:700">' + esc(apNome(x.ap)) + '</span> ' + esc(x.v.toLowerCase()) + (x.t === 'e' ? esc(x.b.split(' · ')[0]) : '') + (x.s ? '<div class="hint" style="margin:0">' + esc(x.s) + '</div>' : '') + '</div></div>';
    });
    return h + '</section>';
  }
  window.__atvPecaHtml = atvPecaHtml;

  // ================= 3) Fotos entre aparelhos: trocar e apagar se espalham; apagar vai para a lixeira (7 dias, no máximo 10) =================
  var FOTO_IDX = 'backups/zfotos-idx',
    FOTO_DIAS = 7,
    FOTO_MAX = 10,
    FOTO_JANELA = FOTO_DIAS * 86400000;
  var fotoIdxMem = {},
    fotoBusy = false,
    fotoUndo = null;
  function fotoId(k) {
    var h = 5381,
      i;
    for (i = 0; i < k.length; i++) h = ((h * 33) ^ k.charCodeAt(i)) >>> 0;
    return 'zf-' + h.toString(36) + k.length.toString(36);
  }
  function fotoHashSync(d) {
    var h = d.length,
      i;
    for (i = 0; i < d.length; i += 97) h = (h * 31 + d.charCodeAt(i)) >>> 0;
    return h.toString(36) + ':' + d.length;
  }
  function fotoNorm(m) {
    var o = {};
    Object.keys(m || {}).forEach(function (k) {
      var e = m[k];
      if (typeof e === 'string') e = { i: e, v: 0, t: 0 };
      if (e && typeof e === 'object' && e.i) o[k] = e;
    });
    return o;
  }
  function fotoIdxLe() {
    return nvApi('GET', FOTO_IDX)
      .then(function (d) {
        try {
          return fotoNorm(JSON.parse(((d.fields || {}).m || {}).stringValue || '{}'));
        } catch (e) {
          return {};
        }
      })
      .catch(function (e) {
        if (e && e.status === 404) return {};
        throw e; // erro de verdade: não finge que o índice está vazio
      });
  }
  // grava só as chaves alteradas (alt[k] = entrada nova, ou null para retirar), juntando com o que outro aparelho tenha mexido
  function fotoIdxGrava(alt) {
    return fotoIdxLe().then(function (atual) {
      Object.keys(alt).forEach(function (k) {
        if (alt[k] === null) delete atual[k];
        else if (!atual[k] || (alt[k].t || 0) >= (atual[k].t || 0)) atual[k] = alt[k];
      });
      fotoIdxMem = atual;
      return nvApi('PATCH', FOTO_IDX, JSON.stringify({ fields: { m: nvStr(JSON.stringify(atual)), ts: { integerValue: String(Date.now()) } } }));
    });
  }
  function fotoLixeira() {
    var agora = Date.now();
    return Object.keys(fotoIdxMem)
      .filter(function (k) {
        var e = fotoIdxMem[k];
        return e.del && agora - e.del < FOTO_JANELA;
      })
      .map(function (k) {
        return { k: k, e: fotoIdxMem[k] };
      })
      .sort(function (a, b) {
        return b.e.del - a.e.del;
      });
  }
  function fotoNomeK(k) {
    var p = k.split('|');
    return p[0] + (p[1] ? ' · ' + p[1] : '');
  }
  function fotoCiclo() {
    if (!S.syncOn || fotoBusy || !S.nuvem || !S.nuvem.rt || navigator.onLine === false || document.hidden) return Promise.resolve(0);
    fotoBusy = true;
    var feitas = 0,
      agora = Date.now(),
      avisos = [];
    S.fotosH = S.fotosH || {};
    S.fotosV = S.fotosV || {};
    S.fotosRest = S.fotosRest || {};
    return fotoIdxLe()
      .then(function (idx) {
        var alt = {},
          job = Promise.resolve(),
          baixar = [],
          subir = [],
          locais = [];
        // 1) lixeira vencida: some de vez
        Object.keys(idx).forEach(function (k) {
          var e = idx[k];
          if (e.del && agora - e.del >= FOTO_JANELA) {
            job = job.then(function () {
              return nvApi('DELETE', 'backups/' + e.i).catch(function () {});
            });
            delete idx[k];
            alt[k] = null;
            delete S.fotosH[k];
            delete S.fotosV[k];
          }
        });
        // 2) o que os outros fizeram (apagar, restaurar, trocar, foto nova)
        Object.keys(idx).forEach(function (k) {
          var e = idx[k],
            local = S.fotos[k];
          if (e.del) {
            if (local && S.fotosH[k] !== undefined) {
              if (S.fotosRest[k]) {
                // restaurei esta foto aqui: avisa os outros
                var n = { i: e.i, v: agora, t: agora, by: S.aparelho };
                idx[k] = n;
                alt[k] = n;
                delete S.fotosRest[k];
                S.fotosV[k] = agora;
                S.fotosH[k] = fotoHashSync(local);
              } else {
                delete S.fotos[k]; // outro aparelho apagou: sai daqui também (fica na lixeira da nuvem)
                delete S.fotosH[k];
                delete S.fotosV[k];
                feitas++;
              }
            } else if (local) subir.push(k); // foto nova com o mesmo nome de uma apagada
            return;
          }
          delete S.fotosRest[k];
          if (!local) {
            if (S.fotosH[k] !== undefined) locais.push(k); // eu apaguei aqui
            else baixar.push(k);
          } else if (S.fotosH[k] === undefined) {
            S.fotosH[k] = fotoHashSync(local); // primeira vez que vejo: considero igual
            S.fotosV[k] = e.v || 0;
          } else if ((e.v || 0) > (S.fotosV[k] || 0) && fotoHashSync(local) === S.fotosH[k]) baixar.push(k); // trocada em outro aparelho
        });
        // 3) o que eu apaguei aqui vai para a lixeira (sem exagero: muita coisa sumindo de uma vez não é apagar foto)
        if (locais.length > FOTO_MAX) {
          locais.forEach(function (k) {
            delete S.fotosH[k]; // volta a baixar, em vez de espalhar uma limpeza em massa
          });
        } else {
          var cheia = fotoLixeiraDe(idx).length;
          locais.forEach(function (k) {
            var e = idx[k];
            if (cheia < FOTO_MAX) {
              var n = { i: e.i, v: e.v || 0, t: agora, by: S.aparelho, del: agora };
              idx[k] = n;
              alt[k] = n;
              cheia++;
            } else {
              job = job.then(function () {
                return nvApi('DELETE', 'backups/' + e.i).catch(function () {});
              });
              delete idx[k];
              alt[k] = null;
            }
            delete S.fotosH[k];
            delete S.fotosV[k];
          });
        }
        // 4) fotos minhas novas ou trocadas
        Object.keys(S.fotos).forEach(function (k) {
          var d = S.fotos[k];
          if (!d || typeof d !== 'string' || d.length >= 700000) return;
          var e = idx[k];
          if (!e || e.del) {
            if (!e || S.fotosH[k] === undefined) {
              if (subir.indexOf(k) < 0) subir.push(k);
            }
            return;
          }
          if (S.fotosH[k] !== undefined && S.fotosH[k] !== fotoHashSync(d) && baixar.indexOf(k) < 0) {
            if ((e.v || 0) > (S.fotosV[k] || 0)) return; // trocaram nos dois lados: vale a que já está na nuvem
            if (subir.indexOf(k) < 0) subir.push(k);
          }
        });
        subir.slice(0, 3).forEach(function (k) {
          job = job.then(function () {
            var id = fotoId(k),
              d = S.fotos[k],
              ve = Date.now();
            return nvApi('PATCH', 'backups/' + id, JSON.stringify({ fields: { k: nvStr(k), d: nvStr(d), ts: { integerValue: String(ve) } } })).then(function () {
              var n = { i: id, v: ve, t: ve, by: S.aparelho };
              idx[k] = n;
              alt[k] = n;
              S.fotosH[k] = fotoHashSync(d);
              S.fotosV[k] = ve;
              feitas++;
            });
          });
        });
        baixar.slice(0, 3).forEach(function (k) {
          job = job.then(function () {
            var e = idx[k],
              tinha = !!S.fotos[k];
            return nvApi('GET', 'backups/' + e.i).then(function (d) {
              var v = ((d.fields || {}).d || {}).stringValue;
              if (v && v.indexOf('data:image/') === 0) {
                S.fotos[k] = v;
                S.fotosH[k] = fotoHashSync(v);
                S.fotosV[k] = e.v || 0;
                feitas++;
                if (tinha && e.by && e.by !== S.aparelho) avisos.push('<span class="lfa-ic">' + lfaSvg('glass') + '</span><div><b>Foto de ' + esc(fotoNomeK(k)) + ' atualizada</b><div class="hint" style="margin:0">por ' + esc(apNome(e.by)) + '</div></div>');
              }
            });
          });
        });
        return job.then(function () {
          fotoIdxMem = idx;
          if (Object.keys(alt).length) return fotoIdxGrava(alt);
        });
      })
      .then(function () {
        if (feitas) {
          saveSoon();
          if (S.view === 'estoque' || S.view === 'vendas') render();
        }
        avisos.slice(0, 2).forEach(function (a) {
          lfaToast(a, 3500);
        });
        return feitas;
      })
      .catch(function () {
        return 0;
      })
      .then(function (n) {
        fotoBusy = false;
        return n;
      });
  }
  function fotoLixeiraDe(idx) {
    var agora = Date.now();
    return Object.keys(idx).filter(function (k) {
      return idx[k].del && agora - idx[k].del < FOTO_JANELA;
    });
  }
  window.__fotoCiclo = fotoCiclo;
  window.__fotoEstado = function () {
    return { idx: fotoIdxMem, lix: fotoLixeira().length, undo: !!fotoUndo };
  };
  setInterval(fotoCiclo, 180000);
  setTimeout(fotoCiclo, 20000);
  // Apagar a foto de uma peça (chamado pelo botão "Excluir foto" quando a sincronização está ligada)
  window.__fotoApagaPede = function (k) {
    if (!S.syncOn) return false;
    var cheia = fotoLixeira().length >= FOTO_MAX;
    var h = cheia
      ? '<b style="font:700 18px var(--display)">Lixeira cheia</b><div class="lfa-cnt f"><i class="lfa-amb" style="width:100%"></i></div><span class="hint" style="margin:0">Já são ' + fotoLixeira().length + ' fotos apagadas. Para proteger contra engano, esvazie a lixeira antes de apagar mais.</span><div class="lfa-shk" style="display:none"></div>' +
        '<button type="button" class="btn lfa-pr" data-act="fotolixabre" style="width:100%">Ir para a lixeira</button><button type="button" class="btn lfa-pr" data-act="fotosheetfecha" style="width:100%;background:transparent;color:var(--accent-fg);border:1.5px solid var(--accent)">Cancelar</button>'
      : '<b style="font:700 18px var(--display)">Apagar esta foto?</b><span class="hint" style="margin:0">Ela some de <b>todos os aparelhos</b> e fica ' + FOTO_DIAS + ' dias na lixeira. Dá para restaurar em Ajustes → Fotos apagadas.</span>' +
        '<div class="note n-info"><span class="lfa-ic" style="width:22px;height:22px">' + lfaSvg('trash') + '</span>Lixeira: ' + fotoLixeira().length + ' de ' + FOTO_MAX + ' fotos</div>' +
        '<button type="button" class="btn lfa-pr" data-act="fotoapaga" data-id="' + esc(encodeURIComponent(k)) + '" style="width:100%;background:#c0392b;border:1.5px solid #c0392b;color:#fff">Apagar em todos</button><button type="button" class="btn lfa-pr" data-act="fotosheetfecha" style="width:100%;background:transparent;color:var(--accent-fg);border:1.5px solid var(--accent)">Cancelar</button>';
    var o = lfaAbre('fotoSheet', h);
    if (cheia) o.firstChild.classList.add('lfa-shk');
    return true;
  };
  ACT.fotosheetfecha = function () {
    lfaFecha('fotoSheet');
  };
  ACT.fotoapaga = function (kk) {
    var k = decodeURIComponent(kk || '');
    if (!k || !S.fotos[k]) return lfaFecha('fotoSheet');
    fotoUndo = { k: k, d: S.fotos[k] };
    delete S.fotos[k];
    S.fDel = false;
    saveSoon();
    lfaFecha('fotoSheet');
    render();
    setTimeout(fotoCiclo, 6000);
    var t = lfaToast('<span class="lfa-ic">' + lfaSvg('trash') + '</span><div style="flex:1"><b>Foto na lixeira</b><div class="cd" style="--cd:5s"></div></div><button type="button" class="pdLink" data-act="fotodesfaz" style="font-weight:700">Desfazer</button>', 5000, 'b');
    t.setAttribute('data-foto-toast', '1');
  };
  ACT.fotodesfaz = function () {
    if (!fotoUndo) return;
    S.fotos[fotoUndo.k] = fotoUndo.d;
    S.fotosRest = S.fotosRest || {};
    S.fotosRest[fotoUndo.k] = 1;
    fotoUndo = null;
    saveSoon();
    [].forEach.call(document.querySelectorAll('[data-foto-toast]'), function (x) {
      x.remove();
    });
    lfaToast('<span class="lfa-ic">' + lfaSvg('undo') + '</span><div><b>Foto restaurada</b></div>', 2500, 'b');
    render();
    fotoCiclo();
  };
  // ---- tela "Fotos apagadas"
  var fotoThumbs = {};
  function fotoLixHtml() {
    var L = fotoLixeira(),
      h = '<div style="display:flex;align-items:center;gap:10px"><b style="font:700 19px var(--display);flex:1">Fotos apagadas</b><button type="button" class="pdLink" data-act="fotolixfecha">Fechar</button></div>';
    h += '<div class="card col"><div style="display:flex;justify-content:space-between"><b>Lixeira</b><span class="hint" style="margin:0" id="lixCnt">' + L.length + ' de ' + FOTO_MAX + '</span></div><div class="lfa-cnt' + (L.length >= FOTO_MAX ? ' f' : '') + '"><i style="width:' + (L.length * 100) / FOTO_MAX + '%"></i></div><span class="hint" style="margin:0">Cada foto some sozinha depois de ' + FOTO_DIAS + ' dias.</span></div>';
    if (!L.length) h += '<div class="card" style="text-align:center"><span class="lfa-ic" style="width:40px;height:40px;color:var(--ok)">' + lfaSvg('check') + '</span><div><b>Lixeira vazia</b></div></div>';
    else {
      h += '<div class="card" style="padding:4px 12px">';
      L.forEach(function (x, i) {
        var dias = Math.max(0, Math.ceil((x.e.del + FOTO_JANELA - Date.now()) / 86400000)),
          th = fotoThumbs[x.k];
        h +=
          '<div class="lfa-lin lfa-in" id="lx' + i + '" style="--d:' + Math.min(i, 8) * 0.05 + 's">' +
          (th ? '<img class="lfa-foto" src="' + th + '" alt="">' : '<span class="lfa-foto">' + lfaSvg('glass') + '</span>') +
          '<div style="flex:1;min-width:0"><b>' + esc(fotoNomeK(x.k)) + '</b><div class="hint" style="margin:0">apagada por ' + esc(apNome(x.e.by)) + ' · ' + fh(x.e.del) + '</div></div>' +
          '<div style="text-align:right;white-space:nowrap"><button type="button" class="pdLink lfa-pr" data-act="fotorest" data-id="' + esc(encodeURIComponent(x.k)) + '" style="font-weight:700">Restaurar</button><div class="hint" style="margin:0">' + dias + (dias === 1 ? ' dia' : ' dias') + '</div></div></div>';
      });
      h += '</div><button type="button" class="btn lfa-pr" data-act="fotolixvaz" style="width:100%;background:transparent;color:var(--accent-fg);border:1.5px solid var(--accent)">Esvaziar lixeira</button>';
    }
    return h;
  }
  function fotoLixDesenha(sem) {
    var o = lfaSlot('fotoLix');
    if (o) {
      o.firstChild.style.animation = 'none';
      o.firstChild.innerHTML = fotoLixHtml();
    } else lfaAbre('fotoLix', fotoLixHtml());
    // miniaturas: baixa as que faltam (até 10 fotos)
    if (!sem)
      fotoLixeira().forEach(function (x) {
        if (fotoThumbs[x.k]) return;
        nvApi('GET', 'backups/' + x.e.i)
          .then(function (d) {
            var v = ((d.fields || {}).d || {}).stringValue;
            if (v && v.indexOf('data:image/') === 0) {
              fotoThumbs[x.k] = v;
              if (lfaSlot('fotoLix')) fotoLixDesenha(true);
            }
          })
          .catch(function () {});
      });
  }
  ACT.fotolixabre = function () {
    lfaFecha('fotoSheet');
    fotoIdxLe()
      .then(function (idx) {
        fotoIdxMem = idx;
      })
      .catch(function () {})
      .then(function () {
        fotoLixDesenha();
      });
  };
  ACT.fotolixfecha = function () {
    lfaFecha('fotoLix');
  };
  ACT.fotorest = function (kk) {
    var k = decodeURIComponent(kk || ''),
      e = fotoIdxMem[k];
    if (!e) return;
    var pronta = function (v) {
      S.fotos[k] = v;
      S.fotosRest = S.fotosRest || {};
      S.fotosRest[k] = 1;
      S.fotosH = S.fotosH || {};
      if (S.fotosH[k] === undefined) S.fotosH[k] = fotoHashSync(v);
      saveSoon();
      var linha = document.querySelector('[data-id="' + esc(encodeURIComponent(k)) + '"]');
      if (linha && linha.closest('.lfa-lin')) linha.closest('.lfa-lin').classList.add('lfa-col');
      setTimeout(function () {
        delete fotoIdxMem[k]; // some da lista já; a nuvem atualiza no próximo ciclo
        var n = { i: e.i, v: Date.now(), t: Date.now(), by: S.aparelho };
        fotoIdxMem[k] = n;
        fotoIdxGrava((function () {
          var a = {};
          a[k] = n;
          return a;
        })()).catch(function () {});
        S.fotosV = S.fotosV || {};
        S.fotosV[k] = n.v;
        delete S.fotosRest[k];
        if (lfaSlot('fotoLix')) fotoLixDesenha(true);
        lfaToast('<span class="lfa-ic" style="color:var(--ok)">' + lfaSvg('undo') + '</span><div><b>Foto restaurada</b><div class="hint" style="margin:0">Voltou para todos os aparelhos</div></div>', 3000, 'b');
        render();
      }, 450);
    };
    if (fotoThumbs[k]) return pronta(fotoThumbs[k]);
    nvApi('GET', 'backups/' + e.i)
      .then(function (d) {
        var v = ((d.fields || {}).d || {}).stringValue;
        if (v && v.indexOf('data:image/') === 0) pronta(v);
        else lfaToast('<div><b>Não achei esta foto na nuvem.</b></div>', 3000, 'b');
      })
      .catch(function () {
        lfaToast('<div><b>Sem internet para restaurar agora.</b></div>', 3000, 'b');
      });
  };
  // esvaziar: confirmação reforçada (digitar ESVAZIAR)
  ACT.fotolixvaz = function () {
    var L = fotoLixeira();
    if (!L.length) return;
    lfaAbre(
      'fotoVaz',
      '<b style="font:700 18px var(--display)">Esvaziar a lixeira?</b><div class="note n-bad"><span class="lfa-ic" style="width:22px;height:22px">' + lfaSvg('warn') + '</span><div><b>Não tem volta.</b> ' + (L.length === 1 ? 'A foto some' : 'As ' + L.length + ' fotos somem') + ' de vez em todos os aparelhos.</div></div>' +
        '<span class="hint" style="margin:0">Para confirmar, digite <b>ESVAZIAR</b>:</span><input class="in" id="vazIn" autocomplete="off" autocapitalize="characters" style="text-align:center;letter-spacing:3px;font-weight:700">' +
        '<button type="button" class="btn lfa-pr" id="vazBt" data-act="fotovazok" style="width:100%;background:#c0392b;border:1.5px solid #c0392b;color:#fff;opacity:.4;transition:opacity .3s" disabled>Esvaziar agora</button><button type="button" class="btn lfa-pr" data-act="fotovazfecha" style="width:100%;background:transparent;color:var(--accent-fg);border:1.5px solid var(--accent)">Cancelar</button>'
    );
    var inp = document.getElementById('vazIn');
    if (inp)
      inp.addEventListener('input', function () {
        var ok = /^\s*esvaziar\s*$/i.test(inp.value),
          b = document.getElementById('vazBt');
        if (b) {
          b.disabled = !ok;
          b.style.opacity = ok ? '1' : '.4';
        }
        inp.style.borderColor = ok ? 'var(--accent)' : '';
      });
  };
  ACT.fotovazfecha = function () {
    lfaFecha('fotoVaz');
  };
  ACT.fotovazok = function () {
    var inp = document.getElementById('vazIn');
    if (!inp || !/^\s*esvaziar\s*$/i.test(inp.value)) return;
    var L = fotoLixeira(),
      alt = {},
      job = Promise.resolve();
    lfaFecha('fotoVaz');
    L.forEach(function (x, i) {
      var el = document.getElementById('lx' + i);
      if (el) {
        el.style.setProperty('--d', i * 0.15 + 's');
        el.className = 'lfa-lin lfa-col';
      }
      alt[x.k] = null;
      job = job.then(function () {
        return nvApi('DELETE', 'backups/' + x.e.i).catch(function () {});
      });
    });
    job
      .then(function () {
        return fotoIdxGrava(alt);
      })
      .then(function () {
        L.forEach(function (x) {
          delete fotoIdxMem[x.k];
          delete fotoThumbs[x.k];
        });
        setTimeout(function () {
          if (lfaSlot('fotoLix')) fotoLixDesenha(true);
        }, 300 + L.length * 150);
      })
      .catch(function () {
        lfaToast('<div><b>Não consegui esvaziar agora.</b> Tente de novo.</div>', 3500, 'b');
      });
  };
  if (/#test/.test(location.hash))
    window.__sync2 = { atvDe: atvDe, atvAdd: atvAdd, atvPrecos: atvPrecos, atvCiclo: atvCiclo, atvLista: atvListaHtml, pend: apPendentes, pendHtml: apPendHtml, pede: apPedeEntrada, foto: fotoCiclo, lix: fotoLixeira, idx: function () { return fotoIdxMem; }, apPoll: function () { apPollT = 0; return apPoll(); } };
