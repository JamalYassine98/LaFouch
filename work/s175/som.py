# trilha sintetizada só para a amostra (no app final: biblioteca de músicas de uso livre)
import numpy as np, wave, sys
SR=48000
def nota(n): return 440*2**((n-69)/12)
def env(N,a,r):
    e=np.ones(N); A=int(a*SR); Rr=int(r*SR)
    if A: e[:A]=np.linspace(0,1,A)
    if Rr: e[-Rr:]*=np.linspace(1,0,Rr)
    return e
def pad(dur,acordes,vol=.08):
    N=int(dur*SR); y=np.zeros(N); L=dur/len(acordes); t=np.arange(int(L*SR))/SR
    for i,ac in enumerate(acordes):
        s=np.zeros(len(t))
        for n in ac:
            f=nota(n)
            for h,g in ((1,1),(2,.35),(3,.12)): s+=g*np.sin(2*np.pi*f*h*t+np.sin(2*np.pi*.3*t)*.3)
        s*=env(len(t),.8,.9); a=int(i*L*SR); y[a:a+len(t)]+=s[:N-a]
    return y/np.max(np.abs(y))*vol
def sino(N,t0,n,vol=.12,dec=1.4):
    y=np.zeros(N); a=int(t0*SR); L=min(N-a,int(2.5*SR)); t=np.arange(L)/SR; f=nota(n)
    s=(np.sin(2*np.pi*f*t)+.5*np.sin(2*np.pi*f*2.76*t)+.25*np.sin(2*np.pi*f*5.4*t))*np.exp(-t*dec)
    y[a:a+L]+=s*vol; return y
def woosh(N,t0,dur=.6,vol=.18):
    y=np.zeros(N); a=int(t0*SR); L=int(dur*SR); r=np.random.randn(L)
    k=np.exp(-np.linspace(-3,3,L)**2)            # sobe e desce
    # filtro passa-baixa móvel simples
    o=np.zeros(L); c=0
    for i in range(L): c+= (0.05+0.25*k[i])*(r[i]-c); o[i]=c
    y[a:a+L]+=o*k*vol*3; return y
def pop(N,t0,vol=.25):
    y=np.zeros(N); a=int(t0*SR); L=int(.25*SR); t=np.arange(L)/SR
    y[a:a+L]+=np.sin(2*np.pi*(600*np.exp(-t*18)+180)*t)*np.exp(-t*20)*vol; return y
v=int(sys.argv[1]); dur={1:12.5,2:12.5,3:11}[v]; N=int(dur*SR)
if v==1:
    y=pad(dur,[[57,64,67,71],[53,60,64,69],[55,62,67,71],[57,64,67,72]])
    for t0 in (0.85,5.5,10.2): y+=woosh(N,t0)
    for i,t0 in enumerate([3.2,3.28,3.36,3.44,3.52]): y+=sino(N,t0,84+[0,2,4,7,9][i],.05,6)
    y+=sino(N,9.8,88,.10,2.2); y+=sino(N,11.0,76,.08,1.0)
if v==2:
    y=pad(dur,[[60,64,67],[65,69,72],[67,71,74],[60,64,67,72]],.07)
    mel=[(0.4,79),(0.7,81),(1.0,83),(1.6,84),(2.9,86),(3.6,84),(4.3,83)]
    for t0,n in mel: y+=sino(N,t0,n,.07,2.5)
    y+=pop(N,2.4,.28)
    for t0 in (4.9,6.6,8.3,10.1): y+=woosh(N,t0,.5,.16)
    for t0,n in ((10.8,84),(11.0,88),(11.2,91)): y+=sino(N,t0,n,.07,2)
if v==3:
    y=pad(dur,[[62,65,69,72],[58,62,65,69],[60,64,67,70],[65,69,72,76]],.07)
    y+=pop(N,1.9,.22); y+=pop(N,3.2,.12)
    for t0 in (5.0,8.7): y+=woosh(N,t0,.6,.16)
    y+=sino(N,6.3,84,.08,2.5); y+=sino(N,9.4,79,.08,1.5); y+=sino(N,9.6,84,.07,1.5)
y*=env(N,.05,1.0); y=np.clip(y,-1,1)
s=(np.c_[y,y]*32767).astype(np.int16)
with wave.open('/tmp/som%d.wav'%v,'wb') as w: w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(s.tobytes())
