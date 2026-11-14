# S250 · conferência da implementação: antes (v507) × depois (v508) em celular, tablet, PC 1366 e 2560, claro e escuro, 13 telas. Erros de JS, estouro de largura, olho.js.  python3 confere.py
import os, subprocess, sys, time, json
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
OLHO = open(A + '../kit/olho.js').read()
VS = ['inicio','estoque','vendas','caixa','ped','clientes','hist','dash','dia','fx','desp','notif','ajustes']
s1 = subprocess.Popen([sys.executable,'-m','http.server','8841','-d','/tmp/www507/www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True)
s2 = subprocess.Popen([sys.executable,'-m','http.server','8842','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True); time.sleep(1)
pior = []; erros = []; est = []
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    for W, H in ((390, 844), (820, 1180), (1366, 768), (2560, 1440)):
        for sc in ('light', 'dark'):
            ol = {}
            for modo, porta in (('antes', 8841), ('depois', 8842)):
                c = b.new_context(viewport={'width': W, 'height': H}, color_scheme=sc, is_mobile=W < 700, has_touch=W < 1100, service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
                pg = c.new_page(); pg.on('pageerror', lambda e, m=modo, w=W: erros.append((m, w, str(e)[:120]))); pg.goto('http://localhost:%d/index.html#test' % porta); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(700)
                for v in VS:
                    pg.evaluate("v=>window.__LF.setView(v)", v); pg.wait_for_timeout(750)
                    ol[v, modo, 0] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}
                    if pg.evaluate("document.documentElement.scrollWidth>innerWidth+1"): est.append((modo, W, sc, v))
                    pg.evaluate("scrollBy(0,600)"); pg.wait_for_timeout(250); ol[v, modo, 1] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; pg.evaluate("scrollTo(0,0)")
                    if modo == 'depois' and v in ('inicio', 'estoque', 'caixa') and sc == 'dark' or (modo == 'depois' and v == 'ajustes' and sc == 'light'): pg.screenshot(path='/tmp/s250_%d_%s_%s.png' % (W, sc, v))
                c.close()
            for v in VS:
                for k in (0, 1):
                    for r, n in ol[v, 'depois', k].items():
                        if n > ol[v, 'antes', k].get(r, 0): pior.append((W, sc, v, 'rolado' if k else 'parado', r, ol[v, 'antes', k].get(r, 0), n))
            print(W, sc, 'ok', flush=True)
finally: s1.terminate(); s2.terminate()
print('ERROS JS:', erros); print('ESTOURO:', est); print('PIORAS OLHO (%d):' % len(pior))
for p in pior: print('  ', p)
