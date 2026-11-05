  // ===== Compartilhar inteligente (v427, aprovado 04/11/2026) =====
  // Janela com WhatsApp Business, WhatsApp, Instagram, Copiar link e Mais. O último app usado NESTE aparelho
  // vem primeiro (com contorno) para evitar fadiga. Com o app novo (plugin LfShare) abre direto o app escolhido;
  // no app antigo, cai na lista do celular. Catálogo: folha, fotos separadas ou só texto (como já era).
  // Peça (tela Vender): foto + nome + preço + link da peça no site.
  var SH_APPS = [
    { id: 'wab', nome: 'WA Business', pkg: 'com.whatsapp.w4b', cor: '#25b06a', ico: '<path d="M4 19l1.2-3.6A8 8 0 1 1 8.6 19z"/><path d="M10 9.5v5h2.2a1.3 1.3 0 0 0 0-2.6H10m0 0h1.9a1.2 1.2 0 0 0 0-2.4H10" stroke-linecap="round"/>' },
    { id: 'wa', nome: 'WhatsApp', pkg: 'com.whatsapp', cor: '#25b06a', ico: '<path d="M4 19l1.2-3.6A8 8 0 1 1 8.6 19z"/><path d="M9.5 9.2c0 2.8 2.5 5.3 5.3 5.3l.9-1.2-1.6-.9-.8.7c-1-.4-1.9-1.3-2.3-2.3l.7-.8-.9-1.6z" fill="currentColor" stroke="none"/>' },
    { id: 'ig', nome: 'Instagram', pkg: 'com.instagram.android', cor: '#d65a96', ico: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r=".9" fill="currentColor" stroke="none"/>' },
    { id: 'link', nome: 'Copiar link', cor: '', ico: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>' },
    { id: 'mais', nome: 'Mais', cor: '', ico: '<circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/>' }
  ];
  var SH_INST = null; // apps instalados (pelo plugin); null = não sabemos (mostra todos)
  function shPlug() {
    var C = window.Capacitor;
    return C && C.Plugins && C.Plugins.LfShare && C.isNativePlatform && C.isNativePlatform() ? C.Plugins.LfShare : null;
  }
  function shUlt() {
    try {
      return localStorage.getItem('lf_shUlt') || '';
    } catch (e) {
      return '';
    }
  }
  function shGuardaUlt(id) {
    try {
      localStorage.setItem('lf_shUlt', id);
    } catch (e) {}
  }
  function shOrdem() {
    var u = shUlt(),
      l = SH_APPS.filter(function (a) {
        return !a.pkg || !SH_INST || SH_INST.indexOf(a.pkg) >= 0;
      });
    var ap = l.filter(function (a) {
        return a.pkg;
      }),
      out = l.filter(function (a) {
        return !a.pkg;
      });
    ap.sort(function (a, b) {
      return (b.id === u) - (a.id === u);
    });
    return ap.concat(out);
  }
  function shLinkPeca(ref) {
    return S.site && S.site[ref] ? 'https://lafouch.com/p/' + encodeURIComponent(ref) + '.html' : 'https://lafouch.com';
  }
  function shPecaDados(ref) {
    var it = itemDoRef(ref),
      p = it ? precoTab(it) : 0;
    return { ref: ref, nome: pn(ref), preco: p, foto: photoOf(ref) };
  }
  function shTextoPeca(d) {
    var m = vMoeda(),
      pr = m === 'pyg' ? gs(d.preco) : fmtM(Math.round((d.preco / ratePyg(m)) * 100) / 100, m) + ' · ' + gs(d.preco);
    return d.nome + ' · ' + pr + '\n' + shLinkPeca(d.ref) + '\nLa Fouch · Galeria Jebai Center, Ciudad del Este';
  }
  function shB64(cv) {
    return cv.toDataURL('image/jpeg', 0.9).split(',')[1];
  }
  // Monta o que vai: {text, files:[base64], blobs:[File]}
  function shConteudo(o, fmt, txt) {
    if (o.tipo === 'peca') {
      var d = shPecaDados(o.ref);
      return envImg(d.foto).then(function (im) {
        var cv = envFoto(d, im);
        return { text: txt || shTextoPeca(d), cvs: [cv], nome: ['lafouch-' + d.ref + '.jpg'] };
      });
    }
    var pecas = envPecas();
    if (fmt === 'texto' || !pecas.length) return Promise.resolve({ text: txt || envMsg(), cvs: [], nome: [] });
    return Promise.all(pecas.map(function (p) {
      return envImg(p.foto);
    })).then(function (imgs) {
      var cvs = fmt === 'folha' ? [envFolha(pecas, imgs)] : pecas.map(function (p, k) {
        return envFoto(p, imgs[k]);
      });
      return { text: txt || envMsg(), cvs: cvs, nome: cvs.map(function (c, k) { return fmt === 'folha' ? 'catalogo-lafouch.jpg' : 'lafouch-' + pecas[k].ref + '.jpg'; }) };
    });
  }
  function shEnvia(app, o, fmt, txt) {
    return shConteudo(o, fmt, txt).then(function (c) {
      if (app.id === 'link') {
        var lk = o.tipo === 'peca' ? shLinkPeca(o.ref) : 'https://lafouch.com';
        var ok = function () {
          lfToast('✓ Link copiado');
        };
        if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(lk).then(ok, ok);
        ok();
        return;
      }
      var P = shPlug();
      if (P) return P.send({ pkg: app.pkg || '', text: c.text, files: c.cvs.map(shB64) });
      // app antigo (sem o plugin): lista do celular com as imagens; sem isso, WhatsApp só com o texto
      return Promise.all(c.cvs.map(envBlob)).then(function (bl) {
        var arqs = bl.map(function (b, k) {
          return new File([b], c.nome[k], { type: 'image/jpeg' });
        });
        if (navigator.share && (!arqs.length || (navigator.canShare && navigator.canShare({ files: arqs }))))
          return navigator.share(arqs.length ? { files: arqs, text: c.text } : { text: c.text }).catch(function () {});
        window.open('https://wa.me/?text=' + encodeURIComponent(c.text), '_blank');
      });
    });
  }
  function shAbre(o) {
    var P = shPlug();
    if (P && SH_INST == null)
      P.apps().then(function (r) {
        SH_INST = (r && r.apps) || [];
      }, function () {
        SH_INST = [];
      });
    var fmt = S.envFmt || 'folha',
      d = o.tipo === 'peca' ? shPecaDados(o.ref) : null,
      ttl = d ? d.nome : 'Catálogo · ' + envPecas().length + ' peça(s)',
      sub = d ? 'foto + preço + link do site' : (tabDe(S.tabAtiva).pub ? 'preços de balcão' : 'tabela ' + tabDe(S.tabAtiva).nome),
      u = shUlt();
    var J = lfJanela({
      titulo: 'Compartilhar',
      cls: 'shJn',
      monta: function (c, J) {
        c.innerHTML =
          '<div class="shTopo">' + (d && d.foto ? '<img src="' + esc(d.foto) + '" alt="">' : '<span class="shIc0">' + CJ_ICO.sh + '</span>') + '<div><b>' + esc(ttl) + '</b><div class="hint" style="margin:0">' + esc(sub) + '</div></div></div>' +
          (d ? '' : '<div class="trk shFmt" id="shFmt"><span class="trkTh"></span><button type="button" class="trkB" data-m="folha">Folha</button><button type="button" class="trkB" data-m="fotos">Fotos</button><button type="button" class="trkB" data-m="texto">Só texto</button></div>') +
          '<div class="shAp" id="shAp">' + shOrdem().map(function (a) {
            return '<button type="button" class="shA' + (a.id === u && a.pkg ? ' pri' : '') + '" data-id="' + a.id + '"><span class="shI" style="' + (a.cor ? 'color:' + a.cor : '') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">' + a.ico + '</svg></span><span class="shN">' + a.nome + '</span></button>';
          }).join('') + '</div>' +
          '<button type="button" class="ebEnt" id="shEb"><span class="shIc0">' + CJ_ICO.sh + '</span><span style="flex:1;text-align:left"><b>Enviar bonito</b><small>' + (d ? 'cartão com o nome do cliente' : 'segure as peças no catálogo para escolher') + '</small></span>›</button>' +
          '<details class="shMsg"><summary>Mensagem</summary><textarea class="in" id="shTx" rows="4"></textarea></details>';
        $('shTx').value = d ? shTextoPeca(d) : envMsg();
        var tf = $('shFmt');
        if (tf) {
          trkMarca(tf, fmt);
          tf.onclick = function (e) {
            var b = e.target.closest('.trkB');
            if (!b) return;
            fmt = S.envFmt = b.dataset.m;
            trkMarca(tf, fmt);
          };
        }
        requestAnimationFrame(function () {
          var ap = $('shAp');
          if (ap) ap.classList.add('in');
        });
        $('shEb').onclick = function () {
          J.fecha();
          if (d) return ebAbre([o.ref]);
          S.ebSel = [];
          lfToast('Segure uma peça para começar');
        };
        $('shAp').onclick = function (e) {
          var b = e.target.closest('.shA');
          if (!b || J._indo) return;
          var app = SH_APPS.filter(function (a) {
            return a.id === b.dataset.id;
          })[0];
          J._indo = 1;
          if (app.pkg) shGuardaUlt(app.id);
          b.classList.add('voa');
          var tx = $('shTx').value;
          setTimeout(function () {
            J.fecha();
            shEnvia(app, o, fmt, tx).catch(function () {
              lfToast('Não consegui abrir o ' + app.nome);
            });
          }, REDUCED ? 0 : 360);
        };
      }
    });
  }
