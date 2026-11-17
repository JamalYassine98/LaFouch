import sys,subprocess,time,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
porta=int(sys.argv[1]) if sys.argv[1:] else 8852
W=int(sys.argv[2]) if sys.argv[2:] else 390
with sync_playwright() as p:
    b,pg,er=base.abre(p,W=W,H=844,ls={'t_perm':'granted'});pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.add_init_script("sessionStorage.setItem('lf_ni','1');Math.random=()=>0.42");pg.goto('http://localhost:%d/'%porta);w=pg.wait_for_timeout;w(3500)
    pg.evaluate("()=>{window.__dist=30;window.__lfGzAbre()}");w(2500);pg.click('#gzcom');pg.wait_for_function("()=>__LFGZ.Z.fase==='teste'",timeout=70000);w(3000)
    pg.evaluate('()=>{__LFGZ.Z.falando=0;__LFGZ.pp(2)}')
    for k in range(9):
        w(1000);print(k,pg.evaluate("""()=>{const r=e=>{const x=document.querySelector(e);if(!x)return null;const b=x.getBoundingClientRect();return [Math.round(b.top),Math.round(b.bottom),Math.round(b.left),Math.round(b.right)]};return {bal:r('#gzbal'),fw:r('#gzfw'),fita:r('#gzfita'),txt:(document.querySelector('#gzbal')||{}).innerText.slice(0,30)}}"""))
    pg.screenshot(path='/tmp/m107.png');b.close()
