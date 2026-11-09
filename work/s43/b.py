from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
import time
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR')
    ctx.add_init_script("document.addEventListener('animationstart',e=>{(window.__as=window.__as||[]).push([Math.round(performance.now()),e.animationName,(e.target.className||'').toString().slice(0,25)])},true)")
    pg=ctx.new_page();pg.goto('http://localhost:8768/');pg.wait_for_timeout(3000)
    pg.reload();fr=[];t0=time.time()
    for i in range(14):
        pg.screenshot(path='/tmp/f.png');fr.append((round((time.time()-t0)*1000),Image.open('/tmp/f.png').copy()));pg.wait_for_timeout(70)
    print(pg.evaluate("(window.__as||[]).slice(0,40)"))
    W=150;c=Image.new('RGB',(W*14+14*6,350),'#333');d=ImageDraw.Draw(c)
    for k,(t,im) in enumerate(fr): c.paste(im.resize((W,325)),(k*(W+6),20));d.text((k*(W+6)+3,4),'%d ms'%t,fill='white')
    c.save('reload.png')
