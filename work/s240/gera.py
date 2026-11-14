# S240 · site: favoritar sem círculo e alinhado; "Últimas unidades" discreto dentro da foto com pulso suave; favorito voa até a sacola e ela dá um toque leve.
import os, textwrap, json
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
OLHO = open(A + '../kit/olho.js').read()
CSS = """
/* favoritar: só o coração, sem círculo nem sombra; área de toque de 44 px; alinhado ao canto da foto */
#grid .card .fav{background:none!important;box-shadow:none!important;border:0!important;width:44px!important;height:44px!important;top:6px!important;right:6px!important;border-radius:12px!important}
#grid .card .fav svg{width:22px!important;height:22px!important;filter:drop-shadow(0 0 2px #fff) drop-shadow(0 0 2px #fff)}
/* Últimas unidades: etiqueta clara dentro da foto, letra escura, pontinho que respira devagar */
#grid .card{position:relative}
#grid .card .ulin{position:absolute!important;z-index:3;display:inline-flex!important;align-items:center;gap:6px;padding:4px 9px 4px 8px;border-radius:999px;background:rgba(255,255,255,.92);box-shadow:0 1px 4px rgba(42,31,39,.10);font:600 11.5px/1.2 Inter,system-ui,sans-serif!important;letter-spacing:.01em;color:var(--tx,#2a1f27)!important;text-transform:none!important;margin:0!important}
#grid .card .ulin i{width:6px!important;height:6px!important;background:#b5482a!important;animation:lfresp 2.6s ease-in-out infinite!important}
@keyframes lfresp{0%,100%{opacity:.35;transform:scale(.85)}50%{opacity:1;transform:scale(1)}}
"""
JS = """()=>{document.querySelectorAll('#grid .card .ulin').forEach(u=>{const c=u.closest('.card'),im=c.querySelector('img'),cr=c.getBoundingClientRect(),ir=im.getBoundingClientRect();u.style.left=Math.round(ir.left-cr.left+8)+'px';u.style.top=Math.round(ir.bottom-cr.top-8-24)+'px'})}"""
VOA = """()=>{const f=document.querySelector('#grid .card .fav'),sv=f.querySelector('svg'),b=document.querySelector('#bagbtn'),a=sv.getBoundingClientRect(),z=b.getBoundingClientRect();const g=sv.cloneNode(true);g.style.cssText='position:fixed;left:'+a.left+'px;top:'+a.top+'px;width:'+a.width+'px;height:'+a.height+'px;z-index:99;color:#8d3a69;fill:#8d3a69;pointer-events:none';document.body.appendChild(g);sv.style.fill='#8d3a69';
 const dx=z.left+z.width/2-(a.left+a.width/2),dy=z.top+z.height/2-(a.top+a.height/2);
 window.__v1=g.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+dx*.45+'px,'+(dy*.45-46)+'px) scale(1.15)',opacity:1,offset:.45},{transform:'translate('+dx+'px,'+dy+'px) scale(.35)',opacity:.2}],{duration:620,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'});
 window.__v2=b.animate([{transform:'scale(1)'},{transform:'scale(1.14)'},{transform:'scale(1)'}],{duration:320,delay:560,easing:'cubic-bezier(.2,.8,.2,1)'});window.__v1.pause();window.__v2.pause()}"""
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def folha(nome, tit, sub, pecas, vertical=False, larg=62):
    lin = textwrap.wrap(sub, larg)
    if vertical: Wt = max(p[2].width for p in pecas) + 80; Ht = 130 + 36 * len(lin) + sum(p[2].height + 70 for p in pecas)
    else: Wt = sum(p[2].width for p in pecas) + 40 * (len(pecas) - 1) + 80; Ht = 170 + 36 * len(lin) + max(p[2].height for p in pecas) + 40
    B = Image.new('RGB', (Wt, Ht), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 30), tit, font=F(36, 1), fill='#2a1a28')
    for m, ln in enumerate(lin): d.text((40, 86 + m * 36), ln, font=F(25), fill='#5b4a56')
    x, y = 40, 106 + 36 * len(lin)
    for rot, cor, im in pecas:
        d.text((x, y), rot, font=F(26, 1), fill=cor); B.paste(im, (x, y + 44)); d.rectangle((x - 1, y + 43, x + im.width, y + 44 + im.height), outline='#c9bcc5')
        if vertical: y += im.height + 70
        else: x += im.width + 40
    B.save(A + 's240_%s.jpg' % nome, quality=86); print('ok', nome, flush=True)
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    for arq, W, H in (('celular', 390, 844), ('pc', 1366, 768)):
        im = {}; ol = {}
        for modo in ('hoje', 'prop'):
            c = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2 if W < 900 else 1, is_mobile=W < 900, has_touch=W < 900, locale='es-PY', service_workers='block'); c.add_init_script("sessionStorage.setItem('lf_ni','1')"); c.route('**/*', rota)
            pg = c.new_page(); pg.goto('http://localhost:8811/?r=tienda'); pg.wait_for_timeout(2600)
            if modo == 'prop': pg.add_style_tag(content=CSS); pg.evaluate(JS); pg.wait_for_timeout(500)
            ol[modo] = {x['r']: x['n'] for x in pg.evaluate(OLHO)}; p = '/tmp/s240_%s_%s.png' % (arq, modo); pg.screenshot(path=p); x = Image.open(p).convert('RGB')
            im[modo] = x.resize((int(x.width * 900 / x.height), 900)) if W < 900 else x.resize((1300, int(x.height * 1300 / x.width)))
            if modo == 'prop' and arq == 'celular':
                pg.screenshot(path='/tmp/s240_zoom.png', clip={'x': 0, 'y': 190, 'width': 390, 'height': 500})
                pg.evaluate(VOA); qs = []
                for t in (0, 150, 300, 450, 620, 760):
                    pg.evaluate("t=>{__v1.currentTime=Math.min(t,620);__v2.currentTime=t}", t); pg.wait_for_timeout(80); pg.screenshot(path='/tmp/s240_q.png', clip={'x': 0, 'y': 0, 'width': 390, 'height': 420}); qs.append(('%d ms' % t, '#5b4a56', Image.open('/tmp/s240_q.png').convert('RGB').resize((390, 420))))
                folha('3_favorito_voa_quadros', 'Favoritar · o coração vai até a sacola · 6 quadros', 'Sai do cartão em arco (0,62 s, mesma curva do padrão) e a sacola dá um toque leve quando ele chega.', qs, larg=150)
            c.close()
        print(arq, 'olho pioras:', [(r, ol['hoje'].get(r, 0), ol['prop'][r]) for r in ol['prop'] if ol['prop'][r] > ol['hoje'].get(r, 0)], '| melhoras:', [(r, ol['hoje'][r], ol['prop'].get(r, 0)) for r in ol['hoje'] if ol['prop'].get(r, 0) < ol['hoje'][r]])
        folha('1_catalogo_celular' if arq == 'celular' else '2_catalogo_pc', 'Catálogo · %s' % ('celular 390' if arq == 'celular' else 'notebook 1366'), 'Favoritar: só o coração, sem círculo, alinhado ao canto da foto. Últimas unidades: etiqueta clara dentro da foto, letra escura, pontinho que respira devagar.', [('HOJE', '#b42318', im['hoje']), ('PROPOSTA', '#1f8a4c', im['prop'])], vertical=arq == 'pc', larg=62 if arq == 'celular' else 100)
    z = Image.open('/tmp/s240_zoom.png').convert('RGB'); z.save(A + 's240_zoom.jpg', quality=88)
