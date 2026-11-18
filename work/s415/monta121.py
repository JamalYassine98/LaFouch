from PIL import Image,ImageDraw,ImageFont
F=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
N={'inicio-topo':('121a','Celular · Início (topo)'),'inicio-meio':('121b','Celular · Início (cartões)'),'rodape':('121c','Celular · Rodapé'),'catalogo':('121d','Celular · Catálogo'),'peca':('121e','Celular · Peça')}
LEG='Área que aceita o toque:  verde = 44 px ou mais (bom)   ·   laranja = 24 a 43   ·   vermelho = menos de 24'
for t,(cod,tit) in N.items():
    A=Image.open('o_%s_hoje.png'%t);B=Image.open('o_%s_prop.png'%t)
    sub='O desenho não muda; só a área do toque cresce por fora, sem cobrir texto nem o vizinho.'
    if t=='inicio-meio': sub='"Últimas N unidades" sobre a foto, igual ao catálogo: nome, cor e preço alinhados.'
    w=A.width*2+40;im=Image.new('RGB',(w,190+56+A.height),'white');d=ImageDraw.Draw(im)
    d.text((30,20),cod+' · '+tit,font=F(40,True),fill='#2a1f27');d.text((30,80),sub,font=F(26),fill='#6b5a66');d.text((30,128),LEG,font=F(24),fill='#2a1f27')
    for i,(x,lab,cor) in enumerate([(A,'HOJE','#8a8a8a'),(B,'PROPOSTA','#8d3a69')]):
        X=i*(A.width+40);d.rectangle((X,190,X+A.width,246),fill=cor);d.text((X+18,200),lab,font=F(30,True),fill='white');im.paste(x,(X,246))
    im.save('%s-%s.jpg'%(cod,t),quality=84)
# versão limpa (sem as caixas) do 121b, para ver o resultado como o cliente vê
A=Image.open('f_inicio-meio_hoje.png');B=Image.open('f_inicio-meio_prop.png');w=A.width*2+40
im=Image.new('RGB',(w,150+56+A.height),'white');d=ImageDraw.Draw(im)
d.text((30,20),'121f · Celular · Início (cartões) — como o cliente vê',font=F(40,True),fill='#2a1f27');d.text((30,80),'Sem as caixas do toque. "Últimas 2 unidades" na mesma pílula do catálogo.',font=F(26),fill='#6b5a66')
for i,(x,lab,cor) in enumerate([(A,'HOJE','#8a8a8a'),(B,'PROPOSTA','#8d3a69')]):
    X=i*(A.width+40);d.rectangle((X,150,X+A.width,206),fill=cor);d.text((X+18,160),lab,font=F(30,True),fill='white');im.paste(x,(X,206))
im.save('121f-inicio-cartoes-limpo.jpg',quality=84)
