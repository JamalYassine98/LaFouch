import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap
from playwright.sync_api import sync_playwright
from PIL import Image
src=open('fotos2.py').read();exec(src[src.index('NUV='):src.index('CAM=')])
BOX="()=>[...document.querySelectorAll('.modal .box,.modal>div,.sheet,.fmS,.bsheet,[class*=Sheet],[class*=sheet]')].filter(e=>{const r=e.getBoundingClientRect();return r.height>100&&r.width>300}).map(e=>(e.className.toString().slice(0,30)+' top='+Math.round(e.getBoundingClientRect().top)+' bot='+Math.round(e.getBoundingClientRect().bottom)))"
ims=[]
def foto(pg,n):
  pg.screenshot(path='/tmp/j_%s.png'%n);ims.append(Image.open('/tmp/j_%s.png'%n).convert('RGB'));print(n,pg.evaluate(BOX))
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=False);w(800);pg.evaluate("()=>__LF.inicioGo('prec')");w(900)
  pg.evaluate("()=>{const b=[...document.querySelectorAll('.view:not([hidden]) button')].find(b=>/⏻|Preço automático|liga/i.test((b.getAttribute('aria-label')||'')+b.title)||b.querySelector('svg')&&b.getBoundingClientRect().top<200&&b.getBoundingClientRect().left>300);b&&b.setAttribute('data-esb','1')}")
  pg.locator('[data-esb]').first.click();w(1200);foto(pg,'precos_power');b.close()
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=False);w(800);pg.evaluate("()=>__LF.inicioGo('desp')");w(900)
  toca(pg,'+ Nova');w(1200);foto(pg,'despesa_nova');b.close()
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=False);w(900);toca(pg,'Peças');w(300)
  pg.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(b=>/Filtr|filtr/.test((b.getAttribute('aria-label')||'')));b&&b.setAttribute('data-esb','1')}");
  try:pg.locator('[data-esb]').first.click(timeout=3000)
  except Exception:pass
  w(1200);foto(pg,'filtros');b.close()
W=sum(i.width for i in ims)+40;o=Image.new('RGB',(W,ims[0].height),(60,60,60));x=0
for i in ims:o.paste(i,(x,0));x+=i.width+20
o.resize((o.width//2,o.height//2)).save('/tmp/jan.jpg',quality=80)
