import json,subprocess,re,sys
SOFT="atempo=0.94,lowpass=f=7500,deesser=i=0.4,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150,loudnorm=I=-18,apad=pad_dur=0.06"
def frases(al):
  ch=''.join(al['characters']);st=al['character_start_times_seconds'];en=al['character_end_times_seconds']
  t0=ch.rfind(']')+1;out=[];i=t0
  for m in re.finditer(r'[.!?…](?=\s|$)',ch):
    j=m.start()
    if j<t0:continue
    while i<len(ch) and ch[i].isspace():i+=1
    out.append((ch[i:j+1],st[i],en[j]));i=j+1
  return out
def corta(src,al,pref):
  F=frases(al);fs=[]
  for n,(txt,a,b) in enumerate(F):
    prox=F[n+1][1] if n+1<len(F) else b+0.4
    ini=max(0,a-0.06);fim=min(prox-0.02,b+0.18)  # nunca entra na próxima frase
    o=f'{pref}_{n:02d}.mp3';subprocess.run(['ffmpeg','-v','error','-y','-ss',str(ini),'-to',str(fim),'-i',src,'-af',SOFT,'-ar','44100','-ac','1','-b:a','128k',o],check=True);fs.append((txt,o))
  return fs
if __name__=='__main__':
  for k in 'AB':
    fs=corta(f'raw_{k}.mp3',json.load(open(f'al_{k}.json')),f'p{k}')
    for t,o in fs:print(k,o,t)
    lst=open(f'l{k}.txt','w')
    subprocess.run(['ffmpeg','-v','error','-y','-f','lavfi','-i','anullsrc=r=44100:cl=mono','-t','0.18','-b:a','128k','sil.mp3'],check=True)
    for t,o in fs:lst.write(f"file '{o}'\nfile 'sil.mp3'\n")
    lst.close();subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',f'l{k}.txt','-ar','44100','-ac','1','-b:a','128k',f'/home/claude/Mochi_amostra_{k}.mp3'],check=True)
