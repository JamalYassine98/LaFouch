import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
PROP=open('prop121.js').read()
srv=subprocess.Popen([sys.executable,'-m','http.server','8945','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block',locale='pt-BR')
    c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');addEventListener('DOMContentLoaded',()=>{%s})"%PROP)
    pg=c.new_page();pg.goto('http://localhost:8945/');pg.wait_for_timeout(2500)
    print(pg.evaluate("""()=>['#mnb','#sbtn','#bagbtn','.hd .hdots button','.hsh a'].map(q=>{const e=document.querySelector(q);if(!e)return q+' none';const bf=getComputedStyle(e,'::before').content;const a=getComputedStyle(e,'::after'),s=getComputedStyle(e);
      let clip=[];for(let x=e.parentElement;x&&x!==document.body;x=x.parentElement){const k=getComputedStyle(x);if(k.overflow!=='visible'||k.contain!=='none'||k.clipPath!=='none')clip.push((x.id||x.className+'').slice(0,20)+':'+k.overflow+'/'+k.contain)}
      return q+' cls='+e.className+' before='+bf+' after='+a.content+' pos='+s.position+' vars='+e.style.cssText+' clip='+clip.join(',')})"""))
finally: srv.terminate()
