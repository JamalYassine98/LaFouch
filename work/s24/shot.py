import sys
from playwright.sync_api import sync_playwright
url=sys.argv[1]; out=sys.argv[2]; js=sys.argv[3] if len(sys.argv)>3 else ''
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
    pg.on('console',lambda m: print('C:',m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8767'+url); pg.wait_for_timeout(3500)
    if js: print(pg.evaluate(js)); pg.wait_for_timeout(800)
    pg.screenshot(path=out)
