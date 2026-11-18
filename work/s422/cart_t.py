import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
CONTA=json.dumps({'nome':'Maria González','email':'maria@exemplo.com','tel':'+595 983 000 000','nac':'py','doc':'1234567','ends':[]})
AUTH=json.dumps({'uid':'kit','idToken':'kit','refresh':'kit','exp':9e15,'ev':True,'email':'maria@exemplo.com'})
with sync_playwright() as p:
    b,pg,er=base.abre(p,W=390,H=844,ls={'lf_conta':CONTA,'lf_auth':AUTH})
    pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.goto('http://localhost:%s/'%sys.argv[1]);pg.wait_for_timeout(3000);pg.click('#contabtn');pg.wait_for_timeout(1200)
    pg.evaluate("()=>document.querySelectorAll('#layer .mct>button')[3].click()");pg.wait_for_timeout(6000)
    print(sys.argv[1],pg.evaluate("()=>{const m=document.getElementById('mtj');return m?m.innerText.slice(0,80):null}"))
    b.close()
