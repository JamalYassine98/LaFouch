from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def f(s):
    try: return ImageFont.truetype(F,s)
    except: return ImageFont.load_default()
W=700; ROSA=(232,110,170)
def col(img, boxes, titulo, sub):
    k=W/img.width; im=img.resize((W,int(img.height*k)))
    d=ImageDraw.Draw(im)
    for n,(x0,y0,x1,y1) in boxes:
        b=[x0*k-6,y0*k-6,x1*k+6,y1*k+6]; d.rounded_rectangle(b,8,outline=ROSA,width=4)
        cx,cy=b[0]-4,b[1]-4; d.ellipse([cx-18,cy-18,cx+18,cy+18],fill=ROSA); d.text((cx,cy),str(n),font=f(22),fill='white',anchor='mm')
    o=Image.new('RGB',(W,im.height+90),(18,20,26)); o.paste(im,(0,90))
    D=ImageDraw.Draw(o); D.text((0,10),titulo,font=f(30),fill='white'); D.text((0,52),sub,font=f(20),fill=(150,160,175))
    return o
def folha(nome, A, B, notas):
    h=max(A.height,B.height); nh=60+40*len(notas)
    o=Image.new('RGB',(W*2+120,h+nh+40),(18,20,26)); o.paste(A,(40,20)); o.paste(B,(W+80,20))
    D=ImageDraw.Draw(o); y=h+50
    for t in notas: D.text((40,y),t,font=f(24),fill=(220,225,235)); y+=40
    o.save('work/argus/plantas/lotes/explica/'+nome,quality=88)
P='work/argus/plantas/app/'
# 1 Ajustes
a=Image.open(P+'app-ajustes_escuro.jpg').crop((0,0,1221,2200)); b=Image.open('/tmp/ex/a86.jpg').crop((430,90,830,964))
folha('1_ajustes.jpg', col(a,[(1,(1095,680,1150,740)),(2,(728,862,758,896))], 'APP HOJE','Ajustes (escuro)'), col(b,[(1,(353,243,383,272)),(2,(232,305,250,325))],'ÚLTIMO APROVADO · 86 v2','Ajustes, a proposta aprovada'),
 ['A parte do site (Site, Pedidos do site) já não estava no 86: ela está certa.',
  '1  Instagram: no 86 a linha tem ⌄ (abre ali); hoje não tem ⌄.',
  '2  Ponto de "Nenhuma cópia": no 86 é rosa; hoje é amarelo (atenção).',
  'Pergunta: a planta segue o 86 nestas 2 coisas ou fica como hoje?'])
# 2 Compras
a=Image.open(P+'app-compras_escuro.jpg').crop((0,0,1221,1320)); b=Image.open('/tmp/ex/c51.jpg').crop((40,112,830,1000))
folha('2_compras.jpg', col(a,[(1,(272,955,400,1005)),(2,(70,535,500,590))],'APP HOJE','Compras (escuro)'),
 col(b,[(1,(190,600,310,640)),(2,(45,355,370,390))],'ÚLTIMO APROVADO · 51','Compras, como foi aprovado'),
 ['1  ★ antes de "estrela": tem no 51 aprovado (★ estrela), hoje só "estrela".',
  '2  Frase "O que comprar e de quem" embaixo do título: tem no 51, falta hoje.',
  '   (o 83 tirou as frases de baixo do título; por isso ela saiu.)',
  'Pergunta: o ★ volta?'])
# 3 Ferramentas
a=Image.open(P+'app-ferramentas_escuro.jpg').crop((0,0,1221,1250)); b=Image.open('/tmp/ex/f66.jpg').crop((60,112,840,1000))
folha('3_ferramentas.jpg', col(a,[(1,(70,615,500,680)),(2,(185,990,785,1040)),(3,(70,548,195,595)),(4,(70,1070,1150,1100))],'APP HOJE','Preços › Ferramentas (escuro)'),
 col(b,[(1,(45,440,260,475)),(2,(120,680,605,715)),(3,(45,357,128,390)),(4,(45,730,735,750))],'ÚLTIMO APROVADO · 66','Ferramentas, como foi aprovado'),
 ['1  Rótulo "FERRAMENTAS" acima das linhas: tem no 66, falta hoje.',
  '2  Linha do E se…?: 66 "cupom, contas ou meta" · hoje "cupom e mais".',
  '3  66 "contas rápidas" (c minúsculo) · hoje "Contas rápidas".',
  '4  Traço embaixo do E se…?: tem no 66, falta hoje.',
  'Pergunta: a planta segue o 66 nestas 4 coisas?'])
