# Trava dos remendos (item 18, aprovado 20/11 00:40; inventário em docs/INVENTARIO-REMENDOS.md).
# Conta no APP (src/*.js e www/style.css) o que é remendo e compara com o teto (tests/teto-remendos.json):
#   - embrulho `var _x = x;` de função/ação existente (por função e arquivo)
#   - função declarada e reescrita em outro arquivo (por função e arquivo)
#   - ação ACT.x escrita em mais de um lugar (por ação: quantos lugares)
#   - !important e seletores escritos 3+ vezes no style.css
# Reprova se qualquer um SUBIR ou aparecer um novo. Pode só descer.
#   python3 tools/remendos.py           confere (sai 1 se subiu)
#   python3 tools/remendos.py --grava   baixa o teto para os números de hoje (recusa se algo subiu)
import re, os, sys, json, collections
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TETO = os.path.join(RAIZ, 'tests', 'teto-remendos.json')

def conta(raiz=RAIZ):
    src = os.path.join(raiz, 'src')
    decl = collections.defaultdict(list); act = collections.defaultdict(list); wrap = []; reat = []
    for f in sorted(x for x in os.listdir(src) if x.endswith('.js')):
        for i, l in enumerate(open(os.path.join(src, f), encoding='utf-8').read().split('\n'), 1):
            m = re.match(r'^\s{2}function ([A-Za-z_$][\w$]*)\s*\(', l)
            if m: decl[m.group(1)].append((f, i))
            for m in re.finditer(r'ACT\.([A-Za-z_$][\w$]*)\s*=\s*function', l): act[m.group(1)].append(f)
            m = re.match(r'^\s*var\s+(_[\w$]+)\s*=\s*((?:ACT\.)?[A-Za-z_$][\w$]*)\s*[;,]', l)
            if m: wrap.append((m.group(2), f))
            m = re.match(r'^\s{2,}([A-Za-z_$][\w$]*)\s*=\s*function\b', l)
            if m: reat.append((m.group(1), f, i))
    emb = collections.Counter('%s @ %s' % (n, f) for n, f in wrap if n.replace('ACT.', '') in act or n in decl)
    rees = collections.Counter('%s @ %s' % (n, f) for n, f, i in reat if n in decl and not any(df == f and di == i for df, di in decl[n]))
    for n, v in decl.items():
        for f, i in v[1:]: rees['%s @ %s' % (n, f)] += 1
    acao = {k: len(v) for k, v in act.items() if len(v) > 1}
    css = re.sub(r'/\*.*?\*/', '', open(os.path.join(raiz, 'www', 'style.css'), encoding='utf-8').read(), flags=re.S)
    sels = collections.Counter()
    for m in re.finditer(r'([^{}]+)\{[^{}]*\}', css):
        for s in m.group(1).split(','):
            s = s.strip()
            if s and not s.startswith('@') and not s[0].isdigit() and s not in ('from', 'to'): sels[s] += 1
    return {'embrulhos': dict(emb), 'reescritas': dict(rees), 'acoes': acao,
            'important': css.count('!important'), 'seletores3': sum(1 for v in sels.values() if v > 2)}

def compara(hoje, teto):
    sub = []
    for k in ('embrulhos', 'reescritas', 'acoes'):
        for n, q in hoje[k].items():
            if q > teto[k].get(n, 0): sub.append('%s novo: %s (%d, teto %d)' % (k, n, q, teto[k].get(n, 0)))
    for k in ('important', 'seletores3'):
        if hoje[k] > teto[k]: sub.append('%s subiu: %d (teto %d)' % (k, hoje[k], teto[k]))
    return sub

def resumo(o):
    return 'embrulhos %d · reescritas %d · ações em 2+ lugares %d · !important %d · seletores 3+ vezes %d' % (
        sum(o['embrulhos'].values()), sum(o['reescritas'].values()), len(o['acoes']), o['important'], o['seletores3'])

if __name__ == '__main__':
    hoje = conta()
    if '--grava' in sys.argv and not os.path.exists(TETO):
        json.dump(hoje, open(TETO, 'w'), ensure_ascii=False, indent=1, sort_keys=True); print('teto criado:', resumo(hoje)); sys.exit(0)
    teto = json.load(open(TETO))
    sub = compara(hoje, teto)
    if sub:
        print('REMENDO NOVO (regra 12: trocar no lugar e apagar o velho):'); [print('  -', s) for s in sub]; sys.exit(1)
    if '--grava' in sys.argv:
        json.dump(hoje, open(TETO, 'w'), ensure_ascii=False, indent=1, sort_keys=True); print('teto baixado:', resumo(hoje)); sys.exit(0)
    print('ok:', resumo(hoje), '| teto:', resumo(teto))
