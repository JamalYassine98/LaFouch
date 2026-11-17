# S410 · vídeo do ESBOÇO 109, Hoje × Proposta no mesmo relógio. As duas cópias com sorteio em ordem fixa (det.py), só para sincronizar.
import os,subprocess,sys,time,shutil,glob,json,re
sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
A=os.path.dirname(os.path.abspath(__file__))+'/';H='/tmp/s410_hoje';P='/tmp/s410_prop';C='/tmp/s410_casca'
for d in (H,P):
    shutil.rmtree(d,ignore_errors=True);shutil.copytree('/home/claude/catalogo',d,ignore=shutil.ignore_patterns('.git','p','giro*','*.mp4'))
    if d==P: subprocess.run([sys.executable,A+'edita109.py',d+'/js/lf-site.js'],check=True)
    subprocess.run([sys.executable,A+'det.py',d+'/js/lf-site.js'],check=True)
os.makedirs(C,exist_ok=True);open(C+'/index.html','w').write('<!doctype html><body style="margin:0;display:flex;background:#fff"><iframe allow="camera;autoplay" src="http://localhost:8851/" style="width:390px;height:844px;border:0"></iframe><iframe allow="camera;autoplay" src="http://localhost:8852/" style="width:390px;height:844px;border:0"></iframe></body>')
from playwright.sync_api import sync_playwright
srvs=[subprocess.Popen([sys.executable,'-m','http.server',str(po),'-d',d],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL) for po,d in ((8851,H),(8852,P),(8853,C))];time.sleep(1.2)
M={}
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--disable-site-isolation-trials'])
    d='/tmp/s410_z';shutil.rmtree(d,ignore_errors=True)
    c=b.new_context(viewport={'width':780,'height':844},device_scale_factor=1,locale='pt-BR',permissions=['camera'],service_workers='block',record_video_dir=d,record_video_size={'width':780,'height':844})
    c.add_init_script("(()=>{try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');localStorage.setItem('t_perm','granted')}catch(e){}})()");c.add_init_script(base.INIT)
    c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:160]));pg.goto('http://localhost:8853/');w=pg.wait_for_timeout;w(3500)
    F=sorted([f for f in pg.frames if f.url.startswith('http://localhost:885') and '8853' not in f.url],key=lambda f:f.url)
    tf=pg.evaluate("()=>{const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;background:#000;z-index:99999';document.body.appendChild(d);setTimeout(()=>d.remove(),200);return performance.now()}");w(500)
    for f in F: f.evaluate("()=>{window.__dist=30;window.__lfGzAbre()}")
    bal=lambda f:f.evaluate("()=>(document.querySelector('#gzbal')||{}).innerText||''")
    def ate(txt,lim=90):
        t0=time.time()
        while time.time()-t0<lim:
            if txt in bal(F[1]): return pg.evaluate("()=>performance.now()")
            w(150)
    M['com']=ate('tocar em Começar');w(6000)
    for f in F: f.evaluate("()=>document.querySelector('#gzcom').click()")
    for f in F: f.wait_for_function("()=>__LFGZ.Z.fase==='teste'",timeout=70000)
    pronto="()=>{const Z=__LFGZ.Z;return !!document.querySelector('#gw [data-gz=sim]')&&!Z.falando&&!Z.troca&&!Z.ocupado}"
    for f in F: f.wait_for_function(pronto,timeout=90000)
    M['sem']=ate('Sem pressa',30);w(5000)
    for f in F: f.evaluate("()=>document.querySelector('#gw [data-gz=sim]').click()")
    w(800)
    for f in F: f.wait_for_function(pronto,timeout=90000)
    M['nao']=ate('Se estiver difícil',30);w(6000)
    print('marcas',{k:(None if v is None else round((v-tf)/1000,1)) for k,v in M.items()},'erros',er,flush=True);c.close();b.close()
finally:
    for x in srvs: x.terminate()
v=glob.glob(d+'/*.webm')[0];r=subprocess.run(['ffmpeg','-i',v,'-vf','blackdetect=d=0.05:pix_th=0.1','-an','-f','null','-'],capture_output=True,text=True)
tb=float(re.findall(r'black_start:([\d.]+)',r.stderr)[0]);json.dump({'v':v,**{k:tb+(x-tf)/1000 for k,x in M.items() if x}},open('/tmp/s410_z.json','w'));print('ok',open('/tmp/s410_z.json').read())
