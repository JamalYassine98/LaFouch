# S401 · esboços 65a–65f (17/11/2026, pedido do dono 08:13): aba "Exclusivo" dos cupons e a navegação nos dois sentidos; sai o "Tem um código?".
# Site real (cópia do kit), celular, tema claro (e temática Natal no 65c); só injeta o que muda. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import comum2,comum;comum.OUT='/home/claude/lafouch/work/s401/'
from playwright.sync_api import sync_playwright
T='/tmp/s401/'
import base64;U=lambda f:'data:image/png;base64,'+base64.b64encode(open(f,'rb').read()).decode()
CSS=""".dex{display:block!important;margin:10px 0 6px;padding:5px!important;border-radius:16px;background:#3a1830;background-image:linear-gradient(135deg,#55234a 0%,#33152b 55%,#1f0d1a 100%);color:#fff!important}
.dex>span{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid rgba(214,178,116,.6);border-radius:11px}
.dex i{font-style:normal;color:#e9d3a6;font:500 26px/1 Fraunces,Georgia,serif}.dex b{display:block;font:500 19px Fraunces,Georgia,serif;color:#fff}.dex small{display:block;font:italic 14px Fraunces,Georgia,serif;color:#d9c3d0;margin-top:2px}.dex u{margin-left:auto;text-decoration:none;color:#e9d3a6;font-size:20px}
.exh{margin:0 0 18px;padding:6px;border-radius:18px;background:#3a1830;background-image:linear-gradient(135deg,#55234a 0%,#33152b 55%,#1f0d1a 100%);color:#fff}
.exh>div{border:1px solid rgba(214,178,116,.6);border-radius:13px;padding:18px 18px 16px}
.exh small{display:block;font:500 12.5px Inter,system-ui,sans-serif;letter-spacing:.16em;color:#d9c3d0;text-align:right;margin-top:-16px}.exh img{display:block;width:92px}
.exh strong{display:block;font:500 46px/1 Fraunces,Georgia,serif;color:#e9d3a6;margin:20px 0 2px}.exh em{display:block;font:italic 17px/1.3 Fraunces,Georgia,serif;color:#fff}
.exh hr{border:0;height:1px;background:rgba(214,178,116,.4);margin:14px 0 9px}.exh p{display:flex;justify-content:space-between;font:500 12.5px Inter,system-ui,sans-serif;letter-spacing:.04em;color:#d9c3d0;margin:0}
.exh.nat{background:#1f5c3a;background-image:linear-gradient(135deg,#2a7049 0%,#1f5c3a 55%,#143d27 100%)}.exh.nat>div{border-color:rgba(255,217,160,.6)}.exh.nat strong{color:#ffd9a0}.exh.nat small,.exh.nat p{color:#d3e3d8}.exh.nat hr{background:rgba(255,217,160,.45)}
.exo{font:13.5px/1.5 Inter,system-ui,sans-serif;color:#6b5f66;margin:-8px 4px 16px}
.card .pr s{font-weight:400;color:#8a7d84;margin-right:6px;font-size:.82em}
.exb{padding:4px 12px;background:#3a1830;background-image:linear-gradient(135deg,#55234a 0%,#33152b 55%,#1f0d1a 100%)}.exb>div{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:44px;padding:0 12px;border:1px solid rgba(214,178,116,.55);border-radius:10px}
.exb span{font:italic 16px Fraunces,Georgia,serif;color:#fff}.exb span i{font:500 17px Fraunces,Georgia,serif;font-style:normal;color:#e9d3a6;margin-right:8px}.exb b{font:500 12.5px Inter,system-ui,sans-serif;letter-spacing:.12em;color:#e9d3a6;white-space:nowrap}
.exc{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:-3px 0;padding:0;min-height:44px}.exc span{font:600 15px Inter,system-ui,sans-serif;color:#8d3a69}.exc span i{font-style:normal;color:#a9854a;margin-right:6px}
.exc button{min-height:44px;padding:0 4px 0 16px;border:0;background:none;color:#8d3a69;font:600 15px Inter,system-ui,sans-serif;text-decoration:underline}
.exn{font:13.5px/1.5 Inter,system-ui,sans-serif;color:#6b5f66;margin:12px 6px 0}.exn a{color:#8d3a69;font-weight:600;text-decoration:underline}"""
MENU="""()=>{const a=document.querySelector('.dnv .dacc');const x=document.createElement('a');x.href='#';x.className='dex';x.innerHTML='<span><i>10%</i><span style="display:block;border:0;padding:0"><b>Exclusivo</b><small>peças para o seu cartão</small></span><u>›</u></span>';a.parentNode.insertBefore(x,a.nextSibling)}"""
ABA="""(nat)=>{const LGO=window.__lgo,LGN=window.__lgn;const s=document.getElementById('vitrine'),g=document.getElementById('grid');[...s.children].forEach(e=>{if(e!==g&&!e.contains(g))e.style.display='none'});
 const h=document.createElement('div');h.className='exh'+(nat?' nat':'');const lg=nat?LGN:LGO;
 h.innerHTML='<div><img src="'+lg+'" alt="La Fouch"><small>'+(nat?'NATAL EXCLUSIVO':'EXCLUSIVO')+'</small><strong>10%</strong><em>'+(nat?'de desconto · Natal':'nas peças desta página')+'</em><hr><p><span>'+(nat?'PARA TODOS':'MARÍA GONZÁLEZ')+'</span><span>'+(nat?'ATÉ 25/12/2026':'ATÉ 14/03/2027')+'</span></p></div>';g.parentNode.insertBefore(h,g);
 const o=document.createElement('p');o.className='exo';o.textContent='Os preços abaixo já estão com o desconto.';g.parentNode.insertBefore(o,g);
 [...g.querySelectorAll('.card')].forEach(c=>{const p=c.querySelector('.pr');if(!p)return;if(c.querySelector('.sel1.of,.of')||/OFERTA/i.test(c.textContent)){c.style.display='none';return}const m=/([\\d.]+)/.exec(p.textContent);if(!m)return;const v=+m[1].replace(/\\./g,'');p.innerHTML='<s>'+p.textContent.trim()+'</s>'+p.textContent.trim().replace(m[1],String(Math.round(v*.9)))});
 h.scrollIntoView({block:'start'});window.scrollBy(0,-120);return [g.getBoundingClientRect().width,g.querySelectorAll('.card').length]}"""
