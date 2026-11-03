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
  // Tipos de aviso: letra, título, explicação, som de fábrica
  var AV_TIPOS = [
    ['n', 'Pedido novo', 'Cliente fez um pedido no site', 'caixa'],
    ['c', 'Comprovante enviado', 'Cliente mandou o comprovante para conferir', 'sino'],
    ['p', 'Pagamento aprovado', 'Quando o Pagopar estiver ligado', 'moeda'],
    ['x', 'Cliente cancelou', 'Cancelamento feito pelo site', 'suave'],
    ['v', 'Peça voltou', 'Peça esgotada voltou ao estoque (lista de espera)', 'suave'],
    ['d', 'Dólar barato', 'Bom momento para trocar dinheiro', 'mudo']
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
      o['s' + t[0]] = a['s' + t[0]] || (a.som && t[0] !== 'd' ? a.som : t[3]);
    });
    o.som = o.sn;
    return o;
  }
  function avSomDe(tipo) {
    return avPref()['s' + tipo] || 'sino';
  }
  // Toca o som do tipo, respeitando ligado/desligado e o horário silencioso.
  function avTocaTipo(tipo) {
    var a = avPref();
    if (a[tipo] === false || !a[tipo] || avQuieto(a)) return;
    avTocar(a['s' + tipo]);
  }
  function avMin(h) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(h || '');
    return m ? +m[1] * 60 + +m[2] : 0;
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
      PN.addListener('pushNotificationReceived', function () {
        if (window.__pedSync) window.__pedSync();
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
  var AV_ICO = { n: '🛒', c: '🧾', p: '✓', x: '✕', v: '📦', d: '$' };
  var AV_GRUPOS = [['Pedidos do site', ['n', 'c', 'p', 'x']], ['Estoque e dinheiro', ['v', 'd']]];
  function avMin(h) {
    var m = /^(\d{1,2}):(\d{2})/.exec(h || '');
    return m ? Math.min(1440, +m[1] * 60 + +m[2]) : 0;
  }
  // faixa do dia: rosa = silencioso (atravessa a meia-noite quando começa depois de terminar)
  function avFaixa(a) {
    var i = avMin(a.qi) / 14.4,
      f = avMin(a.qf) / 14.4,
      r = 'var(--accent)',
      n = 'var(--line)';
    return i > f ? 'linear-gradient(90deg,' + r + ' 0 ' + f + '%,' + n + ' ' + f + '% ' + i + '%,' + r + ' ' + i + '%)' : 'linear-gradient(90deg,' + n + ' 0 ' + i + '%,' + r + ' ' + i + '% ' + f + '%,' + n + ' ' + f + '%)';
  }
  function avLinha(t, a) {
    var k = t[0],
      mudo = a['s' + k] === 'mudo';
    return (
      '<div class="avcard' + (a[k] ? '' : ' off') + '"><div class="avtop"><span class="avico">' + AV_ICO[k] + '</span><span class="avtx"><b>' + t[1] + '</b><span class="hint" style="margin:2px 0 0;font-weight:400;display:block">' + t[2] + '</span></span>' +
      '<span class="sw"><input type="checkbox" role="switch" data-av="' + k + '"' + (a[k] ? ' checked' : '') + ' aria-label="' + t[1] + '"><i></i></span></div>' +
      '<div class="avbot"><button type="button" class="avchip' + (a[k] && !mudo ? ' on' : '') + '" data-av="escolher" data-v="' + k + '" aria-label="Escolher o som de ' + t[1] + '">' + (mudo ? '🔕' : '🔔') + ' ' + avNome(a['s' + k]) + ' <i>▾</i></button>' +
      (mudo ? '' : '<button type="button" class="avplay" data-av="ouvir" data-v="' + a['s' + k] + '" aria-label="Ouvir o som de ' + t[1] + '">▶</button>') + '</div></div>'
    );
  }
  function avPedidosHtml() {
    var a = avPref(),
      nat = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform(),
      grupos = AV_GRUPOS.map(function (g) {
        return '<div class="lbl" style="margin:6px 0 0">' + g[0] + '</div>' + g[1].map(function (k) {
          return avLinha(AV_TIPOS.filter(function (t) { return t[0] === k; })[0], a);
        }).join('');
      }).join('');
    return (
      '<section class="card col" id="avisosCard" style="gap:10px"><div><h2 style="margin:0;font-size:16px">Sons e avisos</h2><div class="hint" style="margin:2px 0 0">Vale só para este aparelho: <b>' +
      (nat ? 'Celular (Android)' : 'Este computador') +
      '</b>. Toque no som para trocar, em ▶ para ouvir; a chave liga ou desliga o aviso.</div></div>' +
      grupos +
      '<div class="lbl" style="margin:6px 0 0">Silêncio</div><div class="avcard' + (a.q ? '' : ' off') + '"><div class="avtop"><span class="avico">🌙</span><span class="avtx"><b>Silêncio fora do horário</b><span class="hint" style="margin:2px 0 0;font-weight:400;display:block">Sem som nem vibração</span></span><span class="sw"><input type="checkbox" role="switch" data-av="q"' + (a.q ? ' checked' : '') + ' aria-label="Silêncio fora do horário"><i></i></span></div>' +
      (a.q
        ? '<div class="avhr"><input class="in" type="time" data-av="qi" value="' + a.qi + '" aria-label="Começa às"><span class="hint" style="margin:0">até</span><input class="in" type="time" data-av="qf" value="' + a.qf + '" aria-label="Termina às"></div>' +
          '<div class="avdia" style="background:' + avFaixa(a) + '"></div><div class="avdl"><span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>24h</span></div>' +
          '<div class="hint" style="margin:6px 0 0">Rosa = silencioso. Fora dessa faixa o app avisa normalmente.</div>'
        : '') + '</div>' +
      '<div class="lbl" style="margin:6px 0 0">Testar</div>' +
      '<button type="button" class="bsolid" data-av="teste"><span class="bi"><span class="ring">🔔</span></span><span class="bt2"><b>Enviar aviso de teste</b><span>Toca o som de “Pedido novo”</span></span></button><div class="hint" id="avmsg" style="margin:0" hidden></div></section>' +
      avJanelaHtml()
    );
  }
  // Janela para escolher o som de um tipo (toque no ▶ para ouvir antes).
  function avJanelaHtml() {
    var k = S._avSheet;
    if (!k) return '';
    var t = AV_TIPOS.filter(function (x) { return x[0] === k; })[0];
    if (!t) return '';
    var cur = avPref()['s' + k],
      grupo = function (g, nome) {
        var h = nome ? '<div class="lbl" style="margin:12px 0 4px">' + nome + '</div>' : '';
        AV_SONS.filter(function (x) { return x[2] === g; }).forEach(function (x) {
          var on = x[0] === cur;
          h +=
            '<div class="avopt' + (on ? ' on' : '') + '"><button type="button" class="avplay' + (x[0] === 'mudo' ? ' mu' : '') + '" data-av="ouvir" data-v="' + x[0] + '" aria-label="Ouvir ' + x[1] + '">' + (x[0] === 'mudo' ? '🔕' : '▶') + '</button>' +
            '<button type="button" class="avpick" data-av="som" data-t="' + k + '" data-v="' + x[0] + '">' + x[1] + (on ? '<span>✓</span>' : '') + '</button></div>';
        });
        return h;
      };
    return (
      '<div class="pdOv" role="dialog" aria-modal="true" aria-label="Escolher o som" data-av="fechar"><div class="pdSh" style="max-height:82vh;overflow:auto"><div class="pdAl"></div>' +
      '<b style="font-size:19px">Som de “' + t[1] + '”</b>' + grupo(1, 'Clássicos') + grupo(2, 'Novos') + grupo(3, '') +
      '<button type="button" class="btn" data-av="fechar" style="width:100%;margin-top:14px">Pronto</button></div></div>'
    );
  }
  function avSalvou(canal) {
    S._ajForce = true;
    saveSoon();
    if (canal) avCanal();
    pushSalvar();
    render();
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
    if (!k || k === 'som' || k === 'teste' || k === 'escolher' || k === 'ouvir' || k === 'fechar') return;
    S.avisos = S.avisos || {};
    S.avisos[k] = t.type === 'checkbox' ? t.checked : t.value;
    avSalvou(false);
  });
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('[data-av]');
    if (!b || b.tagName === 'INPUT') return;
    var k = b.getAttribute('data-av');
    if (k === 'fechar') {
      if (ev.target !== b && b.classList.contains('pdOv')) return; // toque dentro da folha não fecha
      S._avSheet = null;
      render();
    } else if (k === 'escolher') {
      S._avSheet = b.getAttribute('data-v');
      render();
    } else if (k === 'ouvir') {
      avTocar(b.getAttribute('data-v'));
      if (!b.classList.contains('tocando')) { var o = b.innerHTML; b.classList.add('tocando'); b.innerHTML = '<span class="eq"><b></b><b></b><b></b></span>'; setTimeout(function () { b.classList.remove('tocando'); b.innerHTML = o; }, 1500); }
    }
    else if (k === 'som') {
      S.avisos = S.avisos || {};
      var tp = b.getAttribute('data-t'),
        v = b.getAttribute('data-v');
      // ao mexer num tipo, os outros fixam o som que já tinham (assim o "som único" antigo não muda sozinho)
      var at = avPref();
      AV_TIPOS.forEach(function (x) {
        S.avisos['s' + x[0]] = at['s' + x[0]];
      });
      S.avisos['s' + tp] = v;
      avTocar(v);
      avSalvou(true);
    } else if (k === 'teste') {
      var rg = b.querySelector('.ring');
      if (rg) { rg.classList.remove('tocando2'); void rg.offsetWidth; rg.classList.add('tocando2'); }
      avTeste();
    }
  });
  window.__avTocaTipo = avTocaTipo;
  window.__pushIniciar = pushIniciar;
  window.__avisoLocal = avisoLocal;
  setTimeout(pushIniciar, 5000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) pushIniciar();
  });
