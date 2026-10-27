  // ===== Completar fotos: todo produto precisa de foto em cada cor. A fila leva modelo por modelo. =====
  // Cores com peça em estoque que ainda não têm foto (peças simples e a granel ficam de fora).
  function fotoPend() {
    var seen = {},
      out = [];
    S.items.forEach(function (i) {
      if (!i.ref || i.bulk || i.qty <= 0 || isSimple(i.tipo) || !i.cor || i.cor === 'Sem cor') return;
      var k = i.ref + '|' + i.cor;
      if (seen[k] || S.fotos[k]) return;
      seen[k] = 1;
      out.push({ ref: i.ref, cor: i.cor, k: k });
    });
    return out;
  }
  function fotoPendModelos() {
    var s = {};
    fotoPend().forEach(function (p) {
      s[p.ref] = 1;
    });
    return Object.keys(s).length;
  }
  // Fila: abre a câmera para cada cor sem foto, um modelo de cada vez.
  function fotosFila() {
    var pulados = {},
      alvo = null;
    function prox() {
      return fotoPend().filter(function (p) {
        return !pulados[p.k];
      })[0];
    }
    leitorDlg(function (bx, close) {
      var fi = document.createElement('input');
      fi.type = 'file';
      fi.accept = 'image/*';
      fi.setAttribute('capture', 'environment');
      fi.hidden = true;
      fi.id = 'cfFile';
      bx.appendChild(fi);
      var corpo = mk('div', '');
      corpo.style.cssText = 'display:flex;flex-direction:column;gap:10px';
      bx.appendChild(corpo);
      fi.onchange = function () {
        var f = fi.files && fi.files[0];
        fi.value = '';
        if (!f || !alvo) return;
        var a = alvo,
          url = URL.createObjectURL(f),
          img = new Image();
        img.onload = function () {
          try {
            var cv = fitCanvas(img, 1800);
            setFoto(a.k, thumbOf(cv), cv.toDataURL('image/jpeg', 0.92));
            if (S.site && S.site[a.ref] && typeof vitFila === 'function') vitFila(a.ref, 'upd');
            saveSoon();
          } catch (e) {}
          URL.revokeObjectURL(url);
          draw();
          render();
        };
        img.src = url;
      };
      function draw() {
        corpo.textContent = '';
        var tot = fotoPend().length,
          p = prox();
        alvo = p || null;
        var hd = mk('div', '');
        hd.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:10px';
        hd.appendChild(mk('b', '', 'Completar fotos'));
        hd.appendChild(btn('tab', 'Fechar', close));
        corpo.appendChild(hd);
        if (!p) {
          corpo.appendChild(mk('div', 'hint', tot ? 'Você pulou as que faltam. Feche e abra de novo para recomeçar.' : '✓ Todos os modelos têm foto.'));
          return;
        }
        corpo.appendChild(mk('div', 'hint', tot + (tot === 1 ? ' cor sem foto' : ' cores sem foto')));
        var cd = mk('div', 'card');
        cd.style.cssText = 'display:flex;gap:12px;align-items:center;padding:12px';
        var th = mk('div', 'nvthm');
        th.innerHTML = NV_ICAM;
        th.style.cssText = 'width:64px;height:52px';
        cd.appendChild(th);
        var tx = mk('div', '');
        tx.appendChild(mk('b', '', pubNome(p.ref)));
        var sm = mk('div', 'hint', 'Cor ' + p.cor + ' · ' + p.ref);
        sm.style.margin = '2px 0 0';
        tx.appendChild(sm);
        cd.appendChild(tx);
        corpo.appendChild(cd);
        var fb = btn('go', '', function () {
          camOpen(
            function (f) {
              try {
                var dt = new DataTransfer();
                dt.items.add(f);
                fi.files = dt.files;
                fi.onchange();
              } catch (e) {
                fi.click();
              }
            },
            'Foto da cor ' + p.cor,
            { gallery: true, tip: 'Ponha UMA peça inteira dentro do retângulo. Toque na tela para focar.' }
          );
        });
        fb.innerHTML = NV_ICAM + '<span>Fotografar</span>';
        fb.style.cssText += ';display:flex;align-items:center;justify-content:center;gap:8px';
        fb.id = 'cfFoto';
        corpo.appendChild(fb);
        var pu = btn('chip', 'Pular esta', function () {
          pulados[p.k] = 1;
          draw();
        });
        pu.style.cssText += ';width:100%;justify-content:center';
        corpo.appendChild(pu);
      }
      draw();
    });
  }
