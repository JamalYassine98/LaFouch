exec(open('base.py').read())
s=serve('/home/claude/catalogo',8901);time.sleep(1)
VIS="""()=>[...document.querySelectorAll('button,a,[role=button]')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0&&getComputedStyle(e).visibility!=='hidden'}).map(e=>(e.id?'#'+e.id:'')+'.'+[...e.classList].join('.')+' '+(e.getAttribute('aria-label')||e.innerText||'').trim().slice(0,22)).slice(0,40)"""
try:
  with sync_playwright() as pw:
    b,pg,er=abre(pw,'http://localhost:8901/')
    pg.tap('#sbtn');pg.wait_for_timeout(900);print('BUSCA ABERTA:',pg.evaluate(VIS)[:25])
    pg.keyboard.press('Escape');pg.wait_for_timeout(600)
    pg.tap('#mnb');pg.wait_for_timeout(900);print('MENU ABERTO:',pg.evaluate(VIS)[:12])
    b.close()
finally: s.terminate()
