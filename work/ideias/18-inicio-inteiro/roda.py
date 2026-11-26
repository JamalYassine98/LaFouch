"""IDEIAS 18 — página inicial inteira (dono 26/11 15:25). Usa o simulador e o site de teste do kit (work/kit: sim, prep_site, serve)."""
import os, sys, json
AQ = os.path.dirname(os.path.abspath(__file__)); KIT = os.path.abspath(os.path.join(AQ, '../../kit')); sys.path.insert(0, KIT)
os.chdir(KIT); import kit
from playwright.sync_api import sync_playwright
FORCA = "(()=>{const s=document.createElement('style');s.textContent='*{content-visibility:visible!important}.rv,[data-rv],.reveal{opacity:1!important;transform:none!important}';document.head.appendChild(s);return 1})()"
def abre(pw):
    kit.prep_site(); kit.serve(kit.SITE, kit.PS)
    b, c = kit.ctx(pw); c.add_init_script("localStorage.setItem('lf_lang','pt');try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
    pg = c.new_page(); pg.goto(f'http://localhost:{kit.PS}/?kit=1'); pg.wait_for_timeout(2200); return b, pg
def foto(pg, out, inj=None):
    if inj: pg.evaluate(open(inj).read()); pg.wait_for_timeout(900)
    pg.evaluate(FORCA); h = pg.evaluate('document.documentElement.scrollHeight')
    for y in range(0, h, 600): pg.evaluate(f'scrollTo(0,{y})'); pg.wait_for_timeout(120)
    pg.evaluate('scrollTo(0,0)'); pg.wait_for_timeout(500)
    av = set()
    for y in range(0, h, 700):
        pg.evaluate(f'scrollTo(0,{y})'); pg.wait_for_timeout(250)
        for x in pg.evaluate(open(os.path.join(KIT, 'olho.js')).read()): av.add(f"{x['r']} {x['ex']}")
        for x in pg.evaluate(open(os.path.join(KIT, 'ecom.js')).read()): av.add(x[:160])
    pg.evaluate('scrollTo(0,0)'); pg.evaluate("document.querySelectorAll('a.wa').forEach(e=>e.style.visibility='hidden')"); pg.wait_for_timeout(400)
    pg.screenshot(path=out, full_page=True); return sorted(av)
if __name__ == '__main__':
    modo = sys.argv[1]
    with sync_playwright() as pw:
        b, pg = abre(pw)
        if modo == 'dump':
            print(pg.evaluate("""(()=>{const f=(e,d)=>d>3?'':'  '.repeat(d)+e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(e.className&&typeof e.className=='string'?'.'+e.className.trim().split(/\\s+/).join('.'):'')+(e.children.length?'':' «'+e.textContent.trim().slice(0,30)+'»')+'\\n'+[...e.children].slice(0,3).map(c=>f(c,d+1)).join('');
              return [...document.getElementById('home').children].map(c=>f(c,0)).join('')})()"""))
        else:
            out, inj = sys.argv[2], (sys.argv[3] if len(sys.argv) > 3 else None)
            for a in foto(pg, out, inj): print('DESIGNER', a)
        b.close()
