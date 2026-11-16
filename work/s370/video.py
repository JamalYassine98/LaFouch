# S370 (16/11/2026) · ESBOÇO EM VÍDEO: fluidez da Mochi, HOJE × PROPOSTA, no computador, em tempo real e COM a voz.
# A proposta roda numa CÓPIA do site (/tmp/s370_prop); o site de verdade não é tocado. Grupo 1 (aprovado em 14/11) + grupo 2 + movimento (salto e deslize).
# python3 video.py [es|pt]
import os,subprocess,sys,time,shutil,glob,json,re
A=os.path.dirname(os.path.abspath(__file__))+'/';LANG={'es':'es-PY','pt':'pt-BR'}[(sys.argv[1:] or ['pt'])[0]];LG=LANG[:2]
H='/tmp/s370_hoje';P='/tmp/s370_prop'
for d in (H,P):
    shutil.rmtree(d,ignore_errors=True);shutil.copytree('/home/claude/catalogo',d,ignore=shutil.ignore_patterns('.git','p','giro*','*.mp4'))
    for l in ('pt','es'):  # nas duas cópias as falas novas (aprovadas de ouvido) tocam, para a comparação ser só de movimento
        a=json.load(open(d+'/media/voz/%s/lista.json'%l));a.update(json.load(open(d+'/media/voz/%s/lista-teste.json'%l)));json.dump(a,open(d+'/media/voz/%s/lista.json'%l,'w'),ensure_ascii=False)
p=P+'/js/lf-site.js';s=open(p,encoding='utf8').read()
G1=open('/home/claude/lafouch/work/s256/video.py',encoding='utf8').read();ns={};exec('TROCAS = ['+G1.split('TROCAS = [')[1].split('\n]\n')[0]+'\n]',ns);TROCAS=[t for t in ns['TROCAS'] if 'dur=dur||520' not in t[0] and 'window.__lfSemSom' not in t[1]]
TROCAS+=[
 # deslize: tempo pela distância, sai e chega devagar sem passar do ponto, os olhos vão antes (só em percurso que se vê)
 ("dur=dur||520;if(RM.matches)","const _d=Math.hypot(nx-M.x,ny-M.y);dur=Math.round(Math.min(1200,Math.max(360,300+_d*2.1)));if(_d>40)M.olhaVai(Math.sign(nx-M.x)||0,Math.sign(ny-M.y)*.6,dur+250);if(RM.matches)"),
 # boca: sem som fica fechada; com som segue o volume da voz (3 aberturas)
 ("const ab=(k++%3)!==2;","const ab=false;"),
 ("if(my===FID&&Z.m&&!PZ.on)Z.m.fala(","if(my===FID&&Z.m&&!PZ.on)(Z.m.falaVol(a))||Z.m.fala("),
 # expressão troca atrás de uma piscada
 ("M.cara=function(e){M.exp=e;face0=null;faceSet(S.g?null:null)};","M.cara=function(e){if(e===M.exp)return;M.exp=e;face0=null;M.pisca();setTimeout(()=>faceSet(null),70)};"),
]
NOVO=r""" M.olhaVai=function(dx,dy,ms){M.olha(dx,dy);const tr=q('.pup').style.transform;setTimeout(()=>{if(q('.pup').style.transform===tr)M.olha(0,0)},ms)};
 M.falaVol=function(a){try{const bO=q('.bO'),bW=q('.bW');if(!a._an){const AC=window.AudioContext||window.webkitAudioContext;M._ac=M._ac||new AC();const sr=M._ac.createMediaElementSource(a);a._an=M._ac.createAnalyser();a._an.fftSize=512;sr.connect(a._an);a._an.connect(M._ac.destination)}
   if(M._ac.state==='suspended')M._ac.resume();M.fal=1;clearTimeout(ft);const an=a._an,buf=new Uint8Array(an.fftSize);let ab=-1,ult=0;bO.style.transformBox='fill-box';bO.style.transformOrigin='center';
   const lp=n=>{if(!M.fal||a.paused||a.ended)return;an.getByteTimeDomainData(buf);let e=0;for(let i=0;i<buf.length;i++){const v=(buf[i]-128)/128;e+=v*v}e=Math.sqrt(e/buf.length);const al=e>.1?2:e>.03?1:0;
    if(al!==ab&&n-ult>60){ab=al;ult=n;const fe=M.exp==='f';bO.style.opacity=ab&&!fe?1:0;bO.style.transform=ab===1?'scale(.82,.5)':'';bW.style.opacity=ab||fe?0:1}requestAnimationFrame(lp)};requestAnimationFrame(lp);return true}catch(_){return false}};
 /* salto: tempo e altura pela distância; de lado constante, sobe e cai como gravidade; olha e inclina antes; sombra fica no chão e encolhe; percurso curto vira deslize */
 M.pula=function(nx,ny,dur,alt,fim){const x0=M.x,y0=M.y,dx=nx-x0,dy=ny-y0,dist=Math.hypot(dx,dy);if(dist<56){M.flutua(nx,ny,0,fim);return}
  dur=Math.round(Math.min(1050,Math.max(460,340+dist*1.55)));alt=Math.min(96,Math.max(16,dist*.26));const tk=++M.mv,sb=q('.sombra'),ku=sb?(sb.getBoundingClientRect().width/68||1):1;
  M.olhaVai(Math.sign(dx)||0,Math.sign(dy)*.6,dur+650);M.inclina((dx>0?1:-1)*3);
  setTimeout(()=>{if(tk!==M.mv)return;M.amassa(1.1,.88);
   setTimeout(()=>{if(tk!==M.mv)return;M.amassa(.92,1.1);const t1=performance.now();if(sb){sb.style.animation='none';sb.style.transformBox='fill-box';sb.style.transformOrigin='center'}
    const solta=()=>{if(sb){sb.style.transform='';sb.style.animation=''}},f=n=>{if(tk!==M.mv){solta();return}const t=Math.min(1,(n-t1)/dur),h=4*t*(1-t)*alt;M.pos(x0+dx*t,y0+dy*t-h);
     if(sb)sb.style.transform=`translateY(${(h/ku).toFixed(1)}px) scale(${(1-Math.min(.45,h/170)).toFixed(3)})`;
     if(t>.4&&t<.6)M.amassa(1,1);else if(t>.82)M.amassa(.95,1.07);
     if(t<1)requestAnimationFrame(f);else{solta();M.inclina(0);M.amassa(1.13,.85);setTimeout(()=>{if(tk===M.mv)M.amassa(1,1)},120);fim&&fim()}};requestAnimationFrame(f)},170)},110)};
"""
a=s.index(" M.pula=function(nx,ny,dur,alt,fim){");b=s.index(" M.desliza=function",a);s=s[:a]+NOVO+s[b:]
for x,y in TROCAS:
    n=s.count(x);assert n>=1,'não achei: '+x[:70];s=s.replace(x,y)
