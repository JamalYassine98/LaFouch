# S436 (20/11): cadeias de remendo do APP — para cada função/ação reescrita, cada elo com arquivo, linha, tamanho e TIPO.
# Só leitura. Saída: cadeias.json + resumo na tela.
import re,os,json,collections
SRC='/home/claude/lafouch/src';fs=sorted(f for f in os.listdir(SRC) if f.endswith('.js'))
txt={f:open(os.path.join(SRC,f),encoding='utf-8').read().split('\n') for f in fs}
def corpo(L,i):
  # do início da linha i (1-based) até fechar as chaves abertas a partir do primeiro '{' depois de 'function'
  s='\n'.join(L[i-1:]);k=s.find('function');a=s.find('{',k);n=0;j=a
  inS=None;esc=False
  while j<len(s):
    c=s[j]
    if inS:
      if esc: esc=False
      elif c=='\\': esc=True
      elif c==inS: inS=None
    elif c in '"\'`': inS=c
    elif c=='/' and s[j+1:j+2]=='/':
      j=s.find('\n',j); 
      if j<0: break
      continue
    elif c=='{': n+=1
    elif c=='}':
      n-=1
      if n==0: break
    j+=1
  return s[a:j+1]
elos=collections.defaultdict(list)
for f in fs:
  L=txt[f]
  for i,l in enumerate(L,1):
    m=re.match(r'^\s{2}function ([A-Za-z_$][\w$]*)\s*\(',l)
    if m: elos[m.group(1)].append(dict(f=f,l=i,forma='decl'))
    for m in re.finditer(r'(?<![\w$.])(ACT\.[A-Za-z_$][\w$]*)\s*=\s*function',l): elos[m.group(1)].append(dict(f=f,l=i,forma='acao'))
    m=re.match(r'^\s{2,}([A-Za-z_$][\w$]*)\s*=\s*function\b',l)
    if m: elos[m.group(1)].append(dict(f=f,l=i,forma='reat'))
# embrulhos: var _x = nome
wr=collections.defaultdict(list)
for f in fs:
  for i,l in enumerate(txt[f],1):
    m=re.match(r'^\s*var\s+(_[\w$]+)\s*=\s*((?:ACT\.)?[A-Za-z_$][\w$]*)\s*[;,]',l)
    if m: wr[(m.group(2),f)].append((m.group(1),i))
R={}
for n,v in elos.items():
  if len(v)<2: continue
  if not any(e['forma']=='decl' for e in v) and not n.startswith('ACT.'): continue
  v.sort(key=lambda e:(fs.index(e['f']),e['l']))
  for k,e in enumerate(v):
    c=corpo(txt[e['f']],e['l']);e['linhas']=c.count('\n')+1
    ant=[a for a,i in wr.get((n,e['f']),[]) if i<=e['l'] and e['l']-i<4]
    chama=bool(ant) and any(re.search(re.escape(a)+r'\s*(\.apply|\.call|\()',c) for a in ant)
    e['guarda']=ant[0] if ant else ''
    if k==0: e['tipo']='original'
    elif not chama: e['tipo']='troca tudo'
    else:
      # antes/depois: onde a chamada da velha aparece
      a=ant[0];p=re.search(re.escape(a)+r'\s*(\.apply|\.call|\()',c).start()
      antes=len(c[:p].strip('{ \n'))>12 and not re.match(r'^\{\s*(var\s+\w+\s*=\s*|return\s+)$',c[:p]);depois=len(re.sub(r'^[^;]*;?','',c[p:],1).strip('} \n;'))>12
      e['tipo']='antes+depois' if antes and depois else 'antes (desvio)' if antes else 'depois (acréscimo)' if depois else 'só repassa'
  R[n]=v
json.dump(R,open('cadeias.json','w'),ensure_ascii=False,indent=1)
tip=collections.Counter(e['tipo'] for v in R.values() for e in v[1:])
print(len(R),'nomes com cadeia ·',sum(len(v)-1 for v in R.values()),'elos de remendo ·',dict(tip))
for n,v in sorted(R.items(),key=lambda x:-len(x[1])):
  print('%-22s %d  %s'%(n,len(v)-1,' → '.join('%s:%d[%s,%dl]'%(e['f'][:22],e['l'],e['tipo'][:6],e['linhas']) for e in v)))
