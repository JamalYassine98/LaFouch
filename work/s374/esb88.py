# S374 · esboço 88 (dono 17/11 08:43 "Sim" → aba Vender) — Catálogo e peça na padronização de luxo.
# Proposta: ícones do topo (Modo cliente, Ajustes do catálogo, Compartilhar, Voltar) → redondos com contorno de 44 px (como o "+" de
# Clientes/Inventário), sem o fundo cheio · lote sem foto ganha o quadro com ícone de pacote (como no 85) · "−" e "+" da quantidade com 44 px
# (hoje 29 px) · "Vender · G$" continua o principal.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS="""
#v-vendas .mcBtn,#v-vendas .cjIc,#v-vendas .ibtn{width:44px!important;height:44px!important;min-width:44px;border-radius:50%!important;background:none!important;border:1px solid var(--line)!important}
#v-vendas .step{min-width:44px!important;width:44px!important;flex:none}
#v-vendas .step~.go{flex:1 1 100%!important;min-width:0!important;margin-top:8px}
#v-vendas .step:first-child{margin-left:auto}#v-vendas .step:first-child~.step{margin-right:auto}
#v-vendas *:has(>.step~.go){flex-wrap:wrap!important;justify-content:center}
#v-vendas .pbox.lt85{display:grid;place-items:center;background:var(--panel2)!important;border:1px solid var(--line)}
#v-vendas .pbox.lt85 svg{width:56px;height:56px;stroke:var(--sub);fill:none;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
"""
BOX='<svg viewBox="0 0 24 24"><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/></svg>'
JS=r"""(ic)=>{document.querySelectorAll('#v-vendas .pcard').forEach(p=>{const o=p.querySelector('.pbox');if(!o||o.hidden){if(o)o.remove();const d=document.createElement('div');d.className='pbox lt85';d.innerHTML=ic;p.prepend(d)}});return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome in ('a-catalogo','b-peca'):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate("()=>window.__LF.setView('vendas')");w(1500)
                if prop: pg.add_style_tag(content=CSS);pg.evaluate(JS,BOX);w(300)
                if nome=='b-peca':
                    pg.click('#v-vendas .pcard:nth-of-type(2)');w(1200)
                    if prop: pg.evaluate(JS,BOX)
                    pg.evaluate("()=>{const e=document.querySelector('#v-vendas .step').closest('div');const g=[...document.querySelectorAll('#v-vendas *')].find(x=>/^grau/i.test(x.textContent.trim())&&x.children.length==0);scrollTo({top:g.getBoundingClientRect().top+scrollY-260,behavior:'instant'})}");w(300)
                oo.append(olho(pg));p=T+'v88_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]),sorted(oo[1]))
            prancha('88%s-app-vender-botoes-%s.jpg'%(nome,tema),'App · Vender · %s · tema %s'%('catálogo' if nome[0]=='a' else 'peça',tema),
              ['Hoje: ícones do topo em quadrado com fundo cheio (Ajustes do catálogo e Compartilhar com 40 px); lote sem foto mais baixo; "−" e "+" da quantidade com 29 px de largura.',
               'Proposta: ícones redondos com contorno de 44 px (como o "+" de Clientes e Inventário) · lote com o quadro de pacote (como no 85) · "−" e "+" com 44 px e o "Vender · G$" na linha de baixo, largura toda (com 44 px não cabem os dois numa linha) · "Vender · G$" continua o principal.'],*fs)
