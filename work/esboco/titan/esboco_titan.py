# ESBOÇO · Titan que aprende o mercado (ESBOCO, 27/11/2026; proposta work/esboco/cambio/PROPOSTA-TITAN-CAMBIO.md v2–v2e, aprovada 10:23).
# Base: app REAL de hoje (motor do Argus, loja de teste). Os textos da leitura do Titan são de exemplo (o conteúdo vem do cérebro).
import os, sys
sys.path.insert(0, '/home/claude/lafouch/work/esboco/semp'); import base
from base import abrir, Image
O = os.path.dirname(os.path.abspath(__file__)) + '/'; base.O = O
ABRE_FX = "()=>{__LF.inicioGo('fx')}"
JAN_USD = "()=>{document.querySelector('.fxLin[data-id=usd]').click()}"
FX_PROP = r"""()=>{
 const c=document.querySelector('.fjCorpo'), m=[...c.querySelectorAll('.fjMot')].pop(); if(m)m.remove();
 const L=(ok,ic,t)=>'<div class="'+(ok?'ok':'no')+'"><i>'+ic+'</i><span>'+t+'</span></div>';
 c.insertAdjacentHTML('beforeend',
  '<div class="lbl tiLb" style="margin-top:24px">LEITURA DO TITAN · HOJE 07:00</div>'+
  '<div class="fjMot">'+L(false,'▲','Semana: <b>deve subir pouco</b> · entre G$ 6.470 e G$ 6.560')+'</div>'+
  '<div class="lbl tiLb">POR QUÊ</div><div class="fjMot">'+
   L(false,'!','O real caiu ontem: o Brasil compra menos e o guaraní perde força')+
   L(true,'✓','Safra entrando: mais dólar na praça nas próximas semanas')+
   L(false,'!','Fim de mês: empresas compram dólar para pagar fornecedores')+'</div>'+
  '<div class="lbl tiLb">PLACAR</div><div class="fjMot">'+L(true,'✓','Acertou <b>9 de 12</b> semanas · lição da última: o efeito do real foi maior do que eu esperava')+'</div>');
}"""
ABRE_PREC = "()=>{__LF.inicioGo('prec')}"
PREC_PROP = r"""()=>{
 const it=(__LF.S.items||[]).filter(i=>i.qty>0).sort((a,b)=>(b.price||0)-(a.price||0))[0]||{name:'peça de luxo'};
 const sec=document.querySelector('.tiD')||document.querySelector('.tiSe'), mod=[...sec.querySelectorAll('.nvL')].pop(), n=mod.cloneNode(true);
 n.querySelector('.nvTx b').textContent='Oferta discreta · '+([it.marca,it.modelo].filter(Boolean).join(' ')||it.name||it.ref);
 const sm=n.querySelector('.nvTx small'); sm.textContent='Parada 70 dias · cupom + estojo, preço fica'; sm.className='';
 const v=n.querySelector('em'); if(v)v.textContent='';
 sec.insertBefore(n,sec.firstChild);
 const lb=document.querySelector('.tiLb'); if(lb&&/DECIDE/.test(lb.textContent))lb.textContent=lb.textContent.replace(/\d+$/,m=>+m+1);
}"""
def foto(pg, nome):
    pg.evaluate('()=>window.__argus.parar()'); f = '/tmp/esb_ti_%s.png' % nome; pg.screenshot(path=f)
    im = Image.open(f).convert('RGB'); return im.resize((560, int(im.height * 560 / im.width)))
from playwright.sync_api import sync_playwright
Q = {'fx': [], 'prec': []}
with sync_playwright() as pw:
    for tema in ('escuro', 'claro'):
        for k, passos, prop in (('fx', [ABRE_FX, JAN_USD], FX_PROP), ('prec', [ABRE_PREC], PREC_PROP)):
            b, pg = abrir.abre(pw, tema=tema)
            for p in passos: pg.evaluate(p); pg.wait_for_timeout(1200)
            hoje = base.pecas(pg); ih = foto(pg, 'h')
            pg.evaluate(prop); pg.wait_for_timeout(500); prop_ = base.pecas(pg); ip = foto(pg, 'p')
            base.mede(pg, 'Titan %s proposta · %s' % (k, tema)); base.compara_hp('Titan %s · %s' % (k, tema), hoje, prop_)
            Q[k] += [('Hoje · %s' % tema, 'app v641', ih), ('Proposta · %s' % tema, 'Titan aprende o mercado', ip)]
            b.close()
base.quadro('esboco_titan_cambio.jpg', Q['fx']); base.quadro('esboco_titan_precos.jpg', Q['prec'])
base.relatorio('comparador_titan.md')
