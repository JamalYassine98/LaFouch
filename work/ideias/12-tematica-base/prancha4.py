"""IDEIAS 12b · prancha da "campanha forte" nas 6 datas: Início do celular (topo até a seleção e o gesto), Hoje × Proposta.
Hoje = site do ar (/tmp/b5h :8721) · Proposta = /tmp/a12d (:8768). Saída: esboco-12b-campanhas-1.jpg (BF, Natal, Ano Novo) e -2 (Mães, Pais, Halloween)"""
import os, json
src = open('/tmp/rp/lafouch/work/ideias/09-botoes/scan.py').read().split('JS = r')[0]
exec(src)
from PIL import Image, ImageDraw, ImageFont
EV = [('bf', 'Black Friday'), ('natal', 'Natal'), ('anonovo', 'Ano Novo'), ('maes', 'Dia das Mães'), ('pais', 'Dia dos Pais'), ('halloween', 'Halloween')]
HH = 1180
def tira(b, porta, tema):
    c = sim.contexto(b, 390, 844, toque=True, movimento=False, csp_livre=False, camera=True); c.add_init_script(C.INIT); fontes(c)
    c.route('**/documents/config/site**', lambda r, q_=None: r.fulfill(status=200, content_type='application/json', body=json.dumps({'name': 'x/config/site', 'fields': {'ativo': {'booleanValue': True}, 'evento': {'mapValue': {'fields': {'tema': {'stringValue': tema}}}}}})))
    pg = c.new_page(); RS.vai(pg, 'http://localhost:%d' % porta, {'nome': '', 'q': '/?cliente=1', 'passos': []}); pg.wait_for_timeout(2500)
    pg.evaluate("()=>{document.querySelectorAll('.wa').forEach(e=>e.style.visibility='hidden')}")
    fn = '/tmp/t12d_%d_%s.png' % (porta, tema); pg.screenshot(path=fn, clip={'x': 0, 'y': 0, 'width': 390, 'height': HH}, full_page=True); c.close(); return fn
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; f1, f2 = ImageFont.truetype(F.replace('.ttf', '-Bold.ttf'), 26), ImageFont.truetype(F, 20)
with sync_playwright() as pw:
    b = sim.navegador(pw); R = [(t, n, tira(b, 8721, t), tira(b, 8768, t)) for t, n in EV]; b.close()
w, g = 390, 24; par = 2 * w + 12
for parte, lst in (('1', R[:3]), ('2', R[3:])):
    W = Image.new('RGB', (g + 3 * (par + g), 110 + HH + 50), 'white'); d = ImageDraw.Draw(W)
    d.text((g, 18), 'As datas na cor oficial da loja (%s/2) · a cor nunca muda; a data está no conteúdo' % parte, font=f1, fill='#141414')
    d.text((g, 56), 'Faixa com a frase da data · campanha (fotos do Semp no lugar das de produto) · seleção · o gesto da data · tudo em #943d6f', font=f2, fill='#6b6763')
    for i, (t, n, a, p) in enumerate(lst):
        x = g + i * (par + g); y = 96
        d.text((x, y), n + '  ·  Hoje', font=f2, fill='#6b6763'); d.text((x + w + 12, y), 'Proposta', font=f2, fill='#943d6f')
        W.paste(Image.open(a).convert('RGB'), (x, y + 34)); W.paste(Image.open(p).convert('RGB'), (x + w + 12, y + 34))
        d.rectangle([x + w + 11, y + 33, x + par, y + 34 + HH], outline='#943d6f', width=2)
    W.save('esboco-12d-datas-cor-oficial-%s.jpg' % parte, quality=86); print(parte)
