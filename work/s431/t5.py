import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for x in dict(C)['catalogo-peca']:
    try: pg.evaluate(x)
    except Exception: pass
    w(900)
  print(pg.evaluate("""()=>{const v=document.getElementById('vDetail');return [...v.querySelectorAll('button,h1,h2,h3,b,.crumb')].filter(e=>e.getBoundingClientRect().height).slice(0,12).map(e=>e.tagName+'.'+e.className+' ['+(e.getAttribute('aria-label')||'')+'] "'+e.textContent.trim().slice(0,25)+'" fs'+getComputedStyle(e).fontSize+' <'+e.parentElement.className)}"""))
  b.close()
