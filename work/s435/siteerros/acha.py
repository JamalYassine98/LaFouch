from hoje import *
with sync_playwright() as pw:
  for tela in ['Início','Menu']:
    b,pg=abre(pw,768,1024,True,tela)
    r=pg.evaluate("""()=>[...document.querySelectorAll('a,button')].filter(e=>/Solicitar or/.test(e.textContent)).map(e=>{const r=e.getBoundingClientRect();const cs=getComputedStyle(e);return [e.tagName,e.className,e.id,Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height),cs.fontSize,cs.whiteSpace,e.parentNode.className,e.parentNode.getBoundingClientRect().width|0,getComputedStyle(e.parentNode).display, getComputedStyle(e.parentNode).gridTemplateColumns]})""")
    print(tela,r)
    for i,x in enumerate(r):
      pg.evaluate("i=>{const e=[...document.querySelectorAll('a,button')].filter(e=>/Solicitar or/.test(e.textContent))[i];e.scrollIntoView({block:'center'})}",i);pg.wait_for_timeout(600)
      pg.screenshot(path='a_%s_%d.png'%(tela[:3],i))
    b.close()
