# S222: no computador pequeno (mouse), a bola de hoje fica por cima de algo? Início e catálogo, todas as paradas.
from prop import EST
from playwright.sync_api import sync_playwright
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for n,W,H in (('monitor antigo',1024,768),('notebook pequeno',1280,720),('notebook',1366,768),('notebook grande',1536,864)):
        for tela,url in (('inicio',''),('catalogo','?r=tienda')):
            c=b.new_context(viewport={'width':W,'height':H},locale='es-PY',service_workers='block');c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',rota)
            pg=c.new_page();pg.goto('http://localhost:8811/'+url);pg.wait_for_timeout(2500);pg.mouse.move(W/2,H*.6);pts=[];last=None
            for p in range(14):
                pg.wait_for_timeout(1100);pts.append(pg.evaluate(EST));pg.mouse.wheel(0,H*.4);pg.wait_for_timeout(150)
                m=pg.evaluate("()=>{const e=document.elementFromPoint(innerWidth/2,innerHeight*.6);return (e?Math.round(e.getBoundingClientRect().top):0)+'|'+scrollY}")
                if m==last: break
                last=m
            ok=[x for x in pts if x and x.get('forma')!='ausente']
            print('%-16s %4d %-8s paradas %2d | bola %s | por cima de algo %2d %s'%(n,W,tela,len(pts),ok[0]['caixa'] if ok else 'ausente',sum(1 for x in ok if x['cobre']),sorted(set(x['quem'] for x in ok if x['cobre']))[:4]),flush=True);c.close()
