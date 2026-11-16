# S369: prova da Mochi no computador (partes 2 e 3) no site local. Uso: prova.py [pc|cel|iph]
import sys,json,subprocess,time,os
from playwright.sync_api import sync_playwright
OUT='/home/claude/lafouch/work/s369/';modo=(sys.argv[1:] or ['pc'])[0];lang=(sys.argv[2:] or ['pt-BR'])[0]
srv=subprocess.Popen(['python3','-m','http.server','8833','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2)
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
R={}
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    kw=dict(locale=lang,service_workers='block')
    if modo=='pc': kw.update(viewport={'width':1366,'height':768})
    elif modo=='pc2': kw.update(viewport={'width':1280,'height':720})
    elif modo=='iph': kw.update(viewport={'width':390,'height':844},device_scale_factor=3,is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
    else: kw.update(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
    c=b.new_context(**kw);c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',rota);pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:200]))
    pg.goto('http://localhost:8833/');pg.wait_for_timeout(3500);pg.evaluate("()=>window.__lfGzAbre()");w=pg.wait_for_timeout
    Z="window.__LFGZ.Z"
    def fase(): return pg.evaluate("()=>%s.fase"%Z)
    def bal(): return pg.evaluate("()=>{const b=document.querySelector('#gzbal');return b?b.innerText:''}")
    w(1500);R['pc']=pg.evaluate("()=>[%s.pc,%s.kb]"%(Z,Z));ditos=[]
    # entrada: espera a coreografia do código (só no computador)
    t0=time.time();alvo=None
    while time.time()-t0<75:
        x=bal()
        if x and (not ditos or ditos[-1]!=x): ditos.append(x)
        if modo.startswith('pc') and alvo is None and ('código' in x):
            w(1500);alvo=pg.evaluate("()=>{const g=document.querySelector('#gw .luva').getBoundingClientRect(),q=document.querySelector('.lxqr .q').getBoundingClientRect(),c=document.querySelector('.lxqr');return {ex:Math.round((g.left+g.width/2)-(q.right-10)),ey:Math.round((g.top+g.height/2)-(q.top+q.height/2)),on:c.classList.contains('on'),dentro:g.left>=q.left&&g.right<=q.right+12}}");pg.screenshot(path=OUT+'p_%s_qr.png'%modo)
        if 'Começar' in x or 'Empezar' in x: w(2500);break
        w(300)
    R['falas_entrada']=ditos;R['qr']=alvo
    if modo.startswith('pc'): pg.screenshot(path=OUT+'p_%s_comecar.png'%modo)
    pg.click('#gzcom');w(1500);R['fase1']=fase()
    t0=time.time();ditos=[]
    while time.time()-t0<40 and fase()!='teste':
        x=bal()
        if x and (not ditos or ditos[-1]!=x): ditos.append(x)
        if fase()=='prep' and 'h2' not in R: R['h2']=pg.evaluate("()=>document.querySelector('#gzc h2').innerText+' | '+document.querySelector('#gzc .gzp').innerText+' | '+document.querySelector('#gzdi').innerText")
        w(300)
    R['falas_prep']=ditos;w(3500)
    R['kd']=pg.evaluate("()=>%s.kd"%Z);R['letras']=pg.evaluate("()=>[0,3,8].map(i=>+parseFloat(document.querySelector('#gzl'+i).style.fontSize).toFixed(2))")
    pg.screenshot(path=OUT+'p_%s_teste.png'%modo)
    # responde: lê 2 linhas, depois não consegue; com lente responde sim até acabar
    n=0;t0=time.time();ditos=[]
    while time.time()-t0<240 and fase() in('teste','pp'):
        x=bal()
        if x and (not ditos or ditos[-1]!=x): ditos.append(x)
        if fase()=='pp': R['pp']=1;break
        ok=pg.evaluate("()=>{const b=document.querySelector('#gzbt');return b&&!b.hidden&&!b.classList.contains('esp')&&!%s.falando}"%Z)
        if ok:
            g=pg.evaluate("()=>%s.g"%Z);bt='sim' if (g or n<2) else 'nao';n+=1
            try: pg.click('#gzbt [data-gz="%s"]'%bt,timeout=1500)
            except Exception: pass
            w(1200)
        w(300)
    w(6000);R['fase_fim']=fase();R['res']=pg.evaluate("()=>{const e=document.querySelector('#gzc .gzest'),r=document.querySelector('#gzc .gzres');return [r?r.innerText:null,e?e.innerText:null]}")
    x=bal();ditos.append(x);w(5000);ditos.append(bal());R['falas_fim']=ditos[-4:];R['estouro']=pg.evaluate("()=>document.documentElement.scrollWidth>innerWidth+1");R['erros']=er
    pg.screenshot(path=OUT+'p_%s_res.png'%modo);b.close()
finally:
  srv.terminate()
print(json.dumps(R,ensure_ascii=False,indent=1))
