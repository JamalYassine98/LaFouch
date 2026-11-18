import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
PROP=open('prop121.js').read()
srv=subprocess.Popen([sys.executable,'srv.py','8955','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
J="""(q)=>{const c=[...document.querySelectorAll(q)].find(x=>x.querySelector('.ulin,.hlin'));if(!c)return null;const f=e=>e?Math.round(parseFloat(getComputedStyle(e).fontSize)*(e.getBoundingClientRect().height/(e.offsetHeight||1)||1)*10)/10:null;
return {cartao_larg:Math.round(c.getBoundingClientRect().width),aviso:f(c.querySelector('.ulin,.hlin')),sku:f(c.querySelector('.ref')),nome:f(c.querySelector('.nm,.hn')),preco:f(c.querySelector('.pr,.hp'))}}"""
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W in (390,768,1440,1920):
      for url,q in [('/?r=armacoes','#grid .card'),('/','#home .hc')]:
        c=b.new_context(viewport={'width':W,'height':900},is_mobile=W<700,has_touch=W<1100,service_workers='block',locale='pt-BR')
        c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');addEventListener('DOMContentLoaded',()=>{%s})"%PROP)
        pg=c.new_page();pg.goto('http://localhost:8955'+url);pg.wait_for_timeout(2500)
        print(W,'catalogo' if 'r=' in url else 'inicio',pg.evaluate(J,q));c.close()
finally: srv.terminate()
