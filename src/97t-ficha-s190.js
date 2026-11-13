  // ===== S190 (aprovado 12/11/2026): FICHA ÚNICA do produto =====
  // 6 etapas com o que falta: 1 Identidade · 2 Cores e graus · 3 Fotos (uma por cor + revisão do designer: ok/refazer)
  // · 4 Preço (Contador: custo US$ → venda US$ → G$/R$ no site) · 5 Canais (loja/site/atacado) · 6 Texto de venda AUTOMÁTICO
  // (formato, tamanho pela medida, material, número de cores; nunca cita a cor) com "Corrigir (opcional)".
  // Site, WhatsApp varejo/atacado, Marketing e Destaque leem da ficha: mudou na ficha, muda em todos.
  S.fotoOk = S.fotoOk || {}; // ref|cor → 1 (dono escolheu "Manter assim")
  S.fotoRev = S.fotoRev || {}; // ref|cor → 'escura' | 'fundo' (revisão do designer)
  function fiCores(ref) {
    var L = typeof siteCores === 'function' ? siteCores(ref) : [];
    return L.map(function (c) {
      var q = (S.items || []).filter(function (x) { return x.ref === ref && x.cor === c.cor; }).reduce(function (a, x) { return a + (x.qty || 0); }, 0);
      return { cor: c.cor, q: q, foto: photoOf(ref, c.cor) || '' };
    });
  }
  function fiTamanho(med) {
    if (!med || !med[0]) return '';
    var t = med[0] <= 50 ? 'pequeno' : med[0] <= 54 ? 'médio' : 'grande';
    return t + ' (' + med[0] + (med[1] ? '-' + med[1] : '') + ')';
  }
  function fiMed(ref) {
    var it = (S.items || []).filter(function (x) { return x.ref === ref && x.med; })[0];
    return it && typeof parseMed === 'function' ? parseMed(it.med) : null;
  }
  // texto automático (sem cor): o mesmo que o site escreve
  function fiTexto(ref) {
    var a = (typeof attrOf === 'function' ? attrOf(ref) : null) || {}, it = (S.items || []).filter(function (x) { return x.ref === ref; })[0] || {},
      tp = { solar: 'Óculos de sol', pre: 'Óculos de leitura', grau: 'Óculos de leitura' }[it.tipo] || 'Armação',
      f = String(a.formato || '').toLowerCase(), m = String(a.material || '').toLowerCase(), md = fiMed(ref), n = fiCores(ref).length;
    var t = tp + (f ? ' ' + f : '') + (m ? ' em ' + m : '') + (md && md[0] ? ', tamanho ' + fiTamanho(md) : '') + '.';
    if (n > 1) t += ' Disponível em ' + n + ' cores.';
    return t;
  }
  function fiEtapas(ref) {
    var a = (typeof attrOf === 'function' ? attrOf(ref) : null) || {}, C = fiCores(ref), it = (S.items || []).filter(function (x) { return x.ref === ref; })[0];
    var semFoto = C.filter(function (c) { return !c.foto; }).length, refazer = C.filter(function (c) { return c.foto && S.fotoRev[ref + '|' + c.cor] && !S.fotoOk[ref + '|' + c.cor]; }).length;
    var p = it ? precoTab(it) : 0, cu = it ? +it.custo || +it.usd || (typeof tFor === 'function' ? +tFor(it).repUSD || 0 : 0) : 0, pub = !!(S.site && S.site[ref]);
    return [
      { n: 1, t: 'Identidade', s: [ref, a.formato, a.material, a.publico].filter(Boolean).join(' · ') || 'ref, tipo, categoria', ok: !!(a.formato && a.material) },
      { n: 2, t: 'Cores e graus', s: C.length + (C.length === 1 ? ' cor' : ' cores') + ' · ' + C.reduce(function (s, c) { return s + c.q; }, 0) + ' peças', ok: C.length > 0 },
      { n: 3, t: 'Fotos', s: semFoto ? semFoto + ' sem foto' : refazer ? refazer + ' para refazer' : 'uma por cor', ok: !semFoto && !refazer },
      { n: 4, t: 'Preço', s: cu ? 'US$ ' + cu.toFixed(2).replace('.', ',') + ' · ' + gs(p) : 'falta o custo', ok: cu > 0 && p > 0 },
      { n: 5, t: 'Canais', s: ['loja', pub ? 'site' : '', S.ataPub && S.ataPub[ref] === false ? '' : 'atacado'].filter(Boolean).join(' · '), ok: true },
      { n: 6, t: 'Texto de venda', s: S.desc && S.desc[ref] ? 'corrigido por você' : 'automático', ok: true }
    ];
  }
  // revisão do designer (no aparelho): foto escura ou fundo que não é branco
  function fiRevisa(ref, cor, src, cb) {
    var k = ref + '|' + cor;
    if (S.fotoRev[k] !== undefined || !src) { cb && cb(); return; }
    var im = new Image();
    im.onload = function () {
      try {
        var c = document.createElement('canvas'), w = (c.width = 64), h = (c.height = 64), x = c.getContext('2d');
        x.drawImage(im, 0, 0, w, h);
        var d = x.getImageData(0, 0, w, h).data, tot = 0, borda = 0, nb = 0;
        for (var i = 0; i < w * h; i++) {
          var l = (d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11);
          tot += l;
          var px = i % w, py = Math.floor(i / w);
          if (px < 3 || py < 3 || px > w - 4 || py > h - 4) { borda += l; nb++; }
        }
        var med = tot / (w * h), bm = borda / nb;
        S.fotoRev[k] = bm < 200 ? 'fundo' : med < 120 ? 'escura' : '';
      } catch (e) { S.fotoRev[k] = ''; }
      saveSoon();
      cb && cb();
    };
    im.onerror = function () { cb && cb(); };
    im.src = src;
  }
  ACT.fichaAbre = function (ref) {
    if (!ref) return;
    var etapa = 0;
    lfJanela({
      titulo: 'Ficha do produto',
      monta: function (c) {
        var pinta = function () {
          var E = fiEtapas(ref), feitas = E.filter(function (e) { return e.ok; }).length, C = fiCores(ref);
          var it = (S.items || []).filter(function (x) { return x.ref === ref; })[0], foto = photoOf(ref);
          var h = '<div class="col fiW" style="gap:12px;padding:0 16px 16px">';
          if (!etapa) {
            h += '<section class="card col fiTopo"><div class="fiId">' + (foto ? '<img alt="" src="' + foto + '">' : '<span></span>') + '<div><b>' + esc(ref) + ' · ' + esc(pn(ref)) + '</b><small>' + esc([((typeof attrOf === 'function' && attrOf(ref)) || {}).publico, it && tFor(it).nome].filter(Boolean).join(' · ')) + '</small></div></div>' +
              '<div class="sl"><span>Ficha completa</span><b style="color:' + (feitas === 6 ? 'var(--ok)' : 'var(--warn)') + '">' + feitas + ' de 6</b></div><div class="fiBar"><i style="width:' + Math.round((feitas / 6) * 100) + '%"></i></div></section>' +
              '<section class="card col" style="gap:0">' + E.map(function (e) {
                return '<button type="button" class="fiEt" data-et="' + e.n + '"><span class="fiN">' + e.n + '</span><span class="fiT"><b>' + e.t + '</b><small>' + esc(e.s) + '</small></span><span class="' + (e.ok ? 'fiOk' : 'fiFal') + '">' + (e.ok ? '✓' : '!') + '</span></button>';
              }).join('') + '</section>';
            var fal = E.filter(function (e) { return !e.ok; })[0];
            if (fal) h += '<section class="card fiAv"><b>Falta: ' + esc(fal.t) + '</b><small>' + esc(fal.s) + '. O texto se atualiza sozinho depois.</small></section>';
            h += '<div class="fiPe"><button type="button" class="fiH" data-fi="site">Prévia do site</button><button type="button" class="fiG" data-fi="zap">Enviar no WhatsApp</button></div>';
          } else if (etapa === 3) {
            h += '<section class="card col"><div class="lbl">ETAPA 3 DE 6 · FOTOS</div><div class="fiFotos">' + C.map(function (x) {
              var k = ref + '|' + x.cor, rv = S.fotoRev[k], ok = x.foto && (!rv || S.fotoOk[k]);
              return '<div class="fiFo">' + (x.foto ? '<img alt="" src="' + x.foto + '">' : '<span class="fiSem">sem foto</span>') + '<i class="' + (ok ? 'ok' : 'rf') + '">' + (ok ? 'ok' : x.foto ? 'refazer' : 'falta') + '</i><small>' + esc(x.cor) + '</small></div>';
            }).join('') + '</div></section>';
            var ruim = C.filter(function (x) { var k = ref + '|' + x.cor; return x.foto && S.fotoRev[k] && !S.fotoOk[k]; })[0];
            if (ruim) h += '<section class="card col fiAv"><b>Revisão do designer</b><small>"' + esc(ruim.cor) + '": ' + (S.fotoRev[ref + '|' + ruim.cor] === 'escura' ? 'escura. Use mais luz e o fundo branco.' : 'fundo que não é branco. Use o fundo branco e centralize.') + '</small><div class="fiPe"><button type="button" class="fiG" data-fi="refaz">Refazer agora</button><button type="button" class="fiH" data-fi="mant" data-cor="' + esc(ruim.cor) + '">Manter assim</button></div></section>';
            h += '<section class="card col"><div class="lbl">UMA FOTO POR COR</div><small class="hint" style="margin:0">Cada cor tem a sua foto. É ela que aparece quando o cliente escolhe a cor no site e no WhatsApp.</small></section>';
          } else if (etapa === 4 || etapa === 5) {
            var cu = it ? +it.custo || +it.usd || (typeof tFor === 'function' ? +tFor(it).repUSD || 0 : 0) : 0, p = it ? precoTab(it) : 0, fx = (S.fx && S.fx.pyg) || 0, pub = !!(S.site && S.site[ref]);
            h += '<section class="card col"><div class="lbl">ETAPA 4 · PREÇO (CONTADOR)</div><div class="sl"><span>Custo</span><b>' + (cu ? 'US$ ' + cu.toFixed(2).replace('.', ',') : '—') + '</b></div>' +
              '<div class="sl"><span>Venda</span><b style="font-size:18px">' + (fx ? 'US$ ' + (p / fx).toFixed(2).replace('.', ',') : '') + '</b></div><div class="sl"><span>No site</span><b>' + gs(p) + (S.fx && S.fx.brl && fx ? ' · R$ ' + Math.max(5, Math.round(p / (fx / S.fx.brl) / 5) * 5) : '') + '</b></div></section>' +
              '<section class="card col"><div class="lbl">ETAPA 5 · CANAIS</div><div class="fiCh"><span class="on">Loja</span><span class="' + (pub ? 'on' : '') + '">Site</span><span class="' + (S.ataPub && S.ataPub[ref] === false ? '' : 'on') + '" data-fi="ata">Atacado</span></div><small class="hint" style="margin:6px 0 0">Toque em Atacado para tirar ou pôr esta peça na lista do lojista.</small></section>';
          } else if (etapa === 6 || etapa === 1 || etapa === 2) {
            var md = fiMed(ref), a = (typeof attrOf === 'function' && attrOf(ref)) || {};
            h += '<section class="card col fiAuto"><div class="lbl">ETAPA 6 · TEXTO DE VENDA · AUTOMÁTICO</div><div class="sl"><span>Formato (das fotos)</span><b>' + esc(a.formato || '—') + '</b></div><div class="sl"><span>Tamanho (medida)</span><b>' + esc(md ? fiTamanho(md) : '—') + '</b></div>' +
              '<div class="sl"><span>Material</span><b>' + esc(a.material || '—') + '</b></div><div class="sl"><span>Cores</span><b>' + C.length + '</b></div>' +
              '<textarea class="in" id="fiTx" rows="3">' + esc(S.desc && S.desc[ref] ? S.desc[ref] : fiTexto(ref)) + '</textarea><small class="hint" style="margin:0">Não cita cor: a cor aparece à parte, a que o cliente escolher.</small>' +
              '<div class="fiPe"><button type="button" class="fiH" data-fi="auto">Usar o automático</button><button type="button" class="fiG" data-fi="salva">Corrigir (opcional)</button></div></section>';
          }
          if (etapa) h += '<div class="fiPe"><button type="button" class="fiH" data-fi="prev">‹ Etapas</button>' + (etapa < 6 ? '<button type="button" class="fiG" data-fi="next">Etapa ' + (etapa === 3 ? 4 : etapa === 4 || etapa === 5 ? 6 : etapa + 1) + ' ›</button>' : '') + '</div>';
          c.innerHTML = h + '</div>';
        };
        c.addEventListener('click', function (e) {
          var b = e.target.closest('[data-et],[data-fi]');
          if (!b) return;
          var et = b.getAttribute('data-et'), f = b.getAttribute('data-fi');
          if (et) etapa = +et;
          else if (f === 'prev') etapa = 0;
          else if (f === 'next') etapa = etapa === 3 ? 4 : etapa === 4 || etapa === 5 ? 6 : etapa + 1;
          else if (f === 'mant') { S.fotoOk[ref + '|' + b.getAttribute('data-cor')] = 1; saveSoon(); }
          else if (f === 'refaz') { if (typeof estAbre === 'function') estAbre(); return; }
          else if (f === 'site') { window.open(S.site && S.site[ref] ? 'https://lafouch.com/p/' + encodeURIComponent(ref) + '.html' : 'https://lafouch.com/?ref=' + encodeURIComponent(ref), '_blank'); return; }
          else if (f === 'zap') { if (typeof ebAbre === 'function') ebAbre([ref]); return; }
          else if (f === 'ata') { S.ataPub = S.ataPub || {}; S.ataPub[ref] = S.ataPub[ref] === false ? true : false; saveSoon(); }
          else if (f === 'auto') { if (S.desc) delete S.desc[ref]; saveSoon(); if (S.site && S.site[ref] && typeof vitFila === 'function') vitFila(ref, 'upd'); lfToast('Texto automático'); }
          else if (f === 'salva') { var t = String(($('fiTx') || {}).value || '').trim(); S.desc = S.desc || {}; if (t && t !== fiTexto(ref)) S.desc[ref] = t.slice(0, 600); else delete S.desc[ref]; saveSoon(); if (S.site && S.site[ref] && typeof vitFila === 'function') vitFila(ref, 'upd'); lfToast('✓ Texto salvo · vai para o site'); }
          pinta();
        });
        pinta();
        // o designer revisa as fotos sozinho (no aparelho) e a ficha se atualiza
        var C0 = fiCores(ref), falta = C0.length;
        C0.forEach(function (x) { fiRevisa(ref, x.cor, x.foto, function () { if (--falta <= 0) pinta(); }); });
      }
    });
  };
  // botão "Ficha N de 6" no topo da ficha do inventário
  var _rdFicha = renderDetail;
  renderDetail = function (ref, opt) {
    var r = _rdFicha.apply(this, arguments);
    try {
      opt = opt || {};
      var det = opt.host || $('detail');
      if (!opt.venda && ref && det && !det.querySelector('.fiBtn')) {
        var E = fiEtapas(ref), n = E.filter(function (e) { return e.ok; }).length, b = document.createElement('button');
        b.type = 'button'; b.className = 'fiBtn' + (n < 6 ? ' fal' : ''); b.setAttribute('data-act', 'fichaAbre'); b.setAttribute('data-id', ref);
        b.innerHTML = '<span>Ficha</span><b>' + n + '/6</b>';
        // fica na linha do caminho (não empurra a foto: a ficha abre no mesmo lugar no Catálogo e no Inventário)
        var cam = det.querySelector('.fnCam');
        if (cam) cam.appendChild(b); else det.insertBefore(b, det.firstChild);
      }
    } catch (e) {}
    return r;
  };
