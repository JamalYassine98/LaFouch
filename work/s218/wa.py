# S218: esboço "WhatsApp inteiro ou escondido" (nunca pela metade) + vídeo do ponto do "Última unidad" pulsando 2 vezes e parando.
import os, sys, glob, shutil, subprocess, textwrap
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
OLHO = open(A + '../kit/olho.js').read()
WA = "html.wamin .wa{transform:scale(.6)!important;opacity:0!important;pointer-events:none!important}html.wamin .wa svg{transform:none!important}"
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def folha(nome, tit, sub, pecas):
    Wt = max(1100, sum(p[2].width for p in pecas) + 40 * (len(pecas) - 1) + 80); lin = textwrap.wrap(sub, int((Wt - 80) / 15.2)); Hc = max(p[2].height for p in pecas) + 60
    B = Image.new('RGB', (Wt, 150 + 36 * len(lin) + Hc), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 30), tit, font=F(42, 1), fill='#2a1a28')
    for m, ln in enumerate(lin): d.text((40, 90 + m * 36), ln, font=F(27), fill='#5b4a56')
    x, y = 40, 110 + 36 * len(lin)
    for rot, cor, im in pecas: d.text((x, y), rot, font=F(27, 1), fill=cor); B.paste(im, (x, y + 40)); x += im.width + 40
    B.save(A + 's218_%s.jpg' % nome, quality=86); print('ok', nome, flush=True)
def red(p, h): im = Image.open(p).convert('RGB'); return im.resize((int(im.width * h / im.height), h))
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    for nome, W, H in (('celular', 390, 844), ('ipad', 768, 1024)):
        res = {}
        for modo in ('hoje', 'prop'):
            c = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2, is_mobile=True, has_touch=True, locale='es-PY', service_workers='block'); c.add_init_script("sessionStorage.setItem('lf_ni','1')"); c.route('**/*', rota); pg = c.new_page(); pg.goto('http://localhost:8811/'); pg.wait_for_timeout(3000)
            if modo == 'prop': pg.add_style_tag(content=WA)
            pg.mouse.move(W / 2, H * 0.6); tem = {}
            for p in range(9):
                pg.mouse.wheel(0, H * 0.45); pg.wait_for_timeout(1500)
                k = 'cobre' if pg.evaluate("document.documentElement.classList.contains('wamin')") else 'livre'
                if k not in tem: tem[k] = p; pg.screenshot(path='/tmp/wa_%s_%s_%s.png' % (nome, modo, k)); res[modo + k] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}
                if len(tem) == 2: break
            c.close()
        print(nome, {k: {r: v.get(r, 0) for r in ('cortado', 'apagado', 'tampado')} for k, v in res.items()})
        folha('wa_%s_cobriria' % nome, 'WhatsApp · %s · quando ficaria em cima de algo' % nome, 'Hoje ele fica pela metade na beirada (parece defeito). Proposta: some por inteiro, com a mesma suavidade de quando a tela rola, e volta inteiro assim que houver lugar livre.', [('HOJE · pela metade', '#b42318', red('/tmp/wa_%s_hoje_cobre.png' % nome, 1000)), ('PROPOSTA · escondido', '#1f8a4c', red('/tmp/wa_%s_prop_cobre.png' % nome, 1000))])
        if os.path.exists('/tmp/wa_%s_prop_livre.png' % nome): folha('wa_%s_livre' % nome, 'WhatsApp · %s · quando há lugar livre' % nome, 'Igual a hoje: inteiro, no canto, com o pulso que você pediu.', [('HOJE', '#b42318', red('/tmp/wa_%s_hoje_livre.png' % nome, 1000)), ('PROPOSTA', '#1f8a4c', red('/tmp/wa_%s_prop_livre.png' % nome, 1000))])
    # vídeo: ponto do "Última unidad" — hoje pisca sem parar; proposta pisca 2 vezes e descansa
    vs = []
    for modo in ('hoje', 'prop'):
        shutil.rmtree('/tmp/vd_' + modo, ignore_errors=True)
        c = b.new_context(viewport={'width': 390, 'height': 700}, is_mobile=True, has_touch=True, locale='es-PY', service_workers='block', record_video_dir='/tmp/vd_' + modo, record_video_size={'width': 390, 'height': 700}); c.add_init_script("sessionStorage.setItem('lf_ni','1')"); c.route('**/*', rota); pg = c.new_page(); import time; t0 = time.time(); pg.goto('http://localhost:8811/?r=armazones'); pg.wait_for_timeout(3000)
        if modo == 'prop': pg.add_style_tag(content=".ulin i{animation-iteration-count:2!important}")
        pg.evaluate("()=>{const g=document.querySelector('#grid');g.style.display='none';void g.offsetWidth;g.style.display=''}"); ini = time.time() - t0; pg.wait_for_timeout(7000); c.close(); vs.append((glob.glob('/tmp/vd_%s/*.webm' % modo)[0], ini))
    b.close()
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '%.2f' % vs[0][1], '-t', '6.5', '-i', vs[0][0], '-ss', '%.2f' % vs[1][1], '-t', '6.5', '-i', vs[1][0], '-filter_complex', '[0:v]crop=390:330:0:330,pad=400:330:0:0:white[a];[1:v]crop=390:330:0:330[b];[a][b]hstack,scale=1180:-2:flags=lanczos', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', A + 's218_ponto_ultima_unidad.mp4'], check=True); print('ok video ponto')
