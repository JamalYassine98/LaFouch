"""IDEIAS 06d · vídeo: Hoje (14 flocos, 10 s) × Proposta (campanha em câmera lenta: 3 fotos que se dissolvem devagar, com aproximação, e texto coreografado)."""
"""IDEIAS 06c · vídeo do efeito do Natal na foto da campanha: regra de hoje (14 flocos, 10 s) × proposta (8 flocos, 4 s)."""
import os, sys, json, base64, shutil, subprocess
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
sys.path.insert(0, '/home/claude/lafouch/work/kit'); sys.path.insert(0, '/home/claude/lafouch/work/ideias/03-bugs-site')
from playwright.sync_api import sync_playwright
import sim
from abas_video import INIT, rota
AQUI = os.path.dirname(os.path.abspath(__file__)); W, H = 390, 844
def grava(porta, nome):
    pasta = '/tmp/vfx-' + nome; shutil.rmtree(pasta, ignore_errors=True); os.makedirs(pasta)
    with sync_playwright() as pw:
        b = sim.navegador(pw); c = sim.contexto(b, W, H, toque=True, dpr=2, lingua='pt-BR'); c.add_init_script(INIT)
        def r2(r):
            if '/config/site' in r.request.url:
                return r.fulfill(status=200, content_type='application/json', body=json.dumps({'fields': {'evento': {'mapValue': {'fields': {'tema': {'stringValue': 'natal'}}}}}}))
            return rota(r)
        c.route('**/*', r2); pg = c.new_page(); cdp = c.new_cdp_session(pg); Q = []
        def q(ev): Q.append((ev['metadata']['timestamp'], ev['data'])); cdp.send('Page.screencastFrameAck', {'sessionId': ev['sessionId']})
        cdp.on('Page.screencastFrame', q)
        pg.goto('http://localhost:%d/?cliente=1' % porta); pg.wait_for_timeout(1500)
        cdp.send('Page.startScreencast', {'format': 'jpeg', 'quality': 88, 'maxWidth': W * 2, 'maxHeight': H * 2})
        pg.wait_for_timeout(400); pg.evaluate("document.querySelectorAll('.lfcamp').forEach(e=>e.remove())")
        pg.wait_for_timeout(14500); cdp.send('Page.stopScreencast'); c.close(); b.close()
    L = []
    for i, (ts, d) in enumerate(Q):
        fn = '%s/q%05d.jpg' % (pasta, i); open(fn, 'wb').write(base64.b64decode(d)); L.append((ts, fn))
    with open(pasta + '/l.txt', 'w') as f:
        for i, (ts, fn) in enumerate(L):
            f.write("file '%s'\nduration %.4f\n" % (fn, (L[i + 1][0] - ts) if i + 1 < len(L) else 0.5))
        f.write("file '%s'\n" % L[-1][1])
    out = pasta + '/v.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', pasta + '/l.txt', '-vf', 'scale=780:1688,fps=30',
                    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', out], check=True)
    return out
FT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
lab = lambda t, c: "pad=iw:ih+80:0:80:color=white,drawtext=fontfile=%s:text='%s':x=20:y=24:fontsize=32:fontcolor=%s" % (FT, t, c)
v = [grava(8729, 'hoje'), grava(8734, 'campanha')]
fc = '[0:v]%s[a];[1:v]%s[b];[a][b]hstack=inputs=2,trim=duration=14[v]' % (lab('HOJE (14 flocos, 10 s)', '#b3261e'), lab('PROPOSTA (campanha em câmera lenta)', '#8d3a69'))
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', v[0], '-i', v[1], '-filter_complex', fc, '-map', '[v]', '-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', os.path.join(AQUI, 'esboco-06d-campanha-natal.mp4')], check=True); print('ok')
