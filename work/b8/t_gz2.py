from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch();c=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True);pg=c.new_page()
    pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    pg.add_init_script("window.__ev=[];new MutationObserver(function(){var g=document.getElementById('gw');if(g&&!window.__g){window.__g=1;window.__ev.push(['gw criado',Math.round(performance.now()),getComputedStyle(document.documentElement).getPropertyValue('opacity'),document.documentElement.className])}}).observe(document,{childList:true,subtree:true})")
    pg.goto('http://localhost:8160/descubra-o-grau.html',wait_until='commit')
    for i in range(16):
        pg.wait_for_timeout(80);pg.screenshot(path='r%02d.png'%i)
    print(pg.evaluate("window.__ev"))
    b.close()
