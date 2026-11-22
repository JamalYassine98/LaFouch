# 22/11/2026: regrava a CENA do aviso do QR (3 frases, PT e ES). Dono 05:36/05:37: "quero o aviso inteiro", teto 8.000 créditos.
# Receita de docs/MOCHI-VOZ.md + âncora: a cena começa com a frase aprovada "Antes, um aviso importante: este teste…" (segura o tom
# da gravação original e é descartada). Uso: XI=<chave> python3 grava_aviso.py <tentativa>   — a chave só vem pela variável de ambiente.
import json,os,sys,re,subprocess,urllib.request,urllib.error,base64
sys.path.insert(0,'/home/claude/lafouch/work/voz');import numpy as np,librosa
K=os.environ['XI'];os.environ.setdefault('XI','x');from bloco import frases,pcm,ponto_calmo,TRAT
import voz
VOZ={'pt':'SvXoJJzLNRI3wECTYrmU','es':'3vRJJjv6BIKZYw2NzOER'};TETO=int(os.environ.get('TETO','2400'));D='/home/claude/voz_s430/';gf=D+'gasto.txt';SITE='/home/claude/catalogo/media/voz/'
CENA={'pt':['Antes, um aviso importante: este teste é só para óculos de leitura.','Este teste fica melhor no celular.','Aponte a câmera para este código…','ou seguimos aqui, como preferir.'],
      'es':['Antes, un aviso importante: este test es solo para lentes de lectura.','Este test sale mejor en el celular.','Apuntá la cámara a este código…','o seguimos acá, como prefieras.']}
ARQ={'pt':['pt5_000.mp3','pt8_000.mp3','pt8_001.mp3','pt8_002.mp3'],'es':['es7_044.mp3','es9_000.mp3','es9_001.mp3','es9_002.mp3']}
def gasto(): return int(open(gf).read()) if os.path.exists(gf) else 0
def grava(lang,txt,nome):
    g=gasto()
    if g+len(txt)>TETO: raise SystemExit('PARADO: passaria do teto (%d + %d > %d)'%(g,len(txt),TETO))
    body=json.dumps({'text':txt,'model_id':'eleven_v3','language_code':lang,'voice_settings':{'stability':0.5}}).encode()
    rq=urllib.request.Request('https://api.elevenlabs.io/v1/text-to-speech/%s/with-timestamps?output_format=mp3_44100_128'%VOZ[lang],data=body,headers={'xi-api-key':K,'Content-Type':'application/json'})
    try:
        with urllib.request.urlopen(rq,timeout=300) as r: d=json.loads(r.read());cc=int(r.headers.get('character-cost') or len(txt))
    except urllib.error.HTTPError as e: raise SystemExit('PARADO: o serviço recusou (%s): %s'%(e.code,e.read().decode('utf-8','replace')[:300]))
    open(nome+'.mp3','wb').write(base64.b64decode(d['audio_base64']));json.dump(d['alignment'],open(nome+'.json','w'));open(gf,'w').write(str(g+cc));return cc
def le(f,sr=22050):
    return np.frombuffer(subprocess.run(['ffmpeg','-v','quiet','-i',f,'-ac','1','-ar',str(sr),'-f','f32le','-'],capture_output=True).stdout,dtype=np.float32).copy()
def med(x,sr=22050):
    if len(x)<2000: return {}
    f0,_,_=librosa.pyin(x,fmin=150,fmax=600,sr=sr,hop_length=256);f=f0[~np.isnan(f0)]
    S=np.abs(librosa.stft(x,n_fft=1024,hop_length=256))**2;fr=librosa.fft_frequencies(sr=sr,n_fft=1024);e=S.sum(0);v=e>e.max()*.02
    return {'tom':round(float(np.median(f)),0) if len(f) else 0,'tom_max':round(float(np.percentile(f,95)),0) if len(f) else 0,'grave':round(float(10*np.log10(S[(fr>=80)&(fr<300)][:,v].sum()/S[:,v].sum()+1e-12)),1),
            'pico':round(float(np.abs(x).max()),2),'ini_ms':int(np.argmax(np.abs(x)>np.abs(x).max()*.05)/sr*1000)}
REF={}
def ref(lang):
    if lang not in REF:
        import glob
        fs=sorted(glob.glob(SITE+lang+'/'+('pt[4-7]_*.mp3' if lang=='pt' else 'es7_*.mp3')))[::7][:24];REF[lang]=np.mean([voz.emb(f) for f in fs],0)
    return REF[lang]
def tenta(lang,t):
    base=D+'%s_t%d'%(lang,t);lst=CENA[lang]
    if not os.path.exists(base+'.mp3'): print('  gravou',lang,t,'custo',grava(lang,' '.join(lst),base),flush=True)
    al=json.load(open(base+'.json'));F=frases(al)
    if len(F)!=4: return {'lang':lang,'t':t,'ok':False,'por':'a cena veio com %d frases'%len(F)}
    x=pcm(base+'.mp3');cortes=[0.0]
    for i in range(3): cortes.append(ponto_calmo(x,max(F[i][2]-0.05,F[i][1]),min(F[i+1][1]+0.15,F[i+1][2])))
    cortes.append(len(x)/16000);R={'lang':lang,'t':t,'fr':[]}
    for i in range(4):
        o=base+'_%d.mp3'%i
        subprocess.run(['ffmpeg','-v','error','-y','-ss','%.3f'%cortes[i],'-to','%.3f'%cortes[i+1],'-i',base+'.mp3','-af','silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse,afade=t=in:d=0.012,areverse,afade=t=in:d=0.02,areverse,'+TRAT,'-ar','44100','-ac','1','-b:a','128k',o],check=True)
        m=med(le(o));m['sim']=round(float(voz.sim(voz.emb(o),ref(lang))),3);m['dur']=round(len(le(o))/22050,2);m['arq']=o;m['txt']=lst[i];R['fr'].append(m)
    # o trecho "este teste/test" da fala nova (pelos tempos de cada letra) × o mesmo trecho da fala aprovada
    ch=''.join(al['characters']);k=ch.index('Este tes');fim=k+len('Este teste' if lang=='pt' else 'Este test');xs=le(base+'.mp3')
    R['este']=med(xs[int(al['character_start_times_seconds'][k]*22050):int(al['character_end_times_seconds'][fim-1]*22050)])
    return R
if __name__=='__main__':
    t=int(sys.argv[1]);so=sys.argv[2:] or ['pt','es'];M=json.load(open(D+'medidas.json')) if os.path.exists(D+'medidas.json') else {}
    for lang in so: M['%s|%d'%(lang,t)]=tenta(lang,t)
    json.dump(M,open(D+'medidas.json','w'),ensure_ascii=False,indent=0);print('créditos gastos:',gasto(),'de',TETO)
