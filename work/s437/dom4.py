exec(open('/home/claude/lafouch/work/s437/esb.py').read())
with sync_playwright() as pw:
  b,pg,w=abre(pw,True,C['hist-lista'])
  print(pg.evaluate("()=>{const e=document.querySelector('[data-act=hSem]');const c=getComputedStyle(e);e.scrollIntoView({block:'center'});return [e.outerHTML.slice(0,400),c.backgroundColor,c.borderRadius,c.border,c.padding]}"))
  w(300);pg.screenshot(path='/tmp/hs.png');b.close()
