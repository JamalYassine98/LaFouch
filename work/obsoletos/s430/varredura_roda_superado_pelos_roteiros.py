"""Varredura de código morto com o site RODANDO (CLAUDE.md regra 12d).
Abre cada tela em celular e PC, toca em tudo o que é clicável (uma coisa por vez, voltando ao começo),
e anota quais funções do lf-site.js foram executadas de verdade. O que nunca rodou em tela nenhuma é candidato a morto.
uso: roda.py URL saida.json"""
import sys, json, re
from playwright.sync_api import sync_playwright
URL, OUT = sys.argv[1], sys.argv[2]
INIT = "try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}"
ROTAS = ['/?cliente=1', '/?cliente=1&r=armazones', '/?cliente=1&r=lentes-de-sol', '/?cliente=1#rosto', '/?cliente=1#atacado', '/?cliente=1#como', '/p/AC1050?cliente=1']
ALVOS = """()=>{const L=[...document.querySelectorAll('button,a,[data-open],[data-cta],[role=button],summary,input[type=checkbox],select,label[for]')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'&&!/^(mailto|tel|https?:\\/\\/(?!localhost))/.test(e.getAttribute('href')||'')&&!/wa\\.me|whatsapp|maps|instagram/.test(e.getAttribute('href')||'')});
 const vistos=new Set(),out=[];L.forEach((e,i)=>{const k=(e.id||'')+'|'+(e.getAttribute('data-cta')||'')+'|'+(e.getAttribute('data-mf')||'')+'|'+e.className+'|'+(e.getAttribute('href')||'')+'|'+e.textContent.trim().slice(0,16);if(vistos.has(k))return;vistos.add(k);e.setAttribute('data-vr',out.length);out.push(k)});return out}"""
usadas = {}; tot = {}; cliques = 0
def colhe(cdp):
    r = cdp.send('Profiler.takePreciseCoverage')
    for s in r['result']:
        if 'lf-site.js' not in s['url']: continue
        for f in s['functions']:
            k = (f['functionName'], f['ranges'][0]['startOffset'], f['ranges'][0]['endOffset'])
            tot[k] = 1
            if f['ranges'][0]['count'] > 0: usadas[k] = 1
def passo(pg, cdp, fn):
    try: fn()
    except Exception: pass
    try: colhe(cdp)
    except Exception: pass
with sync_playwright() as p:
    b = p.chromium.launch()
    for w, h, mob in ((386, 858, True), (1440, 900, False)):
        c = b.new_context(viewport={'width': w, 'height': h}, is_mobile=mob, has_touch=mob, reduced_motion='reduce'); c.add_init_script(INIT)
        c.route('**cloudfunctions.net/**', lambda r: r.fulfill(json={'ok': False}))
        pg = c.new_page(); cdp = c.new_cdp_session(pg); cdp.send('Profiler.enable'); cdp.send('Profiler.startPreciseCoverage', {'callCount': True, 'detailed': False})
        for rota in ROTAS:
            def abre():
                pg.goto(URL + rota, wait_until='load'); pg.wait_for_timeout(3500)
            passo(pg, cdp, abre)
            passo(pg, cdp, lambda: (pg.evaluate("async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,80))}scrollTo(0,0)}"), pg.wait_for_timeout(300)))
            try: n = len(pg.evaluate(ALVOS))
            except Exception: n = 0
            for i in range(min(n, 70)):
                def toca(i=i):
                    global cliques
                    pg.goto(URL + rota, wait_until='load'); pg.wait_for_timeout(1800); pg.evaluate(ALVOS)
                    e = pg.query_selector(f'[data-vr="{i}"]')
                    if not e: return
                    e.scroll_into_view_if_needed(timeout=1500); e.click(timeout=1500, force=True); cliques += 1; pg.wait_for_timeout(900)
                    # dentro do que abriu: toca em cada coisa nova uma vez (segundo nível)
                    for x in pg.query_selector_all('#layer button, #layer a, #layer [data-cta], #drw a, #sov button')[:14]:
                        try:
                            if x.is_visible() and not re.search(r'wa\.me|whatsapp|mailto|tel:', x.get_attribute('href') or ''): x.click(timeout=800, force=True); cliques += 1; pg.wait_for_timeout(350)
                        except Exception: pass
                    pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
                passo(pg, cdp, toca)
            print(w, rota, n, 'alvos · funções executadas até agora:', len(usadas), 'de', len(tot), flush=True)
        c.close()
    b.close()
json.dump({'cliques': cliques, 'total': len(tot), 'usadas': len(usadas), 'nunca': sorted([list(k) for k in tot if k not in usadas], key=lambda k: k[1])}, open(OUT, 'w'), ensure_ascii=False)
print('FIM', cliques, 'toques ·', len(usadas), 'de', len(tot), 'funções executadas')
