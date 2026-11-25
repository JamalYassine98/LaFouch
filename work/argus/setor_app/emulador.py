# ARGUS · setor App · o emulador Android do GitHub (de graça: o repositório é público). Dispara o workflow argus-android, espera,
# busca o resultado no ramo argus-android-<tema> e compara com as plantas:
#   letra 1×  → comparador (app no Android × planta), com a tolerância do Android (as letras do Android desenham ±2 px diferente)
#   1,15× e 1,3× → medidor de família (o texto cabe? quebra? corta?) com a letra de verdade do Android
#   e as barras do APK: a altura útil da tela no Android.
import os, sys, json, time, subprocess, glob
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = os.path.dirname(os.path.dirname(A)); sys.path.insert(0, os.path.join(A, 'motor'))
import compara, familia, planta, tempo
REPO = 'JamalYassine98/LaFouch'; TOL_ANDROID = 2.0
def gh(*a): return subprocess.run(['gh', 'api'] + list(a), capture_output=True, text=True)
def sobe_versao():
    """O emulador testa a MESMA versão que o Argus está conferindo: sobe o commit de agora num ramo só do Argus."""
    c = subprocess.run(['git', '-C', R, 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()
    r = subprocess.run(['git', '-C', R, 'push', '-qf', 'origin', 'HEAD:refs/heads/argus-confere'], capture_output=True, text=True)
    if r.returncode: raise SystemExit('não consegui subir a versão para o emulador: ' + r.stderr[:200])
    return 'argus-confere', c
def dispara(pasta='work/argus/plantas/app', ref='main'):
    antes = time.time()
    r = gh('-X', 'POST', 'repos/%s/actions/workflows/argus-android.yml/dispatches' % REPO, '-f', 'ref=%s' % ref, '-f', 'inputs[pasta]=%s' % pasta)
    if r.returncode: raise SystemExit('não consegui disparar: ' + r.stderr[:200])
    for i in range(30):
        time.sleep(10); j = json.loads(gh('repos/%s/actions/workflows/argus-android.yml/runs?per_page=1' % REPO).stdout or '{}')
        run = (j.get('workflow_runs') or [None])[0]
        if run and time.mktime(time.strptime(run['created_at'], '%Y-%m-%dT%H:%M:%SZ')) - time.timezone >= antes - 60: return run['id']
    raise SystemExit('o workflow não começou')
def espera(run_id, max_min=80):
    for i in range(max_min * 2):
        j = json.loads(gh('repos/%s/actions/runs/%d' % (REPO, run_id)).stdout or '{}')
        if j.get('status') == 'completed': return j.get('conclusion')
        time.sleep(30)
    return 'demorou demais'
def busca(destino='/tmp/argus_android'):
    os.makedirs(destino, exist_ok=True)
    for tema in ('claro', 'escuro'):
        d = os.path.join(destino, tema); subprocess.run(['rm', '-rf', d])
        subprocess.run(['git', '-C', R, 'fetch', '-q', 'origin', 'argus-android-' + tema], capture_output=True)
        subprocess.run(['git', '-C', R, 'worktree', 'add', '-f', '--detach', d, 'FETCH_HEAD'], capture_output=True)
    return destino
def compara_tudo(destino, plantas_dir):
    out = {'barras': [], 'comparador': [], 'medidor': [], 'regra_x_aprovado': [], 'tempo': [], 'faltou': []}
    for f in glob.glob(os.path.join(destino, '*', 'info-*.json')):
        i = json.load(open(f)); out['barras'].append('%s letra %s: tela útil %s × %s (aparelho %s × %s, %s pontos/pixel)' % (i['tema'], i['letra'], *i['tela_css']))
    for pf in sorted(glob.glob(os.path.join(plantas_dir, '*.json'))):
        pl = json.load(open(pf))
        for tema in ('claro', 'escuro'):
            for letra in ('1.0', '1.15', '1.3'):
                f = os.path.join(destino, tema, '%s-%s-%s.json' % (pl['id'], tema, letra))
                if not os.path.exists(f): out['faltou'].append('%s · %s · letra %s' % (pl['tela'], tema, letra)); continue
                e = json.load(open(f))
                if not isinstance(e.get('pecas'), list): out['faltou'].append('%s · %s · letra %s (erro: %s)' % (pl['tela'], tema, letra, str(e.get('pecas'))[:80])); continue
                if letra == '1.0': base = set(); igual = False
                if letra == '1.0' and tema in pl['temas']:
                    t0 = compara.TOL; compara.TOL = TOL_ANDROID
                    try: D = compara.compara(pl['temas'][tema]['pecas'], e['pecas'])
                    finally: compara.TOL = t0
                    # no Android as letras do sistema desenham com outra largura: lá vale o que FALTA e o que SOBRA; tamanho e posição ficam como informação
                    ruins = [(a, b) for a, b, *_ in D if b.startswith(('falta', 'sobra', 'desenho', 'cor', 'fundo', 'borda'))]; igual = not ruins
                    out['comparador'] += ['%s (%s, Android): %s %s' % (pl['tela'], tema, a, b) for a, b in ruins]
                    out.setdefault('informacao', []).extend('%s (%s, Android): %s %s' % (pl['tela'], tema, a, b) for a, b, *_ in D if not b.startswith(('falta', 'sobra', 'desenho', 'cor', 'fundo', 'borda')))
                # a mesma regra do simulador (setor_app/porta.py): app igual à planta → o achado é do APROVADO; na letra maior, só o NOVO é falha
                for x in familia.mede_tela('%s · %s · letra %s (Android)' % (pl['tela'], tema, letra), e['familia']):
                    k = (x[0], x[2], x[3] if len(x) > 3 else ''); txt = '%s · %s %s %s' % (x[1], x[0], x[2], k[2])
                    if igual and letra == '1.0': base.add(k); out['regra_x_aprovado'].append(txt)
                    elif k in base: out['regra_x_aprovado'].append(txt)
                    else: out['medidor'].append(txt)
                T = e.get('tempo')   # os mesmos limites do simulador (motor/tempo.py), medidos no Android com a loja cheia
                if T:
                    if T['abrir_ms'] > tempo.ABRIR_MS: out['tempo'].append('%s (Android, loja cheia): abrir levou %d ms (limite %d)' % (pl['tela'], T['abrir_ms'], tempo.ABRIR_MS))
                    if T.get('sozinha', 0) > tempo.SOZINHA_MAX:
                        out['tempo'].append('%s (Android, loja cheia): a tela muda sozinha sem parar (%d mudanças em 1 s, parada) — laço; tempos de toque não conferidos' % (pl['tela'], T['sozinha'])); continue
                    for n, ms in T['toques']:
                        if ms >= 15000: out['tempo'].append('%s (Android, loja cheia): toque em "%s": a tela não parou de mudar em 15 s' % (pl['tela'], n[:30]))
                        elif ms > tempo.TOQUE_MS: out['tempo'].append('%s (Android, loja cheia): toque em "%s" levou %d ms (limite %d)' % (pl['tela'], n[:30], ms, tempo.TOQUE_MS))
    return out
def letra_igual(pw, destino, plantas_dir):
    """A letra grande do simulador (motor/js/letra.js) × a do Android de verdade: o mesmo texto tem de ter o mesmo tamanho de letra
    (até 0,5 px). É a trava de que a imitação continua igual ao celular."""
    import planta, sim
    out = []; nav = sim.navegador(pw)
    try:
        for pf in sorted(glob.glob(os.path.join(plantas_dir, '*.json'))):
            pl = json.load(open(pf)); tela = {'nome': pl['tela'], 'passos': pl['passos'], 'cenario': pl['cenario']}
            for letra in ('1.15', '1.3'):
                f = os.path.join(destino, 'escuro', '%s-escuro-%s.json' % (pl['id'], letra))
                if not os.path.exists(f): out.append('%s · letra %s: o Android não trouxe' % (pl['tela'], letra)); continue
                e = json.load(open(f)); b, pg = planta._abre_tela(pw, tela, 'escuro', None, navegador=nav, letra=float(letra)); s_ = pg.evaluate(planta.COLETA); b.close()
                tam = lambda L: {p['texto']: float(p['letra'][0][:-2]) for p in L if p['tipo'] == 'texto' and p['texto'] and p['letra'][0].endswith('px')}
                a, s2 = tam(e['pecas']), tam(s_)
                out += ['%s · letra %s: "%s" Android %.1f px, simulador %.1f px' % (pl['tela'], letra, t[:30], a[t], s2[t]) for t in a if t in s2 and abs(a[t] - s2[t]) > 0.5]
    finally: nav.close()
    return out
if __name__ == '__main__':
    pasta = sys.argv[1] if len(sys.argv) > 1 else 'work/argus/plantas/app'
    ref, c = sobe_versao(); rid = dispara(pasta, ref); print('workflow', rid, 'versão', c[:9], flush=True); print('terminou:', espera(rid), flush=True)
    res = compara_tudo(busca(), os.path.join(R, pasta)); json.dump(res, open('/tmp/argus_android.json', 'w'), ensure_ascii=False, indent=1)
    for k, v in res.items(): print('%s: %d' % (k, len(v))); [print('   ', x) for x in v[:12]]
