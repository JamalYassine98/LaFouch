from playwright.sync_api import sync_playwright
exec(open('s57/col.py').read().split('M="document')[0])
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for k in [1,2]:
        pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='es-PY',device_scale_factor=2)
        pg.add_init_script(FONTE%(k,))
        pg.goto('http://localhost:8768/');pg.wait_for_timeout(2600)
        pg.evaluate("document.getElementById('hguia').scrollIntoView()");pg.wait_for_timeout(900)
        print(k,pg.evaluate('document.documentElement.scrollWidth'),pg.evaluate("[...document.querySelectorAll('.hgu button')].map(b=>Math.round(b.getBoundingClientRect().right)).join(',')"))
        pg.screenshot(path='s65/guia_dep_k%d.png'%k)
