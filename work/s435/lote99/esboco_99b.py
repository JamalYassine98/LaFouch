# 99b v2 (dono 10:56: 'fica apenas Descontos, não precisa complicar'): 'Descontos (cupom)' vira só 'Descontos' (cupom e 3ª peça juntos);
# o arredondamento do câmbio não ganha linha. v1: 99b (S435, 23/11 10:40) — LUCRO REAL DO MÊS separando o que é desconto do que é arredondamento (aprovado 21/11 23:36 + 93 + 98 v4).
# Hoje: uma linha 'Descontos (cupom)'. Proposta: 'Cupons' · '3ª peça' (os dois descontos que existem, 98 v4) · 'Arredondamento do câmbio'
# (93: moeda de fora em nota inteira; até G$ 1.000 por venda, + ou −). Sai a frase 'O frete das compras já está dentro…' (83).
# Base: app de hoje (Início › Hoje › Lucro real do mês ⌄) + aprovados.py. Dados REAIS do teste (nenhum cupom usado ainda → G$ 0).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s435/varredura');import ap,aprovados as A
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/lote99/'
PROP=r"""()=>{const e=[...document.querySelectorAll('*')].find(x=>x.children.length==0&&/^Descontos \(cupom\)$/.test(x.textContent.trim()));if(!e)return 'sem';
 let row=e;while(row.parentElement&&!/G\$/.test(row.textContent.replace(e.textContent,'')))row=row.parentElement;
 const mk=(t,v)=>{const n=row.cloneNode(true);const lb=[...n.querySelectorAll('*')].find(x=>x.children.length==0&&/^Descontos/.test(x.textContent.trim()));lb.textContent=t;const vv=[...n.querySelectorAll('*')].filter(x=>x.children.length==0&&/G\$/.test(x.textContent)).pop();if(vv)vv.textContent=v;return n};
 e.textContent='Descontos';
 [...document.querySelectorAll('.hint')].filter(h=>/frete das compras/.test(h.textContent)).forEach(h=>h.remove());return 'ok'}"""
def tela(pw,esc,prop):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=False);w(600)
  pg.evaluate("()=>{const S=__LF.S;S.dTab='hoje';S.dfold={lr:1,res:1};S.view='dash';__LF.render()}");w(900)
  print(pg.evaluate("()=>{const r=[...document.querySelectorAll('button,summary,div')].find(e=>e.children.length<4&&/^Resultado do mês/.test(e.textContent.trim())&&e.offsetParent);if(r)r.click();return !!r}"));w(800)
  print(pg.evaluate("()=>{const e=[...document.querySelectorAll('*')].find(x=>x.children.length==0&&/^Descontos \\(cupom\\)$/.test(x.textContent.trim()));return e?e.offsetParent?'visivel':'escondido':'nao existe'}"))
  A.aplica(pg);w(300)
  if prop:print(pg.evaluate(PROP));w(300)
  pg.add_style_tag(content='#mainnav{display:none!important}')
  pg.evaluate("()=>{const e=[...document.querySelectorAll('*')].find(x=>x.children.length==0&&/^Descontos( \\(cupom\\))?$/.test(x.textContent.trim()));if(e)window.scrollTo(0,e.getBoundingClientRect().top+scrollY-420)}");w(500)
  pg.screenshot(path='/tmp/lr.png');b.close();x=Image.open('/tmp/lr.png');x.load();return x.copy()
F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',30);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',22)
def quadro(arq,q):
  W=max(i.width for _,_,i in q);H=max(i.height for _,_,i in q);o=Image.new('RGB',(len(q)*(W+30)+30,H+120),(17,20,26));d=ImageDraw.Draw(o)
  for i,(t,s,im) in enumerate(q):
    x=30+i*(W+30);d.text((x,18),t,font=F,fill=(141,58,105));d.text((x,62),s,font=F2,fill=(170,160,165));o.paste(im,(x,100))
  o.save(O+arq,quality=86);print(arq)
with sync_playwright() as pw:
  for esc in (True,False):
    tm='escuro' if esc else 'claro'
    quadro('esboco_99b_lucro_real_v2_%s.jpg'%tm,[('HOJE · Lucro real do mês','uma linha "Descontos (cupom)"',tela(pw,esc,0)),('PROPOSTA · Lucro real do mês','uma linha só: Descontos (cupom e 3ª peça)',tela(pw,esc,1))])
