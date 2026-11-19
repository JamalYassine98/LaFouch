# S430 estilos: passa pelos estados da cópia (porta 8040, com data-lfsi nos <style>) e junta o que cada declaração faz.
# uso: python3 roda.py medir   → mede.json  |  python3 roda.py foto <porta> <saida.json>  → impressão digital dos estilos de cada estado
import json, sys, hashlib
sys.path.insert(0, '/home/claude/lafouch/work/s430/cob')
from playwright.sync_api import sync_playwright
src = open('/home/claude/lafouch/work/s430/cob/cob.py').read()
ns = {}; exec(src.split('EVS=')[0].split('with sync_playwright')[0], ns)
ROT, init = ns['ROT'], ns['init']
EVS = ['natal', 'halloween', 'bf', 'anonovo-d', 'anonovo-n', 'maes', 'pais']
TAM = [(386, 858), (844, 390), (768, 1024), (1440, 900), (2560, 1440)]
MOV = ['no-preference', 'reduce']
R = json.load(open('/home/claude/lafouch/work/s430/est/regras.json'))
CAS = open('/home/claude/lafouch/work/s430/est/cascata.js').read()
FOTO = """()=>{const out=[];for(const el of document.querySelectorAll('body *')){const s=getComputedStyle(el);let t='';for(let i=0;i<s.length;i++){const n=s[i];t+=n+':'+s.getPropertyValue(n)+';'}
 for(const ps of ['::before','::after']){const p=getComputedStyle(el,ps);if(p.content&&p.content!=='none'&&p.content!=='normal'){for(let i=0;i<p.length;i++){const n=p[i];t+=ps+n+':'+p.getPropertyValue(n)+';'}}}
 t=t.replace(/localhost:\d+/g,'');let h=2166136261;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)>>>0}let pth='';for(let x=el;x&&x!==document.body;x=x.parentElement){let i=0,s=x;while((s=s.previousElementSibling))if(s.tagName===x.tagName)i++;pth=(x.id?'#'+x.id:x.tagName+i)+'/'+pth;if(x.id)break}out.push(pth+'|'+h)}return out}"""
def estados():
    for W, H in TAM:
        for url, acts in ROT:
            for log in ([False, True] if 'contabtn' in ''.join(acts) or url == '' else [False]):
                yield W, H, url, acts, log
        for ev in EVS: yield W, H, '?evp=' + ev, [], False
def main():
    modo = sys.argv[1]; porta = sys.argv[2] if len(sys.argv) > 2 else '8040'
    M, Wn, O, X = set(), set(), set(), set(); fot = {}
    with sync_playwright() as p:
        b = p.chromium.launch()
        for k, (W, H, url, acts, log, mv) in enumerate((e + (mv,)) for e in estados() for mv in (MOV if modo == 'medir' else ['reduce'])):
            c = b.new_context(viewport={'width': W, 'height': H}, is_mobile=W < 1000 or H < 500, has_touch=W < 1000 or H < 500, reduced_motion=mv); c.add_init_script(init(log))
            pg = c.new_page()
            try:
                pg.goto('http://localhost:%s/' % porta + url, wait_until='load'); pg.wait_for_timeout(2200)
                pg.evaluate("()=>{var m=document.getElementById('manut');m&&m.remove()}")
                def mede():
                    if modo == 'medir':
                        r = pg.evaluate(CAS, R); M.update(r['m']); Wn.update(r['w']); O.update(r['o']); X.update(r['x'])
                for a in acts:
                    mede()
                    try: pg.evaluate("()=>{" + a + "}")
                    except Exception: pass
                    pg.wait_for_timeout(1500)
                mede()
                if modo == 'foto':
                    pg.wait_for_timeout(3500);pg.evaluate("()=>{try{document.getAnimations().forEach(a=>{try{a.finish()}catch(e){}})}catch(e){}}");pg.wait_for_timeout(400)
                    fot['%d %dx%d %s %s %s' % (k, W, H, url, '|'.join(acts)[:60], log)] = pg.evaluate(FOTO)
            except Exception as e:
                print('falhou', W, url, e)
            c.close()
        b.close()
    if modo == 'medir':
        json.dump({'m': sorted(M), 'w': sorted(Wn), 'o': sorted(O), 'x': sorted(X)}, open('mede.json', 'w'))
        print('casaram', len(M), 'ganharam', len(Wn), 'perderam p/ outra', len(O))
    else:
        json.dump(fot, open(sys.argv[3], 'w')); print('estados', len(fot))
main()
