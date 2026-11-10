# Grava o roteiro em cenas com as vozes fixas do Mochi, corta cada frase no ponto mais silencioso e confere tudo.
# Uso: XI=<chave> python3 grava_tudo.py pt|es   (chave só por variável de ambiente)
import json,os,sys,urllib.request,base64,subprocess,re
sys.path.insert(0,'/home/claude/voz_final');from cenas import *;from bloco import frases,pcm,ponto_calmo,TRAT
import numpy as np
K=os.environ['XI'];VOZ={'pt':'SvXoJJzLNRI3wECTYrmU','es':'3vRJJjv6BIKZYw2NzOER'};LIMITE=1800
lang=sys.argv[1];es=lang=='es';ES=json.load(open('/home/claude/voz_final/es.json'))
D=f'/home/claude/voz_final/{lang}';os.makedirs(D,exist_ok=True);gasto_f=f'{D}/gasto.txt'
gasto=int(open(gasto_f).read()) if os.path.exists(gasto_f) else 0
def chave_es(k):
  m=re.match(r'^(Com a lente|Esta é|O grau que mais combina com você é) (\+\d\.\d\d)\.$',k)
  if m:
    pre={'Com a lente':ES['Com a lente'],'Esta é':ES['Esta é'],'O grau que mais combina com você é':ES['Pronto! O grau que mais combina com você é'].split(' ',1)[1]}[m.group(1)]
    return pre+' '+m.group(2)+'.'
  return ES[k]
def falado(k):
  k2=chave_es(k) if es else k
  m=re.search(r'\+(\d\.\d\d)\.$',k2)
  if m:k2=k2[:m.start()]+gfala(float(m.group(1)),es)+'.'
  return k2.replace('30 centímetros','treinta centímetros' if es else 'trinta centímetros').lstrip('…')
def grava(txt,nome):
  global gasto
  if os.path.exists(nome+'.mp3'):return
  if gasto+len(txt)*0.6>LIMITE:raise SystemExit(f'PARADO antes de gravar: passaria do limite de {LIMITE} créditos neste idioma ({gasto} gastos)')
  body=json.dumps({'text':txt,'model_id':'eleven_v3','language_code':lang,'voice_settings':{'stability':0.5}}).encode()
  rq=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOZ[lang]}/with-timestamps?output_format=mp3_44100_128',data=body,headers={'xi-api-key':K,'Content-Type':'application/json'})
  with urllib.request.urlopen(rq,timeout=300) as r:d=json.loads(r.read());c=int(r.headers.get('character-cost') or len(txt))
  open(nome+'.mp3','wb').write(base64.b64decode(d['audio_base64']));json.dump(d['alignment'],open(nome+'.json','w'))
  gasto+=c;open(gasto_f,'w').write(str(gasto))
  if gasto>LIMITE:raise SystemExit(f'PARADO: passou de {LIMITE} créditos ({gasto})')
def confere(arq,txt):
  x=pcm(arq);dur=len(x)/16000;w=160;e=[float(np.sqrt(np.mean(x[k*w:(k+1)*w]**2))) for k in range(len(x)//w)]
  ini=e[0] if e else 1;fim=max(e[-3:]) if e else 1;pico=float(np.max(np.abs(x))) if len(x) else 0
  falta=[]
  if ini>0.05:falta.append('começo alto')
  if fim>0.02:falta.append('fim alto (cortada?)')
  ms=dur*1000/max(1,len(txt))
  if ms<35 or ms>190:falta.append(f'duração estranha {dur:.1f}s')
  if pico>0.75:falta.append('volume alto')
  return falta
itens=[]  # (cena, [(chave_site, falar)])
for n,c in enumerate(CENAS):itens.append((f'c{n:02d}',[((it if isinstance(it,str) else it[0]),) for it in c]))
for g in GR:itens.append((f'g{int(g*100):03d}',[(k,) if t else (k,'só contexto') for k,t,_ in cena_grau(g)]))
MAPA={};PROB=[];n_arq=0
for nome,lst in itens:
  chaves=[x[0] for x in lst];fal=[falado(k) for k in chaves]
  base=f'{D}/{nome}';grava(' '.join(fal),base)
  F=frases(json.load(open(base+'.json')))
  if len(F)!=len(lst):PROB.append((nome,f'esperava {len(lst)} frases, veio {len(F)}'));continue
  x=pcm(base+'.mp3');dur=len(x)/16000;cortes=[0.0]
  for i in range(len(F)-1):cortes.append(ponto_calmo(x,max(F[i][2]-0.05,F[i][1]),min(F[i+1][1]+0.15,F[i+1][2])))
  cortes.append(dur)
  for i,it in enumerate(lst):
    if len(it)>1:continue
    k=chaves[i];ks=chave_es(k) if es else k
    if ks in MAPA:continue
    o=f'{lang}4_{n_arq:03d}.mp3';n_arq+=1
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{cortes[i]:.3f}','-to',f'{cortes[i+1]:.3f}','-i',base+'.mp3','-af','silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse,afade=t=in:d=0.012,areverse,afade=t=in:d=0.02,areverse,'+TRAT,'-ar','44100','-ac','1','-b:a','128k',f'{D}/{o}'],check=True)
    p=confere(f'{D}/{o}',fal[i])
    if p:PROB.append((ks,p))
    MAPA[ks]=o
json.dump(MAPA,open(f'{D}/lista.json','w'),ensure_ascii=False,indent=0)
print(lang,'frases:',len(MAPA),'créditos gastos:',gasto);print('problemas:',PROB if PROB else 'nenhum')
