exec(open('base.py').read())
s=serve('/home/claude/catalogo',8901);time.sleep(1)
try:
  with sync_playwright() as pw:
    for nome,ls in [('sem',{}),('natal',{'lf_cfg':json.dumps({"ativo":True,"evento":{"tema":"natal","ini":0,"fim":0}})})]:
      b,pg,er=abre(pw,'http://localhost:8901/',ls=ls)
      pg.touchscreen.tap(354,70);pg.wait_for_timeout(2500)
      print(nome,pg.evaluate("()=>{const t=document.querySelector('.top'),e=document.querySelector('.evbar');const r=x=>x?[Math.round(x.getBoundingClientRect().top),Math.round(x.getBoundingClientRect().bottom)]:null;return {top:r(t),evbar:r(e),scrollY:scrollY}}"))
      pg.screenshot(path=T+'car_'+nome+'.png',clip={'x':0,'y':0,'width':390,'height':160});b.close()
finally: s.terminate()
