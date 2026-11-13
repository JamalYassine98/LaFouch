import sys
from prop import css, JS
from playwright.sync_api import sync_playwright
W,H,passos,nome=int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]),sys.argv[4]
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<900,has_touch=True,locale='es-PY',service_workers='block');c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',rota)
    pg=c.new_page();pg.goto('http://localhost:8811/');pg.wait_for_timeout(2600);pg.add_style_tag(content=css(W));pg.evaluate(JS);pg.mouse.move(W/2,H*.6)
    for p in range(passos): pg.mouse.wheel(0,H*.3);pg.wait_for_timeout(1700)
    pg.wait_for_timeout(1200);pg.screenshot(path='/tmp/'+nome+'.png');c.close()
