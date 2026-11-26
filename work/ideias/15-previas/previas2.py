"""IDEIAS 15b · prévias de link só com a foto (dono 26/11 08:41-08:42): sem frase na imagem, logo pequeno,
luxo e a imagem da loja. Duas propostas de fundo: A = estúdio bege (a 'vitrine em estúdio' que o dono gosta)
e B = vinho profundo (o cartão das datas aprovado no 12e: #943d6f escurecido com preto).
Peças reais (catalogo p/*.jpg). O que importa fica no quadrado do meio. Uso: python3 previas2.py <catalogo>"""
import sys, os
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageFont
CAT = sys.argv[1]; W, H = 1200, 630; Q0, Q1 = 285, 915
OF = (0x94, 0x3d, 0x6f)

def mistura(c, k, alvo=(0, 0, 0)): return tuple(round(a + (b - a) * k) for a, b in zip(c, alvo))

def fundo(tipo):
    if tipo == 'A': centro, borda = (241, 235, 227), (222, 212, 199)          # bege de estúdio
    else: centro, borda = mistura(OF, .48), mistura(OF, .78)                   # vinho profundo (12e)
    g = Image.new('L', (W, H)); d = ImageDraw.Draw(g)
    for r in range(900, 0, -6): d.ellipse((W/2 - r*1.25, H*0.46 - r, W/2 + r*1.25, H*0.46 + r), fill=int(255 * min(1, r / 900)))
    g = g.filter(ImageFilter.GaussianBlur(40))
    return Image.composite(Image.new('RGB', (W, H), borda), Image.new('RGB', (W, H), centro), g)

def logo(cor):
    im = Image.open(os.path.join(CAT, 'media/i/926f9307ba28.png')).convert('RGBA'); a = im.getchannel('A')
    c = Image.new('RGBA', im.size, cor + (255,)); c.putalpha(a); c = c.crop(a.getbbox())
    h = 56; return c.resize((round(c.width * h / c.height), h), Image.LANCZOS)

def peca(ref):
    im = Image.open(os.path.join(CAT, 'p/%s.jpg' % ref)).convert('RGB')
    g = im.convert('L').point(lambda v: 255 if v < 244 else 0); return im.crop(g.getbbox())

def poe_peca(bg, p, tipo, larg=600, alt=300):
    k = min(larg / p.width, alt / p.height); p = p.resize((round(p.width * k), round(p.height * k)), Image.LANCZOS)
    x = (W - p.width) // 2; y = round(H * 0.46 - p.height / 2)
    # sombra suave de estúdio
    s = Image.new('L', (W, H), 0); ImageDraw.Draw(s).ellipse((x + p.width*.12, y + p.height*.92, x + p.width*.88, y + p.height*1.04), fill=110 if tipo == 'A' else 150)
    s = s.filter(ImageFilter.GaussianBlur(22)); bg = Image.composite(Image.new('RGB', (W, H), mistura(bg.getpixel((W//2, H//2)), .35)), bg, s)
    if tipo == 'A':   # foto no branco → multiplica: o branco vira o bege e a peça fica como foi fotografada
        cam = Image.new('RGB', (W, H), (255, 255, 255)); cam.paste(p, (x, y)); return ImageChops.multiply(bg, cam)
    m = p.convert('L').point(lambda v: max(0, min(255, int((250 - v) * 4))))  # recorte do branco para o fundo escuro
    m = m.filter(ImageFilter.GaussianBlur(.6)); bg.paste(p, (x, y), m); return bg

def proposta(ref, tipo):
    bg = poe_peca(fundo(tipo), peca(ref), tipo)
    lg = logo(OF if tipo == 'A' else (246, 236, 241)); bg.paste(lg, ((W - lg.width) // 2, H - lg.height - 40), lg)
    return bg

def semp(tipo):  # lugar marcado para a foto de campanha do Semp (Início e datas)
    bg = fundo(tipo); d = ImageDraw.Draw(bg); f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 26)
    d.rectangle((0, 0, W - 1, H - 1), outline=(150, 150, 150), width=3)
    for t, y in (('FOTO DE CAMPANHA DO SEMP', 250), ('modelo usando a peça · ponta a ponta · sem texto', 300)):
        w = d.textlength(t, font=f); d.text(((W - w) / 2, y), t, fill=(120, 110, 110) if tipo == 'A' else (230, 220, 225), font=f)
    lg = logo((255, 255, 255)); bg.paste(lg, ((W - lg.width) // 2, H - lg.height - 40), lg); return bg

def q(im): return im.crop((Q0, 0, Q1, H))

def prancha(nome, hoje, a, b):
    f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
    pr = Image.new('RGB', (8 + 600 + 16 + 315 + 8, 3 * 365 + 10), '#e9e4e8'); d = ImageDraw.Draw(pr)
    for i, (rot, im, cor) in enumerate((('HOJE', hoje, '#555'), ('PROPOSTA A · estúdio bege', a, '#943d6f'), ('PROPOSTA B · vinho profundo (12e)', b, '#943d6f'))):
        y = i * 365 + 38; d.text((8, y - 30), rot + '   ·   grande + quadradinho', fill=cor, font=f)
        pr.paste(im.resize((600, 315), Image.LANCZOS), (8, y)); pr.paste(q(im).resize((315, 315), Image.LANCZOS), (8 + 600 + 16, y))
    pr.save('esboco-15b-%s.jpg' % nome, quality=90)

CASOS = [('1-peca-AC1050', 'p/AC1050.jpg', 'AC1050'), ('2-sol-feminino', 'og/solar-f.jpg', 'SL2265'),
         ('3-grau', 'og/mochi-pt.jpg', 'BR44145'), ('4-armacao-preta-GR3340', 'p/GR3340.jpg', 'GR3340')]
for nome, hoje, ref in CASOS:
    a, b = proposta(ref, 'A'), proposta(ref, 'B'); a.save('prop15b-%s-A.jpg' % nome, quality=92); b.save('prop15b-%s-B.jpg' % nome, quality=92)
    prancha(nome, Image.open(os.path.join(CAT, hoje)).convert('RGB'), a, b); print('ok', nome)
prancha('5-inicio-e-datas', Image.open(os.path.join(CAT, 'og/inicio-pt.jpg')).convert('RGB'), semp('A'), semp('B')); print('ok inicio')
