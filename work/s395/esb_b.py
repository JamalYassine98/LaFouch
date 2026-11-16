# S395b · esboço 59b refeito (dono, 16/11 19:01): depois de 2 min o "Aguardando sua transferência…" passa a dizer que a confirmação está demorando e que, se já pagou, pode enviar o comprovante.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import pag,comum;comum.OUT='/home/claude/lafouch/work/s395/'
from playwright.sync_api import sync_playwright
E=open('/home/claude/lafouch/work/s395/esb.py').read();CSS=E.split('CSS="""')[1].split('"""')[0];P_TRF=E.split('P_TRF="""')[1].split('"""')[0]
P2="""()=>{const o=document.getElementById('pkok');o.querySelector('.zs').innerHTML='<span class="spn"></span><span>A confirmação está demorando mais que o normal. Se você já transferiu, envie o comprovante.</span>';
 const za=o.querySelector('.za'),a=za.querySelector('a.zA'),l=document.createElement('label');l.className='zA';l.innerHTML='<span>Enviar comprovante</span>'+(a.querySelector('svg')?a.querySelector('svg').outerHTML:'');za.insertBefore(l,a)}"""
T='/tmp/s395/'
def cheia(pg,arq,H):
    pg.set_viewport_size({'width':390,'height':H});pg.wait_for_timeout(350);pg.screenshot(path=arq)
with sync_playwright() as pw:
    b,pg,w=pag.abre(pw,'alias',3);oh=comum.olho(pg);H=pg.evaluate("()=>Math.max(844,document.getElementById('pkok').scrollHeight+4)");cheia(pg,T+'b_h.png',H);b.close()
    b,pg,w=pag.abre(pw,'alias',3);pg.add_style_tag(content=CSS);pg.evaluate(P_TRF);pg.evaluate(P2);w(300);op=comum.olho(pg);cheia(pg,T+'b_p.png',H);b.close()
    print('falhas novas do olho:',sorted(op-oh)[:4])
comum.prancha('59b-site-pagar-transferencia-comprovante.jpg','Esboço 59b · Site · Transferência · depois de 2 minutos',['Hoje: "Já transferi, enviar comprovante" está lá desde o começo e abre a galeria direto.','Proposta: o aviso muda para "está demorando… se você já transferiu, envie o comprovante" e aparece a linha "Enviar comprovante".'],T+'b_h.png',T+'b_p.png')
