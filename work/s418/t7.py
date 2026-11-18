import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
PED="()=>{const L=__LF,S=L.S;const it=S.items.find(i=>i.qty>0&&!i.bulk);S.pedidos.push({id:7,num:7,cli:'Hilda Teste',tel:'+595981000007',st:'novo',pg:'pagar',ts:Date.now()-5e6,itens:[{t:'x',q:1,preco:5000,ref:it.ref}],orig:'site',pag:'alias',pagar:4961,total:5000,ent:'loja'});S.pedF='novo';L.setView('ped');setTimeout(()=>L.ACT.pedab(7),300)}"
C=[('ped',PED),('dia',"()=>{__LF.setView('hist');setTimeout(()=>document.querySelector('[data-act=opendia][data-id=\"2026-11-16\"]').click(),700)}"),('fx',"()=>__LF.setView('fx')"),('din',"()=>__LF.inicioGo('din')")]
with sync_playwright() as pw:
 for tam in ('pc','tablet'):
  for n,js in C:
   b,pg,w=ap.abre(pw,'inicio',True,tam);er=[];pg.on('pageerror',lambda e:er.append(str(e)))
   pg.evaluate(js);w(1800);pg.screenshot(path='/tmp/s418/%s_%s.png'%(tam,n))
   if er: print(tam,n,er)
   b.close()
