from playwright.sync_api import sync_playwright
OV="()=>{const W=innerWidth;return [...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width>0&&r.right>W+1&&c.position!=='fixed'&&!e.closest('.relg,.hsc,.fcar,#faces,.chips,.dgr,.cthm,.hrow,[style*=overflow]')}).slice(0,5).map(e=>e.tagName+'.'+e.className)}"
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for w in (360,390,430):
        for nome,acts in [('home',[]),('cat',["document.querySelector('a[href=\"#vitrine\"]').click()"]),('peca',["document.querySelector(\"[data-open='GR3350']\").click()"]),('rosto',["document.querySelector('a[href=\"#rosto\"]').click()"])]:
            pg=b.new_page(viewport={'width':w,'height':800},is_mobile=True,has_touch=True,locale='pt-BR');er=[];pg.on('pageerror',lambda e:er.append(str(e)))
            pg.goto('http://localhost:8767/');pg.wait_for_timeout(2300)
            for a in acts: pg.evaluate(a);pg.wait_for_timeout(1500)
            print(w,nome,pg.evaluate("document.documentElement.scrollWidth"),pg.evaluate(OV),er[:2]);pg.close()
