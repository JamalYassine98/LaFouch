# S349 · esboço 31: Inventário — lista + ficha LADO A LADO em tablet e computador. App real; só muda a disposição (CSS). Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
from playwright.sync_api import sync_playwright
CSS="""#v-estoque{display:grid!important;grid-template-columns:%dpx minmax(0,1fr);column-gap:24px;align-items:start}
#v-estoque>.top,#v-estoque>#msg,#v-estoque>#eTabs{grid-column:1/-1}
#v-estoque>#kpisE{display:none!important}
#v-estoque>.main{grid-column:1;grid-row:4;position:sticky;top:12px;max-height:calc(100vh - 24px);overflow-y:auto;overscroll-behavior:contain;min-width:0;padding-right:4px}
#v-estoque>#detail{grid-column:2;grid-row:4;min-width:0;margin-top:0!important}
#v-estoque>#lotes{grid-column:2}
#v-estoque>.main .pcard.esSel{outline:1.5px solid var(--pri);outline-offset:-1.5px}
#v-estoque #listCard{display:block!important;padding:12px!important}#v-estoque #invFix{display:none!important}
#v-estoque #rows>.pcard{display:flex!important;flex-direction:column}#v-estoque #rows>.pcard>:last-child{margin-top:auto}
#v-estoque #rows{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}%s"""
TAB="#v-estoque #detail .detgrid{grid-template-columns:1fr!important}#v-estoque #detail .detgrid>.col:first-child{max-width:260px}"
with sync_playwright() as pw:
    for apn,col,pc in (('pc',372,True),('tablet',316,False)):
        for esc,tema in ((True,'escuro'),(False,'claro')):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'estoque',esc,apn);base0=olho(pg)
                pg.evaluate("()=>{window.__rows=document.getElementById('rows').innerHTML}");pg.query_selector_all('#v-estoque .pcard')[2].click();w(1600)
                if prop:
                    pg.add_style_tag(content=CSS%(col,'' if pc else TAB));pg.evaluate("()=>{document.getElementById('rows').innerHTML=window.__rows}")
                    print('   ',pg.evaluate("""()=>{const v=document.getElementById('v-estoque'),m=v.querySelector(':scope>.main');const ref=(document.querySelector('#detail')||v).innerText.match(/SP\\d+|[A-Z]{2}\\d{3,}/);m.setAttribute('data-coluna','1');document.getElementById('detail').setAttribute('data-coluna','1');const cs=[...m.querySelectorAll('.pcard')];cs.forEach(x=>{if(!x.querySelector('img,svg,picture,.ph,.thumb'))x.style.gridColumn='1 / -1'});const c=cs[2];if(c){c.classList.add('esSel')}
                      scrollTo(0,0);const d=document.getElementById('detail');return [m.getBoundingClientRect().width|0,d.getBoundingClientRect().width|0,cs.length,!!c]}"""))
                    w(500);pg.evaluate("()=>{const d=document.getElementById('detail');d.scrollIntoView({block:'start'});scrollBy(0,-12)}");w(600)
                w(1200);p=T+'lf_%s_%d_%d.png'%(apn,esc,prop);pg.screenshot(path=p);fs.append(p);o=olho(pg)
                if not prop:
                    pg.evaluate("()=>scrollTo(0,0)");w(500);o|=olho(pg)|base0
                else: print('   medidas:',pg.evaluate("()=>[...document.querySelectorAll('#detail .fiBtn,#detail .fnTab')].filter(e=>e.offsetParent).map(e=>e.innerText.trim().slice(0,8)+' '+(e.getBoundingClientRect().width|0)+'x'+(e.getBoundingClientRect().height|0)).join(' · ')"))
                oo.append(o);b.close()
            print('lista+ficha',apn,tema,'achados novos:',novos(*oo),'| fileira torta hoje:',[x for x in oo[0] if 'fileira' in x])
            prancha('31-%s-inventario-lista-e-ficha-%s.jpg'%(apn,tema),'App · %s · Inventário com uma peça aberta · tema %s'%('Computador' if pc else 'Tablet',tema),
              ['Hoje: a ficha toma a tela toda; para ver outra peça é preciso voltar à lista.','Proposta: a lista fica à esquerda e a ficha à direita; tocar em outra peça troca a ficha sem sair do lugar.'],*fs,pc=pc)
