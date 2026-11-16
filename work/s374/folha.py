import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.argv=['x'];import ap
from playwright.sync_api import sync_playwright
from PIL import Image
TELAS=['notif','inicio','estoque','caixa','fx','desp','hist','dash','ped','vendas']
ims=[]
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True);w(800)
    for t in TELAS:
        pg.evaluate("t=>{window.__LF.setView(t);scrollTo(0,0)}",t);w(1000)
        pg.set_viewport_size({'width':390,'height':1500});w(300);p='/tmp/s371/f_%s.png'%t;pg.screenshot(path=p);ims.append(Image.open(p).resize((390,1500)))
        pg.set_viewport_size({'width':390,'height':844})
    b.close()
S=Image.new('RGB',(390*5,3000));[S.paste(im,((i%5)*390,(i//5)*1500)) for i,im in enumerate(ims)];S.save('/tmp/s371/folha.jpg',quality=80)
