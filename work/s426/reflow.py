# acha QUEM força o navegador a arrumar a tela (layout forçado) ao tocar: rastro do Chrome com a pilha de cada layout
import sys,json,collections;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
SRC=open('/tmp/s426/js/lf-site.js',encoding='utf8').read().split('\n')
acoes=sys.argv[1].split(',')
with sync_playwright() as p:
    b,pg,er=base.abre(p,W=390,H=844);pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.add_init_script("sessionStorage.setItem('lf_ni','1')")
    pg.goto('http://localhost:8999/');pg.wait_for_timeout(3500)
    cdp=pg.context.new_cdp_session(pg);ev=[]
    cdp.on('Tracing.dataCollected',lambda d:ev.extend(d['value']))
    cdp.send('Tracing.start',{'categories':'devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.stack','transferMode':'ReportEvents'})
    for a in acoes:
        if a=='peca':pg.evaluate("()=>{const L=[...document.querySelectorAll('[data-open]')].filter(x=>x.offsetParent);L[0].click()}")
        elif a=='esc':pg.keyboard.press('Escape')
        elif a=='conta':pg.click('#contabtn')
        elif a=='bag':pg.click('#bagbtn')
        elif a=='filtro':pg.evaluate("()=>{location.hash='';}")
        pg.wait_for_timeout(1500)
    done=[False];cdp.on('Tracing.tracingComplete',lambda d:done.__setitem__(0,True));cdp.send('Tracing.end')
    for i in range(50):
        if done[0]:break
        pg.wait_for_timeout(200)
    agg=collections.defaultdict(lambda:[0,0.0])
    for e in ev:
        if e.get('name')=='Layout' and e.get('ph') in ('X','B'):
            st=((e.get('args') or {}).get('beginData') or {}).get('stackTrace') or []
            if not st:continue
            fr=[f for f in st if 'lf-site' in f.get('url','')]
            if not fr:continue
            f=fr[0];k=(f.get('functionName') or '?',f.get('lineNumber'),f.get('columnNumber'))
            agg[k][0]+=1;agg[k][1]+=(e.get('dur') or 0)/1000
    for k,v in sorted(agg.items(),key=lambda x:-x[1][1])[:12]:
        ln=SRC[k[1]] if k[1] is not None and k[1]<len(SRC) else '';col=k[2] or 0
        print('%6.1f ms %2dx  %s linha %s  …%s…'%(v[1],v[0],k[0],k[1]+1 if k[1] is not None else '?',ln[max(0,col-90):col+60]))
    b.close()
