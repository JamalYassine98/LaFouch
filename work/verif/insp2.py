import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300);pg.evaluate("()=>__LF.setView('clientes')");w(800);pg.evaluate("()=>document.querySelector('[data-act=clinovo]').click()");w(1000)
  print(pg.evaluate("""()=>{const e=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()=='Paraguaio');const p=e.parentElement;const s=x=>{const c=getComputedStyle(x);return [x.className,c.backgroundColor,c.color,c.border,c.borderRadius,c.padding,c.height,c.fontWeight,c.boxShadow].join(' ; ')};return [s(p),s(e),s(p.children[1])]}"""))
  b.close()
