from playwright.sync_api import sync_playwright
import json
U='http://localhost:8768/'
W="""()=>location.pathname+' lay:'+(document.getElementById('layer').innerHTML.trim()?1:0)+' ppop:'+document.documentElement.classList.contains('ppop')+' y:'+Math.round(scrollY)+' st:'+JSON.stringify(history.state)"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for nome,acts in [('peca',["window.scrollTo(0,600)","document.querySelector(\"[data-open='GR3340']\").click()"]),('cat→peca→peca',["document.querySelector('a[href=\"#vitrine\"]').click()","document.querySelector('#grid [data-open]').click()","document.querySelector('.pgm [data-open]').click()"]),('menu',["document.querySelector('[data-dopen],#mbtn,.bar [aria-label*=enu]').click()"])]:
        pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR');er=[];pg.on('pageerror',lambda e:er.append(str(e)))
        pg.goto(U);pg.wait_for_timeout(2500)
        for a in acts: pg.evaluate(a);pg.wait_for_timeout(1500)
        pg.locator('.top .logo').first.tap();pg.wait_for_timeout(1500);print(nome,pg.evaluate(W),er)
        try: pg.go_back(timeout=2500);pg.wait_for_timeout(800);print('  voltar',pg.evaluate(W))
        except Exception: print('  voltar: sai do site')
