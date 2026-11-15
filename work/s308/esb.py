# S308: esboços "menos botões no pagamento" — um arquivo por tela, Hoje × Proposta lado a lado (celular), telas reais + olho.js (parado e rolado).
import sys,os,json;sys.path.insert(0,'/home/claude/lafouch/work/s308');import base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s308/';T='/tmp/s308/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
OLHO=open('/home/claude/lafouch/work/kit/olho.js').read();LX=os.environ.get('ESB') in ('luxo','luxo2');L2=os.environ.get('ESB')=='luxo2';PROP=open(OUT+('luxo' if LX else 'prop')+'.js').read()  # ESB=luxo → versão de luxo (S309)
def olho(pg,w):
    r=[]
    for rola in (0,1):
        pg.evaluate("r=>{const o=document.getElementById('pkok');o.scrollTop=r?o.scrollHeight:0;window.scrollTo(0,r?document.body.scrollHeight:0)}",rola);w(400)
        for f in pg.evaluate(OLHO) or []: r.append((('rolado' if rola else 'parado'),f['r'],tuple(f.get('ex') or [])))
    pg.evaluate("()=>{document.getElementById('pkok').scrollTop=0;window.scrollTo(0,0)}");w(300)
    return set(r)
def uma(pw,kw,prop,alto):
    b,pg,w=base.abre(pw,**kw)
    if prop is not None: print('   inj:',pg.evaluate(PROP,prop));w(500)
    fl=olho(pg,w)
    if alto: pg.set_viewport_size({'width':390,'height':alto});w(500)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}');w(300)
    p=T+'t%d.png'%uma.n;uma.n+=1;pg.screenshot(path=p);b.close();return p,fl
uma.n=0
def prancha(nome,titulo,sub,cols):
    ims=[Image.open(p) for p,_ in cols];w,h=ims[0].size;g=40;top=250;W=g+len(ims)*(w+g);H=top+h+g
    S=Image.new('RGB',(W,H),'#f1eef0');d=ImageDraw.Draw(S)
    d.text((g,34),titulo,font=F(44,True),fill='#1d1418');d.text((g,98),sub,font=F(27),fill='#55484f')
    for i,(im,(p,r)) in enumerate(zip(ims,cols)):
        x=g+i*(w+g);d.text((x,170),r,font=F(34,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,top));d.rectangle([x-1,top-1,x+w,top+h],outline='#cfc6cb')
    S.convert('RGB').save(OUT+('luxo2-' if L2 else 'luxo-' if LX else '')+nome,quality=86);print('  ',nome,S.size)
with sync_playwright() as pw:
    TELAS=[('1-pagar.jpg','Tela de pagar (PIX) · 2 min depois do pedido',('Luxo: uma ação cheia (copiar), contagem calma numa linha, o resto em link fino.' if LX else 'Hoje: 4 botões e o comprovante só aos 10 min.  Proposta: 2 botões + "Mais opções".'),dict(minutos=2),1250,[(None,'HOJE'),(False,'LUXO' if LX else 'PROPOSTA'),(True,('LUXO' if LX else 'PROPOSTA')+' · Mais opções aberto')]),
           ('2-reserva-encerrada.jpg','Reserva encerrada (30 min sem pagar)',('Luxo: a ação cheia recupera a venda; quem já pagou envia o comprovante pelo link.' if LX else 'Hoje: quem pagou vai para o WhatsApp.  Proposta: envia o comprovante aqui mesmo.'),dict(minutos=31),0,[(None,'HOJE'),(False,'LUXO' if LX else 'PROPOSTA')]),
           ('3-comprovante-enviado.jpg','Comprovante enviado',('Luxo: uma saída só, texto mais curto.' if LX else 'Hoje: 2 saídas.  Proposta: 1 (o WhatsApp só aparece se o envio falhar).'),dict(minutos=2,comp=True),0,[(None,'HOJE'),(False,'LUXO' if LX else 'PROPOSTA')])]
    if L2: TELAS=[('1-pagar.jpg','Tela de pagar (PIX) · 2 min depois do pedido','Recomendado: sem "Mais opções". O menu do topo já funciona nesta tela; ficam dois links discretos.',dict(minutos=2),1250,[(None,'HOJE'),('direto','LUXO · recomendado')])]
    for nome,tit,sub,kw,alto,cols in TELAS:
        print(nome);res=[];hoje=None
        for prop,rot in cols:
            if kw.get('comp') : kw2=dict(kw,minutos=11) # hoje o comprovante só existe aos 10 min
            else: kw2=kw
            p,fl=uma(pw,kw2,prop,alto);res.append((p,rot))
            if prop is None: hoje=fl;print('   hoje:',len(fl),'achados')
            else: print('   novas falhas x hoje:',sorted(fl-hoje) or 'nenhuma')
        prancha(nome,tit,sub,res)
