# S222: as 3 letras em TODOS os 16 aparelhos — Início: a página cabe na tela? o WhatsApp (hoje e lingueta) cobre algo?  python3 letras.py i0 i1
import sys, json, os
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from prop import css, EST, JS
from playwright.sync_api import sync_playwright
AP=[('celular pequeno',320,568),('celular',360,640),('celular alto',360,800),('iPhone',390,844),('celular grande',412,915),('iPhone Max',430,932),('celular deitado',844,390),('tablet pequeno',600,960),('iPad em pé',768,1024),('iPad Air em pé',820,1180),('iPad deitado',1024,768),('notebook pequeno',1280,720),('notebook',1366,768),('notebook grande',1536,864),('monitor',1920,1080),('monitor 2K',2560,1440)]
MARG="""()=>{const W=innerWidth;let mr=0,cut=0;document.querySelectorAll('#home .hc,#home .hcat a,#hdst').forEach(e=>{const r=e.getBoundingClientRect();if(!r.width)return;mr=Math.max(mr,r.right);if(r.right>W+1)cut++});return [Math.round(W-mr),cut]}"""
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
i0,i1=int(sys.argv[1]),int(sys.argv[2]);out={}
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for n,W,H in AP[i0:i1]:
        toque=W<1100 or H<500
        for z in '012':
            for modo in (('hoje','prop') if W<=860 else ('hoje',)):
                c=b.new_context(viewport={'width':W,'height':H},is_mobile=toque and W<900,has_touch=toque,locale='es-PY',service_workers='block')
                c.add_init_script("sessionStorage.setItem('lf_ni','1');try{localStorage.setItem('lf_zoom','%s')}catch(_){}"%z);c.route('**/*',rota)
                pg=c.new_page();pg.goto('http://localhost:8811/');pg.wait_for_timeout(2400)
                if modo=='prop': pg.add_style_tag(content=css(W));pg.evaluate(JS)
                pg.mouse.move(W/2,H*.6);marg=pg.evaluate(MARG);pts=[];last=None
                for p in range(9):
                    pg.wait_for_timeout(1150);pts.append(pg.evaluate(EST));pg.mouse.wheel(0,H*.45);pg.wait_for_timeout(150)
                    m=pg.evaluate("scrollY")
                    if m==last: break
                    last=m
                ok=[x for x in pts if x and x.get('forma')!='ausente']
                r={'margem':marg[0],'cortados':marg[1],'paradas':len(ok),'cobre':sum(1 for x in ok if x['cobre']),'meio':sum(1 for x in ok if x['vis']<100 or x['op']<1),'lingueta':sum(1 for x in ok if x['forma']=='min')}
                out['%s|%d|%s|%s'%(n,W,z,modo)]=r;print('%-16s %4d letra %s %-4s margem %4d cortados %d | paradas %d cobre %d meio/apagado %d lingueta %d'%(n,W,z,modo,r['margem'],r['cortados'],r['paradas'],r['cobre'],r['meio'],r['lingueta']),flush=True);c.close()
json.dump(out,open(A+'letras_%d.json'%i0,'w'))
