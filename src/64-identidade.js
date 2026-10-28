  /* ===== Identidade do modelo: nº interno, marca/material/público/coleção, nome e descrição automáticos ===== */
  var MATERIAIS = ['Metal', 'Acetato', 'Plástico', 'TR90', 'Titânio', 'Nylon'],
    PUBLICOS = ['Feminino', 'Masculino', 'Infantil', 'Unissex'],
    FORMATOS = ['Redondo', 'Quadrado', 'Retangular', 'Gatinho', 'Aviador', 'Oval', 'Hexagonal'],
    /* formato da armação → formatos de rosto que combinam (usado no site) */
    ROSTO_DE = {
      Redondo: ['quadrado', 'oval'],
      Quadrado: ['redondo', 'oval'],
      Retangular: ['redondo', 'oval'],
      Gatinho: ['oval', 'coracao'],
      Aviador: ['oval', 'quadrado', 'coracao'],
      Oval: ['redondo', 'quadrado', 'coracao'],
      Hexagonal: ['oval', 'redondo']
    };
  /* "Liberar para o site": só vale com foto em TODAS as cores do modelo (cada cor com estoque ou já cadastrada) */
  function siteCores(ref) {
    var seen = {},
      out = [];
    S.items.forEach(function (i) {
      if (i.ref !== ref || i.bulk || seen[i.cor]) return;
      seen[i.cor] = 1;
      out.push({
        cor: i.cor,
        vr: i.vr || '',
        qty: S.items.reduce(function (n, x) {
          return n + (x.ref === ref && x.cor === i.cor ? x.qty : 0);
        }, 0),
        foto: !!S.fotos[ref + '|' + i.cor]
      });
    });
    return out;
  }
  function siteCheck(ref) {
    var cs = siteCores(ref),
      falta = cs.filter(function (c) {
        return !c.foto;
      }),
      // não se publica o que não se tem: modelo sem nenhuma peça não é liberado (o que já está no ar e esgota fica 2 semanas)
      sem = estoqueDoRef(ref) <= 0;
    return { cores: cs, falta: falta, sem: sem, ok: cs.length > 0 && !falta.length && !sem };
  }
  function siteOn(ref) {
    return !!(S.site && S.site[ref]);
  }
  function siteSet(ref, on) {
    if (!S.site) S.site = {};
    if (on && !siteCheck(ref).ok) return false;
    if (on) S.site[ref] = 1;
    else delete S.site[ref];
    if (typeof vitFila === 'function') vitFila(ref, on ? 'upd' : 'del');
    saveSoon();
    return true;
  }
  function attrOf(ref) {
    return (S.attr && S.attr[ref]) || {};
  }
  function setAttr(ref, patch) {
    if (!S.attr) S.attr = {};
    var a = Object.assign({}, S.attr[ref] || {}, patch);
    Object.keys(a).forEach(function (k) {
      var v = String(a[k] == null ? '' : a[k]).trim();
      if (!v) delete a[k];
      else a[k] = v;
    });
    if (Object.keys(a).length) S.attr[ref] = a;
    else delete S.attr[ref];
  }
  /* número interno curto (1, 2, 3…), no lugar do código da haste para falar e achar o modelo */
  function numOf(ref) {
    return (S.num && S.num[ref]) || 0;
  }
  function baseNome(ref) {
    var f = S.items.filter(function (i) {
      return i.ref === ref;
    })[0];
    if (!f) return 'Armação';
    return f.tipo === 'pre' ? 'Óculos de leitura' : f.tipo === 'solar' ? 'Óculos solar' : 'Armação';
  }
  /* "Armação Gucci de metal feminino" */
  function nomeAuto(ref) {
    var a = attrOf(ref);
    if (!a.marca && !a.material && !a.publico) return '';
    return [
      baseNome(ref),
      a.marca,
      a.material ? 'de ' + a.material.toLowerCase() : '',
      a.publico ? a.publico.toLowerCase() : ''
    ]
      .filter(Boolean)
      .join(' ');
  }
  /* nome que o cliente vê: nunca o código da haste quando existe nome ou atributos */
  function pubNome(ref) {
    var n = (S.pnome && S.pnome[ref]) || nomeAuto(ref);
    if (n) return n;
    // sem nome e sem marca: o tipo (ou o material) e o número interno, ex.: "Acetato #12"
    var nm = numOf(ref),
      it0 = S.items.filter(function (i) {
        return i.ref === ref;
      })[0];
    if (!it0 || isSimple(it0.tipo)) return ref;
    return nm ? (attrOf(ref).material || baseNome(ref)) + ' #' + nm : ref;
  }
  function descAutoDe(ref, nome) {
    var seen = {},
      cs = [],
      med = '';
    S.items.forEach(function (i) {
      if (i.ref !== ref || i.bulk) return;
      if (i.med && !med) med = i.med;
      var k = i.vr || i.cor;
      if (seen[k]) return;
      seen[k] = 1;
      if (i.cor === 'Sem cor' && !i.vr) return;
      cs.push(i.vr ? i.vr + (i.cor === 'Sem cor' ? '' : ' ' + i.cor) : i.cor);
    });
    return nome + (cs.length ? '. Cores: ' + cs.join(', ') : '') + (med ? '. Medidas: ' + med : '') + '.';
  }
  function identSync() {
    if (!S.num) S.num = {};
    if (!S.pnAuto) S.pnAuto = {};
    if (!S.descAuto) S.descAuto = {};
    var seen = {};
    S.items.forEach(function (i) {
      if (!i.ref || i.bulk || seen[i.ref]) return;
      seen[i.ref] = 1;
      if (!S.num[i.ref]) S.num[i.ref] = S.numNext = (S.numNext || 0) + 1;
      // data do cadastro do modelo (conta o "chegou esta semana"); o que já existia antes disto não é novo
      if (!S.cad) S.cad = {};
      if (S.cad[i.ref] == null) S.cad[i.ref] = S.cadInit ? Date.now() : 0;
    });
    S.cadInit = true;
    /* memória do modelo (cor habitual, graus) some junto com o produto */
    Object.keys(S.memo || {}).forEach(function (r) {
      if (!seen[r]) delete S.memo[r];
    });
    if (typeof ofertaManut === 'function') ofertaManut();
    Object.keys(S.attr || {}).forEach(function (ref) {
      if (!seen[ref]) return;
      var auto = nomeAuto(ref);
      if (!auto) return;
      var cur = S.pnome && S.pnome[ref];
      if (!cur || S.pnAuto[ref] === cur) {
        if (!S.pnome) S.pnome = {};
        S.pnome[ref] = auto;
        S.pnAuto[ref] = auto;
        cur = auto;
      }
      var d = descAutoDe(ref, cur),
        dc = S.desc[ref];
      if (dc == null || dc === '' || S.descAuto[ref] === dc) {
        S.desc[ref] = d;
        S.descAuto[ref] = d;
      }
    });
  }
  function identMove(a, b) {
    ['attr', 'site', 'cad', 'memo', 'num', 'pnAuto', 'descAuto'].forEach(function (k) {
      if (S[k] && S[k][a] != null) {
        S[k][b] = S[k][a];
        delete S[k][a];
      }
    });
  }
  /* texto para a busca: nº, marca, material, público, coleção, nome */
  function identTxt(ref) {
    var a = attrOf(ref),
      n = numOf(ref);
    return [a.marca, a.material, a.publico, a.colecao, nomeAuto(ref), n ? '#' + n + ' n' + n : '']
      .filter(Boolean)
      .join(' ');
  }
  function colecoes() {
    var s = {};
    Object.keys(S.attr || {}).forEach(function (r) {
      var c = S.attr[r].colecao;
      if (c) s[c] = 1;
    });
    return Object.keys(s).sort();
  }
  function slugNome(t) {
    return String(t || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^\w-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  /* interruptor do Editar produto: libera o modelo (com todas as cores) para o catálogo online */
  // onda rosa no botão e luzinhas que sobem (curto), depois de liberar
  function siteOnda() {
    setTimeout(function () {
      var b = $('edSiteBtn');
      if (!b || (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches)) return;
      var w = b.parentNode;
      w.style.position = 'relative';
      b.classList.add('siteWave');
      var sp = mk('div', 'siteSpk', '✦ ✧ ✦ ✧ ✦');
      sp.setAttribute('aria-hidden', 'true');
      w.appendChild(sp);
      setTimeout(function () {
        b.classList.remove('siteWave');
        sp.remove();
      }, 1100);
    }, 30);
  }
  function siteSwitch(ref) {
    var w = mk('div', 'col'),
      on = siteOn(ref),
      ck = siteCheck(ref);
    w.id = 'edSite';
    w.style.gap = '6px';
    var b = btn(
      'chip' + (on ? ' on' : ''),
      on ? '✓ Liberado para o site' : 'Liberar para o site',
      function () {
        if (!on && !ck.ok) return;
        siteSet(ref, !on);
        render();
        if (!on) {
          siteFx(ref);
          siteOnda();
        }
      },
      on
    );
    b.id = 'edSiteBtn';
    b.style.cssText += ';width:100%;justify-content:center';
    if (!on && !ck.ok) {
      b.disabled = true;
      b.style.opacity = '.55';
    }
    w.appendChild(b);
    var msg = on
      ? 'Aparece no catálogo online com ' + ck.cores.length + (ck.cores.length === 1 ? ' cor' : ' cores') + '. Preço, estoque e avisos o app atualiza sozinho.'
      : !ck.cores.length
        ? 'Cadastre ao menos uma cor para liberar.'
        : ck.sem
          ? 'Sem peças em estoque: não dá para publicar o que você não tem.'
          : ck.falta.length
          ? 'Falta foto em: ' + ck.falta.map(function (c) { return c.cor; }).join(', ') + '. Toda cor liberada precisa de foto.'
          : 'Todas as cores têm foto. Toque para mostrar no catálogo online.';
    if (on && ck.falta.length) msg = 'Atenção: falta foto em ' + ck.falta.map(function (c) { return c.cor; }).join(', ') + '. Essa cor não aparece no site até ter foto.';
    var h = mk('div', 'hint', msg);
    h.style.margin = '0';
    w.appendChild(h);
    return w;
  }
  /* campos de identificação (cartão da foto e Editar produto): cur é o objeto editado */
  function identBox(host, cur, onCh) {
    host.textContent = '';
    var ch = function () {
      if (onCh) onCh();
    };
    host.appendChild(mk('div', 'lbl', 'Identificação do modelo'));
    var inp = function (key, ph, list) {
      var i = mk('input', 'in');
      i.placeholder = ph;
      i.value = cur[key] || '';
      i.setAttribute('aria-label', ph);
      if (list) sugestao(i, list);
      i.oninput = function () {
        cur[key] = i.value;
        ch();
      };
      return i;
    };
    var chips = function (key, arr) {
      var w = mk('div', 'nav');
      arr.forEach(function (v) {
        var on = (cur[key] || '').toLowerCase() === v.toLowerCase();
        w.appendChild(
          btn(
            'chip' + (on ? ' on' : ''),
            v,
            function () {
              cur[key] = on ? '' : v;
              ch();
              identBox(host, cur, onCh);
            },
            on
          )
        );
      });
      return w;
    };
    var marcas = function () {
        var ms = {};
        Object.keys(S.attr || {}).forEach(function (r) {
          if (S.attr[r].marca) ms[S.attr[r].marca] = 1;
        });
        return Object.keys(ms);
      },
      sMarca = sugLista(marcas),
      sCol = sugLista(colecoes);
    host.appendChild(inp('marca', 'Marca (ex.: Gucci, Ray-Ban, Kazwini)', sMarca));
    host.appendChild(chips('formato', FORMATOS));
    host.appendChild(chips('material', MATERIAIS));
    host.appendChild(chips('publico', PUBLICOS));
    host.appendChild(inp('colecao', 'Coleção (ex.: Clássicos, Clip-on, Solares)', sCol));
    var pv = mk('div', 'hint', '');
    pv.style.margin = '0';
    var up = function () {
      var t = cur.marca || cur.material || cur.publico ? 'Nome automático: ' : '';
      if (t) {
        var a = S.attr;
        S.attr = { __p: cur };
        var n = nomeAuto('__p');
        S.attr = a;
        t += n;
      }
      pv.textContent = t;
    };
    up();
    host.appendChild(pv);
  }
