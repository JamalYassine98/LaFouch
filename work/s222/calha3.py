from playwright.sync_api import sync_playwright
JS="""()=>{const W=innerWidth;const m=e=>e?Math.round(W-e.getBoundingClientRect().right):null;const q=s=>document.querySelector(s);const hc=[...document.querySelectorAll('#home .hc')].filter(e=>e.getBoundingClientRect().width);let mr=0;hc.forEach(e=>{mr=Math.max(mr,e.getBoundingClientRect().right)});
return {home:m(q('#home')),pad:getComputedStyle(q('#home')).paddingRight,dest:m(q('#hdst')),cards:Math.round(W-mr),zoomBody:getComputedStyle(document.body).zoom,zoomHtml:getComputedStyle(document.documentElement).zoom,z:getComputedStyle(document.documentElement).getPropertyValue('--z'),wa:(()=>{const r=q('a.wa').getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)]})(),cls:document.documentElement.className}}"""
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for W,H in ((320,568),(360,640),(390,844),(430,932),(600,960),(768,1024),(820,1180),(844,390)):
        for z in '012':
            c=b.new_context(viewport={'width':W,'height':H},is_mobile=W<900,has_touch=True,locale='es-PY',service_workers='block');c.add_init_script("sessionStorage.setItem('lf_ni','1');try{localStorage.setItem('lf_zoom','%s')}catch(_){}"%z);c.route('**/*',rota)
            pg=c.new_page();pg.goto('http://localhost:8811/');pg.wait_for_timeout(2300);print(W,'letra',z,pg.evaluate(JS));c.close()
