import json,collections
R=json.load(open('/tmp/esc/cf/res2.json'))
N=['x','y','w','h','fundo','cor','letra','canto','pos','display']
for nome,r in R.items():
    if not r['ndif'] and not r['nsumiu'] and not r['nnovo']: continue
    C=collections.Counter();ex={}
    for a,b in r['dif']:
        A=a.split('§');B=b.split('§')
        for i,n in enumerate(N):
            if A[i+1]!=B[i+1]:
                k=n+(':%+d'%(int(B[i+1])-int(A[i+1])) if i<4 else '');C[k]+=1;ex.setdefault(k,A[0][:30]+' '+A[i+1][:22]+'→'+B[i+1][:22])
    print('%-24s mudou %3d sumiu %2d novo %2d |'%(nome,r['ndif'],r['nsumiu'],r['nnovo']),' '.join('%s×%d'%kv for kv in C.most_common(7)))
    for k,v in list(ex.items())[:0]: print('     ',k,v)
    if r['nsumiu']: print('      sumiu:',[s[:34] for s in r['sumiu'][:6]])
    if r['nnovo']: print('      novo:',[s[:34] for s in r['novo'][:4]])
json.dump(1,open('/dev/null','w'))
