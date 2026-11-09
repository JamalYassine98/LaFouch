from playwright.sync_api import sync_playwright
exec(open('s46/nav.py').read().split('CEN=')[0])
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for w,z,n in [(320,1.3,'a'),(390,1,'b'),(430,1,'c')]:
        pg=b.new_page(viewport={'width':w,'height':700},is_mobile=True,has_touch=True,locale='pt-BR',device_scale_factor=2)
        pg.goto('http://localhost:8768/');pg.wait_for_timeout(2300)
        if z!=1: pg.evaluate("document.documentElement.style.fontSize='%d%%'"%(z*100))
        pg.evaluate("document.querySelector('a[href=\"#vitrine\"]').click()");pg.wait_for_timeout(900)
        pg.evaluate(M);pg.wait_for_timeout(800);pg.evaluate(item('Atacado'));pg.wait_for_timeout(1300)
        pg.screenshot(path='s46/pn_%s.png'%n)
