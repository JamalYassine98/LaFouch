# 96d (S435, 23/11 09:10) — Pagamento: o cliente escolhido no Carrinho (96 v2) não é pedido de novo. Hoje: campo 'Cliente (opcional)'.
# Proposta: o campo vira a linha 'Cliente · Ana Benítez ›' (toque troca). Sem cliente no Carrinho, a linha diz 'escolher ›'. Um lugar só
# para o cliente da venda: o mesmo S.vCli que o Carrinho usa. Base: app + aprovados (aprovados.py) + 93 (tudo arredondado).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s435/preco56');from hoje93 import *
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/oferta96/'
PROP=r"""()=>{const q=document.getElementById('vCliQ');if(!q)return 'sem';const box=q.parentElement;const lb=[...document.querySelectorAll('.lbl')].find(l=>/^cliente/i.test(l.textContent.trim())&&l.offsetParent);
 const L='<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">Cliente</b><small style="display:block;margin-top:2px;font-size:13px;color:var(--mute)">Ana Benítez · escolhida no carrinho</small></span><i style="font-style:normal;color:var(--mute);font-size:20px">›</i></div>';
 if(lb)lb.remove();q.outerHTML=L;return 'ok'}"""
def tela(pw,esc,prop):
  b,pg,w=abre(pw,esc);A.aplica(pg);w(300)
  if prop:print(pg.evaluate(PROP));w(300)
  pg.add_style_tag(content='#mainnav{display:none!important}');w(200)
  pg.screenshot(path='/tmp/e96d.png',full_page=True);x=Image.open('/tmp/e96d.png');x.load();x=x.copy();b.close();return x
F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',30);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',22)
def quadro(arq,q):
  W=max(i.width for _,_,i in q);H=max(i.height for _,_,i in q);o=Image.new('RGB',(len(q)*(W+30)+30,H+120),(17,20,26));d=ImageDraw.Draw(o)
  for i,(t,s,im) in enumerate(q):
    x=30+i*(W+30);d.text((x,18),t,font=F,fill=(141,58,105));d.text((x,62),s,font=F2,fill=(170,160,165));o.paste(im,(x,100))
  o.save(O+arq,quality=86);print(arq)
with sync_playwright() as pw:
  for esc in (True,False):
    tm='escuro' if esc else 'claro'
    quadro('esboco_96d_pagamento_cliente_%s.jpg'%tm,[('HOJE · Pagamento','pede o cliente de novo',tela(pw,esc,0)),('PROPOSTA · Pagamento','o cliente do carrinho, numa linha',tela(pw,esc,1))])
