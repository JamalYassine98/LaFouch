# S408 · esboço 79 (17/11 13:45, regra aprovada): Favoritos com o preço normal + linha discreta "✦ R$ … com o seu cartão" só onde o cartão vale. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import comum,comum2;comum.OUT='/home/claude/lafouch/work/s408/'
from playwright.sync_api import sync_playwright
T='/tmp/s408/'
FAV="localStorage.setItem('lf_fav',JSON.stringify({KIT3C:1,SL2210:1,SL2255:1,SL2260:1}))"
CSS=".fvc{display:block;margin-top:3px;font:600 13px Inter,system-ui,sans-serif;color:#8a6a33}"
ABRE="""()=>{document.querySelector('#bagbtn').click()}"""
TAB="""()=>{const t=document.querySelector('[data-ctab=fav]');t&&t.click()}"""
LIN="""()=>{const V={KIT3C:'R$ 90',SL2210:'R$ 86'};[...document.querySelectorAll('#layer .fvi')].forEach(r=>{const k=r.querySelector('.cit small').textContent.trim();if(V[k]){const s=document.createElement('span');s.className='fvc';s.textContent='✦ '+V[k]+' com o seu cartão';r.querySelector('.pu').appendChild(s)}})}"""
def abre():
    b,pg,w=comum2.site(pw,extra=FAV);pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;transition:none!important}'+CSS);pg.evaluate(ABRE);w(1500);pg.evaluate(TAB);w(1000);return b,pg,w
with sync_playwright() as pw:
    b,pg,w=abre();print(pg.evaluate("()=>document.querySelectorAll('#layer .fvi').length"));oh=comum.olho(pg);pg.screenshot(path=T+'f_h.png');b.close()
    b,pg,w=abre();pg.evaluate(LIN);w(400);op=comum.olho(pg);pg.screenshot(path=T+'f_p.png');b.close();print('79 falhas novas:',sorted(op-oh)[:4])
comum.prancha('79-site-favoritos-preco-com-cartao.jpg','Esboço 79 · Site · Favoritos com o cartão do cliente',['Hoje: os Favoritos mostram só o preço normal.','Proposta: o preço continua o normal; só nas peças em que o cartão vale, uma linha discreta em dourado: "✦ R$ 90 com o seu cartão". Ao pôr no carrinho, o carrinho sugere o cartão ("Usar"). Valores de exemplo.'],T+'f_h.png',T+'f_p.png')
