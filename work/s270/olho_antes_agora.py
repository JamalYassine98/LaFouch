import subprocess, sys, time
from playwright.sync_api import sync_playwright
OLHO = open('/home/claude/lafouch/work/kit/olho.js').read()
for nome, pasta in (('antes', '/tmp/www_old/www'), ('agora', '/home/claude/lafouch/www')):
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8882', '-d', pasta], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
    try:
        with sync_playwright() as pw:
            b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
            for W, H in ((390, 844), (820, 1180), (1366, 768), (2560, 1440)):
                c = b.new_context(viewport={'width': W, 'height': H}, is_mobile=W < 700, has_touch=W < 1100, service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
                pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:60])); pg.goto('http://localhost:8882/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(600); o = {}
                for v, lista in (('vendas', '#vRows'), ('estoque', '#rows')):
                    pg.evaluate("v=>window.__LF.setView(v)", v); pg.wait_for_timeout(800); pg.evaluate("s=>document.querySelector(s+' .pcard[data-ref=SL2201]').click()", lista); pg.wait_for_timeout(1000)
                    o[v] = ({x['r']: x['n'] for x in pg.evaluate(OLHO)}, pg.evaluate("document.documentElement.scrollWidth>innerWidth+1"))
                pg.evaluate("window.__LF.setView('inicio')"); pg.wait_for_timeout(600); o['inicio'] = ({x['r']: x['n'] for x in pg.evaluate(OLHO)}, pg.evaluate("document.documentElement.scrollWidth>innerWidth+1"))
                print(nome, W, o, er[:1], flush=True); c.close()
    finally: srv.terminate(); time.sleep(.5)
