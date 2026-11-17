# S374 · esboço 98 (dono 17/11 12:04 "Sim" → aba Marketing). Hoje: Marketing abre como JANELA por cima (as outras telas da família são telas).
# Proposta: Marketing vira tela do app ("Marketing ⌄" da família, barra de baixo) · Objetivo do mês = OPÇÃO (cartão com borda rosa no escolhido,
# 44 px) · "Criar com um toque" 44 px · círculo de "Feito" com 44 px de toque · plano em até 2 linhas (hoje corta com "…") ·
# "Listas por perfil", "Resultados" e "Kit da marca" (hoje em maiúsculas soltas) = linhas num cartão, abrem no lugar.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS="""
#v-cup .mk98{padding:0}
#v-cup .mk98 .mkObj{display:grid!important;grid-template-columns:1fr 1fr;gap:10px}
#v-cup .mk98 .mkObj .chip{min-height:48px;border-radius:14px!important;background:var(--panel)!important;border:1px solid var(--line)!important;color:var(--fg)!important;font-weight:500}
#v-cup .mk98 .mkObj .chip.on{border-color:var(--accent-fg)!important;color:var(--accent-fg)!important;font-weight:600;background:color-mix(in srgb,var(--accent-fg) 8%,var(--panel))!important}
#v-cup .mk98 .mini{min-height:44px!important}
#v-cup .mk98 .mkCk{width:44px!important;height:44px!important;min-width:44px;margin:-9px!important;border:0!important;background:radial-gradient(circle,transparent 11px,var(--line) 11.5px,var(--line) 12.5px,transparent 13px)!important}
#v-cup .mk98 .mkDt:not([open])>*:not(summary){display:none!important}
#v-cup .mk98 .mkPb small,#v-cup .mk98 .mkPb span{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;display:-webkit-box!important;-webkit-line-clamp:2;-webkit-box-orient:vertical}
#v-cup .mk98 .mkDtG{margin-top:22px;border:1px solid var(--line);border-radius:16px;background:var(--panel);overflow:hidden}
#v-cup .mk98 .mkDt{margin:0!important;border-bottom:1px solid var(--line)}#v-cup .mk98 .mkDt:last-child{border-bottom:0}
#v-cup .mk98 .mkDt>summary.mkSec{display:flex;align-items:center;justify-content:space-between;min-height:56px;margin:0!important;padding:0 16px;text-transform:none!important;letter-spacing:0!important;font-size:16px!important;font-weight:600!important;color:var(--fg)!important;list-style:none}
#v-cup .mk98 .mkDt>summary::-webkit-details-marker{display:none}
#v-cup .mk98 .mkDt>summary.mkSec::after{content:'›';font-size:20px;color:var(--mute);transition:transform .25s}
#v-cup .mk98 .mkDt[open]>summary.mkSec::after{transform:rotate(90deg)}
"""
JS=r"""()=>{const j=document.querySelector('.mkJn'),c=j.querySelector('.ljCorpo').innerHTML;j.remove();document.querySelectorAll('.ljFundo,.ljOv,.ljBg,.ljBk,[class*=ljVeu]').forEach(x=>x.remove());
 window.__LF.setView('cup');return c}"""
JS2=r"""(c)=>{const v=document.getElementById('v-cup');const t=[...v.querySelectorAll('h1,.dHdT')].find(x=>x.offsetParent);if(t)t.firstChild.textContent='Marketing ';
 const tp=t?t.closest('.top')||t.parentElement:null;[...v.children].forEach(x=>{if(x!==tp&&!x.contains(t))x.remove()});
 const d=document.createElement('div');d.className='mkJn mk98';d.style.cssText='position:static;transform:none;box-shadow:none;background:none;border:0;max-height:none;inset:auto;width:auto';d.innerHTML='<div class="ljCorpo" style="overflow:visible;max-height:none;padding:0">'+c+'</div>';v.appendChild(d);
 const ds=[...d.querySelectorAll('details.mkDt')];if(ds.length){const g=document.createElement('div');g.className='mkDtG';ds[0].before(g);ds.forEach(x=>{x.open=false;g.appendChild(x)})}
 document.body.style.overflow='';document.documentElement.classList.remove('lfTrava');document.body.style.top='';return ds.length}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for k,off in (('a',0),('b',1)):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(700);pg.evaluate("()=>window.__LF.inicioGo('mkt')");w(1400)
                if prop:
                    c=pg.evaluate(JS);w(900);pg.add_style_tag(content=CSS);pg.evaluate(JS2,c);w(300)
                    if off: pg.evaluate("()=>{const e=document.querySelector('.mk98 .mkDtG');scrollTo({top:e.getBoundingClientRect().top+scrollY-560,behavior:'instant'})}")
                elif off: pg.evaluate("()=>{const e=document.querySelector('.mkJn .ljCorpo');e.scrollTop=e.scrollHeight}")
                w(400);oo.append(olho(pg));p=T+'m98_%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(k,tema,'novos:',novos(oo[0],oo[1]))
            prancha('98%s-app-marketing-%s-%s.jpg'%(k,'topo' if not off else 'fim',tema),'App · Marketing · %s · tema %s'%('topo' if not off else 'fim',tema),
              ['Hoje: Marketing abre como janela por cima (Temática, Cartões e Analisador são telas); objetivo em pílulas de 38 px; "Feito" com 26 px; plano cortado com "…"; "LISTAS POR PERFIL ›", "RESULTADOS ›" e "KIT DA MARCA ›" soltos em maiúsculas.',
               'Proposta: tela do app com "Marketing ⌄" e a barra de baixo · objetivo como opção (borda rosa no escolhido) · botões e "Feito" com 44 px · plano em até 2 linhas · Listas por perfil, Resultados e Kit da marca em linhas num cartão (abrem no lugar).'],*fs)
