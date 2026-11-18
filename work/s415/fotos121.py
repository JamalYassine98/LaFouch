import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
PROP=open('prop121.js').read();ALVO=open('alvo2.js').read()
srv=subprocess.Popen([sys.executable,'-m','http.server','8948','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
TELAS={'inicio-topo':None,'inicio-meio':"()=>{const h=[...document.querySelectorAll('.hc')].find(c=>c.querySelector('.hlin'));h&&h.scrollIntoView({block:'center'})}",'rodape':"()=>scrollTo(0,document.body.scrollHeight)",'catalogo':'CAT','peca':'PECA'}
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for tela,ac in TELAS.items():
      for v in ('hoje','prop'):
        c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2,service_workers='block',locale='pt-BR')
        c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')"+(";addEventListener('DOMContentLoaded',()=>{%s})"%PROP if v=='prop' else ''))
        pg=c.new_page();pg.goto('http://localhost:8948/'+('?r=armacoes' if ac=='CAT' else ''));pg.wait_for_timeout(2300)
        if ac=='PECA':
          pg.evaluate("()=>document.querySelector('#home .hc').scrollIntoView({block:'center'})");pg.wait_for_timeout(400)
          bx=pg.locator('#home .hc').first.bounding_box();pg.touchscreen.tap(bx['x']+bx['width']/2,bx['y']+40);pg.wait_for_timeout(1500)
        elif ac and ac!='CAT': pg.evaluate(ac);pg.wait_for_timeout(900)
        pg.evaluate("()=>{const s=document.createElement('style');s.textContent='*{animation-play-state:paused!important}';document.head.appendChild(s)}")
        a=pg.evaluate(ALVO);pg.screenshot(path='f_%s_%s.png'%(tela,v));c.close()
        im=Image.open('f_%s_%s.png'%(tela,v)).convert('RGBA');ov=Image.new('RGBA',im.size,(0,0,0,0));d=ImageDraw.Draw(ov)
        for k in a['caixas']:
          cor=(31,138,76) if k['w']>=44 and k['h']>=44 else ((214,140,0) if k['w']>=24 and k['h']>=24 else (200,30,40))
          x,y,w,h=[2*k[q] for q in ('x','y','w','h')]
          d.rectangle((x,y,x+w,y+h),fill=cor+(46,),outline=cor+(255,),width=3)
        Image.alpha_composite(im,ov).convert('RGB').save('o_%s_%s.png'%(tela,v))
        print(tela,v,a['alvos'],a['menor44'],a['menor24'],flush=True)
finally: srv.terminate()
