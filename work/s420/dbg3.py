import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
exec(open('esb134r.py').read().split('BL=[[')[0])
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(400)
  for p in D['inventario-fornecedores']: pg.evaluate(p);w(1100)
  pg.add_style_tag(content=CB);print(pg.evaluate(JB));w(500)
  print(pg.evaluate("""()=>{const c=document.querySelector('#lotView>section.card');const h=c.querySelector(':scope>div');return [...h.querySelectorAll('*')].filter(x=>x.getBoundingClientRect().width).map(x=>x.tagName+' '+Math.round(x.getBoundingClientRect().right*10)/10).join(' | ')+' || card '+c.getBoundingClientRect().right+' pad '+getComputedStyle(c).paddingRight+' brd '+getComputedStyle(c).borderRightWidth}"""))
  print(comum.alin(pg,[['#lotView>section.card',':scope>div','compra']]))
