# ESBOCO 24/11 — Parte 2 (Peças): fotos do app real, nuvem ligada, toques de verdade (locator.click)
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap
from playwright.sync_api import sync_playwright
NUV="()=>{const S=__LF.S;S.nuvem=Object.assign({},S.nuvem||{},{rt:'teste',u:'dono@lafouch.com',ok:1});}"
def toca(pg,txt):
  h=pg.evaluate("(t)=>{const els=[...document.querySelectorAll('button,[data-act],[role=button],a')].filter(e=>{const r=e.getBoundingClientRect();return r.height>0&&r.bottom>0});const e=[...els].reverse().find(e=>e.textContent.trim().replace(/\\s+/g,' ').startsWith(t))||els.find(e=>e.textContent.includes(t));document.querySelectorAll('[data-esb]').forEach(x=>x.removeAttribute('data-esb'));if(!e)return 0;e.setAttribute('data-esb','1');return 1}",txt)
  if h: pg.locator('[data-esb]').first.click()
  return h
CAM=[('Peças',['ABA:Peças']),('Inventário',['ABA:Peças','Inventário']),('Compras',['ABA:Peças','Compras']),
     ('Adicionar',['ABA:Peças','Inventário','#addMenu']),('Chegou mercadoria',['ABA:Peças','Inventário','#addMenu','Chegou mercadoria']),
     ('Preencher à mão',['ABA:Peças','Inventário','#addMenu','Preencher à mão']),('Ficha da peça',['ABA:Peças','Inventário','FICHA'])]
R={}
with sync_playwright() as pw:
  for esc in (True,False):
    for nome,passos in CAM:
      b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=False);w(700);pg.evaluate(NUV);w(300);log=[]
      for p in passos:
        if p.startswith('ABA:'):
          t=p[4:];pg.evaluate("(t)=>{const b=[...document.querySelectorAll('button,a')].find(e=>{const r=e.getBoundingClientRect();return r.height&&r.top>innerHeight-120&&e.textContent.trim()===t});b&&b.setAttribute('data-esb','1')}",t);pg.locator('[data-esb]').first.click();ok=1
        elif p=='#addMenu':
          ok=pg.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(b=>{const r=b.getBoundingClientRect();return r.height&&/Adicionar/.test(b.getAttribute('aria-label')||'')});if(!b)return 0;b.setAttribute('data-esb2','1');return 1}")
          if ok:pg.locator('[data-esb2]').first.click()
        elif p=='FICHA':
          ok=pg.evaluate("()=>{const e=[...document.querySelectorAll('.view:not([hidden]) [data-ref]')].find(e=>e.getBoundingClientRect().height>30);if(!e)return 0;e.setAttribute('data-esb3','1');return 1}")
          if ok:pg.locator('[data-esb3]').first.click()
        else: ok=toca(pg,p)
        log.append((p,ok));w(1100)
      f='p2_%s_%s.png'%(nome.replace(' ','_'),'esc' if esc else 'cla');pg.screenshot(path=f,full_page=False);b.close();R[f]=log
for k,v in R.items():print(k,v)
