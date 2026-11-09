import json,os,urllib.request,base64,sys
KEY=os.environ['XI'];VOZ='FGY2WhTYpPnrIDTdsKH5'
TXT="Oi! Eu sou o Mochi. Vou te ajudar a achar o grau do seu óculos de leitura. Faz como eu: tire os óculos… e segure o celular a 30 centímetros, um palmo. Consegue ler a frase aqui na minha frente, sem esforço? Tudo bem, é normal. Com a lente mais um e meio. Consegue ler a última frase?"
V={'A':'[like a cute cartoon character][gently][calm][softly] ','B':'[warmly][calm] '}
for k,tag in V.items():
  body=json.dumps({'text':tag+TXT,'model_id':'eleven_v3','language_code':'pt','voice_settings':{'stability':0.5}}).encode()
  rq=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOZ}/with-timestamps?output_format=mp3_44100_128',data=body,headers={'xi-api-key':KEY,'Content-Type':'application/json'})
  with urllib.request.urlopen(rq,timeout=240) as r:
    d=json.loads(r.read());cost=r.headers.get('character-cost')
  open(f'raw_{k}.mp3','wb').write(base64.b64decode(d['audio_base64']));json.dump(d.get('alignment') or d.get('normalized_alignment'),open(f'al_{k}.json','w'))
  print(k,'custo',cost,'tem tempos:',bool(d.get('alignment')))
