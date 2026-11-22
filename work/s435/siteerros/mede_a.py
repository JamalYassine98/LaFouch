from hoje import *
with sync_playwright() as pw:
  for W in (700,768,820,1024):
    b,pg=abre(pw,W,1024,True,'Início')
    print(W,pg.evaluate("""()=>{const h=document.querySelector('.hata');const cs=getComputedStyle(h);const t=h.querySelector('.hatt'),i=h.querySelector('.hati');const bt=h.querySelector('.lfba');return [cs.gridTemplateColumns,h.getBoundingClientRect().width|0,i.getBoundingClientRect().width|0,t.getBoundingClientRect().width|0,getComputedStyle(t).padding,bt.getBoundingClientRect().height|0, h.querySelector('h3').getBoundingClientRect().height|0]}"""))
    b.close()
