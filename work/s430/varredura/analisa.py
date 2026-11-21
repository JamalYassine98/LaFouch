import json,glob,re,sys
JS='/tmp/porteiro/js/lf-site.js'  # a cópia servida (offsets batem com a cobertura)
s=open(JS).read()
C={}
for f in glob.glob('/tmp/porteiro/cob_*.json')+glob.glob('/tmp/cob_roteiros*.json'):
    for k,v in json.load(open(f)).items(): C[k]=C.get(k,0) or v
tot=len(C);rod=sum(C.values())
N=[]
for k,v in C.items():
    if v: continue
    nome,a,b=k.rsplit('|',2);a=int(a);b=int(b)
    N.append((b-a,nome,a,b))
N.sort(reverse=True)
# só as de fora (não contidas em outra nunca-rodada)
top=[]
for t in sorted(N,key=lambda x:(x[2],-x[3])):
    if top and t[2]>=top[-1][2] and t[3]<=top[-1][3]: continue
    top.append(t)
lin=lambda o:s.count('\n',0,o)+1
R=[]
for tam,nome,a,b in top:
    refs=len(re.findall(r'(?<![\w$.])'+re.escape(nome)+r'(?![\w$])',s)) if nome else -1
    R.append({'nome':nome,'linha':lin(a),'tam':tam,'refs':refs,'ini':s[a:a+110].replace('\n',' ')})
json.dump({'total':tot,'rodaram':rod,'nunca':R},open('/tmp/var/nunca.json','w'),ensure_ascii=False,indent=0)
print('funções',tot,'rodaram',rod,'(%d%%)'%(100*rod/tot),'· blocos de fora nunca rodados:',len(R),'· bytes:',sum(r['tam'] for r in R),'de',len(s))
so1=[r for r in R if r['refs']==1]
print('nome definido e NUNCA citado em outro lugar (morto certo pelos dois critérios):',len(so1),sum(r['tam'] for r in so1),'bytes')
for r in sorted(so1,key=lambda r:-r['tam'])[:60]: print(' ',r['linha'],r['nome'],r['tam'])
