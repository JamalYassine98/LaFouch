# S374 · esboço 103 (bug do dono 17/11 14:29, vídeo): a "Lista de compras" aberta pisca toda vez que outro bloco abre/fecha.
# Causa: o cartão da lista usa a classe .lcCard, que é a mesma do cartão de "carregando foto" (#loadFoto) — e esse tem a animação
# de entrada lcNasce (sumir e voltar em 0,32 s). Cada vez que o Giro se redesenha (abrir/fechar outro bloco), a lista "nasce" de novo.
# Correção: a animação fica só no cartão de carregar foto (.lcOv .lcCard). Quadros: 0, 25, 50, 100 e 200 ms depois de tocar em "Vitrine da semana".
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from PIL import Image,ImageDraw,ImageFont
from playwright.sync_api import sync_playwright
FIX='.card.lcCard{animation:none!important}'
F=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
T=[0,25,50,100,200];linhas=[]
with sync_playwright() as pw:
    for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',True);pg.evaluate("()=>window.__LF.inicioGo('giro')");w(1200)
        if prop: pg.add_style_tag(content=FIX)
        pg.evaluate("()=>document.querySelector('[data-act=dfold][data-id=rep]').click()");w(1300)
        pg.evaluate("()=>{const e=document.querySelector('section.fxF[data-fx=rep]');scrollTo({top:e.getBoundingClientRect().top+scrollY-90,behavior:'instant'})}");w(300)
        ims=[];t0=0
        pg.evaluate("()=>document.querySelector('[data-act=dfold][data-id=vit]').click()")
        import time;ini=time.time()
        for t in T:
            while (time.time()-ini)*1000<t: time.sleep(0.003)
            p='/tmp/s349/q103_%d_%d.png'%(prop,t);pg.screenshot(path=p,clip={'x':0,'y':80,'width':390,'height':420});ims.append(Image.open(p))
        linhas.append(ims);b.close()
w,h=linhas[0][0].size;g=24;W=g+len(T)*(w//2+g);H=150+2*(h//2+70)
S=Image.new('RGB',(W,H),'#f1eef0');d=ImageDraw.Draw(S)
d.text((g,20),'App · Giro · bug: a Lista de compras pisca quando outro bloco abre',font=F(30,True),fill='#1d1418')
d.text((g,66),'Quadros 0 · 25 · 50 · 100 · 200 ms depois de tocar em "Vitrine da semana" (com a Lista de compras aberta).',font=F(19),fill='#55484f')
d.text((g,94),'Causa: a lista usa a mesma classe do cartão "carregando foto", que tem animação de entrada. Correção: a animação fica só nesse cartão.',font=F(19),fill='#55484f')
for r,(nm,ims) in enumerate(zip(('HOJE (some e volta)','PROPOSTA (fica parada)'),linhas)):
    y=140+r*(h//2+70);d.text((g,y),nm,font=F(24,True),fill='#8d3a69' if r else '#1d1418')
    for i,(t,im) in enumerate(zip(T,ims)):
        x=g+i*(w//2+g);S.paste(im.resize((w//2,h//2)),(x,y+34));d.text((x,y+34+h//2+4),'%d ms'%t,font=F(17),fill='#55484f')
S.save('/home/claude/lafouch/work/s374/103-app-giro-lista-pisca-quadros.jpg',quality=88);print(S.size)
