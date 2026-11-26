from playwright.sync_api import sync_playwright
def abre(p):
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=1.5,locale='pt-BR')
    pg.goto('http://localhost:8765/index.html',wait_until='domcontentloaded'); pg.wait_for_timeout(6000)
    pg.evaluate("['fsh','manut'].forEach(i=>{const e=document.getElementById(i); if(e) e.remove()}); document.body.style.overflow='auto'; document.documentElement.style.overflow='auto'")
    pg.wait_for_timeout(800); return b,pg
