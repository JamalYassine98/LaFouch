import sys,time,subprocess
from playwright.sync_api import sync_playwright
srv=subprocess.Popen([sys.executable,'-m','http.server','8943','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2,service_workers='block',locale='pt-BR')
    c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')")
    pg=c.new_page();pg.goto('http://localhost:8943/');pg.wait_for_timeout(2500)
    pg.evaluate("()=>{const h=[...document.querySelectorAll('.hc')].find(c=>c.querySelector('.hlin'));h.scrollIntoView({block:'center'})}");pg.wait_for_timeout(800)
    pg.screenshot(path='linha_hoje.png')
finally: srv.terminate()
