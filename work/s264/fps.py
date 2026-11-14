# S264e · vídeos comparativos na página da peça do site (tela real; só a foto é trocada pelos quadros do giro do dono):
#  (1) esboço atual (6 quadros/s) × 30 quadros/s (reais) × 60 quadros/s (SIMULADO: quadros do meio criados por computador)
#  (2) a 30 quadros/s: guardado como fotos JPEG × guardado como vídeo e desmontado em quadros.   python3 fps.py
import os, math
src = open(os.path.dirname(os.path.abspath(__file__)) + '/gera.py').read(); exec(src[:src.index('with sync_playwright()')])
import numpy as np, io
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox']); c, pg = site(b, 390, 844)
    pg.add_style_tag(content='.pgl .big img{visibility:hidden!important}.pgl .big .zh{display:none!important}'); pg.wait_for_timeout(300)
    r = pg.evaluate("(()=>{const r=document.querySelector('.pgl .big').getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()")
    CY, CH = 71, 600; base = Image.open(io.BytesIO(pg.screenshot(clip={'x': 0, 'y': CY, 'width': 390, 'height': CH}))).convert('RGB'); k = base.width / 390; c.close()
bx, by, bw, bh = [v * k for v in (r[0], r[1] - CY, r[2], r[3])]; fw = int(bw); fh = int(fw * 480 / 720); fx = int(bx); fy = int(by + (bh - fh) / 2); print('caixa da foto', [round(v) for v in (bx, by, bw, bh)], 'escala', k)
baseA = np.asarray(base).copy(); cache = {}
def quadro(pasta, i, um=0):
    key = (pasta, i)
    if key not in cache:
        if len(cache) > 900: cache.clear()
        cache[key] = np.asarray(Image.open('/tmp/kitsite/%s/p%04d.jpg' % (pasta, i + um)).convert('RGB').resize((fw, fh), Image.LANCZOS))
    return cache[key]
def painel(pasta, i, dedo, um=0):
    a = baseA.copy(); a[fy:fy + fh, fx:fx + fw] = np.minimum(a[fy:fy + fh, fx:fx + fw], quadro(pasta, i, um)); im = Image.fromarray(a)   # multiplica: o branco do quadro deixa ver o coração e o selo da página
    if dedo is not None:
        o = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(o); R = 23 * k; x, y = dedo; d.ellipse((x - R, y - R, x + R, y + R), fill=(141, 58, 105, 50), outline=(141, 58, 105, 165), width=max(1, int(1.5 * k))); im = Image.alpha_composite(im.convert('RGBA'), o).convert('RGB')
    return im
S = lambda x: (lambda x: x * x * (3 - 2 * x))(max(0, min(1, x))); F0, F1, FM = 50, 250, 190   # frente, perfil e um ponto no meio, em quadros de 30/s
def est(t):   # ângulo (em quadros de 30/s), dedo na tela?, legenda
    if t < .5: return F0, False, 'parado na frente'
    if t < 3.5: return F0 + (F1 - F0) * S((t - .5) / 3), True, 'arrasto normal: frente → perfil'
    if t < 4: return F1, False, 'arrasto normal: frente → perfil'
    if t < 8.5: return F1 + (FM - F1) * S((t - 4) / 4.5), True, 'arrasto BEM lento (onde o salto mais aparece)'
    if t < 9: return FM, False, 'arrasto BEM lento (onde o salto mais aparece)'
    if t < 10.5: return FM + (F0 - FM) * S((t - 9) / 1.5), True, 'arrasto rápido de volta'
    return F0, False, 'de volta à frente'
