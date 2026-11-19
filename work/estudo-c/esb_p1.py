# Esboço P1 (C0 — segurança da reserva), 19/11/2026, sessão "Estudo · dados". Por dentro, sem tela nova: Hoje × Proposta × Tentativas de burlar.
# Uso: python3 work/estudo-c/esb_p1.py → work/estudo-c/esboco_P1_seguranca_reserva_{claro,escuro}.jpg
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/estudo-c/'
F=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
HOJE=[('Quem pode soltar uma reserva','h'),('O site mostra a todos a lista de','t'),('  reservas, com o NÚMERO do pedido','t'),('"Cancelar" da cliente não pede nada','t'),('  além do número','t'),('sp',''),('Qualquer pessoa lê o número e','er'),('  cancela a reserva de outra cliente','t'),('Funciona até com reserva PAGA:','er'),('  a peça volta à venda e pode ser','t'),('  vendida duas vezes','t'),('sp',''),('E o "Cancelar" da própria cliente','er'),('  no site também não solta nada','t'),('  (manda "refs"; a nuvem lê "itens")','t'),('sp',''),('Provado com o banco de teste:','t'),('  paga → estranho cancela → livre 1','t')]
PROP=[('Quem pode soltar uma reserva','h'),('1 · "Cancelar" da cliente só solta','ok'),('  reserva NÃO paga e sem comprovante','t'),('  Paga ou com comprovante: só você,','t'),('  pelo app (Cancelar/Entregar)','t'),('2 · A lista do site deixa de mostrar','ok'),('  o número do pedido: vai só um','t'),('  código embaralhado (o site só usa','t'),('  cor, quantidade e prazo)','t'),('3 · A nuvem aceita a lista nos dois','ok'),('  nomes ("itens" e "refs"): o cancelar','t'),('  da cliente volta a soltar a peça','t'),('sp',''),('Nada muda na tela do site nem do app','t'),('Muda: função da nuvem (functions/)','t'),('  + 1 ajuste no app para achar as','t'),('  reservas órfãs pelo código novo','t')]
TESTE=[('Tentativas de burlar (testes novos)','h'),('Estranho cancela reserva PAGA','t'),('  → recusado, peça continua segura','ok'),('Estranho cancela reserva com','t'),('  comprovante enviado → recusado','ok'),('Estranho procura o número do pedido','t'),('  na lista pública → não aparece','ok'),('Cliente cancela a própria reserva','t'),('  não paga → peça volta ao site','ok'),('Você cancela/entrega pelo app','t'),('  (paga ou não) → solta na hora','ok'),('Duas clientes na última peça','t'),('  → só uma leva (igual hoje)','ok'),('Reservas antigas (formato velho)','t'),('  → continuam valendo até vencer','ok'),('sp',''),('Publicar: você roda no PC o','t'),('  "firebase deploy" (como sempre)','t')]
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
  d.text((g,20),'P1 · Segurança da reserva (por dentro, sem tela nova)',font=F(40,True),fill=fg)
  for i,(t,s) in enumerate([('HOJE','o furo'),('PROPOSTA','o que muda'),('TESTES','antes de publicar')]):
    x=g+i*(w+g);d.text((x,100),t,font=F(34),fill=fg);d.text((x,148),s,font=F(24),fill=mu);S.paste(ims[i],(x,200));d.rectangle([x-1,199,x+w,200+h],outline=(90,90,100))
  n='escuro' if esc else 'claro';S.save(O+'esboco_P1_seguranca_reserva_%s.jpg'%n,quality=88);print('ok',n)
