"""IDEIAS 12d · todas as datas na COR OFICIAL da loja (dono 15:25), a partir do 12b "campanha forte" nas 6 datas, fundo branco (dono 23/11 14:03-14:07). /tmp/a12 → /tmp/a12b (:8766).
Por data, só CONTEÚDO (a loja não muda de cor): faixa com motivo para comprar agora · Destaque Campanha (frase, fotos, 1 botão
na cor da marca) · seleção da data · o GESTO da data (cupom do evento e/ou kit de presente, aprovado 23/11 09:37/12:17) ·
chapéu do Mochi. Textos de exemplo para o dono ajustar; nenhum valor de cupom inventado."""
import shutil, json, os, re
S, D = '/tmp/a12', '/tmp/a12d'
shutil.rmtree(D, ignore_errors=True); shutil.copytree(S, D)
p = D + '/js/lf-site.js'; s = open(p).read()
BAR = {'natal': 'Natal · o presente é um olhar', 'halloween': 'Halloween · o que o olhar esconde',  # frases do estudo de luxo (dono 14:37-14:38)
       'bf': 'Black Friday privada · poucos dias', 'maes': 'Dia das Mães · tudo começou com o olhar dela',
       'pais': 'Dia dos Pais · para quem nos ensinou a enxergar', 'anonovo': 'Ano Novo · um novo ano à vista'}
for k, v in BAR.items():
    s, n = re.subn(r"(\n    %s:\{bar:')[^']*'" % k, lambda m: m.group(1) + v + "'", s); assert n == 1, k
KIT = 'Na compra: kit estojo + flanela, embrulho e cartão'
N = {
 'bf': dict(lab='Só esta semana', h='Black <em>Friday</em>', sub='Estoque limitado: quando acaba, acabou', bt='Ver as ofertas', sel=['Solar', 'Armações', 'Leitura'], g='O cupom da Black Friday já entra no carrinho', p=['GR3340', 'SL2285', 'SL2255']),
 'natal': dict(lab='Natal La Fouch', h='Presenteie <em>estilo</em>', sub='Peças escolhidas para presentear', bt='Ver a coleção', sel=['Clássico', 'Ousado', 'Discreto'], g=KIT, p=['SL2265', 'SL2275', 'SL2260']),
 'anonovo-n': dict(lab='Ano Novo', h='Comece o ano com <em>outro olhar</em>', sub='Solares para o verão', bt='Ver a coleção', sel=['Redondos', 'Quadrados', 'Gatinho'], g='O cupom de começo de ano já entra no carrinho', p=['SL2270', 'SL2250', 'SL2265']),
 'maes': dict(lab='Dia das Mães', h='Um presente com <em>carinho</em>', sub='Peças escolhidas para ela', bt='Ver a coleção', sel=['Solar', 'Armações', 'Leitura'], g='Na compra: kit, embrulho e cartão com a sua mensagem', p=['SL2300', 'AC1055', 'SL2270']),
 'pais': dict(lab='Dia dos Pais', h='Estilo que passa de <em>pai para filho</em>', sub='Peças escolhidas para ele', bt='Ver a coleção', sel=['Solar', 'Armações', 'Leitura'], g=KIT, p=['SL2305', 'GR3345', 'SL2250']),
 'halloween': dict(lab='Halloween', h='Um olhar <em>misterioso</em>', sub='Escuros e gatinho, só esta semana', bt='Ver a coleção', sel=['Solar', 'Gatinho', 'Armações'], g='O cupom de Halloween já entra no carrinho', p=['SL2255', 'BR44140', 'SL2285']),
}
cat = json.load(open('/tmp/b5h/dados/inicio.json')); fs = os.listdir('/tmp/b5h/dados/f'); P = {}
for x in cat['docs']:
    f = x['fields']; r = f['ref']['stringValue']; nome = f['nome']['stringValue'].replace('LaFouch ', '').strip(); n = int(f['n']['integerValue'])
    m = [a for a in fs if a.startswith(r + '_')]
    if m: P[r] = ['/dados/f/' + m[0], '%s · G$ %s' % (nome, '{:,}'.format(n).replace(',', '.'))]
for k in N: N[k]['f'] = [P[r] for r in N[k]['p'] if r in P]
# o Ano Novo montava a frase com o ano ('comece 2027 com um novo olhar') por fora do EVD: sai, vale a frase do EVD (uma só fonte)
v = "if(e&&e.tema==='anonovo'&&!e.bar){var y=new Date().getFullYear()+(new Date().getMonth()===0?0:1);tx='✨ Ano Novo · comece '+y+' com um novo olhar'}"
assert s.count(v) == 1; s = s.replace(v, '')
a = s.index("/* PINTURA · IDEIAS 06e: Destaque Campanha por evento */"); i = s.index('var D=', a) + 6; j = s.index(";var s=document.createElement('style')", i)
s = s[:i] + json.dumps(N, ensure_ascii=False) + s[j:]
old = "+'</div></div>';"
k = s.index(old, a); s = s[:k] + "+'</div>'+(e.g?'<p class=\"gst\">'+e.g+'</p>':'')+'</div>';" + s[k + len(old):]
s += """
/* PINTURA · IDEIAS 12b: fundo branco também na data (dono 14:03) + a linha do gesto */
(function(){var e=document.createElement('style');e.textContent=
 /* 12d (dono 15:25): TODAS as datas na cor oficial da loja — o acento da data É a cor da marca (faixa, título pequeno, palavra em itálico, fio) */
 'html[data-ev]{--act:#943d6f!important;--ac:#943d6f!important}html[data-ev] #evbar,html[data-ev] .evbar{background:#943d6f!important;color:#fff!important}'+
 'html[data-ev]{--bg:#fff!important}html[data-ev] body{background:#fff!important}'+
 'html[data-ev] #home:has(.lfcamp) #hdst{display:none!important}'+  /* a campanha SUBSTITUI o destaque da data (06d), não fica um embaixo do outro */
 '.lfcamp .gst{margin:16px 0 0;padding-top:16px;border-top:1px solid var(--ln);font:400 13px/1.4 Inter,sans-serif;color:var(--tx);text-align:center;letter-spacing:.01em}';document.head.appendChild(e)})();
"""
open(p, 'w').write(s); print('ok', list(N), [len(N[k]['f']) for k in N])
