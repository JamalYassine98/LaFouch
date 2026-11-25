# ARGUS · prova da Parte 1 (a planta):
#  1 grava a planta de 3 telas do app de hoje (escuro e claro + ligações) · 2 grava de novo e sai IGUAL (peças e ligações)
#  3 esboço numa cópia do app (demo-iva): a planta registra a proposta ("IVA" e "10%" à direita) e o app de hoje continua igual
#  4 proteção: sem aprovação = pendente; aprovação que não está na lista viva = inválida · 5 ajuste: a planta anterior vai para obsoletos
import os, sys, json, copy
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import planta, esboco
import shutil
planta.P_APP = '/tmp/argus_plantas_teste'; planta.OBS = '/tmp/argus_obsoletos_teste'   # a prova não suja as plantas de verdade
shutil.rmtree(planta.P_APP, ignore_errors=True); shutil.rmtree(planta.OBS, ignore_errors=True)
from playwright.sync_api import sync_playwright
R = []
def ok(nome, cond, d=''): R.append((nome, bool(cond), d)); print(('ok    ' if cond else 'FALHA ') + nome + (' · ' + d if d else ''), flush=True)
REG = __import__('planta').precos('regras')
TELAS = {'precos-regras': {'nome': 'Preços › Regras', 'passos': REG, 'cenario': 'normal'},
         'fornecedores': {'nome': 'Fornecedores', 'passos': ["()=>__LF.inicioGo('lotes')"], 'cenario': 'normal'},
         'inicio': {'nome': 'Início', 'passos': [], 'cenario': 'normal'}}
def sem_fotos(pl): x = copy.deepcopy(pl); return x
with sync_playwright() as pw:
    G = {}
    for id_, t in TELAS.items():
        a = planta.grava(pw, 'hoje-' + id_, t); b = planta.grava(pw, 'hoje-' + id_, t)
        G[id_] = a
        npc = {k: len(v['pecas']) for k, v in a['temas'].items()}
        ok('planta gravada · ' + t['nome'], all(npc.values()) and a['titulo'], 'peças %s · título "%s" · %d ligações' % (npc, a['titulo'], len(a['ligacoes'])))
        tira = lambda pl: {k: {kk: vv for kk, vv in v.items() if kk != '_foto'} for k, v in pl['temas'].items()}
        ok('gravada 2× sai igual · ' + t['nome'], tira(a) == tira(b) and a['ligacoes'] == b['ligacoes'],
           '' if tira(a) == tira(b) else 'peças diferentes' if a['ligacoes'] == b['ligacoes'] else 'ligações diferentes')
        planta.salva(a)
    # 3 esboço numa cópia do app
    www = esboco.prepara('demo-iva'); porta = esboco.serve(www, 8831)
    e = planta.grava(pw, 'demo-iva', TELAS['precos-regras'], porta=porta, com_ligacoes=False)
    P = e['temas']['escuro']['pecas']
    iva = [p for p in P if p['texto'] == 'IVA']; dez = [p for p in P if p['texto'] == '10%']
    ok('esboço na cópia: "IVA" vira título sozinho', bool(iva), '%d peça(s)' % len(iva))
    ok('esboço na cópia: "10%" fica à direita, na mesma linha', bool(iva and dez) and dez[0]['caixa'][0] > 300 and abs((dez[0]['caixa'][1] + dez[0]['caixa'][3] / 2) - (iva[0]['caixa'][1] + iva[0]['caixa'][3] / 2)) < 12,
       'x=%s' % (dez[0]['caixa'][0] if dez else '—'))
    h = G['precos-regras']['temas']['escuro']['pecas']
    ok('o app de hoje continua com "IVA · 10%" (o src/ real não mudou)', any(p['texto'] == 'IVA · 10%' for p in h))
    # 4 proteção
    ok('planta sem aprovação = pendente', planta.valida(G['inicio']) == 'pendente')
    x = dict(G['inicio'], aprovacao='APROVADO esboço que não existe 99zz'); ok('aprovação fora da lista viva = inválida', planta.valida(x).startswith('INVÁLIDA'))
    y = dict(G['inicio'], aprovacao='APROVADOS: **89b**'); ok('aprovação achada na lista viva = aprovada', planta.valida(y) == 'aprovada')
    # 5 ajuste: a anterior vai para obsoletos
    planta.salva(G['inicio']); obs = planta.OBS
    ok('ajuste: a planta anterior vai para obsoletos', any(n.startswith('hoje-inicio_') for n in os.listdir(obs)) and os.path.exists(planta.caminho('hoje-inicio')))
    fotos = [f for f in os.listdir(planta.P_APP) if f.startswith('hoje-inicio_') and f.endswith('.jpg')]
    ok('depois do ajuste, a planta nova tem as duas fotos no lugar', sorted(fotos) == ['hoje-inicio_claro.jpg', 'hoje-inicio_escuro.jpg'], str(fotos))
    planta.salva(e); ok('planta do esboço guardada com as fotos', all(os.path.exists(os.path.join(planta.P_APP, 'demo-iva_%s.jpg' % t)) for t in ('claro', 'escuro')))
json.dump(R, open('/tmp/argus_p1.json', 'w'), ensure_ascii=False, indent=1)
print('\n%d de %d ok' % (sum(1 for x in R if x[1]), len(R)))
