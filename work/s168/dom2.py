from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':900,'height':1100})
    pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    pg.add_init_script("localStorage.setItem('lf_gzmudo','1')")
    pg.goto('http://localhost:8160/');pg.wait_for_timeout(2500);pg.evaluate("window.__lfGzAbre()");pg.wait_for_timeout(4000)
    print(pg.evaluate("""(()=>{const r=__LFGZ.Z.m.el.querySelector('g.resp');return [...r.querySelectorAll(':scope > path, g.aBe path, g.aBd path, g.aFe path, g.aFd path, g.bW path, g.bF path')].map(e=>(e.parentNode.getAttribute('class')||'')+'>'+(e.getAttribute('class')||'')+' fill='+e.getAttribute('fill')+' stroke='+e.getAttribute('stroke')+' sw='+e.getAttribute('stroke-width')+' op='+(e.getAttribute('opacity')||'')+' d='+(e.getAttribute('d')||'').slice(0,40)).join('\\n')})()"""))
    print(pg.evaluate("[...__LFGZ.Z.m.el.querySelectorAll('g.resp > g')].map(g=>g.getAttribute('class')+':'+getComputedStyle(g).opacity+'/'+getComputedStyle(g).display).join(' ')"))
    b.close()
