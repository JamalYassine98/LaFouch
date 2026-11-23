# Inventário 1 dos BOTÕES de ação (dono 23:18: "tem mais algum com esse tipo de problema? algum botão?").
# Percorre as telas reais do app (SEM a base: o app de hoje) e agrupa cada botão de ação pelo desenho medido (altura, cantos, fundo, contorno, letra).
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
VIEWS=['inicio','estoque','caixa','clientes','ped','hist','ajustes','fx','desp','dash','vendas','dia','mkt','cup','onl']
COL=r"""v=>[...document.querySelectorAll('button,a.btn,a.go')].filter(b=>{const r=b.getBoundingClientRect();return r.width>=120&&r.height>=36&&b.offsetParent&&b.textContent.trim()}).map(b=>{const c=getComputedStyle(b),r=b.getBoundingClientRect();
 const k=[Math.round(r.height),c.borderRadius,c.backgroundColor,c.borderTopWidth+' '+c.borderTopColor,c.color,c.fontSize,c.fontWeight].join(' | ');return {k,cls:b.className,t:b.textContent.trim().slice(0,30),v,w:Math.round(r.width)}})"""
R=[]
with sync_playwright() as pw:
  for v in VIEWS:
    try:
      b,pg,w=ap.abre(pw,v,True,'celular',base=False);w(1000)
      if v=='vendas':
        pg.evaluate("()=>{const S=window.__LF.S;const it=S.items.filter(i=>i.tipo=='solar'&&i.qty>=3)[0];S.cart=[{it:it,qty:3,id:'c1'}];S.cartOpen=true;S.cartStep='ped';window.__LF.render()}");w(900)
      R+=pg.evaluate(COL,v)
      if v=='vendas':
        pg.evaluate("()=>{window.__LF.S.cartStep='pag';window.__LF.render()}");w(900);R+=pg.evaluate(COL,'pagamento')
      if v=='caixa':
        for a in ['ret','cc','mel']:
          pg.evaluate("a=>{window.__LF.S.cxAcao=a;window.__LF.render()}",a);w(800);R+=[x for x in pg.evaluate(COL,'caixa/'+a) if x]
      b.close()
    except Exception as e: print(v,'ERR',str(e)[:60])
G={}
for x in R:
  G.setdefault(x['k'],[]).append(x)
json.dump(R,open('botoes.json','w'),ensure_ascii=False)
for k,L in sorted(G.items(),key=lambda z:-len(z[1])):
  print(len(L),'|',k);print('    ',sorted(set(x['cls'] for x in L))[:4],'·',sorted(set(x['t'] for x in L))[:5],'·',sorted(set(x['v'] for x in L))[:6])
