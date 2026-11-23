"""IDEIAS 09m · a cor do logo suavizada (contraste conferido ≥ 4,5); antes: 09l N3: a delicadeza do N2 com a cor do logo cheia (assinatura, como o azul Tiffany); antes: 09j N refinado com o estudo das marcas de luxo com cor própria (Rare Beauty, Cartier, Tiffany, Van Cleef), na cor do logo #7c486c (a partir do 09g), na página da peça REAL (pacote aprovado /tmp/a8k :8760, sem evento).
Cada proposta é um CSS curto aplicado na mesma tela; recorta a linha de compra (quantidade + Comprar). Saída: esboco-09m-comprar-suave-logo.jpg"""
import os, sys
sys.path.insert(0, '/home/claude/lafouch/work/ideias/09-botoes')
src = open('/home/claude/lafouch/work/ideias/09-botoes/scan.py').read().split('JS = r')[0].replace("'http://localhost:8751'", "'http://localhost:8760'")
exec(src)
from PIL import Image, ImageDraw, ImageFont
B = 'html body:not(#_a):not(#_b) .bb.p'
LIMPA = 'html body .wa,html body #wa,html body .waf,html body [class*=wafl]{visibility:hidden!important}' + B + '{box-shadow:none!important;transform:none!important}' + B + ' .shn{display:none!important}'
P = [
 ('N3 · cor do logo pura', 'marcada: a cor exata do arquivo do logo (#7c486c)', LIMPA + B + '{background:#7c486c!important;color:#fff!important;font:400 12px Inter,system-ui,sans-serif!important;letter-spacing:.2em!important;text-transform:uppercase!important;padding:0 22px 0 26px!important;box-shadow:inset 0 0 0 4px #7c486c,inset 0 0 0 5px rgba(255,255,255,.42)!important}' + B + ' em{background:none!important;width:auto!important;color:#fff!important}' + B + ' em svg{width:16px!important;height:16px!important;stroke-width:1.4!important}' + B + ' small{font:inherit!important;opacity:.85!important;border-left:1px solid rgba(255,255,255,.4);margin-left:14px!important;padding-left:14px!important}'),
 ('S1 · logo suave', 'a mesma cor com 15% de branco (#906382)', LIMPA + B + '{background:#906382!important;color:#fff!important;font:400 12px Inter,system-ui,sans-serif!important;letter-spacing:.2em!important;text-transform:uppercase!important;padding:0 22px 0 26px!important;box-shadow:inset 0 0 0 4px #906382,inset 0 0 0 5px rgba(255,255,255,.42)!important}' + B + ' em{background:none!important;width:auto!important;color:#fff!important}' + B + ' em svg{width:16px!important;height:16px!important;stroke-width:1.4!important}' + B + ' small{font:inherit!important;opacity:.85!important;border-left:1px solid rgba(255,255,255,.45);margin-left:14px!important;padding-left:14px!important}'),
 ('S2 · logo empoeirado', 'a mesma cor, menos saturada, como tecido lavado (#8d6380)', LIMPA + B + '{background:#8d6380!important;color:#fff!important;font:400 12px Inter,system-ui,sans-serif!important;letter-spacing:.2em!important;text-transform:uppercase!important;padding:0 22px 0 26px!important;box-shadow:inset 0 0 0 4px #8d6380,inset 0 0 0 5px rgba(255,255,255,.42)!important}' + B + ' em{background:none!important;width:auto!important;color:#fff!important}' + B + ' em svg{width:16px!important;height:16px!important;stroke-width:1.4!important}' + B + ' small{font:inherit!important;opacity:.85!important;border-left:1px solid rgba(255,255,255,.45);margin-left:14px!important;padding-left:14px!important}'),
 ('S3 · rosé do logo', 'a cor do logo bem clara no fundo (#e2d7df); letra e costura na cor do logo', LIMPA + B + '{background:#e2d7df!important;color:#7c486c!important;font:400 12px Inter,system-ui,sans-serif!important;letter-spacing:.2em!important;text-transform:uppercase!important;padding:0 22px 0 26px!important;box-shadow:inset 0 0 0 1px rgba(124,72,108,.55),inset 0 0 0 4px #e2d7df,inset 0 0 0 5px rgba(124,72,108,.25)!important}' + B + ' em{background:none!important;width:auto!important;color:#7c486c!important}' + B + ' em svg{width:16px!important;height:16px!important;stroke-width:1.4!important}' + B + ' small{font:inherit!important;opacity:.85!important;border-left:1px solid rgba(124,72,108,.35);margin-left:14px!important;padding-left:14px!important}'),
 ('S4 · lavanda do logo', 'um meio-termo claro (#d8c8d3) com letra ameixa escura', LIMPA + B + '{background:#d8c8d3!important;color:#4f2a44!important;font:400 12px Inter,system-ui,sans-serif!important;letter-spacing:.2em!important;text-transform:uppercase!important;padding:0 22px 0 26px!important;box-shadow:inset 0 0 0 1px rgba(124,72,108,.55),inset 0 0 0 4px #d8c8d3,inset 0 0 0 5px rgba(124,72,108,.25)!important}' + B + ' em{background:none!important;width:auto!important;color:#4f2a44!important}' + B + ' em svg{width:16px!important;height:16px!important;stroke-width:1.4!important}' + B + ' small{font:inherit!important;opacity:.85!important;border-left:1px solid rgba(79,42,68,.35);margin-left:14px!important;padding-left:14px!important}'),
 ('N2 · como estava', 'quase branco; o logo só na letra e no fio', LIMPA + B + '{background:linear-gradient(120deg,#fdfbfc 0%,#f6eef2 55%,#fbf7f9 100%)!important;color:#7c486c!important;font:400 12px Inter,system-ui,sans-serif!important;letter-spacing:.2em!important;text-transform:uppercase!important;padding:0 22px 0 26px!important;box-shadow:inset 0 0 0 1px rgba(124,72,108,.62),inset 0 0 0 4px #fbf7f9,inset 0 0 0 5px rgba(124,72,108,.22)!important}' + B + ' em{background:none!important;width:auto!important;color:#7c486c!important}' + B + ' em svg{width:16px!important;height:16px!important;stroke-width:1.4!important}' + B + ' small{font:inherit!important;opacity:.8!important;border-left:1px solid rgba(124,72,108,.35);margin-left:14px!important;padding-left:14px!important}'),
]
tela = [t for t in RS.TELAS if t['nome'] == 'Peça'][0]
cortes = []
with sync_playwright() as pw:
    b = sim.navegador(pw)
    c = sim.contexto(b, 390, 844, toque=True, movimento=False, csp_livre=False, camera=True)
    c.add_init_script(C.INIT); c.add_init_script(DATA); fontes(c)
    # o config real está com ativo:false (site em manutenção agora); no esboço, a loja aberta e sem evento
    c.route('**/documents/config/site**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body='{"name":"x/config/site","fields":{"ativo":{"booleanValue":true}}}'))
    pg = c.new_page()
    for _ in range(4):
        RS.vai(pg, URL, tela); pg.wait_for_timeout(1500)
        if pg.query_selector('.bb.p'): break
        print('catálogo não carregou, de novo')
    pg.evaluate("()=>document.querySelector('.bb.p').scrollIntoView({block:'center'})"); pg.wait_for_timeout(500)
    for i, (n, d, css) in enumerate(P):
        pg.evaluate("()=>{const m=document.querySelector('.bb.p small');if(m&&!m.dataset.o)m.dataset.o=m.textContent;if(m)m.textContent=m.dataset.o}")
        if i>=0: pg.evaluate("()=>{const m=document.querySelector('.bb.p small');if(m)m.textContent=m.dataset.o.replace(/^\\s*·\\s*/,'')}")
        pg.evaluate("c=>{let s=document.getElementById('v9g');if(!s){s=document.createElement('style');s.id='v9g';document.head.appendChild(s)}s.textContent=c}", css); pg.wait_for_timeout(300)
        r = pg.evaluate("()=>{const e=document.querySelector('.buy').getBoundingClientRect();return [e.left,e.top,e.right,e.bottom]}")
        fn = '/tmp/c9m_%d.png' % i; pg.screenshot(path=fn, clip={'x': 0, 'y': r[1] - 110, 'width': 390, 'height': r[3] - r[1] + 150}); cortes.append(fn)
    b.close()
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; f1, f2 = ImageFont.truetype(F.replace('.ttf', '-Bold.ttf'), 24), ImageFont.truetype(F, 17)
ims = [Image.open(x).convert('RGB') for x in cortes]; w, h = ims[0].size; S = 2
cols = 3; rows = 2; g = 28
W = Image.new('RGB', (cols * (w + g) + g, 80 + rows * (h + 130)), 'white'); dr = ImageDraw.Draw(W)
dr.text((g, 18), 'Comprar · a cor do logo, mais suave', font=f1, fill='#141414')
for i, im in enumerate(ims):
    x = g + (i % cols) * (w + g); y = 70 + (i // cols) * (h + 130)
    dr.text((x, y), P[i][0], font=f1, fill='#7c486c')
    import textwrap; dr.text((x, y + 30), '\n'.join(textwrap.wrap(P[i][1], 40)), font=f2, fill='#6b6763')
    W.paste(im, (x, y + 112)); dr.rectangle([x - 1, y + 111, x + w, y + 112 + h], outline='#ddd')
W.save('esboco-09m-comprar-suave-logo.jpg', quality=90); print(W.size)
