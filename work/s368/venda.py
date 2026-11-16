# S368 · esboço 53: VENDA numa tela só, no padrão de luxo (proposta de 16/11 01:02; o dono pediu o esboço às 01:09).
# Hoje são duas telas (Pedido e Pagamento); a proposta junta as duas: peças em cima, pagamento embaixo. App real, celular, claro e escuro.
# As peças, a sugestão, o total e o formulário de pagamento são os da própria tela. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s368/'
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
E=open('/home/claude/lafouch/work/s368/esb.py').read();CSS51=E.split('CSS="""')[1].split('"""')[0].replace('#cartCard.lx','.lxV')
CSS=CSS51+""".lxV{display:flex;flex-direction:column}.lxTopo{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--line)}
.lxTopo h2{margin:0;font-size:22px}.lxTopo .lxLk{color:var(--mute)}#vSaleCard.lxUm #pagHead{display:none!important}#vSaleCard.lxUm #pagMais{display:none!important}
#vSaleCard.lxUm #sumB.pagLux>.sum{border-bottom:0!important;padding:22px 0 8px!important}.lxSec{font:600 12px/1 inherit;letter-spacing:.08em;color:var(--mute);margin:18px 0 0;padding-top:18px;border-top:1px solid var(--line)}"""
PEGA="""()=>{const C=document.getElementById('cartCard');const tx=e=>(e&&(e.innerText||e.textContent)||'').replace(/\\s+/g,' ').trim();
 const its=[...C.querySelectorAll('.split > .sl')].map(sl=>{const foto=sl.firstElementChild.outerHTML;const sp=sl.querySelector('span[style*="flex:1"]');const small=sp.querySelector('small');const preco=tx(small).split(' · ')[0];const nm=tx(sp).replace(tx(small),'').trim();const q=(nm.match(/^(\\d+)×/)||[0,'1'])[1];return {foto,nm:nm.replace(/^\\d+× /,''),preco,q}});
 const sg=C.querySelector('.cSug');let s=null;if(sg){s={b:tx(sg.querySelector('b')),sm:[...sg.querySelectorAll('small')].map(tx).filter(t=>!/^Sugestão/.test(t))[0]||''}}return {its,s}}"""
POE="""d=>{const V=document.getElementById('vSaleCard');V.classList.add('lxUm');const n=d.its.reduce((a,x)=>a+(+x.q),0);
 const h='<div class="lxV"><div class="lxTopo"><h2>Venda</h2><button type="button" class="lxLk">‹ Catálogo</button></div>'+d.its.map(x=>'<div class="lxIt">'+x.foto+'<div class="lxNm"><b>'+x.nm+'</b><i>'+x.preco+'</i></div><div class="lxAc"><span class="lxQt" role="group" aria-label="Quantidade"><button type="button" aria-label="Menos uma peça">−</button><em>'+x.q+'</em><button type="button" aria-label="Mais uma peça">+</button></span><button type="button" class="lxLk">Tirar</button></div></div>').join('')+
  (d.s?'<div class="lxSg"><div class="lbl">Sugestão para oferecer ao cliente</div><b>'+d.s.b+'</b><small>'+d.s.sm+'</small><div class="lxAc"><button type="button" class="lxLk f">Cliente aceitou</button><button type="button" class="lxLk">Dispensar</button></div></div>':'')+
  '<button type="button" class="lxMais">+ Adicionar outra peça</button></div>';
 const sb=document.getElementById('sumB');sb.insertAdjacentHTML('beforebegin',h);const u=document.getElementById('unit');if(u)u.textContent='Total · '+n+(n===1?' peça':' peças');
 const pb=document.getElementById('payB');pb.insertAdjacentHTML('beforebegin','<div class="lxSec">PAGAMENTO</div>');const l=pb.querySelector('.lbl');if(l&&/^pagamento$/i.test(l.textContent.trim()))l.textContent='Forma';[...V.querySelectorAll('*')].forEach(e=>{if(!e.children.length&&/^Adicionado ao pedido/.test((e.textContent||'').trim()))e.textContent=''});scrollTo(0,0);return n}"""
