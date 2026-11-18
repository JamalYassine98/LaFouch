exec(open('base.py').read())
s=serve('/home/claude/catalogo',8901);time.sleep(1)
try:
  with sync_playwright() as pw:
      b,pg,er=abre(pw,'http://localhost:8901/',ls={'lf_cfg':json.dumps({"ativo":True,"evento":{"tema":"natal","ini":0,"fim":0}})})
      pg.touchscreen.tap(354,70);pg.wait_for_timeout(2500)
      print(pg.evaluate("""()=>{const o=[];for(const y of [10,40,60]){const els=document.elementsFromPoint(195,y).slice(0,6);o.push(y+': '+els.map(e=>{const c=getComputedStyle(e);return e.tagName+'#'+e.id+'.'+[...e.classList].join('.')+'['+c.position+' z'+c.zIndex+' top'+c.top+']'}).join(' > '))}
      const bar=document.getElementById('evbar')||document.querySelector('[id*=evbar],[class*=evbar]');return o.join('\\n')+'\\nBAR '+(bar?bar.outerHTML.slice(0,120)+' '+JSON.stringify(bar.getBoundingClientRect()):'none')}"""))
      b.close()
finally: s.terminate()
