"""IDEIAS 08 · vídeo: abrir e fechar a BUSCA, MINHA CONTA e o CARRINHO no pacote final (sem evento, fundo branco, fonte real).
HOJE = 08k como foi enviado (/tmp/a9h :8762) · PROPOSTA = 08k2 (/tmp/a8m :8764: Minha conta pela mesma camada). Celular lado a lado; PC um em cima do outro."""
import sys, json, os, base64, shutil, subprocess
from playwright.sync_api import sync_playwright
AQ = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQ)
import nav
from video import sim, INIT, rota
exec(open(os.path.join(AQ, 'semev.py')).read().split("nome, porta = sys.argv")[0])
def grava(nome, porta, W, H):
    pasta = '/tmp/vc-%s-%d' % (nome, W); shutil.rmtree(pasta, ignore_errors=True); os.makedirs(pasta); pc = W > 700
    with sync_playwright() as pw:
        b, c, pg = abre(pw, porta, W, H, not pc); fontes(c); pg.reload(); pg.wait_for_timeout(3500)
        cdp = c.new_cdp_session(pg); Q = []
        def q(ev): Q.append((ev['metadata']['timestamp'], ev['data'])); cdp.send('Page.screencastFrameAck', {'sessionId': ev['sessionId']})
        cdp.on('Page.screencastFrame', q)
        cdp.send('Page.startScreencast', {'format': 'jpeg', 'quality': 88, 'maxWidth': W * (1 if pc else 2), 'maxHeight': H * (1 if pc else 2)})
        pg.wait_for_timeout(700)
        for sel in ('#mnb', '#contabtn', '#sbtn', '#bagbtn'):
            el = pg.query_selector(sel)
            if not el or not el.is_visible(): continue
            (el.click() if pc else el.tap()); pg.wait_for_timeout(1700)
            el = pg.query_selector(sel)
            try: (el.click() if pc else el.tap())
            except Exception: pg.keyboard.press('Escape')
            pg.wait_for_timeout(1100)
            if sel == '#contabtn' and pg.query_selector('#layer .scrim'): pg.evaluate("history.back()"); pg.wait_for_timeout(900)
        cdp.send('Page.stopScreencast'); c.close(); b.close()
    with open(pasta + '/l.txt', 'w') as f:
        for i, (ts, d) in enumerate(Q):
            fn = '%s/q%05d.jpg' % (pasta, i); open(fn, 'wb').write(base64.b64decode(d))
            f.write("file '%s'\nduration %.4f\n" % (fn, (Q[i + 1][0] - ts) if i + 1 < len(Q) else 1.0))
        f.write("file '%s/q%05d.jpg'\n" % (pasta, len(Q) - 1))
    out = pasta + '/v.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', pasta + '/l.txt', '-vf', ('scale=%d:%d' % (W, H) if pc else 'scale=780:1688') + ',fps=30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', out], check=True)
    return out
FT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
lab = lambda t, c, fs, ph: "pad=iw:ih+%d:0:%d:color=white,drawtext=fontfile=%s:text='%s':x=20:y=%d:fontsize=%d:fontcolor=%s" % (ph, ph, FT, t, ph // 4, fs, c)
ENC = ['-map', '[v]', '-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']
if 'pc' not in sys.argv:
    v = [grava('hoje', 8762, 390, 844), grava('prop', 8764, 390, 844)]
    fc = '[0:v]%s,tpad=stop_mode=clone:stop_duration=3[a];[1:v]%s,tpad=stop_mode=clone:stop_duration=3[b];[a][b]hstack=inputs=2[v]' % (lab('HOJE', '#6b6763', 40, 80), lab('PROPOSTA', '#8d3a69', 40, 80))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', v[0], '-i', v[1], '-filter_complex', fc] + ENC + [os.path.join(AQ, 'esboco-08k2-lado-celular.mp4')], check=True)
if 'cel' not in sys.argv:
    v = [grava('hoje', 8762, 1440, 900), grava('prop', 8764, 1440, 900)]
    fc = '[0:v]%s,tpad=stop_mode=clone:stop_duration=3[a];[1:v]%s,tpad=stop_mode=clone:stop_duration=3[b];[a][b]vstack=inputs=2[v]' % (lab('HOJE', '#6b6763', 32, 60), lab('PROPOSTA', '#8d3a69', 32, 60))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', v[0], '-i', v[1], '-filter_complex', fc] + ENC + [os.path.join(AQ, 'esboco-08k2-lado-pc.mp4')], check=True)
print('ok')
