import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap
from playwright.sync_api import sync_playwright
src=open('fotos2.py').read();exec(src[src.index('NUV='):src.index('CAM=')])
M="()=>[...document.querySelectorAll('body *')].filter(e=>{const c=getComputedStyle(e);const r=e.getBoundingClientRect();return (c.position=='fixed')&&r.height>120&&r.width>300&&c.visibility!='hidden'&&+c.opacity>0}).map(e=>({cls:e.className.toString().slice(0,40),id:e.id,top:Math.round(e.getBoundingClientRect().top),bot:Math.round(e.getBoundingClientRect().bottom),ih:innerHeight}))"
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=False);w(900)
  pg.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(b=>{const r=b.getBoundingClientRect();return r.height&&/Adicionar/.test(b.getAttribute('aria-label')||'')});b.setAttribute('data-esb2','1')}");pg.locator('[data-esb2]').first.click();w(1200)
  print('Adicionar',pg.evaluate(M))
  toca(pg,'Chegou mercadoria');w(1200);print('Chegou',pg.evaluate(M))
  b.close()
