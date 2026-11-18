exec(open('base.py').read())
s=serve('/home/claude/catalogo',8901);time.sleep(1)
try:
  with sync_playwright() as pw:
      b,pg,er=abre(pw,'http://localhost:8901/')
      print(pg.evaluate("()=>[...document.querySelectorAll('.top button,.top a')].filter(e=>e.offsetWidth).map(e=>e.tagName+'#'+e.id+'.'+e.className+' ['+(e.getAttribute('aria-label')||e.innerText).slice(0,20)+']')"))
      b.close()
finally: s.terminate()
