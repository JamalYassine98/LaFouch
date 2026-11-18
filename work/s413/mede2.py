import sys,json,time,subprocess
from playwright.sync_api import sync_playwright
PROP=open('prop.js').read() if len(sys.argv)>1 and sys.argv[1]=='prop' else ''
srv=subprocess.Popen([sys.executable,'-m','http.server','8931','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
Q="""()=>{const s=document.querySelector('#layer .scrim.pg');if(!s)return 'sem peça';const b=s.querySelector('.pgbar'),m=s.querySelector('.modal.pgm');
const ic=(b.querySelector('.pgback svg')||b.querySelector('.pgback')).getBoundingClientRect();const k=[...b.children].filter(e=>e.offsetWidth).map(e=>[e.className,Math.round(e.getBoundingClientRect().left),Math.round(e.getBoundingClientRect().right)]);
const big=m.querySelector('.big').getBoundingClientRect(),r=m.getBoundingClientRect();const kids=[...m.children].filter(e=>e.offsetWidth).map(e=>e.getBoundingClientRect());
const mn=document.querySelector('#mnb svg').getBoundingClientRect(),ct=[...document.querySelectorAll('.top .ib svg')].filter(e=>e.getBoundingClientRect().width).map(e=>e.getBoundingClientRect());const tx=(sel)=>{const e=b.querySelector(sel);if(!e)return null;const r=document.createRange();r.selectNodeContents(e);const q=r.getBoundingClientRect();return [Math.round(q.top*10)/10,Math.round(q.bottom*10)/10]};return {menu:Math.round(mn.left),icone_dir:Math.round(Math.max(...ct.map(x=>x.right))),inicio_txt:tx('.pgback span')||tx('.pgback'),cat_txt:tx('.pgcr'),seta:Math.round(ic.left),bar:k,foto_esq:Math.round(big.left),conteudo_dir:Math.round(Math.max(...kids.map(x=>x.right))),bar_h:Math.round(b.getBoundingClientRect().height)}}"""
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,H in [(390,844),(768,1024),(1100,800),(1366,768),(1440,900),(1920,1080),(2560,1440)]:
      for z in ['0','2']:
        c=b.new_context(viewport={'width':W,'height':H},has_touch=W<1100,is_mobile=W<700,service_workers='block',locale='pt-BR')
        c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_zoom','%s');"%z+("addEventListener('DOMContentLoaded',()=>{%s})"%PROP if PROP else ''))
        pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:120]));pg.goto('http://localhost:8931/');pg.wait_for_timeout(2000)
        pg.evaluate("()=>document.querySelector('#home .hc').scrollIntoView({block:'center'})");pg.wait_for_timeout(400)
        bx=pg.locator('#home .hc').first.bounding_box();x,y=bx['x']+bx['width']/2,bx['y']+min(60,bx['height']/2)
        (pg.touchscreen.tap if W<1100 else pg.mouse.click)(x,y);pg.wait_for_timeout(1300)
        print(W,'letra',z,pg.evaluate(Q),er[:1])
        if len(sys.argv)>2 and z=='0': pg.screenshot(path='raw_%d_%s.png'%(W,sys.argv[2]))
        c.close()
finally: srv.terminate()
