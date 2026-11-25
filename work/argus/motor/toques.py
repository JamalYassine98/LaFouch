# ARGUS · os toques (Parte 3). Confere se cada botão faz o que a planta aprovada diz (as LIGAÇÕES) e as regras de toque do motor
# (CLAUDE.md 15–16, valem para app e site): › sai para outra tela e o voltar traz de volta ao MESMO ponto · ⌄ abre ali e fecha no
# 2º toque, e toques rápidos não deixam pela metade · a janela de baixo não tem × nem "Fechar", fecha com Esc, tocando fora e
# arrastando para baixo, e pergunta "Sair sem salvar?" se algo mudou. Nunca toca em botão de perigo (motor/perigo.py).
import os, sys
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import planta, sim, aparelhos
ALT = "(i)=>window.__argus.altura(i)"; JANELA = "()=>window.__argus.janelaInfo()"; SAIR_SEM = "()=>window.__argus.sairSemSalvar()"
from js import js
VOLTA = js('voltar')
def arrasta(pg, x, y0, y1, passos=12):
    """O DEDO na tela (eventos de toque de verdade): encosta em (x, y0), arrasta até y1 e solta. Um jeito só para rolar e para fechar a janela."""
    c = pg.context.new_cdp_session(pg)
    c.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y0}]})
    for k in range(1, passos + 1):
        c.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x, 'y': y0 + (y1 - y0) * k / passos}]}); pg.wait_for_timeout(16)
    c.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []}); c.detach()
def _passa(pg, passos):
    for js in passos: pg.evaluate(js); pg.wait_for_timeout(1000)
def _abre(pw, nav, tela, porta, extra=()):
    b, pg = planta._abre_tela(pw, tela, 'escuro', porta, navegador=nav)
    for i in extra:
        pg.evaluate(planta.TOCA, i); pg.wait_for_timeout(1000)
    return b, pg
def confere(pw, pl, porta=None):
    """Grava as ligações do app e compara com as da planta; depois roda as regras de toque. Devolve a lista de problemas."""
    tela = {'nome': pl['tela'], 'passos': pl['passos'], 'cenario': pl['cenario']}
    tit0, lig = planta.ligacoes(pw, tela, porta)
    P = []
    def chaves(L):   # o botão é reconhecido pelo que APARECE (o nome), e pela ordem quando o nome se repete — nunca pelo nome do código
        vistos = {}; out = {}
        for l in L:
            n = l['nome']; vistos[n] = vistos.get(n, 0) + 1; out[('', '', n if vistos[n] == 1 else '%s (%dª)' % (n, vistos[n]))] = l['faz']
        return out
    app = chaves(lig); pla = chaves(pl.get('ligacoes') or [])
    for k, faz in pla.items():
        if k not in app: P.append(('botão "%s"' % k[2][:40], 'falta no app (a planta tem: %s)' % faz))
        elif app[k] != faz: P.append(('botão "%s"' % k[2][:40], 'faz "%s"; a planta diz "%s"' % (app[k], faz)))
    for k, faz in app.items():
        if k not in pla: P.append(('botão "%s"' % k[2][:40], 'sobra no app (faz: %s)' % faz))
    nav = sim.navegador(pw)
    try:
        for l in lig: P += regras(pw, nav, tela, porta, l, tit0)
        P += gestos(pw, nav, tela, porta, lig)
    finally: nav.close()
    return P
