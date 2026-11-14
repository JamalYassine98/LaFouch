# S259 · conceitos do 360 completo: peça que o cliente gira e amplia (site, celular e computador) e o Estúdio do app (fila e câmera do giro).
# AVISO: ainda não existe giro real de nenhuma peça — os ângulos são SIMULADOS inclinando a foto de frente (até 35°). O zoom usa a foto real.  python3 gera.py
import os, subprocess, sys, time, shutil
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
OLHO = open(A + '../kit/olho.js').read(); V, G = '#b42318', '#1f8a4c'
subprocess.run('bash /tmp/srv.sh >/dev/null 2>&1', shell=True)
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8891', '-d', A + '../../www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1)
rota = lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def folha(arq, tit, sub, partes, vertical=False, gap=24):
    W = (max(i.width for _, _, i in partes) if vertical else sum(i.width + gap for _, _, i in partes) - gap) + 80
    H = 140 + (sum(i.height + 60 for _, _, i in partes) if vertical else max(i.height for _, _, i in partes) + 60)
    B = Image.new('RGB', (W, H), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 24), tit, font=F(30, 1), fill='#2a1a28'); d.text((40, 70), sub, font=F(19), fill='#5b4a57'); x, y = 40, 120
    for rot, cor, im in partes:
        d.text((x, y), rot, font=F(22, 1), fill=cor); B.paste(im, (x, y + 36)); d.rectangle((x - 1, y + 35, x + im.width, y + 36 + im.height), outline='#c9bcc5')
        if vertical: y += im.height + 60
        else: x += im.width + gap
    B.save(A + arq + '.jpg', quality=88); print('ok', arq, B.size, flush=True)
# o que a proposta injeta na página da peça (site)
CSS_SITE = """.pgl .big{touch-action:none}.pgl .big img{transform-origin:50% 55%;will-change:transform}
.pgl .big .zh{left:50%!important;right:auto!important;transform:translateX(-50%);background:color-mix(in srgb,var(--tx) 78%,transparent)!important;white-space:nowrap}
#s259arc{position:absolute;left:50%;bottom:54px;width:132px;height:20px;transform:translateX(-50%);pointer-events:none}
#s259ang{display:flex;gap:8px;margin:12px 0 4px;flex-wrap:wrap}
#s259ang button{font:600 13px Inter,system-ui,sans-serif;min-height:44px;padding:0 16px;border-radius:999px;background:transparent;color:var(--tx);border:1px solid color-mix(in srgb,var(--tx) 22%,transparent)}
#s259ang button.on{border-color:var(--tx);background:color-mix(in srgb,var(--tx) 6%,transparent)}
#s259dedo{position:fixed;width:46px;height:46px;border-radius:50%;background:rgba(141,58,105,.22);border:1.5px solid rgba(141,58,105,.7);pointer-events:none;z-index:99999;opacity:0;transform:translate(-50%,-50%)}"""
JS_SITE = """()=>{const b=document.querySelector('.pgl .big'),z=b.querySelector('.zh');const tx=[...z.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());if(tx)tx.textContent=' Arrastá para girar';else z.lastChild.textContent=' Arrastá para girar';
 b.insertAdjacentHTML('beforeend','<svg id="s259arc" viewBox="0 0 132 20"><path d="M6 6 Q66 22 126 6" fill="none" stroke="currentColor" stroke-opacity=".28" stroke-width="1.5" stroke-linecap="round"/><circle id="s259pt" cx="66" cy="14" r="3.5" fill="currentColor"/></svg>');
 b.insertAdjacentHTML('afterend','<div id="s259ang"><button class="on">360°</button><button>Frente</button><button>3/4</button><button>Perfil</button></div>');
 document.body.insertAdjacentHTML('beforeend','<i id="s259dedo"></i>');
 window.s259=(ang,zoom,ox,oy,dx,dy)=>{const im=b.querySelector('img');im.style.transformOrigin=(ox||50)+'% '+(oy||55)+'%';im.style.transform='perspective(1100px) rotateY('+ang+'deg) scale('+(zoom||1)+')';const k=(ang+35)/70,x=6+120*k,y=6+16*4*k*(1-k)*.99;const p=document.querySelector('#s259pt');p.setAttribute('cx',x);p.setAttribute('cy',y);const d=document.querySelector('#s259dedo');if(dx!=null){d.style.opacity=1;d.style.left=dx+'px';d.style.top=dy+'px'}else d.style.opacity=0;document.querySelector('#s259arc').style.opacity=(zoom||1)>1.05?0:1;z.style.opacity=(zoom||1)>1.05||Math.abs(ang)>2?0:1}}"""
def site(b, W, H):
    c = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2 if W < 900 else 1, is_mobile=W < 700, has_touch=W < 700, locale='es-PY', service_workers='block'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', rota)
    pg = c.new_page(); pg.goto('http://localhost:8811/?r=tienda'); pg.wait_for_selector('#grid .card'); pg.wait_for_timeout(2300); pg.evaluate("document.querySelector('#grid .card .open').click()"); pg.wait_for_timeout(2300); return c, pg
