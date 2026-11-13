# S221 (13/11/2026): esboços de precisão da Mochi — (1) letra em tamanho real (calibrar com um cartão) e (4) teste no computador a 60 cm com letra 2×.
import os, textwrap
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
OLHO = open(A + '../kit/olho.js').read()
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def folha(nome, tit, sub, pecas, lado=True):
    if lado: Wt = sum(p[2].width for p in pecas) + 40 * (len(pecas) - 1) + 80; Hc = max(p[2].height for p in pecas) + 60
    else: Wt = max(p[2].width for p in pecas) + 80; Hc = sum(p[2].height + 60 for p in pecas) + 20
    Wt = max(1100, Wt); lin = textwrap.wrap(sub, int((Wt - 80) / 15.2))
    B = Image.new('RGB', (Wt, 150 + 36 * len(lin) + Hc), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 30), tit, font=F(42, 1), fill='#2a1a28')
    for m, ln in enumerate(lin): d.text((40, 90 + m * 36), ln, font=F(27), fill='#5b4a56')
    x, y = 40, 110 + 36 * len(lin)
    for rot, cor, im in pecas:
        d.text((x, y), rot, font=F(27, 1), fill=cor); B.paste(im, (x, y + 40))
        if lado: x += im.width + 40
        else: y += im.height + 60
    B.save(A + 's221_%s.jpg' % nome, quality=86); print('ok', nome, flush=True)
def red(p, w=None, h=None): im = Image.open(p).convert('RGB'); return im.resize((w, int(im.height * w / im.width))) if w else im.resize((int(im.width * h / im.height), h))
CAL = """()=>{const g=document.querySelector('#gw');g.querySelector('.gzbal').textContent='Antes de empezar: apoyá una tarjeta sobre la pantalla y mové la barra hasta que el dibujo quede del mismo tamaño.';
 const c=[...g.querySelectorAll('*')].find(e=>e.children.length<=3&&/Cámara solo/.test(e.textContent)&&e.getBoundingClientRect().height<140&&e.getBoundingClientRect().height>50);
 c.innerHTML='<div style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:6px 0 2px"><div style="width:86%;aspect-ratio:85.6/54;border:2px dashed var(--ac,#8d3a69);border-radius:12px;display:flex;align-items:center;justify-content:center;color:var(--mu,#6b5a66);font:500 13px Inter,sans-serif;background:rgba(141,58,105,.04)">tarjeta de banco o cédula</div><div style="display:flex;align-items:center;gap:10px;width:86%"><span style="font:600 18px Inter;color:var(--ac,#8d3a69)">−</span><div style="flex:1;height:4px;border-radius:4px;background:#e6d5df;position:relative"><i style="position:absolute;left:58%;top:-9px;width:22px;height:22px;border-radius:50%;background:var(--ac,#8d3a69);box-shadow:0 2px 6px rgba(0,0,0,.2)"></i></div><span style="font:600 18px Inter;color:var(--ac,#8d3a69)">+</span></div><small style="font:400 13px Inter,sans-serif;color:var(--mu,#6b5a66)">Se hace una sola vez en este celular.</small></div>';
 const b=g.querySelectorAll('.gzgo');b[0].textContent='Listo';b[1].textContent='Ahora no'}"""
PC = """()=>{const g=document.querySelector('#gw');for(let i=0;i<9;i++){const l=document.getElementById('gzl'+i);if(l)l.style.fontSize=(parseFloat(getComputedStyle(l).fontSize)*2)+'px'}
 const ch=[...g.querySelectorAll('*')].find(e=>e.children.length===0&&/No veo tu rostro/.test(e.textContent));if(ch){ch.style.color='#14803f';ch.style.borderColor='#bfe3cc';setInterval(()=>{if(ch.textContent!=='60 cm ✓')ch.textContent='60 cm ✓'},20)}}"""
with sync_playwright() as pw:
    # (1) calibrar o tamanho real — celular
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    r = {}
    for modo in ('hoje', 'prop'):
        c = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, locale='es-PY', service_workers='block'); c.route('**/*', rota); pg = c.new_page(); pg.goto('http://localhost:8811/?r=descubri-tu-graduacion'); pg.wait_for_timeout(4000)
        if modo == 'hoje': pg.screenshot(path='/tmp/c_hoje.png')
        else: pg.click('.gzgo'); pg.wait_for_timeout(4500); pg.evaluate(CAL); pg.wait_for_timeout(400); pg.screenshot(path='/tmp/c_prop.png')
        r[modo] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; c.close()
    b.close(); print('calibrar olho', r)
    folha('1_tamanho_real', 'Celular · letra em tamanho real (ponto 1)', 'Hoje o teste começa direto e a letra é medida em pontos da tela, que mudam de tamanho de um celular para outro. Proposta: uma única vez por aparelho, a Mochi pede para apoiar um cartão na tela e ajustar a barra; daí em diante a letra sai no tamanho certo em milímetros.', [('HOJE · começa direto', '#b42318', red('/tmp/c_hoje.png', h=1000)), ('PROPOSTA · 1 passo, 1 vez', '#1f8a4c', red('/tmp/c_prop.png', h=1000))])
    # (4) computador a 60 cm
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'])
    for W, H in ((1366, 768), (1280, 720), (1920, 1080)):
        c = b.new_context(viewport={'width': W, 'height': H}, locale='es-PY', service_workers='block'); c.route('**/*', rota); pg = c.new_page(); pg.goto('http://localhost:8811/?r=descubri-tu-graduacion'); pg.wait_for_timeout(4000); pg.click('.gzgo'); pg.wait_for_timeout(11000)
        h = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; pg.screenshot(path='/tmp/p_hoje.png'); pg.evaluate(PC); pg.wait_for_timeout(500); p = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; pg.screenshot(path='/tmp/p_prop.png')
        cabe = pg.evaluate("()=>{const f=document.querySelector('#gzfw').getBoundingClientRect();return [...document.querySelectorAll('[id^=gzl]')].filter(l=>{const r=l.querySelector('span')?l.querySelector('span').getBoundingClientRect():l.getBoundingClientRect();return r.height&&r.top<f.bottom&&r.bottom>f.top}).map(l=>{const r=(l.querySelector('span')||l).getBoundingClientRect();return [Math.round(r.right-f.right),Math.round(r.height)]})}")
        print(W, 'olho hoje', h, 'proposta', p, 'linhas (passa da moldura px, altura):', cabe); c.close()
        if W == 1366: folha('4_computador', 'Computador · teste a 60 cm (ponto 4)', 'Hoje, no computador, a letra tem o mesmo tamanho do celular (feita para 30 cm) e a Mochi fala de segurar o celular. Proposta: a webcam mede a distância (etiqueta "60 cm ✓") e a letra cresce na mesma proporção (60 cm = letra 2×), para o olho ver o mesmo tamanho. Sem webcam: "um braço até a tela".', [('HOJE', '#b42318', red('/tmp/p_hoje.png', w=1400)), ('PROPOSTA', '#1f8a4c', red('/tmp/p_prop.png', w=1400))], False)
    b.close()
