# Inventário de remendos do APP (S435, 19/11): lê src/*.js e www/style.css, NÃO mexe em nada
import re,os,json,collections
SRC='/home/claude/lafouch/src';fs=sorted(f for f in os.listdir(SRC) if f.endswith('.js'))
FAM=[('camera|estudio|giro|leitor','Câmera / Estúdio'),('estoque|inv|ficha|contagem|lote|forn|repos','Peças / Inventário'),('caixa|desp|fx|cambio|lamoneda|reserva|din','Dinheiro'),('site|loja|onl|ped|reserva|msg|anl','Site / Pedidos'),('dash|hist|giro|prec|preco|contador|cnt|lucro','Resultados / Preços'),('venda|carrinho|catalogo|cart|pag','Vender'),('mkt|marketing|tem|cup|vid','Marketing'),('ajust|seg|sync|backup|nuvem','Ajustes'),('cli|ata','Clientes / Atacado'),('barra|grupo|nav|inicio|s374|navegacao|render','Navegação / Início')]
def fam(f):
  for k,n in FAM:
    if re.search(k,f): return n
  return 'Base / outros'
decl=collections.defaultdict(list);act=collections.defaultdict(list);wrap=[];reat=[];stub=[]
txt={}
for f in fs:
  L=open(os.path.join(SRC,f),encoding='utf-8').read().split('\n');txt[f]=L
  for i,l in enumerate(L,1):
    m=re.match(r'^\s{2}function ([A-Za-z_$][\w$]*)\s*\(',l)
    if m: decl[m.group(1)].append((f,i))
    for m in re.finditer(r'ACT\.([A-Za-z_$][\w$]*)\s*=\s*function',l): act[m.group(1)].append((f,i))
    m=re.match(r'^\s*var\s+(_[\w$]+)\s*=\s*((?:ACT\.)?[A-Za-z_$][\w$]*)\s*[;,]',l)
    if m: wrap.append((m.group(2),m.group(1),f,i))
    m=re.match(r'^\s{2,}([A-Za-z_$][\w$]*)\s*=\s*function\b',l)
    if m: reat.append((m.group(1),f,i))
    if re.search(r'function\s*\([^)]*\)\s*\{\s*(return;?\s*)?\}',l) and re.search(r'(=|:)\s*function',l): stub.append((f,i,l.strip()[:90]))
dupdecl={k:v for k,v in decl.items() if len(v)>1}
dupact={k:v for k,v in act.items() if len(v)>1}
reat_dec=[(n,f,i) for n,f,i in reat if n in decl and not any(df==f and di==i for df,di in decl[n])]
wraps=[w for w in wrap if (w[0].replace('ACT.','') in act or w[0] in decl)]
# CSS
css=open('/home/claude/lafouch/www/style.css',encoding='utf-8').read()
imp=css.count('!important');lin=css.count('\n')
sels=collections.Counter()
for m in re.finditer(r'([^{}]+)\{[^{}]*\}',re.sub(r'/\*.*?\*/','',css,flags=re.S)):
  for s in m.group(1).split(','):
    s=s.strip()
    if s and not s.startswith('@') and not s[0].isdigit() and not s.startswith('from') and not s.startswith('to'): sels[s]+=1
dupsel={k:v for k,v in sels.items() if v>2}
R=dict(dupdecl=dupdecl,dupact=dupact,reat_dec=reat_dec,wraps=wraps,stub=stub,css=dict(imp=imp,lin=lin,dupsel=len(dupsel),top=sorted(dupsel.items(),key=lambda x:-x[1])[:25]),arqs98=[f for f in fs if re.match(r'^(98z|99)',f)])
json.dump(R,open('inv.json','w'),ensure_ascii=False,indent=1)
print('arquivos',len(fs),'| declaradas 2+ vezes',len(dupdecl),'| ações ACT 2+ vezes',len(dupact),'| reatribuições de função declarada',len(reat_dec),'| embrulhos var _x=x',len(wraps),'| tocos',len(stub),'| css !important',imp,'linhas',lin,'seletores 3+ vezes',len(dupsel),'| arquivos 98z/99',len(R['arqs98']))
# por família
F=collections.Counter()
for n,f,i in reat_dec: F[fam(f)]+=1
for k,v in dupact.items():
  for f,i in v[1:]: F[fam(f)]+=1
for k,v in dupdecl.items():
  for f,i in v[1:]: F[fam(f)]+=1
print(sorted(F.items(),key=lambda x:-x[1]))
