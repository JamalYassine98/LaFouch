# S222: testa HOJE × PROPOSTA em todos os aparelhos de toque, parado em cada ponto da rolagem. python3 testa.py i0 i1 [zoom] [tema] [lang]
import sys, json, os
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from prop import css, EST, JS
from playwright.sync_api import sync_playwright
AP=[('celular pequeno',320,568),('celular',360,640),('celular alto',360,800),('iPhone',390,844),('celular grande',412,915),('iPhone Max',430,932),('celular deitado',844,390),('tablet pequeno',600,960),('iPad em pé',768,1024),('iPad Air em pé',820,1180)]
i0,i1=int(sys.argv[1]),int(sys.argv[2]); zoom=sys.argv[3] if len(sys.argv)>3 else '0'; tema=sys.argv[4] if len(sys.argv)>4 else ''; lang=sys.argv[5] if len(sys.argv)>5 else 'es'
OLHO=open(A+'../kit/olho.js').read()
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
out={}
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for n,W,H in AP[i0:i1]:
        for modo in ('hoje','prop'):
            c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<900,has_touch=True,locale='es-PY',service_workers='block')
            c.add_init_script("sessionStorage.setItem('lf_ni','1');try{localStorage.setItem('lf_zoom','%s');localStorage.setItem('lf_lang','%s')}catch(_){}"%(zoom,lang));c.route('**/*',rota)
            pg=c.new_page();pg.goto('http://localhost:8811/');pg.wait_for_timeout(2600)
            if tema: pg.evaluate("t=>document.documentElement.setAttribute('data-ev',t)",tema)
            if modo=='prop': pg.add_style_tag(content=css(W));pg.evaluate(JS)
            pg.mouse.move(W/2,H*.6);pg.wait_for_timeout(400);pts=[];rol=[];last=None
            for p in range(40):
                pg.wait_for_timeout(1500);e=pg.evaluate(EST);o={x['r']:x['n'] for x in pg.evaluate(OLHO)};e['olho']={k:o.get(k,0) for k in ('cortado','apagado','tampado','toque<24','toque<40','largura')};pts.append(e)
                pg.mouse.wheel(0,H*.3);pg.wait_for_timeout(200);rol.append(pg.evaluate(EST))
                m=pg.evaluate("scrollY")
                if m==last: break
                last=m
            out['%s|%d|%s'%(n,W,modo)]={'parado':pts,'rolando':rol};c.close()
            f=lambda k,v:sum(1 for x in pts if x.get(k)==v)
            print('%-16s %4d %-5s pontos %2d | livre %2d min %2d | inteiro(vis=100) %2d | apagado %2d | cobre>0 %2d %s | ícone<100 %2d | rolando: visível %2d/%d | olho %s'%(n,W,modo,len(pts),f('forma','livre'),f('forma','min'),sum(1 for x in pts if x.get('vis')==100),sum(1 for x in pts if x.get('op',1)<1),sum(1 for x in pts if x.get('cobre')),sorted(set(x['quem'] for x in pts if x.get('cobre')))[:3],sum(1 for x in pts if x.get('icone',100)<100),sum(1 for x in rol if x.get('op',0)>.9 and x.get('vis')==100),len(rol),{k:sum(x['olho'][k] for x in pts) for k in pts[0]['olho']}),flush=True)
json.dump(out,open(A+'teste_%d_%s_%s_%s.json'%(i0,zoom,tema or 'x',lang),'w'))
