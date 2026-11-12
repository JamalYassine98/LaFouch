# Prova das regras do Firestore (12/11/2026, bloco 5 item 6): compara o que o site ENVIA para "pedidos"
# com o que as regras (firestore.rules do projeto) ACEITAM, e confere que as coleções privadas ficam fechadas.
# Uso: python3 regras.py  → imprime JSON [{nome, ok, d}]. O porteiro chama isto.
import re, json, os, sys
D = os.path.dirname(os.path.abspath(__file__))
RULES = os.path.join(D, '..', '..', 'firestore.rules')
SITE = '/home/claude/catalogo/js/lf-site.js'
R = []
def res(nome, ok, d=''): R.append({'nome': nome, 'ok': bool(ok), 'd': d})
try:
    rl = open(RULES).read(); js = open(SITE).read()
except Exception as e:
    print(json.dumps([{'nome': 'regras: arquivos', 'ok': False, 'd': str(e)}])); sys.exit(0)
def lista(fn):
    m = re.search(r'function ' + fn + r'\(\)\s*\{.*?hasOnly\(\[(.*?)\]\)', rl, re.S)
    return set(re.findall(r"'([^']+)'", m.group(1))) if m else None
def chaves(obj):
    # chaves do 1º nível de um literal de objeto JS: identificador logo depois do início ou de uma vírgula de nível 0
    out, prof, i, n = set(), 0, 0, len(obj)
    def tenta(j):
        m = re.match(r'\s*([A-Za-z_$][\w$]*)\s*:(?!:)', obj[j:])
        if m: out.add(m.group(1))
    tenta(0)
    while i < n:
        c = obj[i]
        if c in '\'"':
            q = c; i += 1
            while i < n and obj[i] != q: i += 2 if obj[i] == '\\' else 1
        elif c in '([{': prof += 1
        elif c in ')]}': prof -= 1
        elif c == ',' and prof == 0: tenta(i + 1)
        i += 1
    return out
def literais(ini):
    out, a = [], js.find(ini)
    while a >= 0:
        i, prof = a, 0
        while i < len(js):
            c = js[i]
            if c in '\'"':
                q = c; i += 1
                while i < len(js) and js[i] != q: i += 2 if js[i] == '\\' else 1
            elif c == '{': prof += 1
            elif c == '}':
                prof -= 1
                if prof == 0: out.append(js[a + 1:i]); break
            i += 1
        a = js.find(ini, a + 1)
    return out
# pedido normal (checkout)
peds = literais("{ts:Date.now(),nome:c.nome,")
ok_p = lista('pedidoOk')
if not peds or ok_p is None: res('regras: pedido do site', False, 'não achei o pedido no site ou o pedidoOk nas regras')
else:
    k = set().union(*[chaves(p) for p in peds + literais('{cup:st.cup.cod')]); fora = sorted(k - ok_p)
    res('regras: pedido do site', not fora, 'campos recusados pelas regras: ' + ', '.join(fora) if fora else f'{len(peds)} jeitos de pedir, {len(k)} campos aceitos')
for tipo, fn in (('cancel', 'cancelOk'), ('comp', 'comprovanteOk'), ('avise', 'aviseOk')):
    lt = literais("{tipo:'" + tipo + "'"); ok_l = lista(fn)
    if not lt or ok_l is None: res(f'regras: {tipo}', False, 'não achei no site ou nas regras'); continue
    fora = sorted(set().union(*[chaves(x) for x in lt]) - ok_l)
    res(f'regras: {tipo}', not fora, 'campos recusados: ' + ', '.join(fora) if fora else 'ok')
# coleções que NUNCA podem ser abertas ao público (só as funções do servidor usam)
priv = ['mensagens', 'inscricoes', 'voltas', 'analise', 'codigos', 'avaliacoes', 'logins']
abertas = [c for c in priv if re.search(r'match /' + c + r'/', rl)]
res('regras: coleções privadas fechadas', not abertas, 'abertas: ' + ', '.join(abertas) if abertas else ', '.join(priv))
# leitura pública só onde é de propósito
pub = re.findall(r'match /(\w+)/\{\w+\}\s*\{[^}]*allow (?:read|get)[^;]*: if true', rl)
esperado = {'produtos', 'fotos', 'config', 'estoque', 'reservas', 'usuarios'}
extra = sorted(set(pub) - esperado)
res('regras: leitura pública só no catálogo', not extra, 'públicas a mais: ' + ', '.join(extra) if extra else ', '.join(sorted(pub)))
res('regras: pedidos não são lidos pelo público', not re.search(r'match /pedidos/\{\w+\}\s*\{[^}]*allow read[^;]*if true', rl), '')
print(json.dumps(R, ensure_ascii=False))
