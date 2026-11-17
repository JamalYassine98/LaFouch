# S407 · esboço 76a (pedido do dono 17/11 12:56): o subtotal da peça de presente dava a impressão de que ela é paga. Nada implementado.
E=open('/home/claude/lafouch/work/s407/esb2.py').read();exec(E[:E.index('with sync_'+'playwright() as pw')])
CSS+=".cis .pr .gfr{color:#1f8f4e}.cis .pr s{font-weight:400;color:#8a7d84;font-size:.72em;margin-right:6px}"
GR="""()=>{const c=[...document.querySelectorAll('#layer .ci')].pop();c.querySelector('.cis .pr').innerHTML='<s>R$ 95</s><span class="gfr">Grátis</span>';
 const x=document.querySelector('#layer .exc');x.innerHTML='<span><i>✦</i>Presente especial aplicado</span><button type="button" class="tr">Trocar</button>'}"""
with sync_playwright() as pw:
    b,pg,w=carrinho(pw);pg.add_style_tag(content=CSS);pg.set_viewport_size({'width':390,'height':844});w(300)
    for d in [GIFT,APR,VCL]: pg.evaluate(d[0],d[1]) if isinstance(d,tuple) else pg.evaluate(d);w(300)
    oh=comum.olho(pg);pg.screenshot(path=T+'g_h.png');pg.evaluate(GR);w(400);op=comum.olho(pg);pg.screenshot(path=T+'g_p.png');b.close();print('76a falhas novas:',sorted(op-oh)[:5])
comum.ROT=('ANTES (75b)','AGORA');comum.prancha2('76a-site-carrinho-presente-gratis.jpg','Esboço 76a · Site · Carrinho · a peça de presente aparece "Grátis"',['Antes: o subtotal da peça de presente dizia R$ 95, como se fosse paga, e o desconto aparecia embaixo.','Agora: na própria peça, R$ 95 riscado e "Grátis"; a linha de baixo diz só "Presente especial aplicado · Trocar" (sem valor, para não descontar duas vezes). O total não muda.'],T+'g_h.png',T+'g_p.png')
