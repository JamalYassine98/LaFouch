# S410 · vídeo do ESBOÇO 107, HOJE × PROPOSTA no mesmo relógio (dois iframes), câmera de mentira com a distância comandada.
# Cena 1: aproxima 30→20 cm e PARA (hoje espera o toque; proposta mede sozinha). Cena 2: vai até 13 cm sem parar nem tocar (não embaça).
import os,subprocess,sys,time,shutil,glob,json,re
sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
A=os.path.dirname(os.path.abspath(__file__))+'/';H='/tmp/s410_hoje';P='/tmp/s410_prop';C='/tmp/s410_casca'
for d in (H,P):
    shutil.rmtree(d,ignore_errors=True);shutil.copytree('/home/claude/catalogo',d,ignore=shutil.ignore_patterns('.git','p','giro*','*.mp4'))
subprocess.run([sys.executable,A+'edita105.py',P+'/js/lf-site.js'],check=True)
os.makedirs(C,exist_ok=True);open(C+'/index.html','w').write('<!doctype html><body style="margin:0;display:flex;background:#fff"><iframe allow="camera;autoplay" src="http://localhost:8851/" style="width:390px;height:844px;border:0"></iframe><iframe allow="camera;autoplay" src="http://localhost:8852/" style="width:390px;height:844px;border:0"></iframe></body>')
from playwright.sync_api import sync_playwright
srvs=[subprocess.Popen([sys.executable,'-m','http.server',str(po),'-d',d],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL) for po,d in ((8851,H),(8852,P),(8853,C))];time.sleep(1.2)
cena=int((sys.argv[1:] or ['1'])[0])
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--disable-site-isolation-trials'])
    d='/tmp/s410_c%d'%cena;shutil.rmtree(d,ignore_errors=True)
    c=b.new_context(viewport={'width':780,'height':844},device_scale_factor=1,locale='pt-BR',permissions=['camera'],service_workers='block',record_video_dir=d,record_video_size={'width':780,'height':844})
    c.add_init_script("(()=>{try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');localStorage.setItem('t_perm','granted')}catch(e){};Math.random=()=>0.42})()");c.add_init_script(base.INIT)
    c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:160]));pg.goto('http://localhost:8853/');w=pg.wait_for_timeout;w(3500)
    F=sorted([f for f in pg.frames if f.url.startswith('http://localhost:885') and '8853' not in f.url],key=lambda f:f.url)
    for f in F: f.evaluate("()=>{window.__dist=30;window.__lfGzAbre()}")
    w(2500)
    for f in F: f.click('#gzcom')
    for f in F: f.wait_for_function("()=>__LFGZ.Z.fase==='teste'",timeout=70000)
    w(3000)
    for f in F: f.evaluate('()=>{window.__LFGZ.Z.falando=0;__LFGZ.pp(2)}')
    pg.evaluate("()=>{const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;background:#000;z-index:99999';document.body.appendChild(d);setTimeout(()=>d.remove(),200)}")
    def dist(v):
        for f in F: f.evaluate("(v)=>window.__dist=v",v)
    w(7000)  # falas
    alvo=20 if cena==1 else 13;passos=int((30-alvo)/0.5)
    T0=time.time()
    for i in range(passos+1): dist(30-0.5*i);w(170)
    print('aproximação levou',round(time.time()-T0,1),'s');T1=time.time()
    w(4500)
    import json as J;print('HD',J.dumps(F[1].evaluate("()=>{const n=Date.now();return (__LFGZ.Z.hd||[]).slice(-40).map(x=>[Math.round((n-x[0])/100)/10,Math.round(x[1]*10)/10])}")))
    print('fase',[f.evaluate("()=>__LFGZ.Z.fase") for f in F],'erros',er,flush=True);c.close();b.close()
finally:
    for x in srvs: x.terminate()
v=glob.glob(d+'/*.webm')[0];r=subprocess.run(['ffmpeg','-i',v,'-vf','blackdetect=d=0.05:pix_th=0.1','-an','-f','null','-'],capture_output=True,text=True)
t=float(re.findall(r'black_start:([\d.]+)',r.stderr)[-1]);json.dump({'v':v,'t':t},open('/tmp/s410_c%d.json'%cena,'w'));print('preto',t)
