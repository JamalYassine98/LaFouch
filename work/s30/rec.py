from playwright.sync_api import sync_playwright
import time,json
CEN=[('peca',["window.scrollTo(0,600)","document.querySelector(\"[data-open='GR3340']\").click()"]),
     ('catpeca',["document.querySelector('a[href=\"#vitrine\"]').click()","document.querySelector('#grid [data-open]').click()"]),
     ('categoria',["document.querySelector('a[href=\"#vitrine\"]').click()"])]
T={}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for v,u in (('hoje','http://localhost:8767/'),('novo','http://localhost:8767/?logo2=1')):
        for nome,acts in CEN:
            ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR',record_video_dir='rv/%s_%s'%(v,nome),record_video_size={'width':390,'height':844})
            t0=time.time();pg=ctx.new_page();pg.goto(u);pg.wait_for_timeout(2500)
            for a in acts: pg.evaluate(a);pg.wait_for_timeout(1600)
            T['%s_%s'%(v,nome)]=time.time()-t0
            pg.locator('.top .logo').first.tap();pg.wait_for_timeout(1800);ctx.close()
json.dump(T,open('rv/t.json','w'))
