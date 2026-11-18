exec(open('base.py').read())
s=serve('/home/claude/catalogo',8901);time.sleep(1)
try:
  with sync_playwright() as pw:
    b,pg,er=abre(pw,'http://localhost:8901/')
    pg.tap('#sbtn');pg.wait_for_timeout(900)
    print(pg.evaluate("()=>[...document.querySelectorAll('#sov button,#sov a,#sov [role=button]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.id||'')+'.'+e.className+' '+(e.getAttribute('aria-label')||e.innerText||'').trim().slice(0,20))"))
    pg.screenshot(path=T+'busca.png');b.close()
finally: s.terminate()
