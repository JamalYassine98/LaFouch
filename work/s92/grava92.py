import sys,base64,json,os,subprocess,shutil;sys.path.insert(0,'/home/claude/gz');from base import *
O='/tmp/v92';shutil.rmtree(O,ignore_errors=True);os.makedirs(O)
LOGA="""(()=>{const A=window.Audio;window.__ev=[];window.Audio=function(u){const a=new A(u);const f=u.split('/').pop();a.addEventListener('playing',()=>__ev.push({f,t:Date.now(),k:'play',ct:a.currentTime}));
 const p=a.pause.bind(a);a.pause=function(){__ev.push({f,t:Date.now(),k:'pause'});return p()};a.addEventListener('ended',()=>__ev.push({f,t:Date.now(),k:'end'}));
 let v=1;Object.defineProperty(a,'volume',{get:()=>v,set:x=>{if(x<.98&&v>=.98)__ev.push({f,t:Date.now(),k:'fade'});v=x}});return a}})()"""
UI="""window.__cap=function(t){let c=document.getElementById('cap9');if(!c){c=document.createElement('div');c.id='cap9';c.style.cssText='position:fixed;left:12px;right:12px;bottom:18px;z-index:2147483647;background:#2a1a24;color:#fff;font:600 14px Inter,system-ui;padding:10px 14px;border-radius:14px;text-align:center;pointer-events:none';document.body.appendChild(c)}c.textContent=t};
window.__tap=function(x,y){const d=document.createElement('div');d.style.cssText='position:fixed;z-index:2147483647;pointer-events:none;width:44px;height:44px;border-radius:50%;background:#8d3a6955;border:3px solid #8d3a69;left:'+(x-22)+'px;top:'+(y-22)+'px';document.body.appendChild(d);d.animate([{transform:'scale(.5)',opacity:1},{transform:'scale(1.3)',opacity:0}],{duration:600,easing:'ease-out'}).onfinish=()=>d.remove()}"""
with sync_playwright() as p:
  b,pg,errs=abre(p,perm=False,ls={'t_perm':'prompt'})
  pg.add_init_script(LOGA)
  cdp=pg.context.new_cdp_session(pg);fr=[]
  def on(e):
    fr.append((e['metadata']['timestamp'],e['data']));cdp.send('Page.screencastFrameAck',{'sessionId':e['sessionId']})
  cdp.on('Page.screencastFrame',on)
  pg.goto('http://localhost:8771/?r=descubra-o-grau');pg.evaluate(UI)
  cdp.send('Page.startScreencast',{'format':'jpeg','quality':88,'everyNthFrame':1})
  t0=pg.evaluate('Date.now()')
  pg.evaluate("__cap('1 · o Mochi explica o aviso…')")
  pg.wait_for_function("(document.querySelector('#gzav .gzrl')||{}).getAttribute&&document.querySelector('#gzav .gzrl').getAttribute('data-r')==='1'",timeout=30000)
  pg.wait_for_timeout(900)
  bb=pg.query_selector('#gw [data-gz=comeca]').bounding_box();x,y=bb['x']+bb['width']/2,bb['y']+bb['height']/2
  pg.evaluate("__cap('2 · o cliente toca em Começar no meio da fala → ele para e já segue')");pg.evaluate(f"__tap({x},{y})");pg.mouse.click(x,y)
  pg.wait_for_function("!!document.querySelector('#gw [data-gz=camsim]')",timeout=10000);pg.wait_for_timeout(1500)
  bb=pg.query_selector('#gw [data-gz=camsim]').bounding_box();x,y=bb['x']+bb['width']/2,bb['y']+bb['height']/2
  pg.evaluate("__cap('3 · toca em “Usar a câmera” antes de ele terminar → segue na hora')");pg.evaluate(f"__tap({x},{y})");pg.mouse.click(x,y)
  pg.wait_for_timeout(5500)
  cdp.send('Page.stopScreencast');t1=pg.evaluate('Date.now()');ev=pg.evaluate('__ev');print('ERR',[e for e in errs if 'TUNNEL' not in e])
# vídeo: quadros com a duração real
fr.sort();L=[]
for i,(ts,d) in enumerate(fr):
  f=f'{O}/f{i:05d}.jpg';open(f,'wb').write(base64.b64decode(d));nx=fr[i+1][0] if i+1<len(fr) else ts+.05;L.append(f"file '{f}'\nduration {max(.001,nx-ts):.4f}")
L.append(f"file '{O}/f{len(fr)-1:05d}.jpg'");open(f'{O}/l.txt','w').write('\n'.join(L))
v0=fr[0][0]*1000
# áudio: cada trecho tocado, no tempo em que tocou (com o sumiço de 0,15 s quando cortado)
ins=[];flt=[];k=0;st={}
for e in ev:
  if e['k']=='play':st[e['f']]=e
  elif e['f'] in st:
    s=st.pop(e['f']);dl=max(0,s['t']-v0);du=(e['t']-s['t'])/1000;fade=e['k']=='fade'
    if fade:du+=.15
    ins+=['-i','/tmp/sim/media/voz/pt/'+e['f']];fx=f"[{k+1}:a]atrim=0:{du:.3f}"+(f",afade=t=out:st={du-.15:.3f}:d=0.15" if fade else '')+f",adelay={int(dl)}|{int(dl)}[a{k}]";flt.append(fx);k+=1
for f,s in st.items():
  dl=max(0,s['t']-v0);ins+=['-i','/tmp/sim/media/voz/pt/'+f];flt.append(f"[{k+1}:a]adelay={int(dl)}|{int(dl)}[a{k}]");k+=1
mix=';'.join(flt)+';'+''.join(f'[a{i}]' for i in range(k))+f'amix=inputs={k}:normalize=0[o]'
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',f'{O}/l.txt']+ins+['-filter_complex',mix,'-map','0:v','-map','[o]','-vf','fps=60,scale=780:-2','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-shortest','/tmp/S92_toque_rapido.mp4'],check=True)
print('quadros',len(fr),'fps médio',len(fr)/(fr[-1][0]-fr[0][0]),'eventos',[(e['f'],e['k']) for e in ev])
