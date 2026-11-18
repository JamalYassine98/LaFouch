exec(open('base.py').read())
s=serve('/home/claude/catalogo',8901);time.sleep(1)
cfg=json.dumps({"ativo":True,"evento":{"tema":"natal","ini":0,"fim":0}})
try:
  with sync_playwright() as pw:
    b,pg,er=abre(pw,'http://localhost:8901/',ls={'lf_cfg':cfg})
    q="()=>({ev:document.documentElement.getAttribute('data-ev'),bar:!!document.querySelector('.evbar'),deco:[...document.querySelectorAll('[class*=deco],[class*=enf]')].filter(e=>e.offsetWidth).length})"
    print('inicio',pg.evaluate(q));pg.screenshot(path=T+'ev_inicio.png')
    pg.touchscreen.tap(354,70);pg.wait_for_timeout(1200)
    print('sacola',pg.evaluate(q));pg.screenshot(path=T+'ev_sacola.png')
    print(er[:3]);b.close()
finally: s.terminate()
