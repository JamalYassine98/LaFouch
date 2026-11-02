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
  function pushSalvar(tok) {
    if (!tok) return;
    PUSH.tok = tok;
    if (!S.nuvem || !S.nuvem.rt) return;
    nvApi(
      'PATCH',
      'dispositivos/' + encodeURIComponent(tok),
      JSON.stringify({ fields: { ts: { integerValue: String(Date.now()) }, plat: { stringValue: 'android' }, email: { stringValue: S.nuvem.email || '' } } })
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
        if (PN.createChannel) PN.createChannel({ id: 'pedidos', name: 'Pedidos do site', description: 'Pedido novo, comprovante e cancelamento', importance: 5, visibility: 1, vibration: true });
        PN.register();
      });
    } catch (e) {
      PUSH.ok = false;
    }
  }
  // Aviso do sistema (Windows/navegador) para pedidos achados pela busca automática.
  function avisoLocal(titulo, corpo) {
    try {
      if (!('Notification' in window)) return;
      var C = window.Capacitor;
      if (C && C.isNativePlatform && C.isNativePlatform()) return;
      var mostra = function () {
        try {
          var n = new Notification(titulo, { body: corpo });
          n.onclick = function () {
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
  window.__pushIniciar = pushIniciar;
  window.__avisoLocal = avisoLocal;
  setTimeout(pushIniciar, 5000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) pushIniciar();
  });
