# Grava um bloco do roteiro em conversa (voz fixa do Mochi), corta cada frase pelos tempos exatos de cada letra
import json,os,urllib.request,base64,subprocess,re,sys
K=os.environ['XI'];VOZ={'pt':'SvXoJJzLNRI3wECTYrmU','es':'3vRJJjv6BIKZYw2NzOER'}
TRAT="acompressor=threshold=-22dB:ratio=3:attack=5:release=120:makeup=1,loudnorm=I=-18:TP=-3:LRA=7,alimiter=limit=0.6,apad=pad_dur=0.06"
def grava(lang,txt,nome):
  body=json.dumps({'text':txt,'model_id':'eleven_v3','language_code':lang,'voice_settings':{'stability':0.5}}).encode()
  rq=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOZ[lang]}/with-timestamps?output_format=mp3_44100_128',data=body,headers={'xi-api-key':K,'Content-Type':'application/json'})
  with urllib.request.urlopen(rq,timeout=300) as r:d=json.loads(r.read());c=r.headers.get('character-cost')
  open(nome+'.mp3','wb').write(base64.b64decode(d['audio_base64']));json.dump(d['alignment'],open(nome+'.json','w'));return c
def frases(al):
  ch=''.join(al['characters']);st=al['character_start_times_seconds'];en=al['character_end_times_seconds'];out=[];i=0
  for m in re.finditer(r'[.!?…](?=\s|$)',ch):
    j=m.start()
    while i<len(ch) and ch[i].isspace():i+=1
    out.append((ch[i:j+1],st[i],en[j]));i=j+1
  return out
def corta(nome,pref):
  F=frases(json.load(open(nome+'.json')));fs=[]
  for n,(t,a,b) in enumerate(F):
    prox=F[n+1][1] if n+1<len(F) else b+0.5
    o=f'{pref}_{n:02d}.mp3';subprocess.run(['ffmpeg','-v','error','-y','-ss',str(max(0,a-0.06)),'-to',str(min(prox-0.02,b+0.2)),'-i',nome+'.mp3','-af',TRAT,'-ar','44100','-ac','1','-b:a','128k',o],check=True);fs.append((t,o))
  return fs
def junta(fs,saida):
  subprocess.run(['ffmpeg','-v','error','-y','-f','lavfi','-i','anullsrc=r=44100:cl=mono','-t','0.25','-b:a','128k','sil.mp3'],check=True)
  open('lista.txt','w').write(''.join(f"file '{o}'\nfile 'sil.mp3'\n" for t,o in fs))
  subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i','lista.txt','-ar','44100','-ac','1','-b:a','128k',saida],check=True)
if __name__=='__main__':
  B={'pt':"Oi! Eu sou o Mochi. Vou te ajudar a achar o grau do seu óculos de leitura. Quando quiser, é só tocar em Começar. Faz como eu: tire os óculos… e segure o celular a trinta centímetros, um palmo. Consegue ler a frase aqui na minha frente, sem esforço? Chegue o celular um pouquinho mais perto. Afaste um pouquinho o celular.",
     'es':"¡Hola! Soy Mochi. Te voy a ayudar a encontrar la graduación de tus lentes de lectura. Cuando quieras, solo tocá Empezar. Hacé como yo: sacate los lentes… y sostené el celular a treinta centímetros, un palmo. ¿Podés leer la frase acá frente a mí, sin esfuerzo? Acercá un poquito el celular. Alejá un poquito el celular."}
  for lang,txt in B.items():
    c=grava(lang,txt,f'b1_{lang}');fs=corta(f'b1_{lang}',f'b1{lang}');print(lang,'custo',c);[print('  ',t) for t,o in fs]
    junta(fs,f'/home/claude/Mochi_bloco1_{lang.upper()}.mp3')
