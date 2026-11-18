import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
srv=subprocess.Popen([sys.executable,'-m','http.server','8949','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block',locale='pt-BR')
    c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')")
    pg=c.new_page();pg.goto('http://localhost:8949/?r=armacoes');pg.wait_for_timeout(2500)
    print(pg.evaluate("""()=>{const e=[...document.querySelectorAll('*')].find(x=>x.children.length<=1&&/Última unidade/.test(x.textContent)&&x.offsetWidth&&x.offsetWidth<200);if(!e)return 'none';let p=e;while(p&&!/card/.test(p.className))p=p.parentElement;const s=getComputedStyle(e);
    return {tag:e.tagName,cls:e.className,par:e.parentElement.className,html:e.outerHTML.slice(0,200),pos:s.position,bg:s.backgroundColor,br:s.borderRadius,pad:s.padding,font:s.font,color:s.color,shadow:s.boxShadow,bd:s.border,left:Math.round(e.getBoundingClientRect().left-p.getBoundingClientRect().left),bottom:Math.round(p.querySelector('img').getBoundingClientRect().bottom-e.getBoundingClientRect().bottom)}}"""))
    pg.goto('http://localhost:8949/');pg.wait_for_timeout(2500)
    print(pg.evaluate("()=>{const e=document.querySelector('#home .hc .hlin');return e.outerHTML.slice(0,300)}"))
finally: srv.terminate()
