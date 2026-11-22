"""IDEIAS 06 · prancha simples: Dia das Mães e Dia dos Pais, Hoje × Proposta (celular): início e menu aberto."""
import os, sys, json
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
sys.path.insert(0, '/home/claude/lafouch/work/kit'); sys.path.insert(0, '/home/claude/lafouch/work/ideias/03-bugs-site')
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
import sim
from abas_video import INIT, rota
AQUI = os.path.dirname(os.path.abspath(__file__)); W, H = 390, 844
def tira(porta, tema):
    with sync_playwright() as pw:
        b = sim.navegador(pw); c = sim.contexto(b, W, H, toque=True, dpr=2, lingua='pt-BR'); c.add_init_script(INIT)
        def r2(r):
            if '/config/site' in r.request.url:
                return r.fulfill(status=200, content_type='application/json', body=json.dumps({'fields': {'evento': {'mapValue': {'fields': {'tema': {'stringValue': tema}}}}}}))
            return rota(r)
        c.route('**/*', r2); pg = c.new_page(); pg.goto('http://localhost:%d/?cliente=1' % porta); pg.wait_for_timeout(5500)
        a = '/tmp/a6s-%d-%s-0.png' % (porta, tema); pg.screenshot(path=a)
        pg.tap('#mnb'); pg.wait_for_timeout(1300); m = '/tmp/a6s-%d-%s-m.png' % (porta, tema); pg.screenshot(path=m)
        c.close(); b.close()
    return [a, m]
T = [('maes', 'DIA DAS MÃES'), ('pais', 'DIA DOS PAIS')]
FT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; f = ImageFont.truetype(FT, 30); g = ImageFont.truetype(FT, 24)
s = 0.55; w, hh = int(W * 2 * s), int(H * 2 * s)
c = Image.new('RGB', (w * 4 + 30 * 3 + 80, (hh + 110) * 2 + 20), 'white'); d = ImageDraw.Draw(c)
for r, (porta, lab, cor) in enumerate(((8721, 'HOJE', '#b3261e'), (8727, 'PROPOSTA', '#8d3a69'))):
    y = 10 + r * (hh + 110); d.text((20, y), lab, font=f, fill=cor); x = 20
    for k, (t, nome) in enumerate(T):
        im = tira(porta, t)
        d.text((x, y + 44), nome, font=g, fill='#222')
        for fn in im: c.paste(Image.open(fn).resize((w, hh)), (x, y + 80)); x += w + 30
        x += 20
c.save(os.path.join(AQUI, 'esboco-06-maes-pais.jpg'), quality=86); print('ok')
