# S222: folhas HOJE × PROPOSTA (um arquivo por tela) + quadros da transformação + vídeo
import os, sys, glob, shutil, subprocess, textwrap
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from prop import css, JS, EST
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def folha(nome, tit, sub, pecas, hc=1000):
    pecas = [(a, c, im.resize((int(im.width * hc / im.height), hc))) for a, c, im in pecas]
    Wt = max(1000, sum(p[2].width for p in pecas) + 40 * (len(pecas) - 1) + 80); lin = textwrap.wrap(sub, int((Wt - 80) / 15.2))
    B = Image.new('RGB', (Wt, 170 + 36 * len(lin) + hc + 40), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 30), tit, font=F(40, 1), fill='#2a1a28')
    for m, ln in enumerate(lin): d.text((40, 90 + m * 36), ln, font=F(27), fill='#5b4a56')
    x, y = 40, 110 + 36 * len(lin)
    for rot, cor, im in pecas: d.text((x, y), rot, font=F(27, 1), fill=cor); B.paste(im, (x, y + 44)); d.rectangle((x - 1, y + 43, x + im.width, y + 44 + im.height), outline='#c9bcc5'); x += im.width + 40
    B.save(A + 's222_%s.jpg' % nome, quality=86); print('ok', nome, flush=True)
def abre(b, W, H, modo, video=None):
    kw = dict(viewport={'width': W, 'height': H}, device_scale_factor=2, is_mobile=W < 900, has_touch=True, locale='es-PY', service_workers='block')
    if video: kw.update(record_video_dir=video, record_video_size={'width': W, 'height': H}, device_scale_factor=1)
    c = b.new_context(**kw); c.add_init_script("sessionStorage.setItem('lf_ni','1')"); c.route('**/*', rota); pg = c.new_page(); pg.goto('http://localhost:8811/'); pg.wait_for_timeout(2600)
    if modo == 'prop': pg.add_style_tag(content=css(W)); pg.evaluate(JS)
    pg.mouse.move(W / 2, H * .6); pg.wait_for_timeout(1400); return c, pg
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    for nome, rot, W, H in (('celular', 'celular 390', 390, 844), ('celular_pequeno', 'celular pequeno 320', 320, 568), ('tablet', 'tablet 600', 600, 960)):
        im = {}
        for modo in ('hoje', 'prop'):
            c, pg = abre(b, W, H, modo); pg.screenshot(path='/tmp/s222_%s_topo.png' % modo); im[modo, 'topo'] = Image.open('/tmp/s222_%s_topo.png' % modo).convert('RGB')
            if nome == 'celular':
                pg.mouse.wheel(0, H * .3); pg.wait_for_timeout(330); pg.screenshot(path='/tmp/s222_%s_rol.png' % modo); im[modo, 'rol'] = Image.open('/tmp/s222_%s_rol.png' % modo).convert('RGB')
                for p in range(14):
                    pg.wait_for_timeout(1500); e = pg.evaluate(EST)
                    if e['forma'] == 'livre' and e['cobre'] == 0 and p > 0: break
                    pg.mouse.wheel(0, H * .3)
                print(modo, 'livre no passo', p, e); pg.screenshot(path='/tmp/s222_%s_livre.png' % modo); im[modo, 'livre'] = Image.open('/tmp/s222_%s_livre.png' % modo).convert('RGB')
            c.close()
        folha('1_%s_parado' % nome if nome == 'celular' else ('4_' if nome == 'celular_pequeno' else '5_') + nome + '_parado', 'WhatsApp · %s · parado' % rot, 'Hoje: meio círculo cortado na beirada e meio apagado (parece defeito). Proposta: uma lingueta inteira, com o ícone inteiro, dentro da margem da página — não cobre nada.', [('HOJE', '#b42318', im['hoje', 'topo']), ('PROPOSTA', '#1f8a4c', im['prop', 'topo'])])
        if nome == 'celular':
            folha('2_celular_rolando', 'WhatsApp · celular 390 · enquanto a tela rola', 'Hoje: some. Proposta: a lingueta continua no lugar; o cliente nunca perde o WhatsApp de vista.', [('HOJE', '#b42318', im['hoje', 'rol']), ('PROPOSTA', '#1f8a4c', im['prop', 'rol'])])
            folha('3_celular_lugar_livre', 'WhatsApp · celular 390 · quando há lugar livre', 'Igual a hoje: a lingueta abre e vira o círculo inteiro, com o pulso.', [('HOJE', '#b42318', im['hoje', 'livre']), ('PROPOSTA', '#1f8a4c', im['prop', 'livre'])])
    # quadros da transformação (lingueta → círculo), 0,32 s
    c, pg = abre(b, 390, 844, 'prop')
    for p in range(14):
        pg.wait_for_timeout(1500); e = pg.evaluate(EST)
        if e['forma'] == 'livre' and e['cobre'] == 0 and p > 0: break
        pg.mouse.wheel(0, H * .3) if False else pg.mouse.wheel(0, 844 * .3)
    pg.evaluate("document.documentElement.classList.add('lfmin')"); pg.wait_for_timeout(700); qs = []
    pg.evaluate("document.documentElement.classList.remove('lfmin');document.getAnimations().forEach(a=>a.pause())")
    for t in (0, 80, 160, 240, 320):
        pg.evaluate("t=>document.getAnimations().forEach(a=>{a.currentTime=Math.min(t,a.effect.getComputedTiming().duration)})", t); pg.wait_for_timeout(120)
        pg.screenshot(path='/tmp/s222_q.png', clip={'x': 390 - 150, 'y': 844 - 190, 'width': 150, 'height': 190}); qs.append(('%d ms' % t, '#5b4a56', Image.open('/tmp/s222_q.png').convert('RGB')))
    c.close(); folha('6_transformacao_quadros', 'A lingueta vira círculo · 5 quadros (0,32 s)', 'Mesma curva suave do padrão de movimento. Sem pulo: largura, altura e canto mudam juntos.', qs, hc=520)
    # vídeo: rolar, parar, rolar (hoje × proposta lado a lado)
    vs = []
    for modo in ('hoje', 'prop'):
        shutil.rmtree('/tmp/s222v_' + modo, ignore_errors=True); c, pg = abre(b, 390, 844, modo, video='/tmp/s222v_' + modo)
        for bloco in range(4):
            for k in range(14): pg.mouse.wheel(0, 20); pg.wait_for_timeout(40)
            pg.wait_for_timeout(1900)
        c.close(); vs.append(glob.glob('/tmp/s222v_%s/*.webm' % modo)[0])
    b.close()
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '4', '-i', vs[0], '-ss', '4', '-i', vs[1], '-filter_complex', "[0:v]pad=iw+20:ih+60:0:60:color=0xece6ea,drawtext=text='HOJE':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=30:fontcolor=0xb42318:x=20:y=14[a];[1:v]pad=iw:ih+60:0:60:color=0xece6ea,drawtext=text='PROPOSTA':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=30:fontcolor=0x1f8a4c:x=20:y=14[b];[a][b]hstack", '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', A + 's222_whatsapp_rolando.mp4'])
print('video', os.path.getsize(A + 's222_whatsapp_rolando.mp4'))
