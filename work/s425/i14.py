import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C)
J=r"""()=>{const e=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()=='Dinheiro'&&!x.closest('nav')&&x.getBoundingClientRect().height);if(!e)return 'nada';const p=e.parentElement;const s=x=>{const c=getComputedStyle(x);return [x.tagName+'.'+x.className,c.backgroundColor,c.color,c.border,c.borderRadius,c.padding,c.height,c.fontWeight,c.fontSize,c.boxShadow].join(' ; ')};return [s(p),s(e),s(p.children[1])]}"""
with sync_playwright() as pw:
  for esc in (True,False):
    b,pg,w=ap.abre(pw,'inicio',esc,base=False);w(300)
    for p in D['catalogo-pagamento']: pg.evaluate(p);w(900)
    print(esc);[print('  ',x) for x in pg.evaluate(J)];b.close()
