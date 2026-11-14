# S294 v2 · trata o vídeo do prato giratório para o 360 do site e CORRIGE o que dá para corrigir por programa (pedido do dono, 14/11):
#   1) luz: divide cada quadro pelo fundo parado tirado do próprio giro (estratégia do S261; não recorta a peça). Câmera em apoio fixo → folga pequena;
#   2) peça fora do centro do prato: mede onde o meio da peça fica em cada grau e tira o "passeio" (1ª harmônica), de lado e de altura;
#   3) nitidez desigual (peça sai da faixa de foco): reforça o contorno só nos graus mais moles, com limite (não inventa detalhe);
#   4) sobras longe da peça (costura da tenda, arco do prato): viram branco; perto da peça nada é mexido (sombra natural fica);
#   5) começa pela frente e recorta 3:2 igual em todas as imagens.
# uso: python3 trata_giro2.py video.mp4 QUADRO_INICIAL PERIODO pasta_saida [N=360] [folga=9]      O vídeo original NÃO entra no projeto.
import cv2, numpy as np, sys, os, json
V, I0, PER, OUT = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]; N = int(sys.argv[5]) if len(sys.argv) > 5 else 360; FOLGA = int(sys.argv[6]) if len(sys.argv) > 6 else 9
os.makedirs(OUT, exist_ok=True); c = cv2.VideoCapture(V)
def quadro(i):
    c.set(cv2.CAP_PROP_POS_FRAMES, i); ok, f = c.read(); assert ok, i; return f
am = [quadro(I0 + round(k * PER / 96)) for k in range(96)]; pilha = np.stack(am); k = int(len(am) * .92)
ordem = np.sort(pilha, axis=0); del pilha; nA = len(am); fundo = ordem[k].astype(np.float32); meio = ordem[nA // 2].astype(np.float32); parado = (ordem[int(nA * .75)].astype(np.int16) - ordem[int(nA * .2)].astype(np.int16)).max(axis=2) < 14; del ordem
# zonas "sujas" do fundo parado (costura escura da tenda, fita, quina): onde o fundo foge do tom da parede em volta. Ali o fundo certo é o valor do MEIO
# (o percentil alto pegava a peça clara passando na frente da costura escura) e o ponto igual ao fundo vazio vira branco puro; onde a peça passa na frente, fica como a câmera viu.
liso = cv2.GaussianBlur(fundo, (0, 0), 25); SUJA = cv2.dilate((((np.abs(meio / (liso + 1) - 1).max(axis=2)) > .08) & parado).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0   # 'parado' = quase não muda durante a volta (a peça só passa de vez em quando)
fundo[SUJA] = meio[SUJA]; fundo = cv2.GaussianBlur(fundo, (0, 0), 1.2) + 1
nuc = np.ones((FOLGA, FOLGA), np.uint8); fmin = cv2.erode(fundo, nuc); fmax = cv2.dilate(fundo, nuc); H, W = am[0].shape[:2]; del am
def trata(f):
    f = f.astype(np.float32); o = np.clip(f / np.clip(f, fmin, fmax) / .985, 0, 1)
    igual = SUJA & ((np.abs(f - fundo) - np.maximum(.16 * fundo, 16)).max(axis=2) < 0); o[igual] = 1.   # tolerância também em valor absoluto: a costura é escura e o chiado da câmera pesa mais ali
    return (o * 255).astype(np.uint8)
def peca(t):  # peça inteira = tudo o que não é branco (armação clara, lentes, sombra) e está ligado ao miolo escuro; riscos soltos longe dela ficam de fora
    mn = t.min(axis=2); nu = (mn < 125).astype(np.uint8); nu = cv2.morphologyEx(nu, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)); nu[:, :int(W * .06)] = 0; nu[:, int(W * .94):] = 0; nu[:int(H * .15)] = 0
    n, lab, st, _ = cv2.connectedComponentsWithStats(nu, 8)
    if n > 1:
        gr = st[1:, cv2.CC_STAT_AREA]; maior = gr.max(); nu = np.isin(lab, [i + 1 for i, a in enumerate(gr) if a > max(150, maior * .02)]).astype(np.uint8)
    tudo = cv2.morphologyEx((mn < 232).astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)); liga = cv2.dilate(nu, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (71, 71)))
    n, lab, st, _ = cv2.connectedComponentsWithStats(tudo, 8); toca = np.unique(lab[liga > 0]); toca = toca[toca > 0]
    return (np.isin(lab, toca) | (nu > 0)).astype(np.uint8), nu
