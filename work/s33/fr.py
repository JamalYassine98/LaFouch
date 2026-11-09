from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
import time,sys
U='http://localhost:8768/'
CEN=[('destaque',["document.querySelector('.hdt [data-open], .hero [data-open]').click()"]),
     ('novidade',["window.scrollTo(0,700)","document.querySelector('.hc[data-open], .hc [data-open], [data-hsec] [data-open]').click()"]),
     ('rosto',["document.querySelector('a[href=\"#rosto\"]').click()"]),
     ('rosto_rolado',["window.scrollTo(0,900)","document.querySelector('a[href=\"#rosto\"]').click()"])]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for nome,acts in CEN:
        ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR');pg=ctx.new_page()
        cdp=ctx.new_cdp_session(pg);cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
        er=[];pg.on('pageerror',lambda e:er.append(str(e)))
        pg.goto(U);pg.wait_for_timeout(1500)
        for a in acts: pg.evaluate(a);pg.wait_for_timeout(900)
        pg.wait_for_timeout(600)
        fr=[];
        pg.screenshot(path='/tmp/f.png');fr.append((0,Image.open('/tmp/f.png').copy()))
        try: pg.locator('.top .logo').first.tap(timeout=3000)
        except Exception as e: print(nome,'logo não tocável',str(e)[:80])
        t0=time.time()
        for i in range(11):
            pg.screenshot(path='/tmp/f.png');fr.append((round((time.time()-t0)*1000),Image.open('/tmp/f.png').copy()));pg.wait_for_timeout(60)
        W=160;c=Image.new('RGB',(W*12+12*8,370),'#333');d=ImageDraw.Draw(c)
        for k,(t,im) in enumerate(fr): c.paste(im.resize((W,346)),(k*(W+8),20));d.text((k*(W+8)+3,4),('antes' if k==0 else '%d ms'%t),fill='white')
        c.save('fr_%s.png'%nome);print(nome,er[:2],pg.evaluate("[scrollY,location.pathname]"));ctx.close()
