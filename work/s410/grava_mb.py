# S410 (17/11/2026 20:40) · "Muito bem!" / "¡Muy bien!" sem o "m" esticado: o dono autorizou teto de 2.200 créditos nesta gravação.
# Ideia: a palavra NÃO começa do silêncio — grava "…última frase? Isso, muito bem!" e recorta a partir do "muito", no ponto calmo depois da vírgula.
# Mede tudo o que já foi analisado: "m" antes da vogal (meta ≤ 75 ms, aprovadas 55–65), nitidez, semelhança da cena ≥ 0,90, tom 250–370, volume, pico, silêncios.
# Uso: XI=<chave> python3 grava_mb.py <n tentativas>
import os,sys,json,subprocess,re,numpy as np,librosa
sys.argv=[sys.argv[0]]+sys.argv[1:];N=int((sys.argv[1:] or ['3'])[0])
src=open(os.path.dirname(os.path.abspath(__file__))+'/grava410.py').read().split("if __name__")[0].replace('TETO=1764','TETO=2200')
exec(src)
TX={'pt':'Consegue ler a última frase? Isso, muito bem!','es':'¿Podés leer la última frase? ¡Eso, muy bien!'};PAL={'pt':'muito','es':'muy'}
def nasal(f):
    y,sr=librosa.load(f,sr=16000);S=np.abs(librosa.stft(y,n_fft=512,hop_length=80))**2;fr=librosa.fft_frequencies(sr=sr,n_fft=512)
    lo=S[(fr>80)&(fr<400)].sum(0);hi=S[(fr>700)&(fr<3000)].sum(0);db=10*np.log10(S.sum(0)+1e-12);on=int(np.argmax(db>db.max()-35));r=hi/(lo+1e-12);return int(np.argmax(r[on:]>0.25))*5
def nitidez(f):
    y,sr=librosa.load(f,sr=44100);S=np.abs(librosa.stft(y,n_fft=2048,hop_length=512));e=S.sum(0);S=S[:,e>np.percentile(e,40)];fq=librosa.fft_frequencies(sr=sr,n_fft=2048);P=(S**2).mean(1);return int(fq[np.searchsorted(np.cumsum(P)/P.sum(),.99)])
def corte(lang,base):
    a=json.load(open(base+'.json'));ch=''.join(a['characters']).lower();i=ch.rfind(PAL[lang]);ts=a['character_start_times_seconds'][i];te=a['character_end_times_seconds'][len(ch)-1]
    x=pcm(base+'.mp3');sr=16000;w=160;e=np.array([np.sqrt(np.mean(x[k*w:(k+1)*w]**2)) for k in range(len(x)//w)])
    j0=max(0,int((ts-0.18)*100));j1=min(len(e)-1,int((ts+0.04)*100));jm=j0+int(np.argmin(e[j0:j1+1]));return jm/100,te+0.3
R={}
for lang in ('pt','es'):
    E0,_=ref(lang)
    for t in range(1,N+1):
        base=D+'mb_%s_t%d'%(lang,t)
        if not os.path.exists(base+'.mp3'): print('  gravou',lang,t,'custo',grava(lang,TX[lang],base),flush=True)
        c0,c1=corte(lang,base);o=base+'_cut.mp3'
        subprocess.run(['ffmpeg','-v','error','-y','-ss','%.3f'%c0,'-to','%.3f'%c1,'-i',base+'.mp3','-af','silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.02,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse,afade=t=in:d=0.008,areverse,afade=t=in:d=0.02,areverse,'+TRAT,'-ar','44100','-ac','1','-b:a','128k',o],check=True)
        m=mede(o,'Muito bem!');m['sim']=round(voz.sim(voz.emb(o),E0),3);m['simc']=round(voz.sim(voz.emb(base+'.mp3'),E0),3);m['nasal']=nasal(o);m['nit']=nitidez(o);m['arq']=o
        P=[]
        if m['nasal']>75:P.append('m %d ms'%m['nasal'])
        if m['simc']<.90:P.append('cena %.2f'%m['simc'])
        if m['f0'] and not(250<=m['f0']<=370):P.append('tom %d'%m['f0'])
        if not(-19.7<=m['lufs']<=-17):P.append('volume %.1f'%m['lufs'])
        if m['pico']>=.62:P.append('pico')
        if m['sil_ini']>80 or m['sil_fim']>260:P.append('silêncio %d/%d'%(m['sil_ini'],m['sil_fim']))
        m['ok']=not P;m['por']='; '.join(P);R['%s_%d'%(lang,t)]=m
        print(lang,t,'OK ' if m['ok'] else 'ruim','m %d ms · nitidez %d Hz · cena %.3f · sim %.3f · tom %s · vol %.1f · dur %.2f | %s'%(m['nasal'],m['nit'],m['simc'],m['sim'],m['f0'],m['lufs'],m['dur'],m['por']),flush=True)
json.dump(R,open(D+'mb.json','w'),ensure_ascii=False,indent=0);print('créditos gastos até agora:',gasto())