# 1ª passada: mede meio da peça (de lado e de altura), simetria e nitidez em cada grau
med = []
for n in range(N):
    t = trata(quadro(I0 + round(n * PER / N))); m, nu = peca(t); ys, xs = np.where(m)
    g = cv2.cvtColor(t, cv2.COLOR_BGR2GRAY); x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    rec = g[y0:y1 + 1, x0:x1 + 1].astype(np.float32); sim = float(np.abs(rec - rec[:, ::-1]).mean())
    nit = float(cv2.Laplacian(g, cv2.CV_32F)[cv2.dilate(m, np.ones((9, 9), np.uint8)) > 0].var())
    yn = np.where(nu)[0]; med.append(((x0 + x1) / 2, (y0 + y1) / 2, x1 - x0, y1 - y0, sim, nit, int(yn.max() - yn.min()) if len(yn) else 0))
med = np.array(med); th = np.arange(N) * 2 * np.pi / N; A = np.stack([np.ones(N), np.cos(th), np.sin(th)], 1)
def harm(v):  # parte que dá UMA volta por volta = passeio da peça em torno do eixo do prato
    co = np.linalg.lstsq(A, v, rcond=None)[0]; return A[:, 1:] @ co[1:], co
dx, cox = harm(med[:, 0]); dy, coy = harm(med[:, 1])
print('passeio da peça: de lado ±%.0f px · de altura ±%.0f px (em %d px de largura)' % (np.hypot(cox[1], cox[2]), np.hypot(coy[1], coy[2]), W))
# frente = a mais simétrica; entre frente e costas, a frente é onde o miolo escuro (hastes) aparece mais baixo em altura
sim = med[:, 4] / np.maximum(med[:, 2], 1); cand = int(np.argmin(sim)); outro = (cand + N // 2) % N
jan = lambda i: med[[(i + d) % N for d in range(-4, 5)], 6].mean(); frente = cand if jan(cand) <= jan(outro) else outro   # de costas as hastes vêm para a câmera e o miolo escuro fica mais alto
alvo_nit = float(np.percentile(med[:, 5], 70)); print('frente no grau', frente, '(a outra candidata era', outro if frente == cand else cand, ') · nitidez min/mediana/máx %.0f/%.0f/%.0f' % (med[:, 5].min(), np.median(med[:, 5]), med[:, 5].max()))
# caixa do recorte depois de tirar o passeio
bx0 = (med[:, 0] - med[:, 2] / 2 - dx).min(); bx1 = (med[:, 0] + med[:, 2] / 2 - dx).max(); by0 = (med[:, 1] - med[:, 3] / 2 - dy).min(); by1 = (med[:, 1] + med[:, 3] / 2 - dy).max()
cx = (bx0 + bx1) / 2; cy = (by0 + by1) / 2; w = (bx1 - bx0) * 1.12; h = max((by1 - by0) * 1.45, w / 1.5); w = min(max(w, h * 1.5), W, H * 1.5); h = w / 1.5
X0 = int(max(0, min(W - w, cx - w / 2))); Y0 = int(max(0, min(H - h, cy - h * .55))); w = int(w); h = int(h)
print('recorte %dx%d em (%d,%d) · peça ocupa %.0f%% da largura do recorte' % (w, h, X0, Y0, 100 * (bx1 - bx0) / w))
# 2ª passada: aplica e grava começando pela frente
SAIDA = (1080, 720); brancos = []
for j in range(N):
    n = (frente + j) % N; t = trata(quadro(I0 + round(n * PER / N))); m, nu = peca(t)
    perto = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (121, 121))); perto = cv2.GaussianBlur(perto.astype(np.float32), (0, 0), 18)[..., None]   # a peça inteira (com armação clara e sombra) e ~60 px em volta ficam como a câmera viu
    t = (t.astype(np.float32) * perto + 255. * (1 - perto))
    falta = alvo_nit / max(med[n, 5], 1.); forca = float(np.clip(np.sqrt(falta) - 1, 0, 1.1))
    if forca > .03: bor = cv2.GaussianBlur(t, (0, 0), 1.6); t = t + forca * (t - bor)
    t = np.clip(t, 0, 255).astype(np.uint8)
    M = np.float32([[1, 0, -dx[n]], [0, 1, -dy[n]]]); t = cv2.warpAffine(t, M, (W, H), flags=cv2.INTER_LINEAR, borderValue=(255, 255, 255))
    o = cv2.resize(t[Y0:Y0 + h, X0:X0 + w], SAIDA, interpolation=cv2.INTER_AREA); cv2.imwrite('%s/q%04d.png' % (OUT, j), o); brancos.append(float((o.min(axis=2) > 250).mean()))
json.dump({'inicio': I0, 'periodo': PER, 'n': N, 'frente': frente, 'recorte': [X0, Y0, w, h], 'passeio_x': float(np.hypot(cox[1], cox[2])), 'passeio_y': float(np.hypot(coy[1], coy[2]))}, open(OUT + '/giro.json', 'w'))
print('fundo branco puro: %.0f%% da imagem em média' % (100 * np.mean(brancos)))
