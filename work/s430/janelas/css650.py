import re,difflib,json,sys
def regras(html):
    # devolve lista de (seletor, corpo, texto) para regras simples dentro dos <style>, entrando em @media
    out=[]
    for st in re.findall(r'<style[^>]*>(.*?)</style>',html,re.S):
        i=0;n=len(st);pilha=[]
        while i<n:
            j=st.find('{',i)
            if j<0:break
            k=st.find('}',i)
            if 0<=k<j: i=k+1; (pilha and pilha.pop()); continue
            sel=st[i:j].strip()
            if sel.startswith('@') and not sel.startswith('@font-face'):
                pilha.append(sel); i=j+1; continue
            f=st.find('}',j)
            out.append((' '.join(pilha),sel,st[j+1:f],st[i:f+1])); i=f+1
    return out
A=regras(open('/tmp/var/idx_650pai.html').read());B=regras(open('/tmp/var/idx_650.html').read())
ka=[(a[0],a[1]) for a in A];kb=[(b[0],b[1]) for b in B]
sm=difflib.SequenceMatcher(None,ka,kb,autojunk=False)
cortes=[];sumidas=[]
for tag,i1,i2,j1,j2 in sm.get_opcodes():
    if tag=='equal':
        for x,y in zip(range(i1,i2),range(j1,j2)):
            if A[x][2]!=B[y][2]: cortes.append((A[x],B[y]))
    elif tag in('delete','replace'):
        for x in range(i1,i2): sumidas.append(A[x])
        if tag=='replace': print('REPLACE',[A[x][1][:40] for x in range(i1,i2)][:3],'->',[B[y][1][:40] for y in range(j1,j2)][:3])
print('regras antes',len(A),'depois',len(B),'· regras com declarações cortadas:',len(cortes),'· regras que sumiram inteiras:',len(sumidas))
json.dump({'cortes':[[a[0],a[1],a[2],b[2],a[3],b[3]] for a,b in cortes],'sumidas':[list(a) for a in sumidas]},open('/tmp/var/css650.json','w'),ensure_ascii=False)
