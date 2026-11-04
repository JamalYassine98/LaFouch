  // ===== Preço automático (v422, aprovado 04/11/2026) =====
  // Um interruptor. O app revisa toda segunda e explica cada ajuste; o dono só desfaz ou trava (cadeado no produto).
  // Regras fixas: preço normal revisa no máximo 1 vez por mês (só se o dólar/custo mudou de verdade ou se vende muito rápido);
  // o dia a dia fica com as OFERTAS AUTOMÁTICAS em degraus para parados (60 dias −5%, 75 −10%, 90 −15%, 120 = piso),
  // que voltam ao normal quando a peça volta a vender. Nunca abaixo do piso; no máximo 10% por semana (prejuízo corrige na hora);
  // de 500 em 500; não mexe em pedido aberto; pré-graduados têm preço fixo; produto sem custo fica de fora; cadeado sempre vence.
  // Semana fraca na loja toda: segura os preços (nada sobe) e só os que já estavam parados seguem nos degraus.
  S.pAuto = { on: false, ult: 0, mudas: [], ign: {} };
  S.pTrava = {}; // código -> true (o app não mexe)
  var PA_DEG = [
    [60, 0.05],
    [75, 0.1],
    [90, 0.15],
    [120, 1]
  ];
  function paRefs() {
    var vis = {},
      out = [];
    S.items.forEach(function (i) {
      if (i.bulk || isSimple(i.tipo) || i.tipo === 'pre' || vis[i.ref]) return;
      vis[i.ref] = 1;
      out.push(i.ref);
    });
    return out;
  }
  function paEstoque(ref) {
    return S.items.reduce(function (a, i) {
      return a + (i.ref === ref && !i.bulk ? i.qty : 0);
    }, 0);
  }
  function paUltVenda(ref) {
    var t = 0;
    (S.sales || []).forEach(function (s) {
      if (!s.estorno && s.ref === ref && s.ts > t) t = s.ts;
    });
    return t;
  }
  function paPrimEntrada(ref) {
    var t = 0;
    (S.elog || []).forEach(function (e) {
      if (e.ref === ref && e.qty > 0 && (!t || e.ts < t)) t = e.ts;
    });
    return t || (S.cad && S.cad[ref]) || S.appStart || Date.now();
  }
  // Dias sem vender (desde a última venda ou, se nunca vendeu, desde a primeira entrada).
  function paParado(ref) {
    var u = paUltVenda(ref) || paPrimEntrada(ref);
    return Math.floor((Date.now() - u) / DAY);
  }
  function paVendidas(ref, dias) {
    var lim = Date.now() - dias * DAY;
    return (S.sales || []).reduce(function (a, s) {
      return a + (!s.estorno && s.ref === ref && s.ts >= lim ? +s.qty || 0 : 0);
    }, 0);
  }
  function paNoPedido(ref) {
    return (S.cart || []).some(function (l) {
      return l.it && l.it.ref === ref;
    });
  }
  // Semana fraca: a loja toda vendeu bem menos que o normal da época (últimos 7 dias × média das 8 semanas anteriores).
  function paFraca() {
    var now = Date.now(),
      sem = 0,
      ant = 0;
    (S.sales || []).forEach(function (s) {
      if (s.estorno) return;
      var d = (now - s.ts) / DAY;
      if (d <= 7) sem += +s.qty || 0;
      else if (d <= 63) ant += +s.qty || 0;
    });
    var media = ant / 8;
    if (media < 5) return null;
    var r = sem / media;
    return r < 0.7 ? { pct: Math.round((1 - r) * 100) } : null;
  }
  function paArred(v) {
    return Math.ceil(v / 1000 - 1e-9) * 1000; // v425: de 1.000 em 1.000, para cima
  }
  // Calcula os ajustes (sem aplicar). Devolve [{ref, kind, de, para, mot, o}]
  function paPlano() {
    var out = [],
      fraca = paFraca(),
      agora = Date.now();
    paRefs().forEach(function (ref) {
      if (S.pTrava && S.pTrava[ref]) return;
      if (paNoPedido(ref)) return;
      if (!(paEstoque(ref) > 0)) return;
      var it = itemDoRef(ref);
      if (!it || !(effCusto(it) > 0)) return; // sem custo: ainda não está à venda
      var ps = pisoDoRef(ref, it.tipo);
      if (!ps || !ps.pp || !(ps.pp.piso > 0)) return;
      var o = S.pprice[ref] || {},
        atual = tFor(it).price,
        emOf = o.ant > 0 && o.novo > 0 && o.ant > o.novo,
        normal = emOf ? o.ant : atual,
        piso = Math.ceil(ps.pp.piso / 1000) * 1000,
        trava = ps.pp.trava,
        ign = function (k) {
          var t = S.pAuto.ign && S.pAuto.ign[ref + '|' + k];
          return t && agora - t < 30 * DAY;
        };
      if (!(normal > 0)) return;
      // 1. proteção: preço normal abaixo do piso (dólar ou custo subiu)
      if (normal < piso && !ign('preco')) {
        var alvo = normal < trava ? piso : Math.min(piso, paArred(normal * 1.1));
        if (alvo > normal) {
          out.push({ ref: ref, kind: 'preco', de: normal, para: alvo, mot: normal < trava ? 'dólar ou custo subiu · estava dando prejuízo' : 'dólar ou custo subiu' });
          return;
        }
      }
      // 2. oferta automática: acabou quando voltou a vender
      if (emOf && o.auto) {
        if (paUltVenda(ref) > (o.desde || 0)) {
          out.push({ ref: ref, kind: 'fim', de: o.novo, para: o.ant, mot: 'voltou a vender · oferta encerrada' });
          return;
        }
      }
      // 3. degraus para parados (não mexe em oferta feita à mão)
      if (!(emOf && !o.auto) && !ign('oferta')) {
        var d = paParado(ref),
          dg = 0;
        PA_DEG.forEach(function (x, i) {
          if (d >= x[0]) dg = i + 1;
        });
        if (dg > (emOf && o.auto ? o.deg || 0 : 0)) {
          var pct = PA_DEG[dg - 1][1],
            alvo2 = pct >= 1 ? piso : Math.max(piso, Math.floor((normal * (1 - pct)) / 1000) * 1000);
          if (alvo2 < (emOf ? o.novo : normal))
            out.push({ ref: ref, kind: 'oferta', de: emOf ? o.novo : normal, para: alvo2, deg: dg, normal: normal, mot: 'parado ' + d + ' dias · ' + (pct >= 1 ? 'oferta no piso' : 'oferta ' + Math.round(pct * 100) + '%') });
          return;
        }
      }
      // 4. vende rápido: sobe 5% (no máximo 1 vez por mês e nunca em semana fraca)
      if (!fraca && !emOf && !ign('sobe')) {
        var ult = (S.pAuto.mudas || []).filter(function (m) {
          return m.ref === ref && (m.kind === 'preco' || m.kind === 'sobe') && !m.desf;
        }).pop();
        if (!ult || agora - ult.ts >= 30 * DAY) {
          var v30 = paVendidas(ref, 30),
            cob = v30 > 0 ? paEstoque(ref) / (v30 / 30) : Infinity;
          if (v30 >= 3 && cob < 20) out.push({ ref: ref, kind: 'sobe', de: normal, para: paArred(normal * 1.05), mot: 'vende rápido · estoque para ' + Math.max(1, Math.round(cob)) + ' dias' });
        }
      }
    });
    return out;
  }
  // Aplica um ajuste (guarda o antes para o "desfazer").
  function paAplica(m) {
    var o = S.pprice[m.ref] || {},
      antes = JSON.parse(JSON.stringify(o));
    if (m.kind === 'preco' || m.kind === 'sobe') {
      if (o.ant > o.novo) o.ant = m.para;
      else o.novo = m.para;
    } else if (m.kind === 'oferta') {
      if (!(o.ant > o.novo)) o.ant = m.normal;
      o.novo = m.para;
      o.auto = 1;
      o.deg = m.deg;
      o.desde = Date.now();
    } else if (m.kind === 'fim') {
      o.novo = o.ant;
      delete o.ant;
      delete o.auto;
      delete o.deg;
      delete o.desde;
    }
    S.pprice[m.ref] = o;
    if (S.site && S.site[m.ref] && typeof vitFila === 'function') vitFila(m.ref, 'upd');
    var reg = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), ts: Date.now(), ref: m.ref, kind: m.kind, de: m.de, para: m.para, mot: m.mot, antes: antes };
    S.pAuto.mudas.push(reg);
    if (S.pAuto.mudas.length > 300) S.pAuto.mudas.splice(0, S.pAuto.mudas.length - 300);
    return reg;
  }
  // Revisão semanal (segunda-feira, ou ao abrir depois dela). forca = "Revisar agora".
  function paRevisa(forca) {
    if (!S.pAuto || !S.pAuto.on) return 0;
    var agora = new Date(),
      seg = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - ((agora.getDay() + 6) % 7)).getTime();
    if (!forca && S.pAuto.ult >= seg) return 0;
    var pl = paPlano();
    pl.forEach(paAplica);
    S.pAuto.ult = Date.now();
    if (pl.length) {
      ppSync();
      S.notifs.unshift({ ts: Date.now(), lida: false, t: 'Preço automático: ' + pl.length + (pl.length === 1 ? ' ajuste' : ' ajustes'), s: pl.slice(0, 3).map(function (m) { return pn(m.ref) + ': ' + m.mot; }).join(' · ') });
    }
    saveSoon();
    return pl.length;
  }
  function paDesfaz(id) {
    var m = (S.pAuto.mudas || []).filter(function (x) {
      return x.id === id;
    })[0];
    if (!m || m.desf) return;
    if (m.antes && (m.antes.novo || m.antes.ant)) S.pprice[m.ref] = JSON.parse(JSON.stringify(m.antes));
    else delete S.pprice[m.ref];
    m.desf = 1;
    if (!S.pAuto.ign) S.pAuto.ign = {};
    S.pAuto.ign[m.ref + '|' + (m.kind === 'fim' ? 'oferta' : m.kind)] = Date.now(); // não refaz o mesmo por 30 dias
    if (S.site && S.site[m.ref] && typeof vitFila === 'function') vitFila(m.ref, 'upd');
    ppSync();
    saveSoon();
  }
  // Prévia antes de ligar: o que mudaria hoje (nada é aplicado).
  function paPrevia() {
    var pl = paPlano(),
      sob = 0,
      bai = 0;
    pl.forEach(function (m) {
      if (m.para > m.de) sob++;
      else bai++;
    });
    return { sob: sob, bai: bai, iguais: Math.max(0, paRefs().length - pl.length), pl: pl };
  }
  // revisão ao abrir o app (fora dos testes)
  if (!/#test/.test(location.hash))
    setTimeout(function () {
      if (paRevisa(false)) render();
    }, 6000);

  // ---------- tela: Dashboard › Preços ----------
  function paLucroMes() {
    var mi = metaInfo(),
      fx = S.fx.pyg || 1,
      d = new Date(),
      dia = d.getDate();
    return { lucroG: Math.round(mi.lucro * fx), metaG: Math.round((mi.meta || 0) * fx), proj: dia > 0 ? Math.round(((mi.lucro * fx) / dia) * mi.dias) : 0 };
  }
  // v424: o interruptor (e a prévia ao ligar) ficam em AJUSTES; os números e o desfazer ficam na aba Preços.
  function paSwitchHtml() {
    var on = !!(S.pAuto && S.pAuto.on),
      h =
        '<section class="card col paCard" id="paCard"><button type="button" class="paSw" data-act="paTog" role="switch" aria-checked="' + on + '"><span><b>Preço automático</b><small>' +
        (on ? 'ligado · revisa toda segunda · os ajustes ficam em Dashboard › Preços' : 'desligado · você define os preços à mão') +
        '</small></span><span class="sw"><input type="checkbox" tabindex="-1" aria-hidden="true"' + (on ? ' checked' : '') + '><i></i></span></button></section>';
    if (S.paPrev) {
      var pv = paPrevia();
      h +=
        '<section class="card col paPrev"><b>Ligar o preço automático?</b><div class="hint" style="margin:0">Com os seus dados de hoje, o app faria:</div>' +
        '<div class="sl"><span>Sobem</span><b style="color:var(--ok)">' + pv.sob + ' produto(s)</b></div><div class="sl"><span>Baixam (ofertas)</span><b style="color:var(--warn)">' + pv.bai + ' produto(s)</b></div><div class="sl"><span>Ficam iguais</span><b>' + pv.iguais + ' produto(s)</b></div>' +
        '<button type="button" class="btn go" data-act="paLiga" style="width:100%">Ligar</button><button type="button" class="paNao" data-act="paNao">Agora não</button></section>';
    }
    return h;
  }
  function precosAutoHtml() {
    var on = !!(S.pAuto && S.pAuto.on),
      fr = paFraca(),
      h = '';
    h += on
      ? '<div class="paEst"><i class="' + (fr ? 'w' : 'o') + '"></i>' + (fr ? 'Semana fraca na loja toda (' + fr.pct + '% abaixo do normal): preços seguros, só os parados entram em oferta' : 'Preço automático ligado · movimento normal') + '</div>'
      : '<div class="paEst"><i class="w"></i>Preço automático desligado · ligue em Ajustes</div>';
    var lm = paLucroMes();
    if (lm.metaG > 0) {
      var pct = Math.max(0, Math.min(1, lm.lucroG / lm.metaG));
      h +=
        '<section class="card col"><div class="paMt"><span class="hint" style="margin:0">Lucro do mês</span><span class="hint" style="margin:0">meta ' + gs(lm.metaG) + '</span></div><b class="paBig">' + gs(lm.lucroG) + '</b>' +
        '<div class="paBar"><i style="width:' + Math.round(pct * 100) + '%"></i></div><div class="hint" style="margin:0">' + Math.round(pct * 100) + '% · no ritmo atual chega a ' + Math.round((lm.proj / lm.metaG) * 100) + '% até o fim do mês</div></section>';
    }
    if (on) {
      var semana = (S.pAuto.mudas || []).filter(function (m) {
        return Date.now() - m.ts <= 7 * DAY;
      }).reverse(),
        todas = !!S.paTodas,
        lista = todas ? (S.pAuto.mudas || []).slice().reverse().slice(0, 60) : semana.slice(0, 5);
      h += '<section class="card col"><b>' + (todas ? 'Todas as mudanças' : 'Esta semana') + (semana.length && !todas ? ' · ' + semana.length + (semana.length === 1 ? ' ajuste' : ' ajustes') : '') + '</b>';
      if (!lista.length) h += '<div class="hint" style="margin:0">Nenhum ajuste' + (todas ? '' : ' nesta semana') + '. <button type="button" class="paLk" data-act="paAgora">Revisar agora</button></div>';
      lista.forEach(function (m) {
        h +=
          '<div class="paMu' + (m.desf ? ' desf' : '') + '"><span><b>' + esc(pn(m.ref)) + '</b><small class="paMot">' + esc(m.mot) + '</small></span><span class="paVal"><b class="' + (m.para > m.de ? 'up' : 'dn') + '">' + gsRaw(m.de) + ' → ' + gsRaw(m.para) + '</b>' +
          (m.desf ? '<small>desfeito</small>' : '<button type="button" class="paLk" data-act="paDesf" data-id="' + m.id + '">desfazer</button>') + '</span></div>';
      });
      if (!todas && (S.pAuto.mudas || []).length > lista.length) h += '<button type="button" class="paLk" data-act="paTodas">Ver todas</button>';
      if (todas) h += '<button type="button" class="paLk" data-act="paTodas">Voltar</button>';
      h += '</section>';
    }
    // pré-graduados: preço fixo em duas linhas
    var F = S.faixas || [],
      fe = F[0],
      fl = F[F.length - 1],
      tp = tipoOf('pre'),
      pE = (fe && fe.precos && fe.precos.pre) || (tp && tp.price) || 0,
      pL = (fl && fl.precos && fl.precos.pre) || (tp && tp.price) || 0;
    if (tp && fe && fl) {
      h += dFold(
        'pgr',
        'Pré-graduados · preço fixo',
        'Econômica ' + gs(pE) + ' · Luxo ' + gs(pL),
        'var(--sub)',
        '<div class="col" style="gap:10px;padding:0 14px 14px"><div class="hint" style="margin:0">O app escolhe a linha de cada peça sozinho. O preço não muda sozinho.</div>' +
          '<label class="paIn"><span>Linha econômica (G$)</span><input class="in" inputmode="numeric" data-aj="prePe" value="' + (pE ? pE.toLocaleString('pt-BR') : '') + '"></label>' +
          '<label class="paIn"><span>Linha luxo (G$)</span><input class="in" inputmode="numeric" data-aj="prePl" value="' + (pL ? pL.toLocaleString('pt-BR') : '') + '"></label></div>'
      );
    }
    var nt = Object.keys(S.pTrava || {}).filter(function (k) {
      return S.pTrava[k];
    });
    if (on)
      h += dFold(
        'ptr',
        'Preços travados',
        nt.length ? nt.length + ' produto(s) que o app não mexe' : 'nenhum · trave pelo cadeado no produto',
        'var(--sub)',
        nt.length
          ? '<div class="split" style="padding:0 14px 14px">' +
              nt
                .map(function (r) {
                  return '<div class="sl"><span>' + esc(pn(r)) + '<small>' + esc(r) + '</small></span><button type="button" class="paLk" data-act="paDestrava" data-id="' + esc(r) + '">destravar</button></div>';
                })
                .join('') +
              '</div>'
          : ''
      );
    return h;
  }
  ACT.paTog = function () {
    if (!S.pAuto.on) {
      S.paPrev = !S.paPrev;
      render();
      return;
    }
    S.pAuto.on = false;
    S.paPrev = false;
    saveSoon();
    render();
  };
  ACT.paLiga = function () {
    S.pAuto.on = true;
    S.paPrev = false;
    var n = paRevisa(true);
    lfToast(n ? '✓ Preço automático ligado · ' + n + (n === 1 ? ' ajuste' : ' ajustes') : '✓ Preço automático ligado');
    render();
  };
  ACT.paNao = function () {
    S.paPrev = false;
    render();
  };
  ACT.paAgora = function () {
    var n = paRevisa(true);
    lfToast(n ? '✓ ' + n + (n === 1 ? ' ajuste' : ' ajustes') : 'Nada para ajustar agora');
    render();
  };
  ACT.paDesf = function (id) {
    paDesfaz(id);
    render();
  };
  ACT.paTodas = function () {
    S.paTodas = !S.paTodas;
    render();
  };
  ACT.paDestrava = function (ref) {
    if (S.pTrava) delete S.pTrava[ref];
    saveSoon();
    render();
  };
  ACT.paTrava = function (ref) {
    if (!S.pTrava) S.pTrava = {};
    if (S.pTrava[ref]) delete S.pTrava[ref];
    else S.pTrava[ref] = true;
    saveSoon();
    render();
  };

  // ===== Limite secreto (v423): segurar o dedo no preço da vitrine mostra só ao dono até onde pode ir; some ao soltar =====
  function vtLimite(el, it, preco) {
    var t = 0,
      bx = null,
      fecha = function () {
        clearTimeout(t);
        if (bx) {
          bx.remove();
          bx = null;
        }
      };
    el.style.userSelect = 'none';
    el.style.webkitUserSelect = 'none';
    el.style.webkitTouchCallout = 'none';
    el.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
    el.addEventListener('pointerdown', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var pp = pisoPeca(it),
          piso = pp && pp.piso > 0 ? Math.ceil(pp.piso / 1000) * 1000 : 0,
          br = typeof cartBrinde === 'function' ? cartBrinde() : null;
        if (!piso) return;
        vibrar(15);
        bx = mk('div', 'vtLim');
        bx.innerHTML =
          '<div class="sl"><span>Pode chegar a</span><b>' + gs(Math.min(piso, preco)) + '</b></div>' +
          (br ? '<div class="sl"><span>Melhor que desconto</span><b>' + esc(br.nome.toLowerCase()) + ' grátis</b></div>' : '') +
          '<small>abaixo disso dá prejuízo (piso com o câmbio de hoje)</small>';
        el.insertAdjacentElement('afterend', bx);
      }, 450);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      el.addEventListener(ev, fecha);
    });
  }
