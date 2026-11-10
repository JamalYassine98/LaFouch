import json,os,urllib.request,base64
K=os.environ['XI'];VID='3vRJJjv6BIKZYw2NzOER'
txt="Oi! Eu sou o Mochi. Vou te ajudar a achar o grau do seu óculos de leitura. Segure o celular a uns trinta centímetros, um palmo. Consegue ler a frase aqui na minha frente, sem esforço? Muito bem! Com a lente um e meio. Pronto! O grau que mais combina com você é dois e meio."
desc="Keep exactly the same sweet, young, professional voice and personality, but she is now a native Brazilian Portuguese speaker from São Paulo with a neutral accent, perfect clear Brazilian diction, natural Brazilian R and word endings. Friendly and smiling, like a children's educational TV host. Not old, not raspy."
body=json.dumps({'voice_description':desc,'text':txt,'auto_generate_text':False}).encode()
rq=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-voice/{VID}/remix?output_format=mp3_44100_128',data=body,headers={'xi-api-key':K,'Content-Type':'application/json'})
try:
  with urllib.request.urlopen(rq,timeout=300) as r:d=json.loads(r.read())
except urllib.error.HTTPError as e:print('erro',e.code,e.read()[:400]);raise SystemExit
ids=[]
for n,p in enumerate(d.get('previews',[]),1):
  f=f'/home/claude/Mochi_voz_PT_remix_{n}.mp3';open(f,'wb').write(base64.b64decode(p['audio_base_64']));ids.append(p['generated_voice_id']);print(f)
json.dump(ids,open('ids_pt_remix.json','w'))
