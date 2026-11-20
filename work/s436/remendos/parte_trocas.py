# S436 (20/11/2026) — remendos: TROCAS INTEIRAS soltas. A função/ação tinha sido trocada inteira em outro arquivo (a velha nunca rodava):
# a versão que vale vai para o lugar da velha, no arquivo da família, e a outra sai. Uso: python3 parte_trocas.py <raiz com src/>
import re, sys, os
R = sys.argv[1]; S = os.path.join(R, 'src')
le = lambda f: open(os.path.join(S, f), encoding='utf-8').read()
def grava(f, t): open(os.path.join(S, f), 'w', encoding='utf-8').write(t)
def bloco(f, ini, fim):  # devolve (texto do bloco, corpo sem a 1ª linha e sem o fecho)
    t = le(f); assert t.count(ini) == 1, (f, ini, t.count(ini)); i = t.index(ini); j = t.index(fim, i) + len(fim); return t[i:j]
def troca(f, velho, novo): t = le(f); assert t.count(velho) == 1, (f, velho[:50]); grava(f, t.replace(velho, novo))
# função declarada × reatribuída (mkAbre, estTutorial): o corpo novo entra na declaração
for nome, fv, fn in (('mkAbre', '97-marketing.js', '98z-s374d-padrao.js'), ('estTutorial', '97-estudio.js', '98z-camera-s262.js')):
    novo = bloco(fn, "  %s = function () {\n" % nome, "\n  };\n"); velho = bloco(fv, "  function %s() {\n" % nome, "\n  }\n")
    corpo = novo[len("  %s = function () {\n" % nome):-len("  };\n")]
    troca(fv, velho, "  function %s() {\n" % nome + corpo + "  }\n"); troca(fn, novo, "")
# ação × ação (cupAbre, dPer, dPerEsc): o texto novo vai para o lugar do velho
for nome, fv, fn, args in (('cupAbre', '97-cupons.js', '98z-s374.js', ''), ('dPer', '98-dash-cabecalho.js', '98z-dashboard-s48.js', ''), ('dPerEsc', '98-dash-cabecalho.js', '98z-dashboard-s48.js', 'id')):
    cab = "  ACT.%s = function (%s) {\n" % (nome, args)
    novo = bloco(fn, cab, "\n  };\n"); velho = bloco(fv, cab, "\n  };\n")
    troca(fv, velho, novo); troca(fn, novo, "")
# famNum (uma linha cada)
troca('97y-familias-s265.js', "  ACT.famNum = function () { S.dTab = 'hoje'; setView('dash'); };\n", "  // quem abre o Dashboard com o período em \"Hoje\" cai nos blocos do dia\n  ACT.famNum = function () { S.dTab = 'hoje'; if (S.per === 'hoje') S.per = 'mes'; setView('dash'); };\n")
troca('98z-dashboard-s48.js', "  // quem abre o Dashboard com o período em \"Hoje\" cai nos blocos do dia; \"Ver todos os números\" deixou de existir\n  ACT.famNum = function () { S.dTab = 'hoje'; if (S.per === 'hoje') S.per = 'mes'; setView('dash'); };\n", "")
# stAbre: a camada do Marketing repetia o que a ação já faz ("mkt" → mkAbre)
t = le('98z-s374d-padrao.js'); m = re.search(r"  ACT\.stAbre = \(function \(f\) \{ return function \(id\) \{ if \(id === 'mkt'\) return mkAbre\(\); return f\.apply\(this, arguments\); \}; \}\)\(ACT\.stAbre\);\n", t); assert m; grava('98z-s374d-padrao.js', t.replace(m.group(0), ''))
# avMin: declarada duas vezes no mesmo arquivo (a de baixo é a que valia) → uma só, no lugar da primeira
t = le('97-push.js')
a = "  function avMin(h) {\n    var m = /^(\\d{1,2}):(\\d{2})$/.exec(h || '');\n    return m ? +m[1] * 60 + +m[2] : 0;\n  }\n"
b = "  function avMin(h) {\n    var m = /^(\\d{1,2}):(\\d{2})/.exec(h || '');\n    return m ? Math.min(1440, +m[1] * 60 + +m[2]) : 0;\n  }\n"
assert t.count(a) == 1 and t.count(b) == 1; grava('97-push.js', t.replace(b, '').replace(a, b))
print('ok')
