"""IDEIAS 09 · prancha do inventário de botões: o que existe hoje (agrupado pelo desenho) → em qual dos 4 tipos vira."""
import json, os, base64, html
from playwright.sync_api import sync_playwright
AQ = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(AQ, 'inventario.json')))
# grupo (índice do inventário) → tipo da família nova. Os que não estão aqui não são botões (linhas, abas, cartões, ×, quantidade).
P = [16, 23, 27, 34, 35, 37, 38, 39, 41, 48]; S = [1, 29, 33, 49, 50, 53, 55]; L = [2, 4, 7, 8, 11, 14, 24, 28, 52, 54]; X = [56, 51]
TIPOS = [('Principal', P, 'Vinho cheio, em pílula, 48 px, letra do corpo 16 px peso 500, texto branco. Um por tela. Sem degradê, sem ícone, sem verde. Nos eventos, a cor do evento.',
          '<span class="n p">Prosseguir com o pagamento</span>'),
         ('Secundário', S, 'Contorno fino vinho, em pílula, 48 px (40 px dentro de listas), texto vinho 16 px peso 500, fundo transparente.',
          '<span class="n s">Ver modelo</span>'),
         ('Link', L, 'Só texto vinho, 15 px peso 500, com › para ir (ou ‹ para voltar). Sem caixa e sem sublinhado; área de toque de 44 px.',
          '<span class="n l">Ver catálogo ›</span>'),
         ('Perigo', X, 'Vermelho cheio, em pílula, 48 px, sempre com "Voltar" (link) embaixo. Em listas, só o texto vermelho.',
          '<span class="n x">Cancelar pedido</span><span class="n l" style="margin-top:8px">Voltar</span>')]
def img(fn):
    return 'data:image/png;base64,' + base64.b64encode(open(fn, 'rb').read()).decode()
def desc(g):
    s = g['sig']
    if s[0] == 'texto': return 'texto · %s · %s' % (s[1], s[2])
    return '%s · fundo %s · %s · %s · %s px' % (s[0], s[1] or '—', s[3] or 'sem borda', s[4], s[5])
H = ['<!doctype html><meta charset=utf-8><style>body{font:14px/1.4 Inter,system-ui,sans-serif;margin:32px;color:#141414;width:1500px}h1{font:600 30px Georgia,serif;margin:0 0 4px}'
     '.sub{color:#6b6763;margin:0 0 24px}.t{display:grid;grid-template-columns:1fr 360px;gap:32px;border-top:2px solid #141414;padding:20px 0 28px}'
     'h2{font:600 22px Georgia,serif;margin:0 0 4px}.c{color:#6b6763;font-size:13px}.g{display:flex;flex-wrap:wrap;gap:16px;margin-top:12px}'
     '.it{border:1px solid #e6e1db;border-radius:10px;padding:10px;max-width:340px;background:#fff}.it img{max-width:316px;max-height:90px;display:block}.it small{display:block;color:#6b6763;font-size:11px;margin-top:6px}'
     '.vira{background:#faf8f6;border-radius:12px;padding:20px;display:flex;flex-direction:column;align-items:flex-start}.vira b{font-size:12px;color:#6b6763;letter-spacing:.1em;margin-bottom:12px}'
     '.n{display:inline-flex;align-items:center;justify-content:center;height:48px;padding:0 24px;border-radius:999px;font:500 16px Inter,sans-serif}'
     '.p{background:#8d3a69;color:#fff}.s{border:1px solid #8d3a69;color:#8d3a69}.l{color:#8d3a69;font-size:15px;padding:0;height:44px}.x{background:#b3261e;color:#fff}'
     '.cnt{font:600 15px Inter;color:#b3261e;margin-top:6px}</style>',
     '<h1>Família de botões · inventário</h1><p class=sub>Todas as 22 telas do roteiro do site (o mesmo do comparador e do Argus), no celular 390, sem evento. '
     'Cada caixa é um DESENHO diferente encontrado hoje; embaixo, em que telas aparece e os textos.</p>']
for nome, ids, regra, amostra in TIPOS:
    H.append('<div class=t><div><h2>%s</h2><div class=cnt>Hoje: %d desenhos diferentes → vira 1</div><div class=g>' % (nome, len(ids)))
    for i in ids:
        g = d[i]
        ex = g['ex'][0][0] if g['ex'] else None
        H.append('<div class=it>%s<small>%s<br>%s<br>Telas: %s</small></div>' % ('<img src="%s">' % img(ex) if ex else '', html.escape(', '.join(g['textos'][:4])), html.escape(desc(g)), html.escape(', '.join(g['telas'][:4]) + (' …' if len(g['telas']) > 4 else ''))))
    H.append('</div></div><div class=vira><b>VIRA</b>%s<p class=c style="margin-top:16px">%s</p></div></div>' % (amostra, regra))
outros = [i for i in range(len(d)) if i not in P + S + L + X]
H.append('<div class=t><div><h2>Não são botões</h2><div class=c>%d desenhos que são de outras famílias e ficam fora desta: linhas do menu e do rodapé, abas, cartões de peça e de categoria, × de fechar, quantidade (− 1 +), escolha de dois lados (Cédula/RUC). Cada família tem a regra dela.</div></div><div></div></div>' % len(outros))
open(os.path.join(AQ, 'prancha.html'), 'w').write(''.join(H))
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 1564, 'height': 900}); pg.goto('file://' + os.path.join(AQ, 'prancha.html')); pg.wait_for_timeout(500)
    pg.screenshot(path=os.path.join(AQ, 'esboco-09-inventario-botoes.png'), full_page=True); b.close()
print('ok')
