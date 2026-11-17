# S408 · esboço 83 (17/11 14:30): página da peça com o selinho "Cupom disponível" do 81f ao lado do preço. Nada implementado.
E=open('/home/claude/lafouch/work/s401/esb4.py').read();exec(E[:E.index('ABRE_MENU=')])
comum.OUT='/home/claude/lafouch/work/s408/';T='/tmp/s408/'
CSS2=".fsl{display:inline-block;margin-left:0;padding:0 8px;border:1px solid #d9c6a3;border-radius:99px;color:#7a5a2a;font:500 12.5px/20px Inter,system-ui,sans-serif;vertical-align:middle;white-space:nowrap;letter-spacing:0}"
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
comum.prancha('83-site-peca-cupom-disponivel.jpg','Esboço 83 · Site · Página da peça · selinho "Cupom disponível"',['Hoje: "Aceita cupom" (verde) para todos, mesmo quem não tem cupom nenhum.','Proposta: no mesmo lugar, o selinho do 81f, "Cupom disponível", só para quem tem um cartão que vale nesta peça; quem não tem cartão não vê nada. O catálogo continua sem selinho (82 retirado).'],T+'pp0.png',T+'pp1.png')
