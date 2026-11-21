import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
def limpa(h): return re.sub(r'<svg.*?</svg>','<svg/>',h)
with sync_playwright() as pw:
  for n in ['caixa-conferir','caixa-novo-objetivo','caixa-retirar']:
    b,pg,w=ap.abre(pw,'inicio',True)
    for p in D[n]: pg.evaluate(p);w(1100)
    print('==',n,limpa(pg.evaluate("()=>{const j=[...document.querySelectorAll('[role=dialog]:not([hidden]),.sheet:not([hidden]),.ljJn,.cxJ,.bs')].filter(e=>e.getBoundingClientRect().height>50).pop();return j?j.className+' | '+j.outerHTML:'nada'}"))[:2500])
    b.close()
