from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=3)
    pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    pg.add_init_script("localStorage.setItem('lf_gzmudo','1')")
    pg.goto('http://localhost:8160/?evp=maes');pg.wait_for_timeout(2500);pg.evaluate("window.__lfGzAbre()");pg.wait_for_timeout(5000)
    el=pg.evaluate_handle("__LFGZ.Z.m.el");el.as_element().screenshot(path='site_maes.png')
    pg.evaluate("window.scrollTo(0,0)");pg.screenshot(path='site_home_maes.png')
    b.close()
