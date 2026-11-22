"""Medidor — o lado Python de work/kit/mede.js (plano das ferramentas, parte 2).
mede(pg)      → a medida da tela parada (peças L, sobreposições, achados).
percorre(pg)  → rola de ponta a ponta TUDO o que rola na tela (a página e cada caixa com rolagem: o catálogo rola
                dentro de #vscr, a peça dentro da camada aberta) e junta os achados de cada parada, sem repetir.
Comparador, prova do medidor e Argus usam estas duas funções: um jeito só de medir e de rolar."""
import os
MEDE = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mede.js')).read()
ROLAVEIS = """(()=>{const L=[document.scrollingElement];for(const e of document.querySelectorAll('body *')){const k=getComputedStyle(e);if(!/auto|scroll/.test(k.overflowY)||k.visibility==='hidden'||k.display==='none')continue;
  const r=e.getBoundingClientRect();if(e.scrollHeight>e.clientHeight+50&&r.height>innerHeight*.4&&r.width>innerWidth*.4&&r.top<innerHeight&&r.bottom>0)L.push(e)}
  window.__rol=L;return L.length})()"""


def mede(pg):
    return pg.evaluate(MEDE)


def vai_para(pg, k, y):
    pg.evaluate("([k,y])=>{const e=window.__rol[k];e.scrollTop=y;if(e===document.scrollingElement)scrollTo(0,y)}", [k, y])


def percorre(pg, parada=None, max_y=9000):
    """achados de toda a tela; onde[chave] = (caixa, y) da parada em que apareceu. parada(pg, k, y, medida) é chamada em cada parada (fotos do comparador)."""
    n = pg.evaluate(ROLAVEIS)
    achados, onde = {}, {}
    for k in range(n):
        alto, passo = pg.evaluate("k=>{const e=window.__rol[k];return [e.scrollHeight,e===document.scrollingElement?innerHeight:e.clientHeight]}", k)
        y = 0
        while True:
            vai_para(pg, k, y); pg.wait_for_timeout(200)
            r = mede(pg)
            if r['achados']:
                # confirma: o que some 0,6 s depois era movimento (carrossel passando, animação de entrada), não defeito
                pg.wait_for_timeout(600)
                r2 = mede(pg)
                r = dict(r2, achados=[a for a in r2['achados'] if (a['regra'], tuple(a['ids'])) in {(b['regra'], tuple(b['ids'])) for b in r['achados']}])
            if parada: parada(pg, k, y, r)
            for a in r['achados']:
                ch = (a['regra'], tuple(a['ids']))
                if ch not in achados: achados[ch] = a; onde[ch] = (k, y)
            y += max(200, passo - 100)
            if y >= alto - 50 or y > max_y: break
        vai_para(pg, k, 0)
    pg.wait_for_timeout(150)
    return achados, onde
