# mede no simulador (processador 4× mais lento, como celular) quem força "arrumar a tela" na Mochi e no catálogo; mostra o trecho do código
import sys,json,collections;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
SRC=open('/tmp/s426/js/lf-site.js',encoding='utf8').read()
INIT="""window.__lo=[];try{new PerformanceObserver(l=>l.getEntries().forEach(e=>__lo.push({ms:e.duration,s:(e.scripts||[]).map(x=>({fn:x.sourceFunctionName,pos:x.sourceCharPosition,url:(x.sourceURL||'').split('/').pop(),ms:x.duration,lay:x.forcedStyleAndLayoutDuration,inv:x.invoker}))}))).observe({type:'long-animation-frame',buffered:true})}catch(e){}"""
cena=sys.argv[1]
with sync_playwright() as p:
    b,pg,er=base.abre(p,W=390,H=844,ls={'t_perm':'granted'});pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.add_init_script("sessionStorage.setItem('lf_ni','1')");pg.add_init_script(INIT)
    cdp=pg.context.new_cdp_session(pg)
    pg.goto(('http://localhost:%s/'%(sys.argv[2] if len(sys.argv)>2 else '8999'))+('?r=armacoes' if cena=='cat' else ''));pg.wait_for_timeout(3500)
    cdp.send('Emulation.setCPUThrottlingRate',{'rate':4});pg.evaluate("__lo.length=0")
    if cena=='mochi':
        pg.evaluate("()=>{window.__dist=30;window.__lfGzAbre()}");pg.wait_for_timeout(3000);pg.click('#gzcom')
        pg.wait_for_function("()=>__LFGZ.Z.fase==='teste'",timeout=120000);pg.wait_for_timeout(2000)
        for i in range(6):
            try:pg.wait_for_function("()=>!!document.querySelector('#gw [data-gz=sim]')&&!__LFGZ.Z.falando&&!__LFGZ.Z.ocupado",timeout=40000);pg.click('#gw [data-gz=sim]')
            except Exception as e:print('x',str(e)[:60])
            pg.wait_for_timeout(1500)
    elif cena=='cat':
        for k in range(3):
            pg.evaluate("()=>{const b=[...document.querySelectorAll('[data-mf],.chip,button')].filter(x=>/Oval|Redondo|Quadrado|Unissex|Feminino/.test(x.innerText)&&x.offsetParent)[%d];b&&b.click()}"%k);pg.wait_for_timeout(1500)
        for k in range(3):pg.evaluate("()=>{const L=[...document.querySelectorAll('[data-open]')].filter(x=>x.offsetParent);L[%d]&&L[%d].click()}"%(k,k));pg.wait_for_timeout(1200);pg.keyboard.press('Escape');pg.wait_for_timeout(800)
        pass
    L=pg.evaluate("__lo");agg=collections.defaultdict(lambda:[0,0,0])
    for e in L:
        for s in e['s']:
            if s['url'].startswith('lf-site.js') and s['ms']>=8:
                k=(s['fn'] or '?',s['pos'],s['inv'][:40]);agg[k][0]+=1;agg[k][1]+=s['ms'];agg[k][2]+=s['lay']
    print('quadros longos',len(L),'soma',round(sum(e['ms'] for e in L)))
    for k,v in sorted(agg.items(),key=lambda x:-x[1][1])[:12]:
        pos=k[1];ln=SRC[:pos].count('\n')+1 if pos and pos>0 else 0
        print('%5d ms %2dx lay %4d  %s  linha %d  %s'%(v[1],v[0],v[2],k[0],ln,SRC[max(0,pos-60):pos+90].replace('\n',' ') if pos and pos>0 else k[2]))
    b.close()
