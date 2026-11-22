# ARGUS (Agente de Rastreamento e Gestão Unificada de Segurança) — nome dado pelo dono em 22/11/2026; antes se chamava "porteiro".
# Roda ANTES de publicar o site. Se aparecer falha grave nova, a versão não sobe.
# uso: python3 argus.py            → rápido (partes em paralelo) sobre a cópia atual de /home/claude/catalogo
#      python3 argus.py completo   → todas as provas + fiscal visual em todos os aparelhos (~1 h)
# Falhas já conhecidas (aguardando esboço do dono) ficam em conhecidos.json e não bloqueiam — mas aparecem no relatório.
import sys, os, json, subprocess, time, html, shutil
D = os.path.dirname(os.path.abspath(__file__)); COMP = len(sys.argv) > 1 and sys.argv[1] == 'completo'; SO_CMP = len(sys.argv) > 1 and sys.argv[1] == 'comparador'  # 'comparador' = só o portão das diferenças (rápido, para conferir um esboço)
PORTA = 8790; OUT = '/tmp/argus'
shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
subprocess.run(['bash', os.path.join(D, '..', 'mkcopy.sh'), 'argus', str(PORTA)], check=True, stdout=subprocess.DEVNULL)
modo = [] if COMP else ['rapido']
grupos = [] if SO_CMP else ['6,1', '2', '3', '4,5', '7']
t0 = time.time(); P = []
for i, g in enumerate(grupos):
    env = dict(os.environ, FISCAL_PARTES=g, FISCAL_SUF=f'_{i}')
    P.append(subprocess.Popen(['python3', os.path.join(D, 'provas.py'), str(PORTA), OUT] + modo, env=env, stdout=open(f'{OUT}/log_{i}.txt', 'w'), stderr=subprocess.STDOUT))
if not SO_CMP: P.append(subprocess.Popen(['python3', os.path.join(D, 'fiscal.py'), str(PORTA), OUT + '/visual'] + modo, stdout=open(f'{OUT}/log_visual.txt', 'w'), stderr=subprocess.STDOUT))
# Plano das ferramentas, parte 4 (aprovado 21/11): o Argus é o portão de saída do site — além das provas, roda o COMPARADOR entre o site publicado
# (origin/main do catalogo) e o que vai subir (a pasta de trabalho). Falha nova reprova. Toda diferença tem de estar na lista do que foi
# aprovado (work/fiscal/diferencas-aprovadas.txt: um trecho por linha, que apareça na linha da diferença); diferença sem dono reprova.
CAT = '/home/claude/catalogo'; HOJE = '/tmp/argus_hoje'; CMP = OUT + '/comparador'; SERV = []
def _g(*a, onde=CAT): return subprocess.run(['git', '-C', onde] + list(a), capture_output=True, text=True)
def comparador_liga():
    _g('fetch', '-q', '--depth=200', 'origin', 'main')
    if not _g('status', '--porcelain').stdout.strip() and _g('rev-parse', 'HEAD').stdout == _g('rev-parse', 'origin/main').stdout: return None
    if os.path.isdir(HOJE): _g('checkout', '-q', '--detach', 'origin/main', onde=HOJE)
    else: _g('worktree', 'add', '--detach', HOJE, 'origin/main')
    for pasta, porta in ((HOJE, 8788), (CAT, 8789)):
        SERV.append(subprocess.Popen(['python3', '-m', 'http.server', str(porta)], cwd=pasta, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL))
    time.sleep(1)
    return subprocess.Popen(['python3', os.path.join(D, '..', 's430', 'comparador', 'compara.py'), 'http://localhost:8788/', 'http://localhost:8789/', CMP], stdout=open(f'{OUT}/log_comparador.txt', 'w'), stderr=subprocess.STDOUT)
def comparador_le():
    out = []
    try: rel = json.load(open(CMP + '/relatorio.json'))
    except Exception as e: return [{'parte': 'comparador', 'nome': 'comparador publicado × o que vai subir', 'ok': False, 'grave': True, 'd': 'o comparador não terminou (ver log_comparador.txt)'}]
    apr = [l.strip() for l in open(os.path.join(D, 'diferencas-aprovadas.txt'), encoding='utf-8').read().split('\n') if l.strip() and not l.startswith('#')] if os.path.exists(os.path.join(D, 'diferencas-aprovadas.txt')) else []
    for x in rel:
        onde = x['aparelho'] + ' · ' + x['tela']
        for f in x['falhas_novas']: out.append({'parte': 'comparador', 'nome': 'falha nova · ' + onde + ' · ' + str(f[0])[:60], 'ok': False, 'grave': True, 'd': ' × '.join(str(y)[:70] for y in f[1:])})
        sem = [d for d in x['diferencas'] if not any(a in (onde + ' | ' + ' | '.join(map(str, d))) for a in apr)]
        out.append({'parte': 'comparador', 'nome': 'toda diferença aprovada · ' + onde, 'ok': not sem, 'grave': True, 'd': '%d diferença(s) sem aprovação: ' % len(sem) + ' ; '.join(' | '.join(map(str, d))[:90] for d in sem[:4]) if sem else '%d diferença(s), todas na lista' % len(x['diferencas'])})
    return out
