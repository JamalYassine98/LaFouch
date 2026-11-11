import librosa,numpy as np
def feat(f):
    y,sr=librosa.load(f,sr=16000);rms=librosa.feature.rms(y=y)[0];m=librosa.feature.mfcc(y=y,sr=sr,n_mfcc=20)
    k=rms>np.percentile(rms,40);m=m[:,:len(k)][:,k]
    f0,vf,_=librosa.pyin(y,fmin=120,fmax=600,sr=sr);f0=f0[vf] if vf is not None else []
    cen=librosa.feature.spectral_centroid(y=y,sr=sr)[0][:len(k)][k]
    return dict(mf=m[1:].mean(1),f0=float(np.nanmedian(f0)) if len(f0) else 0,cen=float(np.median(cen)))
def dist(a,b):return float(np.linalg.norm(a['mf']-b['mf']))
