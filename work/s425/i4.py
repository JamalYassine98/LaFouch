import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C)
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for p in D['caixa-movimentos']: pg.evaluate(p);w(900)
  print(pg.evaluate("""()=>{const o=[];for(const rx of [/^O dinheiro em caixa/,/^Movimentos/]){const e=[...document.querySelectorAll('.view section,.view div')].filter(x=>x.getBoundingClientRect().height&&rx.test((x.innerText||'').trim())).pop();if(e){let c=e;const L=[];for(let i=0;i<4let c=e;while(c&&getComputedStyle(c).borderTopWidth=='0px'&&getComputedStyle(c).backgroundColor=='rgba(0, 0, 0, 0)')c=c.parentElement;o.push((c||e).tagName+'.'+(c||e).className+' :: '+(c||e).outerHTML.slice(0,400))let c=e;while(c&&getComputedStyle(c).borderTopWidth=='0px'&&getComputedStyle(c).backgroundColor=='rgba(0, 0, 0, 0)')c=c.parentElement;o.push((c||e).tagName+'.'+(c||e).className+' :: '+(c||e).outerHTML.slice(0,400))c;i++){const s=getComputedStyle(c);L.push(c.tagName+'.'+c.className+' bg='+s.backgroundColor+' bd='+s.borderTopWidth+' '+s.borderTopStyle);c=c.parentElement}o.push(L.join(' < '))}}return o}"""))
  b.close()
