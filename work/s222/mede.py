# S222: mede o cabeçalho (o que há nele e os vãos) nos aparelhos de toque, em cada tela
import json
from playwright.sync_api import sync_playwright
AP=[('celular pequeno',320,568),('celular',360,640),('iPhone',390,844),('iPhone Max',430,932),('celular deitado',844,390),('tablet pequeno',600,960),('iPad em pé',768,1024),('iPad Air em pé',820,1180)]
JS="""()=>{const t=document.querySelector('.top');const R=e=>{const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]};
const k=[...t.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!='hidden'&&(e.matches('a,button,img,svg,b,h1,span')&&!e.closest('svg svg')&&(e.tagName!='svg'||!e.closest('a,button')))}).map(e=>[e.tagName+(e.id?'#'+e.id:'')+'.'+String(e.className.baseVal??e.className).split(' ')[0],R(e),(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,18)]);
const w=document.querySelector('a.wa');const s=getComputedStyle(t);return {top:R(t),pos:s.position,z:s.zIndex,wa:w?R(w):null,waz:w?getComputedStyle(w).zIndex:null,cls:document.documentElement.className,k}}"""
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for n,W,H in AP:
        c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<900,has_touch=True,locale='es-PY',service_workers='block');c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',rota)
        for url in ('','?r=armazones'):
            pg=c.new_page();pg.goto('http://localhost:8811/'+url);pg.wait_for_timeout(2600);d=pg.evaluate(JS)
            print(n,W,url or 'inicio','top',d['top'],d['pos'],'z',d['z'],'wa',d['wa'],d['waz'],d['cls'][:60]);
            for x in d['k']: print('   ',x)
            pg.close()
        c.close()
