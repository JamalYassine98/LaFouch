"""IDEIAS 09k · os botões das marcas de luxo, redesenhados a partir das medidas publicadas nos DESIGN.md de shadcn.io
(cor, canto, altura, tamanho, peso, espaço e caixa da letra). A letra própria de cada marca é substituída pela Inter
(as delas são exclusivas). Sem logos. Embaixo: o nosso Hoje e o N2 (recorte da página real). Saída: esboco-09k-marcas.jpg"""
import os
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
from playwright.sync_api import sync_playwright
import base64
FD = '/home/claude/lafouch/work/ideias/08-menu-luxo/fontes'
def b64(p): return base64.b64encode(open(p, 'rb').read()).decode()
H = lambda p: '<img src="data:image/png;base64,%s" style="width:100%%;display:block;border:1px solid #eee">' % b64(p)
M = [
 ('Cartier', 'vermelho da marca só na ação mais importante; o resto preto; canto reto; caixa alta 13 px, espaço 1,5 px, peso 400',
  '<b class=k style="background:#d50032;color:#fff;height:40px;padding:0 22px;border-radius:0;font-size:13px;letter-spacing:1.5px">ADD TO BAG</b><b class=k style="background:#000;color:#fff;height:50px;padding:0 28px;border-radius:0;font-size:13px;letter-spacing:1.5px">DISCOVER</b><b class=k style="background:none;color:#1d1c1c;border:1px solid #1d1c1c;height:40px;padding:0 22px;border-radius:0;font-size:13px;letter-spacing:1.5px">BOOK AN APPOINTMENT</b>'),
 ('Rare Beauty', 'cor ameixa só na letra e na borda, nunca de fundo; pílula; caixa alta 10 px com espaço 5 px; ao passar o mouse, enche',
  '<b class=k style="background:#fff;color:#000914;border:1px solid #000914;height:36px;padding:0 34px;border-radius:100px;font-size:10px;letter-spacing:5px">ADD TO BAG</b><b class=k style="background:none;color:#7f2549;border:1px solid #7f2549;height:36px;padding:0 34px;border-radius:100px;font-size:10px;letter-spacing:5px">SHOP NOW</b><b class=k style="background:#000914;color:#fff;border:1px solid #000914;height:36px;padding:0 34px;border-radius:100px;font-size:10px;letter-spacing:5px">ADD TO BAG · ao passar</b>'),
 ('Van Cleef & Arpels', 'sem botão cheio: a ação é texto pequeno em caixa alta (10 px, espaço 1 px) ou um botão de fio fino',
  '<b class=k style="background:none;color:#222;height:40px;padding:0;border-radius:0;font-size:10px;letter-spacing:1px;text-decoration:underline;text-underline-offset:5px">DISCOVER THE COLLECTION</b><b class=k style="background:none;color:#222;border:1px solid #222;height:40px;padding:0 26px;border-radius:0;font-size:11px;letter-spacing:1.5px">SUBSCRIBE</b>'),
 ('Tiffany (aproximado)', 'o azul Tiffany como a única cor da marca; canto reto; letra serifada (o site bloqueou a leitura: valores tirados das regras públicas da marca)',
  '<b class=k style="background:#81d8d0;color:#000;height:48px;padding:0 30px;border-radius:0;font:400 14px Fraunces,serif;letter-spacing:1px">Add to Bag</b><b class=k style="background:#000;color:#fff;height:48px;padding:0 30px;border-radius:0;font:400 14px Fraunces,serif;letter-spacing:1px">Book an Appointment</b>'),
 ('Four Seasons', 'retângulo cinza médio, letra branca 10 px peso 700 em caixa alta, espaço 3 px; o secundário é só texto sublinhado',
  '<b class=k style="background:#6d6d6d;color:#fff;height:40px;padding:0 26px;border-radius:0;font-size:10px;font-weight:700;letter-spacing:3px">CHECK RATES</b><b class=k style="background:none;color:#222;height:40px;padding:0;border-radius:0;font-size:10px;font-weight:700;letter-spacing:3px;text-decoration:underline;text-underline-offset:5px">VIEW OFFERS</b>'),
 ('LOEWE', 'preto, canto reto, letra normal 14 px sem espaço extra e sem caixa alta: o luxo pela simplicidade',
  '<b class=k style="background:#000;color:#fff;height:36px;padding:0 24px;border-radius:0;font-size:14px;letter-spacing:0">Add to bag</b><b class=k style="background:none;color:#000;border:1px solid #000;height:36px;padding:0 24px;border-radius:0;font-size:14px">Find in store</b>'),
]
css = """@font-face{font-family:Fraunces;src:url(data:font/ttf;base64,%s)}*{box-sizing:border-box}body{margin:0;padding:28px;background:#fff;font-family:Inter,system-ui,sans-serif;color:#141414;width:1180px}
h1{font:600 26px Inter,sans-serif;margin:0 0 4px}.sub{color:#6b6763;font-size:15px;margin:0 0 24px;line-height:1.4}
.g{display:grid;grid-template-columns:1fr 1fr;gap:20px}.c{border:1px solid #e6e2df;padding:20px 22px;border-radius:12px}.c h2{font:600 19px Inter;margin:0 0 4px}.c p{margin:0 0 16px;color:#6b6763;font-size:13.5px;line-height:1.4}
.r{display:flex;gap:12px;flex-wrap:wrap;align-items:center}.k{display:inline-flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;font-weight:400;white-space:nowrap}
.n{margin-top:24px;display:grid;grid-template-columns:1fr 1fr;gap:20px}.n h2{font:600 19px Inter;margin:0 0 8px;color:#7c486c}"""
FT = None
for f in os.listdir(FD):
    if '400' in f or 'Regular' in f: FT = os.path.join(FD, f)
html = '<style>%s</style><h1>Como são os botões das marcas de luxo com cor própria</h1><p class=sub>Redesenhados com as medidas publicadas de cada marca (cor, canto, altura, letra, espaço). A letra própria delas foi trocada pela Inter. Embaixo, o nosso botão para comparar.</p><div class=g>' % (css % b64(FT))
for n, d, b in M: html += '<div class=c><h2>%s</h2><p>%s</p><div class=r>%s</div></div>' % (n, d, b)
html += '</div><div class=n><div><h2 style="color:#6b6763">La Fouch · Hoje</h2>%s</div><div><h2>La Fouch · N2 (proposta)</h2>%s</div></div>' % (H('/tmp/c9j_0.png'), H('/tmp/c9j_2.png'))
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 1236, 'height': 800}, device_scale_factor=2)
    pg.set_content(html); pg.wait_for_timeout(500); pg.screenshot(path='esboco-09k-marcas.jpg', full_page=True, type='jpeg', quality=88); b.close()
print('ok')
