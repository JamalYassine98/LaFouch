import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'mkt',True,'celular',base=True);w(800)
  pg.add_style_tag(content='#mainnav{display:none!important}')
  pg.evaluate("()=>document.querySelectorAll('details.mkDt').forEach(d=>d.open=true)");w(400)
  h=pg.evaluate("()=>document.body.scrollHeight");pg.screenshot(path='hoje_mkt_aberto.png',full_page=True)
  print(pg.evaluate("()=>[...document.querySelectorAll('details.mkDt')].map(d=>d.innerText.slice(0,900))"))
  pg.evaluate("()=>window.__LF.inicioGo('tem')");w(1500);pg.screenshot(path='hoje_tem.png')
  b.close()
  b,pg,w=ap.abre(pw,'ajustes',True,'celular',base=True);w(800)
  print(pg.evaluate("()=>{try{ACT.ajMarca&&ACT.ajMarca();return 'act'}catch(e){return e.message}}"))
  r=pg.evaluate("()=>{const e=[...document.querySelectorAll('*')].filter(x=>x.children.length<3&&/^Marca/.test(x.textContent.trim())&&x.offsetParent);e.length&&e[e.length-1].click();return e.length}");w(1000)
  pg.screenshot(path='hoje_marca2.png');b.close()