PC = comparador_liga()
if PC: P.append(PC)
for p in P: p.wait()
for sv in SERV: sv.kill()
# provas de tempo: sozinhas, com a máquina livre
if not SO_CMP: subprocess.run(['python3', os.path.join(D, 'provas.py'), str(PORTA), OUT] + modo, env=dict(os.environ, FISCAL_PARTES='T', FISCAL_SUF=f'_{len(grupos)}'), stdout=open(f'{OUT}/log_{len(grupos)}.txt', 'w'), stderr=subprocess.STDOUT)
grupos = grupos + ([] if SO_CMP else ['T'])
R = comparador_le() if PC else [{'parte': 'comparador', 'nome': 'comparador publicado × o que vai subir', 'ok': True, 'd': 'a pasta de trabalho é igual ao site publicado'}]
for i in range(len(grupos)):
    f = f'{OUT}/provas_{i}.json'
    if os.path.exists(f): R += json.load(open(f))['res']
    else: R.append({'parte': '?', 'nome': f'grupo {grupos[i]}', 'ok': False, 'grave': True, 'd': 'as provas não terminaram (ver log)'})
# regras do Firestore (12/11/2026): o que o site manda tem que caber nas regras do projeto
try:
    for x in ([] if SO_CMP else json.loads(subprocess.run(['python3', os.path.join(D, 'regras.py')], capture_output=True, text=True).stdout)):
        R.append({'parte': 'regras', 'nome': x['nome'], 'ok': x['ok'], 'grave': True, 'd': x['d']})
except Exception as e: R.append({'parte': 'regras', 'nome': 'regras do Firestore', 'ok': False, 'grave': True, 'd': 'a prova não rodou: ' + str(e)[:80]})
try:
    for x in ([] if SO_CMP else json.loads(subprocess.run(['python3', os.path.join(D, 'csp.py'), str(PORTA)], capture_output=True, text=True, env=dict(os.environ, PLAYWRIGHT_BROWSERS_PATH='/opt/pw-browsers')).stdout)):
        R.append({'parte': 'regras', 'nome': x['nome'], 'ok': x['ok'], 'grave': True, 'd': x['d']})
except Exception as e: R.append({'parte': 'regras', 'nome': 'CSP', 'ok': False, 'grave': True, 'd': 'a prova não rodou: ' + str(e)[:80]})
# visual: só o que é novo em relação à linha de base guardada
VIS = []; base = set(json.load(open(os.path.join(D, 'base_visual.json')))) if os.path.exists(os.path.join(D, 'base_visual.json')) else set()
try:
    import re
    for x in ([] if SO_CMP else json.load(open(OUT + '/visual/resultado.json'))):
        for i in x['iss']:
            if i['t'] in ('sob_fixo', 'reticencias', 'botao_pequeno'): continue
            k = i['t'] + '|' + x['tela'].split(' · parte')[0] + '|' + re.sub(r'\(\d+×\d+ px\)', '', i['d'])[:90]
            if k not in base: VIS.append(k)
except Exception as e: VIS.append('fiscal visual não terminou: ' + str(e)[:80])
VIS = sorted(set(VIS))
conh = json.load(open(os.path.join(D, 'conhecidos.json'))) if os.path.exists(os.path.join(D, 'conhecidos.json')) else {}
F = [r for r in R if not r['ok']]
novas = [r for r in F if r.get('grave') and r['nome'] not in conh]
seg = time.time() - t0
print(f'Argus: {len(R)} provas, {len(F)} falhas ({len(novas)} graves novas), {len(VIS)} defeitos visuais novos, {seg:.0f} s')
for r in novas: print('  NOVA', r['parte'], '·', r['nome'], '·', r['d'])
for v in VIS[:20]: print('  VISUAL NOVO', v)
# relatório
li = lambda r: (f'<div class="c {"g" if r.get("grave") else "l"}"><b>{html.escape(r["nome"])}</b><p>{html.escape(r["d"])}</p>'
                + (f'<p class="k">conhecido: {html.escape(conh[r["nome"]])}</p>' if r['nome'] in conh else '')
                + (f'<img src="{r["foto"]}">' if r.get('foto') else '') + '</div>')
partes = sorted({r['parte'] for r in R})
h = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Argus</title><style>body{font:15px/1.45 system-ui;max-width:860px;margin:auto;padding:16px}.c{border:1px solid #eee;border-radius:10px;padding:10px;margin:8px 0}.g{border-left:5px solid #c62828}.l{border-left:5px solid #f9a825}.c img{max-width:100%;border:1px solid #ddd;border-radius:6px}.c p{margin:.3em 0;color:#555}.k{color:#888!important}h2{font-size:18px;border-bottom:2px solid #eee}</style>'
h += f'<h1>Argus {"completo" if COMP else "rápido"}</h1><p>{len(R)} provas · {len(R) - len(F)} passaram · {len(F)} falharam · {len(novas)} graves novas · {len(VIS)} defeitos visuais novos · {seg / 60:.0f} min</p>'
for pt in partes:
    rs = [r for r in R if r['parte'] == pt]; fs = [r for r in rs if not r['ok']]
    h += f'<h2>{html.escape(pt)} — {len(rs) - len(fs)} de {len(rs)} passaram</h2>' + ''.join(li(r) for r in fs)
if VIS: h += '<h2>Visual — defeitos novos</h2>' + ''.join(f'<div class="c g"><p>{html.escape(v)}</p></div>' for v in VIS)
open(OUT + '/argus.html', 'w').write(h)
sys.exit(1 if novas or VIS else 0)
