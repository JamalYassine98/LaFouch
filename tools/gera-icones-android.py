#!/usr/bin/env python3
"""Gera os ícones do app Android (já prontos, guardados no projeto) a partir de assets/icon-*.png.
Assim a geração do APK não depende de baixar nada na hora (09/11: o download falhou e o APK saiu sem ícone)."""
import os
from PIL import Image, ImageDraw
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(B, 'assets'); OUT = os.path.join(A, 'android-res')
fg = Image.open(os.path.join(A, 'icon-foreground.png')).convert('RGBA')
bg = Image.open(os.path.join(A, 'icon-background.png')).convert('RGBA')
only = Image.open(os.path.join(A, 'icon-only.png')).convert('RGBA')
D = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}
for k, f in D.items():
    d = os.path.join(OUT, 'mipmap-' + k); os.makedirs(d, exist_ok=True)
    a = round(108 * f); l = round(48 * f)
    fg.resize((a, a), Image.LANCZOS).save(os.path.join(d, 'ic_launcher_foreground.png'))
    bg.resize((a, a), Image.LANCZOS).save(os.path.join(d, 'ic_launcher_background.png'))
    ic = only.resize((l, l), Image.LANCZOS); ic.save(os.path.join(d, 'ic_launcher.png'))
    m = Image.new('L', (l * 4, l * 4), 0); ImageDraw.Draw(m).ellipse((0, 0, l * 4 - 1, l * 4 - 1), fill=255)
    r = Image.new('RGBA', (l, l), (0, 0, 0, 0)); r.paste(ic, (0, 0), m.resize((l, l), Image.LANCZOS)); r.save(os.path.join(d, 'ic_launcher_round.png'))
d = os.path.join(OUT, 'mipmap-anydpi-v26'); os.makedirs(d, exist_ok=True)
X = '<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n    <background android:drawable="@mipmap/ic_launcher_background"/>\n    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n</adaptive-icon>\n'
for n in ('ic_launcher.xml', 'ic_launcher_round.xml'):
    open(os.path.join(d, n), 'w').write(X)
print('ícones gerados em', OUT)
