import sys,json,subprocess,time;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
S=[subprocess.Popen([sys.executable,'/home/claude/lafouch/work/s415/srv.py',p,d],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL) for p,d in (('8993','/tmp/est_a'),('8994','/tmp/est_b'))];time.sleep(1.2)
with sync_playwright() as p:
  for porta in (8993,8994):
   for k in range(2):
    b,pg,er=base.abre(p,W=390,H=844);pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.add_init_script("Math.random=()=>0.42;sessionStorage.setItem('lf_ni','1')")
    pg.goto('http://localhost:%d/'%porta);pg.wait_for_timeout(3500);pg.click('#bagbtn');pg.wait_for_timeout(2000)
    print(porta,pg.evaluate("()=>{const h=document.querySelector('.hdots'),c=getComputedStyle(h),pc=getComputedStyle(h.parentNode);return [c.marginRight,c.marginLeft,pc.display,h.parentNode.className,h.style.cssText,h.getBoundingClientRect().left]}"))
    b.close()
for s in S:s.kill()
