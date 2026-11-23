import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
# (rótulo, tela, preparo, texto do botão)
CASOS=[('1 · .go','Carrinho / Pagamento / Site','vendas','cart','Ir para o pagamento'),
 ('2 · .fx418P','Caixa › Retirar · Câmbio · Objetivo','caixa','ret','Retirar'),
 ('3 · .mini (pílula)','Caixa › Conferir · Ajustes › nuvem','caixa','','Conferir caixa'),
 ('4 · .btn-sc (pílula)','Ajustes › Cópias (Exportar/Importar)','ajustes','aj:copias','Exportar'),
 ('5 · .b75 (pílula cinza)','Ajustes › Atualização','ajustes','aj:upd','Buscar atualização'),
 ('6 · .impBp (pílula vinho)','Ajustes › Impressora','ajustes','aj:imp','Procurar impressora')]
def tira(pw,esc,c):
  t,onde,v,prep,txt=c
  b,pg,w=ap.abre(pw,v,esc,'celular',base=False);w(900)
  if prep=='cart': pg.evaluate("()=>{const S=window.__LF.S;const it=S.items.filter(i=>i.tipo=='solar'&&i.qty>=3)[0];S.cart=[{it:it,qty:3,id:'c1'}];S.cartOpen=true;S.cartStep='ped';window.__LF.render()}");w(900)
  if prep=='ret': pg.evaluate("()=>{window.__LF.S.cxAcao='ret';window.__LF.render()}");w(900)
  if prep.startswith('aj:'):
    pg.evaluate("t=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim().startsWith(t)&&b.offsetParent);if(b){const s=b.closest('.ajS');s&&s.querySelector('.ajR').click()}}",txt);w(600)
    for k in ['copias','nuvem','upd','imp','atualizacao','backup']:
      try:
        if pg.evaluate("k=>!!document.querySelector('.ajS[data-k=\"'+k+'\"]')",k) and not pg.evaluate("t=>[...document.querySelectorAll('button')].some(b=>b.textContent.trim().startsWith(t)&&b.getBoundingClientRect().height>0)",txt):
          pg.locator('.ajS[data-k="%s"] .ajR'%k).click();w(500)
      except Exception: pass
  r=pg.evaluate("t=>{const b=[...document.querySelectorAll('button,a')].find(b=>b.textContent.trim().startsWith(t)&&b.getBoundingClientRect().height>0);if(!b)return null;b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return [r.y,r.height]}",txt);w(400)
  im=None
  if r:
    r=pg.evaluate("t=>{const b=[...document.querySelectorAll('button,a')].find(b=>b.textContent.trim().startsWith(t)&&b.getBoundingClientRect().height>0);const r=b.getBoundingClientRect();return [r.y,r.height]}",txt)
    pg.screenshot(path='/tmp/k.png',clip={'x':0,'y':max(0,r[0]-24),'width':390,'height':r[1]+48});im=Image.open('/tmp/k.png').convert('RGB')
  b.close();return im
with sync_playwright() as pw:
  for esc in (True,False):
    L=[(c[0],c[1],tira(pw,esc,c)) for c in CASOS]
    F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',26);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',20)
    H=sum((i.height+90) if i else 90 for _,_,i in L)+90
    o=Image.new('RGB',(840,H),(17,20,26) if esc else (247,243,238));d=ImageDraw.Draw(o);fg=(220,220,225) if esc else (50,45,48);y=20
    d.text((30,y),'INVENTÁRIO 1 · botão de ação · app de hoje · '+('escuro' if esc else 'claro'),font=F,fill=fg);y+=60
    for t,s,i in L:
      d.text((30,y),t,font=F,fill=fg);d.text((330,y+4),s,font=F2,fill=(150,140,145));y+=40
      if i: o.paste(i,(30,y));y+=i.height+30
      else: d.text((30,y),'(não apareceu no simulador)',font=F2,fill=(150,140,145));y+=50
    o.crop((0,0,840,y)).save('inventario_botoes_%s.jpg'%('escuro' if esc else 'claro'),quality=86);print('ok',[i is not None for _,_,i in L])
