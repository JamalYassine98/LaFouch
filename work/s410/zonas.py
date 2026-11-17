# mede, em cada zona de passeio (z1, z3, z4) e no ponto, o desenho da Mochi contra o balão e o quadro. python3 zonas.py <pasta> [W]
import sys,subprocess,time;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
D=sys.argv[1];W=int(sys.argv[2]) if sys.argv[2:] else 390
srv=subprocess.Popen([sys.executable,'-m','http.server','8857','-d',D],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
J="""(z)=>{const Z=__LFGZ.Z,L=__LFGZ.L,m=Z.m,b=document.querySelector('#gzbal');b.innerHTML='Se estiver difícil, pode dizer que não consegue — sem problema.';
 const p=L.Z[z];m.pos(p[0],p[1]);const u=[1e9,1e9,-1e9,-1e9];m.el.querySelectorAll('path,ellipse,circle,rect').forEach(e=>{const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden')return;let o=1;for(let x=e;x&&x!==m.el;x=x.parentElement){const op=x.getAttribute&&x.getAttribute('opacity');if(op!=null)o*=+op;o*=+getComputedStyle(x).opacity}if(o<.1)return;const r=e.getBoundingClientRect();if(!r.width)return;u[0]=Math.min(u[0],r.left);u[1]=Math.min(u[1],r.top);u[2]=Math.max(u[2],r.right);u[3]=Math.max(u[3],r.bottom)});
 const B=b.getBoundingClientRect(),F=document.querySelector('#gzfw').getBoundingClientRect();const gapx=u[0]-B.right,gapy=u[1]-B.bottom;
 return {z,mochi:u.map(Math.round),bal:[B.left,B.top,B.right,B.bottom].map(Math.round),cobreBalao:!(u[0]>=B.right||u[2]<=B.left||u[1]>=B.bottom||u[3]<=B.top),folgaX:Math.round(gapx),foraTela:Math.round(u[2]-innerWidth)}}"""
try:
 with sync_playwright() as p:
    b,pg,er=base.abre(p,W=W,H=844,ls={'t_perm':'granted'});pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.add_init_script("sessionStorage.setItem('lf_ni','1')");pg.goto('http://localhost:8857/');w=pg.wait_for_timeout;w(3500)
    pg.evaluate("()=>{window.__dist=30;window.__lfGzAbre()}");w(2500);pg.click('#gzcom');pg.wait_for_function("()=>__LFGZ.Z.fase==='teste'",timeout=70000);w(4000)
    for z in ('z1','z3','z4','ponto'):
        r=pg.evaluate(J,z);w(300);print(r);pg.screenshot(path='/tmp/zona_%s_%d.png'%(z,W))
    b.close()
finally: srv.terminate()
