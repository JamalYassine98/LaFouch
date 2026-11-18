import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
exec(open('t_trilho.py').read().split('GRAVA=')[0].split('porta=')[0])
CONTA=json.dumps({'nome':'Maria','email':'m@e.com','tel':'+595 983 000 000','nac':'py','doc':'1234567','ends':[]})
AUTH=json.dumps({'uid':'kit','idToken':'kit','refresh':'kit','exp':9e15,'ev':True,'email':'m@e.com'})
W=int(sys.argv[1]);lang=sys.argv[2]
with sync_playwright() as p:
    b,pg,er=base.abre(p,lang=lang,W=W,H=900,ls={'lf_conta':CONTA,'lf_auth':AUTH,'lf_lang':'es' if lang.startswith('es') else 'pt'})
    pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.goto('http://localhost:8990/');pg.wait_for_timeout(3000);pg.click('#contabtn');pg.wait_for_timeout(1300)
    pg.evaluate("()=>{window.__m0=document.querySelector('#layer .mct')}")
    for i in [1,2,3,0,2,1]:
        pg.evaluate("i=>document.querySelectorAll('#layer .mct>button')[i].click()",i);pg.wait_for_timeout(700)
        print(i,pg.evaluate("()=>{const m=document.querySelector('#layer .mct');const r=m===window.__m0;window.__m0=m;return [r,!!m.__tk,m.__tk&&m.__tk.sel,document.querySelectorAll('#layer .mct').length]}"))
    print(pg.evaluate("()=>window.__tkd"));print([e for e in er if 'Failed' not in e][:5])
