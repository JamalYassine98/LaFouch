# ARGUS · prova da Parte 7d (setor NUVEM): os testes das funções rodam aqui e um teste quebrado de propósito é visto; a leitura
# do resultado do emulador do Firebase fecha por padrão (sem resultado, regra fora da planta, estrago não visto, função que não
# rodou no GitHub = falha); a planta da nuvem cobre todas as coleções que as regras e as funções usam.
# Com --github, roda de verdade o emulador do Firebase no GitHub (uns 3 min) e exige: regras = planta e os 4 estragos vistos.
import os, sys, re, glob, json, shutil
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor')); sys.path.insert(0, os.path.join(A, 'setor_nuvem'))
import seguranca as porta, github
R = []
def ok(nome, cond, d=''): R.append((nome, bool(cond), d)); print(('ok    ' if cond else 'FALHA ') + nome + (' · ' + d if d else ''))
# (1) os testes das funções, aqui
aqui = porta.funcoes_aqui()
ok('os %d testes das funções rodaram aqui' % len(aqui), len(aqui) == len(glob.glob(os.path.join(porta.FUNCOES, 'teste-*.js'))) and len(aqui) >= 20)
ok('nenhum teste das funções falha aqui', not [x for x in aqui if x[1] == 'FALHA'], '; '.join(x[0] for x in aqui if x[1] == 'FALHA'))
# um teste quebrado de propósito numa CÓPIA de functions/ (a pasta de verdade não é tocada)
cp = '/tmp/argus_funcoes_estrago'; shutil.rmtree(cp, ignore_errors=True); shutil.copytree(porta.FUNCOES, cp, ignore=shutil.ignore_patterns('node_modules'))
open(os.path.join(cp, 'teste-argus-estrago.js'), 'w').write("console.log(' FALHA  estrago de propósito'); process.exit(1);\n")
velho = porta.FUNCOES; porta.FUNCOES = cp
try: q = dict((n, e) for n, e, d in porta.funcoes_aqui())
finally: porta.FUNCOES = velho
ok('estrago: teste das funções quebrado é visto', q.get('teste-argus-estrago.js') == 'FALHA')
# (2) a leitura do emulador fecha por padrão
base = {'run': 1, 'concl': 'success', 'regras': [['cupons', 'sem login', 'get', False, True, '']], 'estragos': [['x', True, '']], 'funcoes': [(n, '0') for n, _, _ in aqui]}
F, _ = porta.resumo(aqui, base); ok('resultado limpo do GitHub = sem falha', not F, '; '.join(F))
F, _ = porta.resumo(aqui, dict(base, regras=None, concl='failure')); ok('sem resultado do emulador = falha (não conferido)', F and 'não conferido' in F[0])
F, _ = porta.resumo(aqui, dict(base, regras=[['cupons', 'sem login', 'get', False, False, 'leu']])); ok('regra fora da planta = falha', F and 'cupons' in F[0])
F, _ = porta.resumo(aqui, dict(base, estragos=[['cupons abertos', False, '0']])); ok('estrago não visto (conferidor cego) = falha', F and 'cego' in F[0])
F, _ = porta.resumo(aqui, dict(base, funcoes=base['funcoes'][1:])); ok('teste de função que não rodou no GitHub = falha', F and 'não rodou' in F[0])
# (3) a planta da nuvem cobre toda coleção das regras e das funções
pl = json.load(open(os.path.join(A, 'setor_nuvem', 'planta_nuvem.json')))['colecoes']
regras = open(os.path.join(github.R, 'firestore.rules')).read()
usadas = set(re.findall(r'match /(\w+)/\{', regras)) - {'databases'}
for f in glob.glob(os.path.join(porta.FUNCOES, '*.js')):
    if not os.path.basename(f).startswith('teste-'): usadas |= set(re.findall(r"(?:collection|doc)\(['`](\w+)", open(f).read()))
falta = sorted(usadas - set(pl))
ok('a planta da nuvem cobre as %d coleções usadas (regras + funções)' % len(usadas), not falta, 'faltam: ' + ', '.join(falta))
# (4) de verdade, no GitHub (só com --github)
if '--github' in sys.argv:
    gh = porta.no_github(); F, _ = porta.resumo(aqui, gh)
    ok('GitHub: regras = planta da nuvem', gh['regras'] is not None and all(x[4] for x in gh['regras']), '%s resultados' % (len(gh['regras']) if gh['regras'] else 0))
    ok('GitHub: os 4 estragos de propósito vistos', gh['estragos'] and all(x[1] for x in gh['estragos']))
    ok('GitHub: todos os testes das funções passaram', not F, '; '.join(F)[:200])
f = [n for n, c, _ in R if not c]
print('\nParte 7d: %d/%d' % (len(R) - len(f), len(R)))
sys.exit(1 if f else 0)
