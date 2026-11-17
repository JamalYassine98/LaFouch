# S400 · conferência do passo de embaçar com um botão (56a/56b) no site real, celular, câmera de mentira do kit de testes
import sys,subprocess,time;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/testes')
import base
from playwright.sync_api import sync_playwright
srv=subprocess.Popen(['python3','-m','http.server','8872','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2)
def vai(p,dist):
    b,pg,er=base.abre(p,W=390,H=844,ls={'t_perm':'granted'});pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.add_init_script("sessionStorage.setItem('lf_ni','1');Math.random=()=>0.42");pg.goto('http://localhost:8872/');w=pg.wait_for_timeout;w(3500);pg.evaluate("(d)=>{window.__dist=d;window.__lfGzAbre()}",dist);w(2500);pg.click('#gzcom')
    pg.wait_for_function("()=>__LFGZ.Z.fase==='teste'",timeout=70000);w(3000);pg.evaluate('()=>__LFGZ.pp(2)');w(4500);return b,pg,w,er
E="()=>({fase:__LFGZ.Z.fase,bot:[...document.querySelectorAll('#gzbt button')].map(b=>b.innerText+(b.disabled?' (travado)':'')),bal:(document.querySelector('#gzbal')||{}).innerText,hd:(__LFGZ.Z.hd||[]).length})"
try:
  with sync_playwright() as p:
    b,pg,w,er=vai(p,30);print('ao abrir:',pg.evaluate(E));pg.screenshot(path='/tmp/s400/m_a.png')
    pg.click('#gzbt [data-gz=emb]');w(500);print('depois do toque:',pg.evaluate(E));pg.screenshot(path='/tmp/s400/m_b.png');w(2500);print('2,5 s depois:',pg.evaluate("()=>__LFGZ.Z.fase"),er[:2]);b.close()
    b,pg,w,er=vai(p,13);w(3500);print('sem toque, a 13 cm:',pg.evaluate("()=>__LFGZ.Z.fase"),er[:2]);b.close()
finally: srv.terminate()