def regras(pw, nav, tela, porta, l, tit0):
    """As regras de toque do motor para UM botão, pelo que ele faz."""
    P = []; nome = 'botão "%s"' % l['nome'][:40]; faz = l['faz']
    if faz.startswith('sai para') and not __import__('re').match(r'^(‹|voltar)', l['nome'].strip(), __import__('re').I):   # o próprio botão de voltar não se confere voltando de novo
        b, pg = _abre(pw, nav, tela, porta); pg.evaluate(planta.TOCA, l['i']); y0 = pg.evaluate('()=>scrollY')   # TOCA rola até o botão: é o ponto de onde se saiu
        pg.wait_for_timeout(1000); como = pg.evaluate(VOLTA); pg.wait_for_timeout(1100)
        t = pg.evaluate(planta.TITULO); y1 = pg.evaluate('()=>scrollY'); b.close()
        if t != tit0: P.append((nome, 'o voltar (%s) foi para "%s", não para "%s"' % (como, t, tit0)))
        elif abs(y1 - y0) > 60: P.append((nome, 'o voltar não volta ao mesmo ponto (rolagem %d → %d)' % (y0, y1)))
    elif faz == 'abre ali':
        b, pg = _abre(pw, nav, tela, porta); h0 = pg.evaluate(ALT, l['i'])
        pg.evaluate(planta.TOCA, l['i']); pg.wait_for_timeout(900); h1 = pg.evaluate(ALT, l['i'])
        pg.evaluate(planta.TOCA, l['i']); pg.wait_for_timeout(900); h2 = pg.evaluate(ALT, l['i'])
        if abs(h2 - h0) > 4: P.append((nome, 'abre ali mas não fecha no 2º toque (%d → %d → %d px)' % (h0, h1, h2)))
        for _ in range(3): pg.evaluate(planta.TOCA, l['i']); pg.wait_for_timeout(120)
        pg.wait_for_timeout(900); h3 = pg.evaluate(ALT, l['i']); pg.evaluate(planta.TOCA, l['i']); pg.wait_for_timeout(900); h4 = pg.evaluate(ALT, l['i']); b.close()
        if min(abs(h3 - h0), abs(h3 - h1)) > 4: P.append((nome, 'toques rápidos deixam pela metade (%d px)' % h3))
        elif abs(h4 - h3) < 4: P.append((nome, 'depois de toques rápidos o botão para de responder'))
    elif faz.startswith('abre a janela de baixo'):
        b, pg = _abre(pw, nav, tela, porta, [l['i']]); j = pg.evaluate(JANELA)
        if not j: b.close(); P.append((nome, 'a janela não ficou aberta para conferir')); return P
        if j.get('tipo') == 'meio': P.append((nome, 'abre uma caixa no meio da tela, não a janela de baixo (regra 15)'))
        if j['fechar']: P.append((nome, 'a janela tem %s (a regra é fechar arrastando, tocando fora ou com Esc)' % ', '.join('"%s"' % x for x in j['fechar'])))
        pg.keyboard.press('Escape'); pg.wait_for_timeout(700)
        if pg.evaluate(JANELA): P.append((nome, 'a janela não fecha com Esc'))
        b.close(); b, pg = _abre(pw, nav, tela, porta, [l['i']]); j = pg.evaluate(JANELA)
        if j:
            pg.touchscreen.tap(pg.viewport_size['width'] / 2, max(8, j['top'] / 2)); pg.wait_for_timeout(700)   # o dedo tocando fora
            if pg.evaluate(JANELA): P.append((nome, 'a janela não fecha tocando fora'))
        b.close(); b, pg = _abre(pw, nav, tela, porta, [l['i']]); j = pg.evaluate(JANELA)
        if j and j.get('tipo') == 'baixo':
            arrasta(pg, pg.viewport_size['width'] / 2, j['top'] + 10, j['top'] + 330); pg.wait_for_timeout(800)
            if pg.evaluate(JANELA): P.append((nome, 'a janela não fecha arrastando para baixo'))
        b.close()
        if j and j['campo']:
            b, pg = _abre(pw, nav, tela, porta, [l['i']])
            campo = pg.query_selector('input:not([type=checkbox]):not([type=hidden]):not([readonly]),textarea')
            if campo and campo.is_visible():
                campo.click(); campo.type('x'); pg.keyboard.press('Escape'); pg.wait_for_timeout(700)
                if not pg.evaluate(SAIR_SEM) and not pg.evaluate(JANELA): P.append((nome, 'mudou um campo e a janela fechou sem perguntar "Sair sem salvar?"'))
            b.close()
    return P

