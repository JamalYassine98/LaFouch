"""IDEIAS 09g · propostas de luxo só para o botão Comprar, na página da peça REAL (pacote aprovado /tmp/a8k :8760, sem evento).
Cada proposta é um CSS curto aplicado na mesma tela; recorta a linha de compra (quantidade + Comprar). Saída: esboco-09g-comprar.jpg"""
import os, sys
sys.path.insert(0, '/home/claude/lafouch/work/ideias/09-botoes')
src = open('/home/claude/lafouch/work/ideias/09-botoes/scan.py').read().split('JS = r')[0].replace("'http://localhost:8751'", "'http://localhost:8760'")
exec(src)
from PIL import Image, ImageDraw, ImageFont
B = 'html body:not(#_a):not(#_b) .bb.p'
LIMPA = B + '{box-shadow:none!important;transform:none!important}' + B + ' .shn{display:none!important}'
P = [
 ('Hoje', 'degradê claro, brilho e sombra, carrinho num círculo', ''),
 ('A · Vinho liso', 'cor do logo, chapada; carrinho fino sem círculo', LIMPA + B + '{background:var(--ac)!important;font:500 15px Inter,system-ui,sans-serif!important;letter-spacing:.02em!important;padding:0 20px 0 24px!important}' + B + ' em{background:none!important;width:auto!important}' + B + ' em svg{width:18px!important;height:18px!important}' + B + ' small{font:inherit!important;opacity:.8!important}'),
 ('B · Etiqueta', 'caixa alta pequena e espaçada, como as etiquetas "DESTAQUE DA SEMANA" do site', LIMPA + B + '{background:var(--ac)!important;font:500 13px Inter,system-ui,sans-serif!important;letter-spacing:.16em!important;text-transform:uppercase!important;padding:0 24px!important;justify-content:center!important}' + B + ' em{display:none!important}' + B + ' small{font:inherit!important;opacity:.85!important}' ),
 ('C · Degradê refinado', 'o degradê de hoje mais escuro e calmo; sem brilho nem sombra; círculo do carrinho mais fino', LIMPA + B + '{background:linear-gradient(120deg,#5e1d43,var(--ac) 55%,#a2447c)!important;font:500 15px Inter,system-ui,sans-serif!important;letter-spacing:.02em!important}' + B + ' em{background:none!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.45)!important}' + B + ' em svg{width:17px!important;height:17px!important}' + B + ' small{font:inherit!important;opacity:.8!important}'),
 ('D · Fraunces', 'a letra dos títulos da loja no botão: "Comprar" em Fraunces, preço no corpo', LIMPA + B + '{background:var(--ac)!important;font:400 18px var(--display),serif!important;letter-spacing:.01em!important;padding:0 8px 0 26px!important}' + B + ' small{font:500 14px Inter,system-ui,sans-serif!important;opacity:.8!important;letter-spacing:.02em}' + B + ' em{background:rgba(255,255,255,.14)!important}' + B + ' em svg{width:17px!important;height:17px!important}'),
 ('E · Estojo', 'vinho fundo com um fio claro por dentro, como a borda de um estojo de óculos', LIMPA + B + '{background:#6f2250!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),inset 0 0 0 4px #6f2250,inset 0 0 0 5px rgba(255,255,255,.35)!important;font:500 13px Inter,system-ui,sans-serif!important;letter-spacing:.16em!important;text-transform:uppercase!important;padding:0 26px!important;justify-content:center!important}' + B + ' em{display:none!important}' + B + ' small{font:inherit!important;opacity:.85!important}'),
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
        fn = '/tmp/c9g_%d.png' % i; pg.screenshot(path=fn, clip={'x': 0, 'y': r[1] - 110, 'width': 390, 'height': r[3] - r[1] + 150}); cortes.append(fn)
    b.close()
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; f1, f2 = ImageFont.truetype(F.replace('.ttf', '-Bold.ttf'), 24), ImageFont.truetype(F, 17)
ims = [Image.open(x).convert('RGB') for x in cortes]; w, h = ims[0].size; S = 2
cols = 3; rows = 2; g = 28
W = Image.new('RGB', (cols * (w + g) + g, 80 + rows * (h + 110)), 'white'); dr = ImageDraw.Draw(W)
dr.text((g, 18), 'Botão Comprar · propostas de luxo (página da peça real, celular, sem evento)', font=f1, fill='#141414')
for i, im in enumerate(ims):
    x = g + (i % cols) * (w + g); y = 70 + (i // cols) * (h + 110)
    dr.text((x, y), P[i][0], font=f1, fill='#8d3a69' if i else '#6b6763')
    import textwrap; dr.text((x, y + 30), '\n'.join(textwrap.wrap(P[i][1], 44)), font=f2, fill='#6b6763')
    W.paste(im, (x, y + 92)); dr.rectangle([x - 1, y + 91, x + w, y + 92 + h], outline='#ddd')
W.save('esboco-09g-comprar.jpg', quality=90); print(W.size)
