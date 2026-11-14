# S269 · medição por programa (sem olhar imagem) das propostas S265 e S267 em celular, tablet, notebook e monitor, claro e escuro:
# falhas novas do olho.js em relação a hoje e página mais larga que a tela.  python3 teste.py
import os, subprocess, sys, time, json
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
OLHO = open(A + '../kit/olho.js').read(); g5 = {}; s5 = open(A + '../s265/gera.py').read(); exec(s5[:s5.index('srv = subprocess')].replace('from PIL', '#from PIL').replace("F = lambda", "#F = lambda"), g5) if False else None
def pega(arq, nomes):
    s = open(A + arq).read(); o = {}
    for n in nomes:
        a = s.index(n + ' = """') + len(n) + 6; o[n] = s[a:s.index('"""', a)]
    return o
J5 = pega('../s265/gera.py', ['CSS', 'GUARDA', 'VENDAS', 'DINHEIRO', 'INICIO', 'PEND']); J7 = pega('../s267/gera.py', ['CAT', 'INV'])
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8854', '-d', A + '../../www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1); R = []
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    for nome, W, H in [x for x in (('celular', 390, 844), ('tablet', 820, 1180), ('notebook', 1366, 768), ('monitor', 2560, 1440)) if not os.environ.get('SO') or x[0] == os.environ['SO']]:
      for sc in ('light', 'dark'):
        res = {}
        for modo in ('hoje', 'prop'):
            c = b.new_context(viewport={'width': W, 'height': H}, color_scheme=sc, is_mobile=W < 700, has_touch=W < 1100, service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:60])); pg.goto('http://localhost:8854/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(600)
            ver = lambda v: (pg.evaluate("v=>window.__LF.setView(v)", v), pg.wait_for_timeout(800))
            med = lambda: ({x['r']: x['n'] for x in pg.evaluate(OLHO)}, pg.evaluate("document.documentElement.scrollWidth>innerWidth+1"))
            if modo == 'prop':
                pg.add_style_tag(content=J5['CSS'] + '.s7l{display:flex;align-items:center;justify-content:center;min-height:46px;width:100%;border:0;background:transparent;color:var(--fg,inherit);font:500 14px Inter,system-ui,sans-serif}')
                for v in ('hist', 'dash', 'desp', 'fx'): ver(v); pg.wait_for_timeout(700); pg.evaluate(J5['GUARDA'], v)
            for v, js in (('dia', 'VENDAS'), ('caixa', 'DINHEIRO'), ('inicio', 'INICIO'), ('notif', 'PEND')):
                ver(v)
                if modo == 'prop': pg.evaluate(J5[js]); pg.wait_for_timeout(300)
                res[v, modo] = med()
            for v, lista, js in (('vendas', '#vRows', 'CAT'), ('estoque', '#rows', 'INV')):
                ver(v); pg.evaluate("s=>document.querySelector(s+' .pcard[data-ref=SP58110]').click()", lista); pg.wait_for_timeout(1000)
                if modo == 'prop': pg.evaluate(J7[js]); pg.wait_for_timeout(300)
                res[v + '›peça', modo] = med()
            res['erros', modo] = er[:2]; c.close()
        for v in ('dia', 'caixa', 'inicio', 'notif', 'vendas›peça', 'estoque›peça'):
            h, p = res[v, 'hoje'], res[v, 'prop']; pior = {r: (h[0].get(r, 0), n) for r, n in p[0].items() if n > h[0].get(r, 0)}
            R.append((nome, sc, v, pior, p[1] and not h[1]))
        print(nome, sc, 'erros JS', res['erros', 'prop'], '· pioras:', {x[2]: x[3] for x in R if x[0] == nome and x[1] == sc and (x[3] or x[4])}, flush=True)
finally: srv.terminate()
os.environ.get('SO') or json.dump(R, open(A + 'teste.json', 'w'), ensure_ascii=False)
