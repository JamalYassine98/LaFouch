from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':900,'height':1100})
    pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    pg.add_init_script("localStorage.setItem('lf_gzmudo','1')")
    pg.goto('http://localhost:8160/');pg.wait_for_timeout(2500);pg.evaluate("window.__lfGzAbre()");pg.wait_for_timeout(4000)
    print(pg.evaluate("""(()=>{const m=__LFGZ.Z.m.el;const out=[];const w=(e,d)=>{if(d>9)return;if(e.tagName==='defs')return;out.push('  '.repeat(d)+e.tagName+(e.id?'#'+e.id:'')+(e.getAttribute&&e.getAttribute('class')?'.'+e.getAttribute('class'):'')+' '+(e.children.length));[...e.children].slice(0,30).forEach(c=>w(c,d+1))};w(m,0);return out.join('\\n')})()"""))
    b.close()
