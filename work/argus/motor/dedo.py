# ARGUS · o DEDO (um lugar só; aprovado 25/11 08:13). Todo toque do Argus passa aqui: põe o dedo no meio do botão e solta, com
# eventos de toque de verdade (no PC, o botão do mouse de verdade) — nunca "clique por comando", que pula o que o dedo dispara.
# Vale no simulador (Playwright) e no Android emulado (CDP direto): quem chama dá uma MÃO = (ev, envia).
#   ev(código, arg) roda um código na página · envia(método, parâmetros) manda um comando CDP.
import time
ALVO = "(i)=>window.__argus.alvo(i)"; DEPOIS = "()=>window.__argus.depois()"
class Mao:
    def __init__(self, ev, envia, espera=lambda ms: time.sleep(ms / 1000)): self.ev, self.envia, self.espera = ev, envia, espera
def mao(x):
    """Uma página do Playwright vira uma Mão (a ligação CDP fica guardada na própria página)."""
    if isinstance(x, Mao): return x
    if not hasattr(x, '_argus_mao'):
        s = x.context.new_cdp_session(x)
        x._argus_mao = Mao(lambda c, a=None: x.evaluate(c, a), lambda m, p: s.send(m, p), x.wait_for_timeout); x._argus_mao.contexto = x.context
    return x._argus_mao
def toca_xy(m, x, y, toque=True):
    m = mao(m)
    if toque:
        m.envia('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]}); m.espera(50)
        m.envia('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
    else:
        for t in ('mousePressed', 'mouseReleased'):
            m.envia('Input.dispatchMouseEvent', {'type': t, 'x': x, 'y': y, 'button': 'left', 'clickCount': 1}); m.espera(30)
def toque(m, i):
    """Toca o botão i da lista do que se pode tocar. Devolve None (não achou), {'coberto': nome} (outra coisa por cima: o dedo
    pega ela, como no celular) ou {'x','y'}. O retrato de antes fica guardado na página para DEPOIS dizer o que o toque fez."""
    m = mao(m); r = m.ev(ALVO, i)
    if r: toca_xy(m, r['x'], r['y'], r.get('toque', True))
    return r
def toca_sel(m, sel):
    """Toca no meio da peça achada pelo seletor (ex.: as teclas do PIN). Devolve False se ela não está na tela."""
    m = mao(m); r = m.ev("(s)=>{const e=document.querySelector(s);if(!e||!window.__argus.vis(e))return null;e.scrollIntoView({block:'center',behavior:'instant'});const q=e.getBoundingClientRect();return {x:q.left+q.width/2,y:q.top+q.height/2,toque:navigator.maxTouchPoints>0}}", sel)
    if r: toca_xy(m, r['x'], r['y'], r['toque'])
    return bool(r)
def arrasta(m, x, y0, y1, passos=12):
    """Encosta em (x, y0), arrasta até y1 e solta. Um jeito só para rolar e para fechar a janela."""
    m = mao(m)
    m.envia('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y0}]})
    for k in range(1, passos + 1):
        m.envia('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x, 'y': y0 + (y1 - y0) * k / passos}]}); m.espera(16)
    m.envia('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
def faz(m, i, espera=1000):
    """Toca e diz o que o toque fez: sai para · abre a janela de baixo · abre o menu · abre ali · troca a escolha · mostra aviso · nada."""
    m = mao(m); c = getattr(m, 'contexto', None); f0 = len(c._argus_fora) if c is not None else 0; p0 = len(c.pages) if c is not None else 0
    r = toque(m, i)
    if not r: return 'não achado'
    m.espera(espera)
    sai = [u for u, tipo in (c._argus_fora[f0:] if c is not None else []) if tipo == 'document']
    if sai: return 'abre fora: ' + sai[0].split('/')[2]   # a página (ou uma aba nova) tentou ir para outro lugar (WhatsApp, Instagram, mapa…)
    if c is not None and len(c.pages) > p0: return 'abre outra página: /' + c.pages[-1].url.split('/', 3)[-1]   # aba nova com outra página do site
    d = m.ev(DEPOIS)
    return ('coberto por: %s · ' % r['coberto'] + d) if r.get('coberto') else d
