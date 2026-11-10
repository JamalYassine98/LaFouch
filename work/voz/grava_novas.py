# Amostra das frases novas (S89/S90/S91) com a voz Mochi PT. Uso: XI=<chave> python3 grava_novas.py   (chave só por variável de ambiente)
import json,os,sys,urllib.request,base64,subprocess
sys.path.insert(0,'/home/claude/voz_final');from bloco import frases,pcm,ponto_calmo,TRAT
import numpy as np
K=os.environ['XI'];VOZ='SvXoJJzLNRI3wECTYrmU';LIMITE=1000;D='/home/claude/voz_final/novas';gf=f'{D}/gasto.txt'
gasto=int(open(gf).read()) if os.path.exists(gf) else 0
CENAS=[['Antes, um aviso importante: este teste é só para óculos de leitura.','Não serve para miopia, astigmatismo nem multifocal, e não substitui o oftalmologista.'],
 ['Posso usar a câmera?','É só para medir a distância do celular até o seu rosto.','Nada é gravado.','Se preferir, a gente faz sem.'],
 ['É só tocar em "Permitir" na janelinha.','Obrigado!'],
 ['Tudo bem, sem problema!','Vamos sem a câmera: segure o celular a uns 30 centímetros, um palmo.'],
 ['Está um pouquinho escuro.','Vá para um lugar mais iluminado: com pouca luz a gente lê pior.'],
 ['Agora uma última coisa: aproxime o celular devagar e toque quando as letras começarem a embaçar.','Segure aí um instante…'],
 ['Ficou um pouco diferente.','Vamos repetir uma vez.','As duas medidas combinam.']]
fala=lambda k:k.replace('"','').replace('30 centímetros','trinta centímetros')
MAPA={};PROB=[];n=0
for c,lst in enumerate(CENAS):
  base=f'{D}/n{c:02d}';txt=' '.join(fala(k) for k in lst)
  if not os.path.exists(base+'.mp3'):
    if gasto+len(txt)>LIMITE:raise SystemExit(f'PARADO: passaria de {LIMITE} ({gasto})')
    body=json.dumps({'text':txt,'model_id':'eleven_v3','language_code':'pt','voice_settings':{'stability':0.5}}).encode()
    rq=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOZ}/with-timestamps?output_format=mp3_44100_128',data=body,headers={'xi-api-key':K,'Content-Type':'application/json'})
    with urllib.request.urlopen(rq,timeout=300) as r:d=json.loads(r.read());cc=int(r.headers.get('character-cost') or len(txt))
    open(base+'.mp3','wb').write(base64.b64decode(d['audio_base64']));json.dump(d['alignment'],open(base+'.json','w'));gasto+=cc;open(gf,'w').write(str(gasto))
  F=frases(json.load(open(base+'.json')))
  if len(F)!=len(lst):PROB.append((c,f'esperava {len(lst)}, veio {len(F)}'));continue
  x=pcm(base+'.mp3');dur=len(x)/16000;cortes=[0.0]
  for i in range(len(F)-1):cortes.append(ponto_calmo(x,max(F[i][2]-0.05,F[i][1]),min(F[i+1][1]+0.15,F[i+1][2])))
  cortes.append(dur)
  for i,k in enumerate(lst):
    o=f'pt5_{n:03d}.mp3';n+=1
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{cortes[i]:.3f}','-to',f'{cortes[i+1]:.3f}','-i',base+'.mp3','-af','silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse,afade=t=in:d=0.012,areverse,afade=t=in:d=0.02,areverse,'+TRAT,'-ar','44100','-ac','1','-b:a','128k',f'{D}/{o}'],check=True)
    MAPA[k]=o
json.dump(MAPA,open(f'{D}/lista.json','w'),ensure_ascii=False,indent=0)
print('frases',len(MAPA),'créditos',gasto,'problemas',PROB or 'nenhum')
