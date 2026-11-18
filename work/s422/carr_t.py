import sys,subprocess,time;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
S=subprocess.Popen([sys.executable,'/home/claude/lafouch/work/s415/srv.py','8995','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
with sync_playwright() as p:
  for lang in ('pt-BR','es-PY'):
    b,pg,er=base.abre(p,lang=lang,W=390,H=844,ls={'lf_lang':'es' if lang.startswith('es') else 'pt'});pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.goto('http://localhost:8995/');pg.wait_for_timeout(300)
    t1=pg.evaluate("()=>{const l=document.getElementById('prevld');return l?l.innerText:null}");pg.wait_for_timeout(4000)
    t2=pg.evaluate("()=>{const l=document.getElementById('prevld');return l?l.innerText:null}");print(lang,'logo:',repr(t1),'depois:',repr(t2),[e for e in er if 'Failed' not in e][:3]);pg.screenshot(path='/tmp/carr_%s.png'%lang[:2])
    b.close()
S.kill()