def shot(pg, clip=None, larg=None):
    pg.screenshot(path='/tmp/s259.png', **({'clip': clip} if clip else {})); x = Image.open('/tmp/s259.png').convert('RGB'); return x.resize((larg, int(x.height * larg / x.width))) if larg else x
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'])
    # ───── 1 e 2 · site no celular
    im = {}; ol = {}
    for modo in ('hoje', 'prop'):
        c, pg = site(b, 390, 844)
        if modo == 'prop': pg.add_style_tag(content=CSS_SITE); pg.evaluate(JS_SITE); pg.evaluate("window.s259(0,1)")
        pg.wait_for_timeout(300); ol[modo, 0] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; im[modo] = shot(pg, None, 430)
        pg.evaluate("document.querySelector('.scrim.pg').scrollBy(0,500)"); pg.wait_for_timeout(300); ol[modo, 1] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; pg.evaluate("document.querySelector('.scrim.pg').scrollTo(0,0)")
        if modo == 'prop':
            clip = {'x': 0, 'y': 137, 'width': 390, 'height': 400}; q = []
            for leg, a in (('chega e dá uma volta lenta', (20, 1)), ('…e para de frente', (0, 1)), ('o dedo arrasta: gira', (-32, 1, 50, 55, 120, 300)), ('pinça: amplia o detalhe', (0, 2.6, 16, 46, None, None))):
                pg.evaluate("a=>window.s259(...a)", list(a)); pg.wait_for_timeout(200); q.append((leg, '#5b4a57', shot(pg, clip, 340)))
            folha('s259_site_celular_peca_quadros', 'Site · peça giratória · 4 momentos', 'Ângulos SIMULADOS com a foto de frente (ainda não há giro real). O zoom é da foto real.', q)
            # vídeo
            d = '/tmp/s259v'; shutil.rmtree(d, ignore_errors=True); os.makedirs(d); n = 0; E4 = lambda k: 1 - (1 - max(0, min(1, k))) ** 4; S = lambda k: (lambda k: k * k * (3 - 2 * k))(max(0, min(1, k)))
            def est(t):
                if t < 2600: k = t / 2600; import math; return (35 * math.sin(k * math.pi * 2) * (1 - .15 * k), 1, 50, 55, None, None, 'chega: uma volta lenta e para')
                if t < 3200: return (0, 1, 50, 55, None, None, 'chega: uma volta lenta e para')
                if t < 5600:
                    k = (t - 3200) / 2400; import math; a = -33 * math.sin(k * math.pi * 1.5) if k < .67 else -33 * math.sin(math.pi) + 33 * (1 - S((k - .67) / .33)) * 0 + (33 * (1 - S((k - .67) / .33)))
                    x = 195 + (-a) * 2.6; return (a if k < .67 else 33 * (1 - S((k - .67) / .33)), 1, 50, 55, x if k < .67 else None, 330 if k < .67 else None, 'o dedo arrasta: a peça gira junto e desacelera sozinha')
                if t < 6100: return (0, 1, 50, 55, None, None, 'pinça: amplia')
                if t < 7300: return (0, 1 + 1.7 * E4((t - 6100) / 700), 16, 46, None, None, 'pinça: amplia o detalhe')
                if t < 8300: k = S((t - 7300) / 1000); return (0, 2.7, 16 + 68 * k, 46, None, None, 'arrasta ampliado: percorre a peça')
                return (0, 2.7 - 1.7 * E4((t - 8300) / 500), 84, 46, None, None, 'toque duplo: volta ao tamanho normal')
            for t in range(0, 9200, 33):
                e = est(t); pg.evaluate("a=>window.s259(...a)", list(e[:6])); pg.wait_for_timeout(8); x = shot(pg, {'x': 0, 'y': 71, 'width': 390, 'height': 560}, 480)
                Bq = Image.new('RGB', (x.width + 40, x.height + 150), '#ece6ea'); dr = ImageDraw.Draw(Bq); dr.text((20, 14), 'Site · peça giratória (conceito)', font=F(24, 1), fill='#2a1a28'); dr.text((20, 50), e[6], font=F(18, 1), fill=G); dr.text((20, 80), 'ângulos simulados com a foto de frente', font=F(15), fill='#5b4a57'); Bq.paste(x, (20, 112)); Bq = Bq.crop((0, 0, Bq.width - Bq.width % 2, Bq.height - Bq.height % 2)); Bq.save('%s/%05d.png' % (d, n)); n += 1
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '30', '-i', d + '/%05d.png', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '21', '-movflags', '+faststart', A + 's259_video_site_peca_giratoria.mp4'], check=True); print('ok vídeo', n, 'quadros')
        c.close()
    print('olho celular pioras:', [(k, r, ol['hoje', k].get(r, 0), v) for k in (0, 1) for r, v in ol['prop', k].items() if v > ol['hoje', k].get(r, 0)])
    folha('s259_site_celular_peca', 'Site · página da peça · celular', 'A foto vira peça giratória: arrastar gira, pinça amplia; os ângulos prontos ficam logo abaixo', [('HOJE', V, im['hoje']), ('PROPOSTA', G, im['prop'])])
    # ───── 3 · site no computador
    im = {}; ol = {}
    for modo in ('hoje', 'prop'):
        c, pg = site(b, 1366, 768)
        if modo == 'prop': pg.add_style_tag(content=CSS_SITE + ".pgl .big{cursor:grab}"); pg.evaluate(JS_SITE); pg.evaluate("window.s259(-24,1)")
        pg.wait_for_timeout(300); ol[modo] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; im[modo] = shot(pg, None, 1100); c.close()
    print('olho PC pioras:', [(r, ol['hoje'].get(r, 0), v) for r, v in ol['prop'].items() if v > ol['hoje'].get(r, 0)])
    folha('s259_site_pc_peca', 'Site · página da peça · computador', 'Arrastar com o mouse gira; a roda do mouse amplia. Na foto de baixo a peça está a meio giro (simulado).', [('HOJE', V, im['hoje']), ('PROPOSTA', G, im['prop'])], vertical=True)
    # ───── 4 · app · tela do Estúdio (a fila mostra o que cada peça tem)
    def app():
        c = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True, service_workers='block', permissions=['camera']); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}"); c.route('**/*', rota)
        pg = c.new_page(); pg.on('dialog', lambda d: d.dismiss()); pg.goto('http://localhost:8891/index.html#test'); pg.wait_for_function('window.__LF'); pg.wait_for_timeout(900); pg.evaluate("()=>{const t=[...document.querySelectorAll('#v-inicio .tl')].find(e=>/Estúdio/.test(e.innerText));t.click()}"); pg.wait_for_timeout(1200); return c, pg
    im = {}
    for modo in ('hoje', 'prop'):
        c, pg = app()
        if modo == 'prop': print('   fila:', pg.evaluate("""()=>{const o=document.querySelector('.estOv');const st=document.createElement('style');st.textContent='.s259c{display:flex;gap:6px;margin-top:6px}.s259c i{font:600 11.5px Inter,system-ui,sans-serif;font-style:normal;padding:3px 9px;border-radius:999px;border:1px solid color-mix(in srgb,currentColor 20%,transparent);opacity:.55}.s259c i.ok{opacity:1;border-color:transparent;background:color-mix(in srgb,#1f8a4c 14%,transparent);color:#1f8a4c}';document.head.appendChild(st);let n=0;[...o.querySelectorAll('*')].filter(e=>e.children.length===0&&/falta a foto de 3\\/4/.test(e.textContent)).forEach(e=>{const cor=e.textContent.split('·')[0].trim();e.innerHTML=cor+'<span class="s259c"><i class="ok">Frente</i><i>3/4</i><i>360°</i></span>';n++});return n}"""))
        pg.wait_for_timeout(300); im[modo] = shot(pg, None, 430); c.close()
    folha('s259_app_estudio_fila', 'App · Estúdio · a fila', 'Cada peça mostra o que já tem (frente, 3/4, 360°) em vez de só "falta a foto de 3/4". Botões e nomes iguais.', [('HOJE', V, im['hoje']), ('PROPOSTA', G, im['prop'])])
    # ───── 5 · app · câmera do giro: anel de 0 a 360°
    c, pg = app(); pg.evaluate("document.querySelector('.estOv [data-e=sessao]').click()"); pg.wait_for_timeout(2800); q = [('HOJE · câmera do Estúdio', V, shot(pg, None, 330))]
    pg.evaluate("""()=>{document.body.insertAdjacentHTML('beforeend','<div id="s259g" style="position:fixed;left:0;right:0;top:250px;z-index:99999;display:grid;place-items:center;pointer-events:none;color:#fff;font-family:Inter,system-ui,sans-serif"><svg width="236" height="236" viewBox="0 0 236 236"><circle cx="118" cy="118" r="112" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="2"/><circle id="s259r" cx="118" cy="118" r="112" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-dasharray="703.7" stroke-dashoffset="703.7" transform="rotate(-90 118 118)"/></svg><div id="s259t" style="margin-top:14px;font:500 24px Georgia,serif"></div><div id="s259s" style="margin-top:4px;font-size:13.5px;opacity:.85"></div></div>');window.s259g=(g,t,s)=>{document.querySelector('#s259r').setAttribute('stroke-dashoffset',703.7*(1-g/360));document.querySelector('#s259t').textContent=t;document.querySelector('#s259s').textContent=s}}""")
    for leg, a in (('PROPOSTA · começo', (0, 'Ligue o prato', 'peça de frente · uma volta inteira')), ('PROPOSTA · girando', (150, '150°', 'velocidade boa · não mexa no celular')), ('PROPOSTA · volta completa', (360, 'Volta completa', '36 ângulos · frente, 3/4 e perfil separados'))):
        pg.evaluate("a=>window.s259g(...a)", list(a)); pg.wait_for_timeout(200); q.append((leg, G, shot(pg, None, 330)))
    c.close()
    folha('s259_app_estudio_camera_giro', 'App · Estúdio · filmar o giro', 'Um anel enche de 0 a 360° enquanto a peça gira no prato (câmera falsa do simulador, por isso o verde). Controles de hoje mantidos.', q)
finally: srv.terminate()
