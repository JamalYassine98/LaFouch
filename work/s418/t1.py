import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True)
  er=[];pg.on('pageerror',lambda e:er.append(str(e)))
  # estorno via dia
  pg.evaluate("()=>__LF.inicioGo('hoje')");w(1200)
  r=pg.evaluate("()=>{const b=document.querySelector('#v-dia .sl418L');b.click();return !!b}");w(500)
  pg.evaluate("()=>document.querySelector('#v-dia [data-act=estorno]').click()");w(700)
  print('janela',pg.evaluate("()=>{const j=document.querySelector('.ljJn.lfCf');return j?j.innerText.replace(/\\n/g,' | '):'-'}"))
  pg.screenshot(path='/tmp/s418/estorno.png')
  pg.evaluate("()=>document.querySelector('.cf418B').click()");w(900)
  print('estornada',pg.evaluate("()=>document.querySelector('#v-dia .sl418.est')?'sim':'nao'"))
  # pedido: cancelar + remover + desfazer
  pg.evaluate("()=>{const L=__LF,S=L.S;const it=S.items.find(i=>i.qty>0&&!i.bulk);S.pedidos.push({id:902,num:902,cli:'Maria Teste',tel:'0981000902',st:'novo',pg:'pagar',ts:Date.now()-5e5,itens:[{t:it.ref,q:1,p:250000,ref:it.ref}],orig:'app',pag:'pix',total:250000,ent:'loja'});S.pedF='novo';L.setView('ped');setTimeout(()=>L.ACT.pedab(902),300)}");w(1200)
  pg.evaluate("()=>document.querySelector('[data-act=pedcanc]').click()");w(700)
  print('janela2',pg.evaluate("()=>{const j=[...document.querySelectorAll('.ljJn.lfCf')].pop();return j?j.innerText.replace(/\\n/g,' | '):'-'}"))
  pg.evaluate("()=>[...document.querySelectorAll('.cf418B')].pop().click()");w(900)
  print('st',pg.evaluate("()=>__LF.S.pedidos.find(p=>p.id==902).st"))
  pg.evaluate("()=>__LF.ACT.peddel(902)");w(500)
  print('apos del',pg.evaluate("()=>__LF.S.pedidos.some(p=>p.id==902)"), pg.evaluate("()=>document.getElementById('lfDesf').className"))
  pg.evaluate("()=>document.querySelector('#lfDesf button').click()");w(500)
  print('desfeito',pg.evaluate("()=>__LF.S.pedidos.some(p=>p.id==902)"))
  print('erros',er)
  b.close()
