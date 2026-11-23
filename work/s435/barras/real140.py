import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  for base in (False,True):
    b,pg,w=ap.abre(pw,'vendas',True,'celular',base=base);w(700)
    pg.evaluate("()=>{const S=window.__LF.S;const it=S.items.filter(i=>i.tipo=='solar'&&i.qty>=3)[0];S.cart=[{it:it,qty:3,id:'c1'}];S.cartOpen=true;S.cartStep='pag';window.__LF.render()}");w(1200)
    print(base,pg.evaluate("()=>{const t=document.getElementById('moedas');const c=getComputedStyle(t);const th=t.querySelector('.trkTh');return [t.className,c.backgroundColor,c.borderRadius,c.borderTopWidth,th?getComputedStyle(th).backgroundColor:'-',th?getComputedStyle(th).borderRadius:'-',getComputedStyle(t.querySelector('.trkB')).fontSize]}"))
    b.close()
