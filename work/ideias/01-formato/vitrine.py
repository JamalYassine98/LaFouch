"""Escolher um formato na lista (Diamante e Coração) → catálogo com o aviso do formato. Hoje × Proposta.
Uso: python3 vitrine.py → cap/vit-*.png"""
import os, json
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
from playwright.sync_api import sync_playwright
AQUI = os.path.dirname(os.path.abspath(__file__)); __file__ = os.path.join(AQUI, 'captura.py')
exec(open(__file__).read().split('with sync_playwright()')[0])
out = {}
with sync_playwright() as p:
    br = p.chromium.launch()
    for nome, base in (('hoje', 'http://localhost:8701'), ('prop', 'http://localhost:8702')):
        for face in ('diamante', 'coracao', 'alongado'):
            ctx = br.new_context(viewport={'width': 386, 'height': 858}, device_scale_factor=2, is_mobile=True, has_touch=True)
            ctx.add_init_script(INIT); ctx.route('**/*', rota); pg = ctx.new_page()
            pg.goto(base + '/?cliente=1&r=formato', wait_until='networkidle'); pg.wait_for_timeout(1200)
            if face == 'diamante':
                pg.evaluate("()=>document.querySelector('#rosto .rzr[data-face=diamante]').scrollIntoView({block:'end'})"); pg.wait_for_timeout(600)
                pg.screenshot(path=f'{OUT}/lista-{nome}-fim.png')
            sel = '#rosto .rzr[data-face="%s"]' % face
            pg.locator(sel).tap(); pg.wait_for_timeout(2500); out[nome + '-' + face + '-1toque'] = pg.url
            if nome == 'hoje':
                pg.screenshot(path=f'{OUT}/vit-hoje-{face}-1toque.png'); pg.locator(sel).tap(); pg.wait_for_timeout(2500)
            pg.screenshot(path=f'{OUT}/vit-{nome}-{face}.png')
            out[nome + '-' + face] = pg.url, pg.evaluate("()=>{const r=document.getElementById('resultado');return {res:r?r.innerText:'',cards:[...document.querySelectorAll('#grid .card')].filter(c=>c.offsetParent).length}}")
            ctx.close()
    br.close()
print(json.dumps(out, ensure_ascii=False, indent=1))
