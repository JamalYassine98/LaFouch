# ESBOÇO · consertos do Início (ESBOCO, 26/11/2026, pedido do dono depois do "susto" da atualização).
# Base: o app REAL de hoje (v641, montado do commit atual pelo motor do Argus), loja de teste. A proposta é aplicada NA PRÓPRIA tela.
import os, sys
sys.path.insert(0, '/home/claude/lafouch/work/esboco/semp'); import base
from base import abrir, Image
O = os.path.dirname(os.path.abspath(__file__)) + '/'; base.O = O
PROP = r"""()=>{
 const F={'g:res':'Dia e mês','g:site':'Pedidos e vitrine','g:mkt':'Posts e vídeos'};
 (__LF.S.grupos||[]).forEach(g=>{if(F[g.id])g.frase=F[g.id]}); __LF.render();
 const pl=(n,u,us,z)=>n===0?z:n===1?'1 '+u:n+' '+us;
 const h=document.querySelector('#v-inicio .hero small'); if(h)h.textContent=h.textContent.replace(/(\d+) venda\(s\)/,(m,n)=>pl(+n,'venda','vendas','nenhuma venda'));
 document.querySelectorAll('#v-inicio .tl .tp').forEach(t=>{t.textContent=t.textContent.replace(/^0 cadastrados$/,'Nenhum ainda')});
 const st=document.createElement('style'); st.textContent=`
  #v-inicio .tgrid{grid-auto-rows:1fr;gap:8px}
  #v-inicio{gap:16px!important}#v-inicio>.buBox{margin-bottom:0!important}
  #v-inicio .guardCh,#v-inicio .hero .hg{opacity:1!important;color:var(--mute)!important}
  #v-inicio .tl{display:grid!important;grid-template-rows:auto auto 1fr auto;justify-items:center}
  #v-inicio .tl .tn,#v-inicio .tl .tp{white-space:nowrap;overflow:hidden;max-width:100%}
  #v-inicio .tl .tp{align-self:end}
  #v-inicio .tgrid[data-cabe="1"] .tp{font-size:calc(var(--tp0)*.92)}#v-inicio .tgrid[data-cabe="2"] .tp{font-size:calc(var(--tp0)*.85)}#v-inicio .tgrid[data-cabe="3"] .tp{font-size:calc(var(--tp0)*.78)}`;
 document.head.appendChild(st);
 const g=document.querySelector('#v-inicio .tgrid'), tx=[...g.querySelectorAll('.tn,.tp')]; g.style.setProperty('--tp0',getComputedStyle(g.querySelector('.tp')).fontSize);
 for(let n=0;n<=3;n++){g.setAttribute('data-cabe',n); if(!tx.some(t=>t.scrollWidth>t.clientWidth+1))break}
}"""
def foto(pg, nome):
    pg.evaluate('()=>window.__argus.parar()'); f = '/tmp/esb_ini_%s.png' % nome; pg.screenshot(path=f)
    im = Image.open(f).convert('RGB'); return im.resize((560, int(im.height * 560 / im.width)))
from playwright.sync_api import sync_playwright
Q = []
with sync_playwright() as pw:
    for tema, letra in (('escuro', 1.0), ('escuro', 1.3), ('claro', 1.0)):
        b, pg = abrir.abre(pw, tema=tema, letra=letra); pg.wait_for_timeout(600)
        hoje = base.pecas(pg); ih = foto(pg, 'h')
        pg.evaluate(PROP); pg.wait_for_timeout(600)
        prop = base.pecas(pg); ip = foto(pg, 'p'); base.mede(pg, 'Início proposta · %s · letra %s' % (tema, letra))
        base.compara_hp('Início · %s · letra %s' % (tema, letra), hoje, prop)
        Q += [('Hoje · %s · %s' % (tema, letra), 'app v641', ih), ('Proposta · %s · %s' % (tema, letra), 'consertos do Início', ip)]
        b.close()
for k in range(0, 6, 2): base.quadro('esboco_inicio_%d.jpg' % (k // 2 + 1), Q[k:k + 2])
base.relatorio('comparador_inicio.md')