PREP="()=>{const L=window.__LF,S=L.S;S.exp=[];S.colchUsd=0;S.items.forEach(i=>{if(i.tipo==='solar'&&!i.bulk)i.custo=1});L.render()}"
def abre(pw,esc):
    b,pg,w=ap.abre(pw,'vendas',esc);pg.evaluate(PREP);w(500);pg.add_style_tag(content='#mainnav,.mainnav,nav.mn{display:none!important}')
    pg.evaluate("()=>{const c=[...document.querySelectorAll('#vRows .pcard[data-ref]')].find(e=>/^SP|^SL/.test(e.dataset.ref))||document.querySelector('#vRows .pcard[data-ref]');c.click()}");w(1100)
    pg.evaluate("()=>document.getElementById('sCartAdd').click()");w(700);pg.evaluate("()=>document.querySelector('[data-act=cartopen]').click()");w(900)
    return b,pg,w
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        b,pg,w=abre(pw,esc);p1=T+'vd1_%d.png'%esc;pg.screenshot(path=p1,full_page=True);o0=olho(pg);dados=pg.evaluate(PEGA)
        pg.evaluate("()=>window.__LF.ACT.cartconf()");w(900);p2=T+'vd2_%d.png'%esc;pg.screenshot(path=p2,full_page=True);o0|=olho(pg);pg.evaluate('()=>scrollBy(0,500)');w(300);o0|=olho(pg);b.close()
        b,pg,w=abre(pw,esc);pg.evaluate("()=>window.__LF.ACT.cartconf()");w(900);pg.add_style_tag(content=CSS);print('   peças:',pg.evaluate(POE,dados));w(600)
        p3=T+'vd3_%d.png'%esc;pg.screenshot(path=p3,full_page=True);o1=olho(pg)
        for y in (500,1000): pg.evaluate('y=>scrollTo(0,y)',y);w(300);o1|=olho(pg)
        print('   alturas:',[Image.open(x).size[1]//2 for x in (p1,p2,p3)]);b.close()
        print('venda',tema,'achados novos:',novos(o0,o1))
        ims=[Image.open(x).convert('RGB') for x in (p1,p2,p3)];g=40;W=ims[0].size[0];H=max(i.size[1] for i in ims);S=Image.new('RGB',(g+3*(W+g),330+H+g),'#f1eef0');d=ImageDraw.Draw(S)
        d.text((g,34),'App · Venda numa tela só · tema '+tema,font=F(44,True),fill='#1d1418')
        d.text((g,104),'Hoje: duas telas, "Pedido" e "Pagamento", com idas e voltas entre elas.',font=F(27),fill='#55484f')
        d.text((g,142),'Proposta: uma tela, "Venda" — as peças em cima, o pagamento embaixo e um só botão principal. Sair leva ao Catálogo com a venda guardada.',font=F(27),fill='#55484f')
        d.text((g,180),'(As telas aparecem inteiras, de cima a baixo; a barra de baixo do app foi escondida só para a foto.)',font=F(27),fill='#55484f')
        for i,(im,r) in enumerate(zip(ims,('HOJE · 1ª TELA (PEDIDO)','HOJE · 2ª TELA (PAGAMENTO)','PROPOSTA · VENDA'))):
            x=g+i*(W+g);d.text((x,262),r,font=F(34,True),fill='#8d3a69' if i==2 else '#1d1418');S.paste(im,(x,316));d.rectangle([x-1,315,x+W,316+im.size[1]],outline='#cfc6cb')
        S.save(comum.OUT+'53-app-venda-tela-unica-luxo-%s.jpg'%tema,quality=86);print('  53 …',tema,S.size)
