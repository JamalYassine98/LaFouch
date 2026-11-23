import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,json
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True);w(600)
  r=pg.evaluate("""()=>{const S=window.__LF.S;const L=(S.items||S.prods||[]);return {n:L.length,k:Object.keys(L[0]||{}),tipos:[...new Set(L.map(i=>i.tipo||i.t))],am:L.slice(0,60).map(i=>[i.tipo||i.t,i.nome||i.n,i.preco||i.p||i.pv,i.custo||i.c,i.qtd||i.q])}}""")
  print(json.dumps(r,ensure_ascii=False)[:3000]);b.close()
