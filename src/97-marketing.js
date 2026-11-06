  // ===== Marketing (v430, aprovado 04–05/11/2026) =====
  // Botão Marketing no Início → central: Objetivo do mês (muda o plano), Plano da semana (marcar feito),
  // Criar com um toque (Post, Story, Status, Carrossel, Vídeo, Roteiro): o app escolhe as peças pelo objetivo e
  // mostra o PORQUÊ com fatos reais; versões A/B; legenda gancho/corpo/prova/chamada em PT, ES ou os dois;
  // Postar agora (app lembrado) ou "Me lembra às 20h". Datas que vêm aí (BR/PY), Listas por perfil, Status de hoje,
  // Resultados (vendas e pedidos do site depois de cada post → vira regra do plano) e Kit da marca.
  // Urgência só quando é REAL: "Últimas unidades" (≤ 2 no estoque) e "Só até <dia>" (oferta com data de fim).
  S.mkt = { obj: {}, feito: {}, posts: [], lemb: [], kit: null };
  var MK_OBJ = [
    { id: 'girar', t: 'Girar o parado', s: 'peças paradas há mais tempo, com motivo para comprar agora' },
    { id: 'br', t: 'Novos clientes BR', s: 'preço em R$, endereço e “compre aqui e economize”' },
    { id: 'solar', t: 'Mais solar', s: 'solares, proteção UV e época de sol' },
    { id: 'lanc', t: 'Lançamentos', s: 'o que chegou nos últimos 30 dias' }
  ];
  var MK_FMT = {
    post: { t: 'Post', w: 1080, h: 1350 },
    story: { t: 'Story', w: 1080, h: 1920 },
    status: { t: 'Status', w: 1080, h: 1920 },
    carr: { t: 'Carrossel', w: 1080, h: 1350 },
    video: { t: 'Vídeo', w: 720, h: 1280 },
    rot: { t: 'Roteiro', w: 0, h: 0 }
  };
  var MK_DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  function mkKit() {
    if (!S.mkt.kit)
      S.mkt.kit = {
        nome: 'La Fouch',
        slogan: 'Tudo em Óculos',
        end: 'Galeria Jebai Center · Ciudad del Este',
        wa: '+595 983 642 241',
        site: 'lafouch.com',
        tom: 'Próximo e direto, sem exagero',
        idioma: 'ambos',
        tags: '#lafouch #oculos #ciudaddeleste #cde #oculosdesol #anteojos'
      };
    return S.mkt.kit;
  }
  function mkMes() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
  }
  // Objetivo sugerido pelos dados (o dono pode trocar).
  function mkObjSug() {
    var par = 0,
      nov = 0;
    try {
      par = parados().length;
    } catch (e) {}
    mkPecas().forEach(function (p) {
      if (p.f.nov) nov++;
    });
    var mes = new Date().getMonth();
    if (nov >= 4) return 'lanc';
    if (par >= 6) return 'girar';
    if (sazonFator('solar', mes) >= 1.15) return 'solar';
    return 'br';
  }
  function mkObj() {
    return S.mkt.obj[mkMes()] || mkObjSug();
  }
  // Fatos reais de cada peça (nada inventado).
  function mkFatos(ref) {
    var it = itemDoRef(ref),
      a = attrOf(ref) || {},
      now = Date.now(),
      st = S.items.reduce(function (n, i) {
        return n + (i.ref === ref && i.qty > 0 ? i.qty : 0);
      }, 0),
      v30 = S.sales.reduce(function (n, s) {
        return n + (!s.estorno && s.ref === ref && now - s.ts <= 30 * DAY ? s.qty : 0);
      }, 0),
      pr = (S.pprice || {})[ref] || {},
      dEnt = (now - paPrimEntrada(ref)) / DAY,
      dPar = paParado(ref),
      preco = it ? precoTab(it, 'pub') : 0;
    return {
      ref: ref,
      tipo: it ? it.tipo : '',
      nome: pn(ref),
      st: st,
      v30: v30,
      nov: dEnt <= 30,
      dEnt: Math.round(dEnt),
      par: dPar >= 60 ? Math.round(dPar) : 0,
      of: pr.ant > pr.novo ? Math.round((1 - pr.novo / pr.ant) * 100) : 0,
      de: pr.ant > pr.novo ? pr.ant : 0,
      ate: pr.ant > pr.novo && pr.ate > now ? pr.ate : 0,
      ult: st > 0 && st <= 2,
      preco: preco,
      brl: preco ? Math.ceil(preco / ratePyg('brl')) : 0,
      fmt: a.formato || '',
      mat: a.material || '',
      pub: a.publico || '',
      foto: photoOf(ref)
    };
  }
  function mkPecas() {
    var vis = {},
      out = [];
    S.items.forEach(function (i) {
      if (vis[i.ref] || i.bulk || isSimple(i.tipo) || !(i.qty > 0)) return;
      vis[i.ref] = 1;
      if (!photoOf(i.ref)) return;
      out.push({ ref: i.ref, f: mkFatos(i.ref) });
    });
    return out;
  }
  // Escolhe as peças pelo objetivo e diz o porquê.
  function mkEscolhe(obj, n, pular) {
    pular = pular || [];
    var ps = mkPecas().filter(function (p) {
      return pular.indexOf(p.ref) < 0;
    });
    var nota = function (f) {
      var s = 0;
      if (obj === 'girar') s = f.par * 2 + (f.of ? 30 : 0) - f.v30 * 5;
      else if (obj === 'lanc') s = f.nov ? 100 - f.dEnt : -50;
      else if (obj === 'solar') s = (f.tipo === 'solar' ? 100 : -50) + f.v30 * 3 + (f.of ? 10 : 0);
      else s = f.v30 * 4 + (f.of ? 15 : 0) + (f.brl > 0 ? 5 : 0);
      if (f.ult) s += 8;
      return s;
    };
    ps.sort(function (a, b) {
      return nota(b.f) - nota(a.f);
    });
    return ps.slice(0, n);
  }
  function mkPorque(f, obj) {
    var m = [];
    if (f.par) m.push('parada há ' + f.par + ' dias');
    if (f.nov) m.push('chegou há ' + f.dEnt + (f.dEnt === 1 ? ' dia' : ' dias'));
    if (f.of) m.push('em oferta (−' + f.of + '%)' + (f.ate ? ' até ' + mkDia(f.ate) : ''));
    if (f.ult) m.push(f.st === 1 ? 'última unidade' : 'últimas ' + f.st + ' unidades');
    if (f.v30 >= 3) m.push(f.v30 + ' vendidas em 30 dias');
    if (obj === 'br' && f.brl) m.push('R$ ' + f.brl + ' na moeda do cliente');
    if (obj === 'solar' && f.tipo === 'solar') m.push('época de sol');
    return m.length ? m : ['boa foto e estoque'];
  }
  function mkDia(ts) {
    var d = new Date(ts);
    return ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'][d.getDay()] + ' (' + ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + ')';
  }
  function mkDiaEs(ts) {
    var d = new Date(ts);
    return ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][d.getDay()] + ' ' + ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2);
  }
  // Legenda: gancho, corpo, prova, chamada — versão A ou B, PT/ES/os dois.
  function mkLegenda(pecas, obj, ver, idi, fmt) {
    var K = mkKit(),
      f = pecas[0] ? pecas[0].f : null,
      n = pecas.length,
      gPT,
      gES,
      cPT,
      cES,
      pPT = [],
      pES = [];
    if (!f) return '';
    var nm = f.nome,
      pr = gs(f.preco),
      br = f.brl ? 'R$ ' + f.brl : '';
    if (obj === 'girar') {
      gPT = ver === 'A' ? (f.of ? 'Baixou: ' + nm + ' com ' + f.of + '% off.' : nm + ' com preço que não volta.') : 'Quem chega primeiro leva: ' + nm + '.';
      gES = ver === 'A' ? (f.of ? 'Bajó: ' + nm + ' con ' + f.of + '% off.' : nm + ' a un precio que no vuelve.') : 'El que llega primero se lo lleva: ' + nm + '.';
    } else if (obj === 'lanc') {
      gPT = ver === 'A' ? 'Acabou de chegar: ' + nm + '.' : 'Novidade na loja' + (n > 1 ? ' — ' + n + ' modelos novos.' : ': ' + nm + '.');
      gES = ver === 'A' ? 'Recién llegado: ' + nm + '.' : 'Novedad en la tienda' + (n > 1 ? ' — ' + n + ' modelos nuevos.' : ': ' + nm + '.');
    } else if (obj === 'solar') {
      gPT = ver === 'A' ? 'Sol forte pede ' + nm + '.' : 'Proteção UV com estilo: ' + nm + '.';
      gES = ver === 'A' ? 'Sol fuerte pide ' + nm + '.' : 'Protección UV con estilo: ' + nm + '.';
    } else {
      gPT = ver === 'A' ? (br ? nm + ' por ' + br + ' aqui em CDE.' : nm + ' aqui em CDE.') : 'Vem pra CDE? Separa ' + nm + ' antes de chegar.';
      gES = ver === 'A' ? nm + ' por ' + pr + ' en CDE.' : '¿Venís a CDE? Reservá ' + nm + ' antes de llegar.';
    }
    var corpoPT = [f.fmt, f.mat && f.mat.toLowerCase(), f.pub && f.pub !== 'Unissex' ? f.pub.toLowerCase() : ''].filter(Boolean).join(', '),
      corpoES = [f.fmt, f.mat && ({ Acetato: 'acetato', Metal: 'metal', TR90: 'TR90' }[f.mat] || f.mat.toLowerCase()), f.pub && f.pub !== 'Unissex' ? { Feminino: 'femenino', Masculino: 'masculino' }[f.pub] || '' : ''].filter(Boolean).join(', ');
    if (f.ult) {
      pPT.push(f.st === 1 ? 'Última unidade.' : 'Últimas ' + f.st + ' unidades.');
      pES.push(f.st === 1 ? 'Última unidad.' : 'Últimas ' + f.st + ' unidades.');
    }
    if (f.ate) {
      pPT.push('Oferta só até ' + mkDia(f.ate) + '.');
      pES.push('Oferta solo hasta el ' + mkDiaEs(f.ate) + '.');
    }
    if (f.v30 >= 3) {
      pPT.push(f.v30 + ' vendidos este mês.');
      pES.push(f.v30 + ' vendidos este mes.');
    }
    var preco = pr + (br ? ' · ' + br : '') + (f.de ? ' (antes ' + gs(f.de) + ')' : '');
    cPT = 'Reserve pelo WhatsApp ' + K.wa + ' e retire na loja — ' + K.end + '.' + (K.site ? ' Veja no site: ' + K.site + '/p/' + f.ref + '.html' : '');
    cES = 'Reservá por WhatsApp ' + K.wa + ' y retirá en la tienda — ' + K.end + '.' + (K.site ? ' Mirá en ' + K.site + '/p/' + f.ref + '.html' : '');
    if (n > 1) {
      corpoPT = n + ' modelos: ' + pecas.map(function (p) { return p.f.nome + ' ' + gs(p.f.preco); }).join(' · ');
      corpoES = n + ' modelos: ' + pecas.map(function (p) { return p.f.nome + ' ' + gs(p.f.preco); }).join(' · ');
    }
    var PT = [gPT, (corpoPT ? (n > 1 ? corpoPT : corpoPT.charAt(0).toUpperCase() + corpoPT.slice(1) + '. ' + preco + '.') : preco + '.'), pPT.join(' '), cPT].filter(Boolean).join('\n\n'),
      ES = [gES, (corpoES ? (n > 1 ? corpoES : corpoES.charAt(0).toUpperCase() + corpoES.slice(1) + '. ' + preco + '.') : preco + '.'), pES.join(' '), cES].filter(Boolean).join('\n\n'),
      tags = fmt === 'status' ? '' : '\n\n' + K.tags;
    return (idi === 'es' ? ES : idi === 'pt' ? PT : PT + '\n\n— ES —\n' + ES) + tags;
  }
  // ---- imagem (post/story/status/carrossel) ----
  function mkSelo(f) {
    if (f.ult) return f.st === 1 ? 'ÚLTIMA UNIDADE' : 'ÚLTIMAS ' + f.st;
    if (f.ate) return 'SÓ ATÉ ' + mkDia(f.ate).split(' ')[0].toUpperCase();
    if (f.of) return '−' + f.of + '%';
    if (f.nov) return 'NOVIDADE';
    return '';
  }
  function mkImagem(f, im, fmt, est, k, n) {
    var F = MK_FMT[fmt === 'carr' ? 'post' : fmt],
      W = F.w,
      H = F.h,
      cv = mkCanvas(W, H),
      x = cv.getContext('2d'),
      s = EB_EST[est || 0],
      K = mkKit();
    x.fillStyle = s.bg;
    x.fillRect(0, 0, W, H);
    x.fillStyle = s.fg;
    x.textAlign = 'center';
    x.font = '400 44px Georgia, serif';
    x.fillText('L A   F O U C H', W / 2, 110);
    x.font = '400 26px sans-serif';
    x.fillStyle = s.mu;
    x.fillText((K.slogan || '').toUpperCase(), W / 2, 150);
    var fy = 200,
      fh = H > 1500 ? 1080 : 760,
      fw = W - 120;
    x.fillStyle = '#ffffff';
    if (x.roundRect) {
      x.beginPath();
      x.roundRect(60, fy, fw, fh, 40);
      x.fill();
    } else x.fillRect(60, fy, fw, fh);
    if (im) {
      var r = Math.min((fw - 90) / im.width, (fh - 90) / im.height),
        iw = im.width * r,
        ih = im.height * r;
      x.drawImage(im, 60 + (fw - iw) / 2, fy + (fh - ih) / 2, iw, ih);
    }
    var sl = mkSelo(f);
    if (sl) {
      x.font = '700 34px sans-serif';
      var tw = x.measureText(sl).width + 48;
      x.fillStyle = s.ac;
      if (x.roundRect) {
        x.beginPath();
        x.roundRect(90, fy + 30, tw, 60, 30);
        x.fill();
      } else x.fillRect(90, fy + 30, tw, 60);
      x.fillStyle = s.bg;
      x.textAlign = 'left';
      x.fillText(sl, 114, fy + 72);
    }
    var ty = fy + fh + 90;
    x.textAlign = 'center';
    x.fillStyle = s.fg;
    x.font = '400 54px Georgia, serif';
    x.fillText(f.nome.slice(0, 32), W / 2, ty);
    x.font = '700 66px sans-serif';
    x.fillStyle = s.ac;
    x.fillText(gs(f.preco) + (f.brl ? '  ·  R$ ' + f.brl : ''), W / 2, ty + 90);
    if (f.de) {
      x.font = '400 34px sans-serif';
      x.fillStyle = s.mu;
      var antes = 'antes ' + gs(f.de);
      x.fillText(antes, W / 2, ty + 145);
      var aw = x.measureText(antes).width;
      x.fillRect(W / 2 - aw / 2, ty + 133, aw, 3);
    }
    x.font = '500 34px sans-serif';
    x.fillStyle = s.fg;
    x.fillText('WhatsApp ' + K.wa + '  ·  ' + K.site, W / 2, H - 120);
    x.font = '400 28px sans-serif';
    x.fillStyle = s.mu;
    x.fillText(K.end, W / 2, H - 72);
    if (n > 1) {
      x.textAlign = 'right';
      x.font = '600 30px sans-serif';
      x.fillStyle = s.mu;
      x.fillText(k + 1 + '/' + n, W - 70, 110);
    }
    return cv;
  }
  // ---- vídeo 15 s gerado no celular (Elegante / Rápido / Oferta) ----
  function mkVideo(pecas, est, estilo) {
    var W = 720,
      H = 1280,
      cv = mkCanvas(W, H),
      x = cv.getContext('2d'),
      s = EB_EST[est || 0],
      K = mkKit(),
      DUR = 15000,
      ok = cv.captureStream && window.MediaRecorder;
    if (!ok) return Promise.reject(new Error('sem gravação de vídeo neste aparelho'));
    return Promise.all(pecas.map(function (p) {
      return envImg(p.f.foto);
    })).then(function (ims) {
      return new Promise(function (res, rej) {
        var tipos = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'],
          mt = tipos.filter(function (t) {
            return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t);
          })[0] || '';
        var st = cv.captureStream(30),
          rec = new MediaRecorder(st, mt ? { mimeType: mt, videoBitsPerSecond: 4000000 } : undefined),
          ch = [],
          t0 = performance.now(),
          n = pecas.length,
          cena = (DUR - 4000) / Math.max(1, n);
        rec.ondataavailable = function (e) {
          if (e.data && e.data.size) ch.push(e.data);
        };
        rec.onstop = function () {
          res(new Blob(ch, { type: mt || 'video/webm' }));
        };
        rec.onerror = rej;
        var desenha = function () {
          var t = performance.now() - t0;
          x.fillStyle = s.bg;
          x.fillRect(0, 0, W, H);
          x.textAlign = 'center';
          if (t < 2000) {
            var a = Math.min(1, t / 700);
            x.globalAlpha = a;
            x.fillStyle = s.fg;
            x.font = '400 54px Georgia, serif';
            x.fillText('L A   F O U C H', W / 2, H / 2 - 10);
            x.font = '400 26px sans-serif';
            x.fillStyle = s.mu;
            x.fillText(estilo === 'oferta' ? 'OFERTAS DA SEMANA' : estilo === 'rapido' ? 'CHEGOU NA LOJA' : (K.slogan || '').toUpperCase(), W / 2, H / 2 + 40);
            x.globalAlpha = 1;
          } else if (t < DUR - 2000) {
            var i = Math.min(n - 1, Math.floor((t - 2000) / cena)),
              u = (t - 2000 - i * cena) / cena,
              f = pecas[i].f,
              im = ims[i],
              z = estilo === 'rapido' ? 1 + 0.12 * Math.sin(u * Math.PI) : 1 + 0.08 * u,
              al = estilo === 'rapido' ? 1 : Math.min(1, u * 4, (1 - u) * 4);
            x.globalAlpha = al;
            x.fillStyle = '#fff';
            x.fillRect(40, 220, W - 80, 640);
            if (im) {
              var r = Math.min((W - 140) / im.width, 560 / im.height) * z,
                iw = im.width * r,
                ih = im.height * r;
              x.save();
              x.beginPath();
              x.rect(40, 220, W - 80, 640);
              x.clip();
              x.drawImage(im, W / 2 - iw / 2, 540 - ih / 2, iw, ih);
              x.restore();
            }
            x.fillStyle = s.fg;
            x.font = '400 44px Georgia, serif';
            x.fillText(f.nome.slice(0, 26), W / 2, 960);
            x.fillStyle = s.ac;
            x.font = '700 52px sans-serif';
            x.fillText(gs(f.preco) + (f.brl ? ' · R$ ' + f.brl : ''), W / 2, 1040);
            var sl = mkSelo(f);
            if (sl) {
              x.font = '700 30px sans-serif';
              x.fillStyle = s.mu;
              x.fillText(sl, W / 2, 1100);
            }
            x.globalAlpha = 1;
          } else {
            x.fillStyle = s.fg;
            x.font = '400 40px Georgia, serif';
            x.fillText('Reserve pelo WhatsApp', W / 2, H / 2 - 60);
            x.fillStyle = s.ac;
            x.font = '700 50px sans-serif';
            x.fillText(K.wa, W / 2, H / 2 + 10);
            x.fillStyle = s.mu;
            x.font = '400 28px sans-serif';
            x.fillText(K.end, W / 2, H / 2 + 70);
            x.fillText(K.site, W / 2, H / 2 + 115);
          }
          if (t < DUR) requestAnimationFrame(desenha);
          else rec.stop();
        };
        rec.start(500);
        desenha();
      });
    });
  }
  // ---- roteiro de vídeo + teleprompter ----
  function mkRoteiro(pecas, obj) {
    var f = pecas[0] ? pecas[0].f : null,
      f2 = pecas[1] ? pecas[1].f : null,
      K = mkKit();
    if (!f) return [];
    var g = mkLegenda(pecas.slice(0, 1), obj, 'A', 'pt', 'status').split('\n\n')[0];
    return [
      { t: '0–3 s', plano: 'Rosto com o óculos, olhando para a câmera', fala: g },
      { t: '3–7 s', plano: 'Close na peça girando na mão (frente → lateral)', fala: [f.fmt, f.mat && f.mat.toLowerCase()].filter(Boolean).join(', ') + (f.of ? ', com ' + f.of + '% de desconto' : '') + '.' },
      f2 ? { t: '7–11 s', plano: 'Troca rápida para a segunda peça', fala: 'E tem também ' + f2.nome + ', ' + gs(f2.preco) + '.' } : { t: '7–11 s', plano: 'Detalhe da haste e da dobradiça', fala: f.ult ? (f.st === 1 ? 'É a última unidade.' : 'São as últimas ' + f.st + ' unidades.') : 'Preço: ' + gs(f.preco) + (f.brl ? ', R$ ' + f.brl : '') + '.' },
      { t: '11–15 s', plano: 'Fachada da loja ou balcão, com a peça na mão', fala: 'Reserve pelo WhatsApp e retire na ' + K.end.split('·')[0].trim() + '.' }
    ];
  }
  function mkTeleprompter(txt) {
    var ov = document.createElement('div');
    ov.className = 'mkTp';
    ov.innerHTML = '<div class="mkTpT" id="mkTpT">' + esc(txt).replace(/\n/g, '<br><br>') + '</div><div class="mkTpB"><button type="button" class="mini" data-v="-1">Mais devagar</button><button type="button" class="go" data-v="0">Pausar</button><button type="button" class="mini" data-v="1">Mais rápido</button><button type="button" class="mini" data-v="x">Fechar</button></div>';
    document.body.appendChild(ov);
    var v = 0.6,
      on = true,
      y = 0,
      el = ov.querySelector('#mkTpT');
    y = ov.clientHeight * 0.6;
    var anda = function () {
      if (!ov.isConnected) return;
      if (on) y -= v;
      el.style.transform = 'translateY(' + y + 'px)';
      requestAnimationFrame(anda);
    };
    anda();
    ov.querySelector('.mkTpB').onclick = function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var d = b.dataset.v;
      if (d === 'x') return ov.remove();
      if (d === '0') {
        on = !on;
        b.textContent = on ? 'Pausar' : 'Continuar';
      } else v = Math.max(0.2, Math.min(3, v + (+d) * 0.2));
    };
  }
  // ---- plano da semana ----
  function mkHoraBoa(fmt) {
    var R = mkResultados();
    return (R.horaBoa && R.horaBoa[fmt]) || (fmt === 'status' ? '12h' : '20h');
  }
  function mkSemana() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    var seg = new Date(d.getTime() - ((d.getDay() + 6) % 7) * DAY);
    return seg.getTime();
  }
  function mkPlano() {
    var obj = mkObj(),
      seg = mkSemana(),
      base = [
        ['post', 'Peça do objetivo'],
        ['status', 'Status do dia'],
        ['carr', 'Carrossel com 4 peças'],
        ['story', 'Bastidores / chegada'],
        ['video', 'Vídeo de 15 s'],
        ['post', 'Oferta ou mais vendido']
      ];
    var R = mkResultados();
    if (R.fmtBom && R.fmtBom !== 'post') base[5] = [R.fmtBom, 'O que mais deu resultado'];
    var usados = [];
    return base.map(function (b, i) {
      var n = b[0] === 'carr' ? 4 : b[0] === 'video' ? 3 : 1,
        ps = mkEscolhe(obj, n, usados);
      ps.forEach(function (p) {
        usados.push(p.ref);
      });
      var dia = seg + i * DAY,
        id = 'w' + seg + 'i' + i;
      return { id: id, dia: dia, fmt: b[0], tema: b[1], hora: mkHoraBoa(b[0]), refs: ps.map(function (p) { return p.ref; }), feito: !!S.mkt.feito[id] };
    });
  }
  // ---- datas que vêm aí (Brasil e Paraguai) ----
  function mkPascoa(Y) {
    var a = Y % 19,
      b = Math.floor(Y / 100),
      c = Y % 100,
      d = Math.floor(b / 4),
      e = b % 4,
      f = Math.floor((b + 8) / 25),
      g = Math.floor((b - f + 1) / 3),
      h = (19 * a + b - d - g + 15) % 30,
      i = Math.floor(c / 4),
      k = c % 4,
      l = (32 + 2 * e + 2 * i - h - k) % 7,
      m = Math.floor((a + 11 * h + 22 * l) / 451),
      mo = Math.floor((h + l - 7 * m + 114) / 31),
      da = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Y, mo - 1, da);
  }
  function mkNdom(Y, mes, n) {
    var d = new Date(Y, mes, 1);
    while (d.getDay() !== 0) d.setDate(d.getDate() + 1);
    d.setDate(d.getDate() + 7 * (n - 1));
    return d;
  }
  function mkDatas() {
    var out = [],
      hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    [hoje.getFullYear(), hoje.getFullYear() + 1].forEach(function (Y) {
      var bf = new Date(Y, 10, 1);
      while (bf.getDay() !== 4) bf.setDate(bf.getDate() + 1);
      bf.setDate(bf.getDate() + 22);
      var p = mkPascoa(Y);
      [
        [new Date(Y, 0, 1), 'Ano Novo', 'BR/PY', 'solar para o verão'],
        [new Date(Y, 1, 1), 'Volta às aulas', 'BR/PY', 'armações e grau'],
        [new Date(p.getTime() - 47 * DAY), 'Carnaval', 'BR', 'solar e viagem'],
        [new Date(p.getTime() - 3 * DAY), 'Semana Santa', 'BR/PY', 'brasileiros vêm a CDE: preço em R$'],
        [new Date(Y, 4, 15), 'Día de la Madre', 'PY', 'presente: solar feminino'],
        [mkNdom(Y, 4, 2), 'Dia das Mães', 'BR', 'presente: solar feminino'],
        [new Date(Y, 5, 12), 'Dia dos Namorados', 'BR', 'casal: dois óculos'],
        [mkNdom(Y, 5, 2), 'Día del Padre', 'PY', 'presente: solar masculino'],
        [new Date(Y, 6, 30), 'Día de la Amistad', 'PY', 'presente entre amigos'],
        [mkNdom(Y, 7, 2), 'Dia dos Pais', 'BR', 'presente: solar masculino'],
        [new Date(Y, 7, 16), 'Día del Niño', 'PY', 'óculos infantis'],
        [new Date(Y, 8, 15), 'Dia do Cliente', 'BR', 'agradecer e oferta curta'],
        [new Date(Y, 8, 21), 'Primavera / Día de la Juventud', 'PY', 'solar: começa o sol forte'],
        [new Date(Y, 9, 12), 'Dia das Crianças', 'BR', 'óculos infantis'],
        [bf, 'Black Friday', 'BR/PY', 'super evento no site'],
        [new Date(Y, 11, 25), 'Natal', 'BR/PY', 'presente: embalagem e combo']
      ].forEach(function (x) {
        var dd = Math.round((x[0] - hoje) / DAY);
        if (dd >= 0 && dd <= 60) out.push({ d: x[0].getTime(), em: dd, t: x[1], pais: x[2], ideia: x[3] });
      });
    });
    return out.sort(function (a, b) {
      return a.d - b.d;
    });
  }
  // ---- listas por perfil (para lista de transmissão do WhatsApp Business) ----
  function mkListas() {
    var now = Date.now(),
      compr = {};
    S.sales.forEach(function (s) {
      if (s.estorno || !s.cliId) return;
      var c = (compr[s.cliId] = compr[s.cliId] || { ult: 0, tipos: {} });
      if (s.ts > c.ult) c.ult = s.ts;
      c.tipos[s.tipo] = 1;
    });
    var cl = (S.clientes || []).filter(function (c) {
        return c.tel;
      }),
      L = [
        { id: 'br', t: 'Estrangeiros (R$)', f: function (c) { return cliEstr(c); } },
        { id: 'py', t: 'Paraguaios (G$)', f: function (c) { return !cliEstr(c); } },
        { id: 'sol', t: 'Compraram solar', f: function (c) { return compr[c.id] && compr[c.id].tipos.solar; } },
        { id: 'gr', t: 'Compraram grau', f: function (c) { return compr[c.id] && compr[c.id].tipos.pre; } },
        { id: 'arm', t: 'Compraram armação', f: function (c) { return compr[c.id] && compr[c.id].tipos.sem; } },
        { id: 'sum', t: 'Sem comprar há 90+ dias', s: 'só novidades, sem insistir', f: function (c) { return compr[c.id] && now - compr[c.id].ult > 90 * DAY; } }
      ];
    return L.map(function (l) {
      l.cl = cl.filter(l.f);
      return l;
    });
  }
  // ---- resultados: vendas e pedidos do site nos 7 dias depois de cada post ----
  function mkResultados() {
    var now = Date.now(),
      porFmt = {},
      porHora = {},
      ab = { A: { n: 0, v: 0 }, B: { n: 0, v: 0 } },
      lista = [];
    (S.mkt.posts || []).forEach(function (p) {
      if (now - p.ts < 2 * DAY) return; // ainda medindo
      var fim = p.ts + 7 * DAY,
        v = 0,
        pd = 0;
      S.sales.forEach(function (s) {
        if (!s.estorno && s.ts >= p.ts && s.ts < fim && p.refs.indexOf(s.ref) >= 0) v += s.qty;
      });
      (S.pedidos || []).forEach(function (o) {
        if (o.ts >= p.ts && o.ts < fim && (o.itens || []).some(function (l) { return p.refs.indexOf(l.ref) >= 0; })) pd++;
      });
      var r = v + pd,
        h = new Date(p.ts).getHours(),
        hb = h < 11 ? '9h' : h < 15 ? '12h' : h < 19 ? '17h' : '20h';
      lista.push({ p: p, v: v, pd: pd });
      (porFmt[p.fmt] = porFmt[p.fmt] || { n: 0, r: 0 }).n++;
      porFmt[p.fmt].r += r;
      var kh = p.fmt + '|' + hb;
      (porHora[kh] = porHora[kh] || { n: 0, r: 0, h: hb, fmt: p.fmt }).n++;
      porHora[kh].r += r;
      if (p.ver && ab[p.ver]) {
        ab[p.ver].n++;
        ab[p.ver].v += r;
      }
    });
    var fmtBom = null,
      mx = -1;
    Object.keys(porFmt).forEach(function (k) {
      var m = porFmt[k].r / porFmt[k].n;
      if (porFmt[k].n >= 2 && m > mx) {
        mx = m;
        fmtBom = k;
      }
    });
    var horaBoa = {};
    Object.keys(porHora).forEach(function (k) {
      var o = porHora[k],
        m = o.r / o.n;
      if (o.n >= 2 && (!horaBoa['_' + o.fmt] || m > horaBoa['_' + o.fmt])) {
        horaBoa['_' + o.fmt] = m;
        horaBoa[o.fmt] = o.h;
      }
    });
    return { lista: lista, porFmt: porFmt, fmtBom: fmtBom, horaBoa: horaBoa, ab: ab };
  }
  // ---- central ----
  function mkAbre() {
    mkKit();
    lfJanela({
      titulo: 'Marketing',
      cls: 'mkJn',
      monta: function (c, J) {
        var pinta = function () {
          var obj = mkObj(),
            P = mkPlano(),
            D = mkDatas(),
            st = mkEscolhe(obj, 1)[0],
            R = mkResultados(),
            h = '';
          // objetivo
          h += '<div class="mkSec">Objetivo do mês</div><div class="mkObj">' + MK_OBJ.map(function (o) {
            return '<button type="button" class="chip' + (o.id === obj ? ' on' : '') + '" data-obj="' + o.id + '">' + o.t + '</button>';
          }).join('') + '</div><div class="hint" style="margin:4px 0 0">' + esc(MK_OBJ.filter(function (o) { return o.id === obj; })[0].s) + (S.mkt.obj[mkMes()] ? '' : ' · sugerido pelos seus números') + '</div>';
          // status de hoje
          if (st)
            h += '<div class="mkSec">Status de hoje</div><button type="button" class="mkSt" data-cria="status" data-refs="' + esc(st.ref) + '"><span class="vtI"><img src="' + esc(st.f.foto) + '" alt=""></span><span style="flex:1;text-align:left"><b>' + esc(st.f.nome) + '</b><small>' + esc(mkPorque(st.f, obj).join(' · ')) + '</small></span>›</button>';
          // v442: Status com o vídeo do giro (Estúdio)
          var gr = Object.keys(S.giros || {}).filter(function (r) { return itemDoRef(r); }).sort(function (a, b) { return S.giros[b].ts - S.giros[a].ts; }).slice(0, 3);
          if (gr.length)
            h += '<div class="mkSec">Status com o giro</div>' + gr.map(function (r) {
              var f = mkFatos(r);
              return '<button type="button" class="mkSt" data-giro="' + esc(r) + '"><span class="vtI"><img src="' + esc(f.foto) + '" alt=""></span><span style="flex:1;text-align:left"><b>' + esc(f.nome) + '</b><small>vídeo de 12 s com nome e preço</small></span>›</button>';
            }).join('');
          // criar
          h += '<div class="mkSec">Criar com um toque</div><div class="mkCr">' + ['post', 'story', 'status', 'carr', 'video', 'rot'].map(function (k) {
            return '<button type="button" class="mini" data-cria="' + k + '">' + MK_FMT[k].t + '</button>';
          }).join('') + '</div>';
          // plano
          var feitos = P.filter(function (x) { return x.feito; }).length;
          h += '<div class="mkSec">Plano da semana · ' + feitos + ' de ' + P.length + '</div><div class="mkPl">' + P.map(function (x) {
            return '<div class="mkPi' + (x.feito ? ' ok' : '') + '"><button type="button" class="mkCk" data-feito="' + x.id + '" aria-label="Feito">' + (x.feito ? '✓' : '') + '</button><button type="button" class="mkPb" data-cria="' + x.fmt + '" data-refs="' + esc(x.refs.join(',')) + '" data-pid="' + x.id + '"><b>' + MK_DIAS[new Date(x.dia).getDay()] + ' · ' + MK_FMT[x.fmt].t + ' · ' + x.hora + '</b><small>' + esc(x.tema) + (x.refs.length ? ' — ' + x.refs.map(pn).slice(0, 2).join(', ') + (x.refs.length > 2 ? '…' : '') : '') + '</small></button></div>';
          }).join('') + '</div>';
          // datas
          if (D.length)
            h += '<div class="mkSec">Datas que vêm aí</div><div class="split">' + D.slice(0, 4).map(function (d) {
              return '<div class="sl"><span>' + esc(d.t) + ' <span class="hint" style="display:inline;margin:0">' + d.pais + '</span><small>' + esc(d.ideia) + '</small></span><b>' + (d.em === 0 ? 'hoje' : 'em ' + d.em + ' d') + '</b></div>';
            }).join('') + '</div>';
          // listas
          var LS = mkListas();
          h += '<details class="mkDt"><summary class="mkSec">Listas por perfil</summary><div class="hint" style="margin:0 0 6px">Para as listas de transmissão do WhatsApp Business: copie os números e cole na lista.</div><div class="split">' + LS.map(function (l) {
            return '<div class="sl"><span>' + esc(l.t) + '<small>' + l.cl.length + ' com telefone' + (l.s ? ' · ' + l.s : '') + '</small></span>' + (l.cl.length ? '<button type="button" class="mini" data-lista="' + l.id + '">Copiar</button>' : '<b>—</b>') + '</div>';
          }).join('') + '</div></details>';
          // resultados
          h += '<details class="mkDt"><summary class="mkSec">Resultados</summary>';
          if (!R.lista.length) h += '<div class="hint" style="margin:0">Poste pelo app: em 2 dias começo a medir vendas e pedidos do site das peças de cada post.</div>';
          else {
            h += '<div class="split">' + Object.keys(R.porFmt).map(function (k) {
              var o = R.porFmt[k];
              return '<div class="sl"><span>' + MK_FMT[k].t + '<small>' + o.n + ' post(s)</small></span><b>' + (Math.round((o.r / o.n) * 10) / 10).toString().replace('.', ',') + ' vendas/post</b></div>';
            }).join('') + '</div>';
            if (R.fmtBom) h += '<div class="hint" style="margin:6px 0 0">Regra do plano: ' + MK_FMT[R.fmtBom].t + ' é o que mais vende' + (R.horaBoa[R.fmtBom] ? ', às ' + R.horaBoa[R.fmtBom] : '') + '.</div>';
            if (R.ab.A.n && R.ab.B.n) h += '<div class="hint" style="margin:4px 0 0">Teste A/B: versão A ' + (R.ab.A.v / R.ab.A.n).toFixed(1).replace('.', ',') + ' × versão B ' + (R.ab.B.v / R.ab.B.n).toFixed(1).replace('.', ',') + ' vendas por post.</div>';
          }
          h += '</details>';
          // kit
          var K = mkKit();
          h += '<details class="mkDt"><summary class="mkSec">Kit da marca</summary><div class="mkKit">' + [['nome', 'Nome'], ['slogan', 'Frase'], ['end', 'Endereço'], ['wa', 'WhatsApp'], ['site', 'Site'], ['tom', 'Tom de voz'], ['tags', 'Hashtags']].map(function (k) {
            return '<label><span>' + k[1] + '</span><input class="in" data-kit="' + k[0] + '" value="' + esc(K[k[0]] || '') + '"></label>';
          }).join('') + '<label><span>Idiomas</span><select class="in selAl" data-kit="idioma"><option value="ambos"' + (K.idioma === 'ambos' ? ' selected' : '') + '>Português e Español</option><option value="pt"' + (K.idioma === 'pt' ? ' selected' : '') + '>Português</option><option value="es"' + (K.idioma === 'es' ? ' selected' : '') + '>Español</option></select></label><div class="mkCores">' + EB_EST.map(function (s) { return '<i style="background:' + s.bg + ';border-color:' + s.ac + '"></i>'; }).join('') + '</div></div></details>';
          c.innerHTML = h;
        };
        pinta();
        c.onclick = function (e) {
          var b = e.target.closest('button');
          if (!b) return;
          if (b.dataset.obj) {
            S.mkt.obj[mkMes()] = b.dataset.obj;
            saveSoon();
            return pinta();
          }
          if (b.dataset.feito) {
            var id = b.dataset.feito;
            if (S.mkt.feito[id]) delete S.mkt.feito[id];
            else S.mkt.feito[id] = Date.now();
            saveSoon();
            return pinta();
          }
          if (b.dataset.lista) {
            var l = mkListas().filter(function (x) { return x.id === b.dataset.lista; })[0],
              tx = l.cl.map(function (x) { return x.tel; }).join('\n'),
              okc = function () { lfToast(l.cl.length + ' números copiados'); };
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(tx).then(okc, okc);
            else okc();
            return;
          }
          if (b.dataset.giro) return mkGiroStatus(b.dataset.giro);
          if (b.dataset.cria) mkCria(b.dataset.cria, b.dataset.refs ? b.dataset.refs.split(',').filter(Boolean) : null, b.dataset.pid, pinta);
        };
        c.onchange = function (e) {
          var k = e.target.dataset && e.target.dataset.kit;
          if (!k) return;
          mkKit()[k] = e.target.value;
          saveSoon();
        };
      }
    });
  }
  // ---- criar ----
  function mkCria(fmt, refs, pid, depois) {
    var obj = mkObj(),
      n = fmt === 'carr' ? 4 : fmt === 'video' || fmt === 'rot' ? 3 : 1,
      pecas = refs && refs.length ? refs.filter(itemDoRef).map(function (r) { return { ref: r, f: mkFatos(r) }; }) : mkEscolhe(obj, n);
    if (!pecas.length) return lfToast('Sem peças com foto e estoque');
    var E = { ver: 'A', idi: mkKit().idioma || 'ambos', est: 0, estilo: obj === 'girar' ? 'oferta' : obj === 'lanc' ? 'rapido' : 'elegante' };
    lfJanela({
      titulo: MK_FMT[fmt].t + (fmt === 'rot' ? ' de vídeo' : ''),
      cls: 'mkJn mkCrJn',
      monta: function (c, J) {
        var pinta = function () {
          var h = '<div class="mkWhy"><b>Por que estas peças</b>' + pecas.map(function (p) {
            return '<div><span>' + esc(p.f.nome) + '</span><small>' + esc(mkPorque(p.f, obj).join(' · ')) + '</small></div>';
          }).join('') + '</div>';
          if (fmt === 'rot') {
            var rt = mkRoteiro(pecas, obj);
            h += '<div class="mkRot">' + rt.map(function (r) {
              return '<div><b>' + r.t + '</b><small>' + esc(r.plano) + '</small><p>“' + esc(r.fala) + '”</p></div>';
            }).join('') + '</div><button type="button" class="go" id="mkTp">Abrir teleprompter</button><button type="button" class="mini" id="mkMv" style="width:100%">Montar vídeo com as fotos</button>';
            c.innerHTML = h;
            $('mkTp').onclick = function () {
              mkTeleprompter(rt.map(function (r) { return r.fala; }).join('\n'));
            };
            $('mkMv').onclick = function () {
              J.fecha();
              mkCria('video', pecas.map(function (p) { return p.ref; }), pid, depois);
            };
            return;
          }
          if (fmt === 'video')
            h += '<div class="trk mkTrk" id="mkEsl"><span class="trkTh"></span><button type="button" class="trkB" data-m="elegante">Elegante</button><button type="button" class="trkB" data-m="rapido">Rápido</button><button type="button" class="trkB" data-m="oferta">Oferta</button></div><div class="hint" style="margin:6px 0">15 segundos · gerado no celular · ' + pecas.length + ' peça(s)</div>';
          else h += '<div class="mkPv" id="mkPv"></div>';
          h += '<div class="mkLin"><div class="trk mkTrk" id="mkVer"><span class="trkTh"></span><button type="button" class="trkB" data-m="A">Versão A</button><button type="button" class="trkB" data-m="B">Versão B</button></div>' +
            '<div class="trk mkTrk" id="mkIdi"><span class="trkTh"></span><button type="button" class="trkB" data-m="pt">PT</button><button type="button" class="trkB" data-m="es">ES</button><button type="button" class="trkB" data-m="ambos">PT+ES</button></div></div>' +
            (fmt !== 'video' ? '<div class="ebEst" id="mkEst">' + EB_EST.map(function (s, k) { return '<button type="button" data-k="' + k + '" style="background:' + s.bg + '"' + (k === E.est ? ' class="on"' : '') + '></button>'; }).join('') + '</div>' : '') +
            '<textarea class="in ebTx" id="mkTx" rows="7"></textarea>' +
            '<button type="button" class="go" id="mkPost">Postar agora' + (shUlt() ? ' no ' + esc((SH_APPS.filter(function (a) { return a.id === shUlt(); })[0] || {}).nome || '') : '') + '</button>' +
            '<button type="button" class="mini" id="mkLemb" style="width:100%">Me lembra às ' + mkHoraBoa(fmt) + '</button>';
          c.innerHTML = h;
          $('mkTx').value = mkLegenda(pecas, obj, E.ver, E.idi, fmt);
          [['mkVer', 'ver'], ['mkIdi', 'idi'], ['mkEsl', 'estilo']].forEach(function (z) {
            var t = $(z[0]);
            if (!t) return;
            trkMarca(t, E[z[1]]);
            t.onclick = function (e) {
              var bb = e.target.closest('.trkB');
              if (!bb) return;
              E[z[1]] = bb.dataset.m;
              trkMarca(t, E[z[1]]);
              if (z[1] !== 'estilo') $('mkTx').value = mkLegenda(pecas, obj, E.ver, E.idi, fmt);
            };
          });
          if ($('mkEst'))
            $('mkEst').onclick = function (e) {
              var bb = e.target.closest('button');
              if (!bb) return;
              E.est = +bb.dataset.k;
              [].forEach.call(this.children, function (x, k) {
                x.classList.toggle('on', k === E.est);
              });
              prev();
            };
          var prev = function () {
            var pv = $('mkPv');
            if (!pv) return;
            Promise.all(pecas.map(function (p) { return envImg(p.f.foto); })).then(function (ims) {
              pv.innerHTML = '';
              pecas.forEach(function (p, k) {
                var cv = mkImagem(p.f, ims[k], fmt, E.est, k, pecas.length);
                cv.className = 'mkCv';
                pv.appendChild(cv);
              });
            });
          };
          prev();
          $('mkPost').onclick = function () {
            mkPosta(fmt, pecas, E, $('mkTx').value, pid).then(function () {
              J.fecha();
              if (depois) depois();
            });
          };
          $('mkLemb').onclick = function () {
            var hh = parseInt(mkHoraBoa(fmt), 10),
              d = new Date();
            d.setHours(hh, 0, 0, 0);
            if (d.getTime() <= Date.now()) d = new Date(d.getTime() + DAY);
            S.mkt.lemb.push({ ts: d.getTime(), fmt: fmt, refs: pecas.map(function (p) { return p.ref; }), pid: pid || '' });
            saveSoon();
            J.fecha();
            lfToast('Te lembro às ' + hh + 'h');
          };
        };
        pinta();
      }
    });
  }
  function mkPosta(fmt, pecas, E, txt, pid) {
    var ap = SH_APPS.filter(function (a) { return a.id === shUlt(); })[0] || { id: 'mais', nome: 'Mais' },
      P = shPlug(),
      reg = function () {
        S.mkt.posts.push({ ts: Date.now(), fmt: fmt, refs: pecas.map(function (p) { return p.ref; }), ver: E.ver, obj: mkObj() });
        if (S.mkt.posts.length > 300) S.mkt.posts = S.mkt.posts.slice(-300);
        if (pid) S.mkt.feito[pid] = Date.now();
        saveSoon();
      };
    var envia = function (arqs, b64) {
      reg();
      if (P) return P.send({ pkg: ap.pkg || '', text: txt, files: b64 || [] }).catch(function () {});
      if (navigator.share && (!arqs.length || (navigator.canShare && navigator.canShare({ files: arqs })))) return navigator.share(arqs.length ? { files: arqs, text: txt } : { text: txt }).catch(function () {});
      window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
    };
    if (fmt === 'video') {
      loadMsg(true, 'Gravando o vídeo (15 s)');
      return mkVideo(pecas, E.est, E.estilo)
        .then(function (bl) {
          loadMsg(false);
          var ext = /mp4/.test(bl.type) ? 'mp4' : 'webm',
            f = new File([bl], 'lafouch-video.' + ext, { type: bl.type });
          if (P)
            return new Promise(function (ok) {
              var r = new FileReader();
              r.onload = function () {
                reg();
                P.send({ pkg: ap.pkg || '', text: txt, files: [], video: String(r.result).split(',')[1], ext: ext }).catch(function () {}).then(ok);
              };
              r.readAsDataURL(bl);
            });
          return envia([f]);
        })
        .catch(function (e) {
          loadMsg(false);
          lfToast('Não consegui gravar o vídeo: ' + ((e && e.message) || 'erro'));
        });
    }
    return Promise.all(pecas.map(function (p) { return envImg(p.f.foto); })).then(function (ims) {
      var cvs = pecas.map(function (p, k) {
        return mkImagem(p.f, ims[k], fmt, E.est, k, pecas.length);
      });
      if (fmt !== 'carr') cvs = cvs.slice(0, 1);
      return Promise.all(cvs.map(envBlob)).then(function (bl) {
        var arqs = bl.map(function (b, k) {
          return new File([b], 'lafouch-' + fmt + '-' + (k + 1) + '.jpg', { type: 'image/jpeg' });
        });
        return envia(arqs, cvs.map(shB64));
      });
    });
  }
  ACT.mkAbre = function () {
    mkAbre();
  };
  // Lembretes "Me lembra às 20h": viram aviso no sino na hora.
  function mkLembra() {
    var now = Date.now(),
      vence = (S.mkt.lemb || []).filter(function (l) {
        return l.ts <= now;
      });
    if (!vence.length) return;
    S.mkt.lemb = S.mkt.lemb.filter(function (l) {
      return l.ts > now;
    });
    vence.forEach(function (l) {
      (S.notifs = S.notifs || []).unshift({ ts: now, lida: false, t: 'Hora de postar: ' + MK_FMT[l.fmt].t, s: l.refs.map(pn).slice(0, 3).join(', '), acts: [{ act: 'mkAbre', id: '', b: 'Abrir Marketing' }] });
    });
    saveSoon();
    render();
  }
  if (!/#test/.test(location.hash)) setInterval(mkLembra, 60000);
  // Botão Marketing no Início
  ICO_D.mkt = '<path d="M3 10v4h3l7 5V5L6 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>';
  if (INI_PADRAO.indexOf('mkt') < 0) INI_PADRAO.push('mkt');
  if (INI_TODOS.indexOf('mkt') < 0) INI_TODOS.push('mkt');
  // ---------- v442: o giro do Estúdio vira Status (vídeo vertical com nome e preço, sem som) ----------
  function mkGiroStatus(ref) {
    estGiroLe(ref).then(function (bl) {
      if (!bl) return lfToast('O vídeo do giro não está neste aparelho');
      if (!window.MediaRecorder) return lfToast('Este aparelho não monta vídeo pelo app');
      loadMsg(true, 'Montando o Status');
      var f = mkFatos(ref),
        K = mkKit ? mkKit() : {},
        v = document.createElement('video'),
        u = URL.createObjectURL(bl),
        W = 1080,
        H = 1920,
        cv = mkCanvas(W, H),
        g = cv.getContext('2d');
      v.muted = true;
      v.playsInline = true;
      v.src = u;
      v.onloadeddata = function () {
        var st = cv.captureStream(30),
          tipos = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm'],
          mt = tipos.filter(function (t) { return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t); })[0] || '',
          rec = new MediaRecorder(st, mt ? { mimeType: mt, videoBitsPerSecond: 6000000 } : undefined),
          ch = [],
          fim = false;
        rec.ondataavailable = function (e) {
          if (e.data && e.data.size) ch.push(e.data);
        };
        rec.onstop = function () {
          loadMsg(false);
          URL.revokeObjectURL(u);
          var out = new Blob(ch, { type: mt || 'video/webm' }),
            fl = new File([out], 'status-' + ref + (/mp4/.test(out.type) ? '.mp4' : '.webm'), { type: out.type });
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [fl] })) navigator.share({ files: [fl] }).catch(function () {});
          else {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(out);
            a.download = fl.name;
            a.click();
          }
        };
        var desenha = function () {
          if (fim) return;
          g.fillStyle = '#fff';
          g.fillRect(0, 0, W, H);
          var vw = v.videoWidth || 16,
            vh = v.videoHeight || 9,
            sc = W / vw,
            dh = vh * sc;
          g.drawImage(v, 0, (H - dh) / 2 - 120, W, dh);
          g.fillStyle = '#2a1a26';
          g.textAlign = 'center';
          g.font = '600 64px Georgia, serif';
          g.fillText(f.nome, W / 2, H - 420);
          if (f.preco) {
            g.font = '800 92px Inter, system-ui, sans-serif';
            g.fillStyle = '#a2447c';
            g.fillText(gs(f.preco), W / 2, H - 300);
          }
          g.font = '500 40px Inter, system-ui, sans-serif';
          g.fillStyle = '#6b5563';
          g.fillText((K.slogan || 'La Fouch · Tudo em óculos'), W / 2, H - 200);
          requestAnimationFrame(desenha);
        };
        rec.start(500);
        v.play().then(desenha, desenha);
        v.onended = function () {
          fim = true;
          rec.stop();
        };
        setTimeout(function () {
          if (!fim) {
            fim = true;
            try { v.pause(); } catch (e) {}
            rec.stop();
          }
        }, 14000);
      };
      v.onerror = function () {
        loadMsg(false);
        lfToast('Não consegui abrir o vídeo do giro');
      };
    });
  }
