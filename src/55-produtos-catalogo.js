  // ===== Produtos: preço (antigo → novo) e canais (site, WhatsApp, loja) em cada produto, avisos de piso e aplicação em grupo. =====
  S.pprice = {}; // código do produto -> { novo, ant } (guaranis, calculados) + { nu, au } (dólares digitados). Vazio = vale o preço do tipo.
  // Preço em reais e guaranis (R$ · G$), pela cotação da loja.
  function precoRG(g) {
    var b = fxLoja('brl');
    return (b > 0 ? 'R$ ' + Math.ceil(g / b - 1e-9) + ' · ' : '') + gs(g); // v425: real inteiro, para cima
  }
  // O preço vale em dólar: os guaranis seguem a cotação da loja. Se um guarani foi mudado por outra parte do app, o dólar acompanha.
  function ppSync() {
    var r = fxUsdLoja();
    if (!(r > 0)) return;
    Object.keys(S.pprice || {}).forEach(function (ref) {
      var o = S.pprice[ref];
      if (!o) return;
      [['novo', 'nu', 'gn'], ['ant', 'au', 'ga']].forEach(function (k) {
        if (o[k[0]] > 0) {
          if (o[k[2]] !== o[k[0]] || !(o[k[1]] > 0)) o[k[1]] = Math.round((o[k[0]] / r) * 10000) / 10000;
          else o[k[0]] = Math.ceil((o[k[1]] * r) / 1000 - 1e-9) * 1000;
          o[k[2]] = o[k[0]];
        } else {
          delete o[k[1]];
          delete o[k[2]];
        }
      });
    });
  }
  // Grava um preço digitado em dólar (k = 'novo' ou 'ant') e já calcula os guaranis.
  function ppPutUsd(o, k, u) {
    var nk = k === 'novo' ? 'nu' : 'au',
      gk = k === 'novo' ? 'gn' : 'ga',
      n0 = ppNormal(o);
    o[nk] = u;
    o[k] = gsDeUsd(u);
    o[gk] = o[k];
    if (ppNormal(o) !== n0) o.desde = Date.now(); // 94: desde quando vale o preço normal (o "de" honesto precisa de 30 dias)
  }
  // o preço normal da peça (em oferta, o de antes da oferta)
  function ppNormal(o) { return o ? (o.ant > o.novo ? o.ant : o.novo || 0) : 0; }
  // 94 · de/por honesto (um lugar só): o "de" só aparece se foi o preço praticado por 30 dias ou mais E vendeu nesse preço.
  // Vale para o Catálogo, o site, os cartões e o Marketing; a janela Oferta mostra o porquê.
  function deInfo(ref, normal) {
    var o = S.pprice[ref] || {}, dias = o.desde ? Math.floor((Date.now() - o.desde) / DAY) : 999,
      vend = normal > 0 && (S.sales || []).some(function (s) { return !s.estorno && s.ref === ref && (+s.lista || 0) >= normal * 0.99 && (!o.desde || s.ts >= o.desde); });
    if (!(normal > 0)) return { ok: false, mot: '' };
    if (dias < 30) return { ok: false, mot: 'Sem "de": ' + gs(normal) + ' é o preço há ' + nDias(dias) };
    if (!vend) return { ok: false, mot: 'Sem "de": ' + gs(normal) + ' ainda não vendeu' };
    return { ok: true, mot: 'Com "de": ' + gs(normal) + ' é o preço há mais de 30 dias e já vendeu' };
  }
  function deHonesto(ref) {
    var o = S.pprice[ref];
    return o && o.ant > o.novo && deInfo(ref, o.ant).ok ? o.ant : 0;
  }
  S.pcanal = {}; // código do produto -> { site, wpp, loja } (true/false). Sem registro: só a loja.
  S.selMode = false; // selecionando produtos para aplicar preço em grupo
  S.selP = []; // códigos selecionados
  function canalDe(ref) {
    var c = (S.pcanal && S.pcanal[ref]) || {};
    return { site: !!c.site, wpp: !!c.wpp, loja: c.loja !== false };
  }
  function canalSet(ref, k, v) {
    var c = canalDe(ref);
    c[k] = !!v;
    S.pcanal[ref] = c;
  }
  function itemDoRef(ref, tipo) {
    var l = S.items.filter(function (i) {
      return i.ref === ref && (!tipo || i.tipo === tipo);
    });
    return (
      l.filter(function (i) {
        return i.qty > 0;
      })[0] ||
      l[0] ||
      null
    );
  }
  function estoqueDoRef(ref, tipo) {
    return S.items.reduce(function (n, i) {
      return n + (i.ref === ref && (!tipo || i.tipo === tipo) ? i.qty : 0);
    }, 0);
  }
  // Situação do preço de um produto frente à trava e ao piso: 'r' prejuízo, 'w' abaixo do piso, 'o' ok, '' sem dados.
  function pisoDoRef(ref, tipo, precoTeste) {
    var it = itemDoRef(ref, tipo);
    if (!it) return null;
    var pp, p;
    try {
      pp = pisoPeca(it);
      // vale o pior caso: a cor/grau com estoque de maior custo (a mesma etiqueta vale para todas)
      S.items.forEach(function (x) {
        if (x.ref !== ref || (tipo && x.tipo !== tipo) || x.bulk || !(x.qty > 0)) return;
        var q = pisoPeca(x);
        if (q.trava > pp.trava) {
          pp = q;
          pp.corPior = x.cor + (x.grau ? ' ' + x.grau : '');
        }
      });
      p = precoTeste != null ? precoTeste : tFor(it).price;
    } catch (e) {
      return null;
    }
    if (!(pp.trava > 0) || !(p > 0) || !(pp.piso > 0)) return { st: '', pp: pp, p: p };
    return { st: p < pp.trava ? 'r' : p < pp.piso ? 'w' : 'o', pp: pp, p: p };
  }
  function precoAtual(ref, tipo) {
    var it = itemDoRef(ref, tipo);
    return it ? tFor(it).price : 0;
  }

  // Enfeita o cartão de um produto na lista: preço antigo → novo, selos dos canais e aviso de piso.
  function prodDecor(card, ref, tipo) {
    var pr = S.pprice[ref] || {},
      atual = precoAtual(ref, tipo),
      ps = pisoDoRef(ref, tipo),
      cn = canalDe(ref);
    var sel = card.querySelector('.pbox');
    if (atual > 0) {
      var p = mk('div', 'zp');
      p.innerHTML =
        (deHonesto(ref) > atual ? '<s>' + gs(pr.ant) + '</s>' : '') + '<span' + (pr.ant > atual ? ' class="of"' : '') + '>' + gs(atual) + '</span>' + (typeof invSinal === 'function' ? invSinal(ref, tipo, ps) : '');
      var anchor = card.querySelector('.cell');
      card.insertBefore(p, anchor || null);
    }
    if (atual > 0 || typeof invSinal !== 'function') {
    } else card.insertBefore(mk('div', 'zp zpSem', 'sem preço'), card.querySelector('.cell'));
    if (ps && ps.st && typeof invSinal !== 'function') {
      var b = mk('span', 'zbd ' + ps.st, ps.st === 'o' ? 'ok' : ps.st === 'w' ? 'piso ' + gsRaw(ps.pp.piso) : 'custo ' + gsRaw(ps.pp.trava));
      card.appendChild(b);
    }
    if (S.selMode) {
      var on = S.selP.indexOf(ref) >= 0;
      card.classList.toggle('zsel', on);
      if (on) { var zk = mk('span', 'zck', ''); zk.innerHTML = ICO.chk; card.appendChild(zk); }
    }
  }

  // 64 · Preço e Oferta na ficha: linhas que só MOSTRAM o que o Titan cuida; tocar abre a janela Oferta (uma só, ofertaJanela).
  // Saíram no mesmo passo o campo "Preço (US$)", o botão "% Oferta" e a frase de piso/trava (o estado vai na linha Preço).
  function fichaExtra(ref, tipo) {
    var wrap = mk('div', 'col ofFicha'),
      pr = S.pprice[ref] || {},
      atual = precoAtual(ref, tipo),
      emOf = pr.ant > atual && atual > 0,
      normal = emOf ? pr.ant : atual,
      st = titanEstado(ref, normal),
      de = deHonesto(ref);
    var linha = function (cls, tit, sub, subCls, val) {
      var b = mk('button', 'ofL ' + cls);
      b.type = 'button';
      b.setAttribute('data-act', 'ofAbre');
      b.setAttribute('data-id', ref);
      b.innerHTML = '<span><b>' + tit + '</b><small' + (subCls ? ' class="' + subCls + '"' : '') + '>' + sub + '</small></span>' + (val ? '<em>' + val + '</em>' : '');
      if (!(atual > 0)) b.disabled = true;
      return b;
    };
    wrap.appendChild(linha('ofLP', 'Preço', esc(LF_TITAN) + ' · <i class="' + st.cl + '">' + esc(st.t) + '</i>', '', atual > 0 ? gs(normal) : 'sem preço'));
    wrap.appendChild(emOf
      ? linha('ofLO on', 'Em oferta', (de ? 'de ' + gs(pr.ant) : 'sem "de"') + (pr.ate > 0 ? ' · até ' + fd(pr.ate) : ''), '', gs(atual))
      : linha('ofLO', 'Oferta', 'nenhuma', '', ''));
    // v422: preço automático ligado — cadeado para o app não mexer neste produto
    if (S.pAuto && S.pAuto.on) {
      var trv = !!(S.pTrava && S.pTrava[ref]),
        um = (S.pAuto.mudas || []).filter(function (m) {
          return m.ref === ref && !m.desf;
        }).pop(),
        lk = mk('div', 'paLock');
      lk.innerHTML =
        '<span class="hint" style="margin:0">' + (trv ? 'travado · o app não mexe' : 'automático' + (um ? ' · mudou há ' + nDias(Math.max(0, Math.floor((Date.now() - um.ts) / DAY))) : '')) + '</span>' +
        '<button type="button" class="paLkB' + (trv ? ' on' : '') + '" data-act="paTrava" data-id="' + esc(ref) + '" aria-pressed="' + trv + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="' + (trv ? 'M8 11V7a4 4 0 0 1 8 0v4' : 'M8 11V7a4 4 0 0 1 7.7-1.5') + '"/></svg>' + (trv ? 'Travado' : 'Travar') + '</button>';
      wrap.appendChild(lk);
    }
    var sz = mk('div', 'zcd');
    sz.appendChild(siteChave(ref)); // v427: chave No site
    wrap.appendChild(sz);
    return wrap;
  }
  // O que o Titan diz do preço v da peça (linha Preço da ficha e aviso da janela Oferta): mínimo = não perde dinheiro (trava),
  // margem = o piso das suas regras. Um lugar só para as palavras e as cores.
  function titanEstado(ref, v) {
    var ps = pisoDoRef(ref, null, v), pp = ps && ps.pp ? ps.pp : {}, trava = pp.trava > 0 ? pp.trava : 0, piso = pp.piso > 0 ? Math.ceil(pp.piso / 1000) * 1000 : 0, s2 = ps ? ps.st : '';
    if (!(v > 0)) return { cl: '', t: 'sem preço', s: '', trava: 0, piso: 0 };
    if (!trava || !piso) return { cl: '', t: 'sem custo', s: '', trava: 0, piso: 0 };
    if (s2 === 'r') return { cl: 'r', t: 'abaixo do mínimo', s: 'r', trava: trava, piso: piso };
    if (s2 === 'w') return { cl: 'w', t: 'abaixo da margem', s: 'w', trava: trava, piso: piso };
    return { cl: 'o', t: 'lucro ' + gs(lucroUnico(ref, v)), s: 'o', trava: trava, piso: piso };
  }
  // Folga de hoje: o maior desconto que deixa a peça na sua margem (o motor do Titan, Parte 2, passa a usar a mola)
  function titanFolga(ref, normal) {
    var e = titanEstado(ref, normal);
    return e.piso > 0 && normal > e.piso ? Math.floor((1 - e.piso / normal) * 100) : 0;
  }
  // ---------- 64 + 94 + 96c · a janela Oferta: UMA só, com duas entradas (a ficha e o "+" de Preços › Ofertas) ----------
  // Preço normal · Preço da oferta · Desconto · Até · o aviso do Titan (mínimo, prejuízo, folga) · o "de" honesto · Na loja e no site · Salvar.
  // Saíram no mesmo passo a janela antiga (ofertaModal: preço em US$, atalhos −5%…−30%, Cancelar e as datas mm/dd/yyyy) e o estado da janela aberta guardado no S.
  function ofertaJanela(ref) {
    var pr = S.pprice[ref] || {}, atual = precoAtual(ref), emOf = pr.ant > atual && atual > 0, base = emOf ? pr.ant : atual;
    if (!(base > 0)) return lfToast('Defina o preço da peça antes da oferta', 'atencao');
    var ini = emOf ? atual : Math.round((base * 0.9) / 1000) * 1000, ate0 = pr.ate > 0 ? pr.ate : 0,
      dIso = function (ts) { var d = new Date(ts); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); },
      num = function (t) { return +String(t || '').replace(/\D/g, '') || 0; }, api;
    api = lfJanela({
      titulo: 'Oferta', cls: 'ofJn',
      mudou: function () { var c = api && api.corpo; return !!c && (num(c.querySelector('#ofPor').value) !== ini || (c.querySelector('#ofAte').value || '') !== (ate0 ? dIso(ate0) : '')); },
      monta: function (c) {
        c.innerHTML = '<p class="ofNm">' + esc(pn(ref)) + ' · ' + esc(ref) + '</p>' +
          '<div class="cxL"><span>Preço normal</span><b>' + gs(base) + '</b></div>' +
          '<label class="cxL"><span>Preço da oferta</span><input id="ofPor" class="ofCp" inputmode="numeric" aria-label="Preço da oferta em guaranis"></label>' +
          '<label class="cxL"><span>Desconto</span><span class="ofPct"><input id="ofDsc" class="ofCp" inputmode="numeric" aria-label="Desconto em porcentagem"><i aria-hidden="true">%</i></span></label>' +
          '<label class="cxL ofDt"><span>Até</span><b id="ofAteTx"></b><input id="ofAte" type="date" aria-label="Até quando vale a oferta"></label>' +
          '<div id="ofTi" class="ofTi" aria-live="polite"></div><div id="ofDe" class="ofDe"></div><div class="cxL"><span id="ofOnde">Na loja e no site</span><b id="ofLoja"></b></div><div class="cxL" id="ofSiteL" hidden><span>No site</span><b id="ofSite"></b></div>' +
          '<button type="button" class="go" id="ofSalva">Salvar</button>' + (emOf ? '<button type="button" class="lxT ofFim" id="ofFim">Encerrar a oferta (volta a ' + gs(base) + ')</button>' : '');
        var por = c.querySelector('#ofPor'), dsc = c.querySelector('#ofDsc'), ate = c.querySelector('#ofAte'), sv = c.querySelector('#ofSalva');
        var ateTx = function () { var p3 = ate.value ? ate.value.split('-') : null; c.querySelector('#ofAteTx').textContent = p3 ? p3[2] + '/' + p3[1] : 'sem data'; };
        if (ate0) ate.value = dIso(ate0);
        ate.onchange = ateTx; // a data aparece como 30/11 (o seletor do aparelho abre por baixo)
        ateTx();
        var pinta = function (v) {
          var e = titanEstado(ref, v), f = titanFolga(ref, base), di = deInfo(ref, base), sp = typeof sitePreco === 'function' ? sitePreco(v) : v, h = '';
          if (v >= base) h = '<p class="w">A oferta precisa ficar abaixo do preço normal.</p>';
          else if (e.s === 'r') h = '<p class="r">' + esc(LF_TITAN) + ': abaixo do mínimo (' + gs(e.trava) + '). Cada peça vendida assim dá ' + gs(e.trava - v) + ' de prejuízo.</p>';
          else if (e.s === 'w') h = '<p class="w">' + esc(LF_TITAN) + ': abaixo da sua margem (' + gs(e.piso) + '). Ainda cobre a reposição e as contas.</p>';
          else if (e.s === 'o') h = '<p class="o">' + esc(LF_TITAN) + ': ' + e.t + ' por peça.</p>';
          h += '<p>Folga de hoje: ' + f + '%' + (f ? ' · até ' + gs(Math.ceil((base * (1 - f / 100)) / 1000) * 1000) + ' sem sair da margem.' : ' · o preço normal já está no limite da margem.') + '</p>';
          c.querySelector('#ofTi').innerHTML = h;
          c.querySelector('#ofDe').innerHTML = '<i class="' + (di.ok ? 'ok' : 'w') + '" aria-hidden="true"></i><span>' + esc(di.mot) + '</span>';
          // 96c: a mesma oferta na loja e no site; enquanto o site tiver a cotação própria (Parte 2 do Titan), mostra as duas linhas
          c.querySelector('#ofOnde').textContent = sp === v ? 'Na loja e no site' : 'Na loja';
          c.querySelector('#ofLoja').textContent = gs(v);
          c.querySelector('#ofSiteL').hidden = sp === v;
          c.querySelector('#ofSite').textContent = gs(sp);
          sv.disabled = !(v > 0) || v >= base;
        };
        var poe = function (v, de) {
          if (de !== 'por') por.value = v > 0 ? gsRaw(v) : '';
          if (de !== 'dsc') dsc.value = v > 0 && v < base ? String(Math.round((1 - v / base) * 100)) : '';
          pinta(v);
        };
        por.oninput = function () { var v = num(por.value); por.value = v ? gsRaw(v) : ''; poe(v, 'por'); };
        dsc.oninput = function () { var p = Math.min(90, num(dsc.value)); poe(p ? Math.round((base * (1 - p / 100)) / 1000) * 1000 : 0, 'dsc'); };
        [por, dsc].forEach(function (i) { i.onfocus = function () { try { i.select(); } catch (e) {} }; });
        poe(ini);
        sv.onclick = function () {
          var v = num(por.value), r = fxUsdLoja();
          if (!(v > 0) || v >= base || !(r > 0)) return;
          var o = S.pprice[ref] || {}, p2 = ate.value ? ate.value.split('-') : null, fim = p2 ? new Date(+p2[0], +p2[1] - 1, +p2[2], 23, 59, 59).getTime() : 0;
          o.ant = base;
          delete o.au;
          delete o.ga;
          ppPutUsd(o, 'novo', v / r);
          if (fim) o.ate = fim; else delete o.ate;
          S.pprice[ref] = o;
          saveSoon();
          api.fecha(true);
          lfToast('Oferta salva · ' + gs(o.novo) + (fim ? ' até ' + fd(fim) : ''), 'ok');
          render();
        };
        var fb = c.querySelector('#ofFim');
        if (fb) fb.onclick = function () { ofertaFim(ref); saveSoon(); api.fecha(true); lfToast('Oferta encerrada · volta a ' + gs(base), 'ok'); render(); };
      }
    });
  }
  // ---------- oferta: o Inventário manda; o app avisa piso/trava e publica no catálogo e no site
  function ofertaFim(ref) {
    var o = S.pprice[ref];
    if (!o || !(o.ant > 0)) return;
    // v451: oferta de evento com data de fim — a oferta que a peça tinha antes volta sozinha
    var pv = o.prev;
    delete o.prev;
    if (pv && pv.nu > 0 && (!pv.ate || pv.ate > Date.now())) {
      ppPutUsd(o, 'novo', pv.nu);
      if (pv.ate) o.ate = pv.ate;
      else delete o.ate;
      saveSoon();
      return;
    }
    o.novo = o.ant;
    delete o.ant;
    delete o.ate;
    if (!o.novo) delete S.pprice[ref];
    saveSoon();
  }
  // Oferta com data final já vencida volta ao preço anterior sozinha (só o dono vê a data; o cliente vê "em oferta").
  function ofertaManut() {
    var ch = false;
    Object.keys(S.pprice || {}).forEach(function (ref) {
      var o = S.pprice[ref];
      if (o && o.ate > 0 && Date.now() > o.ate) {
        ofertaFim(ref);
        ch = true;
      }
    });
    return ch;
  }
  // ---------- seleção em grupo
  function selAlterna(ref) {
    var i = S.selP.indexOf(ref);
    if (i >= 0) S.selP.splice(i, 1);
    else S.selP.push(ref);
    render();
  }
  // v474 (aprovado 08/11, esboço S17): mesma barra do Catálogo (.ebBar) — uma linha: × (sai) · "Toque nos produtos" / "N selecionados" · Todos · Preço ›
  function selBarra() {
    var b = $('selBar'),
      on = S.selMode && S.view === 'estoque';
    if (!on) {
      if (b) {
        b.classList.remove('in');
        setTimeout(function () {
          if (!(S.selMode && S.view === 'estoque') && b.parentNode) b.remove();
        }, 340);
      }
      return;
    }
    if (!b) {
      b = mk('div', 'ebBar selBar');
      b.id = 'selBar';
      b.innerHTML =
        '<button type="button" class="ebX" aria-label="Sair da seleção">×</button><span class="ebN"><span class="cjOdo" id="selNn"><span>1</span></span> <span id="selNt">Toque nos produtos</span></span>' +
        '<button type="button" class="selTodos">Todos</button><button type="button" class="ebGo">Preço ›</button>';
      document.body.appendChild(b);
      b.querySelector('.ebX').onclick = function () {
        S.selMode = false;
        S.selP = [];
        render();
      };
      b.querySelector('.selTodos').onclick = function () {
        var seen = {};
        Array.from(document.querySelectorAll('#rows .pcard[data-ref]')).forEach(function (c) {
          seen[c.getAttribute('data-ref')] = 1;
        });
        S.selP = Object.keys(seen);
        render();
      };
      b.querySelector('.ebGo').onclick = function () {
        if (S.selP.length) selDialogo();
      };
      requestAnimationFrame(function () {
        b.classList.add('in');
      });
    } else b.classList.add('in');
    var n = S.selP.length,
      nn = $('selNn');
    nn.style.display = n ? '' : 'none';
    if (n) lfOdo(nn, n);
    $('selNt').textContent = n ? (n === 1 ? 'selecionado' : 'selecionados') : 'Toque nos produtos';
    b.querySelector('.ebGo').disabled = !n;
  }
  var selU = null; // últimos preços digitados em dólar no aplicar em grupo
  function selAplica(refs, novo, ant, site, wpp, modo) {
    var n = 0,
      aj = 0;
    refs.forEach(function (ref) {
      var o = S.pprice[ref] || {},
        cur = precoAtual(ref),
        alvo = novo > 0 ? novo : 0;
      if (alvo > 0) {
        var ps = pisoDoRef(ref, null, alvo);
        if (modo === 'reajustar' && ps && ps.st && ps.st !== 'o') {
          alvo = ps.pp.piso;
          aj++;
        }
        var us = selU && alvo === selU.n && selU.nu > 0;
        if (ant > 0 && selU && ant === selU.a && selU.au > 0) ppPutUsd(o, 'ant', selU.au);
        else if (ant > 0) o.ant = ant;
        else if (!o.ant && cur > alvo) o.ant = cur;
        if (us) ppPutUsd(o, 'novo', selU.nu);
        else o.novo = alvo;
        S.pprice[ref] = o;
        n++;
      }
      if (site !== '') canalSet(ref, 'site', site === '1');
      if (wpp !== '') canalSet(ref, 'wpp', wpp === '1');
    });
    S.selMode = false;
    S.selP = [];
    S.msg = n ? n + ' produto(s) atualizados' + (aj ? ' · ' + aj + ' ajustado(s) ao piso' : '') : 'Canais atualizados';
    saveSoon();
    render();
  }
  function selDialogo() {
    var refs = S.selP.slice(),
      ov = mk('div', 'modal'),
      bx = mk('div', 'modal-box');
    bx.style.maxWidth = '460px';
    ov.appendChild(bx);
    function fecha() {
      ov.remove();
    }
    function tela1() {
      bx.textContent = '';
      bx.appendChild(mk('b', '', 'Aplicar em ' + refs.length + ' produto(s)'));
      var r = mk('div', '');
      r.style.cssText = 'display:flex;gap:10px';
      function cp(rot, ph) {
        var d = mk('div', '');
        d.style.flex = '1';
        d.appendChild(mk('div', 'zlb', rot));
        var i = mk('input', 'in');
        i.setAttribute('inputmode', 'decimal');
        i.placeholder = ph;
        i.setAttribute('aria-label', rot);
        d.appendChild(i);
        r.appendChild(d);
        return i;
      }
      var iAnt = cp('PREÇO ANTIGO (US$)', 'opcional'),
        iNovo = cp('PREÇO NOVO (US$)', 'não mudar');
      bx.appendChild(r);
      var go = btn('mini', 'Aplicar', function () {
        var novoU = campoParaUsd(iNovo.value) || 0,
          antU = campoParaUsd(iAnt.value) || 0,
          novo = gsDeUsd(novoU),
          ant = gsDeUsd(antU),
          ruins = [];
        selU = { n: novo, nu: novoU, a: ant, au: antU };
        if (novo > 0)
          refs.forEach(function (ref) {
            var ps = pisoDoRef(ref, null, novo);
            if (ps && ps.st && ps.st !== 'o') ruins.push([ref, ps]);
          });
        if (!ruins.length) {
          fecha();
          selAplica(refs, novo, ant, '', '', 'direto');
          return;
        }
        tela2(novo, ant, '', '', ruins);
      });
      var cc = btn('chip', 'Cancelar', fecha);
      var ln = mk('div', '');
      ln.style.cssText = 'display:flex;gap:8px;justify-content:flex-end';
      ln.appendChild(cc);
      ln.appendChild(go);
      bx.appendChild(ln);
    }
    function tela2(novo, ant, site, wpp, ruins) {
      bx.textContent = '';
      bx.appendChild(mk('b', '', 'Aplicar ' + gs(novo) + ' em ' + refs.length + ' produto(s)'));
      var h = mk('div', 'zcd');
      h.appendChild(mk('div', 'zalerta', ruins.length + ' ficam abaixo do piso'));
      ruins.forEach(function (x) {
        var l = mk('div', 'zl');
        l.appendChild(mk('span', '', (S.pnome && S.pnome[x[0]]) || x[0]));
        l.appendChild(mk('b', x[1].st === 'r' ? 'zr' : 'zw', (x[1].st === 'r' ? 'custo ' + gsRaw(x[1].pp.trava) : 'piso ' + gsRaw(x[1].pp.piso))));
        h.appendChild(l);
      });
      bx.appendChild(h);
      var b1 = btn('mini', 'Reajustar', function () {
        fecha();
        selAplica(refs, novo, ant, site, wpp, 'reajustar');
      });
      var b2 = btn('chip', 'Aplicar mesmo assim', function () {
        fecha();
        selAplica(refs, novo, ant, site, wpp, 'direto');
      });
      var b3 = btn('chip', 'Cancelar', fecha);
      var nota = mk('div', 'hint', 'Reajustar: só os que ficariam abaixo do piso sobem para o piso de cada um; os outros ficam com o preço digitado.');
      bx.appendChild(nota);
      [b1, b2, b3].forEach(function (b) {
        b.style.width = '100%';
        bx.appendChild(b);
      });
    }
    tela1();
    ov.onclick = function (e) {
      if (e.target === ov) fecha();
    };
    document.body.appendChild(ov);
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('#btnSelP');
    if (!t) return;
    S.selMode = !S.selMode;
    S.selP = [];
    if (S.selMode) {
      S.pdMode = false;
      S.det = false;
      S.open = '';
    }
    render();
  });

  // S377: a barra antiga Vendas · WhatsApp · Site saiu; só esconde os lugares dela que ainda existem na página
  function uniAbasFill() {
    ['uniV'].forEach(function (id) {
      var h = $(id);
      if (h) h.hidden = true;
    });
  }

