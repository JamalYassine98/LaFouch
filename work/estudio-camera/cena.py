# S436: cena sintética de tenda (parede cinza, prato claro, armação fina no meio) como câmera falsa — para conferir o 149cam-F por inteiro
import sys,os,json;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
kit.serve(os.path.join(kit.RAIZ,'www'),kit.PA)
from playwright.sync_api import sync_playwright
CENA=r"""(()=>{const md=navigator.mediaDevices;if(!md)return;md.getUserMedia=async function(){const cv=document.createElement('canvas');cv.width=1920;cv.height=1080;const x=cv.getContext('2d');
 window.__cn=window.__cn||{dx:0,w:0.48,bri:1,ang:0};
 const draw=()=>{const P=window.__cn;x.filter='brightness('+P.bri+')';x.fillStyle='#b4b4b2';x.fillRect(0,0,1920,1080);x.fillStyle='#ececea';x.fillRect(0,640,1920,440);
  const cx=960+P.dx,W=1920*P.w,cy=600;x.strokeStyle='#1d1d1f';x.lineWidth=14;x.lineJoin='round';
  const L=W*0.3,ah=W*0.17;x.beginPath();x.roundRect(cx-W*0.33,cy-ah/2,L,ah,30);x.roundRect(cx+W*0.03,cy-ah/2,L,ah,30);x.moveTo(cx-W*0.03,cy-ah*0.2);x.quadraticCurveTo(cx,cy-ah*0.45,cx+W*0.03,cy-ah*0.2);
  x.moveTo(cx-W*0.33,cy-ah*0.3);x.lineTo(cx-W*0.5,cy-ah*0.45);x.moveTo(cx+W*0.33,cy-ah*0.3);x.lineTo(cx+W*0.5,cy-ah*0.45);x.stroke();x.filter='none';
  if(P.ang){P.f=(P.f||0)+1;}
  requestAnimationFrame(draw)};draw();return cv.captureStream(30)}})()"""
def abre(pw,W,H):
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
  c=b.new_context(bypass_csp=True,viewport={'width':W,'height':H},device_scale_factor=1,is_mobile=True,has_touch=True,locale='pt-BR',color_scheme='dark',service_workers='block')
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') or r.request.url.startswith('http://127.') else r.abort())
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.add_init_script(CENA)
  pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)));pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(800)
  return b,pg,er
ST="()=>{const o=document.getElementById('estCam');if(!o)return 'fechada';const c=o.__c149;return {modo:o.dataset.modo,ok:c&&c.ok,frase:o.querySelector('.ecFrase').textContent,itens:c&&c.r.itens.map(i=>i.id+':'+i.ok).join(' '),peca:c&&c.m.peca,borda:c&&c.m.borda,parede:c&&Math.round(c.m.parede),rec:o.querySelector('#ecRec').disabled,crono:o.querySelector('.ecCrono').textContent,trava:o.querySelector('.ecTrava').textContent,grav:o.classList.contains('ecGrav')}}"
if __name__=='__main__':
  with sync_playwright() as pw:
    b,pg,er=abre(pw,844,390)
    pg.evaluate("()=>__LF.ACT.estAbre()");pg.wait_for_timeout(700);pg.evaluate("()=>document.querySelector('[data-e=nova]').click()");pg.wait_for_timeout(4500)
    print(json.dumps(pg.evaluate(ST),ensure_ascii=False))
    pg.screenshot(path='/home/claude/lafouch/work/estudio-camera/cena_pronto.png')
    print('erros',er);b.close()
