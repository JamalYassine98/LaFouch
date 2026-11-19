exec(open('/home/claude/lafouch/work/s437/esb.py').read())
with sync_playwright() as pw:
  b,pg,w=abre(pw,True,C['reservas-30dias'])
  print(pg.evaluate("()=>[...document.querySelectorAll('a[data-id=desp]')].map(x=>{const r=x.getBoundingClientRect();return [Math.round(r.y),Math.round(r.height),x.innerText,x.closest('section,details,div').className]})"))
  pg.evaluate("()=>{const e=[...document.querySelectorAll('a[data-id=desp]')].find(x=>x.getBoundingClientRect().height);e.scrollIntoView({block:'center'})}");w(300)
  print(pg.evaluate("()=>[...document.querySelectorAll('a[data-id=desp]')].map(x=>Math.round(x.getBoundingClientRect().y))"),pg.evaluate("()=>window.scrollY"))
  pg.screenshot(path='/tmp/r4.png');b.close()
