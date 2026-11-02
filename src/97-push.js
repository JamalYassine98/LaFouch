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
  var AV_SONS = [
    ['sino', 'Sino'],
    ['caixa', 'Caixa registradora'],
    ['campainha', 'Campainha'],
    ['suave', 'Suave'],
    ['mudo', 'Sem som']
  ];
  // Preferências deste aparelho (n=pedido novo, c=comprovante, x=cancelamento, p=pagamento aprovado).
  function avPref() {
    var a = S.avisos || {};
    return { n: a.n !== false, c: a.c !== false, x: a.x !== false, p: a.p !== false, som: a.som || 'sino', q: !!a.q, qi: a.qi || '18:00', qf: a.qf || '07:00' };
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
    var PN = pushPlugin(),
      a = avPref();
    if (!PN || !PN.createChannel) return;
    var mudo = a.som === 'mudo',
      nome = (AV_SONS.filter(function (x) { return x[0] === a.som; })[0] || ['', ''])[1];
    var c = { id: 'pedidos_' + a.som, name: 'Pedidos do site · ' + nome, description: 'Pedido novo, comprovante e cancelamento', importance: mudo ? 3 : 5, visibility: 1, vibration: true };
    if (!mudo) c.sound = a.som + '.mp3';
    try {
      PN.createChannel(c);
    } catch (e) {}
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
        fields: { ts: { integerValue: String(Date.now()) }, plat: T('android'), email: T(S.nuvem.email || ''), n: B(a.n), c: B(a.c), x: B(a.x), p: B(a.p), som: T(a.som), q: B(a.q), qi: T(a.qi), qf: T(a.qf) }
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
      avTocar(a.som);
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
  // Cartão "Avisos de pedidos" em Ajustes.
  function avPedidosHtml() {
    var a = avPref(),
      nat = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform(),
      row = function (k, t, h) {
        return (
          '<label class="swrow"><span>' + t + '<div class="hint" style="margin:2px 0 0;font-weight:400">' + h + '</div></span><span class="sw"><input type="checkbox" role="switch" data-av="' + k + '"' + (a[k] ? ' checked' : '') + ' aria-label="' + t + '"><i></i></span></label>'
        );
      };
    var chips = AV_SONS.map(function (x) {
      var on = a.som === x[0];
      return (
        '<button type="button" class="avchip' + (on ? ' on' : '') + '" data-av="som" data-v="' + x[0] + '"><span style="font-size:12px">' + (x[0] === 'mudo' ? '✕' : '▶') + '</span>' + x[1] + (on ? ' ✓' : '') + '</button>'
      );
    }).join('');
    return (
      '<section class="card col" id="avisosCard" style="gap:14px"><div><h2 style="margin:0;font-size:16px">Avisos de pedidos</h2><div class="hint" style="margin:2px 0 0">Vale só para este aparelho: <b>' +
      (nat ? 'Celular (Android)' : 'Este computador') +
      '</b></div></div>' +
      row('n', 'Pedido novo', 'Cliente fez um pedido no site') +
      row('c', 'Comprovante enviado', 'Cliente mandou o comprovante para conferir') +
      row('x', 'Cliente cancelou', 'Cancelamento feito pelo site') +
      row('p', 'Pagamento aprovado', 'Quando o Pagopar estiver ligado') +
      '<div><div class="lbl">Som do aviso</div><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">' +
      chips +
      '</div><div class="hint" style="margin:6px 0 0">Toque no nome para ouvir.</div></div>' +
      row('q', 'Silêncio fora do horário', 'Sem aviso das ' + a.qi + ' às ' + a.qf) +
      (a.q
        ? '<div style="display:flex;gap:10px;align-items:center"><span class="hint" style="margin:0">Das</span><input class="in" type="time" data-av="qi" value="' + a.qi + '" style="max-width:130px"><span class="hint" style="margin:0">às</span><input class="in" type="time" data-av="qf" value="' + a.qf + '" style="max-width:130px"></div>'
        : '') +
      '<button type="button" class="btn" data-av="teste" style="width:100%">Enviar aviso de teste</button><div class="hint" id="avmsg" style="margin:0" hidden></div></section>'
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
    avTocar(a.som);
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
    if (!k || k === 'som' || k === 'teste') return;
    S.avisos = S.avisos || {};
    S.avisos[k] = t.type === 'checkbox' ? t.checked : t.value;
    avSalvou(false);
  });
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('button[data-av]');
    if (!b) return;
    var k = b.getAttribute('data-av');
    if (k === 'som') {
      S.avisos = S.avisos || {};
      S.avisos.som = b.getAttribute('data-v');
      avTocar(S.avisos.som);
      avSalvou(true);
    } else if (k === 'teste') avTeste();
  });
  window.__pushIniciar = pushIniciar;
  window.__avisoLocal = avisoLocal;
  setTimeout(pushIniciar, 5000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) pushIniciar();
  });
