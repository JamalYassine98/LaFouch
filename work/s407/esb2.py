# S407 · esboços 75a–75c (pedido do dono 17/11 12:49): o presente especial dentro da troca de cartão do carrinho. Nada implementado.
E=open('/home/claude/lafouch/work/s407/esb.py').read();exec(E[:E.index('with sync_')])
P=comum.prancha
CSS+=".sh .nt{font:13px/1.5 Inter,system-ui,sans-serif;color:#a8432f;margin:2px 4px 8px}"
SELP="""()=>{const l=[...document.querySelectorAll('.sh label')];l.forEach(x=>x.classList.remove('on'));l[2].classList.add('on');document.querySelector('.sh .ok').textContent='Escolher a peça de presente';const p=l[2].querySelector('small');p.textContent='compre um óculos e leve outro, entre as peças da aba Exclusivo'}"""
GIFT="""()=>{const cl=document.querySelector('#layer .cl'),c0=cl.querySelector('.ci');const c=c0.cloneNode(true);const pc=[...document.querySelectorAll('#grid .card')].find(x=>/SL2210/.test(x.textContent));if(pc){c.querySelector('img').src=pc.querySelector('img').currentSrc||pc.querySelector('img').src}
 c.querySelector('.cit small').textContent='SL2210';c.querySelector('.cit b').textContent='Óculos de sol Hexagonal';c.querySelector('.pu').innerHTML='<span class="gfk2">✦ De presente</span>';c.querySelector('.cis .pr').textContent='R$ 95';const q=c.querySelector('.qty');if(q)q.style.visibility='hidden';cl.appendChild(c);const cn=document.querySelector('#layer .cn');if(cn)cn.textContent='· 2 itens'}"""
DEP="""()=>{const l=[...document.querySelectorAll('.sh label')];l.forEach(x=>x.classList.remove('on'));l[0].classList.add('on');l[2].querySelector('.vl').textContent='Em uso';const n=document.createElement('p');n.className='nt';n.textContent='Trocando, a peça de presente (SL2210) sai do carrinho. O presente continua guardado.';document.querySelector('.sh .ok').before(n)}"""
VCL="()=>{const x=[...document.querySelectorAll('#layer .ci')].pop();x&&x.scrollIntoView({block:'center'})}"
def par5(nome,antes,depois,H=844):
    b,pg,w=carrinho(pw);pg.add_style_tag(content=CSS);pg.set_viewport_size({'width':390,'height':H});w(300)
    for d in antes: pg.evaluate(d[0],d[1]) if isinstance(d,tuple) else pg.evaluate(d);w(300)
    oh=comum.olho(pg);pg.screenshot(path=T+nome+'_h.png')
    for d in depois: pg.evaluate(d[0],d[1]) if isinstance(d,tuple) else pg.evaluate(d);w(400)
    op=comum.olho(pg);pg.screenshot(path=T+nome+'_p.png');b.close();print(nome,'falhas novas:',sorted(op-oh)[:5])
A10=(AP,{'t':'Cartão de 10% aplicado','v':'− R$ 10','tot':'R$ 90'});APR=(AP,{'t':'Presente especial aplicado','v':'− R$ 95','tot':'R$ 100'})
with sync_playwright() as pw:
    par5('p',[A10,SH,SEL],[SELP])
    par5('q',[A10],[GIFT,APR,VCL])
    par5('r',[GIFT,APR,VCL,SH],[DEP])
comum.ROT=('FOLHA ABERTA','TOCOU NO PRESENTE');comum.prancha2('75a-site-carrinho-escolher-presente-especial.jpg','Esboço 75a · Site · Carrinho · escolher o presente especial na folha',['Na mesma folha do 74b, o presente especial é mais uma opção.','Ao tocar nele, o botão vira "Escolher a peça de presente" e leva à aba Exclusivo com as peças que podem ser o presente (71d), sem perder o carrinho.'],T+'p_h.png',T+'p_p.png')
comum.ROT=('ANTES','VOLTOU COM A PEÇA');comum.prancha2('75b-site-carrinho-presente-com-trocar.jpg','Esboço 75b · Site · Carrinho · presente especial aplicado, com "Trocar"',['O cliente escolhe a peça na aba Exclusivo e volta ao carrinho.','A peça entra como item ("✦ De presente", 71b) e a linha é a mesma de qualquer cartão: "Presente especial aplicado − R$ 95 · Trocar". O total não muda.'],T+'q_h.png',T+'q_p.png')
comum.ROT=('FOLHA ABERTA COM O PRESENTE','TOCOU EM OUTRO CARTÃO');comum.prancha2('75c-site-carrinho-trocar-presente-por-cartao.jpg','Esboço 75c · Site · Carrinho · trocar o presente por outro cartão',['Com o presente em uso, a folha mostra "Em uso" nele.','Se o cliente escolher outro cartão, um aviso diz que a peça de presente sai do carrinho; o presente continua guardado para outra compra.'],T+'r_h.png',T+'r_p.png')
