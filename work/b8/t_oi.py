from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    for lg in ('pt','es'):
        c=b.new_context(viewport={'width':390,'height':844});c.add_init_script("localStorage.setItem('lf_lang','%s');window.__v=[];var P=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.__v.push(this.src.split('/').pop());return P.call(this)}"%lg)
        pg=c.new_page();pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
        pg.goto('http://localhost:8160/');pg.wait_for_timeout(2500);pg.evaluate("window.__lfGzAbre()");pg.wait_for_timeout(2500)
        print(lg,pg.evaluate("document.getElementById('gzbal').innerText"),pg.evaluate("window.__v.slice(0,3)"))
        c.close()
    b.close()
