# S249 · conferência: o que abre "seco" (sem movimento) e o que fecha "seco". Mede por diferença de imagem.  python3 sonda2.py
import json,subprocess,sys,time,os,io
A=os.path.dirname(os.path.abspath(__file__))+'/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
exec(open(A+'sonda.py').read().split("rt=lambda")[0].split("from playwright.sync_api import sync_playwright")[1])
rt=lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def foto(pg): return Image.open(io.BytesIO(pg.screenshot())).convert('L').resize((195,422))
def dif(a,b):
    h=ImageChops.difference(a,b).point(lambda p:255 if p>18 else 0).histogram();return round(100*h[255]/(195*422))
srv=subprocess.Popen([sys.executable,'-m','http.server','8838','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True);time.sleep(1)
out=[]
def mede(pg,nome,js):
    f0=foto(pg);pg.evaluate(MARK);pg.evaluate(js);pg.wait_for_timeout(50);an=pg.evaluate(AN);f1=foto(pg);pg.wait_for_timeout(700);f2=foto(pg)
    out.append((nome,dif(f0,f1),dif(f1,f2),dif(f0,f2),an['n'],an['fim']));print('%-44s muda já %2d%% · depois %2d%% · total %2d%% · anim n=%d fim=%d'%out[-1],flush=True)
CL="k=>{const e=[...document.querySelectorAll('[data-act=\"'+k+'\"],#'+k+',.'+k)].find(e=>e.getClientRects().length);e&&e.click()}"
FECHA="""()=>{const c=[...document.querySelectorAll('[data-act*=fech],[data-act*=close],[data-act=x],.x,.close,.fechar,[aria-label*=Fechar],[aria-label*=fechar]')].filter(e=>e.getClientRects().length);const e=c[c.length-1];if(e){e.click();return e.outerHTML.slice(0,90)}return 'SEM BOTÃO'}"""
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    def novo(url,loc=None,espera=None):
        c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block',**({'locale':loc} if loc else {}));c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',rt);pg=c.new_page();pg.on('dialog',lambda d:d.dismiss());pg.goto(url)
        if espera: pg.wait_for_function(espera)
        pg.wait_for_timeout(1500);return c,pg
    for v,k in (('estoque','btnAdd'),('estoque','btnFilt'),('estoque','pcAbre'),('clientes','clinovo'),('clientes','ataNovo'),('hist','hcal'),('hist','hfopen'),('hist','opendia'),('dia','daycal'),('dash','dPer'),('dash','dVer'),('ajustes','ajR'),('caixa','cxmenu'),('caixa','cxabre'),('inicio','guardAbre'),('vendas','pcard'),('vendas','cjSh'),('fx','fjAbre'),('estoque','ic')):
        c,pg=novo('http://localhost:8838/index.html#test',espera='window.__LF');pg.evaluate("v=>window.__LF.setView(v)",v);pg.wait_for_timeout(1300)
        mede(pg,'APP %s · abrir %s'%(v,k),"(%s)('%s')"%(CL,k));pg.wait_for_timeout(400)
        f0=foto(pg);pg.evaluate(MARK);quem=pg.evaluate(FECHA);pg.wait_for_timeout(50);an=pg.evaluate(AN);f1=foto(pg);pg.wait_for_timeout(600);f2=foto(pg)
        print('     fechar (%s): muda já %d%% · depois %d%% · anim n=%d fim=%d'%(quem[:60].replace('\n',' '),dif(f0,f1),dif(f1,f2),an['n'],an['fim']),flush=True);out.append(('  fechar '+k,dif(f0,f1),dif(f1,f2),0,an['n'],an['fim']));c.close()
    c,pg=novo('http://localhost:8811/?r=tienda','es-PY');mede(pg,'SITE catálogo · abrir sacola',"document.querySelector('#bagbtn').click()");mede(pg,'SITE catálogo · fechar sacola (Esc)',"document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))")
    mede(pg,'SITE catálogo · abrir busca',"document.querySelector('#sbtn,.sbtn,[data-s249=sbtn]')?.click()");c.close()
    c,pg=novo('http://localhost:8811/?r=tienda','es-PY');pg.evaluate(ALVOS,'header button,.top button');pg.evaluate("document.querySelector('[data-s249=sbtn]').click()");pg.wait_for_timeout(900);f0=foto(pg);pg.evaluate(MARK);pg.keyboard.press('Escape');pg.wait_for_timeout(50);an=pg.evaluate(AN);f1=foto(pg);pg.wait_for_timeout(300);f2=foto(pg);pg.wait_for_timeout(1700);f3=foto(pg)
    print('SITE catálogo · fechar busca: muda já %d%% · +300ms %d%% · +2s %d%% · anim n=%d fim=%d %s'%(dif(f0,f1),dif(f1,f2),dif(f2,f3),an['n'],an['fim'],json.dumps(an['nomes'])[:200]));c.close()
    c,pg=novo('http://localhost:8811/?r=tienda','es-PY');mede(pg,'SITE catálogo · abrir peça',"document.querySelector('#grid .card').click()");pg.wait_for_timeout(800);mede(pg,'SITE peça · voltar',"history.back()");c.close()
finally: srv.terminate()
