  // ===== v465: busca tolerante (aprovada 08/11/2026) — o MESMO código vai no site (index.html, function btol...) =====
  // oculos = Óculos · exagonal = hexagonal · coracao = Coração · armasao = armação · 1 letra errada passa.
  // Cada palavra vale sozinha e em qualquer ordem; português e espanhol juntos; o mais parecido vem primeiro.
  var BTOL_SIN = [
    ['oculos', 'lentes', 'anteojos', 'gafas'],
    ['armacao', 'armacoes', 'armazon', 'armazones', 'montura'],
    ['solar', 'sol', 'solares'],
    ['leitura', 'lectura', 'pregraduado', 'pregrad', 'receta', 'grau'],
    ['preto', 'preta', 'negro', 'negra'],
    ['branco', 'branca', 'blanco', 'blanca'],
    ['dourado', 'dourada', 'dorado', 'dorada', 'ouro', 'oro'],
    ['prateado', 'prateada', 'plateado', 'plateada', 'prata', 'plata'],
    ['vermelho', 'vermelha', 'rojo', 'roja'],
    ['azul'],
    ['verde'],
    ['rosa', 'rosado', 'rosada'],
    ['roxo', 'roxa', 'morado', 'morada', 'lilas', 'violeta'],
    ['marrom', 'marron', 'cafe'],
    ['tartaruga', 'carey', 'havana'],
    ['transparente', 'cristal', 'translucido', 'translucida'],
    ['coracao', 'corazon'],
    ['redondo', 'redonda'],
    ['quadrado', 'quadrada', 'cuadrado', 'cuadrada'],
    ['retangular', 'rectangular'],
    ['gatinho', 'gatito', 'gato', 'cateye'],
    ['aviador', 'aviadores'],
    ['hexagonal', 'hexagono'],
    ['feminino', 'feminina', 'femenino', 'mujer', 'dama'],
    ['masculino', 'hombre', 'caballero'],
    ['unissex', 'unisex'],
    ['acetato'],
    ['metal', 'metalico', 'metalica'],
    ['polarizado', 'polarizada'],
    ['espelhado', 'espelhada', 'espejado', 'espejada']
  ];
  var BTOL_IX = (function () {
    var m = {};
    BTOL_SIN.forEach(function (g) {
      g.forEach(function (w) {
        m[btolFold(w)] = g.map(btolFold);
      });
    });
    return m;
  })();
  // minúsculo, sem acento e com os sons iguais juntos (h mudo, ç/s/ss/z, ch/x, y/i, k/qu/c, lh, nh, letra dobrada)
  function btolFold(t) {
    t = String(t == null ? '' : t)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
    t = t
      .replace(/(\d),(\d)/g, '$1.$2')
      .replace(/ç/g, 's')
      .replace(/ch|sh/g, 'x')
      .replace(/lh/g, 'li')
      .replace(/nh/g, 'ni')
      .replace(/qu([ei])/g, 'k$1')
      .replace(/c([ei])/g, 's$1')
      .replace(/ss/g, 's')
      .replace(/z/g, 's')
      .replace(/y/g, 'i')
      .replace(/w/g, 'v')
      .replace(/k/g, 'c')
      .replace(/(^|[^a-z])h/g, '$1')
      .replace(/([a-z])h/g, '$1');
    return t.replace(/([a-z])\1+/g, '$1');
  }
  // distância de edição com troca de vizinhas (Damerau), parando cedo
  function btolDist(a, b, max) {
    var la = a.length,
      lb = b.length;
    if (Math.abs(la - lb) > max) return max + 1;
    var p2 = null,
      p = [],
      i,
      j;
    for (j = 0; j <= lb; j++) p[j] = j;
    for (i = 1; i <= la; i++) {
      var c = [i],
        mn = i;
      for (j = 1; j <= lb; j++) {
        var v = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (p2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, p2[j - 2] + 1);
        c[j] = v;
        if (v < mn) mn = v;
      }
      if (mn > max) return max + 1;
      p2 = p;
      p = c;
    }
    return p[lb];
  }
  // pontos de uma palavra da busca contra as palavras do produto: 3 exata/começo · 2 contém · 1 parecida · 0 não
  function btolTok(tk, palavras, junto) {
    var alts = BTOL_IX[tk] || [tk],
      best = 0;
    alts.forEach(function (a) {
      if (best >= 3 || !a) return;
      var lim = /\d/.test(a) ? 0 : a.length >= 8 ? 2 : a.length >= 5 ? 1 : 0;
      for (var i = 0; i < palavras.length; i++) {
        var w = palavras[i];
        if (w === a || w.indexOf(a) === 0) {
          best = 3;
          return;
        }
        if (a.length >= 3 && w.indexOf(a) > 0) best = Math.max(best, 2);
        else if (lim && (btolDist(a, w, lim) <= lim || (w.length > a.length && btolDist(a, w.slice(0, a.length), lim) <= lim))) best = Math.max(best, 1);
      }
      if (best < 2 && a.length >= 3 && junto.indexOf(a) >= 0) best = Math.max(best, 2);
    });
    return best;
  }
  var BTOL_VAZIAS = { de: 1, do: 1, da: 1, dos: 1, das: 1, e: 1, com: 1, con: 1, para: 1, pra: 1, el: 1, la: 1, los: 1, las: 1, em: 1, en: 1, um: 1, uma: 1, un: 1, una: 1, o: 1, a: 1, os: 1, as: 1, i: 1 };
  // Monta a busca: devolve fn(texto) → pontos (0 = não aparece). Todas as palavras precisam aparecer.
  function btol(q) {
    var tks = btolFold(q)
      .split(/[^a-z0-9.+,]+/)
      .map(function (t) {
        return t.replace(/^[.,]+|[.,]+$/g, '');
      })
      .filter(Boolean);
    if (!tks.length) return null;
    var sv = tks.filter(function (t) {
      return !BTOL_VAZIAS[t];
    });
    if (sv.length) tks = sv;
    var f = function (txt) {
      var ft = btolFold(txt),
        pal = ft.split(/[^a-z0-9.+,]+/).filter(Boolean),
        junto = ft.replace(/[^a-z0-9]/g, ''),
        tot = 0;
      for (var i = 0; i < tks.length; i++) {
        var pt = btolTok(tks[i], pal, junto);
        if (!pt) {
          var sem = tks[i].replace(/[^a-z0-9]/g, '');
          if (sem.length >= 3 && junto.indexOf(sem) >= 0) pt = 2;
          else return 0;
        }
        tot += pt;
      }
      return tot;
    };
    f.toks = tks;
    return f;
  }
