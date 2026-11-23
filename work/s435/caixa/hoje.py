import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,json
from playwright.sync_api import sync_playwright
def abre(pw,esc=True):
  b,pg,w=ap.abre(pw,'vendas',esc,'celular',base=True);w(700)
  r=pg.evaluate("""()=>{const S=window.__LF.S;const sol=S.items.filter(i=>i.tipo=='solar'&&i.qty>=3);const it=sol[0];
    S.cart=[{it:it,qty:3,id:'c1'}];S.cartOpen=true;S.cartStep='ped';window.__LF.render();return [S.view,sol.length,it&&[it.ref,it.vr,it.cor,it.qty,it.custo]]}""");w(1000)
  return b,pg,w,r
if __name__=='__main__':
 with sync_playwright() as pw:
  b,pg,w,r=abre(pw);print(r)
  pg.add_style_tag(content='#mainnav{display:none!important}')
  pg.screenshot(path='hoje_ped.png',full_page=True)
  print(pg.evaluate("()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/Finalizar|Continuar|pagamento|Pagar/i.test(b.textContent)).map(b=>b.textContent.trim().slice(0,40))"))
  b.close()
