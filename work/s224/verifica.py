# S224: HOJE × PROPOSTA pelo olho.js (parado e depois de rolar) + contraste dos pontos corrigidos.  python3 testa.py i0 i1 [letra]
import sys, json, os
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from prop import CSS, JS
from playwright.sync_api import sync_playwright
TEMAS=['padrao','natal','halloween','bf','anonovo-d','anonovo-n','maes','pais']
OLHO=open(A+'../kit/olho.js').read()
ABRE="()=>{const c=document.querySelector('#grid .card .open');c&&c.click()}"
CT=r"""()=>{const P=c=>(String(c).match(/[\d.]+/g)||[]).map(Number),L=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])},C=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
 const bgs=e=>{for(let x=e;x;x=x.parentElement){const s=getComputedStyle(x);const g=((s.backgroundImage.match(/linear-gradient\((?:[^()]|\([^()]*\))*\)/g)||[]).join(' ').match(/rgba?\([^)]+\)/g)||[]).map(P).filter(c=>c.length<4||c[3]>.5);if(g.length)return g;const c=P(s.backgroundColor);if(c.length<4||c[3]>.5)return [c]}return [[255,255,255]]};
 let n=0,ruins=[],min=99;document.querySelectorAll('a,button,span,b,i,p,div,small,strong,em,h1,h2,h3,li,svg').forEach(e=>{const r=e.getBoundingClientRect();if(!r.width||r.top>innerHeight*4)return;const sv=e.tagName=='svg';if(!sv&&![].some.call(e.childNodes,x=>x.nodeType===3&&x.textContent.trim()))return;if(sv&&!e.closest('.top'))return;const s=getComputedStyle(e);if(s.visibility=='hidden'||+s.opacity<.5)return;const c=Math.min(...bgs(e).map(x=>C(P(s.color),x)));n++;const lim=sv?3:(parseFloat(s.fontSize)>=24||(parseFloat(s.fontSize)>=18.5&&+s.fontWeight>=700)?3:4.5);if(c<lim){ruins.push((sv?'ícone '+(e.closest('button')||e).id:e.textContent.trim().slice(0,16))+' '+c.toFixed(2))}min=Math.min(min,c)});return {n,ruins:[...new Set(ruins)]}}"""
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
i0,i1=int(sys.argv[1]),int(sys.argv[2]);z='0';out={}
import glob
ANT={}
[ANT.update(json.load(open(f))) for f in glob.glob(A+'teste_*_0.json')]
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for t in TEMAS[i0:i1]:
        for W,H in ((390,844),(768,1024),(1366,768)) if z=='0' else ((390,844),):
            c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<900,has_touch=W<1100,locale='es-PY',service_workers='block');c.add_init_script("sessionStorage.setItem('lf_ni','1');try{localStorage.setItem('lf_zoom','%s')}catch(_){}"%z);c.route('**/*',rota)
            for tela,url,ac in (('inicio','',None),('catalogo','?r=tienda',None),('peca','?r=tienda',ABRE)):
                r={}
                for modo in ('real',):
                    pg=c.new_page();pg.goto('http://localhost:8811/'+url);pg.wait_for_timeout(2200)
                    if t!='padrao': pg.evaluate("t=>document.documentElement.setAttribute('data-ev',t)",t)
                    if ac: pg.evaluate(ac)
                    pg.wait_for_timeout(700)
                    pass
                    pg.wait_for_timeout(900);o1={x['r']:x['n'] for x in pg.evaluate(OLHO)};ct=pg.evaluate(CT)
                    pg.mouse.move(W/2,H*.6);pg.mouse.wheel(0,500);pg.wait_for_timeout(1500);o2={x['r']:x['n'] for x in pg.evaluate(OLHO)}
                    r[modo]={'parado':o1,'rolado':o2,'contraste':ct};pg.close()
                k='%s|%d|%s'%(t,W,tela);out[k]=r;h=ANT[k]['hoje'];n=r['real']
                pior=[(q,rr,h[q].get(rr,0),n[q].get(rr,0)) for q in ('parado','rolado') for rr in set(h[q])|set(n[q]) if n[q].get(rr,0)>h[q].get(rr,0)]
                print('%-10s %4d %-8s contraste ruim antes %2d → agora %2d %s | pioras olho %s'%(t,W,tela,len(h['contraste']['ruins']),len(n['contraste']['ruins']),[x for x in n['contraste']['ruins'] if 'Comprar' not in x and '· Gs' not in x][:4],pior),flush=True)
            c.close()
json.dump(out,open(A+'real_%d.json'%i0,'w'),ensure_ascii=False)
