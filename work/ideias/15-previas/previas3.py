"""IDEIAS 15c · prévias de link no padrão de luxo (estudo 16): atmosfera CLARA = o rosé suave de hoje
(luz diagonal #fcf3f8 → #f2dce8, medida na prévia do Início no ar), peça real grande em três-quartos
(fotos do catálogo, dados/f), logo na cor oficial #943d6f com presença, nenhuma frase na imagem,
tudo dentro do quadrado do meio. Mostra também como chega no WhatsApp (título + descrição embaixo).
Uso: python3 previas3.py <catalogo>"""
import sys, os, glob, io, base64
from PIL import Image, ImageDraw, ImageChops, ImageFont
from playwright.sync_api import sync_playwright
CAT = sys.argv[1]; W, H = 1200, 630; Q0, Q1 = 285, 915
R = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../..'))
C0, C1 = (0xfc, 0xf3, 0xf8), (0xf2, 0xdc, 0xe8); OF = (0x94, 0x3d, 0x6f)

def fundo():  # luz diagonal 135°: claro no alto à esquerda, rosé embaixo à direita
    gy = Image.linear_gradient('L').resize((W, H)); gx = Image.linear_gradient('L').rotate(90).resize((W, H))
    g = ImageChops.add(gx, gy, scale=2)  # (x/W + y/H)/2: 0 no alto-esq → 255 embaixo-dir
    return Image.composite(Image.new('RGB', (W, H), C1), Image.new('RGB', (W, H), C0), g)

def logo(h):
    im = Image.open(os.path.join(CAT, 'media/i/926f9307ba28.png')).convert('RGBA'); a = im.getchannel('A')
    c = Image.new('RGBA', im.size, OF + (255,)); c.putalpha(a); c = c.crop(a.getbbox())
    return c.resize((round(c.width * h / c.height), h), Image.LANCZOS)

def peca(ref):
    f = glob.glob(os.path.join(CAT, 'dados/f/%s_*.jpg' % ref))[0]; im = Image.open(f).convert('RGB')
    g = im.convert('L').point(lambda v: 255 if v < 246 else 0); return im.crop(g.getbbox())

def proposta(ref):
    bg = fundo(); p = peca(ref)
    k = min(580 / p.width, 250 / p.height); p = p.resize((round(p.width * k), round(p.height * k)), Image.LANCZOS)
    cam = Image.new('RGB', (W, H), (255, 255, 255)); x = (W - p.width) // 2; y = 392 - p.height // 2
    cam.paste(p, (x, y)); bg = ImageChops.multiply(bg, cam)   # rosé quase branco: a peça mantém o brilho
    lg = logo(92); bg.paste(lg, ((W - lg.width) // 2, 64), lg)
    assert x >= Q0 and x + p.width <= Q1, ('peça fora do quadrado', ref)
    return bg

def q(im): return im.crop((Q0, 0, Q1, H))
def b64(im):
    b = io.BytesIO(); im.save(b, 'JPEG', quality=90); return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()

ZAP = """<html><head><style>body{margin:0;background:#e6ddd6;font:15px Arial;width:420px;padding:16px}
.b{background:#fff;border-radius:10px;padding:4px;box-shadow:0 1px 1px #0002;max-width:360px;margin-left:auto}
.b img{width:100%%;border-radius:7px;display:block}.t{font-weight:bold;margin:8px 6px 2px;color:#111}.d{margin:0 6px 4px;color:#555;font-size:13.5px}
.u{margin:0 6px 6px;color:#888;font-size:12.5px}.m{margin:6px;color:#0a6ab0;font-size:14px}
.p{display:flex;gap:8px;background:#f2f2f2;border-radius:7px;padding:6px;margin-top:14px}.p img{width:84px;height:84px;object-fit:cover;border-radius:5px}</style></head>
<body><div class=b><img src="%s"><div class=t>%s</div><div class=d>%s</div><div class=u>lafouch.com</div><div class=m>%s</div></div>
<div class=b style="margin-top:14px"><div class=p><img src="%s"><div><div class=t style="margin:2px 0">%s</div><div class=d style="margin:0">%s</div><div class=u style="margin:2px 0">lafouch.com</div></div></div></div></body></html>"""

def prancha(nome, hoje, prop, zap):
    f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
    pr = Image.new('RGB', (8 + 600 + 16 + 315 + 16 + 452 + 8, 2 * 365 + 20), '#e9e4e8'); d = ImageDraw.Draw(pr)
    for i, (rot, im, cor) in enumerate((('HOJE', hoje, '#555'), ('PROPOSTA · rosé suave, só a foto', prop, '#943d6f'))):
        y = i * 365 + 38; d.text((8, y - 30), rot + '   ·   grande + quadradinho', fill=cor, font=f)
        pr.paste(im.resize((600, 315), Image.LANCZOS), (8, y)); pr.paste(q(im).resize((315, 315), Image.LANCZOS), (8 + 600 + 16, y))
    d.text((955, 8), 'COMO CHEGA NO WHATSAPP (proposta)', fill='#943d6f', font=f)
    zap.thumbnail((452, 730)); pr.paste(zap, (955, 38)); pr.save('esboco-15c-%s.jpg' % nome, quality=90)

CASOS = [  # nome, prévia de hoje, peça, título proposto, descrição proposta
    ('1-inicio-pt', 'og/inicio-pt.jpg', 'AC1050', 'La Fouch · Óculos de sol e de grau', 'Ciudad del Este. Retire na loja ou receba em casa.'),
    ('2-inicio-es', 'og/inicio-es.jpg', 'AC1050', 'La Fouch · Lentes de sol y recetados', 'Ciudad del Este. Retirá en la tienda o recibilo en casa.'),
    ('3-sol-feminino', 'og/solar-f.jpg', 'SL2265', 'Óculos de sol femininos · La Fouch', 'Os modelos femininos de sol da loja, com preço e reserva.'),
    ('4-peca-SL2290', 'p/SL2290.jpg', 'SL2290', 'Óculos de sol quadrado SL2290 · La Fouch', 'Reserve pelo WhatsApp e retire na loja.'),
    ('5-grau', 'og/mochi-pt.jpg', 'BR44145', 'Descubra o seu grau · La Fouch', 'Em 1 minuto, pelo celular. Depois escolha a armação.'),
]
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 452, 'height': 700}, device_scale_factor=1)
    for nome, hoje, ref, tit, desc in CASOS:
        prop = proposta(ref); prop.save('prop15c-%s.jpg' % nome, quality=90)
        if prop.size != (W, H): raise SystemExit('tamanho errado')
        ib = b64(prop); sq = b64(q(prop))
        pg.set_content(ZAP % (ib, tit, desc, 'https://lafouch.com/', sq, tit, desc)); pg.wait_for_timeout(200)
        zap = Image.open(io.BytesIO(pg.screenshot(full_page=True))).convert('RGB')
        prancha(nome, Image.open(os.path.join(CAT, hoje)).convert('RGB'), prop, zap); print('ok', nome)
    b.close()
