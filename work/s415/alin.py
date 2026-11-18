import sys,time,subprocess
from playwright.sync_api import sync_playwright
PROP=open('prop121.js').read()
srv=subprocess.Popen([sys.executable,'-m','http.server','8951','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W in (390,768,1440):
     for url in ('/','/?r=armacoes'):
      c=b.new_context(viewport={'width':W,'height':900},is_mobile=W<700,has_touch=W<1100,service_workers='block',locale='pt-BR')
      c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
      c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');addEventListener('DOMContentLoaded',()=>{%s})"%PROP)
      pg=c.new_page();pg.goto('http://localhost:8951'+url);pg.wait_for_timeout(2500)
      print(W,url,pg.evaluate("()=>[...document.querySelectorAll('#home .hc .hlin,#grid .card .ph .ulin')].filter(s=>s.offsetWidth).slice(0,2).map(s=>{const c=s.closest('.hc,.card');const n=c.querySelector('.hn,.nm,.ref');const i=s.querySelector('i');return 'ponto '+Math.round(i.getBoundingClientRect().left)+' nome '+Math.round(n.getBoundingClientRect().left)})"));c.close()
finally: srv.terminate()
