# Esboço 93 (S435, 23/11 08:40) — PRECIFICAÇÃO 56, parte 1: TUDO ARREDONDADO no caixa (dono 21/11 23:36: "não é normal ele pedir 21.752
# guaranis, isso não existe"; aprovado: até G$ 1.000 = arredondamento do câmbio, acima = desconto, separados no Lucro real).
# Caso REAL de hoje: 3 × SL2201 = G$ 180.000, cliente paga em US$ → o app pede US$ 27,27 e registra "Falta: G$ 18" (vira desconto).
# Proposta (uma função só para todo valor cobrado): moeda de fora em nota inteira (US$ 27) + o resto em guarani no 1.000 mais perto
# (G$ 1.800 → G$ 2.000); a diferença (+ G$ 200) é ARREDONDAMENTO, não desconto. Base: app de hoje + aprovados (aprovados.py).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s435/preco56');from hoje93 import *
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/preco56/'
PROP=r"""()=>{const r=document.getElementById('recIn');r.value='27';
 const h=document.getElementById('recH');h.outerHTML='<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">Resto em guarani</b><small style="display:block;margin-top:2px;font-size:13px;color:var(--mute);white-space:nowrap">US$ 27 = G$ 178.200 · faltam G$ 1.800</small></span><b style="font-size:16px;font-weight:500;font-variant-numeric:tabular-nums">G$ 2.000</b></div>';
 const p=document.getElementById('pmRes');p.textContent='Recebido: US$ 27 + G$ 2.000 · arredondamento + G$ 200'}"""
def tela(pw,esc,prop):
  b,pg,w=abre(pw,esc)
  pg.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&/^US\\$ Dólar$/.test(b.textContent.trim()));b&&b.click()}");w(800)
  A.aplica(pg);w(300)
  if prop:pg.evaluate(PROP);w(300)
  pg.add_style_tag(content='#mainnav{display:none!important}');w(200)
  pg.screenshot(path='/tmp/e93.png',full_page=True);x=Image.open('/tmp/e93.png');x.load();x=x.copy();b.close();return x
F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',30);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',22)
def quadro(arq,q):
  W=max(i.width for _,_,i in q);H=max(i.height for _,_,i in q);o=Image.new('RGB',(len(q)*(W+30)+30,H+120),(17,20,26));d=ImageDraw.Draw(o)
  for i,(t,s,im) in enumerate(q):
    x=30+i*(W+30);d.text((x,18),t,font=F,fill=(141,58,105));d.text((x,62),s,font=F2,fill=(170,160,165));o.paste(im,(x,100))
  o.save(O+arq,quality=86);print(arq)
with sync_playwright() as pw:
  for esc in (True,False):
    tm='escuro' if esc else 'claro'
    quadro('esboco_93_tudo_arredondado_%s.jpg'%tm,[('HOJE · Pagamento em US$','pede US$ 27,27 · "Falta G$ 18" vira desconto',tela(pw,esc,0)),('PROPOSTA · Pagamento em US$','US$ 27 + G$ 2.000 · + G$ 200 é arredondamento',tela(pw,esc,1))])
