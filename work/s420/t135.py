import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(400)
  for p in D['inventario-ficha']: pg.evaluate(p);w(1100)
  print(pg.evaluate("""()=>{const r=e=>{const q=e.getBoundingClientRect();return [Math.round(q.left),Math.round(q.top),Math.round(q.right),Math.round(q.bottom)]};
  const o={};o.tabs=[...document.querySelectorAll('#v-estoque button')].filter(x=>x.getBoundingClientRect().height&&/^(Preço|Histórico|Site|Fotos|Cores|Detalhes|Resumo)/.test(x.textContent.trim())).map(x=>x.textContent.trim()+' '+x.className+' '+(x.dataset.act||''));
  o.ed=[...document.querySelectorAll('#v-estoque [aria-label]')].filter(x=>x.getBoundingClientRect().height).map(x=>x.getAttribute('aria-label')+' '+x.className+' '+r(x));
  o.sd=[...document.querySelectorAll('#v-estoque *')].filter(x=>x.children.length<3&&/Sem detalhe/.test(x.textContent)&&x.getBoundingClientRect().height).slice(0,3).map(x=>x.tagName+'.'+x.className+' '+r(x)+' '+x.outerHTML.slice(0,300));
  return JSON.stringify(o,null,1)}"""))
  pg.screenshot(path='/tmp/s420/f0.png');b.close()
