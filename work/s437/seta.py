exec(open('/home/claude/lafouch/work/s437/esb.py').read())
with sync_playwright() as pw:
  for base in (False,True):
    b,pg,w=ap.abre(pw,'inicio',True,'celular',base=base)
    for p in C['caixa-acoes'][:1]: pg.evaluate(p);w(900)
    print(base,pg.evaluate("""()=>{const e=document.querySelector('[data-act=d48Res]');const c=getComputedStyle(e),g=e.querySelector('.g'),i=e.querySelector('i');const r=e.getBoundingClientRect();return {disp:c.display,dir:c.flexDirection,wrap:c.flexWrap,w:r.width,h:r.height,just:c.justifyContent,g:[getComputedStyle(g).display,getComputedStyle(g).flex,g.getBoundingClientRect().width],i:[getComputedStyle(i).display,i.getBoundingClientRect().y-r.y],pai:getComputedStyle(e.parentElement).textAlign}}"""))
    b.close()
