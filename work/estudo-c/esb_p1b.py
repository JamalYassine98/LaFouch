# Esboço P1b (órfãs depois da P1), 19/11/2026, NUVEM · implementa. Uso: python3 work/estudo-c/esb_p1b.py
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/estudo-c/'
F=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
HOJE=[('Pedido pago apagado do app','h'),('A reserva dele continua no site','t'),('  segurando a peça','t'),('O app não tem mais o número do','er'),('  pedido, e a nuvem não mostra mais','t'),('  o número (desde a P1)','t'),('A peça fica presa para sempre','er'),('sp',''),('Hoje: nenhuma presa assim','t'),('Antes da P1 o app conseguia soltar','t')]
PROP=[('Pedido pago apagado do app','h'),('1 · O app manda à nuvem os códigos','ok'),('  dos pedidos que ele conhece','t'),('  (só você, com o seu login)','t'),('2 · A nuvem devolve as reservas','ok'),('  PAGAS que não são de nenhum','t'),('3 · Igual a hoje: o app espera ver a','ok'),('  mesma órfã 2 vezes em 10 min e','t'),('  pede para soltar pelo código','t'),('sp',''),('Nada muda nas telas','t'),('Faz: NUVEM (2 ações só do dono)','t'),('  + APP · implementa (resOrfas)','t')]
TESTE=[('Testes (incluindo burlar)','h'),('Estranho pede a lista de órfãs','t'),('  → recusado (só o dono)','ok'),('Estranho manda soltar por código','t'),('  → recusado (só o dono)','ok'),('Pedido apagado e pago → depois de','t'),('  10 min a peça volta ao site','ok'),('Pedido que ainda existe → não mexe','ok'),('Reserva não paga → não entra','ok'),('  (vence sozinha / limpeza das 4h)','t'),('sp',''),('Publicar: você no Cloud Shell','t'),('  (só functions)','t')]
def painel(L,esc):
  W,H=780,1100;im=Image.new('RGB',(W,H),(17,20,26) if esc else (255,255,255));d=ImageDraw.Draw(im)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165);y=48
  for t,k in L:
    if t=='sp': y+=24;continue
    if k=='h': d.text((40,y),t,font=F(29,True),fill=fg);y+=60
    elif k=='ok': d.text((40,y),'✓ '+t,font=F(25),fill=(60,170,100));y+=46
    elif k=='er': d.text((40,y),'✗ '+t,font=F(25),fill=(220,80,80));y+=46
    else: d.text((40,y),t,font=F(25),fill=mu);y+=46
  return im
for esc in (True,False):
  ims=[painel(L,esc) for L in (HOJE,PROP,TESTE)];w,h=ims[0].size;g=40
  S=Image.new('RGB',(g+3*(w+g),h+230),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  d.text((g,20),'P1b · Reserva presa de pedido apagado (por dentro, sem tela nova)',font=F(40,True),fill=fg)
  for i,(t,s) in enumerate([('HOJE','a lacuna'),('PROPOSTA','o que muda'),('TESTES','antes de publicar')]):
    x=g+i*(w+g);d.text((x,100),t,font=F(34),fill=fg);d.text((x,148),s,font=F(24),fill=mu);S.paste(ims[i],(x,200));d.rectangle([x-1,199,x+w,200+h],outline=(90,90,100))
  n='escuro' if esc else 'claro';S.save(O+'esboco_P1b_orfas_%s.jpg'%n,quality=88);print('ok',n)
