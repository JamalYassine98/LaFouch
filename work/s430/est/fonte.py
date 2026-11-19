# S430 estilos: lê os <style> do index.html e devolve as regras com a posição exata de cada declaração no arquivo
import re, json, sys

def blocos(h):
    for m in re.finditer(r'<style([^>]*)>(.*?)</style>', h, re.S):
        yield m.start(2), m.group(2)

def tira_coment(css):
    # troca comentários por espaços (mantém as posições)
    return re.sub(r'/\*.*?\*/', lambda m: ' ' * len(m.group(0)), css, flags=re.S)

def regras(css, base, media, out, si):
    i, n = 0, len(css)
    while i < n:
        j = css.find('{', i)
        if j < 0: break
        cab = css[i:j].strip()
        # acha o fim do bloco
        d, k = 0, j
        while k < n:
            c = css[k]
            if c == '{': d += 1
            elif c == '}':
                d -= 1
                if d == 0: break
            elif c in '"\'':
                q = c; k += 1
                while k < n and css[k] != q:
                    if css[k] == '\\': k += 1
                    k += 1
            k += 1
        corpo = css[j + 1:k]
        if cab.startswith('@media') or cab.startswith('@supports') or cab.startswith('@container'):
            regras(corpo, base + j + 1, media + [cab], out, si)
        elif cab.startswith('@'):
            pass  # keyframes, font-face, layer: não mexe
        elif cab:
            decs = []
            for dm in re.finditer(r'([^;{}]+?)(;|$)', corpo):
                txt = dm.group(1)
                if ':' not in txt or not txt.strip(): continue
                prop, val = txt.split(':', 1)
                prop = prop.strip()
                if not re.match(r'^-?-?[a-zA-Z][\w-]*$', prop): continue
                imp = bool(re.search(r'!\s*important\s*$', val))
                val = re.sub(r'!\s*important\s*$', '', val).strip()
                ini = base + j + 1 + dm.start(1); fim = base + j + 1 + dm.end(2)
                decs.append([prop, val, imp, ini, fim])
            out.append({'si': si, 'media': media, 'sel': cab, 'decs': decs, 'ini': base + i, 'fim': base + k + 1})
        i = k + 1

def le(arq):
    h = open(arq, encoding='utf-8').read()
    out = []
    for si, (pos, css) in enumerate(blocos(h)):
        regras(tira_coment(css), pos, [], out, si)
    return h, out

if __name__ == '__main__':
    h, R = le(sys.argv[1])
    print(len(R), 'regras', sum(len(r['decs']) for r in R), 'declarações')
    json.dump(R, open(sys.argv[2], 'w'))
