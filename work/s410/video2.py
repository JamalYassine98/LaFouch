# S410 · HOJE × PROPOSTA no MESMO vídeo e no MESMO relógio: dois iframes lado a lado, os gestos disparam juntos.
import os,subprocess,sys,time,shutil,glob,json
A=os.path.dirname(os.path.abspath(__file__))+'/';H='/tmp/s410_hoje';P='/tmp/s410_prop';C='/tmp/s410_casca'
for d in (H,P):
    shutil.rmtree(d,ignore_errors=True);shutil.copytree('/home/claude/catalogo',d,ignore=shutil.ignore_patterns('.git','p','giro*','*.mp4'))
subprocess.run([sys.executable,A+'edita.py',P+'/js/lf-site.js'],check=True)
os.makedirs(C,exist_ok=True);open(C+'/index.html','w').write('<!doctype html><body style="margin:0;display:flex;background:#fff"><iframe id="h" src="http://localhost:8851/" style="width:390px;height:844px;border:0"></iframe><iframe id="p" src="http://localhost:8852/" style="width:390px;height:844px;border:0"></iframe></body>')
SEQ=[('tchau',2600),('joinha',2200),('palminha',2400),('comemora',2600),('danca',3000)]
from playwright.sync_api import sync_playwright
srvs=[subprocess.Popen([sys.executable,'-m','http.server',str(po),'-d',d],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL) for po,d in ((8851,H),(8852,P),(8853,C))];time.sleep(1.2)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--disable-site-isolation-trials'])
    d='/tmp/s410_v2';shutil.rmtree(d,ignore_errors=True)
    c=b.new_context(viewport={'width':780,'height':844},device_scale_factor=1,locale='pt-BR',service_workers='block',record_video_dir=d,record_video_size={'width':780,'height':844})
    c.add_init_script("(()=>{try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}})()")
    c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:160]));pg.goto('http://localhost:8853/');w=pg.wait_for_timeout;w(3500)
    F=[f for f in pg.frames if ':885' in f.url and not f.url.endswith('8853/')];F.sort(key=lambda f:f.url);print([f.url for f in F])
    for f in F: f.evaluate("()=>window.__lfGzAbre()")
    t0=time.time()
    while time.time()-t0<60 and not all('Começar' in f.evaluate("()=>{const b=document.querySelector('#gzbal');return b?b.innerText:''}") for f in F): w(250)
    w(2500)
    # marca de início: tela preta 1 instante (para achar no vídeo)
    pg.evaluate("()=>{const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;background:#000;z-index:99999';document.body.appendChild(d);setTimeout(()=>d.remove(),200)}");w(700)
    for g,ms in SEQ:
        for f in F: f.evaluate("(g)=>window.__LFGZ.Z.m.gesto(g)",g)
        w(ms)
    print('erros',er,[f.evaluate("()=>{const r=document.querySelector('.mochi').getBoundingClientRect();return [r.x,r.y]}") for f in F]);c.close();b.close()
finally:
    for x in srvs: x.terminate()
v=glob.glob(d+'/*.webm')[0]
# acha a tela preta
r=subprocess.run(['ffmpeg','-i',v,'-vf','blackdetect=d=0.05:pix_th=0.1','-an','-f','null','-'],capture_output=True,text=True)
import re;t=float(re.findall(r'black_start:([\d.]+)',r.stderr)[-1]);print('preto em',t)
Fn='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def faz(vel,out,tx):
    vf=(f"[0]crop=170:170:220:340,scale=510:510:flags=lanczos,drawtext=fontfile={Fn}:text='HOJE':x=16:y=14:fontsize=30:fontcolor=0x8d3a69[a];"
        f"[0]crop=170:170:610:340,scale=510:510:flags=lanczos,drawtext=fontfile={Fn}:text='PROPOSTA':x=16:y=14:fontsize=30:fontcolor=0x8d3a69[b];"
        f"[a][b]hstack,pad=iw+0:ih+56:0:0:white,drawtext=fontfile={Fn}:text='{tx}':x=(w-text_w)/2:y=h-42:fontsize=26:fontcolor=0x555555,setpts={1/vel}*PTS")
    subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(t+0.45),'-t','12.8','-i',v,'-filter_complex',vf,'-r','30','-an','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p',out],check=True)
faz(1,'/tmp/a1.mp4','velocidade normal');faz(.4,'/tmp/a2.mp4','câmera lenta (0,4x)')
open('/tmp/l2.txt','w').write("file '/tmp/a1.mp4'\nfile '/tmp/a2.mp4'\n")
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','/tmp/l2.txt','-c','copy',A+'104-mochi-mao-depois-do-braco.mp4'],check=True);print('ok')
