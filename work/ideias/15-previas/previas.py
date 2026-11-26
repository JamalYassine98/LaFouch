"""IDEIAS 15 · prévias de link (WhatsApp): HOJE × PROPOSTA, grande (1200×630) e o quadradinho do meio (630×630).
Base: as prévias reais do catalogo (og/ e p/) e as fotos reais das peças. Proposta: fundo branco, logo oficial
(#943d6f, aprovado 87), peça grande, um título em Fraunces 600, tudo dentro do quadrado do meio.
Uso: python3 previas.py <pasta do catalogo>"""
import sys, os, base64, io
from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright
CAT = sys.argv[1]; AQ = os.path.dirname(os.path.abspath(__file__))
FR = os.path.join(AQ, '../../argus/motor/letras/site/fraunces-latin-600-normal.woff2')
OFICIAL = (0x94, 0x3d, 0x6f); TX = '#2a1f27'; MU = '#6b5a66'

def b64(im):
    b = io.BytesIO(); im.save(b, 'PNG'); return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()

def logo():  # o desenho do logo do site, pintado na cor oficial
    im = Image.open(os.path.join(CAT, 'media/i/926f9307ba28.png')).convert('RGBA')
    a = im.getchannel('A'); c = Image.new('RGBA', im.size, OFICIAL + (255,)); c.putalpha(a)
    return c.crop(a.getbbox())

def peca(ref):  # a peça real, recortada do branco da prévia de hoje
    im = Image.open(os.path.join(CAT, 'p/%s.jpg' % ref)).convert('RGB')
    g = im.convert('L').point(lambda v: 255 if v < 244 else 0)
    return im.crop(g.getbbox())

PROPOSTAS = [  # (nome, hoje, peça, título, linha pequena)
    ('1-inicio-pt', 'og/inicio-pt.jpg', 'AC1050', 'Óculos de sol e de grau', 'lafouch.com · Ciudad del Este'),
    ('2-inicio-es', 'og/inicio-es.jpg', 'AC1050', 'Lentes de sol y recetados', 'lafouch.com · Ciudad del Este'),
    ('3-sol-feminino', 'og/solar-f.jpg', 'SL2265', 'Solar · Feminino', 'lafouch.com'),
    ('4-peca-AC1050', 'p/AC1050.jpg', 'AC1050', 'Armação quadrada', 'AC1050 · lafouch.com'),
    ('5-grau', 'og/mochi-pt.jpg', 'BR44145', 'Descubra o seu grau', 'em 1 minuto, pelo celular'),
]
HTML = """<html><head><style>@font-face{font-family:F;src:url('%s') format('woff2');font-weight:600}
html,body{margin:0;width:1200px;height:630px;background:#fff;overflow:hidden}
.q{position:absolute;left:285px;top:0;width:630px;height:630px;display:flex;flex-direction:column;align-items:center}
.lg{height:84px;margin-top:36px}
.pc{flex:1;display:flex;align-items:center;justify-content:center;width:560px}
.pc img{max-width:520px;max-height:230px}
h1{font:600 46px/1 F;color:%s;margin:0 0 14px;letter-spacing:-.01em;white-space:nowrap}
p{font:600 20px/1 F;color:%s;margin:0 0 44px;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}
</style></head><body><div class=q><img class=lg src="%s"><div class=pc><img src="%s"></div><h1>%s</h1><p>%s</p></div></body></html>"""

def quadrado(im):
    w, h = im.size; return im.crop(((w - h) // 2, 0, (w + h) // 2, h))

def prancha(nome, hoje, prop):
    W = 1200 + 24 + 315; H = 630 // 2
    fh = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
    pr = Image.new('RGB', (W * 1 // 1, (H + 40) * 2 + 20), '#e9e4e8'); d = ImageDraw.Draw(pr)
    for i, (rot, im) in enumerate((('HOJE', hoje), ('PROPOSTA', prop))):
        y = i * (H + 40 + 10) + 36
        d.text((8, y - 30), rot + ' · grande (como chega no WhatsApp)  +  quadradinho do meio', fill='#943d6f' if i else '#555', font=fh)
        pr.paste(im.resize((600, 315)), (8, y)); pr.paste(quadrado(im).resize((315, 315)), (8 + 600 + 24, y))
    return pr.crop((0, 0, 8 + 600 + 24 + 315 + 8, pr.size[1]))

LG = b64(logo())
FONTE = 'data:font/woff2;base64,' + base64.b64encode(open(FR, 'rb').read()).decode()
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 1200, 'height': 630})
    for nome, hoje, ref, tit, sub in PROPOSTAS:
        pg.set_content(HTML % (FONTE, TX, MU, LG, b64(peca(ref)), tit, sub))
        pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(500)
        assert pg.evaluate("document.fonts.check('600 46px F')"), 'Fraunces não carregou'
        # tudo dentro do quadrado do meio (285..915)
        fora = pg.evaluate("[...document.querySelectorAll('.q *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.left<285||r.right>915)}).map(e=>e.tagName+':'+e.textContent)")
        assert not fora, ('fora do quadrado', nome, fora)
        png = pg.screenshot(); prop = Image.open(io.BytesIO(png)).convert('RGB'); prop.save('prop-%s.jpg' % nome, quality=92)
        prancha(nome, Image.open(os.path.join(CAT, hoje)).convert('RGB'), prop).save('esboco-15-%s.jpg' % nome, quality=88)
        print('ok', nome)
    b.close()
