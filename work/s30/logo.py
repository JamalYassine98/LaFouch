from playwright.sync_api import sync_playwright
import json
W="""()=>{const L=document.getElementById('layer');if(!L)return location.href;const pop=[...document.querySelectorAll('.sec.pop')].map(e=>e.id).join(',');
 return location.pathname+' lay:'+(L.innerHTML.trim()?L.firstElementChild.className:'')+' pn:'+pop+' ppop:'+document.documentElement.classList.contains('ppop')+' y:'+Math.round(scrollY)+' st:'+JSON.stringify(history.state)+' hl:'+history.length}"""
CEN=[('peca',["document.querySelector(\"[data-open='GR3340']\").click()"]),
     ('categoria',["document.querySelector('a[href=\"#vitrine\"]').click()"]),
     ('novidades',["document.querySelector('[data-mf]').click()"]),
     ('cat→peca',["document.querySelector('a[href=\"#vitrine\"]').click()","document.querySelector('#grid [data-open]').click()"])]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for nome,acts in CEN:
        ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR',record_video_dir='s30/vid_'+nome.replace('→','_'))
        pg=ctx.new_page();pg.goto('http://localhost:8767/');pg.wait_for_timeout(2500)
        pg.evaluate("window.scrollTo(0,600)");pg.wait_for_timeout(400)
        for a in acts: pg.evaluate(a);pg.wait_for_timeout(1500)
        print('##',nome,pg.evaluate(W))
        pg.locator('.top .logo').first.tap();
        for t in (150,400,800,1500): pg.wait_for_timeout(t if t==150 else t-[150,400,800][[400,800,1500].index(t)]);print('  logo+%d'%t,pg.evaluate(W))
        try:
            pg.go_back(timeout=2500);pg.wait_for_timeout(1200);print('  depois voltar',pg.evaluate(W))
        except Exception as e: print('  depois voltar: saiu')
        ctx.close()
