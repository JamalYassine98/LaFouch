import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
DOC=json.dumps({'fields':{'evento':{'mapValue':{'fields':{'tema':{'stringValue':'natal'},'ini':{'integerValue':'0'},'fim':{'integerValue':'0'}}}}}})
def rota(r):
    u=r.request.url
    if 'config/site' in u: return r.fulfill(status=200,content_type='application/json',body=DOC)
    return r.continue_() if u.startswith('http://localhost') else r.abort()
with sync_playwright() as p:
    b,pg,er=base.abre(p,W=420,H=850);pg.context.route('**/*',rota)
    pg.goto('http://localhost:8996/_pai_teste.html');pg.wait_for_timeout(4000)
    f=pg.frame_locator('#f');fr=pg.frames[1]
    print('data-ev no modo loja:',fr.evaluate("document.documentElement.getAttribute('data-ev')"),'lojamodo:',fr.evaluate("document.documentElement.classList.contains('lojamodo')"))
    print([e for e in er if 'Failed' not in e][:4])
