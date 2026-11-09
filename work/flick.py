import time
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    ctx=b.new_context(viewport={'width':390,'height':844},locale='pt-BR')
    pg=ctx.new_page()
    pg.goto('http://localhost:8765/index.html'); pg.wait_for_timeout(2500)
    # abre o catálogo como o cliente
    pg.evaluate("()=>{try{openPanel&&openPanel('catalogo')}catch(e){}}")
    pg.goto('http://localhost:8765/?ref=AC1050',wait_until='commit')
    t0=time.time()
    for i in range(22):
        pg.screenshot(path=f'fl/f{i:02d}.png'); 
        print(i, round((time.time()-t0)*1000), pg.evaluate("()=>location.pathname+location.search+' | '+document.title.slice(0,30)") if i%3==0 else '')
        pg.wait_for_timeout(60)
