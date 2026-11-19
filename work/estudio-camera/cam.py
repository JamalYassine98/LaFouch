# Esboço câmera do Estúdio (app) deitado e em pé — S435 19/11
import sys,os;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit,base_app
kit.serve(os.path.join(kit.RAIZ,'www'),kit.PA)
from playwright.sync_api import sync_playwright
FAKE=r"""(()=>{const md=navigator.mediaDevices||{};const orig=md.getUserMedia&&md.getUserMedia.bind(md);
 md.getUserMedia=async function(c){const cv=document.createElement('canvas');cv.width=1920;cv.height=1080;const x=cv.getContext('2d');
  const img=new Image();let ok=false;img.onload=()=>ok=true;
  const pega=()=>{if(window.__fkImg&&!img.src){img.src=window.__fkImg;return}try{const S=window.__LF&&__LF.S;const it=S&&S.items.find(i=>i.foto&&/^(data:|blob:|\/|http:\/\/localhost)/.test(i.foto)||i.fotos&&i.fotos.length);const f=it&&(it.foto||(it.fotos[0]&&(it.fotos[0].src||it.fotos[0])));if(f&&!img.src)img.src=f}catch(e){}};
  const draw=()=>{pega();const g=x.createRadialGradient(960,540,100,960,540,1100);g.addColorStop(0,'#f2f1ef');g.addColorStop(1,'#b9b6b2');x.fillStyle=g;x.fillRect(0,0,1920,1080);
   if(ok){const s=Math.min(1100/img.width,700/img.height);const w=img.width*s,h=img.height*s;x.drawImage(img,960-w/2+(window.__fkDx||0),560-h/2,w,h)}requestAnimationFrame(draw)};draw();
  return cv.captureStream(30)};
 if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia=md.getUserMedia})()"""
def abre(pw,W,H,esc=True,base=True):
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
  c=b.new_context(bypass_csp=True,viewport={'width':W,'height':H},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark' if esc else 'light',service_workers='block')
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') or r.request.url.startswith('http://127.') else r.abort())
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.add_init_script(FAKE)
  if base: c.add_init_script(base_app.script())
  pg=c.new_page();pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(1000)
  return b,pg
def cam(pg):
  pg.evaluate("()=>__LF.setView('estoque')");pg.wait_for_timeout(800)
  pg.evaluate("()=>{const i=[...document.querySelectorAll('.pcard img')].find(x=>/^data:image\\/svg/.test(x.src));window.__fkImg=i&&i.src;__LF.setView('inicio')}");pg.wait_for_timeout(500)
  pg.evaluate("()=>__LF.camOpen(()=>{},'Antes de cadastrar',{peca:true})");pg.wait_for_timeout(2500)
if __name__=='__main__':
  with sync_playwright() as pw:
    for nome,(W,H) in (('deitado',(844,390)),('empe',(390,844))):
      b,pg=abre(pw,W,H);cam(pg);pg.screenshot(path='/tmp/cam_%s.png'%nome)
      print(nome,pg.evaluate("()=>{const o=document.getElementById('estCam');if(!o)return 'sem';const q=s=>{const e=o.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height),getComputedStyle(e).display]};return {vf:q('.ecVf'),v:q('video'),top:q('.ecTop'),bot:q('.ecBot'),fr:q('.ecFrase'),tag:q('.ecTag'),gd:q('.ecGd'),sh:q('.ecSh'),gal:q('.ecGal'),fit:getComputedStyle(o.querySelector('video')).objectFit}}"))
      b.close()
