import sys;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
porta=int(sys.argv[1])
with sync_playwright() as p:
    b,pg,er=base.abre(p,W=390,H=844);pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.add_init_script("sessionStorage.setItem('lf_ni','1')");pg.goto('http://localhost:%d/?r=armacoes'%porta);pg.wait_for_timeout(3000)
    for k in range(3):
        pg.evaluate("()=>{const L=[...document.querySelectorAll('[data-open]')].filter(x=>x.offsetParent);L[%d]&&L[%d].click()}"%(k,k));pg.wait_for_timeout(1200)
        a=pg.evaluate("()=>[!!document.querySelector('#layer .scrim'),document.activeElement&&(document.activeElement.className||document.activeElement.tagName)]")
        pg.keyboard.press('Escape');pg.wait_for_timeout(800)
        print(k,'aberta',a,'depois do Esc:',pg.evaluate("!!document.querySelector('#layer .scrim')"),pg.evaluate("document.documentElement.className.includes('lock')"))
    print(pg.evaluate("!!document.querySelector('#contabtn')&&getComputedStyle(document.querySelector('#contabtn')).visibility"),[x for x in er if 'Failed' not in x][:3]);b.close()
