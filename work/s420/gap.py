import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
exec(open('esb134r.py').read().split('BL=[[')[0])
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(400)
  for p in FICHA: pg.evaluate(p);w(1100)
  pg.add_style_tag(content=CA);pg.evaluate(JA);w(500)
  print(pg.evaluate("""()=>{const t=document.querySelector('#fnAbas').getBoundingClientRect();const v=document.querySelector('#v-estoque [aria-label=Voltar]');const q=v.getBoundingClientRect();
  let n=document.querySelector('#v-estoque .fnBar');const o=[];let e=n;while(e&&!e.contains(v)){o.push(e.className+' mb='+getComputedStyle(e).marginBottom+' pb='+getComputedStyle(e).paddingBottom);e=e.nextElementSibling}
  const P=v.closest('.card,[aria-label]');return {abas:t.bottom,voltar:q.top,gap:q.top-t.bottom,irmaos:o,pai:n.parentElement.className,gapPai:getComputedStyle(n.parentElement).gap,cat:v.parentElement.parentElement.parentElement.className, catMt:getComputedStyle(v.parentElement.parentElement.parentElement).marginTop, catPt:getComputedStyle(v.parentElement.parentElement.parentElement).paddingTop,cl:[...Array(5)].map((_,i)=>{let x=v;for(let k=0;k<=i;k++)x=x.parentElement;const c=getComputedStyle(x);return x.tagName+'.'+x.className+' al='+x.getAttribute('aria-label')+' pt='+c.paddingTop+' mt='+c.marginTop})}}"""))
  b.close()
