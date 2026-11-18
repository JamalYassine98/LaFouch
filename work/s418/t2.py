import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
PED="()=>{const L=__LF,S=L.S;const it=S.items.find(i=>i.qty>0&&!i.bulk);S.pedidos.push({id:7,num:7,sid:'s7',cli:'Hilda Teste',tel:'+595981000007',st:'canc',pg:'pagar',cliNovo:true,ts:Date.now()-5e6,itens:[{t:'Armazón',q:1,preco:5000,ref:it.ref,cor:it.cor}],orig:'site',pag:'alias',pagar:4961,total:5000,ent:'loja'},{id:8,num:8,sid:'s8',cli:'Maria Fernanda Benítez',tel:'0981000008',st:'novo',pg:'pagar',ts:Date.now()-3e6,itens:[{t:'x',q:1,preco:250000,ref:it.ref}],orig:'site',pag:'pix',total:250000,ent:'loja'});S.pedF='%s';L.setView('ped');%s}"
with sync_playwright() as pw:
 for esc in (True,False):
  b,pg,w=ap.abre(pw,'inicio',esc);er=[];pg.on('pageerror',lambda e:er.append(str(e)))
  pg.evaluate(PED%('ent',''));w(1200);pg.screenshot(path='/tmp/s418/lista%d.png'%esc)
  pg.evaluate("()=>__LF.ACT.pedab(7)");w(900);pg.screenshot(path='/tmp/s418/ped7_%d.png'%esc)
  pg.evaluate("()=>scrollTo(0,9999)");w(400);pg.screenshot(path='/tmp/s418/ped7b_%d.png'%esc)
  pg.evaluate("()=>document.querySelector('[data-act=pedprod]').click()");w(900);pg.screenshot(path='/tmp/s418/peca_%d.png'%esc)
  pg.evaluate("()=>{document.querySelector('.ljBk').click()}");w(600)
  pg.evaluate("()=>{__LF.ACT.pedfecha();__LF.S.pedF='novo';__LF.render();setTimeout(()=>__LF.ACT.pedab(8),200)}");w(1000)
  pg.evaluate("()=>scrollTo(0,9999)");w(400);pg.screenshot(path='/tmp/s418/ped8_%d.png'%esc)
  print(esc,'erros',er);b.close()
