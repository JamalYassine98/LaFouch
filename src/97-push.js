  // ===== Avisos de pedido do site =====
  // Celular (APK): token do aparelho guardado na nuvem; a função do Firebase manda o aviso (functions/index.js).
  // Computador (Windows) e navegador: aviso do sistema quando o app encontra pedido novo.
  var PUSH = { ok: false, tok: '' };
  function pushPlugin() {
    var C = window.Capacitor,
      P = (C && C.Plugins) || {},
      o = P.PushNotifications;
    try {
      if (!o && C && C.registerPlugin && C.isPluginAvailable && C.isPluginAvailable('PushNotifications')) o = C.registerPlugin('PushNotifications');
    } catch (e) {}
    return o || null;
  }
  // g: 1 = clássicos, 2 = novos, 3 = sem som
  var AV_SONS = [
    ['sino', 'Sino', 1],
    ['caixa', 'Caixa registradora', 1],
    ['campainha', 'Campainha', 1],
    ['suave', 'Suave', 1],
    ['moeda', 'Moeda', 2],
    ['pop', 'Pop', 2],
    ['marimba', 'Marimba', 2],
    ['cristal', 'Cristal', 2],
    ['harpa', 'Harpa', 2],
    ['gota', 'Gota', 2],
    ['mudo', 'Sem som', 3]
  ];
  // Tipos de aviso: letra, título, som de fábrica
  var AV_TIPOS = [
    ['n', 'Pedido novo', 'caixa'],
    ['c', 'Comprovante enviado', 'sino'],
    ['p', 'Pagamento aprovado', 'moeda'],
    ['x', 'Cliente cancelou', 'suave'],
    ['v', 'Peça voltou', 'suave'],
    ['d', 'Dólar barato', 'mudo']
  ];
  function avNome(id) {
    return (AV_SONS.filter(function (x) { return x[0] === id; })[0] || ['', 'Sino'])[1];
  }
  // Preferências deste aparelho (n=pedido novo, c=comprovante, x=cancelamento, p=pagamento aprovado).
  function avPref() {
    var a = S.avisos || {},
      o = { n: a.n !== false, c: a.c !== false, x: a.x !== false, p: a.p !== false, v: a.v !== false, d: a.d === true, q: !!a.q, qi: a.qi || '18:00', qf: a.qf || '07:00' };
    // quem já tinha escolhido UM som para tudo (a.som) continua com ele até mexer num tipo
    AV_TIPOS.forEach(function (t) {
      o['s' + t[0]] = a['s' + t[0]] || (a.som && t[0] !== 'd' ? a.som : t[2]);
    });
    o.som = o.sn;
    return o;
  }
  // Toca o som do tipo, respeitando ligado/desligado e o horário silencioso.
  function avTocaTipo(tipo) {
    var a = avPref();
    if (a[tipo] === false || !a[tipo] || avQuieto(a)) return;
    avTocar(a['s' + tipo]);
  }
  function avMin(h) {
    var m = /^(\d{1,2}):(\d{2})/.exec(h || '');
    return m ? Math.min(1440, +m[1] * 60 + +m[2]) : 0;
  }
  function avQuieto(a) {
    if (!a.q) return false;
    var d = new Date(),
      m = d.getHours() * 60 + d.getMinutes(),
      i = avMin(a.qi),
      f = avMin(a.qf);
    return i <= f ? m >= i && m < f : m >= i || m < f;
  }
  function avTocar(som) {
    if (!som || som === 'mudo') return;
    try {
      var au = new Audio('sons/' + som + '.mp3');
      au.volume = 1;
      var pr = au.play();
      if (pr && pr.catch) pr.catch(function () {});
    } catch (e) {}
  }
  // Android: cada som tem o seu canal (o som de um canal não muda depois de criado).
  function avCanal() {
    var PN = pushPlugin();
    if (!PN || !PN.createChannel) return;
    // um canal para cada som: o servidor escolhe o canal conforme o tipo do aviso
    AV_SONS.forEach(function (x) {
      var mudo = x[0] === 'mudo',
        c = { id: 'pedidos_' + x[0], name: 'Pedidos do site · ' + x[1], description: 'Pedido novo, comprovante e cancelamento', importance: mudo ? 3 : 5, visibility: 1, vibration: true };
      if (!mudo) c.sound = x[0] + '.mp3';
      try {
        PN.createChannel(c);
      } catch (e) {}
    });
  }
  function pushSalvar(tok) {
    tok = tok || PUSH.tok;
    if (!tok) return;
    PUSH.tok = tok;
    if (!S.nuvem || !S.nuvem.rt) return;
    var a = avPref(),
      B = function (v) {
        return { booleanValue: !!v };
      },
      T = function (v) {
        return { stringValue: String(v) };
      };
    nvApi(
      'PATCH',
      'dispositivos/' + encodeURIComponent(tok),
      JSON.stringify({
        fields: { ts: { integerValue: String(Date.now()) }, plat: T('android'), email: T(S.nuvem.email || ''), n: B(a.n), c: B(a.c), x: B(a.x), p: B(a.p), som: T(a.sn), sn: T(a.sn), sc: T(a.sc), sx: T(a.sx), sp: T(a.sp), q: B(a.q), qi: T(a.qi), qf: T(a.qf) }
      })
    ).catch(function () {});
  }
  function pushIniciar() {
    var C = window.Capacitor,
      PN = pushPlugin();
    if (!PN || !C || !C.isNativePlatform || !C.isNativePlatform()) return;
    if (PUSH.ok) {
      if (PUSH.tok) pushSalvar(PUSH.tok);
      return;
    }
    PUSH.ok = true;
    try {
      PN.addListener('registration', function (t) {
        pushSalvar(t && t.value);
      });
      PN.addListener('registrationError', function () {
        PUSH.ok = false;
      });
      // app aberto: só atualiza a lista de pedidos
      // (com o app aberto o Android não mostra o aviso do sistema: tocamos o som e mostramos um aviso aqui dentro)
      PN.addListener('pushNotificationReceived', function (n) {
        if (window.__pedSync) window.__pedSync();
        try {
          var dd = (n && n.data) || {},
            tp = { comp: 'c', cancel: 'x', pago: 'p' }[dd.tipo] || 'n',
            av = avPref();
          avTocar(av['s' + tp] || av.sn);
          avDentro((n && n.title) || 'Aviso', (n && n.body) || '', dd.tipo);
          var mm = $('avmsg');
          if (mm && dd.tipo === 'teste') {
            mm.textContent = 'Aviso de teste recebido.';
            mm.hidden = false;
          }
        } catch (e) {}
      });
      // toque no aviso: abre a aba Pedidos
      PN.addListener('pushNotificationActionPerformed', function () {
        if (window.__pedSync) window.__pedSync();
        setView('ped');
      });
      var pedido = PN.checkPermissions().then(function (p) {
        return p.receive === 'granted' || p.receive === 'denied' ? p : PN.requestPermissions();
      });
      pedido.then(function (p) {
        if (!p || p.receive !== 'granted') {
          PUSH.ok = false;
          return;
        }
        avCanal();
        PN.register();
      });
    } catch (e) {
      PUSH.ok = false;
    }
  }
  // Aviso do sistema (Windows/navegador) para pedidos achados pela busca automática; respeita as opções de Ajustes.
  function avisoLocal(titulo, corpo, q) {
    // v465 (animação k): com o app aberto, o pedido novo desce do topo com mola
    try {
      if (q && q.n && !document.hidden && typeof lfAvisoTopo === 'function') lfAvisoTopo(q.n === 1 ? 'Pedido novo do site' : q.n + ' pedidos novos do site', corpo || 'Toque para ver', function () { setView('ped'); });
    } catch (e) {}
    try {
      var C = window.Capacitor;
      if (C && C.isNativePlatform && C.isNativePlatform()) return;
      var a = avPref();
      if (q) {
        var n = (a.n ? q.n || 0 : 0) + (a.c ? q.c || 0 : 0) + (a.x ? q.x || 0 : 0);
        if (!n || avQuieto(a)) return;
        var ps = [];
        if (a.n && q.n) ps.push(q.n + (q.n === 1 ? ' pedido novo' : ' pedidos novos'));
        if (a.c && q.c) ps.push(q.c + (q.c === 1 ? ' comprovante' : ' comprovantes') + ' para conferir');
        if (a.x && q.x) ps.push(q.x + (q.x === 1 ? ' cancelamento' : ' cancelamentos'));
        corpo = ps.join(' · ');
      }
      avTocar(q ? (q.n && a.n ? a.sn : q.c && a.c ? a.sc : a.sx) : a.sn);
      if (!('Notification' in window)) return;
      var mostra = function () {
        try {
          var nt = new Notification(titulo, { body: corpo, silent: true });
          nt.onclick = function () {
            try {
              window.focus();
            } catch (e) {}
            setView('ped');
          };
        } catch (e) {}
      };
      if (Notification.permission === 'granted') mostra();
      else if (Notification.permission === 'default')
        Notification.requestPermission().then(function (p) {
          if (p === 'granted') mostra();
        });
    } catch (e) {}
  }
  // Cartão "Sons e avisos" em Ajustes: cada tipo de aviso com o seu som (ou sem som).
  var AV_GRUPOS = [['Pedidos do site', ['n', 'c', 'p', 'x']], ['Estoque e dinheiro', ['v', 'd']]];
  // faixa do dia: rosa = silencioso (atravessa a meia-noite quando começa depois de terminar)
  function avFaixa(a) {
    var i = avMin(a.qi) / 14.4,
      f = avMin(a.qf) / 14.4,
      r = 'var(--accent)',
      n = 'var(--line)';
    return i > f ? 'linear-gradient(90deg,' + r + ' 0 ' + f + '%,' + n + ' ' + f + '% ' + i + '%,' + r + ' ' + i + '%)' : 'linear-gradient(90deg,' + n + ' 0 ' + i + '%,' + r + ' ' + i + '% ' + f + '%,' + n + ' ' + f + '%)';
  }
  // 87 (aprovado): cada aviso é UMA linha — título, o som escolhido como frase e o interruptor; tocar na linha abre a janela "Som".
  var AV_PLAY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linejoin="round" aria-hidden="true"><path d="M8 5.5v13l10-6.5z"/></svg>';
  function avLn(k, tit, frase, on, abre) {
    return (
      '<div class="avLn' + (on ? '' : ' off') + '">' +
      (abre ? '<button type="button" class="avLnB" data-av="escolher" data-v="' + k + '" aria-label="Escolher o som de ' + tit + '">' : '<span class="avLnB">') +
      '<b>' + tit + '</b><small>' + frase + '</small>' + (abre ? '</button>' : '</span>') +
      '<span class="sw"><input type="checkbox" role="switch" data-av="' + k + '"' + (on ? ' checked' : '') + ' aria-label="' + tit + '"><i></i></span></div>'
    );
  }
  function avPedidosHtml() {
    var a = avPref(),
      grupos = AV_GRUPOS.map(function (g) {
        return '<div class="lbl avLb">' + g[0] + '</div>' + g[1].map(function (k) {
          var t = AV_TIPOS.filter(function (x) { return x[0] === k; })[0];
          return avLn(k, t[1], avNome(a['s' + k]), a[k], true);
        }).join('');
      }).join('');
    return (
      '<section class="col avCol" id="avisosCard">' +
      grupos +
      '<div class="lbl avLb">Silêncio</div>' + avLn('q', 'Silêncio fora do horário', 'Sem som nem vibração', a.q, false) +
      (a.q
        ? '<div class="avhr"><input class="in" type="time" data-av="qi" value="' + a.qi + '" aria-label="Começa às"><span class="hint" style="margin:0">até</span><input class="in" type="time" data-av="qf" value="' + a.qf + '" aria-label="Termina às"></div>' +
          '<div class="avdia" style="background:' + avFaixa(a) + '"></div><div class="avdl"><span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>24h</span></div>'
        : '') +
      '<div class="lbl avLb">Testar</div>' +
      '<button type="button" class="mini avTs" data-av="teste">Enviar aviso de teste</button><div class="hint" id="avmsg" style="margin:0" hidden></div></section>'
    );
  }
  // Janela de baixo "Som · <aviso>": os sons em linhas de bolinha, cada uma com ▶ para ouvir; "Salvar" guarda (regra 15).
  function avSomJanela(k) {
    var t = AV_TIPOS.filter(function (x) { return x[0] === k; })[0];
    if (!t) return;
    var cur = avPref()['s' + k],
      sel = cur;
    lfJanela({
      titulo: 'Som · ' + t[1],
      mudou: function () { return sel !== cur; },
      monta: function (c, api) {
        var pinta = function () {
          c.innerHTML = AV_SONS.map(function (x) {
            return '<div class="avSom"><button type="button" class="pxL" role="radio" aria-checked="' + (x[0] === sel) + '" data-som="' + x[0] + '"><i class="pxR" aria-hidden="true"></i><span class="pxT"><b>' + x[1] + '</b></span></button>' +
              (x[0] === 'mudo' ? '' : '<button type="button" class="avPl" data-av="ouvir" data-v="' + x[0] + '" aria-label="Ouvir ' + x[1] + '">' + AV_PLAY + '</button>') + '</div>';
          }).join('') + '<button type="button" class="go avSalva">Salvar</button>';
          c.querySelectorAll('[data-som]').forEach(function (b) {
            b.onclick = function () { sel = b.getAttribute('data-som'); avTocar(sel); pinta(); };
          });
          c.querySelector('.avSalva').onclick = function () {
            S.avisos = S.avisos || {};
            // ao mexer num tipo, os outros fixam o som que já tinham (assim o "som único" antigo não muda sozinho)
            var at = avPref();
            AV_TIPOS.forEach(function (x) { S.avisos['s' + x[0]] = at['s' + x[0]]; });
            S.avisos['s' + k] = sel;
            api.fecha(true);
            avSalvou(true);
          };
        };
        pinta();
      }
    });
  }
  function avSalvou(canal) {
    S._ajForce = true;
    saveSoon();
    if (canal) avCanal();
    pushSalvar();
    render();
  }
  // Cartão de aviso dentro do app (mesmo desenho do aviso de teste): ícone, título, texto embaixo e hora.
  var AV_IC = { teste: ICO.sino, novo: ICO.sacola, comp: ICO.recibo, cancel: ICO.alerta, pago: ICO.chk };
  function avDentro(titulo, corpo, tipo) {
    var velho = document.getElementById('avDentro');
    if (velho) velho.remove();
    var b = document.createElement('div');
    b.id = 'avDentro';
    b.className = 'avdentro';
    b.setAttribute('role', 'status');
    var t = String(titulo || '').replace(/^[^\wÀ-ÿ]+/, '');
    var d = new Date();
    b.innerHTML = '<span class="adi">' + (AV_IC[tipo] || ICO.sino) + '</span><span class="adt"><b>' + esc(t) + '</b>' + (corpo ? '<span>' + esc(corpo) + '</span>' : '') + '</span><small>agora</small><i class="adb"></i>';
    b.addEventListener('click', function () {
      b.remove();
      if (tipo && tipo !== 'teste') setView('ped');
    });
    document.body.appendChild(b);
    setTimeout(function () {
      b.classList.add('sai');
      setTimeout(function () { if (b.parentNode) b.remove(); }, 400);
    }, 4000);
  }
  function avTeste() {
    var a = avPref(),
      nat = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform(),
      m = $('avmsg');
    if (nat) {
      nvApi('POST', 'pedidos?documentId=' + encodeURIComponent('teste' + Date.now().toString(36)), JSON.stringify({ fields: { tipo: { stringValue: 'cancel' }, ref: { stringValue: 'teste' }, cod: { stringValue: 'TESTE' }, ts: { integerValue: String(Date.now()) } } }))
        .then(function () {
          if (m) {
            m.textContent = 'Teste enviado. O aviso chega em instantes.';
            m.hidden = false;
          }
        })
        .catch(function () {
          if (m) {
            m.textContent = 'Não consegui enviar o teste. Confira se você está logado na nuvem.';
            m.hidden = false;
          }
        });
      return;
    }
    avTocar(a.sn);
    avDentro('Aviso de teste', 'Assim chegam os avisos neste aparelho.', 'teste');
    try {
      if ('Notification' in window) {
        var go = function () {
          new Notification('La Fouch · teste', { body: 'Assim chegam os avisos neste computador.', silent: true });
        };
        if (Notification.permission === 'granted') go();
        else if (Notification.permission === 'default')
          Notification.requestPermission().then(function (p) {
            if (p === 'granted') go();
          });
      }
    } catch (e) {}
    if (m) {
      m.textContent = 'Teste feito neste computador.';
      m.hidden = false;
    }
  }
  document.addEventListener('change', function (ev) {
    var t = ev.target,
      k = t.getAttribute && t.getAttribute('data-av');
    if (!k || k === 'teste' || k === 'escolher' || k === 'ouvir') return;
    S.avisos = S.avisos || {};
    S.avisos[k] = t.type === 'checkbox' ? t.checked : t.value;
    avSalvou(false);
  });
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('[data-av]');
    if (!b || b.tagName === 'INPUT') return;
    var k = b.getAttribute('data-av');
    if (k === 'escolher') {
      avSomJanela(b.getAttribute('data-v'));
    } else if (k === 'ouvir') {
      avTocar(b.getAttribute('data-v'));
      if (!b.classList.contains('tocando')) { var o = b.innerHTML; b.classList.add('tocando'); b.innerHTML = '<span class="eq"><b></b><b></b><b></b></span>'; setTimeout(function () { b.classList.remove('tocando'); b.innerHTML = o; }, 1500); }
    } else if (k === 'teste') {
      var rg = b.querySelector('.ring');
      if (rg) { rg.classList.remove('tocando2'); void rg.offsetWidth; rg.classList.add('tocando2'); }
      avTeste();
    }
  });
  window.__avTocaTipo = avTocaTipo;
  window.__avDentro = avDentro;
  window.__pushIniciar = pushIniciar;
  window.__avisoLocal = avisoLocal;
  setTimeout(pushIniciar, 5000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) pushIniciar();
  });
