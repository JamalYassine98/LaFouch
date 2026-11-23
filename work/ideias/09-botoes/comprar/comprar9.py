"""IDEIAS 09p · o P1 suave (#7f5773) com os detalhes: estados (normal, ao tocar, adicionando, adicionado), total ao lado da
quantidade quando passa de 1, a mesma altura e linha da caixa de quantidade (48 px), e o "mouse em cima" do PC.
Página da peça real (pacote aprovado /tmp/a8k :8760, sem evento). Saída: esboco-09p-comprar-detalhes.jpg"""
import os, sys, textwrap
src = open('/home/claude/lafouch/work/ideias/09-botoes/scan.py').read().split('JS = r')[0].replace("'http://localhost:8751'", "'http://localhost:8760'")
exec(src)
from PIL import Image, ImageDraw, ImageFont
B = 'html body:not(#_a):not(#_b) .bb.p'
Q = 'html body:not(#_a):not(#_b) .buyrow .mq'
BASE = ('html body .wa{visibility:hidden!important}' + B + '{box-shadow:none!important;transform:none!important;border:0!important;'
        'font:500 13px Inter,system-ui,sans-serif!important;letter-spacing:.18em!important;text-transform:uppercase!important;color:#fff!important;'
        'justify-content:center!important;padding:0 24px!important;height:48px!important;min-height:48px!important;transition:background-color .3s!important}'
        + B + ' em,' + B + ' small,' + B + ' .shn{display:none!important}'
        # quantidade: mesma altura e mesma pílula do botão, fio fino
        + Q + '{height:48px!important;border-radius:999px!important;border:1px solid #d9cfd5!important}'
        + 'html body .buyrow{align-items:center!important}'
        + 'html body .l9tot{font:400 13px Inter,system-ui,sans-serif;color:#6b6763;text-align:right;margin:0 0 8px;letter-spacing:.02em}html body .l9tot b{font-weight:500;color:#141414}')
COR = {'normal': '#7f5773', 'tocar': '#6f4a65', 'pc': '#8a627f'}
E_ = [
 ('Normal', 'cor do logo suave; só a palavra; botão e quantidade da mesma altura, na mesma linha', 'normal', None, 1),
 ('Ao tocar', 'escurece de leve; não pula nem cresce', 'tocar', None, 1),
 ('Adicionando', 'a palavra dá lugar a "…" no mesmo tamanho (o botão não muda de largura)', 'normal', '···', 1),
 ('Adicionado', '"ADICIONADO" por um instante, depois abre o aviso; sem verde', 'normal', 'Adicionado', 1),
 ('Duas unidades', 'sem o preço no botão, o total aparece pequeno acima, só quando passa de 1', 'normal', None, 2),
 ('PC · mouse em cima', 'a cor clareia devagar (0,3 s); sem sombra nem sublinhado', 'pc', None, 1),
]
tela = [t for t in RS.TELAS if t['nome'] == 'Peça'][0]; cortes = []
with sync_playwright() as pw:
    b = sim.navegador(pw); c = sim.contexto(b, 390, 844, toque=True, movimento=False, csp_livre=False, camera=True)
    c.add_init_script(C.INIT); c.add_init_script(DATA); fontes(c)
    c.route('**/documents/config/site**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body='{"name":"x/config/site","fields":{"ativo":{"booleanValue":true}}}'))
    pg = c.new_page()
    for _ in range(4):
        RS.vai(pg, URL, tela); pg.wait_for_timeout(1500)
        if pg.query_selector('.bb.p'): break
    pg.evaluate("()=>{const s=document.createElement('style');s.id='v9p';document.head.appendChild(s);const b=document.querySelector('.bb.p span');b.dataset.o=b.firstChild.textContent;document.querySelector('.bb.p').scrollIntoView({block:'center'})}")
    pr = pg.evaluate("()=>{const t=document.querySelector('.det')?.innerText||'';const m=t.match(/R\\$\\s*([0-9.]+)/);return m?+m[1].replace('.',''):35}")
    for i, (n, d, cor, txt, q) in enumerate(E_):
        pg.evaluate("a=>{document.getElementById('v9p').textContent=a[0]+a[1];const s=document.querySelector('.bb.p span');s.firstChild.textContent=a[2]||s.dataset.o;"
                    "document.querySelector('.buyrow [data-pqn]').textContent=a[3];let t=document.querySelector('.l9tot');if(a[3]>1){if(!t){t=document.createElement('div');t.className='l9tot';document.querySelector('.buyrow').before(t)}t.innerHTML='Total <b>R$ '+a[4]+'</b>'}else if(t)t.remove()}",
                    [BASE, B + '{background:%s!important}' % COR[cor], txt, q, pr * q])
        pg.wait_for_timeout(350)
        r = pg.evaluate("()=>{const e=document.querySelector('.buy').getBoundingClientRect();return [e.top,e.bottom]}")
        fn = '/tmp/c9p_%d.png' % i; pg.screenshot(path=fn, clip={'x': 0, 'y': r[0] - 40, 'width': 390, 'height': r[1] - r[0] + 70}); cortes.append(fn)
    b.close()
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; f1, f2 = ImageFont.truetype(F.replace('.ttf', '-Bold.ttf'), 22), ImageFont.truetype(F, 16)
ims = [Image.open(x).convert('RGB') for x in cortes]; w = 390; h = max(i.size[1] for i in ims); g = 26; cols = 3
W = Image.new('RGB', (cols * (w + g) + g, 70 + 2 * (h + 100)), 'white'); dr = ImageDraw.Draw(W)
dr.text((g, 18), 'Comprar · P1 suave com os detalhes (peça real, celular, sem evento)', font=f1, fill='#141414')
for i, im in enumerate(ims):
    x = g + (i % cols) * (w + g); y = 64 + (i // cols) * (h + 100)
    dr.text((x, y), E_[i][0], font=f1, fill='#7f5773'); dr.text((x, y + 28), '\n'.join(textwrap.wrap(E_[i][1], 42)), font=f2, fill='#6b6763')
    W.paste(im, (x, y + 76)); dr.rectangle([x - 1, y + 75, x + w, y + 76 + im.size[1]], outline='#ddd')
W.save('esboco-09p-comprar-detalhes.jpg', quality=90); print(W.size, pr)
