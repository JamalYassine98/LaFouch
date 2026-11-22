"""IDEIAS 06 · prancha Hoje × Proposta de um tema (celular 390). Uso: python3 prancha.py natal"""
import os, sys, json
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
sys.path.insert(0, '/home/claude/lafouch/work/kit'); sys.path.insert(0, '/home/claude/lafouch/work/ideias/03-bugs-site')
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
import sim
from abas_video import INIT, rota
AQUI = os.path.dirname(os.path.abspath(__file__))
TEMA = sys.argv[1] if len(sys.argv) > 1 else 'natal'
W, H = 390, 844
def tira(porta, nome):
    out = []
    with sync_playwright() as pw:
        b = sim.navegador(pw); c = sim.contexto(b, W, H, toque=True, dpr=2, lingua='pt-BR'); c.add_init_script(INIT)
        def r2(r):
            if '/config/site' in r.request.url:
                return r.fulfill(status=200, content_type='application/json', body=json.dumps({'fields': {'evento': {'mapValue': {'fields': {'tema': {'stringValue': TEMA}}}}}}))
            return rota(r)
        c.route('**/*', r2); pg = c.new_page(); pg.goto('http://localhost:%d/?cliente=1' % porta); pg.wait_for_timeout(5500)
        for i, y in enumerate((0, 760, 1520, 2400)):
            pg.evaluate("y=>window.scrollTo({top:y,behavior:'instant'})", y); pg.wait_for_timeout(700)
            f = '/tmp/a6-%s-%s-%d.png' % (nome, TEMA, i); pg.screenshot(path=f); out.append(f)
        pg.evaluate("window.scrollTo({top:0,behavior:'instant'})"); pg.wait_for_timeout(400)
        pg.tap('#mnb'); pg.wait_for_timeout(1300); f = '/tmp/a6-%s-%s-m.png' % (nome, TEMA); pg.screenshot(path=f); out.append(f)
        c.close(); b.close()
    return out
PP = int(os.environ.get('PP', '8727')); h = tira(8721, 'hoje'); p = tira(PP, 'prop')
FT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; f = ImageFont.truetype(FT, 34)
s = 0.5; w, hh = int(W * 2 * s), int(H * 2 * s)
c = Image.new('RGB', (w * len(h) + 20 * (len(h) + 1), (hh + 70) * 2 + 10), 'white'); d = ImageDraw.Draw(c)
for r, (lista, lab, cor) in enumerate(((h, 'HOJE', '#b3261e'), (p, os.environ.get('ROT', 'PROPOSTA (campanha)'), '#8d3a69'))):
    y = 10 + r * (hh + 70); d.text((20, y), '%s · %s' % (TEMA.upper(), lab), font=f, fill=cor)
    for i, fn in enumerate(lista): c.paste(Image.open(fn).resize((w, hh)), (20 + i * (w + 20), y + 55))
c.save(os.path.join(AQUI, os.environ.get('SAIDA', 'esboco-06-%s.jpg' % TEMA)), quality=86); print('ok')
