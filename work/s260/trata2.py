# S260 v2 · tratamento melhor do giro: o fundo é medido NO TEMPO (a câmera fica parada e a peça passa; o que quase nunca muda em cada ponto é o fundo).
# Dividindo cada quadro por esse fundo, o aro do prato some por inteiro; depois uma curva suave leva sombras e manchas claras ao branco sem apagar o metal.  python3 trata2.py
import cv2, numpy as np, glob, os, json
A = os.path.dirname(os.path.abspath(__file__)) + '/'
G = json.load(open(A + 'giro.json')); top = G['top']; H = 720; fs = sorted(glob.glob('/tmp/s260_f/*.jpg'))
pilha = np.stack([cv2.imread(p)[top:top + H] for p in fs])                      # 70 × 720 × 1080 × 3
k = int(len(fs) * .80); fundo = np.partition(pilha, k, axis=0)[k].astype(np.float32)   # percentil 80 no tempo = cena sem a peça
fundo = cv2.GaussianBlur(fundo, (0, 0), 2) + 1; cv2.imwrite('/tmp/s260_fundo.jpg', fundo.astype(np.uint8))
os.makedirs('/tmp/kitsite/s260b', exist_ok=True); peso = 0
for i in range(len(fs)):
    r = pilha[i].astype(np.float32) / fundo                                      # 1 = igual ao fundo
    lum = r.min(axis=2); sat = r.max(axis=2) - r.min(axis=2)
    # "quanto é peça": escuro em relação ao fundo OU colorido; sombras e manchas são claras e sem cor
    peca = np.clip((.80 - lum) / .22, 0, 1); peca = np.maximum(peca, np.clip((sat - .10) / .12, 0, 1) * np.clip((.93 - lum) / .1, 0, 1))
    peca = cv2.GaussianBlur(peca, (0, 0), 1.2); peca = np.clip(peca * 1.6, 0, 1)[..., None]
    out = np.clip(r, 0, 1) * peca + (1 - peca)                                   # fora da peça: branco puro
    out[:, :70] = 1; o8 = (np.clip(out, 0, 1) * 255).astype(np.uint8)
    cv2.imwrite('/tmp/kitsite/s260b/g%03d.jpg' % i, o8, [cv2.IMWRITE_JPEG_QUALITY, 86]); p = cv2.resize(o8, (720, 480), interpolation=cv2.INTER_AREA); cv2.imwrite('/tmp/kitsite/s260b/p%03d.jpg' % i, p, [cv2.IMWRITE_JPEG_QUALITY, 78]); peso += os.path.getsize('/tmp/kitsite/s260b/p%03d.jpg' % i)
print('peso v2: %d quadros = %.0f kB · 36 ≈ %.0f kB' % (len(fs), peso / 1024, 36 * peso / 1024 / len(fs)))
# quanto sobra de "sujeira" fora da peça: pixels que não são brancos puros longe de qualquer traço escuro
def sujeira(pasta):
    tot = []
    for i in (G['frente'], G['frente'] + 20, G['frente'] + 40):
        im = cv2.imread('/tmp/kitsite/%s/g%03d.jpg' % (pasta, i)); g = im.min(axis=2); esc = (g < 150).astype(np.uint8); perto = cv2.dilate(esc, np.ones((25, 25), np.uint8)); mancha = (g < 245) & (perto == 0); mancha[:, :80] = False; tot.append(100 * mancha.mean())
    return [round(x, 2) for x in tot]
print('manchas longe da peça (% da imagem) · v1:', sujeira('s260'), '· v2:', sujeira('s260b'))
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
fr = G['frente']; B = Image.new('RGB', (40 + 2 * 580 + 20, 150 + 3 * 430), '#ece6ea'); d = ImageDraw.Draw(B)
d.text((40, 24), 'Tratamento do giro · primeira versão × versão nova', font=F(30, 1), fill='#2a1a28'); d.text((40, 70), 'O aro atrás da peça (borda do prato) e as manchas somem; o metal fica. Quadros do seu vídeo.', font=F(19), fill='#5b4a57')
for j, (i, leg, corte) in enumerate(((fr, 'frente', None), (fr + 20, '3/4', None), (fr + 20, 'ponte ampliada', (560, 250, 940, 503)))):
    for c, (pasta, rot, cor) in enumerate((('s260', 'PRIMEIRA VERSÃO', '#b42318'), ('s260b', 'VERSÃO NOVA', '#1f8a4c'))):
        im = Image.open('/tmp/kitsite/%s/g%03d.jpg' % (pasta, i)); im = im.crop(corte) if corte else im; im = im.resize((560, 373)); x = 40 + c * 580; y = 120 + j * 430
        d.text((x, y), '%s · %s' % (rot, leg), font=F(18, 1), fill=cor); B.paste(im, (x, y + 28)); d.rectangle((x - 1, y + 27, x + 560, y + 28 + 373), outline='#c9bcc5')
B.save(A + 's260_tratamento_v1_x_v2.jpg', quality=88); print('ok folha')
