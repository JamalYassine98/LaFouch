# S410 · vídeo HOJE × PROPOSTA da Mochi: "a mão chega depois do braço". Cópias do site; o site de verdade não é tocado.
import os,subprocess,sys,time,shutil,glob,json
A=os.path.dirname(os.path.abspath(__file__))+'/'
H='/tmp/s410_hoje';P='/tmp/s410_prop'
for d in (H,P):
    shutil.rmtree(d,ignore_errors=True);shutil.copytree('/home/claude/catalogo',d,ignore=shutil.ignore_patterns('.git','p','giro*','*.mp4'))
subprocess.run([sys.executable,A+'edita.py',P+'/js/lf-site.js'],check=True)
SEQ=[('tchau',2600),('joinha',2200),('palminha',2400),('comemora',2600),('danca',3000),('puxa',2400)]
from playwright.sync_api import sync_playwright
srvs=[subprocess.Popen([sys.executable,'-m','http.server',str(po),'-d',d],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL) for po,d in ((8851,H),(8852,P))];time.sleep(1.2)
R={}
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for modo,porta in (('h',8851),('p',8852)):
        d='/tmp/s410_v'+modo;shutil.rmtree(d,ignore_errors=True)
        c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=1,locale='pt-BR',service_workers='block',record_video_dir=d,record_video_size={'width':390,'height':844},is_mobile=True,has_touch=True)
        c.add_init_script("(()=>{try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}})()")
        c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:160]));pg.goto('http://localhost:%d/'%porta);w=pg.wait_for_timeout;w(3000)
        pg.evaluate("()=>window.__lfGzAbre()")
        t0=time.time()
        while time.time()-t0<60:
            x=pg.evaluate("()=>{const b=document.querySelector('#gzbal');return b?b.innerText:''}")
            if 'Começar' in x: break
            w(250)
        w(2500)
        bb=pg.evaluate("()=>{const r=document.querySelector('.mochi').getBoundingClientRect();return [r.x,r.y,r.width,r.height]}")
        ini=pg.evaluate("()=>performance.now()");marc=[]
        for g,ms in SEQ:
            marc.append((g,pg.evaluate("()=>performance.now()")));pg.evaluate("(g)=>window.__LFGZ.Z.m.gesto(g)",g);w(ms)
        fim=pg.evaluate("()=>performance.now()");tl=pg.evaluate("()=>performance.timeOrigin")
        print(modo,'erros:',er,'mochi',bb,flush=True);c.close()
        R[modo]=dict(v=glob.glob(d+'/*.webm')[0],ini=ini,fim=fim,bb=bb,marc=marc)
    b.close()
finally:
    for x in srvs: x.terminate()
json.dump(R,open('/tmp/s410_R.json','w'))
