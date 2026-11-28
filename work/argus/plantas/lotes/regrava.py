# ARGUS · regravar plantas do app a partir de um commit (28/11 tarde, pedido da IDEIAS/APP): as telas que mudaram por um
# aprovado (ex.: plural "Vendido hoje · 5 vendas", consertos do Início aprovados 26/11 12:28) ganham planta nova do código que
# implementa o aprovado. Uso:  ARGUS_COMMIT=<commit> python3 plantas/lotes/regrava.py app-inicio app-dashboard-dia
import os, sys, json
A = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, os.path.join(A, 'motor'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import planta, lote2
from playwright.sync_api import sync_playwright
LUG = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lote2_lugares.json')))
with sync_playwright() as pw:
    for id_ in sys.argv[1:]:
        f = os.path.join(planta.P_APP, id_ + '.json'); velho = json.load(open(f))
        ps = lote2.passos_de(pw, LUG[velho['lugar_mapa']]['caminho'])
        pl = planta.grava(pw, id_, {'nome': velho['tela'], 'passos': ps, 'cenario': velho.get('cenario', 'normal')}, aprovacao=velho['aprovacao'])
        pl['lugar_mapa'] = velho['lugar_mapa']; pl['commit'] = os.environ.get('ARGUS_COMMIT', 'HEAD'); planta.salva(pl)
        print('regravada', id_, '·', len(pl['ligacoes']), 'ligações ·', [p.split('tocaNome(')[1].split(',')[0] for p in ps if 'tocaNome' in p], flush=True)