# ---- gestos (regra 18: tocar com o dedo, como no celular) ----
ROLA = r"""()=>{const n=document.querySelector('#mainnav')||document.querySelector('nav'),r0=n?n.getBoundingClientRect().top:null,y0=scrollY,alto=document.documentElement.scrollHeight>innerHeight+40;
 return {alto,y0,r0}}"""
DEPOIS_ROLA = r"""()=>{const n=document.querySelector('#mainnav')||document.querySelector('nav');return {y:scrollY,x:scrollX,r:n?n.getBoundingClientRect().top:null,largura:document.documentElement.scrollWidth}}"""   # largura comparada com a TELA do aparelho (no celular a página se alarga sozinha)
CAMPO = r"""()=>{const j=window.__argus.janela();const c=j&&[...j.el.querySelectorAll('input:not([type=checkbox]):not([type=hidden]):not([readonly]),textarea')].find(window.__argus.vis);if(!c)return null;c.focus();c.scrollIntoView({block:'nearest'});return 1}"""
VE_CAMPO = r"""()=>{const c=document.activeElement;if(!c||!c.matches('input,textarea'))return {foco:false};const r=c.getBoundingClientRect(),vh=(window.visualViewport?visualViewport.height:innerHeight);
 const j=window.__argus.janela();const s=j&&[...j.el.querySelectorAll('button,[role=button]')].find(b=>/^salvar$/i.test(window.__argus.nome(b)));let sv=null;if(s){const q=s.getBoundingClientRect();sv=q.top>=0&&q.bottom<=vh+1}
 return {foco:true,visivel:r.top>=0&&r.bottom<=vh+1,salvar:sv}}"""
def gestos(pw, nav, tela, porta, lig):
    """Rolar com o dedo (a página rola, a barra de baixo fica no lugar, nada rola de lado) e o teclado subindo (o campo e o "Salvar" continuam à vista)."""
    P = []
    b, pg = planta._abre_tela(pw, tela, 'escuro', porta, navegador=nav)
    a = pg.evaluate(ROLA); W, H = pg.viewport_size['width'], pg.viewport_size['height']
    arrasta(pg, W // 2, int(H * 0.7), int(H * 0.2))   # o dedo arrastando para cima
    pg.wait_for_timeout(700); d = pg.evaluate(DEPOIS_ROLA); b.close()
    if a['alto'] and d['y'] <= a['y0']: P.append(('a tela', 'não rola com o dedo'))
    if a['r0'] is not None and d['r'] is not None and abs(d['r'] - a['r0']) > 1: P.append(('a barra de abas', 'sai do lugar quando a tela rola (%+.0f px)' % (d['r'] - a['r0'])))
    if d['x'] or d['largura'] > W + 1: P.append(('a tela', 'rola de lado (passa da largura: %d de %d px)' % (d['largura'], W)))
    for l in lig:
        if not l['faz'].startswith('abre a janela de baixo'): continue
        b, pg = planta._abre_tela(pw, tela, 'escuro', porta, navegador=nav); pg.evaluate(planta.TOCA, l['i']); pg.wait_for_timeout(1000)
        if pg.evaluate(CAMPO):
            pg.set_viewport_size({'width': W, 'height': int(H * 0.55)}); pg.wait_for_timeout(600)   # o teclado do Android ocupa ~45% da tela
            v = pg.evaluate(VE_CAMPO)
            if v['foco'] and not v['visivel']: P.append(('janela "%s"' % l['nome'][:30], 'com o teclado aberto, o campo fica escondido'))
            if v['foco'] and v['salvar'] is False: P.append(('janela "%s"' % l['nome'][:30], 'com o teclado aberto, o "Salvar" fica escondido'))
        b.close()
    return P
