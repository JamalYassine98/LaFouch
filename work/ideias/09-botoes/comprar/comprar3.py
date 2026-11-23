"""IDEIAS 09i · o Comprar rosé/seda mais luxuoso, na cor do logo #7c486c (a partir do 09g), na página da peça REAL (pacote aprovado /tmp/a8k :8760, sem evento).
Cada proposta é um CSS curto aplicado na mesma tela; recorta a linha de compra (quantidade + Comprar). Saída: esboco-09i-comprar-logo.jpg"""
import os, sys
sys.path.insert(0, '/home/claude/lafouch/work/ideias/09-botoes')
src = open('/home/claude/lafouch/work/ideias/09-botoes/scan.py').read().split('JS = r')[0].replace("'http://localhost:8751'", "'http://localhost:8760'")
exec(src)
from PIL import Image, ImageDraw, ImageFont
B = 'html body:not(#_a):not(#_b) .bb.p'
LIMPA = B + '{box-shadow:none!important;transform:none!important}' + B + ' .shn{display:none!important}'
P = [
 ('Hoje', 'degradê claro, brilho e sombra, carrinho num círculo', ''),
 ('K · Rosé do logo', 'o F na cor exata do logo (#7c486c): fundo rosé do logo, letra e fio na cor do logo', LIMPA + B + '{background:#f5eef2!important;color:#7c486c!important;font:500 15px Inter,system-ui,sans-serif!important;letter-spacing:.02em!important;padding:0 20px 0 24px!important;box-shadow:inset 0 0 0 1px rgba(124,72,108,.45)!important}' + B + ' em{background:none!important;width:auto!important;color:#7c486c!important}' + B + ' em svg{width:17px!important;height:17px!important;stroke-width:1.6!important}' + B + ' small{font:inherit!important;opacity:.75!important}'),
 ('L · Seda do logo', 'o H: rosé do logo que brilha de leve no meio, como cetim; fio fino', LIMPA + B + '{background:linear-gradient(120deg,#faf6f8 0%,#efe3ea 55%,#f6eef3 100%)!important;color:#7c486c!important;font:500 15px Inter,system-ui,sans-serif!important;letter-spacing:.02em!important;padding:0 20px 0 24px!important;box-shadow:inset 0 0 0 1px rgba(124,72,108,.45)!important}' + B + ' em{background:none!important;width:auto!important;color:#7c486c!important}' + B + ' em svg{width:17px!important;height:17px!important;stroke-width:1.6!important}' + B + ' small{font:inherit!important;opacity:.75!important}'),
 ('M · Seda + etiqueta', 'o L com a letra em caixa alta espaçada, a voz das etiquetas da loja', LIMPA + B + '{background:linear-gradient(120deg,#faf6f8 0%,#efe3ea 55%,#f6eef3 100%)!important;color:#7c486c!important;font:500 12.5px Inter,system-ui,sans-serif!important;letter-spacing:.18em!important;text-transform:uppercase!important;padding:0 20px 0 24px!important;box-shadow:inset 0 0 0 1px rgba(124,72,108,.45)!important}' + B + ' em{background:none!important;width:auto!important;color:#7c486c!important}' + B + ' em svg{width:17px!important;height:17px!important;stroke-width:1.6!important}' + B + ' small{font:inherit!important;opacity:.75!important}'),
 ('N · Seda + estojo', 'o L com fio duplo, como a costura de um estojo de óculos', LIMPA + B + '{background:linear-gradient(120deg,#faf6f8 0%,#efe3ea 55%,#f6eef3 100%)!important;color:#7c486c!important;font:500 12.5px Inter,system-ui,sans-serif!important;letter-spacing:.18em!important;text-transform:uppercase!important;padding:0 20px 0 24px!important;box-shadow:inset 0 0 0 1px rgba(124,72,108,.5),inset 0 0 0 3px #f3e9ef,inset 0 0 0 4px rgba(124,72,108,.28)!important}' + B + ' em{background:none!important;width:auto!important;color:#7c486c!important}' + B + ' em svg{width:17px!important;height:17px!important;stroke-width:1.6!important}' + B + ' small{font:inherit!important;opacity:.75!important}'),
 ('O · Seda + Fraunces', 'o L com "Comprar" na letra dos títulos da loja', LIMPA + B + '{background:linear-gradient(120deg,#faf6f8 0%,#efe3ea 55%,#f6eef3 100%)!important;color:#7c486c!important;font:400 18px var(--display),serif!important;letter-spacing:.01em!important;padding:0 20px 0 26px!important;box-shadow:inset 0 0 0 1px rgba(124,72,108,.45)!important}' + B + ' em{background:none!important;width:auto!important;color:#7c486c!important}' + B + ' em svg{width:17px!important;height:17px!important;stroke-width:1.6!important}' + B + ' small{font:500 13px Inter,system-ui,sans-serif!important;letter-spacing:.04em!important;opacity:.75!important}'),
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
        pg.evaluate("c=>{let s=document.getElementById('v9g');if(!s){s=document.createElement('style');s.id='v9g';document.head.appendChild(s)}s.textContent=c}", css); pg.wait_for_timeout(300)
        r = pg.evaluate("()=>{const e=document.querySelector('.buy').getBoundingClientRect();return [e.left,e.top,e.right,e.bottom]}")
        fn = '/tmp/c9i_%d.png' % i; pg.screenshot(path=fn, clip={'x': 0, 'y': r[1] - 110, 'width': 390, 'height': r[3] - r[1] + 150}); cortes.append(fn)
    b.close()
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; f1, f2 = ImageFont.truetype(F.replace('.ttf', '-Bold.ttf'), 24), ImageFont.truetype(F, 17)
ims = [Image.open(x).convert('RGB') for x in cortes]; w, h = ims[0].size; S = 2
cols = 3; rows = 2; g = 28
W = Image.new('RGB', (cols * (w + g) + g, 80 + rows * (h + 110)), 'white'); dr = ImageDraw.Draw(W)
dr.text((g, 18), 'Comprar · rosé e seda na cor do logo, mais luxuoso (peça real, celular)', font=f1, fill='#141414')
for i, im in enumerate(ims):
    x = g + (i % cols) * (w + g); y = 70 + (i // cols) * (h + 110)
    dr.text((x, y), P[i][0], font=f1, fill='#8d3a69' if i else '#6b6763')
    import textwrap; dr.text((x, y + 30), '\n'.join(textwrap.wrap(P[i][1], 44)), font=f2, fill='#6b6763')
    W.paste(im, (x, y + 92)); dr.rectangle([x - 1, y + 91, x + w, y + 92 + h], outline='#ddd')
W.save('esboco-09i-comprar-logo.jpg', quality=90); print(W.size)
