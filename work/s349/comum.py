# S349: peças comuns dos esboços (prancha Hoje × Proposta; celular/tablet lado a lado, PC Hoje em cima e Proposta embaixo; olho).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s349/';T='/tmp/s349/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
def prancha(nome,titulo,sub,a,b,pc=False):
    ims=[Image.open(a).convert('RGB'),Image.open(b).convert('RGB')];w,h=ims[0].size;g=40;k=w/780.0 if not pc else 1.0;k=max(1.0,min(k,1.6))
    ft,fs,fr=int(40*k),int(25*k),int(34*k)
    while ft>22 and ImageDraw.Draw(Image.new('RGB',(4,4))).textlength(titulo,font=F(ft,True))>((w+2*g) if pc else (g+2*(w+g)))-2*g: ft-=2
    larg=(w+2*g) if pc else (g+2*(w+g));_d=ImageDraw.Draw(Image.new('RGB',(4,4)));ns=[]
    for l in sub:
        ps=l.split(' ');a=''
        for q in ps:
            if _d.textlength((a+' '+q).strip(),font=F(fs))>larg-2*g and a: ns.append(a);a=q
            else: a=(a+' '+q).strip()
        ns.append(a)
    sub=ns
    top0=int(34*k);ls=int(36*k);cab=top0+int(60*k)+len(sub)*ls+int(20*k)
    if pc:
        S=Image.new('RGB',(w+2*g,cab+2*(h+int(70*k))+g),'#f1eef0');d=ImageDraw.Draw(S);y=cab
        for i,(im,r) in enumerate(zip(ims,('HOJE','PROPOSTA'))):
            d.text((g,y),r,font=F(fr,True),fill='#8d3a69' if i else '#1d1418');y+=int(54*k);S.paste(im,(g,y));d.rectangle([g-1,y-1,g+w,y+h],outline='#cfc6cb');y+=h+int(16*k)
    else:
        S=Image.new('RGB',(g+2*(w+g),cab+int(54*k)+h+g),'#f1eef0');d=ImageDraw.Draw(S)
        for i,(im,r) in enumerate(zip(ims,('HOJE','PROPOSTA'))):
            x=g+i*(w+g);d.text((x,cab),r,font=F(fr,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,cab+int(54*k)));d.rectangle([x-1,cab+int(54*k)-1,x+w,cab+int(54*k)+h],outline='#cfc6cb')
    d.text((g,top0),titulo,font=F(ft,True),fill='#1d1418')
    for i,l in enumerate(sub): d.text((g,top0+int(60*k)+i*ls),l,font=F(fs),fill='#55484f')
    S.save(OUT+nome,quality=88);print(' ',nome,S.size)
def olho(pg):
    try: return set(str((f['r'],f.get('ex'))) for f in (pg.evaluate(OLHO) or []))
    except Exception as e: return set()
import re as _re
_n=lambda x:_re.sub(r'\d+','#',x)
def _it(o):
    r=set()
    for x in o:
        try: t=eval(x)
        except Exception: r.add(_n(x));continue
        for i in (t[1] or ['']): r.add(_n(str(t[0])+'|'+str(i)))
    return r
def novos(o0,o1):
    a=_it(o0);return sorted(_it(o1)-a) or 'nenhum'
ALIN=open('/home/claude/lafouch/work/kit/alin.js').read()
def alin(pg,blocos):
    try: return pg.evaluate(ALIN,blocos) or []
    except Exception as e: return [{'r':'erro alin','ex':[str(e)[:120]]}]

# TRAVA (18/11/2026, pedido do dono "vive repetindo"): esboço com aviso novo do olho ou da prova de alinhamento NÃO vira prancha.
# Só passa o que foi explicado no próprio caso (lista ok=[...] com o motivo). Sem isso, sai BLOQUEADO e não é enviado.
def trava(k,nv,aa,ok=()):
    nv=[x for x in (nv if isinstance(nv,list) else []) if not any(o in x for o in ok)]
    ruim=(aa[1]>aa[0]) or bool(nv)
    if ruim: print('BLOQUEADO',k,'olho novos:',nv,'alin hoje/depois:',aa,flush=True)
    return not ruim