FAIXA="""()=>{const t=document.querySelector('.top');const d=document.createElement('div');d.className='exb';d.innerHTML='<div><span><i>10%</i>seu cartão está ativo</span><b>VER EXCLUSIVO ›</b></div>';t.appendChild(d)}"""
CAR1="""()=>{const c=document.querySelector('#layer .cupf');const d=document.createElement('div');d.className='exc';d.innerHTML='<span><i>✦</i>Você tem um cartão de 10%</span><button type="button">Usar</button>';c.parentNode.insertBefore(d,c);c.remove()}"""
CAR2="""()=>{const d=document.querySelector('#layer .exc');d.innerHTML='<span><i>✦</i>Cartão de 10% aplicado</span><span style="font-weight:600;color:#1f8f4e">− R$ 10</span>';const n=document.createElement('p');n.className='exn';n.innerHTML='A peça SL2250 está em OFERTA e não entra no cartão. <a href="#">Ver peças do Exclusivo ›</a>';document.querySelector('#layer .cl').appendChild(n);const t=document.querySelector('#layer .cs-t b');if(t)t.textContent='R$ 90'}"""
def site(pw,ev=''):
    b,pg,w=comum2.site(pw,extra=("document.documentElement.setAttribute('data-ev','natal')" if ev else ''))
    if ev: pg.evaluate("()=>document.documentElement.setAttribute('data-ev','natal')");w(400)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;transition:none!important}'+CSS);pg.evaluate('(a)=>{window.__lgo=a[0];window.__lgn=a[1]}',[U('/home/claude/catalogo/media/email/cartao-ouro.png'),U('/home/claude/catalogo/media/email/cartao-ev-natal.png')]);return b,pg,w
def carrinho(pw):
    b,pg,w=site(pw)
    pg.evaluate("()=>document.querySelector('#grid .card .open, .card .open, .hc .open, [data-ref]').click()");w(1400)
    pg.evaluate("()=>{const x=[...document.querySelectorAll('#layer button')].find(e=>/Comprar/i.test(e.innerText||''));x&&x.click()}");w(1300)
    pg.evaluate("()=>{const x=[...document.querySelectorAll('button,a')].filter(e=>e.getBoundingClientRect().width>0).find(e=>/^Finalizar compra$/i.test((e.innerText||'').trim()));if(x)x.click();else document.querySelector('#bagbtn').click()}");w(1500)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;transition:none!important}'+CSS);return b,pg,w
