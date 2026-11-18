import sys,time,subprocess,json,os
from playwright.sync_api import sync_playwright
COL=open('coleta.js').read();PROP=open(sys.argv[1]).read() if len(sys.argv)>1 and sys.argv[1].endswith('.js') else ''
TAG=sys.argv[2] if len(sys.argv)>2 else 'hoje'
srv=subprocess.Popen([sys.executable,'srv.py','8960','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
TELAS=[('inicio-1','/',None),('inicio-2','/',"()=>scrollTo(0,innerHeight*0.9)"),('inicio-3','/',"()=>{const h=[...document.querySelectorAll('.hc')].find(c=>c.querySelector('.hlin'));h&&h.scrollIntoView({block:'center'})}"),
 ('catalogo','/?r=armacoes',None),('peca','/','PECA'),('carrinho','/','#bagbtn'),('conta','/','#contabtn'),('menu','/','#mnb'),('rodape','/',"()=>scrollTo(0,document.body.scrollHeight)")]
TAM=[(390,844),(768,1024),(1024,768),(1440,900),(1920,1080)]
os.makedirs('fotos',exist_ok=True);res=[]
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,H in TAM:
      for nome,url,ac in TELAS:
        c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<700,has_touch=W<1100,device_scale_factor=2,service_workers='block',locale='pt-BR')
        c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');"+("addEventListener('DOMContentLoaded',()=>{%s})"%PROP if PROP else ''))
        pg=c.new_page();pg.goto('http://localhost:8960'+url);pg.wait_for_timeout(2300)
        if ac=='PECA':
          pg.evaluate("()=>document.querySelector('#home .hc').scrollIntoView({block:'center'})");pg.wait_for_timeout(400)
          bx=pg.locator('#home .hc').first.bounding_box();(pg.touchscreen.tap if W<1100 else pg.mouse.click)(bx['x']+bx['width']/2,bx['y']+40);pg.wait_for_timeout(1600)
        elif ac and ac.startswith('#'):
          bx=pg.locator(ac).first.bounding_box();(pg.touchscreen.tap if W<1100 else pg.mouse.click)(bx['x']+bx['width']/2,bx['y']+bx['height']/2);pg.wait_for_timeout(1600)
        elif ac: pg.evaluate(ac);pg.wait_for_timeout(900)
        pg.evaluate("()=>{const s=document.createElement('style');s.textContent='*{animation-play-state:paused!important;transition:none!important}';document.head.appendChild(s)}")
        m=pg.evaluate(COL);m.update(tela=nome,larg=W,alt=H)
        pg.screenshot(path='fotos/%s_%d_%s.png'%(TAG,W,nome));res.append(m);c.close()
        print(W,nome,len(m['textos']),'textos',len(m['blocos']),'blocos',flush=True)
finally: srv.terminate()
json.dump(res,open('medidas_%s.json'%TAG,'w'),ensure_ascii=False)
