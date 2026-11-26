# Desfaz SÓ a limpeza 2bd291d sobre um index.html atual: devolve as declarações que ela tirou, cada uma no seu lugar.
import sys,difflib,subprocess,json
sys.path.insert(0,'/home/claude/volta/desfaz'); import css
G=lambda c:subprocess.run(['git','-C','/home/claude/catalogo','show',c+':index.html'],capture_output=True,text=True).stdout
old,new=G('2bd291d~1'),G('2bd291d'); cur=open(sys.argv[1]).read()
Ro,Rn,Rc=css.rules(old),css.rules(new),css.rules(cur)
key=lambda r:(r['ctx'],r['sel'])
def align(A,B):
    sm=difflib.SequenceMatcher(None,[key(r) for r in A],[key(r) for r in B],autojunk=False); m={}
    for t,i1,i2,j1,j2 in sm.get_opcodes():
        if t=='equal':
            for k in range(i2-i1): m[i1+k]=j1+k
        elif t=='replace':   # pareia pelo mesmo seletor dentro do trecho trocado
            usados=set()
            for i in range(i1,i2):
                for j in range(j1,j2):
                    if j not in usados and key(A[i])==key(B[j]): m[i]=j;usados.add(j);break
    return m
on,nc=align(Ro,Rn),align(Rn,Rc)
ins=[]   # (posição no atual, texto)
log={'decl_volta':0,'regra_volta':0,'ja_tem':0,'sem_lugar':[]}
for i,r in enumerate(Ro):
    if i in on:
        n=Rn[on[i]]; nd={css.norm_d(x) for x in n['d']}
        falta=[x for x in r['d'] if css.norm_d(x) not in nd]
        if not falta: continue
        if on[i] not in nc: log['sem_lugar'].append(r['sel'][:60]+' (regra sumiu depois)'); continue
        c=Rc[nc[on[i]]]; cp={css.prop(x) for x in c['d']}; cd={css.norm_d(x) for x in c['d']}
        add=[]
        for x in falta:
            if css.norm_d(x) in cd: continue
            if css.prop(x) in cp and not css.prop(x).startswith('--'): log['ja_tem']+=1   # mudou depois: devolve mesmo assim no lugar de antes? não — mantém a de hoje
            else: add.append(x)
        if add:
            # devolve na ordem de antes: antes da 1ª declaração que hoje existe e vinha depois delas
            body=cur[c['bo']+1:c['bc']]; txt=';'.join(add)
            ins.append((c['bo']+1,txt+(';' if body.strip() else ''))); log['decl_volta']+=len(add)
    else:
        # regra inteira tirada: entra antes da próxima regra de antes que ainda existe hoje, no mesmo contexto
        lugar=None
        for k in range(i+1,len(Ro)):
            if k in on and on[k] in nc:
                c=Rc[nc[on[k]]]
                if c['ctx']==r['ctx']: lugar=c['a']; txt=r['sel']+'{'+';'.join(r['d'])+'}\n'
                else:
                    lugar=c['top']; txt=r['sel']+'{'+';'.join(r['d'])+'}'
                    for w in reversed(r['ctx']): txt=w+'{'+txt+'}'
                    txt+='\n'
                break
        if lugar is None: log['sem_lugar'].append(r['sel'][:60]+' '+str(r['ctx'])[:40]); continue
        ins.append((lugar,txt)); log['regra_volta']+=1
for p,t in sorted(ins,key=lambda x:-x[0]): cur=cur[:p]+t+cur[p:]
open(sys.argv[2],'w').write(cur); print(json.dumps(log,ensure_ascii=False,indent=0)[:3000])
