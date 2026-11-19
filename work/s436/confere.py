# S436: confere o 150i na base — todos os ícones da família com a mesma cara (escuro e claro).
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import importlib,ap;from telas import C
from playwright.sync_api import sync_playwright
import os;AP=os.environ.get('AP','celular');BASE=os.environ.get('BASE','0')=='1'
T=[('inicio','#sino'),('caixa-acoes','#cxIc'),('hist-lista','.ic71'),('dash-mes-vendido','.ic71'),('catalogo-peca','.shBtn'),('giro-no-estoque','.vdir>.ic0'),('giro-no-estoque','#sino')]
J=r"""(s)=>[...document.querySelectorAll(s)].filter(x=>x.getBoundingClientRect().width).map(x=>{const c=getComputedStyle(x),r=x.getBoundingClientRect(),v=x.querySelector('svg');return [Math.round(r.width),Math.round(r.height),c.borderTopLeftRadius,c.borderTopWidth+' '+c.borderTopColor,c.backgroundColor,v?Math.round(v.getBoundingClientRect().width):0,Math.round(r.right)]})"""
with sync_playwright() as pw:
  for esc in (True,False):
    for t,s in T:
      b,pg,w=ap.abre(pw,'inicio',esc,AP,base=BASE)
      for p in dict(C).get(t,[]):
        try: pg.evaluate(p)
        except Exception: pass
        w(500)
      print('escuro' if esc else 'claro',t,s,pg.evaluate(J,s));b.close()
