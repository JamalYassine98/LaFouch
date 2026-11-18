# S414: roda os casos num navegador de verdade instalado na máquina do GitHub (Edge/Chrome no Windows, Safari/WebKit no Mac).
# uso: python desk.py <motor: msedge|chrome|webkit> <saida> <larguras ex 1366x768,1920x1080>
import sys, os, json, time
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from casos import CASOS, init_js
motor, OUT, tams = sys.argv[1], sys.argv[2], [tuple(map(int, t.split('x'))) for t in sys.argv[3].split(',')]
os.makedirs(OUT, exist_ok=True)
MED = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'medidas.js'), encoding='utf-8').read()
BLOQ = ('firestore.googleapis.com', 'identitytoolkit', 'securetoken', 'firebaseinstallations', 'google-analytics', 'googletagmanager', 'recaptcha')
res = []
with sync_playwright() as pw:
    b = pw.webkit.launch() if motor == 'webkit' else (pw.chromium.launch(executable_path=os.environ['EXE'], args=['--no-sandbox']) if os.environ.get('EXE') else pw.chromium.launch(channel=motor))
    print('navegador', motor, b.version, flush=True)
    for W, H in tams:
        for nome, tema, letra, alvo in CASOS:
            for v in ('hoje', 'prop'):
                c = b.new_context(viewport={'width': W, 'height': H}, locale='pt-BR', service_workers='block', has_touch=W < 1100, is_mobile=(W < 700 and motor != 'webkit') or None)
                c.route('**/*', lambda r: r.abort() if any(x in r.request.url for x in BLOQ) else r.continue_())
                c.add_init_script(init_js(tema, letra))
                pg = c.new_page(); er = []; pg.on('pageerror', lambda e: er.append(str(e)[:160]))
                try:
                    pg.goto('http://127.0.0.1:%d/' % (8000 if v == 'hoje' else 8001), wait_until='load'); pg.wait_for_timeout(2500)
                    if alvo:
                        if alvo == '#home .hc': pg.evaluate("()=>document.querySelector('#home .hc').scrollIntoView({block:'center'})"); pg.wait_for_timeout(500)
                        bx = pg.locator(alvo).first.bounding_box(); x, y = bx['x'] + bx['width'] / 2, bx['y'] + min(bx['height'] / 2, 60)
                        (pg.touchscreen.tap if W < 1100 else pg.mouse.click)(x, y); pg.wait_for_timeout(1800)
                    m = pg.evaluate(MED); m.update(caso=nome, versao=v, motor=motor, erros=er)
                    pg.screenshot(path=os.path.join(OUT, '%s-%d-%s-%s.png' % (motor, W, nome, v)))
                except Exception as e:
                    m = dict(caso=nome, versao=v, motor=motor, larg=W, falhou=str(e)[:200])
                print(json.dumps(m, ensure_ascii=False), flush=True); res.append(m); c.close()
    b.close()
json.dump(res, open(os.path.join(OUT, '%s-medidas.json' % motor), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