# olhar com intenção: uma microvariação do olhar a cada 4–7 s quando está parada
x="M.pisca=function(){";assert s.count(x)==1;s=s.replace(x,"(function mo(){setTimeout(()=>{if(!el.isConnected)return;if(!M.fal&&q('.pup').style.transform.indexOf('(0px')>=0)M.olhaVai((Math.random()-.5)*1.1,(Math.random()-.4)*.7,900);mo()},4000+Math.random()*3000)})();"+x)
open(p,'w',encoding='utf8').write(s)
r=subprocess.run(['node','-e',"new (require('vm').Script)(require('fs').readFileSync('%s','utf8'))"%p],capture_output=True,text=True);assert r.returncode==0,r.stderr[-400:]
INIT="""(()=>{try{sessionStorage.setItem('lf_ni','1')}catch(e){};window.__al=[];window.__bl={};const c0=URL.createObjectURL.bind(URL);URL.createObjectURL=function(o){const u=c0(o);try{window.__bl[u]=o.size}catch(e){}return u};const A0=window.Audio;window.Audio=function(u){const a=new A0(u);a.addEventListener('playing',()=>{window.__al.push({f:u,sz:window.__bl[u]||0,t:performance.now()-(a.currentTime||0)*1000})});return a}})()"""
from playwright.sync_api import sync_playwright
R=[]
srvs=[subprocess.Popen([sys.executable,'-m','http.server',str(po),'-d',d],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL) for po,d in ((8841,H),(8842,P))];time.sleep(1.2)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
    for modo,porta,dd in (('h',8841,H),('p',8842,P)):
        d='/tmp/s370_v'+modo;shutil.rmtree(d,ignore_errors=True)
        c=b.new_context(viewport={'width':1366,'height':768},locale=LANG,service_workers='block',record_video_dir=d,record_video_size={'width':1366,'height':768})
        c.add_init_script(INIT);c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:160]));pg.goto('http://localhost:%d/'%porta);w=pg.wait_for_timeout;w(3200)
        tf=pg.evaluate("()=>{const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;background:#000;z-index:99999';document.body.appendChild(d);setTimeout(()=>d.remove(),260);return performance.now()}");w(900)
        pg.evaluate("()=>window.__lfGzAbre()");ta=pg.evaluate("()=>performance.now()");Z="window.__LFGZ.Z";t0=time.time();bal=lambda:pg.evaluate("()=>{const b=document.querySelector('#gzbal');return b?b.innerText:''}")
        while time.time()-t0<80:
            x=bal()
            if 'Começar' in x or 'Empezar' in x: break
            w(250)
        w(5200);pg.click('#gzcom');t0=time.time()
        while time.time()-t0<40 and pg.evaluate("()=>%s.fase"%Z)!='teste': w(250)
        w(9000);tz=pg.evaluate("()=>performance.now()");al=pg.evaluate("()=>window.__al");print(modo,'erros de JS:',er,'falas com som:',len(al),'duração',round((tz-ta)/1000,1),flush=True);c.close()
        R.append(dict(v=glob.glob(d+'/*.webm')[0],tf=tf,ta=ta,tz=tz,al=al,dir=dd))
    b.close()
finally:
    for x in srvs: x.terminate()
json.dump(R,open('/tmp/s370_R.json','w'))
