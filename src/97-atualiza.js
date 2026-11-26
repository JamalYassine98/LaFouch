  // ===== Atualização ao vivo do app (26/11, work/esboco/atualiza/COMO-FAZER-ATUALIZA-AO-VIVO.md): o app INTEIRO troca e vira a base. =====
  // A cada versão o GitHub Pages publica www-<v>.zip (a pasta www inteira) e o version.json traz zip + soma (sha256) — tools/pacote.js.
  //  · celular (APK): o plugin CapacitorUpdater baixa o pacote e confere a soma; "Atualizar agora" troca para ele. Se a versão nova
  //    não disser "pronto" em 10 s, o próprio plugin volta para a ÚLTIMA versão que abriu bem (nunca para a cópia do APK).
  //  · PC (Windows): o servidor local (desktop/pc-atualiza.js) baixa o MESMO pacote e serve o app inteiro da última pasta boa.
  //  · navegador (PWA): segue com o sw.js; "Atualizar agora" só recarrega.
  // "Abriu bem" = appPronto(), UM lugar só, no fim do primeiro desenho (não por tempo). No aparelho ficam no máximo duas versões.
  var UPD_URL = 'https://jamalyassine98.github.io/LaFouch/';
  var UPD = { pronta: 0, msg: '', busy: false, nat: false, t: 0, ok: false, ult: 0 };
  function updCU() { // o plugin da atualização ao vivo (só no APK novo)
    var C = window.Capacitor;
    return C && C.isNativePlatform && C.isNativePlatform() && C.Plugins && C.Plugins.CapacitorUpdater || null;
  }
  function updModo() { return updCU() ? 'apk' : location.hostname === '127.0.0.1' ? 'pc' : 'web'; }
  // o pacote baixado e ainda não aplicado (ou recém-aplicado): {v, nome, notas, id, usou}
  function updMarca() {
    try { return JSON.parse(localStorage.getItem('lf_pacote') || 'null') || {}; } catch (e) { return {}; }
  }
  function updGuarda(m) { try { if (m) localStorage.setItem('lf_pacote', JSON.stringify(m)); else localStorage.removeItem('lf_pacote'); } catch (e) {} }
  function updPc(caminho) { // pedidos ao servidor local do PC (desktop/pc-atualiza.js); o "pronto" mora em /__pronto
    return fetch(caminho === 'pronto' ? '/__pronto' : '/__pc/' + caminho, { method: 'POST', headers: { 'X-LaFouch': '1' }, cache: 'no-store' })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j && j.erro || 'http ' + r.status); return j; }); });
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
    b.innerHTML = '<span style="flex:1;font-size:14px"><b>Atualização pronta</b><br><span style="opacity:.75">O app novo já foi baixado.</span></span><button type="button" class="updbtn" data-act="updagora">⬇ Atualizar</button><button type="button" class="pdLink" data-act="updmais" aria-label="Depois">Depois</button>';
  }
  // baixa o pacote da versão v (cada aparelho do seu jeito); devolve o id do pacote no celular
  function updBaixa(v) {
    var md = updModo(), n = +v.v;
    if (md === 'apk') {
      if (String(v.zip || '').indexOf(UPD_URL) !== 0 || !/^[0-9a-f]{64}$/.test(String(v.soma || ''))) return Promise.reject(new Error('pacote sem endereço ou soma'));
      return updCU().download({ url: v.zip, version: String(n), checksum: v.soma }).then(function (b) { return b && b.id; });
    }
    if (md === 'pc') return updPc('baixa').then(function (e) { if (+e.pronta !== n) throw new Error('pacote não ficou pronto'); return ''; });
    return navigator.serviceWorker && navigator.serviceWorker.getRegistration
      ? navigator.serviceWorker.getRegistration().then(function (r) { return r && r.update(); }).then(function () { return ''; }, function () { return ''; })
      : Promise.resolve('');
  }
  // Busca a versão nova. manual = o dono apertou "Buscar atualização".
  function updBusca(manual) {
    if (UPD.busy || !navigator.onLine) {
      if (manual && !navigator.onLine) { UPD.msg = 'Sem internet agora.'; updRender(); }
      return Promise.resolve();
    }
    UPD.busy = true;
    UPD.ok = false;
    UPD.t = Date.now();
    var fim = function (m) {
      UPD.busy = false;
      if (manual || m) UPD.msg = m || UPD.msg;
      updRender();
    };
    return fetch(UPD_URL + 'version.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (v) {
        var n = +v.v || 0, nm = String(v.nome || n), nt = Array.isArray(v.notas) ? v.notas.slice(0, 6).map(String) : [];
        UPD.ult = Date.now();
        UPD.nat = (+v.nat || 1) > APP_NAT;
        if (UPD.nat) return fim('Há uma versão nova, mas ela precisa de um APK novo (pedir ao Claude para gerar).');
        var m = updMarca();
        if (n <= APP_BUILD || n === +m.ruim || (n <= (+m.v || 0) && !m.usou)) {
          UPD.pronta = n <= APP_BUILD ? 0 : UPD.pronta;
          UPD.ok = n <= APP_BUILD;
          return fim('O app já está na versão mais nova (' + APP_BUILD + ').');
        }
        return updBaixa(v).then(function (id) {
          updGuarda({ v: n, nome: nm, notas: nt, id: id || '' });
          UPD.pronta = n;
          updAviso();
          if (S.view === 'ajustes') updRender(); else render();
          fim('Atualização ' + n + ' pronta. Toque em "Atualizar agora".');
        });
      })
      .catch(function (e) { fim(manual ? 'Não consegui buscar agora (' + ((e && e.message) || 'erro') + '). Tente de novo mais tarde.' : ''); });
  }
  ACT.updbusca = function () { UPD.msg = ''; updBusca(true); apkBusca(true); updRender(); };
  // Janela de atualização: confirmar (com o que muda) -> atualizando (barra) -> pronto.
  ACT.updagora = function () {
    var m = updMarca(), v = UPD.pronta || +m.v || 0, nt = (m.notas || []).map(function (t) { return '<div style="display:flex;gap:8px"><span style="color:var(--accent-fg)">•</span><span>' + esc(t) + '</span></div>'; }).join('');
    lfaAbre('lfUpdSh',
      '<h2 style="margin:0;font-family:var(--display);font-weight:400;font-size:20px">Atualizar o La Fouch?</h2><div class="hint" style="margin:0">Versão ' + v + '</div>' +
      (nt ? '<div style="display:flex;flex-direction:column;gap:6px;font-size:14px">' + nt + '</div>' : '') +
      '' +
      '<button type="button" class="bsolid c" data-act="updgo">Atualizar agora</button><button type="button" class="pdLink" data-act="updnao" style="align-self:center">Agora não</button>');
  };
  ACT.updmais = function () { var b = document.getElementById('updBar'); if (b) b.remove(); lfToast('Fica guardado em Notificações, no sino', 'neutro'); render(); }; // "Depois": a faixa some, o aviso fica em Notificações e no sino
  ACT.updnao = function () { lfaFecha('lfUpdSh'); ACT.updmais(); };
  ACT.updgo = function () {
    var v = UPD.pronta || +updMarca().v || 0;
    lfaAbre('lfUpdSh',
      '<div style="text-align:center;padding:14px 0"><h2 style="margin:0 0 4px;font-family:var(--display);font-weight:400;font-size:20px">Atualizando…</h2><div class="hint" style="margin:0">Não feche o app</div><div style="height:8px;border-radius:6px;background:var(--line);overflow:hidden;margin:16px 0 4px"><b id="lfUpdPb" style="display:block;height:100%;width:6%;background:var(--accent);border-radius:6px;transition:width 1.3s ease"></b></div></div>');
    setTimeout(function () { var b = document.getElementById('lfUpdPb'); if (b) b.style.width = '100%'; }, 60);
    setTimeout(function () {
      var m = updMarca(), md = updModo();
      m.usou = 1;
      updGuarda(m);
      try { sessionStorage.setItem('lf_ni', '1'); } catch (e) {}
      var falhou = function (e) { m.usou = 0; updGuarda(m); lfaFecha('lfUpdSh'); lfToast('Não consegui trocar a versão (' + ((e && e.message) || 'erro') + ')', 'erro'); };
      if (md === 'apk') updCU().set({ id: m.id }).catch(falhou); // o plugin troca e reabre já na versão nova
      else if (md === 'pc') updPc('usa').then(function () { location.reload(); }, falhou);
      else location.reload();
    }, 1500);
  };
  // Depois de reabrir já na versão nova: confirma que deu certo.
  function updFeito() {
    var m = updMarca();
    if (!m.v || +m.v > APP_BUILD) return;
    updGuarda(null); // o pacote já é a versão em uso
    if (!m.usou) return;
    lfaAbre('lfUpdSh',
      '<div style="text-align:center;padding:10px 0"><div style="width:48px;height:48px;border-radius:50%;border:3px solid var(--ok);color:var(--ok);display:grid;place-items:center;margin:0 auto 10px"><span style="width:24px;height:24px;display:block">' + ICO.chk + '</span></div><h2 style="margin:0 0 4px;font-family:var(--display);font-weight:400;font-size:20px">Pronto, versão ' + APP_NOME + '</h2><div class="hint" style="margin:0 0 14px">Tudo certo.</div><button type="button" class="bsolid c" data-act="updfim">Continuar</button></div>');
  }
  ACT.updfim = function () { lfaFecha('lfUpdSh'); };
  function updPendente() { var m = updMarca(); return Math.max(UPD.pronta || 0, +m.v > APP_BUILD && !m.usou ? +m.v : 0); }
  // Troca só o cartão (sem redesenhar Ajustes inteira, o que repetia a animação da tela toda)
  function updRender() {
    var c = document.getElementById('updCard');
    if (c && S.view === 'ajustes') c.outerHTML = updCard();
  }
  // S374 (esboço 75v, aprovado 16/11 18:33): um botão só que muda no lugar — contorno neutro; ao buscar fica rosa com o anel fino
  // girando e "Procurando…"; achou nada: "✓ Você está na versão mais nova" (o ✓ se desenha) + "agora mesmo"; achou: principal rosa.
  // A troca de texto entra subindo 4 px (~0,2 s). Classe .up75 + estado (p75 parado · b75 busca · k75 ok · n75 novo/APK).
  var UP75_ULT = '';
  function updBotao75(est, ak, tit, sub) {
    var st = ak ? (ak === 'baixa' ? 'b' : 'n') : { busca: 'b', ok: 'k', novo: 'n', parado: 'p' }[est],
      txt = st === 'b' ? (ak ? tit : 'Procurando…') : st === 'k' ? 'Você está na versão mais nova' : st === 'n' ? (ak ? tit : 'Atualizar para ' + esc((updMarca().nome || UPD.pronta || '')) ) + ' ›' : 'Buscar atualização',
      ico = st === 'b' ? '<i class="rg75" aria-hidden="true"></i>' : st === 'k' ? '<svg class="ck75" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg>' : '',
      muda = UP75_ULT && UP75_ULT !== st;
    UP75_ULT = st;
    return '<button type="button" class="mini up75 ' + st + '75' + (muda ? ' in75' : '') + '" data-act="' + (ak ? 'apkgo' : est === 'novo' ? 'updagora' : 'updbusca') + '"' + (st === 'b' ? ' disabled' : '') + '><span class="l75">' + ico + '<span>' + txt + '</span></span></button>' +
      (st === 'k' ? '<div class="s75' + (muda ? ' in75' : '') + '">' + (UPD.ult ? 'agora mesmo' : 'Versão ' + esc(APP_NOME)) + '</div>' : st === 'n' || st === 'b' ? '<div class="s75">' + esc(sub) + '</div>' : '');
  }
  function updCard() {
    var m = updMarca(),
      novo = UPD.pronta || (+m.v > APP_BUILD ? +m.v : 0),
      est = UPD.busy ? 'busca' : novo ? 'novo' : UPD.ok ? 'ok' : 'parado',
      ico = est === 'busca' ? '<span class="lfa-spin">↻</span>' : est === 'novo' ? '⬇' : est === 'ok' ? ICO.chk : '↻',
      tit = { busca: 'Buscando…', novo: 'Atualização ' + esc(m.nome || novo) + ' pronta', ok: 'Você está na versão mais nova', parado: 'Buscar atualização' }[est],
      sub = { busca: 'Procurando versão nova', novo: 'Toque para instalar', ok: 'Versão ' + APP_NOME + (UPD.ult ? ' · agora mesmo' : ''), parado: 'Toque para procurar agora' }[est],
      ult = UPD.ult ? 'Última busca ' + fh(UPD.ult) : '';
    // S335 (15/11/2026, pedido do dono): um botão só. O APK novo aparece NESTE botão, como uma atualização qualquer, e tem prioridade (ele já traz a atualização normal dentro).
    var ak = APK.n ? APK.est : '', mb = (APK.tam / 1048576).toFixed(0) + ' MB';
    if (ak) {
      ico = ak === 'baixa' ? '<span class="lfa-spin">↻</span>' : '⬇';
      tit = { tem: 'Atualização disponível', erro: 'Atualização disponível', baixa: 'Baixando a atualização…', pronto: 'Atualização pronta' }[ak];
      sub = { tem: 'Toque para baixar · ' + mb, erro: 'Toque para baixar · ' + mb, baixa: mb + ' · pode continuar usando', pronto: 'Toque para instalar' }[ak];
    }
    return '<section class="card col" id="updCard"><h2 style="margin:0;font-size:16px">Atualização do app</h2>' +
      '' +
      '<div class="vrow"><span>Versão <b>' + esc(APP_NOME) + '</b> <small>(' + APP_BUILD + ')</small></span><span>' + ult + '</span></div>' +
      updBotao75(est, ak, tit, sub) +
      (ak ? apkLinha() : UPD.msg && est !== 'ok' && est !== 'busca' && est !== 'novo' ? '<div class="note n-info" role="status">' + esc(UPD.msg) + '</div>' : '') + '</section>';
  }
  // A versão abriu bem: o primeiro desenho terminou (UM lugar só, celular e PC). Sem isso em 10 s, volta para a última boa.
  var UPD_BOAS = 'lf_boas'; // ids dos pacotes que abriram bem no celular (o atual e o anterior)
  function updLimpa() { // no celular ficam no máximo duas versões: a atual e a reserva recente
    var CU = updCU();
    return CU.current().then(function (c) {
      var id = c && c.bundle && c.bundle.id, boas = [];
      try { boas = JSON.parse(localStorage.getItem(UPD_BOAS) || '[]'); } catch (e) {}
      if (id && id !== 'builtin') boas = [id].concat(boas.filter(function (x) { return x !== id; })).slice(0, 2);
      try { localStorage.setItem(UPD_BOAS, JSON.stringify(boas)); } catch (e) {}
      return CU.list().then(function (l) {
        return Promise.all(((l && l.bundles) || []).filter(function (b) { return b.id !== 'builtin' && boas.indexOf(b.id) < 0 && b.id !== updMarca().id; })
          .map(function (b) { return CU.delete({ id: b.id }).catch(function () {}); }));
      });
    }).catch(function () {});
  }
  var updProntoFoi = false;
  function appPronto() {
    if (updProntoFoi) return;
    updProntoFoi = true;
    var md = updModo();
    if (md === 'apk') updCU().notifyAppReady().then(updLimpa, function () {});
    else if (md === 'pc') updPc('pronto').catch(function () {});
    // uma vez: some o mecanismo velho (cópia de app.js/style.css no cache e as marcas dele)
    try { localStorage.removeItem('lf_upd'); localStorage.removeItem('lf_updok'); } catch (e) {}
    try { if (window.caches) caches.delete('lafouch-upd'); } catch (e) {}
    var m = updMarca();
    // trocou para a nova, mas ela não abriu e o aparelho voltou para a última boa: não baixa essa de novo
    if (m.usou && +m.v > APP_BUILD) { updGuarda({ ruim: +m.v }); try { lfToast('A versão ' + (m.nome || m.v) + ' não abriu; ficou a anterior', 'neutro'); } catch (e) {} return; }
    updFeito();
    if (+m.v > APP_BUILD && !m.usou) { UPD.pronta = +m.v; updAviso(); }
  }
  aposRender(appPronto);
  if (!/#test/.test(location.hash)) {
    setTimeout(function () { updBusca(false); }, 25000);
    setInterval(function () { if (!document.hidden && Date.now() - UPD.t > 4 * 3600 * 1000) updBusca(false); }, 600000);
  }
  if (/#test/.test(location.hash)) window.__upd = { busca: updBusca, card: updCard, estado: UPD, marca: updMarca, pronto: appPronto };
