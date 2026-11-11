import json,subprocess,numpy as np,glob,os,sys
def pcm(f):return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',f,'-f','s16le','-ac','1','-ar','16000','-'],capture_output=True).stdout,dtype=np.int16).astype(float)/32768
def f0(x):
    P=[];w=640
    for i in range(0,len(x)-w,320):
        s=x[i:i+w]
        if np.sqrt(np.mean(s*s))<.03:continue
        s=s-s.mean();c=np.correlate(s,s,'full')[w-1:];lo,hi=16000//500,16000//120;k=lo+int(np.argmax(c[lo:hi]))
        if c[k]>.5*c[0]:P.append(16000/k)
    return float(np.median(P)) if P else 0
def lufs(f):
    r=subprocess.run(['ffmpeg','-v','info','-i',f,'-af','ebur128','-f','null','-'],capture_output=True,text=True).stderr
    import re;m=re.findall(r'I:\s+(-?[\d.]+) LUFS',r);return float(m[-1]) if m else 0
def mede(f,txt=''):
    x=pcm(f);w=160;e=np.array([np.sqrt(np.mean(x[k*w:(k+1)*w]**2)) for k in range(len(x)//w)])
    v=np.where(e>0.01)[0]
    if not len(v):return None
    ini=int(v[0])*10;fim=int(len(e)-1-v[-1])*10
    # ataque: subida nos primeiros 30 ms de som
    at=float(e[v[0]:v[0]+3].max()) 
    # maior pausa interna
    gaps=[];run=0
    for k in range(v[0],v[-1]):
        if e[k]<0.006:run+=1
        else:
            if run:gaps.append(int(run)*10);run=0
    return dict(dur=round(len(x)/16000,2),sil_ini=ini,sil_fim=fim,ataque=round(at,3),pico=round(float(np.abs(x).max()),2),lufs=lufs(f),pausa=max(gaps) if gaps else 0,f0=round(f0(x)),ms_letra=round(len(x)/16*1.0/max(1,len(txt)),0) if txt else 0)
if __name__=='__main__':
    out={}
    d=json.load(open('/home/claude/catalogo/media/voz/pt/lista.json'))
    for k,v in d.items():
        for f in ([v] if isinstance(v,str) else v):
            out[f]=dict(mede('/home/claude/catalogo/media/voz/pt/'+f,k),txt=k)
    json.dump(out,open('/home/claude/lafouch/work/s164/pt.json','w'),ensure_ascii=False,indent=0)
    es={}
    for f in sorted(glob.glob('/home/claude/lafouch/work/s163/g/*_0?.mp3'))+sorted(glob.glob('/home/claude/voz_final/es/es4_*.mp3')):
        es[os.path.basename(f)]=mede(f)
    json.dump(es,open('/home/claude/lafouch/work/s164/es.json','w'),ensure_ascii=False,indent=0)
