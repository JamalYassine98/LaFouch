import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
PROP=open('prop_sistema.js').read()
srv=subprocess.Popen([sys.executable,'srv.py','8962','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for v in ('h','p'):
      c=b.new_context(viewport={'width':1920,'height':1080},service_workers='block',locale='pt-BR')
      c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
      c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');"+("addEventListener('DOMContentLoaded',()=>{%s})"%PROP if v=='p' else ''))
      pg=c.new_page();pg.goto('http://localhost:8962/');pg.wait_for_timeout(2000)
      bx=pg.locator('#contabtn').bounding_box();pg.mouse.click(bx['x']+10,bx['y']+10);pg.wait_for_timeout(1500)
      print(v,pg.evaluate("()=>[...document.querySelectorAll('#layer label, #layer .rem')].slice(0,3).map(e=>{const r=e.getBoundingClientRect();return e.innerText.slice(0,12)+' fs='+getComputedStyle(e).fontSize+' z='+(r.width/e.offsetWidth).toFixed(2)+' render='+(parseFloat(getComputedStyle(e).fontSize)*r.width/e.offsetWidth).toFixed(1)})"))
      c.close()
finally: srv.terminate()
