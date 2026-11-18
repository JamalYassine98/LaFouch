import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
PROP=open('prop121.js').read();OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
srv=subprocess.Popen([sys.executable,'-m','http.server','8947','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for v in ('h','p'):
      c=b.new_context(viewport={'width':768,'height':1024},has_touch=True,service_workers='block',locale='pt-BR')
      c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
      c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');"+("addEventListener('DOMContentLoaded',()=>{%s})"%PROP if v=='p' else ''))
      pg=c.new_page();pg.goto('http://localhost:8947/');pg.wait_for_timeout(2500)
      pg.evaluate("()=>{const h=[...document.querySelectorAll('.hc')].find(c=>c.querySelector('.hlin'));h&&h.scrollIntoView({block:'center'})}");pg.wait_for_timeout(900)
      print(v,[x for x in pg.evaluate(OLHO) if x['r']=='fileira torta'])
      print(pg.evaluate("()=>[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/ESTILO/.test(e.textContent)).map(e=>{let p=e;for(let i=0;i<4;i++)p=p.parentElement;return e.className+'/'+e.parentElement.className+' top '+Math.round(e.getBoundingClientRect().top)+' in '+p.className})"))
      c.close()
finally: srv.terminate()
