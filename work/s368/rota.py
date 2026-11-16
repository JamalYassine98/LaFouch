# S368 · esboço 54: ROTA DA VENDA em 3 telas, no padrão de luxo (proposta de 16/11 01:15; "esboço" do dono às 01:18).
# Catálogo (barra do carrinho) → Carrinho → Pagamento. Um arquivo por tela, Hoje × Proposta, app real, celular, claro e escuro. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s368/'
from playwright.sync_api import sync_playwright
E=open('/home/claude/lafouch/work/s368/esb.py').read();CSS51=E.split('CSS="""')[1].split('"""')[0];MUDA51=E.split('MUDA="""')[1].split('"""')[0].replace('\\\\','\\')
PREP="()=>{const L=window.__LF,S=L.S;S.exp=[];S.colchUsd=0;S.items.forEach(i=>{if(i.tipo==='solar'&&!i.bulk)i.custo=1});L.render()}"
def poe(pw,esc):
    b,pg,w=ap.abre(pw,'vendas',esc);pg.evaluate(PREP);w(500)
    pg.evaluate("()=>{const c=[...document.querySelectorAll('#vRows .pcard[data-ref]')].find(e=>/^SP|^SL/.test(e.dataset.ref))||document.querySelector('#vRows .pcard[data-ref]');c.click()}");w(1100)
    pg.evaluate("()=>document.getElementById('sCartAdd').click()");w(900)
    return b,pg,w
# --- 54a: a barra do carrinho no Catálogo
CSSA="""#cartBar.lxB{display:flex!important;align-items:center;gap:14px;background:none!important;border:0!important;border-top:1px solid var(--line)!important;border-bottom:1px solid var(--line)!important;border-radius:0!important;box-shadow:none!important;padding:14px 2px!important}
#cartBar.lxB .t{flex:1;min-width:0}#cartBar.lxB .t b{display:block;font-weight:500;font-size:15px}#cartBar.lxB .t small{display:block;color:var(--mute);font-size:13px;margin-top:2px}
#cartBar.lxB .v{font-weight:600;font-size:15px;white-space:nowrap;font-variant-numeric:tabular-nums}
#cartBar.lxB .a{background:none;border:0;min-height:44px;min-width:44px;padding:0 2px;color:var(--accent-fg);font:500 14px inherit;text-decoration:underline;text-underline-offset:4px;white-space:nowrap}"""
MUDAA="""()=>{const B=document.getElementById('cartBar');const tx=e=>(e&&(e.innerText||e.textContent)||'').replace(/\\s+/g,' ').trim();const n=(tx(B.querySelector('b')).match(/(\\d+) peça/)||[0,'1'])[1];const tot=(tx(B).match(/G\\$ ?[0-9.]+/)||[''])[0];
 const im=B.querySelector('img,span[aria-hidden]');const f=im?im.outerHTML:'';B.classList.add('lxB');B.innerHTML=f+'<span class="t"><b>Carrinho</b><small>'+n+(n==='1'?' peça':' peças')+'</small></span><span class="v">'+tot+'</span><button type="button" class="a">abrir</button>';return [n,tot]}"""
# --- 54b: Carrinho = esboço 51 com o nome e o botão da rota
MUDAB="()=>{const r=("+MUDA51+")();const C=document.getElementById('cartCard');C.querySelector('.lxHd h2').textContent='Carrinho';C.querySelector('.go').textContent='Ir para o pagamento';return r}"
# --- 54c: Pagamento só com pagamento
CSSC=""".lxVolta{background:none;border:0;min-height:44px;padding:0 2px;color:var(--mute);font:500 14px inherit;text-decoration:underline;text-underline-offset:4px;text-decoration-color:var(--line)}
#pagHead.lxPh>div{justify-content:space-between!important}"""
MUDAC="""()=>{const h=document.getElementById('pagHead');h.classList.add('lxPh');const d=h.firstElementChild;const seta=d.querySelector('button');const h2=d.querySelector('h2');const v=document.createElement('button');v.type='button';v.className='lxVolta';v.textContent='‹ Carrinho';seta.remove();d.appendChild(v);
 const m=document.getElementById('pagMais');if(m)m.remove();const u=document.getElementById('unit');if(u)u.textContent=u.textContent.replace(/^Pedido/,'Carrinho').replace('peça(s)','peça');
 [...document.querySelectorAll('#vSaleCard *')].forEach(e=>{if(!e.children.length&&/^Adicionado ao pedido/.test((e.textContent||'').trim()))e.textContent=''});return !!h2}"""
TELAS=[('54a-app-rota-1-catalogo-barra-do-carrinho','App · Rota da venda · 1 de 3 · Catálogo com o carrinho aberto',['Hoje: cartão "Pedido: 1 peça(s)" com o botão "Pedidos" (o mesmo nome da aba dos pedidos do site).','Proposta: uma linha fina "Carrinho · N peças · total" com "abrir"; é por ela que se volta ao carrinho depois de escolher outra peça.'],None,CSSA,MUDAA),
       ('54b-app-rota-2-carrinho','App · Rota da venda · 2 de 3 · Carrinho',['Hoje: "Pedido", com botões de vários formatos e "Confirmar pedido".','Proposta: "Carrinho" no padrão de luxo; um só botão, "Ir para o pagamento". "+ Adicionar outra peça" volta ao Catálogo.'],"()=>document.querySelector('[data-act=cartopen]').click()",CSS51,MUDAB),
       ('54c-app-rota-3-pagamento','App · Rota da venda · 3 de 3 · Pagamento',['Hoje: seta redonda para voltar e, no fim, "+ Adicionar outra peça ao pedido".','Proposta: só o pagamento; a volta é "‹ Carrinho" e adicionar peça fica no Carrinho. Um só botão, "Finalizar venda".'],"()=>{document.querySelector('[data-act=cartopen]').click();window.__LF.ACT.cartconf()}",CSSC,MUDAC)]
with sync_playwright() as pw:
    for nome,tit,sub,vai,css,muda in TELAS:
        for esc,tema in ((True,'escuro'),(False,'claro')):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=poe(pw,esc)
                if vai: pg.evaluate(vai);w(1000)
                if prop: pg.add_style_tag(content=css);print('   ',str(pg.evaluate(muda))[:120]);w(500)
                if nome.startswith('54a'): pg.evaluate("()=>{const B=document.getElementById('cartBar');B.scrollIntoView({block:'center',behavior:'instant'})}");w(300)
                p=T+'rt_%s_%d_%d.png'%(nome[:3],esc,prop);pg.screenshot(path=p);fs.append(p);o=olho(pg);pg.evaluate('()=>scrollBy(0,450)');w(300);o|=olho(pg);oo.append(o);b.close()
            print(nome[:3],tema,'achados novos:',novos(oo[0],oo[1]))
            prancha('%s-%s.jpg'%(nome,tema),tit+' · tema '+tema,sub,*fs)
