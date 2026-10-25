  // ===== Categorias, formatos, cores, variações (C1–C6) e criação de tipos. =====

  // ---------- navegação

  // Data URL → Blob.
  function dataToBlob(u, type) {
    return fetch(u)
      .then(function (r) {
        return r.blob();
      })
      .then(function (b) {
        if (!type || b.type === type) return b;
        return new Promise(function (ok, no) {
          var im = new Image();
          im.onload = function () {
            var c = document.createElement('canvas');
            c.width = im.naturalWidth;
            c.height = im.naturalHeight;
            c.getContext('2d').drawImage(im, 0, 0);
            c.toBlob(function (x) {
              x ? ok(x) : no();
            }, type);
          };
          im.onerror = no;
          im.src = u;
        });
      });
  }
  // Filtros da aba WhatsApp: Todos · Novidades · Ofertas · Solares · Armações
  function cvMarcaNovos() {
    if (!S.novoEm) S.novoEm = {};
    var base = !S.novoBase;
    S.novoBase = true;
    S.items.forEach(function (i) {
      if (S.novoEm[i.ref] == null) S.novoEm[i.ref] = base ? 0 : Date.now();
    });
  }
  function cvPassa(i) {
    var f = S.cvF || 'all';
    if (f === 'solar') return i.tipo === 'solar';
    if (f === 'arm') return i.tipo === 'sem';
    if (f === 'novi') return (S.novoEm || {})[i.ref] > Date.now() - 30 * 864e5;
    if (f === 'ofer') {
      var p = S.pprice && S.pprice[i.ref];
      return !!(p && p.ant > 0 && p.novo > 0 && p.ant > p.novo);
    }
    return true;
  }
  // Categorias em uso.
  function catList() {
    var seen = {},
      out = [];
    S.items.forEach(function (i) {
      if (
        i.qty <= 0 ||
        !TIPOS.some(function (x) {
          return x.id === i.tipo;
        }) ||
        !cvPassa(i)
      )
        return;
      var k = i.ref + '|' + i.cor;
      if (!S.fotos[k] || seen[k]) return;
      seen[k] = 1;
      out.push({
        k: k,
        ref: i.ref,
        cor: i.cor,
        src: S.fotos[k],
        cap: pubNome(i.ref) + (i.cor && i.cor !== 'Sem cor' ? ' · ' + i.cor : '')
      });
    });
    return out;
  }
  // Tela de categorias por tipo.
  function renderCatV() {
    S.cvTipo = 'all';
    if (!S.cvOff) S.cvOff = {};
    cvMarcaNovos();
    $('catV').hidden = !S.catOpen;
    document.body.classList.toggle('catopen', !!S.catOpen);
    if (!S.catOpen) return;
    var L = catList(),
      g = $('cvGal');
    g.textContent = '';
    var n = 0;
    var ch = $('cvChips');
    ch.textContent = '';
    [['all', 'Todos'], ['novi', 'Novidades'], ['ofer', 'Ofertas'], ['solar', 'Solares'], ['arm', 'Armações']].forEach(function (c) {
      ch.appendChild(
        btn('chip' + ((S.cvF || 'all') === c[0] ? ' on' : ''), c[1], function () {
          S.cvF = c[0];
          render();
        }, (S.cvF || 'all') === c[0])
      );
    });
    L.forEach(function (o) {
      var on = !S.cvOff[o.k];
      if (on) n++;
      var t = mk('div', 'gi');
      t.style.cssText =
        'cursor:pointer;position:relative;outline:' +
        (on ? '2px solid var(--accent)' : '2px solid transparent') +
        ';opacity:' +
        (on ? 1 : 0.45);
      t.setAttribute('role', 'button');
      t.setAttribute('aria-pressed', on);
      t.tabIndex = 0;
      var im = mk('img');
      im.src = o.src;
      im.alt = 'Foto ' + o.cap;
      t.appendChild(im);
      if (on) t.appendChild(mk('i', 'ck', '✓'));
      var tg = function () {
        S.cvOff[o.k] = on;
        render();
      };
      t.onclick = tg;
      t.onkeydown = function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tg();
        }
      };
      g.appendChild(t);
    });
    $('cvCount').textContent = n + ' de ' + L.length + ' selecionados';
    $('cvAll').textContent = n === L.length ? 'Limpar' : 'Selecionar tudo';
    $('cvSend').disabled = !n;
    $('cvMsgB').disabled = !n;
    $('cvSend').textContent = n
      ? 'Enviar ' + n + ' ' + (n === 1 ? 'imagem' : 'imagens')
      : 'Enviar imagens';
    $('cvH').textContent = L.length
      ? 'No celular abre o compartilhamento e você escolhe o WhatsApp. No computador, as imagens são copiadas (uma por vez) ou baixadas.'
      : 'Sem fotos de peças em estoque nesse tipo. Use "+ Adicionar produto" > "Tirar foto da peça".';
  }
  $('cvAll').onclick = function () {
    var L = catList(),
      todos = L.every(function (o) {
        return !S.cvOff[o.k];
      });
    L.forEach(function (o) {
      S.cvOff[o.k] = todos;
    });
    render();
  };
  // Folha "Mensagem…": para quem, o que mostrar, prévia
  $('cvMsgB').onclick = function () {
    var o = S.cvCfg || (S.cvCfg = { para: 'cli', preco: true, cod: false, dePor: true });
    var sel = catList().filter(function (x) {
      return !S.cvOff[x.k];
    });
    if (!sel.length) return;
    var ov = mk('div', 'modal'),
      bx = mk('div', 'modal-box');
    bx.style.maxWidth = '460px';
    ov.appendChild(bx);
    function desenha() {
      bx.textContent = '';
      bx.appendChild(mk('b', '', 'Mensagem das fotos'));
      var pr = mk('div', 'nav');
      pr.appendChild(mk('div', 'zlb', 'PARA QUEM'));
      [['cli', 'Clientes'], ['atac', 'Atacadistas']].forEach(function (c) {
        pr.appendChild(btn('chip' + (o.para === c[0] ? ' on' : ''), c[1], function () {
          o.para = c[0];
          desenha();
        }, o.para === c[0]));
      });
      bx.appendChild(pr);
      [['preco', 'Mostrar preço'], ['cod', 'Mostrar código do produto'], ['dePor', 'Mostrar "de/por" nas ofertas']].forEach(function (c) {
        var l = mk('div', 'zl');
        l.appendChild(mk('span', '', c[1]));
        var sw = btn('zsw' + (o[c[0]] ? ' on' : ''), '', function () {
          o[c[0]] = !o[c[0]];
          desenha();
        });
        sw.setAttribute('role', 'switch');
        sw.setAttribute('aria-checked', o[c[0]] ? 'true' : 'false');
        sw.setAttribute('aria-label', c[1]);
        l.appendChild(sw);
        bx.appendChild(l);
      });
      var pv = mk('pre', 'replist', cvTexto(sel));
      bx.appendChild(pv);
      var ln = mk('div', '');
      ln.style.cssText = 'display:flex;gap:8px;justify-content:flex-end';
      ln.appendChild(btn('chip', 'Fechar', function () {
        ov.remove();
      }));
      ln.appendChild(btn('mini', 'Enviar ' + sel.length + (sel.length === 1 ? ' foto' : ' fotos') + ' + mensagem', function () {
        ov.remove();
        $('cvSend').click();
      }));
      bx.appendChild(ln);
    }
    desenha();
    document.body.appendChild(ov);
  };
  function cvTexto(sel) {
    var o = S.cvCfg || {};
    var linhas = sel.map(function (x) {
      var t = x.cap;
      if (o.cod) t = x.ref + ' · ' + t;
      if (o.preco) {
        var it = S.items.filter(function (i) {
            return i.ref === x.ref;
          })[0],
          pr = it ? precoAtual(x.ref, it.tipo) : 0,
          pp = S.pprice && S.pprice[x.ref];
        if (pr > 0) t += ' — ' + (o.dePor && pp && pp.ant > pr ? 'de ' + gs(pp.ant) + ' por ' + gs(pr) : gs(pr));
      }
      return t;
    });
    return 'La Fouch · Tudo em Óculos\n' + linhas.join('\n');
  }
  $('cvSend').onclick = function () {
    var m = $('cvMsg'),
      sel = catList().filter(function (o) {
        return !S.cvOff[o.k];
      });
    if (!sel.length) return;
    m.textContent = 'Preparando…';
    Promise.all(
      sel.map(function (o) {
        return dataToBlob(o.src, 'image/jpeg').then(function (b) {
          return new File(
            [b],
            (slugNome(pubNome(o.ref)) || 'modelo') + '-' + slugNome(o.cor) + '.jpg',
            { type: 'image/jpeg' }
          );
        });
      })
    )
      .then(function (files) {
        if (navigator.canShare && navigator.canShare({ files: files })) {
          return navigator.share({
            files: files,
            text: cvTexto(sel)
          }).then(
            function () {
              m.textContent = 'Enviado para o compartilhamento.';
            },
            function (e) {
              m.textContent = e && e.name === 'AbortError' ? '' : 'Não foi possível compartilhar.';
            }
          );
        }
        var one = sel[0];
        if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
          return dataToBlob(one.src, 'image/png')
            .then(function (pb) {
              return navigator.clipboard.write([new ClipboardItem({ 'image/png': pb })]);
            })
            .then(
              function () {
                m.textContent =
                  'Copiada a imagem de ' +
                  one.cap +
                  '. Cole no WhatsApp Web (Ctrl+V).' +
                  (sel.length > 1 ? ' Para as outras, selecione uma por vez.' : '');
              },
              function () {
                m.textContent = 'Não consegui copiar aqui. Use o celular ou salve as imagens.';
              }
            );
        }
        m.textContent = 'Este navegador não copia imagens. Use o celular para enviar.';
      })
      .catch(function () {
        m.textContent = 'Não consegui preparar as imagens.';
      });
  };

  /* variações C1..Cn: se o leitor achar uma maior que as existentes (ex.: C8), cria automaticamente */
  function ensureVar(v) {
    var n = parseInt(String(v || '').replace(/\D/g, ''), 10);
    if (n > (S.maxVar || 6)) {
      S.maxVar = n;
      try {
        var d0 = JSON.parse(localStorage.getItem(SK) || '{}');
        d0.maxVar = n;
        localStorage.setItem(SK, JSON.stringify(d0));
      } catch (e) {}
    }
  }
  // Botões de variação de cor.
  function varChips(cur) {
    ensureVar(cur);
    var a = [],
      m = Math.max(6, S.maxVar || 6, parseInt(String(cur || '').replace(/\D/g, ''), 10) || 0),
      k;
    for (k = 1; k <= m; k++) a.push('C' + k);
    return a;
  }
  // Variações disponíveis.
  function varList() {
    var m = S.maxVar || 6;
    S.items.forEach(function (i) {
      var n = parseInt(String(i.vr || '').replace(/\D/g, ''), 10);
      if (n > m) m = n;
    });
    S.maxVar = m;
    var a = [];
    for (var k = 1; k <= m; k++) a.push('C' + k);
    return a;
  }
  // Adiciona os botões de variação a um contêiner.
  function addVarChips(host, cur, pick) {
    varList().forEach(function (v) {
      host.appendChild(
        btn(
          'chip' + (v === cur ? ' on' : ''),
          v,
          function () {
            pick(v);
          },
          v === cur
        )
      );
    });
    host.appendChild(
      btn('chip add', '+', function () {
        S.maxVar = varList().length + 1;
        try {
          var d0 = JSON.parse(localStorage.getItem(SK) || '{}');
          d0.maxVar = S.maxVar;
          localStorage.setItem(SK, JSON.stringify(d0));
        } catch (e) {}
        pick('C' + S.maxVar);
      })
    );
  }
  // Caixa para criar novo formato/cor.
  function newBox(host, flag, withColor, ph, done) {
    if (S.nf !== flag && S.nc !== flag) {
      host.textContent = '';
      return;
    }
    if (host.firstChild) return;
    var r = mk('div', 'newrow'),
      i = mk('input', 'in');
    i.placeholder = ph;
    i.setAttribute('aria-label', ph);
    r.appendChild(i);
    var c = null;
    if (withColor) {
      c = document.createElement('input');
      c.type = 'color';
      c.value = '#8b9bb0';
      c.setAttribute('aria-label', 'Cor da amostra');
      r.appendChild(c);
    }
    var go = function () {
      var raw = i.value.trim();
      if (!raw) return;
      done(raw[0].toUpperCase() + raw.slice(1), c && c.value);
    };
    r.appendChild(btn('mini', 'Adicionar', go));
    r.appendChild(
      btn('mini', 'Cancelar', function () {
        S.nf = '';
        S.nc = '';
        render();
      })
    );
    i.onkeydown = function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        go();
      }
    };
    host.appendChild(r);
    try {
      i.focus();
    } catch (e) {}
  }
  // Salva um formato novo.
  function fmtDone(setter) {
    return function (n) {
      var ex = S.formats.filter(function (f) {
        return f.toLowerCase() === n.toLowerCase();
      })[0];
      if (!ex) S.formats.push(n);
      setter(ex || n);
      S.nf = '';
      render();
    };
  }
  // Salva uma cor nova.
  function corDone(setter) {
    return function (n, hex) {
      var ex = Object.keys(S.palette).filter(function (k) {
        return k.toLowerCase() === n.toLowerCase();
      })[0];
      if (!ex) S.palette[n] = hex || '#8b9bb0';
      setter(ex || n);
      S.nc = '';
      render();
    };
  }
  // Caixa para criar um tipo.
  function mkTipoBox(host) {
    if (!S.nt) {
      host.textContent = '';
      return;
    }
    if (host.firstChild) return;
    var r = mk('div', 'newrow'),
      n = mk('input', 'in');
    n.placeholder = 'Nome do tipo (ex.: Estojos)';
    n.setAttribute('aria-label', 'Nome do tipo');
    var h = mk('div', 'hint');
    h.style.cssText = 'flex:1 1 100%;margin:0;color:var(--bad)';
    var go = function () {
      var nm = n.value.trim().replace(/\s+/g, ' '),
        cu = 0;
      if (!nm) {
        h.textContent = 'Digite o nome do tipo.';
        return;
      }
      if (
        TIPOS.some(function (x) {
          return x.label.toLowerCase() === nm.toLowerCase();
        })
      ) {
        h.textContent = 'Já existe um tipo com esse nome.';
        return;
      }
      if (!(cu >= 0)) {
        h.textContent = 'Custo inválido. Use um número em US$ ou deixe vazio.';
        return;
      }
      var id = 'x' + Date.now().toString(36);
      nm = nm[0].toUpperCase() + nm.slice(1);
      S.tiposX.push({
        id: id,
        label: nm,
        full: nm,
        price: 0,
        repUSD: cu,
        pago: cu,
        x: true,
        simple: true
      });
      syncTipos();
      S.nt = false;
      S.todos = false;
      S.lotesView = false;
      S.tipo = id;
      S.fmtF = 'all';
      S.corF = 'all';
      S.q = '';
      S.open = '';
      S.det = false;
      S.selItem = null;
      S.msg =
        'Tipo "' +
        nm +
        '" criado. O preço você define em cada venda. Agora cadastre os itens abaixo.';
      render();
    };
    r.appendChild(n);
    r.appendChild(btn('mini', 'Criar tipo', go));
    r.appendChild(
      btn('mini', 'Cancelar', function () {
        S.nt = false;
        render();
      })
    );
    r.appendChild(h);
    n.onkeydown = function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        go();
      }
    };
    host.appendChild(r);
    try {
      n.focus();
    } catch (e) {}
  }

  // Tipo com o custo efetivo da peça.
  function tFor(it) {
    var t = tipoOf(it.tipo),
      cu = effCusto(it),
      f = faixaOf(it.ref),
      pr = f && f.precos && f.precos[it.tipo],
      o = {};
    if (cu != null) {
      o.repUSD = cu;
      o.pago = cu;
    }
    var pp0 = S.pprice && S.pprice[it.ref];
    if (pp0 && pp0.novo > 0) o.price = pp0.novo;
    else if (pr > 0) o.price = pr;
    return Object.keys(o).length ? Object.assign({}, t, o) : t;
  }
  // Lê um valor digitado conforme a moeda.
  function pm(x, m) {
    var t = String(x == null ? '' : x)
      .trim()
      .replace(/\s/g, '');
    if (m === 'pyg') t = t.replace(/\./g, '').replace(',', '.');
    else {
      if (t.indexOf(',') >= 0 && t.indexOf('.') >= 0) t = t.replace(/\./g, '');
      t = t.replace(',', '.');
    }
    return parseFloat(t);
  }
  // Converte um valor para US$.
  function convUsd(c, m) {
    return (c * ratePyg(m)) / S.fx.pyg;
  }
  // Cria o tipo se ainda não existir.
  function ensureTipo(nm) {
    nm = String(nm || '')
      .trim()
      .replace(/\s+/g, ' ');
    if (!nm) return '';
    var f = TIPOS.filter(function (x) {
      return nrm(x.label) === nrm(nm);
    })[0];
    if (f) return f.id;
    var id = 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    nm = nm[0].toUpperCase() + nm.slice(1);
    S.tiposX.push({
      id: id,
      label: nm,
      full: nm,
      price: 0,
      repUSD: 0,
      pago: 0,
      x: true,
      simple: true
    });
    syncTipos();
    return id;
  }
  // Interface para criar novo tipo.
  function newTipoUI(st, rer, pick, nav, host) {
    if (!st.nt) {
      nav.appendChild(
        btn('chip add', '+ Novo tipo', function () {
          st.nt = true;
          st.ntv = '';
          rer();
        })
      );
      return;
    }
    var r = mk('div', 'newrow'),
      n = mk('input', 'in');
    n.placeholder = 'Nome do tipo (ex.: Estojos, Flanelas)';
    n.setAttribute('aria-label', 'Nome do novo tipo');
    n.value = st.ntv || '';
    n.oninput = function () {
      st.ntv = n.value;
    };
    var go = function () {
      var nm = String(n.value).trim();
      if (!nm) return popErr('Digite o nome do tipo.');
      var id = ensureTipo(nm);
      st.nt = false;
      st.ntv = '';
      pick(id);
      rer();
    };
    n.onkeydown = function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        go();
      }
    };
    r.appendChild(n);
    r.appendChild(btn('mini', 'Criar tipo', go));
    r.appendChild(
      btn('mini', 'Cancelar', function () {
        st.nt = false;
        rer();
      })
    );
    host.appendChild(r);
    try {
      setTimeout(function () {
        n.focus();
      }, 0);
    } catch (e) {}
  }
  function quickCor(n) {
    return ['azul petroleo', 'vinho', 'bege translucido'].indexOf(nrm(n)) < 0;
  }
  // A peça passa no filtro de formato?
  function fOk(i) {
    return S.fmtF === 'all' || String(S.fmtF).split('|').indexOf(i.fmt) >= 0;
  }
  // Formatos selecionados.
  function fSel() {
    return S.fmtF === 'all' ? [] : String(S.fmtF).split('|');
  }
  // Tipos selecionados.
  function tSel() {
    return S.todos ? S.selSet || [] : S.lotesView ? [] : [S.tipo];
  }
  // Id do tipo Variados.
  function varId() {
    var t = TIPOS.filter(function (x) {
      return nrm(x.label) === 'variados';
    })[0];
    return t ? t.id : '';
  }
