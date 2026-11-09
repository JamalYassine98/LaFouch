from playwright.sync_api import sync_playwright
M="""()=>{const o=[];document.querySelectorAll('.hc').forEach(c=>{const a=c.querySelector('.hds'),b=c.querySelector('.hn');if(a&&b){const ra=document.createRange();ra.selectNodeContents(a);const rb=document.createRange();rb.selectNodeContents(b);o.push(['home',Math.round(ra.getBoundingClientRect().left-rb.getBoundingClientRect().left),getComputedStyle(a).paddingLeft,getComputedStyle(b).paddingLeft,getComputedStyle(a).fontFamily.slice(0,20),getComputedStyle(b).letterSpacing])}});
 document.querySelectorAll('#grid .card').forEach(c=>{const a=c.querySelector('.lfds'),b=c.querySelector('.nm');if(a&&b){const ra=document.createRange();ra.selectNodeContents(a);const rb=document.createRange();rb.selectNodeContents(b);o.push(['grid',Math.round(ra.getBoundingClientRect().left-rb.getBoundingClientRect().left)])}});return o.slice(0,6)}"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=3,is_mobile=True,has_touch=True,locale='pt-BR')
    pg.goto('http://localhost:8768/');pg.wait_for_timeout(2800)
    print(pg.evaluate(M))
    pg.evaluate("document.querySelector('a[href=\"#vitrine\"]').click()");pg.wait_for_timeout(1800);print(pg.evaluate(M))
