# S401 · esboços 64a/64b (17/11/2026): o presente da 5ª indicação no carrinho — "o segundo óculos é presente". Site real (cópia do kit), celular, tema claro; só injeta o que muda. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import comum2,comum;comum.OUT='/home/claude/lafouch/work/s401/'
from playwright.sync_api import sync_playwright
T='/tmp/s401/'
CSS=""".gft{margin:14px 0 0;padding:16px 16px 14px;border-radius:18px;background:#17121a;background-image:linear-gradient(135deg,#2b2330 0%,#17121a 55%,#0c090e 100%);color:#fff}
.gft small{display:block;font:500 12.5px Inter,system-ui,sans-serif;letter-spacing:.14em;color:#e9d3a6}.gft b{display:block;font:500 21px/1.25 Fraunces,Georgia,serif;margin:6px 0 4px}.gft p{font:14px/1.5 Inter,system-ui,sans-serif;color:#d9cfd6;margin:0 0 12px}
.gfl{display:flex;gap:10px}.gfl button{flex:1;min-width:0;padding:8px 8px 10px;border-radius:14px;border:1px solid rgba(214,178,116,.55);background:#fff;color:#1d1418;font:600 13px Inter,system-ui,sans-serif;text-align:center;min-height:44px}
.gfl img{display:block;width:100%;aspect-ratio:1;object-fit:contain;margin:0 0 6px}.gfl span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.gfl i{display:block;font:500 12.5px Inter,system-ui,sans-serif;font-style:normal;color:#8d3a69;margin-top:2px}
.gfk{display:inline-block;margin-top:4px;padding:3px 9px;border-radius:999px;background:#17121a;color:#e9d3a6;font:600 12.5px Inter,system-ui,sans-serif;letter-spacing:.06em}"""
P1="""()=>{const cl=document.querySelector('#layer .cl');const im=[...document.querySelectorAll('#grid .card')].filter(c=>c.querySelector('img')).slice(1,4).map(c=>({s:c.querySelector('img').currentSrc||c.querySelector('img').src,n:(c.querySelector('.info b,.info .nm,b')||{}).textContent||'Óculos'}));
 const d=document.createElement('div');d.className='gft';d.innerHTML='<small>✦ PRESENTE ESPECIAL</small><b>Escolha o seu segundo óculos</b><p>É presente da La Fouch pelas suas 5 indicações. Estas são as peças que você pode levar com esta compra.</p><div class="gfl">'+im.map(x=>'<button type="button"><img src="'+x.s+'" alt=""><span>'+x.n+'</span><i>Escolher</i></button>').join('')+'</div>';cl.appendChild(d);return im.length}"""
P2="""()=>{const cl=document.querySelector('#layer .cl'),g=cl.querySelector('.gft'),c0=cl.querySelector('.ci'),bt=g.querySelector('.gfl button');const c=c0.cloneNode(true);
 c.querySelector('img').src=bt.querySelector('img').src;c.querySelector('.cit b').textContent=bt.querySelector('span').textContent;c.querySelector('.cit small').textContent='PRESENTE';c.querySelector('.pu').innerHTML='<span class="gfk">✦ Presente especial</span>';
 c.querySelector('.cis .pr').textContent='R$ 0';const q=c.querySelector('.qty');if(q)q.style.visibility='hidden';const rl=c.querySelector('.crl');if(rl)rl.textContent='Trocar presente';g.remove();cl.appendChild(c);
 const cn=document.querySelector('#layer .cn');if(cn)cn.textContent='· 2 itens';const rs=document.querySelectorAll('#layer .cs .cs-r');rs[0].querySelector('span').textContent='Subtotal · 2 itens';
 const r=document.createElement('div');r.className='cs-r cs-h';r.innerHTML='<span>Presente especial · 2º óculos</span><span>Grátis</span>';rs[0].parentNode.insertBefore(r,rs[1]);const cf=document.querySelector('#layer .cupf');if(cf)cf.remove()}"""
def carrinho(pw):
    b,pg,w=comum2.site(pw)
    pg.evaluate("()=>document.querySelector('#grid .card .open, .card .open, .hc .open, [data-ref]').click()");w(1400)
    pg.evaluate("()=>{const x=[...document.querySelectorAll('#layer button')].find(e=>/Comprar/i.test(e.innerText||''));x&&x.click()}");w(1300)
    pg.evaluate("()=>{const x=[...document.querySelectorAll('button,a')].filter(e=>e.getBoundingClientRect().width>0).find(e=>/^Finalizar compra$/i.test((e.innerText||'').trim()));if(x)x.click();else document.querySelector('#bagbtn').click()}");w(1500)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;transition:none!important}'+CSS);return b,pg,w
def foto(pg,arq,H=None):
    h=H or pg.evaluate("()=>Math.max(844,(document.querySelector('#layer .panel')||{scrollHeight:0}).scrollHeight+4)");pg.set_viewport_size({'width':390,'height':int(min(h,1600))});pg.wait_for_timeout(500);pg.screenshot(path=arq);return int(min(h,1600))
with sync_playwright() as pw:
    VER="()=>{const g=document.querySelector('#layer .gft')||[...document.querySelectorAll('#layer .ci')].pop();g.scrollIntoView({block:'center'})}"
    b,pg,w=carrinho(pw);print('peças:',pg.evaluate(P1));w(600);pg.set_viewport_size({'width':390,'height':1000});w(300);pg.evaluate(VER);w(300);H=foto(pg,T+'g1_p.png',1000);op=comum.olho(pg);b.close()
    b,pg,w=carrinho(pw);oh=comum.olho(pg);foto(pg,T+'g1_h.png',H);b.close();print('64a falhas novas:',sorted(op-oh)[:5])
    b,pg,w=carrinho(pw);pg.evaluate(P1);w(300);pg.evaluate(P2);w(500);pg.set_viewport_size({'width':390,'height':1000});w(300);pg.evaluate(VER);w(300);H2=foto(pg,T+'g2_p.png',1000);op=comum.olho(pg);b.close()
    b,pg,w=carrinho(pw);pg.evaluate(P1);w(500);pg.set_viewport_size({'width':390,'height':1000});w(300);pg.evaluate(VER);w(300);foto(pg,T+'g2_h.png',H2);b.close();print('64b falhas novas:',sorted(op-oh)[:5])
comum.prancha('64a-site-carrinho-escolher-presente.jpg','Esboço 64a · Site · Carrinho · escolher o segundo óculos',['Hoje: o carrinho de sempre.','Proposta: quem tem o presente da 5ª indicação vê este bloco. Só aparecem as peças que o valor pago cobre (piso das duas), então nunca dá prejuízo.'],T+'g1_h.png',T+'g1_p.png')
comum.ROT=('ANTES DE ESCOLHER','DEPOIS DE ESCOLHER')
import inspect;exec(inspect.getsource(comum.prancha).replace("def prancha(","def prancha2(").replace("('HOJE','PROPOSTA')","ROT"),comum.__dict__)
comum.prancha2('64b-site-carrinho-presente-escolhido.jpg','Esboço 64b · Site · Carrinho · presente escolhido',['O toque numa peça põe o presente no carrinho por R$ 0; o total não muda.','Dá para trocar o presente. Com o presente no carrinho, o campo de código some (não soma com cupom).'],T+'g2_h.png',T+'g2_p.png')
