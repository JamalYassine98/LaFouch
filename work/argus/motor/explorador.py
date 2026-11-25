# ARGUS · o explorador (Parte 3). Parte das 5 abas e toca em tudo (menos nos botões de perigo) para descobrir cada LUGAR do app:
# tela (título + a tela em que o app diz estar) e janela de baixo aberta. Para cada lugar guarda o caminho (os toques) até ele.
# Junto: erros do app no console a cada toque, e a COBERTURA do código (quais funções do app.js rodaram) para achar código morto.
# Mapa de cobertura: lugar sem planta aprovada nunca passa.
import os, sys, json, collections
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import abrir, planta, sim, perigo, dedo
NAV = "(k)=>window.__argus.aba(k)"; NNAV = "()=>window.__argus.nAbas()"   # motor/js/base.js
def _abre(pw, nav, caminho, porta, cobertura):
    cdp = []; erros = []
    def antes(pg):
        pg.on('pageerror', lambda e: erros.append(str(e)[:160]))
        if cobertura is not None:
            s = pg.context.new_cdp_session(pg); s.send('Profiler.enable'); s.send('Profiler.startPreciseCoverage', {'callCount': True, 'detailed': False}); cdp.append(s)
    b, pg = abrir.abre(pw, navegador=nav, porta=porta, antes=antes)
    cdp = cdp[0] if cdp else None
    anda(pg, caminho)
    return b, pg, cdp, erros
def anda(pg, caminho):
    """Refaz um caminho achado: aba da barra ou toque de dedo em cada passo."""
    for tipo, i in caminho:
        if tipo == 'aba': pg.evaluate(NAV, i)
        else: dedo.toque(pg, i)
        pg.wait_for_timeout(950)
def _junta(cobertura, cdp):
    if cdp is None: return
    r = cdp.send('Profiler.takePreciseCoverage')
    for s in r['result']:
        if not s['url'].endswith('/app.js'): continue
        for f in s['functions']:
            k = (f['functionName'] or '(anônima)', f['ranges'][0]['startOffset'])
            cobertura[k] = cobertura.get(k, 0) + f['ranges'][0]['count']
def _lugar(pg):
    t = pg.evaluate(planta.TITULO); j = pg.evaluate("()=>{const j=window.__argus.janela();return j&&j.titulo}")
    return t + (' | janela: ' + j if j else '')
def explora(pw, profundidade=2, porta=None, max_toques=400, cobertura=True):
    """Devolve {'lugares': {nome: {'caminho', 'nivel'}}, 'erros': [...], 'cobertura': {(função, início): vezes}, 'toques': n}."""
    nav = sim.navegador(pw); cov = {} if cobertura else None
    lug = collections.OrderedDict(); erros = []; fila = []; n = 0
    b, pg, cdp, er = _abre(pw, nav, [], porta, cov); nabas = pg.evaluate(NNAV); _junta(cov, cdp); b.close()
    for k in range(nabas): fila.append(([('aba', k)], 1))
    while fila and n < max_toques:
        cam, nivel = fila.pop(0)
        b, pg, cdp, er = _abre(pw, nav, cam, porta, cov); nome = _lugar(pg); n += 1
        erros += [(nome, e) for e in er]
        if nome in lug: _junta(cov, cdp); b.close(); continue
        lug[nome] = {'caminho': cam, 'nivel': nivel}
        toc = pg.evaluate(planta.TOCAVEIS) if nivel < profundidade + 1 and ' | janela: ' not in nome else []
        _junta(cov, cdp); b.close()
        for t in toc:
            if perigo.perigoso(t): continue
            fila.append((cam + [('toque', t['i'])], nivel + 1))
    nav.close()
    return {'lugares': lug, 'erros': erros, 'cobertura': cov, 'toques': n, 'fila_restante': len(fila)}
def morto(cov):
    """Funções do app.js que nunca rodaram no passeio inteiro (candidatas a código morto; a regra 12d manda conferir rodando)."""
    return sorted(k[0] for k, v in cov.items() if v == 0)
def mapa(lugares, plantas_dir):
    """Cada lugar achado × as plantas guardadas (pelo nome da tela). Sem planta aprovada = trava."""
    pl = {}
    for f in os.listdir(plantas_dir) if os.path.isdir(plantas_dir) else []:
        if f.endswith('.json'):
            x = json.load(open(os.path.join(plantas_dir, f))); pl[x.get('titulo') or ''] = (f, planta.valida(x))
    return {nome: (pl.get(nome) or (None, 'sem planta')) for nome in lugares}
