  // ===== S197 (aprovado 12/11/2026): PIX automático pelo E-MAIL do Nubank (robô do Gmail + função "pix") =====
  // Não depende da notificação do celular. O app só:
  //  1) pedido do site: vê na reserva que o robô confirmou (reservas/{id}.pixAuto) e fecha o pedido como pago, sem mudar a tela;
  //  2) venda da loja (Venda · PIX em reais): registra a espera (pixEspera/L…) com o valor; quando o robô confirma, marca a venda;
  //  3) PIX sem par (valor que não bateu com nada ou bateu com 2): guarda em S.pixSemPar para o guardião avisar.
  S.pixEsp = S.pixEsp || {}; // chave do carrinho → { ts, brl, ok }
  S.pixSemPar = S.pixSemPar || [];
  var PIXM_H = 2 * 3600000;
  function pxFv(v) {
    if (!v) return null;
    if ('stringValue' in v) return v.stringValue;
    if ('integerValue' in v) return +v.integerValue;
    if ('doubleValue' in v) return +v.doubleValue;
    if ('booleanValue' in v) return v.booleanValue;
    if ('mapValue' in v) { var o = {}; Object.keys((v.mapValue || {}).fields || {}).forEach(function (k) { o[k] = pxFv(v.mapValue.fields[k]); }); return o; }
    return null;
  }
  // vendas da loja pagas por PIX em reais: uma espera por carrinho (valor total recebido)
  function pixEspVarre() {
    var ag = {}, ag0 = Date.now() - PIXM_H;
    (S.sales || []).slice(0, 40).forEach(function (s) {
      if (s.forma !== 'pix' || s.moeda !== 'brl' || !(+s.ts >= ag0)) return;
      var k = String(s.carrinho || s.id).replace(/[^A-Za-z0-9-]/g, '');
      if (!k) return;
      ag[k] = (ag[k] || 0) + (+s.recebido || 0);
    });
    Object.keys(ag).forEach(function (k) {
      if (S.pixEsp[k] || !(ag[k] > 0)) return;
      var o = { ts: Date.now(), brl: Math.round(ag[k] * 100) / 100, ok: 0 };
      S.pixEsp[k] = o;
      if (S.nuvem && S.nuvem.rt)
        nvApi('PATCH', 'pixEspera/L' + k, JSON.stringify({ fields: { tipo: { stringValue: 'loja' }, brl: { doubleValue: o.brl }, ts: { integerValue: String(o.ts) } } })).catch(function () { o.sync = 0; });
      saveSoon();
    });
  }
  var _pxT = 0;
  function pixEmailCheca(forca) {
    if (!S.nuvem || !S.nuvem.rt) return Promise.resolve(0);
    if (!forca && Date.now() - _pxT < 55000) return Promise.resolve(0);
    _pxT = Date.now();
    var tarefas = [];
    (S.pedidos || []).filter(function (p) {
      return p.orig === 'site' && p.pag === 'pix' && (p.pg === 'pagar' || p.pg === 'comp') && p.st !== 'canc' && p.sid;
    }).slice(0, 15).forEach(function (p) {
      tarefas.push(nvApi('GET', 'reservas/' + encodeURIComponent(p.sid)).then(function (j) {
        var pa = j && j.fields && j.fields.pixAuto ? pxFv(j.fields.pixAuto) : null;
        if (!pa || p.pg === 'pago') return;
        p.pgAuto = { ts: pa.ts || Date.now(), txt: 'PIX confirmado pelo e-mail do Nubank · R$ ' + (+pa.valor || 0).toFixed(2).replace('.', ',') };
        var sel = S.pedSel, y = window.scrollY;
        ACT.pedpago(p.id); // sem o dono tocar: não muda a tela em que ele está
        S.pedSel = sel;
        window.scrollTo(0, y);
        lfToast('PIX recebido: pedido ' + (p.cod || '') + ' confirmado sozinho');
        saveSoon();
      }).catch(function () {}));
    });
    Object.keys(S.pixEsp).forEach(function (k) {
      var o = S.pixEsp[k];
      if (o.ok || Date.now() - o.ts > PIXM_H) return;
      tarefas.push(nvApi('GET', 'pixEspera/L' + k).then(function (j) {
        var ok = j && j.fields && j.fields.ok ? pxFv(j.fields.ok) : null;
        if (!ok) return;
        o.ok = ok.ts || Date.now();
        lfToast('PIX da venda confirmado · R$ ' + o.brl.toFixed(2).replace('.', ','));
        saveSoon();
      }).catch(function () {}));
    });
    tarefas.push(nvApi('GET', 'pixSemPar?pageSize=20').then(function (j) {
      S.pixSemPar = (j.documents || []).map(function (d) {
        var f = {};
        Object.keys(d.fields || {}).forEach(function (x) { f[x] = pxFv(d.fields[x]); });
        return { id: d.name.split('/').pop(), valor: +f.valor || 0, ts: +f.ts || 0, n: +f.candidatos || 0 };
      });
    }).catch(function () {}));
    return Promise.all(tarefas);
  }
  // PIX da venda da loja ainda sem confirmação (para o guardião: >15 min)
  function pixLojaEsperando(min) {
    var lim = Date.now() - (min || 15) * 60000;
    return Object.keys(S.pixEsp).map(function (k) { return Object.assign({ k: k }, S.pixEsp[k]); }).filter(function (o) { return !o.ok && o.ts < lim && Date.now() - o.ts < PIXM_H; });
  }
  setInterval(function () { try { pixEspVarre(); pixEmailCheca(); } catch (e) {} }, 20000);
