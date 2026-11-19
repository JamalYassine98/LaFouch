from playwright.sync_api import sync_playwright
BLOQ=('google-analytics','googletagmanager','recaptcha')
INIT="try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}"
def ctx(b):
    c=b.new_context(viewport={'width':386,'height':858},device_scale_factor=3,is_mobile=True,has_touch=True)
    c.route('**/*',lambda r:r.abort() if any(k in r.request.url for k in BLOQ) else r.continue_())
    def js(r):
        resp=r.fetch();t=resp.text().replace('function manut(){','function manut(){CFG.ativo=true;',1);r.fulfill(response=resp,body=t)
    c.route('**/js/lf-site.js*',js)
    c.add_init_script(INIT);return c
MARCA="""([sel,n])=>{const e=document.querySelector(sel);if(!e)return null;const q=e.getBoundingClientRect(),z=parseFloat(getComputedStyle(document.body).zoom)||1,r={left:q.left/z,top:q.top/z,width:q.width/z,height:q.height/z};
 const d=document.createElement('div');d.style.cssText=`position:fixed;left:${r.left-6}px;top:${r.top-6}px;width:${r.width+12}px;height:${r.height+12}px;border:3px solid #b45309;border-radius:12px;z-index:99999;pointer-events:none`;
 const t=document.createElement('div');t.textContent=n;t.style.cssText=`position:fixed;left:${Math.max(4,r.left-20)}px;top:${r.top-26}px;width:32px;height:32px;border-radius:50%;background:#b45309;color:#fff;font:700 16px/32px Inter,sans-serif;text-align:center;z-index:99999`;
 document.body.append(d,t);return [r.left,r.top,r.width,r.height]}"""
with sync_playwright() as p:
    b=p.chromium.launch();c=ctx(b);pg=c.new_page()
    pg.goto('https://lafouch.com/?cliente=1&r=armazones',wait_until='load');pg.wait_for_selector('#grid .card .open',timeout=40000);pg.wait_for_timeout(2000)
    refs=pg.evaluate("()=>[...document.querySelectorAll('#grid .card')].slice(0,3).map(c=>(c.querySelector('[data-fav]')||{}).getAttribute?c.querySelector('[data-fav]').getAttribute('data-fav'):'')")
    print(refs)
    pg.evaluate("()=>{const c=document.querySelector('#grid .card .open');c&&c.click()}");pg.wait_for_timeout(2500)
    pg.evaluate("()=>document.querySelector('#layer [data-cmp]').scrollIntoView({block:'center',behavior:'instant'})");pg.wait_for_timeout(800)
    print(pg.evaluate(MARCA,['#layer [data-cmp]','16']));pg.wait_for_timeout(300)
    pg.screenshot(path='c16a.png')
    pg.evaluate("()=>[...document.body.children].filter(x=>x.style&&x.style.zIndex==='99999').forEach(x=>x.remove())")
    pg.evaluate("()=>document.querySelector('#layer [data-cmp]').click()");pg.wait_for_timeout(2000);pg.screenshot(path='c16b.png')
    c.close();c=ctx(b);pg=c.new_page()
    s='.'.join([r for r in refs if r][:2])
    pg.goto(f'https://lafouch.com/?cliente=1&s={s}&n=Maria',wait_until='load');pg.wait_for_timeout(5000);pg.screenshot(path='c39.png')
    b.close()
