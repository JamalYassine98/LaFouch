"""IDEIAS 12 · prancha da temática em 3 camadas: Natal, Black Friday e Dia das Mães — Início, Peça e Menu, Hoje × Proposta (celular 390).
Hoje = site do ar (cópia /tmp/b5h :8721). Proposta = /tmp/a12 (:8765). O tema entra pelo config/site (evento.tema), como no site real.
Saída: esboco-12-<tema>.jpg"""
import os, sys, json
src = open('/tmp/rp/lafouch/work/ideias/09-botoes/scan.py').read().split('JS = r')[0]
exec(src)
from PIL import Image, ImageDraw, ImageFont
EV = [('natal', 'Natal'), ('bf', 'Black Friday'), ('maes', 'Dia das Mães')]
TELAS = [('Início', '/?cliente=1', []), ('Peça', '/?cliente=1&r=armazones', [('toca', '#grid .card .open')]), ('Menu', '/?cliente=1', [('toca', '#mnb')])]
def tira(b, porta, tema, q, passos, alvo=None):
    c = sim.contexto(b, 390, 844, toque=True, movimento=False, csp_livre=False, camera=True)
    c.add_init_script(C.INIT); fontes(c)
    c.route('**/documents/config/site**', lambda r, q_=None: r.fulfill(status=200, content_type='application/json', body=json.dumps({'name': 'x/config/site', 'fields': {'ativo': {'booleanValue': True}, 'evento': {'mapValue': {'fields': {'tema': {'stringValue': tema}}}}}})))
    pg = c.new_page()
    RS.vai(pg, 'http://localhost:%d' % porta, {'nome': '', 'q': q, 'passos': passos}); pg.wait_for_timeout(1500)
    if alvo: pg.evaluate("s=>{const e=document.querySelector(s);if(e)e.scrollIntoView({block:'center'})}", alvo); pg.wait_for_timeout(400)
    fn = '/tmp/t12_%d_%s_%s.png' % (porta, tema, q.replace('/', '').replace('?', '').replace('&', '')[:20] + str(len(passos))); pg.screenshot(path=fn); c.close(); return fn
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; f1, f2 = ImageFont.truetype(F.replace('.ttf', '-Bold.ttf'), 26), ImageFont.truetype(F, 20)
with sync_playwright() as pw:
    b = sim.navegador(pw)
    for tema, nome in EV:
        fotos = []
        for tn, q, ps in TELAS:
            al = '.bb.p' if tn == 'Peça' else None
            fotos.append((tn, tira(b, 8721, tema, q, ps, al), tira(b, 8765, tema, q, ps, al)))
        w, h, g = 390, 844, 24; par = 2 * w + 12
        W = Image.new('RGB', (g + 3 * (par + g), 120 + h + 50), 'white'); d = ImageDraw.Draw(W)
        d.text((g, 18), '%s · a loja é a mesma, a data aparece nos detalhes' % nome, font=f1, fill='#141414')
        d.text((g, 56), 'Proposta: botões, links e logo na cor da marca; a cor da data só na faixa, no título pequeno do destaque e no fio das janelas; fundo creme', font=f2, fill='#6b6763')
        for i, (tn, a, p) in enumerate(fotos):
            x = g + i * (par + g); y = 100
            d.text((x, y), tn + '  ·  Hoje', font=f2, fill='#6b6763'); d.text((x + w + 12, y), 'Proposta', font=f2, fill='#943d6f')
            W.paste(Image.open(a).convert('RGB'), (x, y + 34)); W.paste(Image.open(p).convert('RGB'), (x + w + 12, y + 34))
            d.rectangle([x + w + 11, y + 33, x + par, y + 34 + h], outline='#943d6f', width=2)
        W.save('esboco-12-%s.jpg' % tema, quality=86); print(tema)
    b.close()
