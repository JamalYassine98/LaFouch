from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':390,'height':1300},device_scale_factor=2)
    pg.goto('http://localhost:8811/index.html#test');pg.wait_for_function('window.__LF',timeout=15000);pg.wait_for_timeout(6000)
    pg.evaluate("()=>{const S=window.__LF.S;S.pnlRes={msg:2,ata:1,av:3,prox:{nm:'Black Friday CDE',ini:Date.now()+7.5*864e5,fim:Date.now()+10*864e5}};S.view='inicio';window.__LF.render()}");pg.wait_for_timeout(800)
    pg.screenshot(path='app_ini.png');b.close()
