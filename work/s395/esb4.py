# S398 · esboços 59c (refeito), 59f (refeito), 59g (novo), 60d→61i (refeito com cartão de luxo). Site real (cópia do kit), celular, tema claro. Nada implementado.
import sys,base64;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import pag,pago,comum;comum.OUT='/home/claude/lafouch/work/s398/'
from playwright.sync_api import sync_playwright
T='/tmp/s398/';u=lambda f:'data:image/png;base64,'+base64.b64encode(open(f,'rb').read()).decode();OURO=u(T+'logo_ouro.png')
P_PIX="""()=>{const o=document.getElementById('pkok');o.querySelectorAll('#pxcard,.pxc').forEach(e=>e.remove());const z=o.querySelector('.zs');if(z)z.innerHTML='<span class="spn"></span><span>A confirmação está demorando mais que o normal. Se você já pagou, envie o comprovante.</span>';const j=o.querySelector('#pgcl');if(j){j.hidden=false;const s=j.querySelector('span');if(s)s.textContent='Enviar comprovante'}}"""
P_PAGO="()=>{const o=document.getElementById('pkok');o.querySelectorAll('.amwrap,.amc,.pxc,#pxcard,.opd').forEach(e=>e.remove())}"
P_PED="""()=>{const b=document.querySelector('#layer [data-id=kitped1]');if(!b)return 0;const em=b.querySelector('em');if(em)em.textContent='Entregue';const a=document.createElement('button');a.type='button';a.className='cfx';a.style.cssText='display:block;min-height:44px;margin:2px 0 10px;padding:0 2px;text-align:left';a.textContent='Avaliar a compra ›';b.parentNode.insertBefore(a,b.nextSibling);return 1}"""
P_CART="""(L)=>{const b=document.getElementById('mtj');const bola=on=>'<i style="display:inline-block;width:11px;height:11px;border-radius:50%;margin:0 5px 0 0;'+(on?'background:#8d3a69':'border:1px solid #cdb9c5')+'"></i>';
 const card='<div style="border-radius:20px;background:#3a1830;background-image:linear-gradient(135deg,#55234a 0%,#33152b 55%,#1f0d1a 100%);padding:7px"><div style="border:1px solid rgba(214,178,116,.6);border-radius:14px;padding:20px 20px 18px">'+
  '<div style="display:flex;justify-content:space-between;align-items:center"><img src="'+L+'" width="92" alt="La Fouch"><span style="font:500 12.5px Inter,Arial;letter-spacing:.14em;color:#d9c3d0">CARTÃO PRESENTE</span></div>'+
  '<div style="font:500 58px/1 Fraunces,Georgia,serif;color:#e9d3a6;margin:30px 0 4px">10%</div><div style="font:italic 19px/1.3 Fraunces,Georgia,serif;color:#fff">na próxima compra</div>'+
  '<div style="height:1px;background:rgba(214,178,116,.4);margin:24px 0 12px"></div><div style="display:flex;justify-content:space-between;font:500 12.5px Inter,Arial;letter-spacing:.08em;color:#d9c3d0"><span>MARÍA GONZÁLEZ</span><span>VALE ATÉ 14/03/2027</span></div></div></div>';
 b.innerHTML='<div class="mtc">'+card+'<div class="mtl"><span>Estado: <b>Disponível</b></span><button type="button" class="cfx" style="min-height:44px;padding:0 14px">Usar agora</button></div></div>'+
 '<p class="note" style="margin:10px 2px 18px">Você tem 1 presente guardado. Ele chega quando este cartão for usado ou vencer.</p>'+
 '<div class="mtc"><div class="amct" style="margin-top:0"><div><span style="font-weight:600;color:#1d1418">Presenteie uma amiga</span><b></b></div><div><span>Ela ganha 10% na primeira compra. Quando ela comprar, você também ganha um presente.</span><b></b></div>'+
 '<div><span>'+bola(1)+bola(0)+bola(0)+'</span><b></b></div><div><span>1 amiga já comprou. Faltam 2 para o seu próximo presente.</span><b></b></div><a class="amwa" href="#">Enviar pelo WhatsApp</a></div></div>'}"""
