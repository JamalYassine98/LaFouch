# compara o desenho da Mochi (parada, apontando no quadro de leitura) entre o programa de antes do S383 e o de agora
import sys,json,subprocess,time
sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageChops
srv=subprocess.Popen(['python3','-m','http.server','8913','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2);fs=[]
try:
  with sync_playwright() as p:
    for nome in ('antes','agora'):
        b,pg,er=base.abre(p,W=390,H=844,ls={'t_perm':'granted'});c=pg.context;c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        if nome=='antes': js=open('/tmp/gt/lf-site-antes383.js',encoding='utf8').read();c.route('**/js/lf-site.js*',lambda r:r.fulfill(body=js,content_type='application/javascript'))
        pg.add_init_script("sessionStorage.setItem('lf_ni','1');Math.random=()=>0.42");pg.goto('http://localhost:8913/');w=pg.wait_for_timeout;w(3500);pg.evaluate("()=>{window.__dist=30;window.__lfGzAbre()}");w(2500);pg.click('#gzcom');t0=time.time()
        while time.time()-t0<60 and json.loads(pg.evaluate(base.S))['f']!='teste': w(300)
        w(7000);pg.add_style_tag(content='.mochi *{animation:none!important}#gzbal,#gzdi,.gzl{visibility:hidden!important}');w(2500)
        bx=pg.evaluate("()=>{const r=document.querySelector('#gw .mochi').getBoundingClientRect();return [r.left-30,r.top-30,r.width+140,r.height+60]}")
        f='/tmp/gt/igual_%s.png'%nome;pg.screenshot(path=f,clip={'x':max(0,bx[0]),'y':max(0,bx[1]),'width':bx[2],'height':bx[3]});fs.append(f);print(nome,'filtros da emenda:',pg.evaluate("()=>[...document.querySelectorAll('#gw .filE,#gw .filD')].map(g=>g.innerHTML.length)"),er[:1]);b.close()
finally: srv.terminate()
a,b2=[Image.open(f).convert('RGB') for f in fs]
if a.size!=b2.size: print('tamanhos diferentes',a.size,b2.size)
else:
    d=ImageChops.difference(a,b2);h=d.convert('L').point(lambda v:255 if v>24 else 0);n=sum(1 for v in h.getdata() if v);print('pontos diferentes (acima de 10% de cor):',n,'de',a.size[0]*a.size[1],'| maior diferença',max(max(px) for px in d.getdata()))
