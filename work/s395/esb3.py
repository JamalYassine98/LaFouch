# S397 · esboços 59f (tela "Pedido pago" sem cartões) e 60d (Minha conta › Cartões com a regra nova e as metas da amiga). Site real (cópia do kit), celular. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import pago,comum;comum.OUT='/home/claude/lafouch/work/s395/'
from playwright.sync_api import sync_playwright
T='/tmp/s395/'
P_PAGO="()=>{const o=document.getElementById('pkok');o.querySelectorAll('.amwrap,.amc,.pxc,#pxcard').forEach(e=>e.remove())}"
P_CART="""()=>{const b=document.getElementById('mtj');const c=b.querySelector('.mtc');const px=c.querySelector('.pxc');const cod=px.querySelector('code');if(cod)cod.remove();
 const bola=on=>'<i style="display:inline-block;width:11px;height:11px;border-radius:50%;margin:0 5px 0 0;'+(on?'background:#8d3a69':'border:1px solid #cdb9c5')+'"></i>';
 b.innerHTML='<div class="mtc">'+c.firstElementChild.outerHTML+'<div class="mtl"><span>Estado: <b>Disponível</b> · vence 14/03/2027</span><button type="button" class="cfx" style="min-height:44px;padding:0 14px">Usar agora</button></div></div>'+
 '<p class="note" style="margin:10px 2px 18px">Você tem 1 presente guardado. Ele chega quando este cartão for usado ou vencer.</p>'+
 '<div class="mtc"><div class="amct" style="margin-top:0"><div><span style="font-weight:600;color:#1d1418">Presenteie uma amiga</span><b></b></div><div><span>Ela ganha 10% na primeira compra. Quando ela comprar, você também ganha um presente.</span><b></b></div>'+
 '<div><span>'+bola(1)+bola(0)+bola(0)+'</span><b></b></div><div><span>1 amiga já comprou. Faltam 2 para o seu próximo presente.</span><b></b></div><a class="amwa" href="#">Enviar pelo WhatsApp</a></div></div>'}"""
def cheia(pg,arq,sel,H=None):
    h=H or pg.evaluate("(s)=>{const o=document.querySelector(s);const l=document.querySelector('#layer .scrim')||o;return Math.max(844,(o.id==='pkok'?o.scrollHeight:(l.scrollHeight||0))+4)}",sel);pg.set_viewport_size({'width':390,'height':int(min(h,1500))});pg.wait_for_timeout(400);pg.screenshot(path=arq);return int(min(h,1500))
with sync_playwright() as pw:
    b,pg,w=pago.abre(pw,'pago');oh=comum.olho(pg);H=cheia(pg,T+'f_h.png','#pkok');b.close()
    b,pg,w=pago.abre(pw,'pago');pg.evaluate(P_PAGO);w(300);op=comum.olho(pg);cheia(pg,T+'f_p.png','#pkok',H);b.close();print('59f falhas novas:',sorted(op-oh)[:3])
    b,pg,w=pago.abre(pw,'cartoes');oh=comum.olho(pg);H=cheia(pg,T+'d_h2.png','#mtj');b.close()
    b,pg,w=pago.abre(pw,'cartoes');pg.evaluate(P_CART);w(300);op=comum.olho(pg);cheia(pg,T+'d_p2.png','#mtj',H);b.close();print('60d falhas novas:',sorted(op-oh)[:3])
comum.prancha('59f-site-pedido-pago.jpg','Esboço 59f · Site · Pedido pago',['Hoje: depois do comprovante aparecem o cartão de desconto e o cartão da amiga.','Proposta: a tela termina no comprovante com o token. Os presentes chegam por e-mail, no tempo certo.'],T+'f_h.png',T+'f_p.png')
comum.prancha('60d-site-minha-conta-cartoes.jpg','Esboço 60d · Site · Minha conta › Cartões',['Hoje: todos os cartões de uma vez, com os códigos à vista e três contadores.','Proposta: um cartão valendo por vez, sem código à vista; o que está guardado; e a indicação com metas (quantas amigas faltam para o próximo presente).'],T+'d_h2.png',T+'d_p2.png')
