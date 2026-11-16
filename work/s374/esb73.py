# S374 · esboço 73 (dono 16/11 17:39 "Sim" → Despesas) — aba 6 da padronização dos botões, Dinheiro › Despesas.
# Proposta: "+ Nova despesa" sai de um bloco no fim da página e vira a ação de página no topo ("+ Nova", contorno neutro, como o
# "+ Adicionar" do Inventário; abre o mesmo formulário) · "Marcar X como paga ›" (linha branca inteira) → "Marcar como paga ›"
# texto rosa embaixo da conta · conta paga: sem o círculo verde cheio e sem o riscado (círculo fino com ✓ verde, nome apagado) ·
# "ajuste em Ajustes" → "Ajustar ›" texto rosa · títulos dos cartões na mesma letra.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS73="""
#v-desp h2{font-family:inherit!important;font-size:16px!important;font-weight:600!important;letter-spacing:0}
#v-desp .esLn.slVai{justify-content:flex-start!important;min-height:44px;margin-top:-6px}
#v-desp .esLn.slVai b{color:var(--accent-fg)!important;font-weight:600!important}#v-desp .esLn.slVai i{display:none}
#v-desp .chk.on{background:none!important;border:1.5px solid var(--ok)!important;color:var(--ok)!important}
#v-desp .chk{border-width:1.5px!important}
#v-desp .paga-nome{text-decoration:none!important;color:var(--mute)!important;font-weight:600}
#v-desp .top.grpTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
#v-desp .nv73{flex:none;border:1px solid var(--line);background:none;color:var(--fg);border-radius:999px;height:44px;padding:0 18px;font:inherit;font-weight:600;margin-top:6px}
#v-desp .aj73{background:none;border:0;padding:6px 0;min-height:44px;font:inherit;font-weight:600;color:var(--accent-fg);display:block}
"""
JS73=r"""()=>{const v=document.getElementById('v-desp');
 v.querySelectorAll('.esLn.slVai[data-act=exppay] .g b').forEach(b=>b.textContent='Marcar como paga ›');
 const t=v.querySelector('.top.grpTop');if(t&&!t.querySelector('.nv73')){const b=document.createElement('button');b.type='button';b.className='nv73';b.textContent='+ Nova';t.appendChild(b)}
 const nv=v.querySelector('section.fxF[data-fx=nova]');if(nv)nv.remove();
 const h=[...v.querySelectorAll('.kpi .hint')].find(x=>/ajuste em Ajustes/.test(x.textContent));if(h){h.textContent=h.textContent.replace(/\s*\(rateio: (\d+) peças por mês, ajuste em Ajustes\)/,' · $1 peças por mês');const a=document.createElement('button');a.type='button';a.className='aj73';a.textContent='Ajustar ›';h.after(a)}
 return 1}"""
def tela(pg,w): pg.evaluate("()=>window.__LF.setView('desp')");w(1500)
PARTES=[('a-topo','#v-desp','Despesas · topo e contas para pagar',0),('b-contas','#v-desp .ecF','Despesas · contas do mês',-120),('c-fim','#v-desp section.fxF[data-fx=imp]','Despesas · fim da página',-420)]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,sel,tit,off in PARTES:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(900);tela(pg,w)
                if prop: pg.add_style_tag(content=CSS73);pg.evaluate(JS73);w(300)
                pg.evaluate("([s,o])=>{const e=document.querySelector(s);scrollTo({top:Math.max(0,e.getBoundingClientRect().top+scrollY+o),behavior:'instant'})}",[sel,off]);w(350)
                oo.append(olho(pg));p=T+'d73_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]))
            prancha('73%s-app-despesas-botoes-%s.jpg'%(nome,tema),'App · Dinheiro › Despesas › botões (aba 6) · %s · tema %s'%(tit,tema),
              ['Hoje: "+ Nova despesa" escondido num bloco no fim da página; "Marcar X como paga ›" ocupa uma linha branca inteira; conta paga com círculo verde cheio e nome riscado; "ajuste em Ajustes" sem toque; títulos em duas letras.',
               'Proposta: "+ Nova" no topo (ação de página, contorno neutro; abre o mesmo formulário) · "Marcar como paga ›" texto rosa · conta paga com círculo fino e ✓ verde, nome apagado, sem riscado · "Ajustar ›" texto rosa · títulos na mesma letra.'],*fs)