def cheia(pg,arq,sel,H=None):
    h=H or pg.evaluate("(s)=>{const o=document.querySelector(s);const l=document.querySelector('#layer .scrim')||o;return Math.max(844,(o&&o.id==='pkok'?o.scrollHeight:(l?l.scrollHeight:0))+4)}",sel);pg.set_viewport_size({'width':390,'height':int(min(h,1500))});pg.wait_for_timeout(400);pg.screenshot(path=arq);return int(min(h,1500))
with sync_playwright() as pw:
    b,pg,w=pag.abre(pw,'pix',3);oh=comum.olho(pg);H=cheia(pg,T+'c_h.png','#pkok');b.close()
    b,pg,w=pag.abre(pw,'pix',3);pg.evaluate(P_PIX);w(300);op=comum.olho(pg);cheia(pg,T+'c_p.png','#pkok',H);b.close();print('59c novas:',sorted(op-oh)[:3])
    b,pg,w=pago.abre(pw,'pago');oh=comum.olho(pg);H=cheia(pg,T+'f_h.png','#pkok');b.close()
    b,pg,w=pago.abre(pw,'pago');pg.evaluate(P_PAGO);w(300);op=comum.olho(pg);cheia(pg,T+'f_p.png','#pkok',H);b.close();print('59f novas:',sorted(op-oh)[:3])
    b,pg,w=pago.abre(pw,'pedidos','pago');oh=comum.olho(pg);H=cheia(pg,T+'g_h.png','#mtj',844);b.close()
    b,pg,w=pago.abre(pw,'pedidos','pago');print('pedido achado:',pg.evaluate(P_PED));w(300);op=comum.olho(pg);cheia(pg,T+'g_p.png','#mtj',844);b.close();print('59g novas:',sorted(op-oh)[:3])
    b,pg,w=pago.abre(pw,'cartoes');oh=comum.olho(pg);H=cheia(pg,T+'i_h.png','#mtj');b.close()
    b,pg,w=pago.abre(pw,'cartoes');pg.evaluate(P_CART,OURO);w(300);op=comum.olho(pg);cheia(pg,T+'i_p.png','#mtj',H);b.close();print('61i novas:',sorted(op-oh)[:3])
comum.prancha('59c-site-pagar-pix.jpg','Esboço 59c · Site · PIX · depois de 2 minutos',['Hoje: "Confirmamos sozinhos…" não muda; a linha "Já paguei, enviar comprovante" e o cartão de desconto ficam embaixo.','Proposta: igual à transferência — o aviso muda para "está demorando… se você já pagou, envie o comprovante" e aparece "Enviar comprovante". Sem cartão.'],T+'c_h.png',T+'c_p.png')
comum.prancha('59f-site-pedido-pago.jpg','Esboço 59f · Site · Pedido pago',['Hoje: a tela abre pedindo a opinião, antes de o cliente receber a compra (e, quando existe, mostra o cartão da amiga).','Proposta: só "Pedido pago" e o comprovante com o token. A opinião vai para Minha conta, depois da entrega (esboço 59g).'],T+'f_h.png',T+'f_p.png')
comum.prancha('59g-site-minha-conta-avaliar.jpg','Esboço 59g · Site · Minha conta › Pedidos · avaliar depois de receber',['Hoje: a opinião é pedida na tela de pagamento confirmado.','Proposta: quando você marca o pedido como entregue, aparece "Avaliar a compra ›" no pedido, em Minha conta.'],T+'g_h.png',T+'g_p.png')
comum.prancha('61i-site-minha-conta-cartoes.jpg','Esboço 61i · Site · Minha conta › Cartões',['Hoje: todos os cartões de uma vez, com os códigos à vista e três contadores.','Proposta: o mesmo cartão de luxo do e-mail, um por vez; o presente guardado; e a indicação com metas.'],T+'i_h.png',T+'i_p.png')
