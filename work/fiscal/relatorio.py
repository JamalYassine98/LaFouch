import json, sys, os, re, html, base64, io
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
R = json.load(open(os.path.join(src, 'resultado.json')))
NOME = {'pagina_larga': 'Página rola de lado', 'fora_da_tela': 'Texto sai da tela', 'texto_cortado': 'Texto cortado',
        'texto_sobre_texto': 'Texto em cima de texto', 'coberto': 'Texto escondido por outro elemento',
        'botao_coberto': 'Botão escondido', 'botao_pequeno': 'Botão pequeno demais para o dedo',
        'reticencias': 'Texto com “…”', 'sob_fixo': 'Atrás da barra fixa (normal)'}
GRAVE = ['pagina_larga', 'texto_sobre_texto', 'fora_da_tela', 'texto_cortado', 'coberto', 'botao_coberto']
LEVE = ['botao_pequeno']
# agrupa pelo mesmo defeito (tipo + elemento), juntando os aparelhos onde aparece
g = {}
for x in R:
    for i in x['iss']:
        if i['t'] not in GRAVE + LEVE: continue
        chave = (i['t'], re.sub(r'\(\d+×\d+ px\)', '', i['d']).strip(), x['tela'].split(' · parte')[0])
        e = g.setdefault(chave, {'ap': [], 'ex': None})
        e['ap'].append(f"{x['ap']} · {x['var']}")
        if e['ex'] is None: e['ex'] = (x, i)
def foto(x, i):
    im = Image.open(os.path.join(src, x['foto'])).convert('RGB')
    l, t, w, h = i['r']; W, H = im.size
    pad = 90; box = (max(0, l - pad), max(0, t - pad), min(W, l + w + pad), min(H, t + h + pad))
    im = im.crop(box); im.thumbnail((360, 260))
    b = io.BytesIO(); im.save(b, 'JPEG', quality=70)
    return base64.b64encode(b.getvalue()).decode()
def bloco(tipos, titulo):
    itens = sorted([(k, v) for k, v in g.items() if k[0] in tipos], key=lambda kv: (tipos.index(kv[0][0]), -len(kv[1]['ap'])))
    s = f'<h2>{titulo} <small>({len(itens)})</small></h2>'
    for (t, d, tela), v in itens:
        x, i = v['ex']; aps = sorted(set(v['ap']))
        s += (f'<div class="c"><img src="data:image/jpeg;base64,{foto(x, i)}"><div><b>{NOME[t]}</b> — {html.escape(tela)}'
              f'<p>{html.escape(d)}</p><p class="a">Aparece em {len(aps)} de {NT} combinações: {html.escape(", ".join(aps[:6]))}{" …" if len(aps) > 6 else ""}</p></div></div>')
    return s
NT = len({(x['ap'], x['var']) for x in R})
telas = len(R)
doc = f'''<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fiscal do layout — lafouch.com</title><style>
body{{font:15px/1.45 system-ui,sans-serif;margin:0 auto;max-width:860px;padding:16px;color:#222}}
h1{{font-size:22px;margin:.2em 0}}h2{{font-size:18px;margin:1.4em 0 .5em;border-bottom:2px solid #eee;padding-bottom:4px}}
small{{color:#888;font-weight:400}}.c{{display:flex;gap:12px;align-items:flex-start;margin:10px 0;padding:10px;border:1px solid #eee;border-radius:10px}}
.c img{{width:180px;flex:none;border-radius:6px;border:1px solid #ddd}}.c p{{margin:.3em 0;font-size:13px;color:#555;word-break:break-word}}.a{{color:#999!important}}
@media(max-width:520px){{.c{{flex-direction:column}}.c img{{width:100%}}}}</style>
<h1>Fiscal do layout — lafouch.com (site de hoje)</h1>
<p>{NT} combinações (aparelho × idioma × tamanho de letra) · {telas} telas vistas · só o que está realmente à vista conta (o que fica atrás do menu, da busca ou do carrinho abertos é ignorado). Nada foi mudado no site.</p>
{bloco(GRAVE, 'Defeitos que se veem')}
{bloco(LEVE, 'Botões pequenos para o dedo (menos de 36 px)')}
'''
open(out, 'w').write(doc)
print(len(g), 'defeitos agrupados')
