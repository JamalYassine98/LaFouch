import sys,time,subprocess
from playwright.sync_api import sync_playwright
srv=subprocess.Popen([sys.executable,'-m','http.server','8971','-d','pagina'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    pg=c.new_page();pg.goto('http://localhost:8971/');pg.wait_for_timeout(1500)
    print(pg.evaluate("()=>[[...document.querySelectorAll('body *')].map(e=>[e.tagName+'.'+e.className,e.scrollWidth]).sort((a,b)=>b[1]-a[1]).slice(0,6),document.documentElement.scrollWidth,innerWidth,[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).slice(0,5).map(e=>e.tagName+'.'+e.className+' '+Math.round(e.getBoundingClientRect().right))]"))
finally: srv.terminate()
