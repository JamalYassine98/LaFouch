# S408 · esboço 82 (17/11 14:25): catálogo com o mesmo selinho "Cupom disponível" do 81f (só para quem tem cartão, só onde vale). Nada implementado.
E=open('/home/claude/lafouch/work/s401/esb4.py').read();exec(E[:E.index('ABRE_MENU=')])
comum.OUT='/home/claude/lafouch/work/s408/';T='/tmp/s408/'
CSS2=".fsl{display:inline-block;margin-left:6px;padding:0 7px;border:1px solid #d9c6a3;border-radius:99px;color:#7a5a2a;font:500 11.5px/18px Inter,system-ui,sans-serif;vertical-align:1px;white-space:nowrap}"
SEL="""()=>{[...document.querySelectorAll('#grid .card')].forEach((c,i)=>{if(c.classList.contains('of')||/OFERTA/.test(c.textContent))return;if(i%3===2)return;const p=c.querySelector('.pr');if(!p)return;const s=document.createElement('span');s.className='fsl';s.textContent='Cupom disponível';p.appendChild(s)})}"""
VER="()=>{const g=document.getElementById('grid');g.scrollIntoView({block:'start'});window.scrollBy(0,-150)}"
with sync_playwright() as pw:
    for k in (0,1):
        b,pg,w=site(pw);pg.add_style_tag(content=CSS2);pg.evaluate(VIT);w(1600);pg.set_viewport_size({'width':390,'height':1000});w(300)
        if k: pg.evaluate(SEL);w(300)
        pg.evaluate(VER);w(300)
        o=comum.olho(pg);pg.screenshot(path=T+'k%d.png'%k);b.close()
        if k: print('82 falhas novas:',sorted(o-oh)[:4])
        else: oh=o
comum.prancha('82-site-catalogo-cupom-disponivel.jpg','Esboço 82 · Site · Catálogo · selinho "Cupom disponível"',['Hoje: o catálogo mostra só o preço normal.','Proposta: o mesmo selinho do 81f, ao lado do preço, só para quem tem cartão e só nas peças em que ele vale. O preço continua o normal; o valor aparece no carrinho. Quem não tem cartão vê o catálogo como hoje.'],T+'k0.png',T+'k1.png')
