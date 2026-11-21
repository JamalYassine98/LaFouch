"""PC 1440×900: a página do formato usa o carrossel de cartões (com a frase do formato). Hoje em cima, Proposta embaixo.
Só para conferir a diferença (o PC terá design próprio depois). Uso: python3 pc.py → cap/pc-*.png"""
import os
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
from playwright.sync_api import sync_playwright
AQUI = os.path.dirname(os.path.abspath(__file__)); __file__ = os.path.join(AQUI, 'captura.py')
exec(open(__file__).read().split('with sync_playwright()')[0])
with sync_playwright() as p:
    br = p.chromium.launch()
    for nome, base in (('hoje', 'http://localhost:8701'), ('prop', 'http://localhost:8702')):
        ctx = br.new_context(viewport={'width': 1440, 'height': 900}); ctx.add_init_script(INIT); ctx.route('**/*', rota); pg = ctx.new_page()
        pg.goto(base + '/?cliente=1&r=formato', wait_until='networkidle'); pg.wait_for_timeout(2000)
        pg.evaluate("()=>{const e=document.getElementById('fcar');e&&e.scrollIntoView({block:'center'})}"); pg.wait_for_timeout(800)
        pg.screenshot(path=f'{OUT}/pc-{nome}.png'); ctx.close()
    br.close()
