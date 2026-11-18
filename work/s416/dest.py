import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
PROP=open('prop_sistema.js').read()
srv=subprocess.Popen([sys.executable,'srv.py','8973','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,H in [(320,640),(390,844),(768,1024),(1440,900)]:
     for z in ('0','2'):
      for v in ('hoje','prop'):
        c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<700,has_touch=W<1100,service_workers='block',locale='pt-BR')
        c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_zoom','%s');"%z+("addEventListener('DOMContentLoaded',()=>{%s})"%PROP if v=='prop' else ''))
        pg=c.new_page();pg.goto('http://localhost:8973/');pg.wait_for_timeout(2500)
        r=pg.evaluate("""()=>{const h=document.querySelector('#hdst h1');const z=(e)=>{let k=1;for(let x=e;x;x=x.parentElement)k*=parseFloat(getComputedStyle(x).zoom)||1;return k};const px=parseFloat(getComputedStyle(h).fontSize)*z(h);
          const pr=document.querySelector('#hdst .hpr');const lab=document.querySelector('#hdst .hlb');const bloco=h.parentElement.getBoundingClientRect();
          // quantas linhas teria com 36 (degrau maior) no desenho
          const lh=parseFloat(getComputedStyle(h).lineHeight)||px*1.1;const lin=Math.round(h.getBoundingClientRect().height/(lh*z(h)));
          const c=document.createElement('canvas').getContext('2d');const cs=getComputedStyle(h);const bz=(parseFloat(getComputedStyle(document.body).zoom)||1);
          const w=h.getBoundingClientRect().width;const t=h.textContent.trim();
          const teste=(d)=>{c.font=cs.fontWeight+' '+(d*bz*(innerWidth>=1100?1.2:1))+'px '+cs.fontFamily;return Math.ceil(c.measureText(t).width/w)};
          return {titulo:+px.toFixed(1),preco:pr?+(parseFloat(getComputedStyle(pr).fontSize)*z(pr)).toFixed(1):null,rotulo:lab?+(parseFloat(getComputedStyle(lab).fontSize)*z(lab)).toFixed(1):null,linhas_hoje:lin,linhas_com_36:teste(36),linhas_com_32:teste(32),texto:t}}""")
        print(W,'letra',z,v,r);c.close()
finally: srv.terminate()
