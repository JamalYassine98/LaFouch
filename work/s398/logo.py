# S398: logo horizontal (escudo à esquerda de LA FOUCH), montado com as próprias peças do logo do site — nada redesenhado
from PIL import Image
import numpy as np
im=Image.open('/home/claude/catalogo/media/i/926f9307ba28.png').convert('RGBA');A=np.array(im)
def corta(y0,y1):
    a=A[y0:y1+1,:,3];c=np.where(a.max(axis=0)>40)[0];return im.crop((int(c.min()),y0,int(c.max())+1,y1+1))
esc,nome,lema=corta(12,689),corta(778,1154),corta(1235,1343)
def monta(cor=None,lema_on=True):
    g=140;hb=nome.size[1]+(60+lema.size[1] if lema_on else 0);k=hb*1.12/esc.size[1];e=esc.resize((int(esc.size[0]*k),int(esc.size[1]*k)),Image.LANCZOS)
    W=e.size[0]+g+nome.size[0];H=max(e.size[1],hb);S=Image.new('RGBA',(W,H),(0,0,0,0));S.alpha_composite(e,(0,(H-e.size[1])//2));y=(H-hb)//2;S.alpha_composite(nome,(e.size[0]+g,y))
    if lema_on: S.alpha_composite(lema,(e.size[0]+g+(nome.size[0]-lema.size[0])//2,y+nome.size[1]+60))
    if cor:
        a=np.array(S);a[:,:,0],a[:,:,1],a[:,:,2]=cor;S=Image.fromarray(a)
    return S
def salva(S,arq,w):
    S.resize((w,int(w*S.size[1]/S.size[0])),Image.LANCZOS).save(arq)
salva(monta(),'/tmp/s398/logo_h.png',560)                       # vinho, com o lema — topo dos e-mails
salva(monta((214,178,116),False),'/tmp/s398/logo_ouro.png',360)   # dourado, sem lema — dentro dos cartões escuros
salva(monta((141,58,105),False),'/tmp/s398/logo_vinho.png',360)   # vinho, sem lema — dentro dos cartões claros
for k,c in {'natal':(255,217,160),'maes':(255,209,223),'pais':(224,184,120),'anonovo':(227,200,143),'bf':(255,255,255),'halloween':(240,138,60)}.items(): salva(monta(c,False),'/tmp/s398/logo_ev_'+k+'.png',360)   # cor clara de cada temática — cartões de evento
B=Image.new('RGB',(620,330),'#fff');L=Image.open('/tmp/s398/logo_h.png');B.paste(L,(30,20),L);D=Image.new('RGB',(400,110),'#2a1224');O=Image.open('/tmp/s398/logo_ouro.png');D.paste(O,(20,20),O);B.paste(D,(30,200));B.save('/tmp/s398/ver_logo.jpg');print(L.size,O.size)
