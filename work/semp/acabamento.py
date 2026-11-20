# Acabamento da janela de baixo para o app todo (pergunta do dono 20/11 14:00–14:07): fundo desfocado + mesma altura.
# Janelas REAIS do app, sem mudar o conteúdo: Calculadora de preço, Novo lote (atacado), E se…? e a confirmação "Estornar a venda?" (meia altura).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/semp/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
JAN=[('Calculadora de preço','dash',"()=>window.__LF.ACT.cntCalc()",True),
     ('Novo lote (atacado)','ata',"()=>window.__LF.ACT.ataLoteNovo()",False),
     ('E se…?','dash',"()=>window.__LF.ACT.cntEse()",False),
     ('Estornar a venda?','hist',"()=>{const s=(window.__LF.S.sales||[])[0];const b=document.createElement('button');b.dataset.act='estorno';b.dataset.id=s.id||s.ts;document.body.appendChild(b);b.click()}",True)]
ACAB=r"""(meia)=>{const bk=[...document.querySelectorAll('.ljBk')].pop();const j=[...document.querySelectorAll('.ljJn')].filter(e=>e.getBoundingClientRect().height).pop();
 if(bk){bk.style.backdropFilter='blur(14px) saturate(120%)';bk.style.webkitBackdropFilter='blur(14px)';bk.style.background='rgba(0,0,0,.28)'}
 if(!j)return 'sem janela';
 if(meia){j.style.top='auto';j.style.height='50vh';j.style.maxHeight='none'}else{j.style.top='56px';j.style.height='calc(100vh - 56px)';j.style.maxHeight='none'}
 return Math.round(j.getBoundingClientRect().top)}"""
def tira(pg,nome):
  pg.wait_for_timeout(700);f='/tmp/acab_%s.png'%nome;pg.screenshot(path=f);return Image.open(f)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';linhas=[]
    for tit,tela,abre,meia in JAN:
      par=[]
      for fase in ('hoje','prop'):
        b,pg,w=ap.abre(pw,tela,esc,'celular',base=True)
        try: pg.evaluate(abre)
        except Exception as e: print(tit,'abre',str(e)[:80])
        w(1200)
        topo=pg.evaluate("()=>{const j=[...document.querySelectorAll('.ljJn')].filter(e=>e.getBoundingClientRect().height).pop();return j?Math.round(j.getBoundingClientRect().top):'sem'}")
        if fase=='prop': topo=pg.evaluate(ACAB,meia);w(400)
        print(n,tit,fase,'topo da janela:',topo)
        par.append(tira(pg,tit[:4]+fase+n));b.close()
      linhas.append((tit,meia,par))
    for i,(tit,meia,par) in enumerate(linhas):
      g=40;S=Image.new('RGB',(g+2*(780+g),1688+200),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S);fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
      d.text((g,24),tit,font=F(40),fill=fg);d.text((g,80),'cabe na metade → meia altura' if meia else 'não cabe na metade → altura grande',font=F(28),fill=mu)
      for k,(im,lb) in enumerate(zip(par,('HOJE','PROPOSTA · desfocado + altura certa'))):
        xx=g+k*(780+g);d.text((xx,140),lb,font=F(28),fill=fg);S.paste(im,(xx,190));d.rectangle([xx-1,189,xx+780,190+im.height],outline=(90,90,100))
      S.save(O+'esboco_acabamento_%d_%s.jpg'%(i+1,n),quality=86);print('ok',i+1,n)
