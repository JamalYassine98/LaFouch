"""Vídeo de teste para a câmera do simulador: um "manequim" desenhado a partir do rosto-padrão de 468 pontos do
próprio leitor do site (canon.json + tri.json, tirados do face_landmarker.task) — sem foto de pessoa real.
Uso: python3 manequim.py [estado] → /tmp/manequim-<estado>.mjpeg
estados: ok (de frente, parado) · escuro (pouca luz) · virado (35°) · perto (rosto enorme) · boca (boca aberta)"""
import json, math, sys, io, os
from PIL import Image, ImageDraw, ImageFilter
AQUI = os.path.dirname(os.path.abspath(__file__))
V = json.load(open(os.path.join(AQUI, 'canon.json'))); T = json.load(open(os.path.join(AQUI, 'tri.json')))
TR = [T[i:i + 3] for i in range(0, len(T), 3)]
W, H = 1280, 960

def rot(p, yaw, pitch):
    x, y, z = p; a, b = math.radians(yaw), math.radians(pitch)
    x, z = x * math.cos(a) + z * math.sin(a), -x * math.sin(a) + z * math.cos(a)
    y, z = y * math.cos(b) - z * math.sin(b), y * math.sin(b) + z * math.cos(b)
    return x, y, z

def quadro(yaw=0, pitch=0, esc=1.0, luz=1.0, boca=0.0, dx=0):
    P = []
    for i, p in enumerate(V):
        x, y, z = p
        if boca and i in (14, 15, 16, 17, 18, 87, 86, 85, 84, 317, 316, 315, 314, 178, 179, 180, 181, 402, 403, 404, 405, 200, 199, 175, 152, 148, 149, 176, 377, 400, 378, 379, 171, 396, 140, 369, 32, 262, 208, 428, 83, 313, 201, 421, 194, 418):
            y -= boca
        P.append(rot((x, y, z), yaw, pitch))
    s = 34 * esc; cx, cy = W / 2 + dx, H * 0.47
    sc = [(cx + x * s, cy - y * s, z) for x, y, z in P]
    im = Image.new('RGB', (W, H), tuple(int(c * luz) for c in (96, 88, 84))); d = ImageDraw.Draw(im)
    d.rectangle((0, int(H * .72), W, H), fill=tuple(int(c * luz) for c in (70, 62, 60)))
    # cabelo e pescoço atrás do rosto
    tx, ty = sc[10][0], sc[10][1]
    d.ellipse((tx - 9.5 * s, ty - 3.2 * s, tx + 9.5 * s, ty + 13 * s), fill=tuple(int(c * luz) for c in (40, 30, 28)))
    d.rectangle((sc[152][0] - 4.5 * s, sc[152][1] - 3 * s, sc[152][0] + 4.5 * s, H), fill=tuple(int(c * luz) for c in (178, 132, 110)))
    L = (0.2, 0.45, 0.87); n = math.sqrt(sum(c * c for c in L)); L = [c / n for c in L]
    for a, b, c in sorted(TR, key=lambda t: sum(P[k][2] for k in t)):
        A, B, C = P[a], P[b], P[c]
        u = [B[k] - A[k] for k in range(3)]; v = [C[k] - A[k] for k in range(3)]
        nx, ny, nz = u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]
        ln = math.sqrt(nx * nx + ny * ny + nz * nz) or 1
        if nz < 0: nx, ny, nz = -nx, -ny, -nz
        k = max(0.25, (nx * L[0] + ny * L[1] + nz * L[2]) / ln) * luz
        d.polygon([sc[a][:2], sc[b][:2], sc[c][:2]], fill=(int(226 * k), int(180 * k), int(152 * k)))
    # olhos, íris, sobrancelhas e boca
    for e in ((33, 133, 159, 145), (362, 263, 386, 374)):
        ex = (sc[e[0]][0] + sc[e[1]][0]) / 2; ey = (sc[e[2]][1] + sc[e[3]][1]) / 2; w = abs(sc[e[1]][0] - sc[e[0]][0]) / 2
        d.ellipse((ex - w, ey - w * .42, ex + w, ey + w * .42), fill=tuple(int(c * luz) for c in (240, 236, 232)))
        r = w * .42; d.ellipse((ex - r, ey - r, ex + r, ey + r), fill=tuple(int(c * luz) for c in (70, 48, 34)))
        d.ellipse((ex - r * .45, ey - r * .45, ex + r * .45, ey + r * .45), fill=(10, 8, 8))
    for br in ((70, 63, 105, 66, 107), (336, 296, 334, 293, 300)):
        d.line([sc[i][:2] for i in br], fill=tuple(int(c * luz) for c in (45, 32, 28)), width=int(s * .35))
    lab = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146]
    d.polygon([sc[i][:2] for i in lab], fill=tuple(int(c * luz) for c in (168, 86, 84)))
    if boca:
        inn = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95]
        d.polygon([sc[i][:2] for i in inn], fill=(40, 12, 14))
    return im.filter(ImageFilter.GaussianBlur(1.2))

EST = {'ok': dict(), 'escuro': dict(luz=.28), 'virado': dict(yaw=35), 'perto': dict(esc=1.55), 'boca': dict(boca=1.6)}
if __name__ == '__main__':
    e = sys.argv[1] if len(sys.argv) > 1 else 'ok'
    out = open('/tmp/manequim-%s.mjpeg' % e, 'wb')
    for f in range(30):
        b = io.BytesIO(); quadro(**EST[e], dx=math.sin(f / 5) * 3).save(b, 'JPEG', quality=88); out.write(b.getvalue())
    out.close(); quadro(**EST[e]).save('/tmp/manequim-%s.jpg' % e); print('/tmp/manequim-%s.mjpeg' % e)

# ---- roteiro para o vídeo (video.py): o mesmo "cliente" passa por virado → boca aberta → pouca luz → parado ----
def roteiro(t, luz_volta):
    """t em segundos desde que a câmera abriu. luz_volta=True: na Proposta a luz da tela clareia o rosto a partir de 8,0 s."""
    yaw = 35 if t < 3.5 else (35 * (1 - (t - 3.5)) if t < 4.5 else 0)
    boca = 1.6 if 4.5 <= t < 6.5 else (1.6 * (1 - (t - 6.5) * 2) if 6.5 <= t < 7.0 else 0)
    luz = 1.0 if t < 7.0 else (1 - (t - 7.0) / .3 * .72 if t < 7.3 else .28)
    if luz_volta and t >= 8.0: luz = min(.9, .28 + (t - 8.0) / .4 * .62)
    return dict(yaw=yaw, boca=boca, luz=luz, dx=math.sin(t * 6) * 3)

def filme(nome, luz_volta, seg=24, fps=30):
    out = open('/tmp/filme-%s.mjpeg' % nome, 'wb')
    for f in range(seg * fps):
        b = io.BytesIO(); quadro(**roteiro(f / fps, luz_volta)).resize((960, 720)).save(b, 'JPEG', quality=85); out.write(b.getvalue())
    out.close(); return '/tmp/filme-%s.mjpeg' % nome
