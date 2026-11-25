# ARGUS · prova das ferramentas novas (dono 24/11 21:24–21:26): um lugar só (motor/js), gestos, estados, contraste, dados antigos na
# versão nova, onde a diferença nasceu, modo que não rodou = não conferido. (O tempo no Android roda na porta completa, no emulador.)
import os, sys, json, re, glob
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R0 = os.path.dirname(os.path.dirname(A))
sys.path.insert(0, os.path.join(A, 'motor')); sys.path.insert(0, os.path.join(A, 'setor_app'))
import abrir, planta, toques, familia, migracao, origem, esboco, sim, modos, porta, autoprova
planta.P_APP = '/tmp/argus_plantas_teste6'; planta.OBS = '/tmp/argus_obsoletos_teste6'
from playwright.sync_api import sync_playwright
R = []
def ok(nome, cond, d=''): R.append((nome, bool(cond), d)); print(('ok    ' if cond else 'FALHA ') + nome + (' · ' + d if d else ''), flush=True)
# 1 um lugar só: nenhum código de página repetido fora de motor/js e setor_app/js
py = glob.glob(os.path.join(A, 'motor', '*.py')) + glob.glob(os.path.join(A, 'setor_app', '*.py')) + glob.glob(os.path.join(A, 'setor_app', 'no_emulador', '*.py'))
rep = [os.path.basename(f) for f in py if re.search(r"getBoundingClientRect\(\);if\(r\.width<|const vis=e=>|querySelectorAll\('button,a\[href\],\[data-act\]", open(f).read())]
ok('um lugar só: nenhum arquivo Python repete o código de página (visível, tocáveis)', not rep, ', '.join(rep))
dup = [n for n in ('PERIGO_NOME', 'PERIGO =') if any(n in open(f).read() for f in py if not f.endswith('perigo.py'))]
ok('um lugar só: a lista de botões de perigo existe só em motor/perigo.py', not dup, ', '.join(dup))
REG = __import__('planta').precos('regras')
with sync_playwright() as pw:
    nav = sim.navegador(pw)
    # 2 gestos (real + estrago)
    P = toques.gestos(pw, nav, {'nome': 'Regras', 'passos': REG, 'cenario': 'normal'}, None, [])
    ok('gestos rodaram em Preços › Regras (rolar com o dedo, barra no lugar, nada de lado)', True, '; '.join('%s %s' % p for p in P) or 'sem achados')
    P2 = toques.gestos(pw, nav, {'nome': 'Regras', 'passos': REG + [autoprova.LARGA], 'cenario': 'normal'}, None, [])
    ok('gestos: estrago "tela larga demais" é visto', any('rola de lado' in p[1] for p in P2))
    # 3 estados: o aparelho recusa guardar → o aviso aparece e entra no medidor
    b, pg = abrir.abre(pw, navegador=nav, scripts=(modos.ERRO_SALVAR,)); pg.evaluate("()=>{try{__LF.salvarAgora()}catch(e){}}"); pg.wait_for_timeout(1500)
    d = pg.evaluate(familia.COLETA); b.close()
    ok('estado "erro ao salvar": o app avisa e o medidor enxerga o aviso', bool(d['estados']), '; '.join(e['t'][:50] for e in d['estados'][:2]))
    d2 = json.loads(json.dumps(d)); d2['estados'] = [dict(e, fs='20px') for e in d2['estados']]
    ok('estados: o mesmo aviso com jeito diferente em outra tela é acusado', any(x[0].startswith('família: estado') for x in familia.familia_inteira({'A': d, 'B': d2})))
    # 4 contraste
    ok('contraste: branco no preto 21:1 · cinza claro no branco reprovado', round(familia.contraste('rgb(255, 255, 255)', 'rgb(0, 0, 0)')) == 21 and familia.contraste('rgb(200, 200, 200)', 'rgb(255, 255, 255)') < 4.5)
    b, pg = abrir.abre(pw, navegador=nav)
    for j in REG: pg.evaluate(j); pg.wait_for_timeout(1000)
    a = [x for x in familia.mede_tela('Regras', pg.evaluate(familia.COLETA)) if x[0].startswith('texto pouco legível')]; b.close()
    ok('contraste medido no app real (Preços › Regras)', True, '%d texto(s) abaixo do mínimo' % len(a) + (': ' + '; '.join('%s %s' % (x[2][:25], x[3]) for x in a[:3]) if a else ''))
    # 5 dados antigos na versão nova
    D, velha = migracao.confere(pw)
    ok('dados guardados pela versão publicada (%s) abrem iguais na versão nova' % velha[:9], not D, '; '.join('%s: %s → %s' % x for x in D))
    D2, _ = migracao.confere(pw, velha=autoprova.VERSAO_ANTIGA)
    ok('…e também os guardados pela v641', not D2, '; '.join('%s: %s → %s' % x for x in D2))
    # 6 onde a diferença nasceu: planta gravada na v641 × versões até hoje
    # planta de Preços gravada na v634; a v635 (591d7b2e8) refez Preços (escritório do Titan, 54) — o Argus tem de apontar essa versão
    V634 = 'b651fbd9c'; www = esboco.prepara('_planta_v634', base=V634); pv = esboco.serve(www, 8836)
    pl = planta.grava(pw, 'v634-precos', {'nome': 'Preços', 'passos': ["()=>__LF.inicioGo('prec')"], 'cenario': 'normal'}, porta=pv, com_ligacoes=False)
    v, ant = origem.nasceu(pw, pl, desde=V634)
    ok('onde nasceu: aponta a versão que refez Preços (v635, 591d7b2e8)', bool(v) and v.startswith('591d7b2e'), 'nasceu em %s · antes: %s' % (v, ant))
    nav.close()
# 7 modo que não rodou = não conferido
q = porta.modos_quer(True); r = set(q); r.discard('biometria'); r.discard(('PC 1440', 'claro', 1.3))
ok('modo da lista que não rodou aparece como "não conferido"', porta.modos_faltando(q, r) == sorted(["('PC 1440', 'claro', 1.3)", 'biometria']), str(porta.modos_faltando(q, r)))
json.dump(R, open('/tmp/argus_p6.json', 'w'), ensure_ascii=False, indent=1)
print('\n%d de %d ok' % (sum(1 for x in R if x[1]), len(R)))
