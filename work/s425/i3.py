import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C)
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for p in D['despesas-conta']: pg.evaluate(p);w(900)
  print(pg.evaluate("""()=>{const e=[...document.querySelectorAll('.view *')].filter(x=>x.getBoundingClientRect().height&&/^Aluguel da loja/.test((x.innerText||'').trim()));const r=e[0]?[e[0],e[0].parentElement,e[0].parentElement.parentElement,e[0].parentElement.parentElement.parentElement]:[];return r.map(x=>x.tagName+'.'+x.className+' bg='+getComputedStyle(x).backgroundColor+' br='+getComputedStyle(x).borderTopWidth+' rad='+getComputedStyle(x).borderRadius)}"""))
  print(pg.evaluate("()=>[...document.querySelectorAll('h1,h2')].filter(x=>x.getBoundingClientRect().height).map(x=>x.tagName+':'+x.textContent.trim().slice(0,14)+':'+getComputedStyle(x).fontSize)"))
  b.close()
