import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
exec(open('t_bug.py').read().split('EST=')[0].split("U='")[0])
CONTA=json.dumps({'nome':'Maria González','email':'maria@exemplo.com','tel':'+595 983 000 000','nac':'py','doc':'1234567','ends':[]})
AUTH=json.dumps({'uid':'kit','idToken':'kit','refresh':'kit','exp':9e15,'ev':True,'email':'maria@exemplo.com'})
with sync_playwright() as p:
    b,pg,er=base.abre(p,W=390,H=844,ls={'lf_conta':CONTA,'lf_auth':AUTH})
    pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.goto('http://localhost:8990/');pg.wait_for_timeout(3000);pg.click('#contabtn');pg.wait_for_timeout(1200)
    n=int(sys.argv[1]);gap=int(sys.argv[2])
    pg.evaluate("([n,g])=>{const b=()=>document.querySelectorAll('#layer .mct>button');let k=0;const f=()=>{const L=b();if(!L.length)return;L[(k*7)%L.length].click();if(++k<n)setTimeout(f,g)};f()}",[n,gap]);pg.wait_for_timeout(2500)
    print(pg.evaluate("""()=>{const m=document.querySelector('#layer .mct'),T=m.__tk;return {T:[T.c.x,T.c.w,T.anim,T.sel,T.drag],m:T.m.map(x=>[x.x,x.w]),olds:[...document.querySelectorAll('.mcOld')].map(o=>[o.parentNode.className,o.parentNode.tagName,o.getAnimations().map(a=>a.playState)]),conn:m.isConnected}}"""))
    b.close()
