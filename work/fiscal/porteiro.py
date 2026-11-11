# Porteiro: roda ANTES de publicar o site. Se aparecer falha grave nova, a versão não sobe.
# uso: python3 porteiro.py            → rápido (partes em paralelo) sobre a cópia atual de /home/claude/catalogo
#      python3 porteiro.py completo   → todas as provas + fiscal visual em todos os aparelhos (~1 h)
# Falhas já conhecidas (aguardando esboço do dono) ficam em conhecidos.json e não bloqueiam — mas aparecem no relatório.
import sys, os, json, subprocess, time, html, shutil
D = os.path.dirname(os.path.abspath(__file__)); COMP = len(sys.argv) > 1 and sys.argv[1] == 'completo'
PORTA = 8790; OUT = '/tmp/porteiro'
shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
subprocess.run(['bash', os.path.join(D, '..', 'mkcopy.sh'), 'porteiro', str(PORTA)], check=True, stdout=subprocess.DEVNULL)
modo = [] if COMP else ['rapido']
grupos = ['6,1', '2', '3', '4,5']
t0 = time.time(); P = []
for i, g in enumerate(grupos):
    env = dict(os.environ, FISCAL_PARTES=g, FISCAL_SUF=f'_{i}')
    P.append(subprocess.Popen(['python3', os.path.join(D, 'provas.py'), str(PORTA), OUT] + modo, env=env, stdout=open(f'{OUT}/log_{i}.txt', 'w'), stderr=subprocess.STDOUT))
P.append(subprocess.Popen(['python3', os.path.join(D, 'fiscal.py'), str(PORTA), OUT + '/visual'] + modo, stdout=open(f'{OUT}/log_visual.txt', 'w'), stderr=subprocess.STDOUT))
for p in P: p.wait()
R = []
for i in range(len(grupos)):
    f = f'{OUT}/provas_{i}.json'
    if os.path.exists(f): R += json.load(open(f))['res']
    else: R.append({'parte': '?', 'nome': f'grupo {grupos[i]}', 'ok': False, 'grave': True, 'd': 'as provas não terminaram (ver log)'})
# visual: só o que é novo em relação à linha de base guardada
VIS = []; base = set(json.load(open(os.path.join(D, 'base_visual.json')))) if os.path.exists(os.path.join(D, 'base_visual.json')) else set()
try:
    import re
    for x in json.load(open(OUT + '/visual/resultado.json')):
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
print(f'porteiro: {len(R)} provas, {len(F)} falhas ({len(novas)} graves novas), {len(VIS)} defeitos visuais novos, {seg:.0f} s')
for r in novas: print('  NOVA', r['parte'], '·', r['nome'], '·', r['d'])
for v in VIS[:20]: print('  VISUAL NOVO', v)
# relatório
li = lambda r: (f'<div class="c {"g" if r.get("grave") else "l"}"><b>{html.escape(r["nome"])}</b><p>{html.escape(r["d"])}</p>'
                + (f'<p class="k">conhecido: {html.escape(conh[r["nome"]])}</p>' if r['nome'] in conh else '')
                + (f'<img src="{r["foto"]}">' if r.get('foto') else '') + '</div>')
partes = sorted({r['parte'] for r in R})
h = '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Porteiro</title><style>body{font:15px/1.45 system-ui;max-width:860px;margin:auto;padding:16px}.c{border:1px solid #eee;border-radius:10px;padding:10px;margin:8px 0}.g{border-left:5px solid #c62828}.l{border-left:5px solid #f9a825}.c img{max-width:100%;border:1px solid #ddd;border-radius:6px}.c p{margin:.3em 0;color:#555}.k{color:#888!important}h2{font-size:18px;border-bottom:2px solid #eee}</style>'
h += f'<h1>Porteiro {"completo" if COMP else "rápido"}</h1><p>{len(R)} provas · {len(R) - len(F)} passaram · {len(F)} falharam · {len(novas)} graves novas · {len(VIS)} defeitos visuais novos · {seg / 60:.0f} min</p>'
for pt in partes:
    rs = [r for r in R if r['parte'] == pt]; fs = [r for r in rs if not r['ok']]
    h += f'<h2>{html.escape(pt)} — {len(rs) - len(fs)} de {len(rs)} passaram</h2>' + ''.join(li(r) for r in fs)
if VIS: h += '<h2>Visual — defeitos novos</h2>' + ''.join(f'<div class="c g"><p>{html.escape(v)}</p></div>' for v in VIS)
open(OUT + '/porteiro.html', 'w').write(h)
sys.exit(1 if novas or VIS else 0)
