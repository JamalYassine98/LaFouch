# S374 · esboço 89 (dono 17/11 08:52: "Não gostei do botão ver ficha no inventário, e está num lugar que considero feio").
# Em cima do 88. Hoje: "Ver a ficha no Inventário ›" solto no topo, entre "Catálogo › código" e o "‹ Vender".
# Proposta: sai do topo; vira linha rosa discreta "Ficha no Inventário ›" no fim da peça, logo antes de "Parecidas"
# (mesmo jeito de "Peça nova ›" e "Lotes de atacado ›"). O topo fica: "Catálogo › código · 2 de 16" e "‹ Vender ... compartilhar".
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
s88=open('/home/claude/lafouch/work/s374/esb88.py').read()
CSS=s88.split('CSS="""')[1].split('"""')[0]+"""
#v-vendas .fnAt{display:none!important}
#v-vendas .fi89{display:block;margin:6px auto 0;min-height:44px;background:none;border:0;color:var(--accent-fg);font:inherit;font-size:15px;font-weight:600}
"""
JS2=r"""()=>{const h=document.getElementById('vDetail'),p=h.querySelector('.vPar');const b=document.createElement('button');b.type='button';b.className='fi89';b.textContent='Ficha no Inventário ›';if(p)p.before(b);else h.appendChild(b);return !!p}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome in ('a-topo','b-fim'):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate("()=>window.__LF.setView('vendas')");w(1500)
                pg.add_style_tag(content=CSS.split('#v-vendas .fnAt')[0])
                pg.click('#v-vendas .pcard:nth-of-type(2)');w(1200)
                if prop: pg.add_style_tag(content=CSS);pg.evaluate(JS2);w(300)
                if nome=='b-fim': pg.evaluate("()=>{const e=document.querySelector('#vDetail .vPar');scrollTo({top:e.getBoundingClientRect().top+scrollY-560,behavior:'instant'})}");w(300)
                else: pg.evaluate("()=>{const e=document.getElementById('vDetail');scrollTo({top:e.getBoundingClientRect().top+scrollY-150,behavior:'instant'})}");w(300)
                oo.append(olho(pg));p=T+'v89_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]),sorted(oo[1]))
            prancha('89%s-app-vender-ficha-%s.jpg'%(nome,tema),'App · Vender · peça · "Ver a ficha" · %s · tema %s'%('topo' if nome[0]=='a' else 'fim da peça',tema),
              ['Esquerda = 88: "Ver a ficha no Inventário ›" solto no topo, entre "Catálogo › código" e o "‹ Vender".',
               'Proposta: sai do topo; vira linha rosa "Ficha no Inventário ›" no fim da peça, antes de "Parecidas" (como "Peça nova ›"). O topo fica só com o caminho e o "‹ Vender".'],*fs)
