import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap
from playwright.sync_api import sync_playwright
from PIL import Image
src=open('voltar.py').read();exec(src[src.index('ONDE='):src.index('# caminhos')]);src2=open('voltar2.py').read();exec(src2[src2.index('ABA='):src2.index('R=[]')])
def jogo(pg,w,passos):
  ims=[]
  for kind,arg in passos:
    if kind=='aba':pg.evaluate(ABA,arg)
    elif kind=='toca':pg.evaluate(CLICA,arg)
    elif kind=='nav':pg.evaluate("()=>{setTimeout(()=>history.back(),0)}")
    elif kind=='and':pg.evaluate("()=>window.__nvVoltarAndroid()")
    w(1000);f='/tmp/s%d.png'%len(ims);pg.screenshot(path=f);ims.append(Image.open(f).convert('RGB'))
  return ims
out=[]
with sync_playwright() as pw:
  for nome,p in (('estudio_android',[('aba','Peças'),('toca','Estúdio'),('and',0)]),('regras_navegador',[('toca','Preços'),('toca','Regras'),('nav',0)])):
    b,pg,w=ap.abre(pw,'inicio',True,'celular',base=False);w(800);ims=jogo(pg,w,p);b.close()
    W=sum(i.width for i in ims)+20*len(ims);o=Image.new('RGB',(W,ims[0].height),(17,20,26));x=0
    for i in ims:o.paste(i,(x,0));x+=i.width+20
    o.save('voltar_%s.jpg'%nome,quality=80);print(nome,len(ims))
