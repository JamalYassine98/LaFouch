# S422: tira seletores de estilo do index.html sem mexer no resto do texto.
# tira(html, apaga) → html novo; apaga(seletor) = True para sair. Regra que fica sem seletor sai inteira; @media vazio sai.
import re

def _split_sel(s):
    out, d, cur = [], 0, ''
    for ch in s:
        if ch in '([': d += 1
        elif ch in ')]': d -= 1
        if ch == ',' and d == 0: out.append(cur); cur = ''
        else: cur += ch
    out.append(cur); return out

def _bloco(css, apaga, cont):
    i, n, res = 0, len(css), []
    while i < n:
        j = css.find('{', i)
        if j < 0: res.append(css[i:]); break
        # comentário antes do seletor fica
        pre = css[i:j]
        # acha o fim do bloco (chaves equilibradas, ignora strings)
        d, k, q = 0, j, None
        while k < n:
            c = css[k]
            if q:
                if c == '\\': k += 1
                elif c == q: q = None
            elif c in '"\'': q = c
            elif c == '{': d += 1
            elif c == '}':
                d -= 1
                if d == 0: break
            k += 1
        corpo = css[j + 1:k]
        # separa comentários e espaços do começo do seletor
        m = re.match(r'(\s*(?:/\*.*?\*/\s*)*)(.*)$', pre, re.S)
        lead, sel = m.group(1), m.group(2)
        if sel.strip().startswith('@'):
            if re.match(r'@(media|supports|layer|container)\b', sel.strip()):
                novo = _bloco(corpo, apaga, cont)
                if novo.strip(): res.append(lead + sel + '{' + novo + '}')
                else: res.append(lead); cont[1] += 1
            else: res.append(pre + '{' + corpo + '}')
        else:
            ps = _split_sel(sel); fica = [x for x in ps if not apaga(x.strip())]
            cont[0] += len(ps) - len(fica)
            if fica == ps: res.append(pre + '{' + corpo + '}')
            elif fica: res.append(lead + ','.join(fica) + '{' + corpo + '}')
            else: res.append(lead); cont[1] += 1
        i = k + 1
    return ''.join(res)

def tira(html, apaga):
    cont = [0, 0]
    def f(m): return m.group(1) + _bloco(m.group(2), apaga, cont) + m.group(3)
    novo = re.sub(r'(<style[^>]*>)(.*?)(</style>)', f, html, flags=re.S)
    return novo, cont  # cont = [seletores tirados, regras inteiras tiradas]
