# ARGUS · achar a versão onde o erro NASCEU (regra 12a: a causa, não só o lugar). Quando o app difere da planta numa tela, o Argus
# volta nas versões do código (as que mexeram no app) e acha, por busca binária, a primeira que já tinha a diferença — com data,
# sessão e o que ela mudou. Usa a mesma cópia do esboço (motor/esboco.py) e o mesmo comparador (motor/compara.py).
import os, sys, subprocess
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = os.path.dirname(os.path.dirname(A)); sys.path.insert(0, os.path.join(A, 'motor'))
import esboco, planta, compara
def versoes(desde=None, ate='HEAD', limite=200):
    """As versões que mexeram no app (src/, www/, build.js), da mais antiga para a mais nova."""
    rng = ('%s..%s' % (desde, ate)) if desde else ate
    out = subprocess.run(['git', '-C', R, 'log', '--format=%H', '--reverse', '-n', str(limite), rng, '--', 'src', 'www', 'build.js'], capture_output=True, text=True).stdout.split()
    return out if desde else out[-limite:]
def info(c):
    return subprocess.run(['git', '-C', R, 'show', '-s', '--format=%h · %ad · %s', '--date=format:%d/%m %H:%M', c], capture_output=True, text=True).stdout.strip()
def tem_diferenca(pw, pl, c, tema='escuro', porta=8838):
    www = esboco.prepara('_origem', base=c); esboco.serve(www, porta)
    tela = {'nome': pl['tela'], 'passos': pl['passos'], 'cenario': pl['cenario']}
    b, pg = planta._abre_tela(pw, tela, tema, porta); app = pg.evaluate(planta.COLETA); b.close()
    return bool(compara.compara(pl['temas'][tema]['pecas'], app))
def nasceu(pw, pl, tema='escuro', desde=None):
    """Devolve (versão onde nasceu, a anterior sem a diferença) ou (None, motivo)."""
    V = ([desde] if desde else []) + versoes(desde)   # a própria versão de partida entra: é a âncora "ainda sem a diferença"
    if len(V) < 2: return None, 'nenhuma versão para procurar'
    if not tem_diferenca(pw, pl, V[-1], tema): return None, 'a versão de agora não tem a diferença'
    if tem_diferenca(pw, pl, V[0], tema): return None, 'já existia na versão mais antiga procurada (%s)' % info(V[0])
    lo, hi = 0, len(V) - 1   # lo: sem a diferença · hi: com a diferença
    while hi - lo > 1:
        m = (lo + hi) // 2
        if tem_diferenca(pw, pl, V[m], tema): hi = m
        else: lo = m
    return info(V[hi]), info(V[lo])
