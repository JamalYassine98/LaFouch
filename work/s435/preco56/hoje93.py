import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/s435/varredura');import ap,aprovados as A
from playwright.sync_api import sync_playwright
def abre(pw,esc=True):
  b,pg,w=ap.abre(pw,'vendas',esc,'celular',base=True);w(700)
  pg.evaluate("""()=>{const S=window.__LF.S;const it=S.items.filter(i=>i.tipo=='solar'&&i.qty>=3)[0];S.cart=[{it:it,qty:3,id:'c1'}];S.cartOpen=true;S.cartStep='ped';window.__LF.render()}""");w(800)
  pg.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&/Ir para o pagamento/.test(b.textContent));b.click()}");w(1200)
  return b,pg,w
if __name__=='__main__':
 with sync_playwright() as pw:
  b,pg,w=abre(pw)
  pg.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&/^US\\$ Dólar$/.test(b.textContent.trim()));b&&b.click()}");w(800)
  A.aplica(pg);w(300)
  print(pg.evaluate("()=>{const v=[...document.querySelectorAll('.view')].find(v=>v.offsetParent);return (v||document.body).innerText.slice(0,1500)}"))
  print(pg.evaluate("()=>[...document.querySelectorAll('input')].filter(i=>i.offsetParent).map(i=>i.id+'='+i.value+'|'+i.placeholder)"))
  pg.screenshot(path='/tmp/h93.png',full_page=True);b.close()
