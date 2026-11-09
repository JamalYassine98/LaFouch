from playwright.sync_api import sync_playwright
import sys
JS=sys.argv[1] if len(sys.argv)>1 else ''
OUT=sys.argv[2] if len(sys.argv)>2 else 'menu_hoje.png'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
    pg.goto('http://localhost:8768/');pg.wait_for_timeout(2500)
    pg.evaluate("document.querySelector('[data-dopen],#mbtn,.bar [aria-label*=enu]').click()");pg.wait_for_timeout(1300)
    if JS: print(pg.evaluate(JS));pg.wait_for_timeout(500)
    pg.screenshot(path=OUT)
