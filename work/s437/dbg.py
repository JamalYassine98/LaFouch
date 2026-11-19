exec(open('/home/claude/lafouch/work/s437/voltar2.py').read().split("REFP=")[0])
with sync_playwright() as pw:
  for t,rot in (('catalogo-peca','Catálogo'),('inventario-ficha','Inventário')):
    b,pg,w=abre(pw,True,C[t]);pg.evaluate("()=>("+JS+")('%s')"%rot);w(400)
    print(t,[x for x in pg.evaluate(A2) if '‹' in x['ex'][0]])
    print(pg.evaluate("()=>{const v=document.querySelector('.nvVsP');const p=v.parentElement;const r=v.getBoundingClientRect();const sib=[...p.children].map(c=>{const q=c.getBoundingClientRect();return [c.tagName,c.className,Math.round(q.x),Math.round(q.y),Math.round(q.width),Math.round(q.height)]});const s=getComputedStyle(p);return [s.display,s.alignItems,s.justifyContent,sib, p.getBoundingClientRect().x]}"))
    b.close()
with sync_playwright() as pw:
  b,pg,w=abre(pw,True,C['catalogo-peca']);pg.evaluate("()=>("+JS+")('Catálogo')");w(400)
  print(pg.evaluate("""()=>{const v=document.querySelector('.nvVsP');let p=v.parentElement;const out=[];for(let k=0;k<3;k++){const r=p.getBoundingClientRect();out.push([p.tagName,p.className.slice(0,30),Math.round(r.x),Math.round(r.right),getComputedStyle(p).paddingLeft]);p=p.parentElement}
  const kids=[...v.parentElement.parentElement.children].slice(0,8).map(c=>{const r=c.getBoundingClientRect();return [c.tagName,c.className.slice(0,20),Math.round(r.x),Math.round(r.right),c.innerText.slice(0,15)]});return [out,kids]}"""))
  b.close()
