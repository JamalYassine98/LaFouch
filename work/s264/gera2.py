# S264b · site: giro mais fácil — a peça se mexe sozinha ao abrir (dica), deslize curto com embalo e encaixe nas paradas.  python3 gera2.py
import os, math
src = open(os.path.dirname(os.path.abspath(__file__)) + '/gera.py').read(); exec(src[:src.index('with sync_playwright()')])
CSS += """#s4h{position:absolute;left:10px;bottom:15px;height:30px;padding:0 13px 0 10px;border-radius:999px;display:flex;align-items:center;gap:7px;white-space:nowrap;background:rgba(255,255,255,.92);color:var(--tx);border:1px solid color-mix(in srgb,var(--tx) 14%,transparent);font:600 12px Inter,system-ui,sans-serif;opacity:0;pointer-events:none}"""
DICA = """()=>{document.querySelector('.pgl .big').insertAdjacentHTML('beforeend','<span id="s4h"><svg width="18" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2 2 7l5 5M19 2l5 5-5 5M2 7h22"/></svg>Deslizá para girar</span>')}"""
S = lambda k: (lambda k: k * k * (3 - 2 * k))(max(0, min(1, k))); E4 = lambda k: 1 - (1 - max(0, min(1, k))) ** 4; CURTO = 7; Y = 330
def est(t, P):   # (quadro, mix, vista inicial, dedo x, dedo y, dica, legenda)
    if t < 500: return (FR, 0, 0, None, None, 0, 'abre na vista inicial')
    if t < 1700: k = (t - 500) / 1200; return (FR + 9 * math.sin(math.pi * S(k)), 0, 0, None, None, S((t - 500) / 250), 'ao abrir: a peça se mexe sozinha uma vez e mostra a dica')
    if t < 2600: return (FR, 0, 0, None, None, 1, 'ao abrir: a peça se mexe sozinha uma vez e mostra a dica')
    def passo(t0, a, b, x0, x1, leg):   # deslize curto (300 ms) + embalo até a parada (800 ms) + descanso
        if t < t0 + 300: k = (t - t0) / 300; return (a + (CURTO if b > a else -CURTO) * k, 0, 1, x0 + (x1 - x0) * k, Y, 1 - S(k * 2), leg)
        if t < t0 + 1100: a2 = a + (CURTO if b > a else -CURTO); return (a2 + (b - a2) * E4((t - t0 - 300) / 800), 0, 1, None, None, 0, leg)
        return (b, 0, 1, None, None, 0, leg)
    if t < 4400: return passo(2600, FR, Q34, 250, 190, 'deslize curto: solta, a peça continua e encaixa na 3/4')
    if t < 6200: return passo(4400, Q34, QPF, 250, 190, 'outro deslize curto: encaixa no perfil')
    if t < 8000: return passo(6200, QPF, Q34, 190, 250, 'para o outro lado funciona igual')
    if t < 8500: return (Q34, 0, 1, P[2], P[3], 0, 'ou toca em Vista inicial')
    if t < 9600: return (Q34 + (FR - Q34) * E4((t - 8500) / 1000), 0, 1 - S((t - 9200) / 300), None, None, 0, 'a peça volta sozinha para a frente')
    return (FR, 0, 0, None, None, 0, 'de volta à vista inicial')
def poe2(pg, e): pg.evaluate("a=>{window.s4(a[0],a[1],a[2],a[3],a[4]);document.querySelector('#s4h').style.opacity=a[5]}", list(e[:6])); pg.wait_for_timeout(50)
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox']); c, pg = site(b, 390, 844)
    pg.add_style_tag(content=CSS); P = pg.evaluate(JS, [N, FR, Q34, QPF]); pg.evaluate(DICA); pg.wait_for_timeout(300)
    clip = {'x': 0, 'y': 137, 'width': 390, 'height': 480}; q = []
    for leg, t in (('1 · abre: mexe sozinha + dica', 1100), ('2 · deslize curto', 2850), ('3 · continua e encaixa na 3/4', 4000), ('4 · outro deslize: perfil', 5800), ('5 · Vista inicial: volta', 9700)):
        poe2(pg, est(t, P)); pg.wait_for_timeout(150); q.append((leg, '#5b4a57', shot(pg, clip, 330)))
    folha('s264_site_giro_facil', 'Site · girar a peça com facilidade', 'A peça mostra que gira, um deslize curto basta e ela encaixa sozinha na frente, 3/4 ou perfil.', q)
    poe2(pg, est(1100, P)); pg.wait_for_timeout(200); o = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; print('olho com a dica:', o)
    d = '/tmp/s264v2'; shutil.rmtree(d, ignore_errors=True); os.makedirs(d); n = 0
    for t in range(0, 10200, 40):
        e = est(t, P); poe2(pg, e); x = shot(pg, {'x': 0, 'y': 71, 'width': 390, 'height': 600}, 480)
        Bq = Image.new('RGB', (x.width + 40, x.height + 126), '#ece6ea'); dr = ImageDraw.Draw(Bq); dr.text((20, 14), 'Site · giro fácil', font=F(22, 1), fill='#2a1a28'); dr.text((20, 52), e[6], font=F(17, 1), fill=G); Bq.paste(x, (20, 96)); Bq = Bq.crop((0, 0, Bq.width - Bq.width % 2, Bq.height - Bq.height % 2)); Bq.save('%s/%05d.png' % (d, n)); n += 1
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '25', '-i', d + '/%05d.png', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '22', '-movflags', '+faststart', A + 's264_video_site_giro_facil.mp4'], check=True); print('ok vídeo', n)
