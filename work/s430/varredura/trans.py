import json,glob,re
JS='/tmp/porteiro/js/lf-site.js';s=open(JS).read()
C={}
for f in glob.glob('/tmp/porteiro/cob_*.json')+glob.glob('/tmp/cob_roteiros*.json'):
    for k,v in json.load(open(f)).items(): C[k]=C.get(k,0) or v
N=[];
for k,v in C.items():
    nome,a,b=k.rsplit('|',2)
    if not v: N.append((int(a),int(b),nome))
N.sort(key=lambda x:(x[0],-x[1]))
top=[]
for t in N:
    if top and t[0]>=top[-1][0] and t[1]<=top[-1][1]: continue
    top.append(t)
def dentro(pos): 
    import bisect
    i=bisect.bisect_right(ST,pos)-1
    return i>=0 and top[i][1]>pos
ST=[t[0] for t in top]
lin=lambda o:s.count('\n',0,o)+1
R=[]
for a,b,nome in top:
    if not nome or not re.match(r'^[A-Za-z_$][\w$]*$',nome) or b-a<120: continue
    refs=[m.start() for m in re.finditer(r'(?<![\w$.\'"])'+re.escape(nome)+r'(?![\w$])',s)]
    fora=[r for r in refs if not(a<=r<b)]
    vivos=[r for r in fora if not dentro(r)]
    # a própria declaração "function nome" fica logo antes de a..: conta como fora mas não é uso
    vivos=[r for r in vivos if not s[max(0,r-9):r].endswith('function ') and not re.match(r'\s*=\s*function',s[r+len(nome):r+len(nome)+12])]
    if not vivos: R.append((b-a,lin(a),nome,len(fora)))
R.sort(reverse=True)
print('só alcançadas por código que nunca rodou:',len(R),sum(r[0] for r in R),'bytes')
for r in R[:70]: print(r)
json.dump(R,open('/tmp/var/trans.json','w'))
