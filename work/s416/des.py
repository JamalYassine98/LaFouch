import sys,time,subprocess,json
from playwright.sync_api import sync_playwright
PROP=open('../s415/prop121.js').read()+'\n'+open('prop_sistema.js').read()
srv=subprocess.Popen([sys.executable,'srv.py','8975','/home/claude/catalogo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    c=b.new_context(viewport={'width':768,'height':1024},has_touch=True,service_workers='block',locale='pt-BR')
    c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    c.add_init_script("sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');addEventListener('DOMContentLoaded',()=>{%s})"%PROP)
    pg=c.new_page();pg.goto('http://localhost:8975/');pg.wait_for_timeout(2500)
    print(json.dumps(pg.evaluate("""()=>{const rows={};[...document.querySelectorAll('#home .hc')].forEach(c=>{const r=c.getBoundingClientRect();if(!r.width)return;const p=c.querySelector('.hp');if(!p)return;(rows[Math.round(r.top+scrollY)]=rows[Math.round(r.top+scrollY)]||[]).push(c)});
     return Object.values(rows).filter(v=>v.length>1).map(v=>{const ys=v.map(c=>Math.round(c.querySelector('.hp').getBoundingClientRect().top));if(Math.max(...ys)-Math.min(...ys)<2)return null;return v.map(c=>({n:c.querySelector('.hn').textContent.trim(),y:Math.round(c.querySelector('.hp').getBoundingClientRect().top),kids:[...c.children].map(k=>k.className+':'+Math.round(k.getBoundingClientRect().height))}))}).filter(Boolean)}"""),ensure_ascii=False,indent=0)[:1500])
finally: srv.terminate()
