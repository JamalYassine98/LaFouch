import json,os,urllib.request,base64
K=os.environ['XI']
D={'pt':("A sweet, cute but professional young woman in her early twenties, native Brazilian Portuguese speaker from São Paulo with a neutral accent and perfect clear diction. Friendly, warm, gentle and smiling, like the host of a children's educational TV show. Bright, light and youthful tone, natural rhythm, never robotic, never old or raspy. Studio quality.",
 "Oi! Eu sou o Mochi. Vou te ajudar a achar o grau do seu óculos de leitura. Segure o celular a uns trinta centímetros, um palmo. Consegue ler a frase aqui na minha frente, sem esforço? Muito bem! Com a lente um e meio. Pronto! O grau que mais combina com você é dois e meio."),
 'es':("A sweet, cute but professional young woman in her early twenties, native Latin American Spanish speaker with a neutral accent and perfect clear diction. Friendly, warm, gentle and smiling, like the host of a children's educational TV show. Bright, light and youthful tone, natural rhythm, never robotic, never old or raspy. Studio quality.",
 "¡Hola! Soy Mochi. Te voy a ayudar a encontrar la graduación de tus lentes de lectura. Sostené el celular a unos treinta centímetros, un palmo. ¿Podés leer la frase acá frente a mí, sin esfuerzo? ¡Muy bien! Con la lente uno y medio. ¡Listo! La graduación que mejor te va es dos y medio.")}
res={}
for lang,(desc,txt) in D.items():
  body=json.dumps({'voice_description':desc,'text':txt,'model_id':'eleven_ttv_v3','auto_generate_text':False}).encode()
  rq=urllib.request.Request('https://api.elevenlabs.io/v1/text-to-voice/design?output_format=mp3_44100_128',data=body,headers={'xi-api-key':K,'Content-Type':'application/json'})
  try:
    with urllib.request.urlopen(rq,timeout=300) as r:d=json.loads(r.read());print(lang,'custo',r.headers.get('character-cost'))
  except urllib.error.HTTPError as e:print(lang,'erro',e.code,e.read()[:300]);continue
  res[lang]=[]
  for n,p in enumerate(d.get('previews',[]),1):
    f=f'/home/claude/Mochi_voz_nova_{lang.upper()}_{n}.mp3';open(f,'wb').write(base64.b64decode(p['audio_base_64']));res[lang].append(p['generated_voice_id']);print(' ',f)
json.dump(res,open('ids.json','w'))
