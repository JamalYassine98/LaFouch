# S260 v4 · estratégia nova (pedido do dono: não cortar a armação, manter as sombras naturais, sem filtros estranhos).
# Só UMA operação: acerta a luz. O fundo vazio é tirado do próprio giro (o que fica parado) e cada quadro é dividido por ele,
# como a "luz de estúdio" que o Estúdio já usa nas fotos. Não existe máscara, recorte nem apagamento: tudo o que a câmera viu da peça,
# das lentes e das sombras continua lá; só o que é fundo parado (parede, borda do prato, quina da caixa) vira branco.  python3 trata3.py
import cv2, numpy as np, glob, os, json
A = os.path.dirname(os.path.abspath(__file__)) + '/'
G = json.load(open(A + 'giro.json')); top = G['top']; H = 720; fs = sorted(glob.glob('/tmp/s260_f/*.jpg'))
inteiros = [cv2.imread(p) for p in fs]; bruto = [im[top:top + H] for im in inteiros]
# o vídeo foi filmado na mão (a câmera balança alguns pixels). Em vez de tentar firmar os quadros, o fundo ganha uma FOLGA:
# perto de uma borda parada (a do prato, a quina da caixa) o fundo pode valer qualquer tom entre os dois lados da borda, numa faixa de 20 px.
pilha = np.stack(bruto); k = int(len(fs) * .92); fundo = np.partition(pilha, k, axis=0)[k].astype(np.float32); fundo = cv2.GaussianBlur(fundo, (0, 0), 1.2) + 1
nuc = np.ones((41, 41), np.uint8); fmin = cv2.erode(fundo, nuc); fmax = cv2.dilate(fundo, nuc)
os.makedirs('/tmp/kitsite/s260c', exist_ok=True); peso = 0
for i in range(len(fs)):
    f = pilha[i].astype(np.float32); r = f / np.clip(f, fmin, fmax); out = np.clip(r / .985, 0, 1); o8 = (out * 255).astype(np.uint8)
    cv2.imwrite('/tmp/kitsite/s260c/g%03d.jpg' % i, o8, [cv2.IMWRITE_JPEG_QUALITY, 88]); p = cv2.resize(o8, (720, 480), interpolation=cv2.INTER_AREA); cv2.imwrite('/tmp/kitsite/s260c/p%03d.jpg' % i, p, [cv2.IMWRITE_JPEG_QUALITY, 80]); peso += os.path.getsize('/tmp/kitsite/s260c/p%03d.jpg' % i)
print('peso: %d quadros = %.0f kB · 36 ≈ %.0f kB' % (len(fs), peso / 1024, 36 * peso / 1024 / len(fs)))
# conferência: quanto da PEÇA cada versão apagou (pixels escuros do filmado que ficaram quase brancos)
fr = G['frente']
for pasta in ('s260b', 's260c'):
    perda = []
    for i in (fr, fr + 20, fr + 40):
        o = pilha[i].astype(np.float32) / fundo; era = o.min(axis=2) < .80; t = cv2.imread('/tmp/kitsite/%s/g%03d.jpg' % (pasta, i)).min(axis=2); perda.append(round(100 * float(((t > 235) & era).sum()) / max(1, int(era.sum())), 1))
    print(pasta, '· parte da peça que sumiu (%):', perda)
bordas = []
for i in (fr, fr + 20, fr + 40):
    t = cv2.imread('/tmp/kitsite/s260c/g%03d.jpg' % i).min(axis=2); bordas.append(round(100 * float((t[:40] < 245).mean()), 2))
print('s260c · faixa de cima (onde ficava o aro/parede) não branca (%):', bordas)
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
B = Image.new('RGB', (40 + 3 * 400 + 40, 150 + 3 * 330), '#ece6ea'); d = ImageDraw.Draw(B)
d.text((40, 24), 'Tratamento do giro · filmado × versão que cortava × estratégia nova', font=F(27, 1), fill='#2a1a28'); d.text((40, 68), 'Estratégia nova: só acerta a luz, sem recortar a peça. Sombras e lentes ficam como a câmera viu.', font=F(18), fill='#5b4a57')
for j, (i, leg, corte) in enumerate(((fr, 'frente', None), (fr + 20, '3/4', None), (fr + 20, '3/4 · lente e haste (seu print)', (700, 230, 1080, 483)))):
    for c, (fonte, rot, cor) in enumerate((('filmado', 'FILMADO', '#5b4a57'), ('s260b', 'CORTAVA A ARMAÇÃO', '#b42318'), ('s260c', 'ESTRATÉGIA NOVA', '#1f8a4c'))):
        im = Image.fromarray(cv2.cvtColor(pilha[i], cv2.COLOR_BGR2RGB)) if fonte == 'filmado' else Image.open('/tmp/kitsite/%s/g%03d.jpg' % (fonte, i)); im = im.crop(corte) if corte else im; im = im.resize((380, 253)); x = 40 + c * 400; y = 118 + j * 330
        d.text((x, y), '%s · %s' % (rot, leg) if c == 0 else rot, font=F(16, 1), fill=cor); B.paste(im, (x, y + 26)); d.rectangle((x - 1, y + 25, x + 380, y + 26 + 253), outline='#c9bcc5')
B.save(A + 's260_tratamento_estrategia_nova.jpg', quality=90); print('ok folha')
