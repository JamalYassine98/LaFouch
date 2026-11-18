import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
from playwright.sync_api import sync_playwright
def L(h): return re.sub(r'<svg.*?</svg>','',re.sub(r'<img[^>]*>','<img>',h))
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True)
    for p in D['inventario-fornecedores']: pg.evaluate(p);w(1100)
    print(L(pg.evaluate("()=>{const e=[...document.querySelectorAll('#v-estoque *')].filter(x=>/^Fornecedores$/.test((x.textContent||'').trim())&&!x.children.length).pop();let p=e.parentElement;return p.parentElement.outerHTML}"))[:2500])
    b2,pg2,w2=ap.abre(pw,'inicio',True)
    for p in D['inventario-novo']: pg2.evaluate(p);w2(1100)
    print('====',L(pg2.evaluate("()=>document.getElementById('addModal').outerHTML"))[:2500])
    b.close();b2.close()
