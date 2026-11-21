"""Parte B: lista "Escolha o seu formato" com os 8 formatos (Hoje × Proposta), rolada até o fim. Uso: python3 lista8.py"""
import os
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
from playwright.sync_api import sync_playwright
AQUI = os.path.dirname(os.path.abspath(__file__)); __file__ = os.path.join(AQUI, 'captura.py')
exec(open(__file__).read().split('with sync_playwright()')[0])
with sync_playwright() as p:
    br = p.chromium.launch()
    for nome, base in (('hoje', 'http://localhost:8701'), ('prop', 'http://localhost:8702')):
        ctx = br.new_context(viewport={'width': 386, 'height': 858}, device_scale_factor=2, is_mobile=True, has_touch=True)
        ctx.add_init_script(INIT); ctx.route('**/*', rota); pg = ctx.new_page()
        pg.goto(base + '/?cliente=1&r=formato', wait_until='networkidle'); pg.wait_for_timeout(1200)
        pg.evaluate("()=>{const l=[...document.querySelectorAll('#rosto .rzr')];l[l.length-1].scrollIntoView({block:'end'})}"); pg.wait_for_timeout(600)
        pg.screenshot(path=f'{OUT}/l8-{nome}.png'); ctx.close()
    br.close()
