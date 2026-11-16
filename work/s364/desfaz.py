import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from comum import olho
from playwright.sync_api import sync_playwright
LAP="""()=>{const d=document.getElementById('detail');const lap=[...d.querySelectorAll('button')].find(e=>e.offsetParent&&/ditar/i.test(e.getAttribute('aria-label')||e.title||''));if(!lap)return 'sem lápis';lap.click();return 'lápis'}"""
with sync_playwright() as pw:
    for esc in (True,False):
        b,pg,w=ap.abre(pw,'estoque',esc);er=[];pg.on('pageerror',lambda e:er.append(str(e)));o0=olho(pg)
        n0=pg.evaluate("()=>{const S=window.__LF.S;return [S.items.length,Object.keys(S.fotos).length,S.elog.length,Object.keys(S.site||{}).length]}")
        pg.query_selector_all('#v-estoque .pcard')[2].click();w(1500);pg.evaluate(LAP);w(900)
        pg.evaluate("()=>{const l=document.querySelector('.edLixo');l.scrollIntoView({block:'center'});l.click()}");w(900)
        n1=pg.evaluate("()=>{const S=window.__LF.S;return [S.items.length,Object.keys(S.fotos).length,S.elog.length,Object.keys(S.site||{}).length]}")
        pg.screenshot(path='/tmp/gt/desf_%d.png'%esc);o1=olho(pg)
        t=pg.evaluate("()=>{const t=document.querySelector('[data-prod-toast]');const r=t.getBoundingClientRect();const b=t.querySelector('button').getBoundingClientRect();return [t.innerText.replace(/\\n/g,' '),Math.round(r.top),Math.round(b.width),Math.round(b.height),!!document.getElementById('edLixoAviso'),!!document.getElementById('editModal')&&!document.getElementById('editModal').hidden]}")
        pg.click('[data-act=prodDesfaz]');w(900)
        n2=pg.evaluate("()=>{const S=window.__LF.S;return [S.items.length,Object.keys(S.fotos).length,S.elog.length,Object.keys(S.site||{}).length]}")
        print(esc,n0,n1,n2,t,[x for x in o1-o0][:5],er);b.close()
