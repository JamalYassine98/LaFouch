  // ===== Atualização automática do app: baixa o app novo (app.js + style.css) e troca ao reabrir. =====
  // O app guarda a cópia nova no cache do aparelho; o carregador do index.html usa a cópia mais nova.
  // Se a cópia nova não abrir (2 tentativas), o carregador descarta e volta para a que veio no aplicativo.
  var UPD_URL = 'https://jamalyassine98.github.io/LaFouch/';
  var UPD_CACHE = 'lafouch-upd';
  var UPD = { pronta: 0, msg: '', busy: false, nat: false, t: 0, ok: false, ult: 0 };
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
    UPD.ok = false;
    UPD.t = Date.now();
    var fim = function (m) {
      UPD.busy = false;
      if (manual || m) UPD.msg = m || UPD.msg;
      if (S.view === 'ajustes') { S._ajForce = true; render(); }
    };
    return fetch(UPD_URL + 'version.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (v) {
        var n = +v.v || 0, nm = String(v.nome || n), nt = Array.isArray(v.notas) ? v.notas.slice(0, 6).map(String) : [];
        UPD.ult = Date.now();
        UPD.nat = (+v.nat || 1) > APP_NAT;
        if (UPD.nat) return fim('Há uma versão nova, mas ela precisa de um APK novo (pedir ao Claude para gerar).');
        var m = updMarca();
        if (n <= APP_BUILD || n <= (+m.v || 0)) {
          UPD.pronta = n <= APP_BUILD ? 0 : UPD.pronta;
          UPD.ok = n <= APP_BUILD;
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
            localStorage.setItem('lf_upd', JSON.stringify({ v: n, tent: 0, notas: nt, nome: nm }));
            UPD.pronta = n;
            updAviso();
            render();
            fim('Atualização ' + n + ' pronta. Toque em "Atualizar agora".');
          });
        });
      })
      .catch(function (e) { fim(manual ? 'Não consegui buscar agora (' + ((e && e.message) || 'erro') + '). Tente de novo mais tarde.' : ''); });
  }
  ACT.updbusca = function () { UPD.msg = ''; updBusca(true); S._ajForce = true; render(); };
  // Janela de atualização: confirmar (com o que muda) -> atualizando (barra) -> pronto.
  ACT.updagora = function () {
    var m = updMarca(), v = UPD.pronta || +m.v || 0, nt = (m.notas || []).map(function (t) { return '<div style="display:flex;gap:8px"><span style="color:var(--accent-fg)">•</span><span>' + esc(t) + '</span></div>'; }).join('');
    lfaAbre('lfUpdSh',
      '<h2 style="margin:0;font-family:var(--display);font-weight:400;font-size:20px">Atualizar o La Fouch?</h2><div class="hint" style="margin:0">Versão ' + v + '</div>' +
      (nt ? '<div style="display:flex;flex-direction:column;gap:6px;font-size:14px">' + nt + '</div>' : '') +
      '<div class="hint" style="margin:0">Leva uns 3 segundos. Suas vendas e seus dados continuam salvos.</div>' +
      '<button type="button" class="btn" data-act="updgo" style="width:100%">Atualizar agora</button><button type="button" class="pdLink" data-act="updnao" style="align-self:center">Agora não</button>');
  };
  ACT.updmais = function () { var b = document.getElementById('updBar'); if (b) b.remove(); lfaToast('<b>Fica guardado</b><br>Está em Notificações, no sino.', 3500); render(); }; // "Depois": a faixa some, o aviso fica em Notificações e no sino
  ACT.updnao = function () { lfaFecha('lfUpdSh'); ACT.updmais(); };
  ACT.updgo = function () {
    var v = UPD.pronta || +updMarca().v || 0;
    lfaAbre('lfUpdSh',
      '<div style="text-align:center;padding:14px 0"><h2 style="margin:0 0 4px;font-family:var(--display);font-weight:400;font-size:20px">Atualizando…</h2><div class="hint" style="margin:0">Não feche o app</div><div style="height:8px;border-radius:6px;background:var(--line);overflow:hidden;margin:16px 0 4px"><b id="lfUpdPb" style="display:block;height:100%;width:6%;background:var(--accent);border-radius:6px;transition:width 1.3s ease"></b></div></div>');
    setTimeout(function () { var b = document.getElementById('lfUpdPb'); if (b) b.style.width = '100%'; }, 60);
    setTimeout(function () {
      try { localStorage.setItem('lf_updok', String(v)); sessionStorage.setItem('lf_ni', '1'); } catch (e) {}
      location.reload();
    }, 1500);
  };
  // Depois de reabrir já na versão nova: confirma que deu certo.
  function updFeito() {
    var ok = 0;
    try { ok = +localStorage.getItem('lf_updok') || 0; } catch (e) {}
    if (!ok) return;
    try { localStorage.removeItem('lf_updok'); } catch (e) {}
    if (ok > APP_BUILD) return;
    lfaAbre('lfUpdSh',
      '<div style="text-align:center;padding:10px 0"><div style="width:48px;height:48px;border-radius:50%;border:3px solid var(--ok);color:var(--ok);display:grid;place-items:center;margin:0 auto 10px;font-size:24px">✓</div><h2 style="margin:0 0 4px;font-family:var(--display);font-weight:400;font-size:20px">Pronto, versão ' + APP_NOME + '</h2><div class="hint" style="margin:0 0 14px">Tudo certo.</div><button type="button" class="btn" data-act="updfim" style="width:100%">Continuar</button></div>');
  }
  ACT.updfim = function () { lfaFecha('lfUpdSh'); };
  function updPendente() { var m = updMarca(); return Math.max(UPD.pronta || 0, +m.v > APP_BUILD ? +m.v : 0); }
  function updCard() {
    var m = updMarca(),
      novo = UPD.pronta || (+m.v > APP_BUILD ? +m.v : 0),
      est = UPD.busy ? 'busca' : novo ? 'novo' : UPD.ok ? 'ok' : 'parado',
      ico = est === 'busca' ? '<span class="lfa-spin">↻</span>' : est === 'novo' ? '⬇' : est === 'ok' ? '✓' : '↻',
      tit = { busca: 'Buscando…', novo: 'Atualização ' + esc(m.nome || novo) + ' pronta', ok: 'Você está na versão mais nova', parado: 'Buscar atualização' }[est],
      sub = { busca: 'Procurando versão nova', novo: 'Toque para instalar', ok: 'Versão ' + APP_NOME + (UPD.ult ? ' · agora mesmo' : ''), parado: 'Toque para procurar agora' }[est],
      ult = UPD.ult ? 'Última busca ' + fh(UPD.ult) : '';
    return '<section class="card col" id="updCard"><h2 style="margin:0;font-size:16px">Atualização do app</h2>' +
      '<div class="hint" style="margin:0">O app procura sozinho (ao abrir e a cada poucas horas) e avisa quando a nova está pronta. Nada muda enquanto você vende.</div>' +
      '<div class="vrow"><span>Versão <b>' + esc(APP_NOME) + '</b> <small>(' + APP_BUILD + ')</small></span><span>' + ult + '</span></div>' +
      '<button type="button" class="bsolid' + (est === 'ok' ? ' ok' : est === 'novo' ? ' new' : '') + '" data-act="' + (est === 'novo' ? 'updagora' : 'updbusca') + '"' + (est === 'busca' ? ' disabled' : '') + '><span class="bi">' + ico + '</span><span class="bt2"><b>' + tit + '</b><span>' + sub + '</span></span></button>' +
      (UPD.msg && est !== 'ok' && est !== 'busca' && est !== 'novo' ? '<div class="note n-info" role="status">' + esc(UPD.msg) + '</div>' : '') + '</section>';
  }
  // Confirma que a cópia baixada abriu bem (zera as tentativas) e agenda as buscas automáticas.
  setTimeout(function () {
    var m = updMarca();
    if (m.v && m.v <= APP_BUILD) { try { localStorage.setItem('lf_upd', JSON.stringify({ v: m.v, tent: 0 })); } catch (e) {} }
    updFeito();
    if (+m.v > APP_BUILD) { UPD.pronta = +m.v; updAviso(); render(); }
  }, 4000);
  if (!/#test/.test(location.hash)) {
    setTimeout(function () { updBusca(false); }, 25000);
    setInterval(function () { if (!document.hidden && Date.now() - UPD.t > 4 * 3600 * 1000) updBusca(false); }, 600000);
  }
  if (/#test/.test(location.hash)) window.__upd = { busca: updBusca, card: updCard, estado: UPD, marca: updMarca };
