# S400 · conferência: pedido pago (59f), avaliar depois de entregue (59g), Cartões (61i), Cédula|RUC e voltar sem limpar (59d/59e)
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import pago,comum2,comum
from playwright.sync_api import sync_playwright
T='/tmp/s400/'
with sync_playwright() as pw:
    b,pg,w=pago.abre(pw,'pago','pago');er=[];pg.on('pageerror',lambda e:er.append(str(e)))
    print('59f pago | cartões/opinião na tela:',pg.evaluate("()=>{const o=document.getElementById('pkok');return [!!o,o&&o.querySelectorAll('.amwrap,.amc,.pxc,#pxcard,.opd').length,o&&o.querySelector('h2').innerText]}"),er);pg.screenshot(path=T+'f_pago.png');b.close()
    b,pg,w=pago.abre(pw,'pedidos','pago')
    print('59g antes de entregue:',pg.evaluate("()=>[!!document.querySelector('[data-cta=pedaval]'),(document.querySelector('[data-id=kitped1] em')||{}).innerText]"))
    pg.evaluate("()=>{const L=JSON.parse(localStorage.getItem('lf_ped'));L[0].entregue=true;localStorage.setItem('lf_ped',JSON.stringify(L));const t=[...document.querySelectorAll('#layer [data-cta=mcaba]')].find(b=>/Perfil/i.test(b.innerText));t.click()}");w(700)
    pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer [data-cta=mcaba]')].find(b=>/Pedidos/i.test(b.innerText));t.click()}");w(900)
    print('59g entregue:',pg.evaluate("()=>{const a=document.querySelector('[data-cta=pedaval]');return [a&&a.innerText,(document.querySelector('[data-id=kitped1] em')||{}).innerText,a&&Math.round(a.getBoundingClientRect().height)]}"),'olho:',sorted(comum.olho(pg))[:4]);pg.screenshot(path=T+'g_pedidos.png')
    pg.evaluate("()=>document.querySelector('[data-cta=pedaval]').click()");w(1800)
    print('59g toque em Avaliar:',pg.evaluate("()=>{const o=document.getElementById('pkok');return [!!o,o&&o.querySelectorAll('.opd').length,o&&o.querySelector('h2').innerText]}"));b.close()
    pago.MEUS={'ok':True,'guardados':1,'indicacoes':1,'nome':'María González','cupons':[{'cod':'LF-7K2M','tipo':'px','pct':10,'estado':'ok','fim':1805000000000,'usado':False,'nome':'María González','max':1},{'cod':'AMIGA-9H3LQ5','tipo':'am','pct':10,'estado':'ok','fim':1826000000000,'usado':False,'amigas':1}]}
    b,pg,w=pago.abre(pw,'cartoes');er=[];pg.on('pageerror',lambda e:er.append(str(e)));w(600)
    print('61i:',pg.evaluate("()=>{const b=document.getElementById('mtj');return [b.innerText.replace(/\\n+/g,' | ').slice(0,420),b.innerHTML.indexOf('LF-7K2M')>=0&&!/data-cupsim=\"LF-7K2M\"/.test(b.innerHTML),!!b.querySelector('[data-cupsim]')]}"),'olho:',sorted(comum.olho(pg))[:5],er)
    h=pg.evaluate("()=>Math.max(844,(document.querySelector('#layer .panel')||{scrollHeight:0}).scrollHeight+4)");pg.set_viewport_size({'width':390,'height':int(min(h,1500))});w(400);pg.screenshot(path=T+'i_cartoes.png');b.close()
    # checkout
    b,pg,w=comum2.site(pw);er=[];pg.on('pageerror',lambda e:er.append(str(e)))
    pg.evaluate("()=>document.querySelector('#grid .card .open, .card .open, .hc .open, [data-ref]').click()");w(1400)
    pg.evaluate("()=>{const x=[...document.querySelectorAll('#layer button')].find(e=>/Comprar/i.test(e.innerText||''));x&&x.click()}");w(1300)
    pg.evaluate("()=>{const x=[...document.querySelectorAll('button,a')].filter(e=>e.getBoundingClientRect().width>0).find(e=>/^Finalizar compra$/i.test((e.innerText||'').trim()));if(x)x.click();else document.querySelector('#bagbtn').click()}");w(1500)
    for k in ('prosseguir','irpag'):
        pg.evaluate("(k)=>{const x=document.querySelector('#layer [data-cta='+k+']');x&&x.click()}",k);w(1300)
    pg.evaluate("()=>{const x=document.querySelector('#layer [data-cta=pg][data-v=alias]');x&&x.click()}");w(1200)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;transition:none!important}')
    print('59d campos:',pg.evaluate("()=>[!!document.getElementById('ppd'),(document.getElementById('ppdl')||{}).textContent,[...document.querySelectorAll('.cfdoc button')].map(b=>b.textContent+(b.classList.contains('on')?'*':'')),(document.getElementById('ppd')||{}).placeholder,(document.getElementById('pprw')||{}).hidden]"))
    pg.locator('#ppz').click();pg.keyboard.type('983123456',delay=20);pg.locator('#ppd').click();pg.keyboard.type('4567890',delay=20);w(300)
    print('59d cédula digitada:',pg.evaluate("()=>[document.getElementById('ppz').value,document.getElementById('ppd').value]"));pg.evaluate("()=>document.getElementById('ppd').scrollIntoView({block:'center'})");w(300);pg.screenshot(path=T+'d_doc.png')
    pg.evaluate("()=>window.dispatchEvent(new PopStateEvent('popstate',{state:{lfc:1,d:1}}))");w(900)
    print('59e depois do voltar (redesenho):',pg.evaluate("()=>[(document.getElementById('ppz')||{}).value,(document.getElementById('ppd')||{}).value]"))
    pg.evaluate("()=>document.querySelector('.cfdoc [data-doct=ruc]').click()");w(300)
    print('59d RUC:',pg.evaluate("()=>[(document.getElementById('ppdl')||{}).textContent,document.getElementById('ppd').placeholder,document.getElementById('ppd').value]"))
    pg.evaluate("()=>document.querySelector('.cfdoc [data-doct=ced]').click()");w(300)
    print('59d volta p/ cédula:',pg.evaluate("()=>[document.getElementById('ppd').value]"),'olho:',sorted(comum.olho(pg))[:5],er);b.close()
