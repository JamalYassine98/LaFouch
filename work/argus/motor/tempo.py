# ARGUS · tempo (lentidão), parte do motor: quanto o app demora para abrir e para responder a cada toque, com a loja cheia
# (dia de evento). Conta do toque até a tela parar de mudar (nenhuma mudança por 150 ms). Limites escritos só aqui.
ABRIR_MS = 3000; TOQUE_MS = 500   # simulador de PC; no celular é mais lento, então o limite aqui é apertado de propósito
import dedo
def toque_ms(m, i):
    """Do dedo encostar até a tela parar de mudar (motor/js/base.js: vigia/parou), em ms; -1 se o botão não existe. Mão = dedo.Mao ou página."""
    m = dedo.mao(m); r = m.ev(dedo.ALVO, i)
    if not r: return -1
    m.ev("()=>window.__argus.vigia()"); dedo.toca_xy(m, r['x'], r['y'], r.get('toque', True)); return m.ev("()=>window.__argus.parou()")
