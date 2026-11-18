import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
PROP=open('prop_sistema.js').read();OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
srv=subprocess.Popen([sys.executable,'srv.py','8961','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
TELAS=[('inicio','/',None),('catalogo','/?r=armacoes',None),('peca','/','PECA'),('carrinho','/','#bagbtn'),('conta','/','#contabtn'),('menu','/','#mnb'),('rodape','/',"()=>scrollTo(0,document.body.scrollHeight)")]
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,H in [(1440,900),(1920,1080),(1100,800)]:
     for z in ['0','2']:
      for nome,url,ac in TELAS:
        res={}
        for v in ('h','p'):
          c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<700,has_touch=W<1100,service_workers='block',locale='pt-BR')
          c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
          c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_zoom','%s');"%z+("addEventListener('DOMContentLoaded',()=>{%s})"%PROP if v=='p' else ''))
          pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:100]));pg.goto('http://localhost:8961'+url);pg.wait_for_timeout(2300)
          if ac=='PECA':
            pg.evaluate("()=>document.querySelector('#home .hc').scrollIntoView({block:'center'})");pg.wait_for_timeout(400)
            bx=pg.locator('#home .hc').first.bounding_box();(pg.touchscreen.tap if W<1100 else pg.mouse.click)(bx['x']+bx['width']/2,bx['y']+40);pg.wait_for_timeout(1600)
          elif ac and ac.startswith('#'):
            bx=pg.locator(ac).first.bounding_box();(pg.touchscreen.tap if W<1100 else pg.mouse.click)(bx['x']+bx['width']/2,bx['y']+bx['height']/2);pg.wait_for_timeout(1600)
          elif ac: pg.evaluate(ac);pg.wait_for_timeout(900)
          o=set();
          for x in pg.evaluate(OLHO):
            for e in x['ex']: o.add(x['r']+': '+e)
          pg.evaluate("()=>scrollBy(0,500)");pg.wait_for_timeout(400)
          for x in pg.evaluate(OLHO):
            for e in x['ex']: o.add(x['r']+': '+e)
          res[v]=(o,er);c.close()
        novo=[x for x in res['p'][0] if x not in res['h'][0] and not x.startswith('fileira torta: Solar')]
        print(W,'letra',z,nome,'| novos:',len(novo),novo[:5],'| sumiram:',len(res['h'][0]-res['p'][0]),'| erros',res['p'][1][:1],flush=True)
finally: srv.terminate()
