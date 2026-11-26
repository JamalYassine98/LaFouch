# ARGUS · prova da Parte 8 (relatório e resultado no status): cada diferença do comparador traz ONDE está; a foto do relatório
# marca as diferenças com quadro e número (hoje × planta); o vídeo do toque sai em MP4 com o dedo de verdade; o resultado da
# porta vira a linha da Fila do status (sem rodar o comando aqui: a prova não mexe no status de verdade).
import os, sys, json, copy, subprocess
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import planta, compara, relatorio, anota
from PIL import Image
R = []
def ok(nome, cond, d=''): R.append((nome, bool(cond), d)); print(('ok    ' if cond else 'FALHA ') + nome + (' · ' + d if d else ''))
pl = json.load(open(os.path.join(planta.P_APP, 'app-caixa.json')))
# (1) o comparador diz onde: um texto deslocado e um que falta
est = copy.deepcopy(pl); P = est['temas']['escuro']['pecas']
txt = [i for i, p in enumerate(P) if p['tipo'] == 'texto' and p['texto'].strip()]
P[txt[2]] = dict(P[txt[2]], caixa=[P[txt[2]]['caixa'][0] + 20] + P[txt[2]]['caixa'][1:])
P.append(dict(P[txt[3]], texto='Argus · peça que só a planta tem', caixa=[16, 300, 200, 20]))
D = compara.compara(P, pl['temas']['escuro']['pecas'])
ok('cada diferença traz onde está (caixa)', D and all(len(x) == 5 and x[4] and len(x[4]) == 4 for x in D), '%d diferenças' % len(D))
# (2) a foto marcada
pasta = '/tmp/argus_relatorio_prova'
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    import sim; nav = sim.navegador(pw)
    f, D2 = relatorio.tela(pw, est, 'escuro', pasta, navegador=nav)
    ok('foto do relatório gerada com as diferenças', f and os.path.exists(f) and len(D2) >= 2, f or '')
    if f:
        im = Image.open(f).convert('RGB'); px = im.load()
        verm = sum(1 for x in range(0, im.width, 3) for y in range(0, im.height, 3) if px[x, y][0] > 200 and px[x, y][1] < 70 and px[x, y][2] < 90)
        ok('as diferenças aparecem marcadas (quadros vermelhos na foto)', verm > 50, '%d pontos vermelhos' % verm)
    f0, D0 = relatorio.tela(pw, pl, 'escuro', pasta, navegador=nav)
    ok('tela igual à planta: sem foto de relatório', f0 is None and not D0, '%d diferenças' % len(D0))
    # (3) o vídeo do toque
    L = [{'nome': 'Ver conta', 'i': 3}, {'nome': 'Luz', 'i': 4}, {'nome': 'Ver conta', 'i': 7}]
    ok('o botão é achado pelo nome que aparece, e pela ordem quando o nome se repete', relatorio.botao(L, 'Ver conta') == 3 and relatorio.botao(L, 'Ver conta (2ª)') == 7 and relatorio.botao(L, 'Nada') is None)
    v = relatorio.video(pw, pl, pl['ligacoes'][0]['nome'], pasta, navegador=nav)
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v], capture_output=True, text=True).stdout.strip() or 0) if v else 0
    ok('vídeo do toque em MP4 (sem GIF), do antes até depois do toque', v and v.endswith('.mp4') and dur >= 1.5, '%s · %.1f s' % (v, dur))
    nav.close()
# (4) a linha do status
res = {'setor': 'site', 'modo': 'completa', 'completa': True, 'falhas': 1, 'minutos': 41.0, 'commit': 'abc1234567', 'selo': False, 'data': '2026-11-26 03:00',
       'etapas': [{'etapa': 'comparador (site × planta)', 'estado': 'FALHA', 'itens': ['Início (sem): “Comprar” cor']}, {'etapa': 'toques', 'estado': 'ok', 'itens': []}]}
est_, desc = anota.linha(res)
ok('linha do status: selo, falhas, minutos, commit e passou do limite', est_.startswith('SEM SELO') and '1 falha' in est_ and 'abc123456' in est_ and 'passou do limite de 30 min' in est_, est_)
ok('descrição do status: só as etapas com falha, com o 1º item', 'comparador' in desc and 'toques' not in desc and '“Comprar” cor' in desc, desc)
ok('a porta anota sozinha no fim (pelo comando do status, nunca à mão)', all("anota.anota(res)" in open(os.path.join(A, s, 'porta.py')).read() for s in ('setor_app', 'setor_site')))
f = [n for n, c, _ in R if not c]
print('\nParte 8: %d/%d' % (len(R) - len(f), len(R)))
sys.exit(1 if f else 0)
