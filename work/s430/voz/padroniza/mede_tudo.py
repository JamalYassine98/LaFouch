import subprocess,json,re,glob,sys,numpy as np,os
os.environ.setdefault('XI','x');sys.path.insert(0,'/home/claude/lafouch/work/voz')
import librosa,voz
S=sys.argv[1] if len(sys.argv)>1 else '/home/claude/catalogo/media/voz/'
def ebu(f):
    r=subprocess.run(['ffmpeg','-nostats','-i',f,'-filter_complex','ebur128=peak=true:framelog=verbose','-f','null','-'],capture_output=True,text=True).stderr
    I=float(re.findall(r'I:\s+(-?[\d.]+) LUFS',r)[-1]);LRA=float(re.findall(r'LRA:\s+(-?[\d.]+) LU',r)[-1]);TP=float(re.findall(r'Peak:\s+(-?[\d.]+|-inf) dBFS',r)[-1])
    M=[float(x) for x in re.findall(r'M:\s*(-?[\d.]+)',r)];M=[m for m in M if m>-60]
    return I,LRA,TP,(max(M) if M else -99)
def le(f,sr=22050): return np.frombuffer(subprocess.run(['ffmpeg','-v','quiet','-i',f,'-ac','1','-ar',str(sr),'-f','f32le','-'],capture_output=True).stdout,dtype=np.float32).copy()
R={}
for lg in ('pt','es'):
    L=json.load(open(S+lg+'/lista.json'));inv={v:k for k,v in L.items()}
    fs=sorted(glob.glob(S+lg+'/*.mp3'))
    ref=[f for f in fs if re.search(r'/(pt[4-7]|es7)_',f)][::7][:24];E0=np.mean([voz.emb(f) for f in ref],0)
    for f in fs:
        I,LRA,TP,Mx=ebu(f);x=le(f)
        f0,_,_=librosa.pyin(x,fmin=150,fmax=600,sr=22050,hop_length=512);f0=f0[~np.isnan(f0)]
        S2=np.abs(librosa.stft(x,n_fft=1024,hop_length=512))**2;fr=librosa.fft_frequencies(sr=22050,n_fft=1024);e=S2.sum(0);v=e>e.max()*.02
        gr=float(10*np.log10(S2[(fr>=80)&(fr<300)][:,v].sum()/S2[:,v].sum()+1e-12))
        R[f.split('/voz/')[1]]=dict(txt=inv.get(os.path.basename(f),''),I=I,LRA=LRA,TP=TP,Mmax=Mx,dur=len(x)/22050,tom=float(np.median(f0)) if len(f0) else 0,grave=gr,sim=float(voz.sim(voz.emb(f),E0)))
json.dump(R,open(sys.argv[2] if len(sys.argv)>2 else '/tmp/vz/medidas.json','w'),ensure_ascii=False)
print(len(R),'falas medidas')
