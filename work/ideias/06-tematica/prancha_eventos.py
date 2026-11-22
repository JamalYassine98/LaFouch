"""IDEIAS 06e · prancha: cada evento, Hoje × Proposta (início, celular). Uso: python3 prancha_eventos.py"""
import os, sys, json
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
sys.path.insert(0, '/home/claude/lafouch/work/kit'); sys.path.insert(0, '/home/claude/lafouch/work/ideias/03-bugs-site')
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
import sim
from abas_video import INIT, rota
AQUI = os.path.dirname(os.path.abspath(__file__)); W, H = 390, 844
EV = [('bf', 'Black Friday'), ('natal', 'Natal'), ('anonovo', 'Ano Novo'), ('maes', 'Dia das Mães'), ('pais', 'Dia dos Pais'), ('halloween', 'Halloween')]
def tira(porta, tema, b):
    c = sim.contexto(b, W, H, toque=True, dpr=2, lingua='pt-BR'); c.add_init_script(INIT)
    def r2(r):
        if '/config/site' in r.request.url:
            return r.fulfill(status=200, content_type='application/json', body=json.dumps({'fields': {'evento': {'mapValue': {'fields': {'tema': {'stringValue': tema}}}}}}))
        return rota(r)
    c.route('**/*', r2); pg = c.new_page(); pg.goto('http://localhost:%d/?cliente=1' % porta); pg.wait_for_timeout(4200)
    f = '/tmp/a6e-%d-%s.png' % (porta, tema); pg.screenshot(path=f); c.close(); return f
with sync_playwright() as pw:
    b = sim.navegador(pw); R = [(t, n, tira(8721, t, b), tira(8735, t, b)) for t, n in EV]; b.close()
FT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; f = ImageFont.truetype(FT, 26); g = ImageFont.truetype(FT, 20)
s = .5; w, hh = int(W * 2 * s), int(H * 2 * s)
for parte, lst in (('1', R[:3]), ('2', R[3:])):
    c = Image.new('RGB', (len(lst) * (2 * w + 70) + 20, hh + 110), 'white'); d = ImageDraw.Draw(c); x = 20
    for t, n, a, p in lst:
        d.text((x, 10), n, font=f, fill='#222'); d.text((x, 48), 'HOJE', font=g, fill='#b3261e'); d.text((x + w + 16, 48), 'PROPOSTA', font=g, fill='#8d3a69')
        c.paste(Image.open(a).resize((w, hh)), (x, 80)); c.paste(Image.open(p).resize((w, hh)), (x + w + 16, 80)); x += 2 * w + 70
    c.save(os.path.join(AQUI, 'esboco-06e-eventos-%s.jpg' % parte), quality=86)
print('ok')
