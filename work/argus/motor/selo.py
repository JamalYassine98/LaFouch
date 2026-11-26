# ARGUS · o selo: só existe quando a rodada COMPLETA passou (0 falhas e autoprova ok), e vale só para aquele commit do setor —
# o app: o commit do projeto (src/, www/, build.js) · o site: o commit do catalogo (o que sobe para lafouch.com).
# O publicar do app e do site confere o selo do mesmo commit. Sem selo, não publica. (Ligação no publicar: Parte 8, com o dono.)
import os, json, subprocess, time, sys
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = os.path.dirname(os.path.dirname(A)); D = os.path.join(A, 'selos')
CAT = '/home/claude/catalogo'
REPO = {'app': (R, ['src', 'www', 'build.js']), 'site': (CAT, [])}   # o repositório de cada setor e o que não pode estar mexido fora do commit
def commit(setor='app'): return subprocess.run(['git', '-C', REPO[setor][0], 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()
def sujo(setor='app'):
    r, p = REPO[setor]
    return bool(subprocess.run(['git', '-C', r, 'status', '--porcelain', '--'] + p, capture_output=True, text=True).stdout.strip())
def grava(setor, resultado):
    os.makedirs(D, exist_ok=True); f = os.path.join(D, setor + '.json')
    if resultado['falhas'] or not resultado['autoprova_ok'] or resultado.get('completa') is not True:
        if os.path.exists(f): os.remove(f)
        return None
    s = {'setor': setor, 'commit': commit(setor), 'data': time.strftime('%Y-%m-%d %H:%M'), 'resumo': resultado.get('resumo', '')}
    json.dump(s, open(f, 'w'), ensure_ascii=False, indent=1); return s
def confere(setor):
    """(ok, motivo) — o publicar chama isto."""
    f = os.path.join(D, setor + '.json')
    if not os.path.exists(f): return False, 'sem selo do Argus (a rodada completa não passou)'
    s = json.load(open(f))
    if s['commit'] != commit(setor): return False, 'o selo é do commit %s, e o que vai subir é %s' % (s['commit'][:9], commit(setor)[:9])
    if sujo(setor): return False, 'há mudança fora do commit do selo (%s)' % ('src/, www/ ou build.js' if setor == 'app' else 'catalogo')
    return True, 'selo do Argus ok (%s, %s)' % (s['commit'][:9], s['data'])
if __name__ == '__main__':
    ok, m = confere(sys.argv[1] if len(sys.argv) > 1 else 'app'); print(m); sys.exit(0 if ok else 1)
