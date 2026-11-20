# S436 esboço 16: ficha da peça — chave "No site" diz o que falta; marca "Peça de teste"
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap;from telas import C
from playwright.sync_api import sync_playwright
O='/home/claude/lafouch/work/s436/banco/'
HOJE="()=>{const h=document.querySelector('#edSite .hint');if(h)h.textContent='entra sozinho quando estiver completo';}"
PROP="""()=>{const h=document.querySelector('#edSite .hint');if(h){h.textContent='falta formato e medidas';h.style.color='var(--warn)'}
 const sub=[...document.querySelectorAll('#detail *')].find(e=>/formato Sem detalhe/.test(e.textContent)&&e.children.length===0);
 if(sub){const t=document.createElement('div');t.textContent='Peça de teste · troque pelos dados reais';t.style.cssText='color:var(--warn);font-size:13px;margin:4px 0 0';sub.insertAdjacentElement('afterend',t)}}"""
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    for fase,js in (('hoje',HOJE),('prop',PROP)):
      b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True)
      for p in dict(C)['inventario-ficha']:
        try: pg.evaluate(p)
        except Exception: pass
        w(500)
      pg.evaluate(js);w(300)
      pg.evaluate("()=>{const e=document.getElementById('edSite'),t=[...document.querySelectorAll('#detail h1,#detail h2,#detail b')].find(x=>/Lote Kazwini/.test(x.textContent));const top=(t||e).getBoundingClientRect().top+scrollY;scrollTo(0,top-90)}");w(700)
      pg.screenshot(path=O+'f_%s_%s.png'%(fase,n))
      b.close()
from PIL import Image,ImageDraw,ImageFont
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',30);G=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',22)
for n,bg,fg in (('escuro',(14,17,22),(235,235,240)),('claro',(250,248,250),(30,30,36))):
  a=Image.open(O+'f_hoje_%s.png'%n);p=Image.open(O+'f_prop_%s.png'%n);H=max(a.height,p.height)
  c=Image.new('RGB',(a.width*2+60,H+120),bg);d=ImageDraw.Draw(c)
  d.text((20,16),'HOJE · Inventário › ficha',font=F,fill=fg);d.text((20,56),'peça sem formato e sem medidas vai ao site',font=G,fill=(150,150,160))
  d.text((a.width+40,16),'PROPOSTA',font=F,fill=fg);d.text((a.width+40,56),'diz o que falta · marca de teste',font=G,fill=(150,150,160))
  c.paste(a,(20,110));c.paste(p,(a.width+40,110));c.save(O+'esboco16_ficha_%s.jpg'%n,quality=88)
