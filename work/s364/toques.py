import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from comum import olho
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    for esc in (True,False):
        b,pg,w=ap.abre(pw,'desp',esc);er=[];pg.on('pageerror',lambda e:er.append(str(e)));w(1200)
        r=pg.evaluate("()=>{const c=[...document.querySelectorAll('#v-desp section')].find(s=>/^Contas para pagar/.test(s.innerText.trim()));if(!c)return 'sem cartão';const bs=[...c.querySelectorAll('[data-act=exppay]')];return [bs.length,bs[0]&&bs[0].innerText.replace(/\\n/g,' '),bs[0]&&Math.round(bs[0].getBoundingClientRect().height)]}")
        print('contas',r,sorted(olho(pg))[:5])
        if isinstance(r,list) and r[0]:
            pg.evaluate("()=>{const c=[...document.querySelectorAll('#v-desp section')].find(s=>/^Contas para pagar/.test(s.innerText.trim()));c.querySelector('[data-act=exppay]').scrollIntoView({block:'center'})}");w(300);pg.screenshot(path='/tmp/gt/tq_%d.png'%esc)
            pg.evaluate("()=>{const c=[...document.querySelectorAll('#v-desp section')].find(s=>/^Contas para pagar/.test(s.innerText.trim()));c.querySelector('[data-act=exppay]').click()}");w(700)
            print('  depois de pagar:',pg.evaluate("()=>{const c=[...document.querySelectorAll('#v-desp section')].find(s=>/^Contas para pagar/.test(s.innerText.trim()));return c?c.querySelectorAll('[data-act=exppay]').length:0}"))
        pg.evaluate("()=>{const L=window.__LF;L.S.dTab='hoje';L.S._d48={c1:true,c0:true,c2:true};L.setView('dash')}");w(1500)
        print('colchão',pg.evaluate("()=>{const b=[...document.querySelectorAll('#dtabBody [data-act=d48Troca]')].map(e=>e.innerText.replace(/\\n/g,' ')+' ['+e.dataset.id+']');return b}"))
        pg.evaluate("()=>{const L=window.__LF;L.S.dTab='prec';L.setView('dash')}");w(1500)
        print('preços',pg.evaluate("()=>[...document.querySelectorAll('#v-dash .cntK[data-act]')].map(e=>e.innerText.replace(/\\n/g,' ')+' → '+e.dataset.act+' '+e.dataset.id)"),sorted(olho(pg))[:5])
        pg.evaluate("()=>{const L=window.__LF;L.S.cash={pyg:0,usd:0,brl:0};L.setView('caixa')}");w(1200)
        print('caixa',pg.evaluate("()=>{const b=document.querySelector('#v-caixa [data-act=d48Res]');return b?b.innerText.replace(/\\n/g,' '):'sem aviso'}"),sorted(olho(pg))[:5],er)
        if pg.query_selector('#v-caixa [data-act=d48Res]'): pg.evaluate("()=>document.querySelector('#v-caixa [data-act=d48Res]').click()");w(800);print('  →',pg.evaluate("()=>[window.__LF.S.view,window.__LF.S.dTab]"))
        b.close()
