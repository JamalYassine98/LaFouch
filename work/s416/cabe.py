import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
PROP=open('prop_sistema.js').read()
srv=subprocess.Popen([sys.executable,'srv.py','8972','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,H in [(320,640),(360,780),(390,844),(1440,900)]:
     for z in ('0','2'):
      c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<700,has_touch=W<1100,service_workers='block',locale='pt-BR')
      c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
      c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_zoom','%s');addEventListener('DOMContentLoaded',()=>{%s})"%(z,PROP))
      pg=c.new_page();pg.goto('http://localhost:8972/');pg.wait_for_timeout(2500)
      r=pg.evaluate("""()=>{const e=document.querySelector('#home .hc .hn');const cs=getComputedStyle(e);const w=e.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
        const c=document.createElement('canvas').getContext('2d');c.font=cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily;
        const nomes=[...document.querySelectorAll('#home .hc .hn')].map(x=>x.textContent.trim());const L='Armação acetato redonda rosa transparente';let n=0;while(n<L.length&&c.measureText(L.slice(0,n+1)).width<=w)n++;
        return {cabe_letras:n,nomes_que_cortam:nomes.filter(t=>c.measureText(t).width>w).length,total:nomes.length,maior_nome:Math.max(...nomes.map(t=>t.length))}}""")
      print(W,'letra',z,r);c.close()
finally: srv.terminate()
