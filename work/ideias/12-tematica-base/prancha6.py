"""IDEIAS 12f · prancha dos enfeites: o cartão das 6 datas (Hoje :8721 × Proposta :8770) + o enfeite ampliado. Saída: esboco-12f-enfeites.jpg"""
import json
src = open('/tmp/rp/lafouch/work/ideias/09-botoes/scan.py').read().split('JS = r')[0]; exec(src)
from PIL import Image, ImageDraw, ImageFont
EV = [('natal', 'Natal'), ('anonovo', 'Ano Novo'), ('maes', 'Dia das Mães'), ('halloween', 'Halloween'), ('pais', 'Dia dos Pais'), ('bf', 'Black Friday')]
def tira(b, porta, tema):
    c = sim.contexto(b, 390, 844, toque=True, movimento=False, csp_livre=False, camera=True); c.add_init_script(C.INIT); fontes(c)
    c.route('**/documents/config/site**', lambda r, q_=None: r.fulfill(status=200, content_type='application/json', body=json.dumps({'name': 'x/config/site', 'fields': {'ativo': {'booleanValue': True}, 'evento': {'mapValue': {'fields': {'tema': {'stringValue': tema}}}}}})))
    pg = c.new_page(); RS.vai(pg, 'http://localhost:%d' % porta, {'nome': '', 'q': '/?cliente=1', 'passos': []}); pg.wait_for_timeout(2500)
    pg.evaluate("()=>{document.querySelectorAll('.wa').forEach(e=>e.style.visibility='hidden')}")
    r = pg.evaluate("()=>{const e=document.querySelector('#hdst');if(!e)return null;const b=e.getBoundingClientRect();return [b.x,b.y+scrollY,b.width,b.height]}")
    fn = '/tmp/t12f_%d_%s.png' % (porta, tema); pg.screenshot(path=fn, clip={'x': r[0] - 8, 'y': r[1] - 8, 'width': r[2] + 16, 'height': r[3] + 16}, full_page=True)
    z = None
    if porta == 8770:
        d = pg.evaluate("()=>{const e=document.querySelector('#hdst .hdeco');if(!e||getComputedStyle(e).display=='none')return null;const b=e.getBoundingClientRect();return [b.x,b.y+scrollY]}")
        if d:
            c2 = sim.contexto(b, 390, 844, toque=True, movimento=False, csp_livre=False, camera=True)
            z = '/tmp/t12f_z_%s.png' % tema; pg.screenshot(path=z, clip={'x': d[0] - 8, 'y': d[1] - 8, 'width': 48, 'height': 48}, full_page=True); c2.close()
    c.close(); return fn, z
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; f1, f2 = ImageFont.truetype(F.replace('.ttf', '-Bold.ttf'), 26), ImageFont.truetype(F, 20)
with sync_playwright() as pw:
    b = sim.navegador(pw); R = [(t, n, tira(b, 8721, t)[0], tira(b, 8770, t)) for t, n in EV]; b.close()
w = 406; par = 2 * w + 12; g = 24; H = max(Image.open(a).height for _, _, a, _ in R) ; ZH = 200
W = Image.new('RGB', (g + 3 * (par + g), 110 + 2 * (H + 60) + ZH + 40), 'white'); d = ImageDraw.Draw(W)
d.text((g, 18), '12f · enfeites de traço fino no lugar dos emojis (na cor da loja, no canto da peça)', font=f1, fill='#141414')
d.text((g, 56), 'Natal estrela · Ano Novo brilho · Mães tulipa · Halloween lua + "Edição Noir" · Pais e Black Friday sem enfeite', font=f2, fill='#6b6763')
for i, (t, n, a, (p, z)) in enumerate(R):
    x = g + (i % 3) * (par + g); y = 96 + (i // 3) * (H + 60)
    d.text((x, y), n + '  ·  Hoje', font=f2, fill='#6b6763'); d.text((x + w + 12, y), 'Proposta', font=f2, fill='#943d6f')
    W.paste(Image.open(a).convert('RGB'), (x, y + 30)); W.paste(Image.open(p).convert('RGB'), (x + w + 12, y + 30))
y = 96 + 2 * (H + 60); d.text((g, y), 'Os enfeites ampliados (4×)', font=f2, fill='#6b6763'); x = g
for t, n, a, (p, z) in R:
    if not z: continue
    im = Image.open(z).convert('RGB').resize((192, 192), Image.LANCZOS); W.paste(im, (x, y + 30)); d.text((x, y + 30 + 150), n, font=f2, fill='#141414'); x += 240
W.save('esboco-12f-enfeites.jpg', quality=86); print(W.size)
