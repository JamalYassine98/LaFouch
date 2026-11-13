from playwright.sync_api import sync_playwright
import sys
JS="""(band)=>{const W=innerWidth,H=innerHeight,y0=H-band[0]-band[1],y1=H-band[0];const o=[];
document.querySelectorAll('body *').forEach(e=>{if(e.closest('a.wa')||e.closest('.top'))return;const s=getComputedStyle(e);if(s.visibility=='hidden'||s.display=='none'||+s.opacity===0)return;
const txt=[].some.call(e.childNodes,n=>n.nodeType===3&&n.textContent.trim());const cl=/^(BUTTON|A|IMG|INPUT|SELECT|TEXTAREA|svg|VIDEO|CANVAS)$/i.test(e.tagName);if(!txt&&!cl)return;
let r=e.getBoundingClientRect();if(txt&&!cl){const g=document.createRange();g.selectNodeContents(e);r=g.getBoundingClientRect()}
if(!r.width||r.bottom<=y0||r.top>=y1||r.left>=W||r.right<=0)return;
// só conta se o ponto está de fato visível ali (não cortado por overflow)
const px=Math.min(r.right,W)-2,py=Math.max(y0,Math.min(y1,(Math.max(r.top,y0)+Math.min(r.bottom,y1))/2));const w=document.querySelector('a.wa');const pe=w.style.pointerEvents;w.style.pointerEvents='none';const h=document.elementFromPoint(px,py);w.style.pointerEvents=pe;
if(!h||!(h===e||e.contains(h)||h.contains(e)&&h.closest('a,button')===e.closest('a,button')&&e.closest('a,button')))return;
o.push([Math.round(W-Math.min(r.right,W)),e.tagName+'.'+String(e.className.baseVal??e.className).split(' ')[0]+(e.id?'#'+e.id:''),(e.textContent||'').trim().slice(0,22)])});
o.sort((a,b)=>a[0]-b[0]);return [o[0]||[999,'-',''],Math.round(scrollY)]}"""
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
AP=[('celular pequeno',320,568),('celular',360,640),('celular alto',360,800),('iPhone',390,844),('celular grande',412,915),('iPhone Max',430,932),('celular deitado',844,390),('tablet pequeno',600,960),('iPad em pé',768,1024),('iPad Air em pé',820,1180)]
url=sys.argv[1] if len(sys.argv)>1 else ''
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for n,W,H in AP:
        c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<900,has_touch=True,locale='es-PY',service_workers='block');c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',rota)
        pg=c.new_page();pg.goto('http://localhost:8811/'+url);pg.wait_for_timeout(2600);pg.mouse.move(W/2,H*.6)
        res=[];last=None
        for p in range(60):
            r=pg.evaluate(JS,[14,64]);res.append(r);pg.mouse.wheel(0,H*.3);pg.wait_for_timeout(350)
            m=pg.evaluate("()=>{const e=document.elementFromPoint(innerWidth/2,innerHeight*.6);return (e?e.getBoundingClientRect().top:0)+'|'+scrollY}")
            if m==last: break
            last=m
        g=sorted(res,key=lambda x:x[0][0]);print(n,W,'passos',len(res),'| piores:',[ (x[0][0],x[0][1],x[0][2],x[1]) for x in g[:3]],'| <26:',sum(1 for x in res if x[0][0]<26))
        c.close()
