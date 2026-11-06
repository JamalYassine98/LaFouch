  // ===== Linha automática (v421, aprovado 04/11/2026): Econômica · Intermediária · Luxo — OCULTA para o cliente. =====
  // Substitui as faixas escolhidas à mão. O app classifica cada produto sozinho:
  //  - o que mais pesa: o custo real comparado com os produtos do MESMO tipo (um solar barato não compete com uma armação cara);
  //  - também conta: marca de luxo, material e se os clientes compram pelo preço cheio;
  //  - aprende com o dono: as faixas que ele já tinha escolhido (S.pfaixa) e as correções do Editar produto (S.linhaFix).
  // Pré-graduados: só duas linhas (Econômica e Luxo), preço fixo.
  // As linhas usam as 3 faixas que já existem (1ª = econômica, 2ª = intermediária, última = luxo), então piso e margens continuam valendo.
  S.linhaFix = {}; // código do produto -> id da faixa (correção do dono no Editar produto)
  var LINHA_NOMES = ['Econômica', 'Intermediária', 'Luxo'];
  var LINHA_MARCAS = /ray[\s-]?ban|gucci|armani|prada|dior|chanel|versace|oakley|tom\s?ford|carrera|dolce|d\s?&\s?g|burberry|fendi|miu\s?miu|cartier|montblanc|bvlgari|bulgari|celine|saint\s?laurent|ysl|balenciaga|givenchy|police|persol|swarovski|tiffany|lacoste|hugo\s?boss|boss|michael\s?kors|coach|guess|calvin\s?klein|vogue/i;
  // Índice da linha (0, 1, 2) -> faixa existente.
  function linhaFaixa(ix) {
    var F = S.faixas || [];
    if (!F.length) return null;
    if (ix <= 0) return F[0];
    if (ix >= 2) return F[F.length - 1];
    return F[Math.min(1, F.length - 1)];
  }
  function linhaIx(f) {
    var F = S.faixas || [],
      i = F.indexOf(f);
    if (i < 0) return -1;
    if (i === 0) return 0;
    if (i === F.length - 1) return 2;
    return 1;
  }
  function linhaNome(ix, tipo) {
    if (tipo === 'pre') return ix >= 1 ? 'Luxo' : 'Econômica';
    return LINHA_NOMES[Math.max(0, Math.min(2, ix))];
  }
  // Custo médio (US$) de cada produto, por tipo. Cache curto: é usado em listas grandes.
  function linhaBase() {
    // chave do cache: refeita no máximo a cada 300 ms (listas grandes chamam isto muitas vezes por desenho)
    var agora = Date.now();
    if (!S._linK || agora - S._linK.t > 300)
      S._linK = {
        t: agora,
        k: S.items.length + '|' + (S.sales || []).length + '|' + JSON.stringify(S.linhaFix || {}) + '|' + JSON.stringify(S.pfaixa || {}) + '|' + (S.faixas || []).map(function (f) { return f.id; }).join(',') + '|' + Math.floor(agora / 5000)
      };
    var k = S._linK.k;
    if (S._linC && S._linC.k === k) return S._linC;
    var porRef = {};
    S.items.forEach(function (i) {
      if (i.bulk || isSimple(i.tipo)) return;
      var c = baseCusto(i);
      if (!(c > 0)) return;
      var key = i.tipo + '|' + i.ref,
        o = porRef[key] || (porRef[key] = { tipo: i.tipo, ref: i.ref, s: 0, n: 0 });
      o.s += c;
      o.n++;
    });
    var porTipo = {};
    Object.keys(porRef).forEach(function (key) {
      var o = porRef[key];
      o.c = o.s / o.n;
      (porTipo[o.tipo] = porTipo[o.tipo] || []).push(o.c);
    });
    Object.keys(porTipo).forEach(function (t) {
      porTipo[t].sort(function (a, b) {
        return a - b;
      });
    });
    S._linC = { k: k, porRef: porRef, porTipo: porTipo, lim: {}, memo: {}, notas: {} };
    // limites por tipo, aprendidos com as escolhas do dono
    Object.keys(porTipo).forEach(function (t) {
      S._linC.lim[t] = linhaLimites(t);
    });
    return S._linC;
  }
  // Nota de 0 a 1: posição do custo dentro do tipo + marca + material + venda pelo preço cheio.
  function linhaNota(ref, tipo, B) {
    B = B || linhaBase();
    var o = B.porRef[tipo + '|' + ref];
    if (!o) return null;
    if (B.notas[tipo + '|' + ref]) return B.notas[tipo + '|' + ref];
    var l = B.porTipo[tipo] || [],
      abaixo = 0,
      iguais = 0;
    for (var i = 0; i < l.length; i++) {
      if (l[i] < o.c - 1e-9) abaixo++;
      else if (Math.abs(l[i] - o.c) <= 1e-9) iguais++;
    }
    // empates ficam no meio do grupo empatado
    var pos = l.length > 1 ? (abaixo + Math.max(0, iguais - 1) / 2) / (l.length - 1) : 0.5,
      at = (typeof attrOf === 'function' && attrOf(ref)) || {},
      txt = [at.marca || '', (S.pnome && S.pnome[ref]) || '', ref].join(' '),
      mat = String(at.material || ''),
      n = pos,
      mot = [];
    mot.push(pos >= 0.8 ? 'custo entre os 20% mais caros' : pos <= 0.3 ? 'custo entre os mais baratos' : 'custo no meio do tipo');
    var mc = txt.match(LINHA_MARCAS);
    if (mc) {
      n += 0.25;
      mot.push('marca ' + mc[0].replace(/\b\w/g, function (c) { return c.toUpperCase(); }));
    }
    if (/tit[aâ]nio/i.test(mat)) {
      n += 0.1;
      mot.push('titânio');
    } else if (/acetato/i.test(mat)) n += 0.04;
    else if (/pl[aá]stico|tr90|nylon/i.test(mat)) n -= 0.04;
    // clientes pagam o preço cheio (90 dias)? sobe um pouco; só levam com oferta? desce um pouco
    var cheio = 0,
      tot = 0,
      lim = Date.now() - 90 * DAY;
    (S.sales || []).forEach(function (s) {
      if (s.estorno || s.ref !== ref || s.ts < lim) return;
      tot++;
      if (!s.abaixo && !s.desc) cheio++;
    });
    if (tot >= 3) {
      var r = cheio / tot;
      if (r >= 0.8) {
        n += 0.05;
        mot.push('clientes pagam o preço cheio');
      } else if (r <= 0.3) {
        n -= 0.05;
        mot.push('vende mais com desconto');
      }
    }
    return (B.notas[tipo + '|' + ref] = { n: Math.max(0, Math.min(1.3, n)), mot: mot, pos: pos });
  }
  // Limites de nota por tipo: padrão 0,40 / 0,75 (pré-graduado: um só, 0,60). As escolhas do dono puxam os limites.
  function linhaLimites(tipo) {
    var pre = tipo === 'pre',
      L = pre ? [0.6, 0.6] : [0.4, 0.75],
      B = S._linC,
      exemplos = [];
    var add = function (ref, fid, peso) {
      var f = (S.faixas || []).filter(function (x) {
        return x.id === fid;
      })[0];
      if (!f) return;
      var o = B.porRef[tipo + '|' + ref];
      if (!o) return;
      var nt = linhaNota(ref, tipo, B);
      if (!nt) return;
      var ix = linhaIx(f);
      if (pre) ix = ix >= 1 ? 2 : 0;
      exemplos.push({ n: nt.n, ix: ix, peso: peso });
    };
    Object.keys(S.pfaixa || {}).forEach(function (ref) {
      add(ref, S.pfaixa[ref], 1);
    });
    Object.keys(S.linhaFix || {}).forEach(function (ref) {
      add(ref, S.linhaFix[ref], 3);
    });
    if (!exemplos.length) return L;
    // para cada limite, escolhe o valor que mais acerta os exemplos (com peso), perto do padrão
    var melhor = function (padrao, abaixoIx) {
      var cands = [padrao];
      exemplos.forEach(function (e) {
        cands.push(e.n - 0.001, e.n + 0.001);
      });
      var best = padrao,
        bestErr = Infinity;
      cands.forEach(function (c) {
        if (c < 0.05 || c > 1.2) return;
        var err = Math.abs(c - padrao) * 0.5;
        exemplos.forEach(function (e) {
          var emb = e.ix <= abaixoIx; // deveria ficar abaixo do limite
          if (emb && e.n >= c) err += e.peso;
          if (!emb && e.n < c) err += e.peso;
        });
        if (err < bestErr) {
          bestErr = err;
          best = c;
        }
      });
      return best;
    };
    if (pre) {
      var v = melhor(L[0], 0);
      return [v, v];
    }
    var a = melhor(L[0], 0),
      b = Math.max(a + 0.05, melhor(L[1], 1));
    return [a, b];
  }
  // Linha automática de um produto: { ix, f, nome, mot, fix }
  function linhaDe(ref, tipo) {
    if (!tipo) {
      var it0 = S.items.filter(function (i) {
        return i.ref === ref && !i.bulk;
      })[0];
      if (!it0) {
        // código sem peça no estoque: vale a correção ou a faixa escolhida antes
        var fz = (S.linhaFix && S.linhaFix[ref]) || (S.pfaixa && S.pfaixa[ref]),
          ffz =
            fz &&
            (S.faixas || []).filter(function (x) {
              return x.id === fz;
            })[0];
        if (!ffz) return null;
        var ixz = linhaIx(ffz);
        return { ix: ixz, f: ffz, nome: linhaNome(ixz), mot: [], fix: !!(S.linhaFix && S.linhaFix[ref]) };
      }
      tipo = it0.tipo;
    }
    if (isSimple(tipo)) return null;
    var fx = S.linhaFix && S.linhaFix[ref],
      ff =
        fx &&
        (S.faixas || []).filter(function (x) {
          return x.id === fx;
        })[0];
    if (ff) {
      var ixf = linhaIx(ff);
      if (tipo === 'pre') ixf = ixf >= 1 ? 2 : 0;
      return { ix: ixf, f: linhaFaixa(ixf), nome: linhaNome(ixf, tipo), mot: ['corrigida por você'], fix: true };
    }
    var B = linhaBase(),
      mk0 = tipo + '|' + ref;
    if (B.memo[mk0] !== undefined) return B.memo[mk0];
    var nt = linhaNota(ref, tipo, B);
    if (!nt) {
      // sem custo ainda (não entra nos cálculos): vale a faixa que o dono tinha escolhido antes, se houver
      var fo = S.pfaixa && S.pfaixa[ref],
        fof =
          fo &&
          (S.faixas || []).filter(function (x) {
            return x.id === fo;
          })[0];
      if (!fof) return (B.memo[mk0] = null);
      var ixo = linhaIx(fof);
      if (tipo === 'pre') ixo = ixo >= 1 ? 2 : 0;
      return (B.memo[mk0] = { ix: ixo, f: linhaFaixa(ixo), nome: linhaNome(ixo, tipo), mot: ['sem custo: vale a faixa de antes'], fix: false });
    }
    var L = B.lim[tipo] || (tipo === 'pre' ? [0.6, 0.6] : [0.4, 0.75]),
      ix = tipo === 'pre' ? (nt.n >= L[0] ? 2 : 0) : nt.n >= L[1] ? 2 : nt.n >= L[0] ? 1 : 0;
    return (B.memo[mk0] = { ix: ix, f: linhaFaixa(ix), nome: linhaNome(ix, tipo), mot: nt.mot, fix: false });
  }

  // ---------- atendimento: o catálogo se arruma sozinho pelo que o cliente pediu para ver ----------
  // Sem nenhum sinal na tela. Vale até finalizar a venda ou 5 minutos sem mexer no app.
  var ATD = { vistos: [], t: 0 };
  function atdAtivo() {
    if (!ATD.vistos.length) return false;
    if (Date.now() - ATD.t > 5 * 60000) {
      ATD.vistos = [];
      return false;
    }
    return true;
  }
  function atdViu(key) {
    var p = String(key || '').split('|'),
      tipo = p[0],
      ref = p.slice(1).join('|'),
      ln = linhaDe(ref, tipo);
    if (!ln) return;
    var it = S.items.filter(function (i) {
        return i.ref === ref && i.tipo === tipo;
      })[0],
      at = (typeof attrOf === 'function' && attrOf(ref)) || {};
    if (ATD.vistos.length && ATD.vistos[ATD.vistos.length - 1].ref === ref) {
      ATD.t = Date.now();
      return;
    }
    ATD.vistos.push({ ref: ref, tipo: tipo, ix: ln.ix, fmt: at.formato || (it && it.fmt) || '', preco: it ? precoTab(it) : 0, ts: Date.now() });
    if (ATD.vistos.length > 6) ATD.vistos.shift();
    ATD.t = Date.now();
  }
  function atdFim() {
    ATD.vistos = [];
    ATD.t = 0;
    S._vSeenMax = 0;
  }
  // Linha que o cliente procura agora (a das últimas peças vistas).
  function atdLinha() {
    if (!atdAtivo()) return -1;
    var v = ATD.vistos,
      u = v[v.length - 1];
    return u.ix;
  }
  // Peso de ordem de um produto no atendimento (menor = vem antes). -1 quando não há atendimento.
  function atdPeso(ref, tipo) {
    var alvo = atdLinha();
    if (alvo < 0) return 0;
    var ln = linhaDe(ref, tipo);
    if (!ln) return 3;
    var d = Math.abs(ln.ix - alvo),
      at = (typeof attrOf === 'function' && attrOf(ref)) || {},
      est = atdEstilo(),
      mesmoEstilo = est && (at.formato || '') === est ? -0.3 : 0;
    // achou caro (desceu de linha): o que estiver na faixa de preço que ele recusou vai para o fim
    if (atdDesceu()) {
      var it = S.items.filter(function (i) {
          return i.ref === ref && i.tipo === tipo;
        })[0],
        p = it ? precoTab(it) : 0,
        recusou = Math.min.apply(
          null,
          ATD.vistos.slice(0, -1).map(function (x) {
            return x.preco || Infinity;
          })
        );
      if (recusou < Infinity && p >= recusou * 0.95) d += 2;
    }
    return d + mesmoEstilo;
  }
  // "Parecidas" na vitrine: mesma linha e formato parecido (até 6), com estoque.
  function parecidas(ref, tipo, max) {
    var ln = linhaDe(ref, tipo),
      at = (typeof attrOf === 'function' && attrOf(ref)) || {},
      fmt = at.formato || '',
      mat = at.material || '',
      vistos = {},
      out = [];
    if (!ln) return out;
    S.items.forEach(function (i) {
      if (i.bulk || i.ref === ref || vistos[i.tipo + '|' + i.ref] || !(i.qty > 0) || gLivre(i) <= 0) return;
      if (isSimple(i.tipo)) return;
      vistos[i.tipo + '|' + i.ref] = 1;
      var l2 = linhaDe(i.ref, i.tipo);
      if (!l2) return;
      var a2 = attrOf(i.ref) || {},
        p = Math.abs(l2.ix - ln.ix) * 2 + (i.tipo === tipo ? 0 : 1.5) + (fmt && a2.formato === fmt ? 0 : 1) + (mat && a2.material === mat ? 0 : 0.4);
      if (Math.abs(l2.ix - ln.ix) > 1) return;
      out.push({ k: i.tipo + '|' + i.ref, it: i, p: p });
    });
    out.sort(function (a, b) {
      return a.p - b.p;
    });
    max = max || 6;
    // sempre 1 ou 2 do mesmo estilo e mais em conta (para quando o cliente achar caro)
    var base = S.items.filter(function (i) {
        return i.ref === ref && i.tipo === tipo;
      })[0],
      pb = base ? precoTab(base) : 0,
      baratas = pb
        ? out.filter(function (o) {
            return precoTab(o.it) < pb * 0.85;
          }).slice(0, 2)
        : [],
      res = out.filter(function (o) {
        return baratas.indexOf(o) < 0;
      }).slice(0, max - baratas.length);
    return res.concat(baratas);
  }

  // O cliente olhou peças mais caras e depois abriu uma mais barata: achou caro.
  function atdDesceu() {
    var v = ATD.vistos;
    if (v.length < 2) return false;
    var u = v[v.length - 1],
      ant = v.slice(0, -1),
      maxP = Math.max.apply(
        null,
        ant.map(function (x) {
          return x.preco || 0;
        })
      ),
      maxIx = Math.max.apply(
        null,
        ant.map(function (x) {
          return x.ix;
        })
      );
    return u.ix < maxIx || (maxP > 0 && u.preco < maxP * 0.85);
  }
  // Estilo procurado: quando desceu, vale o formato das peças caras que ele olhou antes (o mesmo, mais barato).
  function atdEstilo() {
    var v = ATD.vistos;
    if (!v.length) return '';
    if (!atdDesceu()) return v[v.length - 1].fmt || '';
    var c = {};
    v.slice(0, -1).forEach(function (x) {
      if (x.fmt) c[x.fmt] = (c[x.fmt] || 0) + 1;
    });
    var k = Object.keys(c).sort(function (a, b) {
      return c[b] - c[a];
    })[0];
    return k || v[v.length - 1].fmt || '';
  }
