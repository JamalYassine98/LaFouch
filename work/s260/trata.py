# S260 · trata o vídeo de giro que o dono mandou: fundo branco, mesmo recorte em todos os quadros, acha a frente sozinho, mede o peso.
# Entrada: quadros em /tmp/s260_f (6 por segundo, extraídos com ffmpeg do vídeo original, que fica FORA do projeto).  python3 trata.py
import cv2, numpy as np, glob, os, json
A = os.path.dirname(os.path.abspath(__file__)) + '/'
fs = sorted(glob.glob('/tmp/s260_f/*.jpg')); print(len(fs), 'quadros')
def limpa(im):
    f = im.astype(np.float32); k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (61, 61))
    bg = cv2.GaussianBlur(cv2.dilate(im, k), (0, 0), 30).astype(np.float32) + 1
    n = np.clip(f / bg, 0, 1.05); return n
norms = []; boxes = []
for p in fs:
    im = cv2.imread(p); n = limpa(im); g = n.min(axis=2); m = (g < .86).astype(np.uint8); m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    m[: int(im.shape[0] * .35)] = 0; m[int(im.shape[0] * .80):] = 0   # só a faixa onde a peça fica (fora dela: sombras do prato)
    ys, xs = np.where(m > 0); boxes.append((xs.min(), ys.min(), xs.max(), ys.max()) if len(xs) > 200 else None); norms.append(n)
bx = [b for b in boxes if b]; x0 = min(b[0] for b in bx); y0 = min(b[1] for b in bx); x1 = max(b[2] for b in bx); y1 = max(b[3] for b in bx)
print('peça ocupa x %d–%d, y %d–%d do quadro 1080×1920' % (x0, x1, y0, y1))
cy = (y0 + y1) // 2; W = 1080; H = 720; top = max(0, min(1920 - H, cy - H // 2))
os.makedirs('/tmp/kitsite/s260', exist_ok=True); peso = 0; sim = []; larg = []
for i, n in enumerate(norms):
    c = n[top:top + H, :, :]; out = np.clip((c - .04) / .9, 0, 1); out = np.where(out > .93, 1, out)
    out[:, :70] = 1; o8 = (out * 255).astype(np.uint8); cv2.imwrite('/tmp/kitsite/s260/g%03d.jpg' % i, o8, [cv2.IMWRITE_JPEG_QUALITY, 86])
    p = cv2.resize(o8, (720, 480), interpolation=cv2.INTER_AREA); cv2.imwrite('/tmp/kitsite/s260/p%03d.jpg' % i, p, [cv2.IMWRITE_JPEG_QUALITY, 78]); peso += os.path.getsize('/tmp/kitsite/s260/p%03d.jpg' % i)
    g = 255 - cv2.cvtColor(p, cv2.COLOR_BGR2GRAY).astype(np.float32); g[:, :48] = 0; g[g < 28] = 0; melhor = 0
    for cx in range(220, 500, 4):   # procura o eixo de simetria: na frente, a metade esquerda é o espelho da direita
        h = min(cx, 720 - cx); e = g[:, cx - h:cx]; r = g[:, cx:cx + h][:, ::-1]; den = np.maximum(e, r).sum()
        if den > 2000: melhor = max(melhor, float(np.minimum(e, r).sum() / den))
    sim.append(melhor); xs = np.where(g.sum(axis=0) > 300)[0]; larg.append(int(xs.max() - xs.min()) if len(xs) else 0)
fr = int(np.argmax(sim)); print('frente detectada sozinha: quadro %d (%.1f s) · simetria %.2f' % (fr, fr / 6, sim[fr])); print('simetria por quadro:', [round(s, 2) for s in sim][::2]); print('largura da peça por quadro (px):', larg[::3])
print('peso: %d quadros de 720×480 = %.0f kB (média %.0f kB por quadro) · 36 quadros ≈ %.0f kB · vídeo original %.0f kB' % (len(fs), peso / 1024, peso / 1024 / len(fs), 36 * peso / 1024 / len(fs), os.path.getsize('/tmp/s260_in/giro.mp4') / 1024))
json.dump({'n': len(fs), 'frente': fr, 'top': int(top), 'sim': sim, 'larg': larg, 'peso_kb': peso / 1024}, open(A + 'giro.json', 'w'))
# folha: original × tratado em 3 ângulos
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
idx = [fr, min(len(fs) - 1, fr + 20), min(len(fs) - 1, fr + 40)]; print('folha com os quadros', idx); B = Image.new('RGB', (40 + 3 * 560 + 40, 150 + 2 * 420), '#ece6ea'); d = ImageDraw.Draw(B)
d.text((40, 24), 'O que o sistema faz com o seu vídeo de giro', font=F(30, 1), fill='#2a1a28'); d.text((40, 70), 'Em cima: quadros como foram filmados. Embaixo: os mesmos quadros com fundo branco e o mesmo recorte.', font=F(19), fill='#5b4a57')
for j, i in enumerate(idx):
    o = Image.open(fs[i]).crop((0, top, 1080, top + H)).resize((540, 360)); t = Image.open('/tmp/kitsite/s260/g%03d.jpg' % i).resize((540, 360)); x = 40 + j * 560
    d.text((x, 116), ('FILMADO · %.1f s' % (i / 6)), font=F(18, 1), fill='#b42318'); B.paste(o, (x, 142)); d.text((x, 142 + 372), 'TRATADO' + (' · frente achada sozinha' if j == 0 else ''), font=F(18, 1), fill='#1f8a4c'); B.paste(t, (x, 142 + 398)); d.rectangle((x - 1, 142 + 397, x + 540, 142 + 398 + 360), outline='#c9bcc5')
B.save(A + 's260_giro_tratado.jpg', quality=88); print('ok folha')
