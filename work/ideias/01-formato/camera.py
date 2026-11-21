"""Tela da câmera: Hoje (como está) × Proposta (mesma tela; perto ou com a cabeça torta mede assim mesmo; só 'medindo' e o caso extremo).
Câmera falsa do Chromium (imagem de teste, sem rosto). Na Proposta os avisos são escritos por cima (pintura) para
mostrar as 3 situações novas. Uso: python3 camera.py → cap/cam-*.png
"""
import os, json
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
from playwright.sync_api import sync_playwright
AQUI = os.path.dirname(os.path.abspath(__file__)); __file__ = os.path.join(AQUI, 'captura.py')
exec(open(__file__).read().split('with sync_playwright()')[0])

PROP = [('virado', 'Vire o rosto para a câmera'),
        ('medindo', 'Medindo… fique parado')]
with sync_playwright() as p:
    br = p.chromium.launch(args=['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'])
    for nome, base in (('hoje', 'http://localhost:8701'), ('prop', 'http://localhost:8702')):
        ctx = br.new_context(viewport={'width': 386, 'height': 858}, device_scale_factor=2, is_mobile=True, has_touch=True, permissions=['camera'])
        ctx.add_init_script(INIT); ctx.route('**/*', rota); pg = ctx.new_page()
        pg.goto(base + '/?cliente=1&r=formato', wait_until='networkidle'); pg.wait_for_timeout(1200)
        pg.click('#rosto [data-fa]'); pg.wait_for_timeout(700)
        pg.click('[data-facam]'); pg.wait_for_timeout(6000)
        if nome == 'hoje':
            pg.screenshot(path=f'{OUT}/cam-hoje.png'); print('hoje:', pg.evaluate("()=>document.getElementById('camm').textContent"))
        else:
            for k, t in PROP:
                pg.evaluate("t=>{const e=document.getElementById('camm');e.style.display='none';let c=document.getElementById('cammP');if(!c){c=e.cloneNode();c.id='cammP';c.style.display='';e.after(c)}c.textContent=t}", t)
                if k == 'medindo': pg.evaluate("()=>{const w=document.getElementById('camw');w.classList.add('ok');w.classList.toggle=()=>{}}")
                pg.wait_for_timeout(300); pg.screenshot(path=f'{OUT}/cam-prop-{k}.png')
        ctx.close()
    br.close()
