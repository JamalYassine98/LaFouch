# Varredura de luxo · parte 1 · CAMPOS (dono 23:40: trabalhar primeiro nos designs que faltam verificar).
# Percorre as telas e janelas reais do app de HOJE (sem base) e agrupa cada campo (input/select/textarea) pelo desenho medido.
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
COL=r"""v=>[...document.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=hidden]),select,textarea')].filter(e=>{const r=e.getBoundingClientRect();return r.width>60&&r.height>20}).map(e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();
 const caixa=(parseFloat(c.borderTopWidth)>0&&parseFloat(c.borderLeftWidth)>0)||!/rgba\(0, 0, 0, 0\)|transparent/.test(c.backgroundColor);
 return {v,caixa,k:[caixa?'CAIXA':'LINHA',Math.round(r.height),c.borderRadius,c.borderTopWidth,c.borderBottomWidth,c.backgroundColor,c.fontSize].join(' | '),ph:(e.placeholder||e.value||e.id||'').slice(0,28),id:e.id,cls:e.className}})"""
CENAS=[('estoque',None),('caixa','ret'),('caixa','cc'),('caixa','mel'),('ajustes','bk'),('ajustes','site'),('ajustes','marca'),('clientes','novo'),('desp',None),('fx','troca'),('vendas','pag'),('estoque','add'),('dash',None),('hist',None),('mkt',None)]
R=[]
with sync_playwright() as pw:
  for v,p in CENAS:
    try:
      b,pg,w=ap.abre(pw,v,True,'celular',base=False);w(900)
      if v=='caixa': pg.evaluate("a=>{window.__LF.S.cxAcao=a;window.__LF.render()}",p);w(900)
      if v=='ajustes' and p in('bk','site'): pg.locator('.ajS[data-k="%s"] .ajR'%p).click();w(900)
      if v=='ajustes' and p=='marca': pg.evaluate("()=>window.__LF.ACT.ajMarca()");w(900)
      if v=='clientes': pg.evaluate("()=>{const b=[...document.querySelectorAll('#v-clientes button')].find(b=>/Novo|novo|\\+/.test(b.textContent+b.getAttribute('aria-label'))&&b.getBoundingClientRect().width);b&&b.click()}");w(900)
      if v=='fx': pg.evaluate("()=>window.__LF.ACT.fjAbre('troca')");w(900)
      if v=='vendas': pg.evaluate("()=>{const S=window.__LF.S;const it=S.items.filter(i=>i.tipo=='solar'&&i.qty>=3)[0];S.cart=[{it:it,qty:3,id:'c1'}];S.cartOpen=true;S.cartStep='pag';window.__LF.render()}");w(900)
      if v=='estoque' and p=='add': pg.evaluate("()=>document.getElementById('btnAdd').click()");w(700);pg.evaluate("()=>document.getElementById('addToMan')&&document.getElementById('addToMan').click()");w(900)
      R+=pg.evaluate(COL,v+('/'+p if p else ''));b.close()
    except Exception as e: print(v,p,'ERR',str(e)[:70])
json.dump(R,open('campos.json','w'),ensure_ascii=False)
G={}
for x in R: G.setdefault(x['k'],[]).append(x)
print(len(R),'campos ·',len(G),'desenhos · em caixa:',sum(1 for x in R if x['caixa']),'· em linha:',sum(1 for x in R if not x['caixa']))
for k,L in sorted(G.items(),key=lambda z:-len(z[1])):
  print(len(L),'|',k,'|',sorted(set(x['v'] for x in L))[:6],'|',[x['ph'] for x in L][:4])
