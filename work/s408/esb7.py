# S408 · esboços 81f/81g (17/11 14:15): Favoritos com só um selinho "Cupom disponível". Nada implementado.
E=open('/home/claude/lafouch/work/s408/esb5.py').read();exec(E[:E.index('with sync_'+'playwright() as pw')])
CSS+=".fsl{display:inline-block;margin-left:8px;padding:0 7px;border:1px solid #d9c6a3;border-radius:99px;color:#7a5a2a;font:500 11.5px/18px Inter,system-ui,sans-serif;vertical-align:1px}.fvi .cimg{position:relative}.fsf{position:absolute;left:4px;top:4px;padding:0 6px;border-radius:99px;background:rgba(255,255,255,.92);border:1px solid #d9c6a3;color:#7a5a2a;font:500 11.5px/17px Inter,system-ui,sans-serif;white-space:nowrap}"
G1="""(v)=>{[...document.querySelectorAll('#layer .fvi')].forEach(r=>{const k=r.querySelector('.cit small').textContent.trim();if(v[k]){const s=document.createElement('span');s.className='fsl';s.textContent='Cupom disponível';r.querySelector('.pu span').after(s)}})}"""
G2="""(v)=>{[...document.querySelectorAll('#layer .fvi')].forEach(r=>{const k=r.querySelector('.cit small').textContent.trim();if(v[k]){const s=document.createElement('span');s.className='fsf';s.textContent='✦ Cupom';r.querySelector('.cimg').appendChild(s)}})}"""
with sync_playwright() as pw:
    for n,f in (('f',G1),('g',G2)):
        b,pg,w=abre();oh=comum.olho(pg);b.close()
        b,pg,w=abre();pg.evaluate(f,V);w(400);op=comum.olho(pg);pg.screenshot(path=T+'o%s.png'%n);b.close();print(n,'falhas novas:',sorted(op-oh)[:4])
comum.ROT=('ANTES (79)','OPÇÃO F');comum.prancha2('81f-site-favoritos-selo-ao-lado-do-preco.jpg','Esboço 81f · Site · Favoritos · selinho "Cupom disponível" ao lado do preço',['Sem valor: só um selinho de contorno fino, ao lado do preço, nas peças em que o cartão vale. O valor aparece no carrinho.'],T+'f_p.png',T+'of.png')
comum.ROT=('ANTES (79)','OPÇÃO G');comum.prancha2('81g-site-favoritos-selo-na-foto.jpg','Esboço 81g · Site · Favoritos · selinho "✦ Cupom" no canto da foto',['Sem valor e fora da linha do preço: um selinho pequeno no canto da foto da peça.'],T+'f_p.png',T+'og.png')
