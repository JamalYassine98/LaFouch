# ARGUS · prova da Parte 2 (o comparador):
#  1 app × a própria planta = 0 diferenças (sem alarme falso), nos dois temas · 2 autoprova: cada estrago plantado numa CÓPIA da planta
#  tem de aparecer (posição, tamanho, cor, fundo, borda, letra, texto, ícone, peça a mais, peça a menos) · 3 cascata vira UMA diferença
#  4 ruído vira "não conferido", nunca some · 5 esboço demo-iva × app de hoje = o comparador mostra o que falta implementar
import os, sys, json, copy, shutil
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import planta, compara, esboco
planta.P_APP = '/tmp/argus_plantas_teste'; planta.OBS = '/tmp/argus_obsoletos_teste'
from playwright.sync_api import sync_playwright
R = []
def ok(nome, cond, d=''): R.append((nome, bool(cond), d)); print(('ok    ' if cond else 'FALHA ') + nome + (' · ' + d if d else ''), flush=True)
REG = __import__('planta').precos('regras')
TELAS = {'precos-regras': {'nome': 'Preços › Regras', 'passos': REG, 'cenario': 'normal'},
         'fornecedores': {'nome': 'Fornecedores', 'passos': ["()=>__LF.inicioGo('lotes')"], 'cenario': 'normal'},
         'inicio': {'nome': 'Início', 'passos': [], 'cenario': 'normal'}}
with sync_playwright() as pw:
    PL = {}
    for id_, t in TELAS.items():
        pl = planta.grava(pw, 'hoje-' + id_, t, com_ligacoes=False); PL[id_] = pl
        d = compara.confere(pw, pl)
        for tema, D in d.items(): ok('app × a própria planta = igual · %s · %s' % (t['nome'], tema), not D, '; '.join('%s %s' % (x[0], x[1]) for x in D[:3]))
    # 2 autoprova
    app = PL['precos-regras']['temas']['escuro']['pecas']
    txt = [i for i, p in enumerate(app) if p['tipo'] == 'texto' and p['texto'] and not p['fixo']]
    ic = [i for i, p in enumerate(app) if p['tipo'] == 'icone']
    cx = [i for i, p in enumerate(app) if p['borda'] or p['fundo']]
    k = txt[len(txt) // 2]
    def est(nome, f, espera):
        pl = copy.deepcopy(app); f(pl); D = compara.compara(pl, app)
        ok('autoprova pega: ' + nome, any(espera in x[1] for x in D), '; '.join('%s %s' % (x[0], x[1]) for x in D[:2]) if D else 'NÃO viu')
    est('peça 2 px fora do lugar', lambda pl: pl[k]['caixa'].__setitem__(0, pl[k]['caixa'][0] + 2), 'posição')
    est('tamanho 3 px diferente', lambda pl: pl[k]['caixa'].__setitem__(2, pl[k]['caixa'][2] + 3), 'tamanho')
    est('cor do texto', lambda pl: pl[k].__setitem__('cor', 'rgb(1, 2, 3)'), 'cor')
    est('tamanho da letra', lambda pl: pl[k].__setitem__('letra', ['17px'] + pl[k]['letra'][1:]), 'letra')
    est('texto trocado', lambda pl: pl[k].__setitem__('texto', pl[k]['texto'] + ' x'), 'falta')
    est('peça que o app tem a mais', lambda pl: pl.pop(k), 'sobra')
    est('peça que o app não tem', lambda pl: pl.append(dict(copy.deepcopy(pl[k]), texto='Peça da planta', caixa=[10, 10, 50, 20])), 'falta')
    est('desenho do ícone', lambda pl: pl[ic[0]]['icone'].__setitem__('geo', pl[ic[0]]['icone']['geo'] + '|circle:cx=1'), 'desenho do ícone')
    est('traço do ícone', lambda pl: pl[ic[0]]['icone'].__setitem__('traco', '3px'), 'traço')
    est('borda/fundo de uma caixa', lambda pl: pl[cx[0]].__setitem__('borda', '2px rgb(9, 9, 9) / 2px rgb(9, 9, 9)') if pl[cx[0]]['borda'] else pl[cx[0]].__setitem__('fundo', 'rgb(9, 9, 9)'), 'borda' if app[cx[0]]['borda'] else 'fundo')
    # 3 cascata
    pl = copy.deepcopy(app); y0 = app[k]['caixa'][1]
    for p in pl:
        if p['caixa'][1] >= y0 and not p['fixo']: p['caixa'][1] -= 20
    D = compara.compara(pl, app); cas = [x for x in D if 'a partir daqui' in x[1]]
    ok('cascata: tudo que desce 20 px vira UMA diferença', len(cas) == 1 and len([x for x in D if 'posição' in x[1]]) <= 1, cas[0][0] + ' · ' + cas[0][1] if cas else str(D[:3]))
    # 4 ruído
    b2 = copy.deepcopy(app); b2[k]['texto'] = b2[k]['texto'] + ' 2'
    D = compara.compara(app, app, compara.ruido(app, b2))
    ok('ruído vira "não conferido", não some', any('não conferido' in x[1] for x in D), '; '.join(x[0] + ' ' + x[1] for x in D[:2]))
    # 5 esboço × hoje
    www = esboco.prepara('demo-iva'); porta = esboco.serve(www, 8831)
    e = planta.grava(pw, 'demo-iva', TELAS['precos-regras'], porta=porta, com_ligacoes=False)
    D = compara.compara(e['temas']['escuro']['pecas'], app)
    tem = lambda t, o: any(x[0] == '“%s”' % t and o in x[1] for x in D)
    ok('esboço × app de hoje: mostra o que falta implementar', tem('IVA', 'falta') and tem('10%', 'falta') and tem('IVA · 10%', 'sobra'), '; '.join(x[0] + ' ' + x[1] for x in D[:4]))
json.dump(R, open('/tmp/argus_p2.json', 'w'), ensure_ascii=False, indent=1)
print('\n%d de %d ok' % (sum(1 for x in R if x[1]), len(R)))
