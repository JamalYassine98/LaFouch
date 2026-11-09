from playwright.sync_api import sync_playwright
from PIL import Image
import time
CEN=[('peca',["window.scrollTo(0,600)","document.querySelector(\"[data-open='GR3340']\").click()"]),
     ('categoria',["document.querySelector('a[href=\"#vitrine\"]').click()"]),
     ('catpeca',["document.querySelector('a[href=\"#vitrine\"]').click()","document.querySelector('#grid [data-open]').click()"])]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for nome,acts in CEN:
        pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR')
        pg.goto('http://localhost:8767/');pg.wait_for_timeout(2500)
        for a in acts: pg.evaluate(a);pg.wait_for_timeout(1600)
        fr=[];pg.locator('.top .logo').first.tap();t0=time.time()
        for i in range(10):
            pg.screenshot(path='/tmp/f.png');fr.append((round((time.time()-t0)*1000),Image.open('/tmp/f.png').copy()))
            pg.wait_for_timeout(90)
        W=195;c=Image.new('RGB',(W*10+90,440),'#333')
        from PIL import ImageDraw
        d=ImageDraw.Draw(c)
        for k,(t,im) in enumerate(fr):
            c.paste(im.resize((W,422)),(k*(W+9),18));d.text((k*(W+9)+4,2),'%d ms'%t,fill='white')
        c.save('s30/fr_%s.png'%nome);pg.close()
