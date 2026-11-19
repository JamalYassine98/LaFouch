import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for x in ["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataNovo()"]: pg.evaluate(x);w(1000)
  print(pg.evaluate("""()=>{const s=document.querySelector('.ljJn select');const c=getComputedStyle(s);const o=[...document.querySelectorAll('.ljJn input')].map(i=>[i.placeholder.slice(0,20),i.parentElement.className,i.getBoundingClientRect().left]);return [s.parentElement.className,s.className,c.paddingLeft,c.textIndent,c.appearance,c.backgroundImage.slice(0,40),s.getBoundingClientRect().left,o]}"""))
  b.close()
