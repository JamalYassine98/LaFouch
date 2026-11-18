import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
from playwright.sync_api import sync_playwright
def L(h): return re.sub(r'<svg.*?</svg>','<svg/>',h)
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True)
  for p in D['inventario-ficha-preco']: pg.evaluate(p);w(1100)
  print('PRECO',L(pg.evaluate("()=>{const e=[...document.querySelectorAll('#v-estoque *')].find(x=>/^Preço \\(US\\$\\)/i.test((x.textContent||'').trim())&&x.tagName=='SECTION');return e?e.outerHTML:[...document.querySelectorAll('#v-estoque section')].map(s=>s.className+':'+s.innerText.slice(0,40)).join(' | ')}"))[:2500])
  b.close()
