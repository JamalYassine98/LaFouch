import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
from playwright.sync_api import sync_playwright
def L(h): return re.sub(r'<svg.*?</svg>','<svg/>',h)
with sync_playwright() as pw:
  for n,js in [('inventario-fornecedores',"()=>{const e=[...document.querySelectorAll('#v-estoque section,#v-estoque .card')].find(x=>/Kazwini/.test(x.textContent)&&/Ver peças/.test(x.textContent));return e?e.outerHTML:'-'}"),('inventario-novo',"()=>{const e=[...document.querySelectorAll('.ljJn,[role=dialog]')].filter(x=>x.getBoundingClientRect().height>50).pop();return e?e.innerHTML:'-'}"),('inventario-editar',"()=>{const e=document.getElementById('editModal');return e?e.outerHTML.slice(0,1500):'-'}")]:
    b,pg,w=ap.abre(pw,'inicio',True)
    for p in D[n]: pg.evaluate(p);w(1100)
    if n=='inventario-editar': pg.evaluate("()=>{const e=[...document.querySelectorAll('[aria-label=Editar]')].find(x=>x.getBoundingClientRect().height);e&&e.click()}");w(1200)
    print('==',n,L(pg.evaluate(js))[:2600]);b.close()
