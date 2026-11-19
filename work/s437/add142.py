# guarda um esboço 142x aprovado na base (work/kit/base_app.py)
import json,sys
k=sys.argv[1];quando=sys.argv[2]
C=json.load(open('/tmp/c142.json'))[k]
css,js,tit=C
J=("()=>{"+";".join("("+x+")()" for x in js)+"}") if js else ''
p='/home/claude/lafouch/work/kit/base_app.py';b=open(p).read()
if "'id': '142%s'"%k in b: print('já tem');sys.exit()
item="    {'id': '142%s', 'nome': %r, 'css': %r, 'js': %r},\n"%(k,'%s (esboço 142%s, aprovado %s)'%(tit,k,quando),css,J)
i=b.rindex("]\ndef script");open(p,'w').write(b[:i]+item+b[i:]);print('ok 142'+k)
