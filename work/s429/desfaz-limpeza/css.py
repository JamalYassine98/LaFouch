# Mini leitor de CSS dentro do HTML: devolve as regras em ordem com contexto (@media…), seletor, declarações e posições.
import re
def _skip_str(s,i):
    q=s[i];i+=1
    while i<len(s) and s[i]!=q:
        i+=2 if s[i]=='\\' else 1
    return i+1
def _match(s,i):  # i em '{' → posição depois do '}' correspondente
    d=0
    while i<len(s):
        c=s[i]
        if c in '"\'': i=_skip_str(s,i); continue
        if s.startswith('/*',i): i=s.find('*/',i+2)+2; continue
        if c=='{': d+=1
        elif c=='}':
            d-=1
            if d==0: return i+1
        i+=1
    return i
def decls(body):
    out=[];cur='';d=0;i=0
    while i<len(body):
        c=body[i]
        if c in '"\'':
            j=_skip_str(body,i);cur+=body[i:j];i=j;continue
        if body.startswith('/*',i): i=body.find('*/',i+2)+2;continue
        if c=='(':d+=1
        if c==')':d-=1
        if c==';' and d==0:
            if cur.strip(): out.append(cur.strip())
            cur=''
        else: cur+=c
        i+=1
    if cur.strip(): out.append(cur.strip())
    return out
def norm_d(x):
    p,_,v=x.partition(':'); return p.strip().lower()+':'+re.sub(r'\s+',' ',v.strip())
def prop(x): return x.partition(':')[0].strip().lower()
def norm_sel(x): return re.sub(r'\s+',' ',x.strip())
def rules(html):
    R=[]
    for m in re.finditer(r'<style[^>]*>(.*?)</style>',html,re.S):
        _walk(html,m.start(1),m.end(1),(),R,None)
    return R
def _walk(s,a,b,ctx,R,top):
    i=a;st=a
    while i<b:
        c=s[i]
        if c in '"\'': i=_skip_str(s,i);continue
        if s.startswith('/*',i):
            i=s.find('*/',i+2)+2; st=i; continue
        if c=='}' or c==';' and s[st:i].lstrip().startswith('@'):
            i+=1; st=i; continue
        if c=='{':
            pre=s[st:i].strip(); end=_match(s,i)
            if pre.startswith('@media') or pre.startswith('@supports') or pre.startswith('@container') or pre.startswith('@layer'):
                _walk(s,i+1,end-1,ctx+(norm_sel(pre),),R,top if top is not None else st+len(s[st:i])-len(s[st:i].lstrip()))
            elif pre.startswith('@'):
                pass   # @keyframes, @font-face: inteiro, não mexe
            else:
                _a=st+len(s[st:i])-len(s[st:i].lstrip())
                R.append(dict(ctx=ctx,top=top if top is not None else _a,sel=norm_sel(pre),a=_a,bo=i,bc=end-1,d=decls(s[i+1:end-1])))
            i=end; st=i; continue
        i+=1
    return R
