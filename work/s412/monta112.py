from PIL import Image,ImageDraw,ImageFont
F=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
def cab(w,tit,sub):
    im=Image.new('RGB',(w,150),'white');d=ImageDraw.Draw(im);d.text((30,24),tit,font=F(40,True),fill='#2a1f27');d.text((30,86),sub,font=F(26),fill='#6b5a66');return im
def rot(im,txt,cor):
    d=ImageDraw.Draw(im);d.rectangle((0,0,im.width,56),fill=cor);d.text((20,10),txt,font=F(30,True),fill='white');return im
def lado(a,b,tit,sub,out,crop=None):
    A=Image.open(a);B=Image.open(b)
    if crop:A=A.crop((0,0,A.width,crop));B=B.crop((0,0,B.width,crop))
    w=A.width*2+40;c=cab(w,tit,sub);im=Image.new('RGB',(w,c.height+A.height+70),'white');im.paste(c,(0,0))
    for i,(x,t,cor) in enumerate([(A,'HOJE','#8a8a8a'),(B,'PROPOSTA','#8d3a69')]):
        p=Image.new('RGB',(x.width,x.height+56),'white');p.paste(x,(0,56));rot(p,t,cor);im.paste(p,(i*(x.width+40),c.height))
    im.save(out,quality=86)
def pilha(a,b,tit,sub,out,crop):
    A=Image.open(a);A=A.crop((0,0,A.width,crop));B=Image.open(b);B=B.crop((0,0,B.width,crop))
    A=A.resize((A.width//2,A.height//2));B=B.resize((B.width//2,B.height//2))
    c=cab(A.width,tit,sub);im=Image.new('RGB',(A.width,c.height+2*(A.height+56)+30),'white');im.paste(c,(0,0));y=c.height
    for x,t,cor in [(A,'HOJE','#8a8a8a'),(B,'PROPOSTA','#8d3a69')]:
        p=Image.new('RGB',(x.width,x.height+56),'white');p.paste(x,(0,56));rot(p,t,cor);im.paste(p,(0,y));y+=p.height+30
    im.save(out,quality=86)
S='Temática Natal ligada · a faixa fica por cima e o topo desce junto (logo e ícones inteiros)'
lado('raw_carrinho_cel_h.png','raw_carrinho_cel_p.png','120a · Celular · Carrinho',S,'120a-celular-carrinho.jpg',1100)
lado('raw_conta_cel_h.png','raw_conta_cel_p.png','120b · Celular · Minha conta',S,'120b-celular-minha-conta.jpg',1100)
lado('raw_peca_cel_h.png','raw_peca_cel_p.png','120c · Celular · Peça','Hoje a faixa some na peça (ficou lá em cima no Início); na proposta ela fica, igual às outras telas','120c-celular-peca.jpg',1100)
pilha('raw_carrinho_pc_h.png','raw_carrinho_pc_p.png','120d · Computador · Carrinho',S,'120d-pc-carrinho.jpg',700)
pilha('raw_conta_pc_h.png','raw_conta_pc_p.png','120e · Computador · Minha conta',S,'120e-pc-minha-conta.jpg',700)
pilha('raw_peca_pc_h.png','raw_peca_pc_p.png','120f · Monitor 2560 · Peça','Hoje a faixa some na peça; na proposta ela fica, igual às outras telas','120f-pc-peca.jpg',900)
lado('raw_peca_tab_h.png','raw_peca_tab_p.png','120g · Tablet · Peça (SEM temática)','Defeito achado no teste: hoje aparece uma tira do Início entre o topo e a peça (18 px). Na proposta some.','120g-tablet-peca-tira.jpg',900)
lado('raw_carrinho_tab_h.png','raw_carrinho_tab_p.png','120h · Tablet · Carrinho com Natal',S+' — e sem a tira','120h-tablet-carrinho.jpg',900)
