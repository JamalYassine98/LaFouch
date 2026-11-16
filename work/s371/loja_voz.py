# S376: prova — a cópia do modo loja (www/loja) busca a voz da Mochi no site (lafouch.com fingido, com a permissão que o GitHub Pages dá) e toca.
import subprocess,time,json,os,sys
from playwright.sync_api import sync_playwright
srv=subprocess.Popen(['python3','-m','http.server','8895','-d','/home/claude/lafouch/www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1.2)
INIT="""(()=>{try{sessionStorage.setItem('lf_ni','1')}catch(e){};window.__al=[];const A0=window.Audio;window.Audio=function(u){const a=new A0(u);a.addEventListener('playing',()=>window.__al.push(String(u).slice(0,60)));a.addEventListener('error',()=>window.__al.push('ERRO '+String(u).slice(0,60)));return a}})()"""
ped=[]
def voz(r):
    u=r.request.url;ped.append(u.split('/media/voz/')[1]);f='/home/claude/catalogo/media/voz/'+u.split('/media/voz/')[1].split('?')[0]
    if not os.path.exists(f): return r.fulfill(status=404,body='')
    r.fulfill(body=open(f,'rb').read(),headers={'access-control-allow-origin':'*','content-type':'application/json' if f.endswith('.json') else 'audio/mpeg'})
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
    c=b.new_context(viewport={'width':1024,'height':768},locale='es-PY',service_workers='block');c.add_init_script(INIT)
    c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort());c.route('https://lafouch.com/media/voz/**',voz)
    pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)[:160]));pg.on('console',lambda m:er.append('console: '+m.text[:200]) if m.type=='error' and ('Content Security' in m.text or 'CORS' in m.text) else None)
    pg.goto('http://localhost:8895/loja/loja.html');w=pg.wait_for_timeout;w(4000);pg.evaluate("()=>window.__lfGzAbre()");w(9000)
    print('pedidos de voz ao site:',len(ped),ped[:3]);print('sons que tocaram:',pg.evaluate("()=>window.__al").__len__(),pg.evaluate("()=>window.__al.slice(0,3)"));print('balão:',pg.evaluate("()=>(document.querySelector('#gzbal')||{}).innerText"));print('erros:',er[:4]);b.close()
finally: srv.terminate()
