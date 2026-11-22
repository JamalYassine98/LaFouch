"""IDEIAS 06 · temática estilo CAMPANHA (dono 22/11 12:23).
Hoje = cópia do site do ar (/tmp/b5h). Proposta = /tmp/a6p: o site fica SEMPRE com o visual da La Fouch; o tema
só deixa: a faixa (texto + a cor dela), UMA cor de acento (--act), o chapéu do Mochi e o Destaque. Todas as regras
de CSS que pintam peça por peça por tema saem (contadas e listadas em removidas.txt).
Base inclui os aprovados: IDEIAS 05 v2 (camadas) + setinha › cinza.
Uso: python3 copia.py → /tmp/a6p"""
import re, sys, os, shutil
sys.path.insert(0, '/home/claude/lafouch/work/ideias/05-animacoes')
import video2 as V2
SRC = '/home/claude/catalogo'; DST = '/tmp/a6p'
FICA = re.compile(r'^\s*--(act|evb)\s*:')
def limpa(css, sai):
    out, i = [], 0
    # percorre regras de 1º e 2º nível (dentro de @media) sem mexer no resto
    for m in re.finditer(r'([^{}]+)\{([^{}]*)\}', css):
        sel, corpo = m.group(1), m.group(2)
        out.append(css[i:m.start()]); i = m.end()
        if sel.strip().startswith('@') or 'data-ev' not in sel:
            out.append(m.group(0)); continue
        partes, prof, cur = [], 0, ''
        for ch in sel:
            if ch == '(': prof += 1
            if ch == ')': prof -= 1
            if ch == ',' and prof == 0: partes.append(cur); cur = ''
            else: cur += ch
        partes.append(cur)
        tema = [x for x in partes if re.search(r'(?<!:not\()\[data-ev(?:[\]=^])', x)]
        base = [x for x in partes if x not in tema]
        dec = [d for d in corpo.split(';') if d.strip()]
        fica = [d for d in dec if FICA.match(d)]
        if not tema: out.append(m.group(0)); continue
        if len(fica) != len(dec): sai.append(','.join(t.strip() for t in tema)[:160] + '{…}')
        if base: out.append(','.join(base) + '{' + corpo + '}')
        if fica: out.append(','.join(tema) + '{' + ';'.join(fica) + '}')
        continue
        out.append(m.group(0))
    out.append(css[i:]); return ''.join(out)
if __name__ == '__main__':
    shutil.rmtree(DST, ignore_errors=True); shutil.copytree(SRC, DST, ignore=shutil.ignore_patterns('.git'))
    p = DST + '/index.html'; h = open(p).read(); sai = []
    h = re.sub(r'(<style[^>]*>)(.*?)(</style>)', lambda m: m.group(1) + limpa(m.group(2), sai) + m.group(3), h, flags=re.S)
    open(p, 'w').write(h)
    BASE = (':root{--bg:#f5f3f0;--pn:#fff;--tx:#141414;--mu:#6b6763;--ln:#e6e1db;--ln2:#d8d2ca;--ac:var(--act,#8d3a69);color-scheme:light}'
            'body{background:var(--bg)}#evbar{background:var(--act,#141414);color:#fff}')
    h = open(p).read().replace('</head>', '<style id="lfBase">' + BASE + '</style></head>', 1); open(p, 'w').write(h)
    SETA = "\n(function(){var s=document.createElement('style');s.textContent='#sov .socat button i{color:var(--mu)!important}#drw nav.dnv>a.dof{color:var(--act,var(--ac))!important}';document.head.appendChild(s)})();\n"
    open(DST + '/js/lf-site.js', 'a').write(V2.PINTA2 + SETA)
    open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'removidas.txt'), 'w').write('\n'.join(sai))
    print(len(sai), 'regras de tema saem')
