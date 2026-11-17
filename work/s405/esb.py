# S405 · esboços 71a–71e (pedido do dono 17/11 11:20): presente no carrinho no padrão de todos os cupons (refaz 64a/64b), OFERTA sem desconto (refaz 65f),
# cartão do presente na temática (refaz 66d) e o cartão em cada temática. 65d retirado. Site real (cópia do kit), celular; só injeta o que muda. Nada implementado.
E=open('/home/claude/lafouch/work/s401/esb5.py').read();exec(E[:E.index('with sync_playwright')])
import json,base64,inspect,os
comum.OUT='/home/claude/lafouch/work/s405/';T='/tmp/s405/';T1='/tmp/s401/'
exec(inspect.getsource(comum.prancha).replace("def prancha(","def prancha2(").replace("('HOJE','PROPOSTA')","ROT"),comum.__dict__)
CSS+="#layer .exc{margin:-8px 0 -6px}.gfk2{color:#8a6a33;font-weight:600}.cis .pr s{font-weight:400;color:#8a7d84;font-size:.8em;margin-right:6px}#layer .lfof{display:block;margin-top:3px;font:12.5px/1.4 Inter,system-ui,sans-serif;color:#a8432f;background:none;padding:0;position:static}"
# 71a: presente guardado = a mesma linha de qualquer cartão (65e), sem bloco
G1="""()=>{const c=document.querySelector('#layer .cupf');const d=document.createElement('div');d.className='exc';d.innerHTML='<span><i>✦</i>Você tem um presente especial</span><button type="button">Escolher</button>';c.parentNode.insertBefore(d,c);c.remove()}"""
# 71b: escolheu (na aba Exclusivo, 66d/71d) → a peça entra como item normal; "De presente" no lugar do preço; a linha do resumo no padrão "aplicado"
G2="""()=>{const cl=document.querySelector('#layer .cl'),c0=cl.querySelector('.ci');const c=c0.cloneNode(true);const pc=[...document.querySelectorAll('#grid .card')].find(x=>/SL2210/.test(x.textContent));if(pc){c.querySelector('img').src=pc.querySelector('img').currentSrc||pc.querySelector('img').src}
 c.querySelector('.cit small').textContent='SL2210';c.querySelector('.cit b').textContent='Óculos de sol Hexagonal';c.querySelector('.pu').innerHTML='<span class="gfk2">✦ De presente</span>';c.querySelector('.cis .pr').textContent='R$ 95';const q=c.querySelector('.qty');if(q)q.style.visibility='hidden';cl.appendChild(c);
 const cn=document.querySelector('#layer .cn');if(cn)cn.textContent='· 2 itens';const d=document.querySelector('#layer .exc');d.innerHTML='<span><i>✦</i>Presente especial aplicado</span><span style="font-weight:600;color:#1f8f4e">− R$ 95</span>'}"""
# 71c: OFERTA no carrinho: o cartão só entra na peça que aceita; a peça em OFERTA diz isso nela mesma
G3="""()=>{const cl=document.querySelector('#layer .cl'),c0=cl.querySelector('.ci');const c=c0.cloneNode(true);const pc=[...document.querySelectorAll('#grid .card')].find(x=>/SL2250/.test(x.textContent));if(pc){c.querySelector('img').src=pc.querySelector('img').currentSrc||pc.querySelector('img').src}
 c.querySelector('.cit small').textContent='SL2250 · OFERTA';c.querySelector('.cit b').textContent='Óculos de sol Metal';c.querySelector('.pu').innerHTML='R$ 80 por unidade<span class="lfof">Em OFERTA: o cartão não vale nesta peça.</span>';c.querySelector('.cis .pr').textContent='R$ 80';cl.appendChild(c);
 const cn=document.querySelector('#layer .cn');if(cn)cn.textContent='· 2 itens';const d=document.querySelector('#layer .exc');d.innerHTML='<span><i>✦</i>Cartão de 10% aplicado · 1 peça</span><span style="font-weight:600;color:#1f8f4e">− R$ 10</span>';const t=document.querySelector('#layer .cs-t b');if(t)t.textContent='R$ 170'}"""
VCL="()=>{const p=document.querySelector('#layer .panel');const x=[...document.querySelectorAll('#layer .ci')].pop();x&&x.scrollIntoView({block:'center'})}"
# 71d: aba Exclusivo no Natal com o presente: o cartão veste a temática
NAT="""()=>{const h=document.querySelector('.exh');h.className='exh nat pre2';h.querySelector('small').textContent='NATAL';h.querySelector('em').textContent='presente de Natal';const s=h.querySelector('strong');s.style.cssText='font-size:25px;line-height:1.2;margin-top:16px';h.querySelector('img').src=window.__lgn}"""
def par3(nome,abre,antes,depois,H=1000,ver=None):
    b,pg,w=abre();pg.set_viewport_size({'width':390,'height':H});w(300)
    for d in antes: pg.evaluate(d[0],d[1]) if isinstance(d,tuple) else pg.evaluate(d);w(400)
    if ver and not depois: pass
    oh=comum.olho(pg)
    for d in depois: pg.evaluate(d[0],d[1]) if isinstance(d,tuple) else pg.evaluate(d);w(400)
    pg.set_viewport_size({'width':390,'height':H});w(300)
    if ver: pg.evaluate(ver);w(300)
    op=comum.olho(pg);pg.screenshot(path=T+nome+'.png');b.close();print(nome,'falhas novas:',sorted(op-oh)[:4])
