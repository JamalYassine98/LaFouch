from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=3)
    pg.goto('http://localhost:8768/');pg.wait_for_timeout(2000)
    pg.evaluate("document.querySelector('[data-gzopen]').click()");pg.wait_for_timeout(5000)
    pg.query_selector('#gw .mochi').screenshot(path='s69/mochi_hoje.png')
    pg.click('#gw [data-gz=comeca]');pg.wait_for_timeout(5500)
    pg.query_selector('#gw .mochi').screenshot(path='s69/mochi_aponta.png')
    print(pg.evaluate("[...document.querySelectorAll('#gw .brE,#gw .brD')].map(e=>e.style.transform).join(' | ')"))
