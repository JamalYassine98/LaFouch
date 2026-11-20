# S436 (20/11/2026) — remendos PARTE 2b: iniLista (6 camadas de migração dos grupos) e grpAbre (2 camadas) viram UMA função cada.
# Desenho e conferência da ordem: work/s436/remendos/parte2b_notas.md. Uso: python3 parte2b_grupos.py <raiz com src/>
import re, sys, os
R = sys.argv[1]; S = os.path.join(R, 'src')
le = lambda f: open(os.path.join(S, f), encoding='utf-8').read()
def grava(f, t): open(os.path.join(S, f), 'w', encoding='utf-8').write(t)
def tira(f, ini, fim, n=1):
    t = le(f); i = t.index(ini); j = t.index(fim, i) + len(fim); assert t.count(ini) == n, (f, ini); grava(f, t[:i] + t[j:]); return t[i:j]
# 1) os 6 embrulhos do iniLista e os 2 do grpAbre saem (o bloco de cada um é copiado abaixo, na ordem em que rodavam)
tira('98z-s374.js', "  var _iniLista374 = iniLista;\n", "    return _iniLista374.apply(this, arguments);\n  };\n")
tira('98z-s374.js', "  var _iniLista374b = iniLista;\n", "    return l;\n  };\n")
tira('98z-s374.js', "  var _iniLista59 = iniLista;\n", "    return _iniLista59.apply(this, arguments);\n  };\n")
tira('98z-s374.js', "  // Marketing e Temática abrem em janela: o botão da família abre a lista para escolher\n  var _grpAbre59 = grpAbre;\n", "    return _grpAbre59.apply(this, arguments);\n  };\n")
tira('98z-s374.js', "  var _iniLista74 = iniLista;\n", "    return _iniLista74.apply(this, arguments);\n  };\n")
tira('98z-s374.js', "  var _iniLista374c = iniLista;\n", "    return l;\n  };\n")
b95 = tira('98z-s374c-site.js', "  var _iniLista95 = iniLista;\n", "    return l;\n  };\n")
tira('98z-s374d-padrao.js', "  var _grpAbre98 = grpAbre;\n", "    return _grpAbre98.apply(this, arguments);\n  };\n")
# o miolo do passo fam95 (grupos Site e Marketing) é levado como está
m = re.search(r"      S\.fam95 = true;\n(.*?)      saveSoon\(\);\n      l = _iniLista95\.apply\(this, arguments\);\n", b95, re.S); assert m; miolo95 = m.group(1)
# 2) iniLista: a função de sempre vira iniListaBase e a nova põe as migrações em ordem, num lugar só
t = le('89-inicio.js'); a = "  function iniLista() {\n"; assert t.count(a) == 1
i = t.index(a); j = t.index("\n  }\n", i) + 5
t = t[:i] + "  // Lista do Início e da barra + as migrações antigas (até a união de 2025). As migrações das famílias ficam em iniLista, logo abaixo.\n  function iniListaBase() {\n" + t[i + len(a):j] + """  // Lista do Início e da barra. As migrações das famílias rodam aqui, UMA vez cada (marca S.famNN), na ordem em que foram criadas —
  // nenhum arquivo embrulha esta função. Depois de cada migração que mexe nos grupos a lista é refeita.
  function iniLista() {
    if (!S.rat66) {
      S.rat66 = true;
      S.rateio = 'custo';
    }
    // 63: a família Peças fica só com Inventário e Estúdio
    if (!S.fam63) {
      S.fam63 = true;
      var gp = grpGet('g:pecas');
      if (gp) {
        gp.itens = gp.itens.filter(function (x) { return ['lotes', 'repo', 'cont'].indexOf(x) < 0; });
        gp.frase = 'Inventário e estúdio';
      }
    }
    var l = iniListaBase();
    // as 7 famílias: as entradas únicas antigas rodam de novo e podem devolver atalhos soltos — saem os que já estão numa família
    if (!S.fam7) {
      fam7Aplica();
      iniListaBase();
      var den = [];
      (S.grupos || []).forEach(function (g) { den = den.concat(g.itens); });
      S.inicioT = S.inicioT.filter(function (x) { return den.indexOf(x) < 0; });
      l = iniListaBase();
    }
    // a família Site ganha a tela Resumo na frente
    if (!S.fam7b) {
      S.fam7b = true;
      var gs = grpGet('g:site');
      if (gs && gs.itens.indexOf('site') < 0) gs.itens.unshift('site');
    }
    if (!S.fam6 && S.fam7) {
      fam6Aplica();
      l = iniListaBase();
    }
    // Cartões entra no Marketing
    if (!S.fam80) {
      var gm = grpGet('g:mkt');
      if (gm) {
        S.fam80 = true;
        if (gm.itens.indexOf('cup') < 0) gm.itens.push('cup');
        gm.frase = 'Posts, vídeos, temática e cartões';
      }
    }
    // Analisador sai do Site e entra no Marketing; Vitrine e Modelos entram no Site
    if (!S.fam95 && S.fam6) {
      S.fam95 = true;
""" + miolo95 + """      saveSoon();
      l = iniListaBase();
    }
    return l;
  }
""" + t[j:]
grava('89-inicio.js', t)
# 3) grpAbre: uma função (a camada de dentro, que abria a lista do Marketing, nunca rodava: a de fora ganhava)
t = le('95-barra-grupos.js'); a = "  function grpAbre(g) {\n    var t = g.ult && g.itens.indexOf(g.ult) >= 0 ? g.ult : g.itens[0];\n    inicioGo(t);\n  }\n"; assert t.count(a) == 1
grava('95-barra-grupos.js', t.replace(a, "  // Abre o grupo na última tela usada dele (ou na primeira). Marketing (família) lembra qual grupo está aberto.\n  function grpAbre(g) {\n    if (g && g.id === 'g:mkt' && g.fam) S._gAt = g.id;\n    return inicioGo(g.ult && g.itens.indexOf(g.ult) >= 0 ? g.ult : g.itens[0]);\n  }\n"))
for f, l in (('98z-s374.js', "  // a família Site já existente ganha a tela Site na frente (uma vez)\n"), ('98z-s374.js', "  // 66: as contas são divididas sempre pelo custo (uma vez, para quem tinha \"Igual por peça\")\n"), ('98z-s374.js', "  // a família Marketing ganha a tela Cartões (uma vez)\n"), ('98z-s374c-site.js', "  // famílias (uma vez): Analisador sai do Site e entra no Marketing; Vitrine e Modelos entram no Site\n")):
    t = le(f); assert t.count(l) == 1; grava(f, t.replace(l, ''))
t = le('89-inicio.js'); a = "    if (!S.rat66) {\n      S.rat66 = true;"; grava('89-inicio.js', t.replace(a, "    // 66: as contas são divididas sempre pelo custo (para quem tinha \"Igual por peça\")\n" + a, 1))
sobra = [f for f in os.listdir(S) if f.endswith('.js') and re.search(r'^\s*(iniLista|grpAbre) = function', le(f), re.M)]
print('ok: 8 embrulhos fora; sobra troca de iniLista/grpAbre em:', sobra or 'nenhum arquivo')
