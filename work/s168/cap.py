from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':900,'height':1100},device_scale_factor=3)
    pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    pg.add_init_script("localStorage.setItem('lf_gzmudo','1')")
    pg.goto('http://localhost:8160/');pg.wait_for_timeout(2500);pg.evaluate("window.__lfGzAbre()");pg.wait_for_timeout(6000)
    for i in range(6):
        pg.evaluate("(()=>{const m=__LFGZ.Z.m;document.getElementById('gw').style.background='transparent';document.body.style.background='transparent';document.documentElement.style.background='transparent';[...document.querySelectorAll('#gw > *:not(#gzstg), #gzstg > *')].forEach(e=>{if(!e.contains(m.el))e.style.visibility='hidden'});m.el.style.visibility='visible'})()")
        pg.locator('#gw').evaluate("e=>0");pg.wait_for_timeout(700)
        el=pg.evaluate_handle("__LFGZ.Z.m.el");el.as_element().screenshot(path=f'm{i}.png',omit_background=True)
    b.close()
