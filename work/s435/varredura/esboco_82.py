# Esboço 82 (S435, 22/11 23:50) — VARREDURA DE LUXO · parte 1 · CAMPOS. Medido no app de hoje (campos.py): 44 campos em 6 desenhos —
# 36 em CAIXA (cantos 16 px ou 10 px, contorno de 2 px, fundo escuro) e só 8 em linha (Clientes › novo e a busca). A regra 15 manda
# "campos em linhas finas". Proposta: UMA regra para todo campo de formulário (.in, input, select, textarea): sem caixa, sem fundo,
# linha fina embaixo (1 px, var(--line2)), letra 15 px; ao tocar, a linha fica na cor de ação. A BUSCA é outra família e fica.
# Base = app real + aprovados (135e/135f Retirar e Troca já em linha, 73s Marca em linhas). Telas: Caixa › Objetivo, Ajustes › Cópias e
# nuvem, Inventário › Preencher à mão, Caixa › Retirar.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
LINHA='.view .in,.view input.in,.view select.in,.view textarea.in,.ljJn .in,.cxAcao .in,#addProdRest .in,#addManB .in{background:transparent!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important}.in:focus{border-bottom-color:var(--accent-fg)!important;outline:none!important}'
def cena(pw,esc,prop,k):
  v={'mel':'caixa','ret':'caixa','bk':'ajustes','add':'estoque'}[k]
  b,pg,w=ap.abre(pw,v,esc,'celular',base=prop);w(900)
  if v=='caixa': pg.evaluate("a=>{window.__LF.S.cxAcao=a;window.__LF.render()}",k);w(1000)
  if k=='bk': pg.locator('.ajS[data-k="bk"] .ajR').click();w(900);pg.evaluate("()=>document.querySelector('.ajS[data-k=\"bk\"]').scrollIntoView({block:'start'})");w(500)
  if k=='add': pg.evaluate("()=>document.getElementById('btnAdd').click()");w(700);pg.evaluate("()=>document.getElementById('addToMan').click()");w(1000)
  if prop: pg.add_style_tag(content=LINHA);w(400)
  pg.add_style_tag(content='#mainnav{display:none!important}')
  if v=='caixa': pg.evaluate("()=>{const i=[...document.querySelectorAll('.cxAcao.on .in')];i.length&&i[i.length-1].scrollIntoView({block:'center'})}");w(400)
  pg.screenshot(path='/tmp/c.png');b.close();return Image.open('/tmp/c.png').convert('RGB')
CENAS=[('mel','Caixa › Objetivo'),('bk','Ajustes › Cópias e nuvem'),('add','Inventário › Preencher à mão'),('ret','Caixa › Retirar')]
with sync_playwright() as pw:
  for esc in (True,False):
    F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',26);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',20)
    P=[(t,cena(pw,esc,False,k),cena(pw,esc,True,k)) for k,t in CENAS]
    W=P[0][1].width//2;H=P[0][1].height//2
    o=Image.new('RGB',(len(P)*(2*W+40)+40,H+120),(17,20,26) if esc else (247,243,238));d=ImageDraw.Draw(o);fg=(210,210,215) if esc else (50,45,48)
    for i,(t,a,p) in enumerate(P):
      x=30+i*(2*W+40);d.text((x,16),t,font=F,fill=fg);d.text((x,58),'HOJE',font=F2,fill=(150,140,145));d.text((x+W+10,58),'PROPOSTA · linha fina',font=F2,fill=(141,58,105))
      o.paste(a.resize((W,H)),(x,90));o.paste(p.resize((W,H)),(x+W+10,90))
    o.save('esboco_82_campos_%s.jpg'%('escuro' if esc else 'claro'),quality=86);print(o.size)
