import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
from playwright.sync_api import sync_playwright
def L(h): return re.sub(r'<svg.*?</svg>','',re.sub(r'<img[^>]*>','<img>',h))
with sync_playwright() as pw:
  for n,sel in [('inventario-ficha','#v-estoque'),('inventario-fornecedores','#v-estoque'),('inventario-novo','body'),('inventario-editar','#editModal')]:
    b,pg,w=ap.abre(pw,'inicio',True)
    for p in D[n]: pg.evaluate(p);w(1100)
    if n=='inventario-editar': pg.evaluate("()=>{const e=[...document.querySelectorAll('[aria-label=Editar]')].find(x=>x.getBoundingClientRect().height);e&&e.click()}");w(1200)
    if n=='inventario-novo':
      h=pg.evaluate("()=>{const e=[...document.querySelectorAll('*')].filter(x=>/^Adicionar$/.test((x.textContent||'').trim())&&!x.children.length).pop();let p=e;for(let i=0;i<5;i++)p=p.parentElement;return p.outerHTML}")
    else: h=pg.evaluate("s=>{const e=document.querySelector(s);return e?e.innerHTML:'-'}",sel)
    h=L(h)
    if n=='inventario-ficha':
      i=h.find('Preço (US$)'); i=h.find('PREÇO') if i<0 else i; h=h[max(0,i-1500):i+2500]
    if n=='inventario-fornecedores': i=h.find('Fornecedores</div>'); i=h.find('Todas as compras'); h=h[max(0,i-300):i+1800]
    print('=====',n,h[:3500])
    b.close()
