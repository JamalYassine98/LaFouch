# Esboço 75 (S435, 22/11 17:10) — a mesma peça (BR44118), 7 tomadas de ~2 s, cada uma mostrando uma parte diferente, com um movimento
# de câmera só e lento, foco de cinema nas de perto e cenários claros alternados (creme · pedra · linho). Sem recorte (74b), sem frase,
# sem som (os cortes caem a cada 2 s, prontos para a batida da música).
# Mapa do giro (quadros intermediados): 0 frente · 120 três-quartos · 240 perfil · 540 por trás · 840 perfil do outro lado · 1075 frente.
import os,subprocess
from cenarios2 import *
def LINHO_():
  t=np.clip(yy/H,0,1)[...,None];w=(np.sin(xx*1.9)*.5+.5)*(np.sin(yy*1.9)*.5+.5)
  return np.clip(np.stack([np.full((H,W),v) for v in (236,231,224)],-1)-(t*12)-(w[...,None]*5)+grao(3)[...,None],0,255)
LINHO=LINHO_()
def vista(i,zoom,u,v,fundo,cy=.47):
  """câmera virtual: o ponto (u,v) da gravação fica no centro do quadro; zoom = largura da gravação em larguras do quadro"""
  larg=W*zoom;h=larg*640/960;cx=W/2-(u-.5)*larg;cyy=H*cy-(v-.5)*h
  o,_=quadro_peca(i,larg,cx,cyy,fundo);return o
def foco(img,t,ate=1.0,maxr=9):  # começa desfocado e fica nítido
  r=maxr*(1-ease(t/ate));return img.filter(ImageFilter.GaussianBlur(r)) if r>.3 else img
def T1(t):  # dobradiça de perto, o foco chegando
  o=vista(165+t*10,3.1,.33,.33,CREME);return foco(im8(luz(o,np.clip(xx/W*1.1,0,1)*.5+.5,.85)),t)
def T2(t):  # perfil: a câmera desliza pela haste
  o=vista(238+t*3,2.3,.30+.20*ease(t/2),.42,LINHO);return im8(o)
def T3(t):  # três-quartos de cima: a espessura e o bisel do acetato, a câmera desce devagar
  o=vista(95+t*6,2.0,.40,.30+.10*ease(t/2),PEDRA);return foco(im8(o),t,.7,6)
def T4(t):  # o giro inteiro, do três-quartos até a frente
  o=vista(900+t*FPS*2.3,1.0,.5,.5,CREME);return im8(contato(o,W/2,H*.47+185,W*.9))
def T5(t):  # a ponta da haste, por trás, aproximando
  o=vista(540,2.4+.25*ease(t/2),.80,.58,LINHO);return foco(im8(o),t,.8,7)
def T6(t):  # de frente, a faixa de luz passando
  o=vista(0,1.12+.04*ease(t/2),.5,.5,PEDRA);o=contato(o,W/2,H*.47+200,W*1.1);x=-600+ease(t/2)*(W+1200);d=(xx-x)+(yy-H*.5)*.55
  return im8(luz(o,np.clip(1-np.abs(d)/380,0,1)**1.4,.86))
def T7(t):  # o fechamento na pedra: código e logo
  o=vista(0,.88,.5,.5,PEDRA,cy=.40);o=contato(o,W/2,H*.40+160,W*.88,.12);o=luz(o,janela(t),.82)
  return texto_logo(im8(o),ease((t-.3)/.8),ease((t-.7)/.8),H*.60)
TOM_=[(T1,2.0),(T2,2.0),(T3,2.0),(T4,2.5),(T5,2.0),(T6,2.0),(T7,2.5)]
def render(saida):
  ant=None;arqs=[]
  for n,(fn,dur) in enumerate(TOM_):
    tmp='/tmp/tm_c%d.tmp.mp4'%n;p=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s','%dx%d'%(W,H),'-r',str(FPS),'-i','-','-c:v','libx264','-crf','16','-preset','veryfast','-pix_fmt','yuv420p',tmp],stdin=subprocess.PIPE)
    nf=int(dur*FPS)
    for i in range(nf):
      f=fn(i/FPS)
      if ant is not None and i<9:f=Image.blend(ant,f,ease((i+1)/9))
      p.stdin.write(f.tobytes());last=f
    p.stdin.close();p.wait();assert p.returncode==0;os.replace(tmp,'/tmp/tm_c%d.mp4'%n);arqs.append('/tmp/tm_c%d.mp4'%n);ant=last
  open('/tmp/tm_lista.txt','w').write(''.join("file '%s'\n"%a for a in arqs))
  subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','/tmp/tm_lista.txt','-c','copy',saida],check=True);print('ok',saida)
if __name__=='__main__':
  if os.environ.get('Q'):
    q=[T1(1.5),T2(1.0),T3(1.5),T4(1.2),T5(1.6),T6(1.0),T7(2.2)];S=Image.new('RGB',(7*300+8*12,533+24),(17,20,26))
    for i,f in enumerate(q):S.paste(f.resize((300,533)),(12+i*312,12))
    S.save('/tmp/tm_quadros.jpg',quality=88);print('ok quadros')
  else: render('/home/claude/lafouch/work/s435/semp/esboco_75_sete_tomadas_BR44118.mp4')
