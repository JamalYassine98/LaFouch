# S422 · LIMPEZA DO SITE, FASE 2 (estilos). Só sai o que é PROVADO sem uso:
#  (a) seletor com um nome de classe/id que não existe em lugar nenhum do HTML nem do código (nunca pode achar elemento);
#  (b) regra repetida IGUAL (mesmo seletor, mesmo conteúdo, mesmo @media): fica só a última cópia (a que já valia).
import re, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import cssedit
C = '/home/claude/catalogo'
html = open(C + '/index.html', encoding='utf8').read(); js = open(C + '/js/lf-site.js', encoding='utf8').read()
fonte = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.S) + js
EXTERNOS = {'grecaptcha-badge'}  # nomes que vêm de scripts de fora (Google)
cache = {}
def existe(t):
    if t in EXTERNOS: return True
    if t not in cache: cache[t] = bool(re.search(r'(?<![\w-])' + re.escape(t) + r'(?![\w-])', fonte))
    return cache[t]
def toks(s): return set(re.findall(r'[.#]([A-Za-z_][\w-]*)', re.sub(r'\[[^\]]*\]|url\([^)]*\)', '', s)))
tirados = []
def apaga(s):
    if any(not existe(t) for t in toks(s)): tirados.append(s); return True
    return False
html, c = cssedit.tira(html, apaga)
print('(a) seletores com nome inexistente: %d (regras inteiras: %d)' % (c[0], c[1]))
# (b) regras repetidas iguais no mesmo contexto: tira as cópias de antes
def regras_planas(h):
    out = []
    for bi, m in enumerate(re.finditer(r'<style[^>]*>(.*?)</style>', h, re.S)):
        css = m.group(1); pos = m.start(1)
        def anda(txt, off, ctx):
            i = 0
            while True:
                j = txt.find('{', i)
                if j < 0: return
                d, k, q = 0, j, None
                while k < len(txt):
                    ch = txt[k]
                    if q:
                        if ch == '\\': k += 1
                        elif ch == q: q = None
                    elif ch in '"\'': q = ch
                    elif ch == '{': d += 1
                    elif ch == '}':
                        d -= 1
                        if d == 0: break
                    k += 1
                sel = re.sub(r'/\*.*?\*/', '', txt[i:j], flags=re.S).strip()
                if sel.startswith('@'):
                    if re.match(r'@(media|supports)\b', sel): anda(txt[j + 1:k], off + j + 1, ctx + (re.sub(r'\s+', ' ', sel),))
                else: out.append((ctx, re.sub(r'\s+', ' ', sel), txt[j + 1:k].strip(), off + i, off + k + 1))
                i = k + 1
        anda(css, pos, ())
    return out
R = regras_planas(html); ult = {}
for r in R: ult[(r[0], r[1], r[2])] = r
cortes = [r for r in R if ult[(r[0], r[1], r[2])] is not r and r[2]]
for r in sorted(cortes, key=lambda r: -r[3]):
    # tira só o texto da regra (seletor + {corpo}), mantendo o resto
    seg = html[r[3]:r[4]]; lead = re.match(r'(\s*(?:/\*.*?\*/\s*)*)', seg, re.S).group(1)
    html = html[:r[3]] + lead + html[r[4]:]
print('(b) regras repetidas iguais tiradas (fica a última): %d' % len(cortes))
open(C + '/index.html', 'w', encoding='utf8').write(html)
json.dump(tirados, open('/home/claude/lafouch/work/s422/fase2_tirados.json', 'w'), ensure_ascii=False, indent=0)
