# ARGUS · prova da Parte 5 (setor App):
#  1 modos do app: letra 1,3× aumenta o texto; PIN abre o app; com biometria a tecla da digital abre o app
#  2 selo: só com rodada completa sem falha e autoprova ok, e só para o mesmo commit
#  3 a porta (rodada indicada) com 2 plantas de TESTE marcadas como aprovadas: roda todas as etapas e decide (selo ou trava)
import os, sys, json, shutil
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor')); sys.path.insert(0, os.path.join(A, 'setor_app'))
import planta, selo, abrir, loja, modos, porta
planta.P_APP = os.path.join(A, 'plantas', 'teste'); planta.OBS = '/tmp/argus_obsoletos_teste5'; selo.D = '/tmp/argus_selos_teste5'   # as 2 plantas de TESTE do repositório (o emulador do GitHub lê as mesmas)
from playwright.sync_api import sync_playwright
R = []
def ok(nome, cond, d=''): R.append((nome, bool(cond), d)); print(('ok    ' if cond else 'FALHA ') + nome + (' · ' + d if d else ''), flush=True)
MODO = sys.argv[1] if len(sys.argv) > 1 else 'rapida'
with sync_playwright() as pw:
    b, pg = abrir.abre(pw); f0 = pg.evaluate("()=>parseFloat(getComputedStyle(document.querySelector('b')).fontSize)"); pg.evaluate(modos.LETRA, 1.3); pg.wait_for_timeout(300)
    f1 = pg.evaluate("()=>parseFloat(getComputedStyle(document.querySelector('b')).fontSize)"); b.close()
    ok('letra 1,3× aumenta o texto na mesma proporção', abs(f1 - f0 * 1.3) < 0.2, '%.1f → %.1f px' % (f0, f1))
    b, pg = abrir.abre(pw, cenario='bloqueio'); trav = pg.evaluate("()=>!document.getElementById('lockScr').hidden")
    for k in loja.PIN: pg.click('#pinKb [data-k="%s"]' % k)
    pg.wait_for_timeout(2500); ab = pg.evaluate("()=>document.getElementById('lockScr').hidden"); b.close()
    ok('com PIN: o app abre travado e o PIN destrava', trav and ab)
    b, pg = abrir.abre(pw, cenario='biometria', antes=lambda p: p.add_init_script(modos.BIO)); pg.click('#pinKb .pkBio'); pg.wait_for_timeout(1500)
    ab = pg.evaluate("()=>document.getElementById('lockScr').hidden"); b.close()
    ok('com biometria: a tecla da digital destrava', ab)
    ok('plantas de teste no repositório (2)', len([f for f in os.listdir(planta.P_APP) if f.endswith('.json')]) == 2)
# 2 selo
falso = {'falhas': 0, 'autoprova_ok': True, 'completa': True, 'resumo': 'teste'}
selo.grava('app', falso); c1 = selo.confere('app')
ok('selo: rodada completa sem falha dá selo para o commit de agora', c1[0], c1[1])
j = json.load(open(os.path.join(selo.D, 'app.json'))); j['commit'] = '0' * 40; json.dump(j, open(os.path.join(selo.D, 'app.json'), 'w'))
c2 = selo.confere('app'); ok('selo de outro commit é recusado', not c2[0], c2[1])
selo.grava('app', dict(falso, completa=False)); ok('rodada rápida não dá selo (e apaga o velho)', not selo.confere('app')[0])
selo.grava('app', dict(falso, falhas=1)); ok('rodada com falha não dá selo', not selo.confere('app')[0])
selo.grava('app', dict(falso, autoprova_ok=False)); ok('autoprova que falhou não dá selo', not selo.confere('app')[0])
# 3 porta
res = porta.roda(MODO)
ok('porta (%s): rodou todas as etapas e decidiu' % MODO, len(res['etapas']) >= 8, '%s · %s min' % (res['resumo'], res['minutos']))
ok('porta: a autoprova passou (o Argus enxerga)', res['autoprova_ok'])
json.dump(res, open('/tmp/argus_p5_porta_%s.json' % MODO, 'w'), ensure_ascii=False, indent=1)
print('\n%d de %d ok' % (sum(1 for x in R if x[1]), len(R)))
