# Prova das regras do Firestore (12/11/2026, bloco 5 item 6; refeita 20/11 com o pedido pela nuvem): o site não grava direto em
# pedidos/ nem vistas/, as regras fecham as duas, e as coleções privadas ficam fechadas.
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
# 20/11/2026 (S3 e Fila 31 completos): o pedido, o cancelamento, o comprovante e o "avise-me" vão pela função "pedido" da nuvem (o formato
# mora em functions/pedido.js e é provado lá); as visitas vão pela análise. Então o site NÃO pode mais gravar direto nessas coleções,
# e as regras NÃO podem deixar ninguém de fora criar ou mudar nada nelas.
for col in ('pedidos', 'vistas'):
    usa = sorted(set(re.findall(r"['\"/]" + col + r"/", js)))
    res(f'regras: o site não grava direto em {col}/', not usa, 'o site ainda fala direto com ' + col + '/ (tem que ir pela nuvem)' if usa else 'vai pela nuvem')
    m = re.search(r'match /' + col + r'/\{\w+\}\s*\{(.*?)\}', rl, re.S)
    aberto = [x.strip() for x in re.findall(r'allow ([^:]*(?:create|update|write)[^:]*):\s*if (?!dono\(\)|false)', m.group(1))] if m else []
    res(f'regras: {col}/ fechada para quem não é a loja', not aberto, 'aberta: ' + ', '.join(aberto) if aberto else ('sem regra = fechada' if not m else 'só a loja'))
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
