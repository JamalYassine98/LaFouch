# S422 · LIMPEZA DO SITE, FASE 1 (aprovada 18/11 11:50, "implementar" 11:52). Roda sobre /home/claude/catalogo (ramo limpeza).
# Cada troca confere que achou exatamente o que esperava (assert) — se o site mudou, para em vez de estragar.
import re, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import cssedit
C = '/home/claude/catalogo'
js = open(C + '/js/lf-site.js', encoding='utf8').read(); html = open(C + '/index.html', encoding='utf8').read(); i18 = open(C + '/js/lf-i18n.js', encoding='utf8').read()
R = []
def troca(s, a, b, n=1):
    assert s.count(a) == n, ('achei %d× (esperava %d): ' % (s.count(a), n)) + a[:90]; return s.replace(a, b)
def tira_funcao(s, nome):
    i = s.index('function ' + nome + '(')
    k = s.index('{', i); d = 0; q = None; j = k
    while True:
        c = s[j]
        if q:
            if c == '\\': j += 1
            elif c == q: q = None
        elif c in '"\'`': q = c
        elif c == '/' and s[j + 1] == '*': j = s.index('*/', j) + 1
        elif c == '{': d += 1
        elif c == '}':
            d -= 1
            if d == 0: break
        j += 1
    return s[:i] + s[j + 1:]
# 1) lista de exemplo: já tirada (var P=[]) — confere
assert 'var P=[];/* S422' in js and "nome:'Armação redonda rosa'" not in js
R.append('lista de 20 peças de exemplo: fora (só na cópia de teste)')
# 2) menu antigo escondido (Idioma/Tema/Texto em trilhos): HTML, estilo e código
i = html.index('  <div class="dpf">'); j = html.index('  </div>\n', html.index('data-zs="2"', i)) + len('  </div>\n')
assert html[i:j].count('class="prow"') == 3; html = html[:i] + html[j:]
html, c = cssedit.tira(html, lambda s: bool(re.search(r'(^|[\s>+~,(])\.(seg|prow|dpf)(?![\w-])', s))); R.append('menu antigo: HTML + %d seletores de estilo' % c[0])
js = troca(js, "document.querySelectorAll('#drw nav a,#drw .dpf')", "document.querySelectorAll('#drw nav a')")
js = troca(js, "document.querySelectorAll('#drw nav>a,#drw .cat,#drw .dpf,#drw .dct')", "document.querySelectorAll('#drw nav>a,#drw .cat,#drw .dct')")
js = troca(js, "document.querySelectorAll('#drw nav>a,#drw nav>.cat,#drw .dpf,#drw .dct')", "document.querySelectorAll('#drw nav>a,#drw nav>.cat,#drw .dct')")
a = js[js.index('  function prefSync(){'):js.index('  function fshSet(on){')]
assert a.count("#drw [data-") == 3
js = js.replace(a, "  function prefSync(){/* S422: o menu antigo com trilhos saiu; Idioma e Tamanho do texto ficam nas listas com ✓ (#dsh) */}\n")
# 3) Leve 2 (retirado 17/11): a função antiga vira a de zero e a troca posterior sai
i = js.index('  /* Leve 2 (aprovado 11/11/2026)'); j = js.index('return r}', i) + len('return r}')
assert 'function l2Info(){' in js[i:j]
js = js[:i] + "  /* Leve 2: retirado em 17/11/2026 (ordem do dono) — nenhum desconto da 2ª peça; a função fica só porque as contas do carrinho a consultam */\n  function l2Info(){return {n:0,d:0,dD:0,por:{}}}" + js[j:]
js = troca(js, "l2Info=function(){return {n:0,d:0,dD:0,por:{}}};", "")
R.append('Leve 2: código antigo fora')
# 4) pílula antiga da Minha conta (S288), substituída pelo trilho único (S420)
i = js.index("  /* S288 abas de Minha conta de luxo"); j = js.index("    return res};\n", i) + len("    return res};\n")
assert '_minhaContaLx' in js[i:j] and js[i:j].count('minhaConta=function') == 1
js = js[:i] + js[j:]
html, c = cssedit.tira(html, lambda s: bool(re.match(r'\.mct\.lx\b|\.mct>\.mcPl\b', s))); R.append('pílula antiga S288: código + %d seletores' % c[0])
# 5) TRF_AUTO (sem uso desde o S400)
js = troca(js, ",TRF_AUTO=false /* 14/11: Banco Familiar — fica false até o robô ler o aviso do banco; enquanto isso o comprovante aparece na hora */", "")
R.append('TRF_AUTO fora')
# 6) 11 funções que nada chama
F = ['amCard', 'apos', 'bagDados', 'bagFx', 'bvMostra', 'confete', 'faceName', 'foneErro', 'gzPeca', 'pgFavBtn', 'srSug']
for n in F:
    assert len(re.findall(r'(?<![\w$.])' + n + r'(?![\w$])', js + html)) == 1, n
    js = tira_funcao(js, n)
R.append('%d funções sem uso fora' % len(F))
# 7) textos do tradutor sem uso (só frases de 4+ palavras: as curtas podem vir dos dados da nuvem)
alls = js + html; tirados = 0
def sai(m):
    global tirados
    k = m.group(1)
    if k in alls or json.loads('"' + k + '"') in alls or len(json.loads('"' + k + '"').split()) < 4: return m.group(0)
    tirados += 1; return ''
i18n = re.sub(r'"((?:[^"\\]|\\.)+)":"(?:[^"\\]|\\.)*",?', sai, i18)
R.append('%d textos do tradutor sem uso' % tirados)
# 8) vozes fora da lista de falas
fora = []
for lg in ('pt', 'es'):
    L = json.load(open(C + '/media/voz/%s/lista.json' % lg, encoding='utf8')); us = set()
    for v in L.values(): us.update(v if isinstance(v, list) else [v])
    for f in os.listdir(C + '/media/voz/' + lg):
        if f.endswith('.mp3') and f not in us: fora.append(lg + '/' + f)
for f in fora: os.remove(C + '/media/voz/' + f)
R.append('%d vozes fora da lista apagadas' % len(fora))
open(C + '/js/lf-site.js', 'w', encoding='utf8').write(js); open(C + '/index.html', 'w', encoding='utf8').write(html); open(C + '/js/lf-i18n.js', 'w', encoding='utf8').write(i18n)
print('\n'.join(R))
