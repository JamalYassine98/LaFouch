# S294 · trata um vídeo do prato giratório para o 360 do site (estratégia aprovada no S261: só acerta a luz, sem recortar a peça).
# uso: python3 trata_giro.py video.mp4 QUADRO_INICIAL PERIODO pasta_saida [N=360]
# - o fundo parado sai do próprio giro (percentil alto de cada ponto ao longo da volta) com folga de 20 px nas bordas paradas;
# - cada quadro é dividido pelo fundo → parede, prato e costuras viram branco; peça, lentes e sombra ficam como a câmera viu;
# - recorte 3:2 igual em todos os quadros, centrado no eixo do giro. O vídeo original NÃO entra no projeto.
import cv2, numpy as np, sys, os, json
V, I0, PER, OUT = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]; N = int(sys.argv[5]) if len(sys.argv) > 5 else 360
os.makedirs(OUT, exist_ok=True); c = cv2.VideoCapture(V)
def quadro(i):
    c.set(cv2.CAP_PROP_POS_FRAMES, i); ok, f = c.read(); assert ok, i; return f
am = [quadro(I0 + round(k * PER / 96)) for k in range(96)]; pilha = np.stack(am); k = int(len(am) * .92)
fundo = np.partition(pilha, k, axis=0)[k].astype(np.float32); del pilha; fundo = cv2.GaussianBlur(fundo, (0, 0), 1.2) + 1
nuc = np.ones((41, 41), np.uint8); fmin = cv2.erode(fundo, nuc); fmax = cv2.dilate(fundo, nuc)
def trata(f):
    f = f.astype(np.float32); return (np.clip(f / np.clip(f, fmin, fmax) / .985, 0, 1) * 255).astype(np.uint8)
# onde a peça passa durante a volta (pontos escuros depois de tratar) → caixa do recorte
caixa = None
for f in am[::4]:
    m = trata(f).min(axis=2) < 120; m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((7, 7), np.uint8)); m[:, :int(m.shape[1] * .12)] = 0; m[:, int(m.shape[1] * .88):] = 0; m[:int(m.shape[0] * .2)] = 0
    ys, xs = np.where(m)
    if len(xs): b = (xs.min(), ys.min(), xs.max(), ys.max()); caixa = b if caixa is None else (min(caixa[0], b[0]), min(caixa[1], b[1]), max(caixa[2], b[2]), max(caixa[3], b[3]))
x0, y0, x1, y1 = caixa; cx = (x0 + x1) / 2; cy = (y0 + y1) / 2; H, W = am[0].shape[:2]
w = (x1 - x0) * 1.16; h = max((y1 - y0) * 1.5, w / 1.5); w = min(max(w, h * 1.5), W, H * 1.5); h = w / 1.5
X0 = int(max(0, min(W - w, cx - w / 2))); Y0 = int(max(0, min(H - h, cy - h * .56))); w = int(w); h = int(h)
print('peça durante a volta: x %d–%d y %d–%d · recorte %dx%d em (%d,%d)' % (x0, x1, y0, y1, w, h, X0, Y0))
for n in range(N):
    o = trata(quadro(I0 + round(n * PER / N)))[Y0:Y0 + h, X0:X0 + w]
    cv2.imwrite('%s/g%04d.png' % (OUT, n), cv2.resize(o, (960, 640), interpolation=cv2.INTER_AREA))
json.dump({'inicio': I0, 'periodo': PER, 'n': N, 'recorte': [X0, Y0, w, h], 'caixa': [int(v) for v in caixa]}, open(OUT + '/giro.json', 'w'))
