# S226: HOJE × PROPOSTA nas 14 telas × 7 aparelhos: olho.js (parado e rolado) + toques < 44 + letras < 12 + altura do topo
import json, os, subprocess, sys, time
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from prop import CSS, JS
from playwright.sync_api import sync_playwright
VIEWS=['inicio','estoque','vendas','caixa','ped','clientes','hist','dash','dia','fx','desp','notif','ajustes']
AP=[('celular',390,844,'light',1),('celular escuro',390,844,'dark',1),('celular pequeno',320,568,'light',1),('tablet',820,1180,'light',1),('notebook',1366,768,'light',0),('monitor',1920,1080,'light',0),('monitor 2K',2560,1440,'light',0),('monitor 2K escuro',2560,1440,'dark',0)]
OLHO=open(A+'../kit/olho.js').read()
MED=r"""()=>{const W=innerWidth,H=innerHeight;const vis=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!='hidden'&&s.display!='none'&&+s.opacity>.05};
 const ctl=[...document.querySelectorAll('.view button,.view a[href],.view [data-act]')].filter(e=>vis(e)&&!e.disabled&&e.closest('.view').getBoundingClientRect().width);const z=parseFloat(getComputedStyle(document.documentElement).zoom)||1;
 const p=ctl.filter(e=>{const r=e.getBoundingClientRect();return Math.min(r.width,r.height)<43.5}).length;
 const t=[...document.querySelectorAll('.view *')].filter(e=>vis(e)&&[].some.call(e.childNodes,n=>n.nodeType===3&&n.textContent.trim())&&parseFloat(getComputedStyle(e).fontSize)<12).length;
 const v=[...document.querySelectorAll('.view')].find(vis);return {toque:p,letra:t,conteudoEm:v?Math.round(v.getBoundingClientRect().top+scrollY):0,larg:document.documentElement.scrollWidth>W+1?1:0}}"""
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
srv=subprocess.Popen([sys.executable,'-m','http.server',sys.argv[3],'-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1);out={}
i0,i1=int(sys.argv[1]),int(sys.argv[2])
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for n,W,H,sc,tq in AP[i0:i1]:
        R={}
        for modo in ('hoje','prop'):
            c=b.new_context(viewport={'width':W,'height':H},color_scheme=sc,is_mobile=W<700,has_touch=bool(tq),service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',rota)
            pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:60]));pg.goto('http://localhost:%s/index.html#test'%sys.argv[3]);pg.wait_for_function('window.__LF',timeout=15000);pg.wait_for_timeout(600)
            if modo=='prop': pg.add_style_tag(content=CSS);pg.evaluate(JS)
            for v in VIEWS:
                pg.evaluate("v=>window.__LF.setView(v)",v);pg.wait_for_timeout(1000);m=pg.evaluate(MED);o1={x['r']:x['n'] for x in pg.evaluate(OLHO)}
                pg.mouse.move(W/2,H/2);pg.mouse.wheel(0,500);pg.wait_for_timeout(700);o2={x['r']:x['n'] for x in pg.evaluate(OLHO)};R[v,modo]={'m':m,'p':o1,'r':o2}
            c.close()
        tot={k:[sum(R[v,mo]['m'][k] for v in VIEWS) for mo in ('hoje','prop')] for k in ('toque','letra','larg')}
        pior=[(v,q,rr,R[v,'hoje'][q].get(rr,0),R[v,'prop'][q].get(rr,0)) for v in VIEWS for q in 'pr' for rr in set(R[v,'hoje'][q])|set(R[v,'prop'][q]) if R[v,'prop'][q].get(rr,0)>R[v,'hoje'][q].get(rr,0)]
        mel=sum(1 for v in VIEWS for q in 'pr' for rr in set(R[v,'hoje'][q]) if R[v,'prop'][q].get(rr,0)<R[v,'hoje'][q].get(rr,0))
        print('%-18s toques<44 %3d→%3d | letras<12 %3d→%3d | conteúdo começa em %d→%d px | olho: melhoras %d, pioras %d %s'%(n,tot['toque'][0],tot['toque'][1],tot['letra'][0],tot['letra'][1],R['estoque','hoje']['m']['conteudoEm'],R['estoque','prop']['m']['conteudoEm'],mel,len(pior),pior[:6]),flush=True)
        out[n]={'%s|%s'%k:v for k,v in R.items()}
finally: srv.terminate()
json.dump(out,open(A+'teste_%d.json'%i0,'w'),ensure_ascii=False)
