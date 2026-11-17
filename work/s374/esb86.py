# S374 · esboço 86 (dono 17/11 07:56 "Sim" → Estúdio) — Peças › Estúdio na padronização de luxo.
# Proposta: "?" e "×" com 44 px (hoje 38) · "Ver todas ›" (branco, toque de 22 px) e "+ 18 peças" faziam a mesma coisa → fica um só,
# "Ver as 24 peças ›" em rosa no fim da lista, e o título vira "NA FILA · 24" · "Ficha" (branco, sem seta) → "Ficha ›" em rosa ·
# "Peça nova, ainda sem cadastro ›" em rosa · nomes compridos em até 2 linhas (hoje cortam com "…") · "Começar" continua a principal.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS="""
.estIc,.estX{width:44px!important;height:44px!important;min-width:44px}
.estFi{color:var(--accent-fg)!important;font-weight:600;min-height:44px}
.estFi::after{content:' ›'}
.estLink{color:var(--accent-fg)!important;font-weight:600;min-height:44px}
.estMais{color:var(--accent-fg)!important;font-weight:600;min-height:44px}
.estTx b{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;display:-webkit-box!important;-webkit-line-clamp:2;-webkit-box-orient:vertical}
"""
JS=r"""()=>{const t=[...document.querySelectorAll('.estLink[data-e=todas]')];t.forEach(x=>x.remove());const m=document.querySelector('.estMais');const n=(document.querySelector('.estGo').textContent.match(/(\d+) peças/)||[])[1];
 if(m)m.textContent='Ver as '+n+' peças ›';const l=[...document.querySelectorAll('*')].find(x=>x.children.length==0&&/^na fila$/i.test(x.textContent.trim()));if(l)l.textContent=l.textContent.trim()+' · '+n;return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate("()=>window.__LF.inicioGo('est')");w(1500)
            if prop: pg.add_style_tag(content=CSS);pg.evaluate(JS);w(300)
            oo.append(olho(pg));p=T+'e86_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
        print(tema,'novos:',novos(oo[0],oo[1]),sorted(oo[1]))
        prancha('86-app-estudio-botoes-%s.jpg'%tema,'App · Peças › Estúdio · tema %s'%tema,
          ['Hoje: "?" e "×" com 38 px; "Ver todas ›" branco com 22 px de toque e "+ 18 peças" fazem a mesma coisa; "Ficha" em branco sem seta; nomes compridos cortados com "…".',
           'Proposta: "?" e "×" com 44 px · um só "Ver as 24 peças ›" em rosa no fim, título "NA FILA · 24" · "Ficha ›" e "Peça nova ›" em rosa · nome em até 2 linhas · "Começar" continua a principal.'],*fs)
