# S374: teste "com calma" do catálogo implementado (98–103): cada tela abre sem erro, blocos agrupados, cada bloco abre e fecha,
# links classificados, Marketing como tela, Lista de compras em Fornecedores. Claro e escuro.
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
TELAS=[('inicio',"()=>window.__LF.setView('inicio')"),('vendas',"()=>window.__LF.setView('vendas')"),('estoque',"()=>window.__LF.setView('estoque')"),
 ('hoje',"()=>window.__LF.inicioGo('hoje')"),('hist',"()=>window.__LF.inicioGo('hist')"),('giro',"()=>window.__LF.inicioGo('giro')"),('prec',"()=>window.__LF.inicioGo('prec')"),
 ('din',"()=>window.__LF.inicioGo('din')"),('caixa',"()=>window.__LF.setView('caixa')"),('desp',"()=>window.__LF.setView('desp')"),('fx',"()=>window.__LF.setView('fx')"),
 ('site',"()=>window.__LF.setView('site')"),('ped',"()=>window.__LF.setView('ped')"),('mkt',"()=>window.__LF.inicioGo('mkt')"),('cup',"()=>window.__LF.inicioGo('cup')"),
 ('clientes',"()=>window.__LF.setView('clientes')"),('ata',"()=>window.__LF.setView('ata')"),('ajustes',"()=>window.__LF.setView('ajustes')"),('notif',"()=>window.__LF.setView('notif')")]
ruim=[]
with sync_playwright() as pw:
  for esc in (True,False):
    b,pg,w=ap.abre(pw,'inicio',esc);E=[];pg.on('pageerror',lambda e:E.append(str(e)[:150]))
    for nm,js in TELAS:
        pg.evaluate(js);w(1200)
        info=pg.evaluate("""async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));const v=document.querySelector('.view:not([hidden])');
          const soltos=[...v.querySelectorAll('section.card.fxF,.card.ecF')].filter(s=>!s.parentElement.classList.contains('g99')).length;
          const ids=[...v.querySelectorAll('section.card.fxF')].map(s=>s.dataset.fx);const res=[];
          for(const id of ids){const q=()=>document.querySelector('section.card.fxF[data-fx="'+id+'"]');let s=q();if(!s)continue;const h=s.querySelector('.fxH');const t0=h.getBoundingClientRect().top;
            h.click();await w(650);s=q();const ab=!!(s&&s.querySelector('.fxB'))&&s.parentElement.classList.contains('g99');const t1=s?s.querySelector('.fxH').getBoundingClientRect().top:0;
            s.querySelector('.fxH').click();await w(650);s=q();const fe=!!s&&!s.querySelector('.fxB')&&s.parentElement.classList.contains('g99');
            res.push(id+':'+(ab?'abre':'NÃOABRE')+'/'+(fe?'fecha':'NÃOFECHA')+'/'+Math.round(t1-t0))}
          const lk=[...v.querySelectorAll('.lk100')].map(e=>(e.classList.contains('inl')?'i:':'c:')+e.textContent.trim().slice(0,18));
          return {soltos,res,lk,mkt:!!document.querySelector('#v-mkt:not([hidden]) .mkDtG')}}""")
        tag='%s %s'%('esc' if esc else 'cla',nm)
        bad=[r for r in info['res'] if 'NÃO' in r or abs(int(r.split('/')[-1]))>2]
        if info['soltos'] or bad: ruim.append((tag,info['soltos'],bad))
        print(tag,'soltos',info['soltos'],'blocos',info['res'],'links',info['lk'][:6],'mkt' if info['mkt'] else '')
    # Marketing: os 3 blocos abrem e fecham
    pg.evaluate("()=>window.__LF.inicioGo('mkt')");w(900)
    mk=pg.evaluate("""async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));const o=[];for(const d of document.querySelectorAll('#v-mkt details.mkDt')){d.querySelector('summary').click();await w(600);const a=d.open&&d.querySelector('.mkFb').offsetHeight>10;d.querySelector('summary').click();await w(500);o.push(d.querySelector('summary').textContent+':'+(a?'abre':'NÃO')+'/'+(!d.open?'fecha':'NÃO'))}return [document.querySelector('#grpTabs .dHdT,#v-mkt .top h1').textContent,o]}""")
    print('mkt',mk)
    # Fornecedores
    pg.evaluate("()=>{window.__LF.setView('estoque')}");w(800)
    p0=pg.evaluate("()=>{const l=document.getElementById('lcIrInv');return !!l&&!l.hidden}")
    pg.evaluate("()=>{const b=[...document.querySelectorAll('#v-estoque button')].find(x=>/^Fornecedores/.test(x.textContent.trim()));b.click()}");w(900)
    p1=pg.evaluate("()=>{const l=document.getElementById('lcIrInv'),v=document.getElementById('v-estoque');return [!!l&&!l.hidden,v.lastElementChild===l,getComputedStyle(l).textAlign]}")
    print('fornecedores',p0,p1)
    print('erros',E[:5]);b.close()
print('RUIM',ruim)
