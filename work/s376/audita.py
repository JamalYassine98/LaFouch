# S376: auditoria visual de TODOS os botões (dono 17/11 19:09). Medida por programa: texto quebrado, cortado, fora da tela, toque baixo + olho.
import sys,os,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
BTN=open('btn.js').read();OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
PNG='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
RICO="""()=>{const L=window.__LF,S=L.S;const its=S.items.filter(i=>i.qty>0&&!i.bulk);
 const P=(id,st,pg,x)=>Object.assign({id,num:id,sid:'s'+id,cli:'Maria López',tel:'0981000'+id,st,pg,ts:Date.now()-50*60000,itens:[{t:its[0].ref,q:1,p:250000,ref:its[0].ref}],orig:'site',cod:'AB'+id,pag:'pix',total:250000,ent:'loja'},x||{});
 S.pedidos.push(P(901,'novo','pagar'),P(902,'novo','comp',{comp:'%s'}),P(903,'sep','pago',{tok:'LF-ABCD'}),P(904,'pronto','pago',{tok:'LF-EFGH',ent:'envio',end:'Av. España 1234, Asunción'}),P(905,'ent','pago'),P(906,'canc','pagar',{cancSite:true}));
 S.clientes=S.clientes||[];S.clientes.push({id:77,nome:'Óptica Central',email:'compras@exemplo.com',tel:'0981777777'},{id:78,nome:'Maria López',tel:'0981000901'});
 S.ataContas=S.ataContas||{};S.ataContas.A77={id:'A77',nome:'Óptica Central',email:'compras@exemplo.com',tipo:'assoc',tab:'opt',dispMax:3,trocaOk:true,pausada:false,cancelada:false,cliId:'77',ts:Date.now()-20*86400000,aparelhos:[]};
 S.imprev=(S.imprev||[]).concat([{ts:Date.now()-86400000,valor:50000,desc:'Conserto da vitrine'}]);
 S.nuvem={email:'loja@exemplo.com',rt:'r',ts:Date.now(),cot:'',dst:''};S.syncOn=true;S.pinHash='x';S.bioOn=false;}"""%PNG
ABRE="""()=>{const v=document.querySelector('.view:not([hidden])')||document;let n=0;[...v.querySelectorAll('[aria-expanded=false]')].slice(0,14).forEach(b=>{if(/fold|Ab|fx|hSem|ecTog|mkSec|dfold/i.test((b.dataset.act||'')+b.className)){try{b.click();n++}catch(e){}}});v.querySelectorAll('details:not([open])').forEach(d=>d.open=true);return n}"""
G=lambda k:"()=>window.__LF.inicioGo('%s')"%k
V=lambda k:"()=>window.__LF.setView('%s')"%k
CENAS=[('inicio',V('inicio'),0),('inicio-editar',"()=>{window.__LF.setView('inicio');window.__LF.ACT.inicioEd&&window.__LF.ACT.inicioEd()}",0)]
for k in ('hoje','din','giro','prec','repo','dia','mkt','ata','cup','tem','anl','msg','cat'): CENAS.append(('go-'+k,G(k),1))
for k in ('estoque','vendas','caixa','desp','fx','hist','clientes','notif'): CENAS.append((k,V(k),1))
for t in ('novo','sep','ent','canc'): CENAS.append(('ped-lista-'+t,"()=>{const L=window.__LF;L.S.pedF='%s';L.setView('ped')}"%t,0))
for i in range(901,907): CENAS.append(('ped-%d'%i,"()=>{const L=window.__LF;L.setView('ped');setTimeout(()=>L.ACT.pedab(%d),400)}"%i,0))
for k in ('imp','tema','seg','ped','av','sync','upd','pauto','bk'): CENAS.append(('aj-'+k,"()=>{window.__LF.setView('ajustes');setTimeout(()=>{const s=document.querySelector('#ajGrp .ajS[data-k=%s]:not(.on) .ajR');s&&s.click()},300)}"%k,0))
CENAS+= [('aj-nuvem',"()=>{window.__LF.setView('ajustes');setTimeout(()=>window.__LF.ACT.nvxNuvem(),500)}",0),('aj-arquivo',"()=>{window.__LF.setView('ajustes');setTimeout(()=>window.__LF.ACT.nvxArq(),500)}",0),('aj-aparelhos',"()=>{window.__LF.setView('ajustes');setTimeout(()=>window.__LF.ACT.nvxAps(),500)}",0),
 ('carrinho',"()=>{const L=window.__LF,S=L.S;S.cart=S.items.filter(i=>i.qty>0&&!i.bulk).slice(0,2).map(i=>({it:i,qty:1,tab:S.tabAtiva,preco:null}));L.setView('vendas');setTimeout(()=>L.ACT.cartopen(),400)}",0),
 ('pagamento',"()=>{const L=window.__LF,S=L.S;S.cart=S.items.filter(i=>i.qty>0&&!i.bulk).slice(0,1).map(i=>({it:i,qty:1,tab:S.tabAtiva,preco:null}));L.setView('vendas');setTimeout(()=>{L.ACT.cartopen();setTimeout(()=>L.ACT.cartgo&&L.ACT.cartgo(),300)},400)}",0),
 ('cliente-ficha',"()=>{const L=window.__LF;L.setView('clientes');setTimeout(()=>{L.S.cliSel=77;L.render&&L.render()},300)}",0),
 ('atacado-conta',"()=>{const L=window.__LF;L.setView('clientes');setTimeout(()=>L.ACT.ataConta(77),400)}",0),
 ('peca-ficha',"()=>{const L=window.__LF;L.setView('estoque');setTimeout(()=>{const c=document.querySelector('#v-estoque .pcard[data-ref],#v-estoque [data-ref]');c&&c.click()},500)}",0)]
res={}
only=os.environ.get('SO')
with sync_playwright() as pw:
  for esc in (False,True):
    for nome,js,abre in CENAS:
      if only and nome not in only.split(','): continue
      b,pg,w=ap.abre(pw,'inicio',esc);w(400)
      pg.route('**/*googleapis.com/**',lambda r:r.fulfill(status=200,body='{"documents":[]}',content_type='application/json'))
      erros=[];pg.on('pageerror',lambda e:erros.append(str(e)[:120]))
      try:
        pg.evaluate(RICO);pg.evaluate(js);w(1500)
        if abre: pg.evaluate(ABRE);w(900)
        bt=pg.evaluate(BTN);ol=pg.evaluate(OLHO) or []
        pg.screenshot(path='/tmp/s376/%s_%d.png'%(nome,esc),full_page=True)
      except Exception as e: bt=[];ol=[];erros.append('FALHOU '+str(e)[:100])
      res['%s|%s'%(nome,'escuro' if esc else 'claro')]={'btn':bt,'olho':ol,'erros':erros}
      print(nome,'escuro' if esc else 'claro',len(bt),'botões suspeitos ·',len(ol),'olho',('· ERRO '+erros[0]) if erros else '',flush=True)
      b.close()
json.dump(res,open('res.json','w'),ensure_ascii=False,indent=0)
