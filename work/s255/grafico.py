# S255 · linha do tempo da Mochi (45 s na chegada): piscar, boca, inclinação, braços, posição, giro do corpo.  python3 grafico.py
import json, os
from PIL import Image, ImageDraw, ImageFont
A = os.path.dirname(os.path.abspath(__file__)) + '/'
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
d = json.load(open(A + 'mochi.json'))['intro']; T = d[-1]['t']
W, H, X0, X1 = 1500, 1060, 250, 1460; B = Image.new('RGB', (W, H), '#ece6ea'); dr = ImageDraw.Draw(B)
dr.text((40, 24), 'Mochi quadro a quadro · os primeiros 45 s (chegada, fala e espera)', font=F(30, 1), fill='#2a1a28'); dr.text((40, 66), '2.573 quadros medidos no simulador · cada risco é um acontecimento', font=F(19), fill='#5b4a57')
x = lambda t: X0 + (X1 - X0) * t / T
for s in range(0, 46, 5): dr.line((x(s * 1000), 110, x(s * 1000), H - 40), fill='#d9cfd6'); dr.text((x(s * 1000) - 8, H - 34), '%d s' % s, font=F(16), fill='#5b4a57')
def faixa(y, nome, nota): dr.text((40, y - 12), nome, font=F(20, 1), fill='#2a1a28'); dr.text((40, y + 14), nota, font=F(14), fill='#8d3a69')
def riscos(y, ts, cor='#8d3a69', h=22):
    for t in ts: dr.line((x(t), y - h, x(t), y + h), fill=cor, width=3)
def curva(y, serie, esc, cor='#2a1a28'):
    dr.line((X0, y, X1, y), fill='#c9bcc5'); pts = [(x(t), y - v * esc) for t, v in serie]; dr.line(pts, fill=cor, width=2)
pb = [d[i]['t'] for i in range(1, len(d)) if d[i]['pis'] and not d[i - 1]['pis']]
faixa(160, 'Piscar', 'a cada 3,75 s exatos'); riscos(160, pb)
bo = [d[i]['t'] for i in range(1, len(d)) if d[i]['bO'] > .5 and d[i - 1]['bO'] <= .5]
faixa(270, 'Boca abre', 'ritmo fixo de ~0,45 s'); riscos(270, bo, '#b42318')
bal = [(q['t'], q['bal']) for q in d if q['bal']]
for t, tx in bal: dr.text((x(t) + 4, 300), '“' + tx[:26] + '…”', font=F(13), fill='#5b4a57')
faixa(400, 'Inclinar a cabeça', 'passa do ponto 26%'); curva(400, [(q['t'], q['ti']) for q in d], 4)
def ang(c):
    s = [(q['t'], q[c][2] if len(q[c]) > 2 else 0) for q in d]; b0 = s[0][1]; out = []
    for t, v in s:
        dv = v - b0
        while dv > 180: dv -= 360
        while dv < -180: dv += 360
        out.append((t, dv))
    return out
faixa(540, 'Braço esquerdo', 'até 2.400 graus por segundo'); curva(540, ang('aBe'), .28)
faixa(680, 'Braço direito', ''); curva(680, ang('aBd'), .28)
faixa(810, 'Giro do corpo', 'nos gestos'); curva(810, [(q['t'], q['sy'] if abs(q['sy']) < 60 and q['sy'] != 1 else 0) for q in d], 2.2)
faixa(930, 'Lugar na tela', 'anda para apontar'); curva(960, [(q['t'], (q['x'] - d[0]['x'])) for q in d], .2, '#1f8a4c')
B.save(A + 's255_mochi_linha_do_tempo.jpg', quality=88); print('ok')
# perfil do deslocamento e da troca de rosto
xs = [(q['t'], q['x'], q['y']) for q in d]; mv = [(a[0], b_[1] - a[1], b_[2] - a[2]) for a, b_ in zip(xs, xs[1:]) if b_[1] != a[1] or b_[2] != a[2]]
if mv:
    grupos = []; g = [mv[0]]
    for m in mv[1:]:
        if m[0] - g[-1][0] > 300: grupos.append(g); g = [m]
        else: g.append(m)
    grupos.append(g)
    for g in grupos: print('ANDA: de %.1f a %.1f s (%.2f s) · %d px em x, %d px em y · passo máx %d px/quadro · 1º passo %d, último %d' % (g[0][0] / 1000, g[-1][0] / 1000, (g[-1][0] - g[0][0]) / 1000, sum(m[1] for m in g), sum(m[2] for m in g), max(abs(m[1]) + abs(m[2]) for m in g), abs(g[0][1]) + abs(g[0][2]), abs(g[-1][1]) + abs(g[-1][2])))
ov = sum(1 for q in d if 0.05 < q['oF'] < .95 or 0.05 < q['o'] < .95); print('ROSTOS sobrepostos (troca por transparência): %d quadros (%.2f s no total)' % (ov, ov / 57))
print('rot do corpo (graus): min %.1f máx %.1f · pulo máx %.1f px' % (min(q['sy'] for q in d if abs(q['sy']) < 60), max(q['sy'] for q in d if abs(q['sy']) < 60 and q['sy'] != 1), max(-q['sx'] for q in d if q['sx'] != 1)))
