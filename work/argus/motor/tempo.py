# ARGUS · tempo (lentidão), parte do motor: quanto o app demora para abrir e para responder a cada toque, com a loja cheia
# (dia de evento). Conta do toque até a tela parar de mudar (nenhuma mudança por 150 ms). Limites escritos só aqui.
ABRIR_MS = 3000; TOQUE_MS = 500   # simulador de PC; no celular é mais lento, então o limite aqui é apertado de propósito
import dedo
SOZINHA_MS = 1000; SOZINHA_MAX = 10   # parada, a tela pode ter um resto de animação; mais que 10 mudanças em 1 s sem toque = laço
def muda_sozinha(m):
    """Mudanças da tela em 1 s, parada (ninguém tocando). Acima do limite, a tela nunca para: os tempos de toque não valem (não conferidos)."""
    return dedo.mao(m).ev("(ms)=>window.__argus.sozinha(ms)", SOZINHA_MS)
def toque_ms(m, i):
    """Do dedo encostar até a tela parar de mudar (motor/js/base.js: vigia/parou), em ms; -1 se o botão não existe. Mão = dedo.Mao ou página."""
    m = dedo.mao(m); r = m.ev(dedo.ALVO, i)
    if not r: return -1
    m.ev("()=>window.__argus.vigia()"); dedo.toca_xy(m, r['x'], r['y'], r.get('toque', True)); return m.ev("()=>window.__argus.parou()")