VIT="()=>{const x=[...document.querySelectorAll('a,button')].find(e=>/Ver cat[aá]logo|Ver todos/i.test(e.innerText||'')&&e.getBoundingClientRect().width>0);x&&x.click();setTimeout(()=>{const g=document.getElementById('grid');g.scrollIntoView({block:'start'});window.scrollBy(0,-170)},900)}"
def par(nome,abre,antes,depois,H=844):
    b,pg,w=abre();
    if antes: pg.evaluate(antes);w(1600)
    pg.set_viewport_size({'width':390,'height':H});w(400);oh=comum.olho(pg);pg.screenshot(path=T+nome+'_h.png');b.close()
    b,pg,w=abre()
    if antes: pg.evaluate(antes);w(1600)
    for d in depois:
        if isinstance(d,tuple): pg.evaluate(d[0],d[1])
        else: pg.evaluate(d)
        w(500)
    pg.set_viewport_size({'width':390,'height':H});w(400);op=comum.olho(pg);pg.screenshot(path=T+nome+'_p.png');b.close();print(nome,'falhas novas:',sorted(op-oh)[:4],[x for x in oh if 'barras' in x])
ABRE_MENU="()=>{const m=document.querySelector('.top .ib');m&&m.click()}"
with sync_playwright() as pw:
    par('a',lambda:site(pw),ABRE_MENU,[MENU])
    par('b',lambda:site(pw),VIT,[(ABA,0)],1100)
    par('c',lambda:site(pw,'natal'),VIT,[(ABA,1)],1100)
    par('d',lambda:site(pw),None,[FAIXA])
    par('e',lambda:carrinho(pw),None,[CAR1])
    par('f',lambda:carrinho(pw),CAR1,[CAR2])
P=comum.prancha
P('65a-site-menu-exclusivo.jpg','Esboço 65a · Site · Menu · entrada "Exclusivo"',['Hoje: o menu não tem nada sobre os cartões.','Proposta (refeita): a entrada tem a MESMA cara do cartão que o cliente recebeu — vinho, fio dourado, o número em dourado. Quem não tem cupom não vê nada.'],T+'a_h.png',T+'a_p.png')
P('65b-site-aba-exclusivo.jpg','Esboço 65b · Site · Aba Exclusivo (sem evento)',['Hoje: "Usar agora" leva ao catálogo inteiro; o cliente só descobre no carrinho onde o cartão vale.','Proposta (refeita): o topo da aba É o cartão do cliente (mesmo vinho, fio dourado, logo, nome e validade); embaixo, só as peças em que ele vale, já com o desconto.'],T+'b_h.png',T+'b_p.png')
P('65c-site-aba-exclusivo-natal.jpg','Esboço 65c · Site · Aba Exclusivo em evento (Natal)',['Hoje: no evento, o catálogo com a temática; o cupom é digitado no carrinho.','Proposta (aprovada 17/11, agora no mesmo desenho do cartão): o topo é o cartão do evento, nas cores da temática. O código é interno e não aparece.'],T+'c_h.png',T+'c_p.png')
P('65d-site-faixa-cartao-ativo.jpg','Esboço 65d · Site · Faixa "cartão ativo"',['Hoje: depois de "Usar agora" nada na tela lembra que o cartão está ativo.','Proposta (refeita): faixa com o mesmo vinho e fio dourado do cartão, número em dourado e letra serifada; o toque leva à aba Exclusivo.'],T+'d_h.png',T+'d_p.png')
P('65e-site-carrinho-usar-cartao.jpg','Esboço 65e · Site · Carrinho · "Você tem um cartão"',['Hoje: "Tem um código?" — o cliente precisa abrir e digitar o código.','Proposta: sai o campo de código; quem tem cartão vê "Você tem um cartão de 10%" e aplica com um toque, sem sair do carrinho.'],T+'e_h.png',T+'e_p.png')
import inspect;comum.ROT=('ANTES DO TOQUE','DEPOIS DO TOQUE');exec(inspect.getsource(comum.prancha).replace("def prancha(","def prancha2(").replace("('HOJE','PROPOSTA')","ROT"),comum.__dict__)
comum.prancha2('65f-site-carrinho-cartao-aplicado.jpg','Esboço 65f · Site · Carrinho · cartão aplicado',['O toque em "Usar" aplica o cartão e o total já mostra o desconto.','Se uma peça não aceita o cartão (OFERTA, Leve 2), o carrinho diz qual é e oferece a aba Exclusivo.'],T+'f_h.png',T+'f_p.png')