def video(arq, tit, cols, fps=60, dur=11):
    d = '/tmp/s264cmp'; shutil.rmtree(d, ignore_errors=True); os.makedirs(d); pw_, ph_ = base.size; W = 20 + len(cols) * (pw_ + 20); H = ph_ + 150; W -= W % 2; H -= H % 2
    for n in range(int(dur * fps)):
        a, toca, leg = est(n / fps); B = Image.new('RGB', (W, H), '#ece6ea'); dr = ImageDraw.Draw(B); dr.text((20, 14), tit, font=F(int(11 * k + 9), 1), fill='#2a1a28'); dr.text((20, 54), leg, font=F(int(9 * k + 8), 1), fill='#5b4a57')
        dedo = (bx + bw * (.82 - .6 * (a - F0) / (F1 - F0)), by + bh * .62) if toca else None
        for j, (rot, cor, pasta, fn, um) in enumerate(cols):
            x = 20 + j * (pw_ + 20); dr.text((x, 100), rot, font=F(int(8 * k + 8), 1), fill=cor); B.paste(painel(pasta, fn(a), dedo, um), (x, 134))
        B.save('%s/%05d.jpg' % (d, n), quality=92)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', d + '/%05d.jpg', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', A + arq + '.mp4'], check=True); print('ok', arq, (W, H), os.path.getsize(A + arq + '.mp4') // 1024, 'kB', flush=True)
video('s264_video_giro_6x30x60', 'Site · fluidez do giro (mesmo arrasto nos três)', [('ESBOÇO ATUAL · 6/s', V, 's264_30', lambda a: int(round(a / 5) * 5), 0), ('30/s (real)', G, 's264_30', lambda a: int(round(a)), 0), ('60/s (simulado)', '#1d5fa8', 's264_60', lambda a: min(694, int(round(a * 2))), 0)])
video('s264_video_giro_fotos_x_video', 'Site · 30/s guardado de duas formas', [('FOTOS · 5,7 MB', V, 's264_30', lambda a: int(round(a)), 0), ('VÍDEO DESMONTADO · 0,6 MB', G, 's264_30v', lambda a: int(round(a)), 1)])
# folha: qualidade ampliada (fotos × vídeo desmontado) em 3 posições
q = []
for nome, i in (('frente', 50), ('3/4', 150), ('perfil', 250)):
    for rot, cor, pasta, um in (('FOTOS', V, 's264_30', 0), ('VÍDEO DESMONTADO', G, 's264_30v', 1)):
        im = Image.open('/tmp/kitsite/%s/p%04d.jpg' % (pasta, i + um)).convert('RGB').crop((240, 250, 480, 410)).resize((480, 320), Image.LANCZOS); q.append(('%s · %s' % (rot, nome), cor, im))
B = Image.new('RGB', (40 + 2 * 500 + 20, 130 + 3 * 366), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 24), 'Qualidade ampliada 2× · fotos × vídeo desmontado', font=F(26, 1), fill='#2a1a28'); d.text((40, 66), 'Mesmo quadro guardado das duas formas (30/s · 349 quadros): 5,7 MB × 0,6 MB.', font=F(17), fill='#5b4a57')
for n, (rot, cor, im) in enumerate(q):
    x = 40 + (n % 2) * 500; y = 110 + (n // 2) * 366; d.text((x, y), rot, font=F(17, 1), fill=cor); B.paste(im, (x, y + 28)); d.rectangle((x - 1, y + 27, x + 480, y + 28 + 320), outline='#c9bcc5')
B.save(A + 's264_qualidade_fotos_x_video.jpg', quality=92); print('ok folha', B.size)
# diferença medida entre quadros vizinhos (quanto a imagem "pula" a cada passo), média em níveis de 0 a 255
def pulo(pasta, passo, n):
    v = [float(np.abs(np.asarray(Image.open('/tmp/kitsite/%s/p%04d.jpg' % (pasta, i)).convert('L'), np.int16) - np.asarray(Image.open('/tmp/kitsite/%s/p%04d.jpg' % (pasta, i + passo)).convert('L'), np.int16)).mean()) for i in range(50, n, passo * 4)]; return round(sum(v) / len(v), 2)
print('pulo médio entre quadros · 6/s:', pulo('s264_30', 5, 245), '· 30/s:', pulo('s264_30', 1, 249), '· 60/s:', pulo('s264_60', 1, 499))
dif = [float(np.abs(np.asarray(Image.open('/tmp/kitsite/s264_30/p%04d.jpg' % i).convert('L'), np.int16) - np.asarray(Image.open('/tmp/kitsite/s264_30v/p%04d.jpg' % (i + 1)).convert('L'), np.int16)).mean()) for i in range(0, 349, 10)]; print('fotos × vídeo desmontado, diferença média: %.2f de 255' % (sum(dif) / len(dif)))
