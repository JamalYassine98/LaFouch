# Esboço 75 (S435, 22/11 20:40) — os erros do site achados pela SITE (recados 16:18 e 17:45), com a causa e o jeito natural (regra 12):
# (a) iPad em pé, Início e Menu: 'Solicitar orçamento' quebra — CAUSA: o cartão do Atacado (.hata) vira 2 colunas a partir de 700 px, mas
#     entre 700 e 860 a coluna do texto fica com ~226 px úteis (padding 52) → título em 3 linhas e botão em 2. JEITO: o cartão só abre em
#     2 colunas onde o site inteiro já abre (> 860 px, a mesma divisa do .pgm); abaixo, empilha como no celular. Sai o @media 700 do .hata.
# (b) celular deitado, peça: '‹ Armações' por cima do 'Total' — CAUSA: '.pgm .buy{z-index:30}' (sobra no @media ≤860) põe a compra
#     acima da barra fixa (.pgbar, z 20). JEITO: sai a regra; a ordem de camadas fica a de sempre (barra fixa acima do conteúdo).
# (c) iPad deitado, coração embaixo da faixa: NÃO é erro do site — o coração só passa por trás do topo fixo e opaco ao rolar (como
#     qualquer conteúdo); é o medidor que precisa tratar a área sob o topo fixo como fora da tela (vai à SITE, ferramenta).
# (d) Comparar no celular: 'Ver este modelo' quebra — JEITO: mesmo verbo para a mesma ação (regra 17): 'Ver modelo', igual ao destaque
#     do Início; sai a tradução 'Ver este modelo'.
from hoje import *
import mede as M
from PIL import Image,ImageDraw,ImageFont
FA='@media (max-width:860px){.hata{grid-template-columns:1fr!important}.hata .hati{aspect-ratio:16/10!important}.hata .hati img{width:62%!important}.hata .hatt{padding:20px 20px 22px!important;display:block!important}.hata h3{font-size:26px!important}}'
FB='.pgm .buy{z-index:auto!important}'
JD="()=>document.querySelectorAll('.cmpc a,.cmpc button').forEach(e=>{if(/Ver este modelo/.test(e.textContent))e.textContent='Ver modelo'})"
REL=[]
def tira(pw,w,h,tela,css=None,js=None,rol=None,alvo=None,nome=''):
  b,pg=abre(pw,w,h,True,tela)
  if css: pg.add_style_tag(content=css)
  if js: pg.evaluate(js)
  pg.wait_for_timeout(400)
  a,_=M.percorre(pg,None);REL.append((nome,[(k[0],v['d'][:60]) for k,v in a.items()]))
  pg.evaluate("()=>{document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0});scrollTo(0,0)}")
  if rol: pg.evaluate(M.ROLAVEIS);M.vai_para(pg,rol[0],rol[1])
  if alvo: pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getBoundingClientRect().width);e&&e.scrollIntoView({block:'center'})}",alvo)
  pg.wait_for_timeout(800);pg.screenshot(path='/tmp/x.png');b.close();im=Image.open('/tmp/x.png');im.load();return im.convert('RGB')
F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',28);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',21)
def par(arq,t,s,h,p,alt=760):
  h=h.resize((int(h.width*alt/h.height),alt));p=p.resize((int(p.width*alt/p.height),alt))
  o=Image.new('RGB',(h.width+p.width+60,alt+130),(247,243,238));d=ImageDraw.Draw(o)
  d.text((20,18),t,font=F,fill=(141,58,105));d.text((20,58),s,font=F2,fill=(110,100,105))
  d.text((20,96),'HOJE',font=F2,fill=(90,90,90));d.text((h.width+40,96),'PROPOSTA',font=F2,fill=(141,58,105))
  o.paste(h,(20,125));o.paste(p,(h.width+40,125));o.save(arq,quality=88)
with sync_playwright() as pw:
  par('esboco_75a_tablet_atacado.jpg','75a · iPad em pé (768) · Início, cartão do Atacado','o cartão abre em 2 colunas só acima de 860 px (a divisa do site); abaixo empilha como no celular',
      tira(pw,768,1024,'Início',alvo='.hata .lfba',nome='a hoje'),tira(pw,768,1024,'Início',css=FA,alvo='.hata .lfba',nome='a prop'))
  par('esboco_75b_celular_deitado_peca.jpg','75b · celular deitado (844×390) · Peça, rolando','sai .pgm .buy{z-index:30}: a barra ‹ Armações fica acima do conteúdo, como em todo o site',
      tira(pw,844,390,'Peça',rol=(2,1400),nome='b hoje'),tira(pw,844,390,'Peça',css=FB,rol=(2,1400),nome='b prop'),alt=420)
  par('esboco_75d_comparar.jpg','75d · celular (386) · Comparar modelos','mesmo verbo para a mesma ação: "Ver modelo", igual ao destaque do Início',
      tira(pw,386,858,'Comparar',nome='d hoje'),tira(pw,386,858,'Comparar',js=JD,nome='d prop'))
  for w,h,n in ((820,1180,'iPad Air em pé'),(1024,768,'iPad deitado'),(1440,900,'PC')):
    tira(pw,w,h,'Início',css=FA,nome='a prop '+n)
for n,f in REL: print(n,f)
