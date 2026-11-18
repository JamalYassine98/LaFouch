import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
PROP=open('prop121.js').read()
srv=subprocess.Popen([sys.executable,'-m','http.server','8946','-d','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,url in [(390,'/')]:
     for v in ('h','p'):
      c=b.new_context(viewport={'width':W,'height':844},is_mobile=W<700,has_touch=W<1100,service_workers='block',locale='pt-BR')
      c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
      c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_zoom','0');"+("addEventListener('DOMContentLoaded',()=>{%s})"%PROP if v=='p' else ''))
      pg=c.new_page();pg.goto('http://localhost:8946'+url);pg.wait_for_timeout(2500)
      if W==390: print(pg.evaluate("()=>{const e=document.querySelector('#mnb');const r=e.getBoundingClientRect();const a=getComputedStyle(e,'::before');const o=[...document.querySelectorAll('a[href],button')].filter(x=>{const q=x.getBoundingClientRect();return q.width&&x!==e&&Math.abs(q.left-r.left)<60&&Math.abs(q.top-r.top)<60}).map(x=>x.className+'@'+Math.round(x.getBoundingClientRect().left)+','+Math.round(x.getBoundingClientRect().top)+' '+Math.round(x.getBoundingClientRect().width)+'x'+Math.round(x.getBoundingClientRect().height));return o.join(' ; ')+' || '+ e.className+' '+e.style.cssText+' rect '+Math.round(r.width)+'x'+Math.round(r.height)+' before:'+a.content+' '+a.top+' '+a.width}"))
      else: pg.screenshot(path='cat1440_%s.png'%v);print(pg.evaluate("()=>[location.href,document.elementFromPoint(700,400)?.className, !!document.querySelector('#layer .scrim.pg')]"))
      c.close()
finally: srv.terminate()
