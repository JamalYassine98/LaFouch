exec(open('esb.py').read().split("CX=C['caixa-acoes']")[0])
CX=C['caixa-acoes'][:1]
with sync_playwright() as pw:
  b,pg,w=abre(pw,'cx',CX)
  print([x for x in pg.evaluate(A2) if 'Caixa' in str(x)])
  pg.evaluate("()=>__nv.abas(['Caixa','Despesas','Câmbio'],0)");w(400)
  print([x for x in pg.evaluate(A2) if 'Caixa' in str(x)][:2])
  print(pg.evaluate("()=>{const h=__nv.tit(),ic=document.querySelector('#cxIc');const r=document.createRange();r.selectNodeContents(h);const L=r.getClientRects()[0];const b=ic.getBoundingClientRect();return [L.top,L.height,b.top,b.height,ic.style.transform,getComputedStyle(ic).transform]}"))
  b.close()
