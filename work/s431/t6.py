import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
exec(open('esb142.py').read().split('_g={}')[0].split('CASOS=[')[0])
g={};exec(open('esb142.py').read().split('_g={}')[0].replace('with sync_playwright','#'),g)
cs=[c for c in g['CASOS'] if c[0]=='v'][0]
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for x in dict(C)['inventario-fornecedores']:
    try: pg.evaluate(x)
    except Exception: pass
    w(900)
  try: pg.evaluate(cs[5][0])
  except Exception as e: print('ERR',str(e)[:300])
  w(500)
  print(pg.evaluate("()=>{const c=document.querySelector('#lotView section.card');const bs=[...c.querySelectorAll('button')].slice(0,3);return bs.map(b=>b.className+'|'+b.textContent.trim()+'|'+Math.round(b.getBoundingClientRect().left)+'-'+Math.round(b.getBoundingClientRect().right)+'|'+b.parentElement.style.cssText.slice(0,60))}"))
  b.close()
