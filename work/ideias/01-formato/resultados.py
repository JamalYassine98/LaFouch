"""Parte B: resultado da Proposta para outros formatos (as 3 melhores, com tamanho e gênero). Uso: python3 resultados.py → cap/rb-*.png"""
import os, json
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
from playwright.sync_api import sync_playwright
AQUI = os.path.dirname(os.path.abspath(__file__)); __file__ = os.path.join(AQUI, 'captura.py')
exec(open(__file__).read().split('with sync_playwright()')[0])
CASOS = [('redondo', '', 138), ('quadrado', 'm', 146), ('retangular', 'f', 128)]
out = {}
with sync_playwright() as p:
    br = p.chromium.launch()
    for id_, g, w in CASOS:
        ctx = br.new_context(viewport={'width': 386, 'height': 858}, device_scale_factor=2, is_mobile=True, has_touch=True)
        ctx.add_init_script(INIT); ctx.route('**/*', rota); pg = ctx.new_page()
        pg.goto('http://localhost:8702/?cliente=1&r=formato', wait_until='networkidle'); pg.wait_for_timeout(1200)
        pg.evaluate(MONTA.replace("const res=F.shape(m); res.mm={w:138,pd:63,iris:20};", "const res=F.shape(m); res.id='%s';res.close=false; res.mm={w:%d,pd:63,iris:20};" % (id_, w)), CANON)
        pg.wait_for_timeout(700)
        if g: pg.click('[data-fagen="%s"]' % g); pg.wait_for_timeout(500)
        pg.screenshot(path=f'{OUT}/rb-{id_}.png')
        out[id_] = pg.evaluate("()=>[...document.querySelectorAll('.fatop .hc')].map(c=>c.dataset.open)")
        ctx.close()
    br.close()
print(json.dumps(out))
