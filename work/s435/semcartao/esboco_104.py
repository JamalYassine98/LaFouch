# Esboço 104 (S435, 23/11 13:55) — 149s refeito NO ESTADO APROVADO (dono 13:49: 'de novo design velho'): as imagens do 149s eram de 21/11,
# antes dos aprovados 80–101. Mesma pergunta: Caixa e Vender/Catálogo também ficam SEM CARTÃO (a regra mora na classe .view .card)?
# Base: app de hoje + TODOS os aprovados (aprovados.py: barras, botões, campos, ícones, títulos, avisos, textos, cor oficial). Muda só o cartão.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s435/varredura');import ap,aprovados as A
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/semcartao/'
PLANO='.view .card{background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important}'
def tela(pw,esc,v,plano):
  b,pg,w=ap.abre(pw,v,esc,'celular',base=False);w(900)
  A.aplica(pg);w(300)
  if plano:pg.add_style_tag(content=PLANO);w(300)
  pg.add_style_tag(content='#mainnav{display:none!important}');w(200)
  pg.screenshot(path='/tmp/e104.png',full_page=True);b.close();im=Image.open('/tmp/e104.png').convert('RGB');return im.crop((0,0,im.width,min(im.height,1800)))
F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',30);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',22)
def quadro(arq,q):
  W=max(i.width for _,_,i in q);H=max(i.height for _,_,i in q);o=Image.new('RGB',(len(q)*(W+30)+30,H+120),(17,20,26));d=ImageDraw.Draw(o)
  for i,(t,s,im) in enumerate(q):
    x=30+i*(W+30);d.text((x,18),t,font=F,fill=(141,58,105));d.text((x,62),s,font=F2,fill=(170,160,165));o.paste(im,(x,100))
  o.save(O+arq,quality=86);print(arq)
with sync_playwright() as pw:
  for v,nm in (('caixa','Caixa'),('vendas','Vender')):
    q=[]
    for esc in (True,False):
      t='escuro' if esc else 'claro'
      q+=[(nm+' · com cartão',t+' · aprovado de hoje',tela(pw,esc,v,0)),(nm+' · sem cartão',t+' · só o cartão sai',tela(pw,esc,v,1))]
    quadro('esboco_104_%s_sem_cartao.jpg'%v,q)
