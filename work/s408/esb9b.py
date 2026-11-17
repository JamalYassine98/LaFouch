# S408 · esboço 83 (17/11 14:30): página da peça com o selinho "Cupom disponível" do 81f ao lado do preço. Nada implementado.
E=open('/home/claude/lafouch/work/s401/esb4.py').read();exec(E[:E.index('ABRE_MENU=')])
comum.OUT='/home/claude/lafouch/work/s408/';T='/tmp/s408/'
CSS2=".fsl{display:inline-block;margin-left:0;padding:0 8px;border:1px solid #dcc3d1;border-radius:99px;color:#8d3a69;font:500 12.5px/20px Inter,system-ui,sans-serif;vertical-align:middle;white-space:nowrap;letter-spacing:0}"
ABRE="()=>document.querySelector('#grid .card .open, .card .open, .hc .open, [data-ref]').click()"
PRC="""()=>{const a=document.querySelector('#layer .acup');if(!a)return null;const s=document.createElement('span');s.className='fsl';s.textContent='Cupom disponível';a.scrollIntoView({block:'center'});a.replaceWith(s);return 'ok'}"""
VP="""()=>{const L=document.getElementById('layer');const c=document.querySelector('#layer .acup');c&&c.scrollIntoView({block:'center'})}"""
with sync_playwright() as pw:
    for k in (0,1):
        b,pg,w=site(pw);pg.add_style_tag(content=CSS2);pg.evaluate(ABRE);w(1600)
        if k: print(pg.evaluate(PRC));w(400)
        else: pg.evaluate(VP);w(300)
        o=comum.olho(pg);pg.screenshot(path=T+'pp%d.png'%k);b.close()
        if k: print('83 falhas novas:',sorted(o-oh)[:4])
        else: oh=o
import inspect;exec(inspect.getsource(comum.prancha).replace("def prancha(","def prancha2(").replace("('HOJE','PROPOSTA')","ROT"),comum.__dict__)
comum.ROT=('DOURADO (83)','VINHO');comum.prancha2('83b-site-peca-cupom-disponivel-vinho.jpg','Esboço 83b · Site · Página da peça · selinho dourado × vinho',['Dourado: a mesma cor dos cartões e da palavra Exclusivo — vira o sinal de "cupom" no site todo.','Vinho: a cor dos botões e links do site — some mais no desenho, mas também se confunde com link.'],'/tmp/s408/pp1_ouro.png',T+'pp1.png')
