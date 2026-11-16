# S381: prova no celular com câmera de mentira — etiqueta a 30 cm, medição calma (1 s) quando estável e rápida ao mexer, ponto próximo que discorda não derruba o grau do quadro.
import sys,json,subprocess,time
sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
srv=subprocess.Popen(['python3','-m','http.server','8907','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2);R={}
try:
  with sync_playwright() as p:
    b,pg,er=base.abre(p,W=390,H=844,ls={'t_perm':'granted'});pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.add_init_script("sessionStorage.setItem('lf_ni','1')");pg.goto('http://localhost:8907/?medir=1');w=pg.wait_for_timeout;w(3500);pg.evaluate("()=>{window.__dist=30;window.__lfGzAbre()}");w(2500)
    st=lambda:json.loads(pg.evaluate(base.S));cam=lambda:pg.evaluate("()=>window.__lfCam&&[window.__lfCam.w,window.__lfCam.h,window.__lfCam.ms,Math.round(window.__lfCam.d)]");pg.click('#gzcom');t0=time.time()
    while time.time()-t0<45 and st()['f']!='teste': w(250)
    w(5000);R['a 30 cm']=[st()['chip'],cam()]
    pg.evaluate("()=>{window.__dist=50}");w(1600);R['afastou para 50']=[st()['chip'],cam()];pg.evaluate("()=>{window.__dist=30}");w(4500);R['voltou a 30']=[st()['chip'],cam()]
    R['medidor']=pg.evaluate("()=>document.querySelector('#lfmed').textContent.split('\\n').slice(-3)")
    n=0;t0=time.time();G=None
    while time.time()-t0<240 and st()['f'] in('teste','pp'):
        s=st()
        if s['f']=='pp':
            R['fase pp: ritmo']=cam();pg.evaluate("()=>{window.__dist=12}");w(2600)
            try: pg.click('#gzbt [data-gz="emb"]',timeout=1500)
            except Exception: pass
            w(2500);continue
        if pg.evaluate("()=>{const b=document.querySelector('#gzbt');return !b.hidden&&!b.classList.contains('esp')&&!__LFGZ.Z.falando}"):
            g=s['g'];bt='sim' if (g and g>=2.5) else 'nao';n+=1
            try: pg.click('#gzbt [data-gz="%s"]'%bt,timeout=1500)
            except Exception: pass
            w(1200)
        w(300)
    w(5000);R['fim']=st()['f'];R['resultado']=pg.evaluate("()=>{const c=document.querySelector('#gzc');return [(c.querySelector('.gzres')||{}).innerText,[...c.querySelectorAll('.gzrs .gzp')].map(e=>e.innerText.replace(/\\n/g,' / ')),(c.querySelector('#gzgv')||{}).innerText]}");R['fala']=st()['bal']
    R['erros']=[e for e in er if 'net::' not in e and 'Failed to load' not in e][:3];b.close()
finally: srv.terminate()
print(json.dumps(R,ensure_ascii=False,indent=1))