with sync_playwright() as pw:
    par3('a',lambda:carrinho(pw),[],[G1],1000)
    par3('b',lambda:carrinho(pw),[G1],[G2],1000,VCL)
    par3('c',lambda:carrinho(pw),[CAR1],[CAR2.replace("const n=document.createElement","const _x=0;const n=document.createElement").split("const n=document.createElement")[0]+"}",G3],1000,VCL)
    par3('d',lambda:site(pw,'natal'),[VIT],[(ABA2,2),NAT],1150,"()=>{const h=document.querySelector('.exh');const sc=document.getElementById('vscr');h.scrollIntoView({block:'start'});let hb=document.querySelector('.top').getBoundingClientRect().bottom;const fl=hb+18-h.getBoundingClientRect().top;if(sc)sc.scrollTop-=fl;window.scrollBy(0,-Math.max(0,hb+18-h.getBoundingClientRect().top))}")
    # 71e: os cartões em cada temática
    L=json.load(open(T+'c.json'));b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':760,'height':400},device_scale_factor=2)
    U2=lambda f:'data:image/png;base64,'+base64.b64encode(open('/home/claude/catalogo/media/email/'+f,'rb').read()).decode()
    h=''.join('<div style="padding:10px 14px 16px"><div style="font:600 14px Arial;color:#6b5f66;margin:0 0 4px 4px">'+x['n']+'</div>'+x['h']+'</div>' for x in L)
    for f in os.listdir('/home/claude/catalogo/media/email/'):
        if f.startswith('cartao-'): h=h.replace('https://lafouch.com/media/email/'+f,U2(f))
    pg.set_content('<body style="margin:0;background:#fff"><div style="display:grid;grid-template-columns:1fr 1fr;padding:10px">'+h+'</div></body>');pg.wait_for_timeout(400);pg.screenshot(path=T+'e.png',full_page=True);b.close()
import os
comum.ROT=('ANTES (64a, aprovado)','AGORA');comum.prancha2('71a-site-carrinho-presente-guardado.jpg','Esboço 71a · Site · Carrinho · presente especial guardado (refaz o 64a)',['Antes: um bloco preto grande com as peças dentro do carrinho.','Agora: a mesma linha de qualquer cartão ("Você tem um presente especial · Escolher"). O toque leva à aba Exclusivo com as peças que podem ser o presente (71d).'],T1+'g1_p.png',T+'a.png')
comum.ROT=('ANTES (64b, aprovado)','AGORA');comum.prancha2('71b-site-carrinho-presente-escolhido.jpg','Esboço 71b · Site · Carrinho · presente escolhido (refaz o 64b)',['Antes: a peça vinha como "PRESENTE" com um selo preto no lugar do preço.','Agora: a peça entra como as outras (referência e nome); no lugar do preço, "✦ De presente", e embaixo, a linha padrão "Presente especial aplicado − R$ 95" (igual a qualquer cartão). O total não muda.'],T1+'g2_p.png',T+'b.png')
comum.ROT=('ANTES (65f, aprovado)','AGORA');comum.prancha2('71c-site-carrinho-oferta-sem-cartao.jpg','Esboço 71c · Site · Carrinho · peça em OFERTA não leva o cartão (refaz o 65f)',['Antes: o aviso falava de uma peça em OFERTA que nem estava no carrinho, e o desconto parecia valer para tudo.','Agora: a peça em OFERTA diz nela mesma que o cartão não vale; o desconto entra só na outra ("Cartão de 10% aplicado · 1 peça"). Valores de exemplo.'],T1+'f_p.png',T+'c.png')
comum.ROT=('ANTES (66d, aprovado)','AGORA');comum.prancha2('71d-site-exclusivo-presente-de-natal.jpg','Esboço 71d · Site · Aba Exclusivo · presente na temática (refaz o 66d)',['Antes: o cartão preto do presente brigava com a temática de Natal.','Agora: no evento, o cartão do presente veste a temática ("presente de Natal"); fora do evento, volta ao preto e dourado.'],T1+'s_p.png',T+'d.png')
from PIL import Image,ImageDraw
im=Image.open(T+'e.png').convert('RGB');g=40;S=Image.new('RGB',(im.size[0]+2*g,im.size[1]+190),'#f1eef0');d=ImageDraw.Draw(S)
d.text((g,34),'Esboço 71e · Cartão do presente especial em cada temática',font=comum.F(40,True),fill='#1d1418')
d.text((g,96),'O cartão muda de cor e de nome com a temática do site. Vale na aba Exclusivo, no carrinho e em Minha conta › Cartões.',font=comum.F(25),fill='#55484f')
d.text((g,132),'A frase é sempre "Na compra de um, leve outro de presente".',font=comum.F(25),fill='#55484f')
S.paste(im,(g,175));S.save(comum.OUT+'71e-cartao-presente-por-tematica.jpg',quality=88);print(S.size)
