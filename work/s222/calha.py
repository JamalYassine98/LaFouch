# S222: mede a calha livre à direita (onde nada clicável/texto/foto passa) na faixa de baixo da tela, em toda a rolagem
from playwright.sync_api import sync_playwright
AP=[('celular pequeno',320,568),('celular',360,640),('celular alto',360,800),('iPhone',390,844),('celular grande',412,915),('iPhone Max',430,932),('celular deitado',844,390),('tablet pequeno',600,960),('iPad em pé',768,1024),('iPad Air em pé',820,1180)]
JS="""(band)=>{const W=innerWidth,H=innerHeight,y0=H-band[0]-band[1],y1=H-band[0];let mx=0,quem='';
document.querySelectorAll('body *').forEach(e=>{if(e.closest('a.wa')||e.closest('.top'))return;const s=getComputedStyle(e);if(s.visibility=='hidden'||s.display=='none'||+s.opacity===0)return;
const txt=[].some.call(e.childNodes,n=>n.nodeType===3&&n.textContent.trim());const cl=/^(BUTTON|A|IMG|INPUT|SELECT|TEXTAREA|svg|VIDEO|CANVAS)$/i.test(e.tagName);if(!txt&&!cl)return;
let r=e.getBoundingClientRect();if(txt&&!cl){const g=document.createRange();g.selectNodeContents(e);r=g.getBoundingClientRect()}
if(!r.width||r.bottom<=y0||r.top>=y1||r.left>=W||r.right<=0)return;const rr=Math.min(r.right,W);if(rr>mx){mx=rr;quem=e.tagName+'.'+String(e.className.baseVal??e.className).split(' ')[0]+(e.id?'#'+e.id:'')}});
return [Math.round(W-mx),quem,Math.round(scrollY)]}"""
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for n,W,H in AP:
        c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<900,has_touch=True,locale='es-PY',service_workers='block');c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',rota)
        pg=c.new_page();pg.goto('http://localhost:8811/');pg.wait_for_timeout(2600);pg.mouse.move(W/2,H*.6)
        res=[]
        for p in range(40):
            res.append(pg.evaluate(JS,[14,64]));y=pg.evaluate('scrollY');pg.mouse.wheel(0,H*.35);pg.wait_for_timeout(350)
            if pg.evaluate('scrollY')==y: break
        g=sorted(res);print(n,W,'passos',len(res),'calha mín',g[0],'| 2ª',g[1][:2],'| mediana',g[len(g)//2][0],'| quantos <28:',sum(1 for x in res if x[0]<28),' <36:',sum(1 for x in res if x[0]<36))
        c.close()
