import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'caixa',True,ap='pc');w(900)
  d=pg.evaluate("()=>[...document.querySelectorAll('#mainnav button')].filter(x=>x.offsetHeight).map(x=>[x.dataset.id,x.innerText.trim(),(x.querySelector('svg')||{}).outerHTML||''])")
  json.dump(d,open('pcnav.json','w'),ensure_ascii=False);print([x[:2] for x in d])
  print(pg.evaluate("()=>{const e=document.querySelector('#mainnav');return getComputedStyle(e).width}"))
  b.close()
