import sys,json,subprocess,time
sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
srv=subprocess.Popen(['python3','-m','http.server','8909','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2)
try:
  with sync_playwright() as p:
    b,pg,er=base.abre(p,W=390,H=844,ls={'t_perm':'granted'});pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    cdp=pg.context.new_cdp_session(pg);cdp.send('Emulation.setCPUThrottlingRate',{'rate':6})
    pg.add_init_script("sessionStorage.setItem('lf_ni','1')");pg.goto('http://localhost:8909/?medir=1');w=pg.wait_for_timeout;w(4000);pg.evaluate("()=>{window.__dist=30;window.__lfGzAbre()}");w(3000);pg.click('#gzcom');t0=time.time()
    while time.time()-t0<60 and json.loads(pg.evaluate(base.S))['f']!='teste': w(300)
    w(8000);print(pg.evaluate("()=>document.querySelector('#lfmed').textContent"));print('ritmo',pg.evaluate("()=>window.__lfCam&&window.__lfCam.ms"),'erros',[e for e in er if 'net::' not in e and 'Failed to load' not in e][:3]);pg.screenshot(path='/tmp/gt/med382.png');b.close()
finally: srv.terminate()
