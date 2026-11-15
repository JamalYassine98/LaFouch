# S352: Giro › "Vitrine da semana" — o dono disse que não funciona. Mede o campo e tenta usar (digitar 12 e Salvar). Celular, app real.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True);pg.evaluate("()=>{const L=window.__LF;L.S.dTab='giro';L.setView('dash')}");w(1500)
    print('abrir:',pg.evaluate("()=>{const s=[...document.querySelectorAll('#v-dash *')].find(e=>e.children.length<4&&/^Vitrine da semana/.test((e.innerText||'').trim()));if(!s)return 'sem bloco';const bt=s.closest('button,summary,[data-act],[role=button]')||s;bt.scrollIntoView({block:'center'});bt.click();return bt.tagName+' '+(bt.getAttribute('data-act')||'')}"));w(900)
    M="()=>{const i=[...document.querySelectorAll('#v-dash input')].filter(e=>e.offsetParent&&e.getBoundingClientRect().width<80)[0];if(!i)return null;const r=i.getBoundingClientRect(),s=getComputedStyle(i),p=i.parentElement,ps=getComputedStyle(p);const bt=[...p.querySelectorAll('button')].map(x=>x.innerText+' '+(x.getBoundingClientRect().width|0)+'px flex:'+getComputedStyle(x).flex);return {id:i.id,tipo:i.type,larg:r.width|0,alt:r.height|0,flex:s.flex,width:s.width,minW:s.minWidth,classe:i.className,pai:p.className+' display:'+ps.display,botoes:bt,valor:i.value}}"
    print('campo:',pg.evaluate(M))
    i=pg.query_selector('#v-dash input:visible') ;ins=[x for x in pg.query_selector_all('#v-dash input') if x.is_visible() and x.bounding_box()['width']<80]
    if ins:
        ins[0].tap();w(300);pg.keyboard.type('12');w(300);print('depois de digitar:',pg.evaluate(M)['valor'])
        print('salvar:',pg.evaluate("()=>{const i=[...document.querySelectorAll('#v-dash input')].filter(e=>e.offsetParent&&e.getBoundingClientRect().width<80)[0];const b=[...i.parentElement.querySelectorAll('button')].find(x=>/Salvar/.test(x.innerText));b.click();return b.getAttribute('data-act')}"));w(1200)
        print('resultado:',pg.evaluate("()=>{const s=[...document.querySelectorAll('#v-dash *')].find(e=>e.children.length<4&&/^Vitrine da semana/.test((e.innerText||'').trim()));const c=s.closest('section,details,.card')||s.parentElement.parentElement;return (c.innerText+' || '+((c.nextElementSibling||{}).innerText||'')).replace(/\\s+/g,' ').slice(0,420)}"))
        pg.screenshot(path='/tmp/s352/vit.png')
    b.close()
