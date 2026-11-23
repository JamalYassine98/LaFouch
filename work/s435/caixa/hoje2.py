from hoje import *
with sync_playwright() as pw:
  b,pg,w,r=abre(pw)
  pg.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&/Ir para o pagamento/.test(b.textContent));b.click()}");w(1200)
  pg.add_style_tag(content='#mainnav{display:none!important}')
  pg.screenshot(path='hoje_pag.png',full_page=True);b.close()
