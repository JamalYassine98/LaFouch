import sys,time,subprocess
from playwright.sync_api import sync_playwright
srv=subprocess.Popen([sys.executable,'-m','http.server','8932','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,H in [(1100,800),(1366,768),(1440,900),(1920,1080),(2560,1440)]:
      for z in ['0','1','2']:
        for tela in ['inicio','peca']:
          c=b.new_context(viewport={'width':W,'height':H},service_workers='block',locale='pt-BR')
          c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
          c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_zoom','%s');"%z)
          pg=c.new_page();pg.goto('http://localhost:8932/');pg.wait_for_timeout(1800)
          if tela=='peca':
            pg.evaluate("()=>document.querySelector('#home .hc').scrollIntoView({block:'center'})");pg.wait_for_timeout(300)
            bx=pg.locator('#home .hc').first.bounding_box();pg.mouse.click(bx['x']+bx['width']/2,bx['y']+50);pg.wait_for_timeout(1200)
          r=pg.evaluate("()=>['#mnb','#sbtn','#contabtn','#bagbtn'].map(s=>{const e=document.querySelector(s);if(!e)return s+':-';const q=e.getBoundingClientRect();const x=q.left+q.width/2,y=q.top+q.height/2;const hit=document.elementFromPoint(Math.min(x,innerWidth-1),y);return s+':'+Math.round(q.left)+'-'+Math.round(q.right)+(q.right>innerWidth?' FORA':'')+(hit&&e.contains(hit)?'':' (tocar não acerta)')}).join(' ')")
          print(W,'letra',z,tela,r);c.close()
finally: srv.terminate()
