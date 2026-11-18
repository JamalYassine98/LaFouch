import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
PROP=open('prop_sistema.js').read()
srv=subprocess.Popen([sys.executable,'srv.py','8963','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':1440,'height':900},service_workers='block',locale='pt-BR')
    c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');addEventListener('DOMContentLoaded',()=>{%s})"%PROP)
    pg=c.new_page();pg.goto('http://localhost:8963/');pg.wait_for_timeout(2000)
    pg.evaluate("()=>document.querySelector('#home .hc').scrollIntoView({block:'center'})");pg.wait_for_timeout(400)
    bx=pg.locator('#home .hc').first.bounding_box();pg.mouse.click(bx['x']+bx['width']/2,bx['y']+40);pg.wait_for_timeout(1800)
    print(pg.evaluate("""()=>{const e=document.querySelector('#layer .pgback span');const k=(e.className||'')+' '+e.parentElement.className;const p=(e.tagName+'.'+k.trim().split(/\\s+/).slice(0,3).join('.'));const R=window.__REGUA;return {p,lxf:e.dataset.lxf,style:e.getAttribute('style'),fs:getComputedStyle(e).fontSize,rtxt:R.txt[p+'|'+e.innerText.trim()],rp:R.papel[p],bodyz:getComputedStyle(document.body).zoom}}"""))
finally: srv.terminate()
