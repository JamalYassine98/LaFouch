from playwright.sync_api import sync_playwright
FIX="""()=>{document.querySelectorAll('.hc').forEach(c=>{const a=c.querySelector('.hds'),b=c.querySelector('.hn');if(a&&b){const s=document.createElement('small');s.textContent=a.textContent;s.style.cssText='display:block;font-size:13px;font-weight:400;color:var(--mu);letter-spacing:0;margin-bottom:2px';b.prepend(s);b.style.paddingTop='10px';a.remove();s.style.whiteSpace='nowrap';s.style.overflow='hidden';if(s.scrollWidth>s.clientWidth+1)s.textContent=s.textContent.split(' · ')[0]}})}"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for k in ('hoje','fix'):
        pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale='pt-BR')
        pg.goto('http://localhost:8768/');pg.wait_for_timeout(2800)
        pg.evaluate("document.body.style.zoom='1.35'")
        if k=='fix': pg.evaluate(FIX)
        pg.evaluate("()=>{var c=[...document.querySelectorAll('.hc')].find(x=>x.querySelector('.hn.lfcod'));c.scrollIntoView({block:'center'})}");pg.wait_for_timeout(700)
        pg.screenshot(path='al_%s.png'%k)
        print(k,pg.evaluate("()=>[...document.querySelectorAll('.hc')].filter(c=>c.querySelector('.hn.lfcod')).slice(0,2).map(c=>{const b=c.querySelector('.hn.lfcod');const t=b.querySelector('small')||c.querySelector('.hds');const r1=document.createRange();r1.selectNodeContents(t);const r2=document.createRange();r2.selectNodeContents(b.lastChild||b);return Math.round(r1.getBoundingClientRect().left-r2.getBoundingClientRect().left)})"))
        pg.close()
