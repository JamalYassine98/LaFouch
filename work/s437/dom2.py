import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap;from telas import C
from playwright.sync_api import sync_playwright
C=dict(C)
Q={'caixa-acoes':['Ver o que falta repor','Ver todos os movimentos','Reservas'],'precos':['ajustar tabela','ajustar'],'giro-no-estoque':['preços para corrigir'],'reservas-30dias':['Editar despesas']}
with sync_playwright() as pw:
  for t,L in Q.items():
    b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True)
    for p in C[t]:
      try: pg.evaluate(p)
      except Exception: pass
      w(800)
    for x in L:
      print(t,x,pg.evaluate("t=>{const e=[...document.querySelectorAll('button,a,[data-act]')].find(e=>e.innerText.trim().includes(t)&&e.getBoundingClientRect().height);if(!e)return 'nada';const c=getComputedStyle(e);return [e.outerHTML.slice(0,220),c.fontSize,c.fontWeight,c.color,c.textDecorationLine]}",x))
    b.close()
