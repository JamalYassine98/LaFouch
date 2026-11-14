import subprocess, sys, time
from playwright.sync_api import sync_playwright
from PIL import Image
OLHO = open('/home/claude/lafouch/work/kit/olho.js').read(); ims = []
for nome, pasta in (('antes', '/tmp/www_old/www'), ('agora', '/home/claude/lafouch/www')):
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8887', '-d', pasta], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
    try:
        with sync_playwright() as pw:
            b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
            for W, H, sc in ((390, 844, 'light'), (390, 844, 'dark'), (820, 1180, 'light'), (1366, 768, 'light'), (2560, 1440, 'dark')):
                c = b.new_context(viewport={'width': W, 'height': H}, color_scheme=sc, is_mobile=W < 700, has_touch=W < 1100, service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
                pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:80])); pg.goto('http://localhost:8887/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(600); o = {}
                for v in ('inicio', 'notif'):
                    pg.evaluate("v=>window.__LF.setView(v)", v); pg.wait_for_timeout(800); o[v] = ({x['r']: x['n'] for x in pg.evaluate(OLHO)}, pg.evaluate("document.documentElement.scrollWidth>innerWidth+1"))
                    if nome == 'agora' and W == 390: pg.screenshot(path='/tmp/s274.png'); ims.append(Image.open('/tmp/s274.png').convert('RGB'))
                if nome == 'agora' and W == 390 and sc == 'light':
                    print('  pendências:', pg.evaluate("[...document.querySelectorAll('#v-notif .lbl')].map(e=>e.textContent).join(' | ')"), '· cartões:', pg.evaluate("[...document.querySelectorAll('#v-notif .card b')].map(e=>e.textContent.slice(0,34)).slice(0,9).join(' | ')"))
                    pg.evaluate("window.__LF.setView('inicio')"); pg.wait_for_timeout(600); pg.evaluate("document.querySelector('#v-inicio .guard1').click()"); pg.wait_for_timeout(800); print('  toque na linha →', pg.evaluate("window.__LF.S.view"))
                    pg.evaluate("document.querySelector('.ntGd').click()"); pg.wait_for_timeout(800); print('  conferências:', pg.evaluate("(()=>{const j=[...document.querySelectorAll('.guardI')];return j.length+' linhas, silenciar: '+document.querySelectorAll('.gMudo').length})()"))
                print(nome, W, sc, o, er[:1], flush=True); c.close()
    finally: srv.terminate(); time.sleep(.5)
B = Image.new('RGB', (4 * 400, 854), 'white')
for i, im in enumerate(ims[:4]): B.paste(im, (i * 400, 0))
B.save('/tmp/s274.jpg', quality=78)
