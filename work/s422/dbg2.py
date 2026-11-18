import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b,pg,er=base.abre(p,W=390,H=844)
    pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.goto('http://localhost:8990/');pg.wait_for_timeout(3000);pg.click('#mnb');pg.wait_for_timeout(1200)
    print(pg.evaluate("()=>[...document.querySelectorAll('.seg')].map(s=>[s.closest('[id]')&&s.closest('[id]').id,!!s.__tk,!!s.offsetParent,s.getBoundingClientRect().width,s.querySelectorAll('button.on').length,typeof window.__lfTrilho])"))
    print([e for e in er if 'Failed' not in e][:5])
