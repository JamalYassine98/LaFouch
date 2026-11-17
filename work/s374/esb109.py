# S374 · esboço 109 (dono 17/11 18:18): as setas ⌄ que abrem no lugar (estilo Apple) giram no sentido horário; ele quer anti-horário.
# Quadros lado a lado (sem GIF): a seta da linha "Aluguel da loja" (Despesas) em 0, 25, 50, 75 e 100 % do giro.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',30);f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',24)
with sync_playwright() as pw:
  for esc,tema in ((False,'claro'),(True,'escuro')):
    b,pg,w=ap.abre(pw,'inicio',esc);w(600);pg.evaluate("()=>window.__LF.setView('desp')");w(1300)
    pg.evaluate("()=>{const e=document.querySelector('#v-desp .ecF');scrollTo({top:e.getBoundingClientRect().top+scrollY-200,behavior:'instant'})}");w(300)
    box=pg.evaluate("()=>{const r=document.querySelector('#v-desp .ecF').getBoundingClientRect();return [r.left,r.top,r.width,r.height]}")
    lin={}
    for nome,sg in (('hoje',1),('prop',-1)):
      fr=[]
      for p in (0,45,90,135,180):
        pg.evaluate("a=>{document.querySelector('#v-desp .ecF .ecCh').style.transform='rotate('+a+'deg)';document.querySelector('#v-desp .ecF .ecCh').style.display='inline-block'}",sg*p);w(80)
        x,y,ww,hh=box;fn='/tmp/f109_%s_%d.png'%(nome,p)
        pg.screenshot(path=fn,clip={'x':x+ww-90,'y':y,'width':90,'height':hh});fr.append(Image.open(fn))
      lin[nome]=fr
    b.close()
    W=fr[0].width*2;H=fr[0].height*2;pad=30
    out=Image.new('RGB',(pad+5*(W+20)+pad,260+2*(H+90)),'#f1eef0');d=ImageDraw.Draw(out)
    d.text((pad,24),'App · seta ⌄ que abre no lugar · giro ao abrir · tema '+tema,font=F,fill='#111')
    d.text((pad,70),'Hoje: gira no sentido horário (no meio do giro aponta para a esquerda).',font=f,fill='#444')
    d.text((pad,104),'Proposta: gira no sentido anti-horário (no meio aponta para a direita). Ao fechar volta pelo mesmo caminho.',font=f,fill='#444')
    d.text((pad,138),'Vale para todas: Despesas, Contas, Histórico, Marketing, linhas juntas (Giro, Dashboard…). Ajustes já gira assim.',font=f,fill='#444')
    for i,(nome,tit,cor) in enumerate((('hoje','HOJE','#111'),('prop','PROPOSTA','#8d3a69'))):
      y0=190+i*(H+90);d.text((pad,y0),tit,font=F,fill=cor)
      for j,im in enumerate(lin[nome]):
        x0=pad+j*(W+20);out.paste(im.resize((W,H)),(x0,y0+44));d.text((x0,y0+48+H),['fechada','¼','metade','¾','aberta'][j],font=f,fill='#666')
    out.save('109-app-seta-giro-%s.jpg'%tema,quality=90);print(tema,out.size)
