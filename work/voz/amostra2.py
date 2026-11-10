import json,os,urllib.request,base64,sys
sys.path.insert(0,'/home/claude/voz_amostra');from corta import corta
import subprocess
KEY=os.environ['XI'];VOZ='FGY2WhTYpPnrIDTdsKH5';TAG='[warmly][calm] '
TX={'pt':"Leu! Agora vou tirando um pouquinho de grau, até achar o mais leve que ainda funciona. Com a lente zero setenta e cinco. Com a lente um e vinte e cinco. Esta é um e meio. Agora uma mais fraca. Pronto! O grau que mais combina com você é dois e meio.",
    'es':"¡Leíste! Ahora voy a ir sacando un poquito de graduación, hasta encontrar la más suave que todavía funciona. Con la lente cero setenta y cinco. Con la lente uno veinticinco. Esta es uno y medio. Ahora una más suave. ¡Listo! La graduación que mejor te va es dos y medio."}
for lang,txt in TX.items():
  body=json.dumps({'text':TAG+txt,'model_id':'eleven_v3','language_code':lang,'voice_settings':{'stability':0.5}}).encode()
  rq=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOZ}/with-timestamps?output_format=mp3_44100_128',data=body,headers={'xi-api-key':KEY,'Content-Type':'application/json'})
  with urllib.request.urlopen(rq,timeout=240) as r:d=json.loads(r.read());print(lang,'custo',r.headers.get('character-cost'))
  open(f'raw2_{lang}.mp3','wb').write(base64.b64decode(d['audio_base64']))
  fs=corta(f'raw2_{lang}.mp3',d['alignment'],f'q{lang}')
  for t,o in fs:print('  ',t)
  with open(f'l2{lang}.txt','w') as l:
    for t,o in fs:l.write(f"file '{o}'\nfile 'sil.mp3'\n")
  subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',f'l2{lang}.txt','-ar','44100','-ac','1','-b:a','128k',f'/home/claude/Mochi_amostra2_{lang.upper()}.mp3'],check=True)
