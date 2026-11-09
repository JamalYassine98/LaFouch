# Grava a voz do Mochi (plano pago): cada frase gravada sozinha (sem cortar lotes) e frases com grau inteiras.
# Uso: XI=<chave> python3 voz_gera2.py pt|es   — a chave só vem pela variável de ambiente, nunca fica em arquivo.
import json,os,sys,subprocess,re,urllib.request,time
sys.path.insert(0,'/home/claude');from voz_frases import *
ES_TR=json.load(open('/home/claude/voz_es.json'))
KEY=os.environ['XI'];VOZ='FGY2WhTYpPnrIDTdsKH5'
TAG={'pt':'[like a cute cartoon character][gently][calm][softly] ','es':'[Latin American Spanish accent][like a cute cartoon character][gently][calm][softly] '}
SOFT="atempo=0.94,lowpass=f=7500,deesser=i=0.4,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150,loudnorm=I=-18,apad=pad_dur=0.06"
def tts(texto,out,lang):
  body=json.dumps({'text':TAG[lang]+texto,'model_id':'eleven_v3','language_code':lang,'voice_settings':{'stability':0.5}}).encode()
  for k in range(3):
    try:
      rq=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOZ}?output_format=mp3_44100_128',data=body,headers={'xi-api-key':KEY,'Content-Type':'application/json'})
      with urllib.request.urlopen(rq,timeout=180) as r:open(out,'wb').write(r.read());return int(r.headers.get('character-cost') or 0)
    except urllib.error.HTTPError as e:
      m=e.read()[:300];print('erro',e.code,m,flush=True)
      if e.code in (401,402):raise
      time.sleep(3)
  raise SystemExit('falhou: '+texto)
def bordas(f):
  o=subprocess.run(['ffmpeg','-hide_banner','-i',f,'-af','silencedetect=noise=-45dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
  st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',o)];en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',o)]
  h,mi,se=re.findall(r'Duration: (\d+):(\d+):([\d.]+)',o)[0];dur=int(h)*3600+int(mi)*60+float(se)
  a=en[0] if st and st[0]<0.03 and en else 0.0
  b=st[-1] if st and len(st)>len(en) else dur  # silêncio que vai até o fim do arquivo
  return a,b
def processa(src,out):
  a,b=bordas(src)
  subprocess.run(['ffmpeg','-v','error','-y','-ss',str(max(0,a-0.05)),'-to',str(b+0.15),'-i',src,'-af',SOFT,'-ar','44100','-ac','1','-b:a','128k',out],check=True)
lang=sys.argv[1];tr=(lambda x:ES_TR[x]) if lang=='es' else (lambda x:x);es=lang=='es'
F={}  # chave exata (o que o site fala) → texto gravado
for f in FIX:
  for pt in parte(tr(f)):F[pt]=pt
pron=parte(tr(PRE['pronto']));F[pron[0]]=pron[0]
for g in G:
  w=gfala(g,es)
  F[tr(PRE['lente'])+' '+gf(g)+'.']=tr(PRE['lente'])+' '+w+'.'
  F[tr(PRE['esta'])+' '+gf(g)+'.']=tr(PRE['esta'])+' '+w+'.'
  F[pron[1]+' '+gf(g)+'.']=pron[1]+' '+w+'.'
D=f'/home/claude/voz_build3/{lang}';os.makedirs(D+'/raw',exist_ok=True);os.makedirs(D+'/out',exist_ok=True)
M={};custo=0;fal=[]
for i,(k,t) in enumerate(F.items()):
  nome=f'{lang}3_{i:03d}.mp3';raw=f'{D}/raw/{nome}';M[k]=nome
  if not os.path.exists(raw):custo+=tts(t,raw,lang)
  processa(raw,f'{D}/out/{nome}')
  if i%10==0:print(i,'/',len(F),'custo',custo,flush=True)
json.dump(M,open(f'{D}/out/lista.json','w'),ensure_ascii=False,indent=0)
print('pronto',len(M),'frases, custo',custo)
