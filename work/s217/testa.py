# S217: TESTAR EM TUDO (pedido do dono, 13/11). Roda o olho do designer no HOJE e na PROPOSTA e lista o que piorou.
#   python3 testa.py N K  → fatia K de N (rodar em paralelo) ; python3 testa.py junta
import sys, json, glob, os
A = os.path.dirname(os.path.abspath(__file__)) + '/'
sys.path.insert(0, A); from padrao import TOQUE, MOUSE
AP = [('celular pequeno',320,568,1),('celular',360,640,1),('celular alto',360,800,1),('iPhone',390,844,1),('celular grande',412,915,1),('iPhone Max',430,932,1),('celular deitado',844,390,1),('tablet pequeno',600,960,1),
      ('iPad em pé',768,1024,1),('iPad Air em pé',820,1180,1),('iPad deitado',1024,768,1),('notebook pequeno',1280,720,0),('notebook',1366,768,0),('notebook virado tablet',1366,768,1),('notebook grande',1536,864,0),('monitor',1920,1080,0),('monitor 2K',2560,1440,0)]
REP = [3, 8, 12, 15]  # iPhone, iPad em pé, notebook, monitor
TEL = [('inicio', ''), ('catalogo', '?r=tienda')]
CASOS = [(i, t, {}) for i in range(len(AP)) for t in TEL]
CASOS += [(i, t, {'tema': ev}) for ev in ('natal','halloween','bf','anonovo-d','anonovo-n','maes','pais') for i in REP for t in TEL]
CASOS += [(i, t, {'letra': z}) for z in (1, 2) for i in REP for t in TEL]
CASOS += [(i, t, {'lang': 'pt'}) for i in REP for t in TEL]
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def roda(N, K):
    from playwright.sync_api import sync_playwright
    OLHO = open(A + '../kit/olho.js').read(); res = []
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
        for n, (i, (tela, url), op) in enumerate(CASOS):
            if n % N != K: continue
            nome, W, H, tq = AP[i]; par = {}
            for modo in ('hoje', 'proposta'):
                try:
                    c = b.new_context(viewport={'width': W, 'height': H}, is_mobile=bool(tq) and W < 900, has_touch=bool(tq), locale='es-PY', service_workers='block')
                    ini = "sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','%s');" % op.get('lang', 'es')
                    if 'letra' in op: ini += "localStorage.setItem('lf_zoom','%d');" % op['letra']
                    c.add_init_script(ini); c.route('**/*', rota); pg = c.new_page(); pg.goto('http://localhost:8811/' + url); pg.wait_for_timeout(2600)
                    if 'tema' in op: pg.evaluate("e=>document.documentElement.setAttribute('data-ev',e)", op['tema']); pg.wait_for_timeout(400)
                    if modo == 'proposta': pg.add_style_tag(content=TOQUE if tq else MOUSE); pg.wait_for_timeout(500)
                    r = {}
                    def soma(tag):
                        for x in pg.evaluate(OLHO): r[x['r']] = max(r.get(x['r'], 0), x['n'])
                    if tela == 'inicio': pg.evaluate("()=>{const e=document.querySelector('.hsh');e&&e.scrollIntoView()}"); pg.wait_for_timeout(1300)
                    soma('a'); pg.mouse.move(W / 2, H * 0.6); pg.mouse.wheel(0, H * 0.7); pg.wait_for_timeout(1400); soma('b')
                    r['_cols'] = pg.evaluate("()=>{const f=s=>{const c=[...document.querySelectorAll(s)].filter(e=>e.getBoundingClientRect().width);if(!c.length)return 0;const t=c[0].getBoundingClientRect().top;return c.filter(e=>Math.abs(e.getBoundingClientRect().top-t)<3).length};return [f('#home .hg>*'),f('#grid .card')]}")
                    par[modo] = r; c.close()
                except Exception as e: par[modo] = {'_erro': str(e)[:120]}
            res.append({'ap': '%s %dx%d' % (nome, W, H), 'tela': tela, 'op': op, **par}); print(n, nome, tela, op, flush=True)
        b.close()
    json.dump(res, open(A + 'teste_%d.json' % K, 'w'), ensure_ascii=False)
if sys.argv[1] == 'junta':
    R = []
    for f in sorted(glob.glob(A + 'teste_*.json')): R += json.load(open(f))
    json.dump(R, open(A + 'teste.json', 'w'), ensure_ascii=False); pior = []; mel = 0; err = 0
    for x in R:
        h, p = x['hoje'], x['proposta']
        if '_erro' in h or '_erro' in p: err += 1; continue
        for k, v in p.items():
            if k.startswith('_'): continue
            if v > h.get(k, 0): pior.append((x['ap'], x['tela'], json.dumps(x['op'], ensure_ascii=False), k, h.get(k, 0), v))
        mel += sum(1 for k, v in h.items() if not k.startswith('_') and p.get(k, 0) < v)
    print(len(R), 'casos ·', err, 'com erro ·', mel, 'melhoras ·', len(pior), 'pioras')
    import collections; c = collections.Counter(k for *_, k, a, b2 in pior)
    print(dict(c))
    for x in pior: print(' ', x)
    print('COLUNAS', sorted({(x['ap'], x['tela'], tuple(x['hoje'].get('_cols', [])), tuple(x['proposta'].get('_cols', []))) for x in R if not x['op']}, key=lambda z: int(z[0].rsplit(' ', 1)[1].split('x')[0])))
else: roda(int(sys.argv[1]), int(sys.argv[2]))
