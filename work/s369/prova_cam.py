# S369: computador COM webcam (câmera de mentira): distância de 90 cm -> "mais perto"; 55 cm -> letra 55/30; sem 2ª medida; afastar na pergunta -> fala do computador
import sys,json,subprocess,time
sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
srv=subprocess.Popen(['python3','-m','http.server','8835','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2);R={}
try:
  with sync_playwright() as p:
    b,pg,er=base.abre(p,W=1366,H=768,ls={'t_perm':'granted'});pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.add_init_script("sessionStorage.setItem('lf_ni','1')");pg.goto('http://localhost:8835/');w=pg.wait_for_timeout;w(3500);pg.evaluate("()=>{window.__dist=90;window.__lfGzAbre()}");w(2500)
    st=lambda:json.loads(pg.evaluate(base.S));pg.click('#gzcom');ditos=[];t0=time.time();mudou=0
    while time.time()-t0<45 and st()['f']!='teste':
        s=st()
        if s['bal'] and (not ditos or ditos[-1]!=s['bal']): ditos.append(s['bal'])
        if 'mais perto' in s['bal'] and not mudou: mudou=1;R['chip90']=s['chip'];w(1200);pg.evaluate("()=>{window.__dist=55}")
        w(250)
    R['falas']=ditos;w(3500);s=st();R['chip55']=s['chip'];R['kd']=round(pg.evaluate("()=>__LFGZ.Z.kd"),3);R['letra0']=pg.evaluate("()=>parseFloat(document.querySelector('#gzl0').style.fontSize)")
    # afasta para 95 cm e toca "Consigo ler": não conta e fala do computador
    t0=time.time()
    while time.time()-t0<25:
        if pg.evaluate("()=>{const b=document.querySelector('#gzbt');return !b.hidden&&!b.classList.contains('esp')&&!__LFGZ.Z.falando}"): break
        w(300)
    pg.evaluate("()=>{window.__dist=95}");w(1800);R['chip95']=st()['chip'];pg.click('#gzbt [data-gz="sim"]');w(900);R['afastou']=st()['bal'];w(9000);R['afastou2']=st()['bal'];pg.evaluate("()=>{window.__dist=60}");w(1500)
    n=0;t0=time.time()
    while time.time()-t0<200 and st()['f'] in('teste','pp'):
        if st()['f']=='pp': R['pp']=1;break
        if pg.evaluate("()=>{const b=document.querySelector('#gzbt');return !b.hidden&&!b.classList.contains('esp')&&!__LFGZ.Z.falando}"):
            g=st()['g'];bt='sim' if (g or n<2) else 'nao';n+=1
            try: pg.click('#gzbt [data-gz="%s"]'%bt,timeout=1500)
            except Exception: pass
            w(1200)
        w(300)
    w(4000);R['fim']=st()['f'];R['pp']=R.get('pp',0);R['erros']=[e for e in er if 'net::' not in e and 'Failed to load' not in e][:4];b.close()
finally: srv.terminate()
print(json.dumps(R,ensure_ascii=False,indent=1))
