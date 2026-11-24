# ESBOCO 24/11 — Parte 3 (Dinheiro): fotos inteiras do app real, nuvem ligada, toques de verdade
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap
from playwright.sync_api import sync_playwright
src=open('fotos2.py').read();exec(src[src.index('NUV='):src.index('CAM=')])
def aba(pg,t):
  pg.evaluate("(t)=>{const b=[...document.querySelectorAll('button,a')].find(e=>{const r=e.getBoundingClientRect();return r.height&&r.top>innerHeight-120&&e.textContent.trim()===t});b&&b.setAttribute('data-esb','1')}",t);pg.locator('[data-esb]').first.click()
CAM=[('Dinheiro',[]),('Caixa',['Caixa']),('Reservas',['Reservas']),('Despesas',['Despesas']),('Câmbio',['Câmbio'])]
with sync_playwright() as pw:
  for esc in (True,False):
    for nome,passos in CAM:
      b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=False);w(700);pg.evaluate(NUV);aba(pg,'Dinheiro');w(1000)
      for p in passos: print(nome,p,toca(pg,p));w(1200)
      pg.evaluate("()=>scrollTo(0,0)");w(300)
      pg.screenshot(path='p3_%s_%s.png'%(nome,'esc' if esc else 'cla'),full_page=True)
      print(nome,pg.evaluate("()=>[...document.querySelectorAll('.view:not([hidden]) button,.view:not([hidden]) [data-act]')].filter(b=>b.getBoundingClientRect().height).map(b=>b.textContent.trim().replace(/\\s+/g,' ').slice(0,34)).filter(Boolean).slice(0,30)") if esc else '')
      b.close()
