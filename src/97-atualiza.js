  // ===== Atualização automática do app: baixa o app novo (app.js + style.css) e troca ao reabrir. =====
  // O app guarda a cópia nova no cache do aparelho; o carregador do index.html usa a cópia mais nova.
  // Se a cópia nova não abrir (2 tentativas), o carregador descarta e volta para a que veio no aplicativo.
  var UPD_URL = 'https://jamalyassine98.github.io/LaFouch/';
  var UPD_CACHE = 'lafouch-upd';
  var UPD = { pronta: 0, msg: '', busy: false, nat: false, t: 0 };
  function updMarca() {
    try { return JSON.parse(localStorage.getItem('lf_upd') || 'null') || {}; } catch (e) { return {}; }
  }
  function updAviso() {
    var b = document.getElementById('updBar');
    if (!UPD.pronta) { if (b) b.remove(); return; }
    if (!b) {
      b = document.createElement('div');
      b.id = 'updBar';
      b.setAttribute('role', 'status');
      b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom,0px));z-index:60;background:var(--card,#1b2027);color:var(--fg,#fff);border:1.5px solid var(--accent,#e6007e);border-radius:14px;padding:10px 12px;display:flex;gap:10px;align-items:center;box-shadow:0 6px 24px rgba(0,0,0,.35)';
      document.body.appendChild(b);
    }
    b.innerHTML = '<span style="flex:1;font-size:14px"><b>Atualização pronta</b><br><span style="opacity:.75">O app novo já foi baixado.</span></span><button type="button" class="btn" data-act="updagora">Atualizar agora</button><button type="button" class="pdLink" data-act="updmais" aria-label="Depois">Depois</button>';
  }
  // Baixa a versão nova. manual = o dono apertou "Buscar atualização".
  function updBusca(manual) {
    if (UPD.busy || !navigator.onLine || !window.caches) {
      if (manual) { UPD.msg = !navigator.onLine ? 'Sem internet agora.' : 'Este aparelho não guarda atualizações.'; if (S.view === 'ajustes') { S._ajForce = true; render(); } }
      return Promise.resolve();
    }
    UPD.busy = true;
    UPD.t = Date.now();
    var fim = function (m) {
      UPD.busy = false;
      if (manual || m) UPD.msg = m || UPD.msg;
      if (S.view === 'ajustes') { S._ajForce = true; render(); }
    };
    return fetch(UPD_URL + 'version.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (v) {
        var n = +v.v || 0;
        UPD.nat = (+v.nat || 1) > APP_NAT;
        if (UPD.nat) return fim('Há uma versão nova, mas ela precisa de um APK novo (pedir ao Claude para gerar).');
        var m = updMarca();
        if (n <= APP_BUILD || n <= (+m.v || 0)) {
          UPD.pronta = n <= APP_BUILD ? 0 : UPD.pronta;
          return fim('O app já está na versão mais nova (' + APP_BUILD + ').');
        }
        return Promise.all([fetch(UPD_URL + 'app.js?v=' + n, { cache: 'no-store' }), fetch(UPD_URL + 'style.css?v=' + n, { cache: 'no-store' })]).then(function (rs) {
          if (!rs[0].ok || !rs[1].ok) throw new Error('arquivo não veio');
          return Promise.all([rs[0].text(), rs[1].text()]);
        }).then(function (t) {
          // confere se veio inteiro e se é mesmo o app (nunca guarda arquivo cortado)
          if (t[0].length < 100000 || t[0].slice(-8).indexOf('})();') < 0 || t[0].indexOf('var APP_BUILD = ' + n + ';') < 0 || t[1].length < 1000) throw new Error('arquivo incompleto');
          return caches.open(UPD_CACHE).then(function (c) {
            return Promise.all([
              c.put('/__upd/app.js', new Response(t[0], { headers: { 'Content-Type': 'text/javascript' } })),
              c.put('/__upd/style.css', new Response(t[1], { headers: { 'Content-Type': 'text/css' } }))
            ]);
          }).then(function () {
            localStorage.setItem('lf_upd', JSON.stringify({ v: n, tent: 0 }));
            UPD.pronta = n;
            updAviso();
            render();
            fim('Atualização ' + n + ' pronta. Toque em "Atualizar agora".');
          });
        });
      })
      .catch(function (e) { fim(manual ? 'Não consegui buscar agora (' + ((e && e.message) || 'erro') + '). Tente de novo mais tarde.' : ''); });
  }
  ACT.updbusca = function () { UPD.msg = 'Buscando…'; S._ajForce = true; render(); updBusca(true); };
  ACT.updagora = function () { location.reload(); };
  ACT.updmais = function () { var b = document.getElementById('updBar'); if (b) b.remove(); render(); }; // "Depois": some a faixa, mas o aviso fica em Notificações (urgente) e no sino
  function updPendente() { var m = updMarca(); return Math.max(UPD.pronta || 0, +m.v > APP_BUILD ? +m.v : 0); }
  function updCard() {
    var m = updMarca(),
      h = '<section class="card col" id="updCard"><h2 style="margin:0;font-size:16px">Atualização do app</h2>';
    h += '<div class="hint">Versão em uso: <b>' + APP_BUILD + '</b>. O app procura sozinho (ao abrir e a cada poucas horas) e avisa quando a nova está pronta; nada muda enquanto você vende.</div>';
    if (UPD.pronta || (+m.v > APP_BUILD)) h += '<div class="note n-ok" role="status"><b>Atualização ' + (UPD.pronta || m.v) + ' pronta.</b> <button type="button" class="pdLink" data-act="updagora">Atualizar agora ›</button></div>';
    if (UPD.msg) h += '<div class="note n-info" role="status">' + esc(UPD.msg) + '</div>';
    return h + '<button type="button" class="btn" data-act="updbusca" style="width:100%">Buscar atualização</button></section>';
  }
  // Confirma que a cópia baixada abriu bem (zera as tentativas) e agenda as buscas automáticas.
  setTimeout(function () {
    var m = updMarca();
    if (m.v && m.v <= APP_BUILD) { try { localStorage.setItem('lf_upd', JSON.stringify({ v: m.v, tent: 0 })); } catch (e) {} }
    if (+m.v > APP_BUILD) { UPD.pronta = +m.v; updAviso(); render(); }
  }, 4000);
  if (!/#test/.test(location.hash)) {
    setTimeout(function () { updBusca(false); }, 25000);
    setInterval(function () { if (!document.hidden && Date.now() - UPD.t > 4 * 3600 * 1000) updBusca(false); }, 600000);
  }
  if (/#test/.test(location.hash)) window.__upd = { busca: updBusca, card: updCard, estado: UPD, marca: updMarca };
