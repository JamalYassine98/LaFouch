from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
import time
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',18)
rows=[]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for lab,u in (('HOJE','?sim=1'),('PROPOSTA','?sim=1&fix=1')):
        ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,locale='pt-BR');pg=ctx.new_page()
        cdp=ctx.new_cdp_session(pg);cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
        pg.goto('http://localhost:8768/'+u);pg.wait_for_timeout(1150);fr=[];t0=time.time()
        for i in range(9):
            pg.screenshot(path='/tmp/f.png',clip={'x':0,'y':60,'width':390,'height':420});fr.append(Image.open('/tmp/f.png').copy());pg.wait_for_timeout(25)
        rows.append((lab,fr));ctx.close()
W=195;H=210;c=Image.new('RGB',(W*9+9*6+130,2*H+40),'#efe9ee');d=ImageDraw.Draw(c)
for r,(lab,fr) in enumerate(rows):
    d.text((8,20+r*(H+10)+H//2),lab,fill='#3a1f36',font=F)
    for k,im in enumerate(fr): c.paste(im.resize((W,H)),(130+k*(W+6),20+r*(H+10)))
c.save('S43_quadros.png')
