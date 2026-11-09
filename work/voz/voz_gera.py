import json,os,sys,subprocess,re,urllib.request
sys.path.insert(0,'/home/claude');from voz_frases import *
ES_TR=json.load(open('/home/claude/voz_es.json'))
KEY=os.environ.get('XI');VOZ='FGY2WhTYpPnrIDTdsKH5'
TAG={'pt':'[like a cute cartoon character][gently][calm][softly] ','es':'[Latin American Spanish accent][like a cute cartoon character][gently][calm][softly] '}
SOFT="atempo=0.94,lowpass=f=7500,deesser=i=0.4,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150"
def itens(lang):
  tr=(lambda x:ES_TR[x]) if lang=='es' else (lambda x:x)
  P=[]  # (texto falado, chave ou None)
  for f in FIX:
    for pt in parte(tr(f)):P.append(pt)
  pron=parte(tr(PRE['pronto']));P.append(pron[0])
  pre={'lente':tr(PRE['lente']),'esta':tr(PRE['esta']),'pronto':pron[1]}
  for k,v in pre.items():P.append(v+',')
  for g in G:P.append(gfala(g,lang=='es'))
  U=[];[U.append(x) for x in P if x not in U];return U,pre
def tts(texto,out,lang):
  body=json.dumps({'text':TAG[lang]+texto,'model_id':'eleven_v3','language_code':lang,'voice_settings':{'stability':0.5}}).encode()
  rq=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOZ}?output_format=mp3_44100_128',data=body,headers={'xi-api-key':KEY,'Content-Type':'application/json'})
  with urllib.request.urlopen(rq,timeout=180) as r:open(out,'wb').write(r.read());return int(r.headers.get('character-cost') or 0)
def silencios(f):
  o=subprocess.run(['ffmpeg','-hide_banner','-i',f,'-af','silencedetect=noise=-42dB:d=0.32','-f','null','-'],capture_output=True,text=True).stderr
  st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',o)];en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',o)]
  dur=float(re.findall(r'Duration: (\d+):(\d+):([\d.]+)',o)[0][2])+60*float(re.findall(r'Duration: (\d+):(\d+):([\d.]+)',o)[0][1])
  return st,en,dur
def corta(f,n,textos=None):
  st,en,dur=silencios(f);S=[(s,e) for s,e in zip(st,en) if s>0.05 and e<dur-0.05]
  if len(S)<n-1:return None
  S=sorted(sorted(S,key=lambda x:x[0]-x[1])[:n-1])
  a=en[0] if st and st[0]<=0.05 else 0.0;segs=[]
  for s,e in S:segs.append((a,s));a=e
  z=st[-1] if st and en[-1]>=dur-0.05 and st[-1]>a else dur;segs.append((a,z))
  if textos:
    tot=sum(b-a for a,b in segs);tl=sum(len(t) for t in textos)
    for (a,b),t in zip(segs,textos):
      r=((b-a)/tot)/(len(t)/tl)
      if r<0.45 or r>2.2:return None
  return segs
def processa(src,ini,fim,out):
  subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-ss',str(max(0,ini-0.04)),'-to',str(fim+0.06),'-af',SOFT+',loudnorm=I=-18,apad=pad_dur=0.04','-ar','44100','-ac','1','-b:a','128k',out],check=True)
if __name__=='__main__':
  modo=sys.argv[1];lang=sys.argv[2]
  U,pre=itens(lang)
  if modo=='conta':
    print(lang,len(U),'peças',sum(len(x) for x in U),'letras');sys.exit()
  D=f'/home/claude/voz_build/{lang}';os.makedirs(D+'/raw',exist_ok=True);os.makedirs(D+'/out',exist_ok=True)
  idx={t:f'{lang}{i:03d}.mp3' for i,t in enumerate(U)}
  feito={x for x in os.listdir(D+'/out')}
  pend=[t for t in U if idx[t] not in feito];custo=0;CH=7
  for c in range(0,len(pend),CH):
    grupo=pend[c:c+CH];raw=f'{D}/raw/c{c:03d}.mp3'
    custo+=tts('\n\n'.join(grupo),raw,lang);segs=corta(raw,len(grupo),grupo)
    if segs:
      for t,(a,b) in zip(grupo,segs):processa(raw,a,b,f'{D}/out/{idx[t]}')
      print('lote ok',len(grupo),custo,flush=True)
    else:
      print('lote não dividiu, gerando uma a uma',flush=True)
      for t in grupo:
        r1=f'{D}/raw/u_{idx[t]}';custo+=tts(t,r1,lang);st,en,dur=silencios(r1)
        a=en[0] if st and st[0]<0.05 and en else 0.0;b=st[-1] if st and st[-1]>a+0.2 and (not en or en[-1]>=dur-0.05) else dur
        processa(r1,a,b,f'{D}/out/{idx[t]}')
      print('uma a uma ok',custo,flush=True)
  # mapa frase → arquivo(s)
  tr=(lambda x:ES_TR[x]) if lang=='es' else (lambda x:x)
  M={}
  for f in FIX:
    for pt in parte(tr(f)):M[pt]=idx[pt]
  pron=parte(tr(PRE['pronto']));M[pron[0]]=idx[pron[0]]
  for g in G:
    gg=idx[gfala(g,lang=='es')]
    M[pre['lente']+' '+gf(g)+'.']=[idx[pre['lente']+','],gg];M[pre['esta']+' '+gf(g)+'.']=[idx[pre['esta']+','],gg];M[pre['pronto']+' '+gf(g)+'.']=[idx[pre['pronto']+','],gg]
  json.dump(M,open(f'{D}/out/lista.json','w'),ensure_ascii=False,indent=0);print('custo total',custo,'chaves',len(M))
