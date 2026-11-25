# ARGUS · prova da Parte 3 (toques, explorador, cobertura):
#  1 as ligações do app batem com as da planta (Preços › Regras) e as regras de toque rodam em cada botão
#  2 autoprova dos toques: ligação trocada na planta · botão de dobra sem ação (cópia demo-dobra-morta) · janela de mentira com "×"
#    e que não fecha → tudo tem de ser acusado · 3 explorador: acha os lugares a partir das 5 abas, com caminho, erros e cobertura
#  4 autoprova do código morto: a função plantada na cópia demo-morto aparece como nunca rodada · 5 mapa: lugar sem planta = "sem planta"
import os, sys, json, copy, shutil
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import planta, toques, explorador, esboco, sim
planta.P_APP = '/tmp/argus_plantas_teste'; planta.OBS = '/tmp/argus_obsoletos_teste'
from playwright.sync_api import sync_playwright
R = []; ACHADOS = []
def ok(nome, cond, d=''): R.append((nome, bool(cond), d)); print(('ok    ' if cond else 'FALHA ') + nome + (' · ' + d if d else ''), flush=True)
REG = __import__('planta').precos('regras')
T_REG = {'nome': 'Preços › Regras', 'passos': REG, 'cenario': 'normal'}
FALSA = r"""()=>{const b=document.createElement('button');b.type='button';b.textContent='Abrir janela de teste';b.setAttribute('data-act','argusJanela');b.style.cssText='display:block;margin:16px';
 (document.querySelector('.view:not([hidden])')||document.body).prepend(b);
 b.onclick=()=>{const j=document.createElement('div');j.style.cssText='position:fixed;left:0;right:0;bottom:0;height:50vh;background:#222;z-index:9000';j.innerHTML='<b>Janela de teste</b><button type=button>×</button>';document.body.appendChild(j)}}"""
with sync_playwright() as pw:
    # 1
    pl = planta.grava(pw, 'hoje-precos-regras', T_REG); planta.salva(pl)
    P = toques.confere(pw, pl)
    lig = [p for p in P if 'planta' in p[1] or 'sobra' in p[1]]
    ok('ligações do app = ligações da planta (Preços › Regras)', not lig, '; '.join(a + ' ' + b for a, b in lig[:3]))
    ok('regras de toque rodaram em %d botões' % len(pl['ligacoes']), True, '%d achado(s) do app' % len(P))
    ACHADOS += [('Preços › Regras',) + p for p in P]
    # 2 autoprova
    pl2 = copy.deepcopy(pl); k = [i for i, l in enumerate(pl2['ligacoes']) if l['faz'] == 'abre ali'][0]; pl2['ligacoes'][k]['faz'] = 'sai para: Outra tela [x]'
    P2 = toques.confere(pw, pl2)
    ok('autoprova: ligação trocada na planta é acusada', any('a planta diz' in p[1] for p in P2), next((a + ' ' + b for a, b in P2 if 'a planta diz' in b), 'NÃO viu'))
    www = esboco.prepara('demo-dobra-morta'); porta = esboco.serve(www, 8832)
    P3 = toques.confere(pw, pl, porta=porta)
    ok('autoprova: botão de dobra que não abre mais é acusado', any('faz "nada"' in p[1] for p in P3), next((a + ' ' + b for a, b in P3 if 'faz "nada"' in b), 'NÃO viu'))
    nav = sim.navegador(pw)
    tela_f = {'nome': 'teste', 'passos': [FALSA], 'cenario': 'normal'}
    b, pg = planta._abre_tela(pw, tela_f, 'escuro', None, navegador=nav); L = pg.evaluate(planta.TOCAVEIS); b.close()
    i = [t['i'] for t in L if t['act'] == 'argusJanela'][0]
    P4 = toques.regras(pw, nav, tela_f, None, {'i': i, 'nome': 'Abrir janela de teste', 'faz': 'abre a janela de baixo: Janela de teste'}, '')
    nav.close()
    ok('autoprova: janela com "×" é acusada', any('"×"' in p[1] for p in P4), '; '.join(p[1] for p in P4))
    ok('autoprova: janela que não fecha com Esc / tocando fora / arrastando é acusada', all(any(x in p[1] for p in P4) for x in ('Esc', 'tocando fora', 'arrastando')))
    if os.environ.get('ARGUS_SO_TOQUES'): print('(explorador, cobertura e mapa: não rodaram de novo nesta rodada)'); raise SystemExit
    # 3 explorador
    E = explorador.explora(pw, profundidade=2, max_toques=260)
    nomes = list(E['lugares'])
    ok('explorador: achou %d lugares a partir das 5 abas (%d toques)' % (len(nomes), E['toques']), len(nomes) >= 15, 'faltou explorar %d caminho(s) (limite de toques)' % E['fila_restante'] if E['fila_restante'] else 'tudo explorado')
    ok('explorador: chegou em Preços › Regras com o caminho guardado', any(n.startswith('Regras [') for n in nomes))
    cov = E['cobertura']; mor = explorador.morto(cov)
    ok('cobertura: %d funções do app.js medidas, %d nunca rodaram no passeio' % (len(cov), len(mor)), len(cov) > 200)
    ACHADOS += [('erro do app', n, e) for n, e in E['erros']]
    json.dump({'lugares': E['lugares'], 'erros': E['erros'], 'morto': mor[:400], 'n_funcoes': len(cov)}, open('/tmp/argus_p3_explorador.json', 'w'), ensure_ascii=False, indent=1)
    # 4 código morto plantado
    www = esboco.prepara('demo-morto'); porta = esboco.serve(www, 8833)
    E2 = explorador.explora(pw, profundidade=0, porta=porta, max_toques=8)
    ok('autoprova: função plantada e nunca chamada aparece como código morto', 'argusNuncaChamada' in explorador.morto(E2['cobertura']))
    ok('…e uma função que roda (dFold) NÃO aparece como morta', 'dFold' not in explorador.morto(E['cobertura']))
    # 5 mapa
    M = explorador.mapa(E['lugares'], planta.P_APP)
    sem = [n for n, v in M.items() if v[1] == 'sem planta']; com = [n for n, v in M.items() if v[1] != 'sem planta']
    ok('mapa: lugar com planta guardada é reconhecido; os outros ficam "sem planta"', any(n.startswith('Regras [') for n in com) and len(sem) == len(M) - len(com) and sem, '%d com planta · %d sem planta' % (len(com), len(sem)))
json.dump({'R': R, 'achados_do_app': ACHADOS}, open('/tmp/argus_p3.json', 'w'), ensure_ascii=False, indent=1)
print('\nACHADOS DO APP (não são falha da prova):'); [print('  -', *a) for a in ACHADOS[:30]]
print('\n%d de %d ok' % (sum(1 for x in R if x[1]), len(R)))
