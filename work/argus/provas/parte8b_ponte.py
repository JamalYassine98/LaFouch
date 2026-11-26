# ARGUS · prova da ponte app × site (Parte 8): o que o app manda (vitProduto + vitDocBody) aparece igual na página de cada peça
# do site — nome, preço e estoque; uma ponte quebrada de propósito (o site recebe outro preço, ou "Esgotado" com estoque) é vista.
import os, sys, copy, json
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor')); sys.path.insert(0, os.path.join(A, 'setor_site'))
import ponte, sim
R = []
def ok(nome, cond, d=''): R.append((nome, bool(cond), d)); print(('ok    ' if cond else 'FALHA ') + nome + (' · ' + d if d else ''))
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    nav = sim.navegador(pw)
    r = ponte.roda(pw, nav)
    ok('ponte: cada peça do app aparece no site com o mesmo nome, preço e estoque', r and all(x[1] == ponte.OK for x in r), '%d peças · %s' % (len(r), '; '.join('%s: %s' % (x[0], x[2]) for x in r if x[1] != ponte.OK)[:200]))
    D, docs = ponte.do_app(pw, nav); verdade = ponte.do_app
    def quebra(campo, valor):
        def f(pw, nav):
            d2 = copy.deepcopy(docs); d2[0]['fields'][campo] = ponte._fs(valor); return D, d2
        return f
    ponte.do_app = quebra('n', D[0]['n'] + 7000)
    try: r = ponte.roda(pw, nav)
    finally: ponte.do_app = verdade
    ok('estrago: o site recebe outro preço — é visto', any(x[1] == ponte.ACH and 'preço' in x[2] and D[0]['ref'] in x[0] for x in r))
    ponte.do_app = quebra('aviso', 'Esgotado')
    try: r = ponte.roda(pw, nav)
    finally: ponte.do_app = verdade
    ok('estrago: o site recebe "Esgotado" com estoque no app — é visto', any(x[1] == ponte.ACH and 'esgotado' in x[2].lower() and D[0]['ref'] in x[0] for x in r))
    nav.close()
f = [n for n, c, _ in R if not c]
print('\nPonte: %d/%d' % (len(R) - len(f), len(R)))
sys.exit(1 if f else 0)
